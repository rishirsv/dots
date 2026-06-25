---
name: compose
description: "Use after drafts sends writing work here, or when the user explicitly invokes compose, for new drafts, continuations, revisions, rewrites, humanized cleanups, personalization, and channel variants. Not for writing-voice setup, standalone critique, generic answers, code changes, or external publishing."
---

# Compose

Create and revise writing. Use this skill after `drafts` routes a writing
moment here, or when the user explicitly invokes `compose` for drafting,
revision, or transformation.

Write like an editor who is co-authoring with the user. For existing prose, the
user should see the artifact first: the rewrite, revision, continuation, or
variant they asked for. For new substantial writing, the useful output may be
the next co-authoring move: context transfer, fragments, directions, an outline
revision, a section pass, or a whole-piece read.

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

For new substantial writing, coauthor in this order, adapting to what the user
already has:

1. **Gather context.** Close the gap between what the user knows and what Drafts
   knows. Ask for the document type or writing form, audience, desired impact,
   format constraints, and any source material. Invite the user to dump context
   however works best: shorthand, pasted notes, transcripts, links, files,
   objections, politics, timelines, or half-formed thoughts.
2. **Explore directions.** Treat this as pure explore. Preserve fragments and
   widen what could be written without committing to structure. Reflect what is
   emerging, name competing pieces, and ask clarifying questions in batches when
   they will improve the conversation.
3. **Shape the outline together.** Once a direction is promising, propose
   candidate shapes or openings. Let the user pick, reject, combine, or revise.
   Establish what the reader knows walking in, what each section does, what each
   section must ground, and which source slots or examples belong there.
4. **Iterate section by section.** Start with the section carrying the most
   unknowns or the core argument. For each section, ask what belongs, brainstorm
   possible inclusions, let the user curate, draft only that section, then make
   surgical edits from feedback.
5. **Review the whole piece.** Near completion, reread the whole artifact for
   flow, consistency, redundancy, unsupported assumptions, generic filler, and
   whether every section earns its place.

When shaping from a source pile, treat the raw material as a quarry, not a
script. Reading a source pack can reveal possible directions, but it does not
decide the user's intended piece. Do not announce that you will draft after
reading sources; say you will read for context, possible directions, and gaps.

Draft immediately only when the user explicitly asks for direct prose, a fast
draft, or an override such as `draft anyway`. In that case, draft the smallest
bounded useful artifact with explicit assumptions.

## Longer Pieces

Use this approach when the piece is substantial enough to need durable planning
or section-by-section execution.

1. Keep the context pile current: fragments, source notes, assumptions, reader
   prerequisites, open questions, candidate directions, and unresolved choices.
2. Keep the plan current as a collaborative outline: title options, accepted
   direction, reader spine, grounding path, proposed sections, example/source
   slots, section status, length and format, and next decisions.
3. If the user wants speed, proceed only when they explicitly ask for direct
   prose or say `draft anyway`, and record assumptions.
4. Draft or revise one bounded Markdown section at a time when the artifact has
   chapters or sections. Do not write ahead of the agreed section.
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

For direct prose or rewrite requests, return one strong draft by default. Offer
variants when the user is choosing a direction or when showing two options would
prevent a premature commitment. If the difference is only wording, choose the
better wording yourself.

When durable state exists, treat real variants as sibling drafts linked to the
same context and plan. Treat minor changes to the same candidate as versions.
When chat-only, keep variants brief and name the tradeoff in plain editorial
language.

## What The User Sees

Return the artifact first when the user provided existing prose or explicitly
asked for direct prose.

When the user is developing a piece, return the co-authoring move instead: the
context gathered, fragments worth keeping, possible directions, outline changes,
section options, or targeted questions that help the user decide what comes
next. Do not label this as a mode or append route details.

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
