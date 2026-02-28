# Implementation Plan: SPA Assistant v2

**Spec:** `../product/spec-spa-assistant.md`
**Review:** `review-spa-assistant.md`
**Branch:** `feat/spa-assistant-v2`

## Description

Build a Custom GPT that helps financial due diligence professionals analyze Share Purchase Agreements (SPAs). The assistant uses 8 structured playbooks to extract key terms, assess bias (buyer/seller favorable), and benchmark against market standards.

**Why v2?** The initial implementation had architectural issues identified in review:
- Monolithic 696-line playbook file (hard for GPT to parse)
- No system prompt (playbooks exist but no routing logic)
- Inconsistent schema (Playbook 8 missing sections, citation formats vary)
- Benchmark duplication (playbooks duplicate values from benchmarks file)
- Descriptions instead of templates (GPT produces inconsistent output)

**v2 Architecture:**
```
gpt/
├── system-prompt.md              # Core instructions + routing + output rules
├── knowledge/
│   └── benchmarks.md             # Single source for all market data
└── playbooks/
    ├── 01-definitions.md         # ~80-100 lines each
    ├── 02-purchase-price.md
    ├── 03-wc-net-debt.md
    ├── 04-earnouts.md
    ├── 05-reps-warranties.md
    ├── 06-commercial-terms.md
    ├── 07-redline.md
    └── 08-roleplay.md
```

**Key Design Decisions:**
1. System prompt handles routing, output rules, and persona
2. Each playbook is self-contained with: Triggers, Process, Output Template, Bias Guidance, Follow-ons
3. Benchmarks referenced by playbooks, never duplicated
4. Output templates use `{{placeholders}}` for GPT to fill
5. All tables include `Section Ref` column for traceability
6. Emoji bias indicators throughout (renders well in ChatGPT)

## Scope

**In:**
- System prompt with routing table and output rules
- 8 modular playbook files (~80-100 lines each)
- Single benchmarks knowledge file
- Consistent schema across all playbooks
- Output templates with placeholders

**Out:**
- Testing with actual SPA documents (separate task)
- GPT configuration in OpenAI platform (separate task)
- Additional playbooks beyond the 8 defined

---

## Tasks

### Phase 1: Foundation

Create the system prompt and establish the consistent playbook schema.

- [ ] **1.0 Create system prompt**
  - [ ] 1.1 Create `gpt/system-prompt.md` with role definition, scope enforcement, and routing table
  - [ ] 1.2 Add output rules section (citation format, bias indicators, ordering, confidence levels)
  - [ ] 1.3 Add UX flow section (upload → scan → menu → playbook → follow-ons)
  - [ ] 1.4 Validation: Review system prompt covers all spec requirements from `../product/spec-spa-assistant.md:262-275`

- [ ] **1.1 Define playbook schema**
  - [ ] 1.1.1 Create `gpt/playbooks/TEMPLATE.md` with required sections
  - [ ] 1.1.2 Schema must include: Triggers, Process Steps, Output Template, Bias Guidance (5-level), Market Benchmarks (reference only), Follow-on Prompts (exactly 5)
  - [ ] 1.1.3 Output Template must use `{{placeholder}}` syntax and include `Section Ref` column
  - [ ] 1.1.4 Validation: Template passes checklist from review criteria

### Phase 2: Knowledge Files

Create the single-source benchmarks file with proper citations.

- [ ] **2.0 Create benchmarks knowledge file**
  - [ ] 2.1 Create `gpt/knowledge/benchmarks.md` with all market data
  - [ ] 2.2 Include sections: Escrows, Survival Periods, PPA, Earnouts, Definition Standards
  - [ ] 2.3 Every statistic must have URL citation (no "Industry practice" entries)
  - [ ] 2.4 Fix "ABA 2025" label → "ABA 2023" to match K&L Gates source
  - [ ] 2.5 Include Quick Reference Card at end for fast lookups
  - [ ] 2.6 Include complete Source Index with all URLs used
  - [ ] 2.7 Validation: All statistics traceable to URLs; Source Index complete

### Phase 3: Playbooks 1-4

Create the first four playbooks following the schema.

- [ ] **3.0 Playbook 1: Key Financial Definitions**
  - [ ] 3.1 Create `gpt/playbooks/01-definitions.md`
  - [ ] 3.2 Process steps: Identify terms → Parse inclusions/exclusions → Flag bias → Double-count check → Gap check
  - [ ] 3.3 Output template: Definition table with columns (Definition, Key Inclusions, Key Exclusions, Bias, Section Ref, Observations)
  - [ ] 3.4 Bias guidance: 5-level table for Indebtedness, Cash, Working Capital, Transaction Expenses
  - [ ] 3.5 Market benchmarks: Reference `benchmarks.md#definition-standards`
  - [ ] 3.6 Follow-on prompts: 5 drill-down options from spec
  - [ ] 3.7 Validation: Schema complete; <100 lines; citation format consistent

- [ ] **3.1 Playbook 2: Purchase Price Mechanics**
  - [ ] 3.1.1 Create `gpt/playbooks/02-purchase-price.md`
  - [ ] 3.1.2 Process steps: Identify pricing basis → Extract base → Map adjustments → Build equation → Identify withheld → Map consideration → Identify contingent
  - [ ] 3.1.3 Output template: Price Bridge table with `Section Ref` column + 30-second summary script
  - [ ] 3.1.4 Bias guidance: 5-level for NWC Target, Cash Definition, Indebtedness, Transaction Expenses, Escrow
  - [ ] 3.1.5 Market benchmarks: Reference `benchmarks.md#purchase-price-adjustments` and `benchmarks.md#escrows`
  - [ ] 3.1.6 Validation: Schema complete; <100 lines

- [ ] **3.2 Playbook 3: Working Capital vs Net Debt**
  - [ ] 3.2.1 Create `gpt/playbooks/03-wc-net-debt.md`
  - [ ] 3.2.2 Process steps: Map GL accounts to buckets → Apply decision tree → Double-count detection → Gap detection → NWC target reasonableness
  - [ ] 3.2.3 Output template: Bucket Mapping table, Double-Count Risk Matrix, NWC Reasonableness table
  - [ ] 3.2.4 Bias guidance: 5-level for NWC Definition, Net Debt, Disputed Items, Collar
  - [ ] 3.2.5 Remove references to "Deferred Revenue/Income Taxes/Intercompany market standards" (not in benchmarks) — use "highly negotiated, deal-specific" language instead
  - [ ] 3.2.6 Validation: Schema complete; benchmark refs align with benchmarks.md

- [ ] **3.3 Playbook 4: Earn-Out Provisions**
  - [ ] 3.3.1 Create `gpt/playbooks/04-earnouts.md`
  - [ ] 3.3.2 Process steps: Extract metric → Parse calculation rules → Map periods → Identify thresholds/caps → Extract covenants → Identify acceleration → Review disputes → Check set-off
  - [ ] 3.3.3 Output template: Earn-Out Summary table with `Section Ref` column + Risk Assessment matrix
  - [ ] 3.3.4 Bias guidance: 5-level for Metric Definition, Accounting Basis, Operational Covenants, Set-Off, Acceleration, Reporting
  - [ ] 3.3.5 Market benchmarks: Reference `benchmarks.md#earnouts`
  - [ ] 3.3.6 Validation: Schema complete; <100 lines

### Phase 4: Playbooks 5-8

Create the remaining four playbooks.

- [ ] **4.0 Playbook 5: Reps & Warranties**
  - [ ] 4.0.1 Create `gpt/playbooks/05-reps-warranties.md`
  - [ ] 4.0.2 Process steps: Inventory reps → Identify FDD-relevant → Parse qualifiers → Assess strength → Map to indemnification → Identify special treatment
  - [ ] 4.0.3 Output template: Rep Coverage table with `Section Ref` column + Qualifier Impact Analysis + Fundamental Reps List
  - [ ] 4.0.4 Bias guidance: 5-level for FS Rep, Undisclosed Liabilities, Tax Rep, Qualifiers, Survival
  - [ ] 4.0.5 Market benchmarks: Reference `benchmarks.md#survival-periods`
  - [ ] 4.0.6 Validation: Schema complete

- [ ] **4.1 Playbook 6: Key Commercial Terms**
  - [ ] 4.1.1 Create `gpt/playbooks/06-commercial-terms.md`
  - [ ] 4.1.2 Process steps: Extract structure → Extract economics → Extract closeability → Extract risk allocation → Extract covenants → Flag non-standard
  - [ ] 4.1.3 Output template: 1-Page IC Summary format + Key Terms table with `Section Ref`
  - [ ] 4.1.4 Bias guidance: "Apply bias scale to each term individually; inherit guidance from relevant playbook category"
  - [ ] 4.1.5 Market benchmarks: Reference all relevant sections of benchmarks.md
  - [ ] 4.1.6 Validation: Schema complete

- [ ] **4.2 Playbook 7: Smart Redline**
  - [ ] 4.2.1 Create `gpt/playbooks/07-redline.md`
  - [ ] 4.2.2 Process steps: Strip noise → Categorize by materiality → Flag high-signal triggers → Score issues → Map directionality → Identify sleeper changes
  - [ ] 4.2.3 Output template: Layer 1 Executive Issue List + Layer 2 Themed Summary + Layer 3 Change Log + Sleeper Alert
  - [ ] 4.2.4 Bias guidance: 3-level (Buyer-Favorable, Neutral, Seller-Favorable) for each change
  - [ ] 4.2.5 Market benchmarks: Explicit list — escrow % (9-10% non-insured), survival (12-18 mo), cap/basket ranges, earnout prevalence (13-26%)
  - [ ] 4.2.6 Validation: Benchmark categories explicitly listed (not "cross-reference")

- [ ] **4.3 Playbook 8: Roleplay**
  - [ ] 4.3.1 Create `gpt/playbooks/08-roleplay.md`
  - [ ] 4.3.2 Process steps: Identify user perspective → Extract terms to negotiate → Load standard arguments → Generate opening → Prepare counterarguments → Identify fallbacks → Suggest trades → Distinguish posturing vs red lines
  - [ ] 4.3.3 Output template: Negotiation Briefing format (Your Position table, Anticipated Response table, Scripts, Red Line Assessment)
  - [ ] 4.3.4 **Add Bias Rating Guidance section** (missing in v1): Whether proposed language/positions favor Buyer or Seller
  - [ ] 4.3.5 **Add Market Benchmarks section** (missing in v1): Reference `benchmarks.md` for common negotiation anchors (escrow %, survival, caps)
  - [ ] 4.3.6 Include Standard Arguments Reference for 16 topics
  - [ ] 4.3.7 Include Common Trade-Offs list (10 package deals)
  - [ ] 4.3.8 Validation: Schema complete with all required sections

### Phase 5: Integration & Validation

Ensure all files work together and pass review criteria.

- [ ] **5.0 Cross-file consistency check**
  - [ ] 5.0.1 Verify citation format is `[Section X.Y, Page Z]: "excerpt"` in all 8 playbooks
  - [ ] 5.0.2 Verify all primary output tables include `Section Ref` column
  - [ ] 5.0.3 Verify all playbooks use emoji bias indicators (not bracket notation)
  - [ ] 5.0.4 Verify all benchmark references point to actual sections in benchmarks.md
  - [ ] 5.0.5 Verify each playbook is <100 lines

- [ ] **5.1 System prompt integration**
  - [ ] 5.1.1 Update routing table with final playbook file names
  - [ ] 5.1.2 Verify all 8 playbooks listed in routing table with correct triggers
  - [ ] 5.1.3 Add knowledge file references to system prompt

- [ ] **5.2 Final validation**
  - [ ] 5.2.1 Run through review checklist from `review-spa-assistant.md`
  - [ ] 5.2.2 Verify Playbook 8 has Bias Rating Guidance and Market Benchmarks sections
  - [ ] 5.2.3 Verify benchmarks.md has no "Industry practice" entries
  - [ ] 5.2.4 Verify Source Index is complete
  - [ ] 5.2.5 Total file count: 1 system prompt + 1 benchmarks + 8 playbooks = 10 files

---

## Context

**Key files:**

- `../product/spec-spa-assistant.md`: Main specification with requirements, UX flow, and acceptance criteria
- `review-spa-assistant.md`: Detailed review with specific issues and line numbers
- `../playbooks/spa-playbooks.md`: v1 playbooks (reference for content, not structure)
- `../knowledge/market-benchmarks.md`: v1 benchmarks (reference for data, fix citations)
- `../research/02-key-financial-definitions.md`: Domain knowledge for Playbook 1
- `../research/03-purchase-price-mechanics.md`: Domain knowledge for Playbook 2
- `../research/05-earnouts.md`: Domain knowledge for Playbook 4
- `../research/08-redline-comparison.md`: Domain knowledge for Playbook 7
- `../research/09-negotiation-roleplay.md`: Domain knowledge for Playbook 8

**Research files (for domain content only):**
- `../research/01-excellence-in-fdd.md` — FDD context
- `../research/02-key-financial-definitions.md` — Definitions content
- `../research/03-purchase-price-mechanics.md` — Purchase price content
- `../research/04-working-capital-vs-net-debt.md` — WC/Net Debt content
- `../research/05-earnouts.md` — Earnout content
- `../research/06-reps-and-warranties.md` — R&W content
- `../research/07-key-commercial-terms.md` — Commercial terms content
- `../research/08-redline-comparison.md` — Redline content
- `../research/09-negotiation-roleplay.md` — Roleplay content
- `../research/10-output-format.md` — Output formatting guidance

---

## Design Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| File structure | 1 system prompt + 1 benchmarks + 8 playbooks | Modular; GPT can retrieve focused content |
| Playbook size | ~80-100 lines max | Easier for GPT to parse and follow |
| Bias indicators | Emoji (🔴🟠🟢) | Renders better in ChatGPT than brackets |
| Citation format | `[Section X.Y, Page Z]: "excerpt"` | Consistent; includes page for quick verification |
| Output templates | `{{placeholder}}` syntax | GPT produces consistent output |
| Benchmark references | Point to benchmarks.md, never duplicate | Single source of truth; prevents drift |
| Playbook 6 bias guidance | "Inherit from relevant category" | Commercial terms aggregate multiple types |
| Playbook 8 roleplay | Simple briefing format, not round-based | GPT conversation differs from live training |

---

## Assumptions

- Custom GPT will be configured in OpenAI's GPT Builder (not API)
- Knowledge files will be uploaded as documents to the GPT
- System prompt will be pasted into the "Instructions" field
- GPT has native ability to parse Word (.docx) and PDF documents
- Users are financial due diligence professionals familiar with SPA terminology

---

## Patterns to Follow

**Output Template Pattern (from research-10):**
```markdown
| Term | Value | Bias | Section Ref | Observations |
|------|-------|------|-------------|--------------|
| {{term_name}} | {{extracted_value}} | {{bias_emoji}} | [{{section}}, p{{page}}] | {{key_observation}} |
```

**Bias Guidance Pattern:**
```markdown
| Rating | Indicator | Example for [Topic] |
|--------|-----------|---------------------|
| Highly Buyer-Favorable | 🔴 | [specific example] |
| Buyer-Favorable | 🟠 | [specific example] |
| Neutral | 🟢 | [specific example] |
| Seller-Favorable | 🟠 | [specific example] |
| Highly Seller-Favorable | 🔴 | [specific example] |
```

**Market Benchmark Reference Pattern:**
```markdown
### Market Benchmarks

See `benchmarks.md#section-name` for current market data.

Key benchmarks for this playbook:
- [Benchmark 1]: [typical value]
- [Benchmark 2]: [typical value]
```

---

## Open Questions

None — all design decisions resolved based on review findings and architectural improvements discussed.

---

## Appendix A: System Prompt Template

```markdown
# SPA Assistant

You are an expert financial due diligence assistant specializing in Share Purchase Agreement (SPA) analysis. Your users are senior managers, associates, and partners at accounting/advisory firms reviewing M&A transactions.

## Scope
You ONLY handle:
- SPA document analysis (Word or PDF)
- Redline comparison of two SPA versions
- M&A legal/financial topics related to SPAs
- Negotiation simulation for SPA terms

Politely decline requests outside this scope.

## Routing Table

| User Intent | Playbook |
|-------------|----------|
| "definitions", "indebtedness", "cash definition", "working capital definition" | 01-definitions |
| "purchase price", "price bridge", "adjustments", "funds flow" | 02-purchase-price |
| "working capital", "NWC", "net debt", "bucket placement", "double count" | 03-wc-net-debt |
| "earn-out", "earnout", "contingent consideration", "milestone" | 04-earnouts |
| "reps", "warranties", "representations", "qualifiers", "survival" | 05-reps-warranties |
| "key terms", "summarize", "deal overview", "IC summary" | 06-commercial-terms |
| "compare", "redline", "changes", "what changed" | 07-redline |
| "roleplay", "negotiate", "what would buyer say", "counter-argument" | 08-roleplay |

## Output Rules

### Citations
Format: `[Section X.Y, Page Z]: "relevant excerpt"`
Missing items: "Not found in document — typically in [expected location]"

### Bias Indicators
| Level | Indicator |
|-------|-----------|
| Highly Buyer-Favorable | 🔴 |
| Buyer-Favorable | 🟠 |
| Neutral | 🟢 |
| Seller-Favorable | 🟠 |
| Highly Seller-Favorable | 🔴 |

### Ordering
Present findings by severity: strongest bias first, Neutral last.

### Confidence
For ambiguous clauses: High / Medium / Low

## UX Flow

1. User uploads SPA → Scan for relevant analyses → Present top 3-5 as numbered menu
2. User selects number or asks freeform → Run playbook → Output in defined format
3. Offer 5 follow-on prompts specific to that playbook
4. User can drill deeper, run another playbook, or ask questions

## Knowledge Files
- `benchmarks.md`: Market standard data (always cite when comparing)
- `playbooks/01-08`: Analysis workflows (follow exactly)
```

---

## Appendix B: Playbook Schema Template

```markdown
# Playbook N: [Name]

## Triggers
- "[trigger phrase 1]"
- "[trigger phrase 2]"
- "[trigger phrase 3]"

## Process Steps
1. [Action verb] — [what to do]
2. [Action verb] — [what to do]
3. [Action verb] — [what to do]
...

## Output Template

**Primary Table:**

| Column 1 | Column 2 | Bias | Section Ref | Observations |
|----------|----------|------|-------------|--------------|
| {{value}} | {{value}} | {{emoji}} | [{{ref}}] | {{note}} |

**Summary Section:**
> [Template for summary text with {{placeholders}}]

## Bias Rating Guidance

| Rating | Indicator | [Topic 1] | [Topic 2] |
|--------|-----------|-----------|-----------|
| Highly Buyer-Favorable | 🔴 | [example] | [example] |
| Buyer-Favorable | 🟠 | [example] | [example] |
| Neutral | 🟢 | [example] | [example] |
| Seller-Favorable | 🟠 | [example] | [example] |
| Highly Seller-Favorable | 🔴 | [example] | [example] |

## Market Benchmarks

See `benchmarks.md#[section]` for current data.

Key benchmarks:
- [Benchmark]: [value]
- [Benchmark]: [value]

## Follow-on Prompts
1. "[Drill-down prompt 1]"
2. "[Drill-down prompt 2]"
3. "[Drill-down prompt 3]"
4. "[Drill-down prompt 4]"
5. "[Drill-down prompt 5]"
```

---

## Appendix C: Implementation Prompt

**For the implementing developer:**

You are implementing the SPA Assistant v2, a Custom GPT for financial due diligence professionals. This plan contains everything you need.

### What You're Building
A modular GPT configuration with:
- 1 system prompt (`gpt/system-prompt.md`)
- 1 knowledge file (`gpt/knowledge/benchmarks.md`)
- 8 playbook files (`gpt/playbooks/01-08`)

### How to Navigate This Plan
1. **Start with Phase 1** — Create the system prompt and playbook template first
2. **Phase 2** — Create the benchmarks file (single source of truth for all market data)
3. **Phases 3-4** — Create playbooks in order, using the template from 1.1
4. **Phase 5** — Cross-check everything against the review criteria

### Key Constraints
- Each playbook must be **<100 lines** (forces focus)
- Every output table must have a **Section Ref column** (traceability requirement)
- All benchmarks must have **URL citations** (no "Industry practice" allowed)
- Use **emoji** bias indicators (🔴🟠🟢), not brackets
- Citation format is **`[Section X.Y, Page Z]: "excerpt"`** everywhere

### Where to Find Domain Content
- **Playbook 1 (Definitions)**: `../research/02-key-financial-definitions.md` — Copy the inclusions/exclusions/red flags
- **Playbook 2 (Purchase Price)**: `../research/03-purchase-price-mechanics.md` — Use the price bridge format
- **Playbook 3 (WC/Net Debt)**: `../research/04-working-capital-vs-net-debt.md` — Use the bucket mapping approach
- **Playbook 4 (Earnouts)**: `../research/05-earnouts.md` — Use the metrics taxonomy and dispute risks
- **Playbook 5 (R&W)**: `../research/06-reps-and-warranties.md` — Use the qualifier analysis
- **Playbook 6 (Commercial Terms)**: `../research/07-key-commercial-terms.md` — Use the 20-term extraction list
- **Playbook 7 (Redline)**: `../research/08-redline-comparison.md` — Use the three-layer format
- **Playbook 8 (Roleplay)**: `../research/09-negotiation-roleplay.md` — Use the standard arguments by topic

### What v1 Got Wrong (Don't Repeat)
1. ❌ One 696-line playbook file → ✅ 8 separate files, ~80-100 lines each
2. ❌ No system prompt → ✅ System prompt with routing table
3. ❌ Playbook 8 missing Bias Guidance and Market Benchmarks → ✅ Include both
4. ❌ "Industry practice" citations → ✅ URL citations only
5. ❌ Bracket bias indicators `[B]/[b]/[N]` → ✅ Emoji indicators
6. ❌ Tables without Section Ref column → ✅ All tables have Section Ref
7. ❌ Duplicated benchmarks in playbooks → ✅ Reference benchmarks.md

### Validation Checklist (Run Before Done)
- [ ] System prompt has routing table with all 8 playbooks
- [ ] Each playbook has: Triggers, Process, Output Template, Bias Guidance, Market Benchmarks, Follow-ons
- [ ] Playbook 8 has Bias Rating Guidance section
- [ ] Playbook 8 has Market Benchmarks section
- [ ] All benchmark citations have URLs (grep for "Industry practice" — should return 0)
- [ ] All tables have Section Ref column
- [ ] Citation format is consistent: `[Section X.Y, Page Z]: "excerpt"`
- [ ] All playbooks <100 lines
- [ ] Total files: 10 (1 system prompt + 1 benchmarks + 8 playbooks)

### Success Criteria
When complete, a reviewer should be able to:
1. Open the system prompt and understand how routing works
2. Open any playbook and see a complete, self-contained analysis workflow
3. Find any market benchmark in one place (benchmarks.md)
4. Trace any finding back to a specific SPA section via the Section Ref column

Good luck. The domain content is thorough — your job is to structure it cleanly.
