# Meeting Notes Summary

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:50:18  
**Updated:** 1/8/2026 10:59:04  
**Exported:** 1/8/2026 11:14:13  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd239-9bac-833c-8e27-abc78dc9d840](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd239-9bac-833c-8e27-abc78dc9d840)  

## Response:
Thought for 38s

FDD Meeting Notes — SIM-0002: Churn, NRR, and Cohort Measurement Methodology
============================================================================

*   Date: Not provided in transcript
*   Deal Context:
    *   Target: Not provided in transcript
    *   Industry: Vertical SaaS / B2B subscription (as implied by file name; not otherwise specified)
    *   Purpose: Diligence deep dive for the QoE workstream focused on churn, NRR, and cohort measurement methodology and how metrics are defined, calculated, and controlled.
    *   Participants: CFO, VP RevOps, Controller, Consultant, External Advisor

* * *

Attendees & Roles
-----------------

*   CFO
*   VP RevOps
*   Controller
*   Consultant (FDD / QoE workstream)
*   External Advisor

* * *

Ownership, Systems, and Data Flow
---------------------------------

### Key Takeaways

*   KPI ownership and data lineage appear split across ERP, billing platform, and spreadsheets, which increases reconciliation risk and makes metric “cuts” prone to inconsistency.
*   Reliance on spreadsheets “for the edge cases” may create a control gap for investor-grade churn/NRR reporting unless definitions and source-of-truth reporting are tightened.

### Meeting Notes

**Metric ownership**

*   Churn, NRR, and cohort measurement methodology are owned internally (“owned by the team”), with metrics produced through multiple systems.

**Primary systems used**

*   Metrics are primarily managed in an ERP and a billing platform, with spreadsheets used for edge cases.

### 💡 Insights

*   When SaaS KPIs are produced via multiple sources (ERP + billing + spreadsheets), investors often expect a documented source-of-truth hierarchy and a reconciled “one definition” deck to avoid metric disputes during confirmatory diligence.
*   Spreadsheet “edge cases” may be acceptable operationally, but diligence typically requires controls: change logs, reviewer sign-off, and tie-outs to system reports.

* * *

Headline SaaS KPIs and Definitions Shared on the Call
-----------------------------------------------------

### Key Takeaways

*   Core KPIs were provided with clear numerator/denominator phrasing, but subsequent discussion revealed multiple “cuts” (contracted vs billed; excluding vs including downsells), creating a material risk that KPI trends differ depending on definition.
*   Two KPI discrepancies were explicitly flagged as open items (NRR and gross revenue churn), and reconciliation will be necessary before these metrics can be relied upon in the diligence narrative.

### Meeting Notes

**ARR (Sep 2025 month-end)**

*   ARR was stated as **$46.8M** for Sep 2025 month-end, described as contracted recurring revenue.

**Gross logo churn (TTM Sep 2025)**

*   Gross logo churn was stated as **9.6%** for TTM Sep 2025, defined as logos lost divided by starting logos.

**Gross revenue churn (TTM Sep 2025)**

*   Gross revenue churn was stated as **7.9%** for TTM Sep 2025, defined as ARR lost divided by starting ARR.
*   A separate internal cut was cited as **8.7%**, described as a difference driven by churn “excluding downsells vs including downsells.”
*   The discrepancy was explicitly flagged for reconciliation.

**Net revenue retention (TTM Sep 2025)**

*   NRR was stated as **112%** for TTM Sep 2025, described as including expansion and contraction.
*   A separate internal cut was cited as **109%**, with the difference described as billed ARR vs contracted ARR.
*   The discrepancy was explicitly flagged for reconciliation.

**Expansion ARR (TTM Sep 2025)**

*   Expansion ARR was stated as **$6.4M** for TTM Sep 2025, described as driven by upsells plus seats.

**Cohort NRR (2023 cohort, as of Sep 2025)**

*   Cohort NRR for the 2023 cohort was stated as **118%** as of Sep 2025, attributed to better expansions in 2024–2025.

### 💡 Insights

*   For SaaS diligence, buyers commonly request KPI definitions that are stable across time (same logic for every month) plus a bridge explaining any definition changes; otherwise, “improving NRR” may reflect a reporting shift rather than true performance.
*   “Contracted vs billed” NRR can diverge meaningfully in businesses with mid-term invoicing changes, billing in advance, or usage true-ups; a reconciliation schedule is often expected.

* * *

Contracting, Billing Cadence, and Deferred Revenue Indicators
-------------------------------------------------------------

### Key Takeaways

*   Billing mix (monthly in advance vs annual upfront) and deferred revenue levels provide helpful evidence for cash conversion dynamics, but the transcript indicates reporting sources differ (month-end package vs weekly tracker), which increases the risk of inconsistent balances unless tie-outs are formalized.
*   Month-end cutoff sensitivity was called out as a caveat and may explain some KPI volatility; diligence will likely need a clear close calendar and cutoff policy.

### Meeting Notes

**Average contract term (new logos 2025)**

*   Average contract term for new logos in 2025 was stated as **24 months**, with “most deals” described as 2-year.

**Billing frequency mix (2025)**

*   Monthly billing in advance share was stated as **68%** for 2025, with the remainder described as annual upfront.
*   This figure was referenced as coming from the standard month-end package (specific tab to be provided).

**Deferred revenue balance (Sep 2025 month-end)**

*   Deferred revenue balance was stated as **$9.2M** at Sep 2025 month-end, described as primarily annual upfront.
*   This was referenced as appearing in a weekly tracker and reconciled to the GL at close.

### 💡 Insights

*   For subscription businesses, diligence teams often reconcile deferred revenue movements to billings and recognized revenue to validate both revenue integrity and the billing/collections engine.
*   When a “weekly tracker” is used for deferred revenue monitoring, investors commonly ask for evidence of tie-outs and version control to reduce spreadsheet risk.

* * *

Customer Concentration and Commercial Terms
-------------------------------------------

### Key Takeaways

*   Concentration appears moderate based on the top-10 share and “no single customer >3%,” but diligence will require the underlying top-customer list to validate the concentration claim and trend it over time.
*   Commercial ranges (discounting, implementation timeline, seat expansion) were provided as heuristics/ranges; these are useful directional inputs but not yet substantiated by tagged data (especially expansion driver tagging).

### Meeting Notes

**Customer concentration (Sep 2025 ARR)**

*   Top 10 customers were stated as **19%** of Sep 2025 ARR.
*   It was stated that no single customer represents more than **3%**.

**Discounting (new logos 2025)**

*   Typical discount range for new logos in 2025 was stated as **10–25%**, described as higher for enterprise.

**Implementation timeline (2025)**

*   Implementation timeline range for 2025 was stated as **3–8 weeks**, dependent on integrations.

**Seat expansion (median, first 12 months)**

*   Median seat expansion per customer in the first 12 months was stated as **5–15%**, described as a rule of thumb.

### 💡 Insights

*   In vertical SaaS, “no single customer >3%” is generally viewed as a positive concentration profile, but buyers typically validate with a top-25 schedule and may also assess vertical/segment concentration (not discussed here).
*   If expansion is not tagged by driver (pricing vs usage), it can be harder to underwrite whether NRR is structural (product adoption) or episodic (price actions / one-time seat true-ups).

* * *

Methodology Gaps: ARR-to-Revenue Bridge, Expansion Attribution, and “Cuts”
--------------------------------------------------------------------------

### Key Takeaways

*   The business has an ARR-to-revenue bridge in draft form but does not rely on it operationally, suggesting diligence risk around explaining revenue recognition vs ARR movements without additional cleanup and documentation.
*   Expansion attribution cannot be quantified precisely due to missing reason codes, limiting the ability to underwrite NRR drivers quantitatively.

### Meeting Notes

**ARR movement to GAAP revenue bridge**

*   A bridge tying ARR movement to GAAP revenue by month exists as a draft.
*   The bridge is not relied upon operationally and will be provided after it is cleaned up.

**Expansion attribution (pricing vs usage)**

*   Expansion attributable to pricing versus usage cannot be quantified precisely.
*   Expansion events are not consistently tagged with clean reason codes; only qualitative discussion was offered.

**Definition inconsistencies across cuts**

*   KPI differences were described as arising from definitional cuts (billed ARR vs contracted ARR; churn excluding downsells vs including downsells).
*   Multiple references were made to definitions being “messy” and needing to be taken offline and confirmed with an exact written definition and schedule.

### 💡 Insights

*   A reconciled ARR-to-GAAP revenue bridge is often a key diligence artifact because it helps validate bookings/billings/retention claims against GAAP revenue trends; lack of an operational bridge can slow confirmatory diligence.
*   Reason-code discipline (e.g., “price uplift,” “seat growth,” “module add,” “downgrade,” “churn”) is a common expectation for investor-grade NRR storytelling; absence may prompt deeper customer-level sampling.

* * *

Controls, Cadence, and Cutoffs
------------------------------

### Key Takeaways

*   Controls around KPI reporting were described as manual, and the process was repeatedly characterized as “not perfect” and “messy,” creating diligence risk around repeatability and auditability.
*   Cadence appears primarily monthly, with weekly views described as directional; month-end cutoffs were explicitly cited as a swing factor.

### Meeting Notes

**Cutoff sensitivity**

*   Month-end cutoffs were described as potentially swinging results.

**Approval and review**

*   Approval was described as manual: manager sign-off followed by finance review.

**Cadence**

*   Reporting was described as primarily monthly; weekly reporting was characterized as directional.

**Calendar vs fiscal mapping**

*   Metrics were described as fiscal, with the ability to map to calendar if needed.

**Gross vs net framing**

*   “Gross” vs “net” framing was referenced, with “net would be a little lower” repeated in the discussion; exact metric context was not cleanly captured in the transcript and was repeatedly deferred to an offline definition follow-up.

### 💡 Insights

*   Investors typically expect a lightweight KPI control framework: documented definitions, locked reporting calendar, clear source reports, and reviewer sign-off; manual controls can work but should be consistent and evidence-backed.
*   Fiscal-to-calendar mapping is frequently requested for portfolio reporting; providing a standardized mapping schedule early can prevent later rework.

* * *

Key Findings
------------

### Figures

| Category | Item | Value | Period/Context |
| --- | --- | --- | --- |
| ARR | Contracted recurring revenue (ARR) | **$46.8M** | Sep 2025 month-end |
| Retention | Gross logo churn | **9.6%** | TTM Sep 2025 (logos lost / starting logos) |
| Retention | Gross revenue churn | **7.9%** (also cited **8.7%**) | TTM Sep 2025; discrepancy due to downsell inclusion/exclusion |
| Retention | Net revenue retention (NRR) | **112%** (also cited **109%**) | TTM Sep 2025; discrepancy due to billed vs contracted cut |
| Expansion | Expansion ARR | **$6.4M** | TTM Sep 2025 |
| Cohorts | Cohort NRR (2023 cohort) | **118%** | As of Sep 2025 |
| Contracts | Average contract term (new logos) | **24 months** | 2025 |
| Billing | Monthly billing in advance share | **68%** | 2025 |
| Deferred Rev | Deferred revenue balance | **$9.2M** | Sep 2025 month-end |
| Concentration | Top 10 customers share of ARR | **19%** | Sep 2025 ARR |
| Concentration | Largest single customer | **<3%** | Sep 2025 ARR |
| Pricing | Typical new-logo discount | **10–25%** | 2025 |
| Implementation | Implementation timeline | **3–8 weeks** | 2025 |
| Expansion | Median seat expansion (first 12 months) | **5–15%** | Rule of thumb |

### Risks

*   🔴 **KPI definition inconsistency across “cuts”** — NRR and gross revenue churn were each reported with two different values depending on definition (contracted vs billed; excluding vs including downsells), requiring reconciliation before metrics can be relied upon.
*   🔴 **Process/control weakness for KPI reporting** — KPI definitions and tracking were repeatedly described as “messy” and “not perfect,” with manual controls and reliance on spreadsheets for edge cases.
*   🟡 **Limited driver attribution for expansion** — Expansion cannot be quantified by pricing vs usage due to lack of clean reason codes, limiting underwriting of NRR quality.
*   🟡 **ARR-to-revenue bridge not operationalized** — A draft exists but is not relied upon operationally, increasing diligence effort to validate ARR movements vs GAAP revenue.

### Contradictions / Gaps

*   NRR reported as **112%** vs **109%** for TTM Sep 2025; difference described as billed ARR vs contracted ARR and requires reconciliation.
*   Gross revenue churn reported as **7.9%** vs **8.7%** for TTM Sep 2025; difference described as excluding vs including downsells and requires reconciliation.
*   Several metric definitions (including “gross vs net” framing and exact cadence/definition context) were deferred as “messy” and to be provided offline in a written definition/schedule.
*   Deferred revenue referenced as coming from a weekly tracker reconciled to the GL at close; the exact reporting artifact/tab was not identified on the call.

* * *

Open Items & Follow-Ups
-----------------------

| Priority | Item |
| --- | --- |
| **\[H\]** | Reconcile NRR for TTM Sep 2025 (**112%** vs **109%**) and provide written definition/calculation, including contracted vs billed treatment (due Friday). |
| **\[H\]** | Reconcile gross revenue churn for TTM Sep 2025 (**7.9%** vs **8.7%**) and confirm definition, including treatment of downsells (due date not explicitly stated; flagged as open item). |
| **\[H\]** | Provide cohort file with starting ARR, churn, and expansion by cohort (2022–2025) (due Friday). |
| **\[H\]** | Provide ARR-to-revenue bridge draft (2025 YTD) after cleanup (due Friday). |
| **\[H\]** | Provide deferred revenue roll-forward (Jan–Sep 2025) (due Friday). |
| **\[M\]** | Provide customer concentration list (top 25 ARR) as of Sep 2025 (due Wednesday). |
| **\[M\]** | Provide churn reasons summary (top 5) for 2025 YTD (due next Tuesday). |
| **\[M\]** | Provide explanation/approach for mapping fiscal reporting to calendar reporting if required (schedule requested; timing not explicitly stated). |
| **\[M\]** | Provide qualitative (and any available quantitative) view of expansion attributable to pricing vs usage; confirm whether any proxy tagging exists (timing not explicitly stated). |
| **\[L\]** | Identify the exact month-end package tab/report supporting the 2025 billing frequency mix (68% monthly in advance) (timing not explicitly stated). |

* * *

📝 Generate Draft Adjustments Memo?

## Response:
Thought for 2m 57s

Draft Adjustments Memo
======================

EBITDA Adjustments (Diligence)
------------------------------

**QoE1: ARR-to-revenue bridge / revenue recognition tie-out**

The ARR-to-revenue bridge exists only as a draft and is “not something we rely on operationally,” which creates risk that the reported bridge (and potentially revenue cutoffs / deferred revenue movements underpinning it) does not cleanly reconcile without cleanup. If the “cleaned up” bridge surfaces gaps, a revenue (and therefore EBITDA) adjustment may be required for the relevant period(s).

*   "We have a bridge draft, but it's not something we rely on operationally—I'd rather send it after we clean it up." — Controller
*   "Can you send ARR-to-revenue bridge draft (2025 YTD) by Friday?" — External Advisor
*   "Yep—I’ll send that by Friday." — Controller

**Request:** ARR-to-revenue bridge (2025 YTD) in its “cleaned up” form, plus the source reports/tabs used to build it (revenue by month, billings/invoicing extracts, deferred revenue roll-forward, and any mapping logic).

**Setup:**

*   Revenue — Potential Deduction (−) to EBITDA if the bridge identifies revenue overstatement vs the underlying billings/deferred revenue movements.
*   Pull: monthly GAAP revenue, invoiced billings (by month), and deferred revenue roll-forward for the same period as the bridge (2025 YTD).
*   Rebuild a monthly bridge that starts with beginning deferred revenue, adds billings, subtracts revenue recognized, and ties to ending deferred revenue; then reconcile to the provided ARR movement bridge to identify unexplained deltas.
*   Apply any identified revenue true-up(s) to the specific month(s) / period(s) where the bridge does not reconcile, and document whether items are timing (cutoff) vs structural (definition / data-source) differences.

* * *

**QoE2: Deferred revenue balance support / tracker-to-GL reconciliation**

Deferred revenue is supported by a “weekly tracker” and reconciled to the GL at close, but the support is described as tracker-based, which can introduce cutoff/reconciling-item risk if the tracker, month-end package, and GL do not align cleanly. If the tracker-to-GL reconciliation reveals errors or late adjustments, a revenue/deferred revenue reclass across periods could be required (EBITDA impact depends on timing).

*   "9.2 $m for Sep 2025 month-end. Primarily annual upfront." — Controller
*   "Uh, it's in the weekly tracker; we reconcile to the GL at close." — Controller

**Request:** Weekly deferred revenue tracker (with definitions), the GL deferred revenue account detail, and the month-end reconciliation file/workpaper showing how the tracker ties to the GL (including reconciling items) for at least Aug–Sep 2025 (and ideally Jan–Sep 2025).

**Setup:**

*   Revenue — Potential Deduction (−) to EBITDA if deferred revenue is understated (revenue overstated) in the relevant period(s); potential Add-back (+) if the opposite is true.
*   Pull: (1) weekly tracker exports covering the period, (2) month-end GL balance and activity for deferred revenue, and (3) the close reconciliation support.
*   Compare: tracker ending balance at each month-end vs GL month-end balance; isolate reconciling items and confirm they clear consistently (or represent errors).
*   If mismatches represent timing/cutoff, reallocate revenue recognition between months so the deferred revenue roll-forward ties; apply to the specific month(s) impacted (e.g., Sep 2025 month-end and surrounding months).

* * *

EBITDA Adjustments (Pro Forma)
------------------------------

No explicit pro forma (run-rate / go-forward) EBITDA adjustments were discussed in this transcript.

* * *

Net Debt Adjustments
--------------------

No explicit Net Debt adjustments were discussed in this transcript.

* * *

Working Capital Adjustments
---------------------------

**WC1: Deferred revenue treatment in NWC peg**

Deferred revenue is material (**$9.2m** at Sep 2025 month-end) and is driven “primarily \[by\] annual upfront,” with billing mix noted (68% monthly in advance, rest annual upfront). This item can materially move the NWC peg depending on whether deferred revenue is included/excluded and how consistently it is calculated (tracker vs GL).

*   "9.2 $m for Sep 2025 month-end. Primarily annual upfront." — Controller
*   "Um, 68 % for 2025. Rest is annual upfront." — Controller
*   "Can you send Deferred revenue roll-forward (Jan–Sep 2025) by Friday?" — External Advisor

**Request:** Deferred revenue roll-forward (Jan–Sep 2025), monthly ending deferred revenue balances tied to the GL, and the SPA/peg definition (whether deferred revenue is included in NWC).

**Setup:**

*   Deferred Revenue — (−) to NWC (as a liability) if included in the peg; if excluded by definition, ensure it is consistently removed from the peg calculation.
*   Pull: deferred revenue roll-forward (beginning balance, billings, revenue recognized, ending balance) by month for Jan–Sep 2025, plus GL account detail for the same period.
*   Normalize: ensure each month-end deferred revenue balance used in NWC is the GL-tied figure (or a reconciled figure with documented reconciling items).
*   Apply: calculate average (or trailing) deferred revenue levels per peg methodology and incorporate into the NWC peg consistently (including any seasonal effects implied by annual upfront billings).

* * *

**WC2: Contracted vs billed ARR definition differences (potential timing indicators for WC)**

There is an acknowledged “different cut” between billed ARR and contracted ARR used in NRR reporting. While this is a KPI-definition item, differences between contracted vs billed views can indicate timing differences that may matter for WC mechanics (e.g., billing cadence, deferred revenue build, and invoice timing), and should be reconciled to the billing/deferred revenue schedules supporting the peg.

*   "Just to confirm, for NRR in TTM Sep 2025, is it 112 or 109?" — Consultant
*   "Different cut: billed ARR vs contracted ARR." — VP RevOps
*   "Can you send NRR definition and calculation (contracted vs billed) by Friday?" — External Advisor

**Request:** Written NRR definition (contracted vs billed), and the underlying customer-level schedules used to compute both “contracted ARR” and “billed ARR” for TTM Sep 2025 (including how billing cadence is handled).

**Setup:**

*   Other (WC analytics support) — (+/−) to NWC only if the contracted vs billed reconciliation surfaces a recurring timing pattern that is inconsistent with the peg definitions used for billing-related balance sheet items.
*   Pull: customer-level contracted ARR, billed ARR, invoice schedules/cadence flags (monthly vs annual), and tie-outs to billing and deferred revenue schedules for the same period.
*   Reconcile: bridge contracted ARR to billed ARR and identify whether differences are driven by timing (invoice start dates, billing in advance) vs definition (inclusions/exclusions); map those drivers to expected balance sheet impacts (e.g., deferred revenue build from annual upfront).
*   Apply: if the reconciliation implies a consistent “billing timing” pattern not captured in the peg methodology, adjust the peg computation to reflect steady-state billing/deferred revenue behavior rather than an outlier month.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)