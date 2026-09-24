---
name: clarify-requirements
description: "Use only when the user selects `$clarify-requirements` to resolve underspecified requirements before implementation; not for shaping a fuzzy idea, planning the implementation, or asking questions the repository can answer."
---

# Clarify Requirements

Resolve only ambiguities that could change the work. Once they are resolved,
continue implementation already authorized by the user; do not ask them to
confirm the same decisions again. A clarification-only request ends with the
shared understanding.

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

Ask the smallest set of unresolved questions, at most three in the first pass.
Ask none when the available evidence already settles them. Prioritize the
question that removes the largest consequential branch of work.

Make each question easy to answer:

- keep it short and number it when there is more than one;
- offer distinct choices when they are clearer than an open-ended question;
- recommend a reasonable default when one genuinely fits the repository and
  the user's direction;
- include “not sure, use the default” when that lowers the cost of answering;
  and
- separate must-have questions from optional preferences when both exist.

### 3. Pause only for answers that change the work

Do not edit files or produce a detailed implementation plan while a must-have
decision is unresolved. Low-risk repository inspection may continue.

If the user tells you to proceed without answering, state the assumptions that
could affect the result and continue. Do not require another confirmation after
the user has already approved that path.

### 4. Record the shared understanding when it helps

For work with meaningful scope or risk, summarize the agreed outcome,
definition of done, scope and non-goals, constraints, and remaining assumptions.
Keep it short. This skill owns alignment, not a repo-grounded implementation plan.

Finish when every blocking ambiguity is answered, explicitly deferred, or
covered by an assumption the user authorized. If later evidence changes one of
those decisions, surface the change before continuing.
