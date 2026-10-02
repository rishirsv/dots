# Composite Keyboard Behavior

Native elements provide keyboard behavior. Custom widgets must implement the
behavior expected for their role. For example, an element with `role="tab"` must
provide the full tab keyboard model.

With roving tabindex, give the current focus target `tabindex="0"` and all other
items `tabindex="-1"`. Arrow keys move focus and transfer `tabindex="0"` to the
new target. Tab moves between widgets; arrows move within them. Keep focus and
selection separate when activation is manual.

For tabs, connect each `role="tab"` to its `role="tabpanel"` using IDs,
`aria-controls`, and `aria-labelledby`. Use automatic activation when panels
render instantly; when switching is expensive, use Enter/Space to activate.
Match arrow handling to orientation and leave ordinary page-scroll keys
available. Make the panel focusable when it has no suitable focusable content at
its start.

Use the matching ARIA APG pattern for a menu, combobox, listbox, or toolbar;
they do not all share the same selection or focus model. Keep native buttons for
disclosure headers with `aria-expanded` linked to actual visibility. Avoid
positive `tabindex`; fix source order instead.
