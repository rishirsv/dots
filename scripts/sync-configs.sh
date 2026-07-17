#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
DRY_RUN=0
TARGETS=()

usage() {
  cat <<'EOF'
Usage: scripts/sync-configs.sh [--dry-run] [--all|--agent-instructions|--codex|--codex-personal|--drafts-styles|--claude|--vscode|--ghostty|--cmux|--starship|--raycast|--zsh|--launchagents|--karabiner ...]

Installs repo-owned config sources from configs/ to this machine.
Existing targets are backed up before they are replaced.
Codex and Claude configs are installed as symlinks back to this repo.

This script does not manage secrets. Keep shell secrets in ~/.zshrc.local.
EOF
}

add_target() {
  local target="$1"
  if [[ "$target" == "all" ]]; then
    TARGETS=(codex codex-personal drafts-styles claude vscode ghostty cmux starship raycast zsh launchagents karabiner)
    return
  fi
  TARGETS+=("$target")
}

while (( $# )); do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      ;;
    --all)
      add_target all
      ;;
    --agent-instructions)
      add_target agent-instructions
      ;;
    --codex)
      add_target codex
      ;;
    --codex-personal)
      add_target codex-personal
      ;;
    --drafts-styles)
      add_target drafts-styles
      ;;
    --claude)
      add_target claude
      ;;
    --vscode)
      add_target vscode
      ;;
    --ghostty)
      add_target ghostty
      ;;
    --cmux)
      add_target cmux
      ;;
    --starship)
      add_target starship
      ;;
    --raycast)
      add_target raycast
      ;;
    --zsh)
      add_target zsh
      ;;
    --launchagents)
      add_target launchagents
      ;;
    --karabiner)
      add_target karabiner
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

if (( ${#TARGETS[@]} == 0 )); then
  usage >&2
  exit 2
fi

timestamp() {
  date +%Y%m%d%H%M%S
}

log() {
  printf '%s\n' "$*"
}

ensure_source() {
  local source="$1"
  if [[ ! -e "$source" ]]; then
    echo "Missing source: $source" >&2
    exit 1
  fi
}

backup_path() {
  local target="$1"
  local backup="${target}.bak.$(timestamp)"
  if (( DRY_RUN )); then
    log "Would back up $target -> $backup"
  else
    cp -pR "$target" "$backup"
    log "Backed up $target -> $backup"
  fi
}

install_file() {
  local source="$1"
  local target="$2"
  ensure_source "$source"

  if [[ -f "$target" ]] && cmp -s "$source" "$target"; then
    log "Unchanged $target"
    return
  fi

  if (( DRY_RUN )); then
    log "Would install file $source -> $target"
    if [[ -e "$target" ]]; then
      backup_path "$target"
    fi
    return
  fi

  mkdir -p "${target:h}"
  if [[ -e "$target" ]]; then
    backup_path "$target"
  fi
  cp -p "$source" "$target"
  log "Installed file $target"
}

install_dir() {
  local source="$1"
  local target="$2"
  ensure_source "$source"

  if (( DRY_RUN )); then
    log "Would sync directory $source/ -> $target/"
    if [[ -e "$target" ]]; then
      backup_path "$target"
    fi
    return
  fi

  mkdir -p "${target:h}"
  if [[ -e "$target" ]]; then
    backup_path "$target"
  fi
  mkdir -p "$target"
  rsync -a --delete --exclude '.DS_Store' "$source/" "$target/"
  log "Synced directory $target"
}

install_symlink() {
  local source="$1"
  local target="$2"
  ensure_source "$source"

  if [[ -L "$target" ]] && [[ "$(readlink "$target")" == "$source" ]]; then
    log "Unchanged symlink $target"
    return
  fi

  if (( DRY_RUN )); then
    log "Would install symlink $target -> $source"
    if [[ -e "$target" || -L "$target" ]]; then
      backup_path "$target"
    fi
    return
  fi

  mkdir -p "${target:h}"
  if [[ -e "$target" || -L "$target" ]]; then
    backup_path "$target"
    rm -rf "$target"
  fi
  ln -s "$source" "$target"
  log "Installed symlink $target -> $source"
}

sync_codex_agents() {
  install_symlink "$ROOT/configs/codex/AGENTS.md" "$HOME/.codex/AGENTS.md"
}

sync_codex_personal_agents() {
  install_symlink "$ROOT/configs/codex/AGENTS.md" "$HOME/.codex-personal/AGENTS.md"
}

sync_claude_agents() {
  install_symlink "$ROOT/configs/agents/AGENTS.md" "$HOME/.claude/CLAUDE.md"
}

sync_agent_instructions() {
  sync_codex_agents
  sync_codex_personal_agents
  sync_claude_agents
}

sync_codex() {
  sync_codex_agents
  install_symlink "$ROOT/configs/codex/config.toml" "$HOME/.codex/config.toml"
  install_symlink "$ROOT/configs/codex/keybindings.json" "$HOME/.codex/keybindings.json"
  install_symlink "$ROOT/configs/codex/agents" "$HOME/.codex/agents"
}

sync_codex_personal() {
  sync_codex_personal_agents
  install_symlink "$ROOT/configs/codex/config.toml" "$HOME/.codex-personal/config.toml"
  install_symlink "$ROOT/configs/codex/keybindings.json" "$HOME/.codex-personal/keybindings.json"
  install_symlink "$ROOT/configs/codex/agents" "$HOME/.codex-personal/agents"
}

sync_drafts_styles() {
  install_dir "$ROOT/configs/drafts/styles" "$HOME/.codex/skill-state/drafts/styles"
  install_dir "$ROOT/configs/drafts/styles" "$HOME/.codex-personal/skill-state/drafts/styles"
}

sync_claude() {
  sync_claude_agents
  install_symlink "$ROOT/configs/claude/settings.json" "$HOME/.claude/settings.json"
  install_symlink "$ROOT/configs/claude/keybindings.json" "$HOME/.claude/keybindings.json"
}

sync_vscode() {
  local user_dir="$HOME/Library/Application Support/Code/User"
  install_file "$ROOT/configs/vscode/settings.json" "$user_dir/settings.json"
  install_file "$ROOT/configs/vscode/keybindings.json" "$user_dir/keybindings.json"
  install_file "$ROOT/configs/vscode/extensions.json" "$user_dir/extensions.json"
}

sync_ghostty() {
  install_file "$ROOT/configs/ghostty/config" "$HOME/.config/ghostty/config"
}

sync_cmux() {
  install_file "$ROOT/configs/cmux/cmux.json" "$HOME/.config/cmux/cmux.json"
}

sync_starship() {
  install_file "$ROOT/configs/starship.toml" "$HOME/.config/starship.toml"
}

sync_raycast() {
  install_file "$ROOT/configs/raycast/preferences.plist" "$HOME/Library/Preferences/com.raycast-x.macos.plist"
}

sync_zsh() {
  install_file "$ROOT/configs/zsh/.zprofile" "$HOME/.zprofile"
  install_file "$ROOT/configs/zsh/.zshrc" "$HOME/.zshrc"
}

sync_launchagents() {
  install_file "$ROOT/configs/cmux/launchagents/com.rishi.cmux.disable-session-restore.plist" "$HOME/Library/LaunchAgents/com.rishi.cmux.disable-session-restore.plist"
}

sync_karabiner() {
  install_file "$ROOT/configs/karabiner/karabiner.json" "$HOME/.config/karabiner/karabiner.json"
}

for target in "${TARGETS[@]}"; do
  case "$target" in
    agent-instructions) sync_agent_instructions ;;
    codex) sync_codex ;;
    codex-personal) sync_codex_personal ;;
    drafts-styles) sync_drafts_styles ;;
    claude) sync_claude ;;
    vscode) sync_vscode ;;
    ghostty) sync_ghostty ;;
    cmux) sync_cmux ;;
    starship) sync_starship ;;
    raycast) sync_raycast ;;
    zsh) sync_zsh ;;
    launchagents) sync_launchagents ;;
    karabiner) sync_karabiner ;;
    *)
      echo "Unknown target: $target" >&2
      exit 2
      ;;
  esac
done
