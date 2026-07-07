---
name: skill-benchmarker
description: "Use when a stable eval suite needs a recurring benchmark preset for release readiness, trigger reliability, regression protection, history, or scorecards. Creates, lints, runs, reports, and maintains eval presets. Not for first-pass eval suite authoring, one-off checks, or target-skill fixes."
---

# Skill Benchmarker

Create and operate **eval presets** over existing evaluation suites. A preset
is a stable decision profile: it selects a task bank, candidates,
repetitions, release gates, metric views, and report policy for one recurring
benchmark question.

This skill owns recurring benchmark decisions. It relies on `skill-evaluator`
for suite authoring, task materialization, trial execution, grading, calibration,
and full run reports. It relies on `skill-doctor` for target-skill fixes.

## Benchmark Posture

Start from the recurring decision, keep the task slice stable, and separate
scorecards from proof. A preset should help the user decide whether a
release, trigger boundary, regression surface, or core capability meets the
release gates for the measured scope.

Do not oversell a green report. Name what the preset measured, what it did
not measure, which release gates failed, and which transcripts or grades need
human review.

Keep the preset vocabulary behind the decision. The user should see the
recurring question, measured scope, result, and coverage limits before preset
fields, release gates, or metric names.

## Route Boundaries

Use this skill when the user asks to benchmark a skill, create a recurring
scorecard, compare benchmark history, define release gates, track trigger
reliability over time, or run a named eval preset.

Route away when the request is not benchmark-shaped:

- Use `skill-evaluator` for first-pass suite design, one-time quality loops,
  trigger-tuning suites, grading, human review, calibration, and full run
  reports.
- Use `skill-doctor` for static review, diagnosis, edits, and focused
  verification of one skill.
- Use `skill-writer` when the target skill does not exist or needs eval seed
  handoff material.

Do not call a single ad hoc run a benchmark. Call it a one-off check or eval
suite run unless it uses a stable preset under `.<skill-name>/presets/`.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Design eval presets, choose task banks, set release gates, and render scorecards | [references/benchmarking.md](references/benchmarking.md) |
| Add release gates for static skill quality or payload hygiene | [judge-rubric.md](../../references/judge-rubric.md), [payload-hygiene.md](../../references/payload-hygiene.md) |
| Use the central Meta Skill CLI for `--preset` commands and underlying eval commands | [cli.md](../../references/cli.md) |

## Workflow

### 1. Decide Whether To Benchmark

Start from the recurring decision:

```text
Decision: <release readiness | core quality | trigger boundary | regression protection | efficiency smoke | history trend>
Target suite: <existing .<skill-name>/evals.json or missing>
Eval preset: <existing preset path or new preset to create>
Baseline: <no-skill | current | other named candidate>
Payload candidate: <current | candidate id>
Required release gates: <must-not-break checks>
Coverage limit: <what this preset cannot prove>
```

If no suite exists, stop and route to `skill-evaluator` to author a suite before
benchmarking. If the decision is a one-off quality question, use the
smaller evaluator path instead of creating preset state.

Use the lifecycle routing check in
[meta-skill/SKILL.md](../meta-skill/SKILL.md#ambiguity) before creating
files.

### 2. Create Or Update The Preset

Write eval presets under `.<skill-name>/presets/<preset-name>.json`.
Keep the preset as a selector over `evals.json`; do not duplicate task text,
judge guidance, expected outputs, or candidate source details in the preset.

Use `references/benchmarking.md` for the schema, task-bank policy, repetition
policy, release gate policy, and integrity checks. Release presets must set
`decision: "release"`; substring matches in the preset id do not count. Run:

```sh
<meta-skill-root>/scripts/metaskill eval run --check --preset .<skill-name>/presets/<preset-name>.json --json
```

Fix unknown cases, unknown candidates, empty selections, one-sided trigger
presets, selected tasks without graders, release presets without release gates,
and missing unknown-rate tracking before trusting the preset. Malformed release
gates, integrity policy, or report policy fail when a preset is applied; do not
leave those as known warnings.

### 3. Run And Grade

Run the preset only after it lints cleanly or the remaining warnings
are intentional and reported:

```sh
<meta-skill-root>/scripts/metaskill eval run --preset .<skill-name>/presets/<preset-name>.json --json
```

`eval run --preset` grades automatically; do not run a separate `eval grade`
step after it. Use `skill-evaluator` when the run needs new graders, human
review packets, judge calibration, or a full per-trial report. This skill
consumes those artifacts; it does not replace them.

### 4. Report The Scorecard

Render the decision-level report:

```sh
<meta-skill-root>/scripts/metaskill eval report --run <run-id-or-path> --out .<skill-name>/runs/<run-id>/benchmark.md
<meta-skill-root>/scripts/metaskill eval list --preset .<skill-name>/presets/<preset-name>.json --json
```

Report behavior pass rate, unknown rate, grader gate failures, release gate
failures, comparison counts, token usage when recorded, and coverage limits.
Read failed, surprising, ungraded, and model/human-disagreed trials before
release or selection.

For release-readiness decisions, treat the scorecard as evidence, not an
automatic approval. Conservative release evidence needs: payload validation
passed, shared payload hygiene or skill-quality release gates reviewed when the
release concerns portable skill payloads, suite lint and preset lint reviewed,
all selected trials completed, all selected trials graded or intentionally
human-reviewed, zero grader gate failures, zero release gate failures or
unknowns, no release-critical unknowns, no baseline-pass/candidate-fail state
pairs on must-not-break tasks, and calibration artifacts when model-judge scores
affect release or selection decisions.

### 5. Maintain History

Treat the eval preset as a living measurement artifact. Keep it stable
enough for history to matter, but maintain the preset when selectors, release
gates, metrics, or report policy become misleading. If tasks, graders,
validators, or calibration need changes, route to `skill-evaluator`; if harness
or runner behavior is unfair, record an implementation follow-up requiring
explicit approval.

Prefer explicit `case_ids` for presets that are meant to support
history. Type or split selectors are useful while shaping a task bank, but they
can silently change the measured scope as the suite grows. When using
`eval list --preset`, compare only runs that used the same preset and read the
scorecard/report for each run before claiming a trend.

## Output

Close with:

- preset path and suite path
- selected task and candidate slice
- lint warnings or confirmation
- run id and grade status when executed
- headline scorecard and release gate status
- benchmark history trend when requested
- coverage limits and next owner (`skill-evaluator` or `skill-doctor`) for
  anything outside the benchmarker scope

## Guardrails

- Benchmark stable presets, not ad hoc runs.
- Keep task and grader authority in `evals.json` and case folders.
- Keep eval presets in `.<skill-name>/presets/`.
- Report release gates, unknowns, and coverage limits before release or selection.
- Route suite authoring, grading design, human calibration, and target fixes to
  the owning specialist.
