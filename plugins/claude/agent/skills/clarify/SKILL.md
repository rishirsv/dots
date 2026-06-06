---
name: clarify
description: "Clarify requirements before implementation when the user invokes $clarify, asks to clarify an underspecified request, wants questions before work starts, or an agent needs must-have user context before an ambiguous workflow. Inspect repo/code context first, ask only must-have questions or play back a sufficient brief, summarize common understanding, and recommend the next route. Not for brainstorming, PRD authoring, code review, accepted plans, or routine implementation."
---

# Clarify

Clarify turns an underspecified request into a shared understanding that is clear enough to implement, plan, or document.

Do not implement. Do not produce a detailed plan that depends on unanswered must-have questions.

## Goal

Ask the minimum set of clarifying questions needed to avoid wrong work, or play back an already-sufficient brief before routing to the next workflow. Then state the current common understanding in concise bullets. When the result needs a formal requirements artifact, recommend that artifact instead of writing it inside Clarify.

## Workflow

1. Restate the request in one or two sentences.
2. Explore the relevant context before asking avoidable questions:
   - read `AGENTS.md`, `README.md`, specs, plans, TODOs, and nearby code or examples when they are relevant
   - inspect configs, package files, tests, routes, schemas, or UI surfaces that would answer environment or ownership questions
   - use web research only when current outside facts materially affect the requirements
   - use sub-agents only when available and helpful for broad repo or research discovery
3. Decide whether must-have ambiguity remains.
4. Choose a mode:
   - **Question mode**: required context is missing. Ask only the missing must-have questions.
   - **Playback mode**: required context is already present. Do not re-ask answered questions; play back the brief and name the recommended route.
   - **Route mode**: the main ambiguity is which skill/artifact/workflow should own the work. Compare likely routes and recommend one.
5. In question mode, ask 1-5 must-have questions first. Prefer the smallest set that would change the next action.
6. In question mode, make questions easy to answer:
   - use short numbered questions
   - offer lettered choices when possible
   - mark recommended/default choices clearly
   - include a fast path such as `defaults`
   - include `Not sure - use default` when helpful
   - explain why the question matters in one plain sentence when the reason is not obvious
7. Pause before acting. Until must-have answers arrive, do not edit files, run destructive commands, or commit to a plan.
8. If the user asks you to proceed without answers, state assumptions briefly and ask for confirmation.
9. Once must-have answers are settled, output the common understanding and recommend the next move.
10. If the clarified work is feature-scale, cross-session, or likely to be implemented by another agent, recommend the smallest durable artifact needed next: a requirements document, decision record, implementation brief, or existing owner-doc update.

If the request is already concrete enough, use playback mode: say Clarify does not need more questions, provide the common understanding, and recommend proceeding through the exact route.

When the task belongs to a recurring brief type, read [references/brief-types.md](references/brief-types.md) and use only the matching row.

## What To Clarify

Clarify only what would change the next real step:

- objective: what should change and what should stay the same
- definition of done: acceptance criteria, examples, edge cases, target behavior
- scope: files, components, users, workflows, platforms, or states in and out
- constraints: compatibility, performance, style, dependencies, time, migration, rollout, or reversibility
- environment: language/runtime versions, OS, build/test runner, data sources, deploy target
- safety: data loss, irreversible edits, migrations, auth, secrets, production risk

Do not ask the user to decide things existing docs, code, or repo conventions already decide.

## Playback And Routing

Use playback mode when the user already supplied the information needed to proceed safely. Keep it pithy: play back the brief, name any assumptions, and recommend the next route. Do not ask ceremonial confirmation for small, low-risk implementation work.

Use a hard confirmation gate only when a wrong route would waste substantial time or create risky work:

- multi-step design/prototype/build workflows
- destructive, irreversible, production, migration, or auth-sensitive work
- cross-skill handoffs where the next artifact will steer another agent
- broad repo edits where scope is still judgment-heavy

For ordinary implementation, docs edits, or small fixes, route directly once must-have ambiguity is gone.

When route choice is the main problem, compare only plausible routes. Prefer the existing skill or owner artifact over creating a new one.

Useful route defaults:

| Signal | Recommended route |
|---|---|
| Missing requirements before implementation | stay in `$clarify` until must-have questions are answered |
| Direction exists but terminology, scope, or domain model needs pressure-testing | `$grill` |
| Durable repo docs, PRD, feature/domain doc, runbook, API docs, or spec | `$docs-writer` |
| Reproducible or suspected software bug | `$debug` |
| Cross-agent or cross-session transfer | `$handoff` |
| Completed local work needs one safe commit | `$commit` |
| Completed local work needs branch, commit, push, and PR | `$yeet` |
| Request is already concrete and routine | no Clarify needed; proceed with the relevant implementation workflow |

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
- **Recommended Route**: the skill, artifact, or workflow that should own the next step
- **Recommended Next Step**: the exact next artifact, plan, or implementation move

When asking questions, put **Need To Know** before **Common Understanding** so the user sees what to answer first.

Default to chat. Recommend durable capture when the shared understanding needs to persist for later planning or implementation, but do not create a full requirements document from Clarify unless the user explicitly asks for that artifact.

## Durable Routing

When the clarified work needs to persist, route it to the right artifact:

- **Chat summary**: small or immediate implementation work.
- **Existing owner doc**: durable repo behavior, conventions, or source-of-truth documentation.
- **Requirements document**: feature-scale product requirements, user-facing workflows, acceptance criteria, or cross-session handoff.
- **Implementation brief or plan**: implementation sequencing after requirements are stable.
- **Decision record**: hard-to-reverse decisions that need durable rationale.

If the user explicitly asks Clarify to save a durable summary, update the existing canonical artifact when one exists. If no clear owner exists and the user did not name a path, ask where it should live before writing.

## Anti-Patterns

- Asking questions a quick, low-risk repo read can answer.
- Asking open-ended questions when a tight multiple-choice or yes/no would eliminate ambiguity faster.
- Asking about implementation details before product or behavior meaning is clear.
- Producing a detailed plan while must-have unknowns remain.
- Treating nice-to-have preferences as blockers.
- Asking for confirmation after every playback when the work is small and low-risk.
- Using Clarify as a mandatory gate before every skill.
- Implementing from Clarify without the user's answers or confirmed assumptions.
- Creating a new artifact family when a chat summary or existing owner doc is enough.
- Writing a requirements spec from Clarify when a short common-understanding summary is enough.
- Leaving implementation-blocking questions unresolved while recommending implementation.
