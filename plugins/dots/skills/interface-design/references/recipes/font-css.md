# Configure Web Fonts

Use the project’s styling system. Tune example values to the actual font, content
and supported browsers.

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
