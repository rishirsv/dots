#!/usr/bin/env bash
# Agent execution functions for autopilot.
# Adopted from Ralph - https://github.com/anthropics/ralph

DEFAULT_AGENT="codex"

# Agent functions - each takes a prompt file path as argument
run_codex() {
  local prompt_file="$1"
  codex exec --yolo --skip-git-repo-check - < "$prompt_file"
}

run_claude() {
  local prompt_file="$1"
  claude -p --dangerously-skip-permissions "$(cat "$prompt_file")"
}

run_droid() {
  local prompt_file="$1"
  droid exec --skip-permissions-unsafe -f "$prompt_file"
}

# For custom agents - falls back to eval (user provides full command)
run_custom() {
  local prompt_file="$1"
  local cmd="$2"
  if [[ "$cmd" == *"{prompt}"* ]]; then
    eval "${cmd//\{prompt\}/$prompt_file}"
  elif [[ "$cmd" == *" -" ]]; then
    eval "${cmd% -}" < "$prompt_file"
  else
    eval "$cmd" < "$prompt_file"
  fi
}
