# Onboard Layout

This document is the source of truth for the onboarding lifecycle.

## Case Lifecycle

Every layout onboarding run operates on:
- `onboarding/cases/<case-id>/`
- `outputs/onboarding/<case-id>/`

The supported lifecycle is:
1. `onboard:extract`
2. `onboard:classify`
3. `onboard:scaffold`
4. `onboard:render`
5. `onboard:compare`
6. `onboard:promote`

The end-to-end wrapper is:
- `onboard:run`

## Commands

Extract source evidence:

```bash
npm run onboard:extract -- \
  --case-id coffee-business-overview \
  --source-pptx references/coffee_fdd.pptx \
  --slide 1 \
  --layout-id coffeeBusinessOverview
```

Classify against existing primitives:

```bash
npm run onboard:classify -- \
  --case-id coffee-business-overview
```

Classification only auto-recommends a primitive when the top candidate is above the acceptance threshold and not tied. If `classify.json` sets `requiresManualSelection: true`, choose a primitive explicitly with `--primitive-ref` before scaffolding an existing primitive, or pass `--base-primitive-ref` when extending into a new primitive.

Choose one scaffold mode:

1. Existing primitive reuse

```bash
npm run onboard:scaffold -- \
  --case-id coffee-business-overview \
  --primitive-ref businessOverview@1
```

2. Extend an existing primitive into a new primitive

```bash
npm run onboard:scaffold -- \
  --case-id coffee-business-overview \
  --new-primitive-id businessOverviewAlt \
  --base-primitive-ref businessOverview@1
```

3. New primitive from the classified closest match

```bash
npm run onboard:scaffold -- \
  --case-id coffee-business-overview \
  --new-primitive-id businessOverviewAlt
```

Render:

```bash
npm run onboard:render -- \
  --case-id coffee-business-overview
```

Compare:

```bash
npm run onboard:compare -- \
  --case-id coffee-business-overview
```

Promote:

```bash
npm run onboard:promote -- \
  --case-id coffee-business-overview \
  --approved-by "Your Name" \
  --approval-notes "Residual differences reviewed and accepted."
```

Manual override for a deterministic compare failure:

```bash
npm run onboard:promote -- \
  --case-id coffee-business-overview \
  --approved-by "Your Name" \
  --approval-notes "Approved with documented cosmetic exceptions." \
  --manual-disposition accepted \
  --approved-exception "Header anti-aliasing drift outside core content region" \
  --approved-exception "Minor footer baseline shift within acceptable tolerance"
```

Regenerate aggregates:

```bash
npm run onboard:regen
```

Check only the changed layout/primitive surface:

```bash
npm run onboard:test-changed
```

## Case Files

Expected manual case files:
- `onboarding/cases/<case-id>/intake.json`
- `onboarding/cases/<case-id>/extract.raw.json`
- `onboarding/cases/<case-id>/extract.normalized.json`
- `onboarding/cases/<case-id>/fingerprint.json`
- `onboarding/cases/<case-id>/classify.json`
- `onboarding/cases/<case-id>/candidate.layout.json`
- `onboarding/cases/<case-id>/candidate.deckSpec.json`
- `onboarding/cases/<case-id>/review.md`

Optional case files for a new primitive:
- `onboarding/cases/<case-id>/candidate.primitive.json`
- `onboarding/cases/<case-id>/candidate.builder.js`

Expected generated case outputs:
- `outputs/onboarding/<case-id>/candidate/deck.pptx`
- `outputs/onboarding/<case-id>/candidate/qa.json`
- `outputs/onboarding/<case-id>/candidate/preview/slide-1.png`
- `outputs/onboarding/<case-id>/compare/reference.png`
- `outputs/onboarding/<case-id>/compare/candidate.png`
- `outputs/onboarding/<case-id>/compare/diff.png`
- `outputs/onboarding/<case-id>/compare/diff.json`
- `outputs/onboarding/<case-id>/compare/scorecard.json`

## Scaffold Rules

When onboarding uses an existing primitive:
- create `candidate.layout.json`
- create `candidate.deckSpec.json`
- do not create `candidate.builder.js`
- do not create `candidate.primitive.json`

When onboarding creates a new primitive:
- create `candidate.layout.json`
- create `candidate.deckSpec.json`
- create `candidate.primitive.json`
- create `candidate.builder.js`

## Render Model

Rendering keeps the draft overlay approach:
- overlay the candidate layout into the in-memory template package
- override the registry entry in memory for the candidate type
- use the primitive builder directly for existing primitives
- use the candidate draft builder only for new primitives

## Operator Decision

Pick one of these before scaffold:
- existing primitive: use `--primitive-ref`
- extend existing primitive: use `--new-primitive-id` and `--base-primitive-ref`
- new primitive: use `--new-primitive-id` only and let scaffold start from the classified closest primitive

Manual primitive selection is required when classification records:
- `recommendedPrimitiveRef: null`
- `requiresManualSelection: true`
- a `manualSelectionReason` such as `zero-score`, `below-threshold`, or `ambiguous-tie`

The public generator CLI remains unchanged:

```bash
node generator/index.js \
  --in presets/authoring/detailed.deckSpec.json \
  --out-dir outputs/my-run \
  --qa-out outputs/my-run/qa.json
```

## Promotion Gates

Promotion is allowed only when:
- extraction evidence exists
- classification exists
- scaffold files exist
- case status is `compared`
- `candidate.layout.json` exists
- `candidate/preview/slide-1.png` exists
- `candidate/qa.json` exists and has zero blocking checks
- `compare/diff.json` exists
- `compare/scorecard.json` exists and resolves to one of:
- deterministic pass
- deterministic fail plus `manualDisposition: accepted` with at least one recorded `approvedExceptions` entry
- `manualDisposition: rejected` or `needs-follow-up` blocks promotion explicitly
- source fragments can be written to `templates-src/`
- `npm run onboard:regen` succeeds
- `npm run onboard:verify-generated` succeeds

Promotion fails closed with an explicit error naming the missing lifecycle artifact when one of those required files is absent.

## Skill Boundary

No onboarding artifacts may be synced into:
- `skills/kpmg-slides/`

Case files, output evidence, and repo-only authoring fragments stay outside the portable skill bundle.
