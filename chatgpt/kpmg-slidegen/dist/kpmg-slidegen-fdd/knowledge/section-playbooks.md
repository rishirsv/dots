# Slide Writing Playbooks (Templated)

This file is the execution playbook for writing standard FDD slide types.
Use these templates directly when drafting or rewriting large sections.

## How To Use This File
For each slide:
1. Pick the matching playbook by intent.
2. Fill required inputs first.
3. Select the recommended layout.
4. Draft title and strapline from templates.
5. Draft bullets using the bullet templates.
6. Run the rewrite checklist at the end of the playbook.

---

## 1) Business Overview
### Objective
Summarize what the business does, how it makes money, how large it is, and why that matters for the transaction.

### Required Inputs
- company description
- revenue by period
- revenue mix (recurring vs non-recurring)
- customer concentration
- footprint/headcount
- one or more risk drivers

### Recommended Layout
- primary: `layout.fdd_two_column_bullets`
- alternate: `layout.fdd_one_column_narrative`

### Title Templates
- `Business Overview`
- `Business Overview and Revenue Quality`
- `Business Overview and Diligence Context`

### Strapline Templates
- `Company profile, revenue mix, and concentration context through <period>.`
- `Operating model, scale metrics, and key diligence considerations.`

### Bullet Templates
Left column (context/evidence):
- `<Company> provides <services/products> to <customer base> across <footprint>.`
- `Revenue increased from <value, period A> to <value, period B>, driven by <driver>.`
- `Recurring revenue represented <percent> in <period>; non-recurring components represented <percent>.`
- `Top <N> customers represented <percent>; largest customer represented <percent>.`

Right column (implications):
- `Current growth profile appears <volume-led/pricing-led/mixed>; this implies <diligence implication>.`
- `Revenue mix supports/pressures earnings durability because <reason>.`
- `Concentration profile is <low/moderate/high> and should be tested through <specific sensitivity>.`
- `Transaction focus should include <specific actions or protections>.`

### Rewrite Checklist
- Are all major scale claims period-anchored?
- Is recurring vs non-recurring quality explicit?
- Are implications specific to transaction decisions?

---

## 2) Key Findings (Financial)
### Objective
Present headline financial conclusions with evidence and decision relevance.

### Required Inputs
- topline trend
- EBITDA trend
- margin trend
- cash conversion
- key driver and key risk

### Recommended Layout
- primary: `layout.fdd_chart_left_content_right`
- alternate: `layout.fdd_table_left_content_right`

### Title Templates
- `Key Findings - Financial`
- `Key Findings - Financial Performance`

### Strapline Templates
- `Reported performance is <summary conclusion>; key quality considerations are <risk themes>.`

### Bullet Templates
- `Revenue increased from <A> to <B> in <period range>, equivalent to <growth metric>.`
- `Reported EBITDA moved from <A> to <B>; margin changed from <A%> to <B%>.`
- `<Metric> changed from <A> to <B> due to <driver>.`
- `Cash conversion changed from <A%> to <B%>, reflecting <working capital or accounting driver>.`
- `Primary conclusion: <one sentence conclusion with direction>.`
- `Transaction implication: <valuation/covenant/debt sizing implication>.`

### Rewrite Checklist
- Are there at least two numeric anchors beyond chart labels?
- Is there a clear headline conclusion?
- Is one downside sensitivity explicitly stated?

---

## 3) Profit and Loss Overview
### Objective
Translate reported P&L line movement into quality and sustainability interpretation.

### Required Inputs
- table of core P&L lines by period
- margin and cash conversion metrics
- notable cost line changes
- accounting/policy caveats if any

### Recommended Layout
- primary: `layout.fdd_table_left_content_right`

### Title Templates
- `Profit & Loss Overview`
- `Profit & Loss Overview - Reported Trend`

### Strapline Templates
- `Reported P&L trend used as baseline for QoE normalization and valuation analysis.`

### Bullet Templates
- `Revenue increased from <A> to <B>, primarily due to <driver>.`
- `Gross margin moved from <A%> to <B%> due to <mix/cost/pricing explanation>.`
- `<Cost line> increased by <value/%> driven by <driver>.`
- `EBITDA margin of <value> in <period> reflects <quality statement>.`
- `Cash conversion of <value> indicates <working capital implication>.`
- `Normalization watch item: <item> may affect sustainable earnings by <direction/size if known>.`

### Rewrite Checklist
- Do bullets interpret the table rather than restate headers?
- Are outliers explained?
- Is at least one normalization watch item included?

---

## 4) QoE Adjustments
### Objective
Bridge reported earnings to normalized earnings and clearly explain adjustment support status.

### Required Inputs
- reported EBITDA
- adjustment list (name, amount, recurring/non-recurring view)
- normalized EBITDA
- support status by adjustment
- unresolved/open items

### Recommended Layout
- primary: `layout.fdd_chart_left_content_right`
- alternate: `layout.fdd_table_left_content_right`

### Title Templates
- `QoE Bridge - Reported to Normalized EBITDA`
- `Quality of Earnings - Reported to Normalized`
- `QoE Adjustments - Summary`

### Strapline Templates
- `Preliminary bridge from reported EBITDA to normalized run-rate EBITDA based on identified adjustments.`

### Bullet Templates
- `Reported EBITDA of <value> in <period> adjusts to normalized EBITDA of <value>.`
- `<Adjustment name> of <value> is treated as <non-recurring/recurring> because <rationale>.`
- `Support status: <supported/pending>, with remaining tie-out to <source documents>.`
- `Open item: <item> may offset/add to normalized EBITDA by <direction/size if known>.`
- `Adjusted EBITDA margin changes from <A%> to <B%> under the current bridge.`
- `Transaction implication: valuation should use <base case/range> until <support condition> is met.`

### Rewrite Checklist
- Is every adjustment explained with rationale?
- Is support status explicit for high-impact adjustments?
- Is there at least one caution statement about unresolved items?

---

## 5) Net Working Capital Overview
### Objective
Explain NWC movement and translate it into peg/deal mechanics implications.

### Required Inputs
- NWC trend by period
- AR/AP/inventory or contract asset/liability metrics
- DSO/DPO or equivalent days metrics
- preliminary peg view
- cut-off/seasonality considerations

### Recommended Layout
- primary: `layout.fdd_chart_left_content_right`
- alternate: `layout.fdd_table_left_content_right`

### Title Templates
- `Net Working Capital - Overview`
- `Net Working Capital and Peg Implications`

### Strapline Templates
- `Adjusted working-capital profile indicates <peg conclusion> versus current SPA assumptions.`

### Bullet Templates
- `Average NWC moved from <A> to <B> over <period range>.`
- `<Driver metric> changed from <A> to <B>, primarily due to <driver>.`
- `<Offsetting metric> changed from <A> to <B>, partially offsetting <primary driver>.`
- `Preliminary peg estimate of <range/value> is <above/below> current SPA reference.`
- `Key diligence requirement: <cut-off, aging, disputed balances, seasonality testing>.`
- `Deal mechanics implication: peg should be based on <methodology>.`

### Rewrite Checklist
- Is peg conclusion explicit?
- Are structural vs timing effects distinguished?
- Is a concrete diligence ask included?

---

## 6) Payroll Appendix Commentary
### Objective
Provide strong interpretation even when the final payroll exhibit is still a placeholder.

### Required Inputs
- payroll totals by period
- compensation mix
- FTE and cost-per-FTE trends
- overtime/contractor trends
- exact placeholder token

### Recommended Layout
- primary: `layout.fdd_table_left_content_right`

### Title Templates
- `Personnel Analysis - Appendix Commentary`
- `Payroll Analysis - Appendix Commentary`

### Strapline Templates
- `Compensation trend interpretation, exhibit handoff expectations, and diligence focus areas.`

### Bullet Templates
Left side:
- `<PLACEHOLDER TOKEN EXACTLY>`
- `Exhibit handoff: replace with final payroll bridge tied to <systems/sources>.`
- `Required support: <specific files and tie-outs>.`

Right side:
- `Total compensation moved from <A> to <B>; average cost per FTE moved from <A> to <B>.`
- `Base salary represented <percent>; variable components represented <percent>.`
- `Overtime/contractor trend indicates <operational implication>.`
- `Potential normalization item: <item> with likely effect <direction>.`
- `Follow-up required: <specific test or reconciliation>.`

### Rewrite Checklist
- Is placeholder token preserved exactly?
- Does commentary remain decision-useful without the exhibit?
- Are required follow-up artifacts explicitly listed?

---

## 7) Financial Reporting Environment
### Objective
Assess finance process maturity and reporting risk in transaction context.

### Required Inputs
- close timeline
- manual journal statistics
- reconciliation/process observations
- known control/process gaps
- recommended improvements

### Recommended Layout
- primary: `layout.fdd_two_column_bullets`
- alternate: `layout.fdd_one_column_narrative`

### Title Templates
- `Financial Reporting Environment`
- `Financial Reporting Environment - Process Risk Assessment`

### Strapline Templates
- `Process observations based on management walkthroughs; no controls testing or audit procedures performed.`

### Bullet Templates
Left (observations):
- `Month-end close is completed in <time>, with <process note>.`
- `Manual journals represented <percent> of quarter-end entries, concentrated in <areas>.`
- `<Process inconsistency> exists in <entities/functions>.`

Right (implications/actions):
- `Reporting risk implication: <specific risk and effect>.`
- `Priority remediation: <specific process/control action>.`
- `Transaction relevance: <how this affects diligence confidence, covenants, or post-close plan>.`

### Rewrite Checklist
- Are observations evidence-based rather than generic?
- Are remediation actions concrete?
- Is transaction relevance explicit?

---

## 8) Generic Rewrite Macro for Large Sections
Use when rewriting multiple slides from raw notes.

1. Extract all numeric facts and period anchors into a fact list.
2. Group facts by slide intent.
3. For each slide, draft bullets in this order:
   - baseline observation
   - quantified movement
   - driver explanation
   - implication
   - risk/open item
   - next-step ask
4. Remove duplicated bullets across adjacent slides.
5. Shorten titles that wrap awkwardly.
6. Re-check placeholders for exact token fidelity.
