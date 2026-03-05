Starting point (as instructed): `context/MANIFEST.md` frames this as “section-focused analysis and draft assets for 03-historical-financial-performance”, with “Style target 2B” and “quality gate 5C” locked, and explicitly requires “concrete markdown playbook and markdown template drafts” with “no clarification questions.” `[context/MANIFEST.md:L8-L15]`

Assumptions I will use (explicit, then I proceed):

- The section corpus is authoritative and verbatim. This is supported by the corpus README (“preserves verbatim section text”) and the validation report (“overall_status: pass”, failures 0, and the historical-financial-performance section having 23 entries). `[context/docs/report-mining/section-corpus/README.md:L1-L4]` `[context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md:L1-L17]`
- No adjustment-library file is included in this zip (MANIFEST includes only the 12 files listed; no `adjustments/*` files are present). Therefore, this playbook will not assume an adjustment library exists for this section; any “adjusted” metric referenced must be explicitly supported by an exhibit/basis line or flagged as an open item. `[context/MANIFEST.md:L32-L44]`

1. Linguistic analysis

A. Sentence length and cadence patterns

Observed in corpus (section-specific)

- Two-block macro cadence: “Overview” prose first, then “Key Drivers” as a numbered list. This appears immediately even in the shortest entries (e.g., `project-ascend` shows “## Overview” followed by “## Key Drivers” and numbered items). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L16-L26]`
- Overview often uses a “headline trend sentence” cadence: one or two short, quantitative trend statements (“increased from…to…”) followed by expansion or segmentation. Example: `project-ascend` starts with two compact margin trend sentences. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L18-L20]`
- When the narrative becomes detailed, the corpus shifts to “analysis modules” inside Overview (client concentration, headcount, cash flow), often introduced with a short lead-in sentence, then multi-sentence blocks. Example: `project-autobahn` uses successive analytic blocks (revenue vs forecast, client concentration, headcount, cash flow), each with transitions and table/graph references. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L43-L86]`
- Key Drivers tends to be shorter, list-driven, and label-forward: items are numbered and commonly begin with a driver label + colon (e.g., “Gross profit: …”, “Revenue: …”). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L23-L26]` `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1314-L1320]`

Keep as-is patterns

- “1–2 sentence ‘so what’ headline” at the start of Overview, especially when quantitative and period-labeled. This aligns with the house standard “Keep the ‘so what’ in the first 1–2 sentences.” `[context/skill/kpmg-fdd/references/writing-standards.md:L79-L81]`
- Numbered Key Drivers list (not bullets) as the primary driver format. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L21-L26]`
- Driver labels (“Revenue:”, “Gross profit:”, “EBITDA:”) to force clarity. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L23-L26]` `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1306-L1310]`

Normalize / clean patterns

- Replace “above / below / adjacent” layout-references with explicit exhibit references. The corpus frequently uses “the above table”, “adjacent table”, “adjacent chart”, etc. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L43-L54]`
  Normalized pattern: “As shown in Exhibit H1…” rather than “the adjacent table…”
- Replace non-standard bullet glyphs (“•”, “■”) with consistent markdown bullets. Example: dental entry uses “•” lines inside drivers. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L224-L242]`
- Break up run-on sentences in Overview into 2–3 sentences to preserve reviewability; use subheadings and bullets instead of long unstructured paragraphs (house standard). `[context/skill/kpmg-fdd/references/writing-standards.md:L79-L81]`

Avoid patterns

- Unstructured “wall-of-text” Overview without subheadings/bullets (violates “use headings and subheadings (avoid long unstructured paragraphs)”). `[context/skill/kpmg-fdd/references/writing-standards.md:L79-L81]`
- “Salesy”/value-judgment phrasing without an evidentiary anchor (e.g., “successfully managed to recover…”). `[context/skill/kpmg-fdd/references/writing-standards.md:L13-L20]` `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1337-L1340]`

B. Hedge and certainty phrasing patterns

Observed in corpus

- Strong attribution to management is common and section-appropriate:
  - “We understand…” is used to flag management-provided information or unverified context. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L24-L25]` `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1312-L1313]`
  - “Management informed us…” similarly attributes a statement to management. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L358-L359]`

- Defensibility-oriented caveats appear explicitly when support is missing:
  - “could not provide supporting documentation…” is used to avoid overstating certainty. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1168-L1169]`

Keep as-is patterns

- Explicit uncertainty labeling and management attribution (house standard: “Explicit about uncertainty… label it.”). `[context/skill/kpmg-fdd/references/writing-standards.md:L13-L16]`
- “Management did not provide [X]” or “could not provide supporting documentation” phrasing when the team lacks evidence. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1168-L1169]`

Normalize / clean patterns

- Standardize attribution vocabulary to a small set so the section reads consistently:
  - Prefer: “Management indicated…” / “Management represented…” for assertions
  - Use: “Based on [source]…” for verified facts
    This directly supports “Facts vs judgments” and “Sourcing and basis conventions.” `[context/skill/kpmg-fdd/references/writing-standards.md:L32-L45]`

Avoid patterns

- Unqualified absolutes (“no seasonality”, “fully normalized”) unless the evidence is explicit (house “avoid unqualified absolutes”). `[context/skill/kpmg-fdd/references/writing-standards.md:L17-L20]`
- Drivers stated as fact without attribution or basis (explicitly prohibited by the section template baseline: “Do not assert a driver … without evidence.”). `[context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L26-L28]`

C. Transition logic patterns

Observed in corpus

- Contrast and limitation transitions: “However…” is widely used to temper a headline trend with nuance (e.g., revenue increased, however only certain clients grew). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L45-L48]`
- Evidence signposting: “As shown…” + table/graph reference is common (but frequently uses “adjacent”). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L51-L54]`
- Cause/effect chaining: “This was primarily driven by…”, “As a result…”, “Furthermore…”. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L45-L46]` `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L57-L58]` `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L85-L86]`

Keep as-is patterns

- “However” for balanced writing (supports “balanced tone; risks not minimized”). `[context/skill/kpmg-fdd/SKILL.md:L76-L81]`
- “As shown in Exhibit…” signposting to enforce evidence–narrative alignment. `[context/skill/kpmg-fdd/SKILL.md:L78-L80]`

Normalize / clean patterns

- Replace “As shown in the adjacent table…” with “As shown in Exhibit H#…” (explicit exhibit linkage). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L51-L54]`
- Replace “Refer to Appendix…” with cross-references that exist in the canonical report structure (e.g., “Refer to QoE section…”), and only if that section is present. Corpus uses QoE cross-references frequently. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L82-L84]`

Avoid patterns

- “Page X” references (fragile in markdown outputs); replace with Exhibit/Section IDs (implementation rule).

D. Quantification phrase patterns

Observed in corpus

- Trend deltas:
  - “increased from $X in FY## to $Y in [period]” `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L18-L19]` `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1306-L1310]`
  - “increased to $Y in [period] from $X in FY##” `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L47-L48]`

- Mix / concentration:
  - “accounted for [x]% of total revenue…” `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L48-L49]`
  - “represented over [x]%…” `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L163-L164]`

- Ranges for commercial context:
  - “billing rates … range from $50–$150…” `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L23-L25]`

- Explicit basis line sometimes appears at the end of a driver block (“Source: …”). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L242-L243]`

Keep as-is patterns

- Period-labeled deltas (“FY22 → FY24”, “TTM Dec-18”, “LTM Aug-20”) because they support period discipline (also mandated by QC). `[context/skill/kpmg-fdd/references/qc-checklist.md:L11-L13]`
- “accounted for” and “represented” phrasing for concentration (clear and quantifiable).

Normalize / clean patterns

- Standardize units notation across the section (pick one: $m vs $mm; % vs bps) and be consistent across narrative and exhibits (house + QC requirement). `[context/skill/kpmg-fdd/references/writing-standards.md:L55-L61]` `[context/skill/kpmg-fdd/references/qc-checklist.md:L20-L26]`
- Use parentheses for negatives (house exhibit standard). `[context/skill/kpmg-fdd/references/exhibits-and-tables.md:L34-L37]`

Avoid patterns

- “significant / meaningful” without quantification (QC explicitly flags vague quantifiers). `[context/skill/kpmg-fdd/references/qc-checklist.md:L37-L41]`

E. Caveat / disclaimer patterns

Observed in corpus

- Estimation methods called out explicitly (annualizing YTD). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L79-L80]`
- Limitations on support: “could not provide supporting documentation…” `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1168-L1169]`
- Data availability limitations and “may be overstated” caveats. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L191-L193]`
- “Not present in source report” placeholders appear in some entries. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1213-L1221]`

Keep as-is patterns

- Explicitly labeling estimates, limitations, and what wasn’t verified (writing standards). `[context/skill/kpmg-fdd/references/writing-standards.md:L13-L16]`

Normalize / clean patterns

- Move caveats into a dedicated “Data quality & limitations” sub-block (baseline template expects this). `[context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L17-L20]`

Avoid patterns

- Leaving missing content as silent gaps; instead, explicitly list as missing information and use labeled placeholders (skill critical rule). `[context/skill/kpmg-fdd/SKILL.md:L69-L73]`

2. Structural analysis

A. Dominant internal structure variants in the corpus

Variant 1: Minimal “two-sentence Overview + 2 drivers”

- Overview is 1–3 sentences (often directly stating GM/revenue trends), followed by 2 Key Drivers items. Example: `project-ascend`. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L16-L26]`

Variant 2: Analysis-heavy Overview with multiple modules + short Key Drivers summary

- Overview includes multiple analytic blocks (forecast vs actual, client concentration, headcount, cash flow) with frequent table/graph signposts; Key Drivers compresses these into a few labeled items. Example: `project-autobahn`. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L43-L90]`

Variant 3: “Line-item definitions” style Overview (common for financial services / complex revenue)

- Overview reads like a definition schedule: “Net interest income: …”, “Interchange income: …”, etc. Example: `project-everest`. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L719-L735]`

Variant 4: YoY period comparison drivers with sub-bullets + explicit Source line

- Key Drivers structured as “FY22 to FY23”, “FY23 to FY24”, each with bullet subpoints and sometimes a “Source: …” line. Example: `project-dental`. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L224-L243]`

Variant 5: Missing-content placeholder

- Overview and Key Drivers exist but content is “Not present in source report”. Example: `project-west`. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L1213-L1221]`

B. Recommended default structure (for the skill)

Default structure (recommended for “Standard report” output)
This aligns to the canonical section objective/minimum content (“Revenue, gross profit, EBITDA trends… margin drivers… seasonality/concentration if evidenced”). `[context/skill/kpmg-fdd/references/report-structure.md:L118-L125]` and the baseline P&L overview template. `[context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L3-L20]`

Required sub-blocks (must appear)

1. Overview (headline + brief narrative)

- Must include: period covered + at least one quantified trend statement (revenue and/or EBITDA) and one “why” statement tied to evidence. (Supports “so what in first 1–2 sentences”). `[context/skill/kpmg-fdd/references/writing-standards.md:L79-L81]`

2. Exhibit: Summary P&L (multi-period)

- Must include: period, units, and source/basis line (exhibit minimums). `[context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27]`
- The summary P&L exhibit is also explicitly suggested by the baseline template. `[context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L21-L24]`

3. Key Drivers (numbered list)

- Must have at least 2 drivers; default target 4–6 for standard depth.
- Each driver must include either (a) exhibit reference, or (b) explicit basis line; otherwise it must be written as an open question / open item (QC rule). `[context/skill/kpmg-fdd/references/qc-checklist.md:L31-L36]`

4. Data quality notes

- Must include audit status / reporting basis (audited vs management reporting) if known; otherwise explicitly list as an open item (baseline template). `[context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L17-L20]` and the skill “do not invent” rule. `[context/skill/kpmg-fdd/SKILL.md:L69-L73]`

Optional sub-blocks (allowed when evidenced or requested)

- Revenue decomposition (price/volume/mix, acquisitions) – only if evidenced. `[context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L12-L16]`
- Customer concentration / top customer analysis (Variant 2; common in corpus). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L47-L56]`
- Headcount and labor cost analysis (Variant 2). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L71-L77]`
- Cash flow / FCF bridge (Variant 2). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L81-L86]`
- Line-item definitions (Variant 3) for financial institutions / complex revenue. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L719-L735]`
- YoY comparison driver block (Variant 4) when the IC/client wants explicit FY-to-FY driver narratives. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L224-L257]`

Allowed variants (explicitly supported by the playbook)

- “Quick memo” variant: keep to Exhibit + 2–3 key drivers; short overview (Variant 1 style).
- “Complex revenue definitions” variant: add a “Revenue line items definitions” subsection (Variant 3 style).
- “Deep report” variant: add up to 2 supplemental exhibits (e.g., revenue bridge, margin bridge) if evidence is available (consistent with exhibit discipline). `[context/skill/kpmg-fdd/references/exhibits-and-tables.md:L5-L19]`

3. Failure-mode analysis

The failure modes below are the ones most likely to break the 5C target (client-ready + defensible), given the corpus patterns and the house QC rules.

Failure mode 1: Period mixing / unclear period definitions

- What it looks like: narrative compares FY vs LTM/TTM without defining the cut-offs; table uses one period set and narrative uses another.
- Why it’s common here: corpus uses FY + TTM/T11M/YTD in the same section (e.g., FY17 vs TTM Dec-18). `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L47-L52]`
- Detection heuristic (lint)
  - Fail if no explicit “Period covered:” line near the top of the section.
  - Flag if multiple period tokens appear (FY, LTM, TTM, YTD) and there is no “Period definitions” note.

- Prevention controls
  - Template constraint: include a mandatory “Period covered / Units” header line (cannot be deleted).
  - Prompt rule: “Do not write any number without a period label unless it is a ratio that is clearly within the same exhibit period.”
  - QC gate: “Units and periods inconsistent” is a do-not-deliver check. `[context/skill/kpmg-fdd/references/qc-checklist.md:L11-L13]`

Failure mode 2: Units inconsistency (mixing $m, $k, %, bps; or missing units)

- Detection heuristic (lint)
  - Fail if no “Units:” line.
  - Fail if an exhibit caption is missing period/units/source (required). `[context/skill/kpmg-fdd/references/exhibits-and-tables.md:L20-L27]`

- Prevention controls
  - Template: include a units row in financial tables (required). `[context/skill/kpmg-fdd/references/exhibits-and-tables.md:L34-L37]`
  - Prompt rule: “Use one currency unit for the whole section; if exceptions exist, explicitly say ‘unless otherwise stated’.”

Failure mode 3: Driver statements without evidence (“driver–evidence disconnect”)

- What it looks like: “Growth was driven by mix” but no exhibit, no KPI, no management statement.
- House rule: explicitly prohibited in the baseline template. `[context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L26-L28]`
- Detection heuristic (lint)
  - Flag sentences containing driver-verbs (“driven by”, “due to”, “as a result of”) unless within the same bullet there is an exhibit reference (“Exhibit”) or “Source/Basis:” tag.

- Prevention controls
  - Template constraint: every Key Driver item contains an “Evidence/Basis:” sub-bullet placeholder.
  - QC check: evidence–narrative alignment required. `[context/skill/kpmg-fdd/references/qc-checklist.md:L31-L36]`

Failure mode 4: Invented numbers or unlabeled placeholders

- House rule: “Do not invent numbers… use placeholders such as $[x]… [Date]”. `[context/skill/kpmg-fdd/SKILL.md:L69-L73]`
- Detection heuristic (lint)
  - Fail if patterns like “$X” or “FY20XX” appear (unbracketed placeholder).
  - Fail if the section includes “EBITDA was $[x]” but no open item list exists describing missing inputs.
  - QC do-not-deliver includes “invented placeholders not labeled”. `[context/skill/kpmg-fdd/references/qc-checklist.md:L13-L16]`

- Prevention controls
  - Prompt rule: “If a numeric field is missing, write ‘$[x]’ and add an open item specifying the exact missing source.”
  - Template: include a small “Missing information (section-specific)” block that must be populated if placeholders exist.

Failure mode 5: Layout-references (“above / below / adjacent”) that break in markdown/DOCX

- Observed in corpus: frequent “above table”, “adjacent table”, “below chart”. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L43-L54]` `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L78-L82]`
- Detection heuristic (lint)
  - Flag words: “above”, “below”, “adjacent”, “following page”, “page”.

- Prevention controls
  - Template: force “Exhibit H#” referencing style.
  - Prompt rule: “Do not use spatial references; use exhibit IDs.”

Failure mode 6: Drifting into prescriptive recommendations / legal advice inside this section

- Observed in corpus: “should…”, “Consult with your legal advisor…” appears within the historical performance section content. `[context/docs/report-mining/section-corpus/sections/historical-financial-performance.md:L160-L170]`
- Why it’s risky: this section’s objective is historical performance + drivers; recommendations belong in missing information and risks, and legal advice is out of scope for FDD writing standards unless explicitly requested.
- Detection heuristic (lint)
  - Flag modal verbs “should”, “must”, “recommend”, “consider” unless inside an “Missing information & data requests” block.

- Prevention controls
  - Template constraint: include a dedicated “Missing information / diligence follow-ups” block and require all “should/consider” content to live there.
  - Tone rule: “Present facts + implications; recommendations should be phrased as diligence requests.” (aligned to claim discipline). `[context/skill/kpmg-fdd/references/writing-standards.md:L21-L27]`

Failure mode 7: Missing “set-up for QoE normalization”

- Requirement: section purpose is to “set up the QoE normalization.” `[context/skill/kpmg-fdd/references/section-templates/pnl-overview.md:L3-L5]`
- Detection heuristic (lint)
  - Flag if section contains “adjusted” metrics but no reference/cross-link to QoE section, or no mention that adjustments are detailed elsewhere.

- Prevention controls
  - Template: include a mandatory “Implications for QoE” sub-block with one bullet minimum.

4. Draft markdown playbook (implementable)

```markdown
# Playbook: Historical / financial performance (Style 2B; Quality gate 5C)

## Objective

Summarize historical performance and the key drivers of revenue, gross profit, and EBITDA, and explicitly set up the QoE normalization narrative.  
(Aligned to the canonical objective and minimum content expectations for this section.)  
Reference: `skill/kpmg-fdd/references/report-structure.md` and `skill/kpmg-fdd/references/section-templates/pnl-overview.md`.

## Required inputs (minimum viable)

1. Periods

- Historical periods to be covered (e.g., FY2022–FY2024) and any stub/LTM/TTM period with an as-of date.
- Clear definitions for any non-FY periods (e.g., “LTM to 2024-06-30”).

2. Units / currency

- Reporting currency and scaling (e.g., $m, $k), and whether margins are in % or bps.

3. Financial data (at minimum)

- Revenue, gross profit, EBITDA by period (reported and/or adjusted, as applicable).
- If “adjusted” is used: explicit definition of “adjusted” for this section and a basis/source reference (or mark as open item).

4. Evidence sources (at minimum one)

- Basis line(s) such as: audited FS, management accounts, trial balance extract, management schedule, KPI pack.
- If basis is not available, do not invent numbers; use placeholders and list missing information.

## Canonical block order (default / standard report)

1. Section header + period/units discipline (required)

- Include an explicit “Period covered” and “Units/currency” line at the top of the section.

2. Exhibit H1: Summary P&L (required)

- Present the core historical performance in tables (revenue, gross profit, EBITDA; plus margins).
- Every exhibit must include: period, units, and source/basis.

3. Overview (required)

- First 1–2 sentences must contain the “so what” (headline trend + implication).
- Then 3–6 bullets or short paragraphs that:
  - quantify revenue/GM/EBITDA trends (with period labels),
  - describe volatility (what changed and why),
  - call out concentration/seasonality only if evidenced,
  - explicitly label any management-only assertions.

4. Key drivers (required; numbered list)

- 2–6 items by default (Quick memo: 2–3; Deep report: up to ~8 if evidence exists).
- Each driver must follow the driver-evidence pattern:
  - Observation (quantified)
  - Driver explanation (cause)
  - Evidence/Basis (Exhibit reference and/or source)
  - Caveat (if management-provided / estimated / not verified)

5. Data quality & limitations (required)

- Audited vs management reporting (if known).
- Any known reclasses, estimation methods, or gaps.
- Any constraints that limit conclusions (e.g., “supporting documentation not provided”).
- If unknown, add missing information explicitly.

6. Implications for QoE (required)

- 1–3 bullets linking this section’s observed volatility/one-offs to the QoE bridge and adjustment rationale (do not restate the full bridge here).

7. Section-specific missing information (conditional but strongly recommended)

- If any placeholders exist in H1 or the narrative, list the missing information here and mirror them in the report-level “Missing information & data requests” section.

## Evidence / basis rules (defensibility)

- Do not invent numbers; if missing, use $[x] / [Date] placeholders and add an open item.
- For every material quantitative claim, include either:
  - (a) Exhibit reference (e.g., “Exhibit H1”), OR
  - (b) an explicit basis line (“Source: …”).
- Attribute management-provided assertions using consistent labels:
  - “Management indicated …” / “Management represented …”
  - If not verified, explicitly state “not independently verified”.

## Open-item behavior (when data is missing)

- Use labeled placeholders (e.g., $[x], [Date])—never “$X”.
- Convert missing evidence into an explicit data request:
  - What is missing (document/table)
  - Which metric/period it affects
  - Why it matters (impact on conclusion)

## Style rules (2B = corpus-inspired + house-standardized)

Corpus-inspired (keep)

- Use the “Overview + Key Drivers” rhetoric.
- Use quantified trend language (“increased from…to…”, “accounted for…”, “as a result…”).
- Use “however” / contrast to maintain balanced tone.

House-standardized (enforce)

- No salesy language; keep factual and balanced.
- Explicitly state periods, units, and sources.
- Separate facts vs judgments; label uncertainty.
- Avoid spatial references (“above/below/adjacent”); use Exhibit IDs.
- Prefer bullets and subheadings over long paragraphs; limit nested bullets to one level.

## QA checks and pass/fail gates (5C)

Working definition for 5C in this skill context: Client-ready + defensible across five checks.
(If your internal 5C definition differs, map these checks accordingly.)

PASS only if all are true:

1. Consistent (periods/units/definitions)

- Periods are defined and used consistently.
- Units are consistent across H1 and narrative.

2. Cited (evidence present)

- Exhibit H1 includes period, units, and source/basis.
- Material quantitative claims have an exhibit reference or basis line.

3. Correct (tie-outs and math sanity)

- Narrative numbers match Exhibit H1.
- Percentages and deltas are arithmetically consistent (or clearly labeled as management-provided).

4. Clear (readability and structure)

- “So what” appears in the first 1–2 sentences.
- Key Drivers are numbered and label-forward.
- No orphan headings; no wall-of-text paragraphs.

5. Complete (minimum content met)

- Revenue, gross profit, EBITDA trends are covered.
- At least one margin driver is discussed.
- Seasonality/concentration addressed only if evidenced, or explicitly marked as not assessed due to missing data.
- Data quality notes are present.

FAIL (do not deliver) if any of the following occur:

- Material quantitative claims have no basis/source and are not flagged as missing information.
- Units/periods are inconsistent or not defined.
- Invented numbers or unlabeled placeholders appear.
```

5. Draft markdown template (implementable)

```markdown
## Historical / financial performance

**Period covered:** FY[YYYY]–FY[YYYY] and [LTM/TTM/YTD] to [Date] (if applicable)  
**Units/currency:** $[m/k] (unless otherwise stated); margins in %

### Exhibit H1: Summary P&L (FY[YYYY]–FY[YYYY] and [LTM/TTM] to [Date])

**Exhibit H1A: Income statement ($[m/k])**

|              | FY[YYYY] | FY[YYYY] | FY[YYYY] | [LTM/TTM] [Date] |
| ------------ | -------: | -------: | -------: | ---------------: |
| **Units**    |   $[m/k] |   $[m/k] |   $[m/k] |           $[m/k] |
| Revenue      |     $[x] |     $[x] |     $[x] |             $[x] |
| Gross profit |     $[x] |     $[x] |     $[x] |             $[x] |
| EBITDA       |     $[x] |     $[x] |     $[x] |             $[x] |

**Exhibit H1B: Margins (%)**

|               | FY[YYYY] | FY[YYYY] | FY[YYYY] | [LTM/TTM] [Date] |
| ------------- | -------: | -------: | -------: | ---------------: |
| **Units**     |        % |        % |        % |                % |
| Gross margin  |     [x]% |     [x]% |     [x]% |             [x]% |
| EBITDA margin |     [x]% |     [x]% |     [x]% |             [x]% |

**Source/Basis:** [e.g., audited financial statements FY[YYYY]–FY[YYYY]; management accounts for [LTM/TTM] period; trial balance extract dated YYYY-MM-DD].  
**Notes (definitions / limitations):** [e.g., “EBITDA is management-defined”; “Adjusted metrics exclude QoE adjustments unless stated”; “LTM derived from monthly management accounts; not audited”.]

### Overview

[Sentence 1: headline “so what” with quantified trend + implication, explicitly period-labeled.]  
[Sentence 2: key driver/volatility or a key limitation if evidence is incomplete.]

- **Revenue:** Revenue [increased/decreased] from $[x] in FY[YYYY] to $[x] in FY[YYYY] ([CAGR: x%], if applicable), primarily driven by [driver]. (Ref: Exhibit H1; Basis: [source])
- **Gross margin:** Gross margin [expanded/contracted] from [x]% to [x]% over FY[YYYY]–FY[YYYY], driven by [mix/pricing/cost] factors evidenced in [support]. (Ref: Exhibit H1 / Exhibit H2)
- **EBITDA:** EBITDA [increased/decreased] from $[x] to $[x] and EBITDA margin [expanded/contracted] from [x]% to [x]%, primarily driven by [opex changes / scale / one-offs]. (Ref: Exhibit H1; Basis: [source])
- **Volatility / one-offs (if evidenced):** [briefly state what changed, when, and why; do not assert without evidence.]
- **Seasonality / concentration (only if evidenced):** [e.g., “Top customer accounted for [x]% of revenue in FY[YYYY]”]. (Basis: [source])

### Key drivers

1. **Revenue (price / volume / mix / acquisitions):**
   - Observation: [quantified change with period labels].
   - Driver: [cause statement].
   - Evidence/Basis: Exhibit H1 and [KPI pack / customer list / management representation].
   - Caveat (if applicable): [“management-provided; not independently verified” / “support not provided”].

2. **Gross margin / cost of sales:**
   - Observation: [quantified margin movement].
   - Driver: [input cost / labor / mix / pricing].
   - Evidence/Basis: [Exhibit / source].
   - Caveat: [as needed].

3. **Operating expenses / EBITDA margin:**
   - Observation: [quantified opex / EBITDA change].
   - Driver: [headcount, commissions, marketing, overhead scale, etc.].
   - Evidence/Basis: [Exhibit / source].
   - Caveat: [as needed].

4. **Other considerations (only if evidenced):**
   - [Customer concentration / seasonality / FX / non-operating items].
   - Evidence/Basis: [Exhibit / source].

_(Optional for complex revenue models)_  
5. **Revenue line items / definitions:**

- [Line item]: [definition + how it behaves across the period].
- Evidence/Basis: [FS notes / management accounts].

### Data quality & limitations

- **Reporting basis:** [audited / unaudited / management accounts] for FY[YYYY]–FY[YYYY]; [basis for LTM/TTM].
- **Known reclasses / estimation methods:** [e.g., annualization, pro forma assumptions].
- **Evidence gaps:** [what we could not verify; explicitly attribute management assertions].
- **Impact on conclusions:** [one sentence—qualitative if numbers unavailable].

### Implications for QoE (linkage only; do not duplicate the bridge)

- [Observed volatility / non-recurring items] are addressed in the QoE section (see “QoE and earnings adjustments”).
- [List any items that may drive adjustments, phrased as diligence points, not conclusions.]

### Section-specific missing information (include only if needed; mirror into report-level missing information)

- [P0/P1/P2] [Exact request] — affects [metric/period] — why it matters: [impact on driver conclusion / QoE normalization].
```

If you want to implement this immediately in the skill repository, the two concrete files above map naturally to:

- `skill/kpmg-fdd/references/section-playbooks/historical-financial-performance.md` (new)
- `skill/kpmg-fdd/references/section-templates/historical-financial-performance.md` (new)

That implementation suggestion is consistent with the existing pattern of “references/section-templates/” and the canonical section name/aliases used for this section. `[context/skill/kpmg-fdd/references/report-structure.md:L46-L48]` `[context/docs/report-mining/section-corpus/section-alias-map.md:L8-L10]`
