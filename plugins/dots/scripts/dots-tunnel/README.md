# dots-tunnel

Read and edit locally authorized folders from a normal ChatGPT conversation.
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
| `get_workflow` | Load the MCP-delivered skill, folder map, and execution availability. |
| `exec_command` | Optional: run a command through Codex's native sandbox. |
| `write_stdin` | Optional: poll a running command or send terminal input. |
| `terminate_command` | Optional: stop a command without re-running it. |

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

For multiple folders, replace `--root` with repeated explicit mounts:

```sh
--mount Code=/absolute/Code --mount Desktop=/absolute/Desktop
```

`list_files(".")` lists only these names. Use paths such as
`Code/project/src/main.py` or `Desktop/notes.txt`, including the prefix in patch
headers. Search one named folder at a time. The shared parent is never exposed;
each mount retains the same file protections and a separate recovery directory.
Mounts override `DOTS_TUNNEL_ROOT`; `--root` and `--mount` cannot be combined.

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

For the separately configured second account, append `--alias dots-tunnel-second`
to any lifecycle command. Credentials and saved profiles remain separate.

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

## Optional native execution

Add `--exec` to the saved server command to expose command tools. Requires Codex
CLI 0.154.0 or later with native permission profiles; unsupported policy/API
versions fail rather than run unsandboxed. macOS is the validated execution
platform. Keep execution disabled elsewhere until its sandbox tests pass.

Run a reviewed, deployed copy of the complete Dots plugin outside every writable
mount (for example the installed plugin cache), with Python dependencies and
Codex installed outside those mounts too. The server rejects `--exec` when its
entrypoint is inside a mount. Do not automatically reload remotely edited source
into the trusted installation. Changing the saved command requires a local stop
and reconnect; stopping cancels active native jobs and loses their handles.

The adapter uses [Codex app-server command execution](https://learn.chatgpt.com/docs/app-server)
over private stdio. It lazily starts one owned child and reuses it. There are no
model calls, Codex tasks, extra browser windows, or new listening ports.
`exec_command` and `write_stdin` retain Codex's argument names and familiar
`output`, `exit_code`/`session_id`, and `wall_time_seconds` result fields.
This is a native-engine adapter, **not an exact passthrough of a live task's tool
registry**: only system sh/bash/zsh shells are supported, output is capped at
64 KiB, jobs stop after ten minutes, and there are at most eight retained sessions.
Token output limits use a conservative four-byte approximation. MCP tools use
structured JSON, including the existing revision-protected patch tool.

An isolated native [permissions profile](https://learn.chatgpt.com/docs/permissions)
allows the configured folders and minimal system/toolchain reads, denies other
filesystem access and network, and denies `.env*` and `.pem` matches under the
authorized folders. It does not inherit user shell credentials or Codex's full
access defaults. There is no escalation or native-task approval UI:
`require_escalated` and `prefix_rule` are rejected. ChatGPT's own confirmations
remain unchanged. A denial must not be retried through a different route.

Shell commands can modify project dotfiles, create directories, rename/delete
files, and bypass the file helpers' revision/recovery mechanism. They are not a
secret detector. Grant only folders whose contents and executable project scripts
you trust. Use the file helpers for revision-protected edits when possible.

Session IDs are unguessable capability handles within one tunnel process, **not
chat-level isolation**. Two chats using the same connection share that trust
boundary. Separate tunnel processes have separate handles. Output is incremental;
concurrent collectors are serialized but should not intentionally share a handle.
Do not rerun a command after uncertain delivery without checking its effects.

## Boundaries and recovery

- For the file helpers, only configured folders are available. Absolute paths, traversal, hidden
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
  interval. Command tools are absent unless the operator explicitly enables
  `--exec`; their native sandbox is separate from these file-helper checks.

## Protocol and verification

The pinned official Python SDK supports the stateless
[2026-07-28 protocol](https://modelcontextprotocol.io/specification/2026-07-28/changelog)
and legacy 2025-11-25 handshake clients. The
[skills extension](https://github.com/modelcontextprotocol/ext-skills/blob/main/specification/stable/skills.mdx)
publishes the packaged skill and resource digests. Stable discovery data is
cacheable; project file results are not. Hosts can compose the structured tools
in code mode; local command execution is available only with `--exec`.
Client support for skill discovery and code orchestration varies.
`get_workflow` supplies the same packaged skill to clients without the extension.

```sh
UV_PROJECT_ENVIRONMENT="$HOME/.cache/dots-tunnel-venv" \
  uv run --project plugins/dots/scripts/dots-tunnel \
  python -m unittest discover -s plugins/dots/scripts/dots-tunnel -p 'test_*.py'
```

Acceptance requires both isolated boundary tests and two real ChatGPT prompts:
read an unknown disposable value, edit and verify it, then edit it again in the
same chat. Independently check the local bytes. A health check or fluent reply
alone is not sufficient.

Native-execution validation, September 21, 2026: local protocol, sandbox,
interactive input, cancellation, output bounds, cross-instance handles, and
shutdown tests passed on macOS with Codex CLI 0.154.0. The Safari Medium test
successfully loaded `get_workflow`, then ChatGPT reported an OpenAI safety denial
for `exec_command`. The disposable file remained unchanged. **Web execution is
not end-to-end validated.** No permission filters were weakened and the denied
operation was not retried through another connection. A successful future Web
run is still required before claiming production readiness.

File-only baseline validated September 20, 2026: all 19 tests passed, along with Dots' full
integration gate. Two Medium turns each read, patched, and verified a canary;
the second succeeded after restarting the tunnel. No denials or rate-limit
warnings appeared. This does not establish every model or permission policy.
One local sample measured 371 ms startup-to-catalog and 0.56 ms median warm
empty-directory listing over ten calls, excluding network and model time.
