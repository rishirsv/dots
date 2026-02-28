#!/bin/bash
# Autopilot Setup - Initialize project for autonomous execution
#
# Usage:
#   ./setup.sh                      # Create empty PRD template (prd.json)
#   ./setup.sh path/to/spec.md      # Copy spec into input.md + create prd.json template
#   ./setup.sh --from-prd prd.json  # Copy existing PRD (prd.json)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${AUTOPILOT_TARGET_DIR:-.agents/autopilot}"

# Template locations
TEMPLATE_DIR="$SCRIPT_DIR/templates"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

usage() {
  echo "Autopilot Setup - Initialize project for autonomous execution"
  echo ""
  echo "Usage: $0 [OPTIONS] [spec.md]"
  echo ""
  echo "Options:"
  echo "  (no args)             Create empty PRD template (prd.json)"
  echo "  spec.md               Copy spec into input.md + create prd.json template"
  echo "  --from-prd <file>     Copy an existing PRD JSON file (prd.json)"
  echo "  --help, -h          Show this help"
  echo ""
  echo "Environment:"
  echo "  AUTOPILOT_TARGET_DIR   Target directory (default: .agents/autopilot)"
  echo ""
  echo "Examples:"
  echo "  $0                            # Empty setup"
  echo "  $0 docs/feature-spec.md       # Spec-aware setup"
  echo "  $0 --from-prd existing.json   # From existing PRD JSON"
  exit 0
}

# Create directory structure
create_structure() {
  echo -e "${CYAN}Creating directory structure...${NC}"

  mkdir -p "$TARGET_DIR"/{runs,artifacts}

  # Copy templates
  # Always refresh run.sh to pick up template fixes.
  cp -f "$TEMPLATE_DIR/run.sh" "$TARGET_DIR/"
  cp "$TEMPLATE_DIR/agents.sh" "$TARGET_DIR/"
  cp "$TEMPLATE_DIR/PROMPT_build.md" "$TARGET_DIR/"
  cp "$TEMPLATE_DIR/guardrails.md" "$TARGET_DIR/"

  chmod +x "$TARGET_DIR/run.sh"

  # Create empty files
  touch "$TARGET_DIR/progress.md"
  touch "$TARGET_DIR/working.md"
  touch "$TARGET_DIR/input.md"
  touch "$TARGET_DIR/errors.log"
  touch "$TARGET_DIR/activity.log"

  echo -e "  ${GREEN}✓${NC} Created $TARGET_DIR/"
}

# Create autonomous AGENTS.md
create_autonomous_agents_md() {
  local repo_agents="./AGENTS.md"
  local target="$TARGET_DIR/AGENTS.md"

  echo -e "${CYAN}Creating autonomous AGENTS.md...${NC}"

  if [ -f "$repo_agents" ]; then
    # Start with repo AGENTS.md
    cat "$repo_agents" > "$target"
    echo "" >> "$target"
    echo -e "  ${GREEN}✓${NC} Copied repo AGENTS.md"
  else
    # Create minimal header
    cat > "$target" <<'EOF'
# Repository Guidelines

Follow project conventions for build, test, and development commands.
EOF
    echo -e "  ${YELLOW}!${NC} No repo AGENTS.md found, created minimal version"
  fi

  # Append autonomous rules
  if [ -f "$TEMPLATE_DIR/AGENTS-autonomous.md" ]; then
    cat "$TEMPLATE_DIR/AGENTS-autonomous.md" >> "$target"
  else
    # Inline autonomous rules if template doesn't exist
    cat >> "$target" <<'EOF'

---
# Autonomous Mode Rules (Autopilot)

## Commit Policy
- Commit after each completed story (no approval needed)
- Format: `{story-id}: {summary}`
- Do NOT amend previous commits
- Commits stay local until reviewed

## Autonomy
- Do NOT ask user questions - proceed with defaults
- Do NOT modify files outside your story scope
- Ignore uncommitted changes from other work
- If cannot complete a criterion, mark story as blocked

## Quality Gates
- The story's verification command MUST pass (or the story must explicitly require manual verification)
- Tests listed in acceptance criteria MUST pass

## Update AGENTS.md Files
Before committing, check if edited files have learnings worth preserving:
- API patterns or conventions specific to that module
- Gotchas or non-obvious requirements
- Dependencies between files
- Testing approaches for that area

Only add genuinely reusable knowledge. Do NOT add:
- Story-specific implementation details
- Temporary debugging notes
- Information already in progress.md

## Stop Condition
When ALL stories pass (every `userStories[].passes=true`), output:

<promise>COMPLETE</promise>

## Blocked Story Protocol
If a story cannot be completed:
1. Log the reason in errors.log
2. Update story status:
   - JSON PRD: set `blocked=true` and `blockedReason`
3. Update blocked reason:
   - JSON PRD: set `blockedReason`
4. Move to the next story (do NOT retry indefinitely)
EOF
  fi

  echo -e "  ${GREEN}✓${NC} Added autonomous mode rules"
}

# Create PRD from plan or empty template
create_prd() {
  local source_file="$1"
  local prd_json_file="$TARGET_DIR/prd.json"

  echo -e "${CYAN}Creating PRD...${NC}"

  if [ -n "$source_file" ] && [ -f "$source_file" ]; then
    if [[ "$source_file" == *.json ]]; then
      cp "$source_file" "$prd_json_file"
      echo -e "  ${GREEN}✓${NC} Copied PRD JSON from $source_file"
      return
    fi

    # Treat as a spec/plan input file: copy to input.md for reference, and create a PRD JSON template.
    cp "$source_file" "$TARGET_DIR/input.md"
    echo -e "  ${GREEN}✓${NC} Copied input from $source_file → $TARGET_DIR/input.md"

    if [ -f "$TEMPLATE_DIR/prd.json" ]; then
      cp "$TEMPLATE_DIR/prd.json" "$prd_json_file"
    else
      cat > "$prd_json_file" <<'EOF'
{
  "name": "Autopilot PRD",
  "userStories": [
    {
      "id": "1.0",
      "title": "[Story Title]",
      "description": "[Optional description]",
      "acceptanceCriteria": [
        "[Criterion 1]"
      ],
      "verificationCommand": "",
      "priority": 1,
      "dependsOn": [],
      "passes": false,
      "attempts": 0,
      "blocked": false,
      "blockedReason": "",
      "files": []
    }
  ]
}
EOF
    fi

    echo ""
    echo -e "${YELLOW}Note:${NC} Convert your input into PRD stories (prd.json) before running build mode."
  else
    if [ -f "$TEMPLATE_DIR/prd.json" ]; then
      cp "$TEMPLATE_DIR/prd.json" "$prd_json_file"
      echo -e "  ${GREEN}✓${NC} Created PRD template at $prd_json_file"
    else
      echo -e "${RED}Error:${NC} Missing template: $TEMPLATE_DIR/prd.json"
      exit 1
    fi
  fi
}

# Main
case "$1" in
  --from-prd)
    [ -z "$2" ] && { echo -e "${RED}Error: --from-prd requires a file path${NC}"; exit 1; }
    [ ! -f "$2" ] && { echo -e "${RED}Error: File not found: $2${NC}"; exit 1; }
    if [[ "$2" != *.json ]]; then
      echo -e "${RED}Error:${NC} --from-prd only supports PRD JSON files (.json)"
      exit 1
    fi
    create_structure
    create_autonomous_agents_md
    cp "$2" "$TARGET_DIR/prd.json"
    echo -e "  ${GREEN}✓${NC} Copied PRD JSON from $2"
    ;;
  --help|-h)
    usage
    ;;
  *)
    create_structure
    create_autonomous_agents_md
    create_prd "$1"
    ;;
esac

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "Directory: $TARGET_DIR/"
echo ""
echo "Next steps:"
echo "  1. Edit $TARGET_DIR/prd.json with your stories"
echo "  2. Run: ./$TARGET_DIR/run.sh build"
echo ""
