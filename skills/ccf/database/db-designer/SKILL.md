---
name: db-designer
description: Design durable, performance-aware persistence changes for this repository. Use when a task needs explicit persisted entity design, storage strategy, indexing scope, identity rules, and concurrency assumptions before implementation starts.
---

# Database Designer

## Purpose
Help Codex complete DB design work end-to-end by:
- producing a durable, performance-aware persistence design for the scoped task
- defining the data contract summary and schema decision record an implementor can use directly
- relying on `../db-common/SKILL.md` for shared DB rules instead of repeating them here

## When to use this skill:
- The user wants persistence design without code changes.
- The task needs explicit entities, partition keys or equivalent storage boundaries, indexing, uniqueness, and concurrency decisions.
- API or feature design requires dedicated persistence design beyond a brief implementation note.

### Do NOT use this skill if:
- The user wants DB code changes rather than a design artifact.
- The task has no persistence impact.
- The work is a generic backend task where API design alone is sufficient.

## Inputs

- API definition.
- Feature requirements and scope.
- Business logic and access patterns.

## Output Format

Produce a DB design artifact that includes:
- **Data Contract Summary**
  - entities
  - access patterns
  - invariants
  - cardinality
  - consistency expectations
- **Schema Decision Record**
  - types added or updated
  - partition key or equivalent storage boundary and rationale
  - supported queries and index strategy
  - uniqueness strategy
  - atomicity assumptions
- **Deployment Impact**
  - `docs/db-model.md` changes required
  - `docs/deploy_plan.md` resource entries required when the chosen persistence path depends on deployment-owned resources
  - deployment-time DB resource changes such as database/container/index/TTL/throughput/unique-key updates when applicable
- **Seed Requirements**
  - exact required seed records, `None`, or canonical placeholders when deployment-owned values are still pending
  - why the seed is needed
  - where it must be recorded
  - when placeholders are used, the required fields, expected format, validation rules, and source owner for each missing value

## Workflow

1. Read `../db-common/SKILL.md`, resolve the active development flavor, and apply its shared schema, storage-selection, indexing, and security rules.
2. Confirm the persisted entities, dominant reads, dominant writes, invariants, growth profile, and consistency requirements.
3. Decide whether existing persisted types can be reused or whether a new persisted type is required.
4. In `CCF Developer` mode, default to the existing Cosmos-based repository path unless the scoped task already anchors another store. In `Builder` mode, default to the simplest locally runnable persistence path that satisfies the task unless touched code already anchors another store.
5. For each affected type, document:
   - partition key or equivalent storage boundary
   - rationale
   - dominant reads and writes
   - atomicity assumptions
   - growth and write-skew considerations
6. Define the required query patterns, indexed fields, excluded fields, and tradeoffs.
7. Define identity and uniqueness strategy, preferring deterministic IDs when business uniqueness matters.
8. Document optimistic concurrency expectations and any storage-boundary transactional assumptions.
9. Document the required `docs/db-model.md` updates for the logical schema source of truth.
10. Document any deployment-time resource changes that must be recorded in `docs/deploy_plan.md` when the chosen persistence path depends on deployment-owned resources.
11. Document required seed data under a dedicated `Seed Requirements` section, using:
   - exact required seed records when known
   - `None` when no seed data is required
   - canonical `docs/deploy_plan.md` placeholders when required values are deployment-owned and not yet available
12. Produce the data contract summary, schema decision record, deployment impact, and seed requirements without turning the design into implementation code.

## Guardrails

- Do not duplicate persisted types when an equivalent type already exists.
- Keep transactional assumptions aligned with the actual capabilities of the chosen persistence path.
- Do not over-index or add speculative schema flexibility.
- Keep the design concrete enough that implementation can proceed without reinterpreting schema intent.
- Do not encode deployment-time provisioning or seeding as runtime-library behavior.
- Do not stop at a generic "pending operator input" statement when the missing seed shape can be expressed as field-level placeholders in `docs/deploy_plan.md`.
- In `Builder` mode, do not force Cosmos or another deployment-owned database service when a simpler locally runnable persistence path satisfies the scoped task.
