# Agent Review Checklists

Use these repo-only checklists when an agent is helping with layout onboarding.

## Geometry Review Prompt

Ask the agent to inspect:

1. `onboarding/layouts/<layout-id>/source.json`
2. `onboarding/layouts/<layout-id>/extract.normalized.json`
3. `onboarding/layouts/<layout-id>/fingerprint.json`
4. `onboarding/layouts/<layout-id>/seed/geometry.seed.json`
3. `onboarding/layouts/<layout-id>/candidate.layout.json`
4. `outputs/onboarding/<layout-id>/compare/reference.png`

Ask for:

1. The best-fit existing family, if not already chosen.
2. The minimum geometry edits needed to align the draft with the reference.
3. Any boxes that should stay anchored to the family defaults instead of the seed.

## Diff Prioritization Prompt

Ask the agent to inspect:

1. `outputs/onboarding/<layout-id>/compare/reference.png`
2. `outputs/onboarding/<layout-id>/compare/candidate.png`
3. `outputs/onboarding/<layout-id>/compare/diff.png`
4. `outputs/onboarding/<layout-id>/compare/diff.json`
5. `outputs/onboarding/<layout-id>/compare/scorecard.json`

Ask for:

1. The top 3 highest-signal visual mismatches.
2. Which mismatches are structural versus cosmetic.
3. The smallest edit sequence most likely to move the scorecard toward pass.

## Promotion Signoff Prompt

Ask the agent to inspect:

1. `outputs/onboarding/<layout-id>/candidate/qa.json`
2. `outputs/onboarding/<layout-id>/compare/scorecard.json`
3. `outputs/onboarding/<layout-id>/compare/reference.png`
4. `outputs/onboarding/<layout-id>/compare/candidate.png`
5. `onboarding/layouts/<layout-id>/candidate.layout.json`
6. `onboarding/layouts/<layout-id>/candidate.builder.js`

Ask for:

1. Confirmation that deterministic gates are satisfied.
2. A concise judgment on whether the residual visual delta is cosmetic enough.
3. Any risks that should block promotion.

## Default Review Order

Always review in this order:

1. Deterministic blockers first.
2. Geometry mismatch hotspots second.
3. Cosmetic polish last.
