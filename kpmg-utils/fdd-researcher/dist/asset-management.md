# Module: Asset Management

## Industry Identification
AUM, AUA, fee-paying AUM, FPAUM, net flows, NNA, blended fee rate, bps, management fees, advisory fees, performance fees, incentive fees, carried interest, carry, high-water mark, hurdle, RIA, Form ADV, GP/LP, dry powder, fundraising, commitments, vintage, IRR, MOIC, TVPI, 2 and 20, prime broker, wealth management, SMA, UMA, TAMP, custodian

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Fee-Paying AUM (FPAUM) | Asset base actually earning fees (excludes waived/zero-fee assets) | Revenue engine: most economics are bps x AUM |
| Net Flows / NNA | Client money in minus out, separated from market impact | Separates commercial momentum from market beta |
| Blended Fee Rate (bps) | Average net fee after breakpoints, rebates, platform rev-share, waivers | Small bps moves = huge dollars; fee compression erodes earnings |
| Management Fee Revenue | Recurring base fees (monthly/quarterly, often in advance for RIAs) | "Quality" revenue stream; underpins FRE/EBITDA |
| Performance Fees / Carry | Variable performance-linked revenue (incentive fees, realized carry) | Lumpy and reversible; drives QoE normalization and clawback risk |
| Fee-Related Earnings (FRE) | Baseline profitability from recurring fees net of operating costs, excluding carry | Isolates steady-state earnings vs cyclic carry |
| Investment Performance vs Benchmark | Net returns vs benchmark/peer quartile with risk metrics | Flows follow performance with lag |
| Client Concentration & Retention | % AUM/revenue from top clients/platforms; lockups, mandates, renewal cycles | Few platforms/allocators can move the needle |

## Value Driver Trees

### Revenue Tree
```
Management / Advisory Fees (recurring)
├── Avg Fee-Paying AUM (FPAUM)
│   ├── Beginning FPAUM
│   ├── + Gross inflows (new mandates, fundraising closes)
│   ├── - Redemptions / drawdowns / mandate losses
│   ├── ± Market & FX performance
│   └── ± M&A (acquired/sold strategies)
├── × Blended fee rate (bps)
│   ├── Product/strategy fee schedule
│   ├── Client tiering / breakpoints
│   ├── Channel/platform revenue share
│   └── Fee waivers / rebates
└── Billing mechanics (advance vs arrears, frequency)

Performance-Based Revenue (volatile)
├── Hedge fund incentive fees (NAV × rate, subject to HWM/hurdle)
├── PE carried interest (realizations × carry %, pref return, clawback)
└── Fee-related performance fees (perpetual vehicles)

Other Revenue
├── Transaction / monitoring fees (often offset against mgmt fees)
└── Fund admin / reporting services
```

### Earnings Tree
```
EBITDA (Management Company)
├── Net Revenue (after waivers, rebates, platform rev-share, fee offsets)
├── - Compensation & Benefits (largest bucket)
│   ├── Investment staff (PMs, analysts, deal team)
│   ├── Distribution / IR / client service
│   ├── Operations / middle & back office
│   └── Variable comp pool (% of revenue/profits)
├── - G&A (compliance, legal, audit, tax, insurance, regulatory fees)
├── - Technology & Data (systems, market data, cybersecurity)
├── - Sales & Marketing (conferences, travel, RFPs)
└── - Occupancy & Other
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|---------------------|
| AUM growth is market-only | "Strong AUM growth despite volatility" | AUM bridge shows negative net flows; AUM up due to markets | Demand AUM bridge + net flows by strategy/channel |
| Fee compression / heavy waivers | "Competitive pricing initiatives" | Declining realized bps; large rebates; rising platform rev-share | Pull fee rate waterfall: gross bps → net bps by product/client |
| Over-reliance on performance fees/carry | "Record earnings" from "strong realizations" | EBITDA heavily tied to carry; large unrealized marks | Separate FRE vs carry; analyze realized vs unrealized |
| Client/platform concentration | "Diversified client base" with no numbers | Top 5 clients/platforms >30-50% of AUM/revenue | Request top clients with terms; review redemption rights |
| Key person / star PM risk | Heavy emphasis on founder/flagship PM | High comp to few individuals; weak non-competes; high turnover | Review employment/comp plans; succession planning |
| Weak performance track record | Benchmark comparisons missing | Persistent underperformance vs benchmark/peer | Request net returns vs benchmark; peer rankings |
| Aggressive incentive fee/carry recognition | "Normalized performance fees" | Large accrued receivables; reversals in later periods | Review accounting policy and subsequent reversals |
| Compliance/regulatory issues | "Investing in compliance infrastructure" | Repeat exam findings; remediation not closed | Review exam letters; test policies; interview CCO |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| AUM bridge (roll-forward) | Beginning → market → inflows/outflows → ending, by strategy | Monthly AUM by strategy/vehicle + flows + market impact (36 mo) |
| Net flows decomposition | Gross inflows vs redemptions by product/client/channel | Gross inflows/redemptions by strategy, vehicle, channel (36 mo) |
| Fee rate / bps analysis | Blended fee trend and drivers (mix, pricing, rebates) | Fee schedules + realized bps by product/client + rebates (12 qtrs) |
| Performance fee / carry quality | Realized vs unrealized; concentration; reversals/clawback | Performance fee/carry detail by fund; waterfall status (12 qtrs) |
| Segment profitability | Which strategies make money after comp, distribution | Revenue and costs by strategy/channel with allocation methodology |
| Compensation ratio + productivity | Revenue/AUM per employee; comp as % of revenue | Org chart; headcount roster; comp detail; bonus policy |
| Client concentration & stickiness | Top clients/platforms; contract terms; redemption rights | Top 25 clients with AUM, revenue, bps, terms |
| Performance / track record | Net returns vs benchmark/peer; consistency and drawdowns | Monthly net returns by strategy/fund vs benchmark (5 yrs) |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| AUM roll-forward by strategy/vehicle/channel (begin, inflows, outflows, market/FX, end) | 36 months | Monthly | Revenue engine; separates flows from market |
| Revenue by type (management fees, performance fees/carry, other) with bridge to GL | 36 months | Monthly/Quarterly | Core revenue model validation |
| Fee schedules by product and client tier; realized net bps by strategy/channel; rebates/waivers | 12 quarters | Quarterly | Fee rate trend and compression analysis |
| Top 25 clients/platforms: AUM, revenue, bps, contract type, lockups/redemption terms | Current | Schedule | Concentration and stickiness risk |
| Net performance by fund/strategy vs benchmark + drawdowns/volatility | 5 years | Monthly | Performance drives flows |
| Employee roster with role, location, comp (base/bonus), allocation to strategy | 24 months | Monthly | Cost structure and key person risk |
| Form ADV, last 3 exam letters/findings, remediation tracker, litigation log | Current | Documents | Compliance risk assessment |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Fund-by-fund terms: waterfalls, carry status, clawback/escrow, fee offsets | Current | Schedule | Carry quality and exposure |
| Fundraising pipeline by product (target, soft/hard circled, timing) | 24 months | Quarterly | Forward growth visibility |
| RIA billing policy + deferred revenue roll-forward | 12 quarters | Quarterly | Working capital and cut-off |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Management fee recognition | Billing convention (quarterly in advance vs arrears); deferred revenue | Cut-off misstatement; timing differences |
| Performance fee / carry | Variable consideration constraints; crystallization timing; HWM; clawback | Aggressive recognition; reversals |
| Gross vs net presentation | Expense reimbursements; pass-through costs | Inconsistent margin presentation |
| Software capitalization | Internal-use systems policy | EBITDA comparability |
| Consolidated funds/VIEs | Manager consolidates funds | Inflated revenue/expense; obscures management company economics |
| Deferred compensation | Retention programs; vesting schedules | Hidden liabilities |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Deal costs | Banker/legal/accounting fees | Add-back (+) |
| One-time regulatory remediation | Special compliance project | Add-back (+) if truly one-time |
| Non-recurring severance | Restructuring charges | Add-back (+) |
| Fee waivers ending | Temporary waivers to seed/win mandates | Increase (+) if ending |
| New AUM full run-rate | Mid-period fundraising close or team lift | Increase (+) |
| Owner comp normalization | Above/below market partner pay | +/- |
| Performance fee recognition | Accrued vs crystallized policy | Decrease (-) if aggressive |

## External Research Topics
- Fee rates / bps by asset class and fee compression trends (McKinsey reports)
- Industry profitability pressure and consolidation signals
- Wealth management benchmarks (Schwab RIA Benchmarking Study)
- SEC / FCA / ESMA regulatory developments
- Public peer filings: AUM by strategy, fee rates, FRE, fundraising commentary
- RIA M&A market activity and valuation trends
- ETF/passive shift and scale economics
- Private wealth channel growth for alternatives

---

**End of Industry Modules**
