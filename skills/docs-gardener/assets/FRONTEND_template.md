# FRONTEND.md

## Purpose
Frontend contracts for architecture, ownership boundaries, runtime behavior, and verification loops.

## Frontend / Design Boundary
- `docs/FRONTEND.md` owns route ownership, navigation APIs, async/loading/paging behavior, state/lifecycle contracts, and release-gating checks.
- `docs/DESIGN.md` owns visual language, token semantics, primitive intent, material rules, typography, and canonical review-surface expectations.
- Do not restate the full visual system here; point to `docs/DESIGN.md` when implementation needs visual guidance.

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
- Styling implementation rules: <class/style split, token consumption, primitive usage>

## Verification Loop
- Unit checks: `<command>`
- Integration checks: `<command>`
- End-to-end checks: `<command>`
- Accessibility baseline: <standard>
- Performance baseline: <budget + measurement method>
