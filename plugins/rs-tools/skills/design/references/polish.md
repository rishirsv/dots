# Polish

Polish improves an existing, mostly functional surface. It makes the UI feel intentional, aligned, and ready.

## Rule

Polish is visual-first. Use the best available way to see the actual surface:

1. Native app, simulator, device screenshot, or preview.
2. Browser Use, Agent Browser, or in-app browser.
3. Playwright or project screenshot tooling.
4. Existing screenshots or user-provided images.
5. Static code review only as fallback.

If the surface cannot be rendered, say so.

## Loop

Default to 1-3 focused passes unless the user asks for deep polish or screenshots show obvious defects.

1. Load `docs/DESIGN.md`, adjacent UI, and current conventions.
2. Capture or inspect the current surface.
3. Name the top issues.
4. Choose a focused pass.
5. Patch.
6. Render again.
7. Compare before and after.
8. Repeat while the surface is improving.

Stop when remaining issues are minor, out of scope, unverifiable, or require a redesign.

## Good Polish

Fix:

- weak hierarchy
- awkward density
- misalignment
- muddy typography
- arbitrary spacing
- text overflow
- unclear labels or CTAs
- rough empty/loading/error/success states
- missing hover, focus, pressed, disabled, selected, loading, or success states
- token/component drift
- inconsistent sibling screens
- janky or purposeless motion
- overly loud or overly timid visual intensity
- small moments of earned delight in completion, onboarding, and recovery

Do not turn polish into:

- a new product direction
- a wholesale IA redesign
- a new design system
- broad performance work
- speculative feature creation
- unrelated refactors

## Pass Types

Read [lenses.md](lenses.md) for detailed tactics when a pass touches:

- typography
- layout rhythm
- brand landing pages
- imagery
- motion
- copy
- product micro-polish

Use these common pass intents:

- Typography: role scale, weight, line-height, measure, wrapping, stable numerals, font loading.
- Layout: spacing scale, grouping, density, visual rhythm, alignment, structural hierarchy.
- Color: semantic meaning, contrast, token use, color strategy, product/brand dosage.
- Copy: labels, CTAs, errors, empty states, confirmations, tooltips.
- Motion: state feedback, continuity, reduced motion, smoothness.
- Intensity: make it bolder through clarity and hierarchy, or quieter through reduced noise.
- Design-system alignment: replace one-offs with shared components or tokens when the match is clear.

## Finish

Report what changed, what was inspected, which viewports or states were checked, and what remains unverified.
