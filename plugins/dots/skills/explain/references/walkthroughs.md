# Explain a complex subject

Produce a clear explanation. Enough to build a working mental model, not
annotated source code.

Assess complexity to decide the approach:

- **Simple** (a single module, a small utility, a narrow question like "how does
  function X work"): explore and explain in a single pass.
- **Complex** (a subsystem spanning multiple files/services, a cross-cutting
  feature, a full architectural overview): split the question into distinct
  parts and trace only the parts needed for the explanation.

When in doubt, lean simple. You can always explore further if the explanation
hits a wall.

For code, start broad enough to find the real entry point, then follow the
thread: callers, callees, data flow, and type definitions. Read the actual code,
don't guess from file names. Stop when you can describe the full path from input
to output, or trigger to effect, without hand-waving any step. Note things that
are surprising, non-obvious, or that a newcomer would get wrong.

Begin with where the reader is, where the explanation is going, and a short map
of the parts. Explain each part when it becomes relevant and show how it
connects to the next. Adapt this order to the question; do not force empty
sections:

- **Overview.** 1-2 paragraphs. What it is, what it does, why it exists. Enough
  to decide whether to keep reading.
- **Key concepts.** The important types, services, or abstractions. Brief
  definition of each. Not exhaustive, just the ones needed to understand the
  rest.
- **How it works.** Walk through the flow: what triggers it, what happens step
  by step, where data goes, the decision points. Prose, not pseudocode.
- **Where things live.** A brief map of the relevant files/directories. Not
  every file, just the ones needed to start working in this area.
- **Gotchas.** Non-obvious or surprising things that would trip someone up.
  Historical context that explains why something looks weird. Known sharp
  edges.

For a live decision, explain one decision and its required vocabulary, then
pause. For a requested complete walkthrough, continue through the map without
forcing pauses.
