# Module: Technology / SaaS

## Industry Identification
SaaS, Software-as-a-Service, cloud-based, hosted, multi-tenant, subscription-based, recurring revenue, ARR, MRR, per seat pricing, per user pricing, usage-based, consumption pricing, land and expand, product-led growth, PLG, freemium, customer success, renewal, expansion, upsell, cross-sell, net revenue retention, NRR, NDR, gross revenue retention, GRR, logo churn, ACV, TCV, bookings, billings, RPO, CAC, LTV, CAC payback, Magic Number, Rule of 40, deferred revenue, contract liabilities, ratable recognition, capitalized commissions, SOC 2, ISO 27001, GDPR, HIPAA, FedRAMP

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| ARR/MRR | Run-rate recurring subscription revenue at a point in time; definitions vary on inclusion of usage/services/one-time | Core value driver and base for retention/growth decomposition; reveals if "growth" is recurring or service-driven |
| Net Revenue Retention (NRR/NDR) | Cohort revenue after 12 months including expansion minus downgrades/churn, divided by starting revenue | Shows if installed base compounds or shrinks; high NRR reduces dependence on new logo sales |
| Gross Revenue Retention (GRR) | Cohort revenue after 12 months excluding expansion; equivalent to (1 - gross churn%) | Separates true product stickiness from expansion masking churn; low GRR signals weak value/competitive pressure |
| Logo Churn | % of customers leaving over period; segment by SMB vs enterprise | Diagnoses concentration risk, PMF, and whether NRR driven by small subset |
| ACV/ARPA/ARPU | Average annual contract value or revenue per account/user; often seats x price or usage x rate | Anchors pricing power and market positioning; drives sales motion choice |
| Bookings/Billings/RPO | Bookings = contracted ACV/TCV signed; Billings = invoices issued; RPO = future contracted revenue not yet recognized | Judges forward momentum; revenue can look smooth while bookings/RPO deteriorate |
| CAC & CAC Payback | CAC = fully-loaded acquisition cost; Payback = months to recover CAC from gross profit on new ARR | Prevents "growth at any cost" blindness; reveals if growth is efficient/sustainable |
| Gross Margin (SaaS GM) | Gross profit after hosting, support, third-party, PS delivery costs | Funds R&D and GTM; signals scalability; cloud cost blowups are common |

## Value Driver Trees

### EBITDA Tree
```
EBITDA
├── Net Revenue (GAAP Recognized)
│   ├── Subscription Revenue (ratable over term)
│   │   ├── Starting ARR
│   │   ├── + New ARR (new logos)
│   │   ├── + Expansion ARR (upsell/cross-sell/seat/usage)
│   │   ├── - Contraction ARR (downgrades)
│   │   └── - Churned ARR (lost logos)
│   ├── Usage/Consumption Revenue (as consumed)
│   │   └── # customers x usage units x rate
│   ├── Professional Services Revenue
│   │   └── # projects x avg size x completion %
│   └── Gross-to-Net Adjustments
│       ├── Discounts (new logo, renewal, enterprise)
│       ├── Credits/SLA penalties/refunds
│       ├── Reseller netting (gross vs net)
│       └── FX adjustments
├── COGS
│   ├── Hosting/Cloud (AWS/Azure/GCP)
│   ├── Customer Support/Success delivery
│   ├── Third-party software/data/royalties
│   ├── PS delivery costs
│   └── D&A in cost of revenue
└── OpEx
    ├── Sales & Marketing
    │   ├── Sales headcount + comp
    │   ├── Commissions/accelerators
    │   └── Marketing (demand gen, events, paid)
    ├── R&D
    │   ├── Engineering/product headcount
    │   └── Capitalization policy impact
    └── G&A
        ├── Finance, HR, legal, IT
        └── Security/compliance costs
```

**Key Mix Effects:** Customer mix (SMB vs enterprise), Product mix (core vs add-ons), Channel mix (direct vs reseller), Geography mix

### Working Capital Tree
```
Operating Working Capital
├── Trade Receivables (A/R)
│   ├── DSO Drivers
│   │   ├── Customer mix (enterprise slows collections)
│   │   ├── Billing frequency (annual vs monthly)
│   │   └── Billing accuracy (disputes, credits)
│   └── Nuances: usage billed in arrears, multi-entity invoicing
├── Contract Assets/Unbilled Receivables
│   └── From services or over-time recognition ahead of billing
├── Deferred Revenue/Contract Liabilities (often largest)
│   ├── Drivers
│   │   ├── Annual upfront vs monthly billing
│   │   ├── Multi-year terms
│   │   └── Renewal timing/seasonality
│   └── Higher deferred = more cash collected in advance
├── Payables (A/P)
│   ├── Cloud vendor terms (concentrated: AWS/Azure/GCP)
│   └── Contractors/vendors/software tools
└── Other Current Items
    ├── Accrued payroll/bonus/commissions
    ├── Prepaids (annual software, insurance)
    └── Accrued cloud commitments
```

**Cash Conversion:** Often negative due to annual upfront billing + ratable recognition. **Traps:** Commissions paid upfront while revenue recognized over time; large cloud minimums; implementation costs before cash collection.

### Capex Tree
```
Capex
├── Growth Capex
│   ├── Capitalized software development (new modules/features)
│   ├── Data/infra investments (if proprietary)
│   └── Security/compliance investments
├── Maintenance Capex
│   ├── End-user hardware (laptops)
│   ├── Office build-outs
│   └── Internal-use software enhancements
└── Technology/Digital Capex
    ├── CRM/ERP implementations
    ├── Data warehouse/analytics platforms
    └── Security tooling
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|-------------------|
| Retention claims without definitions | "Best-in-class retention" with no NRR/GRR calc | NRR/GRR varies by segment; definitions exclude churned customers | Request metric definitions + cohort files; compute NRR/GRR independently by segment |
| NRR propped by price increases | "Strategic pricing initiatives," "packaging optimization" | Expansion driven by price uplift vs usage/seats; logo churn rises post-renewal | Analyze renewal uplift vs expansion volume; compute NRR excluding price uplift |
| Services masking weak SaaS | Heavy "implementation revenue" emphasis | Subscription growth flat; services volatile; services GM negative | Split revenue: subscription vs usage vs services; assess PS attach and margin |
| Customer concentration / renewal cliff | "Blue-chip customers" but no concentration table | Top 1-5 customers drive material ARR; big renewal dates cluster | Request customer list with ARR + renewal dates; run ARR-at-risk schedule |
| Bookings deterioration hidden by revenue | CIM focuses on "revenue CAGR" | Bookings/RPO down, pipeline weak; deferred revenue shrinking | Compare bookings/RPO trends vs revenue; review pipeline conversion |
| Aggressive rev rec / contract assets spike | "Strong revenue visibility" + large "unbilled revenue" | Contract assets rising; significant manual rev-rec adjustments | Review rev-rec memos, contract asset aging, billing schedules |
| Cloud costs growing faster than revenue | "Investments in platform scalability" | Hosting cost per ARR rising; gross margin declining | Request cloud spend by service + unit metrics; identify top drivers |
| Low sales efficiency / long payback | "Investing in growth" without payback metrics | CAC payback worsening; rep productivity low | Compute CAC and payback by cohort; analyze funnel metrics |
| Reliance on one channel partner | "Strategic partnership ecosystem" | One reseller drives large share; margins compressed | Request partner performance and contract terms; analyze gross-to-net |
| Security/compliance incidents | "Enhanced security" or "recent compliance investments" | Prior breaches, customer contractual penalties | Ask for incident log, SOC reports; understand remediation and insurance |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| ARR bridge/waterfall | Growth decomposition: new, expansion, contraction, churn by segment | Monthly ARR by customer with churn/expansion flags (36 mo) |
| Cohort retention (NRR/GRR) | Whether older cohorts expand/retain; product stickiness | Customer start date, monthly ARR, expansion/churn by customer |
| Logo churn analysis | Customer departure rates and reasons by segment/product | Churn dates, reason codes, renewal outcomes |
| Bookings vs revenue vs billings | Forward momentum and cash reconciliation | Contracts summary, invoicing history, deferred revenue rollforward |
| Customer concentration | Top customer dependency, renewal schedule, ARR at risk | Revenue/ARR by customer, contract terms, renewal dates |
| Pricing & discounting | Price realization: list vs net, renewal uplift, discounting trends | Price list, quote/order data with net price, seats/usage |
| Sales efficiency | GTM spend conversion to ARR; CAC payback, Magic Number, ARR/rep | S&M P&L, headcount by role, rep productivity, pipeline |
| Gross margin drivers | Scalability: hosting cost per ARR, support cost per customer | Cloud spend detail, support costs, COGS breakdown |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Monthly ARR by customer (ID, segment, product, start/end ARR, new/expansion/contraction/churn, renewal date) | 36 months | Excel/CSV | ARR bridge, cohorts, retention, concentration, at-risk renewals |
| Revenue by stream (subscription vs usage vs services vs other, by product) | 36 months monthly | Excel tied to TB | Revenue quality, mix shifts, ARR reconciliation |
| Deferred revenue rollforward + RPO/cRPO schedule | 24-36 months | Excel | Cash/revenue timing, forward demand, rev-rec health |
| Customer master (name, industry, geo, start date, term, billing frequency, payment terms, renewal date, ACV/ARR, products) | Current + history | Excel | Concentration, segmentation, renewal cliff |
| COGS breakdown (hosting, support, third-party, PS delivery) | 24-36 months monthly | Excel with GL mapping | Gross margin sustainability, cloud cost issues |
| Headcount roster + monthly trend (role, department, location, start/term dates) | 24-36 months | Excel + org mapping | Productivity, operating leverage, run-rate costs |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| CRM pipeline export (stage history, close dates, outcomes, ARR/ACV, segment) | 24 months | Export | Pipeline health, conversion rates |
| Pricing & discounting dataset (price list + quotes with list vs net, discount %, term, bundle) | 24 months | Excel | Pricing power, discounting discipline |
| Churn reason codes + support/CS metrics (ticket volume, resolution time, NPS, onboarding duration) | 24 months | Excel | Churn drivers, service quality |
| Cloud spend detail (vendor invoices, usage by service, commitments) | 24 months | Invoices + Excel | Gross margin drivers, commitment exposure |

## Common EBITDA Adjustments
Typical adjustments seen in SaaS M&A transactions. Use this to anticipate QoE issues and compare against VDD/CIM add-backs.

| Adjustment | Typical Treatment | Watch-Outs |
|------------|-------------------|------------|
| Stock-based compensation | Often added back by sellers | Verify if cash-settled RSUs; may need to continue post-close |
| Capitalized software development | Review for aggressive capitalization | Compare policy to peers; long amortization inflates EBITDA |
| Capitalized sales commissions | Amortized over "benefit period" | Long periods inflate EBITDA; impairment risk on churn |
| Founder/owner compensation | Normalize to market rate | Benchmark against industry comp data |
| One-time implementation costs | Add-back if truly non-recurring | ERP, security, compliance projects |
| Deferred revenue haircut | Purchase accounting write-down | Impacts post-close revenue; size the cash impact |
| Customer acquisition costs | Some buyers normalize to steady-state | Aggressive S&M spend may not be sustainable |
| Hosting cost step-ups | Cloud commitments or migrations | AWS/Azure/GCP minimums; data center exits |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Subscription rev rec | Stand-ready ratable recognition over term; consistent treatment | Aggressive upfront recognition or bundling to shift timing |
| Usage-based rev rec | Recognized as usage occurs; estimates and true-ups at period end | Cut-off issues, overstated estimates |
| Professional services | Distinct vs non-distinct determination; allocation of transaction price | Services bundled to accelerate/defer subscription revenue |
| Multi-element arrangements | SSP allocation judgments; renewal modifications | Bundling changes revenue timing; inconsistent treatment |
| Deferred revenue | Rollforward integrity; cancellation/refund policies | Declining deferred may signal slowing bookings |
| Capitalized software | Capitalization thresholds and stage gates; amortization period and classification | Aggressive capitalization inflates EBITDA |
| Capitalized commissions | Amortization period ("benefit period"); treatment of accelerators/renewals | Long amortization periods inflate EBITDA; impairment on churn |

## External Research Topics
- SaaS operating benchmarks: NRR/GRR ranges by segment, CAC payback, S&M % of revenue, Rule of 40, rep productivity
- Public comps: 10-K metrics, investor decks, earnings call commentary on retention, pricing, pipeline
- Competitive landscape: Direct competitors, adjacent suites, platform threats, category map
- Pricing intelligence: List prices vs market bands, bundling norms, packaging trends
- Compliance requirements: SOC 2, ISO 27001, GDPR/CCPA, vertical-specific (HIPAA, PCI, FedRAMP, FINRA)
