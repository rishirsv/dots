---
owner: "<team-or-role-or-unassigned>"
status: active
last-reviewed: YYYY-MM-DD
review-cycle-days: 60
source-of-truth: "docs/FRONTEND.md"
verification-state: unverified
stack: "<framework + router + state + styling>"
platforms: "<web|ios|android|desktop>"
---

# FRONTEND.md

## Purpose
Frontend contracts for architecture, ownership boundaries, and verification loops.

## Fill-In Fields
- Framework/runtime: <value>
- Router/navigation: <value>
- State management: <value>
- Data fetching: <value>
- Styling/theming: <value>
- App structure: <value>
- Performance budget: <value>

## Context Boundaries
- Frontend owns: <view layer, client state, routing, etc.>
- Backend owns: <business logic, persistence, server validation, etc.>
- Shared contracts: <API schema, types, auth contract>

## Component Conventions
- Component organization: <pattern>
- Reuse policy: <pattern>
- Error and empty states: <pattern>

## Verification Loop
- Unit checks: `<command>`
- Integration checks: `<command>`
- End-to-end checks: `<command>`
- Accessibility baseline: <standard>
- Performance baseline: <budget + measurement method>
