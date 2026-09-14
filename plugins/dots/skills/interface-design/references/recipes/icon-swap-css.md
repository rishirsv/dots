# CSS transition approach (no Motion)

Without Motion or Framer Motion, keep both icons in the DOM and cross-fade with CSS transitions. Neither unmounts, so enter and exit both animate smoothly.

One icon is absolutely positioned on top of the other. Toggling state cross-fades them, the entering icon scaling up from `0.25` while the exiting one scales down to `0.25`, both with opacity and blur.

```tsx
function IconButton({ isActive, ActiveIcon, InactiveIcon, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      className="relative inline-flex items-center justify-center"
    >
      <span className="relative inline-flex" aria-hidden="true">
        <span
          className={cn(
            "absolute inset-0 items-center justify-center",
            "inline-flex transition-[opacity,filter,scale] duration-300",
            "ease-[cubic-bezier(0.2,0,0,1)]",
            isActive
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]"
          )}
        >
          <ActiveIcon />
        </span>
        <span
          className={cn(
            "inline-flex transition-[opacity,filter,scale] duration-300",
            "ease-[cubic-bezier(0.2,0,0,1)]",
            isActive
              ? "scale-[0.25] opacity-0 blur-[4px]"
              : "scale-100 opacity-100 blur-0"
          )}
        >
          <InactiveIcon />
        </span>
      </span>
    </button>
  );
}
```

The non-absolute icon, `InactiveIcon`, defines the layout size. The absolute one, `ActiveIcon`, overlays it without affecting flow.

The examples show presentation; connect the button event to the existing state
owner. These examples represent a toggle: keep its label stable and expose its
state with `aria-pressed`. For a changing action such as Play/Pause, name the
next action and omit `aria-pressed`; for disclosure, use `aria-expanded` instead.
`cn` is the project's class-name helper. For reduced motion, use a static
glyph branch or disable the CSS transition so state changes remain immediate.
