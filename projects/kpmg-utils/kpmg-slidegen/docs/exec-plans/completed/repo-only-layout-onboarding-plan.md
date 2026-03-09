---
status: completed
last-reviewed: 2026-03-07
review-cycle-days: 14
source-of-truth: accepted implementation plan in chat, repo audit of generator/runtime, scripts, fixtures, and docs
verification-state: verified-with-targeted-checks
---

# Repo-Only Layout Onboarding For Canonical Slide Types

## Why This Plan Exists

This plan adds a supported parent-repo workflow for onboarding new canonical slide layouts from source PowerPoint slides without pushing draft assets or workflow details into the portable skill bundle.

The workflow starts from a source PPTX path plus slide number, captures a reference PNG, optionally extracts a minimal XML geometry seed, scaffolds a draft layout, renders a deterministic one-slide candidate, compares candidate versus reference, supports manual or agent iteration, and promotes only approved layouts into the canonical generator and harness.

## Phase Outcomes

### Phase 1: Draft Extraction Is Reproducible

Outcome:
- A developer or agent can point at a PPTX slide and reliably get a draft workspace with source metadata, a reference PNG, and optional XML seed data.

### Phase 2: Candidate Iteration Is Tight

Outcome:
- A draft layout can be rendered repeatedly as a one-slide deterministic candidate and compared against the reference slide with machine-readable diff evidence.

### Phase 3: Promotion Is Explicit And Safe

Outcome:
- Only approved layouts enter the canonical parent-repo generator and harness, and draft/onboarding artifacts remain repo-only.

### Phase 4: Agent Batch Work Is Documented

Outcome:
- A repo-local markdown workflow explains how an agent can run extraction, render, diff, review, and promotion loops across 20-40 layouts without touching the portable skill.

## Implementation Checklist

- [x] 1.0 Create the repo-only onboarding workspace, output tree, and policy files.
  - [x] 1.1 Add the onboarding extraction/init command and reference PNG capture path using the same rasterization pipeline as candidate preview.
  - [x] 1.2 Add the minimal selected-slide XML seed extractor and normalized seed JSON output.

- [x] 2.0 Add draft registry/template overlay support for render and validation.
  - [x] 2.1 Add family-based starter scaffolds for `candidate.layout.json`, `candidate.builder.js`, and `candidate.deckSpec.json`.
  - [x] 2.2 Add deterministic compare tooling that writes `candidate.png`, `diff.png`, `diff.json`, and `scorecard.json`.
  - [x] 2.3 Add the wrapper command with `--stop-after` support for slash-agent iteration.

- [x] 3.0 Add the parent-repo promotion command.
  - [x] 3.1 Add reference-parity fixture promotion, all-layout harness coverage, and manifest updates.
  - [x] 3.2 Move canonical slide-contract/schema docs into the parent repo and retarget contract tests to the new source of truth.

- [x] 4.0 Add repo-only onboarding docs.
  - [x] 4.1 Add `docs/onboarding/README.md` for single-layout workflow and command usage.
  - [x] 4.2 Add `docs/onboarding/agent-batch-workflow.md` describing batch extraction, diff triage, manual review, and promotion rules.
  - [x] 4.3 Add repo-only onboarding prompt templates or checklists for agent review, mismatch prioritization, and promotion signoff.

- [x] 5.0 Validate the new surface with harness coverage and documentation review.

## Key Decisions

- Promoted layouts become new top-level `slide.type` values.
- Onboarding tooling is repo-only and lives under `scripts/onboarding/`.
- Public generator CLI behavior remains unchanged for normal users.
- A draft layout must choose a base family before candidate rendering.
- Reference PNG is the visual source of truth; XML seed data is advisory only.
- Portable-skill sync and isolated skill verification are explicitly out of scope for this plan.

## Verification Targets

- Unit-test source-slide resolution, XML seed normalization, and diff metric calculation.
- Integration-test `init-layout`, `render-candidate`, and `compare-candidate` on at least one known PPTX reference in `references/`.
- Add promotion-path tests that prove registry/template/schema parity and fixture-manifest integrity after a promoted layout lands.
- Run parent-repo checks after promotion at minimum: `npm run test:contracts`, `npm run test:fixtures`, `npm run test:render`, and `npm run test:visual` when the local slides runtime is available.
- Add one end-to-end onboarding smoke path that proves `init -> render -> compare` produces the expected files under `outputs/onboarding/<layout-id>/`.

## Final Verification Results

Completed on 2026-03-07:

- Added repo-only onboarding workspace, scripts, policy files, and smoke coverage.
- Added runtime overlay support so onboarding scripts can inject draft template/registry entries without changing the public generator CLI.
- Added parent-repo reference docs under `references/` and retargeted contract tests to the new canonical schema path.
- Added repo-only onboarding docs for single-layout and batch agent workflows.
- Synced the shared generator mirror into `skills/kpmg-slides/assets/slidegen/` and fixed the skill smoke runner path resolution so existing distribution checks still pass without syncing onboarding artifacts into the skill.
- Ran `npm run -s test:contracts`.
- Ran `npm run -s test:onboarding`.
- Ran `npm run -s test:fixtures`.
- Ran `npm run -s test:render`.
- Ran `npm run -s test:visual`.
- Ran `npm run -s test:dist`.
- Ran `npm run -s test:pr`.
