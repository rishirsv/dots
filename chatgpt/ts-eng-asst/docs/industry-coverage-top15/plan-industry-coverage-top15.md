# Plan: O6 + Top-15 Operating Industry Coverage

## Goal

1) Prevent “silent/late closest match” industry mapping in conversation (O6).
2) Expand `INDUSTRY` coverage for the missing Top-15 **operating** industries.
3) Provide safe fallback behavior (common skeleton only) when the operating industry can’t be confirmed.
4) Provide per-industry exports (JSON/Markdown) that are easy to review and guaranteed to match the `dist/` bundle.

## What this enables (non-technical)

- Users explicitly confirm the industry key that drives scope insertion, so the scope isn’t surprising.
- New industries can be added incrementally without blocking generation.
- Reviewers can validate one industry at a time without digging through a large bundle JSON.

## Task list

- [x] 1.0 Add O6 industry resolution rule to system prompt
  - [x] 1.1 Require confirmation when industry is not an exact supported key
  - [x] 1.2 Allow `INDUSTRY=generic` fallback (common skeleton only) with warning
- [x] 2.0 Expand `INDUSTRY` schema choices for missing operating industries
  - [x] 2.1 Add: `retail`, `banking`, `insurance`, `telecomm`, `aerospace`, `building`, plus `generic`
- [x] 3.0 Expand the flat scope library with initial modules for new industries
  - [x] 3.1 Add new `industry_modules` entries in `reference/fdd_scope_library.json`
  - [x] 3.2 Rebuild `dist/scope-library.json`
- [x] 4.0 Create per-industry exports from the dist bundle
  - [x] 4.1 Export `docs/scope-library/industries/<industry>.json`
  - [x] 4.2 Export `docs/scope-library/industries/<industry>.md`
  - [x] 4.3 Add a validator script to prevent drift
- [ ] 5.0 Oracle handoff package
  - [ ] 5.1 Provide a concise “what to deliver per industry” checklist
  - [ ] 5.2 Provide alias suggestions per industry key

