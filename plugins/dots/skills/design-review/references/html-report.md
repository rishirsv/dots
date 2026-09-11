# Optional Visual Review Report

Read only when the user requests the HTML report. Load the available `html`
skill and apply it to the completed review; this composition does not create a
new task or authorize a new review. The feedback controls are a small local
accessory to the report, not a product editor or a hosted application. If HTML is unavailable, preserve the chat
review and identify the missing capability.

Prepare the scope, modes, verdicts when applicable, stable finding IDs,
priorities, corrections, acceptance checks, opportunities, and evidence gaps.
Include actual captured screenshots and their screen, state, viewport, and
source/implementation role. Give each annotation a finding ID and image-relative
location. Reinspect the image if that location is uncertain. Never invent a
screenshot or imply source-only findings have visual proof.

## Prompt For The HTML Skill

Fill the following prompt with the prepared review and evidence locations:

> Create one self-contained local HTML design-review report from the supplied
> review. Preserve its judgments and evidence limits; do not redo the review or
> implement fixes. Use this order: scope and applicable verdicts, prioritized
> findings with screenshot evidence, separate opportunities, ordered correction
> checklist, and material verification gaps. Keep prose concise. Show captured
> screenshots with numbered pins, outlines, and short callouts linked to finding
> IDs; keep annotations distinguishable from the actual UI and provide an
> unobstructed view. Keep overlays aligned when images resize. Show matched
> target/implementation views for fidelity findings where available. Label any
> explicitly requested proposed mockup as a proposal, never as observed evidence.
> Add accessible controls per finding for Accept, Revise, Dismiss, or Defer and
> a comment. Start unanswered; export responses using the JSON contract below
> through Download JSON and a selectable copy fallback. Feedback records decisions
> only; it never starts implementation or changes the review verdict. Embed the
> supplied screenshots so the report can be opened locally without a server.
> Follow HTML's rendering checks and test feedback export before delivery.
>
> Review: [prepared content]
> Evidence and annotation locations: [captured files and metadata]
> Feedback contract: [the contract below]
> Output location: [repository-approved local/private artifact location]

Do not produce proposed replacement designs unless the user explicitly chooses
that exploration. Keep source screenshots unchanged; use HTML overlays for
annotations. If screenshots are unavailable, identify the visual-report limit
and retain source-backed findings without fabricated imagery.

## Feedback Contract

Export one object in this form; the sample ID and values illustrate the shape:

```json
{
  "schema_version": 1,
  "review_id": "review-unique-id",
  "review_revision": 1,
  "responses": [
    {"finding_id": "F1", "decision": null, "comment": ""}
  ]
}
```

Assign a review ID once and retain it across re-reviews; increment the revision
when the report's reviewed content changes. Preserve finding IDs and never reuse
a retired ID for a different issue. Include all current feedback items in the
export; `decision` is null until answered, then one of `accept`, `revise`,
`dismiss`, or `defer`. Separate opportunities may use stable `O` IDs under the
same contract. Comments are plain text. Do not preselect acceptance or treat
unanswered items as approval.

Verify that exported JSON parses, identifies the displayed review and revision,
and preserves IDs, decisions, and comments, including quotes and newlines.
Changing a response must change the next export. Inspect screenshot overlays at
wide and narrow widths and verify keyboard access to feedback controls. Tell the
user to export feedback before closing; do not imply unsaved responses persist.
Return the local artifact link with a short explanation of the feedback export.

When feedback returns, match its review ID, revision, and finding IDs before
using it. Surface stale or unknown references instead of applying them to newer
findings. A dismissed or deferred finding is not evidence that the defect was
fixed; user decisions and verification status remain separate.
