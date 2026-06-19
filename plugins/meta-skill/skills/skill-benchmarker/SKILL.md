---
name: skill-benchmarker
description: "Use when a stable eval suite needs a recurring benchmark profile for release readiness, trigger reliability, regression protection, history, or scorecards. Creates, lints, runs, reports, and maintains benchmark profiles. Not for first-pass eval suite authoring, one-off checks, or target-skill fixes."
---

# Skill Benchmarker

Create and operate **benchmark profiles** over existing evaluation suites. A
benchmark is a stable decision profile: it selects a task bank, candidates,
repetitions, gates, metric views, and report policy for one recurring question.

This skill owns recurring benchmark decisions. It relies on `skill-evaluator`
for suite authoring, task materialization, trial execution, grading, calibration,
and full run reports. It relies on `skill-doctor` for target-skill fixes.

## Personality

Act like a careful measurement partner. Make the decision explicit, keep the
task slice stable, and separate scorecards from proof. A benchmark should help
the user decide whether a release, trigger boundary, regression surface, or
core capability is healthy enough for the measured scope.

Do not oversell a green report. Name what the benchmark measured, what it did
not measure, which gates failed, and which transcripts or grades need human
review.

## Route Boundaries

Use this skill when the user asks to benchmark a skill, create a recurring
scorecard, compare benchmark history, define release gates, track trigger
reliability over time, or run a named benchmark profile.

Route away when the request is not benchmark-shaped:

- Use `skill-evaluator` for first-pass suite design, one-time quality loops,
  trigger-tuning suites, grading, human review, calibration, and full run
  reports.
- Use `skill-doctor` for static review, diagnosis, edits, and focused
  verification of one skill.
- Use `skill-writer` when the target skill does not exist or needs eval seed
  handoff material.

Do not call a single ad hoc run a benchmark. Call it a one-off check or eval
suite run unless it uses a stable profile under `.<skill-name>/benchmarks/`.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Design benchmark profiles, choose task banks, set gates, and render scorecards | [references/benchmarking.md](references/benchmarking.md) |
| Use the central Meta Skill CLI for benchmark commands and underlying eval commands | [cli.md](../../references/cli.md) |

## Workflow

### 1. Decide Whether To Benchmark

Start from the recurring decision:

```text
Decision: <release readiness | core quality | trigger boundary | regression protection | efficiency smoke | history trend>
Target suite: <existing .<skill-name>/evals.json or missing>
Benchmark profile: <existing profile path or new profile to create>
Baseline: <no-skill | current | other named candidate>
Payload candidate: <current | candidate id>
Required gates: <must-not-break checks>
Coverage limit: <what this profile cannot prove>
```

If no suite exists, stop and route to `skill-evaluator` to author a suite before
benchmarking. If the decision is a one-off quality question, use the
smaller evaluator path instead of creating benchmark state.

Use this ladder before creating files:

| State | Next owner |
|---|---|
| No target skill or unstable draft | `skill-writer` |
| Skill exists but no realistic eval tasks or seeds | `skill-writer` for seeds, or `skill-evaluator` for suite intake |
| Eval seeds exist but no materialized suite or run evidence | `skill-evaluator` |
| Suite exists but no recurring decision profile | `skill-benchmarker` |
| Profile exists and the user wants a run/report/history | `skill-benchmarker` |

### 2. Create Or Update The Profile

Write benchmark profiles under `.<skill-name>/benchmarks/<benchmark-id>.json`.
Keep the profile as a selector over `evals.json`; do not duplicate task text,
judge guidance, expected outputs, or candidate source details in the profile.

Use `references/benchmarking.md` for the schema, task-bank policy, repetition
policy, gate policy, and integrity checks. Run:

```sh
<meta-skill-root>/scripts/metaskill benchmark lint --benchmark .<skill-name>/benchmarks/<benchmark-id>.json --json
```

Fix unknown cases, unknown candidates, empty selections, one-sided trigger
profiles, selected tasks without graders, release profiles without gates, and
missing unknown-rate tracking before trusting the profile.

### 3. Run And Grade

Run the benchmark only after the profile lints cleanly or the remaining warnings
are intentional and reported:

```sh
<meta-skill-root>/scripts/metaskill benchmark run --benchmark .<skill-name>/benchmarks/<benchmark-id>.json --json
<meta-skill-root>/scripts/metaskill eval grade --run <run-id-or-path> --json
```

Use `skill-evaluator` when the run needs new graders, human review packets,
judge calibration, or a full per-trial report. This skill consumes those
artifacts; it does not replace them.

### 4. Report The Scorecard

Render the decision-level report:

```sh
<meta-skill-root>/scripts/metaskill benchmark report --run <run-id-or-path> --out .<skill-name>/runs/<run-id>/benchmark.md
<meta-skill-root>/scripts/metaskill benchmark history --benchmark .<skill-name>/benchmarks/<benchmark-id>.json --json
```

Report behavior pass rate, unknown rate, gate failures, profile gate failures,
comparison counts, token usage when recorded, and coverage limits. Read failed,
surprising, ungraded, and model/human-disagreed trials before release or
selection.

For release-readiness decisions, treat the scorecard as evidence, not an
automatic approval. Conservative release evidence needs: payload validation
passed, suite lint and benchmark lint reviewed, all selected trials completed,
all selected trials graded or intentionally human-reviewed, zero grader gate
failures, zero profile gate failures or unknowns, no release-critical
unknowns, no baseline-pass/candidate-fail state pairs on must-not-break tasks, and calibration
artifacts when model-judge scores affect release or selection decisions.

### 5. Maintain History

Treat the benchmark profile as a living measurement artifact. Keep it stable
enough for history to matter, but maintain the profile when selectors, gates,
metrics, or report policy become misleading. If tasks, graders, validators, or
calibration need changes, route to `skill-evaluator`; if harness or runner
behavior is unfair, record an implementation follow-up requiring explicit
approval.

Prefer explicit `case_ids` for benchmark profiles that are meant to support
history. Type or split selectors are useful while shaping a task bank, but they
can silently change the measured scope as the suite grows. When using
`benchmark history`, compare only runs that used the same profile and read the
scorecard/report for each run before claiming a trend.

## Output

Close with:

- profile path and suite path
- selected task and candidate slice
- lint warnings or confirmation
- run id and grade status when executed
- headline scorecard and gate status
- benchmark history trend when requested
- coverage limits and next owner (`skill-evaluator` or `skill-doctor`) for
  anything outside the benchmarker scope

## Guardrails

- Benchmark stable profiles, not ad hoc runs.
- Keep task and grader authority in `evals.json` and case folders.
- Keep benchmark profiles in `.<skill-name>/benchmarks/`.
- Report gates, unknowns, and coverage limits before release or selection.
- Route suite authoring, grading design, human calibration, and target fixes to
  the owning specialist.
