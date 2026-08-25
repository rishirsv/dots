# Spacing And Layout

Read this when choosing or changing density, spatial rhythm, proportions,
alignment, component sizing, or responsive structure. Repository tokens and
platform conventions own exact values.

## Read The Existing System

Inspect the governing spacing tokens, layout primitives, component geometry,
safe areas, responsive rules, and interaction-target requirements before
introducing a value or scale. Preserve them for focused work. Extend them only
when the authorized direction needs a recurring meaning they do not express.

Assess the surface through these questions:

- **Grouping:** Are related elements closer than unrelated groups?
- **Hierarchy:** Does space reinforce the primary object, action, and reading
  order?
- **Rhythm:** Do repeated rows and regions form a coherent cadence without
  making unlike content look interchangeable?
- **Density:** Does the amount of information fit the task, device, and moment?
- **Structure:** Does the layout reflect real relationships rather than default
  containers or a uniform grid?
- **Balance:** Are opposing insets, centerlines, control dimensions, and visual
  mass intentionally balanced or intentionally asymmetric?
- **Adaptation:** Does the structure survive relevant width, text scaling,
  localization, keyboard, safe-area, and content extremes?
- **Interaction:** Do compact visuals retain the platform's usable target and
  focus behavior?

## Choose A Coherent Layout

Use the repository's scale and primitives when they fit. For greenfield work,
define the smallest spacing and sizing vocabulary the complete surface needs,
then use it consistently. Prefer semantic roles such as screen gutter, control
height, row cadence, and section separation over a collection of unrelated
numbers.

Let hierarchy determine spacing:

- keep tightly related labels, values, and controls together;
- separate distinct objects and stages enough to make their boundaries clear;
- vary long-surface rhythm when repetition stops helping comprehension;
- use containment only when it communicates ownership, actionability, or
  persistence;
- choose stacks, grids, rails, lists, canvases, bands, overlays, or open layouts
  from the information and interaction model rather than a preferred template.

Asymmetry, dense composition, generous whitespace, card grids, and full-bleed
layouts are all available when the brief supports them. Reject a pattern when
it flattens hierarchy or misrepresents relationships, not because it belongs to
a generic anti-pattern list.

## Refine Optically

Correct visible imbalance after inspecting the rendered surface. Small optical
adjustments are valid for glyphs, icons, baselines, and asymmetric shapes when
the governing component does not already own the correction. Do not introduce
speculative offsets from source inspection alone.

Keep a local adjustment private when it solves one composition. Promote a
shared token or component metric only when independent consumers need the same
meaning or adaptation.

## Finish

Inspect realistic content at the relevant sizes and states. The layout is ready
when its hierarchy remains legible, groupings and interaction targets hold,
repetition feels intentional, and no isolated spacing or dimension lacks a
product or platform reason.
