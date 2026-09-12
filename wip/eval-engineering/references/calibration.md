# Calibration

Calibration tests whether the Task measures the intended capability fairly. A
score or pass rate alone cannot answer that question.

## Choose evidence

Audit discovery without treating ungraded dimensions as failures. Collect
independent judgments using [Human review](review.md) before showing automated
subjective grades. Apply Verifier-specific checks below only where one was used.

Run the production Harness and target model. Model comparison is optional. Use
a weaker or stronger model only when contrast can answer a named uncertainty,
such as whether the instruction is unclear, the Verifier is weak, or a shortcut
exists. Repeat trials only when behavior varies enough to affect the conclusion.
Complete the [package audit](task-running.md#audit-package-completeness-before-running)
before scored model trials.

Do not require a weak-target-strong ladder or a fixed model count. One carefully
inspected target-model run can be sufficient when deterministic checks pass and
the run answers the current quality questions.

Do not require a fixed pass-rate pattern. A weak model can pass by finding a
leak. A strong model can fail because of a broken service or unfair prompt.

## Read complete runs

For each selected trial, inspect:

- all messages, model calls, tool calls, results, retries, and errors;
- initial and final Environment state and external effects;
- setup, service, readiness, reset, timeout, and cleanup logs;
- every Verifier criterion, its evidence, decision, and error; and
- resolved Harness, model, Environment, judge, and timeout settings.

Compare strategies, not only rewards. Check whether the agent had all required
information, whether the Environment behaved as designed, whether the Verifier
accepted equivalents, and whether a pass used a shortcut or leaked fact.

## Classify each problem

| Cause | Meaning | Action |
|---|---|---|
| Capability | Fair access and correct infrastructure, but intended work failed | Keep as an agent result |
| Missing information | A needed fact was accidentally withheld | Fix Task or Environment; deliberate ambiguity can validly test clarification |
| Harness | Runtime, tool, prompt, session, or adapter was wrong | Fix Harness |
| Environment | State, service, permission, fidelity, or reset was wrong | Fix Environment |
| False rejection | A valid result failed | Fix Verifier |
| False acceptance | An invalid result passed | Fix Verifier |
| Leakage | Hidden truth or scoring logic was visible | Fix packaging or boundary |
| Infrastructure | Build, startup, capture, judge, credential, cleanup, or runtime timing failed | Repair; affected grades invalid |
| Agent omission | Required output missing or corrupt, but environment and capture worked | Score the affected requirement as a candidate failure |
| Task budget exhausted | Agent used the agreed time/turn budget under functioning conditions | Grade completion under the declared rule; retain partial work |

Missing evidence is a symptom, not a classification. Establish who should have
produced it and whether capture worked. An absent workbook is a candidate failure
if it was never created; a workbook lost by collection is a capture fault. When
the cause is unknown, mark the affected conclusion inconclusive rather than
guessing. Score unaffected criteria only when their evidence remains sufficient.

Record completed, invalid, cancelled, and ungraded trials separately. Exclude
invalid grades from pass-rate denominators and report their count and reason;
do not exclude genuine candidate failures. Repair and rerun only within approved
scope and retain the original evidence. For grading-only corrections, follow
[consistent regrading](comparison.md#keep-judgments-comparable).

Do not make a Task harder to hide a defect. First repair all non-agent causes
and rerun affected trials.

## Judge difficulty and fairness

A good hard Task requires real work. It does not rely on hidden information,
unclear language, fragile startup, unrealistic data, or a broken check. If all
models fail, test solvability and fairness first. If all pass, inspect for weak
criteria and leakage before changing difficulty.

To change difficulty, change one supported condition: more relevant state,
longer history, stale or conflicting facts, permissions, delayed effects,
required clarification, or collateral-change risk. Keep the required evidence
visible or normally discoverable.

Report model and Harness versions, trial counts, criterion results, strategies,
failure causes, defects fixed, rerun results, remaining uncertainty, and the
next recommended change.
