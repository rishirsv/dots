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

## Docs And Local State

- Save agent-created plans, research, reports, audits, screenshots, HTML
  artifacts, and working notes under `.agents/plans/`, `.agents/outputs/`, or
  `.agents/tmp/`; treat them as local/private unless explicitly asked to publish.
- Put reusable, area-specific documentation under `docs/<area>/`.
- Keep each portable skill runtime limited to `SKILL.md` and files the agent may
  need while performing the skill. Do not put authored evals, run history,
  research, or maintainer plans inside that directory.
- Keep skill-owned development material in the skill's hidden
  `.<skill-name>/` companion. Track authored `evals/` there and ignore
  generated `runs/`, `worktrees/`, `tmp/`, and `packages/`.
- `.agents/plugins/marketplace.json` is durable Codex marketplace source, not
  local scratch state.
- Promote only stable public contracts into `README.md`, `INSTALL.md`, owning
  plugin docs, skill references, config docs, or `docs/<area>/`.
- Do not commit secrets. Zsh secrets and machine-local shell overrides belong in
  `~/.zshrc.local`, not `configs/zsh/`.

## Commands

- Sync repo-owned marketplace plugins and installed local plugin caches with
  `scripts/sync-plugins.sh`; run it after commits on `main` and plugin PR merges.
- In this repo, when the user says `commit` or `sync`, publish and propagate the
  scoped work: commit only the scoped files, push the current branch, then run
  every relevant repo sync command. Use `scripts/sync-plugins.sh --all` for
  plugin changes. For config changes, follow the dry-run and scoped sync rule
  below. Never include unrelated working-tree changes.
- Bump the owning `plugin.json` version when a release changes skill behavior.
- Before syncing configs, run `scripts/sync-configs.sh --dry-run --all`; then
  apply scoped syncs such as `--zsh` or `--vscode`.
- Skill creation and mechanical validation belong to the active environment's
  default skill creator. Dots-specific quality guidance lives at
  `plugins/dots/references/skill-practices.md`.

## Validation

- Use focused checks for ordinary changes, including documentation, config, and
  a single skill.
- After editing a skill, review the changed files directly and run relevant
  deterministic tests plus the active environment's default skill validation.
- Never run automated HTML structural validation.
- `scripts/verify.sh --full` is the full repository integration gate. It checks
  plugin and marketplace metadata, validates and smoke-installs marketplace
  plugins, checks Dots-specific skill conventions, runs deterministic HTML
  generation/tests, dry-runs config sync, and runs Dots test suites.
- Run `scripts/verify.sh --full` only when the user explicitly requests it, for
  marketplace or plugin packaging, for cross-plugin/shared integration or
  release-infrastructure changes, or when changing the gate itself.
