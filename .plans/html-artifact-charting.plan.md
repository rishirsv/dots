# Author-Time SVG Charting for `html-artifact`

## Outcome

- A dependency-free, dev-time Node module (`scripts/plot.mjs`) turns data into
  **static inline SVG** that an author pastes into the existing `inline-chart`
  primitive's `chart` slot.
- Charts track the theme (light/dark) automatically through an explicit
  `inline-chart` color contract in `theme.css` — no per-chart theming, no raw
  hex.
- Every chart ships with its visible `data-table` as the data-of-record and the
  accessible source; the SVG is decorative-presentation only.
- First slice covers four editorial chart types; the engine stays small enough
  to read in one sitting. No "mini Observable Plot."

## Approach

Static SVG generated at **authoring (development) time**, not in the reader's
browser. The artifact contract forbids runtime chart libs and requires the page
to read fully with JS disabled (`references/authoring.md:48`), so charts are
baked strings — there is no runtime to "degrade." `scripts/plot.mjs` is a
dev-only tool alongside `validate.mjs`/`theme-regions.mjs`; it is never bundled
into reader artifacts.

Shape: a tiny core (scales + a few mark renderers + `plot()` returning an SVG
string) with thin named presets on top. Authors call a preset one-liner; the
core is the escape hatch. Build the smallest core that the four first-slice
presets need, and expand only when a real artifact demands it.

## Target Standard

These become reusable contract, so they are defined once, not per preset.

**Accessibility — single pattern.** The visible `data-table` is the accessible
data source (`references/primitives.md:144`). The SVG carries
`aria-hidden="true"` so screen readers announce the table once, not a weak image
summary plus the table. Do not emit `role="img"`/`aria-label` on chart SVGs.

**Color contract.** Add a `region:inline-chart` block to `theme.css` defining
chart color roles as variables so marks never fall back to body text and never
hard-code hex:

| Role | Var | Light source |
|---|---|---|
| chart text / labels | `--chart-text` | `--text-muted` |
| axis / gridline | `--chart-axis` | `--border` |
| primary mark | `--chart-primary` | `--accent` |
| muted mark | `--chart-muted` | `--surface-muted` mark fill / `--text-muted` |
| positive (diverging) | `--chart-pos` | `--success-strong` |
| negative (diverging) | `--chart-neg` | `--danger-strong` |

Define the same roles in both light `:root` and the dark blocks (parallel to the
existing token pairs at `theme.css:506-507`). Marks reference `var(--chart-*)`;
the SVG root sets `color: var(--chart-text)` so any `currentColor` use resolves
predictably. `currentColor` inherits `color`, not `--accent`, so it is used only
where the chart-text color is intended.

**Escaping.** All text and attribute values interpolated into SVG pass through
`escapeText()` / `escapeAttr()`. Source-grounded labels may contain `<`, `&`,
`"`, `'`; unescaped, they break the SVG or inject markup.

**Margins.** `plot()` takes an explicit `margin {top,right,bottom,left}`.
Default left/bottom margins are estimated from the longest tick string so labels
are not clipped, with an override. Label-heavy presets (`barRanking`, `slope`)
default to horizontal layout so long categories get the full measure.

## Steps

1. **Core + safety primitives.**
   - Change: `scripts/plot.mjs` — `escapeText`/`escapeAttr`; `linearScale`,
     `bandScale`; mark renderers `bar`, `dot`, `rule`, `text`; `plot({width,
     height, margin, marks})` returning an SVG string with `viewBox` (no fixed
     px width) and `aria-hidden="true"`. Numeric guards: never emit `NaN` /
     `Infinity` (throw on bad input).
   - Verify: `scripts/plot.test.mjs` semantic assertions (below) for the core.

2. **Four presets.**
   - Change: `barRanking`, `divergingBar`, `lollipop`, `slope` as thin wrappers
     over the core. Each accepts `(data, opts)` and returns an SVG string.
   - Verify: per-preset semantic + small snapshot tests.

3. **Theme region.**
   - Change: add `region:inline-chart` to `assets/theme.css` per the color
     contract; figure framing, caption/source typography, `svg{max-width:100%;
     height:auto}`. Flip `inline-chart` CSS owner from `none` to the new region
     in `references/primitives.md:281`.
   - Verify: embedded-theme parity — re-sync the inlined theme block in
     `assets/html-artifact-reference.html` and rerun `validate.mjs` (it checks
     theme parity).

4. **Reference specimens.**
   - Change: add baked specimens for three presets to
     `assets/html-artifact-reference.html`, each with the `chart` slot SVG **and**
     a visible `data-table`, in light/dark.
   - Verify: existing `checkInlineChartBackingData` (`validate.mjs:389`) passes;
     browser inspection at desktop / 375px / 320px, light + dark, JS disabled.

5. **Docs.**
   - Change: `references/authoring.md` — a "Generating charts" subsection: charts
     are authored at development time with `plot.mjs` and pasted as static SVG;
     the `data-table` is mandatory and is the accessible source; SVG is
     `aria-hidden`. `references/primitives.md` `inline-chart` row: list the four
     presets and the bake-then-paste workflow. Wire charts into the
     `research-report` / `diligence-report` / `eval-report` recipe cards in
     `references/recipes.md`.
   - Verify: `validate.mjs` local-link / docs checks pass.

## Validation

- Automated:
  - `node plugins/dots/skills/html-artifact/scripts/plot.test.mjs` — semantic
    assertions: labels like `A&B <Q1>` are escaped; **no raw hex** in output;
    every color is `var(--chart-*)` or `currentColor`; required `viewBox`; SVG
    root `aria-hidden="true"`, no `role="img"`; no `NaN`/`Infinity`; declared
    margins contain the longest label. Plus small snapshots for churn.
  - `node plugins/dots/skills/html-artifact/scripts/validate.mjs`
  - `scripts/verify.sh`
- Manual:
  - Browser inspection of `assets/html-artifact-reference.html` at desktop,
    375px, 320px, light **and** dark, and with **JS disabled** (SVG is static, so
    charts render; confirm the data-table reads and no page-level horizontal
    overflow).
  - `validate.mjs` proves only **reference/specimen** coverage and docs
    (`checkInlineChartBackingData` scans the reference sheet, not arbitrary
    output). Generated artifacts are held to the chart contract through
    `authoring.md` / `validation.md` guidance and per-artifact browser checks —
    not by the repo validator.

## Assumptions / Deferrals

- Edit `plugins/` source only; `dist/` is regenerated by
  `scripts/package-plugins.sh`.
- **Deferred** to a later slice, only when a real artifact needs them: `line` /
  `area` marks, `histogram` (binning lives inside the preset, not as a public
  transform), `smallMultiples` / faceting, `benchmarkCompare`, paired-compact,
  and `annotate()`.
- **`valueBridge` deferred and kept distinct.** `value-bridge` is a separate
  registered primitive with its own anatomy (`references/primitives.md:281,282`).
  When added, a `valueBridge` helper emits **structured `value-bridge` markup**,
  not an `inline-chart` SVG; one helper must not own two primitive anatomies.
- No interactivity, tooltips, animation, runtime rendering, or pie/donut/radar.
