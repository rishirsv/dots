# Context Template

Use When: Use this only when no project-specific template exists and durable shared understanding needs to persist across sessions, agents, or later planning. This is the general-purpose context template for coding and knowledge work. Write for a reader who was not in the conversation. Capture every durable decision, constraint, assumption, term, non-goal, validation expectation, artifact-routing choice, and future-agent instruction produced during scoping. Use project-relative paths for local files.

```md
# <Context Title>

## Purpose

<Why this context exists and what future work it should guide.>

## Chosen Direction

<The direction to carry forward. If no direction is chosen, state the remaining live options.>

## What We Resolved

- <Choice, tradeoff, term, boundary, or constraint resolved during the conversation.>

## Decisions And Rationale

- <Decision made>: <why it was made and what alternative was rejected, if useful.>

## In Scope

- <What belongs in the next step.>

## Out Of Scope

- <What should stay out for now.>

## Constraints And Accepted Defaults

- <Constraint, preference, standard, or assumption future work may rely on.>

## Future-Agent Instructions

- <What a future agent must preserve, avoid, check, update, or report.>

## Validation Expectations

- <How the next agent, reviewer, user, or stakeholder should know the work is done.>

## Remaining Risk

- <Main uncertainty, cost, or failure mode still worth watching.>

## Open Questions

- <Unresolved question, or `None`. Say whether each open question blocks action.>

## Recommended Next Step

<The exact next chat, artifact, plan, or implementation move.>
```
