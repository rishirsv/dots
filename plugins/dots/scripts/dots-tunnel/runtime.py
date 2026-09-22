"""Local lifecycle helper; never exposed as an MCP tool."""
import argparse
import fcntl
import json
from pathlib import Path
import subprocess
import time


def manage(action, directory, run=subprocess.run, alias="dots-tunnel"):
    keys = {"dots-tunnel": "tunnel-runtime.key", "dots-tunnel-second": "second-runtime.key"}
    if alias not in keys:
        raise ValueError("Unknown saved tunnel alias")
    client = directory / "bin/tunnel-client"
    if not client.is_file():
        raise RuntimeError("Local tunnel setup is missing; configure it before starting.")

    def call(*args):
        result = run([str(client), "runtimes", *args, "--json"],
                     capture_output=True, text=True, timeout=45, check=False)
        if result.returncode:
            raise RuntimeError("Tunnel client failed; inspect its local diagnostics. No automatic retry.")
        return json.loads(result.stdout)

    # Serialize skill invocations without introducing another daemon.
    with (directory / "lifecycle.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        state = call("status", alias)
        if action == "stop":
            call("stop", alias)
            state = call("status", alias)
            if state.get("process_running"):
                raise RuntimeError("Tunnel is still running; stop was not confirmed.")
        elif action == "start" and not state.get("ready"):
            if state.get("process_running"):
                raise RuntimeError("Tunnel is running but not ready; leaving it untouched. Check diagnostics.")
            saved = state.get("process") or {}
            profile_dir = directory / "profiles"
            key = directory / "secrets" / keys[alias]
            if (saved.get("target_kind") != "command" or not saved.get("target_value")
                    or not saved.get("tunnel_id")
                    or saved.get("profile_dir") != str(profile_dir)
                    or saved.get("profile_name") != alias
                    or not (profile_dir / (alias + ".yaml")).is_file() or not key.is_file()):
                raise RuntimeError("Saved dots-tunnel setup is missing or mismatched; do not create a replacement automatically.")
            call("connect", "--alias", alias, "--profile", alias,
                 "--profile-dir", str(profile_dir), "--tunnel-id", saved["tunnel_id"],
                 "--runtime-api-key", "file:" + str(key), "--mcp-command", saved["target_value"])
            for attempt in range(6):
                state = call("status", alias)
                if state.get("ready"):
                    break
                if attempt < 5:
                    time.sleep(1)
            if not state.get("ready"):
                raise RuntimeError("Tunnel started but readiness is unconfirmed; no restart attempted.")
        return {"alias": alias, "ready": bool(state.get("ready")),
                "running": bool(state.get("process_running")), "state": state.get("runtime_state")}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("start", "status", "stop"))
    parser.add_argument("--alias", choices=("dots-tunnel", "dots-tunnel-second"), default="dots-tunnel")
    args = parser.parse_args()
    try:
        print(json.dumps(manage(args.action, Path.home() / ".local/share/dots-tunnel", alias=args.alias)))
    except (RuntimeError, OSError, ValueError, subprocess.TimeoutExpired) as error:
        parser.exit(1, str(error) + "\n")
