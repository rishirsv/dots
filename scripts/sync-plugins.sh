#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
MARKETPLACE_NAME="agent"
MARKETPLACE_VERSION="0.1.0"
MARKETPLACE_SOURCE="${AGENT_MARKETPLACE_SOURCE:-rishirsv/agent}"

# Plugins packaged from this repo. Each plugin has its own source skills
# directory; only `agent` ships Codex/Claude subagents. Per-plugin manifest
# metadata lives in the Python generator block below, keyed by plugin name.
PLUGINS=(agent meta-skill)
typeset -A PLUGIN_SKILLS_SRC
PLUGIN_SKILLS_SRC[agent]="$ROOT/skills"
PLUGIN_SKILLS_SRC[meta-skill]="$ROOT/meta-skill/skills"
typeset -A PLUGIN_REFERENCES_SRC
PLUGIN_REFERENCES_SRC[meta-skill]="$ROOT/meta-skill/references"

# Subagents are an `agent`-only concern today.
SOURCE_CODEX_AGENTS="$ROOT/.codex/agents"
CODEX_AGENT_PLUGIN_AGENTS="$ROOT/plugins/codex/agent/agents"
CLAUDE_AGENT_PLUGIN_AGENTS="$ROOT/plugins/claude/agent/agents"

CODEX_DESKTOP_SKILLS="$HOME/.codex/skills"
CODEX_DESKTOP_SKILL_MARKER="$CODEX_DESKTOP_SKILLS/.agent-managed-skills"
CODEX_MARKETPLACE_DIR="$ROOT/.agents/plugins"
CODEX_MARKETPLACE="$CODEX_MARKETPLACE_DIR/marketplace.json"
CLAUDE_MARKETPLACE="$ROOT/.claude-plugin/marketplace.json"
SYSTEM_AGENTS_SOURCE="$ROOT/AGENTS.md"
CODEX_SYSTEM_AGENTS="$HOME/.codex/AGENTS.md"
CODEX_USER_AGENTS="$HOME/.codex/agents"
CODEX_USER_AGENT_MARKER="$CODEX_USER_AGENTS/.agent-managed-agents"
CLAUDE_SYSTEM_AGENTS="$HOME/.claude/CLAUDE.md"
CLAUDE_USER_AGENTS="$HOME/.claude/agents"
CLAUDE_USER_AGENT_MARKER="$CLAUDE_USER_AGENTS/.agent-managed-agents"

if [[ ! -f "$SYSTEM_AGENTS_SOURCE" ]]; then
  echo "Missing system agents source: $SYSTEM_AGENTS_SOURCE" >&2
  exit 1
fi

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
  rm -rf "$codex_pkg/skills" "$claude_pkg/skills" "$codex_pkg/references" "$claude_pkg/references"
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
done

# --- Clean up the legacy direct Desktop skill installs ----------------------
mkdir -p "$CODEX_DESKTOP_SKILLS"
if [[ -f "$CODEX_DESKTOP_SKILL_MARKER" ]]; then
  while IFS= read -r managed_skill; do
    [[ -n "$managed_skill" && "$managed_skill" != */* ]] || continue
    rm -rf "$CODEX_DESKTOP_SKILLS/$managed_skill"
  done < "$CODEX_DESKTOP_SKILL_MARKER"
fi
rm -f "$CODEX_DESKTOP_SKILL_MARKER"

# --- Subagents (agent plugin only) ------------------------------------------
mkdir -p "$CODEX_AGENT_PLUGIN_AGENTS" "$CLAUDE_AGENT_PLUGIN_AGENTS"
if [[ -d "$SOURCE_CODEX_AGENTS" ]]; then
  rsync -a --delete --exclude '.DS_Store' "$SOURCE_CODEX_AGENTS/" "$CODEX_AGENT_PLUGIN_AGENTS/"
else
  rm -rf "$CODEX_AGENT_PLUGIN_AGENTS"
fi

if [[ -d "$SOURCE_CODEX_AGENTS" ]]; then
  python3 - "$SOURCE_CODEX_AGENTS" "$CLAUDE_AGENT_PLUGIN_AGENTS" <<'PY'
import re
import sys
from pathlib import Path

source = Path(sys.argv[1])
target = Path(sys.argv[2])
target.mkdir(parents=True, exist_ok=True)
for stale in target.glob("*.md"):
    stale.unlink()


def parse_codex_agent(path: Path) -> dict:
    text = path.read_text()
    data = {}

    for key in ["name", "description", "model", "model_reasoning_effort", "sandbox_mode"]:
        match = re.search(rf'^{key}\s*=\s*"([^"]*)"', text, re.MULTILINE)
        if match:
            data[key] = match.group(1)

    instruction_match = re.search(r'developer_instructions\s*=\s*"""(.*?)"""', text, re.DOTALL)
    data["developer_instructions"] = instruction_match.group(1).strip() if instruction_match else ""

    return data


def claude_model(codex_model):
    if codex_model and codex_model.endswith("-mini"):
        return "haiku"
    return "sonnet"


def claude_effort(codex_effort):
    if codex_effort in {"low", "medium", "high", "xhigh", "max"}:
        return codex_effort
    return "medium"


def tools_for(sandbox_mode):
    if sandbox_mode == "read-only":
        return ["Read", "Grep", "Glob", "Bash", "Skill"]
    return ["Read", "Grep", "Glob", "Bash", "Write", "Edit", "MultiEdit", "Skill"]


def yaml_scalar(value):
    text = str(value)
    if not text:
        return '""'
    if re.search(r"[:#\[\]{}&*!|>'\"%@`]", text) or text.strip() != text:
        return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'
    return text


def yaml_frontmatter(data):
    lines = []
    for key, value in data.items():
        if isinstance(value, list):
            lines.append(f"{key}:")
            for item in value:
                lines.append(f"- {yaml_scalar(item)}")
        else:
            lines.append(f"{key}: {yaml_scalar(value)}")
    return "\n".join(lines) + "\n"


for path in sorted(source.glob("*.toml")):
    agent = parse_codex_agent(path)
    name = str(agent.get("name", path.stem))
    frontmatter = {
        "name": name,
        "description": str(agent.get("description", "")),
        "model": claude_model(agent.get("model") if isinstance(agent.get("model"), str) else None),
        "effort": claude_effort(agent.get("model_reasoning_effort") if isinstance(agent.get("model_reasoning_effort"), str) else None),
        "tools": tools_for(agent.get("sandbox_mode") if isinstance(agent.get("sandbox_mode"), str) else None),
    }

    body = str(agent.get("developer_instructions", "")).strip()
    output = "---\n"
    output += yaml_frontmatter(frontmatter)
    output += "---\n\n"
    output += body
    output += "\n"
    (target / f"{name}.md").write_text(output)
PY
else
  rm -rf "$CLAUDE_AGENT_PLUGIN_AGENTS"
fi

# --- System + user agent instructions ---------------------------------------
mkdir -p "$HOME/.codex" "$HOME/.claude" "$CODEX_USER_AGENTS" "$CLAUDE_USER_AGENTS"
cp "$SYSTEM_AGENTS_SOURCE" "$CODEX_SYSTEM_AGENTS"

if [[ -f "$CODEX_USER_AGENT_MARKER" ]]; then
  while IFS= read -r managed_agent; do
    [[ -n "$managed_agent" ]] || continue
    rm -f "$CODEX_USER_AGENTS/$managed_agent"
  done < "$CODEX_USER_AGENT_MARKER"
fi

: > "$CODEX_USER_AGENT_MARKER"
if [[ -d "$SOURCE_CODEX_AGENTS" ]]; then
  for agent_file in "$SOURCE_CODEX_AGENTS"/*.toml(N); do
    cp "$agent_file" "$CODEX_USER_AGENTS/${agent_file:t}"
    print -r -- "${agent_file:t}" >> "$CODEX_USER_AGENT_MARKER"
  done
fi

if [[ -f "$CLAUDE_USER_AGENT_MARKER" ]]; then
  while IFS= read -r managed_agent; do
    [[ -n "$managed_agent" ]] || continue
    rm -f "$CLAUDE_USER_AGENTS/$managed_agent"
  done < "$CLAUDE_USER_AGENT_MARKER"
fi

: > "$CLAUDE_USER_AGENT_MARKER"
if [[ -d "$CLAUDE_AGENT_PLUGIN_AGENTS" ]]; then
  for agent_file in "$CLAUDE_AGENT_PLUGIN_AGENTS"/*.md(N); do
    target_agent="$CLAUDE_USER_AGENTS/${agent_file:t}"
    if [[ -e "$target_agent" ]]; then
      mv "$target_agent" "$target_agent.bak.$(date +%Y%m%d%H%M%S)"
    fi
    cp "$agent_file" "$target_agent"
    print -r -- "${agent_file:t}" >> "$CLAUDE_USER_AGENT_MARKER"
  done
fi

if [[ -e "$CLAUDE_SYSTEM_AGENTS" && ! -L "$CLAUDE_SYSTEM_AGENTS" ]]; then
  mv "$CLAUDE_SYSTEM_AGENTS" "$CLAUDE_SYSTEM_AGENTS.bak.$(date +%Y%m%d%H%M%S)"
fi
ln -sfn "$SYSTEM_AGENTS_SOURCE" "$CLAUDE_SYSTEM_AGENTS"

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
            "brandColor": "#006DFF",
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
for plugin in "${REGISTERED_PLUGINS[@]}"; do
  if [[ -f "$CODEX_VALIDATOR" ]]; then
    python3 "$CODEX_VALIDATOR" "$ROOT/plugins/codex/$plugin"
  fi
  if command -v claude >/dev/null 2>&1; then
    claude plugin validate "$ROOT/plugins/claude/$plugin"
  fi
done

if command -v codex >/dev/null 2>&1; then
  codex plugin marketplace remove "$MARKETPLACE_NAME" >/dev/null 2>&1 || true
  if [[ -d "$MARKETPLACE_SOURCE" ]]; then
    codex plugin marketplace add "$MARKETPLACE_SOURCE"
  else
    codex plugin marketplace add "$MARKETPLACE_SOURCE" --sparse .agents --sparse plugins/codex
  fi
  for plugin in "${REGISTERED_PLUGINS[@]}"; do
    codex plugin remove "$plugin@$MARKETPLACE_NAME" >/dev/null 2>&1 || true
    codex plugin add "$plugin@$MARKETPLACE_NAME"
  done
fi

if command -v claude >/dev/null 2>&1; then
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
if [[ ! -f "$AGENT_CODEX_CACHE/skills/commit/SKILL.md" ]]; then
  echo "Expected agent plugin skills in Codex cache, but none were found: $AGENT_CODEX_CACHE/skills" >&2
  exit 1
fi

echo "Packaged plugins: ${PLUGINS[*]}"
echo "Registered (skill-carrying) plugins: ${REGISTERED_PLUGINS[*]:-none}"
scaffold_only=()
for plugin in "${PLUGINS[@]}"; do
  if [[ " ${REGISTERED_PLUGINS[*]} " != *" $plugin "* ]]; then
    scaffold_only+=("$plugin")
  fi
done
if (( ${#scaffold_only[@]} )); then
  echo "Scaffolded but not yet registered (no skills): ${scaffold_only[*]}"
fi
echo "Synced system agent instructions:"
echo "  $CODEX_SYSTEM_AGENTS"
echo "  $CLAUDE_SYSTEM_AGENTS -> $SYSTEM_AGENTS_SOURCE"
echo "Synced Codex custom agents:"
echo "  $CODEX_USER_AGENTS"
echo "Synced Claude custom agents:"
echo "  $CLAUDE_USER_AGENTS"
