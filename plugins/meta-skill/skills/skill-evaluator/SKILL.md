---
name: skill-evaluator
description: "Use when the user asks to run, grade, browse, or report agent-skill evaluations: ad hoc evals, suites, candidate comparisons, recurring release or quality checks, run history, or the evaluation workbench. Owns evaluation artifacts and runs; not for source review, diagnosis from existing evidence, or edits."
---

# Skill Evaluator

Measure how an agent skill behaves on realistic tasks. Own ad hoc evals,
evaluation suites, named run profiles, candidates, graders, run history,
reports, and the evaluation workbench. Do not review or edit the target skill's
source and do not generate candidate changes.

Use `skill-reviewer` for static diagnosis and `skill-author` for source
mutation. Evaluation failures may produce a precise handoff to either skill,
but they are not edit authority.

## Start With The Decision

State the decision the evidence should support and the smallest fair path:

- an **ad hoc eval** for an exploratory signal from one realistic task
- an **evaluation suite** for durable evidence across tasks and candidates
- a **named run profile** for repeating a stable suite configuration and
  comparing like-for-like history
- **no suite yet** when the target is still changing shape, a deterministic
  validation fully answers the question, or maintenance cost exceeds the
  decision's value

Start from real failures, representative workflows, prior outputs, manual
review, or existing runs. Mark synthetic cases as hypotheses until reviewed.
Ask only for missing choices that change the claim, task set, candidate set,
grader, or human-review standard.

Read [suite-design.md](references/suite-design.md) when authoring or changing
tasks and graders. Read [human-review.md](references/human-review.md) when a
run needs human judgment. Use
[eval-vocabulary.md](../../references/eval-vocabulary.md) for canonical terms,
[run-layout.md](../../references/run-layout.md) for artifact authority, and
[cli.md](../../references/cli.md) for exact commands.

## Author Fair Evidence

Keep the visible task stable while candidates vary. Use the no-skill baseline
by default so the report can show what the skill changed; omit it only when the
comparison cannot answer the decision, and record why.

`<skill>/evals/evals.json` schema version 2 owns the authored suite, candidates,
and named run profiles. Keep simple tasks inline as top-level `evals[]` rows using `id`,
`prompt`, `expected_output`, and `expectations`. Use `cases/<id>/` only when a
task needs external fixtures, expected output, hidden judge guidance, or a
deterministic validator. Follow the schema and placement rules in the shared
references rather than inventing parallel metadata.

The agent may see the task, declared fixtures, and selected candidate payload.
It must not see expectations, expected outputs, validators, model-judge
guidance, or human labels. Keep the task's user-visible requirements honest:
hidden graders may evaluate them, not secretly introduce them.

The current runner supplies the selected candidate payload. It can compare
behavior with and without that payload; it does not prove that a platform would
naturally discover the skill. State this coverage limit whenever the requested
claim concerns discovery or routing.

## Grade And Review

Use the most exact fair grader:

- deterministic checks for files, schemas, exact state, tests, and observable
  process constraints
- model judgment for semantic quality with multiple valid outcomes
- human judgment for taste, domain expertise, ambiguous evidence, and important
  accept/reject decisions

Prefer binary checks. Use `unknown` when evidence cannot support a fair label.
Inspect failed, surprising, and disagreed trials before changing a task or
grader. Keep grader failures separate from target-skill failures.

The workbench is the primary human interface. Use `Evals` to inspect the suite
and case coverage, `Experiments` to configure and compare immutable runs, and
`Review` for candidate-blind pairwise annotations or absolute human grades.
Start with one trial per case, then use selected-case reruns or repetitions when
variance, disagreement, or a release criterion needs more evidence. Promote a
useful ad hoc eval into the suite only after explicit approval.

Keep outcomes and produced artifacts primary during review. Open transcripts
for failure diagnosis or grader audits. Show the selected baseline, model,
runner, local storage path, and known external model boundary before launch;
localhost does not mean trial inputs remain local. Use the CLI as the scripted
interface for automation and escape hatches.

## Run And Report

Run only after the suite passes its preflight checks. Treat a run as frozen
evidence: changing the suite, candidate source, or grader definition requires a
new run; recording or revising a grade regenerates the derived report.

Lead the report with the evaluation objective, experiment configuration, and
per-case baseline-versus-candidate change. For each failure, show the failed
expectation or check and its evidence.
Also report human/model disagreements, ungraded or unknown outcomes, run or
grader errors, provenance, and coverage limits. Classify the first upstream
cause before handing off a defect.

A named run profile is a stable selection and execution policy inside the
suite, not a second artifact system. Compare historical runs only when they use
the same relevant profile inputs, and disclose any scope change. Keep pairwise
review coverage separate from declared absolute human graders; a sampled A/B
annotation does not silently become a trial grade.

Close with suite or run location, what ran and what was skipped, headline
candidate changes, failed checks, disagreements, failure classification, and
what the evidence cannot establish. A green run proves only the measured
scope.
