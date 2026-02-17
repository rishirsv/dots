# Plan: Databook Template v1

## Objective
Build a deterministic `.xlsx` template that follows North-style presentation, simplifies the data flow to direct TB-to-output translation, and hardens quality with explicit checks and audit tabs.

## Non-Technical Phase Outcomes
- Phase 1 ensures every tab has a consistent, predictable name and location so the AI always writes to the right place.
- Phase 2 standardizes where key information appears (title, source, units, comments) so outputs look and behave the same.
- Phase 3 introduces a strict setup panel so period and tolerance choices are explicit and validated.
- Phase 4 provides one clean TB input + mapping model to reduce complexity and avoid fragile pipelines.
- Phase 5 adds direct formulas for core analyses so tie-outs are transparent and easy to review.
- Phase 6 adds check and audit tabs to make issues visible and workflow auditable.
- Phase 7 applies protection rules so formulas and headers are not accidentally overwritten.

## Task List
- [x] 1.0 Build workbook skeleton and naming contract
  - [x] 1.1 Create visible tabs in approved order
  - [x] 1.2 Create hidden `_Sys|*` tabs
  - [x] 1.3 Enforce no-space tab naming with `_` and `|`
- [x] 2.0 Apply global layout anchors
  - [x] 2.1 `A1:A4` banner
  - [x] 2.2 `A7` title and `A8` units
  - [x] 2.3 `A10` headers and canonical `Comments` column
- [x] 3.0 Implement control panel
  - [x] 3.1 Required `ctl_*` values and named ranges
  - [x] 3.2 Standard period controls + validations
- [x] 4.0 Implement simplified TB mapping flow
  - [x] 4.1 `_Sys|Trial_Balance`
  - [x] 4.2 `_Sys|Line_Map`
  - [x] 4.3 `XLOOKUP` mapping helpers
- [x] 5.0 Implement output scaffolds
  - [x] 5.1 Direct `SUMIFS` formulas from TB
  - [x] 5.2 Standard check row
  - [x] 5.3 Standard comments column
- [x] 6.0 Implement checks and audit tabs
  - [x] 6.1 `Checks|Core` with PASS/WARN/FAIL
  - [x] 6.2 `Audit|Issues_Index`
  - [x] 6.3 `Audit|Run_Log`
- [x] 7.0 Protection and validation
  - [x] 7.1 Write-scope metadata via `_Sys|Tab_Manifest`
  - [x] 7.2 Protected non-write zones + unlocked data-entry ranges
  - [x] 7.3 Automated validator passes

## Notes
- Excel tab names are limited to 31 characters; `Other_Analysis|Revenue_By_Customer_Group` is implemented as `Other_Analysis|Revenue_By_Cust`.
