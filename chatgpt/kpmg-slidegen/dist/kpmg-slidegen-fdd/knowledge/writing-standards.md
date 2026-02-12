# Writing Standards

This document is the primary operating spec for drafting and rewriting slide content.

## 1) Scope and Quality Bar
Use this standard to produce client-ready FDD writing that is:
- evidence-led
- implication-driven
- dense enough to use the layout effectively
- faithful to provided facts and placeholders

A slide is not complete when it is merely grammatically correct; it is complete only when it supports transaction decision-making.

## 2) Core Writing Rule
Every substantive point should answer three questions in sequence:
1. What happened?
2. What evidence supports that statement (number + period + context)?
3. Why does it matter for transaction decisions (valuation, debt sizing, deal mechanics, covenants, peg)?

If any one of the three is missing, the point is incomplete.

## 3) Style, Tone, and Syntax (Combined)
### Tone
- Executive and neutral.
- Analytical, not promotional.
- Explicitly qualified when support is pending (`preliminary`, `subject to support tie-out`, `pending detailed testing`).

### Syntax
- Use complete sentences with punctuation.
- Prefer active analytical wording (`Revenue increased...`, `Adjusted EBITDA declined...`).
- Include period anchors whenever trend statements are made (`FY23`, `TTM Jun-26`, `Q2`).
- Use colons only when they improve scanability.

### Diligence Diction
Use naturally where relevant:
- reported, normalized, pro forma, adjustment, bridge, run-rate, variance, concentration, working capital, sensitivity, downside, support tie-out

### Disallowed Patterns
- Generic language that could apply to any company.
- Marketing adjectives with no numeric support.
- Repeating chart/table labels without interpretation.
- Over-hedged wording that obscures the conclusion.

## 4) Density Targets by Layout
These are drafting targets, not hard script gates.

### `layout.fdd_chart_left_content_right`
- Narrative target: 6-9 analytical bullets.
- Must include: movement, driver, implication, and one risk/sensitivity or follow-up item.

### `layout.fdd_table_left_content_right`
- Narrative target: 5-8 analytical bullets.
- Must include: key table signal, outlier interpretation, support-status note, and implication.

### `layout.fdd_two_column_bullets`
- Narrative target: 10-14 bullets total across both columns.
- Left should set context and evidence baseline.
- Right should convert that baseline into implications, risks, and next steps.

### `layout.fdd_one_column_narrative`
- Narrative target: 6-10 analytical bullets.
- Sequence should be coherent and cumulative (not disconnected standalone bullets).

## 5) Title and Strapline Rules
- Titles should communicate the core conclusion quickly.
- Keep titles concise enough to avoid awkward visual wrapping where possible.
- Use strapline for context framing and the analytical takeaway.
- If title wraps in a way that harms readability, rewrite title before rewriting body text.

## 6) Large-Section Rewrite Protocol
Use this protocol when input is long, messy, or partially unstructured.

### Step A: Build a Fact Ledger
Create a temporary table with columns:
- `fact_id`
- `metric_or_claim`
- `value`
- `period`
- `source_note`
- `confidence` (`high`, `medium`, `low`)

Do not draft until this ledger exists.

### Step B: Build a Claim Ledger
For each intended slide, list 4-8 claims with:
- `claim`
- `supporting_fact_ids`
- `required_implication`
- `open_question`

Discard claims that cannot be supported by the fact ledger.

### Step C: Map Claims to Slots
Distribute claims into slide slots before writing prose:
- Context claims first.
- Evidence-heavy claims next.
- Implication and decision claims last.

### Step D: Draft V1 Bullets
Draft each bullet using one of these structures:
1. `Observation + evidence.` `Implication.`
2. `Metric movement + likely driver.` `Transaction relevance.`
3. `Adjustment summary + support status.` `Impact on normalized outcome.`

### Step E: Rewrite Passes (Mandatory)
Run these passes in order.

Pass 1: `Evidence Densification`
- Add missing values, periods, and units.
- Replace vague references (`recently`, `higher`) with concrete measures.

Pass 2: `Implication Enforcement`
- Add explicit transaction consequences to each major bullet.
- Remove bullets that only describe without decision relevance.

Pass 3: `De-duplication and Compression`
- Merge overlapping bullets.
- Remove repeated claims across adjacent slides unless intentional carry-forward.

Pass 4: `Risk and Next-Step Enrichment`
- Add at least one risk/sensitivity statement where uncertainty exists.
- Add specific follow-up ask where support is incomplete.

Pass 5: `Visual Fit`
- Check title wrap, strapline length, and text block density against layout capacity.

## 7) Manual Review Rubric (Integrated)
Score each slide 1-5 on:
1. Layout fit
2. Content density
3. Evidence quality
4. Implication quality
5. Language quality
6. Fidelity and placeholders

### Slide Exit Rule
A slide fails if:
- any dimension is `1`, or
- two or more dimensions are `2`

### Deck Exit Rule
A deck fails if:
- any slide fails the slide exit rule, or
- more than 20% of reviewed slides are below `4` on evidence quality or implication quality

## 8) Rewrite Triggers and Fixes
### Trigger: sparse slide
Fix:
- add driver bullets
- add support-status bullet
- add implication bullet
- add risk/next-step bullet

### Trigger: descriptive but not analytical
Fix:
- rewrite each major bullet into observation/evidence/implication form

### Trigger: weak table/chart interpretation
Fix:
- add trend direction
- add driver explanation
- add structural vs timing comment
- add confidence/support status

### Trigger: placeholder-only appendix
Fix:
- preserve token exactly
- add exhibit handoff instructions
- add what is currently known
- add what data is needed to finalize

## 9) Fidelity Requirements
- Preserve provided numbers and named entities unless user explicitly asks for estimation.
- Preserve required placeholder tokens exactly.
- If confidence is low, say so explicitly rather than fabricating certainty.

## 10) Required Logging in `generation-notes.md`
For each reviewed slide record:
- slide id/title
- scores across the 6 rubric dimensions
- top gaps observed
- rewrite actions taken
- post-rewrite status (`pass` or `further rewrite needed`)
