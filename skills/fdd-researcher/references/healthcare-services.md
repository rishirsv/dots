# Module: Healthcare Services

## Industry Identification
multi-site clinic, provider group, medical group, physician practice management, MSO, outpatient, ambulatory, ASC, urgent care, primary care, specialty care, ancillary services, infusion, dialysis, behavioral health, fee-for-service, FFS, payer contracts, reimbursement, capitation, PMPM, value-based care, shared savings, ACO, Medicare Advantage, encounters, visits, CPT, HCPCS, wRVUs, RVUs, net patient service revenue, NPSR, gross-to-net, denials, clean claim rate, RCM, credentialing, HIPAA, Stark Law, Anti-Kickback, CPOM, EHR, EMR, telehealth, RPM

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Encounters/Visits | Count of patient interactions driving billing (by site, provider, specialty) | Establishes revenue denominator; separates true volume growth from rate/mix effects |
| Net Revenue per Encounter (NRPE) | Collections per visit after allowances, payer mix, coding, write-offs | Detects reimbursement pressure, coding changes, payer mix shifts |
| Payer Mix | % revenue/visits from Medicare, Medicaid, Commercial, MA, Self-pay | Drives reimbursement rates, denial behavior, cash timing, compliance risk |
| Net Collection Rate (NCR) | Collections ÷ (gross charges − contractual allowances) | Truth meter for revenue quality; low NCR = denials, poor billing, payer disputes |
| Days in A/R + Aging | Cash arrival timing + % stuck >90/120 days | Cash conversion, billing discipline, QoE risk |
| Provider Productivity | wRVUs/provider, visits/provider/day, billable hours | #1 EBITDA lever; reveals growth feasibility given capacity and recruiting |
| Capacity/Utilization | Fill rate, chair/room utilization, no-show rate | Demand vs operations constraint |
| Retention | Returning patient rate, cohort retention | Predicts revenue sustainability |

## Value Driver Trees

### EBITDA Tree
```
EBITDA
├── Net Revenue
│   ├── Patient Service Revenue
│   │   ├── Volume
│   │   │   ├── Provider FTE × Productivity (visits/day, wRVUs/FTE)
│   │   │   ├── Clinic hours × Slot capacity × Fill rate
│   │   │   ├── No-show/cancellation rate
│   │   │   └── Case mix / service line mix
│   │   ├── Rate/Yield
│   │   │   ├── Payer mix (Commercial vs MA vs Medicare vs Medicaid)
│   │   │   ├── Contracted reimbursement rates
│   │   │   └── Coding/documentation intensity
│   │   └── Gross-to-Net Adjustments
│   │       ├── Contractual allowances
│   │       ├── Denials & underpayments
│   │       ├── Patient bad debt
│   │       └── Refunds / recoupments
│   ├── Value-Based Revenue (if applicable)
│   │   ├── PMPM capitation × attributed lives
│   │   └── Shared savings / quality bonuses
│   └── Mix Effects (site mix, specialty mix, payer mix)
├── Cost of Services (35-65% of revenue)
│   ├── Clinical Labor (largest)
│   │   ├── Provider compensation
│   │   ├── Clinical staff (nurses, MAs)
│   │   └── Benefits/taxes + overtime + locums
│   ├── Medical supplies & drugs
│   ├── Outsourced clinical services
│   └── Occupancy
└── Operating Expenses
    ├── Revenue Cycle / Billing
    ├── G&A (finance, HR, legal, compliance, malpractice)
    └── Technology (EHR/PM systems)
```

### Working Capital Tree
```
Operating Working Capital
├── Accounts Receivable (largest for providers)
│   ├── Third-party AR (payers)
│   │   ├── Claims submission lag
│   │   ├── Denial rate + appeal cycle time
│   │   └── Contract complexity (prior auth)
│   ├── Patient AR
│   │   ├── Patient responsibility %
│   │   └── Point-of-service vs post-service collections
│   └── Unbilled AR / WIP (coding backlog, documentation delays)
├── Payables + Accruals
│   ├── Medical supplies/vendors
│   ├── Accrued payroll, bonuses
│   ├── Provider compensation accruals (wRVU true-ups)
│   └── Refund liabilities / recoupment reserves
└── Cash Conversion: Slower than normal services; Q1 deductible reset → more patient AR
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|-----------|------------------|-------------------|
| Aggressive gross-to-net assumptions | "Strong reimbursement optimization" | Large true-ups, volatile contractual allowances, rising refunds | Gross charges → net revenue bridge, allowance methodology |
| RCM breakdown | "Investing in RCM" or "transitioning billing systems" | Denials up, AR >120 days growing, DSO rising | Denials by reason/payer, AR aging, charge lag |
| Payer concentration | "Leading payor relationships" | Top payer(s) >25-40% revenue; contract renewal soon | Payer concentration schedule, contract summaries |
| Provider concentration | "Renowned clinicians" | Top 5 providers drive big % revenue; attrition risk | Provider production/tenure, non-competes |
| Capacity constraints | "Robust demand" | Utilization >95%, heavy overtime/locums | Capacity metrics, recruiting pipeline |
| Expansion masking weak same-store | Heavy growth narrative around new clinics | Same-store flat/down; new sites unprofitable | Like-for-like analysis, site maturity curve |
| Value-based downside exposure | "Value-based leadership" | Contracts have downside but limited reserves | Contract terms, historical reconciliations |
| Compliance/regulatory exposure | "Strong compliance culture" | Investigations, repayments, unusual referral arrangements | Compliance reports, audits, recoupments |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| Revenue bridge (Price/Volume/Mix) | Whether growth is real and repeatable | Monthly revenue + visits by site/service line/payer (36 mo) |
| Payer mix & reimbursement | Exposure to reimbursement pressure | Revenue + visits by payer; net revenue per visit; rate change log |
| Provider productivity & capacity | Core operational efficiency | Provider roster + wRVUs/visits + clinic hours/slots |
| Denials/RCM dashboard | "Is revenue collectible?" | Denial rate by reason, AR aging, DSO, underpayment rates |
| Location economics (four-wall) | Which locations drive profit | Site-level P&L: revenue, labor, rent, direct costs |
| Same-store growth | Organic performance excluding expansion | Location revenue/visits with open/close and acquisition dates |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Monthly revenue + volumes + yield drivers by location, service line, payer | 36 months | Excel | Revenue bridge, same-store, mix analysis |
| Gross charges to net revenue bridge | 24-36 months | Excel | Validates net revenue quality |
| RCM dashboard (DSO, AR aging, charge lag, denial rate, underpayment %) | 24 months | Excel | Identifies cash traps and QoE risks |
| Provider roster + production + comp summary | 24-36 months | Excel | Capacity, concentration, productivity |
| Location list + site economics (opening date, de novo vs acquired, revenue, direct costs) | 36 months | Excel | Ramp/maturity assessment |
| Payer concentration + contract summary (top payers, revenue %, terms, renewal dates) | Current | Excel + contracts | Price risk and renewal cliff |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Value-based contracts pack (terms, attribution, PMPM, reconciliation history) | Historical | Contracts + Excel | Risk arrangement economics |
| Legal/compliance summary (open items, investigations, repayments) | Historical | Summary | Regulatory exposure |
| Cash receipts, billing lag, AR rollforward | 24 months | Excel | Cash conversion analysis |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Net patient service revenue | Highly judgmental: contractual allowances, variable consideration, implicit price concessions | Revenue not sustainable or collectible |
| Payer settlements/recoupments | Retro rate changes, take-backs, audits creating unrecorded liabilities | Hidden liabilities |
| Value-based recognition | Timing of bonuses/shared savings; downside risk accruals | Early recognition or unrecorded downside |
| Bad debt reserves | Under-reserving implicit price concessions | EBITDA overstated |
| Provider comp accruals | wRVU true-ups, bonus accruals | Understated liabilities |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| One-time legal/compliance | Settlements, investigations, audit defense | Add-back (+) but assess repeat risk |
| EHR/RCM conversion costs | One-time consulting, dual-run costs | Add-back (+) |
| De novo pre-opening costs | Pre-opening staff, marketing, training | Add-back (+) if non-recurring |
| Provider onboarding | New providers added mid-period | Increase (+) annualize production and comp |
| Bad debt under-reserving | Implicit price concession too low | Decrease (-) EBITDA overstated |

## External Research Topics
- Provider productivity by specialty benchmarks (wRVUs/FTE, visits/day)
- RCM benchmarks: denial rates, DSO ranges, % AR >120 days
- Medicare fee schedule dynamics and annual updates
- Telehealth policy direction and state licensing
- CPOM / fee-splitting rules by state
- Labor inflation and clinician shortages
- AI documentation/ambient scribes (productivity impact)

