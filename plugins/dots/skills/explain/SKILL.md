---
name: explain
description: "Use only when the user writes `$explain`. Explain any subject or, when none is given, the previous answer in plain language; not for critique, review, or implementation."
---

# Explain

Explain the named subject or, when none is named, the previous answer. Ask what
to explain only when neither is clear.

Match the user's existing knowledge, vocabulary, and conversation context, but
do not assume the source wording already makes sense. Explain the missing
bridge, not the whole subject. Start with the practical result or decision,
then show the mechanism and why it matters. Stop when the user can follow the
result and decide what to do.

Translate rather than restate. Start with an observable action, failure, or
boundary, then introduce the technical term that names it. For code, name the
runtime actor and the file where it lives; do not describe the file itself as
performing the work. Connect the pieces with one concrete scenario, comparison,
or compact visual.

Write the explanation once. Do not split it into technical and simple versions
or use headings that narrate the explanation. Use a heading only when it names
the subject. Do not mirror a terse list of claims.

If the previous answer did not land, re-pitch the missing concept instead of
summarizing it. Research only when a missing fact would change the explanation.

Be specific. Say what it does, not how it feels. Prefer the plain word. Vary
rhythm. Short sentences. Then longer ones that take their time. Mix it up.

Use only the relevant reference:

- For a substantial or writing-heavy explanation, read the shared
  [writing style](../../references/writing-style.md).
- For a pull request, diff, or completed work, read
  [changes.md](references/changes.md).
- For code, system mechanics, architecture, plans, or comparisons,
  read [walkthroughs.md](references/walkthroughs.md).

When the user asks for an HTML, visual, or picture explainer, use `$html` to
turn the explanation into one self-contained page with large, simple visuals
and few words. Keep the real mechanism; let the HTML skill own the artifact.

Explain may shape the output of another workflow, but does not replace research,
review, or implementation.
