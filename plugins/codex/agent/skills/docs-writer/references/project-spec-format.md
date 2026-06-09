# Project Spec Format

Use a project spec when a team needs a durable, language-agnostic contract for a system, service, workflow, or application. A spec should define required behavior, boundaries, domain entities, lifecycle, state, interfaces, recovery, observability, safety posture, and acceptance signals. It is more normative than a PRD and broader than an implementation plan.

## Use a Project Spec When

- Multiple implementations or contributors must agree on the same behavior.
- The project has lifecycle, state machine, adapter, safety, or recovery semantics.
- The artifact should describe what the system MUST do independent of language or framework.
- The reader needs enough detail to implement or review the system without hidden context.

## Do Not Use a Project Spec When

- The main question is product scope or user value. Use a PRD.
- The main question is the step-by-step implementation path. Use a Plan.
- The system is simple enough for a README or architecture note.

## Required Shape

Use [assets/PROJECT_SPEC_template.md](../assets/PROJECT_SPEC_template.md) as the seed shape. It includes:

- purpose
- normative language
- problem statement
- goals and non-goals
- system overview
- core domain model
- configuration and runtime state
- functional requirements
- lifecycle and flows
- state machine
- interfaces and adapter contracts
- workspace, filesystem, or persistence contracts
- observability
- safety, trust, and permissions
- recovery, retry, and reconciliation
- testing and validation
- implementation-defined behavior
- open questions and change log

## Writing Rules

- Use `MUST`, `SHOULD`, and `MAY` only when the requirement level matters.
- Label implementation-defined behavior explicitly and require implementations to document their choice.
- Define domain entities with fields, types, nullability, normalization, and examples where useful.
- State non-goals so the spec does not silently expand into adjacent systems.
- Include operator-visible and test-visible acceptance signals.
- Keep product motivation in the problem statement; keep implementation sequencing out of the spec.
