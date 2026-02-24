# QA Golden Fixture

This repo includes a golden QA contract fixture to detect unintended changes to QA report shape.

## Files

- Input deck fixture: `decks/qa-golden-all-layouts.deckSpec.json`
- Output fixture artifacts: `outputs/qa-golden-fixture/deck.pptx` and `outputs/qa-golden-fixture/qa.json`
- Golden QA contract snapshot: `outputs/qa-golden-fixture/golden-all-layouts.qa.json`
- Test runner: `scripts/test-qa-golden.mjs`

## Why this exists

The QA JSON is consumed by downstream review and automation flows. A golden fixture test catches accidental schema drift early.

## What the test validates

- All supported layout types are covered by the fixture deck.
- Dense content triggers continuation behavior across multiple layout modes.
- Normalized QA output matches the checked-in golden fixture exactly.

## Normalization behavior

To keep comparisons stable, the test strips or normalizes volatile fields:

- `generatedAt`
- `postprocess`
- absolute paths and runtime temp paths
- `outputPptx` (normalized placeholder)

## Commands

Run check:

```bash
npm run test:qa:golden
```

Refresh golden intentionally (only when contract changes are expected):

```bash
UPDATE_GOLDEN=1 npm run test:qa:golden
```

## Maintenance notes

- Keep the fixture deck high-density and feature-rich so pagination, warnings, and repair suggestions remain exercised.
- If a QA contract change is intentional, update this doc and reviewer notes in the same PR as the golden refresh.
