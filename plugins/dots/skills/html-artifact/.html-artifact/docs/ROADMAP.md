# HTML Artifact Roadmap

This is the maintainer queue for `html-artifact`. It should answer one question:
**what should we do next?**

Runtime guidance remains in [SKILL.md](../../SKILL.md),
[references/composition.md](../../references/composition.md),
[references/recipes.md](../../references/recipes.md),
[references/primitives.md](../../references/primitives.md),
[references/authoring.md](../../references/authoring.md),
[references/design.md](../../references/design.md), and
[references/validation.md](../../references/validation.md).

This hidden workbench directory must stay out of packaged skill payloads.

## Rules For This Queue

- Work top to bottom.
- Keep only unfinished work here.
- Move completed decisions out instead of letting the roadmap become a changelog.
- Keep eval work grouped under **Parked: Evals** until we explicitly pick it up.
- Prefer source-coherence checks and rendered inspection over new frameworks or
  browser automation dependencies.

## Now

### 1. Improve Rendered Reference Evidence

The reference sheet proves source coverage. It should also catch visible
regressions.

- Inspect `assets/html-artifact-reference.html` at desktop, about 375px, 320px,
  dark mode, print preview, and JS-disabled reading.
- Record a short maintainer handoff note: widths checked, overflow result,
  dark-mode result, print/JS-disabled result, and visible gaps.
- Deepen only the composites that teach recipe rhythm: `executive-brief`,
  `diligence-report`, `product-spec`, `design-qa`, `system-card-eval-report`,
  and `bounded-workbench`.

## Next

### 2. Strengthen Bounded Workbench Guardrails

`bounded-workbench` is allowed only as a constrained static artifact.

- Add one richer reference specimen that demonstrates filtering or preview.
- Keep the full dataset readable with JavaScript disabled.
- Keep interaction limited to review/export; no persistence, backend, framework,
  or hidden state.

### 3. Audit `none` CSS Owners

After the reference and recipe stress passes, review primitives that still have
CSS owner `none`.

Prioritize:

```text
file-map
issue-ledger
red-flag-ledger
assumption-register
quote-board
scenario-pair
workbench-board
prompt-preview
inline-schematic
inline-chart
value-bridge
operating-model-map
configuration-diff
workstream-map
```

Keep `none` when generic table, figure, card, code, or layout helpers are
enough. Add a CSS region only when repeated specimens prove a real visual shape.

## Later

### Recipe Stress Tests

Use grounded dry runs to test newer recipes without encouraging filler.

Priority recipes:

- `status-report`
- `qa-packet`
- `briefing-deck`
- `product-spec`
- `proposal-pack`
- `diligence-report`
- `value-creation-plan`
- `design-system-reference`
- `bounded-workbench`

When a dry run exposes repeated structure, prefer a documented variant or shared
archetype styling before adding a new primitive.

### Reader-Surface Polish

Do these after rendered reference evidence is stronger.

- Add scroll affordances to contained scrollers: tables, code, diffs, chart
  areas, and reels.
- Strengthen print/PDF behavior: link disclosure where appropriate,
  break-inside rules, and ink-friendly code.
- Wire `performance-budget` to real byte measurements after fixture outputs give
  useful calibration.
- Use `content-visibility: auto` only for heavy below-the-fold specimens after
  browser inspection confirms no scroll or find-in-page regressions.
- Add a sidenote or margin-note primitive only if grounded dry runs prove a real
  editorial use case.

## Parked: Evals

Do not mix this work into the polish queue. Pick it up as one focused lane later.

### Scope

- Hidden eval fixtures are maintainer evidence, not runtime instructions for
  ordinary artifact generation.
- Evals must preserve the static-document contract: self-contained HTML,
  JS-disabled readability, source-grounded content, contained overflow, and no
  external runtime.
- Do not build a general eval platform, dashboard, or browser automation suite.

### Tasks

- Refresh `.html-artifact/evals.json` around the current recipe/base system.
- Add or refresh fixtures for design QA, UX audit, Image Gen concept packet,
  migration plan, release-readiness, eval report, postmortem, status report, and
  system card.
- Add structural checks only when they catch real drift: required anatomy,
  backed `inline-chart` data tables, workbench JS-disabled fallback, screenshot
  dimensions/lazy loading, and source/evidence limits.
- Add an evaluation report fixture that demonstrates `evaluation-suite`,
  `capability-matrix`, `claim-evidence-matrix`, and evidence-limit handling.

## Standard Closeout

For broad recipe, primitive, or theme changes, rely on rendered inspection and
the repo's normal verification:

```text
plugins/meta-skill/scripts/metaskill validate plugins/dots/skills/html-artifact --json
scripts/verify.sh
```

For rendered changes, also inspect `assets/html-artifact-reference.html` at
desktop, about 375px, and 320px, then record overflow, dark-mode, JS-disabled,
print, and fixture-family gaps in the handoff.
