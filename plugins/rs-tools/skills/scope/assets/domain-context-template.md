# Domain Context Template

Use When: Use this only when no project-specific template exists and the conversation resolved terminology, ownership boundaries, structural relationships, or flagged ambiguity that should become canonical. Use for coding and non-coding domains only when language or relationships materially affect future work. Capture every durable term, rejected meaning, ownership boundary, assumption, constraint, validation expectation, and future-agent instruction produced during scoping. Use project-relative paths for local files.

```md
# <Domain Or Context Name>

## Purpose

<One or two sentences describing what this context covers and why the shared language matters.>

## Language

**<Canonical Term>**:
<One-sentence definition of what the term is.>
_Avoid_: <aliases, overloaded words, or rejected meanings>

## Relationships

- <How two terms, teams, artifacts, systems, or concepts relate. Include ownership or cardinality when useful.>

## Example Scenario

<A concrete scenario that shows the terms and relationships in use and clarifies important boundaries.>

## Flagged Ambiguities

- <Ambiguous term or relationship, plus the resolution or current open question.>

## Decisions And Constraints

- <Decision, constraint, assumption, non-goal, or rejected interpretation future work should preserve.>

## Related Decisions

- <Link or summarize any decision, plan, or artifact this context depends on. Use `None` if not applicable.>

## Future-Agent Instructions

- <What future agents must preserve, avoid, check, update, or report when using this domain context.>

## Validation Expectations

- <How to tell whether future work is using this language or relationship correctly.>

## Open Trails

- <Unresolved question, ambiguity, branch, or assumption, or `None`. Say whether each one blocks the next handoff.>

## Planning Closure

<`Scope concluded` or `Scope not concluded`. If concluded, say whether there are no more open trails that would change the next handoff.>

## Recommended Handoff

<The exact next chat, artifact, plan, Codex goal, research handoff, implementation handoff, or decision. If implementation is ready, describe what should be handed to the implementing agent without starting the work.>
```
