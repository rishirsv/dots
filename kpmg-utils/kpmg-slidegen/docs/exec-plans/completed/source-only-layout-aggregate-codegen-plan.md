# Source-Only Layout Aggregate Codegen Plan

## Phase Outcomes (Non-Technical)

### Phase 1: One-way generation
Runtime layout package generation will depend only on authored source files, so generated files stop feeding back into authoring decisions.

### Phase 2: Explicit package metadata ownership
Package-level layout metadata will live in a dedicated authored file instead of being implicitly preserved from a previously generated output.

### Phase 3: Enforceable reproducibility
Verification will prove the layout aggregate can be rebuilt from source fragments alone, even if a generated output is corrupted.

## Implementation Checklist

- [x] 1.0 Move package metadata into authored sources
  - [x] 1.1 Add an authored layout package metadata file under `templates-src/kpmg-diligence/`
  - [x] 1.2 Move preserved package-level metadata out of generated `layouts.json`

- [x] 2.0 Remove generated-file input dependence
  - [x] 2.1 Update runtime aggregate codegen to read authored metadata instead of generated `layouts.json`
  - [x] 2.2 Ensure no generated runtime file is used as an upstream codegen input

- [x] 3.0 Add reproducibility verification
  - [x] 3.1 Add a regression that proves regeneration succeeds from authored sources after corrupting a generated layout package file
  - [x] 3.2 Wire the verification into repo test lanes and record outcomes

## Progress Notes

- 2026-03-10: Started removing generated-file input dependence from runtime aggregate codegen.
- 2026-03-10: Added `templates-src/kpmg-diligence/layout-package.meta.json` as the authored source for package-level layout metadata previously preserved from generated `templates/kpmg-diligence/package/layouts.json`.
- 2026-03-10: Updated runtime aggregate codegen to build `layouts.json` from source layout fragments plus authored package metadata only, with no generated file reads in the aggregate build path.
- 2026-03-10: Added a reproducibility regression that corrupts the generated layout package, reruns codegen, and proves canonical outputs are rebuilt from source fragments alone.
- 2026-03-10: Wired the reproducibility test into the PR/nightly lanes and verified with `npm run -s onboard:regen`, `npm run -s test:codegen-source-reproducibility`, `npm run -s test:contracts`, `npm run -s onboard:verify-generated`, and `npm run -s docs:verify`.
