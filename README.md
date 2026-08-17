# Dots

Source-first repository for Rishi's plugins, agent workflows, and machine
configuration.

## Install

Follow [INSTALL.md](INSTALL.md). It is the single setup and update path for all
repo-owned plugins and configs.

## Source map

- `plugins/`: plugin and skill source.
- `.agents/plugins/marketplace.json`: Codex marketplace source.
- `.claude-plugin/marketplace.json`: Claude marketplace source.
- `configs/`: portable machine configuration.
- `scripts/`: sync and validation entrypoints.
- `AGENTS.md`: repository instructions for agents.

Keep secrets, authentication state, sessions, caches, generated local output,
and machine-local shell overrides outside this repository. Store shell
overrides in `~/.zshrc.local`.
