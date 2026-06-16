# Codex App Server Thread Capabilities Research

## Question

What can Meta Skill safely build on top of Codex App Server for thread-backed
evals, progress monitoring, thread inspection, and future enterprise workbench
features?

## Executive Read

Codex App Server is the right integration surface for a Meta Skill workbench
that wants durable Codex sessions, streamed progress, approval flows, and
future multi-turn evaluation. OpenAI describes App Server as the full Codex
harness exposed through a stable, UI-friendly, bidirectional JSON-RPC event
stream, with thread lifecycle, persistence, auth/config, sandboxed tool
execution, skills, MCP, and approvals handled by the runtime:
https://openai.com/index/unlocking-the-codex-harness/

For Meta Skill, the supported shape is:

```text
Meta Skill CLI / workbench controller
  -> openai-codex Python SDK
  -> Codex App Server runtime
  -> Codex thread / turn / item stream
  -> .meta-skill/runs/<run-id>/ evidence
```

Meta Skill should not implement its own App Server. It should wrap the official
runtime through a small Python adapter and persist only workbench-specific
evidence and identifiers.

## What Is Officially Available

The App Server protocol exposes three core primitives: thread, turn, and item.
The OpenAI App Server README describes a thread as a conversation, a turn as one
unit of model execution, and an item as persisted typed input/output such as a
user message, agent message, shell command, file edit, or tool action:
https://raw.githubusercontent.com/openai/codex/main/codex-rs/app-server/README.md

The protocol supports:

- `thread/start`: create a new thread.
- `thread/resume`: reopen an existing stored thread.
- `thread/fork`: copy stored history into a new thread id.
- `thread/list`: page through stored threads with filters.
- `thread/loaded/list`: list thread ids currently loaded in that App Server
  process.
- `thread/read`: read stored thread data without resuming it.
- `thread/turns/list`: page through thread turn history, currently marked
  experimental in the protocol.
- `thread/archive` and `thread/unarchive`: manage persisted thread history.
- `thread/status/changed`: receive loaded-thread status updates.
- `turn/start`, `turn/steer`, and `turn/interrupt`: run, steer, or stop turns.
- `item/*` notifications: observe the authoritative item lifecycle.

Source: App Server API overview and lifecycle docs:
https://raw.githubusercontent.com/openai/codex/main/codex-rs/app-server/README.md

The Python SDK exposes the same useful surface for our purposes: `Codex`,
`AsyncCodex`, `thread_start`, `thread_resume`, `thread_fork`, `thread_list`,
`thread_archive`, `thread_unarchive`, `Thread.read`, `Thread.run`,
`Thread.turn`, `TurnHandle.stream`, `TurnHandle.steer`, and
`TurnHandle.interrupt`. It returns `TurnResult` with final response, items, and
token usage:
https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/api-reference.md

## Thread Visibility Boundaries

Meta Skill can confidently do these things:

- Create one Codex thread per eval trial and store `thread.id`, turn id,
  status, timestamps, cwd, model, sandbox mode, and token usage in the run
  record.
- Resume or read threads that the runner created, as long as the stored thread
  id is kept in `run.json` or `results.jsonl`.
- Fork a stored thread to create a candidate repair or follow-up investigation
  thread.
- List stored local threads through the App Server process it controls or is
  connected to.
- Monitor live turns that the runner started by streaming notifications and
  folding `item/*` and `turn/*` events into run evidence.

Meta Skill should treat these as limited or unsupported:

- Seeing every live thread open in Codex Desktop is not guaranteed by the
  public plugin surface. App Server can list loaded threads for the connected
  process, but official docs do not promise that a plugin can attach to an
  arbitrary Desktop-owned App Server process.
- `thread/loaded/list` is protocol-documented, but the current high-level
  Python SDK surface should not be treated as a Desktop-wide active-thread
  inspector. Treat loaded-thread listing as protocol-only until an intentional
  low-level adapter or public SDK helper is implemented and verified.
- Reading arbitrary Desktop threads from a plugin is not documented as a stable
  plugin capability. The stable path is an App Server client with access to the
  same Codex home and thread store.
- Hook transcript paths are not a stable thread API. OpenAI hook docs expose
  `session_id`, `transcript_path`, `cwd`, and sometimes `turn_id`, but warn that
  transcript format is a convenience and not a stable interface:
  https://developers.openai.com/codex/hooks

Practical interpretation: Meta Skill should own the eval threads it starts, and
it may add thread import/list/read commands for stored Codex threads, but it
should not promise "show me all current Desktop threads" unless a future
official remote-control or shared App Server attachment path is documented and
verified.

## What The Migration Should Enable Now

The Python App Server runner migration should enable these capabilities
directly:

- A named App Server adapter module instead of a buried `app_server_run`
  function.
- One App Server thread per eval trial, with thread id and turn id captured in
  run artifacts.
- Streaming trial events into per-trial event files without interleaving.
- Folding App Server items into a compact evidence object and `final.md`.
- Token usage capture from `TurnResult` or token usage notifications.
- Persistent App Server trial threads by default, with ephemeral threads
  reserved for explicit disposable smoke tests.
- SDK/runtime version capture in run evidence.
- Current-SDK sandbox and approval mode mapping through one local policy module.
- `eval progress` backed by compact run files while raw events remain
  inspectable.
- A `doctor` check that verifies the Python SDK, runtime metadata, auth/account
  state, and required public SDK symbols.

## Future App Server Capabilities Worth Exposing

These are available or strongly implied by the App Server surface but should not
all ship in the refactor:

- `threads list`: show stored Codex threads filtered by cwd/source/archived
  status.
- `threads read`: inspect a stored thread without resuming it.
- `threads fork`: create a new candidate or repair thread from an existing
  thread.
- `threads resume`: continue a prior eval, repair, or research thread.
- `threads loaded`: protocol-only for now; show loaded thread ids in the
  connected App Server process only after an SDK/helper or low-level adapter is
  chosen and verified.
- `turn interrupt`: stop a runaway eval trial without killing the runner.
- `turn steer`: add a correction to an in-flight trial or repair thread.
- live approval routing: handle command/file approval requests in the workbench
  controller instead of relying on fixed policies.
- permission profiles: use named App Server permission profiles once the Python
  SDK exposes a stable public surface for them.
- automated review: call App Server `review/start` for thread-level review
  workflows.
- model listing: use `model/list` through SDK/runtime once the Python SDK shape
  is verified.
- skills/plugin inspection: use `skills/list` and plugin listing for diagnosing
  why a skill was or was not available to a solver.
- filesystem watch or sandbox command execution for richer progress displays,
  only after the core eval runner is stable.

## Recommended Architecture Implication

The plugin should contain a clear module boundary:

```text
meta-skill/src/meta_skill/app_server/
  client.py       # Codex / AsyncCodex construction, version, auth, metadata
  trial.py        # one persistent thread and turn for one eval trial
  evidence.py     # raw event writing and compact evidence writing
  policy.py       # current SDK Sandbox and ApprovalMode mapping
```

Everything outside this package should speak Meta Skill concepts: suite, case,
candidate, trial, run, grade. Only `app_server/` should speak App Server
concepts directly.

## Caveats

- `openai-codex` is public beta; public APIs may change before 1.0:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/faq.md
- The SDK installs a compatible runtime dependency automatically, which helps
  portability but still means we must verify behavior on the installed version:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/getting-started.md
- App Server supports schema generation from the local `codex` version. Schema
  snapshots are version-specific and should be regenerated when the runtime
  changes:
  https://raw.githubusercontent.com/openai/codex/main/codex-rs/app-server/README.md
- Thread visibility is scoped by process/runtime and Codex home. "Stored local
  threads" is a safe claim; "all currently open Desktop threads" is not.
  Loaded-thread inspection is protocol-level, not V1 SDK-backed behavior.

## Source Map

- OpenAI App Server architecture:
  https://openai.com/index/unlocking-the-codex-harness/
- App Server protocol README:
  https://raw.githubusercontent.com/openai/codex/main/codex-rs/app-server/README.md
- Python SDK README:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/README.md
- Python SDK getting started:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/getting-started.md
- Python SDK API reference:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/api-reference.md
- Python SDK FAQ:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/faq.md
- Codex hooks:
  https://developers.openai.com/codex/hooks
- Codex permissions:
  https://developers.openai.com/codex/permissions
