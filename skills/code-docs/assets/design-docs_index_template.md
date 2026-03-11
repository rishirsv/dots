# Design Docs Index

## Metadata
- Owner: <team-or-role-or-unassigned>
- Status: active
- Last reviewed: YYYY-MM-DD
- Review cycle days: 30
- Source of truth: `docs/design-docs/index.md`
- Verification state: unverified
- Index format version: 1

## Purpose
Index durable design/architecture decisions in one place.

## Decision Rules
- Write a design doc when the change affects architecture, interfaces, or cross-team behavior.
- Write a product spec for user-facing feature intent and acceptance criteria.
- Write an exec plan for implementation sequencing and execution tracking.

## Required Entry Schema
Each index entry must include:
- title
- path
- owner
- status
- verification-state
- last-reviewed

## Entries
| Title | Path | Owner | Status | Verification State | Last Reviewed |
|---|---|---|---|---|---|
| `<title>` | `docs/design-docs/<slug>.md` | <team/role> | <status> | <state> | YYYY-MM-DD |
