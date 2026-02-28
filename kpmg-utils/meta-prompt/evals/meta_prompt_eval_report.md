# Meta-Prompt Evaluation Report

## Internal Approach

- Ingested `grader_report.json` and `Prompt Simulation Tests (5).csv` and verified all 50 experiment IDs (`E001`–`E050`) align between the grade data and raw runs.
- Aggregated per-candidate scores across dimensions (role fidelity, template/length, clarity/brevity, constraint alignment, output spec quality, tone/style) and overall scores.
- Analyzed free-text strengths/issues and `meta_prompt_optimizations` to identify recurring failure modes and systemic themes.
- Profiled dataset coverage by domain and expected template (Essential / Standard-Lite / Standard-Full / Research).
- For the appendix, mapped each experiment to its best-ranked candidate (`ranking[0]`) and summarized that candidate’s scores, strengths, issues, and behavior.

---

## Evaluation Overview

- **Dataset size:** 50 experiments (E001–E050), 223 candidate prompts total.
- **Domains (from CSV):** Tech (7), Audit (5), Tax (5), Risk (5), Finance (5), Legal (5), Casual (5), Advisory (4), Assurance (3), Security (3), Deals (2), Research (1).
- **Expected templates (from CSV):**
  - Standard-Lite: 24
  - Standard-Full: 12
  - Research: 8
  - Essential: 6

**Score distributions (per candidate):**

- **Overall:** mean 3.97, range 3–5  
  - 3: 11 candidates  
  - 4: 207 candidates  
  - 5: 5 candidates
- **Role fidelity:** mean 4.87 (2–5) — consistently strong.
- **Template & length:** mean 3.22 (3–5) — moderate.
- **Clarity & brevity:** mean 2.76 (2–5) — weakest dimension  
  - 2: 145, 3: 16, 4: 33, 5: 29.
- **Constraint alignment:** mean 3.92 (2–4) — generally good  
  - 4: 214, 2–3: 9.
- **Output spec quality:** mean 4.0 (3–4).
- **Tone & style:** mean 4.17 (3–5).

**Per-experiment success:**

- Experiments with at least one 5/5 candidate: 3.
- Experiments with at least one “no critical issues; minor polish only” candidate: 14.

---

## Key Findings

### Overall performance

- Most candidates are good but not perfect: ~93% (212/223) score 4 or 5 overall, but only 5/223 reach 5/5.
- The meta-prompt reliably:
  - Keeps an instruction-only stance.
  - Sets appropriate roles, audiences, and deliverables across domains.

### Consistent strengths

- Dominant strength string: **“Maintains instruction-only stance.”** (145 occurrences).
- Other frequent strengths:
  - “Maintains instruction-only stance. Concise and readable guidance.”
  - “Template matches expected structure with reasonable length. Concise and readable guidance.”
  - “Clear framing of the downstream task.”
- Role fidelity and tone are high across professional, technical, and casual tasks.

### Systemic weaknesses

- **Template routing errors** are pervasive:
  - 164 of 223 candidates have issues beginning with “Template detection mismatch…”.
  - Most mismatches are “expected Standard-Lite/Standard-Full, found Essential”.
- **Clarity & brevity** are the weakest dimension:
  - 145 of 223 candidates score 2/5; prompts are frequently more verbose than necessary.
- **Constraint edge cases**:
  - In misrouted cases, constraints around markdown fences and external access (“do not browse”, “code block only”) are only partially enforced.
- **Formatting fences & output-only specs**:
  - Recurrent mention of missing or unclear formatting fences and “output formatting could be clearer”.

### Meta-level optimization themes

For all 50 experiments, the grader proposes the same three meta-optimizations:

1. Tighten template routing to match expected structure.
2. Reinforce constraint parsing, especially fences and external access rules.
3. Trim verbosity to stay within target word budgets.

These align directly with the observed data: misrouting, imperfect constraint handling, and verbosity.

---

## Template Routing & Structure

### Observed pattern

- Issues related to template misclassification dominate:
  - “Template detection mismatch: expected Standard-Lite, found Essential.” — 103 occurrences.
  - “Template detection mismatch: expected Standard-Full, found Essential.” — 32.
  - Smaller counts where expected Standard-* but found Research, or expected Research/Essential but found another template.
- In practice:
  - The meta-prompt **over-biases to Essential**, especially for Standard-Lite / Standard-Full tasks.
  - It sometimes misroutes toward **Research** for tasks that don’t truly require browsing.

### Impact

- When misrouted to Essential:
  - Standard-Lite / Standard-Full tasks lose structural richness (e.g., multi-section outlines, tables plus narrative, multiple deliverables).
- When misrouted to Research:
  - Prompts may over-emphasize browsing/citations for what should be closed-book/template-only tasks.

### Recommended adjustments

- Introduce an explicit, lightweight classifier at the top of the meta-prompt to choose among Essential / Standard-Lite / Standard-Full / Research:
  - Features: number of deliverables, structured output requirements, explicit “latest/as of” / law / policy / citations cues, presence of attachments, explicit brevity requests.
- Consider a “Standard-first” bias:
  - If attachments or multiple structured deliverables are present, default to Standard-Lite/Standard-Full unless strong signals for Essential or Research.
- Add hard overrides:
  - If the user says “code block only”, “return only Y or N”, or “CSV only”, enforce an Essential-style output wrapper even if other signals suggest Standard.

---

## Clarity, Brevity, and Verbosity

- Clarity/brevity is the lowest-performing dimension:
  - 145/223 candidates scored 2/5.
- Many prompts include long “Role/Goal/Scope/Plan” sections and repeated constraints, which is overkill for short, tactical tasks.

### Recommended adjustments

- Introduce template-specific word budgets:
  - Essential: ~150–250 words for simple tasks.
  - Standard-Lite: ~250–400 words.
  - Standard-Full / Research: flexible but aggressively trimmed.
- Add a final compression pass:
  - After constructing the prompt, run a “shrink without losing constraints” step that:
    - Collapses repetitive sentences.
    - Replaces long enumerations with succinct bullets.
- Add a “simplicity override”:
  - For atomic tasks (single code block, CSV-only, Y/N-only decision), favor a tight Essential-style skeleton even if Standard heuristics partly apply.

---

## Constraint Parsing, Fences, and External Access

### What’s working

- Constraint alignment scores are high (4/5 for 214 of 223 candidates).
- The prompts generally respect:
  - Instruction-only behavior (no task execution).
  - External access flags (no-browse vs research mode).
  - Output-only requirements at a high level.

### Where it fails

- In misrouted cases, issues often state:
  - “Constraints only partially addressed or missing formatting fence.”
- Friction points:
  - Markdown/XML fences: some prompts under-specify or mis-specify required output fences.
  - External vs no-browse: non-research tasks sometimes carry unnecessary research affordances or don’t emphasize “no external tools”.
  - Output-only tasks: prompts may spend many words on what not to do while only loosely specifying the final output contract.

### Recommended adjustments

- Map the `checks` schema directly into a short **Output Contract** section:
  - Structure: exact number of bullets/sections/rows where relevant.
  - External: explicit instructions about browsing / tool use.
  - Fence: precise instructions around code fences or raw text.
- For research tasks:
  - Standardize a concise citations pattern (inline numeric [1], [2] plus a short References section) instead of bespoke phrasing.

---

## Domain & Template Coverage

### Domains

- The meta-prompt handles a wide range of domains:
  - Professional: Audit, Assurance, Tax, Legal, Risk, Deals, Security, Finance, Advisory.
  - Technical: SQL, Python, Bash, Terraform, Docker, OpenAPI, JSON Schema.
  - Casual / creative: haiku, bedtime stories, travel itineraries, restaurant lists.
- Strengths (role fidelity, tone, output spec quality) are stable across domains.

### Templates

- Expected template mix in the dataset:
  - Standard-Lite: 24
  - Standard-Full: 12
  - Research: 8
  - Essential: 6
- Research tasks that explicitly require browsing/citations generally route correctly and often receive “no critical issues” comments.
- Misrouting is concentrated in Standard-Lite / Standard-Full tasks being treated as Essential.

---

## Concrete Recommendations

1. **Add explicit template classifier**
   - Implement a small decision layer (rule-based or learned) against this labeled set.
   - Use features such as deliverable count, structured-output signals, “latest/as of” / citations language, attachments, and brevity constraints.

2. **Tighten brevity and redundancy control**
   - Enforce word/section budgets per template.
   - Add a compression pass that removes meta-commentary and merges overlapping instructions while preserving constraints.

3. **Normalize output-contract patterns**
   - Maintain a small library of reusable output-contract snippets:
     - Code-block-only, CSV-only, Y/N-only, single table + short narrative, etc.
   - Snap tasks into these patterns rather than re-inventing contract phrasing.

4. **Harden fence and external-access handling**
   - Map `checks.fence` and `checks.external` directly into standardized language.
   - Make the fence and external-access rules visibly central, not buried.

5. **Iteratively re-grade after changes**
   - Re-run this eval set after each major meta-prompt revision.
   - Track:
     - Template mismatch count.
     - Clarity/brevity distribution.
     - Count of experiments with at least one “no critical issues” candidate.

---

## Appendix — Per-Experiment Summary

> For each experiment, this appendix lists: domain, expected template, the best candidate (by grader ranking), key scores, strengths/issues, the original user prompt, and a one-paragraph description of how the optimized prompt behaves.

### E001 – Summarize the attached 10-K into exactly 5 bullet points for the CFO.

- **Domain / template:** Audit; expected Standard-Lite.  
- **Best candidate:** `E001_prompt_1` (overall 4/5; role 5, template/length 3, clarity/brevity 2, constraint alignment 2, output spec 4, tone/style 5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template detection mismatch (expected Standard-Lite, found Essential); constraints partially addressed, fence handling incomplete.  
- **User prompt:** “Summarize the attached 10-K into exactly 5 bullet points for the CFO.”  
- **Optimized prompt (summary):** Frames the model as a finance expert for a CFO audience, sets a goal of extracting five decision-relevant bullets from the 10‑K, defines inputs (sections like MD&A, financials, risk factors), and specifies constraints such as exactly five bullets, one line per bullet, concrete figures with units, and no reasoning in the final answer.

### E002 – Create a one-page outline for a ASC 740 tax provision memo: sections, owners, due dates.

- **Domain / template:** Tax; expected Standard-Full.  
- **Best candidate:** `E002_prompt_2` (overall 4/5; 5,3,2,2,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential); constraints/fence partially addressed.  
- **User prompt:** “Create a one-page outline for a ASC 740 tax provision memo: sections, owners, due dates.”  
- **Optimized prompt (summary):** Positions the model as drafting an ASC 740 provision memo outline, asks for context (quarterly vs annual, period-end, owners), and instructs output as a compact table of sections with brief descriptors, accountable owner roles, and due dates (T, T+X and calendar equivalents), plus a simple milestone timeline line.

### E003 – Draft interview guide for 6 stakeholder roles. Return a Markdown table: Role | 5 Questions.

- **Domain / template:** Advisory; expected Standard-Lite.  
- **Best candidate:** `E003_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Draft interview guide for 6 stakeholder roles. Return a Markdown table: Role | 5 Questions.”  
- **Optimized prompt (summary):** Directs the model to create a single Markdown table with exactly six stakeholder roles and five open-ended questions per role, allows optional domain/initiative input, and keeps output constrained to the table.

### E004 – Design test steps to validate revenue cutoff for a retail client. Keep to ≤120 words.

- **Domain / template:** Assurance; expected Essential.  
- **Best candidate:** `E004_prompt_3` (overall 5/5; 5,5,5,4,4,5).  
- **Strengths:** Instruction-only stance; template matches expected structure; concise and readable.  
- **Issues:** No critical issues; minor polish only.  
- **User prompt:** “Design test steps to validate revenue cutoff for a retail client. Keep to ≤120 words.”  
- **Optimized prompt (summary):** Essential-style prompt asking for a short numbered list of audit test steps for revenue cutoff around period-end, with word-limit enforcement, assumptions on fiscal year-end and cutoff window, and bullets-only output.

### E005 – List top 7 SOX risks for user access management and suggest a one-line test for each.

- **Domain / template:** Risk; expected Standard-Lite.  
- **Best candidate:** `E005_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “List top 7 SOX risks for user access management and suggest a one-line test for each.”  
- **Optimized prompt (summary):** Instructs the model to enumerate exactly seven SOX-relevant user access risks and, for each, provide a one-line test procedure; suggests a tabular or structured bullet format and focuses on common financial reporting risks.

### E006 – Create a 90-day integration plan with phases, owners, and KPIs.

- **Domain / template:** Deals; expected Standard-Full.  
- **Best candidate:** `E006_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Create a 90-day integration plan with phases, owners, and KPIs.”  
- **Optimized prompt (summary):** Sets a role as an integration PMO lead, defines objectives for a 90‑day integration plan, and asks for phased deliverables with workstreams, owners, milestones, and KPIs, usually in table form plus a brief narrative.

### E007 – Provide a JSON schema for email header fields we must extract.

- **Domain / template:** Tech; expected Standard-Lite.  
- **Best candidate:** `E007_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Provide a JSON schema for email header fields we must extract.”  
- **Optimized prompt (summary):** Casts the model as a senior data architect producing a JSON Schema (Draft 2020‑12) for canonical email headers with typing, `$defs`, and validation rules, instructing output as JSON only.

### E008 – Write a single PostgreSQL function that normalizes phone numbers. Output only a code block.

- **Domain / template:** Tech; expected Standard-Lite.  
- **Best candidate:** `E008_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Write a single PostgreSQL function that normalizes phone numbers. Output only a code block.”  
- **Optimized prompt (summary):** Requires a production-grade `CREATE OR REPLACE FUNCTION` in Postgres 12+ that emits normalized E.164 numbers or NULL, with the final answer restricted to a single fenced `sql` (or `postgres`) code block.

### E009 – Turn these 8 CSV rows into a pivot summary (do not browse).

- **Domain / template:** Finance; expected Standard-Lite.  
- **Best candidate:** `E009_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Turn these 8 CSV rows into a pivot summary (do not browse).”  
- **Optimized prompt (summary):** Positions the model as a data analyst to profile the provided CSV, identify categorical vs numeric fields, produce pivot-style summary tables, and a concise narrative, explicitly forbidding external browsing.

### E010 – Create a 2‑section cease-and-desist letter outline (Facts, Demand).

- **Domain / template:** Legal; expected Standard-Lite.  
- **Best candidate:** `E010_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Create a 2‑section cease-and-desist letter outline (Facts, Demand).”  
- **Optimized prompt (summary):** Directs the model to output only two sections—“Facts” and “Demand”—each with structured bullet prompts and bracketed placeholders for parties, conduct, and requested remedies.

### E011 – As of today, compare current EU AI Act compliance dates vs. NIST AI RMF milestones. Cite sources.

- **Domain / template:** Research; expected Research.  
- **Best candidate:** `E011_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish only.  
- **User prompt:** “As of today, compare current EU AI Act compliance dates vs. NIST AI RMF milestones. Cite sources.”  
- **Optimized prompt (summary):** Sets a policy/standards analyst role, instructs the model to compare EU AI Act compliance dates to NIST AI RMF milestones with explicit focus on legal vs nonbinding nature, requires dated citations and a short, structured output with a comparison table and references.

### E012 – Return only Y or N: Is there enough info to plan inventory test counts?

- **Domain / template:** Audit; expected Essential.  
- **Best candidate:** `E012_prompt_4` (overall 5/5; 5,5,5,4,4,5).  
- **Strengths:** Instruction-only stance; template matches expected structure; concise.  
- **Issues:** No critical issues; minor polish only.  
- **User prompt:** “Return only Y or N: Is there enough info to plan inventory test counts?”  
- **Optimized prompt (summary):** Defines sufficiency criteria for inventory test counts (scope/locations, items or selection criteria, schedule/assignees), instructs review of only internal materials (no browse), and forces the model to output exactly one character, “Y” or “N”.

### E013 – Draft a risk/control matrix template. Include fields and an example row.

- **Domain / template:** Risk; expected Standard-Lite.  
- **Best candidate:** `E013_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Draft a risk/control matrix template. Include fields and an example row.”  
- **Optimized prompt (summary):** Prompts the model, as a risk/control specialist, to output a reusable risk/control matrix with defined fields (risk ID, description, control, frequency, owner, evidence, etc.) and one realistic example row, typically in a Markdown table.

### E014 – Summarize OECD Pillar Two safe harbor updates (last 12 months). 6 bullets. Include dated citations.

- **Domain / template:** Tax; expected Research.  
- **Best candidate:** `E014_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish only.  
- **User prompt:** “Summarize OECD Pillar Two safe harbor updates (last 12 months). 6 bullets. Include dated citations.”  
- **Optimized prompt (summary):** Configures a research prompt that collects recent OECD Pillar Two safe harbor updates, requires exactly six bullets with dates and citations, and targets a tax-professional audience with a brief, high-signal output.

### E015 – Create an incident response checklist (high-level). 10 steps.

- **Domain / template:** Security; expected Standard-Lite.  
- **Best candidate:** `E015_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Create an incident response checklist (high-level). 10 steps.”  
- **Optimized prompt (summary):** Guides the model to produce a 10-step, high-level incident response checklist tailored to cyber/IT incidents, with one short sentence per step and no extraneous commentary.

### E016 – Write a Python script to diff two folders. Output a single fenced code block in python.

- **Domain / template:** Tech; expected Standard-Lite.  
- **Best candidate:** `E016_prompt_2` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Write a Python script to diff two folders. Output a single fenced code block in python.”  
- **Optimized prompt (summary):** Requires a robust, stdlib-only Python script to compare two directories; the final output must be a single `python` fenced code block with no surrounding prose, including CLI parsing and clear diff reporting.

### E017 – Make a stakeholder map with RACI for 5 roles.

- **Domain / template:** Advisory; expected Standard-Full.  
- **Best candidate:** `E017_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Research).  
- **User prompt:** “Make a stakeholder map with RACI for 5 roles.”  
- **Optimized prompt (summary):** Asks for a stakeholder map and RACI matrix for exactly five roles for a project, including assumptions if project details are missing, and constrains output to a small set of structured sections and tables.

### E018 – Create a journal entry template for accruals with examples.

- **Domain / template:** Finance; expected Standard-Lite.  
- **Best candidate:** `E018_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Create a journal entry template for accruals with examples.”  
- **Optimized prompt (summary):** Positions the model as a senior GL accountant, instructs it to create a reusable accrual JE template and several worked examples (with calculations and reversing entries), in a form suitable for a month-end playbook.

### E019 – Provide a contract clause library outline (NDA).

- **Domain / template:** Legal; expected Standard-Full.  
- **Best candidate:** `E019_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Provide a contract clause library outline (NDA).”  
- **Optimized prompt (summary):** Directs the model, as senior contracts counsel, to create a clause-library outline for NDAs (unilateral and mutual) with clause groups, variants, and negotiation notes, often in multiple structured sections.

### E020 – Write test of details for AP existence. Keep to bullets only.

- **Domain / template:** Assurance; expected Essential.  
- **Best candidate:** `E020_prompt_3` (overall 5/5; 5,5,5,4,4,5).  
- **Strengths:** Instruction-only stance; correct template; concise bullets.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “Write test of details for AP existence. Keep to bullets only.”  
- **Optimized prompt (summary):** Clarifies auditing framework, then instructs the model to output a concise list of bullet-only audit tests of details for AP existence at year-end, forbidding headings or paragraphs.

### E021 – Generate a 4‑line haiku about autumn in JSON with keys: line1..line4.

- **Domain / template:** Casual; expected Standard-Lite.  
- **Best candidate:** `E021_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Generate a 4‑line haiku about autumn in JSON with keys: line1..line4.”  
- **Optimized prompt (summary):** Configures a creative-writing assistant to emit a four-line, imagery-rich autumn haiku, output as a JSON object with keys `line1`–`line4`, with short, concrete lines.

### E022 – Give me a restaurant list in SF with addresses (latest openings).

- **Domain / template:** Casual; expected Research.  
- **Best candidate:** `E022_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish only.  
- **User prompt:** “Give me a restaurant list in SF with addresses (latest openings).”  
- **Optimized prompt (summary):** Sets a research task to find recent restaurant openings in San Francisco proper, requiring a concise list with verified addresses, limited geography, and citations to up-to-date sources.

### E023 – Return only a valid OpenAPI 3.1 schema for a todo API.

- **Domain / template:** Tech; expected Standard-Lite.  
- **Best candidate:** `E023_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Return only a valid OpenAPI 3.1 schema for a todo API.”  
- **Optimized prompt (summary):** Instructs the model to output a single OpenAPI 3.1 YAML document beginning with `openapi: 3.1.0` defining a Todo API, with info, paths, schemas, and no markdown fences or commentary.

### E024 – Draft an issue log format with severity definitions and SLA table.

- **Domain / template:** Risk; expected Standard-Full.  
- **Best candidate:** `E024_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Draft an issue log format with severity definitions and SLA table.”  
- **Optimized prompt (summary):** Makes the model an ITSM/PMO process designer and has it output an issue log template, severity definitions, and an SLA policy table, potentially with both human-readable documentation and machine-readable snippets.

### E025 – Provide sample audit PBC list (exactly 12 items).

- **Domain / template:** Audit; expected Standard-Lite.  
- **Best candidate:** `E025_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Provide sample audit PBC list (exactly 12 items).”  
- **Optimized prompt (summary):** Directs the model to generate exactly 12 Prepared By Client items for a year-end external US GAAP audit for a mid-sized private company, with clear, audit-relevant descriptions.

### E026 – Explain Section 174 amortization changes (current year). Cite sources.

- **Domain / template:** Tax; expected Research.  
- **Best candidate:** `E026_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “Explain Section 174 amortization changes (current year). Cite sources.”  
- **Optimized prompt (summary):** Configures a tax research analyst to provide a concise, practitioner-focused brief on current-year Section 174 amortization rules, including what changed, who’s affected, and cited primary sources.

### E027 – Give Terraform code to open port 443 in AWS SG (code only).

- **Domain / template:** Security; expected Standard-Lite.  
- **Best candidate:** `E027_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Give Terraform code to open port 443 in AWS SG (code only).”  
- **Optimized prompt (summary):** Asks for a minimal Terraform HCL snippet defining an `aws_security_group` with inbound 443 from configurable CIDRs, variable blocks for `vpc_id`, `name`, `allowed_cidrs`, and code-only output.

### E028 – Create a one‑page OKR template with examples for a PMO.

- **Domain / template:** Advisory; expected Standard-Full.  
- **Best candidate:** `E028_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Create a one‑page OKR template with examples for a PMO.”  
- **Optimized prompt (summary):** Sets the model as an expert OKR designer, asking for a one-page PMO-focused OKR template and a compact set of concrete PMO example OKRs with measurable KRs.

### E029 – Return CSV with header: account, debit, credit. Provide 3 example rows.

- **Domain / template:** Finance; expected Standard-Lite.  
- **Best candidate:** `E029_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Return CSV with header: account, debit, credit. Provide 3 example rows.”  
- **Optimized prompt (summary):** Requires the model to output only raw CSV text with exact header `account,debit,credit` and exactly three well-formed example rows, no code fences or extra lines.

### E030 – Compare Delaware vs. California data retention requirements for HR files; cite dates.

- **Domain / template:** Legal; expected Research.  
- **Best candidate:** `E030_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “Compare Delaware vs. California data retention requirements for HR files; cite dates.”  
- **Optimized prompt (summary):** Deep research prompt configuring a legal/compliance researcher to compare HR record retention requirements across DE and CA, with a retention matrix, discussion of federal vs state baselines, and dated citations.

### E031 – Draft GitHub issue templates: bug, feature, chore (YAML).

- **Domain / template:** Tech; expected Standard-Lite.  
- **Best candidate:** `E031_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Draft GitHub issue templates: bug, feature, chore (YAML).”  
- **Optimized prompt (summary):** Instructs the model to generate three GitHub Issue Form YAML files (`bug_report.yml`, `feature_request.yml`, `chore.yml`) with appropriate fields and UX.

### E032 – Plan a 2‑day Kyoto itinerary with hours and transit; cite sources.

- **Domain / template:** Casual; expected Research.  
- **Best candidate:** `E032_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “Plan a 2‑day Kyoto itinerary with hours and transit; cite sources.”  
- **Optimized prompt (summary):** Asks a travel planner to produce a time-feasible, hour-by-hour 2‑day Kyoto itinerary with door-to-door transit details and authoritative cited sources for hours and transit information.

### E033 – Red team: list 5 phishing scenarios and 5 detection rules (exactly).

- **Domain / template:** Risk; expected Standard-Full.  
- **Best candidate:** `E033_prompt_1` (overall 4/5; 5,3,4,4,4,5).  
- **Strengths:** Instruction-only stance; concise and readable.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Red team: list 5 phishing scenarios and 5 detection rules (exactly).”  
- **Optimized prompt (summary):** Directs the model to generate exactly five realistic phishing scenarios and exactly five detection rules, in two clearly separated sections, tuned for red-team vs defender audiences.

### E034 – Design control testing steps for ITGC change management.

- **Domain / template:** Audit; expected Standard-Lite.  
- **Best candidate:** `E034_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Design control testing steps for ITGC change management.”  
- **Optimized prompt (summary):** Treats the model as an ITGC audit specialist who designs testing steps for design and operating effectiveness of change management controls, with structured sections and clear sampling/evidence guidance.

### E035 – Provide JSON of state apportionment factors with placeholders.

- **Domain / template:** Tax; expected Standard-Lite.  
- **Best candidate:** `E035_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Provide JSON of state apportionment factors with placeholders.”  
- **Optimized prompt (summary):** Instructs the model to output a single JSON object template where each US state has apportionment factor fields with placeholder tokens rather than real values, formatted with 2-space indentation.

### E036 – Write a walkthrough template for cash receipts (no external).

- **Domain / template:** Assurance; expected Standard-Lite.  
- **Best candidate:** `E036_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Research).  
- **User prompt:** “Write a walkthrough template for cash receipts (no external).”  
- **Optimized prompt (summary):** Sets the model as a senior audit documentation specialist and instructs creation of a comprehensive cash receipts walkthrough template with steps, evidence prompts, and roles, explicitly forbidding external research.

### E037 – Integration risk heatmap: 4 categories × 3 levels with definitions.

- **Domain / template:** Deals; expected Standard-Full.  
- **Best candidate:** `E037_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Integration risk heatmap: 4 categories × 3 levels with definitions.”  
- **Optimized prompt (summary):** Directs the model, as a risk/governance specialist, to define a 4-category × 3-level integration risk heatmap with clear level definitions and guidance for use in integration programs.

### E038 – Write a bash script that zips logs older than 30 days (code only).

- **Domain / template:** Tech; expected Standard-Lite.  
- **Best candidate:** `E038_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Write a bash script that zips logs older than 30 days (code only).”  
- **Optimized prompt (summary):** Instructs the model as a DevOps engineer to produce a robust Bash script that zips log files older than N days, with parameters for directory and days, output as a single fenced `bash` code block.

### E039 – Return only Y or N: do we have enough to book a revenue accrual?

- **Domain / template:** Finance; expected Essential.  
- **Best candidate:** `E039_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “Return only Y or N: do we have enough to book a revenue accrual?”  
- **Optimized prompt (summary):** Defines decision criteria for revenue accrual sufficiency (contract, delivery evidence, price, etc.), restricts the model to internal documents and prior messages, and enforces output as a single-character Y or N.

### E040 – Outline DPA sections and redlines checklist.

- **Domain / template:** Legal; expected Standard-Full.  
- **Best candidate:** `E040_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Research).  
- **User prompt:** “Outline DPA sections and redlines checklist.”  
- **Optimized prompt (summary):** Directs the model to produce a DPA section outline and negotiation redlines checklist calibrated to roles (controller/processor) and jurisdictions (e.g., GDPR), with a concise, practical structure.

### E041 – Write a bedtime story about a dragon (no structure requirements).

- **Domain / template:** Casual; expected Essential.  
- **Best candidate:** `E041_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “Write a bedtime story about a dragon (no structure requirements).”  
- **Optimized prompt (summary):** Configures the model as a warm, imaginative storyteller and asks for a gentle bedtime story about a kind dragon, with age-appropriate tone and a reassuring ending.

### E042 – Draft KRIs for cloud cost overruns; include thresholds and actions.

- **Domain / template:** Risk; expected Standard-Full.  
- **Best candidate:** `E042_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Draft KRIs for cloud cost overruns; include thresholds and actions.”  
- **Optimized prompt (summary):** Prompts the model to generate a KRI catalog for cloud cost overruns with metric definitions, threshold bands, monitoring cadence, ownership, and specific actions at each threshold breach.

### E043 – Create a sampling calculator prompt (inputs, outputs, steps).

- **Domain / template:** Audit; expected Standard-Full.  
- **Best candidate:** `E043_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Create a sampling calculator prompt (inputs, outputs, steps).”  
- **Optimized prompt (summary):** Has the model define inputs, outputs, and calculation logic for a sampling calculator covering scenarios like estimating proportions and means, with validation rules and structured result formats.

### E044 – As of this quarter, summarize R&D credit changes in UK/US with citations.

- **Domain / template:** Tax; expected Research.  
- **Best candidate:** `E044_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “As of this quarter, summarize R&D credit changes in UK/US with citations.”  
- **Optimized prompt (summary):** Configures a senior tax policy analyst to provide a quarterly “as of” briefing on UK/US R&D credit changes, with clear scoping, concise summary, and citations to primary sources.

### E045 – Provide CIS Benchmark checks for Ubuntu in a numbered list of 8.

- **Domain / template:** Security; expected Standard-Lite.  
- **Best candidate:** `E045_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Provide CIS Benchmark checks for Ubuntu in a numbered list of 8.”  
- **Optimized prompt (summary):** Instructs the model to output exactly eight high-impact CIS Ubuntu checks (for a specific version/profile), in a numbered list with concise descriptions.

### E046 – Generate a Dockerfile for a Node 20 app with pnpm. Code block only.

- **Domain / template:** Tech; expected Standard-Lite.  
- **Best candidate:** `E046_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Generate a Dockerfile for a Node 20 app with pnpm. Code block only.”  
- **Optimized prompt (summary):** Directs the model to return a single fenced `dockerfile` code block implementing a multi-stage Dockerfile for a Node 20 app using pnpm, with no surrounding prose.

### E047 – Change management plan outline with RACI and communication matrix.

- **Domain / template:** Advisory; expected Standard-Full.  
- **Best candidate:** `E047_prompt_2` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Full, found Essential).  
- **User prompt:** “Change management plan outline with RACI and communication matrix.”  
- **Optimized prompt (summary):** Positions the model as a management consultant and has it produce a concise change management plan outline including a RACI matrix and communication matrix, with optional assumptions about the change context.

### E048 – Give SQL to compute trailing-12 revenue by customer (Postgres).

- **Domain / template:** Finance; expected Standard-Lite.  
- **Best candidate:** `E048_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** Template mismatch (expected Standard-Lite, found Essential).  
- **User prompt:** “Give SQL to compute trailing-12 revenue by customer (Postgres).”  
- **Optimized prompt (summary):** Asks for PostgreSQL SQL that computes trailing‑12‑month revenue by customer, with schema assumptions, guidance on pre-aggregation and indexing, and a required output schema including `customer_id`, `as_of_date`, `ttm_revenue`, `window_start`, and `window_end`.

### E049 – Policy research: compare state pay transparency laws (links, dates).

- **Domain / template:** Legal; expected Research.  
- **Best candidate:** `E049_prompt_1` (overall 4/5; 5,3,2,4,4,5).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “Policy research: compare state pay transparency laws (links, dates).”  
- **Optimized prompt (summary):** Configures a policy research prompt for comparing pay transparency laws across US states, requiring a comparison table, an executive summary, a note on local ordinances, and explicit links/dates for legal sources.

### E050 – Turn this list into CSV (header: item,qty,price).

- **Domain / template:** Casual; expected Essential.  
- **Best candidate:** `E050_prompt_1` (overall 4/5; 5,3,2,4,4,3).  
- **Strengths:** Maintains instruction-only stance.  
- **Issues:** No critical issues; minor polish.  
- **User prompt:** “Turn this list into CSV (header: item,qty,price).”  
- **Optimized prompt (summary):** Prompts the model to parse a free-form item list and output only CSV with header `item,qty,price`, including mapping rules for quantities (words, ranges, “2 for $5” patterns) and unit pricing; enforces code-free, CSV-only output.

