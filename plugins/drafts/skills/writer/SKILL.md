---
name: writer
description: "Use after drafts sends writing work here, or when the user explicitly invokes writer, for new drafts, continuations, revisions, rewrites, humanized cleanups, personalization, and channel variants. Not for writing-style setup, standalone critique, generic answers, code changes, or external publishing."
---

# Writer

Create and revise writing. Use this skill after `drafts` routes a writing
moment here, or when the user explicitly invokes `writer` for drafting,
revision, or transformation.

Write like an editor. The user should see the artifact first: the draft,
rewrite, outline, revision, or variant they asked for. Keep bookkeeping in the
background unless a short note is needed for trust, persistence, or a material
assumption.

The `drafts` front door decides whether the user needs new writing or a pass on
existing text. Read
[state-model.md](../../references/state-model.md) before creating briefs,
contracts, drafts, pads, or versions, especially its Where Saved Work Lives
section.
Read [writing-rules.md](../../references/writing-rules.md) when rules affect
output.
Read [channel-recipes.md](../../references/channel-recipes.md) when the user
names a destination, platform, format, slash command, or channel variant. Read
[provenance.md](../../references/provenance.md) before mentioning style,
sources, versions, reviews, or saved state.

## The Editing Move

Quietly choose the narrowest matching action so the writing gets the right
treatment:

- `draft_lane`: context-first new, recurring, substantial, or continuing
  writing.
- `rewrite_lane`: fast transformation of existing text, including rewrite,
  humanize, personalize, polish, tighten, shorten, expand, or adapt.
- `new_short_write`: draft a bounded artifact when the prompt is clear.
- `substantial_work`: create a `writing_brief`, then a `document_contract`,
  before drafting sections.
- `existing_draft_revision`: revise the selected `draft_version`.
- `continue_draft`: extend the draft without rewriting unrelated sections.
- `channel_variant`: create a separate draft for a channel or audience.
- `personalize`: rewrite in a selected or inferred style.
- `humanize`: clean up generic, stiff, or automated-writing patterns using
  rules.

## Starting Or Continuing A Piece

Use this path for new or recurring writing. Help the user move from raw
intent to usable prose. When the outline is not ready, gather just enough
context to make the next draft better.

1. Resolve the standing pad or current draft when available.
2. Keep the visible pad to `Ideas bank`, `Outline`, and `Draft`.
3. Triage messy notes, links, or voice transcripts by preserving raw fragments
   in `Ideas bank` and promoting usable clusters, argument order, claims,
   examples, and assumptions into `Outline`.
4. Ask one high-leverage context question when the outline is not ready. Start
   from "What is it about?", "Who is it for?", and "What is the main argument?",
   but ask the next missing question rather than running a form.
5. For fuzzy substantial writing, prefer the first question about the
   observation, frustration, or change in thinking that made the user want to
   write.
6. Convert answers into `Outline` quickly; do not create a visible `Brief`
   section.
7. Once context is sufficient, generate three rhetorical directions side by
   side. Labels should be generated from the piece's argument move, such as
   `Direct`, `Narrative`, `Contrarian`, `Analytical`, `Personal`, or
   `Executive`.
8. After the user chooses a direction, make it the working draft in `Draft` and
   continue with an editor-style revision loop.

If the user says `draft anyway`, stop interviewing and draft the smallest
bounded useful artifact with explicit assumptions.

## Longer Pieces

Use this approach when the piece is substantial enough to need durable planning
or section-by-section execution. Keep the visible work surface simple even when
brief or contract records exist.

1. Create or update a `writing_brief` with audience, purpose, format, scope,
   voice mode, source constraints, success criteria, call to action,
   assumptions, and open questions.
2. Ask focused clarification questions only when the answer changes the plan.
3. If the user wants speed, proceed with `draft_anyway` and record assumptions.
4. Create a `document_contract` with thesis, outline, section goals, length
   target, source plan, quality bar, review criteria, and section status.
5. Draft or revise one bounded Markdown section at a time when the artifact has
   chapters or sections.
6. Preserve unrelated sections unless the user asks for a whole-document pass.
7. Save material changes as new `draft_version` records when the surrounding
   system supports durable state. If state is unavailable or unsaved, say that
   briefly after the writing only when it matters.

## Improving Existing Text

Use this path for existing text. Do not start a full writing interview unless
the source text is missing, the requested transformation is ambiguous, or the
user asks to attach the rewrite to a standing pad.

1. Resolve the provided text, selected `draft_version`, or section.
2. Identify the edit intent: rewrite, humanize, personalize, tighten, polish,
   shorten, expand, adapt, make more direct, or apply review fixes.
3. Return one best version by default.
4. Offer alternate rhetorical directions only when the source text supports
   materially different moves.
5. Preserve meaning, genre, factual claims, and the user's apparent intent.

`Humanize` means restoring author intent and texture. Remove obvious AI tells,
generic setup, over-explaining, symmetrical scaffolding, empty hype, corporate
transitions, and unsupported claims. Add specificity only when supported by the
source, current context, or selected style. Do not make the piece casual merely
because the user said humanize.

When the user asks to "sound like me," use a selected or available style guide.
If no usable guide or samples are available, ask for style evidence or run a
non-personalized humanize pass and say so in one short sentence.

## Revising Existing Drafts

1. Resolve the source `draft` and `draft_version`.
2. Identify the edit intent: shorten, expand, sharpen, restructure, continue,
   adapt, personalize, humanize, or apply review fixes.
3. Preserve the previous version.
4. Apply only the requested scope.
5. Keep the source version, target version, assumptions, and changed sections as
   working notes. Mention them to the user only when version safety or the next
   action depends on them.

## Voice, Rules, And Sources

- Apply writing rules according to
  [writing-rules.md](../../references/writing-rules.md).
- If frontmatter already has `style: <id>`, treat that style as pinned.
- If no style is pinned for new durable work, choose a concrete style ID from
  user-global style guides plus shipped `default`, and write that concrete ID
  when creating frontmatter. Mention the choice briefly only when the user needs
  it for trust or future edits.
- Change an existing `style` value only after user confirmation.
- When `personalize` uses a style, retrieve the selected `style.md` and
  relevant references before drafting, then run humanize-style cleanup for
  style-specific and global automated-writing patterns.
- When `humanize` runs without a selected style, apply global and channel rules
  without inventing voice evidence. Treat it as non-personalized cleanup.
- When a channel, platform, slash command, or requested output form is present,
  resolve the relevant `channel_recipe` and let it control structure, length,
  CTA, and platform conventions.
- Use draft-level source packs; do not repeat source lists in every section.
- Preserve source constraints in the `writing_brief` and `document_contract`.
- Do not cite or rely on a source unless it was provided, retrieved, or already
  present in the working context.

## What The User Sees

Return the artifact first.

For ordinary chat-only drafting and rewriting, the whole response can be just
the writing. Do not append lane names, route names, state details, provenance
details, or AGENTS.md bookkeeping.

Add one short note after the writing only when it changes trust, persistence, or
the user's next decision. Good notes are natural prose:

```text
I treated this as a humanize pass, not a personal voice match.
```

```text
I used `email-rishi` and assumed this is for an internal peer.
```

```text
I did not save this as Drafts state.
```

```text
I revised this from v001 and would save it as a new version before overwriting
anything.
```

If the user asks for the route, sources, style choice, rule checks, or version
history, explain those details directly after answering the writing request.
