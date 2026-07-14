# Dots

Source repo for Rishi's personal plugins, agent workflows, and machine config.

## Source

- `plugins/`: maintained plugin source.
- `.agents/plugins/marketplace.json`: Codex marketplace source.
- `.claude-plugin/marketplace.json`: Claude marketplace source.
- `configs/`: source copies for Codex, Claude, Drafts, Cmux, Ghostty, VS Code,
  Starship, Raycast, Zsh, and Karabiner.
- `scripts/`: repo helpers.
- `AGENTS.md`: repo-local agent instructions.

## Commands

```sh
scripts/sync-plugins.sh
scripts/sync-configs.sh --dry-run --all
scripts/verify.sh
```

`scripts/sync-plugins.sh` registers this checkout as the local `dots`
marketplace for Codex and Claude, then refreshes installed repo-owned plugins.

Sync configs with scoped targets:

```sh
scripts/sync-configs.sh --codex
scripts/sync-configs.sh --codex-personal
scripts/sync-configs.sh --drafts-styles
scripts/sync-configs.sh --claude
scripts/sync-configs.sh --vscode
scripts/sync-configs.sh --ghostty
scripts/sync-configs.sh --cmux
scripts/sync-configs.sh --starship
scripts/sync-configs.sh --raycast
scripts/sync-configs.sh --zsh
scripts/sync-configs.sh --launchagents
scripts/sync-configs.sh --karabiner
```

For Meta-Skill changes, also run:

```sh
plugins/meta-skill/scripts/metaskill validate <skill-dir> --json
```

Keep secrets, auth state, sessions, caches, and machine-local shell overrides out
of this repo. Use `~/.zshrc.local` for local shell overrides.
