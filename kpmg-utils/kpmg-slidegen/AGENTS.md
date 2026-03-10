---
status: active
last-reviewed: 2026-03-06
review-cycle-days: 14
source-of-truth: repo audit of kpmg-slidegen docs, scripts, and skill references
verification-state: verified
---

# AGENTS

## Table Of Contents

- [Purpose](#purpose)
- [Scope](#scope)
- [Working Rules](#working-rules)
- [Quick Start](#quick-start)
- [Key Files](#key-files)
- [Skill Bundle Contract](#skill-bundle-contract)

## Purpose

This repo converts `deckSpec` JSON files into `.pptx` outputs with a consolidated QA JSON report.

## Scope

- Edit generation logic only in `generator/`.
- Keep template contracts in `templates/kpmg-diligence/package/`.
- Treat `fixtures/harness/` as the curated fixture surface and `presets/authoring/` as the user-facing starter surface.

## Working Rules

- Preserve runtime-minimal design; avoid adding unnecessary frameworks.
- Keep docs and code consistent when changing slide types, slot rules, or QA shape.
- Validate changes by running the generator with explicit `--in` and either `--out` or `--out-dir`, plus `--qa-out` when you need a deterministic QA artifact path.
- Keep postprocess runtime portable: repo runs and skill runs must work without external `.agents` dependencies.
- This repo is pre-release. Do not add backward-compatibility fallbacks or dual-path parsers unless explicitly requested.
- Use the repo-only onboarding workflow under `scripts/onboarding/` and `onboarding/cases/` for new canonical layout work. Do not put draft onboarding assets, source PPTX files, or diff artifacts into the portable skill bundle.

## Quick Start

```bash
node generator/index.js \
  --in presets/authoring/detailed.deckSpec.json \
  --out-dir outputs/my-run \
  --qa-out outputs/my-run/qa.json
```

## Key Files

- `generator/index.js`: CLI orchestration and QA output.
- `generator/runtime/render-deck.js`: validation + rendering dispatch.
- `generator/runtime/paginate.js`: overflow splitting.
- `generator/strict/overlap.js`: overlap checks.
- `generator/postprocess/slides-adapter.js`: preview/montage/overflow adapter with runtime discovery.
- `generator/postprocess/slides-runtime/`: bundled Python postprocess runtime (`render_slides.py`, `create_montage.py`, `slides_test.py`, `ensure_raster_image.py`).
- `templates/kpmg-diligence/package/layouts.json`: slide-type layout contract.
- `scripts/onboarding/`: repo-only layout extraction, render, compare, and promotion tooling.
- `onboarding/cases/`: repo-only onboarding case workspaces.

## Skill Bundle Contract

- Sync skill bundle with `npm run skill:sync`.
- Verify portability with `npm run skill:verify`.
- Skill distributable lives under `skills/kpmg-slides/` and must remain self-contained for generation + postprocess checks.
- Keep documentation inside `skills/kpmg-slides/` portable for standalone skill users; do not include repo-root maintenance commands (for example `npm run skill:sync` or `npm run skill:verify`) in skill-facing docs.
- Keep skill references aligned to `references/INDEX.md`, `references/slide-contract.md`, `references/writing-standards.md`, `references/layout-policy.md`, and `references/quality_assurance.md`.
- QA communication in skill responses should prioritize blocking issues, then one sentence for non-blocking observations.
