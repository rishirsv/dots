# Dots

Source repo for Rishi's personal plugins, agent workflows, and machine config.

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
- `.agents/plugins/marketplace.json` is durable Codex marketplace source, not
  local scratch state.
- Promote only stable public contracts into `README.md`, `INSTALL.md`, owning
  plugin docs, skill references, or config docs. Do not create root `docs/`
  unless explicitly asked.
- Do not commit secrets. Zsh secrets and machine-local shell overrides belong in
  `~/.zshrc.local`, not `configs/zsh/`.

## Commands

- Sync repo-owned marketplace plugins and installed local plugin caches with
  `scripts/sync-plugins.sh`; run it after commits on `main` and plugin PR merges.
- Bump the owning `plugin.json` version when a release changes skill behavior.
- Before syncing configs, run `scripts/sync-configs.sh --dry-run --all`; then
  apply scoped syncs such as `--zsh` or `--vscode`.
- Meta-Skill CLI lives at `plugins/meta-skill/scripts/metaskill`.

## Validation

- Run baseline repo verification with `scripts/verify.sh`.
- After editing a skill, review the changed files directly and run relevant
  deterministic tests.
- For Meta-Skill validation, prefer
  `plugins/meta-skill/scripts/metaskill validate <skill-dir> --json`.
