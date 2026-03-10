# Phase 6 Anti-Drift Docs And CI Plan

## Phase Outcomes (Non-Technical)

### Phase 1: One authoritative authoring story
We replace scattered onboarding guidance with clear source-of-truth docs for layout authoring and the onboarding lifecycle.

### Phase 2: Drift prevention in local workflows
We add doc verification and source-fragment checks so outdated commands, missing paths, and primitive/layout drift fail fast before review.

### Phase 3: Drift prevention in CI and skill distribution
CI now regenerates runtime outputs, fails on dirty generated files, runs changed-layout and primitive checks, and enforces the skill bundle boundary.

## Implementation Checklist

- [x] 1.0 Create authoritative docs
  - [x] 1.1 Add `docs/architecture/layout-authoring.md`
  - [x] 1.2 Add `docs/onboarding/onboard-layout.md`
  - [x] 1.3 Make docs authoritative for primitives, layout instances, onboarding lifecycle, generated files, skill boundary, and promotion gates

- [x] 2.0 Add anti-drift verification
  - [x] 2.1 Add `docs:verify`
  - [x] 2.2 Add `test:changed-layouts`
  - [x] 2.3 Add `test:primitive-stress`

- [x] 3.0 Tighten CI and skill boundary checks
  - [x] 3.1 Update PR CI to run `onboard:regen`
  - [x] 3.2 Fail CI on dirty generated outputs
  - [x] 3.3 Run changed-layout and primitive-stress lanes
  - [x] 3.4 Sync and verify the skill bundle when bundle inputs change
  - [x] 3.5 Enforce no onboarding artifacts in the skill bundle verifier

## Validation Notes

- `npm run -s docs:verify` passed.
- `npm run -s test:changed-layouts` passed.
- `npm run -s test:primitive-stress` passed.
- `npm run -s skill:sync` completed.
- `npm run -s skill:verify -- --skip-smoke` passed.
