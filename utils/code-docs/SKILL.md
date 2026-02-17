---
name: code-docs
description: Create or update canonical docs structure, policy docs, and reference docs.
---

# Code Docs

## Objective
Create or update repository documentation using canonical structure and naming.

Architecture docs must follow a high-signal pattern:
- bird's-eye view,
- codemap by major modules,
- explicit architectural invariants,
- clear boundaries and cross-cutting concerns.

## Scope
This skill manages:
- root docs (`AGENTS.md`, `ARCHITECTURE.md`, `TODOS.md`, `ISSUES.md`)
- docs policy/reference docs
- docs structure/index files
- solution knowledge docs (optional, when explicitly requested)

This skill does not own execution of feature code changes.

## Hard Rules
- Edit docs only (`.md`, `.txt`) unless user says otherwise.
- Do not modify source code/tests/config/dependencies.
- Create files only when user asks.
- Use canonical names/paths by default.
- Do not create legacy alias paths.

## Canonical Paths
Root:
- `AGENTS.md`
- `ARCHITECTURE.md`
- `TODOS.md`
- `ISSUES.md`

`docs/`:
- `docs/README.md`
- `docs/DESIGN.md`
- `docs/FRONTEND.md`
- `docs/PLANS.md`
- `docs/PRODUCT_SENSE.md`
- `docs/RELIABILITY.md`
- `docs/SECURITY.md`
- `docs/DB-SCHEMA.md`
- `docs/design-docs/index.md`
- `docs/design-docs/core-beliefs.md`
- `docs/product-specs/*`
- `docs/exec-plans/active/*`
- `docs/exec-plans/completed/*`
- `docs/exec-plans/tech-debt-tracker.md`
- `docs/references/*`
- `docs/research/*`
- `docs/artifacts/*`

## Feature Lifecycle Reference (do not generate by default)
- Spec: `docs/product-specs/<feature-slug>-spec.md`
- Active plan: `docs/exec-plans/active/<feature-slug>-plan.md`
- Completed plan: `docs/exec-plans/completed/<feature-slug>-plan.md`

## Structure Confirmation
If repository structure choice is not explicit, ask:
- "Use canonical docs structure (`AGENTS.md`, `ARCHITECTURE.md`, `TODOS.md`, `ISSUES.md` + `docs/*`) for this repo?"

## Defaults
- If user provides path, use it.
- If user provides doc type only, use canonical path.
- Preserve existing structure/tone unless user asks for rewrite.

Solution-doc default path (optional):
- `docs/solutions/<solution-slug>.md`

## Issues Handling
- Use `ISSUES.md` as single issue registry.
- Append issue blocks using `assets/issue_template.md` format.
- Do not create per-issue files unless explicitly requested.

## Solution Handling
- Use `assets/solution_template.md` for solved-problem runbooks.
- A solution doc records stable diagnosis/fix knowledge.
- It does not replace issue intake (`ISSUES.md`) or execution planning lifecycle (`docs/exec-plans/*`).

## Assets
| Document Type | Asset | Canonical Path |
|---|---|---|
| README | `assets/README_template.md` | `README.md` |
| Repo guidelines | `assets/AGENTS_template.md` | `AGENTS.md` |
| Architecture | `assets/ARCHITECTURE_template.md` | `ARCHITECTURE.md` |
| Todos | `assets/TODOS_template.md` | `TODOS.md` |
| Issues registry | `assets/ISSUES_template.md` + `assets/issue_template.md` | `ISSUES.md` |
| Design policy | `assets/DESIGN_template.md` | `docs/DESIGN.md` |
| Frontend policy | `assets/FRONTEND_template.md` | `docs/FRONTEND.md` |
| Plans rules | `assets/PLANS_template.md` | `docs/PLANS.md` |
| Product sense | `assets/PRODUCT_SENSE_template.md` | `docs/PRODUCT_SENSE.md` |
| Reliability policy | `assets/RELIABILITY_template.md` | `docs/RELIABILITY.md` |
| Security policy | `assets/SECURITY_template.md` | `docs/SECURITY.md` |
| DB schema digest | `assets/DB-SCHEMA_template.md` | `docs/DB-SCHEMA.md` |
| Design docs index | `assets/design-docs_index_template.md` | `docs/design-docs/index.md` |
| Core beliefs | `assets/core-beliefs_template.md` | `docs/design-docs/core-beliefs.md` |
| Tech debt tracker | `assets/tech-debt-tracker_template.md` | `docs/exec-plans/tech-debt-tracker.md` |
| Solution runbook (optional) | `assets/solution_template.md` | `docs/solutions/<solution-slug>.md` |

## Workflow
1. Confirm requested docs and scope.
2. Discover existing conventions in repo docs.
3. Apply matching assets to requested targets.
4. Keep docs concise and path-anchored.
5. Return save summary (paths only).
