# Interactive HTML

Use this when the user asks for controls, sliders, toggles, live charts,
simulation-like behavior, or a visual explanation that needs interaction.

## Output Model

Codex does not have a special inline HTML widget API. Create a self-contained
HTML file under `.agents/outputs/`, open it with Codex Browser, inspect it, and
give the user the absolute file path. If the user wants a polished saved document
with navigation or report structure, use `dots:html-artifact` instead.

Keep interactive explainers small: one concept, one visual region, and a few
controls that change the displayed state.

## Structure

- Use semantic HTML where it fits: `main`, `section`, `figure`, `label`,
  `button`, `input`, `output`, `table`, `details`.
- Put CSS in a single `<style>` block and small behavior in a final `<script>`.
- No build step, bundler, external runtime, or server unless the user requested
  an app.
- Prefer inline SVG for custom interactive diagrams because it gives stable
  layout and controllable labels.
- Use native controls for sliders, toggles, numeric inputs, select menus, and
  buttons.

## Styling

- Use CSS variables with light/dark support:
  `color-scheme: light dark`, neutral backgrounds, readable text, and semantic
  colors.
- Keep outer page backgrounds quiet. The visual region can be full-bleed or
  framed when the object needs a canvas.
- Avoid decorative shadows and gradients. One purposeful gradient is acceptable
  for physical quantities such as heat or pressure.
- Set stable dimensions for the drawing or chart area with `min-height`,
  `aspect-ratio`, or fixed SVG viewBox dimensions.
- Keep labels and controls readable at mobile widths.

## Interaction Rules

- Handle filtering, sorting, toggling, math, and visual state changes in local
  JavaScript.
- Use response prose for explanation; the HTML should not contain long teaching
  paragraphs.
- Round every displayed computed number with `Intl.NumberFormat`, `toFixed`, or
  `Math.round`.
- For animation, use CSS transforms and opacity where possible. Wrap nonessential
  animation in `@media (prefers-reduced-motion: no-preference)`.
- Keep keyboard interaction natural: real buttons, labels tied to inputs, visible
  focus states, and no hidden controls that trap focus.

## Validation

Open the file in Codex Browser first. Use Chrome only if Browser cannot open,
inspect, or screenshot the file.

Check:

- desktop width
- about 375px mobile width
- 320px reflow width when the layout is dense
- no page-level horizontal overflow
- controls update the intended state
- SVG/canvas/chart is nonblank and framed correctly
- labels do not overlap controls or each other
- reduced-motion mode is respected when animation exists

Report the browser used and any validation gap in the final handoff.
