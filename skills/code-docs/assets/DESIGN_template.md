# DESIGN.md

## Metadata
- Owner: <team-or-role-or-unassigned>
- Design owner: <team-or-role-or-unassigned>
- Status: active
- Last reviewed: YYYY-MM-DD
- Review cycle days: 60
- Source of truth: `<figma|repo|mixed>`
- Verification state: unverified

## Purpose
Design operating contract for this repo: source of truth, system map, agent editing boundaries, and verification guidance.

## Source of Truth
- Primary: <figma-link-or-repo-path>
- Secondary: <tokens package / style system / docs path>
- Decision owner: <team-or-role>

## Design System Map
- Tokens source: <path-or-link>
- Typography source: <path-or-link>
- Spacing/layout source: <path-or-link>
- Component library source: <path-or-link>
- Iconography/illustration source: <path-or-link>
- Motion system source: <path-or-link>

## Component Context
Must capture:
- shared/reusable primitives and major feature components
- purpose, key exports/APIs, dependencies, interaction risks
- targeted snippets with source path + line anchors

## Layout Context
Must capture:
- app/layout shells and ownership boundaries
- route/surface contracts
- risky geometry/safe-area/inset behavior
- targeted snippets with anchors

## Route Context
Must capture:
- route map: path, file, layout relation
- navigation contracts and ownership notes
- risky transitions and cross-surface openings

## Theme and Token Context
Must capture:
- tokens and design-system digest
- raw-value fidelity for global styles/config sources
- focused snippets with anchors

## Context Refresh Contract
- `init design context` or `init design md`: create/populate required context sections in `docs/DESIGN.md`.
- `update design context` or `update design md`: refresh context sections from current repo sources.
- Run only when explicitly requested.
- For iterative tasks, read relevant sections in `docs/DESIGN.md` first.

## Hybrid Context Format Rules
For each context entry include:
- path
- purpose/ownership
- key contracts and dependencies
- interaction risks
- targeted high-signal snippets with line anchors

Snippet guidance:
- 8-30 lines per snippet
- 3-8 snippets per high-value file entry
- pointer-only entries for low-risk boilerplate

## Agent Editing Policy
- Agents may update references, links, and verified constraints.
- Agents may update context sections in `docs/DESIGN.md` when explicitly requested.
- Agents must not redefine core visual language without approval from design owner.
- Large visual system rewrites require explicit sign-off.

## Validation Notes
- How to validate UI changes: <checklist or command>
- How to validate design token sync: <process/command>
- Accessibility baseline: <contrast/focus/target-size expectation>
