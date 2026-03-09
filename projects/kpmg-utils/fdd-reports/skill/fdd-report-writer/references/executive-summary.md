# Section contract: Executive summary

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

The Executive Summary gives the reader the shortest decision-useful version of the diligence story. It should tell the reader what transaction or perimeter is being evaluated, what the headline financial or diligence conclusions currently are, and which remaining sensitivities, classification issues, or missing inputs could still move the view.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Start with the deal and perimeter:** Define what is being evaluated and what is in or out of scope before stating conclusions.
2. **Summarize conclusions, not process:** This section should synthesize the answer, not restate the diligence work performed.
3. **Keep every conclusion anchored:** Attach metrics to explicit periods, dates, units, and bases whenever the evidence supports it.
4. **Use workstream detail only when it helps the decision:** Summarize QoE, NWC, net debt, balance-sheet, or reporting-environment conclusions only to the extent they materially change the current deal view.
5. **State dependencies inline:** If a conclusion could move because of missing support, classification alignment, or a closing-date refresh, say so in the same bullet rather than creating a separate request list.
6. **Keep the tone diligence-focused:** Avoid recommendation language, investment-pitch phrasing, or management-presentation style superlatives.
7. **Keep the section short by default:** This is not a mini report. Use only the minimum content needed for a reader to understand the current position and the remaining sensitivities.

## Analytical workflow

1. **Define the transaction context:** Identify who is evaluating what type of transaction and whether the summary is for a share deal, asset deal, carve-out, or other perimeter.
2. **Define the perimeter and exclusions:** State the included entities, operations, or assets and any explicit exclusions that materially shape the conclusions.
3. **Identify the few conclusions that matter most:** Pull out the current earnings, working-capital, net debt, balance-sheet, reporting-basis, or other in-scope conclusions only if they are genuinely decision-relevant.
4. **Anchor the evidence base when needed:** Add reporting basis, audit status, or source-basis detail only when it materially changes how confident the reader should be in the conclusions.
5. **Surface what could still move the answer:** Identify closing-date refresh items, classification dependencies, scope questions, or standalone issues that remain live.
6. **Choose the right level of workstream detail:** Use a compact workstream takeaway set only when multiple in-scope streams each need explicit mention.
7. **Scale the summary to the situation:** Keep simple situations very short and expand only when complexity, perimeter issues, or unresolved dependencies require it.

## Section architecture

Scale the section based on transaction-perimeter complexity, the number of material in-scope workstreams, and the level of remaining uncertainty.

Target length:

- `concise`: 160-260 words for straightforward situations with a clear perimeter and 1-2 headline conclusions
- `standard`: 240-420 words for most situations
- `expanded`: 380-650 words when multiple workstreams, carve-out issues, or live dependencies materially affect the current view

Required blocks:

- `Transaction context and perimeter`
  - Purpose: identify the transaction, define what is included, and state any boundary that materially shapes the summary.
  - Typical density: 2-4 bullets.
- `Headline conclusions`
  - Purpose: state the few current conclusions that most affect how the deal should be understood.
  - Typical density: 2-5 bullets.
- `Key sensitivities and remaining dependencies`
  - Purpose: state what could still move the current view and why it matters.
  - Typical density: 2-4 bullets.

Optional blocks:

- `Reporting basis and evidence perimeter`
  - Use when audit status, management-only information, mixed frameworks, or source-basis limitations materially affect confidence in the conclusions.
  - Use when the summary would otherwise overstate the level of certainty.
- `Workstream takeaway set`
  - Use when multiple in-scope workstreams each need a compact one-line takeaway.
  - Use when one combined `Headline conclusions` block would become too compressed or hard to scan.
- `Scope exclusions and transaction mechanics`
  - Use when cash-free debt-free mechanics, excluded assets, excluded divisions, intercompany treatment, or carve-out perimeter issues materially affect how the summary should be read.
  - Use when closing mechanics or perimeter exclusions are central to the current conclusion.

Ordering rules:

- Start with `Transaction context and perimeter`.
- Follow with `Headline conclusions`.
- Follow with `Key sensitivities and remaining dependencies`.
- Add optional blocks only when their trigger rules are met.
- When multiple optional blocks are needed, use this default order: `Reporting basis and evidence perimeter` -> `Workstream takeaway set` -> `Scope exclusions and transaction mechanics`.

Inclusion rule:

- Do not add an optional block just because the source mentions it. Add it only when it changes how the reader should interpret the current deal view.

Boundary rule:

- Do not create a mandatory risk table, source-information list, or recommendation block. Keep missing information inline and use optional blocks only when they materially improve the summary.

## Available analytical units

Use these as building blocks for bullets or short sentence clusters. Choose only the units the section needs.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each unit definition.

### `transaction-context note`

- Purpose: identify who is evaluating what transaction and what level of business is in scope.
- Use when: opening the section.
- Do not use when: repeating transaction context already established in the same summary.
- Target length: 15-40 words.
- Source note: usually not needed unless the transaction structure is unusual.
- Example: `MapleBridge Capital is evaluating a majority investment in NorthBridge Payments Group.`

### `perimeter note`

- Purpose: define the included perimeter and any material exclusions.
- Use when: share deal, asset deal, carve-out, or excluded divisions materially affect the summary.
- Do not use when: the transaction perimeter clearly matches the whole business and no exclusion matters.
- Target length: 18-45 words.
- Source note: recommended when exclusions or structured entities are involved.
- Example: `The transaction perimeter includes the core operating subsidiaries and excludes a disposed JV and a separately owned real estate entity.`

### `basis note`

- Purpose: state the reporting basis or evidence base only when it materially affects confidence in the summary.
- Use when: conclusions rely on management-prepared, unaudited, mixed-framework, or bridged information.
- Do not use when: basis detail adds no real interpretive value.
- Target length: 18-45 words.
- Source note: recommended.
- Example: `Historical conclusions are based on audited FY2022-FY2024 financial statements supplemented by management trial balances and supporting schedules for the latest period.`

### `headline-conclusion unit`

- Purpose: state one decision-relevant conclusion tied to a metric, period, and implication.
- Use when: summarizing the current earnings, working-capital, net debt, or other core diligence view.
- Do not use when: the sentence only restates a detailed workstream output with no summary implication.
- Target length: 22-60 words.
- Source note: recommended when the basis or measure is not obvious.
- Example: `FY2024 reported EBITDA of $[x] adjusts to $[y] after identified normalization items, supporting a current run-rate earnings view of approximately $[y] subject to [named dependency].`

### `workstream takeaway unit`

- Purpose: state one compact takeaway for an in-scope workstream.
- Use when: a multi-workstream summary needs concise one-by-one coverage.
- Do not use when: the summary only needs one combined conclusion block.
- Target length: 18-45 words.
- Source note: recommended when the takeaway depends on a particular period or basis.
- Example: `Net working capital: Normalized NWC as at [Date] was $[x], compared with a target of $[y], indicating a current $[surplus/deficit] on the present basis.`

### `dependency note`

- Purpose: state a remaining input, classification issue, or refresh item that could still move the current view.
- Use when: missing support, closing-date refresh, or cross-workstream alignment matters.
- Do not use when: the issue is immaterial or already resolved.
- Target length: 18-50 words.
- Source note: recommended.
- Example: `Current conclusions remain sensitive to final classification alignment across QoE, NWC, and net debt, which should be refreshed before SPA schedule lock.`

### `closing-mechanics note`

- Purpose: explain a deal-mechanics item that shapes how the summary should be read.
- Use when: cash-free debt-free, completion-account, locked-box, or intercompany-settlement mechanics materially affect the headline.
- Do not use when: the issue belongs purely in a workstream detail section.
- Target length: 18-50 words.
- Source note: recommended.
- Example: `The summary assumes cash-free debt-free mechanics, with debt-like treatment expected to include transaction bonuses and unpaid rent liabilities at closing.`

### `watchout note`

- Purpose: identify the most important remaining sensitivity and why it matters.
- Use when: the current view could still move meaningfully.
- Do not use when: the point is generic caution with no analytical consequence.
- Target length: 18-50 words.
- Source note: recommended.
- Example: `Standalone support-function requirements remain a key watchout because they could increase the post-close cost base relative to the historical reported perimeter.`

### `exclusion note`

- Purpose: explain a specific excluded item, business line, or accounting treatment that affects the summary.
- Use when: out-of-scope items could otherwise be mistaken as included in the headline conclusions.
- Do not use when: the exclusion is already fully covered in a broader perimeter note.
- Target length: 15-40 words.
- Source note: recommended.
- Example: `Reported combined results are presented on a gross basis and do not eliminate intercompany funding balances between the in-scope and excluded entities.`

## Assembly patterns

Use one of these patterns based on the situation. These are assembly guides, not mandatory templates.

### `Simple perimeter and conclusion summary`

- Recommended block order: `Transaction context and perimeter` -> `Headline conclusions` -> `Key sensitivities and remaining dependencies`
- Optional blocks typically activated: none; add `Reporting basis and evidence perimeter` only if confidence in the numbers needs qualification
- Target density: 4-7 bullets total
- Stop adding detail when: the reader understands the transaction, the current conclusion, and the one or two items that could still move it

### `Standard multi-workstream executive summary`

- Recommended block order: `Transaction context and perimeter` -> `Reporting basis and evidence perimeter` when needed -> `Headline conclusions` -> `Workstream takeaway set` -> `Key sensitivities and remaining dependencies`
- Optional blocks typically activated: `Workstream takeaway set`, sometimes `Reporting basis and evidence perimeter`
- Target density: 6-10 bullets total
- Stop adding detail when: each material in-scope workstream has a clear one-line takeaway and the remaining dependencies are explicit

### `Carve-out / mechanics-heavy executive summary`

- Recommended block order: `Transaction context and perimeter` -> `Scope exclusions and transaction mechanics` -> `Headline conclusions` -> `Key sensitivities and remaining dependencies` -> `Reporting basis and evidence perimeter` when needed
- Optional blocks typically activated: `Scope exclusions and transaction mechanics`, often `Reporting basis and evidence perimeter`
- Target density: 6-10 bullets total
- Stop adding detail when: the reader can distinguish what is being acquired, what is excluded, how the mechanics shape the current view, and what still needs to be resolved

## Section-specific writing guidance

1. Lead with the transaction and perimeter before summarizing the financial conclusions.
2. Keep the section decision-oriented: what the current answer is, what it implies, and what could still move it.
3. Anchor every quantitative conclusion to a period, date, and unit when supported.
4. Use workstream labels only when they improve clarity; do not force every summary into a fixed table.
5. State out-of-scope workstreams or excluded businesses explicitly when their omission matters to interpretation.
6. Surface reporting-basis or assurance limitations only when they materially affect confidence in the headline conclusions.
7. Keep dependencies and sensitivities concise and specific; say what is missing or unresolved and why it matters.
8. Avoid investment recommendation language, upside framing, or management-presentation enthusiasm.
9. Avoid duplicating the full mechanics of underlying sections; keep the summary at the level of current deal implications.
10. Avoid long source lists, process narration, and generic risk-register language.

## Verification and review checks

Use these checks before finalizing an Executive Summary draft.

1. `Transaction context and perimeter`, `Headline conclusions`, and `Key sensitivities and remaining dependencies` all exist.
2. The summary states what transaction or perimeter is being evaluated.
3. Included and excluded perimeter is clear when exclusions materially matter.
4. Headline conclusions are tied to explicit periods, dates, or units when the evidence supports it.
5. The summary contains conclusions, not just a list of sources or process steps.
6. Optional blocks appear only when their trigger rules are met.
7. `Reporting basis and evidence perimeter` appears only when source basis materially affects confidence.
8. `Workstream takeaway set` is concise and limited to in-scope workstreams that actually need explicit mention.
9. `Scope exclusions and transaction mechanics` appears only when exclusions, intercompany treatment, or deal mechanics materially affect interpretation.
10. Dependencies are stated inline and linked to why they matter.
11. Out-of-scope matters are labeled explicitly rather than implied away.
12. No recommendation, investment-pitch, or promotional language appears.
13. No extraction-artifact language appears, including `Not present in source report` or `extraction policy`.
14. No slot, layout, render-skeleton, or `deckSpec` language appears in the drafted section.
15. Missing information uses inline placeholders rather than open-item headings.
16. The final draft reflects the decision-oriented summary model shown in this reference.
17. Language and tone pass `references/global-writing-conventions.md`.
18. Split or tighten any bullet that becomes hard to scan or tries to do more than one analytical job.

## Full examples

### Example 1: Standard multi-workstream executive summary

```markdown
## Executive summary

### Transaction context and perimeter

- MapleBridge Capital is evaluating a majority investment in NorthBridge Payments Group.
- The transaction perimeter includes the core operating subsidiaries and excludes one disposed JV completed in Q2 FY2023.
- Periods reviewed are FY2022 to FY2024 and TTM December 2024, with balance-sheet conclusions anchored as at December 31, 2024.

### Reporting basis and evidence perimeter

- Historical conclusions are based on audited FY2022-FY2024 financial statements supplemented by management trial balances and supporting schedules for the latest period.
- Figures are presented in $m unless noted otherwise.

### Headline conclusions

- FY2024 reported EBITDA of $24.1 adjusts to $26.7 after identified normalization items, supporting a current run-rate earnings view of approximately $26.7.
- Normalized net working capital as at December 31, 2024 was $13.2 versus a target basis of $12.5, indicating a current $0.7 surplus on the present completion-account basis.
- Adjusted net debt as at December 31, 2024 was $521.3 after debt-like reclassifications and identified closing obligations.

### Workstream takeaway set

- QoE: Current earnings remain most sensitive to estimate-driven true-ups in loyalty and credit-loss balances.
- Net working capital: The current surplus conclusion depends on consistent treatment of deferred revenue and related accruals.
- Net debt and debt-like items: Closing debt-like treatment should continue to include tax, transaction, and capex-related obligations on the current basis.
- Reporting environment: The annual base is audit-backed, but interim estimate overlays should be normalized before drawing run-rate conclusions.

### Key sensitivities and remaining dependencies

- Current conclusions remain sensitive to classification alignment across QoE, NWC, and net debt, which should be refreshed before SPA schedule lock.
- Closing-date balances for estimate-driven liabilities may move the current view and should be updated when the final support package is received.
- Intercompany unwind sequencing remains relevant to the final funds flow, although it does not currently change the headline perimeter conclusion.
```

### Example 2: Carve-out and mechanics-heavy executive summary

```markdown
## Executive summary

### Transaction context and perimeter

- Client is evaluating an asset acquisition of the Company's IDD operations.
- The perimeter excludes real estate, ABA services, content, employment, and executive departments, and the headline conclusions below should be read on that carve-out basis.
- The transaction is expected to be structured on a cash-free and debt-free basis.

### Scope exclusions and transaction mechanics

- Reported historical results include costs and balances that relate partly to excluded divisions and therefore require explicit perimeter adjustment before they can be read as the acquired business on a standalone basis.
- Intercompany and owner-related balances that supported excluded or centralized functions are not assumed to transfer unless specifically identified in the carve-out perimeter.

### Headline conclusions

- For FY2019, the business generated $9.3 million of revenue and reported EBITDA of $1.4 million on the currently provided carve-out basis.
- The current summary indicates that the perimeter can be defined, but the earnings view remains dependent on confirming the treatment of excluded corporate and executive costs.
- The unaudited nature of the financial statements and the carve-out perimeter mean the present conclusion should be used as an indicative diligence view rather than a final standalone answer.

### Key sensitivities and remaining dependencies

- Standalone cost requirements remain the main open dependency because historical reporting includes support structures that will not transfer directly with the asset deal.
- Final purchase-price mechanics depend on confirming which working-capital and debt-like balances, if any, are attached to the acquired perimeter at closing.
- Current conclusions should be refreshed once the final carve-out support and any standalone cost build are available.
```
