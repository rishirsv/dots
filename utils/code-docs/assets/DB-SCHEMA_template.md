---
name: db-schema
description: Database schema digest template for docs/DB-SCHEMA.md.
---

# DB-SCHEMA.md

## Purpose
Human-readable digest of the current database schema and data invariants.

## Source of Truth
- Schema definitions: `<path/to/schema-source>`
- Migrations: `<path/to/migrations>`

## Update Policy
- Update this file whenever schema or migration contracts change.
- Keep table/column names exact.
- Keep constraints and indexes explicit.

## Core Invariants
- <invariant>
- <invariant>
- <invariant>

## Tables

### `<table_name>`
- Purpose: <one line>
- Primary key: `<column>`
- Foreign keys: `<column> -> <table.column>`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `<column>` | `<type>` | `no` | `<default>` | <notes> |

## Indexes
- `<index_name>` on `<table>(<columns>)` — <reason>

## Triggers (if any)
- `<trigger_name>` — <behavior>
