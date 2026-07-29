---
name: code-review
description: "Use $code-review to review current changes or a named branch, commit, range, or pull request; verify concrete findings, fix authorized local changes, and publish PR review comments. Not for repository-wide audits, blank-slate planning, or architecture-first discovery."
---

# Code Review

Review the selected scope against its intent, governing repository standards,
correctness, and simplest sound implementation. Keep findings and edits inside
that scope.

Review current changes by default after coding, or review the standalone target
the user names.

The parent establishes scope, reviews the complete change, verifies each
candidate, then fixes or reports confirmed findings.

Explicit `report-only` language overrides the current-changes default. A PR
review publishes its verified result through GitHub unless the user says
`report-only`, `no comments`, or equivalent. It does not authorize code edits,
merges, or other PR changes.

## 1. Scope And Authority

1. Read and follow applicable repository instructions, including `AGENTS.md`
   and `CLAUDE.md`. Use the current request and the target's PR or issue, when
   relevant, to establish intent. Do not invent missing requirements.
2. Resolve the requested target. Inspect its complete diff and enough
   surrounding code to understand every changed path.
3. Find concrete regressions introduced by the change. Continue through the
   complete diff after finding the first issue.
4. Check relevant tests and call sites to confirm that each finding is real and
   actionable.

Current changes include staged, unstaged, and untracked files. When a
post-coding worktree is clean, review the files edited or named in the task.
Keep unrelated worktree changes outside a named PR, branch, commit, or range.

For a base-branch review, inspect the changes that would actually merge. Use the
branch's configured upstream when it exists and is ahead of the local branch;
otherwise use the local branch. Compute `git merge-base HEAD <comparison-ref>`
and inspect `git diff <merge-base-sha>`. If the local branch cannot be resolved,
try its configured upstream explicitly before reporting the target unavailable.

Keep a finding only when all of these are true:

- It meaningfully affects correctness, security, performance, or
  maintainability.
- It is discrete and actionable.
- It was introduced by the reviewed change.
- Its affected scenario or call path can be demonstrated from the code.
- The author would probably fix it if they knew about it.

### Review Context

Resolve the target once. Give each reviewer the same target, changed-file list,
intent, and applicable repository instructions. Let each reviewer inspect only
the diff hunks and surrounding source its assigned review needs; do not copy the
complete diff into every prompt.

Reviewers return candidates, not edits or file dumps. Return `no findings` when
clean. Each candidate includes:

- file and line;
- the issue;
- the demonstrated scenario, call path, or concrete cost;
- the smallest safe correction; and
- the governing requirement when one applies.

The parent verifies every candidate before reporting or fixing it.

## 2. Review The Change

For an ordinary review, the parent inspects the complete change in one coherent
pass. Check correctness on every review. Apply the reuse and efficiency lenses
when the changed code makes them relevant:

- **Reuse and simplification:** duplicated behavior, unnecessary state,
  misplaced ownership, abstraction, compatibility machinery, or configuration.
- **Efficiency:** repeated work, hot paths, concurrency, resource lifetime, or
  atomicity.

Use independent reviewers when the user requests them or the change is broad,
exhaustive, repeatedly missed, or high-risk. Give each reviewer a bounded lens
and only the relevant review context. Use:

- [Correctness](references/lane-correctness.md) for reachable regressions,
  removed behavior, affected contracts, and framework-specific hazards.
- [Reuse](references/lane-reuse.md) when ownership, duplication, state, API
  shape, or over-engineering is material.
- [Efficiency](references/lane-efficiency.md) when the change affects work,
  concurrency, resources, or atomicity.

Add an adversarial correctness reviewer only for authentication, permissions,
security boundaries, persisted state, irreversible operations, concurrency, or
migrations.

If independent reviewers are unavailable, continue with one parent review.
Mention the limitation only when the user explicitly requested independent
reviewers.

### Other Scopes

For **plans and specs**, apply Intent and Scope Conformance, Repository
Standards Review, the Reuse lane, and the correctness angles that can apply to
decisions, requirements, and contracts. Skip code-specific checks.

Report only material issues. Reject pre-existing problems, intentional changes,
unsupported concerns, duplicates, and style preferences without concrete cost.
Treat deterministic lint, formatting, type, build, and test failures as
validation results unless they reveal a deeper defect. A clean review needs no
finding quota.

## 3. Verify And Classify

Deduplicate candidates by defect, location, and mechanism. Keep the version
with the clearest demonstrated failure.

For an ordinary review, the parent verifies each candidate against the diff,
surrounding source, relevant call sites or tests, and governing instructions.

For a deep review or high-risk change, launch fresh verifier subagents in
parallel. Give each verifier:

- the PR title and description, or the target's stated intent;
- one unique candidate and its relevant diff and source;
- any cited repository instruction and the evidence that it applies; and
- the finding requirements from Scope And Authority.

The verifier's only job is to confirm or reject the candidate with evidence and
high confidence. It does not find new issues or edit code. Use a high-reasoning
verifier for bugs and logic, and a faster medium-reasoning verifier for
instruction scope and compliance. Group candidates only when they describe the
same issue at the same location. Filter out every candidate that a verifier
does not confirm.

Classify each candidate:

- **Confirmed**: positive evidence establishes a reachable failure, unmet
  requirement, governing-standard breach, or concrete maintenance/runtime cost.
- **Needs verification**: the concern is plausible, but a runtime,
  configuration, data-shape, product, or authority fact is missing. Name the
  exact check that would resolve it. Do not publish it as a finding.
- **Rejected**: the issue is pre-existing, intentional, impossible, already
  handled, duplicated, tool-only, stylistic, or not worth changing.

Not disproven is `Needs verification`, not `Confirmed`. Do not reject a rare
but reachable state merely because the common path avoids it; reject only when
the code, types, guards, or governing contract prove the candidate wrong.
Never present Rejected candidates as findings.

Do not flag pre-existing or correct behavior, pedantic nits, linter-only
failures, explicitly silenced rules, or generic quality, test, or security
advice without a concrete changed-code failure.

## 4. Publish A PR Review

For a PR target, first summarize the verified result in the current session.
Stop without publishing when the user said `report-only`, `no comments`, or
equivalent.

If no findings were confirmed, post one summary comment with `gh pr comment`:

```markdown
**Code review**
No issues found. Checked for bugs and applicable AGENTS.md/CLAUDE.md compliance.
```

If findings were confirmed:

1. Privately inspect the final comment list and remove duplicates.
2. Post one inline review comment per unique Confirmed issue. Use the available
   GitHub inline-review capability; if none is available, use `gh api`. Do not
   use web fetch to interact with GitHub.
3. Briefly describe the issue and its demonstrated impact. Link cited code and
   any violated repository instruction.
4. Include a committable suggestion only when a change of at most five lines
   fixes the issue completely. For larger, structural, multi-location, or
   follow-up-dependent fixes, describe the correction without a suggestion.

Every code link must be a GitHub permalink for the reviewed repository using
the full commit SHA and `#L<start>-L<end>`. Include at least one context line
before and after the affected lines. Never post a duplicate or an unconfirmed
finding.

## 5. Act On The Route

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

For report-only and plan/spec reviews, return findings without editing.

## 6. Validate And Return

After fixes, the parent inspects the final diff and runs only checks needed for
the changed behavior. Do not rerun a review. If a high-impact fix remains
uncertain, ask a fresh verifier to check only that issue. For report-only work,
run checks only when they can confirm a material candidate.

### Rank And Cap

Order Confirmed findings most-severe first. Cap the report at **10 findings**
at Direct and **15** at Deep. When the cap forces a cut, correctness outranks
reuse, efficiency, and conventions findings regardless of their individual
severity. Say how many findings were cut and why.

### Fix Route

Report each finding with its `short_summary` and an outcome of `fixed`,
`skipped`, or `no change needed`. Limit `skipped` to false positives and
changes not worth making. Then report:

- `Needs verification`
- `Validation`
- `Residual risk`, only when material

If nothing needed fixing, name the reviewed scope and confirm that Intent and
Scope Conformance, Repository Standards Review, and all three lanes were clean.

### Report-Only Route

For code, plan, or spec review, order Confirmed findings by severity: P0
blocker, P1 high, P2 medium, P3 low. Use:

```markdown
### [P1] <short_summary> — <location>

- **Category:** `<slug>`
- **Evidence and mechanism:** cited code and any governing requirement or rule.
- **Failure scenario or cost:** Follow the title with one short paragraph explaining the affected scenario and why the behavior is
wrong. Keep the cited range as small as possible and make sure it overlaps the reviewed diff.
- **Smallest safe fix:** direct correction.
```

List `Needs verification` separately. If clean, state the reviewed scope and
say `no findings confirmed`. For PR targets, follow Publish A PR Review.
