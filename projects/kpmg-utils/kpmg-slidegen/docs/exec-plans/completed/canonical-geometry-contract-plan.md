# Canonical Geometry Contract Plan

## Goal

Make geometry a strict startup contract so template drift fails fast and builders never rely on hidden geometry fallbacks.

## Phase Outcomes

### Phase 1: Contract foundation
- We create a single geometry validation contract for canonical keys and bounds.
- Rendering now fails early with explicit geometry errors instead of silently adapting.

### Phase 2: Runtime integration
- Render context uses a dedicated template contracts builder.
- Geometry for every slide type is normalized/validated once at startup and reused.

### Phase 3: Builder hardening
- Builders consume only canonical geometry keys.
- Required geometry no longer has builder-local default fallbacks.

### Phase 4: Regression safety
- Tests enforce canonical key coverage and fail-fast behavior.
- Visual + QA checks verify no behavior regressions.

## Implementation Checklist

- [x] 1.0 Add strict geometry contract runtime modules
  - [x] 1.1 Add `generator/runtime/geometry-contract.js`
  - [x] 1.2 Add `generator/runtime/template-contracts.js`
  - [x] 1.3 Validate required keys, bounds, and footer-safe zones at startup

- [x] 2.0 Update registry and render context integration
  - [x] 2.1 Add canonical geometry contract metadata to `slide-registry.js`
  - [x] 2.2 Switch `render-context.js` from `layout-contract` to `template-contracts`
  - [x] 2.3 Keep pagination compatibility with contract geometry accessors

- [x] 3.0 Migrate template geometry keys to canonical names
  - [x] 3.1 Rewrite `templates/kpmg-diligence/package/layouts.json` geometry keys
  - [x] 3.2 Remove legacy key acceptance path

- [x] 4.0 Remove builder/pagination geometry fallback behavior
  - [x] 4.1 Update builders to canonical geometry keys only
  - [x] 4.2 Remove required-geometry local fallback boxes
  - [x] 4.3 Update pagination helpers to canonical key access only

- [x] 5.0 Update tests and verify
  - [x] 5.1 Update contract/regression tests for canonical keys
  - [x] 5.2 Run QA + visual regression suites
  - [x] 5.3 Move plan file to completed folder

## Notes / Assumptions

- Pre-release policy applies: no backward-compatibility geometry alias layer.
- Optional geometry behavior is centralized in runtime contracts/registry, not builders.
- Builder signature remains `builder(pptx, slideSpec, ctx)`.
