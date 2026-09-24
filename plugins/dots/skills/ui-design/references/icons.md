# Icons

Icon weight, states, sizing and direction, the details that make icons sit naturally in an interface.

Use the web examples within the chosen icon system. Platform conventions and
supplied brand artwork govern meaning; do not force every icon family to expose
stroke or filled variants. For native app icons, read [app icons](platforms/app-icons.md).

## Match icon stroke to text weight

A hairline icon beside semibold text reads as broken; a heavy icon beside regular text shouts.

| Adjacent text | Icon stroke width (24px grid) |
| --- | --- |
| Regular (400), 14–16px | `1.5px` |
| Medium/Semibold (500–600) | `2px` |
| Bold (700), or emphasized standalone | `2.5px` |

```html
<!-- Good: stroke tuned to the label weight -->
<button class="flex items-center gap-2 font-semibold">
  <PlusIcon stroke-width="2" class="size-4" />
  New project
</button>

<!-- Bad: default 1.5px stroke against a bold label -->
<button class="flex items-center gap-2 font-bold">
  <PlusIcon stroke-width="1.5" class="size-4" />
  New project
</button>
```

Two related consistency rules:

- **One optical strategy per surface.** Never mix icon libraries with incompatible stroke conventions on one toolbar. Where the library supports stroke variants, match them to adjacent text as above; otherwise keep the set's native stroke and use size or color for emphasis.
- **Size icons relative to the text's cap height**, typically `1em`–`1.25em` when inline with text, so the pair scales together.

## One SVG, recolored per state

When states differ only in color, use one SVG drawn with `currentColor` and let CSS state drive the color:

```html
<!-- Good: one asset, states are CSS -->
<svg fill="none" stroke="currentColor" stroke-width="2">…</svg>
```

```css
.icon-button { color: oklch(0.552 0.016 285.938); }
.icon-button:hover { color: oklch(0.21 0.006 285.885); }
.icon-button[aria-pressed="true"] { color: oklch(0.623 0.188 259.815); }
.icon-button:disabled { opacity: 0.4; }
```

```html
<!-- Tailwind -->
<button class="text-zinc-500 hover:text-zinc-900 aria-pressed:text-blue-600 disabled:opacity-40">
  <BookmarkIcon />
</button>
```

Hardcoded fills inside a monochrome SVG, such as `fill="#666"`, break this. Use `currentColor` for those glyphs; preserve intentional multicolor artwork.

## Outline default, fill active

Where an icon set offers outline and filled variants, use them as a state pair, never interchangeably:

| Variant | Use for |
| --- | --- |
| Outline | Default state: toolbars, list rows, inline with text |
| Fill | Selected/active state: the active tab, a toggled bookmark, a liked heart |

```tsx
// Good: variant communicates state
<TabIcon variant={isActive ? "solid" : "outline"} />

// Bad: filled icons everywhere, so the active tab has no state signal
<TabIcon variant="solid" />
```

When animation helps communicate a variant change, read [icon transitions](recipes/icon-transitions.md). Keep a static swap when motion adds no information.

## Design at render size

An icon that looks great at 48px collapses into mush at 16px. Thin interior lines, tight counters and fine texture all blur or alias when small.

- Test every icon at the smallest size it will render, often `16px`. It must stay recognizable there.
- Prefer simplified glyphs for small contexts over scaling down detailed artwork.
- Keep icons on the pixel grid at their render size. A 16px icon drawn on a 24px grid with fractional scaling renders soft, so use the set's native grid sizes (`16`, `20`, `24`) rather than arbitrary scales.
- Prefer SVG for ordinary web interface glyphs. Preserve intentional raster artwork and native symbol assets when those are the appropriate source formats.

## Icons in RTL

Under `dir="rtl"`, flip icons whose meaning is tied to reading direction, and leave the rest alone:

| Flip | Don't flip |
| --- | --- |
| Back/forward arrows, chevrons in navigation | Logos and brand marks |
| Text-block glyphs (alignment, lists, indent) | Checkmarks |
| Speaker/volume waves (emanate in reading direction) | Physical objects: clocks, cups, pencils |
| "Send" style directional glyphs | Media playback (play/rewind refer to tape direction, convention keeps them LTR) |

```css
/* Good: mirror only direction-dependent icons */
[dir="rtl"] .icon-directional {
  scale: -1 1;
}
```

```html
<!-- Tailwind -->
<ChevronRightIcon class="icon-directional rtl:-scale-x-100" />
```

Analyze composite icons part by part. A badge or slash overlay may keep its position even when the base glyph flips. Give icon-only buttons accessible names and test them through [interaction.md](interaction.md).
