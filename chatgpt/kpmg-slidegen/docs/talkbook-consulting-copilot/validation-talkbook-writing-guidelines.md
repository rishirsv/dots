# Validation: Talkbook Writing Guidelines V1

## Scope

This validation checks whether the archetype-first writing system improves drafting depth and decision usefulness for two representative scenarios:

- Strategy-style topic
- Finance/deal-depth topic

The validation is advisory and non-blocking. It uses the rubric in `dist/kpmg-talkbook-consulting-copilot/references/writing-checklist.md`.

## Evaluation Runs

### Scenario A: Strategy-style

- Session: `v1-strategy-archetype-20260206-185356`
- Topic: `B2B SaaS Growth Strategy Refresh`
- Compile report: `dist/kpmg-talkbook-consulting-copilot/sessions/v1-strategy-archetype-20260206-185356/compile_report.json`
- Run result: `dist/kpmg-talkbook-consulting-copilot/sessions/v1-strategy-archetype-20260206-185356/outputs/runs/20260206-185357/run_result.json`
- Inspection summary: `dist/kpmg-talkbook-consulting-copilot/sessions/v1-strategy-archetype-20260206-185356/outputs/runs/20260206-185357/round-01/inspect/strict-summary.json`

### Scenario B: Finance/deal-depth

- Session: `v1-finance-archetype-20260206-185405`
- Topic: `Transaction Services Profitability Normalization`
- Compile report: `dist/kpmg-talkbook-consulting-copilot/sessions/v1-finance-archetype-20260206-185405/compile_report.json`
- Run result: `dist/kpmg-talkbook-consulting-copilot/sessions/v1-finance-archetype-20260206-185405/outputs/runs/20260206-185405/run_result.json`
- Inspection summary: `dist/kpmg-talkbook-consulting-copilot/sessions/v1-finance-archetype-20260206-185405/outputs/runs/20260206-185405/round-01/inspect/strict-summary.json`

## Build/Inspection Outcomes

- Both runs were accepted in one round (`accepted: true`, `rounds_executed: 1`).
- Strategy run inspection: 2 warning overlaps, 0 severe overlaps, 0 out-of-bounds.
- Finance run inspection: 0 overlaps, 0 out-of-bounds.
- Both runs compiled with no missing required slots.

## Rubric Scores (1-5)

| Dimension | Strategy | Finance | Notes |
|---|---:|---:|---|
| Message Specificity | 4 | 4 | Both scenarios use concrete claims and clear section intent. |
| Quantification Depth | 4 | 4 | Numeric anchors are present throughout; finance is more consistently metric-led. |
| Evidence Quality | 3 | 4 | Strategy evidence is useful but more model/ops-label based; finance includes tighter line-item support. |
| Interpretation Quality | 4 | 4 | Both explain implications beyond restating data. |
| Source Traceability | 3 | 4 | Strategy has source labels but fewer explicit assumption notes; finance is more audit-friendly. |
| Structural Coherence | 3 | 4 | Strategy had quadrant/center-text overlap warning on SWOT slide; finance layouts remained clean. |
| Tone And Clarity | 4 | 4 | Professional, active, decision-oriented style in both. |
| Decision Usefulness | 5 | 4 | Strategy explicitly drives a near-term decision; finance is strong but more diagnostic. |
| **Total** | **30 / 40** | **32 / 40** | Both in “usable draft” band; finance slightly stronger overall. |

## Delta Analysis

### Strengths improved by archetype-first guidance

- Content avoids high-level placeholders and includes quantified claims.
- Archetype structure creates predictable claim-evidence-implication flow.
- Decision framing is explicit in strategy and interpretation is stronger in finance.

### Remaining gaps

- Strategy-style SWOT composition can trigger visual collision when center narrative and quadrant text both get dense.
- Source traceability is present but should require clearer assumption statements in strategy pages.
- Some sections still need tighter evidence object discipline (for example, when to force table vs bullet-only narrative).

## Recommended Guidance Refinements (Next Iteration)

1. Add a `SWOT density guardrail` in `core.swot-analysis`:
   - Max 2 lines per quadrant bullet.
   - Keep `text_center_body` to one short implication line when using `quad-box-icon-center-text`.
2. Add `assumption callout rule` to strategy archetypes:
   - One explicit assumptions line when claim is model-driven.
3. Add `evidence object chooser` mini-rule across archetypes:
   - If >=3 numeric claims in one section, require table or chart (not bullets only).
4. Add a `layout-risk note` in checklist:
   - For quad layouts, run a quick visual density check before finalization.

## Acceptance Check Against Plan

- Strategy sample evaluation completed: yes.
- Finance sample evaluation completed: yes.
- Rubric scoring with required dimensions documented: yes.
- Deltas and improvement guidance documented: yes.

## Recovery Pass (Post-Review)

After user feedback that earlier samples were too thin and insufficiently Talkbook-like, a second, denser validation run was executed.

### Recovery Scenario A: Strategy (Dense V2)

- Session: `v2-strategy-density-20260206-122920`
- Run result: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-strategy-density-20260206-122920/outputs/runs/20260206-193051/run_result.json`
- Slides: 8
- Strict summary: 0 severe overlaps, 0 warning overlaps, 0 out-of-bounds
- Layout mix: recommendations + chart + table-insights + SWOT + comparison + timeline + risks/mitigations

### Recovery Scenario B: Finance (Dense V2)

- Session: `v2-finance-density-20260206-123127`
- Run result: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-finance-density-20260206-123127/outputs/runs/20260206-193128/run_result.json`
- Slides: 8
- Strict summary: 0 severe overlaps, 0 warning overlaps, 0 out-of-bounds
- Layout mix: table-insights-heavy + chart bridges + risks/mitigations + appendix

### Recovery Conclusion

- Density and evidence usage improved materially versus initial 4-slide samples.
- Chart and table coverage now appears consistently in analytical sections.
- Remaining gap: visual parity with Project North (especially table styling, title treatment, and overall polish) is improved but not yet full parity.
