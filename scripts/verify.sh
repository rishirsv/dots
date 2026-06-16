#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"

cd "$ROOT"

echo "==> Package plugins"
scripts/package-plugins.sh

echo "==> Dry-run config sync"
scripts/sync-configs.sh --dry-run --codex --claude

echo "==> Assist package tests"
python3 plugins/meta-skill/tests/test_assist_package.py

echo "==> Markdown link check"
markdown_files=()
while IFS= read -r -d '' file; do
  markdown_files+=("$file")
done < <(
  find . \
    -path './.git' -prune -o \
    -path './dist' -prune -o \
    -type f -name '*.md' -print0
)

if (( ${#markdown_files[@]} )); then
  python3 plugins/dots/skills/harness-engineer/scripts/check_harness_links.py "${markdown_files[@]}"
fi

echo "Verify passed"
