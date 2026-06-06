---
name: ui-polish
description: "Use when iteratively polishing an existing UI surface, component, route, or flow through focused hierarchy, spacing, typography, visual craft, interaction state, motion, responsive, accessibility, or microcopy edits; not for broad redesign, new product direction, critique-only reviews, or unrelated feature work."
---

# UI Polish

Improve an existing UI surface through focused craft passes, then verify the result with visual and build proof.

This is a child of `$design`. Use it when the user has a target surface and wants edits, not only critique. Keep the scope to the named screen, component, route, flow, or state.

## Route First

- Use `$design-review` when the next useful move is critique without edits.
- Use `$ideate` when the user wants options, a new look, or broad visual exploration before choosing a direction.
- Use `$design-review` when a rendered implementation must be compared against a selected target, mockup, screenshot, Figma frame, or design intent.
- Stay in `$ui-polish` when the target exists and the job is iterative improvement of the current implementation.

If the target surface is missing, ask for it before editing. If the request implies a new product direction, IA change, or feature concept, route away instead of sneaking redesign into polish.

## Inputs

Start from the closest available context:

- current screenshot, route, component, preview, simulator surface, or recorded flow
- prior `$design-review` findings, selected visual direction, or user-marked issues
- design docs, brand docs, tokens, component patterns, platform conventions, and existing nearby screens
- real content, edge states, and user constraints such as "preserve active workout state" or "make this feel quieter"

If findings are absent, stale, or too vague to guide edits, inspect the surface first. Run or emulate `$design-review` from visual evidence when useful, then turn only actionable findings into polish tasks.

## Polish Lanes

Prioritize the lanes that most improve the surface while preserving its product intent:

- Hierarchy: focal point, grouping, scan path, disclosure, primary and secondary actions.
- Spacing and layout: rhythm, alignment, density, stable dimensions, responsive behavior, and resilient long-content layouts.
- Typography: scale, weight, line length, line height, truncation, tabular data, and text hierarchy.
- Visual craft: color use, contrast, icon fit, borders, elevation, materials, imagery, and component consistency.
- Interaction states: hover, focus, pressed, selected, loading, disabled, empty, error, success, destructive, undo, and retry states.
- Motion and feel: transition timing, continuity, tactile feedback, haptics where supported, and reduced-motion alternatives.
- Accessibility: semantic labels, keyboard/focus order, touch targets, contrast, text scaling, color-independent state, screen reader clarity, and reduced motion.
- Microcopy: labels, empty and error text, button language, confirmations, inline hints, and state clarity.

## Implementation

Make the smallest coherent set of edits that can move the surface toward the requested quality bar. Match the existing codebase, design system, platform conventions, and nearby patterns before inventing new components or tokens.

Keep each pass tied to an observed issue or requested quality goal. Do not make broad redesigns, new navigation models, new product direction, unrelated feature work, dependency additions, or large refactors unless the surface cannot be polished without them.

Prefer real rendered states over static guesses. Exercise representative data, empty/error/loading states, narrow and wide viewports, keyboard/focus paths, text scaling or long text, and reduced-motion behavior when the platform supports them.

## Iteration Loop

Use a critique-edit-proof loop:

1. Inspect the current surface and gather existing `$design-review` findings or create a compact findings list from visual evidence.
2. Pick a focused pass across one or a few polish lanes, with the expected user-visible improvement.
3. Edit the implementation within the named surface.
4. Capture proof: screenshot, simulator capture, preview render, Storybook state, browser capture, focused test, lint, build, or accessibility check.
5. Reinspect the result against the findings and requested quality bar.
6. Repeat while the next pass is clear and scoped.

Stop when the surface reaches the requested bar, when remaining issues require a user choice, or when proof cannot be gathered with available tools. Do not claim "looks better" without naming the evidence and the concrete changes that support it.

## Proof

Capture visual proof whenever the project supports it. Prefer before/after screenshots for visual polish, viewport captures for responsive polish, focused tests or accessibility checks for behavior and semantics, and build or lint checks for implementation safety.

If proof is unavailable, state the exact limitation and distinguish verified changes from reasoned expectations.

## Output

Report:

```text
Changed: <surface and main polish moves by lane>
Proof: <screenshot/render/test/build/accessibility check or limitation>
Remaining: <remaining user-choice items, proof gaps, or follow-up risks>
```
