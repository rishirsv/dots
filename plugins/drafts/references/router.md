# Router

Use this reference when `drafts` needs to classify a writing request before
acting.

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

If an input is missing but not blocking, proceed with an explicit assumption.
Ask only when the missing answer changes the artifact, approval boundary,
source basis, or review target.

## Writing Moments

| Moment | Trigger | Route |
| --- | --- | --- |
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

- Prefer a brief and contract for substantial work.
- Prefer drafting for clear short requests.
- Prefer version-tied review when a draft exists.
- Prefer Auto Style for a new durable draft when no style is pinned. Auto Style
  chooses a concrete style ID from user styles plus shipped `default`.
- Prefer explicit provenance over silent Auto Style.

## Router Response

Every route should return:

- `route`.
- `state_read`.
- `state_written`.
- `assumptions`.
- `style_provenance`.
- `rules_provenance`.
- `source_provenance`.
- `recommended_next_action`.
