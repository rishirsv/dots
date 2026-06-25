# Choosing The Right Drafts Path

Use this reference when `drafts` needs to classify a writing request before
acting. This is private routing guidance, not a response template. The user
should see the writing outcome unless they ask how Drafts chose the route.

For the visible writing experience, follow `drafts/SKILL.md`; this reference
only helps choose the right help and notice missing inputs.

## Signals

Notice the smallest available set:

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
source basis, or review target. If the assumption matters to the user's trust,
mention it in one short sentence after the writing.

## User Need

| Need | When the user says | Use |
| --- | --- | --- |
| `Draft` | User says write, draft, compose, start, continue, outline, build a piece, create a recurring project, or provides messy notes for a standing pad. | `compose` |
| `Rewrite` | User says rewrite, humanize, personalize, polish, tighten, shorten, expand, adapt, make this sound like me, make this less AI, or provides existing text to improve. | `compose` |
| `Style` | User asks to create, inspect, sync, import, export, or update writing style evidence. | `writing-voice` |
| `Review` | User asks for critique, scorecard, adversarial review, QA, or fix plan. | `writing-review` |

Keep `$drafts` as the front door. Do not require users to name the kind of help
when their verb or supplied text makes it clear.

## Private Names For Common Work

| Private name | When it appears | Use |
| --- | --- | --- |
| `draft_lane` | New, recurring, or continuing writing | `compose` |
| `rewrite_lane` | Existing text transformation | `compose` |
| `new_short_write` | Clear bounded artifact | `compose` |
| `substantial_work` | Report, essay, launch plan, memo series, long guide | `compose` brief then contract |
| `existing_draft_revision` | User asks to edit selected/provided draft | `compose` |
| `create_writing_style` | User asks for writing style, samples, voice guide | `writing-voice` |
| `review` | User asks for critique, score, adversarial read, QA | `writing-review` |
| `transform` | User asks for another format, channel, or audience | `compose` |
| `source_update` | User adds or changes draft sources | Update source pack, then resume route |

Reusable writing guidance is handled by `update_writing_rules` in
[writing-rules.md](writing-rules.md), not as a separate writing moment.

## Good Defaults

- Prefer new-writing help when the user is starting, continuing, outlining, or
  shaping rough material.
- Prefer rewrite help when the user provides text to improve.
- Prefer a brief and contract for substantial durable work.
- Prefer drafting for clear short requests when the brief is already sufficient.
- Prefer version-tied review when a draft exists.
- Prefer automatic style selection for a new durable draft when no style is
  pinned. Choose a concrete style ID from user style guides plus shipped
  `default`.
- Prefer a channel recipe when the user names a platform, format, slash command,
  or channel variant target. Style selection does not replace channel recipe
  selection.
- Prefer honest style handling over silent style claims. Mention style only when
  the choice affects trust, persistence, or the user's next decision.
- Prefer non-personalized humanize when the user asks to "sound like me" but no
  usable style guide or samples exist.

## Missing Inputs

For new writing, missing inputs usually come from these core writing variables:

- What is it about?
- Who is it for?
- What is the main argument?

For existing text, do not ask context questions unless the source text is
missing, style evidence is required for personalization, or the edit intent is
materially ambiguous.

## Private Working Notes

Keep route details as working notes for the agent or downstream specialist.
They are not default user-visible output.

Track only what helps the work: the chosen helper, whether saved state was read
or changed, material assumptions, style choice, relevant rules, source context,
and the next useful action.

Use these details to preserve safety around state, style, sources, and review
lineage. Do not print them in ordinary Draft or Rewrite responses. If the user
asks how Drafts handled the request, explain the relevant pieces in plain
language.
