# Onboarded Registry Primitive Reuse Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Preserve the right builder source
The generated onboarded registry keeps the real builder location for each layout so shared primitives can be reused without guessing file names.

### Phase 2: Produce a stable generated module
The generated runtime module imports each builder exactly once when possible, stays valid when names collide, and still supports older per-layout onboarded builders that remain in the repo.

### Phase 3: Prove reuse works
Targeted tests show that shared primitive builders, multi-export builder modules, and legacy onboarded builders all generate a valid runtime registry module.

## Implementation Checklist

- [x] 1.0 Preserve full builder metadata in registry codegen
  - [x] 1.1 Identify where builder module paths are reduced to a basename
  - [x] 1.2 Store `builderModule` and `builderExport` on generated registry entries
  - [x] 1.3 Validation for 1.0 (generated index format reflects full module metadata)

- [x] 2.0 Generate runtime-safe imports
  - [x] 2.1 Resolve import specifiers relative to `generator/runtime/`
  - [x] 2.2 Deduplicate imports by `builderModule` + `builderExport`
  - [x] 2.3 Alias colliding local bindings safely
  - [x] 2.4 Preserve support for legacy onboarded builder modules

- [x] 3.0 Add regression coverage
  - [x] 3.1 Test two layouts reusing one primitive builder/export
  - [x] 3.2 Test one module reused with different exports
  - [x] 3.3 Test legacy onboarded builder modules
  - [x] 3.4 Test generated module syntax validity

- [x] 4.0 Verify and document
  - [x] 4.1 Regenerate runtime aggregates
  - [x] 4.2 Run targeted automated checks
  - [x] 4.3 Add a brief note on relative path resolution rules

## Progress Notes

- 2026-03-10: Started implementation for onboarded registry primitive reuse codegen fix.
- 2026-03-10: Updated runtime aggregate codegen to keep full `builderModule` and `builderExport` metadata, resolve imports relative to `generator/runtime`, and alias colliding local bindings while deduplicating by builder tuple.
- 2026-03-10: Added targeted regression coverage in `scripts/test-codegen-onboarded-registry.mjs` and wired it into the PR lane.
- 2026-03-10: Verification passed with `npm run -s onboard:regen`, `npm run -s test:codegen-onboarded-registry`, `npm run -s test:contracts`, and `npm run -s onboard:verify-generated`.
