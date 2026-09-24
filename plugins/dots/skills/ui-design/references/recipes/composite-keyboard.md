# Composite Keyboard Behavior

Native elements come with keyboard behaviors; custom widgets must implement them. A role is a promise. Give something `role="tab"` and users expect the full tab keyboard model.

With roving tabindex, the current focus target has `tabindex="0"`, all others `tabindex="-1"`, and arrow keys move both focus and the `0`. Tab moves between widgets; arrows move within them. Keep focus and selection separate when activation is manual.

For tabs, connect each `role="tab"` to its `role="tabpanel"` using IDs, `aria-controls`, and `aria-labelledby`. Use automatic activation when panels render instantly; use Enter/Space to activate when switching is expensive. Match arrow handling to orientation and leave ordinary page-scroll keys available. Make the panel focusable when it has no suitable focusable content at its start.

Use the matching ARIA APG pattern for a menu, combobox, listbox, or toolbar; they do not all share the same selection or focus model. Keep native buttons for disclosure headers with `aria-expanded` linked to actual visibility. Avoid positive `tabindex`; fix source order instead.
