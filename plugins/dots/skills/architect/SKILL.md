---
name: architect
description: "Design consequential code boundaries before implementation by grounding the current system, comparing independent architecture sketches, and keeping implementation aligned with the chosen shape. Use for 'architect this,' new APIs or module boundaries, and changes whose types, ownership, or state model must be settled first."
license: MIT
---

# Architect

Design before implementing. Sketch types, function signatures, class shapes,
and module boundaries with `not implemented` bodies and pseudocode. Synthesize
across independent perspectives, then fill in code against the chosen sketch.
If implementation proves the sketch wrong, throw it out and redesign.

Work through five phases:

1. Ground
2. Sketch
3. Agree
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

Read [the runner prompt](references/runner-prompt.md) and
[rationale template](references/rationale-template.md). Run at least two fresh,
read-only candidate agents in parallel, using the configured `architect` role
when available. Give each the task, Phase A grounding, and the runner prompt.
Candidate agents do not delegate. If fresh agents are unavailable, produce two
independent candidates sequentially before comparing them.

Design it twice. Require structurally distinct candidates even when the first
looks sufficient. Explore whole shapes, not point fixes inside one shape. Each
candidate writes the caller's usage first, then derives its type sketch,
function signatures, module map, and rationale.

Screen every candidate against
[design red flags](references/design-red-flags.md). Reject or revise shallow
modules, information leakage, temporal decomposition, and pass-through
methods.

Compare viable candidates on interface depth. Prefer the design that hides more
complexity behind a smaller, simpler public surface. A rich interface can keep
call chains short by concentrating capability instead of scattering it across
layers.

Synthesize one design package. Record which candidate became the base, why it
won, what was adapted from the others, and what was rejected.

## Phase C: Agree

When the request authorizes implementation, proceed with the synthesized
design. For a design-only request, return the design package and stop before
editing product source.

When Feature Development invokes Architect during its design step, return the
synthesized design after this phase. Feature Development resumes with
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
synthesized sketch is the contract.

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
4. Return to Phase B and compare fresh candidates.

## Output

Write the caller's usage first and derive the type sketch from it. Use one file
with new types and signatures for a small change; use a module map plus type
definitions for larger work. Shape the rationale with
[the template](references/rationale-template.md), including the usage sketch
and synthesis decision.

Return the design package in chat by default. Create or commit a durable design
artifact only when the user asks or the repository requires one.
