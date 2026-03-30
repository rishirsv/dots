#!/usr/bin/env bash
# Agent execution backends for autoresearch.
# Functions take a prompt file path plus an optional model name.

DEFAULT_AGENT="claude"

run_claude() {
  local prompt_file="$1"
  local model="${2:-}"
  local args=(claude -p --dangerously-skip-permissions)
  if [ -n "$model" ]; then
    args+=(--model "$model")
  fi
  "${args[@]}" "$(cat "$prompt_file")"
}

run_codex() {
  local prompt_file="$1"
  local model="${2:-}"
  local args=(codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox)
  if [ -n "$model" ]; then
    args+=(--model "$model")
  fi
  "${args[@]}" - < "$prompt_file"
}

run_custom() {
  local prompt_file="$1"
  local cmd="$2"
  if [ -z "$cmd" ]; then
    echo "Error: custom backend requires --custom-cmd" >&2
    return 1
  fi
  if [[ "$cmd" == *"{prompt}"* ]]; then
    eval "${cmd//\{prompt\}/$prompt_file}"
  elif [[ "$cmd" == *" -" ]]; then
    eval "${cmd% -}" < "$prompt_file"
  else
    eval "$cmd" < "$prompt_file"
  fi
}

run_agent() {
  local backend="${1:-$DEFAULT_AGENT}"
  local prompt_file="$2"
  local model="${3:-}"
  local custom_cmd="${4:-}"

  case "$backend" in
    claude) run_claude "$prompt_file" "$model" ;;
    codex)  run_codex "$prompt_file" "$model" ;;
    custom) run_custom "$prompt_file" "$custom_cmd" ;;
    *)
      echo "Error: unsupported backend '$backend'" >&2
      return 1
      ;;
  esac
}

usage() {
  cat <<'EOF'
Usage: agents.sh exec --backend <claude|codex|custom> --prompt-file <path> [--model <name>] [--custom-cmd <command>]

Examples:
  agents.sh exec --backend codex --model gpt-5.4-mini --prompt-file prompt.md
  agents.sh exec --backend claude --model sonnet --prompt-file prompt.md
EOF
}

main() {
  local mode="${1:-}"
  shift || true

  if [ "$mode" != "exec" ]; then
    usage >&2
    return 1
  fi

  local backend="$DEFAULT_AGENT"
  local prompt_file=""
  local model=""
  local custom_cmd=""

  while [ $# -gt 0 ]; do
    case "$1" in
      --backend)
        backend="$2"
        shift 2
        ;;
      --prompt-file)
        prompt_file="$2"
        shift 2
        ;;
      --model)
        model="$2"
        shift 2
        ;;
      --custom-cmd)
        custom_cmd="$2"
        shift 2
        ;;
      --help|-h)
        usage
        return 0
        ;;
      *)
        echo "Error: unknown argument '$1'" >&2
        usage >&2
        return 1
        ;;
    esac
  done

  if [ -z "$prompt_file" ] || [ ! -f "$prompt_file" ]; then
    echo "Error: prompt file not found: $prompt_file" >&2
    return 1
  fi

  run_agent "$backend" "$prompt_file" "$model" "$custom_cmd"
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
