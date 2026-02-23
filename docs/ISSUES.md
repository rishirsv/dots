# KPMG Slide Generator Issues

Last updated: 2026-02-22
Scope: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen` (minimal runtime edition)

## Critical Issues

### 1) Strict mode is effectively broken
- Severity: High
- Problem:
  - `--strict` invokes `qa/strict_overflow.py`, which is not present in the minimal repo.
  - Strict runs therefore fail regardless of deck quality.
- Evidence:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/index.js:165`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/index.js:345`
- Impact:
  - CI/automation using strict mode cannot pass reliably.
- Recommended fix:
  - Resolve script path relative to module directory.
  - If script is missing, mark strict check as skipped in QA summary instead of failing render.

### 2) Template asset loading can fail at import time
- Severity: High
- Problem:
  - Several builders resolve `kpmg-diligence` asset paths during module import.
  - If paths change or alternate templates are used, imports may fail before runtime validation.
- Evidence:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/builders/cover-slide.js:66`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/builders/divider-slide.js:37`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/builders/back-cover-slide.js:6`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/helpers/footer.js:10`
- Impact:
  - Generator can crash before producing QA output.
- Recommended fix:
  - Defer asset resolution to runtime with `templatePackage.resolveAssetPath`.
  - Emit QA warnings for missing assets rather than hard import failures.

### 3) Footer metadata validation occurs too late
- Severity: High
- Problem:
  - Missing footer metadata throws during render, after earlier validation appears successful.
- Evidence:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/runtime/render-deck.js:735`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/runtime/render-deck.js:756`
- Impact:
  - Runtime crash instead of clean QA-reported validation failure.
- Recommended fix:
  - Move footer metadata checks into pre-render validation.
  - Or provide defaults and downgrade to warnings for non-critical fields.

## Medium Issues

### 4) Uses private PptxGenJS internals for slide counting/overlap
- Severity: Medium
- Problem:
  - Logic relies on `pptx._slides`, which is not public API and may change.
- Evidence:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/index.js:293`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/strict/overlap.js:302`
- Impact:
  - Dependency updates can silently break QA and counts.
- Recommended fix:
  - Track rendered slide state from generator-owned metadata instead of library internals.

### 5) Contents slide truncates sections after 10
- Severity: Medium
- Problem:
  - Contents renderer only handles first 10 sections (2 rows × 5).
- Evidence:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/builders/contents-slide.js:94`
- Impact:
  - Silent data loss in TOC for larger decks.
- Recommended fix:
  - Add TOC pagination for >10 sections.
  - At minimum, add QA warning when truncation occurs.

## Operational Fragility

### 6) Runtime reproducibility depends on vendored `node_modules`
- Severity: Medium
- Problem:
  - Minimal repo currently has no `package.json`/lockfile and depends on committed `node_modules`.
- Evidence:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/README.md:235`
- Impact:
  - Hard to rebuild cleanly on new machines/CI.
- Recommended fix:
  - Restore minimal `package.json` and lockfile with explicit runtime dependencies.

## Suggested Remediation Order

1. Fix strict mode missing script handling.
2. Defer builder/footer asset loading to runtime.
3. Move footer metadata checks into validation phase.
4. Replace private Pptx internals usage.
5. Implement TOC pagination + truncation warnings.
6. Restore dependency manifests for deterministic installs.

## Definition of Done

- `--strict` no longer fails solely due to missing helper script.
- Generator never crashes at module import due to template path assumptions.
- Missing required metadata surfaces in one QA report (no uncaught throw path).
- No usage of `pptx._slides` in production logic.
- Contents pages preserve all sections (or warn explicitly if truncated).
- Fresh environment can install dependencies without vendored `node_modules`.
