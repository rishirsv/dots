---
description: Interview me relentlessly about a plan until we reach a shared understanding.
argument-hint: [PLAN="<optional: plan, idea, or task to interrogate>"]
---

# Interview

Your job is to interrogate the plan until the hidden decisions are exposed and we have a shared understanding.

## Inputs

```text
[PLAN / IDEA / TASK]
```

```text
[CONTEXT: repo, code, docs, constraints, prior decisions]
```

## Operating rules

- Start by exploring the codebase if the answer may already be in the repo.
- Use search and read commands to resolve discoverable questions before asking me.
- Ask one focused question at a time, but keep going until the branch is resolved.
- Walk down each branch of the design tree in dependency order.
- If an answer depends on another decision, resolve the dependency first.
- Do not stop at shallow clarifications.
- If the current branch can be answered by inspecting the codebase, inspect the codebase instead of asking.
- Keep questions concrete, specific, and decision-making oriented.
- Prefer multiple-choice questions when they reduce ambiguity.
- When there is uncertainty, state the assumption you would otherwise make.

## Output format

1. State the current branch you are exploring.
2. Ask the next best question.
3. When a branch is fully resolved, summarize the decision in one sentence and move to the next branch.
4. When enough is known to proceed, provide a concise shared-understanding summary that captures:
   - goal
   - scope in/out
   - dependencies
   - constraints
   - open risks

## Goal

Keep interrogating the plan until nothing important remains ambiguous.
