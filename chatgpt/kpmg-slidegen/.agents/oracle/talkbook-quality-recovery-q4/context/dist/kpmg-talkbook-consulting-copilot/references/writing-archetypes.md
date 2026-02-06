# Talkbook Writing Archetypes (Comprehensive V1)

This is the canonical archetype library for advisory writing quality in Talkbook.
Use this reference before drafting any section content.

## How To Use

1. Select one archetype that matches the section purpose before drafting.
2. Map the section to outline (`outline_section_id`) and choose depth profile.
3. Fill archetype formulas (title, narrative, evidence) plus authoring payload fields.
4. Draft the slide content, then run `references/writing-checklist.md`.
5. Persist section content only after checklist review.

## Required Field Contract

- `Archetype ID`
- `Purpose`
- `Use When`
- `Avoid When`
- `Slide Structure`
- `Title Formula`
- `Narrative Formula`
- `Evidence Requirements`
- `Bullet Style`
- `Table Style`
- `Chart Style`
- `Source Note Style`
- `Tone And Word Choice`
- `Common Failure Modes`
- `Prompt Starter`
- `Mini Example`

## Per-Archetype Depth Contract (V2)

Use these minima alongside the profile minima in `writing-checklist.md`.  
Format: `claims / evidence objects / implications / numeric anchors`.

| Archetype ID | Minimal | Concise | Detailed | Extensive |
|---|---|---|---|---|
| `core.executive-synthesis` | 2/1/1/2 | 3/1/1/3 | 4/2/2/4 | 6/3/3/6 |
| `core.situation-assessment` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |
| `core.root-cause-analysis` | 2/1/1/2 | 3/1/2/3 | 4/2/2/4 | 6/3/3/6 |
| `core.swot-analysis` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/2/3/5 |
| `core.market-sizing-segmentation` | 2/1/1/2 | 3/1/1/3 | 4/2/2/4 | 6/3/3/6 |
| `core.competitive-landscape` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |
| `core.customer-voc-synthesis` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |
| `core.operating-model-walkthrough` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |
| `core.process-redesign-future-state` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |
| `core.option-tradeoff-comparison` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |
| `core.recommendation-pack` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |
| `core.implementation-roadmap-risks` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |
| `finance.pnl-walkthrough` | 2/1/1/2 | 3/1/1/3 | 4/2/2/4 | 6/3/3/6 |
| `finance.margin-bridge-waterfall` | 2/1/1/2 | 3/1/1/3 | 4/2/2/4 | 6/3/3/6 |
| `finance.qoe-style-adjustment-walkthrough` | 2/1/1/2 | 3/1/1/3 | 4/2/2/4 | 6/3/3/6 |
| `finance.net-working-capital-walkthrough` | 2/1/1/2 | 3/1/1/3 | 4/2/2/4 | 6/3/3/6 |
| `finance.cash-flow-liquidity-walkthrough` | 2/1/1/2 | 3/1/1/3 | 4/2/2/4 | 6/3/3/6 |
| `finance.evidence-appendix-packet` | 2/1/1/1 | 3/1/1/2 | 4/2/2/3 | 6/3/3/5 |

## Executive Synthesis

### Archetype ID
core.executive-synthesis

### Purpose
Summarize decision context, key findings, and recommended direction in one high-density opening slide.

### Use When
When leadership needs a rapid read of what changed, why it matters, and what to do next.

### Avoid When
When evidence detail or methods must dominate the page.

### Slide Structure
Quantified headline + 5-8 synthesis bullets + compact evidence object + implication line.

### Title Formula
<Business outcome> <changed by X> due to <top drivers>.

### Narrative Formula
Context -> Key findings -> Decision implication -> Immediate next step.

### Evidence Requirements
At least one numeric anchor per top finding; include one source note.

### Bullet Style
Each bullet states what changed, why, and why it matters in <=2 lines.

### Table Style
Optional 3-5 row KPI strip with baseline/current/target.

### Chart Style
Optional compact trend chart only if pattern recognition is needed.

### Source Note Style
Single consolidated source line in footer; avoid URL overload.

### Tone And Word Choice
Analytical and decisive; no hype; use verbs like reflects, indicates, implies.

### Common Failure Modes
Generic headline, unquantified claims, recommendation without evidence, no implication.

### Prompt Starter
Use core.executive-synthesis. Draft a dense executive synthesis with quantified findings and one clear decision recommendation.

### Mini Example
- EBITDA margin improved 230 bps, mainly from pricing discipline and mix shift.
- Churn risk remains concentrated in two segments; retention plan required in Q2.
- Recommendation: prioritize Segment B migration before expansion spend.

## Situation Assessment

### Archetype ID
core.situation-assessment

### Purpose
Establish current-state fact base with balanced strategic, operational, and financial context.

### Use When
Early in a section to align stakeholders on baseline conditions before options are discussed.

### Avoid When
A decision has already been made and only execution detail is needed.

### Slide Structure
State-of-play headline + thematic blocks (market, customer, operations, economics) + baseline metrics table.

### Title Formula
Current-state assessment: <condition> across <scope>.

### Narrative Formula
Where we are -> What is stable -> What is changing -> Why this baseline matters.

### Evidence Requirements
Use dated facts and period labels; include confidence/assumption note where needed.

### Bullet Style
Group bullets by theme with explicit labels (Market:, Customer:, Operations:, Economics:).

### Table Style
Use compact baseline table with 5-8 core metrics and period columns.

### Chart Style
Use only one orientation chart if trend context is essential.

### Source Note Style
Source each theme or provide consolidated source appendix pointer.

### Tone And Word Choice
Objective and diagnostic; avoid recommendation language in assessment slide.

### Common Failure Modes
Mixing recommendations into baseline, theme drift, missing time context.

### Prompt Starter
Use core.situation-assessment. Build a current-state slide with theme-labeled bullets and baseline evidence.

### Mini Example
- Market: category growth slowed to 3% YoY after two expansion years.
- Customer: enterprise accounts grew share but renewal risk widened.
- Economics: delivery costs rose faster than price realization.

## Problem / Root-Cause Analysis

### Archetype ID
core.root-cause-analysis

### Purpose
Diagnose underlying drivers behind a performance gap using causal logic.

### Use When
A gap exists and stakeholders need cause-level understanding before selecting interventions.

### Avoid When
The root cause is already accepted and focus is execution planning.

### Slide Structure
Gap statement + cause tree or driver table + evidence bullets per root cause + confidence note.

### Title Formula
<Gap> is driven by <top causes>.

### Narrative Formula
Observed gap -> Cause decomposition -> Evidence by cause -> Priority causes.

### Evidence Requirements
Each cause must have one metric and one observed mechanism.

### Bullet Style
Use numbered causes; each includes impact magnitude and controllability note.

### Table Style
Driver matrix: cause, impact, confidence, controllability, owner.

### Chart Style
Waterfall or variance bridge if additive contribution is quantifiable.

### Source Note Style
Source by cause cluster; cite analytical method if modeled.

### Tone And Word Choice
Forensic and specific; avoid vague phrasing like "multiple factors".

### Common Failure Modes
Cause/effect confusion, no magnitude, no prioritization.

### Prompt Starter
Use core.root-cause-analysis. Diagnose the performance gap with ranked causes and quantified impact.

### Mini Example
1) Price leakage accounts for ~42% of gross margin erosion, concentrated in legacy contracts.
2) Mix shift to low-margin channels contributes ~33% of variance.
3) Service complexity drives remaining cost drift.

## SWOT Analysis

### Archetype ID
core.swot-analysis

### Purpose
Summarize strategic posture across strengths, weaknesses, opportunities, and threats with action implications.

### Use When
Framing strategic choices, market entry, or portfolio direction discussions.

### Avoid When
A quantified option comparison is required as the primary output.

### Slide Structure
4-quadrant matrix + prioritized bullets + implication strip linking SWOT to actions.

### Title Formula
SWOT indicates <strategic posture> over the next <period>.

### Narrative Formula
Strengths/weaknesses internal -> opportunities/threats external -> strategic implications.

### Evidence Requirements
Each quadrant needs at least one measurable fact or observed trend.

### Bullet Style
Limit to 3-5 bullets per quadrant; include specificity and business effect.

### Table Style
Optional priority table ranking SWOT items by impact and urgency.

### Chart Style
Usually none; matrix visual is primary.

### Source Note Style
Attach market and internal source anchors by quadrant.

### Tone And Word Choice
Balanced and candid; avoid inflated strengths or speculative opportunities.

### Common Failure Modes
Generic bullets, no evidence, no action linkage.

### Prompt Starter
Use core.swot-analysis. Produce a SWOT slide with evidence-backed quadrants and explicit implications.

### Mini Example
- Strength: retention in top-50 accounts exceeds market by 9 pts.
- Weakness: cycle time in onboarding is 2.1x peer median.
- Opportunity: adjacent segment grows 14% CAGR with low incumbent concentration.
- Threat: input-cost volatility is compressing margins across the category.

## Market Sizing & Segmentation

### Archetype ID
core.market-sizing-segmentation

### Purpose
Quantify market opportunity, segment attractiveness, and priority targets.

### Use When
Building growth strategy, investment thesis, or go-to-market prioritization.

### Avoid When
The deck needs only internal performance review with no market decision component.

### Slide Structure
TAM/SAM/SOM logic + segment splits + attractiveness criteria + implication statement.

### Title Formula
Addressable opportunity is <size> with highest value in <segment>.

### Narrative Formula
Total market -> serviceable market -> obtainable share -> segment prioritization.

### Evidence Requirements
Use explicit assumptions, date stamps, and scenario ranges.

### Bullet Style
Explain assumptions and constraints in concise numbered bullets.

### Table Style
Segment table with size, growth, margin potential, entry difficulty.

### Chart Style
Stacked bars or funnel for TAM/SAM/SOM; avoid decorative visuals.

### Source Note Style
Reference external market data and internal conversion assumptions separately.

### Tone And Word Choice
Numerically precise and transparent on assumptions.

### Common Failure Modes
Single-point estimate without assumptions; segment ranking without criteria.

### Prompt Starter
Use core.market-sizing-segmentation. Build a TAM/SAM/SOM slide with explicit assumptions and segment prioritization.

### Mini Example
- TAM: $18.2B, SAM: $6.4B, SOM (3-year): $1.1B under base case.
- Segment C ranks highest on growth (18%) and margin potential (31%).
- Key constraint: channel access limits near-term SOM capture in Segment A.

## Competitive Landscape

### Archetype ID
core.competitive-landscape

### Purpose
Compare key competitors on positioning, capabilities, and performance implications.

### Use When
Evaluating strategic differentiation, partnership strategy, or response plans.

### Avoid When
The core question is internal process execution with no competitor decision.

### Slide Structure
Competitor comparison grid + positioning narrative + implications for own strategy.

### Title Formula
Competitive landscape shows <position> vs <peer set>.

### Narrative Formula
Who competes -> how they differ -> where advantage exists -> response required.

### Evidence Requirements
Use consistent comparison dimensions and dated sources.

### Bullet Style
One bullet per competitor advantage/risk with practical implication.

### Table Style
Comparison matrix: capability, scale, economics, speed, risk.

### Chart Style
2x2 positioning chart only when axes are meaningful and evidence-backed.

### Source Note Style
Cite public disclosures, customer feedback, and internal win/loss data.

### Tone And Word Choice
Fact-based and unsentimental; avoid unsubstantiated claims.

### Common Failure Modes
Inconsistent dimensions, biased scoring, no strategic implication.

### Prompt Starter
Use core.competitive-landscape. Compare 4-6 players with evidence-backed positioning and response implications.

### Mini Example
- Competitor A leads in enterprise integration depth but has slower deployment velocity.
- Competitor B undercuts price by 12% but shows weaker support reliability.
- Our advantage remains implementation speed and lower switching friction.

## Customer / VOC Insight Synthesis

### Archetype ID
core.customer-voc-synthesis

### Purpose
Translate customer evidence into prioritized insights and actions.

### Use When
Presenting survey, interview, NPS, or behavior analysis in decision contexts.

### Avoid When
No customer evidence exists and the slide would be speculative.

### Slide Structure
Insight headline + quantified findings + representative quotes + implication/actions.

### Title Formula
Customer evidence indicates <core insight> and <priority action>.

### Narrative Formula
Observed voice/signal -> pattern synthesis -> business implication -> action.

### Evidence Requirements
Combine quantitative signal and qualitative evidence in the same slide.

### Bullet Style
Use insight bullets, not raw quote dumps; each bullet should resolve ambiguity.

### Table Style
Optional issue-frequency table by segment or persona.

### Chart Style
Use bar/distribution charts for survey outcomes or behavioral rates.

### Source Note Style
State sample size, date range, and method in source notes.

### Tone And Word Choice
Empirical and customer-centered; avoid anecdotal overreach.

### Common Failure Modes
Anecdotes without sample context, no prioritization, no action link.

### Prompt Starter
Use core.customer-voc-synthesis. Turn customer data into prioritized insights with clear business implications.

### Mini Example
- 47% of churn-risk accounts cite onboarding complexity as primary friction.
- Enterprise buyers value governance controls over feature breadth.
- Action: redesign first-30-day journey for compliance-heavy customers.

## Operating Model Walkthrough

### Archetype ID
core.operating-model-walkthrough

### Purpose
Describe how work is organized today or in target state across roles, governance, and capabilities.

### Use When
Clarifying accountability model and operating design choices.

### Avoid When
A simple process map is sufficient and org/accountability detail is not needed.

### Slide Structure
Operating model framing + role/governance blocks + capability dependencies + risk note.

### Title Formula
Operating model requires <design principle> to deliver <outcome>.

### Narrative Formula
Model objective -> role design -> governance cadence -> capability dependencies.

### Evidence Requirements
Include role spans, cycle times, or control metrics where possible.

### Bullet Style
Use labeled sub-blocks (Roles, Governance, Capabilities, Interfaces).

### Table Style
RACI or decision-rights matrix recommended for clarity.

### Chart Style
Org chart/process swimlane as support only when needed.

### Source Note Style
Reference org data, process metrics, and governance records.

### Tone And Word Choice
Practical and implementation-aware.

### Common Failure Modes
Abstract operating model language, unclear ownership, no execution constraints.

### Prompt Starter
Use core.operating-model-walkthrough. Explain operating model design with explicit ownership and governance details.

### Mini Example
- Roles: domain pods own backlog-to-release for customer journeys.
- Governance: weekly decision forum clears cross-pod blockers within 72 hours.
- Dependency: shared data platform capacity is current critical path.

## Process Redesign / Future State

### Archetype ID
core.process-redesign-future-state

### Purpose
Show step-level future-state process and expected performance uplift.

### Use When
Presenting transformation design, process optimization, or service redesign.

### Avoid When
No sequential process exists; use strategy archetypes instead.

### Slide Structure
Current pain summary + future-state process flow + expected improvements + implementation risks.

### Title Formula
Future-state process reduces <pain> and improves <metric> by <x>.

### Narrative Formula
Current state issue -> redesign principle -> future-state steps -> value impact.

### Evidence Requirements
Quantify baseline and expected improvements by step or phase.

### Bullet Style
Use concise step annotations with owner and expected effect.

### Table Style
Step comparison table: current step, future step, impact, owner, timing.

### Chart Style
Process flow/timeline chart is primary visual.

### Source Note Style
Use process timing data, quality metrics, and pilot evidence.

### Tone And Word Choice
Operational and outcome-focused.

### Common Failure Modes
Flow without quantified impact, no owner, unrealistic sequencing.

### Prompt Starter
Use core.process-redesign-future-state. Build a future-state process slide with measurable before/after impact.

### Mini Example
- Step 1 triage automation cuts intake latency from 3.2 days to 0.5 days.
- Parallel validation in step 3 removes two rework loops.
- Expected end-to-end cycle time improves 38% in base case.

## Option Tradeoff Comparison

### Archetype ID
core.option-tradeoff-comparison

### Purpose
Compare strategic options using explicit criteria and recommendation logic.

### Use When
Decision meetings where alternatives must be compared transparently.

### Avoid When
Only one feasible path exists and comparison would be artificial.

### Slide Structure
Decision question + option table + criteria scoring + recommendation and rationale.

### Title Formula
Option <X> outperforms on <priority criteria> despite <tradeoff>.

### Narrative Formula
Decision context -> option definitions -> criteria results -> preferred option.

### Evidence Requirements
Define weighted criteria and show evidence behind each score.

### Bullet Style
Call out top 2-3 tradeoffs explicitly; include risk and mitigation.

### Table Style
Mandatory comparison matrix with criteria, weights, option scores, comments.

### Chart Style
Spider or weighted score bar optional for visual summary.

### Source Note Style
Reference assumptions and external dependencies per option.

### Tone And Word Choice
Neutral and transparent, then decisive recommendation.

### Common Failure Modes
Opaque scoring, hidden assumptions, recommendation unsupported by matrix.

### Prompt Starter
Use core.option-tradeoff-comparison. Compare options with weighted criteria and explicit recommendation logic.

### Mini Example
- Option B wins on time-to-value and implementation risk.
- Option A has better long-term margin but misses near-term capacity constraints.
- Recommend Option B with stage-gate to revisit Option A in phase 2.

## Recommendation Pack

### Archetype ID
core.recommendation-pack

### Purpose
Present prioritized actions with rationale, impact, and implementation conditions.

### Use When
Concluding analysis and converting findings into action decisions.

### Avoid When
Evidence is incomplete or recommendations would be speculative.

### Slide Structure
Recommendation headline + 3-5 prioritized actions + impact/risk notes + owner/timeframe.

### Title Formula
Recommended actions deliver <outcome> over <timeframe>.

### Narrative Formula
Why now -> What to do -> Expected impact -> Key dependency.

### Evidence Requirements
Each recommendation must map to prior findings and include impact range.

### Bullet Style
Use action verbs first (Approve, Reprice, Consolidate, Launch).

### Table Style
Action table: recommendation, impact, owner, timeline, dependency.

### Chart Style
Optional sequencing chart if dependencies are material.

### Source Note Style
Source references can point to prior slides/appendix rather than full URLs.

### Tone And Word Choice
Clear, accountable, and implementation ready.

### Common Failure Modes
Recommendations not tied to evidence, no owner, no dependency clarity.

### Prompt Starter
Use core.recommendation-pack. Provide prioritized actions with impact ranges, owners, and dependencies.

### Mini Example
- Approve segment-focused pricing reset (impact: +180 to +240 bps gross margin).
- Launch onboarding simplification wave in Q3 (impact: -22% cycle time).
- Stand up monthly value governance chaired by CFO.

## Implementation Roadmap + Risks

### Archetype ID
core.implementation-roadmap-risks

### Purpose
Show phased execution plan with milestone logic and risk mitigation actions.

### Use When
Transitioning from recommendations to execution planning.

### Avoid When
The audience only needs strategic direction and not delivery planning.

### Slide Structure
Phase timeline + milestone outputs + risk/mitigation pairings + critical path.

### Title Formula
Roadmap sequences <phases> to deliver <outcome> while controlling <key risks>.

### Narrative Formula
Phase plan -> milestone outcomes -> risks -> mitigations -> governance cadence.

### Evidence Requirements
Use realistic durations, dependency links, and capacity assumptions.

### Bullet Style
Milestone bullets should be outcome-based, not activity-only.

### Table Style
Risk register block with risk, trigger, mitigation, owner, residual risk.

### Chart Style
Timeline or milestone Gantt is primary visual.

### Source Note Style
Reference PMO assumptions, baseline capacity, and dependency inputs.

### Tone And Word Choice
Pragmatic and risk-aware.

### Common Failure Modes
Timeline without dependencies, vague milestones, missing risk ownership.

### Prompt Starter
Use core.implementation-roadmap-risks. Build a phased roadmap with explicit risks, mitigations, and owners.

### Mini Example
- Phase 1 (0-90 days): baseline alignment and pilot setup complete.
- Risk: data latency in integration layer; mitigation: precomputed nightly aggregates.
- Governance: biweekly steering and monthly value review.

## P&L Walkthrough

### Archetype ID
finance.pnl-walkthrough

### Purpose
Explain revenue, cost, and margin dynamics line by line with quantified drivers.

### Use When
Presenting financial performance mechanics and operational drivers.

### Avoid When
No financial statement context is available or required.

### Slide Structure
P&L table + driver bullets by major line item + implication on profitability trajectory.

### Title Formula
P&L trend shows <performance change> driven by <driver set>.

### Narrative Formula
Top-line movement -> variable cost behavior -> fixed cost behavior -> margin implication.

### Evidence Requirements
Include at least 4 periods and line-level variance metrics.

### Bullet Style
Label-led bullets per major line item with magnitude and mechanism.

### Table Style
Mandatory line-item table with historical and recent periods.

### Chart Style
Optional bridge or margin trend chart for readability.

### Source Note Style
Reference internal financial statements and modeling assumptions.

### Tone And Word Choice
Technical but readable; avoid accounting jargon without explanation.

### Common Failure Modes
Narrative disconnected from table, no cost decomposition, no implication.

### Prompt Starter
Use finance.pnl-walkthrough. Explain P&L movement with line-item drivers and margin implications.

### Mini Example
- Revenue grew 11% driven by transaction volume and higher enterprise mix.
- Variable costs rose 8%, preserving gross margin expansion of 140 bps.
- Fixed cost absorption improved EBITDA conversion in the last two periods.

## Margin Bridge / Waterfall

### Archetype ID
finance.margin-bridge-waterfall

### Purpose
Quantify component contributions from baseline to target margin outcome.

### Use When
Stakeholders need additive explanation of margin movement.

### Avoid When
Contribution logic is non-additive or highly uncertain.

### Slide Structure
Start margin -> driver steps -> end margin + commentary on top contributors and reversals.

### Title Formula
Margin moved from <A> to <B> primarily due to <top contributors>.

### Narrative Formula
Baseline -> positive drivers -> negative drivers -> net impact -> management implication.

### Evidence Requirements
Each step must have signed contribution and source attribution.

### Bullet Style
Use ranked contributor bullets with +/- effects and confidence note.

### Table Style
Bridge table should mirror waterfall ordering for auditability.

### Chart Style
Waterfall chart is primary visual.

### Source Note Style
Cite calculation logic and period scope explicitly.

### Tone And Word Choice
Mechanistic and transparent.

### Common Failure Modes
Unreconciled steps, mixed scopes, hidden assumptions.

### Prompt Starter
Use finance.margin-bridge-waterfall. Build a reconciled margin bridge with signed driver impacts.

### Mini Example
- Mix shift contributed +90 bps, pricing contributed +60 bps.
- Freight inflation and support overhead offset -45 bps.
- Net margin improved +105 bps vs baseline.

## QofE-Style Adjustment Walkthrough

### Archetype ID
finance.qoe-style-adjustment-walkthrough

### Purpose
Separate reported performance from normalized run-rate performance via explicit adjustments.

### Use When
Normalization is needed to support valuation, planning, or comparability.

### Avoid When
Business context does not require normalization adjustments.

### Slide Structure
Reported metric table + adjustment log + normalized metric + explanatory notes.

### Title Formula
Normalized <metric> differs from reported by <x> due to <adjustment themes>.

### Narrative Formula
Reported base -> adjustment categories -> normalized result -> interpretation cautions.

### Evidence Requirements
Each adjustment must include rationale, magnitude, and recurrence label.

### Bullet Style
Use numbered adjustments with concise rationale and run-rate impact.

### Table Style
Adjustment register table with reference IDs and period impacts.

### Chart Style
Optional bridge chart from reported to normalized.

### Source Note Style
Source every adjustment to GL/supporting analysis where possible.

### Tone And Word Choice
Forensic and disciplined.

### Common Failure Modes
Unlabeled adjustments, non-reconciling totals, no recurrence logic.

### Prompt Starter
Use finance.qoe-style-adjustment-walkthrough. Reconcile reported to normalized metrics with numbered adjustment logic.

### Mini Example
- Adj #1 removes one-time settlement credit (+$0.8M EBITDA impact).
- Adj #2 normalizes support staffing to steady-state run-rate (-$0.3M).
- Normalized EBITDA margin is 29.4% vs reported 30.1%.

## Net Working Capital Walkthrough

### Archetype ID
finance.net-working-capital-walkthrough

### Purpose
Explain working capital mechanics, adjustments, seasonality, and liquidity implications.

### Use When
Assessing cash conversion, liquidity, or diligence-level operating capital behavior.

### Avoid When
Cash/working-capital metrics are not decision-relevant.

### Slide Structure
NWC table + adjustment bridge + seasonality/commentary + implication box.

### Title Formula
Adjusted NWC is <x> driven by <timing and adjustment factors>.

### Narrative Formula
Reported NWC -> adjustment effects -> normalized NWC -> cash implication.

### Evidence Requirements
Include as-at and average views, plus at least one seasonality indicator.

### Bullet Style
Use adjustment-specific bullets with DSO/DPO or cycle-time interpretation.

### Table Style
Mandatory NWC bridge with reported, due diligence/pro forma, adjusted.

### Chart Style
Seasonality trend or DSO/DPO trend when helpful.

### Source Note Style
Use internal financial statements and adjustment support references.

### Tone And Word Choice
Operational-financial and explanatory.

### Common Failure Modes
No distinction between timing vs structural effects; no liquidity implication.

### Prompt Starter
Use finance.net-working-capital-walkthrough. Explain NWC movement with adjustments, seasonality, and liquidity implication.

### Mini Example
- Adjusted NWC averaged $6.3M over L24M after normalizing contract timing effects.
- DSO inflation in Q2 is linked to billing dispute timing, not demand collapse.
- Liquidity risk remains moderate under base collection assumptions.

## Cash Flow / Liquidity Walkthrough

### Archetype ID
finance.cash-flow-liquidity-walkthrough

### Purpose
Translate earnings and working capital into liquidity outlook and risk posture.

### Use When
Decision-making depends on cash runway, financing, or covenant sensitivity.

### Avoid When
Liquidity is immaterial to the strategic recommendation.

### Slide Structure
Cash flow bridge + liquidity table + stress sensitivities + actions.

### Title Formula
Liquidity outlook remains <status> under <base case> with <key sensitivities>.

### Narrative Formula
Operating cash drivers -> investing/financing effects -> liquidity outlook -> risk actions.

### Evidence Requirements
Include base and downside scenario assumptions.

### Bullet Style
Bullets should quantify runway/cushion and identify key triggers.

### Table Style
Liquidity table with cash, availability, obligations, runway.

### Chart Style
Cash waterfall or runway trend chart optional.

### Source Note Style
Reference treasury data, forecast assumptions, and facility terms.

### Tone And Word Choice
Risk-aware, transparent, and action-oriented.

### Common Failure Modes
No scenario view, no trigger thresholds, no mitigation actions.

### Prompt Starter
Use finance.cash-flow-liquidity-walkthrough. Build a liquidity slide with scenario sensitivities and trigger-based actions.

### Mini Example
- Base case runway extends 18 months with current working-capital profile.
- Downside case reduces runway to 11 months if conversion slows by 15%.
- Action: implement receivables control pack and capex prioritization gate.

## Evidence Appendix Packet

### Archetype ID
finance.evidence-appendix-packet

### Purpose
Provide traceable backup exhibits that validate core-slide claims and adjustments.

### Use When
Complex claims require supporting calculations, reconciliations, or source extracts.

### Avoid When
The main deck already contains full evidence and appendix would duplicate content.

### Slide Structure
Indexed appendix list + exhibit pages with references to main-slide claim IDs.

### Title Formula
Appendix evidence supports claims in <section>.

### Narrative Formula
Claim reference -> evidence exhibit -> reconciliation note -> usage caveat.

### Evidence Requirements
Every appendix exhibit should map to at least one claim ID from body slides.

### Bullet Style
Use brief exhibit purpose statements; avoid long narrative prose.

### Table Style
Exhibit tables should preserve original labels and period definitions.

### Chart Style
Only include charts when they clarify an otherwise dense table.

### Source Note Style
Include precise source tags, file dates, and extraction scope.

### Tone And Word Choice
Documentary and precise.

### Common Failure Modes
Orphan exhibits, inconsistent labels, no claim linkage.

### Prompt Starter
Use finance.evidence-appendix-packet. Build appendix exhibits mapped to claim IDs from core slides.

### Mini Example
- Exhibit A1 supports QofE Adj #1 with billing and volume reconciliation.
- Exhibit A2 ties adjusted income statement totals to component adjustments.
- Exhibit A3 provides DSO normalization sensitivity table.
