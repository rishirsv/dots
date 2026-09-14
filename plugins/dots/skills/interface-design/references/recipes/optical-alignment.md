# Optical alignment

When geometric centering looks off, align optically instead.

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

Play icons are triangular and their geometric center is not their visual center. Shift slightly right:

```css
/* Good: optically centered */
.play-button svg {
  transform: translateX(2px); /* physical correction to the glyph itself */
}

/* Bad: geometrically centered but looks off */
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
