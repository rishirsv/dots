# Add Grain Deliberately

Use grain when visible gradient bands need softening or texture belongs to the
chosen material. Compare with the untreated surface first. Keep a plain surface
when grain only adds visual activity; it is not a default finishing step.

## Choose The Rendering Cost

A live SVG turbulence filter is useful on a small surface or while tuning the
effect. Large filtered areas, especially during scrolling or animation, need
measurement on the target device. Prefer a small repeating image for large
static treatments; avoid animating the noise parameters unless that motion is
part of the brief.

For example, save this as a texture asset in the project's asset system. The
dimensions bound the tile, and `stitchTiles` makes its opposite edges meet:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.7"
      numOctaves="2" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)" />
</svg>
```

Use the actual asset URL below. A raster export is another option when profiling
shows the SVG image still costs too much. Do not assume an SVG tile is rasterized
only once in every browser.

```css
.textured-surface {
  position: relative;
  isolation: isolate;
  background: var(--surface-background);
}

.textured-surface::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: url("./grain.svg") repeat;
  background-size: 128px 128px;
  opacity: 0.06;
  mix-blend-mode: soft-light;
  pointer-events: none;
}
```

Isolation keeps blending local. The negative layer sits above the isolated
surface's background and below its content, so grain does not coat text or
intercept input. Avoid clipping the entire component just to contain texture:
that can cut off focus rings and popovers.

Toggle the layer while inspecting the actual surface and theme. Check whether
bands soften, tile seams repeat, or text loses contrast. Tune scale and opacity
in context; the values above are starting points. Compare scrolling and repaint
cost with the layer disabled before keeping a large treatment.

References: [SVG turbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence),
[blend isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/isolation).
