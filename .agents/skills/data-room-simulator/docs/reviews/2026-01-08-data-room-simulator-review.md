# Review: `data-room-simulator` vs `docs/plan-data-room-simulator.md`

**Date:** 2026-01-08  
**Reviewed artifacts:** `SKILL.md`, `scripts/*.py`, `profiles/*.json`, `templates/*.md`, `reference/*.md`, sample `output/*`

## Executive Summary

The repository delivers a working core pipeline (seed → financials → operations → HR → verify) with 5 industry profiles, templates, and a JSON verification report. However, several plan items marked ✅ are either missing, partially implemented, or implemented differently than described—especially around (1) realism modes/QoE injection, (2) verification rule coverage + “profile-driven” checks, (3) payroll/salary ties, and (4) output ergonomics (stale files, run isolation, manifests).

If the goal is “complete, internally consistent simulated M&A data rooms” with Clean/Realistic/Messy behaviors and broad cross-document verification, the current implementation is a solid foundation but not yet aligned with the plan’s stated differentiators.

## What’s Implemented (Aligned With Plan)

### Phase 1 — Structure & profiles
- Skill structure exists at repo root with `scripts/`, `profiles/`, `templates/`, `reference/`, `output/`.
- 5 industry profiles exist and include the expected top-level keys (`bounds`, `chart_of_accounts`, `documents`, `consistency_rules`, `seasonality_patterns`, etc.).

### Phase 2 — Company seed generator
- `scripts/generate_company.py` generates: company metadata, brand identity (colors/fonts), management bios, story/milestones, and an events timeline.
- Reproducibility support exists via `--seed`, but the chosen seed is not written into `company_seed.json`.

### Phase 3 — Financial generator (core statements + schedules)
- `scripts/generate_financials.py` creates: monthly TB, annual IS/BS/CF, AR/AP aging, NWC schedule, fixed asset schedule.
- Seasonality patterns are applied from profile.
- Balance sheet identity is constructed to hold by design (cash is solved as the balancing figure).

### Phase 4 — Operations generator (industry-specific detail)
- `scripts/generate_operations.py` generates industry-specific files (MRR, WIP, invoice registers, transactions, etc.).
- A revenue tie check exists (tolerance-based).

### Phase 5 — HR generator
- `scripts/generate_hr_data.py` generates employee census, payroll register, department summary, salary bands, tenure analysis.

### Phase 6 — Verification script (basic)
- `scripts/verify_data_room.py` produces `output/verification_report.json` with pass/fail and check details.
- A sample `output/verification_report.json` shows `22/22` checks passing and `10` QoE issues flagged for a SaaS realistic run.

### Phase 8/9 — Templates + reference docs
- Narrative templates exist in `templates/` and reference guides exist in `reference/`.

## Gaps / Drift vs Plan (Highest Impact)

### 1) Skill invocation instructions are brittle / incorrect
- `SKILL.md` uses an absolute `cd /Users/rishi/Code/agents/data-room-simulator` path, but the repo path in this environment is `/Users/rishi/Code/tools/data-room-simulator`.
- `SKILL.md` uses `python ...` but `python` is not guaranteed (this environment has `python3`).
- `SKILL.md` claims financials include a “debt schedule”, but `scripts/generate_financials.py` does not produce one.

**Impact:** Users can’t reliably run the workflow as written, and expected outputs don’t match.

### 2) Realism modes are not implemented as described (Clean/Realistic/Messy)
Plan differentiator: *Realistic = QoE adjustments, Messy = intentional discrepancies for stress-testing.*

Observed:
- `generate_financials.py`, `generate_operations.py`, and `generate_hr_data.py` do not materially branch behavior on `realism_mode`.
- QoE “issues” in `verify_data_room.py` are largely derived from seed events and profile lists, not detected from embedded accounting artifacts.

**Impact:** “Realistic”/“Messy” do not produce the kind of data room problems implied by the plan (e.g., embedded add-backs, reconciliation breaks, timing issues).

### 3) Events timeline is not injected into financials
Plan Phase 3 includes injecting events into revenue/expense (customer losses, lawsuits, one-time items).

Observed:
- `scripts/generate_financials.py` never reads `seed["events"]`.

**Impact:** Events exist but don’t affect the generated financial statements, reducing narrative/financial coherence.

### 4) Verification is not profile-driven and covers fewer rules than plan implies
Plan: universal + industry-specific checks loaded from profile `consistency_rules`, including inventory/COGS flows, WIP mechanics, payroll tie, TB balancing, etc.

Observed:
- `verify_data_room.py` hardcodes a limited set of checks and does not load/execute `profiles/*:consistency_rules`.
- Missing from verification implementation (examples):
  - TB “debits = credits” check
  - Payroll / salary tie to financials
  - Inventory tie for manufacturing/retail
  - COGS flow check (begin + purchases - end)
  - WIP asset/liability mechanics checks
- The plan calls for `issues`, but the report uses `qoe_issues`.

**Impact:** The “internally consistent” guarantee is weaker than it appears; rule coverage and documentation are inconsistent.

### 5) Payroll/salary “ties to P&L” is not true today
Plan: salary totals tie to P&L salary expense.

Observed:
- Financial statements do not model a salary expense line item that HR can tie to.
- HR generation targets salary totals as a % of revenue, not as a reconciliation to TB/IS.
- The verifier does not check payroll totals vs financials.

**Impact:** HR outputs can conflict with financial statements without detection.

### 6) Output directory can accumulate stale, cross-industry artifacts
Observed:
- All scripts write into a single shared `output/` with fixed filenames.
- If you run a different industry, “old” industry-specific files can remain and confuse users/reviewers.

**Impact:** Repeatable E2E runs and “what belongs to this deal” packaging are brittle.

## Documentation Drift

- `reference/consistency-rules.md` claims many rules are “enforced by the verification script” (e.g., TB balances, salary tie, inventory tie), but the current verifier does not implement most of them.

**Impact:** Readers will assume guarantees that are not currently true.

## Recommended Fixes (Prioritized)

### P0 — Make the skill runnable and outputs predictable
- Fix `SKILL.md` to use repo-relative paths and `python3`, and to accurately describe which files are generated today.
- Introduce a per-run output directory (run id + company slug) and write a `manifest.json` / `index.md` describing what was generated.
- Add a single orchestrator entrypoint (one command) to generate everything and then verify.

### P1 — Restore “coherence” and cross-document ties
- Inject `seed.events` into the financial generator (revenue/expense timing + one-time items).
- Define a financial statement representation that includes payroll/salary expense (and optionally benefits/taxes) so HR can reconcile.
- Make operations revenue ties exact (or explicitly document tolerance-based behavior and enforce it consistently).

### P2 — Make verification match the plan (or update the plan/docs)
- Either:
  1) implement the additional rules and load “checks” from `profiles/*:consistency_rules`, or
  2) pare back plan + reference claims to match what’s actually enforced.
- Expand checks for manufacturing/retail inventory ties and construction/services WIP mechanics.

### P3 — Make Realistic/Messy modes meaningfully different
- Realistic: embed identifiable QoE adjustments that remain internally consistent.
- Messy: intentionally break select reconciliations (e.g., AR aging vs BS, minor TB imbalance) and ensure verifier reports them clearly (and can optionally fail the run).

## Notes on Current Strengths

- The “balance by construction” approach makes the generated BS stable and avoids many common generation pitfalls.
- The industry dispatch coverage is broad and output files are useful for demos/training.
- The profile JSONs are a good abstraction seam; they’re just not being used for generation/verification routing yet.

