# Implementation Plan: Autopilot JSON PRD + Plan-Aware Stories

**Spec:** `improvements-codex.md`

## Description

Upgrade the Autopilot “Ralph Wiggum loop” so it feels more magical and reliable by moving the execution tracker from a fragile Markdown PRD to a structured JSON PRD, while keeping Autopilot as a separate (optional) skill from `plan`. The JSON PRD should preserve the best parts of a plan (technical breakdown, file anchors, validation commands) so Autopilot stories have both clear “what to do” and practical “how to do it” context.

## Scope

- In:
  - New `.agents/autopilot/prd.json` format (source of truth for story state)
  - Backwards compatibility: if only `prd.md` exists, loop still works (migration path)
  - Plan→JSON conversion rules that map common plan patterns into story fields deterministically
  - JSON-based selection logic that supports `priority` and optional `dependsOn`
  - Safer, clearer prompt rendering: story details are rendered from JSON
  - Better loop UX: explicit “all blocked” terminal state, and a preview mode
- Out:
  - Merging Autopilot into the `plan` skill (keep them separate)
  - A full UI/TUI (keep this as a terminal workflow)
  - Perfect automatic dependency inference from natural language (support explicit metadata instead)

## Tasks

### Phase 1: Lock down the PRD JSON schema and invariants

This phase defines what the loop reads/writes so everything else is stable and deterministic.

- [x] 1.0 Define `prd.json` schema (ralph-tui-aligned, with Autopilot extensions)
  - [x] 1.1 Choose the top-level shape (recommend ralph-tui style): `{ name, userStories: [] }`
  - [x] 1.2 Define required story fields and invariants:
    - `id: string` (prefer numeric like `1.0` to match plan output)
    - `title: string`
    - `description: string` (optional but strongly recommended)
    - `acceptanceCriteria: string[]` (from plan subtasks; can be procedural)
    - `verificationCommand: string` (best-effort extracted; may be empty)
    - `priority: number` (deterministic from order)
    - `dependsOn: string[]` (optional)
    - `passes: boolean` (only true when criteria satisfied)
    - `attempts: number` (incremented by the loop)
    - `blocked: boolean` and `blockedReason: string`
    - `files: string[]` (file path anchors extracted from plan/tasks)
    - (optional) `phase: { id: string, title: string }` for traceability back to plan phases
  - [x] 1.3 Decide canonical state rules (document in the plan and enforce in code):
    - If `passes === true` then `blocked === false`
    - If `blocked === true` then `passes === false` and `blockedReason !== ""`
    - `attempts` only increments when the story remains not passed after an iteration
  - [x] 1.4 Validation for 1.0: add a JSON fixture and confirm a validator can reject:
    - invalid JSON
    - missing `userStories`
    - duplicate story IDs

### Phase 2: Define deterministic plan.md → prd.json conversion rules

This phase makes Autopilot “plan-aware” without merging it into the plan skill.

- [x] 2.0 Update Autopilot conversion instructions to generate `prd.json` from a plan
  - [x] 2.1 Encode the plan patterns observed across your repos (examples include):
    - `# Implementation Plan: <name>`
    - `## Tasks` with `### Phase X: ...`
    - parent tasks: `- [ ] 1.0 ...` (often bolded)
    - subtasks: `- [ ] 1.1 ...`, `- [ ] 1.1.1 ...`
    - validation lines: `Validation for 1.0: ...` or `Validate: ...`
    - file anchors in backticks: `` `src/...` ``
  - [x] 2.2 Mapping rules (deterministic; no “AI guesswork” required):
    - Each parent task `N.0` → one `userStories[]` entry
    - All subtasks under that parent → `acceptanceCriteria[]` (exclude validation-only lines)
    - The first command-looking backticked snippet in validation lines → `verificationCommand`
    - Any backticked path-like token in the story scope → `files[]`
    - `priority` derived from (phase order, then story order)
    - `[x]` parent tasks in the plan → `passes: true` in JSON (so Autopilot can resume mid-plan)
  - [x] 2.3 Define edge-case handling:
    - Plans without a `## Tasks` section (treat `## 1)` / `## 2)` sections as phases)
    - Parent tasks without numeric IDs (generate `task-001`, `task-002`)
    - Stories without any validation command (allow empty `verificationCommand` + require manual verification note)
  - [ ] 2.4 Validation for 2.0: run conversion on 2 real plan files from your repos and manually confirm:
    - parent tasks become stories
    - subtasks are preserved
    - validation commands are extracted
    - file anchors populate `files[]`

### Phase 3: Add JSON templates + validators in this repo

This phase updates the Autopilot “starter kit” so new projects get JSON by default.

- [x] 3.0 Add JSON template and validation tooling
  - [x] 3.1 Add `templates/prd.json` (minimal but valid)
  - [x] 3.2 Update `setup.sh` to create `.agents/autopilot/prd.json` by default
    - Keep `prd.md` optional (either deprecated or generated view later)
  - [x] 3.3 Add a JSON validator (recommend a small Python script alongside `tests/validate_prd.py`)
    - Validate required fields, duplicate IDs, and invariant rules (passes/blocked/attempts)
  - [x] 3.4 Validation for 3.0: `tests/run-tests.sh` should verify:
    - `templates/prd.json` exists
    - JSON validator passes on the template

### Phase 4: Update the loop to run from prd.json (with safe fallback)

This phase is the core behavior change: selection, attempts, blocked, done-ness all come from JSON.

- [x] 4.0 Make `templates/run.sh` support JSON PRDs as source of truth
  - [x] 4.1 Add JSON preflight checks:
    - If `prd.json` exists: validate JSON before running
    - If `prd.json` missing but `prd.md` exists: run legacy markdown mode
    - If neither exists: fail with a clear setup message
  - [x] 4.2 Implement JSON story selection:
    - Filter to `passes === false` and `blocked === false`
    - Enforce `dependsOn` if present (skip until dependencies have `passes === true`)
    - Sort by `priority` (ascending) and pick first
  - [x] 4.3 Implement JSON story state updates by the loop:
    - Increment `attempts` when the story remains not passed after an iteration
    - When attempts exceed max, set `blocked=true` + `blockedReason`
    - Add explicit terminal state: if remaining stories exist but all are blocked → exit non-zero with clear message
  - [x] 4.4 Implement “done” detection:
    - Done only when all stories have `passes === true` (not “no runnable stories”)
  - [x] 4.5 Add `--preview` mode:
    - Print the next selected story and why others were skipped (blocked/deps)
    - Exit without running any agent
  - [x] 4.6 Validation for 4.0: create a tiny fixture PRD JSON with:
    - 2 stories, one depends on the other
    - one blocked story
    - confirm selection and terminal states behave as expected

### Phase 5: Update prompts to be JSON-native (and more “plan aware”)

This phase ensures the agent sees the right context (from JSON) and knows how to mark completion.

- [x] 5.0 Update prompt templates to use JSON tracker semantics
  - [x] 5.1 Update `templates/PROMPT_build.md`:
    - Reference `prd.json` path explicitly
    - Instruct the agent to set `passes=true` for the selected story when complete
    - Include the story’s `acceptanceCriteria`, `verificationCommand`, and `files[]` (rendered to readable Markdown)
  - [x] 5.2 Keep `templates/PROMPT_plan.md`, but clarify its role:
    - It updates `.agents/autopilot/plan.md` as a technical breakdown *based on the JSON PRD stories*
  - [x] 5.3 Add/restore a “working memory” file (optional but recommended):
    - `.agents/autopilot/working.md` updated each iteration with what was tried + next attempt
  - [x] 5.4 Validation for 5.0: dry-run mode should render a prompt that includes:
    - story ID/title
    - acceptance criteria list
    - verification command (or explicit “manual verification required”)
    - file list (if present)

### Phase 6: Smooth migration and documentation polish

This phase makes adoption easy and prevents future regressions.

- [x] 6.0 Update docs + tests for migration and “magic”
  - [x] 6.1 Update `SKILL.md`:
    - Document JSON as the default PRD format
    - Keep legacy markdown path documented as fallback (with a deprecation note)
    - Add a short “How to run” quickstart that shows `setup.sh` → `run.sh build`
  - [x] 6.2 Update `tests/run-tests.sh` to include JSON checks (template presence + validator)
  - [x] 6.3 Add one behavioral regression test:
    - In markdown mode: ensure commented-out `### [ ] ...` examples are ignored (if markdown support remains)
    - In JSON mode: ensure `1.0` cannot collide with `11.0` (IDs must be exact)
  - [x] 6.4 Validation for 6.0: `bash tests/run-tests.sh` passes

## Context

**Key files:**
- `templates/run.sh`: loop orchestration (selection, attempts, blocked, done)
- `setup.sh`: creates `.agents/autopilot/` starter kit in a target repo
- `SKILL.md`: conversion rules and user-facing skill behavior
- `templates/PROMPT_build.md`: agent execution instructions
- `tests/run-tests.sh`: lightweight regression suite

## Open Questions

- Do you want `prd.md` to remain an editable artifact, or become a generated “view” of `prd.json`? (Current: `prd.md` is legacy fallback; not generated.)
- Should `verificationCommand` be a single string (simple) or a list of commands (more accurate but more complex)? (Current: single string.)

## Assumptions

- This is a personal tool, so adding a small runtime dependency is acceptable if it improves reliability (prefer Python-based JSON manipulation over brittle bash parsing).
- Plan docs follow the `$plan` skill conventions most of the time (phases + numbered tasks), but conversion will include basic fallbacks.

## Design Decisions

| Aspect | Decision |
| --- | --- |
| Autopilot vs Plan | Keep Autopilot separate; consume plan output for context |
| Tracker format | `prd.json` is canonical; `prd.md` is legacy or generated view |
| Selection model | Deterministic: `passes=false`, `blocked=false`, deps satisfied, lowest priority |
| Plan integration | Map plan subtasks → story criteria + file anchors + verification commands |
| Dependencies | Support explicit `dependsOn`; don’t over-infer automatically |
