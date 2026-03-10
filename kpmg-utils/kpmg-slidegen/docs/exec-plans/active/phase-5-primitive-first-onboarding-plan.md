# Phase 5 Primitive-First Onboarding Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Case-based onboarding
Onboarding moves from ad hoc layout draft folders to a consistent case lifecycle under `onboarding/cases/<case-id>/`.

### Phase 2: Primitive-first scaffolding
Scaffolding now starts from a selected primitive instead of a base family, which removes the need to create draft builder files for every new layout.

### Phase 3: Source-first promotion
Promotion writes source fragments into `templates-src/`, then regenerates the runtime aggregates instead of editing runtime package files directly.

## Implementation Checklist

- [x] 1.0 Add case-based onboarding commands
  - [x] 1.1 Add `onboard:extract`
  - [x] 1.2 Add `onboard:classify`
  - [x] 1.3 Add `onboard:scaffold`
  - [x] 1.4 Preserve `onboard:render`, `onboard:compare`, `onboard:promote`, `onboard:regen`
  - [x] 1.5 Add `onboard:test-changed`

- [x] 2.0 Move onboarding flow to `onboarding/cases/<case-id>/`
  - [x] 2.1 Add case path helpers
  - [x] 2.2 Store intake/classification/scaffold state in case files
  - [x] 2.3 Update onboarding smoke coverage

- [x] 3.0 Switch scaffold and promotion behavior
  - [x] 3.1 Existing primitive flow writes only layout + deckspec
  - [x] 3.2 New primitive flow writes optional primitive + builder artifacts
  - [x] 3.3 Promotion writes `templates-src/` fragments and runs codegen

## Validation Notes

- `npm run -s test:onboarding` passed.
- `npm run -s onboard:verify-generated` passed.
- `npm run -s test:contracts` passed.
- `node scripts/onboarding/test-changed.mjs` passed.
