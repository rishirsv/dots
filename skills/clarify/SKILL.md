---
name: clarify
description: "Ask clarifying questions before planning or implementation. Use when the user wants the minimum questions needed to proceed safely, or explicitly wants a deeper grill-style interview. End with a short Common Understanding summary; create docs-only artifacts only when requested."
---

# Clarify

## Goal

Reduce ambiguity before planning or implementation, then leave a usable shared-understanding artifact.

This skill has two modes:
- `standard`: ask the minimum clarifying questions needed to avoid wrong work
- `grill`: interview relentlessly until there is shared understanding

Do not start implementing until the needed unknowns are resolved, or the user explicitly approves proceeding with stated assumptions.

## Required Output

Always finish with `Common Understanding`, even if the request is still blocked.

Use this structure:

```md
# Common Understanding

## Agreed
- ...

## Open
- ...

## Next
- ...
```

Rules:
- Keep it short, concrete, and decision-oriented.
- Do not turn it into an execution plan.
- Read `references/common-understanding.md` when you need guidance on what belongs in `Agreed`, `Open`, or `Next`, including canonical terms, ADRs, and doc propagation.

## Optional Durable Artifacts

Create a durable artifact only when the user wants one.

Artifact rules:
- Write durable artifacts only under `docs/`; do not write source files from this skill.
- Inspect existing repo docs first and preserve established canonical doc families when they exist.
- If the user wants an artifact but does not specify which one, default to a context doc.
- If the repo has a canonical spec template or docs skill, follow that existing structure instead of inventing a parallel format.
- Default to a context doc when no stronger repo convention exists. Read `references/context-format.md` only if you need to create one.

## Mode Selection

Default to `standard` mode.

Switch to `grill` mode only when the user explicitly signals they want deeper interrogation, for example:
- `grill me`
- `stress-test this`
- `interview me on this`
- `keep asking until we really understand it`
- `question this thoroughly`

Do not auto-switch into `grill` mode just because the task is vague.

## Shared Rules

- If a question can be answered with a quick, low-risk discovery read, inspect first instead of asking
- Do not ask the user to decide things the repo or docs already answer
- Prefer questions that eliminate whole branches of work
- Sharpen fuzzy or overloaded language into canonical terms when that would reduce ambiguity
- If the user's description conflicts with existing code or docs, surface the contradiction directly
- Restate your understanding before proceeding
- Do not produce a detailed plan or implementation direction that depends on unresolved must-have unknowns
- Use the `RequestUserInput` or `AskUserQuestion` tool when available; otherwise, ask in plain text

## Standard Mode

- Use this when the goal is to get just enough information to proceed safely.
- Treat the request as underspecified when multiple plausible interpretations still exist after low-risk discovery.
- Ask 1-5 must-have questions first.
- Make questions easy to answer: short numbered questions, multiple-choice when possible, reasonable defaults, and a compact reply path such as `defaults` or `1b 2a`.
- Until must-have answers arrive, do not run commands, edit files, or produce a detailed plan that depends on unknowns.
- If the user asks you to proceed anyway, state assumptions briefly and ask for confirmation.
- Once the needed answers are in, restate the requirements in 1-3 sentences and end with `Common Understanding`.

## Grill Mode

- Use this only when the user explicitly wants deeper interrogation or pressure-testing.
- Start with low-risk discovery if docs or code can answer obvious questions.
- Walk the decision tree one branch at a time: problem, scope, stakeholders, core flow, constraints, edge cases, success criteria.
- Ask one focused question at a time and keep going until you can describe the solution or direction without guessing.
- For each question, provide your recommended answer or default.
- Use concrete scenarios when they expose hidden ambiguity or ownership.
- Stop when there is shared understanding, the user says to stop, or the remaining unknowns are clearly optional.
- End with `Common Understanding` and create any requested docs artifact under `docs/`.

## Anti-Patterns

- Do not ask questions the repo can answer with a quick read
- Do not ask open-ended questions if a tight choice would resolve ambiguity faster
- Do not turn standard mode into a full interview
- Do not turn grill mode into a batch questionnaire
- Do not sharpen terminology by inventing a taxonomy the user does not need
- Do not write docs artifacts unless the user asked for a durable artifact or clearly wants one
- Do not create docs outside `docs/` for this skill
- Do not proceed to implementation while must-have unknowns remain unresolved

## Tools

Use the following tools to present clarification questions if available:

- `AskUserQuestion`
- `RequestUserInput`
