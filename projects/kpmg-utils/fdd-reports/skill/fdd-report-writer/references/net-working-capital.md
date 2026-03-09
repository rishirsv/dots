# Section contract: Net working capital

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

The Net working capital section explains the operating working-capital position in terms that matter for purchase price and closing mechanics. In most cases, it starts with a reported and adjusted working-capital schedule, explains the basis of presentation and the nature of the adjustments, and then walks the key normalization items that move reported working capital to the adjusted or target view.

This section operates similarly to the net debt section, but it focuses on operating working-capital balances and working-capital adjustments rather than indebtedness. It should explain what is included in working capital, what is excluded, how the major adjustments are categorized, and what the resulting analysis means for normalized working capital, target working capital, or closing true-up mechanics.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Anchor the section to the right NWC basis:** Be clear whether the section is discussing period-end working capital, average working capital, adjusted working capital, normalized working capital, target working capital, or a closing peg basis.
2. **Use the schedule as the anchor exhibit:** Strong working-capital sections are built around a schedule or bridge, with commentary drafted beside it rather than as free-form prose.
3. **State the basis of presentation clearly:** Explain the periods shown, the basis of the schedule, and the adjustment categories used in the analysis.
4. **Separate the categories of adjustment:** Keep definitional adjustments, due diligence adjustments, pro forma adjustments, sell-side adjustments, and other considerations distinct when those categories are used in the source analysis.
5. **Explain the adjustment through the balance and the operating logic:** Describe what the balance relates to, why it is included or excluded from working capital, and how it affects normalized working capital or closing mechanics.
6. **Use drivers and days analysis selectively:** Include receivables, inventory, payables, deferred revenue, DSO, DPO, DIO, billing patterns, or seasonality only when they materially improve interpretation of the working-capital level or target.
7. **State target or peg conclusions only when supported:** If the source supports a target, peg, surplus, or deficit conclusion, state it clearly. Otherwise, stop at the adjusted or normalized working-capital analysis.
8. **Keep the section focused on purchase-price mechanics:** Do not let the section drift into a generic balance sheet discussion or a long list of unsupported possible adjustments.

## Analytical workflow

1. **Confirm the working-capital basis:** Identify whether the analysis is period-end, average, trailing, target-based, or otherwise deal-defined, and carry that basis consistently through the section.
2. **Review the full schedule first:** Start from the reported and adjusted working-capital schedule, or the trial-balance-based working-capital support, and identify the main reported balances and adjustment categories.
3. **Define the operating boundary:** Determine which balances are included in net working capital and which balances are excluded because they are cash, debt-like, tax, capex-related, non-operating, or otherwise outside the agreed working-capital perimeter.
4. **Set out the basis of presentation:** Explain the periods presented and the categories of adjustments used in the analysis, such as definitional, due diligence, sell-side, buy-side, or pro forma.
5. **Identify the key adjustments:** Pull out the adjustments that most affect adjusted or normalized working capital and explain them one by one.
6. **Find the closest adjustment pattern:** For each material adjustment, identify the closest example type in this reference and model the sentence pattern on that example before adapting it to the company-specific facts.
7. **Add driver and seasonality commentary where relevant:** Use line-item commentary and days metrics only when they help the reader understand whether the reported or adjusted working-capital level is representative.
8. **State the target or peg outcome where supported:** Explain the target comparison, surplus, deficit, or lack of support for a target only when the evidence supports that conclusion.
9. **Stop when the working-capital analysis is interpretable:** Include enough detail for the reader to understand the reported schedule, the major adjustments, and the target or closing implications without turning the section into a complete operating balance-sheet appendix.

## Section architecture

Scale the section based on the complexity of the working-capital definition, the number of adjustment categories, the importance of seasonality, and whether the analysis supports a target or peg conclusion.

**Verbosity:**

- Stop adding detail when the reader can understand the working-capital basis, the major balances within the schedule, the material adjustments, and any target or closing implications. In most cases, aim for one anchor schedule plus 5-10 commentary bullets or numbered items and roughly 300-850 words. Move above that range only when the section includes multiple adjustment categories, extensive seasonality analysis, or a more involved target-setting discussion.

**Required content areas:**

- NWC position and basis
  - State the reported and adjusted working-capital position and the basis on which the section is written.
- Basis of presentation and adjustment categories
  - Explain the periods shown and the types of adjustments used in the analysis.
- Working-capital schedule and adjustment commentary
  - Present the schedule and explain the main adjustments that move reported working capital to the adjusted or normalized view.

**Optional content areas:**

- Working-capital definition detail
  - Add when the included and excluded balances need clearer explanation.
- Drivers and seasonality
  - Add when receivable, payable, inventory, deferred revenue, or billing patterns materially affect interpretation.
- Days analysis
  - Add when DSO, DPO, DIO, or similar metrics help explain the working-capital profile or support a target conclusion.
- Target or peg conclusion
  - Add when the source supports a target, peg, surplus, or deficit analysis.
- Sell-side or prior-analysis comparison
  - Add when the section starts from seller-prepared or prior diligence work and the reader needs to know what was retained, changed, or challenged.
- Other considerations
  - Add when unresolved or still-developing items may affect final working capital or the closing true-up.

**Data / information typically needed:**

- The reported and adjusted working-capital schedule for the relevant periods
- The trial balance, balance sheet support, or account detail underlying the material working-capital captions
- The working-capital definition or SPA guidance where relevant
- The list or schedule of definitional, due diligence, sell-side, buy-side, or pro forma adjustments where relevant
- Supporting detail for receivables, inventory, payables, accruals, deferred revenue, and other material working-capital balances where relevant
- Days metrics, seasonal data, and billing or settlement timing information where relevant
- Any target-working-capital or peg analysis where relevant

**Data mapping considerations:**

- Start from the full working-capital schedule and identify the major reported balances and the largest adjustments first.
- Explain the basis of presentation before walking the adjustments.
- Keep the adjustment categories visible when the source analysis uses them, such as definitional, due diligence, pro forma, or sell-side adjustments.
- Quantify significant balances and explain what they relate to when that improves understanding of the adjustment.
- Use drivers and days metrics only when they help the reader understand whether the adjusted balance is representative.
- If the target is not supported, say so directly rather than implying a surplus or deficit.
- If the user has already provided the schedule or exhibit, write the commentary to sit beside it rather than recreating it unless requested.

**Formatting principle:**

- Use a short overview followed by a basis-of-presentation note and then adjustment commentary aligned to the schedule.
- When the source analysis uses adjustment categories, state them explicitly in the same plain language style as the source, such as `Definitional adjustments`, `Due diligence adjustments`, `Pro forma adjustments`, or `Sell-side adjustments`.
- When discussing a balance or adjustment that maps directly to the schedule, use the schedule label followed by a colon in bold, then explain what it relates to and how it affects working capital.
- Format fiscal years as `FY24`, `FY25`, etc. Format trailing periods as `TTM Jun-24`, `LTM Dec-24`, or similar source-consistent shorthand. Format monetary amounts as `$x.x million`, and use full amounts such as `$325,000` or `$90,000` for balances below `$0.1 million`.

**Ordering rules:**

- Start with the reported and adjusted position and the basis on which the analysis is written.
- Follow with the basis of presentation and the categories of adjustments used.
- Then walk the material working-capital adjustments.
- Add drivers, days analysis, and target commentary only where they materially improve interpretation.
- End with other considerations only when unresolved items are still relevant to the working-capital or closing view.

## Typical content areas

Use these as the main building blocks for the section. Choose only the content areas the draft actually needs.

The standard pattern is an overview of the reported and adjusted position, followed by basis-of-presentation commentary and then the working-capital adjustments.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each content-area definition.

### Opening position line

- Start with one line that states the working-capital basis and the adjusted position the reader should focus on.
- Sample wording: `Adjusted average net working capital for TTM Jun-24 is [$x.x million], compared with reported average net working capital of [$x.x million].`

### Basis of presentation

- Use a short note to explain the periods shown and how the adjustments are grouped.
- Sample wording: `The working capital schedule summarizes reported and adjusted net working capital for FY22 to TTM Jun-24. Adjustments are grouped as definitional, due diligence, and pro forma items.`

### Adjustment category lead-ins

- Where the schedule separates the adjustments into clear groups, introduce each group in the same plain language used in the schedule.
- Sample wording: `**Definitional adjustments:** Adjustments to remove balances outside the operating working-capital perimeter.`
- Sample wording: `**Due diligence adjustments:** Incremental adjustments identified through the diligence process.`
- Sample wording: `**Pro forma adjustments:** Adjustments to reflect the run-rate working-capital impact of recent business changes.`
- Sample wording: `**Sell-side adjustments:** Adjustments presented in the seller's diligence analysis.`

### Adjustment narratives

- This is the core of the section. Explain each material adjustment in the same order it appears in the schedule, using the caption label in bold followed by a concise narrative.
- Sample wording: `**Contract liabilities:** Contract liabilities of [$x.x million] are removed from net working capital as they relate to the timing of revenue recognition for services to be delivered in future periods, rather than the operating liquidity requirement of the business.`

### Sample Adjustment Narratives

Here are common adjustment narrative examples, which can be used as templates. Choose the closest narrative and adapt the structure and level of detail to the actual balance being discussed.

- `**Cash:** Cash of [$x.x million] is excluded from net working capital and presented within net debt. Where relevant, this adjustment also excludes restricted, trust, or other non-operating cash balances from the working-capital analysis.`
- `**Debt-like liabilities:** Current debt-like balances of [$x.x million], including [lease liabilities / accrued interest / taxes payable / dividend payables], are excluded from net working capital as they do not reflect recurring operating funding.`
- `**Contract liabilities:** Contract liabilities of [$x.x million] are removed from net working capital as they relate to the timing of revenue recognition for services to be delivered in future periods, but do not reflect the operating liquidity profile of the business.`
- `**Non-current deferred revenue:** The non-current portion of deferred revenue of [$x.x million] is excluded from net working capital as it relates to obligations extending beyond the operating working-capital horizon used in this analysis.`
- `**Customer deposits:** Customer deposits of [$x.x million] are excluded from net working capital as they represent refundable balances or advance collections that do not form part of the ongoing operating working-capital requirement.`
- `**Out-of-period entries:** Out-of-period accrued liabilities and bonus accruals totaling [$x.x million] are adjusted to the periods in which they relate so the working-capital analysis reflects the underlying timing of the obligations rather than the period in which the correcting entry was posted.`
- `**Accrued interest:** Accrued interest of [$x.x million] is removed from net working capital as it relates to financing obligations rather than operating trading activity.`
- `**Severance liability:** Severance liabilities of [$x.x million] are removed from net working capital as they relate to specific terminated roles and do not form part of the ongoing operating accrual profile of the business.`
- `**Transaction or advisory costs:** Non-recurring legal, advisory, or transaction-related accruals of [$x,xxx] are removed from net working capital as they do not reflect the recurring operating liability profile of the business.`
- `**Due to / from sellers or related parties:** Balances of [$x.x million] due to or from sellers, shareholders, or related parties are excluded from net working capital as they are expected to settle outside the ordinary course or prior to closing.`
- `**CAPEX payables:** Payables of [$x.x million] relating to capital projects, fixed-asset purchases, or other non-trade expenditures are excluded from net working capital as they relate to investment activity rather than operating funding.`
- `**CAPEX deposits:** Deposits of [$x.x million] relating to construction, fixed assets, or other capital projects are excluded from net working capital as they relate to non-operating investment activity.`
- `**Non-operational receivables:** Receivables of [$x.x million] relating to shareholders, affiliates, tax recoveries, or other non-trade items are excluded from net working capital as they do not form part of the recurring operating conversion cycle.`
- `**Long-outstanding receivables:** Long-outstanding receivables of [$x.x million] aged greater than [x] days are excluded from net working capital where they are considered non-current, non-trade, or not collectible within the normal operating cycle.`
- `**Withholding tax asset:** Withholding tax balances of [$x,xxx] are excluded from net working capital where management does not intend to seek recovery and the amounts do not relate to recurring operating activity.`
- `**Cash in transit or float-related receivables:** Cash-in-transit or float-related receivables of [$x.x million] are excluded from net working capital where they represent timing-related cash movements rather than operating trade receivables.`
- `**Excess cash in trust:** Excess cash held in trust of [$x.x million] is excluded from net working capital to the extent it exceeds minimum operating or regulatory requirements and is assessed separately within the net debt analysis.`
- `**AP impact of QofE adjustments:** The accounts payable impact of the related quality of earnings adjustments is estimated at [$x.x million] using the Company’s historical DPO to reflect the expected settlement profile of the adjusted expenses.`
- `**AR impact of QofE adjustments:** The accounts receivable impact of the related quality of earnings adjustments is estimated at [$x.x million] using the Company’s historical DSO to reflect the expected collection profile of the adjusted revenue.`
- `**Bad debt expense:** The Company recorded a one-time bad debt provision of [$x,xxx] in [Month Year], which was subsequently collected or otherwise resolved. This adjustment removes the provision from net working capital as it does not represent an ongoing operating working-capital requirement.`
- `**Accrued payroll impact:** The payroll accrual impact of the related adjustment is estimated at [$x.x million] using the Company’s payroll cycle and the monthly compensation associated with the affected roles or open positions.`
- `**Bonus true-up:** Bonus accruals are adjusted by [$x,xxx] to align the reported balance with the underlying period of employee service and the expected timing of payment.`
- `**Payroll methodology change:** Payroll or wage accruals of [$x.x million] are adjusted to reflect the correct cut-off methodology based on when services were performed rather than when cash was disbursed or the correcting journal was recorded.`
- `**DSO normalization:** Customer-specific DSO increased to [x] days from a historical range of [x]-[x] days during [period] as payments were delayed. This adjustment normalizes the related receivable balance to [x] days based on historic collection patterns.`
- `**DPO normalization:** Trade creditor days increased to [x] days during [period] as payments were delayed beyond the normal settlement pattern. This adjustment normalizes the payable balance to a more representative operating DPO of [x] days.`
- `**Prepaid expense normalization:** Prepaid expenses of [$x.x million] peak when annual software, insurance, or other contracts are paid and then unwind through the year. This adjustment straight-lines the balance to reflect a more representative monthly run-rate.`
- `**Seasonal billing or settlement timing:** Receivables or payables of [$x.x million] are adjusted where the reported balance reflects unusual month-end timing associated with billing cycles, settlement patterns, or a known seasonal peak rather than the underlying run-rate profile of the business.`
- `**QofE-linked working-capital impact:** The working-capital impact of the related quality of earnings adjustment is estimated at [$x.x million] using the Company’s normal DSO, DPO, or payroll cycle so that the adjusted EBITDA change is reflected consistently in working capital.`
- `**Sell-side adjustment challenge:** A seller-proposed working-capital adjustment of [$x.x million] has been reversed or revised where the underlying item appears recurring, the phasing assumption is not supportable, or the related balance remains part of the go-forward working-capital profile.`
- `**Pro forma working-capital adjustment:** A pro forma adjustment of [$x.x million] is included to reflect the working-capital effect of [new customers / lost customers / matured locations / revised pricing / business change] on a run-rate basis.`

### Supporting notes

- Add these only when they materially improve the reader's interpretation of the schedule.
- `Drivers or seasonality:` Use a short note when receivable, payable, inventory, or deferred revenue levels need operating context to be read properly. Sample wording: `**Seasonality:** Billings are typically strongest in the second half of the year, which results in higher receivable balances and elevated DSO at the peak trading dates.`
- `Days analysis:` Use DSO, DPO, DIO, or similar metrics only when they explain why a reported or adjusted balance is high, low, or non-representative. Sample wording: `**Average adjusted DSO:** Adjusted DSO remained between [x] and [x] days over the historical period, with the increase in [period] driven by delayed customer payment timing.`
- `Target or peg conclusion:` State the target, peg, surplus, or deficit only when the basis is supported. Sample wording: `**Target working capital:** Based on the draft SPA definition, adjusted average working capital indicates a [$x.x million] surplus against the agreed target basis.`
- `Sell-side or prior-analysis note:` Use a short note when the analysis starts from seller-prepared work and the reader needs to know what was retained, changed, or challenged. Sample wording: `**Sell-side adjustments:** The seller-prepared adjustments were used as the starting point for the analysis, with changes made where recurring items, phasing assumptions, or classification were not considered supportable.`
- `Other considerations:` Keep this brief and use it only for unresolved items that still matter to the closing or target view. Sample wording: `**Quarter-end timing:** Collection and payment timing around the closing date may move the final receivable and payable balances, so the true-up should be assessed using the agreed cut-off conventions.`

## Assembly patterns

Use one of these patterns based on the shape of the analysis.

### Standard adjusted working-capital section

- Usual flow: opening position line -> basis of presentation -> schedule -> material adjustment narratives -> target conclusion if supported.
- This is the default pattern when the section is mainly about reported versus adjusted working capital.

### Driver- or seasonality-supported section

- Usual flow: opening position line -> basis of presentation -> schedule -> material adjustment narratives -> supporting notes on drivers, seasonality, or days -> target conclusion if supported.
- Use this when a spot or average working-capital balance needs operating context to be interpreted properly.

### Sell-side or multi-category section

- Usual flow: opening position line -> basis of presentation -> schedule -> grouped adjustment categories -> sell-side or prior-analysis note -> target or other considerations.
- Use this when reported, sell-side adjusted, buy-side adjusted, or pro forma working capital all appear in the same analysis.

## Section-specific writing guidance

1. Use the working-capital schedule as the structural anchor and keep the commentary aligned to the way the schedule is presented.
2. State the basis of presentation and the categories of adjustment clearly before walking the adjustments.
3. Explain each adjustment through the balance, the operating or definitional logic, and the effect on adjusted working capital.
4. Where an adjustment type has a close analogue in the sample narrative bank, follow that sentence pattern and adapt it to the company-specific facts rather than inventing a new structure.
5. Use supporting notes for drivers, days, sell-side differences, or other considerations only when they materially improve the section.

## Verification and review checks

**Verification questions:**

- Is the section clear on whether it is discussing reported, adjusted, normalized, average, or target working capital?
- Does the section explain the basis of presentation and the categories of adjustments before walking the adjustments themselves?
- For each material adjustment, does the commentary explain what it relates to and how it affects working capital?
- Where relevant, does the section explain the key working-capital drivers or days metrics without overloading the section with unnecessary operating detail?
- If a target or peg conclusion is stated, is it clearly supported by the source basis?
- Does the section provide enough detail for the reader to understand the working-capital bridge and its purchase-price implications without turning into a complete balance-sheet appendix?

## Full examples

These examples show content flow, not required headings or exact bullet counts.

The examples below are generalized and anonymized. They are meant to show the writing pattern and level of detail the model should follow, not to reproduce any specific source company.

### Example 1: Adjusted working capital with operating context

```markdown
## Net working capital

- Adjusted average net working capital for TTM Sep-25 is [$6.4 million]. The main adjustments relate to deferred revenue, the receivable impact of quality of earnings adjustments, and the normalization of elevated DSO during a temporary billing disruption.

Basis of presentation
The working capital schedule presents reported and adjusted net working capital for FY22, FY23, FY24, and TTM Sep-25.
Adjustments are grouped as follows:
**Definitional adjustments:** Adjustments to exclude cash and debt-like items from net working capital.
**Due diligence adjustments:** Net working capital impact of adjustments identified during diligence.
**Pro forma adjustments:** Adjustments for changes in business operations that may impact working capital.

**Seasonality:** Revenue activity is generally lower in the first quarter and strongest through the summer and early fall. This pattern is reflected in receivable balances and DSO, which are typically higher in the peak operating months. The adjusted balance should therefore be read in the context of the average profile rather than the month-end balance in isolation.

Source note: Management-prepared working-capital schedules and supporting account detail for FY22-FY24 and TTM Sep-25.

| Line item                    | FY22 | FY23 | FY24 | TTM Sep-25 |
| ---------------------------- | ---: | ---: | ---: | ---------: |
| Reported working capital     |  5.1 |  5.4 |  5.8 |        5.2 |
| Definitional adjustments     |  0.7 |  0.8 |  0.9 |        0.8 |
| Due diligence adjustments    |  0.2 |  0.3 |  0.4 |        0.3 |
| Pro forma adjustments        |  0.1 |  0.1 |  0.2 |        0.1 |
| **Adjusted working capital** |**6.1**|**6.6**|**7.3**|    **6.4** |

Net working capital adjustments

1. **Deferred revenue:** Deferred revenue of [$0.9 million] is excluded from net working capital to the extent it reflects upfront billings for services to be delivered in future periods, rather than the operating liquidity profile of the business.
2. **Out-of-period entries:** Out-of-period accrued liabilities and bonus accruals totaling [$0.3 million] are adjusted to the periods in which they relate so the working-capital analysis reflects the underlying timing of the obligations rather than the period in which the correcting entries were posted.
3. **AR impact of QofE adjustments:** The accounts receivable impact of the related quality of earnings adjustments is estimated at [$0.2 million] using the Company's historical DSO to reflect the expected collection profile of the adjusted revenue.
4. **Professional fees accrual:** A non-recurring accrual of [$180,000] for advisory fees is removed from net working capital as it does not reflect the recurring operating liability profile of the business.
5. **DSO normalization:** Customer-specific DSO increased to [82] days from a historical range of [48]-[52] days during [Q2-25 to Q3-25] as payments were delayed. This adjustment normalizes the related receivable balance to [50] days based on historic collection patterns.
6. **Prepaid expense normalization:** Prepaid expenses of [$0.4 million] peak when annual software, insurance, and maintenance contracts are paid and then unwind through the year. This adjustment straight-lines the balance to reflect a more representative monthly run-rate.

No supported target or peg basis was provided, so the section presents adjusted working-capital levels only and does not conclude on a surplus or deficit.
```

### Example 2: Multi-category working-capital section with sell-side and buy-side layers

```markdown
## Net working capital

- Average reported net working capital for FY25 was [$14.2 million], which increases to [$15.0 million] after definitional and sell-side adjustments and decreases to [$14.6 million] after buy-side diligence adjustments.

Basis of presentation
The summary adjusted net working capital schedule presents reported, sell-side adjusted, and final adjusted net working capital for FY24, TTM Oct-25, and FY25.
Adjustments are grouped as follows:
**Definitional adjustments:** Adjustments to remove cash- and debt-like balances from reported working capital.
**Sell-side adjustments:** Adjustments presented in the seller's due diligence report.
**Buy-side diligence adjustments:** Incremental changes made where the sell-side assumptions, phasing, or classification did not appear supportable.

Source note: Management working-capital schedules, seller due diligence schedules, and buy-side analysis.

| Line item                           | FY24 | FY25 |
| ----------------------------------- | ---: | ---: |
| Reported working capital            | 10.3 | 10.7 |
| Definitional adjustments            |  3.1 |  3.4 |
| Sell-side adjustments               |  1.4 |  1.2 |
| Buy-side diligence adjustments      | (0.5) | (0.7) |
| **Adjusted working capital**        |**14.3**|**14.6**|

**Working-capital profile:** Receivable and payable behavior remained relatively stable through the historical period, with the main movement in FY25 driven by higher accrued incentive receivables and increased payables associated with growth.

Net working capital adjustments

1. **Definitional adjustments:** The main definitional adjustments impacting average net working capital in FY25 include income taxes payable, accrued interest, and the exclusion of reported operating cash. These balances fall outside the operating working-capital perimeter and are therefore removed from the working-capital view.
2. **Sell-side adjustments:** The seller-prepared adjustments were used as the starting point for the analysis, with the largest items relating to transaction-related costs, excess cash held in trust, and non-recurring accruals.
3. **Recurring cost challenge:** A seller-proposed adjustment of [$0.2 million] has been reversed where the underlying IT support and recruitment costs appear recurring and remain part of the go-forward working-capital profile.
4. **Bonus true-up:** Bonus accruals are adjusted by [$140,000] to align the reported balance with the underlying period of employee service and the expected timing of payment.
5. **Excess cash in trust:** Excess cash held in trust of [$0.5 million] is excluded from net working capital to the extent it exceeds minimum operating or regulatory requirements and is assessed separately within the net debt analysis.
6. **Pro forma working-capital adjustment:** A pro forma adjustment of [$0.3 million] is included to reflect the working-capital effect of new customer volumes added during the most recent period on a run-rate basis.

Target working capital
No independent target-working-capital amount was provided beyond the adjusted working-capital analysis shown above. The section therefore stops at adjusted working capital and does not conclude on a separate target surplus or deficit.
```
