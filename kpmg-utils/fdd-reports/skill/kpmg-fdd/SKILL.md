---
name: kpmg-fdd
description: Write and revise financial due diligence (FDD) reports and Quality of Earnings (QoE) narratives. Use when the user asks for an "FDD report", "executive summary", "business overview", "historical financial performance", "QoE report", "earnings adjustments", "working capital analysis", "net debt / debt-like review", "quality of net assets", "balance sheet deep-dive", "reporting environment (accounting policy)", or wants to turn diligence notes/data room findings into a client-ready report. Not for generating .pptx slide decks (use kpmg-slides).
---

# KPMG FDD Report Writer

This skill produces **client-ready Financial Due Diligence reports** with a repeatable workflow.
**Scope → Outline → Draft → Quality control → Finalize**.

It is designed for:

- **New reports** from scratch (notes, data-room findings, management meeting notes, spreadsheets).
- **Revisions** to an existing draft (tighten narrative, add sections, update numbers, incorporate feedback).
- **QC passes** before delivery (number consistency, evidence coverage, language polish, missing caveats).

Use the reference index for deep guidance: [references/INDEX.md](references/INDEX.md)

## Mode router (intent-first)

Pick the first matching mode and follow its workflow:

1. **qc_only** if the user provides a draft report (Markdown or doc text) or asks to "QC/review/check" a report  
   → Use [references/global-writing-conventions.md](references/global-writing-conventions.md) and relevant section contracts from [references/INDEX.md](references/INDEX.md); optionally run scripts in `scripts/`.

2. **section_rewrite** if the user says "update", "revise", "tighten", "rewrite", "incorporate feedback" on an existing section  
   → Use the same structure as the existing draft; change only what’s requested; preserve numbering/headings.

3. **section_only** if the user asks for one or more sections only  
   → Draft only the requested sections and use canonical section names from [references/INDEX.md](references/INDEX.md).

4. **exhibit_only** if the user asks for a single table/bridge/exhibit narrative only  
   → If they ask for an actual PowerPoint slide, route to `kpmg-slides`.

5. **full_report** otherwise run the Report Workflow below to draft a full report.

## Report Workflow

Use this workflow for `full_report`. For other intents above, execute the targeted output directly, then run QC as needed.

### Step 1: Ingest context

1. Identify all source materials (Excel, CSV, PDF reports, Word documents, meeting notes/transcriptions, user provided guidance and text).
2. Extract relevant data points from each source.
3. If not provided, ask the user **at most two** questions with multiple choice options to determine what the scope of the task. Consider:

- Which request intent is needed (`full_report`, `section_only`, `section_rewrite`, `qc_only`, `exhibit_only`).
- Which report sections need to be written.
- What workstreams are relevant: Executive summary, Business overview, Historical / financial performance, QoE, Net working capital, Net debt and debt-like (default core set), plus Quality of net assets, Balance sheet, and Reporting environment when in scope.

### Step 2: Produce an outline before drafting

Create a concise 3-7 bullet point outline that covers:

- Target company, deal context, period(s) covered.
- Sections to include (use canonical section names in [references/INDEX.md](references/INDEX.md)).
- For each major section: the **key question**, expected **evidence**, and likely **exhibits** (table/chart).

Stop after the outline unless the user says “go ahead” or “skip the outline”.

### Step 3: Draft the report using section contracts

Draft each section using section contracts and global conventions:

- Writing and defensibility standards: [references/global-writing-conventions.md](references/global-writing-conventions.md)
- Section contracts (module guidance): [references/INDEX.md](references/INDEX.md)
- Exhibit structures and formatting expectations are defined inside each section contract.

CRITICAL:

- Do not invent numbers. If data is missing, state what is missing and add it to the request list. Use placeholders such as: $[x] for amounts, [Date]
- For every material quantitative claim, include a source line or a clear basis (e.g., “management schedule”, “trial balance extract”).

### Step 4: Run quality control before finalizing

Apply QC across:

- **Number consistency** (units, periods, repeated metrics).
- **Evidence–narrative alignment** (claims supported by exhibits).
- **Balanced tone** (risks not minimized; uncertainties labeled).
- Missing information is handled with inline placeholders and stated impact where relevant.

Use: [references/global-writing-conventions.md](references/global-writing-conventions.md) plus the applicable section contract from [references/INDEX.md](references/INDEX.md).

Optional scripts:

- `python3 scripts/check_report_structure.py --in report.md`
- `python3 scripts/extract_numbers.py --in report.md --out numbers.json`

### Step 5: Finalize output format

Default output formats:

- **Markdown** for fast review and iteration.
- **DOCX** for client delivery if the environment has the `docx` skill available (recommended).

When producing DOCX:

- Use consistent heading styles and a table of contents.
- Embed exhibits as tables (and images if you have charts).
- Name files: `<Company>_FDD_Report_<YYYY-MM-DD>.docx`

## Output contract

When delivering a draft or revision, always include:

- What you produced (draft / revised sections / QC findings)
- What changed (if revision)
- What is still missing (placeholders still present + evidence gaps)
- The file(s) produced and where they are saved

## Key references

Start here: [references/INDEX.md](references/INDEX.md)
