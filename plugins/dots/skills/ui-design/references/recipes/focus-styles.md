# Focus Styles

Use `:focus-visible` for a custom focus indicator. Let browser heuristics decide when it is needed, including on text fields focused with a pointer. Never write `outline: none` or `focus:outline-none` without a visible replacement, which removes keyboard navigation for sighted keyboard users.

Prefer the browser's unmodified focus indicator, which adapts to platform and forced-color settings without the author predicting every background. Adding only `outline-offset` preserves it. A custom `outline: 2px solid` with no color renders `currentColor`, which is not automatically accessible, because the outline may cross colors unlike the text's own background. The preference order:

```css
/* Best: keep the browser ring, just give it breathing room */
:focus-visible {
  outline-offset: 2px;
}

/* Custom ring when the design requires one: use the project's verified token */
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

```tsx
// Tailwind: use the project's focus token or established focus-ring utility
<button className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]">
  Save
</button>
```

A custom focus indicator must meet the applicable project or WCAG target for visible area and change of contrast. Inspect the whole perimeter against every adjacent color it crosses: component fills, page surfaces, images, gradients, hover and selected states. A token, brand color, or `currentColor` passes only when that rendered check does.

In `forced-colors: active` (Windows High Contrast), keep the default color adjustment or name a system color such as `Highlight`. `forced-color-adjust: none` freezes the authored color, so use it only where you have checked the control stays perceivable.

Group focus styles with `:focus-within` when a wrapper should light up while an inner input has focus (e.g. a search box with an icon inside the border).
