---
name: simplify
description: "Cleans up an already-implemented diff or existing implementation plan for reuse, simplification, efficiency, hard-cut posture, and ownership-depth issues, then applies same-scope behavior-preserving fixes. Explicit-only quality cleanup; not for correctness bug hunts, security audits, broad architecture scans, or new plan authoring."
---

# Simplify

Clean up changed code after implementation, or simplify an existing implementation plan after it has been drafted. If the invocation is read-only, perform the same review passes and report findings without editing. If subagents are unavailable, or this skill is being used inside a read-only reviewer, run the same three passes yourself before fixing or reporting.

Review all changed files or plan text for reuse, structural simplicity, AI-generated slop, quality, hard-cut posture, and efficiency. Fix any issues found while preserving the intended outcome unless the user explicitly asks for behavior changes.

For plans, default to hard-cut simplification: keep one canonical current path and remove legacy compatibility, fallbacks, shims, adapters, aliases, migration ladders, dual-shape support, and "just in case" branches unless the plan names a real external boundary.

Planning a new approach belongs to planning work; simplifying an existing plan belongs here.

## References

- Read [../ultra-review/references/finder-checklists.md](../ultra-review/references/finder-checklists.md) for the shared reuse and structural-simplification checklist used by Agent 1 below.
- Read [../architecture-review/references/hard-cut-policy.md](../architecture-review/references/hard-cut-policy.md) for the canonical hard-cut policy, hard rules, and exception rule.

## Phase 1: Identify Changes

If the user supplies, pastes, or names an implementation plan, spec, roadmap, or proposed approach, use that as the review target. If the plan is in a file and the user asks to simplify it, rewrite that file directly. If the plan is pasted in chat, return a simplified plan in chat.

Otherwise, run `git diff` (or `git diff HEAD` if there are staged changes) to see what changed. If there are no git changes, review the most recently modified files that the user mentioned or that you edited earlier in this conversation.

### Behavior Lock (optional deep cleanup only)

Activate this phase before cleanup edits when the user asks to deslop, clean up
AI output, apply fixes, pass a scoped file list, or perform behavior-adjacent
refactoring.

1. Identify the behavior that must not change in the target files.
2. Check whether existing tests cover that behavior, and run the narrowest useful
   tests when they exist.
3. If critical behavior is untested and the planned cleanup is behavior-adjacent,
   add the narrowest regression test first or report that the fix should wait.
4. Skip this phase for review-only work and for tiny cleanups already covered by
   targeted validation.

## Phase 2: Launch Three Review Agents in Parallel

Spawn subagents to launch all three review-only agents concurrently in a single message. Pass each agent the full diff so it has the complete context.

Tell each agent to use available skills, plugins, repo instructions, and repo review guidance when they apply to the changed code.

Do not begin fixing until all review agents have returned and their findings have been aggregated. For trivial single-hunk cleanups, one direct parent pass is acceptable; otherwise use the three-agent flow when subagents are available.

### Agent 1: Reuse and Structural Simplification Review

For each change, read the shared reuse and structural-simplification checklist
in
[../ultra-review/references/finder-checklists.md](../ultra-review/references/finder-checklists.md)
before flagging duplication, missed helpers, or a reframing that would delete
branches, modes, or concepts instead of moving them around.

**Plan simplification and hard cut**

1. **Flag compatibility work without a named external boundary**: legacy support, fallback paths, shims, aliases, adapters, migration ladders, dual-shape handling, or old-shape tests.
2. **Prefer one canonical path** over plans that support old and new behavior in parallel.
3. **Cut speculative future-proofing**: optional phases, generic extension points, duplicated validation gates, and abstractions that do not serve the current outcome.
4. **Collapse plan steps** when a single owner, current contract, or direct migration can replace several defensive phases.
5. **Keep any retained compatibility local to the real boundary** and require the plan to name that boundary explicitly.

**Ownership depth**

1. **Flag wrong-layer logic** added above or beside the mechanism that actually owns the concept.
2. **Flag feature-specific patches in shared paths**: conditions, flags, or branches that make shared infrastructure know about one caller or one workflow.
3. **Flag shallow wrappers**: new helpers, adapters, or modules that mostly pass through work while moving complexity sideways.
4. **Flag policy in plumbing**: business rules, repo policy, or product behavior encoded in generic utilities, transport code, configuration loading, or orchestration glue.
5. **Flag missed canonical owners**: changes that should generalize an existing owner, service, component, type, or helper instead of creating a parallel path.
6. **Flag leaky ownership boundaries**: callers reaching into another module's internals, duplicating invariants, or bypassing the module that should enforce them.

### Agent 2: AI Slop and Code Quality Review

Review the same changes for AI-generated slop and hacky patterns:

1. **Redundant state**: state that duplicates existing state, cached values that could be derived, observers/effects that could be direct calls.
2. **Parameter sprawl**: adding new parameters or booleans to a function instead of generalizing or restructuring existing ownership.
3. **Copy-paste with slight variation**: near-duplicate code blocks that should be unified with a shared abstraction or a simpler single flow.
4. **Leaky abstractions**: exposing internal details that should be encapsulated, or breaking existing abstraction boundaries.
5. **Stringly-typed code**: using raw strings where constants, enums (string unions), or branded types already exist in the codebase.
6. **Needless abstraction**: pass-through wrappers, single-use helper layers, identity helpers, speculative indirection, or generic mechanisms that hide a simple data shape.
7. **Over-defensive code**: try/catch around code that cannot throw, null checks on values that are never null, fallback defaults that can never trigger, and broad "just in case" guards that hide invariants.
8. **Verbose naming**: names that restate the type or context (`userDataObject`, `handleOnClickEvent`), or names padded with unnecessary qualifiers.
9. **Dead code / debug leftovers**: unused imports, unreachable branches, stale feature flags, `console.log` statements, commented-out code blocks, and abandoned TODO scaffolding.
10. **Unnecessary comments and narration**: comments that restate obvious code, explain what changed instead of why it must exist, or sound like implementation notes from an AI draft.
11. **Cast-heavy or loose contracts**: `any`, `unknown`, forced casts, unnecessary optionality, or ad-hoc object shapes used to bypass clear type boundaries.
12. **Boilerplate scaffolding**: placeholder helpers, generic adapters, empty extension points, or configuration surfaces that were added because they seem reusable but are not needed by the current design.
13. **Inconsistent local style**: code that ignores the surrounding file's naming, error handling, import organization, testing pattern, or component/module shape in a way that makes the change look pasted in.

For plan targets, also flag vague phases, fake risk sections, over-defensive compatibility, unnecessary abstractions, excessive "future-proofing", unclear owners, and validation work that does not prove the simplified current path.

### Agent 3: Efficiency Review

Review the same changes for efficiency:

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate network/API calls, N+1 patterns
2. **Missed concurrency**: independent operations run sequentially when they could run in parallel
3. **Hot-path bloat**: new blocking work added to startup or per-request/per-render hot paths
4. **Unnecessary existence checks**: pre-checking file/resource existence before operating (TOCTOU anti-pattern) - operate directly and handle the error
5. **Memory**: unbounded data structures, missing cleanup, event listener leaks
6. **Overly broad operations**: reading entire files when only a portion is needed, loading all items when filtering for one

For plan targets, look for fewer steps, fewer migrations, fewer gates, shorter validation paths, smaller rollouts, and independent work that can happen in parallel without changing the outcome.

## Phase 3: Fix Issues

Wait for all three agents to complete. Aggregate their findings and fix each issue directly. Prefer deleting complexity over rearranging it. If a finding is a false positive or not worth addressing, note it and move on - do not argue with the finding, just skip it.

Do not accept a change merely because tests pass if it leaves obvious AI slop, needless indirection, or a more tangled local design. If a structural cleanup is valid but too large to handle safely in the current pass, leave a short follow-up note with the exact scope.

For plan simplification, rewrite the plan directly when it is in scope. If a cut would change the intended outcome, require product judgment, or remove a compatibility path tied to a real external boundary, report the candidate cut instead of editing it.

After all fixes, run quality gates:

- Run the relevant subset of the project's test suite covering changed files
- Run lint if configured
- Run typecheck if configured
- Verify the diff is minimal and scoped - no unrelated changes crept in

## Explanation Style

Explain cleanup work for a smart non-engineer who understands the project but not coding terminology.
Start with the simple version: what was messy, what changed, and why it matters in practical terms.
Use plain English for technical ideas; if a term is necessary, define it in one short everyday sentence.
Prefer short paragraphs and concrete file references over dense engineering language or raw code.

When done, briefly summarize what was fixed (or confirm the code was already clean).

For plan simplification, report:

- `Simplified`: what got cut, collapsed, or moved to the owning step
- `Hard-cut decisions`: compatibility, fallback, shim, or migration paths removed or retained with reason
- `Deferred`: cuts that need user, product, or external-boundary judgment
- `Validation`: how the simplified plan should prove the current path works
