#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
METASKILL="plugins/meta-skill/scripts/metaskill"
META_SKILLS=(
  plugins/meta-skill/skills/meta-skill
  plugins/meta-skill/skills/skill-writer
  plugins/meta-skill/skills/skill-doctor
  plugins/meta-skill/skills/skill-evaluator
  plugins/meta-skill/skills/skill-benchmarker
)
META_EVAL_SUITE="plugins/meta-skill/.meta-skill/evals.json"

cd "$ROOT"

echo "==> Package plugins"
scripts/package-plugins.sh

echo "==> Generated Meta-Skill CLI smoke test"
META_SKILL_CACHE_DIR="$ROOT/dist/.meta-skill-cache" \
  "$ROOT/dist/codex/plugins/meta-skill/scripts/metaskill" doctor --json >/dev/null

echo "==> Meta-Skill validation"
for skill in "${META_SKILLS[@]}"; do
  "$METASKILL" validate "$skill" --json >/dev/null
done

if [[ -f "$META_EVAL_SUITE" ]]; then
  echo "==> Meta-Skill eval suite lint"
  "$METASKILL" eval lint --suite "$META_EVAL_SUITE" --json >/dev/null
else
  echo "==> Meta-Skill eval suite lint (skipped: $META_EVAL_SUITE not found)"
fi

echo "==> Dry-run config sync"
scripts/sync-configs.sh --dry-run --codex --claude

echo "==> Meta-Skill tests"
python3 -m unittest discover -s plugins/meta-skill/tests -p 'test_*.py'

echo "Verify passed"
