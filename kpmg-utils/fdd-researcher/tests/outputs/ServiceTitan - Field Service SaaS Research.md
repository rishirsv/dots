# Field Service SaaS Research

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/14/2026 10:17:53  
**Updated:** 1/14/2026 10:47:04  
**Exported:** 1/14/2026 10:47:34  
**Link:** [https://chatgpt.com/g/g-69615db492e081bd9b34c6cf53231e5d-fdd-researcher/c/6967b3a0-efc0-833d-8b89-58dc765f6900](https://chatgpt.com/g/g-69615db492e081bd9b34c6cf53231e5d-fdd-researcher/c/6967b3a0-efc0-833d-8b89-58dc765f6900)  

## Response:
Thought for 10s

💡 Before I build the ServiceTitan-based comparable brief (and then browse EDGAR for the latest S-1 / public filings), confirming a few things:

1.  **Target comparable:** You want **ServiceTitan, Inc.** (IPO/S-1 / public company filings) as the anchor comp — correct?
2.  **Industry:** This is **Field Service Management (FSM) vertical SaaS** (HVAC, plumbing, electrical, other trades) — correct?
3.  **Geography:** Should I assume **primarily U.S./North America** benchmarks and competitive set (with notes on any international dynamics if ServiceTitan discloses them)?
4.  **As-of date:** Use **as of today (Jan 14, 2026)**, looking back **~24 months** for “current” benchmarks and industry context — OK?

Reply with any edits, then say **“go”** and I’ll proceed with the structured research plan + EDGAR-based write-up following the brief format.

## Response:
Thought for 35s

Research Plan 🔍 (ServiceTitan as FSM SaaS comp)
------------------------------------------------

### Output structure (final brief)

1.  **Company Overview (ServiceTitan as comp anchor)**  
    What they sell, who they sell to, packaging/pricing approach, operating model, and how they frame “platform” vs point solutions (from S-1 / public filings).
2.  **Industry Context: How FSM SaaS economics work**
    *   Buyer + user personas (owner/operator, dispatcher, tech) and why workflow depth matters
    *   ACV / seat vs transaction dynamics (dispatch + CRM + invoicing + payments + marketing)
    *   Implementation/onboarding economics and when PS becomes margin-dilutive vs value-accretive
    *   Expansion levers (multi-location, add-on modules, payments/fintech attach, price/packaging)
3.  **Key SaaS metrics + benchmarks (vertical SaaS / FSM)**  
    Definitions + how to interpret in this subsector: **ARR, NRR, GRR, logo churn, CAC payback, LTV/CAC, gross margin (subscription vs payments), magic number, rule of 40**, cohort expansion patterns, etc.  
    Benchmarks from credible sources plus what ServiceTitan discloses.
4.  **Competitive landscape in FSM software**  
    Segmentation map (SMB trades vs mid-market vs enterprise/industrials), key vendors, differentiation (workflow depth, ecosystem, payments/fintech, marketing, integrations), and switching costs.
5.  **Key findings for a _private-company_ deal (using ServiceTitan as lens)**  
    3–5 diligence-relevant takeaways: what “good” looks like, common pitfalls, and where reported metrics can be misleading.
6.  **Diligence playbook for an FSM SaaS target**  
    Value-driver tree + P&L walkthrough + workstreams: revenue quality, retention, pricing, S&M efficiency, services margin, payments economics, R&D roadmap, and accounting/policy watch-outs.
7.  **Data requests (prioritized High/Medium/Low)**  
    A practical list you can drop into an IOI/confirmatory request set.
8.  **Sources**  
    ServiceTitan filings + independent industry/benchmark sources.

* * *

### Research tracks (what I’ll answer via web + filings)

1.  **ServiceTitan filings pull:** What metrics they disclose (ARR/NRR/etc.), segment mix, payments/fintech economics, services revenue treatment, risk factors that map to diligence.
2.  **FSM vertical SaaS unit economics:** Typical ACV ranges, onboarding effort, module attach, expansion patterns, churn drivers (seasonality, contractor failure rates, competition).
3.  **Benchmarks:** Current ranges for **NRR/GRR, CAC payback, gross margin, S&M % of revenue** for vertical SaaS and adjacent FSM comps.
4.  **Competitive landscape mapping:** SMB trades-focused vs broader FSM/enterprise field service (and how “platform” claims differ).
5.  **Diligence translation:** How to reconstruct _private-company_ KPIs (true ARR, net dollar retention, cohort curves, CAC by segment/channel), and the highest-leverage tests.

* * *

If you reply **“go”**, I’ll start browsing EDGAR + the latest ServiceTitan public filings and build the full brief with citations.

## Response:
Thought for 19m 28s

ServiceTitan (TTAN) — Field Service Management SaaS Comparable Brief
====================================================================

_As-of: January 14, 2026 (America/Toronto). Public-company facts sourced primarily from ServiceTitan’s IPO S-1 and subsequent public filings; framed for private-company diligence._

* * *

Company Overview
----------------

*   **What it is:** ServiceTitan positions itself as an “operating system” for the skilled trades (e.g., plumbing, HVAC, electrical, roofing), serving the end-to-end workflows of contractors that install/maintain residential and commercial infrastructure.
*   **Product scope:** ServiceTitan frames its platform around five “core centers of gravity” inside a trades business—**CRM**, **FSM** (scheduling/dispatch), **ERP** (e.g., inventory), **HCM** (payroll/comp integration), and **FinTech** (payments and third-party financing).
*   **Revenue model (high level):** The S-1 presents **Platform revenue** (subscription + usage-based / FinTech-related revenue streams) plus **Professional services and other** (implementation, onboarding, etc.).
*   **Scale proxy (volume + retention):** In its IPO materials, ServiceTitan disclosed **Gross Transaction Volume (GTV)** as a key operating metric (i.e., value flowing through customer invoices/payments on the platform) and showed **Gross Dollar Retention >95%** and **Net Dollar Retention >110%** for each of the last 10 fiscal quarters as of July 31, 2024.
*   **IPO context:** ServiceTitan publicly filed an S-1 on **November 18, 2024**, priced its IPO at **$71.00** on **December 11, 2024**, and began trading on **Nasdaq (TTAN)** on **December 12, 2024**. [ServiceTitan Investors+2ServiceTitan+2](https://investors.servicetitan.com/news-releases/news-release-details/servicetitan-files-registration-statement-proposed-initial/?utm_source=chatgpt.com)
*   **Public financial trajectory:** FY23–FY25 showed rapid top-line growth with improving blended margins, while remaining GAAP loss-making and heavily investing in R&D and go-to-market.

* * *

Industry Context
----------------

### 1) What “Field Service Management” SaaS really sells (and why it can be sticky)

**FSM software** sits at the intersection of (i) dispatch/scheduling, (ii) job execution in the field, and (iii) billing/collections—then expands into adjacent systems (CRM, marketing, inventory, payroll, payments). The “why now” for FSM SaaS is that many trades businesses historically ran on spreadsheets + legacy point tools, where operational complexity rises quickly with technician count, call volume, and multi-location operations.

ServiceTitan’s framing is useful for diligence because it explicitly describes the job-to-be-done as **running the whole contractor business**, not just dispatch: owners and office staff need visibility into lead conversion, capacity utilization, job profitability, receivables, and technician performance (and they need it in near real time).

**Stickiness drivers that are common in FSM SaaS:**

*   **Workflow embeddedness:** Scheduling/dispatch + invoicing is “day-zero critical,” which pushes switching costs high once the business is trained and configured (templates, pricebooks, routing rules, call scripts, integrations).
*   **Data gravity:** The platform becomes the system of record for customers, equipment history, technician notes, warranties, memberships, and pricing—creating compounding value over time.
*   **Ecosystem and integrations:** Accounting/payroll/financing and third-party add-ons drive “soft lock-in.”
*   **Outcome linkage:** For many trades businesses, growth is local and operationally constrained; software that increases lead conversion, average ticket, and technician productivity tends to show tangible ROI (which reinforces renewal/expansion).

For a private-company diligence, the key is to prove stickiness empirically via cohorts (logo + dollar retention) and to isolate “true” switching costs versus temporary friction (e.g., implementation effort that is painful but not differentiating).

* * *

### 2) Revenue mechanics in FSM SaaS: subscription base + usage/FinTech “volume tail”

**FSM SaaS economics often diverge from “pure ARR”** because the platform can include **usage-based components** that scale with customer business volume (e.g., payments, financing, marketing, call tracking, SMS, data services). ServiceTitan explicitly highlights GTV and retention together, signaling that customer expansion is tied not only to seats/modules but also to **activity volume** and **monetization attach**.

A practical way to diligence a similar private target is to decompose revenue into:

1.  **Subscription / platform access (base):**
    *   Priced by technician count, office seats, or tiered packages; often multi-year contracts in mid-market FSM.
    *   Expansion comes from added locations/technicians and module adoption (CRM/marketing, inventory, payroll integrations, etc.).
2.  **Usage-based / FinTech (tail):**
    *   Revenue rises with customer job volume and ticket sizes; the “best customers” (fast growers) can expand automatically without a new sales cycle.
    *   But this introduces **cyclicality** (weather, housing, consumer spend) and potentially higher compliance/operational complexity (payments, financing, disputes).

**Comparable insight from ServiceTitan:** its filings emphasize GTV as a core metric and present scale in both dollars processed and retention/expansion.

**Diligence implication:** For a private FSM target, you should require _two_ versions of “recurring revenue”:

*   A strict **contracted recurring** baseline (classic ARR / subscription-only), and
*   A **normalized run-rate** for usage/FinTech (e.g., trailing 12 months, adjusted for seasonality and macro).

* * *

### 3) Margin model: why FSM SaaS can show “messy” blended gross margin (and still be great)

FSM vendors often report a blended gross margin that mixes:

*   **High-margin software delivery** (hosting, support, product ops), and
*   **Lower-margin “take-rate” businesses** (payments / financing / marketing pass-throughs), and
*   **Professional services** (implementation, onboarding, training), which is frequently **loss-making** at scale because it’s used to accelerate adoption rather than to maximize services margin.

ServiceTitan’s public filings illustrate the pattern:

*   **Platform gross margin** has historically been materially higher than the consolidated gross margin (i.e., software-like), while **professional services and other gross margin** is deeply negative in the periods disclosed.
*   ServiceTitan also reports a **non-GAAP platform gross margin** concept in its IPO materials, underscoring how public comps may adjust for items like stock-based comp and other costs when presenting “core unit economics.”

**Diligence implication:** For a private target, don’t benchmark “gross margin” until you normalize for:

*   Revenue mix (subscription vs usage vs payments-related net revenue),
*   Principal vs agent accounting (net vs gross presentation),
*   Implementation services strategy (profit center vs adoption lever),
*   Cost reclassifications (e.g., customer success sitting in COGS vs S&M—ServiceTitan explicitly discussed shifts affecting platform gross margin).

* * *

### 4) Retention and expansion: what NRR/GRR mean in trades-focused FSM

**Definitions matter.** In SaaS diligence, retention should be cohort-based and tied to revenue dollars (not just logo counts). ServiceTitan defines **net dollar retention rate** in its public filings (and emphasizes its importance as an indicator of expansion after accounting for churn).

**How expansion happens in FSM SaaS (typical):**

*   **Seats and locations:** More technicians → more users → higher subscription fees.
*   **Module expansion (“land and expand”):** CRM/marketing automation, pricebook optimization, inventory, payroll integrations, fleet, reporting.
*   **FinTech / payments attach:** More invoices processed or higher GTV drives more usage-based revenue.
*   **Pricing power:** Mature platforms can reprice via packaging and upsells as customers see ROI.

**ServiceTitan comparable datapoints:**

*   IPO disclosures showed **\>95% gross dollar retention** and **\>110% net dollar retention** across 10 quarters (as of July 31, 2024).
*   In FY25 communications, ServiceTitan continued to highlight NDR above 110% and GDR above 95% (reported as operational highlights).

**Diligence implication:** For a private FSM deal, you should require retention broken down by:

*   Trade (HVAC vs plumbing vs roofing vs commercial),
*   Customer size segment (SMB vs mid-market), and
*   Cohort “age” (new cohorts churn more; mature cohorts often stabilize).  
    Also: isolate expansion due to **customer business growth** (GTV tailwind) versus expansion due to **product monetization** (modules/price).

* * *

### 5) Key SaaS metrics (definitions + benchmark ranges that actually help in diligence)

Below are the metrics that will drive your underwriting, plus commonly referenced benchmarks. Use these as _ranges_, not rules—FSM mix (services + usage/FinTech) can change what “good” looks like.

**ARR / run-rate revenue**

*   **ARR**: Annualized subscription recurring revenue (typically excludes one-time services; may exclude usage unless contracted minimums exist).
*   In mixed models, many companies also disclose **annualized billings** or a “subscription + usage” annualization to reflect run-rate monetization. ServiceTitan uses “annualized billings” in its IPO materials.  
    **Benchmark lens:** Compare subscription ARR growth to cohorts and net retention; compare usage/FinTech to GTV trends and attach/take-rate.

**GRR (Gross Revenue Retention)**

*   Measures how much starting revenue remains after churn/downgrades (before expansions).  
    **Typical private B2B SaaS benchmarks:** SaaS Capital has reported median gross retention around the low 90s in its B2B SaaS retention benchmark work, with higher ACV generally showing higher GRR expectations.

**NRR (Net Revenue Retention) / NDR**

*   Measures retained revenue including expansions; above 100% means expansion offsets churn.  
    **Benchmark lens:**
*   Bessemer’s “good/better/best” framing often cites **~100% / 110% / 120%+** net retention as directional targets depending on stage and segment.
*   Private SaaS survey commentary (KeyBanc/Sapphire) has cited gross retention around ~90% and net retention around ~101% in its survey highlights.
*   ServiceTitan’s IPO materials showed **NDR >110%** and **GDR >95%** (10 quarters as of July 31, 2024), which is consistent with a “healthy expansion + low churn” profile in vertical SaaS.

**CAC payback**

*   Time to recoup customer acquisition costs from gross profit contribution (definitions vary; ensure apples-to-apples).  
    **Benchmarks (directional):**
*   ICONIQ notes CAC payback can be hard to standardize; as a rule of thumb, **12–18 months** is often considered exceptional, while current environments may see longer medians depending on stage.
*   Bessemer’s segment guidance: **<12 months (SMB)**, **<18 (mid-market)**, **<24 (enterprise)** as a target framework.

**Sales efficiency / “Magic Number”**

*   Measures new ARR generated per dollar of S&M spend (definition varies).  
    **Use in diligence:** Helpful as a trend metric (improving vs deteriorating), but requires clean “new ARR” measurement and consistent treatment of expansion.

**Rule of 40 (growth + profitability)**

*   More relevant for mature SaaS; for private FSM targets, a better near-term focus is: (i) retention quality, (ii) CAC payback, (iii) gross margin durability by segment, and (iv) path to FCF with realistic opex leverage.

* * *

### 6) Competitive landscape in FSM: where ServiceTitan sits and how to map the market

FSM competition is best understood as **three overlapping arenas**:

1.  **Down-market / SMB trades platforms (fast onboarding, simpler product)**
    *   Competes on ease-of-use, price, and time-to-value.
    *   Examples often include Jobber, HouseCall Pro, and similar tools focused on scheduling/invoicing plus basic CRM.
2.  **Mid-market “operating system” vertical SaaS (deeper workflows + reporting + integrations)**
    *   Competes on breadth, configurability, multi-location support, and ROI analytics.
    *   ServiceTitan explicitly notes competing against point tools, horizontal solutions, legacy on-prem FSM, and bundled down-market offerings—and gives examples including **FieldEdge, Workwave, ServiceTrade, AccuLynx, BuildOps, HouseCall Pro, JobNimbus, and Jobber**, plus horizontal vendors like **Salesforce** and **SAP**.
3.  **Enterprise / horizontal FSM suites (often for complex asset-heavy service orgs)**
    *   Includes broader CRM/ERP ecosystems where FSM is a module (and procurement can be “suite-driven”).
    *   Diligence angle: these vendors can be formidable in enterprise accounts, but may be weaker in trades-specific workflows and implementation playbooks.

**Diligence implication:** Your competitive assessment should be segmented by:

*   Customer size (SMB vs mid-market vs enterprise),
*   Trade (residential vs commercial; HVAC vs roofing differs),
*   Implementation complexity (weeks vs months),
*   Payments/financing attach (differentiation vs commodity).

* * *

Accounting Policies
-------------------

FSM SaaS tends to trigger a few accounting and quality-of-earnings hotspots; ServiceTitan’s public reporting offers a checklist for what to test:

*   **Revenue recognition: subscription vs usage vs services.** Ensure the target’s revenue streams are disaggregated similarly (subscription/platform, usage/FinTech, and professional services) and confirm whether usage is recognized on actual consumption versus contractual minimums.
*   **Principal vs agent (payments/FinTech).** If the target monetizes payments or financing, confirm whether revenue is reported **net** (agent) or **gross** (principal). This can materially change gross margin comparability even if unit economics are identical.
*   **Capitalized software and internal-use development.** SaaS companies commonly capitalize certain software costs, which affects EBITDA and FCF profiles; ServiceTitan’s filings discuss capitalized internal-use software within investing cash flows.
*   **Deferred contract costs (commissions).** Confirm policy for capitalizing and amortizing sales commissions; this is often a major working-capital and earnings-quality topic in subscription businesses.
*   **Stock-based compensation and IPO-related distortions.** Public comp margins (especially non-GAAP) often exclude stock-based comp, restructuring, and other items; ServiceTitan’s non-GAAP reconciliations explicitly remove SBC and other adjustments.

* * *

Financial Summary (ServiceTitan)
--------------------------------

**Income statement and cash flow snapshot** _(USD $ millions; FY ends Jan 31; “9M” periods end Oct 31; some 9M subtotals derived from cost + gross profit in filings; table shown without citations)_

| ($M) | FY23 | FY24 | FY25 | 9M Oct31’24 | 9M Oct31’25 |
| --- | --- | --- | --- | --- | --- |
| Total revenue | 468.7 | 614.3 | 771.9 | 562.6 | 707.0 |
| Platform revenue | 443.5 | 581.8 | 739.5 | — | — |
| Prof. services & other revenue | 25.1 | 32.5 | 32.5 | — | — |
| Gross profit | 266.0 | 376.6 | 500.9 | 362.8 | 496.1 |
| Gross margin | 56.8% | 61.3% | 64.9% | 64.5% | 70.2% |
| Platform gross margin (derived) | 68.2% | 70.8% | 72.6% | — | — |
| Sales & marketing | 196.8 | 220.0 | 253.3 | 183.6 | 217.0 |
| R&D | 158.9 | 203.5 | 263.1 | 187.0 | 220.7 |
| G&A | 132.2 | 136.0 | 214.5 | 122.2 | 184.9 |
| Loss from operations | (221.9) | (182.9) | (230.0) | (130.1) | (126.5) |
| Net loss | (269.5) | (195.1) | (239.1) | (138.2) | (118.1) |
| Net cash from operations | — | (39.7) | 37.1 | 21.6 | 69.6 |
| Non-GAAP free cash flow | — | (84.3) | 15.5 | — | — |

**Context for diligence:**

*   FY23–FY25 revenue growth remained high, while **platform gross margin** trended upward and the consolidated gross margin improved materially (mix + scale).
*   ServiceTitan’s filings show **professional services and other** as structurally low/negative margin relative to platform, consistent with “services as adoption accelerator.”
*   Cash generation improved: FY25 operating cash flow turned positive, and the company disclosed a non-GAAP free cash flow reconciliation.

**Common EBITDA adjustments to expect in FSM SaaS (and to request explicitly):**

*   Stock-based compensation (often the largest addback in growth-stage SaaS)
*   Amortization of acquired intangibles / acquisition-related items (if acquisitive)
*   Restructuring, lease impairment, and other one-time charges (especially post-IPO footprint changes)
*   Capitalized development and amortization policy impacts (internal-use software)

* * *

Key Findings (Comparable takeaways to apply to a private FSM SaaS deal)
-----------------------------------------------------------------------

1.  **FSM “operating system” positioning supports strong expansion, but mix matters.** ServiceTitan’s disclosures show high retention/expansion with a platform-plus-usage model; a private target should prove whether NRR is driven by product expansion/price (durable) versus customer volume tailwinds (more cyclical).
2.  **Blended gross margin can mislead without segment normalization.** Platform margins may look SaaS-like while implementation/services can be negative; diligence should re-cut margins by (i) subscription, (ii) usage/FinTech, (iii) services to understand the real unit economics and scalability.
3.  **GTV-linked monetization adds upside and underwriting complexity.** Using GTV as an operating metric highlights the power of volume-based expansion, but it requires stress tests on housing/weather sensitivity, attach rates, and take-rate durability under competitive pressure.
4.  **Sales efficiency should be judged on trend + cohort outcomes, not one metric.** Benchmarks (CAC payback, NRR, GRR) are useful guardrails, but the diligence priority is: are new cohorts retaining and expanding, and is acquisition efficiency improving over time?
5.  **Competitive risk is segment-specific (SMB vs mid-market vs suites).** ServiceTitan explicitly cites competition from point tools, horizontal suites, and down-market bundled offerings; your diligence should map competitors by segment and quantify win/loss reasons and pricing pressure.

* * *

Diligence Playbook (for a private FSM SaaS target)
--------------------------------------------------

### Value driver tree (FSM SaaS lens)

**1) Revenue growth**

*   New customer adds × (ACV / ARPA)
*   Expansion: seats + modules + FinTech/usage attach
*   Pricing: packaging, reprice cadence, discounts and concessions

**2) Retention quality**

*   Logo retention (by cohort)
*   GRR (downgrade + churn control)
*   NRR (expansion engine) with clear attribution (price vs product vs volume)

**3) Gross profit engine**

*   Platform gross margin: hosting + support + customer success cost placement
*   Payments/FinTech: net vs gross presentation; take-rate; chargebacks/fraud costs
*   Services: implementation cost per go-live; time-to-live; partner vs in-house mix

**4) Operating leverage and cash**

*   S&M efficiency (CAC payback and sales efficiency trend)
*   R&D scale (roadmap vs support burden; technical debt)
*   Working capital: deferred revenue, contract assets, deferred commissions
*   Capex/capitalization: capitalized software and amortization impact

* * *

### P&L walkthrough: what to test, line by line

**Revenue**

*   Split subscription vs usage/FinTech vs services; verify contract terms and renewal mechanics.
*   For usage: tie revenue to measurable drivers (GTV, invoice count, financing volume, marketing spend) and test sensitivity under downside scenarios.

**COGS / gross margin**

*   Separate platform delivery costs from services delivery costs; confirm where customer success sits (COGS vs S&M) and whether classification changed.

**Sales & marketing**

*   Build a bookings waterfall and reconcile to ARR / deferred revenue / billings; assess discounting, ramp, and channel mix.
*   Benchmark CAC payback by segment (SMB/mid-market/enterprise) rather than one blended metric.

**R&D**

*   Quantify maintenance burden vs net-new product; roadmap dependency for retention (e.g., roofing/commercial push).
*   Review capitalized software policy and impact on EBITDA/FCF.

**G&A**

*   Public-company comps may have elevated G&A due to compliance and SBC; normalize for private-company run-rate but don’t ignore the “cost of being real.”

* * *

### Workstreams (what your team should actually do)

1.  **Revenue & bookings quality**
    *   Cohort ARR bridge (start ARR → churn → contraction → expansion → end ARR) by trade and customer size.
    *   Top 50 customer deep dives: why they buy, what modules they use, what drives expansion.
    *   Contracting: renewal terms, auto-renew, price escalators, termination rights.
2.  **Retention & customer outcomes**
    *   GRR/NRR definitions audit; reconcile to invoicing and revenue.
    *   “Outcome proof”: do customers grow revenue, close rates, and productivity post-implementation? (Causality is hard; triangulate via usage + case data.)
3.  **GTM efficiency**
    *   CAC payback by segment and channel; ramp time; quota attainment; pipeline coverage.
    *   Win/loss analysis: price vs product vs implementation vs “suite bundling.”
4.  **Product and implementation engine**
    *   Time-to-go-live distribution; backlog; rework rates.
    *   Services gross margin strategy (profit center vs adoption accelerator).
    *   Partner ecosystem and integration reliability.
5.  **FinTech / payments (if applicable)**
    *   Attach rate by cohort; take-rate; unit economics net of processor costs.
    *   Fraud/chargebacks, reserves, compliance, and customer support load.
6.  **Accounting & QoE**
    *   Revenue recognition by stream, principal/agent stance, deferred commissions, capitalization policy, SBC normalization.

* * *

Data Requests (prioritized)
---------------------------

| Priority | Request | Why it matters |
| --- | --- | --- |
| High | ARR (or subscription run-rate) by trade, customer size, and cohort month | Establish segment economics and real compounding |
| High | NRR/GRR cohort tables with explicit numerator/denominator + methodology | Prevent “metric drift” and validate retention engine |
| High | Revenue split: subscription vs usage/FinTech vs services (monthly for 24–36 months) | Underwrite mix, cyclicality, and margin durability |
| High | Bookings waterfall + deferred revenue / billings reconciliation | Validate growth quality and forecastability |
| High | CAC payback by segment + channel + cohort (with gross margin assumption shown) | Test efficiency and scale viability |
| High | Implementation KPIs: time-to-live, cost per go-live, backlog, churn-before-live | FSM success hinges on onboarding execution |
| Medium | Module adoption and attach rates by cohort | Identify expansion levers and roadmap risk |
| Medium | Pricing and discount logs (by segment; changes over time) | Assess pricing power and competitive pressure |
| Medium | Support and CS metrics (tickets per customer, NPS, churn reasons) | Diagnose retention drivers and hidden COGS |
| Medium | Payments/FinTech economics (attach, take-rate, losses, reserves, compliance) | High upside; can be high risk |
| Low | Product telemetry dashboards and roadmap dependency map | Helps validate moat and retention drivers |

* * *

Sources
-------

1.  ServiceTitan IPO S-1 (business framing, TAM methodology, retention and GTV disclosures, competitor examples).
2.  ServiceTitan FY25 10-K excerpts (revenue, cost structure, operating losses, cash flow and free cash flow reconciliation).
3.  ServiceTitan FY26 10-Q (nine months ended Oct 31, 2025) excerpts (revenue mechanics, gross margin dynamics, operating expense profile, non-GAAP definitions).
4.  SaaS benchmark references used for diligence guardrails (NRR/GRR and CAC payback ranges).
5.  IPO timing and market context (pricing, trading debut).



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)