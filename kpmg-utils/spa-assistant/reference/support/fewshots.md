# Fewshots (Format Enforcers)

## Example 1 — Grouped Issue Register section (fictional)

### Core price-driver definitions

| ID      | Category             | RAG (I/L/R)   | Issue                                                       | Why it matters (plain)                                 | Clause ref | Short excerpt (10–25w)                                                                           | Counsel question                                                                        | Likely pushback                         | Proposed rebuttal/fallback                                                                   |
| ------- | -------------------- | ------------- | ----------------------------------------------------------- | ------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| DEF-004 | Cash                 | Red (5/4/2)   | Restricted cash included with no availability test.         | Buyer may pay for cash it cannot access after closing. | §1.18      | “Cash includes Restricted Cash held in blocked accounts, regardless of withdrawal restrictions.” | “Confirm Restricted Cash must be freely transferable at Closing to be included.”        | “It’s still cash on the balance sheet.” | “Include only freely transferable restricted cash, otherwise treat as debt-like or exclude.” |
| DEF-007 | Transaction Expenses | Amber (4/3/3) | Transaction expenses overlap with working capital accruals. | Same cost can reduce price twice if not routed.        | §1.42      | “Transaction Expenses include unpaid bonuses and related employer payroll taxes.”                | “Add ‘to the extent included’ carve-out vs NWC and Indebtedness (without duplication).” | “Accountant will net it out.”           | “Put routing in the SPA; do not rely on expert discretion for overlap.”                      |

## Example 2 — Per-ID negotiation pack (fictional)

ID: DEF-004 (Cash)

Counsel question

- “Please confirm whether ‘Restricted Cash’ is included only to the extent freely transferable to Buyer at Closing.”

Likely pushback

- “Restricted Cash is still a current asset; it should count as Cash.”

Rebuttal / fallback

- “If Buyer cannot access it, it is not value-equivalent. Fallback: include only the portion that becomes freely transferable immediately after Closing, with documentation.”

## Example 3 — Minimal edit snippet (≤3 lines; fictional)

- “Cash” means ... including Restricted Cash~~.~~ **, but only to the extent such amounts are freely transferable to Buyer at Closing.**

## Example 4 — Delta Register excerpt (fictional)

### Category: Accounting hierarchy

| DELTA-ID | Category             | Change type                 | vA clause ref | vB clause ref | Before (10–25w)                                                    | After (10–25w)                                                          | Plain-English impact                                                                 | Counsel question                                                                   | Rebuttal/fallback                                                         |
| -------- | -------------------- | --------------------------- | ------------- | ------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| DLT-001  | Accounting hierarchy | Accounting hierarchy change | §2.3(b)       | §2.3(b)       | “Prepared in accordance with GAAP, consistent with past practice.” | “Prepared in accordance with GAAP; past practice shall be disregarded.” | Past-practice protections removed; numbers may move depending on accounting choices. | “Confirm whether the peg/targets were set under past practice and need alignment.” | “If GAAP-only, update templates/targets to match GAAP to avoid disputes.” |
