# Dialog Focus

Prefer native `<dialog>` with `showModal()` or an established accessible dialog.
For a custom modal, make background content inert while keeping the dialog
active. Give the dialog an accessible name. Keep keyboard focus within it while
it is open.

Choose initial focus for the task: a heading or introductory block with
`tabindex="-1"` for long structured content, the least destructive action for an
irreversible confirmation, or the relevant control for a short task. On close,
return focus to the trigger. If the trigger is gone, move focus to a logical
next location. Escape should dismiss the topmost dismissible overlay without
also closing its parent.

Exercise opening, Tab and Shift+Tab at both ends, dismissal, and restoration.
