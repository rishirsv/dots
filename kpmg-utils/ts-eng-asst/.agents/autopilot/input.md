# Plan: FDD Scope Mining & Template Expansion

## Objective

Mine 22 real-world SOW documents across 11 industries to build a structured library of Financial Due Diligence (FDD) scope content. Use this library to expand the SOW template with industry-specific, deterministic scope generation.

---

## File Inventory

| # | Industry | Files | Format |
|---|---|---|---|
| 1 | Construction | 1 | docx |
| 2 | Eyecare | 2 | docx |
| 3 | Healthcare | 2 | docx |
| 4 | HVAC | 3 | docx |
| 5 | Manufacturing | 3 docx + 1 pdf | mixed |
| 6 | Prof. Services | 2 | docx |
| 7 | Real estate | 1 | docx |
| 8 | Service | 1 docx + 2 pdf | mixed |
| 9 | Supermarket | 1 | docx |
| 10 | Tech | 2 | docx |
| 11 | Transportation | 1 | docx |

**Total: 19 docx + 3 pdf = 22 files, 11 industries**

---

## Approach: Hybrid (Script + Industry Agents)

### Why hybrid?

The mining has two distinct parts with different needs:

1. **Text extraction** (mechanical) — reading binary `.docx` and `.pdf` files into plain text. No intelligence needed. A Python script does this in seconds with zero context budget.

2. **Semantic analysis** (requires understanding) — categorizing sections, recognizing equivalent headings across documents, identifying industry-specific vs. common content. This is where LLM agents add value.

### Why group by industry (not per-file)?

- **Context efficiency**: Max 4 files per industry. Even the largest industry (Manufacturing, 4 files) fits easily in a single context window.
- **Industry coherence**: An agent seeing all files for one industry can identify patterns and deduplicate across that vertical.
- **Manageable parallelism**: 11 agents (one per industry) is a sweet spot — enough parallelism to be fast, not so many that overhead dominates.
- **Per-file would be wasteful**: 7 of 11 industries have only 1-2 files. A per-file agent for a single document adds setup overhead for minimal content.

---

## Phase 1: Text Extraction (Script)

### Task

Write a single Python script (`scripts/extract-sample-text.py`) that:

1. Walks `dist/el-samples/` recursively
2. For each `.docx`: extracts paragraphs + table content using `python-docx`
3. For each `.pdf`: extracts text using `pdfplumber` (or `PyPDF2`)
4. Saves output to `dist/el-samples-text/{industry}/{filename}.txt`
5. Prints a summary: files processed, total paragraphs, any errors

### Output structure

```
dist/el-samples-text/
  Construction/
    Project Great White - Draft Scope of Work.txt
  Eyecare/
    Axis - Eng Procedures.txt
    Project View - SOW 2022-04-12.txt
  Healthcare/
    ...
  (etc.)
```

### Why a script (not agents)?

- Binary file extraction is deterministic — no LLM judgment needed
- Runs in ~5 seconds for all 22 files
- Produces clean text files that agents can read directly
- Uses zero context budget

---

## Phase 2: Industry Mining (11 Agents)

### Agent Assignment

Each agent receives ONE industry and ALL extracted text files for that industry.

| Agent | Industry | Files | Notes |
|---|---|---|---|
| Agent 1 | Construction | 1 | |
| Agent 2 | Eyecare | 2 | |
| Agent 3 | Healthcare | 2 | |
| Agent 4 | HVAC | 3 | |
| Agent 5 | Manufacturing | 4 | Includes 1 PDF (engagement letter, not SOW) |
| Agent 6 | Prof. Services | 2 | Engagement letters, not SOWs — different structure |
| Agent 7 | Real estate | 1 | Includes tax DD + financial DD sections |
| Agent 8 | Service | 3 | Includes 2 PDFs |
| Agent 9 | Supermarket | 1 | |
| Agent 10 | Tech | 2 | |
| Agent 11 | Transportation | 1 | |

### Agent Prompt (Template)

Each agent will receive the following prompt, customized with its industry name and file list:

---

> **Role**: You are a Financial Due Diligence (FDD) scope analyst.
>
> **Context**: We are building a custom GPT that generates Statements of Work for KPMG Transaction Services. The GPT needs to produce industry-specific FDD scope sections deterministically. To do this, we are mining real SOW documents to build a structured library of scope content organized by section and industry.
>
> **Your industry**: `{INDUSTRY_NAME}`
>
> **Your files** (plain text extracted from Word/PDF originals):
> - `{FILE_1_PATH}`
> - `{FILE_2_PATH}` (if applicable)
> - ...
>
> **Your task**: Read every file assigned to you and produce a structured JSON catalog of the FDD scope content. For each document, extract:
>
> 1. **Scope period statement** — The fiscal years and trailing periods covered (e.g., "FY22, FY23, and TTM ending June 2024")
>
> 2. **Phases** — If the SOW is split into phases (e.g., Phase 1 pre-bid, Phase 2 post-bid), note each phase and what it covers
>
> 3. **Sections** — Every major section heading. Common ones include:
>    - Business overview / understanding
>    - Financial reporting & accounting policies
>    - Quality of earnings analysis
>    - Revenue and profitability / Revenue analysis
>    - Operating expenses
>    - Working capital analysis
>    - Accounts receivable
>    - Accounts payable & accrued liabilities
>    - Net debt & other liabilities
>    - Capital expenditures
>    - (Industry-specific sections beyond these)
>
> 4. **Sub-bullets per section** — The specific procedures/analyses listed under each section. Copy these verbatim from the document. These are the industry-specific details we need.
>
> 5. **Industry-specific language** — Flag any bullets, sections, or terminology that are clearly specific to `{INDUSTRY_NAME}` and would NOT appear in a generic FDD scope. Examples:
>    - Healthcare: "payor mix", "de novo expansion", "CPT codes"
>    - Tech: "ARR", "SaaS KPIs", "deferred revenue recognition"
>    - Manufacturing: "production utilization", "scrap rates", "raw material pricing"
>
> 6. **Workstream identification** — If the SOW covers multiple workstreams (e.g., financial DD, tax DD, IT DD, HR DD), identify them and note which sections belong to which workstream. We are focused on **financial due diligence** only.
>
> **Output format**: Write a JSON file to `docs/mining/{INDUSTRY_SLUG}.json` with this structure:
>
> ```json
> {
>   "industry": "{INDUSTRY_NAME}",
>   "files_analyzed": ["{FILE_1}", "{FILE_2}"],
>   "scope_periods": [
>     {"file": "{FILE_1}", "period": "FY22, FY23, TTM ending Q2 2024"}
>   ],
>   "phases": [
>     {"file": "{FILE_1}", "phase": "Phase 1", "description": "Pre-bid support..."}
>   ],
>   "sections": [
>     {
>       "heading": "Business overview",
>       "normalized_heading": "business_overview",
>       "appears_in": ["{FILE_1}", "{FILE_2}"],
>       "is_industry_specific": false,
>       "bullets": [
>         {"text": "History, organization structure...", "source": "{FILE_1}"},
>         {"text": "Services offered; trends in payor mix", "source": "{FILE_2}"}
>       ]
>     }
>   ],
>   "industry_specific_terms": ["payor mix", "de novo expansion", "CPT codes"],
>   "workstreams_found": ["Financial DD", "Tax DD"],
>   "notes": "Any observations about this industry's SOW patterns"
> }
> ```
>
> **Rules**:
> - Copy bullet text verbatim — do not rewrite or summarize
> - If two files in the same industry have the same section, include bullets from BOTH and tag each with its source
> - Normalize section headings to snake_case for the `normalized_heading` field
> - Only extract FDD content (skip tax DD, IT DD, HR DD sections, but note they exist in `workstreams_found`)
> - If a file is an engagement letter (not a SOW/scope), note this in `notes` and extract whatever scope content exists in the appendices

---

### Execution

Run all 11 agents in parallel. Each writes its output to `docs/mining/{industry_slug}.json`.

---

## Phase 3: Synthesis (Single Agent)

After all 11 mining agents complete, run one synthesis agent that:

1. Reads all 11 JSON files from `docs/mining/`
2. Identifies the **common skeleton** — sections that appear in 8+ of 11 industries
3. Identifies **industry-specific modules** — bullets/sections unique to each vertical
4. Produces a unified library file: `reference/fdd_scope_library.json`

### Output structure for the library

```json
{
  "common_skeleton": [
    {
      "heading": "Business overview",
      "normalized_heading": "business_overview",
      "default_bullets": [
        "History, organizational structure, and management reporting relationships",
        "Range of products and services",
        "Range of customer segments and regions served",
        "Financial reporting framework and information systems",
        "Key accounting policies including revenue recognition, inventory valuation, etc."
      ]
    }
  ],
  "industry_modules": {
    "healthcare": {
      "business_overview": [
        "Trends in payor mix",
        "De novo expansion",
        "Financing arrangements with patients, if applicable"
      ],
      "revenue_analysis": [
        "Center-level financial information including key operating metrics",
        "Bridge revenue for same location vs. de novo center",
        "Revenue by CPT code"
      ]
    },
    "tech": {
      "quality_of_earnings": [
        "Capitalized R&D and other internal costs",
        "Commissions and contract assets"
      ],
      "revenue_analysis": [
        "ARR and associated KPIs (upsell, downsell, churn, ARR per license/logo)",
        "Deferred revenue recognition methodology"
      ]
    }
  }
}
```

---

## Phase 4: Template Expansion

Using the library from Phase 3:

1. Add a **"Scope of Work: Financial Due Diligence"** section to `reference/sow-template.docx`
2. Use section-level placeholders:
   - `{{FDD_SCOPE_PERIOD}}` — fiscal year / TTM statement
   - `{{FDD_BUSINESS_OVERVIEW}}`
   - `{{FDD_ACCOUNTING_POLICIES}}`
   - `{{FDD_QUALITY_OF_EARNINGS}}`
   - `{{FDD_REVENUE_ANALYSIS}}`
   - `{{FDD_OPERATING_EXPENSES}}`
   - `{{FDD_WORKING_CAPITAL}}`
   - `{{FDD_AR_ANALYSIS}}`
   - `{{FDD_AP_ANALYSIS}}`
   - `{{FDD_NET_DEBT}}`
   - `{{FDD_CAPEX}}`
   - `{{FDD_ADDITIONAL_SCOPE}}` — industry-specific extras
3. Update `reference/template_schema.py` with the new placeholders
4. Write an assembly function in `helper_functions.py` that merges common skeleton + industry module into formatted scope text

---

## Phase 5: Validation

1. Generate a test SOW for each of the 11 industries
2. Compare output against the real sample(s) for that industry
3. Measure coverage: what % of the real SOW's bullets appear in the generated output?
4. Iterate on the library to close gaps

---

## Dependency Graph

```
Phase 1 (script)
    |
    v
Phase 2 (11 parallel agents)
    |
    v
Phase 3 (synthesis agent)
    |
    v
Phase 4 (template expansion)
    |
    v
Phase 5 (validation)
```

Phase 1 must complete before Phase 2.
Phase 2 (all 11) must complete before Phase 3.
Phases 4 and 5 are sequential after Phase 3.
