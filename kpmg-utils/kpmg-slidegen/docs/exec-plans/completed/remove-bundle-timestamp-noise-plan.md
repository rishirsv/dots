# Remove Bundle Timestamp Noise Plan

## Phase Outcomes

### Phase 1: Identify unstable bundle metadata
Make the bundle cleanliness issue concrete so we only remove noise and keep the verification surface strict.

### Phase 2: Make bundle generation deterministic
Ensure repeated bundle generation from identical inputs produces identical managed artifacts.

### Phase 3: Lock the behavior in verification
Add a regression check and wire it into the repo test lanes so CI catches future drift quickly.

## Implementation Checklist

- [x] 1.0 Audit current skill bundle sync and verify flow
  - [x] 1.1 Confirm which manifest fields are nondeterministic and semantically unnecessary
  - [x] 1.2 Confirm whether verify logic needs normalization or can stay strict
- [x] 2.0 Remove timestamp noise from generated bundle artifacts
  - [x] 2.1 Update bundle manifest generation to emit stable content
  - [x] 2.2 Regenerate the checked-in manifest if needed
  - [x] 2.3 Document any retained nondeterministic fields if any remain
- [x] 3.0 Add deterministic regression coverage
  - [x] 3.1 Add a repeat-generation regression test or verification path
  - [x] 3.2 Wire the regression into package scripts and CI-facing lanes
  - [x] 3.3 Run validation and record results

## Progress Notes

- Plan created for deterministic skill bundle cleanliness work.
- Confirmed `skills/kpmg-slides/assets/bundle-manifest.json` was the only bundle artifact adding nondeterministic timestamp noise via `generatedAt`.
- Removed the timestamp field instead of weakening diff checks, so repeated syncs now emit identical manifest content from identical inputs.
- Added a verifier guard that rejects unexpected top-level manifest keys, preventing timestamp-like fields from reappearing silently.
- Added `scripts/test-skill-bundle-determinism.mjs` and wired it into the PR and nightly lanes.
- Validation run: `npm run -s skill:verify -- --skip-smoke` and `npm run -s test:skill-bundle-determinism`.
