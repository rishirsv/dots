1. **Answer**

Your current five-layer framing is close, but it’s not sufficient to hit your “as close as possible” target while staying controllable and auditable. The missing piece is a first-class “evidence + provenance layer” that is structurally integrated into planning, drafting, and QC, plus a first-class “exemplar retrieval + structural skeleton layer” that explicitly selects (and then enforces) the historical structure you want to imitate.

My recommendation is a constrained generation system that treats the corpus as a “style/structure reference library” (validated as verbatim) and uses your existing section templates/playbooks as the deterministic backbone. The model should not be asked to “write a section” from scratch. Instead, it should (1) generate a structured plan in a strict schema, (2) fill parameterized templates (with explicit evidence/basis per claim), (3) run automated QC and a self-critique pass against explicit writing and defensibility rules, and (4) fail safely by converting missing inputs into prioritized missing information instead of inventing content.

The key architectural move is to separate “what to say” (facts/adjustments/risks/missing information with provenance) from “how to say it” (style contract + structural skeleton + section playbook + template). This lets you push similarity high without sacrificing auditability.

You already have the right foundations in-repo: (a) a deterministic, validated section corpus (23 reports) (context/docs/report-mining/section-corpus/README.md:L15-L41; context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L3-L36), (b) canonical report structure + aliasing (context/skill/kpmg-fdd/references/report-structure.md:L37-L58), (c) writing defensibility standards with explicit “facts vs judgments” and “basis line” requirements (context/skill/kpmg-fdd/references/writing-standards.md:L21-L46), (d) section templates for consistent structure (e.g., context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L6-L34), (e) playbooks for the three core quantitative workstreams (QoE/WC/Net debt) (context/skill/kpmg-fdd/references/analysis-playbooks/qoe-playbook.md:L8-L36; context/skill/kpmg-fdd/references/analysis-playbooks/working-capital-playbook.md:L8-L33; context/skill/kpmg-fdd/references/analysis-playbooks/net-debt-playbook.md:L8-L33), and (f) QC checklists and deterministic scripts (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16; context/skill/kpmg-fdd/scripts/check_report_structure.py:L9-L15).

The blueprint below operationalizes these assets into a complete section-writing system optimized for practical diligence use: deterministic where it matters (structure, exhibit hygiene, basis discipline, definitions), model-driven where it adds real value (narrative synthesis, defensible phrasing, risk articulation), and continuously evaluated against fidelity + grounding metrics.

2. **Key Points**

- Treat historical sections as _structure/style constraints_, not just inspiration. Select a skeleton (headings, bullet cadence, bridge framing), then enforce it in templates and QC. The corpus is explicitly designed to preserve verbatim text and is validated with zero failures across ~6k checks (context/docs/report-mining/section-corpus/README.md:L3-L26; context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L3-L8).

- Add two layers to your “five layers”:
  (a) an Evidence & Provenance Ledger (every claim/number must trace to a source/basis or become an open item; consistent with writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L38-L46; context/skill/kpmg-fdd/SKILL.md:L69-L73), and
  (b) an Exemplar & Skeleton Selector (systematically pick the closest historical structure by section/industry/report-type using the corpus index + embeddings + rule filters).

- Make the model plan before it drafts, and make the plan machine-readable. Your workflow already emphasizes an outline/evidence plan step to make drafting deterministic (context/skill/kpmg-fdd/references/workflow.md:L37-L48). Turn that into a required JSON plan artifact that later stages must obey.

- Lock the “shape” (headings/subheadings + exhibit slots + basis requirements). Keep the “surface” (phrasing, sentence rhythm, risk wording) flexible but bounded by the style contract and exemplar snippets.

- QA has to be operational gates, not just “evaluation”: enforce pass/fail thresholds per section for structure, basis coverage, tie-outs, and placeholder leakage (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16; context/skill/kpmg-fdd/scripts/check_report_structure.py:L9-L13).

3. **Recommended Next Steps**

1) Compile the corpus into a structured dataset and add a skeleton extractor. Use the existing corpus entry format (the validator’s ENTRY_RE is a ready-made parser spec) (context/docs/report-mining/section-corpus/scripts/validate_section_corpus.py:L15-L25).

2) Define a single canonical “SectionPlan” schema and require every generation run to output it first (before drafting). Base required elements on writing standards (“what we observed / implies / recommend” plus basis discipline) (context/skill/kpmg-fdd/references/writing-standards.md:L21-L27; context/skill/kpmg-fdd/references/writing-standards.md:L38-L46).

3) Convert the existing markdown section templates into parameterized templates (keep current structure, but formalize slots and required fields). Start with the eight required sections; use the report template’s numbering and expected sections as the top-level contract (context/skill/kpmg-fdd/assets/report-template.md:L13-L85; context/skill/kpmg-fdd/references/report-structure.md:L94-L189).

4) Build a “basis enforcement” linter: every quantitative claim must have an explicit basis/source line or be demoted into an open item (writing standards + QC checklist explicitly require this) (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46; context/skill/kpmg-fdd/references/qc-checklist.md:L9-L16).

5) Implement the orchestration pipeline section-by-section in the canonical drafting order (workflow step 3) (context/skill/kpmg-fdd/references/workflow.md:L51-L64), then add cross-section consistency passes (units, periods, definitions) (context/skill/kpmg-fdd/references/writing-standards.md:L55-L63).

6) Stand up evaluation gates that mirror real diligence QC: structure, bridge tie-out, basis coverage, placeholder leakage, and risk/open item completeness (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L49).

4. **Detailed Blueprint**

1) **Executive recommendation**

Strategic direction
Build a constrained, exemplar-conditioned FDD writing system with three core principles:

A. Structure is deterministic; language is optimized.
The final report shape should be produced by a deterministic “compiler” that combines: canonical structure (report-structure.md), section templates, and a selected historical skeleton per section. Your current repo already codifies canonical section order, aliases, and minimum content (context/skill/kpmg-fdd/references/report-structure.md:L37-L58; context/skill/kpmg-fdd/references/report-structure.md:L94-L189) and provides a report template with numbering and exhibit scaffolding (context/skill/kpmg-fdd/assets/report-template.md:L13-L60). Use these as the locked backbone. The model’s job is then to produce defensible narrative content within those constraints.

B. Evidence is a first-class artifact, not an instruction.
Writing standards explicitly require basis lines for material quantitative claims and prohibit inventing numbers (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46; context/skill/kpmg-fdd/SKILL.md:L69-L73). QC rules reinforce this as “do not deliver if” (context/skill/kpmg-fdd/references/qc-checklist.md:L9-L16). Therefore, the system must have an explicit Evidence Ledger that every paragraph, bullet, adjustment, and exhibit references. This turns “defensibility” from a prompt wish into a measurable constraint.

C. Fidelity is achieved by selecting and enforcing historical skeletons, not by hoping the model imitates.
You have a validated verbatim corpus with 23 entries per canonical section and adjustment libraries (context/docs/report-mining/section-corpus/README.md:L15-L41; context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L14-L36). Treat this corpus as a “style and structure prior.” For each section, select a best-fit exemplar skeleton based on metadata (industry, report type signals) plus semantic similarity; then enforce that skeleton (headings, subheadings, bullet density, adjustment grouping pattern) in the generated output.

Is the current five-layer framing sufficient?
Not as-is. It’s missing two foundational layers that should not be “subsumed” because they are the control and audit levers:

- Add a dedicated Evidence & Provenance layer between “templates” and “prompt/workflow.” This layer implements basis discipline, claim tracing, uncertainty tagging, and open-item generation as data structures and lint rules, not just prompt instructions. This is directly required by writing standards and QC (context/skill/kpmg-fdd/references/writing-standards.md:L38-L46; context/skill/kpmg-fdd/references/qc-checklist.md:L9-L16).

- Add a dedicated Exemplar Retrieval & Skeleton Enforcement layer (either separate or explicitly inside the workflow architecture). Without this, you will drift away from “high similarity in structure and sequencing,” because templates alone are generic and the corpus shows real variance in section framing and internal subheadings (e.g., historical performance typically uses “Overview” and “Key Drivers” subheadings) (context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L16-L26).

Updated architecture (“seven layers”)

1. Global Style & Structure Contract (target invariants + allowable variation)
2. Corpus Index + Exemplar Retrieval + Skeleton Library (historical structures distilled)
3. Evidence & Provenance Ledger (facts, numbers, sources, assumptions, uncertainties)
4. Section Playbooks (objectives, required substructure, evidence requirements, failure modes)
5. Parameterized Templates (rendering rules + slot constraints + industry overlays)
6. Prompting & Orchestration Pipeline (plan → draft → critique → QC → finalize)
7. Evaluation & QA Gates (metrics + deterministic checks + human workflow integration)

This is an “upgrade” of your five layers rather than a replacement: your five are still present, but (2) and (3) become explicit and non-negotiable because they enable controllability and auditability.

2. **Deep section-system analysis**

Below, each section’s guidance is grounded in: canonical objectives/minimum content (context/skill/kpmg-fdd/references/report-structure.md:L94-L189), section templates, writing standards, and observed corpus patterns.

A note on “locking” vs “flexing”
Lock: headings, required exhibits, basis/source discipline, adjustment table schemas, and “no unsupported quant.”
Flex: phrasing, length, level of detail, and industry-specific KPI/risk modules—within the chosen skeleton variant.

2.1 Executive summary

Canonical objective
“Give the decision-maker the ‘so what’ quickly” with deal context, key conclusions, risks/mitigants, and missing information (context/skill/kpmg-fdd/references/report-structure.md:L96-L104; context/skill/kpmg-fdd/references/section-templates/executive-summary.md:L3-L25).

Required substructure (system-locked)

- Deal and scope at a glance
- Key conclusions by workstream (QoE, WC, Net debt when in scope)
- Top risks and mitigants (ranked)
- Missing information that could move conclusions (prioritized)

This mirrors the template’s recommended structure (context/skill/kpmg-fdd/references/section-templates/executive-summary.md:L8-L25) and the report template’s “Key conclusions / risks / missing information” layout (context/skill/kpmg-fdd/assets/report-template.md:L13-L27).

Common narrative patterns (corpus)

- Bullet-dominant: many exec summaries are essentially condensed findings bullets and an “information used” list (e.g., project-ascend includes a “Key sources of information used…” list) (context/docs/report-mining/section-corpus/sections/executive-summary.md:L41-L46).
- Explicit caveat language: “proposed adjustments are not necessarily all-inclusive…” appears in at least some summaries (context/docs/report-mining/section-corpus/sections/executive-summary.md:L61-L66).
- Scope framing: the corpus often explicitly lists what was reviewed (audited FS, trial balance, management schedules) (context/docs/report-mining/section-corpus/sections/executive-summary.md:L41-L46).

Common failure modes

- Purely descriptive summary with no findings (explicitly called out as a pitfall) (context/skill/kpmg-fdd/references/section-templates/executive-summary.md:L30-L32; context/skill/kpmg-fdd/references/qc-checklist.md:L9-L10).
- Missing missing information list (template pitfall; QC “do not deliver”) (context/skill/kpmg-fdd/references/section-templates/executive-summary.md:L31-L32; context/skill/kpmg-fdd/references/qc-checklist.md:L9-L16).
- Overconfident tone without uncertainty labels (violates writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L13-L20).

Minimum evidence requirements

- Periods covered and scope must be explicit (report template fields) (context/skill/kpmg-fdd/assets/report-template.md:L6-L9).
- For each key conclusion with numbers: basis/source line (writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46).
- If bridge values not available, state as open item rather than inventing (context/skill/kpmg-fdd/SKILL.md:L69-L73).

Variation by industry

- Financial services / regulated industries: exec summary frequently includes “data reviewed / audit opinion” style signals (see long “Key Findings” sections in corpus risk examples for coffee/education) (context/docs/report-mining/section-corpus/sections/risks-and-red-flags.md:L86-L110).
- Asset-heavy sectors may emphasize net debt and capex in key conclusions; SaaS-like may emphasize deferred revenue and revenue recognition (pattern visible in QoE entries like franchise fee deferral / deferred revenue) (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L140-L142).

What to lock vs keep flexible
Lock: 4-block structure, priority labeling (P0/P1/P2), basis discipline, and “no unsupported quant.”
Flexible: whether the “information used” list is included as bullets vs embedded in basis lines; exact number of bullets (3–7 typical risks per template) (context/skill/kpmg-fdd/references/section-templates/executive-summary.md:L19-L20).

2.2 Business overview

Canonical objective
Explain what the company does and what drives performance: business model, revenue streams, customers/go-to-market, KPIs, what changed (context/skill/kpmg-fdd/references/report-structure.md:L107-L115).

Required substructure
The template structure is strong and should be locked as the default:

- Business model
- Customers and go-to-market
- Operating model
- Recent changes and context for financial trends
  (context/skill/kpmg-fdd/references/section-templates/business-overview.md:L8-L25)

Common narrative patterns (corpus)

- Bulleted factual profile: entity description, locations, revenue streams, customer types. Example: project-ascend lists “Provides staffing services… 10 offices… brands… revenue streams…” in short bullets (context/docs/report-mining/section-corpus/sections/business-overview.md:L16-L27).
- Segmentation tables are often referenced, sometimes with “See Table below” in text (context/docs/report-mining/section-corpus/sections/business-overview.md:L26-L31).
- Banking/financial services examples include regulatory and entity-structure details, and often break down revenue sources more formally (context/docs/report-mining/section-corpus/sections/business-overview.md:L72-L114).

Common failure modes

- Generic fluff with no mechanisms (“what drives performance”)—violates the template’s intent and the writing standards “be specific” guidance (context/skill/kpmg-fdd/references/writing-standards.md:L13-L16).
- Asserting customer concentration/contract terms without evidence (explicit “only if known/evidenced” in template) (context/skill/kpmg-fdd/references/section-templates/business-overview.md:L14-L17).
- Missing “recent changes” framing; then later P&L narrative feels unexplained.

Minimum evidence requirements

- At least one: product/service list, revenue stream definitions, and customer/go-to-market description sourced to management deck/VDR doc or notes (basis line if quantified).
- Any KPI (volumes, users, retention) must include definition + period + source (writing standards; exhibits guidance) (context/skill/kpmg-fdd/references/writing-standards.md:L28-L31).

Variation by industry
Use an “industry overlay KPI module” to add:

- Healthcare staffing: clinician count, bill rate vs pay rate spread, fill rates.
- Banking/lending: NIM, AUM, loan book composition, credit loss metrics.
- Retail/F&B: store count, same-store sales, ticket size.
  (These specifics are not enumerated as a catalog in the repo; implement overlays as optional modules so you don’t hallucinate if absent. The overlay mechanism is the recommendation; content must only be populated when evidenced.)

What to lock vs keep flexible
Lock: the four sub-blocks and the “only if evidenced” rule for contract/concentration.
Flexible: bullet vs short paragraphs (corpus is bullet heavy); include an “information sources reviewed” sub-bullet list when needed (mirrors executive summary behavior).

2.3 Historical / financial performance

Canonical objective
Summarize historical performance and drivers: revenue, gross profit, EBITDA trends; margin drivers/volatility; seasonality/concentration if evidenced (context/skill/kpmg-fdd/references/report-structure.md:L118-L125). The P&L overview template explicitly positions this as “set up the QoE normalization” (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L3-L15).

Required substructure
Lock three blocks from template:

- Historical performance summary
- Key drivers
- Data quality notes
  (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L8-L20)

Corpus-derived structural pattern to enforce
The corpus frequently uses internal subheadings “## Overview” followed by “## Key Drivers” (e.g., project-ascend and project-autobahn) (context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L16-L26; context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L87-L91). This is a strong candidate for a default skeleton variant:

- “Overview” = period summary + topline/margin trend + major events
- “Key Drivers” = drivers by revenue/cost, with explicit evidence labels

Common narrative patterns

- Quantified trend sentences with explicit period endpoints (“revenue increased from FY15 to FY17…”, “EBITDA margin increased…”) (context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L16-L24).
- Bridge-language that points forward to QoE: some sections explicitly link performance changes to adjustments or normalization considerations.
- “If evidence not available” disclaimers: template says do not assert drivers without evidence (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L26-L28), and QoE playbook reinforces “list as open item rather than asserting” (context/skill/kpmg-fdd/references/analysis-playbooks/qoe-playbook.md:L20-L23).

Common failure modes

- “Mix drove growth” without a mix exhibit (template’s “do not do” list) (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L26-L28).
- Mixed periods with no labeling (FY vs LTM) (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L28-L28; context/skill/kpmg-fdd/references/writing-standards.md:L57-L63).
- Not clarifying audited vs management reporting (template “data quality notes”) (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L17-L20).

Minimum evidence requirements

- A summary P&L table (exhibits guidance prefers tables for exact values and auditability) (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L7-L10; context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L21-L24).
- Source/basis with periods and units (exhibits minimums) (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27).

Variation by industry

- Seasonal businesses: stronger emphasis on monthly/quarterly trends; if not available, explicit caveat.
- Project-based services: focus on utilization, backlog, pricing, and gross margin mix.
  Implement this via optional modules that activate only when evidence exists.

What to lock vs keep flexible
Lock: “Overview / Key Drivers / Data quality notes” ordering; exhibit requirement; explicit period labeling; “only if evidenced.”
Flexible: amount of narrative detail; whether to include margin bridge table (only when drivers are clear).

2.4 QoE and earnings adjustments

Canonical objective
Reconcile reported earnings to normalized earnings with a clear bridge, evidence per adjustment, commentary on recurrence/sustainability, and missing information (context/skill/kpmg-fdd/references/report-structure.md:L128-L136). This is aligned with the QoE template and playbook (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L34; context/skill/kpmg-fdd/references/analysis-playbooks/qoe-playbook.md:L15-L36).

Required substructure (locked)
A. Overview (purpose + EBITDA definition + period)
B. Reported → adjusted bridge exhibit (table)
C. Adjustment rationale grouped by type
D. Sensitivities/missing information

Exhibit discipline is explicitly required: bridge table is the primary exhibit; include per-adjustment basis and recurrence labeling (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L20; context/skill/kpmg-fdd/references/exhibits-and-tables.md:L41-L51). QC “do not deliver” includes missing bridge or bridge not summing (context/skill/kpmg-fdd/references/qc-checklist.md:L9-L12; context/skill/kpmg-fdd/references/qc-checklist.md:L20-L27).

Common narrative patterns (corpus)

- The section often begins with a purpose statement and points to an adjacent table/exhibit for the bridge (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L16-L31).
- Adjustments are explicitly categorized (management adjustments, potential adjustments, pro forma adjustments, other considerations) and labeled as non-recurring/non-operational/run-rate. Example in project-autobahn outlines these groupings (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L90-L105).
- Explicit caveat language: “not necessarily all-inclusive… additional factors may exist…” appears (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L56-L59).

Common failure modes

- Adjustments without basis or without defensible rationale (“what/why/how/residual risk”) (writing standards explicitly enumerate this) (context/skill/kpmg-fdd/references/writing-standards.md:L47-L54).
- Calling items “non-recurring” without rationale (template pitfalls) (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L39-L42).
- Mixing EBITDA definitions across exhibits without noting (template pitfalls; writing standards) (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L42-L42; context/skill/kpmg-fdd/references/writing-standards.md:L55-L63).
- Including numbers with no basis (QC “do not deliver”) (context/skill/kpmg-fdd/references/qc-checklist.md:L11-L13).

Minimum evidence requirements

- Adjustment schedule or underlying GL/TB support for each material adjustment.
- Basis line required for material quantitative claim (writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46).
- If evidence absent, do not invent: create open item (context/skill/kpmg-fdd/SKILL.md:L69-L73).

Variation by industry
Use an adjustment taxonomy with optional industry “common adjustment hints” drawn from the adjustment library (examples include owner comp/personal expenses, transaction expenses, audit fee normalization, revenue cut-off accruals) (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L19-L43). The key is: these are hints for what to look for; the system must not assert them unless evidenced.

What to lock vs keep flexible
Lock: bridge table schema, adjustment grouping, per-adjustment rationale structure, and missing information list.
Flexible: category names (but map to canonical taxonomy internally), narrative length, whether to include “other considerations” subheading.

2.5 Working capital

Canonical objective
Assess normalized WC and peg implications; define WC; normalize vs actual; seasonality/volatility commentary if evidenced; missing information (context/skill/kpmg-fdd/references/report-structure.md:L139-L147). This aligns to WC template and playbook (context/skill/kpmg-fdd/references/section-templates/working-capital.md:L8-L29; context/skill/kpmg-fdd/references/analysis-playbooks/working-capital-playbook.md:L15-L33).

Required substructure (locked)
A. Overview (purpose + definition + period)
B. Working capital definition table (included/excluded + rationale)
C. Historical behavior (trend/seasonality; caveats if only snapshots)
D. Normalized vs actual (estimate/range or explicit blockers)
E. Implications (peg sensitivity + close-date considerations)
F. Missing information

The exhibits playbook explicitly recommends starting with a definition table and then normalization exhibit (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L52-L60).

Common narrative patterns (corpus)

- A formal purpose statement: “The purpose of this section is to provide analysis of net working capital…” (context/docs/report-mining/section-corpus/sections/working-capital.md:L16-L20).
- Immediately defines what is included in NWC and references adjustment table/exhibit for details (context/docs/report-mining/section-corpus/sections/working-capital.md:L18-L24).
- Explicit “not all-inclusive” caveat and “may be additional factors” style statements appear (context/docs/report-mining/section-corpus/sections/working-capital.md:L50-L54).
- If only year-end balance sheets exist, some reports explicitly note this limitation and how monthly build-up was approximated (visible as a risk/finding in risks section for ascend) (context/docs/report-mining/section-corpus/sections/risks-and-red-flags.md:L16-L18).

Common failure modes

- Presenting a single point estimate without seasonality caveat (template pitfall) (context/skill/kpmg-fdd/references/section-templates/working-capital.md:L34-L36).
- Unclear WC definition or inconsistent with exhibit (playbook tie-out requirement) (context/skill/kpmg-fdd/references/analysis-playbooks/working-capital-playbook.md:L16-L28).
- Missing peg implications entirely (objective requires implications) (context/skill/kpmg-fdd/references/report-structure.md:L139-L147).

Minimum evidence requirements

- WC definition and account mapping (basis: management schedule, TB accounts).
- Trend data (monthly/quarterly preferred) or explicit caveat and open item if missing (context/skill/kpmg-fdd/references/analysis-playbooks/working-capital-playbook.md:L19-L25).
- Any quantitative peg sensitivity requires basis or becomes qualitative/open item (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46).

Variation by industry

- SaaS/subscription: deferred revenue is often a major WC driver; include explicit treatment if applicable (playbook lists deferred revenue detail as an input) (context/skill/kpmg-fdd/references/analysis-playbooks/working-capital-playbook.md:L8-L14).
- Inventory-heavy: inventory detail becomes critical; if absent, open item and caveat.

What to lock vs keep flexible
Lock: definition table, explicit caveats, implication section, missing information.
Flexible: whether to include separate AR/AP/inventory submodules (triggered by evidence availability and industry overlay).

2.6 Net debt and debt-like items

Canonical objective
Identify net debt and debt-like items relevant to purchase price; debt schedule summary; list of debt-like reviewed items and conclusions; cut-off considerations; missing information (context/skill/kpmg-fdd/references/report-structure.md:L150-L158). This aligns to net debt template and playbook (context/skill/kpmg-fdd/references/section-templates/net-debt.md:L8-L22; context/skill/kpmg-fdd/references/analysis-playbooks/net-debt-playbook.md:L15-L33).

Required substructure (locked)
A. Overview (definition + scope)
B. Debt schedule exhibit
C. Cash considerations (restricted vs unrestricted; cut-off)
D. Debt-like items checklist + conclusions table
E. Key risks/missing information

Exhibits guidance requires a schedule and separately listing debt-like items reviewed (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L61-L66).

Common narrative patterns (corpus)

- Purpose statement: “provide analysis of net debt… comprises debt and debt-like items…” (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md:L16-L21).
- References to a table/exhibit listing net debt and adjustments (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md:L16-L23).
- “not deemed to be all inclusive” style caveat (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md:L33-L37).

Common failure modes

- Treating net debt as only bank debt minus cash (template pitfall) (context/skill/kpmg-fdd/references/section-templates/net-debt.md:L27-L29).
- Missing cut-off timing risks (template pitfall; playbook includes cut-off considerations) (context/skill/kpmg-fdd/references/analysis-playbooks/net-debt-playbook.md:L23-L25).
- Lack of basis for debt-like classification.

Minimum evidence requirements

- Seller-prepared net debt schedule and/or bank statements/debt schedules (playbook inputs) (context/skill/kpmg-fdd/references/analysis-playbooks/net-debt-playbook.md:L8-L14).
- Basis for each debt-like conclusion (writing standards + playbook) (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46; context/skill/kpmg-fdd/references/analysis-playbooks/net-debt-playbook.md:L19-L22).

Variation by industry

- Retail/lease-heavy: lease obligations become prominent debt-like; include module if evidence.
- Financial services: “net debt” may not be the primary mechanic; system should still produce a debt-like review table but may need different definition—handle via overlay + explicit definition note.

What to lock vs keep flexible
Lock: schedule + debt-like checklist + cut-off notes + missing information.
Flexible: the specific debt-like line items reviewed (should be generated from a taxonomy but only populated when evidence exists).

2.7 Risks and red flags

Canonical objective
Present balanced bull/bear and escalation items (context/skill/kpmg-fdd/references/report-structure.md:L181-L184). Writing standards require explicit severity, mitigants, and potential impact framing (context/skill/kpmg-fdd/references/writing-standards.md:L71-L76).

Required substructure
Use the template’s risk register table as the locked primary output (context/skill/kpmg-fdd/references/section-templates/risks-and-red-flags.md:L8-L16). Add “red flags escalation notes” for severe items (context/skill/kpmg-fdd/references/section-templates/risks-and-red-flags.md:L17-L23).

Common narrative patterns (corpus)

- In the corpus, this canonical section is usually extracted under “Key Findings” and presented as bullets. Example: project-autobahn lists major QoE/WC/Net debt items and “other considerations” in a stacked bullet format (context/docs/report-mining/section-corpus/sections/risks-and-red-flags.md:L34-L56).
- Some reports include detailed accounting-policy and audit-quality signals here (coffee example includes detailed policy risks and recommendations) (context/docs/report-mining/section-corpus/sections/risks-and-red-flags.md:L86-L110).

Common failure modes

- Minimizing risks (explicitly a QC critical failure) (context/skill/kpmg-fdd/references/qc-checklist.md:L14-L15; context/skill/kpmg-fdd/references/section-templates/risks-and-red-flags.md:L24-L26).
- Vague language; risks buried.
- Missing mitigants/next steps.

Minimum evidence requirements

- Each risk must include “what observed” + “why matters” + “next step” (writing standards claim discipline) (context/skill/kpmg-fdd/references/writing-standards.md:L21-L27).
- If quantitative impact unknown, label qualitative and add open item (writing standards; QC) (context/skill/kpmg-fdd/references/writing-standards.md:L15-L16; context/skill/kpmg-fdd/references/qc-checklist.md:L11-L16).

Variation by industry

- Regulated industries: risks often include audit opinions, policy shifts, compliance issues (coffee example).
- High-growth tech: churn, revenue recognition, capitalization policies.

What to lock vs keep flexible
Lock: risk register table fields, severity labels, mitigant/next step requirement.
Flexible: whether to include a short “key findings bullets” preface (to match corpus style) before the table.

2.8 Missing information & data requests

Canonical objective
Make missing information explicit and prioritized (context/skill/kpmg-fdd/references/report-structure.md:L186-L189). Template requires a table with priority, why it matters, needed for, owner, status (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16).

Corpus reality and implication
Most corpus entries for this section are “Not present in source report,” except at least one report that includes an appendix list of outstanding info (project-autobahn) (context/docs/report-mining/section-corpus/sections/missing-information-and-data-requests.md:L15-L16; context/docs/report-mining/section-corpus/sections/missing-information-and-data-requests.md:L29-L53). That means your generator cannot rely on abundant stylistic examples; it must synthesize this section from (a) missing evidence detected elsewhere, (b) section playbook “inputs to request” lists (e.g., QoE playbook inputs) (context/skill/kpmg-fdd/references/analysis-playbooks/qoe-playbook.md:L8-L14), and (c) explicit gaps flagged during drafting/QC.

Required substructure (locked)

- Missing information table with P0/P1/P2 guidance (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16).
- Seller responsiveness watch-outs (optional) (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L17-L18).
- Next steps (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L20-L23).

Common failure modes

- List exists but no “why it matters” and no prioritization (template pitfalls) (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L24-L26).
- Missing information not integrated with conclusions/risk register (writing standards “running list” requirement) (context/skill/kpmg-fdd/references/writing-standards.md:L64-L70).

Minimum evidence requirements
This section is specifically about missing evidence; the system should generate it deterministically from a “MissingEvidence” list produced by earlier stages.

What to lock vs keep flexible
Lock: table schema, prioritization, “why it matters,” linkage to “needed for.”
Flexible: grouping by workstream (QoE/WC/Net debt/tax) depending on scope.

3. **Playbook architecture**

Goal
Make playbooks the single source of truth for “what must be true” before a section can be considered valid, and for “how to fail safely” when inputs are missing.

3.1 Common schema across playbooks

Represent each playbook as YAML (or JSON) with schema validation. A unified schema allows the orchestrator to treat sections consistently, while allowing section-specific modules.

Proposed Playbook Schema (YAML-ish)

- playbook_id: e.g., “qoe_v1”

- canonical_section_name: must match canonical naming (context/skill/kpmg-fdd/references/report-structure.md:L37-L58)

- objective: align to report-structure objectives (context/skill/kpmg-fdd/references/report-structure.md:L128-L136)

- required_blocks: ordered list of blocks
  - block_id
  - title
  - required: true/false
  - skeleton_variants_allowed: [list]
  - inputs_required: list of evidence types (TB, GL, management schedule, audited FS)
  - evidence_requirements:
    - required_basis_fields: [period, units, source_type, source_date]
    - quantitative_claim_policy: “basis_required” | “disallow_if_missing”

  - output_artifacts:
    - exhibits: list with schemas (table columns, caption requirements)
    - narratives: list with required rhetorical moves (observe → imply → recommend) (context/skill/kpmg-fdd/references/writing-standards.md:L21-L27)

  - failure_modes:
    - if_missing_inputs: “convert_to_open_item” | “omit_block_with_caveat”
    - uncertainty_phrasing_rules

- style_rules:
  - tone: factual/balanced; uncertainty labeling required (context/skill/kpmg-fdd/references/writing-standards.md:L13-L16)
  - banned_phrases: optional
  - required_phrases: optional disclaimers (configurable; avoid forcing boilerplate)

- evaluation_gates:
  - structural: headings expected, ordering
  - basis_coverage_threshold
  - placeholder_policy
  - exhibit_presence_rules

  3.2 Section-specific modules

Each section gets modular blocks (enables strictness + adaptability):

- Executive summary modules
  DealScopeAtAGlance, WorkstreamConclusions, RisksMitigants, OpenItemsThatMoveConclusions (template structure) (context/skill/kpmg-fdd/references/section-templates/executive-summary.md:L8-L25)

- Business overview modules
  BusinessModel, CustomersGTM, OperatingModel, RecentChanges (context/skill/kpmg-fdd/references/section-templates/business-overview.md:L8-L25)

- Historical performance modules
  Overview, KeyDrivers, DataQualityNotes (align with corpus “Overview/Key Drivers” pattern and template’s three blocks) (context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L16-L26; context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L8-L20)

- QoE modules
  Overview, BridgeExhibit, AdjustmentRationaleByType, SensitivitiesAndOpenItems (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L34)

- Working capital modules
  Overview, DefinitionTable, TrendSeasonality, Normalization, Implications, OpenItems (context/skill/kpmg-fdd/references/section-templates/working-capital.md:L8-L29)

- Net debt modules
  Overview, DebtSchedule, CashConsiderations, DebtLikeChecklist, RisksOpenItems (context/skill/kpmg-fdd/references/section-templates/net-debt.md:L8-L22)

- Risks modules
  RiskRegisterTable, RedFlagEscalations (context/skill/kpmg-fdd/references/section-templates/risks-and-red-flags.md:L8-L23)

- Missing information modules
  OpenItemsTable, SellerResponsiveness, NextSteps (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L23)

  3.3 Adjustment-taxonomy treatment (QoE / WC / Net debt)

Internal taxonomy should be stable even if labels vary across reports. The QoE template already suggests categories (non-recurring, run-rate, owner/discretionary, accounting/reclass, other) (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L21-L28). The corpus and adjustment library show common “management adjustments / potential adjustments” framing and examples like owner comp, transaction expenses, audit fee normalization, accrual cut-offs (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L90-L105; context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L19-L43).

Recommended taxonomy objects

QoEAdjustment:

- category: NonRecurring | RunRate | OwnerDiscretionary | AccountingReclass | DealSpecific | Other
- subcategory: optional (e.g., TransactionCosts, OwnerComp, OneTimeInsuranceRecovery, AuditFees)
- recurrence: NonRecurring | Recurring | RunRate
- impact: amount + units + sign convention
- period: aligned period label (FY2023–FY2025, LTM)
- basis: list of EvidenceRefs
- quant_method: narrative “how quantified” (writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L49-L53)
- residual_risk: what could change conclusion (writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L53-L54)
- status: Proposed | Confirmed | Disputed | Pending

WorkingCapitalAdjustment:

- category: NonOperational | CutoffTiming | Classification | Other
- effect: increases/decreases NWC
- basis + residual_risk + status

NetDebtItem:

- category: Debt | Cash | DebtLike
- cash_type: Restricted | Unrestricted | Unknown
- cutoff_risk: Low/Medium/High
- basis + open_confirmation_needed

  3.4 Rules for uncertainty, missing data, unsupported claims

Hard rules (enforced by linter + QC, not only prompt)

- No invented numbers: if not in Evidence Ledger, cannot appear in output (context/skill/kpmg-fdd/SKILL.md:L69-L73; context/skill/kpmg-fdd/references/writing-standards.md:L45-L46).

- Basis required for any material quantitative claim (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46; context/skill/kpmg-fdd/references/qc-checklist.md:L11-L16).

- If an exhibit is missing, claims that depend on it must be reframed as questions or missing information (context/skill/kpmg-fdd/references/qc-checklist.md:L31-L35).

- Missing inputs become Open Items with priority and “why it matters” (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16).

Soft rules (style contract)

- Uncertainty must be labeled (“management-provided”, “estimated”, “not audited”) (context/skill/kpmg-fdd/references/writing-standards.md:L15-L16).

- Avoid absolutes unless evidence is clear (context/skill/kpmg-fdd/references/writing-standards.md:L17-L20).

  3.5 Encoding “defensible rationale” in generated writing

Implement a standard “Adjustment Rationale Card” structure that every adjustment narrative must follow (even if compressed):

- What it is (plain description)
- Why it’s treated as non-recurring/run-rate/other
- How quantified (data + period + method + assumptions)
- Residual risk + what could change it
- Basis/source line(s)

This is directly aligned with writing standards for adjustments (context/skill/kpmg-fdd/references/writing-standards.md:L47-L54). Make it a required template slot per adjustment.

4. **Template architecture**

Goal
A template system that is strict enough to prevent drift and fluff, but flexible enough to reflect the corpus’ real variation (and to handle mixed-quality inputs).

4.1 Template schema (fields, required vs optional)

Template Spec (per section variant)

- template_id: e.g., “qoe_v1_overview_bridge_bytype”
- canonical_section_name
- variant_metadata:
  - intended_report_depth: quick/standard/deep (workflow defaults to standard) (context/skill/kpmg-fdd/references/workflow.md:L18-L24)
  - report_type: buy-side/sell-side (if known)
  - industry_tags: optional

- blocks: ordered
  - block_id
  - required: true/false
  - render_mode: narrative | bullets | table | mixed
  - slots: list of SlotSpecs
    - slot_name
    - required: true/false
    - data_type: string | number | table | list[object]
    - source_required: true/false
    - allowed_if_missing: false/true (if true, must generate open item)
    - style_constraints: tense, voice, hedge level

- output_constraints:
  - units_policy
  - sign_convention_policy (parentheses for negatives per exhibits standards) (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L34-L37)
  - basis_line_policy (always required for exhibits) (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27)

  4.2 Slot strategy

Key slot types to avoid generic fluff

- Facts slots (must be evidence-backed): period coverage, revenues, EBITDA, adjustments, net debt balances, NWC levels.

- Bridges slots: Reported → Adjustments → Adjusted (QoE) with tie-out check (QC) (context/skill/kpmg-fdd/references/qc-checklist.md:L10-L12; context/skill/kpmg-fdd/references/exhibits-and-tables.md:L41-L51).

- Assumptions slots: explicitly labeled assumptions; must auto-generate open item if assumption is material.

- Missing information slots: prioritized items with “why it matters” (template) (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16).

- Evidence slots: basis lines for each exhibit and for material quantitative claims (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46; context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27).

  4.3 Guardrails to prevent generic fluff

Hard guardrails (deterministic)

- Minimum exhibit presence: if QoE section exists, must include a bridge table near it (existing check_report_structure script already has a heuristic for this) (context/skill/kpmg-fdd/scripts/check_report_structure.py:L9-L13; context/skill/kpmg-fdd/scripts/check_report_structure.py:L98-L101).

- Placeholder leakage: detect <…>, TBD, $[x], [Date]. Existing script flags these (context/skill/kpmg-fdd/scripts/check_report_structure.py:L38-L45). Update policy: allow placeholders only in “draft” mode; disallow in “final” mode unless explicitly labeled and mirrored in missing information.

- “Driver claims” linter: if narrative claims “mix/pricing/volume drove X,” require a referenced evidence item (template explicitly prohibits unsupported driver assertions) (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L26-L28).

Soft guardrails (prompted + QC)

- Require “so what” early: writing standards require “so what” in first 1–2 sentences (context/skill/kpmg-fdd/references/writing-standards.md:L79-L81).

- Enforce observe → imply → recommend structure per subsection (context/skill/kpmg-fdd/references/writing-standards.md:L21-L27).

  4.4 Industry overlays

Mechanism
Create overlay modules that attach to playbooks/templates as optional blocks and KPI/risk checklists. Overlays should never force content; they should provide:

- A list of “candidate KPIs” and their definitions (for consistency)
- A list of “common diligence questions” that become missing information if data not available
- Optional narrative patterns (e.g., how to describe deferred revenue behavior in SaaS)

Consumption rule
Overlays only populate when the Evidence Ledger contains matching data. Otherwise, they contribute missing information (P1/P2).

4.5 Output-level constraints (tone, tense, quantification style, caveat style)

These should be encoded as deterministic constraints + small prompt reminders:

- Tone: factual/balanced; uncertainty labeled (context/skill/kpmg-fdd/references/writing-standards.md:L13-L16).
- Quantification: include units/periods; tables for financials (context/skill/kpmg-fdd/references/writing-standards.md:L5-L8; context/skill/kpmg-fdd/references/exhibits-and-tables.md:L7-L10).
- Caveats: do not overstate; if basis missing → open item (context/skill/kpmg-fdd/references/writing-standards.md:L45-L46).

5. **Prompting and orchestration design**

Goal
End-to-end pipeline that is reproducible, auditable, and robust across industries and data completeness.

5.1 Retrieval strategy (which examples, how many, similarity logic)

Inputs for retrieval

- canonical_section_name (must match canonical list and aliasing rules) (context/skill/kpmg-fdd/references/report-structure.md:L37-L58)
- industry tag (from deal intake)
- report type (buy-side/sell-side) if known
- depth (quick/standard/deep) default standard (context/skill/kpmg-fdd/references/workflow.md:L18-L24)

Corpus retrieval sources

- Section corpus files (23 entries each) (context/docs/report-mining/section-corpus/README.md:L19-L26).
- Adjustment libraries for QoE/WC/Net debt (context/docs/report-mining/section-corpus/README.md:L38-L41).

Selection algorithm (practical and inspectable)

Step 1: metadata filter

- Filter exemplars by same canonical section.
- Prefer same industry if available; otherwise same broad category (you will need an internal mapping outside this zip; if missing, fall back to all).
- Optionally downweight “simulated-report-2025” exemplars by default unless the user wants that style. (This is a design choice; the corpus contains simulated IDs per validation report listing, but no explicit policy about them.)

Step 2: structure similarity

- Compare internal heading signatures (e.g., presence of “Overview / Key Drivers” or adjustment subheadings).
- Pick a skeleton variant that matches the section’s expected pattern (the corpus strongly suggests stable internal headings for several sections—e.g., working capital has “Overview” and “Net working capital adjustments”) (context/docs/report-mining/section-corpus/sections/working-capital.md:L16-L32).

Step 3: semantic similarity

- Use embeddings over the exemplar’s distilled “skeleton summary” + key sentences (not the whole text) to avoid token bloat.

Recommended k

- 2–3 exemplars per section for style reference + 1 “format exemplar” (best-in-class, short, clean).
- For QoE/WC/Net debt, add 3–5 relevant adjustment library snippets as “taxonomy reminders,” not as factual content.

Artifacts to store per retrieval

- exemplar_ids selected
- skeleton_variant selected
- rationale (scores/filters)
  This is crucial for auditability.

  5.2 Planning step before drafting

Planning is mandatory and outputs a strict SectionPlan JSON.

Why: your workflow already emphasizes outlining and evidence planning to make drafting deterministic (context/skill/kpmg-fdd/references/workflow.md:L37-L45). Turn that into a schema the compiler can enforce.

SectionPlan fields (minimum)

- section_name (canonical)
- variant_id
- heading_tree: ordered list
- exhibits: list of required exhibits with columns, periods, units, and basis sources (exhibits minimums) (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27)
- claims: list of Claim objects
  - claim_text (short)
  - claim_type: quantitative | qualitative | recommendation
  - evidence_refs: list
  - confidence: High/Med/Low (derived from evidence type)
  - if_missing_evidence: open_item_id

- open_items: list (with P0/P1/P2, why it matters, needed for) (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16)

  5.3 Drafting prompts by section

All drafting prompts should be “slot-filling prompts,” not open-ended writing prompts. They should take:

- SectionPlan JSON
- Evidence Ledger for that section
- Template variant spec
- Selected exemplar snippets (limited)
- Writing standards (facts vs judgments, basis discipline) (context/skill/kpmg-fdd/references/writing-standards.md:L21-L46)

Section-specific prompt considerations

- Executive summary drafting prompt must:
  - force inclusion of missing information table and risks/mitigants (template) (context/skill/kpmg-fdd/references/section-templates/executive-summary.md:L18-L25)
  - prevent “we reviewed X” without findings (template pitfall) (context/skill/kpmg-fdd/references/section-templates/executive-summary.md:L30-L32)

- Historical performance drafting prompt must:
  - enforce “do not assert driver without evidence” (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L26-L28)
  - include “data quality notes” (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L17-L20)

- QoE drafting prompt must:
  - include bridge exhibit table with basis per adjustment (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L20)
  - enforce adjustment rationale card structure (writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L49-L54)

  5.4 Revision and self-critique stages

Two review stages:

A. Self-critique (LLM) against explicit rules
Provide the model with: writing standards + qc checklist + section plan. Ask it to produce:

- a structured issue list (mirrors QC issue log format) (context/skill/kpmg-fdd/references/qc-checklist.md:L50-L58)
- recommended fixes
- a revised section

B. Deterministic QC pass
Run automated checks:

- structure: required headings + placeholder detection (existing script) (context/skill/kpmg-fdd/scripts/check_report_structure.py:L9-L15)
- numerical consistency scan: use extract_numbers.py as a helper and compare repeated metrics (QC checklist recommends this) (context/skill/kpmg-fdd/references/qc-checklist.md:L28-L30; context/skill/kpmg-fdd/scripts/extract_numbers.py:L1-L12)

  5.5 Confidence/uncertainty tagging

Implement “confidence” at the claim level internally; optionally annotate in text only where appropriate (e.g., “management-provided,” “not audited”), consistent with writing standards (context/skill/kpmg-fdd/references/writing-standards.md:L15-L16).

Rules

- Quantitative claim without evidence → disallow; convert to open item.
- Qualitative claim from management commentary → label as such.
- Recommendations are allowed but must be framed as “we recommend” with basis (writing standards claim discipline) (context/skill/kpmg-fdd/references/writing-standards.md:L21-L27).

  5.6 Failure handling and escalation

Fail-safe behaviors (deterministic)

- If a required exhibit cannot be populated due to missing data, insert a “Data not provided” stub and auto-generate a P0/P1 open item referencing the missing evidence, and reframe dependent claims as open questions (QC checklist rules) (context/skill/kpmg-fdd/references/qc-checklist.md:L31-L35; context/skill/kpmg-fdd/references/qc-checklist.md:L16-L16).

- If the model produces placeholders, the run is “draft-only”; cannot be marked final (existing structural script flags placeholders; QC checklist treats unlabeled placeholders as critical) (context/skill/kpmg-fdd/scripts/check_report_structure.py:L11-L12; context/skill/kpmg-fdd/references/qc-checklist.md:L13-L16).

- If the bridge doesn’t tie: block release (QC “do not deliver”) (context/skill/kpmg-fdd/references/qc-checklist.md:L10-L12).

Escalation
If repeated failures occur, escalate to human reviewer with a QC Issue Log (template exists) (context/skill/kpmg-fdd/assets/qc-issue-log-template.md:L1-L5) and a bundle of: inputs, plan, draft, critique, QC outputs.

6. **Evaluation and QA system**

Goal
A robust eval framework with scoring rubrics and operational gates that reflect diligence reality, not just academic similarity.

6.1 Structural fidelity metrics

Automated structure checks

- Heading tree match to template + selected skeleton variant
  - Metric: normalized edit distance over headings and ordering.
  - Gate: must include canonical section heading (report-structure insists on canonical names) (context/skill/kpmg-fdd/references/report-structure.md:L39-L41).

- Required block presence per section
  - Executive summary must include findings + missing information (QC critical) (context/skill/kpmg-fdd/references/qc-checklist.md:L9-L10).
  - QoE must include bridge and tie (context/skill/kpmg-fdd/references/qc-checklist.md:L10-L12).
  - Working capital must include definition + normalization or explicit blockers (template) (context/skill/kpmg-fdd/references/section-templates/working-capital.md:L8-L22).

  6.2 Style similarity metrics (practical)

Avoid purely academic metrics; use ones that map to reviewer intuition:

- Exemplar embedding similarity: similarity of generated section to nearest corpus exemplars for same section (store distribution; flag outliers).

- Style fingerprint:
  - bullet-to-paragraph ratio (exec summary and business overview are often bullet-heavy in corpus) (context/docs/report-mining/section-corpus/sections/executive-summary.md:L41-L46; context/docs/report-mining/section-corpus/sections/business-overview.md:L16-L27)
  - presence and placement of subheadings (e.g., Overview/Key Drivers) (context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L16-L26)
  - hedge/uncertainty marker frequency (“we understand”, “management informed us”, “based on”)—measure relative to corpus baseline.

- Rhetorical move coverage: detect “observed → implies → recommend” per subsection (writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L21-L27).

  6.3 Evidence-grounding checks

Hard checks

- Basis coverage: percentage of quantitative claims with explicit basis lines (writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46).
- Exhibit completeness: period, units, source/basis present (exhibits minimums) (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27).
- Numbers-only-from-evidence:
  - Extract numbers from output (extract_numbers.py) (context/skill/kpmg-fdd/scripts/extract_numbers.py:L1-L12)
  - Compare to numbers in Evidence Ledger; flag any unseen numbers as hallucination risk.

  6.4 Hallucination/unsupported assertion controls

- Unsupported driver assertions: “price/mix/volume drove” must reference evidence or be reframed as hypothesis/open item (template rule) (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L26-L28).
- Unsupported “we verified” statements: phrases implying verification (“we obtained invoices… no discrepancies”) must only be used if evidence explicitly supports it. The corpus includes such wording (e.g., QoE adjustment library includes “We obtained supporting invoices… no discrepancies noted.”) (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L20-L21). That’s exactly why this check matters: the model may copy the style without having the evidence.

  6.5 Section-level pass/fail thresholds

Operational gates (suggested)

- Executive summary
  Pass if: includes key conclusions + risks + missing information; no unlabeled placeholders; no unsupported quant.
  Fail if: descriptive only; no missing information (QC critical) (context/skill/kpmg-fdd/references/qc-checklist.md:L9-L16).

- Historical performance
  Pass if: periods/units consistent; drivers only asserted with evidence; includes data quality notes.
  Fail if: mixed periods without labeling; unsupported driver claims (context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L26-L28).

- QoE
  Pass if: bridge present and ties; per-adjustment basis; missing information list; adjustment rationale includes why/how/residual risk.
  Fail if: missing bridge or tie-out (QC critical) (context/skill/kpmg-fdd/references/qc-checklist.md:L10-L12).

- Working capital / Net debt
  Pass if: definition + schedule/checklist + cut-off notes + missing information.
  Fail if: unclear definition; missing debt-like review; unsupported quant.

  6.6 Human review workflow integration

Artifacts for reviewers

- SectionPlan JSON (what the system intended to write)
- Draft section text
- Evidence ledger excerpt used
- Retrieval report (exemplars and why)
- QC issue log (use provided template) (context/skill/kpmg-fdd/assets/qc-issue-log-template.md:L1-L5)

Operational workflow

- Draft generation produces “review bundle.”
- Reviewer approves or flags issues; issues feed back into playbook/template adjustments.
- Maintain a continuous improvement loop by updating: playbooks, overlays, skeleton selectors, and eval thresholds.

7. **Implementation roadmap**

Assumptions (explicit, because not all upstream data plumbing is present in this zip)

- You have (or can produce) structured deal inputs: periods, financial statements or trial balance extracts, adjustment schedules, WC account detail, net debt schedules, plus a place to store “evidence refs” (e.g., doc name/date, workbook tab, file path).
- You can run Python tooling in your environment (existing scripts are Python) (context/skill/kpmg-fdd/scripts/check_report_structure.py:L1-L8).

Phase 1: Corpus compiler + skeleton library (Outcome: retrieval-ready dataset)
Non-technical outcome
You can query the corpus by section/industry and retrieve exemplar skeletons and snippets deterministically.

Build tasks

- Parse corpus markdown into JSON dataset using ENTRY_RE from validator as spec (context/docs/report-mining/section-corpus/scripts/validate_section_corpus.py:L15-L25).
- Extract skeleton features: internal headings, bullet density, typical disclaimer blocks.
- Build an index keyed by: canonical_section, industry, report_id (corpus provides these fields) (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L5-L12).
- Add “quality score” heuristics (length, placeholder presence, completeness).

Dependencies

- Corpus files in docs/report-mining/section-corpus/sections and adjustments (context/docs/report-mining/section-corpus/README.md:L19-L41).

Risks & mitigations

- Mixed quality: mitigate via quality scores and allow manual “gold exemplar” tags.

Suggested owners/roles

- Data/ML engineer (parsing + indexing)
- FDD SME (tag gold exemplars)

Tests

- Parser unit tests to ensure 23 entries parsed per file; compare to validation expectations (context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L7-L21).
- Skeleton extraction tests (headings, bullet counts).

Go/no-go checkpoint

- Able to retrieve top 3 exemplars per section with stable IDs and skeletons.

Phase 2: Evidence Ledger + SectionPlan schema (Outcome: audit foundation)
Non-technical outcome
Every section can be planned with explicit evidence requirements and missing information, before any narrative is written.

Build tasks

- Define EvidenceRef schema and Evidence Ledger store (JSON).
- Define SectionPlan schema (JSON Schema) and validators.
- Build “missing evidence detector” that populates missing information.

Dependencies

- Writing standards and missing information template provide the rules and table fields (context/skill/kpmg-fdd/references/writing-standards.md:L38-L46; context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16).

Risks & mitigations

- Evidence mapping overhead: mitigate by allowing coarse-grained basis (e.g., “management schedule dated …”) initially, then tighten later.

Owners

- Principal engineer (schema + validators)
- FDD SME (basis conventions)

Tests

- Lint rules: reject quantitative claims without basis.
- Missing information generation tests: missing required inputs produce P0/P1 items.

Go/no-go checkpoint

- SectionPlan can be created and validated for at least QoE/WC/Net debt.

Phase 3: Template compiler + baseline generator (Outcome: produce drafts for 3 core sections)
Non-technical outcome
Given a deal packet, you can generate QoE/WC/Net debt sections that are structured correctly and basis-safe.

Build tasks

- Convert markdown templates into parameterized templates with slots (start from existing templates) (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L34; context/skill/kpmg-fdd/references/section-templates/working-capital.md:L8-L29; context/skill/kpmg-fdd/references/section-templates/net-debt.md:L8-L22).
- Implement renderer that fills templates from SectionPlan + Evidence Ledger.
- Implement LLM prompts for: Plan → Draft per block → Self-critique.

Dependencies

- Canonical section order and workflow (context/skill/kpmg-fdd/references/workflow.md:L51-L64).
- Exhibit minimum rules (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27).

Risks & mitigations

- Model drift: mitigate by strict template rendering + skeleton enforcement.
- Token bloat from exemplars: mitigate by using skeleton summaries rather than full extracts.

Owners

- Principal engineer (orchestrator)
- Prompt engineer (prompt packs)
- FDD SME (review)

Tests

- Structural checks with check_report_structure script (context/skill/kpmg-fdd/scripts/check_report_structure.py:L9-L13).
- Bridge tie-out checks for QoE (QC) (context/skill/kpmg-fdd/references/qc-checklist.md:L10-L12).

Go/no-go checkpoint

- Generate 3 sections with zero unlabeled placeholders and passing QC gates.

Phase 4: Expand to all required sections + cross-section consistency (Outcome: end-to-end report draft)
Non-technical outcome
You can generate all required sections with consistent periods/units/definitions and a consolidated missing information section.

Build tasks

- Implement executive summary, business overview, historical performance, risks, missing information sections using templates and playbooks (context/skill/kpmg-fdd/references/report-structure.md:L94-L189).
- Add cross-section consistency checks (units/periods/definitions) (context/skill/kpmg-fdd/references/writing-standards.md:L55-L63).
- Aggregate missing information across sections into the final missing information table.

Dependencies

- Report template for numbering (context/skill/kpmg-fdd/assets/report-template.md:L13-L85).
- QC checklist gates (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16).

Risks & mitigations

- Missing information section lack of corpus examples: mitigate by deterministic synthesis from missing evidence (template exists) (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16).

Owners

- Engineering + SME review

Tests

- Full report QC run.
- Extract_numbers consistency scan (context/skill/kpmg-fdd/references/qc-checklist.md:L28-L30).

Go/no-go checkpoint

- Full report draft passes structural, basis, and placeholder gates.

Phase 5: Evaluation harness + continuous improvement loop (Outcome: measurable fidelity + governance)
Non-technical outcome
You can measure style/structure fidelity and grounding, and block releases that regress.

Build tasks

- Implement structural fidelity scoring and style fingerprint metrics.
- Build pass/fail thresholds per section (as described above).
- Add reviewer workflow integration with QC issue log template (context/skill/kpmg-fdd/assets/qc-issue-log-template.md:L1-L5).
- Add “golden test set” from selected corpus reports for regression-style conformance.

Dependencies

- Corpus validation ensures reliable reference text (context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L3-L8).

Risks & mitigations

- Overfitting to corpus quirks: mitigate with explicit style contract and SME sign-off.

Owners

- Research lead + engineering + SME

Go/no-go checkpoint

- Stable evaluation scores across releases; gating in CI.

8. **Deliverable artifact list**

Below is the exact set of repo artifacts to operationalize the design, with purpose, consumer, suggested path/name, and acceptance criteria.

A. Global contracts and schemas

1. Style Contract (global)

- Purpose: Define invariants (tone, basis discipline, headings, allowed caveats) and allowable variants.
- Consumer: human editors, model prompts, evaluators.
- Path: `context/skill/kpmg-fdd/style/style-contract.md` + `style-contract.yaml` (machine-readable).
- Acceptance: covers tone and uncertainty labeling (writing standards) (context/skill/kpmg-fdd/references/writing-standards.md:L13-L16), basis rules (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46), and canonical headings/aliases (context/skill/kpmg-fdd/references/report-structure.md:L37-L58).

2. Evidence Ledger Schema

- Purpose: Formalize evidence refs and claim grounding.
- Consumer: orchestrator, QC, eval.
- Path: `context/skill/kpmg-fdd/schemas/evidence-ledger.schema.json`
- Acceptance: supports basis fields required by exhibits minimums (period, units, source/basis) (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27).

3. SectionPlan Schema

- Purpose: Strict plan format required before drafting.
- Consumer: orchestrator, QC, eval, humans.
- Path: `context/skill/kpmg-fdd/schemas/section-plan.schema.json`
- Acceptance: includes exhibits list and missing information list, aligned to missing information template fields (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16).

B. Playbooks 4. Playbook Schema

- Purpose: Validate all section playbooks (common fields + modules).
- Consumer: authoring tools, CI.
- Path: `context/skill/kpmg-fdd/schemas/playbook.schema.json`

5–12. Section Playbooks (eight required sections)

- Purpose: Section-specific objective, blocks, evidence requirements, failure handling, evaluation gates.
- Consumer: orchestrator, humans.
- Paths:
  - `context/skill/kpmg-fdd/playbooks/executive-summary.yaml`
  - `.../business-overview.yaml`
  - `.../historical-financial-performance.yaml`
  - `.../qoe-and-earnings-adjustments.yaml`
  - `.../working-capital.yaml`
  - `.../net-debt-and-debt-like-items.yaml`
  - `.../risks-and-red-flags.yaml`
  - `.../missing-information-and-data-requests.yaml`

- Acceptance: each playbook encodes minimum content from report-structure (context/skill/kpmg-fdd/references/report-structure.md:L94-L189) and cites evidence requirements consistent with writing standards (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46).

C. Templates 13. Template Schema

- Purpose: Validate parameterized templates and slot constraints.
- Consumer: renderer, CI.
- Path: `context/skill/kpmg-fdd/schemas/template.schema.json`

14–21. Template Variants (eight required sections)

- Purpose: Strict rendering skeletons with slot definitions; multiple variants per section.
- Consumer: renderer/orchestrator.
- Path: `context/skill/kpmg-fdd/templates/sections/<section>/<variant>.md.j2` (or equivalent).
- Acceptance:
  - Includes required exhibits with caption requirements (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27).
  - Enforces bridge table for QoE (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L20).

D. Corpus tooling 22. Corpus Parser + Skeleton Extractor

- Purpose: Convert verbatim corpus markdown into structured JSON + skeletons.
- Consumer: retrieval, eval.
- Path: `context/docs/report-mining/section-corpus/tools/parse_corpus.py`
- Acceptance: parses 23 entries per canonical section as per corpus README (context/docs/report-mining/section-corpus/README.md:L15-L26) and matches validator structure (context/docs/report-mining/section-corpus/scripts/validate_section_corpus.py:L15-L25).

23. Exemplar Index Build

- Purpose: Build retrieval index (metadata + embeddings + skeleton signatures).
- Consumer: orchestrator.
- Path: `context/docs/report-mining/section-corpus/tools/build_exemplar_index.py`

E. Orchestration + QC + Eval 24. Orchestrator Package

- Purpose: Plan → Draft → Critique → QC → Finalize.
- Consumer: runtime.
- Path: `context/skill/kpmg-fdd/orchestrator/` (python package)

25. Prompt Packs

- Purpose: Versioned prompts for planning/drafting/critique per section.
- Consumer: orchestrator.
- Path: `context/skill/kpmg-fdd/prompts/<section>/<stage>.md`

26. QC Linters

- Purpose: Enforce basis coverage, placeholder policy, bridge tie-outs, exhibit completeness.
- Consumer: CI + runtime gating.
- Path: `context/skill/kpmg-fdd/qc/`
- Acceptance: incorporates QC checklist “do not deliver” rules (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16) and integrates existing check_report_structure script behavior (context/skill/kpmg-fdd/scripts/check_report_structure.py:L9-L13).

27. Evaluation Harness

- Purpose: Structural + style + grounding metrics; gating thresholds.
- Consumer: CI, regression tests.
- Path: `context/skill/kpmg-fdd/eval/`
- Acceptance: reports section-level pass/fail aligned to QC checklist gates (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L49).

28. Run Bundle Spec

- Purpose: Define what artifacts are saved per generation run for auditability.
- Consumer: runtime + reviewers.
- Path: `context/skill/kpmg-fdd/schemas/run-bundle.schema.json`
- Acceptance: includes inputs, evidence ledger, section plans, drafts, retrieval logs, QC logs, final outputs.

9. **Alternative architecture(s)**

Alternative A: Fine-tuned “section writer” model + light QC
Description
Fine-tune (or instruction-tune) a model on the historical section corpus (and your broader internal dataset) to directly generate each section given structured inputs.

Pros

- Potentially highest surface-level style similarity (sentence rhythm, idioms, phrasing).
- Faster runtime (less multi-stage prompting).

Cons / risks

- Harder auditability: style model may hallucinate plausible-but-unsupported specifics unless heavily constrained.
- Harder controllability: structure may drift without strict templates.
- Mixed-quality corpus risks baking in inconsistent patterns.

When to choose
If style imitation is the dominant KPI and you have strong downstream grounding constraints (Evidence Ledger + number whitelist + basis enforcement) and a robust evaluation harness.

Alternative B: Deterministic narrative generator + minimal LLM rewrite
Description
Generate all content from templates and deterministic rules (including adjustment rationale cards), then use the model only for final “polish within constraints.”

Pros

- Maximum auditability and reproducibility.
- Strong control over structure and basis discipline.

Cons

- Harder to reach “as close as possible” on narrative flow and report-like phrasing; output risks feeling mechanical.

When to choose
If regulatory/defensibility constraints outweigh stylistic fidelity, or if model usage is restricted.

Trade-offs vs primary recommendation
The primary recommendation (hybrid constrained RAG + plan + template rendering + critique + QC) deliberately sits between these two: it can achieve high similarity by using exemplars and skeletons, while still enforcing deterministic structure and evidence discipline.

10. **Final decision package**

Recommended architecture (single clear choice)
Adopt the seven-layer hybrid system:
Global Style & Structure Contract → Exemplar Retrieval & Skeleton Enforcement → Evidence & Provenance Ledger → Section Playbooks → Parameterized Template Rendering → Orchestration (plan/draft/critique/QC) → Evaluation & QA gates.

Why this is best for the end goal

- It explicitly optimizes for high similarity in structure and sequencing by selecting and enforcing historical skeletons, rather than relying on implicit imitation.
- It operationalizes defensibility requirements (basis lines, no invented numbers, open item conversion) as data structures and gates aligned to existing writing standards and QC checklist (context/skill/kpmg-fdd/references/writing-standards.md:L40-L46; context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16).
- It is practical for diligence teams: deterministic outputs with clear exhibits, missing information, and QC logs; model usage adds narrative value without being the single point of failure.

Top 10 next actions to start immediately

1. Implement corpus parser using the validator’s entry regex and emit JSON per section entry (context/docs/report-mining/section-corpus/scripts/validate_section_corpus.py:L15-L25).
2. Build skeleton extractor (headings + bullet density + key structural markers) for each exemplar.
3. Define EvidenceRef and Evidence Ledger schema; implement a minimal evidence store.
4. Define SectionPlan schema and enforce “plan before draft” for all sections.
5. Convert the QoE, WC, and Net debt templates into parameterized templates with strict slots and exhibit schemas (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L34; context/skill/kpmg-fdd/references/section-templates/working-capital.md:L8-L29; context/skill/kpmg-fdd/references/section-templates/net-debt.md:L8-L22).
6. Build retrieval: pick 2–3 exemplars per section using metadata + skeleton similarity.
7. Implement orchestration for QoE end-to-end (plan → draft → critique → QC) and enforce bridge tie-out and basis coverage gates (context/skill/kpmg-fdd/references/qc-checklist.md:L10-L12; context/skill/kpmg-fdd/references/writing-standards.md:L40-L46).
8. Add deterministic QC: integrate check_report_structure and refine placeholder policy for draft vs final (context/skill/kpmg-fdd/scripts/check_report_structure.py:L9-L15).
9. Stand up evaluation harness with section-level pass/fail and logging (use QC issue log template as reviewer artifact) (context/skill/kpmg-fdd/assets/qc-issue-log-template.md:L1-L5).
10. Pilot on one real deal packet and iterate on playbooks/overlays based on reviewer feedback; promote “gold exemplars” for each section/industry.

5) **Appendix: Proposed Repo Artifacts**

Global contracts & schemas

- `context/skill/kpmg-fdd/style/style-contract.md` and `style-contract.yaml`
  Acceptance: covers tone/uncertainty, basis discipline, canonical headings/aliases (context/skill/kpmg-fdd/references/writing-standards.md:L13-L16; context/skill/kpmg-fdd/references/report-structure.md:L37-L58).

- `context/skill/kpmg-fdd/schemas/evidence-ledger.schema.json`
  Acceptance: supports period/units/source/basis requirements (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27).

- `context/skill/kpmg-fdd/schemas/section-plan.schema.json`
  Acceptance: includes missing information fields aligned to template (context/skill/kpmg-fdd/references/section-templates/missing-information-and-data-requests.md:L8-L16).

- `context/skill/kpmg-fdd/schemas/playbook.schema.json`

- `context/skill/kpmg-fdd/schemas/template.schema.json`

- `context/skill/kpmg-fdd/schemas/run-bundle.schema.json`

Playbooks (YAML)

- `context/skill/kpmg-fdd/playbooks/executive-summary.yaml`
- `context/skill/kpmg-fdd/playbooks/business-overview.yaml`
- `context/skill/kpmg-fdd/playbooks/historical-financial-performance.yaml`
- `context/skill/kpmg-fdd/playbooks/qoe-and-earnings-adjustments.yaml`
- `context/skill/kpmg-fdd/playbooks/working-capital.yaml`
- `context/skill/kpmg-fdd/playbooks/net-debt-and-debt-like-items.yaml`
- `context/skill/kpmg-fdd/playbooks/risks-and-red-flags.yaml`
- `context/skill/kpmg-fdd/playbooks/missing-information-and-data-requests.yaml`
  Acceptance: each encodes minimum content per canonical structure (context/skill/kpmg-fdd/references/report-structure.md:L94-L189).

Templates

- `context/skill/kpmg-fdd/templates/sections/<section>/<variant>.md.j2` for each of the eight sections
  Acceptance: must enforce exhibit minimums and basis policies (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27).

Corpus tooling

- `context/docs/report-mining/section-corpus/tools/parse_corpus.py`
- `context/docs/report-mining/section-corpus/tools/build_skeletons.py`
- `context/docs/report-mining/section-corpus/tools/build_exemplar_index.py`
  Acceptance: deterministic parse that matches validated corpus structure (context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L3-L8).

Orchestration + prompts + QC + eval

- `context/skill/kpmg-fdd/orchestrator/` (pipeline code)
- `context/skill/kpmg-fdd/prompts/<section>/<stage>.md`
- `context/skill/kpmg-fdd/qc/` (basis linter, tie-out checks, placeholder policy)
- `context/skill/kpmg-fdd/eval/` (metrics + gates + reports)
  Acceptance: QC gates mirror checklist “do not deliver” rules (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16) and integrate existing scripts (context/skill/kpmg-fdd/scripts/check_report_structure.py:L9-L13).
