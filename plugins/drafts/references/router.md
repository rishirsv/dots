# Router

Use this reference when `drafts` needs to classify a writing request before
acting. Read [draft-rewrite-ux.md](draft-rewrite-ux.md) for the product-level
Draft and Rewrite behavior.

## Inputs

Collect the smallest available set:

- User prompt.
- Current workspace or project.
- Current session.
- Selected draft and draft version.
- Style request context and selected style.
- Channel recipe.
- Applicable AGENTS.md guidance.
- Draft-level source pack or current attachments.
- User's requested output form.
- Whether the request is new/recurring writing or transformation of existing
  text.

If an input is missing but not blocking, proceed with an explicit assumption.
Ask only when the missing answer changes the artifact, approval boundary,
source basis, or review target.

## Lanes

| Lane | Trigger | Route |
| --- | --- | --- |
| `Draft` | User says write, draft, compose, start, continue, outline, build a piece, create a recurring project, or provides messy notes for a standing pad. | `writer` |
| `Rewrite` | User says rewrite, humanize, personalize, polish, tighten, shorten, expand, adapt, make this sound like me, make this less AI, or provides existing text to improve. | `writer` |
| `Style` | User asks to create, inspect, sync, import, export, or update writing style evidence. | `writing-style` |
| `Review` | User asks for critique, scorecard, adversarial review, QA, or fix plan. | `writing-review` |

Keep `$drafts` as the front door. Do not require users to choose a lane when the
verb or supplied text makes the lane clear.

## Writing Moments

| Moment | Trigger | Route |
| --- | --- | --- |
| `draft_lane` | New, recurring, or continuing writing | `writer` |
| `rewrite_lane` | Existing text transformation | `writer` |
| `new_short_write` | Clear bounded artifact | `writer` |
| `substantial_work` | Report, essay, launch plan, memo series, long guide | `writer` brief then contract |
| `existing_draft_revision` | User asks to edit selected/provided draft | `writer` |
| `create_writing_style` | User asks for writing style, samples, voice guide | `writing-style` |
| `review` | User asks for critique, score, adversarial read, QA | `writing-review` |
| `transform` | User asks for another format, channel, or audience | `writer` |
| `source_update` | User adds or changes draft sources | Update source pack, then resume route |

Reusable writing guidance is handled by `update_writing_rules` in
[writing-rules.md](writing-rules.md), not as a separate writing moment.

## Default Decisions

- Prefer the `Draft` lane for new writing. Gather context before drafting,
  using one high-leverage question at a time unless the user asks for a
  structured brief.
- Prefer the `Rewrite` lane for existing text. Return one best version by
  default, and offer alternate rhetorical directions only when they materially
  matter.
- Prefer three rhetorical directions for new Draft lane writing once enough
  context exists.
- Prefer turning interview answers into `Outline`, not a visible brief.
- Prefer a brief and contract internally for substantial durable work.
- Prefer drafting for clear short requests when the brief is already sufficient.
- Prefer version-tied review when a draft exists.
- Prefer automatic style selection for a new durable draft when no style is
  pinned. Choose a concrete style ID from user style guides plus shipped
  `default`.
- Prefer a channel recipe when the user names a platform, format, slash command,
  or channel variant target. Style selection does not replace channel recipe
  selection.
- Prefer explicit provenance over silent style selection.
- Prefer non-personalized humanize when the user asks to "sound like me" but no
  usable style guide or samples exist.

## Clarification

For Draft lane work, ask questions based on the Spiral-style interview model:

- What is it about?
- Who is it for?
- What is the main argument?

For uncertain substantial writing, first ask about the observation,
frustration, or change in thinking that made the user want to write. Ask only
the next missing question. If the user says `draft anyway`, draft with explicit
assumptions.

For Rewrite lane work, do not ask context questions unless the source text is
missing, style evidence is required for personalization, or the edit intent is
materially ambiguous.

## Router Response

Every route should return:

- `route`.
- `lane`.
- `state_read`.
- `state_written`.
- `assumptions`.
- `style_provenance`.
- `rules_provenance`.
- `source_provenance`.
- `recommended_next_action`.
