# Section contract: Executive summary

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

1. Present a concise summary of the transaction scope. Explicitly define all corporate entities, perimeters, structured entities, and exclusions upon first mention using consistent acronyms.
2. Connect the Target's operational structure to its financial realities.
3. Anchor all statements with concrete metrics, dates,

Present a concise, decision-useful summary of transaction scope, key financial conclusions, and principal risks.

This section is the client’s first read and must be clear on what is known, what remains uncertain, and what matters most for deal decisions.

When information needed to finalize a conclusion is missing, state the dependency inline in the relevant workstream conclusion using placeholders rather than creating a separate tracking block.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Writing guidance

1. Start with transaction context and scope before conclusions.
2. Keep this section outcome-focused: what changed, why it matters, and what could move at closing.
3. Present conclusions in workstream order: `QoE`, `Net working capital`, `Net debt and debt-like`, then other in-scope workstreams.
4. Anchor all key figures to explicit periods and units.
5. Use active voice and complete sentences; avoid clipped fragments and process language.
6. Keep risk language factual and balanced; do not use sales or investment-pitch wording.
7. For each top risk, state both the risk and the current mitigation status.
8. If a conclusion depends on missing information, state what is missing and why it matters in the same row or bullet as the conclusion (use placeholders instead of inventing details).
9. If a workstream is out of scope, state this explicitly instead of implying a conclusion.
10. Keep detail tight in this section; reserve deeper mechanics for the underlying section modules.

## Layout

Scale depth based on workstream coverage, number of material adjustments, and level of closing uncertainty.

Target length:

- 280-680 words (including tables)

Required blocks:

- `Deal and scope at a glance`
- `Key conclusions by workstream`
- `Top risks and mitigants`

Scaling rules:

- Keep concise when workstream conclusions are stable and closing uncertainty is limited.
- Expand `Deal and scope at a glance` when transaction perimeter or reporting basis is complex.
- Expand `Key conclusions by workstream` when multiple workstreams are in scope or adjustment volume is high.
- Expand `Top risks and mitigants` when risks are interdependent across workstreams.

Block slot map:

- `Deal and scope at a glance`: 1 `textArray` (4-8 bullets)
- `Key conclusions by workstream`: 1 `table` + 1 `textArray` (2-6 bullets)
- `Top risks and mitigants`: 1 `table` + optional 1 `textArray` (1-3 bullets)

## Available slot shapes

### `text`

- Plain string.
- Use for short source notes and labels.

### `textArray`

- Array of bullets or short statements.
- Use for all narrative blocks.

### `table`

- Object with `headers` and `rows`.
- Use for workstream conclusions and risks.

### `bodyStyle`

- `"bullets"` or `"paragraphs"` only.
- Default to `"bullets"` for this section.

## Render skeleton

```markdown
## Executive summary

### Deal and scope at a glance

- [Client] is evaluating [transaction type] of [Target], with diligence covering [in-scope workstreams].
- Reporting periods reviewed are [FY20XX-FY20XX and/or LTM/TTM], with balances anchored as at [Date].
- Figures in this report are presented in [currency], unless noted otherwise.
- The reporting basis is [IFRS / US GAAP / other], and assurance status is [audited / reviewed / management-prepared].
- Transaction perimeter includes [included entities/business lines] and excludes [excluded entities/business lines].
- This section reflects information available through [Date], including [trial balances / financial statements / management schedules / discussions].

### Key conclusions by workstream

| Workstream                  | Headline conclusion                                                                        | Current implication                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| QoE                         | Reported EBITDA of $[x] for [Period] adjusts to $[y] after identified normalization items. | Current adjusted earnings view supports a run-rate EBITDA of approximately $[x], subject to [named dependency]. |
| Net working capital         | Normalized NWC is $[x] as at [Date], compared with target/peg of $[y] on the agreed basis. | This indicates a $[x] [surplus/deficit] for purchase-price true-up mechanics.                                   |
| Net debt and debt-like      | Adjusted net debt is $[x] as at [Date], after reclassification of [named items].           | Closing debt-like treatment should include [named categories] on the same basis.                                |
| [Other in-scope workstream] | [Conclusion]                                                                               | [Implication]                                                                                                   |

- The largest valuation sensitivities at this stage are [sensitivity 1] and [sensitivity 2].
- Conclusions remain most sensitive to [named uncertainty], which should be refreshed when [missing input] is received.

### Top risks and mitigants

| Risk     | Severity              | Why it matters                                            | Current mitigant / status              |
| -------- | --------------------- | --------------------------------------------------------- | -------------------------------------- |
| [Risk 1] | [High / Medium / Low] | [How this could affect earnings, cash, or purchase price] | [Current mitigation action and status] |
| [Risk 2] | [High / Medium / Low] | [How this could affect earnings, cash, or purchase price] | [Current mitigation action and status] |
| [Risk 3] | [High / Medium / Low] | [How this could affect earnings, cash, or purchase price] | [Current mitigation action and status] |

- Risk severity reflects current evidence as at [Date] and should be refreshed if material new information is received.
```

## Common mistakes (and fixes)

1. Mistake: writing a descriptive process summary with no conclusions.

- Fix: include explicit workstream conclusions with quantified implications.

2. Mistake: presenting conclusions without period or unit anchors.

- Fix: attach each key metric to a clear period and unit.

3. Mistake: using investment-pitch language.

- Fix: keep wording factual, balanced, and diligence-focused.

4. Mistake: listing risks without mitigants.

- Fix: pair every risk with current mitigation status or action.

5. Mistake: omitting decision-critical uncertainties or missing information that could move conclusions.

- Fix: state the dependency inline in the affected workstream row or bullet using placeholders and a clear “refresh when received” statement.

6. Mistake: embedding deep technical detail from underlying sections.

- Fix: keep this section to headline implications and point detailed mechanics to workstream sections.

## Structural preflight rules (must pass)

1. All four required blocks exist and are in this exact order.
2. `Deal and scope at a glance` includes transaction context, periods, currency, and scope boundary.
3. `Key conclusions by workstream` includes at least `QoE`, `Net working capital`, and `Net debt and debt-like` when those workstreams are in scope; out-of-scope items are explicitly labeled.
4. `Top risks and mitigants` includes at least three risks, each with severity and a mitigation/status statement.
5. No recommendation-style investment language appears.
6. Missing information is handled with inline placeholders, not unsupported claims.
7. Render skeleton and full example are materially different (template vs worked output).
8. Language and tone pass global conventions.

## Split policy rules

1. Split `Key conclusions by workstream` into core and supplemental tables when in-scope workstreams exceed five.
2. Split `Top risks and mitigants` into financial versus operational risks when rows exceed six.
3. Split any bullet longer than 95 words into two tighter bullets.

## Full example

```markdown
## Executive summary

### Deal and scope at a glance

- MapleBridge Capital is evaluating a majority investment in NorthBridge Payments Group.
- Diligence scope covers quality of earnings, net working capital, net debt and debt-like items, quality of net assets, and reporting environment.
- Periods reviewed are FY2022 to FY2024 and TTM December 2024, with balance-sheet conclusions anchored as at December 31, 2024.
- Figures in this report are presented in $m unless noted otherwise.
- The reporting basis is IFRS, using audited annual financial statements supplemented by management trial balances and supporting schedules.
- Transaction perimeter includes core operating entities and excludes one disposed JV completed in Q2 FY2023.
- This summary reflects information available through February 28, 2025.

### Key conclusions by workstream

| Workstream             | Headline conclusion                                                                                                  | Current implication                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| QoE                    | FY2024 reported EBITDA of $24.1 adjusts to $26.7 after identified normalization and run-rate adjustments.            | Current adjusted earnings capacity is approximately $26.7, with sensitivity to estimate-driven true-ups.        |
| Net working capital    | Normalized NWC was $13.2 as at December 31, 2024 versus a target basis of $12.5.                                     | This indicates a $0.7 surplus on the current completion-account basis.                                          |
| Net debt and debt-like | Adjusted net debt was $(521.3) as at December 31, 2024 after debt-like reclassifications and identified obligations. | Closing funds flow should preserve current treatment of tax, transaction, and capex-related debt-like balances. |
| Quality of net assets  | Reported NAV of $1,285 adjusted to $1,007 after perimeter and normalization adjustments.                             | Purchase-price analysis should use adjusted NAV and refresh for closing-date balances.                          |

- The largest valuation sensitivities are estimate recalibration in loyalty and credit-loss balances and final completion-account classification alignment.
- Current conclusions remain most sensitive to classification alignment across workstreams and to closing-date refresh of estimate-driven balances.

### Top risks and mitigants

| Risk                                               | Severity | Why it matters                                                                                   | Current mitigant / status                                                                                       |
| -------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Estimate-driven liability volatility               | High     | Changes in loyalty and credit-loss assumptions can move earnings and net assets between periods. | Finance team is preparing updated model support and assumption bridge for closing refresh.                      |
| Classification drift across QoE, NWC, and net debt | High     | Inconsistent treatment can cause double counting or omission in purchase-price mechanics.        | A cross-workstream classification matrix is in progress and will be finalized before SPA schedule lock.         |
| Intercompany unwind execution risk                 | Medium   | Delays in settling non-transferring balances could affect closing cash and completion accounts.  | Legal and finance workstreams are validating settlement mechanics and sequencing in the draft funds-flow model. |

- Risk ratings reflect current evidence as at February 28, 2025 and should be refreshed if material updates are received.
```
