# Section contract: Net debt and debt-like items

## Table of contents

- Section objective
- Core principles
- Analytical workflow
- Section architecture
- Typical content areas
- Assembly patterns
- Section-specific writing guidance
- Verification and review checks
- Full examples

## Section objective

The Net debt and debt-like items section explains the purchase-price-relevant indebtedness position as at a clearly stated date. In most cases, it starts with the reported net debt or net cash schedule, explains the main definitional components of that position, and then brings in the additional reclasses, debt-like items, cash-like items, and other considerations that matter to the closing analysis.

This section operates similarly to the balance sheet section, but with greater focus on the balances that affect net debt, cash, and purchase-price mechanics. It should explain what the reported position is, what sits inside the major balances, what has been reclassified from net working capital or elsewhere, and which items may still need to be considered at closing.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Anchor everything to one date:** The section should be written as at a clearly stated balance-sheet or closing reference date.
2. **Start from the reported schedule:** Net debt commentary should sit beside a dated schedule or components list rather than being drafted as free-form prose.
3. **Separate reported components from additional considerations:** First explain the balances included in reported net debt or net cash, then explain the reclasses, debt-like items, cash-like items, or other considerations that sit beyond the reported definition.
4. **Define cash carefully:** Explain what is included in cash and what is excluded when settlement balances, trust cash, restricted cash, trapped cash, or similar balances are present.
5. **Explain classification through the balance itself:** Describe what the balance relates to, how it arises, and why it matters at closing, rather than repeatedly using formulaic language such as “this is debt-like because...”.
6. **Bring in useful balance detail:** For material debt, lease, tax, acquisition, or other obligations, include the key detail the reader would need to understand the item, such as facility type, counterparty, settlement mechanics, or what the balance pertains to.
7. **Show cross-workstream interaction when relevant:** If an item is reclassified from net working capital, linked to a QoE adjustment, or could otherwise be counted twice, make that clear.
8. **Keep the section focused on purchase-price mechanics:** Do not turn the section into a lender memo, tax memo, covenant summary, or general negotiation list.

## Analytical workflow

1. **Confirm the reference date and basis:** Identify the `as at [Date]` point used for the net debt schedule and whether the section is discussing reported net debt, adjusted net debt, reported net cash, or adjusted net cash.
2. **Review the full net debt schedule first:** Start with the full schedule, trial balance, or balance-sheet support and identify the major debt, cash, and debt-like balances.
3. **Identify the main definitional balances:** Determine which reported balances make up the net debt or net cash position, such as cash, debt facilities, leases, shareholder balances, taxes, or acquisition-related obligations.
4. **Identify reclasses and other adjustments:** Pull in balances reclassified from net working capital, items excluded from cash, acquisition obligations, transaction items, taxes, bonuses, or other purchase-price-relevant balances.
5. **Decide what belongs in the main section versus other considerations:** Put quantified and supportable items into the main analysis, and keep unresolved, contingent, or still-developing items in a short `Other considerations` grouping when needed.
6. **Add useful detail for material balances:** Where relevant, explain the facility, lease, tax, or acquisition mechanics that help the reader understand the balance and its likely closing treatment.
7. **State the closing implication where needed:** If a balance affects the funds flow, locked-box treatment, peg, or another workstream, say so directly.
8. **Stop when the net debt position is interpretable:** Include enough detail for the reader to understand the reported position, the main reclasses, and the key closing considerations without turning the section into an exhaustive balance-sheet appendix.

## Section architecture

Scale the section based on the complexity of the net debt definition, the number of additional debt-like items, and the extent to which closing mechanics affect interpretation.

**Verbosity:**

- Stop adding detail when the reader can understand the reported net debt or net cash position, the main balances within it, the material reclasses or additional items, and any major closing considerations. In most cases, aim for one anchor schedule plus 5-10 commentary bullets or numbered items and roughly 250-700 words. Move above that range only when the capital structure, debt-like adjustments, or closing mechanics require fuller explanation.

**Required content areas:**

- Date basis and position
  - State the reference date and whether the section is addressing reported or adjusted net debt or net cash.
- Net debt schedule and reported components
  - Present the dated schedule and explain the main definitional balances within the reported position.
- Reclasses and additional considerations
  - Explain the adjustments, reclasses, or other purchase-price-relevant balances that sit beyond the reported definition.

**Optional content areas:**

- Cash definition detail
  - Add when restricted, trust, settlement, trapped, or otherwise unavailable cash affects the conclusion.
- Facility or instrument detail
  - Add when debt facilities, leases, shareholder balances, or acquisition obligations need more detail to be understood properly.
- Closing and peg considerations
  - Add when the treatment at completion differs from accounting presentation or when the item affects the working-capital peg, funds flow, or locked-box mechanics.
- Other considerations
  - Add when unresolved, contingent, or still-developing items are relevant enough to flag but not ready to include fully in adjusted net debt.

**Data / information typically needed:**

- The net debt or net cash schedule as at the relevant date
- The supporting balance sheet, trial balance, and account-level support for the material net debt captions
- Cash breakdowns showing unrestricted, restricted, trust, settlement, or other non-operating balances where relevant
- Debt schedules, lease schedules, shareholder or related-party balance support, and acquisition-obligation schedules where relevant
- Reclasses from net working capital or other workstreams where relevant
- SPA, funds-flow, or closing-definition guidance where relevant
- Any management explanations for balances that are unusual, newly reclassified, or likely to change at closing

**Data mapping considerations:**

- Start from the full net debt schedule and identify the largest reported components first.
- Explain the reported position before introducing the additional adjustments.
- Where useful, quantify significant balances within a caption and describe what they relate to, such as major facilities, lease categories, deferred acquisition payments, tax balances, or transaction accruals.
- Use net working capital and QoE work to identify reclasses or other items that affect the closing debt view.
- Keep `Other considerations` for items that are relevant but not fully settled, not as a place for generic open questions.
- If the user has already provided the schedule or exhibit, write the commentary to sit beside it rather than recreating it unless requested.

**Formatting principle:**

- Use a short opening line or two, then commentary grouped around the net debt schedule in the same order the reader sees the balances.
- When discussing a balance that maps directly to the schedule, use the schedule label followed by a colon in bold, then explain what the balance relates to and how it should be understood.
- Use a separate lead-in for the additional adjustments or other considerations when that makes the section easier to scan, such as `Adjustments to net debt include:` or `Other considerations include:`.
- Format fiscal years as `FY24`, `FY25`, etc. Format dates as source-consistent labels such as `Jun-24` or `December 31, 2024`. Format monetary amounts as `$x.x million`, and use full amounts such as `$325,000` or `$90,000` for balances below `$0.1 million`.

**Ordering rules:**

- Start with the dated position and schedule framing.
- Then explain the main reported components of net debt or net cash in schedule order.
- Follow with additional reclasses, debt-like items, cash-like items, or other adjustments.
- End with closing, peg, or other considerations only when they materially affect interpretation.

## Typical content areas

Use these as the main building blocks for the section. Choose only the content areas the draft actually needs.

The standard pattern is a dated schedule followed by commentary on the reported components and then the additional reclasses or other considerations.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each content-area definition.

### Date basis and position line

- Purpose: state the reference date and the reported or adjusted position.
- Use when: opening the section.
- Skip when: never; this is the normal entry point.
- Target length: 15-45 words.
- Source note: usually not needed if the schedule is visible.
- Example: `As at June 30, 2024, the Company reported net cash of $11.6 million before reclasses and other debt-like considerations.`

### Schedule framing line

- Purpose: introduce the schedule and tell the reader what it captures.
- Use when: the schedule is the anchor exhibit.
- Skip when: the schedule title already makes the point clearly.
- Target length: 15-40 words.
- Source note: not needed beyond the exhibit source note.
- Example: `The schedule below illustrates the net indebtedness position as at June 30, 2024, including reported cash, lease obligations, and identified reclasses from net working capital.`

### Reported component commentary

- Purpose: explain one of the main balances within reported net debt or net cash.
- Use when: a reported schedule line needs practical explanation or useful detail.
- Skip when: the balance is obvious and immaterial.
- Target length: 20-85 words.
- Source note: recommended for non-obvious balances.
- Example: `**Finance lease obligations:** Consist of the master equipment lease and the head office property lease. These balances are currently presented at the present value of future minimum lease payments, consistent with the audited financial statements.`

### Cash definition note

- Purpose: explain what is included or excluded from cash.
- Use when: settlement, trust, restricted, trapped, or regulatory balances affect the conclusion.
- Skip when: cash is straightforward and unrestricted.
- Target length: 20-60 words.
- Source note: recommended.
- Example: `**Cash and cash equivalents:** Represent operating cash balances held in Canadian and U.S. dollar accounts. These balances exclude transaction-settlement cash, which remains part of working capital.`

### Adjustments lead-in

- Purpose: separate the additional net debt adjustments from the reported balances.
- Use when: the section includes reclasses or other debt-like considerations.
- Skip when: the section is purely definitional with no meaningful adjustments.
- Target length: 6-18 words.
- Source note: not needed.
- Example: `Adjustments to net debt include:`

### Adjustment commentary

- Purpose: explain one reclass, debt-like item, cash-like item, or other purchase-price-relevant adjustment.
- Use when: a balance changes the adjusted net debt view or should be considered at closing.
- Skip when: the point is too immaterial or too unresolved for the main section.
- Target length: 25-95 words.
- Source note: recommended.
- Example: `**Income tax payable:** Includes current income taxes relating to profits earned before completion. As the final computation is completed through the year-end process, the unpaid pre-completion amount should be estimated at closing if the reported balance changes.`

### Cross-workstream note

- Purpose: explain how an item interacts with net working capital or QoE.
- Use when: a reclass affects the peg or could otherwise be counted twice.
- Skip when: the balance is self-contained within net debt.
- Target length: 18-55 words.
- Source note: recommended.
- Example: `**Capex payables:** Estimated outstanding balances payable to capital suppliers are reclassified from net working capital and shown here given they relate to non-trade activity. If retained in net debt, they should be removed from the working-capital peg.`

### Other consideration note

- Purpose: flag an unresolved, contingent, or still-developing item that may affect purchase price.
- Use when: support is incomplete, the quantum is uncertain, or treatment depends on further work.
- Skip when: the item is fully supportable and belongs in the main analysis.
- Target length: 20-70 words.
- Source note: recommended.
- Example: `**Transaction bonuses:** Any bonus or severance amounts payable on completion should be captured in the funds flow to the extent they remain for the account of the vendor. Final quantum should be confirmed before closing.`

## Assembly patterns

Use one of these patterns based on the section. These are practical guides, not fixed templates.

### Standard schedule-backed net debt section

- Usual flow: date basis and position -> schedule -> reported component commentary -> adjustments lead-in -> adjustment commentary.
- In practice, this pattern often uses 4-8 commentary bullets or numbered items.
- Aim for one schedule plus 4-8 commentary items.
- Stop adding detail when the reader can understand the reported balances and the main additional purchase-price adjustments.

### Adjustment-heavy net debt section

- Usual flow: date basis and position -> schedule -> short reported component commentary -> fuller adjustments section -> closing or peg comments if needed.
- In practice, this pattern is used where acquisition obligations, taxes, transaction items, or working-capital reclasses drive a meaningful part of the adjusted position.
- Aim for one schedule plus 6-10 commentary items.
- Stop adding detail when each material reclass or debt-like item is clear and the reader can understand the adjusted position.

### Definition- and closing-heavy section

- Usual flow: date basis and position -> cash definition or scope note -> schedule -> reported components -> adjustments -> other considerations.
- In practice, this pattern often appears when cash availability, lease treatment, or completion mechanics materially affect how the schedule should be read.
- Aim for one schedule plus 6-10 commentary items.
- Stop adding detail when the reader can distinguish the reported accounting position from the balances likely to matter in the closing funds flow.

## Section-specific writing guidance

1. Use the net debt schedule as the structural anchor and keep the commentary aligned to the schedule order.
2. Explain what each balance relates to before moving to the purchase-price implication.
3. For debt-like balances, prefer practical explanation and closing relevance over repetitive formulaic language.
4. Include instrument or facility detail only when it helps the reader understand the balance or its likely treatment.
5. Keep unresolved items brief and grouped in `Other considerations` only when they are still decision-useful.

## Verification and review checks

**Verification questions:**

- Is the section anchored to one clear `as at [Date]` position?
- Does the section explain the reported net debt or net cash schedule before moving to the additional adjustments?
- For the material balances, does the commentary explain what they relate to and why they matter to the net debt view?
- Where relevant, does the section define cash carefully and distinguish operating cash from restricted, trust, settlement, or other excluded balances?
- If a balance is reclassified from net working capital or linked to another workstream, is that interaction stated clearly?
- Does the section provide enough detail for the reader to understand the main components and closing considerations without turning into an exhaustive debt memo?

## Full examples

These examples show content flow, not required headings or exact bullet counts.

The examples below show the type of net debt schedule the skill may receive, followed by the commentary it would draft from that schedule. The exhibit is included to show the incoming data shape; the skill does not need to recreate the schedule unless the user asks for it.

### Example 1: Reported net cash with selected reclasses

```markdown
## Net debt and debt-like items

- The schedule below presents the Company’s reported net cash position as at June 30, 2024.

Source note: Management-prepared net debt schedule as at June 30, 2024, reconciled to the Jun-24 trial balance.

| Line item                            | Balance ($m) |
| ------------------------------------ | -----------: |
| Cash and cash equivalents            |         12.4 |
| Finance lease obligations            |         (1.6) |
| Income tax payable                   |         (0.4) |
| Deferred compensation payable        |         (0.3) |
| Shareholder return of capital payable|         (0.1) |
| **Reported net cash**                |       **10.0** |
| Non-resident withholding tax payable |         (0.2) |
| **Adjusted net cash**                |        **9.8** |

The components of reported net cash are comprised of the following:

**Cash and cash equivalents:** The Company’s operating cash balances held at banks, including balances denominated in Canadian and U.S. dollars. These balances do not include cash related to transaction settlement, which is considered part of working capital.

**Finance lease obligations:** Consist of the master equipment lease for transaction processing hardware and software and the lease for the Company’s head office. These balances are currently presented at the present value of future minimum lease payments, consistent with the audited financial statements. At transaction close, the agreed treatment should confirm whether any alternative settlement basis is required.

**Income tax payable:** Represents the current income tax payable balance as at Jun-24 relating to profits earned prior to completion.

**Deferred compensation payable:** Represents the Company’s supplemental executive pension obligation for senior management.

**Shareholder return of capital payable:** Relates to the dividend approved by the Board and settled after the balance-sheet date.

Adjustments to net debt include:

**Non-resident withholding tax payable:** Relates to withholding tax payable to the Canada Revenue Agency for dividends paid to the shareholder. This balance is presented outside reported net cash and should be reflected in the purchase-price analysis if unpaid at completion.
```

### Example 2: Debt-heavy schedule with additional debt-like items

```markdown
## Net debt and debt-like items

- The schedule below illustrates the net indebtedness position of the Company as at December 31, 2024, including operating cash, debt facilities, acquisition-related obligations, and identified reclasses from net working capital.

Source note: Management-prepared net debt schedule as at December 31, 2024, reconciled to the Dec-24 trial balance and supporting balance-sheet schedules.

| Line item                     | Balance ($m) |
| ----------------------------- | -----------: |
| Cash and cash equivalents     |          8.3 |
| Revolver and line of credit   |        (12.8) |
| Long-term debt facilities     |       (258.3) |
| Redeemable shares             |       (241.9) |
| Earn-out payable              |         (1.5) |
| Purchase price payable        |         (0.2) |
| Income tax payable            |         (9.7) |
| Stock options liability       |         (1.9) |
| Transaction costs accrual     |         (1.6) |
| Capex payables reclass        |         (1.7) |
| **Adjusted net debt**         |     **(521.3)** |

The Company’s financial indebtedness comprises largely long-term debt facilities, redeemable shareholder instruments, and acquisition-related obligations, partly offset by operating cash.

The main definitional net debt items include the following:

**Cash:** As at Dec-24, the Company had a reported operating cash balance of $8.3 million. This cash is separate from balances maintained in trust accounts in certain operating subsidiaries.

**Long-term debt facilities:** Represent the Company’s primary funded debt instruments and remain the largest financial debt balance in the schedule.

**Redeemable shares:** These balances are presented at paid-up capital plus cumulative dividend value and form a material part of the definitional net debt position.

Adjustments to net debt include:

**Earn-out payable:** Earn-outs payable on historical acquisitions totaled $1.5 million at Dec-24. These balances are measured using current forecast assumptions, so the assumptions underpinning future settlement should be reviewed at closing against the latest outlook for the relevant businesses.

**Purchase price payable:** Represents deferred consideration owed to vendors of acquired operations. The reported balance remains payable after completion unless reduced through the specific retention or performance mechanics in the underlying agreements.

**Income tax payable:** Includes current income taxes payable as at Dec-24 which relate to profits earned before completion. As the final amount is completed through the year-end tax process, the unpaid pre-completion balance should be updated at closing if the reported balance changes.

**Stock options liability:** Relates to obligations outstanding under employee equity incentive arrangements. To the extent these amounts crystallize on a change of control, they should be reflected in the closing indebtedness analysis.

**Transaction costs accrual:** Represents professional fees relating to the contemplated transaction recognized in the Dec-24 balance sheet. Any unpaid vendor transaction costs at completion should be captured in the funds flow.

**Capex payables reclass:** Estimated outstanding amounts payable to capital suppliers have been reclassified from net working capital and shown here given they relate to non-trade activity. If retained in net debt, they should be excluded from the working-capital peg.

Other considerations include:

**Unpaid dividends:** Any dividends due to shareholders should be settled before completion or reflected in the closing funds flow.

**Future IT investment:** The business continues to invest in upgrades to acquired legacy systems. Known near-term investment requirements may be relevant to purchase-price discussions, but final treatment depends on the agreed transaction definition and any separate IT diligence conclusions.
```
