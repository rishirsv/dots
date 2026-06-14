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
knowledge for the Meta-Skill plugin itself. It is not the same as a target
skill's generated eval workbench. Temporary planning artifacts should not live
there; keep durable docs such as this architecture reference and source-grounded
research reports.

## Plugin Lifecycle Model

Meta-Skill models skill work as a lifecycle with clear ownership boundaries.

| Specialist | Source | Owns | Does not own |
|---|---|---|---|
| Router | `skills/meta-skill/SKILL.md` | Entry routing, lifecycle sequencing, handoff preservation | Specialist workflow details |
| Writer | `skills/skill-writer/SKILL.md` | New skill authoring, trigger contracts, runtime payload shape, optional eval manifest handoff | Existing-skill fixes, measurement, packaging/sync |
| Doctor | `skills/skill-doctor/SKILL.md` | Existing-skill review, diagnosis, approved edits, focused verification | Greenfield authoring, formal evaluation suites |
| Evaluator | `skills/skill-evaluator/SKILL.md` | Evaluation suites, conditions, trials, grading, human review, reports | Fixing the target or generating autonomous candidate improvements |

The router is the only broad trigger. Worker skills have narrow descriptions and
should defer when the request belongs to another lifecycle stage.

Typical flows:

- New skill: `meta-skill` routes to `skill-writer`.
- New skill with eval handoff: `skill-writer` authors payload and
  `.meta-skill/evals.json`; `skill-evaluator` later materializes and runs it.
- Existing skill bug: `skill-doctor` reviews or diagnoses, proposes, edits only
  after explicit approval, then verifies.
- Outcome measurement: `skill-evaluator` compares no-skill, current-skill, and
  edited-skill conditions.
- Evaluation reveals a defect: `skill-evaluator` reports the failing tasks and
  hands repair back to `skill-doctor`.

## Vocabulary

Meta-Skill uses user-facing product terms even when an older file field still
uses legacy wording.

| Product term | Current file or schema surface |
|---|---|
| Suite | `.meta-skill/evals.json` plus its materialized workbench |
| Task | One evaluation row and one folder under `.meta-skill/cases/<task-id>/` |
| Condition | One harness setup, such as `no-skill`, `current`, or an edited attempt; stored as `conditions[]` in prompt manifests and as `candidate`/`candidates[]` in normalized files |
| Trial | One task executed once under one condition |
| Transcript | `events/<trial-id>.jsonl` plus compact `evidence/<trial-id>.json` |
| Outcome | The response in `candidates/<condition>/<trial-id>/response.md` plus any produced artifacts |
| Grader | A code, model, or human judgment row in `grades.jsonl` |

Use `condition` when explaining an eval to a user. Use `candidate` only when
pointing at a concrete JSON field, path segment, or compatibility alias.

## Shared CLI

The Meta-Skill CLI is the shared automation surface for every specialist. It
lives in `meta-skill/src/` and is launched from the repo as:

```sh
scripts/meta-skill <command>
```

Installed plugin packages expose the same CLI at:

```sh
<plugin-root>/src/meta-skill <command>
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
scripts/meta-skill doctor [--json]
scripts/meta-skill workbench init [--target <path>] [--dry-run] [--json]
scripts/meta-skill eval lint [--suite .meta-skill/evals.json] [--json]
scripts/meta-skill eval materialize [--suite .meta-skill/evals.json] [--force] [--json]
scripts/meta-skill eval run [--suite .meta-skill/evals.json] [--runner auto|codex_app_server|codex_exec] [--conditions <ids>] [--split <name>] [--repetitions <n>] [--model <id>] [--json]
scripts/meta-skill eval progress --run <run-id-or-path> [--watch] [--json]
scripts/meta-skill eval grade --run <run-id-or-path> [--json]
scripts/meta-skill eval human --run <run-id-or-path> [--trial <trial-id>] [--grader <id>] [--metric <name>] [--label <label>] [--score <0-to-1>] [--rationale <text>] [--json]
scripts/meta-skill eval compare --run <run-id-or-path> [--baseline <condition>] [--candidate <condition>] [--json]
scripts/meta-skill eval list [--suite .meta-skill/evals.json] [--json]
scripts/meta-skill eval report --run <run-id-or-path> [--out <file>] [--json]
scripts/meta-skill validate <skill-dir> [--json]
scripts/meta-skill package <skill-dir> [--out-dir <dir>] [--json]
```

The implementation entrypoint is `meta_skill/cli.py`. It dispatches to modules
that own one area: `workbench.py`, `manifest.py`, `runner.py`, `grading.py`,
`report.py`, `validation.py`, and `packaging.py`.

## Hidden Workbench

Each target skill or project can have a hidden workbench at
`<project>/.meta-skill/`. For ordinary target projects, that workbench stores
authoring notes, eval manifests, materialized tasks, runs, solver workspaces,
package artifacts, and reports. For the Meta-Skill plugin itself,
`meta-skill/.meta-skill/docs/` is committed durable project documentation.

The evaluator workbench shape is:

```text
.meta-skill/
  evals.json
  cases/
    <task-id>/
      task.md
      fixtures/
      rubric.md
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
        <condition>/
          <trial-id>/
            response.md
  solver-workspaces/
    <run-id>/
      <trial-id>/
        task.md
        fixtures/
        skill/
```

Authority is split by artifact:

- `.meta-skill/evals.json` owns suite metadata: target, defaults, conditions,
  tasks, splits, repetitions, fixtures, expectations, and grader declarations.
- `.meta-skill/cases/<task-id>/` owns authored task material after
  materialization.
- `.meta-skill/runs/<run-id>/` owns what actually ran and what was graded.
- `.meta-skill/solver-workspaces/` is temporary staged input for a trial, not
  the authoritative result.

`task.md` is visible solver input. Do not put hidden rubrics, expected output,
validator hints, metadata, grades, or harness notes in `task.md`.

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
  "conditions": [
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

- `conditions[].id` becomes `candidate`.
- `conditions[].label` becomes `display`.
- `evals[]` becomes `cases[]`.
- `prompt` becomes the materialized task seed.
- `files` or `fixtures` become fixture declarations.
- `expected_output`, `expectations`, and `graders` become hidden grader-side
  material.

The loader still accepts legacy `schema_version/cases/candidates` suites. That
compatibility is a read-side bridge for existing workbench material; the default
manifest written by `workbench init` is the prompt-manifest shape.

Allowed condition source kinds:

- `none`: no skill payload. Used for baseline conditions.
- `current_worktree`: the current project checkout.
- `branch`: a git branch materialized into a detached worktree for the run.
- `git_ref`: any git ref materialized into a detached worktree for the run.

Case and condition IDs must be lowercase slugs.

## Workbench Initialization And Materialization

`workbench init` creates the minimum workbench directories and seeds
`.meta-skill/evals.json` when it is missing:

```text
.meta-skill/
  cases/
  runs/
  tests/
  evals.json
```

If the target contains `SKILL.md`, the default target ref is `SKILL.md`. If not,
the default target ref is `skill/SKILL.md`, which supports projects that keep
portable skill payloads under a `skill/` folder.

`eval materialize` reads the normalized manifest and creates
`.meta-skill/cases/<task-id>/`. It writes the seeded task file, usually
`task.md`, and creates parent directories for declared fixtures. It does not
overwrite an edited task file unless `--force` is supplied.

Materialization keeps hidden evaluation data out of the solver prompt. The
solver sees the staged `task.md`, declared fixtures, and condition payload only.

## Condition Resolution And Payload Identity

`candidates.py` resolves each condition before a run starts.

For a `none` condition, Meta-Skill records git identity for the project but
stages no skill payload. For a `current_worktree` condition, it resolves the
target payload from the current project. For `branch` and `git_ref` conditions,
it creates a detached worktree under:

```text
.meta-skill/worktrees/<run-id>/<condition-id>/
```

Each payload receives a digest. The digest excludes generated and private
material:

- `.DS_Store`
- `.git`
- `.meta-skill`
- `__pycache__`
- `dist`

The digest proves what payload bytes were staged for a condition. It is distinct
from the git commit. A dirty worktree can still have a payload digest.

## Trial Staging

Before a trial runs, `staging.py` creates a solver workspace:

```text
.meta-skill/solver-workspaces/<run-id>/<trial-id>/
  task.md
  fixtures/
  skill/
```

Staging enforces the hidden boundary:

- `task.md` is copied from the materialized visible task.
- Declared fixtures are copied under `fixtures/`.
- The condition payload is copied under `skill/` when the condition has one.
- Hidden case material, such as `rubric.md`, `expected.*`, and `validate.*`,
  stays outside the solver workspace.
- Absolute paths, `..` escapes, and symlink fixture escapes are rejected.

This boundary is central to evaluation validity. A solver trial should not see
the answer key, grader rubric, human labels, or validator implementation unless
the visible task explicitly includes that content.

## Runner Architecture

`runner.py` creates a run, plans trials, stages solver workspaces, invokes a
runner, captures response text, folds evidence, and appends result rows.

Run planning loops over:

```text
selected tasks x selected conditions x repetitions
```

Trial IDs use:

```text
<task-id>.<condition-id>.t<repetition>
```

Example:

```text
implicit-auth-fix.current.t1
```

`eval run --runner auto` resolves to the manifest default runner, then to
`codex_app_server` if no default is present. The concrete runner values are:

- `codex_app_server`: primary runner through the `openai-codex` Python SDK.
- `codex_exec`: fallback runner through the external `codex exec` command.

Both runners write:

- `events/<trial-id>.jsonl`
- `candidates/<condition>/<trial-id>/response.md`
- `evidence/<trial-id>.json`
- `results.jsonl`
- `progress.jsonl`

### App Server Runner

The App Server boundary lives under `meta_skill/app_server/`.

`client.py` imports the `openai_codex` SDK and verifies the symbols Meta-Skill
needs. `policy.py` fixes the current eval policy to:

- sandbox: `workspace_write`
- approval mode: `deny_all`

`trial.py` starts a persistent Codex thread with `ephemeral=False`, sends the
condition payload as a `SkillInput` when present, and sends the visible task as
a `TextInput`. `evidence.py` streams events into
`events/<trial-id>.jsonl`, folds the final assistant response, and normalizes
token usage when the SDK reports it.

Meta-Skill owns the eval workbench and evidence files. It does not own the
Codex runtime itself and should not modify OpenAI's base runtime source.

### Exec Fallback Runner

`exec_fallback.py` runs:

```sh
codex exec --json --cd <solver-workspace> --sandbox workspace-write --skip-git-repo-check --output-last-message <response-path> -
```

It sends the task prompt on stdin, writes stdout to the event file, and records
success or failure from the process return code. This runner is useful for
simple automation and environments where the SDK runner is unavailable, but App
Server is the primary path.

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

`candidates/<condition>/<trial-id>/response.md` stores the solver's final
assistant response. New artifacts use `response_path`; report and grading code
still tolerate older `final_path` or `output_path` fields as read-side
compatibility.

`grades.jsonl` starts empty and is written by `eval grade` or `eval human`.

## Grader Architecture

Grading is implemented in `grading.py`. It reads `results.jsonl`, loads the
manifest, resolves each task folder, chooses graders, and writes `grades.jsonl`.

Meta-Skill supports three grader kinds.

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

### Model Graders

Model graders use App Server through `app_server/judge.py`. They receive:

- hidden rubric text from `rubric.md` or a generated expectations rubric
- the visible task text
- solver response text
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
- `needs_human_review`

Judge events are written to `events/<trial-id>.judge.jsonl`.

Use model graders for semantic quality, groundedness, freeform outputs,
multi-valid-answer tasks, and source quality. Use transcript evidence only when
process behavior, tool use, activation, or missing evidence is part of the
requirement.

### Human Graders

Human graders are first-class. A declared human grader creates a pending grade
with label `needs_human_review`. `eval human` has two modes:

- Packet mode shows the response path, event path, evidence path, existing human
  grade rows, and review guidance.
- Record mode writes or replaces one human grade row.

Record mode requires a trial, grader ID, metric, label, and rationale. Scores
are optional and must be between 0 and 1. When a pending human grade is replaced
with a real human label, gate metadata is preserved from the manifest.

Use human graders for taste, domain expertise, calibration, and accept/reject
decisions where a model judge could drift. Human judgments should be converted
into clearer rubrics or reference examples when they represent a reusable
standard.

## Eval Lint

`eval lint` performs static checks on `.meta-skill/evals.json`; it does not
execute a solver or grade behavior.

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

## Reports And Comparison

`report.py` is read-only. `eval report` renders existing run files without
rerunning trials or regrading outputs.

The report model distinguishes:

- runner completion: whether the process finished
- behavioral grades: whether the outcome passed the checks
- gates: whether required checks failed
- missing evidence: ungraded trials, missing results, missing usage, invalid
  judge JSON, or human-review labels
- impact: whether a payload condition improves, regresses, both fails, baseline
  already succeeds, or needs human review

`eval compare` is the lightweight decision command. It validates requested
baseline and candidate condition names, loads the relevant run files, computes
per-task impact, and returns one recommendation:

- `promote_for_measured_scope`
- `promising_with_failures`
- `reject_or_revise`
- `no_skill_lift_detected`
- `needs_more_evidence`

Comparison requires a baseline condition with `source_kind: none` and at least
one non-baseline payload condition.

## Validation And Packaging

`validate` is implemented by `validation.py`. It bridges the canonical
validators in `meta-skill/src/validate_skill.py` and
`meta-skill/src/lint_authoring.py`.

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
<skill-dir>/.meta-skill/dist/
```

Package archives exclude:

- `.DS_Store`
- `.git`
- `.meta-skill`
- `__pycache__`
- `dist`

That exclusion keeps private workbench material, generated artifacts, and local
state out of portable skill payloads.

## Sync And Generated Packages

The repo uses `scripts/sync-plugins.sh` to package source plugins into Codex and
Claude plugin directories.

For Meta-Skill, the sync script copies:

- `meta-skill/skills/` to `plugins/codex/meta-skill/skills/` and
  `plugins/claude/meta-skill/skills/`
- `meta-skill/references/` to generated `references/`
- `meta-skill/src/` to generated `src/`

It also regenerates plugin manifests, marketplace entries, local plugin
installations, and local agent instructions through `scripts/sync-local-agents.sh`.

When editing anything under `meta-skill/`, run:

```sh
scripts/sync-plugins.sh
```

Do not hand-edit generated plugin package files under `plugins/codex/` or
`plugins/claude/`. If generated files differ from source, regenerate them from
source.

## End-To-End Evaluation Flow

This is the intended path from authored eval prompts to an evidence-backed
decision.

1. `skill-writer` creates or updates the skill payload.
2. If eval material is in scope, `skill-writer` creates
   `.meta-skill/evals.json` as a prompt manifest with realistic prompts,
   expectations, grader hints, and baseline/current conditions.
3. `skill-evaluator` runs `eval lint` to check manifest shape and grader
   coverage.
4. `skill-evaluator` runs `eval materialize` to create task folders.
5. A human or agent edits materialized task files, fixtures, rubrics, expected
   outputs, and validators as needed.
6. `skill-evaluator` runs `eval run` for selected conditions, tasks, and
   repetitions.
7. The runner stages one solver workspace per trial and captures events,
   response text, compact evidence, and result rows.
8. `skill-evaluator` runs `eval grade` to execute code validators, model judges,
   and pending human grader rows.
9. If human judgment is needed, `skill-evaluator` uses `eval human` to present
   review packets and record labels with rationales.
10. `skill-evaluator` runs `eval compare` or `eval report` to summarize the
    evidence.
11. If the result shows a fixable defect, the issue routes to `skill-doctor`.
12. After approved source edits, validation and, if needed, evaluation rerun
    before packaging or sync.

## Current Boundaries And Future Work

Current boundaries:

- Meta-Skill edits source plugin files, not generated package copies.
- Meta-Skill uses the `openai-codex` SDK and `codex exec` fallback but does not
  modify OpenAI Codex runtime source.
- Writer emits eval manifests as authoring handoff material; evidence only
  exists after evaluator runs, grades, compares, and reports.
- Doctor can run focused verification, but systematic measurement belongs to
  Evaluator.
- Evaluator measures selected conditions; it does not autonomously create new
  candidate improvements.

Future work can add an optimization or autoresearch layer, but it should sit on
top of the existing evaluator instead of collapsing the lifecycle split. A
future experiment ledger should link multiple runs, candidate edits, rejected
attempts, and promotion decisions only when repeated optimization needs that
history.

## Validation Commands For Contributors

After editing Meta-Skill source, run the focused checks first:

```sh
python3 meta-skill/src/characterize_meta_skill.py
scripts/meta-skill validate meta-skill/skills/skill-writer --json
scripts/meta-skill validate meta-skill/skills/skill-doctor --json
scripts/meta-skill validate meta-skill/skills/skill-evaluator --json
```

Before committing changes under `meta-skill/`, run:

```sh
scripts/sync-plugins.sh
```

Then inspect generated Meta-Skill package diffs under:

```text
plugins/codex/meta-skill/
plugins/claude/meta-skill/
```

## Source Map

Use these files when refreshing this document:

- `meta-skill/skills/meta-skill/SKILL.md`: router and lifecycle sequencing.
- `meta-skill/skills/skill-writer/SKILL.md`: authoring workflow and eval
  manifest handoff.
- `meta-skill/skills/skill-doctor/SKILL.md`: review, diagnose, edit, verify.
- `meta-skill/skills/skill-evaluator/SKILL.md`: suite, condition, trial,
  grading, and reporting workflow.
- `meta-skill/references/cli.md`: command reference and authoritative run file
  descriptions.
- `meta-skill/src/meta_skill/cli.py`: command parser and dispatch.
- `meta-skill/src/meta_skill/manifest.py`: prompt manifest normalization and
  suite validation.
- `meta-skill/src/meta_skill/workbench.py`: workbench initialization and case
  materialization.
- `meta-skill/src/meta_skill/candidates.py`: condition source resolution and
  payload digesting.
- `meta-skill/src/meta_skill/staging.py`: solver workspace staging and hidden
  boundary enforcement.
- `meta-skill/src/meta_skill/runner.py`: trial planning, runner invocation, run
  files, progress, and results.
- `meta-skill/src/meta_skill/app_server/`: App Server SDK boundary, event
  folding, judge calls, sandbox, and approval policy.
- `meta-skill/src/meta_skill/exec_fallback.py`: `codex exec` fallback runner.
- `meta-skill/src/meta_skill/grading.py`: code, model, and human graders.
- `meta-skill/src/meta_skill/report.py`: run listing, reports, impact, and
  comparison recommendations.
- `meta-skill/src/meta_skill/linting.py`: static eval manifest lint.
- `meta-skill/src/meta_skill/validation.py`: skill validation bridge.
- `meta-skill/src/meta_skill/packaging.py`: portable payload packaging.
- `scripts/sync-plugins.sh`: source-to-generated plugin packaging.
