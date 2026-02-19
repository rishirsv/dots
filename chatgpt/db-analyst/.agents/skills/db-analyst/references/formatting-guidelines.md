# Databook Formatting and Conventions

## Purpose

Single source of truth for workbook formatting behavior across all modules.
This file explicitly defines the databook formatting profile and how it overrides generic spreadsheet defaults.

## Precedence and Fallback Rules

1. User instruction in the current request.
2. Existing user-provided workbook formatting (when editing an existing workbook).
3. This conventions profile (KPMG brand baseline).
4. Generic spreadsheet skill defaults (only when still unspecified).

Operational rule:
- If working from an existing workbook, follow that workbook's formatting conventions first.
- If building net new analysis, a new workbook, a new databook, or if style is unclear, fall back to KPMG conventions below.

## How This File Is Used

- `skill.md` routes all formatting decisions here.
- Module playbooks inherit these rules.
- `Control | Format Guide` captures applied/overridden formatting decisions for each run.

## Supporting Sheet Contract

Create or update `Control | Format Guide` with:

- `Rule ID`
- `Scope`
- `Anchor`
- `Spreadsheet Skill Default`
- `Databook Opinion`
- `Execution Behavior`
- `Validation Method`
- `Status` (`Adopted`, `Overridden`, `TBD`)

## KPMG Conventions (Explicit)

### Typography and Text

- Primary font: `Arial 10`.
- Source line font: `Arial 8`, italic, gray (`FF666666`).
- Title text: `Arial 10`, bold, black.
- Header text on blue bars: `Arial 10`, bold, white.
- Default alignment for text labels: left + vertical center.

### Key Colors

- Dark navy title/section bar fill: `FF00338D`
- Cobalt header fill: `FF1E49E2`
- Input fill light blue: `FFD9E1F2`
- Check fill light yellow: `FFFFF2CC`
- Note label fill light gray: `FFF2F2F2`
- Separator/total border color: `FF00338D`
- Optional neutral border color (non-financial helper tables only): `FFD9D9D9`

### Color and Style Tokens (Locked)

Use these exact style anchors:

- `title`: `Control | Setup!A1`
- `source`: `Control | Setup!A2`
- `note_label`: `Control | Setup!A4`
- `section_bar`: `Combined | IS!A7`
- `header`: `Combined | IS!A8`
- `data`: `Combined | IS!A9`
- `input`: `Combined | IS!G9`
- `check`: `Combined | IS!G28`

### Standard Layout Rules by Sheet

- `A1`: sheet title (bold black).
- `A2`: `Source: <document_source>` on all non-divider sheets.
- `Control | Setup` is mandatory for Process-TB outputs.
- Row 7: section/title bar in dark navy, filled across full data width.
- Row 7 extends to the last header column for the block (core monthly grids currently through `AS`).
- Row 7 height: `19.5` (title bar standard).
- Row 8: header row in cobalt for full block width.
- Main data rows: no full-grid borders in numeric blocks by default.
- Check rows: yellow check cells only where checks are entered/read.

### Units Convention

- Use `"$'000"` (exact text) as units marker.
- In standard analysis grids, place units in `B8`.
- This replaces the usual `LineName` header in `B8` for those tabs.
- Do not use the word `thousands`.
- Do not add a separate `Units` label when `B8` carries units.

### Number and Date Formats (Locked)

Use these exact custom format codes:

- Whole number (general financial values): `#,##0_);(#,##0);"-"_);@`
- Currency, no decimals, negatives red: `$#,##0_);[Red]($#,##0)`
- Percent, 2 decimals: `0.00%`

Date conventions:

- Balance sheet date columns must be month-end dates shown as: `dd-mmm-yy`
- P&L period columns must be shown as: `mmm-yy`
- ISO/date key fields when needed for staging tables: `yyyy-mm-dd`
- Existing workbook equivalent for BS dates is acceptable when already present: `[$-409]d-mmm-yy;@`

Precision rule:

- Numbers in analysis outputs default to no decimals.
- Percents default to 2 decimals.
- If editing an existing workbook that uses a different precision, preserve existing sheet precision.

### Structural Integrity Rules

- Keep formulas and values directly in cells (no hidden table logic).
- No merged cells in key model/output tabs.
- If centering is needed, use center-across-selection instead of merge.

### Totals and Subtotals (Locked)

Use these patterns:

Major total rows (for example `Net Income`, `EBITDA`, `Total assets`):

- Font: bold.
- Numeric cells: thin **top** border only.
- Top border color: black `FF000000`.
- No full-grid gray borders.

Running subtotal/sum lines:

- Keep row fill unshaded by default.
- Use direct `=SUM(...)` rollups for blocks.
- Do not wrap rollups in `IF(COUNT...)`.

Border policy clarification:

- Do not apply gray grid borders across number blocks by default.
- Numeric blocks use minimal separators only; totals are emphasized with thin top black line.

### Spreadsheet Skill Integration Rules

- Override generic spreadsheet color/style defaults with this databook profile.
- Prefer token-copy style application from locked anchors.
- Recalculate formulas and visually inspect rendered outputs before finalizing.

### View and Freeze Pane Defaults (Locked)

- Gridlines: off by default (`showGridLines=0`).
- Zoom: default `100%`.
- Freeze panes are standard on analysis tabs and should split immediately before the first month column.

Fallback defaults for net-new tabs:

- If first month column is `D`: freeze at `D9` (`xSplit=3`, `ySplit=8`).
- If first month column is `F` (IS/BS-style with extra descriptor columns): freeze at `F10` (`xSplit=5`, `ySplit=9`).
- If header block starts on row 8 but month labels are on row 9, use `ySplit=8`; if data starts row 10, use `ySplit=9`.
- Preserve or mirror the nearest in-workbook freeze pattern when editing existing sheets.

Allowed pane split patterns:

- `xSplit=3`, `ySplit=9`
- `xSplit=3`, `ySplit=8`
- `xSplit=5`, `ySplit=9` (wide IS/BS-style sheets)
- `xSplit=5`, `ySplit=8`

### Alignment Conventions (Locked)

- Numeric cells: right-aligned.
- Date cells: right-aligned.
- Period headers (including `FYxx` headers): right-aligned.
- Total-column headers (for example `FYxx` / summary period columns): right-aligned.
- Row labels and descriptive text: left-aligned.
- Keep any explicit center-across-selection behavior already present in existing workbook sections.

### EBITDA Add-back Conventions (Locked)

For the core income statement bridge style:

- Start from `Net Income` total row.
- Add-back rows are modeled by sign-flipping expense/tax components (for example `=-F254`, `=-F346`) where required.
- `EBITDA, reported` is computed as a sum from `Net Income` through defined add-back rows (for example `=SUM(F353:F357)` pattern).
- `Net Income` and `EBITDA` rows use major total styling (bold + gray fill + medium bottom border).

### Sign Conventions (Locked)

- Standardized sign map for databook builds:
  - IS: Credits `+`, Debits `-`.
  - BS: Credits `-`, Debits `+`.
- Display convention:
  - Negatives are shown in parentheses via number format.
- Formula convention:
  - Prefer additive rollups (`=SUM(...)`) with pre-signed input lines.
  - Use direct subtraction/sign-flip formulas only when required for bridge logic (for example retained earnings and EBITDA add-back bridges).
  - Do not use `IF(OR(...))` wrappers around arithmetic rollups/checks.

### Statement Header Conventions (Locked)

- Income statement summary headers use fiscal-year string labels (for example `FY23`).
- Balance sheet summary headers use period-end dates (`As at`, `dd-mmm-yy`), not `FY` labels.
- Balance sheet includes a separate average presentation block (for example `Average FY23` columns).

### Conditional Formatting Policy

- Do not create new conditional formatting rules.
- When editing an existing workbook, preserve existing conditional formatting in unchanged ranges.
- Do not expand or modify existing conditional formatting unless explicitly requested by the user.

## Formatting Opinion Matrix (Mapped to Spreadsheet Skill)

### FO-001 Existing workbook style precedence

- Spreadsheet Skill Default: preserve provided workbook style.
- Databook Opinion: `Adopt + tighten`
- Execution Behavior: existing workbook style governs edited/added blocks unless user says otherwise.
- Validation Method: compare changed areas to neighboring in-sheet style patterns.
- Status: `Adopted`

### FO-002 KPMG fallback for net new/unclear cases

- Spreadsheet Skill Default: create a sensible default style when unformatted.
- Databook Opinion: `Override`
- Execution Behavior: use explicit KPMG tokens/colors/typography/layout above.
- Validation Method: token and color check against locked anchors.
- Status: `Adopted`

### FO-003 Number/date format policy

- Spreadsheet Skill Default: choose appropriate number/date formats.
- Databook Opinion: `Adopt + lock`
- Execution Behavior: apply locked format codes with no-decimal numbers and 2-decimal percents by default.
- Validation Method: inspect cell number format strings in representative rows.
- Status: `Adopted`

### FO-004 Zero/negative display policy

- Spreadsheet Skill Default: zeros as `-`; negatives red + parentheses.
- Databook Opinion: `Adopt`
- Execution Behavior: enforce in financial output blocks unless existing workbook defines otherwise.
- Validation Method: test positive/zero/negative sample cells.
- Status: `Adopted`

### FO-005 Merge behavior

- Spreadsheet Skill Default: merges allowed judiciously.
- Databook Opinion: `Override`
- Execution Behavior: no merges in analyzable model/output regions.
- Validation Method: verify merged range count in modified output blocks.
- Status: `Adopted`

### FO-006 Formula compatibility

- Spreadsheet Skill Default: formulas required; avoid unsupported dynamic-array features.
- Databook Opinion: `Adopt`
- Execution Behavior: no dynamic arrays, no `=TABLE`, no hidden table logic.
- Validation Method: formula scan + error scan.
- Status: `Adopted`

### FO-007 Recalc and render QA

- Spreadsheet Skill Default: recalculate and render before delivery.
- Databook Opinion: `Adopt`
- Execution Behavior: run recalc + render checks before output handoff.
- Validation Method: execution log indicates both checks completed.
- Status: `Adopted`

### FO-008 Total row emphasis

- Spreadsheet Skill Default: no single total-row style.
- Databook Opinion: `Override`
- Execution Behavior: apply bold + light gray fill + medium bottom border for totals (optional thin top border at section boundaries).
- Validation Method: style inspection of representative total/subtotal rows.
- Status: `Adopted`

### FO-009 Conditional formatting controls

- Spreadsheet Skill Default: no strict prohibition.
- Databook Opinion: `Override`
- Execution Behavior: do not add new conditional formatting rules; preserve existing only.
- Validation Method: conditional formatting node count does not increase unless explicitly requested.
- Status: `Adopted`

### FO-010 Border minimalism and separator lines

- Spreadsheet Skill Default: generic borders are allowed for clarity.
- Databook Opinion: `Override`
- Execution Behavior: avoid full-grid borders in numeric blocks; use targeted thin/medium separator lines (dark navy) and major total emphasis only.
- Validation Method: visual and XML/style checks on representative analysis tabs.
- Status: `Adopted`

### FO-011 Alignment defaults

- Spreadsheet Skill Default: mixed/automatic alignment.
- Databook Opinion: `Adopt + tighten`
- Execution Behavior: right-align numbers/dates/period headers, left-align descriptive text labels.
- Validation Method: alignment check in header rows and representative number blocks.
- Status: `Adopted`

### FO-012 Sign and bridge logic

- Spreadsheet Skill Default: no domain sign convention.
- Databook Opinion: `Adopt (databook baseline)`
- Execution Behavior: apply standardized IS/BS sign logic and allow subtraction/sign-flip formulas only where bridge logic requires it.
- Validation Method: formula and output sign spot-check on IS/BS bridge rows.
- Status: `Adopted`

## Minimum Validation Checklist

- Header/style tokens in changed blocks match intended profile.
- Data/check rows use expected number/date formats.
- Notes/questions column exists to the right of output rows.
- Tie-out rows/blocks are present and populated.
- No unsupported formulas or formula-error cells in modified regions.
