# Section contract: Net working capital

## Table of contents

- Section objective
- Core principles
- Analytical workflow
- Section architecture
- Available analytical units
- Assembly patterns
- Section-specific writing guidance
- Verification and review checks
- Full examples

## Section objective

The Net Working Capital section defines the operating working-capital position in terms that matter for purchase price and closing mechanics. It should tell the reader how working capital is defined for the engagement, how reported balances move to normalized balances, which adjustments matter, and whether the available evidence supports a target or peg conclusion.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Definition comes before normalization:** Clarify what is included and excluded from working capital before presenting trend, bridge, or target conclusions.
2. **Treat the bridge as the anchor exhibit:** Strong NWC sections are built around a reported-to-normalized bridge, not around a long narrative with hidden math.
3. **Separate recurring operating behavior from adjustments:** Keep baseline line-item behavior distinct from definitional, diligence, and pro forma adjustments.
4. **Use target or peg language only when sourced:** State a target comparison only when the basis and value are actually supported; otherwise state that clearly.
5. **Add seasonality only when it changes interpretation:** DSO, DIO, DPO, billing cadence, and quarter-end timing belong here when they affect how normalized NWC should be understood.
6. **Keep optional analysis trigger-based:** Days analysis, pro forma linkage, sell-side reliance, and other considerations should appear only when the evidence requires them.
7. **Keep the section on purchase-price mechanics:** Do not turn the section into a generic balance sheet deep dive or a list of unsupported data requests.

## Analytical workflow

1. **Anchor the section to the right basis:** Determine whether the section is speaking about period-end balances, average balances, normalized balances, or a deal-defined target basis, and state that basis clearly.
2. **Define the operating boundary:** Identify what is included in working capital, what is excluded, and why, especially for cash, debt-like items, taxes, capex payables, and non-operating balances.
3. **Build the reported-to-normalized bridge:** Start from reported working capital and map the definitional, diligence, and, where relevant, pro forma steps to the normalized view.
4. **Explain the adjustments one by one:** For each material adjustment, state what it is, how it is treated, why, and what it does to normalized working capital.
5. **Add driver commentary only where it informs interpretation:** Use receivables, inventory, payables, accruals, deferred revenue, and days metrics when they explain seasonality, volatility, or peg risk.
6. **State target status explicitly:** Compare normalized working capital to the target or peg when sourced; otherwise state that no supported target basis or value was provided.
7. **Scale the section to the evidence:** Keep simple cases concise, and activate the optional blocks only when the data shape or deal mechanics actually require them.

## Section architecture

Scale the section based on the complexity of the definition boundary, the number of normalization adjustments, and the importance of seasonality or target mechanics.

Target length:

- `concise`: 220-360 words plus core exhibits for simple snapshot or low-adjustment situations
- `standard`: 320-600 words plus core exhibits for most situations
- `expanded`: 520-850 words plus core exhibits when seasonality, target mechanics, or adjustment volume materially increases complexity

Required blocks:

- `NWC position and basis`
  - Purpose: state the reported and normalized position, the date or period basis, and the directional implication.
  - Typical density: 2-4 bullets.
- `Definition and scope`
  - Purpose: define the operating working-capital perimeter using a clear included / excluded / rationale structure.
  - Typical density: one definition table plus 1-3 short clarifying bullets.
- `NWC schedule and normalization bridge`
  - Purpose: show the reported-to-normalized bridge that supports the section's conclusion.
  - Typical density: one bridge exhibit plus one source note.
- `Adjustments and normalization logic`
  - Purpose: explain the material definitional, diligence, and conditional pro forma adjustments.
  - Typical density: 3-8 numbered items.
- `Target / peg status`
  - Purpose: state the sourced target comparison when available, or explicitly state that no supported target basis or value was provided.
  - Typical density: 1-3 bullets.

Optional blocks:

- `Working-capital drivers and seasonality`
  - Use when AR, inventory, AP, accruals, deferred revenue, billing cadence, or quarter-end timing materially affects interpretation of normalized working capital.
  - Use when line-item behavior explains why a spot balance or average balance should be read cautiously.
- `Days analysis`
  - Use when DSO, DIO, DPO, or equivalent metrics are available and materially improve interpretation.
  - Use when the metrics support, rather than merely repeat, the driver commentary.
- `Pro forma impact`
  - Use when normalized working capital is meaningfully affected by QoE-linked run-rate assumptions or other explicit pro forma logic.
  - Use when the reader needs the pro forma step separated from definitional or diligence adjustments.
- `Other considerations`
  - Use when unresolved, unquantified, or timing-sensitive items could still affect closing working capital or target-setting.
  - Use when another workstream or missing support could change the final NWC conclusion.
- `Snapshot-only limitation`
  - Use when the analysis is constrained to a limited number of dates and does not support a confident seasonality or target conclusion.
- `Sell-side reliance / what changed from seller analysis`
  - Use when the section starts from seller-prepared or prior diligence analysis and the reader needs to know what was accepted versus changed.

Ordering rules:

- Start with `NWC position and basis`.
- Follow with `Definition and scope`.
- Follow with `NWC schedule and normalization bridge`.
- Follow with `Adjustments and normalization logic`.
- Follow with `Target / peg status`.
- Add optional blocks only when their trigger conditions are met.
- When multiple optional blocks are needed, use this default order: `Working-capital drivers and seasonality` -> `Days analysis` -> `Pro forma impact` -> `Other considerations` -> `Snapshot-only limitation` -> `Sell-side reliance / what changed from seller analysis`.

Inclusion rule:

- Do not include an optional block just because the source mentions it. Include it only when it changes how the reader should interpret normalized working capital, target status, or closing mechanics.

Boundary rule:

- Do not create a generic `Data requests`, `Missing information`, or `Open items` section. Keep missing information inline with placeholders and use `Other considerations` only when unresolved items remain decision-useful.

## Available analytical units

Use these as building blocks for bullets, short sentence clusters, or numbered treatment items. Choose only the units the section needs.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each unit definition.

### `position unit`

- Purpose: state the reported and normalized NWC position, the period basis, and the directional implication.
- Use when: opening the section.
- Do not use when: repeating the same position after the bridge already established it clearly.
- Target length: 20-45 words.
- Source note: usually not needed if the bridge immediately follows.
- Example: `Average reported net working capital for FY2024 was $[x], compared with normalized net working capital of $[y] after definitional and diligence adjustments.`

### `definition unit`

- Purpose: define what is included and excluded from working capital and explain the rationale.
- Use when: setting the operating boundary of the section.
- Do not use when: replacing the definition table with prose alone.
- Target length: one table plus 1-2 clarifying bullets.
- Source note: recommended when the definition follows SPA or offer-letter mechanics rather than management presentation.
- Example: `Capex payables are excluded from working capital because they relate to non-operating investment activity and are treated outside operating closing mechanics.`

### `bridge unit`

- Purpose: show the path from reported working capital to normalized working capital.
- Use when: presenting the core exhibit.
- Do not use when: the section only has a narrative conclusion and no underlying numerical bridge.
- Target length: one table plus one source note.
- Source note: required.
- Example: `The bridge below moves from reported working capital to normalized working capital through definitional, diligence, and, where applicable, pro forma adjustments.`

### `adjustment rationale unit`

- Purpose: explain one normalization adjustment by stating the item, treatment, rationale, and impact.
- Use when: a material definitional, diligence, or pro forma adjustment affects normalized NWC.
- Do not use when: the item is a routine line-item movement rather than an adjustment.
- Target length: 30-90 words.
- Source note: recommended when the amount or basis is non-obvious.
- Example: `Interac DSO normalization ($[x]): Receivables increased as customer settlement timing extended during a temporary pricing dispute. This section normalizes the balance by applying the customer's historic DSO rather than the elevated dispute-period DSO. The adjustment decreases normalized working capital by $[x].`

### `driver unit`

- Purpose: explain the operating reason a working-capital line moved or behaves the way it does.
- Use when: receivables, inventory, payables, accruals, or deferred revenue behavior affects interpretation.
- Do not use when: the sentence simply restates a line-item balance with no explanation.
- Target length: 20-55 words.
- Source note: recommended when based on management explanation or non-obvious data.
- Example: `Trade receivables increased by $[x] as enterprise customer billings shifted later in the quarter, increasing DSO from [x] to [y] days.`

### `days unit`

- Purpose: translate line-item behavior into DSO, DIO, DPO, or similar efficiency metrics.
- Use when: days metrics are available and materially improve interpretation.
- Do not use when: the metric is unavailable or would only duplicate the driver commentary.
- Target length: 15-35 words.
- Source note: recommended.
- Example: `DPO increased from [x] to [y] days as vendor settlement timing shifted closer to month-end.`

### `target-status unit`

- Purpose: state the target comparison, or clearly state that no supported target basis or value was provided.
- Use when: concluding the section's purchase-price implication.
- Do not use when: target status is left implied or omitted.
- Target length: 18-45 words.
- Source note: required when a target or peg is stated.
- Example: `No supported target basis or value was provided, so this section presents normalized working-capital levels and sensitivities only and does not conclude on surplus or deficit.`

### `limitation note`

- Purpose: state a meaningful constraint on what the analysis supports.
- Use when: data coverage is limited, seasonality cannot be assessed, or the section relies on snapshot balances only.
- Do not use when: the note is a generic disclaimer that adds no decision-useful context.
- Target length: 18-45 words.
- Source note: recommended.
- Example: `The analysis is based on period-end balances for [Period] only, so the section does not conclude on average-seasonality target mechanics.`

### `sell-side reliance note`

- Purpose: explain how the section uses or departs from seller-prepared or prior diligence analysis.
- Use when: the working-capital analysis starts from a pre-existing schedule or report.
- Do not use when: the section is entirely first-principles and no prior analysis matters.
- Target length: 18-45 words.
- Source note: recommended.
- Example: `This section starts from the seller-prepared working-capital schedule and revises the normalization bridge for capex, tax, and out-of-period accrual treatment.`

### `other-considerations note`

- Purpose: flag a residual item that is unresolved, timing-sensitive, or not yet fully quantified.
- Use when: a remaining issue could still move closing NWC or target-setting.
- Do not use when: the item is already fully captured in the main bridge or adjustment list.
- Target length: 18-55 words.
- Source note: recommended.
- Example: `Quarter-end collection timing could move closing receivables by approximately $[x], so the final true-up should be assessed against the agreed cut-off convention at closing.`

## Assembly patterns

Use one of these patterns based on the section's complexity. These are assembly guides, not mandatory templates.

### `Simple snapshot normalization`

- Recommended block order: `NWC position and basis` -> `Definition and scope` -> `NWC schedule and normalization bridge` -> `Adjustments and normalization logic` -> `Target / peg status`
- Optional blocks typically activated: `Snapshot-only limitation` when the data does not support broader trend conclusions
- Target density: 4-6 bullets plus the core exhibits
- Stop adding detail when: the reader understands the operating definition, the small number of adjustments, and whether the analysis supports a target conclusion

### `Standard bridge-backed section`

- Recommended block order: `NWC position and basis` -> `Definition and scope` -> `NWC schedule and normalization bridge` -> `Adjustments and normalization logic` -> `Target / peg status` -> `Working-capital drivers and seasonality` when needed
- Optional blocks typically activated: `Working-capital drivers and seasonality`, sometimes `Days analysis`
- Target density: 6-10 bullets plus the core exhibits
- Stop adding detail when: the bridge is auditable, the adjustment logic is explicit, and the main operating drivers are clear

### `Seasonality / target-heavy section`

- Recommended block order: `NWC position and basis` -> `Definition and scope` -> `NWC schedule and normalization bridge` -> `Adjustments and normalization logic` -> `Working-capital drivers and seasonality` -> `Days analysis` -> `Target / peg status` -> `Other considerations` when needed
- Optional blocks typically activated: `Working-capital drivers and seasonality`, `Days analysis`, and `Other considerations`; add `Pro forma impact` or `Sell-side reliance / what changed from seller analysis` only when genuinely needed
- Target density: 8-12 bullets plus the core exhibits
- Stop adding detail when: the reader can distinguish operating seasonality from normalization adjustments and understand how that affects the target or peg conclusion

## Section-specific writing guidance

1. Lead with a quantified, period-anchored opening that states reported and normalized NWC when both are available.
2. Always define the operating boundary before interpreting the bridge.
3. Use the bridge as the structural anchor and keep the narrative tied to it.
4. Write adjustments as numbered full-sentence rationale units that state the item, treatment, reason, and impact.
5. Keep cause-and-effect driver commentary focused on what actually changes interpretation of normalized NWC.
6. Use days metrics only when they add meaning beyond the line-item commentary.
7. State target or peg conclusions only when the basis and value are sourced; otherwise explicitly state that no supported target basis or value was provided.
8. Use `Other considerations` only for unresolved or timing-sensitive items that still matter to closing or target-setting.
9. Avoid extraction artifacts, malformed placeholders, and renderer-era slot language.
10. Avoid turning the section into a mandatory exhibit pack when the evidence only supports a simpler bridge-backed narrative.

## Verification and review checks

Use these checks before finalizing a Net Working Capital draft.

1. `NWC position and basis`, `Definition and scope`, `NWC schedule and normalization bridge`, `Adjustments and normalization logic`, and `Target / peg status` all exist.
2. The section is anchored to explicit dates or periods and uses consistent units.
3. The definition table states included accounts, excluded accounts, and rationale.
4. The bridge shows reported working capital, definitional adjustments, diligence adjustments, and normalized working capital; pro forma appears only when actually needed.
5. Every material adjustment rationale states the item, treatment, reason, and impact.
6. Target / peg status either states a sourced comparison or explicitly states that no supported target basis or value was provided.
7. Optional blocks appear only when their trigger rules are met.
8. `Working-capital drivers and seasonality` and `Days analysis` do not appear unless they materially improve interpretation.
9. `Other considerations` contains unresolved or timing-sensitive issues, not a generic missing-information list.
10. No extraction-artifact language appears, including `Not present in source report` or `extraction policy`.
11. No slot, layout, or `deckSpec` language appears in the drafted section.
12. Missing information uses inline placeholders rather than unsupported claims or separate open-item headings.
13. The final draft reflects the bridge-centered, adjustment-rationale model shown in this reference.
14. Language and tone pass `references/global-writing-conventions.md`.
15. Split any adjustment item or driver block that becomes difficult to scan or tries to do more than one analytical job.

## Full examples

### Example 1: Simple no-target normalization

```markdown
## Net working capital

### NWC position and basis

- As at December 31, 2024, reported net working capital was $7.5 million and normalized net working capital was $10.6 million after definitional and diligence adjustments.
- This section is based on period-end balances as at December 31, 2024 and does not conclude on a target or peg because no supported target basis or value was provided.

### Definition and scope

| Included in NWC | Excluded from NWC | Rationale |
| --- | --- | --- |
| Trade accounts receivable | Cash and cash equivalents | Cash is addressed in net debt and excluded from operating working capital. |
| Inventory | Income taxes payable | Tax balances are treated outside operating working capital for purchase price purposes. |
| Prepaid and other operating current assets | Debt-like or financing liabilities | Financing and debt-like balances are assessed outside operating working capital. |
| Trade payables and operating accruals | Capex payables | Capex-related balances do not represent recurring operating funding. |
| Current deferred revenue | Non-current or non-operating balances | Non-current and non-operating items are outside target operating working capital. |

- The working-capital definition in this section follows management classification adjusted for identified non-operating and debt-like items.

### NWC schedule and normalization bridge

Source note: Management-prepared working-capital schedule as at December 31, 2024, reconciled to the December 2024 trial balance.

| Line item | Balance ($m) |
| --- | ---: |
| Trade receivables | 24.6 |
| Inventory | 10.2 |
| Prepaid and other operating current assets | 5.2 |
| Trade payables | (14.7) |
| Operating accruals | (8.3) |
| Deferred revenue | (9.5) |
| **Reported net working capital** | **7.5** |
| Definitional adjustments | 2.6 |
| Diligence adjustments | 0.5 |
| **Normalized net working capital** | **10.6** |

### Adjustments and normalization logic

1. Income taxes payable exclusion ($2.1 million): This balance relates to tax liabilities rather than recurring operating funding. The section excludes it from normalized working capital because it is outside the agreed operating boundary. The adjustment increases normalized working capital by $2.1 million.
2. Capex payables exclusion ($0.7 million): This balance relates to fixed-asset supplier invoices and does not represent recurring operating funding. The adjustment increases normalized working capital by $0.7 million.
3. Out-of-period payroll accrual correction ($0.5 million): This balance includes payroll accruals recorded in December 2024 that relate to prior periods. The section normalizes the accrual to align it with the related service period, increasing normalized working capital by $0.5 million.

### Target / peg status

- No supported target basis or value was provided, so this section presents normalized working-capital levels only and does not conclude on surplus or deficit.

### Snapshot-only limitation

- The analysis is based on period-end balances only, so it does not support a conclusion on average-seasonality target mechanics.
```

### Example 2: Schedule-backed section with drivers, modeled adjustment, and target

```markdown
## Net working capital

### NWC position and basis

- Average reported net working capital for FY2024 was $7.5 million, compared with average normalized net working capital of $12.6 million after definitional, diligence, and pro forma adjustments.
- Based on the draft SPA dated January 20, 2025, normalized net working capital indicates a $0.5 million surplus against the agreed target basis.

### Definition and scope

| Included in NWC | Excluded from NWC | Rationale |
| --- | --- | --- |
| Trade accounts receivable | Cash and cash equivalents | Cash is excluded from operating working capital and addressed in net debt. |
| Inventory | Income taxes payable | Tax balances are outside operating working capital for purchase price purposes. |
| Prepaid and other operating current assets | Debt-like and financing liabilities | Financing and debt-like balances are outside the operating working-capital perimeter. |
| Trade payables and operating accruals | Capex payables | Capex-related balances do not represent recurring operating funding. |
| Current deferred revenue | Non-current or non-operating balances | Non-current and non-operating items fall outside the target operating definition. |

- The working-capital definition in this section follows the draft SPA definition as at January 20, 2025.
- Where management classification differs from SPA treatment, the bridge below applies the required definitional adjustments.

### NWC schedule and normalization bridge

Source note: Management trial balance extracts FY2022-FY2024 and monthly working-capital schedules prepared for transaction support.

| Line item | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
| --- | ---: | ---: | ---: | ---: |
| Trade receivables | 18.4 | 21.8 | 24.6 | 25.1 |
| Inventory | 8.9 | 9.6 | 10.2 | 10.3 |
| Prepaid and other operating current assets | 4.1 | 4.7 | 5.2 | 5.4 |
| Trade payables | (12.8) | (13.9) | (14.7) | (14.9) |
| Operating accruals | (6.5) | (7.1) | (8.3) | (8.4) |
| Deferred revenue | (6.7) | (7.9) | (9.5) | (9.7) |
| **Reported net working capital** | **5.4** | **7.2** | **7.5** | **7.8** |
| Definitional adjustments | 3.1 | 3.8 | 4.4 | 4.5 |
| Diligence adjustments | 0.4 | 0.7 | 0.5 | 0.4 |
| Pro forma adjustments | 0.2 | 0.3 | 0.4 | 0.3 |
| **Normalized net working capital** | **9.1** | **12.0** | **12.8** | **13.0** |

### Adjustments and normalization logic

1. Income taxes payable exclusion ($2.6 million): This balance includes current tax liabilities that do not arise from operating trading flows. The section excludes it from normalized working capital because the draft SPA treats it outside operating working capital. The adjustment increases normalized working capital by $2.6 million.
2. Capex payables exclusion ($1.2 million): This balance includes supplier invoices related to fixed-asset projects. The section excludes it from normalized working capital because these balances are capex-related and outside operating closing mechanics. The adjustment increases normalized working capital by $1.2 million.
3. Out-of-period payroll accrual correction ($0.5 million): This balance includes payroll accruals recorded in December 2024 that relate to periods prior to Q4 2024. The section normalizes the accrual to the related service period, increasing normalized working capital by $0.5 million.
4. Customer-specific DSO normalization (($0.4) million): Average days sales outstanding for one major customer increased from 45 days to 86 days between September 2023 and June 2024 while disputed invoices were under internal review. This section normalizes the receivable balance by applying the customer's historic 45-day DSO to the affected revenue stream rather than the elevated dispute-period collection profile. The adjustment decreases normalized working capital by $0.4 million because payment timing returned to historic patterns after the dispute was resolved.
5. Pro forma receivables timing adjustment ($0.4 million): This balance reflects receivables timing effects linked to the run-rate revenue assumptions used in the QoE bridge. The section includes the related receivables effect so normalized working capital aligns with the pro forma trading basis. The adjustment increases normalized working capital by $0.4 million.

### Target / peg status

- Deal definition / source: Draft SPA, dated January 20, 2025.
- Target basis: Average normalized net working capital over the 12 months preceding completion.
- Average normalized net working capital for FY2024 was $12.6 million versus a target of $12.5 million, implying a $0.1 million surplus on this basis.

### Working-capital drivers and seasonality

- Trade receivables increased by $6.2 million from FY2022 to FY2024, primarily driven by higher enterprise billing volume and slower quarter-end collections. Reported DSO increased from 53 to 56 days overall, but the normalization bridge separately adjusts one dispute-related customer balance back to its historic collection profile.
- Inventory increased by $1.3 million over the same period, primarily driven by safety-stock builds in FY2023 and more stable purchasing cadence in FY2024.
- Trade payables and operating accruals increased by $3.7 million from FY2022 to FY2024, primarily due to higher vendor spend and variable compensation accruals in line with revenue growth.
- Deferred revenue increased by $2.8 million as annual contract pre-billing expanded, reducing reported working capital while supporting recurring cash conversion.

### Days analysis

| Working-capital days | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
| --- | ---: | ---: | ---: | ---: |
| DSO | 53 | 54 | 56 | 55 |
| DIO | 46 | 45 | 42 | 42 |
| DPO | 47 | 47 | 49 | 48 |

### Other considerations

- Quarter-end collection timing remains a key swing factor for closing receivables and could move closing working capital by approximately $0.4 million.
- Deferred revenue seasonality is concentrated around annual contract renewal months and should be considered when comparing a closing-month balance to the average target basis.
```
