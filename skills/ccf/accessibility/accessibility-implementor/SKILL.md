---
name: accessibility-implementor
description: Implement accessibility improvements for React TypeScript UI using existing repository conventions. Use when asked to fix, audit, or apply accessibility requirements in code for semantics, keyboard support, focus management, labeling, ARIA, announcements, and minimal accessibility test coverage.
---

# Accessibility Implementor

## Purpose
Help Codex complete accessibility implementation work end-to-end by:
- applying a task-specific accessibility design or issue list in code
- keeping placement, behavior, and tests aligned with repository conventions
- relying on `../accessibility-common/SKILL.md` for the shared accessibility baseline instead of duplicating it here

## When to use this skill:
- The user wants accessibility issues fixed in code.
- The task includes an `## Accessibility Design (for implement-accessibility)` block to implement.
- The work needs accessibility-focused tests or verification in addition to code changes.

### Do NOT use this skill if:
- The user only wants an accessibility design/spec with no code changes.
- The task is broader feature implementation where accessibility is only a minor note and another implementation skill should lead.
- The work is not about UI accessibility behavior.

## Inputs

- A `## Accessibility Design (for implement-accessibility)` block when available.
- Or a list of known issues, audit findings, user-reported problems, or acceptance criteria.
- Access to the target files and nearby tests.

## Workflow

1. Read `../accessibility-common/SKILL.md` and apply its shared accessibility checklist.
2. Read files in `ui-references/` as needed for placement and repository conventions.
3. Determine the smallest correct placement for the fix:
   - patch the owning component or page first
   - update a shared primitive only when the repository already centralizes that behavior and multiple consumers benefit
4. Mirror local file organization and export patterns.
5. Implement only the task-specific accessibility changes required by the design or issue list.
6. Add or update focused tests when the repository has test coverage in that area.
7. Verify the affected behaviors with role/name queries, keyboard paths, focus handling, and state announcements where applicable.

## Output Format

When implementing, return:

1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for placement, accessibility behavior, and tests

## Guardrails

1. Do not repeat the shared baseline from `../accessibility-common/SKILL.md`; apply it through the implementation.
2. Do not remove existing business behavior while fixing accessibility.
3. Do not introduce new dependencies unless explicitly requested.
4. Do not create shared utilities or abstractions "just in case."
5. Keep changes minimal, testable, and directly tied to the scoped accessibility need.
