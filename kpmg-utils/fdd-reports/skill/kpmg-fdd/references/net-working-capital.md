# Section contract: Net working capital

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

Present a period-anchored, purchase-price-relevant net working capital view that moves clearly from reported balances to normalized balances.

The section must read as client-ready diligence writing: factual, quantified, explicit about definition boundaries, and clear on target / peg implications when a deal definition exists.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with a quantified headline that states reported vs normalized working capital and the directional implication.
2. Define scope before analysis using a working capital definition table (included, excluded, rationale).
3. Show the working capital schedule and normalization bridge before narrative commentary.
4. Structure commentary in this order: `Revenue context (if relevant)`, `Receivables`, `Inventory` (if applicable), `Payables and accruals`, `Definitional adjustments`, `Diligence adjustments`, `Pro forma adjustments` (if applicable), `Normalized result`.
5. Present `Net working capital adjustments and rationale` as a numbered list, where each item follows: `Item ($[x]): [what it includes]. [how it is treated and why]. [implication for normalized NWC / target comparison].`
6. Quantify major operating line movements and identify component drivers within each line (for example, trade AR, contract assets, accrued payroll, deferred revenue).
7. Use working-capital days metrics (`DSO`, `DIO`, `DPO`) when available and tie them to specific balance movements.
8. If a target / peg definition exists, state source, basis, and resulting surplus / deficit on that basis. If no target / peg definition exists, state this explicitly and keep the section focused on normalized range and sensitivities.
9. Keep unresolved or not fully quantifiable points in `Other considerations`; do not create separate missing-information headings (for example, `Data requests`).
10. Keep all bullets as complete, active-voice sentences and avoid process or extraction language.

## Layout

Scale the depth of the section based on complexity of definition boundaries, number of adjustments, and seasonality of balances.

Target length:
- 380-980 words (including schedules and adjustment rationale)

Required blocks:
- `Headline position`
- `Definition and scope`
- `Net working capital schedule and normalization bridge`
- `Net working capital adjustments and rationale`
- `Historical behavior and working-capital drivers`
- `Target / peg assessment`
- `Other considerations`

Scaling rules:
- Keep concise when definition boundaries are clear, adjustment volume is low, and period behavior is stable.
- Expand `Definition and scope` when deal definition differs from management reporting classification.
- Expand `Net working capital adjustments and rationale` with category subheaders when adjustments exceed six lines.
- Expand `Historical behavior and working-capital drivers` when seasonality, payment timing, or mix shifts materially affect balances.
- Expand `Target / peg assessment` when target basis differs from normalized methodology (for example, average-period target versus spot-period closing mechanics).
- Expand `Other considerations` when cut-off, support, or timing dependencies could influence closing true-up.

Block slot map:
- `Headline position`: 1 `textArray` (1-3 bullets)
- `Definition and scope`: 1 `table` (definition table) + 1 `textArray` (2-5 bullets)
- `Net working capital schedule and normalization bridge`: 1 `table` (bridge table) + optional 1 `table` (days metrics) + 1 `text` source note
- `Net working capital adjustments and rationale`: 1 `textArray` (4-14 numbered items), grouped by adjustment type when needed
- `Historical behavior and working-capital drivers`: 1 `textArray` (3-8 bullets)
- `Target / peg assessment`: 1 `textArray` (2-5 bullets), conditional wording based on whether target basis is available
- `Other considerations`: 1 `textArray` (2-6 bullets)

## Available slot shapes

### `text`
- Plain string.
- Use for source notes and short labels.

### `textArray`
- Array of bullets or short numbered statements.
- Use for all narrative blocks.

### `table`
- Object with `headers` and `rows`.
- Use for definition, bridge, and optional days metrics exhibits.

### `bodyStyle`
- `"bullets"` or `"paragraphs"` only.
- Default to `"bullets"` for this section.

## Render skeleton

```markdown
## Net working capital

### Headline position
- Average reported net working capital for [Period] was $[x], and average normalized net working capital was $[y] after definitional, diligence, and pro forma adjustments.
- As at [Date], normalized net working capital was $[x], compared with reported net working capital of $[y], primarily due to [primary adjustment categories].
- [Conditional] Based on the target basis in [Source], normalized net working capital indicates a [surplus / deficit] of $[x] on this basis.

### Definition and scope
| Included in NWC | Excluded from NWC | Rationale |
|---|---|---|
| Trade accounts receivable | Cash and cash equivalents | Cash is assessed in net debt and excluded from operating working capital. |
| Inventory | Income taxes payable | Tax balances are treated outside operating working capital for purchase price purposes. |
| Prepaid and other operating current assets | Debt-like / financing liabilities | Financing and debt-like balances are assessed in net debt. |
| Trade accounts payable and operating accruals | Capex payables | Capex-related balances are treated outside operating working capital. |
| Deferred / unearned operating revenue (current) | Non-current or non-operating balances | Non-current and non-operating balances are outside target operating working capital. |

- The working capital definition in this section follows [deal definition / management definition] as at [Date].
- Where management reporting classification differs from deal-definition treatment, this section applies definitional adjustments in the normalization bridge.
- Current versus non-current classification is applied consistently with transaction definitions for closing mechanics.

### Net working capital schedule and normalization bridge ([Period], $[units])
Source note: [source_note required]

| Line item | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] |
|---|---:|---:|---:|---:|
| Trade receivables | $[x] | $[x] | $[x] | $[x] |
| Inventory | $[x] | $[x] | $[x] | $[x] |
| Prepaid and other operating current assets | $[x] | $[x] | $[x] | $[x] |
| Trade payables | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Operating accruals | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| Deferred / unearned operating revenue | ($[x]) | ($[x]) | ($[x]) | ($[x]) |
| **Reported net working capital** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| Definitional adjustments | $[x] | $[x] | $[x] | $[x] |
| Diligence adjustments | $[x] | $[x] | $[x] | $[x] |
| Pro forma adjustments (if applicable) | $[x] | $[x] | $[x] | $[x] |
| **Normalized net working capital** | **$[x]** | **$[x]** | **$[x]** | **$[x]** |
| Normalized NWC as % of revenue | [x]% | [x]% | [x]% | [x]% |

| Working-capital days | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] |
|---|---:|---:|---:|---:|
| DSO (days) | [x] | [x] | [x] | [x] |
| DIO (days) | [x] | [x] | [x] | [x] |
| DPO (days) | [x] | [x] | [x] | [x] |

### Net working capital adjustments and rationale
1. [Definitional item] ($[x]): The balance includes [description]. This section excludes / includes this balance in normalized net working capital because [deal-definition or operating rationale]. The adjustment [increases / decreases] normalized net working capital by $[x].
2. [Definitional item] ($[x]): The balance includes [description]. This section excludes / includes this balance because [rationale]. The adjustment [increases / decreases] normalized net working capital by $[x].
3. [Diligence item] ($[x]): The balance includes [description]. This section adjusts this balance because [cut-off / one-time / out-of-period rationale]. The adjustment [increases / decreases] normalized net working capital by $[x].
4. [Diligence item] ($[x]): The balance includes [description]. This section adjusts this balance because [rationale]. The adjustment [increases / decreases] normalized net working capital by $[x].
5. [Pro forma item, if applicable] ($[x]): The balance includes [description]. This section reflects this adjustment in working capital because [linkage to normalized run-rate assumptions]. The adjustment [increases / decreases] normalized net working capital by $[x].
- Source note: [source_note optional]

### Historical behavior and working-capital drivers
- Trade receivables [increased/decreased] by $[x] from [Period A] to [Period B], primarily driven by [billing cadence / customer mix / collection timing], with DSO moving from [x] to [x] days.
- Inventory [increased/decreased] by $[x] over the period, primarily driven by [procurement cycle / service model / seasonality], with DIO moving from [x] to [x] days.
- Trade payables and operating accruals [increased/decreased] by $[x], primarily driven by [payment terms / payroll timing / vendor settlement cadence], with DPO moving from [x] to [x] days.
- Deferred / unearned operating revenue [increased/decreased] by $[x], reflecting [invoicing pattern / contract timing / seasonality], and this movement [increased/decreased] working capital intensity.

### Target / peg assessment
- Deal definition / source: [SPA / offer letter / management definition], dated [Date].
- Target basis: [for example, average over [x] months prior to completion / fixed amount / not provided].
- If target basis and value are available, normalized net working capital for [Period] is $[x] versus target of $[y], implying a $[x] [surplus / deficit] on this basis.
- If target basis or value is not available, this section does not conclude on surplus / deficit and instead presents normalized working capital levels and sensitivities as inputs for target-setting.

### Other considerations
- Closing-date normalization remains sensitive to [specific cut-off or timing factor], and this factor may move closing working capital by approximately $[x].
- [Specific balance category] includes components that are not fully quantified as at [Date], and final classification should follow the agreed transaction definition at closing.
- Where practical-completion or billing milestones occur near closing, related accrual and receivable timing may create short-term volatility in reported working capital.
```

## Common mistakes (and fixes)

1. Mistake: presenting reported working capital only, without a normalization bridge.
- Fix: include reported, definitional, diligence, and pro forma steps to arrive at normalized working capital.

2. Mistake: missing or ambiguous definition boundaries.
- Fix: include a definition table that states included / excluded accounts and rationale.

3. Mistake: subtotal-only operating expense or liability commentary with no line-level drivers.
- Fix: quantify key components inside each major line (for example, AR subcomponents, payables and accrual drivers, deferred revenue).

4. Mistake: stating target / peg surplus or deficit without a sourced basis.
- Fix: cite source and basis explicitly, or state that no target conclusion is provided.

5. Mistake: adding a comments column to schedules.
- Fix: keep schedules numeric and place explanations in `Net working capital adjustments and rationale`.

6. Mistake: using process notes or extraction language in narrative.
- Fix: use client-ready wording and placeholders only.

## Structural preflight rules (must pass)

1. All seven required blocks exist and are in this exact order.
2. The section includes explicit periods and units in headline and schedule blocks.
3. The definition table includes included accounts, excluded accounts, and rationale.
4. The normalization bridge includes reported, definitional, diligence, pro forma (or explicit N/A), and normalized rows.
5. `Net working capital adjustments and rationale` includes at least four numbered items with quantified impact and treatment rationale.
6. `Target / peg assessment` either (a) states sourced target basis and comparison or (b) explicitly states that target basis/value is not available and no surplus/deficit conclusion is made.
7. No missing-information headings (for example, `Data requests`) appear.
8. Missing information is handled with inline placeholders, not unsupported claims.
9. Render skeleton and full example are materially different (template vs worked output).
10. Language and tone pass global conventions.

## Split policy rules

1. Split `Net working capital adjustments and rationale` into sub-themes when items exceed 10.
2. Split any adjustment item longer than 110 words into two tighter bullets.
3. Split the bridge into core and supplemental exhibits when rows exceed readability.
4. Split historical behavior into separate sub-blocks when line behavior differs materially by segment or entity.

## Full example

```markdown
## Net working capital

### Headline position
- Average reported net working capital for FY2024 was $7.5 million, and average normalized net working capital was $13.0 million after definitional, diligence, and pro forma adjustments.
- As at December 31, 2024, normalized net working capital was $13.2 million compared with reported net working capital of $7.5 million, primarily due to exclusion of debt-like balances and normalization of timing-related accruals.
- Based on the target basis in the draft SPA dated January 20, 2025, normalized net working capital indicates a $0.5 million surplus on this basis.

### Definition and scope
| Included in NWC | Excluded from NWC | Rationale |
|---|---|---|
| Trade accounts receivable | Cash and cash equivalents | Cash is assessed in net debt and excluded from operating working capital. |
| Inventory | Income taxes payable | Tax balances are treated outside operating working capital for purchase price purposes. |
| Prepaid and other operating current assets | Debt-like / financing liabilities | Financing and debt-like balances are assessed in net debt. |
| Trade accounts payable and operating accruals | Capex payables | Capex-related balances are treated outside operating working capital. |
| Deferred / unearned operating revenue (current) | Non-current or non-operating balances | Non-current and non-operating balances are outside target operating working capital. |

- The working capital definition in this section follows the draft SPA definition as at January 20, 2025.
- Where management reporting classification differs from SPA treatment, this section applies definitional adjustments in the normalization bridge.
- Current versus non-current classification is applied consistently with closing mechanics defined in the draft SPA.

### Net working capital schedule and normalization bridge (FY2022-FY2024, $m)
Source note: Management trial balance extracts FY2022-FY2024 and monthly working capital schedules prepared for transaction support.

| Line item | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
|---|---:|---:|---:|---:|
| Trade receivables | 18.4 | 21.8 | 24.6 | 25.1 |
| Inventory | 8.9 | 9.6 | 10.2 | 10.3 |
| Prepaid and other operating current assets | 4.1 | 4.7 | 5.2 | 5.4 |
| Trade payables | (12.8) | (13.9) | (14.7) | (14.9) |
| Operating accruals | (6.5) | (7.1) | (8.3) | (8.4) |
| Deferred / unearned operating revenue | (6.7) | (7.9) | (9.5) | (9.7) |
| **Reported net working capital** | **5.4** | **7.2** | **7.5** | **7.8** |
| Definitional adjustments | 3.1 | 3.8 | 4.4 | 4.5 |
| Diligence adjustments | 0.4 | 0.7 | 0.9 | 0.8 |
| Pro forma adjustments (if applicable) | 0.2 | 0.3 | 0.4 | 0.3 |
| **Normalized net working capital** | **9.1** | **12.0** | **13.2** | **13.4** |
| Normalized NWC as % of revenue | 11.0% | 11.6% | 10.6% | 10.5% |

| Working-capital days | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
|---|---:|---:|---:|---:|
| DSO (days) | 53 | 54 | 56 | 55 |
| DIO (days) | 46 | 45 | 42 | 42 |
| DPO (days) | 47 | 47 | 49 | 48 |

### Net working capital adjustments and rationale
1. Income taxes payable exclusion ($2.6 million): The balance includes current tax liabilities that do not arise from operating trading flows. This section excludes these balances from normalized net working capital because the draft SPA treats them outside operating working capital. The adjustment increases normalized net working capital by $2.6 million.
2. Capex payables exclusion ($1.2 million): The balance includes supplier balances related to fixed-asset projects. This section excludes these balances from normalized net working capital because these items are capex-related and treated outside working capital in transaction mechanics. The adjustment increases normalized net working capital by $1.2 million.
3. Out-of-period payroll accrual correction ($0.5 million): The balance includes payroll accruals recorded in December 2024 that relate to periods prior to Q4 2024. This section normalizes the accrual to the related service period to align with underlying run-rate operations. The adjustment increases normalized net working capital by $0.5 million.
4. One-time advisory accrual removal ($0.3 million): The balance includes transaction-related advisory fees accrued in FY2024. This section removes these non-recurring balances from normalized net working capital because they do not represent recurring operating requirements. The adjustment increases normalized net working capital by $0.3 million.
5. Pro forma receivables timing adjustment ($0.4 million): The balance reflects receivables impact from run-rate revenue timing assumptions used in the QoE bridge. This section includes the related receivables timing effect to align normalized working capital with pro forma trading assumptions. The adjustment increases normalized net working capital by $0.4 million.

### Historical behavior and working-capital drivers
- Trade receivables increased by $6.2 million from FY2022 to FY2024, primarily driven by higher enterprise billing volume and longer settlement timing for two large contract customers, with DSO increasing from 53 to 56 days.
- Inventory increased by $1.3 million over the same period, primarily driven by safety-stock builds in FY2023 and improved purchasing cadence in FY2024, with DIO declining from 46 to 42 days.
- Trade payables and operating accruals increased by $3.7 million from FY2022 to FY2024, primarily due to higher vendor spend and variable compensation accruals in line with revenue growth, with DPO increasing from 47 to 49 days.
- Deferred revenue increased by $2.8 million, reflecting higher annual pre-billing on multiyear contracts, and this trend reduced reported working capital while supporting recurring cash conversion.

### Target / peg assessment
- Deal definition / source: Draft SPA, dated January 20, 2025.
- Target basis: Average normalized net working capital over the 12 months preceding completion.
- Normalized net working capital for FY2024 was $13.0 million on an average basis, versus a target of $12.5 million, implying a $0.5 million surplus on this basis.
- If closing month billing and collections timing remains consistent with Q4 2024 patterns, reported closing balances are expected to remain within a +/- $0.6 million range around the normalized level.

### Other considerations
- Quarter-end collection timing remains a key swing factor for closing trade receivables and could move closing net working capital by approximately $0.4 million.
- Annual bonus accrual phasing in Q1 and Q4 can shift reported operating accruals between months and should be evaluated against the agreed cut-off convention at closing.
- Deferred revenue seasonality is concentrated around annual contract renewal months and can reduce reported working capital even when underlying operating performance is stable.
```
