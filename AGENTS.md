# Dots

Source repo for Dots plugins, agent workflows, and optional machine config.

## Source

- Plugin source lives under `plugins/<plugin-name>/`.
- Codex and Claude marketplace source lives at `.agents/plugins/marketplace.json`
  and `.claude-plugin/marketplace.json`.
- Config source lives under `configs/<tool>/`.
- Helper entrypoints live under `scripts/`.
- Do not edit installed plugin/config caches.
- Work-in-progress skills that must not ship in any plugin live under `wip/`.

## Commands

- Sync repo-owned marketplace plugins and installed local plugin caches with
  `scripts/sync-plugins.sh`; run it after commits on `main` and plugin PR merges.
- In this repo, when the user says `commit` or `sync`, publish and propagate the
  scoped work: commit only the scoped files, push the current branch, then run
  every relevant repo sync command. Use `scripts/sync-plugins.sh --all` for
  plugin changes. For config changes, follow the dry-run and scoped sync rule
  below. Never include unrelated working-tree changes.
- Bump the owning `plugin.json` version only when the release content is final
  and ready to commit. Do not bump versions during iterative editing.
- Before syncing configs, run `scripts/sync-configs.sh --dry-run --all`; then
  apply scoped syncs such as `--zsh` or `--vscode`.
- Skill creation and mechanical validation belong to the active environment's
  default skill creator. Dots-specific quality guidance lives at
  `plugins/dots/references/skill-practices.md`.

## Validation

- After editing a skill, review the changed files directly and run relevant
  deterministic tests plus the active environment's default skill validation.
- `scripts/verify.py --plugins` checks both source plugin packages.
- `scripts/verify.py --full` is the full repository integration gate; use
  Python 3.10+ for either mode.
- Run `scripts/verify.py --full` only when the user explicitly requests it, for
  marketplace or plugin packaging, for cross-plugin/shared integration or
  release-infrastructure changes, or when changing the gate itself.
