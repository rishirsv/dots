# Surface Gates

Read this when the UI type has specific preservation rules. Apply the relevant
gate in addition to the main workflow and Image Gen fidelity rules.

## Landing And Company Sites

Preserve the first viewport, hero role, brand/nav/CTA labels, section order,
next-section preview, and signature imagery. The landing page can be expressive,
but the offer and primary action must remain readable before the user scrolls.

## Product And SaaS Pages

Preserve product mockups, workflow diagrams, feature strips, proof elements, and
brand treatment. Use interactive hero UI only when it genuinely represents the
product or demo.

## Dashboards And Tools

Preserve density, sidebars, headers, tables, tabs, timelines, charts, maps, row
counts, selected rows, detail panels, and command surfaces. Do not turn
table-driven concepts into card grids.

## Canvas And Editor Tools

Preserve default zoom and pan, canvas or document text scale, chrome density,
toolbars, sidebars, inspector controls, layer rows, status bars, command
surfaces, and autosaved/seed-state behavior. Audit app chrome separately from
canvas/document content during verification.

## Timeline And Planning Tools

Preserve grid/time-axis anatomy, row spans, event density, status rails, command
center fit, drag/edit affordances, and compact label behavior.

## Clone-Like Interfaces

Preserve the recognizable product skeleton before adding polish. Do not add
marketing heroes, custom navigation, or decorative wrapper sections that break
the product type.

## Games

Preserve the art direction with Image Gen assets for sprites, tiles/platforms,
collectibles, hazards, goals/checkpoints, props, and background/parallax layers.
Verify that assets load, scale, animate or swap states correctly, align with
collision geometry, and support movement, action/jump/drag behavior, scoring,
hazards, restart, and core loops.

Keep HUD text, score, controls, hit boxes, physics, and game state code-native.
Any code-drawn or vector game art must be listed as an intentional deviation or
concrete blocker.

## Media Surfaces

Verify real media load, duration, play/pause, seek/progress, and visible frame
changes. Do not ship fake media progress or controls that do not update local
state.

## Forms, Booking, Purchase, And Restaurant Flows

Verify the main transaction path and confirmation state. Include empty, error,
disabled, loading, success, and edge states for the main form or transaction
flow.
