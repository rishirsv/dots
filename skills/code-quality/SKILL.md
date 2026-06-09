---
name: code-quality
description: "Use when improving code quality through one of three lanes: simplifying the current diff, recent edits, scoped files, deslop, or generated-code cleanup; hard-cutting fallback, compatibility, migration, adapter, coercion, alias, legacy, or dual-shape paths to one canonical shape; or recording tracker-first architecture-refinement findings without editing problem code. Not for adversarial PR review as the primary workflow, debugging, or agent-readiness assessment."
---

# Code Quality

Improve code quality without blurring simplification, hard-cut refactors, and architecture-tracking work. Pick one lane from the user's wording and stay inside it.

## Lane Selection

- `simplify`: default for "simplify," "deslop," or current-diff quality work. Mutates code when useful.
- `hard-cut`: use when removing compatibility, fallback, migration, adapter, coercion, alias, legacy, or dual-shape code. Mutates code and applies [hard-cut](references/hard-cut.md).
- `architecture-refinement`: use when the user asks to refine/improve codebase architecture, scan for architecture debt, find module-deepening opportunities, or record tech-debt follow-ups. Does not edit the problem code; records actionable findings in the repo-native tracker using [architecture-refinement](references/architecture-refinement.md).

Choose by intent, not keyword alone. Removing old-shape compatibility now is `hard-cut`; assessing seam or module quality or recording follow-up debt is `architecture-refinement`.

If simplify discovers fallback, compatibility, migration, adapter, coercion, alias, legacy, or dual-shape handling in the scoped code, apply the hard-cut rules to that part of the edit unless a real external compatibility boundary exists.

If the user asks for a read-only review, report findings only. If the user asks for fixes or simplification, implement the relevant lane.

## Delegation

After this skill writes code in the simplify or hard-cut lane, delegate a
focused follow-up reflow by default when the user invoked only Code Quality and
did not explicitly name another reviewer or workflow. Use the
`meta-skill:skill-doctor` subagent as the default reflow path: give it the
changed files, the lane used, the intended behavior, and the validation already
run, then apply only fixes that are clearly in scope for the Code Quality
request. Skip this delegation for read-only review and architecture-refinement
work unless the user explicitly asks for it.

## Simplify Lane

Use [simplify](references/simplify.md). Review changed or scoped files for clarity, reuse, structural simplicity, AI-generated code slop, quality, and efficiency. Mutate code when the user wants cleanup or fixes; stay read-only when the user asks for review.

## Hard-Cut Lane

Use [hard-cut](references/hard-cut.md). Keep one current canonical codepath. Remove old-shape handling instead of preserving, translating, or policing it unless a real external compatibility boundary exists. After edits, run the narrow validation that proves the canonical path still works when an obvious command exists.

## Architecture-Refinement Lane

Use [architecture-refinement](references/architecture-refinement.md). This lane is tracker-first and no-edit by default: scan autonomously, find actionable module-deepening and code-quality opportunities, and record them in the repo-native tracker.

## Output

For simplify or hard-cut work, summarize:

- What was simplified or cut.
- Files changed.
- Behavior preserved or intentionally changed.
- Validation run.
- Any follow-up that was intentionally left out of scope.

For architecture refinement, summarize:

- Tracker path updated.
- Entries added, merged, skipped, or downgraded.
- Top recommendation.
- Areas scanned and intentionally left unscanned.

Do not claim architecture fixes were made when the architecture-refinement lane only recorded opportunities.
