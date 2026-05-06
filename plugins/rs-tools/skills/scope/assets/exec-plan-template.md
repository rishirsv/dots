# ExecPlan Template

Use When: Use this only when no project-specific template exists and the work involves substantial features, architecture changes, refactors, migrations, or multi-session work where another agent should be able to continue from the plan plus the current working tree. Follow local planning instructions first when they exist. Use project-relative paths for local files.

```md
# <Feature Or Change> ExecPlan

## Purpose

Explain the user-visible outcome and why it matters.

## Phase Outcomes

- Phase 1: <non-technical outcome>
- Phase 2: <non-technical outcome>
- Phase 3: <non-technical outcome>

## Implementation Checklist

- [ ] 1.0 Parent task title
  - [ ] 1.1 Sub-task
  - [ ] 1.2 Sub-task
  - [ ] 1.3 Validation for 1.0: tests, manual checks, or deliverable review

## Validation

List exact checks to run and what success looks like.

## Decision Log

- <Decision>: <why it was made>

## Surprises And Discoveries

- <Finding>: <impact on the plan>

## Completion Notes

- Shipped:
- Remaining:
- Follow-up:
```
