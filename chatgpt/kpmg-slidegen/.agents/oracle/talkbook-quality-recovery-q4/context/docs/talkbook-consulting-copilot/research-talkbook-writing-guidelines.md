# Research: Talkbook Writing Guidelines (Project North Case Study)

## Research Questions

- Which writing behaviors make Project North dense yet readable, and which of those are transferable to general consulting reports?
- How should we encode slide-writing guidance by archetype so assistants produce comprehensive, evidence-first drafts?
- What tone, voice, word choice, and sentence structures are repeatedly used in effective diligence-style writing?
- How are bullets, tables, and charts combined across sections, and when should each element be used?
- What instruction-level updates are required in Talkbook so archetype selection is mandatory before drafting?
- How do we preserve advisory flexibility (non-blocking) while improving consistency and depth?

## Summary

Project North shows a repeatable writing system: message-led titles, quantified claims, evidence-dense tables, and narrative interpretation tied directly to operating implications. It is not a topic template to copy; it is a composition method that can be transferred to broader consulting contexts. The transferable core is a claim-evidence-implication loop with explicit source traceability and section-level rhythm (overview -> deep dive -> synthesis -> appendix evidence). For Talkbook V1, the best implementation path is a hybrid archetype library (core consulting plus finance/deal-depth module), mandatory archetype-first drafting workflow, and advisory quality rubric.

## Corpus And Method

- Primary corpus:
  - `outputs/project-north/Project North_(Jun-24) RF Draft report_21-Aug-24 vS.pdf`
  - `outputs/project-north/png/*.png`
  - `outputs/project-north/montage.png`
- Scope: 80 slides analyzed.
- Extraction approach:
  - `pdftotext` for line-level and table-level text extraction.
  - `pdftohtml -xml` for title and structure heuristics.
  - Visual sampling of representative slides for layout and readability behavior.

## Section-Level Findings

### 1) Macro structure and narrative pacing

- Section dividers anchor reading cadence and orient stakeholders across long reports.
- Analytical sections rely on repeated templates (e.g., QofE and NWC walkthrough patterns) that reduce interpretation friction.
- Appendix sections provide reconciliation proof, increasing confidence in earlier claims.

### 2) Writing style and tone

- Style is analytical and direct, with low rhetorical flourish.
- Voice favors business causality (`driven by`, `reflects`, `represents`, `normalizes`, `impact of`).
- Claims are often quantified in headers or first paragraph lines.
- Even dense slides keep semantic chunking through subheaders and short lead labels.

### 3) Word choice patterns

Frequent high-value words in analytical content (excluding legal/footer noise):

- `revenue`, `adjustments`, `adjusted`, `pro forma`, `services`, `expense`, `net`, `financial`, `ebitda`, `capital`, `settlement`, `liabilities`, `impact`, `run-rate`, `working`, `qofe`.

Interpretation: strong noun-driven financial/operational vocabulary is central; generic strategy words are secondary.

### 4) Active voice and sentence construction

- Pattern used heavily: `Label: explanation with mechanism and magnitude`.
- Preferred sequence:
  1. What changed
  2. Why it changed
  3. What it means for interpretation
- Passive voice appears in legal/assumption text, but high-value analytical bullets are still action/mechanism oriented.

### 5) Bullet style

- Bullets are mini-analyses, not placeholders.
- Frequent formatting behavior:
  - Bold/label lead-ins (`Revenue:`, `Variable expense:`)
  - Short causal chain in 1-3 lines
  - Numeric anchoring where possible
- Overly abstract bullets are rare.

### 6) Table style

- Tables are primary evidence artifacts.
- Common structure features:
  - multi-period comparability (`FY`, `TTM`, `As at`, `Average`)
  - adjustment bridge columns (`reported`, `due diligence`, `pro forma`, `adjusted`)
  - explicit source and notes on page
- Interpretation text often sits to the right of the table, not below it.

### 7) Chart usage

- Charts are sparse but intentional.
- Typical usage:
  - trend support
  - seasonality/context support
  - bridge visualization where table alone is hard to parse quickly
- Tables carry precision; charts carry pattern recognition.

### 8) Transferable vs non-transferable elements

#### Transferable to general consulting

- Message-led, quantified titles.
- Claim-evidence-implication writing loop.
- Evidence-first slide composition.
- Reusable archetype sequencing across sections.
- Source traceability and appendix support behavior.

#### Mostly FDD-specific

- Accounting adjustment taxonomy (`due diligence`, `pro forma`, QofE numbering conventions).
- IFRS-specific technical framing and audit/legal caveats.
- Extremely granular account-level bridges as default in body slides.

## Slide-By-Slide Matrix (80 Slides)

The matrix below captures title pattern, role, and transferable writing lesson per slide.

| Slide | Section | Title Pattern | Primary Role | Transferable Writing Lesson |
|---|---|---|---|---|
| 01 | Front Matter | Project | Cover / framing | Lead with concise context; do not overload opening slide body text. |
| 02 | Front Matter | Mr Mark Ripplinger, Chief Executive Officer | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 03 | Front Matter | Contents | Table of contents | Expose section roadmap early to reduce stakeholder navigation cost. |
| 04 | Executive Summary | Executive | Section divider | Use chapter transitions to reset context and reader attention. |
| 05 | Executive Summary | Business overview | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 06 | Executive Summary | Summary financials | Baseline snapshot | Start with multi-view baseline (income statement, balance sheet, cash flow). |
| 07 | Executive Summary | Key findings (1/2) – Financial | Synthesis | Pair evidence table with interpretation bullets; avoid summary-only claims. |
| 08 | Executive Summary | margin bridge | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 09 | Historical Trading | Historical | Section divider | Use chapter transitions to reset context and reader attention. |
| 10 | Historical Trading | Profit & loss overview (1/2) | P&L walkthrough | Use label-led bullets to explain major line-item drivers and implications. |
| 11 | Historical Trading | Profit & loss overview (2/2) | P&L walkthrough | Use label-led bullets to explain major line-item drivers and implications. |
| 12 | Historical Trading | Quality of earnings (1/16) – | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 13 | Historical Trading | Quality of earnings (2/16) – Due | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 14 | Historical Trading | Quality of earnings (3/16) – Due | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 15 | Historical Trading | Quality of earnings (4/16) – Due | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 16 | Historical Trading | Quality of earnings (5/16) – Due | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 17 | Historical Trading | Quality of earnings (6/16) – Due | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 18 | Historical Trading | Quality of earnings (7/16) – Due | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 19 | Historical Trading | Quality of earnings (8/16) – Pro | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 20 | Historical Trading | Quality of earnings (9/16) – Pro | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 21 | Historical Trading | Quality of earnings (10/16) – Pro | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 22 | Historical Trading | Quality of earnings (11/16) – Pro | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 23 | Historical Trading | Quality of earnings (12/16) – Pro | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 24 | Historical Trading | Quality of earnings (13/16) – Pro | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 25 | Historical Trading | Quality of earnings (14/16) – Pro | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 26 | Historical Trading | Quality of earnings (15/16) – Other | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 27 | Historical Trading | Quality of earnings (16/16) – Other | Adjustment walkthrough | Structure each slide as reported -> adjustment logic -> adjusted view. |
| 28 | Balance Sheet | Balance | Section divider | Use chapter transitions to reset context and reader attention. |
| 29 | Balance Sheet | Net working capital is comprised of the following balances (see the following pages for further analysis): | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 30 | Balance Sheet | Net working capital (continued) | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 31 | Balance Sheet | Net working capital (1/7) – Overview | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 32 | Balance Sheet | Net working capital (2/7) – Due | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 33 | Balance Sheet | Net working capital (3/7) – Due | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 34 | Balance Sheet | Net working capital (4/7) – Due | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 35 | Balance Sheet | Net working capital (5/7) – Pro forma | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 36 | Balance Sheet | Net working capital (6/7) – Pro forma | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 37 | Balance Sheet | Net working capital (7/7) – Pro forma | NWC walkthrough | Combine bridge tables with operational explanations of timing and seasonality. |
| 38 | Balance Sheet | Net cash | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 39 | Reporting Environment | Reporting | Section divider | Use chapter transitions to reset context and reader attention. |
| 40 | Reporting Environment | (1/4) | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 41 | Reporting Environment | (2/4) | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 42 | Reporting Environment | (3/4) | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 43 | Reporting Environment | (4/4) | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 44 | Gross Margin by LOB | Gross | Section divider | Use chapter transitions to reset context and reader attention. |
| 45 | Gross Margin by LOB | Gross margin by line of business – | LOB deep dive | Use one table for precision and one narrative block for strategic interpretation. |
| 46 | Gross Margin by LOB | Gross margin by line of business – | LOB deep dive | Use one table for precision and one narrative block for strategic interpretation. |
| 47 | Gross Margin by LOB | Gross margin by line of business – | LOB deep dive | Use one table for precision and one narrative block for strategic interpretation. |
| 48 | Gross Margin by LOB | Gross margin by line of business – | LOB deep dive | Use one table for precision and one narrative block for strategic interpretation. |
| 49 | Gross Margin by LOB | Gross margin by line of business – | LOB deep dive | Use one table for precision and one narrative block for strategic interpretation. |
| 50 | Gross Margin by LOB | Gross margin by line of business – | LOB deep dive | Use one table for precision and one narrative block for strategic interpretation. |
| 51 | Gross Margin by LOB | Gross margin by line of business – | LOB deep dive | Use one table for precision and one narrative block for strategic interpretation. |
| 52 | Gross Margin by LOB | Gross margin by line of business – | LOB deep dive | Use one table for precision and one narrative block for strategic interpretation. |
| 53 | Appendices | Appendice | Section divider | Use chapter transitions to reset context and reader attention. |
| 54 | Appendices | to audited financial statements (1/3) | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 55 | Appendices | to audited financial statements (2/3) | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 56 | Appendices | to audited financial statements (3/3) | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 57 | Appendices | Billings report reconciliation to | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 58 | Appendices | TTM Apr-24 to TTM Jun-24 QofE | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 59 | Appendices | Adjusted income statement (1/2) | Consolidation | Reconcile component adjustments into a final integrated statement. |
| 60 | Appendices | Adjusted income statement (2/2) | Consolidation | Reconcile component adjustments into a final integrated statement. |
| 61 | Appendices | QofE adjustment #1 – Mobile POS | Evidence packet | Back each major adjustment with explicit assumptions and source-ready support. |
| 62 | Appendices | QofE adjustment #8,9,16 – Data | Evidence packet | Back each major adjustment with explicit assumptions and source-ready support. |
| 63 | Appendices | QofE adjustment #14a – New | Evidence packet | Back each major adjustment with explicit assumptions and source-ready support. |
| 64 | Appendices | QofE adjustment #14b – Terminated | Evidence packet | Back each major adjustment with explicit assumptions and source-ready support. |
| 65 | Appendices | QofE adjustment #15 – Credit union | Evidence packet | Back each major adjustment with explicit assumptions and source-ready support. |
| 66 | Appendices | QofE adjustment #20 – New | Evidence packet | Back each major adjustment with explicit assumptions and source-ready support. |
| 67 | Appendices | QofE adjustment #21 – New | Evidence packet | Back each major adjustment with explicit assumptions and source-ready support. |
| 68 | Appendices | Capital assets and intangibles | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 69 | Appendices | Capital expenditure | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 70 | Appendices | Capital expenditure – FY22 to FY23 | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 71 | Appendices | Personnel analysis | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 72 | Appendices | Lease reconciliation | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 73 | Appendices | Cash flow statement | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 74 | Appendices | Important notice | Appendix support | Use appendix slides to preserve traceability and keep core narrative focused. |
| 75 | Appendices | Scope of work (1/3) | Scope/legal appendix | Separate legal/scope constraints from analytical storyline. |
| 76 | Appendices | Scope of work (2/3) | Scope/legal appendix | Separate legal/scope constraints from analytical storyline. |
| 77 | Appendices | Scope of work (3/3) | Scope/legal appendix | Separate legal/scope constraints from analytical storyline. |
| 78 | Appendices | Glossary of terms and abbreviations | Glossary appendix | Standardize terminology to improve interpretation consistency across teams. |
| 79 | Appendices | Glossary of terms and abbreviations | Glossary appendix | Standardize terminology to improve interpretation consistency across teams. |
| 80 | Appendices | The contacts at KPMG in connection | Contacts / close | Close with ownership and contact pathways, not additional analysis. |

## Practical Guidance Rules For Talkbook (Advisory)

1. Start each analytical slide with a quantified message title.
2. Use one of the approved archetype templates before drafting bullets.
3. Ensure every dense slide has an explicit evidence object (table, chart, or matrix).
4. Make bullets interpret evidence; do not repeat table rows.
5. Keep causal phrasing explicit (`driven by`, `impact of`, `resulting in`, `normalizes`).
6. Add source notes for all non-trivial numeric claims.
7. Use appendix evidence packets when body slide confidence depends on assumptions.
8. Prefer two-column table+narrative format for deep-dive slides.
9. Reserve chart usage for pattern recognition, not raw precision reporting.
10. End each section with synthesis and implication statements.

## Recommended Talkbook Integration Design

- Use a hybrid library model:
  - Core consulting archetypes (cross-domain)
  - Finance/deal-depth module (optional when needed)
- Enforce instructionally (not compile-time):
  - Mandatory archetype selection
  - Mandatory archetype template drafting
  - Mandatory checklist self-review before section finalization
- Keep layout selection policy in `layout-mapping.md`; keep writing policy in dedicated writing references.

## Implementation Outline

1. Publish this case study as reference for writing doctrine.
2. Add structured archetype guide with fixed field blocks.
3. Add pre-draft and post-draft quality checklist/rubric.
4. Wire mandatory archetype step into Talkbook SKILL.md and agent prompt.
5. Add contract tests for guide completeness and instruction wiring.
6. Validate on one strategy scenario and one finance scenario.

## Sources

### Internal corpus

- `outputs/project-north/Project North_(Jun-24) RF Draft report_21-Aug-24 vS.pdf`
- `outputs/project-north/png/*.png`
- `outputs/project-north/montage.png`

### External style references

- [IBCS Standards (SUCCESS)](https://www.ibcs.com/standards)
- [SEC Plain English Handbook](https://www.sec.gov/files/handbook.htm)
- [NARA Top 10 Principles for Plain Language](https://www.archives.gov/open/plain-writing/10-principles.html)
- [IFRS Practice Statement 1 Management Commentary](https://www.ifrs.org/content/ifrs/home/issued-standards/list-of-standards/management-commentary-practice-statement-1.html)
