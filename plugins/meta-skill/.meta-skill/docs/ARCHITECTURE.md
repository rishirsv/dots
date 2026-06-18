---
type: Concept
title: Meta-Skill Architecture
description: How the Meta-Skill plugin routes skill lifecycle work, stores workbench state, runs evaluations, grades outcomes, reports evidence, and ships into generated plugin packages.
resource: meta-skill/
tags: [meta-skill, skills, cli, evals, architecture]
---

# Meta-Skill Architecture

Meta-Skill is the plugin that helps agents create, improve, validate, package,
and evaluate reusable agent skills. It is deliberately split into a small
router plus focused specialist skills, and it uses one shared CLI for durable
automation.

This document is for external engineers and future agents who need to understand
how the project works before editing it. It describes the current source layout,
runtime lifecycle, hidden workbench, evaluation model, command surface, runner
adapters, grading, reporting, validation, and packaging boundaries.

## Index

Read this document in order if Meta-Skill is new to you. Use this index when
you already know the area you need.

| If you need to understand... | Read |
|---|---|
| The big picture and what counts as evidence | [Mental Model](#mental-model) |
| Where source files, hidden docs, and generated plugin copies live | [Source Layout](#source-layout) |
| Which specialist owns writing, maintenance, or measurement | [Plugin Lifecycle Model](#plugin-lifecycle-model) |
| The meaning of suite, task, candidate, trial, transcript, outcome, and grader | [Vocabulary](#vocabulary) |
| Which CLI command owns which file or behavior | [Shared CLI](#shared-cli) |
| What each current command group does technically | [Command Groups And Instructions](#command-groups-and-instructions) |
| Why `.<skill-name>/` exists and what each workbench file is for | [Hidden Workbench](#hidden-workbench) |
| How Writer-authored eval prompts become Evaluator-runnable tasks | [Eval Manifest](#eval-manifest) |
| How an agent writes evals and chooses graders | [How Agents Write Evals](#how-agents-write-evals) |
| How task folders are created from the manifest | [Workbench Initialization And Materialization](#workbench-initialization-and-materialization) |
| How no-skill, current-skill, branch, and git-ref candidates work | [Candidate Resolution And Payload Identity](#candidate-resolution-and-payload-identity) |
| What the workspace contains and what stays hidden | [Trial Staging](#trial-staging) |
| How trials execute through App Server | [Runner Architecture](#runner-architecture) |
| What `run.json`, `results.jsonl`, transcripts, evidence, responses, and grades mean | [Run Files](#run-files) |
| How code, model, and human graders work | [Grader Architecture](#grader-architecture) |
| What `eval lint` can and cannot prove | [Eval Lint](#eval-lint) |
| How reports and baseline comparisons make decisions | [Reports And Comparison](#reports-and-comparison) |
| How validation, packaging, and generated package sync work | [Validation And Packaging](#validation-and-packaging), [Sync And Generated Packages](#sync-and-generated-packages) |
| The complete eval journey from Writer handoff to report | [End-To-End Evaluation Flow](#end-to-end-evaluation-flow) |
| Current boundaries and likely future extension points | [Current Boundaries And Future Work](#current-boundaries-and-future-work) |
| What to run before changing or committing Meta-Skill | [Validation Commands For Contributors](#validation-commands-for-contributors) |
| Which source files to inspect when refreshing this document | [Source Map](#source-map) |

## Mental Model

Meta-Skill has two layers:

1. **Skill lifecycle guidance**: the four skills under `meta-skill/skills/`
   tell an agent how to route skill work, write new skills, improve existing
   skills, and evaluate behavior.
2. **Workbench automation**: the Python CLI under `meta-skill/src/` creates
   workbench folders, runs eval trials, captures transcripts, grades outcomes,
   renders reports, validates skills, and packages portable payloads.

The skills are the agent-facing instructions. The CLI is the deterministic tool
surface those skills rely on. The hidden workbench is the durable state that
connects them.

The most important distinction is this:

| Thing | Meaning | Evidence? |
|---|---|---|
| Skill payload | The runtime files that make an agent behave differently, usually `SKILL.md` plus linked runtime references, scripts, assets, and metadata | No |
| Eval manifest | The authored list of tasks and candidates that should be tested | No |
| Materialized case | A task folder containing visible task text plus hidden grader-side material | No |
| Run | One concrete execution of selected tasks under selected candidates | Yes |
| Grade | A code, model, or human judgment over a trial outcome | Yes |
| Report or compare result | A read-only summary of run and grade evidence | Yes |

Writer output is therefore not proof. A writer can create useful eval prompts,
expected behavior, and grader hints, but measurement starts only when Evaluator
creates a run and records results.

## Source Layout

The source plugin lives under `meta-skill/`. Generated package copies live under
`plugins/codex/meta-skill/` and `plugins/claude/meta-skill/`; do not edit those
generated copies by hand.

```text
meta-skill/
  .meta-skill/
    docs/
      ARCHITECTURE.md
      *-research.md
  references/
    cli.md
    skill-trial-runs.md
  skills/
    meta-skill/
      SKILL.md
      agents/openai.yaml
    skill-writer/
      SKILL.md
      references/
      agents/openai.yaml
    skill-doctor/
      SKILL.md
      references/
      agents/openai.yaml
    skill-evaluator/
      SKILL.md
      references/
      agents/openai.yaml
    skill-benchmarker/
      SKILL.md
      references/
      agents/openai.yaml
  src/
    meta-skill
    meta_skill/
      cli.py
      manifest.py
      workbench.py
      runner.py
      grading.py
      report.py
      ...
```

The hidden `meta-skill/.meta-skill/docs/` directory is committed project
knowledge for the Meta-Skill plugin itself. The name still follows the same
rule: the target skill is `meta-skill`, so its hidden workbench is
`.meta-skill/`. It is not the same as another target skill's generated eval
workbench. Temporary planning artifacts should not live there; keep durable docs
such as this architecture reference and source-grounded research reports.

There are three important source/generated boundaries:

- Edit `meta-skill/skills/`, `meta-skill/references/`, and `meta-skill/src/`
  when changing Meta-Skill behavior.
- Do not hand-edit `plugins/codex/meta-skill/` or `plugins/claude/meta-skill/`;
  those directories are regenerated package copies.
- Do not package `.<skill-name>/` workbench state into portable skills. Workbench
  files are for authoring, evaluation, reports, and local evidence.

## Plugin Lifecycle Model

Meta-Skill models skill work as a lifecycle with clear ownership boundaries.

| Specialist | Source | Owns | Does not own |
|---|---|---|---|
| Router | `skills/meta-skill/SKILL.md` | Entry routing, lifecycle sequencing, handoff preservation | Specialist workflow details |
| Writer | `skills/skill-writer/SKILL.md` | New skill authoring, trigger contracts, runtime payload shape, optional eval manifest handoff | Existing-skill fixes, measurement, packaging/sync |
| Doctor | `skills/skill-doctor/SKILL.md` | Existing-skill review, diagnosis, approved edits, focused verification | Greenfield authoring, formal evaluation suites |
| Evaluator | `skills/skill-evaluator/SKILL.md` | Evaluation suites, candidates, trials, grading, human review, reports | Fixing the target or generating autonomous candidate improvements |
| Benchmarker | `skills/skill-benchmarker/SKILL.md` | Recurring benchmark profiles, benchmark runs, scorecards, gates, and history over existing suites | First-pass suite authoring, grading design, target fixes |

The router is the only broad trigger. Worker skills have narrow descriptions and
should defer when the request belongs to another lifecycle stage.

Typical flows:

- New skill: `meta-skill` routes to `skill-writer`.
- New skill with eval handoff: `skill-writer` authors payload and
  `.<skill-name>/evals.json`; `skill-evaluator` later materializes and runs it.
- Existing skill bug: `skill-doctor` reviews or diagnoses, proposes, edits only
  after explicit approval, then verifies.
- Outcome measurement: `skill-evaluator` compares no-skill, current-skill, and
  edited-skill candidates.
- Recurring benchmark decision: `skill-benchmarker` selects a stable task bank
  from an existing suite, runs the benchmark profile, and reports scorecard
  history.
- Evaluation reveals a defect: `skill-evaluator` reports the failing tasks and
  hands repair back to `skill-doctor`.

### Router

The router skill is intentionally thin. It answers one question: which
specialist owns this request?

The router should not copy the writer, doctor, or evaluator playbooks into its
own body. When a user says "make a new skill," the router loads Writer. When a
user says "fix this existing skill," the router loads Doctor. When a user asks
whether a skill performs better under a baseline or a new attempt, the router
loads Evaluator.

The router matters because user requests are often lifecycle-shaped rather than
file-shaped. A user may say "make this production-ready." That could mean:

- write a better skill,
- diagnose a failure,
- run an eval,
- package the skill,
- or some sequence of those.

The router keeps those jobs from collapsing into one overbroad skill.

### Writer

Writer owns blank-page skill creation. Its job is to turn an intent, workflow,
example output, source pack, or transcript into a reusable runtime payload.

Writer produces files such as:

```text
<skill-dir>/
  SKILL.md
  agents/openai.yaml
  references/
  scripts/
  assets/
  .<skill-name>/evals.json
```

Only the runtime payload is meant to ship. `.<skill-name>/evals.json` is optional
authoring handoff material when the user asks for eval seeds, project-mode eval
material, or evaluator handoff. It should not contain grades, run state, or
claims that measurement happened.

### Doctor

Doctor owns existing-skill maintenance. It starts from an artifact that already
exists and either reviews it or diagnoses a specific failure.

Doctor's loop is:

```text
review or diagnose -> propose -> wait for approval -> edit -> verify
```

That approval boundary matters. Human feedback is evidence, not automatic edit
authorization. A user can say "this failed on prompt X" and Doctor can diagnose
and propose a fix, but it should not mutate the skill until the user asks it to
apply or make the change.

### Evaluator

Evaluator owns measurement. It authors or uses `.<skill-name>/evals.json`,
materializes task folders, runs tasks under candidates, records grades, and
reports the result.

Evaluator does not fix the target. It can say "current improves over no-skill on
these tasks, regresses on this task, and needs human review here." If that
reveals a defect, the fix routes back to Doctor.

## Vocabulary

Meta-Skill uses `candidate` as the canonical term for the agent setup under
test.

| Product term | Current file or schema surface |
|---|---|
| Suite | `.<skill-name>/evals.json` plus its materialized workbench |
| Task | One evaluation row and one folder under `.<skill-name>/cases/<task-id>/` |
| Candidate | One harness setup, such as `no-skill`, `current`, or an edited attempt; stored as `candidates[]` in manifests and `candidate` in run rows |
| Trial | One task executed once under one candidate |
| Transcript | `events/<trial-id>.jsonl` plus compact `evidence/<trial-id>.json` |
| Outcome | The response in `candidates/<candidate>/<trial-id>/response.md` plus any produced artifacts |
| Grader | A code, model, or human judgment row in `grades.jsonl` |

Use `candidate` consistently in user-facing prose, JSON fields, and path
segments.

### Vocabulary In A Concrete Example

Suppose the target skill normalizes commit messages. An eval suite might ask the
agent to turn messy notes into a Conventional Commit subject.

```text
suite:      .<skill-name>/evals.json
task:       implicit-auth-fix
candidate: current
trial:      implicit-auth-fix.current.t1
outcome:    candidates/current/implicit-auth-fix.current.t1/response.md
transcript: events/implicit-auth-fix.current.t1.jsonl
evidence:   evidence/implicit-auth-fix.current.t1.json
grader:     one row in grades.jsonl
```

The task is the work to perform. The candidate is the harness setup the task
runs under. The trial is one execution of that task under that candidate. The
outcome is what the agent produced. The transcript and evidence explain how it
got there. The grader judges whether the outcome met the task's success
criteria.

## Shared CLI

The Meta-Skill CLI is the shared automation surface for every specialist. It
lives in `meta-skill/src/` and is launched from the repo as:

```sh
plugins/meta-skill/scripts/metaskill <command>
```

Installed plugin packages expose the same CLI at:

```sh
<plugin-root>/scripts/metaskill <command>
```

The launcher bootstraps a Python environment and dependencies from
`meta-skill/src/requirements.txt`. The relevant environment variables are:

- `META_SKILL_PYTHON`: use a specific Python interpreter.
- `META_SKILL_CACHE_DIR`: override the cache root.
- `META_SKILL_VENV`: override the virtualenv path.
- `META_SKILL_SKIP_DEP_UPDATE=1`: skip dependency installation and use the
  existing environment.

CLI output rules:

- `--json` makes stdout machine-readable.
- Diagnostic and dependency-install text may go to stderr.
- Durable output is written to files in the workbench; stdout is a convenience,
  not the source of truth.

Current command groups:

```sh
plugins/meta-skill/scripts/metaskill doctor [--json]
plugins/meta-skill/scripts/metaskill workbench init [--target <path>] [--dry-run] [--json]
plugins/meta-skill/scripts/metaskill eval lint [--suite <suite>] [--json]
plugins/meta-skill/scripts/metaskill eval materialize [--suite <suite>] [--force] [--json]
plugins/meta-skill/scripts/metaskill eval run [--suite <suite>] [--runner auto|codex_app_server] [--candidates <ids>] [--split <name>] [--repetitions <n>] [--model <id>] [--json]
plugins/meta-skill/scripts/metaskill eval progress --run <run-id-or-path> [--watch] [--json]
plugins/meta-skill/scripts/metaskill eval grade --run <run-id-or-path> [--json]
plugins/meta-skill/scripts/metaskill eval human --run <run-id-or-path> [--trial <trial-id>] [--grader <id>] [--metric <name>] [--label <label>] [--score <0-to-1>] [--rationale <text>] [--json]
plugins/meta-skill/scripts/metaskill eval compare --run <run-id-or-path> [--baseline <candidate>] [--candidate <candidate>] [--json]
plugins/meta-skill/scripts/metaskill eval list [--suite <suite>] [--json]
plugins/meta-skill/scripts/metaskill eval report --run <run-id-or-path> [--out <file>] [--json]
plugins/meta-skill/scripts/metaskill validate <skill-dir> [--json]
plugins/meta-skill/scripts/metaskill package <skill-dir> [--out-dir <dir>] [--json]
```

The implementation entrypoint is `meta_skill/cli.py`. It dispatches to modules
that own one area: `workbench.py`, `manifest.py`, `runner.py`, `grading.py`,
`report.py`, `validation.py`, and `packaging.py`.

### Command Ownership

Each command reads or writes a specific part of the system.

| Command | Main module | Reads | Writes | Purpose |
|---|---|---|---|---|
| `doctor` | `cli.py`, `app_server/client.py` | Python environment, SDK imports, source paths | Nothing | Check whether the local Meta-Skill runtime can operate |
| `workbench init` | `workbench.py` | Target path | `.<skill-name>/` folders, starter `evals.json` | Create a place for eval authoring and run evidence |
| `eval lint` | `linting.py`, `manifest.py` | `evals.json` | Nothing | Find static manifest and grader-shape problems |
| `eval materialize` | `workbench.py`, `manifest.py` | `evals.json` | `.<skill-name>/cases/<task-id>/` | Turn manifest task seeds into editable task folders |
| `eval run` | `runner.py` | manifest, materialized tasks, candidate payloads | `.<skill-name>/runs/<run-id>/` | Execute trials and capture transcripts/outcomes |
| `eval progress` | `runner.py`, `io.py` | run files | Nothing | Show runner status counts |
| `eval grade` | `grading.py` | run results, task judge guidance, expected files, validators | `grades.jsonl`, judge event files | Judge trial outcomes |
| `eval human` | `grading.py` | run results, grades | `grades.jsonl` in record mode | Show human review packets or record human labels |
| `eval compare` | `report.py` | run results, grades | Nothing | Compute baseline-vs-candidate impact |
| `eval report` | `report.py` | run results, grades, evidence paths | Optional report file | Render a deterministic human-readable report |
| `validate` | `validation.py` | skill payload | Nothing | Check skill structure and authoring quality |
| `package` | `packaging.py` | skill payload | zip and metadata | Export a portable skill package |

This ownership table is the fastest way to decide where a change belongs.

### Command Groups And Instructions

The current CLI has three practical command groups:

1. **Environment and workbench setup**: `doctor` and `workbench init`.
2. **Evaluation lifecycle**: every `eval` subcommand from manifest linting
   through reports.
3. **Skill artifact validation and packaging**: `validate` and `package`.

The lifecycle flow is:

```text
doctor
  -> workbench init
  -> eval lint
  -> eval materialize
  -> eval run
  -> eval progress
  -> eval grade
  -> eval human, if needed
  -> eval compare
  -> eval report
```

`validate` and `package` are adjacent to that flow. They answer whether the
skill payload is structurally valid and portable. The `eval` commands answer
whether the skill changes behavior under measured candidates.

#### `doctor`

`doctor` checks whether the local Meta-Skill runtime can operate.

Technically, it verifies:

- the Python version is supported,
- the CLI source exists,
- the package validation modules exist,
- old worker-local script folders are absent,
- the `openai_codex` package imports,
- the App Server SDK exposes the symbols Meta-Skill needs.

Use `doctor` before first use, after install or dependency changes, or when
runner behavior looks suspicious. The primary readiness target is Codex App
Server.

#### `workbench init`

`workbench init` creates the hidden `.<skill-name>/` workbench for a target skill
or project.

It creates the expected workbench folders and seeds `.<skill-name>/evals.json` if
one does not exist. The command accepts `--target` to initialize a target other
than the current directory and `--dry-run` to report planned changes without
writing them.

Use `workbench init` once per target project or skill. The hidden workbench is
the right place for authoring and evaluation state; do not create a public
top-level `evals/` folder just because another framework uses one.

#### `eval lint`

`eval lint` statically checks the eval manifest before anything runs.

It reads both `cases[]` manifests and writer-facing `evals[]` prompt
manifests. It checks task counts, task type distribution, grader kinds, human
grader declarations, transcript-aware graders, task seeds, reference material,
trigger-suite balance, and grader metadata.

Use `eval lint` to answer: "Is this suite shaped well enough to run?" It is not
a behavioral grade and does not prove that the skill works.

#### `eval materialize`

`eval materialize` turns manifest-defined tasks into concrete case folders.

It creates `.<skill-name>/cases/<task-id>/`, writes the visible task file, and
creates parent directories for declared fixtures. By default it does not
overwrite edited task files. `--force` permits overwriting seeded task files.

Use `eval materialize` after editing `.<skill-name>/evals.json` or when task
folders are missing. Keep hidden expectations, judge guidance, validators, and answer
keys out of the visible task prompt.

#### `eval run`

`eval run` executes selected tasks under selected candidates.

Technically, it:

- loads tasks and candidates from `.<skill-name>/evals.json`,
- verifies selected task files exist,
- resolves the runner,
- creates a run directory,
- stages one workspace per task, candidate, and repetition,
- runs the selected trials,
- captures transcript events, folded evidence, response text, progress rows,
  and result rows.

Use `--candidates` to restrict the run to specific candidates. Use `--split` to
run a manifest split, `--repetitions` to override repetition count, and
`--model` to pass a model override to the runner.

The worker receives only the visible task prompt, declared fixtures, and the
candidate payload. Hidden grading material must stay grader-side.

#### `eval progress`

`eval progress` reads a run and summarizes execution state.

It inspects `run.json`, `progress.jsonl`, `results.jsonl`, and `grades.jsonl`.
It reports trial counts, status counts, result count, grade count, and whether
the run appears terminal. With `--watch`, it refreshes until all trials are in a
terminal state.

Use `eval progress` instead of manually opening every run file while execution
is still moving.

#### `eval grade`

`eval grade` judges completed trial outcomes.

It reads run results, the suite manifest, case folders, task judge guidance, expected
files, validators, and explicit grader declarations. It can run code validators,
call model judges, and create pending human-review rows. It writes grade rows to
`grades.jsonl`.

Use code graders for exact checks. Use model graders for semantic quality and
multi-valid-answer tasks. Use human graders for taste, product judgment,
calibration, and accept/reject decisions where a model judge may not yet
represent the human standard.

#### `eval human`

`eval human` supports human review in packet mode and record mode.

Without `--label`, it returns a review packet: response path, transcript path,
evidence path, existing human grades, and review guidance. With `--label`, it
records or replaces a human judgment in `grades.jsonl`.

Use this when a declared human grader is pending or when a code/model grade
needs calibration. A good human judgment should later become a clearer judge guidance,
reference example, validator, or model judge instruction when the standard is
reusable.

#### `eval compare`

`eval compare` compares graded candidates inside one run.

It reads the run, results, and grades, groups behavior by task and candidate,
and decides whether a candidate improved over a baseline candidate.
The recommendation can be `promote_for_measured_scope`,
`promising_with_failures`, `reject_or_revise`, `no_skill_lift_detected`, or
`needs_more_evidence`.

Use this command when the product question is "did the skill add measured
value?" A passing current-skill run is not enough if the no-skill baseline also
passes.

#### `eval list`

`eval list` enumerates historical runs in a workbench.

It scans `.<skill-name>/runs/<run-id>/run.json` and summarizes run id, creation
time, runner, candidates, trial status counts, and grade count. If one run is
unreadable, the command reports that run as an error row instead of failing the
whole listing.

Use this to orient before comparing or reporting older runs.

#### `eval report`

`eval report` renders a deterministic report from existing run files.

It does not rerun trials and does not regrade outcomes. It reads run metadata,
results, grades, impact rows, evidence pointers, and attention items, then emits
Markdown or JSON.

Use this as the human-readable evidence artifact. The report should explain
what ran, what was measured, what evidence exists, which candidate performed
better, and what still needs review.

#### `validate`

`validate` checks a skill payload before review, packaging, sync, or release.

It verifies `SKILL.md`, frontmatter parsing, required fields, unknown keys,
body content, file length, and authoring lint through package modules under
`meta_skill/`.

Use this after changing a skill payload. It is deterministic validation, not a
behavioral evaluation.

#### `package`

`package` validates a skill payload and then emits a portable package artifact.

It stops if validation fails. Package output excludes private and generated
material such as `.<skill-name>/`, `.git`, `__pycache__`, `dist`, and `.DS_Store`.

Use this only when the payload is ready to export. Packaging is downstream of
validation and does not prove behavioral lift.

## Hidden Workbench

Each target skill or project can have a hidden workbench at
`<project>/.<skill-name>/`, where `<skill-name>` comes from the target
payload's `SKILL.md` frontmatter when available. For ordinary target projects,
that workbench stores authoring notes, eval manifests, materialized tasks, runs,
workspaces, package artifacts, and reports. For the Meta-Skill plugin itself,
the resolved path is `meta-skill/.meta-skill/docs/`, which stores committed
durable project documentation.

The evaluator workbench shape is:

```text
.<skill-name>/
  evals.json
  cases/
    <task-id>/
      task.md
      fixtures/
      judge.md
      expected.*
      validate.*
  runs/
    <run-id>/
      run.json
      progress.jsonl
      results.jsonl
      grades.jsonl
      events/
        <trial-id>.jsonl
        <trial-id>.judge.jsonl
      evidence/
        <trial-id>.json
      candidates/
        <candidate>/
          <trial-id>/
            response.md
  workspaces/
    <run-id>/
      <trial-id>/
        task.md
        fixtures/
        skill/
```

Authority is split by artifact:

- `.<skill-name>/evals.json` owns suite metadata: target, defaults, candidates,
  tasks, splits, repetitions, fixtures, expectations, and grader declarations.
- `.<skill-name>/cases/<task-id>/` owns authored task material after
  materialization.
- `.<skill-name>/runs/<run-id>/` owns what actually ran and what was graded.
- `.<skill-name>/workspaces/` stores temporary workspaces staged as input for a
  trial. It is not the authoritative result.

`task.md` is visible agent input. Do not put hidden judge guidance, expected output,
validator hints, metadata, grades, or harness notes in `task.md`.

### Why The Workbench Is Hidden

The workbench is hidden because it mixes several kinds of state that should not
be part of the portable runtime skill:

- authoring notes and eval manifests,
- hidden task judge guidance and expected outputs,
- run transcripts and generated responses,
- workspaces,
- package artifacts,
- human labels and reports.

That material is valuable for development, but it should not change how the
skill behaves when installed. Packaging excludes `.<skill-name>/` for this reason.

### Workbench Files By Lifecycle Stage

| Stage | Primary files | What they answer |
|---|---|---|
| Authoring | `.<skill-name>/evals.json` | What should be tested later? |
| Materialization | `.<skill-name>/cases/<task-id>/task.md` | What visible prompt will the agent see? |
| Hidden grading setup | `judge.md`, `expected.*`, `validate.*` | How should the result be judged? |
| Execution | `runs/<run-id>/run.json`, `progress.jsonl`, `results.jsonl` | What was selected, what ran, and what completed? |
| Transcript capture | `events/<trial-id>.jsonl`, `evidence/<trial-id>.json` | What happened during the run? |
| Outcome capture | `candidates/<candidate>/<trial-id>/response.md` | What did the agent produce? |
| Grading | `grades.jsonl`, `events/<trial-id>.judge.jsonl` | How did graders judge the outcome? |
| Reporting | report output from `eval report`, compare JSON from `eval compare` | What decision does the evidence support? |

## Eval Manifest

Skill Writer now emits a prompt-manifest shape when the user asks for eval
seeds, project-mode eval material, or evaluator handoff:

```json
{
  "skill_name": "commit-message-normalizer",
  "target": { "type": "skill", "ref": "SKILL.md" },
  "defaults": {
    "runner": "codex_app_server",
    "repetitions": 1
  },
  "candidates": [
    { "id": "no-skill", "label": "No skill baseline", "source": { "kind": "none" } },
    { "id": "current", "label": "Current skill", "source": { "kind": "current_worktree", "ref": "." } }
  ],
  "evals": [
    {
      "id": "implicit-auth-fix",
      "type": "capability",
      "prompt": "Turn these change notes into one Conventional Commit subject...",
      "expected_output": "A single Conventional Commit subject.",
      "expectations": [
        "The output contains exactly one Conventional Commit subject line.",
        "The subject uses the correct type and scope."
      ],
      "graders": [
        { "kind": "model", "id": "expectations", "metric": "quality" }
      ]
    }
  ]
}
```

`manifest.py` normalizes this writer-facing shape into the internal suite shape:

- `candidates[].id` becomes `candidate`.
- `candidates[].label` becomes `display`.
- `evals[]` becomes `cases[]`.
- `prompt` becomes the materialized task seed.
- `files` or `fixtures` become fixture declarations.
- `expected_output`, `expectations`, and `graders` become hidden grader-side
  material.

The default manifest written by `workbench init` is the prompt-manifest shape.

Allowed candidate source kinds:

- `none`: no skill payload. Used for baseline candidates.
- `current_worktree`: the current project checkout.
- `branch`: a git branch materialized into a detached worktree for the run.
- `git_ref`: any git ref materialized into a detached worktree for the run.

Case and candidate IDs must be lowercase slugs.

### Manifest Fields

The prompt manifest should be readable by a skill author and runnable by the
evaluator. These are the important fields:

| Field | Level | Meaning | Who uses it |
|---|---|---|---|
| `skill_name` | top-level | Human-readable target name | Writer, Evaluator, docs |
| `target.ref` | top-level | Path to the skill payload relative to the project or candidate worktree | Candidate resolver |
| `defaults.runner` | top-level | Preferred runner for `eval run --runner auto` | Runner |
| `defaults.repetitions` | top-level | Default number of executions per task/candidate | Runner |
| `candidates[]` | top-level | Harness setups such as no-skill baseline and current skill | Runner, comparison |
| `evals[]` | top-level | Authored tasks to test | Materializer, runner |
| `evals[].id` | task | Stable lowercase task slug | Case folder, trial IDs, reports |
| `evals[].type` | task | Intent such as capability, regression, trigger, negative control, failure, or gate | Linter, report reader |
| `evals[].prompt` | task | Visible task seed that becomes `task.md` | Materializer, agent |
| `evals[].expected_output` | task | Hidden reference or expected shape | Model judge |
| `evals[].expectations[]` | task | Hidden checks for model grading | Model judge, linter |
| `evals[].files` or `fixtures` | task | Visible files to stage with the task | Materializer, staging |
| `evals[].graders[]` | task | Explicit code/model/human grading declarations | Grading |

The evaluator normalizes these fields into runnable cases and candidate records.
The manifest shape remains `evals[]` and `candidates[]`.

### Manifest Versus Case Folder

The manifest is the plan for task material. The case folder is the editable
materialized form.

Example manifest task:

```json
{
  "id": "implicit-auth-fix",
  "prompt": "Turn these notes into one commit message...",
  "expectations": ["The output is one Conventional Commit subject."]
}
```

After materialization:

```text
.<skill-name>/cases/implicit-auth-fix/
  task.md
```

The `task.md` file contains the visible prompt. Hidden expectations stay in the
manifest unless the evaluator chooses to create a `judge.md`, `expected.*`, or
`validate.*` file for richer grading.

## How Agents Write Evals

Skill Writer creates evals only when eval seeds, project-mode eval material, or
evaluator handoff are in scope. The writer does not claim measurement happened.
It creates a runnable prompt manifest that Skill Evaluator can later lint,
materialize, run, grade, compare, and report.

The authoring decision flow is:

1. Identify the recurring job the skill performs.
2. Classify the skill type: reference, product verification, data analysis,
   business process, scaffold/template, review, deployment, runbook, or
   infrastructure operation.
3. Classify the evaluation posture:
   - capability uplift,
   - encoded preference,
   - or hybrid.
4. Mine the user request, source material, examples, prior corrections, and
   comparable skills for realistic prompts.
5. Select a small, balanced problem set:
   - should-trigger capability tasks,
   - regression tasks for known failures,
   - near-miss or negative-control tasks when trigger risk matters,
   - preference-fidelity tasks when the skill encodes taste or process,
   - transcript-aware tasks only when mid-conversation behavior matters.
6. Add default candidates, usually `no-skill` and `current`.
7. Choose graders that match the task's evidence.
8. Write `.<skill-name>/evals.json` with prompts, expectations, optional
   fixtures, and grader hints.

The writer should start small. Two to five strong tasks usually teach the
evaluator more than a large weak suite. Add repetitions, splits, and larger
problem sets when flakiness, coverage, or promotion risk justifies them.

### Grader Selection

Choose the grader from the evidence the task needs.

| Grader kind | Use when | Avoid when |
|---|---|---|
| `code` | Correctness is exact, structured, file-based, schema-based, or visible in tool/transcript events | The standard is taste, usefulness, strategy, or semantic quality |
| `model` | Many good answers are possible and judge guidance can describe the desired judgment | A cheap deterministic validator can prove the same claim |
| `human` | The standard depends on product taste, domain expertise, calibration, or a new accept/reject boundary | The expected answer is already objective and automatable |

Use transcript-aware grading only when the process matters. For a conversational
skill, the final response may be the least interesting evidence. A grader may
need to inspect `events/<trial-id>.jsonl` to see whether the agent loaded the
right reference, asked for approval, avoided a forbidden edit, used a tool
mid-conversation, or recovered from a failed command.

### What The Writer Puts In `evals.json`

Each eval row should be concrete enough that a future evaluator can run it
without reconstructing the author's intent.

Good rows include:

- a realistic user prompt,
- task type such as `capability`, `regression`, `trigger`, `negative_control`,
  `preference`, or `gate`,
- expected output shape,
- objective expectations,
- fixture declarations when files are required,
- grader hints with code, model, or human kind,
- and whether transcript evidence is needed.

Bad rows contain:

- vague prompts such as "test the skill",
- hidden answers inside the visible prompt,
- post-run status,
- grades,
- claims of success,
- local authoring notes that are not task material,
- or a copied source transcript without a clear success criterion.

### Completeness Assessment

The current design is complete enough for a useful first loop:

```text
Writer creates .<skill-name>/evals.json
Evaluator lints and materializes it
Evaluator runs no-skill and current-skill candidates
Evaluator grades outcomes
Evaluator compares and reports evidence
```

The design is not yet complete as an excellent evaluation system. The remaining
gaps are:

- stronger schema examples for common eval types,
- clearer defaults for balanced problem sets and splits,
- better interactive human-review workflow beyond packet and record mode,
- a first-class way to turn human labels into reusable model-judge guidance,
- stronger transcript selectors for mid-conversation evidence,
- report output that reads like a decision record instead of a file inventory,
- and an experiment history that links repeated runs, candidate edits, rejected
  attempts, and promotion decisions without overfitting to another framework's
  folder layout.

The direction is sound if Meta-Skill keeps the separation: Writer authors a
runnable manifest, Evaluator creates evidence, Doctor fixes defects, and future
optimization layers operate on top of recorded runs rather than replacing them.

## Workbench Initialization And Materialization

`workbench init` creates the minimum workbench directories and seeds
`.<skill-name>/evals.json` when it is missing:

```text
.<skill-name>/
  cases/
  runs/
  tests/
  evals.json
```

If the target contains `SKILL.md`, the default target ref is `SKILL.md`. If not,
the default target ref is `skill/SKILL.md`, which supports projects that keep
portable skill payloads under a `skill/` folder.

`eval materialize` reads the normalized manifest and creates
`.<skill-name>/cases/<task-id>/`. It writes the seeded task file, usually
`task.md`, and creates parent directories for declared fixtures. It does not
overwrite an edited task file unless `--force` is supplied.

Materialization keeps hidden evaluation data out of the visible task prompt. The
agent sees the staged `task.md`, declared fixtures, and candidate payload only.

### Why Materialization Exists

Materialization gives authors a place to edit task text and fixtures without
turning `evals.json` into a giant document. It also creates a clean boundary:

- manifest fields describe and select tasks,
- case files hold task content and grader-side files,
- run files record execution evidence.

For simple tasks, the prompt seed in `evals.json` may be enough. For realistic
tasks, materialized case folders let the evaluator add fixtures, expected files,
judge guidance, and validators next to the task.

## Candidate Resolution And Payload Identity

`candidates.py` resolves each candidate before a run starts.

For a `none` candidate, Meta-Skill records git identity for the project but
stages no skill payload. For a `current_worktree` candidate, it resolves the
target payload from the current project. For `branch` and `git_ref` candidates,
it creates a detached worktree under:

```text
.<skill-name>/worktrees/<run-id>/<candidate-id>/
```

Each payload receives a digest. The digest excludes generated and private
material:

- `.DS_Store`
- `.git`
- `.<skill-name>`
- `__pycache__`
- `dist`

The digest proves what payload bytes were staged for a candidate. It is distinct
from the git commit. A dirty worktree can still have a payload digest.

### Candidate Types In Practice

| Source kind | Payload staged? | Typical use |
|---|---:|---|
| `none` | No | Baseline run without the skill, to show what the skill adds |
| `current_worktree` | Yes | Measure the current local skill source |
| `branch` | Yes | Compare an edited branch to current or no-skill |
| `git_ref` | Yes | Compare a specific commit, tag, or detached ref |

The no-skill candidate is essential for capability evals. Without it, a passing
current-skill run may only prove that the base model already succeeds. The
comparison layer needs a `source_kind: none` baseline to answer whether the skill
adds measured value.

## Trial Staging

Before a trial runs, `staging.py` creates a workspace:

```text
.<skill-name>/workspaces/<run-id>/<trial-id>/
  task.md
  fixtures/
  skill/
```

Use **workspace** as the product term. It is the temporary directory where one
trial runs.

Staging enforces the hidden boundary:

- `task.md` is copied from the materialized visible task.
- Declared fixtures are copied under `fixtures/`.
- The candidate payload is copied under `skill/` when the candidate has one.
- Hidden case material, such as `judge.md`, `expected.*`, and `validate.*`,
  stays outside the workspace.
- Absolute paths, `..` escapes, and symlink fixture escapes are rejected.

This boundary is central to evaluation validity. A trial should not see the
answer key, judge guidance, human labels, or validator implementation unless the
visible task explicitly includes that content.

### What The Agent Sees

For a candidate with a skill payload, a staged workspace looks like this:

```text
workspaces/<run-id>/<trial-id>/
  task.md                  # visible prompt
  fixtures/...             # visible task files declared in the manifest
  skill/SKILL.md           # candidate payload
  skill/references/...     # runtime references packaged with the skill
```

For a `no-skill` candidate, there is no `skill/` folder. The agent gets the
same task and fixtures without the skill payload. This makes the baseline and
current-skill runs comparable.

## Runner Architecture

`runner.py` creates a run, plans trials, stages workspaces, invokes a
runner, captures response text, folds evidence, and appends result rows.

Run planning loops over:

```text
selected tasks x selected candidates x repetitions
```

Trial IDs use:

```text
<task-id>.<candidate-id>.t<repetition>
```

Example:

```text
implicit-auth-fix.current.t1
```

`eval run --runner auto` resolves to the manifest default runner, then to
`codex_app_server` if no default is present. The only concrete runner value is
`codex_app_server`, which runs through the `openai-codex` Python SDK.

The runner writes:

- `events/<trial-id>.jsonl`
- `candidates/<candidate>/<trial-id>/response.md`
- `evidence/<trial-id>.json`
- `results.jsonl`
- `progress.jsonl`

### Runner State Machine

Each trial moves through runner states in `progress.jsonl`.

```text
queued -> running -> passed
queued -> running -> failed
```

The code also reserves states such as `awaiting_approval`, `blocked`,
`timed_out`, `interrupted`, `graded`, and `degraded` for broader runner
reporting. The current sequential runner appends queued, running, and the final
status for each trial.

This state is about process completion. A trial can be `passed` as a runner
status and still fail behavior grading if the response is wrong.

### App Server Runner

The App Server boundary lives under `meta_skill/app_server/`.

`client.py` imports the `openai_codex` SDK and verifies the symbols Meta-Skill
needs. `policy.py` fixes the current eval policy to:

- sandbox: `workspace_write`
- approval mode: `deny_all`

`trial.py` starts a persistent Codex thread with `ephemeral=False`, sends the
candidate payload as a `SkillInput` when present, and sends the visible task as
a `TextInput`. `evidence.py` streams events into
`events/<trial-id>.jsonl`, folds the final assistant response, and normalizes
token usage when the SDK reports it.

Meta-Skill owns the eval workbench and evidence files. It does not own the
Codex runtime itself and should not modify OpenAI's base runtime source.

### Transcript Capture

Transcript evidence has two files:

```text
events/<trial-id>.jsonl
evidence/<trial-id>.json
```

They are not duplicates. They represent two levels of detail.

| File | What it is | Why it exists |
|---|---|---|
| `events/<trial-id>.jsonl` | Raw event stream from the runner | Full-fidelity audit trail for messages, tool events, completion events, and usage events |
| `evidence/<trial-id>.json` | Compact folded evidence | Quick lookup for reports, graders, and human review |

For a trial such as `implicit-auth-fix.current.t1`, the files are:

```text
.<skill-name>/runs/<run-id>/events/implicit-auth-fix.current.t1.jsonl
.<skill-name>/runs/<run-id>/evidence/implicit-auth-fix.current.t1.json
```

The raw event file is intentionally detailed and can be noisy. It is the place
to inspect mid-conversation behavior: tool calls, skipped validation, approval
behavior, retries, or a hidden failure before a polished final response.

The compact evidence file is the folded view. It stores fields such as:

- `thread_id`
- `turn_id`
- `thread_persistence`
- `response_text`
- `usage`
- `status`
- `warnings`
- SDK/runtime metadata

Reports and human review packets use compact evidence when they need a quick
summary. Graders can still use raw events when the judge guidance asks about process
behavior.

## Run Files

`run.json` is written before execution starts. It records:

- `run_id`
- `suite`
- `project`
- `runner`
- `created_at`
- resolved `candidates[]`
- queued `trials[]`

`progress.jsonl` is append-only runner status. It records queued, running, and
terminal status changes. Runner completion is not answer quality.

`results.jsonl` has one row per executed trial. Rows include:

- `trial_id`
- `case_id`
- `candidate`
- `repetition`
- `status`
- runner identity
- thread and turn IDs when the runner provides them
- sandbox and approval policy
- event, evidence, and response paths
- usage when available
- timestamps, duration, error, and runner detail

`events/<trial-id>.jsonl` is raw runner transcript. For App Server, each line
contains the SDK event method and JSON-serializable payload.

`evidence/<trial-id>.json` is compact evidence for reports and human review.
It stores thread ID, turn ID, response text, usage, status, warning list, and
SDK/runtime metadata when available.

`candidates/<candidate>/<trial-id>/response.md` stores the agent's final
assistant response. Run rows use `response_path` for that artifact.

`grades.jsonl` starts empty and is written by `eval grade` or `eval human`.

### Run File Reference

| File | Written by | Read by | Meaning |
|---|---|---|---|
| `run.json` | `eval run` before execution | progress, report, compare, human review | Selected suite, project, runner, candidates, and queued trials |
| `progress.jsonl` | `eval run` during execution | `eval progress` | Runner status timeline |
| `results.jsonl` | `eval run` after each trial | grade, progress, report, compare, human review | Per-trial execution summary and artifact paths |
| `events/<trial-id>.jsonl` | runner | graders, report, human review | Raw transcript |
| `events/<trial-id>.judge.jsonl` | model judge | report, debugging | Raw judge transcript |
| `evidence/<trial-id>.json` | runner | report, human review | Compact folded trial evidence |
| `candidates/<candidate>/<trial-id>/response.md` | runner | graders, report, human review | Agent response |
| `grades.jsonl` | `eval grade`, `eval human` | report, compare, human review | Behavioral judgment rows |

### Result Versus Grade

`results.jsonl` answers: did the runner execute the trial, where are the
artifacts, and what runtime metadata was captured?

`grades.jsonl` answers: was the outcome good according to the selected
criteria?

Keeping those separate prevents a common eval mistake. A trial that completes
without crashing is not necessarily a successful task. Conversely, a task may
have enough evidence to fail behaviorally even when the runner status is
`passed`.

## Grader Architecture

Grading is implemented in `grading.py`. It reads `results.jsonl`, loads the
manifest, resolves each task folder, chooses graders, and writes `grades.jsonl`.

Meta-Skill supports three grader kinds.

Each grade row has the same core shape:

```json
{
  "run_id": "run-20260614T182210Z-abc123",
  "case_id": "implicit-auth-fix",
  "candidate": "current",
  "trial_id": "implicit-auth-fix.current.t1",
  "grader": { "kind": "model", "id": "expectations" },
  "metric": "quality",
  "score": 1.0,
  "label": "pass",
  "rationale": "The response contains exactly one valid Conventional Commit subject.",
  "gate": false,
  "evidence_refs": [
    ".<skill-name>/runs/<run-id>/candidates/current/implicit-auth-fix.current.t1/response.md"
  ]
}
```

`label` is the main decision field. `score` is useful when the metric is
continuous, but the report logic cares about labels and gates when deciding
pass/fail impact.

### Code Graders

Code graders run task-local validators such as `validate.py` or `validate.sh`.
Validator commands receive:

```sh
--output <response.md> --events <events.jsonl> --json
```

If an `expected.*` file exists, the validator also receives:

```sh
--expected <expected-file>
```

Validators must print JSON with enough information to derive pass/fail checks.
Validator failure or invalid JSON becomes a failing grade.

Use code graders for exact output, file, state, artifact, and transcript checks.
Mark required validators with `gate: true` or `required: true`; gate failure
blocks promotion even if a model grade improves.

Code graders are best when the answer can be checked mechanically. Examples:

- the response exactly matches an expected file,
- a generated CSV has required columns,
- a patch creates a file,
- the transcript contains or does not contain a tool call,
- a JSON artifact validates against a schema.

Code graders are weak for taste, style, strategic usefulness, and open-ended
semantic quality unless those qualities can be converted into objective checks.

### Model Graders

Model graders use App Server through `app_server/judge.py`. They receive:

- hidden judge guidance from `judge.md` or a generated expectation judge guidance
- the visible task text
- agent response text
- `expectations[]`
- `expected_output` or an `expected.*` file when present
- a bounded slice of runner events for transcript-aware judgment

The judge prompt requires JSON with:

- `score`
- `label`
- `rationale`
- `checks`
- `eval_feedback`

Labels are:

- `pass`
- `partial`
- `fail`
- `unknown`

Judge events are written to `events/<trial-id>.judge.jsonl`.

Use model graders for semantic quality, groundedness, freeform outputs,
multi-valid-answer tasks, and source quality. Use transcript evidence only when
process behavior, tool use, activation, or missing evidence is part of the
requirement.

Model graders are best when many good answers are possible. Examples:

- did the answer preserve the user's constraint,
- did it explain the architecture accurately,
- did it avoid activating a skill on a near-miss prompt,
- did it ground claims in visible evidence,
- did it choose a useful repair strategy.

Model graders are weaker when the requirement is exact and cheap to check with
code. If a validator can prove the candidate, prefer the validator.

### Human Graders

Human graders are first-class. A declared human grader creates a pending grade
with label `unknown`. `eval human` has two modes:

- Packet mode shows the response path, event path, evidence path, existing human
  grade rows, and review guidance.
- Record mode writes or replaces one human grade row.

Record mode requires a trial, grader ID, metric, label, and rationale. Scores
are optional and must be between 0 and 1. When a pending human grade is replaced
with a real human label, gate metadata is preserved from the manifest.

Use human graders for taste, domain expertise, calibration, and accept/reject
decisions where a model judge could drift. Human judgments should be converted
into clearer judge guidance or reference examples when they represent a reusable
standard.

Human graders are not a different kind of task. They are a judgment source over
the same trial outputs. The normal flow is:

```text
eval grade creates pending human row
eval human --run <run> --trial <trial> --json shows review packet
user reviews task, response, transcript pointers, and judge guidance
eval human ... --label <label> --rationale <why> records the judgment
judge guidance is improved if the human judgment should become reusable
```

This is how Meta-Skill turns Rishi's taste or domain judgment into a more stable
future model judge without pretending the model already knew that standard.

## Eval Lint

`eval lint` performs static checks on `.<skill-name>/evals.json`; it does not
execute an agent or grade behavior.

It reports:

- task count
- task type distribution
- grader kind distribution
- human grader count
- transcript-aware grader count
- warnings for missing task seeds, missing grader guidance, missing reference
  material, incomplete human metrics, code graders without paths, and
  unbalanced trigger suites

It also emits general recommendations:

- code where exact
- model where semantic
- human where judgment or calibration is required
- transcript-aware only when process behavior matters
- compare no-skill and current-skill before claiming lift
- inspect failed or surprising transcripts before editing

Static lint is intentionally pre-run. It can warn that a suite is probably weak,
but it cannot say whether a skill works. That requires execution and grading.

## Reports And Comparison

`report.py` is read-only. `eval report` renders existing run files without
rerunning trials or regrading outputs.

The report model distinguishes:

- runner completion: whether the process finished
- behavioral grades: whether the outcome passed the checks
- gates: whether required checks failed
- missing evidence: ungraded trials, missing results, missing usage, invalid
  judge JSON, or human-review labels
- impact: whether a payload candidate improves, regresses, both fails, baseline
  already succeeds, or needs human review

`eval compare` is the lightweight decision command. It validates requested
baseline and candidate names, loads the relevant run files, computes
per-task impact, and returns one recommendation:

- `promote_for_measured_scope`
- `promising_with_failures`
- `reject_or_revise`
- `no_skill_lift_detected`
- `needs_more_evidence`

Comparison requires a baseline candidate with `source_kind: none` and at least
one non-baseline payload candidate.

### Impact Categories

The comparison layer reduces baseline and candidate behavior states into a task
impact category.

| Baseline state | Candidate state | Impact | Meaning |
|---|---|---|---|
| `fail` | `pass` | `candidate_improves` | The skill or attempt appears to add measured value |
| `pass` | `fail` | `candidate_regresses` | The skill or attempt made this task worse |
| `fail` | `fail` | `both_fail` | Neither candidate solved the task |
| `pass` | `pass` | `baseline_already_succeeds` | The task does not show skill lift because baseline already passes |
| `unknown` | any | `needs_more_evidence` | Baseline evidence is not decisive |
| any | `unknown` | `needs_more_evidence` | Candidate evidence is not decisive |

This is why reports separate runner status from behavior. A completed trial with
an ungraded or partial outcome becomes `unknown` for comparison, not a clean
pass.

### Recommendation Categories

`eval compare` converts the impact rows into a recommendation:

| Recommendation | Meaning |
|---|---|
| `promote_for_measured_scope` | Candidate improves the measured tasks without observed failures in that scope |
| `promising_with_failures` | Candidate improves at least one task but still has failing tasks |
| `reject_or_revise` | Candidate regresses on at least one task |
| `no_skill_lift_detected` | Baseline already succeeds on the measured tasks |
| `needs_more_evidence` | Missing grades, unknowns, or absent comparable rows block a decision |

## Validation And Packaging

`validate` is implemented by package modules under `meta_skill/`. It combines
skill structure validation with authoring lint checks.

It checks:

- `SKILL.md` exists
- YAML frontmatter parses
- required frontmatter fields exist
- unknown frontmatter keys are flagged
- body content exists
- current authoring lint rules pass

`package` is implemented by `packaging.py`. It validates first, then writes a
zip artifact and package metadata. Package output defaults to:

```text
<skill-dir>/.<skill-name>/dist/
```

Package archives exclude:

- `.DS_Store`
- `.git`
- `.<skill-name>`
- `__pycache__`
- `dist`

That exclusion keeps private workbench material, generated artifacts, and local
state out of portable skill payloads.

## Packaging And Generated Packages

The repo uses `scripts/package-plugins.sh` to package source plugins into
ignored Codex and Claude package directories under `dist/`.

For Meta-Skill, the package script copies:

- `plugins/meta-skill/skills/` to generated `skills/`
- `plugins/meta-skill/references/` to generated `references/`
- `plugins/meta-skill/scripts/` to generated `scripts/`
- `plugins/meta-skill/src/` to generated `src/`

It also regenerates vendor-specific plugin manifests and marketplace entries.
Install or refresh local plugins with the Codex plugin CLI after packaging.

When editing anything under `meta-skill/`, run:

```sh
scripts/package-plugins.sh
```

Do not hand-edit generated plugin package files under `dist/`. If generated
files differ from source, regenerate them from source.

## End-To-End Evaluation Flow

This is the intended path from authored eval prompts to an evidence-backed
decision.

1. `skill-writer` creates or updates the skill payload.
2. If eval material is in scope, `skill-writer` creates
   `.<skill-name>/evals.json` as a prompt manifest with realistic prompts,
   expectations, grader hints, and baseline/current candidates.
3. `skill-evaluator` runs `eval lint` to check manifest shape and grader
   coverage.
4. `skill-evaluator` runs `eval materialize` to create task folders.
5. A human or agent edits materialized task files, fixtures, judge guidance, expected
   outputs, and validators as needed.
6. `skill-evaluator` runs `eval run` for selected candidates, tasks, and
   repetitions.
7. The runner stages one workspace per trial and captures events,
   response text, compact evidence, and result rows.
8. `skill-evaluator` runs `eval grade` to execute code validators, model judges,
   and pending human grader rows.
9. If human judgment is needed, `skill-evaluator` uses `eval human` to present
   review packets and record labels with rationales.
10. `skill-evaluator` runs `eval compare` or `eval report` to summarize the
    evidence.
11. When a recurring release, trigger, regression, or quality decision needs
    history, `skill-benchmarker` creates or runs a benchmark profile and renders
    a scorecard over the eval artifacts.
12. If the result shows a fixable defect, the issue routes to `skill-doctor`.
13. After approved source edits, validation and, if needed, evaluation rerun
    before packaging or sync.

## Current Boundaries And Future Work

Current boundaries:

- Meta-Skill edits source plugin files, not generated package copies.
- Meta-Skill uses the `openai-codex` SDK but does not
  modify OpenAI Codex runtime source.
- Writer emits eval manifests as authoring handoff material; evidence only
  exists after evaluator runs, grades, compares, and reports.
- Doctor can run focused verification, but systematic measurement belongs to
  Evaluator.
- Evaluator measures selected candidates; it does not autonomously create new
  candidate improvements.
- Benchmarker owns recurring benchmark profiles and scorecards over evaluator
  artifacts; it does not author the first-pass suite or fix the target.

Future work can add an optimization or autoresearch layer, but it should sit on
top of the existing evaluator and benchmarker boundaries instead of collapsing
the lifecycle split. A future experiment ledger should link multiple runs,
candidate edits, rejected attempts, and promotion decisions only when repeated
optimization needs that history.

## Validation Commands For Contributors

After editing Meta-Skill source, run the focused checks first:

```sh
python3 meta-skill/src/characterize_meta_skill.py
plugins/meta-skill/scripts/metaskill validate meta-skill/skills/skill-writer --json
plugins/meta-skill/scripts/metaskill validate meta-skill/skills/skill-doctor --json
plugins/meta-skill/scripts/metaskill validate meta-skill/skills/skill-evaluator --json
plugins/meta-skill/scripts/metaskill validate meta-skill/skills/skill-benchmarker --json
```

Before committing changes under `meta-skill/`, run:

```sh
scripts/package-plugins.sh
```

Then inspect generated Meta-Skill package diffs under:

```text
dist/codex/plugins/meta-skill/
dist/claude/plugins/meta-skill/
```

## Source Map

Use these files when refreshing this document:

- `meta-skill/skills/meta-skill/SKILL.md`: router and lifecycle sequencing.
- `meta-skill/skills/skill-writer/SKILL.md`: authoring workflow and eval
  manifest handoff.
- `meta-skill/skills/skill-doctor/SKILL.md`: review, diagnose, edit, verify.
- `meta-skill/skills/skill-evaluator/SKILL.md`: suite, candidate, trial,
  grading, and reporting workflow.
- `meta-skill/skills/skill-benchmarker/SKILL.md`: recurring benchmark profiles,
  runs, scorecards, gates, and history.
- `meta-skill/references/cli.md`: command reference and authoritative run file
  descriptions.
- `meta-skill/src/meta_skill/cli.py`: command parser and dispatch.
- `meta-skill/src/meta_skill/manifest.py`: prompt manifest normalization and
  suite validation.
- `meta-skill/src/meta_skill/workbench.py`: workbench initialization and case
  materialization.
- `meta-skill/src/meta_skill/candidates.py`: candidate source resolution and
  payload digesting.
- `meta-skill/src/meta_skill/staging.py`: workspace staging and hidden
  boundary enforcement.
- `meta-skill/src/meta_skill/runner.py`: trial planning, runner invocation, run
  files, progress, and results.
- `meta-skill/src/meta_skill/app_server/`: App Server SDK boundary, event
  folding, judge calls, sandbox, and approval policy.
- `meta-skill/src/meta_skill/grading.py`: code, model, and human graders.
- `meta-skill/src/meta_skill/report.py`: run listing, reports, impact, and
  comparison recommendations.
- `meta-skill/src/meta_skill/linting.py`: static eval manifest lint.
- `meta-skill/src/meta_skill/validation.py`: skill validation bridge.
- `meta-skill/src/meta_skill/packaging.py`: portable payload packaging.
- `scripts/package-plugins.sh`: source-to-generated plugin packaging.
