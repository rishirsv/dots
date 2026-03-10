# Phase 3 Onboarding Evidence Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Better source evidence
Each onboarding draft captures a fuller record of what is on the source slide so later classification work has enough evidence to reason about complex layouts.

### Phase 2: Better visual comparison evidence
The compare pipeline produces richer metrics and a clearer scorecard that separates deterministic system status from manual review decisions.

### Phase 3: No runtime generation changes
This phase stays evidence-only and does not change promotion or runtime registry generation behavior.

## Implementation Checklist

- [x] 1.0 Upgrade onboarding extraction evidence
  - [x] 1.1 Emit `intake.json`
  - [x] 1.2 Emit `extract.raw.json`
  - [x] 1.3 Emit `extract.normalized.json`
  - [x] 1.4 Emit `fingerprint.json`
  - [x] 1.5 Preserve current workspace compatibility

- [x] 2.0 Expand extracted slide evidence
  - [x] 2.1 Include slide size, element kind, bbox, z-order
  - [x] 2.2 Include group nesting or membership when available
  - [x] 2.3 Include text preview and text style hints
  - [x] 2.4 Include fill/line hints and chart/image relationship stubs

- [x] 3.0 Redesign compare evidence
  - [x] 3.1 Emit `candidate.png`, `diff.png`, `diff.json`, and `scorecard.json`
  - [x] 3.2 Add `deterministicStatus`, `manualDisposition`, `approvedExceptions`, and `metrics`
  - [x] 3.3 Add SSIM and pHash alongside current pixel delta metrics

- [x] 4.0 Update tests and docs
  - [x] 4.1 Refresh onboarding smoke expectations
  - [x] 4.2 Refresh onboarding docs and scorecard schema
  - [x] 4.3 Validation for 4.0 (evidence lane passes without runtime code generation)

## Validation Notes

- `python3 -m py_compile scripts/onboarding/extract_slide_seed.py scripts/onboarding/compare_images.py` passed.
- `npm run -s test:onboarding` passed.
