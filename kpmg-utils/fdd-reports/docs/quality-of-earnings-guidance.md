I started from `context/MANIFEST.md`, which locks the writing targets (style 2B; quality gate 5C) and requires concrete markdown playbook + template drafts with no clarification questions. (`context/MANIFEST.md:L11-L14`). The section corpus is explicitly “verbatim section text” generated from `extracted/cleaned/*.md`. (`context/docs/report-mining/section-corpus/README.md:L3-L4`). The corpus (including the QoE section file and the QoE adjustment library) is also validated as verbatim with an overall **pass**, **0 failures**, including `qoe-and-earnings-adjustments.md` and `qoe-adjustments-library.md`. (`context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L3-L24`).

Assumptions I’m proceeding with (explicit, to avoid questions):

- Default metric for this section is **EBITDA**, but the template supports alternates (EBT / pre-tax income / net income to EBITDA bridges) because the corpus includes these patterns. (e.g., net income → EBITDA bridge language appears in the corpus; `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2059-L2063`).
- The section must always include a **reported → adjusted bridge** and the bridge must be auditable (basis lines, recurrence labels), even if values are placeholdered; this is a hard QC gate. (`context/skill/kpmg-fdd/references/report-structure.md:L128-L136`, `context/skill/kpmg-fdd/references/qc-checklist.md:L8-L14`, `context/skill/kpmg-fdd/SKILL.md:L71-L73`).

---

## 1) Linguistic analysis

Below are section-specific language patterns observed in the verbatim corpus and adjustment library, organized by pattern type and then by “keep / normalize / avoid”.

### A) Sentence length and cadence patterns

Observed patterns (section-specific):

- “Executive lead” cadence in the Overview often uses 1–2 short sentences that state the bridge direction (reported → adjusted) and then a transition like “Significant adjustments are discussed…” (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L18-L20`).
- Adjustment rationales typically follow a 2-step cadence:
  1. **Headline sentence** naming the adjustment and action verb (“This adjustment removes… / reflects… / eliminates… / reverses…”) (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L35-L38`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L54-L55`).
  2. **Support sentence(s)** giving period-specific facts, quantification method, and/or basis (“We obtained invoices… no discrepancies noted.”) (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L38-L38`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L54-L54`).

- Long, multi-clause sentences appear when the rationale includes (i) background, (ii) chronology, and (iii) accounting treatment; they are defensible but need normalization to meet house readability standards (use headings/bullets; keep “so what” early). (`context/skill/kpmg-fdd/references/writing-standards.md:L78-L81`)

Keep as-is patterns:

- Lead with the “bridge delta” sentence when numbers exist (“reported EBITDA of $X increases/decreases to $Y after adjustments”). This is both client-readable and ties directly to the bridge exhibit. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L18-L18`)
- Use “This adjustment [verb] …” as the standard headline for each adjustment rationale (high signal; common across corpus). (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L35-L35`)

Normalize/clean patterns:

- Break long adjustment rationales into a short headline + bullets for: (i) recurrence logic, (ii) quantification method, (iii) basis reviewed, (iv) residual risk. This aligns with the explicit defensibility checklist for adjustments. (`context/skill/kpmg-fdd/references/writing-standards.md:L47-L54`)
- Replace “table below / adjacent table / following pages” with “Exhibit [#]” so references remain correct after formatting changes (DOCX conversion, exhibit reordering). The corpus uses “table below/adjacent” frequently; the house standard is exhibit discipline (title/period/units/source). (`context/skill/kpmg-fdd/references/exhibits-and-tables.md:L17-L33`)

Avoid patterns:

- “Not present in source report” as narrative content. This appears as a corpus extraction artifact and is not client-ready; in the skill output it should become an open item or be omitted. (Phrase occurs in the corpus; e.g., `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L63-L63`.)
- Copy/paste duplication artifacts (e.g., repeated clause around punctuation / colon duplication) that can occur in redacted/simulated entries; these need lint detection (see failure modes).

### B) Hedge vs certainty phrasing patterns

Observed patterns:

- Management attribution: “Management represents that…”, “Management informed us…”, “According to Management…” (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L40-L41`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L57-L57`)
- Practitioner hedge: “We understand that…”, often paired with “Based on discussions…” (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L35-L36`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L46-L46`)
- Practitioner certainty via evidence: “We obtained supporting invoices… no discrepancies noted.” (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L38-L38`)
- Practitioner judgment language: “we view these costs as recurring” used to reverse a management add-back (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L55-L55`)

Keep as-is patterns:

- Use explicit attribution whenever the basis is management-provided (“Management represents…”). This is directly aligned with “explicit about uncertainty” and “facts vs judgments” standards. (`context/skill/kpmg-fdd/references/writing-standards.md:L19-L36`)
- Use evidence-forward phrasing when support exists (“We obtained… no discrepancies noted.”). This is the strongest defensibility signal in the corpus. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L38-L38`)

Normalize/clean patterns:

- Standardize to a small, consistent set of hedge labels:
  - “Source: Management” (for unverified)
  - “Based on [evidence]” (for verified)
  - “We have treated…” (for judgment + rationale)
    This aligns with the basis conventions requirement for material quantitative claims. (`context/skill/kpmg-fdd/references/writing-standards.md:L37-L45`, `context/skill/kpmg-fdd/SKILL.md:L71-L73`)

- When using “we view / we consider”, add the minimum defensibility quartet: what / why / how quantified / residual risk. (`context/skill/kpmg-fdd/references/writing-standards.md:L47-L54`)

Avoid patterns:

- Unqualified absolutes (e.g., “fully normalized”, “no risk”). House standards explicitly warn against unqualified absolutes without clear evidence. (`context/skill/kpmg-fdd/references/writing-standards.md:L22-L26`)
- Softening language that minimizes risk; QC explicitly flags “red flags minimized”. (`context/skill/kpmg-fdd/references/qc-checklist.md:L12-L13`)

### C) Transition logic patterns

Observed patterns:

- Logic connectors and sequencing are heavily used: “As a result…”, “Therefore…”, “However…”, “In order to…”, “Going forward…” across Overview and adjustment rationales. (Common throughout corpus; e.g., “As a result” and “However” appear repeatedly; `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L903-L903`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L68-L68`.)
- Cross-references: “Refer to Appendix…”, “See…”, used to anchor details. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L48-L48`)

Keep as-is patterns:

- Use “As a result” to connect transaction perimeter / definitional assumptions to bridge impacts (common and intuitive). (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L903-L903`)
- Use “Refer to Appendix/Exhibit” for traceability.

Normalize/clean patterns:

- Prefer 1 connector per sentence; avoid stacking multiple (“However… therefore… as a result…”) in one line.
- Replace “the following page(s)” with exhibit references to avoid doc-assembly errors.

Avoid patterns:

- Transitions that imply certainty without basis (“Therefore it will not recur…”) unless you have the evidence line. House rules require explicit uncertainty labeling. (`context/skill/kpmg-fdd/references/writing-standards.md:L19-L36`)

### D) Quantification phrase patterns

Observed patterns (high-value to preserve):

- “approximately $X”, “implies an annual salary of $X”, “ranging from $X to $Y”, “based on [period] expenses incurred”, “annualizing [month] amount”, “per annum” (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L48-L48`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L54-L54`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2270-L2270`)
- Basis-tied quantification: “based on expenses incurred over the historical period” is a recurring pattern that aligns with house standards. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L54-L54`)

Keep as-is patterns:

- Always attach period to quantified statements (“FYxx”, “LTM”, “TTM”). Consistency rules explicitly require it. (`context/skill/kpmg-fdd/references/writing-standards.md:L56-L64`)
- Keep “based on [source] / [period]” quantification framing.

Normalize/clean patterns:

- Enforce consistent units and sign conventions (parentheses for negatives), and label units in the exhibit caption/units row. (`context/skill/kpmg-fdd/references/writing-standards.md:L56-L60`, `context/skill/kpmg-fdd/references/exhibits-and-tables.md:L34-L39`)
- Replace vague “significant” with quantified impact where available; otherwise label as qualitative and put quantification into missing information. (House tone and QC dimensions both push this direction.) (`context/skill/kpmg-fdd/references/writing-standards.md:L19-L21`, `context/skill/kpmg-fdd/references/qc-checklist.md:L33-L41`)

Avoid patterns:

- Unlabeled placeholders (“EBITDA was $X”) are explicitly a “do not deliver” QC failure. (`context/skill/kpmg-fdd/references/qc-checklist.md:L8-L13`, `context/skill/kpmg-fdd/SKILL.md:L71-L71`)

### E) Caveat / disclaimer patterns

Observed patterns (common + important for defensibility):

- Non-all-inclusiveness / information-to-date disclaimer: “not necessarily all-inclusive… based on information provided by Management to date… further analysis… could uncover additional…” (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L30-L30`)
- “Not included because subjective / not quantifiable” framing for “Other considerations”. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L70-L70`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2048-L2048`)
- Explicit limitation: “We did not obtain monthly financial statements… figures… based on annual statements.” (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L57-L59`)
- Explicit decision not to adjust + reason: “We have not sought to adjust… due to [reason]… may present a small risk…” (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2270-L2270`)

Keep as-is patterns:

- Keep the “not all-inclusive / information-to-date” disclaimer, but link it to the missing-information list so it’s actionable. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L30-L30`)
- Keep “subjective / not quantifiable → not included” as explicit guardrails between the bridge and “other considerations”. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L70-L70`)

Normalize/clean patterns:

- Convert generic disclaimers into specific missing information (“Missing: monthly financials for [period]; impact could change revenue cut-off adjustment.”) consistent with missing-information discipline. (`context/skill/kpmg-fdd/references/writing-standards.md:L65-L73`)
- Prefer “We have not adjusted…” over “not present” to reflect analyst choice and defensibility.

Avoid patterns:

- Blanket disclaimers that substitute for doing the bridge work. QC requires the bridge regardless. (`context/skill/kpmg-fdd/references/qc-checklist.md:L8-L10`)

---

## 2) Structural analysis

### Dominant internal structure variants in corpus entries

Across the verbatim corpus, the section consistently breaks into three internal blocks:

1. `## Overview`
2. `## Quality of earnings adjustments`
3. `## Other considerations`

This pattern appears for each report entry inside `qoe-and-earnings-adjustments.md` (23 entries per corpus README and validation). (`context/docs/report-mining/section-corpus/README.md:L13-L20`, `context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L3-L24`)

Within `## Quality of earnings adjustments`, there are notable variants:

Variant A: “Management adjustments” + “Potential adjustments” (sometimes plus “Pro forma adjustments”)

- Example language explicitly labels management-identified items and diligence-identified items. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L33-L56`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L115-L119`)

Variant B: Itemized adjustment list (numbered), sometimes referencing sell-side / diligence adjustment numbers

- Common in later entries: “1. [Adjustment]: … 2. [Adjustment]: …” with embedded recurrence and quantification comments. (e.g., `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L1972-L1988`)

Variant C: Definitional bridge before earnings normalization (net income → reported EBITDA), then adjustments

- Appears at least once as an explicit “Net income to reported EBITDA” bridge narrative. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2059-L2063`)
- There is also a distinct “## Definitional adjustments” block in the corpus. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L516-L516`)

Variant D: “Other considerations” explicitly separated as subjective / not quantifiable and excluded from the bridge

- This is repeated in multiple entries and is a key defensibility boundary. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L70-L70`, `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2048-L2048`)

### Recommended default structure (house-standardized 2B)

Default structure should be driven by the “minimum content” requirements for this canonical section: bridge, basis, recurrence commentary, missing information. (`context/skill/kpmg-fdd/references/report-structure.md:L128-L136`)

Recommended default (canonical block order):

1. Key takeaway (1–2 sentences; state reported → adjusted and main drivers)
2. Exhibit: Reported → Adjusted bridge table (primary exhibit; auditable)
3. Adjustment rationale by type (grouped; each adjustment uses defensibility quartet)
4. Other considerations not included in adjusted earnings (explicitly excluded; why)
5. Sensitivities and missing information that could change the bridge (prioritized P0/P1/P2)

Allowed variants (explicitly permitted):

- Variant A sub-structure inside #3: split into “Management adjustments” and “Diligence adjustments” when a management adjustment schedule exists and it’s helpful to show what we accepted vs challenged.
- Variant C optional add-on: “Definitional bridge (net income → reported EBITDA)” as an exhibit or short subsection when the EBITDA definition is non-standard or contentious.
- Metric variant: If the engagement uses EBT/pre-tax income (seen in corpus), the bridge headers and narrative should switch metric labels but keep the same auditability requirements.

### Required vs optional sub-blocks

Required (must always be present in skill output):

- Key takeaway (even if placeholdered)
- Reported → Adjusted bridge exhibit (even if “TBD” values, but structure must exist)
- Recurrence framing for each material adjustment (non-recurring vs run-rate vs recurring/uncertain)
- Basis/source for each material adjustment, or explicit open item if missing
- Missing information list specific to items that could change the bridge

These are hard-gated by report-structure minimums and QC “do not deliver” checks. (`context/skill/kpmg-fdd/references/report-structure.md:L128-L136`, `context/skill/kpmg-fdd/references/qc-checklist.md:L8-L13`)

Optional:

- Definitional adjustments bridge (net income → reported EBITDA)
- Other considerations (if there are items not quantified / subjective; otherwise can be omitted)
- Pro forma adjustments sub-block (only if explicitly in-scope; otherwise keep them in the Pro forma section per the canonical structure)

---

## 3) Failure-mode analysis

Below are the top generation failure modes for this section, with detection heuristics and prevention controls you can implement as prompt rules, lint checks, and template constraints.

### Failure mode 1: Missing bridge or bridge doesn’t tie

Why it happens:

- Model produces narrative without the reconciliation table, or produces a table without totals that tie.

Detection heuristics:

- Section contains “QoE and earnings adjustments” but no bridge table with “Reported” and “Adjusted”.
- If numeric values exist: reported + sum(adjustments) ≠ adjusted.
- Missing “Source:” line under the exhibit.

Prevention controls:

- Template constraint: require a bridge table block; do not allow completion without it.
- Lint check: fail if bridge table header absent; fail if tie-out mismatch when all numeric cells are present.
- Prompt rule: “QoE section is invalid without a reported-to-adjusted bridge.”

Hard evidence for gate:

- QC checklist explicitly blocks delivery if QoE section has no bridge or doesn’t sum. (`context/skill/kpmg-fdd/references/qc-checklist.md:L8-L10`)
- Report-structure minimum content requires the bridge. (`context/skill/kpmg-fdd/references/report-structure.md:L131-L136`)

### Failure mode 2: Adjustments lack basis/source (or basis is implied but not stated)

Detection heuristics:

- Adjustment rows missing “Basis” field, or narrative lacks any “Source:”/“Based on…” lines.
- Quantitative claim without basis line.

Prevention controls:

- Template: every adjustment row includes a “Basis” column (required, can be “Open item”).
- Lint: if “Impact” is numeric and “Basis” is blank → fail.
- Prompt rule: “For every material quantitative claim, include a basis/source or mark as open item.”

Evidence:

- Writing standards require basis conventions and explicit sourcing for quantitative claims. (`context/skill/kpmg-fdd/references/writing-standards.md:L37-L45`)
- SKILL.md critical rule repeats this. (`context/skill/kpmg-fdd/SKILL.md:L71-L73`)
- QC checklist treats missing basis as “do not deliver.” (`context/skill/kpmg-fdd/references/qc-checklist.md:L10-L11`)

### Failure mode 3: Recurrence mis-framing (calling recurring items “non-recurring” without justification)

Detection heuristics:

- Adjustment labeled “non-recurring” but rationale doesn’t explain why it won’t recur.
- Reversal of management add-back not explained (“we view as recurring”) without citing evidence (periodicity, consistency).

Prevention controls:

- Micro-template per adjustment must include “Why non-recurring/run-rate” and “Residual risk”.
- Lint: each adjustment must have Recurrence = one of {Non-recurring, Run-rate, Recurring, Uncertain}; if missing → fail.
- Prompt rule: “If recurrence is uncertain, label it Uncertain and move to missing information / sensitivity.”

Evidence:

- Defensibility rules for adjustments explicitly require why and residual risk. (`context/skill/kpmg-fdd/references/writing-standards.md:L47-L54`)
- Corpus shows both sides (accepting and reversing management add-backs) and frames it explicitly. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L54-L55`)

### Failure mode 4: Period/unit inconsistency across bridge, narrative, and exhibits

Detection heuristics:

- Multiple units used ($m vs $k) without note; FY vs LTM mixed without explanation.
- Bridge caption missing period and units.

Prevention controls:

- Template requires “Period covered” and “Units” in the exhibit caption (or units row).
- Lint: fail if bridge caption missing period or units.
- Prompt rule: “Use one unit convention consistently; note if an exhibit differs.”

Evidence:

- Writing standards require period and unit consistency. (`context/skill/kpmg-fdd/references/writing-standards.md:L56-L64`)
- QC checklist blocks delivery for inconsistent units/periods. (`context/skill/kpmg-fdd/references/qc-checklist.md:L10-L12`)
- Exhibit minimums require period/units/source for every exhibit. (`context/skill/kpmg-fdd/references/exhibits-and-tables.md:L17-L33`)

### Failure mode 5: Invented numbers or unlabeled placeholders

Detection heuristics:

- Presence of numbers not tied to any stated source/basis.
- Placeholders like “$X” appear without being labeled as placeholder/open item.
- Narrative claims “EBITDA was $X” without source.

Prevention controls:

- Prompt rule: never invent numbers; use `$[x]` and add an open item.
- Lint: fail if pattern “$X” or “[DATE]” appears in final output unless inside an explicit placeholder token or open-item list.
- Template: explicitly include placeholder syntax and an “Missing information” block.

Evidence:

- SKILL.md critical rule: do not invent numbers; use placeholders like `$[x]`. (`context/skill/kpmg-fdd/SKILL.md:L71-L71`)
- QC checklist blocks delivery if invented placeholders are unlabeled. (`context/skill/kpmg-fdd/references/qc-checklist.md:L8-L12`)

### Failure mode 6: Blurring “included adjustments” vs “other considerations”

Detection heuristics:

- Items described as subjective/non-quantifiable appear in the bridge table.
- Other considerations list lacks explicit “not included” language.

Prevention controls:

- Template separation: “Other considerations (not included in adjusted EBITDA)” is its own block.
- Lint: fail if “subjective” or “not quantifiable” appears in an adjustment row with numeric impact.

Evidence:

- Corpus consistently separates subjective items and states they are not included. (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L70-L70`)
- Writing standards emphasize credibility and not inventing. (`context/skill/kpmg-fdd/references/writing-standards.md:L7-L16`, `context/skill/kpmg-fdd/references/writing-standards.md:L37-L45`)

---

## 4) Draft markdown playbook (implementable)

```markdown
# QoE and earnings adjustments — playbook (Style 2B, Quality gate 5C)

## Objective

Reconcile reported earnings to a normalized, decision-useful measure (default: EBITDA) using a defensible reported → adjusted bridge, with clear recurrence framing and explicit basis for each material adjustment.

Minimum content required for this canonical section:

- A clear bridge: Reported → Adjustments (by type) → Adjusted
- Evidence/basis for each material adjustment
- Commentary on recurrence and sustainability
- A list of missing information that could change the bridge
  (Ref: `skill/kpmg-fdd/references/report-structure.md`)

## Required inputs (use what is available; do not block)

Preferred inputs:

- Income statement and/or monthly management accounts for the historical period (FY / LTM / TTM)
- Trial balance and/or GL extracts (if available)
- Management adjustment schedule (if available)
- Supporting detail for major one-time items (invoices, contracts, settlement agreements, payroll detail)
- Revenue detail where revenue recognition/cut-off is a risk (customer/LOB, credit notes, deferred revenue)

If an input is missing:

- Do not invent numbers.
- Use placeholders ($[x], [period], [date]) and add a prioritized open item.
  (Ref: `skill/kpmg-fdd/SKILL.md`; `skill/kpmg-fdd/references/writing-standards.md`)

## Canonical block order (default output structure)

1. Key takeaway (1–2 sentences)
2. Exhibit: Reported → Adjusted [metric] bridge (primary exhibit)
3. Adjustment rationale by type (narrative; grouped; defensibility micro-template)
4. Other considerations (not included in adjusted [metric]) — optional but common
5. Key sensitivities and missing information that could change the bridge (prioritized)

Allowed variants:

- If management provided an adjustment schedule: sub-split the narrative into (i) Management adjustments, (ii) Diligence adjustments (accepted/challenged), while still presenting one unified bridge.
- If EBITDA definition is non-standard: include an optional “Definitional bridge (net income → reported EBITDA)” exhibit.
- If the engagement uses EBT/pre-tax income: replace “EBITDA” labels with the correct metric consistently.

## Exhibit rules (bridge must be auditable)

Bridge exhibit must include:

- Period covered
- Units
- Source/basis line
  (Ref: `skill/kpmg-fdd/references/exhibits-and-tables.md`)

Preferred bridge table structure:

| Adjustment type | Description | Period | Impact ($) | Recurring? | Basis |
| --------------- | ----------- | -----: | ---------: | ---------- | ----- |

Rules:

- Keep descriptions short in the table; put detailed rationale in the narrative.
- Every numeric impact must have a basis; if basis is not available, label the basis as an open item.
- Use consistent units and sign convention (negatives in parentheses).
  (Ref: `skill/kpmg-fdd/references/exhibits-and-tables.md`; `skill/kpmg-fdd/references/writing-standards.md`)

## Adjustment narrative — defensibility micro-template (required per material adjustment)

For each material adjustment included in the bridge, include:

1. What it is (plain-English description)
2. Why it is treated as non-recurring / run-rate / recurring (recurrence framing)
3. How it was quantified (data used, period, key assumptions)
4. Basis reviewed (what evidence supports it)
5. Residual risk / sensitivity (what could change the conclusion)

(Ref: `skill/kpmg-fdd/references/writing-standards.md`)

### Standard action verbs (preferred)

Use consistent “headline sentence” verbs (choose one):

- “This adjustment removes …”
- “This adjustment adds back …”
- “This adjustment reflects …”
- “This adjustment re-allocates … to the appropriate period …”
- “This adjustment reverses Management’s add-back … because …”

### Standard recurrence labels (use one per adjustment)

- Non-recurring: not expected to recur; one-time or isolated event
- Run-rate: reflects expected go-forward cost/revenue base (normalized level)
- Recurring: ongoing normal course; not appropriate to adjust out
- Uncertain: recurrence cannot be concluded with evidence available; treat as sensitivity / open item

## Evidence and basis conventions (must follow)

- Distinguish facts vs judgments explicitly.
- For material quantitative claims, provide a basis line (source and date if known).
- If the basis is not available, do not invent numbers; log an open item.
  (Ref: `skill/kpmg-fdd/references/writing-standards.md`; `skill/kpmg-fdd/SKILL.md`)

Preferred basis phrasing:

- “Source: trial balance extract dated [YYYY-MM-DD].”
- “Source: management adjustment schedule; not audited.”
- “Source: invoices provided by management; we noted no exceptions in the sample reviewed.”
- “Source: [contract / settlement agreement] dated [YYYY-MM-DD].”

## Missing information behavior (when data is missing or conclusion is not defensible)

Always maintain an “Missing information & sensitivities” list that is specific to this section and prioritized:

- P0 = gating items that could materially change adjusted earnings
- P1 = important refinements
- P2 = informational / confirmatory

When an adjustment cannot be supported:

- Do not include it in the bridge unless explicitly labeled as “indicative” and paired with a P0/P1 open item.
- Alternatively, move it to “Other considerations (not included)” and explain why.

## Style rules (2B: corpus-inspired + house-standardized)

Write to be client-ready and easy to review:

- Put the “so what” in the first 1–2 sentences of the section and each major subsection.
- Use short paragraphs and bullets; avoid long unstructured blocks.
- Use explicit attribution for management-provided claims (“Management represents…”, “We understand…”) and pair with basis wherever possible.
- Avoid casual language and unqualified absolutes.
  (Ref: `skill/kpmg-fdd/references/writing-standards.md`)

Preferred cross-references:

- Use “Exhibit [#]” / “Appendix [#]” rather than “table below” or “following page(s)”.

## QA checks and pass/fail gates (5C)

PASS requires all of the following:

- Bridge table is present and readable (Reported → Adjustments → Adjusted)
- Bridge ties out where numbers exist; otherwise the tie-out is explicitly marked as pending with missing information
- Every material adjustment has: recurrence label + basis/source + quantification method (or explicit open item)
- Units and periods are consistent throughout the section
- No invented numbers; placeholders are clearly labeled and logged as missing information
- “Other considerations” items are explicitly stated as not included in adjusted earnings (if applicable)

FAIL if any of the “do not deliver” QC issues occur:

- QoE section present but no reported-to-adjusted bridge (or bridge does not sum)
- Material quantitative claims have no basis/source and are not flagged as missing information
- Units/periods inconsistent
- Invented placeholders not labeled
  (Ref: `skill/kpmg-fdd/references/qc-checklist.md`)

## Suggested lint checks (implementable)

1. Bridge presence:

- Must contain a bridge table with the header “Adjustment type | Description | Period | Impact | Recurring? | Basis”

2. Basis completeness:

- For each adjustment row with a numeric impact, “Basis” must be non-empty OR contain “Open item”

3. Recurrence completeness:

- Each adjustment row must contain Recurring? in {Non-recurring, Run-rate, Recurring, Uncertain}

4. Placeholder discipline:

- Reject tokens like “EBITDA was $X” unless $X is formatted as $[x] and appears in Missing information

5. Cross-reference hygiene:

- Reject “table below / adjacent table / following pages” (replace with Exhibit references)

6. Other-considerations separation:

- If “subjective” or “not quantifiable” appears, ensure the item is not included in the bridge table
```

Key references embedded above are drawn directly from the house standards and QC gates. (`context/skill/kpmg-fdd/references/writing-standards.md:L47-L54`, `context/skill/kpmg-fdd/references/qc-checklist.md:L8-L13`, `context/skill/kpmg-fdd/references/exhibits-and-tables.md:L17-L50`, `context/skill/kpmg-fdd/SKILL.md:L71-L73`, `context/skill/kpmg-fdd/references/report-structure.md:L128-L136`)

---

## 5) Draft markdown template (implementable)

```markdown
# QoE and earnings adjustments

## Key takeaway

- Reported [EBITDA/EBT] of $[x] for [period] adjusts to $[x] after net adjustments of $[x]. The bridge is primarily driven by: (i) [Adjustment 1], (ii) [Adjustment 2], and (iii) [Adjustment 3].  
  Source: [management accounts / audited FS / TB extract]; see Exhibit [#].

If reported / adjusted values are not available:

- A reported-to-adjusted bridge is pending receipt of [missing inputs]. We have outlined the adjustment areas identified to date and the missing information required to quantify and validate each item.

## Exhibit [#]: Reported to Adjusted [EBITDA/EBT] bridge ([period], $[units])

Source: [management adjustment schedule / TB extract / audited FS]; basis notes per line item.

| Adjustment type      | Description           |   Period | Impact ($) | Recurring?    | Basis                                                                   |
| -------------------- | --------------------- | -------: | ---------: | ------------- | ----------------------------------------------------------------------- |
| Reported             | Reported [EBITDA/EBT] | [period] |       $[x] | n/a           | Source: [e.g., TB extract dated YYYY-MM-DD]                             |
| Non-recurring        | [Adjustment name]     | [period] |       $[x] | Non-recurring | Basis: [invoice / GL detail / management schedule; verification status] |
| Run-rate             | [Adjustment name]     | [period] |       $[x] | Run-rate      | Basis: [contract / payroll detail / budget; verification status]        |
| Accounting / cut-off | [Adjustment name]     | [period] |       $[x] | Uncertain     | Basis: Open item — [what is missing]                                    |
| Other                | [Adjustment name]     | [period] |       $[x] | [label]       | Basis: [source]                                                         |
|                      | **Net adjustments**   |          |   **$[x]** |               |                                                                         |
| Adjusted             | Adjusted [EBITDA/EBT] | [period] |       $[x] | n/a           | Calculated: Reported + Net adjustments                                  |

Notes:

- Units/sign convention: [e.g., $m; negatives in parentheses].
- Definition: [what is included in EBITDA/EBT for this bridge; note any differences vs other exhibits].

## Adjustment rationale (grouped; required for material items)

### Non-recurring items

#### [Adjustment name]

- What it is: [plain-English description]
- Recurrence framing: We have treated this as non-recurring because [reason].  
  If management-provided: Management represents that [statement] (not independently verified unless noted).
- Quantification: $[x] based on [data] for [period]; assumptions: [key assumptions].
- Basis reviewed: [TB/GL extract, invoice, contract, settlement agreement, etc.]; [verification status].
- Residual risk / sensitivity: [what could change the conclusion; what remains to validate].

### Run-rate normalization

#### [Adjustment name]

- What it is:
- Recurrence framing:
- Quantification:
- Basis reviewed:
- Residual risk / sensitivity:

### Owner / related-party and discretionary items (if applicable)

#### [Adjustment name]

- What it is:
- Recurrence framing:
- Quantification:
- Basis reviewed:
- Residual risk / sensitivity:

### Accounting / classification / out-of-period (if applicable)

#### [Adjustment name]

- What it is:
- Recurrence framing:
- Quantification:
- Basis reviewed:
- Residual risk / sensitivity:

## Other considerations (not included in adjusted [EBITDA/EBT])

List items identified that may be subjective and/or not quantifiable at this stage and therefore are not reflected in the bridge.

- [Item]: [why it matters], [why not adjusted], [what would be needed to quantify], [potential directional impact if known].

## Key sensitivities and missing information (could change the bridge)

Prioritize missing information as P0/P1/P2.

- **P0 (gating):** [open item] — Impact: [potentially material / unknown]; Needed: [specific data]; Affects: [bridge line item].
- **P1:** [open item] — Impact: [likely moderate]; Needed: [data].
- **P2:** [open item] — Impact: [informational]; Needed: [data].
```

This template enforces the section minimums (bridge, basis, recurrence, missing information) and is consistent with the exhibit requirements and the “do not deliver if” QC gates. (`context/skill/kpmg-fdd/references/report-structure.md:L128-L136`, `context/skill/kpmg-fdd/references/exhibits-and-tables.md:L17-L50`, `context/skill/kpmg-fdd/references/qc-checklist.md:L8-L13`, `context/skill/kpmg-fdd/references/writing-standards.md:L47-L54`, `context/skill/kpmg-fdd/SKILL.md:L71-L73`)

---

If you want to implement this immediately in the skill repository, the lowest-friction path is:

- Replace or supersede `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md` with the template above (it’s a strict superset of the current template’s intent). (`context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L1-L38`)
- Add the playbook as a section-specific writing asset alongside the existing QoE playbook (`context/skill/kpmg-fdd/references/analysis-playbooks/qoe-playbook.md`) or expand that file with the “defensibility micro-template” and “lint checks” blocks. (`context/skill/kpmg-fdd/references/analysis-playbooks/qoe-playbook.md:L1-L36`)
