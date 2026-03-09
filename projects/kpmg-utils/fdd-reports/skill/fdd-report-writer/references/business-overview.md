# Section contract: Business overview

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

The Business Overview defines the transaction perimeter and explains the business model in terms that matter for diligence. It should tell the reader what is being acquired, what the business does, how it generates revenue, and any structural facts needed to understand the current business model, such as material entities, channels or footprint, shared-service dependencies, and recent acquisitions or reorganizations.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Perimeter clarity comes first:** Define what is in scope and what is excluded before expanding into products, services, or geographies.
2. **Explain economics, not positioning:** Describe what the business sells and how it gets paid. Avoid generic market-positioning or strategy language.
3. **Use structural detail selectively:** Include entities, brands, service lines, channels, footprint, or operating scale only when they help the reader understand how the business works.
4. **Include dependencies only when they change interpretation:** Shared services, centralized functions, key supplier or platform relationships, workforce model, or regulatory structure belong here only when they affect how the business operates or how the perimeter should be read.
5. **Keep the section focused on the current business model:** This section is not a mini historical performance or risk register section. Include recent changes, comparability points, or standalone issues only when they are needed to understand the current business.

## Analytical workflow

1. **Define the perimeter:** Identify the legal entities, brands, business lines, geographies, and explicit exclusions in scope. This gives the reader a clear boundary for the rest of the section.
2. **Describe the business model:** Determine the products or services that define the business and how revenue is generated, including the core pricing logic, contract structure, or volume drivers.
3. **Select only the structural facts that matter:** Add entities, channels, footprint, or scale anchors such as sites, members, customers, branches, or assets only when they make the model easier to understand.
4. **Identify material dependencies:** Note shared services, centralized functions, key supplier or platform relationships, workforce model, or regulatory structure only when they materially shape operations, earnings interpretation, or the transaction perimeter.
5. **Add recent-change context selectively:** Include acquisitions, restructurings, launches, closures, or footprint changes only when they change how the current business should be read.
6. **Add comparability or standalone context selectively:** Include historical-versus-current structure differences only when they affect how the reader should interpret historical business composition or post-close economics.

## Section architecture

Scale the section based on how much perimeter, business-model, composition, and recent-change detail the reader needs to understand the business.

**Verbosity:**

- Stop adding detail when the reader understands what is being acquired, what the business does, how it makes money, and only the structural facts needed to interpret the current model. In most cases, aim for 4-8 bullets and roughly 180-450 words. Move above that range only when multiple entities, material dependencies, or recent changes genuinely need explanation.

**Required content areas:**

- Business snapshot and perimeter
  - Cover what the Company is, what is in scope, and the basic operating footprint, usually in 1-3 opening bullets.
- How the business works
  - Explain the core offering and how revenue is generated, usually in 2-4 bullets that follow naturally after the opening bullets.

**Optional content areas:**

- Composition and scale
  - Add when mix, structure, or scale helps the reader understand the model.
- Operating structure and dependencies
  - Add when shared services, suppliers, platforms, labor model, or regulation materially shape how the business operates.
- Recent changes relevant to the current model
  - Add when acquisitions, restructurings, launches, closures, or other changes are needed to explain the current business as it exists today.
- Comparability / standalone considerations
  - Add when historical structure, allocations, or carve-out mechanics affect comparability or standalone interpretation.

**Data / information typically needed:**

- Company description covering what the business does
- Transaction perimeter details, including included entities, excluded items, and any carve-outs
- Revenue model details, including how the business gets paid and any key pricing or contract mechanics
- Basic operating footprint, such as geographies, sites, branches, clinics, customers, members, or other scale anchors when relevant
- Business composition details, such as entities, brands, service lines, channels, or customer groups, when they matter to understanding the model
- Structural context, such as shared services, centralized functions, supplier or platform dependence, workforce model, or regulation, when relevant
- Recent changes, such as acquisitions, restructurings, launches, closures, or footprint changes, when relevant
- Comparability or standalone context, such as historical perimeter differences, allocations, or carve-out mechanics, when relevant

**Data mapping considerations:**

- Treat perimeter, business model, and revenue mechanics as the core inputs. These should usually appear even in a short section.
- Add entities, service lines, channels, locations, and scale metrics only when they help explain how the business works.
- Dependencies, recent changes, and comparability points should be added selectively, not by default.
- If source information is thin, keep the section concise rather than padding it with generic commentary.
- If an expected detail is relevant but missing, use an inline placeholder sentence in square brackets instead of skipping the point entirely. Example: `[Revenue is primarily generated through ...]` or `[The Company operates across ... locations.]`

**Formatting principle:**

- Default to standard bullets. Add a short lead-in line or in-section subheader only when it helps the reader scan grouped content, such as service lines, entities, or product categories.

**Ordering rules:**

- Start by covering Business snapshot and perimeter.
- Follow with How the business works.
- Add optional content areas only when their trigger conditions are met.
- When multiple optional content areas are needed, this is the usual order: Composition and scale -> Operating structure and dependencies -> Recent changes relevant to the current model -> Comparability / standalone considerations.
- These are content areas, not mandatory subheadings in the drafted section. In most cases, the section is written as standard bullets. Add an in-section subheader only when it genuinely improves readability, such as introducing a list of service lines, entities, or product categories.

## Typical content areas

Use these as the main building blocks for the section. Choose only the content areas the draft actually needs.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each content-area definition.

### Company identity and footprint

- Purpose: identify the Company and operating footprint at first mention.
- Target length: 15-35 words.
- Source note: usually not needed unless the footprint or perimeter statement is non-obvious.
- Example: `Northfield Care Group provides outpatient primary care and diagnostic services across Ontario and Quebec through a regional clinic network.`

### Transaction perimeter

- Purpose: define what is included and excluded from the transaction perimeter.
- Target length: 15-40 words.
- Source note: recommended when exclusions, carve-outs, or structured entities are involved.
- Example: `The transaction perimeter includes clinic and laboratory operations and excludes a separately owned real estate holdco and one non-core pharmacy JV.`

### Entities, brands, and business lines

- Purpose: explain the material operating entities, brands, or business lines and their roles.
- Target length: 20-50 words.
- Source note: recommended when the structure is legal-entity driven or carve-out sensitive.
- Example: `The Group operates through three clinic entities and one centralized diagnostics entity, each serving a distinct region or service role.`

### What the business does

- Purpose: state what the business actually provides to customers.
- Target length: 18-40 words.
- Source note: usually not needed unless the service scope is unusually broad or specialized.
- Example: `The Company delivers physician-led consultations, diagnostic testing, and ancillary care through community clinic sites and affiliated labs.`

### How the business makes money

- Purpose: explain how revenue is generated and which mechanics matter.
- Target length: 18-45 words.
- Source note: recommended when the revenue model is specialized, mixed, or deal-critical.
- Example: `Revenue is generated through a mix of capitated contracts, fee-for-service billings, and employer-paid occupational health programs.`

### Business mix

- Purpose: explain mix across service lines, channels, entities, geographies, or customer groups.
- Use when: different parts of the business carry meaningfully different economics or strategic roles.
- Skip when: the mix detail does not change how the business model should be understood.
- Target length: 20-45 words.
- Source note: recommended when using percentages, ranking, or stated revenue mix.
- Example: `Core clinic visits represented approximately 68% of FY2024 revenue, diagnostics represented 22%, and employer programs represented 10%, resulting in different margin and utilization dynamics across the platform.`

### Scale and footprint

- Purpose: make the business model concrete through a concise operating metric.
- Target length: 12-35 words.
- Source note: recommended when the metric is precise, time-anchored, or likely to be repeated elsewhere.
- Example: `As of December 31, 2024, the Group operated 26 clinics, four lab sites, and served approximately 210,000 active patients.`

### Dependencies and operating structure

- Purpose: explain a structural dependency that affects how the business operates or should be interpreted.
- Use when: shared services, supplier reliance, platform dependence, workforce model, or regulation materially shapes the business.
- Skip when: the point is only a generic risk statement rather than an explanation of how the business works.
- Target length: 18-50 words.
- Source note: recommended when the dependency is sensitive or non-obvious.
- Example: `Centralized scheduling, billing, and physician recruitment support all regions, which improves operating consistency but concentrates execution dependence in the corporate platform.`

### Recent changes

- Purpose: explain a recent change that materially affects how the current business model should be read.
- Use when: acquisitions, restructurings, launches, closures, or pricing changes altered the business.
- Skip when: the change is only historical background and does not help explain the current model.
- Target length: 18-50 words.
- Source note: recommended when dates, acquired businesses, or stated operational changes are involved.
- Example: `Between FY2023 and FY2024, the Group added six clinics through acquisition, increasing urban density and expanding the diagnostics referral base.`

### Comparability and standalone context

- Purpose: explain why historical structure, allocations, or perimeter may not map cleanly to the current or post-close business.
- Use when: shared functions, holdco allocations, carve-outs, or post-close redesign could affect interpretation.
- Skip when: there is no real historical-versus-current or group-versus-standalone issue to explain.
- Target length: 18-55 words.
- Source note: recommended when the issue affects period comparability or standalone understanding.
- Example: `Historical clinic profitability by legal entity is not fully comparable because corporate overhead and physician recruitment costs were managed centrally and allocated after period-end.`

## Assembly patterns

Use one of these patterns based on the shape of the business. These are practical guides, not fixed templates.

### Simple single-model business

- Usual flow: opening bullets cover the company, perimeter, and business model without separate subheadings.
- Add Composition and scale only if one operating metric or footprint detail materially helps the reader picture the business.
- Aim for 4-6 bullets total.
- Stop adding detail when the reader knows what is being acquired, what it sells, how it gets paid, and the one or two facts that make the model concrete.

### Multi-entity or multi-line business

- Usual flow: start with a few opening bullets on the company and perimeter, then move into entities, business lines, and any dependencies needed to explain how the parts fit together.
- In practice, this pattern often adds content on business mix, scale, and operating structure. Add comparability context only when the structure or perimeter makes historical reading less straightforward.
- Aim for 6-10 bullets total.
- Stop adding detail when each material entity or line of business has a clear role and the reader can understand how the parts fit together without a separate market explainer.
- If readability would otherwise suffer, a short in-section lead-in or subheader can be used before a grouped list of entities, service lines, or products.

### Change-heavy or roll-up business

- Usual flow: open with the company, perimeter, and business model, then add recent changes once the reader has enough context to understand why those changes matter.
- In practice, this pattern often adds recent changes and business mix or scale. Add comparability context when acquisitions, reorganizations, or carve-out mechanics affect how earlier periods should be read.
- Aim for 6-10 bullets total.
- Stop adding detail when the current business model is clear and the reader understands why the business should not be read as a static continuation of earlier periods.

## Section-specific writing guidance

1. Lead with perimeter early, but do not force a literal `Business snapshot and perimeter` heading in the drafted section unless readability genuinely requires it.
2. Explain what the business does in terms of offerings and revenue mechanics, not abstract strategy.
3. Use customer, channel, and geography detail only when it helps explain how the business gets paid or how the model is structured.
4. Use scale anchors only when they make the business model more concrete.
5. Keep one business idea per bullet or sentence cluster.
6. Default to standard bullets. Use in-section subheaders or labeled bullets only when they make grouped content easier to scan.
7. Keep historical or forward-looking context only when it helps interpret the current business model.
8. Avoid drifting into historical performance commentary, margin analysis, or deal recommendation language.
9. Avoid generic strategy, market-positioning, or management-presentation phrasing.

## Verification and review checks

**Verification questions:**
- Is it clear what is being acquired and what is excluded from the transaction perimeter?
- Does the section explain what the business does and how it makes money?
- Are mix, scale, dependencies, recent changes, or comparability points included only when they help the reader understand the current business model?
- Is the section written as clear, scan-friendly bullets without drifting into historical performance, market-positioning, or generic risk commentary?
- Where relevant information is missing, does the draft use inline placeholders in square brackets rather than open questions or vague filler?

## Full examples

These examples show content flow, not required headings or exact bullet counts.

### Example 1: Simple single-model business

```markdown
## Business overview

- Ridgeview Fire Protection Ltd. provides inspection, maintenance, and minor repair services for commercial fire-safety systems across Alberta and Saskatchewan.
- The transaction perimeter includes the operating company, service fleet, and field-service assets, and excludes a separately owned property entity that holds the head office and warehouse.

- The Company serves property managers, industrial sites, and multi-site commercial customers through recurring inspection contracts and call-out repair work.
- Revenue is generated primarily from scheduled inspection visits billed per site or device, with additional repair revenue driven by service-call volume and replacement parts.
- As of March 31, 2025, Ridgeview employed 48 technicians from one dispatch center and serviced approximately 3,200 active customer sites.
```

### Example 2: Multi-entity and change-heavy business

```markdown
## Business overview

- Meridian Home Services Group operates a residential plumbing, HVAC, and electrical services platform across the US Southeast through a portfolio of local service brands.
- The transaction perimeter includes 14 operating branches across three legal entities and excludes a seller-owned call-center entity and two non-core real estate entities.

- The Group provides emergency repair, replacement, and maintenance services to residential customers, with additional revenue from equipment installation and membership plans.
- Revenue is generated through one-time service jobs, larger installation tickets, and recurring membership fees that support repeat demand and dispatch efficiency.
- Customer and channel detail is relevant only to the extent it explains monetization: digitally generated leads and outbound membership renewals drive a significant portion of booked work.

- Service-line mix includes:
- HVAC represented approximately 48% of FY2024 revenue, plumbing represented 31%, and electrical represented 21%; installation-heavy HVAC work carried the highest average ticket size.
- Membership plans represented approximately 18% of FY2024 revenue and supported recurring demand across all three service lines.
- As of December 31, 2024, the Group operated 14 branches, employed approximately 420 field technicians, and completed more than 190,000 service calls during the year.

- Branch-level operations are managed locally, while procurement, digital marketing, finance, and call routing are coordinated centrally by the corporate platform.
- The current model depends on centralized lead generation, shared dispatcher workflows, and a concentrated group of equipment suppliers, each of which affects branch productivity and service mix.

- Between FY2023 and FY2024, the Group completed six acquisitions and closed two underperforming locations, which increased route density in core markets and shifted revenue mix toward acquired HVAC operations.
- Management also introduced a unified financing program for larger installation jobs in FY2024, increasing conversion on higher-ticket replacement work.

- Historical branch results are not fully comparable across periods because marketing, dispatch, and certain corporate payroll costs were centralized and allocated after period-end.
- The excluded seller-owned call-center entity would require replacement or transitional support in a standalone post-close structure, even though lead-generation economics are embedded in historical branch performance.
```
