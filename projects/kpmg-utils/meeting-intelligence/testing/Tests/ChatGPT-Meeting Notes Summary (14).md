# Meeting Notes Summary

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:51:01  
**Updated:** 1/8/2026 10:58:47  
**Exported:** 1/8/2026 11:14:21  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd264-f140-833d-92bf-c990a391c3fd](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd264-f140-833d-92bf-c990a391c3fd)  

## Response:
Thought for 34s

SIM-0017 — Ops Review: Commodity Costs, Inventory Turns, and Shrink/Waste
=========================================================================

Meeting Details
---------------

**Date**: TBD  
**Attendees**: COO; CFO; Plant Controller; Supply Chain Director; Ops Analyst  
**Transcript**:

Executive Summary
-----------------

**Status**: Not explicitly stated

*   This was an internal working session focused on agreeing “headline” operational cost / inventory metrics, identifying definition/cut differences (inventory turns; waste/shrink), and assigning owners to send reconciliations and supporting schedules.

Progress Since Last Meeting
---------------------------

### Completed

*   Established baseline “headline” metrics for Sep 2025 month-end inventory, TTM inventory turns, Q3 2025 waste/shrink, Q3 2025 vs Q3 2024 commodity inflation, and Q3 2025 outbound freight expense.
*   Identified and explicitly flagged two material metric discrepancies requiring reconciliation:
    *   Inventory turns: **8.1x vs 7.4x**
    *   Waste/shrink: **1.9% vs 2.3%**

### In Progress

*   Reconciliation of definitions and data cuts across teams/systems (ERP vs other tools; fiscal vs calendar mapping; gross vs net of adjustments; monthly vs weekly).

Metrics
-------

| Metric | Current | Target | Status |
| --- | --- | --- | --- |
| Inventory (Raw + WIP + Finished Goods) | **$24.8M** (Sep 2025 month-end) | TBD | 🟡 |
| Inventory Turns (TTM Sep 2025) | **8.1x** (alt view **7.4x**; reconciliation needed) | TBD | 🟡 |
| Waste/Shrink (as % of production) | **1.9%** (Q3 2025; alt view **2.3%**; definition gap) | TBD | 🟡 |
| Commodity inflation (key inputs) | **7.2%** (Q3 2025 vs Q3 2024) | TBD | 🟢 |
| Outbound freight expense | **$1.4M** (Q3 2025) | TBD | 🟢 |
| Freight cost per pallet | **$78–$112** (Q3 2025; lane dependent) | TBD | 🟢 |
| Typical product shelf-life | **30–90 days** (category dependent) | TBD | 🟢 |
| Commodity lead time | **2–5 weeks** (2025; supplier dependent) | TBD | 🟢 |

Upcoming Work
-------------

**Next 2 Weeks**:

*   Deliver metric backup, reconciliations, and definitional documentation for inventory turns, waste/shrink, commodity costs, freight, hedging, and write-offs (see Action Items).

**Next Month**:

*   Normalize and document metric definitions/controls (gross vs net, fiscal vs calendar mapping, monthly vs weekly usage) to avoid recurring discrepancies.

Blockers & Risks
----------------

### Active Blockers

*   **Inventory turns disagreement (8.1x vs 7.4x)**: Different COGS base/cut appears to be driving inconsistent outputs; the metric is not “closed” until reconciled.
    *   Action: Provide the detailed turns calculation and inventory aging support.
*   **Waste/shrink disagreement (1.9% vs 2.3%)**: Different definitions (plant waste vs QC-reported waste) create conflicting KPIs and could change the narrative on operational performance.
    *   Action: Provide the waste/shrink report with explicit definitions across Q1–Q3 2025.

### Risks

*   **Definitions/controls described as “messy” and not cleanly reportable**: Repeatedly indicated that some metrics aren’t packaged in clean reports and may rely on manual handling; this increases risk of inconsistent reporting and rework.
    *   Mitigation: Send “exact definition” documentation and supporting schedules; document approval workflow.
*   **Limited SKU-level write-off detail**: Write-offs can be pulled, but SKU-level is “painful” and not in a clean report; could delay deep-dive analysis.
    *   Mitigation: Provide write-offs by product family and cause as a practical first cut; assess effort for SKU-level later.
*   **Hedging impact on COGS not quantified during the meeting**: Selective hedging exists, but Q3 P&L impact wasn’t available in-session.
    *   Mitigation: Provide a hedging summary and quantified impacts.

Discussion Topics
-----------------

1.  **Systems/data flow for metrics**
    *   Metrics are owned by the team and flow through “a couple systems,” primarily **ERP**, plus a **billing platform** and **spreadsheets for edge cases**.
2.  **Inventory balance (Sep 2025 month-end)**
    *   Inventory reported as **$24.8M** at Sep 2025 month-end, inclusive of **raw + WIP + finished goods**, sourced from a **GL roll-forward** schedule.
3.  **Inventory turns (TTM Sep 2025)**
    *   Turns cited as **8.1x** (COGS / average inventory) from a GL roll-forward schedule, but an alternate view shows **7.4x**.
    *   The discrepancy was attributed to a **different COGS base used in the calculation**, and it was explicitly flagged for reconciliation.
4.  **Waste/shrink (Q3 2025)**
    *   Waste/shrink cited as **1.9%** of production for Q3 2025, but an alternate view shows **2.3%**.
    *   Difference attributed to definitions: **plant waste vs QC-reported waste**; explicitly flagged for reconciliation.
5.  **Commodity inflation (Q3 2025 vs Q3 2024)**
    *   Commodity inflation on key inputs cited as **7.2%**, supported by the standard month-end package (specific tab to be shared).
6.  **Freight (Q3 2025)**
    *   Outbound freight expense cited as **$1.4M** for Q3 2025, supported via GL roll-forward schedule.
    *   Freight cost per pallet cited as **$78–$112** (lane dependent) for Q3 2025.
7.  **Operational ranges impacting inventory and supply**
    *   Typical product shelf-life: **30–90 days** (category dependent).
    *   Commodity lead times (2025): **2–5 weeks** (supplier dependent).
8.  **Measurement cadence and mapping**
    *   Weekly tracking exists only as **directional**; **monthly** is the reliable cadence.
    *   Metrics are on a **fiscal** basis, with the ability to **map to calendar** if needed.
9.  **Gross vs net and control/approval**
    *   “Gross vs net of adjustments” came up; net would be “a little lower” (no quantified delta provided).
    *   Approval/control described as **manual**: **manager sign-off, then finance review**.
    *   Some definitions/controls were repeatedly characterized as needing to be taken offline and documented (“send the exact definition”).

Decisions Needed
----------------

*   **Reconcile inventory turns (TTM Sep 2025) and lock a single, governed definition** (including the COGS base and data sources).
*   **Reconcile waste/shrink (Q3 2025) and standardize the definition** (plant waste vs QC-reported waste) for reporting going forward.
*   **Document metric governance** (gross vs net treatment, fiscal vs calendar mapping, cadence, and manual approval workflow) so future reporting is consistent.

Action Items
------------

*    Send **inventory aging** and **TTM inventory turns calculation detail** (including reconciliation of **8.1x vs 7.4x**) — @\[Supply Chain Director\] — Due: Friday
*    Send **waste/shrink report with definitions** for **Q1–Q3 2025** (including reconciliation of **1.9% vs 2.3%**) — @\[Plant Controller\] — Due: Wednesday
*    Send **commodity cost index and purchasing summary** for **Q3 2025** (and the exact month-end package tab reference) — @\[CFO\] — Due: Friday
*    Send **outbound freight detail by lane** for **Q3 2025** — @\[Ops Analyst\] — Due: Friday
*    Send **hedging summary and impacts** for **Q3 2025** (quantify P&L/COGS impact) — @\[CFO\] — Due: next Tuesday
*    Send **write-offs by product family and cause** for **Q3 2025** — @\[Plant Controller\] — Due: Friday
*    Provide **documentation of metric definitions and controls** (cadence: monthly vs weekly, fiscal vs calendar mapping, gross vs net treatment, and approval workflow) — @\[Ops Analyst / Plant Controller / Supply Chain Director / CFO\] — Due: TBD (to be taken offline and circulated)

Next Meeting
------------

**Date**: TBD  
**Focus**: Close reconciliations (inventory turns; waste/shrink) and confirm standardized definitions/controls for ongoing reporting.

## Response:
Thought for 2m 19s

Draft Adjustments Memo
======================

EBITDA Adjustments (Diligence)
------------------------------

**QoE1: Waste/shrink definition alignment (plant vs QC)**

Waste/shrink was cited at **1.9%** vs **2.3%** for **Q3 2025**, and the discrepancy was attributed to a definition difference (“plant waste vs QC-reported waste”). If financial reporting (COGS / inventory) is being analyzed using inconsistent waste/shrink definitions across schedules, normalize EBITDA to a single, consistently-applied definition and avoid double counting between operational KPI reporting and GL impacts.

*   "So, i have 1.9 % in my file. Different definition: plant waste vs QC-reported waste." — Plant Controller
*   "Um, i might be looking at a different cut—I've got 2.3 %." — Supply Chain Director
*   "Okay—flag that. We'll treat it as an open item until we reconcile." — CFO

**Request:** Waste/shrink report with definitions for **Q1–Q3 2025** (plant vs QC), plus the GL accounts / entries where waste, spoilage, and shrink are recorded (and any reclasses/manual adjustments applied).

**Setup:**

*   COGS (Waste / shrink) — Add-back (+) to EBITDA for any non-recurring clean-up entries or definitional one-offs identified during reconciliation; otherwise, keep recurring waste/shrink in EBITDA with consistent definition.
*   Pull the waste/shrink KPI reports (both “plant waste” and “QC-reported waste”) for Q1–Q3 2025 and tie each to the underlying source/system.
*   Pull GL detail for waste/spoilage/shrink accounts for the same periods and map to the KPI definitions (identify what is included/excluded in each “cut”).
*   Calculate the adjustment as the incremental non-recurring portion (e.g., one-time clean-up, correction, or definitional change impact) and apply to the periods impacted by those entries.

* * *

**QoE2: Shelf-life write-offs detail and normalization**

Management indicated write-offs can be pulled but SKU-level shelf-life detail is not packaged in a clean report. Given product shelf-life is **30–90 days** (category-dependent), quantify shelf-life write-offs and determine whether any portion reflects non-recurring events or clean-up activity versus steady-state spoilage/expiration.

*   "Okay, do we have SKU-level shelf-life write-off detail?" — CFO
*   "We can pull write-offs, but SKU-level is painful—it's not packaged in a clean report." — Plant Controller
*   "Sorry, 30–90 days for products. Category dependent." — Supply Chain Director

**Request:** Write-offs by product family and cause for **Q3 2025**, plus any available shelf-life/expiration write-off extracts (SKU-level if feasible; otherwise family-level) and the GL mapping for where those write-offs hit the P&L.

**Setup:**

*   COGS (Inventory write-offs / obsolescence / spoilage) — Add-back (+) to EBITDA for any portion identified as non-recurring or “clean-up” activity; do not adjust for steady-state write-offs.
*   Pull the write-offs schedule by product family and cause (and any supplemental SKU-level extracts available) for Q1–Q3 2025 and LTM if available.
*   Tie the schedule totals to GL detail (confirm whether write-offs run through COGS vs a separate expense line, and whether any are capitalized into inventory then relieved).
*   Calculate: (actual write-offs) minus (normalized baseline write-offs) where a baseline is established from consistent periods with no clean-up; apply the delta to the periods impacted by the non-recurring activity.

* * *

**QoE3: Commodity hedging gains/losses impact on COGS (reclass/normalization)**

Hedging was described as selective and “not huge,” but the P&L impact was not available in the session. Quantify the Q3 hedging impact and confirm whether gains/losses are embedded in COGS (and whether treatment is consistent period-to-period). If there are discrete one-time hedging settlements or accounting reclasses, normalize EBITDA accordingly.

*   "Can you quantify the impact of hedging on COGS in Q3?" — COO
*   "Right, we hedge selectively and it's not huge, but I don't have the P&L impact handy right now." — CFO

**Request:** Hedging summary and impacts for **Q3 2025** (contracts, settlements, and accounting entries) and the GL accounts used for hedge gains/losses and reclasses into COGS.

**Setup:**

*   COGS (Hedging gains/losses) — Add-back (+) to EBITDA for any discrete, non-recurring hedge impacts or true-ups identified; if recurring and part of normal procurement strategy, treat as operating and do not adjust.
*   Pull the Q3 2025 hedging schedule and reconcile total gains/losses to GL.
*   Confirm whether hedge impacts are recorded directly in COGS, in “other,” or reclassed into inventory valuation/COGS.
*   Calculate the adjustment as any non-recurring portion (e.g., one-time settlement/true-up) and apply to the fiscal periods where recorded.

* * *

Working Capital Adjustments
---------------------------

**WC1: Inventory reserve / aging vs shelf-life (close peg readiness)**

Inventory was stated as **$24.8m** at **Sep 2025 month-end** (raw + WIP + finished goods), and an inventory aging / turns calculation detail was requested as a follow-up. Given typical shelf-life is **30–90 days**, confirm whether inventory is appropriately reserved for slow-moving/at-risk items and whether the reported inventory balance is stated net of required reserves for expiration/obsolescence.

*   "24.8 $m for Sep 2025 month-end. Raw + WIP + finished goods." — Plant Controller
*   "Can you send Inventory aging and turns calculation detail (TTM) by Friday?" — CFO
*   "Sorry, 30–90 days for products. Category dependent." — Supply Chain Director

**Request:** Inventory aging as of Sep 2025 month-end, inventory reserve methodology (obsolescence/expiration), and the turns calculation support (including the COGS base used).

**Setup:**

*   Inventory — Decrease (−) to NWC for any required incremental reserve to bring inventory to net realizable value at close/peg.
*   Pull the Sep 2025 inventory aging and stratify by age buckets aligned to the **30–90 day** shelf-life ranges (by category where possible).
*   Identify existing reserves recorded (inventory reserve accounts and any contra-inventory) and reconcile to the GL inventory balance.
*   Calculate: (required reserve per policy / shelf-life risk assessment) minus (reserve already recorded); adjust NWC by the incremental reserve shortfall.

* * *

**WC2: Gross vs net inventory/waste adjustments reconciliation (definition + controls)**

Management indicated certain metrics are “messy,” require sending the “exact definition,” and that reporting may be presented “gross” with “net” being “a little lower.” For close mechanics, reconcile gross-to-net adjustments and confirm whether any items should be treated as working capital (inventory reserves / accruals) versus QoE (P&L normalizations).

*   "Honestly it's messy; we should take it offline and send the exact definition." — Supply Chain Director
*   "Yeah—so, gross. Net would be a little lower." — Ops Analyst
*   "Approval is manual—manager signs off, then finance reviews." — Plant Controller

**Request:** The “gross” report, the netting adjustments bridge (gross-to-net), and written definitions for each adjustment (including who approves and where it posts in the GL).

**Setup:**

*   Inventory (or relevant accrual/reserve line) — Decrease (−) to NWC to reflect net values if the peg/close definition requires inventory stated net of reserves/adjustments.
*   Pull the gross metric report and the associated “net” version (or the adjustment bridge if net is not directly reported).
*   Map each adjustment to a BS account (inventory contra, accrual, or other) and confirm whether it should be included in NWC per the transaction definition.
*   Calculate the NWC impact as the net adjustment amount required to move from gross to the contractually-defined net presentation at close, and classify consistently across periods/close.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)