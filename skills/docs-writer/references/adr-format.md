# ADR Format

Use for durable rationale when a decision is hard to reverse, surprising without context, or trade-off heavy enough that future maintainers should not have to reconstruct it from chat or commits.

## Shape

```md
# <Short Decision Title>

## Decision

<One or two sentences stating the chosen direction.>

## Context

<Why the decision is needed and what constraints matter.>

## Considered Options

- `<option>`: <trade-off>
- `<option>`: <trade-off>

## Consequences

- <expected benefit, cost, constraint, or follow-up>
```

## Rules

- Prefer the repo's existing decision-record convention.
- If no convention exists, use `docs/ADRs/<number>-<slug>.md`.
- Scan existing decision records before choosing the next number.
- Keep the document decision-first and concise.
- Link to affected docs, source files, issues, plans, or specs when useful.
- Skip ADRs for routine, reversible, or obvious choices.
