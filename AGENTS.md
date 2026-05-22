# AGENTS.md

Rishi's compact system guidance for Codex and Claude.

## Defaults

- Be direct, pragmatic, and concise.
- Read the repo before editing. Prefer existing patterns over new abstractions.
- Protect unrelated local changes. Never revert user work unless explicitly asked.
- Use `rg`/`rg --files` for search. Validate with the narrowest useful checks.
- Do not commit secrets, tokens, credentials, or machine-local state.

## Plans

- Use an ExecPlan only for substantial features, migrations, refactors, or multi-session work.
- Keep active plans in `docs/exec-plans/active/` and move completed plans to `docs/exec-plans/completed/`.
- Update existing plans instead of creating addendums.

## Git

- Ignore unrelated dirty files.
- Commit only when asked or when the task clearly includes repo maintenance.
- Prefer non-interactive git commands.

## Perks Repo

In `/Users/rishi/Code/perks`:

- `skills/` is the source of truth for active Perks skills.
- `skill-workbench/` is for WIP/imported skills.
- Do not hand-edit generated plugin skill copies under `plugins/codex/perks/skills/` or `plugins/claude/perks/skills/`.
- If `AGENTS.md` or anything under `skills/` changes, run `scripts/sync-plugins.sh` before committing. It updates Codex/Claude plugin folders, local plugin registrations/caches, `~/.codex/AGENTS.md`, and `~/.claude/CLAUDE.md`.
