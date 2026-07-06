# Dots

Source repo for Rishi's personal plugins, agent workflows, and machine config.

## Source

- Plugin source lives under `plugins/<plugin-name>/`.
- Config source lives under `configs/<tool>/`.
- Helper entrypoints live under `scripts/`.
- Generated plugin packages live under ignored `dist/`; do not edit generated
  packages or installed plugin/config caches.
- Work-in-progress skills that must not ship in any plugin live under `wip/`.

## Docs And Local State

- Save agent-created plans, research, reports, audits, screenshots, HTML
  artifacts, and working notes under `.agents/plans/`, `.agents/outputs/`, or
  `.agents/tmp/`; treat them as local/private unless explicitly asked to publish.
- Promote only stable public contracts into `README.md`, `INSTALL.md`, owning
  plugin docs, skill references, or config docs. Do not create root `docs/`
  unless explicitly asked.
- Do not commit secrets. Zsh secrets and machine-local shell overrides belong in
  `~/.zshrc.local`, not `configs/zsh/`.

## Commands

- Generate plugin packages only with `scripts/package-plugins.sh`.
- Sync plugin packages and installed local plugin caches with
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
