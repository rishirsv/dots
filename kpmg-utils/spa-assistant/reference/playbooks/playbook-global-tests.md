# Global Tests (Always-On)

These tests run on every Full FDD Review to catch cross-term misalignment.

---

## GT-01

test_id: GT-01  
what_to_detect: Multiple cut-off times (“Reference Time”, “Calculation Time”, “Closing Time”) applied differently across Cash/Debt/WC/Expenses  
why_it_matters: Misaligned cut-offs let timing (not economics) drive the adjustment and invites disputes.  
counsel_question: Confirm the single cut-off/measurement time and that it applies to all adjustment inputs and statements.  
rebuttal/fallback: A single cut-off prevents timing arbitrage; if multiple closings exist, allocate the gap economics explicitly.  
minimal_edit: “Reference Time” means 11:59 p.m. on the day immediately prior to Closing~~.~~ **All calculations of Cash, Indebtedness, Net Working Capital and Transaction Expenses shall be made as of the Reference Time.**

---

## GT-02

test_id: GT-02  
what_to_detect: No formula-level “without duplication” / overlap control across adjustment inputs  
why_it_matters: The same item can reduce price twice (e.g., deducted as both Debt and Working Capital).  
counsel_question: Add a formula-level no-duplication rule applying to all adjustment calculations.  
rebuttal/fallback: One sentence avoids costly disputes and prevents double recovery without changing intended economics.  
minimal_edit: All calculations of Cash, Indebtedness, Net Working Capital, Transaction Expenses and Taxes shall be made ~~as set forth herein~~ **on a basis without duplication**.

---

## GT-03

test_id: GT-03  
what_to_detect: Accounting hierarchy unclear (GAAP vs past practice vs sample schedules/templates)  
why_it_matters: Parties can argue different “correct” numbers using different standards, delaying settlement.  
counsel_question: Confirm the order of priority and what controls in a conflict.  
rebuttal/fallback: If GAAP controls, align templates; if templates control, say so to avoid disputes.  
minimal_edit: The Closing Statement shall be prepared in accordance with ~~GAAP~~ **the following order of priority: (i) this Agreement, (ii) the Sample Statements, (iii) past practice, and (iv) GAAP**.

---

## GT-04

test_id: GT-04  
what_to_detect: No classification lock / “no reclass” / “no hindsight” across Cash/Debt/WC/Expenses  
why_it_matters: Post-close bucket shifting can change the adjustment outcome without any real economic change.  
counsel_question: Add a no-reclass and no-hindsight rule for adjustment calculations.  
rebuttal/fallback: Allows correction of manifest error while preventing opportunistic reclassification.  
minimal_edit: No item shall be reclassified between Cash, Indebtedness, Net Working Capital and Transaction Expenses~~.~~ **, except to correct manifest error.**

---

## GT-05

test_id: GT-05  
what_to_detect: Restricted Cash included in Cash without availability test; overdrafts not routed to exactly one bucket  
why_it_matters: Buyer can pay for trapped cash or double count negative balances.  
counsel_question: Confirm Restricted Cash availability test and overdraft routing (Cash vs Indebtedness).  
rebuttal/fallback: Include only freely transferable restricted cash and specify overdrafts as Indebtedness (or negative Cash), but not both.  
minimal_edit: For avoidance of doubt, bank overdrafts shall be treated as ~~negative Cash~~ **Indebtedness**.

---

## GT-06

test_id: GT-06  
what_to_detect: Transaction Expenses overlap with Indebtedness, Working Capital, and/or Taxes (no “to the extent included” carve-outs)  
why_it_matters: Deal costs can be deducted multiple times or shifted between buckets.  
counsel_question: Add an overlap carve-out so any cost is captured once across Debt/WC/Expenses/Taxes.  
rebuttal/fallback: Keeps the intended cost allocation while preventing double counting.  
minimal_edit: Transaction Expenses shall exclude any amounts to the extent included in Indebtedness or Net Working Capital~~.~~ **, in each case, without duplication.**

---

## GT-07

test_id: GT-07  
what_to_detect: Tax accruals appear in Working Capital and also in tax settlement/indemnity (double count)  
why_it_matters: Seller can end up paying the same pre-close tax twice through two different mechanisms.  
counsel_question: Clarify whether tax accruals are handled in WC or via tax settlement/indemnity and add overlap control.  
rebuttal/fallback: Choose one economic path (WC or tax settlement) and expressly exclude overlap items.  
minimal_edit: Taxes shall exclude any amounts to the extent reflected in Net Working Capital~~.~~ **, in each case, without duplication.**

---

## GT-08

test_id: GT-08  
what_to_detect: Independent Accountant scope not limited to disputed items; process windows too short or inconsistent  
why_it_matters: Dispute can expand into a full re-write and delay final settlement.  
counsel_question: Limit expert scope to disputed items and require application of Accounting Principles.  
rebuttal/fallback: Add manifest-error carve-out for true errors; keep scope narrow to reduce time and cost.  
minimal_edit: The Independent Accountant shall resolve ~~the Closing Statement~~ **only those items set forth in the Dispute Notice**.
