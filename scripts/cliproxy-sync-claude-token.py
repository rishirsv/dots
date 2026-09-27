#!/usr/bin/env python3
"""Copy Claude Code's current access token to CLIProxyAPI without its refresh token."""

import json
import os
from pathlib import Path
import subprocess
import tempfile
from datetime import datetime, timezone


def main():
    raw = subprocess.check_output(
        ["/usr/bin/security", "find-generic-password", "-s", "Claude Code-credentials", "-w"],
        text=True,
    )
    oauth = json.loads(raw)["claudeAiOauth"]
    token = oauth["accessToken"]
    expiry_ms = oauth["expiresAt"]
    if expiry_ms <= datetime.now(timezone.utc).timestamp() * 1000:
        raise SystemExit("Claude Code access token has expired; run Claude Code to refresh it")

    destination = Path.home() / ".cli-proxy-api" / "claude-from-cli.json"
    existing = json.loads(destination.read_text()) if destination.exists() else {}
    if existing.get("access_token") == token and "refresh_token" not in existing:
        return

    # Keep CLIProxyAPI's account and device metadata when an existing auth file has it.
    data = {key: value for key, value in existing.items() if key != "refresh_token"}
    data.update(
        type="claude",
        access_token=token,
        expired=datetime.fromtimestamp(expiry_ms / 1000, timezone.utc)
        .isoformat()
        .replace("+00:00", "Z"),
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
