# Meeting Notes Summary

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:50:47  
**Updated:** 1/8/2026 11:00:05  
**Exported:** 1/8/2026 11:14:19  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd257-3ce4-833d-b074-c486c72eb193](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd257-3ce4-833d-b074-c486c72eb193)  

## Response:
Thought for 1m 2s

FDD Meeting Notes — Online Marketplace Consumer — Take Rate Mechanics, Refunds/Disputes & Revenue Recognition Deep Dive (SIM-0010)
==================================================================================================================================

*   Date: Not specified in transcript
*   Deal Context:
    *   Target: Online marketplace (consumer)
    *   Industry: Online marketplace / eCommerce
    *   Describe the purpose of the meeting in 1-2 sentences. Deep dive for the QoE workstream focused on take rate mechanics, refunds/disputes, and how GMV ties to net revenue / revenue recognition.
    *   Participants: CFO, Controller, Head of Trust & Safety, External Advisors, QoE/FDD consultants
    *   Transcript:

Attendees & Roles
-----------------

*   CFO
*   Controller
*   Head of Trust & Safety
*   Consultant
*   External Advisor

* * *

Systems, Data Flow & Ownership
------------------------------

### Key Takeaways

*   Reliance on multiple systems plus spreadsheets for “edge cases” increases risk of definitional drift across KPIs (take rate, refunds) and makes GMV→net revenue reconciliation harder to audit.
*   The inability to point to a single “monthly package” that ties GMV to net revenue suggests higher diligence effort to validate revenue recognition mechanics and KPI reporting consistency.

### Meeting Notes

**Systems used for reporting and accounting**

*   Take rate mechanics, refunds/disputes, and revenue recognition are managed by the team, with data flowing through multiple systems.
*   The primary operating environment is the ERP, supported by a billing platform and spreadsheets used for edge cases.

**Reconciliation approach**

*   A tie-out from GMV to net revenue can be done, but it is not delivered as a single standard monthly package; instead, multiple reports are “stitched together.”

### 💡 Insights

*   Multi-system KPI reporting (ERP + billing + spreadsheets) may increase the likelihood of inconsistent KPI definitions between functions (finance vs trust & safety), especially for “net of” items (coupons, fees, refunds).
*   A repeatable, documented GMV→net revenue bridge is often a key control artifact for marketplace diligence; missing standardization can be a red flag for revenue recognition validation and audit readiness.

* * *

GMV & Core KPIs (FY2025 YTD / Q3 2025)
--------------------------------------

### Key Takeaways

*   Reported FY2025 YTD GMV (**$482M** through Sep) provides a scale anchor for validating take rate math, promo funding, and refund leakage across systems.
*   KPI reporting shows definitional differences (e.g., refunds as % of GMV, disputes as % of orders), which need to be normalized before using KPIs in any QoE bridge or model assumptions.

### Meeting Notes

**GMV**

*   FY2025 YTD GMV (through Sep): **$482M**.

**Refunds and disputes headline rates (Q3 2025)**

*   Refund rate (Q3 2025): **3.6%** (refunds as % of GMV), per the Trust & Safety reporting cut.
*   Dispute rate (Q3 2025): **0.9%** (disputes as % of orders).

**Reporting source**

*   Refund and dispute rates are pulled from the standard month-end package, with an offer to provide the exact tab used.

### 💡 Insights

*   Using different denominators (GMV vs orders) across “loss” metrics can obscure true unit economics; diligence often benefits from normalizing to both GMV and orders for comparability.
*   Refunds/disputes are frequently an area where “gross vs net” definitions (and timing cutoffs) can materially change reported rates; consistent definitions are important to avoid double counting between contra-revenue and operating costs.

* * *

Take Rate Mechanics & Definitions
---------------------------------

### Key Takeaways

*   A material definitional reconciliation is required: take rate is cited as **12.4%** vs **11.8%** for the same FY2025 YTD period, implying different “netting” treatments (e.g., payment fees, coupons, or other adjustments).
*   Until the take rate definition is locked (gross vs net of fees/coupons), it is risky to rely on take rate for revenue validation or forward forecasts.

### Meeting Notes

**Reported take rate**

*   Take rate for FY2025 YTD: **12.4%**, described as net of coupons in one cut.
*   A second cut for FY2025 YTD take rate was cited at **11.8%**, requiring reconciliation.

**Definition nuances raised**

*   The discrepancy was explicitly tied to “gross take vs net of payment fees,” and the team indicated a need to confirm the exact definition offline.

**Timing / cadence**

*   Certain metrics appear to be tracked reliably at month-end; weekly views were characterized as directional rather than control-grade.

### 💡 Insights

*   Marketplace take rate often has multiple valid “definitions” (gross take, net take after payment processing, net take after coupons, net take after refunds); diligence typically requires a single canonical definition aligned to revenue recognition.
*   A ~50–70 bps spread between two “take rate” figures can be explained by payment fees (or coupon netting), but it must be evidenced with a bridge to avoid embedding a definitional error in QoE.

* * *

Refunds, Disputes & Reporting Consistency
-----------------------------------------

### Key Takeaways

*   Refund rate for Q3 2025 is inconsistent across internal cuts (**3.6%** vs **4.1%**), suggesting differing measurement bases (order-based vs dollar-based) and/or timing/definition differences.
*   This inconsistency may affect how contra-revenue (refunds) is booked and how operational reporting aligns to the financial statements.

### Meeting Notes

**Refund rate discrepancy (Q3 2025)**

*   Refund rate cited at **3.6%** (refunds as % of GMV) in one cut.
*   A separate cut cited refund rate at **4.1%**.
*   The difference was attributed to “order-based vs dollar-based refunding,” and reconciliation was flagged as an open item.

**Dispute rate**

*   Dispute rate cited at **0.9%** (disputes as % of orders) for Q3 2025.

**Deliverable commitment**

*   A refunds and disputes report for Q3 2025 was committed to be sent by Wednesday.

### 💡 Insights

*   Refund accounting can impact both revenue (contra-revenue) and working capital (timing of cash outflows / settlement timing); clarifying measurement basis is important for both QoE and cash conversion analysis.
*   Disputes/chargebacks can introduce additional fees and loss timing differences; diligence often benefits from separating (i) customer-initiated disputes, (ii) fraud-related disputes, and (iii) merchant-related claims, if tracked.

* * *

Coupons, Promos, Payment Fees & Seller Payout Timing
----------------------------------------------------

### Key Takeaways

*   Promo spend is meaningful in the quarter (**$7.8M** in Q3 2025 funded by the company) and needs to be clearly reflected in the take rate definition (net of coupons vs gross).
*   Payment processing fees (**2.2–2.8%** range) and payout timing (**2–5 business days**, with risk-based holds) are key mechanical drivers that may explain differences between gross and net take and should be included in a GMV→net revenue bridge.

### Meeting Notes

**Coupons / promos**

*   Coupon / promo spend in Q3 2025: **$7.8M**, funded by the company.
*   Coupon depth in Q3 2025: **5–20%**, described as campaign dependent.
*   Coupon/promo spend detail for Q3 2025 was committed to be sent by Friday.

**Payment processing fees**

*   Payment processing fees range for 2025: **2.2–2.8%**, described as mix dependent.

**Seller payout timing**

*   Typical seller payout timing for 2025: **2–5 business days**.
*   Risk-based holds vary and can extend timing.

### 💡 Insights

*   Promo funding can be treated as (i) a reduction of revenue/take, (ii) marketing expense, or (iii) a contra item depending on structure; diligence should confirm policy and ensure KPI definitions match financial statement presentation.
*   Variability in seller payout timing and risk holds may create non-trivial payable/clearing balances; these often matter for Net Debt vs Working Capital classification under SPA definitions.

* * *

Controls, Approvals & Metric Governance
---------------------------------------

### Key Takeaways

*   KPI governance and controls appear partially manual (manager sign-off followed by finance review), and multiple comments indicate definitional ambiguity (“messy”), increasing diligence focus on documentation and repeatable reconciliations.
*   Fiscal vs calendar mapping is available, but the reporting basis should be explicitly stated in all KPI schedules to avoid period misalignment.

### Meeting Notes

**Controls**

*   Approval/control described as manual: manager signs off, then finance reviews.

**Cadence**

*   Metrics described as primarily tracked monthly; weekly reporting is considered directional.

**Calendar basis**

*   Reporting basis described as fiscal, with an ability to map to calendar if needed.

**Definition ambiguity**

*   Multiple references indicate some metric definitions are “messy” and require offline confirmation and a follow-up schedule to document exact definitions (including “gross vs net of adjustments”).

### 💡 Insights

*   Manual approvals are common in smaller finance teams, but diligence typically expects a documented KPI data dictionary and a repeatable close package for revenue-critical metrics (take rate, refunds).
*   A clear mapping of fiscal/calendar periods is important for aligning diligence schedules to external reporting, lender models, and any SPA-defined measurement periods.

* * *

Fraud Monitoring (Trust & Safety)
---------------------------------

### Key Takeaways

*   Fraud prevention metrics exist but were described as directional with limited confidence in model outputs, which may constrain the ability to rely on automated estimates in diligence without underlying evidence.
*   A fraud monitoring summary was explicitly requested, indicating this is a diligence focus area (potentially tied to disputes, refunds, and chargebacks).

### Meeting Notes

**Fraud quantification**

*   Fraud prevention is tracked internally, but model output confidence was described as directional and not something to overstate.
*   A follow-up was captured to provide a fraud monitoring summary.

**Deliverable commitment**

*   Fraud monitoring summary was committed to be sent by Friday.

### 💡 Insights

*   If fraud models drive risk holds and payout timing, they can influence both customer experience KPIs and balance sheet clearing accounts; diligence often asks for policy thresholds and override rates.
*   A sustained increase in fraud losses (or dispute rates) can be an early indicator of adverse selection or weakening controls; trend data (even if directional) is typically useful for assessing stability.

* * *

Key Findings
------------

### Figures

| Category | Item | Value | Period/Context |
| --- | --- | --- | --- |
| Volume | GMV | **$482M** | FY2025 YTD (through Sep) |
| Revenue / Take | Take rate | **12.4%** | FY2025 YTD; one cut described as net of coupons |
| Revenue / Take | Take rate (alternate cut) | **11.8%** | FY2025 YTD; flagged for reconciliation |
| Refunds | Refund rate | **3.6%** | Q3 2025; refunds as % of GMV (one cut) |
| Refunds | Refund rate (alternate cut) | **4.1%** | Q3 2025; flagged for reconciliation |
| Disputes | Dispute rate | **0.9%** | Q3 2025; disputes as % of orders |
| Promos | Coupon / promo spend | **$7.8M** | Q3 2025; funded by company |
| Payments | Payment processing fees | **2.2–2.8%** | 2025; mix dependent |
| Payouts | Seller payout timing | **2–5 business days** | 2025; risk-based holds vary |
| Promos | Coupon depth | **5–20%** | Q3 2025; campaign dependent |

### Potential Adjustments

| Ref | Item | Category | Type | Brief Rationale |
| --- | --- | --- | --- | --- |
| **QoE1** | Take rate / net revenue definition reconciliation | EBITDA | Normalize | Conflicting FY2025 YTD take rate (**12.4%** vs **11.8%**) suggests inconsistent netting (fees/coupons/adjustments) that could affect net revenue validation. |
| **QoE2** | Refund rate definition alignment (order vs dollar basis) | EBITDA | Normalize | Conflicting Q3 2025 refund rates (**3.6%** vs **4.1%**) may reflect definitional differences that impact contra-revenue and KPI-to-FS tie-outs. |

### Risks

*   🟡 **KPI definition inconsistency across teams/systems** — Conflicting take rate and refund rate figures indicate potential definitional drift (gross vs net; order vs dollar basis), raising risk in using KPIs for revenue validation without a documented bridge.
*   🟡 **GMV→net revenue reconciliation not packaged as a single standard report** — Multiple stitched reports can increase error risk and diligence time to validate revenue recognition mechanics.
*   🟡 **Fraud metrics characterized as directional** — Limited confidence in model outputs may reduce reliance on automated fraud prevention KPIs without supporting evidence schedules.

### Contradictions / Gaps

*   Take rate for FY2025 YTD cited as **12.4%** and **11.8%** with different implied definitions; reconciliation pending.
*   Refund rate for Q3 2025 cited as **3.6%** and **4.1%** with different implied bases; reconciliation pending.
*   “Metric” definitions referenced as “messy” (gross vs net of adjustments) without a clearly identified metric name in the transcript; definition schedule pending.
*   Monthly GMV→net revenue tie-out exists but is not delivered as a single standard monthly package; sample month reconciliation pending.

* * *

Open Items & Follow-Ups
-----------------------

| Priority | Item |
| --- | --- |
| **\[H\]** | Reconcile FY2025 YTD take rate (**12.4%** vs **11.8%**) and provide the formal definition (gross vs net of fees/coupons/other adjustments) — Due: Friday |
| **\[H\]** | Provide GMV by month (Jan–Sep 2025) — Due: Friday |
| **\[H\]** | Provide refunds and disputes report (Q3 2025) — Due: Wednesday |
| **\[H\]** | Provide GMV→net revenue reconciliation (sample month) and document the reports used in the “stitched” tie-out — Due: next Tuesday |
| **\[M\]** | Reconcile Q3 2025 refund rate discrepancy (**3.6%** vs **4.1%**) and confirm measurement basis (order-based vs dollar-based) and booking treatment (contra-revenue vs other) — Due: With Q3 report delivery (Wednesday) |
| **\[M\]** | Provide coupon/promo spend detail supporting **$7.8M** (Q3 2025) and confirm how promo funding is reflected in take rate/net revenue — Due: Friday |
| **\[M\]** | Provide fraud monitoring summary and any available quantified view of “fraud prevented vs what gets through,” noting that model outputs are directional — Due: Friday |
| **\[L\]** | Confirm fiscal-to-calendar mapping approach for KPI schedules if calendar-basis reporting is required for diligence deliverables — Due: TBD |

📝 Generate Draft Adjustments Memo?

## Response:
Thought for 21s

Thought for 2m 20s

Thought for 1m 17s

Draft Adjustments Memo
======================

EBITDA Adjustments (Diligence)
------------------------------

**QoE1: Take rate definition reconciliation (gross vs net of payment fees / coupons)**

Two internally reported FY2025 YTD take rate figures (**12.4%** vs **11.8%**) were cited with different implied definitions (net of coupons; gross take vs net of payment fees). This creates risk that KPI take rate math (and any GMV→net revenue bridge) is not consistently defined, which can flow through to reported net revenue and related diligence analyses.

*   "So, uh, 12.4 % for FY2025 YTD. Net of coupons." — Controller
*   "I have 12.4 % in my file. Gross take vs net of payment fees." — Controller
*   "So, i might be looking at a different cut—I've got 11.8 %." — CFO
*   "Honestly it's messy; we should take it offline and send the exact definition. Let me confirm and circle back." — External Advisor

**Request:** Documented take rate definition(s) and a bridge showing FY2025 YTD (and monthly Jan–Sep 2025) GMV → gross take → net take (payment fees, coupons/promos, refunds/credits, disputes/chargebacks as applicable) → recorded net revenue in the financials, including the source reports used.

**Setup:**

*   Revenue (Marketplace take / net revenue) — True-up (+/−) to EBITDA based on variance between recorded revenue and revenue recalculated under the documented policy/definition.
*   Pull the underlying schedules for: GMV, gross fees, coupons/promos, payment processing fees, refunds/credits, disputes/chargebacks, and any other “netting” items included/excluded in each take rate cut.
*   Recompute take rate under a single agreed definition and reconcile the difference between the **12.4%** and **11.8%** cuts to specific components (e.g., payment fees vs coupons).
*   Tie the recomputed net revenue to the GL (monthly) and quantify any required revenue true-up driven by definitional mismatch or mapping gaps.

* * *

**QoE2: Refund rate definition alignment (order-based vs dollar-based; KPI-to-financial tie-out)**

Q3 2025 refund rate was cited as **3.6%** and **4.1%** in different internal cuts, with the discrepancy attributed to order-based vs dollar-based refunding. This inconsistency increases the risk of misinterpretation (and potential misstatement) of contra-revenue/refund presentation and complicates KPI-to-financial statement tie-outs.

*   "3.6 % for Q3 2025. Refunds as % of GMV." — Head of Trust & Safety
*   "Just to confirm, for Refund rate in Q3 2025, is it 3.6 or 4.1?" — Consultant
*   "I have 3.6 % in my file. Order-based vs dollar-based refunding." — Head of Trust & Safety
*   "I might be looking at a different cut—I've got 4.1 %." — Controller

**Request:** Q3 2025 refund/dispute reporting package(s) showing (i) refund $ amount, (ii) refund order count, (iii) the denominators used (GMV $, orders), and (iv) how refunds/credits are recorded in the GL (contra-revenue vs other line), including any timing/cutoff policies.

**Setup:**

*   Revenue (Contra-revenue / refunds & credits) — True-up (+/−) to EBITDA if recorded contra-revenue does not reflect the appropriate basis/timing under the documented policy.
*   Pull refund and dispute/chargeback detail for Q3 2025 (transaction-level if available), including refund amount, order ID, reason, and date of refund authorization vs settlement.
*   Reconcile the **3.6%** vs **4.1%** rates by explicitly calculating refund % on both bases (dollar-based and order-based) and documenting the agreed KPI definition.
*   Tie total refund dollars (and any chargeback/dispute losses, if applicable) to GL accounts and quantify any true-up required due to mapping, cutoff, or classification differences.

* * *

EBITDA Adjustments (Pro Forma)
------------------------------

No pro forma EBITDA adjustments were specifically supported by this transcript (items discussed were primarily definitional/reconciliation topics requiring data to quantify and confirm accounting treatment).

* * *

Net Debt Adjustments
--------------------

**ND1: Settlement-related balances (seller payout timing, risk holds, processor reserves) — classification and reconciliation**

Seller payout timing (**2–5 business days**) and risk-based holds indicate that settlement/clearing balances may be material and could affect Net Debt classification at close (e.g., processor reserves/restricted cash, seller payable/customer funds payable, or other settlement liabilities). Additionally, reliance on multiple systems plus spreadsheets for edge cases increases the need to reconcile these balances to underlying reports.

*   "2–5 business days for 2025. Risk-based holds vary." — Controller
*   "We live mostly in ERP, and then we have a billing platform plus spreadsheets for the edge cases." — Controller

**Request:** Month-end balance sheet detail (Jan–Sep 2025 and latest month) for all settlement/clearing, processor reserve, and seller payable / customer funds payable accounts; plus the subledger/reports used to reconcile (including any spreadsheet “edge case” support).

**Setup:**

*   Net Debt (Settlement/clearing liabilities; restricted cash/processor reserves) — +/− to Net Debt depending on SPA definitions and classification (e.g., restricted cash as debt-like; seller payable/customer funds payable as debt-like vs NWC).
*   Identify all relevant GL accounts (processor clearing, reserves, holdbacks, seller payables, refund liabilities, chargeback reserves if any) and obtain month-end rollforwards.
*   Reconcile each account to the payment processor/billing platform reports and document any reconciling items driven by timing (payout lag, holds, refunds in flight).
*   Classify each balance as Net Debt vs Working Capital per the transaction definitions and quantify any reclass adjustments required at the reference date.

* * *

Working Capital Adjustments
---------------------------

No working capital peg adjustments were specifically evidenced in this transcript beyond the need to evaluate settlement-related balances (captured under **ND1**) for potential Working Capital vs Net Debt classification.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)