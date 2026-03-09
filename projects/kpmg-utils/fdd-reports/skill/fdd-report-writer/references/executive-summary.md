# Section contract: Executive summary

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

The Executive Summary brings the most important findings from the report to the forefront. In most cases, it should present key findings across quality of earnings, net working capital, net debt, and any other material areas of the report. It should synthesize the current deal view from the full report contents provided, or from the specific workstream inputs the user supplies, in a format that is concise, quantified, and easy to scan.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Start from the most important findings, not the process:** The section should surface the findings that matter most for the deal view.
2. **Use the major workstreams as the default structure:** In most cases, key findings should be organized around quality of earnings, net working capital, net debt, and other material areas.
3. **Build the summary from the full report or supplied workstream inputs:** Review all provided content before deciding what belongs in the executive summary.
4. **Select the most significant findings within each workstream:** Prioritize findings based on decision relevance, absolute value, closing impact, or analytical risk.
5. **Preserve the key-finding sentence pattern:** Lead with a category or summary line, then present the most relevant findings with the amount, unit, and explanation.
6. **Quantify every key finding that can be quantified:** Anchor findings to a period, date, and unit such as Adjusted EBITDA, NWC, or net debt.
7. **Let other key areas be dynamic:** Include other key findings only when they are significant, such as budget achievability, reporting environment, standalone costs, reconciliation issues, or cash flow considerations.
8. **Keep the section concise:** This is a synthesis section. Pull forward the key findings, not the full workstream analysis.

## Analytical workflow

1. **Identify the drafting request:** Confirm whether the user wants a full executive summary, a key findings section, or a key finding on a specific topic.
2. **Inventory the available inputs:** Use the entire report so far when provided. Otherwise, use the specific sections, adjustment schedules, or findings the user supplies.
3. **Review all provided content before drafting:** Scan the report contents to identify the most material findings rather than drafting from one section in isolation.
4. **Determine the workstreams to include:** Default to quality of earnings, net working capital, net debt, and other material areas present in the report.
5. **Rank findings within each workstream:** Prioritize the items that are most significant by amount, risk, classification impact, closing impact, or usefulness to valuation.
6. **Group adjustment-driven findings into the right categories:** For quality of earnings, use management adjustments, diligence adjustments, pro forma adjustments, and other considerations where relevant. For net working capital, use diligence adjustments, pro forma adjustments, and other significant considerations where relevant.
7. **Select the strongest items:** As a rule of thumb, pull the 2-3 most significant items within each relevant category, unless the source clearly supports a shorter or longer list.
8. **Draft in the standard key-finding format:** Use a workstream label, then a short lead-in sentence, then the specific findings written in the same concise, quantified structure.
9. **Handle topic-specific requests the same way:** If the user asks for a key finding on a specific topic, scan all provided materials for that theme and distill the finding in the same format.

## Section architecture

Scale the section based on the number of material workstreams, the significance of the findings, and whether the user is asking for a full executive summary or a topic-specific key finding.

**Verbosity:**

- Stop adding detail when the reader can understand the key findings across the material workstreams, the most significant supporting items within those workstreams, and any major sensitivities that still affect the current view. In most cases, aim for 1-2 opening bullets plus 3-5 key finding groupings. Move above that range only when the report genuinely contains several major workstreams or the user asks for broader coverage.

**Required content areas:**

- Transaction context and scope
  - State what transaction is being evaluated and, where relevant, define the transaction perimeter or period under review.
- Key findings by major workstream
  - Present the most important findings across the material workstreams, usually starting with quality of earnings, net working capital, and net debt when those analyses are in scope.
- Other material areas or sensitivities
  - Pull forward any other significant findings from the report that materially affect the current view, such as reporting environment, budget achievability, reconciliation issues, or other cash flow considerations.

**Optional content areas:**

- Quality of earnings categories
  - Use when the quality of earnings findings are best organized into management adjustments, diligence adjustments, pro forma adjustments, or other considerations.
- Net working capital categories
  - Use when diligence adjustments, pro forma adjustments, or other working capital considerations need to be separated for clarity.
- Topic-specific key finding
  - Use when the user asks for a key finding on a specific topic rather than a full executive summary.
- Reporting basis note
  - Use when the basis of preparation, audit status, or reconciliation status materially affects how the findings should be read.
- Budget or forecast achievability
  - Use when budget performance or forecast achievability is a material finding in the report.
- Other cash flow considerations
  - Use when cash flow items, timing issues, or other valuation-model considerations are important enough to be surfaced alongside the main findings.

**Data / information typically needed:**

- The report sections completed so far, or the specific workstream materials the user has provided
- Transaction context and perimeter details when a full executive summary is being drafted
- Quality of earnings adjustments, including adjustment category, amount, and rationale
- Net working capital adjustments, including amount, rationale, and any related days metrics
- Net debt and debt-like items, including key balances, facilities, restrictions, or closing implications
- Any other significant findings from the report, such as reconciliation issues, standalone costs, reporting environment findings, or budget achievability observations
- The relevant period basis, such as FY24, TTM Jun-24, or closing-date basis

**Data mapping considerations:**

- Start with the full report contents when they are available. Do not draft the executive summary from one workstream alone if broader report content has been provided.
- Default to quality of earnings, net working capital, and net debt as the core executive-summary workstreams when those analyses are available.
- For quality of earnings, usually pull the 2-3 most significant items within each relevant category, ordered by category and then by significance.
- For net working capital, usually pull the highest-value or highest-risk adjustments, especially where they affect operational liquidity, true-up mechanics, or days metrics.
- For net debt, focus on the largest debt and debt-like items, financing structure, and any restrictions or closing implications.
- Use `Other key areas` dynamically. Pull in findings from any section of the report when they are significant enough to belong in the executive summary.
- If the user asks for a key finding on a specific topic, scan all provided materials for that theme and write the finding in the same structure used for the major workstreams.
- If the user has already provided candidate key findings, refine, reorder, and tighten them rather than recreating the analysis from scratch.

**Formatting principle:**

- Use simple workstream labels such as `Quality of earnings:`, `Net working capital:`, `Net debt:`, or `Other key findings:` followed by short lead-in sentences and quantified finding lines.
- Format fiscal years as `FY24`, `FY25`, etc. Format trailing periods as `TTM Jun-24`, `LTM Dec-24`, or similar source-consistent shorthand.
- Format monetary amounts as `$x.x million`, and use full amounts such as `$750,000` or `$90,000` for balances below `$0.1 million`.
- For quantified findings, place the amount and unit in parentheses immediately after the label when that is the clearest format. Example: `Customer attrition (-$1.2 million Adjusted EBITDA):`

**Ordering rules:**

- For a full executive summary, start with transaction context and scope.
- Follow with `Quality of earnings`, then `Net working capital`, then `Net debt` when those workstreams are in scope.
- Follow with `Other key findings` only for the additional areas that are significant enough to be surfaced.
- Within quality of earnings, use this default category order when relevant: management adjustments -> diligence adjustments -> pro forma adjustments -> other considerations.
- Within net working capital, use this default category order when relevant: diligence adjustments -> pro forma adjustments -> other considerations.
- For topic-specific requests, start with the requested topic and build the finding from the most relevant evidence across the provided materials.

## Typical content areas

Use these as the main building blocks for the section. Choose only the content areas the draft actually needs.

The standard pattern is a short transaction context, followed by workstream key findings written as simple labels, short lead-in lines, and quantified finding statements.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each content-area definition.

### Transaction context

- Purpose: state who is evaluating what transaction and, where relevant, define the perimeter or period under review.
- Use when: drafting a full executive summary.
- Skip when: the user asks only for a topic-specific key finding.
- Target length: 15-45 words.
- Source note: usually not needed unless the perimeter is unusual.
- Example: `Orion Capital is evaluating a majority investment in HarborPay Solutions, with the review focused on FY22-FY24 and TTM Jun-24.`

### Workstream label

- Purpose: introduce a major key-finding grouping such as quality of earnings, net working capital, or net debt.
- Use when: organizing the summary into workstreams.
- Skip when: the user asks only for a single-topic key finding.
- Target length: 2-8 words.
- Source note: not needed.
- Example: `Quality of earnings:`

### Category lead-in

- Purpose: introduce a relevant finding category within a workstream.
- Use when: the workstream is best organized into categories such as diligence adjustments or pro forma adjustments.
- Skip when: the workstream only needs one compact finding set.
- Target length: 8-22 words.
- Source note: not needed.
- Example: `Select due diligence adjustments to TTM Jun-24 include the following:`

### Key finding statement

- Purpose: state one quantified finding in the standard executive-summary pattern.
- Use when: pulling the most important findings from a workstream or topic.
- Skip when: the point is too immaterial or too detailed for the summary.
- Target length: 30-90 words.
- Source note: recommended when the finding depends on a specific basis or source set.
- Example: `Interchange reserve true-up (-$1.4 million Adjusted EBITDA): The Company records an accrual for anticipated interchange rebates based on monthly estimates. Reported results were revised using actual contract settlements through Jun-24 to normalize period-to-period volatility.`

### Workstream summary line

- Purpose: state a top-line conclusion before the detailed findings, when that helps orient the reader.
- Use when: the workstream has a headline metric or conclusion that should be stated first.
- Skip when: the detailed findings alone are sufficient.
- Target length: 12-35 words.
- Source note: recommended when the metric basis is not obvious.
- Example: `TTM Jun-24 pro forma EBITDA is $27.8 million after management, diligence, and pro forma adjustments.`

### Other key area finding

- Purpose: bring forward a significant finding from another report area that is material enough to sit alongside the major workstreams.
- Use when: budget achievability, reporting environment, reconciliation issues, standalone costs, or another report area is materially important.
- Skip when: the point is secondary detail that belongs in the underlying section only.
- Target length: 30-90 words.
- Source note: recommended.
- Example: `Reporting environment: FY22-FY24 are audit-backed; however, TTM Jun-24 relies on management schedules reconciled to the trial balance, and selected balance-sheet mappings remain subject to final review.`

### Topic-specific key finding

- Purpose: distill a key finding on a user-requested topic by scanning all relevant provided materials.
- Use when: the user asks for a key finding on reconciliation, reporting issues, standalone costs, or any other specific theme.
- Skip when: drafting a standard full executive summary with the usual workstream structure.
- Target length: 60-140 words.
- Source note: recommended.
- Example: `Key finding on reconciliation issues: Historical working-capital and net debt analyses rely on a mix of audited FY24 balances and management schedules for TTM Jun-24. The most material reconciliation issue relates to intercompany clearing balances that are still being mapped across the in-scope entities, which may affect final classification between net debt and working capital.`

## Assembly patterns

Use one of these patterns based on the request. These are practical guides, not fixed templates.

### Standard executive summary with major workstreams

- Usual flow: transaction context -> quality of earnings -> net working capital -> net debt -> other key findings.
- In practice, this pattern often uses short category lead-ins within quality of earnings and net working capital.
- Aim for 4-6 key finding groupings.
- Stop adding detail when the reader understands the major workstream findings and the most material supporting items within each.

### Multi-workstream executive summary with additional report themes

- Usual flow: transaction context -> quality of earnings -> net working capital -> net debt -> other key findings such as reporting environment, budget achievability, or other cash flow considerations.
- In practice, this pattern often adds one or two additional report themes after the core workstreams.
- Aim for 5-7 key finding groupings.
- Stop adding detail when the reader understands the core workstreams plus the additional themes that materially affect the deal view.

### Topic-specific key finding request

- Usual flow: requested topic label -> short framing line if needed -> 2-4 distilled findings pulled from the most relevant provided materials.
- In practice, this pattern uses the same quantified sentence style as the standard workstream findings.
- Aim for 1-3 short paragraphs or finding lines.
- Stop adding detail when the requested topic is explained clearly enough for the user to carry it into the executive summary or another section.

## Section-specific writing guidance

1. Use the same key-finding sentence pattern consistently throughout the section.
2. When a workstream is adjustment-driven, organize the findings by category before listing the most significant items.
3. Keep `Other key findings` flexible and driven by significance, not by a fixed checklist.

## Verification and review checks

**Verification questions:**

- Does the section pull the most material findings from the full report contents or the specific materials the user provided?
- Where relevant, does the section use the standard major workstreams of quality of earnings, net working capital, net debt, and other key findings?
- Within adjustment-driven workstreams, are the findings grouped into sensible categories and limited to the most significant items?
- Are the findings quantified, period-anchored, and written in the standard key-finding sentence structure?
- If an additional report area is included, is it there because it is genuinely material to the current view?
- If the user asked for a key finding on a specific topic, does the draft clearly synthesize that topic from the relevant evidence provided?

## Full examples

These examples show content flow, not required headings or exact bullet counts.

The examples below are anonymized and illustrate the style and structure of the expected output.

### Example 1: Standard executive summary with major workstreams

```markdown
## Executive summary

- Orion Capital is evaluating a majority investment in HarborPay Solutions. The review is focused on FY22-FY24 and TTM Jun-24.

Quality of earnings:
TTM Jun-24 pro forma EBITDA is $27.8 million after diligence and pro forma adjustments.
Select due diligence adjustments to TTM Jun-24 include the following:
Revenue-share reserve true-up (-$1.8 million Adjusted EBITDA): The Company records a reserve for merchant revenue-share obligations based on monthly estimates. Reported results were revised using actual settlements through Jun-24 to remove period-to-period volatility from the reported accrual.
Settlement interest income (+$900,000 Adjusted EBITDA): Add back of interest income earned on overnight settlement cash balances, as it is considered part of normal business operations.
Select pro forma adjustments to TTM Jun-24 relate to the following:
New merchant wins (+$700,000 Adjusted EBITDA): Reflects the run-rate contribution of merchants onboarded during FY24 and H1 FY25, net of merchants lost during the same period.
Pricing amendment (+$600,000 Adjusted EBITDA): Represents the impact of revised pricing under a processing agreement effective April 2024, applied across the historical period for comparability.

Net working capital:
Select due diligence adjustments to TTM Jun-24 include the following:
Deferred revenue normalization (+$1.2 million): Removes balances relating to multi-period implementation services that do not reflect the day-to-day liquidity profile of the business.
Bonus accrual reclassification (-$500,000): Includes annual management bonus accruals in working capital because the related expense is reflected in EBITDA and the liability recurs in the ordinary course.
Select pro forma adjustments to TTM Jun-24 relate to the following:
Merchant receivables DSO normalization (-$1.4 million): Normalizes elevated DSO in the most recent period to 44 days, in line with the historical profile prior to a temporary billing dispute.

Net debt:
Select debt and debt-like items as at Jun-24 include the following:
Senior term facility ($41.8 million): Represents the primary funded debt instrument of the business and remains the largest net debt item at Jun-24.
Transaction bonuses ($1.1 million): Reflects accrued change-of-control payments expected to be settled at closing.
Lease liabilities ($4.6 million): Relates primarily to office and operations leases and is treated as debt-like on the current basis.

Other key findings:
Reporting environment: FY22-FY24 are audit-backed; however, TTM Jun-24 relies on management schedules reconciled to the trial balance, and selected balance-sheet mappings remain subject to final review.
Budget achievability: Based on YTD Jun-24 trading and current merchant onboarding trends, the FY24 budget appears broadly achievable on an adjusted EBITDA basis.
```

### Example 2: Executive summary with other key areas

```markdown
## Executive summary

- Alder Peak Partners is evaluating an acquisition of Meridian Health Services. The review is focused on FY23-FY24 and TTM Aug-24.

Quality of earnings:
TTM Aug-24 pro forma EBITDA is $42.6 million after management, diligence, and pro forma adjustments.
Select diligence adjustments to TTM Aug-24 include the following:
Provider payroll true-up (-$1.3 million Adjusted EBITDA): Reflects correction of payroll costs understated in the historical close process for certain clinics acquired during FY24.
Non-recurring integration costs (+$800,000 Adjusted EBITDA): Removes one-time integration and systems migration costs relating to recently acquired practices.
Select pro forma adjustments to TTM Aug-24 relate to the following:
Clinic maturation (+$1.1 million Adjusted EBITDA): Reflects the annualized earnings impact of locations opened during FY24 as they move toward mature run-rate levels.

Net working capital:
Select diligence adjustments to TTM Aug-24 include the following:
Insurance receivable reserve (-$2.1 million): Removes disputed receivables aged beyond 180 days from the normalized working-capital position.
Acquisition-related accruals (+$900,000): Removes balances associated with pre-close acquisition and integration activities that are not part of ordinary-course working capital.

Net debt:
Select debt and debt-like items as at Aug-24 include the following:
Revolver borrowings ($18.4 million): Represents the primary short-term funding balance at Aug-24.
Deferred consideration ($3.2 million): Reflects unpaid acquisition consideration associated with two FY24 tuck-in acquisitions.

Other key findings:
Other cash flow considerations: Valuation should consider timing of cash collections on aged insurance receivables and the near-term cash outflow associated with deferred acquisition consideration.
Budget achievability: The FY24 budget appears achievable on a reported EBITDA basis; however, delivery of the pro forma case depends on clinic maturation and provider recruitment assumptions in Q4.
```

### Example 3: Topic-specific key finding request

```markdown
Key finding on reconciliation issues:
Historical working-capital and net debt analyses rely on a mix of audited FY24 balances and management schedules for TTM Jun-24. The most material reconciliation issues relate to intercompany clearing balances and payroll accrual mappings that remain subject to final review across the in-scope entities. These items do not currently change the direction of the deal view, but they may affect final classification between net debt, working capital, and other balance-sheet captions.
```
