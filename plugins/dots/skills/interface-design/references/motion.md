# Motion

Use motion to explain change, maintain spatial continuity, give feedback, or
express the interface's character. Preserve established motion conventions when
refining a product. A still screenshot cannot specify timing or behavior.

## Give Motion A Job

Identify the trigger, what changes, and what the user should understand. Routine
controls should respond promptly; expressive sequences can take more time when
attention to the sequence is part of the experience. Consider repetition: an
entrance that delights once can obstruct a frequently used task.

Default to immediate hover and selection feedback for repeatedly traversed rows,
menus, and tabs. Frequent keyboard actions deserve the same responsiveness.
Animate when continuity explains a meaningful change, not merely because the
control has a hover state. Sweep across neighboring items and repeat the action:
highlights should track intent rather than trail it. Tooltip discovery has its
own [group timing](recipes/tooltip-group.md).

Keep unsolicited movement selective. Animate the relationship that matters rather
than giving every section the same entrance. Preserve immediate access to content
and controls; do not add artificial waiting to make an operation seem substantial.

## Choreograph The Change

For a multi-stage sequence, describe the meaningful beats before tuning individual
elements: what leads, what follows, which elements move together, and where the
sequence settles. Keep timing and spatial values named and easy to adjust.
Simple feedback does not need a storyboard or stage controller.

Anchor menus and expanding surfaces to their source. Preserve identity through
movement, resizing, and shared elements. Make exit paths understandable in relation
to entry; follow the product's navigation model when forward and backward movement
have different meanings.

Use stagger to communicate order or grouping. Bound the total delay so long lists
do not make later items wait. Avoid hiding necessary content while decorative
beats finish. Coordinate by state or animation completion when one beat depends
on another; independent timers can drift or fire after the user leaves.

## Choose Timing And Physics

Choose timing by distance, element size, urgency, and frequency of use. Roughly
100–150ms for small animated feedback and 200–350ms for compact transitions can be useful
starting points, not acceptance thresholds. Larger choreography may need longer;
exits should clear the way promptly without becoming abrupt.

Use duration-based easing for a controlled transition with known endpoints.
Use springs when retargeting, gesture release, or physical continuity benefits.
Tune settling time and overshoot deliberately; bounce can express character but
should not make controls feel imprecise. Neither springs nor a particular easing
curve are universal defaults.

Spring parameters differ by library and platform. Confirm units and parameter
meaning before transferring values; duration/bounce and stiffness/damping are not
interchangeable specifications.

## Handle Interruption And Gestures

Retarget from the currently rendered position, not a stale starting value. Carry
velocity when the animation system supports it. Rapid toggles, reversal, and
repeated activation should converge on the latest requested state without snaps,
queued playback, or delayed callbacks restoring an old state.

During direct manipulation, track input without easing behind it. Preserve the
grab offset and support cancellation. At release, use position and velocity to
choose a destination consistent with platform behavior, then continue smoothly
into settling motion. Bound resistance and snapping so edges remain understandable.
Keep scrolling and competing gestures usable, and provide alternatives for
essential gesture-only actions.

Separate product state from animated presentation. Define when an exiting element
stops accepting input, where focus moves, and when it can be removed. Finish or
cancel cleanup correctly even if motion is interrupted or disabled.

## Respect Motion Preferences

Provide a reduced-motion treatment that preserves the state change: often an
immediate update or brief fade instead of translation, zoom, parallax, or repeated
oscillation. Apply it to both CSS and scripted animation. Respond to preference
changes while the interface is open where supported.

Keep progress and completion understandable without spatial motion. Avoid flashing
and provide appropriate control over prolonged automatic movement. Coordinate
optional sound or haptics with the causal event and respect their separate settings.

## Implement And Inspect

Use the simplest mechanism that supports the behavior: CSS for local state
transitions, a scripted timeline for sequencing, or the project's animation system
for gestures and springs. Prefer transforms and opacity for spatial effects where
they fit; measure layout, paint, blur, and large-layer costs rather than treating
any property or library as a performance guarantee. Use temporary layer hints only
when they solve an observed problem.

For native interfaces, use the platform's animation, gesture, accessibility,
and lifecycle facilities.

Inspect motion in use, including entry, exit, rapid repetition, reversal,
interruption, and reduced motion. Check intermediate frames or a recording when
continuity is unclear. Verify that the final state, focus, and available actions
remain correct. Use existing audit or QA rules when those workflows are active;
a static capture proves the endpoint, not the transition.

## Read The Matching Recipe

- **Simple state change:** [CSS transition](recipes/state-transition.md).
- **Multi-stage sequence:** [storyboard](recipes/storyboard.md).
- **Scripted cancellation or stale callbacks:** [motion lifecycle](recipes/motion-lifecycle.md).
- **Button press:** [press feedback](recipes/press-feedback.md).
- **Unwanted first-render motion:** [initial animation](recipes/initial-animation.md).
- **Popover scaling:** [transform origin](recipes/popover-origin.md).
- **Adjacent tooltips:** [group timing](recipes/tooltip-group.md).
- **CSS entry without mount flags:** [CSS entry](recipes/css-entry.md).
- **Staged content entrance:** [split and stagger](recipes/staged-entrance.md).
- **Content exit:** [exit animation](recipes/exit-animation.md).
- **Contextual glyph swap:** [icon transitions](recipes/icon-transitions.md).
- **Unclear continuity:** [slow-motion and device inspection](recipes/motion-inspection.md).
