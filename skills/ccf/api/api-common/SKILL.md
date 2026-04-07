---
name: api-common
description: Shared API task guidance for this repository. Use alongside API design or API implementation tasks when Codex needs the common rules for route classification, shared-type reuse, backend conventions, error envelope decisions, and DB handoff boundaries without duplicating them in role-specific skills.
---

# API Common

## Purpose

Help Codex keep API design and implementation work consistent by:

- centralizing the repository's shared API constraints and backend references
- defining the classification and contract rules both designer and implementor work must honor
- separating common API guidance from role-specific design and implementation outputs

## When to use this skill:

- The task is about backend API design or backend API implementation in this repository.
- An API designer or API implementor skill needs shared route, schema, auth, logging, or error-contract rules.
- Codex needs to classify API work as a new endpoint, contract change, or behavior change before proceeding.

### Do NOT use this skill if:

- The task is frontend-only and does not change or depend on API behavior.
- The work is purely DB schema design with no API contract decision to make.
- The task is a generic backend coding request outside this repository's API patterns.

## Inputs

- The scoped API task, feature artifact, or acceptance criteria.
- The affected backend service, endpoint path, and shared-type context when known.
- Relevant repository files for route registration, shared types, middleware, and persistence boundaries.

## Output Format

This skill does not define a standalone deliverable. It supplies shared API rules that the designer and implementor skills should apply.

## Workflow

### 1. Inspect repository context

1. Read `../ccf-general/ccf-general-common/SKILL.md` for repo-wide backend constraints.
2. Inspect existing route registration, request/response types, middleware, and shared backend utilities before naming anything new.
3. Use the API references already bundled with the category:
   - `../api-designer/references/repo-backend-conventions.md`
   - `../api-designer/references/route-decision-rubric.md`
   - `../api-designer/references/api-quality-checklists.md`
   - `../api-designer/references/design-output-template.md`

### 2. Classify the API task

1. Decide whether the task is:
   - `API / API method`
   - `API / API Service`
2. Decide whether the route change is:
   - `new endpoint`
   - `existing contract change`
   - `existing behavior change`
3. Decide whether the contract is:
   - `Streaming`
   - `Non-streaming`
4. Reject or split work that combines multiple independently deliverable API changes.

### 3. Apply shared contract rules

1. Reuse existing shared request and response fields when semantics match.
2. Keep API definitions under shared types.
3. For non-streaming work, define both request and response contracts.
4. For streaming work, define the request contract and streamed event or chunk contract only.
5. Prefer additive, backward-compatible schema evolution and flag breaking changes explicitly.
6. When behavior changes without contract drift, state that the external contract remains unchanged.
7. When a feature or task artifact implies specific consumer-visible or consumer-relied-on contract details such as fields, query semantics, validation rules, permission rules, transition rules, emitted outputs, or ordering behavior, make those parts of the API contract explicit instead of leaving them as generic `search`, `filter`, `summary`, or `workflow` behavior.

### 4. Apply shared behavior and error rules

1. Ground the work in one ordered business logic sequence tied to the feature flow.
2. Define UI-facing error handling for unhappy paths using the repository's standard error envelope.
3. Use:
   - `errType: validate` for payload-validation and business-rule failures
   - `errType: db` for DB-specific failures the UI must distinguish
   - `errType: general` for orchestration or internal failures
4. Reuse repository defaults for auth, logging, telemetry, validation, compression, and cache behavior unless the scoped task requires a deviation.

### 5. Coordinate with DB work when needed

1. Keep API and DB responsibilities separate.
2. If the task needs dedicated persistence design, use `../../database/db-common/SKILL.md` and `../../database/db-designer/SKILL.md` instead of embedding DB design here.
3. If implementation scope includes DB work, use `../../database/db-implementor/SKILL.md` only for the persistence portions.
4. Treat required external resources, seed data, environment variables, and App Configuration keys as deployment-time prerequisites documented in `docs/deploy_plan.md` only when the active flavor and chosen implementation still depend on them.
   - In `Builder` mode, first prefer a locally runnable or repo-local substitute when that keeps the capability implementable and testable.
   - When API work introduces or changes `getEnvVariable*`, `getValue*`, or `getVersionValue*` usage in the chosen implementation path, add or update the matching `Seed` entries with the exact key name, purpose, requiredness, default value when the code provides one, expected format or allowed values when relevant, who supplies it, and branch override semantics when `getVersionValue*` is used.
5. Do not create, provision, or seed external resources from API request handlers or service startup code.
6. If runtime depends on missing resources or seed data and no acceptable local substitute exists for the active flavor, surface that as a deployment defect instead of auto-provisioning it.
7. When an LLM provider is needed and no provider is already fixed by the feature, task artifact, or touched code, prefer the official OpenAI platform / ChatGPT ecosystem in `Builder` mode and Azure OpenAI-specific wrappers only in `CCF Developer` mode.

## Guardrails

- Do not invent new endpoints, type names, or middleware patterns without checking the repo first.
- Do not combine unrelated API outputs into one task artifact.
- Do not duplicate DB design or DB implementation instructions inside API role-specific skills.
- Keep API guidance concrete enough for implementation, but avoid file-by-file patch plans in design work.
- Do not assume downstream tasks can compensate for an underspecified producer contract; if a consumed contract is implied by the scoped artifacts, the API task must state it explicitly.
- Do not encode deployment-time resource provisioning or seed bootstrap behavior into API runtime flows.
- Do not treat new environment variables or App Configuration keys introduced by API work as implicit implementation details; capture them in `docs/deploy_plan.md` `Seed` entries.
- In `Builder` mode, do not force Azure-specific wrappers or external deployment prerequisites when the scoped task can be satisfied with a locally runnable and testable integration.
- Log the original error object plus structured request context
- Do not replace a specific caught error with a generic one unless the original has already been logged
