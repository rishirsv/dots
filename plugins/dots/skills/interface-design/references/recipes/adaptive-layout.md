# Adapt Component Geometry

Use when implementing direction-aware layout or a component whose container can resize independently of the viewport.

## Use logical properties

Express direction-dependent horizontal position as leading/trailing so the layout mirrors automatically under `dir="rtl"`:

| Physical (avoid) | Logical (use) |
| --- | --- |
| `margin-left` | `margin-inline-start` |
| `padding-right` | `padding-inline-end` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `border-right` | `border-inline-end` |

```html
<!-- Good: Tailwind logical utilities -->
<div class="ms-4 pe-6 text-start">…</div>

<!-- Bad: breaks in RTL -->
<div class="ml-4 pr-6 text-left">…</div>
```

Reserve physical properties for things that refer to physical screen sides whatever the language, such as positioning against a device notch or matching a gesture direction.

Where arrangement encodes reading progression, check its direction in RTL. Flex and grid honor writing direction, but explicit placement can override it. Digit order inside numbers does not reverse; for mixed-direction values, read [text CSS](text-css.md).

## Hold structure until it breaks

Prefer **container queries** for components whose layout depends on their available column. A card adapts to the column it is in, not to the viewport. Choose the threshold where its content stops fitting; `400px` below is an example.

```css
/* Good: component adapts to its container */
.card-list { container-type: inline-size; }
.card { display: grid; grid-template-columns: auto minmax(0, 1fr); }
@container (max-width: 400px) {
  .card { grid-template-columns: 1fr; }
}

/* Viewport queries alone miss a card inside a narrow sidebar */
@media (max-width: 768px) {
  .card { grid-template-columns: 1fr; }
}
```

Test the smallest and largest supported sizes first, since those break first, then the sizes between.
