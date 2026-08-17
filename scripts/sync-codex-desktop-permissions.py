#!/usr/bin/env python3
"""Keep Codex Desktop's host selection aligned with Dots permissions."""

import argparse
import datetime
import json
import os
from pathlib import Path
import re
import shutil
import stat
import sys
import tempfile


SELECTION_KEY = "permission-selection-by-host-id:local"
BUILTIN_SELECTIONS = {
    ":read-only": {"kind": "agent-mode", "agentMode": "read-only"},
    ":workspace": {"kind": "agent-mode", "agentMode": "auto"},
    ":danger-full-access": {
        "kind": "agent-mode",
        "agentMode": "full-access",
    },
}
DEFAULT_PERMISSIONS_RE = re.compile(
    r'^\s*default_permissions\s*=\s*"([^"]+)"', re.MULTILINE
)


class StateError(Exception):
    pass


def read_default_permissions(source: Path) -> str:
    match = DEFAULT_PERMISSIONS_RE.search(source.read_text(encoding="utf-8"))
    profile = match.group(1) if match else None
    if profile is None:
        raise StateError("default_permissions is missing")
    return profile


def desired_selection(profile: str) -> dict:
    return BUILTIN_SELECTIONS.get(
        profile,
        {"kind": "profile", "profileId": profile},
    )


def selection_label(selection: dict) -> str:
    if selection.get("kind") == "profile":
        return selection["profileId"]
    return selection["agentMode"]


def read_state(path: Path) -> dict:
    try:
        state = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise StateError("cannot read {}: {}".format(path, error))
    if not isinstance(state, dict):
        raise StateError("{} does not contain a JSON object".format(path))
    return state


def current_selection(state: dict):
    atoms = state.get("electron-persisted-atom-state")
    if not isinstance(atoms, dict):
        return None
    return atoms.get(SELECTION_KEY)


def next_backup_path(target: Path) -> Path:
    stamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    candidate = Path("{}.bak.{}".format(target, stamp))
    suffix = 1
    while os.path.lexists(str(candidate)):
        candidate = Path("{}.bak.{}.{}".format(target, stamp, suffix))
        suffix += 1
    return candidate


def atomic_write(path: Path, state: dict, mode: int) -> None:
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=".{}.".format(path.name), dir=str(path.parent)
    )
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as temporary:
            json.dump(state, temporary, separators=(",", ":"))
            temporary.write("\n")
            temporary.flush()
            os.fsync(temporary.fileno())
        os.chmod(temporary_name, mode)
        os.replace(temporary_name, str(path))
    finally:
        if os.path.exists(temporary_name):
            os.unlink(temporary_name)


def run(
    operation: str,
    source: Path,
    state_path: Path,
    dry_run: bool,
    desktop_running: bool,
) -> int:
    desired = desired_selection(read_default_permissions(source))
    if not state_path.exists():
        print("No Codex Desktop permission state")
        return 0

    state = read_state(state_path)
    selection = current_selection(state)
    if selection is None or selection == desired:
        print("Current Codex Desktop permission selection")
        return 0

    if operation == "status":
        print("Drift {} permission selection differs".format(state_path))
        return 1
    if dry_run:
        print(
            "Would align Codex Desktop permission selection to {}".format(
                selection_label(desired)
            )
        )
        return 0
    if desktop_running:
        raise StateError(
            "ChatGPT is running and can overwrite its permission state; "
            "quit ChatGPT and rerun scripts/sync-configs.sh --codex"
        )

    atoms = state.setdefault("electron-persisted-atom-state", {})
    atoms[SELECTION_KEY] = desired
    backup = next_backup_path(state_path)
    shutil.copy2(str(state_path), str(backup))
    mode = stat.S_IMODE(state_path.stat().st_mode)
    atomic_write(state_path, state, mode)
    print("Backed up {} -> {}".format(state_path, backup))
    print(
        "Aligned Codex Desktop permission selection to {}".format(
            selection_label(desired)
        )
    )
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("operation", choices=("status", "apply"))
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--state", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--desktop-running", action="store_true")
    args = parser.parse_args()
    if args.dry_run and args.operation != "apply":
        parser.error("--dry-run is only valid with apply")
    return args


def main() -> int:
    args = parse_args()
    try:
        return run(
            args.operation,
            args.source,
            args.state,
            args.dry_run,
            args.desktop_running,
        )
    except (OSError, StateError) as error:
        print("Error: {}".format(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
