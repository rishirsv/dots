# Section contract: Historical / financial performance

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

The Historical / financial performance section explains how trading performance moved over the historical period and what the supplied P&L actually means. It should tell the reader what changed in revenue, margin, cost base, and EBITDA, using narrative that is designed to sit beside a user-supplied or separately pasted exhibit rather than recreate that exhibit by default.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Assume the P&L is already available:** Default to writing the narrative that sits beside the exhibit. Do not regenerate the table unless the user asks for it or the section would otherwise be unusable.
2. **Lead with the performance story:** Start with the few period-anchored movements that matter most, then walk the underlying drivers.
3. **Follow the economics of the P&L:** Move through revenue, gross profit or direct-cost effects, operating costs, and EBITDA in the order that best explains the performance story.
4. **Discuss only material lines:** Do not force commentary for every caption. Expand only where the P&L, corpus, or management evidence shows a real driver.
5. **Use deep-dive mechanics only when triggered:** Reconciliation notes, classification effects, and caption definitions belong here only when they materially change interpretation of the historical trend.
6. **Keep the section on historical performance:** This is not a QoE bridge, recommendation list, or generic open-items section.

## Analytical workflow

1. **Confirm the period basis and exhibit context:** Identify the periods, units, and whether the user already supplied the P&L or adjacent slide exhibit. Treat the exhibit as external by default.
2. **Read the P&L before drafting:** Identify the largest changes in revenue, gross margin, operating costs, and EBITDA, plus any unusual captions or restatements that need explanation.
3. **Choose the real story shape:** Decide whether the section is primarily a standard performance narrative, a line-item deep dive, a segment/entity breakout, or a comparability-heavy section.
4. **Write the headline first:** Draft a short `Overview` that states what moved and why in the first 1-2 sentences.
5. **Build `Key Drivers` around the material captions:** Use numbered items or compact grouped commentary that explain the lines driving the performance story.
6. **Add optional blocks only when triggered:** Use exhibit framing, reconciliation, caption-definition, or comparability notes only when the adjacent P&L would otherwise be misread.
7. **Keep the text usable without rebuilding the exhibit:** The commentary should still work if the P&L is pasted on the left, above, or elsewhere in the final output.

## Section architecture

Scale the section based on performance complexity, the number of material drivers, and whether the supplied P&L needs extra interpretation beyond a standard performance walk.

Target length:

- `concise`: 180-320 words for stable businesses with a clear 2-4 point story
- `standard`: 280-520 words for most situations
- `expanded`: 450-800 words when multiple driver groups, segment dynamics, or comparability issues must be explained

Required blocks:

- `Overview`
  - Purpose: state the headline performance story with explicit periods and metrics.
  - Typical density: 1-3 bullets or short paragraphs.
- `Key Drivers`
  - Purpose: explain the material line items or themes in the order that best fits the P&L story.
  - Typical density: 3-8 numbered items.

Optional blocks:

- `Exhibit framing note`
  - Use when the adjacent P&L needs a short explanation of basis, restatement status, pro forma scope, or what the exhibit includes.
  - Use when the narrative depends on whether the exhibit is reported, adjusted, reclassified, or management-prepared.
- `Line-item deep dive`
  - Use when a standard `Key Drivers` list is not enough to explain direct-cost, gross-margin, operating-expense, or other caption mechanics.
  - Use when former `Income Statement` style material materially improves interpretation.
- `Segment or entity breakout`
  - Use when performance differs meaningfully by division, entity, customer group, or channel.
  - Use when the supplied P&L alone obscures where growth or margin movement came from.
- `Reconciliation / bridge note`
  - Use when management reporting differs from consolidated reporting, or when the narrative relies on a bridge from one P&L basis to another.
- `Classification and comparability note`
  - Use when reclasses, policy changes, timing issues, or incomplete support affect how trends should be read.
- `Supplemental schedule request`
  - Use only when no usable P&L was supplied and the section cannot responsibly be drafted without at least a lightweight summary schedule.
  - Do not use when the user has already provided the exhibit or clearly intends to paste it after the fact.

Ordering rules:

- Start with `Overview`.
- Follow with `Key Drivers`.
- Add optional blocks only when their trigger conditions are met.
- When multiple optional blocks are needed, use this default order: `Exhibit framing note` -> `Line-item deep dive` -> `Segment or entity breakout` -> `Reconciliation / bridge note` -> `Classification and comparability note` -> `Supplemental schedule request`.

Default behavior rule:

- Assume the user-provided or separately pasted P&L is the anchor exhibit.
- Write the right-hand-side narrative first.
- Do not create a replacement P&L table unless the user explicitly asks for one or no usable exhibit exists.

Boundary rule:

- Do not create a mandatory `Summary P&L` table block.
- Do not force a standalone `Income statement` section.
- Do not add a generic `Data quality and limitations`, `Data requests`, or `Implications for QoE` block.

## Available analytical units

Use these as building blocks for bullets, short sentence clusters, or numbered driver items. Choose only the units the section needs.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each unit definition.

### `headline trend`

- Purpose: state the main movement in revenue, margin, EBITDA, or another defining metric.
- Use when: opening the section or resetting the reader to the core performance story.
- Do not use when: repeating detail already covered in `Key Drivers`.
- Target length: 18-45 words.
- Source note: not usually needed if the adjacent exhibit is already visible.
- Example: `Revenue increased from $84.2 million in FY2022 to $109.6 million in FY2024, while EBITDA margin improved from 11.8% to 14.2% as gross-profit growth outpaced overhead expansion.`

### `exhibit reference line`

- Purpose: explain what the supplied or adjacent exhibit represents without rebuilding it.
- Use when: the P&L is adjusted, reclassified, annualized, pro forma, or otherwise not self-explanatory.
- Do not use when: the exhibit basis is obvious and the sentence would add only layout filler.
- Target length: 15-40 words.
- Source note: recommended when the basis is management-prepared or adjusted.
- Example: `The P&L provided alongside this section is presented on an adjusted basis and excludes standalone cost considerations.`

### `revenue driver item`

- Purpose: explain the main revenue movement or composition change.
- Use when: revenue growth, decline, mix, concentration, or volume/pricing effects are material.
- Do not use when: the point belongs primarily in customer concentration, segment, or comparability commentary instead.
- Target length: 30-90 words.
- Source note: recommended when the driver depends on management representation, pipeline, or customer-level detail.
- Example: `Revenue increased by $18.4 million from FY2022 to FY2024, primarily driven by price increases, higher same-site volume, and contribution from FY2023 acquisitions.`

### `gross-margin driver item`

- Purpose: explain how gross profit or direct-cost movement affected earnings quality.
- Use when: mix, pricing, labor, raw materials, subcontracting, or utilization materially changed gross margin.
- Do not use when: only EBITDA moved and gross-margin commentary would be speculative.
- Target length: 30-95 words.
- Source note: recommended when margin interpretation depends on adjusted or restated numbers.
- Example: `Gross margin increased from 33.1% to 36.4%, with selling-price actions and lower subcontractor reliance more than offsetting wage inflation in field delivery teams.`

### `cost-driver item`

- Purpose: explain one operating-cost caption or cost family that materially moved.
- Use when: SG&A, payroll, marketing, IT, rent, professional fees, or similar captions affected EBITDA.
- Do not use when: the movement is too small to matter to the overall story.
- Target length: 28-90 words.
- Source note: recommended when the caption includes management adjustments or partially supported allocations.
- Example: `Operating expenses increased by $6.2 million, led by central payroll, technology spending, and higher insurance costs associated with platform expansion.`

### `EBITDA movement item`

- Purpose: connect the main revenue, margin, and cost movements into the earnings outcome.
- Use when: closing the core story or summarizing the effect of multiple drivers.
- Do not use when: it simply repeats the opening sentence without adding explanatory value.
- Target length: 24-70 words.
- Source note: not usually needed if it is directly derived from the exhibit.
- Example: `EBITDA increased by $5.1 million over the period as gross-profit expansion more than offset incremental corporate overhead and incentive compensation.`

### `caption-definition note`

- Purpose: explain what a caption includes when the label is unusual or sector-specific.
- Use when: the reader could misinterpret a line such as net interest income, pass-through revenue, cost of services, or other custom captions.
- Do not use when: the caption is self-explanatory in context.
- Target length: 15-50 words.
- Source note: recommended.
- Example: `Net commission revenue is presented net of producer commission expense rather than on a gross billed basis.`

### `reconciliation note`

- Purpose: explain how one P&L basis maps to another.
- Use when: management, entity, divisional, adjusted, or consolidated views differ materially.
- Do not use when: there is no real bridge or the difference is immaterial.
- Target length: 20-60 words.
- Source note: recommended.
- Example: `Division EBITDA is shown before central cost allocations and eliminations, and the bridge to consolidated EBITDA should be used consistently when comparing historical periods.`

### `comparability note`

- Purpose: explain a reclass, policy change, or support limitation that affects period interpretation.
- Use when: prior periods were restated, captions moved, or trends are only comparable on an adjusted basis.
- Do not use when: the issue has no material effect on trend reading.
- Target length: 20-65 words.
- Source note: recommended.
- Example: `Variable compensation was reclassified from cost of revenue to SG&A in FY2024, and prior periods were restated on the same basis for comparability.`

### `supplemental schedule request note`

- Purpose: signal that the section cannot be responsibly completed without a P&L basis.
- Use when: no usable exhibit or supporting numbers were provided and the commentary would otherwise become speculative.
- Do not use when: the user has already indicated the P&L will be pasted separately.
- Target length: 12-35 words.
- Source note: not needed.
- Example: `Please provide the historical P&L or key line items for the covered periods so the commentary can be anchored to the actual exhibit.`

## Assembly patterns

Use one of these patterns based on how much interpretation the supplied P&L needs. These are assembly guides, not mandatory templates.

### `Standard adjacent-exhibit performance walk`

- Recommended block order: `Overview` -> `Key Drivers`
- Optional blocks typically activated: none; add `Exhibit framing note` only if the adjacent P&L is adjusted or reclassified
- Target density: 4-7 total bullets or numbered items
- Stop adding detail when: the reader can understand the main revenue, margin, cost, and EBITDA story from the narrative plus the supplied P&L

### `Driver-heavy P&L commentary`

- Recommended block order: `Overview` -> `Key Drivers` -> `Line-item deep dive`
- Optional blocks typically activated: `Line-item deep dive`, sometimes `Segment or entity breakout`
- Target density: 6-10 total bullets or numbered items
- Stop adding detail when: each material caption has a clear explanatory driver and the section no longer needs the old standalone income-statement treatment

### `Comparability or bridge-heavy section`

- Recommended block order: `Overview` -> `Exhibit framing note` -> `Key Drivers` -> `Reconciliation / bridge note` -> `Classification and comparability note`
- Optional blocks typically activated: `Exhibit framing note`, `Reconciliation / bridge note`, `Classification and comparability note`
- Target density: 6-10 total bullets or numbered items
- Stop adding detail when: the reader can distinguish the reported, adjusted, and comparable views without drifting into a QoE bridge

## Section-specific writing guidance

1. Keep the `so what` in the first 1-2 sentences.
2. Anchor every material metric to an explicit period and unit.
3. Default to discussing the P&L that the user supplied or will paste separately; do not recreate it unless asked.
4. Use the same caption language the exhibit uses when possible, then translate only as much as needed for clarity.
5. Follow the natural analytical order of the P&L, but skip immaterial lines instead of forcing a complete caption inventory.
6. Use numbered `Key Drivers` items when the section benefits from a clearer performance walk.
7. Attribute unverified drivers to Management or another stated source.
8. Keep recommendation language, diligence asks, and open-item lists out of the section.
9. Avoid brittle layout phrases such as `the above table` or `the adjacent chart` unless the delivery context explicitly depends on slide placement; prefer `the supplied P&L`, `the exhibit provided`, or direct quantified statements.
10. Keep optional deep-dive material inside the same section rather than splitting back into a standalone `Income Statement` block.

## Verification and review checks

Use these checks before finalizing a Historical / financial performance draft.

1. `Overview` and `Key Drivers` both exist.
2. The opening lines state a quantified performance story with explicit periods.
3. The draft assumes a user-supplied or separately pasted P&L by default and does not generate a replacement exhibit unless explicitly triggered.
4. `Key Drivers` focuses on the material lines or themes rather than forcing commentary for every caption.
5. Optional blocks appear only when their stated trigger rules are met.
6. Any exhibit-basis issue is handled through `Exhibit framing note`, `Reconciliation / bridge note`, or `Classification and comparability note`, not through a generic missing-information section.
7. Former `Income Statement`-style mechanics appear only when they materially improve interpretation.
8. No extraction-artifact language appears, including `Not present in source report` or `did not extract`.
9. No slot, layout, or `deckSpec` language appears in the drafted section.
10. Missing information uses inline placeholders or a narrow supplemental schedule request rather than unsupported claims.
11. The final draft reflects the adjacent-exhibit narrative model shown in this reference.
12. Language and tone pass `references/global-writing-conventions.md`.
13. Tighten any item that becomes hard to scan or tries to do more than one analytical job.

## Full examples

### Example 1: Standard adjacent-exhibit performance walk

```markdown
## Historical / financial performance

### Overview

- Revenue increased from $82.4 million in FY2022 to $124.7 million in FY2024, while EBITDA increased from $9.3 million to $16.8 million over the same period.
- Gross margin expanded from 38.1% to 41.6%, reflecting favorable mix and pricing actions that more than offset wage inflation in field delivery teams.

### Key Drivers

1. Revenue: Growth was primarily driven by higher service revenue and continued expansion in recurring customer activity, with smaller support from product revenue and ancillary fees.
2. Gross profit: Gross profit increased by $20.5 million from FY2022 to FY2024 as revenue growth outpaced the increase in direct materials and direct labor.
3. Operating expenses: Central payroll, technology, and professional fees increased over the period, but operating-cost growth remained below gross-profit growth.
4. EBITDA: EBITDA margin improved from 11.3% to 13.5% as gross-profit expansion more than offset higher overhead investment.
```

### Example 2: Deep-dive section with exhibit framing and comparability notes

```markdown
## Historical / financial performance

### Overview

- The adjusted P&L provided for FY2022 to FY2024 shows revenue growth of $75.7 million and EBITDA growth of $8.5 million, with the improvement driven mainly by service-line growth and gross-margin expansion.
- Operating costs also increased materially, but the increase was more than offset by stronger gross profit and favorable delivery mix.

### Exhibit framing note

- The P&L provided alongside this section is presented on an adjusted basis and includes management reclasses that align direct costs and operating expenses across the covered periods.

### Key Drivers

1. Revenue: Total revenue increased from $290.0 million in FY2022 to $365.7 million in FY2024, with service revenue contributing most of the growth and product revenue adding smaller support.
2. Direct costs and gross margin: Direct labor and subcontract costs increased in absolute terms, but gross margin improved from 30.2% to 32.4% due to pricing, delivery-mix improvement, and better utilization.
3. Operating expenses: Sales and marketing, general and administrative, and product-and-technology costs all increased, reflecting growth investment, payroll expansion, and system spend.
4. EBITDA: EBITDA increased from $18.6 million to $27.1 million because gross-profit growth outpaced operating-expense growth.

### Reconciliation / bridge note

- Management division reporting is prepared before central allocations and eliminations, so consolidated EBITDA should be used when comparing historical periods at the total-company level.

### Classification and comparability note

- Variable compensation was reclassified from direct costs to operating expenses in FY2024, and the historical periods were restated on the same basis for comparability.
```
