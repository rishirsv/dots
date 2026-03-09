# Section contract: Business overview

## Table of contents

- Section objective
- Core principles
- Analytical workflow
- Section architecture
- Available narrative components
- Assembly patterns
- Section-specific writing guidance
- Verification and review checks
- Full examples

## Section objective

The Business Overview defines the transaction perimeter and explains the business model in terms that matter for diligence. It should tell the reader what is being acquired, what the business does, how it generates revenue, and only the operating, dependency, and change context needed to interpret the model.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Perimeter clarity comes first:** Define what is in scope and what is excluded before expanding into products, services, or geographies.
2. **Explain economics, not positioning:** Describe what the business sells and how it gets paid. Avoid generic market-positioning or strategy language.
3. **Use structure only when it informs understanding:** Include entities, brands, service lines, channels, and geographies only to the extent they change how the business is understood.
4. **Add dependencies and comparability only when they matter:** Shared services, central functions, supplier or platform dependence, regulatory structures, and standalone issues belong here only when they affect interpretation of the business model.
5. **Keep the section on the business model:** This section is not a mini historical performance or risk register section. Include only the context needed to explain how the business works.

## Analytical workflow

1. **Define the perimeter:** Identify the legal entities, brands, business lines, geographies, and explicit exclusions in scope. This gives the reader a clear boundary for the rest of the section.
2. **Identify the business building blocks:** Determine which operating entities, verticals, products, or service lines actually define the business. This prevents the section from becoming a loose fact list.
3. **Identify how the business gets paid:** Determine the core revenue mechanics, pricing logic, contract structure, or volume drivers. This explains the business in economically meaningful terms.
4. **Choose the scale anchors:** Select only the operating metrics that make the model concrete, such as sites, members, customers, branches, or assets. This grounds the narrative without turning it into an operating-statistics dump.
5. **Identify dependencies that affect interpretation:** Note shared services, centralized functions, supplier reliance, platform dependence, workforce model, or regulation only when they materially shape how the business operates.
6. **Add recent-change context selectively:** Include acquisitions, restructurings, launches, closures, or footprint changes only when they change how the current business should be read.
7. **Add comparability or standalone context selectively:** Include historical-versus-current structure differences only when they affect how the reader should interpret historical business composition or post-close economics.

## Section architecture

Scale the section based on business-model complexity, perimeter complexity, and the presence of operating dependencies or comparability issues.

Target length:

- `concise`: 180-300 words for straightforward single-model businesses
- `standard`: 260-480 words for most situations
- `expanded`: 420-650 words when multiple optional blocks are triggered

Required blocks:

- `Business snapshot and perimeter`
  - Purpose: identify the Company, define the transaction perimeter, and establish the core operating footprint.
  - Typical density: 2-4 bullets.
- `How the business works`
  - Purpose: explain the core offering and how revenue is generated.
  - Typical density: 2-5 bullets.

Optional blocks:

- `Composition and scale`
  - Use when multiple entities, service lines, channels, or geographies have meaningfully different economics.
  - Use when scale anchors are needed to make the model concrete.
  - Use when business mix changes how the reader interprets the business.
- `Operating structure and dependencies`
  - Use when shared services, centralized functions, intercompany arrangements, supplier reliance, platform reliance, labor model, or regulatory framework materially affect how the business runs.
  - Use when the current structure affects earnings interpretation or operational resilience.
- `Recent changes relevant to the current model`
  - Use when acquisitions, restructurings, launches, closures, pricing changes, or footprint changes are necessary to understand the current business model.
  - Use when recent changes explain why the business should not be read as static.
- `Comparability / standalone considerations`
  - Use when historical perimeter differs from current perimeter.
  - Use when cost allocations or shared functions distort historical comparability.
  - Use when post-close standalone operation may differ from historical group economics.

Ordering rules:

- Start with `Business snapshot and perimeter`.
- Follow with `How the business works`.
- Add optional blocks only when their trigger conditions are met.
- When multiple optional blocks are needed, use this default order: `Composition and scale` -> `Operating structure and dependencies` -> `Recent changes relevant to the current model` -> `Comparability / standalone considerations`.

Inclusion rule:

- Do not include an optional block just because the source mentions it. Include it only when it changes how the business should be understood.

Boundary rule:

- Do not create a universal `Customers and go-to-market` block. Customer, channel, and geography detail should appear only when it clarifies monetization or business mechanics.

## Available narrative components

Use these as building blocks for bullets or short sentence clusters. Choose only the components the section needs.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each component definition.

### `locator`

- Purpose: identify the Company and operating footprint at first mention.
- Use when: opening the section or reorienting the reader after a complex perimeter description.
- Do not use when: repeating basic identity facts already established in the section.
- Target length: 15-35 words.
- Source note: usually not needed unless the footprint or perimeter statement is non-obvious.
- Example: `Northfield Care Group provides outpatient primary care and diagnostic services across Ontario and Quebec through a regional clinic network.`

### `perimeter note`

- Purpose: define what is included and excluded from the transaction perimeter.
- Use when: the perimeter is narrower or more complex than the full enterprise.
- Do not use when: the transaction perimeter matches the full operating business and no exclusion needs to be made explicit.
- Target length: 15-40 words.
- Source note: recommended when exclusions, carve-outs, or structured entities are involved.
- Example: `The transaction perimeter includes clinic and laboratory operations and excludes a separately owned real estate holdco and one non-core pharmacy JV.`

### `entity-set`

- Purpose: explain the material operating entities, brands, or business lines and their roles.
- Use when: multiple entities or brands exist and the reader needs to understand how they fit together.
- Do not use when: one operating entity and one business line adequately explain the business.
- Target length: 20-50 words.
- Source note: recommended when the structure is legal-entity driven or carve-out sensitive.
- Example: `The Group operates through three clinic entities and one centralized diagnostics entity, each serving a distinct region or service role.`

### `business-model statement`

- Purpose: state what the business actually provides to customers.
- Use when: describing the core offering or service model.
- Do not use when: the sentence drifts into generic strategy or end-market commentary.
- Target length: 18-40 words.
- Source note: usually not needed unless the service scope is unusually broad or specialized.
- Example: `The Company delivers physician-led consultations, diagnostic testing, and ancillary care through community clinic sites and affiliated labs.`

### `monetization statement`

- Purpose: explain how revenue is generated and which mechanics matter.
- Use when: the business has identifiable pricing, contract, utilization, commission, or transaction drivers.
- Do not use when: the sentence simply repeats the business-model statement without explaining how the business gets paid.
- Target length: 18-45 words.
- Source note: recommended when the revenue model is specialized, mixed, or deal-critical.
- Example: `Revenue is generated through a mix of capitated contracts, fee-for-service billings, and employer-paid occupational health programs.`

### `composition statement`

- Purpose: explain mix across service lines, channels, entities, geographies, or customer groups.
- Use when: different parts of the business carry meaningfully different economics or strategic roles.
- Do not use when: the composition detail does not change how the business model is interpreted.
- Target length: 20-45 words.
- Source note: recommended when using percentages, ranking, or stated revenue mix.
- Example: `Core clinic visits represented approximately 68% of FY2024 revenue, diagnostics represented 22%, and employer programs represented 10%, resulting in different margin and utilization dynamics across the platform.`

### `scale anchor`

- Purpose: make the business model concrete through a concise operating metric.
- Use when: site count, member count, customers, assets, branches, studies, terminals, or similar metrics help the reader visualize the business.
- Do not use when: the metric is interesting but not explanatory.
- Target length: 12-35 words.
- Source note: recommended when the metric is precise, time-anchored, or likely to be repeated elsewhere.
- Example: `As of December 31, 2024, the Group operated 26 clinics, four lab sites, and served approximately 210,000 active patients.`

### `dependency note`

- Purpose: explain a structural dependency that affects how the business operates or should be interpreted.
- Use when: shared services, supplier reliance, platform dependence, workforce model, or regulation materially shapes the business.
- Do not use when: the point is a general risk statement rather than a business-model explanation.
- Target length: 18-50 words.
- Source note: recommended when the dependency is sensitive or non-obvious.
- Example: `Centralized scheduling, billing, and physician recruitment support all regions, which improves operating consistency but concentrates execution dependence in the corporate platform.`

### `change-context note`

- Purpose: explain a recent change that materially affects how the current business model should be read.
- Use when: acquisitions, restructurings, launches, closures, or pricing changes altered the business.
- Do not use when: the change is historical color only and does not help interpret the current model.
- Target length: 18-50 words.
- Source note: recommended when dates, acquired businesses, or stated operational changes are involved.
- Example: `Between FY2023 and FY2024, the Group added six clinics through acquisition, increasing urban density and expanding the diagnostics referral base.`

### `comparability note`

- Purpose: explain why historical structure, allocations, or perimeter may not map cleanly to the current or post-close business.
- Use when: shared functions, holdco allocations, carve-outs, or post-close redesign could affect interpretation.
- Do not use when: no genuine historical-versus-current or group-versus-standalone issue exists.
- Target length: 18-55 words.
- Source note: recommended when the issue affects period comparability or standalone understanding.
- Example: `Historical clinic profitability by legal entity is not fully comparable because corporate overhead and physician recruitment costs were managed centrally and allocated after period-end.`

## Assembly patterns

Use one of these patterns based on business shape. These are assembly guides, not mandatory templates.

### `Simple single-model business`

- Recommended block order: `Business snapshot and perimeter` -> `How the business works`
- Optional blocks typically activated: none; add `Composition and scale` only if a scale anchor materially clarifies the model
- Target density: 4-6 bullets total
- Stop adding detail when: the reader knows what is being acquired, what it sells, how it gets paid, and the one or two facts that make the model concrete

### `Multi-entity / multi-line business`

- Recommended block order: `Business snapshot and perimeter` -> `How the business works` -> `Composition and scale` -> `Operating structure and dependencies` -> `Comparability / standalone considerations` when needed
- Optional blocks typically activated: `Composition and scale`, `Operating structure and dependencies`, and sometimes `Comparability / standalone considerations`
- Target density: 6-10 bullets total
- Stop adding detail when: each material entity or line of business has a defined role and the reader can understand how the parts fit together without a separate market explainer

### `Change-heavy or roll-up business`

- Recommended block order: `Business snapshot and perimeter` -> `How the business works` -> `Recent changes relevant to the current model` -> `Composition and scale` -> `Operating structure and dependencies` -> `Comparability / standalone considerations` when needed
- Optional blocks typically activated: `Recent changes relevant to the current model`, `Composition and scale`, and `Comparability / standalone considerations`
- Target density: 6-10 bullets total
- Stop adding detail when: the current business model is clear and the reader understands why the current business should not be read as a static continuation of earlier periods

## Section-specific writing guidance

1. Lead with perimeter before elaborating on offerings, customers, or geography.
2. Explain what the business does in terms of offerings and revenue mechanics, not abstract strategy.
3. Use customer, channel, and geography detail only when it helps explain how the business gets paid or how the model is structured.
4. Use scale anchors only when they make the business model more concrete.
5. Keep one business idea per bullet or sentence cluster.
6. Keep historical or forward-looking context only when it helps interpret the current business model.
7. Avoid drifting into historical performance commentary, margin analysis, or deal recommendation language.
8. Avoid generic strategy, market-positioning, or management-presentation phrasing.

## Verification and review checks

Use these checks before finalizing a Business Overview draft.

1. `Business snapshot and perimeter` and `How the business works` both exist.
2. The transaction perimeter is clear, including exclusions when relevant.
3. The business model is explicit.
4. Monetization is explicit, or the section clearly signals that monetization detail is unavailable.
5. Optional blocks appear only when their stated trigger rules are met.
6. The section does not contain a default standalone `Customers and go-to-market` block.
7. The section does not drift into detailed historical performance commentary or a generic risk register.
8. No slot, layout, or `deckSpec` language appears in the drafted Business Overview section.
9. Missing information uses inline placeholders rather than open-item headings.
10. The final draft reflects the narrative-component model shown in this reference.
11. Language and tone pass `references/global-writing-conventions.md`.
12. Split or tighten any bullet that exceeds 55 words or becomes difficult to scan.
13. Split any block that is trying to do more than one analytical job.
14. Prefer a separate optional block over overloading a mandatory block.
15. Do not split solely to mimic slide layouts or visual symmetry.
16. Keep multi-entity or multi-line explanations grouped by business meaning, not by arbitrary formatting.

## Full examples

### Example 1: Simple single-model business

```markdown
## Business overview

### Business snapshot and perimeter

- Ridgeview Fire Protection Ltd. provides inspection, maintenance, and minor repair services for commercial fire-safety systems across Alberta and Saskatchewan.
- The transaction perimeter includes the operating company, service fleet, and field-service assets, and excludes a separately owned property entity that holds the head office and warehouse.

### How the business works

- The Company serves property managers, industrial sites, and multi-site commercial customers through recurring inspection contracts and call-out repair work.
- Revenue is generated primarily from scheduled inspection visits billed per site or device, with additional repair revenue driven by service-call volume and replacement parts.
- As of March 31, 2025, Ridgeview employed 48 technicians from one dispatch center and serviced approximately 3,200 active customer sites.
```

### Example 2: Multi-entity and change-heavy business

```markdown
## Business overview

### Business snapshot and perimeter

- Meridian Home Services Group operates a residential plumbing, HVAC, and electrical services platform across the US Southeast through a portfolio of local service brands.
- The transaction perimeter includes 14 operating branches across three legal entities and excludes a seller-owned call-center entity and two non-core real estate entities.

### How the business works

- The Group provides emergency repair, replacement, and maintenance services to residential customers, with additional revenue from equipment installation and membership plans.
- Revenue is generated through one-time service jobs, larger installation tickets, and recurring membership fees that support repeat demand and dispatch efficiency.
- Customer and channel detail is relevant only to the extent it explains monetization: digitally generated leads and outbound membership renewals drive a significant portion of booked work.

### Composition and scale

- HVAC represented approximately 48% of FY2024 revenue, plumbing represented 31%, and electrical represented 21%; installation-heavy HVAC work carried the highest average ticket size.
- Membership plans represented approximately 18% of FY2024 revenue and supported recurring demand across all three service lines.
- As of December 31, 2024, the Group operated 14 branches, employed approximately 420 field technicians, and completed more than 190,000 service calls during the year.

### Operating structure and dependencies

- Branch-level operations are managed locally, while procurement, digital marketing, finance, and call routing are coordinated centrally by the corporate platform.
- The current model depends on centralized lead generation, shared dispatcher workflows, and a concentrated group of equipment suppliers, each of which affects branch productivity and service mix.

### Recent changes relevant to the current model

- Between FY2023 and FY2024, the Group completed six acquisitions and closed two underperforming locations, which increased route density in core markets and shifted revenue mix toward acquired HVAC operations.
- Management also introduced a unified financing program for larger installation jobs in FY2024, increasing conversion on higher-ticket replacement work.

### Comparability / standalone considerations

- Historical branch results are not fully comparable across periods because marketing, dispatch, and certain corporate payroll costs were centralized and allocated after period-end.
- The excluded seller-owned call-center entity would require replacement or transitional support in a standalone post-close structure, even though lead-generation economics are embedded in historical branch performance.
```
