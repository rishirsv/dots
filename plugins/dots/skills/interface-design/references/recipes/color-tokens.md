# Organize Color Tokens

Use when creating or extending a theme system. Preserve the project’s existing naming grammar; a local color fix does not require a token migration.

## Two tiers

**Primitives** name a value. They are the ramp, named by hue and step: `--blue-500`, `--neutral-200`. A primitive describes what the color *is*, so it never changes meaning between themes and is never applied directly in a component.

**Semantics** name a job. They point at a primitive and take the name of the role they fill: `--color-text-secondary`, `--color-border-subtle`. Components only ever reference this tier.

```css
:root {
  /* Tier 1: primitives, named by appearance. Never used directly. */
  --blue-500: #3b82f6;
  --neutral-200: #e5e7eb;
  --neutral-700: #374151;

  /* Tier 2: semantics, named by role. This is what components use. */
  --color-accent-solid: var(--blue-500);
  --color-border: var(--neutral-200);
  --color-text-secondary: var(--neutral-700);
}
```

The tiering is what makes theming possible. Dark mode, a white-label theme and an increased-contrast variant all repoint the semantic tier, leaving the primitives and every component untouched. A codebase applying `--blue-500` directly in components has no theming seam. Adding one later means auditing every usage to work out which meant "the accent" and which just wanted blue.

Add a third, component-level tier (`--color-button-danger-bg`) only where a component genuinely and intentionally diverges from the system. Repeated component exceptions can indicate a missing semantic role; add only roles the interface needs.

## Use tokens in their role

Apply a semantic token only for the role it names. `--color-text-secondary` is muted foreground text. Use it as a background and every future theme change that assumes the role breaks, because a value that happened to work as both stops working as both.

```css
/* Bad: separator token repurposed as a text color because it looked right */
.caption { color: var(--color-border); }

/* Bad: text token repurposed as a background */
.tag { background: var(--color-text-secondary); }
```
