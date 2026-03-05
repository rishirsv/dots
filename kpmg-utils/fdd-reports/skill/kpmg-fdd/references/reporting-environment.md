# Section contract: Reporting environment (accounting policy)

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

Present a clear view of the accounting and reporting environment that supports, or limits, comparability of financial information used in diligence.

The section must read as client-ready diligence writing: factual, specific, and explicit about reporting framework, audit coverage, close discipline, policy judgment areas, and implications for analysis.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with a quantified or period-anchored headline that states reporting framework, assurance status, and the most relevant accounting-policy implication.
2. Define the reporting perimeter before commentary by listing entities, framework basis, and audit status.
3. Distinguish audited, reviewed, and management-prepared information clearly, and keep that distinction consistent across the section.
4. Describe close process cadence and control ownership using specific time anchors (for example, month-end close days and quarter-end review cycle).
5. Describe financial systems and reporting architecture with explicit note of manual interfaces or journal dependencies that can affect reliability.
6. Present accounting policy and estimate topics in a watchlist format, and state the potential financial statement effect for each topic.
7. Keep standards discussion company-specific; avoid generic textbook explanations that do not translate into diligence implications.
8. Explain any accounting policy, reporting-period, or presentation changes over the analysis horizon and their comparability effect.
9. Keep unresolved policy judgments inside `Comparability implications for diligence analysis`; do not create separate missing-information headings (for example, `Data requests`).
10. Keep bullets complete, active, and client-ready.

## Layout

Scale the depth of this section based on entity complexity, framework heterogeneity, and concentration of judgment-heavy policies.

Target length:
- 340-920 words (including tables and implications)

Required blocks:
- `Headline position`
- `Accounting framework and assurance status`
- `Close process and reporting cadence`
- `Financial systems and reporting architecture`
- `Accounting policy and estimate watchlist`
- `Comparability implications for diligence analysis`

Scaling rules:
- Keep concise when reporting framework is uniform, audit opinions are clean, and close/system architecture is stable.
- Expand `Accounting framework and assurance status` when entities use mixed frameworks or have audit qualification, restatement, or conversion events.
- Expand `Close process and reporting cadence` when month-end and year-end procedures materially differ or depend on manual adjustments.
- Expand `Financial systems and reporting architecture` when multiple source systems, low integration, or high manual journal activity could affect reporting consistency.
- Expand `Accounting policy and estimate watchlist` when policy transitions (for example, revenue, lease, or provision treatment) can move QoE, working capital, or net debt interpretation.
- Expand `Comparability implications for diligence analysis` when policy/application differences change period-on-period comparability.

Block slot map:
- `Headline position`: 1 `textArray` (1-3 bullets)
- `Accounting framework and assurance status`: 1 `table` + 1 `textArray` (2-5 bullets)
- `Close process and reporting cadence`: 1 `table` + 1 `textArray` (2-5 bullets)
- `Financial systems and reporting architecture`: 1 `table` + 1 `textArray` (2-5 bullets)
- `Accounting policy and estimate watchlist`: 1 `table` + 1 `textArray` (3-7 bullets)
- `Comparability implications for diligence analysis`: 1 `textArray` (2-6 bullets)

## Available slot shapes

### `text`
- Plain string.
- Use for source notes and short labels.

### `textArray`
- Array of bullets or short numbered statements.
- Use for all narrative blocks.

### `table`
- Object with `headers` and `rows`.
- Use for assurance, close-process, systems, and policy-watchlist exhibits.

### `bodyStyle`
- `"bullets"` or `"paragraphs"` only.
- Default to `"bullets"` for this section.

## Render skeleton

```markdown
## Reporting environment (accounting policy)

### Headline position
- The Group reports under [Framework] for [Period], with [audit status/opinion summary] across [in-scope entities].
- Period-end close is completed in approximately [x] business days at month-end and [x] business days at quarter-end, with primary control ownership by [owner].
- The most relevant accounting-policy consideration for diligence is [topic], which may affect [P&L / working capital / net debt / comparability] by approximately [x] or [direction].

### Accounting framework and assurance status
Source note: [source_note required]

| Entity | Reporting framework | Assurance status | Most recent opinion/status | Comparability note |
|---|---|---|---|---|
| [Entity] | [IFRS / US GAAP / local GAAP / other] | [Audited / Reviewed / Management-prepared] | [Unqualified / Qualified / In progress / N/A] | [impact on comparability or interpretation] |
| [Entity] | [Framework] | [Status] | [Opinion/status] | [note] |
| [Entity] | [Framework] | [Status] | [Opinion/status] | [note] |

- The reporting perimeter includes [entities] and excludes [entities], with exclusions treated as [out of scope / separate analysis].
- [If applicable] The Group changed [auditor / framework / presentation basis] in [Period], and this change affects comparability by [specific effect].
- [If applicable] No significant accounting policy changes were identified over [Period], other than [explicit exception].

### Close process and reporting cadence
Source note: [source_note optional]

| Close-process component | Frequency | Typical close timeline | Primary owner |
|---|---|---|---|
| Trial balance lock and reconciliations | [Monthly / Quarterly / Annual] | [x] business days post period-end | [Role] |
| Key estimate updates (for example, [ECL / deferred revenue / provisions]) | [Monthly / Quarterly] | [x] business days post period-end | [Role / committee] |
| Management review and financial sign-off | [Monthly / Quarterly] | [x] business days post period-end | [Role] |

- The close process is [consistent / variable] between month-end and year-end, with [specific step] representing the main timing difference.
- Manual journals are used for [accruals / policy true-ups / estimate updates], and review is performed by [role].
- [If applicable] Year-end-only adjustments for [topic] reduce interim-period comparability and should be considered in trend analysis.

### Financial systems and reporting architecture
Source note: [source_note optional]

| Process area | Primary system | Integration approach | Known manual intervention |
|---|---|---|---|
| General ledger and consolidation | [System] | [direct interface / staged upload] | [manual mapping or journal step] |
| Revenue and billing | [System] | [integration approach] | [manual override / periodic true-up] |
| Payroll and HR | [System] | [integration approach] | [manual reclassification or accrual step] |
| Management reporting | [System] | [integration approach] | [manual aggregation / presentation adjustment] |

- Financial reporting relies on [single / multiple] systems across entities, with [high / moderate / low] integration.
- The most relevant architecture risk is [specific system or interface issue], which can affect [classification / timing / completeness] in period-end reporting.
- [If applicable] Historical system conversion in [Period] requires careful tie-out interpretation for trend comparability.

### Accounting policy and estimate watchlist
Source note: [source_note required]

| Topic | Current treatment | Potential transition or policy risk | Potential financial statement effect |
|---|---|---|---|
| Revenue recognition ([standard/topic]) | [current practice] | [transition or judgment area] | [P&L timing / deferred revenue / contract asset impact] |
| Leases ([standard/topic]) | [current practice] | [transition or judgment area] | [ROU and lease liability / EBITDA and finance-cost presentation impact] |
| Provisions and credit losses ([standard/topic]) | [current practice] | [transition or judgment area] | [expense volatility / liability adequacy / period comparability impact] |
| Customer incentives / loyalty / warranty ([standard/topic]) | [current practice] | [transition or judgment area] | [revenue deferral / liability recognition / margin profile impact] |

- [Topic] currently uses [method], and sensitivity to [assumption] can move reported [metric] by approximately [x] or [direction].
- [Topic] includes management judgment over [specific input], with greater year-end true-up activity than interim periods.
- Where policy transition is expected in [Period], this section should distinguish historical presentation from expected go-forward presentation.

### Comparability implications for diligence analysis
- The reporting environment indicates that [specific policy/system feature] is likely to affect period-on-period comparability in [P&L / working capital / net debt] analysis.
- [Specific estimate or policy item] should be treated consistently across periods when assessing normalized performance.
- [If applicable] Mixed framework or assurance coverage across entities requires explicit bridge or mapping adjustments before consolidated trend conclusions are finalized.
```

## Common mistakes (and fixes)

1. Mistake: describing accounting standards generically with no company-specific impact.
- Fix: state how the policy applies to this company and what it means for reported figures.

2. Mistake: mixing audited and management-prepared data without labeling.
- Fix: label assurance status by entity and keep that distinction explicit in narrative.

3. Mistake: omitting close-process timing and ownership details.
- Fix: include close cadence with timeline and control owner in a compact table.

4. Mistake: listing systems without explaining interface or manual dependency.
- Fix: include integration approach and known manual intervention for each key process area.

5. Mistake: discussing policy changes without stating comparability effect.
- Fix: state the period of change and the directional impact on interpretation.

6. Mistake: adding separate missing-information sections (for example, `Data requests`).
- Fix: keep unresolved points inside `Comparability implications for diligence analysis`.

7. Mistake: adding a comments column to tables.
- Fix: keep tables structured and place explanatory detail in narrative bullets.

## Structural preflight rules (must pass)

1. All six required blocks exist and are in this exact order.
2. `Headline position` includes explicit period and framework anchors.
3. `Accounting framework and assurance status` includes entity, framework, assurance status, opinion/status, and comparability note.
4. `Close process and reporting cadence` includes frequency, timeline, and owner.
5. `Financial systems and reporting architecture` includes systems, integration approach, and manual intervention.
6. `Accounting policy and estimate watchlist` includes at least three policy topics and a stated financial statement effect for each.
7. `Comparability implications for diligence analysis` includes at least two explicit implications tied to diligence interpretation.
8. No missing-information headings (for example, `Data requests`) appear.
9. Missing information is handled with inline placeholders, not unsupported claims.
10. Render skeleton and full example are materially different (template vs worked output).
11. Language and tone pass global conventions.

## Split policy rules

1. Split `Accounting policy and estimate watchlist` into core and supplemental exhibits when topics exceed eight lines.
2. Split any bullet longer than 105 words into two tighter bullets.
3. Split `Financial systems and reporting architecture` by entity or geography when system stacks differ materially.
4. Split `Comparability implications for diligence analysis` into P&L and balance-sheet implications when items exceed five bullets.

## Full example

```markdown
## Reporting environment (accounting policy)

### Headline position
- NorthBridge Payments Group reports under IFRS for FY2022 to FY2024, with unqualified consolidated audit opinions for each year.
- Month-end close is completed in approximately four business days and quarter-end close in six business days, with sign-off by the CFO and Corporate Controller.
- The most relevant accounting-policy consideration for diligence is loyalty-liability and ECL estimate calibration, which can affect period comparability in EBITDA and working capital interpretation.

### Accounting framework and assurance status
Source note: FY2022-FY2024 audited financial statements, management reporting policy memo, and entity-level assurance summaries.

| Entity | Reporting framework | Assurance status | Most recent opinion/status | Comparability note |
|---|---|---|---|---|
| NorthBridge Payments Group (consolidated) | IFRS | Audited | Unqualified (FY2024) | Consolidated base used for group trend analysis. |
| NorthBridge Card Services Ltd. | IFRS | Audited | Unqualified (FY2024) | Largest entity in group revenue and EBITDA mix. |
| NorthBridge Insurance Solutions Ltd. | ASPE local statutory with IFRS mapping | Management-prepared statutory pack plus group audit reliance | No standalone statutory audit | Requires mapping to IFRS group chart for comparability. |

- The reporting perimeter includes all operating entities consolidated into the IFRS group package and excludes the exited JV sold in Q2 FY2023.
- NorthBridge Insurance Solutions moved to an updated IFRS mapping framework in FY2024, improving presentation consistency but reducing direct comparability to FY2022 mapping categories.
- No material accounting policy change was adopted in FY2024, other than calibration updates to estimate-based policy areas.

### Close process and reporting cadence
Source note: Month-end and quarter-end close calendars, controller checklists, and governance committee minutes.

| Close-process component | Frequency | Typical close timeline | Primary owner |
|---|---|---|---|
| Trial balance lock, reconciliations, and variance review | Monthly | 4 business days post month-end | Corporate Controller |
| ECL and loyalty-liability estimate update | Quarterly (with monthly monitoring) | 5 business days post quarter-end | CFO, CRO, and Credit Risk Lead |
| Financial statement review and sign-off | Monthly and quarterly | 6 business days post period-end | CFO |

- The close process is consistent between month-end and quarter-end, with additional governance review over ECL and loyalty liabilities at quarter-end.
- Manual journals are primarily used for estimate true-ups, policy reclassifications, and intercompany eliminations, with second-level review by the Corporate Controller.
- Year-end includes purchase price allocation and tax provision finalization steps that are not fully reflected in interim close cycles.

### Financial systems and reporting architecture
Source note: Systems architecture deck, IT-finance interface mapping, and close-process walkthroughs with finance leadership.

| Process area | Primary system | Integration approach | Known manual intervention |
|---|---|---|---|
| General ledger and consolidation | Oracle GL + Group consolidation module | Direct legal-entity upload to consolidation layer | Manual mapping journal for ASPE-to-IFRS reporting from one subsidiary. |
| Revenue and billing | Core card-processing platform | Daily automated subledger feed to GL | Monthly manual true-up for contingent incentive accruals. |
| Payroll and HR | Workday | Scheduled interface to GL | Manual payroll classification journal for shared-service allocations. |
| Management reporting | Hyperion reporting pack | GL extract and reporting cube load | Manual management-view reclassification for board reporting pack. |

- The architecture uses multiple systems with moderate integration and recurring manual overlays in estimate and presentation areas.
- The most relevant systems risk is manual reclassification and estimate true-up dependency at month-end, which can affect timing comparability across periods.
- A system upgrade in Q3 FY2023 changed some chart-of-account mappings and requires consistent bridge logic in FY2022-to-FY2024 trend comparisons.

### Accounting policy and estimate watchlist
Source note: Accounting policy manual, quarterly accounting committee packs, and detailed estimate working papers.

| Topic | Current treatment | Potential transition or policy risk | Potential financial statement effect |
|---|---|---|---|
| Revenue recognition (IFRS 15 variable consideration and incentives) | Incentive amounts are estimated monthly and trued up quarterly. | Estimation variance is concentrated in high-volume campaign periods. | Revenue timing and contract-liability balance can move between quarters. |
| Leases (IFRS 16) | ROU assets and lease liabilities are recognized on commencement, with straight-line depreciation and finance-cost recognition. | Renewal and extension assumptions affect liability measurement. | EBITDA and finance-cost presentation may shift through lease-term reassessment updates. |
| Credit loss provisions (IFRS 9 ECL) | ECL is model-based with quarterly governance overlay approvals. | Overlay assumptions may change with macro outlook revisions. | Provision expense volatility can affect EBITDA comparability and net asset interpretation. |
| Loyalty and customer incentive liabilities | Deferred revenue and liability recognition use expected redemption and breakage assumptions. | Breakage-rate recalibration can create catch-up effects in a single period. | Revenue deferral and liability measurement changes may affect margin trends and working capital. |

- Loyalty and ECL estimate topics are the largest comparability sensitivities because assumption updates can create period concentration effects.
- Revenue-incentive true-ups are generally resolved within quarter-end cycles, but monthly reported trends can still include timing noise.
- Lease accounting is mechanically consistent across periods, but renewal-assumption updates should be tracked when comparing run-rate EBITDA.

### Comparability implications for diligence analysis
- QoE analysis should normalize quarter-specific estimate catch-up entries for loyalty and ECL where they do not reflect underlying run-rate economics.
- Working capital analysis should align deferred-revenue and incentive-liability treatment consistently with IFRS 15 assumptions used in each period.
- Net debt interpretation should assess lease liabilities on the transaction definition basis to avoid classification drift between accounting and purchase-price views.
- Historical trend analysis should use a consistent account-mapping bridge for the subsidiary that transitioned reporting mapping in FY2024.
```
