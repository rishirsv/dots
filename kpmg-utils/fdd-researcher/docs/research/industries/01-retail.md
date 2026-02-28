## Part 1: Industry Identification

### Question 1: What words/phrases/concepts signal Retail (Food & Beverage, Consumer Goods, Multi-unit Retail)?

Think of this industry as three overlapping archetypes you’ll see in CIMs/VDDs:

1. **Multi-unit retail operator** (specialty retail, convenience, service retail)
2. **Food & Beverage operator** (restaurants/QSR/fast casual/coffee, sometimes retail + food)
3. **Consumer goods / CPG brand** (wholesale + DTC + marketplaces, sometimes owned manufacturing)

Below are the highest-signal “tells” that you’re in this module.

#### A. Multi-unit retail / store-based signals

* **Unit footprint language:** “store base,” “locations,” “units,” “doors,” “four-wall,” “in-store,” “retail footprint,” “store cohorts,” “maturity,” “ramp,” “store contribution”
* **Comp / same-store language:** “same-store sales (SSS),” “comps,” “like-for-like (LFL),” “comp store base,” “comparable store set,” “comp traffic”
* **Store economics language:** “store-level EBITDA,” “four-wall EBITDA,” “store contribution margin,” “unit economics,” “payback period,” “ROI,” “cash-on-cash returns”
* **Merchandising & inventory language:** “sell-through,” “in-season,” “markdowns,” “promo cadence,” “inventory turns,” “weeks of supply (WOS),” “open-to-buy,” “GMROI,” “shrink,” “cycle counts,” “stock-outs,” “planogram,” “assortment,” “category management”
* **Consumer transaction language:** “basket,” “AOV,” “average ticket,” “conversion rate,” “traffic,” “transactions,” “units per transaction (UPT),” “attach rate”
* **Channel language:** “omni-channel,” “e-commerce penetration,” “BOPIS,” “ship-from-store,” “marketplace,” “DTC,” “wholesale,” “stores + online mix,” “fulfillment costs,” “returns rate”

#### B. Food & Beverage (restaurant / multi-unit) signals

* **Restaurant KPIs:** “same-store sales,” “transactions,” “average check,” “menu mix,” “daypart,” “table turns,” “throughput,” “drive-thru times,” “delivery mix”
* **Cost structure terms:** “food cost,” “beverage cost,” “prime cost,” “labor as % of sales,” “waste/spoilage,” “comp labor,” “occupancy costs,” “franchise royalties/fees”
* **Operational language:** “store ops,” “back-of-house/front-of-house,” “restaurant-level margin,” “store-level P&L,” “labor scheduling,” “turnover,” “manager staffing model”
* **Channel dependence:** “third-party delivery,” “aggregators,” “digital ordering,” “commissions,” “delivery fees”

#### C. Consumer goods / CPG brand signals

* **Gross-to-net / trade spend vocabulary:** “gross-to-net,” “trade spend,” “promotional allowances,” “bill-backs,” “off-invoice,” “deductions,” “chargebacks,” “co-op marketing,” “slotting fees,” “rebates,” “returns allowances”
* **Distribution / velocity vocabulary:** “doors,” “ACV,” “TDP,” “distribution gains,” “velocities,” “SPINS/IRI/Nielsen scan data,” “sell-in vs sell-through”
* **Customer mix terms:** “key accounts,” “big box,” “grocery,” “club,” “mass,” “distributor,” “broker network,” “customer concentration”
* **Manufacturing/supply terms (if applicable):** “co-man,” “copacker,” “MOQ,” “lead times,” “raw material inflation,” “freight,” “fill rates,” “on-time/in-full (OTIF)”

---

## Part 2: Units That Matter

### Question 2: 5–8 KPIs a generalist must understand

Below are **8** that cover most retail/F&B/CPG diligence situations. (In practice you’ll weight them by subsegment.)

| KPI                                                                  | Definition (practitioner-style)                                                                                                                             | Why it matters in diligence                                                                                                                       |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Same-Store Sales (SSS) / Comps / Like-for-Like (LFL)**             | Growth in sales from the “comparable” store set (stores open long enough to be comparable), excluding openings/closures                                     | Separates **true organic performance** from growth driven by new units; comp definition games are common (resets, exclusions, short comp windows) |
| **Transactions / Traffic**                                           | Count of purchases (transactions) and/or customer visits; sometimes proxied by footfall or tickets                                                          | Lets you decompose growth into **volume vs price/mix**; declining traffic with rising sales often means pricing/promo masking demand softness     |
| **Average Order Value (AOV) / Average Ticket / Average Check**       | Average dollars per transaction (sales ÷ transactions)                                                                                                      | Key lever for comp growth; can be driven by **pricing, mix, add-ons/attach, inflation**—you need to know what’s sustainable                       |
| **Conversion Rate**                                                  | % of visitors who buy (in-store: traffic → transactions; online: sessions → orders)                                                                         | Helps explain “why comps moved”: marketing effectiveness, merchandising, staffing, stock-outs, UX issues                                          |
| **Gross Margin / Merchandise Margin**                                | Gross profit after product/ingredient cost (and sometimes freight/shrink); “merch margin” often means sales less cost of goods sold, before occupancy/labor | One of the biggest EBITDA drivers; sensitive to **promo/markdowns, mix, shrink, freight, vendor terms**                                           |
| **Inventory Turns / Weeks of Supply (WOS)**                          | How fast inventory sells through (COGS ÷ avg inventory) and how many weeks on hand                                                                          | Core working-capital + margin driver; low turns often mean **overbuying, obsolescence, markdown risk, cash traps**                                |
| **Store Contribution / Four-Wall EBITDA (Unit-level profitability)** | Store-level profit after direct store costs (COGS, store labor, occupancy, store opex), usually before corporate overhead                                   | Tells you if growth is **value-accretive**; highlights underperforming units, rent pressure, labor model issues                                   |
| **Shrink (Loss) / Returns Rate**                                     | Inventory loss from theft/error/damage (shrink) and % of sales returned (returns)                                                                           | Shrink/returns can silently destroy margins and distort inventory accuracy; diligence often finds **under-accrued shrink/returns reserves**       |

**Optional add (if DTC-heavy):** **Repeat Rate / Customer Retention / LTV:CAC** (DTC retail behaves like a quasi-subscription model operationally).

---

## Part 3: Value Driver Framework

### Question 3: EBITDA value driver tree for this industry

Below is a practical tree that works across multi-unit retail, F&B operators, and CPG brands (with sub-branches where relevant).

```
EBITDA
├── Net Revenue
│   ├── Gross Sales (by channel)
│   │   ├── Stores (Retail / Restaurants)
│   │   │   ├── # Stores (avg) × Sales per Store
│   │   │   │   ├── Transactions (traffic) × AOV (ticket/check)
│   │   │   │   │   ├── Price (menu price / shelf price)
│   │   │   │   │   ├── Mix (category / SKU / add-ons / daypart)
│   │   │   │   │   └── Units per Transaction / Attach rate
│   │   │   │   └── Store productivity drivers
│   │   │   │       ├── Conversion rate
│   │   │   │       ├── Stock availability / in-stocks
│   │   │   │       └── Operating hours / capacity constraints
│   │   │   └── Same-store sales vs growth from new openings
│   │   ├── E-commerce / DTC
│   │   │   ├── Sessions × Conversion × AOV
│   │   │   └── Repeat rate × purchase frequency (for cohorts)
│   │   ├── Wholesale / B2B
│   │   │   ├── Units shipped × Net price per unit
│   │   │   └── # Doors / accounts × Velocity (sell-in vs sell-through)
│   │   └── Franchise / Licensing (if applicable)
│   │       ├── Franchisee sales × Royalty rate
│   │       └── Franchise fees (initial + ongoing)
│   └── Gross-to-Net Adjustments
│       ├── Discounts / Promotions / Coupons
│       ├── Markdown expense (retail) / Promotional pricing (CPG)
│       ├── Returns / Refunds / Allowances (incl. e-comm returns)
│       ├── Trade spend & deductions (CPG: bill-backs, co-op, slotting)
│       ├── Loyalty programs (points deferral/redemption)
│       └── Gift card breakage (timing + estimate)
│
├── COGS (or Cost of Sales)
│   ├── Product / ingredient cost (purchase price, commodity input cost)
│   ├── Freight & logistics
│   │   ├── Inbound freight (to DC/store)
│   │   └── Outbound freight (fulfillment / shipping to customer)
│   ├── Shrink / Spoilage / Waste
│   ├── Packaging (esp. F&B / CPG)
│   ├── Co-manufacturing / manufacturing conversion costs (if applicable)
│   └── Inventory valuation impacts
│       ├── Obsolescence write-downs
│       └── Standard cost variances (if used)
│
└── Operating Expenses (OpEx)
    ├── Store / Restaurant Labor
    │   ├── Hours × Wage rate
    │   ├── Staffing model (coverage, productivity, turnover)
    │   └── Incentives / overtime / payroll tax & benefits
    ├── Occupancy
    │   ├── Base rent
    │   ├── CAM / NNN / taxes / insurance
    │   ├── Percentage rent (if applicable)
    │   └── Utilities
    ├── Store Operating Expenses
    │   ├── Repairs & maintenance
    │   ├── Supplies / consumables
    │   ├── Merchant fees (credit card / payment processing)
    │   ├── Delivery commissions (restaurants) / marketplace fees
    │   └── Loss prevention / security
    ├── Fulfillment & Distribution (esp. omni-channel/CPG)
    │   ├── DC labor & occupancy
    │   ├── Pick/pack/ship cost per order
    │   └── Reverse logistics (returns processing)
    ├── Marketing
    │   ├── Brand marketing
    │   ├── Performance marketing (CAC, ROAS)
    │   └── Promotions funding (sometimes treated as contra-revenue)
    ├── Corporate G&A
    │   ├── HQ headcount (finance, HR, IT, merchandising)
    │   ├── Professional fees
    │   └── Insurance, travel, etc.
    └── Technology / SaaS / POS / ERP (often in G&A)
```

**Mix effects that matter (often huge):**

* **Channel mix:** stores vs e-comm vs wholesale (each has different gross margin + fulfillment/returns burden)
* **Product/SKU mix:** private label vs branded; high margin accessories vs low margin staples; premium vs value tier
* **Geography mix:** labor rates, rent, regulation, seasonality
* **Customer mix (CPG):** mass vs specialty vs club; big retailer terms can swing gross-to-net dramatically

---

### Question 4: Full cost structure and what drives margins

Because your module covers **Retail + F&B + CPG**, the “shape” of the P&L is consistent, but the typical ranges differ. Below is a **complete diligence-friendly P&L view**, with notes on unit drivers and what’s controllable.

#### A. Gross Margin / COGS

**What’s in COGS (typical inclusions):**

* Product / ingredient purchases
* Inbound freight (sometimes in COGS, sometimes in distribution expense)
* Packaging (CPG/F&B)
* Manufacturing conversion / co-man fees (if applicable)
* Shrink/spoilage/waste (can be embedded via inventory adjustments)
* Inventory write-downs (obsolescence, spoilage, lower-of-cost-or-NRV)

**Typical gross margin ranges (very broad, segment-dependent):**

* **Grocery / low-margin staples retail:** ~15–30%
* **Specialty retail / branded retail:** ~35–65%
* **CPG / consumer goods brands:** often ~30–55%
* **Restaurant/F&B operators:** not usually called “gross margin” in the same way; practitioners focus on **food & beverage cost %** (often ~25–35%+ depending on concept) and **prime cost** (food + labor)

**What drives cost per unit / gross margin movement:**

* Vendor terms and scale (buying power, rebates, payment terms)
* Promo/markdown intensity (gross-to-net is often “the margin killer”)
* Freight volatility, fuel, and network efficiency (DC placement, last-mile)
* Shrink, waste, and inventory accuracy
* Product mix (private label vs branded; premium vs value)
* Cost accounting choices (what is in COGS vs OpEx—important for EBITDA comparability)

#### B. Operating Expenses (full breakdown)

Below is the standard functional breakdown used in diligence. Percent-of-revenue ranges vary wildly; use them as directional checks, not “truth”.

1. **Store/Restaurant Labor**

* **Drivers:** hours, staffing model, wage rates, turnover, overtime, scheduling effectiveness
* **Fixed vs variable:** semi-variable (base coverage is fixed-ish; incremental hours scale with sales)
* **Controllable vs non-controllable:** controllable short term (scheduling), less controllable long term (wage inflation, regulation)
* **Headcount vs non-headcount:** mostly headcount-related

2. **Occupancy**

* **Components:** base rent, CAM/NNN, property tax, insurance, utilities; sometimes percentage rent
* **Fixed vs variable:** mostly fixed (utilities partially variable)
* **Controllable:** limited (renegotiate at renewal, close/move stores)
* **Big diligence watch-out:** lease escalators + underperforming stores = margin squeeze

3. **Store Operating Expenses**

* **Components:** repairs & maintenance, supplies, cleaning, security/loss prevention, local marketing, POS fees, uniforms, etc.
* **Drivers:** store count, sales volume, concept/service level
* **Fixed vs variable:** mixed

4. **Distribution / Fulfillment**

* **Components:** DC labor/occupancy, 3PL fees, pick/pack/ship, outbound freight, returns processing
* **Drivers:** order volume, shipping zones, returns rate, channel mix (e-comm heavy = higher)
* **Key diligence need:** compute **contribution margin by channel** (e-comm often looks high GM but loses it in fulfillment/returns)

5. **Marketing**

* **Components:** brand marketing, performance marketing, promotions; trade spend may sit contra-revenue instead
* **Drivers:** growth strategy (new customer acquisition vs retention), competitive intensity
* **Fixed vs variable:** can be highly variable (paid media)
* **Watch-out:** “marketing efficiency” can deteriorate quickly (ROAS down, CAC up)

6. **Corporate G&A**

* **Components:** HQ payroll, IT, finance, HR, merchandising, legal, insurance, professional fees
* **Drivers:** complexity, number of units/channels, growth stage
* **Leverage:** should scale slower than revenue in a well-run operator (but often doesn’t)

#### C. Unit Economics (how profitability looks at the unit level)

**Multi-unit retail / restaurant: “four-wall” view**

* Sales
* Less: COGS (incl. shrink/waste)
* = Gross profit
* Less: store labor
* Less: occupancy
* Less: store opex
* = **Store contribution / Four-wall EBITDA**
* Then allocate: corporate overhead, marketing, distribution (if centralized) → consolidated EBITDA

**E-commerce: contribution per order**

* Net revenue per order (after discounts/returns expectations)
* Less: product cost
* Less: pick/pack/ship + payment fees
* Less: returns processing (expected)
* Less: variable marketing (if performance-driven)
* = **Contribution margin per order / per customer**

**CPG / consumer goods: contribution after trade**

* Gross sales
* Less: trade spend/deductions/returns allowances (gross-to-net)
* = net sales
* Less: COGS (manufacturing + freight)
* = gross profit
* Less: selling/distribution (brokers, 3PL), brand marketing
* = EBITDA

#### D. Margin differentiation: what separates high vs low margin operators

High-margin operators tend to have:

* **Pricing power** + disciplined promo strategy (less “buying sales”)
* Better **mix** (premium SKUs, private label, attach/add-ons)
* Strong **inventory discipline** (high turns, fewer markdowns, fewer stock-outs)
* Lower **shrink/returns** through process + systems
* Efficient **labor model** (scheduling, training, lower turnover)
* Smarter **real estate** (rent-to-sales discipline, good sites, renegotiation/exit playbook)
* Strong **omni-channel economics** (BOPIS/ship-from-store can beat pure shipping economics)

Typical EBITDA margin ranges (directional, huge variance):

* **Grocery/commodity retail:** low single digits
* **Specialty retail:** mid-to-high single digits to teens (and sometimes higher for strong brands)
* **Restaurants:** concept-dependent; store-level margins can be attractive but corporate overhead, growth spend, and delivery mix matter a lot
* **CPG brands:** often high single digits to 20%+ depending on scale, trade spend, and manufacturing model

---

### Question 5: Working Capital value driver tree

Retail working capital dynamics are often misunderstood because many retailers have **negative working capital** (a feature, not a bug) when payables and customer cash float exceed inventory/receivables.

```
Operating Working Capital (OWC)
= (A/R + Inventory + Other Current Assets)
  - (A/P + Accrued Liabilities + Other Current Liabilities + Deferred Revenue-like items)

├── Accounts Receivable (A/R)
│   ├── Drivers of DSO
│   │   ├── Channel mix (DTC vs wholesale vs marketplaces)
│   │   ├── Payment terms (Net 30/45/60)
│   │   ├── Deductions/chargebacks (CPG) and dispute cycle time
│   │   └── Credit risk / bad debt policy
│   └── Nuances
│       ├── Credit card settlement timing (DTC: usually short)
│       ├── Marketplace payout terms (can be netted with fees)
│       └── Distributor collections (can be slower, more deductions)
│
├── Inventory
│   ├── Categories (depends on model)
│   │   ├── Retail: DC inventory + store inventory (by category/season)
│   │   ├── F&B: perishable ingredients + packaging (spoilage risk)
│   │   └── CPG: raw materials + WIP + finished goods
│   ├── Drivers of DIO / turns
│   │   ├── Forecast accuracy & demand variability
│   │   ├── Lead times, MOQs, safety stock policies
│   │   ├── Seasonality (holiday build, summer, back-to-school)
│   │   ├── New product introductions and end-of-life SKUs
│   │   └── In-stock targets vs working capital discipline
│   └── Risks
│       ├── Obsolescence / slow movers (markdown/write-down)
│       ├── Shrink/spoilage reserves understated
│       └── Inventory accuracy issues (systems, cycle counts)
│
├── Accounts Payable (A/P)
│   ├── Drivers of DPO
│   │   ├── Vendor terms (Net 30/45/60/90)
│   │   ├── Vendor concentration / leverage
│   │   ├── Use of supply chain finance (if any)
│   │   └── Timing of inventory buys (seasonal bulges)
│   └── Watch-outs
│       ├── “Stretched payables” near close (one-time WC benefit)
│       ├── Early-pay discounts being forfeited
│       └── Terms changing post-transaction
│
└── Other WC items (often material)
    ├── Gift card liability (cash upfront; revenue later)
    ├── Loyalty program liability (points accrual/redemption)
    ├── Returns reserve (expected refunds/credits)
    ├── Vendor rebates/allowances receivable or accrual timing
    ├── Accrued payroll/bonuses (esp. store incentives)
    ├── Sales tax/VAT payable
    └── Prepaids (rent, insurance) and deferred rent/lease incentives
```

**Cash conversion cycle:**

* **DTC retail:** usually short A/R, inventory-driven, payables-driven; returns can create a cash drag.
* **Wholesale/CPG:** classic cycle: A/R + Inventory – A/P (often positive CCC).
* **Multi-unit retail:** can be **negative CCC** when vendor terms + customer cash dominate (but inventory builds can swing it seasonally).

**Seasonality patterns:**

* Inventory builds ahead of peak season (holiday), then sells through; payables may lag, creating temporarily favorable cash.
* Promotions can pull forward demand but worsen gross-to-net and returns.

**Industry-specific “cash traps”:**

* Rising **deductions/chargebacks** (CPG) that delay cash and create disputes
* **Returns** (DTC) with long reverse-logistics cycle times
* **Gift cards/loyalty** estimates that don’t match actual redemption patterns (can create future revenue/earnings and WC timing surprises)

---

### Question 6: Capex in this industry

Capex is usually dominated by **unit growth** and **refresh/maintenance**, plus systems and supply chain investments.

#### A. Growth capex

**What drives growth:**

* **New store/restaurant openings:** leasehold improvements, buildout, FF&E, signage, POS
* **New distribution capacity:** DC build/fit-out, automation, racking, material handling equipment
* **CPG capacity expansion:** manufacturing lines, tooling, quality systems, packaging equipment

**Typical cost to open a new unit (very broad):**

* Small format specialty retail: often **hundreds of thousands to low single-digit millions** per store depending on size, market, and concept
* Restaurants: similarly broad; kitchen equipment and buildout can push costs higher
* Key diligence is not the average—it’s the **distribution** (what drives outliers: landlord TI, permitting, equipment choices, urban vs suburban)

**Ramp-up period to maturity:**

* Often **6–18 months** to stabilize (concept, market, staffing). Some formats stabilize faster; others need 2+ years.
* Diligence needs: store cohort curves and “mature store” benchmarks.

#### B. Maintenance capex

**Recurring investments:**

* Remodels/refreshes (every ~3–7 years depending on concept)
* Equipment replacement (kitchen, refrigeration, POS)
* IT hardware refresh
* Facility upkeep (roof, HVAC, lighting)

**Typical maintenance capex as % of revenue (directional):**

* Retail operators: often **~1–3%** (can be higher during refresh cycles)
* Restaurants: can be similar, but equipment wear may push maintenance
* CPG/manufacturing: can be **higher** due to plant/equipment intensity

#### C. Technology / digital capex

**Common investments:**

* POS modernization
* ERP/financial systems
* OMS/WMS (order & warehouse management)
* E-commerce platform, mobile app, loyalty system
* Data/BI stack, demand planning tools

**Big implementations to watch:**

* ERP rollouts, POS conversion, WMS implementation—these can cause **operational disruption** (stock-outs, accounting issues, labor inefficiency) and often hide in “one-time” add-backs.

---

## Part 4: Common Analysis & Analysis Roadmap

### Question 7: Standard analyses in this industry

| Analysis                                                         | What it shows                                                                    | Good vs. concerning                                                                                                                          |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Comps (SSS/LFL) trend + bridge**                               | Organic growth; decomposes SSS into **traffic/transactions × AOV** and price/mix | **Good:** stable/positive comps with healthy traffic; **Concerning:** comp growth driven only by price/promos while traffic declines         |
| **Store cohort / maturity curve**                                | How new units ramp to “mature” sales and margin                                  | **Good:** predictable ramp with strong mature benchmark; **Concerning:** long/flat ramps or wide dispersion by region/site type              |
| **Store-level profitability distribution (four-wall)**           | Which stores make money and why; identifies closure candidates                   | **Good:** majority of stores positive at four-wall; **Concerning:** many stores below break-even, heavy reliance on a small subset           |
| **Price / promo / markdown analysis**                            | Whether sales are “bought” via discounts; impact on margin                       | **Good:** disciplined promo with measurable lift and margin control; **Concerning:** escalating promos/markdowns, deteriorating gross margin |
| **Product/SKU contribution and mix shift**                       | Which categories/SKUs drive profit and inventory risk                            | **Good:** profitable mix, rational SKU set; **Concerning:** long tail of low-margin/slow-moving SKUs, high obsolescence risk                 |
| **Inventory health dashboard** (turns, WOS, aging, sell-through) | Cash tied up, markdown risk, in-stock issues                                     | **Good:** strong turns + controlled aging; **Concerning:** aging inventory, heavy write-downs, stock-outs despite high inventory             |
| **Shrink / returns deep dive**                                   | Margin leakage, operational control quality                                      | **Good:** controlled shrink/returns with clear drivers and actions; **Concerning:** rising shrink, weak controls, high online returns        |
| **Channel profitability** (stores vs e-comm vs wholesale)        | True contribution by channel after fulfillment/returns/trade                     | **Good:** growth in profitable channels; **Concerning:** mix shift to lower-profit channels with hidden costs                                |
| **Labor productivity**                                           | Sales per labor hour, scheduling efficiency, overtime                            | **Good:** improving productivity; **Concerning:** wage inflation + falling productivity, high turnover                                       |
| **Gross-to-net (CPG) / deductions analysis**                     | How much “revenue” is given back and why                                         | **Good:** stable trade spend with controlled deductions; **Concerning:** rising deductions/chargebacks, unclear accrual policy               |
| **Lease portfolio analysis**                                     | Rent burden, renewal cliffs, exit options                                        | **Good:** rent-to-sales discipline, staggered expiries; **Concerning:** high rent stores, large near-term renewal exposure                   |
| **Margin bridge (YoY) and cost walk**                            | What drove EBITDA change: mix, pricing, wage, freight, occupancy                 | **Good:** explainable drivers, controllable levers; **Concerning:** unexplained swings, heavy “one-time” explanations                        |

---

### Question 7b: What data unlocks each analysis?

Below is a diligence-usable request table. (You can copy/paste into a first request list.)

| Analysis                         | Data Required                                                               | Request Wording                                                                                                                                                    | Priority               |
| -------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| Comps trend + bridge             | Store-level sales + transactions + AOV (weekly or monthly), comp store flag | “Weekly store-level sales, transactions, and AOV for the last 104 weeks, including store open date and comp store flag/definition.”                                | P1                     |
| Store cohort / maturity          | Store list with open/close dates + store-level P&L                          | “Store master list with opening/closing dates, square footage, format, and monthly store-level P&L (sales, COGS, labor, occupancy) for last 36 months.”            | P1                     |
| Store profitability distribution | Four-wall P&L by store                                                      | “Monthly four-wall store P&L for last 36 months, including allocated vs direct costs clearly labeled.”                                                             | P1                     |
| Price/promo/markdown             | Promo calendar + discount/markdown detail by SKU/store                      | “Promotional calendar and markdown/discount detail by SKU and store (or region) for last 24 months; include promo type and depth.”                                 | P1                     |
| SKU contribution + mix           | SKU-level sales/units/gross margin                                          | “SKU-level sales dollars, units, and gross margin (or cost) by month for last 24 months, with SKU hierarchy (category/subcategory) and active/discontinued flags.” | P1                     |
| Inventory health                 | On-hand, receipts, transfers, inventory aging                               | “Inventory on-hand by SKU-location (store/DC) monthly snapshots for last 24 months, plus receipts, transfers, adjustments, and inventory aging buckets.”           | P1                     |
| Shrink                           | Shrink adjustments and cycle count results                                  | “Inventory adjustment log (shrink, damage, write-offs) by store/DC and month for last 24 months; include cycle count/audit results if available.”                  | P1                     |
| Returns (DTC)                    | Returns by reason, channel, SKU; refund timing                              | “E-commerce returns dataset by order/SKU (date, refund amount, reason code, disposition) for last 24 months.”                                                      | P1 (if DTC meaningful) |
| Channel profitability            | Channel P&L and fulfillment costs                                           | “Channel-level P&L (stores/e-comm/wholesale) by month for last 36 months, including fulfillment, shipping subsidies, marketplace fees, and returns costs.”         | P1                     |
| Labor productivity               | Labor hours and wages by store/week                                         | “Weekly labor hours and labor dollars by store for last 104 weeks, split by role if available (manager vs hourly).”                                                | P1                     |
| Lease analysis                   | Lease schedule with terms                                                   | “Full lease abstract/schedule: address, start/end, base rent, CAM/NNN, escalators, options, percentage rent, and landlord TI for all locations.”                   | P1                     |
| Gross-to-net (CPG)               | Trade spend and deductions detail                                           | “Gross-to-net bridge by customer/month for last 36 months, including trade spend components, deductions/chargebacks, returns allowances, and accrual methodology.” | P1 (if wholesale/CPG)  |
| Customer concentration           | Revenue by customer                                                         | “Monthly net revenue by customer for last 36 months (top customers + full list), including channel and terms.”                                                     | P1                     |
| Margin bridge                    | Monthly P&L with cost detail                                                | “Monthly consolidated P&L for last 36 months with sufficient detail to build a margin bridge (COGS, freight, labor, occupancy, marketing, G&A).”                   | P1                     |

---

## Part 5: Red Flags

### Question 8: 8–10 red flags (early signal → data room signal → why → how to investigate)

| Red Flag                                        | Early Signal (CIM/VDD)                                          | Data Room Signal                                              | Why it’s a problem                                              | How to investigate                                                                   |
| ----------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Comps “look fine” but traffic is down**       | Emphasis on “pricing initiatives” / “mix shift” without traffic | Transactions/traffic declining; AOV rising                    | Demand may be weakening; price-led growth can reverse           | Request SSS bridge: traffic vs AOV; look at promo depth and price elasticity         |
| **Sales growth driven by new units, not core**  | Big store opening story; limited comps disclosure               | Flat/negative comp store set; mature store sales declining    | Unit expansion can mask core deterioration                      | Build growth decomposition: new stores vs comp vs closures; maturity curves          |
| **Promo/markdown dependency**                   | “Strong promotional cadence,” “value offerings”                 | Rising discounts, markdown % of sales; margin compression     | “Bought” revenue hurts brand, trains customers, erodes margin   | Promo ROI analysis; markdown aging; gross margin bridge excluding promo              |
| **Inventory risk (slow movers / obsolescence)** | “Inventory optimization opportunity”                            | High WOS, aging inventory, big write-downs                    | Cash trap + future margin hit via markdowns                     | Inventory aging, sell-through, SKU rationalization; reconcile write-down policy      |
| **Shrink/waste is understated**                 | Little mention of shrink; “operational excellence” claims       | Large late-period adjustments; weak cycle counts              | True margin lower; controls weak                                | Trend shrink by store; audit reports; inventory accuracy metrics                     |
| **E-comm growth but poor unit economics**       | “Digital transformation,” “omni-channel leader”                 | High returns, high shipping subsidies, negative contribution  | EBITDA overstated if channel costs excluded or misclassified    | Contribution margin by channel/order; returns reasons; shipping policy economics     |
| **Wholesale/CPG deductions escalating**         | “Strong retailer partnerships” without net revenue detail       | Rising chargebacks/deductions; long dispute cycle             | Net revenue quality issue; cash leakage; forecasting unreliable | Gross-to-net bridge; deductions log; customer terms; AR aging with disputes          |
| **Store portfolio has hidden lease pressure**   | “Attractive locations”                                          | Many leases near renewal; rent escalators; high rent-to-sales | Future margin squeeze; closure costs                            | Lease schedule; rent-to-sales by store; renewal pipeline; break clauses              |
| **Labor model under strain**                    | “People-first culture,” staffing commentary                     | Rising wages + high turnover; overtime; productivity down     | Margin risk; service level issues; comp decline                 | Labor hours/dollars per store; turnover; training; scheduling practices              |
| **Aggressive EBITDA adjustments**               | Heavy “Adjusted EBITDA” with many add-backs                     | Add-backs are recurring (promo, payroll, maintenance)         | QoE risk; EBITDA not sustainable                                | Full adjustment bridge with support; tag recurring vs non-recurring; compare to cash |

---

### Question 8b: CIM language that should trigger concern

| Phrase in CIM                                          | What it signals                                                     | Follow-up                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| “Adjusted EBITDA excludes pre-opening / ramp-up costs” | Growth may be unprofitable; costs are recurring if growth continues | Ask for pre-opening costs by period; reconcile to store opening cadence; assess run-rate |
| “Promotions are strategic investments”                 | Revenue may be “bought”; margin at risk                             | Request promo/markdown detail and margin bridge; assess price elasticity                 |
| “Inventory constraints limited sales”                  | Stock-outs and supply chain issues; could also mask demand weakness | Request in-stock %, fill rates, lost sales estimates, lead times, supplier capacity      |
| “Strong omni-channel growth”                           | Could hide fulfillment/returns margin drag                          | Request channel contribution P&L including shipping/returns; returns rate by cohort      |
| “Diversified customer base” (no data)                  | Potential concentration                                             | Request top customers, revenue/terms, and renewal/retailer reset risk                    |
| “Normalized results exclude one-time inflation”        | Inflation might be the new normal                                   | Ask what portion is contracted vs spot; wage/rent step-ups; commodity hedging            |
| “Industry-leading margins” (no definition)             | Definition games (COGS vs OpEx)                                     | Request P&L mapping, accounting policies, and KPI definitions                            |
| “White space store expansion opportunity”              | Site selection risk; ROI assumptions                                | Ask for historical store ROI distribution and underperformer closure history             |
| “Minimal churn” (for loyalty/subscription)             | Could be measurement / cohort definition issue                      | Request cohort retention and churn definitions; cancellation/returns linkage             |

---

## Part 6: First Data Requests

### Question 9: Standard first-round data requests (pre-data room / first batch)

Below is a pragmatic “P1/P2” list for this module.

#### P1 (Critical)

1. **Monthly consolidated financials (36 months)**

* **What:** Income statement detail + KPIs used internally
* **Granularity:** monthly; include revenue by channel, COGS, labor, occupancy, marketing, G&A
* **Format:** Excel
* **Why:** build trend and margin bridge; identify seasonality and volatility

2. **Store/location master file**

* **What:** all units with open date, close date (if any), format, square footage, geography, ownership (corp/franchise)
* **Format:** Excel
* **Why:** comp store set, cohort/ramp analysis, unit-level economics

3. **Weekly (preferred) or monthly store-level sales + transactions + AOV (2 years)**

* **Why:** comps and traffic/AOV decomposition; identify regional issues

4. **Store-level four-wall P&L (monthly, 24–36 months)**

* **Why:** unit profitability distribution; closure candidates; verify store contribution claims

5. **SKU/category sales + units + cost/margin (monthly, 24 months)**

* **Why:** mix/margin drivers; SKU rationalization; validate gross margin sustainability

6. **Inventory snapshots and movements (monthly, 24 months)**

* **What:** on-hand by SKU-location, receipts, transfers, adjustments
* **Why:** turns, aging, obsolescence, shrink signals

7. **Lease schedule / rent roll**

* **What:** rent, CAM/NNN, escalators, options, expiries
* **Why:** occupancy burden; renewal cliffs; future margin risk

8. **Labor dataset**

* **What:** weekly store labor hours and labor dollars; headcount; wage rates (if available)
* **Why:** productivity, wage inflation sensitivity, staffing model risk

9. **Channel split + e-comm economics (if applicable)**

* **What:** orders, AOV, shipping revenue/subsidy, returns, fees
* **Why:** channel contribution; hidden margin drag

10. **Customer concentration / key accounts (if wholesale/CPG)**

* **What:** monthly revenue by customer and terms
* **Why:** retailer reset risk; trade spend leverage

#### P2 (Important)

* Promo/markdown calendar with mechanics (depth, duration, funding source)
* Deductions/chargebacks log (CPG/wholesale)
* Returns dataset (order-level, reason codes, refund timing)
* Shrink reports, audit/cycle count results
* Vendor list with spend, terms, rebates (procurement opportunity + concentration risk)
* DC/3PL cost detail (cost per shipment, SLA performance, capacity constraints)
* Loyalty program metrics (active members, redemption rates, liability rollforward)
* Capex detail by category + store opening packages (for ROI and maintenance normalization)

---

## Part 7: Management Questions

### Question 10: First 10 questions for management (what you’re really learning + concerning answer)

| Question                                                                                                 | What you’re really trying to learn          | Concerning answer                                                     |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------- |
| 1) “What drove comps over the last 24 months—traffic, price, mix, or promo?”                             | Quality and sustainability of growth        | “Mostly price increases” + no view on traffic elasticity              |
| 2) “How do you define the comp store set, and has it changed?”                                           | KPI integrity / definition gaming           | Frequent resets/exclusions that improve optics                        |
| 3) “Which stores are underperforming, and what’s the closure/relocation playbook?”                       | Portfolio discipline and future liabilities | No clear thresholds; reluctance to exit bad leases                    |
| 4) “What are your unit economics for a new store—build cost, ramp timeline, mature EBITDA, payback?”     | Whether growth is value creating            | Vague ROI; ramp assumptions unsupported by cohorts                    |
| 5) “How do you manage promotions/markdowns—what’s the ROI framework?”                                    | Whether sales are being bought              | “We promote because competitors do”; no measurement of lift vs margin |
| 6) “What are the biggest drivers of gross margin changes—vendor terms, mix, shrink, freight, markdowns?” | True margin levers and risks                | Management blames “one-time” factors every period                     |
| 7) “What is shrink (or waste) today, how is it measured, and what changed?”                              | Control environment + hidden margin leakage | Lack of measurement, infrequent counts, big year-end adjustments      |
| 8) “How profitable is e-commerce after shipping, returns, and marketing?”                                | Channel contribution reality                | They track only gross margin, not fulfillment/returns                 |
| 9) “What are your top 5 vendors/customers and what happens if terms change?”                             | Concentration + leverage dynamics           | Heavy dependence with no mitigation; recent term tightening           |
| 10) “Are there any major system or operational changes underway (ERP/POS/WMS, DC transition)?”           | Execution risk and ‘one-time’ cost creep    | Large go-live near close; prior implementations had disruption        |

---

## Part 8: External Research

### Question 11: What external research is most valuable?

Your assistant should prioritize sources that help answer: **“Is performance good, normal, or worrying?”** and **“What are the structural industry mechanics?”**

#### A. Benchmark sources (directional ranges + definitions)

* Public company filings and earnings decks (gross margin, comp sales, shrink commentary, labor, occupancy)
* Industry associations and operator surveys (retail and restaurant cost benchmarks, shrink trends, wage pressure)
* Market research houses for category growth, pricing, and consumer behavior (used for triangulation, not gospel)
* Labor and inflation indicators (wage growth, CPI categories, commodity indices) to contextualize margin swings

#### B. Regulatory/compliance context

* Food safety and labeling (F&B/CPG): recalls, inspection regimes, allergen compliance
* Employment regulation: minimum wage changes, tip credit rules, scheduling laws (material for labor model)
* Sales tax nexus and e-commerce compliance; privacy/consumer data rules if loyalty is key
* Franchise regulations if franchised model (disclosure requirements, unit economics consistency risk)

#### C. Competitor intelligence

* Store count and footprint mapping (by region) and competitor openings/closures
* Price checks / basket comparisons vs key competitors (value positioning)
* Promo cadence comparisons (how promotional the category is)
* Reviews/consumer sentiment signals (especially for restaurant concepts)

#### D. Industry mechanics & trends

* Promo intensity trends; private label penetration; shrink environment; delivery aggregator dynamics (for restaurants)
* Supply chain constraints/commodity drivers relevant to the company’s key inputs
* Channel shift trends (store vs online vs marketplace)

---

## Part 9: Accounting & Recognition

### Question 12: Industry-specific accounting and revenue recognition issues

#### Revenue recognition (ASC 606 / IFRS 15 themes)

* **Point-of-sale recognition:** Retail and restaurants typically recognize revenue at sale; key diligence is **cut-off**, voids/refunds, and discounts.
* **Returns and allowances:** DTC and some retail categories need robust **returns reserves**; aggressive policies under-accrue expected returns or ignore return shipping/restocking costs.
* **Gift cards:** Cash is received upfront; revenue recognized upon redemption; **breakage** is an estimate—aggressive breakage assumptions can inflate revenue/EBITDA.
* **Loyalty programs:** Points often create a **deferral** (a portion of sale allocated to points and recognized when redeemed/expired). Aggressive approaches under-defer or over-estimate breakage.
* **Gross vs net (principal vs agent):** Marketplaces, delivery platforms, and some drop-ship models require principal/agent assessment—getting this wrong can inflate revenue (and distort margins).
* **Wholesale/CPG deductions:** Revenue is often net of trade spend and expected deductions. Aggressive recognition delays accruals for chargebacks/deductions, overstating near-term net revenue.
* **Franchise revenue (if applicable):** Royalty revenue depends on franchisee sales; ensure completeness and accuracy of reported franchisee sales; initial franchise fees may require deferral depending on performance obligations.

#### Cost recognition & capitalization

* **Inventory valuation:** FIFO/LIFO/weighted average; **LIFO** can distort comparability and create reserve considerations. Lower-of-cost-or-NRV judgments matter in promotional/seasonal categories.
* **Freight classification:** Inbound freight usually in inventory/COGS; outbound shipping/fulfillment might be in COGS or OpEx—classification affects gross margin comparability.
* **Shrink/spoilage/waste:** Should be recognized systematically; “big true-ups” are a red flag.
* **Pre-opening costs:** Store opening costs are generally expensed (except capitalizable fit-out/FF&E). Aggressive capitalization inflates EBITDA.
* **Software/internal-use systems:** ERP/POS/WMS implementations may have capitalizable components; aggressive capitalization boosts EBITDA but can be challenged.

#### Balance sheet estimates & reserves to scrutinize

* Returns reserve (esp. DTC)
* Inventory obsolescence and markdown reserves
* Shrink reserve
* Gift card and loyalty liabilities (and breakage assumptions)
* Trade spend accruals (CPG) and deduction reserves
* Bad debt reserve (wholesale)
* Warranty reserves (some consumer goods)
* Store asset impairment (underperforming units) and lease-related obligations

#### Cash vs accrual considerations

* Credit card settlement timing and chargebacks
* Gift card cash upfront vs revenue later
* Wholesale deductions that delay cash and create AR disputes

#### Comparability issues

* Gross margin definitions (what’s in COGS)
* Promo/trade spend presentation (contra-revenue vs marketing)
* Lease accounting differences (IFRS 16 vs ASC 842 implications for EBITDA, and internal “store contribution” metrics)
* Treatment of fulfillment and returns costs (COGS vs OpEx)

---

### Question 12b: QoE adjustment watchlist for this industry

#### Due diligence adjustments (non-recurring / non-operating)

| Category                       | What to look for                                 | Direction                             | Why it matters                           |
| ------------------------------ | ------------------------------------------------ | ------------------------------------- | ---------------------------------------- |
| Owner comp & perks             | Excess comp, personal expenses, travel, vehicles | Add-back (+)                          | Normalizes to market                     |
| Related-party rent             | Below/above-market rent to owner entity          | +/-                                   | True occupancy cost post-deal            |
| One-time system implementation | ERP/POS go-live costs, consulting                | Add-back (+) *if truly non-recurring* | But watch for “permanent project mode”   |
| Litigation/settlements         | One-time claims, regulatory fines                | Add-back (+)                          | Non-recurring (unless recurring pattern) |
| One-time marketing launch      | Rebrand, market entry campaign                   | Add-back (+)                          | Not run-rate (verify)                    |
| Disaster/event impacts         | Temporary closures, unusual weather/event        | +/-                                   | Normalize underlying run-rate            |

#### Pro forma adjustments (run-rate normalization)

| Category                               | What to look for                              | Direction    | Why it matters                           |
| -------------------------------------- | --------------------------------------------- | ------------ | ---------------------------------------- |
| New stores opened mid-period           | Annualize mature contribution (with evidence) | Increase (+) | Full-year impact                         |
| Store closures                         | Remove lost contribution (if closed)          | Decrease (-) | Run-rate vs historical                   |
| Pricing actions implemented mid-period | Annualize price impact (careful)              | Increase (+) | But validate elasticity and promo offset |
| Wage/rent step-ups known and imminent  | Annualize increases                           | Decrease (-) | Prevent overstated forward EBITDA        |
| Supply contracts renegotiated          | Rate changes, rebates                         | +/-          | Forward-looking margin                   |

#### IFRS/GAAP / policy comparability adjustments

| Category                              | What to look for                         | Direction                                  | Why it matters                            |
| ------------------------------------- | ---------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| Lease accounting (IFRS 16 vs ASC 842) | Different EBITDA presentation            | Varies                                     | Peer comparability; debt-like obligations |
| Revenue gross vs net                  | Principal/agent errors                   | Usually decrease revenue (EBITDA may vary) | Prevent inflated top line                 |
| Trade spend accounting                | Contra-revenue vs expense classification | Reclass                                    | Comparability and gross-to-net clarity    |
| Inventory costing (LIFO vs FIFO)      | LIFO reserve and earnings distortion     | Varies                                     | Normalization across periods/peers        |
| Capitalization policy                 | Store opening/software capitalization    | Usually decrease EBITDA if too aggressive  | Quality of earnings and sustainability    |

---

## Part 10: Value Creation Opportunities

### Question 13: Typical value creation levers

| Opportunity                                              | How to identify in diligence                                             | Typical impact (directional)                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Procurement / vendor term optimization**               | Benchmark costs vs peers; fragmented vendor base; limited rebates        | 1–5%+ of addressable COGS (varies widely)                              |
| **Promo/markdown optimization**                          | Rising discount rate; low promo ROI; margin erosion                      | Meaningful GM uplift (often 100–300+ bps depending on promo intensity) |
| **Shrink reduction / loss prevention**                   | High or rising shrink; weak controls; big adjustments                    | GM uplift (tens to hundreds of bps)                                    |
| **Inventory optimization (turns/WOS)**                   | Aging inventory; stock-outs + excess simultaneously                      | WC release + margin improvement via fewer markdowns                    |
| **Labor scheduling productivity**                        | High labor % sales; inconsistent staffing; overtime                      | 50–200+ bps EBITDA potential depending on baseline                     |
| **Store portfolio optimization**                         | Long tail of unprofitable units; high rent-to-sales stores               | EBITDA uplift via closures/relocations and renegotiations              |
| **Omni-channel profitability improvements**              | High shipping subsidy, high returns                                      | Material contribution improvement (reduce per-order loss)              |
| **Mix shift (private label / higher-margin categories)** | Margin concentrated in certain categories; underpenetrated private label | Sustained GM uplift; also differentiation                              |
| **Trade spend / deductions control (CPG)**               | Gross-to-net instability; deductions disputes                            | Net revenue quality + cash flow improvement                            |
| **Supply chain/network redesign**                        | DC cost high, long zones, poor service levels                            | Cost-to-serve reduction; service/in-stock improvements                 |

Synergy areas (for bolt-ons):

* Consolidate purchasing and freight
* DC and fulfillment consolidation
* Shared back-office (finance/HR/IT)
* Rationalize overlapping stores and improve density
* Integrate loyalty/CRM and marketing efficiency

---

## Part 11: Ownership & Related Party Patterns

### Question 14: Common ownership and related party patterns

#### Ownership structures you’ll see

* **Family-owned / founder-led:** often real estate held separately; informal controls; owner comp/perks; underinvestment in systems
* **PE-backed:** aggressive add-backs, growth capex, heavy focus on adjusted metrics; sometimes multi-brand roll-ups
* **Carve-outs:** allocations, shared services, TSA needs, incomplete standalone systems, transfer pricing issues
* **Franchise-heavy models:** reliance on franchisee health and reporting accuracy; franchisor support costs may be understated

**CIM signals of ownership risk:**

* “Real estate owned by affiliates”
* “Shared services provided by parent”
* “Owner-managed supplier relationships”
* “Adjusted EBITDA” heavily emphasized with limited reconciliation

#### Related party transactions (RPTs) common in this industry

| RPT Type                      | What it looks like              | Risk                              | CIM signal                                            |
| ----------------------------- | ------------------------------- | --------------------------------- | ----------------------------------------------------- |
| Related-party rent / property | Stores leased from owner entity | Above/below market; renewal risk  | “Real estate strategy includes affiliate-owned sites” |
| Management fees               | Holdco charges management fee   | Non-market; add-back needed       | “Management fee” in SG&A                              |
| Shared services allocations   | IT/HR/finance from parent       | TSA required; costs may rise      | “Allocated corporate costs”                           |
| Supplier relationships        | Owner-affiliated sourcing       | Off-market pricing; concentration | “Exclusive supplier partner” without details          |
| IP licensing                  | Brand/IP owned separately       | Royalty may change post-deal      | “Brand licensing arrangement”                         |
| Distribution/trucking         | Affiliate logistics             | Cost inflation post-close         | “Third-party logistics partner” with affiliate ties   |

---

## Part 12: Anything Else

### Question 15: Other things FDD teams commonly miss (but matter)

* **Definition risk is real:** “Comps,” “four-wall EBITDA,” “gross margin,” and “COGS” are frequently defined in non-standard ways. Your module should force the assistant to request **definitions and reconciliations** early.
* **Calendar quirks:** 4-4-5 calendars, 53-week years, and holiday shifts can distort YoY comparisons. Always normalize when doing monthly/weekly trend analysis.
* **Omni-channel is not automatically accretive:** E-comm growth can look great in revenue and gross margin, but be value-destructive after fulfillment/returns/marketing.
* **Returns are a P&L + WC + fraud issue:** Not just a customer service metric—returns create cash delays, inventory write-downs, and operational costs.
* **Store count ≠ growth quality:** Store expansion can hide weak concept economics; the only real answer is **cohort-based store contribution** and payback distribution.
* **Shrink and inventory accuracy are control-environment proxies:** Weak shrink controls often correlate with other control issues (cash handling, comp integrity).
* **Lease obligations behave like debt operationally:** Even if accounting moves around, lease cliffs and escalators are real cash commitments.
* **CPG gross-to-net is where “earnings quality” often breaks:** If the model includes wholesale, build muscle around deductions, accrual methodology, and retailer compliance metrics (OTIF).

---

If you want, I can also package the above into a more “module-like” structure your product can ingest (e.g., JSON-ish schema: **industry signals**, **KPI dictionary**, **driver trees**, **standard request templates**, **red flag library**, **question bank**).
