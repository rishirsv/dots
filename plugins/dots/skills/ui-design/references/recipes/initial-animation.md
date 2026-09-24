# Skip animation on page load

Apply this when a stateful component animates unnecessarily on its initial render.

Use `initial={false}` on `AnimatePresence` to stop enter animations firing on first render. An element already in its default state animates on later state changes, not on page load.

### When it works

```tsx
// Good: icon doesn't animate in on mount, only on state change
<AnimatePresence initial={false} mode="popLayout">
  <motion.span
    key={isActive ? "active" : "inactive"}
    initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
  >
    <Icon />
  </motion.span>
</AnimatePresence>
```

Works well for icon swaps, toggles, tabs and segmented controls, anything with a default state on page load.

### When it breaks

Never use `initial={false}` where the component relies on its `initial` prop for a first-time enter animation, such as a staggered page hero or a loading state. Removing it skips the entire entrance.

```tsx
// Bad: initial={false} would skip the staggered page enter entirely
<AnimatePresence initial={false}>
  <motion.div initial="hidden" animate="visible" variants={...}>
    ...
  </motion.div>
</AnimatePresence>
```

Verify the component still looks right on a full page refresh before applying this.
