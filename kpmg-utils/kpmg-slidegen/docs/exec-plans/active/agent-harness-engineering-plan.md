# Agent Harness Engineering Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Every layout has a provable contract
Any new or modified layout is automatically checked for registry coverage, geometry contract correctness, and pagination policy integrity before merge.

### Phase 2: Pagination behavior is reliable under stress
Overflow and continuation behavior is validated at the deckSpec input/output boundary so regressions are detected without relying on manual slide inspection.

### Phase 3: Visual quality is reviewed systematically, not by spot check
Layout families are rendered in a repeatable way with consistent artifacts and baselines so review quality scales as layout count grows.

### Phase 4: E2E validation is predictable and automatable
PR, nightly, and release procedures are explicit, reproducible, and produce the same artifacts every run.

### Phase 5: CI enforces the right checks at the right speed
Fast checks block regressions early while deeper suites run on schedule, balancing throughput with confidence.

### Phase 6: Repo knowledge becomes a usable map for agents and humans
Harness intent, ownership, and coverage are documented in concise maps that are easy to navigate and keep fresh.

### Phase 7: Drift is cleaned continuously
Recurring cleanup and scoring loops keep style, reliability, and architecture from decaying as agent throughput increases.

## Testing Strategy That Scales With Layouts

Use layered gates where runtime cost grows by risk level, not by raw layout count:

1. `L0` static/contract checks: O(number of types), runs on every PR, no rendering required.
2. `L1` pagination behavior checks: O(number of pagination policies + stress fixtures), deckSpec-in/deckSpec-out.
3. `L2` visual family baselines: O(number of layout families), not one script per layout.
4. `L3` nightly full visual matrix: O(layout x density band x policy), non-blocking for daytime velocity.
5. `L4` weekly garbage collection: drift scans + auto-fix PRs for small, mechanical issues.

## Implementation Checklist

- [ ] 1.0 Contract tests (fast, deterministic)
- [ ] 1.1 Extend registry coverage test to enforce: every `layouts.json` type must have a registry entry or explicit `templateOnly` marker.
- [ ] 1.2 Extend geometry contract checks to enforce required box keys per type and fail on missing required keys.
- [ ] 1.3 Enforce pagination policy coverage: every `paginationPolicyKey` in registry exists and validates against policy schema.
- [ ] 1.4 Add a no-silent-fallback guard that fails when builders define geometry defaults for required boxes.
- [ ] 1.5 Add `npm run test:contracts:all` to aggregate registry/geometry/policy/no-fallback checks.
- [ ] 1.6 Validation for 1.0: run `test:contracts:all` and ensure it is included in PR fast gate.

- [ ] 2.0 Pagination correctness tests (deckSpec in/out)
- [ ] 2.1 Add fixture: heading + long body merge (assert no duplicates, no skips).
- [ ] 2.2 Add fixture: nested children preserved across continuation slides.
- [ ] 2.3 Add fixture: table split preserves metadata across continuation.
- [ ] 2.4 Add fixture: contents with >10 sections paginates and preserves section/page semantics.
- [ ] 2.5 Add a single pagination test runner that compares input deckSpec to paginated output structure + QA evidence.
- [ ] 2.6 Add `npm run test:pagination:all`.
- [ ] 2.7 Validation for 2.0: `test:pagination:all` passes and runs in CI PR gate.

- [ ] 3.0 Visual regression baseline for layout families
- [ ] 3.1 Add `fixtures/decks/<layout-family>.deckSpec.json` for all layout families covering current 40-layout target.
- [ ] 3.2 Add `scripts/render_fixture.sh` to render fixture decks to `artifacts/visual/<run-id>/<family>/`.
- [ ] 3.3 Emit per-family montage + per-slide PNGs and preserve QA JSON alongside images.
- [ ] 3.4 Add baseline management policy: controlled update flow and review note requirement.
- [ ] 3.5 Add `npm run test:visual:families`.
- [ ] 3.6 Validation for 3.0: family visual run is deterministic and reviewable from artifacts only.

- [ ] 4.0 E2E procedures
- [ ] 4.1 Define PR E2E procedure: contracts + pagination + changed-family visual render + artifact upload.
- [ ] 4.2 Define nightly E2E procedure: full family render + all visual suites + QA golden contract.
- [ ] 4.3 Define release E2E procedure: full run from clean environment with baseline verification.
- [ ] 4.4 Define failure triage runbook with owner, severity, and rerun policy.
- [ ] 4.5 Validation for 4.0: one dry-run PR flow and one nightly simulation completed.

- [ ] 5.0 CI rollout
- [ ] 5.1 Add CI config for PR fast gate (`contracts:all`, `pagination:all`, smoke, strict drift guards).
- [ ] 5.2 Add CI config for visual gate on changed families (or label-driven full visual run).
- [ ] 5.3 Add nightly scheduled CI for full visual matrix and QA golden checks.
- [ ] 5.4 Provision CI runner dependencies for visual runtime (Python deps + Poppler/tooling).
- [ ] 5.5 Add artifact retention policy and naming conventions for reproducibility.
- [ ] 5.6 Validation for 5.0: CI jobs produce deterministic pass/fail and accessible artifacts.

- [ ] 6.0 Documentation and maps
- [ ] 6.1 Add `docs/harness/README.md` as the harness table-of-contents.
- [ ] 6.2 Add `docs/harness/layout-family-map.md` mapping slide types -> family -> fixture -> policy.
- [ ] 6.3 Add `docs/harness/test-map.md` mapping risks -> tests -> owning scripts -> CI jobs.
- [ ] 6.4 Add `docs/harness/e2e-procedures.md` for PR/nightly/release workflows.
- [ ] 6.5 Cross-link harness docs from `AGENTS.md`, `README.md`, and workflow docs.
- [ ] 6.6 Validation for 6.0: docs are link-complete, current, and used by agents as first lookup path.

- [ ] 7.0 Drift guards and recurring garbage collection
- [ ] 7.1 Add scheduled drift scans for style/contract/pagination anti-patterns with machine-fixable suggestions.
- [ ] 7.2 Add small auto-remediation PR workflow for low-risk mechanical cleanup.
- [ ] 7.3 Add quality scorecard (`docs/harness/quality-score.md`) tracking pass rates, flakes, and drift debt.
- [ ] 7.4 Add tech debt queue entries for non-mechanical cleanup discovered by scheduled scans.
- [ ] 7.5 Validation for 7.0: first weekly cleanup cycle creates actionable, review-light PRs.

## CI Gate Design

1. PR fast gate (blocking): contracts, pagination, smoke, strict drift.
2. PR visual gate (blocking for layout-affecting changes): changed families render + baseline check.
3. Nightly full gate (non-blocking, paging on regressions): full visual suite + QA golden + coverage report.
4. Weekly maintenance gate (non-blocking): drift cleanup scans + quality score update.

## E2E Artifact Contract

Each harness run must publish:

1. Rendered `.pptx`.
2. `qa.json`.
3. Per-slide PNGs.
4. Family montage PNG.
5. Baseline/hash comparison report.
6. Command manifest (exact commands + versions) for reproducibility.

## Recommended Rollout Sequence

1. Week 1: 1.0 + 2.0 + PR fast CI.
2. Week 2: 3.0 + changed-family visual CI + baseline policy.
3. Week 3: 4.0 + 6.0 + nightly and weekly maintenance loops.

## Open Questions Before Implementation

1. Which CI platform should host the new gates if repo-native CI is introduced?
2. Should PR visual gate be changed-families-only or always run full families for the first month?
3. What is the initial timeout budget for PR fast gate vs visual gate?
