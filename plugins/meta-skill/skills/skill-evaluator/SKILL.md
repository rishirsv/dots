---
name: skill-evaluator
description: "The measurement specialist within meta-skill: author and run evaluation suites for a target, using judge or human grading plus deterministic validations to compare no-skill baselines, current skills, and candidate skills. Reached through meta-skill's routing; invoke directly only when named. Not for authoring new skills, one-off diagnosis/fixes, candidate generation, or recurring benchmark profiles."
---

# Skill Evaluator

Author an **evaluation suite** for a target and run the parts that can be
mechanized. The evaluator runs the same tasks under different agent-harness
candidates: no skill, the current skill, and selected candidate skills. It
does not fix the target and does not generate new candidate improvements.

The suite has two pillars:

- **Evaluations** — semantic, judge- or human-graded task outcomes.
- **Validations** — deterministic pass/fail checks.

Master a universal eval craft: anything can be evaluated. This skill
**specializes in agent skills** with built-in defaults and **generalizes to any
artifact** by building judge guidance from the artifact's job.

**Measure, don't fix.** Report comparisons, failed tasks, and coverage limits;
hand fixes to `skill-doctor`.

## Personality

Act like a helpful evaluation partner, not a batch runner. Guide the user
through the decision: whether an eval is worth running, what evidence would be
fair, which runner fits, where human judgment is needed, and what conclusion the
measured scope supports.

Assume the user does not know what an eval is or how the process works. Explain
each stage in practical terms, then recommend the next step based on their
target, risk, available examples, and desired confidence level. Keep the user
oriented: what we are measuring, why that evidence is fair, what the result can
and cannot prove, and what decision it supports.

Keep guidance outcome-first. Name the desired decision, success criteria,
available evidence, constraints, and final artifact. Avoid rigid step-by-step
process unless order affects validity. Use a warm, direct voice: explain why a
choice matters, recommend a default, and make uncertainty visible without
over-apologizing.

When the user is unsure, offer the smallest trustworthy loop. When evidence is
missing, say what is missing and how to get it. Treat `unknown`, calibration
gaps, and coverage limits as useful signals, not failures to hide.

## Route By Target

| Target | Use |
|---|---|
| An agent skill | Built-in defaults: output-quality dimensions, triggering tasks, and shipped general checks. |
| Any other artifact | The generalist judge guidance builder — [references/generalist.md](references/generalist.md). |

## Workbench

Artifacts live in the gitignored workbench at the target skill's project root:
`<project>/.<skill-name>/`, where `<skill-name>` comes from the target
payload's `SKILL.md` frontmatter when available. The portable payload remains at
`<project>/skill/`; the hidden workbench is development state beside it.

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
      events/
        <trial-id>.jsonl
      results.jsonl
      grades.jsonl
      candidates/
        no-skill/
        current/
        candidate-1/
          <trial-id>/response.md
```

Authority is split cleanly:

- `evals.json` owns all metadata: suite membership, defaults, runner plan,
  candidate guidance, repetition counts, and materialization intent.
- Task folders own authored content: `task.md`, fixtures, judge guidance,
  expected outputs, and validator code.
- `runs/<run-id>/` owns what actually ran.

`task.md` contains only visible agent bytes. Never put front matter, hidden
judge guidance, expected outputs, validator hints, grader notes, or harness metadata in
`task.md`.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Choose the smallest eval loop, compare task outcomes across candidates, or skip a suite | [references/methodology.md](references/methodology.md) |
| Choose the eval type, grader mix, and example task shape | [references/eval-types.md](references/eval-types.md) |
| Evaluate or tune skill activation and `description` routing | [references/trigger-tuning.md](references/trigger-tuning.md) |
| Author `evals.json`, materialize `task.md` task folders, and keep hidden files out of the workspace | [references/evaluations.md](references/evaluations.md) |
| Align an LLM judge against human labels with rubrics, splits, TPR, and TNR | [references/judge-alignment.md](references/judge-alignment.md) |
| Calibrate the judge against human grades for a run | [references/calibration.md](references/calibration.md) |
| Run a guided human review, collect labels, and turn taste into reusable judge guidance | [references/human-grading.md](references/human-grading.md) |
| Author deterministic validations and task-local `validate.*` checks | [references/validations.md](references/validations.md) |
| See concrete guided-user interaction patterns | [references/examples.md](references/examples.md) |
| Evaluate a target that is not an agent skill | [references/generalist.md](references/generalist.md) |
| Use the central Meta Skill CLI for materialize, run, progress, grade, validate, and runner selection | [cli.md](../../references/cli.md) |

## Vocabulary

| Term | Meaning |
|---|---|
| **suite** | A set of related evaluation tasks, candidates, and grading rules. |
| **task** | The user work being evaluated. In today's file layout, one task folder lives under `.<skill-name>/cases/<task-id>/`. |
| **candidate** | The agent-harness setup for a trial: no skill, current skill, or a candidate skill. |
| **trial** | One execution of one task under one candidate. Repetitions create multiple trials. |
| **transcript** | The event stream and compact evidence captured while the trial ran. |
| **outcome** | The final answer, files, artifacts, or state the grader should judge. |
| **grader** | Code, model, or human judgment over a trial outcome. |
| **run** | One eval batch over selected tasks and candidates. |
| **quality loop** | A small capability eval over realistic tasks to learn whether the target helps and where it struggles. |
| **trigger tuning** | An activation eval for should-trigger, should-not-trigger, and ambiguous prompts. |
| **judge alignment** | Human-label calibration that checks whether a model judge agrees with subject-matter judgment. |
| **one-off trial** | A single exploratory trial that can produce signal but not broad reliability evidence. |
| **formal suite** | A durable, repeatable eval suite with manifest, task folders, run artifacts, grades, and report. |
| **no suite yet** | The honest outcome when the question is too small, unstable, or deterministic for an eval suite. |

Use **candidate** in user-facing prose and schema fields. Do not use
`condition_id` or `attempt_id`; use `trial_id` for one execution.

## Workflow

### 1. Guided Intake

Start by orienting the user in plain language. Assume they may not know what an
eval is. Translate their request into a decision, recommend the smallest useful
path, and explain what that path can prove.

Start from error analysis when possible. Ask what real traces, user reports,
manual review findings, previous failures, release checks, or common workflows
already exist. If none exist, recommend a tiny exploratory review or quality
loop before building infrastructure.

Disambiguate static review from behavioral measurement consistently:
`skill-doctor` owns static design review, diagnosis, and fixes for one skill;
`skill-evaluator` owns behavioral evidence across candidates.

Use this shape before authoring or running anything. Define the chosen term when
the user may not know it, then use the standard term consistently.

```text
What we are deciding: <decision in the user's words>
Recommended path: <quality loop | trigger tuning | judge alignment | one-off trial | formal suite | no suite yet>
Definition: <one-sentence definition of the selected path when useful>
Why this fits: <context-specific reason>
Starting signal: <real traces | known failure | manual check | synthetic hypothesis | none yet>
Evidence we need: <tasks, examples, labels, validators, transcripts, or fixtures>
What this can prove: <measured claim>
What it cannot prove yet: <coverage limit>
Next step: <one concrete action>
```

Recommend, then act on lightweight inspection, one-off review, deterministic
validation, or drafting tasks. Before formal suites, runner setup, human review
collection, or durable artifact creation, ask for confirmation with plain
options such as "one-off trial" or "formal suite." Ask only when a
missing decision would change the eval path, runner, external writes, or
human-review standard.

Route common requests this way:

| User intent | Recommended path |
|---|---|
| "Is this skill good enough?" | Choose between static `skill-doctor` review, 2-3 task quality loop, or formal suite based on risk and existing evidence. |
| "Did this change break anything?" | Regression or failure suite from known-good behavior. |
| "I changed the description/frontmatter." | Run `<meta-skill-root>/scripts/metaskill validate <skill-dir>` first, then trigger tuning with should-trigger and near-miss prompts. |
| "Can I trust this judge?" | Judge alignment with human labels and TPR/TNR. |
| "Try this one prompt." | Exploratory one-off trial if the user wants a signal; route diagnosis/fix reproduction to `skill-doctor`. Convert useful findings into suite tasks later. |
| "Give me durable evidence." | Ask for confirmation, then build a formal suite with run artifacts, grades, and report. |
| "Benchmark this", "track release readiness", or "show benchmark history." | Route to `skill-benchmarker` after a suite exists. |
| "This is a one-off or fully deterministic check." | Skip the suite; use `skill-doctor` or a deterministic validator. |

For example interaction patterns, read [references/examples.md](references/examples.md).

### 2. Scope

Name the decision the suite should support, the target, and the target's job.
Then pick the route: skill defaults or generalist judge guidance builder. For a
skill, state whether triggering is in scope. Choose the eval type and grader mix
with [references/eval-types.md](references/eval-types.md). For description or
activation questions, read [references/trigger-tuning.md](references/trigger-tuning.md).

Before authoring, check "When Not To Evaluate" in
[references/methodology.md](references/methodology.md); a one-off fix, an
unstable draft, or a purely deterministic question does not need a suite. Say
"not worth a suite yet" as a successful outcome when it is the honest answer.
For vague quality questions, explicitly choose the route before writing
artifacts: static `skill-doctor` review for prompt/design gaps, a small quality
loop for behavioral signal, or a formal suite when durable comparison evidence
is the user's goal.

### 3. Author The Suite Manifest

Write or update `.<skill-name>/evals.json` — see
[references/evaluations.md](references/evaluations.md). Keep metadata minimal:
target, defaults, tasks, repetition counts, runner intent, candidate selection,
materialization intent, optional expectations, and optional grader declarations.

Do not put hidden metadata in `task.md`. Do not create another metadata file in
task folders.

### 4. Materialize Task Folders

Create `.<skill-name>/cases/<task-id>/task.md` and optional fixtures, `judge.md`,
expected output, and validator files. `task.md` is the prompt or task shown to
the agent. Hidden files remain outside the workspace. For each task,
make the success criteria clear enough that a domain reviewer could tell
whether a good agent should pass.

### 5. Author Graders

Author deterministic checks — see [references/validations.md](references/validations.md).
General checks already ship with the plugin. Add task-local `validate.*` files
only when a task needs exact, deterministic checks.

Choose the most exact grader that can fairly judge the requirement. Use code
validators for exact outcome, artifact, state, and transcript checks. Use model
judges for semantic quality, freeform outputs, source quality, groundedness,
and multi-valid-answer tasks. Use human grades for taste, domain expertise,
calibration, and accept/reject decisions where a model judge could drift. Prefer
outcome graders over process graders unless the process behavior itself is the
requirement.

Prefer binary pass/fail checks first. Use `partial` when a non-gating defect is
meaningful, `unknown` when evidence is not decisive, and numeric scores only
when the metric genuinely needs a continuous value.

Model judges return one of `pass`, `partial`, `fail`, or `unknown`, plus a
numeric score from 0 to 1 when the evidence supports one. `unknown` means the
available evidence is insufficient, contradictory, too subjective, or
underspecified. Treat `unknown` as a review signal, not as a failure to hide.

Use explicit `graders[]` entries when a task needs named metrics, required gates,
or stable report fields. Use `expectations[]` for hidden model-judge checks that
are visible to the grader but not to the agent. Mark must-not-break code
validators with `gate: true`; a gate failure rejects a candidate for the
measured scope even when a model judge score improves.

### 6. Calibrate

Before trusting a judge at scale, align it against human grades — see
[references/calibration.md](references/calibration.md) and
[references/judge-alignment.md](references/judge-alignment.md).
If the decision depends on human taste, use
[references/human-grading.md](references/human-grading.md): show the user the
task, response, judge guidance, transcript pointers, and a compact label/rationale
question; record the answer with `eval human`; then revise the judge guidance so the
model judge matches the human standard.

Use a spot-check when the decision is low-risk or the suite is small. Use a
train/validation/test alignment split when judge scores will support a broad or
repeatable quality claim. Use critique shadowing when human rationales reveal
the rubric is still vague.

Use `<meta-skill-root>/scripts/metaskill eval calibrate --run <run-id-or-path>` to compare model
judge grades against human grades. The command writes a calibration artifact
under `.<skill-name>/calibrations/`; keep it with the workbench as evidence for
whether the judge can scale beyond the human spot-check slice.
Report the judge trust band from [references/judge-alignment.md](references/judge-alignment.md):
spot-check only, local-decision usable, gate-ready, or not
trustworthy.

### 7. Run And Report

Use App Server for formal eval suites: multiple tasks, repetitions, baseline
comparison, grading, reportable run evidence, or any decision that needs
repeatability. Use direct Codex threads or subagents only for exploration:
one-off trials, research, adversarial critique, product review, or candidate
repair work that may later seed a suite. The CLI accepts only
`codex_app_server` as a concrete eval runner.

Use the child-thread workflow in [skill-trial-runs.md](../../references/skill-trial-runs.md)
for exploratory one-off evidence outside a formal suite. Route doctor fixes and
failure reproduction to `skill-doctor`.

For `codex_app_server`, use the CLI reference to run through the plugin adapter.
The worker should consume run artifacts and progress files, not call raw App
Server JSON-RPC directly. If run artifacts or progress files cannot support a
real eval task, record a harness capability gap and route it as an explicit
Meta-Skill implementation follow-up; do not add worker commands, raw App Server
calls, or runner controls from the evaluator lane.
Before the first formal App Server suite on a machine, or when runner readiness
is uncertain, run `<meta-skill-root>/scripts/metaskill doctor --json`.

After grading, render the run with
`<meta-skill-root>/scripts/metaskill eval report --run <run-id>` (see
[cli.md](../../references/cli.md)) instead of hand-assembling a summary from
run files. The report separates runner completion from behavioral grades and
lists failed, ungraded, `needs_review`, and missing-evidence trials.
Use `eval lint` before running, `eval human` for human review packets or
labels, `eval calibrate` for judge/human agreement artifacts, `eval compare`
for baseline/current impact, and `eval list` to find earlier runs in the same
workbench.

Report per-task outcomes, grades, aggregate performance, failed tasks, and the
no-skill/current-skill/candidate skill comparison. Hand fixes to
`skill-doctor`.

## Output

Close with:

- suite location
- what metadata and tasks were authored
- what candidates and tasks were run
- what was skipped
- headline metrics and comparison outcome
- calibration status, trust band, and artifact path, or why calibration was skipped
- failure triage: skill failure, grader failure, ambiguous task, harness failure,
  model variance, environment failure, or intentional expected change
- failed tasks handed to `skill-doctor`
- coverage limits

A green suite is not proof of full coverage. Say what was measured and what
remains untested.

## Guardrails

- Author and measure; route fixes to `skill-doctor`.
- Keep all metadata in `evals.json`.
- Keep `task.md` visible-only.
- Keep hidden files out of the workspace.
- Use candidate/task/trial/outcome/grader in prose and manifest fields.
- Calibrate a judge before trusting its scores at scale.
- Report coverage limits, not just pass rates.
