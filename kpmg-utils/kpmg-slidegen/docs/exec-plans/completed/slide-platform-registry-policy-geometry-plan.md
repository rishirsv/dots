# Slide Platform Registry + Policy + Canonical Geometry Plan

## Phase Outcomes (Non-Technical)

### Phase 0: Correctness baseline
We lock in existing bug fixes so the new architecture does not reintroduce duplicate/omitted content or metadata loss.

### Phase 1: Single source of slide truth
We introduce one central registry that lists every supported slide type, which renderer it uses, which layout boxes are required, and which pagination behavior applies.

### Phase 2: Declarative pagination behavior
We move pagination rules into a versioned policy file so continuation behavior is explicit, reviewable, and reusable across layouts.

### Phase 3: Canonical geometry contract
We normalize template geometry into canonical names and enforce geometry validity (size and bounds) so missing/malformed layout definitions fail fast.

### Phase 4: Strict contracts, practical QA
Contract violations are fatal (missing required geometry/policy/registry entries). Quality issues remain warnings and are surfaced in QA.

### Phase 5: Scale-ready contributor workflow
We add/refresh tests and docs so adding new layouts follows one repeatable path with less drift.

## Implementation Checklist

- [x] 1.0 Add central slide registry
  - [x] 1.1 Create `generator/runtime/slide-registry.js` with builder id, master variant, required geometry, policy key, validation hooks
  - [x] 1.2 Add registry coverage check against template layout types
  - [x] 1.3 Validation for 1.0 (contract tests + render smoke)

- [x] 2.0 Add declarative pagination policy
  - [x] 2.1 Add `templates/kpmg-diligence/package/pagination-policy.json`
  - [x] 2.2 Add `generator/runtime/pagination-policy.js` with schema + shape validation
  - [x] 2.3 Load policy via template package and render context
  - [x] 2.4 Validation for 2.0 (pagination regressions)

- [x] 3.0 Introduce canonical geometry schema
  - [x] 3.1 Add schema version to layout contract
  - [x] 3.2 Add normalize adapters for high-drift layouts and canonical key mapping
  - [x] 3.3 Enforce positive dimensions + in-bounds geometry validation
  - [x] 3.4 Drive required geometry keys from registry
  - [x] 3.5 Validation for 3.0 (layout contract + render-context regressions)

- [x] 4.0 Switch runtime dispatch to registry/policy
  - [x] 4.1 Update render dispatch to registry-selected builders
  - [x] 4.2 Update pagination engine to policy-driven strategy dispatch
  - [x] 4.3 Encode continuation drop/carry behavior via policy keys
  - [x] 4.4 Validation for 4.0 (deck render smoke + visual checks)

- [x] 5.0 Strengthen contract tests and docs
  - [x] 5.1 Update `scripts/test-layout-contracts.mjs` to validate runtime via registry
  - [x] 5.2 Add `scripts/test-slide-registry-policy-contracts.mjs`
  - [x] 5.3 Validation for 5.0 (all contract/regression scripts green)
