# DB-SCHEMA.md

## Metadata
- Owner: <team-or-role-or-unassigned>
- Status: active
- Last reviewed: YYYY-MM-DD
- Review cycle days: 30
- Source of truth: `<migrations|db|mixed>`
- Verification state: unverified
- Last generated: YYYY-MM-DD

## Purpose
Human-readable schema digest focused on critical entities and invariants.

## Regeneration Contract
- Schema source mode: `migrations` | `db` | `mixed`
- Generation command/process: `<command-or-process>`
- Generated artifacts (if any): `docs/generated/<artifact>.md`

## ERD (At A Glance)
```mermaid
erDiagram
  ENTITY_A ||--o{ ENTITY_B : relates_to
```

## Data Classification and PII Boundaries (Optional)
- Classification policy: <link-or-summary>
- PII-bearing entities: <list>
- Logging restrictions: <summary>

## Core Entities
| Entity | Purpose | Owner |
|---|---|---|
| `<entity>` | <summary> | <team/role> |

## Critical Constraints
- <constraint>
- <constraint>

## Critical Invariants (5-10)
- <testable invariant>
- <testable invariant>

## Verification
- Validate schema invariants: `<command/test/check>`
