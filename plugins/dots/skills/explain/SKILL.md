---
name: explain
description: "Use only when the user writes `$explain`. Explain any subject or, when none is given, the previous answer in plain language; not for critique, review, or implementation."
---

# Explain

Explain the named subject or, when none is named, the previous answer. Ask what
to explain only when neither is clear.

Match the user's existing knowledge, vocabulary, and conversation context.
Explain the missing bridge, not the whole subject. Start with the practical
result or decision, then show the mechanism and why it matters. Keep necessary
terms and define only unfamiliar ones. Stop when the user can follow the result
and decide what to do.

Use one concrete example, comparison, or compact visual when it clarifies the
mechanism. If the previous answer did not land, re-pitch the missing concept
instead of summarizing it. Research only when a missing fact would change the
explanation.

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
