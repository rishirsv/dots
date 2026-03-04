# Add A Layout Contract (Deterministic)

Use this for every new layout so additions stay consistent and safe as slide count scales.

## Required Files

1. `templates/kpmg-diligence/package/layouts.json`
2. `generator/runtime/slide-registry.js`
3. `templates/kpmg-diligence/package/pagination-policy.json` (if paginated)
4. `generator/builders/<layout>.js`
5. Schema source (`docs/DECKSPEC-SLOTS-SCHEMA.json` or `skills/kpmg-slides/references/deckspec.schema.json`)
6. Regression fixture (`decks/...deckSpec.json`)

## Contract Rules

1. Add canonical geometry boxes only (no builder-local geometry defaults).
2. Add `requiredGeometry` keys in registry for every box the builder must have.
3. Registry must define `builderId`, `masterVariant`, and `paginationPolicyKey`.
4. Pagination policy key must be versioned (example: `text.oneColumn.v1`).
5. Contract errors are fatal:
- missing required geometry
- missing registry entry
- missing policy key
- invalid row/slot shapes

## Pagination Rules

1. If the slide paginates, create/update a policy entry in `pagination-policy.json`.
2. Policy defines strategy and continuation behavior:
- `dropFields`
- `recomputeFields`
3. Avoid ad-hoc slide-type branching in runtime; map behavior through policy.

## Required Tests

1. `npm run -s test:contracts`
2. `npm run -s test:contracts:registry`
3. Relevant pagination/validation regression scripts
4. Visual regression for the new layout
5. Reference parity check when onboarding from a master PPT slide

## Visual Gate (Must Pass)

Run parity and save artifacts under `/Users/rishi/Desktop/slides-tests/<layout-name>`.

Green only when:
1. QA valid
2. No severe overlap
3. PNG dimensions match
4. Reference and candidate PNG hashes match for parity cases

## Scaffold Helper

Use:

```bash
node scripts/new-layout.mjs --type <slideType>
```

This creates:
1. Builder stub
2. Fixture deckSpec
3. Visual test scaffold
4. Manual wiring checklist
