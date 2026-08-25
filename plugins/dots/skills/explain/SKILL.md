---
name: explain
description: "Use only when the user writes `$explain`. Give a quick plain-language or ELI5 explanation of any subject, or the previous answer when none is named; not for rigorous code investigation, critique, review, or implementation."
---

# Explain

Explain the named subject or, when none is named, the previous answer. Ask what
to explain only when neither is clear.

Match the user's existing knowledge, vocabulary, and conversation context. Fill
the missing bridge instead of restarting the whole subject. Lead with the
practical result, then explain the smallest mechanism needed to make it make
sense and why it matters.

Translate rather than restate. Start with something the user can picture: an
action, failure, or handoff. Introduce the technical term after the behavior is
clear. Use one concrete example, comparison, or compact text diagram when it
shortens the explanation. If the previous answer did not land, explain the
missing idea from a different angle instead of summarizing it.

Write the explanation once. Do not split it into technical and simple versions
or use headings that narrate the explanation. Use a heading only when it names
the subject. Prefer the plain word and stop when the user can follow the result.

Read the shared [writing style](../../references/writing-style.md) only for a
substantial or writing-heavy explanation.

Do not start a repository investigation, review code, or create an artifact.
The user can select `$how` when they want a rigorous, source-traced
explanation of code, a system, or a change.
