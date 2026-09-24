# Removed signals

What to look for on the `-` side of a hunk and which reference owns the judgment. A row here is a lead, never a finding. Route the removal to its owner and report it only once inspection confirms the interface got worse.

| Removed from the `-` side | Owner | What to check |
| --- | --- | --- |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `role=` | [Interaction](../interaction.md) | The control or region lost its accessible name, description, or announcement |
| `alt=`, `<label`, `for=`, `scope=` | [Interaction](../interaction.md) | Image, field, or table cell lost its programmatic association |
| `<button>`, `<a>`, `<nav>`, `<main>`, `<ul>` replaced by `div` or `span` | [Interaction](../interaction.md) | Keyboard and assistive-technology behavior was traded for styling |
| `:focus-visible`, `:focus`, `outline`, `tabindex` | [Interaction](../interaction.md) | Keyboard users lost the focus indicator or the element left the tab order |
| `prefers-reduced-motion` | [Motion](../motion.md) | Motion now ignores the user's system preference |
| `prefers-contrast` | [Color](../color.md) | Contrast now ignores the user's system preference |
| Logical properties swapped for `left` / `right` | [Layout](../layout.md) | Direction-aware layout was dropped |
| `lang=`, `dir=` | [Typography](../typography.md) | Language metadata or text direction was dropped |
| `text-wrap`, `line-clamp`, `overflow-wrap`, `tabular-nums`, `font-feature-settings` | [Typography](../typography.md) | Text rendering, wrapping, or numeral alignment silently changed |
| A color token swapped for a literal, or a token swapped for a lighter one | [Color](../color.md) | The rendered contrast pair may now fail; measure it |
| A user-facing string deleted or shortened | [Product copy](../product-copy.md) | A label, error, or empty state lost the information it carried |

## Equivalent replacements

These can clear the signal once their replacement behavior is verified. Check for them before routing anything, or the report fills with refactors reported as regressions:

- `aria-label` giving way to `aria-labelledby` pointing at visible text.
- An explicit `role` dropped because the element became the native equivalent, `role="button"` going as a `div` becomes a `<button>`.
- `outline` replaced by a `box-shadow` focus ring that remains visible, including in forced colors.
- `tabindex="0"` dropped from an element that is now natively focusable.
- A color literal replaced by a token that measures the same rendered pair.
- A physical property replaced by its logical counterpart, which is the fix rather than the regression.
- A string moved into the translation catalogue rather than deleted.
