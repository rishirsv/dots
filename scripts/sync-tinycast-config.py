#!/usr/bin/env python3
"""Apply or inspect the repo-owned Tinycast profile without copying private data."""

from __future__ import annotations

import argparse
import json
import os
import plistlib
import shutil
import sqlite3
import subprocess
import sys
import time
from pathlib import Path


BUNDLE_ID = "com.tinycast.app"
APP_SUPPORT = Path.home() / "Library/Application Support" / BUNDLE_ID
PREFERENCES = Path.home() / "Library/Preferences" / f"{BUNDLE_ID}.plist"


def load_defaults() -> dict[str, object]:
    result = subprocess.run(
        ["/usr/bin/defaults", "export", BUNDLE_ID, "-"],
        check=True,
        capture_output=True,
    )
    return plistlib.loads(result.stdout)


def write_default(key: str, value: object) -> None:
    command = ["/usr/bin/defaults", "write", BUNDLE_ID, key]
    if isinstance(value, bool):
        command += ["-bool", "true" if value else "false"]
    elif isinstance(value, int):
        command += ["-int", str(value)]
    elif isinstance(value, str):
        command += ["-string", value]
    elif isinstance(value, list) and all(isinstance(item, str) for item in value):
        command += ["-array", *value]
    else:
        raise TypeError(f"Unsupported default value for {key}: {value!r}")
    subprocess.run(command, check=True)


def extension_names() -> set[str]:
    root = APP_SUPPORT / "extensions"
    if not root.exists():
        return set()
    return {path.name for path in root.iterdir() if path.is_dir()}


def quicklink_count() -> int:
    database = APP_SUPPORT / "quicklinks.sqlite3"
    if not database.exists():
        return 0
    with sqlite3.connect(database) as connection:
        row = connection.execute("SELECT count(*) FROM quicklinks").fetchone()
    return int(row[0]) if row else 0


def differences(config: dict[str, object]) -> list[str]:
    live = load_defaults()
    wanted = dict(config["defaults"])
    wanted["boundAppBundleIDs"] = config["boundAppBundleIDs"]
    wanted["boundExtensionCommandEntryIDs"] = config["extensions"]["boundCommands"]
    problems = [key for key, value in wanted.items() if live.get(key) != value]
    if extension_names() != set(config["extensions"]["allowed"]):
        problems.append("installed extensions")
    if config["quicklinks"] == [] and quicklink_count() != 0:
        problems.append("quicklinks")
    return problems


def app_is_running() -> bool:
    return subprocess.run(["/usr/bin/pgrep", "-x", "Tinycast"], capture_output=True).returncode == 0


def stop_app() -> bool:
    running = app_is_running()
    if not running:
        return False
    subprocess.run(
        ["/usr/bin/osascript", "-e", 'tell application "Tinycast" to quit'], check=True
    )
    for _ in range(40):
        if not app_is_running():
            return True
        time.sleep(0.25)
    raise RuntimeError("Tinycast did not quit")


def backup_preferences() -> Path | None:
    if not PREFERENCES.exists():
        return None
    root = APP_SUPPORT / "backups" / time.strftime("%Y%m%d%H%M%S")
    root.mkdir(parents=True, exist_ok=True)
    shutil.copy2(PREFERENCES, root / PREFERENCES.name)
    return root


def apply(config: dict[str, object]) -> None:
    restart = stop_app()
    backup = backup_preferences()

    wanted = dict(config["defaults"])
    wanted["boundAppBundleIDs"] = config["boundAppBundleIDs"]
    wanted["boundExtensionCommandEntryIDs"] = config["extensions"]["boundCommands"]
    for key, value in wanted.items():
        write_default(key, value)

    live = load_defaults()
    allowed_commands = set(config["extensions"]["boundCommands"])
    for key in live:
        prefix = "hotkey.extensionCommand."
        if key.startswith(prefix) and key[len(prefix) :] not in allowed_commands:
            subprocess.run(["/usr/bin/defaults", "delete", BUNDLE_ID, key], check=True)

    allowed_extensions = set(config["extensions"]["allowed"])
    extension_root = APP_SUPPORT / "extensions"
    if extension_root.exists():
        removed_root = (backup or APP_SUPPORT / "backups" / time.strftime("%Y%m%d%H%M%S")) / "extensions"
        for path in extension_root.iterdir():
            if path.is_dir() and path.name not in allowed_extensions:
                removed_root.mkdir(parents=True, exist_ok=True)
                shutil.move(str(path), removed_root / path.name)

    if config["quicklinks"] == []:
        database = APP_SUPPORT / "quicklinks.sqlite3"
        if database.exists():
            with sqlite3.connect(database) as connection:
                connection.execute("DELETE FROM quicklinks")
                connection.commit()

    if restart:
        subprocess.run(["/usr/bin/open", "-a", "Tinycast"], check=True)

    suffix = f"; backup: {backup}" if backup else ""
    print(f"Applied Tinycast configuration{suffix}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("apply", "status"))
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    config = json.loads(args.config.read_text())
    problems = differences(config)
    if args.mode == "status":
        if problems:
            print("Tinycast drift: " + ", ".join(problems))
            return 1
        print("Current Tinycast configuration")
        return 0
    if args.dry_run:
        if problems:
            print("Would update Tinycast: " + ", ".join(problems))
        else:
            print("Would leave Tinycast unchanged")
        return 0
    apply(config)
    return 0


if __name__ == "__main__":
    sys.exit(main())
