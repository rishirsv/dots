# Capture A Live Reference

Open the source in the in-app browser, or the user's chosen browser. Confirm the
intended route and state before treating it as evidence. An unexpected login,
redirect, error, or loading screen is not the target. Try another available
browser when it could resolve an access problem; if access remains blocked,
identify the missing source and continue only from usable supplied evidence.

Capture each requested page from top to bottom with overlapping viewport views.
Let lazy content load and note sticky regions, scroll effects, animation, and
newly revealed controls. Return to the top to check changes caused by scrolling.
Repeat at relevant desktop and mobile sizes, using the user's device dimensions
when supplied. Keep each capture associated with its route, viewport, and state.

Use available DOM and computed-style inspection alongside screenshots to recover
copy, link destinations, component structure, layout dimensions, spacing, colors,
fonts, assets, and responsive rules. Prefer observed values to guessed CSS.
When the layers or timing behind a specific visual effect remain unclear, read
[effect inspection](recipes/effect-inspection.md).

Exercise the controls within the requested experience: navigation, inputs, menus,
drawers, dialogs, tabs, carousels, hover/focus states, and sticky behavior. Isolate
each interaction from a known starting state and record its trigger, visible
result, dismissal or recovery, and relevant DOM changes. For actions that would
change live data or submit a transaction, use an available safe preview or record
the untested behavior instead of executing it merely to inspect the design.

Collect accessible source assets locally, including images, logos, icons, fonts,
video, SVGs, sprites, masks, cursors, and backgrounds needed by the captured
experience. Preserve filenames or source mappings useful for verification. Avoid
hotlinking source assets in the delivered prototype. Track unavailable assets and
substitutions through [asset preparation](recreation-assets.md).
