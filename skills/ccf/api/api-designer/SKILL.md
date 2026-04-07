---
name: api-designer
description: Produce a development-ready design for one scoped API task without implementing code. Use when Codex must define a single endpoint or API service change, including contract shape, business logic sequence, dependencies, auth expectations, and error behavior, so an implementor can build it directly.
---

# API Designer

## Purpose

Help Codex complete API design work end-to-end by:

- producing one implementation-ready API task artifact from an already scoped API request
- defining endpoint behavior, contract shape, and business logic without turning the result into a patch plan
- relying on `../api-common/SKILL.md` for shared API rules instead of repeating them here

## When to use this skill:

- The user wants an API task artifact or backend design for a scoped API change without code changes.
- The work needs one concrete endpoint-level design that implementors can build from directly.
- Another planning step already identified the task as API work and now needs technical enrichment.

### Do NOT use this skill if:

- The user wants backend code changes rather than a design artifact.
- The task still spans multiple independently deliverable API outputs and must be split first.
- The work is primarily DB schema design, frontend behavior, or cross-cutting architecture planning.

## Inputs

- A scoped API task with task id/title when available.
- Task intent, flows, acceptance criteria, dependencies, and permission expectations.
- Affected endpoints, shared types, repositories, services, and integrations when known.

## Output Format

Emit exactly one API task artifact using the exact section order from `references/design-output-template.md`.

The artifact must:

- start with `# Task <task_id> <task_title>` when the id is known, otherwise `# Task <task_title>`
- include the fixed header labels in this order: `Task type`, `Intent`, `Dependencies`, `Reuse opportunities`
- keep `## API definition and business logic` implementation-ready
- keep `## Additional notes` limited to relevant implementation notes, assumptions, and open questions

Do not emit a design memo, TODO tracker, test plan, or file-by-file patch list.

## Workflow

1. Read `../api-common/SKILL.md` and apply its shared API rules, references, and task classification requirements.
2. Confirm the provided task scope, dependencies, flows, acceptance criteria, and intended API boundary.
3. Reconcile the requested request/response fields against existing shared schema concepts before introducing anything new.
   - When the API output is consumed by another planned surface, integration, workflow step, or downstream task, derive the minimum request semantics and produced outputs from the scoped feature and task artifacts and state them explicitly.
4. Trace the feature flow into one ordered business logic sequence covering:
   - input normalization
   - dependency calls
   - decision points and branching rules
   - response construction
5. Define the task-specific error contract, including functional, application, and DB-facing error codes the UI may observe.
6. When the endpoint depends on pre-provisioned external resources, required seed data, environment variables, or App Configuration keys in the chosen implementation path, record that dependency explicitly and point to `docs/deploy_plan.md` instead of designing runtime provisioning steps.
   - In `Builder` mode, prefer a locally runnable and testable integration path when the task does not already force the external dependency.
   - If the task introduces or changes `getEnvVariable*`, `getValue*`, or `getVersionValue*` usage, call out the exact `Seed` entries that must be added or updated, including the key name, purpose, requiredness, default value when the code provides one, expected format or allowed values when relevant, who supplies it, and branch override semantics when `getVersionValue*` applies.
7. Evaluate quality areas from `references/api-quality-checklists.md`, but emit only the notes the scoped task actually needs.
8. Produce the final artifact from `references/design-output-template.md` without prescribing file-level implementation steps.

## Guardrails

- Keep the design to one primary API output.
- Make the business logic sequence complete enough that implementation does not require reinterpretation.
- Do not use vague contract language such as `supports search`, `supports filters`, `summary response`, or `handles workflow` when the scoped task already implies specific inputs, outputs, rule semantics, or observable behavior.
- If downstream consumers depend on particular output fields, event shapes, permissions, validation rules, transition rules, or query behavior, name that minimum producer contract explicitly in the design artifact.
- Keep persistence notes at the dependency and behavior level unless the task explicitly requires dedicated DB design.
- Reference shared API rules through the artifact decisions instead of restating them.
- Do not design request-time or startup-time resource provisioning or seed creation as part of API behavior.
- In `Builder` mode, do not force Azure-specific wrappers or deployment-owned services into the task artifact when a locally runnable and testable design can satisfy the scoped task.
