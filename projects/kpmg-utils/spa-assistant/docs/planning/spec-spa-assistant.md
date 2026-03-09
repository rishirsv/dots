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
- **Output format:** Definition table with Key Inclusions, Key Exclusions, Bias, Key Observations; Double-Count Risk Matrix; Gap Risk List
- **Follow-on prompts:**
  1. "Show me a detailed breakdown of the Indebtedness definition with all included items"
  2. "Map each definition to typical trial balance accounts to check for gaps"
  3. "What's missing from these definitions that we should negotiate?"
  4. "Compare these definitions to market standard language"
  5. "Identify the highest-risk double-count scenarios in this SPA"

> Full specification: [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md#playbook-1-key-financial-definitions)

---

### 2. Purchase Price Mechanics & Analysis

Summarizes the purchase price equation and analyzes adjustment mechanisms.

- **Trigger:** User asks about purchase price, price mechanics, or adjustments
- **Covers:** Base price, adjustment mechanisms, payment structure, calculation methodology
- **Output format:** Price Bridge Table (Headline to Cash at Close); 30-Second Summary script
- **Follow-on prompts:**
  1. "Walk me through the funds flow at closing"
  2. "What happens if working capital comes in below target?"
  3. "Analyze the escrow release mechanics and timing"
  4. "Compare this adjustment mechanism to locked-box alternatives"
  5. "What are the dispute resolution procedures for the true-up?"

> Full specification: [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md#playbook-2-purchase-price-mechanics)

---

### 3. Working Capital vs Net Debt Adjustment

Analyzes working capital and net debt mechanics, including bucket placement and gap/double-count detection.

- **Trigger:** User asks about working capital, NWC, net debt, or adjustment mechanics
- **Covers:** Target NWC, calculation methodology, true-up/collar mechanism, bucket placement analysis, double-count detection, gap detection
- **Output format:** Bucket Mapping Table; Double-Count Risk Matrix; NWC Target Reasonableness table with DSO/DIO/DPO
- **Follow-on prompts:**
  1. "Show me a detailed breakdown of what's included in Net Debt"
  2. "Flag all potential double-count issues between NWC and other definitions"
  3. "Is the working capital target reasonable given historical patterns?"
  4. "What items are missing from the definitions that could fall through the cracks?"
  5. "How should disputed items like deferred revenue be treated?"

> Full specification: [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md#playbook-3-working-capital-vs-net-debt-adjustment)

---

### 4. Earn-Out Provisions

Analyzes earn-out structure, metrics, and risk factors.

- **Trigger:** User asks about earn-outs, contingent consideration, or performance payments
- **Covers:** Metrics, measurement periods, accounting treatment, acceleration triggers, caps, dispute mechanics
- **Output format:** Earn-Out Summary Table; Risk Assessment (Definition/Control/Dispute/Collection risk levels)
- **Follow-on prompts:**
  1. "What specific adjustments are allowed in the EBITDA calculation?"
  2. "How does buyer's control over operations affect earn-out achievability?"
  3. "Walk me through the dispute resolution process step by step"
  4. "What happens to the earn-out if the buyer sells the business?"
  5. "Compare this earn-out structure to market standards"

> Full specification: [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md#playbook-4-earn-out-provisions)

---

### 5. Reps & Warranties Summarization

Provides high-level summary of reps & warranties, flagging non-standard or onerous provisions.

- **Trigger:** User asks about reps, warranties, representations
- **Covers:** Financial statement reps, undisclosed liabilities, knowledge qualifiers, materiality qualifiers, survival periods
- **Output format:** Rep Coverage Table; Qualifier Impact Analysis; Fundamental Reps List; Red Flags
- **Follow-on prompts:**
  1. "Which reps have the most aggressive qualifiers?"
  2. "Map FDD findings to specific reps for indemnity coverage"
  3. "What reps are missing that should be requested?"
  4. "How does the indemnification structure limit recovery on these reps?"
  5. "Which issues should be covered by special indemnity instead of general reps?"

> Full specification: [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md#playbook-5-reps--warranties-summarization)

---

### 6. Key Commercial Term Extraction

Auto-extracts and summarizes the most critical commercial terms.

- **Trigger:** User asks to extract key terms, summarize the deal, or "what are the main terms"
- **Covers:** Purchase price, closing conditions, indemnification baskets/caps, key dates, material thresholds
- **Output format:** 1-Page IC Summary (Economics, Closeability, Risk Allocation, Non-Standard items); Key Commercial Terms Table
- **Follow-on prompts:**
  1. "Drill into the indemnification structure in detail"
  2. "What are the key closing conditions and associated risks?"
  3. "Analyze the interim operating covenants"
  4. "What terms should we push back on in negotiation?"
  5. "Compare these terms to market standards across each category"

> Full specification: [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md#playbook-6-key-commercial-terms)

---

### 7. Smart Redline

Compares two document versions and highlights changes with analysis.

- **Trigger:** User uploads two documents, or requests comparison/redline
- **Covers:** Clause-level comparison, change categorization (Added/Removed/Modified), deviation from previous version, ranked summary of material changes
- **Output format:** Layer 1 Executive Issue List (1-page); Layer 2 Themed Summary; Layer 3 Change Log; Sleeper Changes Alert
- **Follow-on prompts:**
  1. "Explain the impact of the indemnity cap change in detail"
  2. "What's the recommended counter-position for the top 3 issues?"
  3. "Are there any sleeper changes I should be worried about?"
  4. "What trades could we offer to get movement on the must-have items?"
  5. "Summarize changes that affect FDD workstreams specifically"

> Full specification: [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md#playbook-7-smart-redline)

---

### 8. Roleplay

Simulates negotiation stances from buyer or seller perspective.

- **Trigger:** User asks to roleplay, simulate negotiation, or "what would buyer/seller say"
- **Covers:** Likely pushback, proposed rebuttals, fallback positions, negotiation strategy
- **Output format:** Negotiation Briefing (Your Position, Anticipated Response, Scripts, Red Line Assessment)
- **Follow-on prompts:**
  1. "What if they reject our opening position entirely?"
  2. "Give me specific language to propose as a counter"
  3. "How do I tell if this is a real red line or just posturing?"
  4. "What's a fair compromise on this term?"
  5. "Roleplay the full back-and-forth negotiation for this issue"

> Full specification: [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md#playbook-8-negotiation-roleplay)

---

## Cross-Cutting Capabilities

### Cited for Clarity
Every summarized term is supported by a citation linking to the source clause, enabling instant drill-down and verification.

**Citation Format:** `[Section X.Y, Page Z]: "relevant excerpt"`

For missing items: "Not found in document — typically appears in [expected location]"

### Comparison to Market Standards
Connects to built-in knowledge of market norms to benchmark key terms, flagging provisions that are off-market.

**Market benchmarks knowledge file:** [knowledge/market-benchmarks.md](../knowledge/market-benchmarks.md)

Key benchmark categories:
- Escrows & Holdbacks (size, duration)
- Survival Periods (general, fundamental, tax)
- Purchase Price Adjustments (PPA escrow, timing, collars)
- Earnouts (prevalence, duration, payout reality)
- Definition Standards (Indebtedness, Cash, Working Capital)

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

- ~~Exact output format for each of the 8 playbooks~~ **RESOLVED** - See [playbooks/spa-playbooks.md](../playbooks/spa-playbooks.md)
- ~~Follow-on prompts specific to each playbook~~ **RESOLVED** - See playbook definitions above
- ~~Knowledge file structure and content for each playbook~~ **RESOLVED** - See [knowledge/market-benchmarks.md](../knowledge/market-benchmarks.md)
- ~~Market standard benchmarks to include in comparison capability~~ **RESOLVED** - See market-benchmarks.md

**Remaining Open Questions:**
- Custom GPT system prompt construction
- Optimal chunking strategy for long SPA documents
- Testing methodology and acceptance test suite
- Integration with document parsing capabilities

---

## Documentation Structure

```
docs/
├── product/
│   └── spec-spa-assistant.md       # This file - main specification
├── playbooks/
│   └── spa-playbooks.md            # All 8 playbook definitions
├── planning/
│   └── plan-spa-assistant-v2.md    # Detailed implementation plan
├── knowledge/
│   └── market-benchmarks.md        # Market benchmarks for GPT knowledge
├── research/                       # Research files (reference only, not uploaded to GPT)
│   └── research-*.md
├── patches/                        # Historical patch diffs
│   ├── foolproof-extraction-enforcement.diff
│   └── patch-option-a-definitions-only.diff
└── engineering/
    └── definitions-extractor/
        └── plan-definitions-extractor.md
```

---

## Next Steps

Playbook definitions complete:
1. [x] Key Financial Definitions
2. [x] Purchase Price Mechanics & Analysis
3. [x] Working Capital vs Net Debt Adjustment
4. [x] Earn-Out Provisions
5. [x] Reps & Warranties Summarization
6. [x] Key Commercial Term Extraction
7. [x] Smart Redline
8. [x] Roleplay

**Implementation tasks:**
1. [ ] Build Custom GPT system prompt from spec + playbooks
2. [ ] Upload knowledge files (market-benchmarks.md, playbooks reference)
3. [ ] Test each playbook with sample SPA documents
4. [ ] Refine prompts based on output quality
5. [ ] Document edge cases and limitations
