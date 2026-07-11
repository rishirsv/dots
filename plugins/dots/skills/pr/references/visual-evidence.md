# Visual evidence

Read this for UI, frontend, visual, design-facing, or mock changes. Visuals in a
PR body are review evidence: each image or clip should prove a specific claim
about the change, not merely show that a screen exists.

## Choose the evidence

- Use a real capture of the implemented result when claiming implemented
  behavior. Label a design mock explicitly; never present it as implementation
  evidence. When implementation follows a mock, place them together for
  comparison.
- Use before and after captures when the value depends on seeing the difference.
  Keep viewport, theme, content, application state, scroll position, and crop
  consistent. A new surface usually needs only the implemented result.
- Use a short clip for animation, gestures, drag and drop, temporal feedback, or
  multi-step interaction. Start in the relevant state, show one scenario, and
  remove setup time or cursor wandering.
- Cover the states materially affected by the change, not every screen. Include
  representative wide and narrow layouts, themes, focus states, empty states,
  loading, or errors only when the change affects them.

## Present it clearly

Place each visual beside the claim it supports. Give it useful alt text and a
caption that says whether it is before, after, or a mock; names the surface and
state; and tells the reviewer what to notice. Write captions in product terms
first, adding implementation detail only when it helps review.

Prefer durable GitHub uploads or stable committed assets. Remove secrets,
personal data, notifications, unrelated browser chrome, and private workspace
details. Do not use generated or placeholder imagery as proof of implemented
behavior.

Before handoff, inspect the rendered live PR body. Confirm that every required
asset loads, comparisons are understandable, captions match the captures, and
the evidence supports the claims made in the text.
