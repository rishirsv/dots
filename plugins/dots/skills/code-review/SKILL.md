---
name: code-review
description: "Use $code-review to review or audit current changes, branches, PRs, plans, or specs. Reviews and fixes current work; reports on standalone or historical scopes; writes report-only audits. Not for blank-slate planning, architecture-first discovery, PR publication, or external review comments."
---

# Code Review

Review the selected scope against its intent, governing repository standards,
correctness, and simplest sound implementation. Keep findings and edits inside
that scope.

Every changed-code review uses the **Simplify process**. The parent runs Intent
and Scope Conformance, Repository Standards Review, and Correctness Review.
When subagents are available, launch three independent reviews in parallel:

- **Simplify Agent 1: Reuse Review**
- **Simplify Agent 2: Quality Review**
- **Simplify Agent 3: Efficiency Review**

The parent verifies their candidates, fixes or reports the combined result, and
validates the final state. Review depth may add scrutiny; it never removes the
three Simplify reviews.

## Choose The Route

- **Current changes — default after coding**: run the Simplify process over the
  complete local change, fix every Confirmed issue, validate the result, and
  finish the coding task.
- **Standalone review**: report on a named PR, branch, base, commit, range, or
  historical path. Make fixes only when the user requests them and the writable
  scope is clear.
- **Plan or spec review**: report on the supplied artifact. Do not rewrite it,
  create a replacement plan, or implement it.
- **Audit**: read [Audit Mode](references/audit-mode.md), write its required
  report, and stop without implementing findings.

Explicit `report-only` language overrides the current-changes default. An open
PR supplies context; it does not authorize comments, publication, or edits.

## 1. Capture Scope And Authorities

Read applicable repository instructions before judging the work. Capture one
target:

- **Current changes**: inspect `git status --short --untracked-files=all`, the
  staged diff, and the unstaged diff. Include untracked source files.
- **Named PR**: use only the PR diff. Exclude unrelated working-tree changes and
  read the PR metadata for intent.
- **Named branch, base, commit, or range**: resolve every ref, record the diff
  command and changed commits, and use the merge base for branch comparisons.
- **Named paths**: use them to narrow the selected current or historical scope;
  do not substitute another range.

For a post-coding review with no git changes, review the files edited or named
earlier in the task. For any other empty scope, report that it is empty.

Capture two authority sets:

1. **Intent**: prefer the current user request and task context, then an
   explicitly supplied plan or spec, then the PR body or referenced issue. Use
   nearby docs only when they clearly govern the change. If intent is missing,
   state the evidence limit and continue without inventing requirements.
2. **Standards**: collect applicable repository instructions, contributor or
   review guidance, and path-scoped module docs. More specific repository
   guidance overrides broader guidance; explicit user and task requirements
   remain higher authority.

Review every changed file. Read the full file and direct callers, callees,
tests, or existing owners when the finding depends on surrounding behavior.
Do not turn unchanged code into a cleanup target unless a changed line requires
the supporting edit.

## 2. Run The Review Process

Read [Review Checklists](references/review-checklists.md) for every code, plan,
or spec review.

For every changed-code review:

1. The parent runs Intent and Scope Conformance, Repository Standards Review,
   and Correctness Review.
2. Launch Simplify Agent 1: Reuse Review, Simplify Agent 2: Quality Review, and
   Simplify Agent 3: Efficiency Review concurrently when subagents are
   available. Give each the exact scope, complete diff, changed-file list,
   authorities, allowed surrounding paths, and user focus.
3. If subagents are unavailable, the parent runs all three Simplify reviews
   directly and keeps their candidate sets distinct. No Simplify review may be
   skipped.

For plans and specs, apply Intent and Scope Conformance, Repository Standards
Review, Correctness Review, Quality Review, and the Over-Engineering Scan to
decisions, requirements, and contracts. Skip code-specific checks that cannot
apply.

Aggressively scan every scope for over-engineering: added indirection,
optionality, generality, state, configuration, compatibility, or ceremony that
has no current requirement or necessary invariant and creates a concrete
maintenance, runtime, or review cost. Keep the scan broad and the finding bar
evidence-based.

Choose review depth independently from the route:

- **Direct — default**: run the parent reviews and the three Simplify reviews.
- **Deep**: run the same default process, then add independent correctness,
  intent, or risk finders and fresh candidate verification for broad diffs,
  explicit exhaustive requests, repeated misses, or high-risk behavior such as
  auth, billing, security, concurrency, persisted state, migrations, or cross-
  process contracts.

If the user explicitly requests independent reviewers and subagents are
unavailable, state that independence cannot be provided. Weight a user-named
focus heavily without ignoring other material in-scope issues.

Report only material issues. Reject pre-existing problems, intentional changes,
unsupported concerns, duplicates, and style preferences without concrete cost.
Treat deterministic lint, formatting, type, build, and test failures as
validation results unless they reveal a deeper defect. A clean review needs no
finding quota.

## 3. Verify And Classify

Finders return candidates, not edits. In Deep review, use a fresh verifier for
every high-impact or uncertain candidate. The parent opens the cited source,
merges duplicates, and classifies each candidate:

- **Confirmed**: positive evidence establishes a reachable failure, unmet
  requirement, governing-standard breach, or concrete maintenance/runtime cost.
- **Needs verification**: the concern is plausible, but a runtime,
  configuration, data-shape, product, or authority fact is missing. Name the
  exact check that would resolve it.
- **Rejected**: the issue is pre-existing, intentional, impossible, already
  handled, duplicated, tool-only, stylistic, or not worth changing.

Not disproven is `Needs verification`, not `Confirmed`. Do not reject a rare
but reachable state merely because the common path avoids it; reject only when
the code, types, guards, or governing contract prove the candidate wrong.
Never present Rejected candidates as findings.

## 4. Act On The Route

For current changes or an explicitly authorized fix:

1. Name the behavior that must remain true and the narrowest proof for it.
2. Run a baseline when the correction could change behavior. If critical
   behavior lacks proof, add the narrowest characterization test or classify
   the candidate as `Needs verification`.
3. Fix every Confirmed issue with the smallest behavior-preserving change.
4. Keep edits in the parent unless delegated writes have isolated, disjoint
   scopes.

Use a hard cut only when the canonical contract is established and the old path
is confirmed obsolete. Otherwise classify compatibility removal as
`Needs verification`. Once eligible, read
[Hard-Cut Policy](../../references/hard-cut-policy.md).

For report-only and plan/spec reviews, return findings without editing. For an
audit, follow Audit Mode; its report is the only permitted write.

## 5. Validate And Return

After fixes, run the narrowest relevant tests, typecheck, lint, or build.
Inspect the final diff for unintended changes and rerun the parent or Simplify
review responsible for each material edit. For report-only work, run checks
only when they can confirm a material candidate. Audit checks must be read-only
and side-effect free.

For a completed fix route, report:

- `Fixed`
- `Skipped`, limited to false positives or changes not worth making
- `Needs verification`
- `Validation`
- `Residual risk`, only when material

If nothing needed fixing, name the reviewed scope and confirm that Intent and
Scope Conformance, Repository Standards Review, Correctness Review, and all
three Simplify reviews were clean.

For report-only code, plan, or spec review, order Confirmed findings by severity:
P0 blocker, P1 high, P2 medium, P3 low. Use:

```markdown
### [P1] One-sentence issue — <location>

- **Evidence and mechanism:** cited code and any governing requirement or rule.
- **Failure scenario or cost:** reachable impact.
- **Smallest safe fix:** direct correction.
```

List `Needs verification` separately. If clean, state the reviewed scope and
say `no findings confirmed`. Audit Mode owns its report format and chat handoff.
Post inline or pull-request comments only when the user explicitly asks.
