# Draft Adjustments Memo — Template

## Rules

- Use **only** evidence from FDD notes or the transcript — no invented figures or external research.
- Preserve ranges exactly (e.g., "$0.5–0.7m"); do not convert to midpoints.
- The value is identifying adjustments and capturing rationale — amounts are often unknown at this stage.
- **Never write "TBD" in Setup.** Always describe the setup steps in plain English, even when amounts are unknown.

---

## Template

**CRITICAL:** Output the memo as rendered markdown. Do NOT wrap output in code fences (` ``` `). The user should see formatted headings and bullets, not a code block.

Use this structure:

```markdown
# Draft Adjustments Memo

## EBITDA Adjustments (Diligence)

**<Ref>: <Short adjustment name>**

<1-2 sentence rationale: what it is, why it's an adjustment>

  - "<Brief evidence quote>" — <Speaker>
  - "<Another quote if relevant>" — <Speaker>

**Request:** <Data needed to quantify>

**Setup:**
- <P&L line> — <Direction: Add-back (+) or Deduction (−)> to EBITDA
- <What data to pull>
- <How to calculate>
- <Which periods to apply>

---

## EBITDA Adjustments (Pro Forma)

**<Ref>: <Short adjustment name>**

<Rationale — run-rate or forward-looking adjustment>

**Request:** <Data needed, or "None — qualitative only">

**Setup:**
- <P&L line> — <Direction: Add-back (+) or Deduction (−)> to EBITDA
- <How to quantify or monitor>

---

## Net Debt Adjustments

**<Ref>: <Short adjustment name>**

<Rationale: why it affects ND at completion>

  - "<Evidence quote>" — <Speaker>

**Request:** <Data needed>

**Setup:**
- <Type: Debt/Debt-like/Cash/Trapped> — <Direction: Increase (+) or Decrease (−)> Net Debt
- <How to calculate at close>

---

## Working Capital Adjustments

**<Ref>: <Short adjustment name>**

<Rationale: why it affects WC peg or classification>

**Request:** <Data needed>

**Setup:**
- <BS line: AR/AP/Inventory/Accruals/Other> — <Direction: + or −> to NWC
- <How to normalize or classify>

```

(End memo here. Do not offer additional formatting or follow-up options.)

---

## Guidance

Apply the following guidance to the template.

### Adjustment Format

Each adjustment entry should be **bridge-ready** — the bold line can be copied directly as a row description:

```
**QoE1: Legal settlement bonus**

~$150k one-time payment related to dismissed investigation; not part of recurring comp.

  - "That's the settlement bonus... helping us close that chapter" — CFO

**Request:** Bonus payout register

**Setup:**
- Opex (Bonus) — Add-back (+) to EBITDA
- Pull the bonus payout register showing the settlement-related payment
- Full amount (~$150k) as one-time add-back
- Apply to the period when paid
```

Note: P&L line and direction go in the **first Setup bullet**, not in the header.

### What to Include

For each adjustment, capture:
1. **What it is** — Short name that will appear in the bridge (header line)
2. **Why it's an adjustment** — One-time, non-recurring, misclassification, run-rate change, etc. (rationale paragraph)
3. **Evidence** — Brief quote with speaker attribution, indented as sub-bullets under the rationale
4. **Data request** — What's needed to quantify; include suggested source if mentioned
5. **Setup guidance** — How to calculate when data arrives; first bullet includes P&L line and direction

### Setup Guidance

The **Setup** section walks the associate step-by-step through building the adjustment. Use 2-5 bullets in plain English. **Never write "TBD"** — even when amounts are unknown, describe the general approach.

Each Setup should answer:
1. **Line + Direction (first bullet):** P&L/BS line and add-back (+) or deduction (−)
2. **Data to pull:** What schedule/report do you need?
3. **Calculation:** How do you compute the adjustment amount?
4. **Periods:** Which fiscal periods should this apply to?
5. **Contingencies:** Are there any "if/then" conditions?

Good Setup example:
```
**Setup:**
- Opex (Severance) — Add-back (+) to EBITDA
- Pull the severance payments by employee from the payroll register
- Calculate: (actual severance paid) minus ($45k normalized annual baseline)
- Apply to FY24 and LTM periods where severance exceeded baseline
- If any severance relates to ongoing restructuring, exclude that portion
```

Bad Setup examples:
- `TBD — need more data` (never acceptable)
- `+ | QoE | FY23-LTM` (too mechanical, not actionable)
- `Direction: + | Amount: TBD` (says nothing useful)

### Ref Numbering (Critical)

- **QoE1, QoE2, QoE3...** — EBITDA / Quality of Earnings adjustments (diligence or pro forma)
- **ND1, ND2, ND3...** — Net Debt adjustments
- **WC1, WC2, WC3...** — Working Capital adjustments

Number sequentially within each category as you encounter them.

### Amounts

- Include amounts **only if explicitly stated** in the transcript
- Use `~` for approximate figures, preserve ranges as stated
- Most adjustments will be TBD — that's fine; the rationale is the value

### Categories

Group adjustments by where they land in the bridge:
- **EBITDA (Diligence)** — Historical normalizations, reclasses, error corrections
- **EBITDA (Pro Forma)** — Run-rate, forward-looking (only if explicitly discussed)
- **Net Debt** — Debt-like items, trapped cash, SPA definition items
- **Working Capital** — Peg impacts, classification questions, timing items

---

## Example Output

Below is how the output should appear (as rendered markdown, NOT in a code block):

---

# Draft Adjustments Memo — Project Alpha

## EBITDA Adjustments (Diligence)

**QoE1: Legal settlement bonus**

~$150k one-time payment related to dismissed investigation; not part of recurring comp structure.

  - "That's the settlement bonus... helping us close that chapter" — CFO

**Request:** Bonus payout register

**Setup:**
- Opex (Bonus) — Add-back (+) to EBITDA
- Pull the bonus payout register showing the settlement-related payment
- Full amount (~$150k) as one-time add-back
- Apply to the period when paid (likely FY24)

---

**QoE2: Excess severance**

FY24-25 elevated due to leadership turnover; normalized run-rate ~$40-50k/yr per management.

  - "Closer to the 40 to 50 thousand that was paid in FY23" — CFO

**Request:** Severance payments by employee, FY23-LTM

**Setup:**
- Opex (Severance) — Add-back (+) to EBITDA
- Pull severance payments by employee from the payroll register
- Calculate: (actual severance paid) minus ($45k normalized annual baseline)
- Apply to FY24 and LTM periods where severance exceeded baseline
- If any severance relates to ongoing restructuring, exclude that portion

---

**QoE3: Executive coaching program**

One-time external leadership program; not recurring operational expense.

**Request:** GL detail for coaching vendor

**Setup:**
- Opex (Training) — Add-back (+) to EBITDA
- Pull GL detail for coaching vendor payments
- Full amount as one-time add-back
- Apply to period incurred

---

**QoE4: ERP implementation**

~$606k total in FY23; portion capitalized (~$200k per management), remainder expensed. Split affects EBITDA add-back vs D&A.

**Request:** ERP capex roll-forward, fixed asset register

**Setup:**
- Opex (Software implementation) — Add-back (+) to EBITDA for expensed portion only
- Review the fixed asset register to identify capitalized amount (~$200k)
- Calculate: ($606k total) minus (capitalized portion) = expensed portion (~$400k)
- Apply to FY23; capitalized portion flows through D&A instead

---

## EBITDA Adjustments (Pro Forma)

**QoE5: Sign-on bonus reduction**

New HR policy reducing sign-on bonuses since January; qualitative improvement to run-rate.

**Request:** None — monitor go-forward

**Setup:**
- Opex (Sign-on bonus) — Qualitative add-back (+); no specific amount initially
- Monitor sign-on bonus spend in FY25 vs FY24 to quantify improvement
- If quantifying later: compare FY24 run-rate to post-policy run-rate and add back the delta

---

## Net Debt Adjustments

**ND1: Deferred financing costs**

~$800k related to recent refinancing; currently netted against loan on BS.

  - "Right now they're sitting on the balance sheet, offset to the loan" — Controller

**Request:** Deferred financing cost schedule

**Setup:**
- Debt-like — Increase (+) Net Debt
- Pull the deferred financing cost schedule showing unamortized balance
- Gross up debt by the unamortized balance at close (~$800k less any amortization to date)
- Apply at closing date based on balance at that time

---

**ND2: ASC 842 sublease true-ups**

Dec-23 true-up entries; confirm if one-time or ongoing adjustment pattern.

**Request:** Lease liability rollforward

**Setup:**
- Lease liability — Review to determine if Dec-23 entry was one-time or recurring
- If one-time true-up: exclude from Net Debt (no adjustment needed)
- If ongoing pattern: include in lease liability at close per standard ASC 842 treatment
- Confirm treatment aligns with SPA Net Debt definition

---

## Working Capital Adjustments

**WC1: Bonus accrual vs payout timing**

Retention bonus ~$400k accrued vs ~$150k on schedule; discrepancy may affect peg.

**Request:** Bonus schedule reconciliation

**Setup:**
- Accrued Comp — Review the $400k vs $150k discrepancy
- If $400k includes one-time retention: normalize accrued comp to steady-state (~$150k)
- Adjust NWC peg downward (−) by the one-time retention portion (~$250k)
- If retention is recurring, include at the higher level in the peg

---
