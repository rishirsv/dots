---
name: design-review
description: "Use when critiquing an existing product screen, component, flow, screenshot, rendered UI, implementation, or target-vs-rendered design match for UX clarity, hierarchy, accessibility, platform fit, product fit, resilience states, fidelity, and visual craft; not for implementing fixes, generating new visual directions, or code review."
---

# Design Review

Critique an existing design surface from evidence, or compare a rendered implementation against an approved design target, and return prioritized, actionable findings.

This is the review child of `$design`. Use it when the next useful design move is judgment, not implementation. If the user asks for edits, fixes, polishing, motion, responsive tweaks, accessibility changes, or microcopy changes, route to `$ui-polish` instead of editing from this skill.

Do not create new visual alternatives, generate concepts, or perform general code review. Route visual exploration to `$ideate`. Handle target-vs-implementation checks here when both a source target and rendered implementation exist.

## Start

1. Name the surface being reviewed: screen, component, flow, route, screenshot, simulator view, Storybook story, or implementation area.
2. Read nearby product, brand, platform, accessibility, and design-system guidance before judging the surface against generic taste.
3. Prefer rendered evidence. Use the app, browser, simulator, preview, screenshot tooling, or user-provided images when available.
4. If only code or docs are available, perform a static design review and mark proof limits clearly.
5. Stay read-only. Do not patch, stage, commit, publish, update trackers, or leave generated artifacts behind.

## Review Mode

Choose the mode from the available evidence:

- Surface critique: use when reviewing an existing screen, flow, screenshot, product surface, or implementation without a single approved target. Judge UX clarity, hierarchy, accessibility, product fit, platform fit, resilience, and craft.
- Target comparison: use when both sides exist: an approved visual target or design intent, and a rendered implementation. Judge fidelity, acceptable deviations, state coverage, responsive behavior, accessibility, and handoff readiness.

If target comparison is requested but either side is missing, report `BLOCK` and name the missing artifact. Do not invent the target from memory or vague intent.

## Evidence

Review from the strongest evidence available, in this order:

1. Live or rendered product surface: local route, native app, simulator, preview, Storybook, browser capture, or screenshot test output.
2. User-provided screenshots, videos, mockups, Figma exports, recordings, or image attachments.
3. Product specs, design docs, brand docs, screen inventories, component docs, existing components, design tokens, and platform conventions.
4. Static source inspection when rendering is unavailable.

Use visual evidence to verify what is actually visible, not merely what the code suggests. If a route cannot be rendered, say which viewport, state, interaction, or platform behavior could not be verified.

When a read-only design-reviewer subagent is available, give it a compact brief with the target surface, screenshots or route, relevant docs, and the question being reviewed. Do not send a full conversation dump.

## Audit Lenses

Use the product's local design system and platform conventions over generic preference when they conflict. Treat design as product judgment: clarity, trust, fit, and resilience matter more than decorative novelty.

Evaluate only issues that affect user experience, product trust, accessibility, platform fit, brand/taste fit, or implementation resilience:

- Intent and hierarchy: purpose, focal point, scan path, primary action, and what changed.
- UX clarity: labels, information architecture, cognitive load, progressive disclosure, copy, and next-step confidence.
- Interaction states: loading, empty, error, success, disabled, destructive, undo, retry, hover, focus, and pressed behavior.
- Visual craft: spacing, rhythm, typography, contrast, affordance, density, imagery, icon fit, component consistency, and depth language.
- Product fit: whether the surface supports the domain, user moment, and task frequency instead of looking generically polished.
- Platform fit: familiar controls, navigation, feedback, typography, motion, keyboard/touch behavior, and platform accessibility expectations.
- Accessibility: contrast, labels, roles/traits, keyboard or screen reader order, focus visibility, touch targets, text scaling, reduced motion, and color-independent state.
- Resilience: long text, missing data, narrow screens, wide screens, localization, dense lists, repeated items, real content, and failure states.
- Implementation leakage: internal state names, placeholder copy, fake metrics, scaffold text, or agent rationale surfaced to users.
- Generated-pattern risk: card mosaics, one-note palettes, ornamental gradients, over-rounded controls, repeated templates, or generic marketing copy when they weaken trust or comprehension.

## Target Comparison

When comparing a rendered implementation to an approved target, capture or inspect the implementation at the relevant viewport and state. Compare:

- Layout: structure, spacing, alignment, density, breakpoints, overflow, and clipping.
- Typography: family, size, weight, line height, wrapping, hierarchy, and text fit.
- Color and material: backgrounds, text, borders, elevation, opacity, contrast, and depth language.
- Components: icons, buttons, controls, inputs, cards, lists, navigation, imagery, and affordances.
- States: loading, empty, error, success, focus, hover, active, selected, disabled, destructive, and reduced motion.
- Accessibility: labels, focus order, target sizes, contrast, text scaling, screen reader clarity, and non-color state cues.

Separate fidelity gaps from intentional improvements. If a deviation improves accessibility, platform fit, or product clarity, list it as an accepted deviation rather than a defect.

## Severity

Use severity to express user impact:

- `P0`: blocks task completion, release, safety, trust, or accessibility.
- `P1`: major user, product, platform, or release risk on an important surface.
- `P2`: real issue that should be fixed soon because it affects comprehension, usability, accessibility, resilience, or craft.
- `P3`: polish issue with limited blast radius.

Do not invent findings to fill a quota. If the surface is solid, say so and focus on proof limits.

## Finding Bar

Lead with findings, ordered by severity. Each finding must include:

- the exact surface or state affected
- evidence inspected, such as screenshot, route, viewport, code path, or static context
- what fails in the user's experience
- why it matters for task success, trust, accessibility, platform fit, or product fit
- a concrete recommendation direction

Skip generic taste notes such as "make it cleaner" unless you can tie them to a visible failure. Do not report detector-style or code-pattern concerns unless they are visible, likely to become visible with real content, or directly affect accessibility/resilience.

Include what is working only after findings, and keep it brief.

## Proof Limits

Be explicit about what was and was not inspected:

- screenshots, routes, files, viewports, simulators, devices, or docs reviewed
- source target and rendered target when doing target comparison
- states verified or not verified: loading, empty, error, success, disabled, destructive, long text, localization, narrow/wide viewport, keyboard/focus, screen reader, reduced motion
- checks run, if any

Never imply rendered proof when the review was static. Never present code inspection as proof of visual quality.

## Output

Use this shape:

```text
Verdict: APPROVE | REQUEST_CHANGES | BLOCK
Mode: surface critique | target comparison

Findings
- [P0|P1|P2|P3] Title
  Surface:
  Evidence:
  What fails:
  Why it matters:
  Recommendation:

What Works
- ...

Accepted Deviations
- ...

State And Accessibility Matrix
- Loading:
- Empty:
- Error:
- Success:
- Disabled/destructive:
- Long text/localization:
- Small/large viewport:
- Keyboard/focus/screen reader:
- Reduced motion:

Open Risks
- ...

Proof
- Source target: <for target comparison, or n/a>
- Rendered target: <for target comparison, or n/a>
- Evidence inspected:
- Checks run:
- Proof limits:
```

Use `APPROVE` when no material design issues were found for the inspected scope. Use `REQUEST_CHANGES` when there are actionable issues that should be addressed before handoff. Use `BLOCK` when the surface has a critical usability, accessibility, trust, or release-readiness failure.
