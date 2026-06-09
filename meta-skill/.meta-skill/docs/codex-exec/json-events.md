# `codex exec --json` — Streaming Event / Item Schema

When `--json` (a.k.a. `--experimental-json`; see note below) is passed to `codex exec`, **stdout becomes a JSON Lines (JSONL) stream**: one JSON object per line, each a top-level *thread event* with a `type` field. This is the machine-readable progress + result channel for headless runs.

- Version covered: **`codex-cli 0.135.0`** (local `--version`).
- Examples marked **VERIFIED** were captured from real local `codex exec --json` runs on 0.135.0. Examples marked **(doc)** come from OpenAI / SDK / community references and illustrate fields not exercised in the local runs (file changes, MCP, web search, todos, errors) — field names are taken from those sources and should be confirmed against your build if load-bearing.
- Sources:
  - Non-interactive mode: <https://developers.openai.com/codex/noninteractive>
  - CLI reference (`--json` == `--experimental-json`): <https://developers.openai.com/codex/cli/reference>
  - Codex SDK docs: <https://developers.openai.com/codex/sdk>
  - `exec --json` event cheatsheet (community): <https://takopi.dev/reference/runners/codex/exec-json-cheatsheet/>
  - JSON format history / convergence: openai/codex issues #4776, #5028; model-name request #14736; MCP startup notifications #17501.

> `--json` vs `--experimental-json`: OpenAI's CLI reference now states the two flags are equivalent and both "Print newline-delimited JSON events instead of formatted text." In 0.135.0 only `--json` is surfaced by `--help`, and it emits the structured thread-event schema documented here. Older builds emitted a different low-level `codex/event` protocol under `--json`; the formats have since converged. Verify on your build if you pin to a shape.

## Top-level structure

Every line is an object with a `type`. Two families:

- **Thread / turn lifecycle events**: `thread.started`, `turn.started`, `turn.completed`, `turn.failed`, and stream-level `error`.
- **Item events**: `item.started`, `item.updated`, `item.completed`, each carrying an `item` object whose `item.type` distinguishes the kind of work (agent message, reasoning, command, file change, MCP call, web search, todo list, item-level error).

A typical successful run looks like:

```jsonl
{"type":"thread.started","thread_id":"019ea9c4-12f5-7ec2-812c-5eec70006ffe"}
{"type":"turn.started"}
{"type":"item.started","item":{"id":"item_0","type":"command_execution","command":"/bin/zsh -lc 'echo hi'","aggregated_output":"","exit_code":null,"status":"in_progress"}}
{"type":"item.completed","item":{"id":"item_0","type":"command_execution","command":"/bin/zsh -lc 'echo hi'","aggregated_output":"hi\n","exit_code":0,"status":"completed"}}
{"type":"item.completed","item":{"id":"item_1","type":"agent_message","text":"It printed:\n\n```text\nhi\n```"}}
{"type":"turn.completed","usage":{"input_tokens":41235,"cached_input_tokens":4864,"output_tokens":46,"reasoning_output_tokens":0}}
```

The above is **VERIFIED** (captured from a local 0.135.0 run).

## Lifecycle events

### `thread.started`

Emitted once at the start. `thread_id` is the session UUID; pass it to `codex exec resume <id>`.

```json
{"type":"thread.started","thread_id":"019ea9c4-12f5-7ec2-812c-5eec70006ffe"}
```

**VERIFIED.** On a `resume`, the existing thread id is reported here.

### `turn.started`

Marks the beginning of an agent turn. No payload in 0.135.0.

```json
{"type":"turn.started"}
```

**VERIFIED.**

### `turn.completed`

Terminal success event for a turn; carries token usage.

```json
{"type":"turn.completed","usage":{"input_tokens":41235,"cached_input_tokens":4864,"output_tokens":46,"reasoning_output_tokens":0}}
```

**VERIFIED.** `usage` fields observed: `input_tokens`, `cached_input_tokens`, `output_tokens`, `reasoning_output_tokens`. (Some docs show `usage` without `reasoning_output_tokens`; 0.135.0 includes it.)

### `turn.failed`

Terminal failure event for a turn; carries an error object.

```json
{"type":"turn.failed","error":{"message":"model response stream ended unexpectedly"}}
```

**(doc.)** Treat a `turn.failed` as a failed run even if the process exit code is ambiguous.

### `error` (stream-level)

A top-level error not tied to a specific item.

```json
{"type":"error","message":"stream error: broken pipe"}
```

**(doc.)**

## Item events and item types

Item lifecycle: `item.started` → (`item.updated`)\* → `item.completed`. Not every item type emits all three; many only emit `item.completed`. Every `item` has `id` (e.g. `"item_0"`) and `type`.

### `agent_message`

The assistant's natural-language output. Emitted as `item.completed`.

```json
{"type":"item.completed","item":{"id":"item_1","type":"agent_message","text":"It printed:\n\n```text\nhi\n```"}}
```

**VERIFIED.** Field: `text` (string). The final `agent_message` text is also what `--output-last-message`/`-o` writes to a file.

### `reasoning`

Model reasoning summary, when reasoning is enabled/visible. Emitted as `item.completed`.

```json
{"type":"item.completed","item":{"id":"item_0","type":"reasoning","text":"**Scanning docs for exec JSON schema**"}}
```

**(doc.)** Field: `text`. Did not appear in the local low-effort runs (no reasoning summary emitted); presence depends on model/reasoning settings.

### `command_execution`

A shell command the agent ran in the sandbox. Emitted as `item.started` (status `in_progress`) then `item.completed` (status `completed`).

```json
{"type":"item.started","item":{"id":"item_0","type":"command_execution","command":"/bin/zsh -lc 'echo hi'","aggregated_output":"","exit_code":null,"status":"in_progress"}}
{"type":"item.completed","item":{"id":"item_0","type":"command_execution","command":"/bin/zsh -lc 'echo hi'","aggregated_output":"hi\n","exit_code":0,"status":"completed"}}
```

**VERIFIED.** Fields:

- `command` (string) — the full command line as executed (note the `/bin/zsh -lc '...'` wrapper).
- `aggregated_output` (string) — combined stdout/stderr; empty at start, filled on completion.
- `exit_code` (int|null) — `null` while in progress, the process exit code on completion.
- `status` (`in_progress` | `completed`).

### `file_change`

A set of file edits the agent applied. Emitted as `item.completed`.

```json
{"type":"item.completed","item":{"id":"item_4","type":"file_change","changes":[{"path":"docs/exec-json-cheatsheet.md","kind":"add"},{"path":"docs/exec.md","kind":"update"}],"status":"completed"}}
```

**(doc.)** Fields: `changes` (array of `{path, kind}` where `kind` is `add`|`update`|delete-style), `status`.

### `mcp_tool_call`

A call to a tool exposed by a configured MCP server. Emitted as `item.started` then `item.completed`.

```json
{"type":"item.started","item":{"id":"item_5","type":"mcp_tool_call","server":"docs","tool":"search","arguments":{"q":"exec --json"},"result":null,"error":null,"status":"in_progress"}}
{"type":"item.completed","item":{"id":"item_5","type":"mcp_tool_call","server":"docs","tool":"search","arguments":{"q":"exec --json"},"result":{"content":[{"type":"text","text":"Found 3 matches.","annotations":{"audience":["assistant"],"lastModified":"2025-01-01T00:00:00Z","priority":0.5}}],"structured_content":{"matches":3}},"error":null,"status":"completed"}}
```

**(doc.)** Fields: `server`, `tool`, `arguments` (object), `result` (MCP result with `content[]` blocks and optional `structured_content`), `error` (null on success), `status`. See MCP content block types below.

### `web_search`

A web search the agent performed. Emitted as `item.completed`.

```json
{"type":"item.completed","item":{"id":"item_7","type":"web_search","query":"codex exec --json schema"}}
```

**(doc.)** Field: `query`.

### `todo_list`

The agent's plan / task list. Emitted as `item.started`, `item.updated` (as items get checked off), and `item.completed`.

```json
{"type":"item.started","item":{"id":"item_8","type":"todo_list","items":[{"text":"Scan docs","completed":false},{"text":"Write cheatsheet","completed":false}]}}
{"type":"item.updated","item":{"id":"item_8","type":"todo_list","items":[{"text":"Scan docs","completed":true},{"text":"Write cheatsheet","completed":false}]}}
{"type":"item.completed","item":{"id":"item_8","type":"todo_list","items":[{"text":"Scan docs","completed":true},{"text":"Write cheatsheet","completed":true}]}}
```

**(doc.)** Field: `items` (array of `{text, completed}`). This is the one item type that meaningfully uses `item.updated`.

### `error` (item-level)

An error attached to a specific item. Emitted as `item.completed`.

```json
{"type":"item.completed","item":{"id":"item_9","type":"error","message":"command output truncated"}}
```

**(doc.)** Field: `message`.

## MCP result content block types

Inside an `mcp_tool_call` `result.content[]` (and embedded resources), blocks follow the MCP content model **(doc)**:

- `text`: `{"type":"text","text":"Hello","annotations":{...}}`
- `image`: `{"type":"image","data":"<base64>","mimeType":"image/png","annotations":{...}}`
- `audio`: `{"type":"audio","data":"<base64>","mimeType":"audio/wav","annotations":{...}}`
- `resource_link`: `{"type":"resource_link","name":"...","uri":"...","description":"...","mimeType":"...","size":1234,"title":"...","annotations":{...}}`
- `resource` (embedded): `{"type":"resource","resource":{"uri":"...","text":"...","mimeType":"..."},"annotations":{...}}`

`annotations` may include `audience`, `lastModified`, `priority`.

## Parsing guidance

- Read line by line; each line is independent JSON. Tolerate unknown `type` / `item.type` values (forward-compatibility) — Codex adds item kinds over time.
- Success = a terminal `turn.completed`; failure = `turn.failed` or a top-level `error`. Cross-check the process exit code (see `README.md`).
- The final answer text = the last `agent_message` `item.completed`, or just read the file from `-o/--output-last-message`.
- For live progress, key off `item.started`/`item.completed` of `command_execution`, `file_change`, and `mcp_tool_call`, plus `todo_list` updates.

## Known gaps / verify on a real install

- **Model name** is not currently included in `--json` output (open request: openai/codex #14736). Don't expect a `model` field in events.
- **MCP startup notifications** are not guaranteed in the stream (open request #17501).
- `reasoning`, `file_change`, `mcp_tool_call`, `web_search`, `todo_list`, item-level `error`, `turn.failed`, and stream-level `error` examples here are from docs/cheatsheet, not the local capture — confirm exact field names/shapes against your target Codex version before depending on them.
- The historical divergence between `--json` and `--experimental-json` means very old or very new builds could differ; re-capture a sample run if precision matters.
