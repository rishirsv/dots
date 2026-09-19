# Portal

## Value Proposition

Portal lets a Codex user run ChatGPT Web thinking modes as models while preserving
the current Codex task's complete native tool set. It replaces a large standalone
capability broker with a small local bridge.

The target user is a local Codex user with a ChatGPT account that exposes GPT-5.6 Sol.
Today they must choose between Codex's native tool environment and ChatGPT Web
models, or maintain a separate permissioned Portal runtime. Portal makes the
combination a single model-picker choice.

**Core actions**: Start and authenticate the bridge, choose a verified ChatGPT
Web mode through the Responses API, and dynamically invoke every tool exposed
by the originating Codex turn.

## Why an LLM Integration?

**Conversational win**: The user continues working in Codex and selects
ChatGPT Web thinking modes like any other model instead of moving prompts, context, and
tool results between applications.

**LLM contribution**: ChatGPT performs the reasoning and decides when to use
tools. Codex contributes the live task context and executes the actual tools.

**Missing capability supplied by Portal**: ChatGPT Web cannot directly reach a
local Codex task or its changing tool registry. Portal supplies the Responses
translation, authenticated browser session, tunnel, and per-turn correlation.

## User Experience

`portal start` is the primary entrypoint. It starts the supervised runtime,
opens ChatGPT login when required, guides one-time connector setup, verifies
Sol access and a real tool round trip, and installs Codex routing only after the
runtime is healthy.

`portal status` reports a compact readiness line or one actionable recovery
step. `portal login` repairs authentication. `portal stop` cancels active Portal
turns, restores the previous Codex route, and stops the runtime. `portal
uninstall` removes the integration while preserving login data unless the user
explicitly requests its deletion.

In Codex, an authenticated Sol account gains separate routed models for
**ChatGPT Web — Instant, Medium, High**, plus **Extra High** and **Pro** when
the account probe observes those choices. The non-Pro routes explicitly select
and verify GPT-5.6 Sol before choosing their fixed thinking level. They fail
before Send when Sol or the requested level cannot be verified; they never
silently use the current "Latest" or Pro selection. The existing Pro route
remains a compatibility alias for the account-selected Pro family, not proof
of a specific underlying model family. Portal does not add a second model
picker or natural-language model router.

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
  ChatGPT's remote connector to reach the local bridge. A Codex task holds one
  ChatGPT Web conversation: the Launcher browser host owns the Chrome surfaces
  and leases a retained conversation per Codex thread, so follow-up turns
  continue the same visible chat instead of opening a new Temporary Chat.
- **Model routing**: Native OpenAI models and endpoints pass through unchanged;
  Portal adds fixed Web thinking-level routes after verifying account
  availability. Non-Pro routes bind GPT-5.6 Sol explicitly.
- **Tool policy**: Allow all actions. Portal forwards the complete tool registry
  supplied by the current Codex turn and makes no permission, grant, effect,
  family, root, or privacy decision.

## Architecture

Portal has six internal owners in one package:

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
6. **Launcher browser host** owns the Chrome process and its surfaces, publishes
   a loopback CDP endpoint and token-authenticated control channel through a
   descriptor file, and leases one retained conversation per Codex thread. It is
   the only owner of retention state: which surface holds which conversation,
   whether a lease reused one, and when a user closed the tab.

ChatGPT sees two stable connector operations: `portal_tools` for discovery and
`portal_call` for invocation. Adding a Codex tool must not require a Portal
release or connector schema refresh. An omitted turn token means an explicit
direct ChatGPT call; a supplied turn token must remain bound to the originating
Codex turn and may never fall back to direct local execution.
Discovery identifies `portal_call` as the only invocation operation and tells
ChatGPT to report its absence instead of repeatedly searching the registry.
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
If browser failure revokes the tool capability while the adapter is waiting for
tool batches, the browser's typed outcome remains authoritative; a resulting
expected broker-revocation error must not replace it.

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
- Browser-only, Portal manual, zero-risk, Bigger Context, Luna checkpoint,
  alternate ChatGPT-model families beyond the verified Sol thinking levels and
  existing Pro alias, dashboard, or activity modes. The Launcher browser host is
  in scope only as the retained-conversation transport described above; the
  manual and zero-risk turn flows that share that host stay out of scope, and
  the host remains a local Chrome-owning process, never an Electron or web UI.

## Completion Criteria

- Login survives daemon and machine restarts.
- The non-Pro Web routes appear only when the browser probe verifies Sol;
  Extra High and Pro require their own observed capabilities. Non-Pro routes
  select and retain Sol plus the requested thinking level before Send. Oversized
  multipart staging cannot upgrade a non-Pro turn to Pro. No automated live test
  consumes a Pro model turn just to validate the lower-level routes.
- One Codex thread maps to one retained ChatGPT conversation across turns, and
  each subagent thread gets its own. Losing a surface degrades to a fresh
  conversation instead of failing the turn. Changing the routed model or
  thinking level deliberately starts a new conversation.
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
  input-limit error. Other explicit failures from that request are classified
  by their HTTP status or structured terminal code without retaining prompt,
  answer, or tool-result contents; an unexplained stopped response remains
  non-retryable. A Temporary Chat page that fails to load is not labeled an
  expired login without separate authentication evidence; before any send, a
  missing composer gets one bounded reload, then a specific terminal surface
  error instead of an unknown failure and a revoked-binding retry loop.
- Native models, Search, image generation, and Voice continue to work.
- Authentication expiry, missing connector, usage exhaustion, UI drift, and
  restart loss are distinct actionable failures with no silent fallback.
- Stop and uninstall restore only configuration owned by Portal and preserve
  unrelated user edits.
