# Plan an evaluation

Use this reference to inspect the target, choose evaluation depth, state what
the evaluation should prove, and present the plan for approval. [Artifacts](artifacts.md)
defines approval and when changed files make old results stale.

## Inspect before asking

Read the target `SKILL.md` and every reference, script, asset, instruction, and
agent setting that affects the behavior being tested. Inspect prior reviews,
authored suites, runs, accepted outputs, and relevant history. Record:

- target files and hashes;
- host, model, instructions, tools, permissions, and memory;
- fixtures, visibility boundaries, output contract, and allowed effects;
- worker and grader mechanisms; and
- evidence already available, including its age and configuration.

Do not open secrets or treat an old receipt as current without rechecking its
dependencies.

## Choose the evidence level

- **Unproven:** use a few discriminating working cases and learn cheaply.
- **Informally tested:** turn observed successes and failures into a reusable
  suite with stable IDs.
- **Established suite:** add boundaries, holdouts, repeated trials where
  variance matters, and explicit failure attribution.
- **Mature benchmark:** begin from error analysis, preserve longitudinal
  comparability, validate judges, inspect drift, and report uncertainty when
  sample size matters to the decision.

Use the smallest level that can answer the user's question. A mature skill
does not need more random cases merely because it is mature.

## State what the evaluation should prove

State whether the evaluation tests the skill on its own, compares it with a
baseline, checks for a regression, supports a readiness decision, tests host
selection, measures cost or speed, or validates the evaluator itself. Record the
fields in [the plan asset](../assets/eval-plan.md), including accepted alternatives,
prohibited outcomes, independent evidence, hidden evidence, invalid-run
conditions, cost, permissions, stopping rules, and limits.

Use [Case design](case-design.md) for selection and controlled comparisons. If
the requested branch can answer honestly from an existing approved suite, enter
there directly instead of rewriting the plan.

## Obtain approval

Show the full plan before scored, repeated, or expensive work. Explain which
conclusions the planned cases can and cannot support. Record approval only after
the user accepts the plan. If the user asks for an end-to-end build without an
approval pause, materialize a Draft and perform only unscored feasibility work
until approval exists.
