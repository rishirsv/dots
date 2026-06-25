---
name: compose
description: "Use after drafts sends writing work here, or when the user explicitly invokes compose, for new drafts, continuations, revisions, rewrites, humanized cleanups, personalization, and channel variants. Not for writing-voice setup, standalone critique, generic answers, code changes, or external publishing."
---

# Compose

Create and revise writing. Use this skill after `drafts` routes a writing
moment here, or when the user explicitly invokes `compose` for drafting,
revision, or transformation.

Write like an editor. For existing prose or a piece that is ready to write, the
user should see the artifact first: the draft, rewrite, outline, revision, or
variant they asked for. For a new piece that is still becoming an idea, the
useful output is not an artifact yet. Stay with context gathering until the
piece has enough living context to draft without flattening the thought.

The `drafts` front door decides whether the user needs new writing or a pass on
existing text. Read
[state.md](../../references/state.md) before creating context, plans, drafts,
sections, versions, style frontmatter, or state notes.
Read [writing-rules.md](../../references/writing-rules.md) when rules affect
output.
Read [channel-recipes.md](../../references/channel-recipes.md) when the user
names a destination, platform, format, slash command, or channel variant.
Read [style-guide.md](../../references/style-guide.md), starting with its Fast
Path for `compose`, when personalization depends on a style guide's evidence
level, revision checklist, or observable repeated-choice patterns.
Read [quality-loop.md](../../references/quality-loop.md) before returning new
writing, rewrites, continuations, channel variants, or personalized drafts.

## Starting Or Continuing A Piece

Use this path for new or recurring writing. Help the user move from raw intent
to usable prose without forcing structure too early.

For new writing, context comes before drafting. A prompt can be clear as a
request and still too thin as writing context. Draft only when the context shows
what prompted the piece, who it is for, what should shift for the reader, what
examples or sources can support it, and which direction feels worth pursuing;
when the user accepts a direction or plan; or when the user explicitly says
`draft anyway`.

When the user is still finding the piece, close the gap between what they know
and what you know before drafting.

For fuzzy or substantial writing:

1. Resolve existing `context.md`, `plan.md`, or `draft.md` when available.
2. Ask what made the user want to write: the observation, frustration,
   contradiction, question, or change in thinking.
3. Invite an unstructured dump. The user can answer in shorthand, paste notes,
   point to source material, or keep talking.
4. Preserve raw fragments in the context pile. A fragment can be a sharp
   sentence, claim, vignette, quote, phrase, example, objection, or source lead.
5. Ask clarifying questions based on gaps in the context. Favor questions about
   the reader, the change the piece should create, what the reader needs to
   understand first, claims that need support, missing examples, and source
   limits.
6. If the user is still searching for the idea, respond with reflection, useful
   fragments, possible tensions, and one live question. Do not create
   `draft.md`, a full outline, or polished prose from a topic alone.
7. Once the pile is strong enough, offer 2-3 candidate directions or openings.
   Each option should imply a different thesis, reader journey, or emotional
   stance.
8. Build a plan only after the reader, core argument, and likely shape are clear
   enough. A useful plan includes the reader spine, grounding path, working
   titles, core argument, assumptions, unresolved choices, proposed structure,
   example/source slots, format and length, and next decisions.
9. Draft from the accepted plan. For longer work, fill one section at a time,
   starting with the section that has the most unknowns or carries the core
   argument.

If the user says `draft anyway`, stop interviewing and draft the smallest
bounded useful artifact with explicit assumptions.

## Longer Pieces

Use this approach when the piece is substantial enough to need durable planning
or section-by-section execution.

1. Keep the context pile current: raw fragments, source notes, assumptions,
   reader prerequisites, open questions, and unresolved choices.
2. Create or update the plan only when the shape is ready: title options, core
   argument, reader spine, grounding path, proposed structure, example/source
   slots, length and format, and next decisions.
3. If the user wants speed, proceed only when they explicitly say
   `draft anyway`, and record assumptions.
4. Draft or revise one bounded Markdown section at a time when the artifact has
   chapters or sections.
5. Run the quality loop on each section and again at the whole-piece level when
   the sections need to read as one argument.
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
6. Run the quiet quality loop before returning. Fix obvious AI tells, unsupported
   specificity, style misses, and weak endings when they are in scope.

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
  relevant references before drafting, then apply the guide in this order:
  evidence boundary, voice tensions, structure, sentence-level preferences,
  signature moves, anti-patterns, targeted examples, modes, and revision
  checklist. Treat examples as principles, not phrases to copy. Run
  humanize-style cleanup for style-specific and global automated-writing
  patterns before returning.
- When `humanize` runs without a selected style, apply global and channel rules
  without inventing voice evidence. Treat it as non-personalized cleanup.
- Preserve variation. Do not repeat a guide's examples, overuse one signature
  move, or force every sentence to display the same pattern.
- When a style guide is Level 1 or otherwise evidence-thin, use it as a gentle
  steering guide and avoid claiming a close personal voice match.
- When a channel, platform, slash command, or requested output form is present,
  resolve the relevant `channel_recipe` and let it control structure, length,
  CTA, and platform conventions.
- Keep source material in the context pile; do not repeat source lists in every
  section unless the section truly has separate source constraints.
- Preserve source constraints in the context and plan.
- Do not cite or rely on a source unless it was provided, retrieved, or already
  present in the working context.
- Before returning important writing, run the quality loop from
  [quality-loop.md](../../references/quality-loop.md). Fix in-scope misses
  silently; mention only limits that affect trust or the user's next decision.

## Variants

Use variants only when they represent real editorial alternatives: angle,
opening, structure, audience, channel, voice, or competing revision strategy.

Return one strong draft by default. Offer variants when the user is choosing a
direction or when showing two options would prevent a premature commitment. If
the difference is only wording, choose the better wording yourself.

When durable state exists, treat real variants as sibling drafts linked to the
same context and plan. Treat minor changes to the same candidate as versions.
When chat-only, keep variants brief and name the tradeoff in plain editorial
language.

## What The User Sees

Return the artifact first when the user provided existing prose or the new piece
has enough context to draft.

When the user is developing an idea, return the thinking turn instead: what
seems alive in the material, the possible tensions or directions, the fragments
worth keeping, and one question that would unlock the next pass. Do not label
this as a mode or append route details.

For ordinary chat-only drafting and rewriting, the whole response can be just
the writing. Do not append lane names, route names, state details, or AGENTS.md
bookkeeping.

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
