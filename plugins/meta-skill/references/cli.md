# Meta Skill CLI Reference

This reference is for agents using Meta Skill from this repo or from an
installed plugin package. It describes the command surface, when to use each
command, and which files are authoritative.

## Launcher

The launcher is `<meta-skill-root>/scripts/metaskill`, where `<meta-skill-root>`
is the Meta-Skill plugin root in the current checkout or installed plugin
package. Do not assume a global `meta-skill` binary is on `PATH`.

The launcher is self-bootstrapping:

- It creates a per-user virtual environment under
  `${XDG_CACHE_HOME:-~/.cache}/meta-skill/venv` by default.
- It installs dependencies from `<meta-skill-root>/src/requirements.txt` when
  they change (a checksum stamp skips reinstalls on later runs).
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

- `.<skill-name>/AGENTS.md` explains how agents should use the hidden folder and
  records skill-specific invariants or update guidance.
- `.<skill-name>/docs/` stores durable specs, roadmap files, decisions, review
  context, and research.
- `.<skill-name>/evals.json` defines the suite, defaults, candidates, and tasks.
- `.<skill-name>/cases/<task-id>/` owns authored task content: visible `task.md`,
  fixtures, hidden validators, hidden expected outputs, and judge guidance.
- `.<skill-name>/presets/<preset-name>.json` owns recurring eval presets: saved
  task selection, candidate policy, repetitions, metrics, gates, and report
  policy over a stable task bank.
- `.<skill-name>/runs/<run-id>/` owns run plans, progress, results, grades,
  the run input snapshot, candidate snapshots, and per-trial artifacts.

Do not treat CLI stdout as the system of record once files have been written.

The default workbench folder is named after the target skill: `.<skill-name>/`.
For a project root with `skill/SKILL.md`, the name comes from that payload's
frontmatter. For the Meta-Skill plugin itself, the resolved folder is
`.meta-skill/`.

## Eval Vocabulary

Use Anthropic-aligned terms when explaining evals to users:

| Term | Current file/schema surface |
|---|---|
| **suite** | `.<skill-name>/evals.json` plus its materialized workbench |
| **task** | one row in `cases[]` and one folder under `.<skill-name>/cases/<task-id>/` |
| **candidate** | one row in `candidates[]`, such as `no-skill`, `current`, or an edited attempt |
| **trial** | one task executed once under one candidate |
| **transcript** | `runs/<run-id>/trials/<trial-id>/events.jsonl` plus compact `runs/<run-id>/trials/<trial-id>/evidence.json` |
| **outcome** | `runs/<run-id>/trials/<trial-id>/response.md` and produced artifacts |
| **grader** | model, human, or code rows in `grades.jsonl` |

When explaining evals to a user, prefer the product terms from this table:
suite, task, candidate, trial, transcript, outcome, and grader.

## Runner Policy

Codex App Server is the only supported eval runner.

## Task Authoring Rules

- `task.md` is for the visible task only. Do not hide metadata in it.
- Put metadata in `.<skill-name>/evals.json`, not in extra task-local metadata
  files.
- Do not add worker-local script surfaces under lane skills. Shared behavior
  belongs behind this CLI.

## Command Surface

Current top-level commands:

```sh
<meta-skill-root>/scripts/metaskill doctor [--json]
<meta-skill-root>/scripts/metaskill workbench init [--target <path>] [--dry-run] [--json]
<meta-skill-root>/scripts/metaskill sessions list [--limit <n>] [--archived active|archived|all] [--days <n>] [--query <text>] [--cwd <path>] [--json]
<meta-skill-root>/scripts/metaskill sessions show <thread-id> [--max-chars <n>] [--json]
<meta-skill-root>/scripts/metaskill sessions extract <thread-id> [--target <skill-dir>] [--max-chars <n>] [--out <file>] [--json]
<meta-skill-root>/scripts/metaskill eval lint [--suite <suite>] [--preset <name-or-path>] [--json]
<meta-skill-root>/scripts/metaskill eval materialize [--suite <suite>] [--force] [--json]
<meta-skill-root>/scripts/metaskill eval run [--suite <suite>] [--candidates <ids>] [--split <name>] [--case <id>] [--type <type>] [--repetitions <n>] [--preset <name-or-path>] [--model <id>] [--no-grade] [--json]
<meta-skill-root>/scripts/metaskill eval progress --run <run-id-or-path> [--watch] [--json]
<meta-skill-root>/scripts/metaskill eval grade --run <run-id-or-path> [--json]
<meta-skill-root>/scripts/metaskill eval human --run <run-id-or-path> [--trial <trial-id>] [--grader <id>] [--reviewer <name>] [--metric <name>] [--label <label>] [--score <0-to-1>] [--rationale <text>] [--json]
<meta-skill-root>/scripts/metaskill eval calibrate --run <run-id-or-path> [--metric <name>] [--json]
<meta-skill-root>/scripts/metaskill eval list [--suite <suite>] [--preset <name-or-path>] [--json]
<meta-skill-root>/scripts/metaskill eval report --run <run-id-or-path> [--preset <path>] [--out <file>] [--json]
<meta-skill-root>/scripts/metaskill validate <skill-dir> [--json]
<meta-skill-root>/scripts/metaskill package <skill-dir> [--out-dir <dir>] [--json]
```

`--case` and `--type` accept a repeatable flag or a comma-separated list.

## Commands

### `doctor`

Use before first use on a machine or when the runner environment looks
suspect.

Checks: `python_version`, `cli_source`, `validators_canonical`,
`openai_codex_sdk`, `codex_app_server_sdk`.

Exit codes: `0` when primary App Server checks pass, `1` when one or more
primary checks fail.

```sh
<meta-skill-root>/scripts/metaskill doctor --json
```

### `workbench init`

Use once per target skill or project to create the standard hidden workbench
and nested agent guidance.

Flags: `--target <path>` (defaults to the current directory), `--dry-run`
(report planned changes without writing them).

Writes: `.<skill-name>/`, seeding `.<skill-name>/AGENTS.md` if missing. Does
not create empty folders or starter eval files.

```sh
<meta-skill-root>/scripts/metaskill workbench init --target <skill-dir> --json
```

### `sessions list`

Use to locate prior Codex thread evidence.

Reads `~/.codex/state_5.sqlite`, the authoritative local Codex session index.

Flags: `--limit <n>` (default `25`), `--archived active|archived|all` (default
`active`), `--days <n>`, `--query <text>`, `--cwd <path>`.

Output: Markdown table by default, or `{ threads[] }` with `--json`.

```sh
<meta-skill-root>/scripts/metaskill sessions list --limit 25 --archived all --query "skill doctor" --json
```

### `sessions show`

Use after `sessions list` to render one Codex thread as readable evidence.

Flags: `<thread-id>` (exact id or unique prefix), `--max-chars <n>` (default
`12000`).

Output: Markdown transcript by default, or thread metadata plus transcript
with `--json`.

```sh
<meta-skill-root>/scripts/metaskill sessions show 019ed74b-e8d8 --max-chars 12000
```

### `sessions extract`

Use after `sessions list` or `sessions show` to build a read-only
thread-to-skill improvement handoff. It does not grade the thread or edit
source.

Flags: `<thread-id>`, `--target <skill-dir>` (target skill directory or
`SKILL.md`), `--max-chars <n>` (default `12000`), `--out <file>`.

Output: Markdown handoff by default, or `{ packet.extracted_handoff,
handoff_markdown }` with `--json`.

```sh
<meta-skill-root>/scripts/metaskill sessions extract 019ed74b-e8d8 --target plugins/dots/skills/ideate
```

### `eval materialize`

Use after editing `.<skill-name>/evals.json` or when a task directory has not
been created yet.

Flags: `--suite` (defaults to the current target's `.<skill-name>/evals.json`),
`--force` (overwrite existing materialized task files).

Writes: `.<skill-name>/cases/<task-id>/` with the default visible task stub
(usually `task.md`) and parent directories for declared fixtures. A task using
a custom task path materializes that file instead. Keep materialized task
files free of hidden control metadata.

### `eval lint`

Use before running a suite. This is a static manifest check, not a behavioral
grade.

Reads `cases[]`; warns on missing task sources, missing graders, missing
reference material for regression/gate tasks, unbalanced trigger suites, and
incomplete grader metadata.

Pass `--preset <name-or-path>` to also lint a preset (task selection,
candidate policy, gates, integrity, and report policy). A bare name resolves
to `.<skill-name>/presets/<name>.json`; a path is used directly. Preset
linting warns on unknown cases/candidates, no selected cases, one-sided
trigger presets, selected tasks without graders, release presets without
gates, and missing unknown-rate tracking.

```sh
<meta-skill-root>/scripts/metaskill eval lint --suite .<skill-name>/evals.json --json
<meta-skill-root>/scripts/metaskill eval lint --preset release --json
```

### `eval run`

Use to execute a suite or a selected slice of it. Runs trials **and grades
them by default**; pass `--no-grade` to skip grading for runtime-only
debugging.

Flags: `--suite` (defaults to `.<skill-name>/evals.json`), `--candidates
<ids>`, `--split <name>`, `--case <id>` (repeatable/comma-sep), `--type
<type>` (repeatable/comma-sep), `--repetitions <n>`, `--preset
<name-or-path>`, `--model <id>`, `--no-grade`.

What it does: loads tasks and candidates, verifies each selected task already
has a materialized task file, freezes the suite and each candidate's source
payload into `inputs/` (the run input snapshot), stages a trial workspace
with only `task.md`, declared fixtures, and the candidate payload when
present, executes each task/candidate/trial combination through Codex App
Server, then grades (unless `--no-grade`).

Pass `--preset <name-or-path>` to run the task and candidate slice selected by
a saved preset instead of `--suite`/`--candidates`/`--case`/`--type`. A bare
name resolves to `.<skill-name>/presets/<name>.json`; a path is used
directly. Preflight-lints the preset first and hard-fails on unknown
cases/candidates or no selection. Selects cases by `case_ids`, `types`,
and/or `split`; selects candidates from the preset baseline and payload list;
applies repetition overrides; records `preset_id` and `preset_path` in
`run.json`.

Output: summary with `run_id`, `run_dir`, trial count, and pass/fail counts.
Exit `0` when all trials pass, `1` when one or more trials fail.

```sh
<meta-skill-root>/scripts/metaskill eval run --preset release --json
```

Run layout — the only layout that exists:

```text
.<skill-name>/runs/<run-id>/
  run.json                        # run plan: selected cases/candidates, runner config, planned trials
  progress.jsonl                  # queued/running/terminal status events
  results.jsonl                   # one row per executed trial (status, paths, usage, timing)
  grades.jsonl                    # grader rows; each grading pass appends a new grade generation
  summary.json                    # aggregate verdicts; rebuilt by grading and report commands
  inputs/                         # run input snapshot: everything the run consumed, frozen
    suite.json                    # frozen suite copy
    cases/<case-id>/              # task.md, expectations.json, judge.md, expected.*, validate.*
    candidates/<candidate>/       # frozen copy of the candidate source payload (+ snapshot.json)
  trials/<trial-id>/
    workspace/                    # staged working dir: task.md, fixtures/, skill/ payload
    events.jsonl                  # raw runner transcript
    evidence.json                 # compact runtime/transcript evidence
    response.md                   # captured final agent response
    judge-<generation-id>.jsonl   # raw judge event stream, one per grading generation
```

Trial id format: `<case-id>.<candidate>.t<n>`.

What each file is for:

- `run.json`: run plan, candidates, and trial list
- `progress.jsonl`: queued/running/terminal status changes
- `results.jsonl`: per-trial summary, timestamps, and artifact paths
- `grades.jsonl`: grader results; each grading generation appends new rows,
  latest per trial/metric/grader wins
- `summary.json`: aggregate verdicts rebuilt by grading and report commands
- `inputs/`: the run input snapshot — everything the run consumed, frozen. The
  frozen suite copy the run graded against, including hidden grader files
  (`judge.md`, `expected.*`, `validate.*`) under `inputs/cases/<case-id>/`,
  plus each candidate's frozen source payload under
  `inputs/candidates/<candidate>/`
- `trials/<trial-id>/workspace/`: the run-scoped staged working directory for
  visible task bytes, listed fixtures, and the candidate payload when present;
  not an authoritative result artifact
- `trials/<trial-id>/events.jsonl`: raw runner transcript for that trial
- `trials/<trial-id>/evidence.json`: compact transcript/runtime evidence
- `trials/<trial-id>/response.md`: captured agent response for that trial
- `trials/<trial-id>/judge-<generation-id>.jsonl`: raw judge event stream for
  one grading generation

Hidden task files (`judge.md`, `expected.*`, `validate.*`) live under
`inputs/cases/<case-id>/` and are never staged into the workspace.

### `eval progress`

Use to inspect a run without reopening all result files manually.

Flags: `--run <run-id-or-path>`, `--watch` (refresh until all trials reach a
terminal state).

Reads `run.json`, `progress.jsonl`, `results.jsonl`, and `grades.jsonl`.
Output: per-status counts, result count, grade count, trial count.

### `eval grade`

Use to **re-grade** a run after adding or changing graders. `eval run` already
grades by default, so this is not a required post-run step — reach for it when
`judge.md`, `expectations[]`, or `validate.*` change and you need fresh grades
without re-running trials.

Flags: `--run <run-id-or-path>`.

What it does: reads `results.jsonl`, reads optional `graders[]` and
`expectations[]` from `evals.json`, looks for `judge.md` inside each frozen
`inputs/cases/<case-id>/` and records a model judge grade through App
Server when present, looks for `validate.*` and runs each validator with
`--output`, `--events`, and `--json` (plus `--expected` when an `expected.*`
file exists), then appends a new grade generation to
`.<skill-name>/runs/<run-id>/grades.jsonl`.

Notes:

- If a task has neither `judge.md` nor `validate.*`, the run is marked
  ungraded for that task.
- Explicit `graders[]` entries preserve named `id`, `metric`, `required`, and
  `gate` semantics in `grades.jsonl`.
- `expectations[]` are hidden model-judge checks; never staged into the
  workspace.
- Judge grading writes judge events to
  `.<skill-name>/runs/<run-id>/trials/<trial-id>/judge-<generation-id>.jsonl`.

### `eval human`

Use when a run contains declared human graders or when a model/code grade
needs human calibration.

Packet mode:

```sh
<meta-skill-root>/scripts/metaskill eval human --run <run-dir> --trial <trial-id> --json
```

Returns: response path, event and compact evidence paths, existing human grade
rows for the trial, short review guidance.

Record mode:

```sh
<meta-skill-root>/scripts/metaskill eval human \
  --run <run-dir> \
  --trial <trial-id> \
  --grader human-reviewer \
  --reviewer <name> \
  --metric usefulness \
  --label partial \
  --score 0.5 \
  --rationale "Usable, but misses the approval boundary." \
  --json
```

Labels are `pass`, `partial`, `fail`, or `unknown`. Scores are optional and
must be between 0 and 1. `--reviewer <name>` attributes the recorded grade.
Writes or replaces the matching human row in `grades.jsonl`.

### `eval calibrate`

Use after human and model grades exist for the same run. Compares model judge
grades with human grades and records whether the judge is calibrated well
enough to scale beyond the human spot-check slice.

Flags: `--run <run-id-or-path>`, `--metric <name>` (restrict to one shared
metric).

Reads paired human/model rows from `grades.jsonl`; computes TPR, TNR, exact
agreement, tolerance agreement, false pass/fail examples, unknown-label rates,
and non-binary examples. Writes a calibration artifact under
`.<skill-name>/calibrations/`.

```sh
<meta-skill-root>/scripts/metaskill eval calibrate --run <run-dir> --metric usefulness --json
```

### `eval list`

Use to enumerate the runs in a workbench without listing run directories by
hand.

Flags: `--suite` (defaults to the current target's `.<skill-name>/evals.json`),
`--preset <name-or-path>` (filter to runs whose `run.json` records this
preset's id or path).

Finds every `runs/<run-id>/run.json` in the suite's workbench; summarizes run
id, created time, trial counts by result status, grade count, and candidates.
A run with an unreadable `run.json` is reported with an `error` field instead
of failing the whole listing.

```sh
<meta-skill-root>/scripts/metaskill eval list --preset release --json
```

### `eval report`

Use after `eval run` (which already grades) to read one run without manual
file archaeology. The report is read-only and deterministic: it renders what
the run files already contain and never re-runs or re-grades anything.

Flags: `--run <run-id-or-path>`, `--preset <path>`, `--out <file>`, `--json`.

Renders: header (run id, suite, creation time, candidate sources with commit,
dirty flag, and payload digest); runner completion per trial; behavioral
grades (judge score/label, validator pass counts, graded/ungraded flags, gate
failures, token usage); baseline/candidate comparison rows when applicable;
evidence pointers relative to the run directory; a needs-attention list
(failed trials, planned trials with no result, ungraded trials, gate failures,
invalid-JSON graders, `unknown_evidence` trials, missing token usage).

When the run has a `preset_path` (or `--preset` overrides it), renders the
preset scorecard instead: preset decision, preset path, suite path, run id,
candidates; the metric families requested by the preset (behavior rates,
unknown rate, `profile_gate_failures`/`profile_gate_unknown`, comparison
counts, token usage); matching history rows when `report.include_history` is
true; calibration artifacts when present; needs-attention rows; coverage
limits and non-claims. `--preset <path>` is optional when `run.json` already
records the preset.

Output: Markdown to stdout by default; with `--out`, the report file plus a
confirmation; with `--json` and no `--out`, the full structured report.

```sh
<meta-skill-root>/scripts/metaskill eval report --run <run-dir> --preset .<skill-name>/presets/release.json
```

### `validate`

Use for validation of a skill payload before review, packaging, or sync.

Flags: `<skill-dir>` (skill directory or direct path to `SKILL.md`).

Checks: `SKILL.md` exists, frontmatter parses, required fields exist, unknown
frontmatter keys are flagged, file length stays within the current limit, body
content exists, and authoring lint checks from the canonical shared validator
path.

Output: JSON or human-readable report with per-check results and a pass rate.
`validate` combines the package validation and authoring lint modules. Exits
non-zero when the combined report contains failures.

### `package`

Use when a packaged skill payload should be emitted to an output directory.
Packaging validates first and stops if validation fails.

Flags: `<skill-dir>`, `--out-dir <dir>`.

Output: zip artifact path and sidecar package metadata JSON path, optionally
in JSON.

## Common Flows

### First-time setup for a target

```sh
<meta-skill-root>/scripts/metaskill doctor --json
<meta-skill-root>/scripts/metaskill workbench init --target <target> --json
```

### Add or refresh tasks from the suite

```sh
<meta-skill-root>/scripts/metaskill eval lint --json
<meta-skill-root>/scripts/metaskill eval materialize --json
```

Then edit the generated task `task.md` files and any validators or fixtures.

### Run and inspect a suite

```sh
<meta-skill-root>/scripts/metaskill eval run --json
<meta-skill-root>/scripts/metaskill eval progress --run <run-id> --watch --json
<meta-skill-root>/scripts/metaskill eval human --run <run-id> --json
<meta-skill-root>/scripts/metaskill eval calibrate --run <run-id> --json
<meta-skill-root>/scripts/metaskill eval report --run <run-id>
```

`eval run` already grades by default. Use `eval grade --run <run-id>` only to
re-grade after adding or changing graders. Use `eval list --json` to find
earlier run ids in the same workbench.

### Validate a skill payload

```sh
<meta-skill-root>/scripts/metaskill validate <skill-dir> --json
```

### Dogfood the skill lifecycle

Use this flow before claiming the full lifecycle works. Run it in an isolated
worktree and use the installed plugin launcher, not only source files.

```sh
PLUGIN=<plugin-cache-root>/agent/meta-skill/<version>
CLI="$PLUGIN/scripts/metaskill"

git worktree add --detach /tmp/meta-skill-e2e HEAD
cd /tmp/meta-skill-e2e

# Create two target project folders outside source payloads:
# quick-skill/skill and hefty-skill/skill.
"$CLI" workbench init --target quick-skill --json
"$CLI" workbench init --target hefty-skill --json
"$CLI" validate quick-skill/skill --json
"$CLI" validate hefty-skill/skill --json
"$CLI" package quick-skill/skill --json
"$CLI" package hefty-skill/skill --json

# Author each target's .<skill-name>/evals.json, task.md, judge.md, and validate.* tasks.
"$CLI" eval materialize --suite quick-skill/.<quick-skill-name>/evals.json --json
"$CLI" eval run --suite quick-skill/.<quick-skill-name>/evals.json --json
"$CLI" eval progress --run <quick-run-dir> --json
"$CLI" eval report --run <quick-run-dir> --out <quick-run-dir>/report.md
```

The dogfood report should include two skill ideas, review evidence, eval run
directories, model and deterministic grade summaries, feedback, the revised
candidate change, and any comparison artifact. Use `eval report` for the
per-run summaries instead of hand-authoring them.

## Boundaries

- Prefer the CLI over calling helper code under `<meta-skill-root>/src/` directly.
- Use Codex App Server as the eval runner.
- Keep task text visible and literal; no hidden task metadata.
- Keep shared behavior at the plugin CLI layer; do not recreate worker-local
  script surfaces.
