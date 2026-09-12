# Typography Recipes

Use the relevant example inside the project's styling system. Values illustrate
a treatment; tune them to the actual font, content, and supported browsers.

## Load A Variable Font

Replace the asset path and weight range with those supplied by the font. Declare
italic separately when used. A static font needs a face declaration per weight.

```css
@font-face {
  font-family: "Product Sans";
  src: url("./assets/product-sans.woff2") format("woff2");
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
}

body {
  font-family: "Product Sans", system-ui, sans-serif;
}
```

`swap` keeps fallback text visible but can change wrapping when the font arrives.
If that shift is disruptive, measure the fallback and consider `size-adjust`,
`ascent-override`, `descent-override`, and `line-gap-override` on a fallback face.
These values are specific to the font pair. Preload only fonts needed immediately.

## Optical Sizing And Features

```css
.article {
  font-optical-sizing: auto;
}

.balance,
.timer {
  font-variant-numeric: lining-nums tabular-nums;
}

.small-caps {
  font-variant-caps: all-small-caps;
}
```

Check that the font supplies the feature. Tabular digits stabilize changing values
and aligned columns; they do not replace decimal alignment or appropriate layout.
Reserve `font-variation-settings` for axes without a suitable standard property.

## Reading And Display Roles

```css
.prose {
  max-inline-size: 65ch;
  font-size: 1rem;
  line-height: 1.6;
}

.display {
  font-size: clamp(2rem, 1.25rem + 3vw, 4.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.description {
  text-wrap: pretty;
}

.user-content {
  overflow-wrap: anywhere;
}
```

Use fluid sizing where the composition benefits, and test zoom as well as viewport
changes. `balance` and `pretty` are enhancements: normal wrapping must remain
usable where unsupported. Apply aggressive word breaking to content that needs
it, not all text. Use `min-inline-size: 0` on a flex/grid item when its intrinsic
minimum prevents the intended shrinkage.

## Truncation With A Full-Text Path

```css
.single-line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.preview {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.preview.is-expanded {
  display: block;
}
```

The single-line container needs a constrained width. Pair truncated meaningful
content with a keyboard- and touch-accessible detail or expansion control. Keep
its expanded state and accessible label synchronized. Do not clamp essential
instructions or hide interactive descendants inside clipped content.

## Underlines And Mixed-Direction Values

```css
.text-link {
  text-decoration-line: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.15em;
  text-decoration-skip-ink: auto;
}
```

Inspect underline position with the active face and fallback. For a value whose
direction is unknown inside otherwise directed content, isolate it:

```html
<p lang="en">Created by <bdi dir="auto">اسم المستخدم</bdi></p>
```

Set the surrounding document's language and direction appropriately. Isolation
protects adjacent punctuation and text order; it does not translate content or
mirror the page layout.
