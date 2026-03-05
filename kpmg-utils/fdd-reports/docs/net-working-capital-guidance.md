Assumptions (explicit, to proceed without questions): “Style 2B” means we preserve the Working capital corpus’ cadence and idioms while standardizing to house defensibility rules in `context/skill/kpmg-fdd/references/writing-standards.md` and polish gates in `context/skill/kpmg-fdd/references/qc-checklist.md`. “Quality gate 5C” means the section is client-ready and defensible under those same house standards, including “do not deliver if” conditions. These assumptions align with the task constraints in `context/MANIFEST.md`.

1. Linguistic analysis (section-specific patterns)

Sentence length / cadence patterns (what the corpus actually does)

- Typical cadence is 2–4 sentence paragraphs in the “Overview”, followed by dense enumerated adjustment lines. This is consistent across entries in `context/docs/report-mining/section-corpus/sections/working-capital.md` (e.g., “Overview” blocks for project-ascend, project-autobahn, project-panacea).
- Quant-heavy sentences are common and usually sit early: “Average … is $X (FYyy: $Y) …” and “As at [date] …” (e.g., project-ascend and project-skyrocket overviews in `context/docs/report-mining/section-corpus/sections/working-capital.md`).
- Adjustment descriptions often follow a two-beat structure: (1) what it is; (2) what it does (“This adjustment …”) (e.g., accrued revenue / payroll in project-ascend; multiple items in project-west; `context/docs/report-mining/section-corpus/sections/working-capital.md` and echoed in `context/docs/report-mining/section-corpus/adjustments/working-capital-adjustments-library.md`).

Hedge / certainty phrasing patterns
Keep as-is patterns (defensible + corpus-consistent)

- Management-sourcing and partial-scope hedges:
  - “based on information provided by Management to date” and “could uncover additional… adjustments” (project-ascend “Overview”, `context/docs/report-mining/section-corpus/sections/working-capital.md`).
  - “It is our understanding…” for deal mechanics that will change post-close (private jet example “Since this arrangement will cease upon closing…”, project-autobahn, `context/docs/report-mining/section-corpus/sections/working-capital.md`).

- Conditionality when assumptions are necessary:
  - “we have assumed…” and “estimated…” language appears in adjustment quantification (e.g., severance timing assumption; DSO/DPO-based estimates; `context/docs/report-mining/section-corpus/sections/working-capital.md`).

Normalize / clean patterns (keep meaning, fix house style + auditability)

- Consolidate repeated “not all-inclusive / further investigation” caveats into one standardized sentence and move it to a consistent place (end of Overview), instead of repeating it mid-flow:
  - Variants appear in project-ascend (“not necessarily all-inclusive… Further analysis… could uncover…”) and project-panacea (“not deemed to be all inclusive… may require further investigation…”) in `context/docs/report-mining/section-corpus/sections/working-capital.md`.

- Replace “adjacent table / table below / schedule opposite” with explicit exhibit references (“Exhibit WC-1…”) because markdown is not spatial (examples: “The adjacent table…” in project-panacea; “schedule opposite” in project-skyrocket; `context/docs/report-mining/section-corpus/sections/working-capital.md`).
- Replace direct second-person (“your offer letter”, “for your consideration”) with report-voice neutral framing:
  - “We understand that your offer letter defined…” (UK offer-letter passage, `context/docs/report-mining/section-corpus/sections/working-capital.md`).

Avoid patterns (must not propagate into generated client drafts)

- “Not present in source report” filler lines (numerous in `context/docs/report-mining/section-corpus/sections/working-capital.md` and the adjustments library). These are extraction artifacts and fail client-ready quality.
- Ellipses truncation (“…”) as seen in project-vortex simulated entry (`context/docs/report-mining/section-corpus/sections/working-capital.md`). Treat as corrupted text; never reproduce.
- Placeholder tokens and malformed dates/currencies (e.g., “[ENTITY]”, “DD MM 20X3”, “££”) present in some entries (notably education and consumer-retail extracts) in `context/docs/report-mining/section-corpus/adjustments/working-capital-adjustments-library.md` and `context/docs/report-mining/section-corpus/sections/working-capital.md`.
- Duplicated lines from extraction (e.g., repeated sentences in project-dental adjustments within both the section corpus and adjustment library). These must be deduped before delivery (`context/docs/report-mining/section-corpus/sections/working-capital.md`, `context/docs/report-mining/section-corpus/adjustments/working-capital-adjustments-library.md`).

Transition logic patterns (how “so what” is carried)
Keep as-is patterns

- Cause → driver phrasing: “due to… driven by… primarily…” and “offset by…” is the dominant causal style (e.g., project-autobahn decline drivers; project-y offer-letter passage; project-z factoring impacts; `context/docs/report-mining/section-corpus/sections/working-capital.md`).
- “On this basis…” used for target/peg comparison conclusions (project-y “deficit compared to target”; `context/docs/report-mining/section-corpus/sections/working-capital.md`).

Normalize patterns

- Ensure every causal sentence ties to a defined metric (NWC $ amount, % of revenue, or days) and period. Some entries mix drivers without anchoring the metric in the same paragraph; the template should force the metric first (house “so what first” rule in `context/skill/kpmg-fdd/references/writing-standards.md`).

Quantification phrase patterns
Keep as-is patterns

- Period anchoring: “FYxx”, “TTM”, “LTM”, “as at [date]” are consistent anchors (multiple entries in `context/docs/report-mining/section-corpus/sections/working-capital.md`).
- Comparative parentheticals: “FY24 (FY23: …)” appears in stronger drafts (e.g., project-skyrocket; `context/docs/report-mining/section-corpus/sections/working-capital.md`).
- Working-capital-days triad: DSO/DIO/DPO appears as a standard operational lens (e.g., project-dental “Days Analysis”; and multiple adjustment quantifications via DSO/DPO; `context/docs/report-mining/section-corpus/sections/working-capital.md`).

Normalize patterns

- Standardize sign conventions and add units consistently (house consistency rules in `context/skill/kpmg-fdd/references/writing-standards.md` and exhibit minimums in `context/skill/kpmg-fdd/references/exhibits-and-tables.md`).

Caveat / disclaimer patterns (normalization caveats)
Keep as-is patterns (but standardize placement)

- “Not all-inclusive; based on Management; further analysis may change adjustments” (project-ascend; `context/docs/report-mining/section-corpus/sections/working-capital.md`).
- “Validity… may require further investigation… impact on valuation model” (project-panacea; `context/docs/report-mining/section-corpus/sections/working-capital.md`).
- Data availability caveats: “audited statements not broken out in sufficient detail” (project-autobahn; `context/docs/report-mining/section-corpus/sections/working-capital.md`) and “not publicly available” for cash / lease breakdowns (project-dental; `context/docs/report-mining/section-corpus/sections/working-capital.md`).

2. Structural analysis (dominant variants → recommended default)

Dominant internal structure variants seen in corpus entries (`context/docs/report-mining/section-corpus/sections/working-capital.md`)
Variant A (most common, “2-block”)

- Overview (2–6 sentences) → Net working capital adjustments (numbered list)

Variant B (adds definitional/context sub-blocks)

- Overview → “Basis of preparation/presentation” (or similar) → Adjustments list
  - Example: project-west includes “Basis of preparation” language plus component descriptions (`context/docs/report-mining/section-corpus/sections/working-capital.md`).

Variant C (adds operational lens)

- Overview includes DSO/DIO/DPO seasonality commentary → Adjustments list
  - Example: project-dental “Days Analysis” narrative (`context/docs/report-mining/section-corpus/sections/working-capital.md`).

Variant D (explicit target/peg comparison)

- Overview includes a stated/derived target and surplus/deficit conclusion → Adjustments list
  - Examples: offer-letter target basis and derived target method; project-y “6+6 target… deficit compared to target” (`context/docs/report-mining/section-corpus/sections/working-capital.md`).

Recommended default structure (for the skill)
Rationale: aligns with minimum content expectations for Working capital in `context/skill/kpmg-fdd/references/report-structure.md` (definition + normalized vs actual + seasonality/volatility if evidenced + implications), and with the current template’s intent to start with definition and then implications (`context/skill/kpmg-fdd/references/section-templates/working-capital.md`).

Default block order (canonical)

1. Key takeaway (1–2 sentences, metric first)
2. Working capital definition (table: included/excluded + rationale)
3. Historical behavior (trend/seasonality; days metrics if available)
4. Normalization (reported → definitional → diligence → pro forma; show normalized range if possible)
5. Peg / target and implications (only if deal definition/target exists; otherwise explicitly open-item it)
6. Missing information & data requests (P0/P1/P2)

Allowed variants (explicit)

- Data-light variant: If only one period-end snapshot is available, keep blocks 1–2, then provide a “snapshot-only limitation” caveat and move directly to missing information (consistent with “period-end snapshots with caveats” guidance in the template: `context/skill/kpmg-fdd/references/section-templates/working-capital.md`).
- Sell-side/buy-side variant: If sell-side diligence exists, include a short “what we relied on vs what we changed” sub-block before normalization (pattern used in project-panacea and project-skyrocket language in `context/docs/report-mining/section-corpus/sections/working-capital.md`).

Required vs optional sub-blocks
Required

- Definition table (explicitly called for in `context/skill/kpmg-fdd/references/section-templates/working-capital.md` and `context/skill/kpmg-fdd/references/exhibits-and-tables.md`)
- Normalized vs actual (or explicit “cannot normalize because…” with data requests) (required by `context/skill/kpmg-fdd/references/report-structure.md`)
- Implications (peg risk / cash impact, clearly labeled) (`context/skill/kpmg-fdd/references/report-structure.md`)
- Missing information list (house standard: keep a running missing-information view; `context/skill/kpmg-fdd/references/writing-standards.md`)

Optional (only when supported)

- DSO/DIO/DPO “days” analysis and seasonality commentary (when data exists; matches corpus examples like project-dental and project-groundworks in `context/docs/report-mining/section-corpus/sections/working-capital.md`)
- Target methodology discussion (only when deal doc defines target basis or forecasts exist; see offer-letter passage in `context/docs/report-mining/section-corpus/sections/working-capital.md`)

3. Failure-mode analysis (generation risks → heuristics → controls)

Failure mode 1: Missing or ambiguous WC definition (operating vs total; inclusions/exclusions unclear)

- Detect: no “Definition” block/table; or “working capital” used without “included/excluded” list.
- Prevent:
  - Template constraint: definition table is mandatory and must include “Included”, “Excluded”, and “Rationale” columns (per `context/skill/kpmg-fdd/references/section-templates/working-capital.md` and `context/skill/kpmg-fdd/references/exhibits-and-tables.md`).
  - Lint: fail if no markdown table exists under “Working capital definition”.

Failure mode 2: “Adjacency” references that don’t work in markdown (“adjacent table”, “schedule opposite”)

- Detect: regex hits for “adjacent”, “opposite”, “table below” in narrative.
- Prevent:
  - Prompt rule: always refer to “Exhibit WC-[#]”.
  - Lint: fail on `\badjacent\b|\bopposite\b|\btable below\b` (corpus contains these phrases: project-panacea and project-skyrocket; `context/docs/report-mining/section-corpus/sections/working-capital.md`).

Failure mode 3: Normalization claimed without caveats or basis (over-certainty)

- Detect: words like “normalized” or “target” without a “Basis:” line or without any “management-provided / not audited” qualifier where applicable.
- Prevent:
  - Template constraint: any normalized figure must have an explicit “Basis:” line (house sourcing rules in `context/skill/kpmg-fdd/references/writing-standards.md`).
  - QC gate: “Material quantitative claims have no basis/source…” is do-not-deliver (`context/skill/kpmg-fdd/references/qc-checklist.md`).

Failure mode 4: Seasonality ignored (single point estimate presented as “target”)

- Detect: target stated but no mention of “average”/period basis, or no discussion of monthly/quarterly trend when available.
- Prevent:
  - Prompt rule: if only period-end data, must include snapshot limitation caveat (current template warns against single point estimate without seasonality acknowledgement: `context/skill/kpmg-fdd/references/section-templates/working-capital.md`).
  - Lint: if “target” present, require “average” or explicit basis phrase (e.g., “12 months prior to completion”) (offer-letter passage shows this basis language: `context/docs/report-mining/section-corpus/sections/working-capital.md`).

Failure mode 5: Peg/target implications stated as fact when target not provided

- Detect: “deficit/excess vs target” language without target value and source.
- Prevent:
  - Template constraint: Peg/Target sub-block must start with “Deal definition / source: …” and if missing, convert to P0 open item.

Failure mode 6: Extraction artifacts leak into client deliverable

- Detect: “Not present in source report”, “[ENTITY]”, “DD MM 20X”, “££”, or “...” present.
- Prevent:
  - Hard lint fail on these tokens (they are present in the corpus and adjustment library and should never appear in generated drafts: `context/docs/report-mining/section-corpus/sections/working-capital.md`, `context/docs/report-mining/section-corpus/adjustments/working-capital-adjustments-library.md`).

Failure mode 7: Adjustments list reads like a data dump (no “what / why / so what / residual risk”)

- Detect: adjustments listed without rationale or without stating whether it’s definitional vs diligence vs pro forma.
- Prevent:
  - Template constraint: adjustments table requires columns for “Type”, “Description”, “Impact”, “Basis”, “Residual risk” (aligned with exhibit standards and defensibility rules: `context/skill/kpmg-fdd/references/exhibits-and-tables.md`, `context/skill/kpmg-fdd/references/writing-standards.md`).

Failure mode 8: Numbers/units/periods inconsistent inside the section

- Detect: mixed $m/$k, FY vs TTM without explicit labeling.
- Prevent:
  - QC gate: “Units and periods are inconsistent…” is do-not-deliver (`context/skill/kpmg-fdd/references/qc-checklist.md`).
  - Lint: require a “Period:” and “Units:” line in each exhibit caption (exhibit minimums: `context/skill/kpmg-fdd/references/exhibits-and-tables.md`).

Failure mode 9: Red flags minimized (tone drift)

- Detect: strong positive language without noting caveats where evidence is management-only or unaudited.
- Prevent:
  - Prompt rule: any management-only inputs must be labeled as such (tone + uncertainty guidance: `context/skill/kpmg-fdd/references/writing-standards.md`).

Failure mode 10: Missing missing information despite acknowledged data gaps

- Detect: “not available / not publicly available / insufficient detail” appears but no missing information list.
- Prevent:
  - Template constraint: “Missing information & data requests” is mandatory, and any “not available” phrase must generate at least one P0/P1 item (missing information guidance in `context/skill/kpmg-fdd/references/writing-standards.md` and QC requirement in `context/skill/kpmg-fdd/references/qc-checklist.md`).

4. Draft markdown playbook (implementable)

```markdown
# Working capital — Draft Playbook (Style 2B / Quality gate 5C)

## Objective

Assess normalized working capital and implications for cash flow, peg/target, and close mechanics.
(Ref: section objective and minimum content in `context/skill/kpmg-fdd/references/report-structure.md` and section intent in `context/skill/kpmg-fdd/references/section-templates/working-capital.md`.)

## Required inputs (minimum)

P0 (gates normalization / peg linkage)

- Deal working capital definition (SPA / term sheet / offer letter): included/excluded accounts; treatment of cash/debt-like items; target basis (e.g., 12-month average).
- Monthly or quarterly balance sheet detail for WC accounts across the analysis period.

P1 (improves defensibility and driver analysis)

- Trial balance / GL detail for WC accounts (for tie-outs and adjustments).
- AR aging and credit notes / rebates detail (if AR is in scope).
- AP aging (including capex payables separation if relevant).
- Inventory detail and obsolescence / reserves (if inventory is in scope).
- Deferred revenue / customer deposits detail (if applicable).

P2 (context)

- Seasonality narrative from management (must be labeled as management-provided).
- Any sell-side diligence WC schedule and adjustment list (if available).

(Ref input expectations in `context/skill/kpmg-fdd/references/analysis-playbooks/working-capital-playbook.md`.)

## Canonical block order (must follow)

1. Key takeaway (1–2 sentences, metric + implication)
2. Working capital definition (table)
3. Historical behavior (trend/seasonality + key drivers)
4. Normalized vs actual (including definitional / diligence / pro forma adjustments)
5. Peg/target and implications (conditional on deal definition)
6. Missing information & data requests (P0/P1/P2)

## Evidence / basis rules (5C gate)

- Do not invent numbers. If missing, use placeholders like `$[x]`, `[Period]`, `[Date]` and convert conclusions to missing information.
  (Ref: “Do not invent numbers” in `context/skill/kpmg-fdd/SKILL.md` and sourcing rules in `context/skill/kpmg-fdd/references/writing-standards.md`.)
- Every exhibit must include: title, period, units, and a Source/Basis line.
  (Ref: `context/skill/kpmg-fdd/references/exhibits-and-tables.md`.)
- Any statement that depends on management representation must be labeled (“Management indicated…”, “Management provided…”).
  (Ref: tone and uncertainty rules in `context/skill/kpmg-fdd/references/writing-standards.md`.)
- Normalization caveat must appear once, consistently, at end of Overview:
  Standard caveat (use verbatim meaning, standardized):
  “Potential adjustments reflect information provided by management to date and may not be all-inclusive; additional procedures and access to supporting data could result in changes.”
  (Corpus basis: project-ascend and project-panacea overview caveats in `context/docs/report-mining/section-corpus/sections/working-capital.md`.)

## Working capital definition — required table language

- Use a 3-column table: Included / Excluded / Rationale.
- Rationale must explicitly label exclusions as one of: debt-like, non-operational, capex-related, non-recurring, non-trade/non-current, presentation-only.
  (Corpus examples include debt-like exclusions such as accrued interest and lease liabilities, and non-operating cash treatment; see project-panacea and project-dental in `context/docs/report-mining/section-corpus/sections/working-capital.md`.)

## Normalization approach (required)

- Step 1: Reported WC (per trial balance / balance sheet) for each period.
- Step 2: Definitional adjustments (deal definition alignment; remove cash, debt-like, non-operational).
  (Corpus uses “definitional adjustments” framing; see project-autobahn and project-skyrocket in `context/docs/report-mining/section-corpus/sections/working-capital.md`.)
- Step 3: Diligence adjustments (one-offs, cut-off corrections, out-of-period accruals, unusual timing items).
  (Corpus examples: cut-off methodology alignments, out-of-period entries, one-time bad debt, etc. in `context/docs/report-mining/section-corpus/sections/working-capital.md`.)
- Step 4: Pro forma / run-rate adjustments (only if clearly tied to a QoE pro forma change; label linkage explicitly).
  (Corpus examples: “WC impact of QoE adjustments” and DSO/DPO-based estimations in `context/docs/report-mining/section-corpus/sections/working-capital.md`.)
- Output: normalized range (preferred) or point estimate (only if seasonality is low and supported). If only period-end snapshots exist, include snapshot limitation caveat.
  (Ref pitfall in `context/skill/kpmg-fdd/references/section-templates/working-capital.md`.)

## Peg / target and implications — required phrasing rules

Only include a surplus/deficit conclusion if BOTH are true:

- Target basis/value is sourced (SPA/offer letter/seller schedule), and
- The comparison period is explicit (e.g., “LTM average”, “12 months prior to completion”, “as at close date”).

Standard phrasing options:

- If target is defined in a deal document:
  “Based on the target NWC definition in [Source], normalized NWC for [Period] is $[x] versus a target of $[y], implying a $[delta] surplus/(deficit) on this basis.”
  (Corpus form: “On this basis… deficit compared to the working capital target” in project-y; `context/docs/report-mining/section-corpus/sections/working-capital.md`.)
- If target basis is defined but value not finalized:
  “The deal definition indicates a target based on [basis]. A target value has not been finalized; we have therefore presented normalized NWC by month/quarter and the implied range under the defined basis as an input to negotiations.”
  (Corpus form: offer-letter “defined ‘normal/target’… average of 12 months…” and alternative target framing; `context/docs/report-mining/section-corpus/sections/working-capital.md`.)
- If no target definition:
  “A working capital target/definition has not been provided; we have focused on normalized working capital behavior and key sensitivities. Target mechanics remain a P0 open item.”

## Open-item behavior when data is missing

- Convert missing-data impacts into explicit missing information with priority:
  - P0: prevents normalization or peg conclusion
  - P1: affects sizing of specific adjustments
  - P2: presentation / readability improvements
- Each open item must include “why it matters” and the requested artifact (e.g., “monthly TB by account”, “AR aging as of [date]”).
  (Ref missing information discipline in `context/skill/kpmg-fdd/references/writing-standards.md` and QC requirement in `context/skill/kpmg-fdd/references/qc-checklist.md`.)

## Style rules (2B)

- Lead with the metric + so-what (house rule: “so what” in first 1–2 sentences; `context/skill/kpmg-fdd/references/writing-standards.md`).
- Use corpus-consistent causal language: “primarily driven by… offset by…”, “as a result…”, “on this basis…”
  (Corpus: multiple entries in `context/docs/report-mining/section-corpus/sections/working-capital.md`.)
- Replace spatial references (“adjacent table”) with exhibit labels.
- Avoid absolute claims; label uncertainty and management-sourced items.
- Use consistent periods/units within the section.

## QA checks (5C pass/fail gates)

Hard fail (must fix before delivery)

- Missing definition table.
- Any material number presented without a basis/source line.
- Units/periods inconsistent within the section.
- Placeholder artifacts present: “Not present in source report”, “[ENTITY]”, “DD MM 20X”, “££”, “...”.
  (Ref do-not-deliver gates in `context/skill/kpmg-fdd/references/qc-checklist.md`.)

Standard QC scan

- Evidence–narrative alignment: opening claim is supported by Exhibit WC-1/WC-2 or reframed as open item.
- Normalization caveat included once (not repeated).
- Peg section: only present if target definition/value is sourced; otherwise converted to P0 open item.
- Missing information list present and prioritized (P0/P1/P2).
  (Ref QC dimensions in `context/skill/kpmg-fdd/references/qc-checklist.md`.)
```

5. Draft markdown section template (implementable)

```markdown
# Working capital

## Key takeaway

- Normalized net working capital (“NWC”) for [Period] is $[x] (reported: $[y]), driven primarily by [Driver 1] and [Driver 2]. [Implication sentence: cash flow / peg sensitivity / close-date risk], subject to the deal definition and the data limitations noted below.
- Potential adjustments reflect information provided by management to date and may not be all-inclusive; additional procedures and access to supporting data could result in changes. (Corpus-consistent caveat; see `context/docs/report-mining/section-corpus/sections/working-capital.md`.)

## Working capital definition

**Definition used for this analysis:** [Deal definition name, e.g., “Net Working Capital per draft SPA dated YYYY-MM-DD” or “Management definition (deal definition not provided)”]

| Included (operating)                               | Excluded (non-operating / debt-like / other)                         | Rationale / notes                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Accounts receivable (trade)                        | Cash / restricted cash                                               | Cash is typically treated separately from operating working capital; confirm SPA treatment. |
| Inventory                                          | Debt-like items (e.g., accrued interest, lease liabilities)          | Exclude items driven by financing decisions rather than operating working capital.          |
| Prepaids and other current assets (operating)      | Income taxes payable / sales taxes payable (if defined as debt-like) | Aligns to deal definition; varies by transaction.                                           |
| Accounts payable (trade)                           | Capex payables (if separated)                                        | Capex-related payables are often treated outside operating WC; confirm definition.          |
| Accrued liabilities (operating)                    | Shareholder-related balances / due to sellers                        | Non-operational; expected to settle pre-close or treated outside operating WC.              |
| Deferred revenue / customer deposits (if included) | Other non-trade / non-current balances                               | Ensure classification is consistent with period and source records.                         |

**Basis:** Source: [trial balance extract / balance sheet schedule] dated [YYYY-MM-DD]; management-provided schedules where noted.

## Historical working capital behavior (trend and drivers)

### Trend overview

- Reported NWC averaged $[x] over [Period] and was $[y] as at [Date]. (Units: $[k/m].)
- Adjusted NWC averaged $[x_adj] over [Period]. (Define “adjusted” = post-definitional + diligence adjustments.)

### Key drivers (tie to accounts and periods)

- Accounts receivable: [DSO if available] days in [Period], driven by [billing / collections / customer mix], based on [AR aging / TB].
- Inventory: [DIO if available] days in [Period], with [seasonality / build pattern] if evidenced.
- Accounts payable / accruals: [DPO if available] days in [Period], driven by [terms / timing / one-offs].

**If only period-end snapshots are available:** We have only period-end balances for [Periods], which may not capture intra-year seasonality. (Template-aligned limitation; see `context/skill/kpmg-fdd/references/section-templates/working-capital.md`.)

## Normalized vs actual (definition alignment + diligence adjustments)

### Exhibit WC-1: NWC bridge (Reported → Adjusted/Normalized)

**Period:** [FY2023–FY2025 / TTM to YYYY-MM-DD]  
**Units:** $[k/m]  
**Source:** [trial balance / management WC schedule / sell-side report], dated [YYYY-MM-DD]; KPMG analysis

| Step | Type                      | Description                                                  | Impact on NWC ($) | Basis                               | Residual risk / notes                       |
| ---- | ------------------------- | ------------------------------------------------------------ | ----------------: | ----------------------------------- | ------------------------------------------- |
| 1    | Reported                  | Reported NWC per source                                      |              $[x] | [source line]                       | —                                           |
| 2    | Definitional              | Remove cash / debt-like / non-operating items per definition |              $[x] | [supporting schedule]               | Definition not finalized [if applicable]    |
| 3    | Diligence                 | Cut-off / out-of-period / one-off items                      |              $[x] | [GL detail / management schedule]   | Subject to validation of underlying support |
| 4    | Pro forma (if applicable) | WC impact of QoE pro forma items                             |              $[x] | [QoE bridge ref + method (DSO/DPO)] | Method-based estimate                       |
| 5    | Normalized                | Normalized / targetable NWC                                  |              $[x] | —                                   | Present as range if seasonality exists      |

### Key diligence adjustments (narrative summary)

For each material adjustment, use this structure (corpus-consistent “This adjustment…” pattern; see `context/docs/report-mining/section-corpus/sections/working-capital.md`):

- **[Adjustment name] (Type: definitional / diligence / pro forma):** [What it is]. This adjustment [removes/excludes/normalizes/reallocates] [account] to reflect [rationale]. **Impact:** $[x] (increase/(decrease) NWC). **Basis:** [source]. **Residual risk:** [what could change].
- **[Adjustment name]:** …

## Peg / target and close implications (conditional)

### Deal target status

- **Target definition provided:** [Yes/No]. **Source:** [SPA/offer letter/seller schedule], dated [YYYY-MM-DD].
- **Target basis:** [e.g., “12-month average prior to completion”] (use explicit basis wording where applicable; corpus example in `context/docs/report-mining/section-corpus/sections/working-capital.md`).
- **Target value:** $[y] (if agreed) / Not provided (P0).

### Comparison to target (only if target value is sourced)

- Based on the target definition in [Source], normalized NWC for [Period] is $[x] versus a target of $[y], implying a $[delta] surplus/(deficit) on this basis. (Corpus-consistent “On this basis…” deficit framing; see project-y in `context/docs/report-mining/section-corpus/sections/working-capital.md`.)

### Implications and sensitivities

- **Cash flow sensitivity:** [qualitative; quantify only if supported by data].
- **Close-date considerations:** [seasonality / known spikes / timing items].
- **Negotiation considerations (if applicable):** If the deal target is based on a historical averaging period, changes in the business trajectory may imply a different forward-looking target; present this as an analytical sensitivity, not a conclusion. (Corpus example: offer-letter passage and implied target step-up; `context/docs/report-mining/section-corpus/sections/working-capital.md`.)

## Missing information & data requests (required; prioritize)

### P0 (gates conclusions)

- [ ] Provide deal definition of NWC (included/excluded accounts; treatment of cash and debt-like items) and target basis/value. **Why it matters:** required to conclude on surplus/deficit vs target.
- [ ] Provide monthly/quarterly balance sheet detail for WC accounts for [Period]. **Why it matters:** required to assess seasonality and derive normalized range.

### P1 (improves sizing/defensibility)

- [ ] AR aging by month-end for [Period]; credit notes/rebates detail. **Why it matters:** supports DSO and AR normalization.
- [ ] AP aging by month-end; capex payables identification. **Why it matters:** supports DPO and definitional separations.
- [ ] Inventory detail / reserves (if applicable). **Why it matters:** supports DIO and obsolescence considerations.
- [ ] Deferred revenue / customer deposits detail (if applicable). **Why it matters:** supports inclusion/exclusion and seasonality.

### P2 (presentation / completeness)

- [ ] Confirm any known one-off events affecting WC (cut-off changes, programs like factoring, etc.) and provide supporting schedules.
```

If you want, the next logical step (still no questions needed) is to diff these drafts against the current baseline at `context/skill/kpmg-fdd/references/section-templates/working-capital.md` and `context/skill/kpmg-fdd/references/analysis-playbooks/working-capital-playbook.md`, then translate the differences into prompt rules + lint checks in the skill’s implementation layer.
