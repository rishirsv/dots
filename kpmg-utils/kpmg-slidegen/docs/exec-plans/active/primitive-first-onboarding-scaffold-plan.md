# Primitive-First Onboarding Scaffold Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Clear operator choices
The scaffold step asks operators to choose between reusing an existing primitive, extending an existing primitive, or creating a new primitive instead of thinking in terms of layout families.

### Phase 2: Primitive-first scaffolding
Existing-primitive scaffolds create only the draft layout and deckspec, while new-primitive scaffolds create the extra primitive and builder artifacts only when they are actually needed.

### Phase 3: Legacy isolation
Any remaining family-era helpers stay available only for legacy migration paths and are removed from the happy-path onboarding flow and main docs.

## Implementation Checklist

- [x] 1.0 Replace family-era scaffold flags
  - [x] 1.1 Remove `builder-from-family` from the primary scaffold CLI
  - [x] 1.2 Add `base-primitive-ref` for new primitive scaffolding
  - [x] 1.3 Update end-to-end wrapper flag passthrough

- [x] 2.0 Make scaffold behavior primitive-first
  - [x] 2.1 Existing primitive reuse writes only candidate layout and deckspec
  - [x] 2.2 New primitive creation writes primitive + builder artifacts
  - [x] 2.3 New primitive scaffolding can copy builder/metadata from a base primitive ref
  - [x] 2.4 Starter deck content comes from primitive metadata instead of family policies

- [x] 3.0 Isolate or remove legacy family dependencies
  - [x] 3.1 Remove family policy dependence from the case-based happy path
  - [x] 3.2 Mark any remaining family helpers as legacy-only
  - [x] 3.3 Keep draft overlay rendering usable

- [x] 4.0 Update docs and verification
  - [x] 4.1 Rewrite onboarding docs in primitive-first language
  - [x] 4.2 Update onboarding smoke or regression coverage for the new scaffold flags
  - [x] 4.3 Run targeted onboarding verification

## Progress Notes

- 2026-03-10: Started primitive-first onboarding scaffold refactor.
- 2026-03-10: Replaced the case-based scaffold happy path with primitive-first flags: `--primitive-ref` for reuse and `--base-primitive-ref` for new primitive scaffolding.
- 2026-03-10: Updated case scaffolding so existing primitive reuse only writes layout + deckspec, while new primitive scaffolds write primitive + builder artifacts seeded from a base primitive builder.
- 2026-03-10: Moved starter deck seeding to primitive metadata (`scaffoldFixture`, `slotSchemaRef`, `id`) and removed family-policy dependence from the case-based flow.
- 2026-03-10: Renamed family-era helpers in `scripts/onboarding/lib.mjs` as legacy-only for the older workspace flow.
- 2026-03-10: Rewrote onboarding docs to describe the operator choices as existing primitive, extend existing primitive, or new primitive.
- 2026-03-10: Verification passed with `npm run -s docs:verify` and `npm run -s test:onboarding`.
