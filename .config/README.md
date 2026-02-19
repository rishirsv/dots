# Portable configs

This folder is meant to be committed to GitHub so you can sync your “main” config between computers.

## What’s included

- `vscode/`: VS Code user settings (`User/settings.json`, `User/keybindings.json`), snippets, and an `extensions.txt` snapshot.
- `codex/`: Codex CLI config (`config.toml`), `prompts/`, and `skills/` (intentionally excludes auth + history/state).
- `ghostty/`: Ghostty config + themes/presets, plus `ghostty/starship.toml`.
- `raycast/`: Raycast export file `Raycast.rayconfig` (plus a copy of each `.rayconfig` found in `~/Downloads` under `raycast/exports/`).

## Apply on a new machine (manual)

- VS Code:
  - Copy `vscode/User/settings.json` and `vscode/User/keybindings.json` into `~/Library/Application Support/Code/User/`
  - Copy `vscode/snippets/` into `~/Library/Application Support/Code/User/snippets/`
  - Install extensions from `vscode/extensions.txt`
- Codex:
  - Copy `codex/config.toml` into `~/.codex/config.toml`
  - Copy `codex/skills/` into `~/.codex/skills/`
  - Copy `codex/prompts/` into `~/.codex/prompts/`
- Ghostty:
  - Copy `ghostty/` into `~/.config/ghostty/`
- Starship:
  - Copy `ghostty/starship.toml` into `~/.config/starship.toml`
- Raycast:
  - Import `raycast/Raycast.rayconfig` via Raycast Preferences → Advanced → Import.

