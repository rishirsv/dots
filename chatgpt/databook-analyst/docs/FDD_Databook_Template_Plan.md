# Financial Due Diligence Databook Template — Comprehensive Templatization Plan
**Purpose:** Create a reusable, AI-friendly Excel databook template (a “gold standard” structure) that can be applied across diligence engagements.  
**Scope:** Template design (workbook architecture + sheet contracts + controls + indices). **Not** the later “by-analysis” guidance/rules for what to include in Net Debt, which adjustments to make, etc.  
**Decisions locked from workshop:**  
- Core sheet naming uses **pipes with spaces** (example: `QofE | Summary`)  
- Support tabs are **included and visible** (not hidden)  
- Period standard: **last 36 months** (baseline) + **last two FY totals** + **latest TTM**, and **FY-3 if available** (usually not)  
- Entity handling: **separate sheets** for each entity and combined (no dropdown)  
- Upslide tabs: **not included** in template  
- GL-detail deep dive tabs: **excluded for now** (can be a future module library add-on)

**Decisions locked during plan review (current):**
- Delivery style for v1 is **scaffolding first** (sheet contracts and anchors; detailed logic can be layered in later phases).
- Keep entity tabs as **placeholder pattern only** in v1 (`Entity 1 | IS/BS/CF`).
- Balance sheet presentation should follow the **North databook convention** (36 monthly snapshots plus FY/TTM columns as defined in this template).
- AR/AP aging buckets are fixed to: `Current`, `1-30`, `31-60`, `61-90`, `91-120`, `>120`.
- Base module library tabs are **included in v1**; deal-specific module tabs are **deferred**.
- Databook implementation uses **standard ranges (not Excel Table objects)**.
- Named ranges are **not required**; use fixed-position blocks with direct formulas/values.

---

## 1) What “templatize” means in this context
The template should enable two things simultaneously:

1. **Human usability:** teams can work quickly, with predictable formatting, checks, and navigation.
2. **AI usability:** the workbook has deterministic structure so an AI assistant can:
   - identify where inputs go,
   - calculate / refresh outputs,
   - validate tie-outs,
   - populate a standardized “insights” panel,
   - and decide (based on user request) which modules to instantiate/populate.

This requires a **separation of concerns**:
- **Template workbook** = full library of possible sheets/sections and a consistent schema.
- **Generation rules / instructions** (later) = decide what to create/populate for a given engagement request.

---

## 2) Workbook architecture (top-level)
### 2.1 Visible “Core” tabs (must exist with these canonical names)
> These are the anchor modules you specified; the template will include these always.

**Core**
- `Cover`
- `QofE>>` *(divider)*
  - `QofE | Summary`
  - `QofE | Detail`
- `NWC>>` *(divider)*
  - `NWC | Summary`
  - `NWC | Detail`
  - `NWC | Days`
  - `Stratified | BS`
- `Net_debt`
- `Financials>>` *(divider)*
  - `Combined | IS`
  - `Combined | BS`
  - `Combined | CF`
  - `Entity 1 | IS` *(placeholder pattern; generator can copy/rename as needed)*
  - `Entity 1 | BS`
  - `Entity 1 | CF`
- `Recons`
- `Agings`

### 2.2 Module library tabs (template includes; generator chooses what to instantiate/populate)
> These are included in the template, but may not be populated on every deal.

**Recommended “usually reusable across deals” modules**
- `Personnel`
- `Capex`
- `Leases`
- `Other | Analysis` *(e.g., customers/vendors concentration, related party, etc.)*
- `GM | LOB` *(gross margin by line of business)*

**Deal-specific / special modules (deferred from v1; append later as needed)**
- `Revenue | Waterfall`
- `Bookings/Billings | Recons`
- `Inventory | Analysis` *(if applicable)*
- `Deferred Rev | Analysis` *(if applicable)*

> **Template principle:** every module has a **sheet contract** (anchors + required blocks + checks) even if it’s not used on a deal.

### 2.3 Support / control tabs (visible, not hidden)
These make the workbook deterministic and AI-friendly.

**Controls + configuration**
- `Control | Setup`
- `Control | Periods`
- `Control | QC` *(optional but strongly recommended; central check dashboard)*

**Template “AI contract” (the most important enablers)**
- `Template | Manifest`
- `Template | Index`

**Data ingestion + mapping**
- `Data | TB (Wide)`
- `Data | AR Aging`
- `Data | AP Aging`
- `Map | COA to Lines`
- `Map | NWC & NetDebt Class`
- `Map | Entities` *(optional; controls entity list / ordering)*

---

## 3) Naming conventions (standardize once; never revisit)
### 3.1 Sheet names
- **Use pipes with spaces**: `Area | Topic`  
- Divider sheets end with `>>` (no space before arrows): `QofE>>`, `NWC>>`, `Financials>>`
- Use Title Case on primary words; keep abbreviations consistent: `QofE`, `NWC`, `CF`, `IS`, `BS`
- Avoid underscores unless it is already canonical (`Net_debt` is canonical in your list)

### 3.2 Block naming (for Template | Index)
Every analyzable output region gets a stable **BlockKey**. Examples:
- `QOFE_SUMMARY_MAIN`
- `QOFE_DETAIL_MONTHLY`
- `NWC_SUMMARY_ASAT`
- `NWC_DETAIL_MONTHLY`
- `STRAT_BS_CLASSIFICATION`
- `NETDEBT_SCHEDULE`
- `IS_MAIN`, `BS_MAIN`, `CF_MAIN`
- `RECONS_IS`, `RECONS_BS`, `RECONS_CF`
- `AGING_AR`, `AGING_AP`
- `AI_NOTES_PANEL` (on each sheet)

**Rule:** BlockKeys never change once published; if you need a new version, create a new key (e.g., `_V2`).

---

## 4) Period model (36M + FY + TTM) and header formatting
### 4.1 Canonical period engine (Control | Periods)
Create a single standardized range block that defines all periods used across the workbook.

**Range block: `Periods` (fixed anchor recorded in `Template | Index`)**
Columns:
- `PeriodEndDate` (true Excel date; must be month-end)
- `PeriodKey` (`YYYYMM`)
- `Label_Flow` (display label for IS/CF, e.g., `Jun-24`)
- `Label_Snapshot` (display label for BS, “North BS” style single-date label)
- `FY` (fiscal year number)
- `IsFYEnd` (TRUE/FALSE)
- `IsInLast36M` (TRUE/FALSE)
- `IsTTMEnd` (TRUE for the latest month-end)
- `SortOrder` (1..N)

**Key design rules**
- **Never** allow non-month-end dates in the period headers.
- The workbook should reference the `Periods` block in `Control | Periods` to drive:
  - which months appear in outputs,
  - which columns are FY totals,
  - the TTM period endpoint.

### 4.2 Display conventions
**Flow statements (IS/CF)**
- Store header cell as the period end date (Excel date).
- Display format uses `Label_Flow` (e.g., `Jun-24`).

**Snapshot statements (BS)**
- Store header cell as the as-at date (Excel date).
- Display format uses `Label_Snapshot` (North BS style, single-date).

### 4.3 FY and TTM columns
For all relevant output ranges:
- Include FY totals for **FY-2** and **FY-1** (and **FY-3** only if periods exist).
- Include **TTM** as the latest rolling 12-month sum (for flow statements) and latest month-end snapshot (for BS, depending on your convention).
- Place FY/TTM columns on the **right side** of the 36 monthly columns, separated visually (thin vertical border + header fill).

---

## 5) Data ingestion contract (wide-format, deterministic)
### 5.1 Data | TB (Wide)
**Range block: `TB_Wide` (fixed anchor recorded in `Template | Index`)**
Minimum columns:
- `Entity`
- `AccountNumber`
- `AccountName`
- `FS_SignConvention` *(+1 for normal, -1 if needs flip)*
- `Currency`
- `SourceSystem` *(optional)*
- 36+ month columns as **true dates** (month-end), matching the `PeriodEndDate` column in the `Periods` block
- Optional FY columns if the client provides only annuals (but template assumes monthly is preferred)

**Rules**
- Each period column header is an Excel date, formatted per section.
- All downstream outputs reference the `TB_Wide` block through mapping blocks, not ad-hoc lookups.
- If the workbook uses pivots: keep a single standardized pivot base range (prefer formula-driven range logic where possible for AI traceability).

### 5.2 Data | AR Aging / Data | AP Aging
Use a standardized aging schema even if client data differs.

**Range blocks: `AR_Aging` / `AP_Aging` (fixed anchors recorded in `Template | Index`)**
Minimum columns:
- `AsAtDate` (date)
- `Entity`
- `CounterpartyName`
- `CounterpartyID` (optional)
- Bucket columns: `Current`, `1-30`, `31-60`, `61-90`, `91-120`, `>120`
- `Total` (check sum)
- Optional: `InvoiceDate`, `DueDate`, `InvoiceAmount`, etc. (if invoice-level)

**Rules**
- Template stores the “canonical” bucket set; transformation from client buckets is handled in instructions or in a staging block.
- Always include **reconciliation to AR/AP control totals** (to BS) as a check line.

---

## 6) Mapping layer (the backbone of reuse)
### 6.1 Map | COA to Lines
This map enables IS/BS/CF and QofE outputs to be mechanically generated.

**Range block: `COA_Map` (fixed anchor recorded in `Template | Index`)**
Minimum columns:
- `AccountNumber`
- `AccountName`
- `Statement` (`IS` / `BS` / `CF`)
- `LineKey` (stable ID, e.g., `IS_REV_001`)
- `LineName` (human-readable)
- `GroupKey` (e.g., `IS_Revenue`, `IS_COGS`, etc.)
- `SortOrder`
- `SignMultiplier` (if needed)
- `Notes`

### 6.2 Map | NWC & NetDebt Class
Because NWC and Net Debt often require classification beyond FS lines.

**Range block: `Class_Map` (fixed anchor recorded in `Template | Index`)**
Minimum columns:
- `AccountNumber`
- `ClassType` (`NWC`, `NetDebt`, `StratifiedBS`)
- `ClassKey` (stable)
- `ClassName`
- `Bucket` (e.g., `AR`, `AP`, `Accruals`, `Cash`, `Debt`, `DebtLike`)
- `WorkingCapitalFlag` (TRUE/FALSE)
- `NetDebtFlag` (TRUE/FALSE)
- `SortOrder`

### 6.3 Mapping design principles
- Use stable keys (`LineKey`, `ClassKey`) to decouple outputs from wording changes.
- Mapping blocks are the only place where account-to-line decisions live.
- Outputs reference keys and present names; names can change without breaking logic.

---

## 7) Sheet contracts (deterministic layout for AI and humans)
**Every sheet must implement:**
1. **Header block** (consistent placement)
2. **Primary output block** (deterministic top-left anchor)
3. **Checks block** (variance lines, tie-outs)
4. **AI notes panel** (standardized location + labels)

### 7.1 Standard header block (all sheets)
**Placement:** top-left (e.g., rows 1–6).  
Fields:
- Engagement / Target
- Sheet title
- Source(s) and date cut
- Version
- Units + currency
- Prepared by / reviewed by (optional)

> Recommendation: include a “Data as of” cell and a “Last refresh time” cell.

### 7.2 AI notes panel (all sheets)
**Purpose:** provide a structured location the AI fills with insights (not buried in comments).

**Placement:** right side (e.g., starting at `N6` or `P6`, consistent across sheets).  
Standard sections:
- Key takeaways (3)
- Notable movements / anomalies
- Data gaps / caveats
- Questions for mgmt / data requests
- What changed vs prior version (optional)

**Rule:** the panel must have clear labels in cells so the AI can locate by text match if needed, but primary location should also be recorded in `Template | Index`.

---

## 8) Core module contracts (by sheet)
> Below are recommended block keys + core range structures. Anchor cells are examples; finalize once you implement the template (and then record in Template | Index).

### 8.1 Cover
Blocks:
- `COVER_META`
- `COVER_TOC`
- `COVER_QC_SUMMARY` *(optional)*

Features:
- Engagement metadata
- Quick navigation hyperlinks to each divider and core tab
- Status (e.g., “All checks pass?”) pulling from `Control | QC`

### 8.2 QofE | Summary
Blocks:
- `QOFE_SUMMARY_MAIN`
- `QOFE_SUMMARY_CHECKS`
- `AI_NOTES_PANEL`

Columns:
- `FY-3` (if available) | `FY-2` | `FY-1` | `TTM`

Rows (minimum):
- Revenue: Reported, DD Adj, PF Adj, PF Revenue
- EBITDA: Reported, DD Adj, PF Adj, PF EBITDA
- Key margins and growth metrics

Checks:
- Summary totals tie to `QofE | Detail` rollups

### 8.3 QofE | Detail
Blocks:
- `QOFE_DETAIL_MONTHLY`
- `QOFE_DETAIL_ADJ_DD`
- `QOFE_DETAIL_ADJ_PF`
- `QOFE_DETAIL_ROLLUP`
- `AI_NOTES_PANEL`

Columns:
- 36 monthly periods (flow labels)
- FY totals and TTM on right

Rows:
- Reported lines (Revenue / COGS / Opex / EBITDA build)
- DD adjustments section (unlimited rows)
- PF adjustments section (unlimited rows)
- Final “Adjusted EBITDA” and tie-out to Summary

### 8.4 NWC | Summary
Blocks:
- `NWC_SUMMARY_ASAT`
- `NWC_SUMMARY_AVG`
- `NWC_SUMMARY_CHECKS`
- `AI_NOTES_PANEL`

Columns:
- As-at: `FY-2 YE`, `FY-1 YE`, `Latest Month-End`
- Averages: `FY-2 Avg (12 months)`, `FY-1 Avg (12 months)`, `TTM Avg (12 months)`

Rows:
- Reported NWC, DD adj, PF adj, Adjusted NWC
- Sales (TTM) and NWC % of sales
- Seasonality mini stats (optional)

Checks:
- Tie to `NWC | Detail` and `Stratified | BS` for each as-at date

### 8.5 NWC | Detail
Blocks:
- `NWC_DETAIL_MONTHLY`
- `NWC_DETAIL_TAG_TOTALS`
- `AI_NOTES_PANEL`

Rows:
- Bucket/tag level lines (AR, AP, Accruals, etc.)
- Each line is mapped from `Class_Map`

Columns:
- 36 month-ends (snapshot dates or consistent month-end date labels)

Checks:
- Monthly NWC sums tie to `Stratified | BS` classification totals

### 8.6 NWC | Days
Blocks:
- `NWC_DAYS_DSO`
- `NWC_DAYS_SUPPORT`
- `AI_NOTES_PANEL`

Features:
- FY rows with Jan–Dec matrix
- DSO (and optional DPO/DIO) with min/max and commentary

### 8.7 Stratified | BS
Blocks:
- `STRAT_BS_CLASSIFICATION`
- `STRAT_BS_CHECKS`
- `AI_NOTES_PANEL`

Purpose:
- Provide a single “classification engine” that:
  - ties to Combined BS,
  - produces NWC buckets,
  - produces Net Debt buckets,
  - supports other stratifications.

Columns:
- As-at columns: FY-2 YE, FY-1 YE, latest month-end (and 36 months if needed)

Checks:
- Stratified totals tie to `Combined | BS`

### 8.8 Net_debt
Blocks:
- `NETDEBT_SCHEDULE`
- `NETDEBT_ADJ`
- `NETDEBT_CHECKS`
- `AI_NOTES_PANEL`

Columns:
- FY-2 YE | FY-1 YE | latest month-end (+ FY-3 if available)

Rows:
- Cash components
- Debt components
- Debt-like components
- Reported net debt
- Adjustment sections (DD/PF placeholders)
- Adjusted net debt

Checks:
- Tie to `Stratified | BS` classifications

> Note: No “policy decisions” on what belongs in net debt are embedded here—only the mechanical structure and tie-outs.

### 8.9 Financials>> divider + Combined/Entity IS/BS/CF
Blocks per statement:
- `IS_MAIN`, `IS_CHECKS`, `AI_NOTES_PANEL`
- `BS_MAIN`, `BS_CHECKS`, `AI_NOTES_PANEL`
- `CF_MAIN`, `CF_CHECKS`, `AI_NOTES_PANEL`

Statements should:
- pull from `TB_Wide` via `COA_Map`
- include consistent subtotals and checks (Gross profit, EBITDA, etc.)
- include clear sign conventions (positive = favorable) and document them

**Balance sheet columns**
- 36 monthly as-at snapshots (locked decision)

### 8.10 Recons (single tab, multiple sections)
Blocks:
- `RECONS_IS`
- `RECONS_BS`
- `RECONS_CF`
- `RECONS_OTHER` (billings, etc.)
- `AI_NOTES_PANEL`

Each section is a mini-grid:
- Source value | Databook value | Variance | Explanation | Check (=0)

### 8.11 Agings (single tab, AR + AP sections)
Blocks:
- `AGING_AR`
- `AGING_AP`
- `AGING_CHECKS`
- `AI_NOTES_PANEL`

Features:
- Bucket grid totals + tie to BS (AR/AP controls)
- Top counterparties list with contribution %
- Optional: roll-forward reconciliation if invoice-level data exists

---

## 9) Template | Manifest (module selection map)
**Goal:** Let the generator decide which modules to populate without “guessing.”

### 9.1 Suggested columns
- `ModuleKey` (stable)
- `ModuleName` (display)
- `SheetNames` (comma-separated or one-per-row)
- `Purpose`
- `PrimaryInputs` (e.g., TB, AR aging)
- `Dependencies` (e.g., `Stratified | BS` depends on `Combined | BS`)
- `TypicalUseCases`
- `CanInstantiateMultiple` (TRUE/FALSE) *(e.g., per-entity sheets)*

### 9.2 Example rows (illustrative)
| ModuleKey | ModuleName | SheetNames | PrimaryInputs | Dependencies |
|---|---|---|---|---|
| CORE_QOFE | QofE analysis | QofE | Summary; QofE | Detail | TB | Periods, COA map |
| CORE_NWC | Working capital | NWC | Summary; NWC | Detail; NWC | Days; Stratified | BS | TB | Periods, Class map |
| CORE_NETDEBT | Net debt | Net_debt | TB | Stratified | BS |
| MOD_LEASES | Leases | Leases | Lease listing | Periods |

---

## 10) Template | Index (the deterministic “AI contract”)
**Goal:** Make every important block discoverable by cell coordinates, not heuristics.

### 10.1 Suggested columns
- `SheetName`
- `BlockKey`
- `TopLeftCell`
- `HeaderRowNumber`
- `FirstDataRowNumber`
- `PeriodStartColumn` *(e.g., “F”)*
- `PeriodHeaderRowNumber`
- `NotesPanelTopLeftCell`
- `OutputType` (`grid`, `chart`, `textpanel`)
- `RefreshRequired` (TRUE/FALSE) *(if pivot)*
- `ValidationRule` *(text description or reference to Control | QC)*

### 10.2 Best practice
- Record **every** primary output range and check block.
- Record the AI notes panel location for each core sheet.
- Keep coordinates stable; if layout changes, update Index and version the template.

---

## 11) Quality control framework (Control | QC)
### 11.1 Why this matters
An AI generator must have a single place to answer: **“Is the workbook consistent?”**

### 11.2 QC block design
**Range block: `QC` (fixed anchor recorded in `Template | Index`)**
Columns:
- `CheckID`
- `CheckName`
- `Sheet`
- `CellRef` (link to the variance cell)
- `Expected` (usually 0)
- `Actual`
- `PassFlag`
- `Severity` (High/Med/Low)
- `Notes`

### 11.3 Minimum QC checks (core)
- QofE Summary ties to QofE Detail (Revenue, EBITDA)
- NWC Summary ties to NWC Detail / Stratified BS
- Stratified BS ties to Combined BS
- Net_debt ties to Stratified BS
- IS / BS / CF internal checks (e.g., BS balances, cash roll)
- Aging totals tie to AR/AP control accounts

---

## 12) Implementation plan (phased by tab packs for review)
> Build and review in related tab groups so each pass is coherent and easy to sign off.  
> For v1, focus is **scaffolding** (deterministic layout/contracts), then append deeper logic.

### Pack A — Foundation + ingestion backbone
**Tabs**
- `Control | Setup`
- `Control | Periods`
- `Template | Manifest`
- `Template | Index`
- `Data | TB (Wide)`
- `Data | AR Aging`
- `Data | AP Aging`
- `Map | COA to Lines`
- `Map | NWC & NetDebt Class`
- `Map | Entities`

**Scope**
1. Stand up workbook controls, period engine (`Periods` block), and all ingestion/mapping schemas.
2. Apply naming conventions and validation lists.
3. Seed `Template | Manifest`/`Template | Index` structures for later block registration.

**Output:** deterministic data + control layer is ready.

### Pack B — Financial statements pack
**Tabs**
- `Financials>>`
- `Combined | IS`
- `Combined | BS`
- `Combined | CF`
- `Entity 1 | IS`
- `Entity 1 | BS`
- `Entity 1 | CF`

**Scope**
1. Scaffold standard header blocks, primary output blocks, checks regions, and AI notes panels.
2. Apply consistent period presentation conventions, aligned to North-style BS treatment.
3. Register all block anchors in `Template | Index`.

**Output:** core FS surfaces exist in deterministic form for combined and placeholder entity views.

### Pack C — Diligence core pack
**Tabs**
- `QofE>>`
- `QofE | Summary`
- `QofE | Detail`
- `NWC>>`
- `NWC | Summary`
- `NWC | Detail`
- `NWC | Days`
- `Stratified | BS`
- `Net_debt`

**Scope**
1. Scaffold each diligence sheet with stable anchor patterns and tie-out/check zones.
2. Ensure structural links between Stratified BS, NWC, and Net Debt are represented in checks blocks.
3. Register all new blocks in `Template | Index`.

**Output:** diligence analysis tabs are template-ready and discoverable by AI.

### Pack D — Reconciliation + QC pack
**Tabs**
- `Recons`
- `Agings`
- `Control | QC`

**Scope**
1. Scaffold reconciliation mini-sections and aging sections using canonical schemas/buckets.
2. Wire central QC block (`QC`) to planned variance/check cells.
3. Add workbook-level status hooks for Cover.

**Output:** centralized validation and tie-out framework is in place.

### Pack E — Cover, navigation, and base module library pack
**Tabs**
- `Cover`
- Base module tabs: `Personnel`, `Capex`, `Leases`, `Other | Analysis`, `GM | LOB`

**Scope**
1. Build Cover metadata, navigation links, and status-at-a-glance placeholders.
2. Scaffold base module tabs using the same contract pattern (header/main/checks/AI notes).
3. Finalize tab order aligned to North databook where applicable, with support tabs appended consistently.

**Output:** complete v1 scaffold with review-friendly navigation and reusable base modules.

### Pack F — Validation, test harness, and release controls
1. Create a synthetic test dataset (2 entities, 36 months, simple mappings).
2. Confirm period behavior, FY/TTM behavior, and all structural QC checks.
3. Add/update `Template version` and change log entry; freeze key anchors/keys.

**Output:** validated, versioned template scaffold ready for formula/business-rule enrichment.

### Deferred backlog pack (post-v1)
**Deferred tabs**
- `Revenue | Waterfall`
- `Bookings/Billings | Recons`
- `Inventory | Analysis`
- `Deferred Rev | Analysis`

**Scope**
1. Add deferred tabs as drop-in modules following the same sheet-contract and indexing standards.
2. Extend `Template | Manifest`/`Template | Index` without breaking existing keys.

---

## 13) Generator-facing guidance (for later build, but design now)
> This is not the “analysis rulebook.” It is the mechanical playbook a model follows to populate the workbook.

### 13.1 The generator workflow (mechanical)
1. Read `Template | Manifest` to identify candidate modules.
2. Read `Control | Setup` for:
   - latest month-end,
   - units,
   - FY-end month,
   - entity list.
3. Ingest data into `Data | ...` blocks.
4. Populate mapping blocks (or validate they are complete).
5. Refresh pivots / calculations (if any).
6. Use `Template | Index` to locate output blocks and validate checks.
7. Write insights into `AI notes panel` on relevant sheets.
8. Summarize check status on `Control | QC` and `Cover`.

### 13.2 Minimal requirements for AI reliability
- No merged cells in primary output ranges.
- Consistent headers and stable anchor cells.
- Checks always in the same place and referenced in `Control | QC`.
- All period headers are valid Excel dates aligned to the `Periods` block in `Control | Periods`.

---

## 14) Governance and maintenance
- Assign a single “template owner” responsible for updating keys and indices.
- Any layout change must:
  1) preserve block anchors, or
  2) update `Template | Index` and bump template version.
- Prefer additive changes (new blocks/keys) over breaking changes.

---

## Appendix A — Recommended tab list (template v1)
**Core**
- Cover
- QofE>>
- QofE | Summary
- QofE | Detail
- NWC>>
- NWC | Summary
- NWC | Detail
- NWC | Days
- Stratified | BS
- Net_debt
- Financials>>
- Combined | IS
- Combined | BS
- Combined | CF
- Entity 1 | IS
- Entity 1 | BS
- Entity 1 | CF
- Recons
- Agings

**Module library**
- Personnel
- Capex
- Leases
- Other | Analysis
- GM | LOB

**Deferred module library (post-v1)**
- Revenue | Waterfall
- Bookings/Billings | Recons
- Inventory | Analysis
- Deferred Rev | Analysis

**Support**
- Control | Setup
- Control | Periods
- Control | QC
- Template | Manifest
- Template | Index
- Data | TB (Wide)
- Data | AR Aging
- Data | AP Aging
- Map | COA to Lines
- Map | NWC & NetDebt Class
- Map | Entities

---

## Appendix B — Key “don’ts” (avoid template fragility)
- Don’t rely on manual month column insertion—drive from the `Periods` block in `Control | Periods`.
- Don’t hardcode entity names in formulas—reference `Map | Entities` or Control.
- Don’t bury checks in random areas; centralize via `Control | QC`.
- Don’t use inconsistent date headers (e.g., first of month vs month-end).
- Don’t use merged cells in ranges the AI must parse.

---

## Appendix C — Open items (to resolve during build)
- Exact list of NWC/Net debt classification buckets (structure exists; names can be finalized and expanded over time).
- Degree of v1 logic depth per tab (scaffold-only is locked; formula and analysis-rule depth can be staged by pack).

---

**End of document.**
