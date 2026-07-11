---
name: explain
description: "Explains any concept, decision, system, document, or situation at the listener's level, in layers, with visuals when structure beats prose. Use for explain, unpack, walk through, break down, or make sense of something."
---

# Explain

Make the user genuinely understand something — any subject, not just code.
Lead with the conclusion, then include the mechanism, evidence, and implication
the user's goal requires. An explanation succeeds when the user can restate the
idea, act on it, or explain it to someone else.

## Find the landing zone

Before writing anything, decide three things from the conversation (ask only
if getting one wrong would waste the whole answer):

1. **What they already know.** Pitch one notch above that — never restart
   from zero for someone mid-topic, never assume vocabulary they haven't
   used. Their own words are the best evidence of their level.
2. **Why they're asking.** Deciding something, debugging their own mental
   model, or preparing to explain it to someone else. Shared explanations need
   simpler language, self-contained context, and an offer for a reusable
   artifact at the end.
3. **How deep the stakes go.** A passing curiosity gets three sentences. A
   decision they're about to make gets the mechanism and the tradeoff.

## Ground, then answer

Read the actual source before explaining it — the file, thread, document,
data, product state, or relevant codebase surface. Explaining from memory when
the source is one read away is the skill's cardinal failure. Separate what the
source says from what you're inferring.

When explaining a completed code change or diff, follow
[references/code-changes.md](references/code-changes.md). It owns the
investigation and teaching order; use `html` afterward only when the user wants
a persistent or shareable artifact.

When the explanation depends on repo behavior that is not obvious from one or
two files, use read-only subagents when available to explore the relevant
surfaces in parallel. Give each subagent a bounded question, paths or symbols to
inspect, and the return shape needed to explain the concept; synthesize the
answer yourself.

Choose only the layers the user needs:

1. **The answer** — 2-4 sentences a smart person with no context would
   understand. No setup, no "great question", no defining terms before
   using them.
2. **The mechanism** — why it works or happened that way: the causal chain,
   the moving parts, the one bridge concept they were missing. This is
   where a visual usually belongs.
3. **What to do with it** — the implication, the decision it unblocks, or
   the thing to inspect next. Skip when there genuinely isn't one.

Lead with the answer. Add the mechanism and implication when they materially
help the user understand, decide, or act; do not force empty sections or defer
essential reasoning to a follow-up.

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
   the user will revisit or share with someone else. Use the HTML skill or the
   platform's artifact tooling; verify per
   [visual-proof](../../references/visual-proof.md).
6. **Chart** — real quantities. Follow the local dataviz skill or method
   when one is available: form first, color by job, validate the palette,
   render and look at it.

Don't design visuals from scratch: start from the ready skeletons in
[references/visual-patterns.md](references/visual-patterns.md) (before/after,
data flow, timeline, decision tree, concept map, comparison, funnel) and
adapt.

## Voice

Steady, direct, warm. Assume competence. Use an example or analogy only when it
shortens the path. Keep it conversational. Translate every term of art on first
use; when the user needs to share the explanation, translate all of them. Say
what's confirmed, inferred, and unknown.

## Close the loop

End when the explanation is complete. Offer deeper treatment or a reusable
artifact only when the user's stated goal suggests it would be useful.
