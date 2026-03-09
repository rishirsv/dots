Below is a “module-style” answer you can lift into your Insurance (P&C / Life / Specialty) industry logic. I’m going to treat **Insurance** as three common deal archetypes—because the right KPIs, EBITDA bridge, and diligence traps are *very* different:

1. **Risk carrier / reinsurer** (P&C, specialty, life) — underwriting + reserves + reinsurance + investments + capital
2. **MGA / program administrator** — fee + profit commission, sometimes partial risk; operational underwriting + claims oversight
3. **Broker / agency / wholesale** — commission/fees on premium placed; “premium is not revenue”; working-capital pass-through traps

If your assistant can identify which archetype it’s dealing with, everything downstream gets sharper.

---

## Part 1: Industry Identification

### Question 1: What words/phrases/concepts signal Insurance (P&C, Life, Specialty)?

#### A. Universal “insurance company” signals (show up across subtypes)

* **Underwriting language:** “underwriting,” “bind,” “policy issuance,” “rating plan,” “pricing adequacy,” “risk selection,” “portfolio,” “book of business”
* **Premium mechanics:** “written premium,” “earned premium,” “unearned premium reserve (UPR),” “policy term,” “renewal business,” “new business”
* **Claims/reserving:** “claims,” “losses,” “loss adjustment expenses (LAE),” “case reserves,” “IBNR,” “loss reserves,” “reserve development,” “ultimate losses,” “severity/frequency,” “triangles”
* **Reinsurance:** “ceded,” “retained,” “quota share,” “excess of loss (XoL),” “treaty,” “facultative,” “ceding commission,” “reinsurance recoverables,” “reinsurer security”
* **Regulatory/capital:** “statutory,” “NAIC,” “admitted/non-admitted,” “surplus,” “RBC,” “solvency,” “AM Best/S&P rating,” “state DOI,” “form filing”

#### B. P&C / Specialty carrier & reinsurer signals

* **Core KPIs in CIM/VDD:** “combined ratio,” “loss ratio,” “expense ratio,” “cat ratio,” “attritional losses,” “accident year vs calendar year,” “rate change,” “exposure growth,” “prior-year development (PYD)”
* **Product/line language:** “commercial lines,” “personal lines,” “E&S,” “professional liability,” “D&O,” “cyber,” “workers’ comp,” “property cat,” “marine/aviation,” “surety,” “program business,” “fronting”
* **Loss drivers:** “social inflation,” “nuclear verdicts,” “catastrophe,” “secondary perils,” “weather-related,” “large loss activity”

#### C. Life / annuity carrier signals

* **Product language:** “term life,” “whole life,” “universal life,” “indexed UL,” “fixed annuities,” “variable annuities,” “group benefits,” “disability,” “long-term care”
* **KPIs/actuarial:** “lapse,” “persistency,” “mortality,” “morbidity,” “new business value,” “APE,” “embedded value,” “in-force block,” “crediting rate,” “spread,” “ALM,” “duration matching”
* **Accounting standards cues:** “LDTI,” “IFRS 17,” “CSM,” “OCI for discount rate changes” (IFRS/US GAAP adoption language)

#### D. Broker / agency / MGA signals (important because many “insurance deals” are intermediaries)

* **Revenue model language:** “commission income,” “contingent commission,” “profit-sharing,” “brokerage revenue,” “placement fees,” “renewal commissions,” “producer compensation,” “organic growth”
* **Operating model:** “producers,” “carrier appointments,” “binding authority” (MGA), “wholesale/retail,” “MGU,” “TPA,” “claims administrator”
* **Portfolio management:** “book roll,” “client retention,” “policy count,” “premium under management,” “cross-sell,” “vertical specialization”

---

## Part 2: Units That Matter

### Question 2: The 5–8 KPIs a generalist must know

Because KPIs differ by archetype, here’s a **core set** plus **archetype-specific add-ons**.

### Core KPIs (P&C / Specialty carrier focus)

| KPI                                                             | Definition (practitioner version)                                                                                                                                                                   | Why it matters in diligence                                                                                          |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Gross Written Premium (GWP)** / **Net Written Premium (NWP)** | Premium **bound** in the period before/after reinsurance. Think “sales booked” (not yet earned).                                                                                                    | Growth quality: is premium growth coming from rate vs new risk vs mix? Also shows reinsurance dependence (GWP→NWP).  |
| **Net Earned Premium (NEP)**                                    | Premium **recognized into earnings** as coverage is provided (written premium adjusted for change in unearned premium reserve).                                                                     | Underwriting P&L is driven off **earned** premium; mismatches between written and earned can mask trends.            |
| **Loss Ratio (LR)**                                             | **Incurred losses + LAE ÷ earned premium.** The “cost of claims” per premium dollar. A combined ratio is typically LR + expense ratio. ([irmi.com][1])                                              | The single biggest driver of underwriting profitability; tells you if pricing/selection/claims are working.          |
| **Expense Ratio (ER)**                                          | Underwriting expenses ÷ premium (often earned). Includes acquisition (commissions) + underwriting/admin.                                                                                            | Signals scalability and distribution economics; high ER can be acceptable in specialty if LR is strong.              |
| **Combined Ratio (CR)**                                         | **Loss ratio + expense ratio**; **<100% = underwriting profit** (before investment income). ([irmi.com][1])                                                                                         | “North star” for P&C underwriting performance; decomposes into pricing vs claims vs expense drivers.                 |
| **Reserve Development (Prior-Year Development / PYD)**          | How prior accident years’ loss reserves are re-estimated: favorable (releases) vs adverse (strengthening).                                                                                          | Repeated favorable PYD can inflate earnings; adverse PYD is a top “deal goes sideways” risk.                         |
| **Retention / Renewal Rate**                                    | % of policies/premium that renew (or persist) at renewal.                                                                                                                                           | Indicates franchise strength and whether growth is “sticky” vs churn-driven (also impacts acquisition cost payback). |
| **Capital Adequacy (RBC / Solvency ratio)**                     | Regulatory capital buffer vs required capital (US: **Total Adjusted Capital ÷ ACL RBC**). NAIC describes intervention levels and typical thresholds (e.g., trend test around 200–300%). ([NAIC][2]) | Determines ability to write business, pay dividends, withstand shocks; can force de-risking or reinsurance costs.    |

**Useful add-ons (P&C specialty):**

* **Catastrophe ratio / large-loss ratio** (cat losses ÷ earned premium): helps normalize performance and assess “earnings volatility.”
* **Rate change vs exposure change**: disentangles price vs volume.

### Life / annuity add-ons (if documents clearly indicate Life)

| KPI                                  | Definition                                                                                            | Why it matters                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **APE (Annual Premium Equivalent)**  | Standardized new business measure: recurring premium + a % of single premiums (varies by disclosure). | Better than raw premium for comparing new business across product types.                         |
| **Persistency / Lapse rate**         | % of policies that stay in-force (or % lapsing).                                                      | Drives profitability of long-duration products; lapses can destroy expected margin.              |
| **Spread (net investment spread)**   | Asset yield minus credited rate/guarantee cost (net of hedging).                                      | Key profitability driver for annuities and many life products; sensitive to rates/credit losses. |
| **New Business Margin / VNB Margin** | Profit value per unit of new business (framework differs by regime).                                  | Detects underpricing and channel pressure; tells you if growth is value-accretive.               |

### Broker / agency / MGA add-ons (if intermediary)

| KPI                       | Definition                                                          | Why it matters                                                                                |
| ------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Commission rate**       | Commission revenue ÷ premium placed (by line/carrier).              | Mix and carrier contracts determine revenue quality; also highlights reliance on contingents. |
| **Organic growth**        | Growth excluding acquisitions, typically on revenue or commissions. | Brokers often grow via M&A; diligence must separate true organic momentum.                    |
| **Producer productivity** | Revenue per producer, policies per producer, retention by producer. | Explains sustainability of revenue and risk if key producers leave.                           |

---

## Part 3: Value Driver Framework

### Question 3: What does the EBITDA value driver tree look like?

**Important framing:** For a true **risk carrier**, “EBITDA” is not a native KPI. The economic engine is **Underwriting Result + Investment Result**, and the biggest “cost” is **losses/reserving** (not COGS in the normal sense). In PE processes you may still see “Adj. EBITDA,” but you should build it from insurance-native components.

Below are driver trees by archetype.

---

### A) P&C / Specialty carrier (or reinsurer): “EBITDA proxy” driver tree

```
EBITDA (Proxy) / Operating Profit
├── Underwriting Result (Underwriting Income)
│   ├── Net Earned Premium (NEP)
│   │   ├── Gross Written Premium (GWP)
│   │   │   ├── # Policies / Accounts × Avg Premium
│   │   │   ├── Exposure Units (payroll, sales, vehicles, property TIV) × Rate
│   │   │   └── Mix: Line of business × State/geo × Industry class × Limit/attachment
│   │   ├── Reinsurance Impact
│   │   │   ├── Ceded Written Premium (quota share / XoL premiums)
│   │   │   └── Ceding Commissions / Sliding scale terms
│   │   └── Earned vs Written Timing
│   │       └── Change in Unearned Premium Reserve (UPR)
│   ├── Losses & LAE (Incurred)
│   │   ├── Current accident year losses
│   │   │   ├── Claim frequency × Severity × Exposure
│   │   │   ├── Cat losses (event-driven)
│   │   │   └── Large losses (tail events / social inflation)
│   │   ├── Prior-year development (reserve releases/strengthening)
│   │   └── Reinsurance recoveries (ceded losses) & reinstatement premiums
│   └── Underwriting Expenses
│       ├── Acquisition costs (commissions, premium taxes, MGA/broker fees)
│       │   └── Written premium × commission rate
│       ├── Underwriting ops (UW staff, policy admin, inspections, fraud)
│       └── Claims handling (if not in LAE, depends on classification)
├── Net Investment Income (NII)
│   ├── Invested assets / float balance
│   ├── Portfolio yield & duration
│   ├── Credit losses / impairments
│   └── Realized vs unrealized gains (often excluded from “operating”)
└── Other income / fees (if any)
    ├── Policy fees / installment fees
    └── Service fees / managing general agent fees (hybrids)
```

**Mix effects that matter (carrier):**

* **LOB mix:** e.g., cyber vs property cat vs professional liability (different LR volatility and expense structure)
* **Distribution mix:** direct vs agent vs MGA/program business (commission load differs)
* **Geography mix:** cat-exposed states vs diversified inland
* **Limit/attachment mix:** moving up the tower changes severity volatility

---

### B) Life / annuity carrier: operating profit driver tree (EBITDA proxy)

```
Operating Profit (Proxy)
├── Premiums & Policy Fees (earned / assessed depending on product)
│   ├── New business volume (APE / deposits)
│   ├── Persistency (lapses, surrenders)
│   └── Product mix (term, UL, annuity, group)
├── Benefits, Claims & Crediting
│   ├── Mortality / morbidity experience
│   ├── Policyholder behavior (lapse, annuitization)
│   └── Crediting rate / guarantee costs
├── Change in Policy Reserves (actuarial assumptions)
│   ├── Discount rate / interest rate assumptions
│   ├── Experience updates
│   └── Assumption unlocking / model changes
├── Expenses
│   ├── Acquisition (commissions, underwriting, issue costs)
│   └── Maintenance (admin, servicing, claims)
└── Investment / Spread Result
    ├── Asset yield, duration, credit
    ├── Hedging (VA guarantees)
    └── ALM effectiveness
```

Accounting regime matters a lot here (US GAAP LDTI; IFRS 17). LDTI effective dates differ by entity type (SEC filers vs others). ([DART][3])

---

### C) Broker / agency / MGA (fee-based): true EBITDA tree (most FDD-friendly)

```
EBITDA
├── Net Revenue
│   ├── Commission revenue
│   │   ├── Premium placed × commission rate
│   │   └── Mix: line of business × carrier × client segment
│   ├── Contingent / profit-sharing commissions
│   │   ├── Carrier performance metrics (loss ratio, growth, retention)
│   │   └── Timing/true-ups
│   └── Fees (placement, service, consulting)
├── Direct Costs (if presented as COGS)
│   ├── Producer commissions / variable comp
│   └── Third-party service costs (TPA, claims, inspection)
└── OpEx
    ├── Non-producer payroll (account managers, admin)
    ├── Technology & systems
    ├── Occupancy / G&A
    └── Acquisition integration costs (often adjusted)
```

**Gross-to-net adjustments (broker/MGA):**

* Most important is **gross vs net presentation** (premium pass-through is *not* revenue; trust accounts).

---

## Question 4: Full cost structure & what drives margins

### A) P&C / Specialty carrier: “P&L anatomy” and margin drivers

**P&L view (simplified):**

1. **Net Earned Premium (NEP)** + other underwriting income
2. **Losses & LAE** (incurred) → biggest “COGS equivalent”
3. **Underwriting expenses**
   = **Underwriting income**
4. **Net investment income** (+/- realized gains, depending on “operating”)
   = **Pre-tax income** (plus/minus other items)

#### “Gross margin / COGS” equivalent

* **COGS analog:** **Losses & LAE** (claims cost)
* **Typical range (heuristic):**

  * **Loss ratio** commonly 50–80% depending on line/cycle
  * **Expense ratio** often 20–35% depending on distribution and scale
  * **Combined ratio**: **<100%** profitable; **90–98%** often viewed as strong; **>105%** typically concerning unless explained by one-off cat or growth investments

#### What moves underwriting margin (underwriting margin ≈ 1 − CR)

* **Pricing adequacy:** rate change vs loss trend (inflation, social inflation)
* **Risk selection:** tightening/loosening underwriting guidelines
* **Claims management:** leakage, litigation, fraud, subrogation/salvage
* **Reinsurance structure:** attachment points, quota share %, reinstatement, ceding commissions
* **Mix shift:** moving into higher volatility / longer-tail lines can “look good now” but create reserve risk later
* **Reserve releases/strengthening:** calendar-year results can be flattered by releases

#### Expense structure (carrier)

Break the expense ratio into:

* **Acquisition costs (variable-ish):**

  * commissions / brokerage / MGA fees
  * premium taxes & assessments
* **Underwriting & policy admin (semi-fixed):**

  * underwriting headcount, policy systems, inspections
* **Claims handling (classification varies):**

  * LAE may include adjuster salaries and claims overhead depending on insurer/stat reporting conventions
* **Corporate / overhead (fixed-ish):**

  * finance, legal, compliance, IT, risk, actuarial

**Controllable vs non-controllable (carrier):**

* **Less controllable:** catastrophe losses, macro loss inflation, reinsurance market pricing, regulatory assessments
* **More controllable:** underwriting guidelines, claims leakage, expense discipline, distribution strategy, data/analytics

---

### B) Broker / agency / MGA: margin structure (more like a services business)

**Revenue:** commissions, fees, contingents
**Direct costs:** producer comp (often the “COGS”), variable incentives
**OpEx:** account management, admin, tech, rent, G&A

**Typical margin ranges (heuristic):**

* EBITDA margins can vary widely (often **high-teens to 30%+** depending on scale, producer comp model, M&A integration, and corporate overhead allocations).

**High-margin vs low-margin operator (broker/MGA):**

* Higher retention and cross-sell (sticky accounts)
* Better carrier terms (higher base commission, stronger contingent structures)
* Standardized servicing model (account manager leverage)
* Controlled producer comp (but watch retention risk)
* Discipline in M&A integration (avoid permanent “one-time” costs)

---

### Unit economics (what’s the “unit”?)

* **Carrier:** per policy / per exposure unit / per program / per LOB-state cell (combined ratio by cell)
* **MGA:** per program, per binder, per carrier capacity line (loss ratio + fee margin by program)
* **Broker:** per producer book, per client segment, per office/branch, per carrier appointment

---

## Question 5: Working Capital value driver tree

### First principle: “Working capital” is different in insurance

For carriers, the real economic working capital is **technical reserves / float dynamics** and **premium vs claims timing**, not inventory.

### A) Carrier working-capital/“float” driver tree (operational balance sheet items)

```
Operating / Technical Working Capital
├── Premium Receivables (incl. agent/broker balances)
│   ├── Billing method (direct vs agency bill)
│   ├── Payment terms / installment plans
│   ├── Collection effectiveness / cancellations
│   └── Premium financing usage (timing shifts)
├── Unearned Premium Reserve (UPR)
│   ├── Written premium growth (seasonality)
│   └── Policy term mix (annual vs multi-year)
├── Loss & LAE Reserves (Claims Liabilities)
│   ├── Case reserves
│   ├── IBNR (incurred but not reported)
│   ├── LAE reserves
│   └── Development patterns (short-tail vs long-tail)
├── Reinsurance Recoverables (asset)
│   ├── Counterparty quality
│   ├── Dispute/collection timing
│   └── Collateral / trust / LOC
├── Payables & Accruals
│   ├── Commissions payable
│   ├── Premium taxes / assessments payable
│   └── Reinsurance payables
└── Fiduciary / Trust balances (if applicable)
```

**IBNR definition (statutory):** expected payments for losses from insured events that occurred but have not been reported as of the statement date. ([Society of Actuaries][4])

**DSO “typical”:** highly variable; the more relevant question is **aging of premium receivables and agent balances** (and cancellations for non-pay).

**Cash conversion:** often structurally favorable because premiums are collected before claims are paid (“float”), but:

* long-tail lines can create **reserve/claims payout risk**
* rapid growth can temporarily boost float but increase future claim liabilities

**Seasonality/lumpiness:** common around major renewal dates (e.g., commercial Jan 1) and catastrophe seasons.

### B) Broker/agency working capital (avoid the trap)

Brokerages often have large “premium payable/receivable” balances that are **pass-through** (fiduciary funds). The key diligence item is:

* Separate **operating working capital** vs **fiduciary/trust premium cash**
* Ensure the “cash” isn’t restricted or owed to carriers

---

## Question 6: Capex in this industry

### Carrier / MGA / broker capex is mostly technology + data

**Growth capex (or growth investment):**

* New product / new state launches (filings, systems configuration, underwriting models)
* Underwriting platform buildout (straight-through processing)
* Claims automation / fraud detection
* Data acquisition (third-party data, peril models, credit/telematics where permitted)

**Maintenance capex:**

* Core systems upgrades: policy admin, billing, claims, GL
* Regulatory & cybersecurity
* Data center / cloud migration

**Tech/system implementations to watch:**

* Policy admin system replacement (multi-year, high risk of overruns)
* Claims system replacement (service levels + reserving data quality risk)
* Finance/actuarial data warehouse build

**“Capex vs OpEx” nuance:** a lot of spend is expensed; some software development may be capitalized depending on accounting policy (watch capitalization aggressiveness in QoE).

---

## Part 4: Common Analysis & Analysis Roadmap

## Question 7: Standard analyses in Insurance

### Carrier / reinsurer analyses (P&C / specialty)

| Analysis                                          | What it is / structure                                                             | What it tells you                                           | Good vs concerning                                                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Combined ratio decomposition**                  | CR split into LR (attritional + cat + large loss + PYD) and ER (acq + ops) by year | What’s driving profitability: pricing vs claims vs expenses | Good: stable/improving CR with credible drivers; Concerning: improvement driven mainly by reserve releases or one-offs            |
| **Accident year vs calendar year**                | Separate current accident-year performance from prior-year development             | Underlying underwriting quality vs reserve noise            | Good: accident-year profitability holds up; Concerning: calendar-year looks good but accident-year deteriorating                  |
| **Loss development triangles / reserve adequacy** | Triangles by line/segment; compare ultimate loss picks and development factors     | Whether reserves are adequate / biased                      | Good: consistent patterns, modest noise; Concerning: repeated adverse development, shifting methodologies, unexplained changes    |
| **Rate vs exposure vs mix growth**                | Premium bridge: rate change, exposure units, mix, new vs renewal                   | Whether growth is “priced” and sustainable                  | Good: rate ≥ loss trend, exposure growth in target segments; Concerning: rapid growth without rate, mix shift into risky segments |
| **Claims frequency/severity trend**               | Trend analysis by line/segment (frequency, severity, closure rates)                | Claims inflation, litigation, operational leakage           | Good: severity trend aligned to pricing; Concerning: severity spiking with no pricing response                                    |
| **Cat exposure & reinsurance stress test**        | Modeled PML/TVaR, historical events, net retention by event                        | Earnings/capital volatility and reinsurance adequacy        | Good: clear risk appetite + program protects surplus; Concerning: low attachment, high net cat, reinsurer concentration           |
| **Reinsurance economics**                         | Ceded premium, recoveries, ceding commissions, reinstatement; net impact by year   | Whether reinsurance improves risk/return                    | Good: rational tradeoff; Concerning: heavy quota share masking underwriting losses or reliance on one counterparty                |
| **Segment profitability**                         | CR by LOB-state-channel-program                                                    | Where money is made/lost; exit candidates                   | Good: profitable core segments; Concerning: profits concentrated in one fragile segment/program                                   |

### Broker / MGA analyses

| Analysis                                     | What it shows                                     | Good vs concerning                                                                            |
| -------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Organic growth bridge**                    | New business vs retention vs rate vs acquisitions | Good: consistent positive organic; Concerning: “growth” mostly acquired or rate-driven        |
| **Book quality by producer**                 | Concentration, retention, growth by producer      | Good: diversified, stable; Concerning: one or two rainmakers dominate                         |
| **Contingent commission dependency**         | % of revenue from contingents; volatility         | Good: modest and explainable; Concerning: large share with opaque calculation and cyclicality |
| **Client concentration / vertical exposure** | Exposure to one industry or carrier               | Good: diversified; Concerning: single carrier/program accounts for big share                  |

---

## Question 7b: What data unlocks each analysis?

Below is a **starter matrix** you can turn into P1/P2 data requests.

| Analysis                     | Data required                                                                                                        | Request wording                                                                                                                                                    | Priority       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Combined ratio decomposition | Earned premium, incurred losses & LAE, underwriting expenses by month/quarter, by LOB/state/channel for 24–60 months | “Monthly NEP, incurred losses+LAE, and UW expenses by LOB/state/channel for last 60 months; include cat and large loss tags if used internally.”                   | P1             |
| Accident vs calendar year    | Accident-year triangles, calendar-year financials                                                                    | “Loss development triangles (paid and incurred) by accident year for each major LOB for last 10 accident years; plus calendar-year P&L.”                           | P1             |
| Reserve adequacy             | Reserve rollforward (case/IBNR), actuarial reports, assumptions                                                      | “Quarterly reserve rollforward (case, IBNR, LAE) by LOB for last 12 quarters + latest actuarial indication and management best estimate documentation.”            | P1             |
| Rate vs exposure vs mix      | Exposure units + rate change metrics + premium by segment                                                            | “Exposure bases (payroll, sales, vehicles, TIV, etc.) and average rate metrics by LOB/state for last 36 months; include rate change by renewal if available.”      | P1             |
| Frequency/severity           | Claims-level or aggregated claims triangles by segment                                                               | “Claims summary by month and LOB: claim counts, paid, incurred, case, IBNR; plus large-loss listing with cause of loss and status.”                                | P1             |
| Cat & reinsurance stress     | Cat models/PML, reinsurance treaties, bordereaux                                                                     | “Current reinsurance program summary (treaties, limits, retentions, reinstatement) + cat model outputs (PML/TVaR) + ceded premium and recoveries history.”         | P1             |
| Segment profitability        | Profitability by LOB/state/program, expense allocation basis                                                         | “Underwriting result / combined ratio reporting used by management by LOB/state/program for last 12 quarters; include allocation methodology for shared expenses.” | P1             |
| Broker organic growth        | Revenue by client/producer, retention, new business                                                                  | “Monthly commission & fee revenue by producer and client segment for last 36 months; include new business vs renewal flags.”                                       | P1 (if broker) |
| Contingent commission        | Carrier agreements + contingent calc history                                                                         | “Carrier contingent/profit-sharing agreements and historical statements for last 3 years; detail calculation and true-up timing.”                                  | P2             |
| Capital adequacy             | Statutory statements, RBC calculations, rating agency letters                                                        | “Last 3 years statutory filings and latest RBC ratio calculation; any rating agency correspondence and regulatory exam reports.”                                   | P1             |

---

## Part 5: Red Flags

## Question 8: 8–10 red flags in this industry

### Carrier-focused red flags (most deal-critical)

| Red Flag                                                    | Early signal (CIM/VDD)                                           | Data room signal                                                        | Why it’s a problem                                        | How to investigate                                                                                |
| ----------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Adverse reserve development masked by “strong earnings”** | “Favorable development,” “conservative reserving” without detail | Triangles show worsening development; reserve strengthening after close | Understated liabilities inflate earnings and equity value | Ask for accident-year vs calendar-year, actuarial reports, changes in methods, claim audits       |
| **Growth spike in a softening market**                      | “Significant market opportunity,” “rapid premium growth”         | Rate change below loss trend; mix shift into riskier classes            | Underpricing and adverse selection show up with lag       | Bridge growth into rate/exposure/mix; compare pricing to loss trend; review UW guidelines changes |
| **Combined ratio improvement driven by reserve releases**   | “Improved profitability,” “disciplined underwriting”             | Accident-year CR flat/worse; calendar-year better due to PYD            | Not sustainable; can reverse                              | Decompose CR into AY attritional/cat/PYD; require AY exhibits                                     |
| **Cat exposure underappreciated**                           | “Limited cat exposure” in CIM                                    | High concentration in cat zones; low reinsurance attachment             | One event can wipe earnings/capital                       | Review exposure data, PML, reinsurance terms, event retentions                                    |
| **Reinsurance counterparty/collectability risk**            | “Strategic reinsurance partners”                                 | Large recoverables with slow collections or disputes                    | Liquidity and solvency risk                               | Aging of recoverables; contract terms; collateral; reinsurer ratings; dispute history             |
| **Program/MGA/fronting concentration**                      | “Scaled program platform”                                        | One MGA/program is large share; thin underwriting control               | Key-person/channel risk; loss leakage                     | Program profitability by cell; governance, audit rights, bordereaux timeliness                    |
| **Claims inflation / social inflation exposure**            | “Litigation environment” footnote                                | Severity trend spikes; prolonged open claims; rising LAE                | Margin compression and reserve risk                       | Frequency/severity analysis; adjuster practices; panel counsel; litigation rate                   |
| **Regulatory/rating pressure**                              | “Strong regulatory relationships”                                | Exam findings, consent orders, rating outlook negative                  | Can constrain growth and dividends                        | Review DOI correspondence, AM Best/S&P communications, capital plan                               |
| **Data quality / system limitations**                       | “Proprietary analytics” but vague                                | Can’t produce triangles by segment; inconsistent definitions            | Diligence blind spots; operational risk                   | Data dictionary, reconciliations, system extract tests, actuarial reliance                        |
| **Investment portfolio risk (esp. life/annuity)**           | “Enhanced yield strategy”                                        | Credit losses, illiquid assets, duration mismatch                       | Capital and earnings volatility                           | Portfolio breakdown, ALM reports, stress tests, impairment history                                |

---

## Question 8b: CIM phrases that should trigger concern

| Phrase in CIM                                                           | What it signals                                      | Follow-up                                                                                                                                |
| ----------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| “Improved profitability driven by **favorable prior-year development**” | Earnings may be reserve releases                     | Request AY vs CY exhibits; reserve rollforward; actuarial indication vs booked                                                           |
| “**Disciplined underwriting**” (no CR/LR detail)                        | Marketing language; may hide mix shift               | Ask for CR by LOB/state/program and rate vs trend                                                                                        |
| “**Limited catastrophe exposure**”                                      | Could be definitional games                          | Request cat zones exposure, PMLs, event retentions, reinsurance structure                                                                |
| “**Strategic reinsurance optimization**”                                | Could mean more retention to boost earnings          | Ask for net retentions over time, ceded/written bridge, reinstatement costs                                                              |
| “**Investing in growth / platform build**”                              | Expense run-rate may be understated                  | Ask for run-rate expense base post-investment; hiring plan; tech roadmap costs                                                           |
| “**Diversified distribution**”                                          | May have concentration                               | Ask top 10 brokers/MGAs, program concentration, carrier dependence                                                                       |
| “**Claims outcomes improving**”                                         | Could be claims handling changes or reserve releases | Ask closure rates, severity, litigation rate, claims audits                                                                              |
| “**Non-recurring large losses/cat**”                                    | Could be recurring in this line                      | Ask normalized cat/large loss framework and multi-year history                                                                           |
| “**Strong capital position**”                                           | Might be near regulatory thresholds                  | Request RBC/solvency ratio, dividend capacity, stress tests                                                                              |
| “**Transition to IFRS 17 / LDTI**”                                      | Comparability and volatility risk                    | Ask for pro forma impact, policy elections, and reconciliations pre/post adoption (IFRS 17 effective 1 Jan 2023). ([IFRS Foundation][5]) |

---

## Part 6: First Data Requests

## Question 9: Standard first-round data requests (before data room opens)

### P1 (Critical)

**Carrier / reinsurer**

1. **Segment underwriting pack (management view):** CR/LR/ER by LOB × state/geo × channel/program, quarterly for 12–20 quarters
2. **Loss triangles:** paid + incurred triangles by accident year (10 AYs) for each major LOB/segment
3. **Reserve rollforward:** case/IBNR/LAE by quarter for 12 quarters + methodology notes + actuarial indication summary
4. **Large loss listing:** threshold-defined (e.g., >$250k, >$1m), with cause, status, paid/incurred, recovery expectation
5. **Reinsurance summary:** current treaties (quota share/XoL), retentions, limits, reinstatements, ceding commissions; ceded premium and recoveries history
6. **Exposure data:** key exposure bases by segment (TIV, payroll, sales, vehicles, etc.) + concentration metrics
7. **Statutory filings & capital:** last 3 years statutory statements + latest RBC/solvency ratio + dividend capacity summary (NAIC RBC intervention framework context). ([NAIC][2])
8. **Investment portfolio summary:** asset allocation, duration, credit quality, top issuers, impairments

**Broker/MGA**

1. Monthly revenue by **producer / office / line**, 36 months
2. New business vs renewal flags; retention metrics
3. Producer comp plan summary + variable comp history
4. Top clients and top carriers with revenue/premium placed
5. Contingent/profit-sharing history and calculation basis

### P2 (Important)

* Policy/claims system data dictionary + sample extracts
* Claims operational KPIs (cycle time, leakage audits, litigation rate)
* Reinsurance counterparty schedule with collateral/ratings and any disputes
* Underwriting guidelines changes and authority matrices
* Cat model reports (PML/TVaR) and exposure management reports
* Regulatory exam reports and correspondence summaries
* For life: ALM reports, hedge program docs, lapse studies, experience studies, and adoption impacts for LDTI/IFRS 17 (LDTI effective timing varies by entity type). ([DART][3])

---

## Part 7: Management Questions

## Question 10: First 10 kickoff questions for management (and what you’re really testing)

| Question                                                                                   | What you’re trying to learn                              | Concerning answer                                                         |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1) “What is your **target combined ratio** by major line, and what’s driving variance?”    | Underwriting discipline and transparency                 | Vague answer; focuses only on calendar-year without AY/PYD clarity        |
| 2) “Break last 24 months growth into **rate vs exposure vs mix**.”                         | Whether growth is priced and intentional                 | “We don’t track that” / heavy growth with no rate support                 |
| 3) “How do you set reserves? What’s the role of the actuary vs management?”                | Governance and bias risk                                 | Management overrides actuary routinely; unclear rationale                 |
| 4) “How much of earnings is from **prior-year development**?”                              | Sustainability of earnings                               | High reliance on releases to hit targets                                  |
| 5) “Walk us through your **reinsurance program**—what risks are you buying down?”          | Risk appetite, capital protection, and hidden dependence | Program changed to retain more risk solely to save cost; thin explanation |
| 6) “Where are you most exposed to **cat / large loss** volatility?”                        | Tail risk                                                | Overconfidence, no quantified PML or net event retention                  |
| 7) “What are the top 5 drivers of **loss ratio movement**?”                                | Operational and market insight                           | Blames ‘weather’/‘inflation’ only; no controllable actions                |
| 8) “Any programs/MGAs that you would not write again?”                                     | Portfolio truth-telling                                  | No segment-level view or unwillingness to discuss underperformers         |
| 9) “What’s the plan for **expense ratio** improvement (or why is it structurally higher)?” | Scale vs inefficiency                                    | “We’re investing” with no run-rate plan or metrics                        |
| 10) “Any **regulatory/rating** issues or upcoming exams we should know about?”             | Headline risk                                            | Minimizes issues; surprises later in data room                            |

---

## Part 8: External Research

## Question 11: Most valuable external research

**Benchmark sources (pick by archetype):**

* **Regulatory / statutory:** NAIC (RBC, statutory concepts), state DOI filings and rate filings, solvency frameworks
* **Ratings & industry performance:** AM Best, S&P Global Ratings, Moody’s, Fitch (industry outlooks, capital/underwriting commentary)
* **Reinsurance market:** Swiss Re sigma, Munich Re publications, broker market updates (Aon/Marsh/Guy Carpenter)
* **Actuarial / technical:** Society of Actuaries, CAS papers, Milliman, WTW
* **Life-specific:** LIMRA (sales flows/persistency themes), ACLI (industry stats)

**Regulatory/compliance context to pull via web:**

* Licensing footprint, admitted vs E&S, complaint ratios, market conduct exams, solvency requirements
* Accounting standard transitions: IFRS 17 effective for periods beginning **on/after 1 Jan 2023**. ([IFRS Foundation][5])
* US GAAP long-duration contracts: LDTI effective dates differ for SEC filers vs others. ([DART][3])

**Competitor intelligence:**

* Peer statutory/10-K segment disclosures: CR/LR/ER by line, reserve development, cat disclosures
* Rate change commentary and exposure shifts
* Reinsurance dependence and catastrophe disclosures

**Recent trends worth scanning (module prompts):**

* Social inflation / litigation, climate/secondary peril losses, cyber loss evolution
* Reinsurance pricing/availability (attachment shifts)
* Usage-based / telematics, AI underwriting, claims automation
* Capacity shifts in E&S and specialty markets

---

## Part 9: Accounting & Recognition

## Question 12: Industry-specific accounting and revenue recognition issues

### A) P&C carrier (US GAAP / statutory patterns)

**Revenue recognition:**

* Premium is generally **earned over the coverage period**; written premium becomes earned premium as time passes; unearned portion sits in **UPR** (unearned premium reserve). (This is why “premium growth” ≠ immediate revenue growth.)

**Key cut-off risks:**

* Policy effective dates around period end
* Endorsements and cancellations
* Reinstatements and audits (esp. WC and liability audit premiums)

**Cost recognition/capitalization:**

* **Deferred acquisition costs (DAC)** and related amortization policies (where applicable)
* Capitalization of software/implementation costs (watch aggressiveness)

**Balance sheet estimates & reserves (biggest diligence area):**

* **Loss & LAE reserves** including **IBNR** (expected payments for incurred events not yet reported). ([Society of Actuaries][4])
* Premium deficiency reserves (if expected losses/expenses exceed unearned premium)
* Reinsurance recoverables and allowance for doubtful recovery
* Salvage/subrogation recoverables assumptions

**Comparability issues:**

* Statutory vs GAAP vs IFRS metrics
* Different LAE classification practices (what sits in LAE vs underwriting expense)
* Accident-year vs calendar-year presentation

### B) Life carrier: standards-driven volatility (LDTI / IFRS 17)

* **IFRS 17** materially changes recognition/measurement and is effective for periods beginning on/after **1 Jan 2023**. ([IFRS Foundation][5])
* **US GAAP LDTI (ASU 2018-12 as amended)** effective:

  * SEC filers (not SRC): fiscal years beginning after **Dec 15, 2022**
  * Others: fiscal years beginning after **Dec 15, 2024** (interims after Dec 15, 2025) ([DART][3])

**Why diligence cares:** adoption can change earnings patterns, reserve volatility, and comparability across periods.

### C) Broker / MGA revenue recognition traps

* **Premium is not revenue** (pass-through). Revenue is typically **commission/fees**.
* Timing: base commission often recognized when policy becomes effective / as coverage is provided (depends on policy/accounting).
* **Contingent commissions / profit-sharing**: variable consideration, often settled with lag; can be volatile and subject to estimation.

---

## Question 12b: QoE adjustment watchlist (insurance)

### Due diligence adjustments (non-recurring / non-operating)

| Category                                  | What to look for                                   | Direction                                  | Why it matters                                                 |
| ----------------------------------------- | -------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| Cat / large loss “normalization”          | Losses from truly unusual events vs “expected cat” | Varies                                     | Prevents over/understating sustainable underwriting earnings   |
| One-time reserve strengthening            | Reserve increases booked as a “one-off”            | Add-back (+) *only if truly non-recurring* | Often *not* add-backable; may indicate chronic under-reserving |
| Regulatory fines / settlements            | Consent orders, penalties                          | Add-back (+)                               | Non-recurring but signals compliance risk                      |
| Transaction / M&A / integration           | Banker/legal/TSA/integration costs                 | Add-back (+)                               | Not part of steady-state                                       |
| Investment gains/losses                   | Realized gains, impairments                        | Often remove                               | Separate underwriting from market noise                        |
| Reinsurance commutations / one-time items | Commutation gains/losses                           | Remove                                     | Can distort period earnings                                    |

### Pro forma adjustments (run-rate normalization)

| Category                    | What to look for                               | Direction    | Why it matters                           |
| --------------------------- | ---------------------------------------------- | ------------ | ---------------------------------------- |
| Rate increases mid-year     | Approved rate actions not fully earned         | Increase (+) | Full-year earning power                  |
| Expense run-rate            | “Growth investments” that are actually ongoing | Decrease (-) | Avoid overstating EBITDA                 |
| Reinsurance program changes | New treaties post-period                       | Varies       | Changes net risk and earnings volatility |

### IFRS/GAAP/statutory comparability adjustments

| Category                          | What to look for                         | Direction | Why it matters                                  |
| --------------------------------- | ---------------------------------------- | --------- | ----------------------------------------------- |
| LDTI / IFRS 17 adoption impacts   | Pre/post adoption not comparable         | Varies    | You need a consistent basis for trend and QoE   |
| Gross vs net premium presentation | Reinsurance and pass-through differences | Varies    | Avoid double-counting or misclassifying revenue |

---

## Part 10: Value Creation Opportunities

## Question 13: Typical value creation levers

| Opportunity                                                    | How to identify in diligence                                    | Typical impact (directional) |
| -------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------- |
| **Pricing / underwriting refinement**                          | Rate vs loss trend gaps; segment CR dispersion                  | High (core driver of value)  |
| **Portfolio optimization** (exit bad segments, grow good ones) | Segment CR and volatility analysis                              | High                         |
| **Claims leakage reduction**                                   | Benchmark leakage, litigation rate, cycle times, recovery rates | Medium–High                  |
| **Reinsurance optimization**                                   | Evaluate net retention vs capital; treaty economics             | Medium                       |
| **Expense ratio improvement**                                  | Expense benchmarking; process automation potential              | Medium                       |
| **Distribution/channel strategy**                              | Commission load, MGA terms, broker concentration                | Medium                       |
| **Data/analytics uplift**                                      | Evidence of manual underwriting, poor segmentation              | Medium                       |
| **Broker/MGA cross-sell & retention**                          | Retention by segment, product density, producer performance     | Medium–High                  |

Synergy areas (bolt-ons):

* Consolidate carrier appointments / improve terms via scale
* Shared services (finance/HR/IT), system consolidation
* Combined placement power for contingents (brokers)

---

## Part 11: Ownership & Related Party Patterns

## Question 14: Common ownership and related party patterns

### Ownership structures (common)

* **Holding company structures** with regulated insurance subs
* **PE-backed MGAs/brokers** with roll-up strategies
* **Mutual/reciprocal/captive-like structures** (less common in PE buyouts but shows up)
* **Fronting arrangements** (often paired with MGAs/program business)

**CIM ownership risk signals:**

* Complex intercompany transactions, “service company” arrangements, offshore reinsurers, heavy “allocated expenses”

### Related party transactions (RPTs)

| RPT type                     | What it looks like          | Risk                                       | CIM signal                             |
| ---------------------------- | --------------------------- | ------------------------------------------ | -------------------------------------- |
| Intercompany management fees | Fees to parent/serviceco    | Above-market, not run-rate                 | “Management fee,” “allocated expenses” |
| Related-party reinsurance    | Cede to affiliate/captive   | Capital/arbitrage, collectability, pricing | “Captive,” “affiliate reinsurer”       |
| Real estate leases           | Offices owned by principals | Off-market rent                            | Related party note                     |
| Investment management        | Fees to affiliated manager  | Conflicts, excessive fees                  | “Advisory fee” line item               |

---

## Part 12: Anything Else

## Question 15: What generalists commonly miss (and what trips teams up)

* **Calendar-year profitability can lie.** You must separate **accident-year performance** from **prior-year development**.
* **Premium ≠ revenue** (especially for brokers/MGAs); for carriers, **written ≠ earned**. Earned premium is tied to UPR mechanics.
* **Reserves are the deal.** Small % changes in ultimate loss picks can overwhelm EBITDA.
* **Reinsurance can “manufacture” stability.** Quota share can mask underwriting weakness; XoL attachment choices change volatility.
* **Data definitions are inconsistent.** LAE classification, “cat” definitions, large-loss thresholds—force a data dictionary early.
* **Capital/rating constraints are real operating constraints.** Growth isn’t purely “sales-driven”; it’s capital- and regulator-limited. NAIC RBC frameworks explicitly tie capital levels to intervention thresholds. ([NAIC][2])
* **Insurance is cyclical (hard/soft market).** “Great” results can be market-driven; diligence must test whether underwriting discipline holds through the cycle.
* **For life/annuity:** accounting (LDTI/IFRS 17), ALM, and policyholder behavior can dominate reported earnings—comparability across periods/entities is tricky. ([DART][3])

---

If you want, I can also convert the above into a more “module-native” structure (e.g., **detection keywords → archetype classification → KPI set → analysis plan → default data request templates**) so your assistant can programmatically select the right branch (carrier vs MGA vs broker) from sparse kickoff documents.

[1]: https://www.irmi.com/term/insurance-definitions/combined-ratio?utm_source=chatgpt.com "combined ratio"
[2]: https://content.naic.org/insurance-topics/risk-based-capital?utm_source=chatgpt.com "Insurance Topics | Risk-Based Capital | NAIC"
[3]: https://dart.deloitte.com/USDART/home/publications/deloitte/key-dates/key-dates?utm_source=chatgpt.com "Key Dates | DART – Deloitte Accounting Research Tool"
[4]: https://www.actuary.org/wp-content/uploads/2017/11/055_RRQQ.pdf?utm_source=chatgpt.com "Statement of Statutory Accounting Principles No. 55"
[5]: https://www.ifrs.org/projects/completed-projects/2020/amendments-to-ifrs-17/?utm_source=chatgpt.com "IFRS - Amendments to IFRS 17 Insurance Contracts"
