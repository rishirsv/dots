---
version: alpha
name: dots
description: Visual style for Dots HTML pages.
colors:
  background: "#fbfbfa"
  foreground: "#0d0d0d"
  accent: "#1f5eff"
  accent-deep: "#12379e"
  warning-ink: "#6b4c00"
  warning-line: "rgba(180,130,0,0.35)"
  warning-bg: "rgba(255,178,0,0.06)"
  danger-ink: "#8c1d18"
  danger-line: "rgba(200,60,50,0.35)"
  danger-bg: "rgba(220,70,60,0.05)"
  code-surface: "#0d0d0d"
  code-ink: "#ededed"
typography:
  h1:
    fontFamily: -apple-system, Helvetica Neue, Arial, sans-serif
    fontSize: 40px
    mobileFontSize: 32px
    fontWeight: 600
    lineHeight: 48px
    mobileLineHeight: 38px
    letterSpacing: -2.4px
    mobileLetterSpacing: -1.5px
  h2:
    fontFamily: -apple-system, Helvetica Neue, Arial, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.96px
  h3:
    fontFamily: -apple-system, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: -0.32px
  body:
    fontFamily: -apple-system, Helvetica Neue, Arial, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.7
  display:
    fontFamily: -apple-system, Helvetica Neue, Arial, sans-serif
    tracking: 1
  mono:
    fontFamily: ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
spacing:
  unit: 4px
  article: 720px
  wide: 1040px
  canvas: 1440px
  section: 48px
  block: 16px
rounded:
  card: 6px
  code: 6px
  inline: 4px
  pill: 6px
  bubble: 18px
x-dark:
  background: "#0f0f0e"
  foreground: "#f5f5f4"
  accent: "#6f94ff"
  accent-deep: "#b7c9ff"
  warning-ink: "#f2c14e"
  warning-line: "rgba(255,193,77,0.35)"
  warning-bg: "rgba(255,193,77,0.08)"
  danger-ink: "#ff8a80"
  danger-line: "rgba(255,120,110,0.35)"
  danger-bg: "rgba(255,120,110,0.07)"
  code-surface: "#161615"
  code-ink: "#ededed"
x-alpha-steps: [4, 8, 12, 20, 40, 55, 60, 70]
x-tones:
  personal:
    colors:
      background: "#f7f2ec"
      foreground: "#2b2320"
      accent: "#0866d6"
      accent-deep: "#0a4fa3"
      danger-ink: "#9c3148"
      danger-line: "rgba(180,72,93,0.30)"
      danger-bg: "rgba(180,72,93,0.06)"
    dark:
      background: "#171412"
      foreground: "#f2ebe4"
      accent: "#4ea1ff"
      accent-deep: "#a9d0ff"
      danger-ink: "#ea8a9b"
      danger-line: "rgba(234,138,155,0.30)"
      danger-bg: "rgba(234,138,155,0.08)"
    display-font: New York, Iowan Old Style, ui-serif, Georgia, serif
    display-tracking: 0.35
    card-radius: 14px
    text-muted-step: 70
x-chart:
  emphasis: var(--accent)
  value-emphasis: var(--accent-deep)
  pos: var(--a40)
  neg: var(--a20)
  mark: var(--a20)
  track: var(--a4)
  grid: var(--a12)
  label: var(--text-muted)
  value: var(--text-muted)
x-motion:
  duration-fast: 150ms
  duration-reveal: 400ms
  ease: cubic-bezier(0.2, 0, 0, 1)
  stagger-step: 60ms
---

# Dots HTML visual style

## Overview

Use a restrained technical style for the default tone. Use one flat page
background: warm white in light mode and near black in dark mode. Use
grotesque type with tight negative tracking. Show hierarchy through font
weight, size, spacing, and ink opacity. Use one desaturated blue for emphasis.
Reserve amber and red for warnings and failures. Align numbers, use thin
rules, and keep motion brief and limited to one occurrence.

## Tones

The default tone is `report`: the cool, technical page described here. It
fits reviews, status, plans, incidents, and other work artifacts. Choose a
different tone when the subject or audience needs it. A tone changes token values only: every component, layout,
and rule below still applies, so a toned page stays structurally identical.

- `personal` suits letters, relationship or coaching reflections, personal
  reviews, and other private material written to one person. It uses warm
  paper and ink colors, serif display headings with lighter tracking, and a
  softer card radius. Its accent remains the only emphasis color, and
  `danger-*` stays semantic.

Tones live under `x-tones` in the front-matter. Each lists only the tokens it
changes: `colors` and `dark` override the matching base roles (the alpha
ladder is recomputed from the tone's foreground), `display-font`,
`display-tracking`, and `card-radius` set headings and card shape, and
`text-muted-step` raises muted text to a stronger alpha step when the tone's
light palette would otherwise fall below 4.5:1. Add a tone
there when a recurring kind of content needs it; do not restyle one page with
inline colors instead.

## Colors

`background` and `foreground` define the page colors. All grays use an alpha
ladder (`--a4` … `--a70`) derived from `foreground` at the `x-alpha-steps`
opacities, so every border, muted label, and track reads correctly on both
themes without a second palette. Use `--a12` for subtle borders;
strong rules at `--a20`. Normal-sized secondary text uses the semantic
`--text-muted` role (`--a60`) so it stays above 4.5:1 in both themes; lower
alpha steps remain for borders, fills, and non-text marks. Secondary
text that needs stronger contrast may use `--a70`.

`accent` is for links, active states, and the one emphasized data point.
`accent-deep` is its high-contrast partner for small emphasized text.
`warning-*` and `danger-*` are semantic only — never decorative. Code
surfaces stay dark in both modes (`code-surface`/`code-ink`).

The `x-dark` block redefines the same semantic roles for dark mode.

## Typography

Use the system grotesque stack; no webfonts. Headings and pull quotes use the
display font, which matches the body stack by default and changes only with
the tone. Headings are semibold with
negative tracking that scales with size — the tracking values in the
front-matter are per-size absolutes, not a ratio. H1 steps down to its mobile
size at 380px so a long title does not consume the whole first viewport. Body
is 15px/1.7 at a ~66ch measure inside a 720px article column. Use mono (13px/20px, ligatures off) only for code and aligned figures.
Use the body font for labels. Digits that line up vertically always set `font-variant-numeric:
tabular-nums`. Headings get `text-wrap: balance`.

## Layout

Pages use one of three maximum widths on the same flat background:

- `article` (`spacing.article`, 720px) for explanations with text and figures, status,
  incidents, and plans.
- `wide` (`spacing.wide`, 1040px) for comparisons, reviews, file maps, and
  other pages that need evidence shown side by side.
- `canvas` (`spacing.canvas`, 1440px) for visual references and atlases. Keep
  prose inside a nested article-width reading column. Use the extra width
  for visuals.

Separate sections with `spacing.section` (48px) of space and, at most, a
hairline rule. The table of contents is a margin rail — sticky, docked left or
right of the reading column at wide viewports with a scroll-spy active state,
collapsing to a compact native disclosure on narrow viewports. Linear processes
reflow into a vertical sequence; branching diagrams and wide tables
stay bounded inside their own containers. The page never scrolls sideways.

The page shell supplies the transition from its header to the first content
block; do not set structural spacing on the header's last child. For parallel grids, declare the item count. Do not leave empty columns.

## Elevation & Depth

The visual style is flat. Hierarchy comes from spacing, type, ink contrast, and
hairline rules rather than shadows or layered surfaces. A component may use a
faint semantic tint when meaning requires it, but it never creates a second
page background or simulated elevation.

## Shapes

`rounded.card` (6px) for cards and code panels; `rounded.inline` (4px)
for inline code and focus rings. Keep the radius uniform. Borders are 1px
hairlines from the alpha ladder.

## Components

Components consume the design tokens rather than introducing local palettes or
shape systems. Their finished structure lives in the component catalog; this file
defines the shared visual rules that apply across that catalog.

Use semantic HTML and native controls. Preserve native tab order and the shared
focus-visible outline; do not add `tabindex` or recreate a button, link, input,
select, or textarea with a generic element. Informative images and figures need
an accessible name or equivalent adjacent content. Decorative SVGs are hidden
from assistive technology, and raster decoration is omitted.

Charts use the `x-chart` roles for structure, marks, labels, values, and the
single emphasized point. Those roles follow light and dark modes automatically
and keep chart emphasis independent from links and callouts.

Use motion from `x-motion` only for these interactions: a one-time load stagger
on header elements (≤400ms total), one-time reveals for figures entering the
viewport (bars grow once, SVG paths draw once), and micro-interactions
(hover, focus, TOC active). Do not add ambient or looping motion. Enable motion only under
`prefers-reduced-motion: no-preference`. With JavaScript off, the page
must render completely and remain static.

## Do's and Don'ts

- **Do** keep one flat page background edge to edge. **Don't** nest a
  lighter or darker "content card" inside a differently colored body — there
  is no page-in-a-page.
- **Do** mark callouts with a full hairline border and, if needed, a faint
  tint. **Don't** put a left-side accent stripe on anything — callouts,
  quotes, recommendations, or the TOC. The active TOC item is weight and
  color alone.
- **Do** limit chips to at most one status indicator per page ("draft").
  **Don't** add label-chips inside callouts or headers — use a bold run-in
  word ("**Note.**").
- **Do** start with the title. **Don't** use eyebrows: small category,
  breadcrumb, identifier, or context labels above or beside a heading.
  Keep document metadata in the footer, review IDs in exported feedback,
  and functional breadcrumb navigation below the introduction.
- **Do** keep the single accent for links, active states, and the one
  emphasized data point. **Don't** introduce a second bright hue; amber/red
  are for genuine warnings only.
- **Do** let numbered markers, dividers, and labels encode real structure.
  **Don't** decorate — if the content isn't a sequence, don't number it.
- **Do** use a generated raster image when it gives the reader meaningful
  subject matter or atmosphere. **Don't** generate filler for an empty grid
  track, replace exact diagrams or screenshots, or imply invented evidence.
