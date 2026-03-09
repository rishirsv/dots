---
owner: "<team-or-role-or-unassigned>"
status: active
last-reviewed: YYYY-MM-DD
review-cycle-days: 30
source-of-truth: "docs/design-docs/index.md"
verification-state: unverified
index-format-version: 1
---

# Design Docs Index

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
