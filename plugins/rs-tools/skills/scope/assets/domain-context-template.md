# Domain Context Template

Use When: Use this only when no project-specific template exists and the conversation resolved terminology, ownership boundaries, structural relationships, or flagged ambiguity that should become canonical. Use for coding and non-coding domains only when language or relationships materially affect future work. Use project-relative paths for local files.

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

## Related Decisions

- <Link or summarize any decision, plan, or artifact this context depends on. Use `None` if not applicable.>

## Recommended Next Step

<The exact next chat, artifact, plan, or implementation move.>
```
