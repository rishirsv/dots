# Develop a feature

Use this workflow to take a new feature from an initial request to a reviewed
and verified implementation. The phases preserve a useful order, but their
depth should follow the feature. A bounded change may move through several
phases in one pass. A fuzzy or risky feature may need a visible decision point,
focused workflow, or independent investigation.

## Keep one working record

Carry a compact record through the work so later phases do not reopen settled
questions or lose the evidence behind a decision. Keep it in the active task or
plan unless the user asks for a durable artifact. Record:

- the intended outcome and explicit non-goals;
- who experiences the change, what becomes different for them, and which
  existing behavior must not change;
- constraints, accepted references, assumptions, and user decisions;
- analogous patterns, responsible components, and decisive primary files;
- the selected implementation direction; and
- the proof required and its current status.

Update the record when repository evidence changes an assumption. Surface the
change before continuing when it would alter something the user already chose.

## Use focused Dots workflows at the right seam

Feature Development owns the lifecycle. Load and apply a focused skill when a
phase needs its full method; after that phase reaches its finish condition,
resume this workflow with its result.

- Use `$scout` when the user explicitly wants to shape a fuzzy product idea or
  compare product directions before committing to implementation. Resume when
  the user asks to build from the Scout Snapshot.
- Use `$clarify` when the user explicitly asks for a dedicated requirements
  clarification pass. Otherwise ask the minimum questions needed to avoid
  wrong work inside Discovery and Clarifying Questions below.
- Use `$plan` when the user asks for an implementation-ready plan before code.
  A feature request that already authorizes implementation does not require a
  separate planning deliverable; form the smallest useful implementation
  direction in the working record.
- Use `$orchestrate` when the user requests subagents or when distinct,
  independent work materially improves speed or breadth. Let actual evidence
  gaps and implementation boundaries determine the team, not a fixed count.
- Use `$design` for visible product UI. Preserve feature decisions and let
  Design own the surface direction, implementation, states, and visual proof.
- Use `$html` for a throwaway browser-openable product mock when seeing a
  concrete interaction or layout would settle a real product decision more
  cheaply than discussing it. Keep the mock outside product source and do not
  mistake it for the implemented feature.
- Use `$review-change` after implementation. Its Post-change outcome owns
  independent review, repair of retained in-scope findings, focused validation,
  and final diff inspection. Use Low, Deep, or Challenge only when the user
  asks or the selected workflow requires it.
- Use `$architecture-review` only when the user asks for an architecture-primary
  critique. Architecture design for the feature remains part of this workflow.
- Use `$pr` only when the user asks to publish the finished work as a pull
  request.

## Phase 1: Discovery

**Goal:** Understand what needs to be built and what authority the request
already provides.

1. Extract the desired outcome, constraints, accepted references, non-goals,
   and decisions the user already supplied.
2. Read the applicable repository instructions and locate the current product
   or system path before asking questions the code can answer.
3. If the feature is still unclear, ask about the problem it should solve, the
   behavior that defines success, and any constraint that would materially
   change the work. Ask only what is needed now.
4. Name the existing behavior that must remain true and the proof that would
   distinguish a finished feature from a plausible-looking change.
5. Summarize the intended outcome when a correction would change the feature.
   Do not require confirmation when the user already gave a clear build request
   and no consequential choice remains open.

Discovery is complete when the working record states a bounded outcome and the
repository area to investigate.

## Phase 2: Codebase Exploration

**Goal:** Understand the relevant code and patterns at both high and low
levels.

Inspect directly for a bounded feature. For a wider feature, use the smallest
sufficient read-only investigation team. Separate assignments by a real area
such as an analogous feature, user experience, service boundary, data model, or
migration risk.

The investigation should establish:

- entry points, extension points, and feature boundaries;
- the runtime and data flow from trigger to visible result or stored state;
- responsible components, mutation owners, dependencies, and side effects;
- existing conventions, analogous features, and architectural constraints;
- error, recovery, security, performance, compatibility, and rollout concerns
  that actually apply;
- relevant tests and verification surfaces; and
- the small set of primary files needed to decide and implement the feature.

Ask investigators for source paths, behavior, uncertainty, and conflicts rather
than a proposed plan. Before making a consequential implementation decision,
inspect the primary files that establish the behavior, ownership boundaries,
and integration constraints. Do not rely only on an investigator's summary.

Exploration is complete when the current flow, existing extension seams, and
decisive sources are understood well enough to identify the remaining product
and engineering decisions. Present a separate exploration report only when it
helps the user make one of those decisions.

## Phase 3: Clarifying Questions

**Goal:** Fill the gaps that could lead to wrong work before choosing the
implementation direction.

Review the feature request against the codebase findings. Look for unresolved
behavior, reachable states, integration points, scope boundaries,
compatibility, migration, rollout, and meaningful performance or security
needs. Do not turn every imaginable edge case into a user question.

When an unresolved question is observable, such as runtime behavior, timing,
layout, output, or whether an existing seam supports the feature, answer it
with a focused probe or throwaway prototype when that is cheaper and safer than
asking the user to speculate. Reserve questions for product choices,
preferences, authority, and information the repository or a small experiment
cannot establish.

Ask the minimum set of clarifying questions needed to avoid wrong work. Prefer
one to three questions that remove the largest branches of possible work, and
answer repository-owned questions from the source. Pause only when the answer
would materially change product behavior, ownership, migration, risk, or the
authorized scope.

If the user says to use your judgment, make a recommendation, state the
assumptions that affect the result, and continue. Do not ask for another
confirmation of the authority they just gave.

Clarification is complete when every blocking ambiguity is answered, explicitly
deferred, or covered by an assumption the user authorized.

## Phase 4: Architecture Design

**Goal:** Select an implementation that fits the existing system and the size
of the feature.

Analyze the patterns, conventions, module boundaries, and analogous features
found during exploration. Choose one approach and make it concrete enough to
implement. Prefer the smallest coherent change that preserves clear ownership,
testability, and the repository's architecture.

Start from the experience of the person or code that consumes the feature.
Sketch that usage and choose the data shape, state model, or organizing
structure before writing the logic around it. Use a state machine, typed model,
table, registry, reducer, or new module boundary only when it removes invalid
states, scattered branching, duplicated rules, or lifecycle risk. Boring local
code is better when the current shape is already clear.

Cover the parts that matter to this feature:

- component responsibilities, interfaces, and integration points;
- concrete files or symbols when naming them removes ambiguity;
- data flow, state changes, storage, and external handoffs;
- build sequence and safe vertical slices;
- error handling, recovery, tests, rollout, and rollback; and
- security, privacy, and performance where the feature changes them.

Present alternatives only when two or more approaches would produce materially
different product behavior, ownership, migration, risk, or long-term cost.
Explain the strongest benefit and main cost of each, recommend one, and ask the
user only when the choice belongs to them. Do not manufacture "minimal, clean,
and pragmatic" options when repository evidence supports one direction.

Do not require a separate implementation approval when the original request
already authorized building the feature. Ask before implementation only when
the selected direction introduces a consequential choice or scope expansion
the user has not approved.

Architecture Design is complete when one direction is selected, its important
seams and proof are recorded, and implementation does not have to guess a
product or engineering decision.

Treat repeated implementation friction as evidence that the design may be
wrong. If several callers need the same workaround, types need escape hatches,
or unrelated edge cases produce the same special-case branch, stop adding
patches. Reinspect what the implementation revealed and redesign as if those
constraints had been known from the start. A single difficult case does not by
itself justify restarting the design.

## Phase 5: Implementation

**Goal:** Build the complete authorized feature.

1. Track the work at a level proportionate to its size and keep the working
   record current.
2. Implement the selected direction using repository conventions and the
   existing owning seams.
3. Apply focused workflows for visible design or independent implementation
   lanes when their routing conditions above are met.
4. Cover the requested behavior and relevant reachable states. Keep unrelated
   refactors and speculative abstractions out of the change.
5. For multi-step work, end each useful unit in a checkable state and verify it
   before building the next unit on top. Do not defer all evidence to the end.
6. Run the repository validation needed to prove the integrated feature. When
   the product has a runnable surface, exercise the actual feature path from
   input to visible result or stored value. A build or unit test alone does not
   prove that integration path.

Implementation is complete when the requested behavior works through its real
path and the validation evidence is ready for independent review.

## Phase 6: Quality Review

**Goal:** Ensure the completed change is functionally correct, simple,
maintainable, and integrated with the surrounding system.

Load and apply `$review-change` in Post-change outcome against the complete
change. Give it the feature's intended outcome, settled decisions, repository
rules, implementation direction, and proof. The main agent addresses every
retained finding within the original task and reruns focused validation.

Ask the user only when a repair requires new authority or materially expands
the feature. Do not ask whether to fix an in-scope defect the workflow has
already established should be fixed.

Quality Review is complete when the complete change has been inspected,
retained in-scope findings are repaired, focused validation passes, and the
main agent has inspected the final diff.

## Phase 7: Summary

**Goal:** Return the implemented result and trustworthy proof.

Summarize:

- what was built and what changes for the user or system;
- the key decisions and intentional exclusions;
- the important files, components, or surfaces changed when useful;
- validation and review performed; and
- remaining risks, unresolved authority boundaries, or material next steps.

Do not turn the summary into a process diary. Feature Development is complete
when the requested feature is implemented, its relevant states are accounted
for, validation supports the result, Post-change review is complete, and every
remaining gap is stated honestly.
