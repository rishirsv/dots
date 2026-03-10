# Phase 4 Authoring Codegen Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Manual source of truth
We move layout authoring to small source fragments under `templates-src/` so contributors stop editing large runtime aggregate files directly.

### Phase 2: Safe generated runtime aggregates
We generate the current runtime-facing files from those fragments without changing how the generator loads templates or registry entries today.

### Phase 3: Drift detection
We add a verification mode so stale generated outputs fail fast in local workflows and CI.

## Implementation Checklist

- [x] 1.0 Add source-fragment bootstrap
  - [x] 1.1 Seed `templates-src/kpmg-diligence/layouts/*.json`
  - [x] 1.2 Seed `templates-src/kpmg-diligence/primitives/*.json`
  - [x] 1.3 Keep seeded fragments aligned with current runtime behavior

- [x] 2.0 Add codegen pipeline
  - [x] 2.1 Read layout and primitive fragments from `templates-src/`
  - [x] 2.2 Generate `templates/kpmg-diligence/package/layouts.json`
  - [x] 2.3 Generate `generator/runtime/onboarded-registry.generated.js`
  - [x] 2.4 Generate verification-friendly registry index metadata

- [x] 3.0 Add stale-check mode
  - [x] 3.1 Add `onboard:regen`
  - [x] 3.2 Add a `--check` verification mode
  - [x] 3.3 Validation for 3.0 (regen and check both pass)

## Validation Notes

- `node scripts/codegen/bootstrap-authoring-from-runtime.mjs` seeded 14 layout fragments and 14 primitive fragments.
- `npm run -s onboard:regen` passed.
- `npm run -s onboard:verify-generated` passed.
- `npm run -s test:contracts` passed.
