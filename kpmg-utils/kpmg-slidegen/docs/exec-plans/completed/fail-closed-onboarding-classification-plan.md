# Fail-Closed Onboarding Classification Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Safe primitive recommendations
Classification only recommends a primitive when the signal is strong enough and unambiguous, so bulk onboarding does not silently drift onto arbitrary primitives.

### Phase 2: Explicit operator control
Scaffolding proceeds automatically only for accepted recommendations; otherwise the operator must make a deliberate primitive choice.

### Phase 3: Visible decision records
The classification artifact clearly records whether manual selection is required and preserves ranked alternatives for review.

## Implementation Checklist

- [x] 1.0 Harden classification outcomes
  - [x] 1.1 Add a minimum acceptance threshold
  - [x] 1.2 Fail closed for zero-score, below-threshold, and ambiguous tie outcomes
  - [x] 1.3 Preserve ranked alternatives in the artifact

- [x] 2.0 Enforce safe scaffold behavior
  - [x] 2.1 Accept automatic scaffold only for a valid recommendation
  - [x] 2.2 Allow explicit `--primitive-ref` operator override
  - [x] 2.3 Keep new primitive scaffolding aligned with the same acceptance rules

- [x] 3.0 Update contracts and docs
  - [x] 3.1 Update the classification artifact contract/schema
  - [x] 3.2 Document when manual primitive selection is required

- [x] 4.0 Add verification
  - [x] 4.1 Clear high-confidence primitive match
  - [x] 4.2 Zero-score case
  - [x] 4.3 Ambiguous tie case
  - [x] 4.4 Explicit operator override

## Progress Notes

- 2026-03-10: Started fail-closed onboarding classification hardening.
- 2026-03-10: Added an acceptance threshold and fail-closed classification decisions that clear `recommendedPrimitiveRef` for zero-score, below-threshold, and ambiguous tie outcomes while preserving ranked alternatives.
- 2026-03-10: Updated scaffold behavior so automatic primitive selection only proceeds from an accepted recommendation; explicit `--primitive-ref` and `--base-primitive-ref` overrides remain supported.
- 2026-03-10: Added `onboarding/cases/classification.schema.json`, updated onboarding docs for manual-selection cases, and wired classification coverage into the repo test lanes.
- 2026-03-10: Verified with `npm run -s test:onboarding-classification`, `npm run -s test:onboarding`, and `npm run -s docs:verify`.
