---
name: skill-evaluator
description: "Use when asked to run, grade, browse, or report agent-skill evaluations: ad hoc evals, standard scenarios, execution-variant comparisons, custom graders, run history, or the evaluation workbench. Creates and manages evaluation artifacts and runs; not for source review, diagnosis from existing evidence, or edits."
---

# Skill Evaluator

Create realistic evaluations, compare complete agent configurations, grade the
results, and preserve enough evidence to explain the outcome. Do not review or
edit the target skill. Use `skill-reviewer` for static diagnosis and
`skill-author` for source changes.

## Choose The Evaluation Path

Use standard scenarios by default. Read
[scenarios.md](references/scenarios.md) and
[weighted-checklist.md](references/weighted-checklist.md). Each scenario is one realistic
task with the exact weighted-checklist criteria.

Use [custom-graders.md](references/custom-graders.md) only when the user explicitly
needs an independent deterministic, calibrated model, human, or state-aware
grader. Custom graders are a separate evaluation path; never blend their
verdicts into a default checklist percentage.

Use `--adhoc` for one immediate disposable observation. Do not silently promote
an ad hoc task into a durable scenario.

## Author Realistic Scenarios

Read the target skill and establish the claim before writing tasks:

- `diagnostic` observes one to three focused behaviors;
- `readiness` estimates general capability from at least 20 representative
  scenarios and explicit coverage; and
- `benchmark` adds versioned provenance, development and held-out splits, and
  contamination controls.

Write prompts as real user requests. Cover distinct common uses, meaningful
boundaries, near misses, regressions, and applicable failures. Do not inflate a
suite with paraphrases. Share new prompts and checklist criteria with the user
before an expensive run.

Store each scenario visibly beside the skill:

```text
<skill-name>/evals/<scenario-id>/
  task.md
  criteria.json
  scenario.json
```

The worker sees only `task.md` and declared fixtures. It never sees
`criteria.json`, comparison metadata, grading output, or reviewer labels.

## Grade With The Weighted Checklist

The default `criteria.json` uses exactly `context`, `type:
weighted_checklist`, and `checklist`. Every checklist row uses exactly `name`,
`description`, `max_score`, and one allowed category. Award partial points from
zero through `max_score`, then calculate:

```text
percentage = sum(awarded points) / sum(max_score) * 100
```

Do not add hard gates, required criteria, binary verdict rules, or MetaSkill
judge-calibration fields to the default format. Those belong to custom evals.

## Compare Execution Variants

Read [experiments.md](references/experiments.md). A variant is the complete
execution environment: provider, model, reasoning effort, prompt, skill
version, tools, plugins, retrieval configuration, and runner. Freeze the
resolved configuration and payloads before execution.

Keep the scenario and fixtures identical across variants. A controlled
comparison changes one declared dimension. A stack comparison may change
several dimensions, but supports only a whole-configuration conclusion; do not
attribute the result to one component.

Use one execution per scenario and variant by default. Repeat only when the
claim concerns reliability. Before repeated work, show the exact expanded
trial count, purpose, expected time, and usage, then wait for approval.

The current Codex Exec adapter supports model, reasoning effort, prompt, and
skill selection. If a variant declares tools, plugins, retrieval, or another
provider that the selected adapter cannot provision, stop with an explicit
unsupported-capability error. Never run a silently reduced variant.

## Execute And Preserve Evidence

Read [running-evaluations.md](references/running-evaluations.md) before a run.
Use unattended `eval run` for isolated comparisons. Use native `eval prepare
--no-baseline` only for a one-variant observation because native workers inherit
ambient configuration.

Freeze scenarios, variants, grader inputs, executor settings, and trial count.
Give workers only their task, declared fixtures, temporary workspace, result
path, and selected payloads. Preserve responses, events, artifacts, execution
state, grading evidence, token use, latency, and resolved capability manifests.

Treat execution success and evaluation quality as different facts. A failed
baseline is evidence, not an execution failure. Interrupted or changed inputs
require a new immutable run; reuse completed evidence only when scenario,
variant, executor, and payload digests match exactly.

## Review And Report

Report weighted checklist totals and per-criterion evidence for standard
scenarios. Report independent verdicts separately for custom evals. Identify
missing or unreliable evidence rather than converting it into a score.

Use the workbench for side-by-side artifacts and human feedback. The workbench
is a filesystem view, not a second source of truth. Preserve an accepted
failure as a regression scenario only after the user approves the behavior.

Close with the scenario path, variants compared, execution status, weighted-checklist score
or custom-grader results, material criterion differences, and the limits of the
claim.
