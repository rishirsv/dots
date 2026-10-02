---
name: how
description: "Explains how code, a subsystem, change, commit, branch, or pull request works, including runtime flow, ownership, placement, and layering. Use why for historical rationale, explain-simply for a quick plain-language answer, and architecture-review for a broad structural audit."
---

# How

Explore the codebase to answer “how does X work?” questions. Produce clear
explanations that help a senior engineer understand an unfamiliar subsystem.
Explain how the parts work together so the reader can start working on it.

## 1. Understand the question and choose the depth

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
  feature that crosses modules, or a broad architectural overview. Investigate
  the code yourself if you can follow all paths needed to answer the question.
  Add read-only explorers when they can investigate independent paths or
  when parallel work will cover more evidence or finish substantially faster.

When in doubt, investigate directly. Add an explorer when you cannot cover
the necessary source clearly in the current investigation.

## 2. Trace the source

Find the real entry point. Follow its callers, callees, types, state changes,
data flow, module boundaries, and observable effects. Read the implementation
before drawing conclusions from file names.

When delegating a complex question, divide the work by parts that answer
different pieces of the question. A rate limiter might split into:

- data model and state management;
- request path and enforcement; and
- configuration, metrics, and operational controls.

Read [explorer-prompt.md](references/explorer-prompt.md) before briefing
explorers. Each explorer should stop only when it can describe its path from
input to output or from trigger to effect, with evidence for each step. It returns the
components found, flow traced, files read, and anything surprising or easy to
misunderstand.

## 3. Build one explanation

Combine your findings into one explanation. Resolve conflicting findings
before writing the answer. Combine reports in the current context unless
they are large, conflict, or each require substantial analysis.
Only then use a separate explainer with
[explainer-prompt.md](references/explainer-prompt.md).

Lead with the system's purpose and how its parts work together. Then walk through what
happens, where state lives, how data moves, and which decisions change the
path. Link claims that affect the explanation to specific files and symbols.

Write a complete explanation. Connect the findings so the reader does not
have to reconstruct the behavior from search notes or file lists.

## Output contract

Adapt these sections to the question. Do not include an empty section merely
because it appears here.

- **Overview.** One or two paragraphs explaining what the thing is, what it
  does, and how its parts work together. The reader should know whether to keep reading.
- **Key concepts.** Brief definitions of the types, services, or abstractions
  needed to understand the rest. Include only the important ones.
- **How it works.** Walk through the trigger-to-effect flow in prose. Explain
  the order, state, data movement, and decision points. Cite files and functions
  without turning the answer into annotated source.
- **Where things live.** Give the smallest useful map of files and ownership so
  the reader knows where to start working.
- **Gotchas.** Explain the surprising behavior, hidden coupling, historical
  constraint, or failure risk a newcomer is likely to miss.

When the user asks to see, diagram, or make the explanation visual, read
[Visual explanations](../../references/visual-explanations.md) and include the
smallest useful view. Otherwise use a visual when several components interact
or data changes shape across stages and the picture makes that relationship
easier to understand. Skip it when prose already makes the flow clear.

For change mode, follow `changes.md` to choose the explanation's order.
Use headings that fit the change.

## Delivery and completion

Return chat unless the user asks for HTML or a durable, visual, or shareable
artifact. For HTML, hand the finished content and structure to `html` with this
skill's `artifact-template.json`. HTML adds visual explanations by default;
provide the flows, state changes, dependencies, and evidence needed to draw
them accurately. Preserve any fixed template requirements.

The explanation is complete when it answers the question or covers the
meaningful change, links important claims to source, makes material gaps
visible, and can be understood without opening the repository.
