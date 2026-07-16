---
version: alpha
name: dots
description: Cool-technical document identity for dots HTML artifacts.
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
    fontWeight: 600
    lineHeight: 48px
    letterSpacing: -2.4px
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
  mono:
    fontFamily: ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
spacing:
  unit: 4px
  article: 720px
  section: 48px
  block: 16px
rounded:
  card: 6px
  code: 6px
  inline: 4px
  pill: 6px
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
x-alpha-steps: [4, 8, 12, 20, 40, 55, 70]
x-chart:
  emphasis: var(--accent)
  value-emphasis: var(--accent-deep)
  pos: var(--a40)
  neg: var(--a20)
  mark: var(--a20)
  track: var(--a4)
  grid: var(--a12)
  label: var(--a55)
  value: var(--a55)
x-motion:
  duration-fast: 150ms
  duration-reveal: 400ms
  ease: cubic-bezier(0.2, 0, 0, 1)
  stagger-step: 60ms
---

# dots artifact identity

## Overview

Cool and technical. One flat page ground, warm-white in light mode and
near-black in dark, carrying confident grotesque type with tight negative
tracking. Hierarchy comes from weight, size, and an ink-alpha ladder — not
from boxes, tints, or decoration. A single desaturated blue is the only
voice of emphasis; amber and red speak only when something is genuinely
wrong. The page should feel like a precise instrument: generous air, hairline
rules, numbers that line up, motion that happens once and gets out of the way.

## Colors

`background` and `foreground` are the only grounds. All grays use an alpha
ladder (`--a4` … `--a70`) derived from `foreground` at the `x-alpha-steps`
opacities, so every border, muted label, and track reads correctly on both
grounds without a second palette. Borders sit at `--a12` (felt, not seen);
strong rules at `--a20`; secondary text at `--a55`; primary-but-quiet at
`--a70`.

`accent` is for links, active states, and the one emphasized data point.
`accent-deep` is its high-contrast partner for small emphasized text.
`warning-*` and `danger-*` are semantic only — never decorative. Code
surfaces stay dark in both modes (`code-surface`/`code-ink`).

The `x-dark` block redefines the same semantic roles for dark mode.

## Typography

Use the system grotesque stack; no webfonts. Headings are
semibold with negative tracking that scales with size — the tracking values
in the front-matter are per-size absolutes, not a ratio. Body is 15px/1.7 at
a ~66ch measure inside a 720px article column. Mono (13px/20px, ligatures
off) is for code and aligned figures only — never for labels or eyebrows.
Digits that line up vertically always set `font-variant-numeric:
tabular-nums`. Headings get `text-wrap: balance`.

## Layout

One centered article column (`spacing.article`, 720px) on one flat ground.
Sections separated by `spacing.section` (48px) of air and, at most, a
hairline rule. The table of contents is a margin rail — sticky, docked left
or right of the column at wide viewports with a scroll-spy active state,
collapsing to a plain inline list on narrow viewports. Wide content (tables,
code, diagrams) scrolls inside its own container; the page never scrolls
sideways.

## Elevation & Depth

The identity is flat. Hierarchy comes from spacing, type, ink contrast, and
hairline rules rather than shadows or layered surfaces. A component may use a
faint semantic tint when meaning requires it, but it never creates a second
page ground or simulated elevation.

## Shapes

`rounded.card` (6px) for cards, code panels, chips; `rounded.inline` (4px)
for inline code and focus rings. Radius is quiet and uniform — nothing
pill-shaped except the single status chip. Borders are 1px hairlines from the
alpha ladder.

## Components

Components consume the design tokens rather than introducing local palettes or
shape systems. Their finished anatomy lives in the component catalog; this file
defines the shared visual rules that apply across that catalog.

Charts use the `x-chart` roles for structure, marks, labels, values, and the
single emphasized point. Those roles follow light and dark modes automatically
and keep chart emphasis independent from links and callouts.

Motion (from `x-motion`): choreographed moments only. A one-time load stagger
on header elements (≤400ms total), one-time reveals for figures entering the
viewport (bars grow once, SVG paths draw once), and micro-interactions
(hover, focus, TOC active). Zero ambient or looping motion. Everything is
gated behind `prefers-reduced-motion: no-preference`; with JS off the page
renders complete and static.

## Do's and Don'ts

- **Do** keep one flat page background edge to edge. **Don't** nest a
  lighter or darker "content card" inside a differently colored body — there
  is no page-in-a-page.
- **Do** mark callouts with a full hairline border and, if needed, a faint
  tint. **Don't** put a left-side accent stripe on anything — callouts,
  quotes, recommendations, or the TOC. The active TOC item is weight and
  color alone.
- **Do** ration chips to at most one status indicator per page ("draft").
  **Don't** add label-chips inside callouts or headers — use a bold run-in
  word ("**Note.**").
- **Do** use one quiet small line of breadcrumb context above the title.
  **Don't** style it as an uppercase mono eyebrow — no letter-spaced
  all-caps labels anywhere.
- **Do** keep the single accent for links, active states, and the one
  emphasized data point. **Don't** introduce a second bright hue; amber/red
  are for genuine warnings only.
- **Do** let numbered markers, dividers, and labels encode real structure.
  **Don't** decorate — if the content isn't a sequence, don't number it.
