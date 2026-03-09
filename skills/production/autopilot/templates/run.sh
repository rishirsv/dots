#!/bin/bash
# Autopilot - Iterative single-story loop
# Adopted from Ralph's pattern
#
# Usage:
#   ./run.sh                    # default 30 iterations
#   ./run.sh build              # same as ./run.sh (kept for compatibility)
#   ./run.sh 10                 # max 10 iterations
#   ./run.sh --no-commit        # warn if agent leaves uncommitted changes
#   ./run.sh --preview          # show next story + skip reasons, exit

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Prefer the root from the script location (project/.agents/autopilot), fall back to git root.
ROOT_DIR="${AUTOPILOT_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
if [ ! -d "$ROOT_DIR/.agents/autopilot" ]; then
  ROOT_DIR="${AUTOPILOT_ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
fi

# Load agent functions
source "$SCRIPT_DIR/agents.sh"

# Select agent (env override or default)
AGENT="${AUTOPILOT_AGENT:-$DEFAULT_AGENT}"
CUSTOM_CMD=""
if [[ "$AGENT" != "codex" && "$AGENT" != "claude" && "$AGENT" != "droid" ]]; then
  CUSTOM_CMD="$AGENT"
  AGENT="custom"
fi

# Paths (state in .agents/autopilot/)
PRD_PATH="${AUTOPILOT_PRD_JSON:-$ROOT_DIR/.agents/autopilot/prd.json}"
PROGRESS="${AUTOPILOT_PROGRESS:-$ROOT_DIR/.agents/autopilot/progress.md}"
WORKING="${AUTOPILOT_WORKING:-$ROOT_DIR/.agents/autopilot/working.md}"
GUARDRAILS="${AUTOPILOT_GUARDRAILS:-$ROOT_DIR/.agents/autopilot/guardrails.md}"
ERRORS_LOG="${AUTOPILOT_ERRORS_LOG:-$ROOT_DIR/.agents/autopilot/errors.log}"
ACTIVITY_LOG="${AUTOPILOT_ACTIVITY:-$ROOT_DIR/.agents/autopilot/activity.log}"
RUNS_DIR="${AUTOPILOT_RUNS_DIR:-$ROOT_DIR/.agents/autopilot/runs}"
AGENTS_MD="${AUTOPILOT_AGENTS_MD:-$ROOT_DIR/.agents/autopilot/AGENTS.md}"
LOCK_FILE="${AUTOPILOT_LOCK:-$ROOT_DIR/.agents/autopilot/.lock}"

# Defaults
DEFAULT_MAX_ITERS=30
MAX_ITERS="$DEFAULT_MAX_ITERS"
NO_COMMIT=false
DRY_RUN="${AUTOPILOT_DRY_RUN:-false}"
PREVIEW=false
MAX_ATTEMPTS_PER_STORY="${AUTOPILOT_MAX_ATTEMPTS:-3}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Parse arguments
while [ $# -gt 0 ]; do
  case "$1" in
    build)
      shift
      ;;
    plan)
      echo -e "${RED}Error: plan mode has been removed (Autopilot runs from prd.json only)${NC}"
      exit 1
      ;;
    --no-commit)
      NO_COMMIT=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --preview)
      PREVIEW=true
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERS="$1"
      else
        echo -e "${RED}Unknown arg: $1${NC}"
        exit 1
      fi
      shift
      ;;
  esac
done

# Prompt template
PROMPT_TEMPLATE="$SCRIPT_DIR/PROMPT_build.md"

# Git helpers
git_head() {
  git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || echo ""
}

git_commit_list() {
  local before="$1" after="$2"
  if [ -n "$before" ] && [ -n "$after" ] && [ "$before" != "$after" ]; then
    git -C "$ROOT_DIR" log --oneline "$before..$after" 2>/dev/null | sed 's/^/- /' || echo ""
  fi
}

git_changed_files() {
  local before="$1" after="$2"
  if [ -n "$before" ] && [ -n "$after" ] && [ "$before" != "$after" ]; then
    git -C "$ROOT_DIR" diff --name-only "$before" "$after" 2>/dev/null | sed 's/^/- /' || echo ""
  fi
}

git_dirty_files() {
  git -C "$ROOT_DIR" status --porcelain 2>/dev/null | awk '{print "- " $2}' || echo ""
}

# Logging
log_activity() {
  local message="$1"
  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] $message" >> "$ACTIVITY_LOG"
}

log_error() {
  local message="$1"
  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] $message" >> "$ERRORS_LOG"
}

# Write run metadata
write_run_meta() {
  local path="$1" mode="$2" iter="$3" run_id="$4"
  local story_id="$5" story_title="$6"
  local started="$7" ended="$8" duration="$9"
  local status="${10}" log_file="${11}"
  local head_before="${12}" head_after="${13}"
  local commit_list="${14}" changed_files="${15}" dirty_files="${16}"

  mkdir -p "$(dirname "$path")"

  cat > "$path" <<EOF
# Autopilot Run Summary

- Run ID: $run_id
- Iteration: $iter
- Mode: $mode
$([ -n "$story_id" ] && echo "- Story: $story_id: $story_title")
- Started: $started
- Ended: $ended
- Duration: ${duration}s
- Status: $status
- Log: $log_file

## Git

- HEAD (before): ${head_before:-unknown}
- HEAD (after): ${head_after:-unknown}

### Commits
${commit_list:-"- (none)"}

### Changed Files
${changed_files:-"- (none)"}

### Uncommitted Changes
${dirty_files:-"- (clean)"}
EOF
}

escape_sed_replacement() {
  printf '%s' "$1" | sed -e 's/[\\/&|]/\\&/g'
}

validate_prd_json() {
  local prd="$1"
  python3 - "$prd" <<'PY'
import json
import sys

path = sys.argv[1]

def fail(message: str) -> None:
    print(message, file=sys.stderr)
    sys.exit(1)

try:
    with open(path, "r") as f:
        data = json.load(f)
except FileNotFoundError:
    fail(f"Error: PRD JSON not found: {path}")
except json.JSONDecodeError as e:
    fail(f"Error: Invalid PRD JSON: {e.msg} (line {e.lineno} column {e.colno})")
except Exception as e:
    fail(f"Error: Failed to read PRD JSON: {e}")

errors: list[str] = []
if not isinstance(data, dict):
    errors.append("Top-level JSON must be an object")
else:
    name = data.get("name")
    if not isinstance(name, str) or not name.strip():
        errors.append("Missing or invalid top-level 'name' (must be a non-empty string)")

    stories = data.get("userStories")
    if not isinstance(stories, list):
        errors.append("Missing or invalid 'userStories' (must be a list)")
    else:
        ids: set[str] = set()
        for index, story in enumerate(stories):
            label = f"userStories[{index}]"
            if not isinstance(story, dict):
                errors.append(f"{label} must be an object")
                continue

            story_id = story.get("id")
            if not isinstance(story_id, str) or not story_id.strip():
                errors.append(f"{label}.id is required and must be a non-empty string")
                continue

            if story_id in ids:
                errors.append(f"Duplicate story id '{story_id}'")
            ids.add(story_id)

            title = story.get("title")
            if not isinstance(title, str) or not title.strip():
                errors.append(f"{label}.title is required and must be a non-empty string")

            acceptance_criteria = story.get("acceptanceCriteria")
            if not isinstance(acceptance_criteria, list) or not all(isinstance(c, str) and c.strip() for c in acceptance_criteria):
                errors.append(f"{label}.acceptanceCriteria is required and must be a list of non-empty strings")

            verification_command = story.get("verificationCommand")
            if not isinstance(verification_command, str):
                errors.append(f"{label}.verificationCommand is required and must be a string (can be empty)")

            priority = story.get("priority")
            if not isinstance(priority, (int, float)):
                errors.append(f"{label}.priority is required and must be a number")

            passes = story.get("passes")
            if not isinstance(passes, bool):
                errors.append(f"{label}.passes is required and must be a boolean")

            attempts = story.get("attempts")
            if not isinstance(attempts, int) or attempts < 0:
                errors.append(f"{label}.attempts is required and must be an integer >= 0")

            blocked = story.get("blocked")
            if not isinstance(blocked, bool):
                errors.append(f"{label}.blocked is required and must be a boolean")

            blocked_reason = story.get("blockedReason")
            if not isinstance(blocked_reason, str):
                errors.append(f"{label}.blockedReason is required and must be a string")

            files = story.get("files")
            if not isinstance(files, list) or not all(isinstance(p, str) and p.strip() for p in files):
                errors.append(f"{label}.files is required and must be a list of non-empty strings (can be empty)")

            depends_on = story.get("dependsOn")
            if depends_on is not None:
                if not isinstance(depends_on, list) or not all(isinstance(d, str) and d.strip() for d in depends_on):
                    errors.append(f"{label}.dependsOn must be a list of non-empty strings when present")

            if isinstance(passes, bool) and isinstance(blocked, bool) and isinstance(blocked_reason, str):
                if passes and blocked:
                    errors.append(f"{label}: if passes=true then blocked must be false")
                if blocked:
                    if passes:
                        errors.append(f"{label}: if blocked=true then passes must be false")
                    if not blocked_reason.strip():
                        errors.append(f"{label}: if blocked=true then blockedReason must be non-empty")

        for index, story in enumerate(stories):
            if not isinstance(story, dict):
                continue
            depends_on = story.get("dependsOn")
            if depends_on is None:
                continue
            for dep in depends_on:
                if dep not in ids:
                    errors.append(f"userStories[{index}].dependsOn references unknown story id '{dep}'")

if errors:
    for e in errors:
        print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)

sys.exit(0)
PY
}

json_read_story_field() {
  local prd="$1" story_id="$2" field="$3"
  python3 - "$prd" "$story_id" "$field" <<'PY'
import json
import sys

path, target_id, field = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path, "r") as f:
    data = json.load(f)
stories = data.get("userStories", [])
for story in stories:
    if isinstance(story, dict) and story.get("id") == target_id:
        value = story.get(field)
        if isinstance(value, bool):
            print("true" if value else "false")
        elif value is None:
            print("")
        else:
            print(value)
        sys.exit(0)
print("")
sys.exit(0)
PY
}

json_count() {
  local prd="$1" mode="$2"
  python3 - "$prd" "$mode" <<'PY'
import json
import sys

path, mode = sys.argv[1], sys.argv[2]
with open(path, "r") as f:
    data = json.load(f)
stories = data.get("userStories", [])

def to_bool(value: object) -> bool:
    return bool(value) is True

count = 0
for story in stories:
    if not isinstance(story, dict):
        continue
    passes = story.get("passes") is True
    blocked = story.get("blocked") is True

    if mode == "total":
        count += 1
    elif mode == "remaining":
        if not passes:
            count += 1
    elif mode == "completed":
        if passes:
            count += 1
    elif mode == "blocked":
        if blocked:
            count += 1

print(count)
PY
}

json_mark_story_blocked() {
  local prd="$1" story_id="$2" reason="$3"
  python3 - "$prd" "$story_id" "$reason" <<'PY'
import json
import sys

path, target_id, reason = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path, "r") as f:
    data = json.load(f)
stories = data.get("userStories", [])
updated = False
for story in stories:
    if not isinstance(story, dict):
        continue
    if story.get("id") != target_id:
        continue
    story["blocked"] = True
    story["blockedReason"] = reason
    story["passes"] = False
    updated = True
    break

if not updated:
    sys.exit(1)

data["userStories"] = stories
with open(path, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")
sys.exit(0)
PY
}

json_increment_attempts() {
  local prd="$1" story_id="$2"
  python3 - "$prd" "$story_id" <<'PY'
import json
import sys

path, target_id = sys.argv[1], sys.argv[2]
with open(path, "r") as f:
    data = json.load(f)
stories = data.get("userStories", [])
updated = False
new_attempts = 0

for story in stories:
    if not isinstance(story, dict):
        continue
    if story.get("id") != target_id:
        continue

    attempts = story.get("attempts")
    if not isinstance(attempts, int) or attempts < 0:
        attempts = 0

    attempts += 1
    story["attempts"] = attempts
    new_attempts = attempts
    updated = True
    break

if not updated:
    sys.exit(1)

data["userStories"] = stories
with open(path, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(new_attempts)
sys.exit(0)
PY
}

json_render_story_block() {
  local prd="$1" story_id="$2"
  python3 - "$prd" "$story_id" "$MAX_ATTEMPTS_PER_STORY" <<'PY'
import json
import sys

path, target_id, max_attempts = sys.argv[1], sys.argv[2], int(sys.argv[3])
with open(path, "r") as f:
    data = json.load(f)
stories = data.get("userStories", [])

for story in stories:
    if not isinstance(story, dict) or story.get("id") != target_id:
        continue

    title = str(story.get("title", "")).strip()
    description = story.get("description")
    acceptance_criteria = story.get("acceptanceCriteria") or []
    verification_command = str(story.get("verificationCommand", ""))
    files = story.get("files") or []
    depends_on = story.get("dependsOn") or []
    priority = story.get("priority")
    passes = story.get("passes") is True
    blocked = story.get("blocked") is True
    blocked_reason = str(story.get("blockedReason", "") or "")
    attempts = story.get("attempts")
    if not isinstance(attempts, int) or attempts < 0:
        attempts = 0

    lines: list[str] = []
    lines.append(f"### {target_id}: {title}")
    if isinstance(description, str) and description.strip():
        lines.append("")
        lines.append(description.strip())

    lines.append("")
    lines.append("**Acceptance Criteria:**")
    for criterion in acceptance_criteria:
        lines.append(f"- {criterion}")

    lines.append("")
    if verification_command.strip():
        lines.append(f"**Verification:** `{verification_command}`")
    else:
        lines.append("**Verification:** manual verification required (no verificationCommand provided)")

    if files:
        lines.append("")
        lines.append("**Files:**")
        for fpath in files:
            lines.append(f"- `{fpath}`")

    if depends_on:
        lines.append("")
        lines.append(f"**Depends On:** {', '.join(depends_on)}")

    if priority is not None:
        lines.append("")
        lines.append(f"**Priority:** {priority}")

    lines.append("")
    lines.append(f"**Tracker State:** passes={str(passes).lower()} blocked={str(blocked).lower()} attempts={attempts}/{max_attempts}")
    if blocked and blocked_reason.strip():
        lines.append(f"**Blocked Reason:** {blocked_reason.strip()}")

    print("\n".join(lines))
    sys.exit(0)

sys.exit(1)
PY
}

select_next_story_json() {
  local prd="$1"

  local story_id
  story_id=$(python3 - "$prd" "$MAX_ATTEMPTS_PER_STORY" <<'PY'
import json
import sys

path, max_attempts = sys.argv[1], int(sys.argv[2])
with open(path, "r") as f:
    data = json.load(f)
stories = data.get("userStories", [])

ids = []
for s in stories:
    if isinstance(s, dict) and isinstance(s.get("id"), str):
        ids.append(s.get("id"))

def find_story(sid: str) -> dict:
    for s in stories:
        if isinstance(s, dict) and s.get("id") == sid:
            return s
    return {}

def is_passed(s: dict) -> bool:
    return s.get("passes") is True

def is_blocked(s: dict) -> bool:
    return s.get("blocked") is True

def deps_satisfied(s: dict) -> bool:
    deps = s.get("dependsOn") or []
    if not isinstance(deps, list):
        return True
    for dep in deps:
        if not isinstance(dep, str):
            continue
        dep_story = find_story(dep)
        if not dep_story or not is_passed(dep_story):
            return False
    return True

dirty = False
for s in stories:
    if not isinstance(s, dict):
        continue
    if is_passed(s):
        continue
    attempts = s.get("attempts")
    if isinstance(attempts, int) and attempts >= max_attempts and not is_blocked(s):
        s["blocked"] = True
        s["blockedReason"] = f"Max attempts reached after {attempts} tries"
        dirty = True

if dirty:
    data["userStories"] = stories
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

candidates = []
for s in stories:
    if not isinstance(s, dict):
        continue
    if is_passed(s) or is_blocked(s):
        continue
    if not deps_satisfied(s):
        continue

    priority = s.get("priority")
    if not isinstance(priority, (int, float)):
        continue
    story_id = s.get("id")
    if not isinstance(story_id, str):
        continue
    candidates.append((priority, story_id))

candidates.sort(key=lambda x: (x[0], x[1]))
print(candidates[0][1] if candidates else "")
PY
  )

  story_id=$(echo "$story_id" | tail -n 1)
  if [ -z "$story_id" ]; then
    return 1
  fi

  STORY_ID="$story_id"
  STORY_TITLE=$(json_read_story_field "$prd" "$story_id" "title")
  STORY_BLOCK=$(json_render_story_block "$prd" "$story_id")

  return 0
}

count_remaining() {
  json_count "$PRD_PATH" "remaining"
}

count_total() {
  json_count "$PRD_PATH" "total"
}

count_completed() {
  json_count "$PRD_PATH" "completed"
}

count_blocked() {
  json_count "$PRD_PATH" "blocked"
}

increment_attempts() {
  local prd="$1"
  local story_id="$2"
  json_increment_attempts "$prd" "$story_id"
}

mark_story_blocked() {
  local prd="$1"
  local story_id="$2"
  local reason="$3"
  json_mark_story_blocked "$prd" "$story_id" "$reason"
  log_error "BLOCKED $story_id: $reason"
  log_activity "Story $story_id marked as blocked: $reason"
}

select_next_story() {
  select_next_story_json "$PRD_PATH"
}

preview_next_story_json() {
  python3 - "$PRD_PATH" <<'PY'
import json
import sys

path = sys.argv[1]
with open(path, "r") as f:
    data = json.load(f)

stories = data.get("userStories", [])

def is_passed(s: dict) -> bool:
    return s.get("passes") is True

def is_blocked(s: dict) -> bool:
    return s.get("blocked") is True

def story_id(s: dict) -> str:
    sid = s.get("id")
    return sid if isinstance(sid, str) else ""

def story_title(s: dict) -> str:
    title = s.get("title")
    return title if isinstance(title, str) else ""

def story_priority(s: dict) -> float:
    p = s.get("priority")
    return float(p) if isinstance(p, (int, float)) else 1e18

def find_story(sid: str) -> dict:
    for s in stories:
        if isinstance(s, dict) and s.get("id") == sid:
            return s
    return {}

def deps_satisfied(s: dict) -> tuple[bool, list[str]]:
    deps = s.get("dependsOn") or []
    if not isinstance(deps, list):
        return True, []
    unmet: list[str] = []
    for dep in deps:
        if not isinstance(dep, str):
            continue
        dep_story = find_story(dep)
        if not dep_story or not is_passed(dep_story):
            unmet.append(dep)
    return len(unmet) == 0, unmet

remaining = sum(1 for s in stories if isinstance(s, dict) and not is_passed(s))
blocked = sum(1 for s in stories if isinstance(s, dict) and is_blocked(s))

if remaining == 0:
    print("All stories complete.")
    sys.exit(0)

candidates: list[dict] = []
for s in stories:
    if not isinstance(s, dict):
        continue
    if is_passed(s) or is_blocked(s):
        continue
    deps_ok, _ = deps_satisfied(s)
    if not deps_ok:
        continue
    if not isinstance(s.get("priority"), (int, float)):
        continue
    candidates.append(s)

candidates.sort(key=lambda s: (story_priority(s), story_id(s)))
next_story = candidates[0] if candidates else None

if next_story is None:
    waiting = 0
    for s in stories:
        if not isinstance(s, dict):
            continue
        if is_passed(s) or is_blocked(s):
            continue
        deps_ok, _ = deps_satisfied(s)
        if not deps_ok:
            waiting += 1

    print(f"No runnable stories remain ({remaining} remaining, {blocked} blocked, {waiting} waiting on deps).")
    print("")
    print("Details:")
    for s in sorted([s for s in stories if isinstance(s, dict)], key=lambda s: (story_priority(s), story_id(s))):
        sid = story_id(s)
        title = story_title(s)
        if is_passed(s):
            print(f"- PASS   {sid}: {title}")
            continue
        if is_blocked(s):
            reason = s.get("blockedReason") if isinstance(s.get("blockedReason"), str) else ""
            print(f"- BLOCK  {sid}: {title} ({reason})")
            continue
        deps_ok, unmet = deps_satisfied(s)
        if not deps_ok:
            print(f"- WAIT   {sid}: {title} (depends on: {', '.join(unmet)})")
            continue
        print(f"- READY  {sid}: {title}")
    sys.exit(2)

sid = story_id(next_story)
title = story_title(next_story)
print(f"Next story: {sid}: {title}")
print("")
print("Skip reasons:")
for s in sorted([s for s in stories if isinstance(s, dict)], key=lambda s: (story_priority(s), story_id(s))):
    sid2 = story_id(s)
    title2 = story_title(s)
    if sid2 == sid:
        print(f"- NEXT   {sid2}: {title2}")
        continue
    if is_passed(s):
        print(f"- PASS   {sid2}: {title2}")
        continue
    if is_blocked(s):
        reason = s.get("blockedReason") if isinstance(s.get("blockedReason"), str) else ""
        print(f"- BLOCK  {sid2}: {title2} ({reason})")
        continue
    deps_ok, unmet = deps_satisfied(s)
    if not deps_ok:
        print(f"- WAIT   {sid2}: {title2} (depends on: {', '.join(unmet)})")
        continue
    print(f"- READY  {sid2}: {title2}")

sys.exit(0)
PY
}

preview_next_story() {
  preview_next_story_json
}

# Render prompt template with variables
render_prompt() {
  local template="$1" output="$2" run_id="$3" iteration="$4"

  local prd_escaped progress_escaped working_escaped guardrails_escaped errors_escaped agents_escaped
  local story_id_escaped story_title_escaped iteration_escaped run_id_escaped

  prd_escaped=$(escape_sed_replacement "$PRD_PATH")
  progress_escaped=$(escape_sed_replacement "$PROGRESS")
  working_escaped=$(escape_sed_replacement "$WORKING")
  guardrails_escaped=$(escape_sed_replacement "$GUARDRAILS")
  errors_escaped=$(escape_sed_replacement "$ERRORS_LOG")
  agents_escaped=$(escape_sed_replacement "$AGENTS_MD")

  story_id_escaped=$(escape_sed_replacement "${STORY_ID:-}")
  story_title_escaped=$(escape_sed_replacement "${STORY_TITLE:-}")
  iteration_escaped=$(escape_sed_replacement "$iteration")
  run_id_escaped=$(escape_sed_replacement "$run_id")

  sed -e "s|{{PRD_PATH}}|$prd_escaped|g" \
      -e "s|{{PROGRESS_PATH}}|$progress_escaped|g" \
      -e "s|{{WORKING_PATH}}|$working_escaped|g" \
      -e "s|{{GUARDRAILS_PATH}}|$guardrails_escaped|g" \
      -e "s|{{ERRORS_LOG_PATH}}|$errors_escaped|g" \
      -e "s|{{AGENTS_PATH}}|$agents_escaped|g" \
      -e "s|{{STORY_ID}}|$story_id_escaped|g" \
      -e "s|{{STORY_TITLE}}|$story_title_escaped|g" \
      -e "s|{{ITERATION}}|$iteration_escaped|g" \
      -e "s|{{RUN_ID}}|$run_id_escaped|g" \
      "$template" > "$output"

  # Append story block so the agent sees the full story context.
  if [ -n "$STORY_BLOCK" ]; then
    echo "" >> "$output"
    echo "$STORY_BLOCK" >> "$output"
  fi
}

# Run agent (uses functions from agents.sh)
run_agent() {
  local prompt_file="$1"
  case "$AGENT" in
    codex)  run_codex "$prompt_file" ;;
    claude) run_claude "$prompt_file" ;;
    droid)  run_droid "$prompt_file" ;;
    custom) run_custom "$prompt_file" "$CUSTOM_CMD" ;;
  esac
}

# Preflight validation
preflight_check() {
  local errors=0

  # python3 is required for JSON parsing/updates.
  if ! command -v python3 >/dev/null 2>&1; then
    echo -e "${RED}Error: python3 is required${NC}"
    ((errors++))
  fi

  # Check agents.sh exists (already sourced, but verify)
  if ! declare -f run_codex > /dev/null 2>&1; then
    echo -e "${RED}Error: agents.sh not loaded properly${NC}"
    echo "  Expected: $SCRIPT_DIR/agents.sh"
    ((errors++))
  fi

  # Check prompt template exists
  if [ "$PREVIEW" != "true" ] && [ ! -f "$PROMPT_TEMPLATE" ]; then
    echo -e "${RED}Error: Prompt template not found${NC}"
    echo "  Expected: $PROMPT_TEMPLATE"
    echo ""
    echo "  Re-run the Autopilot setup script to refresh .agents/autopilot/ templates."
    ((errors++))
  fi

  # PRD must exist
  if [ ! -f "$PRD_PATH" ]; then
    echo -e "${RED}Error: PRD not found${NC}"
    echo "  Looked for: $PRD_PATH"
    echo ""
    echo "  Create it by running the Autopilot setup script (from wherever Autopilot is installed),"
    echo "  or by creating a valid .agents/autopilot/prd.json manually."
    ((errors++))
  else
    if ! validate_prd_json "$PRD_PATH"; then
      ((errors++))
    fi

    local remaining
    remaining=$(count_remaining)
    if [ "$remaining" -eq 0 ]; then
      echo -e "${YELLOW}Warning: No remaining stories found in PRD${NC}"
      echo "  All stories may already be complete."
    fi
  fi

  if [ "$errors" -gt 0 ]; then
    exit 1
  fi
}

acquire_lock() {
  mkdir -p "$(dirname "$LOCK_FILE")"
  if [ -f "$LOCK_FILE" ]; then
    local lock_pid
    lock_pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
    if [ -n "$lock_pid" ] && kill -0 "$lock_pid" 2>/dev/null; then
      echo -e "${RED}Error: Autopilot already running (pid $lock_pid)${NC}"
      exit 1
    fi
    echo -e "${YELLOW}Warning: Stale lockfile found; replacing${NC}"
  fi
  echo $$ > "$LOCK_FILE"
}

release_lock() {
  rm -f "$LOCK_FILE"
}

preflight_check
acquire_lock
trap 'release_lock' EXIT INT TERM

# Create directories
mkdir -p "$RUNS_DIR" "$(dirname "$GUARDRAILS")" "$(dirname "$PRD_PATH")"
touch "$PROGRESS" "$WORKING" "$GUARDRAILS" "$ERRORS_LOG" "$ACTIVITY_LOG"

# Generate run ID
RUN_ID=$(date +%Y%m%d-%H%M%S)-$$

# Stats for summary dashboard
STATS_START_TIME=$(date +%s)
STATS_ITERATIONS=0
STATS_STORIES_COMPLETED=0
STATS_COMMITS=0
STATS_ERRORS=0

# Summary dashboard
print_summary() {
  local end_time=$(date +%s)
  local total_duration=$((end_time - STATS_START_TIME))
  local minutes=$((total_duration / 60))
  local seconds=$((total_duration % 60))

  # Count stories from PRD
  local total_stories=0
  local completed_stories=0
  local blocked_stories=0
  if [ -f "$PRD_PATH" ]; then
    total_stories=$(count_total)
    completed_stories=$(count_completed)
    blocked_stories=$(count_blocked)
  fi

  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Autopilot Summary${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "  Run ID:      ${GREEN}$RUN_ID${NC}"
  echo -e "  Agent:       ${GREEN}$AGENT${NC}"
  echo ""
  echo -e "  Duration:    ${CYAN}${minutes}m ${seconds}s${NC}"
  echo -e "  Iterations:  ${CYAN}$STATS_ITERATIONS${NC}"
  echo -e "  Stories:     ${GREEN}$completed_stories${NC}/${total_stories} complete"
  if [ "$blocked_stories" -gt 0 ]; then
    echo -e "  Blocked:     ${YELLOW}$blocked_stories${NC}"
  fi
  echo -e "  Commits:     ${CYAN}$STATS_COMMITS${NC}"
  if [ "$STATS_ERRORS" -gt 0 ]; then
    echo -e "  Errors:      ${RED}$STATS_ERRORS${NC}"
  else
    echo -e "  Errors:      ${GREEN}0${NC}"
  fi
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
}

echo -e "${CYAN}Autopilot${NC}"
echo -e "Agent: ${GREEN}$AGENT${NC}"
echo -e "Max iterations: ${GREEN}$MAX_ITERS${NC}"
echo -e "Run ID: ${GREEN}$RUN_ID${NC}"
echo ""

log_activity "RUN START run=$RUN_ID agent=$AGENT max_iters=$MAX_ITERS"

if [ "$PREVIEW" = "true" ]; then
  preview_next_story
  exit $?
fi

HAS_ERROR=false

for i in $(seq 1 "$MAX_ITERS"); do
  ITER_START=$(date +%s)
  ITER_START_FMT=$(date '+%Y-%m-%d %H:%M:%S')

  echo ""
  echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}  Iteration $i of $MAX_ITERS${NC}"
  echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"

  STORY_ID=""
  STORY_TITLE=""
  STORY_BLOCK=""

  # Select next story
  if ! select_next_story; then
    REMAINING=$(count_remaining)
    if [ "$REMAINING" -eq 0 ]; then
      echo -e "${GREEN}All stories complete!${NC}"
      log_activity "RUN COMPLETE run=$RUN_ID - all stories done"
      print_summary
      exit 0
    fi

    echo -e "${YELLOW}No runnable stories remain${NC}"
    preview_next_story || true
    log_activity "RUN END run=$RUN_ID - no runnable stories (remaining=$REMAINING)"
    print_summary
    exit 2
  fi

  REMAINING=$(count_remaining)
  echo -e "Story: ${GREEN}$STORY_ID: $STORY_TITLE${NC}"
  echo -e "Remaining: ${CYAN}$REMAINING${NC}"

  STORY_PASSES_BEFORE=""
  if [ -n "$STORY_ID" ]; then
    STORY_PASSES_BEFORE=$(json_read_story_field "$PRD_PATH" "$STORY_ID" "passes")
  fi

  # Track git state
  HEAD_BEFORE=$(git_head)

  # Render prompt
  PROMPT_FILE=$(mktemp)
  render_prompt "$PROMPT_TEMPLATE" "$PROMPT_FILE" "$RUN_ID" "$i"

  # Run log
  mkdir -p "$RUNS_DIR"
  LOG_STORY_SUFFIX=""
  if [ -n "$STORY_ID" ]; then
    SAFE_STORY_ID=$(echo "$STORY_ID" | tr -c 'A-Za-z0-9._-' '_')
    LOG_STORY_SUFFIX="-story-$SAFE_STORY_ID"
  fi
  RUN_LOG="$RUNS_DIR/run-$RUN_ID-iter-$i${LOG_STORY_SUFFIX}.log"
  RUN_META="$RUNS_DIR/run-$RUN_ID-iter-$i${LOG_STORY_SUFFIX}.md"

  log_activity "ITERATION $i start (${STORY_ID:+story=$STORY_ID})"

  # Git stash backup before agent runs (enables rollback on failure)
  if [ "$DRY_RUN" != "true" ]; then
    git -C "$ROOT_DIR" stash push -m "autopilot-backup-$RUN_ID-iter-$i" --include-untracked 2>/dev/null || true
    # Immediately pop - we just want it in the stash history for recovery
    git -C "$ROOT_DIR" stash pop 2>/dev/null || true
  fi

  # Execute agent
  set +e
  if [ "$DRY_RUN" = "true" ]; then
    echo "[DRY RUN] Would execute agent with prompt:" | tee "$RUN_LOG"
    cat "$PROMPT_FILE" >> "$RUN_LOG"
    CMD_EXIT=0
  else
    run_agent "$PROMPT_FILE" 2>&1 | tee "$RUN_LOG"
    CMD_EXIT=${PIPESTATUS[0]}
  fi
  set -e

  rm -f "$PROMPT_FILE"

  # Calculate duration
  ITER_END=$(date +%s)
  ITER_END_FMT=$(date '+%Y-%m-%d %H:%M:%S')
  ITER_DURATION=$((ITER_END - ITER_START))

  # Track git changes
  HEAD_AFTER=$(git_head)
  COMMIT_LIST=$(git_commit_list "$HEAD_BEFORE" "$HEAD_AFTER")
  CHANGED_FILES=$(git_changed_files "$HEAD_BEFORE" "$HEAD_AFTER")
  DIRTY_FILES=$(git_dirty_files)

  # Determine status and update stats
  STATUS="success"
  ((STATS_ITERATIONS++))
  if [ "$CMD_EXIT" -ne 0 ]; then
    STATUS="error"
    HAS_ERROR=true
    ((STATS_ERRORS++))
    echo -e "${RED}Agent exited with code $CMD_EXIT${NC}"
    log_error "ITERATION $i failed (exit=$CMD_EXIT)"
  fi

  # Count commits made this iteration
  if [ -n "$COMMIT_LIST" ]; then
    ITER_COMMITS=$(echo "$COMMIT_LIST" | grep -c '^-' || echo 0)
    STATS_COMMITS=$((STATS_COMMITS + ITER_COMMITS))
  fi

  # Check for uncommitted changes
  if [ "$NO_COMMIT" = "false" ] && [ -n "$DIRTY_FILES" ]; then
    echo -e "${YELLOW}Warning: Uncommitted changes remain${NC}"
    log_error "ITERATION $i left uncommitted changes"
  fi

  log_activity "ITERATION $i end (duration=${ITER_DURATION}s status=$STATUS)"

  # Write run metadata
  write_run_meta "$RUN_META" "build" "$i" "$RUN_ID" \
    "$STORY_ID" "$STORY_TITLE" \
    "$ITER_START_FMT" "$ITER_END_FMT" "$ITER_DURATION" \
    "$STATUS" "$RUN_LOG" \
    "$HEAD_BEFORE" "$HEAD_AFTER" \
    "$COMMIT_LIST" "$CHANGED_FILES" "$DIRTY_FILES"

  echo -e "Duration: ${CYAN}${ITER_DURATION}s${NC}"

  # Check for story completion (JSON uses passes=true)
  STORY_PASSES_AFTER=$(json_read_story_field "$PRD_PATH" "$STORY_ID" "passes")
  NEW_REMAINING=$(count_remaining)

  if [ "$STORY_PASSES_AFTER" = "true" ]; then
    if [ "$STORY_PASSES_BEFORE" != "true" ]; then
      STATS_STORIES_COMPLETED=$((STATS_STORIES_COMPLETED + 1))
    fi
  else
    if [ -n "$STORY_ID" ]; then
      new_attempts=$(increment_attempts "$PRD_PATH" "$STORY_ID")
      echo -e "${YELLOW}Story $STORY_ID still incomplete (attempt $new_attempts/$MAX_ATTEMPTS_PER_STORY)${NC}"

      if grep -qE 'Transport closed|MCP.*failed|cannot open browser|permission denied' "$RUN_LOG" 2>/dev/null; then
        if [ "$new_attempts" -ge "$MAX_ATTEMPTS_PER_STORY" ]; then
          mark_story_blocked "$PRD_PATH" "$STORY_ID" "External tool failure after $new_attempts attempts"
        fi
      else
        if [ "$new_attempts" -ge "$MAX_ATTEMPTS_PER_STORY" ]; then
          mark_story_blocked "$PRD_PATH" "$STORY_ID" "Max attempts reached after $new_attempts tries"
        fi
      fi
    fi
  fi

  if [ "${NEW_REMAINING:-1}" -eq 0 ]; then
    echo -e "${GREEN}All stories complete!${NC}"
    log_activity "RUN COMPLETE run=$RUN_ID - all stories done"
    print_summary
    exit 0
  fi

  # Check for completion signal
  if grep -q '<promise>COMPLETE</promise>' "$RUN_LOG" 2>/dev/null; then
    if [ "$NEW_REMAINING" -eq 0 ]; then
      echo -e "${GREEN}All stories complete!${NC}"
      log_activity "RUN COMPLETE run=$RUN_ID - completion signal"
      print_summary
      exit 0
    fi
    echo -e "${YELLOW}Completion signal but $NEW_REMAINING stories remain${NC}"
  fi

  sleep 2
done

echo ""
echo -e "${YELLOW}Reached max iterations ($MAX_ITERS)${NC}"
log_activity "RUN END run=$RUN_ID - max iterations reached"

print_summary

if [ "$HAS_ERROR" = "true" ]; then
  exit 1
fi
exit 0
