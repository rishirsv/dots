# Interaction And States

Define what the interface does through the user's task, available actions, and
observable outcomes. Motion describes transitions; this reference owns the
behavior and state being communicated.

## Map The Task

Identify the entry point, main path, completion, and relevant recovery paths.
Reuse the product's navigation and state owners. Keep similar actions consistent,
make the next step predictable, and preserve location or progress when returning.
Use familiar platform controls unless another treatment improves the actual task.

## Make Controls Understandable

Match control type to the choice: navigation changes location, buttons perform
actions, selections change values. Give controls persistent, meaningful labels
and give each decision region one visually dominant action by default. Style
secondary and destructive actions according to their role. State the action and
its object when context alone would not make the outcome clear. Do not depend on
hover, color, or an unexplained icon for essential meaning.

Support keyboard and touch alongside pointer interaction. Preserve visible focus,
logical traversal, and alternatives to essential gestures. For overlays, define
initial focus, dismissal, focus containment where appropriate, and return to the
trigger. Prefer native elements and established accessible components.

## Design Forms And Recovery

Explain expected input before failure when the format is not obvious. Keep labels
visible, distinguish required fields, and connect errors to the affected fields.
Validate at a useful moment without interrupting entry. Retain entered data after
recoverable failures and make correction and retry straightforward.

Default to a single-column form so labels, fields, and errors follow one scanning
path; use multiple columns only for short, strongly related values when the
reading order remains unmistakable. Let field width suggest the expected amount
of input without constraining valid values.

Use confirmation or undo according to the consequence of an action, rather than
adding a confirmation to every change. Make consequences clear before commitment.

## Own Each State

Assign idle, pending, success, empty, error, selected, and disabled states to the
control or region that owns the outcome; not every element needs every state.
Give timely feedback and prevent unintended duplicate actions while work is pending.
Preserve useful content during refresh where possible.

Distinguish first use, no results, and unavailable data: each needs a different
next action. Explain disabled actions when their cause is not apparent. Optimistic
updates need a credible failure and recovery path; do not present an unconfirmed
outcome as final when correctness matters.

## Exercise The Experience

Follow the main path and relevant errors, retries, cancellation, dismissal, and
back navigation. Check rapid repeated input and supported input methods. Verify
that labels, visible state, focus, and underlying behavior agree. In prototypes,
make local simulations explicit without building unrequested services. Use the
active audit or QA workflow for findings and iterations.
