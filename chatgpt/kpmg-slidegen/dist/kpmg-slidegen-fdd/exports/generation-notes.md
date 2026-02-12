# Generation Notes

## Run Summary
- Scenario: synthetic 25-slide FDD report
- Topic: outpatient healthcare platform (`Project Cascade Care`)
- Output deck: `exports/deck.pptx`
- Copied alias: `exports/deck-25-cascade-care.pptx`

## Assumptions
- All financial and operational values are synthetic and created for playbook stress testing.
- Draft reflects `standard` verbosity with expanded analytical coverage across core sections.
- Placeholder usage preserved for appendix handoff (`[TABLE IMAGE PLACEHOLDER]`).

## Mapping Decisions
- Covered standard deck flow: cover, section dividers, business overview, key findings, P&L, QoE bridge/details, NWC review, reporting environment, risk framework, and appendices.
- Included core layout families and major supported slide types:
  - `cover`, `divider`, `twoColumnText`, `analysisWideChart2ColsText`, `analysisNarrowTable`, `analysisWideChartTableText`, `summaryFinancials`, `titleStrapline4TextBoxes`, `oneColumnText`, `backCover`.

## Validation
- Spec validation: passed (`generator/validate.js`).
- Deck generation: passed (`generator/index.js`).
- PPTX structural slide count check: 25 slide XML parts found in `deck.pptx`.

## Manual Review Notes
- Full 25-slide qualitative scoring pass not yet completed in this run.
- Next step: run the integrated rubric from `knowledge/writing-standards.md` across all slides and execute rewrite loop where needed.

## Rendering Caveat
- LibreOffice PDF conversion in this environment produced a shortened PDF page count despite PPTX containing 25 slide parts.
- Treat PPTX as the source of truth for slide count in this run.

## Residual Risks
- Some slides may still require rewrite iteration to optimize visual density and avoid title wrapping in presentation view.
- The `summaryFinancials` template emitted a known warning about chart placeholder availability in this template variant.
