---
name: architect
description: "Settle a consequential code-boundary decision when a current lifecycle, external contract, atomicity concern, or demonstrated duplicate ownership makes a local implementation insufficient or uncertain."
license: MIT
---

# Boundary Design

Settle a consequential boundary decision only when current requirements make
ownership or contract design necessary before implementation. Test the best
existing-owner shape before adding a boundary. Sketch types, function
signatures, class shapes, and module boundaries with `not implemented` bodies
and pseudocode, then fill in code against the selected shape. If implementation
proves the shape wrong, throw it out and redesign.

Work through these phases:

0. Admit the architecture work
A. Ground the problem
B. Design
C. Agree
D. Implement against the sketch
E. Scrap when the architecture is wrong

## Phase 0: Admit the architecture work

Before designing a boundary, answer these questions from current source and
requirements:

1. Which current accepted behavior creates a consequential ownership,
   lifecycle, contract, atomicity, or dependency decision that should be
   settled before implementation?
2. Which existing owner is closest, and what would it need to absorb?
3. Who calls the proposed boundary today?
4. What nontrivial rule would a new boundary own that no caller or sibling owns?
5. Which competing owner, duplicated policy, call chain, state, or code could
   it remove?
6. Will it create stored state, a migration, wire format, route, setting, or
   compatibility obligation?
7. Which scenario proves the boundary rather than merely proving that its
   implementation compiles?
8. What materially breaks if the boundary is deferred for six months?

If the answers reveal a local correction, make or recommend that correction
instead. A direct local correction and a decision not to build are valid
outputs.

## Phase A: Ground the problem

Build a real mental model of every system the new code touches. Apply `$how`
to the relevant subsystems, using its critique mode when the existing structure
is the constraint or the design must push back on it.

Naming a file is not grounding. Produce the traced model `$how` prescribes. If
the design redefines ownership or layering, also apply `$why` to the existing
shape so its rationale becomes a constraint, not a guess.

Skip this phase only when the work is genuinely greenfield with no surrounding
system to integrate.

## Phase B: Design

Read [the rationale template](references/rationale-template.md). Start with
Candidate A: the best complete shape using existing owners and no new durable
boundary. A module is not an improvement merely because it makes simple callers
look smaller. The absence of a new boundary is a valid selected design.

Produce Candidate B only when Candidate A cannot satisfy a consequential
current requirement. State the exact requirement, the new boundary and its
exclusive invariant, every current caller, what it deletes, and its lifecycle,
migration, concurrency, and verification costs. When an independent candidate
would improve this decision, give a fresh read-only `architect` agent the task,
grounding, and [runner prompt](references/runner-prompt.md). Do not manufacture
structural difference for process compliance.

Write the caller's usage first, then derive each candidate's type sketch,
function signatures, module map, and rationale.

Screen every candidate against
[design red flags](references/design-red-flags.md). Reject or revise shallow
modules, information leakage, temporal decomposition, and pass-through
methods.

Compare viable candidates on interface depth. Prefer an interface that hides
current necessary complexity. Do not create a module merely to make simple
callers look smaller. A rich interface can keep call chains short by
concentrating capability instead of scattering it across layers.

Select one design package. When Candidate B exists, record which candidate
became the base, why it won, what was adapted, and what was rejected.

## Phase C: Agree

When the request authorizes implementation, proceed with the selected
design. For a design-only request, return the design package and stop before
editing product source.

When Feature Development invokes Architect during its design step, return the
selected design after this phase. Feature Development resumes with
implementation and owns proof, review, and completion. A direct Architect
request may continue through the remaining phases when implementation is
authorized.

Pause for approval when the user asks for a checkpoint or when an unresolved
product, scope, compatibility, or costly implementation choice would materially
change the result. If the user pushes back on the shape, treat that as Phase A
evidence, re-ground, and re-run Phase B before writing more code.

For a consequential or explicitly challenged design, have a fresh adversary
review the selected package before implementation. Resolve material risks in
the design rather than deferring them to code review.

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
4. Return to Phase B and produce a new Candidate A. Add Candidate B only when
   the revised Candidate A cannot satisfy a consequential current requirement.

## Output

Write the caller's usage first and derive the type sketch from it. Use one file
with new types and signatures for a small change; use a module map plus type
definitions for larger work. Shape the rationale with
[the template](references/rationale-template.md), including the usage sketch
and selection decision.

Return the design package in chat by default. Create or commit a durable design
artifact only when the user asks or the repository requires one.
