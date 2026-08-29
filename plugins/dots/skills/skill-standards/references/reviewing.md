# Reviewing a skill

Diagnose the skill from source and existing evidence. Keep the source unchanged;
new behavioral trials require a separate, explicitly authorized workflow.

## 1. Set the review contract

Take the scope and decision from the user's request.

- A broad review covers the effective payload, neighboring descriptions,
  repository instructions, validation evidence, and existing evaluation
  artifacts.
- A narrow review covers every surface that can change the requested diagnosis.

Reconstruct the recurring job, nearest boundary, inputs, common path,
meaningful branches, output, completion evidence, authorization, and stop
behavior. Apply every relevant part of `skill-practices.md`; omit irrelevant
parts instead of manufacturing findings for them.

## 2. Look for supported defects

Inspect for:

- discovery overlap or near-miss capture;
- an opener that promises quality, confidence, or impact without naming the
  work; prose that says how the result should feel instead of what the agent
  should do; or compression that removes actions, artifacts, decision rules,
  or completion conditions;
- vague, contradictory, duplicated, no-op, or unjustifiably rigid instructions;
- missing modes, decisions, examples, output fields, or completion behavior;
- detail in the wrong layer and resources without runtime callers;
- validators that accept plausible bad results;
- missing authorization, failure, stop, or partial-success behavior;
- private, source-specific, or maintainer material in the runtime; and
- tests that assert wording rather than observable behavior.

Trace edge cases only when they can change the verdict. Structural validation
can support a mechanical claim, but it cannot prove that the skill works well.

## 3. Write findings a maintainer can use

Separate direct observation from inferred consequence. Each finding includes:

- a precise defect and source location;
- the inspected evidence;
- the likely consequence and a falsifier when that consequence is uncertain;
- the smallest correction that addresses the cause; and
- static or behavioral evidence that could verify the correction.

Use the user's verdict and severity vocabulary when supplied. Otherwise lead
with `Accept`, `Accept with conditions`, `Revise`, or `Insufficient evidence`,
then order findings by likely consequence. Do not add a numeric score unless the
user supplies the question and scale.

## 4. Return the review

Return chat by default:

1. Verdict and scope.
2. Supported findings in consequence order.
3. Relevant rubric areas where no defect was supported.
4. Limits and open questions that could change the verdict.

When the user requests a durable machine-readable review receipt, copy
[`review.json`](../assets/review.json) to the selected output location. Replace
every placeholder, hash every inspected file that supports the verdict or a
finding, and keep the finished receipt immutable. Recheck relevant hashes
before consuming it later.

When a claim needs fresh behavioral evidence, state the limitation and the
smallest useful forward test. Change source only after the user requests an
update.
