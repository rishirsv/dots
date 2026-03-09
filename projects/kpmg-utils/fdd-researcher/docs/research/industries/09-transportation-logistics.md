# Industry Module Development Prompt

## Context

We're building a research assistant that helps Financial Due Diligence (FDD) teams prepare kickoff briefs before a deal's data room opens. The tool takes sparse initial documents (CIM, teaser, VDD excerpt, limited financials) and produces a structured brief that:

1. Extracts what's known from the documents
2. Identifies gaps and converts them to data requests / management questions
3. Adds industry context from web research (benchmarks, mechanics, comps)

The assistant uses **industry modules** to adapt its output based on the type of company being analyzed. Each module teaches the assistant what KPIs matter, what red flags to look for, what to ask for, and what to research.

**Your role:** Help us build the module for **Transportation & Logistics (Freight, Last-Mile, 3PL)** by answering the questions below based on your experience in this space.

---

## Part 1: Industry Identification

When an FDD team uploads deal documents, the assistant needs to recognize what industry it's looking at.

**Question 1:** What words, phrases, or concepts in deal documents signal that a company operates in this industry?

Think about:
- Business model language (how they describe what they do)
- KPI terminology (metrics they report)
- Customer/transaction descriptions
- Revenue model indicators

*Example for SaaS: "ARR", "MRR", "net revenue retention", "per seat pricing", "subscription", "churn", "cohort"*

**Your answer:**

---

## Part 2: Units That Matter

Every industry has its own "units" that drive the business. A generalist associate doing their first deal in this space needs to quickly understand what numbers actually matter.

**Question 2:** What are the 5-8 KPIs that a generalist must understand to not embarrass themselves on this deal?

For each KPI, provide:
- The metric name (and common abbreviations)
- A plain-language definition (how practitioners actually use it, not textbook)
- Why it matters for diligence (what it tells you about the business)

*Example:*
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Net Revenue Retention (NRR) | Revenue from a cohort after 12 months, including expansion and churn, divided by starting revenue | Shows whether existing customers grow or shrink over time; >100% means growth without new sales |

**Your answer:**

---

## Part 3: Value Driver Framework

Value driver trees are visual representations of the financial and operational levers that impact a company's performance. They help focus diligence on what matters and identify value creation opportunities.

**Question 3:** What does the EBITDA value driver tree look like for this industry?

Map the key drivers from EBITDA down to the underlying operational metrics. For each branch, identify:

**Revenue Drivers:**
- How is revenue decomposed? (e.g., # customers × revenue per customer, # transactions × avg transaction value, # units × price per unit)
- What are the volume drivers vs. price drivers?
- What is the gross-to-net revenue bridge? (discounts, returns, allowances, rebates)
- What mix effects matter? (product mix, channel mix, customer mix, geography mix)

**Cost Drivers:**
- What are the major cost categories and how do they break down?
- For each major cost line: what drives it at a unit level?
- What is headcount-driven vs. non-headcount?
- What is controllable vs. non-controllable?

*Example format:*
```
EBITDA
├── Net Revenue
│   ├── Gross Revenue
│   │   ├── # of Customers × Revenue per Customer
│   │   └── [or] # Transactions × Avg Transaction Value
│   └── Gross-to-Net Adjustments
│       ├── Discounts/Promotions
│       ├── Returns/Refunds
│       └── Rebates/Allowances
├── COGS
│   ├── [Cost component 1]
│   └── [Cost component 2]
└── OpEx
    ├── [Category 1]
    └── [Category 2]
```

**Your answer:**

---

**Question 4:** What is the full cost structure and what drives margins?

Provide a complete view of the P&L so an associate understands how the business operates on a unit basis.

**Gross Margin / COGS:**
- What's in COGS? What's the typical range?
- What drives cost per unit?
- What makes gross margin move?

**Operating Expenses (Full Breakdown):**
- What are the major OpEx categories?
- For each category: What drives it? What's typical as % of revenue?
- What's fixed vs. variable?
- What's controllable vs. non-controllable?
- What's headcount vs. non-headcount?
- What's corporate/central vs. operational/site-level?

**Unit Economics:**
- What does profitability look like at the unit level (per store, per customer, per transaction, per project)?
- What are the key leverage points?

**Margin Differentiation:**
- What separates a high-margin operator from a low-margin one?
- What are the typical margin ranges in this industry?



**Your answer:**

---

**Question 5:** What does the Working Capital value driver tree look like?

Map the operating working capital components and their drivers:

**Receivables:**
- What drives DSO? What's typical?
- Any billing/collection timing nuances?

**Inventory (if applicable):**
- What are the inventory categories? (raw materials, WIP, finished goods)
- What drives DIO? What's optimal vs. problematic?
- Any obsolescence or slow-moving inventory risks?

**Payables:**
- What drives DPO? What's typical?
- Any supplier concentration or payment term dynamics?

**Other Working Capital Items:**
- What prepaid/accrual items are significant?
- Any industry-specific items? (deferred revenue, deposits, retention, gift cards, etc.)

**Cash Conversion:**
- What's the typical cash conversion cycle?
- Seasonality or lumpiness patterns?
- Any industry-specific cash traps?

**Your answer:**

---

**Question 6:** What does Capex look like in this industry?

Map the capital expenditure categories and drivers:

**Growth Capex:**
- What investments drive growth? (new locations, capacity expansion, new markets)
- Typical cost to open a new [unit/location/etc.]?
- Ramp-up period to maturity?

**Maintenance Capex:**
- What recurring investments are required?
- Typical maintenance capex as % of revenue?

**Technology/Digital Capex:**
- What technology investments are typical?
- Any major system implementations to watch for?

**Your answer:**

---

## Part 4: Common Analysis & Analysis Roadmap

Every industry has standard analytical frameworks. At kickoff, we can't run these yet—but we need to know what to build once data arrives.

**Question 7:** What are the standard analyses performed in this industry?

For each analysis type, explain:
- What it is and how it's structured
- What it tells you about the business
- What "good" vs. "concerning" looks like

Consider:
- **Revenue analysis:** (e.g., revenue waterfall/bridge, organic vs. inorganic growth, price/volume decomposition, cohort analysis, like-for-like analysis)
- **Customer/portfolio analysis:** (e.g., customer concentration, churn analysis, vintage analysis, top 10/bottom 10, new vs. existing)
- **Unit/location analysis:** (e.g., store maturity curves, ramp-up analysis, same-store sales, profitability by unit)
- **Product/SKU analysis:** (e.g., margin by SKU, product lifecycle, SKU rationalization)
- **Operational analysis:** (e.g., utilization, capacity, productivity metrics)
- **Trend analysis:** (e.g., margin bridges, cost walks, YoY/MoM trends)

*Example:*
| Analysis | What It Shows | Good vs. Concerning |
|----------|---------------|---------------------|
| Store maturity curve | How long new locations take to reach steady-state profitability | 6-month ramp is healthy; 18+ months suggests market fit issues |

**Your answer:**

---

**Question 7b:** What data unlocks each analysis?

For each critical analysis, specify what data to request:

| Analysis | Data Required | Request Wording | Priority |
|----------|---------------|-----------------|----------|
| *Revenue bridge* | Monthly revenue by customer, product, channel | "Monthly revenue by customer and product line, trailing 24 months" | P1 |
| *Like-for-like* | Store-level revenue with open/close dates | "Revenue by location with opening dates and closures" | P1 |

**Your answer:**

---

## Part 5: Red Flags

You've seen deals go sideways. Help us spot trouble early—even from sparse kickoff documents.

**Question 8:** What are the 8-10 red flags you look for in this industry?

For each red flag:
- What it looks like **in initial documents** (CIM/VDD)
- What it looks like **in the data room**
- Why it's a problem
- How to investigate

*Example:*
| Red Flag | Early Signal (CIM/VDD) | Data Room Signal | Why It's a Problem | How to Investigate |
|----------|------------------------|------------------|--------------------|--------------------|
| NRR propped by price | "Strategic pricing initiatives" + flat customer counts | Cohort shows logo churn masked by ARPU growth | Growth isn't real; may reverse | Request cohort NRR excluding price; ask about pricing sustainability |

**Your answer:**

---

**Question 8b:** What CIM language should trigger concern?

Specific phrases that experienced practitioners recognize as warning signs:

| Phrase in CIM | What It Signals | Follow-up |
|---------------|-----------------|-----------|
| "Normalized EBITDA excludes..." | Aggressive add-backs | Request adjustment bridge with support |
| "Strategic investments in growth" | Costs understated; not run-rate | Ask for run-rate OpEx post-investment |
| "Diversified customer base" (no data) | May have concentration | Request top 10 customer revenue |

**Your answer:**

---

## Part 6: First Data Requests

You can send one data request before the data room opens. What do you ask for?

**Question 9:** What are your standard first-round data requests for this industry?

For each: what specifically, what period, what granularity, what format, and why.

- **P1 (Critical):** Must have to form any view
- **P2 (Important):** Want in the first room batch

**Your answer:**

---

## Part 7: Management Questions

You have 30 minutes with the CFO at kickoff. What do you ask?

**Question 10:** What are your first 10 questions for management?

For each: the question, what you're really trying to learn, and what answer would concern you.

**Your answer:**

---

## Part 8: External Research

The assistant searches the web for industry context. What should it look for?

**Question 11:** What external research is most valuable?

- Benchmark sources
- Regulatory/compliance context
- Competitor intelligence
- Industry mechanics
- Recent trends

**Your answer:**

---

## Part 9: Accounting & Recognition

Every industry has its accounting quirks and judgment areas. What should we scrutinize?

**Question 12:** What are the industry-specific accounting and revenue recognition issues?

**Revenue Recognition:**
- When does revenue hit the P&L? What triggers recognition?
- What's normal vs. aggressive in this industry?
- Any multi-element arrangements or bundled services?
- Cut-off issues to watch for?
- Deferred revenue considerations?

**Cost Recognition & Capitalization:**
- What costs get capitalized? What's normal vs. aggressive?
- Any significant estimates in COGS? (e.g., cost-to-complete, inventory valuation)
- Commission or contract cost capitalization?

**Balance Sheet Estimates & Reserves:**
- What reserves should exist? (bad debt, warranty, returns, inventory obsolescence, etc.)
- Any significant accruals or provisions?
- What judgment areas affect the balance sheet?

**Cash vs. Accrual Considerations:**
- Is there a gap between cash and accrual accounting? (common in healthcare, construction, etc.)
- Any billing vs. revenue timing differences?

**Comparability Issues:**
- What makes it hard to compare companies in this space?
- Common accounting policy differences?
- Any industry-specific accounting standards to know?

**Your answer:**

---

**Question 12b:** What is the QoE adjustment watchlist for this industry?

List typical adjustments so the team knows what to look for:

**Due Diligence Adjustments** (non-recurring / non-operating):

| Category | What to Look For | Direction | Why It Matters |
|----------|------------------|-----------|----------------|
| *Management fees* | Related party fees above market | Add-back (+) | Won't continue post-deal |

**Pro Forma Adjustments** (run-rate normalization):

| Category | What to Look For | Direction | Why It Matters |
|----------|------------------|-----------|----------------|
| *New customer run-rate* | Customers added mid-period | Increase (+) | Full-year impact |

**IFRS/GAAP Adjustments** (accounting policy):

| Category | What to Look For | Direction | Why It Matters |
|----------|------------------|-----------|----------------|
| *IFRS 16 leases* | Operating leases not capitalized | Varies | EBITDA comparability |

**Your answer:**

---

## Part 10: Value Creation Opportunities

Beyond risk mitigation, FDD should identify value creation potential.

**Question 13:** What are the typical value creation opportunities in this industry?

For each opportunity, explain:
- What the lever is
- How it would be identified in diligence
- Typical magnitude of impact

Consider:
- **Revenue levers:** (pricing optimization, mix improvement, channel expansion, customer acquisition)
- **Cost levers:** (procurement/sourcing, operational efficiency, headcount optimization, facility rationalization)
- **Working capital levers:** (inventory optimization, payment terms, collections)
- **Synergy areas:** (for bolt-on acquisitions—what synergies are typically available?)

*Example:*
| Opportunity | How to Identify | Typical Impact |
|-------------|-----------------|----------------|
| Procurement optimization | Benchmark material costs vs. peers; fragmented supplier base | 3-8% of addressable spend |

**Your answer:**

---

## Part 11: Ownership & Related Party Patterns

Many deals involve family-owned businesses, carve-outs, or complex structures with specific risks.

**Question 14:** What ownership and related party patterns are common in this industry?

**Ownership Structures:**
- What types are typical? (family-owned, PE-backed, founder-led, carve-out)
- What risks does each create?
- What signals ownership risk in a CIM?

**Related Party Transactions:**
- What RPTs are common?
- What's normal vs. concerning?
- What needs normalization post-transaction?

*Example:*
| RPT Type | What It Looks Like | Risk | CIM Signal |
|----------|-------------------|------|------------|
| Management fees | Fees to holdco/owners | Above market; won't continue | "Management fee" in cost structure |
| Shared services | IT/HR/finance from parent | Need to stand up or TSA | "Allocated costs" |
| Property rental | Lease from affiliated entity | Off-market rent | Related party in real estate note |

**Your answer:**

---

## Part 12: Anything Else

**Question 15:** What else should an FDD team know about this industry that we haven't asked about?

Consider:
- Common misconceptions generalists have
- Non-obvious dynamics that matter
- Things that trip up first-time practitioners
- Industry-specific terminology to master
- Key external factors that impact performance (macro, regulatory, seasonal)

**Your answer:**

---

## How This Will Be Used

Your answers become an industry module that teaches the research assistant to:

**From sparse kickoff documents (CIM/VDD):**
- Recognize this industry from business model language and KPIs
- Surface red flags visible in initial documents
- Flag accounting and related party risks
- Produce targeted data requests that unlock key analyses
- Prepare management questions tied to industry-specific risks
- Generate a value driver diagram (PowerPoint)

**Provide context for:**
- KPI definitions ("units that matter")
- Value driver trees (EBITDA, Working Capital, Capex)
- QoE adjustment watchlists
- Benchmark ranges and industry mechanics
- Value creation opportunities

The assistant works from limited documents and web research—it prepares the team to hit the ground running when the data room opens.

Thank you for your expertise.
