# Writing Quality

Single source of truth for what "good" means in Drafts output.

The bar has two parts, matching the `generative` and `deterministic` split in
[writing-rules.md](writing-rules.md):

- **Judgment rubric** — generative checks that need a reader's judgment.
- **Tell lint** — deterministic rules with concrete triggers, no judgment call.

## How Compose Applies It

`compose` runs the bar privately before returning writing and fixes what is in
scope. It is not a separate user-facing lane. Scale the pass to the work:

- **Every return** runs the tell lint plus the freshness, ending, and channel
  checks. A fast rewrite, a short direct-prose reply, or a small revision needs
  only this.
- **Substantial or durable writing** runs the full rubric, adding reader fit,
  grounding, source truth, specificity, and style fit. Treat new substantial
  pieces, section and whole-piece passes, personalized drafts, and durable
  drafts or versions as full-pass work.

Fix in-scope misses silently; do not fake a check. If a check cannot be met
safely, leave it unmet and say the limit in one plain sentence only when it
affects trust or the user's next decision — for example, do not invent a
specific customer example when no source supplied one. The `compose` loop is not
an excuse to skip requested feedback; when the user asks what to fix, answer in
plain editorial terms and then revise through `compose`.

## Judgment Rubric

Generative checks. Weigh each against the piece's reader, intent, and source.

1. **Reader fit**: the draft speaks to the intended reader and respects what
   they know walking in.
2. **Grounding**: concepts and claims arrive in an order the reader can follow.
3. **Source truth**: factual claims are supported, narrowed, or clearly framed
   as assumptions.
4. **Specificity**: the piece uses concrete nouns, examples, mechanisms, or
   source-backed details where it would otherwise be generic.
5. **Style fit**: the selected style guide shapes the writing without parody,
   close-copying, or overusing one signature move.
6. **Channel fit**: the piece follows the destination's structure, length, CTA,
   title, or formatting constraints when a channel recipe exists.
7. **Freshness**: no symmetrical paragraph scaffolding, category-summary openings
   that name a topic without making a point, formulaic three-part rhythm, or
   fake intimacy ("you and I," excessive "we") where the relationship is not
   established.
8. **Ending quality**: the ending changes the reader's understanding or next
   action; it does not merely restate the opening.

## Tell Lint

A deterministic pass. Each rule is a concrete trigger, not a judgment call: flag
and fix every match unless the selected style guide explicitly licenses it. The
rules are written so a validator could enforce them later; today the model
applies them literally. The lint catches surface tells only — it does not decide
whether writing is good, personal, or true, and it is no license to add fake
imperfections.

| Rule | Trigger | Fix |
| --- | --- | --- |
| Banned openers | Sentence opens with "In today's fast-paced world," "As we navigate," "It is important to note," "In conclusion," "When it comes to," "At the end of the day." | Cut the opener; start on the actual point. |
| Filler transitions | "Moreover," "Furthermore," "Additionally," "Overall," "Ultimately" used to announce structure rather than carry logic. | Delete or replace with a real logical link. |
| Inflated vocabulary | leverage, optimize, unlock, robust, seamless, transformative, game-changing, cutting-edge, impactful — when the source did not use the term. | Replace with the plain verb or a concrete claim. |
| Unsupported certainty | "clearly," "undoubtedly," "proves," "will" when the source supports only "suggests," "can," or "may." | Downgrade the claim to what the source supports. |
| Vague quantifiers | "many companies," "some people," "a lot of," "various use cases," or any specific figure not present in the source. | Name the real instance or remove the count. |
| Em-dash overuse | More than one em-dash construction in a paragraph, or repeated em-dash framing, when the style guide does not call for it. | Re-punctuate with commas, periods, or restructured clauses. |
| Generic CTA ending | Closing line is a vague call to action or a moral that restates the opening. | Replace with a concrete next step or a turn that adds something. |

Fix by making the writing more specific, situated, and accountable. Do not fix
by adding slang, unsupported anecdotes, typos, or forced casualness.
