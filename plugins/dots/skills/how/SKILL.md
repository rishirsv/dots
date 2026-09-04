---
name: how
description: "Explains how code, a subsystem, change, commit, branch, or pull request works, including runtime flow, ownership, placement, and layering. Use why for historical rationale, explain for a quick ELI5 answer, and architecture-review for a broad structural audit."
---

# How

Explore the codebase to answer “how does X work?” questions. Produce clear
architectural explanations at the level of a senior engineer onboarding onto a
subsystem. Enough to build a working mental model, not annotated source code.

How has two modes:

1. **Explain** is the default. Explore the codebase and explain how the system
   or change works.
2. **Critique** explains first, then reviews the architecture through
   `architecture-review`.

## Explain mode

### 1. Understand the question and choose the depth

How questions usually ask about one of these:

- “How does the rate limiter work?”, a subsystem.
- “How do we handle billing for on-demand usage?”, a feature flow.
- “How is the auth service structured?”, an architectural overview.
- “What happens when a user submits this form?”, a runtime trace.
- “Walk me through this pull request,” a completed change.

Identify the scope from the conversation and repository. If it is ambiguous,
state your best interpretation and proceed so the user can redirect you.

Read [tracing.md](references/tracing.md) before exploring. For a diff, commit,
branch, pull request, or completed body of work, also read
[changes.md](references/changes.md). A file list or diff summary is not an
explanation.

Choose the exploration path:

- **Simple:** a single module, small utility, or narrow function. Explore and
  explain it directly in the current context.
- **Complex:** a subsystem spread across several files or services, a
  cross-cutting feature, or a broad architectural overview. Trace it directly
  when one coherent pass can cover the consequential paths. Add read-only
  explorers only when the work divides into independent paths or parallel
  investigation materially improves coverage or latency.

When in doubt, start simple. Add an explorer only when the source stops fitting
comfortably in one coherent pass.

### 2. Trace the source

Start broad enough to find the real entry point, then follow the thread through
callers, callees, types, state changes, data flow, boundaries, and observable
effects. Read the code. Do not guess from file names.

When delegating a complex question, divide the work by parts that answer
different pieces of the question. A rate limiter might split into:

- data model and state management;
- request path and enforcement; and
- configuration, metrics, and operational controls.

Read [explorer-prompt.md](references/explorer-prompt.md) before briefing
explorers. Each explorer should stop only when it can describe its path from
input to output or trigger to effect without hand-waving a step. It returns the
components found, flow traced, files read, and anything surprising or easy to
misunderstand.

### 3. Build one explanation

Reconcile the exploration into one mental model. Synthesize the reports in the
current context unless they are large, conflicting, or independently complex.
Only then use a separate explainer with
[explainer-prompt.md](references/explainer-prompt.md).

Lead with the system's purpose and organizing idea. Then walk through what
happens, where state lives, how data moves, and which decisions change the
path. Connect consequential claims to specific files and symbols.

The explanation is the product. Do not make the reader reconstruct it from
search notes, file lists, or disconnected component summaries.

## Output contract

Adapt these sections to the question. Do not include an empty section merely
because it appears here.

- **Overview.** One or two paragraphs explaining what the thing is, what it
  does, and the organizing idea. The reader should know whether to keep reading.
- **Key concepts.** Brief definitions of the types, services, or abstractions
  needed to understand the rest. Include only the important ones.
- **How it works.** Walk through the trigger-to-effect flow in prose. Explain
  the order, state, data movement, and decision points. Cite files and functions
  without turning the answer into annotated source.
- **Where things live.** Give the smallest useful map of files and ownership so
  the reader knows where to start working.
- **Gotchas.** Explain the surprising behavior, hidden coupling, historical
  oddity, or sharp edge a newcomer is likely to miss.

When the user asks to see, diagram, or make the explanation visual, read
[Visual explanations](../../references/visual-explanations.md) and include the
smallest useful view. Otherwise use a visual when several components interact
or data changes shape across stages and the picture makes that relationship
easier to understand. Skip it when prose already makes the flow clear.

For change mode, derive the teaching story from `changes.md` rather than
forcing subsystem headings onto a diff.

## Critique mode

Critique mode starts when the user asks for architectural problems,
improvements, or a critical review. Run the full explanation first. You must
understand the architecture before judging it.

Then read and use `../architecture-review/SKILL.md`. Apply its architecture
review lenses, candidate bar, and evidence standard. Keep the review read-only
and architecture-level. Report only supported structural problems, cite the
code that demonstrates them, explain their practical impact, and distinguish
action-worthy problems from intentional tradeoffs or style preferences.

Present the explanation first, then the ranked critique. The explanation should
stand on its own for a reader who did not ask for the review.

## Delivery and completion

Return chat unless the user asks for HTML or a durable, visual, or shareable
artifact. For HTML, hand the finished content and structure to `html` with this
skill's `artifact-template.json`.

The explanation is complete when it answers the question or covers the
meaningful change, traces consequential claims to source, makes material gaps
visible, and can be understood without opening the repository.
