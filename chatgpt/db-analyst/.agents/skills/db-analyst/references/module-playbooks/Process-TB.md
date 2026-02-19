# Playbook: Process-TB

## Purpose

Convert a messy trial balance into financial statements with account-level detail, mapping-level subtotals, and deterministic QC.

This playbook is model-driven for accounting decisions and runner-driven for mechanics.

## Required Inputs

- Trial balance file (`.xlsx` or `.csv`) in wide or long shape.
- Optional COA mapping file (`.csv`).
- Optional user overrides:
  - units scaling
  - sign assumptions
  - target sheet naming or scope

## Deliverable Scope

Default deliverable for financial-statement asks is minimum required workbook scope:

- `Control | Setup`
- `Data | TB`
- `Map | COA to Lines`
- `Combined | IS`
- `Combined | BS`
- `Control | QC`

If TB has entity dimension, include per-entity statements in same structure.

`Control | Setup` is always required for `Process-TB` because statement headers, fiscal labeling, and units scaling are controlled from this tab.

## Canonical Schemas (Locked)

### Canonical TB rows (`Data | TB` source contract)

- `period`
- `entity`
- `account_number`
- `account_name`
- `amount_raw`
- `units_scale_applied`
- `amount` (scaled amount)
- `source_column`
- `source_row`
- `is_derived`
- `notes`

### Mapping rows (`Map | COA to Lines` contract)

- `account_number` (or `account_name` where number unavailable)
- `statement` (`IS` or `BS`)
- `Level1Key`, `Level1Name`
- `Level2Key`, `Level2Name`
- `Level3Key`, `Level3Name`
- `LineKey`, `LineName`
- `SortOrder`
- `SignMultiplier` (optional)
- `Notes` (optional)

### Mapped output rows (runner contract)

- canonical TB fields + mapping fields
- `amount_signed`
- `mapping_status` (`mapped`, `unmapped`, `ambiguous`)
- `mapping_match_on`
- `sign_multiplier_status` (`provided`, `derived`, `missing_assumption`)
- `mapping_note`

## Model Decisions (Not Delegated)

The model decides:

1. account classification (IS vs BS)
2. level hierarchy assignment (L1/L2/L3/line)
3. sign behavior when `SignMultiplier` is missing
4. ambiguity handling and inline notes
5. scope pruning decisions

Runners should not invent accounting policy.

## Mapping Modes

### Mode A: Mapping provided

1. Ingest/normalize TB.
2. Apply provided mapping schema.
3. Derive missing sign multipliers only where needed.
4. Produce mapped outputs and statements.

### Mode B: No mapping provided

1. Ingest/normalize TB.
2. Model generates mapping table in-run.
3. Write generated mapping into `Map | COA to Lines` and persist as CSV artifact.
4. Continue with same mechanical path as Mode A.
5. Flag low-confidence rows with inline `Mapping review:` notes.

No separate pause is required.

## Sign Standardization (Locked)

- IS display standard: credits `+`, debits `-`
- BS display standard: credits `-`, debits `+`
- Negatives display with parentheses by number format

### Sign Multiplier Guidance

`SignMultiplier` controls whether native source sign is kept (`1`) or flipped (`-1`).

Fallback when missing:

1. infer target display sign from statement + line class
2. inspect source sign behavior on sample periods
3. set `1` when source already matches target sign, else `-1`
4. mark `sign_multiplier_status=derived`
5. add inline note `Mapping review: sign assumption` where confidence is low

## Required Statement Shape

- Account-level rows for every mapped account
- Subtotals at each non-empty level boundary (L3, L2, L1)
- Header presentation:
  - IS summary headers: fiscal-year strings (for example `FY23`)
  - BS summary headers: period-end dates (`As at`) + separate average block
- Derived rows:
  - IS: gross profit, operating income, net income, add-backs, EBITDA
  - BS: total assets, total liabilities, total equity, `A + (L + E)` check (should resolve to zero under locked sign convention)

Formula behavior:

- Prefer additive rollups (`SUM`) with pre-signed components
- Avoid subtractive constructions unless bridge logic requires them

## Mechanics Sequence (Runner)

1. Ingest TB to canonical schema.
2. Apply scale (default `0.001` to present `"$'000"`, unless overridden).
   - default output: `"$'000"` (`scale = 0.001`)
   - allowed override: `"$mm"` (`scale = 0.000001`)
   - actual values (`scale = 1`) only when explicitly requested
3. Apply mapping table.
4. Build IS/BS structures with account rows + level subtotals.
5. Write workbook blocks and apply formatting conventions.
6. Run QC checks and write `Control | QC` status.

## Tie-Outs and QC (Must Run)

1. schema checks on canonical and mapped outputs
2. mapped completeness (no dropped mapped accounts)
3. mapping status checks (unmapped/ambiguous surfaced)
4. period tie-out (canonical vs mapped raw/scale-consistent totals)
5. BS balance check (`A = L + E` by period)
6. sign assumption visibility check
7. formatting checks for key rules:
- row 7 height `19.5`
- right alignment for numbers/dates/period headers
- locked number/date formats
- no `IF(COUNT...)` or `IF(OR(...))` wrappers in statement rollup formulas
- BS period-end summary headers are date headers (not `FY` text)
- BS includes separate average presentation block
- no new conditional formatting

## Inline Notes (Locked Patterns)

- `Mapping review:` for unmapped or low-confidence mapping
- `Mapping review: sign assumption` for derived sign logic needing review
- `Mapping conflict:` for ambiguous match candidates
- `Tie-out break:` for unreconciled period checks
- `Units assumption:` when scale was inferred/defaulted

## Internal Runner Interfaces

- `scripts/ingest_tb.py`
- `scripts/apply_coa_mapping.py`
- `scripts/build_is_trend.py`
- `scripts/build_fs_workbook.py`
- `scripts/run_qc_checks.py`
- `scripts/ProcessTB.py`

These are internal execution tools for model-run flows.
