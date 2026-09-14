# Color

Inspect existing brand colors, semantic roles, surface hierarchy, and themes.
Preserve their meaning unless changing the system is part of the request.

Choose colors by role and intended atmosphere. Use accent strength deliberately;
neutrals, saturation, and the number of accents should fit the brief rather than
a universal palette rule.

Build each needed color family from its actual uses: choose the main action or
identity color, the darkest foreground, and the lightest tinted surface in
context, then add only the intermediate steps the interface needs. Adjust hue,
saturation, and lightness by eye as well as by measurement; equal numeric steps
rarely produce equal perceived steps. Name tokens by role when their meaning is
more stable than their pigment.

Choose foregrounds relative to their surface. A generic gray or reduced-opacity
white can look muddy or disabled on a colored background and can vary over
imagery. Select a surface-aware foreground that has the intended prominence and
still passes contrast checks in every state.

For text over imagery, test the full range of expected crops and user-provided
content. Reposition the text or focal crop when possible; otherwise control the
local background with a scrim, gradient, or image treatment rather than relying
on one text color to work over every pixel.

Apply changes consistently through the governing token system. Check text,
controls, focus, selection, and status contrast in their actual contexts and
themes. Do not rely on color alone to communicate essential information.

For measured contrast checks, read [contrast](recipes/contrast.md).
For creating or extending theme tokens, read [color tokens](recipes/color-tokens.md).
For gradient interpolation, read [gradients](recipes/gradients.md).

For a theme switch that unintentionally animates the whole page, use the scoped
[theme-transition recipe](recipes/theme-transitions.md).
For depth, read [surface depth](recipes/surface-depth.md); for image edges,
read [image outlines](recipes/image-outlines.md).
