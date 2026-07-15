# Template Execution

Read this when creating or revising a skill that fills, refreshes, converts, or
edits a supplied document, workbook, deck, form, or other template. Use the
actual template as the contract for that run. This reference guides a skill's
branching behavior; it is not a universal template-filling sequence.

## Establish the authoritative artifact

Require the skill to identify the authoritative template before it writes. The
record should include the file, format, version or date when available, the
requested output name, and whether the task is a new artifact, a refresh of an
existing artifact, or a narrowly scoped edit. When multiple near-duplicate
files exist, do not infer which one wins from its filename alone; ask a focused
question or preserve each candidate until the user identifies the source.

When a derived map or execution contract will be reused across runs, or the
authoritative artifact can change between inspection and editing,
bind it to the exact reference kind and a stable marker such as a version or
content hash. Verify the marker before reuse. If it changed, inspect the
reference again instead of applying a stale map to a new structure.

Choose the output policy from the request:

- For a supplied artifact, work on a copy and keep the original unchanged
  unless in-place editing is explicitly requested.
- For a refresh, retain the prior artifact as a reference and create a new,
  clearly named version rather than overwriting it by default.
- For a small edit, modify only the named locations and dependencies that must
  change with them.
- For a net-new artifact built from a template, preserve the template's master,
  styles, dimensions, and structural conventions unless the request says to
  change them.

## Separate reference identity from task execution

For a reusable reference-backed skill, keep three responsibilities distinct:

- the template package identifies the artifact kind, retained reference, and
  optional representative preview;
- a format-native workflow performs inspection, copying or import, editing,
  rendering, export, and format-specific checks; and
- the current task owns user content, source data, and task-local maps, notes,
  or deviation records.

The template skill should resolve retained assets relative to its own directory
and use an available format-native workflow that can preserve and verify the
required structures. Keep tool-specific APIs in conditional instructions rather
than copying them into every generated template skill.

Keep the retained reference unchanged. Explicit user changes control requested
content and deviations; otherwise the retained reference controls layout and
formatting, ahead of domain or styling defaults.

A representative preview, when the package includes one, helps identify the
template rather than proving it can produce a complete result. Render a first
page, first slide, or first visible non-empty sheet range and reject a preview
that is blank, clipped, corrupted, or misleading. Full reference and output
inspection still belongs to task execution.

## Inspect before mapping content

Tell authors to make template inspection a real step, not an assumption that a
file extension describes its structure. Inspect the parts that can affect the
requested change:

- documents: sections, headings, tables, styles, fields, bookmarks,
  cross-references, headers/footers, footnotes, comments, and tracked changes;
- workbooks: sheets, used ranges, tables, formulas, named ranges, validations,
  pivots, charts, hidden rows or sheets, links, macros, and protection; and
- decks: slide size, masters, layouts, placeholders, content boundaries,
  speaker notes, section structure, slide numbers, charts, embedded objects,
  and source lines.

Render the reference before mapping when visual structure affects the edit.
Inspect every distinct page, section, slide, sheet, or recurring pattern that
the output may use. A representative preview is not a substitute for finding
later-page headers, alternate slide layouts, landscape sections, hidden formula
dependencies, or other variant structures.

Classify each relevant region as preserved, editable, repeated, calculated, or
unknown. Capture template-specific constraints beside the classification: for
example, a text length limit, a table-row pattern, a footer area, a protected
formula, or a layout boundary. Treat brand names, fonts, colours, logo rules,
and layout choices found in the supplied template as constraints for that
artifact, not as defaults for unrelated templates.

For a presentation template, identify placeholders by stable layout and
placeholder identifiers as well as position. Determine the safe content area
from the layout's actual content placeholder or measured boundaries, not by
guessing from nearby text. For document and workbook templates, identify stable
anchors such as bookmarks, headings, table labels, sheet/range names, or named
ranges; do not map content only by a repeated display string.

## Use the format-specific workflow

Use the format-specific branch that matches the retained reference. Keep these
details in conditional guidance rather than loading all of them on every run:

- **Documents:** derive a task-local contract from the complete reference,
  including distinct page and section patterns, stable edit slots, and
  preserve-only structures. Build from a copy, edit mapped elements, then
  compare both rendered pages and non-visual structures with the reference.
- **Presentations:** follow the selected workflow's source-reuse model. When it
  uses exemplar-slide cloning, inventory the source slides, map
  each output slide to an inherited source slide and stable element targets,
  then duplicate and edit those inherited objects. When it uses masters and
  layouts, create through those inherited structures and their native
  placeholders. Treat structural placeholders as exact targets: fill, rewrite,
  replace, or delete them rather than leaving them empty or covering them with
  overlays. If the available source structures cannot hold the requested
  content, choose another documented pattern, split the content where the
  template permits it, or report the blocker; do not build a parallel deck from
  visual similarity.
- **Spreadsheets:** import or copy the workbook, inspect values, formulas,
  styles, formats, names, links, and dependent objects, and render before
  editing. Preserve formula-driven, rule-driven, and intentionally static
  regions as the template defines them. Keep editable inputs typed. When adding
  a derived value, follow the workbook's established formula pattern or the
  user's explicit request; do not introduce formulas into a deliberate snapshot
  or hardcode derived values inside an established calculation area.

Keep inspection contracts task-local unless a stable reusable map has been
verified against the exact retained reference. Do not package transient render
paths, run logs, or capability-specific scratch state as template assets.

## Create a source-to-location map

Require a source-to-location map before a non-trivial fill or refresh. Each map
entry should identify the source field or calculation, target location, intended
format, whether the target is editable or formula-driven, repetition rule, and
what happens if the source is missing. Keep the map machine-readable when a
script or repeated execution consumes it; otherwise a compact table or
well-defined mapping block is enough.

Map semantic values rather than performing a global text replacement. The same
number can appear as body text, a chart series, a table value, a footnote, and a
derived percentage. Locate all intended occurrences, distinguish source values
from derived values, and update chart data or formulas rather than only their
labels. Flag related calculations whose inputs changed; do not silently alter
them or leave them presented as current.

For repeated sections, define the record grain, section anchor, ordering,
minimum and maximum count if the template has one, and insertion/removal rule.
Duplicate an established row, paragraph, slide, or section pattern only when
the template supports repetition. Never append records by copying a visually
similar block without checking references, numbering, table ranges, charts,
cross-references, or page/slide flow.

## Preserve structure and make minimal changes

Make the smallest change that fulfills the map. Preserve untouched content and
the template mechanisms that make it editable:

- documents: styles, numbering, fields, bookmarks, cross-references, comments,
  citations, headers/footers, and tracked changes;
- workbooks: formulas, named ranges, source links, validations, formatting
  semantics, hidden structure, grouping, macros, pivots, charts, and external
  data connections; and
- decks: masters, layouts, placeholders, theme, page numbering, notes, source
  lines, chart data, embedded objects, image crop settings, and alt text.

When a requested edit extends a table, chart, or repeated region, update only
the dependent range, formula, validation, conditional formatting, numbering,
or reference that genuinely covers the added content. Do not restyle entire
files, flatten editable objects, convert formulas to values, move source tabs,
or rebuild unaffected slides merely because a small region changed.

When replacement content exceeds a mapped slot, shorten it, choose another
documented source pattern, or split it across a permitted repeated structure.
Do not silently shrink text, cover inherited content with an overlay, or add a
second visual system on top of the template.

For package-based formats, prefer localized native edits that leave unrelated
parts alone. When the chosen library rewrites the package during export, compare
the final structure with the reference and account for every unexpected loss,
addition, or relationship change.

Keep a change record for a refresh or multi-location fill: source field, target
location, old value where relevant, new value, transformations, skipped fields,
and unresolved dependencies. Use it to compare the output against both the map
and the source data.

## Handle placeholders and missing fields deliberately

Define a missing-field policy that matches the template and request. A field
may remain blank, retain a template placeholder, receive an explicit missing
label, be omitted with its optional section, or stop the build. State which
choice applies to each required field type. Do not invent names, dates, metrics,
citations, formulas, or images to fill a space.

Keep placeholders visibly distinguishable from filled content, and scan the
finished artifact for unresolved placeholder tokens. A placeholder used to show
an optional location is different from a required field that prevents a valid
artifact; encode that difference in the map or validation. If the template
requires a source or note location, retain it when the value is absent and
identify the missing field instead of deleting the location.

Do not rely on visible placeholder text alone. Some formats retain empty
structural placeholders that do not appear in a render. Classify the exact
inherited object and require it to be filled, rewritten, replaced, preserved by
declared policy, or deleted. Adding content over an unresolved placeholder does
not resolve it.

## Update reusable template packages deliberately

When the skill itself updates a retained template package, resolve the exact
target and confirm that the replacement reference has the same artifact kind.
Preserve the skill identity and any files or behavior outside the requested
change.

Branch on what changed:

- for metadata or instruction changes, leave the retained reference and preview
  untouched unless the request also changes them;
- for reference content or visual changes, edit a temporary copy through the
  format-native workflow, render and inspect a new representative
  preview when one is used, and refresh contracts tied to the old reference;
  and
- after replacement, verify that relative paths resolve, the retained asset and
  preview agree with the declared kind, and no staging or backup artifacts
  remain.

Do not silently turn a reference replacement into a new template identity or
discard additional skill-owned files.

## Validate the final artifact

Give template skills checks that inspect both content and preservation:

- verify every required map entry reached the intended location and each filled
  value matches its source and format;
- verify repeated sections have the expected count, order, labels, references,
  and calculations;
- scan documents for unresolved fields, broken cross-references, and changed
  numbering; scan workbooks for formula errors, broken links, changed named
  ranges, and stale calculated values; and scan decks for unchanged or broken
  chart data, missing placeholders, and altered masters or layouts;
- compare the output structure with the template to find unexpected deleted or
  added sheets, slides, sections, ranges, layouts, or protected elements; and
- render or open every changed page, sheet, slide, and the first visible view
  to inspect overflow, clipping, wrapped text, table breaks, chart legibility,
  footer collisions, and blank regions.

Use reference-to-output comparison as a scope check. Expected differences
inside mapped edit regions are acceptable; unexplained movement, pagination,
geometry changes, masked inherited content, altered recurring elements, or
loss of preserve-only structures are failures. Visual comparison does not
replace checks for formulas, fields, relationships, names, placeholders, or
other non-visible structure.

Keep previews, renders, comparison images, maps, and diagnostic logs as QA
support unless the user asks for them. The default deliverable is the finished
artifact, not its execution scaffolding.

When the runtime reads cached workbook formula values or cannot render a native
format, state that limit and retain the artifact for calculation or visual
inspection in the appropriate application. Do not claim successful
recalculation or a visual check that did not occur.

## Failure behavior and evaluator handoff

Tell authors to stop safely when the authoritative template is unavailable, a
required location cannot be found, a target is protected or formula-driven when
the requested change requires an input, a repeated section lacks an insertion
rule, a required source value is missing and its declared policy is to stop, or
preserving a dependency is impossible. Preserve the source and do not present
an unchanged or partial artifact as the completed output. Keep task-local
diagnostics only when they help continuation, and report the template location,
source field, failed rule, and smallest correction needed. Do not switch to a
recreated look-alike template without saying so.

Also stop when no available workflow can perform the operations the requested
task requires while preserving and verifying the retained format with the
required fidelity. Report the missing operation rather than substituting a
look-alike workflow whose preservation cannot be checked.

When behavioral evidence is needed, give `skill-evaluator` cases that exercise
the specific template contract: a valid fill, a missing required field, an
optional blank, a repeated-section addition, a longer replacement that tests
layout, an existing formula or chart dependency, an ambiguous anchor, and an
unsupported template version. Specify the changed locations, preserved regions,
map coverage, artifact structure, rendered appearance, and failure behavior—not
merely that an output file exists.

For a reusable reference-backed skill, also hand off cases for each supported
artifact kind, relative asset resolution outside the authoring checkout, a
reference-version mismatch, unavailable format-native operations, a
metadata-only update that must not alter the reference, and a reference update
that must refresh any preview or derived contract. Include a case where a clean
preview coexists with a defect later in the artifact so preview generation
cannot pass as full validation.

Keep the runtime compact: put template-specific maps, brand constraints,
placeholder inventories, and stable layout measurements in template-local
references or assets; put repeatable inspection, mapping, generation, and
rendering in scripts; keep the common decision path in `SKILL.md`.
