# Verbatim Report Extraction Template (All Reports)

Use this template to capture **actual report text only** (no rewriting).

## Non-Negotiable Rules

- Copy text **verbatim** from source report outputs.
- Do **not** summarize, interpret, or normalize wording.
- Keep placeholders like `[ENTITY]`, `[DATE]`, `[X]` if present in source.
- If a section is missing, write: `Not present in source report`.
- Keep original section order where possible.

---

## Canonical Section List (From Full Corpus Review)

Use this as the default top-level order:

1. Executive Summary
2. Key Findings (if present)
3. Business Overview
4. Summary Financials (if present)
5. Profit and Loss Overview / Financial Performance
6. Quality of Earnings
7. Income Statement
8. Balance Sheet
9. Net Working Capital
10. Net Debt (Cash)
11. Cash Flows
12. Related Parties (if present)
13. Reporting Environment (if present)
14. Forecast Trading (if present)
15. Industry Analysis (if present)
16. Quality of Net Assets (if present)
17. Gross Margin by LOB (if present)
18. Appendices

---

## Report Metadata

- `SOURCE_FILE`:
- `REPORT_ID`:
- `SOURCE_PATH`:
- `EXTRACTION_STATUS`:
- `EXTRACTION_DATE`:

## Required Source Evidence

- `SOURCE_TEXT_DIR`: (e.g. `extracted/verification/<report-id>/source-text/pptx` or `.../pdf`)
- `MONTAGE_DIR`: (e.g. `extracted/verification/<report-id>/montage`)
- `SOURCE_ARTIFACTS`:
  - `slide-01.txt` or `page-01.txt` ...
- `OCR_USED`:
  - `true/false`
- `OCR_SLIDES`:
  - `[]` or `[16, 17, 22]`
- `OCR_ARTIFACTS_DIR`: (e.g. `extracted/verification/<report-id>/source-text/ocr`)
- `OCR_RUN_METADATA`: (e.g. `extracted/verification/<report-id>/source-text/ocr/ocr-run.json`)
- `PROVENANCE_QA_JSON`: (e.g. `extracted/verification/<report-id>/qa/provenance.json`)
- `PROVENANCE_STATUS`: (`pass` or `needs_revision`)
- `GATES_QA_JSON`: (e.g. `extracted/verification/<report-id>/qa/gates.json`)
- `GATES_STATUS`: (`pass` or `needs_revision`)
- `SECTION_MAP_JSON`: (e.g. `extracted/verification/<report-id>/mapping/section-map.json`)
- `SECTION_ACCOUNTING_JSON`: (e.g. `extracted/verification/<report-id>/mapping/section-accounting.json`)
- `RENDER_TRACE_JSON`: (e.g. `extracted/verification/<report-id>/render/render-trace.json`)

## Source-to-Extraction Coverage Map

Use this section to prove every extracted item is verbatim-backed by source text.

| Canonical Section   | Source slide/page IDs | Source evidence files          | Extracted reference(s)                               | Notes |
| ------------------- | --------------------- | ------------------------------ | ---------------------------------------------------- | ----- |
| Quality of Earnings | 16,17,18,19,20,21,22  | `slide-16.txt`, `slide-17.txt` | `## Quality of earnings adjustments` list items 1-13 | `[x]` |

If any line in the extracted report is shortened, summarized, or paraphrased, set `Notes` to explain and keep status as `needs_revision` until corrected.

If OCR was used, source artifacts will include an `"[OCR_EXTRACTED_TEXT]"` section; keep those entries for audit only and ensure they are not copied into normal extracted markdown unless source text is proven required.

---

# Executive Summary

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Key Findings

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Business Overview

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>
- <Verbatim Bullet 3>

# Summary Financials

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Profit and Loss Overview / Financial Performance

## Overview

<Verbatim Text>

## Key Drivers

1. <Driver Name>: <Verbatim Text>
2. <Driver Name>: <Verbatim Text>

# Quality of Earnings

## Overview

<Verbatim Text>

## Quality of earnings adjustments

1. <Adjustment Name>: <Verbatim Adjustment Text>
2. <Adjustment Name>: <Verbatim Adjustment Text>
3. <Adjustment Name>: <Verbatim Adjustment Text>

## Other considerations

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Income Statement

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Balance Sheet

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Net Working Capital

## Overview

<Verbatim Text>

## Net working capital adjustments

1. <Adjustment Name>: <Verbatim Adjustment Text>
2. <Adjustment Name>: <Verbatim Adjustment Text>
3. <Adjustment Name>: <Verbatim Adjustment Text>

If adjustment items are only presented in tables/charts and excluded by policy, capture any surrounding explanatory lines and add:
`Table- or chart-based adjustment details were excluded per extraction policy.`

# Net Debt (Cash)

## Overview

<Verbatim Text>

## Net debt / cash adjustments

1. <Adjustment Name>: <Verbatim Adjustment Text>
2. <Adjustment Name>: <Verbatim Adjustment Text>
3. <Adjustment Name>: <Verbatim Adjustment Text>

If debt-like/working-capital adjustments are only in tables/charts, add:
`Table- or chart-based adjustment details were excluded per extraction policy.`

# Cash Flows

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Reporting Environment

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Related Parties

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Industry Analysis

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Forecast Trading

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Quality of Net Assets

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Gross Margin by LOB

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# <Addition Sections as Needed>

- <Verbatim Bullet 1>
- <Verbatim Bullet 2>

# Appendices

## Appendix 1: <Appendix Name>

<Verbatim Text>

## Appendix 2: <Appendix Name>

<Verbatim Text>

## Appendix 3: <Appendix Name>

<Verbatim Text>

## Appendix 4: <Appendix Name>

<Verbatim Text>

Continue numbering for all appendix sections found in source.
