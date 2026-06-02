# Review PR

Use this reference for read-only PR review mode.

## Workflow

1. Resolve the PR number or URL.
2. Read repo review guidance: `AGENTS.md`, `README.md`, review docs, and relevant local instructions.
3. Inspect PR metadata, branch names, body, and diff.
4. Compare against the merge base when local checkout is needed.
5. Review for correctness, regressions, data loss, security, test gaps, and repo-contract violations.
6. Lead with findings ordered by severity.

Use a reviewer subagent only when the runtime exposes one and the PR is broad enough to benefit. The subagent must stay read-only and return findings with file/line references and verification gaps.

## Output

Save a temporary review body when useful:

```bash
mkdir -p .codex/tmp/gh-review
REVIEW_FILE=".codex/tmp/gh-review/pr-<number>-review.md"
```

The review body should include PR title, URL, base/head branches, review date, findings first, open questions, verification gaps, and a short summary after findings.

Do not post the review unless the user asks.
