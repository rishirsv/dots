# Runtime Theme Unification + Theme Drift Guard + E2E Visual Regression Plan

## Phase Outcomes (Non-Technical)

### Phase 1: One trusted styling authority
All visual styling values are produced once at runtime from one theme object.

### Phase 2: Builders become style-consumers only
Builders and shared render helpers stop carrying style decisions; they render using semantic theme values.

### Phase 3: Backsliding is prevented automatically
Any reintroduction of raw style literals is blocked by an AST-based guard with explicit allowlist control.

### Phase 4: Theme integrity is visually verified end-to-end
A dedicated hash-based visual suite proves that full-layout rendering remains stable under the unified theme model.

## Implementation Checklist

- [x] 1.0 Create runtime theme module and move theme construction there
  - [x] 1.1 Add `generator/runtime/theme.js` with `buildTheme`, contract assertion, and immutable output
  - [x] 1.2 Move render-context import from `../helpers/theme.js` to `./theme.js`
  - [x] 1.3 Update render-context regression assertions to validate runtime theme contract
  - [x] 1.4 Validation for 1.0 (`test:render-context:refactor`, registry contracts)

- [x] 2.0 Refactor helper theme layer into pure selectors
  - [x] 2.1 Remove `buildTheme` responsibility from `generator/helpers/theme.js`
  - [x] 2.2 Remove dependency on `generator/tokens.js` from helper theme/bullets paths
  - [x] 2.3 Keep helper APIs but source values exclusively from `ctx.theme`
  - [x] 2.4 Validation for 2.0 (smoke and contract checks)

- [x] 3.0 Migrate style literals into runtime theme
  - [x] 3.1 Replace builder literals (analysis, contents, cover, back-cover, divider, business overview)
  - [x] 3.2 Replace helper literals (`callouts`, `slide-components`, `title`, `chart`, `bullets` style paths)
  - [x] 3.3 Replace runtime styling literals (master/footer/text style paths)
  - [x] 3.4 Validation for 3.0 (theme drift findings only in allowlisted paths)

- [x] 4.0 Implement strict AST drift guard
  - [x] 4.1 Add `scripts/test-theme-drift-guard.mjs`
  - [x] 4.2 Define allowlist (`generator/runtime/theme.js`, `templates/**`, intentional constants)
  - [x] 4.3 Add npm scripts (`test:drift:theme`, `test:drift:theme:strict`) and wire strict guard to `npm run qa`
  - [x] 4.4 Validation for 4.0 (strict guard blocks regressions)

- [x] 5.0 Add theme e2e visual regression gate
  - [x] 5.1 Add `decks/regression-theme-e2e-all-types.deckSpec.json`
  - [x] 5.2 Add `scripts/test-theme-e2e-visual-regressions.mjs`
  - [x] 5.3 Add baseline file `testing/visual-baselines/theme-e2e.hashes.json` and `--update-baseline`
  - [x] 5.4 Include `test:visual:theme-e2e` in `test:visual:all`
  - [x] 5.5 Validation for 5.0 (theme-e2e + existing visual suites pass)

- [x] 6.0 Documentation and enforcement updates
  - [x] 6.1 Update README command catalog and regression workflow docs
  - [x] 6.2 Update onboarding workflow docs for theme drift compliance
  - [x] 6.3 Document baseline update policy
  - [x] 6.4 Validation for 6.0 (docs and scripts aligned)
