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
- Config source under `configs/`.
- Helper scripts under `scripts/`.
- Generated plugin packages under ignored `dist/`.

This repo does not own secrets, auth state, sessions, caches, generated local
outputs, or app runtime state.

## Sync Configs

Preview and apply only the targets you want. For example:

```sh
scripts/sync-configs.sh --dry-run --codex --claude --vscode --ghostty --cmux --zsh --launchagents --karabiner
scripts/sync-configs.sh --codex --claude --vscode --ghostty --cmux --zsh --launchagents --karabiner
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

scripts/sync-configs.sh --dry-run --zsh
scripts/sync-configs.sh --zsh

scripts/sync-configs.sh --dry-run --launchagents
scripts/sync-configs.sh --launchagents

scripts/sync-configs.sh --dry-run --karabiner
scripts/sync-configs.sh --karabiner
```

The sync script backs up existing targets before replacing them. Keep shell
secrets and machine-local overrides in `~/.zshrc.local`, not in this repo.

## Package Plugins

Regenerate vendor plugin packages:

```sh
scripts/package-plugins.sh
```

This rebuilds local marketplaces and generated plugin packages under `dist/`.
Do not edit `dist/` directly.

## Install Codex Plugins

Register the generated local marketplace:

```sh
codex plugin marketplace list
codex plugin marketplace add ~/Code/dots/dist/codex
```

Install or refresh local plugins:

```sh
codex plugin add dots@dots
codex plugin add meta-skill@dots
```

## Install Claude Plugins

Register the generated local marketplace:

```sh
claude plugin marketplace add ~/Code/dots/dist/claude
```

Install or refresh local plugins:

```sh
claude plugin install dots@dots --scope user
claude plugin install meta-skill@dots --scope user
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
