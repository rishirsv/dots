# Section contract: Historical / financial performance

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

Present a clear, period-anchored historical P&L view from revenue through EBITDA.

The section must read as client-ready diligence writing: factual, concise, quantified, and explicit about what changed by line item.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with a quantified headline in the first 1-2 sentences (`so what`, with periods and units).
2. Define period coverage and units before interpretation.
3. Show the summary P&L exhibit before line-item commentary.
4. Structure commentary as a P&L walk in this order: `Revenue`, `Cost of sales`, `Gross profit`, `Sales and marketing`, `General and administrative`, `Product development`, `R&D`, `EBITDA`.
5. Quantify movements for each line and identify the expense or revenue components that drove each change.
6. Attribute unverified context to Management and distinguish it from evidenced facts.
7. Keep this section focused on historical P&L performance; do not include `Data quality and limitations`, `Implications for QoE`, or recommendation-oriented commentary.
8. Keep sentences complete and active; avoid clipped fragments and unsupported conclusions.

## Layout

Scale the depth of the section based on P&L complexity, line-item volatility, and availability of support.

Target length:
- 320-900 words (including summary exhibit and line-item commentary)

Required blocks:
- `Overview`
- `Summary P&L (historical periods)`
- `P&L overview by line item`

Scaling rules:
- Keep concise when the P&L structure is stable and line-item movement is limited.
- Expand the summary table when the business reports multiple revenue streams or operating expense categories.
- Expand line-item commentary when margin shifts are driven by mix, pricing, cost inflation, or investment timing.
- Use subhead callouts only when multiple segments or entities meaningfully influence line-item movement.

Block slot map:
- `Overview`: 2-4 `headline_bullet`
- `Summary P&L (historical periods)`: 1 `detailed_pnl_table` + 1 `source_note`
- `P&L overview by line item`: 8-12 `pnl_line_bullet` in P&L order, including separate bullets for `Sales and marketing`, `General and administrative`, `Product development`, and `R&D`

## Available slot shapes

Use these as building blocks. Choose only what the section needs.

### `headline_bullet`
- Purpose: provide a quantified headline trend and directional implication.
- Best use: opening `Overview` bullets.
- Target length: 22-50 words.
- Placeholders: allowed.

### `detailed_pnl_table`
- Purpose: present multi-period P&L from revenue components through EBITDA.
- Best use: `Summary P&L` block.
- Required fields: period columns, units, revenue components, cost-of-sales components, operating expense components, margins, source note.
- Placeholders: allowed.

### `pnl_line_bullet`
- Purpose: explain one major P&L line movement in numbered format.
- Best use: `P&L overview by line item` block.
- Required pattern: `[P&L line]: [quantified movement]. [2-3 quantified drivers within that line]. [implication for margin or earnings profile].`
- Target length: 35-110 words.
- Placeholders: allowed.

### `source_note`
- Purpose: compact evidence basis for an exhibit or narrative block.
- Best use: once per block when needed.
- Target length: 8-25 words.
- Placeholders: allowed.

## Render skeleton

```markdown
## Historical / financial performance

### Overview
- Over [Period], revenue [increased/decreased] from $[x] to $[x], while EBITDA [increased/decreased] from $[x] to $[x], indicating [headline implication].
- Gross margin moved from [x]% to [x]%, while EBITDA margin moved from [x]% to [x]%, reflecting [key combined effect].
- [Optional] In [LTM/TTM period], [line item] [increased/decreased] to $[x], which [supports/pressures] current run-rate earnings.

### Summary P&L (historical periods)
Source note: [source_note required]

| Line item | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] |
|---|---:|---:|---:|---:|
| Units ($[m/k]) | $[m/k] | $[m/k] | $[m/k] | $[m/k] |
| Product revenue | $[x] | $[x] | $[x] | $[x] |
| Service revenue | $[x] | $[x] | $[x] | $[x] |
| Other revenue | $[x] | $[x] | $[x] | $[x] |
| **Total revenue** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| Direct materials | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Direct labor | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Logistics and fulfillment | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Other cost of sales | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| **Total cost of sales** | **($[x])** | **($[x])** | **($[x])** | **($[x])** |
| **Gross profit** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| Gross margin (%) | [x]% | [x]% | [x]% | [x]% |
| Sales and marketing | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| General and administrative | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Product development | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| R&D | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Other operating expenses | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| **Total operating expenses** | **($[x])** | **($[x])** | **($[x])** | **($[x])** |
| **EBITDA** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| EBITDA margin (%) | [x]% | [x]% | [x]% | [x]% |

### P&L overview by line item
1. Revenue: Total revenue [increased/decreased] by $[x] from [Period A] to [Period B]. [Product/service/other] revenue components drove the movement, including [specific quantified component]. The resulting mix [improved/pressured] the earnings profile in [Period B].
2. Cost of sales: Total cost of sales [increased/decreased] by $[x] from [Period A] to [Period B]. [Direct materials/direct labor/logistics/other costs] drove this change, including [specific quantified component]. This movement [expanded/compressed] gross margin by [x] basis points.
3. Gross profit: Gross profit [increased/decreased] by $[x], and gross margin moved from [x]% to [x]%. [Pricing/mix/cost changes] drove this result, while [offsetting item] partially mitigated the movement.
4. Sales and marketing: Sales and marketing expense [increased/decreased] by $[x] from [Period A] to [Period B]. [Compensation/commissions/performance marketing/channel fees] drove the movement, including [specific quantified component], while [offsetting component] [partially offset/partially increased] spend.
5. General and administrative: G&A expense [increased/decreased] by $[x] from [Period A] to [Period B]. [Corporate payroll/professional fees/IT/facilities] drove the movement, including [specific quantified component]. G&A as a percentage of revenue moved from [x]% to [x]%.
6. Product development: Product development expense [increased/decreased] by $[x] from [Period A] to [Period B]. [Product payroll/contractors/platform tooling] drove the movement, including [specific quantified component], and [development milestone] changed spend timing.
7. R&D: R&D expense [increased/decreased] by $[x] from [Period A] to [Period B]. [Testing/prototyping/regulatory/lab costs] drove the movement, including [specific quantified component], while [offsetting item] [reduced/increased] the net change.
8. EBITDA: EBITDA [increased/decreased] by $[x], and EBITDA margin moved from [x]% to [x]%. Combined gross profit and operating expense movements drove this result and [improved/reduced] underlying earnings capacity.
- Source note: [source_note optional]
```

## Common mistakes (and fixes)

1. Mistake: headline trends without period labels or units.
- Fix: anchor every material metric to an explicit period and unit.

2. Mistake: summary table shows only top-line and EBITDA totals.
- Fix: include revenue components, cost-of-sales components, and operating expense components.

3. Mistake: commentary jumps to themes and skips required P&L lines.
- Fix: follow P&L order from revenue through EBITDA.

4. Mistake: operating expense commentary stays at subtotal level only.
- Fix: include separate, quantified commentary for `Sales and marketing`, `General and administrative`, `Product development`, and `R&D`.

5. Mistake: section includes `Data quality and limitations` or `Implications for QoE`.
- Fix: remove those blocks and keep this section to historical P&L performance only.

6. Mistake: recommendation-heavy wording in historical commentary.
- Fix: describe what changed, quantify it, and state earnings effect without recommendations.

## Structural preflight rules (must pass)

1. All three required blocks exist and are in this exact order.
2. The section includes explicit periods and units in `Overview` and `Summary P&L`.
3. `Summary P&L` includes revenue components, cost-of-sales components, separate operating expense components (`Sales and marketing`, `General and administrative`, `Product development`, `R&D`), gross margin, and EBITDA margin.
4. `P&L overview by line item` includes separate bullets for `Sales and marketing`, `General and administrative`, `Product development`, and `R&D`, each with quantified drivers.
5. No meta or missing-information headings appear (for example, `Data quality and limitations`, `Implications for QoE`, or `Data requests`).
6. Missing information is handled with inline placeholders, not unsupported claims.
7. Render skeleton and full example are materially different (template vs worked output).
8. Language and tone pass global conventions.

## Split policy rules

1. Split `P&L overview by line item` into sub-themes when bullets exceed 10.
2. Split any line-item bullet longer than 110 words into two tighter bullets.
3. Split `Summary P&L` into core and supplemental exhibits when line items exceed readability.
4. Split commentary into group-level and segment-level views when segment dynamics materially differ.

## Full example

```markdown
## Historical / financial performance

### Overview
- Over FY2022 to FY2024, total revenue increased from $82.4 million to $124.7 million, while EBITDA increased from $9.3 million to $16.8 million.
- Gross margin expanded from 38.1% to 41.6%, and EBITDA margin expanded from 11.3% to 13.5%, reflecting pricing gains and operating leverage.
- TTM December 2024 EBITDA reached $17.4 million on revenue of $131.2 million, which indicates the business maintained margin progression into the latest period.

### Summary P&L (historical periods)
Source note: Audited financial statements FY2022-FY2024 and management accounts for TTM December 2024.

| Line item | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
|---|---:|---:|---:|---:|
| Units ($m) | $m | $m | $m | $m |
| Product revenue | 49.3 | 59.1 | 69.8 | 73.0 |
| Service revenue | 28.7 | 39.2 | 48.6 | 51.4 |
| Other revenue | 4.4 | 5.3 | 6.3 | 6.8 |
| **Total revenue** | **82.4** | **103.6** | **124.7** | **131.2** |
| Direct materials | (21.9) | (26.8) | (31.4) | (32.6) |
| Direct labor | (16.8) | (20.5) | (23.7) | (24.8) |
| Logistics and fulfillment | (6.1) | (7.4) | (8.5) | (8.8) |
| Other cost of sales | (6.2) | (8.2) | (9.2) | (10.9) |
| **Total cost of sales** | **(51.0)** | **(62.9)** | **(72.8)** | **(77.1)** |
| **Gross profit** | **31.4** | **40.7** | **51.9** | **54.1** |
| Gross margin (%) | 38.1% | 39.3% | 41.6% | 41.2% |
| Sales and marketing | (9.8) | (11.7) | (14.2) | (14.8) |
| General and administrative | (8.7) | (10.5) | (12.4) | (12.9) |
| Product development | (1.6) | (2.5) | (3.7) | (3.8) |
| R&D | (0.8) | (1.3) | (2.0) | (2.1) |
| Other operating expenses | (1.2) | (1.9) | (2.8) | (3.1) |
| **Total operating expenses** | **(22.1)** | **(27.9)** | **(35.1)** | **(36.7)** |
| **EBITDA** | **9.3** | **12.8** | **16.8** | **17.4** |
| EBITDA margin (%) | 11.3% | 12.4% | 13.5% | 13.3% |

### P&L overview by line item
1. Revenue: Total revenue increased by $42.3 million from FY2022 to FY2024. Product revenue increased by $20.5 million and service revenue increased by $19.9 million, with smaller growth of $1.9 million in other revenue. This mix shifted toward higher-margin service and contract revenue.
2. Cost of sales: Total cost of sales increased by $21.8 million from FY2022 to FY2024. Direct materials and direct labor drove most of the movement, increasing by $9.5 million and $6.9 million, respectively. Cost-of-sales growth trailed revenue growth and expanded gross margin by 350 basis points.
3. Gross profit: Gross profit increased by $20.5 million from FY2022 to FY2024, and gross margin increased from 38.1% to 41.6%. Pricing actions and lower third-party delivery dependence supported the increase, while wage inflation in specialized delivery teams partially offset the gain.
4. Sales and marketing: Sales and marketing expense increased by $4.4 million from FY2022 to FY2024. Performance marketing spend increased by $1.6 million, commission expense increased by $1.5 million, and channel rebate programs increased by $1.3 million. Sales and marketing represented 11.4% of revenue in FY2024 versus 11.9% in FY2022.
5. General and administrative: G&A expense increased by $3.7 million from FY2022 to FY2024. Corporate payroll increased by $1.4 million, professional fees increased by $0.9 million, and IT systems and software costs increased by $0.8 million, with facilities and insurance contributing the remaining increase. G&A represented 9.9% of revenue in FY2024 versus 10.6% in FY2022.
6. Product development: Product development expense increased by $2.1 million from FY2022 to FY2024. Product engineering payroll increased by $1.2 million, contractor spend increased by $0.6 million, and platform tooling and cloud costs increased by $0.3 million as release cadence accelerated.
7. R&D: R&D expense increased by $1.2 million from FY2022 to FY2024. Testing and prototype costs increased by $0.7 million, quality assurance program spend increased by $0.3 million, and pilot program expenses increased by $0.2 million.
8. EBITDA: EBITDA increased by $7.5 million from FY2022 to FY2024, and EBITDA margin increased from 11.3% to 13.5%. Gross profit expansion outpaced operating expense growth and improved earnings conversion.
```
