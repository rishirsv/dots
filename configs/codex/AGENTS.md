# AGENTS.md

This is Rishi's system Codex agents file. The source copy is stored in `rs-tools` at `configs/codex/AGENTS.md` and may be synced to `~/.codex/AGENTS.md`.

## Plans

- For substantial features, architecture changes, refactors, migrations, or multi-session work, use an ExecPlan.
- Do not create ExecPlans for small edits, routine maintenance, or work that can be completed clearly in one session.
- If the user requests plan changes, rewrite the existing plan instead of creating addendums.
- Store active plans at `docs/exec-plans/active/<feature-slug>-plan.md`.
- Move completed plans to `docs/exec-plans/completed/<feature-slug>-plan.md`.
- A plan should be restartable: another agent should be able to continue from the plan file plus the current working tree.

Plans must include:

- Purpose: the user-visible outcome and why it matters.
- Phase outcomes: a non-technical explanation of what each phase accomplishes.
- Implementation checklist using this shape:
  - [ ] 1.0 Parent task title
    - [ ] 1.1 Sub-task
    - [ ] 1.2 Sub-task
    - [ ] 1.3 Validation for 1.0: tests, manual checks, or deliverable review
- Validation: exact checks to run and what success looks like.
- Decision log: important decisions and why they were made.
- Surprises/discoveries: unexpected findings that affect the plan.
- Completion notes: what shipped, what remains, and any follow-up work.

When implementing substantial planned work, confirm the plan exists and create or update it if needed. Keep the checklist updated as work progresses.

## Git

- If changes are in unrelated files, ignore them; don't revert, check out, or restore. Do not ask the user about them.
