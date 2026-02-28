#!/usr/bin/env python3

from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import os
from dataclasses import dataclass
import glob
from pathlib import Path
import sys
import zipfile


@dataclass(frozen=True)
class BundleEntry:
    abs_path: Path
    rel_path: Path
    reason: str


DEFAULT_EXCLUDED_DIRS = {
    ".git",
    ".next",
    ".pytest_cache",
    ".turbo",
    "__pycache__",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "tmp",
}

DEFAULT_EXCLUDED_BASENAMES = {
    ".DS_Store",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build context.zip for Oracle (ChatGPT Pro) uploads.",
        formatter_class=argparse.RawTextHelpFormatter,
    )

    parser.add_argument(
        "--repo-root",
        default=".",
        help="Repository root (defaults to current directory).",
    )
    parser.add_argument(
        "--out",
        required=True,
        help="Output zip path (e.g., /path/to/context.zip).",
    )
    parser.add_argument(
        "--zip-root",
        default="context",
        help="Top-level folder name inside the zip (default: context).",
    )
    parser.add_argument(
        "--task",
        default="",
        help="Optional short task summary to include in the manifest.",
    )
    parser.add_argument(
        "--constraint",
        action="append",
        default=[],
        help="Optional constraint/preference line to include in the manifest (repeatable).",
    )
    parser.add_argument(
        "--verify",
        action="append",
        default=[],
        help="Optional local verification command/check to include in the manifest (repeatable).",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        default=[],
        help=(
            "Exclude paths that match a glob-style pattern (repeatable).\n"
            "Examples: --exclude \"**/*.snap\" --exclude \"**/node_modules/**\""
        ),
    )
    parser.add_argument(
        "--no-default-excludes",
        action="store_true",
        help="Disable built-in excludes (node_modules, dist, .git, etc.). Use with care.",
    )
    parser.add_argument(
        "--entry",
        action="append",
        default=[],
        help=(
            "File entry in the form PATH::REASON.\n"
            "PATH can be a file, a directory, or a glob.\n"
            "Repeatable.\n"
            "Example: --entry \"src/app.ts::Mentioned in stack trace\""
        ),
    )
    parser.add_argument(
        "--entries-from",
        default="",
        help="Optional path to a file with one PATH::REASON entry per line (comments with # allowed).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the manifest to stdout and exit without writing a zip.",
    )
    parser.add_argument(
        "--estimate-tokens",
        action="store_true",
        help="Estimate token count and warn if bundle exceeds common model limits.",
    )

    return parser.parse_args()


def _split_entry(raw: str) -> tuple[str, str]:
    if "::" in raw:
        path_str, reason = raw.split("::", 1)
        return path_str.strip(), reason.strip()
    return raw.strip(), ""


def _is_within(child: Path, parent: Path) -> bool:
    try:
        child.relative_to(parent)
        return True
    except ValueError:
        return False


def _to_posix(path: Path) -> str:
    return path.as_posix()


def _normalize_rel_for_match(rel_path: Path) -> str:
    # Match patterns against forward-slash paths for portability.
    return _to_posix(rel_path)


def _matches_any(path_for_match: str, patterns: list[str]) -> bool:
    return any(fnmatch.fnmatch(path_for_match, pattern) for pattern in patterns)


def _should_exclude(rel_path: Path, exclude_patterns: list[str], *, default_excludes_enabled: bool) -> bool:
    if default_excludes_enabled:
        parts = rel_path.parts
        if any(part in DEFAULT_EXCLUDED_DIRS for part in parts[:-1]):
            return True
        if rel_path.name in DEFAULT_EXCLUDED_BASENAMES:
            return True
    normalized = _normalize_rel_for_match(rel_path)
    return _matches_any(normalized, exclude_patterns)


def _looks_like_glob(path_str: str) -> bool:
    return any(char in path_str for char in ["*", "?", "["])


def _expand_glob(repo_root: Path, pattern: str) -> list[Path]:
    raw = pattern
    if Path(raw).is_absolute():
        matches = glob.glob(raw, recursive=True)
        return [Path(m).resolve() for m in matches]
    matches = glob.glob(str((repo_root / raw).resolve()), recursive=True)
    return [Path(m).resolve() for m in matches]


def _walk_dir(abs_dir: Path) -> list[Path]:
    return [p for p in abs_dir.rglob("*") if p.is_file()]


def build_entries(
    repo_root: Path,
    raw_entries: list[str],
    exclude_patterns: list[str],
    *,
    default_excludes_enabled: bool,
) -> list[BundleEntry]:
    repo_root = repo_root.resolve()

    entries: list[BundleEntry] = []
    for raw in raw_entries:
        path_str, reason = _split_entry(raw)
        if not path_str:
            continue
        expanded: list[Path] = []
        if _looks_like_glob(path_str):
            expanded = _expand_glob(repo_root, path_str)
            if not expanded:
                raise SystemExit(f"No matches for glob: {path_str}")
        else:
            abs_path = (repo_root / path_str).resolve() if not Path(path_str).is_absolute() else Path(path_str).resolve()
            if not abs_path.exists():
                raise SystemExit(f"Missing path: {abs_path}")
            expanded = _walk_dir(abs_path) if abs_path.is_dir() else [abs_path]

        # Keep expansion stable.
        expanded = sorted(set(expanded), key=lambda p: str(p).lower())

        for abs_path in expanded:
            if abs_path.name == "prompt.md":
                # Never include the generated prompt in context.zip.
                continue

            if not _is_within(abs_path, repo_root):
                raise SystemExit(f"Refusing to include file outside repo root: {abs_path}")

            if not abs_path.exists():
                raise SystemExit(f"Missing file: {abs_path}")

            if not abs_path.is_file():
                continue

            rel_path = abs_path.relative_to(repo_root)
            if _should_exclude(rel_path, exclude_patterns, default_excludes_enabled=default_excludes_enabled):
                continue

            entries.append(BundleEntry(abs_path=abs_path, rel_path=rel_path, reason=reason))

    # De-dupe by rel path (keep first reason; stable ordering)
    seen: set[Path] = set()
    deduped: list[BundleEntry] = []
    for entry in entries:
        if entry.rel_path in seen:
            continue
        seen.add(entry.rel_path)
        deduped.append(entry)

    return sorted(deduped, key=lambda e: str(e.rel_path).lower())


def _format_bytes(size: int) -> str:
    if size >= 1024 * 1024 * 1024:
        return f"{size / (1024 * 1024 * 1024):.2f} GB"
    if size >= 1024 * 1024:
        return f"{size / (1024 * 1024):.1f} MB"
    if size >= 1024:
        return f"{size / 1024:.1f} KB"
    return f"{size} B"


def _estimate_tokens(total_bytes: int) -> tuple[int, str]:
    """
    Estimate tokens using ~4 chars per token heuristic.
    Returns (estimated_tokens, warning_message or empty string).
    """
    estimated_tokens = total_bytes // 4

    warnings = []
    if estimated_tokens > 128_000:
        warnings.append("Exceeds GPT-4 Turbo 128K context limit")
    elif estimated_tokens > 100_000:
        warnings.append("Near GPT-4 Turbo limit; consider trimming")

    return estimated_tokens, "; ".join(warnings)


def render_manifest(
    repo_root: Path,
    entries: list[BundleEntry],
    *,
    task: str = "",
    constraints: list[str] | None = None,
    verify: list[str] | None = None,
    exclude_patterns: list[str] | None = None,
    default_excludes_enabled: bool = True,
) -> str:
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    repo_root_display = str(repo_root.resolve())
    constraints = constraints or []
    verify = verify or []
    exclude_patterns = exclude_patterns or []

    total_raw_bytes = 0
    sized_entries: list[tuple[BundleEntry, int]] = []
    for entry in entries:
        size_bytes = entry.abs_path.stat().st_size
        total_raw_bytes += size_bytes
        sized_entries.append((entry, size_bytes))
    largest = sorted(sized_entries, key=lambda pair: pair[1], reverse=True)[:5]

    lines: list[str] = []
    lines.append("# Oracle context manifest")
    lines.append("")
    lines.append(f"- Created (UTC): {now}")
    lines.append(f"- Repo root: {repo_root_display}")
    lines.append(f"- Files included: {len(entries)}")
    lines.append(f"- Total raw size (before zip): {_format_bytes(total_raw_bytes)}")
    lines.append("")

    task = task.strip()
    if task:
        lines.append("## Task summary")
        lines.append(task)
        lines.append("")

    cleaned_constraints = [c.strip() for c in constraints if c and c.strip()]
    if cleaned_constraints:
        lines.append("## Constraints / preferences")
        for constraint in cleaned_constraints:
            lines.append(f"- {constraint}")
        lines.append("")

    cleaned_verify = [c.strip() for c in verify if c and c.strip()]
    if cleaned_verify:
        lines.append("## How to verify locally")
        lines.append("If you want to confirm the advice locally, these checks/commands are relevant:")
        lines.append("")
        for command in cleaned_verify:
            lines.append(f"- `{command}`")
        lines.append("")

    cleaned_excludes = [p.strip() for p in exclude_patterns if p and p.strip()]
    if cleaned_excludes or DEFAULT_EXCLUDED_DIRS or DEFAULT_EXCLUDED_BASENAMES:
        lines.append("## Excludes applied")
        if default_excludes_enabled:
            if DEFAULT_EXCLUDED_DIRS:
                dirs = ", ".join(sorted(DEFAULT_EXCLUDED_DIRS))
                lines.append(f"- Default excluded directories: {dirs}")
            if DEFAULT_EXCLUDED_BASENAMES:
                basenames = ", ".join(sorted(DEFAULT_EXCLUDED_BASENAMES))
                lines.append(f"- Default excluded file names: {basenames}")
        else:
            lines.append("- Default excludes: disabled (`--no-default-excludes`).")
        if cleaned_excludes:
            lines.append("- Custom exclude patterns:")
            for pattern in cleaned_excludes:
                lines.append(f"  - `{pattern}`")
        lines.append("")

    if largest:
        lines.append("## Largest files (by raw size)")
        for entry, size_bytes in largest:
            lines.append(f"- `{entry.rel_path.as_posix()}` — {_format_bytes(size_bytes)}")
        lines.append("")

    lines.append("## Files")
    for entry in entries:
        reason = entry.reason.strip() or "Included as relevant context."
        lines.append(f"- `{entry.rel_path.as_posix()}` — {reason}")
    lines.append("")
    lines.append("## Notes")
    lines.append("- `prompt.md` is intentionally excluded; paste it separately into ChatGPT Pro.")
    lines.append("- Treat files as authoritative; prefer citing exact paths when making claims.")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    args = parse_args()

    repo_root = Path(args.repo_root).expanduser()
    out_path = Path(args.out).expanduser()
    zip_root = str(args.zip_root).strip().strip("/").strip()
    if not zip_root:
        raise SystemExit("--zip-root must not be empty")

    raw_entries: list[str] = list(args.entry or [])
    entries_from_path = str(args.entries_from or "").strip()
    if entries_from_path:
        entries_file = Path(entries_from_path).expanduser()
        if not entries_file.exists():
            raise SystemExit(f"--entries-from file not found: {entries_file}")
        for raw_line in entries_file.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            raw_entries.append(line)

    exclude_patterns = [p.strip() for p in (args.exclude or []) if p and p.strip()]
    default_excludes_enabled = not bool(args.no_default_excludes)

    entries = build_entries(
        repo_root,
        raw_entries,
        exclude_patterns,
        default_excludes_enabled=default_excludes_enabled,
    )
    if not entries:
        raise SystemExit("No files matched after expanding entries and applying excludes. Check --entry/--entries-from and --exclude.")

    # Token estimation (runs before zip creation so it works with --dry-run too)
    if args.estimate_tokens:
        total_bytes = sum(e.abs_path.stat().st_size for e in entries)
        est_tokens, warning = _estimate_tokens(total_bytes)
        print(f"Estimated tokens: ~{est_tokens:,}", file=sys.stderr)
        if warning:
            print(f"WARNING: {warning}", file=sys.stderr)

    # Create the zip deterministically.
    manifest = render_manifest(
        repo_root,
        entries,
        task=args.task,
        constraints=args.constraint,
        verify=args.verify,
        exclude_patterns=exclude_patterns,
        default_excludes_enabled=default_excludes_enabled,
    )

    if args.dry_run:
        print(manifest)
        return 0

    out_path.parent.mkdir(parents=True, exist_ok=True)

    zip_tmp = out_path
    with zipfile.ZipFile(zip_tmp, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zip_file:
        zip_file.writestr(f"{zip_root}/MANIFEST.md", manifest)

        for entry in entries:
            zip_name = f"{zip_root}/{entry.rel_path.as_posix()}"
            zip_file.write(entry.abs_path, arcname=zip_name)

    size_kb = os.path.getsize(out_path) / 1024
    print(f"Wrote: {out_path} ({size_kb:.1f} KB; {len(entries)} files)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
