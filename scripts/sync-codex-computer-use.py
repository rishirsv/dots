#!/usr/bin/env python3
"""Allow Dots-managed Computer Use to target normally forbidden apps."""

from __future__ import annotations

import argparse
from pathlib import Path
import subprocess
import sys


DEFAULTS = "/usr/bin/defaults"
DOMAINS = (
    "com.openai.sky.CUAService",
    "com.openai.sky.CUAService.cli",
)
KEY = "ComputerUseAllowForbiddenTargets"
HELPER = (
    Path.home()
    / ".codex/computer-use/Codex Computer Use.app/Contents/MacOS/"
    "SkyComputerUseService"
)


class SyncError(Exception):
    pass


def helper_supports_setting(path: Path) -> bool | None:
    if not path.exists():
        return None
    needle = KEY.encode("utf-8")
    overlap = len(needle) - 1
    previous = b""
    with path.open("rb") as binary:
        while chunk := binary.read(1024 * 1024):
            data = previous + chunk
            if needle in data:
                return True
            previous = data[-overlap:]
    return False


def read_setting(domain: str) -> bool | None:
    result = subprocess.run(
        [DEFAULTS, "read", domain, KEY],
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        return None
    value = result.stdout.strip().lower()
    if value in {"1", "true", "yes"}:
        return True
    if value in {"0", "false", "no"}:
        return False
    raise SyncError("unexpected {} value in {}: {!r}".format(KEY, domain, value))


def write_setting(domain: str) -> None:
    result = subprocess.run(
        [DEFAULTS, "write", domain, KEY, "-bool", "true"],
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        details = (result.stderr or result.stdout).strip()
        raise SyncError("cannot update {}: {}".format(domain, details))


def run(operation: str, dry_run: bool, helper: Path = HELPER) -> int:
    supported = helper_supports_setting(helper)
    if supported is False:
        raise SyncError(
            "installed Computer Use no longer exposes {}; audit the new build"
            .format(KEY)
        )

    current = {domain: read_setting(domain) for domain in DOMAINS}
    drifted = [domain for domain, value in current.items() if value is not True]
    if not drifted:
        print("Current Codex Computer Use forbidden-target override")
        return 0
    if operation == "status":
        print("Drift Codex Computer Use forbidden-target override differs")
        return 1
    if dry_run:
        print("Would allow Codex Computer Use to target forbidden apps")
        return 0

    for domain in drifted:
        write_setting(domain)
    if supported is None:
        print("Enabled Codex Computer Use forbidden targets before helper install")
    else:
        print("Enabled Codex Computer Use forbidden targets")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("operation", choices=("status", "apply"))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    if args.dry_run and args.operation != "apply":
        parser.error("--dry-run is only valid with apply")
    return args


def main() -> int:
    args = parse_args()
    try:
        return run(args.operation, args.dry_run)
    except (OSError, SyncError) as error:
        print("Error: {}".format(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
