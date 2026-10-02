---
name: explain-simply
description: "Use only when the user writes `$explain-simply`. Give a plain-language explanation of any subject, or the previous answer when none is named, building intuition through examples and diagrams for code-related subjects; not for rigorous code investigation, critique, review, or implementation."
---

# Explain Simply

Explain the named subject or, when none is named, the previous answer. Ask what
to explain only when neither is clear.

Use plain language that does not require specialist knowledge. Give the
background needed to answer the question without restarting the whole subject.
Lead with the answer, then explain the relevant mechanism or distinction and
provide the context needed to understand it.

Explain the idea in familiar words. Describe the behavior before naming
technical terms. Use an example, analogy, comparison, or compact text diagram
only when it makes the answer clearer or shorter. If the previous answer was unclear, explain the missing idea with a different
example or comparison.

When the user asks to see, diagram, or make the explanation visual, read
[Visual explanations](../../references/visual-explanations.md) and use only its
lightweight inline forms.

For code-related subjects, start with the problem. Introduce the
important entities and what they represent. Explain who owns each
responsibility, how the entities relate, and how they behave. Use concrete examples and inline
diagrams, reading [Visual explanations](../../references/visual-explanations.md)
as useful. Use the same example throughout the explanation. For diffs, show the same
scenario before and after. Explain new concepts through concepts already
introduced. Use the available code and context. Adjust detail to the subject
and requested length.

Finish after answering the question, explaining the needed mechanism or
distinction, and correcting any misconception shown by the context. Include a
next action only when useful.

Read the shared [writing style](../../references/writing-style.md) only for a
substantial or writing-heavy explanation.

Do not start a repository investigation, review code, or create an artifact.
The user can select `$how` when they want a rigorous, source-traced
explanation of code, a system, or a change.
