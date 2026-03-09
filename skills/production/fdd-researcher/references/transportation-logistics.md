# Module: Transportation & Logistics

## Industry Identification
3PL, third-party logistics, contract logistics, asset-light logistics, freight brokerage, managed transportation, TMS, freight forwarding, NVOCC, customs brokerage, LTL, TL/FTL, truckload, intermodal, drayage, linehaul, pickup & delivery, hub-and-spoke, cross-dock, sortation, last-mile, final-mile, same-day, white glove, reverse logistics, loads, shipments, tenders, lane, headhaul/backhaul, gross profit per load, take rate, net revenue, spread, buy rate, sell rate, revenue per mile, cost per mile, empty miles, deadhead, operating ratio, yield ex-fuel, accessorials, detention, demurrage, fuel surcharge, OTD/OTIF, claims ratio, chargebacks

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Volume (Loads/Shipments/Stops/Miles) | Throughput: loads moved, warehouse orders processed, last-mile stops, miles driven | Separates market cycle vs real share gains; anchors utilization analysis |
| Yield / Price (Rev per load/mile/stop) | What company charges per unit, often tracked ex-fuel surcharge | Core for price/volume/mix decomposition; yield compression signals competitive pressure |
| Gross Profit / Take Rate | GP = customer billings minus purchased transportation; take rate = GP / revenue | In brokerage, GP per load and take rate drive EBITDA, not top-line revenue |
| Contribution Margin (per load/route/order) | GP minus directly attributable variable ops costs | Shows whether growth is profitable before corporate overhead |
| Utilization / Density | Loaded miles vs available; warehouse occupancy; stops/hour | Biggest margin driver: turns fixed costs into absorbed capacity |
| Empty Miles / Deadhead % | % of fleet miles without revenue load | Direct hit to cost-per-mile; indicates weak network density or poor planning |
| Service & Claims (OTD, claims ratio) | Performance vs SLAs plus cost of failures | Creates margin leakage, customer churn; ties to insurance costs |
| Operating Ratio (OR) | Operating costs / revenue (lower is better); OR 85 = ~15% operating margin | Fast way to benchmark asset-based performance |

## Value Driver Trees

### EBITDA Tree
```
EBITDA
├─ Net Revenue / Gross Profit
│  ├─ Transportation Revenue
│  │  ├─ Volume x Yield (loads x rev/load; stops x rev/stop; TEUs x rate)
│  │  ├─ Accessorials (detention, demurrage, lumper, redelivery)
│  │  ├─ Fuel Surcharge (FSC)
│  │  └─ Mix (mode, contract/spot, lane, customer, geography)
│  ├─ Warehousing Revenue
│  │  ├─ Storage: pallet-position-days x rate
│  │  ├─ Handling: inbound + outbound + picks x rate
│  │  └─ Value-added: kitting, labeling, returns
│  └─ Gross-to-Net: concessions, penalties, claims, bad debt
├─ Direct Costs
│  ├─ Purchased Transportation (broker): carrier linehaul, fuel, accessorials
│  ├─ Fleet Ops (asset-based): driver wages, fuel, maintenance, insurance, equipment
│  └─ Warehouse Ops: direct labor, temp/OT, rent/utilities, MHE, packaging
└─ OpEx: sales, G&A, technology, overhead, one-offs
```

### Working Capital Tree
```
Operating Working Capital
├─ Accounts Receivable
│  ├─ Billing cycle speed (POD readiness, EDI accuracy)
│  ├─ Disputes/short pays (accessorial disputes, service failures)
│  └─ Customer terms & credit quality
├─ Accounts Payable
│  ├─ Carrier payment terms (standard vs quick-pay)
│  └─ Concentration / bargaining power
├─ Accruals
│  ├─ Claims reserves (cargo damage, penalties)
│  ├─ Self-insurance accruals (auto, workers comp)
│  └─ Accrued purchased transportation (unbilled carrier invoices)
└─ Inventory (minimal): packaging supplies, spare parts
```

### Capex Tree
```
Capex
├─ Growth Capex
│  ├─ Asset-light: technology + integrations (TMS, pricing, EDI/API)
│  ├─ Warehouse: leasehold improvements, racking, MHE, automation, WMS
│  └─ Fleet/Last-mile: vehicles, depot openings, sortation, handhelds
├─ Maintenance Capex
│  ├─ Fleet: vehicle/trailer replacement, major components
│  └─ Warehouse: MHE refresh, automation maintenance, facility upkeep
└─ Technology (or OpEx if SaaS)
   └─ TMS/WMS, route optimization, portals, telematics, ELDs
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|-------------------|
| Growth driven by freight cycle | "Benefited from favorable rate environment" | Volume flat, yield compression, GP/load down | Build PVM bridge; trend GP per load monthly |
| Revenue vs GP confusion | Heavy emphasis on revenue growth, little on GP | Take rate falling; purchased transportation % rising | Request GP per load, loads per head |
| Customer concentration / mega-contract | "Strategic partnership with leading retailer" | Top customer >20-30% of GP; renewal within 12-18 months | Contract review; profitability by customer; loss scenario |
| Penalty-heavy SLAs | "Industry-leading service" (no KPI disclosure) | Rising chargebacks, credits, disputes backlog | Analyze penalties as % of revenue; root-cause chart |
| Last-mile contractor classification risk | "Flexible independent contractor model" | High 1099 mix; legal reserves; audits | Review IC agreements, insurance compliance, litigation |
| Aging fleet / deferred maintenance | "Fleet modernization initiative underway" | Rising maintenance $/mile; downtime; capex backlog | Fleet age profile; maintenance trends; utilization |
| Working capital squeeze | "Strong cash generation" (little WC detail) | DSO rising + faster carrier pay; increasing factoring | AR/AP aging; quick-pay economics; reconcile to cash |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| Revenue bridge (Price/Volume/Mix) | Whether growth is throughput vs yield vs mix | Monthly revenue by segment with FSC/accessorials separated (36 mo) |
| GP per load / take rate | True unit profitability | Load-level billings and carrier cost (24 mo) |
| Contract vs spot mix | Exposure to freight cycles and repricing risk | Flag by contract type + rate effective dates |
| Customer concentration & profitability | Dependence and hidden loss-leaders | Revenue + GP by customer monthly (36 mo) |
| Lane/route profitability heatmap | Where money is made/lost | O/D, miles, GP, mode, customer |
| Service level analysis | Operational quality and margin leakage | Claims log, penalties, KPI dashboard |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Monthly P&L by segment (TL/LTL/forwarding/warehouse/last-mile) + FSC separated | 36 mo | Monthly detail | Revenue bridge, mix analysis |
| Load/shipment-level dataset (date, customer, mode, O/D, miles, revenue components, carrier cost, margin) | 24 mo | Transaction-level | GP per load, lane profitability |
| Customer profitability (monthly revenue + GP by customer, top 25 accounts, contract type, renewal dates) | 36 mo | Customer detail | Concentration, renewal risk |
| Claims/chargebacks log (customer, amount, cause, resolution) | 36 mo | Log/detail | Service quality, leakage |
| AR aging by customer + AP aging by carrier + billing lag metrics | 24 mo | Aging buckets | Working capital, liquidity |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Top customer contracts/MSAs, rate cards, SLAs, penalty schedules, indexation | Current | Contracts | Pricing power, renewal risk |
| Carrier contracts, preferred carrier terms, quick-pay program terms/usage | Current | Contracts + usage | Procurement economics |
| Safety/compliance (DOT/FMCSA data, accident history, insurance loss runs) | 36 mo | Compliance docs | Regulatory risk, insurance |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Revenue recognition timing | Delivery vs in-transit accrual; cutoff around period-end | EBITDA timing manipulation |
| Principal vs agent (gross vs net) | Control assessment under IFRS 15/ASC 606 | Comparability; inflated revenue |
| Purchased transportation accruals | Carrier invoice lag; accrual completeness | Understated COGS |
| Self-insurance / claims reserves | Auto liability, cargo, workers comp estimates | Reserve adequacy |
| Lease accounting (ASC 842/IFRS 16) | Fleet + facility leases | EBITDA/EBIT comparability |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Restructuring / footprint reductions | Facility exits, severance | Add-back (+) if truly one-time |
| One-time litigation / settlements | Non-recurring claims | Add-back (+) case-by-case |
| New contract ramp | Contracts started mid-period | Pro forma increase (+) |
| Wage/insurance step-ups | Known renewals, premium increases | Pro forma decrease (-) |
| Gross vs net (principal/agent) | Presentation of same economics | Recast for comparability |

## External Research Topics
- Freight market cycle indicators: spot vs contract rate indices, tender rejections, capacity utilization
- Public comp benchmarks: GXO, CH Robinson, XPO OR disclosures
- FMCSA Hours-of-Service constraints, CSA/Safety Measurement System
- Worker classification developments (AB5/Prop 22 dynamics for last-mile/gig)
- E-commerce demand shifts, nearshoring trends, intermodal dynamics
- Automation/robotics in fulfillment, AI for pricing/dispatch

