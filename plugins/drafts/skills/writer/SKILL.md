---
name: writer
description: "Use for Drafts writing work: creating briefs, document contracts, drafts, continuations, targeted revisions, personalized rewrites, humanized cleanups, and channel variants. Not for style-profile setup, standalone critique, generic answers, code changes, or external publishing."
---

# Writer

Create and revise durable writing artifacts. Use this skill after `drafts`
routes a writing moment to the main writing engine, or when the user explicitly
invokes `writer` for a writing, revision, or transformation task.

Read [state-model.md](../../references/state-model.md) before creating briefs,
contracts, drafts, or versions, especially its State Authority section. Read
[writing-rules.md](../../references/writing-rules.md) when rules affect output.
Read [provenance.md](../../references/provenance.md) before reporting generated
or revised work.

## Writing Moment

Choose the narrowest matching action:

- `new_short_write`: draft a bounded artifact when the prompt is clear.
- `substantial_work`: create a `writing_brief`, then a `document_contract`,
  before drafting sections.
- `existing_draft_revision`: revise the selected `draft_version`.
- `continue_draft`: extend the draft without rewriting unrelated sections.
- `channel_variant`: create a separate draft for a channel or audience.
- `personalize`: rewrite in a selected or inferred style.
- `humanize`: clean up generic, stiff, or automated-writing patterns using
  rules.

## Substantial Writing Flow

1. Create or update a `writing_brief` with audience, purpose, format, scope,
   voice mode, source constraints, success criteria, call to action,
   assumptions, and open questions.
2. Ask focused clarification questions only when the answer changes the plan.
3. If the user wants speed, proceed with `draft_anyway` and record assumptions.
4. Create a `document_contract` with thesis, outline, section goals, length
   target, source plan, quality bar, review criteria, and section status.
5. Draft or revise one bounded section at a time.
6. Preserve unrelated sections unless the user asks for a whole-document pass.
7. Save material changes as new `draft_version` records when the surrounding
   system supports durable state; otherwise describe the version boundary in the
   handoff.

## Revision Flow

1. Resolve the source `draft` and `draft_version`.
2. Identify the edit intent: shorten, expand, sharpen, restructure, continue,
   adapt, personalize, humanize, or apply review fixes.
3. Preserve the previous version.
4. Apply only the requested scope.
5. Record the source version, target version, assumptions, and changed sections.

## Rules And Sources

- Apply writing rules according to
  [writing-rules.md](../../references/writing-rules.md).
- When `personalize` uses a style, retrieve relevant examples and style-guide
  rules before drafting, then run humanize-style cleanup for style-specific and
  global automated-writing patterns.
- When `humanize` runs without a style profile, apply global and channel rules
  without inventing voice evidence.
- Distinguish source packs from durable knowledge items.
- Preserve source constraints in the `writing_brief` and `document_contract`.
- Do not cite or rely on a source unless it was provided, retrieved, or already
  present in the working context.

## Output

Return the draft or revision with:

- Writing moment and action taken.
- Brief or contract changes.
- Draft and version boundary.
- Style mode and style provenance.
- Rules applied and any conflicts.
- Sources used and persistence assumptions.
- Recommended next action, usually review, revise, continue, or create variant.
