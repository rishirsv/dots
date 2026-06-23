# Ultra Plan Changelog — Author-Time SVG Charting

Route: Capped Ultra Plan. Original plan existed in chat only (never persisted);
the upgraded plan is now the canonical artifact at
`.plans/html-artifact-charting.plan.md`. Adversarial review supplied by the user;
parent verified each finding against current source before adopting.

Raised: 8 · Verified: 8 · Confirmed: 8 · Refuted: 0.

## Verdict

The core idea — static SVG charts backed by always-visible data tables — is
sound and worth building. The original draft was not approvable: it understated
SVG-injection safety, mis-stated the JS-off contract, overstated what the repo
validator can prove, left accessibility and color undecided, and scoped a mini
charting library. All eight findings verified true against source and are
applied. Re-scoped to four editorial chart types with an explicit safety,
accessibility, and color contract.

## Confirmed changes applied

**Safety**
- *Missing SVG escaping (P1).* Pure string SVG built from grounded source text
  could break or inject markup. → Added `escapeText()`/`escapeAttr()` to the
  Target Standard and a semantic test for `A&B <Q1>`-style labels, gating step 1.

**Contract accuracy**
- *Validator overstated (P1).* `checkInlineChartBackingData` scans only the
  reference sheet (`validate.mjs:389`), not generated artifacts. → Validation
  section now says the validator proves reference/specimen + docs coverage only;
  generated artifacts are governed by `authoring.md`/`validation.md` + browser
  checks.
- *"Degrades with JS off" was wrong (P2).* No runtime JS exists, so nothing
  degrades (`authoring.md:48`). → Reframed: charts are static SVG; the visible
  `data-table` is the always-present data-of-record.

**Accessibility**
- *`role="img"` + vague label insufficient (P1).* Table is the visible data
  source (`primitives.md:144`). → Single pattern: SVG `aria-hidden="true"`, table
  is the accessible source; no `role="img"`/`aria-label`. Chose this simpler arm
  over `title`/`desc`/`aria-describedby` to avoid double announcement and
  per-preset divergence.

**Color**
- *`currentColor` ≠ `--accent` (P2).* No `inline-chart` region exists in
  `theme.css`. → Added an explicit color contract (`--chart-text/-axis/-primary/
  -muted/-pos/-neg`) defined in both light and dark blocks; marks use
  `var(--chart-*)`; no raw hex.

**Scope**
- *Too big for a first pass (P2).* → First slice = `linear`+`band` scales;
  `bar`/`dot`/`rule`/`text` marks; `barRanking`/`divergingBar`/`lollipop`/`slope`.
  Deferred line/area, histogram, smallMultiples/facet, benchmarkCompare, paired,
  annotate().

**Tests**
- *Snapshots miss real failures (P2).* → Added semantic assertions: escaping, no
  raw hex, all-`var()`/`currentColor`, required `viewBox`, `aria-hidden`, no
  `NaN`/`Infinity`, label-fits-margin — plus small snapshots for churn.

**Ownership**
- *`valueBridge` blurred two primitives (P3).* `inline-chart` and `value-bridge`
  are distinct (`primitives.md:281`). → `valueBridge` deferred; when added it
  emits `value-bridge` structured markup, not an `inline-chart` SVG.

## Refuted / not changed

None. Every raised finding verified true against current source.

## Open decisions for the human

- None blocking. The deferral list (line/area, histogram, faceting,
  benchmarkCompare, paired, annotate, valueBridge) is a product-sequencing call:
  expand only when a real artifact needs each type.
