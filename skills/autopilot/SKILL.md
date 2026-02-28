---
name: autopilot
description: "Execute plans autonomously. Converts plans to stories and runs until done. Use when user says '/autopilot', 'autopilot', 'auto mode', or wants autonomous execution."
---

# Autopilot

Convert plans into verifiable stories and execute them one at a time until complete.

---

## When This Skill is Triggered

**If given a plan or spec file:** `autopilot docs/feature/spec.md`
→ Follow the [Conversion Instructions](#conversion-instructions) below (it creates `prd.json`)

**If given `build`:** `autopilot build`
→ Follow the [Build Loop](#build-loop) below

**If asked to set up:** `autopilot setup` or "set up autopilot"
→ Run the [Quick Setup](#quick-setup) script

---

## Quick Setup

Use the setup script for one-command initialization:

```bash
# From the skill directory (or copy setup.sh to your project)
./setup.sh                           # Create empty PRD template (prd.json)
./setup.sh path/to/spec.md           # Copy spec into input.md + create prd.json template
./setup.sh --from-prd existing.json  # Copy existing PRD JSON

# Or set custom target directory
AUTOPILOT_TARGET_DIR=.autopilot ./setup.sh
```

This creates:
```
.agents/autopilot/
├── prd.json         # PRD tracker (source of truth)
├── progress.md      # Empty, will be appended
├── working.md       # Updated each iteration with "what happened" + "what next"
├── input.md         # Optional: your original spec/plan copied for reference
├── guardrails.md    # Failure patterns to avoid
├── errors.log       # Error tracking
├── AGENTS.md        # Repo AGENTS.md + autonomous rules
├── run.sh           # Execution loop (executable)
├── agents.sh        # Agent command definitions
├── PROMPT_build.md  # Build prompt template
├── runs/            # Run logs directory
└── artifacts/       # Screenshots, etc.
```

**Note:** The generated AGENTS.md combines your repo's AGENTS.md with autonomous mode rules that allow committing without user approval.

---

## Conversion Instructions

When the user provides a plan OR spec file, you MUST follow these steps exactly.

Goal: create `.agents/autopilot/prd.json` so Autopilot can execute one story at a time.

### Step 1: Read and Analyze the Plan

1. Read the input file provided by the user (plan or spec)
2. Identify parent tasks / major deliverables (1.0, 2.0, etc.) - these become stories
3. Identify subtasks / requirements - these become acceptance criteria
4. Identify validation tasks (often marked "Validate:", "Test:", "Verify:")

### Step 1.5: Apply Deterministic Plan → PRD JSON Mapping Rules

These rules are **deterministic** (no "AI guesswork" required):

Common plan patterns supported:
- `# Implementation Plan: <name>`
- `## Tasks` with `### Phase X: ...`
- Parent tasks: `- [ ] 1.0 ...` / `- [x] 1.0 ...`
- Subtasks: `- [ ] 1.1 ...`, `- [ ] 1.1.1 ...`
- Validation lines: `Validation for 1.0: ...` / `Validate: ...` / `Verify: ...`
- File anchors in backticks: `` `src/...` ``

- **Story creation:** Each parent task `N.0` → one `userStories[]` entry.
- **IDs:**
  - If the plan uses numeric IDs, reuse them (e.g. `1.0`).
  - If a parent task has no numeric ID, generate `task-001`, `task-002`, ...
- **Titles:** Use the parent task title text as `title`.
- **Acceptance criteria:** All subtasks under that parent → `acceptanceCriteria[]` (exclude validation-only lines).
- **Verification command:** From validation lines (e.g. "Validation for 1.0:" / "Validate:" / "Verify:"), take the **first** backticked command-like snippet as `verificationCommand`.
  - If none exists, set `verificationCommand: ""` and add a criterion like `"Manual verification required (no command provided)"`.
- **Files:** Any backticked path-like token in the story scope → `files[]` (dedupe).
- **Priority:** Derive deterministically from (phase order, then story order). Use `1, 2, 3...`.
- **Completion carry-over:** If the parent task is checked (`[x]`) in the plan, set `passes: true` in JSON (so Autopilot can resume mid-plan).
- **Dependencies:** Only set `dependsOn` if the plan includes explicit metadata (e.g. `dependsOn: 1.0, 2.0`). Do not infer.
- **State defaults:** `attempts: 0`, `blocked: false`, `blockedReason: ""`.

Edge cases:
- Plans without `## Tasks`: treat `## 1)`, `## 2)` sections as phases.
- Stories without a verification command: allow empty `verificationCommand` + require a manual verification note.

### Step 1.6: Spec → PRD JSON Mapping (When There Is No Numbered Plan)

If the input is a spec (not a numbered plan), use these rules:

- **Story creation:** Each major user-visible outcome in the spec → one story.
  - Example: "Add billing settings page" is one story, "Update API + DB + UI for billing" is too big (split by layer).
- **Acceptance criteria:** Turn spec requirements into specific, checkable bullets.
- **Verification command:** Prefer a real command from the repo (`make test`, `pytest`, `go test ./...`, etc.). If unknown, leave it empty and add a manual verification criterion.
- **Files:** Add only if the spec names specific paths; otherwise leave empty.
- **Priority:** Use the order the spec presents (or the most dependency-safe order).

### Step 2: Create Directory Structure

**Option A (Recommended):** Run the setup script:
```bash
./setup.sh path/to/spec.md
```

**Option B:** Create manually:
```
.agents/autopilot/
├── prd.json         # You will create this (Step 7)
├── progress.md      # Empty, will be appended
├── working.md       # Optional but recommended
├── input.md         # Optional: your original spec/plan (copied)
├── guardrails.md    # Copy from templates/guardrails.md
├── errors.log       # Empty
├── AGENTS.md        # Repo AGENTS.md + templates/AGENTS-autonomous.md
├── run.sh           # Copy from templates/run.sh (chmod +x)
├── agents.sh        # Copy from templates/agents.sh
└── PROMPT_build.md  # Copy from templates/PROMPT_build.md
```

Copy files from the skill templates directory (wherever Autopilot is installed on your machine):
- `run.sh` - Main execution loop (make executable with `chmod +x`)
- `agents.sh` - Agent command definitions (codex, claude, droid)
- `PROMPT_build.md` - Build mode prompt template
- `guardrails.md` - Guardrails template
- `AGENTS-autonomous.md` - Append to repo's AGENTS.md

### Step 3: Convert Each Parent Task to a Story

For each parent task in the plan, create **one** entry in `.agents/autopilot/prd.json` under `userStories[]`.

#### PRD JSON Schema (Required Fields)

Top-level:
- `name: string`
- `userStories: array`

Each `userStories[]` entry:
- `id: string` (prefer numeric like `1.0` to match plan output)
- `title: string`
- `description?: string`
- `acceptanceCriteria: string[]`
- `verificationCommand: string` (may be empty)
- `priority: number` (deterministic from order)
- `dependsOn?: string[]`
- `passes: boolean`
- `attempts: number` (integer)
- `blocked: boolean`
- `blockedReason: string`
- `files: string[]`
- `phase?: { id: string, title: string }`

#### Canonical State Rules (Invariants)

- If `passes === true` then `blocked === false`
- If `blocked === true` then `passes === false` and `blockedReason !== ""`
- `attempts` is updated by the loop (you do not need to manually increment it)

**Important:** Stories are pass/fail. ALL acceptance criteria must be met before setting `passes=true`. No partial credit.

### Step 4: Make Acceptance Criteria Specific

**NEVER accept vague criteria. Rewrite them into checkable outcomes:**
- "Works correctly" -> "Returns 200 status with user data"
- "Handle errors" -> "Shows error toast when API returns 4xx/5xx"
- "Style properly" -> "Matches Figma design at mobile/desktop breakpoints"

### Step 5: Validate Story Sizing

Each story MUST be completable in ONE iteration. Check:

**Right-sized (keep as-is):**
- Single database column + migration
- Single UI component addition
- Single API endpoint change
- Single form field with validation

**Too big (MUST split):**
- More than 5-6 acceptance criteria → Split by layer or feature
- Schema + backend + UI in one story → Split into 3 stories
- Multiple unrelated changes → Separate stories
- "Full CRUD" → Split: Create, Read, Update, Delete

### Step 6: Order Stories by Dependency

Arrange stories in execution order:
1. Schema/database changes first
2. Backend/API changes second
3. UI/frontend changes last
4. Tests/validation last

### Step 7: Write the PRD

Write to `.agents/autopilot/prd.json`:

```json
{
  "name": "{Feature Name}",
  "userStories": [
    {
      "id": "1.0",
      "title": "{First Story Title}",
      "description": "{Optional description}",
      "acceptanceCriteria": [
        "{Specific, verifiable criterion}",
        "{Specific, verifiable criterion}"
      ],
      "verificationCommand": "{Exact command to run}",
      "priority": 1,
      "dependsOn": [],
      "passes": false,
      "attempts": 0,
      "blocked": false,
      "blockedReason": "",
      "files": []
    },
    {
      "id": "2.0",
      "title": "{Second Story Title}",
      "description": "{Optional description}",
      "acceptanceCriteria": [
        "{Specific, verifiable criterion}"
      ],
      "verificationCommand": "{Exact command to run}",
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
```

### Step 8: Create Supporting Files

1. Create empty `.agents/autopilot/progress.md`
2. Create empty `.agents/autopilot/working.md` (recommended)
3. (Optional) Copy your original plan/spec to `.agents/autopilot/input.md` for reference
4. Create `.agents/autopilot/guardrails.md` with:
```markdown
# Guardrails

Signs are patterns learned from past failures. Read before each iteration.

---

<!-- Signs will be added below by the agent -->
```

### Step 9: Output Conversion Summary

After conversion, output:

```
Autopilot PRD created: .agents/autopilot/prd.json

Stories:
- 1.0: {Title}
- 2.0: {Title}
- 3.0: {Title}

Total: {N} stories

Ready to execute. Run:
  ./.agents/autopilot/run.sh build

Or continue here to execute the first story.
```

### Step 10: Ask to Proceed

Ask the user: "Start executing stories now, or review the PRD first?"

---

## Build Loop

When executing stories (either after conversion or when triggered with `autopilot build`):

### For Each Story (One at a Time)

1. **Read AGENTS.md** - Check `.agents/autopilot/AGENTS.md` for project conventions and autonomous rules
2. **Read guardrails** - Check `.agents/autopilot/guardrails.md` for known failure patterns
3. **Read errors log** - Check `.agents/autopilot/errors.log` for recent failures
4. **Read working notes** - Check `.agents/autopilot/working.md` for "what was tried" and "what next"
5. **Select story** - Pick the next runnable story:
   - JSON PRD: `passes=false`, `blocked=false`, dependencies satisfied, lowest `priority`
6. **Implement** - Complete ALL acceptance criteria for this story only
7. **Verify** - Run the verification command
8. **Mark complete** - If ALL criteria pass:
   - JSON PRD: set `passes=true` for this story
9. **Commit** - Create a git commit for this story
10. **Log progress** - Append to `.agents/autopilot/progress.md`
11. **Update working notes** - Update `.agents/autopilot/working.md` with what happened + what to try next

### Story Completion

A story is complete ONLY when **ALL** success criteria are satisfied:
- Do NOT mark the story as passed (`passes=true`) if any criterion fails
- Run verification command to confirm
- If verification fails, story stays incomplete

### Progress Entry Format

Append to `.agents/autopilot/progress.md`:

```markdown
## {Date/Time} - {Story ID}: {Story Title}

Run: {run-id} (iteration {N})

- Guardrails reviewed: yes
- Commit: {hash} {subject}
- Verification: `{command}` -> PASS/FAIL
- Files changed:
  - {file1}
  - {file2}
- What was implemented:
  - {summary}
- **Learnings:**
  - {Any gotchas or patterns discovered}

---
```

### Completion Signal

When ALL stories in the PRD are complete:
- JSON PRD: every `userStories[].passes=true`

Output:

```
<promise>COMPLETE</promise>
```

### Blocked Story Protocol

If a story cannot be completed due to external factors (browser MCP unavailable, missing dependency, etc.):

1. **Log to errors.log:**
   ```
   [timestamp] BLOCKED {story-id}: reason
   ```

2. **Update PRD metadata:**
   - JSON (`prd.json`): set `blocked=true`, `blockedReason="Brief description"` (ensure `passes=false`)

3. **Document in progress.md:**
   ```markdown
   ## {Date/Time} - {Story ID}: {Story Title} (BLOCKED)

   - Blocked reason: {what prevented completion}
   - Attempted: {what was tried}
   - Recommendation: {what human should do}
   ```

4. **Move on** - Do NOT retry the same failing action indefinitely

The loop automatically marks stories as blocked after 3 failed attempts.

### If You Hit a Recurring Error

1. Log to `.agents/autopilot/errors.log`: `[{timestamp}] {error description}`
2. If same error twice, add a Sign to `.agents/autopilot/guardrails.md`:

```markdown
### Sign: {Descriptive Name}
- **Trigger:** When {this happens}
- **Instruction:** Do {this instead}
- **Added after:** Iteration {N} - {What happened}
```

---

## External Loop

For autonomous execution, use the external loop:

```bash
# Quick setup (recommended)
./setup.sh path/to/spec.md

# Or manual setup
mkdir -p .agents/autopilot
cp <AUTOPILOT_SKILL_DIR>/templates/{run.sh,agents.sh,PROMPT_build.md,guardrails.md,prd.json} .agents/autopilot/
cat ./AGENTS.md <AUTOPILOT_SKILL_DIR>/templates/AGENTS-autonomous.md > .agents/autopilot/AGENTS.md
touch .agents/autopilot/{progress.md,working.md,input.md,errors.log,activity.log}

# Run the loop
./.agents/autopilot/run.sh build          # Default max iterations
./.agents/autopilot/run.sh build 10       # Max 10 iterations
./.agents/autopilot/run.sh build --preview  # Show next story + skip reasons
AUTOPILOT_AGENT=claude ./.agents/autopilot/run.sh build  # Use Claude CLI
```

**Supported agents:** codex (default), claude, droid, or custom command.

**Loop features:**
- Deterministic selection: `passes=false`, `blocked=false`, deps satisfied, lowest `priority`
- Automatically skips blocked stories
- Marks stories blocked after 3 failed attempts
- Tracks attempt count per story
- Shows summary with passed/blocked counts
