---
name: meta-skill
description: "Use for ANY work on an agent skill — authoring a new skill, reviewing or improving one, diagnosing failures, evaluating outcomes, or benchmarking recurring release and quality decisions. Routes ambiguous or multi-step skill-lifecycle requests to skill-writer, skill-doctor, skill-evaluator, or skill-benchmarker. Not for non-skill tasks."
---

Route agent-skill lifecycle requests to the right Meta-Skill specialist. Treat
any request to create, revise, debug, review, test, evaluate, package, or reason
about an agent skill as intent to use this plugin.

Use [cli.md](../../references/cli.md) for Meta-Skill CLI commands and
validation.

## Router Only

This skill is the front door for Meta-Skill work; it does not perform specialist
workflow logic itself.

When a request matches `skill-writer`, `skill-doctor`, `skill-evaluator`, or
`skill-benchmarker`, load the focused skill and follow it. If several
specialist steps are needed, sequence them in the order that creates the useful
lifecycle flow, but keep each step owned by its focused skill.

## Plugin Purpose

Meta-Skill helps agents create, improve, debug, test, and evaluate reusable
agent skills with clear routing, source-owned edits, deterministic validation,
and evidence-backed iteration.

## Routing And Skill Selection

Pick the smallest specialist route that satisfies the user's request.

- Use `skill-writer` for new skills, blank-page drafting, trigger design,
  authoring guidance, source distillation, or turning a repeated workflow into a
  portable skill.
- Use `skill-doctor` for existing skills: reviews, fixes, diagnosis, prompt
  cleanup, trigger tuning, implementation improvements, or reported failures.
- Use `skill-evaluator` when the user needs task evidence across candidates,
  such as no-skill vs current-skill vs edited-skill comparisons, trial suites,
  scoring, or outcome measurement.
- Use `skill-benchmarker` when the user needs a recurring benchmark profile,
  release-readiness scorecard, trigger-reliability history, regression
  benchmark, or benchmark report over an existing eval suite.
- For a one-prompt trial of a draft or fix, stay with the owning specialist and
  use [skill-trial-runs.md](../../references/skill-trial-runs.md).

Disambiguation: `skill-doctor` owns static design review, diagnosis, and fixes
for one skill; `skill-evaluator` owns behavioral evidence across candidates;
`skill-benchmarker` owns recurring decision profiles and scorecards over that
evidence.

Validation, packaging, and install checks use [cli.md](../../references/cli.md)
through the specialist already doing the work. Do not create a separate
validation lane inside this router.

## Ambiguity

Ask one compact clarification only when the user's intent would select different
specialists or materially change the edit/evaluation scope. If the request is
clear enough to route, do not pause here.

Useful tiebreakers:

- A request about a new skill starts with `skill-writer`.
- A request about reviewing or fixing one specific existing skill starts with
  `skill-doctor`.
- A request asking whether a change improves outcomes starts with
  `skill-evaluator`.
- A request to benchmark, trend, gate, or report a recurring release/quality
  decision starts with `skill-benchmarker`.
- A request to "use this skill" for a non-skill task is not Meta-Skill work; use
  the target skill directly.

Use this ladder when the user says "benchmark it" or "is this release-ready":

| State | Route |
|---|---|
| The target skill does not exist or is still being authored | `skill-writer` |
| The skill exists but has no eval seeds or realistic tasks | `skill-writer` for eval seed handoff, or `skill-evaluator` if the user explicitly wants suite intake |
| Eval seeds or `evals.json` exist but no measured suite has been run | `skill-evaluator` |
| A stable suite exists and the user wants recurring gates, history, or scorecards | `skill-benchmarker` |
| A benchmark report reveals a concrete skill defect | `skill-doctor` |

For ambiguous release-readiness requests, ask one routing question only when the
answer cannot be inferred: "Do you already have an eval suite or benchmark
profile you want to track repeatedly?"

## Multi-Step Flows

Sequence specialists only when one focused skill cannot own the full journey.

- Draft then test or measure: `skill-writer` → `skill-evaluator`.
- Fix then verify outcomes: `skill-doctor` → `skill-evaluator`.
- Suite then recurring benchmark: `skill-evaluator` → `skill-benchmarker`.
- Evaluation reveals a concrete defect: `skill-evaluator` → `skill-doctor`.

Stop the loop when the user's goal gate is met, validation blocks, or the next
decision belongs to the user.

## Handoff Rules

When routing, preserve the user's concrete target skill, source path, failure
case, examples, constraints, and requested output shape. Call out when a
`description` change would affect discovery or routing.

For source edits, edit the source skill, not generated plugin package copies.
After skill payload edits, review the changed skill directly and run the
deterministic validation that applies before syncing or committing.

## Guardrails

- Keep this index as a router; do not perform focused workflow logic here.
- Do not duplicate specialist checklists, rubrics, or edit procedures.
- Do not broaden a user's skill task into plugin architecture work unless they
  ask for that scope.
