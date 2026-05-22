# AGENTS.md

This repo is Rishi's planning workspace for a future personal Codex and Claude plugin bundle.

## Layout

- `skills/`: loose skills or drafts.
- `plugins/`: installable Codex plugins.
- `.agents/plugins/marketplace.json`: future Codex marketplace catalog, only when a plugin is active.
- `.codex/config.toml`: repo-local Codex config.
- `configs/`: non-secret config snippets.

## Rules

- Add plugins under `plugins/<name>/` with `.codex-plugin/plugin.json` only after the plugin shape is settled.
- Register new plugins in `.agents/plugins/marketplace.json` only when the repo should expose an installable marketplace again.
- Put repo-specific Codex settings in `.codex/config.toml`.
- Update `~/.codex/config.toml` only for intentionally global settings, and ask first.
- Never commit secrets, tokens, or credentials.
