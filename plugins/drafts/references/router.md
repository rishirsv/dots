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
- Draft context, plan, or current attachments.
- User's requested output form.
- Whether the request is new/recurring writing or transformation of existing
  text.

For new substantial writing, do not treat missing context as an interruption to
minimize. Context gathering, direction exploration, and outline shaping are the
writing workflow. For fast direct-prose requests, proceed with explicit
assumptions only when the missing answer does not change the artifact, approval
boundary, supporting material, or review target.

## User Need

| Need | When the user says | Use |
| --- | --- | --- |
| `Draft` | User says write, draft, compose, start, continue, outline, build a piece, create a recurring project, or provides messy notes for a standing pad. | `compose` |
| `Rewrite` | User says rewrite, humanize, personalize, polish, tighten, shorten, expand, adapt, make this sound like me, make this less AI, or provides existing text to improve. | `compose` |
| `Style` | User asks to create, inspect, sync, import, export, or update writing style evidence. | `writing-voice` |
| `Review` | User asks for critique, a pressure test, QA, rubric scoring, or what to fix first. | `writing-review` |

Keep `$drafts` as the front door. Do not require users to name the kind of help
when their verb or supplied text makes it clear.

Reusable writing guidance uses the approval-gated rule update flow in
[writing-rules.md](writing-rules.md), not a separate writing moment.

## Good Defaults

- Prefer co-authoring when the user is starting, continuing, outlining, or
  shaping rough material.
- Prefer rewrite help when the user provides text to improve.
- Prefer exploration before planning or drafting for every new substantial
  piece. Fuzzy, source-heavy, or idea-development prompts should stay in the raw
  pile while the user and agent explore possible pieces.
- Prefer a collaborative outline before drafting when the user needs structure,
  assumptions, source slots, or section work.
- Prefer drafting for short requests only when the prompt already contains the
  needed writing context or the user explicitly asks for direct prose.
- Prefer the Compose quality loop before returning writing. Do not route to
  review just to catch ordinary AI tells, weak endings, or style misses that
  Compose can fix before output.
- Prefer variants only when there is a real editorial fork, such as angle,
  opening, structure, audience, channel, voice, or revision strategy.
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

For new writing, gather and refine these inputs through the co-authoring
conversation:

- What made the user want to write?
- Who is it for?
- What should change after the reader reads it?
- What possible directions are live?
- What shape or outline feels right?
- What source material or examples exist?

If those inputs are still moving, keep co-authoring. Do not treat the request as
enough for polished prose unless the user asks for direct prose, accepts a
working outline, or explicitly says `draft anyway`.

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
