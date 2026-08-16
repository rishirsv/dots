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
scripts/sync-configs.sh --status --all
scripts/sync-configs.sh --dry-run --codex --claude --vscode --warp-preview --starship --raycast --zsh --karabiner
scripts/sync-configs.sh --codex --claude --vscode --warp-preview --starship --raycast --zsh --karabiner
```

Apply is the default mode. `--status` compares targets without changing them,
and `--dry-run` previews the backups and writes an apply would perform.

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

scripts/sync-configs.sh --dry-run --warp-preview
scripts/sync-configs.sh --warp-preview

scripts/sync-configs.sh --dry-run --starship
scripts/sync-configs.sh --starship

scripts/sync-configs.sh --dry-run --raycast
scripts/sync-configs.sh --raycast

scripts/sync-configs.sh --dry-run --zsh
scripts/sync-configs.sh --zsh

scripts/sync-configs.sh --dry-run --karabiner
scripts/sync-configs.sh --karabiner
```

### Codex ownership

`~/.codex/config.toml` and `~/.codex-personal/config.toml` are mutable regular
files with mode `0600`. Each contains a marked portable block sourced from
`configs/codex/config.toml`. The sync preserves these machine-local settings
outside that block:

- `approval_policy`, `sandbox_mode`, and `notify`.
- `apps._default`, projects, marketplaces, local MCP servers, model picker
  state, hook state, and shell environment policy.

`mcp_servers.openaiDeveloperDocs` is portable and comes from the tracked block.
The sync replaces stale portable sections instead of retaining duplicate
copies. Codex `AGENTS.md`, `keybindings.json`, and agent definitions remain
symlinks to the repo.

Applying `--codex` or `--codex-personal` backs up an existing config before
migrating a symlink or changing the regular file. To intentionally promote
edits from one live portable block back to the tracked source, run:

```sh
scripts/sync-configs.sh --capture --codex
```

`--capture` does not copy any machine-local content and accepts only `--codex`
or `--codex-personal`.

## Sync Plugins

Register the repo marketplace and install or refresh repo-owned plugins in
Codex, Codex personal, and Claude:

```sh
scripts/sync-plugins.sh
```

## Verify

Use focused checks for the setup or source you changed, then inspect the
worktree:

```sh
git status --short
```

Before committing setup changes:

```sh
git diff --check
```

`scripts/verify.sh --full` is the full repository integration gate. It checks
plugin and marketplace metadata, marketplace packaging/installability,
Meta-Skill and Dots skills and eval suites, the Meta-Skill CLI and workbench,
deterministic HTML generation/tests, config sync dry runs, and Meta-Skill and
Dots test suites. It is not a routine setup check.

Run it only when the user explicitly requests it, for marketplace or plugin
packaging, for cross-plugin/shared integration or release infrastructure, or
when changing the gate itself:

```sh
scripts/verify.sh --full
```
