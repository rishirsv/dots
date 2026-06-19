# Benchmarking

Read when the benchmarker needs to design, lint, run, or report a recurring
benchmark profile for a skill: release readiness, core quality, trigger
reliability, regression protection, efficiency smoke, or historical comparison
across runs.

A benchmark is not a new eval type. It is a named, stable profile over an eval
suite that fixes the task slice, candidates, repetitions, gates, metric views,
comparison baseline, and reporting standard for one recurring decision.

## When To Use A Benchmark

Use a benchmark when the same decision will be asked repeatedly:

- whether a skill candidate is better than `current`
- whether a release candidate preserves must-not-break behavior
- whether trigger routing is reliable across should-trigger and near-miss tasks
- whether a mature capability suite is becoming a regression suite
- whether recorded token usage drifts after edits

Start small. Five to ten tasks is enough for a local benchmark when the expected
effect size is large. Expand only when the current task bank is too noisy or too
saturated to answer the decision.

## When Not To Benchmark

Skip a benchmark when the question is a one-off fix, the target skill is still
being shaped, a deterministic validator fully answers the question, or the
benchmark would cost more to maintain than the skill's usage justifies. Say "no
benchmark yet" and route to `skill-evaluator` for a smaller quality loop or to
`skill-doctor` for static review and repairs.

Do not use benchmark language for a single run without a stable profile. Call
that a quality loop, trigger tuning run, or formal suite run instead.

## Benchmark Vocabulary

| Term | Meaning |
|---|---|
| **benchmark profile** | A JSON file under `.<skill-name>/benchmarks/` selecting tasks, candidates, repetitions, gates, metrics, and report policy. |
| **task bank** | The stable set of suite cases selected by the profile. |
| **baseline** | The comparison candidate, usually `no-skill` for skill lift or `current` for release-readiness checks. |
| **payload candidate** | The skill-bearing candidate being compared with the baseline. |
| **gate** | A required grader result that rejects the candidate for the measured scope when it fails. |
| **scorecard** | The benchmark-level summary derived from run artifacts. |
| **history** | Prior runs associated with the same benchmark profile. |

Keep using evaluator vocabulary for the underlying evidence: suite, task,
candidate, trial, transcript, outcome, grader, and run.

## Benchmark Profile

Profiles live beside the suite workbench, not inside the portable skill payload:

```text
.<skill-name>/
  evals.json
  cases/
  benchmarks/
    core.json
    trigger-boundary.json
  runs/
```

Use explicit `case_ids` for profiles that should support history. `types` and
`split` selectors are useful for broad smoke profiles, but they can change the
measured task bank when the suite grows.

Use this shape:

```json
{
  "schema_version": 1,
  "id": "core",
  "decision": "Track skill lift and regressions on the stable core task bank.",
  "suite": "../evals.json",
  "task_selection": {
    "case_ids": ["natural-trigger", "quality-basic", "near-miss"],
    "types": ["capability", "trigger", "negative_control"],
    "split": "benchmark-core"
  },
  "candidates": {
    "baseline": "no-skill",
    "payloads": ["current"]
  },
  "repetitions": {
    "default": 1,
    "trigger": 5
  },
  "metrics": [
    "behavior_pass_rate",
    "comparison_counts",
    "gate_failures",
    "unknown_rate",
    "tokens"
  ],
  "gates": [
    {
      "metric": "prompt-boundary",
      "required_label": "pass"
    }
  ],
  "calibration": {
    "human_spot_check": "when selection depends on subjective quality"
  },
  "integrity": {
    "run_null_candidate_when_possible": true,
    "hidden_files_must_not_be_staged": true
  },
  "report": {
    "include_history": true,
    "include_coverage_limits": true
  }
}
```

Treat `evals.json` as authoritative for tasks, candidates, graders, fixtures,
and runner defaults. The benchmark profile only selects and names a recurring
decision.

The `metrics` list controls the decision-level report view. The implementation
may compute additional structured fields for automation, but the Markdown
scorecard should foreground only the metric families named by the profile.
Custom grader names such as `activation` or `boundary` belong in task graders
and profile gates; they are not benchmark metric names.

## Task Bank Design

Keep capability, regression, trigger, and gate claims separate. A single
benchmark profile may include several task types, but the report must not turn
them into one vague score.

For trigger benchmarks, include should-trigger and should-not-trigger or
near-miss tasks. For release benchmarks, include at least one gate. For
capability benchmarks, keep tasks hard enough that the current skill has room to
improve. When a capability task saturates, graduate it into a regression or
release-gate benchmark.

Every selected task should expose the behavior the grader checks. Hidden
graders may hold expected outputs, reference solutions, or rubric detail, but
they must not require unstated task behavior.

## Candidate And Baseline Policy

Use `no-skill` as the baseline when the decision is skill lift. Use `current`
as the baseline when the decision is whether an edited candidate is
release-ready for the measured scope.

Keep the visible task bytes stable across candidates. Do not write "use the
skill" into `task.md`; candidate setup supplies the skill payload.

## Grader And Calibration Policy

Choose the most exact fair grader:

- code validators for exact files, schemas, state, command results, or forbidden
  behavior
- model judges for semantic quality, completeness, groundedness, and multiple
  valid answers
- human grades for taste, domain judgment, release-readiness decisions, and
  model-judge calibration

Use gates for must-not-break checks. A gate failure records a failed state for
the measured check even when average scores are high.

Calibrate model judges against human labels before using judge scores for
high-judgment release or selection decisions. Give judges an `unknown` escape
when evidence is insufficient or contradictory.

## Repeated Trials

Use repetitions when behavior is variable, especially trigger routing,
long-horizon tasks, model-judged outcomes, and user-simulator tasks.

Do not compare repeated and single-shot results as if they measure the same
thing. Report the repetition count with the metric.

## Integrity Checks

Do not trust a benchmark until basic integrity checks pass:

- hidden files are not staged into the trial workspace
- reference answers and validators are grader-side only
- null or trivial submissions fail when a task has deterministic validators
- expected behavior in the grader is visible in `task.md`
- runner environment, candidate ref, dirty flag, and payload digest are recorded
- failed or surprising transcripts are inspected before release or selection

For web-enabled or public benchmark material, treat contamination as a live
risk. Avoid publishing answer keys or worked solutions where future agents can
retrieve them.

## Benchmark Report

A benchmark report should start from the decision and only then show scores.
Include:

- benchmark id, profile path, suite path, run id, and candidates
- task count by type or split
- behavior pass rate, unknown rate, and gate failures
- comparison counts: `baseline_fail_candidate_pass`,
  `baseline_pass_candidate_fail`, `both_fail`, `both_pass`, and
  `unknown_state_pairs`
- token metrics only when the runner recorded usage
- calibration artifacts for the run, or why calibration was skipped
- history rows when `report.include_history` is true, with the caveat that
  history lists matching benchmark runs rather than computing trend deltas
- coverage limits and non-claims

A green benchmark is not proof of broad reliability. Say what was measured and
what remains outside the task bank.

## Maintenance

Review benchmark profiles when tasks saturate, repeated 0% pass rates appear,
model and human grades disagree, validators reject valid solutions, or reports
depend on missing usage or transcript evidence.

Benchmark profiles are living measurement artifacts. Keep them stable enough
for history to matter, but maintain only the selector, gates, metrics, and
report policy. Route task, grader, validator, or calibration changes to
`skill-evaluator`; record unfair harness or runner behavior as an implementation
follow-up requiring explicit approval.

## Release Readiness

Do not equate a green benchmark with release approval. For release decisions,
report the benchmark result as evidence with conditions:

- skill validation passed
- suite lint and benchmark lint warnings were reviewed
- all selected trials completed
- all selected trials are graded or intentionally human-reviewed
- grader gate failures, profile gate failures, and profile gate unknowns are 0
- release-critical unknown rate is 0 or explicitly accepted
- baseline-pass/candidate-fail state pairs on must-not-break tasks are 0
- model-judge release or selection claims have a calibration artifact or a
  stated human spot-check decision
- coverage limits name the unmeasured task families

## Failure Modes

Watch for:

- one-sided trigger suites that reward overactivation
- validators that test easy proxies instead of intended behavior
- model judges without human calibration
- hidden assumptions in graders
- public answers, git history, or verifier files leaking into trial workspaces
- infrastructure differences larger than the candidate delta
- scorecards that hide gate failures or unknown evidence

## CLI Flow

Use the central CLI:

```sh
<meta-skill-root>/scripts/metaskill benchmark lint --benchmark .<skill-name>/benchmarks/core.json --json
<meta-skill-root>/scripts/metaskill benchmark run --benchmark .<skill-name>/benchmarks/core.json --json
<meta-skill-root>/scripts/metaskill eval grade --run <run-id-or-path> --json
<meta-skill-root>/scripts/metaskill benchmark report --run <run-id-or-path> --out .<skill-name>/runs/<run-id>/benchmark.md
<meta-skill-root>/scripts/metaskill benchmark history --benchmark .<skill-name>/benchmarks/core.json --json
```

Run `eval report` when you need the full trial table. Run `benchmark report`
when you need the decision-level scorecard for a benchmark profile.
