# Section contract: Quality of net assets

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

Present a period-anchored bridge from reported net asset value (`NAV`) to adjusted `NAV`, with clear treatment of quantifiable adjustments and clear separation of items that remain subjective or unquantified.

The section must read as client-ready diligence writing: factual, concise, and explicit about transaction perimeter, adjustment basis, and closing implications.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with a quantified headline that states reported `NAV`, adjusted `NAV`, the as-at date, and the largest adjustment drivers.
2. Define basis of presentation before analysis, including transaction perimeter, source balances, and unit convention.
3. Show the reported-to-adjusted `NAV` bridge before commentary.
4. Present `Net asset adjustments and rationale` as a numbered list, with each item written as a complete sentence in this pattern: `Item ($[x]): [what the balance includes as at date]. [how it is treated and why]. [closing implication where relevant].`
5. Keep adjustments tied to purchase-price relevance and avoid generic accounting narration that does not affect treatment.
6. Use `Other considerations` for potentially `NAV`-relevant items that are subjective, contingent, or not fully quantifiable at report date.
7. If standalone costs or unfinalized estimates are not included in adjusted `NAV`, state this clearly and keep them in `Other considerations`.
8. Use active voice and complete sentences; avoid clipped fragments and process notes.
9. If an average view is shown, state exactly how the average is calculated and keep the calculation basis consistent.

## Layout

Scale depth based on perimeter complexity, adjustment volume, and estimate sensitivity.

Target length:
- 340-880 words (including bridge and adjustment rationale)

Required blocks:
- `Headline position`
- `Basis of presentation and scope`
- `Reported to adjusted NAV bridge`
- `Net asset adjustments and rationale`
- `Other considerations`
- `Transaction and closing implications`

Scaling rules:
- Keep concise when perimeter is straightforward and adjustment volume is limited.
- Expand `Basis of presentation and scope` when legal-entity reporting differs from transaction perimeter.
- Expand `Net asset adjustments and rationale` with category subheaders when adjustments exceed eight lines.
- Expand `Other considerations` when estimate-based, contingent, or timing-dependent items could move final `NAV`.
- Expand `Transaction and closing implications` when classification alignment across `NAV`, net debt, and working capital is required.

Block slot map:
- `Headline position`: 1 `textArray` (1-3 bullets)
- `Basis of presentation and scope`: 1 `textArray` (3-6 bullets) + optional 1 `text` source note
- `Reported to adjusted NAV bridge`: 1 `table` + optional 1 `table` (average view) + 1 `text` source note
- `Net asset adjustments and rationale`: 1 `textArray` (4-12 numbered items), grouped by category when needed
- `Other considerations`: 1 `textArray` (2-6 bullets)
- `Transaction and closing implications`: 1 `textArray` (2-5 bullets)

## Available slot shapes

### `text`
- Plain string.
- Use for source notes and short labels.

### `textArray`
- Array of bullets or short numbered statements.
- Use for all narrative blocks.

### `table`
- Object with `headers` and `rows`.
- Use for bridge and optional average-view exhibits.

### `bodyStyle`
- `"bullets"` or `"paragraphs"` only.
- Default to `"bullets"` for this section.

## Render skeleton

```markdown
## Quality of net assets

### Headline position
- As at [Date], reported net asset value was $[x], and adjusted net asset value was $[y] after total adjustments of $[z].
- The largest bridge drivers were [Item 1] ($[x]), [Item 2] ($[x]), and [Item 3] ($[x]), which together [increased/decreased] adjusted net asset value.
- [Optional] On a [monthly/quarterly] average basis for [Period], reported net asset value was $[x] and adjusted net asset value was $[y].

### Basis of presentation and scope
- This analysis is prepared on a [transaction perimeter / reporting perimeter] basis and includes [included entities/business lines].
- Reported net asset value represents total assets less total liabilities from [source pack] as at [Date].
- Adjusted net asset value reflects diligence adjustments identified through [Date], including [definitional / one-time / reclassification] items.
- This section excludes [standalone cost build / post-close synergies / out-of-scope balances] from adjusted net asset value, and captures these items in `Other considerations` where relevant.
- Units are presented in $[m/k], and any average columns are calculated using [monthly/quarterly] balances for each period shown.
- Source note: [source_note optional]

### Reported to adjusted NAV bridge (as at [Date], $[units])
Source note: [source_note required]

| Line item | Impact on NAV ($[units]) |
|---|---:|
| Reported NAV | [x] |
| Remove excess non-transferring cash | ([x]) |
| Remove [tax receivable/provision or similar item] | ([x]) |
| Normalize [policy or estimate item] | ([x]) |
| Remove intercompany balances outside perimeter | ([x]) |
| Add post-transaction payable requirements | ([x]) |
| Remove non-recurring deferred revenue or liability | ([x]) |
| [Other adjustment] | [x/(x)] |
| **Total adjustments** | **([x]) / [x]** |
| **Adjusted NAV** | **[x]** |

| Average NAV view (optional) | FY[20XX] | FY[20XX] | FY[20XX] |
|---|---:|---:|---:|
| Average reported NAV | [x] | [x] | [x] |
| Average adjusted NAV | [x] | [x] | [x] |

### Net asset adjustments and rationale
1. Remove excess non-transferring cash ($[x]): Reported cash includes balances that are not expected to transfer with the transaction perimeter. This adjustment removes these balances and retains only operating cash required for daily operations as at [Date].
2. [Item] ($[x]): The balance includes [description]. This adjustment [removes/adds] the balance because [treatment rationale tied to transaction mechanics], and this treatment [increases/decreases] adjusted net asset value by $[x].
3. [Item] ($[x]): The balance includes [description]. This adjustment [removes/adds] the balance because [rationale], and final treatment at closing depends on [defined support or event].
4. [Item] ($[x]): The balance includes [description]. This adjustment [removes/adds] the balance to align adjusted net asset value with [deal definition / normalized basis].
5. [Item] ($[x]): The balance includes [description]. This adjustment [removes/adds] the balance because [rationale], and the closing impact is expected to be [directional effect].
- Source note: [source_note optional]

### Other considerations
- Other considerations include potentially net-asset-relevant items that are subjective, contingent, or not fully quantifiable at [Date].
- [Item]: This item may [increase/decrease] net asset value depending on [defined condition], and the amount is currently unquantified.
- [Item]: This item is not included in adjusted net asset value because [reason], and final treatment depends on [specific support or event].
- [Item]: This item may affect purchase-price mechanics at closing, and the deal team should finalize treatment once [support] is available.

### Transaction and closing implications
- The adjusted net asset value bridge provides the current purchase-price view as at [Date], subject to closing-date updates for [named balances].
- Closing funds-flow mechanics should apply consistent treatment across net assets, net debt, and working capital to avoid overlap or omission.
- Where support remains pending, this section states directional treatment and expected closing impact range rather than a fixed amount.
```

## Common mistakes (and fixes)

1. Mistake: presenting only reported net assets with no bridge to adjusted `NAV`.
- Fix: include a full reported-to-adjusted bridge with total adjustments and adjusted `NAV`.

2. Mistake: unclear perimeter and source basis.
- Fix: define included entities, source balances, and period/unit anchors before adjustment commentary.

3. Mistake: adjustment bullets read like fragments.
- Fix: write numbered, full-sentence items that state what the balance includes, how it is treated, and why.

4. Mistake: using `Other considerations` as a generic request list.
- Fix: include only potentially `NAV`-relevant items and state directional treatment plus quantification status.

5. Mistake: adding a comments column to the bridge table.
- Fix: keep tables numeric and place explanatory reasoning in `Net asset adjustments and rationale`.

6. Mistake: adding separate missing-information headings (for example, `Data requests`).
- Fix: keep unresolved points inside `Other considerations` and `Transaction and closing implications`.

## Structural preflight rules (must pass)

1. All six required blocks exist and are in this exact order.
2. The section includes an explicit `as at [Date]` anchor in `Headline position` and in the bridge title.
3. The bridge includes `Reported NAV`, `Total adjustments`, and `Adjusted NAV`.
4. `Adjusted NAV` equals `Reported NAV` plus `Total adjustments` in the full example.
5. `Net asset adjustments and rationale` includes at least five numbered adjustments with treatment rationale.
6. `Other considerations` includes at least two items with directional treatment and quantification status.
7. No missing-information headings (for example, `Data requests`) appear.
8. No bridge table includes a comments column.
9. Missing information is handled with inline placeholders, not process notes.
10. Render skeleton and full example are materially different (template vs worked output).
11. Language and tone pass global conventions.

## Split policy rules

1. Split `Net asset adjustments and rationale` into category sub-blocks when items exceed eight.
2. Split any adjustment item longer than 110 words into two tighter bullets.
3. Split bridge exhibits into core and supplemental tables when rows exceed readability.
4. Split `Other considerations` into estimate, contingent, and closing-timing themes when items exceed five bullets.

## Full example

```markdown
## Quality of net assets

### Headline position
- As at December 31, 2024, reported net asset value was $1,285 million, and adjusted net asset value was $1,007 million after total downward adjustments of $278 million.
- The largest bridge drivers were removal of intercompany balances outside perimeter ($140 million), removal of excess non-transferring cash ($44 million), and treatment of notional input tax credit balances ($37 million).
- On a monthly average basis for FY2024, reported net asset value was $1,254 million and adjusted net asset value was $989 million.

### Basis of presentation and scope
- This analysis is prepared on the transaction perimeter and includes all operating entities expected to transfer at completion.
- Reported net asset value represents total assets less total liabilities from the December 2024 management balance sheet reconciled to trial balance support.
- Adjusted net asset value reflects diligence adjustments identified through February 2025 for non-transferring balances, normalization items, and perimeter-driven reclassifications.
- Standalone cost build assumptions are excluded from adjusted net asset value and are presented in `Other considerations` where they may influence post-close payables.
- Units are presented in $m, and average values are calculated from monthly balances within each fiscal year.
- Source note: Management balance-sheet packs, December 2024 trial balance, and adjustment support schedules prepared for transaction diligence.

### Reported to adjusted NAV bridge (as at December 31, 2024, $m)
Source note: Quality of net assets bridge workbook reconciled to December 2024 management financial reporting pack.

| Line item | Impact on NAV ($m) |
|---|---:|
| Reported NAV | 1,285 |
| Remove excess non-transferring cash | (44) |
| Remove NITC receivable and related provision balances | (37) |
| Normalize breakage-rate impact on deferred revenue | (24) |
| Normalize Mastercard GST provision and release | (9) |
| Remove intercompany balances owing to/from LCL outside perimeter | (140) |
| Add post-transaction loyalty and payroll payables | (18) |
| Remove non-recurring Mastercard incentive deferred revenue | (6) |
| **Total adjustments** | **(278)** |
| **Adjusted NAV** | **1,007** |

| Average NAV view | FY2022 | FY2023 | FY2024 |
|---|---:|---:|---:|
| Average reported NAV | 1,198 | 1,226 | 1,254 |
| Average adjusted NAV | 1,034 | 1,012 | 989 |

### Net asset adjustments and rationale
1. Remove excess non-transferring cash ($44 million): Reported cash includes balances accumulated in a legal entity that is outside the transfer perimeter. This adjustment removes excess balances that are not expected to transfer at completion and retains only operating cash required for daily operations.
2. Remove NITC receivable and related provision balances ($37 million): Reported balances include notional input tax credit receivables and associated provisions subject to legislative uncertainty. This adjustment removes both balances from adjusted net asset value until final treatment is confirmed under the applicable tax position.
3. Normalize breakage-rate impact on deferred revenue ($24 million): Deferred revenue includes period effects from a change in breakage assumptions applied to loyalty balances. This adjustment removes the out-of-period normalization effect to align net asset value with the current steady-state assumption set.
4. Normalize Mastercard GST provision and release ($9 million): Reported liabilities include a provision and partial reversal linked to historical GST treatment updates. This adjustment removes the provision-related volatility from adjusted net asset value and reflects balances on an indicative normalized basis.
5. Remove intercompany balances owing to/from LCL outside perimeter ($140 million): Reported intercompany receivables and payables include balances with entities outside the transaction perimeter. This adjustment removes those balances from adjusted net asset value because they are not expected to remain in the business post-completion.
6. Add post-transaction loyalty and payroll payables ($18 million): Certain activities currently settled through intercompany balances will continue post-transaction and require third-party or standalone settlement. This adjustment adds an indicative payable for those ongoing obligations to reflect expected closing economics.
7. Remove non-recurring Mastercard incentive deferred revenue ($6 million): Reported liabilities include deferred revenue associated with a one-time incentive arrangement. This adjustment removes the non-recurring deferred balance to align adjusted net asset value with underlying recurring operations.

### Other considerations
- Standalone costs: Management is developing a standalone operating model, and incremental FTE and non-FTE requirements may create additional payables or accruals. This item may reduce adjusted net asset value, but the amount is not yet quantifiable.
- Insurance contract liabilities: Final actuarial support for selected insurance-related liabilities was not available as at report date. This item may increase or decrease adjusted net asset value depending on final reserve adequacy conclusions.
- Regulatory and tax matters outside current scope: Certain tax and regulatory matters remain under review in specialist workstreams. These items may be net-asset-relevant at closing, and treatment should be finalized before funds-flow completion.

### Transaction and closing implications
- The adjusted net asset value bridge provides the current purchase-price reference point as at December 31, 2024, and requires refresh for closing-date balances.
- Closing mechanics should align classification treatment across quality of net assets, net debt, and working capital to avoid double counting or gaps in the purchase-price bridge.
- Final completion accounts should update closing cash, intercompany settlement, and estimate-based liabilities using the same treatment logic applied in this section.
```
