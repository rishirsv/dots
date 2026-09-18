# Concentric border radius

For close nested surfaces with a uniform inset and circular corners, derive the
inner radius from the distance between their outer edges:

```
innerRadius = max(0, outerRadius - inset)
inset = parentBorderWidth + parentPadding
```

Include any additional gap in the measured inset. With no parent border or gap,
this is the familiar `outerRadius = innerRadius + padding` relationship until
the inner radius reaches zero. Around `24px` of padding the layers may read as
independent surfaces; judge that relationship rather than treating the number
as a cutoff.

### Example

```css
/* Good: concentric radii */
.card {
  border-radius: 20px; /* 12 + 8 */
  padding: 8px;
}
.card-inner {
  border-radius: 12px;
}

/* Bad: same radius on both */
.card {
  border-radius: 12px;
  padding: 8px;
}
.card-inner {
  border-radius: 12px;
}
```

### Bordered parent

```css
.frame {
  --outer-radius: 20px;
  --frame-border: 1px;
  --frame-padding: 7px;
  border: var(--frame-border) solid var(--frame-edge);
  border-radius: var(--outer-radius);
  padding: var(--frame-padding);
}

.frame > .media {
  border-radius: max(0px, calc(
    var(--outer-radius) - var(--frame-border) - var(--frame-padding)
  ));
}
```

Here the inner radius is `12px`, not `13px`: the border contributes to the inset.
Compare the corner gap with the straight-edge gap. They should read as a
continuous band. If the inset exceeds the outer radius, the inner corner becomes
square; asymmetric insets or different corner shapes need individual judgment.

### Tailwind example

```tsx
// Good: outer radius accounts for padding
<div className="rounded-2xl p-2">       {/* 16px radius, 8px padding */}
  <div className="rounded-lg">          {/* 8px radius = 16 - 8 ✓ */}
    ...
  </div>
</div>

// Bad: same radius on both
<div className="rounded-xl p-2">
  <div className="rounded-xl">          {/* same radius, looks off */}
    ...
  </div>
</div>
```

Mismatched radii on closely nested surfaces are a common source of visual tension. Calculate concentrically where the layers share a visible, even inset. Keep an established component token where they are independent or the padding is deliberately asymmetric.
