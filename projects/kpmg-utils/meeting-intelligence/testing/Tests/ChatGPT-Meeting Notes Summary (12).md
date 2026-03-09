# Meeting Notes Summary

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:50:40  
**Updated:** 1/8/2026 11:00:57  
**Exported:** 1/8/2026 11:14:16  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd24f-e3ac-833c-b2c4-9f10d678e787](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd24f-e3ac-833c-b2c4-9f10d678e787)  

## Response:
Thought for 43s

FDD Meeting Notes — Transaction Volumes, Take Rate, Chargebacks, and Fraud Losses (SIM-0006)
============================================================================================

*   Date: Not provided in transcript
*   Deal Context:
    *   Target: fintech-payments-platform (codename from file name)
    *   Industry: Fintech / payments platform
    *   Purpose: Deep-dive diligence session for the QoE workstream focused on transaction volumes (TPV), take rate, chargebacks, and fraud losses, including definitions, reporting sources, and follow-up data requests.
    *   Participants: CFO, Head of Risk, Controller, External Advisor(s), Consultant(s)

Attendees & Roles
-----------------

| Name | Role | Affiliation |
| --- | --- | --- |
| (Name not stated) | CFO | Target |
| (Name not stated) | Head of Risk | Target |
| (Name not stated) | Controller | Target |
| (Name not stated) | Consultant | Advisor |
| (Name not stated) | External Advisor | Advisor |

* * *

Systems, Data Flow, and Reporting Sources
-----------------------------------------

### Key Takeaways

*   Reliance on multiple systems plus spreadsheets increases risk of inconsistent “cuts” and definitions, as evidenced by conflicting KPI values that require reconciliation.
*   “Standard month-end package” is the stated source for multiple critical KPIs, but specific report tabs/definitions were not confirmed live and were pushed to follow-up.

### Meeting Notes

**Systems landscape**

*   Transaction volumes, take rate, chargebacks, and fraud losses are owned by the team and flow through multiple systems.
*   Core reporting is described as living “mostly in ERP,” supplemented by a billing platform and “spreadsheets for the edge cases.”

**Primary reporting artifacts**

*   Multiple KPIs (TPV, net take rate, chargeback rate) were stated as coming from the “standard month-end package,” with the exact report tab to be provided via follow-up.

### 💡 Insights

*   Multi-system KPI production (ERP + billing + spreadsheets) may increase the likelihood of definition drift (e.g., count-based vs dollar-based rates) unless a single KPI dictionary and reconciliation control exists.
*   Where “edge cases” live in spreadsheets, auditability and repeatability may depend heavily on ownership, version control, and documented tie-outs.

* * *

Total Payment Volume (TPV) and Growth
-------------------------------------

### Key Takeaways

*   TPV for TTM Sep 2025 is **$3.62bn**, but monthly detail and the exact TPV definition are pending; this limits the ability to validate seasonality and growth claims until schedules are received.

### Meeting Notes

**Reported TPV**

*   Total payment volume (TPV) for **TTM Sep 2025** was stated as **$3.62bn**.

**Growth and operating cadence**

*   Monthly TPV growth in 2025 was described as **1–4%**, with variability by season.

**Cohort / vintage reporting**

*   A monthly TPV cohort by merchant vintage is not currently available “in a clean cohort format”; it can be built but is not something reported today.

### 💡 Insights

*   Cohort-by-vintage TPV can be a useful signal for retention, ramp curves, and concentration risk; absence of a standard cohort view may slow diligence triangulation on growth quality.
*   A defined TPV methodology (what’s included/excluded, gross vs net of refunds/chargebacks, etc.) is often necessary to ensure comparability across periods and to reconcile to revenue/take rate.

* * *

Take Rate and Netting (Gross-to-Net), Including Pass-Through
------------------------------------------------------------

### Key Takeaways

*   Net take rate for TTM Sep 2025 is cited as **0.83%** “after pass-through,” but a conflicting **0.79%** value was also cited; reconciliation is a high-priority diligence item because it impacts revenue yield assumptions.
*   A take rate bridge (gross to net) with pass-through categories is pending and is necessary to confirm what is included in “net take rate.”

### Meeting Notes

**Reported net take rate**

*   Net take rate for **TTM Sep 2025** was stated as **0.83%** and described as “after pass-through.”

**Conflicting take rate values**

*   A discrepancy was raised between **0.83%** and **0.79%** for net take rate in TTM Sep 2025.
*   The difference was attributed to a “different TPV base / netting approach” and/or “a different cut.”
*   The discrepancy was explicitly flagged as an open item pending reconciliation.

**Requested support**

*   A take rate bridge (gross to net) with pass-through categories was requested for delivery by Friday (per the discussion).

### 💡 Insights

*   Take rate discrepancies commonly stem from differences in denominators (TPV definitions), timing (posted vs settled), and netting (pass-through fees, refunds, disputes); resolving the “KPI math” early can prevent downstream model inconsistencies.
*   A gross-to-net bridge can also help confirm whether netted items affect EBITDA (true pass-through) versus representing economic costs borne by the platform.

* * *

Interchange Revenue Recognition (Gross vs Net)
----------------------------------------------

### Key Takeaways

*   Interchange revenue for FY2025 YTD was cited as **$12.7m** and described as “recognized net,” but the governing policy memo (gross vs net) is pending; this is important for consistent revenue presentation and comparability.

### Meeting Notes

**Reported interchange revenue**

*   Interchange revenue for **FY2025 YTD** was stated as **$12.7m** and described as “recognized net.”

**Policy documentation request**

*   An “Interchange revenue policy memo (gross vs net)” was requested for delivery by next Tuesday.

### 💡 Insights

*   Net vs gross conclusions for interchange can affect revenue presentation (and gross margin) even when EBITDA is unchanged; having a clear policy and consistent application matters for diligence comparability across periods.

* * *

Chargebacks, Disputes, and Win Rate
-----------------------------------

### Key Takeaways

*   Chargeback rate for Q3 2025 was cited as **0.34%** (as % of transactions), but **0.29%** was also cited from a different cut; reconciling count-based vs dollar-based rates is critical to assess true dispute exposure and network/processor risk.
*   Dispute win rate for Q3 2025 was cited as **41%** (chargebacks reversed), which is a key lever in net chargeback loss outcomes.

### Meeting Notes

**Reported chargeback rate**

*   Chargeback rate for **Q3 2025** was stated as **0.34%** “as % of transactions.”

**Conflicting chargeback rate values**

*   A discrepancy was raised between **0.34%** and **0.29%** for the Q3 2025 chargeback rate.
*   The difference was attributed to “count-based vs dollar-based rate” and/or being a “different cut.”
*   The discrepancy was explicitly flagged as an open item pending reconciliation.

**Dispute win rate**

*   Dispute win rate for **Q3 2025** was stated as **41%**, described as “chargebacks reversed.”

**Requested support**

*   A chargebacks report for Q3 2025 including both counts and dollars was requested for delivery by Wednesday.

### 💡 Insights

*   Chargeback “rate” definitions vary (count-based vs $-based); ensuring consistent definitions is important because the operational impact (case volumes) and financial impact (loss dollars) can move differently.
*   Win rate can materially influence net loss outcomes; pairing win rate with loss severity and recovery mechanics typically improves the diligence view.

* * *

Fraud Losses and Recoveries
---------------------------

### Key Takeaways

*   Fraud losses for FY2025 YTD (through Sep) were cited as **$1.9m net of recoveries**, but a first-party vs third-party split is not readily available and will be provided as a best-effort offline breakdown; this limits immediate clarity on underlying fraud drivers.

### Meeting Notes

**Reported fraud losses**

*   Fraud losses for **FY2025 YTD (through Sep)** were stated as **$1.9m**, described as “net of recoveries.”

**Fraud categorization limitations**

*   A request was made to break fraud losses into first-party vs third-party fraud.
*   The response indicated the team can approximate, but “categorization isn’t perfect” and a “best-effort breakdown” would be sent offline.

**Requested support**

*   Fraud losses detail and recoveries (FY2025 YTD) were requested for delivery by Friday.

### 💡 Insights

*   If fraud categorization is imperfect, remediation may require clearer tagging rules and linkage between case management tooling and finance recognition to improve driver-level analytics.
*   Net-of-recoveries reporting is useful, but diligence often benefits from a clear gross loss, recovery rate, and lag profile to understand forward-looking exposure.

* * *

Merchant Reserves, Underwriting, and Onboarding Timing
------------------------------------------------------

### Key Takeaways

*   Reserve holds for high-risk merchants were cited as **3–7%** depending on underwriting; policy and exceptions documentation is pending and can be important for assessing potential trapped cash, exposure management, and operational controls.
*   Onboarding time in 2025 was cited as **2–10 business days** dependent on KYC; variability suggests process outcomes may differ by merchant risk profile and documentation quality.

### Meeting Notes

**Reserve holds**

*   Typical reserve hold range for high-risk merchants was stated as **3–7%**, dependent on underwriting.

**Onboarding**

*   Onboarding time for 2025 was stated as **2–10 business days**, dependent on KYC.

**Requested support**

*   Merchant reserve policy and a top exceptions list were requested for delivery by Friday.

### 💡 Insights

*   Reserve policies and exceptions are often a key diligence input for understanding credit/fraud risk posture and potential classification questions (e.g., customer funds / reserves) depending on how balances are held and reported.
*   Wide onboarding ranges can be consistent with risk-tiered KYC, but diligence typically benefits from clarity on what drives outliers and whether any backlog or manual bottlenecks exist.

* * *

KPI Definitions, Calendar vs Fiscal, Gross vs Net, Cadence, and Controls
------------------------------------------------------------------------

### Key Takeaways

*   Several KPI definition questions (gross vs net, fiscal vs calendar, weekly vs month-end availability) were repeatedly characterized as “messy” and deferred to offline definition sharing; this is a process/control risk for diligence and ongoing reporting consistency.
*   Controls around “one-off items” and adjustments were described as manual with manager sign-off followed by finance review, but the metric being discussed (and whether it is tracked weekly vs monthly) was not cleanly resolved live.

### Meeting Notes

**Controls / approval workflow**

*   Approval for the referenced items/adjustments was described as manual: “manager signs off, then finance reviews.”

**Gross vs net characterization**

*   The metric being discussed was repeatedly described as “gross,” with the note that “net would be a little lower.”
*   The group indicated they could follow up with a schedule to clarify the gross-to-net relationship.

**Fiscal vs calendar basis**

*   The basis was repeatedly described as “fiscal,” with the ability to map to calendar “if you need,” and in multiple places a commitment to confirm and circle back.

**Cadence (weekly vs month-end)**

*   Availability was repeatedly described as primarily monthly: “we only really have it monthly; weekly is directional.”

**Definition gaps**

*   When pressed for definition (“Can you define what you mean by that metric?”), responses included:
    *   “It’s not perfect—don’t quote me, but that’s the right order of magnitude.”
    *   “Honestly it’s messy; we should take it offline and send the exact definition.”
*   Multiple participants indicated they would “pull the report after this call” and/or “confirm and circle back” with exact definitions and schedules.

### 💡 Insights

*   Repeated uncertainty around KPI definitions during diligence can indicate the need for a formal KPI dictionary and standardized reporting package tie-outs (especially when different teams look at different “cuts”).
*   A documented reconciliation between weekly “directional” and month-end “actual” can help reduce surprises in trend analysis and variance explanations.

* * *

Key Findings
------------

### Figures

| Category | Item | Value | Period/Context |
| --- | --- | --- | --- |
| Volume | Total payment volume (TPV) | **$3.62bn** | TTM Sep 2025 |
| Pricing | Net take rate | **0.83%** | TTM Sep 2025; after pass-through |
| Pricing | Net take rate (alternate cut) | **0.79%** | TTM Sep 2025; reconciliation needed |
| Risk | Chargeback rate | **0.34%** | Q3 2025; as % of transactions |
| Risk | Chargeback rate (alternate cut) | **0.29%** | Q3 2025; reconciliation needed |
| Risk | Dispute win rate | **41%** | Q3 2025; chargebacks reversed |
| Risk | Fraud losses | **$1.9m** | FY2025 YTD through Sep; net of recoveries |
| Revenue | Interchange revenue | **$12.7m** | FY2025 YTD; recognized net |
| Risk policy | Reserve hold (high-risk merchants) | **3–7%** | Typical range; underwriting-dependent |
| Ops | Onboarding time | **2–10 business days** | 2025; KYC-dependent |
| Volume | Monthly TPV growth | **1–4%** | 2025; seasonal variability noted |

### Risks

*   🔴 **KPI definition and reconciliation gaps (take rate; chargeback rate; “gross vs net” metrics)** — Conflicting values (0.83% vs 0.79%; 0.34% vs 0.29%) and repeated “messy” definition comments create diligence risk until reconciled and documented.
*   🟡 **Multi-system + spreadsheet dependence** — ERP + billing platform + spreadsheets for edge cases may increase the risk of inconsistent reporting cuts and reduce auditability without documented tie-outs.
*   🟡 **Fraud taxonomy limitations** — First-party vs third-party split is only “best-effort” and not currently cleanly categorized, limiting driver-level assessment.

### Contradictions / Gaps

*   Net take rate for TTM Sep 2025 cited as **0.83%** vs **0.79%** (different TPV base / netting approach; different cut); open item pending reconciliation.
*   Chargeback rate for Q3 2025 cited as **0.34%** vs **0.29%** (count-based vs dollar-based rate; different cut); open item pending reconciliation.
*   Multiple repeated requests for metric definitions (gross vs net; fiscal vs calendar; weekly vs month-end) were not resolved live and deferred to offline definition/schedule.

* * *

Open Items & Follow-Ups
-----------------------

| Priority | Item |
| --- | --- |
| **\[H\]** | Reconcile net take rate for TTM Sep 2025 (**0.83%** vs **0.79%**) and document the exact TPV denominator and netting approach used in each cut. |
| **\[H\]** | Reconcile Q3 2025 chargeback rate (**0.34%** vs **0.29%**) and confirm count-based vs dollar-based definitions; provide a single agreed KPI definition for diligence. |
| **\[H\]** | Provide TPV by month (Jan–Sep 2025) and the TPV definition (requested by Friday). |
| **\[H\]** | Provide take rate bridge (gross to net) with pass-through categories (requested by Friday). |
| **\[H\]** | Provide chargebacks report for Q3 2025 with counts and dollars (requested by Wednesday). |
| **\[H\]** | Provide fraud losses detail and recoveries for FY2025 YTD (requested by Friday). |
| **\[M\]** | Provide best-effort fraud losses breakdown into first-party vs third-party fraud, including explanation of categorization limits. |
| **\[M\]** | Provide interchange revenue policy memo (gross vs net) (requested by next Tuesday). |
| **\[M\]** | Provide merchant reserve policy and top exceptions list (requested by Friday). |
| **\[M\]** | Provide a written definition and schedule for the “gross vs net” metric discussed (including whether it is tracked weekly vs month-end and fiscal vs calendar mapping). |
| **\[L\]** | Build and share a monthly TPV cohort by merchant vintage (not currently in a clean cohort format) and confirm whether it will become a standard reporting view. |

📝 Generate Draft Adjustments Memo?

## Response:
Thought for 39s

Thought for 7s

Thought for 1m 2s

Thought for 1m 11s

Thought for 17s

Thought for 1m 8s

Draft Adjustments Memo — fintech-payments-platform (SIM-0006)
=============================================================

EBITDA Adjustments (Diligence)
------------------------------

**QoE1: Take rate / TPV denominator reconciliation (pass-through netting consistency)**

Conflicting “net take rate” values for the same period suggest different TPV bases and/or netting approaches are being used across reporting cuts. This is not a confirmed EBITDA adjustment yet, but it is a high-priority diligence item because take rate math drives revenue yield and could reveal inconsistent treatment of pass-through items across periods or reports.

*   “0.83 % for TTM Sep 2025. After pass-through.” — CFO
*   “for Net take rate in TTM Sep 2025, is it 0.83 or 0.79?” — Consultant
*   “I have 0.83 % in my file. Different TPV base / netting approach.” — CFO
*   “I might be looking at a different cut—I've got 0.79 %.” — Controller
*   “Okay—flag that. We'll treat it as an open item until we reconcile.” — External Advisor

**Request:** Take rate bridge (gross to net) with pass-through categories; TPV by month (Jan–Sep 2025) and TPV definition; “standard month-end package” report tab references for both TPV and take rate.

**Setup:**

*   Revenue (take rate) — **No EBITDA bridge entry until reconciliation is complete**; use as a consistency check that could surface a reclass or error correction.
*   Pull the take rate bridge (gross to net) and the underlying TPV denominator used for each “cut” (0.83% vs 0.79%).
*   Recompute take rate for TTM Sep 2025 using a single, agreed TPV definition and a consistent netting policy for pass-through.
*   If differences are driven by accounting (not just KPI math), identify whether any pass-through items are being treated inconsistently across periods (e.g., netted in revenue in one cut but recognized separately in another) and determine whether an error correction or reclass is needed.

* * *

**QoE2: Interchange revenue net vs gross presentation (policy confirmation)**

Interchange is explicitly described as “recognized net,” but the underlying policy memo is a requested follow-up. This is primarily a revenue presentation / consistency check (potentially impacting revenue and gross margin presentation), not a confirmed EBITDA adjustment.

*   “12.7 $m for FY2025 YTD. Recognized net.” — Controller
*   “Can you send Interchange revenue policy memo (gross vs net) by next Tuesday?” — External Advisor
*   “Yep—I’ll send that by next Tuesday.” — Controller

**Request:** Interchange revenue policy memo (gross vs net); interchange revenue detail that supports the FY2025 YTD **$12.7m** figure and shows any offsetting fees/costs (if applicable).

**Setup:**

*   Revenue (Interchange) — **No EBITDA adjustment expected if this is purely gross vs net presentation**, but confirm consistency and document treatment.
*   Pull the interchange revenue detail for FY2025 YTD and identify what is included/excluded under “recognized net.”
*   Confirm whether any offsetting amounts (e.g., network/processor fees tied to interchange) are recorded elsewhere in the P&L and whether treatment is consistent period to period.
*   Document conclusions for diligence: net presentation policy, consistency across periods, and any reclass needed for comparability.

* * *

**QoE3: Chargeback metric definition alignment (count-based vs dollar-based) and reporting cut reconciliation**

Chargeback rate was stated as **0.34%** for Q3 2025, but an alternate cut shows **0.29%** with a stated driver of count-based vs dollar-based measurement. This is not a confirmed EBITDA adjustment, but the reconciliation is necessary to properly interpret dispute exposure and any related loss economics.

*   “0.34 % for Q3 2025. As % of transactions.” — Head of Risk
*   “I have 0.34 % in my file. Count-based vs dollar-based rate.” — Head of Risk
*   “I might be looking at a different cut—I've got 0.29 %.” — CFO
*   “Okay—flag that. We'll treat it as an open item until we reconcile.” — External Advisor
*   “Can you send Chargebacks report (Q3 2025) with counts and dollars by Wednesday?” — External Advisor
*   “Yep—I’ll send that by Wednesday.” — Head of Risk

**Request:** Chargebacks report (Q3 2025) with counts and dollars; definition of the numerator/denominator for both “0.34%” and “0.29%” cuts; “standard month-end package” report tab reference used for the metric.

**Setup:**

*   Chargebacks / dispute losses — **No EBITDA bridge entry until metric and underlying dollars are aligned**; treat as a diligence driver for loss normalization and risk assessment.
*   Pull Q3 2025 chargeback counts and chargeback dollars, plus the base (transaction counts and TPV dollars) used in each rate.
*   Recalculate both a count-based rate and a dollar-based rate using a single underlying dataset.
*   Confirm which definition is used in management reporting and which (if any) ties to finance-recognized losses or accruals.

* * *

**QoE4: Fraud losses “net of recoveries” composition and first-party vs third-party split (data quality / classification check)**

Fraud losses were stated as **$1.9m** FY2025 YTD (through Sep), “net of recoveries,” and the first-party vs third-party split is acknowledged as approximated with imperfect categorization. This is not a confirmed EBITDA adjustment, but it is a key diligence item to understand the underlying drivers and ensure recoveries are treated consistently.

*   “So, 1.9 $m for FY2025 YTD (through Sep). Net of recoveries.” — Head of Risk
*   “Yeah, can you break fraud losses into first-party vs third-party fraud?” — Consultant
*   “Sorry, we can approximate it, but categorization isn't perfect—I'd rather send a best-effort breakdown offline.” — Head of Risk
*   “Can you send Fraud losses detail and recoveries (FY2025 YTD) by Friday?” — External Advisor
*   “Yep—I’ll send that by Friday.” — Head of Risk

**Request:** Fraud losses detail and recoveries (FY2025 YTD through Sep); best-effort first-party vs third-party fraud breakdown with methodology/limitations.

**Setup:**

*   Fraud losses / recoveries — **No EBITDA adjustment proposed until gross vs recovery components are reviewed**; objective is driver clarity and consistent period treatment.
*   Pull fraud loss transactions (gross losses) and the related recovery entries (with dates and amounts) that net to the reported FY2025 YTD figure.
*   Separate gross losses from recoveries to understand recovery rate and whether recoveries are operationally recurring or represent unusual items.
*   Build a best-effort tagging of fraud losses into first-party vs third-party based on available fields, explicitly documenting gaps/limitations noted by the team.

* * *

Net Debt Adjustments
--------------------

**ND1: Merchant reserve holds — potential trapped cash / SPA treatment item (needs balance sheet mapping)**

Reserve holds were described as **3–7%** for high-risk merchants and a reserve policy + exceptions list was requested. The transcript does not state how reserves are held or presented on the balance sheet, so this is a diligence item to confirm whether any reserve balances are debt-like, restricted, or otherwise treated as excluded/included in net debt under the SPA definition.

*   “Yeah, 3–7 % for high-risk merchants. Depends on underwriting.” — Head of Risk
*   “Can you send Merchant reserve policy and top exceptions list by Friday?” — External Advisor
*   “Yep—I’ll send that by Friday.” — Head of Risk

**Request:** Merchant reserve policy; top exceptions list; reserve balance schedule (by month and as-of close) and explanation of where reserves sit on the balance sheet (accounts and legal structure).

**Setup:**

*   Net debt / debt-like vs restricted cash — **Classification assessment** (no numerical adjustment until balances and accounting are confirmed).
*   Pull a schedule of reserve balances (high-risk merchant reserves and any other reserve types) as of key dates used in diligence.
*   Confirm the accounting presentation (cash vs restricted cash vs liability vs other) and whether reserves are legally restricted or customer-owned funds.
*   Map the reserve balances to SPA net debt definitions to determine inclusion/exclusion and any completion mechanics (e.g., trapped cash or debt-like liability treatment).



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)