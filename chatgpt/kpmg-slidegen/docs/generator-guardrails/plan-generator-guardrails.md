# Generator Guardrails + Utilities Plan

## Summary
Implement optional strict mode (overlap + overflow checks) and add generator-focused utilities inspired by OpenAI’s slides helpers, while keeping the template-driven, brand-locked pipeline intact.

## Task List
- [x] 1.0 Create this plan doc
- [x] 2.0 Add `generator/strict/overlap.js` and overlap JSON reporting
- [x] 3.0 Add `qa/strict_overflow.py` and overflow reporting
- [x] 4.0 Wire `--strict` into `generator/index.js` and emit strict artifacts
- [x] 5.0 Add `generator/helpers/media.js` and migrate cover/divider/back-cover image logic
- [x] 6.0 Add `generator/helpers/svg.js` and `generator/helpers/text.js`; adopt `calcTextBoxHeight` in 1–2 builders
- [x] 7.0 Emit validation warnings and add shared text sanitizer + geometry credibility helper
- [x] 8.0 Align cover/back-cover to `generator/tokens.js`
- [x] 9.0 Add generator diagnostics report
- [x] 10.0 Add builder smoke tests
- [x] 11.0 Update docs (`SPEC.md`, `ARCHITECTURE.md`, `qa/AGENTS.md`)
- [x] 12.0 Run strict mode smoke tests and record results

## Notes
- Strict mode smoke test completed on 2026-02-03. Warnings observed from validation about section title maxLength and a chart placeholder mismatch; overflow check passed.
