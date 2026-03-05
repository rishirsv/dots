According to `context/MANIFEST.md` (created UTC 2026-02-27), the authoritative source set for this task is the section corpus + references bundle used to draft “04-qoe-and-earnings-adjustments,” with locked targets (style 2B, quality gate 5C) and a requirement to deliver implementable markdown assets. (context/MANIFEST.md:L1-L15)

Assumptions I’m making (explicit, so we can proceed without questions):

1. “Style 2B” means: use the corpus’s characteristic cadence and idioms, but enforce the house writing discipline in `context/skill/kpmg-fdd/references/writing-standards.md` (clear basis, explicit uncertainty labeling, “so what” early, no casual language). (context/skill/kpmg-fdd/references/writing-standards.md:L1-L20, L21-L36, L77-L81)
2. “Quality gate 5C” means: pass the “do not deliver if” QC checks (especially the reported-to-adjusted bridge and sourcing) and meet the explicit adjustment defensibility criteria (what/why/how/residual risk). (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16; context/skill/kpmg-fdd/references/writing-standards.md:L38-L54)

Evidence note: The section corpus is explicitly described as preserving verbatim section text, and the validation report shows a pass with 0 failures and 23 entries for the QoE section file. (context/docs/report-mining/section-corpus/README.md:L1-L18; context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L1-L8, L12-L18)

---

1. Linguistic analysis

A. Sentence length and cadence patterns

Observed section cadence (corpus-specific):

- “Two-speed” rhythm: a short top-line “so what” sentence (often “Reported EBITDA of $X increases/decreases to $Y…”), followed by denser definitional/setup paragraphs and then itemized adjustment rationales. Example top-line: “FY17 USA reported EBITDA… increases to…” appears in the Overview block. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L16-L22)
- Frequent list-style prose without bullets: sources of information are often written as colon-introduced lists with semicolons/line breaks (reads like slides exported to text). (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L20-L24)
- Adjustment rationales are often “label: explanation” form, with multi-sentence support and embedded quantification.

Keep as-is patterns (retain the “feel,” but standardize):

- “So what” in the first 1–2 sentences (explicitly aligned with house guidance). (context/skill/kpmg-fdd/references/writing-standards.md:L79-L81)
- Item-led rationale with clear verbs (“Represents…”, “Reflects…”, “This adjustment…”). Example library extract uses “Represents…” and “This adjustment primarily relates…” to anchor the rationale. (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L16-L22)

Normalize/clean patterns (make deterministic + client-ready):

- Replace layout-referential phrases that don’t survive a markdown-first workflow (“following pages,” “above schedule,” “adjacent table”) with explicit exhibit references (“Exhibit X”) or neutral language (“discussed below”). Example: “Significant adjustments are discussed on the following pages.” (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L18-L20) and “not reflected in the adjacent table.” (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L98-L105)
- Break “mega-sentences” that bundle many facts/adjustments into one line (especially in simulated/placeholder-heavy entries). Example: the Coffee entry contains very long lines spanning multiple proposed adjustments and standards references. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L222-L230)

Avoid patterns (high risk under 5C defensibility):

- Orphaned, slide-like fragments (“Overview” repeated as a standalone line; “Other considerations” repeated). These read like formatting artifacts and weaken professionalism. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L19-L23; L68-L70)
- “Significant / meaningful” without specifics. QC explicitly flags vague quantifiers unless clearly qualitative. (context/skill/kpmg-fdd/references/qc-checklist.md:L37-L41)

B. Hedge and certainty phrasing patterns

Observed hedge patterns (section-specific):

- Management-attribution hedges: “Management represents…”, “Management stated…”, “According to Management…”. Example: “Management represents that these costs are non-recurring…” appears in the adjustment library. (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L21-L22)
- Practitioner-attribution hedges: “We understand…”, “It is our understanding…”, “We were informed…”, “We have not been able…”. Example: “we have not been able to identify… As such we have not quantified…” appears under Other considerations. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L125-L126)
- Estimation hedges: “approximately”, “estimated”, “may”, “potential”, “subjective in nature”.

Observed certainty patterns (less frequent, but very valuable for defensibility):

- Direct evidence statements: “We obtained supporting invoices… with no discrepancies noted.” (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L19-L21)
- Trace/agreement language (“traced to…”, “agreed to…”, “reconciled to…”) appears in the library and should be treated as “only use if actually done.”

Keep as-is patterns:

- “Explicit about uncertainty” labeling is mandated by house standards; keep the attribution frame, but make it consistent. (context/skill/kpmg-fdd/references/writing-standards.md:L13-L16)
- “Not quantified due to…” phrasing is defensible when paired with an open item (i.e., explains why it’s excluded from the bridge). Example: “subjective… not been included in the Quality of Earnings schedule/table.” (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2047-L2049)

Normalize/clean patterns:

- Standardize on one hedge hierarchy:
  - If it comes from management: “Management represented…”
  - If it’s an estimate you built: “We estimated…” + basis + key assumptions
  - If it’s not verified: “We have not independently verified…” (or “not audited”) + residual risk

- Convert “we understand” to “management represented” when the source is management, to avoid implying independent verification. Example uses both “Management represents…” and “We understand…” in the same adjustment; in 2B, pick one consistent attribution per clause. (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L16-L18)

Avoid patterns:

- Unqualified absolutes (“no risk,” “fully normalized”) are explicitly discouraged. (context/skill/kpmg-fdd/references/writing-standards.md:L17-L20)
- Certainty claims (“no discrepancies noted”) without a stated audit step/basis line.

C. Transition logic patterns

Observed transition patterns:

- “As such” to connect an observed fact to why an adjustment is excluded or unquantified. Example: “As such we have not quantified…” (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L125-L126)
- “Therefore” used to justify a proposal (“We therefore propose/adjust…”). Example in Coffee entry: “We therefore propose…” (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L228-L230)
- Cross-references (“Please refer to…”, “Refer to Appendix…”, “Refer to tax due diligence section…”). Example: “Please refer to the tax due diligence section…” (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L118-L119)

Keep as-is:

- Clear “fact → implication → recommendation” transitions match house claim discipline. (context/skill/kpmg-fdd/references/writing-standards.md:L21-L27)

Normalize/clean:

- Replace “Appendix X” references with “See Exhibit/Appendix [#]” only if the artifact exists in the current draft; otherwise convert to “Open item: obtain [support]” to avoid orphan references.
- Replace “adjacent table/above schedule” with explicit exhibit naming. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L98-L105)

Avoid:

- “Discussed on following pages” and similar print-PDF artifacts. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L18-L20)

D. Quantification phrase patterns

Observed quantification patterns:

- Bridge verbs: “increases to / decreases to” (bridge logic in prose). (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L16-L19; L1357-L1358)
- Approximation: “approximately $X” and ranges. (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L16-L18)
- Time anchoring: FY year-ended and TTM/LTM phrases (“fiscal years ended… trailing twelve months ended…”). (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L102-L105; L2052-L2052)
- Run-rate framing: “annualized impact,” “run-rate adjustments,” “expected to generate.” (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2047-L2048; context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L1355-L1356)

Keep as-is:

- Use “Represents / Reflects / Removes / Adds back” to link the number to the business logic (library-heavy pattern). (context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md:L16-L22)
- Explicit period anchoring and units. House rules require defined periods/units. (context/skill/kpmg-fdd/references/writing-standards.md:L13-L16; context/skill/kpmg-fdd/references/exhibits-and-tables.md:L33-L39)

Normalize/clean:

- Enforce a table-first quantification discipline: the bridge table carries exact values; the narrative carries rationale. This matches the exhibit guidance. (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L41-L51)
- Sign conventions and units in tables (parentheses for negatives). (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L33-L37)

Avoid:

- “Significant adjustment” without magnitude (QC flag). (context/skill/kpmg-fdd/references/qc-checklist.md:L37-L41)
- Hidden assumptions in quantification without stating them (violates “how quantified” requirement). (context/skill/kpmg-fdd/references/writing-standards.md:L49-L54)

E. Caveat and disclaimer patterns

Observed disclaimer patterns (highly section-specific):

- “Not necessarily all-inclusive / based on information provided to date / further analysis could uncover…” appears repeatedly in the corpus and is the canonical defensibility caveat. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L1359-L1360; context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L104-L105)
- “Items may be subjective… not included in the QoE schedule/table.” This is the canonical exclusion rationale for Other considerations. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2047-L2049)
- “QoE analysis does not represent a complete list…” appears in the Coffee entry and is a strong “scope limitation” disclaimer. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L222-L225)

Keep as-is:

- “Not all-inclusive” + “information provided” caveat, but anchor it in a single “Basis and limitations” paragraph rather than repeating everywhere. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L1359-L1360)

Normalize/clean:

- Convert disclaimers into a consistent “Basis and scope” block (inputs reviewed, not audited, limitations, what’s pending) plus per-adjustment residual risk (when material). This aligns with the “residual risk” requirement. (context/skill/kpmg-fdd/references/writing-standards.md:L49-L54)

Avoid:

- Over-broad disclaimers that undermine the section (“we don’t know anything”) without providing concrete missing information; house workflow says proceed with labeled placeholders and missing information rather than filling in guesses. (context/skill/kpmg-fdd/references/workflow.md:L83-L86)

---

2. Structural analysis

A. Dominant internal structure variants in corpus entries

Macro-structure (very consistent in the corpus file):

- Each entry is organized into three top-level blocks: “## Overview”, “## Quality of earnings adjustments”, and “## Other considerations”. You can see these headings repeated throughout the corpus entries (example occurrence shown below). (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L16-L18; L106-L108; L64-L66)

Within “Overview,” dominant variants:

1. Bridge-in-prose opener: “Reported EBITDA of $X increases/decreases to $Y…” (not universal, but a strong pattern). (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L16-L19; L1357-L1358)
2. “Basis of preparation / sources of information” list (common): “prepared based on the following sources…” (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L20-L24)
3. Definitions of adjustment buckets (common): Management adjustments vs potential adjustments vs pro forma vs other considerations, including the rationale for “other considerations” being excluded from the table. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L98-L105; L2043-L2049)

Within “Quality of earnings adjustments,” dominant variants:

- Variant A (management-led): starts with “Management adjustments: … identified by Management,” then itemized adjustments. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L106-L109)
- Variant B (topic-led): numbered list of diligence adjustments by topic (e.g., “Revenue adjustment: Represents…”, “Bad debt normalization…”), often without explicit “management vs diligence” framing. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L1556-L1556)
- Variant C (sell-side true-up): explicitly critiques or reverses sell-side “pro forma/run-rate” items (appears in simulated entries).
- Variant D (missing-content placeholders): “Not present in source report” appears frequently and needs deterministic handling. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L62-L64)

Within “Other considerations,” dominant variants:

- Items not included as an adjustment because they are subjective, unquantified, or require more info; explicit statement that they are not reflected in the table. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2047-L2049; L123-L126)

B. Recommended default structure (for the skill) and allowed variants

Default structure (recommended as the skill’s “canonical” output)
This directly implements the “minimum required elements” in the current template (bridge + rationale by type + sensitivities/missing information). (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L6-L34)

1. Section opener (“so what”)

- 1–2 sentences summarizing reported → adjusted and the main drivers. (context/skill/kpmg-fdd/references/writing-standards.md:L79-L81)

2. Basis and scope (inputs + limitations)

- Sources reviewed and explicit uncertainty labeling (“management-provided,” “estimated,” “not audited”). (context/skill/kpmg-fdd/references/writing-standards.md:L13-L16; L38-L46)

3. Exhibit: Reported to adjusted bridge (primary)

- Table with adjustment type, description, period, impact, recurring?, basis. (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L41-L51; context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L20)

4. Adjustment rationale by type (narrative)

- Group into types (non-recurring, run-rate, owner/discretionary, accounting/classification, deal-specific). (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L21-L28)
- For each material adjustment, enforce “what/why/how/residual risk.” (context/skill/kpmg-fdd/references/writing-standards.md:L47-L54)

5. Other considerations (not adjusted)

- Explicitly state why excluded and what could change. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2047-L2049)

6. Key sensitivities and missing information (required)

- Prioritize (P0/P1/P2) and tie to potential impact on adjusted EBITDA. (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L29-L34; context/skill/kpmg-fdd/references/qc-checklist.md:L43-L48)

Allowed variants (explicitly permitted)

- Starting metric variant: If reported metric is EBT/EBIT/Net income (as some corpus entries reference net income bridges), allow a “Net income/EBT to EBITDA” definitional bridge before the adjustment bridge. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2043-L2045)
- Multi-period bridge: FY + LTM/TTM columns; must include units/periods and tie-outs. (context/skill/kpmg-fdd/references/exhibits-and-tables.md:L33-L39; context/skill/kpmg-fdd/references/writing-standards.md:L55-L63)
- Qualitative-only (data missing): Bridge table still required, but numeric impacts marked “TBD” and every TBD must be mirrored in Missing information (no silent gaps). (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L15-L20; context/skill/kpmg-fdd/SKILL.md:L69-L73)

C. Required vs optional sub-blocks

Required sub-blocks (must always appear)

- “So what” opener (1–2 sentences). (context/skill/kpmg-fdd/references/writing-standards.md:L79-L81)
- Reported-to-adjusted bridge table (even if partial/TBD). (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L8-L20; context/skill/kpmg-fdd/references/qc-checklist.md:L9-L12)
- Per adjustment: description, impact (or TBD), recurrence assessment, basis/source. (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L15-L20)
- Adjustment rationale by type with defensibility components (what/why/how/residual risk) for material items. (context/skill/kpmg-fdd/references/writing-standards.md:L47-L54)
- Key sensitivities and missing information list (prioritized). (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L29-L34; context/skill/kpmg-fdd/references/qc-checklist.md:L43-L48)

Optional sub-blocks (allowed when evidence exists / deal requires)

- “Sources of information” detailed bullets (if multiple sources reviewed). (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L20-L24)
- “Other considerations” expansion (when there are meaningful unadjusted items). (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2047-L2049)
- Appendix: top-5 adjustment support schedule. (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L35-L38)

---

3. Failure-mode analysis

Below are the failure modes I expect most often when generating this section, plus detection heuristics and prevention controls that can be implemented as prompt rules + lint checks + template constraints. These are anchored on the QC “do not deliver” checks and the writing standards’ defensibility requirements. (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16; context/skill/kpmg-fdd/references/writing-standards.md:L47-L54)

Failure mode 1: Missing bridge (or bridge doesn’t tie)

- Why it happens: the model writes narrative but forgets the reconciliation table, or includes numbers that don’t sum.
- Detection heuristics:
  - Section does not contain a table with “Reported EBITDA” and “Adjusted EBITDA” rows (or equivalent).
  - If numeric impacts present: computed sum(adjustments) ≠ adjusted - reported.

- Prevention controls:
  - Template constraint: bridge table is a required block and must appear before rationale.
  - Lint: hard fail if “QoE section present but no reported-to-adjusted bridge” (mirrors QC). (context/skill/kpmg-fdd/references/qc-checklist.md:L9-L12)

Failure mode 2: Adjustments asserted without basis/source

- Detection heuristics:
  - Any row in bridge has empty “Basis” (or only generic “management”) and no corresponding open item.
  - Narrative includes a quantitative claim with no “Source:” line.

- Prevention controls:
  - Prompt rule: “Every adjustment must include a basis line; if not available, mark impact TBD + create an open item.”
  - Lint: fail if material quantitative claims lack basis/source (QC critical). (context/skill/kpmg-fdd/references/qc-checklist.md:L10-L13; context/skill/kpmg-fdd/references/writing-standards.md:L38-L46)

Failure mode 3: “Non-recurring” label without rationale (why it’s non-recurring)

- Detection heuristics:
  - “non-recurring” appears but no “why” clause (e.g., event-based, discretionary, not expected to recur) and no residual risk statement.

- Prevention controls:
  - Enforce the 4-part adjustment defensibility mini-structure: what/why/how/residual risk. (context/skill/kpmg-fdd/references/writing-standards.md:L47-L54)
  - Lint: for each adjustment marked non-recurring/run-rate, require a “Why” sentence and a “Residual risk” sentence.

Failure mode 4: Overstated certainty / failure to label uncertainty

- Detection heuristics:
  - Presence of banned absolutes (e.g., “no risk”, “fully normalized”) or certainty claims without evidence verbs/basis.

- Prevention controls:
  - Use the writing standards “explicit about uncertainty” rule and banned absolutes list. (context/skill/kpmg-fdd/references/writing-standards.md:L13-L20)
  - Lint: flag absolutes; require management attribution (“Management represented…”) for management-provided claims.

Failure mode 5: Period / units / definition drift (EBITDA vs EBIT vs EBT; FY vs LTM; $k vs $m)

- Detection heuristics:
  - Multiple unit markers without explicit definition (e.g., $m in bridge, $k in narrative).
  - Period labels inconsistent between bridge and narrative (FY vs TTM) without explanation.

- Prevention controls:
  - Template constraint: include “Period and units” line at top and repeat in exhibit caption.
  - Lint: check for consistent units/period terms; if mismatch, require explicit note. (context/skill/kpmg-fdd/references/writing-standards.md:L55-L63; context/skill/kpmg-fdd/references/qc-checklist.md:L11-L13)

Failure mode 6: Formatting artifacts that weaken client-readiness (“adjacent table”, “following pages”, “Appendix X” with no appendix)

- Detection heuristics:
  - Search for: “adjacent table”, “above schedule”, “following pages”, “see appendix” when no exhibit numbering is present.

- Prevention controls:
  - Prompt rule: “Use Exhibit numbering; do not reference page position.”
  - Lint: flag these phrases and require rewrite to “Exhibit [#]” or open item.

Failure mode 7: “Not present in source report” placeholders leak into a client draft

- Detection heuristics:
  - Literal substring “Not present in source report” appears in output.

- Prevention controls:
  - Template constraint: if data missing, replace with “Open item” entry and a TBD marker in bridge (never that literal phrase).
  - Lint: hard fail if “Not present in source report” appears (it appears in corpus, but should never be output). (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L62-L64)

Failure mode 8: Other considerations not clearly separated from adjusted EBITDA bridge (scope confusion)

- Detection heuristics:
  - Items described as “may impact EBITDA” are included in bridge without quantification/basis, or unquantified items are mixed into bridge totals.

- Prevention controls:
  - Template separation: “Other considerations (not adjusted)” block must explicitly say “not reflected in bridge” and why. This mirrors corpus wording and improves defensibility. (context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md:L2047-L2049)

---

4. Draft markdown playbook (implementable)

Below is a complete, implementation-ready playbook draft you can drop into the skill references as a section-specific playbook (suggested path: `context/skill/kpmg-fdd/references/analysis-playbooks/qoe-and-earnings-adjustments-playbook.md`). It is built to satisfy: the template’s minimum required elements (bridge + rationale by type + sensitivities/missing information) (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L6-L34), the writing standards’ defensibility rules (context/skill/kpmg-fdd/references/writing-standards.md:L47-L54), and the QC “do not deliver” gates (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16).

```markdown
# Playbook: QoE and earnings adjustments (Style 2B, Gate 5C)

## Objective

Reconcile reported earnings to a normalized, decision-useful measure (typically EBITDA), supported by a reported-to-adjusted bridge and defensible adjustment rationales.

This section must be:

- Client-ready in tone and structure
- Defensible (each material adjustment has what/why/how/residual risk)
- Auditable (bridge ties, units/periods consistent, basis provided)

## Required inputs (use what is available; do not block drafting)

### Required (at least one)

- Reported earnings metric and period(s) (e.g., FY2024, LTM Oct-24)
- A source for reported earnings (financial statements, TB extract, management reporting pack)

### Strongly preferred

- Management adjustment schedule (if available)
- Trial balance / GL detail for major adjustment items
- Non-recurring cost support (invoices, settlement agreements, payroll registers, etc.)
- Revenue detail (by customer/segment) if revenue-quality adjustments are in-scope

### Metadata (must be stated in the section)

- Period definition(s): FY / TTM / LTM (with end date)
- Units: $ / $k / $m (choose one; keep consistent)
- EBITDA definition used (and any deviations)

## Canonical block order (must follow)

1. Overview (so what + scope/basis)
2. Exhibit: Reported to adjusted bridge (primary)
3. Adjustment rationale by type (narrative; top items)
4. Other considerations (not adjusted; qualitative/unquantified)
5. Key sensitivities and missing information (prioritized)

## Evidence and basis rules

- Every material quantitative claim must have a basis line (Source: …).
- If basis is missing: do NOT invent numbers. Mark the impact as TBD and add an open item.
- If an item is management-provided or estimated: label it explicitly (“Management represented…”, “We estimated…”).

## Bridge logic rules (non-negotiable)

- The section must include a reported-to-adjusted bridge table.
- The bridge must:
  - Tie (Reported + Σ Adjustments = Adjusted)
  - Use consistent units and sign conventions (negatives in parentheses)
  - Identify recurrence status per adjustment (Non-recurring / Run-rate / Other / TBD)
  - Provide a basis per adjustment (or mark TBD + open item)

## Adjustment rationale standard (defensibility micro-template)

For each MATERIAL adjustment (default: top 5 by magnitude or by risk), include:

1. What the adjustment is (plain-English description)
2. Why it is treated as non-recurring or run-rate (recurrence framing)
3. How it was quantified (data source, period, assumptions)
4. Residual risk (what could change; what would move adjusted EBITDA)

### Recommended rationale verbs (keep consistent)

- “This adjustment removes …”
- “This adjustment adds back …”
- “This adjustment reflects …”
- “This adjustment reclassifies … to align with EBITDA definition”
- “Represents …” / “Reflects …” for definitional statements

### Recurrence framing rules

- Non-recurring: link to a discrete event or one-time circumstance; explicitly state “not expected to recur” and why.
- Run-rate: link to a go-forward state and explain why annualization is appropriate; state the run-rate basis and assumptions.
- Owner/discretionary: clearly state discretion and expected post-transaction treatment.
- Accounting/classification: specify the policy/definition rationale; note whether EBITDA is impacted or only classification.

## Other considerations rules

- Use this section for items that may matter but are not reflected in the bridge due to:
  - Subjectivity
  - Insufficient evidence
  - Quantification pending
- For each item: state what it is, why it’s not in the bridge, and the open item needed to resolve it.

## Open item behavior when data is missing

- Use labeled placeholders only (e.g., $[x], [Date], [Period]).
- Every placeholder in the bridge must appear in the Missing information list with:
  - Priority (P0/P1/P2)
  - Data request
  - Expected impact direction (if known)
- Never output “Not present in source report” in a client draft.

## Style rules (2B)

- Put the “so what” in the first 1–2 sentences.
- Use factual, balanced language; label uncertainty; avoid casual phrasing and absolutes.
- Prefer tables for numbers; keep narrative focused on rationale and implications.
- Avoid page-layout references (“above/adjacent/following pages”); use “Exhibit X”.

## QA checks (5C) — Pass/Fail gates

### FAIL if any are true

- No reported-to-adjusted bridge table is present
- Bridge does not tie (when numbers are provided)
- Any material quantitative claim has no basis and is not flagged as an open item
- Units/periods/definitions drift within the section
- “Non-recurring” or “run-rate” labels are used without the why/how/residual risk components
- Output contains unlabeled placeholders (e.g., “EBITDA was $X”)

### PASS criteria

- Bridge is present and auditable (ties or is explicitly TBD with missing information)
- Each material adjustment includes what/why/how/residual risk
- Every adjustment has recurrence status and basis (or is clearly TBD with open item)
- Other considerations are clearly separated from the adjusted EBITDA conclusion
- Missing information list is prioritized and explicitly linked to missing quantification

## Lint checks (implementation-friendly)

- Required headers: “## Overview”, “## Reported to adjusted … bridge”, “## Adjustment rationale …”, “## Other considerations”, “## Key sensitivities and missing information”
- Forbidden phrases: “adjacent table”, “following pages”, “above schedule”, “Not present in source report”
- Required tokens:
  - At least one “Source:” line in the section
  - In bridge table: columns include Recurring? and Basis
  - In missing information: at least one P0/P1/P2 entry when any TBD exists
```

---

5. Draft markdown template (implementable)

This is a copy/paste-ready template draft intended to replace/extend the current baseline `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md` while keeping its required elements (bridge, rationale by type, sensitivities/missing information). (context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L6-L34)

```markdown
# QoE and earnings adjustments

## Overview

**So what (required; 1–2 sentences):**  
Reported EBITDA of $[reported_ebitda] [increases/decreases] to adjusted EBITDA of $[adjusted_ebitda] for [Period], after net $[net_adjustments] of adjustments, primarily driven by: [Driver 1], [Driver 2], [Driver 3].

**Period / units / definition (required):**

- Period(s): [e.g., FY2024; LTM to MM/DD/YYYY]
- Units: [$m]
- EBITDA definition: [what is included/excluded; note any definitional bridge if starting from EBIT/EBT/NI]

**Basis of preparation (required):**

- Source(s): [trial balance extract dated YYYY-MM-DD / management reporting pack / audited FS]
- Adjustment schedule source: [management adjustment schedule dated YYYY-MM-DD] (if applicable)
- Scope note: This analysis is based on information provided to date and has not been audited/reviewed. Further analysis may identify additional or different adjustments.

## Reported to adjusted EBITDA bridge (Exhibit [#])

> Exhibit [#]: Reported to Adjusted EBITDA Bridge ([Period], [$m])  
> Source: [management adjustment schedule / TB extract / other]. [Not audited.]

| Adjustment type             | Description                |   Period |            Impact ($m) | Recurring?            | Basis       |
| --------------------------- | -------------------------- | -------: | ---------------------: | --------------------- | ----------- |
| Reported EBITDA             | As reported                | [Period] |     $[reported_ebitda] | N/A                   | Source: [ ] |
| Non-recurring               | [Adjustment 1 short label] | [Period] |                   $[x] | Non-recurring         | Source: [ ] |
| Non-recurring               | [Adjustment 2 short label] | [Period] |                   $[x] | Non-recurring         | Source: [ ] |
| Run-rate                    | [Adjustment 3 short label] | [Period] |                   $[x] | Run-rate              | Source: [ ] |
| Owner/discretionary         | [Adjustment 4 short label] | [Period] |                   $[x] | Non-recurring / Other | Source: [ ] |
| Accounting / classification | [Adjustment 5 short label] | [Period] |                   $[x] | Other                 | Source: [ ] |
| **Total adjustments**       |                            |          | **$[net_adjustments]** |                       |             |
| **Adjusted EBITDA**         |                            |          | **$[adjusted_ebitda]** |                       |             |

**Tie-out check (required):**  
Reported EBITDA ($[reported_ebitda]) + Total adjustments ($[net_adjustments]) = Adjusted EBITDA ($[adjusted_ebitda]).  
If not tied or data missing, state: “Tie-out pending; see Missing information.”

## Adjustment rationale by type (required)

> For each material adjustment, include: what / why / how quantified / residual risk.

### A) Non-recurring items (one-time fees, settlements, restructuring)

**Adjustment A1: [Title]**

- Impact: $[x] ([Period], [$m])
- Recurrence: Non-recurring — [one sentence why it is not expected to recur]
- What we observed (fact): [brief]
- How quantified: [data source + method + key assumptions]
- Residual risk / sensitivity: [what could change; what evidence is still needed]
- Basis: Source: [TB/GL extract / invoice / management schedule]. [Not audited/verified.]

[Repeat for A2… as needed; default to top items]

### B) Run-rate normalization (known actions, hires, savings)

**Adjustment B1: [Title]**

- Impact: $[x]
- Recurrence: Run-rate — [why annualization/run-rate is appropriate]
- What we observed (fact): [brief]
- How quantified: [method; annualization basis; assumptions]
- Residual risk / sensitivity: [execution risk; timing; data gaps]
- Basis: Source: [ ].

### C) Owner / related-party / discretionary items

**Adjustment C1: [Title]**

- Impact: $[x]
- Recurrence: [Non-recurring / Other] — [post-transaction expectation]
- What we observed (fact): [brief]
- How quantified: [method]
- Residual risk / sensitivity: [what could change]
- Basis: Source: [ ].

### D) Accounting / classification items (EBITDA definition alignment)

**Adjustment D1: [Title]**

- Impact: $[x] (or “$0 EBITDA impact; classification only”)
- Recurrence: Other — [why this is definitional / policy-driven]
- What we observed (fact): [brief]
- How quantified: [method; reclass logic]
- Residual risk / sensitivity: [policy interpretation; need for audit support]
- Basis: Source: [ ].

### E) Other deal-specific items (clearly labeled)

**Adjustment E1: [Title]**

- Impact: $[x] / TBD
- Recurrence: [TBD]
- What / Why / How / Residual risk: [complete the four-part rationale]
- Basis: Source: [ ].

**Remaining adjustments (optional summary table if many small items):**

|   ID | Adjustment | Type | Period | Impact ($m) | Recurring? | Basis       |
| ---: | ---------- | ---- | -----: | ----------: | ---------- | ----------- |
| [A2] | [ ]        | [ ]  |    [ ] |        $[x] | [ ]        | Source: [ ] |
| [A3] | [ ]        | [ ]  |    [ ] |        $[x] | [ ]        | Source: [ ] |

## Other considerations (not adjusted; required if applicable)

> The following items may impact historical or future EBITDA but are not reflected in the bridge due to subjectivity and/or insufficient evidence.

- **[Item 1]:** [what it is]. Not included in bridge because [reason].  
  Open item: [data/support needed]. Potential impact direction: [increase/decrease/TBD].
- **[Item 2]:** …

## Key sensitivities and missing information (required)

| Priority | Open item / data request | Why it matters          | Potential impact on Adj. EBITDA | Status                           |
| -------- | ------------------------ | ----------------------- | ------------------------------- | -------------------------------- |
| P0       | [ ]                      | Gating a conclusion     | [↑/↓/TBD; magnitude if known]   | [Requested / Received / Pending] |
| P1       | [ ]                      | Material but not gating | [ ]                             | [ ]                              |
| P2       | [ ]                      | Helpful refinement      | [ ]                             | [ ]                              |
```

If you want these to be even more “drop-in” for implementation, the next deterministic step would be to convert the “Lint checks” in the playbook into explicit, machine-checkable rules (string/regex checks + required-block checks) that mirror the QC checklist’s critical gates and the template’s minimum required elements. Those gates are already explicitly defined in the references. (context/skill/kpmg-fdd/references/qc-checklist.md:L5-L16; context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md:L6-L34)

I started from `context/MANIFEST.md`, which locks Style target **2B** and Quality gate **5C**, and confirms the in-scope canonical section is “04-qoe-and-earnings-adjustments” with the primary sources you specified. (Source: `context/MANIFEST.md`). The section corpus and adjustment library are also explicitly “verbatim validated” with a pass status. (Source: `context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md`).

Assumptions I am making to proceed (no questions, per instructions):

- The implementation will generate this section either as a standalone section (“section_only”) or as part of a full report, and therefore must be self-contained (objective + bridge + rationale + missing information). (Source baseline expectations: `context/skill/kpmg-fdd/references/report-structure.md`, `context/skill/kpmg-fdd/SKILL.md`).
- Inputs may be incomplete; the system must not invent numbers and must convert missing facts into explicitly labeled missing information and placeholders. (Source: `context/skill/kpmg-fdd/SKILL.md`, `context/skill/kpmg-fdd/references/writing-standards.md`, `context/skill/kpmg-fdd/references/qc-checklist.md`).

---

1. Linguistic analysis (section-specific language patterns)

Primary evidence basis: the verbatim QoE section corpus (`context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`) and the QoE adjustments library (`context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`), with house constraints from writing standards/QC. (Sources: those four files + `context/skill/kpmg-fdd/references/writing-standards.md`, `context/skill/kpmg-fdd/references/qc-checklist.md`.)

A. Sentence length and cadence patterns

Observed patterns in the corpus

- “Front-load the takeaway” occurs frequently: the opening sentence in Overview often states reported EBITDA and the adjusted result (e.g., “reported EBITDA … increases/decreases to … after adjustments”). (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)
- The cadence alternates between (i) short label statements and (ii) 1–2 explanatory sentences. Adjustment items often start with a label and a colon, followed by a compact rationale. (Sources: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`, `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`.)
- Colon-heavy structure is common (“X: This adjustment …”), plus list-like blocks for sources of information and the “nature of adjustments” taxonomy. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)
- The house standard reinforces this cadence: “Keep the ‘so what’ in the first 1–2 sentences” and prefer headings/bullets over long paragraphs. (Source: `context/skill/kpmg-fdd/references/writing-standards.md`.)

Keep-as-is patterns (2B: preserve the “QoE voice”)

- “One idea per sentence” for adjustment rationale, with a labeled lead-in:
  - Pattern: “[Adjustment name]: This adjustment [adds back / removes / eliminates] … [because …].” (Corpus pattern source: `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`.)

- Opening sentence that anchors the bridge outcome (reported → adjusted) when numbers exist. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)

Normalize/clean patterns (still corpus-inspired, but house-standardized)

- Split multi-clause, evidence-stacking sentences into:
  1. what changed (reported → adjusted, or what the adjustment is),
  2. why (recurrence framing),
  3. how (quantification/basis),
  4. residual risk.
     This aligns directly to the “defensibility rules for adjustments.” (Source: `context/skill/kpmg-fdd/references/writing-standards.md`.)

- Standardize internal labels (“Reported EBITDA”, “Adjusted EBITDA”, “Adjustment”, “Basis/Source”) and avoid inconsistent capitalization (e.g., “Management” vs “management”) unless it’s a proper noun in source text. (House consistency rules: `context/skill/kpmg-fdd/references/writing-standards.md`.)

Avoid patterns

- Run-on “mega sentences” that mix: adjustment mechanics + narrative + caveats + forward-looking assumptions, without a clear “what/why/how.” These are hard to QC and defend. (QC emphasis on readability and evidence–narrative alignment: `context/skill/kpmg-fdd/references/qc-checklist.md`.)
- “Orphan” headings followed by one sentence and no substance (explicit QC anti-pattern). (Source: `context/skill/kpmg-fdd/references/qc-checklist.md`.)

B. Hedge and certainty phrasing patterns

Observed hedge patterns (high-frequency motifs)

- Management-attributed certainty: “Management represents/indicated/confirmed …” (Sources: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`, `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`.)
- Diligence-team inference hedges: “We understand …”, “It is our understanding …”, “Based on discussions …” (same sources).
- Explicit uncertainty: “may require further investigation”, “not necessarily all-inclusive”, “we were unable to quantify due to limitation of information”, “not provided” (same sources).
- House guidance requires labeling uncertainty (management-provided / estimated / not verified) and separating facts vs judgments. (Source: `context/skill/kpmg-fdd/references/writing-standards.md`.)

Keep-as-is patterns

- Single, explicit attribution hedge tied to evidence:
  - “Management represented that [X]; we have not independently verified [Y].”
    This matches the “explicit about uncertainty” tone and facts-vs-judgments rule. (Source: `context/skill/kpmg-fdd/references/writing-standards.md`.)

- “Not necessarily all-inclusive” disclaimers appear verbatim in multiple corpus entries and are a defensible guardrail. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)

Normalize/clean patterns

- Consolidate hedge language to a small approved set to reduce stylistic variance:
  - “Management represented …”
  - “Based on [source], we understand …”
  - “We were not provided [data]; therefore, we have not quantified …”
  - “We view … because …” (explicitly labeled judgment)
    (These patterns are consistent with corpus + house writing standards. Sources: `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`, `context/skill/kpmg-fdd/references/writing-standards.md`.)

- Require every hedge to “land” somewhere: either a basis line or an open item. (Sources: `context/skill/kpmg-fdd/references/writing-standards.md`, `context/skill/kpmg-fdd/SKILL.md`.)

Avoid patterns

- Over-hedging stacks (“we understand”, “it appears”, “may”, “could”) in the same sentence without adding information. This weakens readability and can sound evasive. (Readability/QC rationale: `context/skill/kpmg-fdd/references/qc-checklist.md`.)
- High-risk certainty claims not supported by provided evidence, especially “we obtained invoices / no discrepancies noted” unless the input actually includes that support and the draft can cite it. (Corpus contains those phrases, but the skill rules say “do not invent” and require basis; this needs gating. Sources: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`, `context/skill/kpmg-fdd/SKILL.md`, `context/skill/kpmg-fdd/references/writing-standards.md`.)

C. Transition logic patterns (bridge logic and reasoning connectors)

Observed transition motifs

- Causal connectors: “Therefore”, “As a result”, “In order to”, “Given that”, “Additionally”, “However” (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)
- Cross-reference transitions: “Please refer to …”, “Refer to Appendix …”, “See … for further detail” (same source).
- “Other considerations” typically begins with a framing sentence that explicitly says items may be subjective and are not included in the QoE schedule. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)

Keep-as-is patterns

- “However” to introduce limits, alternative views, or unquantified items (supports balanced tone). (House tone rules: `context/skill/kpmg-fdd/references/writing-standards.md`.)
- “Therefore / As a result” to connect facts → implication → treatment (why it’s an adjustment). (Same source.)

Normalize/clean patterns

- Replace “Please refer…” with consistent internal referencing:
  - “See Exhibit [X]” / “See Appendix [X]” (client-ready, cleaner than conversational “please”).
    (Exhibit discipline is emphasized in `context/skill/kpmg-fdd/references/exhibits-and-tables.md`.)

Avoid patterns

- “As such” used without a clear antecedent; it often creates logic gaps and makes the conclusion feel unsupported. (Evidence–narrative alignment emphasis: `context/skill/kpmg-fdd/references/qc-checklist.md`.)

D. Quantification phrase patterns

Observed quantification language

- Approximation and ranges: “approximately”, “ranging from”, “equivalent to” (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)
- Difference-based logic: “Represents the difference between [A] and [B]” (common in owner comp and normalization). (Source: `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`.)
- Normalization mechanics: “normalized level based on expenses incurred over the historical period”; “on a pro-rata basis”; “annualize (1/12th …)” (same sources).
- House convention demands that material quantitative claims have a basis/source line and consistent units/signs. (Sources: `context/skill/kpmg-fdd/references/writing-standards.md`, `context/skill/kpmg-fdd/references/exhibits-and-tables.md`.)

Keep-as-is patterns

- “difference between” framing for normalization (intuitive and audit-friendly).
- “pro-rata / annualize” language when the method is stated clearly and tied to a period. (Corpus pattern: `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`.)

Normalize/clean patterns

- Standardize to one quantification sentence template per adjustment:
  - “Quantification: $[x] based on [method] using [data] for [period].”
    (Directly aligns to the “state how quantified” rule. Source: `context/skill/kpmg-fdd/references/writing-standards.md`.)

- Enforce units and negative formatting (parentheses) in tables. (Source: `context/skill/kpmg-fdd/references/exhibits-and-tables.md`.)

Avoid patterns

- “Meaningful / significant” without magnitude, unless clearly labeled as qualitative. (QC language polish guidance: `context/skill/kpmg-fdd/references/qc-checklist.md`.)
- Mixing units ($k and $m) or periods without explicit callout (explicit QC “do not deliver” and consistency rules). (Sources: `context/skill/kpmg-fdd/references/qc-checklist.md`, `context/skill/kpmg-fdd/references/writing-standards.md`.)

E. Caveat / disclaimer patterns

Observed disclaimers that are “section-native”

- “Proposed adjustments are not necessarily all-inclusive and are based on information provided by Management to date… further analysis… could uncover additional…” appears repeatedly. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)
- “Items may be subjective in nature and… have not been included in the QoE schedule” is the standard “Other considerations” disclaimer. (Same source.)
- “We did not obtain [X]; figures therefore based on [Y]” and “unable to quantify due to limitation of information” appear as common defensibility guards. (Sources: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`, `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`.)
- House guidance explicitly requires missing information rather than invented details when basis is missing. (Source: `context/skill/kpmg-fdd/SKILL.md` and `context/skill/kpmg-fdd/references/writing-standards.md`.)

Keep-as-is patterns

- One short “not all-inclusive” disclaimer in Overview.
- One short “subjective / not included” disclaimer at the start of Other considerations.

Normalize/clean patterns

- Avoid repeating the same disclaimer multiple times. Keep it once, and then use targeted “data not provided / not verified” lines at the specific adjustment where it matters. (QC readability + evidence alignment: `context/skill/kpmg-fdd/references/qc-checklist.md`.)

Avoid patterns

- Disclaimers that undermine the section’s purpose (e.g., so many caveats that the reader can’t tell what the adjusted EBITDA is meant to represent). The report structure explicitly expects a decision-useful reconciliation and missing information to gate what’s missing. (Source: `context/skill/kpmg-fdd/references/report-structure.md`.)

---

2. Structural analysis (dominant variants + recommended default structure)

A. Dominant internal structure variants in the corpus

Top-level structure is highly consistent

- All 23 corpus entries contain the same three internal headings: “Overview”, “Quality of earnings adjustments”, and “Other considerations”. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)

Observed variants inside “Quality of earnings adjustments”

1. “Grouped-by-origin” variant (classic QoE schedule style)
   - Sub-buckets like “Management adjustments”, “Potential adjustments”, and sometimes “Pro forma adjustments”. (Source examples exist in the corpus and the adjustments library: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`, `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`.)

2. “Direct adjustment list” variant (numbered list of adjustment names)
   - Adjustments enumerated as discrete items (e.g., “1. [Adjustment name]: …”) without the management vs diligence grouping. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)

3. “Definitional adjustments present” variant (rare)
   - One entry includes a “Definitional adjustments” block before the main adjustments section (used to define EBITDA components like interest removal). (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)

Also present (corpus artifact)

- “Not present in source report” placeholders appear in some entries where content didn’t exist in the originating report. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)

B. Recommended default structure for the skill

Default structure (recommended for generation)
This is the structure I recommend as the canonical implementation because it is (i) aligned to house minimum requirements and QC “do not deliver” gates, and (ii) consistent with the section templates and exhibits discipline. (Sources: `context/skill/kpmg-fdd/references/report-structure.md`, `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md`, `context/skill/kpmg-fdd/references/exhibits-and-tables.md`, `context/skill/kpmg-fdd/references/qc-checklist.md`.)

Required blocks (must always be present)

1. Overview (1 short paragraph, exec-readable)
   - Must include periods covered and (if available) the reported → adjusted headline.
   - Must include one “not all-inclusive / based on info provided” disclaimer.

2. Exhibit: Reported to Adjusted EBITDA bridge (table)
   - Required by QC: “QoE section present but no reported-to-adjusted bridge” is a do-not-deliver condition. (Source: `context/skill/kpmg-fdd/references/qc-checklist.md`.)
   - Must include period, units, and source/basis. (Source: `context/skill/kpmg-fdd/references/exhibits-and-tables.md`.)

3. Adjustments detail table (auditability table)
   - Per adjustment: description, impact, recurrence assessment, basis/source. (Source: `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md` and the suggested table format in `context/skill/kpmg-fdd/references/exhibits-and-tables.md`.)

4. Adjustment rationale narrative (grouped by type)
   - Must state what/why/how/residual risk for material items. (Source: “Defensibility rules for adjustments” in `context/skill/kpmg-fdd/references/writing-standards.md`.)

5. Sensitivities and missing information (P0/P1/P2)
   - Must list what could materially move adjusted earnings (data gaps, disputes, cut-off). (Source: `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md` and missing information rules in `context/skill/kpmg-fdd/references/writing-standards.md`.)

Optional blocks (allowed when relevant)
A) Definitional adjustments (only when EBITDA definition is non-standard or needs explicit reconciliation)

- Rare but present in corpus. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)
  B) Other considerations (not adjusted)
- Consistently present in corpus; recommended as default if there are known issues not included in adjusted EBITDA, explicitly flagged as “not in the schedule” and potentially subjective. (Source: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`.)
  C) Appendix: Top adjustment support schedule
- Template suggests a support schedule for top 5 adjustments. (Source: `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md` and `context/skill/kpmg-fdd/references/analysis-playbooks/qoe-playbook.md`.)

Allowed variants (structured flexibility)

- Variant 1 (preserve management schedule taxonomy): If input is already bucketed as Management vs Potential vs Pro forma, preserve those headings in the narrative, but still present the bridge and auditability table in the house format. (Source alignment: corpus + template; `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`, `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md`.)
- Variant 2 (small-adjustment set): If there are ≤5 adjustments total, narrative can be “one section with numbered adjustment rationale blocks” instead of type-grouping, but recurrence + basis requirements remain mandatory. (House defensibility rules: `context/skill/kpmg-fdd/references/writing-standards.md`.)

---

3. Failure-mode analysis (generation risks + detection + prevention)

These failure modes are written to be implementable as (i) prompt constraints, (ii) template constraints, and (iii) deterministic lint checks.

Failure mode 1: Missing reported-to-adjusted bridge (or bridge doesn’t tie)

- Why it happens: generator drafts narrative without building the reconciliation table; or totals/units mismatch.
- Detection heuristics:
  - Structural lint: QoE section must include an exhibit/table containing “Reported EBITDA” and “Adjusted EBITDA” (case-insensitive). If absent → fail.
  - Arithmetic lint (when numeric values exist): reported + sum(adjustments) must equal adjusted; if not, flag. (QC expects bridges add up. Source: `context/skill/kpmg-fdd/references/qc-checklist.md`.)

- Prevention controls:
  - Prompt rule: “Do not write narrative until you output the bridge table skeleton.”
  - Template constraint: bridge table is non-optional and appears before rationale narrative.
  - QC gate: hard stop if bridge missing (do-not-deliver). (Source: `context/skill/kpmg-fdd/references/qc-checklist.md`.)

Failure mode 2: Invented numbers or unsupported quantitative claims

- Why it happens: model “helpfully” fills blanks.
- Detection heuristics:
  - Regex lint: flag any “$X”, “$xx”, or numbers in key metrics without a “Source:”/“Basis:” line nearby.
  - Placeholder lint: enforce the skill placeholder convention (e.g., `$[x]`, `[Date]`) when data missing. (Source: `context/skill/kpmg-fdd/SKILL.md`.)

- Prevention controls:
  - Prompt rule: “If any number is not in inputs, use `$[x]` and add to Missing information.”
  - Template constraint: every table includes a “Basis” column; if blank → must be “Open item – basis needed”.
  - QC gate: “Material quantitative claims have no basis/source” → fail. (Source: `context/skill/kpmg-fdd/references/qc-checklist.md`.)

Failure mode 3: Adjustment rationale missing one of what / why / how / residual risk

- Why it happens: narrative becomes descriptive but not defensible.
- Detection heuristics:
  - Content lint for each “material” adjustment row: must contain all of:
    - Recurrence label (Non-recurring / Run-rate / Recurring / TBD),
    - Basis/source reference,
    - Quantification method (even if “TBD – pending [data]”),
    - Residual risk/sensitivity line (or “None noted” only if supported).

  - If any missing → flag.

- Prevention controls:
  - Prompt rule uses the defensibility rule set as a checklist per adjustment. (Source: `context/skill/kpmg-fdd/references/writing-standards.md`.)
  - Template provides a mini-structure for each top adjustment: “What / Why / How / Residual risk”.

Failure mode 4: Overstated assurance language (“we obtained invoices”, “no discrepancies noted”) without evidence

- Why it happens: corpus includes this phrasing; model mimics it.
- Detection heuristics:
  - Regex lint for phrases: “we obtained”, “no discrepancies noted”, “we verified”, “we reviewed invoices”.
  - If present and no explicit evidence input tag/basis line references invoices → flag.

- Prevention controls:
  - Prompt rule: “Never claim evidence review activities unless the input explicitly states it and you can cite the basis.”
  - Template language defaults to “Based on [source]…” rather than “we obtained…”.
    (Basis discipline: `context/skill/kpmg-fdd/references/writing-standards.md`; no invention: `context/skill/kpmg-fdd/SKILL.md`.)

Failure mode 5: Misclassification of recurring vs non-recurring (or no recurrence framing)

- Why it happens: label applied without rationale; or “one-time” used as a default.
- Detection heuristics:
  - For any adjustment labeled non-recurring: require a rationale sentence explaining why it is not expected to recur (event-based, transaction-based, discontinued practice, etc.).
  - For run-rate adjustments: require “go-forward state” statement (what changes and when).

- Prevention controls:
  - Prompt rule: “Non-recurring requires a specific recurrence argument; if uncertain, label ‘TBD’ and list as open item.”
  - Template includes “Recurrence assessment” column + “Recurrence rationale” bullet.

Failure mode 6: Period / units / EBITDA definition inconsistencies across the section

- Why it happens: mixing FY vs LTM, $k vs $m, or EBITDA definition differs between bridge and narrative.
- Detection heuristics:
  - Units lint: detect multiple unit tokens ($m, $k, $mm) in same section.
  - Period lint: detect multiple period anchors (FY20xx vs TTM vs LTM) without an explicit “Periods covered” line in Overview.
  - Definition lint: if “Definitional adjustments” present, require the definitional description to match what is included/excluded in the bridge.
    (Sources: consistency rules in `context/skill/kpmg-fdd/references/writing-standards.md`, exhibit minimums in `context/skill/kpmg-fdd/references/exhibits-and-tables.md`, QC checks in `context/skill/kpmg-fdd/references/qc-checklist.md`.)

Failure mode 7: “Other considerations” incorrectly treated as adjustments (or unclear separation)

- Why it happens: narrative blends unquantified risks into EBITDA.
- Detection heuristics:
  - Require the “Other considerations” intro sentence to explicitly say items are not included in the adjusted EBITDA schedule (unless explicitly quantified and moved into adjustments).
  - Flag if Other considerations items have numeric impact but are not in the bridge table.

- Prevention controls:
  - Template hard-separates “Adjustments included in Adjusted EBITDA” vs “Other considerations not adjusted”.
    (Corpus uses this disclaimer; house evidence alignment expects it. Sources: `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`, `context/skill/kpmg-fdd/references/qc-checklist.md`.)

---

4. Draft markdown playbook (implementable)

```markdown
# Playbook: QoE and earnings adjustments (Style 2B / Quality gate 5C)

## Objective

Reconcile reported earnings (typically EBITDA) to a normalized, decision-useful measure with a defensible reported-to-adjusted bridge, clear recurrence framing, and explicit evidence/basis.

This section must be client-ready and QC-defensible:

- Include a reported → adjustments → adjusted bridge (do-not-deliver if missing).
- Do not invent numbers; use placeholders and missing information when data is missing.

References (authoritative):

- Writing standards & defensibility: `context/skill/kpmg-fdd/references/writing-standards.md`
- QC gates: `context/skill/kpmg-fdd/references/qc-checklist.md`
- Exhibit/table rules: `context/skill/kpmg-fdd/references/exhibits-and-tables.md`
- Section minimums: `context/skill/kpmg-fdd/references/report-structure.md`
- Baseline QoE template: `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md`
- Corpus patterns (verbatim): `context/docs/report-mining/section-corpus/sections/qoe-and-earnings-adjustments.md`
- Adjustment language library: `context/docs/report-mining/section-corpus/adjustments/qoe-adjustments-library.md`

## Required inputs (use what exists; do not block)

1. Periods covered

- e.g., FY2023–FY2025; LTM to [Date]; TTM to [Date]

2. Reported earnings metric

- Reported EBITDA for each period (or a single period if only one is in scope)
- Definition notes if EBITDA is non-standard (optional but recommended)

3. Adjustments list (structured if possible)
   For each adjustment:

- Name / label
- Type bucket (Non-recurring / Run-rate / Owner & discretionary / Accounting & classification / Other)
- Period(s) impacted
- Amount (or $[x] if unknown)
- Direction (add-back vs removal)
- Recurrence assessment (Non-recurring / Run-rate / Recurring / TBD)
- Quantification method (what data and how calculated)
- Basis/source (trial balance, GL extract, mgmt schedule, audited FS, invoice support, etc.)
- Residual risk / sensitivity (what could change)

4. Evidence inventory (basis strings)

- A short list of documents reviewed and any limitations (e.g., “Mgmt adjustment schedule (unaudited)”, “Trial balance extract dated [Date]”)

If any of the above are missing:

- Use $[x] placeholders for amounts.
- Add a clearly worded open item with priority (P0/P1/P2).
- Do not claim verification activities unless explicitly supported by the input.

## Canonical block order (must follow)

1. Overview (exec-readable)
2. Exhibit: Reported to Adjusted EBITDA Bridge (summary totals)
3. Exhibit: Adjustments detail table (auditability table)
4. Adjustment rationale narrative (grouped by type; focus on material items)
5. Other considerations (not adjusted; explicitly labeled)
6. Sensitivities and missing information (prioritized)

## Evidence and basis rules (defensibility)

For each _material_ adjustment, the narrative must explicitly state:

- What the adjustment is
- Why it is non-recurring or run-rate (recurrence argument)
- How it was quantified (data, period, assumptions)
- Residual risk / what could change

For any material quantitative claim:

- Include a “Source:” or “Basis:” line (or mark as open item if unavailable).

## Adjustment rationale language (preferred patterns)

Use concise, audit-friendly phrasing that mirrors the corpus while staying house-standardized:

- “This adjustment removes [item] from EBITDA as it is [non-operational / not reflective of run-rate].”
- “This adjustment adds back [expense] related to [event] as it is considered non-recurring.”
- “This adjustment replaces reported [owner compensation] with a normalized level of $[x], based on [basis].”
- “Quantification: $[x] based on [method] using [data] for [period].”
- “Residual risk: [what could move] (Open item: [data needed]).”

Avoid:

- Absolutes without evidence (“fully normalized”, “no risk”).
- Evidence claims without support (“we obtained invoices”, “no discrepancies noted”) unless explicitly evidenced.

## Recurrence framing rules

Every adjustment must have a recurrence label and rationale:

- Non-recurring: event-based, transaction-based, discontinued practice, settlement, one-time system implementation, etc.
- Run-rate: a known go-forward state change (new lease terms, headcount plan, policy change) with timing.
- Recurring: reclassifications or items expected to continue; adjust only if definitional.
- TBD: if unclear; do not force a label—add an open item.

## Bridge logic rules

- The bridge must reconcile: Reported EBITDA + net adjustments = Adjusted EBITDA.
- Adjustments must be directionally consistent with the narrative (“adds back” should be positive; “removes” should be negative).
- All tables must state period and units, and use parentheses for negatives.

## Open-item behavior (when data is missing)

If an adjustment is identified but not quantified:

- Include it in the adjustments detail table with Impact = “TBD” and Recurrence = “TBD” if needed.
- Add a corresponding open item specifying exactly what is needed to quantify it (e.g., GL detail, invoice, headcount plan, contract).
- Do not include unquantified items in Adjusted EBITDA totals; keep them in “Other considerations” unless explicitly treated as a sensitivity.

If reported EBITDA is missing:

- Provide bridge table skeleton with $[x] placeholders and list reported EBITDA as a P0 open item.

## Style rules (2B)

- First 1–2 sentences must communicate the “so what” (reported vs adjusted, or what is missing to conclude).
- Use short paragraphs and bullets; avoid dense blocks.
- Label uncertainty explicitly (management-provided / not audited / not verified).
- Keep terminology consistent: EBITDA definition, periods, units, sign conventions.

## QA checks and gates (5C pass/fail)

Hard fail (do not deliver as “final”):

- No reported-to-adjusted bridge table.
- Bridge does not tie when numbers are present.
- Material quantitative claims without basis/source and not flagged as missing information.
- Invented numbers (placeholders not clearly labeled).
- Inconsistent units/periods within the section.

Pass checks:

- Overview includes periods covered and a headline conclusion or clearly stated gating gap.
- Each material adjustment includes what/why/how/residual risk and a basis.
- Other considerations are clearly separated from adjustments.
- Missing information are prioritized (P0/P1/P2) and specific.
```

---

5. Draft markdown template (implementable)

```markdown
# QoE and earnings adjustments

## Overview

Reported EBITDA of $[x] for [Period] adjusts to $[x] after net adjustments of $[x]. The net adjustment is primarily driven by: (i) [Top driver 1], (ii) [Top driver 2], and (iii) [Top driver 3].

The proposed adjustments are not necessarily all-inclusive and are based on information provided by Management to date; further analysis and access to additional information could identify additional or different adjustments.

**Periods covered:** [FY20XX–FY20XX / LTM to DD MMM YYYY]  
**Units:** [$m / $k]  
**Primary sources reviewed:** [Management adjustment schedule dated …; trial balance extract dated …; audited FS FY… (if applicable)]  
**Limitations (if applicable):** [e.g., monthly financials not provided; certain schedules unaudited]

---

### Exhibit 1: Reported to Adjusted EBITDA Bridge ([Period], [$m])

| Bridge line             | Amount |
| ----------------------- | -----: |
| Reported EBITDA         |   $[x] |
| + / (–) Net adjustments |   $[x] |
| Adjusted EBITDA         |   $[x] |

**Source/Basis:** [e.g., Reported EBITDA per trial balance extract dated …; adjustments per management schedule dated … (unaudited).]  
**Tie-out check:** Reported EBITDA + Net adjustments = Adjusted EBITDA (must tie; if not, flag as P0 open item).

---

### Exhibit 2: Adjustments detail ([Periods], [$m])

| Adjustment type             | Adjustment        | Description (what)     | Period   | Impact ($m) | Recurrence (NR / RR / Run-rate / TBD) | Basis / Source | Residual risk / sensitivity           |
| --------------------------- | ----------------- | ---------------------- | -------- | ----------: | ------------------------------------- | -------------- | ------------------------------------- |
| Non-recurring               | [Adjustment name] | [One-line description] | [FY20XX] |        $[x] | [NR]                                  | [Source]       | [What could change / data gap]        |
| Run-rate                    | [Adjustment name] | [One-line description] | [LTM]    |        $[x] | [Run-rate]                            | [Source]       | [What could change / timing risk]     |
| Owner & discretionary       | [Adjustment name] | [One-line description] | [FY20XX] |        $[x] | [NR / Run-rate / TBD]                 | [Source]       | [What could change]                   |
| Accounting / classification | [Adjustment name] | [One-line description] | [FY20XX] |        $[x] | [RR / TBD]                            | [Source]       | [Definition risk / policy difference] |
| Other                       | [Adjustment name] | [One-line description] | [FY20XX] |        $[x] | [TBD]                                 | [Source]       | [What could change]                   |

**Notes:**

- Use parentheses for negative impacts.
- If Impact is not quantified, write “TBD” and do not include it in the bridge total; add as an open item and/or include under “Other considerations”.

---

## Adjustment rationale (by type)

### Non-recurring items

For each material item, use the defensibility block below:

**[Adjustment name] — $[x] ([Period])**

- **What:** [What the adjustment removes/adds back.]
- **Why (recurrence):** [Why non-recurring; why not expected to recur.]
- **How quantified:** [Data used, method, assumptions; or “TBD – pending …”.]
- **Basis/Source:** [Trial balance / GL / management schedule / invoice / audited FS.]
- **Residual risk:** [What could change conclusion; what evidence still needed.]

[Repeat for remaining material non-recurring items; summarize immaterial items in 1–2 bullets.]

### Run-rate normalization

**[Adjustment name] — $[x] ([Period])**

- **What:** [Describe the go-forward change.]
- **Why (run-rate):** [Why this represents normalized future state; timing.]
- **How quantified:** [Method; period used; assumptions.]
- **Basis/Source:** [Source.]
- **Residual risk:** [Implementation risk / timing / partial-year impact.]

### Owner/related-party and discretionary items

**[Adjustment name] — $[x] ([Period])**

- **What:** [Owner comp / personal expenses / related-party charges.]
- **Why:** [Why not required post-close / normalized replacement.]
- **How quantified:** [Difference vs normalized level; basis.]
- **Basis/Source:** [GL accounts / schedule.]
- **Residual risk:** [Benchmarking risk / buyer operating model.]

### Accounting / classification items

**[Adjustment name] — $[x] ([Period])**

- **What:** [Reclass / definitional item affecting EBITDA comparability.]
- **Why:** [EBITDA definition consistency / policy alignment.]
- **How quantified:** [Mechanics.]
- **Basis/Source:** [FS note / TB mapping / policy memo.]
- **Residual risk:** [Policy differences; require confirmation.]

---

## Other considerations (not included in adjusted EBITDA)

The following items may be subjective in nature and/or are not fully quantified; accordingly, they have not been included in the adjusted EBITDA schedule above. These items should be considered in the overall evaluation of the business.

- **[Item]**: [Why it matters; qualitative direction of impact; whether it could become an adjustment with more data.]
- **[Item]**: [Same.]

---

## Sensitivities and missing information (prioritized)

### P0 (gating / could materially change adjusted EBITDA)

- [Open item: what data is missing; why it matters; what it would affect (bridge line / adjustment).]

### P1 (important; may change magnitude / classification)

- [Open item.]

### P2 (nice-to-have / confirmatory)

- [Open item.]
```

---

If you want to plug this directly into the skill repo, the most “implementation-leveraged” parts are:

- The required block order + mandatory bridge requirement (ties to the QC do-not-deliver gate). (Source: `context/skill/kpmg-fdd/references/qc-checklist.md`.)
- The per-adjustment “what/why/how/residual risk” constraint (defensibility). (Source: `context/skill/kpmg-fdd/references/writing-standards.md`.)
- The adjustments detail table schema (auditability table + basis column). (Source: `context/skill/kpmg-fdd/references/exhibits-and-tables.md` and `context/skill/kpmg-fdd/references/section-templates/qoe-adjustments.md`.)
