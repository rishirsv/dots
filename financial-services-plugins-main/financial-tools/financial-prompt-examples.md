# Financial Prompts 

---

## TIER 1: QUICK WINS (5–15 minutes) — Monthly P&L from Raw Data

Context: You have a CSV export from your accounting system, bank, or expense management tool with transactions that need to be turned into a proper P&L statement.

### Step 1 — Data Cleaning
I have raw transaction data with these columns: [list your columns — e.g., Date, Description, Amount, Vendor]. Please:

1. Create a clean data table starting in cell A1
2. Ensure dates are formatted as proper dates (MM/DD/YYYY)
3. Ensure amounts are formatted as currency (no text, properly negative for expenses)
4. Remove any duplicate transactions
5. Add a column for "Month" that extracts the month from the date (format as "MMM-YY")
6. Flag any rows with missing critical data (date, amount, or description) in a "Data Quality" column

Return the cleaned data in a new sheet called "Clean_Data".

### Step 2 — Expense Categorization
Using the Clean_Data sheet, create a new column called "Category" and categorize each transaction into these standard P&L categories:

- Revenue categories: Product Revenue, Service Revenue, Other Revenue
- COGS categories: Cost of Goods Sold, Direct Labor, Fulfillment Costs
- Operating Expense categories: Salaries & Wages, Marketing, Sales, R&D, General & Administrative, Rent, Software & Subscriptions, Professional Services, Travel & Entertainment, Office Expenses, Other Expenses

Use the Description and Vendor fields to intelligently categorize. For example:
- Payroll processors (Gusto, ADP) → Salaries & Wages
- AWS, Google Cloud, hosting → Software & Subscriptions
- Landlord payments → Rent
- Customer payments → Product Revenue or Service Revenue

If you're uncertain about a transaction, mark it as "Needs Review" and add a note explaining why it's ambiguous.

### Step 3 — Monthly P&L Structure
Create a new sheet called "P&L" with a proper income statement structure:

Row structure:
- Header row with months across columns (current month and prior 11 months for rolling 12‑month view)
- Revenue section with subtotals
- Gross Profit line (Revenue − COGS)
- Operating Expenses section with subtotals
- Operating Income line (Gross Profit − Operating Expenses)
- Net Income line

For each category, use SUMIFS to pull amounts from Clean_Data where:
- Category matches the row category
- Month matches the column month

Format with:
- Bold headers and subtotal rows
- Currency formatting with $ symbols
- Indentation for subcategories (using spaces before category names)
- Border lines above subtotals
- Different background shading for subtotal rows

### Step 4 — Add Budget Variance
Add columns next to each actual month for:

1. Budget (I'll provide budget assumptions separately, or you can create a Budget Assumptions sheet where I can input targets)
2. Variance ($) — calculated as Actual minus Budget
3. Variance (%) — calculated as (Actual − Budget) / Budget

Add conditional formatting:
- Favorable variances in green (revenue higher than budget, expenses lower than budget)
- Unfavorable variances in red (revenue lower than budget, expenses higher than budget)
- Apply to both $ and % variance columns

Important: Remember that for revenue, Actual > Budget is good (green), but for expenses, Actual < Budget is good (green). Apply the logic correctly.

### Step 5 — Validation
Add a validation section at the bottom of the P&L sheet that checks:

1. Do revenue totals match the sum of revenue categories in Clean_Data? (show the difference if any)
2. Do COGS totals match? (show difference)
3. Do Operating Expense totals match? (show difference)
4. Are there any transactions still marked "Needs Review" in Clean_Data? (show count)
5. Are all months in the Clean_Data sheet represented in the P&L? (list any missing)

Display this as a simple checklist with ✓ or ✗ indicators.

Expected Outcome: A complete monthly P&L with 12 months of history and budget variance.

---

## Board Deck Financial Package

Context: You need a comprehensive financial package for board meetings or investor updates, combining multiple financial views into one cohesive presentation.

### Step 1 — Revenue Trends with Growth
Create a "Revenue Analysis" sheet with comprehensive revenue tracking:

MAIN TABLE:
- Rows: Last 12 months plus current month (13 months total)
- Columns:
  - Month
  - Product Revenue
  - Service Revenue
  - Other Revenue
  - Total Revenue
  - MoM Growth ($) — dollar change from prior month
  - MoM Growth (%) — percentage change from prior month
  - YoY Growth ($) — compared to same month last year if available
  - YoY Growth (%) — percentage compared to same month last year

CALCULATED METRICS SECTION:
- TTM Revenue (trailing twelve months total)
- Average Monthly Revenue (TTM / 12)
- Revenue Run Rate (most recent month × 12)
- 3‑Month Average (average of last 3 months)
- Revenue CAGR (if we have 12+ months of history)

GROWTH ANALYSIS — calculate and display:
- Highest growth month (which month, what %)
- Lowest growth month
- Average monthly growth rate
- Quarters with acceleration vs. deceleration

### Step 4 — Department Spend Breakdown
Create a "Department Spend" analysis sheet:

MAIN TABLE:
- Rows: Each department (Engineering, Product, Sales, Marketing, CS, G&A)
- Columns:
  - Headcount (from headcount model or manual input)
  - Payroll & Benefits (fully‑loaded cost)
  - Contractors & Freelance
  - Software & Tools
  - Travel & Events
  - Office & Facilities (allocated by headcount %)
  - Other Expenses
  - Total Department Cost
  - Cost per Employee (Total / Headcount)
  - % of Total Company OpEx

SPEND ANALYSIS — calculate these views:
1. By Category (not department):
   - Show what % of total spend goes to: Personnel (salaries, benefits, payroll taxes), Technology (software, cloud, tools), Facilities (rent, utilities, office), Go‑to‑Market (marketing, sales expenses, travel), Professional Services (legal, accounting, consulting), Other
2. By Time Period:
   - Show each department's spend for: This month, This quarter, This year (YTD), Projected full year

### Step 5 — Format Everything Board‑Ready
Create a final "Board Summary" sheet that consolidates everything into a printable/exportable format:

PAGE 1: Executive Summary
- Company name and date (large header)
- Key highlights (3–4 bullet points on company progress)
- Critical metrics (6–8 numbers in large, bold format):
  * ARR/Revenue
  * Growth rate
  * Customer count
  * Runway (months)
  * Burn rate
  * Key efficiency metric (burn multiple or Rule of 40)

PAGE 2: Financial Performance
- Revenue trend chart (12 months)
- Key metrics table (current vs. prior quarter)
- Notable achievements or challenges (2–3 bullets)

PAGE 3: Cash & Runway
- Current cash position (big number)
- Runway calculation and projection
- Cash flow bridge (beginning → inflows → outflows → ending)
- Upcoming funding needs or milestones

PAGE 4: Department & Efficiency
- Department spend breakdown (table or chart)
- Unit economics summary
- Headcount summary by function

FORMATTING SPECIFICATIONS
- Use a professional color scheme (blues/grays, avoid too many colors)
- Include company logo if available (placeholder for now)
- Set print area to fit each page on 8.5×11 or standard slide dimensions
- Remove gridlines for clean presentation look
- Use Calibri or similar professional font, minimum 10pt
- Include data sources and "as of [date]" footers
- Add page numbers

---

## Financial Model Inputs — Segmentation, Seasonality, COGS, Headcount

### Customer Segmentation (if applicable)
- Enterprise: % of customers, ARPC, churn rate, growth rate
- Mid‑Market: % of customers, ARPC, churn rate, growth rate
- SMB: % of customers, ARPC, churn rate, growth rate

### Seasonal Patterns
- Monthly revenue distribution (if seasonal)
- Q1: X%, Q2: Y%, Q3: Z%, Q4: W%

### SECTION 2: Cost of Goods Sold (COGS)
For each revenue stream, define:
- COGS as % of revenue OR fixed cost per unit
- Key drivers: hosting costs, payment processing fees, direct labor
- Scaling assumptions: Does COGS % improve with scale?

Example for SaaS:
- Cloud hosting: $X per customer per month, decreases 10% per year with scale
- Payment processing: 2.9% + $0.30 per transaction
- Customer support: $X per customer per month for first 1,000 customers, then economies of scale

### SECTION 3: Headcount Plan
Create detailed hiring plan by department and year:

Engineering:
- Starting headcount: X
- Year 1 hires: +Y (specify quarters: Q1: +2, Q2: +3, etc.)
- Year 2 hires: +Z
- Year 3 hires: +W
- Average salary: $X (with annual increases %)
- Fully‑loaded multiplier: 1.35× (includes benefits, taxes, equipment)

Repeat for each department:
- Product Management
- Sales (split by: Enterprise AEs, Mid‑Market AEs, SDRs, Sales Leadership)
- Marketing (split by: Marketing Leadership, Content, Demand Gen, Product Marketing)
- Customer Success
- Operations
- Finance & Admin
- Executive

For each role category, specify:
- Base salary
- Variable compensation (commission, bonus) as % of base
- Ramp time (months until fully productive)
- Quota/target (for sales roles)

---

End of transcribed prompts.

