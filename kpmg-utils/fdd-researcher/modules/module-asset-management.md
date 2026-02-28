## Part 1: Industry Identification

### Question 1: What words/phrases/concepts signal **Asset Management (PE, Hedge Funds, Wealth Management)**?

**Your answer:**

Think in terms of “money managed for clients/investors” + “fees as % of assets/performance” + “regulated adviser language.” Common CIM/VDD tells:

### Cross-cutting (all asset managers)

* **AUM / AUA / AUM&A** (Assets Under Management / Advisement / Administration)
* **Net flows / net new assets / NNA**, **gross inflows**, **redemptions**
* **Fee rate / blended fee rate / bps**, **management fee schedule**, **breakpoints**
* **Management fees**, **advisory fees**, **asset-based fees**, **wrap fee**
* **Performance fees / incentive fees / performance allocation**, **high-water mark**, **hurdle**
* **Fee-paying AUM / fee-earning AUM / FPAUM**, **eligible AUM**
* **Product/strategy language:** “strategies,” “mandates,” “vehicles,” “funds,” “accounts”
* **Client segments:** “institutional,” “HNW,” “mass affluent,” “family office,” “retail,” “platform”
* **Regulatory terms:** **RIA**, **SEC-registered investment adviser**, **Form ADV**, “fiduciary,” “best interest,” “custody rule,” “KYC/AML,” “compliance program,” “Chief Compliance Officer (CCO)”

### Private Equity / Alternatives manager tells

* **GP / LP**, “general partner,” “limited partner,” “fund management company”
* **Fundraising**, **commitments**, **closes**, **vintage**, **dry powder**, “capital call,” “distributions”
* **Carry / carried interest**, “waterfall,” **preferred return**, “catch-up,” **clawback**
* **IRR / MOIC / TVPI / DPI**, “realizations,” “exit environment”
* **Transaction/monitoring fees**, **fee offsets**, “portfolio company services”
* **Perpetual capital**, “open-ended funds,” “interval fund,” “evergreen,” “NAV-based vehicle”
* **Subscription line / capital call facility** (often discussed in fund mechanics)

### Hedge fund manager tells

* **2 and 20** (or variations), “management fee + incentive fee”
* **High-water mark**, “crystallization,” “equalization,” “side pocket,” “gates”
* **Prime broker**, “margin,” “financing,” “ISDA,” “counterparty,” “PB relationships”
* **Sharpe**, “volatility,” “drawdown,” “VaR,” “risk limits”
* **Multi-manager / pod structure**, “pass-through expenses,” “platform fees”
* **Investor lockups**, “redemption terms,” “notice periods”

### Wealth management / RIA / broker-adjacent tells

* **Financial planning**, “advisor,” “wealth management,” “RIA,” “independent advisor”
* **Client households**, **relationships**, “advisor productivity”
* **SMA / UMA**, model portfolios, “managed accounts”
* **Custodian** (Schwab/Fidelity/Pershing), “platform,” “TAMP”
* **Billing in advance** (common), quarterly billing cycles
* **Payout ratio**, “advisor compensation grid” (if broker-dealer model)
* **AUA vs AUM** (brokerage assets administered but not managed)

---

## Part 2: Units That Matter

### Question 2: 5–8 KPIs a generalist must understand

**Your answer:**

| KPI                                                            | Definition (practitioner version)                                                                                                                                                                                                                                         | Why it matters in diligence                                                                                                                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Assets Under Management (AUM)** / **Fee-Paying AUM (FPAUM)** | The asset base the firm actually earns fees on (FPAUM excludes waived/zero-fee assets and sometimes excludes non-discretionary or “non-fee” assets).                                                                                                                      | **Revenue engine.** Most economics are “bps × AUM.” Need to know what’s *fee-earning* vs marketing AUM.                                                                                  |
| **Net Flows / Net New Assets (NNA)**                           | Client money in minus money out, usually separated into **gross inflows** and **redemptions**; often shown **net of market impact**.                                                                                                                                      | Separates “markets bailed us out” from true commercial momentum. Persistent outflows = structural issue (performance, service, pricing, distribution).                                   |
| **Blended Fee Rate (bps)** / **Realized fee rate**             | Average net fee charged across products/clients after breakpoints, rebates, platform revenue-share, fee waivers, etc.                                                                                                                                                     | Small bps moves are huge dollars. Fee compression and mix shifts can quietly erode earnings even if AUM grows. McKinsey highlights fee pressure across multiple asset classes 2021–2024. |
| **Management Fee Revenue**                                     | Recurring base fees (often billed monthly/quarterly; for RIAs often quarterly in advance).                                                                                                                                                                                | This is the “quality” revenue stream used to underwrite. Underpins **FRE/EBITDA** and valuation stability.                                                                               |
| **Performance Fees / Incentive Fees / Carried Interest**       | Variable, performance-linked revenue: hedge funds (incentive fee, high-water mark); PE/alternatives (carry based on realizations and waterfall).                                                                                                                          | Can dominate profits in good years but is **lumpy and reversible**. Drives QoE normalization and risk assessment (clawbacks, unrealized carry).                                          |
| **Fee-Related Earnings (FRE)** (alts) / **Adjusted EBITDA**    | A manager-specific “baseline profitability” metric focusing on recurring fee revenue net of operating costs, typically excluding realized carry/performance fees. Public alts often disclose FRE and FRE margin (e.g., Carlyle reported a 46% FRE margin in one quarter). | Helps diligence isolate **steady-state earnings** vs cyclic carry. Also highlights comp discipline and scalability.                                                                      |
| **Investment Performance vs Benchmark / Peer** (net)           | Track record clients care about: net returns vs stated benchmark/peer quartile, plus risk metrics.                                                                                                                                                                        | **Flows follow performance** (with a lag). Weak performance often shows up first as “slower fundraising” or “platform pressure,” then outflows.                                          |
| **Client Concentration & Retention**                           | % of AUM/revenue from top clients/platforms and how “sticky” it is (lockups, mandates, renewal cycles).                                                                                                                                                                   | A few platforms/allocators can move the needle. Concentration + short redemption terms = earnings fragility.                                                                             |

---

## Part 3: Value Driver Framework

### Question 3: What does the EBITDA value driver tree look like?

**Your answer:**

```text
EBITDA (Management Company)
├── Net Revenue
│   ├── Management / Advisory Fees (recurring)
│   │   ├── Avg Fee-Paying AUM (FPAUM)
│   │   │   ├── Beginning FPAUM
│   │   │   ├── + Gross inflows (new mandates, new clients, fundraising closes)
│   │   │   ├── - Redemptions / drawdowns / mandate losses
│   │   │   ├── ± Market & FX performance (AUM beta)
│   │   │   └── ± M&A (acquired AUM / sold strategies)
│   │   ├── × Blended fee rate (bps)
│   │   │   ├── Product/strategy fee schedule
│   │   │   ├── Client tiering / breakpoints
│   │   │   ├── Channel/platform revenue share / retrocessions
│   │   │   └── Fee waivers / rebates / founder share classes
│   │   └── Billing mechanics
│   │       ├── In advance vs in arrears (cash + deferred revenue implications)
│   │       └── Frequency (monthly/quarterly) & true-ups
│   ├── Performance-Based Revenue (volatile)
│   │   ├── Hedge fund incentive fees
│   │   │   ├── Eligible NAV × incentive rate
│   │   │   └── Subject to: high-water mark, hurdle, crystallization schedule
│   │   ├── PE / alternatives carried interest
│   │   │   ├── Realizations & profit pool × carry %
│   │   │   └── Subject to: preferred return, catch-up, escrow/clawback
│   │   └── Fee-related performance fees (some perpetual vehicles)
│   ├── Other Revenue
│   │   ├── Transaction / monitoring / advisory fees (often offset against mgmt fees)
│   │   ├── Fund admin / reporting / subscription services
│   │   ├── Placement / distribution / referral fees
│   │   └── Interest income on cash (sometimes meaningful, sometimes excluded in QoE)
│   └── Gross-to-Net Adjustments / Contra-revenue
│       ├── Fee waivers & rebates
│       ├── Platform revenue shares / distribution servicing fees
│       ├── Fee offsets (PE monitoring fees offsetting management fees)
│       └── Regulatory/client expense reimbursements (presentation matters: gross vs net)
├── Operating Costs
│   ├── Compensation & Benefits (largest bucket)
│   │   ├── Investment staff (PMs, analysts, deal team)
│   │   ├── Distribution / IR / client service
│   │   ├── Operations / middle & back office
│   │   └── Variable comp pool (often % of revenue / profits; retention bonuses)
│   ├── G&A
│   │   ├── Compliance / legal / audit / tax
│   │   ├── Finance / HR / admin
│   │   └── Insurance (E&O, D&O), regulatory fees
│   ├── Technology & Data
│   │   ├── Portfolio/accounting/CRM systems
│   │   ├── Market data, research, analytics, cybersecurity
│   │   └── Vendor spend (outsourced ops, fund admin if borne by manager)
│   ├── Sales & Marketing
│   │   ├── Conferences, travel, RFPs, consultant coverage
│   │   └── Channel/platform support
│   └── Occupancy & Other
│       ├── Rent, facilities
│       └── Professional fees / one-offs (often adjusted)
└── Add-backs / Normalizations (common in QoE)
    ├── Non-recurring legal/regulatory remediation
    ├── Deal costs, integration costs
    ├── Owner compensation normalization
    └── Share-based comp / amortization of acquired intangibles (policy-dependent)
```

Key **mix effects** to explicitly model:

* **Asset mix:** alternatives/active equity vs passive vs fixed income vs money market (big bps differences; McKinsey shows meaningful fee levels and declines by asset class).
* **Client/channel mix:** institutional vs wealth vs retail; direct vs platform (platform share reduces net bps)
* **Vehicle mix:** closed-end drawdown funds vs perpetual vehicles vs separately managed accounts (SMAs)
* **Geography mix:** regulatory and platform differences (esp. EU/UK vs US)

---

### Question 4: Full cost structure & what drives margins

**Your answer:**

#### 1) P&L overview (how it “really works”)

Asset management is typically:

* **High gross margin / low capital intensity**
* **People + compliance + distribution** are the core cost stack
* Economics depend heavily on:

  * **Scale** (AUM per employee, tech leverage)
  * **Fee rate & mix**
  * **Variable compensation discipline**
  * **Revenue volatility** (performance fees, carry)

#### 2) “COGS” / cost of revenue (what’s in it, typical range)

Many asset managers don’t have classic COGS; instead you’ll see:

* **Distribution/platform servicing costs** (revenue share, retrocessions, 12b-1 equivalents in some contexts)
* **Sub-advisory / third-party management fees** (if they outsource sleeves)
* **Custody/admin costs borne by manager** (varies; often charged to funds/clients instead)
* **Pass-through expenses** (more common in some hedge fund structures; needs careful gross vs net treatment)

**What moves gross margin**

* **Platform revenue share changes**
* **Shift to lower-fee products** (ETFs/passives, money market)
* **More/less outsourcing vs in-house**
* **Fee waivers/rebates** used to win flows or seed products

#### 3) Operating expenses (major buckets + how they behave)

**Compensation & Benefits**

* Usually the **largest** expense; mix of fixed salary + variable bonus.
* Variable comp often scales with revenue/profit (natural shock absorber).

**Distribution / Marketing / IR**

* Headcount + travel/conferences + consultant coverage.
* More variable for growth-oriented firms.

**G&A / Compliance / Legal**

* Semi-fixed; tends to rise with AUM complexity, product complexity, and regulatory posture.
* Compliance costs are a recurring “floor,” not optional.

**Technology & Data**

* Semi-fixed; rising importance (cybersecurity, data, CRM, portfolio systems).

**Typical margin ranges (directional, varies by segment/scale)**

* **Wealth management / RIAs:** Schwab benchmarking data shows **median standardized operating income margins in the high-20s to low-30s (%)** by AUM peer group (e.g., ~27–33% in one study view).
* **Alternatives managers:** often present **FRE margins** that can be quite high in strong periods; e.g., Carlyle cited a **46% FRE margin** in a quarter (illustrative of the economics of fee-based earnings).
* **Traditional asset managers:** profitability is under pressure from fee compression; Reuters cited industry operating profits falling as bps of AUM (10.1 bps in 2021 to 8.2 in 2023 in one study) and projected further declines.

#### 4) Unit economics (what to anchor on)

A simple, powerful unit view:

* **Revenue per $1B FPAUM** = **$1B × blended fee rate**

  * 50 bps → **$5.0M** annual management fee revenue
  * 100 bps → **$10.0M**
* **Profit per $1B FPAUM** then depends on:

  * Comp ratio
  * Overhead allocation
  * Platform fee leakage
  * Incremental servicing needs

For wealth management, common “units”:

* **Revenue per advisor**
* **AUM per advisor**
* **Revenue per client household**
* **Operating profit per advisor/team**

#### 5) What separates high-margin from low-margin operators?

**High-margin**

* Sticky, long-duration capital (perpetual/evergreen, diversified clients)
* Strong distribution engine and brand
* Disciplined comp/bonus framework; low turnover
* Limited fee leakage; healthy pricing power
* Scalable operating model (tech + standardized workflows)

**Low-margin**

* Heavy reliance on a few platforms/allocators or star PMs
* Meaningful fee waivers/rebates to hold assets
* High payout/advisor grids (wealth) without scale benefits
* Operational sprawl and weak cost control
* Revenue volatility dominated by performance fees/carry with thin recurring base

---

### Question 5: Working Capital value driver tree

**Your answer:**

Working capital is usually **light** versus industrial businesses, but can have meaningful timing effects and “cash traps.”

```text
Operating Working Capital
├── Receivables
│   ├── Management fee receivable
│   │   ├── Billing frequency (monthly/quarterly)
│   │   ├── In arrears vs advance
│   │   └── Disputes/true-ups (breakpoints, fee schedules, performance adjustments)
│   ├── Performance fee receivable
│   │   ├── Hedge fund incentive fees (crystallization timing)
│   │   └── Carry receivable / accrued performance revenue (realization timing, reversals)
│   └── Other receivables
│       ├── Expense reimbursements
│       └── Related party/fund receivables (watch allocations)
├── Payables & Accruals
│   ├── Accrued compensation & bonus (often the biggest accrual)
│   ├── Trade payables (vendors, data providers, legal, tech)
│   ├── Revenue share / rebates payable to platforms/clients
│   └── Taxes payable (including partner tax distribution mechanics in partnerships)
└── Other WC items (often “the story”)
    ├── Deferred revenue (common for RIAs billing quarterly in advance)
    ├── Deferred comp liabilities / retention programs
    ├── Carry clawback / escrow reserves (alts)
    └── Prepaids (insurance, data contracts) & regulatory fees
```

**Receivables / DSO (what drives it)**

* Billing in arrears + quarterly billing can create “naturally higher” DSO.
* Performance fees can be large and slow to settle depending on crystallization and investor statements.
* Watch for **A/R aging** spikes → disputes, client stress, or weak billing controls.

**Inventory**

* Not applicable.

**Payables / DPO**

* Fairly standard; major driver is vendor management + bonus accrual timing.

**Cash conversion patterns**

* Generally short, but:

  * **RIAs billing in advance** can create **negative working capital** (cash upfront; revenue recognized over time).
  * **Carry/performance fees** create lumpiness and can reverse (cash trap risk if distributed before final clawback outcomes).

---

### Question 6: Capex in this industry

**Your answer:**

Capex is usually **low**, but “growth investment” often shows up as **Opex (headcount)** or **M&A** (acquisitions of books/teams).

#### Growth capex / growth investments

* **Technology platforms** to scale (CRM, billing, portfolio reporting, client portals)
* **New strategy launches** (often more Opex: seed hires, research, legal structuring)
* **Distribution expansion** (mostly headcount + marketing spend)
* **Acquisitions** (RIA roll-ups, team lifts) → more “investing cash flow” than capex

Ramp-up:

* New funds/strategies: fundraising ramp can be **12–36+ months** depending on channel and track record.
* New RIA teams: typically **6–18 months** to normalize productivity after transition.

#### Maintenance capex

* Office refresh/buildout (minor)
* Routine IT hardware, security upgrades
* Ongoing systems maintenance

#### Technology / digital “capex-like” items to watch

* Major **CRM / billing system** implementations (data migration risk)
* **Portfolio accounting** or **data lake** programs
* **Cybersecurity** tooling + incident response readiness
* Potential capitalization of internal-use software (accounting policy)

---

## Part 4: Common Analysis & Roadmap

### Question 7: Standard analyses performed in this industry

**Your answer:**

| Analysis                                         | What it shows                                                                                        | Good vs. concerning                                                                                                                                                              |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AUM bridge (roll-forward)**                    | Beginning AUM → +/– market impact → + inflows – redemptions → ending AUM, by strategy/channel        | **Good:** positive net flows and diversified growth. **Concerning:** AUM up only due to markets; persistent net outflows masked by “market tailwinds.”                           |
| **Net flows decomposition**                      | Gross inflows vs redemptions by product/client/channel; retention                                    | **Good:** broad-based inflows, stable redemption rates. **Concerning:** one platform drives inflows, elevated redemptions after performance drawdowns.                           |
| **Fee rate / bps analysis**                      | Blended fee rate trend and drivers (mix, pricing, rebates, platform share)                           | **Good:** stable bps or mix shift to higher-fee strategies. **Concerning:** silent bps erosion (fee compression); McKinsey shows fee declines across multiple classes 2021–2024. |
| **Management fee revenue model**                 | Revenue = Avg FPAUM × bps, tested vs actual billed fees                                              | **Good:** clean tie-out, predictable billing. **Concerning:** frequent true-ups, disputes, “manual” billing processes, unexplained variances.                                    |
| **Performance fee / carry quality analysis**     | Realized vs unrealized; concentration by fund; sensitivity to marks/realizations; reversals/clawback | **Good:** diversified sources, conservative recognition, clear waterfall status. **Concerning:** earnings propped by one-off crystallizations or aggressive accruals.            |
| **Segment profitability (strategy/channel P&L)** | Which strategies actually make money after comp, distribution, platform fees                         | **Good:** profitable core + scalable growth areas. **Concerning:** “headline AUM” strategy is low margin; profitable segment shrinking.                                          |
| **Compensation ratio + headcount productivity**  | Revenue per employee, AUM per employee, comp as % of revenue                                         | **Good:** disciplined comp, improving productivity with scale. **Concerning:** comp inflation, retention bonuses, rising cost base without flows.                                |
| **Client concentration & stickiness**            | Top clients/platforms by AUM/revenue; contract terms; redemption rights                              | **Good:** diversified, sticky mandates, long lockups. **Concerning:** one allocator/platform can pull 10–30%+ of AUM quickly.                                                    |
| **Performance / track record review**            | Net returns vs benchmark/peer quartile; consistency and drawdowns                                    | **Good:** consistent above-benchmark with controlled risk. **Concerning:** repeated underperformance; outflows lagging performance.                                              |
| **Regulatory & compliance assessment**           | Exam findings, policies, incident history, marketing practices                                       | **Good:** clean exams, mature controls. **Concerning:** repeat findings, weak disclosures, marketing/fee transparency issues.                                                    |

---

### Question 7b: What data unlocks each analysis?

**Your answer:**

| Analysis                                | Data required                                                                  | Request wording                                                                                                                                                | Priority |
| --------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| AUM bridge                              | Monthly/quarterly AUM by strategy/vehicle + flows + market impact              | “Monthly AUM roll-forward by strategy and vehicle (begin AUM, inflows, outflows, market/FX), trailing 36 months”                                               | P1       |
| Net flows                               | Gross inflows/redemptions by product & channel                                 | “Monthly gross inflows and redemptions by strategy, vehicle, and distribution channel (trailing 36 months)”                                                    | P1       |
| Fee rate analysis                       | Fee schedules + realized bps by product/client + rebates/revenue share         | “Current fee schedules by product and client tier; realized net fee rate (bps) by strategy/channel quarterly, trailing 12 quarters, including rebates/waivers” | P1       |
| Mgmt fee revenue model tie-out          | Billing files + invoices + A/R aging                                           | “Quarterly management fee billings detail (invoice-level) with A/R aging and true-ups, trailing 12 quarters”                                                   | P1       |
| Performance fee/carry quality           | Performance fee calculation support; carry schedules by fund; waterfall status | “Performance fee and carry detail by fund/vehicle: terms, crystallization, realized/unrealized amounts, clawback/escrow, trailing 12 quarters + YTD”           | P1       |
| Segment profitability                   | Revenue and direct costs by strategy/channel; headcount allocation             | “Segment P&L by strategy/channel including allocated comp, distribution, and overhead methodology (annual + quarterly for last 3 years)”                       | P1       |
| Productivity & comp ratio               | Org chart; headcount roster; comp (cash + accrual); bonus policy               | “Employee roster with role, location, start date, total cash comp (base/bonus) and allocation to strategy; trailing 24 months”                                 | P1       |
| Client concentration                    | Top clients/platforms with AUM, revenue, fee rate, redemption terms            | “Top 25 clients/platforms: AUM, revenue, fee rate (bps), mandate type, lockup/redemption terms, start date; latest quarter”                                    | P1       |
| Performance / track record              | Net returns by strategy/fund; benchmarks; assets by strategy                   | “Monthly net performance by strategy/fund vs benchmark (trailing 5 years) and AUM by strategy for the same period”                                             | P1       |
| Compliance                              | Form ADV, policies, exam reports, litigation log                               | “Most recent Form ADV Part 1/2, last 3 SEC exam letters/findings and remediation status, litigation/regulatory matters list”                                   | P1       |
| RIA-specific billing & deferred revenue | Billing policy, invoices, deferred revenue roll-forward                        | “RIA fee billing policy (advance vs arrears) + quarterly deferred revenue roll-forward and billing files, trailing 12 quarters”                                | P2       |
| Pipeline/fundraising                    | CRM/pipeline, commitments by stage, consultant coverage                        | “Fundraising pipeline by product: target, soft-circled, hard-circled, expected close timing; trailing 24 months history of closes”                             | P2       |

---

## Part 5: Red Flags

### Question 8: 8–10 red flags in this industry

**Your answer:**

| Red flag                                                   | Early signal (CIM/VDD)                                          | Data room signal                                                   | Why it’s a problem                                           | How to investigate                                                                                     |
| ---------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **AUM growth is market-only**                              | “Strong AUM growth despite macro volatility” but no flow detail | AUM bridge shows negative net flows; AUM up due to markets         | Commercial momentum weak; down markets will hit revenue hard | Demand AUM bridge + net flows by strategy/channel; correlate flows with performance                    |
| **Fee compression / heavy fee waivers**                    | “Competitive pricing initiatives” / “strategic fee alignment”   | Declining realized bps; large rebates; platform rev-share rising   | Hidden revenue erosion; hard to reverse                      | Pull fee rate waterfall: gross bps → waivers/rebates → net bps by product and client                   |
| **Over-reliance on performance fees/carry**                | “Record earnings” driven by “strong realizations”               | EBITDA heavily tied to carry/incentive; large unrealized marks     | Earnings not repeatable; potential reversals/clawbacks       | Separate FRE vs carry; analyze realized vs unrealized; inspect clawback/escrow                         |
| **Client/platform concentration**                          | “Diversified client base” with no numbers                       | Top 5 clients/platforms >30–50% of AUM/revenue                     | Key client loss = step-change in earnings                    | Request top clients/platforms with terms; review mandate renewal and redemption rights                 |
| **Key person / star PM risk**                              | Heavy emphasis on founder/flagship PM/team                      | High comp to a few individuals; non-competes weak; high turnover   | AUM can walk out the door                                    | Review employment/comp plans; retention tools; succession planning; client ownership                   |
| **Weak performance track record**                          | Benchmark comparisons missing; “risk-managed returns” vague     | Persistent underperformance vs benchmark/peer quartile             | Drives outflows + fundraising slowdown                       | Request net returns vs benchmark; peer rankings; attribution; client redemption history post-drawdowns |
| **Aggressive revenue recognition of incentive fees/carry** | “Normalized performance fees” / “accrued carry” language        | Large accrued incentive fee receivable; reversals in later periods | QoE overstatement                                            | Review accounting policy and subsequent reversals; tie to crystallization/waterfall                    |
| **Compliance/regulatory issues**                           | “Investing in compliance infrastructure” / “enhanced controls”  | Repeat exam findings; remediation not closed; marketing issues     | Fines, reputational damage, investor distrust                | Review exam letters and remediation; test policies; interview CCO                                      |
| **Pass-through / allocation games**                        | “Expense reimbursements from funds”                             | Shifting costs between manager and funds; inconsistent allocations | Distorts true margin; LP relations risk                      | Reconcile reimbursements; review allocation policy; test samples                                       |
| **Fundraising slowdown / strategy saturation**             | “Selective fundraising” / “focus on quality capital”            | Pipeline thin; closes delayed; higher placement agent use          | Future AUM growth at risk                                    | Analyze fundraising pipeline vs targets; consultant feedback; win/loss in RFPs                         |

Regulatory nuance to remember: US “Private Fund Adviser Rules” adopted in 2023 were **vacated** by the Fifth Circuit effective **June 5, 2024** (SEC has an announcement summarizing the vacatur).  That doesn’t remove broader fiduciary/compliance obligations, but it changes what you might expect to see as “new rule compliance” in a CIM.

---

### Question 8b: CIM language that should trigger concern

**Your answer:**

| Phrase in CIM                                            | What it signals                       | Follow-up                                                              |
| -------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| “**AUM grew despite challenging markets**” (no bridge)   | Could be market-only growth           | Request AUM bridge: flows vs performance                               |
| “**Pricing initiatives / fee alignment**”                | Fee compression or waivers            | Ask for realized bps trend + rebates/waivers schedule                  |
| “**Normalized / adjusted performance fees**”             | Potentially aggressive smoothing      | Request fund-level incentive/carry detail and reversals history        |
| “**Diversified investor base**” (no concentration table) | Concentration risk                    | Request top 25 clients/platforms with AUM/revenue/terms                |
| “**Investment in compliance**”                           | Past gaps or upcoming cost step-up    | Ask for exam history, remediation plan, and run-rate compliance spend  |
| “**Strong pipeline / fundraising momentum**”             | May be marketing language             | Ask for pipeline by stage + historical conversion rates                |
| “**Non-recurring expenses**” (large add-backs)           | QoE risk                              | Request detailed adjustment bridge with support                        |
| “**Founder-led / flagship strategy**”                    | Key person dependence                 | Ask succession plan, retention, team ownership of client relationships |
| “**Expense reimbursements / pass-throughs**”             | Presentation and allocation risk      | Ask for allocation policy + reconciliation manager vs fund expenses    |
| “**Perpetual capital / evergreen**”                      | Different fee and liquidity mechanics | Ask redemption terms, gating, liquidity management, and investor mix   |

---

## Part 6: First Data Requests

### Question 9: Standard first-round data requests

**Your answer:**

#### P1 (Critical)

1. **AUM & flows**

   * Monthly AUM roll-forward by strategy/vehicle/channel (36 months)
   * Gross inflows, redemptions, net flows, market/FX impact

2. **Revenue build**

   * Monthly/quarterly revenue by type: management/advisory fees, performance fees/carry, other (36 months)
   * Bridge to billed invoices and GL

3. **Fee rates & economics**

   * Fee schedules by product and client tier
   * Realized net fee rate (bps) by strategy/channel, quarterly (12 quarters)
   * Rebates/waivers/revenue-share agreements summary

4. **Client/platform concentration**

   * Top 25 clients/platforms: AUM, revenue, bps, contract type, lockups/redemption terms, start date

5. **Performance track record**

   * Monthly net performance by fund/strategy vs benchmark (5 years) + drawdowns and volatility metrics

6. **Cost base & org**

   * Headcount roster: role, start date, location, comp (base/bonus), allocation to strategy/channel
   * Bonus/comp policy and any deferral/retention programs

7. **QoE / financial statements**

   * TB/GL detail (monthly) + audited financials / management accounts (3 years + YTD)
   * EBITDA adjustments schedule with support

8. **Compliance**

   * Form ADV, last 3 exam letters/findings, remediation tracker, litigation/regulatory log

#### P2 (Important)

* Fund-by-fund terms for alts: waterfalls, carry status, clawback/escrow, fee offsets
* Fundraising pipeline and historical fundraising by vehicle
* Advisor productivity (wealth): revenue/AUM per advisor/team; client attrition; billing policy; deferred revenue roll-forward
* Vendor list and major contracts (data, tech, custody, fund admin) with pricing and renewal terms

---

## Part 7: Management Questions

### Question 10: First 10 questions for management (30 minutes)

**Your answer:**

| Question                                                                           | What you’re really trying to learn                  | Concerning answer                                              |
| ---------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| 1) “Walk us through the **AUM bridge** for the last 12–24 months by strategy.”     | Flows vs markets; which products are winning/losing | “We don’t really track flows by strategy” / vague explanations |
| 2) “What drove the change in **realized fee rate (bps)**?”                         | Fee compression, rebates, channel mix               | “Pricing is stable” but bps are falling with no explanation    |
| 3) “Where do **new assets** come from—top 3 channels and why?”                     | Distribution engine health and repeatability        | Reliance on a single platform/consultant relationship          |
| 4) “What are your **top 10 clients/platforms**, and how ‘sticky’ are they?”        | Concentration + redemption risk                     | Short redemption terms on concentrated base                    |
| 5) “How do you **recognize incentive fees/carry** and manage reversals/clawbacks?” | Earnings quality and accounting conservatism        | Aggressive accruals; limited clawback tracking                 |
| 6) “Describe your **comp model**—what’s fixed, what’s variable, what’s deferred?”  | Cost elasticity and retention risk                  | Comp locked-in / guarantees that don’t flex down in bad years  |
| 7) “Any **key person** dependencies or team transition risks?”                     | AUM portability and succession plan                 | “Founder is the relationship” with no credible bench           |
| 8) “What were the last **regulatory exam** outcomes and what changed after?”       | Compliance maturity                                 | Repeat findings, slow remediation, culture issues              |
| 9) “What is the **fundraising/pipeline** view for next 4 quarters?”                | Forward growth visibility                           | Pipeline is mostly “soft” with weak conversion history         |
| 10) “What are the top 3 **operational bottlenecks** to scaling?”                   | Hidden capex/opex needs, integration issues         | “We need to rebuild core systems” with no budget/plan          |

---

## Part 8: External Research

### Question 11: Most valuable external research

**Your answer:**

**Benchmarks & economics**

* **Fee rates / bps by asset class and fee compression trends** (McKinsey provides net fee levels and changes by asset class, 2021–2024).
* Industry profitability pressure and consolidation signals (e.g., Reuters citing profit as bps of AUM declining and projecting further pressure).
* Wealth management profitability benchmarks (Schwab RIA Benchmarking Study for operating margin, staffing, growth, tech adoption).

**Regulatory / compliance context**

* SEC and equivalent regulators (FCA/ESMA/ASIC) for rule changes affecting disclosures, marketing, custody, and reporting.
* Private fund regulation developments: SEC notes the **Private Fund Adviser Rules were vacated** effective June 5, 2024.
* Systemic risk reporting requirements: Reuters reported the SEC extended deadlines for enhanced private fund risk data reporting (to Oct 1, 2026, per that report).

**Competitor intelligence**

* Public peer filings: AUM by strategy, fee rates, FRE, fundraising commentary
* RIA M&A market activity and valuation trends (Echelon/DeVoe reports; trade press)

**Industry mechanics / structure**

* Vehicle types and how they monetize (closed-end vs evergreen; retail vs institutional; platform distribution)
* Shift to ETFs/passives and scale economics; price competition

**Recent trends to scan**

* Fee compression and product mix shift (passive, money markets, lower-fee fixed income)
* Growth of private wealth channel for alts
* Consolidation (especially RIAs)
* Tech/AI adoption, cybersecurity cost pressure

---

## Part 9: Accounting & Recognition

### Question 12: Industry-specific accounting and revenue recognition issues

**Your answer:**

#### Revenue recognition

1. **Management/advisory fees**

   * Recognized **over time** as investment management services are provided.
   * Watch billing conventions:

     * **Quarterly in advance** (common for RIAs) → **deferred revenue** liability and important cut-off testing.
     * In arrears (common in some institutional mandates) → higher receivables.

2. **Performance fees / incentive fees / carry**

   * Typically treated as **variable consideration** with constraints: recognition depends on whether amounts are subject to significant reversal (mechanics differ by structure).
   * **Hedge funds:** crystallization timing, high-water marks, and investor-level equalization matter.
   * **PE carry:** realization-based; clawback exposure can create reversals/escrows.

3. **Gross vs net presentation**

   * Expense reimbursements and pass-through costs can be presented gross or net; diligence must normalize to a consistent view.

4. **Cut-off issues**

   * Fee true-ups, breakpoints, and retroactive adjustments are common sources of misstatement at quarter/year end.

#### Cost recognition & capitalization

* **Software / internal-use systems**: capitalization vs expense policy can materially affect EBITDA comparability.
* **Acquisition-related intangibles** (RIA books, management contracts): amortization may be excluded from “adjusted EBITDA” but is real economics.
* **Fundraising costs**: may be paid by fund or manager; if manager-funded, need to understand reimbursement and accounting.

#### Balance sheet estimates & reserves

* **Fee receivable collectability** (A/R aging, disputes)
* **Accrued bonus** (largest accrual; policy and timing matter)
* **Deferred comp** and retention programs
* **Clawback/escrow liabilities** for carry
* Contingent consideration from acquisitions (wealth roll-ups)

#### Cash vs accrual considerations

* RIAs billing in advance can show **cash ahead of revenue**.
* Performance fees/carry can create **revenue ahead of cash** (or reversals).

#### Comparability pitfalls

* AUM definitions differ (AUM vs AUA vs fee-paying AUM)
* Performance fee recognition policies differ
* Treatment of fund expenses, pass-through, and fee offsets differ
* Lease standards (IFRS 16 vs ASC 842) and share-based comp add noise

---

### Question 12b: QoE adjustment watchlist

**Your answer:**

#### Due Diligence Adjustments (non-recurring / non-operating)

| Category                        | What to look for                             | Direction                        | Why it matters                            |
| ------------------------------- | -------------------------------------------- | -------------------------------- | ----------------------------------------- |
| Deal costs                      | Banker/legal/accounting fees related to sale | Add-back (+)                     | Not continuing                            |
| One-time regulatory remediation | “Special compliance project,” consultants    | Add-back (+) *if truly one-time* | But validate if it’s now run-rate         |
| Litigation/settlements          | One-off legal items                          | Add-back (+)                     | Normalize recurring legal cost separately |
| Non-recurring severance         | Restructuring charges                        | Add-back (+)                     | Validate ongoing headcount plan           |

#### Pro Forma Adjustments (run-rate normalization)

| Category                 | What to look for                          | Direction              | Why it matters                     |
| ------------------------ | ----------------------------------------- | ---------------------- | ---------------------------------- |
| Fee waivers ending       | Temporary waivers to seed/win mandates    | Increase (+) if ending | Establish true run-rate bps        |
| New AUM full run-rate    | Mid-period fundraising close or team lift | Increase (+)           | Annualize revenue and related comp |
| Owner comp normalization | Above/below market partner pay            | +/-                    | True operating cost structure      |
| Platform fee changes     | New revenue share terms                   | +/-                    | Can be permanent step-change       |

#### IFRS/GAAP / Policy Adjustments (comparability)

| Category                    | What to look for                              | Direction                        | Why it matters                        |
| --------------------------- | --------------------------------------------- | -------------------------------- | ------------------------------------- |
| Deferred revenue            | RIA billing in advance                        | Reclass (timing)                 | EBITDA/revenue timing comparability   |
| Performance fee recognition | Accrued vs crystallized policy                | Often decrease (-) if aggressive | Avoid over-earning QoE                |
| Software capitalization     | Capitalized dev costs vs expensed             | Varies                           | EBITDA and capex comparability        |
| Consolidated funds/VIEs     | Manager consolidates funds, inflating rev/exp | Recast                           | Get to “management company” economics |

---

## Part 10: Value Creation Opportunities

### Question 13: Typical value creation opportunities

**Your answer:**

| Opportunity                                        | How to identify in diligence                                        | Typical impact framing                                           |
| -------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Improve net flows** (distribution effectiveness) | Channel-level conversion, RFP win rate, advisor productivity        | Sustainable AUM growth; valuation multiple support               |
| **Fee rate optimization**                          | Client tiering, breakpoints, rebates, platform rev-share; mix shift | **1 bp on $50B = $5M revenue** (before comp)                     |
| **Product mix shift to higher-fee strategies**     | Profitability by strategy; demand signals                           | Expands bps and margin; offset fee compression                   |
| **Launch/perpetual capital** (alts)                | Investor demand for evergreen/wealth channel                        | Stabilizes fee base; reduces fundraising cyclicality             |
| **Cost leverage via scale + tech**                 | AUM per FTE; duplicate systems; manual billing                      | Improves operating margin; reduces error/compliance risk         |
| **Comp discipline & retention design**             | Bonus pool governance; guarantees; deferred comp                    | Protects margin while retaining key talent                       |
| **M&A roll-up (wealth/RIA)**                       | Fragmented market, succession-driven sellers                        | Revenue synergies + back-office leverage                         |
| **Reduce fee leakage**                             | Platform agreements; retrocessions; waivers                         | Direct net bps uplift                                            |
| **Operational risk reduction**                     | Compliance gaps, cybersecurity posture                              | Avoids downside (fines, outflows), supports institutionalization |

---

## Part 11: Ownership & Related Party Patterns

### Question 14: Common ownership and related party patterns

**Your answer:**

#### Ownership structures

* **Founder/partner-owned GP** (common in hedge/PE boutiques)

  * Risks: key person, succession, partner economics complexity
* **PE-backed roll-ups** (common in RIAs/wealth)

  * Risks: integration, leverage, growth pressure, retention
* **Bank/insurer-owned** (some asset managers)

  * Risks: channel dependence, cross-subsidies, transfer pricing
* **Publicly listed alternatives managers**

  * Risks: quarter-to-quarter performance fee volatility; disclosure complexity

#### Related party transactions (RPTs)

| RPT type                              | What it looks like                          | Risk                                  | CIM signal                                                |
| ------------------------------------- | ------------------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| Partner-owned real estate lease       | Office rent to partners                     | Off-market rent, normalization needed | “Related party rent” note / unusually high occupancy cost |
| Shared services/allocations           | Parent provides IT/HR/finance               | True stand-alone cost unclear         | “Allocated corporate costs”                               |
| Portfolio company fees (PE)           | Monitoring/transaction fees                 | Offsets, conflicts, disclosure risk   | “Portfolio services fees”                                 |
| Soft-dollar / brokerage relationships | Directed brokerage or research arrangements | Conflicts and compliance              | Vague “research arrangements” language                    |
| Placement agent/introducer fees       | Payments to third parties or affiliates     | Regulatory and cost leakage risk      | “Distribution partner” with limited detail                |

---

## Part 12: Anything Else

### Question 15: What else should an FDD team know?

**Your answer:**

* **AUM is not revenue.** Always translate AUM → **fee-paying AUM** → **net bps** → revenue.
* **Flows are the truth serum.** Markets can mask commercial weakness; insist on a clean AUM bridge.
* **Performance fees/carry are not “run-rate.”** Underwrite a recurring base (often FRE) and treat carry as upside unless you have strong evidence of repeatability.
* **Billing mechanics matter** (advance vs arrears) for QoE and working capital.
* **Fee leakage is everywhere** (platform rev-share, rebates, waivers, offsets). It’s often the hidden margin killer.
* **Compliance is a value driver, not just a risk.** Institutional allocators punish weak controls; regulatory posture can directly impact flows.
* **Terminology to master quickly:** FPAUM, NNA/net flows, bps, breakpoints, HWM, hurdle, crystallization, waterfall, clawback, FRE, perpetual capital.

---
