# AGENTS.md

## General

- `~/Code` is a loose monorepo: one GitHub repo containing multiple independent projects. Each project has its own stack, dependencies, and docs (`README.md`, `AGENTS.md`, `ARCHITECTURE.md`). Feature specs live in `docs/<feature-slug>/`.
- Use the `clarify` skill when requirements are ambiguous, assumptions need validation, or you're uncertain about a decision.
- Keep changes scoped to what was requested; avoid adjacent refactors unless asked.

## Git

- The git worktree may be dirty.
- Do not revert changes you didn't make unless explicitly requested (they may be user work or other agents' work).
- If asked to edit or commit and there are unrelated changes (including in files you didn't touch), do not revert, check out, or restore those files.
- If changes are in files you've recently touched, read carefully and work with the context rather than reverting.
- If changes are in unrelated files, ignore them; don't revert, check out, or restore.
- Branch naming: `<project_name>/<description>`
- Commit messages should describe user-visible impact (not implementation details).
- Group related edits into a single commit.

## Plans

- When exiting plan mode, save your plan to the project's docs folder: `<project_name>/docs/<feature-slug>/plan-<feature-slug>.md`. When implementing, confirm the plan exists and save it if it doesn't.
- Provide a non-technical explanation of what each phase of the plan achieves.
- Include a task list and update it as you implement the plan. Example:

  - [ ] 1.0 Parent task title
    - [ ] 1.1 Sub-task 1
    - [ ] 1.2 Sub-task 2
    - [ ] 1.3 Validation for 1.0 (tests, manual checks, or deliverable review)
