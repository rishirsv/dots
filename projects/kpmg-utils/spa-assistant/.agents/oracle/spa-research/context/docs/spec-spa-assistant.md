# Feature: SPA Assistant

## TL;DR

- **Problem:** Financial due diligence associates spend significant time manually reviewing SPAs for key terms, risks, and negotiation points.
- **Solution:**
  - Custom GPT that analyzes Share Purchase Agreements from a financial due diligence perspective
  - 8 built-in playbooks for repeatable, structured analyses
  - Guided menu-driven UX with follow-on prompts
  - Comprehensive output in table format with bias ratings and source citations

## Scope

**In:**
- Single SPA document analysis (Word or PDF)
- Redline comparison of two document versions
- 8 structured analysis playbooks (see below)
- General Q&A on SPAs and M&A legal topics
- Roleplay for negotiation simulation

**Out (for now):**
- Locked Box vs Completion Accounts analysis
- Escrow Arrangements analysis
- Indemnification Framework (standalone)
- MAC Analysis
- Tax Provisions analysis
- Closing Mechanics & Timeline analysis
- Dispute Resolution Process analysis
- Termination & renewal risks
- Compliance misalignments
- Operational dependencies
- Legal enforceability opinions
- Jurisdiction-specific legal advice

---

## What We're Building

A Custom GPT that supports financial due diligence review of SPAs. Primary users are senior managers, associates, and partners performing deal reviews.

The assistant provides a **guided experience** where users can:
1. Upload an SPA and receive recommended analyses
2. Select from a numbered menu or ask freeform questions
3. Run structured playbooks with consistent, comprehensive output
4. Drill deeper via follow-on prompts specific to each analysis

---

## UX Flow

### Session Start

1. **Upload** — User uploads a single SPA (Word or PDF)
2. **Auto-scan** — GPT scans document and identifies which analyses are most relevant
3. **Present menu** — Shows top 3-5 recommended analyses as a numbered list with brief reasoning
4. **User selects** — User replies with number, or asks a freeform question

### During Analysis

5. **Run playbook** — Selected analysis runs through its defined process
6. **Output** — Comprehensive table-format output (format defined per playbook)
7. **Follow-on prompts** — GPT offers analysis-specific follow-up options
8. **Iterate** — User can drill deeper, run another analysis, or ask questions

### General Behavior

- **Scope enforcement:** Only handles SPAs and M&A legal topics; politely declines other topics
- **Neutral presentation:** Analyses are presented neutrally; uses perspective (Buyer/Seller) if provided but doesn't require it
- **Missing information:** If a clause or definition isn't found, explicitly states "Not found in document"
- **Confidence:** Provides best interpretation with confidence level (High/Medium/Low) when clause is ambiguous
- **Citations:** Every finding references the source clause for verification

---

## Bias Rating Scale

All analyses use a consistent 5-level bias scale, ordered by severity:

| Level | Indicator | Description |
|-------|-----------|-------------|
| 1 | 🔴 Highly Buyer-Favorable | Significantly advantages the buyer beyond market norms |
| 2 | 🟠 Buyer-Favorable | Leans toward buyer interests |
| 3 | 🟢 Neutral | Balanced or market standard |
| 4 | 🟠 Seller-Favorable | Leans toward seller interests |
| 5 | 🔴 Highly Seller-Favorable | Significantly advantages the seller beyond market norms |

**Ordering:** When presenting findings, items are ordered by severity (strongest bias first, Neutral last).

---

## Playbooks

Each playbook is a repeatable workflow with defined triggers, process, output format, and follow-on prompts.

### 1. Key Financial Definitions

Analyzes core financial definitions that impact deal economics.

- **Trigger:** User asks about definitions, or selects from menu
- **Covers:** Indebtedness, Cash/Cash Equivalents, Working Capital, Transaction Expenses, Accounting Principles
- **Output format:** TBD
- **Follow-on prompts:** TBD

---

### 2. Purchase Price Mechanics & Analysis

Summarizes the purchase price equation and analyzes adjustment mechanisms.

- **Trigger:** User asks about purchase price, price mechanics, or adjustments
- **Covers:** Base price, adjustment mechanisms, payment structure, calculation methodology
- **Output format:** TBD
- **Follow-on prompts:** TBD

---

### 3. Working Capital vs Net Debt Adjustment

Analyzes working capital and net debt mechanics, including bucket placement and gap/double-count detection.

- **Trigger:** User asks about working capital, NWC, net debt, or adjustment mechanics
- **Covers:** Target NWC, calculation methodology, true-up/collar mechanism, bucket placement analysis, double-count detection, gap detection
- **Output format:** TBD
- **Follow-on prompts:** TBD

---

### 4. Earn-Out Provisions

Analyzes earn-out structure, metrics, and risk factors.

- **Trigger:** User asks about earn-outs, contingent consideration, or performance payments
- **Covers:** Metrics, measurement periods, accounting treatment, acceleration triggers, caps, dispute mechanics
- **Output format:** TBD
- **Follow-on prompts:** TBD

---

### 5. Reps & Warranties Summarization

Provides high-level summary of reps & warranties, flagging non-standard or onerous provisions.

- **Trigger:** User asks about reps, warranties, representations
- **Covers:** Financial statement reps, undisclosed liabilities, knowledge qualifiers, materiality qualifiers, survival periods
- **Output format:** TBD
- **Follow-on prompts:** TBD

---

### 6. Key Commercial Term Extraction

Auto-extracts and summarizes the most critical commercial terms.

- **Trigger:** User asks to extract key terms, summarize the deal, or "what are the main terms"
- **Covers:** Purchase price, closing conditions, indemnification baskets/caps, key dates, material thresholds
- **Output format:** TBD
- **Follow-on prompts:** TBD

---

### 7. Smart Redline

Compares two document versions and highlights changes with analysis.

- **Trigger:** User uploads two documents, or requests comparison/redline
- **Covers:** Clause-level comparison, change categorization (Added/Removed/Modified), deviation from previous version, ranked summary of material changes
- **Output format:** TBD
- **Follow-on prompts:** TBD

---

### 8. Roleplay

Simulates negotiation stances from buyer or seller perspective.

- **Trigger:** User asks to roleplay, simulate negotiation, or "what would buyer/seller say"
- **Covers:** Likely pushback, proposed rebuttals, fallback positions, negotiation strategy
- **Output format:** TBD
- **Follow-on prompts:** TBD

---

## Cross-Cutting Capabilities

### Cited for Clarity
Every summarized term is supported by a citation linking to the source clause, enabling instant drill-down and verification.

### Comparison to Market Standards
Connects to built-in knowledge of market norms to benchmark key terms, flagging provisions that are off-market.

---

## Requirements

- [ ] Upload and parse Word (.docx) and PDF documents
- [ ] Auto-scan document to recommend top 3-5 relevant analyses
- [ ] Present numbered menu for analysis selection
- [ ] Support freeform questions alongside menu navigation
- [ ] Implement 8 playbooks with defined triggers, processes, and outputs
- [ ] Apply consistent bias rating scale across all analyses
- [ ] Order findings by severity (strongest bias first)
- [ ] Include source clause citations for all findings
- [ ] Show confidence level for ambiguous interpretations
- [ ] Flag missing definitions/clauses as "Not found"
- [ ] Limit scope to SPAs and M&A topics only
- [ ] Support two-document comparison (Smart Redline)

---

## Acceptance Criteria

- Given an uploaded SPA, when the document is processed, then the GPT presents 3-5 recommended analyses with reasoning
- Given a user selects an analysis from the menu, when the playbook runs, then output follows the defined format for that playbook
- Given a finding with buyer/seller bias, when displayed, then it shows the appropriate bias indicator and is ordered by severity
- Given an ambiguous clause, when analyzed, then the GPT provides best interpretation with confidence level
- Given a definition not present in the document, when the playbook looks for it, then it states "Not found in document"
- Given a user asks about non-SPA/M&A topics, when responding, then the GPT politely declines and redirects to SPA-related assistance
- Given two document versions uploaded, when Smart Redline runs, then changes are categorized and ranked by materiality

---

## Open Questions

- Exact output format for each of the 8 playbooks (to be defined individually)
- Follow-on prompts specific to each playbook (to be defined individually)
- Knowledge file structure and content for each playbook
- Market standard benchmarks to include in comparison capability

---

## Next Steps

Define each playbook in detail:
1. [ ] Key Financial Definitions
2. [ ] Purchase Price Mechanics & Analysis
3. [ ] Working Capital vs Net Debt Adjustment
4. [ ] Earn-Out Provisions
5. [ ] Reps & Warranties Summarization
6. [ ] Key Commercial Term Extraction
7. [ ] Smart Redline
8. [ ] Roleplay
