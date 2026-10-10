"""dots-tunnel's stdio MCP entrypoint. The secure tunnel owns remote authentication."""
import argparse
import asyncio
import platform
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Literal
import anyio

from mcp.server import MCPServer
from mcp.server.caching import CacheHint
from mcp.server.extension import Extension, MethodBinding, ResourceBinding
from mcp.server.mcpserver.resources.types import TextResource
from mcp.shared.exceptions import MCPError
from mcp_types import CacheableResult, RequestParams, ToolAnnotations

from files import MountedWorkspace, revision

SKILL_URI = "skill://dots/dots-tunnel/SKILL.md"
SKILL_PATH = Path(__file__).resolve().parents[2] / "skills/dots-tunnel/SKILL.md"


class GetSkillParams(RequestParams):
    uri: str


class ListSkillParams(RequestParams):
    cursor: str | None = None


class SkillListResult(CacheableResult):
    result_type: Literal["complete"] = "complete"
    skills: list[dict]


class SkillGetResult(CacheableResult):
    result_type: Literal["complete"] = "complete"
    skill: dict


class Skills(Extension):
    identifier = "io.modelcontextprotocol/skills"

    def __init__(self):
        self.data = SKILL_PATH.read_bytes()
        # The owned skill has only these two scalar fields. Fail rather than
        # silently publishing a manifest that disagrees with future frontmatter.
        header = self.data.decode().split("---", 2)[1].strip().splitlines()
        self.frontmatter = dict(line.split(": ", 1) for line in header)
        if set(self.frontmatter) != {"name", "description"} or self.frontmatter["name"] != "dots-tunnel":
            raise ValueError("Update skill discovery for the changed frontmatter")
        self.files = {"skill://dots/dots-tunnel/" + path.relative_to(SKILL_PATH.parent).as_posix(): path.read_bytes()
                      for path in sorted(SKILL_PATH.parent.rglob("*")) if path.is_file() and not path.is_symlink()}
        self.entry = {"uri": SKILL_URI, "frontmatter": self.frontmatter,
                      "resources": [{"uri": uri, "digest": "sha256:" + revision(data), "size": len(data)}
                                    for uri, data in self.files.items()]}

    def resources(self):
        return [ResourceBinding(TextResource(uri=uri, name="dots-tunnel" if uri == SKILL_URI else uri.rsplit("/", 1)[-1],
                                             mime_type="text/markdown" if uri.endswith(".md") else "text/plain",
                                             text=data.decode())) for uri, data in self.files.items()]

    def methods(self):
        async def listing(ctx, params):
            if params.cursor is not None:
                raise MCPError(-32602, "Unknown skill cursor")
            return SkillListResult(skills=[self.entry], ttl_ms=300000, cache_scope="public")

        async def getting(ctx, params):
            if params.uri != SKILL_URI:
                raise MCPError(-32602, "Unknown skill URI")
            return SkillGetResult(skill=self.entry, ttl_ms=300000, cache_scope="public")

        versions = frozenset({"2026-07-28"})
        return [MethodBinding("skills/list", ListSkillParams, listing, versions),
                MethodBinding("skills/get", GetSkillParams, getting, versions)]


def create_server(workspace: MountedWorkspace, execution=None, config_directory=None) -> MCPServer:
    from runtime import load_config, config_revision, validate_folders, folders, worktrees
    management_lock = asyncio.Lock()
    current_config = load_config(config_directory) if config_directory else None
    current_revision = config_revision(current_config) if current_config else None

    async def refresh():
        nonlocal current_config, current_revision
        if config_directory is None:
            return
        config = load_config(config_directory)
        rev = config_revision(config)
        if rev == current_revision:
            return
        validate_folders(config, remote=True, directory=config_directory)
        if config['state'] != current_config['state'] or config.get('exec', False) != current_config.get('exec', False):
            raise ValueError('Trusted runtime/state changes require local deployment, not hot reload')
        if execution:
            await execution.repair(list(config['mounts'].values()))
        workspace.reload(config['mounts'], config['state'])
        current_config, current_revision = config, rev

    def status():
        saved = load_config(config_directory) if config_directory else None
        return {'host': platform.node(), 'config_revision': current_revision,
                'config_reload_pending': bool(saved and config_revision(saved) != current_revision),
                'mounts': {name: str(item.root) for name, item in workspace.workspaces.items()},
                'execution': execution.health() if execution else {'state': 'disabled'},
                'transport_recovery': 'The local login supervisor owns transport recovery; executor repair keeps this MCP connection alive.'}

    @asynccontextmanager
    async def lifespan(server):
        try:
            yield {}
        finally:
            if execution:
                with anyio.CancelScope(shield=True):
                    await execution.close()

    server = MCPServer(
        "Dots Tunnel", version="0.3.0", extensions=[Skills()], log_level="WARNING", lifespan=lifespan,
        instructions="Read and edit locally authorized folders. List '.' to discover the named mounts; "
                     "include the mount prefix in all paths and patch headers, and search one mount at a time. "
                     "Workflow: skill://dots/dots-tunnel/SKILL.md. "
                     "Read before updating; pass the revision to apply_patch. "
                     "Call tunnel_manage status/worktrees/doctor to locate repositories and recover execution. No model routing.",
        cache_hints={method: CacheHint(300000, "public") for method in
                     ("tools/list", "resources/list", "resources/read", "resources/templates/list", "prompts/list")},
    )
    read = ToolAnnotations(read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=False)
    write = ToolAnnotations(read_only_hint=False, destructive_hint=True, idempotent_hint=False, open_world_hint=False)

    @server.tool(annotations=write)
    async def apply_patch(input: str, expected_revision: str) -> dict[str, Any]:
        """Create/update one project file with Codex patch syntax. Use read_file's revision, or 'absent' for create. Exact @@ hunks, LF UTF-8; no delete/rename. Keeps a recovery copy."""
        async with management_lock:
            await refresh()
            return workspace.apply_patch(input, expected_revision)

    @server.tool(annotations=read)
    async def list_files(path: str = ".", offset: int = 0, limit: int = 100) -> dict[str, Any]:
        """List a project directory. Paths are relative; follow next_offset if needed. Explicit project dotfiles are allowed; other hidden paths, secrets, Git internals, and symlinks are excluded. Limit 1..200."""
        async with management_lock:
            await refresh()
            return workspace.list_files(path, offset, limit)

    @server.tool(annotations=read)
    async def read_file(path: str, start_line: int = 1, limit: int = 100) -> dict[str, Any]:
        """Read project UTF-8 text and its revision for safe editing. At most 200 lines/16000 characters per call, files <=1 MiB. Follow next_line when needed."""
        async with management_lock:
            await refresh()
            return workspace.read_file(path, start_line, limit)

    @server.tool(annotations=read)
    async def read_files(paths: list[str], start_line: int = 1, limit: int = 100) -> dict[str, Any]:
        """Read 1..8 project files in one call. Returns one result or error per path, in order; each successful result has its own revision and next_line."""
        async with management_lock:
            await refresh()
            return workspace.read_files(paths, start_line, limit)

    @server.tool(annotations=read)
    async def search_files(query: str, path: str = ".", limit: int = 30) -> dict[str, Any]:
        """Find literal text in project files. Bounded recursive search, max 100 matches. If truncated, narrow path or query; no regex or shell."""
        async with management_lock:
            await refresh()
            return workspace.search_files(query, path, limit)

    @server.tool(annotations=read)
    def get_workflow() -> dict[str, Any]:
        """Get the packaged dots-tunnel skill, execution availability, and authorized absolute shell paths. Read once before local work; also available via MCP skills/list and resources/read."""
        roots = {name: str(item.root) for name, item in workspace.workspaces.items()}
        return {"skill": SKILL_PATH.read_text(), "roots": roots, "host": platform.node(), "execution_enabled": execution is not None}

    @server.tool(annotations=write)
    async def manage_files(action: Literal['mkdir', 'write', 'move', 'delete', 'restore'], path: str,
                           expected_revision: str = 'absent', content: str | None = None,
                           destination: str | None = None, recovery_copy: str | None = None) -> dict[str, Any]:
        """Protected UTF-8 file work: mkdir creates parents; write preserves exact supplied CRLF/newlines; move never overwrites; delete keeps recovery; restore verifies a returned recovery_copy. File mutations require the read revision, or absent. No directories deleted/moved, symlinks, binaries, secrets, or Git internals."""
        async with management_lock:
            await refresh()
            return workspace.file_operation(action, path, expected_revision, content, destination, recovery_copy)

    @server.tool(annotations=write)
    async def tunnel_manage(action: Literal['status', 'doctor', 'worktrees', 'folders', 'repair', 'result'],
                            add: dict[str, str] | None = None, remove: list[str] | None = None,
                            apply: bool = False, expected_revision: str | None = None,
                            query: str = '', branch: str = '', operation_id: int | None = None,
                            offset: int = 0, limit: int = 16000) -> dict[str, Any]:
        """Manage this host without restarting the chat. status/doctor show executor and config health; worktrees filters repository/branch metadata; folders previews/applies one revision-checked add/remove transaction inside locally approved parents; repair replaces only idle/failed native execution, never replays commands; result recovers retained output by operation_id for ten minutes. Transport failure needs the host supervisor. No remote startup or authority expansion."""
        if action in {'status', 'doctor'}:
            return status()
        if action == 'result':
            if not execution or operation_id is None:
                raise ValueError('Execution and operation_id are required')
            return execution.result(operation_id, offset, limit)
        async with management_lock:
            if action == 'repair':
                if not execution:
                    raise ValueError('Execution is disabled')
                config = load_config(config_directory) if config_directory else None
                if config:
                    validate_folders(config, remote=True, directory=config_directory)
                result = await execution.repair(list(config['mounts'].values()) if config else None)
                await refresh()
                return {**status(), 'repair': result}
            await refresh()
            if action == 'worktrees':
                config = current_config or {'mounts': status()['mounts'], 'state': str(next(iter(workspace.workspaces.values())).state.parent), 'python': str(Path(__import__('sys').executable).resolve())}
                return await asyncio.to_thread(worktrees, config, query, branch)
            if config_directory is None:
                raise ValueError('Local configuration is required for folder management')
            if apply and execution and execution.health()['active_operations']:
                raise ValueError('Collect or terminate active commands before applying folder changes')
            result = folders(config_directory, add, remove, apply=apply, expected_revision=expected_revision, remote=True)
            if result['applied']:
                await refresh()
            return result

    if execution:
        execute = ToolAnnotations(read_only_hint=False, destructive_hint=True,
                                  idempotent_hint=False, open_world_hint=False)

        @server.tool(annotations=execute)
        async def exec_command(cmd: str, workdir: str | None = None, shell: str | None = None,
                               login: bool = True, tty: bool = False, yield_time_ms: int = 10000,
                               max_output_tokens: int = 10000,
                               sandbox_permissions: Literal["use_default", "require_escalated"] = "use_default",
                               justification: str | None = None, prefix_rule: list[str] | None = None) -> dict[str, Any]:
            """Run a shell command through native Codex in authorized folders. Returns output, exit_code or session_id. Default wait 10s (250..30000ms). Fixed sandbox; escalation/prefix_rule unsupported. Read get_workflow first."""
            async with management_lock:
                await refresh()
                return await execution.exec_command(cmd, workdir, shell, login, tty, yield_time_ms,
                                                    max_output_tokens, sandbox_permissions, justification, prefix_rule)

        @server.tool(annotations=execute)
        async def write_stdin(session_id: int, chars: str = "", yield_time_ms: int | None = None,
                              max_output_tokens: int = 10000) -> dict[str, Any]:
            """Send input to a running command, or poll with empty chars. Returns only new output and exit_code or session_id. Poll default 5s, input default 250ms; maximum 300s. Do not repeat exec_command to poll."""
            return await execution.write_stdin(session_id, chars, yield_time_ms, max_output_tokens)

        @server.tool(annotations=execute)
        async def terminate_command(session_id: int) -> dict[str, Any]:
            """Stop an owned native command (including non-PTY jobs) and collect remaining output. Never reruns the command."""
            return await execution.terminate_command(session_id)

    return server


def main():
    parser = argparse.ArgumentParser(description="dots-tunnel: folder-scoped file MCP over stdio (macOS/Linux)")
    parser.add_argument("--mount", action="append", required=True, metavar="NAME=PATH",
                        help="Explicit named folder; repeat for multiple folders")
    parser.add_argument("--state", default=str(Path.home() / ".local/state/dots-tunnel"))
    parser.add_argument("--exec", action="store_true", help="Opt in to native Codex sandboxed commands; requires a deployed copy outside all mounts")
    parser.add_argument("--config-directory", type=Path, help="Private local configuration for revision-checked hot reload")
    args = parser.parse_args()
    mounts = {}
    for value in args.mount:
        name, separator, path = value.partition("=")
        if not separator or not path or name in mounts:
            parser.error("Use unique --mount NAME=PATH entries")
        mounts[name] = path
    if args.config_directory:
        from runtime import load_config, validate_folders
        config = load_config(args.config_directory)
        validate_folders(config, remote=True, directory=args.config_directory)
        mounts, args.state, args.exec = config['mounts'], config['state'], config.get('exec', False)
    workspace = MountedWorkspace(mounts, args.state)
    try:
        execution = None
        if args.exec:
            from execution import Execution
            roots = [item.root for item in workspace.workspaces.values()]
            source = Path(__file__).resolve()
            if any(source == root or root in source.parents for root in roots):
                parser.error("Deploy the server outside remotely writable roots before enabling --exec")
            execution = Execution(roots)
        create_server(workspace, execution, args.config_directory).run()
    finally:
        workspace.close()


if __name__ == "__main__":
    main()
