# Section contract: QoE and earnings adjustments

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

Present a period-anchored bridge from reported earnings to adjusted earnings, with explicit adjustment rationale, recurrence treatment, and basis support.

This section should default to EBITDA unless the engagement defines another earnings metric.

The section must read as client-ready diligence writing: factual, quantified, and clear about what is included in adjusted earnings versus what remains outside the bridge.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with a quantified headline that states reported versus adjusted earnings and the primary adjustment categories.
2. Define scope and metric basis before analysis, including period coverage, unit convention, and any perimeter limitations.
3. Show the full reported-to-adjusted bridge before adjustment commentary.
4. Group adjustments by type (`Management`, `Diligence`, `Pro forma` where applicable) and keep this ordering consistent in the bridge and narrative.
5. Write each adjustment as a full sentence in this pattern: `[Adjustment] ($[x]): [what it includes]. [why it is included, reversed, or normalized]. [how it affects adjusted earnings and recurrence view].`
6. State recurrence explicitly as `Non-recurring`, `Run-rate`, `Recurring`, or `Uncertain`, and align each label to a stated rationale.
7. State basis support for each material adjustment (for example, invoices, trial balance detail, contracts, payroll support, or management representation).
8. Keep potentially earnings-relevant items that are not fully quantifiable in `Other considerations (not included in adjusted earnings)`, and state why they remain outside the bridge.
9. Keep sensitivities focused on valuation-relevant variables that can move adjusted earnings from the current bridge.
10. Keep bullets complete and active, and avoid clipped fragments or drafting-note language.

## Layout

Scale the depth of the section based on adjustment volume, degree of judgment, and whether pro forma assumptions materially affect adjusted earnings.

Target length:
- 380-1,050 words (including bridge and adjustment rationale)

Required blocks:
- `Headline position`
- `Scope and basis`
- `Reported to adjusted earnings bridge`
- `Earnings adjustments and rationale`
- `Other considerations (not included in adjusted earnings)`
- `Key sensitivities`

Scaling rules:
- Keep concise when adjustments are few, recurrence treatment is clear, and support is complete.
- Expand `Scope and basis` when metric definition or perimeter differs from statutory reporting.
- Expand `Earnings adjustments and rationale` with grouped subheaders when adjustments exceed eight lines.
- Expand `Other considerations (not included in adjusted earnings)` when management-identified items remain unquantified or highly judgmental.
- Expand `Key sensitivities` when normalized earnings depend on assumptions that could reasonably shift near-term outcomes.

Block slot map:
- `Headline position`: 1 `textArray` (1-3 bullets)
- `Scope and basis`: 1 `textArray` (3-6 bullets) + optional 1 `text` source note
- `Reported to adjusted earnings bridge`: 1 `table` (bridge) + optional 1 `table` (margin view) + 1 `text` source note
- `Earnings adjustments and rationale`: 1 `textArray` (4-14 numbered items), grouped by type when needed
- `Other considerations (not included in adjusted earnings)`: 1 `textArray` (2-6 bullets)
- `Key sensitivities`: 1 `textArray` (2-5 bullets)

## Available slot shapes

### `text`
- Plain string.
- Use for source notes and short labels.

### `textArray`
- Array of bullets or short numbered statements.
- Use for all narrative blocks.

### `table`
- Object with `headers` and `rows`.
- Use for bridge and optional margin exhibit.

### `bodyStyle`
- `"bullets"` or `"paragraphs"` only.
- Default to `"bullets"` for this section.

## Render skeleton

```markdown
## QoE and earnings adjustments

### Headline position
- Over [Period], reported EBITDA of $[x] adjusts to $[y], primarily due to [management adjustment categories], [diligence adjustment categories], and [pro forma categories if applicable].
- In [latest period], adjusted EBITDA of $[x] compares with reported EBITDA of $[y], with the largest impact from [named adjustments].
- Adjusted EBITDA margin is [x]% in [latest period], compared with reported EBITDA margin of [x]%, based on revenue of $[x].

### Scope and basis
- The bridge covers [FY20XX-FY20XX / TTM as at Date] and uses [EBITDA / EBT / other] as the earnings metric for normalization.
- Units in this section are presented in $[m/k], and period labels align to management reporting calendars used in the diligence data set.
- The perimeter includes [included entities/business lines] and excludes [excluded entities/business lines], with exclusions treated as [out of scope / separate analysis].
- Management adjustments reflect items identified by management and tested for recurrence and basis support.
- Diligence adjustments reflect additional items identified during diligence to align earnings to underlying trading performance.
- Pro forma adjustments are included only where run-rate assumptions are supported and directly linked to post-transaction operating expectations.
- Source note: [source_note optional]

### Reported to adjusted earnings bridge ([Period], $[units])
Source note: [source_note required]

| Line item | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] | Recurrence |
|---|---:|---:|---:|---:|---|
| Reported EBITDA | $[x] | $[x] | $[x] | $[x] | N/A |
| Management: Owner compensation normalization | $[x] | $[x] | $[x] | $[x] | [Non-recurring / Run-rate / Recurring / Uncertain] |
| Management: One-time transaction and advisory fees | $[x] | $[x] | $[x] | $[x] | [Non-recurring / Run-rate / Recurring / Uncertain] |
| Management: [additional item] | $[x] | $[x] | $[x] | $[x] | [Non-recurring / Run-rate / Recurring / Uncertain] |
| Diligence: Reverse recurring management add-back | ($[x]) | ($[x]) | ($[x]) | ($[x]) | [Non-recurring / Run-rate / Recurring / Uncertain] |
| Diligence: Revenue cut-off normalization | $[x] | $[x] | $[x] | $[x] | [Non-recurring / Run-rate / Recurring / Uncertain] |
| Diligence: Payroll accrual normalization | $[x] | $[x] | $[x] | $[x] | [Non-recurring / Run-rate / Recurring / Uncertain] |
| Pro forma: Run-rate operating savings (if applicable) | $[x] | $[x] | $[x] | $[x] | [Non-recurring / Run-rate / Recurring / Uncertain] |
| Pro forma: Run-rate incremental costs (if applicable) | ($[x]) | ($[x]) | ($[x]) | ($[x]) | [Non-recurring / Run-rate / Recurring / Uncertain] |
| **Total adjustments** | **$[x]** | **$[x]** | **$[x]** | **$[x]** | N/A |
| **Adjusted EBITDA** | **$[x]** | **$[x]** | **$[x]** | **$[x]** | N/A |

| Margin view | FY[20XX] | FY[20XX] | FY[20XX] | [LTM/TTM] [Date] |
|---|---:|---:|---:|---:|
| Revenue | $[x] | $[x] | $[x] | $[x] |
| Reported EBITDA margin (%) | [x]% | [x]% | [x]% | [x]% |
| Adjusted EBITDA margin (%) | [x]% | [x]% | [x]% | [x]% |

### Earnings adjustments and rationale
1. Owner compensation normalization ($[x]): This adjustment replaces above-market owner compensation with a normalized market benchmark for equivalent operating roles. The bridge includes this adjustment because reported payroll includes compensation levels that do not reflect expected go-forward management structure. This adjustment [increases/decreases] adjusted EBITDA by $[x], and the recurrence classification is [run-rate/non-recurring/uncertain] based on [basis].
2. One-time transaction and advisory fees ($[x]): This adjustment removes transaction-specific legal, advisory, and diligence costs recorded in [Period]. The bridge removes these costs because they relate to contemplated transaction activity and are not expected in normalized operations. This adjustment [increases/decreases] adjusted EBITDA by $[x], and the recurrence classification is [run-rate/non-recurring/uncertain] based on [basis].
3. Reverse recurring management add-back ($[x]): This adjustment reverses a management add-back for costs that recur in normal operations, such as annual audit or ongoing compliance spend. The bridge reverses this treatment to align adjusted EBITDA with recurring operating cost requirements. This adjustment [increases/decreases] adjusted EBITDA by $[x], and the recurrence classification is [recurring/run-rate] based on [basis].
4. Revenue cut-off normalization ($[x]): This adjustment aligns revenue recognition to the period in which underlying services were delivered. The bridge includes this adjustment where reported timing differences distort period comparability. This adjustment [increases/decreases] adjusted EBITDA by $[x], and the recurrence classification is [non-recurring/uncertain] based on [basis].
5. Payroll accrual normalization ($[x]): This adjustment aligns payroll accrual timing with the related service period and removes out-of-period posting effects. The bridge includes this adjustment to present period-consistent operating payroll expense. This adjustment [increases/decreases] adjusted EBITDA by $[x], and the recurrence classification is [non-recurring/run-rate] based on [basis].
6. Run-rate operating savings ($[x]): This adjustment reflects supported cost savings from [specific initiative], effective from [Date], that are expected to persist post-transaction. The bridge includes this adjustment because executed contracts and implementation status support the run-rate assumption. This adjustment [increases/decreases] adjusted EBITDA by $[x], and the recurrence classification is [run-rate] based on [basis].
7. Run-rate incremental costs ($[x]): This adjustment reflects incremental recurring costs required to operate the business on a standalone basis, such as [specific cost category]. The bridge includes this adjustment to avoid overstating normalized earnings where these costs are not fully reflected in reported periods. This adjustment [increases/decreases] adjusted EBITDA by $[x], and the recurrence classification is [run-rate] based on [basis].
- Source note: [source_note optional]

### Other considerations (not included in adjusted earnings)
- [Item]: [Describe the earnings-relevant issue]. This item remains outside the bridge because [quantification or support limitation], and final treatment depends on [specified evidence or event].
- [Item]: [Describe the earnings-relevant issue]. This item is not included because treatment remains judgmental at [Date], and the potential adjusted EBITDA effect is currently unquantified.
- [Item]: [Describe the earnings-relevant issue]. This item may affect normalized earnings if [condition], and should be reassessed when [support] is available.

### Key sensitivities
- Adjusted EBITDA is most sensitive to [named assumption], where a [x]% change would move adjusted EBITDA by approximately $[x].
- Adjusted EBITDA is also sensitive to [named assumption], particularly if [specific condition] changes in [next period].
- If [identified assumption] is not realized, adjusted EBITDA could move toward the lower end of the normalized range.
```

## Common mistakes (and fixes)

1. Mistake: presenting a narrative without a full reported-to-adjusted bridge.
- Fix: include a complete bridge with reported earnings, adjustment lines, total adjustments, and adjusted earnings.

2. Mistake: mixing management, diligence, and pro forma logic without clear labels.
- Fix: group adjustments by type and keep labels consistent in table and narrative.

3. Mistake: classifying adjustments as non-recurring without support.
- Fix: state recurrence explicitly and provide basis for the recurrence conclusion.

4. Mistake: putting unquantified items into the bridge.
- Fix: keep unquantified or highly judgmental items in `Other considerations (not included in adjusted earnings)`.

5. Mistake: using shorthand fragments in adjustment bullets.
- Fix: write complete full-sentence adjustments with what, why, treatment, and implication.

6. Mistake: adding drafting notes or non-client language.
- Fix: keep client-ready wording and use inline placeholders where data is missing.

## Structural preflight rules (must pass)

1. All six required blocks exist and are in this exact order.
2. The bridge includes reported earnings, total adjustments, and adjusted earnings for each period shown.
3. Every material bridge line includes a recurrence label.
4. `Earnings adjustments and rationale` includes at least four numbered items with quantified impact and treatment logic.
5. `Other considerations (not included in adjusted earnings)` clearly states why each item is outside the bridge.
6. `Key sensitivities` includes at least two quantified or directionally explicit sensitivities.
7. No missing-information headings (for example, `Data requests`) appear.
8. Missing data is handled with inline placeholders, not unsupported claims.
9. Render skeleton and full example are materially different (template vs worked output).
10. Language and tone pass global conventions.

## Split policy rules

1. Split `Earnings adjustments and rationale` into grouped sub-themes when items exceed 10.
2. Split any adjustment item longer than 115 words into two tighter bullets.
3. Split the bridge into core and supplemental exhibits when rows exceed readability.
4. Split sensitivities into operating versus accounting sensitivities when more than four items are required.

## Full example

```markdown
## QoE and earnings adjustments

### Headline position
- Over FY2022 to FY2024, reported EBITDA of $18.6 million adjusted to $26.7 million, primarily due to owner compensation normalization, removal of one-time transaction costs, and supported run-rate operating adjustments.
- In TTM December 2024, adjusted EBITDA was $27.7 million versus reported EBITDA of $24.8 million, with the largest bridge impact from one-time advisory fees and run-rate facility savings.
- Adjusted EBITDA margin was 15.8% in TTM December 2024, compared with a reported EBITDA margin of 14.1%, based on revenue of $175.3 million.

### Scope and basis
- The bridge covers FY2022 to FY2024 and TTM December 2024, and uses EBITDA as the earnings metric for normalization.
- Units in this section are presented in $m, and periods align to management reporting calendars used in diligence.
- The perimeter includes domestic operating entities and excludes the discontinued JV disposed in Q2 FY2023.
- Management adjustments reflect items initially identified by management and then tested for recurrence and support.
- Diligence adjustments reflect additional items identified during diligence to align earnings to underlying trading performance.
- Pro forma adjustments are included only where signed contracts, implemented actions, or payroll actions support run-rate treatment.
- Source note: Management trial balances, audited financial statements FY2022-FY2024, payroll detail, vendor invoices, and signed facility and outsourcing agreements.

### Reported to adjusted earnings bridge (FY2022-FY2024 and TTM Dec-2024, $m)
Source note: Management-reported EBITDA bridge workbook reconciled to trial balances and supporting schedules.

| Line item | FY2022 | FY2023 | FY2024 | TTM Dec-2024 | Recurrence |
|---|---:|---:|---:|---:|---|
| Reported EBITDA | 18.6 | 22.4 | 24.1 | 24.8 | N/A |
| Management: Owner compensation normalization | 1.1 | 1.2 | 1.2 | 1.2 | Run-rate |
| Management: One-time transaction and advisory fees | 0.0 | 0.4 | 1.6 | 1.7 | Non-recurring |
| Management: Non-recurring litigation settlement | 0.0 | 1.3 | 0.0 | 0.0 | Non-recurring |
| Diligence: Reverse recurring management audit add-back | (0.6) | (0.6) | (0.7) | (0.7) | Recurring |
| Diligence: Revenue cut-off normalization | (0.4) | 0.3 | 0.0 | 0.0 | Non-recurring |
| Diligence: Payroll accrual normalization | (0.2) | 0.1 | 0.2 | 0.2 | Non-recurring |
| Pro forma: Run-rate facility savings | 0.0 | 0.0 | 0.8 | 1.0 | Run-rate |
| Pro forma: Run-rate IT outsourcing cost | (0.3) | (0.4) | (0.5) | (0.5) | Run-rate |
| **Total adjustments** | **(0.4)** | **2.3** | **2.6** | **2.9** | N/A |
| **Adjusted EBITDA** | **18.2** | **24.7** | **26.7** | **27.7** | N/A |

| Margin view | FY2022 | FY2023 | FY2024 | TTM Dec-2024 |
|---|---:|---:|---:|---:|
| Revenue | 142.0 | 158.4 | 171.6 | 175.3 |
| Reported EBITDA margin (%) | 13.1% | 14.1% | 14.0% | 14.1% |
| Adjusted EBITDA margin (%) | 12.8% | 15.6% | 15.6% | 15.8% |

### Earnings adjustments and rationale
1. Owner compensation normalization ($1.2 million in FY2024): Reported payroll includes compensation levels for two owner-operators above market rates for equivalent executive roles. The bridge replaces these costs with benchmarked compensation levels consistent with expected go-forward structure. This adjustment increases adjusted EBITDA by $1.2 million in FY2024, and recurrence is classified as run-rate because normalized compensation is expected to continue.
2. One-time transaction and advisory fees ($1.6 million in FY2024): Reported professional fees include legal, advisory, and diligence costs tied to the current transaction process. The bridge removes these costs because they are event-driven and not required for ongoing operations. This adjustment increases adjusted EBITDA by $1.6 million in FY2024, and recurrence is classified as non-recurring based on invoice detail and GL coding.
3. Reverse recurring management audit add-back (($0.7) million in FY2024): Management initially added back annual audit and compliance costs as non-recurring. The bridge reverses this treatment because these services recur annually and remain required for ongoing reporting obligations. This adjustment decreases adjusted EBITDA by $0.7 million in FY2024, and recurrence is classified as recurring.
4. Revenue cut-off normalization ($0.3 million in FY2023): Billing in Q4 FY2023 included revenue recognized before service delivery for a subset of contracts. The bridge re-allocates these amounts to the correct service period to improve period comparability. This adjustment increases adjusted EBITDA by $0.3 million in FY2023, and recurrence is classified as non-recurring because management implemented a revised month-end cut-off protocol from Q1 FY2024.
5. Payroll accrual normalization ($0.2 million in FY2024): Payroll accrual timing in FY2024 included an out-of-period posting that understated current-period compensation expense. The bridge normalizes the accrual to the related service period to align expenses with underlying operations. This adjustment increases adjusted EBITDA by $0.2 million in FY2024, and recurrence is classified as non-recurring based on corrected accrual procedures in subsequent months.
6. Run-rate facility savings ($0.8 million in FY2024): Management consolidated two leased sites into one distribution hub, with savings supported by executed lease exits and updated operating payroll schedules. The bridge reflects the supported run-rate savings from this consolidation. This adjustment increases adjusted EBITDA by $0.8 million in FY2024, and recurrence is classified as run-rate.
7. Run-rate IT outsourcing cost (($0.5) million in FY2024): The business transitioned selected IT support functions from internal staff to a managed services contract effective July 2024. The bridge includes the full-year run-rate service cost to avoid overstating normalized earnings in periods with partial implementation. This adjustment decreases adjusted EBITDA by $0.5 million in FY2024, and recurrence is classified as run-rate.

### Other considerations (not included in adjusted earnings)
- Customer contract repricing risk: Two top-ten customer contracts renew in Q3 FY2025, and final pricing terms are not yet agreed. This item remains outside the bridge because the EBITDA impact depends on commercial outcomes that are not finalized.
- Performance bonus policy redesign: Management indicated a revised variable compensation framework effective FY2025, but final design parameters and payout thresholds are not documented. This item is not included because the run-rate impact is not yet quantifiable.
- Insurance renewal exposure: The FY2025 policy renewal process is ongoing, and final premium quotations are pending. This item remains outside the bridge because final cost impact cannot be determined as at December 2024.

### Key sensitivities
- A 1.0% change in realized gross margin would move adjusted EBITDA by approximately $1.8 million on the TTM December 2024 revenue base.
- If the facility savings implementation runs three months behind plan, adjusted EBITDA would be lower by approximately $0.3 million.
- If outsourced IT scope expands by 10% above current contracted volumes, adjusted EBITDA would decrease by approximately $0.2 million.
```
