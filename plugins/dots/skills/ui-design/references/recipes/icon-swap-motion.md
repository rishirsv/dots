# Motion example

This uses the `motion` package. Where the project has `framer-motion`, import the same APIs from `"framer-motion"`. Never mix an installed package with the other's import path.

```tsx
import { AnimatePresence, motion } from "motion/react";

function IconButton({ isActive, ActiveIcon, InactiveIcon, label }) {
  const Icon = isActive ? ActiveIcon : InactiveIcon;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      className="relative inline-flex items-center justify-center"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          className="inline-flex"
          aria-hidden="true"
          key={isActive ? "active" : "inactive"}
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
```

The examples show presentation; connect the button event to the existing state
owner. These examples represent a toggle: keep its label stable and expose its
state with `aria-pressed`. For a changing action such as Play/Pause, name the
next action and omit `aria-pressed`; for disclosure, use `aria-expanded` instead.
For reduced motion, render the current glyph without Motion so state changes
remain immediate.
