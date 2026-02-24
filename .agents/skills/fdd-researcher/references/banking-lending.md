# Module: Banking & Lending

## Industry Identification
Net interest income (NII), deposit franchise, loan origination, portfolio/managed receivables, asset-liability management (ALM/ALCO), servicing/sub-servicing, hold for investment (HFI), held for sale (HFS), warehouse facility, securitization/ABS, treasury management, relationship lending, sponsor finance, asset-based lending (ABL), equipment finance, factoring, merchant cash advance (MCA), auto finance, consumer installment, NIM, net interest margin, yield on earning assets, cost of funds, efficiency ratio, CECL, ACL, nonaccrual, nonperforming assets (NPA/NPL), net charge-offs (NCO), vintage performance, roll rates, delinquency buckets, borrower/obligor, covenants, LTV/DSCR, participation/syndication, gain-on-sale, servicing fee bps

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Net Interest Margin (NIM) | NII as % of avg earning assets (loans + securities); the core spread | Core earnings durability; rate sensitivity; competitive deposit pressure |
| Loan Yield / Yield on Earning Assets | Portfolio earnings rate by product segment | Decomposes NIM: pricing power vs risky mix vs temporary repricing |
| Cost of Funds (COF) | Weighted cost of deposits + wholesale funding | Funding is "silent killer": margin compression, liquidity risk, covenant pressure |
| Net Charge-Off (NCO) Rate | Net losses (charge-offs - recoveries) as % of avg loans | True realized credit cost; rising NCOs signal overstated earnings quality |
| Delinquency & Nonaccrual | 30/60/90+ DPD buckets; NPL/NPA ratios | Early warning: spike in early-stage delinquency precedes charge-offs |
| ACL Coverage | Allowance/Loans, ACL/NPL, qualitative overlays | Under-reserving inflates earnings; key purchase accounting focus |
| Efficiency Ratio | Noninterest expense / (NII + noninterest income) | Scalability test; separates efficient franchises from overstaffed operators |
| Capital/Leverage | CET1/TCE (banks); debt-to-equity (non-banks) | Growth capacity, dividend ability, loss absorption |

## Value Driver Trees

### Earnings Tree (PPNR)
```
Pre-Provision Net Revenue (PPNR)
├── Net Interest Income (NII)
│   ├── Interest Income (Asset Yield)
│   │   ├── Avg Loans × Loan Yield
│   │   │   ├── Volume: originations, utilization, renewals, runoff/prepay
│   │   │   ├── Price: base rate + spread, floors, risk-based pricing
│   │   │   ├── Mix: C&I vs CRE vs consumer; secured vs unsecured; fixed vs floating
│   │   │   └── Credit: nonaccrual policy, payment deferrals, PIK
│   │   └── Avg Securities × Yield (AFS/HTM mix, duration, reinvestment)
│   └── Interest Expense (Funding Cost)
│       ├── Avg Deposits × Cost (rate paid)
│       │   ├── Mix: noninterest DDA vs interest-bearing; retail vs commercial; brokered vs core
│       │   └── Pricing: deposit beta, promos, relationship pricing
│       └── Avg Borrowings × Cost (FHLB/repo/warehouse/ABS; covenants/advance rates)
├── Noninterest Income
│   ├── Origination/commitment fees (often amortized into yield)
│   ├── Servicing income (UPB × bps)
│   ├── Gain on sale/securitization (volume × margin; volatile)
│   ├── Treasury mgmt/payments/interchange
│   └── Late fees, NSF/OD, partner fees
└── Operating Expenses
    ├── Personnel (headcount × comp; productivity: loans per RM, cost per booked loan)
    ├── Tech & data (core, LOS/LMS, cybersecurity, vendor contracts)
    ├── Occupancy/branches
    ├── Marketing/acquisition (CAC)
    ├── Collections/servicing ops
    └── Regulatory/compliance (FDIC insurance, BSA/AML)

[Below PPNR but CORE to economics]
├── Provision for Credit Losses (growth, migration, macro, overlays)
└── Other: securities gains/losses, MSR marks, hedge ineffectiveness
```

### Balance Sheet Tree
```
Balance Sheet (Lender-Adapted)
├── Assets
│   ├── Cash & Earning Cash
│   ├── Securities (AFS/HTM)
│   ├── Loans Held for Investment (HFI) - by product/segment
│   ├── Loans Held for Sale (HFS) - pipeline, funded not yet sold
│   ├── Less: Allowance for Credit Losses (ACL)
│   ├── Servicing Assets (MSRs)
│   └── Other Assets (OREO, prepaids)
├── Liabilities
│   ├── Deposits (noninterest DDA, interest-bearing, brokered)
│   ├── Borrowings (FHLB/repo, warehouse, ABS, senior/sub debt)
│   └── Other Liabilities (reserves, accruals)
└── Equity/Capital (CET1, retained earnings, AOCI)
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|---------------------|
| Growth > controls | "Record originations" + "expanded into new segments" | Underwriting policy changes; rising exceptions; ops backlogs | Compare vintage losses pre/post growth; exception logs; staffing vs volume |
| Credit normalization narrative | "Delinquencies normalizing" | 30+ DPD rising; roll rates worsening; modifications up | Build roll-rate + vintage curves; ask about cure rates and mods |
| Under-reserved ACL | "Strong credit performance" with improving earnings | ACL coverage dropping while risk indicators worsen | Rebuild ACL reasonableness; review overlays, model governance |
| Funding fragility | "Diversified funding" but light detail | Brokered/wholesale share high; maturities near | Funding mix + maturity ladder; covenant headroom; contingency plan |
| Concentration risk | "Leading lender in [niche]" | High top-10 exposure; correlated collateral | Top exposure tape; stress by scenario |
| Gain-on-sale/marks driving earnings | "Strong secondary market execution" | Large volatile gain-on-sale; MSR marks | Separate core NII/fees from marks; hedge effectiveness review |
| Policy override culture | "Relationship-driven" | High override rates; missing documentation | Underwriting exception report; internal audit findings |
| Regulatory/compliance baggage | "Enhanced compliance investments" | MRAs/MRIAs, consent orders, BSA/AML gaps | Review exam reports, remediation plans, staffing |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| NIM decomposition/rate bridge | Core earnings durability vs rate cycle | Monthly avg balances & rates: loans by segment, securities, deposits by type, borrowings (36 mo) |
| Portfolio stratification | Concentration and "where can it break?" | Exposure by product, geography, industry, sponsor, top obligors |
| Credit quality dashboard | Near-term credit trajectory | Delinquency buckets, nonaccrual, criticized/classified, watchlist |
| Vintage/cohort loss curves | Underwriting drift and "bad vintages" | Origination cohorts with performance through time |
| ACL/CECL adequacy | Reserve sufficiency | CECL model outputs, assumptions, overlays, forecast vs actual |
| Funding & liquidity analysis | Liquidity risk | Maturity ladder, line terms, covenants, stress test |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Monthly financial package (IS, BS, KPIs: NIM, yield, COF, NCO, ACL, delinquency) | 36 months | Excel + PDF board deck | Establishes trendlines; reveals earnings drivers |
| Loan/receivables tape (origination date, product, balance, rate, coupon, fees, term, collateral, geography, industry, FICO, LTV/DSCR, risk rating, status, charge-off, recoveries) | As-of + history | CSV | Portfolio stratification, vintage, loss analyses |
| Delinquency & losses rollforward (30/60/90+ DPD, nonaccrual, charge-offs, recoveries by product/channel/vintage) | Monthly, 36 mo | Excel | Early warning; validates credit narrative |
| ACL/CECL package (methodology, segmentation, assumptions, overlays, governance, backtesting) | Last 8 quarters | PDF + Excel | Reserve adequacy is primary QoE risk |
| Funding & liquidity schedule (deposits by type/rate, borrowings with maturities/covenants, unused capacity, stress summary) | As-of + 24 mo | Excel | Identifies funding cliffs and margin pressure |
| Top exposures & concentration reports (top 50 borrowers, CRE by property type, industry/geography) | Current | Excel | Concentration drives downside cases |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Sample loan files across segments (largest exposures, newest vintages) | Sample | Loan files | Underwriting quality validation |
| Pricing grids, approval authorities, exception workflow | Current | PDF/Excel | Governance and pricing discipline |
| Compliance package (exam reports, MRAs/MRIAs, complaint logs, remediation plans) | Last 3 years | PDF | Regulatory tail risk |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Interest income/effective yield | Loan origination fees deferred and amortized over life vs booked upfront | Pulling forward fee income inflates current earnings |
| Nonaccrual policy | When interest stops accruing; reversals of previously accrued interest | Late nonaccrual triggers overstate income |
| Gain-on-sale/securitization | Whether transfers qualify as sales vs secured borrowings; retained interest valuation | Volatile earnings; economic vs accounting income gaps |
| ACL/CECL methodology | Model assumptions, segmentation, qualitative overlays | Under-reserving inflates earnings and capital |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Regulatory/legal settlements | Fines, remediation costs, one-time consulting | Add-back (+) if truly non-recurring |
| One-time tech conversion | Core/LOS conversion "one-off" | Add-back (+) with caution—often multi-year |
| Restructuring/branch closures | Exit costs | Add-back (+) to normalize footprint |
| Staffing to support growth | Understaffed ops/collections | Decrease (-) current profitability not sustainable |
| Funding repricing | Warehouse spreads step-up; deposit repricing | Varies—get to true run-rate NIM |
| ACL/CECL methodology gaps | Under-reserving vs peer/policy | Decrease (-) if reserves low |

## External Research Topics
- FDIC Quarterly Banking Profile: NIM, ROA, efficiency ratio, charge-offs, asset quality benchmarks
- Peer 10-Ks/10-Qs, earnings decks for NIM, efficiency, credit metrics
- OCC/Fed/FDIC guidance on ACL/CECL and examiner expectations
- Industry trends: CRE stress pockets, consumer credit normalization, funding mix shifts

