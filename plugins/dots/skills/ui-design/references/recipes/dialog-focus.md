# Dialog Focus

Prefer native `<dialog>` with `showModal()` or an established accessible dialog. For a custom modal, make background content inert without making the dialog itself inert, provide an accessible name, and contain keyboard focus while open.

Choose initial focus for the task: a heading or introductory block with `tabindex="-1"` for long structured content, the least destructive action for an irreversible confirmation, or the relevant control for a short task. On close, return focus to the trigger or a logical next location if it is gone. Escape should dismiss the topmost dismissible overlay without also closing its parent.

Exercise opening, Tab and Shift+Tab at both ends, dismissal, and restoration.
