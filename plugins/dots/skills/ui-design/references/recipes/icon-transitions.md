# Choose An Icon Transition

Use this contextual glyph-swap treatment when animation helps communicate a
state change. Preserve established motion otherwise. Keep the button's name
and visible state available without motion; use a static glyph branch or disable
CSS transitions for reduced motion. Skip entrance animation on initial mount.

Check `package.json` and nearby imports, then read one implementation:

- **Existing Motion:** [Motion swap](icon-swap-motion.md). Use `motion/react` for `motion`, or `framer-motion` for that package; do not mix import paths.
- **No motion dependency:** [CSS swap](icon-swap-css.md). Keep both glyphs mounted and cross-fade; add no dependency for this effect.

The glyph examples use `0.25` scale, `4px` blur and zero bounce;
these are not surface-animation defaults.
