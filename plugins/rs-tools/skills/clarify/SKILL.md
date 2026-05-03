---
name: clarify
description: "Clarify requirements before implementation when the user explicitly invokes $clarify, asks to clarify an underspecified request, or wants questions before work starts. Inspect relevant repo/code context first, ask only must-have questions, and summarize the current common understanding in chat. Do not use for general brainstorming, design discussion, code review, accepted plans, or routine implementation."
---

# Clarify

Clarify turns an underspecified request into a shared understanding that is clear enough to implement, plan, or document.

Do not implement. Do not produce a detailed plan that depends on unanswered must-have questions.

## Goal

Ask the minimum set of clarifying questions needed to avoid wrong work, then state the current common understanding in concise bullets.

## Workflow

1. Restate the request in one or two sentences.
2. Explore the relevant context before asking avoidable questions:
   - read `AGENTS.md`, `README.md`, specs, plans, TODOs, and nearby code or examples when they are relevant
   - inspect configs, package files, tests, routes, schemas, or UI surfaces that would answer environment or ownership questions
   - use web research only when current outside facts materially affect the requirements
   - use sub-agents only when available and helpful for broad repo or research discovery
3. Decide whether must-have ambiguity remains.
4. Ask 1-5 must-have questions first. Prefer the smallest set that would change the next action.
5. Make questions easy to answer:
   - use short numbered questions
   - offer lettered choices when possible
   - mark recommended/default choices clearly
   - include a fast path such as `defaults`
   - include `Not sure - use default` when helpful
   - explain why the question matters in one plain sentence when the reason is not obvious
6. Pause before acting. Until must-have answers arrive, do not edit files, run destructive commands, or commit to a plan.
7. If the user asks you to proceed without answers, state assumptions briefly and ask for confirmation.
8. Once must-have answers are settled, output the common understanding and recommend the next move.

If the request is already concrete enough, say Clarify is not needed, provide the common understanding, and recommend proceeding.

## What To Clarify

Clarify only what would change the next real step:

- objective: what should change and what should stay the same
- definition of done: acceptance criteria, examples, edge cases, target behavior
- scope: files, components, users, workflows, platforms, or states in and out
- constraints: compatibility, performance, style, dependencies, time, migration, rollout, or reversibility
- environment: language/runtime versions, OS, build/test runner, data sources, deploy target
- safety: data loss, irreversible edits, migrations, auth, secrets, production risk

Do not ask the user to decide things existing docs, code, or repo conventions already decide.

## Question Shape

Ask in simple, short, plain English for a smart non-technical user.

This means:

- start with the simple version first
- use everyday words before technical terms
- explain technical terms in one short sentence only when they matter
- say why the answer matters in practical terms
- give at most one sentence of context before a question
- ask one question at a time unless a small numbered set is clearly faster
- avoid academic framing, dense implementation language, and giant walls of explanation

Prefer compact questions with defaults:

```text
Before I start, I need two quick answers. These decide how wide the change should be and what I should avoid breaking.

1. Scope?
a) Minimal change (recommended/default)
b) Refactor while touching the area
c) Not sure - use default

2. Compatibility target?
a) Current project defaults (recommended/default)
b) Also support older versions: <specify>
c) Not sure - use default

Reply with: defaults, or a compact answer like `1a 2b`.
```

Separate **Need To Know** from **Nice To Know** when it reduces friction.

When a question needs context, use this shape:

```md
Need To Know

1. [Plain question]?
a) [Recommended/default choice]
b) [Alternative]
c) Not sure - use default

Why this matters: [One short sentence about the practical impact.]
```

## Output

Always include a chat summary named **Common Understanding**.

Use concise bullets:

- **Goal**: what the user is trying to build, change, decide, or document
- **Current Understanding**: settled facts from the user, repo, docs, code, or research
- **Scope**: what is in and out
- **Constraints And Defaults**: important constraints plus assumptions that will be used if accepted
- **Still Open**: only unresolved must-have questions, or `None`
- **Recommended Next Step**: the exact next artifact, plan, or implementation move

When asking questions, put **Need To Know** before **Common Understanding** so the user sees what to answer first.

Default to chat. Create or update a durable artifact only if the user asks or the shared understanding needs to persist for later planning or implementation.

## Anti-Patterns

- Asking questions a quick, low-risk repo read can answer.
- Asking open-ended questions when a tight multiple-choice or yes/no would eliminate ambiguity faster.
- Asking about implementation details before product or behavior meaning is clear.
- Producing a detailed plan while must-have unknowns remain.
- Treating nice-to-have preferences as blockers.
- Implementing from Clarify without the user's answers or confirmed assumptions.
