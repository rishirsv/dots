# Choose Gradient Interpolation

Use when creating or tuning a gradient. Check supported browsers and retain a usable fallback declaration.

**The interpolation space is a look, not a correctness setting.** Three are worth knowing, and the difference between them is most visible in the middle of the gradient:

```css
/* Fallback for browsers without interpolation-space syntax */
background: linear-gradient(#3b82f6, #ec4899);
/* Explicit sRGB comparison */
background: linear-gradient(in srgb, #3b82f6, #ec4899);

/* oklab: a straight path in a perceptual color space */
background: linear-gradient(in oklab, #3b82f6, #ec4899);

/* oklch: interpolate lightness and chroma while traveling around hue */
background: linear-gradient(in oklch, #3b82f6, #ec4899);
```

`oklab` and sRGB are **rectangular**, interpolating in a straight line through the color space. `oklch` is **polar**, interpolating the hue angle, so it arcs around the wheel through every hue between the stops. This can preserve chroma through the transition and can also produce intermediate hues nobody asked for. A blue-to-pink gradient routes through purple, which is either the look or a surprise.

**The gray dead zone is a rectangular-space problem.** Two hues on opposite sides of the wheel sit either side of the neutral axis. A straight line between them passes near gray, and the middle goes lifeless. Either switch to a polar space, which routes around the axis, or add a third stop between the two and keep the space you have.

With a polar space you also control which way it goes around:

```css
/* The short way round, usually what you want */
background: linear-gradient(in oklch shorter hue, #3b82f6, #ec4899);

/* The long way, sweeps most of the spectrum */
background: linear-gradient(in oklch longer hue, #3b82f6, #ec4899);
```

**Banding shows up on large areas.** A gradient spanning a hero with little contrast between its stops steps visibly on 8-bit displays. Widen the contrast, shrink the area, or overlay a subtle noise texture.

For text over the gradient, measure the worst region using the [contrast recipe](contrast.md).

Verify the midpoint, gamut mapping, and fallback in the actual browser.
