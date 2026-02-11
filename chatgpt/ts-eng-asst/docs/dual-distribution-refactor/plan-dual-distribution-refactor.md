# Dual-Distribution Refactor Plan (Items 1-6 + Finalization)

## Goal
Create a clean two-distribution architecture for generation and scope assembly:

1. **ChatGPT Upload Distribution (`dist/`)**
   - Minimal, compact runtime artifacts only.
   - No internal-only helper workflows.
   - Optimized for upload + execution in ChatGPT.

2. **Internal Testing Distribution (repo runtime)**
   - Richer testing/debug workflows and harness scripts.
   - Used for validation, parity checks, and QA.

The two distributions will share one scope-building core, while keeping separate entrypoints and behavior boundaries.

---

## What Was Missing (Now Added)

The previous plan was strong but missed these decision-complete details:

- Explicit two-distribution contract and file ownership boundaries.
- Compactness guardrails for ChatGPT `dist` so it does not absorb internal tooling logic.
- Formal parity test strategy between internal and ChatGPT entrypoints.
- Explicit migration path to stop internal scripts from loading `dist/el-generate.py` directly.
- Separate artifact manifests and validation gates for internal-testing vs ChatGPT-upload distributions.
- Distribution-specific regression matrix and acceptance criteria.
- Dist artifact manifest verification as a gate.
- Optional-scope user-flow contract checks (including ad hoc optional scope fallback behavior).
- Documentation update checklist across root + scope-library architecture docs.
- Rollback and checkpoint strategy tied to phased commits.

---

## Non-Technical Phase Summary

- **Phase 0** locks a safe restore point and captures baseline behavior.
- **Phase 1** centralizes shared logic so rules stop drifting.
- **Phase 2** separates user-facing ChatGPT runtime from internal testing runtime.
- **Phase 3** automates optional-scope docs so review output always matches source JSON.
- **Phase 4** adds robust tests for both distributions and parity checks.
- **Phase 5** updates documentation so future contributors follow the same architecture.
- **Phase 6** finalizes optional-scope runtime behavior and prompt contract checks within limits.

---

## Scope (Items 1-6 + Finalization)

### 1) Unify duplicated scope-building logic
Extract duplicated assembly logic into one shared module consumed by runtime and export/validation scripts.

### 2) Break large renderer function into smaller units
Refactor the large replacement function into testable sub-steps while preserving behavior.

### 3) Centralize scope-selection parsing
Create one normalization/parser for exclusions + optional additions + ad hoc optional sections.

### 4) Auto-generate optional markdown from optional JSON
Generate markdown review file from `dist/scope-library-optional.json` to remove manual drift risk.

### 5) Consolidate companion config loaders
Unify repeated loader patterns (`scope-review-buckets`, `section-applicability`, optional library).

### 6) Introduce explicit scope merge pipeline
Formal pipeline sequence:
- base scope
- applicability transforms
- optional merges
- exclusions
- ordering
- render

---

## Distribution Contracts

## A. ChatGPT Upload Distribution (`dist/`)

**Must include only essentials:**

- `dist/el-generate.py` (compact entrypoint)
- `dist/_scope_core.py` (shared core if needed at runtime)
- `dist/ts-engagement-assistant.md`
- `dist/assistant-playbook.md`
- `dist/el-placeholder-schema.json`
- `dist/scope-library.json`
- `dist/scope-review-buckets.json`
- `dist/section-applicability.json`
- `dist/scope-library-optional.json`
- template `.docx` files
- GPT icon (if used)

**Must not include:** internal demo generators, large review scripts, non-runtime harness files.

## B. Internal Testing Distribution

**Owns:**

- test harness scripts (`scripts/test-scope-replacement.py`, `scripts/generate-demo-letter.py`, new parity tests)
- internal generator entrypoint/module used by local scripts and CI checks
- export/validation scripts
- generated review artifacts under non-dist paths
- enhanced diagnostics outputs for QA

---

## API / Interface Decisions

## Stable `scope_selection` payload

```json
{
  "excluded_section_keys": ["working_capital"],
  "excluded_top_level_ids": ["scope.123"],
  "optional_section_keys": ["spa_analysis", "arr_drivers"],
  "ad_hoc_optional_sections": {
    "quality_of_earnings": [
      {"text": "Assess one-time normalization effects from major systems transitions, where applicable."}
    ]
  }
}
```

- `excluded_top_level_ids` remains back-compat.
- Unknown optional keys are non-fatal and logged in summary.
- Exclusions take precedence over optionals.

---

## Implementation Task List

- [ ] 1.0 **Checkpoint + baseline**
  - [ ] 1.1 Create checkpoint commit before refactor begins (deferred in this run).
  - [x] 1.2 Capture baseline command outputs for comparison.
  - [x] 1.3 Validate current dist manifest and runtime checks.
  - [x] 1.4 Capture baseline dependency map of scripts that currently load `dist/el-generate.py`.

- [x] 2.0 **Shared scope core extraction**
  - [x] 2.1 Create shared core module for applicability/optional/order pipeline.
  - [x] 2.2 Move duplicate logic from runtime/export validators into shared core.
  - [x] 2.3 Keep behavior parity with current output.
  - [x] 2.4 Validation for 2.0: run export + validation scripts and compare results.

- [x] 3.0 **Two entrypoints and compact ChatGPT runtime**
  - [x] 3.1 Keep `dist/el-generate.py` compact orchestration-only.
  - [x] 3.2 Introduce internal testing entrypoint (script/module-level) for richer diagnostics.
  - [x] 3.3 Migrate internal scripts to the internal entrypoint (remove direct dist module loading in local tests).
  - [x] 3.4 Add guard test that fails if internal scripts reintroduce direct dist loading.
  - [x] 3.5 Validation for 3.0: smoke generate via both entrypoints.

- [x] 4.0 **Renderer decomposition + selection parser**
  - [x] 4.1 Split monolithic scope replacement function into bounded helpers.
  - [x] 4.2 Add centralized parser/normalizer for scope selection.
  - [x] 4.3 Keep section ordering robust when sections are missing/deleted.
  - [x] 4.4 Validation for 4.0: semantic output parity tests for representative industries.

- [x] 5.0 **Optional docs automation**
  - [x] 5.1 Add script to generate optional markdown from optional JSON.
  - [x] 5.2 Add metadata/count checks for optional catalog consistency.
  - [x] 5.3 Add include/exclude rationale fields so optional review output is decision-ready.
  - [x] 5.4 Validation for 5.0: regenerate and verify no drift.

- [x] 6.0 **Regression matrix (internal + dist)**
  - [x] 6.1 Add tests for shared core pure functions.
  - [x] 6.2 Add internal distribution regression suite.
  - [x] 6.3 Add dist runtime smoke + prompt contract checks.
  - [x] 6.4 Add cross-distribution parity checks (same inputs, same semantic scope results).
  - [x] 6.5 Add distribution manifest checks:
    - internal-testing manifest
    - ChatGPT-upload manifest (runtime essentials only)
  - [x] 6.6 Validation for 6.0: all matrix checks green.

- [x] 7.0 **Documentation updates project-wide**
  - [x] 7.1 Update `README.md` with dual-distribution model and commands.
  - [x] 7.2 Update `AGENTS.md` boundaries and dist hygiene rules.
  - [x] 7.3 Update `ARCHITECTURE.md` with two-entrypoint architecture.
  - [x] 7.4 Update `docs/scope-library/ARCHITECTURE.md` for pipeline and ownership.
  - [x] 7.5 Add distribution regression matrix doc.
  - [x] 7.6 Document optional-scope user flow (default baseline scope + follow-up optional add-ons).
  - [x] 7.7 Validation for 7.0: docs align with implemented paths/commands.

- [x] 8.0 **Optional-scope runtime and prompt finalization**
  - [x] 8.1 Add runtime behavior: if requested optional scope key is missing, generate ad hoc optional scope in house style.
  - [x] 8.2 Update system prompt to proactively offer optional scope add-ons after baseline scope decisions.
  - [x] 8.3 Keep prompt under 8000 characters and verify with contract script.
  - [x] 8.4 Validation for 8.0: prompt contract passes and optional flow works in sample runs.

- [x] 9.0 **Manual acceptance outputs**
  - [x] 9.1 Generate 3-5 sample documents across different industries using updated flow.
  - [x] 9.2 Confirm section ordering and optional behavior in each sample.
  - [x] 9.3 Validation for 9.0: review checklist complete with no critical regressions.

---

## Regression Test Matrix

## Internal Testing Distribution

1. `python3 scripts/export-scope-library.py --with-skeleton`
2. `python3 scripts/validate-scope-exports.py`
3. `python3 scripts/validate-scope-review-buckets.py`
4. `python3 scripts/refresh-scope-metadata.py --check`
5. `python3 scripts/test-scope-replacement.py --industry aerospace`
6. `python3 scripts/test-scope-replacement.py --industry banking`
7. `python3 scripts/test-scope-replacement.py --industry healthcare`
8. `python3 scripts/generate-demo-letter.py --industry generic --mode buyside --output /tmp/internal-generic.docx`
9. Guard check for no internal direct dist loading:
   - `rg -n "dist/el-generate.py|spec_from_file_location\\(\"el_generate\"" scripts`

## ChatGPT Upload Distribution (`dist/`)

1. `python3 scripts/check-system-prompt-contract.py --prompt dist/ts-engagement-assistant.md --max-chars 8000`
2. `python3 -m py_compile dist/el-generate.py`
3. `python3 -m py_compile dist/_scope_core.py` (after extraction)
4. Dist smoke generation across 3-5 industries using compact entrypoint
5. Verify no unresolved placeholders in generated documents
6. Verify ChatGPT dist manifest includes only approved runtime-essential files

## Cross-Distribution Parity

For same template + industry + variables + `scope_selection`:

- Compare section key order
- Compare section count
- Compare top-level bullet count
- Compare optional section application summary
- Compare exclusion precedence over optional additions

---

## Acceptance Criteria

- Shared scope logic has one source of truth.
- ChatGPT dist remains compact and runtime-essential only.
- Internal testing workflows remain rich and independent.
- Optional markdown is generated from optional JSON (no manual drift).
- All regression matrix checks pass.
- Documentation reflects actual architecture and commands.

---

## Risks and Mitigations

- **Risk:** behavior drift while extracting shared logic
  - **Mitigation:** parity tests and phased commits
- **Risk:** ChatGPT dist accidentally grows with internal-only logic
  - **Mitigation:** explicit dist manifest gate in regression checks
- **Risk:** binary `.docx` snapshot fragility
  - **Mitigation:** semantic assertions (sections/bullets/placeholders), not byte-level compares
- **Risk:** ad hoc optional generation drifts from house writing style
  - **Mitigation:** style-template checks and reviewer checklist against existing section language

---

## Rollback Strategy

- Keep checkpoint commit untouched.
- Implement in small phase commits so any phase can be reverted independently.
- If parity fails, revert last phase commit and re-run matrix.

---

## Definition of Done

The refactor is done when:

1. Both distributions are explicitly separated and documented.
2. Shared scope pipeline is centralized and reused.
3. Runtime + export + validations produce aligned outputs.
4. Regression matrix is green for internal and dist paths.
5. Documentation updates are complete and accurate.
