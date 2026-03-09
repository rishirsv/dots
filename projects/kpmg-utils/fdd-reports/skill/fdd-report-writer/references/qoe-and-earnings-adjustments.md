# Section contract: QoE and earnings adjustments

## Table of contents

- Section objective
- Core principles
- Request handling model
- Analytical workflow
- Section architecture
- Typical content areas
- Assembly patterns
- Section-specific writing guidance
- Verification and review checks
- Full examples

## Section objective

The QoE and earnings adjustments section explains how reported earnings move to a normalized earnings view that is decision-useful for diligence. It should tell the reader what metric is being normalized, how the reported-to-adjusted bridge is built, which adjustments are included, which items remain outside the bridge, and what assumptions could still move adjusted earnings.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Follow the user ask before the full workflow:** If the user asks for one rewrite, write one rewrite. If the user asks for five adjustments, write five adjustments. If the user asks for the full section, assemble the full section.
2. **Keep the bridge table first when writing a full section:** Full QoE sections are exhibit-led. The bridge carries the math, and the narrative carries the treatment, recurrence, basis, and residual risk.
3. **Use adjustment families, not flat lists:** Group adjustments by logic such as management, diligence, pro forma, non-recurring, accounting, or standalone cost. Do not default to chronology when grouping adds clarity.
4. **Preserve precision at the adjustment level:** Single-adjustment paragraphs should stay crisp, quantified, and reusable rather than being diluted into vague summary prose.
5. **Separate included adjustments from excluded considerations:** If an item is not quantified or does not belong in adjusted EBITDA, keep it outside the bridge and say why.
6. **State recurrence as a conclusion, not a label alone:** `Non-recurring`, `Run-rate`, `Recurring`, and `Uncertain` all need a stated rationale.
7. **Keep uncertainty explicit and scoped:** Label management representations, estimates, and unverified items clearly. Do not let the section drift into unsupported certainty or generic disclaimers.

## Request handling model

Use this section before drafting. It defines the QoE-specific scope logic for the skill.

### `Rewrite request`

- Use when: the user provides existing QoE prose, rough adjustment paragraphs, or weak wording and asks to rewrite, tighten, or polish it.
- Output shape: revised prose only for the text provided.
- Do not do: generate a full bridge, add new section blocks, or infer a broader scope than the request.
- Preferred building blocks: single-adjustment content areas from this reference.
- Typical signals: `rewrite this adjustment`, `tighten this paragraph`, `clean up this QoE text`.

### `Adjustment-set request`

- Use when: the user asks for a defined set of adjustments or grouped adjustment commentary, but not the full QoE section.
- Output shape: stand-alone adjustment paragraphs or grouped blocks.
- Do not do: force `Headline bridge`, `Basis and scope`, or full-section sensitivities unless the user asked for the section.
- Preferred building blocks: group intro templates, adjustment-family templates, and short exclusion notes when an item should stay outside the set.
- Typical signals: `write these five adjustments`, `draft the management adjustments`, `write the pro forma items`.

### `Section request`

- Use when: the user asks for the full QoE section or provides enough support to draft the full normalized-earnings discussion.
- Output shape: `Headline bridge` -> `Basis and scope` -> `Reported-to-adjusted bridge` -> `Adjustment groups` -> optional `Other considerations / not included` -> `Key sensitivities and missing information`.
- Do not do: collapse the section into disconnected adjustment paragraphs with no bridge logic.
- Preferred building blocks: the canonical section architecture plus adjustment-family templates.
- Typical signals: `write the QoE section`, `draft the quality of earnings analysis`, `write the earnings adjustments section`.

### Scope-lock rule

- Do not expand the response beyond the requested QoE scope.
- If the request is narrower than a full section, return the narrower deliverable cleanly.
- If the request is broader than a single family, group the output so it reads like intentional diligence writing rather than a pile of isolated paragraphs.

## Analytical workflow

1. **Classify the request shape:** Decide whether the user asked for a rewrite, an adjustment set, or a full section.
2. **Anchor the earnings basis:** Identify whether the section is normalizing EBITDA, EBIT, EBT, or net income, and state any definitional bridge needed before adjustment logic starts.
3. **Identify the adjustment population:** Separate management adjustments, diligence adjustments, pro forma items, and excluded considerations before drafting.
4. **Choose the right writing primitive:** Use a single-adjustment template for one item, a grouped block for a defined adjustment set, and the canonical section architecture for the full section.
5. **Build the bridge when required:** For full-section requests, create the reported-to-adjusted bridge before narrative commentary.
6. **Draft each material adjustment with defensibility:** State what the item is, why it is treated that way, how it affects adjusted earnings, what supports the treatment, and what residual risk remains.
7. **Separate excluded items cleanly:** If an item is subjective, pending, or unquantified, keep it outside the bridge and explain the exclusion rationale.
8. **Add sensitivities only when they matter:** Use sensitivities for valuation-relevant assumptions, run-rate items, pending policy changes, or other items that could still move adjusted earnings.

## Section architecture

Scale the output based on the request shape and adjustment volume.

Target length:

- `rewrite`: 40-180 words for one to three rewritten items
- `adjustment-set`: 140-500 words for grouped or stand-alone adjustments
- `section`: 420-1,050 words plus exhibits for most situations

### Required architecture by request shape

#### `Rewrite request`

- `Rewritten adjustment prose`
  - Purpose: deliver only the revised wording requested.
  - Typical density: one paragraph per item.

#### `Adjustment-set request`

- `Adjustment group intro` when needed
  - Purpose: orient the reader to the logic of the grouped set.
  - Typical density: 1-2 sentences.
- `Adjustment paragraphs`
  - Purpose: explain the requested items.
  - Typical density: 1 paragraph per item, or 2-4 grouped paragraphs when several items share one family.

#### `Section request`

- `Headline bridge`
  - Purpose: state reported-to-adjusted movement, main drivers, and period basis.
  - Typical density: 1-3 bullets.
- `Basis and scope`
  - Purpose: state sources, perimeter, metric definition, and limitations.
  - Typical density: 2-5 bullets.
- `Reported-to-adjusted bridge`
  - Purpose: show reported earnings, adjustment lines, total adjustments, and adjusted earnings.
  - Typical density: one bridge table and one source note.
- `Adjustment groups`
  - Purpose: explain the adjustments by logical family.
  - Typical density: 3-10 paragraphs or numbered items.
- `Other considerations / not included`
  - Purpose: capture items that matter but are not in adjusted earnings.
  - Typical density: 1-4 bullets or short paragraphs when triggered.
- `Key sensitivities and missing information`
  - Purpose: state what could still move adjusted earnings and which unresolved items matter to the current normalized view.
  - Typical density: 1-4 bullets.

### Optional full-section blocks

- `Definitional bridge`
  - Use when the reported starting point is not already EBITDA or the metric basis needs explicit reconciliation.
- `Management / Diligence / Pro forma sub-grouping`
  - Use when bucket labels improve readability or align with the source schedule.
- `Standalone / replacement-cost note`
  - Use when shared costs, owner support, or group services require a separate normalized cost view.
- `Sell-side reliance / reversals`
  - Use when the section starts from a seller-prepared schedule and the reader needs to know what changed.
- `Other considerations / not included`
  - Use when unresolved or subjective items could still change the QoE conclusion.

### Ordering rules

- For `rewrite`, do not add section architecture the user did not ask for.
- For `adjustment-set`, start with the most helpful grouping logic, not necessarily the source order.
- For `section`, use this default order:
  - `Headline bridge`
  - `Basis and scope`
  - `Reported-to-adjusted bridge`
  - `Adjustment groups`
  - `Other considerations / not included` when triggered
  - `Key sensitivities and missing information`

### Inclusion rules

- Do not include a full bridge table for an adjustment-only request.
- Do not include `Other considerations / not included` unless there are real excluded items worth flagging.
- Do not omit `Key sensitivities and missing information` from a full QoE section. If no additional quantified sensitivities or open items are identified, state that explicitly.

## Typical content areas

Use these typical content areas as the local writing primitives. Some are concise single-adjustment templates and others are section-level assembly areas. Use them directly when they fit instead of paraphrasing them into weaker prose.

### Core single-adjustment templates

#### `non-recurring items`

- Use when: removing one-time costs or gains from ongoing earnings.
- Do not use when: the item is recurring, run-rate, or still expected to continue post-close.
- Template text:

`Nonrecurring items, such as [one-time expenses | gains], exclude amounts not tied to Target's ongoing operations. Examples include: $[N] in transaction costs (legal, advisory, travel) for [deal/transaction] in [period]; $[N] in severance paid to [N] employees in [MMM-YY]; $[N] in one-time insurance claim proceeds in [MMM-YY]; and $[N] in charitable donations, with historical data indicating no recurrence post-close. The adjustment excludes these amounts from EBITDA.`

#### `compensation and bonus normalization`

- Use when: normalizing discretionary bonuses, performance-based bonuses, related payroll taxes, or ratable accrual timing.
- Do not use when: the item is owner compensation replacement or a broader standalone management-cost build.
- Template text:

`Target's compensation adjustments cover [discretionary | performance-based] bonuses and related payroll taxes. (1) The adjustment excludes $[N] in discretionary bonuses paid in [MMM-YY] from EBITDA as one-time items. (2) For ongoing bonuses accruing [monthly | quarterly] per performance metrics, the adjustment normalizes $[N] to match accruals with actual payouts. (3) The adjustment accrues related payroll taxes ratably over the period.`

#### `capitalization versus expensing`

- Use when: recasting capitalization policy or reversing inconsistent capitalization treatment.
- Do not use when: the issue is a pure cut-off item or an estimate reserve.
- Template text:

`Under [US GAAP | IFRS], costs like [R&D | software development | marketing] expenditures qualify for capitalization when specific criteria are met. (1) In [period], Target capitalized $[N] of [project] costs previously recorded as expenses. (2) Alternatively, the adjustment reclassifies $[N] of [internal labor | R&D spend] to operating expenses.`

#### `reserves and impairments`

- Use when: normalizing bad debt, inventory, intangible asset, or impairment treatment.
- Do not use when: the issue belongs in a balance sheet-only caption and has no earnings effect in the period discussed.
- Template text:

`This adjustment modifies Target's [bad debt | inventory | intangible asset] reserves and impairments: (1) The allowance for doubtful accounts rises by $[N], matching historical write-off rates of [N]% of revenue. (2) The adjustment records an impairment charge of $[N] in [period] for [assets] with projected cash flows below carrying value.`

#### `owner and management-related items`

- Use when: removing owner compensation, management fees, personal expenses, or other non-operational owner-related costs.
- Do not use when: the item is a standalone replacement-cost build that should be presented separately.
- Template text:

`The adjustment excludes owner and management-related expenses from EBITDA, as they do not align with Target's normalized operations. Specific items include: (1) $[N] in management fees paid to [Seller | Parent Company] in [period], ending post-close. (2) $[N] in personal expenses (travel, entertainment) charged to the business, ceasing post-transaction. (3) $[N] in owner compensation, removed if the owner departs post-transaction.`

#### `foreign currency and exchange adjustments`

- Use when: remeasuring revenue or costs on a constant-currency or comparable-rate basis.
- Do not use when: FX is immaterial and belongs in `Other considerations / not included`.
- Template text:

`Target records revenues and expenses in [foreign currencies], causing exchange rate fluctuations. The adjustment restates revenue and costs at a [constant exchange rate | average rate] to separate operational performance from currency volatility. Remeasuring [revenues/costs] at $[N]/[currency] in [period] adjusts EBITDA by $[N]. This method aligns comparisons across reporting periods.`

#### `pro forma operational changes`

- Use when: applying executed or supportable operational changes across the historical period.
- Do not use when: the assumption is aspirational or unsupported.
- Template text:

`The pro forma adjustment calculates the EBITDA impact assuming [specific operational change, e.g., headcount reduction, new bonus plan] applied throughout the historical period. Examples include: (1) Excluding $[N] in compensation costs for positions not backfilled after [MMM-YY]. (2) Adjusting for $[N] in increased expenses from a new policy starting [MMM-YY].`

#### `related-party transactions`

- Use when: restating related-party revenue, cost, or service arrangements to market or arm's-length terms.
- Do not use when: the related-party matter is a deal-structure issue better handled in net debt or balance sheet.
- Template text:

`Target conducts transactions with [related party] for [goods/services], totaling $[N] in [period]. The adjustment restates these transactions to [market rates | arm's length terms], adding $[N] in [cost | revenue]. This change adjusts EBITDA by $[N], matching third-party transaction terms.`

#### `lease and facility adjustments`

- Use when: excluding exit or relocation costs or reflecting supportable run-rate facility changes.
- Do not use when: the only issue is a general lease-accounting presentation matter with no current-period QoE effect.
- Template text:

`In [period], Target recorded $[N] in [lease exit | relocation | office closure] costs tied to [specific event, e.g., downsizing, relocation]. The adjustment excludes these [one-time | non-recurring] costs from EBITDA. Alternatively, it adjusts EBITDA by $[N] assuming the event occurred at the period's start.`

### Corpus-derived section and grouping templates

#### `headline bridge`

- Use when: writing the opening of a full QoE section.
- Do not use when: the user asked only for an adjustment set or rewrite.
- Target length: 1-3 bullets.
- Template pattern:

`Reported EBITDA of $[x] for [Period] adjusts to $[y] after net adjustments of $[z]. The net adjustment is primarily driven by [driver 1], [driver 2], and [driver 3].`

`The proposed adjustments are not necessarily all-inclusive and are based on information provided by Management to date; further analysis and access to additional information could identify additional or different adjustments.`

#### `basis and scope note`

- Use when: stating source set, metric basis, and known limitations.
- Do not use when: repeating a generic diligence disclaimer with no specific source or limitation.
- Target length: 2-5 bullets.
- Template pattern:

`The quality of earnings analysis is prepared based on [source 1], [source 2], and discussions with [Management / advisors / other source].`

`The bridge uses [EBITDA / EBIT / EBT / net income to EBITDA] as the starting metric and covers [period set].`

`Management-provided schedules are unaudited unless otherwise stated, and unverified items are labeled explicitly in the adjustment commentary.`

#### `management adjustment group intro`

- Use when: a group of management-identified adjustments is being introduced.
- Do not use when: only one management item is being written and a group intro would be repetitive.
- Template pattern:

`Management adjustments: The following are adjustments to reported [metric] identified by Management.`

#### `diligence adjustment group intro`

- Use when: introducing analyst-identified or buy-side diligence adjustments.
- Do not use when: there is no distinction from management adjustments.
- Template pattern:

`Diligence adjustments: The following are adjustments identified during diligence to reflect the underlying earnings of the core business.`

#### `pro forma group intro`

- Use when: introducing supportable run-rate or go-forward adjustments.
- Do not use when: the item is non-recurring rather than run-rate.
- Template pattern:

`Pro forma adjustments: The following adjustments reflect supportable run-rate changes identified during diligence and linked to the expected go-forward cost base.`

#### `grouped transition`

- Use when: several adjustments in a group share one common logic.
- Do not use when: each item needs its own paragraph because the basis or rationale differs materially.
- Template pattern:

`The following items share the same normalization logic and are grouped to avoid repeating the same recurrence conclusion.`

#### `sell-side reversal`

- Use when: reversing or reducing a seller or management add-back that is recurring or unsupported.
- Do not use when: there is no prior add-back to reverse.
- Template pattern:

`This adjustment reverses Management's add-back for [item] because the cost recurs in the normal operation of the business. Reported EBITDA had been increased by $[N] for [period], but invoices, payroll records, or historical spend indicate that the cost continues post-close. The adjustment decreases adjusted EBITDA by $[N], and recurrence is classified as recurring based on [basis].`

#### `out-of-period / cut-off / accrual normalization`

- Use when: correcting timing distortions in revenue or expense recognition.
- Do not use when: the issue is a valuation or reserve estimate rather than period alignment.
- Template pattern:

`This adjustment aligns [revenue | payroll | expense] recognition to the period in which the underlying [service | payroll run | obligation] occurred. Management recorded $[N] in [period], but the related activity belongs to [correct period]. The adjustment [increases / decreases] adjusted EBITDA by $[N] and is classified as [non-recurring / uncertain] because [process correction / support limitation].`

#### `standalone or replacement-cost adjustment`

- Use when: shared services, owner support, or group allocations do not reflect the cost base of the business on a standalone basis.
- Do not use when: the existing cost already reflects the go-forward operating structure.
- Template pattern:

`This adjustment replaces reported [shared service allocation | owner-supported cost base] with an estimated standalone cost structure. Historical costs of $[N] were allocated using [allocation basis], which does not reflect the direct cost of operating the business independently. The adjustment records a normalized cost of $[N] based on [replacement hires | third-party quotes | current cost base], reducing adjusted EBITDA by $[N].`

#### `excluded or unquantified consideration`

- Use when: an earnings-relevant item should be flagged but not included in adjusted EBITDA.
- Do not use when: the item is already quantified and included in the bridge.
- Template pattern:

`[Item] remains outside the adjusted EBITDA bridge because the impact is not yet fully quantifiable or remains dependent on [pending evidence / policy outcome / management decision]. The item may affect historical or future EBITDA, but it has not been included in the quality of earnings schedule.`

#### `sensitivity note`

- Use when: an assumption or pending item could still move adjusted earnings.
- Do not use when: the item is already fully resolved in the bridge.
- Template pattern:

`Adjusted EBITDA remains sensitive to [assumption], where a change of [x] would move earnings by approximately $[y].`

`If [run-rate item / pending policy / unverified cost] is not realized as assumed, adjusted EBITDA would move toward [lower / higher] than the current normalized view.`

## Assembly patterns

Use one of these patterns based on the user's ask. These are assembly guides, not mandatory templates.

### `Single adjustment rewrite`

- Recommended order: rewrite the item directly, preserving the existing logic and scope.
- Preferred primitives: one core single-adjustment template or one timing / sell-side / standalone template.
- Target density: 1 paragraph per item.
- Stop adding detail when: the revised paragraph states the item, treatment, why, impact, and basis cleanly.

### `Small adjustment set`

- Recommended order: optional group intro -> 2-5 adjustment paragraphs.
- Preferred primitives: one group intro plus family templates.
- Default grouping rule: if three or more items share one logic, group them under one intro; otherwise write stand-alone paragraphs.
- Stop adding detail when: the requested set is complete and no full-section architecture is needed to understand it.

### `Grouped mixed-family set`

- Recommended order: `Management adjustments` -> `Diligence adjustments` -> `Pro forma adjustments` when those buckets exist; otherwise group by the clearest family logic.
- Preferred primitives: group intros, grouped transition, family templates, sell-side reversal when triggered.
- Target density: 3-8 paragraphs total.
- Stop adding detail when: each group has one clear logic and the reader can tell which items were kept, reversed, or estimated.

### `Full QoE section`

- Recommended order: `Headline bridge` -> `Basis and scope` -> `Reported-to-adjusted bridge` -> `Adjustment groups` -> `Other considerations / not included` when triggered -> `Key sensitivities and missing information`.
- Preferred primitives: section-level templates plus family templates.
- Target density: 1 bridge table, 3-10 adjustment paragraphs, and only the optional blocks the evidence supports.
- Stop adding detail when: the bridge ties, the material adjustments are defensible, excluded items are cleanly separated, and the main earnings sensitivities are explicit.

### `Sell-side true-up section`

- Recommended order: `Headline bridge` -> `Basis and scope` -> `Reported-to-adjusted bridge` -> `Sell-side reliance / reversals` -> remaining adjustment groups -> `Other considerations / not included`.
- Preferred primitives: sell-side reversal, standalone / replacement-cost, timing normalization, excluded consideration.
- Target density: 4-8 paragraphs plus bridge.
- Stop adding detail when: the reader can see what the seller included, what changed, and why the revised adjusted EBITDA is more defensible.

## Section-specific writing guidance

1. Match the response to the user's scope before adding structure.
2. Use the core single-adjustment templates directly when they fit; do not paraphrase them into weaker, less precise prose.
3. Lead full sections with a short reported-to-adjusted statement before the detailed adjustment commentary.
4. Keep the bridge as the numerical anchor for full sections and keep the narrative tied back to the bridge lines.
5. Group adjustments by logic when the list is longer than two items or when grouped intros improve readability.
6. Write each material adjustment so the reader can answer five questions quickly: what is it, why is it treated that way, how big is it, what supports it, and what could still change.
7. Use `Other considerations / not included` for subjective or unquantified items, not as a dumping ground for generic open questions.
8. Use `Key sensitivities and missing information` to close the section cleanly, even when the conclusion is that no additional quantified sensitivities were identified beyond the matters already described.
9. Remove source artifacts such as `Not present in source report`, `following pages`, `adjacent table`, or repeated standalone headings.
10. Avoid turning an adjustment-only ask into a full diligence memo.

## Verification and review checks

Use these checks before finalizing a QoE response.

1. The response shape matches the user ask: rewrite, adjustment set, or full section.
2. Full-section responses contain `Headline bridge`, `Basis and scope`, a reported-to-adjusted bridge, and `Key sensitivities and missing information`.
3. Adjustment-only responses do not include unnecessary full-section blocks.
4. Every material adjustment states the item, treatment, recurrence logic, and impact or explicitly uses a placeholder when impact is unavailable.
5. Every material adjustment states or implies the basis/source, and unsupported certainty claims do not appear.
6. Sell-side or management add-backs that are reversed explain why the original add-back was not accepted.
7. Unquantified items are kept outside the bridge and clearly labeled as excluded or pending.
8. Grouped outputs are organized by logic rather than flat chronology when grouping helps readability.
9. No extraction-artifact language appears, including `Not present in source report`.
10. No slot, layout, or `deckSpec` language appears in the drafted QoE response.
11. Missing information uses inline placeholders rather than unsupported claims.
12. The final draft reflects the request-shaped model and typical content areas shown in this reference.
13. Language and tone pass `references/global-writing-conventions.md`.

## Full examples

### Example 1: Quick rewrite request

Input ask:

```markdown
Rewrite this adjustment:
The company had a lot of one-time legal and advisory fees in FY24 relating to the transaction and we think these should be removed because they are not part of normal business operations.
```

Output:

```markdown
One-time transaction and advisory fees ($[x]): Reported professional fees include legal, advisory, and diligence costs tied to the current transaction process. The adjustment removes these costs because they are event-driven and not required for ongoing operations. This adjustment increases adjusted EBITDA by $[x], and recurrence is classified as non-recurring based on [invoice detail / GL coding / management schedule].
```

### Example 2: Grouped adjustment-set request

Input ask:

```markdown
Write these five QoE adjustments only:
- owner compensation above market
- personal expenses through the business
- reverse management add-back for audit fees
- payroll accrual timing issue
- run-rate IT outsourcing cost
```

Output:

```markdown
Management adjustments: The following are adjustments to reported EBITDA identified by Management.

Owner compensation normalization ($[x]): The adjustment excludes owner and management-related expenses from EBITDA, as they do not align with Target's normalized operations. Reported payroll includes compensation levels above the expected go-forward management structure, and the adjustment replaces those amounts with a normalized market cost. This adjustment increases adjusted EBITDA by $[x], and recurrence is classified as run-rate based on [benchmark / agreed post-close salary / management support].

Owner personal expenses ($[x]): The adjustment excludes owner and management-related expenses from EBITDA, as they do not align with Target's normalized operations. Specific items include personal travel, entertainment, and other non-operational charges recorded through the business that cease post-transaction. This adjustment increases adjusted EBITDA by $[x], and recurrence is classified as non-recurring based on [GL detail / management representation].

Diligence adjustments: The following are adjustments identified during diligence to reflect the underlying earnings of the core business.

Audit fee reversal (($[x])): This adjustment reverses Management's add-back for audit fees because the cost recurs in the normal operation of the business. Reported EBITDA had been increased by $[x], but invoice history indicates that audit fees continue annually post-close. The adjustment decreases adjusted EBITDA by $[x], and recurrence is classified as recurring based on [invoice support / historical spend].

Payroll accrual normalization ($[x]): This adjustment aligns payroll recognition to the period in which the related payroll run occurred. Management recorded $[x] in [period], but the related payroll belongs to [correct period]. The adjustment [increases / decreases] adjusted EBITDA by $[x] and is classified as non-recurring because the month-end accrual process was corrected in subsequent periods.

Pro forma adjustments: The following adjustments reflect supportable run-rate changes identified during diligence and linked to the expected go-forward cost base.

Run-rate IT outsourcing cost (($[x])): The pro forma adjustment calculates the EBITDA impact assuming the current outsourced IT support model applied throughout the historical period. Historical periods reflected partial implementation only, and the normalized cost base requires the full run-rate contract cost to be reflected. This adjustment decreases adjusted EBITDA by $[x], and recurrence is classified as run-rate based on [signed contract / implemented operating model].
```

### Example 3: Full QoE section request

Input ask:

```markdown
Write the QoE section based on these facts:
- FY2022 to FY2024 and TTM Dec-2024
- EBITDA is the normalization metric
- management schedule, trial balances, payroll detail, invoices, and contracts reviewed
- reported EBITDA to adjusted EBITDA bridge needed
- management adjustments: owner compensation, transaction fees
- diligence adjustments: reverse audit fee add-back, revenue cut-off, payroll accrual
- pro forma adjustments: facility savings, standalone IT cost
- excluded items: pending bonus redesign, unresolved warranty provision
- sensitivities: facility savings timing and warranty reserve estimate
```

Output:

```markdown
## QoE and earnings adjustments

### Headline bridge
- Reported EBITDA of $24.8 million for TTM December 2024 adjusts to $27.7 million after net adjustments of $2.9 million. The net adjustment is primarily driven by owner compensation normalization, removal of one-time transaction costs, and supportable run-rate facility savings.
- The proposed adjustments are not necessarily all-inclusive and are based on information provided by Management to date; further analysis and access to additional information could identify additional or different adjustments.

### Basis and scope
- The quality of earnings analysis is prepared based on management adjustment schedules, trial balances, payroll detail, vendor invoices, facility agreements, and discussions with Management.
- The bridge covers FY2022 to FY2024 and TTM December 2024 and uses EBITDA as the normalization metric.
- Management-provided schedules are unaudited unless otherwise stated, and unverified items are labeled explicitly in the adjustment commentary.

### Reported-to-adjusted bridge (FY2022-FY2024 and TTM Dec-2024, $m)
Source note: Management-reported bridge workbook reconciled to trial balances and supporting schedules.

| Line item | FY2022 | FY2023 | FY2024 | TTM Dec-2024 | Recurrence | Basis |
|---|---:|---:|---:|---:|---|---|
| Reported EBITDA | 18.6 | 22.4 | 24.1 | 24.8 | N/A | Trial balance |
| Management: Owner compensation normalization | 1.1 | 1.2 | 1.2 | 1.2 | Run-rate | Payroll detail and agreed post-close salary |
| Management: One-time transaction and advisory fees | 0.0 | 0.4 | 1.6 | 1.7 | Non-recurring | Invoice detail and GL coding |
| Diligence: Reverse recurring audit fee add-back | (0.6) | (0.6) | (0.7) | (0.7) | Recurring | Historical invoices |
| Diligence: Revenue cut-off normalization | (0.4) | 0.3 | 0.0 | 0.0 | Non-recurring | Revenue schedule and month-end support |
| Diligence: Payroll accrual normalization | (0.2) | 0.1 | 0.2 | 0.2 | Non-recurring | Payroll accrual support |
| Pro forma: Run-rate facility savings | 0.0 | 0.0 | 0.8 | 1.0 | Run-rate | Executed lease exits |
| Pro forma: Standalone IT cost | (0.3) | (0.4) | (0.5) | (0.5) | Run-rate | Managed services contract |
| **Total adjustments** | **(0.4)** | **1.0** | **2.6** | **2.9** | N/A | N/A |
| **Adjusted EBITDA** | **18.2** | **23.4** | **26.7** | **27.7** | N/A | N/A |

### Adjustment groups
Management adjustments: The following are adjustments to reported EBITDA identified by Management.

Owner compensation normalization ($1.2 million in FY2024): The adjustment excludes owner and management-related expenses from EBITDA, as they do not align with Target's normalized operations. Reported payroll includes compensation levels above the expected go-forward structure, and the adjustment replaces those amounts with agreed post-close compensation levels. This adjustment increases adjusted EBITDA by $1.2 million, and recurrence is classified as run-rate based on payroll detail and agreed compensation terms.

One-time transaction and advisory fees ($1.6 million in FY2024): Nonrecurring items, such as one-time expenses, exclude amounts not tied to Target's ongoing operations. Reported professional fees include legal, advisory, and diligence costs tied to the current transaction process. The adjustment excludes these amounts from EBITDA and increases adjusted EBITDA by $1.6 million, with recurrence classified as non-recurring based on invoice detail and GL coding.

Diligence adjustments: The following are adjustments identified during diligence to reflect the underlying earnings of the core business.

Audit fee reversal (($0.7) million in FY2024): This adjustment reverses Management's add-back for audit fees because the cost recurs in the normal operation of the business. Reported EBITDA had been increased for audit spend treated as non-recurring, but invoice history indicates the annual audit remains required post-close. The adjustment decreases adjusted EBITDA by $0.7 million, and recurrence is classified as recurring based on historical invoices.

Revenue cut-off normalization ($0.3 million in FY2023): This adjustment aligns revenue recognition to the period in which the underlying services were delivered. Management recorded $0.3 million in the wrong period, and the adjustment reallocates that amount to the correct service period. The adjustment increases adjusted EBITDA by $0.3 million, and recurrence is classified as non-recurring because the closing process was revised after the affected period.

Payroll accrual normalization ($0.2 million in FY2024): This adjustment aligns payroll recognition to the period in which the related payroll run occurred. The accrual process understated current-period payroll expense, and the adjustment corrects the timing difference. The adjustment increases adjusted EBITDA by $0.2 million and is classified as non-recurring based on corrected accrual procedures in subsequent months.

Pro forma adjustments: The following adjustments reflect supportable run-rate changes identified during diligence and linked to the expected go-forward cost base.

Run-rate facility savings ($0.8 million in FY2024): The pro forma adjustment calculates the EBITDA impact assuming the facility consolidation completed in FY2024 had been in place for the full period. Executed lease exits and implemented payroll changes support the run-rate assumption. This adjustment increases adjusted EBITDA by $0.8 million, and recurrence is classified as run-rate.

Standalone IT cost (($0.5) million in FY2024): This adjustment replaces reported owner-supported or under-recorded IT support costs with an estimated standalone cost structure. Historical periods reflected partial support from group resources, while the expected go-forward model requires a full managed services contract. The adjustment reduces adjusted EBITDA by $0.5 million, and recurrence is classified as run-rate based on the signed contract.

### Other considerations / not included
- Bonus redesign remains outside the adjusted EBITDA bridge because the impact depends on a pending compensation framework that is not yet finalized. The item may affect future EBITDA, but it has not been included in the quality of earnings schedule.
- Warranty provision remains outside the adjusted EBITDA bridge because the reserve methodology and expected claims history are still being evaluated. The item may affect historical or future EBITDA, but it has not been included in the quality of earnings schedule.

### Key sensitivities and missing information
- Adjusted EBITDA remains sensitive to facility-savings timing, where a three-month delay would reduce TTM adjusted EBITDA by approximately $0.3 million.
- Adjusted EBITDA remains sensitive to the warranty reserve estimate, where a 10% change in expected claims would move earnings by approximately $0.2 million.
```

### Example 4: Sell-side true-up request

Input ask:

```markdown
Write the sell-side true-up portion only:
- seller added back annual audit fees as non-recurring
- seller excluded shared IT costs allocated by the parent
- diligence view is that audit fees remain recurring
- diligence view is that shared IT should be replaced with a standalone managed-services cost
```

Output:

```markdown
Sell-side reliance / reversals

Audit fee reversal (($[x])): This adjustment reverses Management's add-back for audit fees because the cost recurs in the normal operation of the business. Reported EBITDA had been increased by $[x], but invoice history indicates that the annual audit remains required post-close. The adjustment decreases adjusted EBITDA by $[x], and recurrence is classified as recurring based on [historical invoices / engagement letters].

Standalone IT cost (($[x])): This adjustment replaces reported shared-service support with an estimated standalone cost structure. Historical IT costs of $[x] were allocated by the parent using [allocation basis], which does not reflect the direct cost of operating the business independently. The adjustment records a normalized cost of $[x] based on [managed-services quotes / signed contract / current replacement model], reducing adjusted EBITDA by $[x].
```
