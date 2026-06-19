# Methodology

Read when choosing the smallest useful eval loop for a skill.

The default model follows the agent-eval loop: keep the task stable, vary the
agent-harness candidate, grade the outcome, and read transcripts often enough to
know whether the graders are fair.

1. **Task** — the user work being evaluated.
2. **Candidate** — the agent setup: no skill, current skill, or candidate skill.
3. **Trial** — one task under one candidate.
4. **Outcome** — the final answer, files, artifacts, or state.
5. **Grader** — human, model, or code judgment over the outcome.
6. **Transcript** — event/evidence stream used to judge process requirements,
   calibrate graders, and debug the outcome.

This matches the practical loop: write a few realistic tasks, compare the
no-skill candidate with the current-skill candidate, make a candidate skill
candidate, compare again, and keep only evidence that helps decide the next
edit.

## Current Plugin Terms

Use `candidate` in explanations, reports, manifests, run rows, and paths:

- `no-skill` is the baseline candidate using `source.kind: "none"`.
- `current` is the current-skill candidate.
- `candidate-1` or any other slug can point at a candidate skill
  branch, git ref, or worktree through `source`.
- Run evidence records the candidate's branch/ref, commit, payload path, and
  `payload_digest`.

Do not add `condition_id` or `attempt_id`.

A no-skill baseline is a `source.kind: "none"` candidate that runs the same task
without staging the skill payload.

## Default Loop

Use this loop for most skill evaluation:

1. Start from what is already manually checked: release checks, user-reported
   failures, review findings, or common target workflows.
2. Create 2-3 realistic tasks for a local loop, or 20-50 tasks for a serious
   first suite when the target is mature enough to justify it.
3. For each task, write success criteria that are clear in `task.md`, then add
   hidden graders for the exact checks, judge dimensions, or human labels.
4. Run the tasks under the no-skill and current-skill candidates when the
   question is whether the skill changes outcomes.
5. Judge or review the outcomes side by side.
6. Inspect failed, surprising, and model/human-disagreed transcripts to catch
   unfair graders, hidden harness issues, and valid alternate solutions.
7. Turn a proposed fix into a candidate skill.
8. Run the same tasks against the current skill and candidate skill.
9. Report which tasks passed under one candidate but not another, which already
   worked without the skill, and which still need human judgment.

Prefer side-by-side outcome evidence over abstract scores. A score without a
baseline mostly measures the model plus the skill; a no-skill/current-skill
comparison shows what changes when the skill is present.

## Error Analysis First

Do not start by inventing infrastructure. First ask what evidence already
exists:

- real task transcripts or outputs
- user-reported failures or repeated support complaints
- manual review notes
- release checks or expected behavior examples
- common workflows the skill must handle

If there are no real traces yet, run a tiny exploratory loop before creating a
formal suite. Synthetic examples are useful for coverage hypotheses, but mark
them as synthetic and do not let them become blocking gates until a human has
reviewed them.

## When To Add Rigor

Add more structure only when the default loop is not enough:

- Use repetitions when trigger behavior or judge grading is visibly variable.
- Save one or two tasks as unseen final checks when an editor is optimizing
  repeatedly against the same tasks.
- Add deterministic validators when the expected behavior can be checked by a
  script.
- Add human spot checks when a model judge is influencing an accept/reject
  decision.
- Add reference solutions when the task should become gating evidence.
- Balance should-trigger and should-not-trigger tasks for activation behavior.
- Add transcript-aware graders when the process is part of the contract:
  required tools, forbidden tools, skipped validation, unsafe edits, approval
  boundaries, or excessive turns.
Do not introduce named split systems or calibration labels for ordinary skill
work. Keep the report plain: which tasks ran, which candidates were compared,
which outcomes changed, what transcripts showed, and what is still uncertain.

## Signal Sources

Strong eval suites come from real signal:

- **Automated evals**: repeatable task suites under no-skill baselines, current
  skills, and candidate skills.
- **A/B testing**: production comparison once a candidate is deployable and
  usage is large enough to measure user outcomes.
- **User feedback**: sparse and biased, but useful seed material for concrete
  tasks when paired with transcripts or examples.
- **Manual transcript review**: frequent qualitative review to find subtle
  failures, unfair graders, valid alternate solutions, and harness bugs.
- **Systematic human studies**: structured labels from trained or domain
  reviewers when subjective quality or user preference is the decision.

Convert external signals into local eval material: bug reports become
regression tasks, support complaints become capability tasks, A/B drops with
transcript evidence become new tasks or grader dimensions, and manual review
surprises become judge guidance or reference-solution updates.

## When Not To Evaluate

Do not build a suite when:

- The question is a one-off fix — use `skill-doctor`'s single trial-run route.
- The target is an unstable draft still changing shape; a suite would chase a
  moving target.
- A deterministic validator alone fully answers the question; run it and skip
  the judge.
- Maintaining the suite would cost more than the target's usage justifies.

"Not worth a suite yet" is a valid evaluator outcome. Say it explicitly and
stop.

## Health Checks

Review the suite when any of these happen:

- A task has repeated 0% pass rates across capable candidates.
- The transcript shows the agent solved the user need but the grader rejected
  it.
- The outcome passes, but the transcript reveals unsafe, wasteful, or brittle
  behavior the suite should track.
- The capability suite saturates near 100% and no longer shows improvement
  signal.
- The task depends on hidden assumptions, shared state, global machine setup, or
  prior trial artifacts.

Failures should feel fair: a reviewer should be able to name what the agent got
wrong, what evidence supports that judgment, and whether the task or grader
needs repair.

## Failure Triage

Before handing a failure to `skill-doctor`, classify the first upstream cause:

| Cause | Meaning |
|---|---|
| `skill_failure` | The target skill failed a fair task. |
| `grader_failure` | The judge, validator, rubric, or reference solution rejected a valid outcome. |
| `case_ambiguous` | The task or expected behavior was underspecified. |
| `harness_failure` | Runner setup, hidden files, candidate staging, or artifact capture broke the trial. |
| `model_variance` | Repetitions show unstable behavior without a clear skill defect. |
| `environment_failure` | Local tools, network, credentials, or machine state blocked a fair attempt. |
| `expected_change` | The candidate intentionally changed behavior and the suite needs an updated claim. |

Report the classification with the evidence path. Fix grader, case, harness, or
environment problems in the suite before treating the result as a target-skill
defect.
