# Suppress transitions on theme switch

Reuse the framework's theme-transition option when available. For custom handling, remove temporary styles and pending callbacks on unmount and check rapid repeated switches.

Flipping the theme changes `color`, `background-color`, `border-color` and `box-shadow` on nearly every element at once. Everything carrying a transition on those properties animates together, so the switch reads as a slow smear rather than an instant change. Disable transitions for the swap and restore them right after.

Inject a stylesheet that turns off every transition, force a reflow so the new colors commit while it still applies, then drop it on the next frame:

```tsx
"use client";

import { useEffect } from "react";

export function DisableThemeTransitions() {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const styles = new Set<HTMLStyleElement>();
    const frames = new Set<number>();
    const afterFrame = (callback: () => void) => {
      const id = requestAnimationFrame(() => {
        frames.delete(id);
        callback();
      });
      frames.add(id);
    };

    const handleChange = () => {
      const style = document.createElement("style");
      style.append(
        document.createTextNode(
          "*,*::before,*::after{transition:none !important}"
        )
      );
      document.head.append(style);
      styles.add(style);

      const _flushReflow = document.body.offsetHeight;

      afterFrame(() => {
        afterFrame(() => {
          style.remove();
          styles.delete(style);
        });
      });
    };

    mql.addEventListener("change", handleChange);
    return () => {
      mql.removeEventListener("change", handleChange);
      frames.forEach((id) => cancelAnimationFrame(id));
      styles.forEach((style) => style.remove());
    };
  }, []);

  return null;
}
```

`document.body.offsetHeight` is read for its side effect, forcing a synchronous style flush so the new theme resolves while the override is still in the document and no transition starts. The nested `requestAnimationFrame` removes the override only after that paint, restoring transitions before the next interaction.

That covers the OS-level change. An in-app toggle needs the same treatment around its own flip: apply the override, change the theme, flush, remove. `next-themes` ships this as `disableTransitionOnChange`.

The example tracks pending frames and styles so unmount removes both, including
during rapid theme changes.
