---
name: architect
description: "Design a consequential new or changed code boundary before implementation when current requirements force decisions about ownership, lifecycle, contracts, atomicity, or state. Use for 'architect this,' new APIs or module boundaries, and changes whose types, ownership, or state model must be settled first."
license: MIT
---

# Architect

Start with the best design that uses existing owners. Add a durable boundary only
when that design cannot satisfy a current consequential requirement.

Sketch the caller's usage, types, function signatures, class shapes, and module
boundaries before implementing them. Select one design, then implement against
it when authorized. If implementation repeatedly exposes a flaw in the design,
discard it and redesign.

Work through five phases:

1. Ground
2. Sketch
3. Decide
4. Implement
5. Scrap

## Phase A: Ground the problem

Build a real mental model of every system the new code touches. Apply `$how`
to the relevant subsystems, using its critique mode when the existing structure
is the constraint or the design must push back on it.

Naming a file is not grounding. Produce the traced model `$how` prescribes. If
the design redefines ownership or layering, also apply `$why` to the existing
shape so its rationale becomes a constraint, not a guess.

Skip this phase only when the work is genuinely greenfield with no surrounding
system to integrate.

## Phase B: Sketch

Before sketching a new boundary, establish:

- the current requirement that forces an ownership, lifecycle, contract,
  atomicity, or state decision;
- why the closest existing owner cannot absorb the responsibility;
- the exclusive invariant the boundary would own and its current callers; and
- its durable costs and the scenario that would prove it works.

If this points to a local correction, make or recommend that correction instead.
No new boundary is a valid design.

Read [the runner prompt](references/runner-prompt.md) and
[rationale template](references/rationale-template.md).

Start with Candidate A: the best complete design using existing owners and no
new durable boundary. Write the caller's usage first, then derive its type
sketch, function signatures, module map, and rationale.

Produce Candidate B only when Candidate A cannot satisfy a current consequential
requirement. State the requirement Candidate B satisfies, the boundary and
exclusive invariant it introduces, its callers, what existing code or ownership
it removes, and its lifecycle, migration, concurrency, and verification costs.

When an independent candidate would materially improve the decision, give a
fresh read-only `architect` agent the task, Phase A grounding, and
[runner prompt](references/runner-prompt.md). Do not create another candidate
only to satisfy the process.

Screen every candidate against
[design red flags](references/design-red-flags.md). Reject or revise shallow
modules, information leakage, temporal decomposition, and pass-through
methods.

Compare viable candidates on interface depth. Prefer an interface that hides
necessary complexity without adding a new owner merely to make callers smaller.

## Phase C: Decide and continue

Select one design. When Candidate B exists, record why the selected design won,
what was adapted, and what was rejected.

When the request authorizes implementation, continue with the selected design
without another approval pause. For a design-only request, return the design
package and stop before editing product source.

When Feature Development invokes Architect during its design step, return the
selected design after this phase. Feature Development resumes with
implementation and owns proof, review, and completion. A direct Architect
request may continue through the remaining phases when implementation is
authorized.

Pause only when the user requested a checkpoint or an unresolved product,
scope, compatibility, or costly implementation choice would materially change
the result and cannot be settled from the repository or a focused probe.
Complete all other design work first, then present the exact choice, the
recommended default, and its consequence. If the user pushes back on the shape,
treat that as Phase A evidence, re-ground, and re-run Phase B before writing
more code.

Before implementation, use a fresh adversary when the design changes a durable
external contract, migration, shared state, irreversible operation, or has been
explicitly challenged. Resolve material risks in the design rather than
deferring them to code review.

## Phase D: Implement against the sketch

Replace `not implemented` bodies with code and pseudocode with logic. The
selected sketch is the contract.

Treat deviations as signals, not friction to absorb silently. If a function
needs a parameter the sketch did not anticipate, determine whether the sketch
was wrong, the requirement was missed, or the implementation is overreaching.
Surface the answer instead of bolting the exception on.

Use the repository's own verification skills and commands while filling in the
design. Architect does not replace repository-specific proof or final
`$code-quality-review`.

## Phase E: Scrap when the architecture is wrong

If implementation keeps producing friction the sketch cannot absorb, throw the
sketch out. Do not bolt fixes onto a wrong design.

The signal is a pattern, not one hard case:

- The same workaround appears across unrelated code.
- Several edge cases need the same kind of special branch.
- Types need escape hatches such as `any`, casts, or optional fields that are
  always present in practice.
- Shared-state coordination appears where the sketch said state was isolated.
- Callers must know the abstraction's internal rules to use it.
- Two or more implementation deviations have the same underlying shape.

Use judgment. Some problems are legitimately complex; complexity in the data
is not automatically complexity in the design. Repeated friction of the same
shape is the redesign signal.

When scrapping a design:

1. Re-run `$how` over what was built so implementation lessons become inputs.
2. Redesign as if the new constraints had been assumptions from the start.
3. Remove obsolete structure before adding to the replacement.
4. Return to Phase B. Start with the best design using existing owners and add
   another candidate only when it cannot satisfy the revised requirement.

## Output

Write the caller's usage first and derive the type sketch from it. Use one file
with new types and signatures for a small change; use a module map plus type
definitions for larger work. Shape the rationale with
[the template](references/rationale-template.md), including the usage sketch
and decision.

Return the design package in chat by default. Create or commit a durable design
artifact only when the user asks or the repository requires one.
