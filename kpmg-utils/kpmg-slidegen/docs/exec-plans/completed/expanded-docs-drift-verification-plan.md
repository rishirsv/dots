# Expanded Docs Drift Verification Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Broader authoritative doc coverage
The repo’s docs verifier will protect the main operator and contributor docs instead of only a narrow subset of newer architecture docs.

### Phase 2: Workflow truth stays aligned
Root docs, architecture docs, onboarding docs, and the command surface will stay coherent around the current case-based onboarding workflow.

### Phase 3: Actionable failures
When docs drift, the verifier will report the file, the stale reference, and the recommended fix so maintainers can correct it quickly.

## Implementation Checklist

- [x] 1.0 Expand docs verification coverage
  - [x] 1.1 Include `README.md`
  - [x] 1.2 Include `AGENTS.md`
  - [x] 1.3 Keep `docs/architecture/layout-authoring.md` and `docs/onboarding/onboard-layout.md` under verification

- [x] 2.0 Add lean workflow drift checks
  - [x] 2.1 Validate referenced npm commands and node script paths
  - [x] 2.2 Validate referenced repo paths
  - [x] 2.3 Fail on known stale onboarding references and missing key workflow commands with actionable fixes

- [x] 3.0 Align authoritative docs
  - [x] 3.1 Update `README.md` to the case-based onboarding workspace
  - [x] 3.2 Update `AGENTS.md` to the case-based onboarding workspace
  - [x] 3.3 Verify the expanded docs surface passes `npm run -s docs:verify`

## Progress Notes

- 2026-03-10: Expanded `scripts/docs-verify.mjs` to cover README, AGENTS, layout authoring, and onboarding docs with actionable failure output.
- 2026-03-10: Added lean workflow checks for npm commands, node script paths, repo paths, required workflow command presence, and stale onboarding references.
- 2026-03-10: Updated root docs to replace legacy `onboarding/layouts/` references with the current case-based onboarding workflow.
- 2026-03-10: Verified with `npm run -s docs:verify`.
