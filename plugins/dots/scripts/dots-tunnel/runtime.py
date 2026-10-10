"""Local configuration and lifecycle; lifecycle is never exposed remotely.

config.json in the dots-tunnel directory is the single record of what to run:
{"tunnel_id": "...", "python": "/abs/python", "mounts": {"Name": "/abs/path"},
 "state": "/abs/recovery-dir", "exec": false}
The tunnel command is rebuilt from it on every start and always points at this
installed plugin's server.py, so plugin updates cannot leave a stale path.
"""
import argparse
import os
import plistlib
import tempfile
import hashlib
import platform
import select
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


def server_command(config, server=SERVER, directory=None):
    args = [config["python"], str(server)]
    for name, path in config["mounts"].items():
        args += ["--mount", f"{name}={path}"]
    args += ["--state", config["state"]] + (["--exec"] if config.get("exec") else [])
    if directory is not None:
        args += ["--config-directory", str(directory)]
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
        if run is subprocess.run:
            result = live_preflight(args, messages)
        else:
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


def live_preflight(args, messages):
    """Keep stdin open until each reply; EOF can cancel queued SDK requests."""
    with tempfile.TemporaryFile() as diagnostics:
        process = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                   stderr=diagnostics, bufsize=0)
        replies, buffer = [], b''
        deadline = time.monotonic() + 30
        def receive(identifier):
            nonlocal buffer
            while time.monotonic() < deadline:
                while b'\n' in buffer:
                    line, buffer = buffer.split(b'\n', 1)
                    try:
                        value = json.loads(line)
                    except ValueError:
                        continue
                    replies.append(line.decode())
                    if value.get('id') == identifier:
                        return
                ready, _, _ = select.select([process.stdout], [], [], max(0, deadline-time.monotonic()))
                if not ready:
                    raise subprocess.TimeoutExpired(args, 30)
                chunk = os.read(process.stdout.fileno(), 65536)
                if not chunk:
                    return
                buffer += chunk
                if len(buffer) > 2**20:
                    raise RuntimeError('Preflight reply exceeded bounds')
        try:
            process.stdin.write((json.dumps(messages[0])+'\n').encode())
            receive(1)
            for message in messages[1:]:
                process.stdin.write((json.dumps(message)+'\n').encode())
            receive(2)
        finally:
            process.stdin.close()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
            process.stdout.close()
        diagnostics.seek(0)
        return subprocess.CompletedProcess(args, process.returncode, '\n'.join(replies), diagnostics.read(4096).decode(errors='replace'))


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


def manage(action, directory, run=subprocess.run, server=SERVER, wait=1.0, respect_pause=False):
    client = directory / "bin/tunnel-client"
    if not client.is_file():
        raise RuntimeError("Local tunnel setup is missing; configure it before starting.")

    def call(*args):
        result = run([str(client), "runtimes", *args, "--json"],
                     capture_output=True, text=True, timeout=45, check=False)
        if result.returncode:
            if args and args[0] == "status" and "is not known; run create or connect first" in result.stderr:
                return {}
            raise RuntimeError("Tunnel client failed; inspect its local diagnostics. No automatic retry.")
        return json.loads(result.stdout)

    # Serialize skill invocations without introducing another daemon.
    with (directory / "lifecycle.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        alias = load_config(directory).get("alias", ALIAS) if (directory / "config.json").exists() else ALIAS
        paused = respect_pause and (directory / "paused").exists()
        if action == "start" and not paused:
            (directory / "paused").unlink(missing_ok=True)
        state = call("status", alias)
        if action == "stop":
            (directory / "paused").touch(mode=0o600)
            call("stop", alias)
            state = call("status", alias)
            if state.get("process_running"):
                raise RuntimeError("Tunnel is still running; stop was not confirmed.")
        elif action == "start" and not paused and not state.get("ready"):
            if state.get("process_running"):
                raise RuntimeError("Tunnel is running but not ready; leaving it untouched. Check diagnostics.")
            config = load_config(directory)
            key = directory / "secrets/tunnel-runtime.key"
            if not key.is_file():
                raise RuntimeError("Tunnel credential file is missing; do not create a replacement automatically.")
            command = server_command(config, server, directory if config.get("approved_parents") else None)
            preflight(command, config.get("exec", False), run)
            started_at = time.strftime("%Y-%m-%dT%H:%M:%S")
            call("connect", "--alias", alias, "--profile", alias,
                 "--profile-dir", str(directory / "profiles"), "--tunnel-id", config["tunnel_id"],
                 "--runtime-api-key", "file:" + str(key), "--mcp-command", shlex.join(command))
            for attempt in range(10):
                state = call("status", alias)
                if state.get("ready") or (attempt and not state.get("process_running")):
                    break
                time.sleep(wait)
            if not state.get("ready"):
                reason = exit_reason((state.get("process") or {}).get("log_path"), started_at)
                raise RuntimeError("Tunnel started but is not ready"
                                   + (f"; server exited: {reason}" if reason else "")
                                   + ". No restart attempted.")
        return {"alias": alias, "ready": bool(state.get("ready")),
                "running": bool(state.get("process_running")), "state": state.get("runtime_state")}


def config_revision(config):
    return hashlib.sha256(json.dumps(config, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def validate_folders(config, remote=False, directory=None):
    from files import components
    approved = [Path(p).resolve(strict=True) for p in config.get("approved_parents", config["mounts"].values())]
    if not approved or any(p in {Path('/'), Path.home()} or not p.is_dir() for p in approved):
        raise ValueError("Approve specific project/worktree parent directories, never home or root")
    protected = [Path(config["state"]).resolve(), Path(__file__).resolve().parent,
                 Path(config["python"]).resolve().parent, Path.home() / 'Library/LaunchAgents']
    if directory:
        protected.append(Path(directory).resolve())
    if not config['mounts'] or len(config['mounts']) > 64:
        raise ValueError("Keep 1..64 named mounts")
    for name, value in config['mounts'].items():
        if len(components(name)) != 1:
            raise ValueError("Mount names are single permitted path components")
        path = Path(value)
        if not path.is_absolute() or path.is_symlink():
            raise ValueError("Mounts must be absolute, non-symlink directories")
        path = path.resolve(strict=True)
        if not path.is_dir() or path in {Path('/'), Path.home()}:
            raise ValueError("Mount project directories, never home or root")
        if remote and not any(path == parent or parent in path.parents for parent in approved):
            raise ValueError("Folder is outside locally approved parents")
        if any(path == p or path in p.parents or p in path.parents for p in protected):
            raise ValueError("Folder overlaps trusted runtime, credentials, startup, or recovery state")
    return approved


def folders(directory, add=None, remove=None, approve=None, apply=False, expected_revision=None, remote=False):
    """One atomic folder transaction. Remote callers cannot expand local authority."""
    directory = Path(directory)
    with (directory / 'config.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        config = load_config(directory)
        previous = config_revision(config)
        if expected_revision is not None and previous != expected_revision:
            raise ValueError("Config revision conflict; inspect folders before applying again")
        candidate = dict(config, mounts=dict(config['mounts']),
                         approved_parents=list(config.get('approved_parents', config['mounts'].values())))
        if approve:
            if remote:
                raise ValueError("Only the local operator can approve new parent roots")
            candidate['approved_parents'] = list(dict.fromkeys(candidate['approved_parents'] + [str(Path(p).resolve(strict=True)) for p in approve]))
        for name in remove or []:
            if name not in candidate['mounts']:
                raise ValueError("Unknown mount: " + name)
            del candidate['mounts'][name]
        for name, path in (add or {}).items():
            if not Path(path).is_absolute():
                raise ValueError('Use absolute folder paths')
            candidate['mounts'][name] = str(Path(path).resolve(strict=True))
        validate_folders(candidate, remote=True, directory=directory)
        changed = candidate != config
        if apply and changed:
            if remote and expected_revision is None:
                raise ValueError("Remote folder apply requires expected_revision from preview/status")
            fd, temporary = tempfile.mkstemp(prefix='.config-', dir=directory)
            try:
                with os.fdopen(fd, 'w') as stream:
                    json.dump(candidate, stream, indent=2)
                    stream.write('\n')
                    stream.flush()
                    os.fsync(stream.fileno())
                os.replace(temporary, directory / 'config.json')
                handle = os.open(directory, os.O_RDONLY | os.O_DIRECTORY)
                try:
                    os.fsync(handle)
                finally:
                    os.close(handle)
            finally:
                Path(temporary).unlink(missing_ok=True)
        return {"mounts": candidate['mounts'], "approved_parents": candidate.get('approved_parents', list(config['mounts'].values())),
                "revision": config_revision(candidate) if apply else previous, "candidate_revision": config_revision(candidate),
                "changed": changed, "applied": bool(apply and changed)}


def worktrees(config, query='', branch=''):
    """Bounded metadata discovery; no repository-controlled hooks or status helpers."""
    if len(query) > 200 or len(branch) > 200:
        raise ValueError('Keep query and branch filters within 200 characters')
    parents = validate_folders(config, remote=True)
    entries, errors, pending, seen, scanned = [], [], [(p, 0) for p in parents], set(), 0
    env = {'PATH': '/usr/bin:/bin', 'HOME': '/nonexistent', 'GIT_CONFIG_NOSYSTEM': '1',
           'GIT_CONFIG_GLOBAL': '/dev/null', 'GIT_TERMINAL_PROMPT': '0', 'GIT_OPTIONAL_LOCKS': '0'}
    while pending and scanned < 2000 and len(entries) < 200:
        path, depth = pending.pop()
        if path in seen:
            continue
        seen.add(path)
        scanned += 1
        try:
            if (path / '.git').exists():
                with tempfile.TemporaryFile() as output:
                    proc = subprocess.run(['/usr/bin/git', '-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null',
                                           '-c', 'core.pager=cat', '-C', str(path), 'worktree', 'list', '--porcelain', '-z'],
                                          env=env, stdout=output, stderr=subprocess.DEVNULL, timeout=3)
                    output.seek(0)
                    data = output.read(1_048_577)
                if proc.returncode or len(data) > 1_048_576:
                    errors.append({'path': str(path), 'error': 'Git discovery failed or exceeded bounds'})
                    continue
                current = {}
                for field in data.decode('utf-8', errors='replace').split('\0'):
                    if not field:
                        if current:
                            target = Path(current['path']).resolve()
                            if target.is_dir() and any(target == p or p in target.parents for p in parents):
                                current['path'] = str(target)
                                current['mount_paths'] = [name + (('/' + target.relative_to(Path(root).resolve()).as_posix()) if target != Path(root).resolve() else '')
                                                          for name, root in config['mounts'].items() if target == Path(root).resolve() or Path(root).resolve() in target.parents]
                                if query.casefold() in str(target).casefold() and (not branch or current.get('branch') == branch):
                                    entries.append(current)
                            current = {}
                    elif field.startswith('worktree '): current['path'] = field[9:]
                    elif field.startswith('HEAD '): current['head'] = field[5:]
                    elif field.startswith('branch '): current['branch'] = field[7:].removeprefix('refs/heads/')
                    elif field == 'detached': current['detached'] = True
                continue
            if depth < 5:
                for child in path.iterdir():
                    if child.is_dir() and not child.is_symlink() and (not child.name.startswith('.') or child.name == '.claude') and child.name not in {'node_modules', 'vendor', 'build', 'dist', '.venv'}:
                        pending.append((child, depth+1))
                    if len(pending) >= 2000:
                        break
        except (OSError, subprocess.TimeoutExpired):
            errors.append({'path': str(path), 'error': 'Unavailable or timed out'})
    unique = {entry['path']: entry for entry in entries}
    return {'repositories': sorted(unique.values(), key=lambda e: e['path']), 'errors': errors[:20],
            'truncated': bool(pending) or len(entries) >= 200, 'scanned': scanned}


def startup(directory, enabled=True):
    if platform.system() != 'Darwin':
        raise RuntimeError('Login startup currently supports macOS LaunchAgents')
    directory = Path(directory).resolve()
    config = load_config(directory)
    validate_folders(config, directory=directory)
    label = 'com.rishirsv.dots-tunnel.' + config.get('alias', ALIAS)
    plist = Path.home() / 'Library/LaunchAgents' / (label + '.plist')
    service = f'gui/{os.getuid()}/{label}'
    if not enabled:
        subprocess.run(['launchctl', 'bootout', service], capture_output=True)
        plist.unlink(missing_ok=True)
        return {'enabled': False, 'label': label}
    plist.parent.mkdir(parents=True, exist_ok=True)
    payload = {'Label': label, 'ProgramArguments': [config['python'], str(Path(__file__).resolve()), 'supervise', '--directory', str(directory)],
               'RunAtLoad': True, 'KeepAlive': True, 'ThrottleInterval': 15,
               'EnvironmentVariables': {'PATH': str(Path.home()/'.local/bin') + ':/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'},
               'StandardOutPath': str(directory/'supervisor.log'), 'StandardErrorPath': str(directory/'supervisor-error.log')}
    plist.write_bytes(plistlib.dumps(payload))
    plist.chmod(0o600)
    status = subprocess.run(['launchctl', 'print', service], capture_output=True)
    if status.returncode:
        subprocess.run(['launchctl', 'bootstrap', f'gui/{os.getuid()}', str(plist)], check=True, capture_output=True)
    return {'enabled': True, 'label': label, 'plist': str(plist)}


def supervise(directory):
    delay = 5
    while True:
        if not (directory/'paused').exists():
            try:
                state = manage('status', directory)
                if not state['running']:
                    manage('start', directory, respect_pause=True)
                delay = 5
            except Exception as error:
                print(json.dumps({'event': 'supervisor', 'error': str(error), 'retry_seconds': delay}), flush=True)
                delay = min(60, delay*2)
        time.sleep(delay)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Manage one host's Dots Tunnel")
    parser.add_argument('action', choices=('start', 'status', 'stop', 'folders', 'worktrees', 'startup', 'supervise'))
    parser.add_argument('--directory', type=Path, default=Path.home()/'.local/share/dots-tunnel')
    parser.add_argument('--add', action='append', default=[], metavar='NAME=PATH')
    parser.add_argument('--remove', action='append', default=[])
    parser.add_argument('--approve-parent', action='append', default=[])
    parser.add_argument('--discover', action='store_true')
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--expected-revision')
    parser.add_argument('--query', default='')
    parser.add_argument('--branch', default='')
    parser.add_argument('--disable', action='store_true')
    args = parser.parse_args()
    try:
        if args.action == 'folders':
            additions = {}
            for value in args.add:
                name, sep, path = value.partition('=')
                if not sep or not path or name in additions:
                    raise ValueError('Use unique --add NAME=PATH entries')
                additions[name] = path
            result = folders(args.directory, additions, args.remove, args.approve_parent, args.apply, args.expected_revision)
            if args.discover:
                result['discovery'] = worktrees(load_config(args.directory), args.query, args.branch)
        elif args.action == 'worktrees': result = worktrees(load_config(args.directory), args.query, args.branch)
        elif args.action == 'startup': result = startup(args.directory, not args.disable)
        elif args.action == 'supervise': supervise(args.directory)
        else: result = manage(args.action, args.directory)
        print(json.dumps(result))
    except (RuntimeError, ValueError, OSError, subprocess.SubprocessError) as error:
        parser.exit(1, str(error) + '\n')
