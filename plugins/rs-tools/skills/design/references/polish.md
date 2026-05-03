# Polish

Polish improves an existing, mostly functional surface. It makes the UI feel intentional, aligned, and ready.

## Rule

Polish is visual-first. Use the best available way to see the actual surface:

1. Native app, simulator, device screenshot, or preview.
2. Browser Use, Agent Browser, or in-app browser.
3. Project-native screenshot, snapshot, or preview tooling.
4. Existing screenshots or user-provided images.
5. Static code review only as fallback.

If the surface cannot be rendered, say so.

## Loop

Default to 1-3 focused passes unless the user asks for deep polish or screenshots show obvious defects.

1. Load `docs/DESIGN.md`, adjacent UI, and current conventions.
2. Capture or inspect the current surface. Save new screenshots using the artifact routing below when the capture tool can write files.
3. Name the top issues.
4. Choose a focused pass.
5. Patch.
6. Render again. Save after screenshots to the same folder when possible.
7. Compare before and after.
8. Repeat while the surface is improving.

Stop when remaining issues are minor, out of scope, unverifiable, or require a redesign.

## Screenshot Artifacts

When saving polish screenshots, use one compact folder:

```text
.agents/screenshots/
```

Keep screenshots out of `docs/`, release notes, and design-source files. These are operational evidence, not documentation. Do not commit them unless the user asks.

Use sequence-friendly names that include a short surface slug:

- `<surface>-00-reference.png` for a provided reference copied into the folder
- `<surface>-00-current.png` for a single baseline capture
- `<surface>-01-before-pass-01-desktop.png`
- `<surface>-02-after-pass-01-desktop.png`
- `<surface>-03-before-pass-01-mobile.png`
- `<surface>-04-after-pass-01-mobile.png`

Include viewport or state in the filename when it matters: `mobile`, `desktop`, `empty`, `error`, `loading`, `dark`, `rtl`, or the route name. If a tool produces its own filenames, move or rename the files into this structure when practical.

When the user asks for comparison, evaluator review, or persisted artifacts, pass `.agents/screenshots/` as the evidence bundle. Exact file paths are optional, but the final response should name the screenshot folder and the viewports or states captured.

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

Report what changed, what was inspected, which viewports or states were checked, the screenshot folder when artifacts were saved, and what remains unverified.
