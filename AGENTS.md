# AGENTS.md

This repo is Rishi's personal Codex plugin marketplace and reusable skill source.

## Layout

- `skills/`: loose skills or drafts.
- `plugins/`: installable Codex plugins.
- `.agents/plugins/marketplace.json`: marketplace catalog.
- `.codex/config.toml`: repo-local Codex config.
- `configs/`: non-secret config snippets.

## Rules

- Add plugins under `plugins/<name>/` with `.codex-plugin/plugin.json`.
- Register new plugins in `.agents/plugins/marketplace.json`.
- Put repo-specific Codex settings in `.codex/config.toml`.
- Update `~/.codex/config.toml` only for intentionally global settings, and ask first.
- Never commit secrets, tokens, or credentials.
