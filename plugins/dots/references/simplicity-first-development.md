# Simplicity-First Development

Use this reference when a software workflow needs to choose between direct work,
a material feature workflow, or consequential boundary design. It also owns the
prompt and subtraction-audit library linked by those workflows.

## Default path

```text
user moment
    ↓
smallest complete behavior
    ↓
existing owner
    ↓
direct implementation
    ↓
render or exercise the real path
    ↓
delete scaffolding and losing paths
    ↓
risk-proportional proof and review
```

Architecture remains available, but only when a demonstrated boundary problem requires it.

# Decisions

## Adopt directly

### Start from a moment, not a system

Material product work begins with the person, context, action, and observable result. “Apple Design Award” is a craft bar for that moment, not authorization to redesign the surrounding architecture.

### Existing owner first

Before creating a type, service, protocol, repository, coordinator, cache, registry, or persisted representation, identify the existing owner of the nearest durable rule and test whether it can absorb the change while remaining cohesive.

### Architecture is an exception

A new boundary must be required by at least one current condition:

- a new persisted lifecycle;
- a real external or independently deployed contract;
- an atomicity or concurrency boundary that cannot remain in the existing owner;
- current duplicated policy or competing owners that the new boundary will replace;
- several current callers that otherwise must know the same nontrivial rule.

A one-line mapping, route, condition, sort, query, copy, or presentation correction does not qualify.

### Candidate A adds no boundary

Every architecture exercise starts with the best implementation using existing owners and no new durable concepts. A second architecture candidate is produced only when Candidate A cannot satisfy a consequential current requirement.

### Plans are gated before code

When a plan is warranted, a fresh read-only pass checks **GAPS and EXCESS** before implementation. The gate inventories every new durable concept and asks what existing owner could serve instead.

### Unlimited ambition on feel; rationed machinery

A product prompt may be highly ambitious about responsiveness, hierarchy, motion, accessibility, reliability, and delight. It should also carry a mechanical budget or explicit stop condition. The budget is a **warning and stop-and-report threshold**, not a target to game or a license for poor code.

### One canonical owner and one current path

Ranking, ordering, pagination, validation, normalization, conflict resolution, persistence, and lifecycle state each need one winning owner. Consolidation is incomplete while the losing path, fake, adapter, test, fixture, document, or migration remains.

### Derive before storing

Persist only state that must survive process death and cannot be authoritatively and affordably derived from current canonical truth.

### Production behavior before a full fake

Use real repositories over ephemeral storage and narrow delay/failure decorators before creating another implementation of product rules.

### Product subtraction is allowed

A simplification audit may recommend deleting a visible mode, setting, route, screen, chart, gesture, notification, widget, App Intent, or entire feature. It is not restricted to invisible refactoring.

### Review and delegation are proportional

Localized work should not automatically trigger a multi-stage workflow, multiple architecture candidates, or independent review. Material and boundary changes receive stronger gates.

## Adopt as heuristics, not laws

### “Third use” extraction rule

Repeated current behavior must exist before extraction, but an exact third-caller rule is too rigid. Two stable consumers can justify sharing when the invariant is expensive and extraction materially reduces total complexity. Three visually similar call sites do not automatically justify it.

### LOC and file budgets

Use a rough budget to expose drift and trigger a checkpoint. Do not make LOC, file count, type count, or protocol count blocking quality metrics. A correct local boundary may require net-positive code; a harmful change can be deceptively small.

### One implementation per protocol

One production conformer is a strong audit signal, not an automatic deletion order. A protocol may still earn its place at a target boundary, external adapter seam, or controlled test-injection point. Apply the deletion test and inspect actual callers before removing it.

### One work item at a time

Keep one **conceptually coupled product or architecture change** in flight. Parallel read-only investigations and truly independent implementation lanes remain useful. Do not serialize unrelated work merely to satisfy a slogan.

# Canonical principles

## Product before architecture

Settle what the person sees, does, and understands before deciding module, service, protocol, persistence, or state-machine shape.

## Existing owner first

Add behavior to the nearest cohesive owner. A new owner carries the burden of proof.

## Direct before abstract

Prefer direct control flow, a concrete type, a local helper, an exhaustive switch, or one repository operation before a protocol family, renderer registry, strategy, type erasure, or generic pipeline.

## Derive before storing

A stored value must participate in a current product, recovery, privacy, delivery, or consistency decision.

## Cheap recomputation before metadata systems

Prefer an occasional bounded reread over another invalidation graph, dependency registry, cache lifecycle, or source-marker taxonomy that every future change must update perfectly.

## Current need before future flexibility

A hypothetical future may influence naming. It cannot alone justify a maintained branch, table, configuration, protocol, or extension seam.

## One caller stays local

One caller normally gets local code. Repetition triggers comparison, not automatic extraction.

## One canonical order

Selection, ordering, pagination, normalization, validation, conflict resolution, and lifecycle transitions each have one owner.

## Make invalid states difficult without inventing states

Use types to represent meaningful current distinctions. Do not create enums, phases, receipts, identities, and state carriers for implementation stages the product does not own.

## Real implementation before broad fakes

Tests and previews should reuse canonical repositories whenever practical. Test doubles may return configured data, record intent, delay, fail, or cancel one operation; they must not reproduce production normalization, ordering, persistence, or conflict rules.

## Tests protect expensive failures

Protect durable product, persistence, privacy, concurrency, lifecycle, retry, and external-system contracts. Do not create tests merely because production symbols changed.

## Performance and reliability are design

Latency, dropped input, stale state, flicker, and incorrect restoration are product defects, not implementation details.

## The losing path is deleted

A refactor is incomplete while obsolete code, tests, fixtures, preview stores, launch flags, docs, routes, or compatibility adapters remain without a real boundary.

## Product surface consumes complexity budget

Every tab, mode, sheet, setting, filter, route, gesture, chart, reminder, widget, notification, App Intent, and empty state creates design, implementation, accessibility, test, and maintenance obligations.

## No is a complete decision

When declining work, record the demonstrated condition that would justify reconsideration. “Not now” becomes a durable product decision rather than an indefinite backlog promise.

---

# Operating workflow

## Route 0: Direct localized work

Use direct work when all are true:

- the desired behavior is already clear;
- an existing owner is evident;
- no new persisted shape, external boundary, cross-module contract, or product decision is required;
- the change can be proven with a focused check or direct rendered interaction;
- no meaningful architecture alternative needs comparison.

Examples:

- correct a route spelling;
- map a persisted field already present;
- remove an unreachable branch;
- fix copy or accessibility text;
- delete a confirmed dead wrapper;
- change a local SwiftUI composition;
- add one regression for a demonstrated defect.

Workflow:

```text
trace current path → edit → inspect complete diff → simplify → focused proof
```

Do not invoke Architect, a plan document, multiple agents, or a mandatory fresh reviewer merely because the task changes code.

## Route 1: Material product or code change

Use Feature Development when behavior spans a meaningful flow, several owners, or nontrivial failure/interruption states.

### Frame

Capture five decisions before design:

1. **Moment:** who is doing what, where, and under what constraint?
2. **Outcome:** what becomes true shortly afterward?
3. **Non-goals:** what nearby behavior is explicitly excluded?
4. **Machinery budget:** which existing owner should be reused, where code may live, and what additions require stop-and-report?
5. **Done:** what observable result proves the feature?

When the user already supplied these in ordinary language, infer and state the frame. Ask only when an unresolved product choice would materially change the result.

### Ground

Trace what already exists before proposing a system:

- current entry point and real product path;
- canonical state and durable owner;
- analogous components and patterns;
- current proof surface;
- code that would become unnecessary.

End with the smallest likely implementation surface.

### Design

Use disposable artifacts to answer unresolved visual or interaction questions. Prototype one decision at a time. Keep prototypes outside production and delete them after the decision.

### Plan only when useful

A plan is warranted when sequencing, ownership, persistence, cross-target work, or rollback cannot fit clearly in the active context. A plan must include:

- accepted product contract;
- exact non-goals;
- existing owner;
- every new durable concept and why it is required;
- what is deleted or simplified;
- the “Do not add” list;
- one owning proof per durable invariant;
- stop-and-report conditions.

### Gate the plan

Use a fresh read-only reviewer. Report only concrete GAPS and EXCESS. The reviewer does not rewrite the plan or invent alternatives unless a finding requires a smaller shape.

### Implement

Build the accepted vertical behavior. If the implementation requires something on the Do-not-add list or repeatedly fights the chosen design, stop and report rather than adding escape hatches.

### Inspect the real product

Use rendered or runtime evidence for visible behavior. A build and unit tests do not prove hierarchy, motion, hit testing, keyboard, focus, Dynamic Type, VoiceOver, or interruption behavior.

### Simplify

After the behavior works, review only for subtraction:

- state that can be derived;
- one-caller wrappers;
- new abstractions without a current second responsibility;
- tests that mirror implementation;
- compatibility without a boundary;
- comments or docs that restate source;
- old paths made obsolete by the change.

### Prove and review

Run the smallest decisive checks once after the final relevant edit. Apply risk-proportional review.

## Route 2: Consequential boundary design

Use Architect only after the architecture admission gate below passes.

---

# Architecture admission gate

Before invoking or continuing Architect, answer:

1. **Current requirement:** Which current accepted behavior cannot be implemented cleanly through an existing owner?
2. **Existing owner:** Which owner was considered, and exactly why would absorbing the behavior break cohesion, atomicity, lifecycle, or dependency direction?
3. **Current callers:** Who calls the proposed boundary today?
4. **Exclusive invariant:** What nontrivial rule will this boundary own that no caller or sibling owns?
5. **Deletion:** Which competing owner, duplicated policy, call chain, state, or code disappears?
6. **Persistence and compatibility:** Does it create stored state, migration, wire format, route, setting, or compatibility obligation?
7. **Proof:** Which scenario proves the boundary rather than merely proving its implementation compiles?
8. **Deferral:** What materially breaks if the boundary is deferred for six months?

If the answers reveal a local correction, stay on the Direct route.

## Candidate method

### Candidate A: Existing-owner shape

Produce the best complete design using:

- existing persistence;
- existing repository and runtime owners;
- concrete types;
- local state;
- direct data flow;
- no new service, protocol, registry, coordinator, factory, cache, or compatibility path.

Candidate A may legitimately be “make the local correction” or “do not build this feature.”

### Candidate B: New boundary only when required

Produce a second shape only when Candidate A fails a consequential current requirement. Candidate B must state:

- the exact requirement Candidate A cannot meet;
- the new boundary and its exclusive invariant;
- every current caller;
- what it deletes;
- new lifecycle, migration, concurrency, and verification costs.

Do not require structurally different designs merely to satisfy a process rule.

## Selection

Prefer fewer maintained concepts and fewer layers crossed on the normal path. A deep interface is useful only when it hides **current necessary complexity**. The absence of a boundary is a valid architecture.

## Scrap signal

Redesign when several implementation deviations share the same underlying shape. Do not restart architecture for one difficult but legitimate edge case.

---

# Review and delegation tiers

## Direct tier

Typical work:

- local mapping, route, copy, query, condition, deletion, or fixture correction;
- no persistence or external contract change;
- one clear owner.

Required:

- implementer reviews the complete diff and surrounding path;
- focused static or behavioral check;
- independent reviewer only when the user or repository requires it.

## Material tier

Typical work:

- meaningful product behavior;
- repository query semantics;
- cross-file state flow;
- async cancellation or stale-result behavior;
- new reusable component with several current consumers.

Required:

- one fresh read-only reviewer;
- repair retained findings;
- focused proof of the real behavior.

## Boundary tier

Typical work:

- schema or migration;
- sync, privacy, destructive operation, external projection;
- public or cross-target contract;
- new long-lived runtime;
- concurrency/atomicity boundary.

Required:

- one fresh reviewer by default;
- independent lanes only when distinct execution paths justify them;
- explicit residual proof gaps.

## Delegation

Parallelize distinct read-only evidence lanes freely. Keep one owner for a shared interface and one implementer for conceptually coupled production work. Multiple workers are appropriate only when branches are independently reviewable and cannot create competing ownership.

---

# Prompt library

## Feature frame

```text
[Person and moment: who is doing what, where, and under what constraint.]

Outcome: [what becomes true shortly afterward].

Non-goals: [two or three likely sources of scope creep].

Reuse: start from [existing production owner/path]. If it cannot support this,
explain the concrete limitation before proposing a new boundary.

Machinery budget: keep work inside [scope]. No new [protocols, repositories,
stores, tables, routes, settings, caches, registries, coordinators] unless a
current requirement makes one unavoidable. Treat this as a stop-and-report
threshold, not a quota to game.

Done when: [the one rendered, runtime, or durable result I will personally
check].
```

## Read-only grounding

```text
Read-only. Before designing this change, trace what already exists that it must
build on: entry point, canonical state, durable owner, analogous UI, external
boundaries, and current proof.

For each relevant path, name the source anchor and say whether it serves as-is,
needs a local change, or genuinely cannot support the accepted behavior.

Do not propose new architecture. End with:
- the smallest complete implementation surface;
- the existing owner;
- code or behavior likely to become unnecessary;
- product decisions source cannot settle.
```

## Disposable visual or interaction prototype

```text
Build disposable variants only to answer this decision: [question].

Use fake or in-memory data and the smallest faithful surface. Do not touch
production persistence, routing, APIs, or shared architecture. Label the
variants and render or run the exact states that distinguish them.

The artifact will be deleted after the decision. Production implementation is a
separate step through current owners.
```

## Smallest complete plan

```text
Write the smallest complete implementation plan for the approved contract.
Assume one PR unless an independently releasable dependency, review boundary,
or rollback boundary makes that unsafe.

Include:
- accepted user-facing behavior and non-goals;
- existing owner and canonical data reused;
- every new durable concept, one sentence each: current problem, why the
  existing owner cannot absorb it, current callers, and what it deletes;
- a Do-not-add list;
- code, paths, tests, fixtures, and docs removed or simplified;
- one owning proof per durable invariant;
- stop-and-report conditions;
- observable definition of done.

Do not code yet.
```

## Plan gate

```text
Review this plan for GAPS and EXCESS against its accepted frame. Report only
concrete findings with: title, evidence, and why it matters.

EXCESS:
- every new type, file, protocol, table, route, setting, cache, task owner, or
  state carrier;
- an existing owner that could serve instead;
- anything built for previews, tests, diagnostics, compatibility without a
  concrete boundary, or an imagined future;
- a second owner for existing policy;
- state written but not read by a current decision;
- layer-by-layer PRs where one vertical PR is safer and smaller.

GAPS:
- anything that prevents the observable definition of done;
- a retained user job without an owner;
- a real failure, interruption, privacy, persistence, or external-system case
  that the accepted behavior requires;
- missing deletion of the losing path.

Do not rewrite the plan. No praise, style comments, or speculative concerns.
```

## Build with stop-and-report

```text
Implement the accepted plan through current owners.

If implementation requires something on the Do-not-add list, a compatibility
path without a named boundary, a second policy owner, or state that no current
decision reads, stop and report the requirement and evidence. Do not build a
workaround.

After the behavior works, inspect the full diff for subtraction without changing
the accepted contract. Delete obsolete paths, scaffolding, duplicate tests,
fixtures, and docs. Then run one risk-proportional proof pass.
```

## Final subtraction pass

```text
Review the completed diff only for subtraction. Do not redesign the system or
change accepted behavior.

Find:
- new state that can be derived;
- wrappers and abstractions with one current caller;
- protocols with one production conformer that do not protect a real boundary;
- tests that mirror implementation;
- compatibility without a released or external boundary;
- settings, routes, flags, callbacks, identities, or task owners not required;
- old code, fixtures, docs, and target membership made obsolete by the change.

For each deletion, name the invariant it appeared to serve and where that
invariant remains protected. Leave justified complexity alone.
```

## Architecture request

```text
A consequential boundary may be needed, but architecture is not the assumed
answer.

First run the architecture admission gate. Then produce Candidate A: the best
complete implementation using existing owners and no new durable concepts.

Produce Candidate B only when Candidate A cannot satisfy a consequential current
requirement. For Candidate B state current callers, exclusive invariant, code or
owner deleted, persistence/compatibility cost, and proof.

Prefer fewer maintained concepts and fewer normal-path layers. “Make the local
change” and “do not build this” are valid outcomes.
```

## Quality ambition with machinery boundary

```text
Quality bar: [name the exact felt interaction and useful reference]. Unlimited
ambition on clarity, responsiveness, accessibility, reliability, and feel.

Machinery boundary: [scope and additions requiring a checkpoint]. Do not broaden
navigation, persistence, state, or shared components merely to pursue the craft
bar. If the accepted feel genuinely requires new machinery, stop and explain
what, why, and what it replaces before building it.
```

---

# Subtraction audit library

All audits are read-only first. Every candidate must be verified against current source. Uncertain candidates are skipped or returned as hypotheses; they are not widened into implementation work.

## Whole-product cut

```text
Audit the current application as though we must reduce its maintained product
and code surface materially before MVP release. Visible product behavior may be
removed.

Review destinations, screens, sheets, modes, gestures, settings, reminders,
widgets, App Intents, notifications, analytics, persistence, sync, previews,
tests, and documentation.

For each top candidate state:
1. the user job it serves;
2. evidence the job is core, secondary, duplicated, or unproven;
3. what users actually lose;
4. whether a retained path already serves it;
5. every route, state, schema, test, fixture, and document that disappears;
6. likely complexity reduction;
7. confidence and required product decision.

Rank only the strongest candidates as delete now, needs one decision, or keep.
Do not propose replacement features or architecture.
```

## Visible product subtraction

```text
Review only visible product concepts that should disappear, merge, or become
secondary before MVP: destinations, toolbar actions, row actions, sheets, empty
states, confirmations, settings, filters, modes, charts, gestures, badges, status
explanations, and creation paths.

Judge each against the core user loop. Prefer one obvious action over choices,
natural behavior over explanatory copy, direct navigation over modes, one
excellent surface over parallel summaries, automatic defaults over settings,
and removal over polishing low-value states.

Return the simpler information architecture and complete hard-cut list. Do not
design implementation architecture until the product cuts are accepted.
```

## Navigation and presentation

```text
Trace every destination, route, sheet, cover, alert, popover, deep link,
notification destination, widget destination, App Intent destination, scene
restoration key, and launch argument.

Find duplicate jobs, redirect-only destinations, sibling sheets with competing
owners, routes preserving retired products, global coordination caused by
unnecessary presentation choices, and external entry points with no current
producer.

Recommend the smallest coherent navigation model and exact state, fixtures,
tests, and keys each cut removes. Do not add a navigation framework.
```

## Settings

```text
Treat every setting as a product-design failure until current evidence proves
that a person genuinely needs control.

For each setting determine the strong default, whether the choice must vary,
whether it belongs at the moment of use, whether behavior remains live, and
which UI, persistence, sync, test, preview, widget, notification, or App Intent
branches it creates.

Rank settings to delete, move to the owning interaction, or retain. Do not
replace removed settings with hidden configuration.
```

## Persistence

```text
Audit every table, column, stored JSON field, receipt, cache, UserDefaults key,
scene key, and sync record.

For each value name the current production decision that reads it, canonical
truth elsewhere, process-death requirement, derivation cost, data class
(user-authored truth, external identity, projection state, diagnostic, residue),
and backup/restore/sync/deletion/migration/test obligations.

Report values whose complete lifecycle can be deleted without losing a user
promise. Do not leave inert columns or compatibility readers.
```

## Protocols and abstractions

```text
Inventory production protocols, services, coordinators, managers, registries,
factories, strategies, adapters, policies, contexts, and repositories.

For each list production callers and conformers, exclusive invariant or external
boundary, pass-through methods, accepted inputs that do not affect behavior,
default implementations that create policy, and whether a concrete type or
local function would be clearer.

Apply the deletion test. One conformer is an audit signal, not automatic proof.
Rank delete, merge, make concrete, narrow, or retain. Do not invent replacement
layers.
```

## Async and state

```text
Audit Tasks, actors, generations, UUID identities, cancellation handlers,
refresh flags, loading phases, retry counters, stale-result fences, queues,
continuations, and state enums.

Find multiple freshness mechanisms protecting one read, request identities with
dimensions that do not affect output, unreachable loading states, phases for
implementation stages rather than product states, sequential work that could be
one transaction, state derivable from canonical records, and retry flows where
repeating the operation is sufficient.

Recommend the smallest state model that preserves real interruption and
concurrency behavior. Include states and tests to delete.
```

## Caches and projections

```text
Audit every cache, materialized read, derived index, snapshot, projection,
watermark, dirty table, coverage receipt, and maintenance loop.

For each name canonical source, current latency or external constraint,
invalidation owner, repair/rebuild path, behavior if deleted, whether a direct
bounded read is sufficient, whether another projection contains the facts, and
whether stored metadata governs behavior.

Identify projections to remove, combine, rebuild on demand, or keep private to
one repository. Do not propose a generic cache architecture.
```

## Tests, previews, and fakes

```text
Audit tests and previews for product value rather than coverage volume. Classify
coherent groups KEEP, MOVE, CONSOLIDATE, or DELETE.

Delete candidates include implementation-detail assertions, call-count and
forwarding tests, exact copy/layout/motion/haptic checks without an external
contract, duplicate invariants across layers, retired behavior, broad fake
repositories implementing production policy, obsolete launch flags and
fixtures, and one test file per production type.

For retained tests, name the expensive failure, one owning layer, and why the
compiler, preview, static check, or manual Apple proof is insufficient. Prefer
real repositories over ephemeral storage and narrow failure/delay decorators.
```

## Compatibility

```text
Search compatibility, legacy, deprecated, fallback, alias, old, previous,
versioned, migration, decoder, coercion, and dual-read/write paths.

For each identify the exact released user data, public API, wire format, shared
on-disk state, or independently deployed client that requires it. If no concrete
boundary exists, recommend a full hard cut across producers, consumers,
migrations, fixtures, tests, docs, keys, and generated artifacts.

Developer, preview, Simulator, branch, and unshipped internal state do not by
themselves justify compatibility.
```

## Design system

```text
Audit public tokens, components, styles, variants, modifiers, environment values,
and presentation helpers.

Find one-use shared components, variants with no production caller, wrappers
that rename native behavior, tokens for retired surfaces, parameters callers
never vary, APIs exposing choices the product no longer permits, duplicate
visual systems, and generic components that make iteration harder than local
composition.

Prefer native platform behavior and feature-local composition. Retain shared
components only when current stable consumers need the same behavior and
accessibility contract.
```

## Documentation and workflow

```text
Audit repository instructions, skills, plans, ADRs, templates, checklists,
validators, scripts, reports, and generated artifacts.

For each identify its current caller, decision or failure it changes,
authoritative source elsewhere, automatic load cost, execution and maintenance
cost, duplicate workflow, and whether completion measures product progress or
process completion.

Delete or merge artifacts that create ceremony without changing decisions,
implementation quality, or proof. Pay special attention to automatic routers,
mandatory agent counts, exhaustive matrices, fixed report sections, and
verification that cannot currently be executed.
```

## External integrations

```text
Audit HealthKit, CloudKit, notifications, widgets, Live Activities, App Intents,
backup, restore, and file access.

For each enumerate the exact MVP user promise, canonical local truth, external
projection state, retries/recovery, diagnostics, settings, background tasks,
persisted receipts, tests, and manual proof.

Find machinery that merely describes or diagnoses the integration but does not
affect delivery, correctness, privacy, or recovery. Preserve real identity,
revision, authorization, convergence, and external-boundary requirements.
```

## Monthly mechanical sweep

```text
Read-only first. Find confirmed dead or single-use surface: unused symbols,
projections without consumers, seams without callers, unreachable branches,
inputs that do not affect behavior, public types used only in their defining
file, no-op configuration, and tests or fixtures owning retired behavior.

Verify every candidate by full-scope search. Uncertain means skip and record.
Implement one mechanical deletion PR only for confirmed candidates. No
replacement abstractions and no new tests. Production lines, public symbols,
and maintained test surface should all be materially net-negative.
```
