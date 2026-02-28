# FDD Redline Reviewer GPT

## TL;DR
- **Problem:** Senior review of 50-60 page diligence decks is still a manual "red pen" process. PowerPoint comments don't capture layout/alignment issues well.
- **Solution:**
  - A Custom GPT that takes a **PPTX or PDF** FDD report and returns a **structured issue log** (markdown + CSV) as the primary output.
  - Optionally produces a **marked-up PDF** with a right-margin "review lane" of comment callouts.
  - **Hard constraint:** comment-only. No rewrites or edits to the original content.

## Scope
- **In:**
  - Input: **PPTX or PDF** of an FDD report.
  - Output: (1) issue log memo (md + csv) as primary, (2) PNG screenshots for visual review as secondary, (3) optional marked-up PDF (nice-to-have).
  - Review categories: **Grammar**, **Style**, **Calculations**, **Alignment**, **Placeholders**, **Cross-references**.
  - Hybrid extraction: text extraction for content checks, selective PNG rendering for visual checks.
  - Visual review via rendered slide images for layout/alignment checks.
  - Deduping + per-page callout caps.
- **Out:**
  - Editing/re-writing the report (no replacement text, no auto-fixes).
  - Producing/rewriting PPTX or adding PowerPoint-native comments.
  - OCR-first support for scanned PDFs (can warn/limit scope, but not a v1 requirement).
  - Deep accounting judgement (e.g., proposing QoE adjustments); focus is mechanical QA + coherence.

## What We're Building
A Custom GPT named **FDD Redline** that emulates a senior manager/director markup pass:

1. User uploads an FDD report (**PPTX or PDF**).
2. The GPT extracts text from the document.
3. The GPT **selectively** renders slides to PNG (only pages needing visual review).
4. The GPT performs a structured review, processing all pages in one pass.
5. The GPT outputs:
   - **issue_log.md / issue_log.csv** (primary): findings organized by page number, with dual IDs (stable_id for traceability, row_id for readability).
   - **PNG screenshots** (secondary): slides flagged for visual review by GPT.
   - **marked_up.pdf** (optional, nice-to-have): composed from page PNGs + margin callouts.

The "feel" should match a printed-deck red-pen review: fast to scan, hard to miss, and easy for a team to action slide-by-slide.

## User Stories
### User Story 1: Senior reviewer pass
- As a senior reviewer, I want a structured issue log with findings so that I can quickly confirm the deck is sign-off ready without manually hunting issues.

### User Story 2: Team execution
- As a team member, I want a structured issue log with IDs so that fixes can be tracked, assigned, and rechecked efficiently.

### User Story 3: Focused passes
- As a reviewer, I want to run "alignment only" or "numeric drift only" so that I can focus on the highest-impact checks when time is tight.

### User Story 4: Visual review
- As a reviewer, I want PNG screenshots of flagged slides so that I can see layout/alignment issues directly on the slide.

## Requirements

### Input Handling
- [ ] **PPTX/PDF agnostic input**: Accept both PPTX and PDF.
- [ ] **Hybrid extraction**: Extract text for content checks; selectively render to PNG for visual review.
- [ ] **Full deck processing**: Process all pages in one pass (no batching or progress updates).

### Review Behavior
- [ ] **Comment-only**: The GPT must not rewrite or modify report text; it only produces comments.
- [ ] **Typed findings**: Every comment must be tagged with one of **Grammar**, **Style**, **Calculations**, **Alignment**, **Placeholders**, **Cross-references**.
- [ ] **Priority ranking**: Every finding must be ranked **High**, **Medium**, or **Low** priority. All findings are actionable.
- [ ] **Deduping + global issues**: Repeated issues (e.g., repeated misspelling) are presented once as a global note with example pages.
- [ ] **Per-page density control**: Cap callouts per page in marked-up PDF (default: 6) while keeping all findings in the issue log.
- [ ] **Terminology resolution**: When terminology variants exist, recommend the majority variant as canonical. Semantically distinct terms (e.g., "EBITDA" vs "Adjusted EBITDA") must not be flagged as inconsistent variants.

### Text Extraction & Visual Review
- [ ] **Text extraction**: Extract text from PPTX shapes/text frames or PDF with bounding boxes.
- [ ] **Selective PNG rendering**: Render only pages that need visual review (not all pages - expensive on 60-page decks).
- [ ] **Visual review triggers** (render to PNG when ANY of these apply):
  1. Text extraction is sparse (word count < threshold)
  2. Page contains tables or charts
  3. Page is a "layout risk" page (dense numeric tables, multi-column exhibits, QofE schedules)
  4. Deterministic checks flag "needs visual confirmation"
  5. User explicitly requests alignment/layout review
- [ ] **Visual review flag**: Flag pages reviewed visually-only in the issue log.

### Outputs
- [ ] **Issue log outputs (primary)**: Always produce markdown + CSV issue logs with the following structure:
  - Organized by page number (ascending)
  - Columns: row_id, stable_id, Page, Category, Priority (H/M/L), Comment
  - **Dual ID system**:
    - `row_id`: Sequential (001, 002...) for human readability in current run
    - `stable_id`: Deterministic hash-based ID (e.g., `P-a3f2`, `G-7c1b`) for rerun traceability
- [ ] **PNG screenshots (secondary)**: Render flagged slides to PNG for GPT visual review of alignment/layout issues.
- [ ] **Marked-up PDF (optional, nice-to-have)**: Compose from page PNGs + margin callouts.

### Configuration
- [ ] **Configurable rules**: Placeholder patterns, terminology groups, and a curated misspelling list live in editable knowledge/config files.
- [ ] **System prompt limit**: System prompt must be ≤ 8,000 characters.

## Issue Log Format

### Example Output

| row_id | stable_id | Page | Category | Priority | Comment |
|--------|-----------|------|----------|----------|---------|
| 001 | P-a3f2 | 3 | Placeholders | H | "TBD" found in Revenue section header |
| 002 | G-7c1b | 3 | Grammar | L | "the the" repeated word |
| 003 | C-e4d9 | 5 | Calculations | H | EBITDA shows $12.3M here but $12.1M on page 2 |
| 004 | S-2b8a | 7 | Style | M | "QoE" used here but "QofE" on pages 2, 4 (recommend "QoE" - majority) |
| 005 | A-f1c3 | 8 | Alignment | M | Revenue column misaligned with header |
| 006 | X-9d7e | 12 | Cross-references | H | "See Appendix B" but no Appendix B exists |

### ID System
- **row_id**: Sequential for the current run (001, 002...). Changes if findings are added/removed.
- **stable_id**: Hash of (page, category, comment_normalized). Stable across reruns for the same finding.

### Priority Guidelines
- **High**: Placeholders, calculation discrepancies, broken cross-references, critical typos in headlines
- **Medium**: Terminology inconsistencies, alignment issues, style violations
- **Low**: Minor typos in body text, formatting nits

## Acceptance Criteria
- Given a PPTX or PDF diligence report, when the GPT runs a **Full** pass, then it produces:
  - An **issue_log.md** and **issue_log.csv** organized by page number with ID, Page, Category, Priority, Comment columns.
  - PNG screenshots of slides flagged for visual review.
- Given a report containing placeholders (e.g., "TBD", "[•]"), when reviewed, then:
  - Placeholders are flagged with type **Placeholders**, priority **High**, and anchored to the correct page.
- Given repeated terminology variants (e.g., "QoE" vs "QofE"), when reviewed, then:
  - A single global **Style** finding is created noting the variants, with the majority variant recommended as canonical.
- Given semantically distinct terms (e.g., "EBITDA" vs "Adjusted EBITDA"), when reviewed, then:
  - These are NOT flagged as inconsistent variants.
- Given a report with repeated anchor metrics on multiple pages, when values disagree beyond tolerance, then:
  - A **Calculations** finding with priority **High** is produced describing the drift and listing example pages.
- Given a page with tables, when reviewed, then:
  - The page is rendered to PNG and reviewed visually, with "Reviewed visually" flag in the issue log.
- Given a scanned/image-only PDF where extraction fails, then:
  - The GPT states extraction is unreliable, performs visual-only review, and flags affected pages.

## Open Questions
- What default "house style" should be enforced (terminology, units, rounding) per service line/team?
- Should we generate an additional "Questions for Management" extract (derived from findings) as a v2 feature?

---

## Appendix: Insights from Report Reviews

The following structural insights were captured from reviewing 5 real FDD reports (Project North, Project Skyrocket, Project Vortex, Project Z Factbook, Project X Buy-side FDD).

### Key Findings for Placeholder Detection

1. **Template placeholders are common:** Reports frequently contain unfilled template elements like "Call-out box.", hierarchy level names ("Second level", "Third level"), and layout placeholders ("Left", "Right", "50-50 text box").

2. **Bracketed vs unbracketed styles:** Reports use both `[DATE]` (bracketed) and `DATE` (unbracketed) placeholder styles. The redliner must detect both patterns.

3. **Entity-specific placeholders:** Buy-side reports use numbered entity placeholders (`[Customer 1]`, `[Bank 2]`, `[Shareholder 3]`) for anonymization.

4. **Case sensitivity matters:** Some reports use `[date]` (lowercase) vs `[DATE]` (uppercase). Both variants must be detected.

5. **Instruction text as placeholders:** Text like "To include:", "Update:", "[Waiting on management responses.]" indicates incomplete sections.

### Key Findings for Text Extraction

1. **Invisible characters:** Some reports use invisible Unicode characters (e.g., `‎`) before cross-references and navigation links. This may affect text extraction and pattern matching.

2. **Find-replace corruption:** Report 4 showed evidence of find-replace operations corrupting words (e.g., "a[PRODUCT 1]ordingly" instead of "accordingly"). The redliner should flag such artifacts.

3. **DRAFT watermark concatenation:** Title slides often show concatenated text like "Project NorthDRAFT" due to text extraction from overlapping elements.

### Key Findings for Cross-Reference Patterns

1. **Adjustment references:** Multiple formats exist:
   - `QofE adjustment #X`, `QoE adj. #X`, `adjustment #X`
   - `ref. QoE #X`, `QofE due diligence adjustment #X`

2. **Page/section references:**
   - `Refer to page X`, `See page X`, `p. X-Y`
   - `See Appendix X`, `Refer to Appendix`
   - `See OC #X` (Other Considerations)
   - `refer overleaf`, `see following page`

3. **Cross-document references:** Reports reference other deliverables like "sell-side due diligence report" or "VDD databook".

### Key Findings for Table/Layout Structures

1. **Section numbering schemes:**
   - Main sections: `01`, `02`, `03` or `1.`, `2.`, `3.`
   - Sub-sections: `1.1`, `1.2`, `2.1` format
   - Pagination in headers: `(1/3)`, `(2/3)`, `(1/5)` format

2. **Financial table formats:**
   - QofE schedules with FY columns (FY21, FY22, FY23, TTM)
   - Factbooks with dense multi-period tables
   - Numbered adjustment trails

3. **Source citation formats:**
   - `Source: Management provided information, KPMG analysis`
   - `Source: [filename]; KPMG analysis`
   - `Source: Management information.`
   - `Source: […]` (placeholder)

4. **Note/footnote formats:**
   - `Note:`, `Note 1:`, `Note 2:`
   - `(a)`, `(b)`, `(c)` footnote markers
   - Circled numbers ①, ②, ③, ④

### Report Format Variations

| Report Type | Characteristics |
|-------------|-----------------|
| **Buy-side FDD** | Narrative-heavy, finding categorization (Value/SPA/Other), detailed commentary |
| **Sell-side Factbook** | Data-dense, extensive financial tables, value creation focus |
| **QofE Report** | Adjustment schedules, earnings quality analysis, due diligence trails |

### Industry-Specific Terminology

Reports span multiple industries with distinct terminology:
- **Fintech/Payments:** P2P, B2B, POS, ATM, EMV
- **Insurance:** P&C, GB, MGA, CPC, BMS
- **SaaS:** ARR, MRR, churn, subscription metrics
- **Automotive:** SOP, EOP, Tier 1/2, SMT, PCB
- **UK context:** FRS102, HMRC, P11D, Bounce Bank Loan, VAT deferral

These should be added to the terminology groups in the configuration.
