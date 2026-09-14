# Inspect A Visual Effect

Use when a live reference’s blur, gradient, masking, or motion needs explanation before recreation. Inspect the named region and adjacent layers it depends on through the available browser tools; follow that tool’s permitted inspection APIs.

## Find the layers, not the element

Ask what makes a gradient and the answer is almost never one declaration. Visual effects are stacks, and the stack is the explanation.

A hero gradient is commonly four things at once:

- An element oversized past its container and pushed partly outside it, so no edge is ever visible.
- A multi-stop gradient at low alpha, often four stops around 20% opacity.
- A large `filter: blur()`, which turns the discrete stops into a wash.
- Sometimes a layer above with `backdrop-filter`, which frosts whatever shows through.

Report the stack in paint order with the declaration doing the work on each layer. A reader who has the stack understands the effect. A reader given only the `linear-gradient()` does not, because the blur and the oversize produce most of what they were looking at.

## Explain the mechanism, not the readout

A table of measured values is not an explanation. Each layer needs the technique that produces it and the perceptual job it does, or the reader is left holding numbers they cannot use.

Take `opacity: 0 → 0.85 at 20% → 1` over `1500ms`. That is the readout. The explanation is that 85% of the fade lands in the first 300ms, and the last 15% takes the remaining 1200ms. The layer arrives at once and never reads as finished, which a linear `0 → 1` over the same duration cannot do.

## Inspect candidates

Read computed styles on the element and its `::before` and `::after`: background images, filters, backdrop filters, masks, blend modes, opacity, transforms, and shadows. Check whether a pseudo-element actually generates a box. Ignore identity values such as `blur(0px)` as explanations of the effect, but inspect the active state before dismissing an animated property.

Use `elementsFromPoint` to locate candidate elements in a region. It reflects hit testing, not every painted layer: decoration with `pointer-events: none`, pseudo-elements, and shadow contents need separate inspection. Resolve stacking contexts, DOM order, and overlays; sorting coordinates and `z-index` alone does not establish paint order.

Use `getAnimations()` for CSS transitions, CSS animations, and Web Animations playback while the effect is active. Trigger the actual interaction before recording timing. An empty result at rest does not disprove animation, and frame-driven scripts may not appear there.

If the visible result remains unexplained, inspect relevant SVG filters, images, video, canvas, and clipped or inaccessible content. An empty CSS search does not prove a shader. Avoid calling `canvas.getContext()` merely to detect a renderer; it can create or lock a context.

## Separate measurements from inference

Name values read from computed styles as measured, relationships calculated from them as derived, and guesses about intent or authoring technique as inferred. Compiled styles do not reveal which source helper the author used. Identify unreadable stylesheets or missing states.

From a screenshot, propose how the effect could be built; do not claim to have recovered its code. Pixel samples depend on capture scale, antialiasing, and color processing. Keep uncertain authored colors, dimensions, and motion explicit.
