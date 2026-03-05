Per `context/MANIFEST.md`, this repo bundle is explicitly scoped to “06-net-debt-and-debt-like-items”, with the primary corpus in `context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`, supported by the net debt adjustments library and the existing skill references (writing standards, QC checklist, exhibit rules, current net debt playbook, and current net debt section template). (context/MANIFEST.md)

Assumptions (stated and then applied, no questions):

- “Style target 2B” and “Quality gate 5C” are referenced as locked constraints but not defined elsewhere in the zip, so I operationalize them using the house “client-ready, defensible” writing and QC rules already codified in `context/skill/kpmg-fdd/references/writing-standards.md` and `context/skill/kpmg-fdd/references/qc-checklist.md`. (context/MANIFEST.md; context/skill/kpmg-fdd/references/writing-standards.md; context/skill/kpmg-fdd/references/qc-checklist.md)
- The corpus is verbatim-validated (and includes extraction artifacts). Therefore, corpus wording is a _language_ reference, but we must explicitly strip/avoid extraction-policy artifacts (e.g., “Not present in source report”, “Table- or chart-based…excluded…”) in client-facing output, replacing them with missing information and basis-labeled placeholders per the skill constraints. (context/docs/report-mining/section-corpus/validation/verbatim-validation-report.md; context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/SKILL.md)

Deliverable 1 — Linguistic analysis (section-specific patterns)

Sentence length / cadence patterns

- Mixed cadence is dominant: short “label: definition” lines (often 5–12 words) followed by 1–3 explanatory sentences (15–30 words) when a classification point or cut-off nuance is being made. This pattern is especially visible where the section enumerates components (e.g., “Cash: …”, “Loan payable: …”) and then explains treatment. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- Section often uses list-driven structure rather than long paragraphs:
  - “The components of net debt as at [date] include:” followed by itemized component lines. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
  - Numbered “Net debt / cash adjustments” list where each item starts with a short noun phrase + colon, then a concise conclusion and/or rationale. (context/docs/report-mining/section-corpus/adjustments/net-debt-adjustments-library.md)

- Where the corpus is strongest (most client-ready), it uses an “overview → schedule framing → item-by-item discussion” rhythm:
  - “The schedule opposite illustrates…” then “Each of the components…is discussed below.” (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

Hedge / certainty phrasing patterns

- “Management represents …” is a standard hedge used for cash restrictions, classifications, or estimates (e.g., restricted cash; estimated balances). Keep this pattern as-is but standardize placement: put it immediately next to the claim it qualifies. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- “We understand …” is used for deal mechanics, earn-outs, and how balances behave/settle. Keep as-is; it’s defensible and appropriately bounded. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- “We note …” appears as a softer evidentiary transition (often used when something is outside scope or is a contextual observation). Keep, but ensure it’s followed by “so what” (implication). (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/references/writing-standards.md)
- Modal verbs express classification logic:
  - “should be considered” is the dominant certainty form for debt-like inclusion (e.g., “Deferred payments…should be considered net debt.”). Keep, but require a basis line and (where applicable) a cut-off note. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/references/writing-standards.md)
  - “may be considered” is less frequent and used where treatment is contingent (e.g., deferrals; scope boundaries). Normalize: if evidence is strong, use “should”; if not, keep “may” and add an explicit open item. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/SKILL.md)

Transition logic patterns

- Standard transitions used in this section (keep, but apply consistently):
  - “In addition,” and “Additionally,” to move from definitional net debt to “other potential debt-like items for your consideration.” (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
  - “However,” to flag definitional or measurement differences (e.g., lease PV vs undiscounted close value). (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
  - “Accordingly,” to connect QoE adjustments to debt-like treatment at close (e.g., “any associated remaining balances at the closing date should be treated as debt-like”). Keep this “bridge across workstreams” move. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
  - “To the extent…” used to handle alternative classifications and their downstream mechanical implications (notably WC peg interaction). Keep, and standardize to always state the consequence (e.g., “remove from working capital peg”). (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

Quantification phrase patterns

- “As at [Date]” is the anchor phrase; it appears heavily and is critical to defensibility in net debt sections. Keep and make mandatory (narrative and each exhibit). (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/references/exhibits-and-tables.md)
- “Reported net debt / net cash …” then “adjusted … after potential adjustments / reclassifications.” Keep this reported→adjusted framing; it’s consistent with the broader report discipline of tie-outs/bridges. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/references/qc-checklist.md)
- “Primarily / largely / mainly comprised of …” used to summarize drivers in one sentence. Keep, but avoid using these words without naming at least 1–3 specific drivers when evidence exists (house “specific” standard). (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/references/writing-standards.md)
- “Partially offset by …” appears in net debt/net cash summaries. Keep as-is (useful to explain cash offsets to gross debt). (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

Caveat / disclaimer patterns
Keep (client-ready and defensible, but standardize):

- “Not all inclusive” / “Readers…should be aware…additional factors…” appears in some entries as a completeness caveat. Keep as a short “scope caveat” when diligence is constrained, but don’t overuse; pair with a prioritized missing-information list. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/references/writing-standards.md)
- “Not within the scope of this report…” appears (e.g., tax liabilities outside scope). Keep, but immediately state whether it could affect purchase price and whether it’s an “other consideration” vs debt-like. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- “Information…outstanding from Management” is a common and appropriate caveat (e.g., payroll tax deferral quantification; environmental liabilities PV). Keep, and convert into a P0/P1 open item. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/references/qc-checklist.md)

Normalize / clean patterns (keep meaning, fix form)
These show up as verbatim artifacts in the corpus and should be normalized in generation:

- Broken words, spacing, and run-ons (e.g., “priorperiods”, “2020andMay31,2020”). Normalize to clean English. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- Bullet-glyph artifacts and table residue (“■”, “”, “[…]”, “As at” dangling, duplicated headings). Strip from narrative; present the information instead as a clean exhibit with a basis line. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/references/exhibits-and-tables.md)
- Ellipsis truncations (“Locked...Locked Box”, “Relates to an off balance ...”). Treat as unusable source text for client-ready narrative; rewrite into a bounded open item if the underlying detail is missing. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/SKILL.md)

Avoid patterns (do not carry into client-facing output)

- “Not present in source report” is a corpus build artifact and should never appear in deliverables; replace with “Information not provided” + open item. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/SKILL.md)
- “Table- or chart-based adjustment details were excluded per extraction policy.” This is explicitly an extraction-policy artifact; do not include in client writing. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/docs/report-mining/section-corpus/README.md)
- “yy” placeholders from sanitized source excerpts should not be emitted as-is; use house placeholders ([Bank], [Counterparty], [Location]) instead. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/skill/kpmg-fdd/SKILL.md)

Deliverable 2 — Structural analysis

Dominant internal structure variants in corpus entries
Variant A — Missing section (corpus artifact)

- “Overview: Not present…” and adjustments also “Not present…” (multiple reports). This is not a legitimate structure; it’s a “no content extracted” state. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

Variant B — Short overview paragraph + short numbered adjustments

- 2–6 sentences summarizing reported/adjusted net debt/net cash, then 1–3 numbered adjustments with 1–3 lines each. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md; context/docs/report-mining/section-corpus/adjustments/net-debt-adjustments-library.md)

Variant C — Component definitions list + concluding adjusted position

- “Components of reported net cash are comprised of:” followed by colon-labeled items (cash, leases, taxes, dividends, SERP), then a concluding sentence (“After… adjusted net cash position is…”). This is the clearest schedule/checklist framing when the actual numeric schedule is elsewhere. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

Variant D — “Schedule” narrative + item-by-item discussion + expanded “other considerations”

- Starts with schedule framing (“schedule opposite illustrates…”) and then enumerates many items, including explicit cut-off/closing mechanics language (income taxes estimated at closing; unpaid dividends pre-close; transaction bonuses captured in net debt). This is the highest-value pattern to emulate as a “deep” variant. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

Variant E — Deal-mechanics (locked box) framing

- Explicit reference to an “agreed Locked Box” definition and “adjusted debt consistent with … agreed by both parties,” plus (cash/debt-like) reclassifications. This signals the section sometimes must align to SPA mechanics and still call out “for your consideration.” (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

Recommended default structure (for the skill)
Default structure should match the minimum content required by `context/skill/kpmg-fdd/references/report-structure.md` and the net debt exhibit guidance in `context/skill/kpmg-fdd/references/exhibits-and-tables.md`: schedule + debt-like list + cut-off + missing information. (context/skill/kpmg-fdd/references/report-structure.md; context/skill/kpmg-fdd/references/exhibits-and-tables.md)

Required sub-blocks (must appear, even if data is missing)

1. Headline takeaway (1–2 sentences, includes “as at [Date]” and reported vs adjusted framing where possible) (context/skill/kpmg-fdd/references/writing-standards.md)
2. Definition/scope notes (cash definition, debt definition, and explicit call-out of any known excluded cash types such as settlement/trust cash) (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
3. Exhibit: Net debt schedule (even if placeholder rows; must include units/period/source) (context/skill/kpmg-fdd/references/exhibits-and-tables.md; context/skill/kpmg-fdd/SKILL.md)
4. Exhibit: Debt-like items review checklist + conclusions (table with classification and rationale) (context/skill/kpmg-fdd/references/exhibits-and-tables.md; context/skill/kpmg-fdd/references/report-structure.md)
5. Cut-off / closing mechanics notes (explicit “at closing / at completion / closing date” phrasing where relevant) (context/skill/kpmg-fdd/references/report-structure.md; context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
6. Missing information & data requests (prioritized; replaces “not present”) (context/skill/kpmg-fdd/references/writing-standards.md; context/skill/kpmg-fdd/references/qc-checklist.md; context/skill/kpmg-fdd/SKILL.md)

Optional sub-blocks (allowed variants)

- Debt instrument detail (rate/maturity/covenants) when evidence exists (context/skill/kpmg-fdd/references/exhibits-and-tables.md; context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- “Other considerations” (tax exposures, IT capex, off-balance obligations) explicitly labeled as such (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- Working-capital interaction note where reclasses occur (“remove from peg if treated as debt-like”) (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

Deliverable 3 — Failure-mode analysis

1. Failure mode: Treating net debt as only bank debt minus cash (omitting debt-like)

- Evidence this is a known pitfall: explicitly called out in the current template “Common pitfalls.” (context/skill/kpmg-fdd/references/section-templates/net-debt.md)
- Detection heuristic:
  - No “Debt-like items” exhibit/table present; only “Debt schedule” or only a single net debt number.
  - No “should be considered debt-like” / “debt-like items” language.

- Prevention controls:
  - Template constraint: require a “Debt-like items review” table with at least N rows (even if placeholders).
  - Prompt rule: “Section is invalid without debt-like checklist and conclusions.”

2. Failure mode: Missing or vague cut-off language (no closing mechanics)

- Evidence this is a known pitfall: also called out in current template “Common pitfalls” (“Not labeling cut-off timing risks”). (context/skill/kpmg-fdd/references/section-templates/net-debt.md)
- Detection heuristic:
  - No “as at [Date]” anchor; no mentions of “closing date / completion / at closing / at transaction close”.

- Prevention controls:
  - Lint check: fail if section lacks “as at” (or [As at date]) and a “Cut-off and closing considerations” block.
  - Prompt rule: require at least 2 cut-off bullets when any of: taxes, earn-outs, dividends, transaction costs, leases appear (all seen in corpus). (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)

3. Failure mode: Misclassifying cash items (restricted/trust/settlement cash)

- Corpus shows explicit exclusion of settlement cash as working capital and separation from trust balances. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- Detection heuristic:
  - “Cash and cash equivalents” presented with no definition; no mention of restricted/trust/settlement cash where relevant.

- Prevention controls:
  - Template field: “Cash definition (include/exclude)” is mandatory.
  - Checklist gating: require either “Management represents no restricted cash” or an explicit open item.

4. Failure mode: Lease obligations treated inconsistently (PV vs close definition)

- Corpus explicitly flags that leases may need to be considered at undiscounted value at transaction close, even if accounts present PV. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- Detection heuristic:
  - Lease liabilities appear but no note on measurement basis vs closing treatment.

- Prevention controls:
  - Prompt rule: if leases mentioned, include a “measurement basis at close” note and an open item for lease schedule.

5. Failure mode: Numbers/balances presented without basis or source

- House standard requires basis lines for material quantitative claims; QC prohibits delivery if material quantitative claims have no basis. (context/skill/kpmg-fdd/references/writing-standards.md; context/skill/kpmg-fdd/references/qc-checklist.md)
- Detection heuristic:
  - Exhibits missing “Source:” line or contain unqualified numbers.

- Prevention controls:
  - Template hard-field: “Source/Basis” row required under each exhibit.
  - Lint: fail if table contains currency figures and no “Source:” in the next 3 lines.

6. Failure mode: Invented placeholders / fabricated precision

- Skill explicitly prohibits inventing numbers and requires labeled placeholders when data is missing. (context/skill/kpmg-fdd/SKILL.md)
- Detection heuristic:
  - Amounts like “$X” without brackets, or specific amounts with no cited basis.

- Prevention controls:
  - Lint: fail on regex for “$X” or “EBITDA was $X” style unlabeled placeholders (QC checklist warns against invented placeholders). (context/skill/kpmg-fdd/references/qc-checklist.md)

7. Failure mode: Leaving corpus extraction artifacts in the deliverable

- Corpus repeatedly includes “Not present in source report” and “Table- or chart-based…excluded…per extraction policy.” (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- Detection heuristic:
  - String match on “Not present in source report” or “extraction policy”.

- Prevention controls:
  - Lint: hard fail if those phrases appear anywhere in output.

8. Failure mode: Missing WC↔net debt reclass implication (peg distortion)

- Corpus shows explicit instruction: if treated as debt-like, remove from working capital peg. (context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md)
- Detection heuristic:
  - Debt-like reclassifications are described, but no note on WC peg interaction.

- Prevention controls:
  - Prompt rule: if any adjustment contains “reclassified from net working capital” or “removed from net working capital”, include a single sentence: “If treated as debt-like, this item should be removed from the working capital peg.”

Deliverable 4 — Draft markdown playbook (implementable)

```markdown
# Playbook — Net debt and debt-like items (Style 2B / Quality 5C)

## Objective

Identify net debt and debt-like (and cash-like) items that impact purchase price and closing mechanics, and clearly document:

1. What is included in net debt as at the reference date
2. Which items are debt-like vs working capital vs equity/other
3. Cut-off / closing-date items that can move between signing and completion

Aligned to the “Debt and debt-like items (net debt)” workstream goal.  
(Reference: `context/skill/kpmg-fdd/references/analysis-playbooks/net-debt-playbook.md`)

## Required inputs (request if missing; do not invent)

Minimum inputs to draft a defensible section:

- Net debt schedule (seller-prepared if available) OR trial balance/balance sheet detail supporting cash and debt balances
- Debt schedule / facility summary (instruments, balances; rate/maturity if known)
- Cash detail with definitions (restricted vs unrestricted; any trust/settlement cash)
- Accrued liabilities detail for potential debt-like items
- Lease obligations summary (if relevant)
- Any deal mechanics definition of “net debt” / locked box vs completion approach (if provided)

(Reference: `context/skill/kpmg-fdd/references/analysis-playbooks/net-debt-playbook.md`; examples of definitional variation in `context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)

## Canonical block order (default)

1. Headline takeaway (1–2 sentences)
2. Definition and scope (what we included/excluded)
3. Exhibit: Net debt schedule (as at [As at date], units, source)
4. Exhibit: Debt-like items review (checklist + conclusions)
5. Cut-off and closing considerations (timing and mechanics)
6. Key risks (only if evidenced)
7. Missing information & data requests (prioritized)

Minimum content expectation: debt schedule summary + list of debt-like items reviewed and conclusions + cut-off notes + missing information.  
(Reference: `context/skill/kpmg-fdd/references/report-structure.md`)

## Evidence and basis rules (non-negotiable)

- Do not invent numbers. If data is missing, use placeholders like `$[x]` and add an open item.  
  (Reference: `context/skill/kpmg-fdd/SKILL.md`)
- Every exhibit must include: title, period/as-at date, units, and a source/basis line.  
  (Reference: `context/skill/kpmg-fdd/references/exhibits-and-tables.md`)
- Every material quantitative claim in the narrative requires a basis/source OR must be clearly flagged as an open item.  
  (Reference: `context/skill/kpmg-fdd/references/writing-standards.md`; `context/skill/kpmg-fdd/references/qc-checklist.md`)

## Classification logic — debt-like vs cash-like vs working capital vs equity/other

### A. Start from the definition (make it explicit)

State what “net debt” means _in this report_ and tie it to the evidence you reviewed.
Use corpus-supported definitional phrases, e.g.:

- “The components of reported net cash are comprised of…” and explicitly state exclusions (e.g., settlement cash as working capital).  
  (Example pattern: `context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- If net debt definition is “agreed” (locked box / SPA definition), state that, then still list items “for consideration”.  
  (Example: locked box framing in `context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)

### B. Build the net debt schedule (auditability-first)

Create a schedule that:

- Separates operating cash from restricted/trust/settlement cash where relevant
- Lists gross debt instruments separately (bank debt, shareholder/related party debt, notes payable, lease obligations)
- Lists debt-like items separately (taxes, deferred purchase price, transaction costs, dividends, etc.)
- Shows a clear total “Net debt / (net cash)”

Net debt presentation should use a schedule and should separately list “debt-like” items reviewed and conclusions.  
(Reference: `context/skill/kpmg-fdd/references/exhibits-and-tables.md`)

### C. Debt-like items checklist — standard categories (populate only if evidenced; otherwise leave as “Reviewed / Open”)

Use these categories because they occur in the corpus and are commonly evaluated in this section:

- Taxes payable and tax exposures (e.g., income tax payable; withholding taxes; “outside scope” tax liabilities flagged as other considerations)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Lease obligations (finance leases; note that accounting PV may differ from close-date definition)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Deferred/contingent consideration from acquisitions (earn-outs payable; purchase price payable; seller holdbacks; deferred payments)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Transaction-related accruals (transaction costs; bonuses; retention/severance)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Deferred compensation / incentive plans (SERP; stock options liabilities; LTIP)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Capex-related payables and commitments (capex payables; near-term IT upgrade plans; capital commitments)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Customer-related liabilities and deposits (deferred revenue; prepaid service plans; deposits payables; potential clawbacks)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Provisions and contingent liabilities (litigation provisions; warranty provisions; pension provisions; environmental remediation / perpetual care)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Derivatives / FX forwards (financial liability; in/out of the money contracts)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Working-capital reclasses that may be debt-like (outstanding checks; extraordinary/non-trade items; buffers required to operate)  
  (`context/docs/report-mining/section-corpus/adjustments/net-debt-adjustments-library.md`; `context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Equity misclassifications (financing recorded as liabilities but treated as equity)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Minority interests / minority debt attribution (where relevant)  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)

### D. Working capital interaction rule (explicit when reclassing)

If an item is reclassified from net working capital to net debt (or vice versa), explicitly state the mechanical implication.
Corpus-supported phrasing logic:

- “To the extent it is treated as debt-like, it should be removed from the working capital peg.”  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)

## Cut-off and closing considerations (standard language patterns)

### Required “as at” anchoring

- Every key number, schedule, and conclusion must tie to a stated reference date (“as at [As at date]”).  
  (Examples throughout `context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)

### Standard cut-off bullets (include only what is relevant/evidenced)

Use corpus-supported timing language such as:

- Leases: if accounts present PV, note that “at transaction close, the undiscounted value…should be considered.”  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Income taxes: if not final until year-end, note that unpaid taxes for periods prior to completion “will be required to be accurately estimated at the closing date.”  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Earn-outs / deferred consideration: assumptions and fair value should be “subject to specific review at closing.”  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Transaction costs / vendor fees / bonuses: any unpaid amounts at completion “should be considered” in net debt / closing funds flow.  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
- Dividends: amounts due should be paid prior to completion or treated as a debt-like distribution.  
  (`context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)

## Open-item behavior when data is missing (replace corpus artifacts)

Do NOT output:

- “Not present in source report”
- “Table- or chart-based adjustment details were excluded per extraction policy.”

Instead:

1. State what is missing (specific document/schedule)
2. State why it matters (classification or quantum could move purchase price)
3. Add an open item (P0/P1/P2) with owner (Management/Vendor) and requested artifact

(Reference: `context/skill/kpmg-fdd/SKILL.md`; `context/skill/kpmg-fdd/references/writing-standards.md`)

## Style rules (2B operationalization)

- Start with “so what” in the first 1–2 sentences (headline takeaway).  
  (`context/skill/kpmg-fdd/references/writing-standards.md`)
- Use factual, balanced phrasing; label uncertainty (“Management represents…”, “We understand…”, “outside scope…”).  
  (`context/skill/kpmg-fdd/references/writing-standards.md`)
- Prefer schedules and checklist tables over dense prose; keep nested bullets minimal.  
  (`context/skill/kpmg-fdd/references/exhibits-and-tables.md`; `context/skill/kpmg-fdd/references/writing-standards.md`)
- Use consistent units and sign conventions; negatives as parentheses.  
  (`context/skill/kpmg-fdd/references/exhibits-and-tables.md`; `context/skill/kpmg-fdd/references/qc-checklist.md`)

## QA checks and pass/fail gates (5C operationalization)

### Pass/fail (do-not-deliver) gates for this section

Fail if any of the below is true:

- No “as at [date]” anchor in headline and exhibit(s)
- Net debt schedule present but missing units/period/source line
- Debt-like items review table missing (or contains no conclusions/missing information)
- Material quantitative claims have no basis/source and are not flagged as missing information
- Units/periods inconsistent within the section

(Reference: `context/skill/kpmg-fdd/references/qc-checklist.md`; `context/skill/kpmg-fdd/references/exhibits-and-tables.md`)

### Section-specific QC checks

- Tie-out: reported → reclasses/adjustments → adjusted (if numbers provided)
- Consistency: “net cash” vs “net debt” terminology matches sign and presentation
- Cut-off: at least one cut-off bullet if taxes/leases/transaction costs/earn-outs/dividends appear
- WC interaction: if any NWC reclass is described, include the peg implication sentence

(Reference: patterns in `context/docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md`)
```

Deliverable 5 — Draft markdown section template (implementable)

```markdown
# Net debt and debt-like items

## Headline takeaway (required)

As at **[As at date]**, the Company reported **net (cash) / net debt** of **$[x]**. Based on our review of available information, we have identified **$[x]** of reclassifications and potential debt-like (or cash-like) items, resulting in **adjusted net (cash) / net debt** of **$[x]**.

> Drafting notes (do not keep in final):
>
> - Keep this to 1–2 sentences and include the “as at” date.
> - If numbers are not available, replace $[x] with placeholders and add missing information (do not invent).
> - Use “net cash” if cash exceeds debt; ensure sign conventions are consistent.

## Definition and scope (required)

- **Net debt definition used:** [Define what is included/excluded in this section; align to deal mechanics if provided.]
- **Cash definition:** [Operating cash included/excluded; call out restricted/trust/settlement cash if applicable.]
  - Example phrasing patterns in corpus include explicit exclusions of settlement cash as working capital and separation from trust balances.
- **Measurement basis notes (if relevant):**
  - **Leases:** [State whether reported lease liabilities are PV; note whether close-date definition requires undiscounted amounts.]

## Exhibit ND-1: Net debt schedule (as at [As at date], $[units]) (required)

Source/Basis: [e.g., trial balance extract dated YYYY-MM-DD; management-prepared net debt schedule; audited financial statements as at [date].]

| Line item                                                                   | Classification (Cash / Debt / Debt-like / Cash-like / Other) | Balance ($[units]) | Comments (incl. cut-off)                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------ | -----------------: | ---------------------------------------------------------------------------------------- |
| Cash and cash equivalents                                                   | Cash                                                         |               $[x] | [e.g., operating cash; exclude/include restricted/trust/settlement cash per definition.] |
| Restricted / trapped / trust cash (if applicable)                           | Cash-like / Excluded                                         |               $[x] | [Treatment and rationale; open item if unclear.]                                         |
| Revolver / line of credit                                                   | Debt                                                         |             ($[x]) | [Rate/maturity if known; availability/covenants if evidenced.]                           |
| Term debt / notes payable                                                   | Debt                                                         |             ($[x]) | [Key terms if known.]                                                                    |
| Shareholder / related party debt                                            | Debt                                                         |             ($[x]) | [Offsetting intercompany? recoverability?]                                               |
| Lease obligations                                                           | Debt / Debt-like                                             |             ($[x]) | [PV vs undiscounted at close; open item for lease schedule.]                             |
| Income taxes payable                                                        | Debt-like                                                    |             ($[x]) | [Pre-completion vs post; cut-off estimate at closing if needed.]                         |
| Deferred/contingent consideration (earn-outs, holdbacks, deferred payments) | Debt-like                                                    |             ($[x]) | [Subject to review at closing.]                                                          |
| Transaction costs / bonuses / severance (if applicable)                     | Debt-like                                                    |             ($[x]) | [Unpaid at completion to be captured.]                                                   |
| Dividends payable / return of capital payable                               | Debt-like                                                    |             ($[x]) | [To be paid pre-close or treated in closing funds flow.]                                 |
| Other debt-like items (see ND-2)                                            | Debt-like                                                    |             ($[x]) | [Roll-up of items below.]                                                                |
| **Adjusted net debt / (net cash)**                                          | **Total**                                                    |           **$[x]** |                                                                                          |

## Exhibit ND-2: Debt-like (and cash-like) items review checklist (required)

Source/Basis: [For each item, state the schedule / TB account / management representation used.]

| Item                                                          | Balance ($[units]) | Proposed treatment (Debt-like / Cash-like / WC / Equity / Other) | Rationale (1–2 sentences)                                                | Basis / evidence | Cut-off / closing update? |
| ------------------------------------------------------------- | -----------------: | ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------- | ------------------------- |
| Income taxes payable / tax true-ups                           |               $[x] | Debt-like                                                        | [e.g., relates to pre-completion profits; may require closing estimate.] | [Source]         | Yes — [how]               |
| Withholding taxes payable                                     |               $[x] | Debt-like                                                        | [e.g., relates to dividends.]                                            | [Source]         | Yes                       |
| Lease obligations                                             |               $[x] | Debt-like                                                        | [e.g., PV in FS; consider undiscounted at close.]                        | [Source]         | Yes                       |
| Deferred purchase price / holdbacks                           |               $[x] | Debt-like                                                        | [e.g., obligations from historical acquisitions.]                        | [Source]         | Yes                       |
| Earn-outs payable                                             |               $[x] | Debt-like                                                        | [e.g., fair value sensitive to forecasts.]                               | [Source]         | Yes                       |
| Transaction costs (vendor/company)                            |               $[x] | Debt-like                                                        | [e.g., unpaid fees at completion.]                                       | [Source]         | Yes                       |
| Deferred compensation (SERP) / stock options / LTIP           |               $[x] | Debt-like                                                        | [e.g., crystallizes on change of control.]                               | [Source]         | Yes                       |
| Capex payables / committed capex                              |               $[x] | Debt-like / Other                                                | [e.g., non-trade capex suppliers; near-term IT upgrades.]                | [Source]         | Yes / Assess              |
| Deferred revenue / customer deposits / prepaid plans          |               $[x] | Debt-like / WC                                                   | [e.g., cash received upfront; may be clawback/obligation.]               | [Source]         | Assess                    |
| Provisions (litigation, warranties, pensions, environmental)  |               $[x] | Debt-like / Other                                                | [e.g., known claims; remediation obligations.]                           | [Source]         | Assess / Yes              |
| Derivatives / FX forwards                                     |               $[x] | Debt-like / Cash-like                                            | [e.g., out-of-the-money liability.]                                      | [Source]         | Yes                       |
| WC reclasses (outstanding checks; buffers; cash yet to clear) |               $[x] | Cash-like / WC                                                   | [State treatment and peg implication.]                                   | [Source]         | Yes                       |
| Equity misclassifications (financing recorded as debt)        |               $[x] | Equity                                                           | [e.g., pre-seed funding recorded to liabilities.]                        | [Source]         | Yes — confirm             |
| Minority interests / minority debt attribution                |               $[x] | Other                                                            | [e.g., portion remaining in business to account for at close.]           | [Source]         | Yes                       |

> Drafting notes (do not keep in final):
>
> - If an item is uncertain, label it as “Other consideration” and add an open item.
> - If reclassing from NWC, include the peg implication sentence in the narrative below.

## Cut-off and closing considerations (required)

- **Reference date:** This analysis reflects balances **as at [As at date]**; amounts may change through the closing date.
- **Items requiring close-date update:** [List only items relevant/evidenced]
  - Income taxes payable: [Note estimation at closing if not final until year-end.]
  - Earn-outs / deferred consideration: [Note review at closing.]
  - Transaction costs / bonuses / severance: [Confirm unpaid amounts captured at completion.]
  - Dividends: [Confirm paid pre-close or treated in closing funds flow.]
  - Lease obligations: [Confirm measurement basis at close.]
- **Working capital interaction (include if any reclass occurs):**
  - To the extent any balance is treated as **debt-like**, it should be removed from the **working capital peg**.

## Key risks (optional; include only if evidenced)

- [Risk statement] — [why it matters to purchase price / close] — [mitigant / next step]

## Missing information & data requests (required)

(Use priorities P0/P1/P2; do not leave “not present” artifacts.)

| Priority | Open item                                                                       | Why it matters                                    | Requested evidence / owner                                      |
| -------: | ------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------- |
|       P0 | Confirm net debt definition per SPA / agreed mechanics (if applicable)          | Classification drives purchase price adjustment   | SPA definition / seller net debt schedule (Vendor/Management)   |
|       P0 | Updated debt and cash balances at closing date                                  | Net debt moves between reference date and close   | Closing trial balance; bank statements (Management)             |
|       P1 | Lease schedule (undiscounted vs PV)                                             | Could change net debt if close definition differs | Lease summary and payment schedule (Management)                 |
|       P1 | Tax computation / corporation tax true-up                                       | May require closing estimate                      | Tax provision calc / advisor support (Management)               |
|       P1 | Earn-out / deferred consideration detail                                        | Sensitive to assumptions                          | Acquisition agreements; forecast assumptions (Vendor)           |
|       P2 | Review other considerations (e.g., IT capex plans, tax exposures outside scope) | Potential purchase price negotiation items        | Supporting schedules; diligence workstreams (Vendor/Management) |
```

This set of artifacts is designed to drop directly into the skill as: (i) an analysis playbook expansion aligned to the existing net debt playbook and house standards, and (ii) a deterministic section skeleton that forces schedule/checklist framing, explicit cut-off language, and defensible classification. (context/skill/kpmg-fdd/references/analysis-playbooks/net-debt-playbook.md; context/skill/kpmg-fdd/references/writing-standards.md; context/skill/kpmg-fdd/references/exhibits-and-tables.md; context/skill/kpmg-fdd/references/qc-checklist.md; context/skill/kpmg-fdd/references/report-structure.md)
