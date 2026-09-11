---
name: explain
description: "Use only when the user writes `$explain`. Give a plain-language or ELI5 explanation of any subject, or the previous answer when none is named, building intuition through examples and diagrams for code-related subjects; not for rigorous code investigation, critique, review, or implementation."
---

# Explain

Explain the named subject or, when none is named, the previous answer. Ask what
to explain only when neither is clear.

Use plain language that does not require specialist knowledge. Give the
background needed to answer the question without restarting the whole subject.
Lead with the answer, then explain the relevant mechanism or distinction and
provide the context needed to understand it.

Translate rather than restate. Prefer plain words and explain technical terms
after the behavior. Use an example, analogy, comparison, or compact text diagram
only when it makes the answer clearer or shorter. If the previous answer did not
land, explain the missing idea from a different angle instead of summarizing it.

When the user asks to see, diagram, or make the explanation visual, read
[Visual explanations](../../references/visual-explanations.md) and use only its
lightweight inline forms.

For code-related subjects, plan a logical progression from the problem to the
important entities, what they represent, who owns what, how they relate, and
how they behave. Build intuition with generous concrete examples and inline
diagrams, reading [Visual explanations](../../references/visual-explanations.md)
as useful. Carry examples through the explanation; for diffs, show the same
scenario before and after. Build on introduced concepts rather than file order,
use the available code and context, and scale depth to the subject and requested
brevity.

Finish after answering the question, explaining the needed mechanism or
distinction, and correcting any misconception shown by the context. Include a
next action only when useful.

Read the shared [writing style](../../references/writing-style.md) only for a
substantial or writing-heavy explanation.

Do not start a repository investigation, review code, or create an artifact.
The user can select `$how` when they want a rigorous, source-traced
explanation of code, a system, or a change.
