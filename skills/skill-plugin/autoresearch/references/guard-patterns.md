# Guard Patterns

Guards stop a winning-looking change from breaking something important.

## Good guards

- existing tests still pass
- typecheck still passes
- output schema still validates
- protected reference file remains unchanged
- memory or size does not exceed a hard threshold

## Guard design rules

- Keep guards independent from the primary objective.
- Use the cheapest guard that still catches the regression.
- Prefer mechanical guards over descriptive notes.
- Treat guard failures as a reason to reject the change, not a hint to weaken the guard.

## Common use

Use one or two guards.
Too many guards slow the loop and blur the decision.
