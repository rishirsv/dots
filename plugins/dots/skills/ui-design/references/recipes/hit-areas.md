# Size And Protect Hit Areas

WCAG 2.5.8 Level AA requires a 24×24 CSS-pixel target or one of its exceptions. Use larger usability targets where space permits; 44 CSS pixels is a useful web touch starting point, subject to the project’s target-size standard. Smaller controls are not automatic failures. Check the spacing, equivalent-control, inline, user-agent and essential exceptions before reporting one.

Under the spacing exception, an undersized target passes when a 24px circle centered on its bounding box intersects no other target and no other undersized target's circle. In the simple case, 20px targets need a 4px gap.

The visible element can stay small; the hit area is what must be big. Anything that looks clickable must be clickable across its whole visual extent, with no dead zones. A checkbox and its associated label share one hit target.

## Expanding the hit area

Where the visible element is smaller, say a 20×20 checkbox, extend the hit area with a pseudo-element. Put it on the wrapping `<label>` or `<button>`, never on the `<input>`, because replaced elements don't render `::before`/`::after` reliably.

### CSS example

```css
/* Small checkbox with expanded 44px hit area, on the wrapping label */
.checkbox-label {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
}

.checkbox-label::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%; /* physical centering: direction-independent */
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
}
```

### Tailwind example

```tsx
<button type="button" aria-label="Confirm selection" className="relative size-5 after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2">
  <CheckIcon aria-hidden="true" />
</button>
```

### Layout alternative

Where the element can afford real box size, skip the pseudo-element and let the box be the target. That hands the browser real geometry for scrolling and gestures:

```css
.icon-button {
  min-width: 44px;
  min-height: 44px;
  display: inline-grid;
  place-items: center;
}
```

## Collision rule

Where the extended hit area overlaps another interactive element, shrink the pseudo-element to the largest size that does not collide. If shrinking loses a needed target size, increase the layout spacing or give the control a real larger box. Verify the edges activate the intended control, including where ancestors clip overflow.

## Decorative layers

A decorative layer painted over interactive content absorbs every pointer event its box covers: a gradient scrim, a glow, a blurred sheen, a full-bleed `::after`. The control underneath looks live and does nothing, and no hit-area sizing fixes it.

Give each one `pointer-events: none` (Tailwind `pointer-events-none`) so events reach the control below, plus `aria-hidden="true"` on decorative DOM elements. Pseudo-elements have no HTML attribute to set; keep their content empty:

```css
.card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
```

Keep pointer events on any layer the user is meant to hit: a modal scrim that dismisses on click is a control, not decoration.

Check the applicable target-size requirement and exceptions; do not report a small visible glyph as a failed hit target without checking its clickable extent.
