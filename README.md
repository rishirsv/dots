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

Use focused checks for ordinary documentation, config, and single-skill
changes. `scripts/verify.sh --full` is the full repository integration gate: it
checks plugin and marketplace metadata, marketplace packaging/installability,
Meta-Skill and Dots skills and eval suites, the Meta-Skill CLI and workbench,
deterministic HTML generation/tests, config sync dry runs, and Meta-Skill and
Dots test suites.

Run the full gate only when the user explicitly requests it, for marketplace or
plugin packaging, for cross-plugin/shared integration or release
infrastructure, or when changing the gate itself:

```sh
scripts/verify.sh --full
```

Keep secrets, auth state, sessions, caches, and machine-local shell overrides out
of this repo. Use `~/.zshrc.local` for local shell overrides.
