# Meta-Prompt Eval Appendix – Full Best-Candidate Prompts

## E001 – Summarize the attached 10-K into exactly 5 bullet points for the CFO.

- **Domain:** Audit
- **Expected template:** Standard-Lite
- **Best candidate ID:** E001_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 2, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential. Constraints only partially addressed or missing formatting fence.

### User prompt

Summarize the attached 10-K into exactly 5 bullet points for the CFO.

### Optimized prompt

```
# Goal
Summarize the attached Form 10-K into exactly five bullet points optimized for a CFO audience, highlighting the most decision-relevant financial, liquidity, and risk insights.

# Inputs
- Source: The attached Form 10-K document(s).
- Refer primarily to: MD&A, Consolidated Financial Statements, Notes, Risk Factors, Liquidity and Capital Resources, and Commitments and Contingencies.
- Assume USD unless the filing specifies otherwise.

# Constraints
- Output exactly 5 bullets; no title, preamble, or closing text.
- One line per bullet; keep each bullet concise (aim ≤ 28 words).
- Use concrete figures with units and clear rounding (e.g., $12.3B, $455M, 120 bps, 3.2x).
- Prefer GAAP metrics; if using non-GAAP (e.g., Adjusted EBITDA), label it explicitly and include the nearest GAAP reference where material.
- No speculation or external sources. If a requested element is absent in the 10-K, omit it rather than infer.
- Do not include any reasoning or analysis steps in the output.

# Instructions
1. Identify FY financial performance: revenue and growth/decline vs prior year, operating income/margin, net income/EPS, and notable drivers (pricing, mix, volume, FX, one-offs).
2. Extract profitability and efficiency: gross margin trends, operating margin, segment performance highlights, notable cost actions, restructuring, or impairment charges.
3. Summarize liquidity and capital structure: cash and equivalents, total debt and maturity profile, net leverage, FCF/CFO, capex, credit facilities (size/availability), covenant headroom, and rating actions if disclosed.
4. Capture capital allocation: dividends, buybacks, M&A activity, and stated capital priorities.
5. Provide outlook/forward-looking elements and top risks: guidance (if any), strategic priorities, material risk factors, legal/regulatory issues, supply chain/customer concentration, and commitments/contingencies.
6. Compute and include YoY changes where most insightful; use deltas or bps changes for margins. Round cleanly and ensure internal consistency with the 10-K.
7. Select the five most CFO-salient takeaways from steps 1–5. Prioritize clarity, materiality, and decision-usefulness over completeness.
8. Write crisply in an executive tone. Begin each bullet with a short theme label followed by the key takeaway and supporting numbers.

# Output Format
- 5 bullets, each on its own line, using a leading hyphen.
- Structure: Theme: key takeaway; most material numbers and drivers.
- Example (illustrative only):
  - Performance: Revenue up 8% YoY to $12.4B; operating margin 14% (+120 bps) on mix/pricing; EPS $3.10.
  - Liquidity: Cash $2.1B; net debt $4.6B; FCF $820M; undrawn revolver $1.0B.
  - Capital allocation: Capex $450M; buybacks $300M; dividend +5%; $220M M&A closed.
  - Outlook: No formal guidance; priorities—margin expansion, supply normalization, cost discipline.
  - Risks: Customer concentration 42%; regulatory probe; warranty accruals increased.

# Quality Bar
- Accuracy: Figures and qualifiers match the 10-K exactly; units and signs are correct.
- Brevity: No filler language; each bullet communicates one clear idea with numbers.
- Relevance: Focus on what a CFO needs for capital planning, liquidity management, and risk oversight.
```

## E002 – Create a one-page outline for a ASC 740 tax provision memo: sections, owners, due dates.

- **Domain:** Tax
- **Expected template:** Standard-Full
- **Best candidate ID:** E002_prompt_2 (prompt_2)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 2, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential. Constraints only partially addressed or missing formatting fence.

### User prompt

Create a one-page outline for a ASC 740 tax provision memo: sections, owners, due dates.

### Optimized prompt

```markdown
You are drafting a one-page outline for an ASC 740 tax provision memo that the corporate tax and controllership team will use to plan and execute the provision and support external audit review.

# Needs Input
Is this a quarterly or annual provision, what is the reporting period-end date, and who are the key owners/reviewers (roles or names) and the filing deadline?

If not provided, proceed assuming a quarterly provision for a calendar quarter-end (T), with a 10-Q filing deadline at T+40, internal sign-off at T+35, and external auditor review at T+37.

Task
- Produce a single-page, compact outline that lists memo sections with brief descriptors, the accountable owner for each section (role-level, e.g., Tax Manager), and due dates relative to period-end (use T, T+X). If the reporting period-end and filing date are provided, translate T+X to actual calendar dates in parentheses.
- Keep the outline practical for execution and audit support; emphasize sequencing and dependencies.

Audience
- Corporate tax, controllership, and external auditors.

Output format
- One compact table with four columns: Section | What it covers (1 line) | Owner (role) | Due date (T+X or date).
- Below the table, add a single-line milestone timeline (e.g., Kickoff, TB freeze, First ETR, Draft memo, Auditor review, Final sign-off, File).
- No extra commentary, no citations.

Scope and section list (adapt as needed; keep to 12–16 rows max)
- Cover these core areas in logical workflow order:
  1) Purpose & Scope
  2) Materiality & Key Judgments
  3) Data Sources & Close Dependencies
  4) Current Tax Provision
  5) Deferred Taxes (DTAs/DTLs)
  6) Valuation Allowance Assessment
  7) Uncertain Tax Positions (ASC 740-10)
  8) Interim Reporting & ETR Computation (ASC 740-270)
  9) Rate Reconciliation
  10) Equity Compensation Tax Effects (windfalls/shortfalls)
  11) International & U.S. International (e.g., GILTI/FDII/BEAT) — if applicable
  12) State & Local Income Taxes — if applicable
  13) Intraperiod Allocation & Discrete Items
  14) Tax Attributes & Carryforwards
  15) Disclosures (financial statement & footnotes)
  16) Controls, Reviews, and Sign-offs

Owners
- Assign realistic role owners (not “TBD”), e.g., Tax Manager, Tax Senior, Accounting Manager, FP&A Lead, Payroll/Stock Admin, Legal (for restructurings), Controller, External Auditor (review), Director of Tax (final).

Due dates
- Anchor all tasks to T and sequence so that: data readiness and TB freeze occur by T+3 to T+5; first-pass ETR by T+10; key judgments (VA/UTP) by T+15–T+20; draft memo by T+20–T+25; updates after audit inquiries by T+30–T+34; internal sign-off by T+35; auditor review by T+37; filing by T+40. If annual, scale to 10-K timing (e.g., T+60) and adjust intermediate milestones proportionally.

Constraints
- One page only.
- Use concise phrasing (max 15–18 words per “What it covers” cell).
- Avoid acronyms without a first use expansion if not standard to ASC 740.

Acceptance criteria
- A single compact table plus a one-line milestone timeline.
- Every section has a clear owner and a due date.
- Dates are all relative to T+X; if a period-end date is provided, include calendar dates in parentheses.
- No narrative beyond the table and the one-line timeline; no placeholders like “TBD”.

Deliverable
- Return only the outline (table + one-line milestone timeline), ready to paste into a memo or project tracker.
```

## E003 – Draft interview guide for 6 stakeholder roles. Return a Markdown table: Role | 5 Questions.

- **Domain:** Advisory
- **Expected template:** Standard-Lite
- **Best candidate ID:** E003_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Draft interview guide for 6 stakeholder roles. Return a Markdown table: Role | 5 Questions.

### Optimized prompt

```markdown
# Title
Draft a 6‑Role Stakeholder Interview Guide as a Markdown Table

# Objective
Generate a compact interview guide with six stakeholder roles, each paired with five tailored, open‑ended questions. Output must be a single Markdown table with the columns: Role | 5 Questions.

# Inputs
- Domain or initiative: [optional; if not provided, assume general product/discovery context]
- Audience or industry specifics: [optional]
- Provided roles: [optional; if omitted, use defaults below]
- Constraints or focus areas (e.g., compliance, technical feasibility, GTM, support load): [optional]
- Attached docs: [optional; if given, incorporate salient facts to tailor roles and questions]

# Defaults
- If no roles are provided, use these six:
  1. Executive Sponsor
  2. Product Manager
  3. Engineering Lead
  4. Sales/Marketing Lead
  5. Customer Support Lead
  6. End User/Customer

# Requirements
- Produce exactly six distinct roles and exactly five questions per role.
- Questions must be:
  - Open‑ended, specific, and non‑leading (favor “How/What/Which/Walk me through…”).
  - Focused on goals, constraints, success criteria, risks, dependencies, decision flows, metrics, and pain points.
  - Domain‑aware if inputs/docs are provided; otherwise, keep them generally applicable and jargon‑light.
  - Unique per role (no duplicates across roles).
  - Concise: ≤ 18 words per question.
- Prohibited:
  - Yes/no and double‑barreled questions.
  - Vague prompts (“Tell me about…”) without a clear intent.
  - Explanations, commentary, or extra text outside the table.

# Process
1. Identify or select six roles (use provided list or apply Defaults).
2. For each role, infer their perspectives, responsibilities, and decision scope from inputs/docs (if any).
3. Draft five tailored, open‑ended questions that surface objectives, constraints, risks, metrics, and cross‑team dependencies for that role.
4. Deduplicate and tighten wording to meet the ≤ 18‑word limit and avoid leading phrasing.
5. Validate against the checklist, then render the single Markdown table.

# Output Format
- Output only the table; no headings, intros, or notes.
- Table schema:
  - Columns: Role | 5 Questions
  - For the “5 Questions” cell, list items as a numbered list on separate lines using HTML line breaks.
- Formatting example (for structure only—do not copy content):
  | Role | 5 Questions |
  |---|---|
  | Example Role | 1. Question one<br>2. Question two<br>3. Question three<br>4. Question four<br>5. Question five |

# Tone
- Professional, neutral, and user‑centric.

# Checklist (must pass before output)
- Six roles total; five questions per role.
- No duplicates; each question ≤ 18 words.
- Open‑ended, non‑leading, single‑focus questions.
- Aligned to inputs/docs if provided; otherwise, general product/discovery context.
- Output is a single Markdown table with the exact two columns.
```

## E004 – Design test steps to validate revenue cutoff for a retail client. Keep to ≤120 words.

- **Domain:** Assurance
- **Expected template:** Essential
- **Best candidate ID:** E004_prompt_3 (prompt_3)
- **Scores:** overall 5 / 5; role 5, template/length 5, clarity/brevity 5, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance. Template matches expected structure with reasonable length. Concise and readable guidance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Design test steps to validate revenue cutoff for a retail client. Keep to ≤120 words.

### Optimized prompt

```markdown
Route: Essential

# Needs Input
What is the client’s fiscal period-end date?

Task
- Produce a concise, numbered list of audit test steps to validate revenue cutoff for a retail client (POS + e‑commerce).
- Strict limit: ≤120 words. No intro/outro—steps only.

Assumptions (if not provided)
- Period-end: December 31.
- Cutoff window: −5 to +5 days around period-end.

Requirements
- Include: data to obtain (sales ledger, shipment/despatch logs, POS Z‑reports, e‑comm orders, RMAs/credit memos), sampling approach, source docs to vouch (BOL/delivery proof, timestamps), criteria for recognition (ship/date delivered vs invoice/posting), testing of returns/allowances, unfulfilled/BOPIS/backorders not recognized, gift cards/layaway/consignment handling, simple analytics vs prior period, and exception documentation/quantification.

Output
- 8–10 numbered steps, ≤120 words, direct and action-oriented.
```

## E005 – List top 7 SOX risks for user access management and suggest a one-line test for each.

- **Domain:** Risk
- **Expected template:** Standard-Lite
- **Best candidate ID:** E005_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

List top 7 SOX risks for user access management and suggest a one-line test for each.

### Optimized prompt

```
# Title
Top 7 SOX User Access Management (UAM) Risks with One-Line Tests

# Goal
Generate a concise, audit-ready list of the top seven SOX-relevant UAM risks and provide exactly one one-line test procedure for each risk.

# Context
- Scope: SOX ICFR for in-scope financial systems and supporting components (apps, databases, directories, data warehouses, key spreadsheets).
- Emphasis: Access provisioning, modification, deprovisioning, privileged access, segregation of duties (SoD), access reviews, and logging/monitoring as they impact financial reporting.
- If provided, incorporate organization-specific documents (e.g., UAM policy/standards, SoD matrix, system inventory, terminations process, access review cadence) to tailor risk language.

# Deliverable
- A single table with exactly 7 rows and 2 columns:
  1) Risk (concise, SOX-relevant UAM risk)
  2) One-line Test (an imperative, standalone audit step that validates a key control addressing the risk)
- Do not include narrative beyond the table.

# Requirements
- Keep each risk line ≤16 words; keep each one-line test ≤25 words.
- Use precise, actionable language suitable for audit workpapers.
- Ensure comprehensive lifecycle coverage across:
  - Provisioning/approval and least privilege
  - Timely deprovisioning for terminations and role changes
  - SoD conflicts and mitigating controls
  - Privileged access governance
  - Periodic access recertifications
  - Orphan/stale/shared accounts
  - Logging/monitoring of critical access activities
- Avoid duplicates; each risk must be distinct and map to a different facet of UAM.
- Phrase tests with clear sampling or inspection verbs (e.g., Select, Inspect, Reconcile, Verify, Review, Compare).
- No vendor-specific tooling or org-specific jargon unless supplied in Context.

# Constraints
- No external citations, legal disclaimers, or background exposition.
- No more than 2 commas per test line; keep syntax crisp.
- US English, plain language.

# Style
- Tone: professional, concise, audit-focused.
- Format: a clean Markdown table only, no bullets or extra text.

# Process
1) Identify seven distinct, high-salience SOX UAM risks spanning the end-to-end access lifecycle.
2) For each risk, write a specific, minimally sufficient one-line test that an auditor could execute.
3) Validate least privilege, timeliness, authorization, completeness, and monitoring themes are all represented.
4) Eliminate redundancy; sharpen wording for brevity and clarity.

# Quality Bar
- Each one-line test stands alone and is immediately testable.
- Exactly 7 risks; exactly 7 tests; nothing else in the output.
- Readable by a senior auditor without further editing.

# Output Format
| Risk | One-line Test |

# Example (style only; do not reuse verbatim)
- Risk: Excessive privileged access in financial apps
- One-line Test: Review current privileged groups, select 25 users, verify management approval and documented business need for each.

# Inputs (optional)
- In-scope systems list, UAM/IA policy, SoD matrix, access review cadence, HR termination feed design, evidence samples.

# Final Instruction
Produce the table now, adhering strictly to the Requirements and Output Format.
```

## E006 – Create a 90-day integration plan with phases, owners, and KPIs.

- **Domain:** Deals
- **Expected template:** Standard-Full
- **Best candidate ID:** E006_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Create a 90-day integration plan with phases, owners, and KPIs.

### Optimized prompt

```markdown
# Title
90-Day Integration Plan with Phases, Owners, and KPIs

# Role
You are an experienced Integration Program Manager (PMO) who designs clear, outcome-driven 90-day integration plans. You translate high-level objectives into phased execution across workstreams with explicit owners, measurable KPIs, and a pragmatic cadence.

# Objectives
- Generate a complete 90-day integration plan tailored to the provided context.
- Structure the plan into three phases (0–30, 31–60, 61–90 days) with crisp goals, deliverables, and exit criteria per phase.
- Assign role-based owners and RACI across all workstreams.
- Define SMART KPIs with targets, measurement methods, data sources, and review cadence.
- Surface key risks, dependencies, and a change-management and communications cadence.

# Inputs
- User-supplied context (paste or summarize any details provided).
- Any attached documents that define strategy, org charts, systems, contracts, compliance, or prior plans.

# Assumptions
If critical details are missing after asking your clarifying questions, proceed using reasonable defaults and explicitly list all assumptions. Favor industry-agnostic language unless the context specifies industry, scale, or regulatory constraints.

# Clarifying Questions (ask first, then proceed)
Ask up to 8 concise questions to calibrate the plan. If no response, proceed with assumptions.
- What type of integration is this? (e.g., post-merger, system/platform, vendor/partner onboarding, product integration)
- What are the top 3 business outcomes for day 90?
- Company size and scale? (employees, locations, customers) Any regulated environments?
- Which workstreams are in scope? (Product/Tech, GTM/Revenue, Operations, People, Finance/Legal, Security/Compliance, Data/Analytics)
- Known constraints? (budget, headcount, change freeze windows, tooling)
- Key systems to integrate or deprecate?
- Stakeholders and decision-makers per workstream?
- Any hard deadlines, contracts, or customer commitments within 90 days?

# Workstreams (default set; tailor to context)
- Product and Technology (architecture, data, integrations, QA)
- Go-To-Market and Customer (brand, pricing, packaging, CRM, CS motions)
- Operations and Supply/Delivery (processes, SLAs, vendor mgmt)
- People and Culture (org design, talent, comms, change mgmt, enablement)
- Finance and Legal (close process, billing, controls, contracts, compliance)
- Security, Risk, and Compliance (access, policies, audits, privacy)
- Data and Analytics (definitions, pipelines, reporting, KPI sources)

# Output Structure
Provide the final plan in the following sections. Keep the overall length to 1,200–1,600 words, using crisp bullets, action verbs, and measurable targets.

## 1) Executive Summary
- Purpose and scope of the integration
- Day-90 outcomes and success criteria
- Key assumptions and constraints (bulleted)
- High-level timeline overview (0–30, 31–60, 61–90)

## 2) Phased Plan (0–30, 31–60, 61–90 Days)
For each phase:
- Phase Goal: succinct objective and “definition of done”
- Milestones and Deliverables: 4–8 items with due dates
- Exit Criteria: objective checks to advance to next phase
- Risks/Mitigations: top 3–5 relevant to the phase
- Dependencies: upstream/downstream items and owners

## 3) Workstream Plans
For each in-scope workstream:
- Objectives (90-day): 3–5 outcome statements
- Activities by Phase: bullets grouped under 0–30, 31–60, 61–90
- Owners: named roles (e.g., Integration Lead, Eng Lead, RevOps Director)
- RACI: concise matrix for 5–10 critical tasks in the workstream
  - Responsible, Accountable, Consulted, Informed
- Artifacts: required docs (e.g., cutover runbook, data mapping, comms templates)

## 4) Owners and Governance
- Org Map: core roles, decision rights, escalation paths
- Cadence: weekly standup, biweekly steering, monthly exec review
- Change Control: intake process, prioritization rubric, approval thresholds

## 5) KPIs and Targets
Define SMART KPIs with targets and measurement details. Provide both cross-program and workstream-level KPIs.
- For each KPI, include:
  - Metric name and definition
  - Target (numeric/percent), phase-by-phase if needed
  - Data source and calculation owner
  - Review cadence and threshold for escalation
- Examples to consider (tailor to context):
  - Product/Tech: % critical integrations delivered; defect escape rate; deployment frequency
  - GTM/Customer: churn/retention, pipeline coverage, NPS/CSAT, time-to-first-value
  - Operations: on-time process cutovers, SLA adherence, ticket backlog trend
  - People: role mapping completion, enablement completion %, adoption of new tools
  - Finance/Legal: billing accuracy, DSO, contract novation %, close timeliness
  - Security/Compliance: access remediation %, audit findings resolved, policy adoption

## 6) Timeline and Gantt-Style View
- 13-week view with major milestones and owners
- Clearly mark cutover windows, blackout periods, and decision gates
- Identify critical path tasks and slack

## 7) Risks, Dependencies, and Mitigations
- Top 10 risks with probability, impact, and mitigation owners
- Cross-team dependencies with dates and service-level expectations
- Contingency plans for high-impact scenarios

## 8) Communications and Change Management
- Stakeholder map and messaging by audience
- Communications plan: channels, frequency, owners
- Enablement plan: training topics, target roles, success measures
- Feedback loops: VOC/VOE methods and actioning

## 9) Budget and Resource Plan (if applicable)
- Resource allocation by workstream and phase
- Non-labor spend (tools, vendors, training)
- Variance tracking and guardrails

## 10) Appendices
- RACI matrices (consolidated)
- KPI dictionary with data lineage
- Cutover and rollback runbook references

# Constraints and Style
- Be specific, measurable, and time-bound; avoid vague verbs.
- Use role-based owners (titles) instead of names unless provided.
- Default to no external sourcing; rely on user-provided materials.
- Keep writing tight and actionable; bullets over paragraphs; no fluff.
- Use consistent terminology across workstreams and phases.

# Procedure
1) Review Inputs and ask Clarifying Questions (max 8). Wait if the user is present; otherwise proceed with documented assumptions.
2) Draft the Executive Summary with explicit day-90 outcomes and success criteria.
3) Build the three-phase plan with milestones, exit criteria, and dependencies.
4) For each workstream, define objectives, phased activities, owners, RACI, and artifacts.
5) Define cross-program and workstream KPIs with targets, data sources, and review cadence.
6) Lay out the 13-week timeline, critical path, and governance cadence.
7) List top risks and mitigations; finalize change management and comms plan.
8) Quality Check against the Acceptance Criteria, then present the final plan.

# Acceptance Criteria
- Includes three phases with goals, milestones, and exit criteria.
- Every major task has a role-based owner; RACI provided for critical items.
- KPIs are SMART with targets, data sources, and review cadence.
- Timeline is week-by-week with clearly identified critical path items.
- Risks/dependencies are explicit with mitigation owners.
- Document length and structure conform to Output Structure and Style.

# Deliverable
A single, polished plan document following the Output Structure above, ready for stakeholder review and execution.
```

## E007 – Provide a JSON schema for email header fields we must extract.

- **Domain:** Tech
- **Expected template:** Standard-Lite
- **Best candidate ID:** E007_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Provide a JSON schema for email header fields we must extract.

### Optimized prompt

```
# Role and Objective
You are a senior data architect. Generate a production-grade JSON Schema (JSON Schema Draft 2020-12) that specifies the email header fields we must extract, with clear typing, reusability via $defs, and strong validation to prevent malformed data while remaining backward-compatible with emerging headers.

# Plan
- Identify the canonical header set to model and declare any assumptions.
- Normalize property names and model multi-valued headers and structured sub-objects.
- Define $defs for reusable structures (e.g., address, addressList, receivedHop, authResult).
- Constrain with formats, enums, and patterns; fence unknowns via controlled extension points.
- Emit a single self-contained JSON Schema and perform a validation self-check.

# Instructions
- Use $schema: "https://json-schema.org/draft/2020-12/schema" and include $id, title, and description.
- Normalize top-level property names in lowerCamelCase that map to canonical header semantics; do not mirror raw case-variant header keys.
- Model headers as follows:
  - Singular headers (e.g., date, subject, messageId, mimeVersion, contentType, contentTransferEncoding, contentLanguage, contentDisposition, returnPath, deliveredTo, listId, listUnsubscribe, precedence, priority, xPriority, userAgent, organization).
  - Address-bearing headers as structured arrays: from, sender (single or array), replyTo, to, cc, bcc, resentFrom, resentTo, resentCc, resentBcc (use $defs.address and $defs.addressList).
  - Threading headers: inReplyTo (array of message IDs), references (array of message IDs).
  - Transport trace: received (array of $defs.receivedHop), resentDate, resentMessageId.
  - Auth/anti-abuse: authenticationResults (array of $defs.authResult), receivedSpf (string or structured), dkimSignature (array of $defs.dkimSignature), arcSeal, arcMessageSignature, arcAuthenticationResults (array/objects as appropriate).
- Types and formats:
  - Dates use string with format: "date-time" (RFC 3339).
  - Email addresses are objects with email (string, format: "email") and optional displayName (string); allow arrays for list-type headers.
  - Message IDs are strings matching a conservative pattern (e.g., "<...>") and collected into arrays where multi-valued.
  - For enumerables (e.g., priority), include common enums and allow an open string fallback when unknown.
- Extension strategy:
  - Include xHeaders: object whose additionalProperties accept string or array of strings, capturing any headers beginning with "X-".
  - Include otherHeaders: object to capture unexpected non-X- headers as string or array of strings, to ensure forward compatibility.
- Validation stance:
  - Set additionalProperties: false at the top level; allow growth only via xHeaders and otherHeaders.
  - For each property, include descriptions, examples, and minimal patterns to avoid overfitting.
- Output only the JSON Schema as a single JSON code block with no extra prose or comments (use description fields for explanatory text).
- If a field can appear multiple times in RFC practice, model it as an array.
- Document assumptions in a top-level "description" and within property descriptions.

# Context
- If no Custom Header List is provided, use the Default Header Set below. Treat the list as the authoritative scope for top-level properties.
- Custom Header List: (none provided)
- Default Header Set:
  - date, from, sender, replyTo, to, cc, bcc, subject, messageId, inReplyTo, references
  - mimeVersion, contentType, contentTransferEncoding, contentLanguage, contentDisposition
  - returnPath, deliveredTo, received (array), resentDate, resentFrom, resentTo, resentCc, resentBcc, resentMessageId
  - authenticationResults, receivedSpf, dkimSignature, arcSeal, arcMessageSignature, arcAuthenticationResults
  - listId, listUnsubscribe, precedence, priority, xPriority, userAgent, organization
  - xHeaders (object map for headers starting with "X-"), otherHeaders (object map for non-modeled headers)
- Naming: use lowerCamelCase for property names; reflect original header casing only in descriptions.
- Multi-value: use arrays for list-type headers and for repeated occurrences.

# Output Format
- Deliverable: One JSON code block containing the full JSON Schema (Draft 2020-12), self-contained, ready to validate documents.
- Structure:
  - $schema, $id, title, description
  - type: object
  - properties: all headers from the chosen set
  - required: only those truly mandatory for your assumed use case; otherwise keep minimal
  - additionalProperties: false
  - $defs: address, addressList, receivedHop, authResult, dkimSignature (and any small helpers like token or messageId)
- Do not include markdown or narrative outside the single JSON code block.

# Validation
- Confirm the schema parses as valid Draft 2020-12.
- Check representative examples (at least 1) would validate, including cases with:
  - multiple recipients, multiple Received hops, and multiple message IDs in references
  - presence of xHeaders and otherHeaders
- List any assumptions inside the schema’s top-level description. If a critical input (e.g., a mandated header set) is missing, proceed with the Default Header Set and note that assumption in the description.
```

## E008 – Write a single PostgreSQL function that normalizes phone numbers. Output only a code block.

- **Domain:** Tech
- **Expected template:** Standard-Lite
- **Best candidate ID:** E008_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Write a single PostgreSQL function that normalizes phone numbers. Output only a code block.

### Optimized prompt

```markdown
# Role
You are a senior PostgreSQL engineer. Generate a single, production-ready PostgreSQL function to normalize phone numbers.

# Task
Implement one CREATE OR REPLACE FUNCTION that takes a free-form phone number string and returns a normalized E.164 phone number string, or NULL when the input cannot be normalized confidently.

# Target
- PostgreSQL 12+.
- No extensions or external libraries; only core SQL/PL/pgSQL features.

# Function Signature
- Name: normalize_phone
- Schema: public
- Language: plpgsql
- Volatility/Attributes: IMMUTABLE, STRICT (NULL-in, NULL-out)
- Parameters:
  - p_input TEXT
  - p_default_cc TEXT DEFAULT '+1'  // Default country calling code to use when none is present (must include leading '+')
  - p_min_digits INT DEFAULT 8      // Minimum allowed digits per E.164 (exclusive of '+')
  - p_max_digits INT DEFAULT 15     // Maximum allowed digits per E.164 (exclusive of '+')
- Returns: TEXT (E.164 string like +15551234567) or NULL if invalid/ambiguous.

# Normalization Rules
- Trim whitespace; if empty after trimming, return NULL.
- Interpret international prefixes:
  - If input begins with '+', preserve it.
  - Else if input begins with '00', treat as '+' (replace leading 00 with +).
- Remove extensions entirely (do not include them in the normalized result). Detect common extension markers at the end of the string and strip from the first occurrence of:
  - "ext", "ext.", "extension", "x", "x.", "#", "poste", "доб" (case-insensitive), optionally followed by separators, then digits.
- Remove all characters except digits, preserving the presence of a leading '+' only if it was explicitly present or implied by '00'.
- Construction logic to E.164:
  - If original had a '+': result = '+' || digits_only.
  - Else if original had leading '00': result = '+' || digits_only (after removing the '00').
  - Else:
    - If digits_only has length = 10: assume national format; prefix p_default_cc (e.g., '+1') -> result = p_default_cc || digits_only.
    - If p_default_cc = '+1' and digits_only has length = 11 and starts with '1': result = '+' || digits_only (already includes country code).
    - If digits_only length is between p_min_digits and p_max_digits and does not equal 10: assume it is an international number missing the '+'; prefix '+' -> result = '+' || digits_only.
- Validation:
  - Final result must match E.164 shape: starts with '+', followed by 8–15 digits total (regex: '^\+[1-9][0-9]{7,14}$').
  - If it fails validation, return NULL.

# Behavior Requirements
- Deterministic: same input always yields the same output.
- No DML or side effects.
- Robust to punctuation and common formatting (spaces, dashes, dots, parentheses).
- Robust to mixed-case and localized words for extension listed above.
- Avoid false positives: ambiguous or too-short/too-long numbers should return NULL.
- Include a concise SQL block comment atop the function explaining behavior, parameters, and examples.

# Examples (for your own validation; do not output these selects)
- "+1 (555) 123-4567" -> "+15551234567"
- "0044 20 7946 0958" -> "+442079460958"
- "(415) 555-2671 x89" with p_default_cc '+1' -> "+14155552671"
- "020 7946 0958" with p_default_cc '+44' -> "+442079460958"
- "15551234567" with p_default_cc '+1' -> "+15551234567"
- "555-0123" -> NULL (too short)
- "+012345678" -> NULL (leading digit after '+' cannot be 0)

# Output Format
- Output only a single fenced SQL code block containing exactly one CREATE OR REPLACE FUNCTION statement as specified.
- Do not include any text outside the code block.
- Do not include test queries or additional commentary outside the function’s internal SQL comments.

# Implementation Notes
- Use regular expressions (regexp_replace, substring, ~ operators) for parsing.
- Treat input as ASCII digits; ignore non-ASCII numeral systems.
- Carefully order regex operations: strip extension first, then handle '+'/'00', then strip non-digits (preserving knowledge of whether '+' was present or implied).
- Ensure STRICT behavior covers NULL; explicitly handle empty-string cases.
- Add minimal but clear inline comments for maintainability.
```

## E009 – Turn these 8 CSV rows into a pivot summary (do not browse).

- **Domain:** Finance
- **Expected template:** Standard-Lite
- **Best candidate ID:** E009_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Turn these 8 CSV rows into a pivot summary (do not browse).

### Optimized prompt

```
# Role and Objective

Act as a data analyst. Your objective is to generate a clear pivot summary from the attached CSV containing 8 rows. Produce compact, accurate tables and a brief narrative that highlight distributions and key takeaways. Do not use external sources.

# Plan

- Ingest the CSV and profile columns.
- Identify categorical vs numeric fields and select sensible pivot dimensions.
- Build primary and secondary pivot tables with totals and clear labels.
- Summarize patterns, outliers, and any data quality caveats.
- Validate completeness and stop if critical input is missing.

# Instructions

- Ingest:
  - Load the attached CSV (8 rows). If the file cannot be accessed or parsed, stop and output a single bullet under “Needs Input” describing what’s required.
- Profile:
  - List all columns with inferred types: categorical (strings/booleans) vs numeric.
  - Count unique values per categorical field; compute min, max, mean, and null counts per numeric field.
- Select Dimensions:
  - Choose Row Dimension = the leftmost categorical column with ≤ 20 unique values; if none fit, choose the categorical column with the fewest unique values.
  - Choose Column Dimension = the next categorical column meeting the same uniqueness rule; if none, omit column dimension.
- Measures and Aggregations:
  - Always include Count of records.
  - For each numeric column, compute Sum and Average.
  - Treat blanks/NaN as “(missing)” for categorical pivots; exclude them from numeric averages (but include in counts).
- Build Pivots:
  - Pivot A: Count of records by [Row Dimension] × [Column Dimension] (or by [Row Dimension] only if no column dimension).
    - Include row totals and column totals; sort rows by descending total count, then by label ascending.
  - Pivot B: For each numeric column, a table of Sum and Average by [Row Dimension], with a grand total row for Sum.
- Insights:
  - Provide 3–5 concise bullets noting the largest categories, notable skews across the column dimension, and any outliers or zeros in numeric measures.
- Formatting:
  - Use Markdown tables with clear headers.
  - Keep numbers right-aligned where possible; show two decimal places for averages.
  - Keep the entire output compact; this dataset has only 8 rows, so display all categories (no truncation).
- Assumptions and Edge Cases:
  - If there are more than two suitable categorical columns, prefer the two with the lowest cardinality.
  - If no numeric columns exist, omit Pivot B and say so under Insights.
  - If every categorical field exceeds 20 unique values (unlikely for 8 rows), fall back to a single-table summary of all rows and a 1–2 bullet narrative.

# Context

- Input: One CSV file with 8 rows (attached by the user).
- Goal: Produce an at-a-glance pivot summary with totals and a short narrative, without external browsing.

# Output Format

- Schema Profile: a small table listing Column, Type, Unique Values (if categorical), and Basic Stats (if numeric).
- Pivot A: Count of records by [Row Dimension] × [Column Dimension] with totals.
- Pivot B: For each numeric column, Sum and Average by [Row Dimension] with a grand total row for Sum.
- Insights: 3–5 bullets.
- Assumptions: 1–3 bullets capturing any material assumptions you made.

# Validation

- Confirm that the CSV was read and all 8 rows were included.
- Verify that totals and averages reconcile with the raw counts.
- If a critical input is missing (e.g., file not readable), output a single “Needs Input” bullet and stop.
```

## E010 – Create a 2‑section cease-and-desist letter outline (Facts, Demand).

- **Domain:** Legal
- **Expected template:** Standard-Lite
- **Best candidate ID:** E010_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Create a 2‑section cease-and-desist letter outline (Facts, Demand).

### Optimized prompt

```markdown
# Objective
Generate a two-section cease-and-desist letter outline with only the sections "Facts" and "Demand."

# Inputs
Provide any known details (use bracketed placeholders if unknown):
- Parties: [Your Name/Company], [Recipient Name/Company]
- Roles/Capacity: [Complainant/Owner/Employer/etc.], [Recipient role]
- Conduct at issue: [e.g., trademark infringement/defamation/harassment/breach of contract/etc.]
- Timeline: [Key dates and sequence of events]
- Relationship/Agreements: [Contract/Terms/Policies/NDA/etc.]
- Evidence: [Documents/URLs/Screenshots/Witnesses/Invoices/etc.]
- Harm/Impact: [Financial loss/Reputational harm/Operational disruption/etc.]
- Jurisdiction/Venue: [City/State/Country]
- Desired remedy: [Stop conduct/Take-down/Payment/Correction/Return of materials/etc.]
- Deadline and contact: [Date], [Contact method]

# Instructions
- Produce exactly two sections: "Facts" and "Demand." Do not add any other sections, headers, salutations, or closings.
- Use concise one-line bullets (6–10 bullets per section). Each bullet ≤ 18 words.
- Maintain a firm, professional tone; use plain-English legal phrasing; avoid admissions or speculation.
- Where specific details are not provided, insert clear bracketed placeholders (e.g., [Date], [Alleged conduct], [Jurisdiction]).
- Focus on specificity, chronology, and actionable items. Avoid narrative paragraphs.
- Do not offer legal advice or citations.

# Output Format
- Section 1: Facts
  - Parties and roles: [Your Name/Company] vs. [Recipient Name/Company]
  - Relationship/context: [Nature of relationship], [Relevant agreements/policies]
  - Conduct overview: [Alleged conduct], occurring on/around [Dates], at/in [Locations]
  - Chronology of key events: [Event 1], [Event 2], [Event 3]
  - Evidence supporting the claim: [Type of evidence], [Links/Attachments], [Witnesses]
  - Scope and persistence: [Frequency/Duration], [Current status], [Ongoing risk]
  - Harm suffered: [Type of harm], [Estimated loss/impact], [Reputational/operational effects]
  - Prior notices or attempts to resolve: [Dates], [Channels], [Recipient responses]
  - Legal/contractual basis implicated: [Agreement clauses], [Statutes/policies], [Ownership rights]
  - Jurisdiction and venue context: [Jurisdiction], [Applicable law], [Choice-of-law/venue clause]

- Section 2: Demand
  - Immediate cessation of: [Specific conduct], including [Platforms/Locations], effective [Deadline/date]
  - Remedial actions: [Take-down/removal], [Retraction/correction], [Return/destruction of materials]
  - Written confirmation by: [Date], including [Scope of compliance], [Responsible contact]
  - Preservation of evidence: [Identify materials], [Retention instructions], [No spoliation warning]
  - Accounting/compensation: [Amounts], [Basis of calculation], [Payment method/timeline]
  - Assurances against recurrence: [Policies/training], [Monitoring], [Contractual undertakings]
  - Third-party notification/coordination: [Hosts/Platforms/Distributors], [Notice requirements]
  - Consequences of noncompliance: [Injunctive relief], [Damages], [Fees], [Without further notice]
  - Reservation of rights: [No waiver], [All rights and remedies preserved]
  - Contact for response: [Name/Title], [Email/Phone], [Preferred response method] 
```

## E011 – As of today, compare current EU AI Act compliance dates vs. NIST AI RMF milestones. Cite sources.

- **Domain:** Research
- **Expected template:** Research
- **Best candidate ID:** E011_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

As of today, compare current EU AI Act compliance dates vs. NIST AI RMF milestones. Cite sources.

### Optimized prompt

```markdown
# Role
You are a policy and standards analyst. You will produce a current, source-cited comparison of EU AI Act compliance dates and NIST AI Risk Management Framework (RMF) milestones.

# Objective
Compare “as of today” the EU AI Act’s binding compliance timeline against the NIST AI RMF’s nonbinding milestones and updates. Clearly distinguish legal obligations and dates (EU) from voluntary framework milestones (NIST). Cite authoritative sources.

# Constraints
- Date sensitivity: Set “As of date” to today’s date in ISO format (YYYY-MM-DD) at the top of the output.
- Sources: Use only authoritative/primary sources where possible (EUR-Lex, European Commission/Parliament/Council, EU AI Office; NIST.gov, NIST AI Safety Institute). Supplement with reputable secondary sources only when they clarify official texts; always prefer primary.
- Citations: Inline bracketed citations after the relevant sentence or bullet. Provide full citation list at the end with titles and URLs. Include access date for each URL.
- Format: No tables. Use concise sectioned headings and bullet lists for timelines. Keep the main analysis to 500–800 words plus bullets and citations.
- Scope: Focus on current compliance/application dates, staged obligations, and transitional arrangements for the EU AI Act; and version releases, official guidance, playbook/profile releases, and AISI milestones for NIST AI RMF.
- Do not speculate. If a date is unclear or pending, say so and cite.

# Definitions
- EU AI Act compliance dates: Official entry-into-force date, staged application/implementation dates (e.g., prohibitions, general-purpose AI obligations, high-risk system obligations), transitional provisions, deadlines for codes of practice/standards, and enforcement start dates.
- NIST AI RMF milestones: RMF v1.0 release and subsequent official updates; Playbook iterations; official Profiles (e.g., generative AI); NIST AI Safety Institute (AISI) publications, testbeds, or guidance; other formal NIST-issued artifacts tied to the RMF.

# Research Steps
1. Establish “As of date” (today, ISO format) and place it at the top of the output.
2. EU AI Act:
   - Locate the Official Journal publication and entry-into-force date on EUR-Lex.
   - Identify each staged applicability/compliance date (e.g., prohibited practices, GPAI/provider obligations, high-risk obligations), transitional periods, codes of practice timelines, and any official Commission/AI Office guidance on timing.
   - Capture enforcement, supervisory readiness, and any dates for harmonized standards or conformity assessment becoming applicable.
   - Cross-check at least two primary sources for each key date; note any discrepancies.
3. NIST AI RMF:
   - Confirm RMF v1.0 release information on NIST.gov.
   - Identify subsequent milestones: Playbook updates, official Profiles (including generative AI), companion guidance, AISI formation and key deliverables tied to RMF implementation.
   - Include dates and the nature of each milestone (release, draft, final, update).
4. Synthesize:
   - Present EU dates and obligations, then NIST milestones, each as bullet timelines.
   - Provide a comparison section that highlights: legal force vs. voluntary; mandatory deadlines vs. guidance cadence; overlap areas (e.g., risk controls, governance); gaps; practical implications for organizations operating in both EU and US contexts.
5. Verify:
   - Re-validate every date against the cited primary source. Remove any items lacking a reliable citation.

# Output Structure
- As of: YYYY-MM-DD
- Summary (3–5 bullets)
- EU AI Act — Current Compliance Timeline
  - Bulleted list of dated events with one-line obligation/impact per bullet and inline citation.
- NIST AI RMF — Key Milestones
  - Bulleted list of dated milestones with a short description and inline citation.
- Comparison and Implications
  - Bullets contrasting enforceability, scope, timing, and what organizations should prioritize now; call out any dependencies (e.g., codes of practice, standards) and how RMF can operationalize EU obligations.
- Open Questions / Pending Items (if any)
- Sources
  - Full references with titles, publisher, URL, and access date.

# Style
- Precise, neutral, and directive. Use clear, plain language.
- Use bullet points generously. No tables or heavy formatting.
- Avoid jargon unless defined.

# Quality Checks
- Every date has at least one primary source citation; critical dates have two where possible.
- No contradictions between EU dates and cited sources.
- NIST items are limited to official NIST (or AISI) publications unless noting reputable secondary clarification.
- The comparison explicitly distinguishes binding law (EU) vs. voluntary framework (NIST).

# Deliverable
Produce the analysis exactly once, following the Output Structure and Constraints.
```

## E012 – Return only Y or N: Is there enough info to plan inventory test counts?

- **Domain:** Audit
- **Expected template:** Essential
- **Best candidate ID:** E012_prompt_4 (prompt_4)
- **Scores:** overall 5 / 5; role 5, template/length 5, clarity/brevity 5, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance. Template matches expected structure with reasonable length. Concise and readable guidance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Return only Y or N: Is there enough info to plan inventory test counts?

### Optimized prompt

```
Determine whether the user’s provided materials contain sufficient information to plan inventory test counts.

Review only the user’s uploaded files and prior messages; do not browse externally or infer missing data.

Sufficiency criteria (all must be clearly present):
1) Scope and locations of the test.
2) Items to be counted or explicit selection criteria.
3) Schedule/time window and assigned staffing/resources.
4) Counting and reconciliation method (how counts will be recorded and variances resolved).

Decision rule:
- If all four criteria are clearly provided, answer Y.
- If any are missing, ambiguous, or conflicting, answer N.
- If uncertain, answer N.

Output: Y or N only (single uppercase letter). No other text, symbols, or whitespace.
```

## E013 – Draft a risk/control matrix template. Include fields and an example row.

- **Domain:** Risk
- **Expected template:** Standard-Lite
- **Best candidate ID:** E013_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Draft a risk/control matrix template. Include fields and an example row.

### Optimized prompt

```markdown
# Role
You are an internal controls and risk management specialist. Produce a clean, reusable Risk and Control Matrix (RCM) template that teams can copy into documentation. Include the full list of fields and one realistic example row.

# Objective
Create an industry-agnostic RCM template that:
- Enumerates standard fields (with concise definitions and allowed values).
- Provides a blank, ready-to-fill matrix header.
- Includes exactly one fully populated example row to demonstrate usage.

# Audience
Risk, audit, compliance, and process owners.

# Tone and Style
- Professional, concise, and unambiguous.
- Use consistent terminology and casing for fields and values.

# Deliverables
1) Field Catalog: Bullet list of all columns with:
   - Field name
   - One-line definition
   - Data type
   - Allowed values or examples (when applicable)

2) Blank Matrix: One pipe-delimited Markdown table with only the header row.

3) Example Row: Exactly one populated row under the table to illustrate usage.

4) CSV Fallback: The same header and example row in CSV for easy import.

# Required Fields
Provide the field catalog and use this exact field order in the table:
1. Process/Area
2. Subprocess
3. Risk ID
4. Risk Statement
5. Risk Category
6. Inherent Likelihood
7. Inherent Impact
8. Inherent Risk Rating
9. Control ID
10. Control Objective
11. Control Description
12. Control Owner
13. Control Type
14. Control Nature
15. Control Frequency
16. Key Control (Y/N)
17. Evidence/Artifacts
18. Testing Procedures (High-Level)
19. Test Frequency
20. Design Effectiveness
21. Operating Effectiveness
22. Residual Likelihood
23. Residual Impact
24. Residual Risk Rating
25. Issues/Deficiencies
26. Remediation Action
27. Remediation Owner
28. Target Remediation Date
29. Status
30. Last Updated
31. Notes

# Field Catalog Requirements
For each field above, provide:
- Definition: 1 short sentence.
- Data Type: one of [Text, Enum, Date, Boolean, Integer, Decimal].
- Allowed Values: if Enum/Boolean, list permitted values; otherwise give 1–2 examples.

Use these standard enumerations (apply consistently):
- Risk Category: [Financial Reporting, Operations, Compliance, IT, Strategic]
- Likelihood/Impact levels: [Low, Medium, High]
- Risk Rating: [Low, Medium, High] (note: typical mapping uses a 3x3 matrix)
- Control Type: [Preventive, Detective, Corrective]
- Control Nature: [Manual, Automated, IT-Dependent]
- Control Frequency: [Continuous, Daily, Weekly, Monthly, Quarterly, Annually, Ad hoc, Per transaction]
- Key Control: [Y, N]
- Design/Operating Effectiveness: [Effective, Needs Improvement, Ineffective, Not Tested]
- Status: [Open, In Progress, Monitoring, Closed, Deferred]

# Example Row Scenario
For the single example row:
- Process/Area: Procure-to-Pay
- Subprocess: Vendor Master Data
- Risk Statement: Risk of unauthorized or fictitious vendor creation leading to improper or fraudulent disbursements.
- Control Concept: New vendor setup requires approved request, independent review, and periodic change log review.

Populate all fields with realistic, internally consistent values that conform to the enumerations and illustrate:
- Higher inherent risk reduced by a strong preventive control plus a detective review.
- Residual risk clearly lower than inherent risk.
- Clear, actionable testing procedures and evidence.
- If including an issue, keep it minor (e.g., documentation gap) with a concrete remediation plan and date.

# Output Format
1) Field Catalog
   - Present as a bullet list. For each field: "Field Name — Definition (Type: X; Allowed: Y)".
2) Blank Matrix
   - Provide a pipe-delimited Markdown table with only the header row (the 31 fields, in order).
3) Example Row
   - Add exactly one data row immediately beneath the header to illustrate.
4) CSV Fallback
   - Provide the same header and the same single example row as a two-line CSV block.

# Constraints
- Be concise: one line per field definition.
- Do not include more than one example row.
- Do not add fields beyond the required list or change their names/order.
- Ensure enumerations and values are consistent across all sections.
- Use ISO 8601 date format (YYYY-MM-DD).

# Quality Checks
- Validate that all required fields appear in the header (31 total).
- Verify the example row values align with allowed values and are internally consistent (e.g., residual rating < inherent rating if controls are effective).
- Confirm both the Markdown table and CSV have identical headers and content for the example row.
```

## E014 – Summarize OECD Pillar Two safe harbor updates (last 12 months). 6 bullets. Include dated citations.

- **Domain:** Tax
- **Expected template:** Research
- **Best candidate ID:** E014_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Summarize OECD Pillar Two safe harbor updates (last 12 months). 6 bullets. Include dated citations.

### Optimized prompt

```
# Objective
Summarize OECD Pillar Two safe harbor updates from the last 12 months into exactly six bullets with dated citations for a tax-professional audience.

# Audience
Tax directors, international tax managers, and policy analysts familiar with GloBE (Pillar Two) concepts.

# Scope
- Focus only on OECD/Inclusive Framework materials related to Pillar Two safe harbors (e.g., Transitional CbCR Safe Harbour, QDMTT/UTPR safe harbours, simplified calculations, penalty relief where characterized as “safe harbour”).
- Time window: last 12 months relative to today's date at runtime.
- Include updates/clarifications, new or revised administrative guidance, FAQs, and implementation package items that explicitly pertain to safe harbours.

# Deliverable
- Output exactly six bullets, reverse-chronological (newest first).
- Each bullet (≤30 words) contains:
  - Update title or concise descriptor.
  - One-sentence “what changed/why it matters.”
  - One or more dated citations with source name and URL.
- No preface, no conclusion—just the six bullets.

# Requirements
- Prioritize OECD/Inclusive Framework primary sources (official pages, Administrative Guidance, press releases, FAQs). Use reputable secondary sources (e.g., Big Four alerts, law firm memos) only if they clarify or date-stamp OECD updates; prefer primary when available.
- Each bullet must include at least one citation with a clearly stated publication date within the last 12 months. Use ISO format YYYY-MM-DD.
- If an item lacks a clear publication date, identify the most authoritative page that states a date (document date, update date, or release announcement). If none exists, exclude the item.
- Avoid duplication: consolidate overlapping announcements and later clarifications into a single bullet if within the window, prioritizing the most recent authoritative source.
- Do not include jurisdiction-specific domestic safe harbours unless explicitly endorsed or framed by OECD as part of Pillar Two safe harbour guidance.
- Keep language precise and neutral; no marketing or speculation.

# Sources and Citations
- Preferred primary sources:
  - OECD Pillar Two hub pages
  - “Agreed Administrative Guidance” on GloBE rules
  - Safe harbours and penalty relief documentation and FAQs
  - OECD/IF press releases or news items announcing updates
- Secondary (only if needed for clarity/date):
  - Big Four (Deloitte, EY, KPMG, PwC) global tax alerts
  - Reputable law firm or professional services analyses with explicit dating
- Citation format inside each bullet:
  - [OECD — Document/News Title — YYYY-MM-DD — URL]
  - If multiple sources are used, separate with “; ”.

# Research Plan
1. Determine today’s date; set the rolling 12-month window.
2. Search OECD official sites for “Pillar Two safe harbour,” “Transitional CbCR Safe Harbour,” “UTPR safe harbour,” “QDMTT safe harbour,” “administrative guidance,” “FAQs,” “penalty relief.”
3. Collect candidate updates within the window; record titles, dates, and URLs. Prefer “Administrative Guidance” and OECD news/press pages with explicit dates.
4. De-duplicate and select the six most consequential updates by policy impact, global applicability, and novelty.
5. Draft six concise bullets, verify each date is within the window, and attach dated citations.

# Output Format
- Provide only six bullets, one per line, no numbering.
- Example pattern (do not reuse text):
  - Update title — 1-sentence impact. [OECD — Title — 2025-03-15 — https://...]
- Ensure each bullet ≤30 words.

# Style and Tone
- Professional, precise, and compact.
- Avoid jargon beyond standard Pillar Two terminology.

# Quality Checks
- Confirm exactly six bullets are present.
- Validate each citation includes: source name (OECD preferred), document/news title, ISO date within 12 months, and working URL.
- Ensure reverse-chronological order and no duplicated coverage.
```

## E015 – Create an incident response checklist (high-level). 10 steps.

- **Domain:** Security
- **Expected template:** Standard-Lite
- **Best candidate ID:** E015_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Create an incident response checklist (high-level). 10 steps.

### Optimized prompt

```
# Task
Generate a high-level incident response checklist suitable for cybersecurity/IT incidents in a typical organization.

# Audience
Incident response leads, security operations teams, IT managers.

# Deliverable
A concise, actionable checklist of exactly 10 steps that covers the end-to-end incident response lifecycle.

# Requirements
- Exactly 10 numbered steps.
- One short sentence per step (maximum 18 words).
- Each step begins with a strong imperative verb (e.g., Prepare, Detect, Triage, Contain, Eradicate, Recover).
- Vendor- and tool-agnostic; applicable to organizations of varying sizes and maturities.
- Lifecycle coverage includes: Preparation; Detection and reporting; Triage and scoping; Investigation and analysis; Short-term containment; Long-term containment; Eradication; Recovery and validation; Communication and documentation; Post-incident review and improvements.
- High-level only; avoid deep technical specifics.

# Output Format
- Title line: “Incident Response Checklist (High-Level)”
- Followed by a single numbered list from 1 to 10.
- No sub-bullets, no paragraphs, no examples, no explanations.

# Style and Tone
- Concise, directive, plain language.
- Avoid jargon and acronyms unless widely understood (e.g., IOC, SLA).

# Do Not
- Do not include organization-specific policies, legal advice, or vendor/product names.
- Do not add extra context beyond the 10 steps.

# Acceptance Criteria
- Exactly 10 distinct steps, each one sentence, starting with an imperative verb.
- Steps collectively span the full lifecycle listed above without redundancy.
```

## E016 – Write a Python script to diff two folders. Output a single fenced code block in python.

- **Domain:** Tech
- **Expected template:** Standard-Lite
- **Best candidate ID:** E016_prompt_2 (prompt_2)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Write a Python script to diff two folders. Output a single fenced code block in python.

### Optimized prompt

```markdown
You are to write a robust, production-quality Python script that diffs two folders.

Output format:
- Return only one fenced code block in python.
- Do not include any text before or after the single code block.
- The code must be self-contained and runnable as a script with no external dependencies beyond the Python standard library.

# Needs Input
Which content comparison mode should be the default: cryptographic hash or size+mtime? If not specified, assume SHA-256 hashing as the default.

Task requirements:
- Python version: 3.8+; use only the standard library (e.g., argparse, pathlib, hashlib, concurrent.futures, fnmatch, difflib, json, os, sys).
- Implement a CLI: folder_diff.py LEFT_DIR RIGHT_DIR [options]
  - Options:
    - --compare {hash,size-mtime} (default: hash unless overridden by user input)
    - --follow-symlinks (default: do not follow symlinks)
    - --ignore PATTERN (may be provided multiple times; glob-style matching)
    - --include PATTERN (optional; apply after ignore; if provided, only matched files/dirs are considered)
    - --text-diff [LINES] (optional; if set, emit a unified diff for text files that differ; default LINES=3)
    - --max-diff-bytes N (skip text diff for files larger than N bytes; default 1_000_000)
    - --workers N (parallelize content checks; default to min(32, os.cpu_count()+4))
    - --json (emit machine-readable JSON instead of human-readable text)
    - --quiet (suppress progress/info; show only results)
    - --verbose (emit progress and diagnostics to stderr)
- Behavior:
  - Recursively compare directory trees.
  - Normalize and sort paths for stable, deterministic output.
  - Classify results into:
    - only_in_left
    - only_in_right
    - type_changed (file vs directory vs symlink differences)
    - changed (present in both but content differs)
    - metadata_changed (optional: include if --compare=size-mtime and size or mtime differs)
  - Content comparison:
    - hash mode: compute SHA-256 in streaming fashion with a reasonable chunk size; use concurrency for files larger than a threshold.
    - size-mtime mode: use file size and modification time as heuristics; treat mismatches as changed.
  - Text vs binary:
    - For --text-diff: detect text by attempting UTF-8 decode with 'replace' or by a simple binary heuristic; if text and size <= --max-diff-bytes, generate a unified diff via difflib.unified_diff with configurable context lines.
    - If not text or too large, report as changed without inline diff.
  - Symlinks:
    - By default, do not follow; compare link targets as link metadata (path string). If --follow-symlinks, compare the resolved targets’ contents/types.
  - Ignore/include:
    - Apply ignore patterns first (fnmatch on path relative to the roots), then include patterns to re-include.
  - Error handling:
    - Collect and report unreadable paths, permission errors, and broken symlinks under an errors section.
    - Continue comparing other files even if some errors occur.
  - Performance:
    - Use a thread pool for hashing/IO; avoid loading entire files into memory; stream in chunks.
  - Output:
    - Plain text (default): print clearly labeled sections for only_in_left, only_in_right, type_changed, changed (with optional inline diffs), and errors. Omit empty sections.
    - JSON (--json): emit a single JSON object with keys:
      - only_in_left: [relative paths...]
      - only_in_right: [relative paths...]
      - type_changed: [{path, left_type, right_type}]
      - changed: [{path, reason: "content"|"metadata", diff?: string}]
      - errors: [{path, error}]
    - Ensure stable ordering (sorted by relative path).
  - Exit codes:
    - 0: directories are equivalent under the chosen comparison mode (no differences)
    - 1: differences found
    - 2: one or more errors occurred (I/O, permission, invalid args)
- Code quality:
  - Provide a top-level docstring explaining usage and options.
  - Organize code into small, testable functions (e.g., walk_tree, apply_filters, file_hash, compare_entries, render_plain, render_json).
  - Use pathlib for path manipulations and robust os.walk handling.
  - Print human-readable output to stdout; send progress/verbose logs and warnings to stderr.
  - Validate input directories and handle non-existent paths gracefully with exit code 2.
  - Ensure deterministic output across runs with the same inputs.
- Do not print any examples or explanations; only emit the script code inside a single fenced python code block.
```

## E017 – Make a stakeholder map with RACI for 5 roles.

- **Domain:** Advisory
- **Expected template:** Standard-Full
- **Best candidate ID:** E017_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Research.

### User prompt

Make a stakeholder map with RACI for 5 roles.

### Optimized prompt

```markdown
# Task
Generate a concise stakeholder map and RACI matrix for exactly five roles for a single project/initiative.

# Inputs
Provide what you can; if any item is missing, make reasonable assumptions and proceed.
- Project name and one-sentence goal.
- Five roles (titles or groups) to include in RACI (exactly five). If not provided, default to:
  1) Executive Sponsor, 2) Product Manager, 3) Project Manager, 4) Engineering Lead, 5) QA Lead.
- Any known stakeholders, constraints, or documents to honor.

# Constraints
- Scope: One project/initiative; avoid organization-wide sprawl.
- Activities: 8–12 key activities spanning Initiation, Planning, Execution, and Release/Closeout.
- RACI rules per activity:
  - Exactly one A (Accountable).
  - At least one R (Responsible).
  - C (Consulted): 0–3 max.
  - I (Informed): 0–many.
- Balance: Distribute A and R across roles to avoid concentration on a single role.
- Clarity: Define each stakeholder succinctly (<= 20 words) and avoid overlapping labels.
- Brevity: Keep narrative text minimal; favor tables and bullets.

# Output Format
Produce the following sections in order.

## 1) Assumptions
- List any assumptions made (project context, role interpretations, missing info filled).

## 2) Stakeholder Map
- Provide a table with columns:
  - Stakeholder Group/Name
  - Type (Internal/External)
  - Interest (Low/Med/High)
  - Influence/Power (Low/Med/High)
  - Current Stance (Supportive/Neutral/Resistant/Unknown)
  - Key Needs/Concerns
  - Engagement Strategy (how to manage)
  - Cadence & Channel (e.g., weekly email, biweekly sync)
- Include 8–12 stakeholders total. Ensure at least one external stakeholder if applicable.
- Add a 1–2 line summary of the overall engagement posture (e.g., “Power–Interest highlights: …”).

## 3) RACI Matrix (Five Roles as Columns)
- Show a table:
  - Rows: 8–12 activities (grouped by phase; include 1–2 rows per phase minimum).
  - Columns: the five roles (use provided or defaults).
  - Cells: R, A, C, or I only.
- Include:
  - Legend for R/A/C/I.
  - Validation summary below the table:
    - Confirm exactly one A per activity and at least one R.
    - Count of A and R per role.
    - Flag any violations and fix them in the table.

## 4) Risks and Notes
- 3–5 short bullets on stakeholder alignment risks, RACI gaps, or dependency hotspots.
- Mitigations: 1 line each with an owner role.

# Approach
- Derive core activities from the project goal and typical SDLC/initiative phases.
- Identify stakeholders from roles, org context, and external partners/customers.
- Assign RACI by mapping decision rights (A) and execution ownership (R) logically to roles.
- Balance workload: rotate A across phases where reasonable; avoid single-point bottlenecks.

# Quality Bar
- Tables render cleanly and are scan-friendly.
- No role appears as A for all activities unless justified in Notes.
- Stakeholder strategies are specific (not generic platitudes).
- All assumptions are explicitly listed and consistent with outputs.

# Style and Tone
- Professional, concise, and action-oriented.
- Use bullets and short phrases; avoid long paragraphs.

# Insert Variables (fill or replace)
- Project: <project_name> — <one-sentence_goal>
- Roles (5): <role_1>, <role_2>, <role_3>, <role_4>, <role_5>
- Documents/constraints to honor: <links_or_brief_notes>
```

## E018 – Create a journal entry template for accruals with examples.

- **Domain:** Finance
- **Expected template:** Standard-Lite
- **Best candidate ID:** E018_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Create a journal entry template for accruals with examples.

### Optimized prompt

```
# Role
You are a senior GL accountant and documentation writer. Produce a clear, implementation-ready accrual journal entry template with worked examples that a staff accountant can copy into their month-end playbook.

# Objective
Create a reusable, fillable template for accrual journal entries and provide multiple fully worked examples (with calculations and reversing entries) demonstrating common accrual scenarios.

# Audience
- Primary: Staff and GL accountants performing monthly and year-end close.
- Secondary: Accounting managers reviewing entries.

# Constraints
- Accounting basis: Accrual, double-entry bookkeeping.
- Standards: Keep GAAP/IFRS-neutral; use common conventions.
- Currency: USD by default; do not include currency symbols in numeric columns.
- Chart of accounts: Provide generic example account numbers and names; keep easily replaceable.
- Reversals: Each example must include a dated reversing entry for the next open period.
- Data hygiene: Debits must equal credits; show cross-foot check.
- Tone and style: Professional, concise, instructional; no fluff.
- Length guardrails: Aim for 900–1,300 words total.

# Output Structure
Produce sections in the exact order below. Use clear Markdown headers and simple tables.

1) Overview
   - Briefly state what accruals are and when to use this template.
   - List typical accrual types covered in the examples.

2) Fillable Accrual JE Template (copy-ready)
   - Provide two formats:
     a) Form-style template with labeled fields and placeholders.
     b) Table-style template with columns suitable for spreadsheet/ERP paste.
   - Required fields:
     - JE ID
     - Entity/Business Unit
     - Accounting Period (YYYY-MM)
     - JE Date
     - Accrual Type (Expense, Revenue, Interest, Payroll, Other)
     - Description / Narrative (concise; start with verb, e.g., “Accrue…”)
     - Calculation Summary (inputs, formula, result)
     - Line Items Table with columns:
       - Line #
       - Account #
       - Account Name
       - Department/Cost Center (optional)
       - Project/Customer/Vendor (optional)
       - Debit
       - Credit
     - Total Debits
     - Total Credits
     - Cross-foot Check (Total Debits – Total Credits = 0)
     - Reversal Method (Auto/Manual/Partial)
     - Reversal Date (YYYY-MM-DD)
     - Prepared By / Date
     - Reviewed By / Date
     - Supporting Docs Link or Reference

3) Field Definitions and Guidance
   - One or two sentences per field clarifying purpose, examples of good entries, and common mistakes.
   - Specify debit/credit convention and typical accounts by accrual type (e.g., Expense accrual: Dr Expense, Cr Accrued Liabilities).

4) Worked Examples (5)
   - For each example, include:
     - Scenario name and one-sentence context.
     - Assumptions (dates, rates, quantities).
     - Calculation steps (brief, bullet form).
     - Journal entry lines (table with Account #, Account Name, Debit, Credit).
     - Cross-foot check result.
     - Reversing entry in next period (with date and lines).
     - Short reviewer checklist (what to verify).
   - Provide these five scenarios:
     1. Utilities expense accrual for month-end (invoice not yet received).
     2. Accrued revenue for services rendered but not yet billed (percentage or time-based).
     3. Payroll accrual for wages and employer taxes spanning month-end.
     4. Interest expense accrual on outstanding debt.
     5. Year-end bonus accrual with partial reversal when actual differs.

5) Import-Friendly CSV Snippet (optional)
   - Provide a miniature example of lines-only CSV (no headers) as commonly required by ERPs:
     - Columns (in order): JE ID, Date, Period, Account #, Account Name, Dept, Project, Description, Debit, Credit, Currency.
   - Include 3–4 lines tied to one of the worked examples.

6) Review Checklist and Controls
   - Pre-posting checklist (e.g., period open, documentation attached, materiality).
   - Post-reversal checklist (confirm reversal posted and nets correctly).
   - Common pitfalls (e.g., failing to reverse, double-accruing, using wrong period).

7) Customization Notes
   - Where to substitute company-specific COA, dimensions, and approval workflow.
   - How to adapt for multi-currency or statutory/local GAAP differences.

# Content Requirements

- Debit/Credit conventions:
  - Expenses and Assets: normal debit balance.
  - Liabilities, Equity, Revenue: normal credit balance.
- Example account numbers (replaceable):
  - 6100 Utilities Expense; 5000 Wages Expense; 2250 Accrued Liabilities; 2100 Wages Payable; 4100 Service Revenue; 1150 Accounts Receivable; 7200 Interest Expense; 2400 Interest Payable; 2280 Bonus Payable; 5120 Employer Taxes Expense.
- Dates:
  - Use realistic month-end dates (e.g., 2025-03-31) and reversal on first day of the next month (e.g., 2025-04-01), unless scenario dictates otherwise.
- Calculations:
  - Show simple math clearly (rate × base × time fraction as needed).
- Narratives:
  - Begin with “Accrue …,” include period covered, and reference support (e.g., “meter estimate,” “contract SOW,” “payroll register”).
- Cross-foot check:
  - Explicitly show Total Debits, Total Credits, and difference = 0.

# Quality Bar
- Accuracy: Double-check that each example’s debits equal credits and reversals fully offset the original accrual unless “partial reversal” is stated with a reason.
- Clarity: Use concise sentences and consistent formatting across all examples.
- Reusability: Templates must be directly copy-pastable into documentation and spreadsheets.
- Minimal jargon: Define any term that might be ambiguous (e.g., “partial reversal”).

# Deliverable Format
- Output as Markdown only, adhering to the section order above.
- Use simple tables for line items.
- Avoid images or complex formatting; ensure compatibility with basic Markdown renderers.

# Example Style Rules (apply consistently)
- Numbers: Use plain numbers (e.g., 1250.00). No currency symbols or thousand separators.
- Dates: ISO format YYYY-MM-DD.
- Accounts: “#### Name” format (e.g., “2250 Accrued Liabilities”).
- Narrative length: Max 150 characters per example.

# Completion Criteria
- All seven sections present and complete.
- Five worked scenarios each include assumptions, calculation, JE table, cross-foot, and reversing entry.
- Templates and CSV snippet are copy-ready without further editing.
```

## E019 – Provide a contract clause library outline (NDA).

- **Domain:** Legal
- **Expected template:** Standard-Full
- **Best candidate ID:** E019_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Provide a contract clause library outline (NDA).

### Optimized prompt

```markdown
# Role and Objective
You are a senior contracts counsel and knowledge manager. Create a comprehensive clause library outline for a Non-Disclosure Agreement (NDA) that contract managers and counsel can use to assemble, negotiate, and maintain NDA templates at scale. Optimize for clarity, modularity, and negotiation readiness. Include both unilateral and mutual NDA coverage, and support a default “balanced” risk posture with strict and flexible variants. Avoid jurisdiction-specific legal advice; instead, flag jurisdictional nuances at a high level.

# Plan
- Identify core NDA components and organize them into a logical taxonomy with required vs. optional modules.
- Define variants and toggles for common negotiation levers (e.g., mutual vs. unilateral, term, residuals, compelled disclosure).
- Specify metadata and cross-references to ensure consistency across clauses and defined terms.
- Calibrate risk and negotiation guidance (standard/strict/flexible) and provide fallback positions.
- Validate completeness, portability, and internal consistency of terms, dependencies, and drafting notes.

# Instructions
- Plan: Draft a high-level checklist of the core modules and the major toggles to confirm scope before outlining details.
- Structure: Organize the clause library by headings and subheadings, grouping related clauses; mark each as Required, Recommended, or Optional.
- Variants: For each clause, define three policy variants (Strict, Standard, Flexible) and identify key toggles and variables.
- Dependencies: Note cross-references and required defined terms; call out interactions among confidentiality scope, exclusions, use restrictions, residuals, and remedies.
- Risk & Negotiation: Provide negotiation cues, fallback language directions, and red flags for counterparty asks.
- Jurisdictions: Summarize jurisdictional nuances at a high level (e.g., US, UK, EU, APAC) without offering legal advice.
- Output: Follow the Output Format exactly and ensure consistency of terminology across the outline.
- Quality: Ensure the library is modular, maintainable, and ready for implementation in a contract playbook or CLM.

# Context
- Purpose: An internal clause library outline to standardize NDA drafting and negotiations across teams.
- Scope: General commercial NDAs; cover both unilateral and mutual forms; suitable for vendor, customer, partner, investor, and evaluation use cases.
- Assumptions: Balanced default risk posture; plain-English drafting style; applicability across common commercial contexts; no bespoke industry regulations unless flagged (e.g., healthcare, financial services).
- Out-of-scope: Jurisdiction-specific legal advice; final legal language; litigation strategy.

# Output Format
Provide the following sections in order. Use Markdown headings and bullets. For clause inventories, use tables with the specified columns.

## 1) Library Overview
- NDA Types: Unilateral, Mutual (with a brief note on when to use each)
- Risk Postures: Strict, Standard (default), Flexible
- Module Legend: Required, Recommended, Optional
- Major Toggles: Mutuality, Purpose scope, Definition of Confidential Information, Exclusions, Residuals, Compelled Disclosure process, Use restrictions, Term/survival, Return/Destruction, Representatives, IP/no-license, Remedies (injunctive relief), Liability allocation, Governing law/venue, Data/security, Export control, Anti-corruption, Non-solicit (optional), Assignment, Entire agreement, Counterparts/e-signatures

## 2) Defined Terms Inventory
List all defined terms with concise definitions and where they are used. Include: Agreement, Confidential Information, Discloser, Recipient, Affiliate, Representative, Purpose, Business Day, Effective Date, Term, Residuals, Compelled Disclosure.

## 3) Clause Taxonomy and Outline
For each section below, present a brief purpose statement and subclauses as bullets. Mark each subclause with Module status (R/Rec/O).

- Preamble and Parties
- Purpose of Disclosure
- Definitions
  - Confidential Information
  - Exclusions from Confidential Information
- Non-Use and Non-Disclosure Obligations
- Permitted Disclosures and Process
  - Representatives
  - Compelled Disclosure
- Safeguards and Security Measures
- Return/Destruction of Materials
- Residuals (Optional)
- Term and Survival
- Intellectual Property and No License
- No Warranties; As-Is
- Remedies
  - Injunctive Relief
  - Liability Cap/Exclusions (Optional)
- Non-Solicitation (Optional)
- Compliance Provisions (as applicable)
  - Export Controls
  - Anti-Corruption
  - Sanctions (Optional)
  - Data Protection and Privacy (Optional, high-level)
- Assignment; Successors and Assigns
- Governing Law and Venue
- Notices (Optional, brief)
- Entire Agreement; Amendments
- Counterparts; Electronic Signatures
- Miscellaneous (Severability, Waiver, Further Assurances where needed)

## 4) Clause Library Table (per Clause)
Create a table for each clause (one table per clause). Columns:
- Clause ID
- Clause Name
- Purpose (1–2 lines)
- Module (R/Rec/O)
- Variants (Strict | Standard | Flexible) — short descriptors of policy stance
- Key Toggles/Variables (e.g., mutuality, term length, definition breadth)
- Fallback Positions (negotiation fallback directions, not full text)
- Risk Notes (red flags, common counterparty asks)
- Dependencies/Cross-References (required defined terms and related clauses)
- Jurisdictional Nuances (US, UK, EU, APAC — brief notes)
- Implementation Notes (playbook/CLM tips, metadata, approvals)
- Metadata (Version, Owner, Last Review Date)

## 5) Negotiation Playbook Notes (Summary)
- Typical asks and recommended responses for major levers (scope, exclusions, residuals, compelled disclosure timing, term/survival, remedies).
- Escalation thresholds (when to seek legal approval).
- Redline conventions (consistent variant labels and comments).

## 6) Optional Modules by Use Case
For each use case, list any additional or modified clauses and toggles:
- Procurement/Vendor NDA
- Sales/Prospect NDA
- Investor/Financing NDA
- M&A/Transaction NDA
- Employment/Advisor NDA
- Technology Evaluation/POC NDA

## 7) Cross-Reference Map
- Map of clause-to-clause dependencies (e.g., Confidential Information → Exclusions → Residuals; Remedies ↔ Liability; Purpose ↔ Non-Use).

## 8) Maintenance & Governance
- Review cadence, versioning, owners, change log fields.
- Quality checks before release (consistency of defined terms, cross-refs, toggles).

# Agentic Calibration
- Reasoning effort: medium
- Verbosity: medium
- Bias toward structured bullets and tables; avoid prose where enumerations are required.

# Validation
- Confirm all required modules for both unilateral and mutual NDAs are included and marked.
- Verify every clause table includes Variants, Toggles, Fallbacks, Risk Notes, Dependencies, and Jurisdictional Nuances.
- Ensure Defined Terms align with clause dependencies and are used consistently.
- Check that Optional Modules and Negotiation Notes cover the most common scenarios.
- If a critical input is missing (e.g., target jurisdictions, company-specific risk posture), add one “Needs Input” bullet at the end and stop.
```

## E020 – Write test of details for AP existence. Keep to bullets only.

- **Domain:** Assurance
- **Expected template:** Essential
- **Best candidate ID:** E020_prompt_3 (prompt_3)
- **Scores:** overall 5 / 5; role 5, template/length 5, clarity/brevity 5, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance. Template matches expected structure with reasonable length. Concise and readable guidance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Write test of details for AP existence. Keep to bullets only.

### Optimized prompt

```markdown
Additional clarification needed: Which auditing framework should this align with (ISA or US GAAS)?

You are an audit assistant. Produce a concise list of audit tests of details for the existence assertion of Accounts Payable at year-end.

Requirements
- Output format: bullets only (no headings, no numbered lists, no paragraphs, no intro or outro text).
- Each bullet: begin with a concrete action verb; specify the primary evidence source in parentheses at the end.
- Keep strictly focused on existence (overstatement risk) for recorded AP balances; exclude procedures primarily aimed at completeness, analytics, or tests of controls.
- Audience: audit staff preparing workpapers for a financial statement audit.
- Assumption if unspecified: align with common practices acceptable under both ISA and US GAAS for a mid-sized entity; generic ERP (no industry-specific tailoring).
- Length: 12–18 bullets.

Deliverable
- A single bullet-only list of test-of-details procedures that validate the existence of recorded Accounts Payable at the reporting date.
```

## E021 – Generate a 4‑line haiku about autumn in JSON with keys: line1..line4.

- **Domain:** Casual
- **Expected template:** Standard-Lite
- **Best candidate ID:** E021_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Generate a 4‑line haiku about autumn in JSON with keys: line1..line4.

### Optimized prompt

```
# Role
You are a creative writing assistant that crafts concise, vivid poetry.

# Goal
Generate a four-line haiku about autumn.

# Constraints
- Language: English.
- Content: Use concrete autumn imagery (kigo), sensory details, and present-tense observation.
- Form: Exactly 4 lines; each line concise (ideally 3–7 words); avoid rhyme, cliché phrases, and overt sentimentality.
- Style: Evocative, natural, and imagery-driven; no emojis, hashtags, or quotation marks.
- Originality: Lines must be novel and not copied.

# Output Format
Return only a valid JSON object with exactly these keys and string values:
- line1
- line2
- line3
- line4

Formatting rules:
- Use standard JSON (double-quoted keys and values, no trailing commas).
- No additional keys, explanations, or surrounding text.
- Do not wrap the JSON in code fences.

# Example (structure only)
{
  "line1": "...",
  "line2": "...",
  "line3": "...",
  "line4": "..."
}
```

## E022 – Give me a restaurant list in SF with addresses (latest openings).

- **Domain:** Casual
- **Expected template:** Research
- **Best candidate ID:** E022_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Give me a restaurant list in SF with addresses (latest openings).

### Optimized prompt

```
# Title
Latest San Francisco restaurant openings with verified addresses

# Goal
Research and compile a concise, accurate list of the latest restaurant openings within San Francisco city limits, each with a verified street address.

# Parameters
- Location scope: San Francisco, California (city and county). Exclude the broader Bay Area (e.g., Oakland, Berkeley, Daly City, Peninsula, Marin) unless explicitly stated as within San Francisco.
- Time window: Last 3 months from today’s date. If fewer than 12 qualifying openings are found, expand to the last 6 months.
- Result count: Target 15–25 entries; minimum 12. If fewer exist, return all verified entries and state the shortfall.
- Establishment types to include: Restaurants, cafes, bakeries with permanent public service.
- Exclusions: Temporary pop-ups, short-term residencies, private clubs, ghost/virtual brands without a public storefront, pure reopenings of the same venue after a short closure (unless a relocation or genuinely new concept/location).

# Context
- Incorporate and cross-check any user-provided documents about SF restaurant openings, if present.
- Prioritize accuracy, recency, and clear consumer relevance (where to go now).

# Sources and Evidence
- Use multiple credible, up-to-date sources:
  - Local media: Eater SF, SF Chronicle/Datebook, SFGate, The Infatuation SF, Time Out SF, Hoodline, Secret SF.
  - Official channels: Restaurant websites, Google Business Profiles, Instagram/Facebook posts from the restaurant, opening announcements, press releases.
- Evidence requirements per entry:
  - At least one source confirming the opening and the address.
  - Prefer a source dated within the time window; if older, corroborate with an official channel confirming the recent opening date/status.
- Provide inline citations (live links) for each entry in the output.

# Instructions
- Search strategy:
  - Use targeted queries combining keywords like “opened,” “grand opening,” “soft opening,” “now open,” “debut,” with “San Francisco” and neighborhood names (e.g., “Mission,” “SoMa,” “North Beach,” “Inner Richmond”).
  - Query site-specific sources (e.g., site:eater.com/sf, site:sfchronicle.com, site:sfgate.com) and official restaurant channels.
- Verification:
  - Confirm street address from either the official website, Google Business Profile, or a reputable local publication. Include city, state, and ZIP if available.
  - Confirm the opening occurred within the specified time window. If only a “soft opening” is within window and “grand opening” is pending, include it and note “soft opening.”
  - Deduplicate across sources and brand locations. If a brand opened multiple SF locations in the window, include each as its own row with distinct neighborhoods.
- Inclusion rules:
  - New concept at the same address counts as “opening.”
  - Relocations count if a new SF address is involved; note “relocation” in the Notes column.
  - Exclude pure reopenings after temporary closures with no meaningful concept change.
- Data quality:
  - Use consistent neighborhood names commonly recognized in SF (e.g., Mission District, SoMa, Hayes Valley).
  - Keep notes factual and brief; avoid hype.
  - If any detail cannot be verified, either omit the venue or clearly mark the field as “unverified” and exclude from the final count.

# Output Format
- Deliver a single table followed by a brief summary.
- Table columns (in this exact order):
  1) Name
  2) Address (Street, San Francisco, CA ZIP)
  3) Neighborhood
  4) Opening Month (MMM YYYY)
  5) Cuisine/Tags (max 3 short tags)
  6) Source Links (1–2 credible URLs)
  7) Notes (≤12 words; e.g., “soft opening,” “relocation,” “bakery-cafe”)
- Sorting: Descending by Opening Month, then Name A–Z.
- After the table:
  - “Method and cutoff” line stating: “Researched and verified on {today’s date}. Time window: last {3 or 6} months. Scope: San Francisco city limits.”
  - Optional: 3–5 notable picks with one-line why (if time permits).

# Steps
1) Enumerate neighborhoods and construct targeted search queries across local outlets and official channels.
2) Collect candidate openings within the time window; extract names, addresses, neighborhoods, and opening dates.
3) Verify each address and opening timing via at least one reputable or official source; deduplicate and weed out exclusions.
4) Populate the table to spec; add concise notes and source links for each row.
5) Sort, quality-check for accuracy/completeness, and output the table and summary.

# Quality Bar
- Every entry has a verified address and at least one credible source link.
- No non-SF entries. No ghost kitchens without storefronts. No unverified rumors.
- Clear, compact notes; consistent formatting; live links.

# Failure Handling
- If fewer than 12 entries after 3 months, automatically expand to 6 months and state this in the summary.
- If still fewer than 12, provide all verified entries found and briefly note scarcity.

# Tools
- Use web browsing for real-time research and verification. Do not rely on memory alone.

# Deliverable
- A polished table and brief summary as specified above, suitable for quick decision-making by a diner looking for the newest places to try in San Francisco.
```

## E023 – Return only a valid OpenAPI 3.1 schema for a todo API.

- **Domain:** Tech
- **Expected template:** Standard-Lite
- **Best candidate ID:** E023_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Return only a valid OpenAPI 3.1 schema for a todo API.

### Optimized prompt

```
# Task
Generate a complete, valid OpenAPI 3.1 schema for a Todo REST API.

# Output Format
- Produce a single YAML document only.
- Do not include any commentary, explanations, or Markdown code fences in your output.
- The document must begin with: openapi: 3.1.0
- Use clear, human-readable summaries and descriptions.

# Requirements
- Info:
  - Provide title, version, summary, and contact (placeholder values acceptable).
- Servers:
  - Include a production and a local server URL as examples.
- Tags:
  - At least one tag named Todos with a concise description.
- Paths:
  - GET /todos
    - Returns a paginated list of todos.
    - Supports query parameters:
      - page (integer, minimum 1, default 1)
      - pageSize (integer, minimum 1, maximum 100, default 20)
      - q (string, free-text search)
      - completed (boolean)
      - priority (enum: low, medium, high)
      - tag (string, single tag filter)
      - dueBefore, dueAfter (string, date-time)
      - sort (string, enum including: createdAt, -createdAt, dueAt, -dueAt, priority, -priority)
    - 200 on success, with pagination metadata and an array of Todo items.
  - POST /todos
    - Creates a todo from a TodoCreate body.
    - 201 on success with created Todo in response.
  - GET /todos/{id}
    - Path param id (string, uuid).
    - 200 on success with a Todo.
  - PATCH /todos/{id}
    - Partial update from TodoUpdate body.
    - 200 on success with updated Todo.
  - DELETE /todos/{id}
    - 204 on success, no body.
- Common error responses for operations:
  - 400 (Bad Request validation error)
  - 401 (Unauthorized)
  - 403 (Forbidden)
  - 404 (Not Found)
  - 409 (Conflict when applicable)
  - 429 (Rate limited)
  - 500 (Server error)
- Media types:
  - Use application/json for request and response bodies.
- Security:
  - Define bearerAuth (HTTP bearer, JWT) in components.securitySchemes.
  - Apply global security requiring bearerAuth, but allow GET /todos to be accessed without auth via a per-operation override (security: []).
- Components:
  - Schemas:
    - Todo
      - id (string, format: uuid)
      - title (string, minLength: 1, maxLength: 200) [required]
      - description (string, maxLength: 2000)
      - completed (boolean, default: false)
      - priority (string, enum: low, medium, high, default: medium)
      - tags (array of unique strings, maxItems: 20, each maxLength: 30)
      - dueAt (string, format: date-time, nullable: true)
      - completedAt (string, format: date-time, nullable: true)
      - createdAt (string, format: date-time)
      - updatedAt (string, format: date-time)
    - TodoCreate
      - title [required], plus optional fields from Todo (except id, createdAt, updatedAt, completedAt)
    - TodoUpdate
      - Partial update (all fields optional) with at least one property required via minProperties: 1
    - TodoList
      - items (array of Todo)
      - page, pageSize, totalItems, totalPages (integers)
    - Error
      - type (string, uri-reference)
      - title (string)
      - status (integer)
      - code (string)
      - detail (string)
      - instance (string, uri-reference)
      - errors (array of objects with field and message) [optional]
    - ProblemDetails
      - Align with RFC 7807 fields (type, title, status, detail, instance), for use with application/problem+json when desired.
  - Parameters:
    - Common pagination and sorting parameters as reusable components.
  - Headers:
    - X-Request-Id (string)
    - X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset (integers)
  - SecuritySchemes:
    - bearerAuth as described above.
- Responses:
  - Define reusable 400, 401, 403, 404, 409, 429, 500 responses referencing the Error schema and problem+json variant.
- Examples:
  - Provide at least one example for Todo and TodoCreate.
- Consistency and Validation:
  - Ensure schemas use JSON Schema 2020-12 features valid under OpenAPI 3.1 (do not include $schema within component schemas).
  - Use $ref to avoid duplication (e.g., reference parameters, responses, and schemas).
  - Include operationId for each operation in lowerCamelCase.
  - Include clear summaries and descriptions for all operations, parameters, and schemas.
  - Ensure the document is syntactically valid YAML and passes OpenAPI 3.1 validation.

# Constraints
- Output strictly the OpenAPI YAML document with no surrounding prose or markdown fences.
- Names, enums, and property constraints must match those specified above.
- Provide reasonable placeholder values where necessary (e.g., server URLs, contact email).

# Acceptance Criteria
- The YAML begins with openapi: 3.1.0 and defines info, servers, paths, components, and security.
- All required paths and operations are present and correctly typed.
- All referenced components exist and resolve.
- The schema is self-contained, consistently described, and ready for use in tooling (e.g., code generators, validators).
```

## E024 – Draft an issue log format with severity definitions and SLA table.

- **Domain:** Risk
- **Expected template:** Standard-Full
- **Best candidate ID:** E024_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Draft an issue log format with severity definitions and SLA table.

### Optimized prompt

```markdown
# Title
Draft an Issue Log Format with Severity Definitions and SLA Table

# Role
You are an experienced ITSM/PMO process designer. Produce a concise, implementation-ready issue log template with clear severity definitions and an SLA policy table. Provide both human-readable documentation and machine-readable artifacts.

# Audience
- Project managers
- Support leads / service managers
- Engineering managers
- Operations/on-call teams
- Stakeholders and auditors

# Inputs
Populate or assume reasonable defaults when inputs are blank. List all assumptions explicitly.
- Organization name:
- Industry/domain:
- Ticketing/log tool (e.g., Jira, ServiceNow, Excel/Sheets):
- Support hours model: 24x7 or Business Hours (e.g., 9:00–17:00, Mon–Fri, local timezone)
- Timezone:
- Severity naming convention (e.g., Sev-1..Sev-4 or P1..P4):
- Update cadence expectations (if any):
- Regulatory/SOX requirements (if any):
- Data sensitivity notes (e.g., PII, PHI):
- Escalation contacts/tiers available (e.g., L1/L2/L3, Incident Commander):
- Change control required for SLA updates (yes/no):

# Goal
Deliver a clean, practical issue log format that teams can adopt immediately, including:
- A normalized schema (fields, data types, allowed values)
- Severity definitions with objective, testable criteria
- An SLA table covering first response, update cadence, workaround, and resolution
- Minimal governance (triage, escalation, breach handling)
- Machine-ready templates (CSV header, JSON schema) for quick adoption

# Deliverables
1) Issue Log Schema (table)
   - Columns: field name, description, data type, allowed values/example, required? (Y/N)
   - Include a “Core” set and an “Extended” set. Core should be ≤20 fields and sufficient for most teams.
   - Core fields must include:
     - Issue ID
     - Title
     - Description
     - Category/Service/Component
     - Environment (Prod/Non-Prod)
     - Date Reported
     - Reported By
     - Impact Summary (business/user impact)
     - Affected Scope (count or % users/services)
     - Severity
     - Priority (if used alongside severity)
     - Status and State (e.g., New, Triaged, In Progress, Mitigated, Resolved, Closed)
     - Owner/Assignee
     - Next Action / ETA
     - First Response At
     - SLA Targets (First Response, Update Cadence, Workaround, Resolution)
     - SLA Breach? (Y/N) and Breach Reason
     - Links/References (e.g., ticket URL, runbook, PRs, incident page)
   - Extended fields (optional but recommended):
     - Root Cause Category (People/Process/Tech/Third-Party)
     - Workaround Description
     - Customer Communications Link
     - Update Cadence Policy
     - Dependencies/Related Issues
     - Risk Rating (Low/Med/High)
     - Change Required? (Y/N), Change ID
     - Lessons Learned
     - Tags/Labels
   - Define each data type (text, enum, datetime with timezone, boolean, integer, percent).
   - Specify validation rules (e.g., Severity enum; dates ISO 8601; non-empty Title; Status flow constraints).

2) Severity Definitions (matrix)
   - Provide 4 levels (Sev-1 Critical, Sev-2 High, Sev-3 Medium, Sev-4 Low) unless user specified otherwise.
   - For each level, define objective criteria across:
     - Business impact (revenue/regulatory/safety)
     - User scope (% or count affected; single vs multi-customer; internal vs external)
     - Service impact (full outage vs degraded)
     - Data risk (loss/exposure/corruption)
     - Workaround availability and effectiveness
     - Time sensitivity/urgency
   - Include do/don’t examples to reduce ambiguity and a “borderline calls” note.

3) SLA Table
   - For each severity, provide:
     - First Response Target (e.g., Sev-1: 15m; Sev-2: 1h; Sev-3: 4h; Sev-4: 1 business day)
     - Update Cadence (e.g., Sev-1: every 30m; Sev-2: hourly; Sev-3: daily; Sev-4: every 2 business days)
     - Workaround Target (time to restore service to acceptable level)
     - Resolution Target (time to full fix or accepted mitigation)
   - Provide both Calendar and Business Hours variants, and define “Business Hours” explicitly per Inputs.
   - Define SLA pause conditions (e.g., waiting on customer, force majeure, planned freeze) and how to log pauses.
   - Define breach criteria, breach notifications, and auto-escalation thresholds.
   - Specify communications expectations (internal/external) per severity.

4) Governance & Workflow
   - Triage process: intake, validation, severity assignment, owner assignment.
   - Escalation matrix: roles (L1/L2/L3), Incident Commander, on-call, and when to page.
   - Status model: permitted transitions; closure requirements; verification of fix.
   - Reporting: daily/weekly summaries; SLA compliance metrics and definitions.
   - Change control for SLA or severity policy updates (versioning and approvals).

5) Implementation Artifacts
   - CSV: header line for Core fields, plus an example row.
   - JSON Schema: machine-validated schema for Core fields (types, enums, required).
   - Markdown/Confluence-ready tables for Schema, Severity Matrix, and SLA Table.
   - One compact, filled example (a realistic Sev-2) showing field usage and SLA tracking.

# Instructions
- Draft the human-readable document first: clear section headers, short sentences, and compact tables.
- Use neutral, non-jargon language; define all terms used in definitions and SLAs.
- Calibrate default SLA targets for a typical SaaS/product team with global users; highlight where to adjust for on-call coverage, criticality, or industry norms.
- Convert the human-readable schema into:
  - CSV header + one sample row
  - JSON Schema (Draft 07+), using:
    - type: string/number/integer/boolean
    - format for datetime (date-time, RFC 3339/ISO 8601)
    - enum for Severity, Status, Environment
    - required list matching Core fields
- Show both “Calendar” and “Business Hours” SLA tables side-by-side or consecutively with a clear note on which is active.
- Include an “Assumptions” section listing every default you chose due to missing inputs.
- Keep the document tightly scoped to issue tracking (not full incident postmortems), but include a “Postmortem link” field and closure criteria.

# Constraints
- Length: Aim for 1–2 pages of prose plus the tables and machine-readable artifacts.
- Consistency: Severity criteria must align with SLA targets; avoid contradictions.
- Measurability: Use objective, testable thresholds (e.g., “≥25% users impacted”, “revenue at risk > $X”).
- Clarity: No undefined acronyms; define “Response”, “Workaround”, and “Resolution”.
- Accessibility: Tables should be readable when pasted into common tools (Confluence, Google Docs).
- Privacy: Do not include real PII/PHI in examples; use dummy data.

# Style and Tone
- Professional, concise, and directive.
- Use bullet points and tables to minimize verbosity.
- Prefer active voice and plain language.

# Quality Checklist
- Severity definitions: non-overlapping and unambiguous.
- SLA tables: times present for all severities; update cadence included.
- Business Hours vs Calendar: clearly defined with timezone.
- Schema: each field has type, description, and required flag; enums listed.
- Machine artifacts validate against the described schema.
- Example entry aligns with severity and SLA logic.
- Assumptions section present and complete.

# Output Format
Produce the following sections in order:
1. Overview
2. Assumptions
3. Issue Log Schema (Core then Extended) — table
4. Severity Definitions — matrix/table + examples
5. SLA Policy — Calendar and Business Hours tables + pause/breach rules
6. Governance & Workflow — concise bullets
7. Implementation Artifacts
   - CSV header + 1 example row (in a fenced code block)
   - JSON Schema (in a fenced code block)
   - Markdown tables ready to paste
8. Versioning & Change Control (effective date, version, approval roles)

# Final Note
If any required input is missing, proceed with best-practice defaults and call them out in Assumptions, making it easy for a reader to change values post-publication.
```

## E025 – Provide sample audit PBC list (exactly 12 items).

- **Domain:** Audit
- **Expected template:** Standard-Lite
- **Best candidate ID:** E025_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Provide sample audit PBC list (exactly 12 items).

### Optimized prompt

```
# Task
Generate a sample audit Prepared By Client (PBC) list.

# Context
- Scenario: External year-end financial statement audit.
- Entity: Mid-sized, US-based private company reporting under US GAAP.
- Purpose: Provide a concise, representative PBC list suitable for initial auditor request.

# Instructions
- Produce exactly 12 items commonly requested by external auditors from the client.
- Each item should be a distinct document or schedule name that a client would provide.
- Keep items generic (industry-agnostic) and non-proprietary.
- Do not include explanations, sub-bullets, or examples.
- Do not add headers, introductions, conclusions, or any text outside the list.
- Avoid duplicate or overlapping items.
- Do not exceed or fall short of 12 items.

# Output Format
- Numbered list from 1 to 12.
- Each list item: a short document/schedule name only (no trailing punctuation).

# Style
- Concise, professional, and unambiguous.

# Quality Checks
- Count items to ensure there are exactly 12.
- Ensure items are client-preparable and typical for a year-end financial audit.
```

## E026 – Explain Section 174 amortization changes (current year). Cite sources.

- **Domain:** Tax
- **Expected template:** Research
- **Best candidate ID:** E026_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Explain Section 174 amortization changes (current year). Cite sources.

### Optimized prompt

```markdown
# Role and Objective
You are a senior tax research analyst. Explain the current-year changes to U.S. Internal Revenue Code Section 174 (research and experimental expenditures) amortization rules. Your objective is to produce a concise, practitioner-ready brief that clearly states what changed (or did not change), when changes took effect, who is affected, practical compliance implications, and near-term planning considerations, all with high-quality citations.

# Plan
- Define the precise scope: Section 174 capitalization/amortization requirements, including any enacted legislative or regulatory changes for the current tax year versus the prior year.
- Identify and prioritize primary sources (statute, IRS guidance, Treasury regulations) and authoritative secondary analyses; verify all claims against primary sources.
- Extract the specific rule changes, effective dates, transitional relief, method-change procedures, and interactions with related provisions (e.g., Section 41, Section 162, software development guidance).
- Synthesize findings into an executive-summary-first brief, followed by sections that map 1:1 to distinct themes (rules, timing/effective dates, compliance, planning/modeling).
- Validate completeness and consistency; address conflicting interpretations; include dated inline citations and a formatted references list.

# Context
- Research Target: Section 174 amortization changes for the current year relative to the prior year, including status of any legislation or IRS/Treasury guidance affecting capitalization, amortization periods, mid-year conventions, definitions (e.g., SRE), software development costs, and foreign vs. domestic treatment.
- Primary Goal: Provide a clear, actionable explanation for practitioners and decision-makers on what is currently required and what has changed.
- Target Audience: U.S. corporate tax managers, controllers, CFOs, and tax advisors.
- Geographic Scope: United States federal income tax.
- Time Window / “As of” Date: As of today’s date; rely on sources from the last 24 months and cite older primary law when foundational.
- Sector: Corporate income tax; R&E/SRE expenditures.
- Key Sources: Internal Revenue Code §174 and related sections; Treasury/IRS regulations, notices, revenue procedures; official Congressional/public law text for enacted changes; IRS FAQs; reputable law/accounting firm analyses only as secondary support.
- End Deliverable: A concise Markdown brief suitable for sharing internally with finance and tax stakeholders.

# Research Instructions
1. Define Standards
   - Prioritize primary sources (statute, Treasury regulations, IRS notices/revenue procedures/publications). Use secondary sources only to clarify or summarize; do not rely on them for core claims without primary corroboration.
   - Require explicit publication/effective dates; record an access date for web sources. Prefer sources published or updated within the last 24 months for recency-sensitive points.
2. Gather & Document
   - For each source, capture: URL, publisher, document title, publication date, access date, and a 1–2 line finding.
   - Track: effective dates, amortization periods, conventions (e.g., midpoint), definitions (SRE), domestic vs. foreign treatment, software development cost treatment, transition relief/method-change procedures (e.g., Form 3115), and any enacted legislative changes for the current year.
3. Synthesize & Cite
   - Group findings by theme. Use inline citations for every factual claim (dates, numbers, definitions, effective periods, eligibility, procedural requirements). Place citations at the end of the relevant paragraph or under tables.
   - Explicitly address conflicts across sources; explain which source controls and why (e.g., statute vs. non-binding guidance).
4. Validate
   - Confirm completeness against the Context items. Check that all key practitioner questions (what changed, when, who’s impacted, compliance steps, planning implications) are answered with dated citations.

# Output Format
## Report Structure
- Executive Summary
  - State clearly what changed (or did not change) for the current year, effective dates, and headline implications.
  - Provide 3–5 support bullets (rules/definitions, timing/effective dates, compliance/method changes, planning considerations).
- Findings by Theme
  - Current Statutory/Regulatory Rules (Section 174 fundamentals; domestic vs. foreign amortization; conventions; definitions including SRE/software).
  - Current-Year Changes vs. Prior Year (enacted legislation or final/temporary regulations/IRS guidance; effective dates; transition/retroactivity, if any).
  - Compliance and Procedural Items (forms, elections, method changes, accounting method change procedures, documentation).
  - Planning and Modeling Considerations (cash tax impact, R&D credit interplay with Section 41, financial statement considerations at a high level).
  - Worked Example (one brief numeric example applying the current rules you confirm from sources; show amortization timeline and cash tax effect).
- Limitations & Open Questions
  - Bullet any unsettled areas, pending legislation, or forthcoming guidance.
- References
  - Link list including publisher, document title, publication date, and access date.

## Output Requirements
- Format: Markdown
- Length: 800–1,200 words
- Citations: Inline, dated citations for all factual claims; references list with publisher, publication date, and access date.
- Tone: Objective, precise, and practitioner-friendly.

# Validation & Stop Conditions
- Success means the brief accurately reflects the law/guidance as of today, clearly delineates changes vs. prior year, and supports all claims with dated citations.
- If you cannot verify a claimed change with a primary source, flag it explicitly and downgrade it to “unconfirmed” with rationale.
- If a critical element is missing (e.g., contradictory primary sources, ambiguous effective date), add one “Needs Input” bullet at the end and stop.
```

## E027 – Give Terraform code to open port 443 in AWS SG (code only).

- **Domain:** Security
- **Expected template:** Standard-Lite
- **Best candidate ID:** E027_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Give Terraform code to open port 443 in AWS SG (code only).

### Optimized prompt

```markdown
# Task
Generate Terraform code that opens port 443 (HTTPS) in an AWS Security Group.

# Instructions
- Produce a single, minimal Terraform HCL snippet that creates a new aws_security_group resource which allows inbound TCP 443 from configurable IPv4 CIDRs.
- Include variable blocks for vpc_id, name, and allowed_cidrs with sensible defaults.
- Include an egress rule that allows all outbound traffic.
- Do not include any prose, comments, or explanations.
- Do not wrap the output in Markdown code fences; output only the Terraform code.

# Constraints
- Terraform syntax: HCL2
- AWS provider compatibility: v4+ (inline ingress/egress blocks on aws_security_group)
- Defaults:
  - name = "https-sg"
  - allowed_cidrs = ["0.0.0.0/0"]
- No IPv6 ingress by default.
- Keep the snippet self-contained in a single file (variables and resources together).

# Output Format
- Output only the Terraform code (no surrounding Markdown fences, no comments).
- Structure:
  - variable "vpc_id"
  - variable "name"
  - variable "allowed_cidrs"
  - resource "aws_security_group" "https_sg" with:
    - vpc_id, name, tags
    - ingress block opening TCP 443 from allowed_cidrs
    - egress block allowing all outbound
```

## E028 – Create a one‑page OKR template with examples for a PMO.

- **Domain:** Advisory
- **Expected template:** Standard-Full
- **Best candidate ID:** E028_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Create a one‑page OKR template with examples for a PMO.

### Optimized prompt

```markdown
# Role
You are an expert OKR designer for enterprise Project Management Offices (PMOs). Produce a crisp, printable, one-page OKR template and a compact set of PMO-specific example OKRs.

# Task
Create:
1) A one-page OKR template tailored for a PMO.
2) A concise set of PMO example OKRs that demonstrate strong, measurable Key Results.

# Audience
- Primary: PMO leaders, Portfolio Managers, Program/Project Managers.
- Secondary: Executive sponsors and functional leads who review OKRs.

# Deliverables
- Deliverable A — One-Page PMO OKR Template:
  - Format: Single compact table (ASCII/Markdown) that fits on one printed page (A4 or US Letter, ~1-inch margins).
  - Sections/Fields (rows or clearly labeled blocks):
    - Header: Organization / PMO Name, Period (e.g., Q2 YYYY), Owner, Last Updated.
    - Objective: 1–3 brief, outcome-focused statements.
    - Key Results (3–5 per objective): Quantified; include baseline → target; time-bound; unambiguous.
    - Initiatives: 2–4 high-impact actions mapped to KRs.
    - Health/Status: RAG or 0.0–1.0 progress scoring (include a brief scoring rubric).
    - Dependencies / Risks: Top 3 with owners and mitigation notes.
    - Notes / Decisions / Learnings: Short bullets.
  - Constraints: Max ~80 characters width; avoid dense prose; keep placeholders concise.

- Deliverable B — PMO Example OKRs (compact):
  - Provide 3 example Objectives relevant to a PMO, each with:
    - 3–4 measurable KRs using SMART phrasing and clear targets.
    - 2–3 Initiatives aligned to those KRs.
  - Span common PMO themes: delivery predictability, governance/compliance, portfolio value/throughput, resource utilization, stakeholder satisfaction.
  - Keep total example content ≤250 words while remaining clear and concrete.

# Constraints
- Tone: Professional, succinct, and implementation-ready.
- No external references or footnotes.
- Use plain Markdown only; no images.
- Ensure the template alone is printable on a single page and visually scannable.
- KRs must be numeric where possible (%, count, cycle time, SLA, cost, NPS/eNPS, variance).
- Include a minimal scoring rubric (0.0–1.0 or 0–100%) and a brief usage note.

# Style and Format
- Output order:
  1) "One-Page PMO OKR Template" (table)
  2) "Usage Notes" (≤3 bullets)
  3) "PMO Example OKRs" (Objective with KRs and Initiatives)
- Keep lines ≤80 characters for printability.
- Prefer verbs that indicate outcomes (reduce, increase, deliver, achieve).

# Process (think briefly before writing)
1) Select fields that PMO leaders routinely track and review.
2) Structure a single, compact table that is fillable and readable when printed.
3) Draft example Objectives covering portfolio delivery, governance, and value.
4) Write KRs with baselines and targets; ensure they are auditable.
5) Add a tiny scoring rubric and usage notes; keep within length constraints.

# Quality Checks
- Template fits in one page with ~1" margins and ≤80-char width.
- Examples use SMART KRs with clear targets and timeframes.
- No fluff; each line adds utility.
```

## E029 – Return CSV with header: account, debit, credit. Provide 3 example rows.

- **Domain:** Finance
- **Expected template:** Standard-Lite
- **Best candidate ID:** E029_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Return CSV with header: account, debit, credit. Provide 3 example rows.

### Optimized prompt

```
# Objective
Generate a CSV with a header and exactly three example data rows.

# Instructions
- Produce only raw CSV text as the final output (no code fences, no prose, no explanations).
- The header must be exactly: account,debit,credit
- Provide exactly 3 data rows after the header (total of 4 lines).
- Use comma as the delimiter; no trailing commas or extra spaces.
- Do not quote fields unless required (avoid commas inside fields).

# Content Constraints
- account: Use plausible, simple account names without commas (e.g., Cash, Accounts Receivable, Sales Revenue).
- debit and credit: Non-negative numeric values with exactly two decimal places.
- In each data row, only one of debit or credit should be greater than zero; the other should be 0.00.

# Output Format
- CSV schema:
  - Line 1 (header): account,debit,credit
  - Lines 2–4 (rows): <account>,<debit>,<credit>

# Deliverable
Return only the CSV text meeting the above requirements.
```

## E030 – Compare Delaware vs. California data retention requirements for HR files; cite dates.

- **Domain:** Legal
- **Expected template:** Research
- **Best candidate ID:** E030_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Compare Delaware vs. California data retention requirements for HR files; cite dates.

### Optimized prompt

```markdown
# Deep Research Prompt Template

# Role and Objective
You are a legal and compliance researcher specializing in U.S. employment and privacy law. Your objective is to compare Delaware and California data retention requirements for HR files and produce a practitioner-ready summary and retention matrix. Emphasize primary legal authorities, cite publication/effective/last-amended dates, and translate findings into actionable policy guidance.

# Plan
- Define scope: enumerate HR record categories commonly held by employers; identify federal overlays and state-specific requirements for Delaware and California.
- Search strategy: prioritize primary sources (statutes, regulations, agency guidance); then authoritative secondary sources for interpretation; validate against the primary text.
- Data capture: for each requirement, record the jurisdiction, record category, retention period, legal authority, URL, publisher, publication date, last-amended date, effective date, and access date.
- Synthesis: produce a side-by-side matrix; resolve conflicts by applying the stricter rule; explain differences and any ambiguity.
- Validation: confirm coverage, ensure every factual claim has dated citations, and highlight gaps/assumptions.

# Context
- Research Target: Data retention requirements for HR files, Delaware vs. California.
- Primary Goal: Deliver a clear comparative matrix and narrative summary with dated citations to primary sources; include practical retention recommendations.
- Target Audience: HR, Legal, and Compliance teams implementing records retention schedules for U.S. employees.
- Geographic Scope: United States (federal baseline) with specific focus on Delaware and California; note any relevant local ordinances if they impose stricter retention obligations.
- Time Window / “As of” Date: As of today’s date; prefer sources updated within the last 3 years unless the authoritative text is older but still current.
- Sector: Private-sector employers (note exceptions if public-sector rules differ).
- Key Sources: State statutes and regulations; state labor/AG/DoL websites; federal regulations (FLSA, EEOC, OSHA, USCIS I-9, ERISA, IRS); official agency guidance and FAQs; secondary summaries only for cross-checking.
- End Deliverable: A concise Markdown report containing an executive summary, a detailed retention matrix, and a references section with full dates.

# Research Instructions
1. Define Standards
   - Prioritize primary law: statutes, regulations, official agency guidance. Use reputable secondary sources only to triangulate, never as sole authority.
   - Require explicit dates: capture publication date, last-amended date, and effective date where available; always record an access date for each web source.
   - Note hierarchy: when federal and state rules differ, recommend the stricter (longer) retention period unless preempted.

2. Scope of “HR files”
   - At minimum, evaluate: personnel files (hiring, applications, interview notes, offers), payroll and timekeeping records, wage statements/pay stubs, leave (FMLA/CFRA and other state leaves), benefits/ERISA/COBRA, medical/ADA/GINA records, I-9s, safety/OSHA logs, workers’ compensation, discrimination/harassment complaints and investigations, training (e.g., harassment prevention), background checks (FCRA; CA ICRAA), drug testing, performance/discipline/termination, schedules/attendance, expense reimbursements, and minors’ records.
   - Include privacy/data protection overlays that impose retention principles (e.g., California CPRA; Delaware personal data privacy law) and explain how “no longer than necessary” standards affect HR retention.

3. Gather & Document
   - For each identified record category and jurisdiction (Federal baseline, California, Delaware), capture:
     - Retention period (in years/months; include “during employment + X years” formulations).
     - Legal authority: statute/regulation citation, section number, and a short quoted excerpt that establishes the requirement.
     - Publisher, URL, publication date, last-amended date, effective date, and access date.
     - Notes: penalties for non-compliance (if specified), exceptions (e.g., minors, public sector, union CBAs), litigation hold overrides, and relevant statutes of limitation influencing recommended retention.

4. Synthesize & Cite
   - Build a side-by-side retention matrix showing: Record Category | Federal Minimum (citation + dates) | California Requirement (citation + dates) | Delaware Requirement (citation + dates) | Effective/Last-Amended Dates | Notes | Recommended Policy (longest period + buffer).
   - Provide a narrative Executive Summary that highlights the most material differences, stricter jurisdictions by category, and key risk areas.
   - Cite all factual statements inline at the end of the relevant paragraph; in tables, place citations directly below the table or in a “Sources” row.

5. Resolve Conflicts & Ambiguities
   - If conflicting guidance exists, prefer the most recent authoritative source; explain the conflict and rationale.
   - Where only general retention principles exist (e.g., privacy minimization), provide a reasoned recommendation grounded in typical statutes of limitation and enforcement risk.

6. Practical Recommendations
   - Translate findings into a recommended HR records retention schedule (policy-ready), applying the longest required period across overlapping laws plus a reasonable buffer for disputes.
   - Note triggers for extended retention: ongoing audits, charges, investigations, claims, litigation holds, or government inquiries.

# Output Format
- Executive Summary
  - 5–8 bullets summarizing key differences and stricter rules by major HR record categories.
- Comparative Retention Matrix
  - Columns: Record Category | Federal Minimum (citation + dates) | California (citation + dates) | Delaware (citation + dates) | Effective/Last-Amended | Notes | Recommended Policy.
- Findings by Theme
  - Personnel/applicant records, payroll/time/wage statements, leave/medical, safety/OSHA, I-9/immigration, benefits/ERISA/COBRA, investigations/complaints, training, background checks/consumer reports, privacy/data minimization overlays.
- Limitations & Open Questions
  - List any gaps, ambiguous areas, or local-ordinance nuances (e.g., city-level requirements) that may warrant counsel review.
- References
  - Bulleted list with for each source: Publisher, Title, URL, Publication Date, Last-Amended Date, Effective Date (if provided), and Access Date.

## Output Requirements
- Format: Markdown.
- Length: Approximately 3–6 pages equivalent.
- Citations: Inline for factual claims; in tables, cite below or in a Sources row. Include publication, last-amended, effective, and access dates.
- Tone: Objective, precise, practitioner-oriented.

# Validation & Stop Conditions
- Confirm that all listed HR record categories were assessed for Federal, California, and Delaware requirements, or explicitly note exceptions.
- Verify every retention period and statement includes a dated citation to a primary source where available.
- Ensure the matrix is complete, readable, and the Recommended Policy column adopts the strictest applicable rule plus buffer.
- If a critical input is missing (e.g., employer size thresholds, unionized workforce, or sector-specific rules), add a single “Needs Input” bullet and stop.
```

## E031 – Draft GitHub issue templates: bug, feature, chore (YAML).

- **Domain:** Tech
- **Expected template:** Standard-Lite
- **Best candidate ID:** E031_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Draft GitHub issue templates: bug, feature, chore (YAML).

### Optimized prompt

```markdown
# Title
Draft three GitHub Issue Form templates (YAML): bug, feature, chore

# Goal
Generate production-ready GitHub Issue Forms (YAML-based issue templates) for a repository, covering bug reports, feature requests, and chores/maintenance tasks.

# Deliverables
- .github/ISSUE_TEMPLATE/bug_report.yml
- .github/ISSUE_TEMPLATE/feature_request.yml
- .github/ISSUE_TEMPLATE/chore.yml

# Constraints
- Conform to GitHub Issue Forms specification (YAML, version: 2).
- Each template must define: name, description, title, labels, assignees (empty array), and body fields.
- Use labels exactly as:
  - bug_report.yml: ["bug"]
  - feature_request.yml: ["enhancement"]
  - chore.yml: ["chore"]
- Titles:
  - bug: "[BUG] <short summary>"
  - feature: "[Feature] <short summary>"
  - chore: "[Chore] <short summary>"
- Field design:
  - Use clear, concise labels and descriptions.
  - Include required validations where noted.
  - Prefer sentence case for labels; keep user text prompts short and actionable.
- Output only the three YAML files as fenced YAML code blocks, nothing else.
- YAML must be syntactically valid and loadable by GitHub (keys, indentation, arrays).

# Instructions
- Generate three YAML files implementing the forms below.
- Include a leading comment line in each file indicating its target path.
- Use version: 2 at the top of each file.
- Include a brief top-of-form markdown section guiding submitters.
- Add an early “I have searched existing issues” confirmation (checkbox) with validations.required: true.
- Provide fields with these types: markdown, input, textarea, dropdown, checkboxes.
- For dropdowns, include sensible option sets as listed.
- Keep placeholders specific and helpful; prefer examples over abstract text.
- Do not include any prose outside the YAML code blocks.

# Form Specifications

## bug_report.yml
- name: "Bug report"
- description: "Report a reproducible problem or regression."
- labels: ["bug"]
- title: "[BUG] <short summary>"
- assignees: []
- body:
  1) markdown: brief instructions and triage note.
  2) checkboxes: "Pre-check"
     - options: "I have searched the existing issues", "I have read the documentation"
     - validations: required: true
  3) input: "Summary"
     - placeholder: "A concise description of the bug"
     - validations: required: true
  4) textarea: "Steps to reproduce"
     - placeholder: "1. Go to...\n2. Click...\n3. Observe..."
     - validations: required: true
  5) textarea: "Expected behavior"
     - validations: required: true
  6) textarea: "Actual behavior"
     - validations: required: true
  7) dropdown: "Severity"
     - options: "Critical", "High", "Medium", "Low", "Unsure"
     - default: "Medium"
  8) input: "App version"
     - placeholder: "e.g., 2.3.1"
  9) dropdown: "Operating system"
     - options: "Windows", "macOS", "Linux", "iOS", "Android", "Other/Not applicable"
  10) dropdown: "Browser"
      - options: "Chrome", "Firefox", "Safari", "Edge", "Other/Not applicable"
  11) textarea: "Logs / Screenshots"
      - description: "Paste relevant logs or drag-and-drop screenshots"
      - render: shell
  12) textarea: "Additional context"
      - description: "Environment details, network conditions, feature flags, etc."

## feature_request.yml
- name: "Feature request"
- description: "Propose a new capability or improvement."
- labels: ["enhancement"]
- title: "[Feature] <short summary>"
- assignees: []
- body:
  1) markdown: guidance about problem-first framing and acceptance criteria.
  2) checkboxes: "Pre-check"
     - options: "I have searched the existing issues", "I have checked the roadmap or docs"
     - validations: required: true
  3) input: "Summary"
     - placeholder: "One-sentence summary of the feature"
     - validations: required: true
  4) textarea: "Problem / Use case"
     - placeholder: "Who is impacted? What problem does this solve?"
     - validations: required: true
  5) textarea: "Proposed solution"
     - placeholder: "Describe the desired behavior, UX, or API"
     - validations: required: true
  6) textarea: "Alternatives considered"
     - placeholder: "List any alternative approaches you’ve considered"
  7) textarea: "Acceptance criteria"
     - placeholder: "- [ ] Given/When/Then scenarios\n- [ ] Edge cases\n- [ ] Non-functional requirements"
     - validations: required: true
  8) dropdown: "Priority / Impact"
     - options: "P0 — Blocker", "P1 — High", "P2 — Medium", "P3 — Low"
     - default: "P2 — Medium"
  9) textarea: "Additional context"
     - placeholder: "Mockups, metrics goals, related issues, dependencies"

## chore.yml
- name: "Chore"
- description: "Non-functional maintenance, refactor, toolchain, or docs tasks."
- labels: ["chore"]
- title: "[Chore] <short summary>"
- assignees: []
- body:
  1) markdown: clarify that chores should improve maintainability, reliability, or developer experience.
  2) checkboxes: "Pre-check"
     - options: "I have searched the existing issues", "This is not a user-facing feature request"
     - validations: required: true
  3) input: "Summary"
     - placeholder: "Short description of the maintenance task"
     - validations: required: true
  4) textarea: "Rationale"
     - placeholder: "Why this is needed (e.g., tech debt, build time, flakiness)"
     - validations: required: true
  5) textarea: "Scope / Tasks"
     - placeholder: "- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3"
     - validations: required: true
  6) dropdown: "Priority"
     - options: "P0 — Blocker", "P1 — High", "P2 — Medium", "P3 — Low"
     - default: "P3 — Low"
  7) textarea: "Risks"
     - placeholder: "Potential side-effects, roll-back plan"
  8) textarea: "Dependencies"
     - placeholder: "Upstream/downstream repos, services, or teams"
  9) input: "Estimated effort"
     - placeholder: "e.g., 1 day, 3 story points"

# Output Format
- Return exactly three fenced YAML code blocks, one per file, each starting with a single-line comment indicating the target path.
- Do not include any explanatory prose before, between, or after the code blocks.

# Quality Bar
- YAML parses without errors and follows GitHub Issue Forms structure.
- Field IDs (id) are unique within each form; all required fields have validations.required: true.
- Labels and titles match the mapping and patterns above.
- Copy is concise, clear, and action-oriented.

# Example Output Skeleton
```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
version: 2
name: Bug report
description: Report a reproducible problem or regression.
title: "[BUG] <short summary>"
labels:
  - bug
assignees: []
body:
  - type: markdown
    attributes:
      value: "...instructions..."
  - type: checkboxes
    id: precheck
    attributes:
      label: Pre-check
      options:
        - label: I have searched the existing issues
        - label: I have read the documentation
    validations:
      required: true
  # ...remaining fields...

```

# Steps
1) Implement each form according to the specifications above using correct keys and indentation.
2) Ensure all required validations are applied and IDs are unique per form.
3) Use the provided labels and title patterns; keep descriptions concise.
4) Produce the three YAML files in separate fenced code blocks, with only the YAML in the output.
```

## E032 – Plan a 2‑day Kyoto itinerary with hours and transit; cite sources.

- **Domain:** Casual
- **Expected template:** Research
- **Best candidate ID:** E032_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Plan a 2‑day Kyoto itinerary with hours and transit; cite sources.

### Optimized prompt

```markdown
# Role
You are a meticulous travel planner and trip research analyst specializing in Kyoto, Japan. Plan a practical, time-feasible 2-day itinerary with precise hours and door-to-door transit details, and cite authoritative sources for all time-sensitive facts.

# Goal
Produce a complete, ready-to-use 2-day Kyoto itinerary that:
- Specifies a realistic hour-by-hour schedule each day.
- Includes opening hours, last entry times, and closure notes for all attractions with citations.
- Provides exact transit steps between stops (mode, line name, direction, transfer, platform hints if available, frequency, travel time, fare estimate, and IC card/pass notes).
- Minimizes backtracking by clustering sights geographically.
- Is optimized for a first-time visitor who wants iconic highlights plus good food and neighborhood ambience.

# Assumptions
State these at the top of the output and adapt the plan accordingly:
- Travel window: upcoming month, weekdays, normal operating conditions.
- Start/end each day at lodging near Kyoto Station (JR Kyoto).
- Pace: moderate, 8:00–20:30 active window with a short rest in late afternoon.
- Interests: classic temples/shrines, atmospheric streets, scenic viewpoints, local food (no fine dining).
- Transit preference: public transit + walking; taxis only if clearly time-saving or necessary.
- Budget: mid-range; prefer IC card (ICOCA/Suica) for fares.
- Weather: normal; include brief rainy-day alternates.
If any assumption materially changes hours or routing, adjust the plan and note the change.

# Context
- Incorporate any user-provided documents or notes attached to this chat if relevant to preferences, constraints, or must-see places.
- If attached docs conflict with official sources, prefer official sources and note the discrepancy.

# Deliverables
1) 2-Day Itinerary (primary artifact)
   - For each day, an hour-by-hour timeline with:
     - Time block (e.g., 07:30–08:15)
     - Activity and location
     - Address in Japanese and romaji
     - Opening hours and last entry (with citation)
     - Door-to-door transit to the next stop:
       - Mode + operator + line name and direction
       - Departure/arrival station names
       - Transfer point(s) if any
       - Typical frequency (e.g., every 5–10 min)
       - In-vehicle time and total door-to-door time
       - Fare estimate and whether IC cards/passes are valid
       - Walking time and distance on each end
       - Link to a Google Maps directions query or official route planner
     - Brief on-site notes (must-see areas, etiquette, crowd tips)
   - Include 1–2 food suggestions near midday and dinner stops (price range, reservation note, brief signature dish), with citations if reservations or hours are mentioned.

2) Day Summary Blocks (per day)
   - Total walking distance and estimated steps
   - Total transit time and fare estimate
   - Key trade-offs and why this sequence is efficient (concise)
   - 1–2 rainy-day alternates that slot into the same time windows (with hours + citations)

3) Sources and Citations
   - Inline citations for every time-sensitive claim (hours, closures, fares, last entry times, reservation policies).
   - A consolidated “Sources” section listing all URLs with access dates.
   - Prefer official sites first; supplement with Kyoto city/transport operators, Google Maps transit, and reputable tourism boards.

# Research Plan
- Verify opening hours and closure days on official attraction websites first; cross-check with Kyoto City Tourism, JNTO, and operator pages if needed.
- Validate all rail/bus legs with official planners (JR West, Hankyu, Keifuku/Randen, Keihan, Kintetsu, Kyoto City Bus/Subway) and/or Google Maps transit. Confirm last trains if any night travel is planned.
- Confirm any pass recommendations are current (Kyoto City Bus passes have changed; verify current one-day options and pricing).
- Note any seasonal variations (illumination events, special closures); if uncertain, provide a conservative default and a backup option.

# Source Priority
1) Official attraction websites (temple/shrine/park/museum)
2) Official transport operators and planners:
   - JR West, Keihan, Hankyu, Kintetsu, Randen (Keifuku), Kyoto City Bus/Subway, NAVITIME/Jorudan, Google Maps Transit
3) Kyoto City Official Travel Guide and JNTO
4) Secondary reputable guides only to supplement, not replace official info

# Required Inclusions
- Classic highlights distributed to minimize transfers, e.g.:
  - East/Southeast Kyoto cluster: Fushimi Inari Taisha (early), Kiyomizu-dera, Sannenzaka/Ninenzaka, Gion/Shirakawa
  - Northwest/West cluster: Arashiyama (bamboo grove early, Togetsukyo, Tenryu-ji), Kinkaku-ji, Nijo Castle
- At least one scenic viewpoint (e.g., Kiyomizu-dera stage) and one garden (e.g., Tenryu-ji or Gio-ji).
- Crowd-mitigation tactics (early starts, reverse routing, or alternate entrances).
- Accessibility notes where obvious (steep stairs, long walks, cobblestones).

# Instructions
- Generate a single, optimized itinerary that is feasible without rushing. Avoid more than two cross-city traverses per day.
- Begin each day with the site most sensitive to crowds (e.g., Fushimi Inari or Arashiyama Bamboo Grove).
- Explicitly list transfer instructions and platform hints when commonly known; if unavailable, omit rather than guess.
- Provide fare estimates in JPY and note if IC cards are accepted (they generally are; specify exceptions).
- If an attraction has variable/seasonal hours, present the normal hours plus a caution note and a backup plan.
- If any official source is ambiguous or outdated, flag it and provide the best-available alternative with date.
- Do not include speculative or user-generated data without cross-checking an official source.

# Output Format
- Start with a short “Assumptions” list (updated as needed).
- Then present Day 1 and Day 2 in structured sections. Use tables or clearly separated blocks for each time slot.
- After each day, provide the Day Summary Block.
- End with a “Sources” section including:
  - Inline citation keys used in the itinerary
  - Full citations with title, organization/site, URL, and “Accessed: YYYY-MM-DD”
- Citation style: inline bracketed [Organization – Page Title, URL]; keep consistent.

# Quality Bar
- Check time feasibility: each transfer and visit duration must fit. Include buffers for transfers, walking, and queuing.
- Validate hours/closures on official pages the same day you generate the plan; include access dates.
- Ensure neutrality and practicality; avoid flowery prose. Favor clarity and precision.
- No dead links; ensure all URLs resolve.

# Length and Tone
- Aim for approximately 1,000–1,500 words total, prioritizing precise logistics over narrative.
- Tone: clear, pragmatic, traveler-friendly.
```

## E033 – Red team: list 5 phishing scenarios and 5 detection rules (exactly).

- **Domain:** Risk
- **Expected template:** Standard-Full
- **Best candidate ID:** E033_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 4, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance. Concise and readable guidance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Red team: list 5 phishing scenarios and 5 detection rules (exactly).

### Optimized prompt

```markdown
# Goal
Generate a concise red-team artifact that lists exactly five realistic phishing scenarios and exactly five corresponding detection rules that defenders could implement. The output must be vendor-neutral, actionable, and compact.

# Deliverable
Produce two sections only:
- Phishing Scenarios (exactly 5)
- Detection Rules (exactly 5)

# Constraints
- Exactly 5 scenarios and 5 rules. Do not add extras, intros, conclusions, or footnotes.
- Scenarios must be diverse across channels: include at least one email, one SMS (smishing), one voice (vishing), one social-media or collaboration-app lure, and one MFA fatigue/push-bombing angle.
- Use generic placeholders instead of real brands or personal data (e.g., “HR portal,” “cloud drive,” “video meeting app”).
- Keep each scenario to 1–2 sentences, focusing on operational realism.
- Each detection rule must:
  - Map 1:1 to a scenario (reference Scenario #).
  - Specify data sources generically (e.g., email gateway, identity provider, DNS, EDR, proxy, CASB).
  - Provide succinct matching logic as readable pseudo-conditions.
  - Include brief rationale, likely false positives, and severity (Low/Med/High).
- No external citations or URLs. Avoid code or Sigma/YARA syntax; use clear pseudo-logic.
- Tone: professional, neutral, and concise.

# Output Format
- Use exactly these two top-level headers:
  - Phishing Scenarios
  - Detection Rules
- Under each header, create a numbered list 1–5.
- For Scenarios, each item uses this single-paragraph template:
  - Title — Channel: <channel>; Pretext: <premise>; Mechanism: <link/attachment/callback/MFA push/etc.>; Objective: <credential theft/malware/financial fraud/etc.>; Notable artifacts: <2–3 concrete signals such as newly registered domain, URL shortener, callback number, attachment type, unusual time>.
- For Detection Rules, each item uses this mini-spec (5–7 lines):
  - Name:
  - Applies to Scenario #: 
  - Data sources:
  - Logic:
  - Rationale:
  - Likely false positives:
  - Severity:

# Quality Checklist
- Counts: 5 scenarios, 5 rules. No extra text before/between/after sections.
- Channel diversity satisfied.
- Each rule cleanly maps to exactly one scenario and is implementable with common enterprise telemetry.
- Language is vendor-neutral and free of real-world brand or person names.

# Phishing Scenarios
1. 
2. 
3. 
4. 
5. 

# Detection Rules
1. 
2. 
3. 
4. 
5. 
```

## E034 – Design control testing steps for ITGC change management.

- **Domain:** Audit
- **Expected template:** Standard-Lite
- **Best candidate ID:** E034_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Design control testing steps for ITGC change management.

### Optimized prompt

```markdown
# Role
You are an experienced IT audit and ITGC specialist. Design a complete, field-ready control testing program for the IT General Controls (ITGC) area of Change Management that an audit team can execute without further clarification.

# Goal
Produce actionable, unambiguous testing steps that cover both design effectiveness and operating effectiveness for ITGC Change Management across application, database, infrastructure, and configuration changes, adaptable to traditional SDLC and Agile/DevOps environments.

# Inputs
Use the following inputs if provided; otherwise apply the default in brackets.
- Organization_Name: [Acme Corp]
- Reporting_Context: [SOX 404 internal control over financial reporting]
- Period_Under_Audit: [FY2024]
- Systems_In_Scope (Apps/DB/Infra): [ERP, Billing App, Data Warehouse, Windows/Linux servers, network devices]
- Environments: [Dev, Test, UAT, Prod]
- Change_Types: [standard, normal, emergency, hotfix, configuration]
- Tooling:
  - Ticketing: [ServiceNow or Jira]
  - Version_Control: [GitHub/GitLab/Bitbucket; for infra, IaC repos if applicable]
  - CI/CD: [Jenkins/Azure DevOps/GitHub Actions]
  - Deployment/Migration: [Ansible/Octopus/Azure Pipelines/manual]
- Outsourced_Providers: [None or list MSP/CSPs]
- Risk_Tiering: [High/Medium/Low based on impact to financial reporting and production stability]
- Population_Sources: [ticketing reports, repo logs, deployment logs, change calendars]
- Sampling_Method: [attribute sampling, haphazard if population small; see guidance]
- Tolerable_Deviation_Rate: [0–5% for key controls; 0% for approvals where mandated]
- Framework_Alignment: [COBIT/NIST-aligned; SOX lens]

# Deliverables
Provide the following artifacts:
1) Test Program Overview
   - Control objectives, risks addressed, and in-scope change categories.
   - RACI for key roles (requester, developer, reviewer, approver, deployer, admin, CAB).
2) Detailed Test Procedures (Design and Operating Effectiveness)
   - For each control objective, list step-by-step procedures, evidence to obtain, and pass/fail criteria.
3) Sampling Guidance
   - Sample size by frequency (annual, quarterly, monthly, weekly, daily/ad hoc) and control risk.
   - Population definition and reproducible selection instructions.
4) Evidence Request List (PBC) and Population Request Template
   - Exact report names/fields, filters, and attestation requirements for completeness and accuracy.
5) Attribute Test Scripts
   - Checklist of attributes to verify per sample with example test steps and expected artifacts.
6) Workpaper Template
   - Columns/fields for: Objective, Procedure, Population, Sample, Evidence, Result, Exceptions, Impact, Conclusion.
7) Tailoring Guidance
   - Agile/DevOps/CI-CD, cloud/SaaS/PaaS, packaged apps vs custom, emergency/expedited changes, infra/DB/config changes.
8) Exception Evaluation and Remediation
   - Severity rubric, compensating controls, retest/remediation guidance, and sample issue wording.
9) Reporting Aids
   - Executive summary outline and control owner feedback template.

# Required Control Objectives (cover each with DE and OE steps)
- CO1: Changes are initiated, documented, and uniquely identifiable in an authorized system of record.
- CO2: Changes are risk assessed and routed for appropriate approval prior to implementation.
- CO3: Segregation of duties (SoD) is enforced between developer, tester/reviewer, and deployer; elevated access is controlled and time-bound.
- CO4: Changes are tested and peer-reviewed with evidence of successful results and defect resolution prior to deployment.
- CO5: Only approved, tested versions are migrated to production; deployments are logged, controlled, and traceable to approved tickets/commits.
- CO6: Emergency changes follow expedited but controlled workflow with post-implementation review and approval.
- CO7: Change records, version control, and deployment logs are complete, accurate, and tamper-resistant; populations are complete.
- CO8: Configuration and infrastructure changes are authorized, tested as risk-appropriate, and documented (including IaC where applicable).
- CO9: Monitoring and metrics (e.g., unauthorized change detection, failed deployments, backouts) are reviewed and exceptions remediated.
- CO10: Third-party/outsourced changes are governed by SLAs, right-to-audit, and evidence sufficiency for reliance.

# Instructions
- Structure your output exactly as defined in “Output Structure.”
- Use imperative, numbered steps for all procedures. For each step, specify:
  - Evidence to obtain (system reports/logs/screenshots/attestations) and how to validate its completeness and accuracy.
  - How to test the attribute (inquiry/inspection/observation/reperformance) and what result constitutes “pass.”
- Provide concrete examples (e.g., specific Git commit metadata fields, ServiceNow fields, CI/CD job log names).
- Include both a minimal path (small org/low tooling) and advanced path (DevOps with CI/CD and IaC).
- Include red flags and common pitfalls for each objective.
- Include data integrity checks for populations (e.g., reconcile ticket counts to audit logs; hash or row counts; query parameters).
- Define defensible sample sizes with rationale. Provide a quick table plus narrative guidance.
- Write so that a senior associate can execute without SME support.
- Do not require external sources; rely on generally accepted ITGC practices.
- Keep the full deliverable in 1,400–2,200 words.

# Output Structure
- Title
- Scope and Assumptions
- Test Program Overview (Objectives, Risks, Roles/RACI)
- Sampling Guidance (table + narrative)
- Evidence Request List (PBC) and Population Request Template
- Detailed Test Procedures
  - For each CO1–CO10:
    - Design Effectiveness: numbered steps, evidence, acceptance criteria, pitfalls.
    - Operating Effectiveness: numbered steps, evidence, acceptance criteria, pitfalls.
- Attribute Test Scripts (by change type)
- Workpaper Template (fields and example row)
- Tailoring Guidance (Agile/DevOps, cloud/SaaS, packaged vs custom, emergency)
- Exception Evaluation and Remediation (rubric, compensating controls, sample issue text)
- Reporting Aids (exec summary outline, owner feedback template)

# Quality Bar
- Actionable: If a step cannot be executed as written, revise it.
- Unambiguous: Name specific fields, logs, and artifacts expected (e.g., “ServiceNow: change_state, risk, assignment_group, approval_set”).
- Complete: Covers applications, DB, infra, configurations, and emergency changes; includes population completeness tests.
- Consistent: Aligns sampling and acceptance criteria across objectives; no contradictions.
- Adaptable: Shows how to scale testing depth by risk tier and control frequency.
- Professional tone, concise bullets, numbered procedures.

# Style
- Use clear headings, numbered lists, and compact bullet points.
- Prefer verbs: Obtain, Verify, Inspect, Corroborate, Reperform, Reconcile, Trace, Confirm.
- Avoid filler prose; prioritize precision and execution-readiness.

# Notes for Defaults
If any input is missing, set a reasonable default and proceed. If a procedure depends on tooling not in use, provide an alternative manual evidence path.

```

## E035 – Provide JSON of state apportionment factors with placeholders.

- **Domain:** Tax
- **Expected template:** Standard-Lite
- **Best candidate ID:** E035_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Provide JSON of state apportionment factors with placeholders.

### Optimized prompt

```markdown
# Task
Generate a single, well-structured JSON template containing US state apportionment factors with placeholder values that can be filled later. Do not compute anything. Use consistent placeholder tokens.

# Output
- Produce exactly one JSON object.
- Pretty-print with 2-space indentation.
- No commentary, no explanations, no trailing text—output JSON only.

# Data Model
The JSON object must have this structure:
- states: array of state objects (51 total: 50 US states + District of Columbia), sorted by state_code A–Z.

Each state object:
- state_code: 2-letter USPS code (string), e.g., "CA"
- state_name: full state name (string), e.g., "California"
- period:
  - year: placeholder token "{{period_year}}"
  - period_type: fixed string "annual"
- entity:
  - legal_name: placeholder token in the format "{{<state_code>_entity_name}}"
  - fein: placeholder token in the format "{{<state_code>_fein}}"
- factors:
  - sales:
    - numerator: "{{<state_code>_sales_num}}"
    - denominator: "{{<state_code>_sales_den}}"
    - factor: "{{<state_code>_sales_factor}}"
  - property:
    - numerator: "{{<state_code>_property_num}}"
    - denominator: "{{<state_code>_property_den}}"
    - factor: "{{<state_code>_property_factor}}"
  - payroll:
    - numerator: "{{<state_code>_payroll_num}}"
    - denominator: "{{<state_code>_payroll_den}}"
    - factor: "{{<state_code>_payroll_factor}}"
- weights:
  - sales: "{{<state_code>_weight_sales}}"
  - property: "{{<state_code>_weight_property}}"
  - payroll: "{{<state_code>_weight_payroll}}"
- combined_factor: "{{<state_code>_combined_factor}}"
- metadata:
  - sourcing_method: "{{<state_code>_sourcing_method}}"  // e.g., market-based, cost-of-performance (placeholder only)
  - throwback_rule: "{{<state_code>_throwback_rule}}"    // placeholder: "yes"/"no"/"n/a"
  - notes: "{{<state_code>_notes}}"

# Placeholder Rules
- Use double-curly tokens exactly as shown. Replace <state_code> with the lowercase state code (e.g., "ca", "ny", "tx").
- Keep token names snake_case.
- Do not insert actual numbers; all numeric fields receive placeholders.
- Use the same {{period_year}} token for all states.

# State Set
Include objects for all of the following state_code/state_name pairs:
- AL Alabama
- AK Alaska
- AZ Arizona
- AR Arkansas
- CA California
- CO Colorado
- CT Connecticut
- DE Delaware
- DC District of Columbia
- FL Florida
- GA Georgia
- HI Hawaii
- ID Idaho
- IL Illinois
- IN Indiana
- IA Iowa
- KS Kansas
- KY Kentucky
- LA Louisiana
- ME Maine
- MD Maryland
- MA Massachusetts
- MI Michigan
- MN Minnesota
- MS Mississippi
- MO Missouri
- MT Montana
- NE Nebraska
- NV Nevada
- NH New Hampshire
- NJ New Jersey
- NM New Mexico
- NY New York
- NC North Carolina
- ND North Dakota
- OH Ohio
- OK Oklahoma
- OR Oregon
- PA Pennsylvania
- RI Rhode Island
- SC South Carolina
- SD South Dakota
- TN Tennessee
- TX Texas
- UT Utah
- VT Vermont
- VA Virginia
- WA Washington
- WV West Virginia
- WI Wisconsin
- WY Wyoming

# Example (pattern only; do not echo this example in the output)
{
  "states": [
    {
      "state_code": "CA",
      "state_name": "California",
      "period": {
        "year": "{{period_year}}",
        "period_type": "annual"
      },
      "entity": {
        "legal_name": "{{ca_entity_name}}",
        "fein": "{{ca_fein}}"
      },
      "factors": {
        "sales": {
          "numerator": "{{ca_sales_num}}",
          "denominator": "{{ca_sales_den}}",
          "factor": "{{ca_sales_factor}}"
        },
        "property": {
          "numerator": "{{ca_property_num}}",
          "denominator": "{{ca_property_den}}",
          "factor": "{{ca_property_factor}}"
        },
        "payroll": {
          "numerator": "{{ca_payroll_num}}",
          "denominator": "{{ca_payroll_den}}",
          "factor": "{{ca_payroll_factor}}"
        }
      },
      "weights": {
        "sales": "{{ca_weight_sales}}",
        "property": "{{ca_weight_property}}",
        "payroll": "{{ca_weight_payroll}}"
      },
      "combined_factor": "{{ca_combined_factor}}",
      "metadata": {
        "sourcing_method": "{{ca_sourcing_method}}",
        "throwback_rule": "{{ca_throwback_rule}}",
        "notes": "{{ca_notes}}"
      }
    }
  ]
}

# Validation
- The output is valid JSON.
- Contains exactly one top-level key: "states".
- "states" has 51 entries, one per listed jurisdiction.
- All required fields present for every state.
- All placeholder tokens use lowercase state codes and snake_case.
- No extra keys, comments, or trailing commas.

# Final Instruction
Output only the final JSON object as specified.
```

## E036 – Write a walkthrough template for cash receipts (no external).

- **Domain:** Assurance
- **Expected template:** Standard-Lite
- **Best candidate ID:** E036_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Research.

### User prompt

Write a walkthrough template for cash receipts (no external).

### Optimized prompt

```markdown
# Role
You are a senior audit and accounting documentation specialist. You create reusable, company-agnostic templates that guide practitioners to execute end-to-end walkthroughs with clear steps, checklists, and evidence prompts.

# Objective
Generate a comprehensive, fill-in-the-blank walkthrough template for the Cash Receipts process that internal audit, controllership, and finance teams can use to document process understanding, risks, controls, a tracer walkthrough item, evidence collected, exceptions, and conclusions.

# Audience
- Primary: Internal Audit, Accounting/Controllership, Revenue Operations
- Secondary: External Auditors, SOX PMO, Finance Leadership

# Deliverable
Produce a single, self-contained Markdown document titled “Cash Receipts Walkthrough Template” that users can copy-paste and complete. It must be company-agnostic, include placeholders, and be structured for consistent execution across teams.

# Constraints
- No external sources or citations. Rely on generic, broadly applicable practices.
- Plain language, neutral tone; avoid legal, tax, or regulatory assertions.
- Do not include filled examples; provide a blank, fillable template only.
- Length target: approximately 1,200–1,800 words.
- Markdown only; no images or mermaid diagrams.

# Content Requirements
Include the following sections and elements in the template:

- Cover and Metadata
  - Document title, version, prepared by, reviewed by, approved by, dates, period covered, entity/business unit, process owner, systems in scope, confidentiality note.

- Purpose and Scope
  - Objectives of the walkthrough (understanding process, identifying risks/controls, tracing one transaction end-to-end).
  - In-scope vs out-of-scope boundaries (e.g., payment methods, channels, entities).
  - Assumptions and dependencies.

- Process Overview (Narrative)
  - High-level description of how cash is received, recorded, deposited, and reconciled.
  - Actors/roles and systems/applications involved.
  - Typical timing and frequency.

- Roles, Systems, and Data
  - Key roles with responsibilities (e.g., Mailroom, Cashier, AR, Treasury, Reconciliation).
  - Systems (AR subledger, POS, Bank portal, Lockbox, ERP/GL) and relevant data flows.
  - Access and segregation-of-duties considerations (placeholder checklist).

- Required Documentation (PBC Request List)
  - Checklist of documents to request and retain (e.g., deposit slips, bank statements, lockbox reports, cash receipt journals, remittance advices, merchant settlement reports, unapplied cash listings, reconciliation workpapers).
  - Evidence retention standards (file names, locations).

- Population and Sample (Walkthrough Item)
  - Define the population for cash receipts during the period.
  - Select one representative transaction (“walkthrough item”) with identifiers and rationale.
  - Tracer fields: customer, date/time, amount, method, deposit reference, journal entry ID, bank reference, GL account(s).

- End-to-End Walkthrough Steps (Tracer Instructions)
  - Stepwise checklist from source to GL and bank, including:
    1) Receipt initiation (customer remittance/order reference).
    2) Payment capture methods: mailroom, lockbox, POS, e-commerce gateway, ACH/wire, card.
    3) Mailroom and lockbox handling, opening, listing, and dual controls.
    4) Cash handling and storage; daily cash counts; over/short logs.
    5) Deposit preparation: deposit slips, batching, timeliness, transport/remote deposit.
    6) Bank deposit confirmation and cutoff.
    7) Merchant services and chargebacks (as applicable).
    8) AR cash application to invoices; handling of partials and discounts.
    9) Unapplied cash workflow and aging.
    10) Reconciliations: daily receipts to bank, AR subledger to GL, bank reconciliation.
    11) Adjustments, write-offs, refunds.
    12) IT logs, automated job runs, interface completeness checks.
    13) Segregation of duties and override monitoring.
  - For each step, include prompts for “What evidence observed?”, “Who performed?”, “When?”, “System(s) used?”, “Key fields/IDs,” and “Control(s) implicated.”

- Risk and Control Matrix (RCM) – Table
  - Provide a table with columns: Process Step | Risk Description | Financial Statement Assertion | Control ID | Control Description | Control Type (Preventive/Detective) | Automation (Manual/Automated/IT-dependent) | Frequency | Control Owner/Role | Evidence/Report | Exception Handling | Link to Test.
  - Include common assertions (Completeness, Occurrence/Existence, Accuracy, Cutoff, Classification) as selectable placeholders.

- Key Controls Summary
  - Identify and list “key” controls with rationale.
  - For each key control, include design objective, risk mitigated, precision, population covered, and evidence sufficiency prompts.

- Walkthrough Execution and Evidence
  - Checklist for executing the tracer from source document to bank and GL and back again.
  - Evidence capture prompts: screenshots, reports, document IDs, timestamps, sign-offs, and storage location.
  - Acceptance criteria for sufficiency/appropriateness of evidence.

- Testing of Design and Implementation (TOD/TOI) – For Walkthrough Item
  - Design evaluation prompts: Is the control designed to detect/prevent the stated risk at a sufficient precision and frequency?
  - Implementation evaluation prompts: Was the control in place and operating at the time? Who performed it, and what evidence supports operation?

- Exceptions and Issues
  - Log table with columns: Ref | Description | Severity (L/M/H) | Root Cause (People/Process/Tech) | Impact | Interim Action | Owner | Target Date | Status.
  - Guidance to assess whether exceptions are control failures or documentation gaps.

- Conclusions and Sign-offs
  - Overall conclusion on process understanding, control design, and implementation (for the tracer).
  - Implications for substantive testing or control testing.
  - Preparer/Reviewer/Approver sign-off blocks with date/time.

- Appendix
  - Definitions and abbreviations.
  - Sample file naming convention and index.
  - Version history.

# Formatting Requirements
- Start the output with an H1 heading: “Cash Receipts Walkthrough Template”.
- Use clear section headings (H2/H3) and concise bullet points.
- Provide fillable placeholders in square brackets like [Company], [Business Unit], [Period], [System], [Control ID], [Report Name], [Date], [Amount], [Prepared By], [Reviewed By].
- Use checkboxes [ ] for tasks and evidence prompts.
- Include simple Markdown tables for the RCM and logs; avoid complex formatting.

# Quality Bar
- Logical flow from initiation through reconciliation and sign-off.
- Each walkthrough step ties to potential risks and related controls with explicit evidence prompts.
- RCM entries are structured so a practitioner can map risks to specific controls and evidence unambiguously.
- Clear acceptance criteria and exception handling to support consistent reviewer judgments.
- Company-agnostic language; no industry-specific, legal, or regulatory claims.

# Output Format
Return only the completed Markdown template described above. Do not include explanations, rationale, or notes outside the template itself.
```

## E037 – Integration risk heatmap: 4 categories × 3 levels with definitions.

- **Domain:** Deals
- **Expected template:** Standard-Full
- **Best candidate ID:** E037_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Integration risk heatmap: 4 categories × 3 levels with definitions.

### Optimized prompt

```markdown
# Role
You are a risk and governance specialist. Produce a practical, lightweight integration risk heatmap schema ready for adoption in a project playbook.

# Goal
Design a 4-category × 3-level integration risk heatmap with clear, actionable definitions that enable consistent risk scoring and communication.

# Inputs
- Integration context: If not provided, assume enterprise software/system integration between two B2B applications.
- Audience: Delivery leads, PMO, and technical workstream owners.
- If the user supplies custom categories or level labels, use them; otherwise, apply the defaults below.

# Defaults (use unless overridden)
- Risk categories (4):
  1) Technical & Architecture
  2) Data & Interfaces
  3) Operations & Continuity
  4) People, Change & Training
- Level labels (3): Low, Moderate, High
- Color map: Low = Green, Moderate = Amber, High = Red
- Scoring emphasis: Impact on business outcomes and delivery risk (not likelihood).

# Instructions
- Define each of the four risk categories in one concise sentence (10–18 words) focused on the risk dimension it measures.
- Create a 4×3 matrix where:
  - Rows = the four risk categories.
  - Columns = Low, Moderate, High.
  - Each cell contains a category-specific definition (12–25 words) describing the observable condition, threshold, or consequence at that level.
- Make each definition:
  - Measurable where possible (e.g., thresholds, counts, duration, scope affected).
  - Actionable (signal what to monitor or when to escalate).
  - Mutually exclusive and collectively exhaustive across the three levels for each category.
- Add 3–5 usage notes that explain how to apply the heatmap (e.g., evidence needed, review cadence, escalation triggers, how to combine multiple category ratings into an overall status).
- Avoid domain-specific jargon; prefer plain language.

# Output Format
- Title: “Integration Risk Heatmap”
- Section 1: “Risk Categories” — bullet list of the 4 categories with 1‑sentence definitions.
- Section 2: “Level Definitions (4×3 Matrix)” — a table with:
  - Columns: Category | Low (Green) | Moderate (Amber) | High (Red)
  - Rows: the four categories, with one definition per cell (12–25 words).
- Section 3: “Usage Notes” — 3–5 bullets.
- Section 4: “Assumptions” — 2–3 short bullets (only if defaults were used).
- Keep total output under 500 words.

# Constraints
- No placeholders or TODOs in the final output.
- No citations or external references.
- Do not include process commentary; output only the final artifact.

# Quality Bar
- Definitions are specific, observable, and non-overlapping within each category.
- Language is concise and unambiguous.
- Table is complete: 4 rows × 3 columns with all cells populated.
```

## E038 – Write a bash script that zips logs older than 30 days (code only).

- **Domain:** Tech
- **Expected template:** Standard-Lite
- **Best candidate ID:** E038_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Write a bash script that zips logs older than 30 days (code only).

### Optimized prompt

```markdown
# Role
You are a senior DevOps engineer. Generate a robust, portable Bash script.

# Objective
Write a Bash script that zips log files older than a configurable number of days (default: 30).

# Deliverable
- Output only the Bash script code in a single fenced code block with language set to bash.
- Do not include any explanation, comments outside the code block, or additional text before/after the code block.

# Requirements
- Shebang: use /usr/bin/env bash.
- Safety: set -Eeuo pipefail; set IFS to $'\n\t'.
- Configurable variables at the top with sensible defaults:
  - LOG_DIR (default: /var/log)
  - ARCHIVE_DIR (default: /var/log/archive)
  - DAYS (default: 30)
  - INCLUDE_EXT (comma-separated list; default: log)  # only these extensions are considered for archiving
  - ARCHIVE_PREFIX (default: logs)
  - DRY_RUN (default: 0; if 1, print actions without performing them)
- Behavior:
  - Create ARCHIVE_DIR if it doesn’t exist.
  - Construct archive name as: "${ARCHIVE_PREFIX}-YYYYMMDD.zip" (based on current date) inside ARCHIVE_DIR.
  - Recursively find files in LOG_DIR older than DAYS days whose extension is in INCLUDE_EXT.
  - Exclude files already compressed/archived: *.zip, *.gz, *.bz2, *.xz, *.zst.
  - Exclude zero-byte files.
  - Preserve original files (do NOT delete after zipping).
  - Handle file names with spaces and special characters robustly (assume filenames do not contain NUL; handle spaces and most special chars).
  - If no files match, exit successfully with a clear message to stderr and no archive creation.
  - Idempotent: if the archive already exists for the day, add/update matching files without duplicating identical entries.
- Implementation details:
  - Require and check for dependencies: bash, find, zip, date, mktemp.
  - Use find -print0 and a while IFS= read -r -d '' loop to collect candidates safely.
  - Build a temporary file list to avoid exceeding command-line length limits; add files to the archive incrementally.
  - Use zip options for quiet operation and updating existing archives without prompting.
  - Exit with non-zero on unexpected errors; emit helpful error messages to stderr.
- Logging:
  - Print concise status to stderr (what directory is scanned, how many files found, archive path).
  - In DRY_RUN=1, print the list of files that would be added and the target archive, but do not create/modify archives.

# Constraints
- Target OS: Linux with GNU utilities.
- Bash-compatible only; no external scripting languages.
- No interactive prompts; suitable for cron usage.
- Avoid using tar; use the zip utility.

# Output Format
- Single fenced code block:
  - Fence language: bash
  - Contains only the script code.

# Example invocation (do not include this in output, just ensure it will work):
#   LOG_DIR=/app/logs ARCHIVE_DIR=/app/logs/archive DAYS=45 INCLUDE_EXT="log,out" DRY_RUN=1 ./zip_old_logs.sh
```

## E039 – Return only Y or N: do we have enough to book a revenue accrual?

- **Domain:** Finance
- **Expected template:** Essential
- **Best candidate ID:** E039_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Return only Y or N: do we have enough to book a revenue accrual?

### Optimized prompt

```markdown
# Title
Decision: Do we have enough to book a revenue accrual? Return only Y or N.

# Goal
Evaluate the provided internal materials to determine whether sufficient, documented support exists to book a revenue accrual for the specified period-end. Output a single-character decision: Y or N.

# Inputs
- Attached internal documents (e.g., contract/SOW/PO, purchase orders, emails, delivery notes, shipping records, timesheets, milestone sign-offs, acceptance certificates, invoices/drafts, revenue policy, approvals).
- Optional caller-provided variables (if present in the materials or prompt):
  - period_end_date
  - materiality_threshold
  - internal_policy_references (e.g., revenue recognition or accrual policy identifiers)

# Decision Criteria
Return Y only if all of the following are clearly satisfied by the provided documents. Otherwise, return N.
1) Enforceable arrangement in place:
   - Signed contract/SOW/PO or equivalent that covers the goods/services and terms.
2) Performance occurred within the period:
   - Evidence that goods were delivered and/or services performed on or before period_end_date (e.g., delivery/ship/receipt docs, approved timesheets, milestone completion/acceptance).
3) Amount is measurable:
   - Price/quantity are fixed or determinable; calculation method is explicit.
   - If variable consideration exists, a defensible, documented estimate is available and constrained per policy; otherwise return N.
4) Collectability is probable under the entity’s policy:
   - Credit approval or other documentation indicating collectability; no unresolved disputes or blockers.
5) Cut-off and non-duplication:
   - Accrual pertains to the current period only, is not already invoiced/recognized, and does not duplicate other entries.
6) Approvals and policy compliance:
   - Any required internal approvals (finance/controller) are present if mandated by policy.
   - No policy-prohibited conditions (e.g., incomplete acceptance when acceptance is a prerequisite).
7) Documentation sufficiency:
   - At minimum, present: (a) enforceable arrangement, (b) proof of performance by period end, (c) measurable amount support, and (d) cut-off confirmation. Missing any of these → N.
8) Conflicts or uncertainty:
   - If documents conflict or are ambiguous on any required point, return N.

# Instructions
- Review only the provided materials; do not use external sources.
- Infer period_end_date and other variables from the materials if stated; if not clearly stated, treat as unknown and return N.
- Apply a conservative standard: if any required criterion is unmet or unclear, return N.
- Do not include explanations, rationale, numbers, or any characters other than a single uppercase Y or N.

# Output Format
- Exactly one character: Y or N
- No spaces, punctuation, or additional text.

# Constraints
- Deterministic behavior: default to returning N unless all required criteria are explicitly satisfied by the documents provided.
- Do not reveal reasoning steps or summaries in the output.
```

## E040 – Outline DPA sections and redlines checklist.

- **Domain:** Legal
- **Expected template:** Standard-Full
- **Best candidate ID:** E040_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Research.

### User prompt

Outline DPA sections and redlines checklist.

### Optimized prompt

```markdown
# Title
Data Processing Agreement (DPA) Sections Outline and Negotiation Redlines Checklist

# Goal
Generate a concise, practical DPA section outline and a negotiation-ready redlines checklist calibrated to the provided context and risk posture.

# Inputs
- Organization role: controller and/or processor
- Counterparty role: controller and/or processor
- Jurisdictions: e.g., EU GDPR, UK GDPR, US states (e.g., CCPA/CPRA), other
- Data subjects: e.g., consumers, employees, B2B contacts, minors
- Data categories/sensitivity: e.g., special categories, health data, biometrics, financial
- Processing activities: e.g., SaaS, support, analytics, marketing, AI training/inference
- Data transfers: locations, cross-border mechanisms (e.g., SCCs), data residency requirements
- Security baseline: frameworks (e.g., ISO 27001, SOC 2), encryption, access controls
- Subprocessor policy: approvals (general/specific), notification, objection rights
- Incident response expectations: breach notification timeline, cooperation, reporting detail
- Audit/assessment: frequency, scope, credentials, remote/onsite, cost allocation
- Data subject request support: SLAs, responsibilities, scope
- Termination/return/deletion: timelines, verification, format
- Liability posture: caps, supercaps (e.g., for data breaches), exclusions, indemnities
- Any attached documents: current DPA template(s), vendor paper, security addenda, prior redlines

# Context
- If attachments are provided, extract and summarize constraints, definitions, and negotiation history to tailor the outline and redlines.
- If inputs are missing, assume a controller–processor DPA under GDPR/UK GDPR with optional US state privacy addenda; avoid external browsing and do not cite sources.

# Deliverables
1) DPA Section Outline
  - Provide a hierarchical, numbered table of contents with 1–2 sentence purpose notes per section.
  - Include standard sections: Definitions, Scope/Purpose, Roles, Processing Instructions, Confidentiality, Security Measures, Subprocessors, International Transfers (e.g., SCCs/modules), Data Subject Rights Assistance, DPIA/Consultation, Breach/Incident Notification, Audit/Assessments, Cooperation with Authorities, Data Return/Deletion, Records of Processing, MDM/Logs, Personnel/Training, Certifications, Insurance, Notices, Liability/Indemnities, Term/Termination, Governing Law/Venue, Order of Precedence, Changes/Versioning, Miscellaneous.
  - Flag optional modules based on inputs: AI model training/use restrictions, de-identification/pseudonymisation, data localization, sensitive data handling, law enforcement/government requests, BAA/HIPAA alignment (if applicable).
  - Note for each section the primary owner (Customer vs. Vendor) and cross-references to related sections.

2) Negotiation Redlines Checklist
  - Produce a practical checklist organized by topic (e.g., Security, Subprocessors, Transfers, Incident Management, Audit, DSARs, Purpose Limitation, Deletion/Return, Liability/Indemnity, Insurance, Certifications, Change Control, Government Requests).
  - For each checklist item include:
    - Redline focus: succinct statement of the negotiable point.
    - Customer-lean stance: preferred language/position.
    - Vendor-lean stance: typical counter-position.
    - Fallback/compromise: pragmatic middle ground.
    - Severity: Must have / Strongly prefer / Nice to have.
    - Sample tweak: 1–2 lines of model clause language.
  - Add a “Top 10” quick-start list for time-pressed reviewers.

# Instructions
- Read and synthesize any provided documents and inputs; extract definitions, roles, transfer mechanisms, liability posture, and security baselines.
- Calibrate the outline and checklist to the stated roles, jurisdictions, and risk posture.
- Use consistent defined terms throughout (e.g., “Controller,” “Processor,” “Customer,” “Vendor”); align with any attached templates’ definitions.
- Prefer precise, neutral, and negotiation-ready language; avoid generic legal disclaimers and avoid external citations.
- Do not browse external sources; rely on standard DPA structures and common negotiation patterns.
- Keep the outline compact yet complete; keep each outline note to 1–2 sentences.
- Make the checklist actionable: concise bullets, clear stances, and practical fallback wording.

# Reasoning
- Identify governing regimes and roles from inputs/attachments.
- Map mandatory clauses to those regimes and flag optional modules.
- Prioritize risk areas (security, breach, transfers, subprocessors, liability) based on the risk posture.
- Draft the outline first; derive the checklist to mirror the outline’s sections.
- Validate internal consistency and cross-references.

# Output Format
- Part A: Numbered outline with section titles and concise purpose notes; include optional modules clearly marked.
- Part B: Checklist in topic-grouped bullets; each bullet includes: Redline focus, Customer-lean stance, Vendor-lean stance, Fallback/compromise, Severity, Sample tweak.
- Finish with a “Top 10 Redlines” list.

# Constraints
- Length: Outline ≤ 35 sections; each note ≤ 2 sentences. Checklist ≤ 60 bullets total; sample tweaks ≤ 2 lines each.
- Tone: Practical, precise, solution-oriented; avoid fluff and avoid legal advice disclaimers overshadowing content.
- Terminology: Match attached template terms if present; otherwise use standard GDPR-aligned terms.
- No external research or citations.

# Quality Checks
- Completeness: All mandatory DPA sections covered; optional modules included only if relevant.
- Consistency: Definitions and roles consistent across outline and checklist.
- Negotiability: Each checklist item includes clear customer vs. vendor stances and a realistic fallback.
- Traceability: Checklist items reference the corresponding outline section numbers.
- Clarity: Short, scannable bullets; no ambiguity.

# Example (abbreviated skeleton)
- Outline 7. Security Measures — Purpose: Specify baseline controls (e.g., encryption, access, logging) and evidence (certs/reports). Owner: Vendor. Cross-refs: 9 (Subprocessors), 12 (Incident).
- Checklist: Security/Breach Notification Timeline — Customer: 48h notice; Vendor: “without undue delay”; Fallback: 72h with materiality carve-out; Severity: Must have; Sample tweak: “Processor shall notify Controller within 72 hours of confirming a Personal Data Breach …”
```

## E041 – Write a bedtime story about a dragon (no structure requirements).

- **Domain:** Casual
- **Expected template:** Essential
- **Best candidate ID:** E041_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Write a bedtime story about a dragon (no structure requirements).

### Optimized prompt

```
# Role
You are a warm, imaginative storyteller who crafts soothing bedtime tales for young children.

# Objective
Write a gentle, comforting bedtime story about a kind dragon that helps a child relax and drift to sleep.

# Audience
- Primary: Children ages 5–8, listening to a caregiver read aloud at bedtime.
- Secondary: Caregivers seeking a calm, cozy story with a reassuring ending.

# Requirements
- Core concept: The dragon is friendly and helpful; any conflict is low-stakes and resolved quickly and kindly.
- Tone: Calm, cozy, reassuring, whimsical; prioritize safety, wonder, and restfulness.
- Pacing: Unhurried, dreamy cadence with soft imagery and sensory details (moonlight, night breeze, glowing stars).
- Language:
  - Reading level: roughly Grade 2; short-to-medium sentences; accessible vocabulary.
  - Use gentle sound patterns (soft alliteration, mild rhyme or repetition); avoid loud/harsh onomatopoeia.
- Content boundaries:
  - No violence, fear, peril, or cliffhangers.
  - No complex lore, battles, or high-stakes quests.
  - No brand names or real-world product references.
- Structure and style:
  - Include a short, inviting title.
  - Provide 1–2 brief, lullaby-like refrains that recur exactly the same words each time (≤12 words each) to cue relaxation.
  - Maintain third-person past tense.
  - End with a clear, soothing closure that signals bedtime (e.g., quiet settling, stars dimming, soft breathing).
- Length: 600–800 words.
- Formatting: 
  - Output only a title line, a blank line, and the story in paragraph form.
  - No lists, scene breaks, or author’s notes.

# Inspiration Prompts (optional to weave in)
- The dragon’s breath is a gentle, warm shimmer that calms the night.
- The dragon collects breezes, moonbeams, or stories and shares them softly.
- A small worry is transformed into something kind (e.g., a lantern for the night).

# Quality Bar
- The story should be soothing enough for bedtime, emotionally safe, and end on a peaceful, sleepy note.
- Keep imagery vivid yet simple; ensure the refrains feel natural and comforting when read aloud.

# Output
- Produce:
  1) A short title (one line).
  2) One blank line.
  3) The full story text meeting all requirements.
- Do not include any meta commentary, instructions, or explanations.
```

## E042 – Draft KRIs for cloud cost overruns; include thresholds and actions.

- **Domain:** Risk
- **Expected template:** Standard-Full
- **Best candidate ID:** E042_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Draft KRIs for cloud cost overruns; include thresholds and actions.

### Optimized prompt

```
# Title
Draft Key Risk Indicators (KRIs) for Cloud Cost Overruns with Thresholds and Actions

# Objective
Generate a concise, implementation-ready KRI catalog to monitor and mitigate cloud cost overruns across major providers. Include clear definitions, formulas, threshold bands, monitoring cadence, ownership, and prescriptive actions for each threshold breach.

# Audience
- FinOps practitioners
- Cloud platform/engineering leads
- Finance/controllership stakeholders

# Context
- Scope: Public cloud spend across AWS, Azure, and GCP.
- Risk focus: Budget variance, anomalous spend spikes, inefficient resource utilization, commitments coverage/utilization, unallocated spend due to poor tagging, egress, and environment mix.
- Operating model: Monthly budgeting with weekly reviews and daily anomaly checks.
- Maturity: Organization has basic tagging, budget/forecast processes, and access to native cost tools.

# Inputs
Provide or assume the following. If not provided, use defaults under Assumptions.
- Annual and monthly cloud budget by provider, account/subscription/project, and business unit.
- Tagging/labeling schema for cost allocation (e.g., environment, app, BU, cost center).
- Forecast methodology (e.g., time series, driver-based) and current month forecast value.
- Historical spend lookback window (e.g., 90 days) for anomaly baselining.
- Commitment targets (e.g., Savings Plans/RI coverage %, Azure Reservations, Committed Use Discounts).

# Assumptions (Agentic Defaults)
- Tolerance bands (can be tuned):
  - Budget variance: Green ≤ 5%, Amber 5–10%, Red > 10%.
  - Run-rate vs forecast (MTD annualized): Green ≤ 7%, Amber 7–12%, Red > 12%.
  - Daily spend anomaly vs baseline: Green ≤ 20%, Amber 20–30%, Red > 30% above expected.
  - Untagged or unallocated spend: Green ≤ 5%, Amber 5–10%, Red > 10% of total.
  - Idle/underutilized resources (e.g., CPU < 5% or stopped-but-billed): Green ≤ 10%, Amber 10–20%, Red > 20% of compute/storage spend.
  - Commitment coverage (Savings Plans/Reservations/CUDs): Green ≥ 70%, Amber 50–70%, Red < 50%.
  - Commitment utilization: Green ≥ 90%, Amber 75–90%, Red < 75%.
  - Data egress cost variance M/M: Green ≤ 10%, Amber 10–20%, Red > 20%.
  - Non-prod spend share: Green ≤ 35%, Amber 35–50%, Red > 50% (adjust per org policy).
  - Rightsizing opportunity (estimated reducible spend): Green ≤ 15%, Amber 15–25%, Red > 25%.
- Monitoring cadence:
  - Anomaly KRIs: daily.
  - Budget/forecast KRIs: weekly and monthly.
  - Tagging/coverage/utilization KRIs: weekly.
- Tools: AWS Cost Explorer/Budgets/CE Anomaly Detection, Azure Cost Management + Budgets, GCP Billing export + BigQuery + Data Studio/Looker; plus cloud-native metrics for utilization.

# Instructions
1. Generate a KRI catalog of 12–16 items focused on cloud cost overrun risks across AWS, Azure, and GCP.
2. For each KRI, provide:
   - Name
   - Purpose (risk addressed)
   - Definition (plain-English)
   - Formula (express precisely; specify numerator/denominator and any filters)
   - Data source(s) and required fields/tags
   - Unit of measure
   - Thresholds: Green/Amber/Red using the Assumptions unless Inputs override
   - Monitoring cadence
   - Control owner/role
   - Actions: Specific, time-bound steps for Amber and Red (who does what within what time frame), including escalation path
   - Notes: Dependencies, caveats, or tuning guidance
3. Include at least these KRI categories:
   - Budget variance (total and by BU/account)
   - MTD run-rate vs forecast
   - Daily spend anomaly detection
   - Untagged/unallocated spend ratio
   - Idle/underutilized resource cost share
   - Commitment coverage and utilization (per provider)
   - Data egress cost variance
   - Non-prod vs prod spend ratio
   - Rightsizing opportunity backlog (reducible spend)
   - Storage tiering effectiveness (hot vs infrequent/archive)
4. Calibrate thresholds to be realistic and actionable. If Inputs provide stricter targets, replace defaults and note the change in the Notes column.
5. Write crisp, unambiguous actions that reference concrete levers:
   - Budget controls (freeze, approval gates), rightsizing, scheduling off-hours, instance family changes, reservations/SP/CUD adjustments, storage lifecycle policies, data transfer design, tag enforcement/auto-remediation.
6. Produce implementation-ready text: avoid vague language, avoid dependencies on external research. Use provider-agnostic names plus provider-specific examples where helpful.
7. After the catalog, include a short escalation playbook:
   - Trigger conditions for Amber vs Red
   - Notifications and channels
   - SLA timelines (e.g., Amber triage within 2 business days; Red within 4 hours)
   - Roles and RACI
   - Reversion to Green criteria
8. Provide a final tuning section with levers to adjust sensitivity (e.g., lookback window, smoothing, min-change thresholds, seasonal adjustments).

# Output Format
- Section A: KRI Catalog (table)
  - Columns (in order):
    1) KRI Name
    2) Purpose
    3) Definition
    4) Formula
    5) Data Source(s)
    6) Unit
    7) Green Threshold
    8) Amber Threshold
    9) Red Threshold
    10) Cadence
    11) Owner
    12) Actions (Amber)
    13) Actions (Red)
    14) Notes
- Section B: Escalation and Response Playbook (bulleted)
- Section C: Threshold Tuning Guidance (bulleted)

# Quality Bar
- Completeness: 12–16 KRIs spanning all required categories; no duplicate KRI semantics.
- Precision: Every formula is computable from stated data sources; thresholds are numeric and banded.
- Actionability: Each Amber/Red action includes a concrete step, an owner, and a timeline.
- Clarity: Plain language, no jargon; provider specifics only where they add precision.
- Consistency: Units, cadence, and threshold directions (higher-is-worse vs lower-is-worse) are coherent and stated.

# Steps and Reasoning
- Step 1: List cost overrun risk scenarios and map them to measurable KRIs.
- Step 2: For each KRI, derive a formula and select data sources that are realistically available in AWS/Azure/GCP.
- Step 3: Apply default thresholds; adjust if any Inputs override and note the rationale.
- Step 4: Define prescriptive, time-bound actions and escalation paths that reduce risk swiftly.
- Step 5: Validate against the Quality Bar; revise for gaps or ambiguity.

# Constraints and Style
- Do not invent external statistics or cite external sources.
- Keep the total output under ~1,200 words.
- Use concise sentences and action verbs.
- Avoid repeating the same action steps across multiple KRIs unless truly identical.

# Review Checklist (for the model)
- Are all required KRI categories present?
- Are all thresholds numeric and directionally correct?
- Can each formula be computed from the listed data sources?
- Do Amber/Red actions specify owner and timeline?
- Is the escalation playbook clear with SLAs and reversion criteria?

# Variables (optional overrides; if provided, use these values)
- BudgetVarianceAmber: 0.10
- BudgetVarianceRed: 0.10+
- RunRateVsForecastAmber: 0.12
- RunRateVsForecastRed: 0.12+
- UntaggedSpendAmber: 0.10
- UntaggedSpendRed: 0.10+
- IdleSpendAmber: 0.20
- IdleSpendRed: 0.20+
- CommitmentCoverageAmber: 0.70
- CommitmentCoverageRed: 0.50
- CommitmentUtilizationAmber: 0.90
- CommitmentUtilizationRed: 0.75
- EgressMoMAmber: 0.20
- EgressMoMRed: 0.20+
- NonProdShareAmber: 0.50
- NonProdShareRed: 0.50+
- RightsizingOppAmber: 0.25
- RightsizingOppRed: 0.25+
```

## E043 – Create a sampling calculator prompt (inputs, outputs, steps).

- **Domain:** Audit
- **Expected template:** Standard-Full
- **Best candidate ID:** E043_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Create a sampling calculator prompt (inputs, outputs, steps).

### Optimized prompt

```
# Task
Build a robust Sampling Calculator that computes required sample sizes for common study designs and returns a clear, structured result.

# Inputs
Provide a single JSON object with these fields. Use sensible defaults if not provided, and validate all ranges.

- objective (string; required)
  - One of:
    - "estimate_proportion"  // sample size for margin of error on a single proportion
    - "estimate_mean"        // sample size for margin of error on a single mean
    - "test_two_proportions" // sample size per group for detecting a difference in proportions
    - "test_two_means"       // sample size per group for detecting a difference in means
    - "test_one_proportion"  // sample size for testing a single proportion vs. a benchmark

- parameters (object; required; fields vary by objective)
  - For estimate_proportion:
    - margin_of_error (float; required; >0)
    - baseline_p (float; optional; 0< p <1; default 0.5 worst-case)
  - For estimate_mean:
    - margin_of_error (float; required; >0)
    - sd (float; required; >0) // population or prior SD estimate
  - For test_two_proportions:
    - baseline_p (float; required; 0< p <1)
    - mde (float; required; >0) // absolute difference |p_treatment - p_control|
  - For test_two_means:
    - sd (float; required; >0)  // common SD
    - mde (float; required; >0) // absolute mean difference
  - For test_one_proportion:
    - p_null (float; required; 0< p <1)
    - p_alt (float; required; 0< p <1; p_alt != p_null)

- inference (object; optional; defaults in parentheses)
  - confidence_level (float; default 0.95) // for CIs or two-sided tests
  - alpha (float; default computed from confidence_level; else required if confidence_level absent)
  - power (float; default 0.80) // only for hypothesis-testing objectives
  - sided (string; "two_sided" | "one_sided"; default "two_sided")

- population (object; optional)
  - size_N (integer; optional; >=1) // for finite population correction
  - sampling_design (object; optional)
    - design_effect (float; optional; >=1; default 1.0)
    - cluster_icc (float; optional; 0<= ICC <1)
    - avg_cluster_size_m (float; optional; >=1)
    - Note: If cluster_icc and avg_cluster_size_m provided and design_effect not provided, compute design_effect = 1 + (avg_cluster_size_m - 1)*cluster_icc.

- operations (object; optional)
  - response_rate (float; optional; 0< r ≤1) // inflates n by 1/r
  - allocation (object; optional) // for stratified designs or uneven group splits
    - type (string; "equal_groups" | "unequal_groups" | "stratified")
    - groups (array of {name, weight}) // for unequal group ratios; weights sum to 1
    - strata (array of {name, weight_W, sd_or_p}) // for Neyman allocation; weights sum to 1
  - rounding (string; "ceil" | "round" | "up_to_block"; default "ceil")
  - block_size (integer; optional; used if rounding="up_to_block")

- metadata (object; optional)
  - id (string) // passthrough identifier for traceability
  - locale (string; default "en-US") // for numeric formatting

# Outputs
Return a single JSON object with these fields.

- objective (string)
- inputs_validated (object) // echo of validated/filled inputs with defaults applied
- results (object)
  - total_sample_size (integer) // after all adjustments and rounding
  - per_group (array of {name, n}) // for two-group tests or custom allocations
  - per_stratum (array of {name, n}) // if stratified allocation was requested
  - base_n (number) // before FPC, design effect, and response-rate inflation
  - adjusted_n (number) // after FPC and design effect, before response-rate inflation
  - inflation_factors (object)
    - fpc (number | null)
    - design_effect (number)
    - response_inflation (number)
  - achieved (object) // computed when feasible
    - margin_of_error (number | null)
    - power (number | null)
- diagnostics (object)
  - method (string) // formula/approach used (normal approximation, power-based, etc.)
  - z_values (object) // z_alpha, z_beta actually used
  - notes (array of strings) // warnings, e.g., small-sample caveats
- errors (array of strings) // empty if none

# Steps
Implement the following algorithm deterministically.

1) Validate and normalize inputs
  - Ensure numeric ranges are valid. Fill defaults for confidence_level, alpha, power, sided, design_effect, rounding.
  - If both alpha and confidence_level are present, check consistency: confidence_level ≈ 1 - alpha for two-sided.
  - Compute alpha from confidence_level if alpha not provided:
    - two-sided: alpha = 1 - confidence_level
    - one-sided: alpha = 2*(1 - confidence_level)
  - Compute z_alpha = Z(1 - alpha/2) for two-sided; Z(1 - alpha) for one-sided. Compute z_beta = Z(power).
  - If cluster_icc and avg_cluster_size_m provided and design_effect absent, compute design_effect = 1 + (m - 1)*ICC.
  - For proportion estimation with unknown baseline_p, set baseline_p = 0.5 (worst-case).

2) Compute base sample size (no corrections)
  - Estimation of a proportion:
    - n0 = z_alpha^2 * p*(1 - p) / margin_of_error^2
  - Estimation of a mean:
    - n0 = z_alpha^2 * sd^2 / margin_of_error^2
  - Test two proportions (difference p2 - p1 with absolute MDE = |p2 - p1|):
    - Use normal approximation power-based formula for equal group sizes:
      - p_bar = (p1 + p2)/2 where p2 = p1 ± mde
      - n_per_group0 = [ z_alpha*sqrt(2*p_bar*(1 - p_bar)) + z_beta*sqrt(p1*(1 - p1) + p2*(1 - p2)) ]^2 / mde^2
    - For unequal group ratios, scale by allocation weights.
  - Test two means (equal variances, equal n):
    - n_per_group0 = 2 * (z_alpha + z_beta)^2 * sd^2 / mde^2
  - Test one proportion (H0: p = p_null vs H1: p = p_alt):
    - mde = |p_alt - p_null|
    - n0 = [ z_alpha*sqrt(p_null*(1 - p_null)) + z_beta*sqrt(p_alt*(1 - p_alt)) ]^2 / mde^2
  - Set base_n = n0 (or 2*n_per_group0 for total in two-group designs before adjustments).

3) Apply design and population adjustments
  - Finite Population Correction (if size_N provided and objective is estimation):
    - n_fpc = n0 / (1 + (n0 - 1)/N)
  - Apply design effect:
    - n_deff = n_fpc * design_effect
  - Response-rate inflation (if response_rate r provided):
    - n_adj = n_deff / r
  - Set adjusted_n = n_adj. Ensure adjusted_n >= minimal feasible (e.g., ≥2 per group for tests).

4) Allocation to groups or strata
  - If two-group tests and allocation.type = "equal_groups" (default):
    - per_group n = adjusted_n / 2
  - If allocation.type = "unequal_groups":
    - Assign per-group n_i = adjusted_n * weight_i
  - If allocation.type = "stratified" (estimation objectives):
    - Use Neyman allocation if sd_or_p provided per stratum:
      - For means: size_h ∝ W_h * SD_h
      - For proportions: size_h ∝ W_h * sqrt(p_h*(1 - p_h)), using provided p or baseline_p if missing
    - Otherwise use proportional allocation: size_h ∝ W_h
  - Apply rounding policy to each per-group/stratum count:
    - "ceil": ceil to next integer
    - "round": standard rounding
    - "up_to_block": round up to nearest multiple of block_size
  - Reconcile rounding so that sum of allocated counts equals total_sample_size.

5) Compute achieved metrics (optional but recommended)
  - For estimation tasks, compute achieved margin_of_error using final n (and FPC if applicable).
  - For tests, compute approximate achieved power using final per-group n and the same normal-approximation formulas.

6) Assemble output
  - Populate outputs per the schema.
  - Include method, z-values, and any notes (e.g., “Used worst-case p=0.5” or “Applied FPC”).
  - If inputs invalid or inconsistent, populate errors with clear messages and omit results.

# Constraints
- Deterministic numeric results for the same inputs.
- Use normal approximations. Do not fetch external data or libraries; if an environment provides power.* functions, you may use them but must return equivalent values to the formulas above.
- Units: all rates as proportions in [0,1]. All sample sizes are counts (integers after rounding).
- If both design_effect and cluster inputs are provided, prefer explicit design_effect.
- For extreme probabilities (p close to 0 or 1) or very small samples, add a diagnostic note about approximation limits.

# Response Format
Return strictly one JSON object with keys exactly as defined in Outputs. Do not include prose outside the JSON.

# Example Inputs (illustrative)
{
  "objective": "test_two_proportions",
  "parameters": { "baseline_p": 0.10, "mde": 0.02 },
  "inference": { "confidence_level": 0.95, "power": 0.80, "sided": "two_sided" },
  "population": { "size_N": 200000 },
  "operations": {
    "response_rate": 0.6,
    "allocation": { "type": "equal_groups" },
    "rounding": "up_to_block",
    "block_size": 8
  },
  "metadata": { "id": "exp-123" }
}
```

## E044 – As of this quarter, summarize R&D credit changes in UK/US with citations.

- **Domain:** Tax
- **Expected template:** Research
- **Best candidate ID:** E044_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

As of this quarter, summarize R&D credit changes in UK/US with citations.

### Optimized prompt

```markdown
# Role
You are a senior tax policy analyst. Your job is to produce a concise, authoritative “as of this quarter” briefing on R&D tax credit changes in the United Kingdom and the United States, with verifiable citations to primary sources.

# Goal
Summarize all material changes to R&D tax credit regimes in the UK and US that are in effect, newly enacted, or officially announced for implementation, “as of this quarter” (use the current date and quarter at runtime). Clearly distinguish enacted changes from proposals and guidance.

# Scope
- Jurisdictions: United Kingdom (UK-wide) and United States (Federal only; exclude US state credits).
- Time horizon: Focus on changes in the last 4 quarters, plus any imminent changes with finalized effective dates within the next 2 upcoming quarters.
- Topics to cover for each jurisdiction:
  - Policy/rate changes, qualifying expenditure definitions, documentation/filing process changes, caps/limitations, interaction rules, and anti-abuse/penalty or enforcement updates.
  - Effective dates, transition rules, and who is affected (e.g., SMEs vs large companies in the UK; general business taxpayers in the US).
  - Open proposals and pending guidance (clearly labeled as not yet enacted).
- Depth: Executive-ready summary plus a concise detail section; keep the main text tight and practical.

# Context
- If the user has provided internal documents, scan them to surface any company-relevant angles (e.g., sector applicability, typical cost types), but do not rely on them to evidence public-law changes. For public-law statements, cite official/public sources.
- If internal docs contradict public sources, note the discrepancy and default to official/public sources for legal status.

# Data Freshness
- Treat “this quarter” as the current quarter determined at runtime. Include an “As-of date and quarter” line in the header.
- Verify all claims with fresh sources. If no material change has occurred this quarter, explicitly state that and indicate the most recent prior change with date.
- Include a “Last checked” timestamp.

# Sources and Citation Rules
- Prioritize primary/official sources:
  - UK: HMRC manuals and guidance, HM Treasury/Budget publications, legislation.gov.uk, Finance Acts.
  - US: Internal Revenue Code, IRS notices/revenue procedures, Treasury regulations, Joint Committee on Taxation, Congressional bills/status pages.
- Secondary sources (Big 4, law firms, reputable tax publishers) may be used only for synthesis; do not rely on them as sole evidence of a change.
- Citation style:
  - Use bracketed, numbered citations [1], [2], etc., inline at the end of sentences where claims are made.
  - Provide a “Sources” section mapping each number to: Title, Publisher, Date (YYYY-MM-DD), and a working URL.
  - Every material change must have at least one primary-source citation.

# Output Format
Provide the deliverable in the following structure, using plain text with simple bullets and minimal tables:

1) Title
   - “UK/US R&D Tax Credit Changes — As of {YYYY-MM-DD} (Q{n} {YYYY})”
   - “Last checked: {timestamp with timezone}”

2) Executive Summary (120–180 words)
   - What changed at a glance.
   - Where impact is likely largest.
   - One-line note on proposals vs enacted.

3) Snapshot Comparison Table (UK vs US)
   - Columns: Jurisdiction | What changed | Effective from | Who is affected | Impact summary
   - Keep to 5–8 rows total (the most material items). Use concise phrasing. Include [#] citations in cells where claims are made.

4) United Kingdom — Details
   - Enacted changes
     - Bullet points: what changed, effective date(s), key thresholds/caps, filing/administration updates, anti-abuse/enforcement notes. Include [#] citations on each bullet.
   - Proposals and pending guidance
     - Clearly label status (e.g., “Bill introduced”, “Consultation outcome published”, “Draft guidance”). Include [#] citations.
   - Practical implications
     - 3–5 bullets for finance/tax teams (e.g., evidence, system changes, cash/tax timing).

5) United States (Federal) — Details
   - Enacted changes
     - Bullet points as above, with [#] citations.
   - Proposals and pending guidance
     - Clearly labeled status with [#] citations.
   - Practical implications
     - 3–5 bullets for finance/tax teams.

6) Action Checklist (RAG)
   - 5–8 items labeled R (urgent this quarter), A (plan), G (monitor), each 1 line.
   - Reference relevant sections with [#] if tied to a specific rule change.

7) Sources
   - Numbered list [1]..[n] with Title — Publisher — Date — URL.
   - Ensure links resolve and dates match what is quoted in the text.

8) Appendix (optional, if needed)
   - Key definitions that changed (e.g., qualifying expenditure categories).
   - Timeline of effective dates (≤10 lines).

# Instructions
- Be concise and unambiguous. Use neutral, professional tone.
- Do not speculate on likelihood of passage; state current status and official next steps if available.
- If conflicting sources exist, report the conflict and cite both; prefer the most recent official source.
- Exclude US state credits and non-R&D incentives.
- Avoid legal advice language beyond a brief “informational only” note at the end.
- Ensure every material claim has an inline [#] citation and that each [#] is listed once in Sources.

# Quality Bar
- Accuracy: All dates, thresholds, and statuses must match cited sources.
- Completeness: Cover both UK and US; include enacted and proposals; provide effective dates and who is affected.
- Clarity: Executive-ready summary; snapshot table; crisp bullets.
- Verifiability: Primary-source citations with working links.
- Brevity: Aim for 700–1,000 words for main sections (excluding tables, sources, and appendix).

# Deliverable
A single, self-contained briefing in plain text (no heavy formatting), following the structure above, ready to share with finance/tax stakeholders.
```

## E045 – Provide CIS Benchmark checks for Ubuntu in a numbered list of 8.

- **Domain:** Security
- **Expected template:** Standard-Lite
- **Best candidate ID:** E045_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Provide CIS Benchmark checks for Ubuntu in a numbered list of 8.

### Optimized prompt

```
# Task
Generate a concise, practitioner-ready list of CIS Benchmark checks for Ubuntu.

# Inputs
- Ubuntu version: default to "Ubuntu 22.04 LTS" unless a specific version is provided.
- CIS profile: default to "Level 1 - Server" unless otherwise specified.
- Count: exactly 8 checks.

# Instructions
- Select 8 high-impact, commonly applicable CIS Ubuntu Linux Benchmark checks aligned to the specified version and profile.
- For each check, include:
  - Title: a short, action-oriented control name.
  - Rationale: 1 brief sentence on why the control matters.
  - Check: a single, copy-pastable bash command to verify compliance (no placeholders).
  - Expected: the expected compliant state or output pattern.
- If you are not fully certain of an exact CIS control ID for the given Ubuntu version, do not guess or invent the ID; omit the ID and focus on accurate check content.
- Use commands that work on a fresh Ubuntu install (e.g., grep, awk, sysctl, systemctl, ufw/iptables, dpkg, apt, stat).
- Prefer Level 1 server-appropriate topics (e.g., password policy, SSH hardening, firewall defaults, unattended upgrades, auditing, file permissions).
- Do not include remediation steps, links, or external references—only verification checks and expected outcomes.
- Think step-by-step to ensure each command reliably validates compliance, but output only the final results as specified.

# Output format
- Provide a numbered list from 1 to 8.
- For each item, use exactly this structure (4 lines per item):
  - Title: <short control title>
  - Rationale: <one sentence>
  - Check: <single bash command>
  - Expected: <concise expected compliant state>
- Keep each item self-contained and ≤5 lines total. No extra commentary before or after the list.

# Constraints
- Exactly 8 items.
- Commands must be safe, read-only, and runnable without interactive prompts.
- Avoid placeholders like "<path>" or "<username>".
- Do not fabricate CIS control IDs or version-specific values.

# Quality checklist
- Each command actually verifies the stated control on Ubuntu (version-appropriate).
- The Expected field is unambiguous and testable.
- Terminology is consistent and accurate (SSH, PAM, auditd, ufw).
- No superfluous text; only the numbered list is returned.
```

## E046 – Generate a Dockerfile for a Node 20 app with pnpm. Code block only.

- **Domain:** Tech
- **Expected template:** Standard-Lite
- **Best candidate ID:** E046_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Generate a Dockerfile for a Node 20 app with pnpm. Code block only.

### Optimized prompt

```
# Task
Generate a production-ready Dockerfile for a Node.js 20 application that uses pnpm for package management.

# Deliverable
- Return exactly one fenced code block labeled dockerfile that contains the complete Dockerfile. Do not include any text before or after the code block.

# Instructions
- Implement a multi-stage build with three stages: deps, builder, runner.
- Base image: use the official Node 20 Alpine variant by default. Provide overridable build args for Node and pnpm versions.
- Enable Corepack and pin pnpm using corepack prepare so pnpm is available in all stages where needed.
- Optimize dependency caching:
  - Add the syntax directive for BuildKit features: docker/dockerfile:1.6.
  - In the deps stage, copy only package.json and pnpm-lock.yaml (and .npmrc/.pnpmfile.cjs if present) and run pnpm fetch with a mounted cache for the pnpm store.
  - In the builder stage, install with pnpm install --offline --frozen-lockfile using the fetched store.
- Build step:
  - Run pnpm run -if-present build so projects without a build script still succeed.
  - After building, run pnpm prune --prod to remove devDependencies.
- Runner stage:
  - Set NODE_ENV=production.
  - Create and use a non-root user.
  - Copy only what is needed to run: pruned node_modules, package.json, and built artifacts (e.g., dist if it exists). If no build artifacts exist, the container should still be able to run pnpm start.
  - Expose port 3000.
  - Default command: pnpm start.
- Keep the final image small and secure. Include concise comments in the Dockerfile.

# Defaults
- ARG NODE_VERSION=20
- ARG PNPM_VERSION=9.12.0
- Base image: node:${NODE_VERSION}-alpine
- Workdir: /app
- Use cache mounts for the pnpm store at /pnpm-store

# Output Format
- Output only the Dockerfile inside a single fenced code block with language dockerfile.
```

## E047 – Change management plan outline with RACI and communication matrix.

- **Domain:** Advisory
- **Expected template:** Standard-Full
- **Best candidate ID:** E047_prompt_2 (prompt_2)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Full, found Essential.

### User prompt

Change management plan outline with RACI and communication matrix.

### Optimized prompt

```markdown
You are a management consultant. Produce a concise, practical change management plan OUTLINE that includes a RACI and a communication matrix.

# Needs Input
What is the specific change (what system/process/org change), scope (who/where), timeline, and any preferred change framework (e.g., ADKAR, Kotter)?

If not provided, proceed with this assumption: a mid-sized organization is rolling out a new company-wide SaaS tool over 6 months across two regions; use ADKAR; stakeholders include executives, people managers, frontline staff, IT, HR, and Communications; no special regulatory constraints.

Objective
- Create an outline-level plan (not a full narrative) that a project team can flesh out.
- Emphasize clarity, roles, and sequencing across the change lifecycle.

Audience
- Project sponsors, change manager, PMO, workstream leads, HR, IT, and Communications.

Tone and style
- Professional, action-oriented, and concise.
- Use short sentences and bullet lists.
- Avoid filler text and generic platitudes.

Deliverables
1) Change management plan outline with clearly labeled sections (bulleted).
2) RACI matrix for key change activities.
3) Communication plan and communication matrix.

Context and assumptions
- Tailor the outline to the given Inputs; otherwise, use the assumption above.
- If a framework is provided, map plan elements to it; otherwise, map to ADKAR stages.

Required structure and sections
- Title: Change Management Plan Outline
- Summary
  - One-sentence change narrative and rationale.
  - Objectives and 3–5 success metrics (leading/lagging).
- Change definition and scope
  - What is changing, who is impacted, locations/regions, in/out of scope.
- Stakeholder and impact assessment
  - Key stakeholder groups, impact themes, high-level persona notes.
- Change governance and decision rights
  - Roles, forums/committees, cadence, escalation paths.
- Change approach mapped to framework
  - Awareness, Desire, Knowledge, Ability, Reinforcement (or given framework).
  - Key activities by phase.
- Training and enablement
  - Learning objectives, modalities, audience mapping, support model.
- Resistance and risk management
  - Anticipated resistance points, mitigation tactics, risk register themes.
- Timeline and milestones
  - Phase gates, major comms and training waves, go-live, hypercare.
- Measurement and sustainment
  - KPIs, feedback loops, adoption dashboards, reinforcement tactics.
- Appendices (outline level)
  - Glossary, templates to be developed, change readiness survey plan.

RACI matrix (required)
- Purpose: clarify accountability for key change activities across the lifecycle.
- Format: Provide as a simple markdown table; if tables aren’t supported, provide CSV with a header row.
- Columns (in order):
  - Activity
  - Sponsor
  - Change Manager
  - Project Manager
  - Workstream Lead(s)
  - HR
  - IT
  - Communications
  - Other (specify)
  - Notes
  - R/A/C/I per role (use standard RACI notation; only one Accountable per activity)
- Content requirements:
  - Include at least 12 activities spanning planning, design, build, testing, training, go-live, and reinforcement.
  - Ensure each activity has exactly one Accountable; avoid gaps and duplicates.
  - Use roles/titles, not individual names.

Communication plan and matrix (required)
- Brief narrative: comms objectives, key messages by audience, 2-way feedback approach.
- Communication matrix format: simple markdown table or CSV fallback.
- Columns (in order):
  - Audience segment
  - Key message
  - Channel (e.g., town hall, email, intranet, manager huddle, LMS, chat)
  - Sender (credible voice for that audience)
  - Owner (who drafts/sends)
  - Frequency/cadence
  - Timing/phase
  - Feedback mechanism (Q&A, survey, office hours)
  - Success metric (open rate, attendance, sentiment, adoption proxy)
- Content requirements:
  - At least 8 entries covering executives, people managers, frontline users, and support functions.
  - Include a mix of push and pull channels; show two-way mechanisms.
  - Map items to phases (e.g., pre-go-live, go-live, hypercare).

Constraints
- Length: aim for the total deliverable to fit ~2–4 pages equivalent when expanded, but provide only an outline with bullets here.
- No external links or citations.
- Use consistent role names across RACI and comms matrix.
- If information is missing, make reasonable, clearly labeled assumptions.

Quality checks before finalizing
- The outline includes all required sections above.
- RACI: ≥12 activities; exactly one Accountable per activity; no role column left entirely empty.
- Comms matrix: ≥8 entries; each has sender, owner, cadence, and metric.
- Terminology is consistent; phases map to the chosen framework.
- Output is clean, skimmable, and ready for team review.

Output format
- Provide the outline as bullets with clear section headers.
- Then provide the RACI matrix and the communication matrix (markdown tables or CSV fallback).
```

## E048 – Give SQL to compute trailing-12 revenue by customer (Postgres).

- **Domain:** Finance
- **Expected template:** Standard-Lite
- **Best candidate ID:** E048_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** Template detection mismatch: expected Standard-Lite, found Essential.

### User prompt

Give SQL to compute trailing-12 revenue by customer (Postgres).

### Optimized prompt

```markdown
# Task
Generate PostgreSQL SQL that computes trailing-12-month (TTM) revenue by customer.

# Context
- Objective: For each customer, return revenue aggregated over the trailing 12 months as of a specified as_of_date.
- Assumptions (override if user schema differs):
  - Fact table: transactions
    - customer_id (UUID or INT)
    - occurred_at (TIMESTAMP WITH TIME ZONE)
    - amount (NUMERIC) — positive for charges, negative for refunds/credits
    - status (TEXT) — only count rows where status IN ('paid','settled','completed')
  - Dimension table: customers
    - customer_id (UUID or INT, PK)
- Business rules:
  - Include refunds/credits (negative amounts) in the sum.
  - A 12-month trailing window includes the day 12 months prior up to and including as_of_date.
  - If a customer has no transactions in the window, return 0.
  - As-of date:
    - If a parameter :as_of_date is provided, use it.
    - Otherwise default to the max(occurred_at) present in transactions.
- Performance guidance:
  - Pre-aggregate to daily (or monthly) granularity before applying 12-month windows.
  - Ensure indexes exist on transactions(customer_id, occurred_at) and transactions(status, occurred_at).
- Output shape:
  - One row per customer.
  - Columns:
    - customer_id
    - as_of_date (DATE)
    - ttm_revenue (NUMERIC)
    - window_start (DATE) — as_of_date minus 12 months, inclusive
    - window_end (DATE) — as_of_date, inclusive

# Instructions
- Produce two SQL solutions:
  1) Month-granular TTM: Aggregate revenue to month-level per customer, then compute a 12-month rolling sum (rows between 11 preceding and current row). This is robust and performant for large datasets.
  2) Day-precision TTM: Compute exact trailing-12-month revenue relative to as_of_date using an approach that scales (e.g., pre-aggregate daily, then sum a 365/366-day window via a self-join or window frame supported in Postgres). Avoid naive correlated subqueries that scan 12 months per row without pre-aggregation.
- Both solutions must:
  - Accept an optional :as_of_date parameter. If null, default to max(occurred_at).
  - Return all customers, including those with zero revenue in the window (left join from customers).
  - Filter to status IN ('paid','settled','completed').
  - Use safe date arithmetic for the 12-month window boundaries.
  - Include brief inline comments explaining each CTE or step.
- Add optional enhancements:
  - Include a WHERE customer_id IN (:customer_ids) predicate that activates only if the array is provided (otherwise ignored).
  - Show recommended indexes (CREATE INDEX statements) commented out.

# Deliverables
- SQL Variant A: Month-granular TTM (with generate_series or month skeleton to ensure months with zero revenue and a 12-month rolling window).
- SQL Variant B: Day-precision TTM (with daily pre-aggregation and a performant rolling window).
- Each variant should be a single, runnable SQL script using CTEs, ending with a SELECT that returns the required output shape.
- A short Notes section (3–5 bullets) summarizing trade-offs between the two variants.

# Constraints
- Target: PostgreSQL 13+ features.
- Do not use stored procedures, temp tables, or extensions.
- Keep each script under ~120 lines with clear, legible formatting.

# Example Output Schema (final SELECT)
- customer_id
- as_of_date
- window_start
- window_end
- ttm_revenue

# Validation
- Include a quick validation query or comment showing how to verify one customer’s TTM ties to the sum of their detailed rows in the window.
```

## E049 – Policy research: compare state pay transparency laws (links, dates).

- **Domain:** Legal
- **Expected template:** Research
- **Best candidate ID:** E049_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 5
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Policy research: compare state pay transparency laws (links, dates).

### Optimized prompt

```markdown
# Title
Policy Research Prompt: Compare United States State Pay Transparency Laws (with links and dates)

# Goal
Produce an accurate, current, and concise comparative view of state-level pay transparency laws across the United States, with explicit links to primary sources and authoritative guidance and clear effective/last-amended dates.

# Scope
- Jurisdictions: All 50 U.S. states plus the District of Columbia.
- Focus: Statewide pay transparency statutes and regulations governing disclosure of salary/pay ranges and related compensation information.
- Include: States with enacted laws, states with no statewide law, and a short separate note on high-impact local ordinances that materially affect multi-state employers (e.g., New York City).
- Exclude: Non-U.S. jurisdictions; deep case law analysis. Mention pending bills only if they have passed and are awaiting an effective date.

# Deliverables
1) Comparison Table (Markdown + CSV)
   - A single comprehensive table summarizing each state/DC.
   - Also output the same rows as a CSV code block using the provided schema.

2) Executive Summary (≤200 words)
   - Key patterns, major differences, and notable recent changes (last 12 months).
   - Identify states with the strictest coverage and highest penalties.

3) Local Ordinances Note (≤100 words)
   - Briefly list major localities with pay transparency rules that significantly impact employers (e.g., NYC), with one authoritative link each.

# Data Schema (columns and definitions)
- Jurisdiction: State or DC name.
- Status: Enacted | No statewide law | Repealed/Expired.
- Law citation: Short citation (e.g., “CO: C.R.S. § 8-5-201 et seq.”).
- Primary source URL: Direct link to statute/regulation text or official code.
- Official guidance URL: State labor/agency guidance page, if available.
- Employer coverage: Thresholds or applicability (e.g., “≥15 employees,” “any size”).
- Trigger: When disclosure is required (e.g., job posting, upon applicant request, promotion/transfer).
- Content required: What must be disclosed (e.g., salary range, benefits, job description).
- Remote roles applicability: Whether out-of-state/remote postings targeted to residents are covered.
- Effective date(s): Original effective date and any staged effective dates if applicable.
- Last amended date: Most recent amendment’s effective date or “N/A” if none known.
- Enforcement/penalties: Enforcement authority and penalty ranges, if specified.
- Notes: Brief nuances (e.g., exemptions, recordkeeping, anti-retaliation).

# Research Instructions
- Prioritize primary sources (state statutes, administrative codes) and official agency guidance. Supplement with reputable secondary sources only for synthesis or context.
- For each jurisdiction with an enacted law, populate all schema fields. If a field is not addressed in authoritative sources, enter “Unspecified in statute/guidance” and note uncertainty.
- For jurisdictions without a statewide law, set Status to “No statewide law,” include a reputable statewide confirmation link (e.g., state labor agency stance or a current, reputable legal tracker), and keep other fields minimal.
- Capture dates precisely:
  - Effective date(s): Provide the date the law (or relevant section) took effect.
  - Last amended date: Provide the effective date of the most recent substantive amendment; if unclear, provide the latest known amendment date and mark “verify.”
  - Last verified: Include a “Last verified (UTC)” line at the end of the deliverable using today’s date.
- If sources conflict, resolve by:
  1) Preferring official statute/regulation text and agency guidance over secondary summaries.
  2) Checking legislative history or session laws for amendments.
  3) Marking discrepancies in Notes with “conflict—see sources.”

# Sources and Citation Requirements
- Link types:
  - Primary source URL: Direct to official statute/regulation (state legislature site, official code publisher).
  - Official guidance URL: State labor department or equivalent.
  - Secondary sources: Only from reputable firms/orgs (e.g., large law firms’ client alerts, SHRM, state bar associations), used sparingly.
- Provide a live, clickable URL for each link field.
- Avoid dead links and paywalled sources when a free official source exists.

# Method (step-by-step)
1) Enumerate jurisdictions and draft initial rows from authoritative summaries.
2) For each “Enacted” jurisdiction, retrieve statute/regulation and official guidance; extract coverage, triggers, content, remote applicability, penalties, dates.
3) Validate dates by cross-checking legislative history or agency updates.
4) Compile the table and CSV; perform a second pass to fill gaps or mark “verify.”
5) Write the executive summary and local ordinances note, referencing the compiled table.

# Formatting
- Output order: Executive Summary, Comparison Table (Markdown), CSV (code block), Local Ordinances Note, Sources List, Last verified (UTC: YYYY-MM-DD).
- Keep table cells concise (≤25 words per cell). Use semicolons for multiple items.
- Use sentence case; avoid abbreviations without first mention (e.g., “Department of Labor (DOL)”).
- For CSV: include a header row with the exact column names from the Data Schema.

# Quality Bar
- Completeness: Every jurisdiction present; all enacted jurisdictions have both primary source and effective date.
- Accuracy: No contradictions with primary sources; penalties/dates double-checked.
- Currency: Reflect the latest public information as of today.
- Clarity: Non-legal audience can understand differences at a glance.

# Assumptions and Constraints
- If official guidance is absent, rely on statute/regulation text and note “No official guidance published.”
- If a law is enacted but not yet effective, set Status to “Enacted,” include future effective date in Effective date(s), and note implications in Notes.
- Timebox per state if needed; prioritize accuracy over exhaustive commentary.

# Optional Enhancements (include if time allows)
- Add a short “Change log (last 12 months)” noting states with new enactments or major amendments.
- Add a “Compliance checklist” of common employer actions that are widely applicable.

# Final Checks
- Run a link check to ensure all URLs resolve.
- Ensure dates are in ISO format (YYYY-MM-DD).
- Ensure CSV matches the table values exactly.

```

## E050 – Turn this list into CSV (header: item,qty,price).

- **Domain:** Casual
- **Expected template:** Essential
- **Best candidate ID:** E050_prompt_1 (prompt_1)
- **Scores:** overall 4 / 5; role 5, template/length 3, clarity/brevity 2, constraint alignment 4, output spec 4, tone/style 3
- **Strengths:** Maintains instruction-only stance.
- **Issues:** No critical issues detected; consider minor polish if needed.

### User prompt

Turn this list into CSV (header: item,qty,price).

### Optimized prompt

```
# Task
Convert a free-form list of items into a clean CSV with header: item,qty,price.

# Inputs
- Source text: Use the content under "# Source Text" as the only input.

# Output
- Produce only CSV text.
- First line must be exactly: item,qty,price
- Use comma as the separator.
- Quote the item field only when it contains a comma, double quote, or leading/trailing spaces. Escape double quotes by doubling them.
- Do not include comments or extra lines before/after the CSV.

# Instructions
1. Parse rows
  - Treat each non-empty line in the source as a potential item entry.
  - Ignore purely decorative bullets, dashes, or numbering.
2. Map fields
  - item: The item name, cleaned of unit markers unless part of the name (e.g., "bananas", "olive oil").
  - qty: An integer quantity.
    - If a clear quantity is present (e.g., "2", "x3", "3x", "3 @", "2 packs"), set qty accordingly.
    - If quantities are written as words ("two", "five"), convert to numerals.
    - If a range ("2-3"), use the lower bound.
    - If no quantity is present, default to 1.
  - price: A numeric unit price with two decimal places.
    - If a currency symbol is present (e.g., "$", "£", "€"), strip the symbol and keep the numeric value.
    - If a format like "2 x $3", "3 @ 2.50", or "2 for $5" appears:
      - qty = 2 and price = 3.00 for "2 x $3" and "3 @ 2.50" (unit price).
      - For "2 for $5", set qty = 2 and price = 2.50 (compute unit price).
    - If "per unit" pricing is given (e.g., "$1.20/lb" or "$1.20 each"):
      - If a numeric quantity exists (e.g., "2 lb apples @ $1.20/lb"), set qty = 2 and price = 1.20.
      - If no numeric quantity is present, set qty = 1 and price = 1.20.
    - Remove thousands separators and normalize decimal to a dot. Always format price with two decimals.
    - If no price is given, leave price blank (i.e., end the row with a trailing comma after qty).
3. Normalization rules
  - Preserve original item casing except for trimming spaces.
  - Remove unit suffixes that are clearly not part of the product name (e.g., "kg", "lb", "pack", "bottle", "ct", "pcs") unless the unit is essential to distinguish products (e.g., "AA batteries", "USB-C cable").
  - Remove inline notes in parentheses unless they are part of the product identity; if removed, keep essential descriptors (e.g., "organic", "gluten-free").
4. Validation
  - Ensure each CSV row has exactly three fields.
  - qty must be a positive integer; if not inferable, default to 1.
  - price must be either empty or a valid number with two decimals.
5. Edge cases
  - If a line contains multiple items separated by commas or "and", split into separate rows when clearly distinct products.
  - If the line includes a total cost or subtotal not tied to a single item, ignore it.
  - If conflicting signals appear (e.g., "2 x $3 each, total $8"), prefer unit interpretation: qty=2, price=3.00.
6. Output only the final CSV. Do not include explanations.

# Example
- Input line: "Bananas x3 @ $0.49 each"
  - Output row: Bananas,3,0.49
- Input line: "2 for $5 — Energy Drinks"
  - Output row: Energy Drinks,2,2.50
- Input line: "Olive Oil (extra virgin) - 1L $12.99"
  - Output row: Olive Oil,1,12.99

# Source Text
[PASTE THE LIST HERE]
```

