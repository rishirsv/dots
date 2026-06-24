---
name: drafts
description: "Use when the user asks to write, draft, rewrite, humanize, revise, continue, review, transform, or manage writing with stateful context. Routes the Draft and Rewrite lanes to writer, and style/review work to specialist skills. Not for generic chat answers, code implementation, external publishing, or skill authoring."
---

# Drafts

Route writing work through the smallest useful Drafts surface. Drafts is the
user-invoked front door for two plain lanes:

- `Draft`: context-first writing for new, recurring, substantial, or continuing
  work.
- `Rewrite`: fast transformation for existing text, including rewrite,
  humanize, personalize, tighten, polish, or adapt.

Use `Draft` for writing that needs a standing pad, context questions, outline
shaping, three rhetorical directions, a working draft, draft versions, style
selection, source context, AGENTS.md guidance, or review. Use `Rewrite` for
provided or selected text that should be improved directly.

Read [draft-rewrite-ux.md](../../references/draft-rewrite-ux.md) before
routing Draft or Rewrite lane work. Read [router.md](../../references/router.md)
for routing decisions. Read
[state-model.md](../../references/state-model.md) when creating or updating
durable writing state, especially its State Authority section. Read
[channel-recipes.md](../../references/channel-recipes.md) when channel,
platform, slash-command, or variant behavior matters. Read
[style-library-sync.md](../../references/style-library-sync.md) before routing
style-library sync, export, import, backup, or root-change requests. Read
[provenance.md](../../references/provenance.md) before reporting a generated,
revised, transformed, or reviewed result.

## Router Contract

Before acting, identify:

- User intent and writing moment.
- Lane: `Draft`, `Rewrite`, style, or review.
- Current workspace or project context.
- Current session, draft, and draft version when available.
- Selected style or automatic style selection context, channel recipe,
  AGENTS.md guidance, and source context.
- Whether the user wants a file edit, a returned draft, a review, or a plan.

Route to:

- `writer` for the Draft lane, the Rewrite lane, briefs, document contracts,
  new drafts, continuations, revisions, transformations, personalization,
  humanization, and variants.
- `writing-style` for user styles, samples, style guides, freshness, and
  sample-quality warnings, plus style-library sync, export, import, backup, and
  root changes.
- `writing-review` for critique, scorecards, adversarial review, and
  review-to-revision handoff.

If several routes apply, preserve the user's current writing momentum. For
example, a request to "review this and fix the top issues" should review the
current `draft_version` first, then hand selected fixes to `writer`. A request
to "rewrite this" or "humanize this" should not start a full Draft interview
unless the source text is missing or the user asks to attach the rewrite to a
standing draft.

## Workflow

1. Classify the writing moment using [router.md](../../references/router.md).
2. Load only the state needed for that route.
3. For Draft lane work, ask Spiral-style context questions only when they move
   the outline or approval boundary. For Rewrite lane work, operate directly
   unless the source text, style evidence, or requested change is missing.
4. Delegate to the specialist route and follow its workflow.
5. Return the result with state read, state written, assumptions, provenance,
   and the recommended next action.

## Boundaries

- Do not perform external publishing, posting, sending, or sync without explicit
  approval.
- Do not call the non-rewrite lane `Studio`; use `Draft`.
- Do not invent durable state. If a session, draft, style, source, or
  version is inferred rather than observed, label it as an assumption.
- Do not treat chat-only advice as a durable review. Durable review must point
  to a specific `draft_version`.
- Do not hide style selection. If no style is pinned, choose and report a
  concrete style ID, such as `default` or `report`.
- Do not claim to personalize or "sound like me" without a usable style guide
  or provided samples. Fall back to non-personalized humanize when needed.

## Output

When Drafts routes work, report:

- Chosen route and why.
- Chosen lane: `Draft`, `Rewrite`, style, or review.
- Files or state objects created or changed.
- Style, AGENTS.md guidance, and source provenance.
- Validation or review performed.
- Any assumptions or unresolved decisions.
