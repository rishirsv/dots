# Dots

Source repo for Rishi's personal plugins, agent workflows, and machine
configuration.

## Source Map

- Plugin source lives under `plugins/<plugin-name>/`.
- Config source lives under `configs/<tool>/`.
- Repo-owned helper entrypoints live under `scripts/`.
- Generated vendor plugin packages belong under ignored `dist/`.

## Docs And Local State

- Durable repo docs belong in `README.md`, `INSTALL.md`, or the owning
  plugin/config docs.
- Non-durable plans, trackers, and working notes belong under ignored root
  `.plans/`.
- Generated evidence belongs under ignored root `.agents/`.
- Tool-local state such as `.claude/`, `.codex/`, and root `.meta-skill/` is not
  a durable documentation home.
- Skill-owned hidden docs may be durable when they are intentionally tracked;
  Meta-Skill docs live in `plugins/meta-skill/.meta-skill/docs/`.

## Boundaries

- Do not edit installed plugin caches, generated vendor packages, local synced
  config targets, or generated `dist/` contents directly.
- Do not commit secrets. Zsh secrets and machine-local shell overrides belong in
  `~/.zshrc.local`, not `configs/zsh/`.

## Commands

- Generate vendor plugin packages with `scripts/package-plugins.sh`.
- Sync config sources with `scripts/sync-configs.sh --dry-run --all` first.
- Apply scoped config syncs only after reviewing dry-run output, for example
  `scripts/sync-configs.sh --zsh` or `scripts/sync-configs.sh --vscode`.
- Meta-Skill CLI lives at `plugins/meta-skill/scripts/metaskill`.

## Validation

- Run baseline repo verification with `scripts/verify.sh`.
- After editing a skill, review the changed skill files directly.
- Run deterministic tests that exist for the touched skill or helper.
- For Meta-Skill validation, prefer
  `plugins/meta-skill/scripts/metaskill validate <skill-dir> --json`.
**bold text**