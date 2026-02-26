# Implementation Plan: Callout Annotations + Dense Visual Regression

## Description

Add optional callout annotations to `oneColumnText`, `analysisWideChart2ColsText`, and `analysisWideChartTableText` using strict, deterministic placement and no freeform layout behavior. Callouts render as bordered annotation boxes with leader lines that point to contextual targets (table/chart/body). Keep regressions low by aligning render and pagination geometry, then add a max-density A/B visual regression harness that compares baseline slides (no callouts) vs callout-enabled slides and requires both automated checks and manual visual signoff.

## Scope

- In:
  - Add `callouts` slot contract + `geometry.calloutBoxes` for the 3 target slide types.
  - Add shared callout helper for normalization, placement, and rendering.
  - Integrate callouts into target builders and geometry helpers.
  - Make pagination callout-aware and ensure callouts appear on first split page only.
  - Add dense fixture decks (baseline vs with-callouts) and visual regression test script.
  - Update skill references schema/docs for callouts.
- Out:
  - Freeform shape DSL or arbitrary positioning controls.
  - Per-callout styling variants in v1.
  - Support for callouts on slide types outside the 3 target layouts.

## Tasks

### Phase 1: Contract and Shared Component

Deliver deterministic callout contract support and a reusable renderer.

- [x] 1.0 Add callout contract entries in layout definitions
  - [x] 1.1 Add optional `callouts` slot (`kind: columns`) for the 3 target types in `templates/kpmg-diligence/package/layouts.json`.
  - [x] 1.2 Add `geometry.calloutBoxes` anchors for the 3 target types.
  - [x] 1.3 Mirror template layout change into `skills/kpmg-slides/assets/slidegen/templates/kpmg-diligence/package/layouts.json`.
- [x] 1.4 Add shared helper `generator/helpers/callouts.js`
  - [x] 1.5 Normalize callout inputs (including optional anchor metadata) and support multiple callouts.
  - [x] 1.6 Implement deterministic adaptive-zone placement with geometry anchors first, fallback zones second.
  - [x] 1.7 Implement annotation visual style (white box + leader lines + anchor markers).
  - [x] 1.8 Validation for 1.4: unit-level behavior validated through builder/pagination integration tests.

### Phase 2: Layout and Builder Integration

Render callouts in slide output and adjust text regions safely.

- [x] 2.0 Make one-column layout callout-aware
  - [x] 2.1 Update `computeOneColumnLayoutGeometry` to accept callouts and return effective body geometry + callout placements.
  - [x] 2.2 Render callouts in `generator/builders/one-column-text.js`.
  - [x] 2.3 Validation for 2.0: no-callout behavior unchanged for existing one-column inputs.
- [x] 2.4 Make analysis-wide layouts callout-aware
  - [x] 2.5 Update `computeAnalysisWideChart2ColsTextGeometry` to accept callouts and shrink commentary region only.
  - [x] 2.6 Update `computeAnalysisWideChartTableTextGeometry` to place callouts in whitespace above commentary when possible and protect chart/table geometry.
  - [x] 2.7 Render callouts in `generator/builders/analysis-wide-chart-text.js`.
  - [x] 2.8 Validation for 2.4: chart/table regions remain stable for `analysisWideChartTableText`.

### Phase 3: Pagination + Continuation Policy

Keep splitting behavior consistent with rendered geometry and policy.

- [x] 3.0 Update `generator/runtime/paginate.js`
  - [x] 3.1 Pass callouts through geometry calculators so pagination uses reduced text capacity.
  - [x] 3.2 Ensure continuation pages (`(cont.)`) omit callouts and only page 1 retains them.
  - [x] 3.3 Validation for 3.0: split behavior remains deterministic and overflow checks pass.

### Phase 4: Dense A/B Visual Regression Harness

Create a high-density stress suite with baseline vs callout comparison artifacts.

- [x] 4.0 Add dense fixture decks in `decks/`
  - [x] 4.1 Add `oneColumnText` baseline dense fixture.
  - [x] 4.2 Add `oneColumnText` with-callouts dense fixture.
  - [x] 4.3 Add `analysisWideChart2ColsText` baseline dense fixture.
  - [x] 4.4 Add `analysisWideChart2ColsText` with-callouts dense fixture.
  - [x] 4.5 Add `analysisWideChartTableText` baseline dense fixture.
  - [x] 4.6 Add `analysisWideChartTableText` with-callouts dense fixture.
- [x] 4.7 Add script `scripts/test-callouts-dense-visual-regressions.mjs`
  - [x] 4.8 Generate paired outputs (`baseline` and `with-callouts`) with previews and visual overflow checks.
  - [x] 4.9 Assert automated checks: generation succeeds, `qa.valid` true, preview `ok`, overflow visual `pass`, no severe overlaps.
  - [x] 4.10 Emit artifact paths and manual review checklist in script output.
  - [x] 4.11 Wire npm script alias `test:visual:callouts-dense`.
  - [x] 4.12 Validation for 4.7: script runs successfully where slides runtime is available.

### Phase 5: Skill Reference Schema/Docs + Full Validation

Keep authoring contract synchronized and verify end-to-end behavior.

- [x] 5.0 Update `skills/kpmg-slides/references/deckspec.schema.json`
  - [x] 5.1 Add `callouts` property to the 3 target slide schema defs.
- [x] 5.2 Update `skills/kpmg-slides/references/slide-contract.md`
  - [x] 5.3 Document callout annotation shape, anchor options, and multi-callout behavior.
- [x] 5.4 Run validation commands
  - [x] 5.5 `npm run test:contracts`
  - [x] 5.6 `npm run smoke`
  - [x] 5.7 `npm run test:validation:failure`
  - [x] 5.8 `npm run test:qa:golden` (confirm or intentionally update fixture)
  - [x] 5.9 `npm run test:visual:callouts-dense` (if runtime available)
  - [x] 5.10 Validation for 5.4: summarize pass/fail and any environment limits.

## Context

**Key files:**

- `templates/kpmg-diligence/package/layouts.json`: slide slot contract and geometry anchors.
- `generator/helpers/one-column-layout.js`: one-column geometry + footer-safe body sizing.
- `generator/helpers/analysis-wide-layout.js`: analysis-wide geometry and chart/table/text region management.
- `generator/runtime/paginate.js`: split heuristics and continuation slide shaping.
- `generator/builders/one-column-text.js` + `generator/builders/analysis-wide-chart-text.js`: concrete render paths for target layouts.

## Open Questions

- None.

## Assumptions

- Existing `kind: columns` validator behavior remains acceptable for callouts and does not require validator refactor.
- Skill bundle sync tooling references docs files that may be absent in this branch; implementation will update source + skill reference files directly and avoid treating `skill:sync` as a blocker.


## Validation Notes

- `npm run smoke` passed.
- `npm run test:visual:callouts-dense -- --out-dir outputs/debug-callouts-dense` passed (automated checks).
- `npm run test:visual:callouts-dense -- --out-dir /Users/rishi/Desktop/callouts-dense-visual-review-2026-02-26` passed (automated checks and desktop artifacts regenerated for manual review).
- `npm run test:contracts`, `npm run test:validation:failure`, and `npm run test:qa:golden` are currently blocked in this branch by missing pre-existing files (`docs/DECKSPEC-SLOTS-SCHEMA.json`, `decks/validation-failing-example.deckSpec.json`, `decks/qa-golden-all-layouts.deckSpec.json`).
