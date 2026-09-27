#!/usr/bin/env python3
"""Set up the local CLIProxyAPI route used by the Codex desktop model picker on macOS."""

import getpass
import json
import os
from pathlib import Path
import plistlib
import secrets
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request


ROOT = Path(__file__).resolve().parent.parent
OPENROUTER_SERVICE = "com.openai.codex.openrouter"
CLIENT_SERVICE = "cliproxyapi-local-client"


def run(*args):
    return subprocess.run(args, check=True, text=True, capture_output=True).stdout.strip()


def keychain_get(service):
    result = subprocess.run(
        ["/usr/bin/security", "find-generic-password", "-s", service, "-w"],
        text=True,
        capture_output=True,
    )
    return result.stdout.strip() if result.returncode == 0 else None


def keychain_put(service, value):
    result = subprocess.run(
        [
            "/usr/bin/security",
            "add-generic-password",
            "-U",
            "-a",
            getpass.getuser(),
            "-s",
            service,
            "-w",
            value,
        ],
        capture_output=True,
    )
    if result.returncode:
        raise SystemExit("Could not save " + service + " in Keychain")


def replace_private(path, contents):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_bytes() == contents:
        return False
    if path.exists():
        backup = path.with_name(path.name + ".bak")
        index = 1
        while backup.exists():
            backup = path.with_name(path.name + ".bak." + str(index))
            index += 1
        shutil.copy2(path, backup)
        print("Backed up", path, "to", backup)
    descriptor, temporary_name = tempfile.mkstemp(prefix="." + path.name + "-", dir=path.parent)
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "wb") as output:
            output.write(contents)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    return True


def main():
    if sys.platform != "darwin":
        raise SystemExit("This setup targets the macOS dots profile")
    if not shutil.which("brew"):
        raise SystemExit("Install Homebrew first")
    if not shutil.which("codex"):
        raise SystemExit("Install Codex first")
    if not keychain_get("Claude Code-credentials"):
        raise SystemExit("Sign in to Claude Code on this Mac first")

    openrouter_key = keychain_get(OPENROUTER_SERVICE)
    if not openrouter_key:
        openrouter_key = getpass.getpass("OpenRouter API key for Muse: ").strip()
        if not openrouter_key:
            raise SystemExit("An OpenRouter API key is required")
        keychain_put(OPENROUTER_SERVICE, openrouter_key)

    client_key = keychain_get(CLIENT_SERVICE)
    if not client_key:
        client_key = secrets.token_urlsafe(32)
        keychain_put(CLIENT_SERVICE, client_key)

    run("brew", "install", "cliproxyapi")
    prefix = Path(run("brew", "--prefix"))
    config = prefix / "etc" / "cliproxyapi.conf"
    auth_dir = Path.home() / ".cli-proxy-api"
    auth_dir.mkdir(mode=0o700, exist_ok=True)

    # JSON string literals are valid YAML strings. Keep secrets only in the local 0600 file.
    yaml = "\n".join(
        [
            "config-version: 8",
            "server:",
            '  host: "127.0.0.1"',
            "  port: 8317",
            "access:",
            "  api-keys:",
            "    - " + json.dumps(client_key),
            "oauth:",
            "  auth-dir: " + json.dumps(str(auth_dir)),
            "api-keys:",
            "  openai-compatibility:",
            "    - name: openrouter-muse",
            '      base-url: "https://openrouter.ai/api/v1"',
            "      keys:",
            "        - api-key: " + json.dumps(openrouter_key),
            "      models:",
            '        - name: "meta/muse-spark-1.3-contributor"',
            '          alias: "meta/muse-spark-1.3-contributor"',
            '          display-name: "Muse Spark 1.3 Contributor (OpenRouter)"',
            "          max-context-length: 1048576",
            "          thinking:",
            '            levels: ["low", "medium", "high", "xhigh"]',
            "",
        ]
    ).encode()
    changed = replace_private(config, yaml)

    helper = Path.home() / ".local" / "bin" / "cliproxy-sync-claude-token"
    replace_private(helper, (ROOT / "scripts" / "cliproxy-sync-claude-token.py").read_bytes())
    helper.chmod(0o700)
    run(sys.executable, str(helper))

    agent = Path.home() / "Library" / "LaunchAgents" / "com.dots.cliproxy-claude-sync.plist"
    plist = {
        "Label": "com.dots.cliproxy-claude-sync",
        "ProgramArguments": [sys.executable, str(helper)],
        "RunAtLoad": True,
        "StartInterval": 300,
        "StandardErrorPath": str(auth_dir / "claude-sync.err"),
    }
    agent_changed = replace_private(agent, plistlib.dumps(plist))
    if agent_changed:
        subprocess.run(["launchctl", "bootout", "gui/" + str(os.getuid()), str(agent)], capture_output=True)
        run("launchctl", "bootstrap", "gui/" + str(os.getuid()), str(agent))

    # Only restart the service when the config changed; other local chats may use it.
    if changed:
        run("brew", "services", "restart", "cliproxyapi")
    else:
        run("brew", "services", "start", "cliproxyapi")

    request = urllib.request.Request(
        "http://127.0.0.1:8317/v1/models",
        headers={"Authorization": "Bearer " + client_key},
    )
    for attempt in range(20):
        try:
            with urllib.request.urlopen(request, timeout=2) as response:
                models = {item["id"] for item in json.load(response)["data"]}
            break
        except urllib.error.URLError:
            if attempt == 19:
                raise SystemExit("CLIProxyAPI did not become ready on 127.0.0.1:8317")
            time.sleep(0.5)
    required = {"meta/muse-spark-1.3-contributor", "claude-opus-5-5"}
    if not required <= models:
        raise SystemExit("CLIProxyAPI started, but Muse or Claude is missing from its catalog")

    run(str(ROOT / "scripts" / "sync-configs.sh"), "--codex")
    print("CLIProxyAPI is ready. Native GPT remains the Codex default.")
    print("For a new Claude/Muse chat, run: uv run --script scripts/select-codex-provider.py proxy")


if __name__ == "__main__":
    main()
