# Visual evidence

Read this for any pull request whose base-to-head diff changes user-visible UI,
visuals, or interaction. The gate passes only when the live pull request body
contains readable evidence for every affected surface and materially distinct
state.

## Inventory the evidence

List each affected screen or surface, the states that differ materially, the
claim each state must prove, and the intended capture source. Choose the
smallest set that covers the inventory:

- Use still screenshots for layout, styling, content, and discrete states.
- Use a GIF or short clip when sequence, animation, gesture, transition, or
  timing is the behavior under review.
- Include representative before/after, light/dark theme, text scaling,
  accessibility, error, empty, loading, or device-size evidence only when that
  dimension materially changes the outcome or risk.

When a simulator, device, or browser runtime was used, prefer evidence captured
from the actual integrated journey. A preview, fixture, or seeded shortcut may
supplement runtime evidence, but its caption must name that source and any
bypassed navigation, data loading, authentication, or integration step. Claim
only the coverage the capture actually shows.

Put the primary behavior clip immediately after the Outcome so reviewers see
the central journey first. Put a labeled state gallery next to Validation when
multiple stills prove the state inventory. Do not add either form when it would
be empty or redundant.

Caption every item with the surface, state, capture source, and exact claim.
Give images useful alt text with the same identifying facts. Before upload,
inspect every file for the intended build and state, useful crop, readable
scale, and absence of secrets or sensitive personal data.

## Upload to the live body

Create the draft pull request first. Then use the authenticated GitHub web
editor's attachment control or drag-and-drop target to upload local PNG, JPEG,
GIF, MP4, MOV, or WEBM files. Wait for GitHub to insert its anonymized
`github.com/user-attachments` URLs, arrange that generated Markdown in the
body, and save. Re-read the live body and inspect the rendered images or video;
the upload is not complete while the URL is pending, the body is unsaved, or
the media does not render.

GitHub limits images and GIFs to 10 MB. For video, prefer H.264 encoding for
broad browser compatibility and confirm the current web editor accepts the
file instead of relying on plan-specific size limits that may change.

The `gh` CLI and connector body APIs can submit Markdown, but they do not upload
local media files. Never put local file paths or data URIs in the pull request
body. Do not translate a local or repository path into a
`raw.githubusercontent.com` URL or a review-branch `blob` URL. Private
repository authentication may not follow the raw host, branch names can be
misresolved, and every review-branch URL breaks when that branch is deleted.
Use tracked repository assets only when repository policy or the user
explicitly selects a durable location that survives the pull request branch.

If authenticated browser upload is unavailable, keep the pull request draft
and request the smallest handoff: ask the user to upload the named files and
return the generated attachment Markdown or URLs. Do not claim visual evidence
until that Markdown is saved in the body and the rendered media is inspected.

When repairing broken evidence, upload the original local media through the
authenticated editor and replace the broken Markdown. Do not treat a raw-to-
blob URL rewrite as a repair unless a durable tracked location was explicitly
selected.

## Close the gate

Map each material validation claim to the screenshot or clip that proves it,
including the shown surface, state, and journey boundary. Name every remaining
state, device, theme, accessibility condition, or integration step not shown.
Scroll or otherwise reveal lazy-loaded media, then verify that the actual image
or video loaded and is readable. In a browser this means rendered pixels or an
equivalent loaded-media signal such as a complete image with nonzero intrinsic
dimensions. A present Markdown link, alt text, image node, or successful PR
body API response does not close the gate.

Keep the pull request draft until the evidence inventory is covered and the
live rendered body has been verified.
