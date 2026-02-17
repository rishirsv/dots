---
name: plans
description: Planning lifecycle rules template for docs/PLANS.md.
---

# PLANS.md

## Purpose
Rules and conventions for feature planning lifecycle.

## Canonical Paths
- Product specs: `docs/product-specs/<feature-slug>-spec.md`
- Active execution plans: `docs/exec-plans/active/<feature-slug>-plan.md`
- Completed execution plans: `docs/exec-plans/completed/<feature-slug>-plan.md`
- Tech debt tracker: `docs/exec-plans/tech-debt-tracker.md`

## Naming Rules
- `feature-slug` must be kebab-case.
- Use the same `feature-slug` between spec and plan files.

## Lifecycle Rules
- Spec ideation belongs in `docs/product-specs/<feature-slug>-spec.md`.
- Implementation starts from `docs/exec-plans/active/<feature-slug>-plan.md`.
- Completion is user-determined.
- On completion, move the plan file to `docs/exec-plans/completed/<feature-slug>-plan.md`.

## Minimum Plan Sections
1. Description and user impact
2. Scope and non-goals
3. Constraints and invariants
4. Task checklist
5. Validation approach
6. Risks and rollback notes

## Related Files
- `TODOS.md`
- `ISSUES.md`
- `docs/exec-plans/tech-debt-tracker.md`
