# Make popovers origin-aware

Use the current component library's transform-origin API; the Base UI variable
below is not universal CSS.

For a popover, set the scale origin at its trigger. The default
`transform-origin: center` usually does not match that relationship. **For
centered modals**, keep `transform-origin: center` because they appear centered
in the viewport and are not anchored to a specific trigger.

```css
/* Base UI */
.popover {
  transform-origin: var(--transform-origin);
}
```
