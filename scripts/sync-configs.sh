#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
DRY_RUN=0
MODE=apply
STATUS=0
TARGETS=()

usage() {
  cat <<'EOF'
Usage: scripts/sync-configs.sh [--status|--capture] [--dry-run] [--all|--agent-instructions|--codex|--codex-personal|--claude|--vscode|--ghostty|--starship|--zsh ...]

Installs repo-owned config sources from configs/ to this machine.
Existing targets are backed up before they are replaced.
Apply is the default mode. --status makes no changes. --capture writes only
the marked portable block from a live Codex config to the tracked source and
requires --codex or --codex-personal.

Codex config.toml is a regular 0600 file containing a Dots-owned portable
block and machine-local settings. Other Codex-owned files remain symlinks.

This script does not manage secrets. Keep shell secrets in ~/.zshrc.local.
EOF
}

add_target() {
  local target="$1"
  if [[ "$target" == "all" ]]; then
    TARGETS=(codex codex-personal claude vscode ghostty starship zsh)
    return
  fi
  TARGETS+=("$target")
}

while (( $# )); do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      ;;
    --status)
      if [[ "$MODE" != "apply" ]]; then
        echo "--status and --capture are mutually exclusive" >&2
        exit 2
      fi
      MODE=status
      ;;
    --capture)
      if [[ "$MODE" != "apply" ]]; then
        echo "--status and --capture are mutually exclusive" >&2
        exit 2
      fi
      MODE=capture
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
    --claude)
      add_target claude
      ;;
    --vscode)
      add_target vscode
      ;;
    --ghostty)
      add_target ghostty
      ;;
    --starship)
      add_target starship
      ;;
    --zsh)
      add_target zsh
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

if [[ "$MODE" != "apply" ]] && (( DRY_RUN )); then
  echo "--dry-run is only valid in apply mode" >&2
  exit 2
fi

if [[ "$MODE" == "capture" ]]; then
  for target in "${TARGETS[@]}"; do
    if [[ "$target" != "codex" && "$target" != "codex-personal" ]]; then
      echo "--capture only supports --codex and --codex-personal" >&2
      exit 2
    fi
  done
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

  if [[ "$MODE" == "status" ]]; then
    if [[ -f "$target" && ! -L "$target" ]] && cmp -s "$source" "$target"; then
      log "Current $target"
    else
      log "Drift $target"
      STATUS=1
    fi
    return
  fi

  if [[ -f "$target" && ! -L "$target" ]] && cmp -s "$source" "$target"; then
    log "Unchanged $target"
    return
  fi

  if (( DRY_RUN )); then
    log "Would install file $source -> $target"
    if [[ -e "$target" || -L "$target" ]]; then
      backup_path "$target"
    fi
    return
  fi

  mkdir -p "${target:h}"
  if [[ -e "$target" || -L "$target" ]]; then
    backup_path "$target"
  fi
  if [[ -L "$target" ]]; then
    rm "$target"
  fi
  cp -p "$source" "$target"
  log "Installed file $target"
}

install_symlink() {
  local source="$1"
  local target="$2"
  ensure_source "$source"

  if [[ "$MODE" == "status" ]]; then
    if [[ -L "$target" ]] && [[ "$(readlink "$target")" == "$source" ]]; then
      log "Current symlink $target"
    else
      log "Drift symlink $target"
      STATUS=1
    fi
    return
  fi

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
  install_symlink "$ROOT/configs/agents/AGENTS.md" "$HOME/.codex/AGENTS.md"
}

sync_codex_personal_agents() {
  install_symlink "$ROOT/configs/agents/AGENTS.md" "$HOME/.codex-personal/AGENTS.md"
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
  if [[ "$MODE" == "capture" ]]; then
    python3 "$ROOT/scripts/sync-codex-config.py" capture \
      --source "$ROOT/configs/codex/config.toml" \
      --target "$HOME/.codex/config.toml"
    return
  fi
  sync_codex_agents
  local helper_args=("$MODE" --source "$ROOT/configs/codex/config.toml" --target "$HOME/.codex/config.toml")
  if (( DRY_RUN )); then
    helper_args+=(--dry-run)
  fi
  if ! python3 "$ROOT/scripts/sync-codex-config.py" "${helper_args[@]}"; then
    STATUS=1
  fi
  local computer_use_args=("$MODE")
  if (( DRY_RUN )); then
    computer_use_args+=(--dry-run)
  fi
  if ! python3 "$ROOT/scripts/sync-codex-computer-use.py" "${computer_use_args[@]}"; then
    STATUS=1
  fi
  install_symlink "$ROOT/configs/codex/keybindings.json" "$HOME/.codex/keybindings.json"
  install_symlink "$ROOT/plugins/dots/agents" "$HOME/.codex/agents"
}

sync_codex_personal() {
  if [[ "$MODE" == "capture" ]]; then
    python3 "$ROOT/scripts/sync-codex-config.py" capture \
      --source "$ROOT/configs/codex/config.toml" \
      --target "$HOME/.codex-personal/config.toml"
    return
  fi
  sync_codex_personal_agents
  local helper_args=("$MODE" --source "$ROOT/configs/codex/config.toml" --target "$HOME/.codex-personal/config.toml")
  if (( DRY_RUN )); then
    helper_args+=(--dry-run)
  fi
  if ! python3 "$ROOT/scripts/sync-codex-config.py" "${helper_args[@]}"; then
    STATUS=1
  fi
  install_symlink "$ROOT/configs/codex/keybindings.json" "$HOME/.codex-personal/keybindings.json"
  install_symlink "$ROOT/plugins/dots/agents" "$HOME/.codex-personal/agents"
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
}

sync_ghostty() {
  install_file "$ROOT/configs/ghostty/config.ghostty" "$HOME/.config/ghostty/config.ghostty"
}

sync_starship() {
  install_file "$ROOT/configs/starship.toml" "$HOME/.config/starship.toml"
}

sync_zsh() {
  install_file "$ROOT/configs/zsh/.zshrc" "$HOME/.zshrc"
}

for target in "${TARGETS[@]}"; do
  case "$target" in
    agent-instructions) sync_agent_instructions ;;
    codex) sync_codex ;;
    codex-personal) sync_codex_personal ;;
    claude) sync_claude ;;
    vscode) sync_vscode ;;
    ghostty) sync_ghostty ;;
    starship) sync_starship ;;
    zsh) sync_zsh ;;
    *)
      echo "Unknown target: $target" >&2
      exit 2
      ;;
  esac
done

if (( STATUS )); then
  exit "$STATUS"
fi
