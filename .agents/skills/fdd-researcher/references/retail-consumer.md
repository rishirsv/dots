# Module: Retail / Consumer

## Industry Identification
store base, locations, units, doors, four-wall, same-store sales, SSS, comps, like-for-like, LFL, store contribution, unit economics, payback period, sell-through, markdowns, inventory turns, weeks of supply, WOS, GMROI, shrink, AOV, average ticket, basket, conversion rate, traffic, transactions, UPT, omni-channel, e-commerce, BOPIS, DTC, wholesale, food cost, prime cost, daypart, table turns, throughput, gross-to-net, trade spend, deductions, chargebacks, slotting fees

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Same-Store Sales (SSS) / Comps | Growth from comparable store set, excluding openings/closures | Separates organic performance from new unit growth |
| Transactions / Traffic | Count of purchases or customer visits | Decomposes growth into volume vs price/mix |
| Average Order Value (AOV) | Sales / transactions | Key comp lever; need to know what's sustainable |
| Conversion Rate | % visitors who buy (traffic to transactions) | Explains why comps moved |
| Gross Margin | Gross profit after product/ingredient cost | Biggest EBITDA driver; sensitive to promo/markdowns, mix, shrink |
| Inventory Turns / WOS | COGS / avg inventory; weeks of inventory on hand | Core WC + margin driver; low turns = overbuying, obsolescence |
| Four-Wall EBITDA | Store profit after direct costs, before corporate | Shows if growth is value-accretive |
| Shrink / Returns Rate | Inventory loss (theft/error/damage); % sales returned | Silently destroys margins |

## Value Driver Trees

### EBITDA Tree
```
EBITDA
├── Net Revenue
│   ├── Stores: # Stores × Sales/Store
│   │   ├── Transactions × AOV
│   │   │   ├── Price (menu/shelf)
│   │   │   ├── Mix (category/SKU/daypart)
│   │   │   └── Units per Transaction / Attach
│   │   └── Conversion × Stock availability × Hours
│   ├── E-commerce: Sessions × Conversion × AOV × Repeat
│   ├── Wholesale: Units × Net Price; Doors × Velocity
│   └── Gross-to-Net: Discounts, Markdowns, Returns, Trade spend, Loyalty
├── COGS
│   ├── Product/ingredient cost
│   ├── Freight (inbound/outbound)
│   ├── Shrink/Spoilage/Waste
│   └── Obsolescence write-downs
└── OpEx
    ├── Store Labor: Hours × Wage × Turnover
    ├── Occupancy: Base rent + CAM + % rent + Utilities
    ├── Store OpEx: R&M, Supplies, Merchant fees, Delivery commissions
    ├── Fulfillment: DC labor, Pick/pack/ship, Returns processing
    ├── Marketing: Brand, Performance (CAC/ROAS), Promos
    └── G&A: HQ headcount, Professional fees, Tech/SaaS
```

### Working Capital Tree
```
Operating Working Capital
├── A/R (DSO)
│   ├── Channel mix (DTC short; wholesale longer)
│   ├── Payment terms, Deductions/chargebacks
│   └── Credit card settlement, Marketplace payouts
├── Inventory (DIO)
│   ├── DC + Store inventory
│   ├── Forecast accuracy, Lead times, MOQ, Safety stock
│   ├── Seasonality builds (holiday, back-to-school)
│   └── Risks: Obsolescence, Shrink reserves, Accuracy
├── A/P (DPO)
│   ├── Vendor terms, Concentration/leverage
│   └── Watch: Stretched payables, Early-pay discounts forfeited
└── Other WC (Gift card liability, Loyalty liability, Returns reserve)
```

### Capex Tree
```
Capex
├── Growth
│   ├── New stores: Leasehold, Buildout, FF&E, Signage, POS
│   ├── New DC: Fit-out, Automation, Racking
│   └── Ramp: 6-18 months to stabilize; need cohort curves
├── Maintenance (1-3% of revenue)
│   ├── Remodels/Refreshes (every 3-7 years)
│   └── Equipment replacement
└── Technology (POS, ERP, OMS/WMS, E-commerce platform)
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|---------------------|
| Comps look fine but traffic down | Emphasis on "pricing initiatives" | Transactions declining; AOV rising | SSS bridge: traffic vs AOV; promo depth |
| Growth from new units, not core | Big opening story; limited comps disclosure | Flat/negative comp set; mature stores declining | Growth decomposition: new vs comp; maturity curves |
| Promo/markdown dependency | "Strong promotional cadence" | Rising discounts; markdown % up; margin compression | Promo ROI; markdown aging; gross margin bridge |
| Inventory risk / obsolescence | "Inventory optimization opportunity" | High WOS; aging inventory; big write-downs | Aging, sell-through, SKU rationalization |
| Shrink understated | "Operational excellence" claims | Large late-period adjustments; weak cycle counts | Shrink trend by store; audit reports |
| E-comm growth but poor unit economics | "Digital transformation" | High returns; high shipping subsidies; negative contribution | Contribution by channel/order; returns reasons |
| Wholesale deductions escalating | "Strong retailer partnerships" | Rising chargebacks; long dispute cycle | Gross-to-net bridge; deductions log |
| Hidden lease pressure | "Attractive locations" | Leases near renewal; rent escalators; high rent-to-sales | Lease schedule; rent-to-sales by store |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| Comps trend + bridge | Organic growth; traffic vs AOV decomposition | Weekly store sales/transactions/AOV (104 weeks) |
| Store cohort / maturity | New unit ramp to mature sales and margin | Store master with open/close dates + monthly store P&L |
| Store profitability distribution | Which stores make money; closure candidates | Four-wall P&L by store (36 mo) |
| Price/promo/markdown | Whether sales are "bought"; margin impact | Promo calendar + discount/markdown by SKU/store |
| Inventory health | Cash tied up; markdown risk; in-stock issues | On-hand by SKU-location, aging (24 mo) |
| Channel profitability | True contribution after fulfillment/returns/trade | Channel P&L with fulfillment, shipping fees (36 mo) |
| Gross-to-net (CPG) | How much revenue given back and why | GTN bridge by customer/month; trade spend |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Monthly consolidated financials (revenue by channel, COGS, labor, occupancy, marketing, G&A) | 36 months | Excel | Trend and margin bridge |
| Store/location master (open/close date, format, sqft, geography) | Current | Excel | Comp set, cohort analysis |
| Store-level sales + transactions + AOV | Weekly, 2 years | Excel | Comps and traffic/AOV decomposition |
| Store-level four-wall P&L | Monthly, 36 mo | Excel | Unit profitability |
| SKU/category sales + units + cost/margin | Monthly, 24 mo | Excel | Mix/margin drivers |
| Inventory snapshots (on-hand, receipts, transfers, adjustments) | Monthly, 24 mo | Excel | Turns, aging, obsolescence |
| Lease schedule (rent, CAM/NNN, escalators, options, expiries) | Current | Excel | Occupancy burden |
| Labor dataset (weekly hours/dollars by store) | Weekly, 2 years | Excel | Productivity, wage sensitivity |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Promo/markdown calendar (depth, duration, funding) | 24 months | Excel | Promo ROI; margin impact |
| Returns dataset (order-level, reason codes, refund timing) | 24 months | Excel | Returns economics |
| Shrink reports + audit/cycle count results | 24 months | Excel | Control environment |
| Vendor list (spend, terms, rebates) | Current | Excel | Procurement opportunity |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Returns reserves | DTC reserve adequacy; return shipping costs | Under-accrual overstates margin |
| Gift card breakage | Breakage rate assumptions vs actual | Aggressive breakage inflates revenue |
| Loyalty deferral | Points allocation and breakage estimates | Under-deferral overstates current revenue |
| Gross vs net | Marketplaces, delivery platforms, drop-ship | Wrong treatment inflates revenue |
| Wholesale deductions | Accrual timing for chargebacks/deductions | Delayed accruals overstate net revenue |
| Inventory valuation | LIFO/FIFO; lower-of-cost-or-NRV; obsolescence reserves | LIFO distorts comparability |
| Shrink recognition | Systematic vs big true-ups | Large adjustments = weak controls |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Owner comp & perks | Excess comp, personal expenses | Add-back (+) |
| Related-party rent | Below/above market to owner entity | +/- to market |
| Pre-opening costs | Store opening costs during growth | Add-back (+) if heavy growth |
| New stores mid-period | Annualize mature contribution | Increase (+) |
| Store closures | Remove lost contribution | Decrease (-) |
| Pricing actions mid-period | Annualize impact (validate elasticity) | Increase (+) |
| Wage/rent step-ups | Annualize known imminent increases | Decrease (-) |
| LIFO reserve | Normalize to FIFO for comparability | Varies |

## External Research Topics
- Public company filings for gross margin, comps, shrink, labor, occupancy benchmarks
- Category growth rates and consumer behavior trends
- Wage growth, CPI components, commodity indices for margin context
- Minimum wage changes, scheduling laws by jurisdiction
- Competitor store counts, pricing, promo cadence
- Delivery aggregator economics and commission trends

