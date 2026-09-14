# Scripted Motion Lifecycle

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
