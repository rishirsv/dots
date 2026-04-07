---
name: tester
description: This skill provides comprehensive guidance for building effective testing strategies that ensure software quality, reliability, and maintainability. Produce a production-ready Test Plan for one or more existing `feature_[FRD_ID].md` files under `features/`. Create/expand detailed feature test coverage covering positive, negative, edge, regression, security/permissions, and chaos/resilience scenarios without implementing the tests.
---

# Feature Test Planning

## Purpose
Help Codex complete feature-level test planning end-to-end by:
- producing a production-ready `## Test Plan` for one or more feature files
- mapping feature intent, acceptance criteria, dependencies, and risks to concrete coverage
- keeping the plan implementation-ready without writing the tests themselves

## When to use this skill:
- The user wants a feature test plan without test implementation.
- The task needs production-readiness coverage across positive, negative, edge, security, regression, and resilience scenarios.
- Existing feature files under `features/` need stronger traceable test coverage.

### Do NOT use this skill if:
- The user wants tests implemented rather than a plan.
- The request is only for ad hoc bug repro steps and does not need a structured feature plan.
- The task does not reference a feature file or equivalent scoped feature artifact.

## Inputs

- One or more `feature_[FRD_ID].md` files.
- Related sibling feature files when needed to sharpen scenario detail.

## Output Format

Return `## Test Plan`.

The block must contain only:
- **Feature Under Test**
- **Traceability**
- **Test Environment & Data**
- **Scenario Inventory**
- **Automation Strategy**
- **Release Gates**

## Workflow

1. Read the full feature file before drafting scenarios.
2. Extract the feature goal, user roles, flows, UX expectations, config flags, acceptance criteria, dependencies, and any existing test notes.
3. Build a traceability map from acceptance criteria and dependencies to concrete scenarios.
4. Identify the main success path, failure paths, trust boundaries, and operational risks.
5. Cover each applicable category explicitly:
   - positive
   - negative
   - edge
   - permissions and security
   - data integrity and state transition
   - regression
   - resilience
   - non-functional readiness
6. Recommend the thinnest useful test layers, choosing from unit, component, integration, API, E2E, and manual.
7. Write concrete scenarios with explicit setup, action, expected result, and risk covered.
8. Add domain-specific cases when the feature includes:
   - database behavior
     - deployment-time resource prerequisites from `docs/deploy_plan.md`
     - required seed data presence, absence, and bootstrap behavior
   - UI behavior
   - API or background processing
9. Call out missing information or testability gaps separately instead of hiding them in the scenario list.

## Guardrails

- Do not invent product behavior that is absent from the feature file or closely related context.
- Do not collapse multiple features into one shared plan unless explicitly requested.
- Do not stop at happy-path coverage.
- Do not use vague scenario labels where a concrete failure mode can be named.
- Do not omit deployment-resource or seed-data readiness checks when the feature depends on persisted external resources.
