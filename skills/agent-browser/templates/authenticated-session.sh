#!/bin/bash
set -euo pipefail

LOGIN_URL="${1:?Usage: $0 <login-url> [state-file]}"
STATE_FILE="${2:-./auth-state.json}"

echo "Authentication workflow: $LOGIN_URL"

if [[ -f "$STATE_FILE" ]]; then
  echo "Loading saved state from $STATE_FILE..."
  if agent-browser --state "$STATE_FILE" open "$LOGIN_URL" 2>/dev/null; then
    agent-browser wait --load networkidle
    CURRENT_URL=$(agent-browser get url)
    if [[ "$CURRENT_URL" != *"login"* ]] && [[ "$CURRENT_URL" != *"signin"* ]]; then
      echo "Session restored successfully"
      agent-browser snapshot -i
      exit 0
    fi
    echo "Session expired, performing fresh login..."
    agent-browser close 2>/dev/null || true
  fi
  rm -f "$STATE_FILE"
fi

echo "Open the login page and use snapshot -i to discover refs."
agent-browser open "$LOGIN_URL"
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser close
