# Output Structure

This file defines what goes in each section of an FDD kickoff brief.

---

## Brief Header

**[Company Name] — FDD Kickoff Brief** | As of [Date] | [Industry] | [Geography]

---

## Core Sections

These sections appear in every brief.

### Company Overview

**Purpose:** Orient the reader on the company, its structure, and how it operates in 90 seconds.

**Format:** Prose bullets. Each bullet is 2-5 full sentences—no fragments.

**Must cover:**
- What they sell and who they sell to
- Corporate structure (holding company, subsidiaries, key entities)
- Revenue scale and recent growth

**Include if material:**
- Geographic footprint
- Key personnel and post-close retention
- M&A history and integration status
- Pricing model

**Style:** Write in complete sentences. Each bullet should read like a paragraph from a professional memo. Never use sentence fragments or label-value pairs.

**Example:**
```
## Company Overview

- The Company, headquartered in Quebec City, is the principal shareholder of a holding company that consolidates a group of insurance brokerage businesses. The group specializes in commercial and personal P&C and group benefits products, with 22 operations across five Canadian provinces.

- Historical growth has been achieved through bolt-on acquisitions and post-acquisition organic growth, including 14 acquisitions completed in FY22-FY24. Each brokerage operates mostly standalone, with certain support services provided by head office.

- The business is managed by Joint Managing Directors with oversight from a Non-Executive Director. Post-completion, only one current director will be retained for 12 months; the remaining directors and shareholders will exit.
```

---

### Industry Context

**Purpose:** Teach a generalist how the business works and provide benchmarks. THIS IS WHERE DEPTH MATTERS — allocate 1200-1500 words.

**REQUIRED subsections:**

1. **Business Model Mechanics** — How does the company make money, step by step? Explain the economics so a generalist could explain it to a colleague.

   Include an **illustrative P&L structure** showing typical line items and their nature:
   - Revenue lines (what drives each)
   - Cost of revenue / direct costs (what's included)
   - Operating expenses by category (sales, G&A, tech, etc.)
   - Where margins typically fall

   Pull this from MD&A disclosures, public comps, or industry knowledge. If the user provides financials, map the target's actual structure.

2. **Key Term Definitions** — Define industry-specific terms that a generalist wouldn't know. Format each as: **Term** — definition in plain language; implication for diligence or valuation.

3. **Key Benchmarks** — What are typical margins, growth rates, retention metrics for this business model? Cite sources.

4. **Competitive Landscape** — Who are the key competitors? Include named entities with scale, recent M&A, and how the target compares. Cover industry dynamics (what's driving consolidation, technology shifts, market trends).

**Depth Check:** If under 1200 words, you haven't researched deeply enough. A generalist should understand:
- How the company makes money (with key terms defined)
- What "good" looks like for this model
- Who competes and what's happening in the market
- The meaning of every industry term used in the brief

**Style:** All claims from web research must be cited.

**Example:**
```
## Industry Context

### Business Model Mechanics

Field service software generates revenue through per-user SaaS subscriptions, typically $30-150/user/month depending on market segment. The core value proposition is workflow automation: scheduling, dispatch, invoicing, and customer communication replace manual processes and reduce administrative overhead for service businesses [1].

Revenue quality depends on seat expansion within accounts. A plumbing company that starts with 5 technicians and grows to 15 represents 3x revenue without new customer acquisition cost. This "land and expand" dynamic drives the unit economics—CAC payback is typically 12-18 months, but lifetime value extends 5-7 years due to high switching costs (technician training, workflow customization, customer data migration) [2].

**Illustrative P&L Structure:**

| Line Item | Typical % of Revenue | Nature |
|-----------|---------------------|--------|
| Subscription Revenue | 85-95% | Recurring; recognized ratably over contract term |
| Services Revenue | 5-15% | Implementation, training; recognized as delivered |
| **Gross Profit** | **70-80%** | After hosting, support, third-party costs |
| Sales & Marketing | 25-40% | Largest OpEx; includes sales comp, demand gen |
| R&D | 15-25% | Product/engineering; some capitalized |
| G&A | 10-15% | Finance, HR, legal, facilities |
| **EBITDA Margin** | **10-25%** | Varies by growth stage and efficiency |

### Key Term Definitions

- **ARR (Annual Recurring Revenue)** — The annualized value of active subscriptions at a point in time; this is the primary metric for SaaS valuation, so understanding what's included (and excluded) determines enterprise value.
- **MRR (Monthly Recurring Revenue)** — ARR divided by 12; useful for tracking month-to-month changes and detecting growth deceleration before it shows in annual figures.
- **Net Revenue Retention (NRR)** — Revenue from a cohort after 12 months including expansion and churn; NRR >100% means the installed base grows without new logos, reducing dependence on sales execution.
- **Gross Revenue Retention (GRR)** — Same as NRR but excludes expansion; measures pure churn/contraction and reveals whether expansion is masking underlying customer attrition.
- **CAC (Customer Acquisition Cost)** — Fully-loaded cost to acquire a new customer (sales, marketing, onboarding); high CAC relative to customer value signals unsustainable growth economics.
- **CAC Payback** — Months required to recover CAC from gross profit on new ARR; payback >24 months in SMB SaaS suggests the sales motion may not be efficient enough for the market segment.
- **Logo churn** — Percentage of customers (not revenue) that cancel in a period; high logo churn even with stable NRR indicates concentration risk in the remaining base.

### Key Benchmarks

SMB-focused field service SaaS typically sees:
- **Gross margin:** 70-80% (hosting and support costs are primary COGS)
- **Gross revenue retention (GRR):** 85-95%
- **Net revenue retention (NRR):** 100-115% when expansion is healthy
- **Growth:** 20-40% YoY for scaled players; higher for emerging

NRR above 115% indicates strong expansion motion. Below 100% means the business shrinks without new logos. Companies serving trades (HVAC, plumbing, electrical) tend toward higher retention due to workflow lock-in [3][4].

### Competitive Landscape

The market is fragmented with consolidation underway:
- **Enterprise:** ServiceTitan dominates (~$500M+ revenue, $9.5B valuation, filed S-1 in 2024)
- **SMB:** Housecall Pro (acquired by ServiceTitan 2022), Jobber (~$100M ARR), FieldEdge
- **Vertical-specific:** Specialized players in HVAC, plumbing, electrical

Private equity has been active—Vista Equity bought FieldEdge, and ServiceTitan has acquired 5+ companies since 2020. The trend is toward platform consolidation as larger players add adjacent functionality (payments, financing, marketing) [5][6].

Pricing ranges from $30-80/user/month for SMB to $150+/user for enterprise. The target's $49-99 range positions it in SMB-to-mid-market, competing directly with Jobber and the remaining independents.
```

---

### Financial Summary

**Purpose:** Capture the financial "shape" and identify quality signals — don't just transcribe numbers.

**Include:**
1. **The numbers:** Key metrics from documents (table format). Default to showing **last two fiscal years plus YTD or LTM** when available. Single-period tables are acceptable only when historical data is not provided.
2. **Financial Trends:** How metrics changed over time (YoY, sequential). Calculate growth rates, identify underlying drivers, explain the business performance and reasons behind the trends, then connect to diligence implications. This should be a substantive analysis, not just bullet points.
3. **EBITDA adjustments:** List all add-backs from VDD or CIM with $ amounts. Do NOT use web sources for company-specific adjustments. **FALLBACK RULE:** If target-specific EBITDA adjustments are NOT available from VDD/CIM materials, you MUST include common adjustments for this industry from the relevant industry module.
4. **Common industry adjustments:** Typical EBITDA adjustments seen in M&A for this industry (from web research). Include even if VDD/CIM adjustments are available.
5. **Quality signals:** Recurring vs non-recurring revenue, organic vs acquired growth
6. **Diligence focus:** What this means for the QoE and diligence priorities

**Style:** Table for metrics, bullets for context. Note what's "stated" vs "unclear." If only one period of data, flag trend analysis as a data request.

**Example:**
```
## Financial Summary

| Metric | FY23 | FY24 | YTD Sep-25 | Source |
|--------|------|------|------------|--------|
| Revenue | $33M | $42M | $35M | VDD p.12 |
| Gross Margin | 77% | 78% | 79% | VDD p.14 |
| EBITDA | $5.5M | $8M | $7.2M | VDD p.16 |
| Revenue Growth | +18% | +28% | +25% (ann.) | VDD p.12 |

**Trends:** Revenue accelerated from +18% (FY23) to +28% (FY24), driven by pricing increases and new logo acquisition. YTD suggests slight deceleration to ~25% annualized—validate whether seasonality or demand softening. Gross margin stable at 77-79% over three years.

**EBITDA adjustments (per VDD):**
| Adjustment | Amount | Notes |
|------------|--------|-------|
| Founder compensation normalization | $650K | Two founders at above-market comp |
| One-time legal settlement | $400K | Patent dispute, settled Q2 |
| Non-recurring consulting fees | $150K | ERP implementation |
| **Total add-backs** | **$1.2M** | **15% of reported EBITDA** |

**Common industry adjustments (SaaS M&A):**
- Stock-based compensation — often added back; verify if cash-settled
- Capitalized software development — review policy vs peers; aggressive capitalization inflates EBITDA
- Customer acquisition costs — some buyers normalize CAC spend to steady-state levels
- Deferred revenue haircut — acquirer may need to write down deferred revenue at close [1]

**Quality signals:**
- ~85% of revenue is recurring (subscription); 15% is implementation/services
- Organic growth not disclosed separately from acquired growth — 2 tuck-ins in period

**Diligence focus:** Add-backs at 15% of EBITDA are within normal range but validate founder comp benchmark and confirm legal settlement is truly non-recurring. Request capitalized software detail to assess EBITDA quality.
```

---

### Key Findings

**Purpose:** Highlight the 3-5 most important takeaways for the deal team.

**Include:**
- Critical facts from documents
- Important context from research
- Red flags or concerns
- Positive signals
- Diligence considerations — what this means for the work ahead

**Style:** Numbered list with brief explanation of why each matters and what to do about it.

**Example:**
```
## Key Findings

1. **Strong revenue growth but retention unclear** — 28% YoY growth is solid, but NRR/churn not disclosed. Industry benchmarks suggest SMB SaaS typically sees 85-95% GRR; need to validate [1].

2. **Gross margin appears healthy but composition unknown** — 78% is reasonable for SaaS, but we don't know the split between hosting, support, and implementation. Support-heavy models often see margin pressure at scale.

3. **Customer concentration not disclosed** — No top customer data in CIM or VDD. Standard ask for P1 data request.

4. **Competitive market with larger players** — ServiceTitan (enterprise) and Housecall Pro (SMB) are established competitors. The target's positioning and differentiation need clarification [2].
```

---

### Accounting Policies (Adaptive — Include When Relevant)

**Purpose:** Document the target's significant accounting policies that affect earnings quality or require diligence scrutiny. Include when the industry has specific recognition, measurement, or estimation issues.

**When to include:**
- Revenue recognition is complex (multi-element, over time, variable consideration)
- Significant capitalization policies (software, commissions, contract costs)
- Material reserves or estimates (credit losses, claims, warranty)
- Industry-specific policies (percentage of completion, gain on sale, fair value marks)

**Format:**

1. **Use Subheaders:** Create a subheader for each major policy area (e.g., Revenue Recognition, Deferred Revenue, Capitalized Costs, Stock-Based Compensation, Reserves).

2. **Content Structure:** Write in full prose sentences. Each policy area should have 2-3 bullets:
   - **First:** Explain how the item is typically accounted for in this industry (the "normal" treatment)
   - **Then:** Explain what to test in diligence and what could go wrong
   - If actual financial statements with notes are available, use the target's actual policy; otherwise use an illustrative industry standard

**DO NOT:**
- Jump straight to "what to test" without first explaining the accounting treatment
- Use terse bullet points or sentence fragments
- Skip the "why it matters" context

**Example:**
```
## Accounting Policies

### Revenue Recognition

The Company recognizes subscription revenue ratably over the contract term, typically 12 months. Multi-year contracts are billed annually in advance, with the unbilled portion excluded from deferred revenue. Professional services revenue is recognized as services are performed, using a time-and-materials model for implementation and a fixed-fee model for training.

*Diligence implication:* Request contract sample to verify ratable recognition is appropriate (stand-ready obligation vs. distinct performance obligations). Confirm treatment of multi-year contracts in ARR and deferred revenue disclosures.

### Capitalized Software Development

The Company capitalizes internal-use software development costs incurred during the application development stage. Capitalized costs are amortized on a straight-line basis over the estimated useful life of 3 years. Total capitalized software was $2.1M in the TTM period, representing approximately 15% of R&D spend.

*Diligence implication:* Compare capitalization rate and amortization period to public SaaS peers (typical: 10-20% of R&D, 3-5 year life). Aggressive capitalization inflates EBITDA; request project-level detail and stage gate documentation.

### Capitalized Sales Commissions

Sales commissions are capitalized and amortized over the expected customer benefit period of 4 years. The Company uses the practical expedient for contracts with terms of 12 months or less. Amortization expense was $1.8M in the TTM period.

*Diligence implication:* A 4-year benefit period is at the high end of the range (typical: 2-4 years). Longer periods defer more cost and inflate current EBITDA. Request sensitivity analysis and comparison to actual customer life.
```

---

### Diligence Playbook

**Purpose:** Guide the deal team on what to test and how, anchored by the industry's value driver framework.

**Word Budget:** 1,200-1,600 words. This is the second-largest section after Industry Context. The expanded format requirements (full prose P&L walkthrough, detailed workstreams with execution guidance, ASCII value driver tree) require this budget to deliver actionable depth.

**Format:**
1. **Value Driver Framework** — Include the relevant value driver tree from the industry module as a text diagram. Annotate with available metrics and highlight key drivers / risk areas.
2. **P&L Walkthrough** (when financials provided) — Map the target's actual P&L to industry norms. Note unusual line items, classification questions, and where to probe.
3. **Workstream Details** — What to test, how, and what could go wrong.

---

#### VALUE DRIVER TREE FORMAT (MANDATORY)

The value driver tree MUST use ASCII text-diagram format inside a code block. This format is **REQUIRED** — do NOT use prose bullets, numbered lists, or bold headers for the tree structure.

**Correct format (REQUIRED):**
```
EBITDA
├── Revenue
│   ├── Sub-driver 1
│   │   ├── Detail A
│   │   └── Detail B
│   └── Sub-driver 2
├── COGS
│   └── Cost driver
└── OpEx
    └── Expense driver
```

**Incorrect formats (DO NOT USE):**
- Prose bullets: "**Revenue** • Sub-driver 1 • Sub-driver 2"
- Numbered lists: "1. Revenue → a. Sub-driver 1"
- Bold headers with indented bullets

Keep the diagram clean and structural. Use `[KEY]` and `[RISK]` annotations sparingly for critical items. Detailed risk commentary and diligence focus areas belong in the P&L walkthrough or workstreams sections, NOT cluttering the tree itself.

---

#### P&L WALKTHROUGH STRUCTURE

**Header Format:** Use the exact caption from the target's income statement (e.g., "Net Commissions and Fees," "Employee Compensation and Benefits," "Subscription Revenue"). Do NOT use generic headers like "Revenue" when the target uses specific line item names.

**Content Format:** Write in full prose sentences. Each P&L line item should have 2-3 complete sentences covering:
1. **What the item is** — Explain the nature of the line item and what it represents for this business
2. **How to decompose it for diligence** — What sub-components or drivers should be analyzed
3. **Why it matters** — Diligence implications, risks, or normalization considerations

**DO NOT USE:**
- Label-value pairs (e.g., "**Mix:** 85% subscription, 15% services")
- Sentence fragments
- Terse bullet points without explanation

**Example (correct format):**
```
#### Net Commissions and Fees

- This is the core operating revenue line for an insurance brokerage, representing fees earned from placing policies with carriers on behalf of clients. It includes both base commissions (paid at policy inception or renewal) and contingent commissions (profit-sharing arrangements with carriers based on book performance, loss ratios, and volume).

- For diligence, split this line into base versus contingent commissions, then further decompose by new business versus renewal, by channel (retail versus wholesale), and by line of business. Contingent commissions typically represent 5-15% of total commissions for mid-market brokers but can vary significantly based on carrier relationships and loss experience.

- Base commissions are highly predictable and recurring since they renew with the underlying policies. Contingent commissions are more volatile because they depend on loss ratios and carrier profitability, so QoE should consider normalizing these over a 3-5 year period rather than using a single year.
```

---

#### WORKSTREAM STRUCTURE (EXPANDED)

Each workstream must provide actionable depth — do NOT simply list bullet points or data request items. Write in full prose sentences covering:

1. **Relevance** — Why this area matters for understanding the business performance and normalized earnings
2. **Key Analyses** — What specific analyses to perform and what data is needed
3. **Execution Guidance** — How to actually do the work and what to look for

**Note:** This expanded structure should make workstreams more actionable without significantly increasing overall brief length. The goal is depth per workstream, not more workstreams.

**Example (correct format):**
```
#### Revenue & Bookings Quality

- Understanding revenue quality is critical because SaaS valuation multiples depend on recurring, sustainable ARR. If the company's ARR definition includes one-time revenue or services, or if bookings are deteriorating while reported revenue grows, the underlying business may be weaker than headline metrics suggest.

- The primary analysis is building an ARR bridge that decomposes movement into new logos, expansion, contraction, and churn. This requires monthly ARR by customer with flags for each movement type, ideally going back 36 months. The bridge reveals whether growth is sustainable (driven by new logos and healthy expansion) or fragile (dependent on a few large wins or masking elevated churn).

- Cohort retention analysis separates product stickiness from expansion effects. Calculate gross revenue retention by cohort to see the true churn rate before expansion offsets it, then calculate net revenue retention to see the combined effect. Typical SMB SaaS benchmarks are 85-95% GRR and 100-115% NRR; significant deviation warrants investigation.

- Key red flags include NRR propped up by price increases rather than genuine expansion, bookings declining while recognized revenue grows (suggesting deferred revenue is being drawn down), and deferred revenue shrinking quarter over quarter despite stated ARR growth.
```

---

#### DILIGENCE PLAYBOOK INTRODUCTION

The Diligence Playbook section MUST begin with a brief introduction (2-3 sentences) explaining:
- What the playbook provides (a structured framework for financial analysis tailored to this industry)
- How to use it (prioritized workstreams with execution guidance)

**Example:**
```
## Diligence Playbook

This playbook provides a structured framework for analyzing [Company]'s financial performance and earnings quality, anchored by the key value drivers for [industry] businesses. Use the value driver tree to orient the analysis, then work through the prioritized workstreams with the execution guidance provided.
```

---

**Example:**
```
## Diligence Playbook

### Value Driver Framework
EBITDA
├── Net Revenue
│   ├── Subscription Revenue ($42M ARR) [KEY]
│   │   ├── + New ARR [KEY - growth sustainability]
│   │   ├── + Expansion ARR [KEY - NRR driver]
│   │   └── - Churned ARR [RISK - not disclosed]
│   └── Services Revenue (~$3M)
├── COGS
│   ├── Hosting [RISK - margin composition unknown]
│   └── Support
└── OpEx (detail not disclosed)

### P&L Walkthrough (Target vs. Industry)

| Line Item | Target | Industry Norm | Note |
|-----------|--------|---------------|------|
| Subscription Revenue | 82% | 85-95% | Services mix higher than typical |
| Gross Margin | 78% | 70-80% | In range; validate COGS classification |
| S&M % of Revenue | 45% | 25-40% | Above range — CAC efficiency concern |
| R&D % of Revenue | 18% | 15-25% | In range |
| G&A % of Revenue | 8% | 10-15% | Below range — may be under-invested or misclassified |
| EBITDA Margin | 7% | 10-25% | Below; driven by S&M investment |

**Classification questions:**
- Is Customer Success in COGS (support) or OpEx (S&M)?
- What's capitalized in R&D vs. expensed?
- Are founder salaries in G&A or below EBITDA?

### Revenue Durability
- **What to test:** Is 28% growth sustainable, or is it masking churn through price increases?
- **How:** Request monthly ARR by customer (36 mo) with expansion/churn flags. Build cohort retention curves and compute NRR excluding price actions. Compare to SMB SaaS benchmarks (85-95% GRR, 100-110% NRR).
- **Risk:** If NRR <100% or GRR <85%, the business shrinks without aggressive new logo acquisition — changes growth capex assumptions and valuation.

### Gross Margin Composition
- **What to test:** Is 78% gross margin real, or is it inflated by cost classification?
- **How:** Request COGS detail by category (hosting, support, third-party, PS delivery) for 24 months. Benchmark hosting cost per $1 ARR against public SaaS (~15-20%). Check if customer success is in COGS or OpEx.
- **Risk:** If support costs are misclassified to OpEx, true gross margin may be 70-72% — impacts scalability thesis and EBITDA quality.

### Customer Concentration
- **What to test:** Is revenue diversified or dependent on a few large accounts?
- **How:** Request top 20 customers with ARR and renewal dates. Calculate top 10 concentration ratio and identify any renewal cliffs in the next 12 months.
- **Risk:** Top 10 customers >25% of ARR in SMB SaaS signals elevated churn risk — losing 2-3 large accounts could materially impact growth trajectory.
```

---

### Data Requests

**Purpose:** Provide a ready-to-send list of data asks.

**Format:** Single table with Priority column (High / Medium / Low).

**Length Constraint:** Keep Data Requests to **150-200 words maximum**. This section should be a concise, actionable list — NOT an exhaustive catalog. Focus on the highest-priority requests that directly test the key value drivers and risks identified in the Diligence Playbook. Do NOT expand this section beyond the word limit.

**Example:**
```
## Data Requests

| Priority | Request | Period | Format | Rationale |
|----------|---------|--------|--------|-----------|
| High | Monthly ARR by customer with expansion/churn flags | 36 months | Excel/CSV | ARR bridge, cohort retention, concentration |
| High | COGS breakdown (hosting, support, third-party, PS) | 24 months | Excel | Gross margin composition |
| High | Top 20 customers with ARR and renewal dates | Current | Excel | Concentration and renewal cliff |
| Medium | Bookings vs billings vs revenue bridge | 12 months | Monthly | Forward momentum |
| Medium | Discount rates by deal type | 12 months | By customer | Pricing discipline |
| Low | Pipeline export with stage history | 24 months | CRM export | Growth sustainability |
```

---

### Sources

**Purpose:** List all web citations.

**Format:** Numbered list matching in-text citations.

**Example:**
```
## Sources

[1] SaaS Capital, "2024 Private SaaS Company Survey," November 2024.
[2] KeyBanc Capital Markets, "2024 SaaS Survey," December 2024.
[3] G2 Grid Report, "Field Service Management Software," Q4 2024.
[4] ServiceTitan S-1 Filing, SEC EDGAR, November 2024.
```

---

## Document Extraction Guide

Apply these rules to all deal documents (CIMs, VDD reports, financial statements, management presentations). Extract what matters for FDD; skip marketing content.

### ALWAYS EXTRACT (Critical for FDD):
- **Revenue by segment** — product/service line, geography, customer type breakdown
- **Customer data** — count, top 10/20 concentration, average deal size, retention metrics stated
- **Contract terms** — length, auto-renewal, termination clauses, pricing escalators
- **Margin detail** — gross margin, EBITDA margin, by segment if available
- **Every add-back with $ amount** — these are QoE starting points, often overstated
- **Organic vs acquired growth** — decomposition methodology, roll-in periods
- **Cost structure** — COGS breakdown, OpEx by category, headcount by function
- **Working capital** — DSO/DIO/DPO if stated, seasonality, cash conversion
- **Ownership** — current sponsors, prior transactions, management equity %
- **Related party transactions** — even if described as "immaterial"
- **M&A history** — deals done, earnouts outstanding, integration status
- **Key personnel** — tenure, compensation arrangements, key-man risk
- **Capex** — maintenance vs growth, recent investments, deferred items
- **Legal matters** — litigation mentioned, material disputes

### EXTRACT BUT FLAG (Verify in Diligence):
- **Management projections** → Note they exist, flag for reasonableness testing
- **EBITDA add-backs** → List each one with $ amount; these need validation
- **"Recurring revenue" claims** → Ask for definition and cohort data
- **Stated growth rates** → Verify whether organic, acquired, or blended
