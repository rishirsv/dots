#!/bin/bash
# Autopilot skill test suite

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

PASSED=0
FAILED=0

test_pass() {
    echo -e "${GREEN}✓${NC} $1"
    PASSED=$((PASSED + 1))
}

test_fail() {
    echo -e "${RED}✗${NC} $1"
    FAILED=$((FAILED + 1))
}

echo "Running autopilot skill tests..."
echo ""

# Test 1: SKILL.md exists
if [ -f "$SKILL_DIR/SKILL.md" ]; then
    test_pass "SKILL.md exists"
else
    test_fail "SKILL.md exists"
fi

# Test 2: Required templates exist
for template in agents.sh PROMPT_build.md prd.json guardrails.md run.sh; do
    if [ -f "$SKILL_DIR/templates/$template" ]; then
        test_pass "templates/$template exists"
    else
        test_fail "templates/$template exists"
    fi
done

# Test 3: run.sh is executable or can be made executable
if [ -x "$SKILL_DIR/templates/run.sh" ] || chmod +x "$SKILL_DIR/templates/run.sh" 2>/dev/null; then
    test_pass "run.sh is executable"
else
    test_fail "run.sh is executable"
fi

# Test 4: agents.sh sources correctly
if bash -n "$SKILL_DIR/templates/agents.sh" 2>/dev/null; then
    test_pass "agents.sh has valid bash syntax"
else
    test_fail "agents.sh has valid bash syntax"
fi

# Test 5: run.sh has valid bash syntax
if bash -n "$SKILL_DIR/templates/run.sh" 2>/dev/null; then
    test_pass "run.sh has valid bash syntax"
else
    test_fail "run.sh has valid bash syntax"
fi

# Test 6: PRD template is valid (JSON)
if python3 "$SCRIPT_DIR/validate_prd.py" "$SKILL_DIR/templates/prd.json" 2>/dev/null; then
    test_pass "prd.json template is valid"
else
    test_fail "prd.json template is valid"
fi

# Test 7: PROMPT_build.md contains required placeholders
REQUIRED_VARS="PRD_PATH PROGRESS_PATH WORKING_PATH GUARDRAILS_PATH ERRORS_LOG_PATH AGENTS_PATH RUN_ID ITERATION STORY_ID STORY_TITLE"
PROMPT_BUILD="$SKILL_DIR/templates/PROMPT_build.md"
all_vars_present=true
for var in $REQUIRED_VARS; do
    if ! grep -q "{{$var}}" "$PROMPT_BUILD" 2>/dev/null; then
        all_vars_present=false
        break
    fi
done
if [ "$all_vars_present" = true ]; then
    test_pass "PROMPT_build.md has required placeholders"
else
    test_fail "PROMPT_build.md has required placeholders"
fi

# Test 9: run.sh sources agents.sh
if grep -q 'source.*agents.sh' "$SKILL_DIR/templates/run.sh" 2>/dev/null; then
    test_pass "run.sh sources agents.sh"
else
    test_fail "run.sh sources agents.sh"
fi

# Test 10: run.sh has completion signal check
if grep -q '<promise>COMPLETE</promise>' "$SKILL_DIR/templates/run.sh" 2>/dev/null; then
    test_pass "run.sh checks for completion signal"
else
    test_fail "run.sh checks for completion signal"
fi

# Test 11: guardrails.md has Sign format documentation
if grep -q 'Sign' "$SKILL_DIR/templates/guardrails.md" 2>/dev/null; then
    test_pass "guardrails.md documents Sign format"
else
    test_fail "guardrails.md documents Sign format"
fi

# Test 12: Validator script has valid Python syntax
if python3 -m py_compile "$SCRIPT_DIR/validate_prd.py" 2>/dev/null; then
    test_pass "validate_prd.py has valid Python syntax"
else
    test_fail "validate_prd.py has valid Python syntax"
fi

# Test 13: JSON mode updates exact story IDs (1.0 != 11.0)
TMP_DIR=$(mktemp -d)
mkdir -p "$TMP_DIR/.agents/autopilot"
cat > "$TMP_DIR/.agents/autopilot/prd.json" <<'EOF'
{
  "name": "PRD",
  "userStories": [
    {
      "id": "1.0",
      "title": "Story 1.0",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 1,
      "dependsOn": [],
      "passes": false,
      "attempts": 0,
      "blocked": false,
      "blockedReason": "",
      "files": []
    },
    {
      "id": "11.0",
      "title": "Story 11.0",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 2,
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

AUTOPILOT_ROOT="$TMP_DIR" bash "$SKILL_DIR/templates/run.sh" build 1 --dry-run >/dev/null 2>&1 || true

if python3 - <<PY 2>/dev/null
import json
import sys
with open("$TMP_DIR/.agents/autopilot/prd.json", "r") as f:
    data = json.load(f)
stories = {s["id"]: s for s in data.get("userStories", [])}
assert stories["1.0"]["attempts"] == 1, "1.0 attempts should increment"
assert stories["11.0"]["attempts"] == 0, "11.0 attempts should remain unchanged"
print("ok")
PY
then
    test_pass "JSON attempts update exact IDs"
else
    test_fail "JSON attempts update exact IDs"
fi
rm -rf "$TMP_DIR"

# Test 14: JSON validator rejects common invalid states
TMP_FILE=$(mktemp "${TMPDIR:-/tmp}/autopilot-prd.XXXXXX.json")
echo '{ "name": "x", ' > "$TMP_FILE"
if python3 "$SCRIPT_DIR/validate_prd.py" "$TMP_FILE" >/dev/null 2>&1; then
    test_fail "Validator rejects invalid JSON"
else
    test_pass "Validator rejects invalid JSON"
fi
rm -f "$TMP_FILE"

TMP_FILE=$(mktemp "${TMPDIR:-/tmp}/autopilot-prd.XXXXXX.json")
cat > "$TMP_FILE" <<'EOF'
{ "name": "x" }
EOF
if python3 "$SCRIPT_DIR/validate_prd.py" "$TMP_FILE" >/dev/null 2>&1; then
    test_fail "Validator rejects missing userStories"
else
    test_pass "Validator rejects missing userStories"
fi
rm -f "$TMP_FILE"

TMP_FILE=$(mktemp "${TMPDIR:-/tmp}/autopilot-prd.XXXXXX.json")
cat > "$TMP_FILE" <<'EOF'
{
  "name": "x",
  "userStories": [
    {
      "id": "1.0",
      "title": "A",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 1,
      "dependsOn": [],
      "passes": false,
      "attempts": 0,
      "blocked": false,
      "blockedReason": "",
      "files": []
    },
    {
      "id": "1.0",
      "title": "B",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 2,
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
if python3 "$SCRIPT_DIR/validate_prd.py" "$TMP_FILE" >/dev/null 2>&1; then
    test_fail "Validator rejects duplicate story IDs"
else
    test_pass "Validator rejects duplicate story IDs"
fi
rm -f "$TMP_FILE"

# Test 15: JSON preview enforces dependsOn + blocked
TMP_DIR=$(mktemp -d)
mkdir -p "$TMP_DIR/.agents/autopilot"
cat > "$TMP_DIR/.agents/autopilot/prd.json" <<'EOF'
{
  "name": "PRD",
  "userStories": [
    {
      "id": "1.0",
      "title": "Depends on 2.0",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 1,
      "dependsOn": ["2.0"],
      "passes": false,
      "attempts": 0,
      "blocked": false,
      "blockedReason": "",
      "files": []
    },
    {
      "id": "2.0",
      "title": "Runnable",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 2,
      "dependsOn": [],
      "passes": false,
      "attempts": 0,
      "blocked": false,
      "blockedReason": "",
      "files": []
    },
    {
      "id": "3.0",
      "title": "Blocked",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 3,
      "dependsOn": [],
      "passes": false,
      "attempts": 0,
      "blocked": true,
      "blockedReason": "Nope",
      "files": []
    }
  ]
}
EOF

OUTPUT=$(AUTOPILOT_ROOT="$TMP_DIR" bash "$SKILL_DIR/templates/run.sh" build --preview 2>/dev/null || true)
rm -rf "$TMP_DIR"

if echo "$OUTPUT" | grep -q "Next story: 2.0:" && echo "$OUTPUT" | grep -q "WAIT   1.0:" && echo "$OUTPUT" | grep -q "BLOCK  3.0:"; then
    test_pass "JSON preview enforces dependsOn + blocked"
else
    test_fail "JSON preview enforces dependsOn + blocked"
fi

# Test 16: JSON mode exits non-zero when no runnable stories remain
TMP_DIR=$(mktemp -d)
mkdir -p "$TMP_DIR/.agents/autopilot"
cat > "$TMP_DIR/.agents/autopilot/prd.json" <<'EOF'
{
  "name": "PRD",
  "userStories": [
    {
      "id": "1.0",
      "title": "Blocked",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 1,
      "dependsOn": [],
      "passes": false,
      "attempts": 3,
      "blocked": true,
      "blockedReason": "Nope",
      "files": []
    },
    {
      "id": "2.0",
      "title": "Waiting on blocked",
      "description": "",
      "acceptanceCriteria": ["noop"],
      "verificationCommand": "",
      "priority": 2,
      "dependsOn": ["1.0"],
      "passes": false,
      "attempts": 0,
      "blocked": false,
      "blockedReason": "",
      "files": []
    }
  ]
}
EOF

set +e
OUTPUT=$(AUTOPILOT_ROOT="$TMP_DIR" bash "$SKILL_DIR/templates/run.sh" build --preview 2>/dev/null)
EXIT_CODE=$?
set -e
rm -rf "$TMP_DIR"

if [ "$EXIT_CODE" -ne 0 ] && echo "$OUTPUT" | grep -q "No runnable stories remain"; then
    test_pass "JSON no-runnable terminal state is non-zero"
else
    test_fail "JSON no-runnable terminal state is non-zero"
fi

# Test 17: Dry-run prompt includes JSON-rendered story details
TMP_DIR=$(mktemp -d)
mkdir -p "$TMP_DIR/.agents/autopilot"
cat > "$TMP_DIR/.agents/autopilot/prd.json" <<'EOF'
{
  "name": "PRD",
  "userStories": [
    {
      "id": "1.0",
      "title": "Prompt Render",
      "description": "A description",
      "acceptanceCriteria": ["Alpha", "Beta"],
      "verificationCommand": "",
      "priority": 1,
      "dependsOn": [],
      "passes": false,
      "attempts": 0,
      "blocked": false,
      "blockedReason": "",
      "files": ["src/example.ts"]
    }
  ]
}
EOF

AUTOPILOT_ROOT="$TMP_DIR" bash "$SKILL_DIR/templates/run.sh" build 1 --dry-run >/dev/null 2>&1 || true

RUN_LOG=$(ls -1 "$TMP_DIR/.agents/autopilot/runs/"run-*-iter-1-story-*.log 2>/dev/null | head -n 1)
if [ -n "$RUN_LOG" ] && grep -q "### 1.0: Prompt Render" "$RUN_LOG" && grep -q "\\*\\*Acceptance Criteria:\\*\\*" "$RUN_LOG" && grep -q "manual verification required" "$RUN_LOG" && grep -q "src/example.ts" "$RUN_LOG"; then
    test_pass "Dry-run prompt renders story details from JSON"
else
    test_fail "Dry-run prompt renders story details from JSON"
fi
rm -rf "$TMP_DIR"

echo ""
echo "=========================================="
echo -e "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo "=========================================="

if [ "$FAILED" -gt 0 ]; then
    exit 1
fi

exit 0
