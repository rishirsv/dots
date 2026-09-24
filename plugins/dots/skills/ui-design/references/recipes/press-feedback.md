# Scale on press

Use this selected web press treatment within the established motion system; native controls keep platform motion. Disable the scale for reduced motion.

A subtle scale-down on click gives buttons tactile feedback. Always `scale(0.96)`, never below `0.95`, which feels exaggerated. Use CSS transitions so a release mid-press returns smoothly.

Not every button needs it. Reuse an existing variant to disable distracting scale; the `static` prop below is an option when designing a new button API.

### CSS example

```css
.button {
  transition-property: scale;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

.button:active:not(:disabled) {
  scale: 0.96;
}
```

### Tailwind example

```tsx
<button className="transition-transform duration-150 ease-out active:scale-[0.96]">
  Click me
</button>
```

### Motion example

```tsx
<motion.button whileTap={{ scale: 0.96 }}>
  Click me
</motion.button>
```

### Static prop pattern

Extract the scale class into a variable and apply it conditionally on a `static` prop:

```tsx
const tapScale = "active:not-disabled:scale-[0.96]";

function Button({ static: isStatic, className, children, ...props }) {
  return (
    <button
      className={cn(
        "transition-transform duration-150 ease-out",
        !isStatic && tapScale,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Usage
<Button>Click me</Button>           {/* scales on press */}
<Button static>Submit</Button>       {/* no scale */}
```
