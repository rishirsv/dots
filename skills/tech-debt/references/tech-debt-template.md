# TECH-DEBT.md Template

Preserve the repo's existing format when it already has one. If no format exists, use this shape.

```markdown
# Tech Debt

Last reviewed: YYYY-MM-DD

This file tracks real cleanup opportunities discovered through code review. Keep entries focused on duplicate ownership, repeated implementation, wrong-owner behavior, shallow modules, leaky interfaces, or verification debt. Do not use this as a general wishlist.

## Review Notes

- Scope:
- Review guidance read:
- Skill/plugin lenses used:
- Review evidence:

## Queue

### 1. Item Title

**Status:** Introduced now | Expanded now | Exposed now | Existing

**Priority:** List order is priority; the top queue item is next.

**Where:** `path/or/module`

**What is wrong:** Concrete description of the ownership, duplication, interface, or verification problem.

**Why it matters:** Maintenance, product, correctness, velocity, or verification impact.

**Simplest useful fix:** Smallest useful refactor or verification improvement.

**Verification:** Tests, builds, manual checks, simulator/browser checks, or review evidence needed to prove the fix.

### 2. Shared Formatter Drift

**Status:** Exposed now

**Priority:** List order is priority; the top queue item is next.

**Where:** `Features/Progress/CompletedWorkoutDetailScreen.swift`, `Features/Home/HomeScreen.swift`

**What is wrong:** Workout readback formatting is partly owned by a screen file while sibling surfaces depend on the same labels.

**Why it matters:** The same workout can drift into different duration, set-count, or weight copy depending on the surface.

**Simplest useful fix:** Move shared readback formatting into a small readback-owned helper and keep screen-specific copy local.

**Verification:** Run the relevant feature tests and review the affected readback surfaces.

## Resolved

### YYYY-MM-DD - Item Title

Resolved, removed, or accepted as no longer actionable because...

## Intentionally Not Debt

- Rejected candidate and why future reviews should not re-suggest it.
```

## Status Vocabulary

- **Introduced now**: created by the current work.
- **Expanded now**: an existing pattern gained another variant or call site.
- **Exposed now**: already existed, but this review made it visible and actionable.
- **Existing**: longstanding debt not tied to current work.
- **Resolved**: completed, removed, or accepted as no longer actionable; move to `Resolved` or remove according to the repo convention.
