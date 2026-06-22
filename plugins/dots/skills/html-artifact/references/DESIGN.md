---
version: alpha
name: HTML Artifact Editorial
description: Quiet document style for self-contained HTML artifacts.
colors:
  primary: "#151719"
  secondary: "#687174"
  tertiary: "#315E68"
  neutral: "#F7F7F2"
  surface: "#FFFFFF"
  surface-muted: "#ECEFED"
  border: "#C9CECB"
  accent-soft: "#DCE8E7"
  success: "#E3ECD9"
  success-strong: "#536F45"
  warning: "#704915"
  warning-soft: "#F3E7D5"
  danger: "#9A3E46"
  danger-soft: "#F2DDDF"
  code-surface: "#121719"
  code-text: "#E6EAE8"
typography:
  headline-lg:
    fontFamily: "ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: 34px
    fontWeight: 520
    lineHeight: 1.16
    letterSpacing: 0
  headline-md:
    fontFamily: "ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: 24px
    fontWeight: 520
    lineHeight: 1.25
    letterSpacing: 0
  headline-sm:
    fontFamily: "ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: 18px
    fontWeight: 520
    lineHeight: 1.3
    letterSpacing: 0
  body-md:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: 0
  body-sm:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label-mono:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Monaco, monospace"
    fontSize: 11.5px
    fontWeight: 560
    lineHeight: 1.3
    letterSpacing: 0
  code-sm:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Monaco, monospace"
    fontSize: 12.5px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  page-x: 24px
  page-y: 42px
  section: 48px
  measure: 760px
  shell: 1080px
rounded:
  sm: 5px
  md: 7px
  lg: 10px
motion:
  fast: 120ms
  base: 200ms
  slow: 320ms
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-in-out: "cubic-bezier(0.65, 0, 0.35, 1)"
components:
  page-shell:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    padding: "{spacing.page-x}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  panel-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  callout-note:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: 9px 14px
  badge-high:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.sm}"
    padding: 2px 7px
  badge-med:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.sm}"
    padding: 2px 7px
  badge-low:
    backgroundColor: "{colors.success}"
    textColor: "{colors.success-strong}"
    rounded: "{rounded.sm}"
    padding: 2px 7px
  status-dot-done:
    backgroundColor: "{colors.success-strong}"
    rounded: "{rounded.sm}"
    width: 12px
    height: 12px
  badge-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: 2px 7px
  rule:
    backgroundColor: "{colors.border}"
    height: 1px
  code-panel:
    backgroundColor: "{colors.code-surface}"
    textColor: "{colors.code-text}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
---

## Overview

HTML Artifact Editorial is a restrained document style for generated explainers,
plans, reviews, research reports, and design-QA packets. It should feel like a
carefully edited technical brief: source-grounded, compact, calm, and easy to
inspect on both desktop and phone.

The style is intentionally closer to a reference document than an app dashboard.
Authority comes from hierarchy, tables, code, evidence, and honest provenance,
not from decorative badges, tinted rails, fake metrics, or ornamental panels.

## Colors

The palette balances neutral paper, graphite text, cool blue-green emphasis, and
separate status colors.

- **Primary (#151719):** near-black for headings, code surfaces, and decisive
  text.
- **Secondary (#687174):** muted graphite for captions, metadata, table
  secondary text, and quiet explanations.
- **Tertiary (#315E68):** deep teal for links, active text, and the rare primary
  action. Do not use it as a decorative vertical stripe.
- **Neutral (#F7F7F2):** paper background; slightly warm but not beige-heavy.
- **Surface (#FFFFFF):** panels, tables, code captions, and evidence rows.
- **Surface muted (#ECEFED):** table headers, prompts, and subtle grouping fills.
- **Border (#C9CECB):** crisp hairline borders and rules.
- **Accent soft (#DCE8E7):** quiet emphasis fill for notes and selected rows.
- **Success / success strong:** completion, pass states, and additions.
- **Warning / warning soft:** medium risk. Use with text; never as a standalone
  color cue.
- **Danger / danger soft:** destructive state, removals, and high-risk findings.
  Use sparingly and pair with text or glyphs.

## Typography

Headings use a serif family at a modest weight to give the document an editorial
voice. Body text uses system sans at a compact but readable size. Labels, paths,
metadata, code, and audit entries use monospace.

Keep letter spacing at `0`. Avoid all-caps label walls. Use concise mono labels
when they help scanning, but let ordinary sentence case carry the reader-facing
copy.

Use `headline-lg`, `headline-md`, and `headline-sm` for page and section
hierarchy. Use `body-md` for ordinary prose and `body-sm` for compact evidence,
notes, and captions. Use `label-mono` for metadata and small controls. Use
`code-sm` for code and diff surfaces.

## Layout

Artifacts use a centered shell capped around `shell` width, with generous page
padding and a prose measure around `measure`. The first viewport should state
the artifact type, title, and primary takeaway without a decorative hero card.

Tables, code, diffs, diagrams, and screenshot rows must scroll inside their own
wrappers or collapse. The page itself must not acquire horizontal overflow at a
mobile width around 375px.

## Elevation & Depth

Depth is expressed through tonal layers and hairline borders, not shadows. Use
panels only for actual grouped data: metadata, findings, tables, code, captures,
and export controls. Do not wrap every section in a card.

Avoid heavy drop shadows, glass effects, gradient blobs, decorative depth, and
abstract UI chrome that carries no information.

## Shapes

The radius system is restrained:

- **sm (5px):** compact badges, inline controls, small markers.
- **md (7px):** rows, notes, table wrappers, compact blocks.
- **lg (10px):** panels, code blocks, screenshot frames.

Do not exceed this scale unless the artifact embeds a real screenshot or media
object whose original shape requires it.

## Motion

Motion is restrained and purposeful — it marks a state change, never decorates.
Use the `motion` tokens, not ad-hoc durations:

- **fast (120ms):** taps, toggles, copy confirmations.
- **base (200ms):** disclosure reveals and small fades.
- **slow (320ms):** larger before/after or triptych transitions.
- **ease-out** for entrances, **ease-in-out** for reversible toggles.

There is no continuous, looping, or ambient motion. Whenever animation is
present, it lives behind `prefers-reduced-motion: no-preference` (or is
neutralized under `reduce`) so the final state is always visible with motion
off. These are token and rule sources for authoring; motion is never added as
visible reader chrome for its own sake.

## Components

Primitive styling should be derived from the component tokens:

- **page-shell:** sets background, base text, and page padding.
- **panel / panel-muted:** ordinary and soft data surfaces.
- **callout-note:** note blocks with a full border or subtle fill; never a
  default colored left rail.
- **button-primary:** copy/export controls only.
- **badge-high / badge-med / badge-low:** severity and confidence states; text
  must still state the state.
- **code-panel:** dark code and diff surfaces with internal horizontal scroll.

For generated artifacts, emit CSS custom properties from the token values and
compose primitive selectors from those variables. Do not hardcode the same
values repeatedly across multiple references.

## Dark mode

Every artifact ships a dark theme and an anchored toggle, implemented the same
way everywhere. Dark mode is driven by `prefers-color-scheme`, so it works with
JavaScript disabled; the `theme-toggle` button lets the reader override the OS
preference, and a tiny inline script persists the choice.

Emit the light tokens on `:root`, then the **same** dark values in both the media
query (OS-driven) and a manual `[data-theme="dark"]` override. Keep code surfaces
dark in both themes via `--code-surface`/`--code-text` — never key a code or panel
background off `--ink`, which flips light in dark mode.

```css
:root { color-scheme: light dark; /* + the light tokens */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper:#17191A; --ink:#F1F3F1; --body:#C9CECB; --muted:#939B98;
    --surface:#1F2426; --surface-muted:#282D30; --border-color:#3A4145;
    --accent:#82B3BF; --accent-soft:#20363B; --success-strong:#9DBE86;
    --danger:#E59A90; --code-surface:#0F1314;
  }
}
:root[data-theme="dark"] { /* the identical dark values */ }
```

The toggle is the `theme-toggle` primitive — a fixed top-right moon button — plus
one inline script that reads a saved theme, flips `data-theme` on `<html>`, and
writes it back to `localStorage`. With JS off the button is inert and the OS
preference still drives dark mode:

```html
<button data-primitive="theme-toggle" data-slot="action" type="button"
        aria-label="Toggle dark mode" aria-pressed="false">
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>
```

Both themes must hold contrast. Re-check badges, pills, and warning/amber text,
which often carry hard-coded colors that need a lighter value in dark.

## Do's and Don'ts

- Do use semantic HTML for meaning and this file for styling decisions.
- Do make the first viewport state the artifact type and primary takeaway.
- Do keep status understandable through text or glyphs, not color alone.
- Do keep tables, code, diagrams, and screenshots contained at mobile widths.
- Do use thin dividers, aligned baselines, and compact rows before decorative
  cards.
- Don't include provider names, research scratch paths, one-off prompts, or
  source-specific provenance in reusable demo content.
- Don't use colored left rails, orange accent stripes, arbitrary pills, fake
  stat cards, decorative gradients, or nested cards around every section.
- Don't expose primitive names, slot labels, or data-attribute values in reader
  artifacts; the atlas may show them only because it is reference material.
