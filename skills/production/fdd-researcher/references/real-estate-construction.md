# Module: Real Estate & Construction

## Industry Identification
portfolio, assets, properties, communities, sites, square footage, doors/units, GLA, rent roll, in-place rent, market rent, effective rent, concessions, abatements, lease-up, stabilized, occupancy, vacancy, leased %, tenant turnover, NOI, same-store NOI, cap rate, NNN, modified gross, CAM reimbursements, WALT, TI/LC, unit turns, make-ready, management fees, PUPM, Yardi, RealPage, AppFolio, land acquisition, entitlements, zoning, GDV, yield on cost, development margin, sales velocity, absorption, backlog, construction loan, CIP, WIP inventory, facility management, SOV, pay apps, AIA billing, change orders, retainage, GMP, WIP schedule, over/under billings, margin fade

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Occupancy (Physical/Economic) | Physical: % units/SF leased. Economic: rent collected as % of potential | Physical vs economic gap reveals concessions or bad debt |
| NOI / NOI Margin | Property-level profit: rental income minus property opex (before G&A, interest, depreciation) | Core "engine" for owners; bridges to valuation via cap rates |
| Effective Rent & Rent Growth | What tenants actually pay after concessions/abatements | Documents can show headline growth while effective rents flat due to concessions |
| Same-Store NOI Growth | Performance of consistent asset set excluding acquisitions, dispositions, lease-ups | Separates true operating performance from "we bought more stuff" |
| Lease Expiry Profile / WALT / Renewal Rate | When leases roll + renewal frequency | Single biggest forward risk indicator |
| Backlog & Book-to-Bill | Backlog: contracted work not yet recognized. Book-to-bill: new bookings / revenue recognized | Revenue visibility; quality matters (margin, cancellation rights) |
| Project/Job Gross Margin & Margin Fade | Margin expected at bid vs realized; "fade" = systematic decline | #1 gotcha in contractors: poor estimating looks fine early, collapses at closeout |
| Working Capital Drag | Cash tied up in A/R, retainage, unbilled work vs funded by payables/deferred revenue | Explains why EBITDA doesn't convert to cash |

## Value Driver Trees

### EBITDA Tree (Property Operations)
```
EBITDA
├── Net Revenue / Property Income
│   ├── Rental & Other Property Income
│   │   ├── # Units/SF × In-place Rent
│   │   ├── Occupancy × Rent Levels
│   │   ├── Other Income (parking, pet, storage, fees)
│   │   ├── Reimbursements (CAM/NNN recoveries)
│   │   └── Gross-to-Net: Concessions, Bad Debt, Early Terminations
│   ├── Property Mgmt Fee Revenue
│   │   └── Units/SF Under Mgmt × Fee Rate (bps or PUPM)
│   └── Building Services Revenue
│       ├── Recurring: # sites × monthly contract price
│       └── T&M: # service calls × avg invoice value
├── Property Operating Expenses (NOI COGS)
│   ├── Utilities, R&M, Contract Services
│   ├── On-site Payroll
│   ├── Property Taxes (non-controllable step-ups)
│   └── Insurance (volatile)
└── OpEx / SG&A
    ├── Corporate G&A
    ├── Regional/Branch Overhead
    └── Insurance (GL, WC, bonding)
```

### Construction/Development Tree
```
Project Revenue Recognized
├── Real Estate Sales: # closings × avg sale price
├── Construction: % complete × contract value (ASC 606)
├── Approved Change Orders
└── Variable Consideration (claims/incentives) [RISK]

Project Costs (often capitalized)
├── Land + Site work
├── Hard Costs (GC/subs/materials)
├── Soft Costs (A&E, permits, legal)
├── Interest Capitalized
└── Capitalized Overhead [policy risk]
```

### Working Capital Tree
```
Operating Working Capital
├── Receivables
│   ├── Tenant A/R (delinquency, eviction pipeline, bad debt policy)
│   └── Trade A/R (billing cadence, pay app cycle, disputes, retainage 5-10%)
├── Contract Assets/Liabilities
│   ├── Underbillings (revenue > billings)
│   └── Overbillings (billings > revenue)
├── Inventory (WIP/lots/finished units - development - huge)
└── Payables (vendors, subs, payroll accruals)
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|-------------------|
| "Stabilized" earnings doing heavy lifting | "Stabilized NOI," "lease-up underway," "mark-to-market upside" | Large concessions, slow absorption, negative LFL NOI | Same-store NOI, effective rent bridge, lease-up cohort performance |
| Occupancy stable but cash isn't | "Strong demand" + strong NOI narrative | Rising tenant A/R aging, delinquency spike, payment plans | Monthly delinquency, aging, collections policy, eviction pipeline |
| Lease expiry cliff | "High-quality tenants" without expiry detail | Large % rent expiring 12-24 months; weak renewal history | Expiry schedule, renewal rates, leasing spreads, TI/LC history |
| Backlog touted but low quality | "Record backlog," "strong pipeline" | Concentrated, low-margin fixed-price, unapproved COs | Backlog by contract type + margin; CO status; cancellation terms |
| Margin fade / late write-downs | "Disciplined project execution" | WIP shows repeated margin reductions; big closeout losses | Track bid vs latest GM by job; CO log; PM turnover |
| Underbillings growing | "Working capital investment for growth" | Large contract assets, long-aged underbillings | Aging of unbilled, approval status, customer acceptance terms |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| Rent roll & occupancy deep dive | Revenue stability + near-term leasing risk | Current rent roll + 24-36mo monthly occupancy |
| Same-store NOI bridge | True operating performance vs acquisitions | Property-level monthly P&L (36mo) with asset dates |
| Effective rent vs headline rent | Whether pricing power is real | Concessions/free rent by property/month |
| Lease expiry / WALT / renewal analysis | Forward revenue/capex exposure | Lease abstracts, expiry schedule, leasing spreads |
| Backlog quality & burn | Revenue visibility and margin risk | Backlog by customer, type, margin, dates |
| WIP & margin fade | Estimating discipline and earnings quality | WIP schedule + job cost + CO log |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Rent roll | Current + prior YE | Excel from PMS | Core revenue, expiries, arrears, concessions |
| Property-level operating statements | 36mo monthly | Excel | Same-store NOI and expense benchmarking |
| Capex + TI/LC spend | 36mo by property | Excel | NOI sustainability and future cash needs |
| A/R aging (tenant or trade) | Current + 24mo | Excel | Cash risk, delinquency, collection effectiveness |
| WIP schedules (if contracting) | 24-36mo monthly | Excel | Margin fade + over/under billings |
| Backlog report | Current | Excel | Revenue visibility and margin risk |
| Change order log | 12-24mo | Excel | Profitability quality and disputes |
| Customer/tenant concentration | 12-24mo | Excel | Concentration / renewal risk |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Lease abstracts | Current | Excel | Contract terms, options, escalations |
| Insurance summary + loss runs | 5 years | PDFs | Claims, premium step-ups, hidden liabilities |
| Related party transactions | 3 years | Excel | Normalization and separation risks |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Revenue recognition (ASC 606) | Over-time vs point-in-time; cost-to-cost measure; variable consideration | Aggressive recognition of unapproved COs/claims inflates revenue |
| Contract assets/liabilities | Under/over billings reconciliation to WIP | Large underbillings = cash trap |
| Gross vs net presentation | Pass-through subcontractor/reimbursable costs | Margin illusion |
| Capitalization policy | Which payroll/overhead capitalized into CIP; interest capitalization timing | Aggressive policy inflates EBITDA |
| Lease income recognition | Straight-line rent (non-cash); variable rent; concession treatment | NOI comparability issues |
| Warranty/callback reserves | Adequacy relative to historical experience | Under-reserved = margin overstatement |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Related party rent/expenses | Above/below-market rent to affiliated landlord | +/- |
| Owner compensation & perks | Excess salary, vehicles, travel, family payroll | + |
| One-time legal/settlements | Large litigation or dispute settlements | + |
| New contracts mid-period | Contracts started mid-year | + (run-rate) |
| Rent increases signed | Executed renewals not fully reflected | + |
| Revenue recognition policy | POC vs point-in-time; variable consideration | Varies |

## External Research Topics
- Market data: Rents, vacancy, concessions, absorption from broker research; cap rates and transaction comps
- Construction costs: Material price indices; labor wage growth; trade availability
- Regulatory: Rent regulation/tenant protection laws; permitting and zoning timeline changes; building codes
- Competitor intelligence: Local/regional competitors and market share
- Macro trends: Interest rate impact on cap rates; insurance market trends; ESG/decarbonization retrofit requirements

