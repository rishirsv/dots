#!/usr/bin/env python3
"""Copy Claude Code's access token to CLIProxyAPI without its refresh token."""

import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone


def current_oauth():
    raw = subprocess.check_output(
        ["/usr/bin/security", "find-generic-password", "-s", "Claude Code-credentials", "-w"],
        text=True,
    )
    return json.loads(raw)["claudeAiOauth"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--refresh", action="store_true", help="let Claude Code renew an expiring token")
    args = parser.parse_args()
    oauth = current_oauth()
    now_ms = datetime.now(timezone.utc).timestamp() * 1000
    if args.refresh and oauth["expiresAt"] <= now_ms + 300_000:
        claude = os.environ.get("CLAUDE_CLI") or shutil.which("claude")
        if not claude:
            raise SystemExit("Claude CLI is unavailable; cannot renew its access token")
        try:
            subprocess.run(
                [claude, "-p", "", "--model", "haiku", "--max-turns", "1", "--no-session-persistence"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=90,
            )
        except subprocess.TimeoutExpired:
            raise SystemExit("Claude CLI token renewal timed out")
        oauth = current_oauth()
    token = oauth["accessToken"]
    expiry_ms = oauth["expiresAt"]
    if expiry_ms <= datetime.now(timezone.utc).timestamp() * 1000:
        raise SystemExit("Claude Code access token has expired; run Claude Code to refresh it")

    destination = Path.home() / ".cli-proxy-api" / "claude-from-cli.json"
    existing = json.loads(destination.read_text()) if destination.exists() else {}
    expiry = datetime.fromtimestamp(expiry_ms / 1000, timezone.utc).isoformat().replace("+00:00", "Z")
    if (
        existing.get("access_token") == token
        and existing.get("expired") == expiry
        and "refresh_token" not in existing
    ):
        return

    # Keep CLIProxyAPI's account and device metadata when an existing auth file has it.
    data = {key: value for key, value in existing.items() if key != "refresh_token"}
    data.update(
        type="claude",
        access_token=token,
        expired=expiry,
        last_refresh=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    )
    destination.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=".claude-from-cli-", dir=destination.parent)
    try:
        os.fchmod(fd, 0o600)
        with os.fdopen(fd, "w") as output:
            json.dump(data, output)
            output.write("\n")
        os.replace(temporary, destination)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


if __name__ == "__main__":
    main()
