# FDD Researcher — Implementation Plan v2

**Version:** 2.2
**Date:** 2026-01-07
**Status:** Ready to Execute

---

## What We're Building

**FDD Researcher** is a ChatGPT Custom GPT that helps Financial Due Diligence teams prepare kickoff briefs before a deal's data room opens.

Given sparse initial documents (CIM, teaser, VDD excerpt, limited financials), it:
1. Extracts what's known from the documents
2. Identifies gaps and converts them to data requests / management questions
3. Adds industry context from web research (benchmarks, mechanics, comps)
4. Generates Value Driver Diagrams (PowerPoint) for proposals and reports

---

## Workflow

### Step 1: Quick Intake (Immediate)

When the user uploads documents, the GPT immediately:

1. **Reads all uploaded files**
2. **Produces a document summary table** — concise description of each file and what it contains
3. **Asks 2-4 clarifying questions** — to fill in key context before planning

This step should be fast. No deep analysis yet.

**Example output:**

```
## Documents Reviewed

| Document | Summary |
|----------|---------|
| acme-cim.pdf | 45-page CIM covering FY24; includes business overview, financials, customer metrics |
| pricing-screenshot.png | Pricing page showing $49-99/seat/month tiers |
| vdd-excerpt.pdf | 12-page VDD excerpt with KPI table and margin analysis |

## Quick Questions

Before I build your research plan, a few questions:

1. **Target:** Is the target company "Acme Software Inc." as referenced in the CIM, or a different entity?
2. **Industry:** The documents suggest this is a SaaS business (per-seat pricing, ARR metrics). Should I apply SaaS industry context, or is this a different model?
3. **Geography:** The CIM mentions US operations—is this primarily a US business?
4. **Timing:** What date should this brief be "as of"? (default: today)
```

---

### Step 2: Research Plan (After User Answers)

Once the user answers the clarifying questions, the GPT produces:

1. **Research summary** — What we know from the docs, what's missing
2. **Research questions** — Specific questions to answer via web research
3. **Research plan** — Tasks, sources to search, expected outputs

This is the **approval gate**. The user reviews the plan and says "go" to proceed.

**Example output:**

```
## Research Summary

**What we know (from docs):**
- Acme is a SMB SaaS company selling workflow software to field service businesses
- TTM Revenue: $42M (+28% YoY); Gross Margin: ~78%
- ~2,500 customer logos; per-seat pricing ($49-99/user/month)
- Annual contracts with monthly billing option

**Key gaps:**
- Churn/retention metrics not disclosed
- Customer concentration unknown
- Discount practices not described
- Gross margin composition unclear

## Research Questions

1. What are typical retention benchmarks (NRR, GRR, logo churn) for SMB field service SaaS?
2. What gross margin ranges are normal for SaaS with significant support costs?
3. Who are the main competitors in field service SaaS, and how do they price?
4. What are common accounting/rev rec issues in SaaS diligence?

## Research Plan

| Task | What I'll Search | Expected Output |
|------|------------------|-----------------|
| SaaS retention benchmarks | SaaS Capital survey, KeyBanc report, OpenView benchmarks | NRR/GRR ranges by segment |
| Margin benchmarks | Public SaaS filings, analyst reports | Gross margin ranges, COGS composition norms |
| Competitive landscape | G2/Capterra, competitor websites, industry coverage | Top 5 competitors, pricing comparison |
| Accounting context | ASC 606 guidance, Big 4 publications | Rev rec and capitalization watch-outs |

**Say "go" to proceed with research, or let me know if you'd like to adjust the plan.**
```

---

### Step 3: Execution (After User Says "Go")

Once approved, the GPT:

1. **Runs web research** — Multiple searches, iterating until sufficient coverage
2. **Synthesizes findings** — Integrates doc-grounded facts with web research
3. **Produces the final brief** — Structured output with citations
4. **Generates Value Driver Diagram** — PowerPoint file (if requested or appropriate)

---

## Output Structure

The final brief has **fixed core sections** with some **adaptive sections** based on context.

### Core Sections (Always Present)

1. **Company Overview** — What they do, who they serve, how they charge
2. **Financial Summary** — Revenue, margins, growth (from docs)
3. **Key Findings** — Most important takeaways, both from docs and research
4. **Gaps & Unknowns** — What we don't know, converted to action items
5. **Industry Context** — Benchmarks, mechanics, competitive landscape (from web)
6. **Diligence Playbook** — What to test, what to request, what to ask
7. **Data Requests** — Prioritized list (P1/P2) with rationale
8. **Management Questions** — Prepared questions for kickoff calls
9. **Sources** — Citations for web-derived claims

### Adaptive Sections (When Relevant)

- **Accounting Watch-Outs** — Industry-specific recognition and policy issues
- **Regulatory Context** — When regulations materially affect the business
- **Competitive Deep-Dive** — When competitive dynamics are a key diligence angle
- **Value Driver Diagram** — PowerPoint export (on request or auto-generated)

---

## Source Attribution

Rather than formal labels, the GPT naturally distinguishes sources:

- **From the documents:** "The CIM shows revenue of $42M..." or "According to the VDD..."
- **From web research:** Include citations at end of paragraph [1][2]
- **Unknown:** "Not disclosed in the provided documents—recommend requesting..."

Citations appear at end of paragraphs, not inside tables. Sources section at the end.

---

## Custom GPT Knowledge File Architecture

### How Custom GPT Knowledge Retrieval Works

Based on research into OpenAI's Custom GPT implementation:

1. **File Limits**: Up to 20 files per GPT, each up to 512MB / 2M tokens
2. **Retrieval Method**: Files are chunked, embedded into vectors, and stored in a semantic index
3. **Search**: When user asks a question, GPT converts it to a vector and retrieves the most relevant chunks
4. **Context Window**: Only ~110k tokens can be retrieved per pass—the system works with subsets
5. **Format**: Plain text (.txt) and Markdown (.md) work best; simple formatting preferred

**Key Insights:**
- Single consolidated files tend to perform better than many small files
- Semantic search finds conceptually similar content, not just keyword matches
- Clear section headers help the retrieval system find the right content
- The GPT doesn't "read" all files—it retrieves relevant chunks on demand

Sources:
- [Knowledge in GPTs | OpenAI Help Center](https://help.openai.com/en/articles/8843948-knowledge-in-gpts)
- [Retrieval Augmented Generation (RAG) and Semantic Search for GPTs](https://help.openai.com/en/articles/8868588-retrieval-augmented-generation-rag-and-semantic-search-for-gpts)
- [OpenAI Developer Community Discussions](https://community.openai.com/t/how-does-the-knowledge-of-custom-gpt-actually-work/517882)

---

## Industry Modules: Current State and Options

### Module Inventory

All 10 industry modules are complete:

| Module | File | Size |
|--------|------|------|
| Technology / SaaS | `module-technology-saas.md` | 60KB |
| Banking & Lending | `module-banking-lending.md` | 53KB |
| Transportation & Logistics | `module-transportation-logistics.md` | 54KB |
| Insurance | `module-insurance.md` | 58KB |
| Real Estate & Construction | `module-real-estate-construction.md` | 63KB |
| Business Services | `module-business-services.md` | 62KB |
| Healthcare Services | `module-healthcare-services.md` | 54KB |
| Retail / Consumer | `module-retail-consumer.md` | 62KB |
| Industrial Manufacturing | `module-industrial-manufacturing.md` | 60KB |
| Asset Management | `module-asset-management.md` | 52KB |

**Total: ~578KB across 10 files**

### Knowledge File Strategy (Option D)

**Approach:** Module selection via system prompt + consolidated knowledge file.

```
/dist/
  system-prompt.txt (with industry inference logic)
  k
  \nowledge/
    industry-modules-complete.md (~200KB compressed)
    research-guidance.md
    output-structure.md
```

**How it works:**
1. System prompt contains inference rules (trigger keywords → module name)
2. GPT identifies industry from document signals
3. System prompt tells GPT: "Use the [Industry] module"
4. GPT searches knowledge file for `# Module: [Industry Name]` header
5. Clear headers make semantic search reliable

**Why this approach:**
- Custom GPT retrieval works best with fewer, well-structured files
- Single consolidated file = consistent semantic indexing
- Uses only 3 file slots (leaves room for future features)
- System prompt guides selection, reducing retrieval randomness

### Industry Inference Table (for System Prompt)

| Signals | Module |
|---------|--------|
| ARR, MRR, NRR, churn, per-seat, subscription | Technology / SaaS |
| NIM, deposits, loan portfolio, NCOs, originations | Banking & Lending |
| Combined ratio, loss reserves, premium, claims | Insurance |
| Loads, lanes, OR, freight, warehouse, fleet | Transportation & Logistics |
| NOI, occupancy, rent roll, WIP, POC | Real Estate & Construction |
| Utilization, bill rate, headcount, project hours | Business Services |
| Visits, wRVUs, payor mix, NPSR, reimbursement | Healthcare Services |
| Same-store sales, comps, AOV, basket, turns | Retail / Consumer |
| OEE, throughput, BOM, backlog, book-to-bill | Industrial Manufacturing |
| AUM, net flows, fee rate, carry, management fee | Asset Management |

---

## Industry Modules Complete: Template Design

### Design Principles

The consolidated `industry-modules-complete.md` file must be:

1. **Retrieval-optimized** — Clear headers that semantic search can find
2. **Consistent** — Same structure across all modules for predictable behavior
3. **Dense** — Maximum information per token (no fluff)
4. **Scannable** — GPT can quickly extract what it needs without reading everything

### Template Structure

```markdown
# Industry Modules for FDD Research

This file contains industry-specific guidance for FDD kickoff briefs. Each module follows the same structure.

## Module Index
- [Module: Technology / SaaS](#module-technology--saas)
- [Module: Banking & Lending](#module-banking--lending)
- [Module: Insurance](#module-insurance)
- [Module: Transportation & Logistics](#module-transportation--logistics)
- [Module: Real Estate & Construction](#module-real-estate--construction)
- [Module: Business Services](#module-business-services)

---

# Module: Technology / SaaS

## Triggers
<!-- Keywords that identify this industry in documents -->
ARR, MRR, NRR, GRR, churn, seats, logos, subscription, per-seat, per-user, SaaS, cloud, recurring revenue, cohort, CAC, LTV, payback, bookings, billings, RPO, deferred revenue

## KPIs That Matter

| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| ARR | Annualized value of active subscriptions | Core value driver; basis for retention metrics |
| NRR | (Start ARR + expansion - contraction - churn) / Start ARR | Shows if base compounds without new sales |
| GRR | (Start ARR - contraction - churn) / Start ARR | Pure retention without expansion |
| Logo Churn | Customers lost / customers at start | Customer-level retention |
| CAC Payback | CAC / (ARR per logo × GM) | Sales efficiency |
| Gross Margin | (Revenue - COGS) / Revenue | Platform economics |

## Value Driver Trees

### EBITDA Tree
```
EBITDA
├── Revenue
│   ├── ARR
│   │   ├── Beginning ARR
│   │   ├── + New Business
│   │   ├── + Expansion
│   │   ├── - Contraction
│   │   └── - Churn
│   └── Non-Recurring (Services, One-time)
├── COGS
│   ├── Hosting / Infrastructure
│   ├── Customer Support
│   └── Implementation (if in COGS)
└── OpEx
    ├── S&M (CAC components)
    ├── R&D (Engineering, Product)
    └── G&A
```

### Working Capital Tree
```
NWC
├── Receivables (DSO)
│   ├── Billing terms (annual vs monthly)
│   └── Collection efficiency
├── Deferred Revenue (negative WC)
│   ├── Prepaid annual contracts
│   └── Multi-year deals
└── Payables (DPO)
    └── Vendor terms
```

### Capex Tree
```
Capex
├── Capitalized Software Development
│   ├── Internal-use software
│   └── Platform enhancements
└── Other (minimal for pure SaaS)
```

## Red Flags

| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|-------------------|
| NRR from price increases | "Strategic pricing" + flat logos | Cohort shows ARPU up, logos flat | Request NRR ex-price actions |
| Churn masked by downsells | High NRR, no logo disclosure | GRR << NRR | Request logo churn separately |
| Heavy discounting | No discount disclosure | Avg discount >20% | Request discount by deal |
| Capitalized S&M | Low CAC vs peers | Deferred commissions on BS | Request commission policy |
| Channel concentration | "Strategic partnerships" | >20% through one reseller | Request revenue by channel |

## Standard Analyses

| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| Cohort retention | NRR/GRR by vintage | Monthly ARR by cohort, 24m |
| ARR bridge | Growth decomposition | New, expansion, contraction, churn by month |
| Unit economics | CAC payback, LTV | S&M spend, new ARR, churn, GM |
| Customer concentration | Revenue risk | Top 20 customers with ARR |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Cohort ARR with GRR/NRR | 24m | Monthly CSV | Validate retention |
| Top 20 customers | Current | ARR, dates, pricing | Concentration |
| COGS detail | 12m | Monthly by category | Gross margin quality |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Bookings vs billings | 12m | Monthly | Revenue timing |
| Discount rates | 12m | By customer | Pricing discipline |
| Pipeline | Current | By stage, segment | Growth visibility |

## Management Questions

1. **How do you define churn?** (logo vs revenue, when counted)
2. **What drives expansion?** (seats, modules, usage, price)
3. **What are discount guardrails?** (approval levels, max discount)
4. **What % through channel?** (resellers, marketplaces)
5. **How is implementation recognized?** (upfront vs over time)

## Accounting Watch-Outs

| Area | What to Check | Risk |
|------|---------------|------|
| Rev rec | ASC 606 POBs, SSP allocation | Accelerated recognition |
| Capitalized commissions | Amortization period vs contract | Inflated margins |
| Capitalized software | Useful life, impairment | Inflated EBITDA |
| Deferred revenue | Matches stated ARR | Billing vs recognition gap |

## QoE Adjustment Watchlist

| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Stock comp | Often excluded from "Adjusted EBITDA" | Add back if excluded |
| Capitalized dev | May inflate EBITDA | Normalize if aggressive |
| One-time S&M | "Investment" spend | Assess if truly non-recurring |

## External Research Topics

- NRR/GRR benchmarks by segment (SaaS Capital, KeyBanc, OpenView)
- Gross margin ranges for SaaS with support
- Public SaaS comps with similar GTM
- ASC 606 implementation issues

---

# Module: Banking & Lending

[Same structure repeated]

---

[Continue for all modules]
```

### Template Efficiency Guidelines

**Header Conventions:**
- `# Module: [Name]` — Primary header (for retrieval)
- `## Section` — Standard sections within each module
- `### Subsection` — For trees, tables, details

**Content Density:**
- Use tables over prose wherever possible
- No introductory paragraphs—dive straight into content
- Bullet points for lists, not numbered unless order matters
- Code blocks for tree structures (monospace formatting)

**Retrieval Optimization:**
- Module name in H1 header exactly matches system prompt reference
- Trigger keywords at top of each module for quick identification
- Consistent section names across all modules

**Size Targets:**
- Each module: ~15-20KB (compressed from current ~55-60KB)
- Total file: ~150-200KB (vs current ~578KB across 10 files)
- Compression achieved by: removing prose, using tables, eliminating redundancy
- Target compression: 60-70% size reduction

### Compression Strategy

Current modules are ~55-60KB each because they include:
- Extensive prose explanations
- Redundant context
- Examples and elaboration

To compress:

| Current | Compressed |
|---------|------------|
| Prose paragraphs explaining KPIs | Table: KPI / Definition / Why |
| Detailed red flag explanations | Table: Flag / Signal / Risk / Action |
| Narrative data request descriptions | Table: Request / Period / Format / Why |
| Extended management question context | Numbered list with parenthetical context |

**Target: 60-70% reduction in size while preserving all actionable content.**

### Module Transformation Process

For each existing module:

1. **Extract** trigger keywords → `## Triggers` section
2. **Convert** KPI explanations → KPI table
3. **Structure** value driver content → tree diagrams (code blocks)
4. **Tabularize** red flags with columns: Flag / CIM Signal / Data Room Signal / Action
5. **Tabularize** data requests with columns: Request / Period / Format / Why
6. **Compress** management questions to numbered list with inline context
7. **Tabularize** accounting items and QoE adjustments
8. **List** external research topics as bullet points

---

**Knowledge file structure (final):**
```markdown
# Industry Modules for FDD Research

This file contains industry-specific guidance for kickoff briefs.

---

# Module: Technology / SaaS

## Industry Identification
[trigger keywords and signals]

## Units That Matter
[KPIs with definitions]

## Value Driver Framework
[EBITDA, WC, Capex trees]

## Red Flags
[what to watch for]

## Data Requests
[standard first-round asks]

## Management Questions
[kickoff call prep]

---

# Module: Banking & Lending

[same structure]

---

[etc.]
```

---

## Module Content Structure (Updated)

Based on the updated expert prompt, each module should contain:

### Part 1: Industry Identification
- Trigger keywords and phrases
- Business model language
- KPI terminology
- Customer/transaction descriptors

### Part 2: Units That Matter
- 5-8 KPIs with plain-language definitions
- Why each matters for diligence

### Part 3: Value Driver Framework
- **EBITDA Tree**: Revenue decomposition (volume × price, gross-to-net, mix) + Cost structure
- **Working Capital Tree**: Receivables, Inventory, Payables, Other items
- **Capex Tree**: Growth, Maintenance, Technology

### Part 4: Standard Analyses
- Revenue analysis types (waterfall, cohort, like-for-like)
- Customer/portfolio analysis
- Unit/location analysis
- What data unlocks each analysis

### Part 5: Red Flags
- Early signals (visible in CIM/VDD)
- Data room signals
- How to investigate
- CIM language that should trigger concern

### Part 6: Data Requests
- P1 (Critical) and P2 (Important) requests
- What, period, granularity, format, why

### Part 7: Management Questions
- First 10 questions with context
- What you're really trying to learn

### Part 8: External Research
- Benchmark sources
- Regulatory context
- Competitor intelligence

### Part 9: Accounting & Recognition
- Revenue recognition policies
- Capitalization practices
- Reserves and estimates
- QoE adjustment watchlist

### Part 10: Value Creation Opportunities
- Revenue levers
- Cost levers
- Working capital levers
- Synergy areas

### Part 11: Ownership & Related Party Patterns
- Common ownership structures
- Related party transactions to watch

---

## Value Driver Diagram (PowerPoint Export)

### What It Is

A downloadable .pptx file containing three value driver trees:
1. **EBITDA Value Driver Tree** — Revenue decomposition + cost structure
2. **Working Capital Value Driver Tree** — Receivables, Inventory, Payables drivers
3. **Capex Value Driver Tree** — Growth, Maintenance, Technology capex

### When to Generate

- **On request**: User explicitly asks for value driver diagram
- **Automatic**: After "go" for Standard or Full FDD briefs

### Two Modes

1. **Industry-generic template**: Based on module, before doc extraction
2. **Deal-specific populated**: Filled with actual metrics from documents

### Technical Implementation

- Use Python (python-pptx) to generate programmatically
- Each industry module defines the tree structure
- Highlight key drivers, risk areas, value creation opportunities
- Include legend for visual conventions

### Use Cases

- Proposals (showing sector understanding)
- Client discussions (scoping conversations)
- Reports (diligence findings presentation)

---

## How to Research Effectively

The GPT should follow these research principles:

### Start with Multiple Searches
Don't rely on a single query. Use multiple targeted searches to triangulate information.

### Iterate Until Diminishing Returns
Keep searching until additional queries are unlikely to materially change the answer. For complex topics, this may mean 5-10 searches.

### Prioritize Source Quality

| Priority | Source Type | Examples |
|----------|-------------|----------|
| 1 | Official filings | 10-K, 10-Q, S-1, proxy statements |
| 2 | Regulators/standards | SEC, CMS, GAAP/IFRS guidance |
| 3 | Reputable industry research | Rating agencies, Big 4 publications, industry associations |
| 4 | Analyst reports | Equity research from major banks |
| 5 | Quality trade press | Industry publications with editorial standards |

Avoid: blogs without sourcing, press releases (use for facts only), Wikipedia (orientation only), outdated sources (>2 years for benchmarks).

### Handle Conflicts Explicitly
When sources disagree:
- State the conflict
- Pick the more authoritative or recent source
- Explain the rationale briefly

### Add Explanatory Depth
Don't just state conclusions. Explain mechanisms—what causes it, what it affects, what usually gets misunderstood.

### Use Concrete Examples
Named entities, specific numbers, case examples. Avoid vague generalizations.

---

## Python / Code Interpreter

Enabled for automatic use when helpful:

- **Parse XLSX/CSV** — Extract financial data from spreadsheets
- **Compute KPIs** — TTM revenue, growth rates, DSO/DPO/DIO, margins
- **Sanity check** — Reconcile totals, detect inconsistencies
- **Generate PowerPoint** — Value driver diagrams using python-pptx

If parsing fails, fall back to manual extraction and note what couldn't be computed.

---

## Low-Doc Handling

When documents are sparse (teaser only, pricing page, marketing brochure):

1. **Acknowledge the limitation** — "The provided documents are limited..."
2. **Lean on industry defaults** — Use the module's standard KPIs and red flags
3. **Expand web research** — More weight on industry context and benchmarks
4. **Frame as hypotheses** — "Based on industry patterns, we'd expect..."

---

## Files to Create

### System Prompt
`/dist/system-prompt.txt` — Core instructions including industry inference logic (~4-5k characters)

### Knowledge Files (3 files)
`/dist/knowledge/industry-modules-complete.md` — All modules consolidated with clear headers (~400KB)
`/dist/knowledge/research-guidance.md` — How to research effectively, source quality
`/dist/knowledge/output-structure.md` — Section definitions, templates

### Module Development Prompts
`/prompts/industry-module-prompt.md` — Updated generalized prompt (with value drivers, analyses, QoE)
`/prompts/industry-module-prompt-healthcare.md` — Healthcare-specific version

### Source Modules (for reference/maintenance)
```
/knowledge/
  module-technology-saas.md
  module-banking-lending.md
  module-transportation-logistics.md
  module-insurance.md
  module-real-estate-construction.md
  module-business-services.md
  module-healthcare-services.md
  module-retail-consumer.md
  module-industrial-manufacturing.md
  module-asset-management.md
```

---

## Implementation Checklist

### Phase 1: Knowledge Architecture
- [ ] Transform all 10 modules using compression strategy (60-70% size reduction)
- [ ] Consolidate into single `industry-modules-complete.md`
- [ ] Add module index and clear section headers for semantic search
- [ ] Create system prompt with industry inference logic
- [ ] Create research-guidance.md
- [ ] Create output-structure.md

### Phase 2: Value Driver Diagrams
- [ ] Verify tree structures in each module
- [ ] Create python-pptx generation code
- [ ] Test PowerPoint output quality
- [ ] Integrate into workflow

### Phase 3: Testing & Deployment
- [ ] Test with example fixtures
- [ ] Test industry inference accuracy
- [ ] Test retrieval consistency
- [ ] Test low-doc scenarios
- [ ] Test PowerPoint generation
- [ ] Deploy to Custom GPT

---

## Version History

| Version | Changes |
|---------|---------|
| v2.0 | Initial revised plan with streamlined workflow |
| v2.1 | Added knowledge architecture research, template design, value driver diagrams |
| v2.2 | All 10 industry modules complete; ready to execute |

### Key Design Decisions

| Aspect | Decision |
|--------|----------|
| Knowledge architecture | Single consolidated file with clear section headers |
| Industry selection | System prompt inference table → explicit module reference |
| Module compression | 60-70% reduction via tables over prose |
| Value Driver Diagrams | PowerPoint export via python-pptx |
| Module count | 10 complete modules covering major PE deal flow |
