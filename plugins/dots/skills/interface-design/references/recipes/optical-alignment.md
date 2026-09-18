# Optical alignment

When geometric centering looks off, align optically instead.

Squint at the control or temporarily blur the glyph in the inspector to see
where its visual weight sits. Compare the original and adjusted glyph at its
actual display size, then remove the diagnostic blur. Correct the glyph without
moving the control's hit area or changing the alignment of neighboring controls.

### Buttons with text + icon

Where an icon makes symmetric padding look unbalanced, use slightly less on the icon side. A starting point:
`icon-side padding = text-side padding - 2px`.

```css
/* Good: less padding on icon side */
.button-with-icon {
  padding-inline-start: 16px;
  padding-inline-end: 14px; /* trailing icon side = text side - 2px */
}

/* Bad: equal padding looks like icon is pushed too far right */
.button-with-icon {
  padding-inline: 16px;
}
```

```tsx
// Tailwind
<button className="ps-4 pe-3.5 flex items-center gap-2">
  <span>Continue</span>
  <ArrowRightIcon />
</button>
```

### Play button triangles

Play icons are triangular and their geometric center is not their visual center.
A small rightward shift is a useful starting point for a right-pointing triangle.
Check the actual path and viewBox: an icon may already include that correction,
and neither its direction nor the amount should be applied to every glyph.

```css
/* Candidate correction: compare with the unshifted glyph */
.play-button svg {
  transform: translateX(2px); /* physical correction to the glyph itself */
}

/* Baseline: may already be optically balanced by the icon author */
.play-button svg {
  /* no adjustment */
}
```

### Asymmetric icons (stars, arrows, carets)

Some icons carry uneven visual weight. The best fix is adjusting the SVG directly, so the component needs no extra margin or padding.

```tsx
// Best: fix in the SVG itself
// Adjust the viewBox or path to visually center the icon

// Fallback: adjust with margin
<span className="translate-x-px">
  <StarIcon />
</span>
```
