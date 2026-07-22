# Reports And Presentations

Read this when authoring or revising a skill that creates, updates, or checks a
report, presentation, pitch deck, briefing, memo, or other reader-facing
artifact. Build a workflow for the artifact's actual job, not a fixed page or
slide template. The skill should adapt its structure to the artifact, supplied
materials, and reader need while making its evidence and completion checks
observable.

## Define The Artifact's Job

Before prescribing sections, establish the conditions that determine them:

- **Audience:** who will read, present, or act on the artifact; what they know
  already; and how much detail they can absorb in one pass.
- **Decision objective:** the understanding, choice, alignment, or next action
  the artifact must enable. If no decision is required, define the intended
  change in understanding instead.
- **Artifact role:** whether it introduces a view, compares options, explains a
  result, records a recommendation, supports a meeting, or supplies reference
  detail.
- **Inputs:** controlling source files, data, prior artifacts, templates,
  approved wording, and known gaps.
- **Output surface:** editable deck or document, PDF, HTML report, page plan,
  or a different user-requested format. Do not make a planning artifact the
  primary deliverable when the request calls for a finished reader-facing file.

Write the skill so it asks only for a missing answer that would change the
objective, audience, controlling inputs, or output surface. Otherwise state
the working assumption in the artifact or handoff where it affects
interpretation, then proceed.

## Plan The Story Before Construction

For a persuasive or decision-facing artifact, require a concise storyline
before the skill writes pages or slides. It should name the reader's decision or
takeaway, the central conclusion, the evidence that supports it, and the main
uncertainty or objection the artifact must address. Such an artifact is an
argument with evidence, not a fact inventory.

For a status, descriptive, or reference artifact, define an information path
instead: what the reader needs to locate, compare, understand, or monitor; the
state and period represented; and the supporting detail needed to interpret it.
Do not manufacture a recommendation or conclusion merely to make a neutral
artifact sound decisive.

Turn that storyline into a page or slide plan only when the artifact needs one.
For every planned unit, define its function:

- the reader question it answers or the decision it advances;
- its takeaway, written as a conclusion when the evidence supports one;
- the evidence, analysis, or visual that earns that takeaway; and
- the required transition to the next unit.

Let the functions determine order and density. Put the answer and the few facts
needed to understand it early when readers need a fast read; place methods,
supporting detail, source registers, and large tables later or in an appendix
when they would interrupt that path. Do not repeat the same conclusion in
several summary treatments unless each gives the reader new decision-useful
information.

Use a fixed archetype or section order only when supplied materials, an approved
template, or the user explicitly requires it. Otherwise describe the sequence
as a set of functions the skill must satisfy, with conditions for adding,
combining, moving, or omitting units.

## Make Claims Traceable

Author a source-to-claim contract whenever the skill creates factual,
quantitative, comparative, or recommendation-bearing content. The contract may
be a source register, claim ledger, footnotes, point-of-use citations, or an
equivalent representation appropriate to the output format. It must let the
skill determine, for each important claim:

- what source, calculation, or supplied input supports it;
- the source location and relevant date, period, version, or as-of point;
- whether it is a directly supported fact, derived result, interpretation,
  assumption, placeholder, or unresolved claim; and
- where the claim appears in the artifact.

Specify how the skill handles conflicting, stale, incomplete, or unavailable
inputs: show the conflict or gap, preserve the distinction between source fact
and interpretation, and avoid converting an unresolved item into a confident
statement. Do not silently average conflicting values or select the most
convenient one.

When the artifact carries a recommendation or conclusion, instruct the skill to
connect it to the evidence and to identify the observation, assumption, or
missing input that would change the conclusion. Keep this proportional to the
requested artifact; do not force a long evidence ledger into a short briefing
when readable citations and a compact source note provide the needed trace.

## Give Data Displays A Contract

For every chart, table, scorecard, diagram, or data-rich callout, require enough
metadata to verify what the reader is seeing:

- purpose and intended takeaway;
- title, measure definitions, units, currency or scale where relevant, period
  or as-of point, and scenario or comparison basis;
- source or calculation linkage, including the data transformation when it
  changes interpretation;
- labels, legend, axes, ordering, and precision needed to read the display;
- a check that the visual, nearby text, and headline tell the same story.

Make chart selection conditional on the question and data relationship. A trend,
comparison, composition, distribution, ranking, and relationship need different
encodings. Require bars to use a zero baseline unless a clearly labeled exception
is necessary; require comparable panels to use comparable scales; and require
any truncated axis, forecast boundary, or scenario change to be explicit.

Do not use a display merely to decorate a page. If a table or chart cannot
answer a reader question more clearly than compact prose, omit it. If the data
is image-only or cannot be inspected, state that limitation rather than claiming
the values were tied out.

## Preserve The Supplied Visual System

When users provide a deck, document, template, or brand assets, make preserving
them the default contract. The skill should inspect the existing structure and
retain the elements that define the artifact unless the user requests a change:

- slide or page size, masters, layouts, section structure, and page numbering;
- typography, color tokens, spacing, grids, table conventions, and footnote
  treatment;
- approved logos, imagery, icons, boilerplate, and other supplied assets; and
- editable source structure, including existing charts and linked content where
  the output format supports preservation.

Require the skill to make new content look intentional within that system rather
than approximating supplied assets with improvised replacements. If no visual
system is supplied, give the skill a small, consistent visual language that
serves hierarchy and reading rather than decorative variation. Record intentional
style departures where the user needs to understand them.

## Design For The Intended Reading Pattern

For executive or decision-facing work, make a fast first read possible without
reducing needed detail. For status and reference work, optimize navigation,
current-state clarity, and selective lookup. Apply the relevant instructions:

- Write titles and headings as the point of the unit when the evidence supports
  a point; use neutral labels for reference-only content.
- Establish a visible reading order. Use conclusion, proof, implication, then
  detail for decision-facing units; use topic, current state, support, then
  detail for neutral or reference units.
- Limit each unit to one primary message; split or simplify a unit carrying
  unrelated messages.
- Use short, scannable prose and labels. Replace generic superlatives with the
  specific evidence or remove them.
- Keep key values, dates, terms, and citations readable at the target viewing
  size. Do not hide essential meaning in tiny footnotes, color alone, or images
  of text.
- Apply consistent units, decimal precision, capitalization, labels, and
  terminology across repeated content.

For a presentation, account for projected viewing and the presenter’s pacing.
For a report, account for scrolling, printing, and selective reading. Treat
readability defects—clipped content, overlap, weak contrast, dense tables,
unlabeled charts, or broken hierarchy—as defects in the artifact, not cosmetic
afterthoughts.

## Require Artifact-Level Inspection

Do not let a skill claim a finished artifact from source text, generated code,
or file existence alone. Give it a format-appropriate inspection path:

1. Extract text, numbers, and structure when tooling supports it, using the
   result as a map rather than proof of visual correctness.
2. Render the actual deliverable—slides, pages, PDF, or HTML—and inspect each
   page or slide the skill creates or changes. For a long artifact, define a
   sampling rule that covers changed units, data displays, and section openings,
   then identify any units that were not inspected.
3. Compare rendered content with the source-to-claim and chart/data contracts.
4. Inspect the target viewing sizes. For responsive HTML, include a narrow
   viewport and verify that the document does not overflow horizontally; tables
   may scroll inside a clearly bounded container.
5. Record what was inspected and what could not be verified so the final
   artifact and any companion notes agree.

Require the skill to preserve original user files during inspection and proposed
changes. If it edits an existing artifact, use a distinct output or versioned
copy unless the user explicitly authorizes replacement.

## Define Failure Behavior

Write concrete branches for common failure modes:

| Condition | Required behavior |
| --- | --- |
| Objective, audience, or artifact format would change the result | Ask one focused question; otherwise proceed with a stated assumption. |
| Controlling source, data, or template is absent | Build only the supportable structure, label placeholders or gaps, and request the missing input rather than inventing content. |
| Sources conflict or a value does not tie across the artifact | Identify the locations and conflict, retain both values until resolved, and prevent the claim from appearing as settled. |
| A chart or page cannot be read from extraction alone | Render and inspect it; if rendering is unavailable, state the unverified surface. |
| Rendering shows clipping, overlap, unreadable text, broken hierarchy, or inconsistent formatting | Correct the artifact and render again before handoff. |
| A required output format cannot be produced | Offer the closest usable surface only if it preserves the requested objective, and label the limitation. |

Avoid vague instructions such as “ensure quality” or “make it polished.” Name
the observable check, the condition that fails it, and the corrective action.

## Prepare The Evaluator Handoff

When behavioral evidence is needed, give `skill-evaluator` requests that test
the workflow's decisions rather than a single preferred page order. Include
these cases when they fit the skill:

- a well-scoped request with sources and a supplied template;
- a request with a different audience or decision objective that requires a
  different storyline and page plan;
- conflicting or missing source inputs that must remain visible;
- a data-heavy artifact with unit, period, chart, or citation ambiguity;
- an existing deck or document that must retain its visual system; and
- a rendered-output defect that cannot be found from text extraction alone.

For each case, assert observable outcomes: the required decision framing,
claim labels or citations, page or slide functions, data-display metadata,
preserved template elements, rendered inspection evidence, and accurate handling
of unresolved inputs. Reject tests that merely check for generic headings,
fixed slide counts, or copied example wording.
