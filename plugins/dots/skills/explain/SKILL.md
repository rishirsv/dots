---
name: explain
description: "Use only when the user writes `$explain`. Explain any subject or, when none is given, the previous answer in plain language; not for critique, review, or implementation."
---

# Explain

Explain the subject the user names. If they name none, explain the previous
assistant answer; ask what to explain only when there is no usable subject in
the conversation.

Start with the real situation, result, or decision. Add only the context needed
to understand it. Define unfamiliar terms when they first matter.

Make it simple and clear for an intelligent adult who is new to the subject.
Reduce cognitive load without talking down to the reader. Keep the real
mechanism and any terminology they need, then explain each piece in plain
language.

Build the smallest working mental model. Identify what the user already appears
to know, what is missing, and the real situation, result, or decision that makes
the subject matter. Add enough background to bridge the gap. Stop once the
bridge concept is clear, not merely once the basic answer has been stated.

Prefer one concrete example or compact visual when it can replace an abstract
explanation. Choose the simplest example that exposes the mechanism. Prefer
round numbers and direct comparisons; do not add precise calculations unless
the calculation itself is what the user needs. Prefer the real mechanism and a
concrete example over an analogy. An analogy may reinforce the explanation
afterward, but must not open the answer or stand in for how the subject actually
works. When explaining a failure or risk, begin with one verified situation in
which it occurs. If none is verified, say so.

If the answer is already supported by the conversation, explain it immediately.
If the previous answer did not land, identify what was missing and re-pitch it
rather than merely shortening it. Do not research or load a reference merely to
make a simple explanation feel complete.

Be specific. Say what it does, not how it feels. Prefer the plain word. Vary
rhythm. Short sentences. Then longer ones that take their time. Mix it up.

Read only the sources needed for accuracy. Distinguish what they show from what
you infer, and state any proof gap that changes the answer. Use only the routes
that apply:

- For a substantial or writing-heavy explanation, read the shared
  [writing style](../../references/writing-style.md).
- For a pull request, diff, or completed work, read
  [changes.md](references/changes.md).
- For code or system mechanics, architecture, a plan, or a multi-part concept,
  read [walkthroughs.md](references/walkthroughs.md).
- For intent, history, rationale, or rejected alternatives, read
  [reasons.md](references/reasons.md). When the question asks both how and why,
  explain the mechanics first and investigate intent only where mechanics do
  not answer it.
- When seeing the subject would be clearer than reading about it, create the
  smallest useful visualization from the verified facts and binding constraints.

Explain stated tradeoffs when they help understanding. If the user asks whether
the design is good or what should change, route that judgment to the appropriate
review skill instead of adding an architecture critique here.
