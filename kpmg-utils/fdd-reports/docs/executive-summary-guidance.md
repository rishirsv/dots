Starting from `context/MANIFEST.md`, this zip is explicitly scoped to a section-focused build for “01-executive-summary”, with **style target 2B** and **quality gate 5C** locked, and it includes (i) a verbatim-validated executive summary corpus and (ii) the current executive summary template + house writing/QC standards (`context/MANIFEST.md` (L10-L23), `context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md`, `context/skill/kpmg-fdd/references/section-templates/executive-summary.md`).

Assumptions I will hold (and encode in the playbook/template): this “Executive summary” is for an FDD report where default scope includes **QoE + Working capital + Net debt/debt-like + key risks** unless explicitly out-of-scope (`context/skill/kpmg-fdd/references/workflow.md` (L19-L27); `context/skill/kpmg-fdd/references/section-templates/executive-summary.md` (L12-L25)). When data is missing, we do **not invent numbers** and instead use placeholders + missing information (`context/skill/kpmg-fdd/SKILL.md` (L71-L72); `context/skill/kpmg-fdd/references/writing-standards.md` (L6-L13); `context/skill/kpmg-fdd/references/qc-checklist.md` (L9-L16)).

1. Linguistic analysis (section-specific)

A) Sentence length / cadence patterns (what the corpus actually does)

1. Bullet-first delivery dominates. Most corpus entries present as bullet lists without subheadings (e.g., “Reported EBITDA…”; “Revenue: …”; “Net debt adjustments: …”) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L61-L65, L444-L449)).
2. “1 sentence per bullet” is the prevailing cadence. Where there are 2 sentences, the second is usually an explanation/driver or a caveat (e.g., the “Revenue:” bullet has a second sentence quantifying volume change) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L445)).
3. Headline-first compression appears in two common forms:
   - Metric label + colon + punchy explanation (“Revenue: …”, “EBITDA: …”, “Net cash reported: …”) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L445-L449)).
   - “Reported → Adjusted” bridge phrasing (“Reported EBITDA … increases to … subsequent to … adjustments”) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L61-L62)).

Keep as-is patterns (recommended to preserve in 2B)

- Bullets with a leading label + colon (Revenue/EBITDA/Net debt/Net cash). This is high signal, executive-readable, and naturally enforces topic compression (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L445-L449)).
- “Reported → Adjusted” one-line bridge statements (add basis in house-standard form) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L61-L62); `context/skill/kpmg-fdd/references/writing-standards.md` (L36-L55)).

Normalize/clean patterns (keep intent; standardize the form)

- Bullets that are too long and enumerate 6–8 drivers with semicolons should be trimmed to top 3–5 drivers and pushed to the relevant workstream section; keep only the headline driver set in exec summary (see long multi-driver bullets) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L465-L472)).
- Slide-conversion artifacts (stray “■”, broken line wraps like “Transaction ■ … perimeter”, orphaned words like “perimeter”) should be normalized into proper sub-bullets under “Entities included/excluded” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L297-L308)).

Avoid patterns (should not survive 2B standardization)

- Investment-thesis language framed as a recommendation (e.g., “We recommend investment… ~63% upside…”). This reads like a deal pitch, not a balanced diligence summary (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L97-L103); contrast with the house “factual and balanced” requirement in `context/skill/kpmg-fdd/references/writing-standards.md` (L6-L17)).
- “Purely descriptive” summaries that only list what was reviewed (sources) without findings or missing information (explicitly a do-not-deliver QC failure) (`context/skill/kpmg-fdd/references/qc-checklist.md` (L9-L16); examples of source-only bullets in `context/docs/report-mining/section-corpus/sections/executive-summary.md` (L41-L46)).

B) Hedge / certainty phrasing patterns
Observed corpus hedges (useful, but should be disciplined)

- Attribution hedge for context: “It is our understanding that …” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L41)).
- Forecast hedge: “appears achievable… although… inherently dependent on…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L425)).
- Reasonableness hedge + next-step linkage: “assumptions appear broadly reasonable… however we recommend that you consider…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L426)).
- “Potential adjustments” hedge (signals non-final or buyer-side overlays): “£0.2m of potential adjustments…” / “Potential adjustments identified…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L62, L424-L426)).

Keep as-is patterns

- Use “We understand / It is our understanding” strictly for deal context or process facts not independently verified (aligns with “explicit about uncertainty”) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L41); `context/skill/kpmg-fdd/references/writing-standards.md` (L14-L17)).
- Use “appears / may / could / potential” when conclusions are conditional on missing information or management-provided forecasts, but pair it with the “what would change the conclusion” clause.

Normalize/clean patterns

- Replace vague certainty drift (“successful”, “strong”) with either quantified support or explicit attribution (“Management forecasts…”, “Based on TB…”) (`context/skill/kpmg-fdd/references/writing-standards.md` (L14-L33)).
- Convert passive hedges into structured uncertainty statements: “Conclusion depends on [X]; open item [P0-#]” (ties to missing-information discipline) (`context/skill/kpmg-fdd/references/writing-standards.md` (L64-L78)).

Avoid patterns

- Unqualified absolutes (“no risk”, “fully normalized”) unless explicitly supported; house standards explicitly warn against unqualified absolutes (`context/skill/kpmg-fdd/references/writing-standards.md` (L18-L22)).

C) Transition logic patterns (how bullets connect)
Dominant transition mechanics in corpus

- Cause → effect: “driven by…”, “due to…”, “primarily…”, “predominantly…”, often in the same sentence (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L423, L445-L447, L465-L467)).
- Contrast / condition: “although…”, “however…” used to qualify forecasts or reasonableness (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L425-L426)).
- Comparison framing: “from…to…”, “as compared to…”, “over the same period…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L423-L426)).

Keep as-is patterns

- “Metric moved from A to B; driven by X/Y” is the highest-signal exec-summary transition pattern.

Normalize/clean patterns

- Ensure each causal connector (“driven by”, “due to”) points to 1–3 drivers max; push the rest down into the relevant section.
- Standardize “as at [date]” statements for balance sheet items (net debt, NWC) and include the “as-of date” explicitly (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L473); also align with “period definitions” consistency `context/skill/kpmg-fdd/references/writing-standards.md` (L58-L63)).

Avoid patterns

- Orphan “label bullets” separate from the meaning (e.g., the garrison pattern that alternates a long bullet and then a short label like “Greater reliance on fee income”) because it doubles length without adding information in a report context (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L181-L189)).

D) Quantification phrase patterns
High-signal quantification formats in corpus

- Reported vs adjusted bridge: “Reported EBITDA of $X in [period] increases to $Y subsequent to [adjustments]” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L61)).
- “Potential adjustments” delta: “potential adjustments… increasing/decreasing… to…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L62, L424)).
- Growth framing: “revenue growth of £X… EBITDA growth from £A to £B… driven by…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L423)).
- Forecast/CAGR: “forecast to increase by… (CAGR)… driven by…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L426, L465)).
- Cash conversion: “operating cash flow conversion averaging 91%…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L404)).

Keep as-is patterns

- “from A to B” and “increase by C” structures, always with a period anchor (FY/LTM/TTM) and units.
- “approximately” when precision is not available (paired with basis + open item if material).

Normalize/clean patterns

- Replace “~” with “approx.” in final prose (house-standard professionalism). The corpus uses “~” in at least one pitch-style entry (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L97-L99)); standardize it away in FDD writing.
- Ensure every numeric bullet has either an inline basis (“Source: …”) or a block-level basis line (house rules) (`context/skill/kpmg-fdd/references/writing-standards.md` (L36-L55); `context/skill/kpmg-fdd/SKILL.md` (L72)).

Avoid patterns

- Truncated ellipses “…” inside bullets (seen in a simulated extract) because they are not client-deliverable and hide meaning (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L377-L378)).

E) Caveat / disclaimer patterns
Common disclaimer “clusters”

1. Reporting basis + currency: “reports under US GAAP… numbers in USD… unless otherwise noted” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L257-L261)).
2. Sources reviewed: “prepared based on… trial balances… audited / reviewed financial statements… discussions with Management” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L63-L65)).
3. Limitations / completeness: “not necessarily all-inclusive… based on information provided by Management to date” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L65)).
4. Audit coverage differences / entity complexity: audited vs not audited entities; intercompany eliminations not performed (observed in ascend) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L20-L27)).

Keep as-is patterns

- “Basis and limitations” language belongs in exec summary, but must be short and clearly attributed.

Normalize/clean patterns

- Move long entity lists into an appendix or “Reporting environment” section; exec summary should only state the perimeter at a high level (the halley extract is a cautionary example of over-detailed perimeter in the summary) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L297-L305)).
- Convert disclaimers into 1–3 bullets under “Scope and basis” rather than interspersing them randomly among findings (improves executive scan).

Avoid patterns

- Disclaimers without findings (source-only summaries) because QC forbids an exec summary that is purely descriptive with no key findings and missing information (`context/skill/kpmg-fdd/references/qc-checklist.md` (L9-L16)).

2. Structural analysis

A) Dominant internal structure variants in corpus
Variant 1: “Company + reporting environment” bullet list (often missing “so what”)

- Company description, audit status, GAAP, entity list, intercompany elimination caveat (e.g., ascend) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L15-L27)).
  Strength: defensibility context. Weakness: can become descriptive and miss decisions.

Variant 2: “Sources reviewed” only (process-first, findings-light)

- “Key sources… trial balances… data room… meetings…” (autobahn) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L41-L46)).
  Strength: basis transparency. Weakness: fails QC if it lacks findings/missing information (`context/skill/kpmg-fdd/references/qc-checklist.md` (L9-L16)).

Variant 3: “Key financial findings” (metrics + drivers + adjustments)

- Reported→adjusted bridge, potential adjustments, forecast commentary, cash conversion (y-sell-side; yukon; cherry) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L61-L65, L423-L428, L444-L449)).
  Strength: decision-useful. Weakness: can omit explicit risks/missing information.

Variant 4: “Risk headline list” (sometimes duplicated label/explanation bullets)

- Alternating headline and explanation bullets (garrison) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L181-L191)).
  Strength: scannable topics. Weakness: wastes space; lacks mitigants/prioritization.

Variant 5: “Forecast/business plan fact-book” (long, multi-topic)

- Many bullets across forecast, net debt, debt-like, WC, capex, QoE in one long chain (z fact book) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L465-L498)).
  Strength: breadth. Weakness: not executive-compressed; mixes workstreams.

Variant 6: “Not present” (missing section in source report)

- Several entries explicitly say “Not present in source report” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L81, L131, L147, L241, L324, L357, L390)).
  Implication: the skill must be able to generate exec summaries even when no precedent exists.

B) Recommended default structure (for the skill)
Use the existing template’s 4-block structure as the default, but strengthen it with house-standard basis + risk/open-item discipline (`context/skill/kpmg-fdd/references/section-templates/executive-summary.md` (L8-L25); `context/skill/kpmg-fdd/references/writing-standards.md` (L36-L55, L64-L78)):

Default structure (mandatory blocks)

1. Deal and scope at a glance
2. Key conclusions by workstream (bullets) — minimum set if in-scope: QoE, Working capital, Net debt/debt-like (`context/skill/kpmg-fdd/references/section-templates/executive-summary.md` (L12-L17))
3. Top risks and mitigants (ranked; include severity) (`context/skill/kpmg-fdd/references/section-templates/executive-summary.md` (L18-L21); `context/skill/kpmg-fdd/references/writing-standards.md` (L73-L78))
4. Missing information that could move conclusions (P0/P1) (`context/skill/kpmg-fdd/references/section-templates/executive-summary.md` (L22-L25); `context/skill/kpmg-fdd/references/qc-checklist.md` (L48))

Allowed variants (but must preserve the 4-block spine)

- Short-form / early draft: If financial quantification is missing, keep the workstream headings but convert key conclusions into (i) what we observed qualitatively, (ii) what is needed to quantify, and (iii) the open item(s) that gate the conclusion (aligns to “ask for missing inputs rather than inventing details” and missing-information discipline) (`context/skill/kpmg-fdd/references/writing-standards.md` (L8-L13, L64-L78); `context/skill/kpmg-fdd/SKILL.md` (L71-L72)).
- Sell-side / forecast-heavy context: Add an optional “Forecast / trading (management case)” sub-block under “Key conclusions” only if forecast data is in-scope; hedge it explicitly (“Management forecast”, “appears achievable… depends on…”) and link the dependency to commercial diligence (pattern already present in y-sell-side) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L425-L426)).

Required vs optional sub-blocks
Required (always)

- Deal/scope snapshot (include currency + reporting basis; include “sources reviewed” at a high level) (patterns: autobahn + greyhound) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L41-L46, L257-L261))
- Key conclusions (even if qualitative placeholders)
- Risks & mitigants (ranked)
- Missing information (prioritized P0/P1/P2; at least one item unless explicitly confirmed “none”) (`context/skill/kpmg-fdd/references/qc-checklist.md` (L48))

Optional (include only if supported by inputs)

- Transaction perimeter detail (entities included/excluded) — include when carve-outs / perimeter complexity is real, but keep it tight (normalize halley-style artifacts into clean bullets) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L297-L305))
- Summary metrics table (mini table) if numbers exist and are stable; otherwise omit.
- Suggested exhibits list (internal drafting aid; not required for client-facing section) (`context/skill/kpmg-fdd/references/section-templates/executive-summary.md` (L26-L29)).

3. Failure-mode analysis

Below are the highest-frequency “generation failures” for executive summaries in this corpus + house system, with concrete detection heuristics and prevention controls anchored in the repo’s QC/standards.

Failure mode 1: Process-only / descriptive exec summary (no findings)

- What it looks like: bullets like “Key sources… data room… meetings…” with no conclusions (autobahn pattern) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L41-L46)).
- Why it fails: explicit “do not deliver” QC failure if exec summary is purely descriptive with no key findings and missing information (`context/skill/kpmg-fdd/references/qc-checklist.md` (L9-L16)).
- Detection heuristic (lintable):
  - Missing “Key conclusions” workstream bullets (QoE/WC/Net debt) OR
  - No numeric/impact language AND no risk/missing information section.

- Prevention controls:
  - Template constraint: require ≥2 “Key conclusions” bullets per in-scope workstream.
  - Prompt rule: “Every block must contain at least one ‘so what’ sentence.” (align to writing standards) (`context/skill/kpmg-fdd/references/writing-standards.md` (L81-L82)).

Failure mode 2: Missing missing information / false confidence

- Why it fails: missing information must exist and be prioritized (P0/P1/P2) (`context/skill/kpmg-fdd/references/qc-checklist.md` (L48)); writing standards require a running missing information list and gating items (P0) (`context/skill/kpmg-fdd/references/writing-standards.md` (L64-L72)).
- Detection heuristic:
  - No “Missing information…” block OR block has 0 items OR no “P0/P1/P2” tokens.

- Prevention controls:
  - Template: missing information table is mandatory with at least one row; if truly none, include a single row stating “No material missing information identified” (only when supported by inputs).

Failure mode 3: Salesy / investment recommendation tone

- What it looks like: “We recommend investment… upside potential…” (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L97-L103)).
- Why it fails: conflicts with “factual and balanced; do not minimize risks” (`context/skill/kpmg-fdd/references/writing-standards.md` (L6-L17)).
- Detection heuristic:
  - Regex keyword list: `recommend investment|upside|scalability|attractive opportunity` (case-insensitive).

- Prevention controls:
  - Banned phrase list in prompt + lint; rewrite into diligence framing (“Key value drivers observed…”, “Key risks…”, “Implications for valuation/terms…”).

Failure mode 4: Invented numbers or unlabeled placeholders

- Why it fails: “Do not invent numbers… use placeholders such as $[x]” (`context/skill/kpmg-fdd/SKILL.md` (L71)); QC flags invented placeholders not labeled (`context/skill/kpmg-fdd/references/qc-checklist.md` (L13-L14)).
- Detection heuristic:
  - Presence of `$X`, `TBD`, `XX`, `…` without bracketed placeholder syntax `$[x]` / `[Date]`.

- Prevention controls:
  - Hard template placeholders; prohibit raw “X/XX/TBD/…” in final output.
  - Rule: any unresolved metric must be accompanied by an open item row.

Failure mode 5: Quantitative claims without basis/source

- Why it fails: material quantitative claims must have basis (`context/skill/kpmg-fdd/SKILL.md` (L72)); QC do-not-deliver if quantitative claims have no basis and not flagged as missing information (`context/skill/kpmg-fdd/references/qc-checklist.md` (L11-L16)).
- Detection heuristic:
  - If a bullet contains a digit or currency symbol, the same workstream block must contain “Basis:”/“Source:” line OR the bullet itself includes “Source: …”.

- Prevention controls:
  - Enforce one “Basis:” line per workstream block, minimum.
  - If basis is missing, convert to open item (“Provide TB extract dated… to support $[x]”).

Failure mode 6: Scope ambiguity (what’s in/out) and perimeter confusion

- Seen in corpus: perimeter details can be messy (halley artifacts) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L297-L308)).
- Detection heuristic:
  - Missing “In-scope / Out-of-scope” line(s) OR missing “Periods covered” line.

- Prevention controls:
  - Make scope a mandatory “at a glance” block line item (template constraint).

Failure mode 7: Overlong executive summary (not executive-readable)

- Seen in corpus: long fact-book chain (z) (`context/docs/report-mining/section-corpus/sections/executive-summary.md` (L465-L498)).
- Detection heuristic:
  - > 18 bullets OR >450–600 words OR nested bullets >1 level.

- Prevention controls:
  - Compression rule: top 3 conclusions per workstream; push detail to sections.

4. Draft markdown playbook (implementable)

```markdown
# Executive summary — Section Playbook (Style 2B, Quality Gate 5C)

## Objective

Give the decision-maker the decision-useful conclusions quickly:

1. what we found (facts),
2. what it means (implications),
3. what could change (risks + missing information).

Anchor requirements:

- Executive summary must not be purely descriptive; it must include key findings and missing information. (context/skill/kpmg-fdd/references/qc-checklist.md)
- Tone must be factual and balanced; do not minimize risks; label uncertainty. (context/skill/kpmg-fdd/references/writing-standards.md)
- Do not invent numbers; if missing, use placeholders like $[x], [Date] and log as missing information. (context/skill/kpmg-fdd/SKILL.md)

## Required inputs (use what exists; do not block)

Deal / scope

- Target name: [Target]
- Deal context: [Buy-side / Sell-side], [Investor/Buyer], [Deal type], [Stage]
- Periods covered: [FY____–FY____], [LTM/TTM as-of], [As-of date]
- Currency + reporting basis: [USD/CAD/GBP], [US GAAP/IFRS/ASPE], audit coverage notes
- Entities/perimeter (only if relevant): included/excluded entities; carve-out notes
- Workstreams in-scope vs out-of-scope

Evidence / basis (for defensibility)

- Sources reviewed: [Audited FS], [TB], [GL], [Mgmt adjustment schedule], [Data room], [Management calls]
- For each numeric claim, confirm: period + units + source/basis

Findings content (by workstream)

- QoE: reported EBITDA, adjustments, adjusted EBITDA (or placeholder), sustainability commentary, key residual risks
- Working capital: NWC profile, indicative peg (or placeholder), peg adjustment themes, seasonality / volatility
- Net debt: as-of net debt (or placeholder), key debt-like items, notable classification issues
- Optional (only if in-scope): forecast/trading, capex, tax, accounting/audit environment

Risk + missing information

- 3–7 top risks ranked by severity with mitigants/next steps
- Missing information list prioritized (P0/P1/P2), including gating items (P0)

## Canonical block order (do not reorder in default mode)

1. Deal and scope at a glance
2. Key conclusions by workstream
3. Top risks and mitigants (ranked)
4. Missing information that could move conclusions (prioritized)

## Block-level drafting rules

### 1) Deal and scope at a glance (required)

Write 6–10 bullets maximum.
Must include:

- Target + transaction context
- Periods covered
- Currency + reporting basis
- In-scope vs out-of-scope workstreams
- High-level sources reviewed (1 bullet)
- Limitations (1 bullet: management-provided, not audited, preliminary, etc.)

### 2) Key conclusions by workstream (required)

Use subheadings per workstream.
Minimum set if in-scope: QoE, Working capital, Net debt/debt-like. (context/skill/kpmg-fdd/references/section-templates/executive-summary.md)

For each workstream, include (in this order):
A) Headline conclusion (1 bullet)
B) Quantified support (1–2 bullets) OR placeholder + open item if missing
C) Drivers / explanation (1–3 bullets)
D) What could change (1 bullet: residual risk / sensitivity / dependency)
E) Basis line (1 line, required): “Basis: …”

Quantified bullet format (preferred):

- “[Metric]: [from A to B / A → B] over [Period], driven by [Driver 1–3]. (Units: $m; Source: [basis])”
  Alternate compressed format:
- “Reported EBITDA: $[x] → Adjusted EBITDA: $[x] ([Period], $[units]). (Basis: [basis])”

Forecast content (optional):

- Only include if forecast data is provided or clearly in-scope.
- Label as “Management forecast” and hedge appropriately (“appears achievable… depends on…”).
- Tie dependencies to missing information (e.g., customer acquisition trends, pricing, volume).

### 3) Top risks and mitigants (required)

3–7 bullets ranked by severity.
Format each risk as:

- “P[0/1/2] — [Risk title]: [What it is]. Why it matters: [impact]. Mitigant/next step: [action]. Potential valuation/terms impact: [qual or $/range if available].”

Severity guidance (use consistent language):

- Deal-breaker / Significant / Manageable (context/skill/kpmg-fdd/references/writing-standards.md)

### 4) Missing information that could move conclusions (required)

Provide a prioritized table.
Rules:

- P0 = gating items (block conclusions until resolved)
- P1 = could change sizing/ranges materially
- P2 = clean-up / confirmatory
- If a required metric is missing, it must appear here as an open item.

## Evidence / basis rules (defensibility)

- Facts vs judgments must be labeled in wording:
  - Facts: “Based on [source], …”
  - Judgments: “We view … as [uncertain/sustainable] because …”
    (context/skill/kpmg-fdd/references/writing-standards.md)
- Every material quantitative claim must have a basis/source line. (context/skill/kpmg-fdd/SKILL.md; context/skill/kpmg-fdd/references/qc-checklist.md)
- If basis is missing, do not invent; convert to an open item and use placeholders. (context/skill/kpmg-fdd/SKILL.md)

## Open-item behavior when data is missing

- Never delete a required block because data is missing.
- Use placeholders:
  - Amounts: $[x]
  - Dates: [Date]
  - Periods: [FY____–FY____] / [LTM as-of ___]
- Add a matching open item row:
  - “Provide [document] to support [metric] for [period].”
- Reframe conclusions as conditional:
  - “Conclusion is preliminary pending [P0 item].”

## Style rules (2B: corpus-inspired + house-standardized)

Cadence

- Prefer bullets over paragraphs.
- Aim for 10–25 words per bullet; 1 sentence per bullet; max 2 sentences only when needed.
- Start bullets with the “so what” (conclusion) before detail. (context/skill/kpmg-fdd/references/writing-standards.md)

Language

- Use causal connectors (“driven by”, “due to”, “primarily”) to compress drivers.
- Use disciplined hedges (“We understand”, “appears”, “based on management-provided data”) when appropriate.
- Avoid salesy or recommendation language (e.g., “We recommend investment”, “upside potential”).
- Avoid unqualified absolutes. (context/skill/kpmg-fdd/references/writing-standards.md)

Consistency

- Keep units and periods consistent within the section and with the report. (context/skill/kpmg-fdd/references/writing-standards.md)
- If definitions differ, state the difference explicitly.

## QA checks and pass/fail gates (5C)

Hard fail (do not deliver)

- Missing Executive summary OR it is purely descriptive with no key findings and missing information. (context/skill/kpmg-fdd/references/qc-checklist.md)
- Any invented numbers or unlabeled placeholders. (context/skill/kpmg-fdd/SKILL.md; context/skill/kpmg-fdd/references/qc-checklist.md)
- Material quantitative claims without basis/source and not flagged as missing information. (context/skill/kpmg-fdd/references/qc-checklist.md)
- No missing information list prioritized P0/P1/P2. (context/skill/kpmg-fdd/references/qc-checklist.md)

Must-pass checks

- Block order follows canonical order.
- For each in-scope workstream: ≥2 conclusion bullets + a “Basis:” line.
- Risks: 3–7 ranked items, each with mitigant/next step.
- Missing information: ≥1 item; includes all missing gating inputs.
- Tone: balanced; at least one explicit risk/uncertainty statement. (context/skill/kpmg-fdd/references/writing-standards.md)

## Automatable lint checks (recommended)

- Required headings present: “Deal and scope…”, “Key conclusions…”, “Top risks…”, “Missing information…”
- Keyword bans: “recommend investment”, “upside”, “scalability”
- Placeholder hygiene: forbid raw “TBD/XX/…”; enforce $[x]/[Date]
- Numeric basis rule: if digit present in a workstream block, ensure “Basis:” exists in that block
- Open item priority rule: table includes “P0”, “P1”, “P2”
```

5. Draft markdown template (implementable)

```markdown
## Executive summary

### 1) Deal and scope at a glance

- **Target:** [Target legal name] (“[Short name]”) <!-- REQUIRED -->
- **Transaction:** [Buy-side / Sell-side] — [Investor/Buyer] evaluating [deal type / structure] <!-- REQUIRED -->
- **Period(s) covered:** [FY____–FY____] and [LTM/TTM ended ___] <!-- REQUIRED -->
- **Reporting basis / currency:** [US GAAP / IFRS / ASPE]; figures in [USD/CAD/GBP], unless otherwise noted <!-- REQUIRED -->
- **Scope (in-scope workstreams):** [QoE / Working capital / Net debt] <!-- REQUIRED -->
- **Scope (out-of-scope):** [Tax / Capex / Forecast / Other] <!-- OPTIONAL but recommended -->
- **Key sources reviewed:** [Audited FS], [Trial balance], [GL], [Management adjustment schedule], [Data room], [Management discussions] <!-- REQUIRED (list what exists) -->
- **Limitations:** Analysis is based on management-provided information reviewed to date; items noted below remain open and could change conclusions <!-- REQUIRED -->

### 2) Key conclusions by workstream

#### QoE / earnings normalization (include only if in-scope)

- **Headline conclusion:** [One sentence conclusion on earnings quality and what changed vs reported] <!-- REQUIRED if in-scope -->
- **Reported EBITDA:** $[x] ([Period], $[units]) <!-- REQUIRED if data exists -->
- **Adjusted EBITDA:** $[x] ([Period], $[units]) — change of $[x] vs reported <!-- REQUIRED if data exists -->
- **Key adjustments (top 3):**
  - [Adjustment 1]: $[x] — [why non-recurring / run-rate] (Source: [basis]) <!-- REQUIRED if adjustments exist -->
  - [Adjustment 2]: $[x] — [why] (Source: [basis])
  - [Adjustment 3]: $[x] — [why] (Source: [basis])
- **What could change:** [Residual risk / sensitivity / dependency tied to missing information] <!-- REQUIRED -->
- **Basis:** Source: [TB extract dated ____], [management adjustment schedule dated ____], [audited FS FY____–FY____] <!-- REQUIRED -->

> If any QoE metric is missing, use $[x] placeholders and add a P0/P1 open item below.

#### Working capital and peg implications (include only if in-scope)

- **Headline conclusion:** [One sentence on NWC profile and peg implications] <!-- REQUIRED if in-scope -->
- **Observed NWC profile:** [negative/positive], [trend], [seasonality note] <!-- REQUIRED -->
- **Indicative peg (if defined):** $[x] as of [Date] (Units: $[units]) <!-- OPTIONAL -->
- **Key drivers / adjustments:** [1–3 bullets max] <!-- REQUIRED -->
- **What could change:** [Residual risk tied to missing information] <!-- REQUIRED -->
- **Basis:** Source: [monthly BS/TB], [AR/AP listings], [management working capital schedule] <!-- REQUIRED -->

#### Net debt and debt-like items (include only if in-scope)

- **Headline conclusion:** [One sentence on net debt position and key debt-like items] <!-- REQUIRED if in-scope -->
- **As-of net debt:** $[x] as of [Date] (Units: $[units]) <!-- OPTIONAL if data exists -->
- **Key debt-like items identified:** [e.g., leases, bonuses, provisions] <!-- REQUIRED -->
- **Notable classification items:** [e.g., item recorded as debt but should be equity] <!-- OPTIONAL -->
- **What could change:** [Residual risk tied to missing information] <!-- REQUIRED -->
- **Basis:** Source: [BS/TB as of ____], [debt schedule], [supporting agreements] <!-- REQUIRED -->

#### Other observations (only if in-scope / provided)

- **Forecast / trading (management case):** [Headline + 1–3 bullets; explicitly labeled as management forecast]
- **Accounting / audit environment:** [Audit coverage / reporting changes if decision-useful]

### 3) Top risks and mitigants (ranked)

- **P0 — [Risk title]:** [What it is]. **Why it matters:** [impact]. **Mitigant/next step:** [action]. **Potential impact:** [$[x] / qualitative] <!-- REQUIRED -->
- **P1 — [Risk title]:** [What]. **Why it matters:** [impact]. **Mitigant/next step:** [action]. **Potential impact:** [qual/$] <!-- REQUIRED -->
- **P2 — [Risk title]:** [What]. **Why it matters:** [impact]. **Mitigant/next step:** [action]. **Potential impact:** [qual/$] <!-- REQUIRED -->

> Keep 3–7 risks. Use “Deal-breaker / Significant / Manageable” language inside bullets if needed.

### 4) Missing information that could move conclusions (prioritized)

| Priority | Open item / request                                                 | Why it matters                               | Potential impact (direction / magnitude)          | Owner   | ETA    | Status |
| -------- | ------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------- | ------- | ------ | ------ |
| P0       | [Provide TB extract dated ____ and reported→adjusted EBITDA bridge] | [Gates adjusted EBITDA conclusion]           | [Could change adjusted EBITDA by $[x]]            | [Owner] | [Date] | Open   |
| P1       | [Provide customer concentration detail / contract terms]            | [Confirms sustainability of revenue/margins] | [May change risk assessment / valuation multiple] | [Owner] | [Date] | Open   |
| P2       | [Confirm classification of [item] as debt-like vs equity]           | [Net debt accuracy]                          | [Potential reclass of $[x]]                       | [Owner] | [Date] | Open   |
```

If you want this to drop directly into the current repo structure with minimal churn, the playbook above can live as a new reference doc alongside the existing baseline template, and the template draft can replace/extend the current `context/skill/kpmg-fdd/references/section-templates/executive-summary.md` (which currently defines structure at a high level but does not enforce basis/open-item mechanics) (`context/skill/kpmg-fdd/references/section-templates/executive-summary.md` (L8-L33)).
