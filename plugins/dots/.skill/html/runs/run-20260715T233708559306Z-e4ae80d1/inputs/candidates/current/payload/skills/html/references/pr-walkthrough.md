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

Build a change inventory that distinguishes:

- user-visible behavior and workflows
- product rules and affected surfaces
- data, persistence, migrations, and removed behavior
- external services, datasets, permissions, privacy, and operational effects
- architecture or ownership changes that alter how the system works
- validation evidence, limitations, unknowns, and unfinished work
- mechanical, generated, fixture, documentation, and test-only changes

Preserve every meaningful change the investigation identifies and distinguish
it from supporting mechanics. A meaningful change alters behavior, capability,
product truth, stored facts, system boundaries, risk, or future operation. It
belongs in the teaching narrative. Summarize supporting mechanics compactly
unless they carry their own consequence. If a narrative gap matters, inspect
the relevant source; if the evidence remains unavailable or inconclusive, name
the unknown rather than smoothing it over.

## Build a teaching story

Choose sections from the PR's conceptual shape. Do not turn the inventory into
a standard set of headings, force empty sections, or organize the page by file
or commit order. Name sections in product language.

Every walkthrough needs this narrative spine, although adjacent parts may be
combined when the change is small:

1. **Outcome.** Lead with what is now meaningfully different and why it matters
   to users, the product, or the team. Use plain language and present the
   concrete result before repository terminology.
2. **Before and after.** Give only the prior context needed to understand the
   change, then state the new mental model. Contrast behavior and responsibility,
   not lists of old and new files.
3. **Complete change tour.** Explain every meaningful change, grouped by product
   responsibility, user journey, or causal dependency. Connect each group to the
   central idea and its consequence.
4. **Evidence and status.** Explain what proves the important behavior, what is
   not verified, what remains unfinished, and any decision the reader still
   needs to make.

Add teaching sections only when the change calls for them:

| Signal in the change | Useful section or treatment |
|---|---|
| A new or changed user flow | Walk one realistic user journey from start to observable result. |
| One concept affects several surfaces | Map the affected surfaces and explain what changes at each one. |
| A shared abstraction or architecture changed | Introduce one mental model or diagram, tied to product consequences. |
| Stored data or persistence changed | Explain which facts existed before, which exist now, and why the distinction matters. |
| A migration, deletion, or hard cut occurred | State what was removed, what replaces it, and what cannot continue unchanged. |
| An external service or dataset is involved | Separate what is shipping, what is only prepared, and the concrete adoption work remaining. |
| UI or visual behavior changed | Use real before/after evidence or representative states when available. |
| Permissions, privacy, security, or trust changed | Explain the user-facing trust boundary and failure consequence. |
| Performance or reliability changed | Name the former bottleneck or failure, the mechanism that changed, and the measured result. |
| Developer infrastructure changed | Explain the downstream product capability or operating improvement it enables. |
| A consequential tradeoff was recorded | Explain the decision, credible alternative, and consequence without inventing rationale. |
| The diff is broad but partly mechanical | Teach the meaningful changes and finish with compact supporting coverage. |

For a substantial or cross-cutting PR, use one concrete example early and carry
it through the system. Show how a realistic input, action, or state becomes an
observable result. Generalize only after the example establishes the mental
model. For a small fix, a short before, cause, after, and evidence story may be
the complete walkthrough.

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

Tie internal detail to a consequence. When describing a schema, controller,
queue, adapter, or test, explain the fact it represents, the behavior it owns,
the failure it prevents, or the product capability it enables. Prefer a concrete
example over several abstract labels.

Use visuals only when they replace prose:

- `comparison-grid` for a genuine before/after mental model
- `flow-diagram` for one causal or end-to-end path
- `data-table` for repeated mappings such as product surface to changed behavior
- real screenshots or clips for visual and interaction changes
- `callout` for an unfinished boundary or limitation the reader must not miss

Do not decorate the page with architecture diagrams, KPI tiles, or test counts
that do not improve understanding.

## State evidence and incompleteness honestly

Describe what validation proves rather than presenting test totals as the
story. Keep these states distinct when external adoption or staged delivery is
involved:

- **Shipping:** implemented and available in the resulting product or system.
- **Prepared:** foundations exist, but the claimed user or operational value is
  not active yet.
- **Remaining:** specific work or evidence still required.

Separate confirmed facts, source-supported rationale, inference, and unknowns.
Do not smooth over a gap because the surrounding implementation is complete.

## Completion check

Before the general HTML verification, imagine the reader never opens GitHub, a
source file, or the diff. The walkthrough is complete only when they can
accurately explain:

- what changed and why it matters
- how the important behavior or system now works
- what the relevant before/after distinction is
- which product surfaces, stored facts, and external boundaries are affected
- what was removed, prepared but not delivered, or left unfinished
- what evidence supports the result and what remains unverified

Confirm that every meaningful change from the inventory appears in the
teaching narrative and every supporting change is accounted for without being
given equal weight. Remove code-reading instructions such as “start with this
file,” “review this module,” or “follow this test.” If the reader still needs a
separate explanation to understand the page, the walkthrough is not finished.
