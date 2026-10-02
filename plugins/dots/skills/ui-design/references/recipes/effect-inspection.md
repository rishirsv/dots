# Inspect A Visual Effect

Use when a live reference’s blur, gradient, masking, or motion needs explanation
before recreation. Use the available browser tools to inspect the named region
and the adjacent layers it depends on. Follow the tool’s permitted inspection
APIs.

## Find the layers that produce the effect

A visual effect can depend on several layers and declarations. Inspect their
combined effect rather than assuming one declaration explains the result.

A hero gradient is commonly four things at once:

- An element oversized past its container and pushed partly outside it, so no edge is ever visible.
- A multi-stop gradient at low alpha, often four stops around 20% opacity.
- A large `filter: blur()`, which blends the discrete stops.
- Sometimes a layer above with `backdrop-filter`, which blurs the content behind it.

Report the layers in paint order. For each layer, identify the declaration that
produces its effect. Include blur and element size when they determine the
visible result; `linear-gradient()` alone does not explain those effects.

## Explain how the values produce the effect

For each layer, explain the technique and what it changes in the visible result.
Include that explanation alongside measured values.

For example, `opacity: 0 → 0.85 at 20% → 1` over `1500ms` reaches 85% opacity in
the first 300ms. The remaining 15% takes 1200ms. The layer becomes visible
quickly, then fades slowly toward its final opacity. A linear `0 → 1` over the
same duration would appear different.

## Inspect candidates

Read computed styles on the element and its `::before` and `::after`: background
images, filters, backdrop filters, masks, blend modes, opacity, transforms, and
shadows. Check whether a pseudo-element actually generates a box. Ignore
identity values such as `blur(0px)` as explanations of the effect, but inspect
the active state before dismissing an animated property.

Use `elementsFromPoint` to locate candidate elements in a region. It reflects
hit testing, not every painted layer: decoration with `pointer-events: none`,
pseudo-elements, and shadow contents need separate inspection. Resolve stacking
contexts, DOM order, and overlays; sorting coordinates and `z-index` alone does
not establish paint order.

Use `getAnimations()` for CSS transitions, CSS animations, and Web Animations
playback while the effect is active. Trigger the actual interaction before
recording timing. An empty result at rest does not disprove animation, and
frame-driven scripts may not appear there.

If the visible result remains unexplained, inspect relevant SVG filters, images,
video, canvas, and clipped or inaccessible content. Finding no explanation in
CSS does not prove that the effect uses a shader. Avoid calling
`canvas.getContext()` merely to detect a renderer; it can create or lock a
context.

## Separate measurements from inference

Name values read from computed styles as measured, relationships calculated from
them as derived, and guesses about intent or authoring technique as inferred.
Compiled styles do not reveal which source helper the author used. Identify
unreadable stylesheets or missing states.

From a screenshot, propose how the effect could be built; do not claim to have
recovered its code. Pixel samples depend on capture scale, antialiasing, and
color processing. Keep uncertain authored colors, dimensions, and motion
explicit.
