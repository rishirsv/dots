#!/bin/bash
set -euo pipefail

FORM_URL="${1:?Usage: $0 <form-url>}"
echo "Form automation: $FORM_URL"

agent-browser open "$FORM_URL"
agent-browser wait --load networkidle
echo
echo "Form structure:"
agent-browser snapshot -i
echo
echo "Customize refs (@e1, @e2, etc.) based on the snapshot output."
agent-browser get url
agent-browser screenshot /tmp/form-result.png
echo "Screenshot saved: /tmp/form-result.png"
agent-browser close
