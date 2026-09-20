"""dots-tunnel's stdio MCP entrypoint. The secure tunnel owns remote authentication."""
import argparse
import os
from pathlib import Path
from typing import Any, Literal

from mcp.server import MCPServer
from mcp.server.caching import CacheHint
from mcp.server.extension import Extension, MethodBinding, ResourceBinding
from mcp.server.mcpserver.resources.types import TextResource
from mcp.shared.exceptions import MCPError
from mcp_types import CacheableResult, RequestParams, ToolAnnotations

from files import Workspace, revision

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


def create_server(workspace: Workspace) -> MCPServer:
    server = MCPServer(
        "dots-tunnel", version="0.1.0", extensions=[Skills()], log_level="WARNING",
        instructions="Read and edit the locally authorized project. Workflow: skill://dots/dots-tunnel/SKILL.md. "
                     "Read before updating; pass the revision to apply_patch. No shell or model routing.",
        cache_hints={method: CacheHint(300000, "public") for method in
                     ("tools/list", "resources/list", "resources/read", "resources/templates/list", "prompts/list")},
    )
    read = ToolAnnotations(read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=False)
    write = ToolAnnotations(read_only_hint=False, destructive_hint=True, idempotent_hint=False, open_world_hint=False)

    @server.tool(annotations=write)
    def apply_patch(input: str, expected_revision: str) -> dict[str, Any]:
        """Create/update one project file with Codex patch syntax. Use read_file's revision, or 'absent' for create. Exact @@ hunks, LF UTF-8; no delete/rename. Keeps a recovery copy."""
        return workspace.apply_patch(input, expected_revision)

    @server.tool(annotations=read)
    def list_files(path: str = ".", offset: int = 0, limit: int = 100) -> dict[str, Any]:
        """List a project directory. Paths are relative; follow next_offset if needed. Hidden/protected paths and symlinks are excluded. Limit 1..200."""
        return workspace.list_files(path, offset, limit)

    @server.tool(annotations=read)
    def read_file(path: str, start_line: int = 1, limit: int = 100) -> dict[str, Any]:
        """Read project UTF-8 text and its revision for safe editing. At most 200 lines/16000 characters per call, files <=1 MiB. Follow next_line when needed."""
        return workspace.read_file(path, start_line, limit)

    @server.tool(annotations=read)
    def search_files(query: str, path: str = ".", limit: int = 30) -> dict[str, Any]:
        """Find literal text in project files. Bounded recursive search, max 100 matches. If truncated, narrow path or query; no regex or shell."""
        return workspace.search_files(query, path, limit)

    return server


def main():
    parser = argparse.ArgumentParser(description="dots-tunnel: project-scoped file MCP over stdio (macOS/Linux)")
    parser.add_argument("--root", default=os.environ.get("DOTS_TUNNEL_ROOT"))
    parser.add_argument("--state", default=os.environ.get("DOTS_TUNNEL_STATE", str(Path.home() / ".local/state/dots-tunnel")))
    args = parser.parse_args()
    if not args.root:
        parser.error("--root or DOTS_TUNNEL_ROOT is required; no implicit filesystem access")
    workspace = Workspace(args.root, args.state)
    try:
        create_server(workspace).run()
    finally:
        workspace.close()


if __name__ == "__main__":
    main()
