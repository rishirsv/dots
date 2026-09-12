# Motion Recipes

Adapt these patterns to the project's state model. Timing values are starting
points; neither example requires an animation library.

## A Small State Transition

```css
.disclosure-icon {
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1);
}

.disclosure-button[aria-expanded="true"] .disclosure-icon {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .disclosure-icon {
    transition: none;
  }
}
```

Drive `aria-expanded` and panel visibility from the same state. The icon transition
can reverse naturally when the user toggles again. Panel semantics, focus, and
content availability should not depend on the icon's transition completing.

## A Readable Storyboard

For a sequence with meaningful stages, keep a short description near its timing
configuration. For example:

```text
Trigger: user opens the result preview.
1. Preview surface appears from its trigger.
2. Result becomes visible as the surface settles.
3. Supporting details enter together; primary actions are already usable.
Interruption: closing cancels pending entrances and returns toward the trigger.
Reduced motion: show the complete preview immediately.
```

Name values by their role, such as `surfaceEnter`, `detailsDelay`, and
`travelDistance`. Keep a single owner for sequencing and cancellation; derive
presentation from current state rather than accumulating independent flags.
Use a live tuning control only when comparing values would resolve a real choice.

## Scripted Motion Lifecycle

When CSS cannot express the required sequence, keep these responsibilities in the
component or animation controller:

- Read the reduced-motion preference before starting and handle subsequent changes.
- Retarget from the current rendered state; use the animation system's velocity
  handling when continuity requires it.
- Cancel obsolete animation handles and pending callbacks when intent changes.
- Commit the latest intended endpoint when motion is disabled.
- Restore interaction state and clean up on completion, cancellation, and unmount.

An animation's completion callback is not the authority for the user's current
intent. Check that the completing animation still belongs to the active transition
before it hides content or removes an element. Do not make cleanup depend solely
on `transitionend`, which may not fire when a transition is removed.
