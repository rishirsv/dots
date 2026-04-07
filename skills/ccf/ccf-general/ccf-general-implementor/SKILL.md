---
name: ccf-general-implementor
description: Use for code changes, refactors, or reviews in this monorepo when Codex must apply the shared repository and development-flavor rules and complete the mandatory post-request verification checklist.
---

# CCF General Implementor

## Purpose

Help Codex complete repository-aware implementation work by:

- applying the shared CCF repository rules while making code changes, refactors, or reviews
- resolving concrete in-repo prerequisite gaps when they directly block the scoped implementation
- keeping execution and close-out verification aligned with the repository checklist
- relying on `../ccf-general-common/SKILL.md` for shared rules instead of duplicating them here

## When to use this skill:

- The user wants code implemented, refactored, or reviewed in this monorepo.
- Another implementor skill needs the repository-wide verification and close-out rules.
- Codex must verify that a code change complies with the CCF repository checklist before completion.

### Do NOT use this skill if:

- The task is design-only and does not include code changes or implementation review.
- The task is outside this repository.
- A narrower implementor skill fully covers the work and no repository-wide implementation rule is relevant.

## Inputs

- The task scope and affected files or packages.
- Any active feature artifacts or implementation constraints.
- The validation expectations for the touched workspaces.

## Output Format

This skill does not define a standalone artifact. It supplies the implementation workflow and mandatory verification checklist that should be reflected in the final implementation report.

## Workflow

1. Read `../ccf-general-common/SKILL.md`, resolve the active development flavor, and apply its repository rules before changing code.
2. Inspect the touched workspaces, manifests, and existing conventions in the scoped area before editing.
3. If the scoped implementation is blocked by missing functionality that is required to satisfy the selected task, decide whether the gap can be resolved inside the same rollout:
   - expand scope only when the missing capability is a direct prerequisite for the selected task, already implied by the task or its consumed design decisions, and can be implemented inside existing approved repository boundaries
   - classify the missing capability as a shared API/domain contract, other project-specific behavior, or a generic scaffold enhancement before choosing placement
   - put project-specific shared API/domain contracts in `@ccf_ca/shared-types` when they are meant to be reused between Front-End and Back-End services in this repository
   - put other project-specific missing capability in the owning `application/` package or a project-specific `lib/` package instead of duplicating it in the consumer
   - treat another existing `@ccf_ca/*` scaffold library as the owner only when the change is a generic cross-repository enhancement and the user explicitly approved that scaffold change
   - in `Builder` mode, if the missing capability is currently only represented by an optional external-service wrapper, prefer the smallest repo-local or locally runnable implementation that satisfies the selected task instead of forcing that wrapper into the solution
   - keep the scope extension minimal and limited to what is needed to complete the selected task
   - if the gap would require a new feature design, new service boundary, unresolved product decision, unapproved dependency/license exception, or broad future-facing capability work, stop and report the blocker instead
4. Implement, refactor, or review the work while preserving the structure, boundary, reuse, dependency, and license rules from the common skill.
5. When scope is extended to unblock the selected task, record the unblock reason and the additional owner-layer changes in the normal implementation notes/change summary output.
6. When the scoped work changes persistence schema or persisted-document shape, update `docs/db-model.md`.
7. When the scoped work changes deployable resources, mandatory seed data, or deployment-owned runtime configuration in the chosen implementation path, update `docs/deploy_plan.md`. If deployment-owned seed values are missing, leave canonical placeholders with fill instructions before reporting a blocker.
   - Treat new or changed environment variables and App Configuration keys as `Seed` entries in `docs/deploy_plan.md`.
   - Record the exact key name, purpose, requiredness, default value when code provides one, expected format or allowed values when relevant, who supplies it, and branch override semantics when `getVersionValue*` is used.
8. Always make sure the dependencies are properly installed by executing `npm install`.
9. If there are code changes in the shared library under the `lib` folder, trigger its build so the changes can be picked-up by the dependant libraries and downstream consumers.
10. Complete the post-request checklist:
   - Dependency management:
     - no unused dependencies introduced
     - no missing dependencies
     - use `npx depcheck` command to verify that typescript project or library does not have any missing or unused dependencies
   - Linting and package checks:
     - lint would pass in affected workspaces
     - package manifests remain consistent
     - use `npm run lint` command to verify that linting would pass in affected workspaces
   - Build verification:
     - TypeScript compiles
     - affected builds would succeed
     - use `tsc` or dedicated script inside package.json to verify that TypeScript compiles and affected builds would succeed
   - Structure compliance:
     - no unauthorized root-level files or folders
     - no Docker-related root files remain
   - Runtime/deployment boundary:
     - no runtime resource provisioning or seeding introduced in `application/` or `lib/`
     - `docs/db-model.md` updated when persistence schema changed
     - `docs/deploy_plan.md` updated when the chosen implementation still depends on resources, mandatory seed data, or deployment-owned runtime configuration, including placeholders for unresolved deployment-owned seed values
     - every new or changed `getEnvVariable*`, `getValue*`, or `getVersionValue*` dependency is mirrored in the `Seed` section with explanation and default value when applicable
11. Report any checklist item, structure rule, or licensing rule that could not be satisfied.

## Guardrails

- Do not close out implementation work without addressing or explicitly reporting checklist gaps.
- Do not broaden scope to absorb unrelated sibling or successor task deliverables just because a prerequisite gap exists.
- Only extend scope far enough to implement the missing prerequisite functionality needed by the selected task.
- When unblocking requires shared or producer-owned code, prefer that owner-layer change over consumer-local duplication.
- Do not treat project-specific business requirements as justification to edit an existing `@ccf_ca/*` scaffold library, except for shared API/domain contracts that belong in `@ccf_ca/shared-types`; otherwise use the owning `application/` package or a project-specific library under `lib/` instead.
- Stop and report the issue instead of guessing when the requested change requires an unapproved structural or licensing exception.
- Do not solve deployment-time resource or seed gaps by adding runtime provisioning logic to request handlers, service startup, or shared libraries.
- Do not leave required seed gaps documented only as a generic pending-input blocker when `docs/deploy_plan.md` can hold structured placeholders for the remaining operator input.
- Do not treat runtime configuration changes as separate from deployment seed work; if the code now depends on a new env var or App Configuration key, the deploy plan must be updated in the same rollout.
- In `Builder` mode, do not stop merely because an Azure-specific scaffold wrapper is unavailable or unsuitable if a repo-local or locally runnable implementation can satisfy the selected task within approved boundaries.
