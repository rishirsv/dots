---
name: db-common
description: Shared persistence guidance for this repository. Use alongside DB design or DB implementation tasks when Codex needs the common rules for schema reuse, flavor-aware persistence selection, indexing scope, concurrency expectations, and secure data access without duplicating them in role-specific skills.
---

# Database Common

## Purpose
Help Codex keep persistence design and implementation work consistent by:
- centralizing shared schema, flavor-aware persistence selection, indexing, identity, and concurrency rules
- centralizing the split between logical schema documentation and deployment-time resource planning, including required seed placeholders when deployment-owned values are still pending
- defining the repository's baseline for secure persistence access and type reuse
- removing duplicated DB guidance from the designer and implementor skills

## When to use this skill:
- The task is about designing or implementing persistence in this repository.
- A DB designer or implementor skill needs shared rules for types, partition keys, or query safety.
- API work needs to coordinate with DB decisions without embedding duplicate DB instructions.

### Do NOT use this skill if:
- The task does not involve persistence behavior.
- The work is purely API contract design with no DB schema or query implications.
- The request is outside this repository's persistence patterns.

## Inputs

- The API definition, feature requirements, and business logic in scope.
- Existing DB types, wrappers, and utilities in the repository.
- Dominant reads, writes, invariants, and authorization boundaries when known.

## Output Format

This skill does not define a standalone deliverable. It supplies shared persistence guidance that the designer and implementor skills should apply.

## Workflow

### 1. Inspect repository context

1. Read `../ccf-general/ccf-general-common/SKILL.md` for repo-wide backend constraints.
2. Resolve the active development flavor through that common skill before choosing a persistence path.
3. Inspect existing DB types and wrappers before proposing anything new.
4. Reuse the existing persisted type definitions in `lib/cosmosDB/src/types/index.ts` when the chosen implementation extends the existing Cosmos-based repository path.
5. In `Builder` mode, prefer the simplest locally runnable persistence mechanism that satisfies the scoped task, such as existing local persistence, file-backed storage, SQLite, or in-memory state. Do not choose Cosmos just because it exists in the scaffold.
6. Inspect existing DB documentation before proposing changes:
   - `docs/db-model.md` for the logical schema source of truth
   - `docs/deploy_plan.md` for deployment-time resource inventory and required seed data when the chosen implementation actually depends on deployment-owned resources
7. Confirm the dominant read/write paths, business invariants, and authorization boundary before deciding schema or query behavior.

### 2. Apply shared schema and identity rules

1. Create a new persisted type only when a new entity or irreducibly new persisted shape is required.
2. Reuse existing `DBItemType` values and interfaces when semantics already match and the chosen implementation still uses the Cosmos-based path.
3. When the chosen implementation extends the existing Cosmos-based path, keep persisted entities extending the repo's base DB type pattern.
4. Prefer deterministic IDs when business uniqueness matters or idempotent creates are needed.
5. Keep uniqueness enforcement within one partition or equivalent storage boundary when possible.

### 3. Apply shared partitioning, indexing, and concurrency rules

1. Align partition keys or equivalent storage-grouping boundaries with authorization boundaries and dominant access patterns.
2. Avoid broad fan-out queries across partitions or storage groups unless they are strictly required and explicitly justified.
3. Index only fields required for filters or sort order.
4. Exclude large, non-query fields and blobs from indexing when they are not queried.
5. Use optimistic concurrency with ETags or the chosen store's equivalent mechanism for stateful updates.
6. Keep transactional assumptions within the actual capabilities of the chosen persistence layer; never fake unsupported cross-boundary transactions.

### 4. Apply shared secure access rules

1. Use the existing repository wrappers and utilities for the chosen persistence layer when they fit the active flavor and runtime path.
2. If the chosen layer is Cosmos, use only the official Microsoft Cosmos SDK and existing repository wrappers, and use parameterized queries only.
3. Keep reads and writes scoped to the authorized tenant, user, or partition boundary appropriate to the chosen persistence layer.
4. When the chosen layer is Cosmos, do not validate raw Cosmos `SELECT *` documents directly with strict API Zod schemas or other strict transport contracts, because Cosmos responses can include system-managed fields such as `_rid`, `_self`, `_etag`, `_attachments`, and `_ts`.
5. Before applying strict API-schema validation to Cosmos read results, either:
   - project only the API-owned fields in the query itself, or
   - map the document into an API-owned shape that strips Cosmos system fields and any other persistence-only properties.
6. Do not log secrets, tokens, full document bodies, or sensitive identifiers unnecessarily.
7. Return only the fields required by the API.

### 5. Apply shared deployment and seeding rules

1. Treat runtime DB libraries and API handlers as data-plane only.
2. Do not add runtime control-plane provisioning calls such as `createIfNotExists`, database create/update calls, container create/update calls, throughput mutations, or indexing-policy provisioning requests for external services.
3. Keep the logical schema source of truth in `docs/db-model.md`.
4. Keep deployable resource requirements in `docs/deploy_plan.md` only when the chosen persistence path actually depends on deployment-owned resources.
5. If seed data is required for the application or feature to run and the chosen persistence path depends on deployment-owned setup, keep the canonical seed record under the `Seed` section of `docs/deploy_plan.md`.
   - When exact values are known, list the exact required entries.
   - When no seed data is required, record `None`.
   - When seed data is required but deployment-owned values are not yet available, add canonical placeholders for each required record and field.
   - Each placeholder must explain what value the operator must supply, the expected format or units, any validation rule, and whether `None` is allowed.

## Guardrails

- Do not duplicate DB types or introduce unnecessary parallel DB layers.
- Do not invent unsupported transaction semantics.
- Do not broaden partition or query scope beyond what the feature needs.
- Keep DB guidance concrete and tied to the scoped persistence behavior.
- Do not rely on permissive API schemas to absorb Cosmos metadata; sanitize or project DB results before strict API validation instead.
- Do not solve deployment gaps by adding runtime provisioning or implicit seed creation to the DB library.
- Do not leave required seed data as only a generic "pending input" note when a field-level placeholder section can be written in `docs/deploy_plan.md`.
- In `Builder` mode, do not force Cosmos or any other deployment-owned database service when a simpler locally runnable persistence option satisfies the scoped task.
