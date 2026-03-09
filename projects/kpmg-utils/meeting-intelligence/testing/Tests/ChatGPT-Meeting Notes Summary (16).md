# Meeting Notes Summary

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:51:49  
**Updated:** 1/8/2026 11:00:26  
**Exported:** 1/8/2026 11:14:28  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd295-2dc0-833d-9a3b-cfb1d39a5b3c](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd295-2dc0-833d-9a3b-cfb1d39a5b3c)  

## Response:
Thought for 34s

Customer Escalation Handling, SLA Performance, and Root-Cause Fixes — Status Update
===================================================================================

Meeting Details
---------------

**Date**: TBD  
**Attendees**: VP Customer Success; Support Manager; Engineering Manager; Product Manager; Ops Analyst  
**Project**: Customer escalation handling / SLA performance / root-cause fixes (internal working session)

Executive Summary
-----------------

**Status**: Not explicitly stated

**Progress**: Not explicitly stated  
**Timeline**: Not explicitly stated; timeline commitments were explicitly cautioned against until staging validation completes

Progress Since Last Meeting
---------------------------

### Completed

*   No completed deliverables were explicitly confirmed in the transcript; the session focused on current-state metrics, discrepancies, and follow-ups.

### In Progress

*   A fix was in progress, with a stated need to validate in staging before committing to an external date/guarantee.
*   Multiple metric definitions and reporting cuts were identified as inconsistent (“different cut,” “messy”), requiring reconciliation and clarified definitions.

Metrics
-------

| Metric | Current | Target | Status |
| --- | --- | --- | --- |
| SLA attainment | 87% (Sep 2025) **and** 91% (alternate cut); needs reconciliation | TBD | TBD |
| P1 incidents | 14 (Sep 2025), customer-facing outages | TBD | TBD |
| Median first response time | 42 minutes (Sep 2025, business hours) | TBD | TBD |
| Escalation backlog | 26 open escalations (current week) | TBD | TBD |
| Bug fix cycle time (median) | 12 days (Aug–Sep 2025) **and** 9 days (alternate cut); definition differs (e.g., from triage vs from commit) | TBD | TBD |
| Ticket volume/day | 220–310 tickets (Sep 2025) | TBD | TBD |
| On-call load | 3–7 pages/night (Sep 2025), during an incident cluster | TBD | TBD |
| Time to reproduce bug | 2–6 hours (Sep 2025), depends on logs | TBD | TBD |

Upcoming Work
-------------

**Next 2 Weeks**:

*   Provide customer escalation summary and communications plan.
*   Provide incident postmortems for top 3 P1s in Sep 2025.
*   Provide SLA report definition (what’s excluded) and September trend view.
*   Produce a consolidated list of affected integrations using logs + tickets (explicitly noted as not definitive today).
*   Provide a bugfix ETA after staging validation (explicitly avoiding over-promising until validation).
*   Produce backlog triage plan to reduce open escalations.

**Next Month**:

*   Not explicitly stated.

Blockers & Risks
----------------

### Active Blockers

*   **Metric inconsistency across reports/cuts**: SLA attainment was stated as both 87% and 91% for Sep 2025, and bug fix cycle time as both 12 and 9 days for Aug–Sep 2025; reconciliation is required before using these as “the” numbers.
    *   Action: Reconcile definitions/cuts and share the exact report tabs/definitions.
*   **Unclear scope of impact**: A definitive list of affected integrations does not yet exist; a ticket-derived list may be incomplete.
    *   Action: Build list using logs + tickets and deliver by the stated deadline.

### Risks

*   **Over-promising on fix date**: Committing to “root cause fixed by end of week” was explicitly avoided pending staging validation.
    *   Mitigation: Provide ETA only after staging validation; communicate cautiously to customers until validated.
*   **Reporting/controls ambiguity for certain metrics**: Several metrics were described as “messy,” tracked primarily monthly with weekly being “directional,” with repeated uncertainty around fiscal vs calendar framing and “gross vs net of adjustments,” plus manual approval controls (manager sign-off then finance review).
    *   Mitigation: Send exact metric definitions, tracking cadence, and control/approval process as follow-up artifacts.
*   **Month-end cutoff variability**: Month-end timing/cutoffs were noted as a caveat that can swing outcomes.

Discussion Topics
-----------------

1.  **Current operating systems and data flow**: Work is managed primarily in an ERP, with a billing platform plus spreadsheets for edge cases.
2.  **SLA and incident performance snapshot**: Reviewed Sep 2025 SLA attainment, P1 incident count, and first response time, plus current escalation backlog.
3.  **Engineering throughput & support load**: Reviewed bug fix cycle time, ticket volume variability, on-call paging load, and time-to-reproduce ranges.
4.  **Customer-facing commitments**: Explored whether a fix could be guaranteed by end of week; answer was to avoid commitment until staging validation completes.
5.  **Impact surface area**: Confirmed the affected-integration inventory is not yet definitive and needs consolidation from tickets and logs.
6.  **Metric definition / cadence / controls**: Multiple prompts surfaced that (a) some tracking is monthly with weekly directional, (b) fiscal vs calendar mapping may be needed, (c) some values may be “gross” with “net” lower, and (d) approval/control is manual (manager sign-off, finance review).

Decisions Needed
----------------

*   **Whether to guarantee “root cause fixed by end of week” to the customer**: Deferred pending staging validation; follow-up to provide ETA after validation.
*   **Which definition/cut is the official SLA attainment and bug fix cycle time**: Deferred pending reconciliation of report definitions and exclusions.

Action Items
------------

*    Send **customer escalation summary + communications plan** - @VP Customer Success - Due: **today EOD**
*    Send **incident postmortem for top 3 P1s (Sep 2025)** - @Engineering Manager - Due: **Friday**
*    Send **SLA report definition (what’s excluded) + September trend** - @Ops Analyst - Due: **Wednesday**
*    Send **affected integrations list (logs + tickets)** - @Product Manager - Due: **Friday**
*    Send **bugfix ETA after staging validation** - @Engineering Manager - Due: **tomorrow**
*    Send **backlog triage plan to reduce open escalations** - @Support Manager - Due: **next Tuesday**
*    Reconcile **SLA attainment (87% vs 91% for Sep 2025)** and document the chosen definition (e.g., inclusion/exclusion such as “waiting on customer”) - @Support Manager / @Ops Analyst - Due: TBD
*    Reconcile **bug fix cycle time (12 days vs 9 days for Aug–Sep 2025)** and document the definition basis (e.g., from triage vs from commit) - @Engineering Manager / @Product Manager - Due: TBD
*    Provide the **exact report/tab references** from the month-end package used for key metrics (SLA, backlog, response time) - @Support Manager - Due: TBD
*    Provide a **clean metric glossary** covering: cadence (weekly vs month-end), fiscal vs calendar mapping approach, gross vs net-of-adjustments framing (where applicable), and approval/control process - @Engineering Manager / @Ops Analyst - Due: TBD

Next Meeting
------------

**Date**: TBD  
**Focus**: Review reconciled metric definitions/cuts, confirm affected integrations list, confirm validated bugfix ETA, and align on customer-facing commitments and comms.

## Response:
Thought for 4m 40s

Draft Adjustments Memo
======================

EBITDA Adjustments (Diligence)
------------------------------

**QoE1: Potential customer concessions tied to SLA misses / outages (TBD)**

No customer credits/refunds were confirmed in this meeting, but Sep 2025 performance was discussed (87% SLA attainment; 14 P1 customer-facing outages) and the KPI reporting was described as having “gross” vs “net of adjustments” with finance review. Diligence should confirm whether any customer concessions exist and how they are recorded.

*   “Uh, 87 % for Sep 2025. Down from prior months.” — Support Manager
*   “Sorry, 14 count for Sep 2025. Customer-facing outages.” — Ops Analyst
*   “Is that gross or net of adjustments?” — VP Customer Success
*   “Right, yeah—so, gross. Net would be a little lower.” — Engineering Manager
*   “Approval is manual—manager signs off, then finance reviews.” — Engineering Manager

**Request:** Customer concessions register (service credits, refunds, fee waivers, free months, contract concessions) for Sep 2025 and trailing 12 months; policy for when concessions are granted; accounting treatment (timing of recognition / accrual).

**Setup:**

*   Revenue (contra: credits/refunds) — TBD (no adjustment proposed yet; determine whether concessions are recurring vs one-time and whether already reflected in revenue)
*   Pull concessions data from billing/ERP and any spreadsheets used for edge cases
*   Tie concessions to specific incidents/escalations where applicable (e.g., Sep 2025 P1s)
*   Confirm whether any concessions are approved outside the billing system and how they flow to month-end reporting

**QoE2: Potential one-time incident response / remediation costs (TBD)**

Operational strain in Sep 2025 was noted (incident cluster; elevated paging; hours to reproduce bugs). The meeting did not state whether incremental spend (overtime, contractors, emergency vendor costs) occurred. Diligence should confirm whether any non-recurring costs were incurred and whether they are included in run-rate EBITDA.

*   “3–7 pages/night for Sep 2025. During incident cluster.” — Engineering Manager
*   “2–6 hours for Sep 2025. Depends on logs.” — Support Manager

**Request:** Sep 2025 incident response cost summary (incremental support/engineering overtime if tracked, contractors, third-party tooling/logging cost spikes, expedited services) and any related purchase approvals.

**Setup:**

*   Support / Engineering Opex — TBD (no adjustment proposed yet; assess whether any costs were incremental and non-recurring)
*   Identify incident-related spend in ERP and any supplemental spreadsheets
*   Separate baseline run-rate spend from incremental incident response spend
*   Map to the period incurred and confirm whether any amounts were capitalized vs expensed (if applicable)

EBITDA Adjustments (Pro Forma)
------------------------------

*   No pro forma EBITDA adjustments were identified or discussed in this meeting.

Net Debt Adjustments
--------------------

*   No net debt items were identified or discussed in this meeting.

Working Capital Adjustments
---------------------------

**WC1: Month-end cutoff timing sensitivity (TBD)**

Month-end cutoffs were flagged as a factor that “can swing things,” but no specific balance-sheet accounts or working capital definitions were confirmed in this meeting. Diligence should confirm the relevant cutoff policies and whether any month-end true-ups are recurring.

*   “Only caveat is timing—month-end cutoffs can swing things a bit.” — Support Manager

**Request:** Month-end close/cutoff policy for the reporting package referenced, including how open items are treated at cutoff and how subsequent true-ups are processed.

**Setup:**

*   Working capital accounts impacted by cutoff timing — TBD (no adjustment proposed yet; determine the normalized cutoff approach and whether any one-time swings should be normalized)
*   Obtain the “standard month-end package” tab definitions used for reported metrics
*   Confirm whether any manual approvals/finance reviews drive month-end true-ups that affect balance sheet timing



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)