# Manual Test Plan - KPMG Slide Workflow

This plan covers five realistic KPMG-style tasks across small, medium, and large deck sizes.

## Prerequisites

- `npm install`
- `python3 testing/scripts/prepare_test_data.sh` (builds SEC and simulated data room samples)

Sample data output locations:
- SEC-based inputs: `testing/data/sec/`
- Simulated diligence rooms: `testing/data/data_rooms/`

## Scenario 1 - SEC filing to business overview (Small: 8-10 slides)

- Objective: Build a concise business overview deck from public filings.
- Inputs:
  - `testing/data/sec/AAPL/annual_metrics.csv`
  - `testing/data/sec/AAPL/quarterly_metrics.csv`
  - `testing/data/sec/AAPL/recent_filings.csv`
- Typical workflow:
  1. Summarize company, segment context, and period coverage.
  2. Build 1-2 numeric slides (trend + snapshot table).
  3. Generate an 8-10 slide deck with clear sources.
- Validate:
  - Every numeric claim has source text.
  - No blocking QA findings.
  - Titles + straplines communicate the story without reading body text.

## Scenario 2 - Buy-side CDD baseline (Medium: 15-20 slides)

- Objective: Create a mid-size diligence storyline from a simulated SaaS target.
- Inputs:
  - `testing/data/data_rooms/scenario02-saas-mid-realistic/`
- Typical workflow:
  1. Build sectioned outline (market, growth, unit economics, risks, recommendations).
  2. Use chart-first slides for KPIs and trend claims.
  3. Deliver 15-20 slide deck with exec summary + next steps.
- Validate:
  - One-slide-one-message holds across content slides.
  - Units and periods are consistent across charts/tables.
  - QA loop resolves blocking issues within 3 cycles.

## Scenario 3 - QoE bridge and adjustment story (Medium: 12-16 slides)

- Objective: Produce a QoE-focused deck with adjustments and implications.
- Inputs:
  - `testing/data/data_rooms/scenario03-manufacturing-mid-messy/`
- Typical workflow:
  1. Identify non-recurring items and normalization adjustments.
  2. Build EBITDA bridge and supporting table/chart slides.
  3. Call out decision implications and sensitivities.
- Validate:
  - Adjustment logic is explicit and internally consistent.
  - Table totals and bridge components tie out.
  - Risks/unknowns are clearly separated from facts.

## Scenario 4 - IC-style extensive deck (Large: 30-40 slides)

- Objective: Build an extensive investment-committee style deck.
- Inputs:
  - `testing/data/data_rooms/scenario04-retail-large-realistic/`
  - Benchmark overlay: `testing/data/sec/SBUX/annual_metrics.csv`
- Typical workflow:
  1. Build 30-40 slide structure with section dividers and appendix.
  2. Blend target diligence story with external benchmark context.
  3. Ensure density is high but readable (intentional split slides where needed).
- Validate:
  - Slide count and density match extensive mode intent.
  - Minimal overflow/orphan behavior after QA loop.
  - Executive scan test passes on titles + straplines.

## Scenario 5 - Revision and QA regression (Targeted edits: 3-6 slides changed)

- Objective: Simulate partner feedback on an existing deck and validate no regressions.
- Inputs:
  - Any generated deckSpec/PPTX from Scenarios 2-4
  - QA report from prior run
- Typical workflow:
  1. Apply targeted deckSpec edits (content tighten, layout swap, source fixes).
  2. Regenerate and re-run QA.
  3. Verify unchanged sections did not regress.
- Validate:
  - Revision diff is explicit by slide.
  - QA delta improves or remains stable.
  - No new blocking issues introduced outside edited scope.

## Pass/Fail Checklist (Use for every scenario)

- [ ] Deck objective and audience are explicit.
- [ ] Slide types match evidence shape (narrative vs chart vs table).
- [ ] Required slots are populated; no unsupported slots used.
- [ ] Numeric claims are sourced and consistent across slides.
- [ ] QA status is `pass` or `pass_with_warnings` (with residual risks documented).
- [ ] Visual QA finds no unresolved overlap/cutoff issues.
