# Realism Guide: Document Authenticity Markers

**Purpose**: Per-document-type guidance on what makes artifacts realistic vs. obviously fake. Use these markers to evaluate generated documents and identify gaps.

---

## Table of Contents

1. [CIM and Management Overview](#cim-and-management-overview)
2. [Accounting Policy Memo](#accounting-policy-memo)
3. [Trial Balance, GL and Close Support](#trial-balance-gl-and-close-support)
4. [Historical Financial Statements and KPI Packs](#historical-financial-statements-and-kpi-packs)
5. [Revenue-Detail Files](#revenue-detail-files)
6. [AR, AP and Working Capital Support](#ar-ap-and-working-capital-support)
7. [HR and Payroll](#hr-and-payroll)
8. [Leases and Legal Documents](#leases-and-legal-documents)
9. [Tax Returns and Compliance Files](#tax-returns-and-compliance-files)

---

## CIM and Management Overview

### 30-Second Tells (Immediate Red Flags)

- Bracketed placeholders like "[INSERT CUSTOMER NAME]", "XXX", "TBD", or "[ANALYST NAME]"
- No table of contents (CIM always has detailed TOC)
- No confidentiality/NDA page with advisors' names
- Lacks investment highlights, growth bridge, or ownership/sale rationale section
- No concentration analysis (top 10 customers, product mix, geographic)
- Charts have incorrect/mismatched data, unrealistic growth curves
- All growth appears linear year-over-year; no seasonality, no acquisition step-changes
- No management team bios with specific tenure/background
- Revenue numbers don't reconcile with later detail sections
- No competitive positioning or end-market context
- Document appears hastily assembled without formatting consistency

### Structural Markers (Required Sections)

A complete CIM typically includes:
1. **Confidentiality and advisors page** — advisor names, firm logos, NDA text
2. **Table of contents** — detailed with page numbers
3. **Executive summary** — 1-2 page high-level overview, key metrics
4. **Investment highlights** — 4-6 bullet points of differentiation
5. **Company history and founding** — founding date, key milestones, pivots
6. **Market and industry overview** — TAM, growth drivers, competitive landscape
7. **Products/services and value proposition** — detail by line, customer use case
8. **Customer overview** — customer segments, top-10 concentration, case studies, references
9. **Operations** — manufacturing, delivery, technology, footprint
10. **Management team** — org chart, bios with prior experience, tenure
11. **Financial summary** — revenue bridge, growth rate, profitability trends, key metrics
12. **Growth strategy and use of proceeds** — expansion plans, product roadmap, M&A
13. **Transaction rationale** — reasons for sale (if exit), buyer fit
14. **Appendix** — detailed schedules, customer contracts, org chart, facility maps

### Content Markers (Terminology and Detail Richness)

- **Specific revenue bridges**: "Revenue grew from $2.3M (2021) to $4.1M (2022) to $6.8M (2023), driven by customer additions (20 new customers) and expansion within existing customer base (ACV increase from $115K to $170K)"
- **Concrete customer mix**: Name top-10 customers (anonymized in early draft), percentage of revenue, contract terms (3-year MSA, annual renewal, usage-based)
- **Product/service lineup detail**: Describe actual offerings, pricing tiers, bundling strategies
- **Clear competitive positioning**: Compare on feature/price/customer type vs. 2-3 specific competitors
- **Growth drivers identified**: "Growth driven by (1) entry into adjacent market segments (+$1.2M), (2) land-and-expand motion within Fortune 500 segment (+$0.9M), (3) geographic expansion to EU (+$0.8M)"
- **Realistic margin profile**: Gross margin should align with revenue model (SaaS 70-85%, services 40-60%, product 30-50%)
- **Management ownership**: Founder/CEO equity stake, vesting schedules
- **Site/facility count and locations**: "Operates 12 centers across 8 states with 450 FTE"
- **Brand/reputation indicators**: Awards, certifications, customer NPS, analyst recognition

### Cross-Document Ties (Must Match)

| Item | Consistency Check |
|------|-------------------|
| Company name, legal entity, HQ location | Must match entity formation docs, state filings, payroll records |
| Founding date, founder names, management team names | Must match cap table, org chart, payroll roster |
| Revenue figures, revenue growth rate, gross margin | Must reconcile with income statement, customer detail, revenue ledger |
| Customer count, top-10 customer names/revenue, geographic distribution | Must match customer master, AR aging, sales forecast |
| Site/facility count and locations | Must match site master, rent roll, employee roster by location |
| Employee headcount and function (sales, eng, ops, etc.) | Must match HR roster, payroll, org chart |
| Product/service mix and pricing | Must match sales contracts, revenue detail, pricing master |
| Key metrics (ARR, LTV, CAC, NRR) | Must be derivable from financial detail and customer ledger |

### Industry Signatures (Sector-Specific Markers)

**SaaS**:
- Annual Recurring Revenue (ARR) and Monthly Recurring Revenue (MRR) front-and-center
- Net Revenue Retention (NRR) or Net Dollar Retention (NDR) explicitly stated
- Churn rate by cohort (monthly/annual), customer acquisition cost (CAC), lifetime value (LTV)
- Customer concentration risk explicitly called out ("top 3 customers represent 20% of ARR")
- Implementation and professional services revenue separately identified
- Benchmark comparison ("churn <5% annually, NRR 120%+")

**Manufacturing**:
- Plant footprint and capacity utilization by facility
- Product lines and SKU count, top SKUs by revenue
- End-market exposure (% of revenue to automotive, aerospace, etc.)
- Supply chain and supplier concentration
- Capital intensity and asset turns
- Order backlog, lead times, production cycle

**Construction**:
- Project backlog (dollar value and visibility, e.g., "150% booked for next 12 months")
- Project margin profile and estimated loss reserve
- Customer concentration by general contractor and construction type
- Bonding (bid, performance, payment bond) capacity and utilization
- Unionized labor percentage and relevant wage scales
- Safety metrics (TRIR, Days Away/Restricted/Job Transfer)

**Retail**:
- Store count, same-store sales (comparable sales) growth
- Four-wall economics by location (revenue, labor, occupancy cost, operating margin)
- Comp store sales trend, recently opened/closed store detail
- Product categories and margin profile
- Customer traffic, conversion rate, average transaction value
- Inventory turnover, markdown/clearance %

**Healthcare Provider**:
- Provider count (MDs, RNs, therapists, etc.), credentials and FTE equivalent
- Patient volume by service line and payer (commercial, Medicare, Medicaid, cash)
- Average reimbursement by payer and service line
- Patient acquisition cost, retention, lifetime value
- Payer mix concentration (top 3 payers % of revenue)
- Clinical outcomes metrics (readmission rates, patient satisfaction scores)

---

## Accounting Policy Memo

### 30-Second Tells

- Generic or boilerplate GAAP language without company-specific modification
- No mention of company's actual revenue streams or their recognition methods
- Blank sections or "See footnotes" without actual footnotes present
- Wrong revenue recognition method for the business (e.g., using simple accrual for SaaS subscription)
- No discussion of reserves (deferred revenue, contract assets, over/under billing, rebate, obsolescence)
- No sections on judgment areas (capitalization, depreciation, allowance estimates)
- No mention of actual balance sheet accounts that appear in the GL
- Identical text across multiple memo sections (suggests copy-paste, not thoughtful drafting)
- No reference to revenue tiers, contract terms, customer concentration, or actual product/service mix

### Structural Markers

A comprehensive accounting policy memo includes:

1. **Basis of presentation** — fiscal year, accounting standards (GAAP), consolidation, entity list
2. **Revenue recognition policy** by stream:
   - Subscription: point-in-time or over-time recognition, performance obligations, deferred revenue mechanics
   - Services: method (time-and-materials, fixed-fee, percentage-of-completion), recognizable milestones
   - Product: FOB point, recognition at shipment or delivery
   - Usage-based: metering, billing frequency, reconciliation
   - Multi-element contracts: standalone selling price methodology
3. **Variable consideration and reserves** — discounts, rebates, returns, breakage, historical reserve rates
4. **Accounts receivable and allowance** — aging methodology, reserve policy (% of revenue, historical loss %, aging-based)
5. **Inventory** — valuation method (FIFO/LIFO/weighted average), obsolescence policy, lower-of-cost-or-market, scrap/waste treatment
6. **Fixed assets and depreciation** — capitalization threshold, depreciation methods by asset class, useful lives
7. **Leases** — lease accounting policy (ASC 842), right-of-use assets, lease classification
8. **Deferred revenue and contract assets** — treatment, release mechanics, transaction price allocation
9. **Taxes** — provision for income taxes, uncertain tax positions, deferred tax assets/liabilities
10. **Estimates and judgments** — specific areas requiring estimate/judgment (warranty, obsolescence, revenue cut-off, consolidation, related-party transactions)
11. **Concentration risk** — customer, supplier, geographic, regulatory dependencies
12. **Cut-off and period-end adjustments** — reconciliation of cash to AR, accrued expenses process, final journal entry sign-off

### Content Markers

- **Deferred revenue mechanics**: "Subscription revenue is recognized ratably over the contract term. Upfront annual payments are recorded as deferred revenue and released to revenue monthly. As of [date], deferred revenue was $2.4M, representing approximately 4 months of revenue."
- **Contract asset and variable consideration**: "Estimated losses on fixed-price projects are provided when identified. As of [date], estimated loss reserve was $300K (0.3% of revenue-in-process). Variable consideration (discounts, rebates) is estimated using historical data and recorded as revenue reduction in the period of sale."
- **AR reserve and aging**: "Allowance for doubtful accounts is established based on aging and historical loss rate. Reserve is 2.5% of total AR, or 6% of AR >120 days past due. No single customer reserve exceeds $50K."
- **Inventory obsolescence**: "Inventory is lower-of-cost-or-market. Obsolescence reserve is 3% of total inventory, assessed quarterly based on aging, slow-move SKU analysis, and product discontinuation. Reserve changes are recorded in COGS."
- **Fixed asset depreciation**: "Building: 40 years straight-line; Machinery and equipment: 5-7 years; Vehicles: 3-5 years; Leasehold improvements: lesser of lease term or 10 years. Fully depreciated assets remain on books until disposal."
- **Capitalization threshold**: "Expenditures >$5K are capitalized; <$5K expensed immediately. Software development costs meeting capitalization criteria ($15K threshold) are capitalized and amortized over 3-5 years."
- **Revenue cut-off and recognizable performance obligations**: "Revenue for product shipments is recognized on title transfer (FOB shipping point). Services revenue for time-and-materials contracts is recognized as hours are invoiced."
- **Related-party transactions**: "Management is compensated via salary, bonus, and equity vesting. Related-party transactions (e.g., office lease to founder entity at FMV, intercompany charges) are identified in consolidated statement and note [X]."

### Cross-Document Ties

| Accounting Policy | Financial Document Evidence |
|---|---|
| Deferred revenue mechanics | BS: deferred revenue balance and monthly flow; IS: revenue line; contract register: contract terms, start/end dates |
| AR reserve policy | AR aging schedule: aging buckets and reserve %; GL: allowance account changes; income statement: bad debt expense |
| Inventory valuation | Inventory ledger: valuation method, obsolescence reserve; COGS: reserve changes; physical count: reconciliation to GL |
| Fixed asset depreciation | FA ledger: cost, accumulated depreciation, useful lives; GL: depreciation expense; capex detail: recent acquisitions |
| Revenue recognition | Revenue ledger by stream; customer contracts; milestone schedule (if project-based); GL: revenue and deferred revenue accounts |
| Capitalization policy | Capex schedule: capitalized vs. expensed items; GL: PP&E rolls; cost accounting manual: specific thresholds |
| Allowance for doubtful accounts | AR aging: historical loss patterns; GL: allowance changes; bad debt expense; old AR write-off history |

### Industry Signatures

**SaaS/Subscription**:
- Explicit discussion of deferred revenue, contract asset timing, revenue by cohort
- Clear ASC 606 performance obligation language ("control transfers over time as services are delivered")
- Breakage and refund reserve policy
- Discussion of multi-year deals and discount effects

**Project/Services**:
- Percentage-of-completion or completed-contract accounting explanation
- Estimated loss reserve methodology and quarterly review process
- Change order accounting and recognizable milestones
- Over/under billings as contract asset/liability

**Product/Inventory**:
- Specific FIFO/LIFO/weighted average method and rationale
- Obsolescence policy tied to specific aging (e.g., "items >2 years old or slow-move SKU")
- Scrap and waste treatment, reserve history

**Healthcare/Provider**:
- Insurance write-off and payer denial reserve policy ("3% of patient AR reserves for payer denials")
- Capitated contract revenue mechanics
- Patient bad debt reserve

**Lending/Financial Services**:
- Interest income recognition method (simple, compound, effective yield method)
- Loan loss reserve policy and provision calculation
- Loan classification (accruing, non-accrual, charge-off)

---

## Trial Balance, GL and Close Support

### 30-Second Tells

- One row per month with no account detail or dimension
- No account descriptions, account numbers, or GL reference
- Missing debit and credit columns (shows only net balances)
- No entity or location dimension (doesn't show rollup structure)
- No journal entry (JE) register or explanation of significant movements
- No close checklist or sign-off
- Account balances appear "too clean" (no inter-period accruals, no rounding errors)
- Negative assets or impossible account balances (e.g., negative inventory, negative AR, negative PP&E)
- No reconciliation of TB to financial statements shown
- Numbers don't tie to supporting schedules (payroll, AR aging, AP aging, inventory, debt)

### Structural Markers

A complete trial balance and close support package includes:

1. **Trial balance template**:
   - Account number, account name, chart-of-account hierarchy
   - Columns: prior period balance, debits, credits, current period balance
   - Subtotals by account family (assets, liabilities, equity, revenue, expense)
   - TB rolls to income statement and balance sheet totals

2. **General ledger (GL) detail**:
   - Posting dates, transaction descriptions, debit/credit amounts
   - Entity and cost center/department/location dimension where applicable
   - Period-end reconciliations and accruals marked
   - Monthly close entries clearly flagged

3. **Close checklist and sign-off**:
   - List of required month-end procedures (cash reconciliation, AR aging, AP aging, inventory count, accrual review, JE posting)
   - Sign-off by preparer and reviewer with date
   - Key reconciliations (cash vs. bank, AR vs. invoices, AP vs. POs, inventory count vs. GL)

4. **Journal entry register**:
   - JE number, date, description, accounts, debit/credit amounts
   - Authority/approver, preparer name
   - Separate register for automated vs. manual entries
   - Period-specific identification (e.g., "Jan 2024 close entries")

5. **Supporting schedules** referenced in GL:
   - Payroll accrual: hours, rates, payroll taxes
   - Revenue accrual: unbilled revenue, deferred revenue release
   - AP accrual: received-not-invoiced items, accrued expenses
   - Inventory count variance: physical count vs. GL, scrap/waste
   - Depreciation schedule: monthly depreciation by asset class
   - Debt schedule: principal, interest, payment schedule

### Content Markers

- **Normal account signs**: Assets positive, liabilities positive, equity positive, revenue positive, expenses positive (before sign reversal on IS)
- **Realistic accruals**: Monthly payroll accrual, quarterly bonus accrual, monthly rent accrual, monthly utilities accrual
- **Account granularity**: Not a flat list; hierarchical (e.g., Salaries, Wages, Contract Labor under Payroll Expense)
- **Rounding and cut-off**: Minor variances between TB and supporting schedules (due to rounding, timing)
- **Entity/location dimension**: If multi-entity or multi-location, TB shows elimination entries and rolls to consolidated
- **Monthly narrative**: Significant movements or unusual items explained in close memo

### Cross-Document Ties

| TB/GL Item | Supporting Document |
|---|---|
| Total AR balance | AR aging schedule: customer detail, aged buckets, allowance |
| Total AP balance | AP aging schedule: vendor detail, aged buckets, accrued expenses |
| Total inventory | Inventory ledger: by SKU/location, perpetual count vs. physical count, obsolescence reserve |
| Payroll expense | Payroll register: hours, rates, taxes, net pay; headcount report |
| Fixed asset (gross/accumulated depreciation) | FA ledger: cost, depreciation method, useful life; capex schedule |
| Debt balance, interest expense | Debt schedule: outstanding balance, rate, payment terms; amortization table |
| Deferred revenue | Revenue ledger by contract; contract register: start/end dates, contract value, billing schedule |
| Bonus/accrued compensation | Bonus plan document; headcount roster; payroll register |
| Income statement totals | Trial balance: monthly close, variance explanation |
| Cash balance | Bank reconciliation: cash per books vs. per bank, outstanding items |

### Industry Signatures

**Subscription SaaS**:
- Monthly deferred revenue release (ratable across subscription period)
- Contract asset accrual (unbilled revenue for implementation fees recognized over time)
- Cohort-based revenue tracking in GL (by customer cohort/vintage, for cohort analysis)

**Project-Based Services**:
- WIP account rolled forward monthly based on project milestone progress
- Estimated loss reserve accrual, with monthly re-estimation
- Over/under billing accounts (contract assets and liabilities) with monthly movement
- Retainage liability, with release schedule

**Manufacturing**:
- Three inventory accounts (raw materials, WIP, finished goods) with monthly reconciliation to physical count
- Purchase price variance account, monthly close-out
- Standard cost variance accounts if using standard costing
- Depreciation by plant location

**Retail**:
- Store-level P&L P&L roll-up with monthly variance to budget
- Markdown, shrink, and obsolescence reserves, reviewed monthly
- Rent accrual and straight-line rent adjustment (if stepped leases)
- Loyalty liability (gift cards, loyalty points) with monthly accrual and release

**Healthcare Provider**:
- Patient AR and insurance AR separately tracked
- Patient write-off reserve and insurance denial reserve, reviewed monthly
- Capitated contract revenue accrual and patient volume reconciliation
- Malpractice insurance accrual and claims reserve

---

## Historical Financial Statements and KPI Packs

### 30-Second Tells

- Only annual statements shown (no monthly trend; makes seasonal business look non-seasonal)
- Perfect year-over-year growth with no variance (all months +20%, all years +30%)
- No commentary on seasonal patterns, cyclical downturns, or acquisition step-changes
- No variance explanations (budgeted vs. actual, year-over-year analysis)
- Board plan or forecast data missing or doesn't exist
- Profitability trends unexplained (sudden margin improvement without operational explanation)
- KPI dashboard missing or inconsistent with financial data
- No segment detail (by geography, product line, customer type)
- Charts show unrealistic trends (linear growth, perfect correlation)
- No unusual items schedule (one-time costs, asset sales, restructuring)

### Structural Markers

A complete financial statement package includes:

1. **Monthly trend statements**:
   - 12-24 months of monthly P&L (revenue, COGS, operating expenses, EBITDA, net income)
   - Monthly balance sheet (selected items: cash, AR, inventory, AP, debt, equity)
   - Monthly cash flow (operating, capex, financing, net change)

2. **Annual audited/reviewed statements** (if applicable):
   - Full income statement, balance sheet, statement of cash flows
   - Notes to financial statements (accounting policies, segment data, subsequent events)
   - Auditor's opinion letter (if audited) or review letter

3. **Trailing twelve months (TTM) bridge**:
   - Shows progression from prior-year annual to current TTM
   - Explains each major movement (organic growth, acquisition, one-time items)

4. **Variance commentary**:
   - Year-over-year or month-over-month comparisons with explanations
   - P&L commentary (revenue growth drivers, margin expansion/contraction, expense discipline)
   - Working capital commentary (AR days, AP days, inventory turns)

5. **KPI dashboard**:
   - Revenue and growth metrics (revenue, growth %, bookings, ARR, pipeline)
   - Profitability and margin (gross margin %, operating margin %, net margin %)
   - Efficiency metrics (CAC, LTV, payback period, MAGIC number, rule-of-40)
   - Working capital (DSO, DPO, DIO, cash conversion cycle)
   - Headcount and productivity (revenue per FTE, headcount trend)
   - Sector-specific KPIs (NRR, churn, ARPU for SaaS; store count, comp store sales for retail)

6. **Unusual items schedule**:
   - One-time items, restructuring, asset sales, write-downs
   - Impact on net income and normalized earnings

7. **Segment summary** (if applicable):
   - Revenue and margin by geography, product line, or customer segment
   - Growth rates by segment
   - Segment-specific KPIs

### Content Markers

- **Believable seasonality**: Retail peaks in Q4, hospitality slower in off-season, construction seasonal by region
- **Occasional bad months**: Not every month +% YoY; occasional flat or negative months
- **Acquisition impact**: Step-change in revenue at acquisition point, margin step-change if different acquisition margin
- **Margin trends tied to facts**: If margin improves, commentary should reference pricing, mix shift, operating leverage, or cost reduction
- **Working capital dynamics**: AR DSO increases when entering new customer segment; AP DPO increases with scale or negotiating power
- **Headcount efficiency**: If revenue grows 20% but headcount grows 10%, productivity is improving (plausible)
- **Cash flow dynamics**: Operating cash flow lags net income due to working capital build; capex increases with growth

### Cross-Document Ties

| Financial Statement Item | Supporting Document |
|---|---|
| Monthly revenue trend | Revenue ledger: customer/order detail; customer master: volume and pricing changes; sales forecast |
| Gross margin | COGS detail; inventory aging; labor allocation; WIP and estimate-to-complete (if project-based) |
| Operating expenses | Payroll register: comp and headcount; lease schedule: rent expense; GL detail: all operating accounts |
| AR balance, DSO | AR aging schedule: customer detail, payment history; revenue ledger: invoice-to-cash |
| Inventory balance | Inventory ledger: by SKU, valuation, physical count reconciliation |
| AP balance, DPO | AP aging schedule: vendor detail, terms, payment history; PO register |
| Debt and interest expense | Debt schedule: outstanding balance by tranche, rate, payment terms; debt covenant compliance |
| Capex | Capex project schedule: by project, expected completion date, impact on depreciation |
| Headcount, payroll expense | Headcount report: by function, location, level; payroll register: monthly payroll detail |
| KPI definitions | Each KPI must be derivable from financial statement and supporting schedules |

### Industry Signatures

**SaaS**:
- Monthly revenue shows ratable (flat) pattern as subscription deferred revenue is recognized
- Upfront payment pattern affects monthly cash vs. monthly revenue (lumpy cash, smooth revenue)
- NRR and churn seasonality (e.g., churn spike in Q4 budget cutting)
- CAC payback improves with scale; operating leverage visible in operating margin improvement

**Construction**:
- Revenue tied to project completion milestones, creating lumpy revenue pattern
- Margin varies by project type and mix
- WIP balance grows before project completion, then releases
- Gross margin may swing based on estimation accuracy (large estimated losses in bad quarters)

**Manufacturing**:
- Seasonal revenue with corresponding inventory and WIP swings
- Gross margin tied to capacity utilization and product mix
- Inventory and AP working capital changes correlated with revenue growth

**Retail**:
- Pronounced Q4 peak (holiday), Q1 trough (post-holiday)
- Comp store sales trend separate from new store openings
- Inventory spikes before peak season; markdown/clearance impact margin post-season

**Healthcare Provider**:
- Monthly patient volume and acuity affect margin
- Insurance mix changes affect reimbursement and margin
- Seasonal variation by service line (pediatrics higher in school year, orthopedics higher post-ski season)

---

## Revenue-Detail Files

### 30-Second Tells

- Simple table with only Customer, Amount, Date columns (missing contract structure, pricing logic, status)
- Every row identical or nearly identical (all customers same amount, same terms, no cancellations)
- No pricing tiers, volume discounts, or contract-specific terms
- No cancellations, credits, refunds, or churn visible
- No link to AR or invoicing (can't tie customer amounts to actual invoices)
- Customer IDs don't match customer master or contracts
- Dates show no correlation to contract start/end or renewal dates
- No status column (active, cancelled, renewed, etc.)
- No indication of partial periods (e.g., customer added mid-month)
- Missing dimensions relevant to business model (e.g., no service line or product for SaaS)

### Structural Markers

A realistic revenue detail file includes:

1. **Primary keys and identifiers**:
   - Customer ID (matches customer master)
   - Contract/project ID or contract start and end dates
   - Invoice or order number (links to AR)
   - Product/service/project name (links to master or contracts)

2. **Pricing and contract structure**:
   - List price or standard price
   - Discount or promotional pricing (% or $)
   - Actual price paid (list price less discount)
   - Volume-based pricing tier or escalation (if applicable)
   - Contract term (1-year, 3-year, multi-year)

3. **Transaction detail**:
   - Invoice/order date
   - Service/product period (start and end, for subscriptions and time-based services)
   - Quantity, unit price (for product revenue)
   - Total contract value vs. period revenue (for multi-period contracts)

4. **Revenue status and changes**:
   - Revenue status (active, renewed, cancelled, paused, changed)
   - Change date or cancellation date
   - Reason for cancellation (voluntary churn, non-renewal, downgrade, merger)
   - Change-order or modification dates and amounts

5. **Customer attributes**:
   - Customer segment or tier (enterprise, mid-market, SMB)
   - Geography (state, region, country)
   - Industry vertical (if B2B)
   - Cohort or vintage (acquisition date)

### Content Markers

- **Pricing tiers make sense**: Tiered pricing should follow standard SaaS pattern (e.g., $X/month for Starter, $Y/month for Pro, $Z/month for Enterprise); volume discounts should be 10-30%
- **Partial periods exist**: Some customers start/end mid-month, resulting in prorated revenue amounts
- **Discounts exist**: Top customers typically get 10-20% discount; competitive scenarios get deeper discounts
- **Cancellations and downgrades**: Not all customers stay; some cancel, downgrade, or pause; churn rate should be 1-5% monthly for SaaS
- **Renewal and expansion**: Some customers renew, some expand (increase contract value), some contract
- **Dimensions match business**: For SaaS, separate rows by product/service and customer; for project services, separate by project and phase; for retail, separate by store and category
- **Time-based progression**: Revenue evolves; not all customers present in year 1 appear in year 3

### Cross-Document Ties

| Revenue Detail | Document It Must Match |
|---|---|
| Customer ID | Customer master: customer name, segment, geography, cohort |
| Contract ID, dates, terms | Contracts or sales register: contract start/end, pricing, modifications |
| Invoice number, date, amount | AR ledger and aging: invoice detail, cash collection, adjustments |
| Product/service | Product master or contract register: pricing, terms, service level |
| Total revenue by customer, period | Financial statements and revenue summary: monthly/annual revenue totals |
| Cancellation/change dates | Customer churn log: cohort retention, reason codes |
| Discounts applied | Pricing policy and approvals: discount tiers, authorization levels |

### Industry Signatures

**SaaS/Subscription**:
- Each row represents one customer-contract-product combination for each billing period
- Columns: Customer ID, Customer Name, Product/Tier, Monthly Price, Billing Frequency, Start Date, End Date, Status, Discount %, Contract Value, Monthly Revenue
- Multi-year contracts shown with full contract value in year 1, prorated monthly revenue for revenue recognition
- Renewal rows show renewed customers with new start dates; cancelled rows show churn

**Project/Services**:
- Each row represents one project or engagement
- Columns: Project ID, Customer, Project Name, Start Date, End Date, Total Contract Value, Phase/Milestone, % Complete, Revenue Recognized to Date, Period Revenue
- Revenue recognition tied to milestone completion or % complete
- Change orders shown as separate rows or as modifications to original project

**Retail/Product**:
- Each row represents one SKU-Store-Period combination
- Columns: Store ID, Store Name, SKU, Product Name, Category, Units Sold, Unit Price, Discount %, Total Revenue, Period (Month/Week)
- Includes promotional pricing and markdown effects
- Allows roll-up to store, category, and company revenue totals

**Healthcare Provider**:
- Each row represents one service line or encounter type
- Columns: Service Line, Encounter Type, Provider, Patient ID, Payer, Contracted Rate, Actual Reimbursement, Write-off (difference), Encounter Date, Volume (# encounters)
- Separate tracking of patient AR vs. insurance AR
- Payer mix visible in volume and reimbursement columns

---

## AR, AP and Working Capital Support

### 30-Second Tells

- No customer or vendor detail (just line items with amounts and dates)
- Aging buckets never worsen (never shows 90+ day old items becoming 120+ days)
- No breakdown by individual invoice (shows only customer total, not aging of underlying invoices)
- No reserve logic explained or linked to allowance account
- Dispute flags or hold flags missing (can't tell which balances are disputed)
- Old items (>180 days) unexplained (why are they uncollected or unpaid?)
- Totals don't tie to GL balance sheet
- No credit memos or adjustments (looks unrealistically clean)
- No payment terms or reference to contract terms (can't verify on-time or late payment)

### Structural Markers

**AR aging schedule**:
1. Customer name and ID
2. Invoice number, date, original amount
3. Current invoice detail (customer balance, invoice date, due date)
4. Aging buckets: current (0-30 days), 31-60 days, 61-90 days, 91-120 days, 120+ days
5. Reserve flag or dispute flag
6. Top old items detail (customer, invoice #, amount, aging bucket, reason for hold/dispute)
7. Subtotals by aging bucket
8. Total AR and allowance reserve
9. Reserve policy reference and rate applied

**AP aging schedule**:
1. Vendor name and ID
2. Invoice number, date, amount
3. Due date, terms (e.g., Net 30, Net 60, 2/10 Net 30)
4. Aging buckets: current (0-30 days), 31-60 days, 61-90 days, 91+ days
5. Dispute or hold flag
6. Top old items detail (vendor, invoice #, amount, reason for hold, resolution plan)
7. Subtotals by vendor and aging bucket
8. Total AP
9. Key vendor concentration (top 10 vendors, % of AP)

**Working capital bridge**:
1. Prior period AR, AP, inventory balances
2. Adjustments and movements during period
3. Current period balances
4. Days sales outstanding (DSO), days payable outstanding (DPO), days inventory outstanding (DIO)
5. Cash conversion cycle (DSO + DIO - DPO)

### Content Markers

- **Realistic old balances**: Businesses always have some old AR (customer disputes, payment delays); old AP (vendor holds, disputed invoices); old items should have explanation
- **Customer disputes**: Some large invoices should be flagged as "disputed with customer" or "pending credit memo"
- **Unapplied cash**: Some customers may have credits or payments not yet applied to invoices
- **Credit memos**: Returns, discounts, write-offs should appear as negative amounts in aging
- **Retainage** (if project-based): % of invoice amount held by customer pending final sign-off or defect remediation
- **Payer denials** (if provider): Some insurance AR should be flagged as denied and under appeal
- **Seasonal spikes**: AR and AP should spike with seasonal revenue/purchase patterns
- **Payment terms effect on DPO**: If company got better vendor terms, DPO should improve; if paying early for discounts, DPO should decline
- **DSO tied to customer mix**: Enterprise customers typically 45-60 DSO; SMB 30-45 DSO; if mix shifts, DSO changes accordingly

### Cross-Document Ties

| AR/AP Item | Document It Must Match |
|---|---|
| Customer AR total | Financial statements: AR on balance sheet; revenue ledger: customer revenue |
| Customer payment history | Bank deposit records: cash received from customer; cash reconciliation |
| Aging by customer | Revenue detail: customer contract dates, payment terms |
| Allowance reserve | GL: allowance for doubtful accounts account balance; accounting policy: reserve method |
| Vendor AP total | GL: accounts payable balance; AP aging total; PO register |
| Vendor payment history | Check register: payments to vendor; PO and invoice dates; vendor terms |
| Retainage | Project schedule: % retainage, release schedule; contract terms |
| Dispute detail | Customer or vendor communication summary; resolution log |
| Top old items | Sales or purchase detail; customer or vendor exceptions log |

### Industry Signatures

**SaaS**:
- AR aging should be very clean (subscription customers pay upfront or by ACH on recurring schedule); old AR typically <5% of total
- No retainage
- Churn/cancellation customers may have unapplied credits or refund liabilities

**Project/Services**:
- High retainage (10-25% of invoice amount) held by customer until final sign-off or defect remediation
- Invoice detail shows milestones or phases; retainage release tied to completion
- Change orders may create disputed amounts pending customer approval
- Significant older invoices (30-60 days) are normal pending final acceptance

**Retail**:
- AR typically low (mostly credit card or gift card sales, settled next day)
- Vendor AP may be high due to seasonal purchasing ahead of peak season
- Trade discounts (e.g., 2/10 Net 30) appear in AP terms; DPO reflects payment within discount window

**Healthcare/Provider**:
- Patient AR aging should show patient bad debt (30-60+ days unpaid); typical reserve 5-10%
- Insurance AR aging shows payer denials and appeals; large old insurance AR may indicate claim coding issues or payer disputes
- Patient AR and insurance AR segregated and aged separately
- Write-off of patient balances after collection attempts (typically 90-120 days)

**Manufacturing**:
- Significant AR if selling to distributors or large customers on Net 30-60 terms
- AP aging shows supplier payment behavior; bulk purchasing may create seasonal AP spikes
- Inventory position affects working capital; long lead-time items show in PO register but not yet AP

---

## HR and Payroll

### 30-Second Tells

- No bonus or variable compensation (salary-only company)
- No org chart or manager structure (can't see reporting lines)
- No separation of executive vs. rank-and-file compensation (all employees shown with same comp structure)
- No benefits summary (health insurance, retirement, PTO)
- Employee tenure all very recent or all very long (no realistic attrition)
- No licensed roles or certifications (even for medical, legal, or trade companies)
- No union contracts or wage scales (if applicable to industry)
- Comp ladders don't make sense (entry-level engineers earning $200K+, senior ops staff earning $40K)
- No equity or deferred comp (even if company is PE-backed or venture-funded)
- Headcount in payroll doesn't match headcount claimed in financial statements or CIM

### Structural Markers

An HR and payroll package includes:

1. **Org chart**:
   - CEO, reporting lines by function (sales, engineering, operations, finance, HR)
   - Title and reporting manager for each employee
   - FTE vs. PT designation
   - Vacancy indicators (open requisitions)

2. **Employee roster**:
   - Employee ID, first/last name, title, department, location
   - Manager name and ID
   - Hire date, employment status (active, terminated, on leave)
   - Exempt vs. non-exempt classification
   - FT vs. PT status

3. **Compensation detail**:
   - Base salary (annual)
   - Bonus target (% of base or $ amount, or "no bonus")
   - Commission structure (if applicable; % of revenue, account, or quota)
   - Equity grants (shares, vesting schedule, grant date, vesting period)
   - Deferred comp or ESOP (if applicable)

4. **Benefits enrollment**:
   - Health insurance (medical, dental, vision) coverage and employee/employer contribution
   - 401(k) or pension plan and match
   - HSA/FSA enrollment and contribution
   - Life insurance, disability insurance
   - PTO and sick day accrual

5. **Payroll register** (for one recent period):
   - Hours worked (for hourly), or salary (for salaried)
   - Gross pay, payroll taxes (FICA, federal, state, local withholding)
   - Deductions (benefits, retirement, garnishments)
   - Net pay
   - Employer payroll taxes (FICA, unemployment, workers comp)

6. **Headcount summary**:
   - Headcount by function and location
   - Headcount trend (monthly or quarterly)
   - Planned hires and attrition

7. **Commission or bonus detail** (if applicable):
   - Sales rep or bonus-eligible roster
   - Commission plan or bonus plan document
   - Monthly or quarterly commission/bonus payouts
   - Quota and attainment tracking

### Content Markers

- **Comp ladders by function**: Engineering comp should be higher than sales ops; senior should be 1.5-2x entry level within function
- **Realistic spans of control**: Manager to IC ratio 1:3 to 1:8 depending on role
- **Plausible tenure/attrition**: Some employees with 5+ years tenure (senior), some <1 year (new hires); reasonable annual attrition (10-20%)
- **Licensed roles**: If company operates clinics, construction, accounting, etc., comp should reflect licensing and continuing education
- **Equity for key roles**: Founders, C-suite, and key technical/sales staff should have equity; vesting typically 4 years with 1-year cliff
- **Bonus targets**: Reasonable targets by role (e.g., sales 50% of base, executive 100%+ of base)
- **Benefits competitive**: Health insurance, 401(k) match (typically 3-4%), PTO (typically 20-25 days for professionals)
- **Payroll tax accuracy**: FICA is 7.65% of employee, 7.65% employer (totaling 15.3%); federal withholding varies by W-4; state/local varies by jurisdiction

### Cross-Document Ties

| HR/Payroll Item | Document It Must Match |
|---|---|
| Total headcount | CIM or financial statement headcount claim; payroll register employee count |
| Headcount by location | Site master: staff count by site; facility utilization |
| Payroll expense | GL: payroll and benefits expense accounts; monthly expense trend |
| Bonus and commission payouts | Payroll register: bonus/commission line items; comp plan document; sales forecast (for commission) |
| Management team names and titles | CIM: executive summary bios; org chart; cap table (if founders); board of directors list |
| Equity grants and vesting | Cap table: option pool, granted shares, vesting schedule; equity ledger |
| Retirement plan contributions | Benefits summary: 401(k) match rate; GL: employer contribution expense |
| Total compensation by employee | Comp ladder by role; payroll register (salary + bonus + benefits cost) |

### Industry Signatures

**SaaS**:
- Significant equity grants for all levels (option pool typically 10-15% of cap table)
- Sales comp heavily commission-based (base + 50-100% commission)
- Engineering and product comp competitive with tech market (typically highest comp outside sales)
- Bonus targets: corporate 50%, sales 100%+, executive 100-200%

**Construction**:
- Union scale applies (IBEW for electrical, LIUNA for laborers, etc.); union employees represented separately
- Non-union salaried staff (project managers, superintendents, administrative)
- Significant overtime for union hourly staff; overtime multiplier in payroll
- Workers comp insurance cost tied to classification and payroll by classification

**Healthcare/Provider**:
- Licensed providers (MDs, RNs, therapists) with comp based on credentials, board certification, and productivity
- Licensed staff with continuing education requirements and licensing renewal costs
- Malpractice insurance cost by provider or by risk class
- Administrative support staff at lower comp tiers

**Manufacturing**:
- Hourly union or non-union workers on production floor
- Salaried supervisors, planners, quality engineers
- Shift differentials for night/weekend shifts
- Incentive pay for productivity or quality metrics

**Professional Services**:
- Leverage (partner-to-associate ratio) determines profitability
- Billable vs. non-billable (practice development, training, admin)
- Partner and senior staff have significant equity or profit-sharing
- Lockstep or modified lockstep compensation among partners

---

## Leases and Legal Documents

### 30-Second Tells

- No defined terms (start date, end date, monthly rent)
- No exhibits or schedules attached (no site plan, no payment schedule)
- Missing page numbers or no signature block
- Wrong governing law or use description (e.g., office lease for manufacturing facility)
- Dates don't align (lease term ends 2020 but document is from 2024)
- Math doesn't add up (monthly rent × 12 ≠ annual rent shown)
- No signatures from both landlord and tenant
- No amendments or modifications noted (leases are often modified, but amendments missing)
- No notices of lease (in commercial real estate, recorded document)
- Generic template language without customization for actual premises/rent/terms

### Structural Markers

A commercial lease typically includes:

1. **Lease cover and parties**:
   - Lease date (effective date and signature date)
   - Landlord name, address, contact
   - Tenant name (company legal entity), address, contact
   - Broker information (if applicable)

2. **Premises description**:
   - Address, suite number, building/floor
   - Square footage (rentable or usable)
   - Use clause (office, retail, manufacturing, warehouse, etc.)
   - Tenant improvement rights and landlord contribution (if any)

3. **Term and rent**:
   - Commencement date, lease term (months/years)
   - Renewal options and notice period
   - Base rent schedule (monthly amount, escalators if present)
   - Operating expense allocation (NNN triple net vs. gross lease)
   - CAM (common area maintenance) charge or included in rent
   - Rent payment timing and method

4. **Operating expenses and taxes**:
   - Tenant's share of real estate taxes
   - Tenant's share of building insurance
   - Tenant's share of CAM expenses
   - Cap on annual CAM increases (typical: 3-5%)

5. **Default and remedies**:
   - Definition of default (late rent, material breach, etc.)
   - Cure period (e.g., 5 days for rent, 30 days for other breaches)
   - Remedies (late fees, interest, re-entry and re-lease)
   - Attorney's fees and collection costs

6. **Assignment and subletting**:
   - Restrictions on assignment (landlord consent, often "not to be unreasonably withheld")
   - Recapture rights (landlord can reclaim space if subtenant offers better terms)
   - Profit-sharing on subleases (if applicable)

7. **Insurance and indemnity**:
   - Tenant's required insurance (liability, property)
   - Insurance minimums and coverage types
   - Waiver of subrogation
   - Indemnification of landlord

8. **Notices**:
   - Addresses for lease notices (rent payment, lease notices)
   - Notice procedures and timing

9. **Exhibits and schedules**:
   - Floor plan or site plan
   - Rent payment schedule
   - Tenant improvement allowance and terms
   - Lease renewal options
   - Estoppel certificate template

10. **Signatures and acknowledgment**:
    - Landlord signature, date
    - Tenant authorized officer signature, date
    - Notarization (if required)

### Content Markers

- **Coherent escalators**: Annual rent increase typically 2-3% per year; common for longer leases
- **Real legal terms**: Standard commercial lease language; explicit cure periods and default procedures
- **Plausible landlords**: Known landlord entities (real estate firms, institutional investors, owner-operators)
- **Addresses match site master**: Lease address should be verifiable real location
- **Use clause appropriate to industry**: Manufacturing facility should have use clause allowing manufacturing; office use for office building
- **Operating expense cap**: NNN leases should have CAM cap or escalator cap to limit landlord's ability to shift costs
- **Renewal rights documented**: Multi-year leases often include renewal options; renewal rent specified or formula provided
- **Estoppel certificate**: Provides snapshot of lease status at a point in time (important for M&A due diligence)

### Cross-Document Ties

| Lease Item | Document It Must Match |
|---|---|
| Tenant entity name | Corporate formation docs: legal entity name |
| Site address and location | Site master: address, location, opening date; real estate schedule |
| Commencement and expiration date | Real estate schedule: term dates; accounting policy: lease accounting date (ASC 842 ROU asset and liability inception) |
| Base rent and escalators | Rent expense in GL and P&L; rent accrual schedule |
| CAM and operating expense charges | Operating expense accounts in GL; rent roll schedule |
| Landlord name and contact | Real estate broker summary; property manager info |
| Use clause | Site footprint and operations description; facility description in CIM |

### Industry Signatures

**Office**:
- Term: 3-5 years typical for tech/professional services
- Tenant improvement allowance: $15-30 per SF typical
- Escalators: 2-3% annual common
- Use: "General office purposes"

**Retail**:
- Term: 5-10 years typical, with renewal options
- Rent: Base rent + percentage rent (% of sales above threshold)
- Tenant improvement: Landlord may contribute significantly for flagship tenants
- Exclusive use clauses (competitor restrictions)
- Recapture rights common

**Manufacturing/Warehouse**:
- Term: 5-10 years typical
- Rent: Per SF typically lower than office
- CAM: Usually minimal or excluded
- Use: "Manufacturing" or "Warehouse and light manufacturing"
- Equipment anchored to space (no removal without landlord consent)

**Healthcare**:
- Specialized for medical use (clinical, lab, imaging equipment)
- Build-out costs higher (HIPAA compliance, medical-grade HVAC, etc.)
- Longer terms (7-10 years) to amortize buildout
- Landlord may require personal guarantee from provider organization

---

## Tax Returns and Compliance Files

### 30-Second Tells

- No complete return family (only federal 1120 shown, no state or local)
- No schedule of returns (which jurisdictions, which years, filing status)
- No tax notices or correspondence (IRS notices, state tax board notices, audit findings)
- No nexus story (why company operates in certain states, not others)
- No indirect tax exposure narrative (sales tax, payroll tax, property tax)
- No mention of open audit years or examination history
- Jurisdiction footprint doesn't match operations (company has 5 locations but only files federal)
- Tax return numbers don't reconcile to audited financials (no bridging)
- No deferred tax asset or liability calculation
- Return dates don't match fiscal year-end or filing deadlines

### Structural Markers

A complete tax package includes:

1. **Return family overview**:
   - List of all filing requirements: federal (1120, 1120-S, 1065, 1040), state corporate income tax, state franchise tax, local taxes
   - Fiscal year-end date and filing deadline dates
   - Electronic vs. paper filing status
   - Extension status (extended returns) and original deadline vs. extended deadline

2. **Federal income tax returns**:
   - Form 1120 (C-corp), 1120-S (S-corp), or 1065 (partnership) for each year
   - Schedule C (profit/loss) with supporting schedules
   - Schedule M-1 (reconciliation of net income to taxable income)
   - Depreciation schedule (Form 4562)
   - Tax computation and estimated payments

3. **State and local tax returns**:
   - State corporate income tax (form varies by state: CA Form 100, NY Form CT-3, etc.)
   - State franchise tax (if applicable, separate from income tax)
   - City/local income tax (varies by municipality)
   - Return dates and payment history

4. **Sales and use tax filings** (if applicable):
   - Sales tax registration by state
   - Quarterly sales tax returns by state
   - Use tax filings
   - Resale certificate or exemption documentation

5. **Payroll tax filings**:
   - Federal Form 941 (quarterly payroll tax return)
   - Form 940 (annual unemployment tax)
   - State unemployment insurance tax filings
   - Local payroll tax filings (NYC, San Francisco, etc.)
   - W-2 and 1099 reporting

6. **Property tax filings**:
   - Property tax returns or assessment responses by jurisdiction
   - Property tax assessments and values
   - Exemption claims (if applicable: non-profit, agricultural, etc.)

7. **Tax notices and correspondence**:
   - IRS notices: deficiency notices, audit findings, closing letters
   - State tax board notices: proposed adjustments, audit findings
   - Tax appeal documentation (if disputing assessment)
   - Examination history: years audited, adjustments proposed/agreed

8. **Tax provision and uncertain tax position schedule**:
   - Reconciliation of book income to taxable income
   - Deferred tax assets and liabilities
   - Valuation allowances
   - Uncertain tax position schedule (FIN 48/ASC 740)

9. **Tax attributes**:
   - Entity structure (C-corp, S-corp, LLC, partnership, etc.)
   - EIN (Employer Identification Number)
   - Filing status (primary, consolidated, separate return filer)
   - Entity address and managing member/principal officer
   - Ownership information (if relevant to S-corp qualification or consolidated return)

### Content Markers

- **Consistent entity names and EINs**: Same entity name and EIN across all filings (federal, state, payroll)
- **Fiscal year consistency**: All tax returns for same fiscal year-end; consistent reporting period
- **Nexus and apportionment logic**: Multi-state company should show apportionment schedule explaining allocation to each state (typically based on property, payroll, sales percentages)
- **Reconciliation to financials**: Federal taxable income bridges to audited net income; reconciliation explains book/tax differences
- **Deferred tax calculation**: If differences between book and tax, calculate deferred tax asset/liability and valuation allowance
- **Payment history**: Tax payments should correlate to estimated tax or prior-year return tax liability
- **Audit history context**: If company has been audited, notices should show examination periods and adjustments; closing letters should be present
- **Open years summary**: Clearly identify which years are open for examination (typically 3 years or 6 years if material underreporting)

### Cross-Document Ties

| Tax Item | Document It Must Match |
|---|---|
| Federal taxable income | Audited financial statements: net income; reconciliation schedule; GL accounts |
| Depreciation for tax | Fixed asset ledger: cost, useful life, depreciation method; Form 4562 detail |
| State apportionment | Site master or facility list: property and payroll by state; revenue by customer location |
| Payroll tax | Payroll register: gross wages, taxes withheld; Form 941 and 940 detail |
| Sales tax nexus | Facility footprint by state; sales revenue by customer location |
| Property tax | Real estate schedule: property address, assessed value; lease terms |
| EIN and entity structure | Corporate formation docs: entity name, EIN, state of formation, entity type |
| Uncertain tax positions | Accounting policy memo: tax contingencies, uncertain positions |

### Industry Signatures

**SaaS/Software**:
- R&D tax credit (Form 3115 or Form 6765) if spending on software development
- Stock-based compensation book/tax difference (deductible for tax, book expense for GAAP)
- Possible international operations and transfer pricing documentation

**Manufacturing**:
- Domestic production activities deduction (DPAD, reduced under Tax Cuts and Jobs Act)
- Section 179 depreciation or bonus depreciation for equipment
- Inventory accounting method (FIFO/LIFO/weighted) must match GL; LIFO reserves if LIFO used for tax
- Cost of goods sold reconciliation to GL

**Construction**:
- Look-back interest calculation if using percentage-of-completion method (Section 460)
- Home construction contractor status and related tax treatments
- Subcontractor 1099 issuance and withholding

**Healthcare/Provider**:
- Entity type affects taxation (C-corp, S-corp, or non-profit); non-profit exempt-organization filing (Form 990)
- Medicare provider number and Medicare tax reporting
- Professional service provider joint venture taxation

**International Operations**:
- Foreign Corrupt Practices Act (FCPA) compliance and documentation
- Transfer pricing documentation and Tangible Net Income (TNI) method or comparable uncontrolled price (CUP) method
- Foreign tax credit or foreign income exclusion
- GILTI (Global Intangible Low-Taxed Income) computation if applicable
- Form 5471 or 8938 for controlled foreign corporations or foreign assets

