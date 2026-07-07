# Meta Skill CLI Reference

This reference is for agents using Meta Skill from this repo or from an
installed plugin package. It describes the command surface, when to use each
command, and which files are authoritative.

## Launcher

The launcher is `<meta-skill-root>/scripts/metaskill`, where `<meta-skill-root>`
is the Meta-Skill plugin root in the current checkout or installed plugin
package. Do not assume a global `meta-skill` binary is on `PATH`.

The launcher is self-bootstrapping: it creates a per-user virtual environment
under `${XDG_CACHE_HOME:-~/.cache}/meta-skill/venv` by default and installs
dependencies from `<meta-skill-root>/src/requirements.txt` when they change (a
checksum stamp skips reinstalls). `META_SKILL_PYTHON`, `META_SKILL_CACHE_DIR`,
and `META_SKILL_VENV` override interpreter and cache locations;
`META_SKILL_SKIP_DEP_UPDATE=1` skips dependency updates and uses the existing
environment.

## Output Rules

- `--json` makes stdout machine-readable.
- Human diagnostics and dependency-install noise may still go to stderr.
- Commands that produce durable results write them to the workbench and return
  the path in stdout or JSON.

## Authority Split

The CLI is an orchestration layer. The workbench is authoritative:
`.<skill-name>/AGENTS.md` explains hidden-folder use and skill-specific
invariants; `.<skill-name>/docs/` stores durable specs, decisions, and
research; `.<skill-name>/evals.json` defines the suite, defaults, candidates,
and tasks; `.<skill-name>/cases/<task-id>/` owns authored task content
(visible `task.md`, fixtures, hidden validators, expected outputs, judge
guidance); `.<skill-name>/presets/<preset-name>.json` owns recurring eval
presets (task selection, candidate policy, repetitions, metrics, gates, report
policy); `.<skill-name>/runs/<run-id>/` owns run plans, progress, results,
grades, and per-trial artifacts (see [run-layout.md](run-layout.md)). Do not
treat CLI stdout as the system of record once files have been written.

The default workbench folder is named after the target skill: `.<skill-name>/`.
For a project root with `skill/SKILL.md`, the name comes from that payload's
frontmatter. For the Meta-Skill plugin itself, the resolved folder is
`.meta-skill/`.

## Eval Vocabulary

Use [eval-vocabulary.md](eval-vocabulary.md) for suite/task/candidate/trial
terms, schema field rules, recognized task types, and the grade label scale.

## Runner Policy

Codex App Server is the only supported eval runner.

## Task Authoring Rules

- `task.md` is for the visible task only. Do not hide metadata in it.
- Put metadata in `.<skill-name>/evals.json`, not in extra task-local metadata
  files.
- Do not add worker-local script surfaces under lane skills. Shared behavior
  belongs behind this CLI.

## Command Surface

The block below is generated from the argument parser by
`metaskill docs emit-cli --write` and checked in verify; edit the parser, not
this block.

<!-- BEGIN GENERATED: cli-surface (metaskill docs emit-cli --write) -->
```sh
<meta-skill-root>/scripts/metaskill doctor [--json]
<meta-skill-root>/scripts/metaskill init <target> [--dry-run] [--json]
<meta-skill-root>/scripts/metaskill status <target> [--json]
<meta-skill-root>/scripts/metaskill case new <case-id> [--suite <suite>] [--json]
<meta-skill-root>/scripts/metaskill sessions list [--limit <limit>] [--archived active|archived|all] [--days <days>] [--query <query>] [--cwd <cwd>] [--json]
<meta-skill-root>/scripts/metaskill sessions show <thread-id> [--max-chars <max-chars>] [--json]
<meta-skill-root>/scripts/metaskill sessions extract <thread-id> [--target <target>] [--max-chars <max-chars>] [--out <out>] [--json]
<meta-skill-root>/scripts/metaskill eval run [--suite <suite>] [--candidates <candidates>] [--split <split>] [--case <case>] [--type <type>] [--repetitions <repetitions>] [--preset <preset>] [--model <model>] [--parallel <parallel>] [--adhoc] [--task <task>] [--skill <skill>] [--no-grade] [--check] [--json]
<meta-skill-root>/scripts/metaskill eval progress --run <run> [--watch] [--json]
<meta-skill-root>/scripts/metaskill eval grade --run <run> [--parallel <parallel>] [--json]
<meta-skill-root>/scripts/metaskill eval review [--suite <suite>] [--run <run>] [--port <port>] [--open]
<meta-skill-root>/scripts/metaskill eval calibrate --run <run> [--metric <metric>] [--json]
<meta-skill-root>/scripts/metaskill eval human --run <run> [--trial <trial>] [--grader <grader>] [--metric <metric>] [--label pass|partial|fail|unknown] [--score <score>] [--rationale <rationale>] [--reviewer <reviewer>] [--json]
<meta-skill-root>/scripts/metaskill eval list [--suite <suite>] [--preset <preset>] [--json]
<meta-skill-root>/scripts/metaskill eval report --run <run> [--preset <preset>] [--out <out>] [--json]
<meta-skill-root>/scripts/metaskill eval verify-run --run <run> [--json]
<meta-skill-root>/scripts/metaskill docs emit-cli [--write] [--check] [--json]
<meta-skill-root>/scripts/metaskill docs lint [--json]
<meta-skill-root>/scripts/metaskill validate <skill-dir> [--json]
<meta-skill-root>/scripts/metaskill package <skill-dir> [--out-dir <out-dir>] [--json]
```
<!-- END GENERATED: cli-surface -->

`--case` and `--type` accept a repeatable flag or a comma-separated list.

## Commands

### `doctor`

Use before first use on a machine or when the runner environment looks
suspect. Checks: `python_version`, `cli_source`, `validators_canonical`,
`openai_codex_sdk`, `codex_app_server_sdk`. Exit `0` when primary App Server
checks pass, `1` when one or more primary checks fail.

```sh
<meta-skill-root>/scripts/metaskill doctor --json
```

### `init`

Use once per target skill or project to create the standard hidden workbench,
nested agent guidance, and a starter eval suite.

Flags: `<target>` (defaults to the current directory), `--dry-run` (report
planned changes without writing them).

Writes `.<skill-name>/`, seeding `.<skill-name>/AGENTS.md` if missing and
`.<skill-name>/evals.json` (default suite skeleton, `skill_name` filled from
the target's `SKILL.md`) if missing. Does not create empty folders.

```sh
<meta-skill-root>/scripts/metaskill init <skill-dir> --json
```

### `status`

One-glance read of a target's workbench state: whether the workbench and
suite exist, case counts and types, lint warning count, known presets, and the
latest run.

Flags: `<target>` (defaults to the current directory), `--json`.

```sh
<meta-skill-root>/scripts/metaskill status <skill-dir>
```

### `case new`

Scaffold a new eval case's visible task before wiring it into `evals.json`.

Flags: `<case-id>`, `--suite <suite>` (defaults to the current target's
`.<skill-name>/evals.json`).

Writes `.<skill-name>/cases/<case-id>/task.md` with a TODO stub. If the case
id is not yet in `evals.json`, the result includes a ready-to-paste manifest
snippet; it does not edit `evals.json` for you.

```sh
<meta-skill-root>/scripts/metaskill case new <case-id> --suite .<skill-name>/evals.json --json
```

### `sessions list` / `sessions show` / `sessions extract`

Use to locate, render, and package prior Codex thread evidence. Reads
`~/.codex/state_5.sqlite`, the authoritative local Codex session index. See
[thread-skill-improvement.md](thread-skill-improvement.md) for the full
locate/render/extract workflow, flags, and output shapes.

```sh
<meta-skill-root>/scripts/metaskill sessions list --limit 25 --archived all --query "skill doctor" --json
<meta-skill-root>/scripts/metaskill sessions show 019ed74b-e8d8 --max-chars 12000
<meta-skill-root>/scripts/metaskill sessions extract 019ed74b-e8d8 --target plugins/dots/skills/ideate
```

### `eval run`

Use to execute a suite or a selected slice of it. Always preflight-lints the
suite (and the preset, when `--preset` is given) and prints warnings to
stderr; JSON runs include `lint_warnings` in the result. Pass `--check` to run
only the preflight lint (no planning, no trials, exit `0`). Runs trials **and
grades them by default**; pass `--no-grade` to skip grading for runtime-only
debugging.

Flags: `--suite` (defaults to `.<skill-name>/evals.json`), `--candidates
<ids>`, `--split <name>`, `--case <id>` (repeatable/comma-sep), `--type
<type>` (repeatable/comma-sep), `--repetitions <n>`, `--preset
<name-or-path>`, `--model <id>`, `--no-grade`, `--check`.

What it does: verifies each selected task already has a task file (create it
first with `case new`), freezes the suite and each candidate's source payload
into `inputs/` (the run input snapshot), stages a trial workspace with only
`task.md`, declared fixtures, and the candidate payload when present, executes
each task/candidate/trial combination through Codex App Server with live
per-trial progress on stderr, then grades (unless `--no-grade`) and
auto-renders `report.md`.

`--preset <name-or-path>` runs the task and candidate slice selected by a
saved preset instead of `--suite`/`--candidates`/`--case`/`--type`. A bare
name resolves to `.<skill-name>/presets/<name>.json`. Preflight-lints the
preset first and hard-fails on unknown cases/candidates or no selection.
Selects cases by `case_ids`, `types`, and/or `split`; selects candidates from
the preset baseline and payload list; applies repetition overrides; records
`preset_id` and `preset_path` in `run.json`.

Output: summary with `run_id`, `run_dir`, trial count, and pass/fail counts.
Exit `0` when all trials pass, `1` when one or more trials fail.

```sh
<meta-skill-root>/scripts/metaskill eval run --preset release --json
```

Run layout — see [run-layout.md](run-layout.md) for the full directory tree,
what each file is for, trial id format, and the hidden-grader boundary.

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
`expectations[]` from `evals.json`, runs declared model graders with their
named `judge.md` path or expectation guidance, and runs declared code graders
with their named `validate.*` path plus `--output`, `--events`, and `--json`
(plus `--expected` when an `expected.*` file exists). It then appends a new
grade generation to `.<skill-name>/runs/<run-id>/grades.jsonl`. Undeclared
`judge.md` or `validate.*` files are ignored; a task with no runnable declared
grader or expectations is marked ungraded. `graders[]` entries preserve named
`id`, `metric`, `required`, and `gate` semantics. `expectations[]` are hidden
model-judge checks, never staged into the workspace. Judge grading writes
events to `trials/<trial-id>/judge-<generation-id>.jsonl`.

### `eval human`

Use when a run contains declared human graders or when a model/code grade
needs human calibration. Labels are `pass`, `partial`, `fail`, or `unknown`
(see [eval-vocabulary.md](eval-vocabulary.md)); scores are optional, 0 to 1.

Packet mode returns the response path, event and compact evidence paths,
existing human grade rows for the trial, and short review guidance:

```sh
<meta-skill-root>/scripts/metaskill eval human --run <run-dir> --trial <trial-id> --json
```

Record mode writes or replaces the matching human row in `grades.jsonl`;
`--reviewer <name>` attributes the recorded grade:

```sh
<meta-skill-root>/scripts/metaskill eval human \
  --run <run-dir> --trial <trial-id> --grader human-reviewer --reviewer <name> \
  --metric usefulness --label partial --score 0.5 \
  --rationale "Usable, but misses the approval boundary." --json
```

### `eval calibrate`

Use after human and model grades exist for the same run. Compares model judge
grades with human grades and records whether the judge is calibrated well
enough to scale beyond the human spot-check slice.

Flags: `--run <run-id-or-path>`, `--metric <name>` (restrict to one shared
metric).

Reads paired human/model rows from `grades.jsonl`; computes TPR, TNR, exact
and tolerance agreement, false pass/fail examples, and unknown-label rates.
Writes a calibration artifact under `.<skill-name>/calibrations/`.

```sh
<meta-skill-root>/scripts/metaskill eval calibrate --run <run-dir> --metric usefulness --json
```

### `eval list`

Enumerate the runs in a workbench without listing run directories by hand.

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
dirty flag, payload digest), runner completion per trial, behavioral grades
(judge score/label, validator pass counts, graded/ungraded flags, gate
failures, token usage), baseline/candidate comparison rows when applicable,
evidence pointers relative to the run directory, and a needs-attention list
(failed trials, planned trials with no result, ungraded trials, gate failures,
invalid-JSON graders, `unknown_evidence` trials, missing token usage).

When the run has a `preset_path` (or `--preset` overrides it), renders the
preset scorecard instead: preset decision, path, suite path, run id,
candidates, the metric families the preset requested, matching history rows
when `report.include_history` is true, calibration artifacts when present,
needs-attention rows, and coverage limits. `--preset <path>` is optional when
`run.json` already records the preset.

Output: Markdown to stdout by default; with `--out`, the report file plus a
confirmation; with `--json` and no `--out`, the full structured report.

```sh
<meta-skill-root>/scripts/metaskill eval report --run <run-dir> --preset .<skill-name>/presets/release.json
```

### `eval verify-run`

Rechecks a completed run's input snapshot against its recorded digests: the
frozen `task.md` and support files per case, each candidate snapshot against
`payload_digest`, the recorded suite digest, and summary/trial totals. Use it
to prove a scorecard came from exactly the inputs it claims. Exits non-zero on
any mismatch.

### `docs emit-cli` / `docs lint`

Documentation gates, run by `scripts/verify.sh`. `docs emit-cli --write`
regenerates the Command Surface block above from the argument parser
(`--check` exits 1 when the committed file is out of sync). `docs lint` fails
on any passage repeated verbatim across two documentation files and enforces
the plugin's total docs line budget.

### `validate`

Use before review, packaging, or sync. Flags: `<skill-dir>` (skill directory
or direct path to `SKILL.md`). Checks: `SKILL.md` exists, frontmatter parses,
required fields exist, unknown frontmatter keys are flagged, file length
stays within the current limit, body content exists, and authoring lint
checks from the canonical shared validator path. Output: JSON or
human-readable report with per-check results and a pass rate; combines
package validation and authoring lint; exits non-zero on any failure.

### `package`

Emits a packaged skill payload to an output directory; validates first and
stops if validation fails. Flags: `<skill-dir>`, `--out-dir <dir>`. Output:
zip artifact path and sidecar package metadata JSON path, optionally in JSON.

## Common Flows

First-time setup for a target:

```sh
<meta-skill-root>/scripts/metaskill doctor --json
<meta-skill-root>/scripts/metaskill init <target> --json
```

Add a task and run the suite: `case new <case-id> --json`, paste the returned
manifest snippet into `evals.json`, author `task.md` and any validators or
fixtures, then:

```sh
<meta-skill-root>/scripts/metaskill eval run --json
<meta-skill-root>/scripts/metaskill eval progress --run <run-id> --watch --json
<meta-skill-root>/scripts/metaskill eval human --run <run-id> --json
<meta-skill-root>/scripts/metaskill eval calibrate --run <run-id> --json
<meta-skill-root>/scripts/metaskill eval report --run <run-id>
```

Read `.<skill-name>/runs/<run-id>/report.md` for the rendered result. Re-run
`eval run` after editing tasks or graders; use `eval grade --run <run-id>`
only to re-grade without re-running trials; use `eval list --json` to find
earlier run ids in the same workbench.

### CI gate

Every command exits non-zero on failure and emits machine-readable output
with `--json`, so a CI job needs only:

```sh
<meta-skill-root>/scripts/metaskill eval run --suite <suite> --json > run.json || exit 1
<meta-skill-root>/scripts/metaskill eval verify-run --run "$(python3 -c 'import json;print(json.load(open("run.json"))["run_dir"])')" --json
```

Archive the run directory as the build artifact: it contains the frozen
inputs, per-trial evidence, grades, and the rendered `report.md`.

### Dogfood the skill lifecycle

Use this flow before claiming the full lifecycle works. Run it in an isolated
worktree with the installed plugin launcher, not only source files: create a
detached worktree, create two target skill folders outside source payloads,
`init`/`validate`/`package` each, author each target's `.<skill-name>/evals.json`
and case files, then `eval run`, `eval progress`, and `eval report --out` for
each. The dogfood report should include the skill ideas, review evidence, run
directories, grade summaries, feedback, and the revised candidate change. Use
`eval report` for per-run summaries instead of hand-authoring them.

## Boundaries

- Prefer the CLI over calling helper code under `<meta-skill-root>/src/` directly.
- Use Codex App Server as the eval runner.
- Keep task text visible and literal; no hidden task metadata.
- Keep shared behavior at the plugin CLI layer; do not recreate worker-local
  script surfaces.
