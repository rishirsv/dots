---
name: prd
description: "Turn settled conversation context, clarified requirements, research, prototypes, or idea-session decisions into an implementation-ready Product Requirements Document. Use when the user explicitly asks for a PRD, product requirements document, requirements spec, or asks to convert current context into a PRD. Synthesize what is already known; do not restart clarification unless a true implementation-blocking gap remains."
---

# PRD

Create a Product Requirements Document from settled context so another agent or engineer can implement without repeating the requirements conversation.

## Workflow

1. Reconstruct context from the current conversation, user-provided artifacts, durable docs, repo source, prototypes, research notes, and outputs from `$idea` or `$clarify`.
2. Inspect relevant repo reality before writing when implementation depends on existing architecture, terminology, tests, routes, schemas, UI states, or workflows.
3. Do not interview by default. Ask only if a missing answer would make the PRD materially wrong or unimplementable.
4. Draft the PRD in chat unless the user named a destination, asked for a file, or asked to publish it.
5. Publish, file, or edit an issue only when explicitly asked. If publishing requires labels, tracker conventions, or auth that are not discoverable, ask before mutating remote state.

## PRD Shape

Use the project's existing PRD or spec format when one clearly exists. Otherwise use this compact structure:

```md
# <Feature Or Change>

## Problem

<The user-facing problem, workflow gap, or opportunity.>

## Desired Outcome

<What should be true when this works, in plain language.>

## Users / Jobs

- <Who benefits and what job they are trying to complete.>

## Proposed Shape

- <Capabilities, workflows, states, interactions, or artifacts the solution should include.>

## Decisions Locked

- <Settled product, UX, technical, data, migration, rollout, or artifact-routing decision.>

## Scope

- <What must be included.>

## Non-Goals

- <What should not be built or changed.>

## Acceptance Criteria

- <Observable behavior, artifact review, command, or state that proves the work is done.>

## Implementation Notes

- <Relevant modules, interfaces, architecture constraints, data contracts, risks, or sequencing hints.>

## Testing Expectations

- <Expected automated checks, manual checks, fixtures, prior-art tests, or review evidence.>

## Open Questions

- <Blocking unknowns, or `None`.>
```

## Writing Rules

- Write for the next implementer, not for the current conversation transcript.
- Preserve project-native vocabulary and existing ownership boundaries.
- Keep file paths out of stable PRD prose unless the path is the durable owner of a concept or the user explicitly needs path-level scope.
- Prefer acceptance criteria over long generic user-story lists. Add user stories only when they clarify distinct users or jobs.
- Separate settled decisions from recommendations. Mark assumptions explicitly when they are not confirmed.
- Keep optional unknowns out of `Open Questions`; include only questions that could change implementation or acceptance.
- Do not turn the PRD into an execution plan. If sequencing is needed next, recommend `$improve-plan` after the PRD is accepted.

## Output

When drafting in chat, provide the PRD and then a short **Next Move** line:

- `accept PRD`
- `revise PRD`
- `save PRD to <path>`
- `publish PRD to <tracker>`
- `turn PRD into a plan`

When saving or publishing, report the destination and any validation performed.
