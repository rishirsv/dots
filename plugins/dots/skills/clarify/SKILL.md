---
name: clarify
description: "Use only when the user selects `$clarify` to resolve underspecified requirements before implementation; not for shaping a fuzzy idea, planning the implementation, or asking questions the repository can answer."
---

# Clarify

Ask the minimum set of questions needed to avoid wrong work. Complete every
useful inspection or preparation step that does not depend on the answers. Once
the user answers or tells you to proceed with assumptions, continue without a
second confirmation pause.

## Workflow

### 1. Inspect before asking

Read the request, relevant repository guidance, configuration, accepted
references, and nearby implementation. Do not ask the user for an answer the
available material already provides.

A request still needs clarification when more than one plausible answer would
change any of these:

- the objective, including what should change and what should stay the same;
- the definition of done, including important examples or edge cases;
- the scope, including which files, components, or users are in or out;
- the constraints, such as compatibility, performance, style, dependencies, or
  timing; or
- the safety boundary, including migration, rollout, rollback, or irreversible
  effects.

### 2. Ask the must-have questions

Ask one to three questions in the first pass. Prefer the question that removes
the largest branch of possible work or the highest-value unresolved questions.

Make each question easy to answer:

- keep it short and number it when there is more than one;
- offer distinct choices when they are clearer than an open-ended question;
- recommend a reasonable default when one genuinely fits the repository and
  the user's direction;
- include “not sure, use the default” when that lowers the cost of answering;
  and
- separate must-have questions from optional preferences when both exist.

### 3. Pause only the dependent decision

Do not commit to an implementation choice while a must-have decision is
unresolved. Continue repository inspection, reversible preparation, and any
work whose result does not depend on that answer.

If the user tells you to proceed without answering, state the assumptions that
could affect the result and continue immediately. Do not require another
confirmation after the user has approved that path.

### 4. Record the shared understanding when it helps

For work with meaningful scope or risk, summarize the agreed outcome,
definition of done, scope and non-goals, constraints, and remaining assumptions.
Keep it short. This summary is a handoff into the work, not another approval
gate. Clarify owns alignment, not a repo-grounded implementation plan.

Finish when every blocking ambiguity is answered, explicitly deferred, or
covered by an assumption the user authorized. If later evidence changes one of
those decisions, surface the change while continuing all unaffected work.
