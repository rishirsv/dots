---
name: architect
description: "Design a new or changed code boundary before implementation when important requirements require decisions about ownership, lifecycle, contracts, atomicity, or state. Use for 'architect this,' new APIs or module boundaries, and changes whose types, ownership, or state model must be settled first."
---

# Architect

Start with the best design that uses the modules already responsible for this
work. Add a lasting code boundary only when those modules cannot satisfy an
important current requirement.

Before implementation, sketch how callers will use the code. Include its types,
function signatures, classes, and module boundaries. Select one design, then
implement against it. If implementation repeatedly exposes a flaw in the design,
discard it and redesign.

Work through five phases:

1. Understand
2. Sketch
3. Agree
4. Implement
5. Scrap

## Phase A: Understand the problem

Understand every system that the new code affects. Trace its relevant callers,
state, invariants, and connections to other systems. Identify what each
component does; a list of files does not establish this understanding. Use
`$how` when the existing runtime path is non-obvious or a source-traced
explanation would materially reduce design risk. Use `$why` when historical
rationale could constrain the proposed ownership or layering; do not infer that
need merely because the design changes either one.

Skip this phase only when the work is genuinely new and has no existing system
to connect to.

## Phase B: Sketch

Before sketching a new boundary, establish:

- the current requirement that requires a decision about ownership, lifecycle,
  contracts, atomicity, or state;
- why the existing module most suited to the work cannot take responsibility;
- the rule that only the new boundary would enforce and its current callers; and
- the costs of maintaining the boundary and a scenario that would prove it
  works.

If this points to a local correction, make or recommend that correction instead.
A valid design can use only existing modules.

Read [the runner prompt](references/runner-prompt.md) and
[rationale template](references/rationale-template.md).

Start with Candidate A: the best complete design using existing owners and no
new durable boundary. Write the caller's usage first, then derive its type
sketch, function signatures, module map, and rationale.

Produce Candidate B only when Candidate A cannot satisfy an important current
requirement. State the requirement Candidate B satisfies, the boundary and rule
that only it will enforce, its callers, what existing code or ownership it
removes, and its lifecycle, migration, concurrency, and verification costs.

When an independent candidate would materially improve the decision, give a
fresh read-only `architect` agent the task, findings from Phase A, and [runner
prompt](references/runner-prompt.md). Do not create another candidate only to
satisfy the process. The runner loads its candidate references only; keep this
coordinator workflow in the parent. Use `consultant` instead when only a focused
decision or implementation plan needs a second opinion.

Screen every candidate against [`references/design-red-flags.md`](references/design-red-flags.md) before synthesis. Assume the next contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles. Prefer the design where a change that looks right from one file is right for the whole repo.

Compare viable candidates by how much complexity each interface handles for its
callers. Prefer an interface that handles necessary complexity. Do not add a
responsible module merely to make callers smaller.

Select one design. When Candidate B exists, record why the selected design won,
what was adapted, and what was rejected.

## Phase C: Agree

When the request authorizes implementation, proceed with the selected design.
For a design-only request, return the design package and stop before
editing product source.

When [Feature Development](../../references/feature-development.md) invokes
Architect during its design step, return the
selected design after this phase. Feature Development resumes with
implementation and owns proof, review, and completion. A direct Architect
request may continue through the remaining phases when implementation is
authorized.

Pause for approval when the user asks for a checkpoint or when an unresolved
product, scope, compatibility, or costly implementation choice would materially
change the result. If the user challenges the design, use their feedback to
revise your understanding in Phase A. Repeat Phase B before writing more code.

Before implementation, use a fresh adversary when the design changes a durable
external contract, migration, shared state, irreversible operation, or has been
explicitly challenged. Resolve material risks in the design rather than
deferring them to code review.

## Phase D: Implement against the sketch

Replace `not implemented` bodies with code and pseudocode with logic. The
selected sketch is the contract.

If implementation requires a change to the sketch, identify the cause. For
example, if a function needs an unplanned parameter, determine whether the
design is wrong, a requirement is missing, or the implementation exceeds the
requirements. Report the cause before adding the parameter.

Use the repository's own verification skills and commands while filling in the
design. Architect does not replace repository-specific proof or final
`$change-review`.

## Phase E: Scrap when the architecture is wrong

If implementation repeatedly needs changes that the sketch cannot support,
discard the sketch and redesign. Look for a repeated problem rather than one
difficult case:

- The same workaround appears across unrelated code.
- Several edge cases need the same kind of special branch.
- Types need escape hatches such as `any`, casts, or optional fields that are
  always present in practice.
- Shared-state coordination appears where the sketch said state was isolated.
- Callers must know the abstraction's internal rules to use it.
- Two or more departures from the sketch have the same cause.

Use judgment. Some problems are legitimately complex; complexity in the data is
not automatically complexity in the design. Redesign when the same kind of
problem repeatedly requires changes to the sketch.

When scrapping a design:

1. Re-trace the affected callers, state, and invariants and use what
   implementation revealed to revise the design. Use `$how` when a source-traced
   explanation would materially reduce uncertainty before redesigning.
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
