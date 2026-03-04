# Golden Regression Fixture Workflow

This repo uses `decks/qa-golden-all-layouts.deckSpec.json` as the stress fixture for QA and visual regressions.

## What this fixture must always cover

- Every layout in `templates/kpmg-diligence/package/layouts.json`.
- Every slot key for each layout type (at least once across that type's slides).
- Every chart type in `skills/kpmg-slides/references/deckspec.schema.json`.
- Bullet variants: plain strings, `header`, `subheader`, nested `children`.
- Both short and verbose narrative slides.
- Continuation/pagination pressure across core modes (contents, one-column, two-column, table, chart+text, bridge).

## Update process

1. Edit `decks/qa-golden-all-layouts.deckSpec.json`.
2. Refresh golden QA snapshot:

```bash
UPDATE_GOLDEN=1 npm run -s test:qa:golden
```

3. Re-run golden QA check:

```bash
npm run -s test:qa:golden
```

4. Run full visual regression suite:

```bash
npm run -s test:visual:all
```

## Notes

- Keep this fixture intentionally dense and adversarial; it is a pre-release break-test deck, not a content-quality sample.
- If you add a new layout or slot contract, update this fixture in the same change.
- `npm run -s test:visual:all` runs automated suites only; `test:visual:reference-parity` remains a targeted/manual run with explicit args.
