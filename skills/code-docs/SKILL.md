---
name: code-docs
description: "Create or update code related documentation and product specs."
---

# Code Docs

## Objective

Create or update repository documentation using canonical structure and naming. Keep docs agent-legible, layered, and mechanically verifiable.

## Scope

Use this skill when:

- root docs (`AGENTS.md`, `ARCHITECTURE.md`, `TODOS.md`)
- docs policy/reference docs and index files
- product specs (`docs/product-specs/*`) for planning and post-implementation documentation
- project specs (`docs/project-specs/*`) for system/service-level specification work
- execution planning docs (`docs/exec-plans/*`)
- solution knowledge docs (optional, when explicitly requested)

This skill does not own execution of feature code changes. It can inspect source code to document behavior and contracts.
Do not use this when updating any docs, only the above scope.

## Hard Rules

- Edit docs only (`.md`, `.txt`) unless user says otherwise.
- Do not modify source code/tests/config/dependencies.
- Create files only when user asks, except when updating an existing scaffold where matching index links are required.
- Use canonical names/paths by default.
- Do not create legacy alias paths.
- Treat `docs/DESIGN.md` as the canonical, consolidated design context file; do not create `.design/` context folders unless the user explicitly asks.
- Ground implementation-derived content in repository evidence; avoid guessing.
- Do not include looks-real product specifics in templates. Use placeholders unless explicitly marked as examples.
- Respect layered instruction ecosystems:
  - If repo already uses `CLAUDE.md` and/or `.github/copilot-instructions.md`, do not create competing guidance by default.
  - If nested `AGENTS.md` files exist, preserve precedence and keep root guidance high-level.
- For canonical docs/specs, use metadata frontmatter fields:
  - `status`
  - `last-reviewed`
  - `review-cycle-days`
  - `source-of-truth`
  - `verification-state`

## Canonical Paths (when scaffolding exists)

Root:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `TODOS.md`

`docs/`:

- `docs/README.md`
- `docs/ISSUES.md`
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
- `docs/project-specs/*`
- `docs/exec-plans/active/*`
- `docs/exec-plans/completed/*`
- `docs/exec-plans/tech-debt-tracker.md`
- `docs/references/*`
- `docs/research/*`
- `docs/artifacts/*`

## Defaults

- If user provides path, use it.
- If user provides doc type only, use canonical path when scaffold exists.
- If scaffold is absent, do not force-create missing files; keep requested docs self-contained.
- Preserve existing structure and tone unless user asks for rewrite.

## Metadata Semantics

- `status`: `draft` | `active` | `deprecated`
- `verification-state`: `unverified` | `partially-verified` | `verified`
- A doc marked `verification-state: verified` must include at least one concrete verification method.

## Scaffolding-Aware AGENTS Behavior

When creating/updating `AGENTS.md`:

1. Detect if full scaffolding exists.
2. If scaffolding exists, include a concise table of contents with valid links.
3. If scaffolding does not exist, keep `AGENTS.md` standalone and add optional suggested docs as recommendations only.
4. Never require missing files unless the user explicitly asks to create them.

## Issues Handling

- Use `docs/ISSUES.md` as single issue registry by default.
- Append issue blocks using `assets/issue-block_template.md` format.
- Create per-issue files only when explicitly requested, using `assets/issue-file_template.md`.

## Product Specs Handling

- Canonical path: `docs/product-specs/<feature-slug>-spec.md`.
- Default structure: `assets/product-spec_template.md`.
- Prefer updating an existing spec for the same feature instead of creating duplicates.
- Do not invoke explore agents/subagents for product specs; explore directly in the current session.
- Support both modes:
  - Planning mode: document intended behavior, boundaries, and acceptance criteria.
  - Post-implementation mode: inspect already-shipped feature code and docs, then document as-built behavior and scope/contracts.
- For post-implementation specs, explore before writing:
  1. Identify entry routes/screens/commands and owner modules.
  2. Identify user-visible behavior, constraints, and non-goals from implementation.
  3. Identify distinctive/unique feature behaviors across the application.
  4. Map requirements and acceptance criteria to shipped behavior and note mismatches.
  5. Record references to relevant code and docs paths.
- If evidence is incomplete, state missing evidence explicitly in `Assumptions` or `Context`.
- Keep specs concise and decision-oriented.

## Project Specs Handling

- Canonical path: `docs/project-specs/<project-slug>-spec.md`.
- Default structure: `assets/project-spec_template.md`.
- Use this when the user requests a project/service/system specification (architecture, operations, integrations, and validation strategy), not a single feature spec.
- Keep placeholders until concrete project inputs are provided.
- Preserve the full spec shape from the template (problem statement, goals/non-goals, domain model, workflow/config contracts, failure model, validation matrix, implementation checklist).
- If implementation-derived evidence is incomplete, call it out explicitly instead of guessing.

## Assets

| Document Type                                   | Asset                                  | Canonical Path                                  |
| ----------------------------------------------- | -------------------------------------- | ----------------------------------------------- |
| README                                          | `assets/README_template.md`            | `README.md`                                     |
| Repo guidelines                                 | `assets/AGENTS_template.md`            | `AGENTS.md`                                     |
| Architecture                                    | `assets/ARCHITECTURE_template.md`      | `ARCHITECTURE.md`                               |
| Todos                                           | `assets/TODOS_template.md`             | `TODOS.md`                                      |
| Docs index                                      | `assets/docs-README_template.md`       | `docs/README.md`                                |
| Issues registry                                 | `assets/ISSUES_template.md`            | `docs/ISSUES.md`                                |
| Issue block                                     | `assets/issue-block_template.md`       | append to `docs/ISSUES.md`                      |
| Per-issue file (optional)                       | `assets/issue-file_template.md`        | `docs/issues/<id>.md`                           |
| Design policy placeholder                       | `assets/DESIGN_template.md`            | `docs/DESIGN.md`                                |
| Frontend contracts                              | `assets/FRONTEND_template.md`          | `docs/FRONTEND.md`                              |
| Plans rules                                     | `assets/PLANS_template.md`             | `docs/PLANS.md`                                 |
| Exec plan file                                  | `assets/exec-plan_template.md`         | `docs/exec-plans/active/<feature-slug>-plan.md` |
| Product sense                                   | `assets/PRODUCT_SENSE_template.md`     | `docs/PRODUCT_SENSE.md`                         |
| Reliability policy                              | `assets/RELIABILITY_template.md`       | `docs/RELIABILITY.md`                           |
| Security policy                                 | `assets/SECURITY_template.md`          | `docs/SECURITY.md`                              |
| DB schema digest                                | `assets/DB-SCHEMA_template.md`         | `docs/DB-SCHEMA.md`                             |
| Design docs index                               | `assets/design-docs_index_template.md` | `docs/design-docs/index.md`                     |
| Core beliefs                                    | `assets/core-beliefs_template.md`      | `docs/design-docs/core-beliefs.md`              |
| Product spec (ideate-aligned, as-built capable) | `assets/product-spec_template.md`      | `docs/product-specs/<feature-slug>-spec.md`     |
| Project spec (system/service-level)             | `assets/project-spec_template.md`      | `docs/project-specs/<project-slug>-spec.md`     |
| Tech debt tracker                               | `assets/tech-debt-tracker_template.md` | `docs/exec-plans/tech-debt-tracker.md`          |
| Solution runbook (optional)                     | `assets/solution_template.md`          | `docs/solutions/<solution-slug>.md`             |

## Workflow

1. Confirm requested docs and scope.
2. Discover existing conventions and detect scaffolding/layered instruction files.
3. Select matching assets.
4. Apply assets with required metadata and path-anchored references.
5. Ensure quality checks are represented (verification method, ownership, next actions).
6. Return save summary (paths only).
