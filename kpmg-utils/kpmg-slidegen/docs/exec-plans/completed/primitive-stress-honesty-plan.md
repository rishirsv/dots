# Primitive Stress Honesty Plan

## Phase Outcomes

### Phase 1: Clarify what the lane currently proves
Make it obvious which checks are contract and registry integrity checks versus actual rendered stress coverage.

### Phase 2: Add real primitive render stress coverage
Exercise the highest-risk primitives with realistic dense content so the lane catches rendering regressions instead of only metadata drift.

### Phase 3: Make the lane easy to trust in CI
Report structural and render-stress results separately, wire the new fixture into the harness, and verify the lane passes end to end.

## Implementation Checklist

- [x] 1.0 Review the current primitive stress lane and harness patterns
  - [x] 1.1 Confirm which assertions are structural-only today
  - [x] 1.2 Identify the smallest useful render-stress fixture surface
- [x] 2.0 Add real primitive stress fixtures
  - [x] 2.1 Author a curated stress fixture deck for high-priority primitives
  - [x] 2.2 Register the fixture in the harness manifest
  - [x] 2.3 Cover long text, dense body content, repeated rows/cards, and missing optional content
- [x] 3.0 Upgrade the primitive stress lane
  - [x] 3.1 Preserve structural validation and label it clearly in output
  - [x] 3.2 Add render-stress validation with explicit QA assertions
  - [x] 3.3 Validate the updated lane and record results

## Progress Notes

- Plan created for honest primitive stress coverage.
- Confirmed the old lane only checked primitive/layout wiring and geometry completeness; it did not render stress fixtures.
- Added a curated `stress-primitive-render-matrix` fixture that covers 10 high-priority primitives with near-limit titles, dense text, repeated rows/cards, and intentional omission of optional content.
- Updated `scripts/test-primitive-stress.mjs` to print separate structural and render-stress summaries and to assert QA checks for the render pass.
- Validation run: `npm run -s test:primitive-stress` and `node scripts/test-fixtures.mjs`.
