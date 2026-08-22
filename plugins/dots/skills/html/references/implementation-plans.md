# Build an implementation plan

Read this when the requested HTML artifact is a product implementation plan,
migration plan, architecture plan, or technical delivery plan. The plan should
remove meaningful product and engineering decisions from implementation. It
should explain the intended experience, the system changes needed to produce
it, and how the team will prove the result.

Do not begin with pull requests. Begin with the product and technical contract.
Choose the plan's sections, order, and visual forms from the change itself.

Before outlining, identify the decision the reader must make, the visible
experience affected, the owners crossed, persistence or schema impact,
external or asynchronous work, rollout risk, and unresolved choices. This is a
reasoning step, not a required section in the finished plan. Use only the
signals that exist in the inspected sources.

## Ground the current state

Inspect the smallest relevant set of sources before proposing a change:

- the current user-facing experience;
- entry points, navigation, and return behavior;
- feature and mutation ownership;
- persisted records and repository contracts;
- data loading, identity, and failure behavior;
- in-progress work that the plan must reuse or avoid;
- product direction and visual references when the change is visible.

For a visible change, read current screens and source together. Screens show
the experienced result. Source establishes implemented behavior and system
boundaries. Neither is a ceiling, but a plan must name what it keeps, evolves,
and replaces.

Keep these categories distinct:

- confirmed current behavior;
- already-decided future behavior;
- proposed decisions;
- unresolved questions;
- deferred work.

Do not describe a proposal as current behavior. Do not turn an unknown into a
requirement merely to make the plan look complete.

## Choose a reading order from the change

Let the dominant decision or risk determine the plan's reading order. The
patterns below are examples, not named modes or templates:

- A decision-heavy change may move from evidence to the selected contract,
  implementation consequences, and proof.
- A workflow change may follow the person or operator through owner handoffs,
  persistence, failure, and return.
- A migration may lead with invariants, show before and after, then cover
  cutover, compatibility, repair, and rollback.
- A boundary or refactor change may move from current coupling to the target
  boundary, dependency order, and regression proof.
- A risky rollout may lead with blast radius, containment, observability,
  staged release, and recovery.

Combine, rename, reorder, or omit sections when the source calls for it. A
section may close several planning requirements. Do not render the analysis
categories above as a checklist or force a product-versus-technical split onto
a mixed change.

Add specialized content only when the inspected change activates it:

| Source signal | Include | Useful visual form |
|---|---|---|
| An unresolved presentation choice | Comparable alternatives, selection, and selected states | Consistent mocks or comparison |
| Persisted identity, summaries, or ordering | Data and identity contracts | Table, type sketch, or compact examples |
| Several owners or handoffs | Ownership and end-to-end flow | File map, sequence, or flow diagram |
| Schema or data rewrite | Migration, compatibility, repair, and rollback | Before-and-after map or cutover timeline |
| External or asynchronous work | Timeout, retry, cancellation, stale-result, and observability behavior | Failure flow or state table |
| A performance-sensitive path | Bounds, budgets, batching, and required evidence | Query table or measured comparison |
| A security- or privacy-sensitive boundary | Access, trust, data handling, and abuse constraints | Trust-boundary diagram or decision table |
| A visible interaction | Adaptive states and accessibility behavior | State matrix or high-fidelity mock |

The sections that follow are a module library. Their order in this reference
does not define the finished plan's order. Apply only the modules activated by
the inspected change, plus the universal readiness gates.

## Decide the experience before the architecture

For visible product work, define:

- what the person sees first;
- where the primary action lives when content is empty or absent;
- how zero, one, many, long, and dense values behave;
- how the person opens detail;
- which owner creates, edits, and deletes the record;
- what date, selection, scroll position, and focus survive dismissal;
- how loading, missing, unavailable, and failed states differ;
- how the composition adapts for Dynamic Type, VoiceOver, localization, and
  minimum target sizes.

When the presentation is unresolved, show two or three genuinely different
models with the same scope and representative data. A list, matrix, timeline,
and dominant-object composition make different claims about the product. Select
one and explain why the others lose. Do not choose a list merely because it is
easy to mock or implement.

Show the selected direction again at greater fidelity. Explain its hierarchy,
actions, states, and adaptation. The selected mock becomes a visual contract,
not decoration.

## Translate references into product principles

For each product or inspiration source, state the one contribution that changes
the decision. Useful contributions include hierarchy, interaction, continuity,
information density, progressive disclosure, and material treatment.

Do not copy a reference's visual style without explaining why it fits the
product. Do not present inspiration as evidence of current implementation.

When the plan must make or validate an unresolved product-UI decision, use the
relevant product-design workflow. If the design is already approved or
supplied, treat it as source material. HTML owns the document and static mock.
Product design owns hierarchy, interaction, accessibility, and visual judgment.

## Define the end-to-end workflow

For a person- or operator-driven workflow, trace one representative action from
discovery through persistence and return:

1. The person reaches the entry point.
2. The presentation owner supplies the current context.
3. The canonical owner performs the mutation.
4. Persistence returns stable identity or failure.
5. Affected reads refresh.
6. The person returns to the same useful context.

For system-driven work, trace the triggering event, boundary crossings, state
change, observable result, and failure or recovery path instead.

Use a flow diagram only when the workflow branches or crosses several owners.
Use process steps for a linear path. The accompanying prose must name the same
path so the diagram is not the only explanation.

## Define ownership

When the change crosses ownership boundaries, name the applicable owners:

- selection and navigation;
- root composition;
- canonical records;
- creation, editing, and deletion;
- external projection or synchronization;
- detail presentation;
- refresh, dismissal, and focus restoration.

There should be one canonical mutation owner. A read or composition surface
must not silently become a second writer. Reuse an existing owner when its
product job and identity contract match. Do not reuse it merely because the UI
looks similar.

## Define the data contract

When data work is material, include the proposed structures or the smallest
equivalent pseudocode. Cover:

- persisted entities already in use;
- new query or repository contracts;
- feature read models;
- state enums;
- stable identifiers;
- ordering rules;
- summary and aggregation rules;
- calendar and time-zone boundaries;
- failure semantics;
- migration and rollback consequences.

Keep storage types, domain facts, and presentation summaries in their proper
owners. A repository should return canonical records or a bounded domain read,
not a view-specific card model. A feature read model may derive presentation
without persisting it.

Distinguish:

- zero from missing;
- missing from unavailable;
- unavailable from failed;
- aggregate identity from exact record identity;
- canonical values from derived summaries;
- deletion from absence;
- current data from stale data.

Use stable field or record identifiers for logic. Do not base aggregation or
routing on display names, formatted values, or approximate timestamps.

## Close summary and ordering rules

Do not leave aggregation policy for implementation to invent. For every
supported subject or record family, state:

- what the root shows;
- what detail shows;
- whether values sum, choose the latest record, remain separate, or become a
  count;
- what happens when a value is malformed or incomplete;
- how equal-looking independent records remain distinct;
- the stable display order;
- the behavior for future unsupported types.

When different record families have different semantics, use typed summary
cases instead of one loosely populated structure.

## Define state and failure behavior

Name the state model rather than relying on optional values. A useful plan
usually covers:

- loading;
- successful empty;
- successful content;
- partial content;
- unavailable source;
- failed read;
- stale result after a newer selection;
- mutation success and mutation failure.

State what remains visible after a partial failure and where recovery lives.
Do not turn a failed read into an empty state or a malformed value into zero.

## Define performance behavior

State the relevant performance contract:

- query bounds;
- expected query count;
- batching behavior;
- lazy detail loading;
- cancellation and stale-result protection;
- index expectations;
- whether a cache or schema migration is required.

Require evidence before adding an index, cache, persisted summary, background
process, compatibility layer, or generic framework. When an existing index may
serve the query, require query-plan evidence before adding another one.

## Map the change to concrete ownership

Use `file-map` when the plan changes several files or modules. Include only the
files a reviewer must understand. For each one, name the behavior it owns and
the exact change it receives.

Name proposed types, routes, callbacks, or symbols when doing so removes
ambiguity. Mark them as proposed. Do not dump a directory tree or invent a new
file for every type.

## Plan vertical delivery

Each pull request should ship or prove one self-contained outcome without
breaking the working system. Prefer a complete vertical workflow when it can
land safely. A preparatory test boundary, refactor, migration foundation, or
rollout step earns a separate pull request only when it has independent review
value or removes material risk from the next change. For each pull request,
state:

- the user-visible or operator-visible outcome;
- technical changes;
- dependencies;
- acceptance criteria;
- rollback behavior;
- explicit exclusions.

Use commits to separate reviewable layers inside one vertical pull request. Do
not split mechanically by data, feature, and UI layers. Every landed slice must
keep the build and supported behavior working.

Keep the list of pull requests as short as the risk permits. A future project
should not become an empty placeholder pull request in the current plan.

## Define proof and rollback

Organize proof by behavior or layer, not by a generic test list. Relevant gates
may include:

- repository boundaries and deterministic ordering;
- summary and state composition;
- cancellation and partial failure;
- identity-safe routing;
- date and time-zone behavior;
- accessibility and focus restoration;
- query count and query plan;
- unchanged out-of-scope behavior.

For each gate, state what would be proved and what the team should do if it
fails. Do not claim a build, test, preview, or runtime pass that has not run.

State whether rollback removes code only, requires a schema change, or needs
data repair. A plan that writes no new schema or records should say so.

## Keep scope honest

End with concrete deferred work and explicit exclusions. Name adjacent features
that the proposed abstractions must not prebuild. Keep broad ranges, search,
customization, migration, automation, and redesign out unless the selected
workflow needs them now.

Ask whether each proposed abstraction is required by the current workflow. If
not, remove it or place it in the later project that owns the need.

## Product mocks inside plans

A mock must answer a design question. It is not decoration.

When comparing alternatives:

- keep scope and representative data consistent;
- change the semantic model, not only styling;
- explain the trade-off under each concept;
- select one without using a decorative badge;
- show the selected direction again with its states and anatomy.

Do not let a mock imply unsupported behavior. A progress bar implies a goal. A
disabled control implies eligibility. A trend arrow implies comparison. A
timeline implies time order matters. Remove those signals unless the plan
defines their meaning.

Label illustrative values and concept UI honestly. Observed screens, generated
concepts, and proposed HTML mocks are different evidence classes.

## Writing the plan

Apply the shared writing-style reference. Use plain, active, specific prose.
Name the object, owner, action, state, and consequence. Vary sentence length,
but keep one decision per sentence when density is high.

Avoid:

- process narration about rewriting or generating the plan;
- editorial status labels such as `updated`, `new plan`, or `scope rewritten`;
- puffery about polish, completeness, or transformation;
- abstract architectural nouns when a concrete type, query, or owner exists;
- repeated bold-label listicles;
- generic conclusions that restate the introduction.

The recommendation should commit. It should name what to build, the boundary
that keeps it contained, and what follows later.

## Readiness check

Before presenting a plan as implementation-ready, answer yes to these universal
questions. They are coverage requirements, not required headings:

- Does the plan state one selected outcome and its scope boundary?
- Is current behavior separate from proposed behavior?
- Can a reader trace the change from its entry point or triggering event to its
  observable result and recovery or return path?
- Does every delivery slice state its outcome, dependencies, acceptance
  evidence, and safe landing or rollback behavior?
- Does each proof gate say what it proves and what happens when it fails?
- Are exclusions and deferred work explicit, rollback applicability stated,
  and speculative abstractions removed?
- Does the prose pass the shared writing-style review?

Then apply only the gates activated by the inspected change:

- When records are created or mutated, is there one canonical mutation owner?
- When identity, dates, or time affect behavior, are stable identifiers and
  calendar boundaries defined?
- When values aggregate or reorder, are summary, malformed-value, identity,
  and ordering rules closed?
- When data is persisted or migrated, are structures, compatibility, repair,
  and rollback consequences concrete enough to review?
- When loading or asynchronous work changes, are empty, partial, unavailable,
  failed, stale, cancellation, retry, and recovery states distinct where they
  can occur?
- When the change crosses owners or services, are handoffs, failures, and
  observability defined?
- When performance can change materially, are bounds, budgets, batching, and
  the evidence required for new indexes or caches stated?
- When security or privacy boundaries change, are access, trust, and data
  handling constraints explicit?
- When interaction or presentation changes, are primary behavior,
  accessibility, adaptation, dismissal, refresh, and focus restoration covered
  where applicable?
- When presentation was unresolved, does the plan compare meaningfully
  different alternatives and select one?

If an applicable answer is no, report the plan as incomplete or
decision-blocked. Do not add an irrelevant section to satisfy a gate, and do
not hide a material gap with more visual polish.
