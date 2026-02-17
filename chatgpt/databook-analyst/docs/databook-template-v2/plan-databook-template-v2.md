# Plan: North-Based Template V2

## Objective
Build a North-familiar core-scope template that preserves team-used styling and structure while adding deterministic hidden system scaffolding and 36-month manifest enforcement for monthly tabs.

## Non-Technical Phase Outcomes
- Phase 1 locks Project North as the visual source of truth.
- Phase 2 keeps only core sections visible so the workbook feels familiar but focused.
- Phase 3 adds deterministic hidden tabs to support reliable automation without changing visible workflow.
- Phase 4 enforces a hard 36-month monthly standard on designated tabs.
- Phase 5 adds checks and audit surfaces to make runs traceable.
- Phase 6 validates visual and functional fidelity before adoption.

## Task List
- [x] 1.0 Seed and structure
  - [x] 1.1 Pin North seed workbook in `template-v2/seeds/`.
  - [x] 1.2 Define core visible tab scope.
  - [x] 1.3 Keep non-core tabs hidden to preserve legacy references.

- [x] 2.0 Styling/token contracts
  - [x] 2.1 Generate `north_style_contract.json`.
  - [x] 2.2 Generate `north_anchor_contract.json`.

- [x] 3.0 Deterministic system layer
  - [x] 3.1 Add `_Sys|Trial_Balance`.
  - [x] 3.2 Add `_Sys|Line_Map`.
  - [x] 3.3 Add `_Sys|Tab_Manifest`.
  - [x] 3.4 Add `_Sys|Config` with locked monthly control.

- [x] 4.0 Monthly 36-period enforcement
  - [x] 4.1 Manifest-tag monthly tabs with row/start metadata.
  - [x] 4.2 Force 36 contiguous month headers from `ctl_month_start`.
  - [x] 4.3 Clear trailing headers beyond 36.

- [x] 5.0 Checks and audit tabs
  - [x] 5.1 Add `Checks>>` and `Checks | Core`.
  - [x] 5.2 Add `Audit>>`, `Audit | Issues_Index`, and `Audit | Run_Log`.
  - [x] 5.3 Add PASS/WARN/FAIL check logic for control, mapping, and monthly enforcement.

- [x] 6.0 Tooling and validation
  - [x] 6.1 Build script: `build_databook_template_v2.py`.
  - [x] 6.2 Validator: `validate_databook_template_v2.py`.
  - [x] 6.3 Generate fidelity report: `reports/north-fidelity-diff.md`.

## Notes
- V2 keeps North tab naming (including spaces/pipes) to maximize adoption.
- 36-month rule is applied only to manifest-tagged monthly tabs.
