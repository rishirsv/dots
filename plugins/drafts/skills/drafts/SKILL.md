---
name: drafts
description: "Use when the user asks to write, revise, continue, review, transform, or manage a durable draft with stateful writing context. Routes to writer, writing-style, or writing-review. Not for generic chat answers, code implementation, one-off grammar cleanup, external publishing, or skill authoring."
---

# Drafts

Route stateful writing work through the smallest useful Drafts surface. Drafts
is the user-invoked front door for writing moments that need briefs, document
contracts, sections, draft versions, style selection, source context, AGENTS.md
guidance, or review.

Read [router.md](../../references/router.md) for routing decisions. Read
[state-model.md](../../references/state-model.md) when creating or updating
durable writing state, especially its State Authority section. Read
[provenance.md](../../references/provenance.md) before reporting a generated,
revised, transformed, or reviewed result.

## Router Contract

Before acting, identify:

- User intent and writing moment.
- Current workspace or project context.
- Current session, draft, and draft version when available.
- Selected style or Auto Style context, channel recipe, AGENTS.md guidance, and
  source context.
- Whether the user wants a file edit, a returned draft, a review, or a plan.

Route to:

- `writer` for briefs, document contracts, new drafts, continuations,
  revisions, transformations, personalization, humanization, and variants.
- `writing-style` for user styles, samples, style guides, freshness, and
  sample-quality warnings.
- `writing-review` for critique, scorecards, adversarial review, and
  review-to-revision handoff.

If several routes apply, preserve the user's current writing momentum. For
example, a request to "review this and fix the top issues" should review the
current `draft_version` first, then hand selected fixes to `writer`.

## Workflow

1. Classify the writing moment using [router.md](../../references/router.md).
2. Load only the state needed for that route.
3. Ask only questions whose answers change the draft, contract, review, style
   evidence, or approval boundary.
4. Delegate to the specialist route and follow its workflow.
5. Return the result with state read, state written, assumptions, provenance,
   and the recommended next action.

## Boundaries

- Do not perform external publishing, posting, sending, or sync without explicit
  approval.
- Do not invent durable state. If a session, draft, style, source, or
  version is inferred rather than observed, label it as an assumption.
- Do not treat chat-only advice as a durable review. Durable review must point
  to a specific `draft_version`.
- Do not hide Auto Style behavior. It must choose and report a concrete style
  ID, such as `default` or `report`.

## Output

When Drafts routes work, report:

- Chosen route and why.
- Files or state objects created or changed.
- Style, AGENTS.md guidance, and source provenance.
- Validation or review performed.
- Any assumptions or unresolved decisions.
