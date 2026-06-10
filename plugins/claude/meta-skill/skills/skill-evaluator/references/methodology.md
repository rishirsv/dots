# Methodology

Read when choosing the smallest useful eval loop for a skill.

The default model follows the agent-eval loop: keep the task stable, vary the
agent-harness condition, grade the outcome, and inspect the transcript only when
it explains why the outcome happened.

1. **Task** — the user work being evaluated.
2. **Condition** — the agent setup: no skill, current skill, or edited-skill
   attempt.
3. **Trial** — one task under one condition.
4. **Outcome** — the final answer, files, artifacts, or state.
5. **Grader** — human, model, or code judgment over the outcome.
6. **Transcript** — event/evidence stream used to debug the outcome, not a
   substitute for it.

This matches the practical loop: write a few realistic tasks, compare the
no-skill condition with the current-skill condition, make an edited-skill
condition, compare again, and keep only evidence that helps decide the next
edit.

## Current Plugin Terms And Aliases

Use Anthropic-aligned vocabulary in explanations and reports. The current CLI
schema still uses `candidates` in `.meta-skill/evals.json` for what the
evaluation literature would call conditions:

- `no-skill` will be the baseline condition once `source.kind: "none"` lands.
- `current` is the current-skill condition.
- `attempt-1`, `candidate-1`, or any other slug can point at an edited-skill
  branch, git ref, or worktree through `source`.
- Run evidence records the condition's branch/ref, commit, payload path, and
  `payload_digest`.

Use **condition** in user-facing explanations. Use `candidate` only for the
current manifest and run-file field. Do not add `candidate_id` or `attempt_id`.

A no-skill baseline is not implemented yet. Track it as the next small platform
addition: a `source.kind: "none"` condition that runs the same task without
staging the skill payload.

## Default Loop

Use this loop for most skill evaluation:

1. Create 2-3 realistic tasks that represent real user requests.
2. Run the tasks under the no-skill and current-skill conditions when no-skill
   support exists; until then, write the tasks so the comparison can run later.
3. Judge or review the outcomes side by side.
4. Inspect transcripts only to explain failures, tool-use mistakes, or missing
   evidence.
5. Turn a proposed fix into an edited-skill condition.
6. Run the same tasks against the current-skill and edited-skill conditions.
7. Report which tasks improved, regressed, already worked without the skill, or
   still need human judgment.

Prefer side-by-side outcome evidence over abstract scores. A score without a
baseline mostly measures the model plus the skill; a no-skill/current-skill
comparison measures skill lift.

## When To Add Rigor

Add more structure only when the default loop is not enough:

- Use repetitions when trigger behavior or judge grading is visibly variable.
- Save one or two prompts as unseen final checks when an editor is optimizing
  repeatedly against the same prompts.
- Add deterministic validators when the expected behavior can be checked by a
  script.
- Add human spot checks when a model judge is influencing an accept/reject
  decision.

Do not introduce named split systems or calibration labels for ordinary skill
work. Keep the report plain: which tasks ran, which conditions were compared,
which outcomes changed, and what is still uncertain.

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
