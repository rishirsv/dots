# Compose Quality Loop

Use this reference before `compose` returns new writing, a rewrite, a
continuation, a channel variant, or a personalized draft.

The quality loop is not a user-facing mode. Before drafting, it protects the
idea from being flattened too early. After drafting, it is the quiet editorial
pass that keeps Drafts from making the user ask for "rewrite," "review," or
"make it less AI" after every draft. Mention the loop only when a limit affects
trust or the user's next decision.

## Before Drafting

Before there is prose, quality means helping the idea become specific enough to
write. Do not turn a topic into a draft just because the user eventually wants
writing.

Stay with the raw material until you can hear:

- What made the user want to write: an observation, frustration, contradiction,
  question, or change in thinking.
- Who the piece is for and what that reader is likely bringing with them.
- What should feel clearer, sharper, more possible, or more questionable after
  reading.
- What examples, notes, links, memories, or evidence can make the idea concrete.
- What is still fuzzy, assumed, or missing.
- Which version of the idea feels alive enough to pursue.

Source material is evidence, not editorial intent. A transcript, research
ledger, inbox export, notes folder, or other source pack can show what the piece
could support, but it does not decide what the user wants the piece to do.
After reading sources for new writing, return the live issue, possible
directions, missing editorial choices, and one question or choice for the user
before drafting.

If the user is still finding the idea, respond as a thinking partner. Reflect
what seems alive, preserve useful fragments, name two or three possible
tensions or directions, and ask one question that would unlock the next pass. Do
not create a full outline, `draft.md`, section files, or polished prose unless
the user asks to `draft anyway`.

Useful idea-development responses sound like this:

```text
I would not draft this yet. What feels alive is the idea that AI writing goes
wrong before the sentence level: it skips the messy work of noticing what is
actually worth saying.

I can see a few possible pieces here. One is about context collapse. One is
about taste. One is about why "humanize this" usually happens too late.

The context-collapse version feels closest to the nerve. Was there a moment that
made this feel obvious to you?
```

For a source-heavy debrief, a useful first turn sounds like this:

```text
I found enough evidence to support a debrief, but I would not draft yet. The
source pack points to three possible memos: one about the control model, one
about launch readiness, and one about ownership between product, security, and
operations.

The control-model version feels strongest from the evidence. Before I shape it,
what do you want the project team and CTO office to be unable to ignore?
```

## Working Flow

For substantial writing, keep this private sequence:

```text
context pile
-> idea development
-> reader spine
-> grounding path
-> draft
-> quality loop
-> returned artifact
```

For short or clear requests, compress the same checks into one pass. The context
can be brief, but it cannot be absent. Do not create ceremony just because the
full flow exists.

## Reader Spine

Before drafting, know enough about the reader to avoid generic prose:

- Who is reading?
- What do they already know or believe?
- What should change after reading?
- What concepts, claims, or examples must be grounded before the piece works?
- What would the reader object to, misunderstand, or dismiss?

If the missing answer would materially change the artifact, ask one narrow
question. If the answer can be assumed safely, draft with the assumption and
mention it only when trust depends on it.

## Grounding Path

While drafting, track what the reader can safely follow:

- Introduced concepts.
- Claims already supported by source material, examples, or reasoning.
- Claims still needing proof, narrowing, or removal.
- Jumps where the draft asks the reader to accept a conclusion too early.
- Examples or concrete nouns that would make an abstract point real.

Do not promote raw context into an outline just to look organized. Grounding is
about reader comprehension, not document bureaucracy.

## Quiet Quality Loop

Before returning important writing, run these checks privately and fix what is
in scope:

1. **Reader fit**: the draft speaks to the intended reader and respects what
   they know walking in.
2. **Grounding**: concepts and claims arrive in an order the reader can follow.
3. **Source truth**: factual claims are supported, narrowed, or clearly framed
   as assumptions.
4. **Specificity**: the piece uses concrete nouns, examples, mechanisms, or
   source-backed details where the draft would otherwise be generic.
5. **Style fit**: the selected style guide shapes the writing without parody,
   close-copying, or overusing one signature move.
6. **Channel fit**: the piece follows the destination's structure, length, CTA,
   title, or formatting constraints when a channel recipe exists.
7. **Anti-AI cleanup**: remove obvious automated-writing tells using the linter
   below.
8. **Ending quality**: the ending changes the reader's understanding or next
   action; it does not merely restate the opening.

If a check cannot be satisfied safely, do not fake it. For example, do not add a
specific customer example when no source supplied one. Say the limit in one
plain sentence only when it matters.

## AI-Tells Linter

The linter is a small heuristic pass. It catches repeatable surface problems; it
does not decide whether writing is good, personal, or true. Use it to repair
obvious issues before output.

Check for:

- **Generic openers**: "In today's fast-paced world," "As we navigate," "It is
  important to note," "In conclusion."
- **Category summaries**: broad setup that names a topic but does not create a
  point, tension, or decision.
- **Symmetrical scaffolding**: paragraphs with the same length, opener, or
  three-part rhythm when the idea does not need it.
- **Filler transitions**: "Moreover," "Furthermore," "Additionally," "Overall,"
  "Ultimately" when they only announce structure.
- **Inflated vocabulary**: leverage, optimize, unlock, robust, seamless,
  transformative, game-changing, cutting-edge, impactful.
- **Unsupported certainty**: "clearly," "undoubtedly," "proves," or "will" when
  the source only supports "suggests," "can," or "may."
- **Vague examples**: "many companies," "some people," "various use cases," or
  invented specifics not present in the source.
- **Fake intimacy**: forced vulnerability, excessive "we," or "you and I" when
  the relationship is not established.
- **Generic endings**: conclusions that summarize the intro, make a vague call
  to action, or end with a moral instead of a useful turn.
- **Punctuation tells**: punctuation used for drama rather than rhythm or
  clarity, including repeated em dash structures when the style guide does not
  support them.

Fix by making the writing more specific, situated, and accountable. Do not fix
by adding fake flaws, slang, unsupported anecdotes, typos, or casualness.

## Variants

Variants are useful when they represent real editorial alternatives. Use them
for:

- Competing angles.
- Opening options.
- Structure options.
- Audience or channel variants.
- Voice variants when style evidence supports the difference.
- Competing revision strategies after a review.

Do not produce variants just to appear helpful. If the user needs one strong
draft, return one strong draft.

When durable state exists, real variants should be sibling drafts linked to the
same context and plan. Minor edits to the same candidate are versions. A chosen
variant becomes the working draft.

When working in chat only, keep variants brief and explain the editorial
tradeoff in normal language:

```text
One version starts with the harder claim and will land better if the piece
needs to challenge the reader. The other starts warmer and gives the reader a
little more room to come along.

I would use the sharper opening if this is meant to shift someone's mind, and
the warmer one if the relationship matters more than the provocation.
```

Do not ask the user to compare variants that differ only by wording.

## What The User Sees

The user should usually see only the improved artifact.

Add one short note only when it changes trust or next action. Keep it warm,
plain, and specific:

```text
I kept the customer example broad because the source material did not give us
enough detail to make it concrete.
```

```text
I cleaned this up without trying to imitate your voice, since there was not a
voice guide attached.
```

```text
I gave you two openings because the piece could either push harder on the
contradiction or start from a more advisory place.
```
