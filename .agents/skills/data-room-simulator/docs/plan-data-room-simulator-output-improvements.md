# Implementation Plan: Data Room Simulator Output Improvements

**Spec:** `docs/reviews/2026-01-08-data-room-simulator-review.md`, `docs/plan-data-room-simulator.md`
**Branch:** `feat/data-room-simulator-output-improvements`

## Description

Improve the `data-room-simulator` skill so it reliably produces a *self-contained, shareable, and internally consistent* “deal data room” per run, with meaningful Clean/Realistic/Messy behaviors, stronger cross-document verification, and generated narrative documents (CIM, policies, EBITDA bridge) that match the simulated financials. The approach is to (1) make the workflow runnable and deterministic, (2) isolate outputs per run with a manifest and index, (3) tighten financial/ops/HR ties (including event injection), and (4) expand verification to match the documented rule set.

## Scope

- In:
  - Update `SKILL.md` instructions to be correct, runnable, and output-oriented
  - Add per-run output directories + manifest/index
  - Parameterize scripts to read/write from an output directory
  - Add a one-command orchestrator script to run end-to-end generation + verification
  - Inject `company_seed.json` events into generated financials
  - Make HR and operations reconcile to financial statements (documented tolerances or exact ties)
  - Expand verification coverage and align docs with actual checks
  - Render narrative templates into populated markdown outputs
- Out:
  - Web UI, hosted API, or external integrations
  - Full “brand-styled” PDF exports (can be a later enhancement)

## Tasks

### Phase 1: Make the skill runnable and truthful

Update docs and CLI ergonomics so a user can run the skill successfully and understand outputs.

- [ ] 1.0 Fix skill invocation + dependency guidance
  - [ ] 1.1 Update `SKILL.md` to use repo-relative instructions and `python3` (no absolute paths)
  - [ ] 1.2 Update `SKILL.md` to accurately describe current outputs (remove/clarify “debt schedule”, `issues` vs `qoe_issues`)
  - [ ] 1.3 Add a minimal dependency file (choose one): `requirements.txt` or `pyproject.toml` (keep aligned with imports)
  - [ ] 1.4 Validation: follow `SKILL.md` instructions from a fresh shell; confirm the full flow completes and produced files match the doc

### Phase 2: Isolate outputs per run (no stale artifacts)

Prevent cross-run contamination by writing each deal to its own directory and producing a clear index/manifest.

- [ ] 2.0 Add per-run output directories + manifest
  - [ ] 2.1 Add `--output-dir` support to `scripts/generate_company.py`
  - [ ] 2.2 Add `--output-dir` support to `scripts/generate_financials.py` (read seed + write all outputs there)
  - [ ] 2.3 Add `--output-dir` support to `scripts/generate_operations.py` (read TB from the same output dir)
  - [ ] 2.4 Add `--output-dir` support to `scripts/generate_hr_data.py` (read TB from the same output dir)
  - [ ] 2.5 Add `--output-dir` support to `scripts/verify_data_room.py` (read all inputs and write report there)
  - [ ] 2.6 Add `output/runs/<run-id>/manifest.json` and `output/runs/<run-id>/index.md` describing files, purpose, and key metrics
  - [ ] 2.7 Validation: run two different industries back-to-back; confirm each run’s directory contains only relevant documents

### Phase 3: Add a single end-to-end orchestrator command

Reduce the workflow to one command to generate a complete data room and then verify it.

- [ ] 3.0 Create an orchestrator entrypoint
  - [ ] 3.1 Add `scripts/run_data_room.py` with CLI: `--industry`, `--size`, `--realism-mode`, `--seed`, optional `--name`, optional `--run-id`
  - [ ] 3.2 Orchestrate steps: seed → financials → operations → HR → narrative render → verify
  - [ ] 3.3 Ensure the orchestrator prints a concise summary (company, run dir, pass/fail, key KPIs, top issues)
  - [ ] 3.4 Update `SKILL.md` to prefer `python3 scripts/run_data_room.py ...` as the primary workflow
  - [ ] 3.5 Validation: run orchestrator once per industry and confirm it produces a valid `manifest.json` and `verification_report.json`

### Phase 4: Restore “coherence” between events, financials, operations, and HR

Make the narrative events and HR outputs actually reconcile to the financial statements.

- [ ] 4.0 Inject `company_seed.json` events into financial generation
  - [ ] 4.1 Update `scripts/generate_financials.py` to read `seed["events"]` and apply timed revenue/expense impacts by month
  - [ ] 4.2 Decide a consistent mapping for event categories → accounts (e.g., legal → opex category, customer_loss → revenue impact)
  - [ ] 4.3 Persist an “event impact schedule” output (e.g., `event_impacts.xlsx`) for auditability
  - [ ] 4.4 Validation: pick a seed with known events; confirm event months show detectable impacts in statements and the balance sheet still balances

- [ ] 4.1 Make HR reconcile to financials (salary/payroll tie)
  - [ ] 4.1.1 Add an explicit payroll/salary expense representation in financials (either new COA accounts or a dedicated salary allocation output)
  - [ ] 4.1.2 Update `scripts/generate_hr_data.py` to scale salaries/payroll to the modeled salary expense (document tolerances)
  - [ ] 4.1.3 Update `scripts/verify_data_room.py` to check payroll/salary tie
  - [ ] 4.1.4 Validation: verifier fails if payroll/salary exceeds tolerance vs financials

- [ ] 4.2 Make operations revenue ties deterministic (exact or documented tolerance)
  - [ ] 4.2.1 Decide per-industry policy: exact match (preferred) vs tolerance-based (documented)
  - [ ] 4.2.2 Update ops generators to correct rounding drift (e.g., last-row adjustment so sums match exactly)
  - [ ] 4.2.3 Validation: verify ops revenue equals P&L revenue per period (or within stated tolerance)

### Phase 5: Align verification and documentation with actual checks

Either implement the broader rule set or reduce docs to match reality; prefer implementing key missing checks first.

- [ ] 5.0 Expand verification coverage and make it profile-driven where helpful
  - [ ] 5.1 Add TB balance check (Σ debits = Σ credits) in `scripts/verify_data_room.py`
  - [ ] 5.2 Add net income tie check (IS net income ↔ change in retained earnings) in `scripts/verify_data_room.py`
  - [ ] 5.3 Add cash flow tie check (CF ending cash ↔ BS cash) in `scripts/verify_data_room.py`
  - [ ] 5.4 Add industry checks missing from the current implementation:
    - manufacturing/retail: inventory ledger ↔ BS inventory, basic COGS flow check
    - construction/services: WIP mechanics checks (asset/liability direction, % complete bounds)
  - [ ] 5.5 Optionally: implement a small “rule registry” that maps `profiles/*:consistency_rules` to check functions (avoid `eval`)
  - [ ] 5.6 Update `reference/consistency-rules.md` to match the implemented rules (or update implementation to match the doc)
  - [ ] 5.7 Validation: create a clean run that passes; create a deliberately broken run (via Messy mode) that fails the relevant checks

### Phase 6: Generate populated narrative documents

Turn the templates into actual deal documents tied to the generated data.

- [ ] 6.0 Render templates into run outputs
  - [ ] 6.1 Add a renderer (e.g., `scripts/render_narratives.py`) that loads `company_seed.json` + key metrics from outputs and renders:
    - `cim.md` from `templates/cim_template.md`
    - `company_overview.md` from `templates/company_overview.md`
    - `accounting_policies.md` from `templates/accounting_policy.md`
    - `ebitda_bridge.md` from `templates/ebitda_bridge.md`
  - [ ] 6.2 Ensure templates can be rendered (choose a concrete engine and keep syntax consistent)
  - [ ] 6.3 Add these rendered docs to `manifest.json` and `index.md`
  - [ ] 6.4 Validation: open the rendered markdown files and confirm placeholders are fully resolved and metrics match outputs

### Phase 7: Make Realistic/Messy modes meaningfully different (and testable)

Deliver the plan’s differentiators while keeping reproducibility and controllable failure modes.

- [ ] 7.0 Implement Realistic and Messy behaviors
  - [ ] 7.1 Realistic: embed QoE-style artifacts that remain internally consistent (e.g., one-time expenses flagged in an adjustments schedule)
  - [ ] 7.2 Messy: intentionally introduce a controlled set of reconciliation breaks (configurable) and ensure verifier reports them clearly
  - [ ] 7.3 Add a `--strict` flag in verifier/orchestrator to control whether “messy” causes overall status = fail
  - [ ] 7.4 Validation: `clean` passes with zero issues; `realistic` passes with issues; `messy` produces expected failures/issues per configuration

## Context

**Key files:**
- `SKILL.md`: user-facing workflow and guarantees
- `docs/plan-data-room-simulator.md`: original implementation plan (baseline)
- `scripts/run_data_room.py`: proposed one-command orchestrator
- `scripts/generate_financials.py`: core statements + event injection + salary expense modeling
- `scripts/verify_data_room.py`: consistency and QoE checks (should match docs/plan claims)
- `profiles/*.json`: industry abstraction seam (documents + rules + COA)
- `reference/consistency-rules.md`: must match what verifier actually enforces

## Open Questions

- Should “Messy” runs set `verification_report.status = fail` by default, or be `pass` with “issues” unless `--strict` is enabled?
- Do we want exact ties everywhere (preferred) or tolerance-based ties for rounding realism? If tolerance-based, what are the per-document tolerances?
- Should narrative rendering be purely markdown, or do we also want optional PDF export in a later phase?

