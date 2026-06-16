# Meta Skill CLI Reference

This reference is for agents using Meta Skill from this repo or from an
installed plugin package. It describes the command surface, when to use each
command, and which files are authoritative.

## Launchers

Use one of these launchers:

- Repo checkout: `plugins/meta-skill/scripts/metaskill`
- Installed plugin package: `<plugin-root>/scripts/metaskill`

Do not assume a global `meta-skill` binary is on `PATH`.

Both launchers are self-bootstrapping:

- They create a per-user virtual environment under
  `${XDG_CACHE_HOME:-~/.cache}/meta-skill/venv` by default.
- They install or upgrade dependencies from
  `plugins/meta-skill/src/requirements.txt` before running.
- `META_SKILL_PYTHON`, `META_SKILL_CACHE_DIR`, and `META_SKILL_VENV` override
  interpreter and cache locations.
- `META_SKILL_SKIP_DEP_UPDATE=1` skips dependency updates and uses the existing
  environment.

## Output Rules

- `--json` makes stdout machine-readable.
- Human diagnostics and dependency-install noise may still go to stderr.
- Commands that produce durable results write them to the workbench and return
  the path in stdout or JSON.

## Authority Split

The CLI is an orchestration layer. The workbench is authoritative.

- `.meta-skill/evals.json` defines the suite, defaults, candidates, and tasks.
- `.meta-skill/cases/<task-id>/` owns authored task content: visible `task.md`,
  fixtures, hidden validators, hidden expected outputs, and judge guidance.
- `.meta-skill/runs/<run-id>/` owns run plans, progress, events, outputs, and
  grades.

Do not treat CLI stdout as the system of record once files have been written.

## Eval Vocabulary

Use Anthropic-aligned terms when explaining evals to users:

| Term | Current file/schema surface |
|---|---|
| **suite** | `.meta-skill/evals.json` plus its materialized workbench |
| **task** | one row in `cases[]` and one folder under `.meta-skill/cases/<task-id>/` |
| **candidate** | one row in `candidates[]`, such as `no-skill`, `current`, or an edited attempt |
| **trial** | one task executed once under one candidate |
| **transcript** | `events/<trial-id>.jsonl` plus compact `evidence/<trial-id>.json` |
| **outcome** | `candidates/<candidate>/<trial-id>/response.md` and produced artifacts |
| **grader** | model, human, or code rows in `grades.jsonl` |

When explaining evals to a user, prefer the product terms from this table:
suite, task, candidate, trial, transcript, outcome, and grader.

## Runner Policy

App Server is the only supported eval runner. `eval run --runner auto` resolves
to `codex_app_server`.

## Task Authoring Rules

- `task.md` is for the visible task only. Do not hide metadata in it.
- Put metadata in `.meta-skill/evals.json`, not in extra task-local metadata
  files.
- Do not add worker-local script surfaces under lane skills. Shared behavior
  belongs behind this CLI.

## Command Surface

Current top-level commands:

```sh
plugins/meta-skill/scripts/metaskill doctor [--json]
plugins/meta-skill/scripts/metaskill workbench init [--target <path>] [--dry-run] [--json]
plugins/meta-skill/scripts/metaskill eval lint [--suite .meta-skill/evals.json] [--json]
plugins/meta-skill/scripts/metaskill eval materialize [--suite .meta-skill/evals.json] [--force] [--json]
plugins/meta-skill/scripts/metaskill eval run [--suite .meta-skill/evals.json] [--runner auto|codex_app_server] [--candidates <ids>] [--split <name>] [--repetitions <n>] [--model <id>] [--json]
plugins/meta-skill/scripts/metaskill eval progress --run <run-id-or-path> [--watch] [--json]
plugins/meta-skill/scripts/metaskill eval grade --run <run-id-or-path> [--json]
plugins/meta-skill/scripts/metaskill eval human --run <run-id-or-path> [--trial <trial-id>] [--grader <id>] [--metric <name>] [--label <label>] [--score <0-to-1>] [--rationale <text>] [--json]
plugins/meta-skill/scripts/metaskill eval calibrate --run <run-id-or-path> [--metric <name>] [--json]
plugins/meta-skill/scripts/metaskill eval compare --run <run-id-or-path> [--baseline <candidate>] [--candidate <candidate>] [--json]
plugins/meta-skill/scripts/metaskill eval list [--suite .meta-skill/evals.json] [--json]
plugins/meta-skill/scripts/metaskill eval report --run <run-id-or-path> [--out <file>] [--json]
plugins/meta-skill/scripts/metaskill validate <skill-dir> [--json]
plugins/meta-skill/scripts/metaskill package <skill-dir> [--out-dir <dir>] [--json]
```

## Commands

### `doctor`

Use `doctor` before first use on a machine or when the runner environment looks
suspect.

What it checks:

- Python version
- CLI source and package validation module presence
- Legacy worker-local scripts are absent
- `openai_codex` SDK availability
- App Server SDK symbols needed by the primary runner

Output:

- Exit code `0` when primary App Server checks pass
- Exit code `1` when one or more primary checks fail
- JSON or human-readable check list

Example:

```sh
plugins/meta-skill/scripts/metaskill doctor --json
```

### `workbench init`

Use this once per target skill or project to create the standard workbench
layout.

What it does:

- Creates `.meta-skill/`
- Creates `.meta-skill/cases/` and `.meta-skill/runs/`
- Seeds `.meta-skill/evals.json` if it does not exist

Inputs:

- `--target <path>`: target repo or skill directory; defaults to the current
  directory
- `--dry-run`: report planned changes without writing them

Output:

- Reports the target, workbench path, and created files/directories

Example:

```sh
plugins/meta-skill/scripts/metaskill workbench init --target plugins/dots/skills/my-skill --json
```

### `eval materialize`

Use this after editing `.meta-skill/evals.json` or when a task directory has
not been created yet.

What it does:

- Reads the suite manifest from `--suite`
- Creates `.meta-skill/cases/<task-id>/`
- Writes the seeded task file for each task, usually `task.md`
- Creates parent directories for declared fixtures

Inputs:

- `--suite`: suite file; defaults to `.meta-skill/evals.json`
- `--force`: overwrite existing seeded task files

Output:

- A change list showing which task files were created, overwritten, or skipped

Notes:

- If a task uses a custom task path in the manifest, that file is materialized
  instead of `task.md`.
- The seeded task text is visible prompt content. Keep it free of hidden
  control metadata.

### `eval lint`

Use this before running a suite. It is a static manifest check, not a behavioral
grade.

What it does:

- Reads `cases[]` manifests and writer-facing `evals[]` prompt manifests
- Counts task types, grader kinds, human graders, and transcript-aware graders
- Warns on missing task seeds, missing graders, missing reference material for
  regression/gate tasks, unbalanced trigger suites, and incomplete grader
  metadata
- Prints grader-selection recommendations: code where exact, model where
  semantic, human where judgment or calibration is required

Example:

```sh
plugins/meta-skill/scripts/metaskill eval lint --suite .meta-skill/evals.json --json
```

### `eval run`

Use this to execute a suite or a selected slice of it.

What it does:

- Loads tasks and candidates from `.meta-skill/evals.json`
- Verifies each selected task already has a materialized task file
- Chooses the App Server runner
- Stages a workspace with only `task.md`, declared fixtures, and the
  candidate payload when present
- Creates a new run directory under `.meta-skill/runs/<run-id>/`
- Executes each task/candidate/trial combination
- Writes progress, events, and output artifact paths

Inputs:

- `--suite`: suite file; defaults to `.meta-skill/evals.json`
- `--runner`: `auto` or `codex_app_server`
- `--candidates <ids>`: restrict to selected candidates
- `--split <name>`: restrict to a manifest split
- `--repetitions <n>`: override task or suite repetition count
- `--model <id>`: pass a model override to the runner

Output:

- Summary with `run_id`, `run_dir`, runner, trial count, and pass/fail counts
- Exit code `0` when all trials pass
- Exit code `1` when one or more trials fail

Authoritative run files:

```text
.meta-skill/runs/<run-id>/
  run.json
  progress.jsonl
  results.jsonl
  grades.jsonl
  events/<trial-id>.jsonl
  events/<trial-id>.judge.jsonl
  evidence/<trial-id>.json
  candidates/<candidate>/<trial-id>/response.md
```

What each file is for:

- `run.json`: run plan, selected runner, candidates, and trial list
- `progress.jsonl`: queued/running/passed/failed status changes
- `results.jsonl`: per-trial summary, timestamps, output path, event path, and
  runner detail
- `grades.jsonl`: grader results after `eval grade`
- `events/*.jsonl`: raw runner transcript for a trial
- `events/*.judge.jsonl`: raw judge event stream when judge grading runs
- `evidence/*.json`: compact transcript/runtime evidence for a trial
- `response.md`: captured agent response for that candidate/trial

Workspaces are staged under
`.meta-skill/workspaces/<run-id>/<trial-id>/`. They are run-scoped
working directories for visible task bytes, listed fixtures, and the candidate
payload when present, not authoritative result artifacts.

Hidden task files stay grader-side. `judge.md`, `expected.*`, `validate.*`,
grader prompts, and human labels are never copied into the workspace.

### `eval progress`

Use this to inspect a run without reopening all result files manually.

What it does:

- Reads `run.json`, `progress.jsonl`, `results.jsonl`, and `grades.jsonl`
- Summarizes per-status counts and how many results and grades exist

Inputs:

- `--run <run-id-or-path>`: either a run id under `.meta-skill/runs/` or a full
  run directory path
- `--watch`: refresh until all trials reach a terminal state

Output:

- Current progress counts
- Result count
- Grade count
- Trial count

### `eval grade`

Use this after `eval run` when the tasks include deterministic validators,
judge guidance, or both.

What it does:

- Reads `results.jsonl` from the selected run
- Reads optional `graders[]` and `expectations[]` from `evals.json`
- Looks for `judge.md` inside each task directory and, when present, records a
  model judge grade through App Server
- Looks for `validate.*` files inside each task directory
- Runs each validator with `--output`, `--events`, and `--json`
- Optionally passes `--expected <file>` when an `expected.*` file exists
- Writes or updates `.meta-skill/runs/<run-id>/grades.jsonl`

Inputs:

- `--run <run-id-or-path>`

Output:

- Grade summary and `grades_path`

Notes:

- If a task has neither `judge.md` nor `validate.*`, the run is marked
  ungraded for that task and the rationale points the reader to `judge.md` for
  human or judge grading.
- Implicit discovery keeps old suites working. Explicit `graders[]` entries
  preserve named `id`, `metric`, `required`, and `gate` semantics in
  `grades.jsonl`.
- `expectations[]` are hidden model-judge checks. They are never staged into the
  workspace.
- Validators and task-local judge guidance are the supported grading hooks. Do not add
  worker-local grading wrappers outside the task directory.
- Judge grading writes judge events to
  `.meta-skill/runs/<run-id>/events/<trial-id>.judge.jsonl` and records model
  evidence in `grades.jsonl`.

### `eval human`

Use this when a run contains declared human graders or when a model/code grade
needs human calibration.

Packet mode:

```sh
plugins/meta-skill/scripts/metaskill eval human --run <run-dir> --trial <trial-id> --json
```

What it returns:

- response path
- event and compact evidence paths
- existing human grade rows for the trial
- short review guidance

Record mode:

```sh
plugins/meta-skill/scripts/metaskill eval human \
  --run <run-dir> \
  --trial <trial-id> \
  --grader rishi \
  --metric usefulness \
  --label partial \
  --score 0.5 \
  --rationale "Usable, but misses the approval boundary." \
  --json
```

Labels are `pass`, `partial`, `fail`, `unknown`, or `needs_human_review`.
Scores are optional and must be between 0 and 1. The command writes or replaces
the matching human row in `grades.jsonl`.

### `eval calibrate`

Use this after human and model grades exist for the same run. It compares model
judge grades with human grades and records whether the judge is calibrated well
enough to scale beyond the human spot-check slice.

What it does:

- Reads paired human and model grade rows from `.meta-skill/runs/<run-id>/grades.jsonl`
- Optionally restricts comparison to one shared metric
- Computes exact agreement, tolerance agreement, false pass/fail examples,
  human escalation rate, and non-binary examples
- Writes a calibration artifact under `.meta-skill/calibrations/`

Inputs:

- `--run <run-id-or-path>`: either a run id under `.meta-skill/runs/` or a full
  run directory path
- `--metric <name>`: restrict calibration to one shared grade metric

Output:

- Calibration summary and `calibration_path`

Example:

```sh
plugins/meta-skill/scripts/metaskill eval calibrate --run <run-dir> --metric usefulness --json
```

### `eval compare`

Use this after grading a run with a no-skill candidate and at least one payload
candidate.

What it does:

- Reads the deterministic report model
- Filters impact rows by `--baseline` and `--candidate` when supplied
- Returns per-task impact plus a recommendation such as
  `promote_for_measured_scope`, `promising_with_failures`,
  `reject_or_revise`, `no_skill_lift_detected`, or `needs_more_evidence`

Example:

```sh
plugins/meta-skill/scripts/metaskill eval compare --run <run-dir> --baseline no-skill --candidate current --json
```

### `eval list`

Use this to enumerate the runs in a workbench without listing run directories
by hand.

What it does:

- Finds every `runs/<run-id>/run.json` in the suite's workbench
- Summarizes each run: run id, created time, runner, trial counts by result
  status, grade count, and candidates

Inputs:

- `--suite`: suite file used to locate the workbench; defaults to
  `.meta-skill/evals.json`

Output:

- One row per run, ordered by run directory name
- A run with an unreadable `run.json` is reported with an `error` field instead
  of failing the whole listing

### `eval report`

Use this after `eval run` and `eval grade` to read one run without manual file
archaeology. The report is read-only and deterministic: it renders what the run
files already contain and never re-runs or re-grades anything.

What it renders:

- Header: run id, suite, runner, creation time, and candidate sources with
  commit, dirty flag, and payload digest
- Runner completion: per-trial process status. Completion means the trial
  process finished; it says nothing about answer quality.
- Behavioral grades: judge score/label, validator pass counts, graded/ungraded
  flags, gate failures, and token usage (`unavailable` when the runner recorded
  none)
- Impact: when a run contains a no-skill candidate and at least one payload
  candidate, per-task categories show `candidate_improves`,
  `candidate_regresses`, `both_fail`, `baseline_already_succeeds`, or
  `needs_human_review`
- Evidence pointers relative to the run directory: outcome, runner transcripts,
  judge events, and folded thread evidence; `-` marks a missing file
- A needs-attention list: failed trials, planned trials with no result,
  ungraded trials, gate failures, graders that emitted invalid JSON,
  `needs_human_review` trials, and missing token usage

Inputs:

- `--run <run-id-or-path>`
- `--out <file>`: write the Markdown report to a caller-named file, for example
  `.meta-skill/runs/<run-id>/report.md`
- `--json`: emit the structured report instead of Markdown

Output:

- Markdown to stdout by default
- With `--out`, the report file plus a confirmation that includes the path
- With `--json` and no `--out`, the full structured report

### `validate`

Use this for deterministic validation of a skill payload before review,
packaging, or sync.

What it checks:

- `SKILL.md` exists
- Frontmatter parses
- Required fields such as `name` and `description` exist
- Unknown frontmatter keys are flagged
- File length stays within the current limit
- Body content exists
- Authoring lint checks from the canonical shared validator path

Inputs:

- `<skill-dir>`: skill directory or direct path to `SKILL.md`

Output:

- JSON or human-readable validation report with per-check results and a pass
  rate

Notes:

- `validate` combines the package validation and authoring lint modules.
- The command exits non-zero when the combined report contains failures.

### `package`

Use this when you need a packaged skill payload emitted to an output directory.
Packaging validates first and stops if validation fails.

Inputs:

- `<skill-dir>`: skill directory or direct path to `SKILL.md`
- `--out-dir <dir>`: destination directory for packaged output

Output:

- Zip artifact path and sidecar package metadata JSON path, optionally in JSON

## Common Flows

### First-time setup for a target

```sh
plugins/meta-skill/scripts/metaskill doctor --json
plugins/meta-skill/scripts/metaskill workbench init --target <target> --json
```

### Add or refresh tasks from the suite

```sh
plugins/meta-skill/scripts/metaskill eval lint --suite .meta-skill/evals.json --json
plugins/meta-skill/scripts/metaskill eval materialize --json
```

Then edit the generated task `task.md` files and any validators or fixtures.

### Run and inspect a suite

```sh
plugins/meta-skill/scripts/metaskill eval run --json
plugins/meta-skill/scripts/metaskill eval progress --run <run-id> --watch --json
plugins/meta-skill/scripts/metaskill eval grade --run <run-id> --json
plugins/meta-skill/scripts/metaskill eval human --run <run-id> --json
plugins/meta-skill/scripts/metaskill eval calibrate --run <run-id> --json
plugins/meta-skill/scripts/metaskill eval compare --run <run-id> --baseline no-skill --candidate current --json
plugins/meta-skill/scripts/metaskill eval report --run <run-id>
```

Use `eval list --json` to find earlier run ids in the same workbench.

### Validate a skill payload

```sh
plugins/meta-skill/scripts/metaskill validate <skill-dir> --json
```

### Dogfood the skill lifecycle

Use this flow before claiming the full lifecycle works. Run it in an isolated
worktree and use the installed plugin launcher, not only source files.

```sh
PLUGIN=<plugin-cache-root>/agent/meta-skill/0.1.0
CLI="$PLUGIN/scripts/metaskill"

git worktree add --detach /tmp/meta-skill-e2e HEAD
cd /tmp/meta-skill-e2e

# Create two target project folders outside source payloads:
# quick-skill/skill and hefty-skill/skill.
"$CLI" workbench init --target quick-skill --json
"$CLI" workbench init --target hefty-skill --json
"$CLI" validate quick-skill/skill --json
"$CLI" validate hefty-skill/skill --json
"$CLI" package quick-skill/skill --out-dir quick-skill/.meta-skill/dist --json
"$CLI" package hefty-skill/skill --out-dir hefty-skill/.meta-skill/dist --json

# Author .meta-skill/evals.json, task.md, judge.md, and validate.* tasks.
"$CLI" eval materialize --suite quick-skill/.meta-skill/evals.json --json
"$CLI" eval run --suite quick-skill/.meta-skill/evals.json --runner codex_app_server --json
"$CLI" eval grade --run <quick-run-dir> --json
"$CLI" eval progress --run <quick-run-dir> --json
"$CLI" eval report --run <quick-run-dir> --out <quick-run-dir>/report.md
```

The dogfood report should include two skill ideas, review evidence, eval run
directories, model and deterministic grade summaries, feedback, the revised
candidate change, and any comparison artifact. Use `eval report` for the
per-run summaries instead of hand-authoring them.

## Boundaries

- Prefer the CLI over calling helper code under `plugins/meta-skill/src/` directly.
- Use App Server as the eval runner.
- Keep task text visible and literal; no hidden task metadata.
- Keep shared behavior at the plugin CLI layer; do not recreate worker-local
  script surfaces.
