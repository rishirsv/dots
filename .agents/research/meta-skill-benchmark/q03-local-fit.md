# Local Fit: Meta-Skill Skill Evaluator

## Research Question

How should a benchmark capability fit the existing Meta-Skill `skill-evaluator` architecture?

## Scope

Local repo files under `plugins/meta-skill`, especially evaluator runtime docs, CLI docs, manifest/report/runner/linting code, and existing evaluator planning docs.

## Answer

Meta-Skill already has the correct eval primitives. A benchmark capability should not introduce a parallel "benchmark runner." It should add a named profile and reporting layer over existing suites, runs, grades, comparisons, and calibration.

The best local shape is:

- Keep `.<skill-name>/evals.json` as the authoritative manifest for target, defaults, candidates, and cases.
- Add optional benchmark profiles under `.<skill-name>/benchmarks/<benchmark-id>.json`.
- Add CLI sugar that resolves a profile into existing `eval lint`, `eval run`, `eval grade`, `eval compare`, `eval report`, and `eval list` flows.
- Add a reference file, likely `plugins/meta-skill/skills/skill-evaluator/references/benchmarking.md`, explaining when to create a benchmark profile, what metrics mean, and how to report benchmark limits.
- Keep reports read-only and deterministic, consistent with `report.py`.

## Key Evidence

- `plugins/meta-skill/skills/skill-evaluator/SKILL.md` defines evaluator as measuring task outcomes across candidates and explicitly says it does not fix targets or generate candidate improvements.
- `skills/skill-evaluator/references/methodology.md` already recommends stable tasks, candidate comparisons, no-skill/current/edited candidates, transcript review, repeated trials, pass@k/pass^k-style analysis, and "not worth a suite yet" outcomes.
- `skills/skill-evaluator/references/eval-types.md` already separates capability, regression, trigger/boundary, failure, gate/readiness, and cost/latency/efficiency eval types.
- `skills/skill-evaluator/references/evaluations.md` already says `evals.json` is authoritative metadata and task folders own visible task bytes, fixtures, hidden validators, expected outputs, and judge guidance.
- `plugins/meta-skill/references/cli.md` defines current commands: `eval lint`, `materialize`, `run`, `progress`, `grade`, `human`, `calibrate`, `compare`, `list`, and `report`.
- `src/meta_skill/manifest.py` supports candidates, cases, splits, repetitions, runner defaults, fixtures, expectations, and graders.
- `src/meta_skill/runner.py` plans trials as case x candidate x repetition and writes run metadata, results, events, evidence, and responses.
- `src/meta_skill/report.py` builds deterministic read-only reports, impact rows, needs-attention rows, gate failure status, usage cells, and compare recommendations.
- `src/meta_skill/linting.py` already checks missing task seeds, missing graders, regression/gate references, unbalanced trigger suites, and recommends no-skill/current comparison and transcript review.
- `.meta-skill/docs/evaluator-next-plan.md` already names trigger tuning, runner choice, rubric/judge alignment, visible uncertainty, calibration, and coverage limits as product direction.

## Commands Or Searches Run

- `rg -n "benchmark|eval|compare|report|calibrate|lint|run" plugins/meta-skill -S`
- `find plugins/meta-skill -maxdepth 4 -type f | sort`
- `find plugins/meta-skill -path '*skill-evaluator*' -type f | sort`
- `sed -n` reads for `references/cli.md`, `src/meta_skill/report.py`, `src/meta_skill/manifest.py`, `src/meta_skill/runner.py`, `src/meta_skill/linting.py`, and `.meta-skill/docs/evaluator-next-plan.md`.

## Sources Consulted

- `plugins/meta-skill/skills/skill-evaluator/SKILL.md`
- `plugins/meta-skill/skills/skill-evaluator/references/methodology.md`
- `plugins/meta-skill/skills/skill-evaluator/references/eval-types.md`
- `plugins/meta-skill/skills/skill-evaluator/references/evaluations.md`
- `plugins/meta-skill/references/cli.md`
- `plugins/meta-skill/src/meta_skill/manifest.py`
- `plugins/meta-skill/src/meta_skill/runner.py`
- `plugins/meta-skill/src/meta_skill/report.py`
- `plugins/meta-skill/src/meta_skill/linting.py`
- `plugins/meta-skill/.meta-skill/docs/evaluator-next-plan.md`

## Sources Not Consulted

- Full App Server adapter internals.
- Full grading/calibration implementation beyond CLI-level behavior.
- Existing run artifacts, if any, under `.meta-skill/runs/`.

## Contradictions Or Caveats

- Current docs still mention `needs_human_review` in some places, while the next plan wants labels narrowed to `pass`, `partial`, `fail`, and `unknown`. A benchmark reference should align with the planned label simplification if that work lands first.
- `report.py` currently computes simple impact categories, but not benchmark-level scorecards, confidence intervals, pass@k/pass^k, history trends, or environment-noise diagnostics.
- Runner usage includes token usage when recorded, but richer latency/cost metrics may require App Server evidence checks.

## Confidence

High that benchmark should be a profile/report layer. High that `evals.json` should remain authoritative for tasks/candidates/graders. Medium on whether profile files should live as separate JSON files or inside `evals.json`; separate files seem cleaner and less disruptive.

## Gaps Or Next Checks

- Inspect whether `--split` already provides enough selection semantics for MVP benchmark profiles.
- Check whether run metadata records enough runner/environment information to support benchmark reproducibility claims.
- Decide whether `benchmark run` should be pure sugar over `eval run --split` or should persist a profile id into `run.json`.

## Durability Recommendation

Use this as the implementation handoff. If the feature proceeds, create a durable reference under `plugins/meta-skill/skills/skill-evaluator/references/benchmarking.md` and update `SKILL.md`/`cli.md` only after the CLI surface is chosen.
