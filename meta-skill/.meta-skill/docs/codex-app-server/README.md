# Codex App Server and SDK Reference

Reference notes for OpenAI's experimental Codex App Server protocol, captured
from the locally installed `codex-cli 0.135.0`, plus the official Codex SDK
docs.

This is the reference for Meta Skill's `codex_app_server` runner. The runner key
stays stable, but the implementation should be Python-first through the official
`openai-codex` SDK. The SDK controls the local App Server over JSON-RPC and
installs its Codex CLI runtime dependency through normal Python packaging. Keep
`codex_exec` as the fallback for simple fire-and-collect batch execution.

## Version Covered

- Captured against local `codex-cli 0.135.0`.
- Generated with experimental fields included.
- Official App Server docs: <https://developers.openai.com/codex/app-server>.
- Official Codex SDK docs: <https://developers.openai.com/codex/sdk>.
- Python SDK install: `pip install --upgrade openai-codex`.
- Python requirement: 3.10 or later. The Meta Skill CLI wrapper creates a
  per-user virtual environment and upgrades `src/requirements.txt` before
  execution so plugin source stays portable across users.

Regenerate before implementing against a newer CLI:

```sh
rm -rf meta-skill/.meta-skill/docs/codex-app-server/schema meta-skill/.meta-skill/docs/codex-app-server/typescript
mkdir -p meta-skill/.meta-skill/docs/codex-app-server/schema meta-skill/.meta-skill/docs/codex-app-server/typescript
codex app-server generate-json-schema --experimental --out meta-skill/.meta-skill/docs/codex-app-server/schema
codex app-server generate-ts --experimental --out meta-skill/.meta-skill/docs/codex-app-server/typescript
```

## Local Help Surface

```text
codex app-server [OPTIONS] [COMMAND]

Commands:
  daemon                Manage the local app-server daemon
  proxy                 Proxy stdio bytes to the running app-server control socket
  generate-ts           [experimental] Generate TypeScript bindings for the app server protocol
  generate-json-schema  [experimental] Generate JSON Schema for the app server protocol
```

The server can listen on `stdio://`, `unix://`, `unix://PATH`, `ws://IP:PORT`,
or `off`. WebSocket listeners support capability-token or signed-bearer-token
auth modes.

## Generated Artifacts

```text
meta-skill/.meta-skill/docs/codex-app-server/
  README.md
```

Do not commit generated schema/type snapshots unless implementation starts
consuming them directly. They drift with Codex releases and create review noise.
Regenerate them locally when inspecting protocol changes, then delete the
generated `schema/` and `typescript/` folders before committing. Meta Skill's
App Server adapter source belongs under `meta-skill/src/`.

## Why App Server Is Different From `codex exec`

`codex exec` is fire-and-collect:

```text
prompt -> JSONL stream -> final message -> process exits
```

It is ideal for simple eval trials, CI-like automation, and fallback execution
because it is scriptable, file-backed, and easy to monitor through
`events/<trial-id>.jsonl` plus `progress.jsonl`.

`codex app-server` is a persistent bidirectional control plane:

```text
client <-> socket protocol <-> live Codex threads, turns, approvals, events
```

The Python SDK removes the earlier Node/TypeScript runtime objection. Use the
Python SDK for the primary Meta Skill adapter; keep the generated TypeScript
files as protocol evidence and for a future product UI or Node sidecar.

App Server is worth using when Meta Skill needs one of these capabilities:

1. **Live write gating.** The protocol exposes command, patch, file-change, and
   permission approval requests such as
   `item/commandExecution/requestApproval`,
   `item/fileChange/requestApproval`, `execCommandApproval`, and
   `applyPatchApproval`.
2. **Live multi-turn sessions.** Client requests include `thread/start`,
   `thread/resume`, `thread/fork`, `turn/start`, and `turn/steer`.
3. **Graceful interrupt and steering.** Client requests include
   `turn/interrupt`, allowing cancellation or redirection without treating the
   run as only a killed process.
4. **Persistent multi-conversation control.** Client requests include
   `thread/list`, `thread/search`, `thread/read`, `thread/turns/list`, and
   `thread/turns/items/list`.
5. **Typed telemetry.** Server notifications include `thread/started`,
   `thread/status/changed`, `turn/started`, `turn/completed`, `item/started`,
   `item/completed`, token usage updates, deltas, and
   `serverRequest/resolved`.
6. **Desktop/watchable integration.** The protocol is the same class of control
   plane rich Codex clients use, so it is the future path for consultant-visible
   live attempts.

## Functionality Used By The Plugin

Worker skills and future agents should not call raw App Server JSON-RPC methods.
The plugin exposes App Server through the central CLI and normalizes all evidence
back into `.meta-skill/runs/<run-id>/`.

The V1 workbench should expose only the eval-shaped surface: run, progress,
grade, validate, and package. Behind `eval run`, the App Server adapter may use:

1. **Thread lifecycle**: start, resume, fork, read, list, and bind thread ids to
   candidates, cases, trials, and runs.
2. **Multi-turn evaluation**: replay conversational cases in one live thread so
   a skill can clarify, receive answers, and repair in context.
3. **Streaming progress**: map turn, item, command, file-change, approval, and
   token events into compact `progress.jsonl` rows.
4. **Durable event capture**: persist raw or normalized event streams under
   `events/<trial-id>.jsonl`.
5. **Approval-gated writes**: handle command, file-change, patch, permission,
   and network approvals with policies such as candidate-worktree-only.
6. **Sandbox control**: run judge turns read-only and candidate editor turns with
   explicit workspace-write boundaries.
7. **Interrupt and steer**: stop runaway work, enforce budgets, or steer active
   turns without killing the whole run.
8. **Fork and rollback**: support Attempt workflows that branch, compare, and
   recover from failed turns.
9. **Model and cost attribution**: record model, token usage, cached tokens,
   output tokens, reasoning tokens when available, and derived cost estimates.
10. **Skill/plugin inventory checks**: verify the installed skill/plugin payload
    when runtime visibility matters.

Do not turn each protocol capability into a separate V1 CLI command. Add public
commands for resume, stop, steer, cost accounting, or approval policy only after
a real eval/autoresearch case proves that the extra surface removes complexity.

## What App Server Does Not Replace

App Server does not make every one-shot eval trial simpler. `codex exec` already
covers the plain fire-and-collect case:

- one prompt to completion
- JSONL events
- final output capture
- structured final output for judge/control children
- fixed sandbox and approval policy
- resume-by-id for persisted sessions

The App Server delta is liveness, bidirectionality, typed protocol control, and
in-loop approvals.

## Meta Skill Position

Use `codex_app_server` through the Python SDK as the primary workbench runner
for evals that benefit from liveness, multi-turn control, approvals, monitoring,
or autoresearch.

Use `codex_exec` as the fallback for:

- simple one-shot batch trials
- CI-style automation
- judge/control children with `--output-schema`
- environments where the SDK or App Server protocol breaks

Keep the runner seam. App Server is still version-sensitive, and durable eval
evidence must live in run files rather than only in live thread state.
