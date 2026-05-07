---
name: clarify
description: "Clarify requirements before implementation when the user explicitly invokes $clarify, asks to clarify an underspecified request, or wants questions before work starts. Inspect relevant repo/code context first, ask only must-have questions, summarize the common understanding, and for feature-scale work create or update the spec with the settled decisions needed to implement end to end. Do not use for general brainstorming, design discussion, code review, accepted plans, or routine implementation."
---

# Clarify

Clarify turns an underspecified request into a shared understanding that is clear enough to implement, plan, or document.

Do not implement. Do not produce a detailed plan that depends on unanswered must-have questions.

## Goal

Ask the minimum set of clarifying questions needed to avoid wrong work, then state the current common understanding in concise bullets. For feature-scale work, preserve the clarified decisions in the relevant spec so implementation should not need another requirements interview.

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
9. If the clarified work is feature-scale, cross-session, or likely to be implemented by another agent, create or update the repo's canonical spec with the settled decisions before implementation starts.

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

Default to chat for small changes. Create or update a durable spec when the shared understanding needs to persist for later planning or implementation, especially for new features or end-to-end feature changes.

## Spec Capture

Use the repo's existing spec location and format when one exists. Update an existing spec instead of creating a competing artifact. If the repo has no clear spec convention and the user did not name a path, ask where the spec should live before writing it.

Write the spec cleanly. Capture the substance of the discussion, but do not paste the transcript or preserve conversational wording. The spec should read like the source of truth for implementation.

For feature-scale clarification, the spec must capture:

- **Goal**: the user-visible outcome and why it matters
- **User-Facing Behavior**: what changes in the product or workflow
- **In Scope**: what implementation must cover
- **Out Of Scope / Non-Goals**: what should not be built
- **Decisions Made**: settled product, UX, technical, data, migration, or rollout decisions
- **Assumptions Accepted**: assumptions the agent may rely on during implementation
- **Acceptance Criteria**: observable behavior that proves the feature is done
- **Edge Cases**: important empty, error, transition, permission, compatibility, or data states
- **Validation Expectations**: tests, manual checks, review steps, or artifact checks expected after implementation
- **Open Questions**: `None` before implementation unless the user explicitly accepts a remaining optional unknown

Do not use the spec as an ExecPlan. The spec captures requirements and decisions; an ExecPlan, when needed, sequences the implementation work after the spec is stable.

## Anti-Patterns

- Asking questions a quick, low-risk repo read can answer.
- Asking open-ended questions when a tight multiple-choice or yes/no would eliminate ambiguity faster.
- Asking about implementation details before product or behavior meaning is clear.
- Producing a detailed plan while must-have unknowns remain.
- Treating nice-to-have preferences as blockers.
- Implementing from Clarify without the user's answers or confirmed assumptions.
- Creating a new artifact family when the right durable output is a clean spec.
- Leaving implementation-blocking questions open in a feature spec.
