# Stable Builder `ctx` Contract Refactor (Render Path, Minimal/Strict)

## Phase Outcomes (Non-Technical)

### Phase 1: Build once, resolve once
Every slide gets runtime data from one central contract builder instead of ad hoc dispatch branches.

### Phase 2: Uniform dispatch
All slide builders are invoked with the same signature and stable `ctx` structure.

### Phase 3: Keep behavior, reduce sprawl
Existing output behavior remains, while runtime/user field boundaries become explicit and safer.

### Phase 4: Fast contract checks
Tests validate invocation contracts and strict collisions directly so regressions are easier to localize.

## Implementation Checklist

- [x] 1.0 Extend `generator/runtime/render-context.js`
  - [x] 1.1 Change `buildRenderContext` input to `{ templatePackage, deckSpec, options }`
  - [x] 1.2 Add stable `options` + `diagnostics` in returned context
  - [x] 1.3 Add central builder-ctx resolver (`buildBuilderCtx`) and contract resolver (`contracts.resolveForSlide`)
  - [x] 1.4 Validation for 1.0 (context tests and call-site updates)

- [x] 2.0 Refactor `generator/runtime/render-deck.js` dispatch
  - [x] 2.1 Remove per-builder ad hoc branches for cover/divider/backCover
  - [x] 2.2 Use single invocation `builder(pptx, slideSpec, ctx)` for all types
  - [x] 2.3 Add strict runtime/user reserved-key collision checks
  - [x] 2.4 Validation for 2.0 (render regression tests)

- [x] 3.0 Normalize affected builders to stable `ctx`
  - [x] 3.1 Update divider light styling without dispatch-time `textStyles` injection
  - [x] 3.2 Update back-cover to read runtime globals via stable `ctx.options`
  - [x] 3.3 Validation for 3.0 (back-cover/divider regression checks)

- [x] 4.0 Update tests and run QA gates
  - [x] 4.1 Add/extend tests for builder ctx contract shape and strict collisions
  - [x] 4.2 Update all `buildRenderContext` call sites
  - [x] 4.3 Run contracts/render/QA tests and skill sync/verify
