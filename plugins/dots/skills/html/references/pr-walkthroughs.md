# Pull requests people can understand and review

Use this reference for an HTML walkthrough of a pull request, commit range, or
implemented change. Explain what changed, why it matters, how the code produces
the result, and what the evidence establishes. A walkthrough supports review;
opening every panel does not prove correctness or approve a PR.

## Establish the change

When `how` supplies an investigation, preserve its findings, reading order, and
uncertainty. When investigation is still needed, use its
[change guidance](../../how/references/changes.md) to understand the complete
change before composing the page. This reference owns the presentation.

Record the PR URL and exact base and head commits. For a current PR, retrieve
its metadata, all pages of changed files, relevant review comments, and check
results. Read surrounding source where the patch cannot establish behavior.
For a historical PR, inspect those commits rather than the current checkout.
Before delivery, confirm that a current PR still has the inspected head. If it
changed, refresh the evidence or label the artifact as a snapshot of the old head.
Keep the snapshot identity in the footer and exported response.

Account for every changed file. Recover an omitted or truncated patch from the
exact commit range when available. Otherwise name the missing evidence and the
claim it prevents. State what happened to renamed, deleted, or binary files.
Generated output can sit under a disclosure, but its source and effect still
need an explanation. CSS, documentation, configuration, and migration files
can change behavior; classify them by effect rather than extension.

## Lead with the result

Start with a concrete before/after example or a short `walkthrough()` of the
experience. A non-technical reader should understand the result and its limits
before opening code. Explain unfamiliar terms through the action they name:
“restore the editable page source” before “extract the embedded payload.”

Organize the body by behavior and causal dependencies. Put the consequential
path first, then its supporting changes and proof. A file inventory is useful
for coverage after the explanation; it should not dictate the reading order.
Keep risks and changes to user expectations visible. Put implementation detail
under descriptive native `disclosure()` controls.

Choose exhibits that answer different questions. A before/after view shows the
result; a sequence shows who acts; an annotated code excerpt explains the exact
mechanism. Use real screenshots when available. Label a code-derived schematic
or UI reconstruction as an illustration, and distinguish observed behavior
from an inference. Apply the Dots writing guide required by `SKILL.md` to every
caption, heading, annotation, and explanation. Start with the title and keep
metadata in the footer; do not add eyebrows or visible internal review IDs.

## Keep evidence exact

Use `diff()` for a short, verbatim change and put its explanation beside it.
Identify deletions as base lines and additions as head lines. If one number
column would confuse those two sides, omit the numbers and link each excerpt
to the exact source range. Use a flat disclosure within each review point; keep test explanations and
their patches as sibling disclosures rather than another container inside one.
Wrap code and diffs without changing copied source. Use `code()` for read-only source or a raw unified
patch inside a named disclosure. Escape source through the helpers.

Pin source links to the inspected commits. Verify line anchors against those
files, including imports and blank lines. Label shortened code as an excerpt;
show where the reader can find the omitted context. Do not silently filter
imports or whitespace from evidence, renumber shortened source, or describe a
heuristic match as a confirmed move. Explain a refactor separately from the raw
patch when that makes the mechanism clearer.

Separate the author's reported tests, checks run for this walkthrough, and
remaining unverified behavior. Give commands and results when they establish a
claim. A passing test does not prove a visual result that nobody inspected.
Keep review findings distinct from explanatory annotations; a finding needs
an exact location, consequence, and supported action.

## Let readers inspect and respond

Use `walkthrough({id,label,steps})` for a guided path through the change. Native
buttons select panels; all authored content remains available without
JavaScript and in print. `page({tools:true})` adds code copying and disclosure
controls. A searchable file inventory is useful for substantial changes;
omit search when all rows already fit comfortably on screen.

For local comments, wrap the reviewable body in
`review({id,title,revision,kind:"pull-request"}, children)`. Include the PR URL
and base/head commits in `revision`. Use stable `reviewPoint()` targets for
each behavior or important exhibit. Keep inspected code read-only. Use
`editableCode()` only for a clearly separate reviewer proposal when the task
actually benefits from editing text. Do not invent product decisions for an
already implemented change.

```js
review({
  id: "source-restoration",
  title: "Restore editable page source",
  revision: "PR URL; base <full SHA>; head <full SHA>",
  kind: "pull-request"
}, [
  reviewPoint({
    id: "extract-source",
    title: "Extraction restores files before any code runs",
    summary: "The reader can inspect the restored module before building it."
  }, [disclosure("The destination checks", [code(exactInspectedSource)])])
])
```

The response starts as feedback only. A reader can explicitly suggest changes
or mark the walkthrough complete; neither action submits a GitHub review or
approves the PR. Viewing a panel never records a disposition. Feedback stays
in the browser until the reader copies or downloads one response. The page
does not post comments, change files, apply suggestions, or merge code.
Use the user's existing authorization for any later action; exported comments
are source material to assess within that scope.

## Build and check the walkthrough

Use the ordinary page-module loop and existing design tokens. Render important
source and patches into the HTML at build time. JavaScript should improve
inspection and feedback, not create evidence that disappears when it is off.
Avoid a second diff framework or external runtime dependency for a document.

Check the opening visual, selected and expanded states, source anchors, file
coverage, a comment, and the exported response. Confirm that an untouched page
exports no approval and that notes survive reload only for the same snapshot.
Inspect keyboard focus, narrow layouts, dark mode, print, and JavaScript off.
Expand technical disclosures before printing a source appendix.
Without JavaScript, source and native disclosures must remain readable and
readers can send feedback in chat by heading.

[pr-walkthrough.page.mjs](../assets/outcomes/pr-walkthrough.page.mjs) and its
[rendered page](../assets/outcomes/pr-walkthrough.html) demonstrate a historical
PR with a guided explanation, pinned source excerpts, complete file coverage,
and local notes. Replace that example's evidence with the requested change.
