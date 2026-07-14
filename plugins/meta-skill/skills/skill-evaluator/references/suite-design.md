# Suite Design

Read this when selecting tasks, candidates, or graders for an agent-skill
evaluation.

## Use Real Signal First

Start with observed failures, accepted outputs, common workflows, manual review,
or existing runs. A suite should answer one decision. Use a few representative
tasks for a local loop and expand only when the decision warrants the upkeep.
Synthetic tasks are useful coverage hypotheses but should not become blocking
evidence until their expected behavior is reviewed.

Keep a task only when a capable agent could pass it, visible instructions state
the user requirement, a reviewer could judge the result independently, and the
trial does not depend on undeclared machine state or prior trials. Use expected
output for deterministic or artifact-heavy work. Mark high-, medium-, or
low-priority cases when review and rerun order should reflect consequence. Save unseen tasks when the
same suite is used repeatedly to tune a candidate.

The selected baseline and payload candidate receive the same visible task. Use
the no-skill baseline for first adoption and skill-lift questions. Use current
versus candidate for revisions when repeating no-skill work would not inform the
decision. The comparison should answer what changed, not reward candidate-specific
wording. If both candidates pass, the change may add no measurable value for that
task. If both fail, inspect task difficulty, grading, harness behavior, and
environment before blaming the skill.

Use an ad hoc eval before authoring a durable case when one realistic task can
surface the first useful signal. Promote it only after reviewing the prompt,
expected outcome, grader, priority, and annotations. Do not silently turn a
synthetic or malformed task into regression evidence.

## Choose The Grader

Use the most exact method that accepts all valid outcomes:

| Evidence need | Grader |
|---|---|
| Files, schema, exit status, tests, exact state, required or forbidden action | Deterministic validator |
| Correctness, usefulness, completeness, or structure with several valid answers | Model judge with observable label criteria |
| Taste, domain judgment, ambiguity, or an important selection decision | Human review |

Prefer outcome evidence. Read transcript events only when process is part of the
contract or needed to distinguish a target failure from a harness failure. A
model grader should receive transcript evidence only when declared to use it.

Use named binary checks by default. `partial` is useful for a meaningful,
non-blocking defect; `unknown` is correct when the available evidence cannot
support a fair judgment. Make informational checks advisory. A suite still
needs at least one load-bearing check to pass.

Hidden criteria may clarify how to judge a visible requirement but must not add
a requirement the task never gave the agent. Keep expected outputs, judge
guidance, validators, and human labels outside the agent workspace.

Authored annotations may preserve reviewed context with the case. Leave
`judge_use` absent or set it to `exclude` unless the note has been approved as
rubric guidance or evidence for the model judge. The trial worker never sees
annotations regardless of judge use.

## Read Failures Before Editing The Suite

Classify the earliest cause:

- **target failure:** the skill failed a fair task
- **grader failure:** a valid result was judged incorrectly
- **ambiguous case:** the task or expected behavior was underspecified
- **harness failure:** staging, execution, capture, or hidden-boundary handling
  broke the trial
- **model variance:** repetitions disagree without a stable skill defect
- **environment failure:** tools, credentials, network, or machine state
  prevented a fair attempt
- **expected change:** the candidate intentionally changed behavior and the
  suite's claim is stale

Repair a case, grader, harness, or environment defect before treating its
result as skill evidence. Inspect failed, surprising, and disagreed trials; a
summary count alone cannot show whether the suite is fair.

## Report The Measured Claim

Lead with experiment configuration and per-task baseline-versus-candidate change. For each failed task, name
the failed check and evidence. Report unknowns, grader errors, human/model
disagreements, and coverage limits separately. Do not turn a green suite into a
general quality or release claim.
