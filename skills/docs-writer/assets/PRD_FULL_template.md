# <Product / Feature Name> PRD

## Problem

Describe the user, business, or operational problem in concrete terms. Name who experiences it, where it appears, what they cannot do today, and why the current workaround is insufficient.

## Desired Outcome

State the product outcome, not the implementation. Describe what users or operators can do after this ships and how the team will know the outcome was achieved.

## Users and Jobs

- **Primary user:** <persona or role>
- **Job to be done:** <task, motivation, and context>
- **Secondary users:** <roles affected by the change>
- **Access or permission assumptions:** <who can see or use it>

## Proposed Shape

Describe the experience or capability at the level needed for product alignment. Include primary flows, entry points, major states, and important copy or affordances. Keep code architecture out unless it changes product behavior.

Add diagrams only when they clarify a flow, state machine, surface map, or ownership boundary.

## Decisions Locked

- <Decision already made, with short rationale>
- <Decision already made, with short rationale>

## Scope

### In Scope

- <Capability, behavior, surface, or content included>
- <Capability, behavior, surface, or content included>

### Out of Scope

- <Capability intentionally excluded>
- <Adjacent idea explicitly deferred>

## Requirements

### Functional Requirements

- <Requirement written as observable product behavior>
- <Requirement written as observable product behavior>

### Content and UX Requirements

- <User-facing labels, empty states, error states, or interaction constraints>
- <Accessibility, responsiveness, localization, or support expectations>

### Data and State Requirements

- <Inputs, outputs, persisted state, derived state, or deletion behavior>
- <Privacy, retention, visibility, or audit requirement>

## User Stories

### Story 1: <Outcome>

As a <user or role>, I want <capability or behavior> so that <user-visible outcome>.

Acceptance criteria:

- Given <state>, when <user action>, then <observable result>.
- Given <edge case>, when <user action or system event>, then <expected result>.
- Done when <artifact, UI state, data state, command, metric, or review evidence proves completion>.

### Story 2: <Outcome>

As a <user or role>, I want <capability or behavior> so that <user-visible outcome>.

Acceptance criteria:

- Given <state>, when <user action>, then <observable result>.
- Given <failure, permission, empty, or recovery state>, when <action or event>, then <expected result>.
- Done when <verifiable stopping condition>.

Add more stories only when each one has its own user outcome and agent-verifiable acceptance criteria.

## Implementation Notes

Record constraints that materially affect delivery: known source-of-truth files, systems to integrate with, compatibility expectations, migration constraints, dependencies, or release sequencing. Keep this section brief; create a Plan when implementation sequencing needs to be self-contained.

## Testing Expectations

Name the product behaviors that need proof. Include the level of test expected and what must be observed.

## Risks and Mitigations

- **Risk:** <what could fail or produce user harm>
  **Mitigation:** <how the product or rollout reduces that risk>

## Open Questions

- <Question that blocks scope, design, or acceptance>
- <Question that can be deferred without blocking>

## Related Docs

- <Local path to research, designs, issues, prior decisions, or related docs>
