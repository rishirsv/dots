# Portal tool calls

Read this when ChatGPT is executing a Portal-backed Codex turn. The visible MCP
schemas and current inventory win over these examples if the runtime changes.
The examples use `TURN_TOKEN` as an inert placeholder, never a usable credential.

## The call path

`Codex task → Portal → ChatGPT → Portal MCP → that Codex task's tools → ChatGPT`

Portal supplies a fresh `turn_token` in the full-mode transport message. Pass it
unchanged to every MCP call in that response. Do not print it, store it in files,
ask the user to obtain one, or reuse it after the response completes. Tool
results return to the same response; Codex remains the execution owner.

The automatic full-mode contract does not use `codex_turn_start` or
`codex_turn_complete`. Those belong to upstream's separate manual/Zero Risk
protocol. Finish an automatic turn with the normal assistant answer.

## Choose a tool

| Need | MCP tool | Essential input and result handling |
|---|---|---|
| Find a local or connected tool | `codex_tool_inventory` | `turn_token`, focused `query`, `include_schema: true`; consume `tools`, `next_offset`, and any `discovery_tools`. |
| Call a discovered tool | `codex_tool_call` | `turn_token`, exact `wire_name`; send structured `arguments` or freeform `input` according to its kind. |
| Execute a shell command | `codex_exec` | `turn_token`, `cmd`, optional `workdir`, `yield_time_ms`, `max_output_tokens`; inspect exit status or retain a returned `session_id`. |
| Continue a running command | `codex_write_stdin` | `turn_token`, returned `session_id`, optional `chars`; omit characters to poll. Continue until completion or an actual blocker. |
| Edit local text files | `codex_apply_patch` | `turn_token`, complete patch string in `patch`; inspect the native file-change result. |
| Inspect an existing local image | `codex_view_image` | `turn_token`, absolute `path`, optional supported `detail`; use the returned image, not a guessed description. |

The convenience tools resolve the current harness's corresponding native tool;
they do not create tools that the harness lacks. Use them for the usual command,
patch, session, and image operations when available. For other operations,
discover and call the exact tool rather than guessing a namespace.

### Discovery and generic calls

An inventory request might be:

```json
{"turn_token":"TURN_TOKEN","query":"exec_command","limit":5,"include_schema":true}
```

Read each entry's `wire_name`, `kind`, description, and parameters. Preserve the
returned wire name literally, including namespace separators. If the inventory
returns a function named `functions__exec_command` with a `cmd` parameter, this
is a corresponding call—not a universal name to assume:

```json
{"turn_token":"TURN_TOKEN","wire_name":"functions__exec_command","arguments":{"cmd":"pwd","workdir":"/absolute/task-directory","max_output_tokens":1000}}
```

For `kind: freeform`, put the tool's raw input in `input`, not in a JSON object
inside `arguments`. For `kind: gateway`, read the declaration embedded in its
description to determine whether it expects an object or freeform text. Do not
send both a nonempty `arguments` object and `input`.

An empty filtered result may include `discovery_tools`. Invoke that advertised
discovery tool with its own schema, then inspect the newly available tools.
If neither direct nor deferred discovery exposes the required operation, report
that capability as absent from this task rather than guessing a tool name.

### A command, its session, and a patch

Run a bounded read in the task directory:

```json
{"turn_token":"TURN_TOKEN","cmd":"cat canary.txt","workdir":"/absolute/task-directory","yield_time_ms":1000,"max_output_tokens":1000}
```

If a command returns `session_id: 42` instead of completing, poll that actual
session with `codex_write_stdin`:

```json
{"turn_token":"TURN_TOKEN","session_id":42,"yield_time_ms":1000,"max_output_tokens":1000}
```

The number here is illustrative; never invent a session ID. A `functions.exec`
gateway may instead yield a **cell ID**. Resume that cell with the advertised
native `functions.wait` tool and its schema. A cell ID is not a shell session ID.

To add a task-owned file with `codex_apply_patch`, send a real native patch:

```json
{"turn_token":"TURN_TOKEN","patch":"*** Begin Patch\n*** Add File: /absolute/task-directory/result.txt\n+observed canary content\n*** End Patch"}
```

Replace the example content with what was actually read. Verify the resulting
file with a local read or comparison before claiming success. Preserve existing
user changes when editing a real repository.

Only include native sandbox/approval parameters if the current tool schema and
task policy permit them. Do not add `sandbox_permissions` by habit; some Codex
sessions explicitly forbid the field. ChatGPT's connector permissions and
Codex's own approvals are separate, and this skill changes neither.

## Code Mode and subagents

If the inventory exposes freeform `exec`, it is a JavaScript tool orchestrator,
not a shell command string. Its description supplies the available helpers.
Use `ALL_TOOLS` to find exact nested tool names and declarations, then call
`tools.<returnedName>(...)` and emit useful results with the documented helper.
Never assume Node, filesystem, or network APIs exist in that JavaScript isolate.

Use discovered spawn/send/wait tools for subagent work. Keep agent IDs with their
assigned scope and collect the finished result before integration. Do not make
a new user-visible Codex task merely to obtain a subagent.

Portal currently requires native `wait_agent` calls to use
`timeout_ms: 30000`, including calls through Code Mode. This releases the shared
MCP channel so a Web-backed child can make its own tool calls. On timeout,
consume any progress, do independent work, then wait again if needed. Retain
the tool's other declared argument names; do not replace them with this guide's
terminology. Use shell-session polling for commands and agent waiting for
agents—the two lifecycles are different.

## Interpret failures before retrying

- **Schema or unavailable-tool error:** reread the current schema/inventory and
  correct the mismatched call. Do not broaden the operation.
- **Expired turn/binding:** stop using that capability. A new user turn gets a
  new runtime capability; a copied token is not a recovery method.
- **Approval denial or execution guard:** preserve the exact error without
  secrets and identify whether ChatGPT, Portal, or Codex rejected it. Do not
  rephrase or reroute the same denied operation to avoid the guard.
- **Lost response after a write:** inspect the intended result before retrying;
  a missing response does not prove that nothing happened.
- **Long-running result:** continue its documented session/cell/agent lifecycle;
  a timeout alone does not mean that work failed or finished.
