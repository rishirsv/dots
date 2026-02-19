---
name: databook-analyst
description: Build, update, and review financial due diligence databooks by applying template conventions, analysis workflows, and workbook quality controls.
---

# Databook Analyst Skill

## Overview

Databook Analyst turns diligence requests into workbook outputs with a strict two-mode contract:

1. Plan Mode first
2. Execute Mode only after explicit user gate (`Proceed`)

Always use this skill together with the Spreadsheets skill. If defaults conflict, this skill takes precedence.

For `Process-TB`, `Control | Setup` is mandatory in every deliverable because it is the control surface for period dates, fiscal labels, and units/scale settings.

## Quick Start

1. Classify the request as one of: `Process-TB`, `Process-lease`, template update, or QC refresh.
2. Return Plan Mode output using the required shape below.
3. Wait for explicit gate (`Proceed`).
4. Execute by routing to the correct playbook, then run internal Python runners for mechanics.
5. For `Process-TB` with no mapping file: generate mapping in-model in the same run, then continue.
6. Validate all Definition-of-Done checks before returning workbook output.

## Plan Mode Output Shape (Required)

Return a Markdown plan with these sections, in order:

1. `Task Classification`
2. `Execution Path` (Edit Existing vs Start From Template)
3. `Inputs Required` (provided / missing)
4. `Workbook Scope` (minimum required sheets only)
5. `Source-to-Target Mapping`
6. `Calculations and Tie-Outs`
7. `Formatting + Sign Plan`
8. `Risks and Assumptions`
9. `Execution Checklist`
10. `Proceed Gate` (single-line request for explicit `Proceed`)

Plan Mode must not generate/edit workbook artifacts.

## Execute Mode Gate (Strict)

Execute only when user explicitly confirms `Proceed`.

When gate is met:

- If workbook is provided: edit in place only planned tabs/blocks.
- If no workbook is provided: start from `assets/databook-template-v2.xlsx`.
- Apply scope pruning:
  - If request is financial statements only, output only required FS sheets.
  - Remove non-required sheets before return.

## Module Routing

- `Process-TB`
  - Playbook: `references/module-playbooks/Process-TB.md`
  - Internal runners: `scripts/ProcessTB.py` + supporting scripts
  - Primary outputs: `Data | TB`, `Map | COA to Lines`, `Combined | IS`, `Combined | BS`
  - Supports both mapping modes:
    - mapping provided
    - no mapping provided (model generates mapping in-run)

- `Process-lease`
  - Playbook: `references/module-playbooks/Process-lease.md`
  - Internal runner: `scripts/ProcessLease.py`
  - Outputs: `Data | Leases Extract`, `Leases`, inline exceptions

Formatting rules are inherited from `references/formatting-guidelines.md`.

## Definition of Done (Must Pass Before Return)

1. Scope control

- Output workbook includes minimum required sheets for user ask.
- Non-required sheets are removed for scope-pruned asks.

2. Completeness

- Every mapped TB account appears as an account-level row in IS or BS outputs.
- Subtotals are emitted at each mapping level provided in mapping schema.

3. Units and scaling

- Output units default to `"$'000"` unless user overrides to `"$mm"`.
- Actual-value output (`"$"`, scale `1`) is blocked unless explicitly requested by user.
- Scaling factor is applied and documented.

4. Sign integrity

- IS sign standard: credits `+`, debits `-`.
- BS sign standard: credits `-`, debits `+`.
- Missing/derived sign assumptions are explicitly flagged inline.

5. Calculation and tie-outs

- Period tie-outs pass from canonical TB to mapped outputs.
- Balance sheet check `A = L + E` passes per period (or is flagged with explicit break).

6. Formatting integrity

- Conventions from `references/formatting-guidelines.md` applied on changed blocks.
- Key checks include right alignment (numbers/dates/period headers), row-7 height `19.5`, and locked number/date formats.
- Balance sheet summary headers use period-end dates (`As at`) rather than `FY` labels.
- Balance sheet average presentation is included as a separate average block.
- Rollups must use direct formulas only (`SUM`, `AVERAGE`, direct arithmetic). Do not use `IF(COUNT...)` or `IF(OR(...))` wrappers.
- No new conditional formatting rules.

7. Verification flow

- Recalculate workbook outputs.
- Perform visual spot-check on changed sheets/blocks before final handoff.

8. Return summary

- List changed sheets.
- List checks run and pass/warn/fail outcomes.
- Include unresolved issues and exact next user action if blocked.

If any required check fails and cannot be auto-resolved, return blocked status with failing checks and minimal remediation steps.

## References

- `skill.md` (this orchestrator contract)
- `references/` module playbooks and formatting conventions
- `assets/` pinned template assets
- `scripts/` internal runner interfaces for deterministic mechanics

## Code Style Guidelines

- Python for spreadsheet operations should be minimal and concise.
- Avoid noisy print/debug output.
- In workbooks, annotate complex assumptions/calculations where reviewer context is needed.
