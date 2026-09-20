# dots-tunnel

Read and edit one locally authorized folder from a normal ChatGPT conversation.
The server belongs to Dots; it does not run a model, automate a browser, or
depend on an active Codex task.

```text
ChatGPT → Dots connection → OpenAI secure tunnel → local file server → project
```

ChatGPT owns the conversation, model selection, and tool confirmations. The
local server owns file access, revision checks, and recovery copies. Choose any
Web model that supports the attached tools; availability remains controlled by
ChatGPT. No model API calls or model billing are added by this server.

## Use it

Connect Dots in ChatGPT, mention `@Dots`, and ask for a file change:

> Read notes.txt, shorten the introduction without changing its meaning, save
> the edit, and read it back to verify it.

Send follow-ups in the same conversation. Each operation supplies its own path
and revision, so there is no turn-token synchronization or hidden browser tab.
The [dots-tunnel skill](../../skills/dots-tunnel/SKILL.md) describes the workflow.

| Tool | Purpose |
| --- | --- |
| `list_files` | List a directory with pagination. |
| `search_files` | Find literal text in a bounded set of files. |
| `read_file` | Read text and obtain its content revision. |
| `apply_patch` | Create or update one file using Codex-style patch syntax. |

Updates require the revision returned by `read_file`; creation requires
`expected_revision: "absent"`. A stale revision rejects the write. Read back an
edit before claiming success. On uncertain delivery, read before considering
another write. Do not retry a denied call through another connection or model.

## Local setup

Requires macOS/Linux, Python 3.11+, uv, and the official
[OpenAI secure MCP tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels).
Run from the Dots repository. Keep dependencies and state outside the package:

```sh
UV_PROJECT_ENVIRONMENT="$HOME/.cache/dots-tunnel-venv" \
  uv sync --project plugins/dots/scripts/dots-tunnel --locked

"$HOME/.cache/dots-tunnel-venv/bin/python" \
  plugins/dots/scripts/dots-tunnel/server.py \
  --root /absolute/authorized-project \
  --state /absolute/private-recovery-directory
```

The second command speaks stdio MCP; it does not open an HTTP port. Configure
the official tunnel client's managed runtime with the same executable, script,
root, and state as its MCP command, using absolute paths. Keep its restricted
runtime credential outside the repository. That credential authenticates the
tunnel, not model requests.

Register the tunnel in ChatGPT developer mode as the Dots connection. The
repository's `.app.json` points to the maintainer's registered app; installing
the source does not grant another account access to that app or this Mac.
For a separate deployment, register your own app and update your local mapping.

## Start, check, and stop

On the configured Mac, invoke `$dots-tunnel` in Codex to start the saved
connection on demand. The skill uses this helper (from the repository root):

```sh
python3 plugins/dots/scripts/dots-tunnel/runtime.py start
python3 plugins/dots/scripts/dots-tunnel/runtime.py status
python3 plugins/dots/scripts/dots-tunnel/runtime.py stop
```

Start reuses a healthy runtime without restarting it. If stopped, it uses the
saved command, tunnel, and credential-file reference, then verifies readiness.
Missing setup or an unhealthy running process is reported, not silently replaced.
The helper serializes concurrent invocations and prints only compact status.

The runtime stays in the background after a chat or terminal closes. Stop it
explicitly when finished; logout, reboot, or failure may also stop it. No login
startup or extra watchdog is installed. While the Mac is asleep or offline,
ChatGPT cannot reach it. A Web skill cannot start a stopped local server: invoke
the skill in Codex on the Mac first, then mention `@Dots` in ChatGPT.

Lifecycle commands are local operator actions, not remotely exposed MCP tools.
They do not authorize new folders. Stop the runtime before changing the
authorized root; never expose a home directory.

## Boundaries and recovery

- Only the configured folder is available. Absolute paths, traversal, hidden
  paths, symlinks, hard links, special files, and known credential names are
  rejected. Filename filtering does not detect secrets embedded in ordinary
  text: authorize only content you intend to share with ChatGPT.
- Text files are limited to 1 MiB. Reads return at most 200 lines or 16,000
  characters. Search is bounded; narrow the query when results are truncated.
- Patches create or update one file with exact context. Delete, rename, binary
  edits, new parent directories, CRLF updates, and updates to files without a
  final newline are intentionally unsupported.
- Writes are serialized and replace complete prepared files atomically.
  Original content is saved as owner-only `original-<sha256>` files in the
  private state directory. Backups persist until the operator removes them;
  stop writers before restoring one. Basic permissions are preserved, not
  extended metadata.
- This is not an OS sandbox against other processes running as the same user.
  Other editors must not change a file during the short revision-check/replace
  interval. There are no shell, Git, build, network, or arbitrary-code tools.

## Protocol and verification

The pinned official Python SDK supports the stateless
[2026-07-28 protocol](https://modelcontextprotocol.io/specification/2026-07-28/changelog)
and legacy 2025-11-25 handshake clients. The
[skills extension](https://github.com/modelcontextprotocol/ext-skills/blob/main/specification/stable/skills.mdx)
publishes the packaged skill and resource digests. Stable discovery data is
cacheable; project file results are not. Hosts can compose the structured tools
in code mode; the server never evaluates supplied code on the local machine.
Client support for skill discovery and code orchestration varies.

```sh
UV_PROJECT_ENVIRONMENT="$HOME/.cache/dots-tunnel-venv" \
  uv run --project plugins/dots/scripts/dots-tunnel \
  python -m unittest discover -s plugins/dots/scripts/dots-tunnel -p 'test_*.py'
```

Acceptance requires both isolated boundary tests and two real ChatGPT prompts:
read an unknown disposable value, edit and verify it, then edit it again in the
same chat. Independently check the local bytes. A health check or fluent reply
alone is not sufficient.

Validated September 20, 2026: all 19 tests passed, along with Dots' full
integration gate. Two Medium turns each read, patched, and verified a canary;
the second succeeded after restarting the tunnel. No denials or rate-limit
warnings appeared. This does not establish every model or permission policy.
One local sample measured 371 ms startup-to-catalog and 0.56 ms median warm
empty-directory listing over ten calls, excluding network and model time.
