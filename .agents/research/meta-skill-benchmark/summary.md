# Meta-Skill Benchmark Capability Research Summary

## Original Question

Perform deep research on OpenAI/Anthropic-built benchmarks, other leading benchmarkers and methodologies, compare methods, suggest a method for Meta-Skill's `skill-evaluator`, and propose the shape of a reference file and plan.

## Subreports

- [q01-openai-anthropic.md](q01-openai-anthropic.md)
- [q02-ecosystem-methods.md](q02-ecosystem-methods.md)
- [q03-local-fit.md](q03-local-fit.md)

## Bottom Line

Add benchmark capability as a small layer over the current evaluator:

- A benchmark is a named, stable profile selecting tasks, candidates, repetitions, gates, metric views, and report policy.
- It reuses the existing suite/case/candidate/trial/grader/run machinery.
- It produces benchmark scorecards and comparisons from existing run artifacts.
- It does not create a separate runner, grader system, or public leaderboard architecture.

## Comparison Of Methods

| Method family | Representative sources | Strength | Weakness | Meta-Skill takeaway |
|---|---|---|---|---|
| Static answer benchmarks | SimpleQA, GAIA | Easy to score and compare | Contamination, saturation, thin process signal | Use exact answer checks only for narrow deterministic skill outputs |
| Real-world coding tasks | SWE-bench, SWE-bench Verified | Strong external validity, deterministic tests | Test flaws, git-history leakage, contamination, scaffold sensitivity | Use real task prompts plus validators, but isolate hidden files and audit tests |
| Terminal/environment tasks | Terminal-Bench | End-to-end agent realism | Infrastructure noise and verifier leakage risk | Record environment metadata and test null submissions |
| Interactive tool/user worlds | tau-bench | Measures policies, tools, state, multi-turn reliability | Requires simulators and stateful harness | For skills, simulate user/process only when the skill contract is conversational |
| Rubric benchmarks | PaperBench, HealthBench | Handles complex open-ended outcomes with partial credit | Expensive, judge calibration burden | Use small hierarchical rubrics and human spot checks |
| Human-calibrated autonomy | METR RE-Bench/time horizons | Faithful human comparison, repeated attempts | Small task count, high cost | Borrow repeated trials and human-comparable difficulty, not the full apparatus |
| Holistic/framework evals | HELM, Inspect, lm-eval | Standardized, reproducible, multi-metric | Can become framework-heavy | Keep Meta-Skill's workbench simple, but add profile/report conventions |
| Benchmark auditing | Berkeley RDI, DebugML | Finds score inflation and cheating | Adds extra maintenance cost | Add a lightweight benchmark-integrity checklist before trusting scores |

## Suggested Method For Skill Evaluator

### Benchmark Definition

A Meta-Skill benchmark should mean:

> A named, stable profile over an eval suite that fixes the task slice, candidates, repetitions, gates, metrics, comparison baseline, and reporting standard for a recurring decision.

Examples:

- `core`: "Is the skill useful across representative tasks?"
- `trigger-boundary`: "Does it activate only when it should?"
- `release-gate`: "Can this candidate be promoted without breaking must-not-break behavior?"
- `efficiency-smoke`: "Did the candidate become too expensive/noisy?"

### Profile Shape

Keep profiles outside `evals.json`:

```text
.<skill-name>/
  evals.json
  cases/
  benchmarks/
    core.json
    trigger-boundary.json
  runs/
```

Suggested profile schema:

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
    "skill_lift",
    "candidate_regressions",
    "gate_failures",
    "unknown_rate",
    "pass_at_k",
    "pass_caret_k",
    "turns",
    "tool_calls",
    "tokens"
  ],
  "gates": [
    {
      "metric": "prompt-boundary",
      "required_label": "pass"
    }
  ],
  "calibration": {
    "required_for_model_judges": false,
    "human_spot_check": "when promotion depends on subjective quality"
  },
  "integrity": {
    "requires_reference_solution": false,
    "run_null_candidate_when_possible": true,
    "hidden_files_must_not_be_staged": true
  },
  "report": {
    "compare_to": "current",
    "include_history": true,
    "include_coverage_limits": true
  }
}
```

### Report Shape

Benchmark reports should render:

- Decision being answered.
- Profile id and suite path.
- Task count by type and split.
- Candidate comparison.
- Behavior pass rate and gate failures.
- Impact rows: improves, regresses, both fail, baseline already succeeds, needs more evidence.
- Reliability when repetitions exist: pass@k and pass^k.
- Efficiency when usage exists: tokens, turns, tool calls, latency if available.
- Calibration state: calibrated, spot-checked, skipped, or required.
- Integrity notes: hidden files, null-solution check, reference solution, environment metadata.
- Coverage limits and non-claims.

## Reference File Shape

Create:

```text
plugins/meta-skill/skills/skill-evaluator/references/benchmarking.md
```

Recommended headings:

1. `# Benchmarking`
2. `When To Use A Benchmark`
3. `When Not To Benchmark`
4. `Benchmark Vocabulary`
5. `Benchmark Profile`
6. `Task Bank Design`
7. `Candidate And Baseline Policy`
8. `Grader And Calibration Policy`
9. `Repeated Trials And Reliability`
10. `Integrity Checks`
11. `Benchmark Report`
12. `Maintenance`
13. `Failure Modes`
14. `CLI Flow`

Key guidance to include:

- Benchmarks are recurring decision profiles, not new eval types.
- Start with 5-10 tasks for a local benchmark; expand only when scores are too noisy for the decision.
- Keep capability, regression, trigger, and gate claims separate.
- Prefer exact validators for exact requirements; use model judges for semantic quality; require human spot checks for subjective promotion decisions.
- Use pass@k only when "one successful retry" matters; use pass^k when consistency matters.
- Read transcripts for failures, surprises, improvements, regressions, and model/human disagreements.
- Retire or graduate saturated tasks.
- Do not trust a benchmark until hidden files are protected, null submissions fail, and task descriptions expose everything graders require.

## Implementation Plan

### Phase 1: Reference And Manifest Design

- Add `references/benchmarking.md`.
- Add a short `SKILL.md` reference-map row.
- Document profile files under `.<skill-name>/benchmarks/`.
- Define benchmark as profile/report layer.
- No CLI behavior yet.

### Phase 2: Lint Support

- Add benchmark-profile loader.
- Add `metaskill eval benchmark lint --benchmark <path> --json`.
- Validate profile id, suite path, selected cases, selected candidates, gates, repetition overrides, and report metric names.
- Warn on one-sided trigger profiles, missing gates for release profiles, model judges without calibration note, and selected tasks with no graders.

### Phase 3: Run Sugar

- Add `metaskill eval benchmark run --benchmark <path> --json`.
- Resolve selected cases/candidates/repetitions into existing `eval run`.
- Persist `benchmark_id` and `benchmark_profile` path into `run.json`.
- Avoid duplicating runner logic.

### Phase 4: Benchmark Report

- Add `metaskill eval benchmark report --run <run> [--benchmark <path>]`.
- Reuse `report.py` structured report.
- Add aggregate scorecard, pass@k/pass^k where repetitions exist, gate summary, unknown rate, integrity notes, and history pointer.

### Phase 5: History Compare

- Add `metaskill eval benchmark history --benchmark <path>`.
- Compare current run with previous runs for same benchmark id.
- Show trends only when task/candidate/profile digests match or report drift explicitly.

## Open Questions

- Should benchmark profiles be separate files or embedded in `evals.json`? Recommendation: separate files to keep `evals.json` authoritative for task/candidate definitions and profiles authoritative for recurring decisions.
- Should MVP expose new CLI commands or only document use of `--split`? Recommendation: start with docs, then add lint/report first; run sugar can come later.
- Does App Server evidence reliably include turns/tool calls/latency? Token usage appears supported; richer process metrics need verification.
- Should benchmark reports compute confidence intervals? Recommendation: not in MVP; add paired candidate deltas and uncertainty language first.

## Final Recommendation

Proceed, but keep it small:

1. Write `benchmarking.md`.
2. Add benchmark profile schema as a reference-level contract.
3. Implement lint/report before a new runner command.
4. Reuse existing eval runs.
5. Make benchmark reports conservative: "measured scope," gates, uncertainty, calibration, and coverage limits first; score second.

## Sources

See the subreports for the full source inventory.
