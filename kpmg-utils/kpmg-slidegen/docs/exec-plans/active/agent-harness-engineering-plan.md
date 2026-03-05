# Agent Harness Engineering Plan

## Phase Outcomes (Non-Technical)

### Phase 0: First impressions are trustworthy
Core entrypoints, docs, and repo hygiene are accurate and runnable so external reviewers immediately see a disciplined, production-minded project.

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

### Phase 8: Legacy noise is retired
Outdated, duplicate, or manual-only test paths are removed or archived so the harness stays fast, legible, and credible.

### Phase 9: Executive/leadership review package is presentation-ready
The repo includes a crisp “what this is, how quality is enforced, and how to reproduce” narrative with auditable evidence artifacts.

## Testing Strategy That Scales With Layouts

Use layered gates where runtime cost grows by risk level, not by raw layout count:

1. `L0` static/contract checks: O(number of types), runs on every PR, no rendering required.
2. `L1` pagination behavior checks: O(number of pagination policies + stress fixtures), deckSpec-in/deckSpec-out.
3. `L2` visual family baselines: O(number of layout families), not one script per layout.
4. `L3` nightly full visual matrix: O(layout x density band x policy), non-blocking for daytime velocity.
5. `L4` weekly garbage collection: drift scans + auto-fix PRs for small, mechanical issues.

## Implementation Checklist

- [ ] 0.0 Repo polish baseline (pre-harness cleanup)
- [ ] 0.1 Fix broken primary entrypoints (`npm run generate`, `npm run generate:layouts`) to use existing fixtures.
- [ ] 0.2 Replace stale README file map and command references with current repo reality.
- [ ] 0.3 Add minimal CI skeleton (PR + nightly workflow files) so quality gates are visible and enforceable.
- [ ] 0.4 Apply artifact hygiene rules (`outputs`, temp folders, lock files) and tighten `.gitignore`.
- [ ] 0.5 Reduce `TODOS.md` to active, non-duplicative items only.
- [ ] 0.6 Validation for 0.0: clean-clone quick start succeeds and docs commands are copy/paste runnable.

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
- [ ] 3.1 Add `fixtures/decks/<layout-family>.deckSpec.json` for all registered layout families (currently 14 types) with scaling path to 40+ layouts.
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

- [ ] 8.0 Legacy test and script garbage collection
- [ ] 8.1 Remove duplicate npm aliases (for example duplicate `skill:smoke`-equivalent entries).
- [ ] 8.2 Decide and execute `remove | wire-in | archive` for orphan scripts (for example hardcoded-layout guard script).
- [ ] 8.3 Deprecate superseded drift scripts once `theme` drift guard fully replaces legacy AST drift checks.
- [ ] 8.4 Reclassify manual-signoff visual suites out of automated blocking aggregate runs unless made deterministic.
- [ ] 8.5 Consolidate near-duplicate visual scripts and tiny per-feature baselines into family-level harness where possible.
- [ ] 8.6 Archive or rewrite non-portable/manual-only testing scripts that depend on local machine paths or external hidden dirs.
- [ ] 8.7 Validation for 8.0: reduced script surface, no dead npm entries, and no manual-only checks in blocking CI gates.

- [ ] 9.0 Executive readiness package
- [ ] 9.1 Add `docs/harness/executive-quality-brief.md` (quality model, test lanes, governance, risk controls).
- [ ] 9.2 Add reproducibility appendix with exact commands and expected artifact structure.
- [ ] 9.3 Add one “evidence bundle” sample from a full nightly run (artifacts index + pass/fail summary).
- [ ] 9.4 Add concise architecture and quality maps for leadership readers (1-page each).
- [ ] 9.5 Validation for 9.0: reviewer can understand system quality posture in <15 minutes from docs alone.

## CI Gate Design

1. PR fast gate (blocking): contracts, pagination, smoke, strict drift.
2. PR visual gate (blocking for layout-affecting changes): changed families render + baseline check.
3. Nightly full gate (non-blocking, paging on regressions): full visual suite + QA golden + coverage report.
4. Weekly maintenance gate (non-blocking): drift cleanup scans + quality score update.

## E2E Procedures (Detailed)

### PR E2E (blocking, fast lane)

Purpose: catch regressions early with predictable runtime.

1. Run fast contracts/policy/geometry gate.
2. Run pagination deckSpec in/out gate.
3. Run smoke + strict drift guards.
4. Detect changed layout families from diff and run family visuals only for impacted families.
5. Always run theme E2E visual baseline gate.
6. Upload artifacts (`.pptx`, `qa.json`, PNGs, montage, hash report, command manifest).

Target command shape:

1. `npm run -s test:contracts:all`
2. `npm run -s test:pagination:all`
3. `npm run -s qa`
4. `npm run -s test:visual:theme-e2e`
5. `npm run -s test:visual:families -- --changed-only`

### Nightly E2E (full confidence sweep)

Purpose: comprehensive quality signal without blocking daytime PR throughput.

1. Run full contract + pagination suites.
2. Run QA golden fixture contract.
3. Run full visual family matrix and existing visual aggregate suites.
4. Publish coverage summary (types, families, pagination policies, baseline checks).
5. Open/append quality scorecard with pass rate and flake trends.

Target command shape:

1. `npm run -s test:contracts:all`
2. `npm run -s test:pagination:all`
3. `npm run -s test:qa:golden`
4. `npm run -s test:visual:families`
5. `npm run -s test:visual:all`

### Release E2E (clean-room gate)

Purpose: prove release candidate from a clean environment is reproducible and stable.

1. Run in a fresh clone/container with pinned Node/Python/tool versions.
2. Execute nightly scope end-to-end.
3. Re-run baseline verification without update flags.
4. Produce signed artifact manifest and release quality summary.
5. Block release on any contract/pagination/visual mismatch.

## E2E Artifact Contract

Each harness run must publish:

1. Rendered `.pptx`.
2. `qa.json`.
3. Per-slide PNGs.
4. Family montage PNG.
5. Baseline/hash comparison report.
6. Command manifest (exact commands + versions) for reproducibility.

## Recommended Rollout Sequence

1. Week 0: 0.0 polish baseline (fix broken entrypoints/docs, add minimal CI skeleton).
2. Week 1: 1.0 + 2.0 + PR fast CI.
3. Week 2: 3.0 + changed-family visual CI + baseline policy.
4. Week 3: 4.0 + 6.0 + nightly and weekly maintenance loops.
5. Week 4: 8.0 + 9.0 legacy cleanup and executive package.

## Open Questions Before Implementation

1. Which CI platform should host the new gates if repo-native CI is introduced?
2. Should PR visual gate be changed-families-only or always run full families for the first month?
3. What is the initial timeout budget for PR fast gate vs visual gate?
