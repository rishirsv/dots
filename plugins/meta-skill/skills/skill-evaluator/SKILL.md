---
name: skill-evaluator
description: "Use when asked to run, grade, browse, or report agent-skill evaluations: ad hoc evals, suites, candidate comparisons, run history, or the evaluation workbench. Creates and manages evaluation artifacts and runs; not for source review, diagnosis from existing evidence, or edits."
---

# Skill Evaluator

Create evaluations conversationally. Handle the cases, runs, grading, and
report for the user; use the workbench to inspect results and collect feedback.

Do not review or edit the target skill. Use `skill-reviewer` for static
diagnosis and `skill-author` for source changes.

### 1. Create Realistic Test Prompts

When the user explicitly wants one immediate, disposable test, use the ad hoc
path in [running-evaluations.md](references/running-evaluations.md). Do not
create a durable suite case unless the user confirms that the behavior should
be preserved.

Otherwise, read the target skill and the user's evaluation goal. Create two or
three test prompts that sound like things a real user would actually say. Use
natural requests, not descriptions of the skill's internal workflow or
language copied from its instructions.

Choose prompts that exercise distinct common uses of the skill. Include a
difficult prompt only when it represents a realistic use, ambiguity, or known
failure. Do not inflate the set with superficial variations of the same task.

Share the exact prompts with the user before running them. Briefly state what
each prompt is intended to test and ask whether they look right or should be
changed or supplemented. Incorporate the user's response before continuing.

Read [evaluation-methodologies.md](references/evaluation-methodologies.md) while
selecting prompts and the comparison. It explains which cases produce useful
signal and how to choose the baseline.

### 2. Save The Cases And Define Success

Initialize the skill's eval workspace when needed, then save the confirmed
prompts as separate `evals[]` rows in:

```text
<skill-name>/.<skill-name>/evals/evals.json
```

Read [evals-schema.md](references/evals-schema.md) before writing or changing
this file. It contains the MetaSkill CLI schema, a minimal example, file-backed
case layout, and validation command.

For each prompt:

- assign a stable case `id`;
- preserve the exact user-visible prompt;
- describe the expected result in `expected_output` when a reference result is
  useful;
- write observable `expectations` that distinguish acceptable from defective
  output; and
- declare a deterministic, model, or human grader only when the case needs it.

Read [rubrics.md](references/rubrics.md) while defining expectations and
graders. Every load-bearing criterion must identify observable Pass and Fail
evidence and affect a possible verdict.

Success criteria may clarify how to judge a visible requirement, but must not
add requirements that the prompt never gave the worker. Keep expected outputs,
expectations, validators, judgment guidance, and human labels hidden from trial
workers.

Use inline fields for simple cases. Create `evals/cases/<case-id>/` only when a
case needs fixtures, `task.md`, `expected.md`, `judge.md`, or a deterministic
validator. Validate and lint the completed suite before running it.

### 3. Freeze A Fair Comparison

Read [running-evaluations.md](references/running-evaluations.md) before creating
a run. It contains the exact MetaSkill commands, native-subagent packet
contract, grader execution, recovery, and report workflow.

Run `eval prepare` to create a new immutable run under
`.<skill-name>/runs/<run-id>/`. Use the no-skill baseline by default; use another
named version only when it better answers what changed.

Keep the visible prompt, fixtures, environment, and execution settings the same
while the candidate changes. Freeze the selected cases, candidate payloads,
baseline, graders, and execution settings. The runner expands them into one
trial for every selected case × version × repetition.

Use one repetition initially. Add repetitions only when observed variance or
the evaluation question makes consistency relevant.

See [run-layout.md](../../references/run-layout.md) for the frozen run contents.

### 4. Run The Tasks And Capture Results

For an interactive evaluation, dispatch the worker packets returned by
`eval prepare`. Give each worker only its visible task, declared fixtures,
temporary workspace, and result location. Give the frozen skill payload only
to the skill candidate; the baseline receives no skill path.

Do not reveal the evaluation, comparison, hidden criteria, expected output,
validators, judgment guidance, human labels, or durable run directory to a
trial worker.

Submit every completed worker result with `eval submit`. This imports its
response, produced files, event stream, and terminal state into the durable
trial directory. Preserve completed evidence when another worker fails or the
run is interrupted. Use `eval unresolved` and `eval retry` for recovery.

Use `eval run` when unattended execution is more appropriate. Follow the
commands and recovery behavior in
[running-evaluations.md](references/running-evaluations.md).

### 5. Grade And Compare The Outputs

After every trial is terminal, run `eval finalize`. Always use
[Choose The Grader](references/evaluation-methodologies.md#choose-the-grader)
to select a deterministic validator, case-local LLM `judge.md`, or human
judgment. Read [human-review.md](references/human-review.md) when human judgment
applies.

For failed, surprising, or disagreed trials, read
[error-analysis.md](references/error-analysis.md), review the traces with the
user, and confirm the observations and labels before changing anything.
Use
[eval-vocabulary.md](../../references/eval-vocabulary.md) for the canonical
outcome terms.

Interpret each case-level comparison precisely:

| Baseline | Skill | Conclusion |
|---|---|---|
| fail | pass | improved |
| pass | fail | regressed |
| pass | pass | no uplift demonstrated |
| fail | fail | inconclusive shared failure |
| unavailable or uncertain | any | inconclusive |

### 6. Present And Preserve The Evidence

Generate `<skill-name>-evaluation.md` from the saved run. Lead with the
evaluation question and skill effect, then show scenario outcomes, criteria
evidence, time and token usage, execution issues, and run details. For every
failure, identify the failed criterion and its evidence.

Open the workbench when side-by-side inspection or feedback is useful. The
workbench reads the same filesystem evidence; it is not a separate source of
truth and does not launch evaluations.

After the user approves the expected behavior, preserve a useful failure as a
regression case when it should survive future changes. Do not convert an
observation into a durable requirement without that approval.

Close by giving the user the suite or run path, the comparison result, failed
criteria, and what the evaluation cannot establish. Treat each run as frozen
evidence: changing a prompt, candidate, grader, or skill payload requires a new
run. An attached-skill comparison proves behavior when the skill is explicitly
supplied; it does not prove natural discovery.
