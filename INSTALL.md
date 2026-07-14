# Install

Bootstrap this source-first plugin and machine-config repo on a local Mac.

## Clone

Use the same checkout path when possible.

```sh
mkdir -p ~/Code
git clone https://github.com/rishirsv/dots.git ~/Code/dots
cd ~/Code/dots
```

For an existing checkout:

```sh
cd ~/Code/dots
git pull --ff-only
```

## What This Repo Owns

- Plugin source under `plugins/`.
- Codex marketplace source at `.agents/plugins/marketplace.json`.
- Claude marketplace source at `.claude-plugin/marketplace.json`.
- Config source under `configs/`.
- Helper scripts under `scripts/`.

This repo does not own secrets, auth state, sessions, caches, generated local
outputs, or app runtime state.

## Sync Configs

Preview and apply only the targets you want. For example:

```sh
scripts/sync-configs.sh --dry-run --codex --claude --vscode --ghostty --cmux --starship --raycast --zsh --launchagents --karabiner
scripts/sync-configs.sh --codex --claude --vscode --ghostty --cmux --starship --raycast --zsh --launchagents --karabiner
```

Apply one target at a time:

```sh
scripts/sync-configs.sh --dry-run --codex
scripts/sync-configs.sh --codex

scripts/sync-configs.sh --dry-run --codex-personal
scripts/sync-configs.sh --codex-personal

scripts/sync-configs.sh --dry-run --claude
scripts/sync-configs.sh --claude

scripts/sync-configs.sh --dry-run --vscode
scripts/sync-configs.sh --vscode

scripts/sync-configs.sh --dry-run --ghostty
scripts/sync-configs.sh --ghostty

scripts/sync-configs.sh --dry-run --cmux
scripts/sync-configs.sh --cmux

scripts/sync-configs.sh --dry-run --starship
scripts/sync-configs.sh --starship

scripts/sync-configs.sh --dry-run --raycast
scripts/sync-configs.sh --raycast

scripts/sync-configs.sh --dry-run --zsh
scripts/sync-configs.sh --zsh

scripts/sync-configs.sh --dry-run --launchagents
scripts/sync-configs.sh --launchagents

scripts/sync-configs.sh --dry-run --karabiner
scripts/sync-configs.sh --karabiner
```

## Sync Plugins

Register the repo marketplace and install or refresh repo-owned plugins in
Codex, Codex personal, and Claude:

```sh
scripts/sync-plugins.sh
```

## Verify

```sh
scripts/verify.sh
git status --short
```

Before committing setup changes:

```sh
git diff --check
```
