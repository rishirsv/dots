# Image outlines

Apply this web treatment to content imagery that needs separation. Exclude
decorative images and logos unless their treatment calls for it.

Add a `1px` outline at low opacity to images for consistent depth, especially where other elements use borders or shadows.

### Color rules (non-negotiable)

- **Light mode**: pure black, `oklch(0 0 0 / 0.1)`.
- **Dark mode**: pure white, `oklch(1 0 0 / 0.1)`.
- Never a near-black or near-white from the project palette, such as slate-900, zinc-900, `#0a0a0a`, `#111827`, or `#f5f5f7`. Tinted outlines pick up the surrounding surface color and read as dirt on the image edge.
- Never match the outline to the project's accent or ink color. The outline is a neutral separator, not a themed element.

### Light mode

```css
img {
  outline: 1px solid oklch(0 0 0 / 0.1);
  outline-offset: -1px; /* draw the ring just inside the image edge */
}
```

### Dark mode

```css
img {
  outline: 1px solid oklch(1 0 0 / 0.1);
  outline-offset: -1px;
}
```

### Tailwind with dark mode

```tsx
<img
  className="outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
  src={src}
  alt={alt}
/>
```

**Why outline instead of border?** `outline` never affects layout, adding no width or height at any offset, and `outline-offset: -1px` draws the ring just inside the image edge so it hugs the corner radius.
