# Implementation Plan: Databook Analyst

**Spec:** `docs/databook-analyst/spec-databook-analyst.md`

## Description

Build a plan-first databook automation assistant that edits an existing databook (if uploaded) or starts from a standardized template (if not). The assistant always begins in **Plan Mode** (Markdown wireframe + mappings + validations), and only generates/modifies Excel after the user explicitly responds **“Proceed”**. Execution outputs are strict-format `.xlsx` workbooks aligned to the databook template, with inline row-level **Comments** cells placed to the right of numeric tables.

## Scope

- In:
  - Plan Mode gate with “Proceed” enforcement.
  - `.xlsx` databook generation/editing based on a template workbook.
  - Input ingestion (xlsx/csv) with normalization (dates, units, sign conventions) and provenance.
  - MVP modules: P&L trending (Income statement-style), NWC (Summary + Days), Net debt, and Recons (IS/BS/Cash flow/Billings) with inline comments/flags.
  - Light validation (check rows, tie-outs, structural sanity checks) and deterministic outputs.
- Out:
  - Sending diligence questions externally (email/RL).
  - Full narrative drafting.
  - `.xlsb` macro preservation / UpSlide automation (v1 outputs standardized to `.xlsx`).

## Key files (proposed)

- `databook_analyst/skill.md` — main operating instructions (modes, strict format, proceed gate).
- `databook_analyst/configs/module_registry.yaml` — NL routing → module IDs + required inputs.
- `databook_analyst/configs/style_tokens.yaml` — banner/title/table styles + constants (B1:B4, C7, etc.).
- `databook_analyst/templates/databook_template.xlsx` — macro-free template used as the base.
- `databook_analyst/modules/*.md` — module blueprints (anchors, schemas, validations, comment placement).
- `databook_analyst/runtime/` — helper code for workbook editing, schema validation, ingestion, and logging.
- `docs/databook-analyst/spec-databook-analyst.md` — frozen requirements + acceptance criteria.
- `docs/databook-analyst/plan-databook-analyst.md` — this plan.

## Tasks

### Phase 1: Repository layout, template standardization, and constraints

Create a file structure that mirrors the spreadsheet runtime conventions and locks in the `.xlsx` template baseline.

- [ ] 1.0 Create Databook Analyst package skeleton
  - [ ] 1.1 Add folders: `databook_analyst/{modules,configs,templates,runtime,examples}`.
  - [ ] 1.2 Add placeholder docs: `databook_analyst/skill.md`, `databook_analyst/databook.md`.
  - [ ] 1.3 Validation: tree matches agreed structure and is easy to extend.

- [ ] 1.4 Convert the provided `.xlsb` databook to a macro-free `.xlsx` template
  - [ ] 1.5 Decide what must be preserved in template v1: sheet order, banner cells (B1:B4), title cell (C7), known comment headers.
  - [ ] 1.6 Produce `databook_analyst/templates/databook_template.xlsx` and confirm it opens cleanly in Excel.
  - [ ] 1.7 Validation: manual open check; confirm sheet names (including pipes and trailing spaces) are preserved where relevant.

- [ ] 1.8 Encode template constants and style tokens
  - [ ] 1.9 Create `databook_analyst/configs/style_tokens.yaml` based on the extracted conventions:
    - banner: B1/B2/B3/B4 (“WORKING DRAFT”, “Source:”)
    - title cell: C7
    - units candidates: C7/C8/C9
    - comment header row: 7
  - [ ] 1.10 Validation: a small script prints/validates token coverage against the template workbook.

### Phase 2: Plan Mode engine (wireframe + gating)

Implement a deterministic Plan Mode output schema that is reviewable, and a strict gate to prevent Excel actions until “Proceed”.

- [ ] 2.0 Define the Plan Mode output contract
  - [ ] 2.1 Create a plan schema (Markdown + machine-readable block) including:
    - mode: Plan
    - workbook target: edit-existing vs start-from-template
    - sheets affected (create/update), with anchors and table schemas
    - required inputs + file expectations
    - transformations (date parsing, unit scaling, sign rules)
    - validations/tie-outs + expected “Check” rows
    - inline comments placement strategy per sheet
  - [ ] 2.2 Validation: sample plan renders consistently and is easy for users to approve.

- [ ] 2.3 Implement “Proceed” gating behavior
  - [ ] 2.4 Add explicit rule: no workbook creation/modification in Plan Mode.
  - [ ] 2.5 Add rule: assistant only prompts for Proceed when the plan is executable end-to-end.
  - [ ] 2.6 Validation: adversarial tests (“go ahead”, “run”, “ok”) do not bypass unless allowed; only “Proceed” (or allowed synonyms if you choose) transitions to Execute Mode.

### Phase 3: Input ingestion + dataset catalog

Create a small ingestion framework that turns uploaded files into normalized datasets with provenance.

- [ ] 3.0 Build ingestion helpers for xlsx/csv
  - [ ] 3.1 Parse tabular sources; detect header row; infer types (date, numeric, text).
  - [ ] 3.2 Normalize: dates (month-end vs month-start), currency units ($ vs $’000), sign conventions.
  - [ ] 3.3 Track provenance: source filename, sheet/tab, extraction timestamp, filters applied.

- [ ] 3.4 Implement a “dataset catalog” object
  - [ ] 3.5 Store datasets keyed by likely type: TB, GL detail, AR aging, AP aging, payroll, capex, lease schedule, etc.
  - [ ] 3.6 Add lightweight heuristics for detection (column names, typical fields).
  - [ ] 3.7 Validation: given mixed uploads, the catalog correctly labels/flags ambiguous sources.

### Phase 4: Workbook runtime (create/edit `.xlsx` safely)

Implement the workbook editing layer that can (a) start from template, (b) add/modify sheets, (c) preserve formatting, and (d) write formulas compatible with Excel.

- [ ] 4.0 Implement workbook IO + safety
  - [ ] 4.1 Load/save workbook; preserve sheet order; avoid name normalization that breaks pipes/trailing spaces.
  - [ ] 4.2 Add a change log (internal): sheets touched, ranges written, formulas inserted.
  - [ ] 4.3 Validation: diff-based check shows only expected ranges changed.

- [ ] 4.4 Implement common layout primitives (used by all modules)
  - [ ] 4.5 Banner writer: populate B1:B4 with draft flag and source line.
  - [ ] 4.6 Title writer: populate C7 with module title.
  - [ ] 4.7 Table builder: write headers, apply wrap text, set number formats, add subtotal/total row styling.
  - [ ] 4.8 Inline comments: create/find a “Comments”/“Questions/Comments” header in row 7 and write row-level notes.
  - [ ] 4.9 Validation: a generated sheet visually matches the template conventions for banner/title/header rows.

### Phase 5: MVP modules (core automation)

Implement a small set of high-ROI modules using the extracted anchors/schemas.

- [ ] 5.0 Module framework and registry
  - [ ] 5.1 Create `databook_analyst/configs/module_registry.yaml` with:
    - module ID, NL intent keywords, required inputs, output sheets, comment header label, anchor cells.
  - [ ] 5.2 Create per-module blueprint docs in `databook_analyst/modules/`.
  - [ ] 5.3 Validation: a router selects the right module for typical prompts.

- [ ] 5.4 Implement module: P&L trending (Income statement-style)
  - [ ] 5.5 Target schema: monthly trend with Code + Concatenate, units at C8/C9, months start at F.
  - [ ] 5.6 Data mapping: TB/GL → account lines; ensure monthly columns are true Excel dates (not strings).
  - [ ] 5.7 Add outlier detection (simple): MoM/YoY variance thresholds → inline comment flags.
  - [ ] 5.8 Validation: totals tie to source period totals; formatting matches template pattern.

- [ ] 5.9 Implement module: NWC Summary + NWC Days
  - [ ] 5.10 NWC Summary anchors: start C9, check row labeled “Check”, seasonality blocks at C20/C28.
  - [ ] 5.11 NWC Days: ensure comments header exists (AG7) and write row-level issues to AG.
  - [ ] 5.12 Validation: check rows evaluate to 0 (or are flagged); days metrics recompute consistently.

- [ ] 5.13 Implement module: Net debt
  - [ ] 5.14 Anchor: start C9, Ref column at D, “On BS” column at K, comments at M7.
  - [ ] 5.15 Add “Check - Stratified BS” tie-out line behavior and flag variances.
  - [ ] 5.16 Validation: reported vs adjusted totals reconcile; check ties out or is flagged with explanation.

- [ ] 5.17 Implement module: Reconciliations (IS/BS/Cash flow/Billings)
  - [ ] 5.18 Recons | IS block-year layout (Audited/Internal/Variance per FY).
  - [ ] 5.19 Recons | BS includes “Management Comments” column behavior.
  - [ ] 5.20 Recon | Cash flow uses “Questions/Comments” at AF7; Billings uses “Comments” at BB7.
  - [ ] 5.21 Validation: variance columns compute correctly; comments land on correct rows.

### Phase 6: Validation suite + acceptance harness

Make outputs testable and safe to run repeatedly.

- [ ] 6.0 Add automated validations
  - [ ] 6.1 Structural checks: required sheets exist, anchors present, header rows match schemas.
  - [ ] 6.2 Numeric checks: check rows equal 0 within tolerance; totals tie to source within tolerance.
  - [ ] 6.3 Formatting checks (best-effort): key cells exist (B1:B4, C7) and comment header row 7 is present.

- [ ] 6.4 Create golden test cases
  - [ ] 6.5 Add small synthetic datasets for each module in `databook_analyst/examples/`.
  - [ ] 6.6 Add “edit existing workbook” tests (starting from template + injected prior content).
  - [ ] 6.7 Validation: reproducible runs yield identical workbooks (or identical key ranges).

### Phase 7: Custom GPT packaging (instructions + knowledge)

Package the assistant behavior, module docs, and template into a clean Custom GPT configuration.

- [ ] 7.0 Draft system instructions (`databook_analyst/skill.md`)
  - [ ] 7.1 Encode Mode behavior: Plan Mode default, explicit Proceed to execute, strict format.
  - [ ] 7.2 Encode safety rails: never emit raw HR PII by default; only aggregate outputs.
  - [ ] 7.3 Validation: prompt tests show the assistant stays in Plan Mode until Proceed.

- [ ] 7.4 Assemble knowledge bundle
  - [ ] 7.5 Upload: template workbook, module blueprints, style tokens, module registry.
  - [ ] 7.6 Validation: the GPT can accurately reference anchors/schemas and produce correct plans.

### Phase 8: MVP rollout and expansion roadmap

Ship MVP modules, then expand to the “core 25” outputs using the same module framework.

- [ ] 8.0 MVP launch checklist
  - [ ] 8.1 Confirm v1 module list, required input expectations, and default tolerances.
  - [ ] 8.2 Create a “Module Coverage” matrix mapping core sheets → modules.

- [ ] 8.3 Second-wave modules (based on core-set inventory)
  - [ ] 8.4 Capex (Fixed assets profile, YTD capex), Leases, Aging summary, Revenue by customer group, Gross margin by LOB, KPI summary by LOB.
  - [ ] 8.5 Validation: each module defines anchors, schemas, and at least one tie-out.

---

## Next step

If you want, the next action is `/implement` starting with Phases 1–2 (structure + template + Plan Mode contract), because that unlocks safe iteration without long Excel runtimes.
