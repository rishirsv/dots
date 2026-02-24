# Module: Insurance

## Industry Identification
underwriting, bind, policy issuance, written premium, earned premium, unearned premium reserve, claims, losses, loss adjustment expenses, LAE, case reserves, IBNR, loss reserves, reserve development, combined ratio, loss ratio, expense ratio, ceded, retained, quota share, excess of loss, treaty, reinsurance recoverables, statutory, NAIC, RBC, solvency, AM Best rating, commission income, contingent commission, brokerage revenue, MGA, TPA, book of business, accident year, calendar year, prior-year development

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Gross/Net Written Premium (GWP/NWP) | Premium bound before/after reinsurance | Growth quality: rate vs new risk vs mix; shows reinsurance dependence |
| Net Earned Premium (NEP) | Premium recognized as coverage provided (written - change in UPR) | Underwriting P&L driven off earned; written/earned mismatches mask trends |
| Loss Ratio (LR) | Incurred losses + LAE / earned premium | Single biggest driver of underwriting profitability |
| Combined Ratio (CR) | Loss ratio + expense ratio; <100% = underwriting profit | North star for P&C; decomposes into pricing vs claims vs expense drivers |
| Reserve Development (PYD) | Re-estimation of prior AY reserves: favorable (releases) vs adverse | Repeated favorable PYD inflates earnings; adverse PYD = top deal risk |
| Retention/Renewal Rate | % of policies/premium renewing | Franchise strength; acquisition cost payback |
| Capital Adequacy (RBC) | Total Adjusted Capital / ACL RBC | Ability to write business, pay dividends, withstand shocks |

## Value Driver Trees

### Carrier Earnings Tree
```
Operating Profit (EBITDA Proxy)
├── Underwriting Result
│   ├── Net Earned Premium (NEP)
│   │   ├── GWP (# Policies × Avg Premium; Exposure Units × Rate; LOB/Geo/Class mix)
│   │   ├── Reinsurance Impact (Ceded premium, Ceding commissions)
│   │   └── Earned vs Written Timing (Change in UPR)
│   ├── Losses & LAE (Incurred)
│   │   ├── Current AY losses (Frequency × Severity × Exposure)
│   │   ├── Cat losses (event-driven)
│   │   ├── Large losses (tail/social inflation)
│   │   ├── Prior-year development (+/-)
│   │   └── Reinsurance recoveries
│   └── Underwriting Expenses
│       ├── Acquisition (commissions, premium taxes, MGA fees)
│       ├── Underwriting ops (staff, admin, inspections)
│       └── Claims handling (if not in LAE)
├── Net Investment Income
│   ├── Float balance × Portfolio yield
│   └── Credit losses/impairments
└── Other income (policy fees, service fees)
```

### Reserve Tree
```
Loss & LAE Reserves
├── Case Reserves (reported claims, adjuster estimates)
├── IBNR (Incurred But Not Reported)
│   ├── Development factors by LOB/AY
│   ├── Actuarial methods (chain ladder, B-F, etc.)
│   └── Management judgment overlay
├── LAE Reserves (allocated + unallocated)
└── Development Patterns
    ├── Short-tail (property, auto PD): 12-24 months
    └── Long-tail (liability, WC, med mal): 5-15+ years
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|-------------------|
| Adverse reserve development masked | "Favorable development," "conservative reserving" | Triangles show worsening; reserve strengthening post-close | AY vs CY exhibits; actuarial reports; claim audits |
| Growth spike in softening market | "Significant market opportunity," "rapid growth" | Rate change below loss trend; mix shift to risky classes | Bridge growth to rate/exposure/mix; compare pricing to loss trend |
| CR improvement from reserve releases | "Improved profitability," "disciplined underwriting" | AY CR flat/worse; CY better due to PYD | Decompose CR into AY attritional/cat/PYD |
| Cat exposure underappreciated | "Limited cat exposure" | High concentration in cat zones; low reinsurance attachment | Exposure data, PML, reinsurance terms, event retentions |
| Reinsurance counterparty risk | "Strategic reinsurance partners" | Large recoverables with slow collections/disputes | Aging of recoverables; collateral; reinsurer ratings; disputes |
| Social inflation exposure | "Litigation environment" footnote | Severity spikes; prolonged open claims; rising LAE | Frequency/severity analysis; litigation rate; panel counsel |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| Combined ratio decomposition | Profitability drivers: pricing vs claims vs expenses | NEP, incurred losses+LAE, UW expenses by LOB/state/channel (60 months) |
| Accident year vs calendar year | Underlying UW quality vs reserve noise | AY triangles, CY financials |
| Reserve adequacy | Whether reserves adequate/biased | Reserve rollforward, actuarial reports, 10 AY triangles by LOB |
| Rate vs exposure vs mix | Whether growth is priced and sustainable | Exposure units, rate change metrics, premium by segment (36 months) |
| Frequency/severity trends | Claims inflation, litigation, leakage | Claims summary by month/LOB: counts, paid, incurred, large loss listing |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Segment underwriting pack (CR/LR/ER by LOB × state × channel) | 12-20 quarters | Management reporting | Core profitability analysis |
| Loss development triangles (paid + incurred) by AY | 10 AYs by major LOB | Actuarial format | Reserve adequacy assessment |
| Reserve rollforward (case/IBNR/LAE) + actuarial indication | 12 quarters | Quarterly by LOB | Reserve trend and management vs actuary |
| Large loss listing (>$250k) with cause, status, paid/incurred | 5 years | Schedule | Tail risk and normalization |
| Reinsurance summary: treaties, retentions, limits, ceding commissions | Current + 3 years history | Summary + contracts | Net risk profile |
| Statutory filings + RBC ratio + dividend capacity | 3 years | NAIC format | Capital adequacy |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Claims operational KPIs (cycle time, leakage audits, litigation rate) | 24 months | Monthly | Claims management effectiveness |
| Underwriting guidelines changes and authority matrices | 3 years | Policy docs | Risk appetite changes |
| Cat model reports (PML/TVaR) | Current | Model output | Tail risk quantification |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Premium recognition | Earned over coverage period; UPR mechanics | Written ≠ earned; growth overstates near-term revenue |
| Deferred acquisition costs (DAC) | Amortization policy, aggressiveness | Capitalization inflates earnings |
| Loss & LAE reserves (IBNR) | Methods, assumptions, management picks vs actuary | Biggest balance sheet estimate |
| Reinsurance recoverables | Allowance for doubtful recovery; counterparty quality | Collectability risk |
| Statutory vs GAAP | Different bases, metrics, LAE classification | Comparability across entities |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Cat/large loss normalization | Unusual events vs expected cat load | Varies (normalize to expected) |
| Reserve strengthening | One-time increases booked as "one-off" | Add-back only if truly non-recurring |
| Transaction/M&A costs | Banker, legal, TSA, integration | Add-back (+) |
| Investment gains/losses | Realized gains, impairments | Remove from operating |
| Rate increases mid-year | Approved actions not fully earned | Increase (+) for run-rate |

## External Research Topics
- NAIC (RBC framework, statutory concepts), state DOI filings, solvency requirements
- AM Best, S&P, Moody's, Fitch industry outlooks
- Swiss Re sigma, Munich Re publications, Aon/Guy Carpenter market updates
- Social inflation/litigation, climate/secondary perils, cyber loss evolution
- Reinsurance pricing/availability, telematics/AI underwriting

## Competitive Landscape (Insurance Distribution)

For any brokerage/agency/MGA deal, research and include these competitors:

### North American Consolidators (Always Research)
| Consolidator | Approximate Scale | Focus | Notes |
|--------------|-------------------|-------|-------|
| Marsh McLennan | $23B+ revenue | Global broker, risk advisory | Public (MMC); owns Mercer, Oliver Wyman |
| Aon | $15B+ revenue | Global broker, reinsurance | Public (AON); merged with Willis 2021 (blocked) |
| Arthur J. Gallagher | $10B+ revenue | Middle-market focus, aggressive M&A | Public (AJG); 50+ deals/year |
| Brown & Brown | $4B+ revenue | Retail + wholesale + programs | Public (BRO); decentralized model |
| Hub International | $4B+ revenue | Middle-market, PE-backed | Hellman & Friedman; 100+ deals/year |
| Acrisure | $4B+ revenue | Tech-enabled, aggressive M&A | PE consortium; controversial growth model |
| NFP | $2B+ revenue | Benefits + P&C | Aon acquired 2024 |
| AssuredPartners | $2.5B+ revenue | Middle-market | GTCR-backed |
| Alera Group | $1B+ revenue | Benefits-focused | Genstar-backed |

### Canada-Specific (For Canadian Deals)
| Consolidator | Scale | Focus |
|--------------|-------|-------|
| Navacord | $600M+ revenue | Canada's largest independent |
| BFL Canada | $400M+ revenue | Quebec-based, commercial focus |
| Jones DesLauriers | $200M+ revenue | Ontario-focused |
| Westland Insurance | $500M+ revenue | Western Canada |

### M&A Market Context (Insurance Distribution)

**Deal Activity:**
- Insurance brokerage consistently ranks as top M&A sector by deal count (500-700+ deals/year in North America)
- Search: "[year] insurance brokerage M&A" / "insurance broker deal volume MarshBerry"
- Key sources: MarshBerry, OPTIS Partners, S&P Global Market Intelligence

**Valuation Benchmarks:**
- Typical range: 8-15x EBITDA depending on size, growth, specialization
- Premium drivers: organic growth >10%, high retention (>90%), specialty lines, geographic density
- Discount factors: producer concentration, carrier concentration, earn-out heavy history
- Search: "insurance broker valuation multiples [year]"

**Deal Structure Norms:**
- Earnout structures: 2-3 years, typically tied to retention and organic growth
- Rollover equity: 25-40% common in PE deals
- Key-man provisions: Standard for producer-dependent books
- Non-competes: 3-5 years standard

