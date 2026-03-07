# Repo-Only Layout Onboarding

Use this workflow when you want to turn a slide from a source PowerPoint into a new canonical layout in the parent repo.

This workflow is repo-only by design:
- Keep source PPTX files, seeds, prompts, and diff artifacts in this repo only.
- Do not sync draft onboarding assets into `skills/kpmg-slides/`.
- Only promote a layout after deterministic checks pass and you explicitly approve it.

## Workspace Model

Stable draft files live under:

```text
onboarding/layouts/<layout-id>/
```

Generated artifacts live under:

```text
outputs/onboarding/<layout-id>/
```

Expected artifact shape:

```text
outputs/onboarding/<layout-id>/
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

Initialize a draft workspace and capture the reference slide:

```bash
node scripts/onboarding/init-layout.mjs \
  --source-pptx references/coffee_fdd.pptx \
  --slide 1 \
  --layout-id coffeeBusinessOverview \
  --family businessOverview \
  --extract-seed
```

Render a deterministic one-slide candidate:

```bash
node scripts/onboarding/render-candidate.mjs \
  --layout-id coffeeBusinessOverview
```

Compare candidate vs reference:

```bash
node scripts/onboarding/compare-candidate.mjs \
  --layout-id coffeeBusinessOverview
```

Run the end-to-end draft loop:

```bash
node scripts/onboarding/run-layout-onboarding.mjs \
  --source-pptx references/coffee_fdd.pptx \
  --slide 1 \
  --layout-id coffeeBusinessOverview \
  --family businessOverview \
  --extract-seed
```

Stop after a specific stage for manual or agent iteration:

```bash
node scripts/onboarding/run-layout-onboarding.mjs \
  --source-pptx references/coffee_fdd.pptx \
  --slide 1 \
  --layout-id coffeeBusinessOverview \
  --family businessOverview \
  --extract-seed \
  --stop-after init
```

Promote after approval:

```bash
node scripts/onboarding/promote-layout.mjs \
  --layout-id coffeeBusinessOverview \
  --approved-by "Your Name" \
  --approval-notes "Residual visual differences reviewed and accepted."
```

## Deterministic Blocking Gates

Promotion requires all of these:

1. Draft scaffold files exist.
2. `compare/reference.png` exists.
3. Candidate render succeeds.
4. `candidate/qa.json` exists and has zero blocking checks.
5. Visual overflow is acceptable for the candidate run.
6. Reference and candidate image dimensions match.
7. `compare/scorecard.json` exists and its `pass` flag is `true`.

## Non-Blocking Agent Tasks

Agents can help with:

1. Suggesting the closest family before render.
2. Using `seed/geometry.seed.json` to tighten geometry.
3. Prioritizing the most meaningful mismatches from `diff.json`.
4. Recommending whether the remaining visual delta is cosmetic enough to promote.

These are advisory only. No blocking command depends on an LLM result.

## Promotion Effects

Promotion updates the parent repo only:

1. Copies the candidate builder into `generator/builders/onboarded/`.
2. Adds the canonical type to the generated onboarded registry.
3. Adds the layout contract to `templates/kpmg-diligence/package/layouts.json`.
4. Adds reference-parity fixture coverage and updates the fixture manifest.
5. Adds the type to the canonical all-layouts fixture.
6. Updates parent-repo reference docs and schema.

Portable skill sync is intentionally not part of this workflow.
