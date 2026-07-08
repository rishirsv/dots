#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
TARGETS=()

usage() {
  cat <<'EOF'
Usage: scripts/sync-plugins.sh [--all|--codex|--claude]

Registers the repo-root plugin marketplace and refreshes installed local
plugins. The --codex target also refreshes ~/.codex-personal when that home
exists. Defaults to --all.
EOF
}

add_target() {
  local target="$1"
  if [[ "$target" == "all" ]]; then
    TARGETS=(codex claude)
    return
  fi
  TARGETS+=("$target")
}

while (( $# )); do
  case "$1" in
    --all)
      add_target all
      ;;
    --codex)
      add_target codex
      ;;
    --claude)
      add_target claude
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
  add_target all
fi

CODEX_MARKETPLACE="$ROOT"
CLAUDE_MARKETPLACE="$ROOT"
PLUGIN_NAMES=("${(@f)$(
  python3 - "$ROOT/.agents/plugins/marketplace.json" <<'PY'
import json
import sys
from pathlib import Path

catalog = json.loads(Path(sys.argv[1]).read_text())
for plugin in catalog.get("plugins", []):
    print(plugin["name"])
PY
)}")

sync_codex_home() {
  local label="$1"
  local home="$2"

  if [[ -n "$home" && ! -d "$home" ]]; then
    echo "Skipping $label: $home does not exist"
    return
  fi

  echo "Syncing Codex plugins for $label"
  if [[ -n "$home" ]]; then
    CODEX_HOME="$home" codex plugin marketplace add "$CODEX_MARKETPLACE"
    for plugin in "${PLUGIN_NAMES[@]}"; do
      CODEX_HOME="$home" codex plugin add "$plugin@dots"
    done
  else
    codex plugin marketplace add "$CODEX_MARKETPLACE"
    for plugin in "${PLUGIN_NAMES[@]}"; do
      codex plugin add "$plugin@dots"
    done
  fi
}

claude_plugin_installed() {
  local plugin_id="$1"
  local installed_json
  installed_json="$(claude plugin list --json)"
  python3 -c '
import json
import sys

plugin_id = sys.argv[1]
installed = json.load(sys.stdin)
raise SystemExit(0 if any(plugin.get("id") == plugin_id for plugin in installed) else 1)
' "$plugin_id" <<< "$installed_json"
}

sync_claude_plugins() {
  claude plugin marketplace add "$CLAUDE_MARKETPLACE" --scope user
  for plugin in "${PLUGIN_NAMES[@]}"; do
    local plugin_id="$plugin@dots"
    if claude_plugin_installed "$plugin_id"; then
      claude plugin update "$plugin_id" --scope user
    else
      claude plugin install "$plugin_id" --scope user
    fi
  done
}

for target in "${TARGETS[@]}"; do
  case "$target" in
    codex)
      sync_codex_home "default Codex" ""
      sync_codex_home "Codex personal" "$HOME/.codex-personal"
      ;;
    claude)
      sync_claude_plugins
      ;;
    *)
      echo "Unknown target: $target" >&2
      exit 2
      ;;
  esac
done
