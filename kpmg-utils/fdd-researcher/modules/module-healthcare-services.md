## Part 1: Industry Identification

### Question 1: What words, phrases, or concepts signal **Healthcare Services (Provider Services, Clinics, Healthcare IT)**?

Think in **three buckets** the assistant can pattern-match:

### A) Provider Services / Clinics (patient care delivery)

**Business model / operations language**

* “Multi-site clinic,” “provider group,” “medical group,” “physician practice management,” “MSO (management services organization)”
* “Outpatient,” “ambulatory,” “ASC (ambulatory surgery center),” “urgent care,” “primary care,” “specialty care”
* “Ancillary services” (lab, imaging, PT/OT, DME), “in-house dispensing,” “infusion,” “dialysis,” “behavioral health”
* “Care delivery model,” “site of care,” “care pathways,” “panel size,” “care team,” “clinical staffing model”

**Revenue model / contracting language**

* “Fee-for-service,” “FFS,” “contracted rates,” “in-network/out-of-network”
* “Payer contracts,” “reimbursement,” “allowed amount,” “contractual allowances”
* “Capitation,” “PMPM,” “value-based care,” “shared savings,” “risk-based contracts,” “ACO”
* “Medicare/Medicaid/commercial,” “managed care,” “MA (Medicare Advantage)”
* “Patient responsibility,” “copay,” “coinsurance,” “deductible,” “self-pay,” “no surprises”

**KPI / metric terminology**

* “Visits,” “encounters,” “patient volumes,” “admissions,” “procedures”
* “CPT/HCPCS codes,” “ICD-10,” “DRG” (more hospital-y), “charge capture”
* “wRVUs / RVUs,” “provider productivity,” “utilization,” “schedule density,” “fill rate,” “no-show rate”
* “Net patient service revenue (NPSR),” “gross charges,” “gross-to-net,” “collection rate”
* “Denials,” “clean claim rate,” “days in A/R,” “aging,” “RCM (revenue cycle management)”
* “Credentialing,” “privileging,” “NPI,” “payor enrollment,” “prior authorization”

**Compliance / regulatory flags (very healthcare-specific)**

* “HIPAA,” “PHI,” “Stark Law,” “Anti-Kickback Statute (AKS),” “fee-splitting,” “corporate practice of medicine (CPOM)”
* “Clinical quality,” “HEDIS,” “MIPS/MACRA,” “OSHA,” “CLIA” (labs), “DEA” (controlled substances)

---

### B) Healthcare IT (software + tech-enabled services)

**Product / technical language**

* “EHR/EMR,” “practice management,” “patient portal,” “telehealth,” “RPM (remote patient monitoring)”
* “RCM platform,” “claims clearinghouse,” “coding automation,” “prior auth automation”
* “Interoperability,” “HL7,” “FHIR,” “interfaces,” “Epic/Cerner integration,” “API”
* “Clinical workflow,” “care coordination,” “population health,” “risk adjustment,” “HCC coding”
* “Cybersecurity,” “SOC 2,” “HITRUST,” “BAA (business associate agreement)”

**Commercial model / KPI language (often SaaS-like)**

* “Subscription,” “implementation fees,” “per provider/per location pricing,” “per member per month (PMPM),” “per claim,” “per encounter”
* “ARR/MRR,” “NRR,” “gross churn,” “logo churn,” “RPO,” “deferred revenue”
* “Bookings,” “pipeline,” “implementation backlog,” “go-live,” “attach rate,” “modules”

---

### C) “Hybrid” / Tech-enabled provider platforms

You’ll often see **both** sets of language:

* “We operate clinics and provide a software platform”
* “Clinically integrated network,” “enablement platform,” “care + tech,” “risk-bearing entity”
* Revenue lines split between **patient services** and **platform/services** (implementation, PMPM admin fees, RCM fees)

---

## Part 2: Units That Matter

### Question 2: 5–8 KPIs a generalist must know (and how they’re used)

> These are chosen to work across **provider services/clinics** and still be interpretable for **healthcare IT** deals.

| KPI                                                                                        | Definition (practitioner version)                                                                                                                                                                     | Why it matters for diligence                                                                                                                                          |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Encounters / Visits** (volumes)                                                          | Count of patient interactions that drive billing (office visits, procedures, sessions). Often tracked by site, provider, specialty, modality.                                                         | Establishes the “denominator” for revenue and staffing. Lets you separate **true growth** (volume) vs **rate/mix** effects.                                           |
| **Net Revenue per Encounter** (NRPE) / **Yield**                                           | What the business actually collects/earns per visit after contractual allowances, payer mix, coding, and write-offs. In IT, analogous to ARPU / revenue per provider seat / revenue per claim.        | The fastest way to detect **reimbursement pressure**, **coding changes**, **payer mix shift**, or aggressive “gross-to-net” assumptions.                              |
| **Payer Mix**                                                                              | Percent of revenue/visits from Medicare, Medicaid, commercial, self-pay, MA; sometimes broken down by specific plans. For IT, “customer mix” by segment (enterprise health systems vs SMB practices). | Mix drives everything: reimbursement rate, denial behavior, cash timing, compliance risk, and sensitivity to policy changes. Mix shifts often explain margin changes. |
| **Net Collection Rate (NCR)** / **Cash Collection %**                                      | Collections ÷ (gross charges − contractual allowances). Practitioners use it to diagnose revenue cycle effectiveness and underpayment/denial problems.                                                | A core “truth meter” for whether revenue is real and collectible. Low NCR = denials, poor billing, payer disputes, or weak patient collections.                       |
| **Days Sales Outstanding (DSO)** / **Days in A/R** + **A/R aging**                         | How long cash takes to arrive, plus what % is stuck >90/120 days. In IT, can be driven by annual billing, enterprise payment terms, or implementation milestones.                                     | Indicates cash conversion, billing discipline, and whether revenue is piling up uncollected (QoE risk + debt-like items). Also reveals integration/system issues.     |
| **Provider Productivity** (wRVUs/provider, visits/provider/day, billable hours)            | Output per provider FTE adjusted for specialty and clinic hours. Often paired with schedule utilization, template design, and no-shows.                                                               | Usually the #1 EBITDA lever in provider services. Also reveals whether growth claims are feasible given capacity and recruiting constraints.                          |
| **Capacity / Utilization** (appointment fill rate, chair/room utilization, OR utilization) | “How full are we?” % of available slots used, cancellation/no-show rate, wait times.                                                                                                                  | Shows whether growth is constrained by demand or operations. Underutilization = marketing/referrals problem; overutilization = access bottleneck and staffing risk.   |
| **Retention** (patients or customers)                                                      | Providers: returning patient rate, cohort retention for recurring specialties (BH, PT, primary care panels). IT: logo churn + net dollar retention.                                                   | Predicts sustainability of revenue. Low retention can mean service quality issues, competitive pressure, or poor outcomes. In IT, churn kills valuation.              |

---

## Part 3: Value Driver Framework

### Question 3: What does the **EBITDA value driver tree** look like?

Below is a **core tree** that fits most provider/clinic models, with optional branches for value-based care and healthcare IT.

```text
EBITDA
├── Net Revenue
│   ├── Patient / Client Service Revenue (Providers/Clinics)
│   │   ├── Volume
│   │   │   ├── # Encounters / Visits
│   │   │   │   ├── Provider FTE × Productivity (visits/day or wRVUs/FTE)
│   │   │   │   ├── Clinic hours × Slot capacity × Fill rate
│   │   │   │   └── No-show / cancellation rate
│   │   │   └── Case mix / service line mix (CPT mix, modality mix)
│   │   ├── Rate / Yield
│   │   │   ├── Payer mix (Commercial vs MA vs Medicare vs Medicaid vs Self-pay)
│   │   │   ├── Contracted reimbursement rates (fee schedule, negotiated rates)
│   │   │   ├── Coding/documentation intensity (coding level, HCC/RAF if relevant)
│   │   │   └── Price changes (self-pay rates, ancillary pricing)
│   │   └── Gross-to-Net Adjustments
│   │       ├── Contractual allowances (expected payer discounts)
│   │       ├── Denials & underpayments (appeals success, write-offs)
│   │       ├── Patient bad debt / implicit price concessions
│   │       ├── Refunds / take-backs / recoupments
│   │       └── Charity care (if applicable; policy-based)
│   ├── Value-Based / Risk Revenue (if applicable)
│   │   ├── PMPM capitation × attributed lives
│   │   ├── Shared savings / quality bonuses (performance vs targets)
│   │   └── Risk adjustments / settlements (often lagged, trued-up later)
│   ├── Healthcare IT / Tech-Enabled Services Revenue (if applicable)
│   │   ├── Recurring subscription (ARR/MRR) = # customers × price
│   │   ├── Usage-based fees = # claims / encounters × fee per unit
│   │   ├── Implementation / professional services = projects × avg fees
│   │   └── Gross-to-Net (credits, refunds, reseller/partner rev share)
│   └── Mix Effects (very important)
│       ├── Site mix (mature vs ramping clinics)
│       ├── Specialty mix (higher acuity / procedure vs routine)
│       ├── Payer mix shifts (Commercial → MA, etc.)
│       └── Channel/referral mix (self-generated vs hospital referrals, etc.)
│
├── Cost of Services / COGS (naming varies a lot)
│   ├── Clinical Labor (largest line)
│   │   ├── Provider compensation (salary, wRVU, collections-based, 1099)
│   │   ├── Clinical staff (nurses, MAs, therapists, techs)
│   │   ├── Benefits/taxes + overtime + agency/locums
│   │   └── Staffing ratios (staff per provider, staff per visit)
│   ├── Medical supplies & drugs (if applicable)
│   │   ├── Supplies per visit / per procedure
│   │   └── Purchasing terms / GPO participation / waste
│   ├── Outsourced clinical services
│   │   ├── Labs, imaging reads, anesthesia, call coverage
│   │   └── Contract rates × volumes
│   ├── Occupancy (sometimes in COGS, sometimes OpEx)
│   │   ├── Rent/lease, CAM, utilities
│   │   └── Sites × sqft × cost/sqft
│   └── IT hosting / support (for healthcare IT)
│       ├── Cloud hosting, 3rd-party data, support staff
│       └── Cost per customer / cost per transaction
│
└── Operating Expenses (OpEx)
    ├── Revenue Cycle / Billing & Collections (people + vendor fees)
    │   ├── Coders, billers, AR follow-up
    │   └── Clearinghouse, RCM vendor %, payment processing
    ├── Sales & Marketing (esp. IT / patient acquisition)
    │   ├── CAC = spend / new customers (or new patients)
    │   └── Referral development, digital marketing, call center
    ├── G&A (corporate)
    │   ├── Finance, HR, legal, compliance, leadership
    │   └── Insurance (incl. malpractice), audit, professional fees
    ├── Technology (non-COGS)
    │   ├── EHR/PM systems, cybersecurity, licenses
    │   └── Implementation/consulting spend
    └── Other
        ├── Recruiting, credentialing
        ├── Training, CME, provider onboarding
        └── Non-recurring items (settlements, investigations, disasters)
```

---

### Question 4: Full cost structure + what drives margins

Because “healthcare services” spans **care delivery** and **healthcare IT**, the module should teach both P&Ls and warn the team about **classification differences** (e.g., clinical staff in COGS vs OpEx).

#### A) Provider Services / Clinics P&L anatomy (typical)

**Revenue**

* Net patient service revenue (after contractual allowances)
* Ancillary revenue (labs, imaging, procedures, dispensing)
* Other (management fees, admin fees, payer incentives)

**Cost of Services / “COGS” (often 35–65% of revenue, highly model-dependent)**

* Provider compensation (often the single biggest driver)
* Clinical staff wages/benefits (nurses, MAs, techs)
* Medical supplies and drugs (if procedure-heavy)
* Outsourced clinical services (labs, imaging reads, anesthesia)
* Sometimes occupancy (rent/utilities) is included here for “four-wall” views

**OpEx**

* Billing/RCM and admin staff
* Corporate G&A (finance/HR/legal/compliance)
* Marketing / referral development / call center
* IT (EHR licensing, cybersecurity)
* Malpractice and other insurance

**What makes margins move (provider services)**

* **Volume leverage**: higher utilization improves labor efficiency and spreads fixed occupancy/admin
* **Provider productivity**: wRVU/visit per provider day; schedule optimization
* **Reimbursement & mix**: payer mix changes, contract renegotiations, coding intensity
* **RCM effectiveness**: denials, underpayments, patient collections
* **Labor costs**: wage inflation, reliance on locums/agency, overtime
* **Site maturity**: ramping clinics dilute margins until steady-state

**Unit economics to teach**

* **Per site (“four-wall”)**: Revenue − site-level clinical labor − site occupancy − site admin = contribution margin
* **Per provider**: Visits or wRVUs × net yield − direct comp − allocated support
* **Per visit**: Net revenue per visit − variable clinical cost per visit

**Typical EBITDA margin ranges (very directional; varies massively by specialty/mix)**

* Lower intensity / FFS-heavy clinics: ~10–20%
* Well-run multi-site specialties / dental / some BH models: ~15–30%
* High labor intensity / adverse payer mix / early ramp: can be single digits

> Teaching point for associates: in provider services, “gross margin” is less standardized—focus on **contribution margin** and **labor productivity**.

---

#### B) Healthcare IT P&L anatomy (typical)

**Revenue**

* Subscription (ratable)
* Usage-based fees (claims, messages, seats)
* Professional services / implementation
* Sometimes hardware or pass-through data fees

**COGS (often 20–45% → Gross margin ~55–80%)**

* Hosting/cloud and 3rd-party data costs
* Support / customer success (sometimes split between COGS and OpEx)
* Implementation delivery labor (if not in OpEx)
* Payment processing / clearinghouse costs (if usage-based)

**OpEx**

* R&D / product development
* Sales & Marketing (often a large share)
* G&A and compliance/security

**Margin differentiation (IT)**

* High-margin: sticky workflows + high NRR, efficient implementation, low support burden, strong pricing power
* Low-margin: heavy custom implementation, high support costs, low retention, high services mix

---

#### Fixed vs variable, controllable vs non-controllable (practical framing)

**Provider/clinic**

* Variable-ish: clinical labor tied to volume (but providers are semi-fixed in short term), supplies, outsourced clinical
* Fixed-ish: occupancy, core admin, minimum staffing, compliance overhead
* Less controllable: payer reimbursement trends, labor market
* More controllable: scheduling, staffing ratios, denial management, site footprint, procurement

**Healthcare IT**

* Variable: hosting/usage fees, payment processing, implementation labor (project-based)
* Fixed: core engineering, G&A
* Controllable: S&M efficiency, support model, infrastructure optimization

---

## Part 3 (continued): Working Capital & Capex

### Question 5: Working Capital value driver tree

```text
Operating Working Capital
├── Accounts Receivable (largest for providers)
│   ├── Third-party AR (payers)
│   │   ├── Claims submission lag (charge capture → bill drop)
│   │   ├── Clean claim rate / denial rate
│   │   ├── Underpayment rate + appeal cycle time
│   │   ├── Payer processing times
│   │   └── Contract complexity (prior auth, medical necessity edits)
│   ├── Patient AR
│   │   ├── Patient responsibility % (deductibles, co-insurance)
│   │   ├── Point-of-service collections vs post-service billing
│   │   ├── Financing plans / bad debt policy
│   │   └── Refunds / re-bills
│   ├── Unbilled AR / WIP
│   │   ├── Coding backlog, documentation delays
│   │   └── EHR/PM system issues, provider late notes
│   └── Allowances & reserves
│       ├── Contractual allowance estimate accuracy
│       └── Bad debt / implicit price concession policy
│
├── Inventory (often minimal; only for certain models)
│   ├── Medical supplies / disposables
│   ├── Pharmacy / dispensing inventory (if applicable)
│   └── DME / implants (if applicable)
│
├── Accounts Payable
│   ├── Medical supplies/vendors (terms, volume discounts)
│   ├── Labs/outsourced service providers
│   ├── Staffing agencies / locums
│   └── IT vendors / cloud (for IT)
│
├── Accrued Expenses / Other
│   ├── Accrued payroll, bonuses, benefits
│   ├── Provider compensation accruals (wRVU true-ups)
│   ├── Refund liabilities / payer recoupment reserves
│   ├── Self-insurance / malpractice accruals
│   ├── Deferred revenue (common in healthcare IT; annual prepay)
│   └── Value-based settlements (often lagged true-ups)
│
└── Cash Conversion Dynamics
    ├── Typical: slower than “normal services” due to claims processing
    ├── Seasonality: Q1 deductible reset → more patient AR + slower cash
    └── Cash traps: denials spikes, payer disputes, recoupments, retro rate changes
```

**DSO / timing nuances (directional)**

* Provider services often have meaningful **claims lag + runout** (services provided now, paid weeks later)
* Patient collections are increasingly important due to high-deductible plans
* Value-based reconciliations can lag **months** (bonuses/settlements after performance period)

---

### Question 6: What does Capex look like?

#### Growth Capex (providers/clinics)

* **New sites**: leasehold improvements, build-out, signage, initial supplies, furniture
* **Clinical equipment**: depends heavily on specialty (basic exam rooms vs imaging/ASC equipment)
* **Pre-opening costs**: recruiting, training, marketing (often expensed, sometimes “adjusted” in QoE)

**Typical cost to open a new unit**

* Extremely variable:

  * Basic clinic expansion: lower six figures to low seven figures
  * Procedure-heavy / imaging / ASC: can be several million+
* **Ramp to maturity**: often **6–18 months** depending on provider recruitment, payor credentialing, and referral development

#### Maintenance Capex

* Routine equipment replacement, minor remodels, IT refresh
* Often modest as % of revenue in clinic-heavy models, but higher if equipment-intensive

#### Technology / digital “Capex”

* EHR/practice management implementations (often expensed but can have capitalizable components depending on accounting)
* Cybersecurity hardening, network upgrades
* For healthcare IT vendors: capitalized software development may appear as “capex-like” (policy-driven)

**Watch item:** major system conversions (EHR/PM/RCM) can create **temporary revenue cycle disruption** (a classic diligence risk).

---

## Part 4: Common Analysis & Roadmap

### Question 7: Standard analyses (what they show + good vs concerning)

| Analysis                                             | What it is / structure                                                                                | What it shows                                     | Good vs. Concerning                                                                                                                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Revenue bridge (Price/Volume/Mix)**                | Monthly revenue change decomposed into volumes, net rate/yield, payer mix, service line mix, site mix | Whether growth is real and repeatable             | **Good:** volume-driven + stable yield. **Concern:** “growth” driven by one-time rate uplift, coding shifts, or mix swing that may revert                                 |
| **Payer mix & reimbursement analysis**               | Revenue/visits by payer + net revenue per visit by payer; track rate trends                           | Exposure to reimbursement pressure and mix shifts | **Good:** stable/managed mix + negotiated increases. **Concern:** commercial → MA/Medicaid shift, rate compression, payer terminations                                    |
| **CPT / service line mix analysis**                  | Volumes and net yield by CPT group, modality, specialty                                               | Whether case mix is improving or deteriorating    | **Good:** mix shift to higher value services with capacity. **Concern:** shift to low-acuity or lower reimbursed codes, or mix changes due to competitive encroachment    |
| **Provider productivity & capacity**                 | wRVUs/provider, visits/provider/day, utilization, no-shows, schedule density                          | Core operational efficiency                       | **Good:** productivity improving without quality decline; utilization healthy. **Concern:** productivity drop masked by headcount growth, overreliance on overtime/locums |
| **Denials / revenue cycle dashboard**                | Denial rate by reason, clean claim rate, underpayment rate, AR aging buckets, DSO trend               | “Is revenue collectible?”                         | **Good:** stable/low denials, improving aging. **Concern:** rising denials, AR >120 days growing, large payer disputes                                                    |
| **Location economics (“four-wall”)**                 | Site-level P&L: revenue, clinical labor, occupancy, site admin; contribution margin                   | Which locations drive profit; ramp curve          | **Good:** mature sites strong; new sites ramp predictably. **Concern:** many sites structurally unprofitable; ramp takes too long                                         |
| **Same-store growth / like-for-like**                | Sites open >12 months: revenue/visits/profit trend                                                    | Organic performance excluding expansion           | **Good:** positive same-store volumes + stable yield. **Concern:** flat/negative same-store masked by new site openings                                                   |
| **Provider roster / attrition**                      | Provider list with start/end dates, specialty, productivity, comp model                               | Key-person risk and recruiting engine health      | **Good:** low attrition, strong recruiting pipeline. **Concern:** departures of top producers, credentialing delays, heavy dependence on a few clinicians                 |
| **Value-based contract performance (if applicable)** | PMPM revenue vs cost, quality metrics, reconciliation history, downside exposure                      | True economics of “risk”                          | **Good:** consistent bonuses, controlled downside. **Concern:** one-off upside; unmodeled downside risk; poor quality scores                                              |
| **Healthcare IT ARR bridge (if IT present)**         | ARR start + new + expansion − churn ± price                                                           | Core recurring engine                             | **Good:** NRR >100%, low churn. **Concern:** churn spikes, high services mix propping revenue                                                                             |

---

### Question 7b: What data unlocks each analysis?

| Analysis                    | Data Required                                                                  | Request Wording                                                                                                                     | Priority |
| --------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Revenue bridge              | Monthly revenue + visit volumes + net yield drivers by site/service line/payer | “Monthly revenue and visit volumes by location, payer, and service line for trailing 36 months”                                     | P1       |
| Payer mix & yield           | Revenue + visits by payer; net revenue per visit; payer contract rate changes  | “Revenue and visits by payer (Medicare/Medicaid/Commercial/MA/Self-pay) by month for 36 months, plus reimbursement rate change log” | P1       |
| CPT / service line mix      | CPT-level volumes and allowed amounts (or grouped CPT categories)              | “CPT-level (or CPT group) volume and net revenue/allowed amount by month for 24–36 months”                                          | P1       |
| Productivity & utilization  | Provider roster + wRVUs/visits + clinic hours/slots + no-shows                 | “Provider roster with FTE, specialty, comp model, and monthly wRVUs/visits and clinic session hours for 24–36 months”               | P1       |
| Denials / RCM dashboard     | Denials by reason, AR aging, DSO, underpayment rates, charge lag               | “Monthly denial rate by reason, AR aging summary, DSO, and charge lag metrics for 24 months; top 10 payers detail”                  | P1       |
| Location economics          | Site-level P&L (revenue, labor, rent, other direct costs), opening dates       | “Location-level income statement with opening dates, monthly revenue and direct costs for trailing 36 months”                       | P1       |
| Same-store (like-for-like)  | Location revenue/visits with open/close and acquisition dates                  | “Revenue and visits by location with opening/closing dates and acquisition dates (if applicable), monthly for 36 months”            | P1       |
| Provider attrition          | Start/term dates, production history, top producer list                        | “Provider list with start/end dates and monthly production metrics; identify top 20 producers”                                      | P1       |
| Value-based performance     | Contract terms, attributed lives, PMPM, quality scores, reconciliations        | “Value-based contract summary (terms, attribution, PMPM rates), monthly attributed lives, and reconciliation/bonus history”         | P1       |
| IT ARR bridge (if relevant) | ARR by customer, bookings, churn, expansions, services revenue                 | “ARR by customer (monthly), churn/expansion log, services revenue by project, trailing 36 months”                                   | P1       |
| Cash conversion             | Cash receipts, billing lag, AR rollforward                                     | “AR rollforward by month and cash receipts by payer for 24 months; unbilled AR/WIP summary”                                         | P2       |

---

## Part 5: Red Flags

### Question 8: 8–10 red flags (early signals + data room signals + how to investigate)

| Red Flag                                                         | Early Signal (CIM/VDD)                                            | Data Room Signal                                                                | Why it’s a problem                      | How to investigate                                                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| **Revenue inflated by aggressive gross-to-net assumptions**      | “Strong reimbursement optimization” with little detail            | Large true-ups, volatile contractual allowances, rising refunds/recoupments     | QoE risk; revenue not sustainable       | Request gross charges → net revenue bridge, allowance methodology, historical true-ups |
| **RCM breakdown (denials / aging blow-up)**                      | “Investing in RCM” or “transitioning billing systems”             | Denials up, AR >120 days growing, DSO rising                                    | Cash trap + potential revenue reversal  | Denials by reason/payer, AR aging, charge lag, payer underpayment logs                 |
| **Payer concentration / contract fragility**                     | “Leading payor relationships” (no stats)                          | Top payer(s) >25–40% revenue; contract up for renewal soon                      | Pricing shock or termination risk       | Payer concentration schedule + contract summaries, renewal calendar, rate history      |
| **Provider concentration / key-person risk**                     | “Renowned clinicians” emphasized                                  | Top 5 providers drive big % of revenue; attrition or LOI risk                   | Revenue can walk out the door           | Provider production and tenure, non-competes (if enforceable), retention plans         |
| **Unsustainable growth due to capacity constraints**             | “Robust demand” + limited mention of staffing                     | Utilization >95%, long wait times, heavy overtime/locums                        | Growth stalls; margins compress         | Capacity metrics, recruiting pipeline, schedule templates, locums spend trend          |
| **Site expansion masking weak same-store performance**           | Heavy growth narrative around new clinics                         | Same-store flat/down; new sites unprofitable beyond expected ramp               | Platform story weaker than portrayed    | Like-for-like analysis, site maturity curve, cohort by opening year                    |
| **Value-based downside exposure not understood**                 | “Value-based leadership” without economics                        | Contracts have downside but limited reserves; volatile reconciliation           | Hidden liability; earnings volatility   | Contract terms, historical reconciliations, sensitivity cases, reserves/accruals       |
| **Compliance / regulatory exposure**                             | “Strong compliance culture” while operating in high-risk services | Investigations, repayments, unusual referral arrangements, documentation issues | Could be existential (fines, exclusion) | Compliance reports, audits, hotline logs, payer recoupments, legal summaries           |
| **High reliance on 1099 / staffing agencies**                    | “Flexible provider model”                                         | Large contractor spend; inconsistent coverage; misclassification risk           | Margin instability + tax/legal risk     | Contractor listing, rate cards, conversion plans, worker classification review         |
| **IT integration / cybersecurity weakness (esp. IT businesses)** | “Integrates with major EHRs”                                      | High churn tied to integrations, repeated outages, weak security posture        | Customer churn + liability              | Uptime/SLA history, security assessments, SOC2/HITRUST status, incident history        |

---

### Question 8b: CIM language that should trigger concern

| Phrase in CIM                                  | What it signals               | Follow-up                                                                 |
| ---------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| “Revenue cycle transformation underway”        | RCM instability / AR risk     | Ask for pre/post metrics: DSO, denials, charge lag, AR aging              |
| “Contractual allowances normalized”            | Aggressive revenue estimation | Request allowance methodology + historical true-ups and refunds           |
| “Significant reimbursement uplift initiatives” | One-time or fragile yield     | Decompose yield changes by payer, CPT, contract; confirm sustainability   |
| “Provider-led culture” / “key opinion leaders” | Provider concentration risk   | Request provider production ranking and attrition history                 |
| “Rapid de novo expansion”                      | Ramp risk + pre-opening costs | Request site maturity curves and pre-opening cost schedule                |
| “Diversified payor base” (without numbers)     | Possible payor concentration  | Request top payers by revenue and contract renewal dates                  |
| “Strong compliance program” (generic)          | Sometimes defensive           | Ask for audits, investigations, repayments, and policies                  |
| “EHR/PM system upgrade”                        | Operational disruption risk   | Timeline, go-live issues, AR/denials trend around conversion              |
| “Adjusted EBITDA excludes start-up costs”      | Add-back risk                 | Request detailed add-back support and whether costs recur with growth     |
| “Value-based upside opportunity”               | Downside may be understated   | Demand full contract term summary incl. downside and settlement mechanics |

---

## Part 6: First Data Requests

### Question 9: Standard first-round data requests (pre-data room “one shot”)

#### P1 (Critical)

1. **Monthly revenue + volumes + yield drivers (36 months)**

   * By **location**, **service line**, **payer category**
   * Format: Excel (flat files + pivot-ready)
   * Why: unlocks revenue bridge, same-store, mix

2. **Gross charges to net revenue bridge (monthly, 24–36 months)**

   * Gross charges, contractual allowances, denials/write-offs, bad debt/implicit price concessions, refunds
   * Why: validates “net revenue” quality

3. **RCM dashboard pack (monthly, 24 months)**

   * DSO, AR aging, charge lag, denial rate by reason, underpayment %, top payer disputes
   * Why: identifies cash traps and QoE risks

4. **Provider roster + production + comp summary (24–36 months)**

   * Provider name/ID, specialty, FTE, start date, comp model, monthly wRVUs/visits
   * Why: capacity, concentration, productivity, comp risk

5. **Location list + site economics (monthly, 36 months)**

   * Opening date, acquired vs de novo, revenue, direct labor, rent, other direct costs (four-wall)
   * Why: assess ramp/maturity, underperformers

6. **Payer concentration + contract summary**

   * Top payers with revenue %, contract term/renewal dates, rate history, material clauses
   * Why: price risk and renewal cliff

#### P2 (Important)

7. **Service line/CPT mix detail (24–36 months)**

   * CPT grouping ok if too large
8. **Patient cohort/retention metrics** (if recurring care model)
9. **Value-based contracts pack** (if applicable)
10. **Capex and site build-out schedule** (last 3 years + plan)
11. **Legal/compliance summary** (open items, investigations, repayments)
12. **For healthcare IT components**: ARR by customer (monthly), churn/expansion log, services backlog, deferred revenue/RPO

---

## Part 7: Management Questions (30 minutes with CFO)

### Question 10: First 10 questions (what you’re really trying to learn + concerning answers)

| Question                                                                                  | What you’re trying to learn        | Concerning answer                                                        |
| ----------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| 1) “What were the **top 3 drivers** of revenue growth in the last 12–24 months?”          | Volume vs yield vs mix vs M&A      | Vague “market demand” with no decomposition                              |
| 2) “How has **payer mix** changed, and what do you expect next year?”                     | Exposure to reimbursement changes  | Mix drifting to lower-paying segments with no mitigation plan            |
| 3) “Any **major payer contract renewals** or disputes in the next 12–18 months?”          | Pricing cliff risk                 | Material renewals soon; prior disputes; no visibility on rate outcomes   |
| 4) “Where are you on **denials/DSO**, and what’s driving changes?”                        | RCM health and cash trap risk      | Rising DSO explained as “timing” for multiple quarters                   |
| 5) “What percent of revenue is driven by the **top 10 providers**?”                       | Key-person dependency              | High concentration + providers have weak retention tools                 |
| 6) “What’s your **recruiting pipeline** and time-to-credential?”                          | Feasibility of growth plan         | Long credentialing delays; inability to hire; heavy locums reliance      |
| 7) “How do you set and validate **contractual allowances** and bad debt estimates?”       | Revenue recognition aggressiveness | “We true it up annually” or limited historical reconciliation            |
| 8) “Any **systems changes** (EHR/PM/RCM) recently or planned?”                            | Operational disruption risk        | Recent conversion correlated with worsening AR/denials                   |
| 9) “Are you in any **value-based/risk arrangements**? What’s the downside?”               | Hidden liabilities and volatility  | Downside exists but “we don’t expect it” with no data/reserves           |
| 10) “What are the biggest **compliance risks** in your model and how are they monitored?” | Regulatory exposure                | Overconfidence + no recent audits; dismisses referral/compensation risks |

---

## Part 8: External Research

### Question 11: Most valuable external research targets

**Benchmarks (operational + financial)**

* Provider productivity benchmarks by specialty (wRVUs/FTE, visits/day)
* Staffing ratio benchmarks (MAs per provider, therapists per clinician, etc.)
* RCM benchmarks: denial rates, DSO ranges, % AR >120 days
* Margin benchmarks by specialty and site of care (outpatient vs ASC vs home)

**Regulatory / reimbursement context**

* Medicare fee schedule dynamics and annual update themes
* Telehealth policy direction and state licensing constraints (if telehealth)
* CPOM / fee-splitting rules by state (if multi-state provider platform)
* Surprise billing rules implications (if out-of-network exposure)
* For controlled substances / BH: prescribing scrutiny and compliance expectations

**Competitor intelligence**

* Local density: competing clinics, health systems, urgent care chains
* Payer landscape: dominant insurers in footprint, provider network trends
* For IT: competitive product comparisons, integration partnerships, switching costs

**Industry mechanics primers**

* How credentialing, prior auth, claims adjudication, and underpayments work
* Typical contract structures: FFS, capitation, shared savings, PMPM admin fees
* Referral dynamics: sources, leakage, hospital relationships

**Recent trends to track**

* Labor inflation and clinician shortages
* Shift of procedures to outpatient/ASC
* Consolidation and PE roll-ups
* AI documentation/ambient scribes affecting productivity
* Cybersecurity incidents and regulatory expectations

---

## Part 9: Accounting & Recognition

### Question 12: Industry-specific accounting and revenue recognition issues

#### Provider services / clinics: revenue recognition “gotchas”

* **Net patient service revenue is highly judgmental** due to:

  * Contractual allowances (expected payer discounts)
  * Variable consideration (denials, underpayments, retroactive adjustments)
  * Patient responsibility and implicit price concessions (what you *actually* expect to collect)
* **Cut-off risk**:

  * Services performed but not billed (“unbilled AR/WIP”)
  * Claims lag/runout near period end
* **Payer settlements / recoupments**:

  * Retro rate changes, take-backs, audits can create liabilities
* **Value-based arrangements**:

  * Timing of recognition for bonuses/shared savings can be lagged and estimate-driven
  * Need clarity on whether there is **downside risk** and how it’s accrued

#### Healthcare IT: ASC 606 complexity areas

* **Multiple-element arrangements**:

  * Subscription + implementation + training + support
  * Key question: is implementation **distinct** or does it bundle into subscription?
* **Professional services recognition**:

  * Over-time vs point-in-time; milestone-based; risk of early recognition
* **Variable consideration**:

  * Usage-based fees, credits, service-level penalties
* **Deferred revenue / RPO**:

  * Annual prepay common; look for billings vs revenue timing

#### Cost recognition & capitalization

* **Capitalized software development** (health IT) and what’s expensed vs capitalized
* **Implementation costs** (both sides): internal-use software rules, capitalization policies
* **Sales commissions / contract acquisition costs** (IT): capitalization vs expense policy

#### Balance sheet estimates & reserves to scrutinize

* Allowance for doubtful accounts / implicit price concession (provider AR)
* Contractual allowance methodology and reconciliation history
* Refund liabilities and payer recoupment reserves
* Self-insurance / malpractice reserves (if self-insured)
* Accrued provider comp (wRVU true-ups, bonus accruals)
* Contingent liabilities: investigations, audits, repayments

#### Cash vs accrual considerations

* Healthcare often has **bigger cash timing gaps** than general services due to claims cycles
* Patient collections increasingly lag and can be structurally lower

#### Comparability issues (why diligence teams get fooled)

* Different revenue presentations: gross charges vs net revenue emphasis
* Different classification: clinical labor in COGS vs OpEx (gross margin not comparable)
* Different payer mixes and specialty mixes (apples-to-oranges)
* Lease accounting treatment differences (ASC 842 / IFRS 16) affecting EBITDA comparability

---

### Question 12b: QoE adjustment watchlist for this industry

#### A) Due diligence adjustments (non-recurring / non-operating)

| Category                                              | What to look for                                | Direction                               | Why it matters                                       |
| ----------------------------------------------------- | ----------------------------------------------- | --------------------------------------- | ---------------------------------------------------- |
| One-time legal/compliance costs                       | Settlements, investigations, audit defense      | Add-back (+)                            | Not recurring, but must assess “repeat risk”         |
| EHR/RCM conversion costs                              | One-time consulting, dual-run costs             | Add-back (+)                            | Normalize ongoing cost base                          |
| Provider recruitment spikes                           | One-time sign-on, relocation, recruiter fees    | Add-back (+) (case-by-case)             | Often recurring if growth-heavy—scrutinize carefully |
| De novo opening / pre-opening costs                   | Pre-opening staff, marketing, training          | Add-back (+) (if clearly non-recurring) | But platform roll-outs may make it recurring         |
| Disaster/COVID-era anomalies (if in trailing periods) | Temporary programs, closures, atypical staffing | Varies                                  | Normalize to run-rate                                |

#### B) Pro forma adjustments (run-rate normalization)

| Category                        | What to look for                               | Direction                    | Why it matters                          |
| ------------------------------- | ---------------------------------------------- | ---------------------------- | --------------------------------------- |
| Site ramp run-rate              | Newly opened sites not at steady-state         | Increase (+) (if evidenced)  | Full-year effect and maturity economics |
| Provider onboarding             | New providers added mid-period                 | Increase (+)                 | Annualize production and comp           |
| Contracted rate changes         | Known future rate increases/decreases          | Varies                       | Make EBITDA reflect post-close reality  |
| Cost take-outs / centralization | Billing vendor change, shared services scaling | Increase (+) (if actionable) | Value creation plan credibility         |

#### C) IFRS/GAAP / policy adjustments

| Category                               | What to look for                                                   | Direction    | Why it matters                       |
| -------------------------------------- | ------------------------------------------------------------------ | ------------ | ------------------------------------ |
| Revenue recognition policy differences | Allowance methods, variable consideration, implementation bundling | Varies       | Comparability and sustainability     |
| Bad debt / implicit price concession   | Under-reserving to boost EBITDA                                    | Decrease (–) | EBITDA overstated                    |
| Capitalized software dev (IT)          | Aggressive capitalization boosts EBITDA                            | Decrease (–) | EBITDA inflated vs cash economics    |
| Lease accounting (ASC 842 / IFRS 16)   | EBITDA uplift differences                                          | Varies       | Ensure consistent basis across comps |

---

## Part 10: Value Creation Opportunities

### Question 13: Typical value creation levers (how to spot + impact)

| Opportunity                                                        | How to identify in diligence                                | Typical impact (directional)                         |
| ------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------- |
| **RCM optimization** (denials, underpayments, patient collections) | High denials, aging AR, low NCR vs peers                    | 1–3% revenue uplift + working capital release        |
| **Provider productivity & scheduling**                             | Low visits/day, high no-shows, poor template design         | 5–15% throughput improvement in constrained sites    |
| **Staffing model optimization**                                    | High labor per visit, overtime/agency reliance              | 100–300 bps EBITDA improvement in labor-heavy models |
| **Payer contracting / reimbursement uplift**                       | Below-market rates, unmanaged renewals                      | Rate/mix improvement; magnitude depends on leverage  |
| **Ancillary expansion** (lab/imaging/PT/dispensing)                | Leakage to external providers; strong referral base         | Mix improvement + higher contribution margin         |
| **Site footprint rationalization**                                 | Chronic underperformers, poor ramp cohorts                  | Margin protection; reduces distraction + cash burn   |
| **Centralize back office (MSO playbook)**                          | Fragmented billing/HR/finance across sites                  | G&A leverage as scale increases                      |
| **Value-based upside capture** (if relevant)                       | Quality metrics strong, attribution growing                 | Upside can be meaningful but must model downside     |
| **For healthcare IT: pricing + packaging**                         | Underpriced legacy cohorts, low attach rate                 | ARR growth + NRR improvement                         |
| **Bolt-on synergy areas**                                          | Overlapping markets, duplicate back office, cross-referrals | Procurement + G&A + commercial cross-sell            |

---

## Part 11: Ownership & Related Party Patterns

### Question 14: Common ownership structures + related party transactions

#### Ownership structures (what’s typical + what risks it creates)

* **Physician-owned / founder-led practices**

  * Risk: owner comp normalization, informal controls, key-person dependence
* **PE-backed platforms / roll-ups**

  * Risk: aggressive add-backs, integration issues, multiple systems, rushed de novo strategy
* **MSO / PC model (common due to CPOM)**

  * Risk: legal enforceability, fee-splitting concerns, governance complexity, change-of-control consents
* **Hospital JV / referral-driven models**

  * Risk: referral concentration, contract restrictions, compliance scrutiny

**CIM signals of ownership risk**

* “MSO provides all non-clinical services” (structure complexity)
* “Founder-led relationships drive referrals” (concentration)
* “Adjusted EBITDA excludes platform build” (potentially recurring)

#### Related party transaction patterns (normal vs concerning)

| RPT Type                            | What it looks like                     | Risk                                           | Diligence focus                                   |
| ----------------------------------- | -------------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| Management fees to owners/holdco    | “Management fee” line item             | Above-market; disappears post-close            | Normalize to market, verify service reality       |
| Real estate leases                  | Clinics rent from affiliated RE entity | Off-market rent; hidden value extraction       | Rent comparables; lease terms; renewal risk       |
| Shared services / allocations       | Parent allocates IT/HR/finance         | TSA needed post-close; under/over stated costs | Standalone cost build; TSA assumptions            |
| Physician compensation arrangements | Related-party provider entities        | Compliance + reasonableness                    | Fair market value (FMV), productivity, governance |
| Referral-related arrangements       | Marketing/“consulting” with sources    | Stark/AKS risk                                 | Contract review + compliance counsel              |

---

## Part 12: Anything Else

### Question 15: What else should an FDD team know?

* **Healthcare revenue is “net by nature.”** If someone talks in gross charges without a clear gross-to-net, be skeptical.
* **Classification is messy.** Gross margin comparisons are often meaningless—focus on **contribution margin, labor productivity, and RCM health**.
* **Credentialing is a hidden growth constraint.** You can “hire” a provider and still wait months to bill certain payers.
* **System conversions are a classic earnings cliff.** EHR/PM/RCM changes can spike denials and AR for quarters.
* **Deductible resets create real seasonality.** Q1 often looks worse on cash/collections due to patient responsibility.
* **CPOM and fee-splitting rules matter in multi-state platforms.** Structure can drive real transaction risk, not just legal formality.
* **Value-based is not automatically better.** It can be great—or it can hide downside obligations and reconciliation volatility.
* **The best operators win on boring execution:** scheduling, staffing ratios, denial management, payer contract discipline, and standardized playbooks across sites.

---

If you want this turned into a **machine-usable module spec** (e.g., JSON schema: signals → KPIs → driver trees → data requests → red flags → questions), say so and I’ll convert the above into a structured format your assistant can directly ingest.
