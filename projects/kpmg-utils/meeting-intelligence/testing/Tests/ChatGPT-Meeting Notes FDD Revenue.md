# Meeting Notes FDD Revenue

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:52:53  
**Updated:** 1/8/2026 11:01:13  
**Exported:** 1/8/2026 11:14:40  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd2d5-3d50-833f-b90e-e52776ef6eee](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd2d5-3d50-833f-b90e-e52776ef6eee)  

## Response:
Thought for 6m 8s

FDD Meeting Notes — Revenue Reconciliation \[EXTERNAL\]
=======================================================

*   Date: Not stated in transcript
*   Deal Context:
    *   Purpose: Align on how revenue is produced and reconciled across (1) month-end GL revenue and (2) billing / data-service outputs, including timing cutoffs, “unbilled” dynamics, and the structure of the supporting MySQL/month-end files used to build journal entries.
    *   Participants: Target finance/data team and FDD team (exact titles/affiliations not fully stated).

Attendees & Roles
-----------------

| Name | Role | Affiliation |
| --- | --- | --- |
| Rishi Sharma | Diligence lead / questions on reconciliation | FDD team (affiliation implied; exact org not stated) |
| Mike Mammoliti | Diligence support / process questions | FDD team (affiliation implied; exact org not stated) |
| Phil MacAllister | Deal stakeholder / timing expectations | Not stated |
| Michael Morrison | Walkthrough of month-end file / JE mapping into GL | Not stated |
| Yang Yu | Data compilation / MySQL + pivot-table support | Not stated |

* * *

Revenue Reporting Files, Purpose, and What’s “Booked”
-----------------------------------------------------

### Key Takeaways

*   The file shared for diligence is **not the source used to book revenue**; it is an output used to support and/or explain how month-end numbers tie back to underlying operational/billing data, which affects how any “revenue reconciliation” should be framed.
*   Reconciliation differences are **primarily timing-driven** (cutoffs, late invoice updates, and “unbilled → billed” movement), which increases the risk of drawing conclusions from a single snapshot without matching to the appropriate month-end close version.

### Meeting Notes

**What the shared file is (and isn’t)**

*   The provided file is not used to book revenue; revenue booking is based on the month-end close process and underlying system outputs, with supporting compilation work.
*   The shared file is described as an output that can be traced back to underlying data and used to support the month-end accounting numbers.

**Core driver of differences**

*   The main differences across reporting views were characterized as driven by “day cutoffs” (timing), with agreement from both sides that this is the primary explanation.

### 💡 Insights

*   Timing-based revenue differences often create “false variances” if teams compare (a) operational/billing data extracted mid-cycle vs (b) a locked GL month-end close; the safest reconciliation is version-controlled to the close date.
*   When reconciliation depends on a dataset that is rebuilt “inception-to-date,” it is important to preserve monthly snapshots to avoid restating historical period detail unintentionally.

* * *

Close Timeline, Service-Date Basis, and Inception-to-Date Refresh
-----------------------------------------------------------------

### Key Takeaways

*   Month-end files are produced after the accounting close window (example timeline discussed), implying that any diligence reconciliation must anchor to the same close timing (otherwise “unbilled” and updated invoices will cause gaps).
*   Revenue support is described as built off **service dates through month-end**, refreshed on an inception-to-date basis through the close cutoff.

### Meeting Notes

**Month-end cadence and cutoff example**

*   The process described includes closing a month (example: “May” discussed) and then finalizing after month-end (an example date of “June 6th” was referenced in the discussion of timing).
*   A file is received “inception to date through that point in time,” described as based on services rendered (service-date-driven through the month-end cutoff).

**Inception-to-date mechanics**

*   The month-end file is refreshed to a new inception-to-date number through the closed month-end, and this is part of what drives observed differences when comparing across extracts from different points in time.

### 💡 Insights

*   If operational systems allow late updates (e.g., invoice rebuilds), then a strict “service month” tie-out often requires a controlled extract date plus a consistent rule for how late updates are handled (true-up vs restatement).
*   For diligence, it’s common to request (1) the locked month-end JE support package and (2) the raw detail extract used to generate it, so the bridge is fully auditable.

* * *

Billing Date / Invoice Date Fields and Reliability Limitations
--------------------------------------------------------------

### Key Takeaways

*   Using invoice date as the “billing date” field may be directionally workable, but limitations were noted: invoices can be **updated later**, and some invoices may be issued around cutoff timing in ways that distort month attribution.
*   These limitations directly affect the ability to compute a clean “unbilled” bridge using only invoice-date logic without additional controls or versioning.

### Meeting Notes

**Question on invoice date reliability**

*   A question was raised on whether an “invoice date” field is reliable for determining billing timing and for assigning an accounting month to items.
*   The approach of assigning an accounting month and aligning to the trial balance month was discussed as a potential framework, with the caveat that field behavior can introduce noise.

**Two practical issues called out**

*   Invoices can be updated later, including situations where items billed last month may be rebuilt/updated, producing a new “version” that can shift perceived timing.
*   Invoices may be sent right before cutoff, with processing behavior causing items to appear as “in transition” and impacting reconciliation if relying strictly on invoice date.

### 💡 Insights

*   If “invoice date” can change or invoices can be rebuilt, a better reconciliation key is often a combination of immutable identifiers (encounter/service ID, original service date, payer, location/entity) plus a “posted/closed timestamp.”
*   Controls to request: a change log (if available) for invoice date edits/rebuilds, or a month-end locked extract that includes a “posted date” separate from “invoice date.”

* * *

Unbilled Activity, March Timing Gap, and Operational Drivers
------------------------------------------------------------

### Key Takeaways

*   The large gap referenced for March is consistent with a scenario where a meaningful portion of activity remains “unbilled” at close timing, increasing the risk of misinterpreting period revenue/billing alignment without the correct close package.
*   The process includes waiting to ensure items are “100% correct” before billing in some cases, which can structurally create unbilled balances near month-end.

### Meeting Notes

**March gap discussion**

*   A question was raised about whether a “large gap” between billings and unbilled activity for March (March 2025 was explicitly referenced) was driven by unbilled timing.
*   The explanation given was that during the close of March, there was a timing component where a significant portion could remain unbilled into the latter part of the period/cycle.

**Operational examples referenced**

*   Regional centers and school districts were mentioned in the context of billing timing (context suggests certain billing workflows may drive delays; exact mechanics were not fully detailed in the transcript).
*   It was noted that sometimes items are completed and billed earlier (smaller unbilled), and other times there is not enough time, resulting in items not showing up as billed within that cycle.

**Transcript gap**

*   One portion of the explanation included an unintelligible/obscured term (“\*\*\*\*” captured in the transcript) that may have been important context; this should be clarified.

### 💡 Insights

*   When “unbilled” is material, diligence typically tests (1) whether unbilled reverses quickly in the next month (timing only) vs (2) whether it reflects systematic billing lags or disputes that could affect collectability and revenue quality.
*   A common diligence request is an “unbilled rollforward” by month: opening unbilled + current-period unbilled accrual − billings of prior unbilled = ending unbilled, tied to the month-end JE support.

* * *

MySQL Month-End File Structure, Source Systems, and Journal Entry Build
-----------------------------------------------------------------------

### Key Takeaways

*   The month-end support pack is assembled from **multiple source systems/portals** and then organized via pivot tables and categories; this increases reconciliation complexity and elevates key-person/process risk.
*   The month-end file set is large (explicitly described as ~2GB each), and the reconciliation approach will likely require working with a subset of months first (agreed next step).

### Meeting Notes

**What the MySQL month-end file represents**

*   The “MySQL month” file is described as the compiled data gathered through the supporting work and used to build/map into journal entries.
*   The data is broken up by category due to different systems, and the detailed views were described as pivot-table driven.

**Source systems/portals referenced**

*   Multiple sources were referenced, including “wellagent lumary data,” “appointment financial,” and “regional center billings,” with the broader point being that the data is pulled from respective portals and then summarized into the month-end compilation.
*   The external source is characterized as the underlying operational/billing systems that feed into the compiled month-end support.

**Journal entry structure**

*   Journal entries were described as being made per entity.
*   Adjustments are described as a “combination of adjustments,” with a specific type of adjustment referenced (details not fully captured cleanly in the transcript).

**File size / practicality**

*   The month-end files were described as sizable; “each one is about 2 gigabytes.”

### 💡 Insights

*   Multi-system revenue compilation increases risk of (1) inconsistent mapping rules by entity/system and (2) reconciliation drift if pivot logic changes over time; snapshot/version control is critical.
*   For diligence, it can be useful to request a short “data dictionary” for the month-end MySQL file (tabs, key fields, definitions, refresh logic) to accelerate independent tie-outs.

* * *

Mapping to GL (Sage), Contractual Adjustments, and Reconciliation Approach
--------------------------------------------------------------------------

### Key Takeaways

*   Revenue-related adjustments are mapped into a **contractual adjustment line**, which is important for diligence when separating gross revenue vs contra-revenue and ensuring consistent treatment across entities.
*   An “exact match” tie-out appears to require working through **all JE tabs** because the numbers change as items move from unbilled to billed and as adjustments are made; there was no “easy way around that.”

### Meeting Notes

**Tracing into GL**

*   The process described includes showing the number “in Sage” and tracing back to the MySQL file that supports it.
*   An ODBC pull was referenced as a way to view/support mapping (ODBC explicitly mentioned).

**Contractual adjustments line**

*   When asked where adjustments sit from a GL hygiene perspective, the response was: “Contractual adjustment line.”

**Mapping / summary visibility**

*   A request was made to see a summary mapping that rolls into high-level revenue categories (example: “insurance revenue” referenced).
*   A figure of “80 million” was referenced as an example within the mapping view; the specific period/definition of that number was not fully established in the transcript and should be confirmed.

**Recommended approach to reconcile month-end vs billings**

*   If the goal is to match exactly, the expectation set was that the tie-out must account for the fact that numbers change as items move from unbilled to billed and as adjustments are processed.
*   The key pointer for “matching exactly” was to work through the JE tabs; “All of the JE tabs” were confirmed as the relevant set.

### 💡 Insights

*   If contra-revenue (contractual adjustments) is material, diligence typically requests a rollforward by month/entity showing gross charges, contractuals, net revenue, and cash/AR movements to validate revenue quality and avoid double counting.
*   Where systems are reconciled through JEs, testing a small sample of months end-to-end (source → MySQL → JE → Sage TB/IS) is often the fastest way to validate the mapping logic.

* * *

Next Steps, File Delivery, and Impact on Deliverables
-----------------------------------------------------

### Key Takeaways

*   The agreed path is to start with a limited month set (explicitly “January to March” suggested) so the diligence team can understand structure and define what additional months/data are needed.
*   This reconciliation work is a gating item for finalizing the “revenue adjustment” and how it impacts “pro forma revenue growth” and “location revenue” outputs.

### Meeting Notes

**Data sharing**

*   A plan was stated to place the files in a folder / share drive (explicitly referenced), with coordination involving Phil.
*   The group agreed to start with a couple of months first; “January to March” was proposed.

**Deliverable dependency**

*   It was stated that there are “two gaps” to finalizing: the revenue adjustment and the impact on reflecting pro forma revenue growth (and location revenue growth) that is affected by this adjustment/reconciliation.
*   A timing question was raised about when to anticipate a draft; the response indicated progress can continue on other items, but insight on this topic depends on working through the reconciliation detail.

* * *

Key Findings
------------

### Figures

| Category | Item | Value | Period/Context |
| --- | --- | --- | --- |
| Process / Timing | Example close timing referenced | “June 6th” | Discussed as an example of post-month-end close timing |
| Data / Practicality | Month-end file size | ~2GB each | Described for the shared MySQL/month-end files |
| Revenue mapping (example) | Example value shown in mapping view | “80 million” | Mentioned as an example; definition/period not fully captured |

### Potential Adjustments

| Ref | Item | Category | Type | Brief Rationale |
| --- | --- | --- | --- | --- |
| **QoE1** | Revenue cutoff / unbilled-to-billed timing alignment | EBITDA | Normalize | Billings and “unbilled” can shift as invoices update and items move from unbilled to billed; reconciliation must anchor to the correct month-end close snapshot to avoid timing distortions. |
| **QoE2** | Contractual adjustments classification consistency | EBITDA | Normalize | Adjustments are recorded in a contractual adjustment line; mapping/summary rollups should be validated to ensure consistent gross-to-net revenue presentation across entities and periods. |

### Risks

*   🔴 **Reconciliation volatility from late invoice updates and “unbilled → billed” movement** — Month comparisons can drift unless tied to a locked close snapshot and full JE tab set.
*   🟡 **Process complexity / key-person risk** — The month-end support relies on multi-system portal pulls and pivot-table driven compilation.
*   🟡 **Operational practicality** — Very large files (~2GB each) may slow analysis and increase risk of incomplete review if not scoped to a subset first.

### Contradictions / Gaps

*   The definition and boundaries of the “audit file” vs the month-end MySQL file were discussed, but the naming remains easy to confuse; a crisp taxonomy of “which file is used for what” is still needed.
*   The specific driver behind the March 2025 “large gap” included an unintelligible/obscured phrase in the transcript (“\*\*\*\*”), leaving a key part of the explanation unclear.
*   The “80 million” example value was referenced, but the exact meaning (period, metric, and whether gross vs net) was not established in the transcript.

* * *

Open Items & Follow-Ups
-----------------------

| Priority | Item |
| --- | --- |
| **\[H\]** | Receive the month-end/MySQL support files for **January–March** via the agreed share drive/folder structure, including all JE tabs needed to tie into the GL. |
| **\[H\]** | Provide an end-to-end tie-out example for one month: source portal extract(s) → MySQL compilation/pivots → JE tabs → Sage posting/TB line, with clear identifiers for each step. |
| **\[H\]** | Clarify the March 2025 “large gap” driver with a clean explanation (the transcript contains an unintelligible portion) and identify whether it is primarily timing (unbilled) vs other factors. |
| **\[M\]** | Confirm field definitions and stability for invoice date / billing timing (including how invoice rebuilds or late updates are represented) and whether a “posted/closed” timestamp exists. |
| **\[M\]** | Provide the requested summary mapping/rollup view showing how categories (e.g., insurance revenue) aggregate to the GL, including how contractual adjustments are presented. |
| **\[M\]** | Confirm what the “80 million” example value represents (metric, period, gross vs net, and where it sits in the mapping). |
| **\[L\]** | Provide a short data dictionary / tab guide for the MySQL month-end file (tabs, key fields, refresh logic, and how entity/system segmentation works). |

* * *

📝 Generate Draft Adjustments Memo?



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)