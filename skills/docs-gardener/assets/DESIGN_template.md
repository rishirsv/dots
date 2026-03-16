# DESIGN.md

## Purpose
Design operating contract for this repo: source of truth, system map, visual-language boundaries, and review-surface guidance.

## Design / Frontend Boundary
- `docs/DESIGN.md` owns visual language, token semantics, primitive intent, material recipes, typography, and canonical design review surfaces.
- `docs/FRONTEND.md` owns runtime behavior, route ownership, navigation APIs, async/loading rules, and release-gating verification loops.
- Do not duplicate canonical routing, behavior, or test-command guidance here unless the visual system cannot be understood without a short pointer.

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
- design-relevant app/layout shell composition
- only the route/surface constraints that materially affect visual composition
- risky geometry/safe-area/inset behavior
- targeted snippets with anchors

## Route Context
Must capture:
- route map: path, file, layout relation
- only the navigation constraints that materially affect design review or surface composition
- pointers to `docs/FRONTEND.md` for canonical ownership/runtime rules

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
- Visual-review baseline: <design scan / workspace check / screenshot check>
- How to validate design token sync: <process/command>
- Accessibility baseline: <contrast/focus/target-size expectation>
