# Meta Prompt v3 vs v2 – Eval Comparison Report

This report compares **Meta Prompt v3** against **Meta Prompt v2** using the combined eval file `Meta Prompt v3 Final (1).csv`, where:

- `prompt_1_*` columns contain **v3** outputs, and
- `prompt_2_*` columns contain **v2** outputs,  
- template labels come from `expected_template` (Essential / Standard / Research),
- the simple grader was run on **v3** only (prompt_1).

All examples below use the same test cases so you can see v3 and v2 prompts on identical questions.

---

## 1. Grader Results for v3

**Dataset:** 50 cases (`F001`–`F050`) in `Meta Prompt v3 Final (1).csv`.

- **Pass rate (v3 / prompt_1):**
  - `prompt_1_Scoring grader_label`: `"Pass"` for **all 50/50** cases.
  - `prompt_1_Scoring grader_pass`: `true` for **all 50/50** cases.
- **Score field:**
  - `prompt_1_Scoring grader_score`: `1` everywhere (the grader is configured as a binary Pass/Fail; `1` = Pass).
- **Qualitative grader reasoning (typical):**
  - Prompts preserve an **instruction-only stance** (no task execution).
  - Template choice and constraint handling are acceptable for all cases.
  - Output format is sufficiently clear for the grader’s rubric.

**Summary:** under the current simple grader, **v3 passes 100% of cases** and is judged structurally sound across all three template families.

> Note: The same grader was also run on a separate v2-only file (`Meta Prompt v2 Final Eval.csv`) and reported 50/50 passes there as well. However, the **prompt content is materially different** between v2 and v3, as shown below.

---

## 2. Length & Template-Level Statistics (v3 vs v2)

For each case, we extracted the actual optimized prompt text from the JSON response and counted words.

**Average prompt length by template (words):**

| Template   | Version | Cases | Avg words | Min | Max |
|-----------|---------|-------|-----------|-----|-----|
| Essential | v3      | 14    | 124       | 99  | 177 |
| Essential | v2      | 14    | 364       | 26  | 986 |
| Standard  | v3      | 26    | 182       | 126 | 327 |
| Standard  | v2      | 26    | 1132      | 442 | 1727 |
| Research  | v3      | 10    | 263       | 242 | 312 |
| Research  | v2      | 10    | 843       | 546 | 1173 |

High‑level patterns:

- v3 prompts are **3–6× shorter** on average, especially for Standard (≈1.1k → ≈180 words).
- v2 prompts often include large `# Role / # Task / # Plan` blocks, quality bars, and example outline sections, which inflate length and complexity.
- v3 tends to:
  - Remove the outer ```markdown fences.
  - Avoid top-level “meta” headings.
  - Centralize the output contract in one concise block.

The sections below show concrete side‑by‑side examples per template.

---

## 3. Essential Template – Side‑by‑Side Examples

### 3.1 Example 1 – F001 (Audit – Y/N Accrual Decision)

**Case summary:**  
Decide whether there is enough support to book a Q4 bonus accrual; output must be exactly `Y` or `N`.

#### v3 (prompt_1 – Essential, ~99 words)

```text
You are evaluating an accounting judgment under US GAAP. Think through the analysis step by step, but do not show your reasoning. Do not cite sources and do not call tools.

Task: Decide whether there is enough audit support to book the Q4 bonus accrual for a US GAAP client preparing year-end financial statements.

Facts available:
- Forecasted Q4 financials
- Historical bonus payout percentage vs. revenue
- Signed board-approved compensation plan
- Email from the CFO confirming intent to pay if targets are achieved

Output format: Return exactly one character, either `Y` or `N`, with no other text.
```

#### v2 (prompt_2 – Essential, ~455 words, excerpt)

```text
```markdown
# Objective
Decide whether there is sufficient support to book the Q4 bonus accrual for a US GAAP client. Return only a single character: Y or N.

# Inputs
- All provided materials and attachments related to:
  - Bonus/compensation plans and board approvals.
  - Forecasted Q4 financials and historical payout patterns.
  - Emails or other documentation from management (e.g., CFO) confirming intent to pay if performance targets are achieved.

# Role
You are an experienced audit senior evaluating whether there is enough evidence to support booking a bonus accrual at year-end under US GAAP.

# Instructions
- Consider:
  - Whether the obligation is present and probable at year-end.
  - Whether the amount of the accrual can be reasonably estimated.
  - The consistency of current-year assumptions with historical payouts and patterns.
  - Any contradictory evidence or significant uncertainties.
- Use the facts provided; do not assume external data.
- Do not call tools or browse.

# Output
- Return **only** one character:
  - `Y` if, based on the information, there appears to be enough support to book the accrual.
  - `N` if there is not enough support.
- Do not include explanations, qualifiers, or additional text.
```
```

> v2 excerpted; the full prompt includes additional clarifications and repetition.

**Key differences:**

- v3 expresses the role, task, and output rules in **one short block**.
- v2 wraps everything in ```markdown fences and adds multiple headings (`# Objective`, `# Inputs`, `# Role`, `# Instructions`, `# Output`), restating constraints several times.
- Semantically, both drive to a `Y`/`N` decision; v3 does so with far fewer tokens and less meta‑scaffolding.

---

### 3.2 Example 2 – F013 (Finance – CSV Transform)

**Case summary:**  
Convert three journal entry descriptions into a 3‑row CSV with specified header; output only raw CSV, no fences.

#### v3 (prompt_1 – Essential, ~115 words)

```text
You are given three accounting journal entry descriptions. Convert them into CSV format.

Descriptions:
1) Debit Cash 10,000 and Credit Revenue 10,000 for a services invoice.  
2) Debit Rent Expense 3,000 and Credit Cash 3,000.  
3) Debit Accounts Receivable 5,000 and Credit Revenue 5,000.

Task:
- Create exactly one CSV data row for each description, plus a single header row.
- Use the header: `account,debit,credit`.
- Use positive numeric values with no currency symbols or commas (e.g., `10000`, not `10,000`).
- Do not add, change, or omit any entries.
- Do not include any commentary, explanation, or markdown fences.

Output format:
- Return only raw CSV text, exactly 4 lines: header + 3 data rows.
```

#### v2 (prompt_2 – Essential, ~342 words, excerpt)

```text
```markdown
# Role
You are a precise data transformation assistant.

# Goal
Convert the provided list of journal entries into a CSV with header `account,debit,credit` and exactly three data rows derived from the descriptions.

# Inputs
- Journal entries described in plain English, each with:
  - Account names (e.g., Cash, Rent Expense, Revenue, Accounts Receivable).
  - Debit and credit amounts (e.g., 10,000).
  - High-level transaction context (e.g., “services invoice”).

# Instructions
- Interpret each description and map it into one CSV row.
- Do not create additional rows beyond the three provided entries.
- Use only positive numeric values with no currency symbols or commas (e.g., `10000`, not `10,000`).
- Do not infer or add extra fields.

# Output Format
- Output **only** raw CSV (no markdown fences, no commentary).
- First line must be exactly: `account,debit,credit`.
- Each subsequent line must contain a single account and the corresponding debit/credit amounts based on the description.
```
```

**Key differences:**

- v3 is **short, focused**, and immediately usable.
- v2 adds an explicit `# Role`, `# Goal`, `# Inputs`, `# Instructions`, `# Output Format` hierarchy inside a ```markdown fence, inflating length and complexity.
- Both enforce the same core constraints; v3 does so with a much tighter surface area.

---

## 4. Standard Template – Side‑by‑Side Examples

### 4.1 Example 1 – F017 (Assurance – Revenue Cutoff Memo Template)

**Case summary:**  
Create a reusable “Revenue Cutoff Testing Memo” template for a retail client with POS + e‑commerce; Standard template expected.

#### v3 (prompt_1 – Standard, ~181 words)

```text
You are an accounting/audit specialist. Draft a reusable template for a “Revenue Cutoff Testing Memo” for a retail client.

Assumptions:
- Client reports under US GAAP.
- December 31 year-end.
- Multiple physical retail locations using POS systems.
- One e-commerce channel with nationwide shipping.

Focus on year-end revenue cutoff testing around 12/31, and how to handle both POS and e-commerce channels distinctly (e.g., recognition point, shipping terms, returns, gift cards if relevant).

Include these main headings and draft adaptable, neutral wording under each:
1. Objective  
2. Scope & Assumptions  
3. Procedures  
4. Results Summary  
5. Conclusion  

Within “Procedures,” clearly distinguish procedures for:
- In-store POS transactions near year-end.
- E-commerce orders near year-end (order date, shipment date, delivery date, carrier cutoffs, returns, etc.).

Within “Results Summary” and “Conclusion,” show how teams should:
- Summarize findings and exceptions.
- Conclude on the appropriateness of cutoff and related revenue recognition.

Output format:
- One complete memo template, ready for auditors to fill in (use placeholders like “[Client Name]”, “[Year-End Date]”).
- Professional, neutral tone; concise paragraphs and short bullet lists where helpful.
```

#### v2 (prompt_2 – Standard, ~1,229 words, excerpt)

```text
```markdown
# Objective
Generate a professional, ready-to-use “Revenue Cutoff Testing” memo template for a retail client. The template must be comprehensive yet easy to tailor, focusing on:
- Objectives of revenue cutoff testing.
- Detailed procedures performed around year‑end (e.g., −X to +Y days).
- How to evaluate exceptions and conclude on results, including potential proposed adjustments and control implications.

# Audience and Tone
- Audience: External audit teams and reviewers; potentially management who may read the conclusion and proposed adjustments.
- Tone: Neutral, professional, and evidence-based.

# Assumptions
- Client is a retail company with both brick-and-mortar stores (POS) and an e-commerce channel.
- Client reports under US GAAP with a December 31 year-end.

# Required Sections
The memo template must include, in order:
1. Cover / Header Information
2. Objective
3. Scope and Period
4. Background and Process Overview
5. Materiality and Risk Considerations
6. Procedures Performed
7. Exceptions and Findings
8. Proposed Adjustments (if any)
9. Conclusion
10. Appendices / Supporting Schedules (if needed)

[…additional detailed bullets and sub-bullets for each section, quality bar, and examples…]
```
```

**Key differences:**

- v3 focuses on **5 core sections** and the bifurcation between POS and e‑commerce procedures, with minimal extra scaffolding.
- v2 prescribes a much longer list of sections (cover page, background, materiality, appendices, etc.) and a more elaborate outline than the test case requires.
- v3 better respects the “no new requirements beyond genre‑standard” rule; v2 tends to add many extras by default.

---

### 4.2 Example 2 – F026 (Deals – 90‑Day Integration Plan)

**Case summary:**  
Phased 90‑day integration plan outline; slide‑friendly tables expected.

#### v3 (prompt_1 – Standard, ~207 words)

```text
You are an experienced M&A integration leader. Think step by step before you answer; do not show your plan.

Create a 90‑day post‑close integration plan outline for a mid‑market technology target being integrated into a larger US‑based corporate buyer. The outline must be phased and highlight owners, key activities, and high‑level KPIs.

Assumptions:
- Tech/software target with existing customers and recurring revenue.
- Buyer is a mature US corporate with established functions and PMO.
- Focus on pragmatic, achievable integration within 90 days (not full transformation).

Phases:
1. Day 1 readiness (Close to end of Week 1)
2. First 30 days (Day 1–30)
3. Remainder of 90 days (Days 31–90)

Workstreams (adapt and combine as needed, max 8 total):
- Governance & Program Management
- People & Culture
- Product & Technology
- Go‑to‑Market & Customer
- Operations, Finance & Legal
- IT & Security

Output format (slide‑friendly):
- Provide three separate Markdown tables, one per Phase.
- Columns: Phase (same for all rows in that table), Workstream, Key Activities, Primary Owner (role/title, not name), High‑Level KPIs.
- Use concise bullet points (1–3 bullets) inside Key Activities and KPIs cells.
- Aim for 4–8 rows (workstreams) per table so the content could realistically fit on 3–4 slides.
```

#### v2 (prompt_2 – Standard, ~1,100 words, excerpt)

```text
```
# Title
90-Day Post-Close Integration Plan Outline (Mid-Market Acquisition)

# Task
Generate an executive-ready, phased 90-day post-close integration plan outline for a mid-market acquisition. The plan must highlight owners (by role/title), key activities, and high-level KPIs across core workstreams, organized by phase.

# Audience
Executive leadership, Integration Management Office (IMO), and functional workstream leads.

# Tone and Style
- Executive, concise, action-oriented, and focused on outcomes.
- Avoid overly academic language; use practical, implementation-ready phrasing suitable for slide decks.

# Assumptions
- Buyer is a larger corporate with existing PMO and integration governance.
- Target is a mid-market operating company with existing customers and recurring revenue.

# Structure
Use three phases:
1. Day 1 (Signing/Close to end of Week 1)
2. Days 2–30
3. Days 31–90

# Required Workstreams
At minimum, cover:
- Governance & Program Management
- People & Culture
- Product & Technology
- Go-to-Market & Customer
- Finance & Operations
- Legal, Risk & Compliance
- IT & Security

[…longer detailed guidance, quality bar, and examples…]
```

**Key differences:**

- v3 gives a **tight, table-driven output spec** that directly matches the eval’s “slide‑friendly” requirement.
- v2 adds extra meta sections (Audience, Tone and Style, Required Workstreams, etc.) and a longer narrative that isn’t strictly needed to produce the desired artifact.
- v3 still gives enough structure for a high‑quality downstream answer but with much lower token cost.

---

## 5. Research Template – Side‑by‑Side Examples

### 5.1 Example 1 – F041 (Legal – EU AI Act Milestones)

**Case summary:**  
As‑of‑this‑quarter EU AI Act milestone brief for internal audit/risk teams; research + citations.

#### v3 (prompt_1 – Research, ~258 words)

```text
You are advising KPMG internal audit and risk professionals who support EU-based or EU-exposed clients on AI governance.

Think step by step before you answer; do not show your plan.

Task: As of the current quarter at the time you answer, summarize the key EU AI Act compliance milestones that could impact clients’ AI projects, with a focus on what internal audit and risk teams need for planning reviews.

Scope and focus:
- Identify key dates and milestones: formal adoption, entry into force, phased application dates, high-risk system obligations, transparency duties, and start of enforcement/sanctioning.
- Emphasize: obligations, timelines, and oversight expectations for high-risk AI systems and relevant foundation/general-purpose models.
- Highlight what internal audit, compliance, and risk teams should schedule in which period (e.g., pre‑entry gap assessment, design effectiveness reviews, readiness assessments, ongoing monitoring).

Research and sources:
- Use up‑to‑date, reputable legal and regulatory sources as of the current quarter, prioritizing: EU AI Act text, EU Commission/Parliament/Council, EDPB/EDPS, and national supervisory authorities; secondarily, major law and consulting firms.
- Where dates or obligations are still evolving (e.g., secondary legislation, guidance), mark them as “draft” or “indicative” and explain briefly.

Output format (concise brief, ~800–1,200 words max):
- Use clear headings:
  1. Overview
  2. Key Milestones and Effective Dates
  3. Obligations for High‑Risk and Other In‑Scope Systems
  4. Implications for Internal Audit and Risk Planning
  5. Enforcement Timing and Supervisory Focus
  6. References
- Use inline numeric citations like [1], [2], etc.
- Under “References”, list each citation number with source name, document/title, date, and URL (if available).
```

#### v2 (prompt_2 – Research, ~1,173 words, excerpt)

```text
```markdown
# Task
Summarize, as of the current quarter, the key EU AI Act compliance milestones that could impact clients’ AI projects, with citations. Prioritize what internal audit and risk teams need to know for planning reviews over the next 12–18 months.

# Audience
- Primary: Internal Audit, Enterprise Risk Management, Compliance leaders.
- Secondary: AI Program/Portfolio Managers, Legal/Regulatory, Model Risk Management (MRM).

# Objectives
- Identify dated milestones (entry-into-force, phased application dates, initial enforcement).
- Highlight obligations and expectations for high-risk and other in-scope AI systems.
- Provide a planning lens for internal audit and risk functions (e.g., when to schedule gap assessments, readiness reviews, and ongoing monitoring).

# Scope & Boundaries
- Focus on the EU AI Act as adopted and major, authoritative secondary guidance.
- Do not write a full treatise on AI ethics; stay focused on compliance milestones and practical implications.

[…additional sections on research approach, evidence standards, quality bar, and output structure…]
```

**Key differences:**

- v3 condenses objectives, scope, research instructions, and output format into a **single concise prompt**, while still enforcing recency and citations.
- v2 adds more meta structure (Audience, Objectives, Scope & Boundaries, sometimes explicit methodology sections) and tends to repeat information.
- v3 better matches the “minimal, outcome‑first structure” guidance while remaining fully Research‑grade.

---

### 5.2 Example 2 – F047 (Markets – Gen‑AI Legal‑Tech Market Analysis)

**Case summary:**  
Research‑driven market analysis of gen‑AI for legal‑tech (NA & Europe) with citations and References section.

#### v3 (prompt_1 – Research, ~252 words)

```text
You are an expert consulting analyst supporting KPMG Deal Advisory on a potential investment thesis in the generative AI for legal-tech sector. Think step by step before you answer; do not show your plan.

Using the most recent data available (prioritize 2023–2025), produce a concise market analysis of the generative AI for legal-tech market in North America and Europe, integrating both the provided internal documents and high‑quality external sources. When multiple sources disagree, briefly note the range and favor more recent, reputable industry or financial data.

Focus on:
- Current market size and key segments (e.g., research, drafting, contract review, e‑discovery, workflow automation) in North America and Europe, plus 3–5 year growth outlook and indicative CAGR.
- Core growth drivers, adoption patterns by customer type (law firms vs. corporate legal vs. public sector), and 2–3 major constraints/risks.

Competitive and deal lens:
- Briefly map representative players (startups and established vendors) by segment and region; avoid exhaustive lists.
- Highlight several notable recent funding rounds (ideally 4–8 across NA/EU) with company, segment, region, funding round, amount, date, and key lead investors, when available.

Output format and style:
- Use clear section headings: Executive Summary; Market Size & Growth Outlook; Representative Players & Competitive Landscape; Recent Funding Activity; Considerations for an Investment Thesis; References.
- Tight, memo‑style brief suitable for an internal deal team, aiming for ~800–1,100 words.
- Use inline numeric citations like “[1]” throughout.
- End with a numbered References section mapping each citation to source name, title, publisher, date, and URL.
```

#### v2 (prompt_2 – Research, ~601 words, excerpt)

```text
```markdown
# Task
Produce a concise, citation-backed market analysis of the Generative AI for Legal-Tech sector in North America and Europe, focusing on market size, growth outlook, and representative players.

# Scope
- Regions:
  - North America: United States and Canada.
  - Europe: UK + EU27 + EEA (incl. Norway) + Switzerland.
- Segment definition: Legal-tech solutions that embed generative AI (LLMs or fine-tuned models) for tasks such as legal research, drafting, contract review/analysis, and workflow automation.

# Audience
- KPMG Deal Advisory professionals preparing an internal investment thesis or market scan.

# Objectives
- Provide a directional view of current market size and 3–5 year growth.
- Identify key segments and representative players (startups and incumbents).
- Highlight recent funding activity and key themes that could matter for an investment thesis.

[…additional sections on research expectations, quality bar, output headings, and examples…]
```

**Key differences:**

- v2 again uses a multi‑page, top‑down structure: `# Task`, `# Scope`, `# Audience`, `# Objectives`, etc.
- v3 distills all of this into a compact description plus a clear output section; it still demands citations and a References section but avoids over‑structuring.

---

## 6. Analysis: Why v3 Is Better

Across Essential, Standard, and Research templates, the comparison shows consistent patterns:

1. **Brevity with preserved intent**
   - v3 prompts are 3–6× shorter on average, yet they preserve the **same core behaviors**:
     - Role definition.
     - Key task focus.
     - Output structure and constraints.
     - Research obligations (for Research).
   - This directly supports the design goal of “minimal, outcome‑first structure.”

2. **Reduced meta‑scaffolding**
   - v2 leans heavily on explicit headings like `# Role`, `# Task`, `# Audience`, `# Objectives`, `# Plan`, `# Quality Bar`, and so on, often wrapped in ```markdown fences.
   - v3 keeps just enough structure to be clear (short role + task + Output Format) and omits the layers of internal‑looking meta sections that are not needed for the downstream assistant.

3. **More faithful to current meta‑prompt guidelines**
   - v3:
     - Avoids outer markdown fences in the prompt itself.
     - Keeps output rules in a single Output Format block or paragraph.
     - Uses a simple “Think step by step; do not show your plan” internal reasoning hint without forcing visible chain‑of‑thought.
   - v2 often:
     - Duplicates constraints in multiple sections.
     - Adds quality bars and examples even when the test case does not ask for them.
     - Sometimes nudges the downstream model toward visible reasoning sections.

4. **Better alignment with template routing philosophy**
   - Essential cases in v3 really are “single surface” prompts with tight constraints.
   - Standard cases in v3 focus on a **small, relevant set of headings** and a straightforward output contract, not a 10–12 section pseudo‑PRD.
   - Research cases in v3 still enforce recency and citations but without over‑specifying research methodology.

5. **Token efficiency & maintainability**
   - Shorter prompts reduce inference cost and latency and are easier to maintain over time.
   - The v2 style would be more fragile to future changes and harder to tune, because much of the behavior is baked into long, repeated scaffolds.

---

## 7. Conclusion & Recommendations

### Is v3 better than v2?

Yes. Even though the simple grader gives both versions a “Pass” across all cases, **v3 is meaningfully better** along several dimensions that matter for deployment:

- **Clarity:** Less meta noise; the key task and constraints are easier to see.
- **Brevity:** 3–6× fewer words on average, especially for Standard prompts.
- **Template fidelity:** v3 leans more cleanly into Essential / Standard / Research semantics.
- **Maintainability:** v3’s prompts are easier to reason about, extend, and adjust without breaking behavior.

### How much better?

- On *grading outcomes*, the improvement does not show up (both versions pass), because the grader is relatively coarse.
- On *prompt quality*, v3 is a **clear qualitative upgrade**:
  - Standard prompts in particular move from “multi‑page mini‑specs” to **tight, well‑scoped templates** that still cover all necessary constraints.
  - Research prompts maintain rigor while dropping unnecessary ceremony.

### Room for further improvement

1. **Finer‑grained grading**
   - Replace the binary Pass/Fail with multi‑score rubrics (1–5 per dimension) so that future changes can be measured more sensitively.

2. **Stress‑testing template routing**
   - Add more borderline cases (e.g., very short Standard vs Essential prompts, research‑ish queries without explicit “cite sources”) to ensure routing remains robust.

3. **Tightening the longest v3 prompts**
   - While v3 is much shorter overall, a few prompts (especially in Standard) still push past 300 words. It may be possible to trim some of these further without losing behavior.

Overall, **Meta Prompt v3 is the right version to adopt going forward**: it keeps the strengths of v2’s structure while significantly improving brevity, clarity, and alignment with the updated meta‑prompt guidelines.

