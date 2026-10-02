# Inspect Motion

### Slow motion testing

Play animations at reduced speed to spot issues invisible at full speed.
Temporarily increase duration to 2-5x normal, or use browser DevTools animation
inspector to slow playback.

Check these details in slow motion:

- Do colors transition smoothly, or do you see two distinct states overlapping?
- Does the easing produce the intended acceleration and deceleration, or does motion start or stop abruptly?
- Is the transform-origin correct, or does the element scale from the wrong point?
- Are multiple animated properties (opacity, transform, color) in sync?

### Frame-by-frame inspection

Step through animations frame by frame in Chrome DevTools (Animations panel).
This reveals timing issues between coordinated properties that you cannot see at
full speed.

### Test on real devices

For touch interactions (drawers, swipe gestures), test on physical devices.
Connect your phone via USB, visit your local dev server by IP address, and use
Safari's remote devtools. The Xcode Simulator is an alternative but use real
hardware when possible to test gestures.

Use the available browser's equivalent animation tools. If physical-device
access is unavailable, report that gap. Slow playback diagnoses continuity; also
inspect normal speed before judging responsiveness.
