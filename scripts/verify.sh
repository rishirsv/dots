#!/usr/bin/env zsh
set -euo pipefail

if [[ $# -ne 1 || "${1-}" != "--full" ]]; then
  echo "Usage: scripts/verify.sh --full"
  echo "This is the full repository integration gate; use focused checks for ordinary changes."
  exit 2
fi

ROOT="${0:A:h:h}"

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
if len(codex_names) != len(set(codex_names)):
    raise SystemExit(f"duplicate Codex marketplace plugin names: {codex_names!r}")
if len(claude_names) != len(set(claude_names)):
    raise SystemExit(f"duplicate Claude marketplace plugin names: {claude_names!r}")

codex_by_name = {plugin["name"]: plugin for plugin in codex_marketplace.get("plugins", [])}
claude_by_name = {plugin["name"]: plugin for plugin in claude_marketplace.get("plugins", [])}

def require_codex_path(name, entry):
    expected_path = f"./plugins/{name}"
    if entry.get("source", {}).get("path") != expected_path:
        raise SystemExit(f"{name} Codex marketplace path must be {expected_path}")

def require_claude_path(name, entry):
    expected_path = f"./plugins/{name}"
    if entry.get("source") != expected_path:
        raise SystemExit(f"{name} Claude marketplace source must be {expected_path}")

for name, entry in codex_by_name.items():
    require_codex_path(name, entry)
    plugin_root = root / "plugins" / name
    source_meta = json.loads((plugin_root / "plugin.json").read_text())
    agent_schema = source_meta.get("$schema") == "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"

    if name in claude_by_name:
        require_claude_path(name, claude_by_name[name])
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
    elif not agent_schema:
        raise SystemExit(f"{name} is Codex-only but does not use Agent Plugins v1 plugin.json")
    elif (plugin_root / ".codex-plugin").exists() or (plugin_root / ".claude-plugin").exists():
        raise SystemExit(f"{name} Agent-standard plugin must not contain Codex/Claude plugin mirrors")

for name, entry in claude_by_name.items():
    if name not in codex_by_name:
        require_claude_path(name, entry)
        plugin_root = root / "plugins" / name
        source_meta = json.loads((plugin_root / "plugin.json").read_text())
        claude_meta = json.loads((plugin_root / ".claude-plugin/plugin.json").read_text())
        for field in ("name", "version", "description", "author", "keywords"):
            if source_meta.get(field) != claude_meta.get(field):
                raise SystemExit(f"{name} metadata drift for {field}")

agent_only_names = [name for name in codex_names if name not in claude_by_name]
if agent_only_names != ["pulse"]:
    raise SystemExit(f"Agent-only marketplace plugins must be exactly ['pulse']: {agent_only_names!r}")
if "x-search" in codex_by_name or "x-search" in claude_by_name:
    raise SystemExit("x-search must be bundled inside pulse, not registered as a standalone plugin")

pulse_root = root / "plugins/pulse"
pulse_skills = sorted(path.name for path in (pulse_root / "skills").iterdir() if path.is_dir())
if pulse_skills != ["pulse"]:
    raise SystemExit(f"pulse must expose exactly one skill named pulse: {pulse_skills!r}")
pulse_mcp = json.loads((pulse_root / "mcp.json").read_text()).get("mcpServers", {})
expected_mcp = {
    "x-search": ["${PLUGIN_ROOT}/server/x-search/server/dist/index.js"],
    "reddit-search": ["${PLUGIN_ROOT}/server/dist/index.cjs"],
}
actual_mcp = {name: server.get("args") for name, server in pulse_mcp.items()}
if actual_mcp != expected_mcp:
    raise SystemExit(f"pulse MCP capabilities must be bundled X and Reddit servers: {actual_mcp!r}")
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

echo "==> Pulse MCP builds and upstream X tests"
npm --prefix plugins/pulse/server ci --ignore-scripts >/dev/null
npm --prefix plugins/pulse/server run typecheck
npm --prefix plugins/pulse/server run build
npm --prefix plugins/pulse/server/x-search/server ci --ignore-scripts >/dev/null
npm --prefix plugins/pulse/server/x-search/server test
npm --prefix plugins/pulse/server/x-search/server run build
scripts/verify-x-search-import.sh

echo "==> Dots-specific skill checks"
python3 plugins/dots/scripts/validate_plugin.py

echo "==> Dots HTML deterministic checks"
node plugins/dots/skills/html/scripts/generate-theme.mjs --check
node --test plugins/dots/skills/html/scripts/*.test.mjs

echo "==> Dry-run config sync"
scripts/sync-configs.sh --dry-run --codex --codex-personal --claude

find_verify_python() {
  if [[ -n "${DOTS_VERIFY_PYTHON:-}" ]]; then
    printf '%s\n' "$DOTS_VERIFY_PYTHON"
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
  echo "error: unittest step requires Python 3.10+; set DOTS_VERIFY_PYTHON to a compatible interpreter." >&2
  exit 2
}

echo "==> Dots tests"
PYTHONDONTWRITEBYTECODE=1 "$VERIFY_PYTHON" -m unittest discover -s plugins/dots/tests -p 'test_*.py'

echo "Verify passed"
