# ADR Format

Use an ADR only when all three are true:

1. The decision is hard to reverse.
2. The decision would be surprising without context.
3. The decision came from a real trade-off.

## Shape

```md
# <Short Decision Title>

<One to three sentences: what changed, what was decided, and why.>
```

Optional sections are allowed only when they add real value:

- `Status`
- `Considered Options`
- `Consequences`

## Rules

- Prefer the repo's existing ADR location and format.
- If no ADR convention exists, `docs/adr/0001-slug.md` is a reasonable default.
- Scan existing ADR numbers before choosing the next number.
- Skip ADRs for reversible, obvious, or no-alternative decisions.
