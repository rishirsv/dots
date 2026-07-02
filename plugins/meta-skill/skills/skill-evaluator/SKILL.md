---
name: skill-evaluator
description: "Use when creating or running an eval suite for a skill or other target. Builds tasks, graders, validations, and reports that compare baseline and candidate outcomes. Not for authoring new skills, one-off diagnosis or fixes, generating candidate changes, or recurring eval presets."
---

# Skill Evaluator

Build evaluation suites for a target and run the parts the harness can
execute. A suite runs the same tasks against one or more agent-harness
candidates, such as no skill, the current skill, or a named candidate skill.
The evaluator records what happened; it does not edit the target or generate
candidate changes.

Use two kinds of checks: **evaluations** (semantic, judge- or human-graded
task outcomes) and **validations** (deterministic pass/fail checks). For
other artifacts, first define the artifact entry mode: what artifact is
supplied, what task runs, what outcome is graded, and what runner or manual
path can produce that evidence.

Keep the lane narrow: measure behavior, explain what passed or failed, make
unknown evidence and coverage limits visible, then route fixes to
`skill-doctor`. User-facing answers should lead with the decision the
evidence supports.

## Evaluation Posture

Assume the user does not know what an eval is. Guide them through the
decision: whether an eval is worth running, what evidence would be fair,
which runner fits, where human judgment is needed, and what conclusion the
evidence can and cannot support. Keep guidance outcome-first — desired
decision, success criteria, available evidence, constraints, final artifact —
and avoid rigid step-by-step process unless order affects validity. Name a
reasonable default when setup requires one. When the user is unsure, offer
the smallest useful next step; when evidence is missing, say what is missing
and how to get it. Treat `unknown`, calibration gaps, and coverage limits as
useful signals, not failures to hide.

For an agent skill, use the built-in defaults: output-quality dimensions,
triggering tasks, and shipped general checks. For any other artifact, use
[references/generalist.md](references/generalist.md).

## Workbench

Artifacts live in the hidden workbench at the target skill's project root:
`<project>/.<skill-name>/`, where `<skill-name>` comes from the target
payload's `SKILL.md` frontmatter when available. The portable payload remains
the target skill directory; the hidden workbench is development state. See
[run-layout.md](../../references/run-layout.md) for the run-directory tree.
Authority is split cleanly: `evals.json` owns all metadata (suite membership,
defaults, runner plan, candidate guidance, repetition counts, materialization
intent); task folders own authored content; `runs/<run-id>/` owns what
actually ran.

`task.md` contains only visible agent bytes. Never put front matter, hidden
judge guidance, expected outputs, validator hints, grader notes, or harness
metadata in `task.md`.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Smallest eval loop, comparing candidates, or skipping a suite | [references/methodology.md](references/methodology.md) |
| Eval type, grader mix, example task shape | [references/eval-types.md](references/eval-types.md) |
| Tune skill activation and `description` routing | [references/trigger-tuning.md](references/trigger-tuning.md) |
| Author `evals.json` and materialize task folders | [references/evaluations.md](references/evaluations.md) |
| Calibrate an LLM judge against human labels | [references/judge-calibration.md](references/judge-calibration.md) |
| Run guided human review and collect labels | [references/human-grading.md](references/human-grading.md) |
| Author deterministic `validate.*` checks | [references/validations.md](references/validations.md) |
| Guided-user interaction patterns, intake shape, routing table | [references/examples.md](references/examples.md) |
| Evaluate a non-skill artifact | [references/generalist.md](references/generalist.md) |
| Turn a Codex thread into improvement evidence | [thread-skill-improvement.md](../../references/thread-skill-improvement.md) |
| Static skill quality and payload hygiene | [judge-rubric.md](../../references/judge-rubric.md), [payload-hygiene.md](../../references/payload-hygiene.md) |
| CLI for materialize, run, progress, grade, validate | [cli.md](../../references/cli.md) |

## Vocabulary

See [eval-vocabulary.md](../../references/eval-vocabulary.md) for
suite/task/candidate/trial/transcript/outcome/grader terms and schema field
naming rules. This lane also uses **run**, **quality loop**, **trigger
tuning**, **judge alignment**, **one-off check**, **eval suite**, **eval
preset** (owned by `skill-benchmarker`), and **no suite yet** — defined in
[references/examples.md](references/examples.md) and
[references/methodology.md](references/methodology.md).

## Workflow

### 1. Guided Intake

Translate the user's request into a decision, identify the smallest useful
path, and explain what that path can prove. Start from error analysis when
possible: ask what real traces, user reports, manual review findings,
previous failures, release checks, or common workflows already exist. If
none exist, suggest a tiny exploratory review or quality loop before building
infrastructure.

When the real trace is a Codex thread and the user wants an existing skill
improved from it, read
[thread-skill-improvement.md](../../references/thread-skill-improvement.md);
use `sessions extract` for the handoff packet, then turn only realistic
thread prompts into eval seeds when measured candidate evidence is needed. If
the packet shows one concrete source defect instead, route to `skill-doctor`.

Disambiguate static review from behavioral measurement consistently — see the
lane-ownership split in
[meta-skill/SKILL.md](../meta-skill/SKILL.md#routing-and-skill-selection).
When authoring skill-quality eval tasks, use
[judge-rubric.md](../../references/judge-rubric.md) and
[payload-hygiene.md](../../references/payload-hygiene.md); keep those
expectations hidden in `judge.md`, `expectations[]`, or validators, and never
stage hidden grader guidance into `task.md`.

Before authoring or running anything, use the intake shape and routing table
in [references/examples.md](references/examples.md) to name the smallest
evidence plan and confirm it with the user when a missing decision would
change the eval path, runner, external writes, or human-review standard.

### 2. Scope

Name the decision the suite should support, the target, and the target's job.
Pick the route (skill defaults or generalist judge guidance builder), state
whether triggering is in scope, and choose the eval type and grader mix with
[references/eval-types.md](references/eval-types.md); for description or
activation questions, read [references/trigger-tuning.md](references/trigger-tuning.md).
Check "When Not To Evaluate" in
[references/methodology.md](references/methodology.md) first — "not worth a
suite yet" is a successful outcome when it is the honest answer.

### 3. Author The Suite Manifest And Materialize Task Folders

Write or update `.<skill-name>/evals.json` — see
[references/evaluations.md](references/evaluations.md). Keep metadata minimal:
target, defaults, tasks, repetition counts, runner intent, candidate
selection, materialization intent, optional expectations, and optional
grader declarations. Do not put hidden metadata in `task.md`, and do not
create another metadata file in task folders.

Create `.<skill-name>/cases/<task-id>/task.md` and optional fixtures,
`judge.md`, expected output, and validator files. `task.md` is the prompt
shown to the agent; hidden files stay outside the workspace. Make each task's
success criteria clear enough that a domain reviewer could tell whether a
good agent should pass.

### 4. Author Graders

Author deterministic checks — see [references/validations.md](references/validations.md).
General checks already ship with the plugin. Add task-local `validate.*` files
only when a task needs exact, deterministic checks. Choose the grader mix with
[references/eval-types.md](references/eval-types.md#choose-the-grader-mix);
prefer binary pass/fail checks first and use the label scale in
[eval-vocabulary.md](../../references/eval-vocabulary.md).

Use explicit `graders[]` entries when a task needs named metrics, required gates,
or stable report fields. Use `expectations[]` for hidden model-judge checks that
are visible to the grader but not to the agent. Mark must-not-break code
validators with `gate: true`; a gate failure records a failed state for that
measured check even when a model judge score is high.

### 5. Calibrate

Before trusting a judge at scale, align it against human grades — see
[references/judge-calibration.md](references/judge-calibration.md) for the
spot-check vs train/validation/test decision and critique shadowing. If the
decision depends on human taste, collect labels with `eval human` (see
[references/human-grading.md](references/human-grading.md)), then revise
`judge.md` so the model judge matches the human standard.

Run `eval calibrate --run <run-id-or-path>` to compare model and human
grades; it writes a calibration artifact under
`.<skill-name>/calibrations/`. Report paired labels, disagreements, and the
scope where the judge matched human review — do not broaden that claim beyond
the checked slice.

### 6. Run And Report

Use App Server for eval suites: multiple tasks, repetitions, baseline
comparison, grading, or any decision that needs repeatability. The CLI
accepts only `codex_app_server` as a concrete eval runner; run through the
plugin adapter, consuming run artifacts and progress files rather than
calling raw App Server JSON-RPC directly. Run
`<meta-skill-root>/scripts/metaskill doctor --json` before the first formal
suite on a machine, or when runner readiness is uncertain.

Use direct Codex threads or subagents only for exploration — one-off checks,
research, or repair work that may later seed a suite — via the child-thread
workflow in [skill-trial-runs.md](../../references/skill-trial-runs.md). Do
not turn those threads into formal eval trials with eval-labeled or
candidate-labeled prompts; when setup metadata must be embedded in the
prompt, mark the result as a forced harness run with a prompt-contamination
coverage limit. Route doctor fixes and failure reproduction to
`skill-doctor`.

After grading, render the run with
`<meta-skill-root>/scripts/metaskill eval report --run <run-id>` (see
[cli.md](../../references/cli.md)) instead of hand-assembling a summary from
run files. `eval run` always preflight-lints before running (use `eval run
--check` to lint only); use `eval human` for human review packets or labels,
`eval calibrate` for judge/human agreement artifacts, and `eval list` to find
earlier runs.

Report per-task outcomes, grades, aggregate performance, failed tasks, and the
baseline-vs-candidate result. When repeated checks exist, summarize them as
counts, for example: `Repeated 5 times: Passed: 1. Failed: 4. Result:
inconsistent; do not treat this as reliable.` Hand fixes to `skill-doctor`.

## Output

Close with: suite location; what was authored, run, and skipped; headline
counts and comparison rows; calibration status and disagreements (or why
skipped); failure triage (skill/grader/harness failure, task ambiguity, model
variance, environment failure, or intentional expected change); failed tasks
handed to `skill-doctor`; and coverage limits. A green suite is not proof of
full coverage.

## Guardrails

- Author and measure; route fixes to `skill-doctor`.
- Keep all metadata in `evals.json`; keep `task.md` visible-only and hidden
  files out of the workspace.
- Use candidate/task/trial/outcome/grader in prose and manifest fields.
- Calibrate a judge before trusting its scores at scale.
- Report coverage limits, not just pass rates.
