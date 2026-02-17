# Databook Template Cleanup Task Outline

## Key findings (from current audit)
- Workbook has **78 sheets**, including **31 very hidden `_TM_*` helper tabs**.
- There is **1 external link object** and **10 formulas** pointing to external workbook index references (all in `Highlights`).
- There are **3 broken `#REF!` formulas** (in `Highlights`).
- There are **544 volatile formulas** (`OFFSET`/`TODAY` etc.), likely slowing recalculation.
- Data validations are present only on `Key information`, `PL`, and `BS`; most analysis tabs have no input constraints.
- Template includes separator/index tabs ending in `>>` that are navigation-only and should remain protected from data writes.

## Cleanup tasks
### 1) Dependency and link hygiene
- [ ] Remove/repair external workbook link dependencies so the template is fully self-contained.
- [ ] Replace external-link formulas in `Highlights` (`R35:V35`, `R37:V37`) with internal references or static assumptions block.
- [ ] Clear stale external-link metadata from workbook relationships after formula fixes.

### 2) Formula integrity and robustness
- [ ] Fix `#REF!` formulas in `Highlights!D18:F18` and add guarded formula patterns that do not break on column insert/delete.
- [ ] Run whole-workbook formula error scan (`#REF!`, `#NAME?`, `#DIV/0!`, `#VALUE!`) and resolve all non-intentional errors.
- [ ] Decide where volatile `OFFSET` formulas are acceptable; convert stable ranges to `INDEX`-based patterns where possible.

### 3) Structure and execution-safety for the agent
- [ ] Define an explicit write-scope list: tabs editable by Databook Analyst vs locked/template tabs.
- [ ] Mark `>>` navigation tabs and `_TM_*` technical tabs as non-edit targets in implementation rules.
- [ ] Confirm freeze panes, hidden columns/rows, and merged cell usage on active output tabs to avoid accidental layout drift.

### 4) Input contract standardization
- [ ] Standardize `Key information` as the single control panel for period count, currency/unit, sign convention, and entity scope.
- [ ] Expand or document validation lists so source-data keys and required selections are constrained consistently.
- [ ] Add explicit data dictionary for source tabs (`PL`, `BS`, `Accounts`): required columns, types, null handling, and allowed categories.

### 5) Questions/flags implementation readiness (per spec)
- [ ] For each standard analysis tab, identify and reserve the right-side `Questions / Notes` column location.
- [ ] Ensure style for inline questions is consistent (font, fill, border, wrap, row-height behavior).
- [ ] Add a simple check that agent-added notes never overwrite formulas or protected headers.

### 6) Template performance and maintainability
- [ ] Baseline recalc time in Excel before and after cleanup (full recalc + open/save).
- [ ] Review style proliferation (`1117` cell styles, `206` named styles) and deduplicate if this causes file bloat or paste corruption.
- [ ] Remove legacy artifacts/comments/typos in instruction cells where safe (e.g., spelling issues in helper instructions).

### 7) Validation pack before finalizing template
- [ ] Populate with a small synthetic PL/BS dataset and verify key outputs tie out.
- [ ] Confirm conditional formatting checks still trigger expected `ERROR`/`ALL GOOD!` states.
- [ ] Reopen in desktop Excel and confirm no link prompts, no repair dialog, and no hidden dependency warnings.

## Immediate priority order
1. Remove external links and broken `#REF!` formulas (`Highlights`).
2. Define editable/non-editable tab contract for the assistant.
3. Standardize input assumptions and question-column placement for MVP tabs.
4. Run end-to-end sanity pass with test data and verify no link/error prompts.
