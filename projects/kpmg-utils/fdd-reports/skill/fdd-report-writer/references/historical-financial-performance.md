# Section contract: Historical / financial performance

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

The Historical / financial performance section explains how trading performance moved over the historical period and what the supplied income statement actually means. It should walk through the significant captions on the P&L, decompose the composition and drivers of those captions over time, and provide enough detail for the reader to understand the parts of the income statement that matter to diligence.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Treat the income statement as the anchor exhibit:** The section should be written to sit beside the user-supplied or separately pasted P&L unless the user explicitly asks for the exhibit to be recreated.
2. **Lead with the historical trading story:** Start with the headline movement in revenue, margin, and earnings before walking the underlying captions.
3. **Walk the significant captions in P&L order:** In most cases, move from revenue to direct or variable expense, gross profit, operating cost captions, operating profit or EBITDA, and then below-EBITDA lines where relevant.
4. **Provide real caption detail:** For each significant caption, explain what it includes, quantify the major balances or subcomponents where useful, and explain the historical drivers of change.
5. **Use the relevant mechanics for the caption:** Include pricing, volume, same-site growth, utilization, compensation structure, capitalization policy, lease treatment, interest-rate effects, or other operating and accounting mechanics where they help interpret the trend.
6. **Bring in related analyses where they improve the P&L story:** Use gross margin by LOB, segment analysis, or workstream cross-references when they genuinely help explain the historical trading pattern.
7. **Keep the focus on historical performance:** This is not a QoE bridge or a recommendation section. Use the historical P&L and its drivers as the organizing logic.

## Analytical workflow

1. **Confirm the exhibit basis:** Identify the periods, units, and basis of the income statement, including whether it is reported, adjusted, reclassified, or perimeter-adjusted.
2. **Review the full P&L before drafting:** Identify the largest movements in revenue, direct costs, gross profit, operating expenses, operating profit, and any below-EBITDA captions that are relevant to the historical story.
3. **Review any supporting analyses:** Use gross-margin-by-LOB, segment schedules, or caption support where available to understand composition and drivers.
4. **Identify the significant captions:** Focus on the lines that matter most by absolute size, margin impact, historical movement, or interpretive complexity.
5. **Draft the overview first:** Write 1-2 opening lines that explain the overall trading trend across the historical period.
6. **Build the caption commentary in income-statement order:** Walk the significant captions in the same order the reader sees them in the exhibit.
7. **Decompose each material caption:** For each key line, state what it includes, quantify the major components where useful, and explain the main historical drivers.
8. **Add basis or comparability context where relevant:** Explain reclasses, adjusted views, accounting policy impacts, or support limitations when they materially affect how the trends should be read.
9. **Stop when the income statement is fully interpretable:** Include enough detail for the reader to understand every material part of the P&L, but do not force commentary for immaterial captions.

## Section architecture

Scale the section based on the complexity of the P&L, the number of material captions, and the amount of supporting detail needed to explain the historical trends.

**Verbosity:**

- Stop adding detail when the reader can understand the historical trading story, the composition of the significant captions, and the main drivers of margin and earnings over the covered periods. In most cases, aim for one anchor exhibit plus 8-16 commentary bullets or numbered items and roughly 600-1,100 words of narrative. Move above that range only when the P&L basis, segment structure, or caption mechanics require additional explanation.

**Required content areas:**

- Performance overview
  - State the headline movement in revenue, margin, and profit over the historical period.
- Key driver commentary
  - Walk the significant captions in income-statement order and explain what they include and why they moved.
- Earnings takeaway
  - Tie the caption movements back to gross profit, operating profit, EBITDA, EBT, or another relevant earnings measure.

**Optional content areas:**

- Exhibit basis note
  - Add when the exhibit is adjusted, reclassified, perimeter-adjusted, or otherwise needs context before the trends can be interpreted.
- Segment or LOB support
  - Add when gross-margin-by-LOB, entity, channel, or segment information materially improves understanding of the P&L.
- Caption mechanics note
  - Add when a caption includes sector-specific or accounting-specific mechanics that materially affect interpretation.
- Comparability note
  - Add when reclasses, policy changes, timing differences, or partial-period support affect how periods should be compared.
- Below-EBITDA commentary
  - Add when interest, tax, other income, FX, fair-value movements, or other non-operating lines are material to the historical story.

**Data / information typically needed:**

- The income statement exhibit by period, preferably covering the full historical period and latest TTM or LTM period where relevant
- Supporting general-ledger, trial-balance, or caption schedules where available so significant lines can be decomposed into meaningful components
- The basis of presentation, such as reported, adjusted, reclassified, or perimeter-adjusted
- Supporting detail for significant captions, including composition and major components
- Gross margin by LOB, segment, entity, channel, or other supporting schedules where relevant
- Operational drivers such as price, volume, customer growth, same-site performance, headcount, utilization, or other business metrics where relevant
- Accounting or reporting mechanics such as capitalization policy, lease treatment, provisioning methodology, revenue-recognition mechanics, or interest-rate effects where relevant
- Any material basis or comparability considerations affecting the periods presented

**Data mapping considerations:**

- Start from the full income statement and identify the largest and most important caption movements before drafting.
- Use supporting schedules to break down significant captions into logical components where that improves understanding.
- Explain captions in the order they appear on the income statement so the narrative is easy to read beside the exhibit.
- Quantify the significant balances within a caption where useful, especially when the caption includes multiple components or non-obvious subcategories.
- Bring in gross-margin-by-LOB or segment support when the main P&L alone does not explain the margin story.
- Use below-EBITDA commentary only when those lines are relevant to the historical trading story or to how the period results should be interpreted.
- If the user has supplied the exhibit already, write the commentary to sit beside it rather than recreating the exhibit.

**Formatting principle:**

- Use a short opening overview followed by bulleted or numbered caption-level commentary that mirrors the order of the income statement exhibit.
- Format fiscal years as `FY24`, `FY25`, etc. Format trailing periods as `TTM Jun-24`, `LTM Dec-24`, or similar source-consistent shorthand.
- Format monetary amounts as `$x.x million`, and use full amounts such as `$325,000` or `$90,000` for balances below `$0.1 million`.
- When discussing a caption, use the exhibit label followed by a colon in bold, then explain the composition, mechanics, and historical drivers. If the source output uses numbered key drivers, keep the numbered sequence aligned to the exhibit order.

**Ordering rules:**

- Start with the exhibit basis note when the reader needs that context before reading the P&L.
- Follow with the performance overview.
- Then walk the significant captions in income-statement order.
- Use segment or LOB support where it helps explain the margin or revenue story.
- End with below-EBITDA lines or comparability notes only when they are relevant to the historical reading.

## Typical content areas

Use these as the main building blocks for the section. Choose only the content areas the draft actually needs.

The standard pattern is a short overview followed by bulleted or numbered caption commentary in income-statement order.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each content-area definition.

### Exhibit basis note

- Purpose: explain what the income statement exhibit represents when the basis is not self-explanatory.
- Use when: the exhibit is adjusted, reclassified, annualized, or perimeter-adjusted.
- Skip when: the exhibit basis is already obvious.
- Target length: 15-40 words.
- Source note: recommended.
- Example: `The income statement information included in this section is presented on an adjusted basis and excludes standalone cost considerations.`

### Overview line

- Purpose: state the main historical trading story in 1-2 sentences.
- Use when: opening the section.
- Skip when: never; this is the normal entry point to the section.
- Target length: 20-60 words.
- Source note: usually not needed if the exhibit is visible.
- Example: `Increase in revenue from $52.8 million in FY22 to $81.4 million in TTM Sep-25 is primarily driven by higher membership volumes and improved retention.`

### Revenue commentary

- Purpose: explain the composition of revenue and the main drivers of historical movement.
- Use when: revenue is a material part of the story, which is most cases.
- Skip when: never for a standard P&L section.
- Target length: 45-110 words.
- Source note: recommended when based on management support or segment detail.
- Example: `**Revenue:** The Company primarily earns revenue through recurring subscription fees ($46.2 million), implementation services ($21.8 million), and professional services ($9.4 million). Revenue increased from FY22 to TTM Sep-25 primarily due to new customer wins, annual price increases, and expansion within existing enterprise accounts.`

### Direct cost or gross-margin commentary

- Purpose: explain direct costs, variable costs, or gross margin and the factors driving change over time.
- Use when: the section includes direct costs, cost of revenue, variable expenses, or gross profit.
- Skip when: the business model has no meaningful gross-margin layer.
- Target length: 45-120 words.
- Source note: recommended.
- Example: `**Cost of revenue:** Cost of revenue primarily includes implementation labour ($8.1 million), third-party hosting and software licenses ($5.6 million), and customer support payroll ($4.2 million). Gross margin improved from 68.4% in FY22 to 71.6% in TTM Sep-25, primarily due to pricing actions and a higher mix of subscription revenue.`

### Operating cost commentary

- Purpose: explain a significant operating cost caption and the major components within it.
- Use when: a cost caption materially affects EBITDA or the historical trend.
- Skip when: the line is too small to matter.
- Target length: 40-120 words.
- Source note: recommended.
- Example: `**Sales and marketing:** TTM Sep-25 sales and marketing includes salaries and commissions ($6.7 million), digital demand generation ($2.1 million), channel partner fees ($1.4 million), and customer events ($0.6 million). The increase over the historical period reflects investment in enterprise sales capacity and higher commission expense on new bookings.`

### Caption mechanics note

- Purpose: explain operating, commercial, or accounting mechanics that are necessary to interpret a caption.
- Use when: a caption involves capitalization, revenue recognition, lease accounting, funding costs, provisioning, or other non-obvious mechanics.
- Skip when: the caption can be understood without additional mechanics.
- Target length: 30-100 words.
- Source note: recommended.
- Example: `**Capitalized development costs:** Relates to internally capitalized labour costs for product development. Once a project is placed in service, capitalized costs are amortized over the expected useful life, typically three to five years, which affects the split between operating expense and depreciation and amortization.`

### Below-EBITDA commentary

- Purpose: explain interest, tax, FX, fair-value, or other below-EBITDA lines when they are relevant to the historical story.
- Use when: below-EBITDA lines are material or unusual.
- Skip when: those lines are immaterial to the section.
- Target length: 30-100 words.
- Source note: recommended.
- Example: `**Interest expense:** Primarily comprises interest on the term loan and revolving credit facility. The increase from FY22 to FY24 reflects both higher average debt balances and higher reference rates over the historical period.`

### Comparability note

- Purpose: explain a restatement, reclass, or basis issue that affects period comparability.
- Use when: periods are comparable only on an adjusted basis or a policy change materially affects the trend.
- Skip when: the issue is immaterial.
- Target length: 20-60 words.
- Source note: recommended.
- Example: `The historical periods are presented on a reclassified basis to align direct costs and operating expenses across the covered periods.`

## Assembly patterns

Use one of these patterns based on the section. These are practical guides, not fixed templates.

### Standard P&L walkthrough

- Usual flow: exhibit basis note if needed -> overview -> revenue -> direct costs or gross profit -> operating costs -> EBITDA or operating profit.
- In practice, this pattern often uses 6-10 caption commentary items.
- Aim for 8-12 commentary items plus one exhibit.
- Stop adding detail when the reader can interpret the significant captions and understand the historical trading story.

### Driver-heavy income statement section

- Usual flow: overview -> revenue and gross-margin drivers -> multiple operating-cost captions -> earnings conclusion -> below-EBITDA captions if relevant.
- In practice, this pattern often includes deeper caption composition and operating mechanics.
- Aim for 10-14 commentary items plus one exhibit.
- Stop adding detail when each major caption has a clear composition and driver explanation.

### Basis or comparability-heavy section

- Usual flow: exhibit basis note -> overview -> core caption commentary -> comparability or reconciliation notes -> earnings conclusion.
- In practice, this pattern often appears where adjusted or perimeter-aligned P&Ls are used.
- Aim for 8-12 commentary items plus one exhibit.
- Stop adding detail when the reader can distinguish the basis of presentation and read the historical trends correctly.

## Section-specific writing guidance

1. Use the same caption language as the income statement exhibit whenever possible.
2. When a caption maps directly to a line in the exhibit, use the caption name followed by a colon in bold, then the explanation.
3. Use bullets or numbered key drivers consistently through the section instead of switching between paragraphs, bullets, and subheadings.
4. Keep cross-references brief and use them only when another section genuinely helps explain the historical trading story.

## Verification and review checks

**Verification questions:**

- Does the section explain the historical trading story clearly in the first 1-2 lines?
- Does the section follow a clear overview-plus-key-drivers pattern that a reader can scan beside the exhibit?
- Does the commentary walk the significant captions in the same order the reader sees them in the income statement?
- For each material caption, does the commentary explain what it includes, how it moved, and why it matters?
- Where relevant, does the commentary quantify significant balances within the caption and include the mechanics needed to interpret them?
- If the exhibit is adjusted, reclassified, or perimeter-aligned, is that basis stated clearly?
- Does the section provide enough detail for the reader to understand the material parts of the income statement without forcing commentary for immaterial lines?

## Full examples

These examples show content flow, not required headings or exact bullet counts.

The examples below show a type of income-statement exhibit the skill might typically receive, followed by the commentary it would draft from that exhibit. The exhibit is included here to show the incoming data shape; the skill does not need to recreate the table unless the user asks for it.

### Example 1: Standard income-statement walkthrough

```markdown
## Historical / financial performance

- The table below presents the reported income statement for FY22 to FY24 and TTM Sep-25.

Source note: Management financial statements and supporting schedules for FY22-FY24 and TTM Sep-25.

| Line item                                         |      FY22 |      FY23 |      FY24 | TTM Sep-25 |
| ------------------------------------------------- | --------: | --------: | --------: | ---------: |
| Revenue                                           |      52.8 |      60.9 |      74.6 |       81.4 |
| Cost of revenue                                   |     (16.7) |     (19.0) |     (22.6) |      (23.1) |
| **Gross profit**                                  |   **36.1** |   **41.9** |   **52.0** |    **58.3** |
| Sales and marketing                               |      (8.3) |      (9.6) |     (11.2) |      (10.8) |
| Product and technology                            |      (6.2) |      (7.1) |      (8.0) |       (8.7) |
| General and administrative                        |      (7.5) |      (8.2) |      (9.6) |      (10.4) |
| Depreciation and amortization expense             |      (2.4) |      (2.7) |      (3.2) |       (3.4) |
| **Operating profit**                              |   **11.7** |   **14.3** |   **20.0** |    **25.0** |
| Interest expense                                  |      (1.1) |      (1.4) |      (1.9) |       (2.0) |
| Income tax expense                                |      (2.5) |      (3.0) |      (4.0) |       (5.2) |
| **Net income**                                    |    **8.1** |    **9.9** |   **14.1** |    **17.8** |
| EBITDA                                            |   **14.1** |   **17.0** |   **23.2** |    **28.4** |

Increase in revenue from $52.8 million in FY22 to $81.4 million in TTM Sep-25 is primarily driven by higher subscription volumes and customer expansion within the enterprise base.

1. **Revenue:** The Company primarily earns revenue through recurring subscription fees ($46.2 million), implementation services ($21.8 million), and professional services ($9.4 million). Revenue increased over the historical period due to new customer wins, annual price increases, and expansion within existing enterprise accounts. Professional services revenue remained more project-based and therefore grew less consistently than subscription revenue.
2. **Cost of revenue:** Cost of revenue primarily includes implementation labour ($8.1 million), third-party hosting and software licenses ($5.6 million), and customer support payroll ($4.2 million). Gross margin improved from 68.4% in FY22 to 71.6% in TTM Sep-25, primarily due to pricing actions, automation within support workflows, and a higher mix of recurring subscription revenue.
3. **Sales and marketing:** TTM Sep-25 sales and marketing includes salaries and commissions ($6.7 million), digital demand generation ($2.1 million), channel partner fees ($1.4 million), and customer events ($0.6 million). The increase over the historical period reflects investment in enterprise sales capacity and higher commission expense on new bookings.
4. **Product and technology:** Primarily consists of software engineering payroll, cloud infrastructure, software tools, and internally developed product support costs. The increase from $6.2 million in FY22 to $8.7 million in TTM Sep-25 reflects product hiring and higher cloud usage associated with the expanded customer base.
5. **General and administrative:** Includes finance, people, legal, and executive payroll, together with audit, insurance, and office costs. The increase over the historical period reflects public-company readiness work, higher insurance costs, and additional finance and compliance headcount.
6. **Depreciation and amortization expense:** Consists primarily of amortization on internally developed software and depreciation on computer equipment and office lease assets. Amortization increased over the period as larger development projects were placed in service.
7. **Interest expense:** Primarily comprises interest on the term loan and revolving credit facility. The increase from FY22 to TTM Sep-25 reflects both higher average debt balances and a higher rate environment over the historical period.
8. **Earnings takeaway:** EBITDA increased from $14.1 million in FY22 to $28.4 million in TTM Sep-25 as revenue growth outpaced the increase in operating costs and gross margin improved over the covered periods.
```

### Example 2: Adjusted basis and driver-heavy P&L section

```markdown
## Historical / financial performance

- The table below presents the adjusted income statement for FY23 to FY25 and includes perimeter and QofE alignment adjustments.

Source note: Audited financial statements FY23-FY25, management trial balances, and adjusted perimeter schedules.

| Line item                          |      FY23 |      FY24 |      FY25 |
| ---------------------------------- | --------: | --------: | --------: |
| Net interest income                |     318.4 |     356.7 |     387.9 |
| Interchange income                 |     146.8 |     171.2 |     194.6 |
| Other card and fee income          |      41.5 |      47.9 |      55.4 |
| **Total revenue**                  | **506.7** | **575.8** | **637.9** |
| Provision for credit losses        |     (68.2) |     (82.1) |     (95.6) |
| Loyalty program costs              |     (54.1) |     (63.7) |     (72.5) |
| Processing and servicing costs     |     (61.7) |     (69.3) |     (81.4) |
| Salaries and employee benefits     |     (39.5) |     (44.6) |     (50.8) |
| Marketing and customer acquisition |     (12.8) |     (15.4) |     (23.7) |
| Fraud losses and service fees      |      (7.4) |      (9.8) |     (14.6) |
| Professional fees                  |      (6.1) |      (6.7) |      (7.3) |
| Other expenses                     |      (8.6) |      (9.4) |      (9.8) |
| **Adjusted EBITDA**                | **248.3** | **274.8** | **282.2** |

The income statement information included in this section is presented on an adjusted basis and excludes standalone cost considerations.

Revenue is primarily generated through net interest income and interchange income, with growth from FY23 to FY25 driven by higher cardholder spend, revolving balances, and fee-related income.

1. **Net interest income:** Represents interest income generated from credit card balances, treasury placements, and cash deposits, offset by interest expense on customer deposits, brokered funding, and securitization facilities. Net interest income increased from $318.4 million in FY23 to $387.9 million in FY25, driven by higher receivable balances and stronger portfolio yield, partially offset by higher funding costs.
2. **Interchange income:** Represents revenue earned from the payment network as customers transact on their cards. Interchange increased from $146.8 million in FY23 to $194.6 million in FY25, primarily due to higher spend volume and cardholder growth.
3. **Other card and fee income:** Includes annual fees, foreign exchange fees, balance protection premiums, cash-advance fees, and other customer charges. The increase over the historical period reflects portfolio growth and higher penetration of premium card products.
4. **Provision for credit losses:** Comprises direct write-offs and the movement in expected credit loss reserves. The provision increased from FY23 to FY25 in line with receivable growth and updated macroeconomic assumptions embedded in the reserve model.
5. **Loyalty program costs:** Represents the cost of points issued to customers and reimbursed to the loyalty counterparty upon redemption. This caption increased with higher cardholder spend and greater rewards activity across the portfolio.
6. **Processing and servicing costs:** Includes payment-network fees, third-party processing, cardholder account-management systems, call-center support, and collection services. A meaningful portion of this caption scales with transaction volumes and active account growth.
7. **Salaries and employee benefits:** Includes salaries, employer benefits, paid time off, and variable compensation. Payroll increased from $39.5 million in FY23 to $50.8 million in FY25, primarily driven by headcount additions across risk, servicing, and technology functions.
8. **Marketing and customer acquisition:** Includes digital marketing, partner commissions, welcome offers, and customer acquisition costs paid to third-party vendors. FY25 includes higher fixed program spend and increased variable acquisition costs tied to new-account growth.
9. **Fraud losses and service fees:** FY25 includes $6.1 million in fraud losses and $8.5 million in service fees incurred to monitor and resolve fraud-related activity as transaction volumes increased.
10. **Adjusted EBITDA:** Adjusted EBITDA increased from $248.3 million in FY23 to $282.2 million in FY25 as revenue growth and operating leverage were partly offset by higher credit provisioning, marketing investment, and fraud-related costs.
```
