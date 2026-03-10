# Promotion Hardening And Onboarding Smoke Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Promotion only from a finished case
Promotion will only run after onboarding has completed the full compare stage and all required candidate and compare artifacts are present.

### Phase 2: Real integration smoke coverage
The onboarding smoke test will exercise the actual extract, classify, scaffold, render, and compare commands instead of shortcutting the visual compare step.

### Phase 3: Clear operator guidance
The onboarding docs will explain the stricter promotion prerequisites so operators can see why promotion is blocked and what to run next.

## Implementation Checklist

- [x] 1.0 Harden promotion readiness
  - [x] 1.1 Require compared status before promotion
  - [x] 1.2 Require candidate layout, preview, QA, diff, and scorecard artifacts with precise errors
  - [x] 1.3 Run generated-output verification during promotion

- [x] 2.0 Restore real onboarding smoke coverage
  - [x] 2.1 Run extract, classify, scaffold, render, and compare in `test:onboarding`
  - [x] 2.2 Remove compare shortcuts that copy the reference image
  - [x] 2.3 Assert candidate render, compare outputs, scorecard shape, and promotion readiness

- [x] 3.0 Update docs and verification records
  - [x] 3.1 Document the stricter promotion gates
  - [x] 3.2 Record the verification commands and outcomes

## Progress Notes

- 2026-03-10: Started promotion hardening and onboarding smoke restoration.
- 2026-03-10: Added a shared promotion-readiness check that requires `compared` status, required render/compare artifacts, zero blocking QA, and a passing compare scorecard before promotion can write source files.
- 2026-03-10: Promotion now reruns generated aggregate verification with `generate-runtime-aggregates.mjs --check` after regeneration.
- 2026-03-10: Replaced the onboarding smoke shortcut with a real extract/classify/scaffold/render/compare flow using a one-slide generated `businessOverview` source deck so the case remains cheap and deterministically promotable.
- 2026-03-10: Verified with `npm run -s test:onboarding` and `npm run -s docs:verify`.
