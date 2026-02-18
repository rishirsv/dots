# Custom GPT: Databook Analyst

## TL;DR

- **Problem:** FDD teams spend a lot of time ingesting messy data room exports into a strict KPMG databook format, and Excel rebuild cycles are expensive (often 30–60 minutes) when something is wrong.
- **Solution:** A plan-first assistant that behaves like a databook associate: it produces a clear wireframe + mapping + checks in chat, then (only after the user explicitly says **“Proceed”**) generates or edits an Excel databook using a standard template, including standard databook analyses and inline questions/flags.

## Scope

- **In:**
  - Data ingestion and normalization from common data room files (Excel/CSV; limited PDF table extraction where feasible).
  - Strict KPMG-format sheet creation/updates using a provided databook template.
  - “Standard databook” analyses (e.g., P&L trending/variance, sales & margin cuts, payroll/headcount cuts) with short insight bullets.
  - Light reconciliation checks (ties, totals, rollforwards) and inline questions/flags written into the workbook.

- **Out:**
  - Sending diligence questions externally (email/request lists) or acting as a client communication tool.
  - Narrative report writing or slide creation (kept as a separate tool/workflow).
  - Negotiation strategy, SPA redlining, or legal drafting.

## What We’re Building

**Databook Analyst** is a custom assistant that takes natural-language requests (e.g., “Build a P&L trending tab from the TB and flag major deviations”), and operates in two gated phases:

1. **Plan Mode (default):** Produces a Markdown “wireframe” of the intended databook changes (tabs, tables, columns, calculations, tie-outs, and where questions will appear). It may ask clarifying questions and propose assumptions. **It must not create or modify any Excel artifact in this mode.**

2. **Execute Mode (only after “Proceed”):** Generates the final Excel databook output. If the user uploaded an existing databook, it edits that workbook; otherwise, it starts from the template databook stored in knowledge.

## User Stories

### User Story 1: Ingest and format data into a databook

- As an FDD associate, I want to upload a data room export and get it reshaped into the databook’s expected schema and formatting so I can immediately start analysis without manual cleanup.

### User Story 2: Build a standard analysis tab reliably

- As an FDD associate, I want to request a standard analysis (like P&L trending) and have the assistant create/update the tab in the firm’s expected layout so the output is consistent across teams.

### User Story 3: Capture questions/flags in the workbook

- As an FDD senior, I want potential issues and follow-ups embedded inline next to the relevant rows so reviewers can see “what’s wrong and where” while reviewing the databook.

## Requirements

### Plan Gate and Modes

- [ ] The assistant operates in **Plan Mode by default** and stays there until the user explicitly replies **“Proceed”**.
- [ ] In Plan Mode, the assistant:
  - [ ] Produces a clear Markdown wireframe of workbook changes (new/modified tabs, table layouts, key formulas, and tie-outs).
  - [ ] Lists required inputs and assumptions, and asks targeted questions only when needed to avoid rework.
  - [ ] Only prompts for **“Proceed”** once it believes the plan is executable end-to-end.

- [ ] In Execute Mode, the assistant produces the Excel output exactly as planned and summarizes what was created/changed.

### Template and Workbook Editing

- [ ] The assistant supports two execution paths:
  - [ ] **Edit Existing:** If the user uploads a databook, add incremental tabs and/or modify existing tabs as per the approved plan.
  - [ ] **Start From Template:** If no databook is uploaded, generate a new databook using the template stored in knowledge.

- [ ] Formatting is **strict**: outputs must conform to the template’s structure and style conventions.

### Task Routing and Modules

- [ ] The assistant accepts **natural language** tasks (no command/menu required).
- [ ] The assistant routes each request to:
  - [ ] A **built-in analysis module** (when the task matches known patterns), or
  - [ ] A **generalized ingestion/analysis routine** (when the task is novel).

- [ ] The assistant is designed to expand over time via additional knowledge/modules without changing the core workflow.

### Data Ingestion and Normalization

- [ ] The assistant can ingest common tabular formats and normalize:
  - [ ] Dates (monthly/weekly/daily), currencies, units ($, $’000), and sign conventions.
  - [ ] Column naming, required keys, and consistent dimensional rollups.
  - [ ] Duplicates, missing values, and obvious structural issues (with flags/questions when material).

### Standard Databook Analyses

- [ ] MVP includes at least:
  - [ ] **P&L trending / variance analysis** (driver identification + outlier flagging).
  - [ ] **Sales & margin analysis** (customer/product/channel cuts, mix, pricing/margin walk where applicable).
  - [ ] **Payroll / headcount analysis** (roster normalization, trend/cost per head where feasible).

- [ ] Outputs include short, factual “insight bullets” (no diligence request drafting).

### Questions/Flags in Workbook

- [ ] The assistant writes questions/flags **inline** in a dedicated cell/column to the **right of the relevant output row** (e.g., “Questions / Notes”).
- [ ] Questions/flags are specific, refer to the precise row/item, and avoid generic statements.

### Validation and Tie-outs

- [ ] The assistant performs light reconciliation checks appropriate to the task (e.g., totals match source, subtotals tie, period sums tie to annual totals).
- [ ] If checks fail, it must:
  - [ ] Flag the issue inline and/or at the table header level, and
  - [ ] Propose the minimal corrective action (mapping fix, filter change, sign flip, missing data).

## How It Works

### Interaction model

- **Input:** User provides a task + relevant source files (data room exports and optionally an existing databook).
- **Plan Mode output:**
  - Target workbook path (edit existing vs start-from-template).
  - Tabs to create/update, and a table wireframe per tab.
  - Source-to-target mapping (key columns + transformations).
  - Key calculations (formulas/pivots), tie-outs, and where inline questions will appear.
  - A short “execution checklist” the user can sanity-check.

- **Proceed gate:** Only after the user replies **Proceed** does the assistant execute.
- **Execute Mode output:** A generated/updated Excel workbook and a concise change summary.

### Module routing concept

- The assistant classifies the request into a canonical task type (e.g., “P&L trend”, “Sales & margin”, “Payroll”) based on keywords + inferred intent.
- For built-in tasks, it follows the module’s prescribed output layout and checks.
- For novel tasks (e.g., lease schedule processing), it follows generalized principles:
  - Define target schema → map source fields → normalize units/dates → produce clean table → add checks → flag issues/questions.

### Knowledge assets (expected)

- **Databook template** (Excel) used as the authoritative style/layout reference.
- **Module guides** for standard analyses (layout, required inputs, calculations, tie-outs, and question patterns).
- **General ingestion principles** for non-module tasks.

## Acceptance Criteria

- Given a user request, when the assistant responds in **Plan Mode**, then it provides a concrete wireframe + mappings + checks and does **not** create/modify any Excel artifact.
- Given an approved plan, when the user replies **“Proceed”**, then the assistant generates/edits the databook accordingly and produces an Excel output matching the template’s formatting conventions.
- Given a standard analysis request (e.g., P&L trending), when executed, then the assistant produces the expected tab structure, includes light tie-outs, and writes specific inline questions/flags where anomalies exist.
- Given a user-uploaded databook, when executing, then the assistant updates that workbook (rather than producing a separate unrelated format) unless the user explicitly requests otherwise.

## Roadmap

- Additional modules (working capital, deferred revenue, bookings/backlog, cohort analyses, inventory, lease schedules, debt schedules).
- A reviewer-friendly “Issues index” tab that aggregates all inline questions/flags (while keeping inline notes as the primary source of truth).
- Auto-detection of common source files (TB vs GL vs subledger) and proactive mapping suggestions.
- Incremental refresh mode (re-run a module with new data while preserving reviewer annotations).

## Open Questions

- What is the canonical “Questions/Notes” column header and required placement for each standard tab in the KPMG template?
- Which exact “standard module” layouts should be treated as the non-negotiable MVP set (based on your example databooks)?
- Should “Proceed” be case-sensitive / exact-match, or should variants like “go”, “run it”, “execute” be accepted?
