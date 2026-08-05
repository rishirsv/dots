# Dots Repository Findings

Read-only repository research captured July 22, 2026. It records the repository
state examined at that time. Later product decisions in
[State Architecture And Ubiquitous Language](state-architecture-and-language.md)
supersede preliminary packaging recommendations in this snapshot.

## Existing State Precedents

Self Improve is the closest user-adaptation precedent. It separates facts,
inferences, contradictions, and evidence strength; deduplicates support; and
records settled decisions so rejected proposals do not recur:

- `plugins/dots/skills/self-improve/SKILL.md:20`
- `plugins/dots/skills/self-improve/SKILL.md:96`
- `plugins/dots/skills/self-improve/scripts/self_improve.py:47`
- `plugins/dots/skills/self-improve/scripts/self_improve.py:639`
- `plugins/dots/skills/self-improve/scripts/self_improve.py:737`

Its source adapters isolate Codex and Claude evidence rather than silently
mixing platforms:

- `plugins/dots/skills/self-improve/references/codex-sessions.md:6`
- `plugins/dots/skills/self-improve/scripts/session_sources.py:39`
- `plugins/dots/skills/self-improve/scripts/session_sources.py:102`

The transferable model is evidence plus provenance plus conservative promotion.
The existing implementation learns workflow preferences, not stylometry.

## Relevant Writing And Channel Boundaries

Docs Writer already separates draft from edit, establishes reader, artifact,
sources, and destination, and preserves claims and caveats while restructuring:

- `plugins/dots/skills/docs-writer/SKILL.md:29`
- `plugins/dots/skills/docs-writer/references/technical-writing-guidance.md:79`

It explicitly owns durable repository documentation rather than chat, and its
generic defaults could erase an individual's voice:

- `plugins/dots/skills/docs-writer/SKILL.md:1`
- `plugins/dots/skills/docs-writer/references/technical-writing-guidance.md:58`

That boundary argues for a separate voice-writing owner rather than stretching
Docs Writer across reports, email, Teams, and iMessage.

iMessage retrieves a bounded, read-only history slice, exposes `fromMe`, and
forbids drafting, sending, and persistence:

- `plugins/dots/skills/imsg/SKILL.md:6`
- `plugins/dots/skills/imsg/SKILL.md:27`
- `plugins/dots/skills/imsg/scripts/imsg.swift:25`
- `plugins/dots/skills/imsg/scripts/imsg.swift:242`

It can be a consent-bounded acquisition source because it distinguishes the
user's writing from counterpart writing. It is not a composing or delivery
surface.

No Gmail, Outlook, Teams, or Slack integration exists in Dots source. Drafting
for those channels from supplied context is skill behavior. Automatic example
retrieval, conversation context, or sending requires external connectors and a
separate authorization boundary.

## Packaging And State Boundary

The Dots plugin exposes skills and generic read/write capability but no MCP
server, app, connector, or background service:

- `plugins/dots/plugin.json:1`
- `plugins/dots/.codex-plugin/plugin.json:14`

Repository conventions reserve hidden `.<skill-name>/` companions for evals and
generated development work, not end-user runtime profiles:

- `AGENTS.md:15`

Current state patterns are fragmented between project-local `.agents/...`
state, host-global `~/.codex/...` decisions, and host-owned generated memory.
There is no established cross-host identity, consent ledger, retention policy,
shared profile, revision history, or synchronization model.

One apparent `drafts-styles` state path should not be used as precedent:
`scripts/sync-configs.sh:228` targets `configs/drafts/styles`, but that source
directory is absent in the current tree.

## Skill Versus Plugin Or Service

A local, agent-mediated system can begin as a stateful skill inside Dots. It can
store a voice profile, context variants, source provenance, draft state, and
revision history using packaged scripts and local files.

A standalone plugin is chiefly an ownership and packaging choice unless it adds
integrations. Continuous ingestion, background learning, Gmail or Teams access,
cross-device synchronization, multi-user isolation, encryption or retention
enforcement, and direct delivery require capabilities absent from Dots today:
connector-backed tools or a service rather than instructions alone.

The largest repository-level gaps are the absence of a stylometry schema,
context routing, sample-quality and consent rules, iterative draft state,
user-confirmed learning, and channel connector contracts.
