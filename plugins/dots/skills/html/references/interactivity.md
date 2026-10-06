# Useful interactions in documents

Add JavaScript when it helps the reader inspect, compare, or respond to the
material. Keep the document readable without it. Use the existing helpers
rather than adding a custom framework or a second visual system.

| Reader task | Helper | Suitable content |
|---|---|---|
| Review a proposal and send one response | `review()`, `reviewPoint()`, `decision()`, `editableCode()` | Plans, RFCs, decision proposals; read [plans.md](plans.md) |
| Comment on an implemented change | `review({kind:"pull-request",...})`, `reviewPoint()` | PR walkthroughs; read [pr-walkthroughs.md](pr-walkthroughs.md) |
| Inspect screens or states one at a time | `walkthrough({id,label,steps:[{title,body}]})` | A lifecycle, before/after comparison, or annotated sequence |
| Copy an exact snippet | `page({tools:true}, ...)` with `code()` | Commands, configuration, examples |
| Open or close technical detail together | `page({tools:true}, ...)` with multiple `disclosure()` blocks | Reports with a technical appendix under each behavior |
| Find and compare records | `table({columns,rows,searchable:true,sortable:true})` with `page({tools:true}, ...)` | Substantial inventories or evidence tables |

A walkthrough shows all steps without JavaScript and in print. With JavaScript,
named buttons select one panel and expose selection through `aria-pressed`.
Its body accepts existing helpers and real markup. A custom `mockup()` supplies
a frame without default inner padding; size its content for the detail the
reader needs. Use it to show the visible
consequence of a state, not merely repeat labels from a diagram. Label simulated
or proposed views as illustrations; selecting a panel never changes real data.

Document tools are opt-in. They copy code with a selection fallback, open or
close technical disclosures, and enhance only tables explicitly marked for
search or sort. Search requires every entered word to appear in the row and
announces the count. Sorting preserves row labels and supports numeric columns
marked `numeric:true`; it shows direction in the header and exposes a column selector for stacked
mobile tables. Use formatted numbers
with one consistent unit per column. Leave derived comparisons and mixed-unit
values to explicit prose or source calculations. Printing restores filtered rows.

Review actions sit in a compact dock at the lower right. PR walkthroughs show
one response button; plans add the next unresolved decision and an answer count.
The count reports explicit answers, never panels viewed. Keep the dock out of
the main reading flow and hide it in print.

Choose interactions from the reader's job. Do not add search to a tiny table,
controls to decorative figures, a fake live dashboard, or progress that claims
work is complete merely because a person viewed it. A static document remains
a document when local controls improve inspection and feedback. Use `ui-design`
when the task calls for a functioning product, external writes, authentication,
or live data and complex application state.

Review keyboard access, labels, focus, narrow screens, and the changed state—not
only the opening screenshot. Test empty search, sort direction, copying fallback,
and no JavaScript when those controls are present. Downloads depend on the browser; if a viewer does not save the file, copy or
select the response instead. Keep exports, feedback, and saved answers local; do not add network requests or telemetry.
