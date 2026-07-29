#!/usr/bin/env python3
"""Sync Dots-owned Codex settings without owning the whole live config."""

import argparse
import datetime
import os
from pathlib import Path
import re
import shutil
import stat
import sys
import tempfile
from typing import List, Optional, Sequence, Tuple


BEGIN_MARKER = "# >>> Dots portable Codex config >>>"
END_MARKER = "# <<< Dots portable Codex config <<<"

LOCAL_TOP_LEVEL_KEYS = {"approval_policy", "sandbox_mode", "notify"}
LOCAL_TABLE_PREFIXES = (
    ("apps", "_default"),
    ("projects",),
    ("marketplaces",),
    ("mcp_servers",),
    ("tui", "model_availability_nux"),
    ("hooks", "state"),
    ("shell_environment_policy",),
)
PORTABLE_TABLE_EXCEPTIONS = (("mcp_servers", "openaiDeveloperDocs"),)

ASSIGNMENT_RE = re.compile(r"^([A-Za-z0-9_-]+)\s*=")


class ConfigError(Exception):
    pass


def canonical_portable(text: str) -> str:
    return text.rstrip() + "\n"


def marker_indexes(lines: Sequence[str]) -> Optional[Tuple[int, int]]:
    begins = [
        index
        for index, line in enumerate(lines)
        if line.rstrip("\r\n") == BEGIN_MARKER
    ]
    ends = [
        index
        for index, line in enumerate(lines)
        if line.rstrip("\r\n") == END_MARKER
    ]
    if not begins and not ends:
        return None
    if len(begins) != 1 or len(ends) != 1 or begins[0] >= ends[0]:
        raise ConfigError("live config has malformed or duplicate Dots markers")
    return begins[0], ends[0]


def extract_marker(text: str) -> Optional[str]:
    lines = text.splitlines(keepends=True)
    indexes = marker_indexes(lines)
    if indexes is None:
        return None
    begin, end = indexes
    return canonical_portable("".join(lines[begin + 1 : end]))


def remove_marker(text: str) -> str:
    lines = text.splitlines(keepends=True)
    indexes = marker_indexes(lines)
    if indexes is None:
        return text
    begin, end = indexes
    return "".join(lines[:begin] + lines[end + 1 :])


def table_path(header: str) -> Tuple[str, ...]:
    stripped = header.strip()
    if stripped.startswith("[[") and stripped.endswith("]]"):
        body = stripped[2:-2]
    elif stripped.startswith("[") and stripped.endswith("]"):
        body = stripped[1:-1]
    else:
        raise ConfigError("invalid TOML table header: {}".format(header.rstrip()))

    parts: List[str] = []
    current: List[str] = []
    quote: Optional[str] = None
    escaped = False
    for character in body:
        if quote is not None:
            if quote == '"' and escaped:
                current.append(character)
                escaped = False
            elif quote == '"' and character == "\\":
                escaped = True
            elif character == quote:
                quote = None
            else:
                current.append(character)
        elif character in ("'", '"'):
            quote = character
        elif character == ".":
            parts.append("".join(current).strip())
            current = []
        else:
            current.append(character)
    if quote is not None:
        raise ConfigError("unterminated quote in TOML table header")
    parts.append("".join(current).strip())
    return tuple(parts)


def is_table_header(line: str) -> bool:
    stripped = line.strip()
    return (
        (stripped.startswith("[") and stripped.endswith("]"))
        or (stripped.startswith("[[") and stripped.endswith("]]"))
    )


def split_toml(text: str) -> Tuple[List[str], List[Tuple[Tuple[str, ...], List[str]]]]:
    lines = text.splitlines(keepends=True)
    header_indexes = [index for index, line in enumerate(lines) if is_table_header(line)]
    if not header_indexes:
        return lines, []

    root = lines[: header_indexes[0]]
    tables: List[Tuple[Tuple[str, ...], List[str]]] = []
    for position, start in enumerate(header_indexes):
        end = (
            header_indexes[position + 1]
            if position + 1 < len(header_indexes)
            else len(lines)
        )
        tables.append((table_path(lines[start]), lines[start:end]))
    return root, tables


def starts_with(path: Tuple[str, ...], prefix: Tuple[str, ...]) -> bool:
    return path[: len(prefix)] == prefix


def is_local_table(path: Tuple[str, ...]) -> bool:
    if any(starts_with(path, prefix) for prefix in PORTABLE_TABLE_EXCEPTIONS):
        return False
    return any(starts_with(path, prefix) for prefix in LOCAL_TABLE_PREFIXES)


def local_root_chunks(root_lines: Sequence[str]) -> List[str]:
    starts: List[Tuple[int, str]] = []
    for index, line in enumerate(root_lines):
        match = ASSIGNMENT_RE.match(line)
        if match:
            starts.append((index, match.group(1)))

    chunks: List[str] = []
    for position, (start, key) in enumerate(starts):
        end = starts[position + 1][0] if position + 1 < len(starts) else len(root_lines)
        if key in LOCAL_TOP_LEVEL_KEYS:
            chunks.append("".join(root_lines[start:end]).rstrip() + "\n")
    return chunks


def local_content(text: str) -> Tuple[List[str], List[str]]:
    root, tables = split_toml(remove_marker(text))
    roots = local_root_chunks(root)
    local_tables = [
        "".join(lines).rstrip() + "\n"
        for path, lines in tables
        if is_local_table(path)
    ]
    return roots, local_tables


def validate_portable_source(text: str) -> None:
    if marker_indexes(text.splitlines(keepends=True)) is not None:
        raise ConfigError("tracked portable source must not contain Dots markers")

    root, tables = split_toml(text)
    local_keys = []
    for line in root:
        match = ASSIGNMENT_RE.match(line)
        if match and match.group(1) in LOCAL_TOP_LEVEL_KEYS:
            local_keys.append(match.group(1))
    local_paths = [".".join(path) for path, _ in tables if is_local_table(path)]
    if local_keys or local_paths:
        owned = sorted(set(local_keys + local_paths))
        raise ConfigError(
            "tracked portable source contains machine-local settings: {}".format(
                ", ".join(owned)
            )
        )


def compose_live(portable: str, existing: str) -> str:
    roots, tables = local_content(existing)
    parts: List[str] = []
    if roots:
        parts.append("\n".join(chunk.rstrip() for chunk in roots) + "\n\n")
    parts.append(BEGIN_MARKER + "\n")
    parts.append(canonical_portable(portable))
    parts.append(END_MARKER + "\n")
    if tables:
        parts.append("\n")
        parts.append("\n\n".join(table.rstrip() for table in tables) + "\n")
    return "".join(parts)


def path_exists(path: Path) -> bool:
    return os.path.lexists(str(path))


def read_target(path: Path) -> str:
    if path.is_dir():
        raise ConfigError("target is a directory: {}".format(path))
    try:
        return path.read_text(encoding="utf-8")
    except OSError as error:
        raise ConfigError("cannot read {}: {}".format(path, error))


def next_backup_path(target: Path) -> Path:
    stamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    candidate = Path("{}.bak.{}".format(target, stamp))
    suffix = 1
    while path_exists(candidate):
        candidate = Path("{}.bak.{}.{}".format(target, stamp, suffix))
        suffix += 1
    return candidate


def backup_target(target: Path) -> Path:
    backup = next_backup_path(target)
    shutil.copy2(str(target), str(backup))
    return backup


def atomic_write(path: Path, text: str, mode: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=".{}.".format(path.name), dir=str(path.parent)
    )
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as temporary:
            temporary.write(text)
            temporary.flush()
            os.fsync(temporary.fileno())
        os.chmod(temporary_name, mode)
        os.replace(temporary_name, str(path))
    finally:
        if os.path.exists(temporary_name):
            os.unlink(temporary_name)


def apply(source: Path, target: Path, dry_run: bool) -> int:
    portable = canonical_portable(source.read_text(encoding="utf-8"))
    validate_portable_source(portable)
    existing = read_target(target) if path_exists(target) else ""
    desired = compose_live(portable, existing)
    is_regular = target.is_file() and not target.is_symlink()
    current_mode = stat.S_IMODE(target.stat().st_mode) if is_regular else None

    if is_regular and existing == desired and current_mode == 0o600:
        print("Current {}".format(target))
        return 0

    if dry_run:
        if path_exists(target):
            print("Would back up {}".format(target))
        print("Would write {} as a regular 0600 file".format(target))
        return 0

    if path_exists(target):
        backup = backup_target(target)
        print("Backed up {} -> {}".format(target, backup))
    atomic_write(target, desired, 0o600)
    print("Applied portable Codex config to {}".format(target))
    return 0


def status(source: Path, target: Path) -> int:
    portable = canonical_portable(source.read_text(encoding="utf-8"))
    validate_portable_source(portable)
    if not path_exists(target):
        print("Missing {}".format(target))
        return 1
    if target.is_symlink():
        print("Drift {} is a symlink; apply must migrate it".format(target))
        return 1
    if not target.is_file():
        print("Drift {} is not a regular file".format(target))
        return 1

    live = read_target(target)
    marked = extract_marker(live)
    if marked is None:
        print("Drift {} has no portable marker block".format(target))
        return 1

    problems = []
    if marked != portable:
        problems.append("portable block differs")
    if stat.S_IMODE(target.stat().st_mode) != 0o600:
        problems.append("mode is not 0600")
    if problems:
        print("Drift {}: {}".format(target, "; ".join(problems)))
        return 1
    print("Current {}".format(target))
    return 0


def capture(source: Path, target: Path) -> int:
    if not path_exists(target):
        raise ConfigError("target does not exist: {}".format(target))
    if target.is_symlink() or not target.is_file():
        raise ConfigError("capture requires a regular live config: {}".format(target))

    marked = extract_marker(read_target(target))
    if marked is None:
        raise ConfigError("live config has no portable marker block: {}".format(target))
    validate_portable_source(marked)

    existing_mode = (
        stat.S_IMODE(source.stat().st_mode) if source.exists() else 0o644
    )
    existing = source.read_text(encoding="utf-8") if source.exists() else None
    if existing is not None and canonical_portable(existing) == marked:
        print("Current {}".format(source))
        return 0
    atomic_write(source, marked, existing_mode)
    print("Captured portable Codex config to {}".format(source))
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("operation", choices=("status", "apply", "capture"))
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--target", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    if args.dry_run and args.operation != "apply":
        parser.error("--dry-run is only valid with apply")
    return args


def main() -> int:
    args = parse_args()
    try:
        if args.operation == "apply":
            return apply(args.source, args.target, args.dry_run)
        if args.operation == "status":
            return status(args.source, args.target)
        return capture(args.source, args.target)
    except (ConfigError, OSError) as error:
        print("Error: {}".format(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
