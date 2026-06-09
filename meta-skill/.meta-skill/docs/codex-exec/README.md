# `codex exec` — Non-Interactive Codex CLI Reference

Reference notes for OpenAI's `codex exec`, the headless / non-interactive Codex CLI used for scripts, CI, and automation. The companion file [`json-events.md`](./json-events.md) documents the `--json` streaming event schema in detail (the highest-value surface for programmatic use).

For the richer live control-plane alternative, see
[`../codex-app-server/README.md`](../codex-app-server/README.md). Meta Skill uses
`codex_app_server` through the Python SDK as the primary workbench runner.
`codex exec` remains the simple fire-and-collect fallback for one-shot batch,
CI-like automation, and judge/control children that benefit from
`--output-schema`.

## Version covered

- Captured against locally installed **`codex-cli 0.135.0`** (`codex --version`).
- Flag reference below is verbatim from `codex exec --help` / `codex exec resume --help` on that build, cross-checked against OpenAI's published docs.
- Sources:
  - Non-interactive mode docs: <https://developers.openai.com/codex/noninteractive>
  - CLI command-line reference: <https://developers.openai.com/codex/cli/reference>
  - CLI features: <https://developers.openai.com/codex/cli/features>
  - Codex SDK docs: <https://developers.openai.com/codex/sdk>

> Note on versions: this doc reflects 0.135.0. Codex iterates quickly; re-run `codex exec --help` on the target machine to confirm flags before relying on anything marked experimental below.

## Overview

`codex exec` runs Codex non-interactively: it takes a prompt, runs the agent (model + tools + sandboxed shell) to completion, streams progress to **stderr** (or structured JSONL to **stdout** with `--json`), writes the final agent message to **stdout** (human mode) and optionally to a file (`-o`), then exits.

```text
Usage: codex exec [OPTIONS] [PROMPT]
       codex exec [OPTIONS] <COMMAND> [ARGS]

Commands:
  resume  Resume a previous session by id or pick the most recent with --last
  review  Run a code review against the current repository
  help    Print this message or the help of the given subcommand(s)
```

`codex e` is a documented short alias for `codex exec` (per OpenAI docs / community cheatsheets; not re-verified here).

## Providing the prompt

Three ways to feed the prompt (per `--help`):

1. **Positional argument**: `codex exec "fix the failing test"`.
2. **From stdin**: omit the prompt or pass `-` as the prompt. `cat prompt.txt | codex exec -`.
3. **Prompt + piped stdin combined**: if stdin is piped *and* a positional prompt is given, stdin is appended to the prompt inside a `<stdin>` block. Practical pattern: `npm test 2>&1 | codex exec "summarize the failures and propose a fix"`.

Images can be attached to the initial prompt with `-i/--image <FILE>...`.

## Flag reference (`codex exec`, v0.135.0)

Verbatim from `codex exec --help`:

| Flag | Description |
| --- | --- |
| `[PROMPT]` | Initial instructions. If absent or `-`, read from stdin. If stdin is piped *and* a prompt is given, stdin is appended as a `<stdin>` block. |
| `-c, --config <key=value>` | Override a config value from `~/.codex/config.toml`. Dotted path for nested keys (`foo.bar.baz`). Value parsed as TOML, falling back to a literal string. Examples: `-c model="o3"`, `-c 'sandbox_permissions=["disk-full-read-access"]'`, `-c shell_environment_policy.inherit=all`. |
| `--enable <FEATURE>` | Enable a feature (repeatable). Equivalent to `-c features.<name>=true`. |
| `--disable <FEATURE>` | Disable a feature (repeatable). Equivalent to `-c features.<name>=false`. |
| `--strict-config` | Error out when `config.toml` contains fields unrecognized by this Codex version. |
| `-i, --image <FILE>...` | Image(s) to attach to the initial prompt. |
| `-m, --model <MODEL>` | Model the agent should use. |
| `--oss` | Use open-source provider. |
| `--local-provider <OSS_PROVIDER>` | `lmstudio` or `ollama`; with `--oss`, else config default / selection prompt. |
| `-p, --profile <CONFIG_PROFILE_V2>` | Layer `$CODEX_HOME/<name>.config.toml` on top of base user config. |
| `-s, --sandbox <SANDBOX_MODE>` | Sandbox policy for model-generated shell commands. Values: `read-only`, `workspace-write`, `danger-full-access`. |
| `--dangerously-bypass-approvals-and-sandbox` | Skip all confirmation prompts and run without sandboxing. EXTREMELY DANGEROUS; only for externally-sandboxed environments. (Docs note `--yolo` as an alias.) |
| `--dangerously-bypass-hook-trust` | Run enabled hooks without persisted hook trust for this invocation. DANGEROUS; for automation that already vets hook sources. |
| `-C, --cd <DIR>` | Use `<DIR>` as the agent's working root. |
| `--add-dir <DIR>` | Additional directories writable alongside the primary workspace. |
| `--skip-git-repo-check` | Allow running Codex outside a Git repository. |
| `--ephemeral` | Run without persisting session/rollout files to disk. |
| `--ignore-user-config` | Do not load `$CODEX_HOME/config.toml`; auth still uses `CODEX_HOME`. |
| `--ignore-rules` | Do not load user or project execpolicy `.rules` files. |
| `--output-schema <FILE>` | Path to a JSON Schema file describing the model's final response shape (structured output). |
| `--color <COLOR>` | `always` \| `never` \| `auto` (default `auto`). |
| `--json` | Print events to stdout as JSONL. See [`json-events.md`](./json-events.md). |
| `-o, --output-last-message <FILE>` | Write the agent's final message to `<FILE>`. |
| `-h, --help` / `-V, --version` | Help / version. |

### Flags NOT shown by `--help` in 0.135.0 but documented

- `--full-auto` — documented as a **deprecated** compatibility flag; OpenAI docs say it prints a warning and recommend `--sandbox workspace-write` instead. It does not appear in the 0.135.0 `exec --help` output, so treat it as legacy. (Source: developers.openai.com/codex/cli/reference, /codex/noninteractive.)
- `--experimental-json` — OpenAI's CLI reference states `--json` and `--experimental-json` are **equivalent** ("Print newline-delimited JSON events instead of formatted text"). In 0.135.0, `exec --help` only lists `--json`; the structured thread-event schema documented in `json-events.md` is what `--json` now emits. Historically (`~`mid-2025) `--json` emitted a different, lower-level `codex/event` protocol and `--experimental-json` emitted the higher-level thread-event format; those have since converged. Verify on your build if you depend on a specific shape. (Sources: developers.openai.com/codex/cli/reference; openai/codex issues #4776, #5028.)

## Sandbox & approval behavior (headless)

- `-s/--sandbox` selects the filesystem/network policy for shell commands the model runs:
  - `read-only` — commands may read the workspace but not write.
  - `workspace-write` — commands may write within the workspace (and `--add-dir` dirs). This is the normal choice when Codex needs to edit files non-interactively.
  - `danger-full-access` — no sandbox restrictions; use only in controlled environments.
- **Approvals in non-interactive mode**: `codex exec` cannot prompt a human, so it does not pause for approvals. It runs within the selected sandbox; actions the sandbox forbids simply fail rather than escalating to an approval prompt. To run with no sandbox *and* no prompts (e.g. inside an already-isolated CI runner/container), use `--dangerously-bypass-approvals-and-sandbox`.
- For the typical "let it edit files and run commands" automation run: `--sandbox workspace-write` (optionally `--full-auto` on older builds). For "do anything, I've sandboxed the host myself": `--dangerously-bypass-approvals-and-sandbox`.

Verified locally: a `read-only` run completes normally for read-only tasks; a `workspace-write` run executes shell commands (e.g. `echo hi`) without any approval prompt.

## Structured output (`--output-schema`)

Pass a JSON Schema file; the final agent response is constrained to that schema. Combine with `-o` to capture it:

```bash
codex exec "Extract project metadata" \
  --output-schema ./schema.json \
  -o ./project-metadata.json
```

(Source: developers.openai.com/codex/noninteractive.)

## Resuming / continuing a session

`codex exec resume` continues a prior recorded session, optionally with a new prompt.

```text
Usage: codex exec resume [OPTIONS] [SESSION_ID] [PROMPT]
```

Key resume args/flags (verbatim from `codex exec resume --help`):

- `[SESSION_ID]` — Conversation/session id (UUID) **or** a thread name. A parseable UUID takes precedence. If omitted, use `--last`.
- `[PROMPT]` — Prompt to send after resuming. `-` reads it from stdin.
- `--last` — Resume the most recent recorded session (newest) without an id.
- `--all` — Show all sessions (disables the default cwd filtering).
- Resume also accepts `-c`, `--enable/--disable`, `-i/--image`, `--strict-config`, `-m/--model`, `--dangerously-bypass-approvals-and-sandbox`, `--dangerously-bypass-hook-trust`, `--skip-git-repo-check`, `--ephemeral`, `--ignore-user-config`, `--ignore-rules`, `--output-schema`, `--json`, and `-o/--output-last-message`.

Examples (from OpenAI docs):

```bash
codex exec resume --last "Fix the race conditions you found"
codex exec resume 7f9f9a2e-1b3c-4c7a-9b0e-... "Implement the plan"
```

### Session / thread ids and on-disk rollout files

- The `thread_id` emitted in the JSONL `thread.started` event **is** the session UUID you pass to `resume`.
- Unless `--ephemeral` is set, sessions are persisted as JSONL rollout files under `$CODEX_HOME/sessions/` (default `~/.codex/sessions/`), organized by date:

  ```text
  ~/.codex/sessions/YYYY/MM/DD/rollout-<ISO8601-timestamp>-<session-uuid>.jsonl
  ```

  Verified locally; the first line is a `session_meta` record containing `id` (the UUID), `cwd`, `cli_version`, model provider, and base instructions. This is a separate on-disk format from the `--json` event stream and is what `resume` reads.
- The SDK (`@openai/codex-sdk`) mirrors this: `resumeThread(savedThreadId)` reconstructs a thread from `~/.codex/sessions`. (Source: openai/codex SDK README.)

## Exit codes (scripted use)

Observed on 0.135.0; OpenAI docs do not publish an explicit table, so treat specific numbers as empirically determined:

- `0` — run completed successfully.
- `2` — CLI argument / parse error (clap convention; verified: `codex exec --nonexistent-flag` exits `2`).
- Non-zero — Codex docs state `exec` "exits non-zero if submission fails so you can wire it into scripts or CI." A required MCP server that fails to initialize causes a non-zero exit rather than continuing without it. (Sources: developers.openai.com/codex/cli/features, /codex/noninteractive.)

When parsing the JSONL stream, do not rely solely on the exit code — also check for a `turn.completed` event (success) versus a `turn.failed` / top-level `error` event. See `json-events.md`.

> Gap / to verify on a real install: the exact non-zero code(s) for model/runtime failures (auth error, network error, model stream failure) versus argument errors. Only `0` and `2` were confirmed here.

## MCP support in exec mode

- MCP servers configured in `config.toml` are available during `codex exec` runs; their tool calls appear in the JSONL stream as `mcp_tool_call` items (see `json-events.md`).
- If an MCP server is configured `required = true` and fails to initialize, `codex exec` exits with an error instead of continuing without it. (Source: developers.openai.com/codex/noninteractive.)
- Surfacing MCP server *startup* notifications in the JSONL stream is an open request (openai/codex issue #17501) — i.e. as of this writing, MCP startup status is not guaranteed to appear as discrete stream events. Verify against your build.

## Authentication for automation

- By default reuses saved CLI auth (ChatGPT login or stored key).
- `CODEX_API_KEY` env var supplies a key for a single run.
- For GitHub Actions, OpenAI provides `openai/codex-action`. For CI auth maintenance see developers.openai.com/codex/auth/ci-cd-auth.

(Source: developers.openai.com/codex/noninteractive.)

## Pattern: long-running detached run with JSONL progress monitoring

The practical, officially-aligned pattern is: run `--json`, redirect stdout to a file, and tail/parse that file for progress and completion. There is no separate "status" RPC for `exec`; the JSONL stream *is* the progress channel.

Launch detached, capturing the event stream and the final message:

```bash
# Working root explicit; workspace-write so it can edit; JSONL to a log; final msg to a file.
nohup codex exec \
  --json \
  -C /path/to/repo \
  --sandbox workspace-write \
  -o /tmp/codex-run.last.txt \
  "Do the big refactor described in TASK.md" \
  > /tmp/codex-run.jsonl 2> /tmp/codex-run.err &
echo "$!" > /tmp/codex-run.pid
```

Monitor progress (follow the stream and surface high-signal events):

```bash
# Live human-readable progress: agent messages, commands, and completion.
tail -f /tmp/codex-run.jsonl | while IFS= read -r line; do
  echo "$line" | jq -r '
    if .type=="item.completed" and .item.type=="agent_message" then "MSG: \(.item.text)"
    elif .type=="item.started"  and .item.type=="command_execution" then "RUN: \(.item.command)"
    elif .type=="item.completed" and .item.type=="command_execution" then "EXIT \(.item.exit_code): \(.item.command)"
    elif .type=="turn.completed" then "DONE usage=\(.usage)"
    elif .type=="turn.failed"   then "FAILED: \(.error.message)"
    elif .type=="error"         then "ERROR: \(.message)"
    else empty end'
done
```

Detect completion programmatically (poll the file; stop when a terminal event appears or the process exits):

```bash
pid=$(cat /tmp/codex-run.pid)
until ! kill -0 "$pid" 2>/dev/null; do sleep 2; done   # wait for process to exit
# Then classify the outcome from the last events:
tail -n 20 /tmp/codex-run.jsonl | jq -c 'select(.type=="turn.completed" or .type=="turn.failed")'
final_message=$(cat /tmp/codex-run.last.txt 2>/dev/null)
```

Notes:

- `--json` writes one JSON object per line to **stdout**; keep human/diagnostic noise on **stderr** (redirect separately as above).
- The stream is the only official progress surface for `exec`. There is no documented mid-run polling endpoint; tailing the JSONL file is the intended approach.
- A run is finished when you see a terminal `turn.completed` (success) or `turn.failed` / top-level `error` (failure) for the final turn, and/or the process exits. Cross-check with the exit code.
- `--output-last-message`/`-o` is the cleanest way to grab just the final answer without parsing the stream.
