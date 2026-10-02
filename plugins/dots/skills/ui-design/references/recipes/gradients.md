# Choose Gradient Interpolation

Use when creating or tuning a gradient. Check supported browsers and retain a
usable fallback declaration.

**Choose the interpolation space for the desired appearance.** The difference
between these three spaces is most visible in the middle of the gradient:

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

`oklab` and sRGB are **rectangular**, interpolating in a straight line through
the color space. `oklch` is **polar**, interpolating the hue angle, so it arcs
around the wheel through every hue between the stops. This can preserve chroma
through the transition, but it can also produce unwanted intermediate hues. For
example, a blue-to-pink gradient passes through purple. Check whether that
midpoint fits the design.

**A rectangular space can produce a gray midpoint.** Two hues on opposite sides
of the wheel sit on either side of the neutral axis. A straight line between
them passes near gray and reduces the midpoint's chroma. Either switch to a
polar space, which routes around the axis, or add a third stop between the two
and keep the space you have.

With a polar space you also control which way it goes around:

```css
/* The short way round, usually what you want */
background: linear-gradient(in oklch shorter hue, #3b82f6, #ec4899);

/* The long way, sweeps most of the spectrum */
background: linear-gradient(in oklch longer hue, #3b82f6, #ec4899);
```

**Banding shows up on large areas.** A gradient spanning a hero with little
contrast between its stops steps visibly on 8-bit displays. Increase the
contrast between stops, reduce the area, or overlay a subtle noise texture.

For a textured treatment, read [noise](noise.md); compare it with the plain
gradient before keeping the extra layer.

For text over the gradient, measure the region with the lowest contrast using
the [contrast recipe](contrast.md).

Verify the midpoint, gamut mapping, and fallback in the actual browser.
