# Section contract: Reporting environment

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

The Reporting Environment section explains how the Company's financial information is prepared, controlled, and interpreted for diligence purposes. It should tell the reader what reporting basis is being relied upon, which entities or periods are audited versus management-prepared, how the close process and system architecture affect confidence, and where accounting policy, estimate, or mapping issues limit comparability across periods.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Start with what the numbers are:** Define the reporting framework, entity coverage, and assurance basis before discussing systems, policies, or limitations.
2. **Keep assurance mix explicit:** Distinguish audited, reviewed, compiled, and management-prepared information clearly and keep that distinction consistent throughout the section.
3. **Focus on what changes reliance and comparability:** Close cadence, year-end-only adjustments, manual journals, system mappings, and policy transitions belong here when they materially change how the numbers should be read.
4. **Keep policy discussion company-specific:** Do not include textbook accounting summaries unless they translate into a concrete reporting or diligence implication for the Company.
5. **Treat manual dependencies as evidence, not trivia:** Mention systems, interfaces, overrides, and recurring MJEs only to the extent they affect completeness, timing, classification, or trend interpretation.
6. **Add limitations only when they matter:** Use limitation language when YTD information is unaudited, coverage is incomplete, or reporting processes materially reduce confidence in the financial read.
7. **Keep the section on the reporting environment:** This section is not an audit report, a controls memo, or a general diligence disclaimer appendix.

## Analytical workflow

1. **Define the reporting perimeter:** Identify the entities, periods, frameworks, and reporting layers that support the diligence analysis.
2. **Map assurance coverage:** Determine which financial statements or management packs are audited, reviewed, compiled, or unaudited, and whether audit opinions, restatements, or ongoing audits affect reliance.
3. **Understand close discipline:** Determine how quickly the books close, who owns the process, and whether interim and year-end processes differ in ways that affect comparability.
4. **Map systems and manual dependencies:** Identify the primary finance systems, reporting stack, integrations, and the recurring manual steps that matter for reported numbers.
5. **Identify company-specific policy and estimate hotspots:** Pull out revenue, lease, provision, ECL, loyalty, warranty, or other policy areas only when they create a real reporting or comparability implication.
6. **Identify conversion, mapping, or scope issues:** Add framework bridges, chart-of-account changes, or reporting-basis limitations when they materially affect historical interpretation.
7. **Conclude with diligence implications:** State how the reporting environment should shape QoE, NWC, net debt, balance-sheet, or trend conclusions.

## Section architecture

Scale the section based on assurance complexity, reporting-layer fragmentation, system and manual dependency, and the presence of policy or conversion issues.

Target length:

- `concise`: 220-360 words for stable, audited, single-framework environments
- `standard`: 340-620 words for most situations
- `expanded`: 520-900 words when assurance coverage is mixed, policy transitions are active, or mapping and manual dependencies materially affect confidence

Required blocks:

- `Reporting basis and assurance perimeter`
  - Purpose: define the framework, entity coverage, assurance mix, and main reliance implication.
  - Typical density: 2-4 bullets or one small assurance exhibit plus 1-2 bullets.
- `Close process and reporting cadence`
  - Purpose: explain the timing, ownership, and discipline of the close process and where interim versus year-end differences matter.
  - Typical density: 2-4 bullets or one compact cadence exhibit plus 1-2 bullets.
- `Systems, data flow, and manual dependencies`
  - Purpose: describe the reporting stack and the recurring system or journal dependencies that affect reliability or comparability.
  - Typical density: 2-5 bullets or one compact systems exhibit plus 1-2 bullets.
- `Accounting policy and estimate watchlist`
  - Purpose: capture only the company-specific policy, estimate, or transition topics that can materially affect reported numbers.
  - Typical density: 2-5 numbered items or one compact watchlist exhibit plus short bullets.
- `Comparability implications for diligence analysis`
  - Purpose: state what the reporting environment means for how the financial analysis should be read.
  - Typical density: 2-4 bullets.

Optional blocks:

- `Framework conversion or presentation bridge`
  - Use when local GAAP, ASPE, TFRS for NPAEs, statutory reporting, or chart-of-account mapping must be bridged to the basis used in diligence.
  - Use when a framework transition or presentation change materially affects historical comparability.
- `Information-quality and scope limitations`
  - Use when key periods are unaudited, entity coverage is incomplete, YTD data is limited, or certain adjustments are only posted annually.
  - Use when the reader needs an explicit boundary on what the reporting environment evidence supports.
- `Finance-function ownership and resourcing`
  - Use when centralization, outsourcing, shared-service dependence, or lean team structure materially affects close execution or reporting resilience.
  - Use when the ownership structure changes how the rest of the section should be interpreted.

Ordering rules:

- Start with `Reporting basis and assurance perimeter`.
- Follow with `Close process and reporting cadence`.
- Follow with `Systems, data flow, and manual dependencies`.
- Follow with `Accounting policy and estimate watchlist`.
- Follow with `Comparability implications for diligence analysis`.
- Add optional blocks only when their trigger rules are met.
- When multiple optional blocks are needed, use this default order: `Framework conversion or presentation bridge` -> `Information-quality and scope limitations` -> `Finance-function ownership and resourcing`.

Inclusion rule:

- Do not add an optional block just because the source mentions it. Add it only when it changes how the reader should rely on or interpret the reported financial information.

Boundary rule:

- Do not create a generic `Data requests`, `Open items`, or broad diligence disclaimer block. Keep missing information inline and use `Information-quality and scope limitations` only when the constraint is materially decision-useful.

## Available analytical units

Use these as building blocks for bullets, short sentence clusters, or numbered watchlist items. Choose only the units the section needs.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each unit definition.

### `basis-and-assurance note`

- Purpose: state the framework, reporting layer, assurance status, and the main implication for reliance.
- Use when: opening the section or clarifying a mixed-assurance environment.
- Do not use when: repeating the same basis after the section has already established it clearly.
- Target length: 20-45 words.
- Source note: recommended when multiple reporting layers exist.
- Example: `The Group reports under IFRS, with audited consolidated financial statements through FY2024 and management-prepared monthly packs used for FY2025 YTD analysis.`

### `assurance-mix note`

- Purpose: distinguish how assurance differs by entity, period, or reporting layer.
- Use when: some entities are audited while others are compiled, statutory, or management-prepared.
- Do not use when: assurance coverage is uniform and can be stated once in the opening.
- Target length: 18-45 words.
- Source note: recommended.
- Example: `The regulated bank entities are audited annually, while two service subsidiaries are management-prepared only, requiring explicit caution when reading subsidiary-level trend detail.`

### `close-discipline note`

- Purpose: explain close timing, ownership, and any important differences between month-end, quarter-end, and year-end.
- Use when: close speed, estimate timing, or reviewer ownership affects confidence in interim or annual numbers.
- Do not use when: the sentence only says the books close monthly with no analytical implication.
- Target length: 20-55 words.
- Source note: recommended.
- Example: `Month-end close is completed within three business days, but ECL and loyalty estimate overlays are finalized at quarter-end, which means monthly reported earnings can include temporary timing noise.`

### `systems-and-flow note`

- Purpose: explain the reporting stack and the main system-to-system flow that supports financial reporting.
- Use when: the finance architecture materially affects how reported numbers are produced.
- Do not use when: the section devolves into a software inventory with no reporting implication.
- Target length: 20-55 words.
- Source note: recommended.
- Example: `Operational subledgers feed the Oracle general ledger directly, with Hyperion layered on top for management reporting and limited manual mapping at the consolidation stage.`

### `manual-dependency note`

- Purpose: explain a recurring manual journal, mapping, or year-end-only adjustment that affects reliability or comparability.
- Use when: recurring MJEs, suspense clearing, chart remaps, or annual-only entries materially affect reported balances.
- Do not use when: the manual step is immaterial or purely administrative.
- Target length: 20-55 words.
- Source note: recommended.
- Example: `Provision for credit losses is booked through quarterly manual journals approved by a committee, so interim balances should be read with awareness of the quarter-end overlay process.`

### `policy-watchlist unit`

- Purpose: state one company-specific policy or estimate topic, its current treatment, and the financial statement effect.
- Use when: revenue, leases, incentives, provisions, warranties, ECL, or similar topics create a meaningful reporting implication.
- Do not use when: the point is a generic standards summary with no company-specific treatment call.
- Target length: 25-75 words.
- Source note: recommended.
- Example: `Reward points liability: Management tracks outstanding points operationally but does not currently record a full contract-liability balance under the current local-GAAP basis. If the reporting basis migrates to TFRS for PAEs, liabilities and deferred revenue would likely increase.`

### `framework-conversion note`

- Purpose: explain a framework or presentation bridge needed to compare periods consistently.
- Use when: local GAAP is bridged to IFRS, ASPE is mapped to IFRS, or chart-of-account changes alter presentation.
- Do not use when: no meaningful bridge is needed.
- Target length: 20-55 words.
- Source note: recommended.
- Example: `FY2024 subsidiary results were mapped from ASPE statutory reporting to the Group's IFRS chart, which improved current-year presentation consistency but reduces direct comparability to FY2022 statutory category labels.`

### `ownership note`

- Purpose: explain the finance-function structure when it materially affects the reporting environment.
- Use when: the function is centralized, outsourced, lean, or dependent on a small number of key owners.
- Do not use when: ownership detail adds no interpretive value.
- Target length: 18-45 words.
- Source note: recommended.
- Example: `The finance function is centralized under the CFO with one controller-led close team, which supports consistency but concentrates reporting knowledge in a small group.`

### `comparability note`

- Purpose: state how the reporting environment should change the reader's analytical interpretation.
- Use when: annual-only adjustments, mixed assurance, mapping changes, or estimate concentration affect QoE, NWC, net debt, or trend analysis.
- Do not use when: the point is a generic caution with no specific analytical consequence.
- Target length: 18-55 words.
- Source note: recommended.
- Example: `Quarterly trend analysis should normalize ECL overlay updates and chart-of-account remaps before drawing conclusions on run-rate profitability.`

### `limitation note`

- Purpose: state a meaningful boundary on what the evidence supports.
- Use when: YTD information is unaudited, entity coverage is incomplete, or major true-ups occur only at year-end.
- Do not use when: the note is a generic disclaimer that adds no decision-useful context.
- Target length: 18-45 words.
- Source note: recommended.
- Example: `FY2025 YTD information for two operating entities is management-prepared only and excludes several year-end true-ups, so it should be used directionally rather than as a fully comparable basis.`

## Assembly patterns

Use one of these patterns based on the section's complexity. These are assembly guides, not mandatory templates.

### `Simple audited reporting environment`

- Recommended block order: `Reporting basis and assurance perimeter` -> `Close process and reporting cadence` -> `Systems, data flow, and manual dependencies` -> `Accounting policy and estimate watchlist` -> `Comparability implications for diligence analysis`
- Optional blocks typically activated: none; add `Finance-function ownership and resourcing` only if a concentrated team structure materially affects reliance
- Target density: 5-8 bullets total, optionally supported by one small assurance or systems exhibit
- Stop adding detail when: the reader understands the basis, the close discipline, the one or two policy hotspots, and how to read the numbers

### `Mixed-assurance / conversion environment`

- Recommended block order: `Reporting basis and assurance perimeter` -> `Framework conversion or presentation bridge` -> `Close process and reporting cadence` -> `Systems, data flow, and manual dependencies` -> `Accounting policy and estimate watchlist` -> `Comparability implications for diligence analysis` -> `Information-quality and scope limitations` when needed
- Optional blocks typically activated: `Framework conversion or presentation bridge` and `Information-quality and scope limitations`
- Target density: 7-11 bullets total, optionally supported by one assurance or bridge exhibit
- Stop adding detail when: the reader can distinguish the reporting bases, understand the conversion logic, and see what that means for trend interpretation

### `Manual-dependency / estimate-heavy environment`

- Recommended block order: `Reporting basis and assurance perimeter` -> `Close process and reporting cadence` -> `Systems, data flow, and manual dependencies` -> `Accounting policy and estimate watchlist` -> `Comparability implications for diligence analysis` -> `Finance-function ownership and resourcing` or `Information-quality and scope limitations` when needed
- Optional blocks typically activated: `Finance-function ownership and resourcing` and `Information-quality and scope limitations`; add `Framework conversion or presentation bridge` only if there is also a basis-mapping issue
- Target density: 8-12 bullets total, optionally supported by one systems or manual-dependency exhibit
- Stop adding detail when: the reader can identify where estimates and manual processes enter the numbers and how that should affect reliance on the analysis

## Section-specific writing guidance

1. Lead with the reporting basis and assurance status before discussing systems or accounting policy topics.
2. Keep audited, reviewed, compiled, and management-prepared information labeled consistently.
3. Describe close discipline in terms of timing, ownership, and implications, not generic process narration.
4. Mention systems only when they explain how reported numbers are produced or where manual intervention enters the process.
5. Keep the watchlist focused on company-specific policy or estimate topics that can materially affect reported balances, earnings, or comparability.
6. Use framework-conversion notes only when a real bridge or transition is needed for interpretation.
7. Use limitation language when it changes how confidently the reader should use interim or entity-level information.
8. Translate reporting-environment facts into explicit implications for QoE, NWC, net debt, balance-sheet, or trend analysis.
9. Avoid textbook standard summaries, generic diligence disclaimers, and open-ended "further work should be considered" phrasing.
10. Avoid turning the section into a controls audit, staffing memo, or raw data-room description.

## Verification and review checks

Use these checks before finalizing a Reporting Environment draft.

1. `Reporting basis and assurance perimeter`, `Close process and reporting cadence`, `Systems, data flow, and manual dependencies`, `Accounting policy and estimate watchlist`, and `Comparability implications for diligence analysis` all exist.
2. The section clearly states the framework or reporting basis relied upon.
3. Assurance status is explicit where the source uses audited, reviewed, compiled, or management-prepared information.
4. The close process discussion includes timing, ownership, or review discipline, not just the statement that the books close monthly.
5. The systems discussion explains at least one reporting-relevant flow or manual dependency rather than listing software names only.
6. Every watchlist item states the current treatment and the financial statement or comparability effect.
7. Optional blocks appear only when their trigger rules are met.
8. `Framework conversion or presentation bridge` appears only when there is a real basis or mapping issue.
9. `Information-quality and scope limitations` contains meaningful constraints, not generic disclaimers.
10. `Finance-function ownership and resourcing` appears only when team structure materially affects interpretation.
11. `Comparability implications for diligence analysis` contains explicit consequences for how the numbers should be used in diligence.
12. No extraction-artifact language appears, including `Not present in source report` or `extraction policy`.
13. No slot, layout, render-skeleton, or `deckSpec` language appears in the drafted section.
14. Missing information uses inline placeholders rather than open-item headings.
15. The final draft reflects the reporting-basis and comparability model shown in this reference.
16. Language and tone pass `references/global-writing-conventions.md`.
17. Split or tighten any bullet that becomes hard to scan or tries to do more than one analytical job.

## Full examples

### Example 1: Stable audited reporting environment

```markdown
## Reporting environment

### Reporting basis and assurance perimeter

- The Group reports under IFRS, with audited consolidated financial statements through FY2024 and management-prepared monthly reporting packs used for January to March 2025.
- Consolidated FY2022 to FY2024 financial statements received unqualified audit opinions, and no material restatements or basis changes were identified over the review period.
- The principal reliance implication for diligence is that annual figures are audit-backed, while interim 2025 reporting should be read together with the monthly estimate update process described below.

### Close process and reporting cadence

- Month-end close is typically completed within three business days, with quarter-end and year-end closes following the same core process plus additional review over key estimate areas.
- Trial-balance review, reconciliations, and variance analysis are owned by the Controller, while quarter-end estimate overlays are reviewed by the CFO and the relevant risk or accounting leads.
- Loyalty-liability and ECL assumptions are refreshed more formally at quarter-end than at month-end, which can create temporary timing concentration in interim results.

### Systems, data flow, and manual dependencies

- Operational subledgers feed the Oracle general ledger directly, with Hyperion layered on top for management reporting and board-pack aggregation.
- Payroll and HR data are maintained in Workday and interfaced into the general ledger through scheduled uploads, with limited manual classification journals for shared-service allocations.
- Manual journals are concentrated in estimate overlays, intercompany eliminations, and presentation reclasses rather than core transaction capture.

### Accounting policy and estimate watchlist

1. Expected credit losses: ECL is model-based and reviewed quarterly with governance overlays. Changes in macro assumptions can create quarter-specific provision volatility that should be normalized when assessing run-rate earnings.
2. Loyalty liability and deferred revenue: Deferred revenue is measured using redemption and breakage assumptions. Assumption recalibration can move both revenue timing and balance-sheet liabilities between periods.
3. Lease accounting: Leases are recognized under IFRS 16 on a consistent basis, but renewal-assumption updates can shift the reported lease liability and related EBITDA versus finance-cost presentation.

### Comparability implications for diligence analysis

- Annual results can be used as the primary anchor for trend analysis, with interim periods adjusted for the timing of quarter-end estimate overlays where material.
- QoE analysis should review any quarter-specific ECL or loyalty catch-up entries before concluding on run-rate profitability.
- Net debt and working-capital analyses should use the same deferred-revenue and lease-treatment logic applied in the reporting base to avoid classification drift.
```

### Example 2: Mixed-assurance and conversion-heavy reporting environment

```markdown
## Reporting environment

### Reporting basis and assurance perimeter

- The Company prepares consolidated management accounts monthly under IFRS, while statutory entity reporting is prepared under ASPE for most operating subsidiaries and local statutory bases for two smaller entities.
- Consolidated financial statements were audited by Deloitte for FY2022 and FY2023, with a qualified FY2022 opinion related to purchase price accounting adjustments and a prior-period restatement reflected in FY2023.
- FY2024 audit fieldwork is ongoing, and FY2025 YTD information is management-prepared only; accordingly, recent-period trend analysis should be treated as directionally useful rather than fully assurance-backed.

### Close process and reporting cadence

- The Company closes monthly, with standalone subsidiary submissions aggregated at head office and adjusted for intercompany eliminations and selected IFRS presentation entries.
- Management represented there is no significant difference between month-end and year-end close mechanics; however, selected accruals, contingent commissions, and policy true-ups are finalized more fully at fiscal year-end.
- The consolidation close is overseen by the Group Controller, with final review by the CFO.

### Systems, data flow, and manual dependencies

- Multiple accounting platforms are used across operating subsidiaries, and head-office consolidation relies on manual mapping into the Group reporting structure.
- Payroll and broker-management systems are not fully integrated with the accounting stack, resulting in recurring classification and cut-off journals during the monthly close.
- Historical chart-of-account and system changes have required supplementary tie-out support for earlier periods, reducing confidence in direct line-by-line historical comparability.

### Accounting policy and estimate watchlist

1. Contingent and bonus commissions: Management accrues these commissions using best estimates during the year and records a year-end true-up once carrier confirmations are available. Interim commission revenue therefore may not be directly comparable to audited year-end balances.
2. Revenue recognition timing: Base commission revenue is recognized at contract inception, while certain cancellation or policy-term outcomes are not fully reserved during the year. This can shift revenue recognition and reserve adequacy across periods.
3. Purchase price accounting adjustments: FY2022 acquisition accounting required qualification and subsequent restatement, so acquisition-period balances should be read using the updated FY2023 bridge rather than the original FY2022 presentation alone.

### Framework conversion or presentation bridge

- Subsidiary statutory results are mapped from ASPE or local statutory presentation into the Group's IFRS reporting packs, and certain balance-sheet presentation items require recurring bridge entries at consolidation.
- This improves current reporting consistency but reduces direct comparability to historical statutory category labels unless the same bridge logic is applied across all periods under review.

### Information-quality and scope limitations

- FY2025 YTD information is management-prepared only and excludes some year-end true-ups, including selected commission confirmations and certain presentation-normalization entries.
- Earlier historical periods affected by system and chart-of-account changes require bridge schedules to support line-item trend conclusions; without those bridges, historical movements should be interpreted cautiously.

### Comparability implications for diligence analysis

- QoE analysis should normalize year-end commission true-ups and acquisition-accounting bridge effects before concluding on underlying earnings trends.
- Working-capital and balance-sheet trend analysis should rely on the IFRS-mapped presentation consistently rather than mixing statutory and management category labels.
- Recent-period monthly results are useful for directional trend reading, but they should not be treated as fully comparable to audited years without adjustment for year-end-only entries and ongoing audit completion.
```
