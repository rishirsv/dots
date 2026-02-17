# Generation Notes - Full Project North Prose Rewrite (Feb 12, 2026)

## Inputs reviewed (newer than `deck-input.json` in Downloads)
- `/Users/rishi/Downloads/exhibit-register.csv`
- `/Users/rishi/Downloads/appendix-topic-index.md`
- `/Users/rishi/Downloads/working-capital-adjustments.csv`
- `/Users/rishi/Downloads/qoe-adjustments.csv`
- `/Users/rishi/Downloads/financials-cashflow-bridge.csv`
- `/Users/rishi/Downloads/financials-balance-sheet-stratified.csv`
- `/Users/rishi/Downloads/financials-income-statement.csv`
- `/Users/rishi/Downloads/generation-notes.md`
- `/Users/rishi/Downloads/deck-plan.json`
- `/Users/rishi/Downloads/deck-input.json`

## Root-cause diagnosis of poor prior quality
1. Prior bullets were too formulaic and often read like template scaffolding rather than manager-ready diligence prose.
2. Implication language repeated the same sentence structures, so pages sounded robotic even when factually correct.
3. Some narrow-table slides relied on generic fallback narration, which reduced slide-specific insight quality.
4. The QoE register page exceeded layout capacity when prose density increased, forcing explicit fit-aware compaction.

## Remediation implemented
1. Rewrote all narrative fields (`body`, `leftBody`, `rightBody`, `insights`) into complete two-sentence business prose for substantive bullets.
2. Applied Project North-style structure at bullet level: observation/evidence first, transaction implication second.
3. Increased linguistic variation and reduced repetitive connective patterns to avoid robotic voice.
4. Preserved numeric fidelity, signs, and required placeholders (`[CHART PLACEHOLDER]`, `[TABLE IMAGE PLACEHOLDER]`).
5. Kept table-slide commentary slide-specific (no fallback-only language on QoE/NWC appendix tables).
6. Compacted slide 26 (`QoE Adjustments Register`) table labels/insights to clear strict overflow without reverting to fragments.

## Quality controls run
- `node generator/validate.js --in /Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-spec.json` -> `OK`
- `node generator/index.js --in /Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-spec.json --out /Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck.pptx --strict` -> `PASS`
- Strict overflow gate -> `PASS` (no slide overflow failures)
- Narrative diagnostics:
  - `258/258` substantive bullets are multi-sentence
  - `250` unique second-sentence implications across `258` substantive bullets

## Output artifacts
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-spec.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck.pptx`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck.pdf`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-gold-standard-northbridge-fdd.pptx`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-gold-standard-northbridge-fdd.pdf`

## Remaining caveats
- Open support dependencies remain intentionally flagged where source support is still pending (for example QA03, QA09, QA11, QA12 and selected NWC items).
- This remains a simulated diligence pack driven by provided source inputs.

---

# Generation Notes - Autobahn Verbatim Gold Standard Run (Feb 17, 2026)

## Source input
- `/Users/rishi/Code/ai-tools/chatgpt/ts-report-writer/extracted/autobahn-extracted.md`

## Scope and assumptions
- Used only report-body sections from `# Executive Summary` through `# Appendices`.
- Excluded template metadata, source evidence tables, and trailing Python helper lines in the extraction file.
- Preserved extracted wording verbatim in slide bodies (no paraphrasing), with continuation handled by slide pagination.

## Artifacts regenerated
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-input.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-plan.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-spec.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck.pptx`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck.pdf`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-gold-standard-autobahn-fdd.pptx`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/exports/deck-gold-standard-autobahn-fdd.pdf`

## Validation and render checks
- `node generator/validate.js --in .../exports/deck-spec.json` -> `OK`
- `node generator/index.js --in .../exports/deck-spec.json --out .../exports/deck.pptx --strict` -> `PASS`
- Strict summary: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/strict/2026-02-17T16-43-36-926Z/strict-summary.json`
  - `overlapCount: 0`
  - `severeCount: 0`
  - `overflow.status: 0`

## Run stats
- Parsed top-level sections: `20`
- Generated content slides: `34`
- Total generated slides (incl. cover/TOC): `36` (expanded to `40` after pagination at render-time)
- Verbatim lines mapped into content evidence: `229`

## Final fidelity pass
- Removed non-source strapline prose from generated content slides to tighten exact-content fidelity.
- Re-ran validation + strict generation + PDF conversion after this fidelity cleanup.
- Final strict summary: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/strict/2026-02-17T16-45-16-573Z/strict-summary.json`
  - `slideCount: 40`
  - `overlapCount: 0`
  - `severeCount: 0`
  - `overflow.status: 0`
