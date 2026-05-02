---
name: rs-tools
description: Use when working inside the rs-tools repo, adding personal Codex plugins, or explaining how the local plugin marketplace is organized.
---

# RS Tools

This repo is a personal Codex plugin marketplace.

## Conventions

- Keep loose skill drafts in the repo-level `skills/` folder.
- Package installable workflows under `plugins/<plugin-name>/`.
- Each Codex plugin must include `.codex-plugin/plugin.json`.
- Bundled plugin skills live under `plugins/<plugin-name>/skills/<skill-name>/SKILL.md`.
- The repo marketplace lives at `.agents/plugins/marketplace.json` and points at plugin folders with `./`-prefixed paths relative to the repo root.

## When Updating A Plugin

Update the plugin source in `plugins/<plugin-name>/`, then restart Codex or refresh/reinstall the plugin so Codex reloads the local plugin cache.
