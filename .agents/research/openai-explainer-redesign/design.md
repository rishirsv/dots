---
version: alpha
name: openai-product-explainer
description: OpenAI-inspired product workbench styling for technical HTML explainers.
source:
  capturedAt: 2026-06-18
  pages:
    - https://openai.com/brand/
    - https://developers.openai.com/apps-sdk/concepts/ui-guidelines
    - https://developers.openai.com/apps-sdk/concepts/ux-principles
    - https://github.com/openai/apps-sdk-ui
  viewports:
    - desktop Chrome
  confidence: medium-high
status: scratch research design target
colors:
  bg: "#ffffff"
  surface: "#ffffff"
  surfaceSubtle: "#f7f7f5"
  surfaceMuted: "#f2f2ef"
  ink: "#0d0d0d"
  text: "#282828"
  muted: "#5d5d5d"
  faint: "#8f8f8f"
  green: "#0f8f6a"
  amber: "#c97712"
  rust: "#b94b36"
typography:
  body-md:
    fontFamily: "OpenAI Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  title-lg:
    fontFamily: "OpenAI Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.05
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
rounded:
  xs: 6px
  sm: 8px
  md: 12px
---

# OpenAI Product Explainer Design

This design target is for technical explainer artifacts that should feel closer
to an OpenAI product surface than to an editorial article. It is not a clone of
OpenAI, and it should not use protected marks as product branding. The goal is
to extract product-surface cues: neutral typography, sparse color, precise
spacing, thin structure, and evidence-first interaction.

## Overview

Observed OpenAI-adjacent product surfaces lean on neutral canvases, system-like
typography, thin dividers, compact controls, and restrained semantic color. For
an `unpack` explainer, the useful translation is a focused investigation
workbench: not a brand imitation, but a calmer product surface for debugging and
evidence review.

## Source Evidence

- Official OpenAI brand page: OpenAI Sans is described as combining geometric
  precision, functionality, rounded approachability, and human warmth.
  Source: https://openai.com/brand/
- Official Apps SDK UI guidelines: ChatGPT app UIs should use system colors for
  text, icons, and dividers; avoid gradients/patterns that break the minimal
  look; inherit platform/system font behavior; keep spacing consistent; and use
  monochrome outlined iconography.
  Source: https://developers.openai.com/apps-sdk/concepts/ui-guidelines
- Official OpenAI frontend guidance: define design systems and constraints
  upfront, use visual references, verify in browser across viewports, and avoid
  generic overbuilt layouts.
  Source: https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4
- Chrome sample, OpenAI brand page: body used OpenAI Sans at 17px, black
  background, white foreground; H1 sampled at 64px/64px, weight 500.
  Source sample: .agents/research/openai-explainer-redesign/openai-brand-sample.json
- Chrome sample, OpenAI developer UI guidelines: white background, near-black
  text, OpenAI Sans, body 16px/24px, H1 30px/42px weight 600, muted paragraph
  color around rgb(93,93,93).
  Source sample: .agents/research/openai-explainer-redesign/openai-ui-guidelines-sample.json
- Subagent design.md methods report recommends a Google draft-compatible
  structure: YAML tokens first, human-readable Overview, Colors, Typography,
  Layout, Elevation & Depth, Shapes, Components, and Do's/Don'ts.
  Source sample: .agents/research/openai-explainer-redesign/q01-design-md-methods.md
- Subagent visual-style report found Apps SDK UI source tokens with neutral
  gray ladder, 4px base spacing, system sans/mono stacks, 0em tracking, 22-48px
  control heights, semantic status colors, and 150ms transitions.
  Source sample: .agents/research/openai-explainer-redesign/q02-openai-visual-style.md

## Design Thesis

The explainer should read like an investigation workbench: answer at the top,
evidence beside the flow, uncertainty visible in the interface, and repair
guidance close to the code. It should feel calm, current, and product-native,
not decorative.

## Colors

Build from neutrals first. Use white/near-white surfaces, near-black text, and
alpha dividers. Green, amber, rust, blue, or purple should appear only as
semantic evidence states, chart marks, focus rings, or small badges.

## Tokens

```css
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-subtle: #f7f7f5;
  --surface-muted: #f2f2ef;
  --ink: #0d0d0d;
  --text: #282828;
  --muted: #5d5d5d;
  --faint: #8f8f8f;
  --line: rgba(13, 13, 13, 0.12);
  --line-strong: rgba(13, 13, 13, 0.22);
  --green: #0f8f6a;
  --green-soft: #eaf6f1;
  --amber: #c97712;
  --amber-soft: #fff4df;
  --rust: #b94b36;
  --rust-soft: #fff0ec;
  --blue: #4267b2;
  --mono: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;
  --sans: "OpenAI Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
}
```

## Typography

- Use a system sans stack with OpenAI Sans first when available.
- No serif display type for this mode.
- H1: 36-48px, 1.05 line-height, 600 weight, max 22ch.
- H2: 20-24px, 1.2 line-height, 600 weight.
- Body: 15-16px, 1.55 line-height.
- UI labels: 11-12px, medium weight, muted text, no decorative letter spacing.
- Code and source chips: mono 11-13px.
- Keep size variation tight; hierarchy should come from placement, grouping, and
  weight before scale.

## Elevation & Depth

- Prefer flat surfaces with 1px borders and subtle tonal fills.
- Use shadows only for floating tooltips/popovers, and keep them soft and small.
- Avoid glass, blur, glow, layered cards, and large tinted panels.

## Shapes

- Radius scale: 6px for chips, 8px for controls, 12px for panels.
- Full pills are allowed only for tiny status chips and segmented controls.
- No giant rounded cards or stacked card-inside-card layouts.

## Layout

- Page shell: full-width white app surface, not paper article canvas.
- Top chrome: slim breadcrumb/product rail with low-contrast controls.
- Hero: answer headline, metadata row, and one primary interpretation before
  the trace. Do not use an oversized decorative hero.
- Main investigation: two-column workbench. Left: flow/trace canvas. Right:
  evidence inspector and on-page nav.
- Down-page detail: dense bands and split panels. Use cards only for repeated
  claims or tool-like controls.
- Use 8px spacing rhythm and thin dividers. Avoid heavy shadows.
- Diagrams may use internal scroll on mobile; page itself must not horizontally
  scroll.

## Component Guidance

- Buttons: 32-36px tall, 8px radius, 1px border, medium label. Primary should
  be black fill or restrained accent only when it is the main action.
- Pills/chips: tiny evidence metadata only; never decorative badge clusters.
- Tabs/segmented controls: black selected segment, white inactive segment,
  1px border, compact labels.
- Tables: dense, readable, row separators, sortable headers, muted cells, no
  bento cards.
- Evidence inspector: right rail panel with status, source chips, tabs, and
  concise why-it-matters rows.
- Cause ladder: vertical numbered sequence with one amber/rust active row.
- Claim board: list rows with status icon/chip, claim, source, and disclosure.
- Code: light shell with dark code block only when machine voice benefits from
  contrast; otherwise use light code surfaces.
- Charts: minimal grid, tiny labels, semantic green/amber/rust points.
- Icons: small monochrome outline icons or simple text labels. Avoid oversized
  icon tiles.

## Motion And Interaction

- Keep motion functional: stepper highlight, tab swap, tooltip, diff reveal,
  table filter, and subtle hover/focus state.
- No decorative entrance choreography beyond a gentle opacity/translate.
- Reduced motion must leave content fully visible.

## Do

- Make the first viewport answer the investigation.
- Keep confidence, inspected material, and gaps visible.
- Use neutral surfaces and one semantic accent at a time.
- Treat source chips and statuses as core UI, not footnotes.
- Keep controls compact and product-like.

## Don't

- Do not use ivory paper, serif display headings, clay as the dominant brand
  signal, or editorial article spacing in this mode.
- Do not introduce gradients, blobs, glass, neon, heavy shadows, or decorative
  images.
- Do not copy OpenAI marks or imply this is an official OpenAI product.
- Do not color large backgrounds for emphasis; use text, position, chips, and
  thin borders first.

## Agent Prompt Guide

When applying this design:

1. Preserve the explainer's evidence and investigative primitives.
2. Convert the visual language to a neutral product workbench.
3. Use system/OpenAI-like sans typography, sparse color, thin lines, and compact
   controls.
4. Place the dominant trace next to a live evidence inspector when space allows.
5. Validate rendered desktop and mobile geometry, then compare against the prior
   editorial version for comprehension, density, and visual polish.
