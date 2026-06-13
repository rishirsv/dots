#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
GLOBAL_INSTRUCTIONS_SOURCE="$ROOT/global_instructions.md"
SOURCE_CODEX_CONFIG="$ROOT/.codex/config.toml"
SOURCE_CODEX_AGENTS="$ROOT/.codex/agents"
SOURCE_CODEX_HOOKS_CONFIG="$ROOT/.codex/hooks.json"
SOURCE_CODEX_HOOKS="$ROOT/.codex/hooks"

CODEX_CONFIG="$HOME/.codex/config.toml"
CODEX_SYSTEM_AGENTS="$HOME/.codex/AGENTS.md"
CODEX_USER_AGENTS="$HOME/.codex/agents"
CODEX_USER_AGENT_MARKER="$CODEX_USER_AGENTS/.agent-managed-agents"
CODEX_USER_HOOKS_CONFIG="$HOME/.codex/hooks.json"
CODEX_USER_HOOKS="$HOME/.codex/hooks"

CLAUDE_SYSTEM_AGENTS="$HOME/.claude/CLAUDE.md"
CLAUDE_USER_AGENTS="$HOME/.claude/agents"
CLAUDE_USER_AGENT_MARKER="$CLAUDE_USER_AGENTS/.agent-managed-agents"

if [[ ! -f "$GLOBAL_INSTRUCTIONS_SOURCE" ]]; then
  echo "Missing global instructions source: $GLOBAL_INSTRUCTIONS_SOURCE" >&2
  exit 1
fi

mkdir -p "$HOME/.codex" "$HOME/.claude" "$CODEX_USER_AGENTS" "$CODEX_USER_HOOKS" "$CLAUDE_USER_AGENTS"

if [[ -f "$SOURCE_CODEX_CONFIG" ]]; then
  if [[ -e "$CODEX_CONFIG" && ! -L "$CODEX_CONFIG" ]]; then
    mv "$CODEX_CONFIG" "$CODEX_CONFIG.bak.$(date +%Y%m%d%H%M%S)"
  fi
  cp "$SOURCE_CODEX_CONFIG" "$CODEX_CONFIG"
fi

cp "$GLOBAL_INSTRUCTIONS_SOURCE" "$CODEX_SYSTEM_AGENTS"

if [[ -f "$SOURCE_CODEX_HOOKS_CONFIG" ]]; then
  if [[ -e "$CODEX_USER_HOOKS_CONFIG" && ! -L "$CODEX_USER_HOOKS_CONFIG" ]]; then
    mv "$CODEX_USER_HOOKS_CONFIG" "$CODEX_USER_HOOKS_CONFIG.bak.$(date +%Y%m%d%H%M%S)"
  fi
  python3 - "$CODEX_USER_HOOKS_CONFIG" <<'PY'
import json
import sys
from pathlib import Path

target = Path(sys.argv[1])
target.write_text(json.dumps({
    "hooks": {
        "PreToolUse": [
            {
                "matcher": "Bash",
                "hooks": [
                    {
                        "type": "command",
                        "command": "if [ -f \"$HOME/.codex/hooks/pre_commit_sync_local_agents.py\" ]; then AGENT_CODEX_HOOK_SCOPE=system /usr/bin/python3 \"$HOME/.codex/hooks/pre_commit_sync_local_agents.py\"; fi",
                        "timeout": 30,
                        "statusMessage": "Checking local agent sync before commit",
                    }
                ],
            }
        ]
    }
}, indent=2) + "\n")
PY
fi

if [[ -d "$SOURCE_CODEX_HOOKS" ]]; then
  mkdir -p "$CODEX_USER_HOOKS"
  for hook_file in "$SOURCE_CODEX_HOOKS"/*(N); do
    [[ -f "$hook_file" ]] || continue
    target_hook="$CODEX_USER_HOOKS/${hook_file:t}"
    if [[ -e "$target_hook" ]]; then
      mv "$target_hook" "$target_hook.bak.$(date +%Y%m%d%H%M%S)"
    fi
    cp "$hook_file" "$target_hook"
    chmod +x "$target_hook"
  done
fi

if [[ -e "$CLAUDE_SYSTEM_AGENTS" && ! -L "$CLAUDE_SYSTEM_AGENTS" ]]; then
  mv "$CLAUDE_SYSTEM_AGENTS" "$CLAUDE_SYSTEM_AGENTS.bak.$(date +%Y%m%d%H%M%S)"
fi
ln -sfn "$GLOBAL_INSTRUCTIONS_SOURCE" "$CLAUDE_SYSTEM_AGENTS"

if [[ -f "$CODEX_USER_AGENT_MARKER" ]]; then
  while IFS= read -r managed_agent; do
    [[ -n "$managed_agent" ]] || continue
    rm -f "$CODEX_USER_AGENTS/$managed_agent"
  done < "$CODEX_USER_AGENT_MARKER"
fi

: > "$CODEX_USER_AGENT_MARKER"
if [[ -d "$SOURCE_CODEX_AGENTS" ]]; then
  for agent_file in "$SOURCE_CODEX_AGENTS"/*.toml(N); do
    target_agent="$CODEX_USER_AGENTS/${agent_file:t}"
    if [[ -e "$target_agent" ]]; then
      mv "$target_agent" "$target_agent.bak.$(date +%Y%m%d%H%M%S)"
    fi
    cp "$agent_file" "$target_agent"
    print -r -- "${agent_file:t}" >> "$CODEX_USER_AGENT_MARKER"
  done
fi

if [[ -f "$CLAUDE_USER_AGENT_MARKER" ]]; then
  while IFS= read -r managed_agent; do
    [[ -n "$managed_agent" ]] || continue
    rm -f "$CLAUDE_USER_AGENTS/$managed_agent"
  done < "$CLAUDE_USER_AGENT_MARKER"
fi

python3 - "$SOURCE_CODEX_AGENTS" "$CLAUDE_USER_AGENTS" > "$CLAUDE_USER_AGENT_MARKER" <<'PY'
import datetime
import re
import sys
from pathlib import Path

source = Path(sys.argv[1])
target = Path(sys.argv[2])
target.mkdir(parents=True, exist_ok=True)


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


managed = []
if source.is_dir():
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
        output_path = target / f"{name}.md"
        if output_path.exists():
            timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            output_path.rename(output_path.with_name(f"{output_path.name}.bak.{timestamp}"))
        output_path.write_text(output)
        managed.append(output_path.name)

for name in managed:
    print(name)
PY

echo "Synced global instructions:"
echo "  $CODEX_SYSTEM_AGENTS"
echo "  $CLAUDE_SYSTEM_AGENTS -> $GLOBAL_INSTRUCTIONS_SOURCE"
echo "Synced Codex config:"
echo "  $CODEX_CONFIG"
echo "Synced Codex custom agents:"
echo "  $CODEX_USER_AGENTS"
echo "Synced Codex system hooks:"
echo "  $CODEX_USER_HOOKS_CONFIG"
echo "  $CODEX_USER_HOOKS"
echo "Synced Claude custom agents:"
echo "  $CLAUDE_USER_AGENTS"
