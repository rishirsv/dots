# Plan: Databook Template V3

## Objective
Produce a truly reusable, deal-agnostic template that looks and feels like North for core tabs, while removing legacy hidden deal content and enforcing deterministic automation controls.

## Non-Technical Phase Outcomes
- Phase 1 strips legacy deal information so teams can safely reuse the workbook on any deal.
- Phase 2 preserves the North presentation style on the tabs people use every day.
- Phase 3 locks monthly behavior to 36 periods where required so outputs are consistent.
- Phase 4 validates the workbook with hard checks so we can trust it before handoff.

## Task List
- [x] 1.0 Rebuild V3 from V2 seed with sanitization
  - [x] 1.1 Keep only core visible tabs + `_Sys|*` tabs
  - [x] 1.2 Remove non-core hidden legacy tabs
  - [x] 1.3 Replace deal-specific banner/source labels with generic placeholders

- [x] 2.0 Enforce deterministic controls and monthly conventions
  - [x] 2.1 Enforce 36-month header formulas on manifest-tagged tabs
  - [x] 2.2 Normalize `_Sys|Config` defaults (`ctl_monthly_period_count=36`, generic project name)
  - [x] 2.3 Preserve tab order and visible/hidden state contract

- [x] 3.0 Clear non-template payloads while preserving layout
  - [x] 3.1 Clear payload values/formulas in governed data regions
  - [x] 3.2 Clear comment/question input columns
  - [x] 3.3 Clear formulas referencing non-core tabs

- [x] 4.0 Validate and report
  - [x] 4.1 Generate sanitization report metrics
  - [x] 4.2 Run validator gates (tab contract, 36-month checks, keyword leak checks, formula dependency checks)
  - [x] 4.3 Confirm pass and publish `databook-template-v3.xlsx`
