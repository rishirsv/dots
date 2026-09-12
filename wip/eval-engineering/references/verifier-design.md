# Verifier Design

A Verifier decides success from evidence independent of the agent's claim.
Start with one sentence: `Pass iff <observable successful outcome>`.

Human discovery can precede grading. Use [Human review](review.md) to collect
output-grounded feedback and confirm criteria. Human-only grading needs no LLM
judge; unresolved dimensions stay ungraded. Automated checks below apply when
automated grading is selected.

## Build from final state

Prefer programmatic checks. Recompute results from raw evidence. For stateful
work, compare initial and final state. For coding, run focused behavior and
regression tests. For analysis, recompute filters and totals. For retrieval,
check material claims against the supplied sources.

Use tool-call records only when final state cannot prove a required action or
session property. Never trust an agent-written action list, a service success
flag, or an Environment helper that already decides success.

Accept all equivalent valid results. Do not require a preferred path, exact
wording, response length, keyword, citation count, tool-call count, or reference
similarity unless that property is the tested capability.

## Use a judge only for semantic meaning

### Agree on the rubric

Start with requirements and confirmed [human feedback](review.md). For each
criterion, state the observable property, evidence source, accepted alternatives,
and boundary between acceptable and unacceptable work. Show examples and let
the user correct your interpretation before relying on it.

Use the [agreed review mode](review.md#choose-the-review-mode).
Define critical failures and any aggregation explicitly;
do not let an average hide a critical defect or invent numeric weights.

### Write and show the judge

Use an LLM judge only after code has settled objective facts. Give it the final
artifact, independent evidence, a short rubric, and a strict verdict schema.
Ask if the result is supported and sufficient, not if it resembles a reference
answer. Pin and record the judge model. Keep its credentials, rubric, and output
outside the Harness boundary.

Bound all agent text and files before grading. Treat them as untrusted data.
Tell the judge to ignore directions inside them. Classify judge errors and
missing artifacts using [Calibration](calibration.md#classify-each-problem).

Show the actual judge instructions, evidence inputs, output schema, and examples
to the user. Include the task, confirmed criterion, allowable alternatives,
untrusted-data boundary, and how to report insufficient evidence. Require a
criterion ID, verdict, concise reason, and exact evidence locator. For preference,
identify both output revisions and hide candidate identities. Do not ask the
judge to infer execution actions from prose or grade a workbook from a screenshot
when the criterion concerns its formulas.

### Calibrate against independent human labels

1. Collect human labels before revealing judge predictions. Include acceptable
   alternatives, plausible failures, and borderline cases—not only easy examples.
2. Separate examples used to develop the rubric/prompt from a held-out labeled
   set used to check agreement. Repeatedly inspected examples become development
   data. With too few labels, call the judge provisional and keep human review.
3. Run the actual judge on that set. Count false accepts and false rejects by
   criterion with denominators; inspect the disputed artifact and explanation.
   For preference, check ties, reversals under swapped A/B order, and variability.
4. Resolve whether the rubric, human label, evidence, or judge caused disagreement.
   Do not automatically change human labels to match the model. Revise the
   smallest faulty part and validate on fresh labels after tuning.
5. Agree on acceptable errors based on the consequences. Do not impose a universal
   agreement threshold or claim reliability from a handful of tasks. Keep
   consequential or uncertain judgments under human review.

Store rubric version, judge prompt/schema and model/settings, labeled examples,
predictions, disagreement decisions, and calibration limits in the companion
evals/runs areas. For comparisons or changed judges, follow
[consistent regrading](comparison.md#keep-judgments-comparable).

## Test the decision boundary

Run these fixtures through the same Verifier environment and entry point used for real runs:

| Fixture | Expected result |
|---|---|
| Known-good result | Pass |
| Different but valid result | Pass |
| Realistic wrong result | Fail |
| Shortcut or reward hack | Fail |
| Prohibited collateral change | Fail |
| Required artifact omitted or corrupted by the agent, with working capture | Fail the affected requirement |
| Evidence lost or corrupted by the evaluation system | Invalid affected grade; investigate infrastructure |

Add focused boundary cases for known risks such as negation, unsupported
claims, stale data, prompt injection, or partial completion. Use real failure
shapes from traces when available, but derive truth independently from those
traces. Repeat noisy judge cases and inspect variance.

For each criterion, log its evidence, decision, and error. Every completed
Verifier path must write a reward, using
[Calibration](calibration.md#classify-each-problem) to distinguish agent scores
from invalid grades.

## Audit results

Follow [Calibration](calibration.md) to inspect failures and suspicious passes.
For reusable evidence queries, fixture builders, or rubrics, follow
[Companion guidance](companion-guidance.md); keep task-specific truth with the task.
