# INSTALL.md

Bootstrap this source-first dotfiles and plugin repo on a local machine. This
file is also the runbook to give an agent when moving setup between computers.

## Goal

Use this repo as the master source for:

- Codex config and local agents.
- Claude config.
- VS Code config.
- Ghostty config.
- Zsh config.
- Karabiner-Elements config.
- Source plugins packaged for Codex and Claude.

Generated packages live under ignored `dist/`. Machine caches, auth, sessions,
logs, and secrets stay outside the repo.

## Clone

Use the same checkout path on every Mac when possible, because some app config
can contain absolute paths.

```sh
mkdir -p ~/Code
git clone https://github.com/rishirsv/dots.git ~/Code/dots
cd ~/Code/dots
```

If the repo already exists:

```sh
cd ~/Code/dots
git pull --ff-only
```

## Agent Runbook

When an agent is pointed at this file, do this in order.

### 1. Inspect Repo State

```sh
cd ~/Code/dots
git status --short
find configs -maxdepth 3 -type f | sort
```

Do not overwrite unrelated in-progress repo changes. Edit source files only.

### 2. Inventory System Configs

Compare these system targets to the repo sources:

```text
configs/codex/AGENTS.md              -> ~/.codex/AGENTS.md
configs/codex/config.toml            -> ~/.codex/config.toml
configs/codex/keybindings.json       -> ~/.codex/keybindings.json
configs/codex/agents/                -> ~/.codex/agents/
configs/claude/CLAUDE.md             -> ~/.claude/CLAUDE.md
configs/claude/settings.json         -> ~/.claude/settings.json
configs/vscode/settings.json         -> ~/Library/Application Support/Code/User/settings.json
configs/vscode/keybindings.json      -> ~/Library/Application Support/Code/User/keybindings.json
configs/vscode/extensions.json       -> ~/Library/Application Support/Code/User/extensions.json
configs/ghostty/config               -> ~/.config/ghostty/config
configs/zsh/.zprofile                -> ~/.zprofile
configs/zsh/.zshrc                   -> ~/.zshrc
configs/karabiner/karabiner.json     -> ~/.config/karabiner/karabiner.json
```

Useful comparison commands:

```sh
diff -u configs/codex/config.toml ~/.codex/config.toml || true
diff -u configs/claude/settings.json ~/.claude/settings.json || true
diff -u configs/ghostty/config ~/.config/ghostty/config || true
diff -u configs/zsh/.zshrc ~/.zshrc || true
diff -ru configs/codex/agents ~/.codex/agents || true
```

Also check whether a target file is missing:

```sh
test -f ~/.codex/config.toml && echo "codex config exists"
test -f ~/.claude/settings.json && echo "claude settings exists"
test -d ~/.codex/agents && echo "codex agents exist"
```

### 3. Choose Sync Direction

Use repo to system when this is a new machine or the repo is the intended
master:

```sh
scripts/sync-configs.sh --dry-run --all
scripts/sync-configs.sh --all
```

Use system to repo when the current machine has the desired newer config:

```sh
cp ~/.codex/AGENTS.md configs/codex/AGENTS.md
cp ~/.codex/config.toml configs/codex/config.toml
cp ~/.codex/keybindings.json configs/codex/keybindings.json
rsync -a --delete --exclude '.DS_Store' ~/.codex/agents/ configs/codex/agents/
cp ~/.claude/CLAUDE.md configs/claude/CLAUDE.md
cp ~/.claude/settings.json configs/claude/settings.json
cp "$HOME/Library/Application Support/Code/User/settings.json" configs/vscode/settings.json
cp "$HOME/Library/Application Support/Code/User/keybindings.json" configs/vscode/keybindings.json
cp "$HOME/Library/Application Support/Code/User/extensions.json" configs/vscode/extensions.json
cp ~/.config/ghostty/config configs/ghostty/config
cp ~/.zprofile configs/zsh/.zprofile
cp ~/.zshrc configs/zsh/.zshrc
cp ~/.config/karabiner/karabiner.json configs/karabiner/karabiner.json
```

Karabiner-Elements rewrites `~/.config/karabiner/karabiner.json` whenever you
change settings in its GUI, so copy the system file back to the repo after GUI
edits to keep this source current.

After copying system to repo, inspect the diff before committing:

```sh
git diff -- configs
rg -n --hidden -i '(sk-[A-Za-z0-9_-]{20,}|OPENAI_API_KEY|ANTHROPIC_API_KEY|api[_-]?key|secret|token|password|oauth|refresh_token|access_token|BEGIN [A-Z ]*PRIVATE KEY)' configs
```

Do not commit auth files, session files, app caches, generated packages, local
Claude project settings, or shell secrets. Keep shell secrets and machine-local
overrides in `~/.zshrc.local`.

### 4. Package Plugins

```sh
scripts/package-plugins.sh
```

This rebuilds:

```text
dist/codex/.agents/plugins/marketplace.json
dist/codex/plugins/<plugin>/.codex-plugin/plugin.json
dist/claude/.claude-plugin/marketplace.json
dist/claude/plugins/<plugin>/.claude-plugin/plugin.json
```

### 5. Install Codex Plugins

Register the generated local marketplace:

```sh
codex plugin marketplace list
codex plugin marketplace add ~/Code/dots/dist/codex
```

Install or refresh the local plugins:

```sh
codex plugin add dots@dots
codex plugin add meta-skill@dots
```

### 6. Install Claude Plugins

Register the generated local marketplace:

```sh
claude plugin marketplace add ~/Code/dots/dist/claude
```

Install or refresh the local plugins:

```sh
claude plugin install dots@dots --scope user
claude plugin install meta-skill@dots --scope user
```

### 7. Verify

```sh
scripts/verify.sh
git status --short
```

If the agent copied newer system config back into the repo, commit only the
intended source updates:

```sh
git add configs plugins AGENTS.md README.md INSTALL.md scripts
git diff --staged --check
git commit -m "Refresh machine setup"
```

## Manual Scoped Syncs

Prefer scoped syncs when testing one tool:

```sh
scripts/sync-configs.sh --dry-run --codex
scripts/sync-configs.sh --codex

scripts/sync-configs.sh --dry-run --claude
scripts/sync-configs.sh --claude

scripts/sync-configs.sh --dry-run --vscode
scripts/sync-configs.sh --vscode

scripts/sync-configs.sh --dry-run --ghostty
scripts/sync-configs.sh --ghostty

scripts/sync-configs.sh --dry-run --zsh
scripts/sync-configs.sh --zsh

scripts/sync-configs.sh --dry-run --karabiner
scripts/sync-configs.sh --karabiner
```

The sync script backs up existing targets before replacing them.

## Boundaries

- Edit plugin source under `plugins/`; do not edit generated `dist/` packages.
- Edit config source under `configs/`; do not commit app caches or runtime state.
- Keep generated vendor packages under ignored `dist/`.
- Keep secrets and machine-local shell overrides in `~/.zshrc.local`.
- Keep local Claude settings such as `.claude/settings.local.json` out of Git.
- Run `scripts/verify.sh` before committing setup or plugin changes.
