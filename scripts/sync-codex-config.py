#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["tomlkit==0.13.3"]
# ///
"""Apply repo-owned Codex settings without replacing application-owned state."""

from __future__ import annotations

import argparse
import copy
import datetime
import os
from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path
import shutil
import stat
import subprocess
import sys
import tempfile
from typing import Any, Iterable, Optional, Tuple

import tomlkit
from tomlkit.exceptions import TOMLKitError


LEGACY_MARKERS = {
    "# >>> Dots portable Codex config >>>",
    "# <<< Dots portable Codex config <<<",
}

LOCAL_TOP_LEVEL_KEYS = {"notify", "service_tier"}
LOCAL_TABLE_PREFIXES = (
    ("projects",),
    ("marketplaces",),
    ("mcp_servers",),
    ("tui", "model_availability_nux"),
    ("hooks", "state"),
    ("shell_environment_policy",),
)
PORTABLE_TABLE_EXCEPTIONS = (("mcp_servers", "openaiDeveloperDocs"),)

KeyPath = Tuple[str, ...]
MISSING = object()


class ConfigError(Exception):
    pass


@dataclass(frozen=True)
class ConfigPlan:
    before: Optional[bytes]
    after: bytes
    changed_paths: Tuple[KeyPath, ...]
    repair_file: bool


def path_exists(path: Path) -> bool:
    return os.path.lexists(str(path))


def starts_with(path: KeyPath, prefix: KeyPath) -> bool:
    return path[: len(prefix)] == prefix


def is_local_path(path: KeyPath) -> bool:
    if len(path) == 1 and path[0] in LOCAL_TOP_LEVEL_KEYS:
        return True
    if any(starts_with(path, prefix) for prefix in PORTABLE_TABLE_EXCEPTIONS):
        return False
    return any(starts_with(path, prefix) for prefix in LOCAL_TABLE_PREFIXES)


def leaf_paths(value: Mapping[str, Any], prefix: KeyPath = ()) -> Iterable[KeyPath]:
    for key, child in value.items():
        path = prefix + (str(key),)
        if isinstance(child, Mapping) and child:
            yield from leaf_paths(child, path)
        else:
            yield path


def unwrapped(value: Any) -> Any:
    return value.unwrap() if hasattr(value, "unwrap") else value


def parse_document(text: str, label: str) -> Any:
    try:
        return tomlkit.parse(text)
    except TOMLKitError as error:
        raise ConfigError("invalid TOML in {}: {}".format(label, error)) from error


def without_legacy_markers(text: str) -> str:
    return "".join(
        line
        for line in text.splitlines(keepends=True)
        if line.rstrip("\r\n") not in LEGACY_MARKERS
    )


def validate_portable_source(source: Mapping[str, Any]) -> None:
    root_keys = set(source.keys())
    if {"default_permissions", "sandbox_mode"} <= root_keys:
        raise ConfigError(
            "tracked portable source cannot combine default_permissions with sandbox_mode"
        )

    local_paths = sorted(path for path in leaf_paths(source) if is_local_path(path))
    if local_paths:
        raise ConfigError(
            "tracked portable source contains machine-local settings: {}".format(
                ", ".join(".".join(path) for path in local_paths)
            )
        )


def remove_root(document: Mapping[str, Any], key: str, changed: list[KeyPath]) -> None:
    if key in document:
        del document[key]
        changed.append((key,))


def apply_compatibility_rules(
    source: Mapping[str, Any], live: Mapping[str, Any], changed: list[KeyPath]
) -> None:
    if "sandbox_mode" in source:
        remove_root(live, "default_permissions", changed)
        remove_root(live, "permissions", changed)
    elif "default_permissions" in source:
        remove_root(live, "sandbox_mode", changed)

    if "approvals_reviewer" not in source and "approvals_reviewer" in live:
        if unwrapped(live["approvals_reviewer"]) == "user":
            remove_root(live, "approvals_reviewer", changed)


def merge_settings(
    live: Mapping[str, Any],
    source: Mapping[str, Any],
    changed: list[KeyPath],
    prefix: KeyPath = (),
) -> None:
    for raw_key, source_value in source.items():
        key = str(raw_key)
        path = prefix + (key,)
        live_value = live.get(key, MISSING)
        if isinstance(source_value, Mapping):
            if live_value is MISSING:
                live[key] = copy.deepcopy(source_value)
                changed.extend(leaf_paths(source_value, path))
            elif not isinstance(live_value, Mapping):
                raise ConfigError(
                    "tracked table {} conflicts with a scalar in the live config".format(
                        ".".join(path)
                    )
                )
            else:
                merge_settings(live_value, source_value, changed, path)
        elif live_value is MISSING or unwrapped(live_value) != unwrapped(source_value):
            live[key] = copy.deepcopy(source_value)
            changed.append(path)


def read_target(path: Path) -> bytes:
    if path.is_dir():
        raise ConfigError("target is a directory: {}".format(path))
    try:
        return path.read_bytes()
    except OSError as error:
        raise ConfigError("cannot read {}: {}".format(path, error)) from error


def plan_config(source: Path, target: Path) -> ConfigPlan:
    source_text = source.read_text(encoding="utf-8")
    source_document = parse_document(source_text, str(source))
    validate_portable_source(source_document)

    before = read_target(target) if path_exists(target) else None
    live_text = before.decode("utf-8") if before is not None else ""
    live_document = parse_document(without_legacy_markers(live_text), str(target))

    changed: list[KeyPath] = []
    apply_compatibility_rules(source_document, live_document, changed)
    merge_settings(live_document, source_document, changed)
    after = tomlkit.dumps(live_document).encode("utf-8")

    regular = target.is_file() and not target.is_symlink()
    mode = stat.S_IMODE(target.stat().st_mode) if regular else None
    return ConfigPlan(
        before=before,
        after=after,
        changed_paths=tuple(dict.fromkeys(changed)),
        repair_file=not regular or mode != 0o600,
    )


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


def atomic_write(path: Path, data: bytes, mode: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=".{}.".format(path.name), dir=str(path.parent)
    )
    try:
        with os.fdopen(descriptor, "wb") as temporary:
            temporary.write(data)
            temporary.flush()
            os.fsync(temporary.fileno())
        os.chmod(temporary_name, mode)
        os.replace(temporary_name, str(path))
    finally:
        if os.path.exists(temporary_name):
            os.unlink(temporary_name)


def validate_codex_schema(text: str) -> None:
    executable = shutil.which("codex")
    if executable is None:
        raise ConfigError("cannot validate config because codex is not installed")

    with tempfile.TemporaryDirectory(prefix="dots-codex-schema-") as directory:
        home = Path(directory)
        config = home / "config.toml"
        config.write_text(text, encoding="utf-8")
        config.chmod(0o600)
        environment = os.environ.copy()
        environment["CODEX_HOME"] = str(home)
        result = subprocess.run(
            [executable, "app-server", "--strict-config", "--listen", "stdio://"],
            input="",
            text=True,
            capture_output=True,
            env=environment,
        )
    if result.returncode != 0:
        details = (result.stderr or result.stdout).strip()
        raise ConfigError("Codex strict schema validation failed:\n{}".format(details))


def changed_summary(paths: Tuple[KeyPath, ...]) -> str:
    return ", ".join(".".join(path) for path in paths)


def sync_config(
    source: Path,
    target: Path,
    operation: str,
    *,
    dry_run: bool = False,
) -> int:
    plan = plan_config(source, target)
    validate_codex_schema(plan.after.decode("utf-8"))

    problems = []
    if plan.changed_paths:
        problems.append("managed settings differ: " + changed_summary(plan.changed_paths))
    if plan.repair_file:
        problems.append("target must be a regular 0600 file")

    if operation == "status":
        if problems:
            print("Drift {}: {}".format(target, "; ".join(problems)))
            return 1
        print("Current {}".format(target))
        return 0

    if not problems:
        print("Current {}".format(target))
        return 0
    if dry_run:
        if plan.before is not None:
            print("Would back up {}".format(target))
        print("Would write {} as a regular 0600 file".format(target))
        return 0

    current = read_target(target) if path_exists(target) else None
    if current != plan.before:
        raise ConfigError("live config changed during sync; rerun after Codex is stable")
    if plan.before is not None:
        backup = backup_target(target)
        print("Backed up {} -> {}".format(target, backup))
    atomic_write(target, plan.after, 0o600)
    print("Applied managed Codex settings to {}".format(target))
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("operation", choices=("status", "apply"))
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
        return sync_config(
            args.source,
            args.target,
            args.operation,
            dry_run=args.dry_run,
        )
    except (ConfigError, OSError, UnicodeDecodeError) as error:
        print("Error: {}".format(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
