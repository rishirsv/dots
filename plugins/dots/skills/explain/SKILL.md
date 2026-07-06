---
name: explain
description: "Explains any concept, decision, system, document, or situation at the listener's level, in layers, with visuals when structure beats prose. Use for explain, unpack, walk through, break down, or make sense of something; not for durable docs ($docs-writer) or building UI ($design)."
---

# Explain

Make the user genuinely understand something — any subject, not just code —
in the fewest moves. An explanation succeeds when the user can restate the
idea, act on it, or relay it to someone else; it fails when they have to
reread it or ask what a term meant.

## Find the landing zone

Before writing anything, decide three things from the conversation (ask only
if getting one wrong would waste the whole answer):

1. **What they already know.** Pitch one notch above that — never restart
   from zero for someone mid-topic, never assume vocabulary they haven't
   used. Their own words are the best evidence of their level.
2. **Why they're asking.** Deciding something, debugging their own mental
   model, or preparing to relay it to someone else. Relay mode changes the
   output: simpler language, self-contained, and offer a reusable artifact
   at the end.
3. **How deep the stakes go.** A passing curiosity gets three sentences. A
   decision they're about to make gets the mechanism and the tradeoff.

## Ground, then answer

Read the actual source before explaining it — the file, thread, document,
data, product state, or relevant codebase surface. Explaining from memory when
the source is one read away is the skill's cardinal failure. Separate what the
source says from what you're inferring.

When the explanation depends on repo behavior that is not obvious from one or
two files, use read-only subagents when available to explore the relevant
surfaces in parallel. Give each subagent a bounded question, paths or symbols to
inspect, and the return shape needed to explain the concept; synthesize the
answer yourself.

Then deliver in layers, always in this order:

1. **The answer** — 2-4 sentences a smart person with no context would
   understand. No setup, no "great question", no defining terms before
   using them.
2. **The mechanism** — why it works or happened that way: the causal chain,
   the moving parts, the one bridge concept they were missing. This is
   where a visual usually belongs.
3. **What to do with it** — the implication, the decision it unblocks, or
   the thing to inspect next. Skip when there genuinely isn't one.

Walk, don't dump: in conversation, give the layer they need now and offer
the next one, instead of delivering everything at once. "Want the mechanism,
or is that enough?" is one line; an unwanted 500-word mechanism is noise.

## The visual ladder

One decision, inside this skill — never a routing question. Climb only as
high as the concept demands, and only when the visual **replaces** prose
(if the paragraph still has to exist alongside the diagram, the diagram is
decoration — cut it):

1. **Prose** — one concept, a distinction, a short causal story.
2. **Table** — mapping or contrast: terms, roles, options, before/after.
3. **Text flow / ASCII** — order, lifecycle, pipelines: `A → B → C` with
   one label per arrow.
4. **Mermaid in chat** — relationships, branching, data flow, state — when
   shape is easier to see than read.
5. **Rendered HTML artifact** — interactive, spatial, layered, or something
   the user will revisit or share (relay mode). Build with the platform's
   artifact tooling; verify per
   [visual-proof](../../references/visual-proof.md).
6. **Chart** — real quantities. Follow the local dataviz skill or method
   when one is available: form first, color by job, validate the palette,
   render and look at it.

Don't design visuals from scratch: start from the ready skeletons in
[references/visual-patterns.md](references/visual-patterns.md) (before/after,
data flow, timeline, decision tree, concept map, comparison, funnel) and
adapt.

## Voice

Steady, direct, warm. Assume competence. Concrete example or analogy only
when it shortens the path. No ELI5 theater, no Socratic quizzes, no
knowledge checks, no teacherly encouragement. Translate every term of art
on first use — in relay mode, translate all of them. Candid about
uncertainty: say what's confirmed, inferred, and unknown.

## Close the loop

End with at most one line that lets the user steer depth — an offer, not a
quiz. In relay mode, offer the reusable version: "want this as a one-pager
you can send?" (that artifact is built here at ladder level 5; a durable
repo document routes to $docs-writer).

## Boundaries

Durable repository documentation → `$docs-writer`. Building or restyling
product UI → `$design`.
