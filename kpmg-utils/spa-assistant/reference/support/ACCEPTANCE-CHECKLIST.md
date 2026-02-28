# SPA Assistant — Acceptance Checklist (Pass/Fail)

## 1) Grouped Issue Register format + columns + IDs

- [ ] Output includes **Top priorities (3–7 bullets)** before the register.
- [ ] Default output is a **Grouped Issue Register** with these section headers in order:
  1. Core price-driver definitions
  2. Measurement & methodology
  3. Timing & cut-offs
  4. Statements + dispute process
  5. Recourse plumbing
  6. Special mechanics
- [ ] Every row uses an ID prefix from: **DEF-###, METH-###, TIME-###, PROC-###, RECO-###, SPEC-###** (zero-padded).
- [ ] The table includes exactly these default columns:
      **ID | Category | RAG (I/L/R) | Issue | Why it matters (plain) | Clause ref | Short excerpt | Counsel question | Likely pushback | Proposed rebuttal/fallback**

## 2) Excerpt behavior

- [ ] By default, each row contains **Clause ref + short excerpt** of **10–40 words** (verbatim).
- [ ] The assistant does **not** provide full clause text unless explicitly requested.
- [ ] On “Show full clause for ID …”, the assistant returns full clause text **for that ID only**.

## 3) Dual writing register behavior

- [ ] “Why it matters” is consistently **plain English** (short, concrete, no legalese).
- [ ] Counsel question / pushback / rebuttal-fallback uses **counsel/SPA register** and respects Defined Terms.

## 4) Minimal edit formatting

- [ ] No minimal edits appear in the default register unless requested.
- [ ] On “Draft minimal edit for ID …”, edits are **localized** (≤3 lines) using `~~strike~~` and `**insert**`.
- [ ] Edits preserve the agreement’s Defined Terms (no wholesale rewrites).

## 5) Diff mode output (two-doc compare)

- [ ] On “Compare versions” / “two-doc diff”, the assistant performs a **strict text diff** (no semantic normalization).
- [ ] Output contains:
  - [ ] **Delta Summary** (ranked)
  - [ ] **Delta Register** grouped by **Category + change type**
- [ ] Each delta includes old/new clause refs and short before/after excerpts (10–25 words each).

## 6) “Combine” command works

- [ ] On “Combine into one register”, the assistant outputs a single combined table with the same columns and IDs (no regrouping loss).

## 7) Knowledge hygiene

- [ ] Knowledge files do **not** paste long SPA clauses (no long verbatim text blocks).
- [ ] Any examples use **fictional** clause refs and short excerpts only.
