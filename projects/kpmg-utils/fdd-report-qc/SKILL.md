---
name: fdd-report-qc
description: |
  Financial due diligence report quality-control reviewer. Reviews client-ready FDD reports,
  report sections, and diligence exhibits for: (1) Numeric tie-outs across sections,
  (2) evidence-versus-conclusion support, (3) FDD writing standards, and
  (4) report assembly and document control. Use when asked to review, check, QC,
  or release-gate an FDD report, QoE section, NWC section, net debt section,
  executive summary, or diligence exhibit before delivery.
---

# FDD Report QC

Perform comprehensive QC on financial due diligence reports across four dimensions.

## Prerequisites

Convert report inputs to Markdown before checking:
```bash
python -m markitdown report.docx > report.md
```

Accepted inputs:
- Markdown reports
- Markdown-converted DOCX or PDF reports
- Report excerpts or diligence exhibit excerpts pasted directly into the prompt

Reviewer behavior:
- This is a reviewer-only skill. Return findings, rationale, and release-readiness guidance.
- Do not draft replacement report sections unless the user explicitly asks for follow-on rewrite help.
- Do not invent support, normalize conflicting numbers silently, or infer missing evidence.

## Check Workflow

### 1. Numeric Tie-Outs

For full reports or long excerpts, run the numeric extraction helper first:
```bash
python scripts/extract_numbers.py report.md --check
```

Verify:
- Repeated figures match across executive summary, historical financial performance, QoE, NWC, net debt, balance sheet, and exhibits
- Bridge logic is internally consistent across revenue, EBITDA, adjustments, working capital, and debt items
- Calculations are directionally and arithmetically coherent where the report shows totals, percentages, movements, or deltas
- Units are consistent across the report (for example `$m` vs `$mm`, `%` vs `bps`)
- Time periods are aligned (for example FY, LTM, trailing twelve months, or stub periods are not mixed without explanation)
- Key figures are not reused with conflicting definitions

Flag pattern:
```
ISSUE TYPE: Factual mismatch
SECTION: Executive summary / QoE and earnings adjustments
ISSUE: EBITDA is shown as $48.5m in the executive summary and $45.8m in the QoE bridge.
WHY IT MATTERS: Conflicting headline figures undermine confidence in the report and may change the implied adjustment story.
RECONCILE: Confirm the final reported EBITDA basis and update all linked references before release.
BLOCKS RELEASE: Yes
```

For short excerpts, perform the same checks manually without requiring the helper output.

### 2. Evidence vs Conclusion

Map every material claim to support:
- Trend statements -> referenced schedules, tables, or clearly stated evidence
- Adjustment conclusions -> stated basis, calculation support, and period relevance
- Management commentary -> attributed source or explicit caveat
- Red-flag statements -> evidence plus impact framing

Flag unsupported or overstated conclusions:
```
ISSUE TYPE: Unsupported conclusion
SECTION: Net working capital
ISSUE: The report states that the target has a stable working-capital profile, but the section does not show the seasonality analysis or the normalization basis needed to support that conclusion.
WHY IT MATTERS: Readers may rely on an unsubstantiated peg conclusion when evaluating purchase-price mechanics.
RECONCILE: Add the supporting analysis, narrow the claim, or mark the conclusion as preliminary.
BLOCKS RELEASE: Yes
```

Also check:
- Evidence-first sequencing: support should come before or with the conclusion
- Overreach: avoid moving from limited facts to broad diligence conclusions
- Unknowns: missing support should be marked as unknown, preliminary, or not disclosed

### 3. FDD Writing Standards

Scan for:
- Imprecise or casual language
- Adjustment wording that blurs fact, judgment, and management assertion
- Overconfident conclusions without caveats
- Inconsistent terminology across sections
- Missing source qualifiers, scope qualifiers, or time-period qualifiers

See [references/fdd-writing-standards.md](references/fdd-writing-standards.md) for preferred phrasing.

Flag pattern:
```
ISSUE TYPE: Terminology inconsistency
SECTION: Executive summary
ISSUE: The report alternates between "adjusted EBITDA", "QoE EBITDA", and "normalized earnings" without defining whether these refer to the same measure.
WHY IT MATTERS: Terminology drift can change the reader's interpretation of the core earnings basis.
RECONCILE: Standardize the defined term and use it consistently throughout the report.
BLOCKS RELEASE: No
```

### 4. Report Assembly and Document Control

Audit the report for:
- **Section coverage**: expected core sections are present when in scope
- **Exhibit references**: tables, appendices, and bridges are referenced consistently in the prose
- **Source labels**: key figures and claims identify their basis or source location
- **Dates and periods**: clear as-of dates, period coverage, and stub-period labeling
- **Number presentation**: consistent units, separators, decimals, and negative-value notation
- **Disclaimers and limitations**: required caveats, limitations, or scope boundaries are present where needed
- **Document-control hygiene**: no stale placeholders, draft notes, unresolved comments, or inconsistent headings

## Output

Present findings using the template in [references/report-format.md](references/report-format.md).

Categorize by severity:
- **Critical**: factual mismatches, unsupported core conclusions, release-blocking document-control issues
- **Important**: inconsistent metrics or periods, missing section coverage, terminology drift
- **Minor**: formatting, labeling, and non-blocking polish issues

End every review with one release-readiness verdict:
- `Ready with minor edits`
- `Needs revision before release`
- `Do not release`

## Canonical FDD Sections

Use these sections as the default review map when the report is broad enough to cover them:
- Executive summary
- Business overview
- Historical financial performance
- QoE and earnings adjustments
- Net working capital
- Net debt
- Balance sheet
- Reporting environment

If a requested review covers only one or two sections, apply the same four-lane QC structure to just those sections.
