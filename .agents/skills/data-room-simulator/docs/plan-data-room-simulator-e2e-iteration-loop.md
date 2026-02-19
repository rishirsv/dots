# Implementation Plan: Data Room Simulator E2E Iteration Loop

**Spec:** `docs/reviews/2026-01-08-data-room-simulator-review.md`, `docs/plan-data-room-simulator-output-improvements.md`
**Branch:** `chore/data-room-simulator-e2e-loop`

## Description

Create a lightweight, repeatable E2E iteration loop for the `data-room-simulator` skill: define test cases, run the full generation workflow for each case, automatically verify invariants, and perform a structured review of the generated “deal package” output. The loop should make it easy to identify regressions, measure output quality improvements over time, and drive targeted updates to the skill and generators.

## Scope

- In:
  - A small test case format (YAML/JSON) describing industry/size/mode/seed and any special knobs
  - A runner script that executes one case end-to-end and stores outputs in a stable location
  - A review rubric + checklist (what “good output” means for docs, consistency, realism)
  - A summary report that aggregates outcomes across cases (pass/fail, key metrics, notable issues)
- Out:
  - Full CI/CD integration (can be added later)
  - Large committed artifacts in git (prefer local outputs; commit only small summaries)

## Tasks

### Phase 1: Define what “good output” means

Establish objective acceptance signals before iterating on output quality.

- [ ] 1.0 Create E2E rubric and acceptance criteria
  - [ ] 1.1 Add `docs/e2e-data-room-simulator-rubric.md` defining required artifacts (manifest/index, statements, ops, HR, narratives)
  - [ ] 1.2 Define quality checks for narrative docs (no unresolved placeholders, metrics match outputs, consistent story)
  - [ ] 1.3 Define realism expectations per mode (`clean`, `realistic`, `messy`) and expected verifier behavior
  - [ ] 1.4 Validation: use the rubric to score the current sample output and capture “baseline findings”

### Phase 2: Add a test case format + runner harness

Make E2E runs repeatable (deterministic seed + isolated output directories).

- [ ] 2.0 Create test case definitions
  - [ ] 2.1 Add `e2e/cases/` with 5–10 initial cases (one per industry + a couple mode variants)
  - [ ] 2.2 Standardize a case schema (example fields): `case_id`, `industry`, `size`, `realism_mode`, `seed`, optional `name`, optional overrides
  - [ ] 2.3 Validation: schema is documented and easy to extend without touching code

- [ ] 2.1 Implement an E2E runner script
  - [ ] 2.1.1 Add `scripts/e2e_run_case.py` to run one case using the orchestrator (`scripts/run_data_room.py`) and `--output-dir`
  - [ ] 2.1.2 Store outputs under `output/e2e/<case-id>/<run-id>/` and write a small `run-summary.json`
  - [ ] 2.1.3 Add `scripts/e2e_run_all.py` to run all cases and output an aggregate summary table
  - [ ] 2.1.4 Validation: running all cases completes and produces a clear pass/fail summary without manual intervention

### Phase 3: Add a structured review + update loop (manual + scripted)

Standardize how we evaluate and improve the skill each iteration.

- [ ] 3.0 Create an iteration workflow
  - [ ] 3.1 Add `docs/e2e-data-room-simulator-iteration-playbook.md` with the loop:
    1) pick a target case (or failing check)
    2) run the case
    3) review output using the rubric
    4) log findings and decide the change
    5) update code/docs
    6) rerun case + regression set
  - [ ] 3.2 Add a “finding log” template (e.g., `docs/reviews/` entries per iteration with: issue, hypothesis, change, result)
  - [ ] 3.3 Validation: one full dry-run iteration can be followed by a junior engineer

### Phase 4: Regression management and reporting

Make improvements measurable and prevent backsliding.

- [ ] 4.0 Add regression safeguards
  - [ ] 4.1 Ensure every case run records: input config, resolved seed, output manifest, verification report, and key KPIs
  - [ ] 4.2 Add a diff-friendly “snapshot” output (`run-summary.json`) per case for quick regression comparisons
  - [ ] 4.3 Optional: add a “golden summary” file per case (checked into git) that excludes large spreadsheets and only includes small JSON/markdown summaries
  - [ ] 4.4 Validation: changes to generation logic visibly change summaries; accidental regressions are easy to spot

## Context

**Key files:**
- `docs/plan-data-room-simulator-output-improvements.md`: prerequisites (orchestrator + `--output-dir` plumbing)
- `scripts/run_data_room.py`: the E2E runner should call this
- `scripts/verify_data_room.py`: primary automated gate (pass/fail + issues)
- `output/e2e/`: recommended location for local run artifacts

## Open Questions

- Do we want to commit any E2E outputs, or only small summaries (recommended) while keeping spreadsheets uncommitted?
- Should the E2E loop treat `realistic` as “must pass checks with issues” and `messy` as “must fail checks”, or make that configurable per case?

