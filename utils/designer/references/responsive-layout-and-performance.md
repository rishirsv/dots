# Responsive layout and performance

Use this to improve adaptation across devices and preserve perceived quality.

## Responsive behavior
- Let content define breakpoints; avoid arbitrary device-based assumptions.
- Keep layout hierarchy stable when moving between viewport sizes.
- Prefer progressive enhancement for richer layouts.

Quick checks:
- Does the same content priority survive on mobile and desktop?
- Are column collapses/reflows predictable and clean?
- Do cards/lists preserve alignment after wrapping?

## Input-modality awareness
- Apply hover behaviors only on devices that support hover.
- Maintain strong focus-visible and tap feedback for keyboard/touch users.
- Avoid interaction patterns that require precision cursor movement on touch-first flows.

## Performance as design quality
- Reserve space for media/async content to avoid layout jumps.
- Prefer transform/opacity for animation where possible.
- Keep interaction feedback fast and predictable.

## Practical quality targets
- Core Web Vitals targets:
  - LCP <= 2.5s
  - INP <= 200ms
  - CLS <= 0.1
- Human perception anchors:
  - ~0.1s feels instantaneous
  - ~1s keeps flow of thought
  - ~10s risks abandonment without progress feedback

Sources:
- https://web.dev/articles/defining-core-web-vitals-thresholds
- https://web.dev/articles/optimize-cls
- https://web.dev/learn/design/interaction
- https://www.nngroup.com/articles/website-response-times/
