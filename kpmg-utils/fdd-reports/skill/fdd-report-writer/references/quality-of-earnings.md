# Section contract: Quality of earnings

## Table of contents

- Section objective
- Core principles
- Analytical workflow
- Section architecture
- Data and drafting inputs
- Typical content areas
- Section-specific writing guidance
- Verification and review checks
- Full examples

## Section objective

The Quality of earnings reference supports three common tasks: rewriting existing adjustment wording, drafting new adjustment narratives from rough notes or support, and polishing already workable text. It should turn schedules, notes, and backup into quantified, active, company-specific diligence writing that explains what the item is, why it is adjusted, and how it affects earnings.

Simple add-backs can sometimes be drafted from the adjustment schedule alone when the caption clearly identifies the item, such as transaction costs, gains on disposal, or other obvious non-recurring items. More nuanced adjustments often require meeting notes, management explanations, or backup support to write a defensible narrative.

The same reference also supports full quality-of-earnings sections. When the user provides a bridge, detailed notes, or enough supporting context, use the bridge and section architecture to write the full section. When the user asks for one or more adjustments only, return those adjustments cleanly without forcing the full section structure.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Anchor the section to the right earnings basis:** Be clear whether the analysis starts from EBITDA, EBIT, EBT, net income, or another defined earnings metric, and carry that basis consistently through the section.
2. **Default to the narrowest useful deliverable:** If the user asks to rewrite, draft, or polish one or more adjustments, return those adjustments cleanly rather than forcing the full quality-of-earnings section.
3. **Keep included adjustments separate from excluded considerations:** If an item is subjective, pending, or unquantified, keep it outside the bridge and say why.
4. **Explain each adjustment through the underlying earnings logic:** State what the item is, why it is adjusted or not adjusted, how it affects normalized earnings, and what supports that treatment.
5. **Treat recurrence as a conclusion, not a label alone:** If an item is described as non-recurring, run-rate, recurring, or uncertain, provide the basis for that conclusion.
6. **Keep category logic visible where it matters:** Separate management adjustments, diligence adjustments, sell-side adjustments, pro forma items, and other considerations when those distinctions improve readability or align with the source schedule.
7. **Use the bridge as the anchor exhibit when the user asks for the full section:** Full quality-of-earnings sections are built around a reported-to-adjusted bridge or adjustment schedule, with commentary drafted beside it rather than as free-form prose.
8. **Keep the section focused on earnings normalization:** Do not let the section drift into a full operating review, a balance-sheet section, or a generic diligence memo.

## Analytical workflow

1. **Classify the writing task first:** Identify whether the user wants to rewrite existing adjustment wording, draft new adjustment narratives from rough notes, polish already workable adjustment text, or write the full quality-of-earnings section. If the ask is ambiguous, default to the narrowest practical adjustment-writing task rather than the full section.
2. **Match the writing mode to the source support:** If the user provides existing wording, improve it through rewrite or polish. If the user provides meeting notes, rough points, or adjustment support with no finished prose, draft fresh adjustment text from those inputs.
3. **Review the available support and define the perimeter:** Start from the relevant adjustment wording, notes, bridge, management schedule, or support pack and identify the earnings basis, covered periods, and whether the user wants one adjustment, a grouped set, or the full section.
4. **Assess whether the schedule is enough on its own:** If the adjustment schedule clearly identifies simple items such as transaction fees, gains on disposal, or other obvious non-recurring add-backs, draft directly from the schedule. If the treatment or rationale is not obvious, rely on notes, meeting commentary, or supporting detail before making the narrative more specific.
5. **Separate the adjustment population:** Distinguish included adjustments from excluded considerations, and keep management, diligence, sell-side, buy-side, and pro forma layers separate where that distinction exists in the support.
6. **Find the closest adjustment pattern:** For each adjustment, identify the closest narrative in the adjustment library and model the sentence pattern on that example before adapting it to the company-specific facts.
7. **Draft in the right output shape:** For rewrite, return revised adjustment wording only. For draft, convert rough notes into complete adjustment narratives. For polish, preserve the logic and structure unless clarity requires a cleaner rewrite. For a full section, start with the normalized earnings movement and basis of presentation, present the bridge, then walk the main adjustments.
8. **Keep the level of specificity supportable:** Quantify the item, use active voice, and state the rationale clearly, but do not infer unsupported facts beyond what the caption, notes, or backup can reasonably support.
9. **Stop when the requested deliverable is complete:** Include enough detail for the reader to understand the requested adjustment wording or the normalized earnings view, but do not expand a narrow writing ask into a full support memo.

## Section architecture

Scale the output based on the requested deliverable, the complexity of the earnings basis, the number of adjustment categories, and whether unresolved or sell-side items could still change the current normalized view.

**Verbosity:**

- Stop adding detail when the requested adjustment wording or normalized earnings discussion is fully interpretable. For rewrite, draft, or polish requests, this often means one paragraph per adjustment or one grouped block for a small adjustment set. For full-section requests, use one anchor bridge and then one numbered item per adjustment. Total length should scale with the number of adjustments and their complexity, but in most cases will fall around 450-1,100 words. Move above that range only when the section includes multiple adjustment categories, sell-side true-ups, or a more involved standalone-cost or pro forma discussion.

**Required content areas:**

- Requested output
  - Return the rewritten, drafted, or polished adjustment wording the user asked for, or the full section when the user explicitly asks for it.
- Earnings basis and treatment logic
  - State the relevant earnings basis and explain the treatment of the adjustment items included in the draft.
- Quantified adjustment commentary
  - Explain the adjustments in quantified, company-specific language supported by the available facts.

**Optional content areas:**

- Basis of presentation and bridge
  - Add when the user asks for the full quality-of-earnings section or a bridge-led exhibit.
- Adjustment category lead-ins
  - Add when management, diligence, sell-side, pro forma, or other groupings improve readability or match the schedule.
- Sell-side or prior-analysis comparison
  - Add when the analysis starts from a seller-prepared or prior diligence schedule and the reader needs to know what was retained, changed, or challenged.
- Standalone or replacement-cost commentary
  - Add when shared services, owner support, or group allocations require a normalized standalone cost view.
- Excluded or not-included items
  - Add when unresolved or unquantified items still matter to the earnings view.
- Key sensitivities
  - Add when an assumption or pending item could still change adjusted earnings.

## Data and drafting inputs

**Data / information typically needed:**

- Existing adjustment wording where the user wants rewrite or polish support
- Meeting notes, rough notes, management explanations, or talking points where the user wants fresh drafting support
- The reported-to-adjusted earnings bridge or management adjustment schedule for the relevant periods
- The reported earnings metric and any definitional bridge support where relevant
- Trial balances, GL detail, and support for the adjustment items
- Payroll, invoice, contract, headcount, facility, or policy support where relevant
- Management, sell-side, buy-side, or other diligence adjustment schedules where relevant
- Support for standalone costs, replacement costs, or pro forma adjustments where relevant
- Details of unresolved, unquantified, or excluded items where relevant

**Data mapping considerations:**

- If the user provides existing adjustment wording, preserve the underlying logic unless the text is unclear, unsupported, or structurally weak.
- If the user provides rough notes, convert them into complete adjustment narratives using the closest example pattern from the library.
- Use the bridge or adjustment schedule as the primary quantitative anchor when it is part of the requested deliverable.
- Keep the bridge categories visible when the source analysis uses them, such as management, diligence, sell-side, buy-side, or pro forma adjustments.
- Quantify the adjustment and explain what it relates to when that improves understanding of the earnings treatment.
- If the schedule alone clearly identifies a simple add-back, draft directly from the caption and quantify it without inventing extra support. For example, a clearly labeled transaction-fee, gain-on-sale, or other obvious non-recurring item can often be written from the schedule itself.
- If the adjustment rationale is not obvious from the schedule, rely on notes, management commentary, or backup support before making the narrative more specific.
- Distinguish clearly between included bridge items and earnings-relevant considerations that remain outside the bridge.
- If the user has already provided the bridge or exhibit, write the commentary to sit beside it rather than recreating it unless requested.
- If the request is narrower than a full section, return only the requested adjustment prose or grouped adjustment block.
- If source information is thin, keep the section concise and stay close to the supported adjustments.
- If a relevant adjustment point matters but support is incomplete, use an inline placeholder in square brackets rather than vague filler. Example: `Warranty-related costs of [...] remain outside adjusted EBITDA pending support for [...]`

**Formatting principle:**

- For rewrite, draft, or polish requests, return the requested adjustment wording directly without adding unasked-for section scaffolding.
- Use a short overview followed by a basis-of-presentation note, the bridge, and then adjustment commentary aligned to the bridge for full-section requests.
- When the source analysis uses adjustment categories, state them explicitly in the same plain-language style as the source, such as `Management adjustments`, `Diligence adjustments`, `Sell-side adjustments`, or `Pro forma adjustments`.
- When discussing a bridge line or adjustment that maps directly to the schedule, use the schedule label followed by a colon in bold, then explain what it relates to and how it affects normalized earnings.
- For narrower adjustment-only requests, use the closest adjustment narrative pattern directly and skip the broader section scaffolding.

## Typical content areas

Use these as the main building blocks for the section. Choose only the content areas the draft actually needs.

The most common pattern is one or more rewritten, drafted, or polished adjustment narratives. The full-section pattern is an overview of the reported and adjusted earnings position, followed by basis-of-presentation commentary, the bridge, and then the main earnings adjustments, with excluded items and sensitivities added only where they improve interpretation.

### Adjustment rewrite or polish

- Use when the user provides existing adjustment text and wants it tightened, rewritten, or lightly polished.
- Keep the underlying treatment and logic unless the wording is unclear, unsupported, or structurally weak.

**Example prompts and responses:**

```markdown
User asks:
Please rewrite this adjustment:
"There were transaction costs in FY24 and these should be removed because they are one time."

Response:
**Transaction costs:** Represents legal, advisory, diligence, and other professional fees associated with the current transaction process. The adjustment excludes [$x.x million] from EBITDA in FY24.
```

```markdown
User asks:
Please polish this wording but keep the treatment the same:
"Transaction expenses: These relate to professional fees from the sale process and acquisitions which management views as non-recurring."

Response:
**Transaction expenses:** Represents professional fees associated with the sale process and past acquisition activity. The adjustment excludes [$x.x million] from EBITDA.
```

### Draft from rough notes

- Use when the user provides notes, talking points, or meeting commentary rather than finished prose.
- Convert the notes into complete adjustment writing using quantification, active voice, and a clear treatment rationale.

**Example prompts and responses:**

```markdown
User asks:
Draft this adjustment from notes:

- FY24 payroll accrual understated by 0.2m
- catch-up entry booked at year-end
- relates to final December pay cycle
- process fixed in FY25

Response:
**Payroll accrual normalization:** FY24 reported EBITDA understated payroll expense by [$0.2 million] because the final December pay cycle was recorded through a year-end catch-up entry rather than accrued in the service period. The adjustment reallocates the expense to FY24 so that adjusted EBITDA reflects the underlying payroll run-rate. Management corrected the close process in FY25, so the FY24 catch-up does not recur.
```

```markdown
User asks:
Please draft an adjustment from these notes:

- severance of 0.6m in Q3 FY24
- relates to closure of two branches
- 14 employees impacted
- costs will not continue in FY25

Response:
**Severance and restructuring:** Severance costs of [$0.6 million] in Q3 FY24 relate to the closure of two branches and the termination of 14 employees. The adjustment excludes these costs from EBITDA because they relate to a specific restructuring event and do not continue into FY25.
```

### Opening normalized earnings line

- Start with one line that states the reported earnings basis and the adjusted view the reader should focus on.
- Sample wording: `Reported EBITDA of [$24.8 million] for TTM Dec-24 adjusts to [$27.7 million] after net adjustments of [$2.9 million], primarily reflecting owner compensation normalization, non-recurring transaction costs, and supportable run-rate facility savings.`

### Basis of presentation

- Use a short note to explain the periods shown, the source set, and how the adjustments are grouped.
- Sample wording: `The quality-of-earnings bridge summarizes reported and adjusted EBITDA for FY22, FY23, FY24, and TTM Dec-24. Adjustments are grouped as management, diligence, and pro forma items based on the source schedules used in the analysis.`

### Adjustment category lead-ins

- Use when the bridge or narrative separates the adjustments into clear groups.
- Keep the grouping labels in the same plain language used in the schedule.
- Sample wording: `**Management adjustments:** Adjustments identified by Management and included in the normalized earnings bridge.`
- Sample wording: `**Diligence adjustments:** Incremental adjustments identified through diligence to reflect the underlying earnings of the business.`
- Sample wording: `**Pro forma adjustments:** Adjustments to reflect supportable run-rate changes linked to the expected go-forward cost base.`
- Sample wording: `**Sell-side adjustments:** Adjustments included in the seller's analysis and carried into the buy-side normalization where the support and recurrence basis align with the current earnings view.`

### Adjustment narratives

- This is the core of the section. Explain each adjustment in the same order it appears in the bridge, using the bridge label in bold followed by a concise narrative.
- Sample wording: `**Owner compensation normalization:** Reported payroll includes compensation levels above the expected go-forward management structure. The adjustment replaces those amounts with a normalized market-based cost, increasing adjusted EBITDA by [$x.x million].`
- Use a shorter form when the caption, treatment, and rationale are obvious from the schedule, such as simple non-recurring professional fees or a clearly labeled gain on disposal. In these cases, two to three sentences are often enough.
- Use a fuller form when the item needs more context, such as sell-side reversals, pro forma savings, standalone costs, deal-specific fact patterns, accounting-policy corrections, or adjustments that depend on notes rather than the schedule alone. In these cases, use enough detail to explain the fact pattern, treatment, support, and any key assumption or limitation.

#### Adjustment narrative library

Choose the closest narrative and adapt the structure and level of detail to the actual adjustment being discussed. Keep the underlying logic, but replace the placeholders and tailor the explanation to the facts of the company. The ordering below starts with the most commonly used adjustment types and then moves into more moderately used and more situational items.

- `**Non-recurring professional fees and transaction costs:** Represents legal, advisory, diligence, consulting, financing, or other deal-related costs associated with [the current transaction / past acquisitions / financing activity / contemplated sale]. The adjustment excludes [$x.x million] from adjusted EBITDA. [Invoice detail / GL coding / event support] shows the costs relate to transaction activity rather than the ongoing cost base shown in the historical periods.`
- `**Non-recurring items:** One-time costs or gains of [$x.x million], including [settlement costs / insurance proceeds / litigation costs / flood damage / theft / duplicate payment / other event-driven items], are excluded from adjusted EBITDA because they do not reflect the recurring earnings of the business.`
- `**Gain or loss on sale / non-operating income:** Gain or loss on disposal, dividend income, seized deposit income, miscellaneous other income, or other non-operating items of [$x.x million] are removed from adjusted EBITDA.`
- `**Owner compensation normalization:** Reported payroll includes compensation levels above the expected go-forward management structure. The adjustment replaces those amounts with a normalized market-based or agreed post-close cost, [increasing / decreasing] adjusted EBITDA by [$x.x million].`
- `**Executive compensation and board costs:** Compensation or fees of [$x.x million] relating to [chairman / directors / NEDs / executives / duplicate transition roles] are adjusted where the historical cost does not reflect the go-forward leadership structure. The adjustment may remove the historical cost entirely, replace it with a normalized level, or partially reverse it to reflect a replacement role.`
- `**Personal or owner-related expenses:** Personal travel, entertainment, vehicle, housing, legal, family payroll, charitable, or other owner-related costs of [$x.x million] are removed from adjusted EBITDA because they do not align with the normalized operating cost base of the business and are expected to cease post-close.`
- `**Management fee or related-party charge:** Management fees or related-party charges of [$x.x million] paid to [seller / parent / affiliate] are removed from adjusted EBITDA where the arrangement will not continue post-close.`
- `**Bonus normalization:** Bonus expense of [$x.x million] has been adjusted to align the reported accrual with the underlying period of employee service, payout terms, normal bonus policy, and related payroll taxes. This includes discretionary bonus add-backs, missed bonus accruals, bonus true-ups, and temporary bonus suspensions.`
- `**Payroll accrual normalization:** Payroll expense of [$x.x million] has been adjusted to reflect the payroll cycle and the period in which the related services were performed, rather than the period in which the payroll run or correcting accrual was recorded.`
- `**Severance and restructuring:** Severance, restructuring, termination, or branch-consolidation costs of [$x.x million] are removed from adjusted EBITDA because they relate to a specific workforce reduction or reorganization rather than the ongoing cost base. Where relevant, cross-reference any separate pro forma payroll savings adjustment to avoid double counting.`
- `**Headcount or role removal:** Compensation costs of [$x.x million] relating to [vacant positions / eliminated roles / departed employees not replaced / duplicate transition positions] are adjusted to reflect the go-forward staffing model, increasing adjusted EBITDA by [$x.x million] where the cost no longer recurs.`
- `**Run-rate compensation addition or replacement hire:** Compensation costs of [$x.x million] are added to reflect a supportable go-forward role, replacement hire, board structure, or management layer that was not fully reflected in the historical periods. Common examples include CFO, controller, IT, operational, and other management support roles required post-close.`
- `**Revenue cut-off normalization:** Revenue of [$x.x million] has been reallocated to the period in which the underlying goods or services were delivered. The adjustment corrects a timing distortion in reported earnings and [increases / decreases] adjusted EBITDA by [$x.x million].`
- `**Deferred revenue or revenue recognition adjustment:** Revenue of [$x.x million] has been adjusted to reflect the correct recognition pattern for [franchise fees / management fees / contract liabilities / upfront billings / loyalty obligations / customer programs]. This commonly arises where revenue was recognized upfront rather than over the service period, or where a deferred revenue balance should have been established and released over time.`
- `**Out-of-period expense or accrual normalization:** Expense or accrual balances of [$x.x million] have been aligned to the period in which the underlying obligation arose so that adjusted EBITDA reflects the proper period of activity rather than the timing of the journal entry.`
- `**Capitalization versus expensing:** Costs of [$x.x million] have been reclassified between operating expense and capitalized assets to align the analysis with the accounting treatment applied under the policy basis or with a consistent historical policy. Common examples include software development, salary capitalization, website builds, repair-and-maintenance capitalization, and other costs where the historical accounting treatment distorts EBITDA comparability.`
- `**Reserve or provision normalization:** Reported earnings have been adjusted for [bad debt / inventory / warranty / ECL / loyalty / employee benefits / other reserve] treatment of [$x.x million] to reflect the underlying expected cost based on historical trends, revised methodology, or identified under- or over-accruals.`
- `**Bad debt or ECL normalization:** Bad debt, ECL, or customer-specific receivable provisions of [$x.x million] are adjusted where the historical charge is unusual, subsequently recovered, or not representative of the normal credit experience of the business.`
- `**Government relief, subsidy, or temporary program impact:** Revenue or expense benefits of [$x.x million] relating to [COVID relief / payroll subsidies / tax relief / temporary fee reductions / emergency discounts] are adjusted where they are clearly one-time, temporary, or not expected to continue in the go-forward earnings profile.`
- `**Start-up, ramp-up, closure, or de novo losses:** Earnings are adjusted for [$x.x million] of losses or costs relating to [new locations / branch closures / facility ramp-up / business launches / project implementation] where the historical period reflects a temporary transition state rather than the expected steady-state earnings profile.`
- `**Week 53 or calendar anomaly:** Revenue or expense of [$x.x million] has been adjusted to remove the effect of an extra trading week, unusual month-end timing, or another calendar anomaly so that the period is comparable with the rest of the historical set.`
- `**Customer-, contract-, or concentration-specific adjustment:** Revenue, gross profit, or EBITDA of [$x.x million] relating to [customer / contract / program / incentive stream] has been adjusted where the item is unusually large, temporary, non-repeatable, or expected to change post-close. The commentary links the earnings impact to the underlying commercial fact pattern and then quantifies the normalization.`
- `**Acquisition annualization or perimeter contribution:** EBITDA of [$x.x million] has been added or removed to reflect [bolt-on acquisition earnings / omitted perimeter entities / pre-acquisition contribution / excluded business activity] so that the adjusted view aligns to the transaction perimeter and intended go-forward earnings base.`
- `**Shared cost allocation:** Allocated shared-service costs of [$x.x million] are adjusted where the historical allocation basis does not reflect the direct cost of operating the business independently or where a separate standalone-cost analysis will better represent the go-forward cost base.`
- `**Standalone or replacement-cost adjustment:** Reported shared-service, owner-supported, or under-recorded costs of [$x.x million] are replaced with a normalized standalone cost structure based on [replacement hires / third-party quotes / signed contracts / current operating model], [decreasing / increasing] adjusted EBITDA by [$x.x million].`
- `**Run-rate facility or rent adjustment:** Earnings are adjusted by [$x.x million] to reflect the run-rate impact of [facility consolidation / closure / relocation / sublease / lease change / rent step-up] as if the change had been in place throughout the period.`
- `**Lease accounting or occupancy normalization:** Reported EBITDA is adjusted by [$x.x million] to reflect the cash occupancy cost, lease burden, or other economic lease impact where historical reporting under [IFRS 16 / local GAAP / cash basis rent] does not present the underlying run-rate cost on a comparable basis.`
- `**Run-rate IT, outsourcing, or systems cost:** Historical periods reflected partial implementation, owner support, under-recorded IT costs, or a prior operating model. The adjustment records a normalized managed-services, outsourced, or internal support cost of [$x.x million], reducing adjusted EBITDA by [$x.x million].`
- `**Related-party pricing normalization:** Revenue or cost of [$x.x million] arising from related-party arrangements has been restated to market or arm's-length terms, with the resulting EBITDA impact of [$x.x million].`
- `**Foreign exchange or constant-currency adjustment:** Revenue and expense have been remeasured using a comparable exchange-rate basis to separate operating performance from FX volatility, changing adjusted EBITDA by [$x.x million].`
- `**Share-based compensation or shareholder insurance:** Share-based compensation, stock option expense, shareholder life insurance, or similar owner-focused charges of [$x.x million] are removed where they do not reflect the normalized operating earnings profile expected post-close.`
- `**Discontinued offering or revenue stream:** Revenue and associated costs of [$x.x million] relating to a discontinued product line, service offering, incentive program, or contract stream are removed where the activity has ceased or is not expected to continue in the go-forward perimeter.`
- `**Sell-side adjustment challenge:** A seller-proposed adjustment of [$x.x million] has been reversed or reduced where the underlying cost appears recurring, the assumption is not sufficiently supported, or the item remains part of the go-forward earnings profile.`

#### Deal-specific adjustments

Deal-specific adjustments arise from transaction facts or business circumstances that are not common across most deals, even though the writing structure is reusable. These are often among the most important adjustments in a live deal, but the factual setting, support, and earnings impact are highly specific to the transaction.

Use a deal-specific adjustment when the narrative depends on a unique combination of perimeter, contract, operating-model, customer, regulatory, or strategic facts that are unlikely to recur in the same form in another deal.

Structure deal-specific adjustments in this order:

1. Name the specific fact pattern or business event.
2. Explain why it affects historical or go-forward earnings.
3. State whether the item is included in the bridge, excluded from the bridge, or presented as a sensitivity only.
4. Quantify the impact and period where support allows.
5. State the support, assumption set, or limitation that governs the treatment.

Common deal-specific structures include:

- `**Transaction-perimeter adjustment:** This adjustment reflects the earnings contribution of [entity / business line / legal vehicle] that is within the proposed transaction perimeter but not included in reported results, or removes earnings of an activity that sits outside the perimeter. The commentary sets out the perimeter logic first, then quantifies the earnings contribution or removal, and then states any support limitations such as annual-only financial statements or partial-period data.`
- `**Customer-, contract-, or program-specific adjustment:** This adjustment reflects the earnings effect of a specific customer contract, loyalty program, override arrangement, rebate, incentive stream, or revenue-sharing structure that is unusually large, temporary, or expected to change post-close. The commentary starts with the underlying commercial arrangement, then explains the accounting or earnings consequence, and then sets out the proposed treatment.`
- `**Deal-model or separation adjustment:** This adjustment reflects a specific post-transaction operating model, such as a long-term partnership agreement, outsourced channel, TSAs, standalone bank or broker costs, or a renegotiated supplier / processor agreement. The commentary contrasts the historical model with the go-forward model and explains the basis for using a run-rate or sensitivity approach.`
- `**Calendar or event-specific adjustment:** This adjustment reflects a one-time timing distortion tied to a week-53 period, special trading window, short period, or other unusual calendar event. The commentary explains why the period is not comparable and how the normalization was quantified.`

### Supporting notes

- Add these only when they improve the reader's interpretation of the bridge.
- `Sell-side or prior-analysis note:` Use a short note when the analysis starts from seller-prepared work and the reader needs to know what was retained, changed, or challenged. Sample wording: `**Sell-side adjustments:** The seller-prepared bridge was used as the starting point for the analysis, with changes made where recurrence, support, or standalone assumptions did not appear supportable.`
- `Excluded or not-included items:` Use a short note when an earnings-relevant item should be flagged but not included in adjusted EBITDA. Sample wording: `**Warranty provision:** The potential impact of the warranty reserve remains outside the adjusted EBITDA bridge pending support for the underlying claims history and reserve methodology.`
- `Key sensitivities:` Use a short note when an assumption or pending item could still move adjusted earnings. Sample wording: `**Facility savings timing:** Adjusted EBITDA remains sensitive to the implementation timing of the facility consolidation, where a three-month delay would reduce the current run-rate benefit by approximately [$x].`

## Section-specific writing guidance

1. Use the earnings bridge as the structural anchor and keep the commentary aligned to the way the bridge is presented.
2. For narrower asks, return the rewritten, drafted, or polished adjustment wording directly rather than turning the response into a mini section.
3. State the basis of presentation and the categories of adjustment clearly before walking the adjustments themselves when the user asks for the full section.
4. Explain each adjustment through the underlying item, the treatment, the recurrence conclusion, and the effect on normalized earnings.
5. Where an adjustment type has a close analogue in the adjustment narrative library, follow that sentence pattern and adapt it to the company-specific facts rather than inventing a new structure.
6. Use supporting notes for sell-side changes, excluded items, or sensitivities only when they improve the section.

## Verification and review checks

**Verification questions:**

- Is the section clear on the reported earnings basis and the adjusted earnings view being presented?
- If the user asked for rewrite, draft, or polish only, does the response stay at that narrower adjustment-writing level?
- Does the section explain the basis of presentation and the categories of adjustment before walking the main adjustments?
- For each adjustment, does the commentary explain what it relates to, why it is included or excluded, and how it affects normalized earnings?
- Where recurrence is described, is the rationale for that conclusion visible in the narrative?
- If excluded items or sensitivities are flagged, are they clearly kept outside the bridge and described without unsupported certainty?
- Does the section provide enough detail for the reader to understand the quality-of-earnings bridge and its main conclusions without turning into a full support memo?

## Full examples

These examples show content flow, not required headings or exact bullet counts.

The examples below are generalized and anonymized. They are meant to show the writing pattern and level of detail the model should follow, not to reproduce any specific source company.

### Example 1: Rewrite existing adjustment wording

```markdown
Rewrite this adjustment:
The company incurred one-time legal and advisory fees in FY24 relating to the transaction, and the wording needs to explain that these costs sit outside normal operations.

**Transaction costs:** Represents legal, advisory, diligence, and other professional fees associated with the current transaction process. The adjustment excludes [$x.x million] from EBITDA. Invoice detail and GL coding show the costs relate to the transaction process.
```

### Example 2: Draft adjustment from rough notes

```markdown
Draft this adjustment from notes:

- FY24 payroll accrual understated by 0.2m
- catch-up entry booked at year-end
- relates to final December pay cycle
- process fixed in FY25

**Payroll accrual normalization:** FY24 reported EBITDA understated payroll expense by [$0.2 million] because the final December pay cycle was recorded through a year-end catch-up entry rather than accrued in the service period. The adjustment reallocates the expense to FY24 so that adjusted EBITDA reflects the underlying payroll run-rate. Management corrected the close process in FY25, so the FY24 catch-up does not recur.
```

### Example 3: Full quality-of-earnings section

```markdown
## Quality of earnings

- Reported EBITDA of [$24.8 million] for TTM Dec-24 adjusts to [$27.7 million] after net adjustments of [$2.9 million], primarily reflecting owner compensation normalization, removal of one-time transaction costs, and supportable run-rate facility savings.

Basis of presentation
The quality-of-earnings bridge summarizes reported and adjusted EBITDA for FY22, FY23, FY24, and TTM Dec-24.
Adjustments are grouped as follows:
**Management adjustments:** Adjustments identified by Management and included in the normalized earnings bridge.
**Diligence adjustments:** Incremental adjustments identified through diligence to reflect the underlying earnings of the business.
**Pro forma adjustments:** Adjustments to reflect supportable run-rate changes linked to the expected go-forward cost base.

Source note: Management adjustment schedules, trial balances, payroll detail, invoices, and executed contracts.

| Line item              |     FY22 |     FY23 |     FY24 | TTM Dec-24 |
| ---------------------- | -------: | -------: | -------: | ---------: |
| Reported EBITDA        |     18.6 |     22.4 |     24.1 |       24.8 |
| Management adjustments |      1.1 |      1.6 |      2.8 |        2.9 |
| Diligence adjustments  |    (0.8) |    (0.2) |    (0.5) |      (0.5) |
| Pro forma adjustments  |    (0.7) |    (0.4) |      0.3 |        0.5 |
| **Adjusted EBITDA**    | **18.2** | **23.4** | **26.7** |   **27.7** |

Quality-of-earnings adjustments

1. **Owner compensation normalization:** Reported payroll includes compensation levels above the expected go-forward management structure. The adjustment replaces those amounts with agreed post-close compensation levels, increasing adjusted EBITDA by [$1.2 million] in FY24 and TTM Dec-24. Payroll detail and the agreed management structure indicate the revised cost base is run-rate.
2. **Non-recurring transaction costs:** Legal, advisory, and diligence costs of [$1.6 million] in FY24 relate to the current transaction process. The adjustment excludes these costs from adjusted EBITDA, increasing EBITDA by [$1.6 million]. Invoice detail and GL coding show the costs relate to the transaction process.
3. **Audit fee reversal:** A management-proposed add-back for annual audit fees of [$0.7 million] has been reversed because the cost recurs as part of the normal reporting environment of the business. The adjustment decreases adjusted EBITDA by [$0.7 million]. Historical invoices and the ongoing annual audit requirement show the cost is recurring.
4. **Revenue cut-off normalization:** Revenue of [$0.3 million] was recorded in the wrong period in FY23. The adjustment reallocates the amount to the period in which the related services were delivered, improving comparability across periods without creating a new run-rate earnings benefit.
5. **Payroll accrual normalization:** Payroll expense of [$0.2 million] in FY24 has been adjusted to reflect the payroll cycle and the period in which services were performed rather than the timing of the correcting accrual. The close process was corrected in subsequent periods, so the FY24 catch-up does not recur.
6. **Run-rate facility savings:** Adjusted EBITDA includes a run-rate benefit of [$0.8 million] in FY24 and [$1.0 million] in TTM Dec-24 to reflect the impact of an executed facility consolidation as if it had been in place throughout the period. The support includes executed lease exits and implemented operating changes.
7. **Standalone IT cost:** Historical periods reflected partial support from group resources. The adjustment records a normalized managed-services cost of [$0.5 million] in FY24 and TTM Dec-24 based on the signed go-forward support contract, reducing adjusted EBITDA by the same amount.

**Warranty provision:** The potential impact of the warranty reserve remains outside the adjusted EBITDA bridge pending support for the underlying claims history and reserve methodology.

**Facility savings timing:** Adjusted EBITDA remains sensitive to the implementation timing of the facility consolidation, where a three-month delay would reduce the current run-rate benefit by approximately [$0.3 million].
```
