## Part 1: Industry Identification

### Question 1: Words/phrases/concepts that signal **Banking & Lending (Commercial Banking, Specialty Finance)**

**Business model language (how they describe what they do)**

* “**Net interest income (NII)** / interest spread business”
* “**Deposit franchise** / core deposits / retail deposits / commercial deposits”
* “**Loan origination** / underwriting / credit decisioning / risk-based pricing”
* “**Portfolio** / managed receivables / finance receivables / loan book / loan growth”
* “**Asset-liability management (ALM)** / **ALCO** / interest rate risk management”
* “**Servicing** / sub-servicing / collections / loss mitigation”
* “Hold for **investment (HFI)** vs **held for sale (HFS)** loans”
* “**Warehouse facility** / borrowing base / advance rate” (esp. specialty finance / mortgage / HFS)
* “**Securitization** / ABS / SPV / trust / residual interest / excess spread”
* “**Treasury management** / cash management / payments / interchange”
* “**Relationship lending** / sponsor finance / asset-based lending (ABL)”
* “Specialty products**:** equipment finance/leasing, factoring, merchant cash advance (MCA), auto finance, consumer installment, credit card, marketplace lending”

**KPI / reporting terminology**

* **NIM** (net interest margin), **NIS** (net interest spread), NII
* **Yield on earning assets**, **loan yield**, **cost of deposits**, **cost of funds**
* **Efficiency ratio** (noninterest expense ÷ net operating revenue) ([FDIC][1])
* **ROA / ROE**, tangible common equity (TCE), **CET1 / Tier 1** capital, risk-weighted assets
* **Allowance for Credit Losses (ACL)** / **CECL** / reserve coverage ([OCC.gov][2])
* **Nonaccrual loans**, **nonperforming assets (NPA/NPL)**, **classified / criticized** loans
* **Delinquency** buckets (30/60/90+ DPD), **roll rates**, **net charge-offs (NCO)**
* **Vintage** performance, **loss curves**, prepayments, CPR/SMM (common in consumer/mortgage)

**Customer / transaction descriptions**

* “Borrowers” (not “customers”), “obligors,” “sponsor,” “guarantor”
* “Covenants,” “LTV/DSCR,” “collateral coverage,” “borrowing base”
* “Participation / syndication,” “agent bank,” “lead arranger”
* “Renewals / refinancings / modifications,” “forbearance programs”

**Revenue model indicators**

* “Interest income recognized using effective yield”
* “Origination fees/points deferred and amortized over life of loan”
* “Gain-on-sale” (loan sales / securitization), “servicing fee bps,” “late fees,” “NSF/OD fees”
* “Interchange” (cards), “AUM-based fees” (wealth/trust), “merchant processing”

---

## Part 2: Units That Matter

### Question 2: 5–8 KPIs a generalist must understand

> **Note:** For regulated banks, “EBITDA” is not a primary performance lens. Practitioners focus on **NII/NIM, credit losses, and efficiency** (plus capital/liquidity). For non-bank specialty lenders, you can still build an EBITDA-like view, but **credit losses + funding structure** are central.

| KPI                                                             | Plain-language definition (how practitioners use it)                                                                                                                                                                             | Why it matters in diligence                                                                                                                                 |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Net Interest Margin (NIM)**                                   | Net interest income as a % of average earning assets (loans + securities). It’s the core “spread” the institution earns after funding costs. FDIC industry NIM has been ~3.2–3.3% in recent quarters (context only). ([FDIC][1]) | Tells you if earnings are driven by a strong spread vs. a fragile funding mix; also flags sensitivity to rate changes and competitive deposit pricing.      |
| **Yield on Earning Assets / Loan Yield**                        | What the portfolio earns (coupon + fee yield via effective interest) on average loans/receivables, often by product (C&I, CRE, consumer, etc.).                                                                                  | Lets you decompose NIM: is spread driven by pricing power, mix shift to riskier products, or temporary repricing?                                           |
| **Cost of Funds (COF)** (incl. cost of deposits)                | Weighted cost of deposits + wholesale funding (FHLB, repo, warehouse lines, securitizations).                                                                                                                                    | Funding is frequently the “silent killer”: margin compression, liquidity risk, covenant pressure, and refinancing risk show up here first.                  |
| **Net Charge-Off (NCO) rate**                                   | Net losses realized (charge-offs minus recoveries) as % of average loans/receivables. FDIC industry NCO rate was ~0.67% in 1Q25 (context only). ([FDIC][3])                                                                      | Shows true, realized credit cost. If NCOs are rising, earnings quality is often overstated and future provisioning may jump.                                |
| **Delinquency & Nonaccrual** (30/60/90+, NPL/NPA)               | Early warning indicators: how much of the book is late and/or not accruing interest; watch transitions (roll rates).                                                                                                             | A spike in early-stage delinquency often precedes charge-offs; nonaccrual policy can hide/accelerate pain.                                                  |
| **Allowance for Credit Losses (ACL) coverage**                  | ACL is the reserve that adjusts amortized cost to the net amount expected to be collected over the asset’s contractual term. ([OCC.gov][2]) Coverage is tracked as ACL/Loans, ACL/NPL, and qualitative overlays.                 | Central QoE risk: under-reserving inflates earnings and capital. Also a key “day 1” purchase accounting focus in deals.                                     |
| **Efficiency Ratio**                                            | Noninterest expense as % of net operating revenue (NII + noninterest income). FDIC reported efficiency ratio ~56.2% in 1Q25 (industry context). ([FDIC][1])                                                                      | Tests scalability and cost discipline. Separates high-quality franchises (efficient, automated) from high-touch, overstaffed or compliance-heavy operators. |
| **Capital / Leverage** (CET1/TCE, debt-to-equity for non-banks) | For banks: regulatory capital ratios and buffers; for non-banks: equity cushion vs. leverage facilities/ABS advance rates.                                                                                                       | Determines growth capacity, dividendability, regulatory constraints, and how much loss the balance sheet can absorb.                                        |

---

## Part 3: Value Driver Framework

### Question 3: “EBITDA” value driver tree for Banking & Lending

**Reality check:** For banks, the more faithful “EBITDA analog” is **Pre-Provision Net Revenue (PPNR)** or **Pre-Provision Operating Profit**, because **provision/credit losses are core operating economics**, not a below-the-line anomaly.

A practical diligence tree that works for both banks and specialty finance:

```text
EBITDA / Pre-Provision Operating Profit (PPNR analog)
├── Net Interest Income (NII)
│   ├── Interest Income (Asset Yield)
│   │   ├── Avg Loans/Receivables × Avg Loan Yield
│   │   │   ├── Volume drivers: originations, utilization (lines), renewals, runoff/prepay speeds
│   │   │   ├── Price drivers: base rate + spread, floors, risk-based pricing, teaser/step rates
│   │   │   ├── Mix effects: C&I vs CRE vs consumer; secured vs unsecured; fixed vs floating
│   │   │   └── Credit mechanics: nonaccrual policy, payment deferrals, PIK features (if any)
│   │   └── Avg Securities/Earning Cash × Yield
│   │       ├── Mix: AFS/HTM, duration, credit quality
│   │       └── Reinvestment rate environment / portfolio repositioning
│   └── Interest Expense (Funding Cost)
│       ├── Avg Deposits × Cost (rate paid)
│       │   ├── Mix: noninterest DDA vs interest-bearing; retail vs commercial; brokered vs core
│       │   └── Pricing dynamics: deposit beta, promos, relationship pricing
│       └── Avg Borrowings × Cost
│           ├── Wholesale: FHLB/repo/senior notes
│           ├── Specialty finance: warehouse lines, ABS funding, whole-loan facilities
│           └── Covenants / advance rates / haircuts
├── Noninterest Income (Fees & Other Revenue)
│   ├── Origination & commitment fees (often amortized into yield under effective interest)
│   ├── Servicing fee income (UPB/loan count × servicing bps) + ancillary servicing fees
│   ├── Gain on sale / securitization income (volume × gain margin; volatile)
│   ├── Treasury management / payments / interchange (accounts × activity × fee rate)
│   ├── Wealth/trust/advisory (AUM × bps, if applicable)
│   └── Other: late fees, NSF/OD (banks), insurance/partner fees (if any)
├── Operating Expenses (Noninterest Expense)
│   ├── Personnel (largest bucket)
│   │   ├── Headcount × comp; incentive plans tied to originations/growth
│   │   └── Productivity drivers: loans per RM, accounts per ops FTE, cost per booked loan
│   ├── Tech & data processing
│   │   ├── Core system, LOS/LMS, cloud, cybersecurity, data/analytics
│   │   └── Vendor contracts; per-account/per-transaction fees
│   ├── Occupancy / branches / facilities
│   ├── Marketing & customer acquisition (esp. specialty/consumer)
│   ├── Collections / servicing ops (call centers, skip tracing, 3rd-party agencies)
│   ├── Professional fees (audit, legal), G&A
│   └── Regulatory & other (FDIC insurance for banks, compliance programs)
└── (Not in EBITDA but CORE to economics)
    ├── Provision for Credit Losses (PCL) / Expected losses
    │   ├── Driven by: portfolio growth, credit migration, macro assumptions, model overlays
    │   └── Reserve adequacy vs realized losses
    └── Other below-line volatility: securities gains/losses, MSR marks, hedge ineffectiveness
```

**Gross-to-net concept (adapted for lending):**

* Instead of “discounts/returns,” the key bridges are:

  * **Contractual yield → Effective yield** (origination fees/costs amortized into yield)
  * **Accrued interest → Collected interest** (nonaccrual, payment deferrals)
  * **Accounting income → Economic income** (credit losses + funding + hedges + gain-on-sale volatility)

**Mix effects that matter most**

* **Product mix:** CRE vs C&I vs consumer; secured vs unsecured
* **Rate mix:** fixed vs floating; floors/caps; duration
* **Channel mix:** direct vs broker/affiliate; partner programs; dealer (auto)
* **Borrower mix:** prime vs near-prime/subprime; sponsor-backed vs owner-operated; geography

---

### Question 4: Full cost structure and what drives margins

#### How the “P&L” really works (bank-style)

```text
Interest Income
- Interest Expense
= Net Interest Income (NII)

+ Noninterest Income
= Net Operating Revenue

- Noninterest Expense
= Pre-Provision Net Revenue (PPNR)

- Provision for Credit Losses
= Pre-tax Income
```

#### “Gross margin / COGS” equivalent

* For **banks**, there is no classic COGS; the closest analog is:

  * **Funding cost (interest expense)** as “cost of revenue”
  * **NIM** as the “gross margin” of the balance sheet
* For **specialty finance**, some teams present:

  * **Interest expense + credit losses** as the economic “COGS” of lending

**Industry context (helpful benchmark, not a diligence conclusion):**

* FDIC reported **industry NIM ~3.25% (1Q25)** and **~3.34% (3Q25)**. ([FDIC][1])
* FDIC reported **efficiency ratio ~56% (1Q25)**. ([FDIC][1])
* FDIC reported **NCO rate ~0.67% (1Q25)**. ([FDIC][3])

#### Operating expenses (full breakdown) — what drives them

Below is a diligence-oriented way to think about costs (what’s fixed/variable/controllable).

| OpEx Category                                         | What’s in it                                                       | Unit drivers                                                    | Fixed vs variable          | Controllable?          | Headcount-heavy? |
| ----------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- | -------------------------- | ---------------------- | ---------------- |
| **Personnel**                                         | RMs, underwriters, credit, ops, servicing, collections, compliance | Headcount; loans/accounts per FTE; booked loans per underwriter | Semi-fixed (step-function) | Medium-high            | **Yes**          |
| **Tech & data processing**                            | Core system, LOS/LMS, fraud tools, data, cybersecurity             | Accounts/transactions; vendor pricing tiers                     | Semi-fixed + usage         | Medium                 | Low-medium       |
| **Occupancy**                                         | Branch leases, facilities, ATM network                             | Branch count; footprint strategy                                | More fixed                 | Medium                 | No               |
| **Marketing & acquisition** (esp. specialty/consumer) | Paid media, affiliate fees, dealer incentives                      | Applications, approvals, funded loans (CAC)                     | Variable                   | High                   | No               |
| **Servicing & collections**                           | Call centers, agencies, skip tracing, payment processing           | Accounts in repayment; delinquent accounts; contact rates       | Variable-ish               | Medium                 | Medium-high      |
| **Professional fees / G&A**                           | Audit, legal, consulting, travel                                   | “Noise” but spikes around deals/issues                          | Variable                   | Medium                 | No               |
| **Regulatory & compliance**                           | BSA/AML ops, monitoring, licensing, exams                          | Complexity of products/footprint                                | Semi-fixed                 | Medium (but must-have) | Medium           |

#### Unit economics (how practitioners operationalize profitability)

Pick a “unit” that matches the business model:

* **Commercial bank / relationship lender**

  * Unit: **relationship / RM book**
  * Metrics: revenue per relationship, spread per relationship, fee attach rate (treasury mgmt), RM productivity, relationship ROE / RAROC
* **Specialty/consumer lender**

  * Unit: **loan cohort (vintage)**
  * Metrics: contribution margin = (yield + fees) − (funding cost) − (expected loss) − (servicing cost) − (acquisition cost)
  * Look at: CAC payback, IRR by vintage, loss curves
* **Mortgage / HFS-heavy originator**

  * Unit: **loan originated + sold**
  * Metrics: gain-on-sale margin, pull-through, hedge effectiveness, cost per loan, defect rate, EPDs (early payment defaults)

#### What separates high-margin operators from low-margin ones

High-margin lenders typically have:

* **Cheap, sticky funding** (core deposits / diversified funding stack)
* **Strong credit culture** (stable loss rates across cycles; tight exception governance)
* **Scaled ops + automation** (lower efficiency ratio; fewer touches per loan)
* **Durable fee streams** (treasury, servicing, interchange) that diversify NII
* **Disciplined growth** (avoid “growth at any price” vintages that blow up later)

---

## Part 3b: Working Capital, Capex

### Question 5: Working Capital value driver tree

**Important:** Traditional OWC (AR/AP/inventory) is usually **not the main story** in lending. The “working capital” is the **balance sheet itself**: loan balances, deposits/borrowings, and liquidity.

A diligence-friendly “working capital” map:

```text
Operating Working Capital (lender-adapted)
├── Interest & Fee Receivables
│   ├── Accrued interest receivable (driven by payment timing; rises with delinquency/nonaccrual policy)
│   ├── Servicing receivables / ancillary fees receivable (if applicable)
│   └── Other receivables (interchange, treasury fees, insurance/admin fees)
├── Loans Held for Sale (if applicable)
│   ├── HFS balance (pipeline + funded not yet sold)
│   └── Hedge collateral / margin calls (cash trap risk)
├── Servicing Advances / Restricted Cash (if applicable)
│   ├── P&I advances, tax & insurance advances (mortgage servicers)
│   └── Reserve accounts in securitizations (trapped cash)
├── Prepaids & Other Assets
└── Accrued Expenses & Payables
    ├── Accrued interest payable (funding)
    ├── Compensation accruals/bonus
    ├── Vendor payables (tech/data)
    └── Collections/charge-off related accruals
```

**Receivables / DSO (adapted):**

* DSO isn’t the key KPI; instead ask:

  * What % of interest is **accruing but not collected**?
  * How quickly do accounts move 30→60→90 DPD (roll rates)?
  * Nonaccrual triggers and reversals.

**Inventory / DIO (adapted):**

* Closest analog is **“loans held for sale days”** (mortgage) or “time-to-securitize.”
* Big risk: HFS valuation + funding margin calls.

**Payables / DPO (adapted):**

* Less value; focus on **funding terms** (deposit/bank borrowings) rather than vendor DPO.

**Cash conversion / seasonality**

* Specialty/consumer: origination volumes can be seasonal (tax refund season, holiday spend), with lagged losses.
* Mortgage/HFS: highly rate-sensitive; pipeline can swing quickly; hedge/collateral can create cash traps.

---

### Question 6: Capex in this industry

**Growth capex**

* **New branches / new markets** (commercial banks)

  * Buildout, signage, systems, staffing ramp (often 12–24 months to maturity in many markets; varies widely).
* **New origination channels** (specialty finance)

  * Dealer network build, partner integrations, API programs
* **Balance-sheet growth requires “capital”** (not capex): equity/capital buffers often become the binding constraint more than physical capex.

**Maintenance capex**

* Branch refurbishments, ATMs, hardware refresh
* Ongoing compliance tooling refresh (monitoring, reporting)

**Technology/digital capex (often the biggest “real” investment)**

* Core banking replacement, loan origination system (LOS), loan management/servicing platform (LMS)
* Data lake / customer 360 / risk analytics
* Cybersecurity (IAM, SIEM, endpoint, fraud)

**Diligence watch-outs**

* Multi-year core/LOS implementations can be value-creating but disruptive (conversion risk, cost overruns, control breaks).
* Capitalization policy (what’s capitalized vs expensed) can shift EBITDA/QoE optics.

---

## Part 4: Common Analysis & Roadmap

### Question 7: Standard analyses performed in Banking & Lending

| Analysis                                                   | What it is / structure                                              | What it shows                               | Good vs. concerning                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **NIM decomposition / rate bridge**                        | NIM walk: asset yield changes, funding cost changes, mix, volumes   | Core earnings durability vs rate cycle      | Good: stable NIM w/ controllable deposit costs; Concerning: NIM propped by risky mix or promo deposits |
| **Yield & cost by product**                                | Loan yield, COF, spread by segment/product/channel                  | Pricing discipline + mix risk               | Good: spread consistent with risk; Concerning: spread widening only via riskier cohorts                |
| **Deposit beta & deposit mix**                             | Rate paid vs benchmark; mix shift DDA→time/brokered                 | Funding stickiness and competitive pressure | Good: modest beta + stable DDA; Concerning: fast repricing + brokered reliance                         |
| **Portfolio stratification & concentration**               | Exposure by product, geography, industry, sponsor, top obligors     | “Where can it break?”                       | Good: diversified + limits; Concerning: CRE office, single MSA, single sponsor, etc.                   |
| **Credit quality dashboard**                               | Delinquency, nonaccrual, criticized/classified, watchlist, workouts | Near-term credit trajectory                 | Good: early-stage stable; Concerning: 30+ DPD up, extensions rising, nonaccrual lagging                |
| **Vintage / cohort loss curves**                           | Loss and delinquency by origination month/quarter                   | Underwriting drift and “bad vintages”       | Good: newer vintages match/beat old; Concerning: step-change in losses in recent vintages              |
| **Roll-rate / migration analysis**                         | 30→60→90 DPD transitions; risk rating migration                     | Early warning + collections effectiveness   | Good: stable roll rates; Concerning: acceleration + worsening cure rates                               |
| **ACL / CECL adequacy & backtesting**                      | Compare ACL to history, peer, migration; backtest forecasts         | Reserve sufficiency                         | Good: transparent model + stable overlays; Concerning: reserve releases despite worse credit           |
| **Funding & liquidity analysis**                           | Maturity ladder, unused lines, L/D ratio, stress liquidity          | Liquidity risk                              | Good: diversified, long-dated funding; Concerning: near-term cliffs, covenant tightness                |
| **Securitization / warehouse performance** (if applicable) | Deal-level triggers, excess spread, OC, delinq tests                | Structural funding risk                     | Good: triggers far from breach; Concerning: tight headroom, rapid deterioration                        |
| **Efficiency ratio & cost walk**                           | OpEx bridge by function; HC productivity metrics                    | Operating leverage                          | Good: improving efficiency ratio; Concerning: “compliance creep,” tech spend rising without benefits   |
| **Channel / unit profitability**                           | RM book profitability; branch profitability; channel CAC/LTV        | Value creation focus                        | Good: clear ROE by segment; Concerning: growth channels unprofitable without heroic assumptions        |

---

### Question 7b: What data unlocks each analysis?

| Analysis                     | Data Required                                                                            | Request Wording                                                                                                                                | Priority                   |
| ---------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| NIM decomposition            | Monthly avg balances & rates: loans by segment, securities, deposits by type, borrowings | “Monthly average balance and rate report (loans by segment, deposits by type, borrowings, securities), trailing 36 months”                     | **P1**                     |
| Yield/cost by product        | Product-level pricing, origination coupons, fees, funding allocations                    | “Loan-level tape including coupon, fees, origination date, product, rate type, and funding source (if tracked)”                                | **P1**                     |
| Credit dashboard             | Delinquency buckets, nonaccrual, risk ratings, charge-offs/recoveries                    | “Monthly delinquency and charge-off/recovery rollforward by product, trailing 36 months”                                                       | **P1**                     |
| Vintage loss curves          | Origination cohorts with performance through time                                        | “Loan-level performance history (monthly payment status, DPD, charge-off date, recovery), with origination vintage fields”                     | **P1**                     |
| Roll-rate migration          | Month-over-month DPD transitions + cures                                                 | “Monthly transition matrix / roll-rate data for DPD buckets by product, trailing 24–36 months”                                                 | **P1**                     |
| ACL/CECL adequacy            | CECL model outputs, assumptions, overlays, forecast vs actual                            | “CECL/ACL methodology memo, model outputs by segment, overlays, and backtesting package for last 8 quarters”                                   | **P1**                     |
| Concentration analysis       | Top obligors, industries, geography, collateral                                          | “Top 50 exposures (incl. related borrowers) with industry, geography, collateral type/LTV, DSCR, risk rating”                                  | **P1**                     |
| Funding & liquidity          | Maturity ladder, line terms, covenants, contingency plan                                 | “Funding schedule by instrument with maturities, covenants, advance rates, and unused capacity; latest liquidity stress test/contingency plan” | **P1**                     |
| Securitization health        | Deal docs + monthly investor reports + trigger tests                                     | “All ABS/warehouse facilities: agreements + last 12 months of monthly servicer/investor reports incl. triggers, OC, excess spread”             | **P1/P2** (P1 if material) |
| Branch/channel profitability | P&L by branch/channel; RM book reporting                                                 | “Branch/channel profitability reporting and headcount by function (monthly/quarterly), trailing 24 months”                                     | **P2**                     |
| Gain-on-sale / HFS           | Pipeline, pull-through, hedge P&L, HFS marks                                             | “Secondary marketing/hedging report: pipeline, pull-through, hedge positions, gain-on-sale margin, HFS mark rollforward (monthly, 24 months)”  | **P2**                     |

---

## Part 5: Red Flags

### Question 8: 8–10 red flags (what they look like early vs data room)

| Red Flag                                                | Early Signal (CIM/VDD)                               | Data Room Signal                                             | Why it’s a problem                                            | How to investigate                                                                |
| ------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Growth > controls**                                   | “Record originations” + “expanded into new segments” | Underwriting policy changes; rising exceptions; ops backlogs | Fast growth often produces bad vintages + control failures    | Compare vintage losses pre/post growth; exception logs; staffing vs volume        |
| **Credit normalization narrative**                      | “Delinquencies normalizing”                          | 30+ DPD rising; roll rates worsening; modifications up       | Often euphemism for deteriorating credit                      | Build roll-rate + vintage curves; ask about cure rates and mods                   |
| **Under-reserved ACL / reserve releases**               | “Strong credit performance” with improving earnings  | ACL coverage dropping while risk indicators worsen           | Inflates QoE; future provision cliff                          | Rebuild ACL reasonableness; review overlays, model governance ([OCC.gov][2])      |
| **Funding fragility**                                   | “Diversified funding” but light detail               | Brokered deposits/wholesale share high; maturities near      | Liquidity squeeze can force asset sales or margin compression | Funding mix + maturity ladder; covenant headroom; contingency plan                |
| **Concentration risk (CRE/industry/geography/sponsor)** | “Leading lender in [niche]”                          | High top-10 exposure; correlated collateral                  | Correlated downturn drives outsized losses                    | Top exposure tape; stress by scenario (rates, CRE values)                         |
| **Gain-on-sale / marks driving earnings**               | “Strong secondary market execution”                  | Large, volatile gain-on-sale; MSR marks                      | Earnings not repeatable; sensitive to rates/spreads           | Separate core NII/fees from marks; hedge effectiveness review ([Deloitte][4])     |
| **Policy override culture**                             | “Relationship-driven”                                | High override rates; missing documentation                   | Weak risk governance; hard to remediate quickly               | Underwriting exception report; internal audit findings                            |
| **Regulatory/compliance baggage**                       | “Enhanced compliance investments”                    | MRAs/MRIAs, consent orders, BSA/AML gaps                     | Can block growth, increase cost, create fines                 | Review exam reports, remediation plans, staffing                                  |
| **Securitization trigger proximity**                    | “Efficient ABS funding”                              | OC/excess spread headroom thin; triggers close               | Can cut off funding and trap cash                             | Deal-level trigger model; latest investor reports                                 |
| **Related-party leakage**                               | “Shared services” / “management company”             | Above-market fees, leases, vendor arrangements               | EBITDA/QoE inflated; normalization needed                     | RPT schedule; benchmark pricing; Reg W constraints if bank ([Federal Reserve][5]) |

---

### Question 8b: CIM language that should trigger concern

| Phrase in CIM                                                | What it often signals                       | Follow-up                                                    |
| ------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------ |
| “**Conservative underwriting**” (repeated, light data)       | Marketing language vs evidence              | Ask for policy changes, exception rates, vintage curves      |
| “**Normalized credit** / ‘return to historical loss levels’” | Losses rising, preparing investor for pain  | Request roll rates, modifications, segment loss drivers      |
| “**Diversified funding**” (no mix table)                     | Potential reliance on hot money             | Ask for deposit mix, brokered %, maturity ladder             |
| “**Non-core items** drove earnings volatility”               | Marks/gain-on-sale/one-time items           | Separate core earnings vs marks; quantify each driver        |
| “**Strategic investments in compliance/technology**”         | Costs not run-rate; possible control issues | Request run-rate OpEx and project plan; audit/reg findings   |
| “**Strong relationships** / ‘relationship pricing’”          | Underpriced risk or hidden concessions      | Request relationship profitability/RAROC, pricing exceptions |
| “**Limited competition** in niche”                           | Concentration risk and cyclicality          | Stress test niche; look for correlated collateral            |
| “**Disciplined expense management**” while hiring            | Efficiency ratio may worsen                 | Ask for headcount by function, backlog metrics               |
| “**Seasonal** originations/earnings”                         | Timing and pipeline risk                    | Request monthly volume, pull-through, funding usage          |

---

## Part 6: First Data Requests

### Question 9: Standard first-round data requests (P1 vs P2)

#### P1 (Critical — must have)

1. **Monthly financial package (36 months)**

   * Income statement + balance sheet + key KPIs (NIM, yield, COF, NCO, ACL, delinquency)
   * Format: Excel + PDF board deck if available
   * Why: establishes trendlines and quickly reveals “what drives earnings.”

2. **Loan/receivables tape (as-of + history)**

   * Fields: origination date, product, balance, rate type, coupon, fees, term, collateral, geography, borrower industry, FICO (if consumer), LTV/DSCR (if CRE), risk rating, status (current/DPD/nonaccrual), charge-off date/amount, recoveries
   * Format: CSV
   * Why: unlocks portfolio stratification, vintage and loss analyses.

3. **Delinquency & losses rollforward (monthly, 36 months)**

   * 30/60/90+ DPD, nonaccrual, charge-offs, recoveries by product/channel/vintage
   * Why: early warning, validates credit narrative.

4. **ACL / CECL package (last 8 quarters)**

   * Methodology memo, segmentation, key assumptions, overlays, governance, backtesting
   * Why: reserve adequacy is a primary QoE risk; ACL definition and expectation-of-collection concept are core. ([OCC.gov][2])

5. **Funding & liquidity schedule (as-of + 24 months history)**

   * Deposits by type and rate; wholesale borrowings with maturities/covenants; unused capacity; liquidity stress summary
   * Why: identifies funding cliffs and margin pressure.

6. **Top exposures & concentration reports**

   * Top 50 borrowers/groups; CRE concentration by property type; industry/geography concentration
   * Why: concentration often drives downside cases.

7. **Key risk governance artifacts**

   * Underwriting policies, exception reports, risk rating definitions, collections policies
   * Why: tells you whether “credit culture” is real.

8. **Material agreements** (if applicable)

   * Warehouse lines, ABS facilities, servicing/subservicing, major vendor contracts
   * Why: covenant/trigger risk and hidden costs.

#### P2 (Important — first room batch)

* Sample **loan files** across segments (esp. largest exposures and newest vintages)
* Pricing grids / approval authorities / exception approval workflow
* Operational KPIs: cost per booked loan, turnaround times, underwriting backlog, call-center metrics
* Compliance: exam reports, MRAs/MRIAs, complaint logs, policy remediation plans
* If mortgage/HFS: hedge reports, pull-through, gain-on-sale bridge, HFS mark rollforward

---

## Part 7: Management Questions

### Question 10: First 10 kickoff questions for management (CFO/CEO/CRO)

1. **What changed in underwriting or target customer/product mix in the last 24 months?**

   * Trying to learn: whether growth came from “stretching” risk appetite
   * Concerning: “Nothing changed” + data later shows worse vintages/exceptions

2. **Where are you seeing early stress (30+ DPD / watchlist), and what’s driving it?**

   * Learn: management’s grip on credit drivers
   * Concerning: vague answers; blaming “macro” without segmentation

3. **Walk us through ACL/CECL: key assumptions, overlays, and what would make you increase reserves.**

   * Learn: reserve discipline and governance ([OCC.gov][2])
   * Concerning: heavy reliance on optimistic macro or unexplained overlay releases

4. **How do you price for risk and ensure relationship pricing isn’t eroding returns?**

   * Learn: RAROC / profitability discipline
   * Concerning: pricing set by sales with weak profitability feedback loop

5. **Funding strategy: what % of funding is “core,” what’s hot, and what’s the contingency plan?**

   * Learn: liquidity resilience
   * Concerning: dependence on brokered/wholesale funding with near-term maturities

6. **Interest rate risk: what does your NII sensitivity look like under +/− 100–200 bps?**

   * Learn: ALM posture and hedge discipline
   * Concerning: big downside sensitivity + no realistic mitigation plan

7. **Top 10 concentrations: which exposures keep you up at night and why?**

   * Learn: concentration governance
   * Concerning: dismissive tone; no clear limits/monitoring

8. **How do exceptions work—who can override policy, and how often does it happen?**

   * Learn: risk culture vs sales culture
   * Concerning: high override rates, weak documentation

9. **What’s driving noninterest expense trends (headcount, tech, compliance)? What’s truly run-rate?**

   * Learn: efficiency and normalization needs
   * Concerning: major “temporary” costs that are actually structural

10. **Any regulatory/compliance matters we should know (exams, MRAs, audits, investigations)?**

* Learn: hidden constraints and tail risk
* Concerning: “nothing material” but later production of MRAs/consent orders

---

## Part 8: External Research

### Question 11: Most valuable external research

**Benchmark sources / market context**

* **FDIC Quarterly Banking Profile** for NIM, ROA, efficiency ratio, charge-offs, asset quality trends (best “quick” benchmark). ([FDIC][1])
* Peer comps: SEC 10-Ks/10-Qs, earnings decks, investor calls (banks and specialty finance)
* Rate environment: yield curve, deposit competition dynamics (Fed/FRED)

**Regulatory/compliance context**

* OCC / Fed / FDIC guidance on **ACL/CECL** and examiner expectations. ([OCC.gov][2])
* For bank holding companies / affiliates: **Regulation W / Sections 23A/23B** constraints on affiliate transactions (relevant for related-party normalization). ([Federal Reserve][5])

**Competitor intelligence**

* Competitor pricing (where visible), product offerings, geographic expansion, deposit campaigns
* For ABS funders: securitization spreads, investor appetite, deal structures

**Industry mechanics & trends**

* Mix shifts (CRE stress pockets, consumer credit normalization), funding mix shifts, technology spend, digital acquisition economics, fraud trends

---

## Part 9: Accounting & Recognition

### Question 12: Industry-specific accounting and revenue recognition issues

#### Revenue recognition (lending-specific)

1. **Interest income & effective yield mechanics**

   * **Loan origination fees are generally deferred and recognized over the life of the loan as an adjustment to yield (interest income)** (not booked upfront). ([FDIC][6])
   * Diligence focus: confirm the company isn’t pulling forward fee income (especially for specialty lenders).

2. **Nonaccrual and interest reversals**

   * Key risk: income may be overstated if nonaccrual triggers are late, or if accrued interest receivable is not collectible.

3. **Noninterest income recognition**

   * Servicing income: generally recognized as earned; **servicing assets/liabilities** recognized and measured at fair value in certain sale transactions under ASC 860 guidance. ([DART][7])
   * Gain-on-sale / securitization income: can be volatile; depends on whether transfers qualify as sales vs secured borrowings and how retained interests are valued. ([Deloitte][4])

4. **Cut-off issues**

   * Loan sales near period-end (gain-on-sale timing)
   * Interest accrual cut-off and payment processing timing (especially around holidays/month-end)

#### Cost recognition & capitalization

* **Netting / deferral of origination fees and direct origination costs** into the loan’s yield is a common judgment area; aggressive capitalization can inflate EBITDA/earnings optics. ([FASB Storage][8])
* Technology: internal-use software capitalization policies can materially affect “run-rate” earnings.

#### Balance sheet estimates & reserves

* **ACL/CECL** is the biggest estimate: ACL is a valuation account reflecting the net amount expected to be collected over the contractual term. ([OCC.gov][2])
* Fair value marks: MSRs, residual interests, derivatives/hedges
* Repurchase/indemnification reserves (if loan sales with reps & warrants)
* OREO/REO valuation (for banks with foreclosed assets)

#### Cash vs accrual considerations

* Upfront cash fees vs recognized yield over time (effective interest)
* Securitization cash waterfalls and trapped cash/reserves (economic vs accounting income differences)

#### Comparability issues (why two lenders don’t compare cleanly)

* CECL methodologies, segmentation, overlays ([OCC.gov][2])
* Charge-off timing/policies
* HFI vs HFS accounting and gain-on-sale reliance
* Fair value vs amortized cost choices for certain assets
* Servicing strategy (retained vs released) and accounting treatment ([DART][7])

---

### Question 12b: QoE adjustment watchlist for this industry

#### Due diligence adjustments (non-recurring / non-operating)

| Category                        | What to look for                              | Direction                             | Why it matters                              |
| ------------------------------- | --------------------------------------------- | ------------------------------------- | ------------------------------------------- |
| Regulatory/legal settlements    | Fines, remediation costs, one-time consulting | Add-back (+) (if truly non-recurring) | May not recur, but may signal ongoing spend |
| One-time tech conversion        | Core/LOS conversion “one-off”                 | Add-back (+) with caution             | Often multi-year and recurring in practice  |
| Restructuring / branch closures | Exit costs                                    | Add-back (+)                          | Normalize run-rate footprint                |

#### Pro forma adjustments (run-rate normalization)

| Category                   | What to look for                                  | Direction                    | Why it matters                             |
| -------------------------- | ------------------------------------------------- | ---------------------------- | ------------------------------------------ |
| Staffing to support growth | Understaffed ops/collections                      | Decrease (−)                 | “Current” profitability not sustainable    |
| Funding repricing          | Warehouse line spreads step-up; deposit repricing | Varies                       | True run-rate NIM/earnings                 |
| New vintages ramp          | Cohorts originated mid-period                     | Increase (+) (if performant) | Full-year revenue impact, but watch losses |

#### IFRS/GAAP / policy normalization

| Category                    | What to look for                                   | Direction                              | Why it matters                                              |
| --------------------------- | -------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Fee deferral / yield method | Upfront fee recognition vs amortized yield         | Likely decrease (−) if aggressive      | Timing differences can inflate earnings ([FASB Storage][8]) |
| Sale vs borrowing (ASC 860) | Transfer accounting, retained interests, servicing | Varies                                 | Changes gain timing and balance sheet ([Deloitte][4])       |
| ACL/CECL methodology        | Under-reserving vs policy                          | Typically decrease (−) if reserves low | Earnings quality and capital adequacy ([OCC.gov][2])        |

---

## Part 10: Value Creation Opportunities

### Question 13: Typical value creation levers

| Opportunity                                           | Lever                                                                       | How identified in diligence                     | Typical impact (directional)                        |
| ----------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| **Funding mix optimization**                          | Grow core deposits / reduce brokered & expensive wholesale                  | Deposit mix + pricing vs peers; maturity ladder | Improves NIM; reduces liquidity risk                |
| **Risk-based repricing & mix shift**                  | Reprice under-earning segments; focus on higher ROE products                | Segment ROE/RAROC; relationship profitability   | Spread improvement (esp. where pricing is sloppy)   |
| **Fee income expansion**                              | Treasury mgmt attach, interchange, servicing, partner fees                  | Fee penetration vs peers; wallet share          | Diversifies revenue; reduces reliance on rate cycle |
| **Credit tightening + better collections**            | Underwriting discipline, exception governance, analytics, early collections | Vintage loss curves; roll-rate deterioration    | Lower loss rate; stabilizes QoE                     |
| **Automation / efficiency**                           | Digitize origination and servicing; reduce touches                          | Cost per booked loan; turnaround times          | Better efficiency ratio; scalable growth            |
| **Securitization/warehouse optimization** (specialty) | Lower cost of funds, free capacity, improve advance rates                   | Deal headroom; pricing vs market; triggers      | Lower funding cost; more growth capacity            |
| **Branch/channel rationalization** (banks)            | Optimize footprint; focus on productivity                                   | Branch profitability; deposit profitability     | Lower OpEx; improved efficiency ratio               |
| **Bolt-on synergies**                                 | Consolidate back office, unify tech stack, cross-sell                       | Duplicate functions; vendor overlap             | Cost takeout + revenue synergies                    |

---

## Part 11: Ownership & Related Party Patterns

### Question 14: Common ownership and RPT patterns

**Ownership structures**

* **Bank holding company structures** (multiple legal entities; upstream dividends constrained by capital)
* **Family/founder-controlled community banks** (governance + related party exposure risk)
* **PE-backed specialty finance** (growth pressure; leverage/funding complexity)
* **Fintech-originator partnerships** (bank sponsor + program manager dynamics; compliance risk)

**Related party transactions (RPTs) commonly seen**

| RPT Type                       | What it looks like                         | Risk                                                                                    | CIM signal                                                      |
| ------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Management / advisory fees     | Fees to owners/holdco                      | Above-market; normalization needed                                                      | “Management fee” line item                                      |
| Shared services / TSA          | Allocated IT/HR/finance                    | Stand-up cost post-close                                                                | “Allocated overhead”                                            |
| Real estate leases             | Branch/office leased from owners           | Off-market rent                                                                         | “Affiliate lease”                                               |
| Affiliate transactions (banks) | Services/assets between bank and affiliate | Must comply with affiliate transaction limits/market terms under Sections 23A/23B/Reg W | “Affiliate services” / complex org chart ([Federal Reserve][5]) |

---

## Part 12: Anything Else

### Question 15: What generalists often miss in this industry

* **EBITDA is not the point** (especially for banks). Credit losses and funding are not “below the line”—they are *the business model*.
* **A lender’s “inventory” is the loan book**: diligence must be portfolio-first (tape, stratification, vintages).
* **Funding can break a good credit book** (liquidity cliffs, deposit flight, warehouse covenants).
* **Reserve adequacy is both accounting and economics** (CECL governance is a major diligence workstream). ([OCC.gov][2])
* **Mix and cycle matter**: the same NIM can be “good” or “bad” depending on whether it’s achieved via prudent pricing or hidden risk.
* **Transfer/securitization accounting and servicing economics** can dominate reported earnings volatility—separate core from marks. ([Deloitte][4])
* **Affiliate/related party constraints** are real for banks (Reg W) and affect normalization and operational design. ([Federal Reserve][5])

---

If you want, I can also rewrite this into a **machine-ingestible module format** (e.g., YAML/JSON with: `industry_signals`, `kpis`, `driver_tree_nodes`, `data_requests`, `red_flags`, `mgmt_questions`, `external_research_queries`, `accounting_watchouts`) so it can plug directly into your assistant’s module library.

[1]: https://fdic.gov/quarterly-banking-profile/quarterly-banking-profile-first-quarter-2025.pdf?utm_source=chatgpt.com "QUARTERLY 
2025   VOLUME 19,  NUMBER 2
INSURED INS"
[2]: https://www.occ.treas.gov/topics/bank-operations/accounting/cecl/current-expected-credit-loss-model.html?utm_source=chatgpt.com "Allowances for Credit Losses (ACL) | OCC"
[3]: https://www.fdic.gov/qbp-1q25-statementpdf.pdf?utm_source=chatgpt.com "NONPUBLIC//FDIC INTERNAL ONLY"
[4]: https://www.deloitte.com/us/en/services/audit/articles/a-roadmap-to-asc-810-860-financial-assets.html?utm_source=chatgpt.com "On the Radar: Transfers and Servicing of Financial Assets | Deloitte US"
[5]: https://www.federalreserve.gov/frrs/regulations/background-and-summary-of-regulation-w.htm?utm_source=chatgpt.com "Background and Summary of Regulation W"
[6]: https://www.fdic.gov/resources/bankers/call-reports/crinst-051/2024/051-624-gloss.pdf?utm_source=chatgpt.com "FFIEC 051 
GLOSSARY 
 
 
 
GLOSSARY 
 
The definit"
[7]: https://dart.deloitte.com/USDART/home/codification/broad-transactions/asc860-10/roadmap-transfers-financial-assets/chapter-6-servicing-assets-liabilities?combine=&utm_source=chatgpt.com "Chapter 6 — Servicing Assets and Liabilities | DART – Deloitte Accounting Research Tool"
[8]: https://storage.fasb.org/ASU%202022-02.pdf?utm_source=chatgpt.com "No. 2022-02"
