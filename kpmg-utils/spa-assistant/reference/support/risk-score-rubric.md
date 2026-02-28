# Risk Scoring Rubric (Impact / Likelihood / Recoverability)

## Sub-scores (1–5)

### Impact (I)

1. Cosmetic / no economic effect
2. Small economics (immaterial to deal)
3. Moderate economics (noticeable purchase price movement or repeated disputes)
4. Material economics (meaningful purchase price movement; impacts multiple buckets)
5. Deal-economics critical (can swing headline economics or create structural double counting)

### Likelihood (L)

1. Remote (would require unusual facts)
2. Unlikely (possible but not typical)
3. Plausible (could occur in normal course)
4. Likely (common fact pattern / easy to trigger)
5. Near-certain (drafting almost guarantees the issue arises)

### Recoverability (R)

Score higher when easier to fix/neutralize after closing.

1. Hard to recover / hard to unwind (value likely lost)
2. Difficult (requires litigation or discretionary judgment)
3. Mixed (recoverable with effort; depends on process/expert)
4. Mostly recoverable (clear process or escrow coverage)
5. Readily recoverable (mechanical fix, short window, or clear escrow hold)

## Rolling ILR into RAG

Compute a compact severity score:

**Severity = I + L + (6 − R)** (range 3–15)

Map to RAG:

- **Green:** 3–6
- **Amber:** 7–10
- **Red:** 11–15

How to display in the register:

- **RAG (I/L/R)** e.g., **Red (5/4/2)**

## Tie-breakers (override rules)

Escalate by one level (or to Red) if any apply:

- Missing or conflicting **cut-off/measurement time** across Cash/Debt/WC/Expenses
- No explicit **accounting hierarchy** where GAAP vs past practice vs templates can conflict
- No formula-level **anti-duplication**, and overlapping buckets are present (Taxes/Expenses/overdrafts/intercompany)
- **Classification lock** missing (items can move between Cash/Debt/WC/Expenses post-close)
- Dispute process allows independent accountant to **re-write the whole statement** (not limited to disputes)

## Examples

1. **Double count risk (Debt vs WC)**

- I=5, L=4, R=2 → Severity = 5 + 4 + (6−2)=13 → **Red (5/4/2)**

2. **Dispute window short but fixable**

- I=3, L=3, R=4 → Severity = 3 + 3 + (6−4)=8 → **Amber (3/3/4)**
