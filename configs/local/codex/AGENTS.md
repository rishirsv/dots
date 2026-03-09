# AGENTS.md

## General

Avoid creating fall-back solutions unless asked.

## Plans

- In Plan mode, if the user requests plan changes, rewrite the original plan; do not create plan addendums.
- After the user accepts a plan, ALWAYS write the accepted plan to a markdown file to the project's docs folder:
- Active plan: `docs/exec-plans/active/<feature-slug>-plan.md`
- Completion move: `docs/exec-plans/active/<feature-slug>-plan.md` -> `docs/exec-plans/completed/<feature-slug>-plan.md`
- Plans should include phase outcomes (non-technical) and an implementation checklist.
  When implementing, confirm the plan exists and save it if it doesn't.
- Provide a non-technical explanation of what each phase of the plan achieves.
- Include a task list and update it as you implement the plan. Example:
  - [ ] 1.0 Parent task title
    - [ ] 1.1 Sub-task 1
    - [ ] 1.2 Sub-task 2
    - [ ] 1.3 Validation for 1.0 (tests, manual checks, or deliverable review)

## Git

- If changes are in unrelated files, ignore them; don't revert, check out, or restore. Do not ask the user about them.
