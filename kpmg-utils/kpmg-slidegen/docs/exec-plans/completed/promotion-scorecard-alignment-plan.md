# Promotion Scorecard Alignment Plan

## Phase Outcomes

### Phase 1: Pick one honest compare contract
Make promotion depend on the same compare semantics the scorecard advertises so operators do not see review fields that have no effect.

### Phase 2: Implement explicit promotion review behavior
Allow deterministic passes, allow explicit manual approval with recorded exceptions for deterministic failures, and block rejected or unresolved cases clearly.

### Phase 3: Align docs and regression coverage
Update the onboarding guidance and tests so the compare scorecard contract is clear and enforced in CI.

## Implementation Checklist

- [x] 1.0 Review the compare scorecard schema, compare output generation, and promotion gate
  - [x] 1.1 Confirm how deterministic and manual fields are emitted today
  - [x] 1.2 Choose the promotion contract to implement
- [x] 2.0 Implement explicit promotion scorecard semantics
  - [x] 2.1 Add promotion-time scorecard resolution for deterministic pass, manual accept-with-exceptions, and reject/follow-up
  - [x] 2.2 Update the promotion CLI to accept manual disposition and approved exceptions
  - [x] 2.3 Keep compare output generation consistent with the chosen contract
- [x] 3.0 Align docs and tests
  - [x] 3.1 Update scorecard schema semantics and onboarding docs
  - [x] 3.2 Add regression coverage for pass, manual override, missing exceptions, and reject
  - [x] 3.3 Run validation and record results

## Progress Notes

- Chose the explicit manual-approval model: deterministic failures may promote only when they are manually accepted with recorded exceptions.
- Promotion now resolves scorecard semantics directly instead of trusting a stale `pass` flag by itself.
- The promotion CLI now accepts `--manual-disposition` and repeated `--approved-exception` flags for explicit overrides.
- Updated onboarding tests to cover deterministic pass, deterministic fail, accepted override with exceptions, missing exceptions, and explicit reject.
- Validation run: `npm run -s test:onboarding` and `npm run -s docs:verify`.
