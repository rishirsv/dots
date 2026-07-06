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
PYTHONDONTWRITEBYTECODE=1 META_SKILL_CACHE_DIR="$ROOT/dist/.meta-skill-cache" \
  "$ROOT/dist/codex/plugins/meta-skill/scripts/metaskill" doctor --json >/dev/null

echo "==> Meta-Skill validation"
for skill in "${META_SKILLS[@]}"; do
  "$METASKILL" validate "$skill" --json >/dev/null
done

echo "==> Meta-Skill docs gates"
"$METASKILL" docs emit-cli --check >/dev/null
"$METASKILL" docs lint --json >/dev/null

if [[ -f "$META_EVAL_SUITE" ]]; then
  echo "==> Meta-Skill eval suite check"
  "$METASKILL" eval run --check --suite "$META_EVAL_SUITE" --json >/dev/null
else
  echo "==> Meta-Skill eval suite check (skipped: $META_EVAL_SUITE not found)"
fi

echo "==> Dry-run config sync"
scripts/sync-configs.sh --dry-run --codex --codex-personal --claude

echo "==> Meta-Skill tests"
find_verify_python() {
  if [[ -n "${META_SKILL_PYTHON:-}" ]]; then
    printf '%s\n' "$META_SKILL_PYTHON"
    return 0
  fi
  local name candidate
  for name in python3.13 python3.12 python3.11 python3.10 python3; do
    if command -v "$name" >/dev/null 2>&1; then
      candidate=$(command -v "$name")
      if "$candidate" -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)' 2>/dev/null; then
        printf '%s\n' "$candidate"
        return 0
      fi
    fi
  done
  local codex_python="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"
  if [[ -x "$codex_python" ]] && "$codex_python" -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)' 2>/dev/null; then
    printf '%s\n' "$codex_python"
    return 0
  fi
  return 1
}

VERIFY_PYTHON=$(find_verify_python) || {
  echo "error: unittest step requires Python 3.10+; set META_SKILL_PYTHON to a compatible interpreter." >&2
  exit 2
}

"$VERIFY_PYTHON" -m unittest discover -s plugins/meta-skill/tests -p 'test_*.py'

echo "Verify passed"
