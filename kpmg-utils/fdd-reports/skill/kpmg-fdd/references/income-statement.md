# Section contract: Income statement (incremental deep-dive)

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

Use this section as an incremental deep-dive on P&L mechanics that extends `historical-financial-performance`.

The section must read as client-ready diligence writing: factual, line-item specific, period-anchored, and explicit about classification or policy effects that influence comparability.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with a quantified headline that explains how this section adds detail beyond the high-level historical-performance view.
2. Show the detailed income statement schedule before narrative commentary.
3. Walk the P&L in this order: `Revenue`, `Direct costs`, `Gross profit and margin`, `Operating expenses`, `EBITDA`.
4. Quantify line-item movements and identify component drivers inside each major subtotal.
5. Use direct-cost and operating-expense component detail where available (for example, direct labor, subcontract/direct materials, occupancy, payroll, benefits, marketing, IT, professional fees).
6. Include a division/entity reconciliation block when management reporting differs from legal-entity reporting or consolidated presentation.
7. State classification or accounting-policy changes that affect comparability (for example, reclassifications between cost of sales and SG&A), and describe the directional effect.
8. Keep metrics period-labeled and unit-consistent across tables and narrative.
9. Keep unresolved detail inside `Comparability implications` and do not create separate missing-information headings (for example, `Data requests`).
10. Keep bullets complete, active, and client-ready.

## Layout

Scale depth based on business complexity, availability of line-level support, and extent of reporting reclassifications.

Target length:
- 360-980 words (including schedules and reconciliations)

Required blocks:
- `Headline position`
- `Detailed income statement schedule`
- `Revenue and gross margin analysis`
- `Operating expense analysis`
- `Division and entity reconciliation`
- `Classification and comparability implications`

Scaling rules:
- Keep concise when the income statement has a stable structure and low reclassification activity.
- Expand `Detailed income statement schedule` when the business has multiple revenue or cost components.
- Expand `Revenue and gross margin analysis` when margin changes are driven by mix, pricing, billing cadence, or delivery model changes.
- Expand `Operating expense analysis` when payroll, incentive, systems, or corporate-cost changes materially influence EBITDA.
- Expand `Division and entity reconciliation` when segment-level reporting is used for management decisions or where bridge adjustments are required.
- Expand `Classification and comparability implications` when policy changes, restatements, or mapping changes affect trend interpretation.

Block slot map:
- `Headline position`: 1 `textArray` (1-3 bullets)
- `Detailed income statement schedule`: 1 `table` + optional 1 `table` (ratio or mix view) + 1 `text` source note
- `Revenue and gross margin analysis`: 1 `textArray` (3-7 bullets)
- `Operating expense analysis`: 1 `textArray` (3-8 bullets)
- `Division and entity reconciliation`: 1 `table` + 1 `textArray` (2-5 bullets)
- `Classification and comparability implications`: 1 `textArray` (2-6 bullets)

## Available slot shapes

### `text`
- Plain string.
- Use for source notes and short labels.

### `textArray`
- Array of bullets or short numbered statements.
- Use for all narrative blocks.

### `table`
- Object with `headers` and `rows`.
- Use for detailed P&L and reconciliation exhibits.

### `bodyStyle`
- `"bullets"` or `"paragraphs"` only.
- Default to `"bullets"` for this section.

## Render skeleton

```markdown
## Income statement

### Headline position
- Over [Period], total revenue moved from $[x] to $[x], while EBITDA moved from $[x] to $[x], with detailed movement primarily explained by [named line-item drivers].
- Gross margin moved from [x]% to [x]%, driven by [pricing/mix/direct-cost drivers].
- This section provides incremental line-item detail beyond the historical-performance summary, including [division/entity reconciliation and classification effects].

### Detailed income statement schedule ([Period], $[units])
Source note: [source_note required]

| Line item | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] |
|---|---:|---:|---:|---:|
| [Revenue component 1] | $[x] | $[x] | $[x] | $[x] |
| [Revenue component 2] | $[x] | $[x] | $[x] | $[x] |
| [Revenue component 3] | $[x] | $[x] | $[x] | $[x] |
| **Total revenue** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| Direct labor / delivery costs | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Direct materials / subcontract / content costs | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Occupancy / fulfillment / other direct costs | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| **Total direct costs** | **($[x])** | **($[x])** | **($[x])** | **($[x])** |
| **Gross profit** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| Gross margin (%) | [x]% | [x]% | [x]% | [x]% |
| Sales and marketing | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| General and administrative | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Product and technology | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| R&D | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Other operating expenses | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| **Total operating expenses** | **($[x])** | **($[x])** | **($[x])** | **($[x])** |
| **EBITDA** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| EBITDA margin (%) | [x]% | [x]% | [x]% | [x]% |

### Revenue and gross margin analysis
- Total revenue [increased/decreased] by $[x] from [Period A] to [Period B], primarily due to [component drivers].
- [Revenue component] [increased/decreased] by $[x] due to [volume/pricing/mix/timing].
- Total direct costs [increased/decreased] by $[x], primarily from [direct labor/material/subcontract drivers].
- Gross profit [increased/decreased] by $[x], and gross margin moved from [x]% to [x]% due to [named effects].

### Operating expense analysis
- Operating expenses [increased/decreased] by $[x] from [Period A] to [Period B], with the largest movement in [line item].
- Sales and marketing [increased/decreased] by $[x], primarily due to [drivers].
- G&A [increased/decreased] by $[x], primarily due to [drivers].
- Product and technology plus R&D [increased/decreased] by $[x], reflecting [investment cadence/operating change].
- EBITDA [increased/decreased] by $[x], with margin moving from [x]% to [x]%.

### Division and entity reconciliation
| Reconciliation item | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] |
|---|---:|---:|---:|---:|
| Division / entity EBITDA subtotal | $[x] | $[x] | $[x] | $[x] |
| Corporate / elimination adjustments | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Reporting reclassifications | $[x] | $[x] | $[x] | $[x] |
| **Reported consolidated EBITDA** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |

- Management reporting and legal-entity reporting differ in [specific area], and this bridge aligns the two views.
- Corporate allocations or elimination entries [increased/decreased] by $[x], affecting division-level comparability.
- [If applicable] The reconciliation includes [named entity/segment] where standalone detail was not available in earlier periods.

### Classification and comparability implications
- During [Period], [specific line item] was reclassified from [old classification] to [new classification], and prior periods [were/were not] restated.
- This classification change [increases/decreases] comparability for [specific metrics], and trend interpretation should follow [consistent basis].
- [If applicable] Policy/application changes in [topic] may affect period comparability in gross margin or EBITDA and should be considered in normalization analysis.
```

## Common mistakes (and fixes)

1. Mistake: repeating the full historical-performance narrative without incremental detail.
- Fix: focus on deeper line-item drivers, reconciliation detail, and comparability effects.

2. Mistake: presenting only subtotal movements with no component analysis.
- Fix: quantify key components inside revenue, direct costs, and operating expenses.

3. Mistake: omitting reconciliation where management and consolidated views differ.
- Fix: include a reconciliation table that bridges segment/entity view to consolidated EBITDA.

4. Mistake: ignoring classification changes that affect trend interpretation.
- Fix: state reclassifications explicitly and explain period comparability impact.

5. Mistake: adding separate missing-information sections (for example, `Data requests`).
- Fix: keep unresolved points within `Classification and comparability implications`.

6. Mistake: adding a comments column to the schedule.
- Fix: keep tables numeric and place rationale in narrative bullets.

## Structural preflight rules (must pass)

1. All six required blocks exist and are in this exact order.
2. The detailed schedule includes revenue, direct costs, gross profit, operating expenses, and EBITDA.
3. Narrative follows the required P&L flow from revenue through EBITDA.
4. `Division and entity reconciliation` includes a bridge to reported consolidated EBITDA.
5. `Classification and comparability implications` includes at least one explicit classification or policy-comparability statement.
6. No missing-information headings (for example, `Data requests`) appear.
7. Missing information is handled with inline placeholders, not unsupported claims.
8. Render skeleton and full example are materially different (template vs worked output).
9. Language and tone pass global conventions.

## Split policy rules

1. Split the detailed schedule into core and supplemental exhibits when rows exceed readability.
2. Split any bullet longer than 110 words into two tighter bullets.
3. Split operating-expense analysis into function-level sub-blocks when more than five cost functions are material.
4. Split reconciliation by segment/entity when one bridge cannot show drivers clearly.

## Full example

```markdown
## Income statement

### Headline position
- Over FY2022 to FY2024, total revenue increased from $290.0 million to $365.7 million, while EBITDA increased from $18.6 million to $27.1 million, primarily due to higher service revenue and gross margin expansion.
- Gross margin increased from 30.2% to 32.4%, driven by pricing and delivery-mix improvements despite absolute growth in direct labor costs.
- This section provides incremental line-item detail beyond historical-performance summary, including a management-division to consolidated EBITDA reconciliation and comparability effects from classification changes.

### Detailed income statement schedule (FY2022-FY2024 and TTM Dec-2024, $m)
Source note: Audited financial statements FY2022-FY2024, management trial balances, and division-level management reporting packs.

| Line item | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
|---|---:|---:|---:|---:|
| Service revenue | 210.4 | 238.6 | 269.8 | 275.1 |
| Product revenue | 68.7 | 74.9 | 82.3 | 84.0 |
| Other revenue | 10.9 | 12.4 | 13.6 | 13.9 |
| **Total revenue** | **290.0** | **325.9** | **365.7** | **373.0** |
| Direct labor / delivery costs | (124.2) | (136.8) | (150.1) | (153.8) |
| Direct materials / subcontract costs | (58.5) | (65.4) | (72.3) | (73.9) |
| Occupancy / fulfillment / other direct costs | (19.6) | (21.9) | (24.7) | (25.2) |
| **Total direct costs** | **(202.3)** | **(224.1)** | **(247.1)** | **(252.9)** |
| **Gross profit** | **87.7** | **101.8** | **118.6** | **120.1** |
| Gross margin (%) | 30.2% | 31.2% | 32.4% | 32.2% |
| Sales and marketing | (21.6) | (24.7) | (28.8) | (29.4) |
| General and administrative | (28.9) | (31.5) | (34.7) | (35.3) |
| Product and technology | (10.8) | (13.2) | (15.9) | (16.1) |
| R&D | (4.2) | (5.1) | (6.4) | (6.6) |
| Other operating expenses | (3.6) | (4.8) | (5.7) | (5.9) |
| **Total operating expenses** | **(69.1)** | **(79.3)** | **(91.5)** | **(93.3)** |
| **EBITDA** | **18.6** | **22.5** | **27.1** | **26.8** |
| EBITDA margin (%) | 6.4% | 6.9% | 7.4% | 7.2% |

### Revenue and gross margin analysis
- Total revenue increased by $75.7 million from FY2022 to FY2024, with service revenue contributing $59.4 million and product revenue contributing $13.6 million of the increase.
- Service revenue growth was driven by contract-volume expansion in enterprise channels and selective pricing actions implemented from H2 FY2023.
- Total direct costs increased by $44.8 million over the same period, with direct labor increasing by $25.9 million and direct materials/subcontract costs increasing by $13.8 million.
- Gross profit increased by $30.9 million, and gross margin expanded by 220 basis points from 30.2% to 32.4% due to favorable delivery mix and improved pricing realization.

### Operating expense analysis
- Total operating expenses increased by $22.4 million from FY2022 to FY2024, with growth led by sales and marketing (+$7.2 million) and product and technology (+$5.1 million).
- Sales and marketing increased as the business expanded digital acquisition spend and channel-partner incentives in FY2023 and FY2024.
- G&A increased by $5.8 million, primarily due to corporate payroll growth, technology platform licenses, and professional-fee support for scaling activities.
- Product and technology plus R&D increased by $7.3 million as the business accelerated product roadmap delivery and support tooling.
- EBITDA increased by $8.5 million from FY2022 to FY2024, and EBITDA margin increased from 6.4% to 7.4%, as gross-profit expansion outpaced operating-expense growth.

### Division and entity reconciliation
| Reconciliation item | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
|---|---:|---:|---:|---:|
| Division EBITDA subtotal | 26.1 | 31.4 | 39.0 | 38.8 |
| Corporate and elimination adjustments | (7.5) | (8.9) | (10.6) | (10.9) |
| Reporting reclassifications | 0.0 | 0.0 | (1.3) | (1.1) |
| **Reported consolidated EBITDA** | **18.6** | **22.5** | **27.1** | **26.8** |

- Management division reporting includes gross segment results before corporate support allocations and elimination entries.
- Corporate and elimination adjustments increased by $3.1 million from FY2022 to FY2024, reflecting central function growth and higher shared-service costs.
- FY2024 includes a reporting reclassification of variable compensation from direct costs to operating expenses for comparability to updated management presentation.

### Classification and comparability implications
- In FY2024, variable compensation was reclassified from direct costs to operating expenses, and historical periods were restated in management reporting to maintain gross-margin comparability.
- Trend analysis should use the restated basis when comparing FY2022-FY2024 gross margin and operating expense ratios.
- The division-to-consolidated bridge should be used consistently in QoE and margin analysis to avoid mixing pre-allocation and post-allocation EBITDA views.
```
