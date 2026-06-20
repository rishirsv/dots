#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"

cd "$ROOT"

echo "==> Package plugins"
scripts/package-plugins.sh

echo "==> Generated Meta-Skill CLI smoke test"
META_SKILL_CACHE_DIR="$ROOT/dist/.meta-skill-cache" \
  "$ROOT/dist/codex/plugins/meta-skill/scripts/metaskill" doctor --json >/dev/null

echo "==> Meta-Skill validation"
for skill in \
  plugins/meta-skill/skills/meta-skill \
  plugins/meta-skill/skills/skill-writer \
  plugins/meta-skill/skills/skill-doctor \
  plugins/meta-skill/skills/skill-evaluator \
  plugins/meta-skill/skills/skill-benchmarker
do
  plugins/meta-skill/scripts/metaskill validate "$skill" --json >/dev/null
done

echo "==> Dry-run config sync"
scripts/sync-configs.sh --dry-run --codex --claude

echo "==> Meta-Skill tests"
python3 -m unittest discover -s plugins/meta-skill/tests -p 'test_*.py'

echo "==> Markdown link check"
markdown_files=()
while IFS= read -r -d '' file; do
  markdown_files+=("$file")
done < <(
  find . \
    -path './.git' -prune -o \
    -path './dist' -prune -o \
    -path '*/.*/runs' -prune -o \
    -path '*/.*/workspaces' -prune -o \
    -type f -name '*.md' -print0
)

if (( ${#markdown_files[@]} )); then
  python3 plugins/dots/skills/harness-engineer/scripts/check_harness_links.py "${markdown_files[@]}"
fi

echo "Verify passed"
