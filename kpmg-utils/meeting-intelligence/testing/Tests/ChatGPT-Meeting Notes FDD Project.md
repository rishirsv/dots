# Meeting Notes FDD Project

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:52:32  
**Updated:** 1/8/2026 11:05:59  
**Exported:** 1/8/2026 11:14:35  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd2c0-9cc0-833f-ba98-8b59f58f362a](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd2c0-9cc0-833f-ba98-8b59f58f362a)  

## Response:
Thought for 3m 9s

Thought for 45s

Thought for 1m 5s

Thought for 58s

Thought for 1m 53s

Thought for 2m 34s

FDD Meeting Notes — Project Lebron (Billings / Revenue / Cash Reconciliation)
=============================================================================

*   Date: Not stated in transcript
*   Deal Context:
    *   Target: Project Lebron (codename)
    *   Industry: Healthcare / payer reimbursement context (insurance, regional centers, schools referenced)
    *   Purpose: Align the billings file, payments file, and bank/cash support to validate (i) revenue/collection timing used in the QoR “waterfall” and (ii) tie-outs back to the trial balance / GL.
    *   Participants: Mike Mammoliti, Jeff Nader, Yang Yu, Phil MacAllister, Michael Morrison, Vivien Lieu (roles/affiliations not stated)

Attendees & Roles
-----------------

*   Mike Mammoliti
*   Jeff Nader
*   Yang Yu
*   Phil MacAllister
*   Michael Morrison
*   Vivien Lieu

* * *

Revenue, Billing, Collections & Cash Reconciliation
---------------------------------------------------

### Key Takeaways

*   The “collection date” in the billings file can reflect the _latest system activity_ (e.g., reversals/adjustments) rather than the _true cash receipt date_, which can mis-time collections in the QoR waterfall and any period-based cash conversion analysis.
*   The payments file functions as a **movement-level ledger** (corrections, reprocesses, recoupments), not a pure cash ledger; isolating true cash requires **rules + testing** and likely **bank matching**.
*   Matching to bank activity appears most feasible when a **payment control number / EFT reference** exists, but coverage is partial (discussion referenced ~**62%** addressable under that approach).
*   A known operational disruption (Change Healthcare crash timeframe referenced around Feb–May 2024, with issues noted March–July/Aug 2024) led to **manual posting** and later **patch/reversal activity**, creating period “noise” (including larger variances around May 2024).

### Meeting Notes

**Objective and “three-way” reconciliation framing**

*   The workstream goal is to triangulate: (1) billings data → QoR waterfall (invoice/service timing vs collection timing), (2) billings/revenue logic → revenue recognition period alignment, and (3) cash/bank recs → trial balance / GL tie-out.
*   A core question driving the meeting: whether the cash “came in when it’s said to have come in” for the relevant period, and how to bridge the payment file to the billings file so the full chain can tie back to the GL.

**Scope/coverage of the payments file vs the billings file**

*   The payments file does **not** cover all cash/billing streams that exist in the billings file.
*   Coverage observations discussed (from a lookback starting around the system change):
    *   ~**28%** of district billings were included in the payments dataset.
    *   “Almost **100%**” of private insurance was included in the payments dataset.
    *   **No** private pay or regional center activity was included in the payments dataset.
    *   ~**85%** of self-determination was included in the payments dataset.
    *   These coverage stats were described as evaluated from **December 2023 onward**, aligned to “when the system change happened.”

**How the team compared collection dates across files**

*   Billings file has **one** “collection date” per billing/claim, while the payments file can show **multiple collection-related dates** (multiple movements) for the same underlying item.
*   A cross-tab / lookup approach was used: for each payment ledger record, compare:
    *   The single billings-file collection date, vs.
    *   The set of payments-file collection dates (multiple possible).
*   Result: the “vast majority” aligns to the **same month**, but meaningful exceptions exist where the payments-file dates occur **before** or **after** the billings-file date.

**July 2024 example (month allocation and variance)**

*   A July 2024 view was used to illustrate how totals shift depending on whether billings-file dating or payments-file dating is used.
*   Discussion points captured:
    *   A July 2024 total of **$5M** was referenced in the view being discussed (clarified as coming from the **payments file** view being used at that moment).
    *   Of the total, about **$4.8M** was allocated to July in the payments-based spread, with additional amounts allocated into prior months (examples referenced: **$143** in December, **$121** in January, **$149** in February, etc.).
    *   For the broader QoR dataset being used, total collections were referenced at **$5.555M**, with **$4.8M** collected in July per the payments-file spread and the remainder collected earlier.

**Trend in variances over time**

*   Variances between the billings dataset and payments dataset were described as **larger in earlier months** (leading up to around **October 2024**).
*   After that, the variance “settles” closer to **~1–2%** between collection totals derived from the two datasets, indicating an apparent improvement in alignment over time (or fewer disruptive adjustments).

**Example 1: Multiple payment ledger lines (correction / reversal behavior)**

*   A claim example showed **four** payments-file lines:
    *   A charge of **161** and **13277** in **March 2024** (amount formatting unclear in transcript; captured as stated).
    *   A negative payment in **April 2024**.
    *   A further negative payment in **July 2024**.
*   The key issue: the billings file’s single collection date for the item appeared to be **July 2024**, which corresponded to the “latest” adjustment/reversal activity rather than the actual March receipt timing.
*   Clarifications on what the payments ledger represents:
    *   The net received cash for the example was stated as **$161.40**.
    *   The set of line items reflected a **payment correction** / error fix, with the instruction to evaluate the **whole payment ledger** rather than a single line.
    *   The payments ledger can contain correction, reprocess, and recoupment movements; it is not a direct “cash moved” log by line item.
*   A direct implication called out: using the billings-file collection date as-is could make it look like collections were received **later** than they truly were (e.g., March receipt being shown as July).

**Posting date vs cash deposit date (and why gaps occur)**

*   A structural gap was described between what is recorded as a posting date (e.g., on ERA/EOB) and the actual cash deposit date in the bank.
*   Example pattern: check date can be in one month (e.g., March), while the cash deposit may not hit the bank until the **next month**.
*   Similar timing gaps were referenced for “schools.”

**Payment control number / EFT reference as a matching key**

*   A payment control number was highlighted on one line item (and absent on others), prompting the idea to use it to identify true cash receipts.
*   Limitation: payment control numbers are available **only for certain payers**, not universally.
*   Proposed approach direction:
    *   Where payment control number / EFT exists: use it as a first step to identify **valid cash transactions** vs administrative adjustments, and match to bank activity.
    *   Where it does **not** exist: isolate those populations and perform targeted testing to identify an alternate methodology; avoid defaulting all such items to the “latest” date without evidence, as it could incorrectly push collections out by months.

**Coverage constraint and “missing bucket”**

*   The discussion referenced that only about **62%** of payments might be addressable for “collection date adjustment” under the control-number-driven approach given current coverage.
*   For non-insurance collections (regional centers, district, self-determination, private pay), it was reiterated that these categories behave differently and/or are not in the payments file.
*   A major data gap was flagged: regional center was described as a large bucket (referred to as **$50M**) for which there is **no payments/collections detail** in the payments dataset provided.

**Regional center / district payout mechanics vs insurance**

*   Regional center checks were described as generally “cleaner”:
    *   They issue a transaction; the company receives the payment.
    *   If reprocessing is needed, it is typically netted cleanly in the next payment.
    *   The “multiple dates for the same claim” pattern seen in insurance was described as less prevalent for regional center.
*   However, timing differences between “payment issued date” and bank settlement still exist (days of lag that can straddle months), but these were framed as less concerning than multi-month reversals/patch behavior.

**Example 2: Recoupment netting behavior**

*   A second example was used to explain how multiple ledger lines can represent netting:
    *   A scenario described as: take out **120** and pay **270**, resulting in a net payment outcome (net described as **110**).
    *   The bank would likely show a **lump sum** reflecting the net amount, not separate cash lines for each ledger component.
    *   The key instruction: “add everything together” at the ledger level to interpret what was actually paid.

**Example 3: Manual post / mispost flag**

*   Another example showed a mismatch where billings file showed a June 2024 collection date, with a large negative entry referenced (captured as stated: **174671** / “174,000” mentioned elsewhere in the discussion).
*   The net payment was confirmed as **$204**, and was discussed as received on **March 6** in the example view.
*   The check date for the item was stated as in **June** (creating confusion relative to the March receipt reference).
*   The large negative entry was described as a **manual post** and “most likely a mispost,” with a commitment to review after the meeting and correct if needed.

### 💡 Insights

*   In healthcare RCM datasets, it’s common for operational ledgers (ERA/EOB posting, claim adjustments, recoupments) to diverge from actual cash timing; bank matching is often the most defensible anchor for “cash received date.”
*   Periods of clearinghouse disruption can create systematic artifacts (manual posts + later batch reversals) that can look like volatility in collections timing even when underlying cash is stable; isolating those periods can prevent overstating structural DSO/cash conversion issues.
*   A “single collection date” field in a billing extract often reflects the most recent posting activity rather than initial settlement; for QoR waterfalls, a rules-based “first cash date” vs “net cash date” concept may be needed depending on analysis goals.

* * *

Systems, Processes & Controls
-----------------------------

### Key Takeaways

*   The system change around **December 2023** is a key demarcation for what is included/extracted in the payments file and how posting/collection fields behave.
*   Manual posting during the Change Healthcare crash, followed by backend patching/reversals, creates a known period where ledger dates may be unreliable without bank support.

### Meeting Notes

**System change timing**

*   Payment dataset coverage and evaluation period were explicitly tied to a **December 2023** system change.

**Change Healthcare crash and manual posting**

*   During the crash period, it was described that some payments “won’t be posted,” prompting **manual posting** activity.
*   After the clearinghouse issue was resolved, a “bunch of ERAs” were received, creating a risk of **duplicate posting**.
*   A payer/system patch process was described:
    *   A backend reversal was executed using a “patch date” (not necessarily aligned to true cash timing).
    *   This behavior was expected to drive relatively large variances (explicitly referenced as showing up in **May 2024**).

**Expectation of timing issues by period**

*   It was suggested that more issues are expected roughly **March–July/August 2024**, with “cleaner” behavior subsequently.

* * *

Working Capital & Cash Conversion Implications
----------------------------------------------

### Key Takeaways

*   Without correcting for posting/patch behavior, any DSO / cash conversion narrative built from billings-file “collection date” risks being directionally wrong (collections could appear later than actual cash).
*   Any methodology to “normalize” collection dates must avoid mechanical rules (e.g., always use latest date) and instead be supported by bank matching and payer-specific logic.

### Meeting Notes

*   The main tension is identifying the “true collection date” across cases where:
    *   The earliest movement may represent true cash receipt, while later movements may be administrative reversals/corrections, or
    *   Later movements may reflect the real net settlement depending on recoupment and patching behavior.
*   A practical path forward emphasized during the discussion:
    *   Use **bank statements / PDF** plus **Excel bank transaction detail** to anchor the actual cash date, especially when an EFT reference exists.
    *   Test a sample set (half-dozen to a dozen examples) to converge on a small number of root-cause patterns and rules.

* * *

Key Findings
------------

### Figures

| Category | Metric | Value | Period / Notes |
| --- | --- | --- | --- |
| Coverage | District billings included in payments dataset | **28%** | Evaluated from Dec 2023 onward |
| Coverage | Private insurance included in payments dataset | **~100%** | Evaluated from Dec 2023 onward |
| Coverage | Self-determination included in payments dataset | **~85%** | Evaluated from Dec 2023 onward |
| Coverage | Private pay / Regional center in payments dataset | **None** | Explicitly stated |
| Month example | July 2024 total referenced in view | **$5M** | Discussed as in the payments-file view |
| Month example | Portion collected in July (payments-based spread) | **$4.8M** | Remainder allocated to earlier months |
| QoR dataset | Total collections referenced | **$5.555M** | Used in QoR workstream dataset |
| Matching feasibility | Addressable via control number/EFT logic | **~62%** | Stated as current coverage for that approach |
| Data gap | Regional center bucket referenced | **$50M** | No payments/collections detail in payments file |

### Potential Adjustments

| Ref | Short name | Type | Treatment | Rationale |
| --- | --- | --- | --- | --- |
| WC1 | Collections timing normalization for cash conversion | WC | Normalize | Billings-file “collection date” can reflect administrative/patch activity, not bank cash timing; may distort period allocation and DSO narrative. |

### Risks

*   🔴 **Collection date field may not represent true cash receipt** — Could mis-time collections in QoR waterfall and undermine reconciliation confidence if not normalized/validated to bank activity.
*   🔴 **Payments file is not a cash ledger** — Corrections/recoupments/reprocess entries can be misinterpreted as cash movement without rules and testing.
*   🟡 **Partial identifier coverage (control number/EFT)** — Only a portion of activity can be bank-matched cleanly; methodology for the remainder must be defensible.
*   🟡 **Change Healthcare crash artifacts** — Manual posting + patch-date reversals can create period spikes (e.g., May 2024) that look like economic volatility.

### Contradictions / Gaps

*   Lack of a confirmed rule for “true collection date” selection when multiple payments-ledger dates exist and no payment control number is present.
*   Conflicting signals in the example where net payment was confirmed as **$204** and discussed as received **March 6**, while a **June** check date was also referenced; needs reconciliation to bank activity and posting mechanics.
*   Large negative entry referenced (~**174,000** / **174671**) was flagged as a likely mispost but not yet resolved/quantified.

* * *

Open Items / Follow-Ups
-----------------------

| Priority | Item |
| --- | --- |
| **\[H\]** | Use bank transaction detail (Excel + PDF statements) to anchor true cash dates for a sample set; confirm how EFT/control numbers map to bank lines. |
| **\[H\]** | Develop and document a rule-set for deriving “true collection date” from the payments ledger (cash vs admin adjustments), supported by sample testing. |
| **\[H\]** | Investigate and resolve the flagged manual post / likely mispost tied to the large negative entry (referenced ~174k/174671); correct the posting if confirmed. |
| **\[M\]** | Isolate and explain the May 2024 variance behavior tied to Change Healthcare crash manual posting and later patch-date reversals; quantify how much of variance is “artifact.” |
| **\[M\]** | For items without payment control number, isolate that population and test whether earliest vs latest payments-ledger date better approximates cash timing (avoid mechanically pushing to latest date). |
| **\[M\]** | Confirm treatment for non-insurance buckets missing from payments file (regional center, district, private pay) and how to reconcile those to bank/GL given lack of payments detail. |
| **\[L\]** | Validate that all requested information has been delivered beyond the initial Jan–May focus and that roll-forward through July is complete (confirm nothing missing in transition). |

📝 Generate Draft Adjustments Memo?



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)