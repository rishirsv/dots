---
name: skill-evaluator
description: "Designs and runs behavioral evaluations of agent skills with fresh workers and evidence matched to the user's claim. Use for skill trials, comparisons, grading, or an optional evaluation receipt; not for source edits or static review."
---

# Skill Evaluator

Turn the user's decision into credible behavioral evidence. Let the claim
determine the cases, comparison, judge, persistence, and report depth.

Read [skill-practices.md](../../references/skill-practices.md) as the quality
rubric. Use its applicable criteria to define what behavior matters; keep the
evaluation workflow here.

## Define the claim

State the exact decision the evaluation should support, the configuration under
test, the evidence that could decide it, and the limits on the conclusion. Ask
only for choices that change method, cost, authority, or interpretation.

When the user supplies `review.json`, verify the hashes relevant to the selected
finding. Use its verification claim or open question as a hypothesis, not a
conclusion.

## Design the cases

Choose realistic requests from observed failures, accepted outputs, common
use, boundaries, and near misses. Treat synthetic requests as hypotheses until
the user accepts their relevance. Match coverage to the claim: narrow cases can
support a narrow conclusion; readiness claims need representative breadth.

Choose the comparison that answers the decision. Hold task, fixtures, tools,
and execution settings fixed when attributing a difference to a skill or
revision. When several dimensions change, compare complete configurations
without assigning causality to one component.

Show the expanded setup and purpose before repeated or expensive execution.
Before an evaluation posts, deploys, sends messages, or otherwise changes an
external system, get the user's explicit approval for that mutation.

## Run isolated workers

Use fresh subagents with controlled context for behavioral results. Give each
worker only the realistic task, selected skill, declared fixtures, permitted
tools, and output location. Keep expected answers, review diagnoses, proposed
fixes, hidden criteria, and other workers' results outside worker context.

If fresh subagents are unavailable, return the evaluation design and stop
without claiming behavioral results. Preserve partial evidence when execution
stops.

## Judge the evidence

Match the judge to the claim:

- deterministic checks for exact files, schemas, calculations, tests, state,
  or required actions;
- a fresh grader subagent for semantic criteria with several valid answers;
  and
- the user or another qualified human for taste, consequential ambiguity, or
  domain judgment that cannot be specified reliably.

Use transcripts only when process is part of the expected behavior. Keep hidden
criteria out of worker context. Preserve execution failures, missing evidence,
and judge disagreement instead of forcing them into a score.

## Report the result

Return the result in chat by default:

1. Claim and tested configuration.
2. Cases, comparison, and judging method.
3. Evidence and case-level outcomes.
4. Conclusion: supported, not supported, mixed, or inconclusive.
5. Limits on generalization and unresolved questions.

Complete the evaluation when every case is accounted for, the conclusion is
traceable to evidence, and the report stays within the tested scope.

When the user requests a machine-readable evaluation receipt, read
[evaluation-json.md](references/evaluation-json.md) and write the optional
receipt outside the portable skill.

Load `skill-standards` for static diagnosis or source changes. An evaluation
result is evidence for that workflow, not permission to edit the skill.
