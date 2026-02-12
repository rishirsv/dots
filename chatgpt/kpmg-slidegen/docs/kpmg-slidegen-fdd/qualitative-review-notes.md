# Qualitative Review Notes (Project North Calibration)

Generated: 2026-02-12T00:26:00Z

## Method
- Comparison mode: side-by-side qualitative review (no programmatic visual diff).
- Baseline corpus: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/outputs/project-north/png`.
- Generated artifacts: review packs in `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/samples/calibration/expected/*/review-pack/index.html`.
- Rubric:
  - Layout suitability
  - Text quality/tone
  - Factual fidelity
  - Placeholder handling

## Scenario Results

### 1) business-overview
- Review pack: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/samples/calibration/expected/business-overview/review-pack/index.html`
- Baseline link: slide 07.
- Assessment:
  - Layout suitability: Pass (two-column structure supports executive summary style).
  - Text quality/tone: Pass (formal, diligence-oriented phrasing).
  - Factual fidelity: Pass (2012, 8 sites, 420 employees, 86.4, 14.2 retained).
  - Placeholder handling: N/A for this case.

### 2) qoe-highlights
- Review pack: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/samples/calibration/expected/qoe-highlights/review-pack/index.html`
- Baseline link: slide 12.
- Assessment:
  - Layout suitability: Pass (chart/table-left placeholder plus right-side commentary behaves as intended).
  - Text quality/tone: Pass.
  - Factual fidelity: Pass for tracked numeric facts (1.4, 0.8, 0.5).
  - Placeholder handling: Pass (`[CHART PLACEHOLDER]` and `[TABLE IMAGE PLACEHOLDER]` preserved verbatim).

### 3) payroll-appendix
- Review pack: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/samples/calibration/expected/payroll-appendix/review-pack/index.html`
- Baseline link: slide 63.
- Assessment:
  - Layout suitability: Pass for analyst handoff flow.
  - Text quality/tone: Pass.
  - Factual fidelity: Pass for tracked numeric facts (28.4, 32.1, 3.2).
  - Placeholder handling: Pass (`[TABLE IMAGE PLACEHOLDER]` preserved verbatim).

### 4) working-capital
- Review pack: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/samples/calibration/expected/working-capital/review-pack/index.html`
- Baseline link: slide 53.
- Assessment:
  - Layout suitability: Pass.
  - Text quality/tone: Pass.
  - Factual fidelity: Pass for tracked numeric facts (2.6, 0.9).
  - Placeholder handling: Pass (`[CHART PLACEHOLDER]` preserved verbatim).

### 5) multi-card-mini-section
- Review pack: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/kpmg-slidegen-fdd/samples/calibration/expected/multi-card-mini-section/review-pack/index.html`
- Baseline links: slides 10, 12, 63.
- Assessment:
  - Layout suitability: Pass for 3-slide decomposition.
  - Text quality/tone: Pass.
  - Factual fidelity: Pass for tracked numeric facts.
  - Placeholder handling: Pass for chart/table tokens.

## Accepted Adjustments During Calibration
- Numeric data-fidelity gate updated to correctly parse decimals with suffixes (e.g., `86.4m`, `14.2m`).
- V1 chart/table layouts compile to deterministic two-column placeholder layouts instead of generated chart objects to reduce runtime fragility.
- Review pack generation integrated into runner outputs for repeatable qualitative assessment.

## Residual Risks
- Baseline extraction from PDF text is noisy for dense tabular pages; taxonomy remains a calibrated approximation and should be periodically reviewed manually.
- Some Project North baseline slides are highly table-dense and may require future dedicated table builder mappings for closer visual parity.
