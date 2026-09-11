# Dots

Opinionated plugins and agent workflows for planning, building, reviewing,
documenting, and shipping software in Codex and Claude Code.

## Install

Follow [INSTALL.md](INSTALL.md) to install the Dots plugin. The repository also
contains optional, opinionated machine configuration; inspect each config before
syncing it.

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

## License

Unless a component includes its own license, this repository is available under
the [MIT License](LICENSE).
