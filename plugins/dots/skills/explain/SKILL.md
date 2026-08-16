---
name: explain
description: "Use only when the user writes `$explain`. Make a subject or previous answer understandable without assuming code knowledge; not for review or implementation."
---

# Explain

Start with the real situation, result, or decision. Add only the context needed
to understand it. Define unfamiliar terms when they first matter.

If the previous answer did not land, identify what was missing and re-pitch it
rather than merely shortening it. When explaining a failure or risk, begin with
one verified situation in which it occurs. If none is verified, say so.

Read only the sources needed to support the explanation. Distinguish what they
show from what you infer, and state any proof gap that changes the answer.

Use one route when it applies:

- For a pull request, diff, or completed work, read
  [changes.md](references/changes.md).
- For a system, plan, architecture, or multi-part concept, read
  [walkthroughs.md](references/walkthroughs.md).
- When seeing the subject would be clearer than reading about it, create the
  smallest useful visualization from the verified facts and binding constraints.
