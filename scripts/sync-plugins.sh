#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
TARGETS=()

usage() {
  cat <<'EOF'
Usage: scripts/sync-plugins.sh [--all|--codex|--claude]

Packages repo-owned plugins and refreshes installed local plugin caches.
Defaults to --all.
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

"$ROOT/scripts/package-plugins.sh"

for target in "${TARGETS[@]}"; do
  case "$target" in
    codex)
      codex plugin add dots@dots
      codex plugin add meta-skill@dots
      ;;
    claude)
      claude plugin install dots@dots --scope user
      claude plugin install meta-skill@dots --scope user
      ;;
    *)
      echo "Unknown target: $target" >&2
      exit 2
      ;;
  esac
done
