# NVDA Diligence Prep

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/14/2026 10:20:36  
**Updated:** 1/14/2026 10:31:16  
**Exported:** 1/14/2026 11:18:30  
**Link:** [https://chatgpt.com/g/g-69615db492e081bd9b34c6cf53231e5d-fdd-researcher/c/6967b41f-5638-833f-9892-90d89e638cf4](https://chatgpt.com/g/g-69615db492e081bd9b34c6cf53231e5d-fdd-researcher/c/6967b41f-5638-833f-9892-90d89e638cf4)  

## Response:
Thought for 10s

💡 Before I build your diligence plan (and then the full kickoff brief), confirming a few basics:

1.  **Target:** You mean **NVIDIA Corporation (NVDA)** — correct?
2.  **Industry:** Should I treat this as **semiconductors / accelerated computing (GPUs + data center platforms for AI)** vs. a broader “AI infrastructure + software ecosystem” lens?
3.  **Geography:** Primarily **global operations with HQ in the U.S.** — confirm?
4.  **As-of date:** Use **as of today (Jan 14, 2026)**, looking back **~24 months**?

Once you confirm, I’ll propose the research plan + diligence tracks (approval gate). After you say **“go”**, I’ll start web research and produce the full FDD kickoff brief.

## Response:
Thought for 35s

Research Plan 🔍 — NVIDIA (NVDA) FDD Kickoff Brief
--------------------------------------------------

### Output structure (what you’ll get after you say “go”)

1.  **Company Overview**  
    What NVIDIA sells, how it’s organized (segments / platform stack), key customers/end-markets, and the “why now” of the diligence.
2.  **Industry Context** _(deep dive; 1,200–1,500 words)_
    *   **Business model mechanics** (accelerators + networking + software ecosystem; sell-through vs sell-in; platform attach)
    *   **Key term definitions** (H100/B100-class accelerators, CUDA moat, inference vs training, HBM, CoWoS/advanced packaging, interconnect/NVLink/InfiniBand/Ethernet, hyperscaler capex cycle, etc.)
    *   **Key benchmarks** (gross margin ranges for fabless semis, data center vs gaming mix effects, working capital patterns, capex intensity vs peers, etc.)
    *   **Competitive landscape** (AMD/Intel, hyperscaler ASICs, foundry/packaging bottlenecks, pricing/power dynamics)
3.  **Financial Summary**  
    Multi-period table (FY-2, FY-1, LTM/YTD as available from public filings) + commentary on growth, margin drivers, mix, cash conversion, and normalization considerations.
4.  **Key Findings**  
    3–5 “so what” points that will matter in diligence + what to test.
5.  **Accounting Policies** _(included because NVDA is reporting-heavy + mix is complex)_  
    Revenue recognition (hardware vs software/licensing/support), inventory valuation/reserves, warranty/returns, share-based comp presentation, concentration disclosures, segment reporting.
6.  **Diligence Playbook**  
    Value driver tree + P&L walkthrough + workstreams (Revenue, Margin, Working Capital/Cash, Risk/Controls) tailored to NVIDIA’s model.
7.  **Data Requests**  
    A prioritized list (High/Med/Low) of the exact schedules you’d want in a confirmatory or buyer-led diligence setting.
8.  **Sources**  
    Numbered web citations (filings, investor materials, reputable industry sources).

* * *

### Research tracks (what I’ll answer via web research)

1.  **Revenue engine & unit economics (by segment / end-market):**  
    What truly drives growth (shipments vs ASPs vs mix), how networking/software attach works, and where sustainability is most/least defensible.
2.  **Supply chain constraints & cost structure:**  
    Foundry and advanced packaging dependencies (lead times, capacity, gross margin sensitivity), and how these constraints shape revenue timing and risk.
3.  **Customer concentration + hyperscaler dynamics:**  
    Magnitude and direction of concentration, purchasing patterns (build vs buy), and how hyperscaler capex cycles and in-house silicon affect downside cases.
4.  **Competitive threats & substitution risk:**  
    AMD/Intel roadmap pressure, custom ASIC trajectories, and whether “CUDA + ecosystem” remains a durable moat in training and inference.
5.  **Regulatory / geopolitics / export controls:**  
    What rules changed over the last 24 months, what revenue/profit exposure exists, and how mitigation strategies show up in disclosures.
6.  **Financial quality signals & normalization items:**  
    Working capital drivers, reserves (inventory / returns), channel dynamics, SBC and other recurring adjustments, and any one-offs that could distort run-rate EBITDA.

* * *

If this plan looks right, say **“go”** and I’ll start web research and deliver the full NVDA FDD kickoff brief in the structure above (with citations and a few helpful UI callouts like relevant news + market context).

## Response:
Thought for 3m 30s

NVIDIA (NVDA) — Financial Due Diligence Research Brief
======================================================

**As-of date:** January 14, 2026 (latest public filing used: **Form 10-Q for quarter ended Oct 26, 2025**, filed Nov 19, 2025)

* * *

Company Overview
----------------

*   **What NVIDIA does (today):** NVIDIA is a fabless semiconductor and systems company whose economics are increasingly driven by **Data Center accelerated computing** (GPUs + networking + full-rack systems) sold to cloud providers, AI labs, consumer internet companies, enterprises, and public sector customers. In FY2025, **Data Center revenue was $115.2B out of $130.5B total**. [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)
*   **How management reports the business:** NVIDIA reports two operating segments: **Compute & Networking** and **Graphics**. FY2025 segment revenue was **$116.2B** and **$14.3B**, respectively. [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)
*   **Operating model (high level):** NVIDIA designs silicon and platforms, then relies on external manufacturing and assembly/test/packaging partners. The financial model is characterized by (i) very high gross margin driven by mix and pricing power, (ii) material working-capital swings tied to long lead times and inventory positioning, and (iii) significant capital return via buybacks and dividends. [SEC+2SEC+2](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)
*   **Customer concentration is structurally meaningful:** In **Q3 FY2026**, four direct customers were each **\>10% of revenue** (22%, 15%, 13%, 11%). For the **first nine months of FY2026**, two direct customers were **21% and 13%** of revenue. [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)

* * *

Industry Context
----------------

### 1) How the “AI compute stack” converts demand into NVIDIA revenue

**Demand driver (end customers):** Enterprises and cloud service providers fund compute to train and run AI models. A practical way to diligence NVIDIA demand is to translate “AI workload growth” into **(a) accelerator deployments**, plus **(b) networking and infrastructure attach**, and then into **(c) replacement/refresh cadence**.

**NVIDIA’s monetization layers:**

*   **Silicon/boards (GPU accelerators):** GPU revenue is mainly recognized when control transfers (shipment / delivery terms), but diligence needs to validate _what_ is shipped (GPU boards vs systems vs racks) because ASP and gross margin can differ materially by configuration.
*   **Systems & racks:** The industry is moving from “accelerator cards into OEM servers” toward **integrated systems and full-rack solutions**, which tends to increase NVIDIA revenue per deployment while also increasing the bill-of-materials (BOM) exposure (HBM, networking, packaging) and execution complexity.
*   **Networking attach:** NVIDIA’s AI clusters require high-bandwidth, low-latency interconnects. NVIDIA participates via **networking revenue** (within Data Center end market reporting). In FY2025, Data Center “Networking” revenue was **$13.0B** (of $115.2B Data Center total). [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

**Key diligence implication:** NVIDIA may “win” even if customers diversify silicon, because the platform content can extend beyond the GPU (e.g., networking + systems). But that same platform strategy increases dependencies on constrained components (HBM) and advanced packaging.

* * *

### 2) Market growth and where NVIDIA sits in the semiconductor ecosystem

**Overall semiconductor market backdrop:** Gartner estimates worldwide semiconductor revenue rose sharply in 2024 and highlights **data center semiconductors** as a major growth engine, projecting continued expansion into 2025. [Gartner+1](https://www.gartner.com/en/newsroom/press-releases/2025-02-03-gartner-says-worldwide-semiconductor-revenue-grew-18-percent-in-2024?utm_source=chatgpt.com)

**NVIDIA’s relative position:** Gartner’s final 2024 ranking indicates NVIDIA reached the **No. 1** position in semiconductor vendor revenue (in their methodology), reflecting the surge in AI infrastructure demand. [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-04-10-gartner-says-worldwide-semiconductor-revenue-grew-21-percent-in-2024?utm_source=chatgpt.com)

**Diligence implication:** This is a demand-and-supply story, not just a product story. As NVIDIA scales, the bottleneck often shifts to **manufacturing capacity (foundry + advanced packaging)** and **memory supply (HBM)** rather than end-market willingness to buy.

* * *

### 3) Supply chain mechanics that matter for diligence (fabless, but capacity-constrained)

**The “real” bottlenecks: advanced packaging (CoWoS-class) and HBM**

*   **Advanced packaging:** AI accelerators increasingly require chiplets, interposers, and complex packaging. Multiple industry sources describe **CoWoS capacity expansion** and continued tightness into 2025–2026. [TrendForce+2TrendForce+2](https://www.trendforce.com/news/2025/01/02/news-tsmc-set-to-expand-cowos-capacity-to-record-75000-wafers-in-2025-doubling-2024-output/?utm_source=chatgpt.com)
*   **HBM supply:** HBM is structurally critical for AI accelerators; Reuters reports SK hynix as NVIDIA’s primary HBM supplier and cites a high market share for SK hynix, with large planned investments in advanced packaging capacity. [Reuters](https://www.reuters.com/world/asia-pacific/sk-hynix-invest-nearly-13-bln-chip-packaging-plant-south-korea-2026-01-13/?utm_source=chatgpt.com)

**Why this matters economically:**

*   Packaging and HBM constraints can cap shipments even when demand is strong.
*   Tight supply can increase component costs and elevate **inventory risk** (buying ahead with long lead times, committing to supply, then facing demand timing changes).

**What to test in diligence:**

*   How much of revenue growth is constrained by supply vs driven by demand?
*   Where does NVIDIA prepay / commit (foundry wafers, packaging slots, HBM offtake), and how are those commitments reflected (purchase obligations, deposits, inventory provisions)?

* * *

### 4) Competitive dynamics (what typically breaks margin regimes)

**NVIDIA’s current margin structure is exceptional.** Public commentary notes NVIDIA’s very high gross and operating profitability relative to most semiconductor peers. [The Wall Street Journal](https://www.wsj.com/tech/ai/nvidias-fat-margins-are-google-and-amds-opportunity-69591c66?utm_source=chatgpt.com)

**Useful peer anchor (not perfect comparables, but directional):**

*   AMD’s FY2024 gross margin was **49% GAAP** (53% non-GAAP). [AMD](https://www.amd.com/en/newsroom/press-releases/2025-2-4-amd-reports-fourth-quarter-and-full-year-2024-fina.html?utm_source=chatgpt.com)  
    This helps frame how unusual NVIDIA’s 70%+ gross margin regime is when pricing power and mix are favorable.

**Where competition usually shows up first:**

1.  **Pricing:** Customers push for lower $/training token or $/inference token.
2.  **Platform substitution:** Custom silicon / alternative accelerators reduce GPU unit demand or cap ASP.
3.  **Networking / system disaggregation:** Customers try to buy “good enough” networking separately.
4.  **Software monetization limits:** If software attach doesn’t scale, platform margins may compress as systems become more BOM-heavy.

**Diligence implication:** The key question isn’t “will NVIDIA lose share tomorrow,” but “what is the forward gross margin clearing price when competition and customer bargaining power normalize?”

* * *

### 5) Demand translation: reading NVIDIA’s end-market disclosures (and what they hide)

NVIDIA’s filings provide a strong base for demand mapping, but diligence should explicitly bridge **end-market revenue** to _units, configurations, and customers_:

**FY2025 revenue by end market (NVIDIA disclosure):**

*   **Data Center:** $115.2B
*   **Gaming:** $11.35B
*   **Pro Visualization:** $1.88B
*   **Automotive:** $1.69B
*   **OEM & Other:** $0.39B [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

**9M FY2026 (through Oct 26, 2025):**

*   **Data Center:** $131.4B (Compute $111.0B; Networking $20.4B)
*   **Gaming:** $12.3B
*   **Pro Viz:** $1.87B
*   **Automotive:** $1.75B
*   **OEM & Other:** $0.46B [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)

**What is missing (typical diligence asks):**

*   Units shipped by platform generation (by quarter), ASP waterfall, and the mix of **GPU boards vs systems vs racks**
*   Backlog / bookings visibility and cancellation behavior
*   Channel inventory (for Gaming and any indirect Data Center routes)
*   Services/software revenue decomposition (license, subscription, support, cloud)

* * *

### 6) Working-capital and cash conversion in a capacity-constrained, long-lead-time business

**The core dynamic:** When lead times extend, NVIDIA builds inventory and enters commitments; when demand shifts, it records **inventory provisions** and purchase obligation charges.

Evidence in the public filings:

*   **Inventory levels increased materially** from **$10.1B (Jan 26, 2025)** to **$19.8B (Oct 26, 2025)**. [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)
*   NVIDIA also records sizable **inventory provisions** in cost of revenue (disclosed for FY2025/FY2024 and for FY2026 YTD). [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

**Diligence implication:** Cash conversion will be very sensitive to (i) AR terms with large customers, (ii) inventory posture and reserves, and (iii) supplier payment terms tied to capacity commitments. This can matter more than “headline margins” during transitions.

* * *

Financial Summary
-----------------

**Periods shown:** FY2023 (ended Jan 29, 2023), FY2024 (ended Jan 28, 2024), FY2025 (ended Jan 26, 2025), and 9M FY2026 (ended Oct 26, 2025). Primary sources are NVIDIA’s Form 10-K and Form 10-Q. [SEC+2SEC+2](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

| $ in billions (except %) | FY2023 | FY2024 | FY2025 | 9M FY2026 |
| --- | --- | --- | --- | --- |
| Revenue | 27.0 | 60.9 | 130.5 | 147.8 |
| Gross margin % | n/a | 72.7% | 75.0% | 69.3% |
| Operating income | 4.2 | 33.0 | 81.5 | 92.6 |
| Net income | 4.4 | 29.8 | 72.9 | 77.1 |
| Net cash from operations | 5.6 | 28.1 | 64.1 | n/a |

**Context / diligence takeaways (financial):**

*   FY2025 revenue more than doubled vs FY2024 (**$130.5B vs $60.9B**) with gross margin expanding to **75.0%** and operating income rising to **$81.5B**—an extreme scale and profitability step-up driven by Data Center mix. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)
*   Customer concentration increased in FY2026 YTD disclosures (two direct customers 21% and 13% of total revenue for 9M FY2026). [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)
*   Cash generation scaled significantly: **FY2025 operating cash flow $64.1B** (vs $28.1B FY2024). [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

**Capital return and equity dynamics (what to normalize):**

*   NVIDIA repurchased **$34.0B** of shares in FY2025 and paid **$834M** of dividends. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm?utm_source=chatgpt.com)
*   In 9M FY2026, NVIDIA repurchased **$36.7B** of shares and paid **$732M** in dividends. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm?utm_source=chatgpt.com)

* * *

Key Findings
------------

1.  **This is a “platform + supply chain” diligence, not a classic fabless chip diligence.**  
    Revenue is dominated by Data Center and is increasingly tied to full-stack deployments (compute + networking + systems), while execution risk shifts to advanced packaging and memory availability. [SEC+2TrendForce+2](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)  
    **Diligence consideration:** Build a bottoms-up “units × configuration × supply” model (HBM stacks, packaging slots, board components) and reconcile it to revenue.
2.  **Customer concentration is high and appears to be rising in the most recent period.**  
    9M FY2026 shows two direct customers at **21% and 13%** of revenue; Q3 FY2026 shows four direct customers each >10%. [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)  
    **Diligence consideration:** Validate who the direct customers are (AIBs/ODMs) vs end customers (CSPs), the underlying contract structures, and pricing/volume protections.
3.  **Gross margin remains structurally elevated, but 9M FY2026 margin mix/provision dynamics deserve scrutiny.**  
    9M FY2026 gross margin is disclosed at **69.3%**, below FY2025’s **75.0%**, and NVIDIA reports large inventory provisions YTD in cost of revenue. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)  
    **Diligence consideration:** Decompose margin into (i) mix, (ii) pricing, (iii) product costs (HBM + packaging), and (iv) inventory/procurement charges; test sustainability vs competitive benchmarks. [AMD+1](https://www.amd.com/en/newsroom/press-releases/2025-2-4-amd-reports-fourth-quarter-and-full-year-2024-fina.html?utm_source=chatgpt.com)
4.  **Working-capital and commitment accounting can swing earnings quality.**  
    Inventory nearly doubled from Jan 2025 to Oct 2025. [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)  
    **Diligence consideration:** Review purchase obligations, deposits, and reserve methodology; test whether reserves are forward-looking enough given long lead times.
5.  **Capital allocation is aggressive and can mask underlying dilution/compensation economics.**  
    Buybacks are very large in absolute dollars (FY2025 repurchases $34.0B; 9M FY2026 repurchases $36.7B). [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm?utm_source=chatgpt.com)  
    **Diligence consideration:** Normalize free cash flow after employee equity programs (net share settlement withholding), and ensure equity compensation is reflected consistently in adjusted EBITDA frameworks. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000209/nvda-20250727.htm?utm_source=chatgpt.com)

* * *

Diligence Playbook
------------------

### A) Value driver tree (what to model and test)

**Revenue drivers**

1.  **Data Center compute revenue**
    *   Units shipped by platform (generation + SKU)
    *   ASP by configuration (board vs system vs rack)
    *   Mix: training vs inference; premium vs mainstream SKUs
2.  **Data Center networking revenue**
    *   Attach rate per GPU cluster
    *   Mix: Ethernet vs InfiniBand
3.  **Gaming**
    *   Unit volume × GPU ASP; channel inventory and pricing actions
4.  **Auto / Pro Viz**
    *   Design-win pipeline to revenue conversion; ramp timing
5.  **Software / services (if material)**
    *   Subscription/term contracts, renewals, support attach, deferred revenue

**Cost drivers**

*   Wafer cost + yields (foundry)
*   Advanced packaging capacity/pricing (CoWoS-class)
*   HBM pricing, availability, and supplier concentration
*   Board BOM inflation/deflation
*   Inventory provisions and purchase obligation charges

**Operating expense drivers**

*   R&D headcount + compute infrastructure
*   GTM capacity (sales + solutions engineers)
*   Stock-based compensation intensity

* * *

### B) P&L walkthrough (FDD-style)

**1) Revenue recognition and cut-off**

*   Validate shipping terms, acceptance terms for systems/racks, and any extended payment terms with large customers.
*   Reconcile end-market revenue disclosures (Data Center / Gaming / etc.) to internal product-line reporting and customer invoices. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)

**2) Gross margin and reserves**

*   Rebuild gross margin from the ground up:
    *   “Clean” product margin (ex inventory provisions / releases)
    *   Packaging + HBM cost impact
    *   Services / support margin (if included in cost of revenue)
*   Specifically test **inventory provisions** methodology and triggers; NVIDIA discloses sizable provisions in cost of revenue across periods. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

**3) Operating expenses (scalability vs reinvestment)**

*   R&D and SG&A grew meaningfully in 9M FY2026; NVIDIA attributes increases to compensation and compute/infrastructure. [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)
*   Separate “run-rate” headcount investment from one-time items (acquisition-related, legal, etc.).

**4) Other income / investments**

*   NVIDIA’s results can include gains/losses from investments; this can add volatility and should be stripped for EBITDA/FCF normalization. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

**5) Tax rate**

*   Effective tax rates are disclosed; ensure any discrete items are identified and normalized for forecasting. [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)

* * *

### C) Quality of Earnings (QoE) adjustments — likely candidates

**Common adjustments (candidate list, not a conclusion):**

*   **Stock-based compensation** (material; disclosed in cash flow and segment bridge) [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)
*   **Inventory provisions / purchase obligation charges** (timing can be lumpy; confirm “core” vs “event-driven”) [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)
*   **Gains/losses on investments** (non-operating volatility) [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)
*   **Acquisition-related and other costs** (present in segment-to-consolidated bridge in 10-Q) [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)
*   **Restructuring / unusual legal settlements** (if any; validate against detailed GL and footnotes)

* * *

### D) Working capital and cash flow workstreams

**1) AR and customer terms**

*   With high concentration, small changes in terms with top counterparties can move cash materially.
*   Reconcile AR aging by customer cohort; confirm any “bill-and-hold,” extended terms, or rebates/credits.

**2) Inventory posture**

*   Inventory nearly doubled from Jan 2025 to Oct 2025; diligence must explain why (pipeline fill, new platform ramps, long lead times, buffering constrained components). [SEC](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)
*   Test reserves by SKU/platform generation; validate excess/obsolete assumptions and historical accuracy.

**3) Supplier commitments**

*   Extract all long-term supply commitments (foundry, packaging, HBM) and map them to demand forecasts and planned shipments.

* * *

Accounting Policies
-------------------

**Revenue recognition**

*   Key diligence focus: identifying performance obligations for systems/racks/software/support, and confirming cut-off and acceptance terms.

**Inventory and lower-of-cost-or-net-realizable-value**

*   NVIDIA’s disclosures highlight provisions and releases affecting gross margin. Diligence should review the reserve policy, governance, and how forecast error translates into charges. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

**Stock-based compensation**

*   Material non-cash expense that also impacts financing cash flows via tax withholding on RSUs and net settlements. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

**Investments and fair value**

*   Investment gains/losses can be significant; confirm classification, valuation methodology, and impairment policy. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)

* * *

Data Requests
-------------

| Priority | Request | Why it matters |
| --- | --- | --- |
| **High** | Monthly/quarterly **units shipped** by major Data Center platform/SKU and configuration (board vs system vs rack) | Converts revenue to operational reality; supports supply chain feasibility |
| **High** | Customer-level revenue and margin bridge for top direct customers; mapping to end customers | Validates concentration risk and pricing power |
| **High** | **Supply commitments** (foundry, advanced packaging, HBM): volumes, pricing, deposits, take-or-pay | Explains growth ceiling + margin sensitivity |
| **High** | Inventory roll-forward by platform, with reserve methodology and historical accuracy | Tests earnings quality and downside protection |
| **High** | Backlog/bookings (if tracked), cancellation/deferral behavior, lead-time assumptions | Demand visibility and cyclicality assessment |
| **Medium** | Networking attach data (units / $ per GPU cluster) and roadmap assumptions | Platform expansion and competitive moat |
| **Medium** | Software/services revenue detail (product, term, renewals, deferred revenue, margins) | Determines durability of “platform” economics |
| **Medium** | Channel inventory, pricing programs, returns/credits (Gaming + any indirect DC) | Detects channel stuffing risk and pricing resets |
| **Low** | Corporate allocation policies, transfer pricing, and intercompany charge structure | Useful for carve-out style issues (lower relevance here) |

* * *

Sources
-------

1.  NVIDIA Form **10-K** (FY ended Jan 26, 2025), SEC EDGAR. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm)
2.  NVIDIA Form **10-Q** (quarter ended Oct 26, 2025), SEC EDGAR. [SEC+1](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000230/nvda-20251026.htm)
3.  NVIDIA Investor Relations press releases (FY2025 and Q3 FY2026 results). [NVIDIA Newsroom+1](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2025?utm_source=chatgpt.com)
4.  Gartner semiconductor market updates and forecasts. [Gartner+2Gartner+2](https://www.gartner.com/en/newsroom/press-releases/2025-02-03-gartner-says-worldwide-semiconductor-revenue-grew-18-percent-in-2024?utm_source=chatgpt.com)
5.  Industry reporting on advanced packaging and memory supply (TrendForce; Reuters). [TrendForce+1](https://www.trendforce.com/news/2025/01/02/news-tsmc-set-to-expand-cowos-capacity-to-record-75000-wafers-in-2025-doubling-2024-output/?utm_source=chatgpt.com)
6.  Peer benchmark anchor (AMD FY2024 results). [AMD](https://www.amd.com/en/newsroom/press-releases/2025-2-4-amd-reports-fourth-quarter-and-full-year-2024-fina.html?utm_source=chatgpt.com)

Recent NVIDIA / AI supply-chain reading list

[

![SK Hynix to invest nearly $13 bln in chip packaging plant in South Korea](https://images.openai.com/static-rsc-1/ob9qEBpV6oD4xYZ_r56ARwASinG-wDpB2dexIG7uvYd2I80Gj0c_r28exByM7_goDnZd65Xc7OEJldQWTl1zL1GmC3-Xpo5x71r8H9I9gKlW4Q316-cx6ngZQOI35wcb-B3BHYXdb7Nkuo5S3RYiIunr6FdvC-XTrVajlVAVLYvgd3iLwi65D_Oo4qvVQ_4DbOaSd1b8-h74Y-0BlYs0aYiqJMbW4kypJHMipOFptKEtZpi4cuvRFgbVPNxIbdunNQj5edev4XEKLMpybkh4sg)

![](https://www.google.com/s2/favicons?domain=https://www.reuters.com&sz=32)

Reuters

SK Hynix to invest nearly $13 bln in chip packaging plant in South Korea

Yesterday

](https://www.reuters.com/world/asia-pacific/sk-hynix-invest-nearly-13-bln-chip-packaging-plant-south-korea-2026-01-13/?utm_source=chatgpt.com)

[

![](https://www.google.com/s2/favicons?domain=https://www.wsj.com&sz=256)

![](https://www.google.com/s2/favicons?domain=https://www.wsj.com&sz=128)

![](https://www.google.com/s2/favicons?domain=https://www.wsj.com&sz=32)

The Wall Street Journal

Nvidia's Fat Margins Are Google and AMD's Opportunity

Dec 3, 2025

](https://www.wsj.com/tech/ai/nvidias-fat-margins-are-google-and-amds-opportunity-69591c66?utm_source=chatgpt.com)

[

![TSMC Q4 profit poised to soar 27% as AI demand drives growth](https://images.openai.com/static-rsc-1/JozUVbwWMQQevnw4wVcHzBp3n_L5GorffVSdera1s7K3wY9zqVK8GTKr_njziKKruKQ_L_I8qj7zTH0ZR2shkcZO-JEZMOzKOkZyzyc1AJWJPbcdeJvNoT__DfEhE9sQ0U6_-OcZ5ZY3lNhifrRhj5VkqWZT3zPjpYkpaTdd3XEb5lrNtzC39zrneOzozv_8p_VwgFdFk21AyOl7rFSmfCFJ9IWf-FgorObRTfuTqFUz4FGYmHvJm2LBYdPyEpE84vzrB8HJBkZJjEAQ0VDAIw)

![](https://www.google.com/s2/favicons?domain=https://www.reuters.com&sz=32)

Reuters

TSMC Q4 profit poised to soar 27% as AI demand drives growth

2 days ago

](https://www.reuters.com/world/china/tsmc-q4-profit-poised-soar-27-ai-demand-drives-growth-2026-01-12/?utm_source=chatgpt.com)

[

![Samsung forecasts profit to triple to record high as it rides AI boom](https://images.openai.com/static-rsc-1/_TAXPZrym-LXXEgptcMBy-B8FBklsqW7eQoUOaC2oxbroN2xjJmoHJ4TgdKBTwvASM1qo24sETdsVlZGYwUNEmlrJ0MHEA_VijqTCJxr5aU_-TPjgTJnqpqcJwnemWVBbu_cRqxBL_ZFtMrIVzckzfOBOrk1HOXKl38sjZi2KZFlAgjEg_q7mUAOWjcqlyJu8uvxYeZ842r25BRHVIo6w563qVMNzQ3WNZ1HR5XYPHqKNUZmYB3v0elzrFWzloYyqfVZj1j_B4-AKQ7wJHbmiQ)

![](https://www.google.com/s2/favicons?domain=https://www.reuters.com&sz=32)

Reuters

Samsung forecasts profit to triple to record high as it rides AI boom

6 days ago

](https://www.reuters.com/world/asia-pacific/samsung-elec-estimates-208-rise-q4-operating-profit-beating-expectations-2026-01-07/?utm_source=chatgpt.com)

[

![Samsung forecasts record profit and signals sustained AI boom](https://images.openai.com/static-rsc-1/dTiFGLIjWt-4Iy5l8MY4RVB9qsgafikaB9EL61YnUJmuh0NSu9yK-i32Uqqr7OJqKtoYZeNDI0_2X1wYk-8Et2dsceNtVaGBp7_v3T_KpIFvddmO1PpgFWWZv7-d7e5GyF8NjwcOTelDGnCq6wCuVy7UAgFQ_y_2isxLoZWnxzNi8OvuB3EKGXw0lB4SYxzgUFzySWRV0ilBWlElyy4Mm6iwA-sO-GfMy48IybBgFNE)

![](https://www.google.com/s2/favicons?domain=https://www.ft.com&sz=32)

Financial Times

Samsung forecasts record profit and signals sustained AI boom

6 days ago

](https://www.ft.com/content/6deae58c-29ae-4a52-b42b-0f41802edccf?utm_source=chatgpt.com)

[

![](https://www.google.com/s2/favicons?domain=https://www.barrons.com&sz=32)

barrons.com

Nvidia's Stock Buybacks Ramped Up After the DeepSeek Hit

Feb 27, 2025

](https://www.barrons.com/articles/nvidia-stock-repurchases-deepseek-c5ea6671?utm_source=chatgpt.com)



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)