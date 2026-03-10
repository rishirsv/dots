# Phase 2 Primitive-Scoped Geometry Validation Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Flexible geometry validation
We move geometry validation from one global list of allowed keys to per-slide contracts so new semantic layout structures can be added without rewriting the core runtime each time.

### Phase 2: Safe legacy migration
We keep existing built-in layouts working by deriving their geometry kinds automatically from the current registry contract.

### Phase 3: Registry-ready scale path
We let registry entries carry direct geometry kinds or primitive metadata that resolves to geometry kinds, which prepares later code generation work without changing rendering behavior now.

## Implementation Checklist

- [x] 1.0 Refactor runtime geometry contract
  - [x] 1.1 Replace global key whitelist validation with geometry-kind-driven validation
  - [x] 1.2 Support `box`, `boxArray`, `boxTree`, `number`, `string`, and `object`
  - [x] 1.3 Validation for 1.0 (legacy behavior still validates current template geometry in the contract lane)

- [x] 2.0 Add legacy migration behavior
  - [x] 2.1 Derive default geometry kinds for built-in legacy registry entries
  - [x] 2.2 Preserve required geometry checks for existing layouts
  - [x] 2.3 Validation for 2.0 (built-in registry entries expose derived kinds)

- [x] 3.0 Update registry normalization path
  - [x] 3.1 Allow registry entries to provide `geometryKinds`
  - [x] 3.2 Allow primitive metadata to resolve `geometryKinds`
  - [x] 3.3 Keep onboarding registry cloning compatible

- [x] 4.0 Add regression tests
  - [x] 4.1 Legacy built-in layout validation
  - [x] 4.2 Semantic `boxTree` structure validation
  - [x] 4.3 Unknown key rejection
  - [x] 4.4 Malformed `boxTree` rejection
  - [x] 4.5 Validation for 4.0 (contract lane passes)

## Validation Notes

- `npm run -s test:contracts` passed.
- `npm run -s test:render` is blocked in this workspace because `pptxgenjs` is not installed locally, so full render regression could not be run here.
