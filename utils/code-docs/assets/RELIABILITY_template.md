---
name: reliability
description: Reliability policy template for docs/RELIABILITY.md.
---

# RELIABILITY.md

## Purpose
Lean reliability policy for user-critical behavior and release decisions.

## Reliability Baseline
- No invalid post-completion states in critical flows.
- No silent failure for user-critical actions.
- Stable native navigation/back behavior for core surfaces.

## Recommended Reliability Loop
1. Capture before state.
2. Trigger target path.
3. Capture runtime evidence.
4. Apply fix.
5. Rerun validation.
6. Repeat until clean.

## Incident Handling
- Append issue to `ISSUES.md` with severity.
- Track execution in `docs/exec-plans/active/<feature-slug>-plan.md`.
- Move to `docs/exec-plans/completed/<feature-slug>-plan.md` when done.
- Carry unresolved structural follow-ups to `docs/exec-plans/tech-debt-tracker.md`.

## Optional Detail
- Add lightweight SLI/SLO targets when needed.
- Add incident taxonomy when volume justifies it.
