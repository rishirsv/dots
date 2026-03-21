#!/bin/bash
set -euo pipefail

TARGET_URL="${1:?Usage: $0 <url> [output-dir]}"
OUTPUT_DIR="${2:-.}"

echo "Capturing: $TARGET_URL"
mkdir -p "$OUTPUT_DIR"

agent-browser open "$TARGET_URL"
agent-browser wait --load networkidle

TITLE=$(agent-browser get title)
URL=$(agent-browser get url)
echo "Title: $TITLE"
echo "URL: $URL"

agent-browser screenshot --full "$OUTPUT_DIR/page-full.png"
agent-browser snapshot -i > "$OUTPUT_DIR/page-structure.txt"
agent-browser get text body > "$OUTPUT_DIR/page-text.txt"
agent-browser pdf "$OUTPUT_DIR/page.pdf"

agent-browser close
echo "Capture complete:"
ls -la "$OUTPUT_DIR"
