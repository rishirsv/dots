# Module: Business Services

## Industry Identification
consulting, advisory, implementation, managed services, systems integration, digital transformation, SOW, MSA, T&M, fixed fee, onshore, offshore, nearshore, outsourcing, BPO, call center, contact center, per seat, per transaction, SLA, staffing, temp staffing, contract staffing, staff augmentation, contingent labor, permanent placement, retained search, MSP, VMS, rate card, markup, spread, bill rate, pay rate

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Utilization | % of available time billable to clients (billable hours / available hours) | 1-3 pts can swing EBITDA; reveals bench risk and overtime sustainability |
| Bill Rate | Avg client payment per hour after discounts/mix; tracked by role, client, geo | Core pricing lever; shows pass-through capability for wage inflation |
| Pay Rate + Burden | Fully loaded delivery cost per hour (salary + benefits + taxes + bonus) | Margin is spread game; rising wages without rate increases = compression |
| Gross Profit / Spread | (Bill rate - pay rate - burden) x hours; the "real revenue" | Prevents focus on gross billings when GP/hour is deteriorating |
| Realization | Billed amount / standard billable value; billing and project realization | Early warning for fixed-fee issues and weak contract management |
| Backlog / Book-to-Bill | Contracted future work; bookings / revenue recognized | Forward indicator; low book-to-bill foreshadows post-close revenue decline |
| Fill Rate / Time-to-Fill | % reqs filled; days to place; redeployment speed | Recruiting engine health; impacts revenue, margin, and retention |
| GP per FTE | Gross profit per billable head or per recruiter | Separates "growth via hiring" from "growth via productivity" |

## Value Driver Trees

### EBITDA Tree
```
EBITDA
├── Net Revenue / Gross Profit
│   ├── Gross Revenue / Billings
│   │   ├── Professional Services (T&M)
│   │   │   ├── Billable Hours x Avg Bill Rate
│   │   │   │   ├── Hours = FTE x Available Hours x Utilization
│   │   │   │   └── Mix: seniority, skill, geo, delivery model
│   │   │   └── Fixed Fee Revenue = # Projects x Avg Fee x % Complete
│   │   ├── Outsourced/BPO
│   │   │   ├── # Seats x Price/Seat x Seat Utilization
│   │   │   └── OR # Transactions x Price/Transaction
│   │   └── Staffing
│   │       ├── Temp: Contractor Hours x Avg Bill Rate
│   │       └── Perm: # Placements x Avg Fee
│   └── Gross-to-Net: Discounts, SLA credits, write-offs, pass-through netting, FX
├── Direct Costs
│   ├── Delivery Labor: Salaries, benefits, taxes, bench cost
│   ├── Subcontractors: Rates x hours, premium roles
│   ├── Staffing: Temp wages, payroll taxes, workers comp
│   └── Delivery OpEx: Tools, telecom, background checks, travel
└── OpEx (SG&A)
    ├── Sales: Headcount, commissions, marketing, bid costs
    ├── Recruiting: Recruiters, job boards, referral bonuses
    └── G&A: Leadership, finance, HR, IT, facilities, insurance
```

### Working Capital Tree
```
Operating Working Capital
├── Receivables + Contract Assets
│   ├── Billed AR (billing frequency, payment terms, disputes/deductions)
│   ├── Unbilled AR / WIP (ASC 606): % complete estimates, change orders pending
│   └── Allowance: Credit quality, concentration, disputes
├── Payables + Accruals
│   ├── Vendor terms, subcontractor cadence
│   ├── Accrued payroll, bonuses, commissions
│   └── Insurance accruals (workers comp, health)
└── Other: Deferred revenue, MSP rebates, litigation reserves
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|-------------------|
| Gross vs net revenue games | "Record revenue gross of pass-through" | Large pass-throughs; inconsistent definitions | Gross-to-net bridge; reconcile to GL |
| Utilization propping EBITDA | "Best-in-class utilization" no metrics | Utilization spikes, high overtime, bench in G&A | Utilization by month/practice; overtime %; bench headcount |
| Spread compression | "Wage investments" / "tight labor" | Pay rates rising faster than bill rates | Bill/pay spread by segment; repricing cadence |
| Subcontractor over-reliance | "Flexible delivery" / "partner network" | Rising sub %; lower margin on sub projects | Split margins employee vs sub; review terms |
| Hidden customer concentration | "Diverse customers" no chart | Top 1-3 drive majority GP | Top customer revenue AND gross profit; rebid dates |
| Fixed-fee overruns | "Strategic fixed-fee wins" | Write-downs, WIP build, declining realization | Project realization + write-downs; change order process |
| AR disputes/credits | "Strong collections" high DSO | High credits, write-offs, VMS deductions | Dispute log; credit trends; timecard controls |
| Worker classification risk | "Uses 1099 contractors" | High 1099 mix; missing contracts; audits | Classification policy; audits; worker agreements |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| Revenue bridge (P/V/M) | Growth sustainability; price vs volume vs mix | Monthly revenue by service/geo/client (36 mo) |
| GP bridge | True economic story: spread, utilization, burden | Hours x spread x burden changes by segment |
| Utilization analysis | Operational discipline; scaling ability | Utilization by month/practice/role; bench; overtime |
| Rate analysis | Pricing power; margin compression exposure | Bill/pay rates by client, role, geo, contract type |
| Customer concentration | Revenue durability; negotiating leverage risk | Top 10/20 revenue AND GP; retention by cohort |
| Backlog/bookings | Forward visibility; post-close revenue risk | Bookings, backlog burn, win rates, pipeline |
| Project profitability | Contract governance; future margin reset risk | Project margin, write-downs, change orders |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Monthly P&L by service line | 36 months | Excel | Bridges, seasonality, margin trend, QoE base |
| Revenue + GP by customer (top 50) | 24-36 months | Excel w/ contract type | Concentration, retention, pricing power |
| Delivery headcount and hours by practice/level | 24-36 months | Excel | Utilization + capacity story |
| Bill rate / pay rate / burden by segment | 24-36 months | Excel | Spread/pricing story; wage inflation exposure |
| AR aging + credit memos/write-offs | 24 months | Excel | WC risk and revenue quality |
| Backlog/bookings roll-forward + pipeline | 24-36 months | Excel | Forward visibility |
| Top 10-20 customer contracts (MSA/SOW) | Current | PDF/Word | Repricing, termination, SLA, assignment |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Project-level margin file (fixed-fee) | 24 months + YTD | Excel | Realization, write-downs, % complete |
| Insurance/claims summary | 3-5 years | Excel + docs | Workers comp, E&O, self-insured retention |
| SLA/KPI performance + penalties | 24 months | Excel | Delivery risk, penalty exposure (BPO) |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Revenue recognition | T&M: hours delivered; Fixed-fee: % complete estimates; Staffing: principal vs agent | Cut-off issues; optimistic % complete pulls revenue forward |
| Gross vs net presentation | Principal vs agent assessment for staffing/pass-throughs | Distorts revenue growth and margin comparability |
| Unbilled AR / WIP | Contract assets growth vs revenue; aging and collectability | Hidden disputes; acceptance delays; scope creep |
| Variable consideration | SLA penalties, service credits estimation and timing | Revenue overstated if penalties under-accrued |
| Workers comp reserves | Loss runs, reserve methodology, claims history | Under-reserved = EBITDA not sustainable |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Owner comp & perks | Above-market comp, personal travel/auto, family payroll | + |
| Related-party rent | Lease to owner entity above market | +/- |
| One-time legal/settlements | Employment/classification claims, client disputes | + |
| New contract ramp | Seats/volumes starting mid-period | + |
| Pricing changes | Contract repricing effective mid-period | +/- |
| Utilization normalization | Unusually low/high utilization | varies |
| Hiring plan partial load | Growth investment headcount partially in period | - |

## External Research Topics
- Wage data: Government labor statistics, salary surveys, sector wage indices by occupation
- Staffing benchmarks: Industry association data (market size, growth by segment, gross margin/spread trends)
- Public comps: Staffing (Randstad, Adecco, ManpowerGroup); IT services (Accenture, Cognizant, EPAM); BPO (Teleperformance, Concentrix)
- Regulatory: Worker classification rules, co-employment risk, overtime/wage-hour regs

