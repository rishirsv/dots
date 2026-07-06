# Design

Use this file for the visual judgment behind HTML Artifact Editorial: why the
documents look restrained, how to avoid generic dashboard chrome, and what to
protect during polish passes. Use [../assets/theme.css](../assets/theme.css) for
the exact editable runtime CSS values, dark-mode tokens, print behavior, and
primitive/component styling.

## Overview

HTML Artifact Editorial is a quiet document style for generated explainers,
plans, reviews, research reports, QA packets, and decision briefs. It should
feel like a carefully edited technical brief: source-grounded, compact, calm,
and easy to inspect on desktop and phone.

The style is closer to a reference document than an app dashboard. Authority
comes from hierarchy, tables, code, evidence, and honest provenance, not from
decorative badges, tinted rails, fake metrics, or ornamental panels.

## Color Roles

The palette should read as paper, graphite, cool emphasis, and separate status
states. Background and surfaces create calm document layers. Text roles separate
decisive headings, ordinary body copy, and quieter captions. Accent is for
links, active text, selected rows, and the rare primary action; do not use it as
a decorative stripe.

Status colors must always pair with text or glyphs. A risk, finding, verdict,
or confidence state should remain understandable in grayscale or for low-vision
readers. Avoid default colored left rails and rainbow callout stacks; use
labels, spacing, borders, and sentence-level clarity instead.

## Typography

Headings use a modest serif voice to give the artifact an editorial feel. Body
text uses system sans for scanability. Metadata, file paths, command output,
audit trails, and small labels use monospace. Keep letter spacing at zero and
avoid all-caps label walls.

Reserve large type for the document title and major section hierarchy. Compact
surfaces such as findings, tables, badges, and side navigation should stay
tight, legible, and workmanlike.

The scale is a small, bounded set of role tokens in `theme.css`
(`--type-caption` through `--type-h1`, plus `--type-metric`, leading, and
weight roles). Compact surfaces are fixed sizes so dense tables, code, and
metadata never drift; only the headline roles (`--type-h1`/`-h2`/`-h3`,
`--type-lead`, `--type-metric`) flex within a tight `clamp` so titles settle
on small screens without making the body fluid. The intent is refinement, not
larger or more decorative type: the editorial density of the first viewport,
tables, and ledgers is preserved. Headings and hero summaries balance their
wrapping; numeric surfaces use tabular figures so columns align; literal
technical surfaces (code, diffs, file paths, prompts) disable ligatures so
character sequences read exactly.

## Layout

Artifacts use a centered shell with generous page padding and a readable prose
measure. The first viewport should state the artifact type, title, and primary
takeaway without placing the hero in a decorative card.

Tables, code, diffs, diagrams, and screenshot rows must scroll inside their own
wrappers or collapse. The page itself must not acquire horizontal overflow on
mobile. Keep cards for repeated items, modals, evidence frames, and genuinely
framed tools; do not wrap every page section in a card.

Spacing follows the same discipline as type: a small, bounded rhythm rather than
ad-hoc pixels. `theme.css` holds one quiet step scale (`--space-2xs` through
`--space-xl`) plus role aliases for the surfaces that recur — stacked-block
rhythm, panel padding, table cell padding, and the page gutter. Panels, lists,
rows, and gaps share that beat so density reads as deliberate, not noisy. The
intent is a consistent, compact rhythm, not more air: the editorial tightness of
the first viewport, tables, and ledgers is preserved. True geometry — icon and
dot sizes, fixed nav rails, line-number columns, list indents, touch targets,
and the page's own edge padding — is sized for its job and sits outside the
rhythm scale. Reach for a new spacing step only when an existing one genuinely
cannot carry the layout; one more magic number is rarely the fix.

## Polish And Density

The first viewport must deliver value before navigation chrome: artifact type,
title, and the answer, verdict, recommendation, or decision should be visible
without scrolling. Keep section rhythm editorial: headings, tight explanatory
copy, then evidence or actions.

Prefer compact tables, rows, and lists for scanning. Use cards for discrete
objects that benefit from framing, such as findings, screenshots, concepts, or
handoff packets. Do not nest cards inside section cards, and do not style page
sections as floating cards.

Comparison grids should cap at three or four columns before wrapping. If the
reader compares axes more than visual states, use rows or a ledger instead of
large cards.

## Depth And Shape

Depth is expressed through tonal layers and hairline borders, not shadows.
Panels are for grouped data: metadata, findings, tables, code, captures, export
controls, and handoff packets. Avoid heavy shadows, glass effects, gradient
blobs, decorative depth, and abstract UI chrome that carries no information.

The radius system is intentionally restrained. Compact badges and controls stay
tight; rows and notes get a small radius; larger panels and screenshot frames
can be slightly softer. Do not inflate radius just to make the page feel more
designed.

## Motion

Motion is optional, brief, and purposeful. It marks a state change: copy
confirmation, disclosure, a focused before/after reveal, or a small transition
that clarifies relationship. There is no continuous, looping, or ambient motion.

Every animation must honor reduced motion. The reader should reach the same
final state with motion disabled, and no content should require waiting on or
triggering animation to be readable.

## Dark Mode

Dark mode is runtime-owned by `theme.css`, not this prose file. The CSS must
keep the OS-driven dark media query and the manual `[data-theme="dark"]`
override in parity, keep code surfaces dark through code-specific variables,
and hide the anchored theme toggle in print.

Both themes must hold contrast. Re-check badges, pills, warning states, and
evidence panels during polish, because status colors are where contrast most
often drifts.

Status and focus roles belong in `theme.css`: success, warning, danger, info,
pending, and focus ring tokens must exist in both light and dark theme blocks.
Component rules should consume those variables rather than hard-coded light-theme
fills.

## Anti-Patterns

- Decorative gradient blobs, orbs, and background effects that carry no
  information.
- Colored left rails, orange accent stripes, and callout bars as default
  emphasis.
- Fake KPIs, arbitrary chips, filler sparklines, and dashboard chrome that does
  not answer the reader's job.
- Nested cards or page sections styled as floating cards.
- Placeholder screenshots or abstract mockups in artifacts that claim visual
  QA.
- Uncontained tables, diffs, code, diagrams, or screenshots that force
  page-level horizontal scroll.
- Low-contrast text, color-only state, and status labels without words.
- Visible authoring scaffolding in reader artifacts.
- Long design rationale or source-specific provenance copied into generated
  artifacts.
