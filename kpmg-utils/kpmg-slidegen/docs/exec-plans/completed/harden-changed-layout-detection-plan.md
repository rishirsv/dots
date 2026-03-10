# Harden Changed Layout Detection Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Reliable diff selection
Changed-surface detection will stop guessing from a fragile `git diff HEAD` heuristic and instead use explicit base/head refs in CI with a sensible local fallback.

### Phase 2: Clear test fanout
The script will distinguish layout changes, primitive changes, and broader generator/runtime changes so it can explain and run the right validation surface.

### Phase 3: Usable operator feedback
Local users and CI logs will show exactly which files were considered changed, which strategy was used, and why each follow-on test ran.

## Implementation Checklist

- [x] 1.0 Replace fragile changed-file detection
  - [x] 1.1 Add explicit base/head support from CLI args and environment variables
  - [x] 1.2 Add a local no-arg fallback for working tree and branch delta detection
  - [x] 1.3 Make failure output actionable when refs are unavailable

- [x] 2.0 Add surface classification and logging
  - [x] 2.1 Distinguish changed layout fragments
  - [x] 2.2 Distinguish changed primitive fragments
  - [x] 2.3 Distinguish generator/runtime fanout files and print a clear summary

- [x] 3.0 Add verification and CI notes
  - [x] 3.1 Add selection-logic regression coverage or documented examples
  - [x] 3.2 Update CI to pass explicit base/head refs
  - [x] 3.3 Record verification results

## Progress Notes

- 2026-03-10: Started hardening changed-layout detection for CI and local use.
- 2026-03-10: Replaced the `git diff --name-only HEAD` heuristic with explicit base/head support plus a local fallback that unions working-tree changes with committed branch delta against the default remote branch.
- 2026-03-10: Added changed-surface classification for layout fragments, primitive fragments, and generator/runtime fanout files, and made the script print a clear summary of the selected lanes and why they ran.
- 2026-03-10: Added pure selection-logic regression coverage, documented local and CI invocation examples in `docs/architecture/layout-authoring.md`, and updated GitHub Actions to pass explicit base/head refs when available.
- 2026-03-10: Verified with `npm run -s test:changed-layout-detection`, `npm run -s test:changed-layouts -- --base-ref HEAD --head-ref HEAD`, and `npm run -s docs:verify`.
