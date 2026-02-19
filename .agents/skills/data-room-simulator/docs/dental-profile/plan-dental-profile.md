# Plan: Dental Profile Implementation

## Goal
Add a first-class `dental` industry profile to the simulator, with realistic diligence-oriented outputs aligned to the 123Dentist workflow, and verify it works alongside all existing industries.

## Phase Outcomes (Non-Technical)

- Phase 1 ensures the simulator recognizes dental as a real option everywhere users select industries.
- Phase 2 ensures generated dental files reflect the kinds of reports the deal team actually reviews.
- Phase 3 ensures we can trust the outputs because tie-outs and QA checks pass consistently.

## Task List

- [x] 1.0 Register dental industry end-to-end
- [x] 1.1 Add `profiles/dental.json` with dental financial structure and KPI ranges
- [x] 1.2 Update seed generator industry metadata and mappings for dental
- [x] 1.3 Add dental-specific operation count fields in seed generation
- [x] 2.0 Build dental operations outputs and verification
- [x] 2.1 Add `generate_dental(...)` operations generator
- [x] 2.2 Wire dental dispatch + revenue tie logic in operations main flow
- [x] 2.3 Add dental checks in verification script
- [x] 3.0 Add exact-period financial generation support
- [x] 3.1 Add `--start-period` and `--end-period` options to financial generator
- [x] 3.2 Ensure exact 36-month output is supported for `2023-01` to `2025-12`
- [x] 4.0 QA validation and iteration
- [x] 4.1 Run full realistic-mode matrix for existing industries and dental
- [x] 4.2 Run dental `clean`, `realistic`, and `messy` modes
- [x] 4.3 Capture results and any follow-up tuning adjustments

## Execution Notes

- Initial dental QA exposed an unrealistic hygiene productivity metric (hours too low vs portfolio revenue scale).
- Updated hygiene-hours generation to scale off revenue and configured KPI bounds.
- Re-ran matrix after adjustment; all checks now pass.

## Final QA Snapshot

- `saas` realistic: `pass`, checks `14`, failed `0`
- `construction` realistic: `pass`, checks `11`, failed `0`
- `manufacturing` realistic: `pass`, checks `11`, failed `0`
- `professional_services` realistic: `pass`, checks `11`, failed `0`
- `retail` realistic: `pass`, checks `11`, failed `0`
- `dental` realistic: `pass`, checks `14`, failed `0`
- `dental` clean: `pass`, checks `14`, failed `0`
- `dental` messy: `pass`, checks `14`, failed `0`
