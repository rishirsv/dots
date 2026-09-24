# Shadows instead of borders

Where **buttons, cards and containers** use a border for depth or elevation, replace it with a subtle `box-shadow`. Shadows use transparency, so they adapt to any background where solid borders do not. That matters most over images or multiple background colors, which a fixed border color was never designed for.

**Never apply this to dividers**, meaning `border-b`, `border-t` and side borders, or any border whose purpose is layout separation rather than depth. Those stay borders.

### Shadow as border (light mode)

Three layers. The first acts as a 1px border ring, the second adds subtle lift, the third ambient depth:

```css
:root {
  --shadow-border:
    0px 0px 0px 1px oklch(0 0 0 / 0.06),
    0px 1px 2px -1px oklch(0 0 0 / 0.06),
    0px 2px 4px 0px oklch(0 0 0 / 0.04);
  --shadow-border-hover:
    0px 0px 0px 1px oklch(0 0 0 / 0.08),
    0px 1px 2px -1px oklch(0 0 0 / 0.08),
    0px 2px 4px 0px oklch(0 0 0 / 0.06);
}
```

### Shadow as border (dark mode)

In dark mode, simplify to one white ring, since layered depth shadows are invisible on dark backgrounds:

```css
/* Dark mode: adapt to whatever setup the project uses
   (prefers-color-scheme, class, data attribute, etc.) */
--shadow-border: 0 0 0 1px oklch(1 0 0 / 0.08);
--shadow-border-hover: 0 0 0 1px oklch(1 0 0 / 0.13);
```

Keep an outline or border fallback where a control boundary must remain visible in forced colors; box shadows can disappear there.

### Usage with hover transition

For a card whose lift benefits from a transition, apply the variable and add
`transition-[box-shadow]`. Keep frequently traversed rows and menu highlights
instant; use [motion guidance](../motion.md#give-motion-a-job) to choose.

```css
.card {
  box-shadow: var(--shadow-border);
  transition-property: box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

.card:hover {
  box-shadow: var(--shadow-border-hover);
}
```

### When to use shadows vs. borders

| Use shadows | Use borders |
| --- | --- |
| Cards, containers with depth | Dividers between list items |
| Buttons with bordered styles | Table cell boundaries |
| Elevated elements (dropdowns, modals) | Form input outlines (for accessibility) |
| Elements on varied backgrounds | Hairline separators in dense UI |
| Hover states for lift effect | Focus indicators that must survive forced colors |
