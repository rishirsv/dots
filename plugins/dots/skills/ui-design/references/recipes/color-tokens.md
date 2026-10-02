# Organize Color Tokens

Use when creating or extending a theme system. Preserve the project’s existing
naming convention; a local color fix does not require a token migration.

## Two tiers

**Primitive tokens** name color values by hue and step: `--blue-500`,
`--neutral-200`. A primitive describes what the color *is*, so it never changes
meaning between themes and is never applied directly in a component.

**Semantic tokens** name color roles. They reference a primitive token and take
the name of their role: `--color-text-secondary`, `--color-border-subtle`.
Components reference only semantic tokens.

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

This structure supports themes. Dark mode, a white-label theme, and an
increased-contrast variant change which primitives the semantic tokens
reference. The primitive tokens and components remain unchanged. If components
use `--blue-500` directly, a later theme change requires inspecting every use.
You must determine which uses mean "the accent" and which need that specific
blue.

Add a third, component-level tier (`--color-button-danger-bg`) only where a
component genuinely and intentionally diverges from the system. Repeated
component exceptions can indicate a missing semantic role; add only roles the
interface needs.

## Use tokens in their role

Apply a semantic token only for the role it names. `--color-text-secondary` is
muted foreground text. If you use it as a background, a future theme change can
break the component. The new value may work for text but fail as a background.

```css
/* Bad: separator token repurposed as a text color because it looked right */
.caption { color: var(--color-border); }

/* Bad: text token repurposed as a background */
.tag { background: var(--color-text-secondary); }
```
