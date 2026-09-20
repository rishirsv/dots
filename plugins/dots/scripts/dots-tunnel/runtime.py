"""Local lifecycle helper; never exposed as an MCP tool."""
import argparse
import fcntl
import json
from pathlib import Path
import subprocess
import time


def manage(action, directory, run=subprocess.run):
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
        state = call("status", "dots-tunnel")
        if action == "stop":
            call("stop", "dots-tunnel")
            state = call("status", "dots-tunnel")
            if state.get("process_running"):
                raise RuntimeError("Tunnel is still running; stop was not confirmed.")
        elif action == "start" and not state.get("ready"):
            if state.get("process_running"):
                raise RuntimeError("Tunnel is running but not ready; leaving it untouched. Check diagnostics.")
            saved = state.get("process") or {}
            profile_dir = directory / "profiles"
            key = directory / "secrets/tunnel-runtime.key"
            if (saved.get("target_kind") != "command" or not saved.get("target_value")
                    or not saved.get("tunnel_id")
                    or saved.get("profile_dir") != str(profile_dir)
                    or saved.get("profile_name") != "dots-tunnel"
                    or not (profile_dir / "dots-tunnel.yaml").is_file() or not key.is_file()):
                raise RuntimeError("Saved dots-tunnel setup is missing or mismatched; do not create a replacement automatically.")
            call("connect", "--alias", "dots-tunnel", "--profile", "dots-tunnel",
                 "--profile-dir", str(profile_dir), "--tunnel-id", saved["tunnel_id"],
                 "--runtime-api-key", "file:" + str(key), "--mcp-command", saved["target_value"])
            for attempt in range(6):
                state = call("status", "dots-tunnel")
                if state.get("ready"):
                    break
                if attempt < 5:
                    time.sleep(1)
            if not state.get("ready"):
                raise RuntimeError("Tunnel started but readiness is unconfirmed; no restart attempted.")
        return {"alias": "dots-tunnel", "ready": bool(state.get("ready")),
                "running": bool(state.get("process_running")), "state": state.get("runtime_state")}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("start", "status", "stop"))
    args = parser.parse_args()
    try:
        print(json.dumps(manage(args.action, Path.home() / ".local/share/dots-tunnel")))
    except (RuntimeError, OSError, ValueError, subprocess.TimeoutExpired) as error:
        parser.exit(1, str(error) + "\n")
