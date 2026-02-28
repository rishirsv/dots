---
owner: "<team-or-role-or-unassigned>"
status: active
last-reviewed: YYYY-MM-DD
review-cycle-days: 30
source-of-truth: "docs/PLANS.md"
verification-state: unverified
---

# PLANS.md

## Purpose
Defines the execution plan lifecycle and required structure for plan files.

## Canonical Paths
- Product specs: `docs/product-specs/<feature-slug>-spec.md`
- Active plans: `docs/exec-plans/active/<feature-slug>-plan.md`
- Completed plans: `docs/exec-plans/completed/<feature-slug>-plan.md`
- Plan template: `assets/exec-plan_template.md`
- Tech debt tracker: `docs/exec-plans/tech-debt-tracker.md`

## Required Headings For Every Plan File
1. Metadata
2. Description and user impact
3. Scope and non-goals
4. Acceptance criteria
5. Task checklist
6. Verification steps
7. Decision log
8. Risks and rollback

## Definition Of Done
A plan is complete when:
- acceptance criteria are satisfied
- verification is documented
- related docs are updated
- follow-up debt is captured (if any)
