"""Codex standalone execution adapter; no model, task, or browser ownership."""
import asyncio
import base64
from dataclasses import dataclass, field
import json
import os
from pathlib import Path
import secrets
import shutil
import tempfile
import time
import anyio


@dataclass
class Session:
    future: asyncio.Future
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    output: bytearray = field(default_factory=bytearray)
    dropped: int = 0
    completed: float | None = None


class Execution:
    """One private native executor and capability-handle namespace per MCP process."""
    def __init__(self, roots, codex="codex"):
        self.roots = [Path(root).resolve(strict=True) for root in roots]
        self.codex = shutil.which(codex)
        if not self.codex:
            raise ValueError("Execution requires Codex CLI on PATH")
        self.process = None
        self.pending = {}
        self.sessions = {}
        self.sequence = 0
        self.start_lock = asyncio.Lock()
        self.home = None
        self.reader = None

    def cwd(self, workdir):
        path = Path(workdir).resolve(strict=True) if workdir else self.roots[0]
        if not path.is_dir() or not any(path == root or root in path.parents for root in self.roots):
            raise ValueError("workdir must be an absolute directory inside an authorized folder")
        if workdir and not Path(workdir).is_absolute():
            raise ValueError("workdir must be absolute; MCP mount aliases are not shell paths")
        return str(path)

    async def start(self):
        async with self.start_lock:
            if self.process is not None:
                if self.process.returncode is not None:
                    raise RuntimeError("Native executor stopped; sessions are lost. Restart locally, do not retry commands blindly.")
                return
            # An isolated config cannot load credentials or the user's unrestricted
            # execution defaults. It is never inside a remotely writable mount.
            self.home = tempfile.TemporaryDirectory(prefix="dots-executor-")
            home = Path(self.home.name).resolve()
            if any(root == home or root in home.parents for root in self.roots):
                self.home.cleanup()
                raise ValueError("Executor configuration must be outside authorized folders")
            config = ['default_permissions = "dots"', 'approval_policy = "never"',
                      '[permissions.dots]', 'extends = ":workspace"',
                      '[permissions.dots.filesystem]', '":root" = "deny"',
                      '":minimal" = "read"', '":tmpdir" = "deny"', '":slash_tmp" = "deny"']
            for root in self.roots:
                config += [f'[permissions.dots.filesystem.{json.dumps(str(root))}]',
                           '"." = "write"', '"**/.env*" = "deny"', '"**/*.pem" = "deny"']
            config += ['[permissions.dots.network]', 'enabled = false']
            Path(self.home.name, "config.toml").write_text("\n".join(config) + "\n")
            env = {"PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
                   "HOME": self.home.name, "CODEX_HOME": self.home.name,
                   "LANG": "en_US.UTF-8", "TERM": "xterm-256color"}
            self.process = await asyncio.create_subprocess_exec(
                self.codex, "app-server", "--stdio", cwd=self.home.name, env=env,
                stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.DEVNULL, limit=2**20)
            self.reader = asyncio.create_task(self.read_messages())
            try:
                await asyncio.wait_for(self.request("initialize", {
                    "clientInfo": {"name": "dots-tunnel", "version": "1"},
                    "capabilities": {"experimentalApi": True}}), 15)
                self.send({"method": "initialized", "params": {}})
            except BaseException:
                await self.close()
                raise

    def send(self, message):
        self.process.stdin.write((json.dumps(message) + "\n").encode())

    def request(self, method, params):
        self.sequence += 1
        future = asyncio.get_running_loop().create_future()
        self.pending[self.sequence] = future
        self.send({"id": self.sequence, "method": method, "params": params})
        return future

    async def read_messages(self):
        try:
            while line := await self.process.stdout.readline():
                message = json.loads(line)
                if "method" in message and "id" in message:
                    # No automatic permission grant or native UI approval fiction.
                    self.send({"id": message["id"], "error": {"code": -32601, "message": "Interactive requests unsupported"}})
                elif "id" in message:
                    future = self.pending.pop(message["id"], None)
                    if future and not future.done():
                        if "error" in message:
                            future.set_exception(RuntimeError(message["error"]["message"]))
                        else:
                            future.set_result(message["result"])
                elif message.get("method") == "command/exec/outputDelta":
                    params = message["params"]
                    session = self.sessions.get(int(params["processId"]))
                    if session:
                        data = base64.b64decode(params["deltaBase64"])
                        room = max(0, 65536 - len(session.output))
                        session.output.extend(data[:room])
                        session.dropped += max(0, len(data) - room)
        except Exception as error:
            failure = RuntimeError(f"Native executor transport failed: {type(error).__name__}; inspect results before retrying")
        else:
            failure = RuntimeError("Native executor disconnected; results may be incomplete")
        for future in self.pending.values():
            if not future.done():
                future.set_exception(failure)
        self.pending.clear()

    async def collect(self, session_id, wait_ms, max_output_tokens):
        session = self.sessions.get(session_id)
        if session is None:
            raise ValueError("Unknown or expired session_id; do not rerun an uncertain command")
        async with session.lock:
            if self.sessions.get(session_id) is not session:
                raise ValueError("Session was already collected")
            started = time.monotonic()
            if not session.future.done():
                try:
                    await asyncio.wait_for(asyncio.shield(session.future), wait_ms / 1000)
                except TimeoutError:
                    pass
                except Exception:
                    self.sessions.pop(session_id, None)
                    raise
            data = bytes(session.output)
            session.output.clear()
            cap = max(1, min(max_output_tokens or 10000, 16000)) * 4
            dropped = session.dropped + max(0, len(data) - cap)
            session.dropped = 0
            output = data[:cap].decode(errors="replace")
            if dropped:
                output += f"\n[output truncated: {dropped} bytes omitted]"
            result = {"output": output, "wall_time_seconds": round(time.monotonic() - started, 3)}
            if session.future.done():
                del self.sessions[session_id]
                native = session.future.result()
                result["exit_code"] = native["exitCode"]
            else:
                result["session_id"] = session_id
            return result

    async def exec_command(self, cmd, workdir=None, shell=None, login=True, tty=False,
                           yield_time_ms=10000, max_output_tokens=10000,
                           sandbox_permissions="use_default", justification=None, prefix_rule=None):
        if sandbox_permissions != "use_default" or prefix_rule is not None:
            raise ValueError("Escalation and persistent approval rules are unavailable over dots-tunnel")
        cwd = self.cwd(workdir)
        shell = shell or "/bin/zsh"
        if shell not in {"/bin/sh", "/bin/bash", "/bin/zsh"}:
            raise ValueError("Use /bin/sh, /bin/bash, or /bin/zsh")
        if not cmd or len(cmd) > 65536:
            raise ValueError("cmd must contain 1..65536 characters")
        await self.start()
        # Finished, unread sessions expire after ten minutes. Active commands
        # have the same native hard timeout; there is no background daemon API.
        for key, session in list(self.sessions.items()):
            if session.completed is not None and not session.lock.locked() and time.monotonic() - session.completed > 600:
                session.future.exception()
                del self.sessions[key]
        if len(self.sessions) >= 8:
            raise ValueError("Eight sessions retained; collect or terminate existing sessions first")
        session_id = secrets.randbelow(2**52 - 1) + 1
        while session_id in self.sessions:
            session_id = secrets.randbelow(2**52 - 1) + 1
        future = self.request("command/exec", {
            "command": [shell, "-lc" if login else "-c", cmd], "cwd": cwd,
            "permissionProfile": "dots", "processId": str(session_id),
            "tty": tty, "streamStdin": True, "streamStdoutStderr": True,
            "timeoutMs": 600000, "outputBytesCap": 65536})
        session = Session(future)
        self.sessions[session_id] = session
        future.add_done_callback(lambda _: setattr(session, "completed", time.monotonic()))
        try:
            return await self.collect(session_id, min(30000, max(250, yield_time_ms)), max_output_tokens)
        except asyncio.CancelledError:
            with anyio.CancelScope(shield=True):
                await self.terminate_command(session_id)
            raise

    async def write_stdin(self, session_id, chars="", yield_time_ms=None, max_output_tokens=10000):
        if session_id not in self.sessions:
            raise ValueError("Unknown or expired session_id")
        if chars:
            if len(chars.encode()) > 65536:
                raise ValueError("Input exceeds 65536 bytes")
            await asyncio.wait_for(self.request("command/exec/write", {
                "processId": str(session_id), "deltaBase64": base64.b64encode(chars.encode()).decode()}), 10)
        wait = (250 if chars else 5000) if yield_time_ms is None else yield_time_ms
        wait = min(30000, max(1, wait)) if chars else min(300000, max(5000, wait))
        return await self.collect(session_id, wait, max_output_tokens)

    async def terminate_command(self, session_id):
        session = self.sessions.get(session_id)
        if session is None:
            raise ValueError("Unknown or expired session_id")
        if not session.future.done():
            await asyncio.wait_for(self.request("command/exec/terminate", {"processId": str(session_id)}), 10)
        return await self.collect(session_id, 1000, 10000)

    async def close(self):
        if self.process is not None and self.process.returncode is None:
            for session_id in list(self.sessions):
                try:
                    await self.terminate_command(session_id)
                except Exception:
                    pass
            self.process.stdin.close()
            try:
                await asyncio.wait_for(self.process.wait(), 5)
            except TimeoutError:
                self.process.kill()
                await self.process.wait()
        if self.reader:
            await self.reader
        for session in self.sessions.values():
            if session.future.done():
                session.future.exception()
        self.sessions.clear()
        if self.home:
            self.home.cleanup()
