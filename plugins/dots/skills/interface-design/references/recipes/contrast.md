# Measure Contrast

Contrast is measured between a **foreground color**, meaning text, an icon, or a UI element, and the **background color** it actually renders against, usually the nearest ancestor that paints one. Identify that background first. Measuring against the page background when the element sits on a card gives the wrong answer.

Use the project's required standard and level as the gate. For WCAG 2.x AA, normal text generally needs 4.5:1; large text needs 3:1 (18pt, or 14pt bold). Required non-text component and graphical information generally needs 3:1 against adjacent colors. Check applicability and exceptions in the text contrast and non-text contrast criteria. Keep APCA, if used, as a separately identified design measure rather than a substitute conformance result.

Record the foreground, actual background, state/theme, measurement method, result, and threshold. Resolve alpha and overlapping layers before measuring. Use a tool that supports the color space in question; arbitrary conversions or antialiased glyph-edge samples can misstate contrast. A screenshot supplies rendered evidence, not the original authored color values.

For a review, report the failing pair. For an authorized correction, change the governing token or local role and check its other uses.

## Fix a failing pair

Move the foreground away from the background in perceived lightness, holding hue and saturation, then remeasure. Keeping hue fixed is what stops a contrast fix becoming a palette change.

If no foreground meets the target while preserving the design, change the background or introduce a controlled surface. Pushing lightness can push the color out of gamut; reduce chroma as needed and measure the mapped result.

Always remeasure after changing a value. Do not assume a fix landed.

## What to check

- **Every pair, in every appearance.** A pair passing in light mode can fail in dark. The palettes are not mirror images.
- **Translucent surfaces.** A color on a `backdrop-filter` header or an overlay shifts with whatever scrolls behind it. Test against the lightest and darkest content it can sit over, or make the surface opaque enough that the shift cannot break the pair.
- **Computed colors.** `color-mix()`, relative color syntax and opacity modifiers resolve at render time; measure the rendered result, not the declaration.
- **Text over images.** There is no single background color. Measure the worst region, or guarantee one with a scrim.
