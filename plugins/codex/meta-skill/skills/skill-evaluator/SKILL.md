---
name: skill-evaluator
description: "The measurement specialist within meta-skill: author and run evaluation suites for a target, using judge or human grading plus deterministic validations to compare tasks across no-skill, current-skill, and edited-skill candidates. Specializes in agent skills and generalizes through a judge guidance builder. Reached through meta-skill's routing; invoke directly only when named. Not for authoring new skills, reproducing one failure, or generating candidate improvements autonomously."
---

# Skill Evaluator

Author an **evaluation suite** for a target and run the parts that can be
mechanized. The evaluator runs the same tasks under different agent-harness
candidates: no skill, the current skill, and selected edited-skill attempts. It
does not fix the target and does not generate new candidate improvements.

The suite has two pillars:

- **Evaluations** — semantic, judge- or human-graded task outcomes.
- **Validations** — deterministic pass/fail checks.

Master a universal eval craft: anything can be evaluated. This skill
**specializes in agent skills** with built-in defaults and **generalizes to any
artifact** by building judge guidance from the artifact's job.

**Measure, don't fix.** Report comparisons, failed tasks, and coverage limits;
hand fixes to `skill-doctor`. Future autonomous candidate generation belongs to
`skill-autoresearch`.

## Route By Target

| Target | Use |
|---|---|
| An agent skill | Built-in defaults: output-quality dimensions, triggering tasks, and shipped general checks. |
| Any other artifact | The generalist judge guidance builder — [references/generalist.md](references/generalist.md). |

## Workbench

Artifacts live in the gitignored workbench at the target skill's project root:
`<project>/.meta-skill/`. The project root already names the skill and contains
the portable payload at `<project>/skill/`, so do not add another skill-name
namespace.

```text
.meta-skill/
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
        attempt-1/
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
| Author `evals.json`, materialize `task.md` task folders, and keep hidden files out of the workspace | [references/evaluations.md](references/evaluations.md) |
| Calibrate the judge against human grades | [references/calibration.md](references/calibration.md) |
| Run a guided human review, collect labels, and turn taste into reusable judge guidance | [references/human-grading.md](references/human-grading.md) |
| Author deterministic validations and task-local `validate.*` checks | [references/validations.md](references/validations.md) |
| Evaluate a target that is not an agent skill | [references/generalist.md](references/generalist.md) |
| Use the central Meta Skill CLI for materialize, run, progress, grade, validate, and runner selection | [cli.md](../../references/cli.md) |

## Vocabulary

| Term | Meaning |
|---|---|
| **suite** | A set of related evaluation tasks, candidates, and grading rules. |
| **task** | The user work being evaluated. In today's file layout, one task folder lives under `.meta-skill/cases/<task-id>/`. |
| **candidate** | The agent-harness setup for a trial: no skill, current skill, or an edited-skill attempt. |
| **trial** | One execution of one task under one candidate. Repetitions create multiple trials. |
| **transcript** | The event stream and compact evidence captured while the trial ran. |
| **outcome** | The final answer, files, artifacts, or state the grader should judge. |
| **grader** | Code, model, or human judgment over a trial outcome. |
| **run** | One eval batch over selected tasks and candidates. |

Use **candidate** in user-facing prose and schema fields. Do not use
`condition_id` or `attempt_id`; use `trial_id` for one execution.

## Workflow

### 1. Scope

Name the target and its job, then pick the route: skill defaults or generalist
judge guidance builder. For a skill, state whether triggering is in scope. Choose the
eval type and grader mix with [references/eval-types.md](references/eval-types.md).

Before authoring, check "When Not To Evaluate" in
[references/methodology.md](references/methodology.md); a one-off fix, an
unstable draft, or a purely deterministic question does not need a suite.

### 2. Author The Suite Manifest

Write or update `.meta-skill/evals.json` — see
[references/evaluations.md](references/evaluations.md). Keep metadata minimal:
target, defaults, tasks, repetition counts, runner intent, candidate selection,
materialization intent, optional expectations, and optional grader declarations.

Do not put hidden metadata in `task.md`. Do not create another metadata file in
task folders.

### 3. Materialize Task Folders

Create `.meta-skill/cases/<task-id>/task.md` and optional fixtures, `judge.md`,
expected output, and validator files. `task.md` is the prompt or task shown to
the agent. Hidden files remain outside the workspace. For each task,
make the success criteria clear enough that a domain reviewer could tell
whether a good agent should pass.

### 4. Author Graders

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

Use explicit `graders[]` entries when a task needs named metrics, required gates,
or stable report fields. Use `expectations[]` for hidden model-judge checks that
are visible to the grader but not to the agent. Mark must-not-break code
validators with `gate: true`; a gate failure blocks promotion even when a model
judge score improves.

### 5. Calibrate

Before trusting a judge at scale, compare judge grades with human grades on a
small spot-check slice — see [references/calibration.md](references/calibration.md).
If the decision depends on human taste, use
[references/human-grading.md](references/human-grading.md): show the user the
task, response, judge guidance, transcript pointers, and a compact label/rationale
question; record the answer with `eval human`; then revise the judge guidance so the
model judge matches the human standard.

### 6. Run And Report

Run selected candidates against selected tasks. Default to:

- `codex_thread` with worktree isolation for one-off trials and doctor fixes.
  This is the Desktop child-thread route in
  [skill-trial-runs.md](../../references/skill-trial-runs.md), not an
  `eval run --runner` value.
- `codex_app_server` through the Python SDK for batch evals, A/B comparisons,
  and initial autoresearch

The CLI accepts only `codex_app_server` as a concrete eval runner.

For `codex_app_server`, use the CLI reference to run through the plugin adapter.
The worker should consume run artifacts and progress files, not call raw App
Server JSON-RPC directly. App Server is the primary workbench runner, but live
control commands should not be added unless a real eval task requires them.

After grading, render the run with
`scripts/meta-skill eval report --run <run-id>` (see
[cli.md](../../references/cli.md)) instead of hand-assembling a summary from
run files. The report separates runner completion from behavioral grades and
lists failed, ungraded, human-review, and missing-evidence trials. Use
`eval lint` before running, `eval human` for human review packets or labels,
`eval compare` for baseline/current impact, and `eval list` to find earlier
runs in the same workbench.

Report per-task outcomes, grades, aggregate performance, failed tasks, and the
no-skill/current-skill/edited-skill candidate comparison. Hand fixes to
`skill-doctor`.

## Output

Close with:

- suite location
- what metadata and tasks were authored
- what candidates and tasks were run
- what was skipped
- headline metrics and comparison outcome
- failed tasks handed to `skill-doctor`
- coverage limits

A green suite is not proof of full coverage. Say what was measured and what
remains untested.

## Guardrails

- Author and measure; route fixes to `skill-doctor`.
- Do not generate new candidates autonomously; route that future work to
  `skill-autoresearch`.
- Keep all metadata in `evals.json`.
- Keep `task.md` visible-only.
- Keep hidden files out of the workspace.
- Use candidate/task/trial/outcome/grader in prose and manifest fields.
- Calibrate a judge before trusting its scores at scale.
- Report coverage limits, not just pass rates.
