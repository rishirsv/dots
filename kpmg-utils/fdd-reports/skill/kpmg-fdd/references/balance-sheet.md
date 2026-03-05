# Section contract: Balance sheet (incremental deep-dive)

## Table of contents
- Core Principles
- Writing guidance
- Layout
- Available slot shapes
- Render skeleton
- Common mistakes (and fixes)
- Structural preflight rules (must pass)
- Split policy rules
- Full example

## Core Principles

Use this section as an incremental deep-dive on balance-sheet composition and account mechanics that extends `historical-financial-performance`.

The section must read as client-ready diligence writing: factual, period-anchored, and explicit about balance-sheet structure, estimate-sensitive captions, financing profile, and comparability implications.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with a quantified headline that states total assets, total liabilities, equity position, and the primary balance-sheet movement over the review period.
2. Show the balance-sheet schedule before narrative commentary.
3. Structure commentary in this order: `Current assets`, `Non-current assets`, `Current liabilities`, `Non-current liabilities and equity`, `Reconciliation and comparability`.
4. Quantify major caption movements and identify component drivers inside each category (for example, trade receivables, inventory, prepaid assets, deferred revenue, accrued liabilities, related-party balances, and financing obligations).
5. State collateral, encumbrance, and repayment profile facts where they affect interpretation of liquidity, debt capacity, or transaction mechanics.
6. Distinguish trade, non-trade, and related-party balances where classification influences WC, net debt, or QoE interpretation.
7. Explain accounting-policy or presentation reclassifications that affect period comparability (for example, movement between cost captions or current/non-current classification changes).
8. Use concise source notes for sensitive or non-obvious facts and avoid repeating source statements in every bullet.
9. Keep unresolved interpretation inside `Comparability implications for diligence analysis`; do not create separate missing-information headings (for example, `Data requests`).
10. Keep bullets complete, active, and client-ready.

## Layout

Scale depth based on account complexity, financing structure, and extent of classification/policy changes over time.

Target length:
- 360-980 words (including schedules and reconciliation view)

Required blocks:
- `Headline position`
- `Balance sheet schedule and composition`
- `Asset analysis`
- `Liability and equity analysis`
- `Reconciliation to source reporting`
- `Comparability implications for diligence analysis`

Scaling rules:
- Keep concise when the balance sheet has stable composition and limited policy/classification changes.
- Expand `Balance sheet schedule and composition` when multiple entities or divisions contribute materially different account profiles.
- Expand `Asset analysis` when receivables, inventory, intangible assets, or related-party balances drive major movement.
- Expand `Liability and equity analysis` when leverage structure, related-party funding, provisions, or deferred balances materially affect interpretation.
- Expand `Reconciliation to source reporting` when trial balance, management, and audited presentations differ.
- Expand `Comparability implications for diligence analysis` when estimate updates or policy applications affect trend interpretation.

Block slot map:
- `Headline position`: 1 `textArray` (1-3 bullets)
- `Balance sheet schedule and composition`: 1 `table` + optional 1 `table` (ratio view) + 1 `text` source note
- `Asset analysis`: 1 `textArray` (3-7 bullets)
- `Liability and equity analysis`: 1 `textArray` (3-7 bullets)
- `Reconciliation to source reporting`: 1 `table` + 1 `textArray` (2-5 bullets)
- `Comparability implications for diligence analysis`: 1 `textArray` (2-6 bullets)

## Available slot shapes

### `text`
- Plain string.
- Use for source notes and short labels.

### `textArray`
- Array of bullets or short numbered statements.
- Use for all narrative blocks.

### `table`
- Object with `headers` and `rows`.
- Use for schedule, ratio, and reconciliation exhibits.

### `bodyStyle`
- `"bullets"` or `"paragraphs"` only.
- Default to `"bullets"` for this section.

## Render skeleton

```markdown
## Balance sheet

### Headline position
- As at [Date], total assets were $[x], total liabilities were $[y], and equity was $[z], compared with [prior period] of $[x]/$[y]/$[z].
- From [Period A] to [Period B], the largest movements were in [caption 1], [caption 2], and [caption 3], driven by [named factors].
- [If applicable] Net asset value was [positive/negative] at $[x], with implications for [liquidity / going concern / financing flexibility].

### Balance sheet schedule and composition ([Period], $[units])
Source note: [source_note required]

| Line item | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] |
|---|---:|---:|---:|---:|
| Cash and cash equivalents | $[x] | $[x] | $[x] | $[x] |
| Trade and other receivables | $[x] | $[x] | $[x] | $[x] |
| Inventory | $[x] | $[x] | $[x] | $[x] |
| Prepaid and other current assets | $[x] | $[x] | $[x] | $[x] |
| **Total current assets** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| Property, plant and equipment | $[x] | $[x] | $[x] | $[x] |
| Intangible assets | $[x] | $[x] | $[x] | $[x] |
| Other non-current assets | $[x] | $[x] | $[x] | $[x] |
| **Total non-current assets** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| **Total assets** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| Accounts payable | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Accrued liabilities | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Deferred revenue and other current liabilities | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Current portion of debt and lease liabilities | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| **Total current liabilities** | **($[x])** | **($[x])** | **($[x])** | **($[x])** |
| Long-term debt | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Lease liabilities (non-current) | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Provisions and other non-current liabilities | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| **Total non-current liabilities** | **($[x])** | **($[x])** | **($[x])** | **($[x])** |
| **Total liabilities** | **($[x])** | **($[x])** | **($[x])** | **($[x])** |
| **Equity / (deficit)** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| **Total liabilities and equity** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |

| Ratio view | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] |
|---|---:|---:|---:|---:|
| Current ratio (x) | [x] | [x] | [x] | [x] |
| Net debt / equity (x) | [x] | [x] | [x] | [x] |
| Current assets as % of total assets | [x]% | [x]% | [x]% | [x]% |

### Asset analysis
- Trade and other receivables [increased/decreased] by $[x] from [Period A] to [Period B], primarily due to [customer timing / billing mix / related-party balances], with [aging or collectability indicator] at [x].
- Inventory [increased/decreased] by $[x], reflecting [procurement cycle / production changes / seasonality / valuation method], and [obsolescence or count policy note].
- Prepaid and other current assets [increased/decreased] by $[x], primarily due to [specific components].
- Property, plant and equipment [increased/decreased] by $[x], driven by [capex, depreciation, disposals], with [collateral/encumbrance fact if relevant].
- Intangible assets [increased/decreased] by $[x], reflecting [acquisition, amortization, or development capitalization policy].

### Liability and equity analysis
- Accounts payable and accruals [increased/decreased] by $[x], primarily due to [vendor payment timing / payroll accrual / one-time items].
- Deferred revenue and other current liabilities [increased/decreased] by $[x], driven by [billing timing / contract liabilities / tax or statutory balances].
- Debt and lease liabilities [increased/decreased] by $[x], with key movements in [facility/lease category], and repayment profile concentrated in [period].
- Related-party funding balances were $[x] as at [Date], with [formal agreement / due-at-call / pricing] characteristics that affect financing interpretation.
- Equity [increased/decreased] by $[x] over the period, primarily due to [profitability/dividend/revaluation/other].

### Reconciliation to source reporting
Source note: [source_note optional]

| Reconciliation area | Status | Key movement | Diligence interpretation |
|---|---|---|---|
| Audited financial statements to management balance sheet | [Complete / Partial] | [summary] | [implication] |
| Management balance sheet to trial balance | [Complete / Partial] | [summary] | [implication] |
| Segment/entity to consolidated mapping | [Complete / Partial] | [summary] | [implication] |

- The balance-sheet base used in this section is [audited / management / adjusted], with reconciliation status as shown above.
- [If applicable] Historical system or mapping changes required [manual bridge/reclass], and this affects direct period comparability in [captions].
- [If applicable] Significant reconciling items were concentrated in [captions] and were treated as [classification/period] adjustments.

### Comparability implications for diligence analysis
- [Caption] treatment should be aligned with working capital and net debt definitions to avoid classification drift in purchase-price analysis.
- [Policy or estimate area] may affect period comparability in [specific section], and normalization should apply a consistent basis across periods.
- [If applicable] Related-party and non-trade balances require explicit classification treatment before drawing liquidity or leverage conclusions.
```

## Common mistakes (and fixes)

1. Mistake: repeating high-level P&L commentary without balance-sheet mechanics.
- Fix: focus on caption-level movements and balance-sheet-specific implications.

2. Mistake: listing captions without quantified movement.
- Fix: quantify period changes and state primary component drivers.

3. Mistake: ignoring related-party and non-trade balances.
- Fix: identify and classify these balances explicitly for diligence interpretation.

4. Mistake: discussing financing balances without collateral or repayment context.
- Fix: add key encumbrance and maturity-profile facts where relevant.

5. Mistake: omitting reconciliation between audited, management, and trial-balance views.
- Fix: include a reconciliation-status block and explain interpretation implications.

6. Mistake: creating separate missing-information sections (for example, `Data requests`).
- Fix: keep unresolved interpretation inside `Comparability implications for diligence analysis`.

7. Mistake: adding a comments column to schedules.
- Fix: keep schedules numeric and place explanatory detail in narrative bullets.

## Structural preflight rules (must pass)

1. All six required blocks exist and are in this exact order.
2. The schedule includes current assets, non-current assets, current liabilities, non-current liabilities, equity, and totals.
3. `Total assets` equals `Total liabilities and equity` for each period shown in the full example.
4. `Asset analysis` and `Liability and equity analysis` each include at least three quantified bullets.
5. `Reconciliation to source reporting` includes at least two reconciliation areas and a stated interpretation implication.
6. `Comparability implications for diligence analysis` includes at least two explicit implications tied to diligence interpretation.
7. No missing-information headings (for example, `Data requests`) appear.
8. Missing information is handled with inline placeholders, not unsupported claims.
9. Render skeleton and full example are materially different (template vs worked output).
10. Language and tone pass global conventions.

## Split policy rules

1. Split the balance-sheet schedule into core and supplemental exhibits when row count exceeds readability.
2. Split any bullet longer than 110 words into two tighter bullets.
3. Split `Asset analysis` or `Liability and equity analysis` by caption families when complexity exceeds six bullets.
4. Split reconciliation by entity when one combined bridge obscures material differences.

## Full example

```markdown
## Balance sheet

### Headline position
- As at December 31, 2024, total assets were $334.0 million, total liabilities were $229.0 million, and equity was $105.0 million, compared with FY2022 levels of $280.0 million, $195.8 million, and $84.2 million, respectively.
- From FY2022 to FY2024, the largest balance-sheet movements were in trade receivables (+$15.3 million), property and equipment (+$12.8 million), and long-term funding balances (+$11.3 million across debt and lease obligations).
- The balance-sheet profile indicates stronger scale with moderate leverage, while classification consistency between operating and financing captions remains important for purchase-price analysis.

### Balance sheet schedule and composition (FY2022-FY2024 and TTM Dec-2024, $m)
Source note: Audited financial statements FY2022-FY2024, monthly management balance-sheet packs, and trial-balance extracts for TTM December 2024.

| Line item | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
|---|---:|---:|---:|---:|
| Cash and cash equivalents | 12.4 | 15.1 | 17.8 | 18.6 |
| Trade and other receivables | 48.6 | 55.8 | 63.9 | 66.4 |
| Inventory | 22.1 | 24.7 | 27.5 | 28.9 |
| Prepaid and other current assets | 9.3 | 10.2 | 11.4 | 11.8 |
| **Total current assets** | **92.4** | **105.8** | **120.6** | **125.7** |
| Property, plant and equipment | 105.7 | 111.4 | 118.5 | 119.9 |
| Intangible assets | 63.2 | 68.1 | 72.9 | 73.6 |
| Other non-current assets | 18.7 | 19.7 | 22.0 | 21.0 |
| **Total non-current assets** | **187.6** | **199.2** | **213.4** | **214.5** |
| **Total assets** | **280.0** | **305.0** | **334.0** | **340.2** |
| Accounts payable | (28.9) | (31.6) | (35.4) | (36.2) |
| Accrued liabilities | (19.4) | (21.3) | (24.1) | (24.9) |
| Deferred revenue and other current liabilities | (16.3) | (18.9) | (22.5) | (23.1) |
| Current portion of debt and lease liabilities | (9.1) | (10.4) | (11.6) | (11.9) |
| **Total current liabilities** | **(73.7)** | **(82.2)** | **(93.6)** | **(96.1)** |
| Long-term debt | (88.2) | (93.7) | (97.8) | (98.0) |
| Lease liabilities (non-current) | (21.6) | (22.4) | (22.9) | (22.7) |
| Provisions and other non-current liabilities | (12.3) | (13.9) | (14.7) | (14.6) |
| **Total non-current liabilities** | **(122.1)** | **(130.0)** | **(135.4)** | **(135.3)** |
| **Total liabilities** | **(195.8)** | **(212.2)** | **(229.0)** | **(231.4)** |
| **Equity / (deficit)** | **84.2** | **92.8** | **105.0** | **108.8** |
| **Total liabilities and equity** | **280.0** | **305.0** | **334.0** | **340.2** |

| Ratio view | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
|---|---:|---:|---:|---:|
| Current ratio (x) | 1.25 | 1.29 | 1.29 | 1.31 |
| Net debt / equity (x) | 1.27 | 1.20 | 1.10 | 1.05 |
| Current assets as % of total assets | 33.0% | 34.7% | 36.1% | 36.9% |

### Asset analysis
- Trade and other receivables increased by $15.3 million from FY2022 to FY2024, primarily due to higher enterprise billing volume and extended settlement timing on two large customer programs.
- Inventory increased by $5.4 million over the same period, reflecting higher safety-stock coverage and expanded product mix; monthly count procedures remained consistent during FY2024.
- Prepaid and other current assets increased by $2.1 million, primarily due to annual software and insurance prepayments.
- Property, plant and equipment increased by $12.8 million, driven by distribution-hub upgrades and technology-enabled equipment additions, net of depreciation.
- Intangible assets increased by $9.7 million, primarily due to platform development capitalization and acquired software modules.

### Liability and equity analysis
- Accounts payable and accrued liabilities increased by $11.2 million from FY2022 to FY2024, mainly due to higher vendor spend and payroll-related accrual growth aligned to operating scale.
- Deferred revenue and other current liabilities increased by $6.2 million, reflecting growth in pre-billed contract activity and related liabilities.
- Total debt and lease obligations increased by $13.4 million from FY2022 to FY2024, with long-term debt funding capex and lease liabilities remaining broadly stable.
- Provisions and other non-current liabilities increased by $2.4 million, primarily due to estimate updates in employee-related obligations and long-term service commitments.
- Equity increased by $20.8 million over the period, driven by cumulative retained earnings growth.

### Reconciliation to source reporting
Source note: Trial-balance to management-reporting bridge files and audited financial statement mapping schedules.

| Reconciliation area | Status | Key movement | Diligence interpretation |
|---|---|---|---|
| Audited financial statements to management balance sheet | Complete | No net total variance; minor presentation reclassifications | Reported totals are comparable after classification alignment. |
| Management balance sheet to trial balance | Complete | Small timing movements in accrual and prepaid captions resolved at quarter-end | Interim month movement should be interpreted with period-end true-up context. |
| Segment/entity to consolidated mapping | Partial for one small entity | One entity reports local chart categories requiring mapping | Mapping adjustments are non-structural but must remain consistent across periods. |

- The balance-sheet base in this section uses audited annual statements with management monthly detail mapped to the same presentation basis.
- Reconciliation differences were primarily classification-related and did not create a net variance in total assets or total liabilities and equity.
- One entity-level mapping process remains manual, which requires consistent bridge logic for reliable trend comparison.

### Comparability implications for diligence analysis
- Trade and related non-trade receivables should be classified consistently with working-capital definitions to avoid overstatement of operating current assets.
- Debt, lease, and related financing balances should be aligned to net-debt treatment before final purchase-price bridge conclusions are drawn.
- Period-end accrual and prepaid true-ups should be normalized consistently when comparing quarter or year-end liquidity trends.
- Manual mapping for one entity does not change totals but can affect caption-level trend interpretation if applied inconsistently.
```
