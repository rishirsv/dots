# Announce Dynamic Changes

Use for web feedback that updates without navigation.

## Choosing how to announce a change

Work down this list and stop at the first match:

1. **Focus moves there anyway**, as with an opened modal or the first invalid field. Let its accessible name and description carry the announcement; avoid repeating it in a live region.
2. **Tied to a specific control**, such as a field error or character count: `aria-describedby` on the control, announced with the field. If the change must be heard while focus stays elsewhere, use a concise live update as well.
3. **Non-urgent, not tied to a control**, such as a toast, "Saved", a result count, or a loading state: a polite live region, `role="status"`.
4. **Urgent and not tied to a control**, such as impending session expiry: `role="alert"`.

## Live regions

Live regions announce content that changes without a page load: toasts, validation, search-result counts, loading states.

| Mechanism | Politeness | Use for |
| --- | --- | --- |
| `role="status"` (= `aria-live="polite"` + `aria-atomic="true"`) | Waits for a pause | Toasts, "Saved", result counts, loading updates |
| `role="alert"` (= `aria-live="assertive"` + `aria-atomic="true"`) | Interrupts immediately | Errors and urgent problems only |

Rules for reliable announcements:

- For repeated polite updates, keep a stable empty region in the DOM before changing its text. Inserting a new polite region with its content is announced inconsistently.
- Dynamically inserted `role="alert"` content is usually announced, but behavior varies. Use it only for urgent errors not tied to a control, and test the target browser and screen-reader combinations.
- Default to polite. Overusing `assertive` is the most common live-region mistake, because it interrupts whatever the user was reading.
- Keep messages short and self-contained. `aria-atomic="true"` re-reads the whole region on change.
- Never move focus to a toast. Announce it and leave focus where the user is working. Give toasts a generous timeout or a dismiss button, and never put the only path to an action inside an auto-dismissing one.

```tsx
// Region rendered from the start, message injected later
<div role="status" className="sr-only">
  {statusMessage}
</div>
```

For loading states, set `aria-busy="true"` on the updating content and clear it when the update completes. Keep a status region outside that busy subtree if it must announce progress during the update. Announce meaningful outcomes ("Loaded, 12 results"); coalesce rapid search updates instead of speaking every keystroke.

Verify the announcement and focus behavior with the supported browser and screen reader. DOM attributes alone do not prove what was spoken.
