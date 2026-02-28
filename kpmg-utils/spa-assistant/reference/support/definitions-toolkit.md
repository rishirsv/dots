# Definitions Toolkit Catalogue (Follow-up Only)

These toolkits are **follow-up actions** to deepen analysis after the default Full FDD Review. They are not a start mode.

---

## Toolkit A — One-shot Diagnostic Triage

What it does  
Flags the highest-risk drafting tells (overlap, timing mismatch, missing hierarchy, reclass risk) and proposes which register IDs to prioritize.

When to run (triggers)

- User asks “what are the top issues quickly?”
- Large/complex SPA and you need a fast first pass

Inputs needed

- SPA text (definitions + purchase price mechanics at minimum)

Outputs (Issue Register)

- New rows for any missed high-risk tells (DEF/METH/TIME/PROC/RECO/SPEC)
- Enriched **RAG (I/L/R)** and “Top priorities” shortlist

---

## Toolkit B — Term Anchor Mapper

What it does  
Builds an explicit map: Defined Term → clause ref(s) → where it appears in the price/statement formulas.

When to run (triggers)

- Clause references are inconsistent or missing
- User asks “where does this term show up in the formula?”

Inputs needed

- SPA text with definitions + the purchase price/closing statement sections

Outputs (Issue Register)

- Enriches existing rows with more precise **Clause ref** and **Short excerpt**
- Adds new DEF/METH/TIME/PROC rows where a term is defined but not operationalized (or vice versa)

---

## Toolkit C — Cash Placement Stress Test

What it does  
Tests restricted cash, deposits in transit, outstanding checks, and overdrafts for consistent placement and anti-duplication across Cash/Debt/WC.

When to run (triggers)

- Cash definition mentions Restricted Cash, checks, deposits, overdrafts, or “netting”
- Buyer/Seller disputes likely on bank cut-off timing

Inputs needed

- Cash definition + cut-off time definition + WC and debt definitions

Outputs (Issue Register)

- New/enriched DEF + TIME + METH rows (routing + anti-duplication)
- Negotiation pack fields (counsel question/pushback/rebuttal) focused on routing decisions

---

## Toolkit D — Indebtedness Heatmap

What it does  
Builds a “debt-like categories” heatmap: included items, excluded items, and overlap risk with Transaction Expenses/Taxes/WC.

When to run (triggers)

- Indebtedness definition is long or includes debt-like categories (leases, guarantees, derivatives, intercompany)
- Payoff mechanics look under-specified

Inputs needed

- Indebtedness definition + payoff/closing funds flow language (if any)

Outputs (Issue Register)

- New/enriched DEF rows with an “included vs excluded” breakdown
- Flags for overlap routing and payoff evidence requirements

---

## Toolkit E — Working Capital Methodology Stress Test

What it does  
Checks that NWC peg/target aligns to the statement template and accounting hierarchy; tests reclass/no-hindsight controls.

When to run (triggers)

- WC target/peg exists but methodology is unclear
- Sample statements exist but priority is ambiguous

Inputs needed

- NWC definition + sample WC schedule (if any) + accounting principles hierarchy clause

Outputs (Issue Register)

- New/enriched DEF + METH + PROC rows (template control, priority, classification lock)
- Suggested minimal edits for “schedule controls” and “no reclass” (on request)

---

## Toolkit F — Taxes + Transaction Expenses Overlap Sweep

What it does  
Finds overlap points: tax accruals in WC vs tax settlement/indemnity, and transaction expenses that also appear as debt-like or accruals.

When to run (triggers)

- Taxes and/or Transaction Expenses appear in the purchase price formula
- Separate tax indemnity/settlement exists

Inputs needed

- Taxes definition + WC definition + tax settlement/indemnity clauses + transaction expense definition

Outputs (Issue Register)

- New/enriched DEF + METH rows focused on “without duplication” routing
- Counsel questions targeted to picking a single economic path and excluding overlap

---

## Toolkit G — Per-ID Negotiation Pack + Roleplay

What it does  
For selected IDs, generates a negotiation pack: counsel question, likely pushback, rebuttal/fallback, and (if asked) minimal edits. Can also roleplay Buyer vs Seller.

When to run (triggers)

- User asks “draft my negotiation points”
- User says “roleplay buy vs sell for ID …”

Inputs needed

- Selected Issue Register IDs and their evidence excerpts

Outputs (Issue Register)

- Enriches the “Counsel question / pushback / rebuttal” columns
- Optional: minimal edits field added only when requested

---

## Toolkit H — Two-Document Diff Deep-Dive

What it does  
Runs strict text diff between two SPA versions and produces Delta Summary + Delta Register (no semantic normalization).

When to run (triggers)

- User provides two documents or asks “compare versions”
- Redlines are missing or unreliable

Inputs needed

- Version A text + Version B text

Outputs (Delta Register)

- Delta Summary (ranked) + Delta Register grouped by category + change type
- For each delta: old/new clause refs + short old/new excerpts, plus plain-English impact and counsel question
