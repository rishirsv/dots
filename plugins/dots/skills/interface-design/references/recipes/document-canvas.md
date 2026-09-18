# Paint The Document Canvas

Use when implementing a page theme or investigating a contrasting strip exposed
at the edge of the app. A wrapper paints only its own box; the document canvas
can remain visible beyond it. Give `html` an explicit background from the same
theme owner as the app. A transparent root can propagate the body's background,
so a missing root declaration alone does not prove a visible defect.

```css
/* Use the product's actual tokens and theme selector. */
:root {
  --page-background: #f6f3ec;
  color-scheme: light;
}

:root[data-theme="dark"] {
  --page-background: #191b20;
  color-scheme: dark;
}

html,
body {
  background-color: var(--page-background);
}
```

Put the theme selector where it can update the root token. A theme class on an
app descendant cannot change an ancestor's background. Apply the initial theme
before the first paint when possible so the canvas does not flash the other theme.

If the page uses `meta[name="theme-color"]`, update its color through the same
theme change to tint supported browser chrome. CSS custom properties cannot be
used directly as the meta tag's color value. Keep this separate from
`color-scheme`, which informs native control rendering.

Compare the app edge before and after the change in each supported theme,
including short pages and overscroll where the target browser supports it.
Preserve normal bounce and scroll chaining unless changing those behaviors is
part of the interaction design; suppressing overscroll is not a background fix.

Reference: [CSS canvas backgrounds](https://www.w3.org/TR/css-backgrounds-3/#special-backgrounds).
