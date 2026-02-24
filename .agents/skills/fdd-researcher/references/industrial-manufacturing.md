# Module: Industrial Manufacturing

## Industry Identification
design and manufacture, precision manufacturing, fabrication, machining, CNC, metal stamping, casting, forging, extrusion, injection molding, assembly, contract manufacturing, CM, EMS, build-to-print, engineered-to-order, ETO, MTO, CTO, aftermarket, spares, MRO, tooling, dies, molds, NRE, BOM, routing, work order, WIP, finished goods, lead time, cycle time, takt time, OEE, utilization, throughput, bottleneck, lean, Kaizen, Six Sigma, OEM, Tier 1 supplier, blanket PO, bookings, backlog, book-to-bill, standard cost, PPV, overhead absorption, scrap, yield, FPY, ISO 9001, IATF 16949, AS9100, ITAR

## KPIs That Matter
| KPI | Definition | Why It Matters |
|-----|------------|----------------|
| Units Shipped / Production Volume | Physical output delivered (units, tons, lbs, machine-hours) | Separates real demand from price effects; anchors capacity/utilization |
| ASP / Price Realization | Actual price per unit after discounts/surcharges | Shows pricing power; flags reliance on temporary surcharges |
| Gross Margin % and $ | Gross profit after manufacturing costs | Core indicator of mix, cost control, absorption |
| OEE / Utilization | Equipment effectiveness vs theoretical capacity | Explains margin swings via fixed cost absorption; identifies bottlenecks |
| Yield / Scrap / FPY | % of production meeting spec without rework | Direct driver of conversion cost and customer quality risk |
| OTD / OTIF / Fill Rate | Shipments arriving on time and in full vs schedule | Predicts customer retention, chargebacks, expedited freight |
| Bookings / Backlog / Book-to-Bill | Orders received and unshipped committed demand | Validates forward revenue and capacity |
| Inventory Turns / DIO | How fast inventory converts to sales | Critical for cash and obsolescence risk |

## Value Driver Trees

### EBITDA Tree
```
EBITDA
├── Net Revenue
│   ├── Gross Revenue
│   │   ├── Product Shipments (Volume x Price)
│   │   │   ├── Volume: end-market demand, capacity, OTIF, scrap drag
│   │   │   └── Price: list price, escalators, surcharges, discounting
│   │   ├── Aftermarket/Spares (installed base x attach rate x ASP)
│   │   ├── Services/Field Labor (billable hours x realization)
│   │   └── Tooling/NRE (# programs x tooling price)
│   └── Gross-to-Net (rebates, returns, chargebacks, warranty credits)
├── COGS
│   ├── Direct Materials (BOM cost, PPV, yield losses, tariffs)
│   ├── Direct Labor (hours/unit x wage rate + overtime + learning curve)
│   ├── Variable OH (consumables, utilities, maintenance, expedite costs)
│   ├── Fixed OH (plant salaries, facilities, depreciation, absorption variance)
│   └── Quality Costs (scrap, rework, warranty accrual, penalties)
└── OpEx
    ├── Sales & Marketing
    ├── G&A (corporate HC, professional fees, allocations)
    ├── R&D/Engineering (NPI, sustaining, ECOs)
    └── Logistics/Warehousing (if not in COGS)
```

### Working Capital Tree
```
Operating Working Capital
├── Accounts Receivable (Revenue x DSO)
│   ├── Terms (Net 30/45/60/90), billing accuracy, quality disputes
│   ├── Progress billing/milestones (ETO), consignment triggers
│   └── Customer mix (OEM vs distributor vs international)
├── Inventory
│   ├── Raw Materials (lead times, MOQs, commodity buys, dual sourcing)
│   ├── WIP (cycle time, bottlenecks, rework loops, ECO trapped WIP)
│   ├── Finished Goods (forecast accuracy, safety stock, SKU proliferation)
│   └── Obsolescence/Excess (slow movers, discontinued, reserve adequacy)
├── Accounts Payable (Purchases x DPO)
│   └── Supplier terms, concentration, early-pay discounts
└── Other WC (Accrued rebates, warranty accrual, customer deposits)
```

### Capex Tree
```
Capex
├── Growth Capex
│   ├── New lines/cells, capacity expansion, automation
│   ├── New plant/footprint (12-24 months to steady-state)
│   ├── Program/tooling capex (dies, molds, fixtures, test equipment)
│   └── QA/metrology for new certifications
├── Maintenance Capex (~2-5% of revenue)
│   ├── Equipment replacement/refurbishment/overhauls
│   └── Facilities (roof, HVAC), safety upgrades
└── Technology/Digital Capex (ERP, MES, shop-floor data capture)
```

## Red Flags
| Red Flag | CIM Signal | Data Room Signal | How to Investigate |
|----------|------------|------------------|-------------------|
| Customer/program concentration masked | "Diversified customer base" with no table | Top 1-3 customers >30-50% revenue | Request revenue/GM by customer + program; review contracts |
| Growth driven by surcharges | "Pricing initiatives" and "surcharge recovery" | ASP up, units flat/down; margin not improving | Run PVM separating base price vs surcharges |
| Backlog not realizable | "Record backlog" and "strong visibility" | High backlog aging; frequent push-outs; non-binding POs | Backlog detail with order dates, cancellation terms |
| Absorption-driven margin volatility | "Operational improvements" without detail | GM swings with volume; large OH absorption variances | Plant P&Ls + utilization; quantify fixed OH and breakeven |
| Inventory build with weak reserves | "Strategic inventory positioning" | Rising DIO; high aging; declining reserve % | Inventory aging by SKU; reserve policy |
| Quality/warranty underplayed | "Best-in-class quality" with no metrics | Spike in scrap, RMAs, warranty changes | Customer scorecards; warranty rollforward; 8D corrective actions |
| Single-source supplier dependency | "Strong supplier relationships" | One critical supplier; repeated expedite fees | Top suppliers + lead times; dual-source status |
| ERP/data integrity risk | "ERP upgrade underway" | Inconsistent reports, recon breaks | Ask for close process, reconciliations |

## Standard Analyses
| Analysis | What It Shows | Data Required |
|----------|---------------|---------------|
| Revenue Bridge (YoY/QoQ) | True growth drivers: volume vs price vs mix | Monthly revenue and units by customer x product family (36 mo) |
| Price-Volume-Mix (PVM) | Pricing power and mix effects | Monthly ASP, units, product/customer breakdown |
| Backlog/Bookings Conversion | Forward visibility and cancellation risk | Monthly bookings/shipments/backlog; backlog aging |
| Gross Margin Bridge | Why margins move: material, labor, OH, mix | Monthly COGS components and variance detail |
| Customer Concentration | Demand risk and bargaining power | Top 25 customers revenue/GM; contract terms |
| Plant/Site Profitability | Footprint efficiency; restructuring cases | Plant-level P&L, volume, headcount, scrap |
| Capacity/Utilization | Growth feasibility; capex needs | Capacity by work center; OEE; downtime; overtime |
| Quality/Warranty Analysis | Hidden cost and customer risk | Scrap, rework, RMA, warranty claims |

## Data Requests

### P1 (Critical)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| Monthly revenue + units + GM bridge by customer x product family | 36 months | Excel | Enables PVM, concentration, margin baseline |
| Bookings/backlog pack: monthly bookings/shipments/backlog + current backlog detail | 36 months | Excel | Validates forward view and backlog quality |
| Top 25 customers: revenue, GM$, GM%, units, terms, rebates + contract summaries | 36 months | Excel + contracts | Economic dependence and pricing risk |
| COGS breakdown (materials, labor, OH, freight, warranty) + manufacturing variances by plant | 24-36 months | Excel | Explains margin; tests costing reliability |
| AR aging + terms, inventory listing with aging/reserves, AP aging + top suppliers | 24-36 months | Excel | Cash and WC normalization |
| Warranty rollforward + RMA trend + scrap/rework costs | 24-36 months | Excel | Hidden cost and customer risk |

### P2 (Important)
| Request | Period | Format | Why |
|---------|--------|--------|-----|
| SKU-level sales and standard cost | 12-24 months | Excel | Complexity cost and mix analysis |
| Capacity/OEE by constraint work center; downtime logs | 12-24 months | Excel | Growth feasibility; capex planning |
| Capex by project/category + fixed asset register + maintenance logs | 3 years + YTD | Excel | Asset health and sustainability |

## Accounting Watch-Outs
| Area | What to Check | Risk |
|------|---------------|------|
| Revenue recognition timing | FOB shipping point vs destination; customer acceptance; bill-and-hold | Revenue before control transfers |
| Over-time recognition (ETO) | Cost-to-cost method; change orders; estimates on cost-to-complete | Optimistic % completion estimates |
| Variable consideration | Volume rebates, chargebacks, returns, surcharge timing lags | Understated gross-to-net |
| Inventory capitalization | Absorption of idle capacity; abnormal scrap/inefficiency | Costs deferred in inventory |
| Standard cost staleness | Frequency of standard updates; variance treatment | Fictional SKU margins |
| Tooling/NRE accounting | Upfront vs deferred recognition over program life | Inflated short-term EBITDA |

## Common EBITDA Adjustments
| Category | What to Look For | Direction |
|----------|------------------|-----------|
| Related-party rent/mgmt fees | Above-market rent to owner entity | Add-back (+) |
| One-time legal/settlement | Litigation, unusual claims | Add-back (+) |
| Restructuring/severance | Plant reorg, one-time severance | Add-back (+) |
| Abnormal scrap/quality event | Recall, extraordinary spike | Add-back (+) if isolated |
| Program annualization | Mid-year launch—capture full-year if volume firm | Pro forma (+) |
| Pricing action run-rate | Price increases effective mid-period | Pro forma (+) |
| Cost savings run-rate | Implemented lean/automation (must be evidenced) | Pro forma (+) |
| LIFO vs FIFO | Inventory and COGS differences | GAAP adj |

## External Research Topics
- Public company comps: segment margins, organic growth, capex intensity, WC days
- End-market production indicators: construction, auto build rates, aerospace deliveries, PMI
- Commodity indices for target's BOM: metals, resins, electronics components
- Certification requirements by end market (auto/aero/medical/defense)
- Safety/environmental regulatory environment
- Labor market and wage inflation for key geographies
- Customer industry outlooks: OEM guidance, inventory destocking/restocking cycles

