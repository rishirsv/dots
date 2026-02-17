# Databook Analyst v1 Template Implementation Tracker

## Scope
Implement the approved "Databook Analyst v1 Template Plan (Single Coherent Spec)" as a reproducible `.xlsx` template with deterministic naming/layout rules and direct TB-to-output flow.

## Task List
- [x] 1.0 Build deterministic workbook generator
  - [x] 1.1 Create visible tabs in exact planned order.
  - [x] 1.2 Create hidden `_Sys|*` tabs.
  - [x] 1.3 Enforce naming contract and no-space tab naming.

- [x] 2.0 Apply global layout contract
  - [x] 2.1 Anchor banner/title/units at `A1`, `A2`, `A3`, `A4`, `A7`, `A8`.
  - [x] 2.2 Standardize output headers at `A10` and `Comments` column at `N10`.
  - [x] 2.3 Remove filler column behavior by starting all content in column `A`.

- [x] 3.0 Implement control panel
  - [x] 3.1 Add required `ctl_*` inputs.
  - [x] 3.2 Add standard period controls and data validations.
  - [x] 3.3 Add defined names for all control fields.

- [x] 4.0 Implement simplified TB mapping flow
  - [x] 4.1 Build `_Sys|Trial_Balance` for raw TB paste/import.
  - [x] 4.2 Build `_Sys|Line_Map` for line/sign mapping.
  - [x] 4.3 Add `XLOOKUP` mapping formulas (`map_line`, `map_sign`, `map_statement_type`).

- [x] 5.0 Implement output tab scaffolding
  - [x] 5.1 Add direct `SUMIFS`-based TB linkage formulas.
  - [x] 5.2 Add standardized `Check` rows.
  - [x] 5.3 Add canonical `Comments` columns.

- [x] 6.0 Implement checks and audit tabs
  - [x] 6.1 Create `Checks|Core` with PASS/WARN/FAIL logic.
  - [x] 6.2 Create `Audit|Issues_Index` schema.
  - [x] 6.3 Create `Audit|Run_Log` schema.

- [x] 7.0 Implement write scope and governance metadata
  - [x] 7.1 Build `_Sys|Tab_Manifest` with anchors and writable scopes.
  - [x] 7.2 Apply sheet protection with writable ranges unlocked.

- [x] 8.0 Validate template
  - [x] 8.1 Add automated conformance validator script.
  - [x] 8.2 Run build + validation successfully.

## Implementation Notes
- Excel tab names are capped at 31 characters. `Other_Analysis|Revenue_By_Customer_Group` was implemented as `Other_Analysis|Revenue_By_Cust` to stay compliant.
- The design intentionally excludes broad `Src_*` pipelines and uses a minimal direct TB mapping model.
- Lookup standard enforced: `XLOOKUP` only.
