# AGENTS.md

Ignore uncommitted changes made by other agents working in this repo. Do not
mention them.

## Workflow

- Edit source only.
- Plugin source lives under `plugins/<plugin-name>/`.
- Config source lives under `configs/<tool>/`.
- Generated plugin packages belong under ignored `dist/`.
- Machine installs, caches, auth, sessions, and generated packages are outputs,
  not source.

## Boundaries

- Do not edit installed plugin caches, generated vendor packages, or local
  synced config targets directly.
- Do not commit secrets. Zsh secrets and machine-local shell overrides belong in
  `~/.zshrc.local`, not `configs/zsh/`.
- Do not reintroduce `global_instructions.md`.
- Do not use the removed `scripts/sync-plugins.sh` or
  `scripts/sync-local-agents.sh`.

## Commands

- Generate vendor plugin packages with `scripts/package-plugins.sh`.
- Sync config sources with `scripts/sync-configs.sh --dry-run --all` first.
- Apply scoped config syncs only after reviewing dry-run output, for example
  `scripts/sync-configs.sh --zsh` or `scripts/sync-configs.sh --vscode`.
- Meta-Skill CLI lives inside the plugin:
  `plugins/meta-skill/scripts/metaskill`.

## Validation

- Run the baseline repo verification with `scripts/verify.sh`.
- After editing a skill, review the changed skill files directly.
- Run deterministic tests that exist for the touched skill or helper.
- For Meta-Skill validation, prefer:
  `plugins/meta-skill/scripts/metaskill validate <skill-dir> --json`.
