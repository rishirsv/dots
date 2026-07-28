# Interaction Design

## Assign Reachable States To Their Owner

Start with the default state, then map only states the interaction can actually
reach. A state may belong to the control, field, region, or whole flow; do not
force every outcome onto every element.

| State | Reachable when | Design obligation |
|-------|----------------|-------------------|
| **Default** | The element is available at rest | Make purpose and affordance clear |
| **Hover** | A fine pointer can hover | Reinforce affordance without carrying essential information |
| **Focus** | Keyboard or programmatic focus can land | Provide a persistent visible indicator |
| **Active** | The control is being pressed or manipulated | Acknowledge the direct action |
| **Disabled** | An action is temporarily unavailable | Make unavailability clear; explain the reason when it is not evident |
| **Loading** | This owner is waiting on work | Preserve context and show progress at the smallest truthful scope |
| **Error** | This owner can fail or contain invalid input | Identify the problem, preserve recoverable input, and expose recovery |
| **Success** | Completion needs acknowledgment | Confirm the result at the level where it occurred |

Selected, expanded, empty, stale, permission, and offline are additional states
when the product can reach them. Assign each to the control, field, region, or
flow that owns the outcome. Do not invent states to complete a checklist.

Reduced motion is a user preference that changes applicable motion paths across
the affected interaction or flow; it is not an element-owned state.

**The common miss**: designing hover without focus, or using hover to reveal
essential information. Keyboard users never see hover, and touch users may not
have it.

## Focus Rings: Do Them Right

**Never `outline: none` without replacement.** It's an accessibility violation. Instead, use `:focus-visible` to show focus only for keyboard users:

```css
/* Hide focus ring for mouse/touch */
button:focus {
  outline: none;
}

/* Show focus ring for keyboard */
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**Focus ring design**:
- High contrast (3:1 minimum against adjacent colors)
- 2-3px thick
- Offset from element (not inside it)
- Consistent across all interactive elements

## Form Design: The Non-Obvious

**Placeholders aren't labels.** They disappear on input. Use persistent visible
labels. Validate at the earliest useful boundary without interrupting every
keystroke; immediate feedback is appropriate when it changes what the person can
do next, such as format guidance or password requirements. Place field errors
next to the field and connect them with `aria-describedby`.

## Loading States

**Optimistic updates**: show success immediately and roll back on failure only
for low-stakes, reversible actions—not payments or destructive actions. Use a
skeleton when the content structure is known and the preview reduces perceived
uncertainty; use a progress indicator, retained content, or quiet pending state
when that is more truthful.

## Destructive Actions: Undo > Confirm

**Undo is better than confirmation dialogs.** Users click through confirmations mindlessly. Remove from UI immediately, show undo toast, actually delete after toast expires. Use confirmation only for truly irreversible actions (account deletion), high-cost actions, or batch operations.

## Keyboard Navigation Patterns

### Roving Tabindex

For component groups (tabs, menu items, radio groups), one item is tabbable; arrow keys move within:

```html
<div role="tablist">
  <button role="tab" tabindex="0">Tab 1</button>
  <button role="tab" tabindex="-1">Tab 2</button>
  <button role="tab" tabindex="-1">Tab 3</button>
</div>
```

Arrow keys move `tabindex="0"` between items. Tab moves to the next component entirely.

### Skip Links

Provide skip links (`<a href="#main-content">Skip to main content</a>`) for keyboard users to jump past navigation. Hide off-screen, show on focus.

## Gesture Discoverability

Swipe-to-delete and similar gestures are invisible. Hint at their existence:

- **Partially reveal**: Show delete button peeking from edge
- **Onboarding**: Coach marks on first use
- **Alternative**: Always provide a visible fallback (menu with "Delete")

Don't rely on gestures as the only way to perform actions.

---

**Avoid**: Removing focus indicators without alternatives. Using placeholder
text as labels. Touch targets <44x44px. Generic error messages. Custom controls
without ARIA/keyboard support. Fabricating unreachable states or assigning a
flow-level loading, error, or success outcome to every child control.
