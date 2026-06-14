---
name: code-quality-review
description: "Use when reviewing or tightening code right after implementation for simplicity, reuse, efficiency, maintainability, thermonuclear quality review, simplify cleanup, or an after-implementation code-quality pass; not for broad codebase architecture scans, existing PR review-comment response, CI repair, publishing PRs, or security-only audits."
---

# Code Quality Review

Review recently changed code after implementation and tighten it before commit or PR. Prefer direct same-scope cleanup when the user asked to simplify, clean up, or improve the implementation. Produce findings only when the user asks for review-only feedback or a fix would broaden the change.

## References

- Read [quality-rubric.md](references/quality-rubric.md) before evaluating the diff. Use it for the reuse, quality, efficiency, and thermonuclear review lenses.
- Read [hard-cut-policy.md](references/hard-cut-policy.md) when the change touches schemas, contracts, persisted state, routing, configuration, feature flags, enum/value sets, architecture, fallbacks, adapters, migrations, or compatibility paths.

## Scope

Start from the current repository state:

```sh
git status --short
git diff --stat
git diff --staged --stat
git diff --name-only
git diff --staged --name-only
```

Use `git diff HEAD` when staged changes exist so the review sees the full post-implementation delta. If there are no git changes, review the files the user mentioned or the files edited earlier in the thread.

If the user names a base branch or commit range, review that range. If the scope is ambiguous and several unrelated changes are present, ask one concise scope question before editing.

## Review Guidance

Read applicable `AGENTS.md` files and any review docs they name. If none are named, quickly search for likely review guidance:

```sh
rg --files -g 'REVIEW.md' -g 'review.md' -g '*review*.md' -g '.github/*.md'
```

Keep only guidance that changes the review: required skills or domain passes, repo-specific quality bars, validation commands, output shape, forbidden patterns, or ownership/path rules. Higher-priority instructions still win. When using subagents, pass this compact guidance summary, applicable file paths, and any required skills into every review-agent prompt.

## Workflow

1. Establish scope and read repo review guidance.
2. Read the quality rubric. Read the hard-cut policy when its trigger conditions apply.
3. Inspect the changed files and nearby code. Search for existing utilities, helpers, canonical modules, tests, and patterns before recommending new abstractions.
4. Default to fresh review-only subagents for any non-trivial diff. Launch three parallel lenses over the same diff: code reuse, code quality, and efficiency. Each prompt should include the full diff, changed-file contents when needed, repo review guidance, and any required domain skills.
5. Skip subagents only when they are unavailable or the diff is very small; then run the three lenses yourself. Subagents do not edit files. The parent verifies their findings, resolves conflicts, and owns any same-scope edits.
6. Verify every finding against the actual files before editing or reporting it. Drop false positives without turning the review into an argument.
7. Apply same-scope fixes when the user asked for cleanup or simplification. Stop and report when the fix would expand scope, change product behavior, require architecture judgment, or conflict with repo guidance.
8. Run the narrowest useful validation for changed code. Prefer existing targeted tests, typechecks, lint, or build checks named by repo guidance.

## Review Bar

Do not approve code merely because behavior seems correct. The pass bar is:

- the change reuses canonical helpers and does not duplicate existing behavior
- the implementation is simpler after the pass, not just rearranged
- the code avoids ad-hoc branching, hidden compatibility paths, unnecessary wrappers, cast-heavy contracts, and stringly-typed one-offs
- independent work is not serialized when parallel structure is equally clear
- tests cover the owning invariant without duplicating weaker coverage
- repo-specific review guidance was considered and followed

Prefer deleting complexity over polishing it. Prefer one canonical codepath over fallback, shim, adapter, coercion, alias, or dual-shape support unless a real external compatibility boundary exists.

## Output

When fixes were made, report:

- `Fixed`: concise list of material cleanup changes
- `Skipped or deferred`: false positives, out-of-scope findings, or issues needing user judgment
- `Validation`: commands run and result
- `Residual risk`: anything not proven

When the user asked for review-only output, lead with prioritized findings. For each finding, include file and line evidence, impact, and the proposed fix. If no material issues are found, state the reviewed scope and say the code already meets the quality bar.

## Boundaries

- Do not rewrite unrelated code while simplifying the changed scope.
- Do not silently modify files when the user asked for review-only feedback.
- Do not preserve legacy or draft shapes just because old code existed.
- Do not hand off to PR publication, CI repair, or existing review-comment workflows; name the appropriate follow-up skill or workflow instead.
