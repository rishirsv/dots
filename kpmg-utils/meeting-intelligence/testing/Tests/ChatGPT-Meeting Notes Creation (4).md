# Meeting Notes Creation

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:51:09  
**Updated:** 1/8/2026 10:57:50  
**Exported:** 1/8/2026 11:14:24  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd26d-40a0-833d-be13-64771ad1a0d0](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd26d-40a0-833d-be13-64771ad1a0d0)  

## Response:
Thought for 42s

Month-End Close Timeline, Controls, and Automation Opportunities — Working Session
==================================================================================

Meeting Details
---------------

*   **Date & Time**: Not specified in transcript
*   **Duration**: ~1h 16m (based on transcript timestamps)
*   **Attendees**: Finance Lead; Controller; FP&A Manager; IT Manager; Ops Lead
*   **Facilitator**: Finance Lead
*   **Transcript**:

Pre-Read Summary
----------------

### Background

Internal working session to align on current month-end close performance, control points, and automation opportunities, with an emphasis on decisions and next steps (not producing a “perfect deck” in-session).

### Current Situation

Close process runs across ERP plus a billing platform, with spreadsheets used for edge cases; several key metrics and definitions (e.g., “close complete,” gross vs net of adjustments, fiscal vs calendar mapping) need standardization to enable a faster close target.

Decision Required
-----------------

**Question**: Can the team commit to moving to a **day 6 close starting next month**?  
**Timeline**: “Starting next month” was requested; commitment was not made in the meeting.  
**Impact**: Month-end reporting cadence, workload compression, and dependency on automation readiness (notably bank reconciliation).

Options Analysis
----------------

### Option A: Commit to Day 6 Close Starting Next Month

**Description**: Set a hard start date to operate the close on a 6 business day timeline.  
**Pros**:

*   Forces prioritization and sequencing of close tasks around the target timeline.
*   Creates a clear deadline for process/control streamlining.  
    **Cons**:
*   Commitment risk if enabling automation (bank rec) does not work as expected.
*   Existing ambiguities (definition of “close complete,” inconsistent metric cuts) could create confusion and rework.

### Option B: Defer Commitment Until Bank Rec Automation Pilot Validates

**Description**: Do not commit to day 6 close until the bank rec automation is proven in practice.  
**Pros**:

*   Reduces execution risk by gating on a key dependency.
*   Allows time to reconcile metric definitions and build a clean close task inventory.  
    **Cons**:
*   Delays timeline improvement and may reduce urgency without clear interim milestones.

Discussion Topics
-----------------

### 1) Close process landscape (systems and where work happens)

*   Close work is performed primarily in the **ERP**, with a **billing platform** feeding data, and **spreadsheets** used for edge cases.
*   ERP reporting performance during close was described as having **15–45 minutes** latency at peak and “not always stable,” contributing to close friction.

### 2) Current-state metrics, targets, and bottlenecks

*   **Close duration (current state)** stated as **9 business days**; a discrepancy was raised because another view showed **10 business days**, and the definition of “close” (management vs final) was explicitly called out as a likely driver. This was left as an open item pending reconciliation.
*   **Close duration (target / stretch)** stated as **6 business days**.
*   **Manual journal entries (typical month)** stated as **180** (mostly accruals and reclasses), but a conflicting cut showed **210**; this was flagged as an open item to reconcile (e.g., recurring vs one-off counting).
*   **Reconciliation accounts (typical month)** stated as **62** balance sheet reconciliations.
*   **Late close adjustments (Aug 2025 close)** stated as **8** adjustments occurring after **day 7**.
*   **Bank rec automation potential savings** estimated at **0.5–1.5 days per close** (estimate).
*   **Time spent on accruals** estimated at **6–10 hours per month**, depending on volume.

### 3) Task inventory, ownership, and calendar discipline

*   A “clean inventory” of close tasks by owner was not available; there is a spreadsheet, but it is not current and work can happen ad hoc. This gap was treated as a follow-up item.
*   A current-state close calendar with owners was requested and accepted as a deliverable.

### 4) Controls and approvals

*   Approval/control described as **manual**: “manager signs off, then finance reviews.”
*   Several control/definition questions repeatedly surfaced as “messy” and requiring offline clarification:
    *   Whether certain metrics are **gross vs net of adjustments** (gross was indicated; net “a little lower”).
    *   Whether reporting is tracked **weekly vs only at month-end** (only really monthly; weekly is directional).
    *   Whether reporting is **calendar vs fiscal** and how to map to calendar if needed.
    *   Need to define “close complete” (management vs final) explicitly to eliminate conflicting duration counts.

Decision Framework
------------------

**Criteria for evaluation** (as implied by discussion):

*   Readiness and reliability of **bank rec automation** as a gating dependency for cycle-time reduction.
*   Ability to standardize **definitions** (close complete, fiscal/calendar mapping, gross/net treatment) to avoid rework and metric disputes.
*   Clear **task ownership and dependencies** to support a compressed close calendar.

Decision
--------

**Outcome**: **Deferred** — no commitment to day 6 close starting next month, pending validation of bank rec automation and supporting process clarity.  
**Primary reason stated**: Avoid committing until bank rec automation “actually works.”

Action Items
------------

*    Send **Close calendar with owners (current state)** — @\[Controller\] — **Due: Friday (date not specified)**
*    Send **List of recurring JEs and candidates to automate** — @\[Controller\] — **Due: Wednesday (date not specified)**
*    Send **Bank rec automation pilot plan** — @\[IT Manager\] — **Due: Next Tuesday (date not specified)**
*    Send **Inventory of close tasks by owner and dependency** — @\[Ops Lead\] — **Due: Friday (date not specified)**
*    Send **Define “close complete” (management vs final) and timeline** — @\[Finance Lead\] — **Due: Friday (date not specified)**
*    Send **Review of late adjustments root causes (Aug 2025 close)** — @\[FP&A Manager\] — **Due: Friday (date not specified)**
*    Reconcile **close duration discrepancy (9 vs 10 business days)** by aligning on definition and source report/tab — @\[Finance Lead / Controller\] — **Due: Not specified**
*    Reconcile **manual JE count discrepancy (180 vs 210)** including rules for recurring vs one-off counting — @\[Controller / FP&A Manager\] — **Due: Not specified**

Follow-up
---------

*   **Next review**: Not specified in transcript
*   **Success metrics** (discussed as targets/benchmarks to support decision):
    *   Demonstrated bank rec automation time savings of **0.5–1.5 days per close** (estimate) and operational reliability during peak close.
    *   Ability to operate on a **6 business day** close timeline after definition/task-owner clean-up.

## Response:
Thought for 2m 8s

Draft Adjustments Memo
======================

EBITDA Adjustments (Diligence)
------------------------------

**QoE1: Late close adjustments after Day 7**

The close included **8** “late close adjustments” in the Aug 2025 close occurring after Day 7, creating risk that EBITDA periodization is impacted by post-close entries and month-end cutoff timing. This item is about identifying the net P&L impact of those late entries and reassigning them to the correct period where applicable.

*   "Um, 8 count for Aug 2025 close. After day 7." — Controller
*   "Only caveat is timing—month-end cutoffs can swing things a bit." — Controller

**Request:** Late-close adjustment log / JE listing for Aug 2025 close (entries posted after Day 7), including JE date, posting period, accounts, preparer/approver, and rationale.

**Setup:**

*   P&L (various revenue/opex lines touched by the late JEs) — Reclass/correction to EBITDA (apply sign based on the net P&L impact of reversing/reposting entries to the intended period)
*   Pull the JE population defined as “after Day 7” for the Aug 2025 close, plus any supporting schedules used to justify each entry
*   Calculate the net EBITDA impact by (i) identifying which entries represent true cutoff corrections vs. late operational processing, then (ii) reversing amounts from the “as-reported” period and reposting to the period the entry economically relates to
*   Apply to the diligence periods being analyzed (at minimum Aug 2025 and any rolling/LTM period that includes Aug 2025); extend to other months if the late-adjustment pattern is recurring

* * *

EBITDA Adjustments (Pro Forma)
------------------------------

* * *

Net Debt Adjustments
--------------------

* * *

Working Capital Adjustments
---------------------------

**WC1: Month-end cutoff timing normalization**

Month-end cutoff timing was explicitly called out as a factor that “can swing things,” and multiple metric definitions were described as “messy” and needing an offline definition. This creates risk that working capital balances used for a peg (and trend analysis) are not consistently defined and may need normalization around a standard cutoff and consistent definitions.

**Request:** Month-end cutoff policy and evidence pack (AR/AP cutoff procedures), plus the month-end “close complete” definition and any schedules used to support period-end accruals.

**Setup:**

*   Other (cutoff-related accruals / AR/AP timing) — Normalize to NWC (direction determined by the net effect of moving mis-timed items into the standard cutoff window)
*   Pull (i) AR and AP subledger cutoff reports (e.g., invoices/credits posted just after month-end but relating to the prior period), (ii) period-end accrual support, and (iii) reconciliation support for the balance sheet recs population
*   Identify items recorded outside the standard cutoff that economically relate to the measurement date; reclass them into the peg definition so the NWC snapshot reflects a consistent cutoff and classification basis
*   Apply at the measurement dates used for peg setting and any comparative historical months used for trend/seasonality assessment



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)