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

echo "==> Plugin metadata consistency"
python3 - <<'PY'
import json
from pathlib import Path

root = Path(".")
codex_marketplace = json.loads((root / ".agents/plugins/marketplace.json").read_text())
claude_marketplace = json.loads((root / ".claude-plugin/marketplace.json").read_text())
codex_names = [plugin["name"] for plugin in codex_marketplace.get("plugins", [])]
claude_names = [plugin["name"] for plugin in claude_marketplace.get("plugins", [])]
if codex_names != claude_names:
    raise SystemExit(f"marketplace plugin order mismatch: codex={codex_names!r} claude={claude_names!r}")

for name in codex_names:
    plugin_root = root / "plugins" / name
    source_meta = json.loads((plugin_root / "plugin.json").read_text())
    codex_meta = json.loads((plugin_root / ".codex-plugin/plugin.json").read_text())
    claude_meta = json.loads((plugin_root / ".claude-plugin/plugin.json").read_text())
    for field in ("name", "version", "description", "author", "keywords"):
        values = {
            "plugin.json": source_meta.get(field),
            ".codex-plugin/plugin.json": codex_meta.get(field),
            ".claude-plugin/plugin.json": claude_meta.get(field),
        }
        if len({json.dumps(value, sort_keys=True) for value in values.values()}) != 1:
            raise SystemExit(f"{name} metadata drift for {field}: {values!r}")

    expected_path = f"./plugins/{name}"
    codex_entry = next(plugin for plugin in codex_marketplace["plugins"] if plugin["name"] == name)
    claude_entry = next(plugin for plugin in claude_marketplace["plugins"] if plugin["name"] == name)
    if codex_entry.get("source", {}).get("path") != expected_path:
        raise SystemExit(f"{name} Codex marketplace path must be {expected_path}")
    if claude_entry.get("source") != expected_path:
        raise SystemExit(f"{name} Claude marketplace source must be {expected_path}")
PY

echo "==> Claude marketplace validation"
claude plugin validate . >/dev/null

echo "==> Codex marketplace smoke test"
CODEX_VERIFY_HOME="$(mktemp -d /tmp/dots-codex-verify.XXXXXX)"
cleanup_codex_verify_home() {
  rm -rf "$CODEX_VERIFY_HOME"
}
trap cleanup_codex_verify_home EXIT
CODEX_HOME="$CODEX_VERIFY_HOME" codex plugin marketplace add "$ROOT" >/dev/null
PLUGIN_NAMES=("${(@f)$(
  python3 - "$ROOT/.agents/plugins/marketplace.json" <<'PY'
import json
import sys
from pathlib import Path

catalog = json.loads(Path(sys.argv[1]).read_text())
for plugin in catalog.get("plugins", []):
    print(plugin["name"])
PY
)}")
for plugin in "${PLUGIN_NAMES[@]}"; do
  CODEX_HOME="$CODEX_VERIFY_HOME" codex plugin add "$plugin@dots" >/dev/null
done

echo "==> Meta-Skill CLI smoke test"
mkdir -p "$ROOT/.agents/tmp"
PYTHONDONTWRITEBYTECODE=1 META_SKILL_CACHE_DIR="$ROOT/.agents/tmp/meta-skill-cache" \
  "$ROOT/plugins/meta-skill/scripts/metaskill" doctor --json >/dev/null

echo "==> Meta-Skill validation"
for skill in "${META_SKILLS[@]}"; do
  "$METASKILL" validate "$skill" --json >/dev/null
done

echo "==> Dots skill validation"
python3 plugins/dots/scripts/validate_plugin.py
for skill in plugins/dots/skills/*(/); do
  [[ -f "$skill/SKILL.md" ]] || continue
  "$METASKILL" validate "$skill" --json >/dev/null
done

echo "==> Dots eval suite checks"
while IFS= read -r suite; do
  "$METASKILL" eval run --check --suite "$suite" --json >/dev/null
done < <(find plugins/dots/skills -path '*/.*/*evals.json' -print | sort)

echo "==> Dots HTML deterministic checks"
node plugins/dots/skills/html/scripts/generate-theme.mjs --check
node --test plugins/dots/skills/html/scripts/chart.test.mjs

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

PYTHONDONTWRITEBYTECODE=1 "$VERIFY_PYTHON" -m unittest discover -s plugins/meta-skill/tests -p 'test_*.py'

echo "==> Dots runtime safety tests"
PYTHONDONTWRITEBYTECODE=1 "$VERIFY_PYTHON" -m unittest discover -s plugins/dots/tests -p 'test_*.py'

echo "==> Dots plugin tests"
"$VERIFY_PYTHON" -m unittest discover -s plugins/dots/tests -p 'test_*.py'

echo "Verify passed"
