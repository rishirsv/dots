# AGENTS.md

## Plans

- Store active plans in `docs/exec-plans/active/`; move completed plans to `docs/exec-plans/completed/`.
- Rewrite existing plans instead of creating addendums.

## Perks Repo

In `~/Code/perks`:

- `skills/` and `AGENTS.md` are the source files to edit.
- Do not hand-edit generated plugin skill copies under `plugins/codex/perks/skills/` or `plugins/claude/perks/skills/`.
- If `AGENTS.md` or anything under `skills/` changes, run `scripts/sync-plugins.sh` before committing.
