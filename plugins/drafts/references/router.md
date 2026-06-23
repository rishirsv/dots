# Router

Use this reference when `drafts` needs to classify a writing request before
acting.

## Inputs

Collect the smallest available set:

- User prompt.
- Current workspace or project.
- Current session.
- Selected draft and draft version.
- Style mode and selected style.
- Channel recipe.
- Writing rules.
- Source pack, attachments, or knowledge items.
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
| `style_build` | User asks for style profile, samples, voice guide | `writing-style` |
| `review` | User asks for critique, score, adversarial read, QA | `writing-review` |
| `transform` | User asks for another format, channel, or audience | `writer` |
| `rules_or_sources` | User updates policies, files, facts, knowledge | Update state, then resume route |

## Default Decisions

- Prefer a brief and contract for substantial work.
- Prefer drafting for clear short requests.
- Prefer version-tied review when a draft exists.
- Prefer `no_style` only when the user explicitly asks for no voice profile or
  the surface says style is off.
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
