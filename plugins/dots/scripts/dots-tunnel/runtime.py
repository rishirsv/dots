"""Local lifecycle helper; never exposed as an MCP tool.

config.json in the dots-tunnel directory is the single record of what to run:
{"tunnel_id": "...", "python": "/abs/python", "mounts": {"Name": "/abs/path"},
 "state": "/abs/recovery-dir", "exec": false}
The tunnel command is rebuilt from it on every start and always points at this
installed plugin's server.py, so plugin updates cannot leave a stale path.
"""
import argparse
import fcntl
import json
from pathlib import Path
import shlex
import subprocess
import time

ALIAS = "dots-tunnel"
SERVER = Path(__file__).resolve().with_name("server.py")
EXEC_TOOLS = {"exec_command", "write_stdin", "terminate_command"}


def load_config(directory):
    try:
        config = json.loads((directory / "config.json").read_text())
    except FileNotFoundError:
        raise RuntimeError("Local tunnel setup is missing; configure it before starting.") from None
    except ValueError:
        raise RuntimeError("config.json is not valid JSON.") from None
    mounts = config.get("mounts")
    if (not isinstance(config.get("tunnel_id"), str) or not config["tunnel_id"]
            or not isinstance(config.get("python"), str) or not Path(config["python"]).is_absolute()
            or not isinstance(config.get("state"), str) or not Path(config["state"]).is_absolute()
            or not isinstance(mounts, dict) or not mounts
            or not all(isinstance(path, str) and Path(path).is_absolute() for path in mounts.values())
            or not isinstance(config.get("exec", False), bool)):
        raise RuntimeError("config.json needs tunnel_id, absolute python/state paths, and absolute mounts.")
    return config


def server_command(config, server=SERVER):
    args = [config["python"], str(server)]
    for name, path in config["mounts"].items():
        args += ["--mount", f"{name}={path}"]
    args += ["--state", config["state"]] + (["--exec"] if config.get("exec") else [])
    return args


def preflight(args, expect_exec, run=subprocess.run):
    """Start the exact server command once and complete an MCP handshake."""
    messages = [
        {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
            "protocolVersion": "2025-11-25", "capabilities": {},
            "clientInfo": {"name": "dots-tunnel-preflight", "version": "1"}}},
        {"jsonrpc": "2.0", "method": "notifications/initialized"},
        {"jsonrpc": "2.0", "id": 2, "method": "tools/list"}]
    stdin = "".join(json.dumps(message) + "\n" for message in messages)
    try:
        result = run(args, input=stdin, capture_output=True, text=True, timeout=30, check=False)
    except (OSError, subprocess.TimeoutExpired) as error:
        raise RuntimeError(f"Server preflight failed: {type(error).__name__}. Not connecting.") from None
    tools = set()
    for line in result.stdout.splitlines():
        try:
            reply = json.loads(line)
        except ValueError:
            continue
        if reply.get("id") == 2:
            tools = {tool.get("name") for tool in reply.get("result", {}).get("tools", [])}
    if not tools:
        detail = (result.stderr.strip().splitlines() or ["no output"])[-1][:300]
        raise RuntimeError(f"Server preflight failed (exit {result.returncode}): {detail}. Not connecting.")
    if expect_exec and not EXEC_TOOLS <= tools:
        raise RuntimeError("Server preflight did not expose command tools although exec is enabled.")


def exit_reason(log_path, started_at):
    """Latest stdio server exit recorded by tunnel-client since this start, if any."""
    try:
        with open(log_path, "rb") as log:
            log.seek(0, 2)
            log.seek(max(0, log.tell() - 262144))
            lines = log.read().decode(errors="replace").splitlines()
    except (OSError, TypeError):
        return None
    for line in reversed(lines):
        try:
            entry = json.loads(line)
        except ValueError:
            continue
        if entry.get("time", "") < started_at:
            break
        if entry.get("msg") == "stdio MCP command exited":
            return entry.get("error") or "exited"
    return None


def manage(action, directory, run=subprocess.run, server=SERVER, wait=1.0):
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
        state = call("status", ALIAS)
        if action == "stop":
            call("stop", ALIAS)
            state = call("status", ALIAS)
            if state.get("process_running"):
                raise RuntimeError("Tunnel is still running; stop was not confirmed.")
        elif action == "start" and not state.get("ready"):
            if state.get("process_running"):
                raise RuntimeError("Tunnel is running but not ready; leaving it untouched. Check diagnostics.")
            config = load_config(directory)
            key = directory / "secrets/tunnel-runtime.key"
            if not key.is_file():
                raise RuntimeError("Tunnel credential file is missing; do not create a replacement automatically.")
            command = server_command(config, server)
            preflight(command, config.get("exec", False), run)
            started_at = time.strftime("%Y-%m-%dT%H:%M:%S")
            call("connect", "--alias", ALIAS, "--profile", ALIAS,
                 "--profile-dir", str(directory / "profiles"), "--tunnel-id", config["tunnel_id"],
                 "--runtime-api-key", "file:" + str(key), "--mcp-command", shlex.join(command))
            for attempt in range(10):
                state = call("status", ALIAS)
                if state.get("ready") or (attempt and not state.get("process_running")):
                    break
                time.sleep(wait)
            if not state.get("ready"):
                reason = exit_reason((state.get("process") or {}).get("log_path"), started_at)
                raise RuntimeError("Tunnel started but is not ready"
                                   + (f"; server exited: {reason}" if reason else "")
                                   + ". No restart attempted.")
        return {"alias": ALIAS, "ready": bool(state.get("ready")),
                "running": bool(state.get("process_running")), "state": state.get("runtime_state")}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("action", choices=("start", "status", "stop"))
    args = parser.parse_args()
    try:
        print(json.dumps(manage(args.action, Path.home() / ".local/share/dots-tunnel")))
    except (RuntimeError, OSError, subprocess.TimeoutExpired) as error:
        parser.exit(1, str(error) + "\n")
