# Agent Batch Workflow

Use this workflow when you want an agent to onboard 20-40 candidate layouts in the parent repo without touching the portable skill bundle.

## Batch Shape

Each layout should move through the same repo-only stages:

1. `init`: create the draft workspace, capture `reference.png`, and emit `intake.json`, `extract.raw.json`, `extract.normalized.json`, `fingerprint.json`, and the compatibility `seed/geometry.seed.json`.
2. `render`: build a deterministic one-slide candidate and collect `qa.json` plus preview PNG.
3. `compare`: produce `candidate.png`, `diff.png`, `diff.json`, and `scorecard.json`.
4. `review`: inspect deterministic failures first, then use an agent for visual triage and prioritization.
5. `promote`: only after explicit approval metadata is present and the compare scorecard is promotable.

## Recommended Agent Loop

For each source slide:

1. Run `run-layout-onboarding.mjs --stop-after init` with a chosen `layout-id`.
2. Ask the agent to inspect `source.json`, `intake.json`, `extract.raw.json`, `extract.normalized.json`, `fingerprint.json`, `candidate.layout.json`, `candidate.builder.js`, `candidate.deckSpec.json`, and `seed/geometry.seed.json`.
3. Let the agent tighten geometry and candidate content until `render-candidate.mjs` succeeds with zero blocking QA.
4. Run `compare-candidate.mjs`.
5. Ask the agent to summarize the top visual mismatches using `diff.json`, `scorecard.json`, `reference.png`, `candidate.png`, and `diff.png`.
6. Repeat until the scorecard either passes deterministically or a human is prepared to approve the remaining differences with recorded exceptions.
7. Human owner decides whether to run `promote-layout.mjs`.

## Deterministic Stop Rules

Stop the iteration and fix the draft before any promotion discussion when:

1. `reference.png` is missing.
2. Candidate render fails.
3. `qa.json` contains blocking checks.
4. Visual overflow is failing.
5. Reference and candidate dimensions do not match.
6. `scorecard.json` is missing.
7. `scorecard.json` is deterministically failing and no approved exception path has been recorded.

## Repo-Only Boundaries

Keep these out of the portable skill entirely:

1. Source PPTX files.
2. Draft onboarding fixtures.
3. Extraction evidence.
4. Diff artifacts.
5. Onboarding scripts.
6. Agent prompts and review checklists.
7. Large reference corpora.
8. CI or harness governance docs for onboarding.

## Useful Execution Pattern

Use one workspace row per layout:

```text
layout-id | source-pptx | slide | family | init | render | compare | review | promote
```

Agents work best when each row has:

1. A fixed `layout-id`.
2. A chosen base family.
3. One owner who can approve promotion.
4. Clear evidence paths under `outputs/onboarding/<layout-id>/compare/`.

## Human Approval Gate

Only a human should decide:

1. Whether remaining differences are cosmetic enough.
2. Whether the layout belongs in the canonical generator.
3. When to run `promote-layout.mjs`.
4. When a later skill sync should copy the promoted type into the portable bundle.
