#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
typeset -A TARGETS

usage() {
  cat <<'EOF'
Usage: scripts/sync-plugins.sh [--all|--codex|--claude]

Refreshes repo-owned plugins and verifies their installed versions. Codex also
syncs ~/.codex-personal when it exists. Defaults to --all.
EOF
}

while (( $# )); do
  case "$1" in
    --all) TARGETS=([codex]=1 [claude]=1) ;;
    --codex) TARGETS[codex]=1 ;;
    --claude) TARGETS[claude]=1 ;;
    -h|--help) usage; exit ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done
(( ${#TARGETS} )) || TARGETS=([codex]=1 [claude]=1)

catalog_specs() {
  python3 - "$ROOT" "$1" "$2" <<'PY'
import json, sys
from pathlib import Path

root, catalog_path, product = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
catalog = json.loads(catalog_path.read_text())
for entry in catalog["plugins"]:
    source_value = entry["source"]
    source_path = source_value["path"] if isinstance(source_value, dict) else source_value
    source = (root / source_path).resolve()
    manifest = source / f".{product}-plugin/plugin.json"
    if not manifest.is_file():
        raise SystemExit(f"Missing {product} plugin manifest for {entry['name']}: {manifest}")
    data = json.loads(manifest.read_text())
    if data.get("name") != entry["name"] or not data.get("version"):
        raise SystemExit(f"Invalid plugin manifest: {manifest}")
    print(f"{entry['name']}\t{data['version']}")
PY
}

CODEX_SPECS=("${(@f)$(catalog_specs "$ROOT/.agents/plugins/marketplace.json" codex)}")
CLAUDE_SPECS=("${(@f)$(catalog_specs "$ROOT/.claude-plugin/marketplace.json" claude)}")

stale_ids() {
  python3 -c '
import json, sys
marketplace, expected = sys.argv[1], {item.split("\t", 1)[0] for item in sys.argv[2:]}
data = json.load(sys.stdin)
plugins = data["installed"] if isinstance(data, dict) else data
for plugin in plugins:
    plugin_id = plugin.get("pluginId", plugin.get("id", ""))
    name, separator, owner = plugin_id.partition("@")
    if separator and owner == marketplace and name not in expected: print(plugin_id)
' "$@"
}

codex_for() {
  local home="$1"
  shift
  if [[ -n "$home" ]]; then
    CODEX_HOME="$home" command codex "$@"
  else
    command codex "$@"
  fi
}

sync_codex_home() {
  local label="$1" home="$2" spec name version installed stale
  [[ -z "$home" || -d "$home" ]] || { echo "Skipping $label: $home does not exist"; return; }

  echo "Syncing $label"
  codex_for "$home" plugin marketplace add "$ROOT" >/dev/null
  for spec in "${CODEX_SPECS[@]}"; do
    IFS=$'\t' read -r name version <<< "$spec"
    codex_for "$home" plugin add "$name@dots" >/dev/null
  done

  installed="$(codex_for "$home" plugin list --json)"
  for stale in "${(@f)$(stale_ids dots "${CODEX_SPECS[@]}" <<< "$installed")}"; do
    [[ -n "$stale" ]] && codex_for "$home" plugin remove "$stale" >/dev/null
  done
  installed="$(codex_for "$home" plugin list --json)"
  python3 -c '
import json, sys
expected = dict(item.split("\t", 1) for item in sys.argv[1:])
installed = {p["pluginId"]: p["version"] for p in json.load(sys.stdin)["installed"]}
errors = ["%s@dots: expected %s, got %s" % (name, version, installed.get(name + "@dots", "not installed")) for name, version in expected.items() if installed.get(name + "@dots") != version]
if errors: raise SystemExit("Codex verification failed:\n  " + "\n  ".join(errors))
' "${CODEX_SPECS[@]}" <<< "$installed"
}

sync_claude() {
  local spec name version plugin_id installed marketplaces marketplace_status stale details
  echo "Syncing Claude"
  node "$ROOT/scripts/generate-claude-agents.mjs" --check >/dev/null
  claude plugin validate "$ROOT/plugins/dots" --strict >/dev/null

  marketplaces="$(claude plugin marketplace list --json)"
  marketplace_status="$(python3 -c '
import json, sys
matches = [entry for entry in json.load(sys.stdin) if entry.get("name") == "dots"]
if not matches:
    print("missing")
elif len(matches) == 1 and matches[0].get("source") == "github" and matches[0].get("repo") == "rishirsv/dots":
    print("present")
else:
    raise SystemExit("Claude marketplace dots does not point to rishirsv/dots")
' <<< "$marketplaces")"
  [[ "$marketplace_status" == "present" ]] || claude plugin marketplace add rishirsv/dots --scope user >/dev/null
  claude plugin marketplace update dots >/dev/null

  installed="$(claude plugin list --json)"
  for spec in "${CLAUDE_SPECS[@]}"; do
    IFS=$'\t' read -r name version <<< "$spec"
    plugin_id="$name@dots"
    if python3 -c 'import json,sys; raise SystemExit(not any(p.get("id") == sys.argv[1] for p in json.load(sys.stdin)))' "$plugin_id" <<< "$installed"; then
      claude plugin update "$plugin_id" --scope user >/dev/null
    else
      claude plugin install "$plugin_id" --scope user >/dev/null
    fi
  done

  installed="$(claude plugin list --json)"
  for stale in "${(@f)$(stale_ids dots "${CLAUDE_SPECS[@]}" <<< "$installed")}"; do
    [[ -n "$stale" ]] && claude plugin uninstall "$stale" --scope user >/dev/null
  done
  installed="$(claude plugin list --json)"
  python3 -c '
import json, sys
expected = dict(item.split("\t", 1) for item in sys.argv[1:])
plugins = {p["id"]: p for p in json.load(sys.stdin)}
errors = ["%s@dots: expected %s, got %s" % (name, version, plugins.get(name + "@dots", {}).get("version", "not installed")) for name, version in expected.items() if plugins.get(name + "@dots", {}).get("version") != version]
if errors: raise SystemExit("Claude verification failed:\n  " + "\n  ".join(errors))
' "${CLAUDE_SPECS[@]}" <<< "$installed"

  for spec in "${CLAUDE_SPECS[@]}"; do
    IFS=$'\t' read -r name version <<< "$spec"
    plugin_id="$name@dots"
    details="$(claude plugin details "$plugin_id")"
    python3 -c '
import re, sys
from pathlib import Path

root = Path(sys.argv[1])
details = sys.stdin.read()
expected = {
    "Skills": sorted(path.parent.name for path in (root / "skills").glob("*/SKILL.md")),
    "Agents": sorted(path.stem for path in (root / "agents").glob("*.md")),
}
errors = []
for kind, names in expected.items():
    match = re.search(rf"^  {kind} \((\d+)\)(?:  (.*))?$", details, re.MULTILINE)
    actual = sorted(filter(None, (match.group(2) if match else "").split(", ")))
    count = int(match.group(1)) if match else -1
    if count != len(names) or actual != names:
        errors.append(f"{kind.lower()}: expected {names}, got {actual}")
if errors:
    raise SystemExit("Claude component verification failed:\n  " + "\n  ".join(errors))
' "$ROOT/plugins/$name" <<< "$details"
  done
  echo "Claude plugin changes require /reload-plugins or a restart in existing sessions."
}

if (( ${+TARGETS[codex]} )); then
  sync_codex_home "default Codex" "${CODEX_HOME:-}"
  sync_codex_home "Codex personal" "$HOME/.codex-personal"
fi
(( ${+TARGETS[claude]} )) && sync_claude
