# Section contract: Balance sheet

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

The Balance Sheet section explains the Company's asset, liability, and equity position in terms that matter for diligence. It should tell the reader what is on the balance sheet, what changed over time or at the reference date, which captions require special interpretation, and where classification, estimate, perimeter, or financing issues affect the economic reading of the business.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Lead with the position, not the caption list:** State the total asset, liability, and equity or NAV position first, then explain what is driving the balance sheet.
2. **Treat the schedule as the anchor exhibit:** Strong balance-sheet sections are built around a dated schedule or composition table, not around long narrative paragraphs with hidden math.
3. **Explain captions through movement and meaning:** For each major caption, state what it contains, what moved, and why that matters for diligence.
4. **Separate routine composition from special interpretation:** Related-party balances, restricted cash, advances, deferred or unearned revenue, annual-only true-ups, and estimate-sensitive captions should be surfaced only when they change the economic reading.
5. **Keep financing and encumbrance context visible when relevant:** Collateral, guarantees, repayment profile, and restricted-use facts belong here when they affect liquidity, purchase-price interpretation, or downside analysis.
6. **Use comparability notes selectively:** Add them when accounting timing, annual-only adjustments, policy changes, or reporting-basis issues materially affect trend interpretation.
7. **Keep the section on balance-sheet mechanics:** Do not turn this section into a risk register, a detailed net debt section, or a generic request list.

## Analytical workflow

1. **Anchor the section to the right date basis:** Determine whether the section is period-end, multi-period, or snapshot-based, and keep the headline, schedule, and commentary on the same footing.
2. **Build the core balance-sheet exhibit:** Start from the reported balance sheet or reconciled management balance sheet and organize the main asset, liability, and equity captions into one readable schedule.
3. **Identify the captions that actually matter:** Focus commentary on the balances that drive asset mix, liability structure, liquidity interpretation, or purchase-price mechanics.
4. **Separate operating composition from special treatment:** Pull out related-party, restricted, non-operating, deferred, or estimate-sensitive balances when they would otherwise distort the reader's interpretation.
5. **Decide whether financing context belongs here:** Add collateral, guarantees, maturity profile, or debt-structure facts only when they materially change the balance-sheet read.
6. **Decide whether comparability or reconciliation notes are needed:** Use them when period-end balances are affected by annual-only entries, mapping differences, or incomplete bridges between audited, management, and trial-balance views.
7. **Scale the section to complexity:** Keep stable, simple balance sheets concise, and activate optional blocks only when the evidence genuinely requires them.

## Section architecture

Scale the section based on account complexity, financing structure, estimate sensitivity, and the extent of classification or reporting-basis issues.

Target length:

- `concise`: 220-360 words plus schedule for straightforward balance sheets with limited special treatment
- `standard`: 340-620 words plus schedule for most situations
- `expanded`: 520-900 words plus schedule when related-party balances, annual-only adjustments, financing constraints, or unusual captions materially affect interpretation

Required blocks:

- `Balance-sheet position and basis`
  - Purpose: state the total asset, liability, and equity or NAV position, the date anchor, and the main directional movement or interpretation point.
  - Typical density: 2-4 bullets.
- `Balance-sheet schedule and composition`
  - Purpose: present the anchor exhibit showing the balance-sheet composition and the basis used.
  - Typical density: one schedule plus one short source note.
- `Assets and operating-current-items walkthrough`
  - Purpose: explain the material asset and working-caption balances that drive how the business should be read.
  - Typical density: 3-6 bullets.
- `Liabilities, financing, and equity walkthrough`
  - Purpose: explain the material liability, funding, and equity balances and the implications for liquidity or closing interpretation.
  - Typical density: 3-6 bullets.

Optional blocks:

- `Estimate-sensitive or unusual captions`
  - Use when allowances, provisions, ECL, annual-only depreciation, annual-only EBO updates, accrual catch-ups, or similar estimate mechanics materially affect interpretation.
  - Use when one or more captions may be misstated, stale, or only partially updated at the reference date.
- `Related-party and perimeter considerations`
  - Use when receivables, loans, payables, or shared balances with related parties or non-transferring entities distort the operating reading of the balance sheet.
  - Use when the legal-entity perimeter differs from the economic perimeter the reader should focus on.
- `Financing profile and encumbrance context`
  - Use when collateral, guarantees, restrictions, lease obligations, refinancing pressure, or repayment profile materially affect liquidity or deal mechanics.
  - Use when the balance sheet cannot be interpreted properly without those facts.
- `Reconciliation to source reporting`
  - Use when the section relies on bridges between audited statements, management packs, consolidation files, or trial balances.
  - Use when mapping differences or incomplete reconciliation change confidence in the numbers.
- `Comparability implications for diligence analysis`
  - Use when annual-only adjustments, cash-basis recording, reclassifications, or policy changes make periods non-comparable.
  - Use when the balance-sheet reading affects how NWC, net debt, QoE, or purchase-price mechanics should be interpreted.
- `Snapshot-only limitation`
  - Use when the available evidence is limited to one date or a narrow period and does not support broader trend conclusions.

Ordering rules:

- Start with `Balance-sheet position and basis`.
- Follow with `Balance-sheet schedule and composition`.
- Follow with `Assets and operating-current-items walkthrough`.
- Follow with `Liabilities, financing, and equity walkthrough`.
- Add optional blocks only when their trigger rules are met.
- When multiple optional blocks are needed, use this default order: `Estimate-sensitive or unusual captions` -> `Related-party and perimeter considerations` -> `Financing profile and encumbrance context` -> `Reconciliation to source reporting` -> `Comparability implications for diligence analysis` -> `Snapshot-only limitation`.

Inclusion rule:

- Do not add an optional block just because the source mentions it. Add it only when it changes how the reader should interpret the balance sheet or related diligence conclusions.

Boundary rule:

- Do not create a generic `Data requests`, `Open items`, or caption dump appendix. Keep missing information inline with placeholders and use optional blocks only when the unresolved issue is still decision-useful.

## Available analytical units

Use these as building blocks for bullets, short sentence clusters, or concise numbered notes. Choose only the units the section needs.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each unit definition.

### `position unit`

- Purpose: state total assets, total liabilities, equity or NAV, the date anchor, and the main movement or implication.
- Use when: opening the section.
- Do not use when: repeating the same headline after the schedule already established it clearly.
- Target length: 20-45 words.
- Source note: usually not needed if the schedule follows immediately.
- Example: `As at December 31, 2024, total assets were $[x], total liabilities were $[y], and equity was $[z], with the year-on-year change primarily driven by higher receivables and deferred revenue.`

### `schedule framing unit`

- Purpose: introduce the main exhibit and tell the reader what basis it uses.
- Use when: the schedule needs one short sentence explaining whether it is reported, management, reconciled, or adjusted.
- Do not use when: the exhibit title and source note already do the full job.
- Target length: 15-35 words.
- Source note: not needed beyond the exhibit source note.
- Example: `The schedule below summarizes the reported balance sheet for FY2022 to FY2024 and the latest twelve months ended December 2024 on a management basis reconciled to trial balance support.`

### `caption walkthrough unit`

- Purpose: explain one material caption by stating what it includes, what moved, and why.
- Use when: a balance or trend materially shapes the reader's understanding of the business.
- Do not use when: the sentence only restates the balance without analytical value.
- Target length: 22-60 words.
- Source note: recommended when based on management explanation or non-obvious support.
- Example: `Inventory increased by $[x] from FY2023 to FY2024 as the Company built seasonal stock ahead of the peak shipping window, with raw materials remaining the largest component of the balance.`

### `classification note`

- Purpose: explain why a balance should be interpreted in a specific way despite its accounting caption.
- Use when: related-party balances, deposits, restricted cash, advances, negative receivables, deferred balances, or unusual current / non-current classifications could mislead the reader.
- Do not use when: the classification is obvious from the schedule and no interpretation issue exists.
- Target length: 18-50 words.
- Source note: recommended.
- Example: `Trade receivables include parent deposits recorded as credit balances in AR, so the reported caption should not be read as pure billed-and-uncollected operating receivables.`

### `estimate-sensitivity note`

- Purpose: explain where a caption depends on an estimate, annual-only update, or incomplete accounting process.
- Use when: allowances, ECL, provisions, annual-only depreciation, annual-only EBO updates, or year-end true-ups materially affect the balance.
- Do not use when: the estimate process is routine and not analytically important.
- Target length: 18-55 words.
- Source note: recommended.
- Example: `Employee benefit obligations are updated annually rather than monthly, so the period-end balance may understate the current liability if payroll or eligible headcount changed materially during the year.`

### `financing and encumbrance note`

- Purpose: state the debt-structure, collateral, guarantee, or restriction fact that changes liquidity or deal interpretation.
- Use when: assets are pledged, facilities are near maturity, repayment is due at call, or covenants constrain operations.
- Do not use when: the financing fact is immaterial to the balance-sheet reading.
- Target length: 18-55 words.
- Source note: recommended.
- Example: `All land and buildings are pledged against the senior facility, so the fixed-asset base should be read together with the lender security package rather than as freely available collateral.`

### `reconciliation-status note`

- Purpose: explain whether the section is tied to audited, management, trial-balance, or bridged reporting and what that means for confidence.
- Use when: the numbers come from more than one reporting layer or reconciliation is incomplete.
- Do not use when: the source basis is simple and fully obvious.
- Target length: 18-45 words.
- Source note: recommended.
- Example: `The FY2024 balance sheet is management-reported and reconciled to the trial balance, while the TTM column is management-only and has not been independently bridged to audited financial statements.`

### `comparability note`

- Purpose: explain why a period-to-period movement should not be read at face value.
- Use when: timing, policy, annual-only true-ups, mapping changes, or carve-out perimeter shifts affect comparability.
- Do not use when: the point is routine trend commentary with no real comparability concern.
- Target length: 18-55 words.
- Source note: recommended.
- Example: `Trade payables appear low at interim dates because the business books certain vendor accruals only at year-end, so interim balances understate the operating liability run-rate.`

### `limitation note`

- Purpose: state a meaningful constraint on what the balance-sheet analysis supports.
- Use when: the section is high-level only, based on one date, or missing detail on a material caption.
- Do not use when: the note is a generic disclaimer that adds no decision-useful information.
- Target length: 18-45 words.
- Source note: recommended.
- Example: `The analysis is based on one interim balance-sheet date and does not support a full trend conclusion for accrual timing or working-capital seasonality.`

## Assembly patterns

Use one of these patterns based on the section's complexity. These are assembly guides, not mandatory templates.

### `Simple schedule-backed walkthrough`

- Recommended block order: `Balance-sheet position and basis` -> `Balance-sheet schedule and composition` -> `Assets and operating-current-items walkthrough` -> `Liabilities, financing, and equity walkthrough`
- Optional blocks typically activated: none; add `Comparability implications for diligence analysis` only if timing or reporting-basis issues change the reading
- Target density: 5-8 bullets plus one schedule
- Stop adding detail when: the reader understands the composition of assets and liabilities, the main movements, and the one or two facts that matter for diligence

### `Related-party / classification-heavy balance sheet`

- Recommended block order: `Balance-sheet position and basis` -> `Balance-sheet schedule and composition` -> `Assets and operating-current-items walkthrough` -> `Liabilities, financing, and equity walkthrough` -> `Related-party and perimeter considerations` -> `Comparability implications for diligence analysis` when needed
- Optional blocks typically activated: `Related-party and perimeter considerations`, sometimes `Comparability implications for diligence analysis`
- Target density: 7-11 bullets plus one schedule
- Stop adding detail when: the reader can separate true operating balances from related-party or perimeter-driven balances and understand the implications for NWC, net debt, or closing mechanics

### `Financing / estimate-sensitive balance sheet`

- Recommended block order: `Balance-sheet position and basis` -> `Balance-sheet schedule and composition` -> `Assets and operating-current-items walkthrough` -> `Liabilities, financing, and equity walkthrough` -> `Estimate-sensitive or unusual captions` -> `Financing profile and encumbrance context` -> `Reconciliation to source reporting` or `Comparability implications for diligence analysis` when needed
- Optional blocks typically activated: `Estimate-sensitive or unusual captions`, `Financing profile and encumbrance context`, and sometimes `Reconciliation to source reporting`
- Target density: 8-12 bullets plus one fuller schedule
- Stop adding detail when: the reader can identify the balances requiring judgement, understand the debt or security constraints, and see whether reporting-basis issues affect confidence

## Section-specific writing guidance

1. Lead with a quantified, date-anchored position that states total assets, total liabilities, and equity or NAV.
2. Use the schedule as the structural anchor and keep the narrative tied to the schedule rather than drifting into free-form commentary.
3. Focus commentary on the captions that actually explain the balance sheet; do not narrate every row.
4. Write caption walkthroughs in full sentences that state what the caption includes, what moved, and why.
5. Surface related-party, restricted, deferred, or unusual classification issues only when they materially change interpretation.
6. Call out annual-only adjustments, estimate processes, or stale balances when they make interim or trend readings unreliable.
7. Include collateral, guarantees, restrictions, or refinancing context when they materially affect liquidity or transaction interpretation.
8. Use comparability notes when timing, accounting policy, or mapping issues distort direct period comparisons.
9. Avoid extraction artifacts, slot language, and generic prompts for further diligence.
10. Avoid turning the section into a duplicate of net debt, NWC, or QofE; only note cross-workstream implications when the balance-sheet reading would otherwise be misleading.

## Verification and review checks

Use these checks before finalizing a Balance Sheet draft.

1. `Balance-sheet position and basis`, `Balance-sheet schedule and composition`, `Assets and operating-current-items walkthrough`, and `Liabilities, financing, and equity walkthrough` all exist.
2. The section is anchored to explicit dates or periods and uses consistent units.
3. The opening states total assets, total liabilities, and equity or NAV when the evidence supports it.
4. The schedule includes the main asset, liability, and equity groupings and has a `Source note`.
5. The narrative explains the material captions rather than restating the full table row by row.
6. Related-party, restricted, deferred, or unusual classification issues are stated when relevant to interpretation.
7. Optional blocks appear only when their trigger rules are met.
8. `Estimate-sensitive or unusual captions` appears only when balances are meaningfully affected by judgement, annual-only true-ups, or incomplete accounting updates.
9. `Financing profile and encumbrance context` appears only when collateral, guarantees, restrictions, or maturity facts materially affect the reading.
10. `Reconciliation to source reporting` states the basis and confidence implication rather than listing process steps.
11. `Comparability implications for diligence analysis` contains real interpretive implications, not generic caveats.
12. No extraction-artifact language appears, including `Not present in source report` or `extraction policy`.
13. No slot, layout, render-skeleton, or `deckSpec` language appears in the drafted section.
14. Missing information uses inline placeholders rather than open-item headings.
15. The final draft reflects the schedule-backed caption-walkthrough model shown in this reference.
16. Language and tone pass `references/global-writing-conventions.md`.
17. Split or tighten any bullet that becomes hard to scan or tries to do more than one analytical job.

## Full examples

### Example 1: Standard schedule-backed balance sheet

```markdown
## Balance sheet

### Balance-sheet position and basis

- As at December 31, 2024, total assets were $334.0 million, total liabilities were $229.0 million, and equity was $105.0 million, compared with $280.0 million, $195.8 million, and $84.2 million as at FY2022, respectively.
- The balance-sheet expansion over the review period was driven primarily by higher trade receivables, incremental capital expenditure, and growth in deferred revenue and operating accruals in line with business scale.

### Balance-sheet schedule and composition

Source note: Audited financial statements FY2022-FY2024 and management balance-sheet support for the latest twelve months ended December 2024.

| Line item | FY2022 | FY2023 | FY2024 | LTM Dec-2024 |
| --- | ---: | ---: | ---: | ---: |
| Cash and cash equivalents | 12.4 | 15.1 | 17.8 | 18.6 |
| Trade and other receivables | 48.6 | 55.8 | 63.9 | 66.4 |
| Inventory | 22.1 | 24.7 | 27.5 | 28.9 |
| Prepaid and other current assets | 9.3 | 10.2 | 11.4 | 11.8 |
| **Total current assets** | **92.4** | **105.8** | **120.6** | **125.7** |
| Property, plant and equipment | 105.7 | 111.4 | 118.5 | 119.9 |
| Intangible assets | 63.2 | 68.1 | 72.9 | 73.6 |
| Other non-current assets | 18.7 | 19.7 | 22.0 | 21.0 |
| **Total non-current assets** | **187.6** | **199.2** | **213.4** | **214.5** |
| **Total assets** | **280.0** | **305.0** | **334.0** | **340.2** |
| Accounts payable | (28.9) | (31.6) | (35.4) | (36.2) |
| Accrued liabilities | (19.4) | (21.3) | (24.1) | (24.9) |
| Deferred revenue and other current liabilities | (16.3) | (18.9) | (22.5) | (23.1) |
| Current portion of debt and lease liabilities | (9.1) | (10.4) | (11.6) | (11.9) |
| **Total current liabilities** | **(73.7)** | **(82.2)** | **(93.6)** | **(96.1)** |
| Long-term debt | (88.2) | (93.7) | (97.8) | (98.0) |
| Lease liabilities (non-current) | (21.6) | (22.4) | (22.9) | (22.7) |
| Provisions and other non-current liabilities | (12.3) | (13.9) | (14.7) | (14.6) |
| **Total non-current liabilities** | **(122.1)** | **(130.0)** | **(135.4)** | **(135.3)** |
| **Total liabilities** | **(195.8)** | **(212.2)** | **(229.0)** | **(231.4)** |
| **Equity / (deficit)** | **84.2** | **92.8** | **105.0** | **108.8** |
| **Total liabilities and equity** | **280.0** | **305.0** | **334.0** | **340.2** |

### Assets and operating-current-items walkthrough

- Trade and other receivables increased by $15.3 million from FY2022 to FY2024, primarily due to higher enterprise billing volume and slightly longer settlement timing on larger customer programs.
- Inventory increased by $5.4 million over the same period as the Company carried higher safety stock and broader product mix ahead of peak seasonal demand.
- Prepaid and other current assets increased by $2.1 million, mainly reflecting software, insurance, and other operating prepayments rather than non-operating balances.
- Property, plant and equipment increased by $12.8 million, driven by distribution-hub upgrades and technology-enabled equipment additions, net of depreciation.
- Intangible assets increased by $9.7 million, primarily due to capitalized platform and application development supporting product expansion.

### Liabilities, financing, and equity walkthrough

- Accounts payable and accrued liabilities increased by $11.2 million from FY2022 to FY2024, mainly due to higher vendor spend and payroll-related accrual growth aligned with operating scale.
- Deferred revenue and other current liabilities increased by $6.2 million, reflecting growth in pre-billed customer programs and related contract liabilities.
- Total debt and lease obligations increased by $13.4 million over the period, with the incremental borrowings used primarily to fund capital investment.
- Provisions and other non-current liabilities increased by $2.4 million, mainly due to employee-related obligations and long-term service commitments.
- Equity increased by $20.8 million over the period, driven by cumulative retained earnings growth.
```

### Example 2: Related-party and estimate-sensitive balance sheet

```markdown
## Balance sheet

### Balance-sheet position and basis

- As at April 30, 2025, total assets were $612.4 million, total liabilities were $548.9 million, and equity was $63.5 million, compared with equity of $18.7 million as at April 30, 2024.
- The year-on-year improvement in equity reflected earnings recovery and lower short-term bank debt, although the balance sheet still requires careful interpretation because of related-party balances, annual-only accounting updates, and deferred tuition revenue timing.

### Balance-sheet schedule and composition

Source note: Management balance sheets for FY2023-FY2025 reconciled to trial-balance support for April 2025; audited financial statements available through FY2024 only.

| Line item | FY2023 | FY2024 | Apr-2025 |
| --- | ---: | ---: | ---: |
| Cash and cash equivalents | 96.3 | 132.8 | 208.0 |
| Trade and other receivables | 168.2 | 121.7 | 41.4 |
| Inventory | 6.8 | 5.9 | 4.6 |
| Prepaid expenses and deposits | 12.5 | 19.6 | 27.8 |
| Other current assets | 7.4 | 6.1 | 4.8 |
| **Total current assets** | **291.2** | **286.1** | **286.6** |
| Property, plant and equipment | 286.5 | 278.9 | 271.7 |
| Restricted cash and other non-current assets | 18.7 | 26.4 | 34.1 |
| **Total non-current assets** | **305.2** | **305.3** | **305.8** |
| **Total assets** | **596.4** | **591.4** | **612.4** |
| Trade payables and accruals | (39.6) | (44.1) | (58.4) |
| Deferred / unearned revenue | (201.8) | (184.7) | (64.1) |
| Current debt and lease liabilities | (31.2) | (18.4) | (7.6) |
| Other current liabilities | (22.1) | (26.9) | (33.5) |
| **Total current liabilities** | **(294.7)** | **(274.1)** | **(163.6)** |
| Long-term debt | (161.5) | (176.8) | (238.5) |
| Related-party loans | (84.4) | (98.5) | (116.2) |
| Employee benefit obligations and other non-current liabilities | (26.3) | (23.3) | (30.6) |
| **Total non-current liabilities** | **(272.2)** | **(298.6)** | **(385.3)** |
| **Total liabilities** | **(566.9)** | **(572.7)** | **(548.9)** |
| **Equity / NAV** | **29.5** | **18.7** | **63.5** |
| **Total liabilities and equity** | **596.4** | **591.4** | **612.4** |

### Assets and operating-current-items walkthrough

- Cash increased to $208.0 million as at April 2025, primarily because tuition for the upcoming term was collected ahead of revenue recognition, so the cash balance should be read together with the deferred revenue liability rather than as surplus free cash.
- Trade and other receivables declined by $80.3 million from FY2024 to April 2025 because invoices for the next academic term are issued in May, resulting in a structurally low interim receivables balance at April.
- Prepaid expenses and deposits increased to $27.8 million, largely due to deposits for campus expansion and advance project payments that are expected to clear into fixed assets as construction progresses.
- Property, plant and equipment remained the largest non-current asset category at $271.7 million, comprised primarily of land and buildings used in the school operation.

### Liabilities, financing, and equity walkthrough

- Deferred revenue remained a major liability category at $64.1 million as at April 2025, with the lower interim balance reflecting the timing of tuition invoicing and amortization rather than a structural reduction in student-related obligations.
- Trade payables and accruals increased to $58.4 million, driven by supplier spend, payroll-related accruals, and parent refund or deposit balances recorded through operating liability captions.
- Long-term debt and related-party loans together totaled $354.7 million as at April 2025, indicating that the asset base and expansion program remain meaningfully financed through external and shareholder funding.
- Equity improved to $63.5 million following recovery in operating performance, but the balance sheet still reflects a leveraged funding structure with significant dependence on long-term financing support.

### Estimate-sensitive or unusual captions

- Employee benefit obligations are updated annually using management's best-estimate method, so the April 2025 liability may not fully reflect current payroll levels or all eligible employees at the reporting date.
- Depreciation is recorded through year-end true-up processes rather than fully refreshed monthly, which limits direct comparability between the April 2025 fixed-asset balance and fully closed fiscal-year balances.
- Certain receivable and payable captions include annual-only clean-up entries and cut-off adjustments, so interim working-capital balances should be read cautiously without over-interpreting month-end precision.

### Related-party and perimeter considerations

- Related-party loans of $116.2 million represent shareholder and affiliate funding used for capital expenditure and working-capital support; these balances are not equivalent to third-party operating liabilities.
- Trade and other receivables include related-party and parent-related balances in addition to billed tuition receivables, so the headline AR caption should not be read as a pure operating collections measure.
- Certain advances and balances paid through the parent or affiliated entities are reclassified only at period-end, which can distort interim payables and other-liability captions.

### Financing profile and encumbrance context

- Land and buildings are pledged against the senior banking facilities, so the fixed-asset base should be read alongside lender security arrangements rather than as unencumbered collateral.
- The long-term facilities include restrictions on additional related-party lending and dividend distributions, which is relevant when considering near-term liquidity flexibility.
- Related-party loans are subordinated in practice and have no near-term repayment plan, which reduces immediate liquidity pressure but increases balance-sheet reliance on shareholder support.

### Reconciliation to source reporting

- FY2023 and FY2024 are based on audited financial statements, while April 2025 is management-reported and reconciled to trial balance support.
- Management provided bridges for major balance-sheet captions, but selected interim accrual, EBO, and depreciation balances remain subject to year-end normalization processes.

### Comparability implications for diligence analysis

- Interim April receivables and deferred revenue balances are driven heavily by tuition billing cadence, so these balances should not be used in isolation to set normalized working capital.
- Annual-only updates to depreciation, accruals, and employee benefit obligations reduce comparability between interim and year-end balance sheets.
- Related-party loans and affiliate-paid expenses should be classified consistently across balance-sheet, net debt, and working-capital analyses to avoid double counting or misclassification in purchase-price mechanics.
```
