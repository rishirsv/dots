---
name: api-implementor
description: Implement one scoped backend API task in code using repository conventions. Use when Codex must apply an existing API task artifact or equivalent concrete API scope to shared types, route logic, registration, validation, auth, error handling, and targeted backend verification without redesigning the contract.
---

# API Implementor

## Purpose

Help Codex complete API implementation work end-to-end by:

- translating one scoped API task artifact or equivalent scoped API request into repository-aligned backend code
- deriving shared contracts, route logic, dependency calls, registration, and validation work from that artifact without redesigning it
- relying on `../api-common/SKILL.md` for shared API rules instead of duplicating them here

## When to use this skill:

- The user wants backend API code changes for a scoped API task.
- The work already has an `api-designer` artifact or an equivalent concrete API contract and behavior scope.
- The task needs route logic, shared schema changes, dependency wiring, route registration, and validation in repo-native patterns.

### Do NOT use this skill if:

- The user wants an API design artifact rather than code changes.
- The task implies a new service boundary without a concrete repository target.
- The work still spans multiple independently deliverable API outputs and must be split first.
- The work is primarily DB design or frontend behavior rather than API implementation.

## Inputs

- The current single API task artifact, ideally with `Task type`, `Intent`, `Dependencies`, `Reuse opportunities`, `## API definition and business logic`, and `## Additional notes`.
- Or a scoped API request plus acceptance criteria when no artifact is provided yet.
- The affected backend service, route classification, streamability, shared types, and any explicit repository or service reuse targets.

## Output Format

This skill does not define a standalone artifact. It supplies the implementation workflow, placement rules, and validation expectations that should be reflected in the final implementation summary.

## Workflow

1. Read `../api-common/SKILL.md` and apply its shared API rules, references, and classification requirements.
2. Resolve the current single API task artifact from the provided context, or infer an equivalent scoped API implementation target from the request when no artifact is available.
3. Confirm task type, route classification, dependencies, reuse opportunities, route ownership, and streamability.
4. Stop early if dependencies are missing, the task implies a new service boundary without a concrete repo target, or the artifact conflicts with the actual repo shape in a way that changes scope or contract.
5. Inspect source-of-truth files: shared types, shared-types barrel, existing method modules, route registry, middleware, app bootstrap, package scripts, and any explicitly reused repository or service target.
6. Confirm the implementation contract from the task artifact: request and response shape, streaming vs. non-streaming behavior, business logic sequence, decision points, error handling expectations, UI-facing error codes, auth model, logging requirements, and any config or performance notes.
   - treat required external resources and seed data as deployment prerequisites, not runtime provisioning work
   - in `Builder` mode, prefer a locally runnable and testable integration path when the task artifact does not already force an external deployment-owned dependency
7. Run a mandatory duplication audit before writing code:
   - search for method modules, services, and helpers for equivalent auth extraction, telemetry, error mapping, projection loading, orchestration, and response-shaping logic
   - classify the intended implementation as one of:
     - true new behavior
     - a small variant of an existing implementation
     - a thin wrapper around an existing pattern that should be generalized
   - if the new work would create two or more files with substantially identical control flow and only contract names, log labels, copy, or service calls changed, stop and extract or reuse a shared helper before continuing
8. Derive the concrete execution order:
   - shared schemas, types, and exports
   - required repository or helper changes
   - route implementation
   - route registration
   - endpoint-specific auth, error mapping, logging, config, or performance changes required by the artifact
9. Implement the task-specific repository changes using these rules:
   - For `API / API method` tasks:
     - default to the existing `application/api/api1` service unless the artifact explicitly names another existing service
     - Keep `lib/shared-types/src/api.types.ts` for domain-agnostic and cross-cutting shared API contracts. The `API` namespace is for base transport contracts and other reusable contracts that are not tied to a single business domain.
     - Put new business-domain-specific request and response schemas in separate files under `lib/shared-types/src/`. Those schemas must extend `API.APIReqSchema` and `API.APIResSchema`, and be exported from `lib/shared-types/src/index.ts` under a dedicated namespace.
     - implement the endpoint in `application/api/api1/src/methods/<route>/index.ts`
     - register non-streaming routes in `nonStreamRoutes` and streaming routes in `streamRoutes` inside `application/api/api1/src/methods/index.ts`
     - add repository or helper changes only when the task's business logic actually requires persistence, config, or other dependency work
     - keep runtime integrations within their operational responsibility; do not add resource provisioning flows or implicit seed creation

   - For `API / API Service` tasks:
     - require an explicit service ownership target in the task or reuse paths
     - stop and report the gap if the task implies a new service boundary but does not identify a concrete repo target
   - For `new endpoint` tasks:
     - create the shared contract and route artifacts in the standard API method locations above
     - add the shared request schema first
     - add the shared response schema for non-streaming routes
     - for streaming routes, implement streamed behavior instead of a normal JSON response
     - register the new route in the appropriate route list
   - For `existing contract change` tasks:
     - update shared schemas before modifying route logic
     - preserve additive compatibility unless the task explicitly allows a breaking change
   - For `existing behavior change` tasks:
     - keep the external contract unchanged
     - stop if the required code changes would force observable contract drift

10. Treat documentation as a strict implementation requirement:
    - add comprehensive JSDoc comments to all newly created or modified functions with accurate `@param` and `@returns` annotations
    - add inline comments only where business logic, branching, data transformation, or error handling would otherwise be hard to follow
11. Run targeted validation only for the packages you touched, using local package scripts directly inside each touched package directory:
    - if any service under `application/api/<service-name>` changed:
      - run `npm run typecheck` - to verify code follows typescript standards
      - `npm run lint` - to verify that code is following coding standards
      - `npm run build` - to verify that can be built and packaged successfully without errors
      - and `npm run local` - to start api. Presence of `Application is running on port`, in console,means service is up and ready to serve request. Terminate the process immediately after confirming the service boots - donot keep it running if not needed.
12. Before close-out, perform a duplication review on touched files:
    - verify that no new file-local helper duplicates an existing helper with the same behavior under a different name
    - if duplication remains intentionally, record as a comment why extraction was not the better tradeoff
13. If validation fails, attempt to resolve the errors and rerun the affected checks. If a blocker remains, report it clearly in the final implementation summary.
14. Do not mutate the task artifact unless the user explicitly asks for task-status tracking or documentation updates.
15. Return a compact implementation summary with implemented scope, changed files, validation results, assumptions used, and any remaining blockers.

## Guardrails

- Treat the current single API task artifact as the implementation source of truth.
- Implement the full task directly from the task artifact when it already contains concrete API definitions and business logic.
- Treat `Reuse opportunities` and the repo source-of-truth files as binding reuse constraints unless the current repo state proves they are stale or incorrect.
- Preserve the task's single-responsibility boundary.
- Treat `## API definition and business logic`, decision points, error handling, logging and telemetry, and any populated bullets in `## Additional notes` as implementation requirements.
- Reuse the existing middleware behavior and shared error envelope unless the task requires endpoint-specific mapping.
- Reuse repo defaults for JWT, validation, logging, compression, cache behavior, async context, and `xMSP-TRACE-ID` unless the artifact explicitly requires endpoint-specific changes.
- Do not introduce helpers that duplicate existing auth extractors, error builders, telemetry wrappers, or route/service orchestration helpers.
- Do not add request-time or startup-time resource provisioning or seed bootstrap logic; document deployment prerequisites in `docs/deploy_plan.md` or report the blocker instead.
- In `Builder` mode, do not treat an Azure-specific wrapper or deployment-owned service as mandatory when the task can be completed with a repo-local or otherwise locally runnable implementation that still satisfies the artifact.
- Do not redesign a usable task artifact.
- Do not rewrite the task into a patch plan or TODO list before implementing it.
- If dependencies listed in the task are missing and block implementation, stop and report the blocker instead of guessing.
- Do not close out implementation work without running the targeted validation required by the touched packages, or explicitly reporting why it could not be completed.
- If the artifact is missing the core API definition section, cannot determine route classification or streamability, implies more than one endpoint for one API method task, or would require redesigning the contract beyond what the artifact allows, stop and report instead of inventing behavior.
