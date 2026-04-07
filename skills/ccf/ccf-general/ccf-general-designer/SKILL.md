---
name: ccf-general-designer
description: Use for repository-aware design work in this monorepo when Codex must translate shared repository and development-flavor rules into concrete placement, boundary, reuse, and dependency decisions without writing code.
---

# CCF General Designer

## Purpose
Help Codex complete repository-aware design work by:
- turning shared CCF repository rules into concrete design constraints and placement decisions
- clarifying allowed reuse, dependency, and boundary choices before implementation begins
- relying on `../ccf-general-common/SKILL.md` for shared rules instead of repeating them here

## When to use this skill:
- The user wants a design, plan, or architecture decision for work in this monorepo without immediate code changes.
- Another designer skill needs repository-specific placement, dependency, or boundary guidance.
- Codex must decide how a proposed change fits the CCF structure before handing work to implementation.

### Do NOT use this skill if:
- The user wants code changes, refactors, or validation rather than design work.
- The task is outside this repository.
- A narrower designer skill already covers the work and no additional CCF-wide constraint is needed.

## Inputs

- The scoped design request, feature description, or planning artifact.
- The affected apps, services, libraries, or documents when known.
- Any requested exceptions around structure, dependencies, or shared-library reuse.

## Output Format

This skill does not define a standalone artifact. It adds repository-specific design decisions to the deliverable required by the active task.

## Workflow

1. Read `../ccf-general-common/SKILL.md`, resolve the active development flavor, and apply those repository rules before making design decisions.
2. Map the request to the existing monorepo layout and state where each piece of work should live.
3. Identify which existing shared libraries, shared UI components, or local patterns should be reused instead of introducing new structures.
4. In `Builder` mode, prefer designs that Codex can generate, run, and test locally where practical. Do not force Azure-specific wrappers or deployment-owned services when a project-local or otherwise locally runnable design can satisfy the task.
5. When the design changes persistence schema or persisted-document structure, record `docs/db-model.md` as the schema source of truth instead of placing that document under `lib/`.
6. When the design changes deployable resources or requires bootstrap seed data in the chosen implementation path, record `docs/deploy_plan.md` as the owner for those requirements. If required seed values are not yet available, still define a canonical placeholder section there that explains what the operator must supply.
7. When the design reuses a shared library with runtime configuration requirements, explicitly call out that implementation must verify and document the exact active-path dependency subset in `docs/deploy_plan.md`; do not assume the library's full config surface is present in runtime.
8. Distinguish between:
   - new feature-owned configuration introduced by the design
   - reused shared-library configuration that is still mandatory for the feature path to operate
9. For each documented runtime dependency, require implementation to classify it as `Mandatory` or `Optional`, where `Optional` is allowed only when the active code path provides a concrete default.
10. In `Builder` mode, when an LLM provider is needed and the task does not already fix one, prefer the official OpenAI platform / ChatGPT ecosystem over Azure OpenAI-specific wrappers.
11. Call out any requested exception that would need explicit approval, including:
   - new top-level folders
   - new shared libraries
   - new dependencies
   - license exceptions
12. Translate implementation-sensitive repository rules into design constraints and acceptance criteria without turning the result into a file-by-file patch plan.

## Guardrails

- Do not restate the common repository rules; reference them through design decisions.
- Do not prescribe unauthorized structure changes as if they were already approved.
- Do not turn repository-aware design work into implementation steps unless the user explicitly asks for that level of detail.
- Do not design runtime provisioning hooks when `docs/deploy_plan.md` should own the deployment requirement.
- Do not defer required seed structure exclusively to a side template when `docs/deploy_plan.md` should hold the canonical fillable record.
- Do not treat reused shared-library runtime configuration as out of scope for deployment design just because the feature did not invent the key names.
- In `Builder` mode, do not mark work blocked solely because a strict CCF guideline cannot be followed if a locally runnable and testable design exists within repository boundaries.
