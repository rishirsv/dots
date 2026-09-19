# Portal

## Value Proposition

Portal lets a Codex user run ChatGPT Web Pro as a model while preserving the
current Codex task's complete native tool set. It replaces a large standalone
capability broker with a small local bridge.

The target user is a local Codex user with a ChatGPT account that exposes Pro.
Today they must choose between Codex's native tool environment and ChatGPT Web
models, or maintain a separate permissioned Portal runtime. Portal makes the
combination a single model-picker choice.

**Core actions**: Start and authenticate the bridge, use ChatGPT Web Pro through
the Responses API, and dynamically invoke every tool exposed by the originating
Codex turn.

## Why an LLM Integration?

**Conversational win**: The user continues working in Codex and selects
ChatGPT Web Pro like any other model instead of moving prompts, context, and
tool results between applications.

**LLM contribution**: ChatGPT performs the reasoning and decides when to use
tools. Codex contributes the live task context and executes the actual tools.

**Missing capability supplied by Portal**: ChatGPT Web cannot directly reach a
local Codex task or its changing tool registry. Portal supplies the Responses
translation, authenticated browser session, tunnel, and per-turn correlation.

## User Experience

`portal start` is the primary entrypoint. It starts the supervised runtime,
opens ChatGPT login when required, guides one-time connector setup, verifies
Pro access and a real tool round trip, and installs Codex routing only after the
runtime is healthy.

`portal status` reports a compact readiness line or one actionable recovery
step. `portal login` repairs authentication. `portal stop` cancels active Portal
turns, restores the previous Codex route, and stops the runtime. `portal
uninstall` removes the integration while preserving login data unless the user
explicitly requests its deletion.

In Codex, the authenticated account's model catalog gains one routed model:
**ChatGPT Web — Pro**. Portal never silently substitutes another model. The
automated bridge does not mirror ChatGPT's model picker; users who want another
ChatGPT Web mode use a direct ChatGPT conversation and its native controls.

Conversation ownership is explicit. A Codex-originated task remains a Codex
conversation: all follow-ups and corrections are entered in Codex, while the
managed Chrome tab is only an execution surface. A direct ChatGPT conversation
that invokes `@Portal` remains a ChatGPT conversation. Portal does not synchronize
user-authored turns between those two surfaces.

## Product Context

- **Source product**: Dots plugin at `plugins/dots/`.
- **Reference implementation**: `miuuyy/codex-chatgpt-web`, pinned and
  attributed at the imported revision.
- **Authentication**: A persistent Chrome session captured by `portal login`
  and signed into ChatGPT Web. Portal does not implement a separate
  user-account system or ship an Electron/web UI.
- **Transport**: Loopback Responses API plus the reference tunnel required for
  ChatGPT's remote connector to reach the local bridge.
- **Model routing**: Native OpenAI models and endpoints pass through unchanged;
  Portal adds only `chatgpt-web/pro` after verifying account availability.
- **Tool policy**: Allow all actions. Portal forwards the complete tool registry
  supplied by the current Codex turn and makes no permission, grant, effect,
  family, root, or privacy decision.

## Architecture

Portal has five internal owners in one package:

1. **Runtime** owns the CLI-managed daemon, tunnel, active turns, cancellation,
   and the local lifecycle control channel.
2. **Codex integration** installs/restores routing, augments the live model
   catalog, preserves native endpoint behavior, and retains the official Voice
   route.
3. **Responses adapter** validates HTTP input, compiles context, streams
   Responses events, translates tool rounds, and supports compaction.
4. **Browser session** owns the login profile, task pages, Pro selection, and
   stable response identity.
5. **Tool bridge** discovers the current direct and gateway tools, dispatches
   exact wire names, and correlates calls and results to one logical turn.

ChatGPT sees two stable connector operations: `portal_tools` for discovery and
`portal_call` for invocation. Adding a Codex tool must not require a Portal
release or connector schema refresh. An omitted turn token means an explicit
direct ChatGPT call; a supplied turn token must remain bound to the originating
Codex turn and may never fall back to direct local execution.
Direct shell commands carry a fresh worker-prefixed operation ID per distinct
invocation; replaying the same ID returns only that command's result, and reusing
it with different arguments is rejected. After a worker restart, old IDs fail
closed because the earlier execution outcome is unknown.

The runtime keeps only transient state necessary for an active logical turn.
A logical turn may span multiple Responses requests while Codex executes tools,
so its opaque token, browser lease, pending calls, and results live until
completion or cancellation. Stable in-memory call IDs prevent transport retries
from invoking a tool twice. Portal does not persist operation receipts or replay
mutations after restart.

## Required HTTP Behavior

- `GET /healthz`
- `GET /v1/models`
- `POST /v1/responses`
- `POST /v1/responses/compact`
- WebSocket prewarm receives `426` so Codex promptly uses HTTP/SSE.
- Non-routed native Responses, Search, image, and related OpenAI endpoints pass
  through unchanged; Voice retains its official route.

## Explicit Non-Goals

- Fixed Portal capabilities or convenience wrappers.
- Portal-owned filesystem, terminal, browser, code, document, or image tools.
- Grants, permission families, approval queues, root restrictions, or network
  policy.
- Durable receipts, workspaces, writer epochs, rollback, job recovery, or a
  replay database.
- Redaction, privacy dashboards, document-fidelity policy, or content filters.
- Hosted relay accounts, OAuth, device pairing, Postgres, or multi-device use.
- Browser-only, Portal manual, Bigger Context, Luna checkpoint, alternate
  ChatGPT-model, dashboard, activity, or configurable transport modes.

## Completion Criteria

- Login survives daemon and machine restarts.
- ChatGPT Web — Pro appears only when the account exposes Pro and the browser
  actually selects Pro.
- Text, image, compaction, and multi-round tool conversations stream correctly.
- File, terminal, MCP/app, free-form, and nested subagent tools execute in the
  originating Codex task.
- New tools appear without a Portal or ChatGPT connector schema update.
- Concurrent tasks, cancellation, retries, and long-running tools preserve
  correct turn identity without deadlock or duplicate execution.
- A transient browser DOM probe stall after an accepted send retries observation
  on the same turn; it never resends the prompt.
- Connector refresh can rebuild an unsent composer, but only one verified prompt
  is submitted; the selected Pro effort is rechecked immediately before Send.
- A size rejection from the exact owned ChatGPT submission is reported as an
  input-limit error; an unexplained stopped response remains non-retryable.
- Native models, Search, image generation, and Voice continue to work.
- Authentication expiry, missing connector, usage exhaustion, UI drift, and
  restart loss are distinct actionable failures with no silent fallback.
- Stop and uninstall restore only configuration owned by Portal and preserve
  unrelated user edits.
