# Section contract: Net debt and debt-like items

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

The Net Debt and Debt-like Items section defines the purchase-price-relevant indebtedness position as at a clearly stated date. It should tell the reader what is included in reported net debt or net cash, which additional items should be treated as debt-like or cash-like, and which closing mechanics or unresolved items could still change the funds flow.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Position first, then classification:** Start with the reported position and the adjusted position when available, then explain the treatment calls that move between those two views.
2. **Treat the schedule as the anchor exhibit:** Strong net debt sections are built around a dated schedule or components list, not around free-form commentary.
3. **Define what cash means:** Clarify restricted, trust, settlement, trapped, or otherwise unavailable cash whenever the classification is not obvious.
4. **Separate quantified items from contingent items:** Put quantified debt-like and cash-like treatment calls in the main analysis and reserve `Other considerations` for unresolved or contingent items.
5. **Show cross-workstream consequences:** When an item is reclassified from net working capital or linked to QoE treatment, state the closing or peg implication explicitly.
6. **Keep closing mechanics visible:** Taxes, earn-outs, leases, dividends, transaction costs, bonuses, and similar items often require a statement about treatment at closing or completion.
7. **Keep the section on purchase-price mechanics:** Do not turn this section into a covenant summary, a debt instrument appendix, or a generic open-items register.

## Analytical workflow

1. **Anchor the section to one reference date:** Identify the `as at [Date]` point used for the schedule, headline, and conclusions.
2. **Define the net debt perimeter:** Determine what counts as debt, cash, debt-like, cash-like, excluded, or outside scope for this engagement.
3. **Build the core exhibit:** Start from the reported balance sheet or management schedule and organize the main line items into a net debt schedule or components list.
4. **Identify treatment calls beyond reported debt less cash:** Pull in acquisition-related obligations, taxes, lease issues, transaction items, working-capital reclasses, and other purchase-price-relevant balances.
5. **Separate fully quantified items from contingent items:** Keep items with clear quantum in the main schedule or rationale block and move unresolved or out-of-scope items to a conditional watchlist.
6. **State closing mechanics where they matter:** Add explicit completion, locked-box, or working-capital-peg implications when the classification could change purchase price mechanics.
7. **Scale the section to complexity:** Keep simple situations short, and expand only when the number of treatment calls, definition issues, or closing sensitivities makes it necessary.

## Section architecture

Scale the section based on the complexity of the cash definition, the number of debt-like items, and the importance of closing-date mechanics.

Target length:

- `concise`: 180-320 words plus schedule for straightforward net cash or net debt positions with few adjustments
- `standard`: 280-520 words plus schedule for most situations
- `expanded`: 450-750 words plus schedule when there are multiple debt-like categories, reclasses, or closing sensitivities

Required blocks:

- `Headline position and scope`
  - Purpose: state the reported and adjusted position as at the reference date and define the key classification boundary.
  - Typical density: 2-4 bullets.
- `Net debt schedule`
  - Purpose: show the reported balances and the core classified items that support the net debt or net cash conclusion.
  - Typical density: one exhibit plus one short source note.
- `Debt-like adjustments and rationale`
  - Purpose: explain the material treatment calls that move beyond reported bank debt less cash.
  - Typical density: 3-8 numbered items.

Optional blocks:

- `Definition details`
  - Use when cash availability, lease measurement, or locked-box / SPA mechanics are not obvious from the required blocks.
  - Use when the section needs to distinguish unrestricted cash from trust, settlement, trapped, or regulatory balances.
- `Closing and peg considerations`
  - Use when the treatment at completion differs from accounting presentation or when a reclassification affects the working-capital peg or funds flow.
  - Use when taxes, earn-outs, transaction costs, dividends, or leases require explicit closing-date handling.
- `Other considerations`
  - Use when unresolved, contingent, unquantified, or out-of-scope items could still affect purchase price.
  - Use when another diligence workstream may influence final classification.
- `Instrument or category detail`
  - Use when debt instrument terms, acquisition-item groupings, or cash subcategories materially change the treatment conclusion or make the section easier to follow.

Ordering rules:

- Start with `Headline position and scope`.
- Follow with `Net debt schedule`.
- Follow with `Debt-like adjustments and rationale`.
- Add optional blocks only when their trigger conditions are met.
- When multiple optional blocks are needed, use this default order: `Definition details` -> `Closing and peg considerations` -> `Other considerations` -> `Instrument or category detail`.

Inclusion rule:

- Do not add an optional block just because the source mentions it. Add it only when it changes how the reader should interpret purchase-price mechanics or net debt classification.

Boundary rule:

- Do not create a generic `open items` or `data requests` block. Use inline placeholders and add `Other considerations` only when unresolved items are still decision-useful.

## Available analytical units

Use these as building blocks for bullets, short sentence clusters, or numbered treatment items. Choose only the units the section needs.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each unit definition.

### `position bridge`

- Purpose: state the reported and adjusted position, the date anchor, and the main drivers.
- Use when: opening the section.
- Do not use when: repeating the same bridge after the schedule already established it clearly.
- Target length: 20-45 words.
- Source note: usually not needed if the schedule immediately follows.
- Example: `As at June 30, 2024, the Company reported net cash of $[x], which adjusts to $[y] after tax, lease, and working-capital reclassifications.`

### `scope note`

- Purpose: define what is included and excluded from net debt, especially for cash and borderline balances.
- Use when: restricted cash, settlement balances, trust accounts, trapped cash, leases, or locked-box mechanics affect the classification.
- Do not use when: the cash and debt boundary is obvious from the schedule and no special treatment is needed.
- Target length: 18-45 words.
- Source note: recommended when the definition differs from management presentation or deal mechanics.
- Example: `Cash includes unrestricted operating balances only and excludes settlement cash and trust balances that remain within working capital or regulated accounts until release.`

### `schedule framing line`

- Purpose: introduce the main exhibit and tell the reader what it captures.
- Use when: the section uses a schedule or component list as its anchor exhibit.
- Do not use when: the exhibit title already does the full job and an additional sentence would repeat it.
- Target length: 18-40 words.
- Source note: not needed beyond the exhibit source note.
- Example: `The schedule below illustrates the net indebtedness position as at December 31, 2024, including reported debt, operating cash, and identified debt-like reclassifications.`

### `component definition`

- Purpose: define a major schedule component or explain why it belongs in the exhibit.
- Use when: a line item such as leases, due-to-sellers, shareholder balances, or trust cash needs a one-line explanation.
- Do not use when: the line item is self-explanatory and no treatment ambiguity exists.
- Target length: 15-40 words.
- Source note: recommended when the balance is non-obvious or partially off-balance-sheet.
- Example: `Finance lease obligations include the property lease and equipment financing arrangements currently presented at the present value of future lease payments in the audited statements.`

### `treatment unit`

- Purpose: explain one debt-like, cash-like, excluded, or contingent classification decision.
- Use when: a material item changes adjusted net debt or requires an explicit treatment call.
- Do not use when: the point is only a descriptive component with no real classification decision.
- Target length: 30-85 words.
- Source note: recommended when the amount, basis, or support is non-obvious.
- Example: `Income tax payable ($[x]): This balance relates to profits generated before completion and should be treated as debt-like. If the final tax computation remains outstanding, the unpaid pre-completion amount should be estimated at closing.`

### `closing mechanics note`

- Purpose: state how an item should be handled at completion, in the locked-box, or in the funds flow.
- Use when: accounting presentation and purchase-price treatment are not the same, or the item may change at closing.
- Do not use when: the treatment is fully static and there is no timing consequence.
- Target length: 18-50 words.
- Source note: recommended when linked to transaction definitions or management representations.
- Example: `Lease obligations are carried at present value in the accounts, but the closing funds flow should confirm whether the agreed net debt definition requires undiscounted settlement value at completion.`

### `workstream interaction note`

- Purpose: explain how net debt classification interacts with net working capital or QoE.
- Use when: an item is reclassified from working capital, linked to an EBITDA add-back, or otherwise at risk of double counting.
- Do not use when: the item is self-contained within net debt and no cross-workstream implication exists.
- Target length: 18-45 words.
- Source note: recommended when the interaction is tied to another section's conclusion.
- Example: `If capex payables are treated as debt-like at closing, they should be removed from the working-capital peg to avoid double counting.`

### `contingent item note`

- Purpose: flag an unresolved or unquantified item that may still affect purchase price.
- Use when: support is incomplete, quantum is not final, or another workstream must confirm treatment.
- Do not use when: the item is already quantified and can be treated directly in the main rationale list.
- Target length: 18-55 words.
- Source note: recommended.
- Example: `Payroll tax deferral ($[x] / unquantified): This may be debt-like because it relates to pre-completion payroll obligations, but final quantification is outstanding from Management.`

## Assembly patterns

Use one of these patterns based on the section's complexity. These are assembly guides, not mandatory templates.

### `Simple reported net cash / debt section`

- Recommended block order: `Headline position and scope` -> `Net debt schedule` -> `Debt-like adjustments and rationale`
- Optional blocks typically activated: none; add `Definition details` only if cash availability or lease treatment is unclear
- Target density: 3-5 bullets plus one short exhibit
- Stop adding detail when: the reader understands the reported position, the one or two material adjustments, and the resulting purchase-price view

### `Schedule-backed classification review`

- Recommended block order: `Headline position and scope` -> `Net debt schedule` -> `Debt-like adjustments and rationale` -> `Closing and peg considerations` when needed -> `Other considerations` when needed
- Optional blocks typically activated: `Closing and peg considerations` and `Other considerations`
- Target density: 5-9 bullets plus one fuller exhibit
- Stop adding detail when: each material treatment call has a basis, the schedule is auditable, and the closing implications are explicit

### `Deal-mechanics-heavy / locked-box section`

- Recommended block order: `Headline position and scope` -> `Definition details` -> `Net debt schedule` -> `Debt-like adjustments and rationale` -> `Closing and peg considerations` -> `Other considerations`
- Optional blocks typically activated: all optional blocks except `Instrument or category detail`, which should be added only if it improves readability
- Target density: 7-11 bullets plus one detailed exhibit
- Stop adding detail when: the reader can distinguish reported accounting balances from the agreed transaction definition and see which items remain for negotiation or closing true-up

## Section-specific writing guidance

1. Lead with the `as at [Date]` anchor and the reported versus adjusted position whenever both are available.
2. Use the schedule or component list as the structural anchor; do not bury the main classification logic in prose alone.
3. Define the cash boundary whenever restricted, trust, settlement, trapped, or PSP-style balances could change the conclusion.
4. Write treatment units in full sentences that state the item, the reason for treatment, and the closing implication when relevant.
5. State explicitly when an item should be treated as debt-like, cash-like, excluded, or contingent; do not imply the conclusion indirectly.
6. Call out working-capital or QoE interaction whenever the same balance could otherwise be counted twice.
7. Use `Other considerations` only for unresolved or contingent items that are still relevant to purchase-price thinking.
8. Keep debt instrument detail only to the extent it changes classification, measurement, or closing treatment.
9. Avoid extraction artifacts, process notes, and generic requests for information.
10. Avoid turning the section into a lender memo, a tax memo, or a risk register.

## Verification and review checks

Use these checks before finalizing a Net Debt and Debt-like Items draft.

1. `Headline position and scope`, `Net debt schedule`, and `Debt-like adjustments and rationale` all exist.
2. The section is anchored to one explicit `as at [Date]`.
3. The reported position and adjusted position are both stated when the evidence supports both; if the adjusted position is unavailable, the section signals that clearly.
4. The schedule includes units and a `Source note`.
5. The section goes beyond bank debt less cash and addresses debt-like or cash-like treatment where relevant.
6. Cash definition is explicit when restricted, trust, settlement, trapped, or equivalent balances are relevant.
7. Lease measurement and other closing-mechanics issues are stated when accounting presentation may differ from purchase-price treatment.
8. Optional blocks appear only when their trigger rules are met.
9. `Other considerations` contains unresolved purchase-price-relevant items, not a generic data-request list.
10. No extraction-artifact language appears, including `Not present in source report` or `extraction policy`.
11. No slot, layout, or `deckSpec` language appears in the drafted section.
12. Missing information uses inline placeholders rather than unsupported claims or open-item headings.
13. The final draft reflects the schedule-backed, treatment-unit model shown in this reference.
14. Language and tone pass `references/global-writing-conventions.md`.
15. Split any treatment item that becomes hard to scan or tries to do more than one analytical job.

## Full examples

### Example 1: Simple reported net cash section

```markdown
## Net debt and debt-like items

### Headline position and scope

- As at June 30, 2024, the Company reported net cash of $12.4 million, which adjusts to $11.8 million after one working-capital reclassification and one debt-like accrual.
- Cash includes unrestricted operating balances only and excludes $0.2 million held in settlement accounts, which remain within working capital until remitted.

### Net debt schedule

Source note: Management-prepared net debt schedule as at June 30, 2024, reconciled to the June 2024 trial balance.

| Line item | Classification | Balance ($m) |
| --- | --- | ---: |
| Cash and cash equivalents | Cash | 12.6 |
| Settlement cash | Excluded | (0.2) |
| Finance leases | Debt | (0.4) |
| Income tax payable | Debt-like | (0.1) |
| Refund buffer reclass | Working-capital reclass | (0.1) |
| **Adjusted net cash / (net debt)** | **Total** | **11.8** |

### Debt-like adjustments and rationale

1. Refund buffer ($0.1 million): A minimum balance remains in the payment account to process customer refunds. Treat this item as working-capital rather than cash-like because the balance supports ongoing operating activity and is not freely distributable at closing.
2. Income tax payable ($0.1 million): This balance relates to profits generated before completion and should be treated as debt-like. Final quantum should be confirmed against the closing tax computation if the period-end estimate changes.
3. Finance leases ($0.4 million): These balances are included in reported debt and reflect present-value lease obligations. Confirm at closing whether the agreed net debt definition requires any different measurement basis.
```

### Example 2: Schedule-backed classification review

```markdown
## Net debt and debt-like items

### Headline position and scope

- As at December 31, 2024, reported net debt was $504.7 million, driven primarily by long-term debt facilities, retractable redeemable shares, and acquisition-related obligations, partly offset by operating cash.
- After identified reclassifications and additional debt-like items of $16.6 million, adjusted net debt was $521.3 million.
- Cash includes unrestricted operating balances only and excludes trust balances and other amounts not available for general use at closing.

### Net debt schedule

Source note: Management-prepared net debt schedule as at December 31, 2024, reconciled to the December 2024 trial balance and supporting balance sheet schedules.

| Line item | Classification | Balance ($m) |
| --- | --- | ---: |
| Cash and cash equivalents | Cash | 8.3 |
| Revolver and line of credit | Debt | (12.8) |
| Long-term debt facilities | Debt | (258.3) |
| Retractable redeemable shares | Debt-like | (241.9) |
| Earn-out payable | Debt-like | (1.5) |
| Purchase price payable | Debt-like | (0.2) |
| Income taxes payable | Debt-like | (9.7) |
| Stock options liability | Debt-like | (1.9) |
| Transaction costs accrual | Debt-like | (1.6) |
| Capex payables (NWC reclass) | Debt-like | (1.7) |
| **Adjusted net debt / (net cash)** | **Total** | **(521.3)** |

### Debt-like adjustments and rationale

1. Income taxes payable ($9.7 million): This balance relates to profits generated before completion and should be treated as debt-like. The unpaid pre-completion amount should be estimated at closing if the final year-end tax computation remains outstanding.
2. Earn-out payable ($1.5 million): This balance relates to historical acquisitions and is measured using current forecast assumptions. Treat this item as debt-like because the obligation arose from pre-completion transactions, and review the underlying assumptions at closing.
3. Purchase price payable ($0.2 million): This balance reflects deferred consideration owed to vendors of acquired operations and should be treated as debt-like while settlement remains payable after completion.
4. Stock options liability ($1.9 million): This balance relates to outstanding obligations under employee equity incentive arrangements and should be treated as debt-like to the extent the obligation crystallizes on a change of control.
5. Transaction costs accrual ($1.6 million): This balance includes professional fees connected to the contemplated transaction and should be treated as indebtedness if unpaid at completion.
6. Capex payables ($1.7 million): This balance includes non-trade amounts payable to capital suppliers and should be treated as debt-like because it relates to pre-completion capital spend. If treated this way at closing, it should be removed from the working-capital peg to avoid double counting.

### Closing and peg considerations

- Lease, tax, and acquisition-related items should be confirmed against the agreed closing definition of net debt if the SPA or funds-flow mechanics differ from accounting presentation.
- Any unpaid dividends, transaction bonuses, or severance expected to crystallize at completion should be captured in the closing funds flow as debt-like if they remain for the account of the vendor.

### Other considerations

- Note receivable balances of $1.1 million include a sales price adjustment receivable and amounts recoverable from former shareholders. Final treatment depends on collectability at closing and whether the receivable is treated as cash-like or excluded from purchase price consideration.
- Near-term IT investment tied to legacy acquisitions may be relevant to purchase-price negotiations, but final treatment depends on the agreed transaction definition and the supporting diligence from the IT workstream.
- Minority-interest-related indebtedness should be finalized before closing so the funds flow reflects only the portion that remains for the purchaser's account.
```
