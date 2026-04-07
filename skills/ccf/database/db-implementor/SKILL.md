---
name: db-implementor
description: Implement persistence operations for this repository using existing types, wrappers, and the persistence strategy selected for the active development flavor. Use when asked to add or modify reads, writes, pagination, or concurrency-sensitive persistence logic while preserving secure access behavior.
---

# Database Implementor

## Purpose
Help Codex complete DB implementation work end-to-end by:
- translating scoped persistence requirements into repository-aligned persistence code
- keeping reads, writes, pagination, concurrency, and query safety consistent with existing patterns
- relying on `../db-common/SKILL.md` for shared DB rules instead of duplicating them here

## When to use this skill:
- The user wants persistence reads or writes implemented in code.
- The work includes CRUD operations, paginated list/search behavior, or concurrency-sensitive updates.
- API implementation needs persistence code that follows existing types and wrappers.

### Do NOT use this skill if:
- The user only wants a DB design/spec with no code changes.
- The task has no persistence impact.
- The work would require inventing unsupported DB infrastructure or cross-partition transactional behavior.

## Inputs

- API definition.
- Feature requirements and scope.
- Business logic.
- Existing schema in `docs/db-model.md`.
- Existing schema types in `lib/cosmosDB/src/types/index.ts` when the chosen implementation extends the Cosmos-based path.
- Existing deploy/resource plan in `docs/deploy_plan.md`.
- Existing DB client wrappers and utilities in the repository.

## Output Format

When implementing DB work, return:
1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for types, wrappers, query safety, and concurrency

## Workflow

1. Read `../db-common/SKILL.md`, resolve the active development flavor, and apply its shared schema, persistence-selection, indexing, and security rules.
2. Confirm the required reads, writes, authorization boundary, and whether the task changes logical schema, deployable resources, or mandatory seed data.
3. Reuse existing types, wrappers, and utilities whenever they already support the feature and fit the active flavor.
4. In `CCF Developer` mode, default to the existing Cosmos-based repository path unless the task or touched code already anchors another store. In `Builder` mode, default to the simplest locally runnable persistence path that satisfies the task unless touched code already anchors another store.
5. Implement only the required runtime data-plane operations:
   - create
   - read
   - update
   - delete
   - list or search when needed
6. For list or search operations:
   - use the paging model that fits the chosen persistence layer
   - filter server-side when applicable
   - project only required fields
   - avoid broad fan-out queries unless strictly required
7. For stateful updates:
   - use the concurrency mechanism that fits the chosen persistence layer
   - prefer partial updates over full replace when the chosen store supports them
   - keep retries bounded and conflict-aware
8. Use multi-record transactional features only when the chosen persistence layer actually supports them.
9. Keep queries or lookups scoped, authorization-aware, and aligned with the repository's secure logging practices.
10. When the task changes logical schema or persisted-document contracts, update `docs/db-model.md`.
11. When the task changes deployment-time resources or mandatory seed data for a persistence path that depends on deployment-owned resources, update `docs/deploy_plan.md`.
    - If exact deployment-owned seed values are unavailable, add canonical placeholders for each required record and field, including fill instructions and validation notes.
12. If the change requires new or altered external DB resources, document that requirement instead of creating it through runtime SDK control-plane calls.

## Guardrails

- Use TypeScript only, with strict typing and no `any`.
- Use the existing repository wrappers or the chosen persistence layer's safe access library instead of ad-hoc raw HTTP layers.
- In `CCF Developer` mode, use the official `@azure/cosmos` SDK and existing repository wrappers instead of custom HTTP layers.
- Do not duplicate types or introduce an unnecessary parallel DB access layer.
- Stop and report the gap instead of faking unsupported transactional or infrastructure behavior.
- Do not add runtime provisioning helpers such as `createIfNotExists`, database/container create/update flows, throughput changes, or implicit seed creation for external services.
- Do not leave required seed sections as a generic handoff when a structured placeholder block can be added to `docs/deploy_plan.md`.
- In `Builder` mode, do not force Cosmos or another deployment-owned database service when a simpler locally runnable persistence path satisfies the scoped task.
