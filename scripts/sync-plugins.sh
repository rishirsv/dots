#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
MARKETPLACE_NAME="agent"
MARKETPLACE_VERSION="0.1.0"
MARKETPLACE_SOURCE="${AGENT_MARKETPLACE_SOURCE:-rishirsv/agent}"

# Plugins packaged from this repo. Each plugin has its own source folder.
# Per-plugin manifest metadata lives in the Python generator block below, keyed
# by plugin name.
PLUGINS=(agent meta-skill)
typeset -A PLUGIN_SKILLS_SRC
PLUGIN_SKILLS_SRC[agent]="$ROOT/agent/skills"
PLUGIN_SKILLS_SRC[meta-skill]="$ROOT/meta-skill/skills"
typeset -A PLUGIN_ASSETS_SRC
PLUGIN_ASSETS_SRC[agent]="$ROOT/agent/assets"
PLUGIN_ASSETS_SRC[meta-skill]="$ROOT/meta-skill/assets"
typeset -A PLUGIN_REFERENCES_SRC
PLUGIN_REFERENCES_SRC[meta-skill]="$ROOT/meta-skill/references"
typeset -A PLUGIN_ROOT_SRC
PLUGIN_ROOT_SRC[meta-skill]="$ROOT/meta-skill/src"

CODEX_DESKTOP_SKILLS="$HOME/.codex/skills"
CODEX_DESKTOP_SKILL_MARKER="$CODEX_DESKTOP_SKILLS/.agent-managed-skills"
CODEX_MARKETPLACE_DIR="$ROOT/.agents/plugins"
CODEX_MARKETPLACE="$CODEX_MARKETPLACE_DIR/marketplace.json"
CLAUDE_MARKETPLACE="$ROOT/.claude-plugin/marketplace.json"
OPENAI_BUNDLED_MARKETPLACE="$HOME/.codex/.tmp/bundled-marketplaces/openai-bundled"
OPENAI_BUNDLED_PLUGINS=(browser chrome computer-use)

for plugin in "${PLUGINS[@]}"; do
  src="${PLUGIN_SKILLS_SRC[$plugin]:-}"
  if [[ -z "$src" ]]; then
    echo "No skills source configured for plugin: $plugin" >&2
    exit 1
  fi
  if [[ ! -d "$src" ]]; then
    echo "Missing source skills directory for $plugin: $src" >&2
    exit 1
  fi
done

mkdir -p "$ROOT/.agents/plugins" "$ROOT/.claude-plugin"

# --- Package skills into each plugin's Codex and Claude packages ------------
# Skills directories are fully regenerated from source on every run.
for plugin in "${PLUGINS[@]}"; do
  codex_pkg="$ROOT/plugins/codex/$plugin"
  claude_pkg="$ROOT/plugins/claude/$plugin"
  mkdir -p "$codex_pkg/.codex-plugin" "$claude_pkg/.claude-plugin"
  rm -rf "$codex_pkg/skills" "$claude_pkg/skills" "$codex_pkg/references" "$claude_pkg/references" "$codex_pkg/src" "$claude_pkg/src" "$codex_pkg/agents" "$claude_pkg/agents"
  mkdir -p "$codex_pkg/skills" "$claude_pkg/skills"

  src="${PLUGIN_SKILLS_SRC[$plugin]}"
  for skill_dir in "$src"/*(/N); do
    rsync -a --delete --exclude '.DS_Store' "$skill_dir/" "$codex_pkg/skills/${skill_dir:t}/"
    rsync -a --delete --exclude '.DS_Store' "$skill_dir/" "$claude_pkg/skills/${skill_dir:t}/"
  done

  refs="${PLUGIN_REFERENCES_SRC[$plugin]:-}"
  if [[ -n "$refs" && -d "$refs" ]]; then
    rsync -a --delete --exclude '.DS_Store' "$refs/" "$codex_pkg/references/"
    rsync -a --delete --exclude '.DS_Store' "$refs/" "$claude_pkg/references/"
  fi

  root_src="${PLUGIN_ROOT_SRC[$plugin]:-}"
  if [[ -n "$root_src" && -d "$root_src" ]]; then
    rsync -a --delete --exclude '.DS_Store' --exclude '__pycache__' "$root_src/" "$codex_pkg/src/"
    rsync -a --delete --exclude '.DS_Store' --exclude '__pycache__' "$root_src/" "$claude_pkg/src/"
  fi

  assets="${PLUGIN_ASSETS_SRC[$plugin]:-}"
  if [[ -n "$assets" && -d "$assets" ]]; then
    rm -rf "$codex_pkg/assets"
    rsync -a --delete --exclude '.DS_Store' "$assets/" "$codex_pkg/assets/"
  fi
done

# --- Clean up managed direct Codex Desktop skill installs -------------------
mkdir -p "$CODEX_DESKTOP_SKILLS"
if [[ -f "$CODEX_DESKTOP_SKILL_MARKER" ]]; then
  while IFS= read -r managed_skill; do
    [[ -n "$managed_skill" && "$managed_skill" != */* ]] || continue
    rm -rf "$CODEX_DESKTOP_SKILLS/$managed_skill"
  done < "$CODEX_DESKTOP_SKILL_MARKER"
fi
rm -f "$CODEX_DESKTOP_SKILL_MARKER"

# --- Local system + user agent instructions ---------------------------------
"$ROOT/scripts/sync-local-agents.sh"

# --- Which plugins actually carry skills ------------------------------------
# A plugin with no skills is scaffolded on disk but held out of the
# marketplaces and CLI registration: empty plugins fail validation.
REGISTERED_PLUGINS=()
for plugin in "${PLUGINS[@]}"; do
  packaged_skills=("$ROOT/plugins/codex/$plugin/skills"/*(/N))
  if (( ${#packaged_skills[@]} )); then
    REGISTERED_PLUGINS+=("$plugin")
  fi
done

# --- Generate manifests + marketplaces --------------------------------------
ALL_CSV="${(j:,:)PLUGINS}"
REGISTERED_CSV="${(j:,:)REGISTERED_PLUGINS}"
python3 - "$ROOT" "$MARKETPLACE_NAME" "$MARKETPLACE_VERSION" "$ALL_CSV" "$REGISTERED_CSV" <<'PY'
import json
import sys
from pathlib import Path

root = Path(sys.argv[1])
marketplace_name = sys.argv[2]
marketplace_version = sys.argv[3]
all_plugins = [p for p in sys.argv[4].split(",") if p]
registered = [p for p in sys.argv[5].split(",") if p]

AUTHOR = {"name": "Rishi"}
REPOSITORY = "https://github.com/rishirsv/agent"
LICENSE = "UNLICENSED"

# Per-plugin manifest metadata. Keep `agent` byte-identical to its prior output.
PLUGIN_META = {
    "agent": {
        "version": "0.1.0",
        "codex_description": "Rishi's personal agent workflows and reusable skills for Codex.",
        "claude_description": "Rishi's personal agent workflows and reusable skills for Claude.",
        "keywords": ["personal", "workflow"],
        "codex_category": "Productivity",
        "claude_category": "productivity",
        "tags": ["personal", "workflow"],
        "interface": {
            "displayName": "Agent",
            "shortDescription": "Rishi's personal agent workflows.",
            "longDescription": "Agent packages Rishi's reusable coding, review, planning, and workflow skills for Codex.",
            "developerName": "Rishi",
            "category": "Productivity",
            "capabilities": ["Read", "Write"],
            "defaultPrompt": "Use Agent for this workflow.",
            "brandColor": "#006DFF",
            "composerIcon": "./assets/icon.png",
            "logo": "./assets/logo.png",
            "screenshots": [],
        },
    },
    "meta-skill": {
        "version": "0.1.0",
        "codex_description": "Author, improve, and evaluate agent skills (Codex).",
        "claude_description": "Author, improve, and evaluate agent skills (Claude).",
        "keywords": ["skills", "meta", "workflow"],
        "codex_category": "Productivity",
        "claude_category": "productivity",
        "tags": ["skills", "meta", "workflow"],
        "interface": {
            "displayName": "Meta-Skill",
            "shortDescription": "Author, improve, and evaluate agent skills.",
            "longDescription": "Meta-Skill is a full-stop shop for the agent-skill lifecycle: a router front-ending skill-writer, skill-doctor, and skill-evaluator.",
            "developerName": "Rishi",
            "category": "Productivity",
            "capabilities": ["Read", "Write"],
            "defaultPrompt": "Use Meta-Skill to work on an agent skill.",
            "brandColor": "#7C4DFF",
            "composerIcon": "./assets/icon.png",
            "screenshots": [],
        },
    },
}


def codex_manifest(name, meta):
    return {
        "name": name,
        "version": meta["version"],
        "description": meta["codex_description"],
        "author": AUTHOR,
        "repository": REPOSITORY,
        "license": LICENSE,
        "keywords": meta["keywords"],
        "interface": meta["interface"],
    }


def claude_manifest(name, meta):
    return {
        "name": name,
        "version": meta["version"],
        "description": meta["claude_description"],
        "author": AUTHOR,
        "repository": REPOSITORY,
        "license": LICENSE,
        "keywords": meta["keywords"],
    }


def codex_catalog_entry(name, meta):
    return {
        "name": name,
        "source": {"source": "local", "path": f"./plugins/codex/{name}"},
        "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
        "category": meta["codex_category"],
    }


def claude_catalog_entry(name, meta):
    return {
        "name": name,
        "description": meta["claude_description"],
        "source": f"./plugins/claude/{name}",
        "version": meta["version"],
        "category": meta["claude_category"],
        "tags": meta["tags"],
    }


writes = []

# One manifest per plugin (including scaffolded, unregistered ones).
for name in all_plugins:
    meta = PLUGIN_META[name]
    writes.append((root / "plugins" / "codex" / name / ".codex-plugin" / "plugin.json",
                   codex_manifest(name, meta)))
    writes.append((root / "plugins" / "claude" / name / ".claude-plugin" / "plugin.json",
                   claude_manifest(name, meta)))

# Marketplaces list only registered (skill-carrying) plugins.
codex_catalog = {
    "name": marketplace_name,
    "interface": {"displayName": "Agent"},
    "plugins": [codex_catalog_entry(n, PLUGIN_META[n]) for n in registered],
}
claude_catalog = {
    "name": marketplace_name,
    "owner": {"name": "Rishi"},
    "metadata": {
        "version": marketplace_version,
        "description": "Rishi's personal agent plugin marketplace and reusable skills.",
    },
    "plugins": [claude_catalog_entry(n, PLUGIN_META[n]) for n in registered],
}
writes.append((root / ".agents" / "plugins" / "marketplace.json", codex_catalog))
writes.append((root / ".claude-plugin" / "marketplace.json", claude_catalog))

for path, data in writes:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n")
PY

# --- Validate, register, install, cache (registered plugins only) -----------
CODEX_VALIDATOR="/Users/rishi/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py"
CODEX_BIN="${CODEX_BIN:-}"
if [[ -z "$CODEX_BIN" ]]; then
  if command -v codex >/dev/null 2>&1 && codex --version >/dev/null 2>&1; then
    CODEX_BIN="$(command -v codex)"
  elif [[ -x "/Applications/Codex.app/Contents/Resources/codex" ]]; then
    CODEX_BIN="/Applications/Codex.app/Contents/Resources/codex"
  fi
fi

for plugin in "${REGISTERED_PLUGINS[@]}"; do
  if [[ -f "$CODEX_VALIDATOR" ]]; then
    python3 "$CODEX_VALIDATOR" "$ROOT/plugins/codex/$plugin"
  fi
  if command -v claude >/dev/null 2>&1 && claude --version >/dev/null 2>&1; then
    claude plugin validate "$ROOT/plugins/claude/$plugin"
  fi
done

if [[ -n "$CODEX_BIN" ]]; then
  if [[ -d "$OPENAI_BUNDLED_MARKETPLACE" ]]; then
    "$CODEX_BIN" plugin marketplace add "$OPENAI_BUNDLED_MARKETPLACE" >/dev/null
    for plugin in "${OPENAI_BUNDLED_PLUGINS[@]}"; do
      "$CODEX_BIN" plugin add "$plugin@openai-bundled" >/dev/null
    done
  else
    echo "Skipping OpenAI bundled plugin registration; marketplace not found: $OPENAI_BUNDLED_MARKETPLACE" >&2
  fi

  "$CODEX_BIN" plugin marketplace remove "$MARKETPLACE_NAME" >/dev/null 2>&1 || true
  if [[ -d "$MARKETPLACE_SOURCE" ]]; then
    "$CODEX_BIN" plugin marketplace add "$MARKETPLACE_SOURCE"
  else
    "$CODEX_BIN" plugin marketplace add "$MARKETPLACE_SOURCE" --sparse .agents --sparse plugins/codex
  fi
  for plugin in "${REGISTERED_PLUGINS[@]}"; do
    "$CODEX_BIN" plugin remove "$plugin@$MARKETPLACE_NAME" >/dev/null 2>&1 || true
    "$CODEX_BIN" plugin add "$plugin@$MARKETPLACE_NAME"
  done
else
  echo "Skipping Codex plugin CLI registration; codex is not available or not healthy." >&2
fi

if command -v claude >/dev/null 2>&1 && claude --version >/dev/null 2>&1; then
  claude plugin marketplace remove "$MARKETPLACE_NAME" >/dev/null 2>&1 || true
  if [[ -d "$MARKETPLACE_SOURCE" ]]; then
    claude plugin marketplace add "$MARKETPLACE_SOURCE"
  else
    claude plugin marketplace add "$MARKETPLACE_SOURCE" --sparse .claude-plugin plugins/claude
  fi
  for plugin in "${REGISTERED_PLUGINS[@]}"; do
    claude plugin uninstall "$plugin@$MARKETPLACE_NAME" >/dev/null 2>&1 || true
    claude plugin install "$plugin@$MARKETPLACE_NAME" --scope user || claude plugin update "$plugin@$MARKETPLACE_NAME" --scope user
  done
else
  echo "Skipping Claude plugin CLI registration; claude is not available or not healthy." >&2
fi

for plugin in "${REGISTERED_PLUGINS[@]}"; do
  codex_cache="$HOME/.codex/plugins/cache/$MARKETPLACE_NAME/$plugin/$MARKETPLACE_VERSION"
  claude_cache="$HOME/.claude/plugins/cache/$MARKETPLACE_NAME/$plugin/$MARKETPLACE_VERSION"
  rm -rf "$codex_cache" "$claude_cache"
  mkdir -p "$codex_cache" "$claude_cache"
  rsync -a --delete --exclude '.DS_Store' "$ROOT/plugins/codex/$plugin/" "$codex_cache/"
  rsync -a --delete --exclude '.DS_Store' "$ROOT/plugins/claude/$plugin/" "$claude_cache/"
done

AGENT_CODEX_CACHE="$HOME/.codex/plugins/cache/$MARKETPLACE_NAME/agent/$MARKETPLACE_VERSION"
if [[ ! -f "$AGENT_CODEX_CACHE/skills/publish-pr/SKILL.md" ]]; then
  echo "Expected publish-pr in the Agent plugin Codex cache, but it was not found: $AGENT_CODEX_CACHE/skills" >&2
  exit 1
fi

echo "Packaged plugins: ${PLUGINS[*]}"
echo "Registered (skill-carrying) plugins: ${REGISTERED_PLUGINS[*]:-none}"
echo "Ensured OpenAI bundled Codex plugins: ${OPENAI_BUNDLED_PLUGINS[*]}"
echo "Removed managed direct Codex Desktop skill installs, if any:"
echo "  $CODEX_DESKTOP_SKILLS"
scaffold_only=()
for plugin in "${PLUGINS[@]}"; do
  if [[ " ${REGISTERED_PLUGINS[*]} " != *" $plugin "* ]]; then
    scaffold_only+=("$plugin")
  fi
done
if (( ${#scaffold_only[@]} )); then
  echo "Scaffolded but not yet registered (no skills): ${scaffold_only[*]}"
fi
echo "Synced local system and custom agents via scripts/sync-local-agents.sh"
