# Pull-request walkthrough

Use this for a self-contained, reviewer-facing HTML walkthrough of a pull
request. Inspect the PR, diff, and relevant repository context, then teach a
smart, non-technical product manager every meaningful change without requiring
them to open the diff or read code.

Do not make an approval recommendation or invent review findings. Explain the
resulting product and system, including limitations and unfinished work, so the
reader can make an informed judgment from the walkthrough itself.

## Understand the change

Read the actual source before writing: the PR description, diff, affected code,
and the tests, configuration, documentation, or surrounding system behavior
needed to understand its consequences. A file list or diff summary is not an
explanation. Separate what the source confirms from what you infer, and mark
what remains unknown.

List every meaningful change before writing. Distinguish:

- user-visible behavior and workflows
- product rules and affected screens or areas
- data, persistence, migrations, and removed behavior
- external services, datasets, permissions, privacy, and effects on running the product
- architecture or ownership changes that alter how the system works
- validation evidence, limitations, unknowns, and unfinished work
- generated, documentation, test-only, and other supporting changes

Preserve every meaningful change and distinguish it from supporting details. A
meaningful change alters behavior, capability, rules or data people rely on,
stored facts, responsibility, risk, or future operation. It belongs in the
walkthrough. Summarize supporting implementation details compactly
unless they carry their own consequence. If a narrative gap matters, inspect
the relevant source; if the evidence remains unavailable or inconclusive, name
the unknown rather than smoothing it over.

## Build a teaching story

Derive the document shape from the change. Before outlining, identify the
former condition, failure, constraint, or opportunity; the practical result;
the included and excluded scope; the runtime actors and facts that changed; and
the evidence gap that matters most. This is a private change map, not a rendered
section.

Choose the reading order that best explains the dominant change. These are
examples, not templates:

- **User-journey change:** former problem -> before/after experience -> one
  realistic journey -> important states and boundaries -> proof
- **Ownership or architecture change:** former failure -> competing or missing
  responsibility -> new owner and handoffs -> product consequence -> proof
- **Data or migration change:** former facts -> transformation -> new facts and
  identities -> cutover, removal, or recovery -> proof
- **Reliability fix:** observed failure -> cause -> changed mechanism ->
  recovered and failed states -> proof
- **Foundation or staged delivery:** capability being enabled -> foundation
  added -> what is shipping, prepared, and remaining -> adoption boundary

Combine those spines when the change genuinely crosses them, and invent a
better one when needed. Do not organize the page by file, commit, diff order,
or a reusable heading template. Name sections in product language and keep the
smallest structure that teaches the complete change.

Every walkthrough must cover these invariants, but they do not need their own
headings and one section may satisfy several:

- the actual work and its observable result
- the specific failure, constraint, or opportunity that made it necessary
- what the PR includes, deliberately excludes, removes, and leaves unchanged
- how one concrete action, input, or state moves through the relevant actors
  and facts to reach its result
- the material before/after distinction in behavior, responsibility, or data
- consequential residual risks, their user or operational consequence, and the
  relevant containment or decision boundary
- what evidence proves consequential behavior and what remains unverified

The first screen should give a time-constrained reviewer the result, the need,
and the scope boundary. The rest of the page should earn its length by
explaining mechanism, consequence, and proof rather than repeating summaries.

Add teaching sections only when the change calls for them:

| Signal in the change | Useful section or format |
|---|---|
| A new or changed user flow | Walk one realistic user journey from start to observable result. |
| One concept affects several product areas | Map those areas and explain what changes in each one. |
| A shared abstraction or architecture changed | Explain how the system works now or use a diagram tied to product consequences. |
| Stored data or persistence changed | Explain which facts existed before, which exist now, and why the distinction matters. |
| A migration, deletion, or hard cut occurred | State what was removed, what replaces it, and what cannot continue unchanged. |
| An external service or dataset is involved | Separate what is shipping, what is only prepared, and the concrete adoption work remaining. |
| UI or visual behavior changed | Show the actual screen composition with matched evidence or UI-shaped wireframes of the changed states. |
| Permissions, privacy, security, or trust changed | Explain the user-facing trust boundary and failure consequence. |
| Performance or reliability changed | Name the former bottleneck or failure, the mechanism that changed, and the measured result. |
| Developer infrastructure changed | Explain the downstream product capability or operating improvement it enables. |
| A consequential tradeoff was recorded | Explain the decision, credible alternative, and consequence without inventing rationale. |
| The diff is broad but includes many supporting changes | Teach the meaningful changes and finish with compact supporting coverage. |

For a substantial or cross-cutting PR, use one concrete example early and carry
it through the system. Show how a realistic input, action, or state becomes an
observable result. Generalize only after the example establishes the
explanation. For a small fix, a short before, cause, after, and evidence story
may be the complete walkthrough.

When several walkthroughs belong together, use one quiet contents page. Give
each PR or stack one row with the actual change, why it matters, and what
deserves attention. Add a stack overview or consolidated verification page only
when it explains cumulative behavior that the individual pages cannot. Keep one
navigation layer and do not repeat the same routes in multiple rails.

## Teach at the reader's level

Steady, direct, warm. Treat the reader as intelligent without assuming a
technical background. Decide what they already know from the request and pitch
one notch above that. Never restart from zero for someone mid-topic, and never
assume technical vocabulary they have not used; their own words are the best
evidence of their level. Lead with the conclusion, then include the mechanism,
evidence, and implication they need to understand the change and judge its
consequences.

Keep it conversational. Use an example or analogy only when it shortens the
path. Explain technical mechanisms in plain language without removing causal
detail the reader needs. Translate a technical term at the point it first
becomes useful, then use its precise name consistently. Do not front-load a
glossary. File and symbol names are optional supporting links, never required
reading or the substance of a section. Say what is confirmed, inferred, and
unknown.

If files, types, routes, or symbols help establish coverage, put them after the
concept is clear. A useful row pairs the part with its plain-language
responsibility, exact change, and consequence. Do not present a bare file list,
and do not label a section an "execution path" unless it explains every
important handoff from the initiating action to the observable result.

Tie internal detail to a consequence. When describing a schema, controller,
queue, adapter, or test, explain the fact it represents, the behavior it owns,
the failure it prevents, or the product capability it enables. Prefer a concrete
example over several abstract labels.

Use visuals only when they replace prose:

- `comparison-grid` for a genuine before/after explanation
- `process-steps` for one linear causal or end-to-end path
- `flow-diagram` only when the path branches or rejoins
- `data-table` for repeated mappings such as product surface to changed behavior
- real screenshots, clips, or screen-shaped wireframes for visual and
  interaction changes; include the controls, hierarchy, values, and states that
  actually changed
- `callout` for an unfinished boundary or limitation the reader must not miss

Do not substitute numbered story cards or a generic process diagram for a UI
change. Do not put types, files, or repeated mappings into bento cards when rows
make comparison easier. Describe removed behavior in ordinary before/now prose
or a table, never with strike-through styling.

Avoid decorative horizontal rules, nested or double borders, and status chips.
Do not decorate the page with architecture
diagrams, KPI tiles, test counts, merge-state boxes, or review metadata that do
not improve understanding.

Keep system meta-narration out of the artifact. Do not say that the page,
diagram, or explanation was generated, derived from a branch, source backed,
assembled from a diff, or designed to tell the reader how to read, review,
navigate, use, or respond to it. Use an ordinary product heading and explain
the change itself.

## State evidence and incompleteness honestly

Describe what validation proves rather than presenting test totals as the
story. Omit approval state, reviewer counts, check labels, checked times,
commit identifiers, mergeability, and design-review bookkeeping unless one of
those facts materially changes the reader's product or delivery decision.
"Passed" alone is not evidence; name the behavior or risk the check exercised.

Keep these states distinct when external adoption or staged delivery is
involved:

- **Shipping:** implemented and available in the resulting product or system.
- **Prepared:** foundations exist, but the claimed user or operational value is
  not active yet.
- **Remaining:** specific work or evidence still required.

Separate confirmed facts, reasons recorded in the source, inference, and unknowns.
Do not smooth over a gap because the surrounding implementation is complete.

## Before delivery

Before the general HTML verification, imagine the reader never opens GitHub, a
source file, or the diff. The walkthrough is complete only when they can
accurately explain:

- what changed and why it matters
- how the important behavior or system now works
- what the relevant before/after distinction is
- which product areas, stored facts, and outside services are affected
- what was removed, prepared but not delivered, or left unfinished
- which consequential risks remain and how they are contained or handed off
- what evidence supports the result and what remains unverified

Confirm that every meaningful change from the list appears in the walkthrough
and every supporting change is accounted for without being given equal weight.
Confirm that every rendered section can point to a source signal or reviewer
decision it helps explain. Remove sections whose only job is to display
bookkeeping or prove that the artifact was made.

Remove code-reading instructions such as “start with this
file,” “review this module,” or “follow this test.” If the reader still needs a
separate explanation to understand the page, the walkthrough is not finished.
