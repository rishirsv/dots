# Repo-Only Layout Onboarding

Use this workflow when you want to turn a slide from a source PowerPoint into a new canonical layout in the parent repo.

This workflow is repo-only by design:
- Keep source PPTX files, seeds, prompts, and diff artifacts in this repo only.
- Do not sync draft onboarding assets into `skills/kpmg-slides/`.
- Only promote a layout after the compare scorecard either passes deterministically or is manually accepted with recorded exceptions.

## Workspace Model

Stable draft files live under:

```text
onboarding/cases/<case-id>/
  intake.json
  extract.raw.json
  extract.normalized.json
  fingerprint.json
  classify.json
  candidate.layout.json
  candidate.deckSpec.json
  candidate.primitive.json
  candidate.builder.js
  review.md
```

Generated artifacts live under:

```text
outputs/onboarding/<case-id>/
```

Expected artifact shape:

```text
outputs/onboarding/<case-id>/
  candidate/
    deck.pptx
    qa.json
    preview/slide-1.png
    montage.png
  compare/
    reference.png
    candidate.png
    diff.png
    diff.json
    scorecard.json
```

## Core Commands

Extract a case and capture the reference slide:

```bash
node scripts/onboarding/extract-case.mjs \
  --case-id coffee-business-overview \
  --source-pptx references/coffee_fdd.pptx \
  --slide 1 \
  --layout-id coffeeBusinessOverview
```

Classify the case against existing primitives:

```bash
node scripts/onboarding/classify-case.mjs \
  --case-id coffee-business-overview
```

If classification does not produce an accepted recommendation, `classify.json` will set `recommendedPrimitiveRef` to `null` and `requiresManualSelection` to `true`. In that case, pass `--primitive-ref` for existing primitive reuse or `--base-primitive-ref` for a new primitive scaffold.

Pick one scaffold decision:

1. Existing primitive reuse: `--primitive-ref`
2. Extend an existing primitive: `--new-primitive-id` plus `--base-primitive-ref`
3. New primitive from the classified closest match: `--new-primitive-id`

Scaffold against an existing primitive:

```bash
node scripts/onboarding/scaffold-case.mjs \
  --case-id coffee-business-overview \
  --primitive-ref businessOverview@1
```

Extend an existing primitive into a new primitive:

```bash
node scripts/onboarding/scaffold-case.mjs \
  --case-id coffee-business-overview \
  --new-primitive-id businessOverviewAlt \
  --base-primitive-ref businessOverview@1
```

Start a new primitive scaffold from the classified closest primitive:

```bash
node scripts/onboarding/scaffold-case.mjs \
  --case-id coffee-business-overview \
  --new-primitive-id businessOverviewAlt
```

Render a deterministic one-slide candidate:

```bash
node scripts/onboarding/render-candidate.mjs \
  --case-id coffee-business-overview
```

Compare candidate vs reference:

```bash
node scripts/onboarding/compare-candidate.mjs \
  --case-id coffee-business-overview
```

Run the end-to-end draft loop:

```bash
node scripts/onboarding/run-layout-onboarding.mjs \
  --case-id coffee-business-overview \
  --source-pptx references/coffee_fdd.pptx \
  --slide 1 \
  --layout-id coffeeBusinessOverview \
  --primitive-ref businessOverview@1
```

Stop after a specific stage for manual or agent iteration:

```bash
node scripts/onboarding/run-layout-onboarding.mjs \
  --case-id coffee-business-overview \
  --source-pptx references/coffee_fdd.pptx \
  --slide 1 \
  --layout-id coffeeBusinessOverview \
  --primitive-ref businessOverview@1 \
  --stop-after classify
```

Promote after approval:

```bash
node scripts/onboarding/promote-layout.mjs \
  --case-id coffee-business-overview \
  --approved-by "Your Name" \
  --approval-notes "Residual visual differences reviewed and accepted."
```

Manual approval override for a deterministic compare failure:

```bash
node scripts/onboarding/promote-layout.mjs \
  --case-id coffee-business-overview \
  --approved-by "Your Name" \
  --approval-notes "Approved with cosmetic differences recorded." \
  --manual-disposition accepted \
  --approved-exception "Minor header anti-aliasing drift" \
  --approved-exception "Footer alignment shift outside decision-useful content"
```

## Deterministic Blocking Gates

Promotion requires all of these:

1. Case evidence and scaffold files exist.
2. `compare/reference.png` exists.
3. Candidate render succeeds.
4. `candidate/qa.json` exists and has zero blocking checks.
5. Visual overflow is acceptable for the candidate run.
6. Reference and candidate image dimensions match.
7. `compare/scorecard.json` exists and resolves to a promotable state:
   deterministic pass, or deterministic fail with `manualDisposition: accepted` plus recorded `approvedExceptions`.

## Non-Blocking Agent Tasks

Agents can help with:

1. Suggesting the closest primitive before scaffold.
2. Using `extract.normalized.json` and `fingerprint.json` to tighten geometry.
3. Prioritizing the most meaningful mismatches from `diff.json`.
4. Recommending whether the remaining visual delta is cosmetic enough to promote.

These are advisory only. No blocking command depends on an LLM result.

## Promotion Effects

Promotion updates the parent repo only:

1. Writes layout source fragments into `templates-src/kpmg-diligence/layouts/`.
2. Writes primitive source fragments into `templates-src/kpmg-diligence/primitives/` when the case creates a new primitive.
3. Writes primitive builder code only when the case creates a new primitive.
4. Regenerates the current runtime aggregate files.

Portable skill sync is intentionally not part of this workflow.
