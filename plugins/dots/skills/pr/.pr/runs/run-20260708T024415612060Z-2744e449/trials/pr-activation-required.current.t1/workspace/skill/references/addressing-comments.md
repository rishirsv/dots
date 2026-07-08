# Addressing Comments

Use this reference when the user wants to inspect or address actionable GitHub
pull request review feedback.

## Workflow

1. Resolve the PR.
   - Use a provided repository and PR number or URL directly.
   - Otherwise use local git context plus `gh pr view --json number,url`.
2. Inspect review context.
   - Use PR metadata, patch context, and flat comments for a lightweight read.
   - Use thread-aware GraphQL when unresolved threads, inline locations, or
     resolution state matter.
3. Cluster feedback.
   - Separate actionable change requests from informational comments, approvals,
     already-resolved threads, outdated threads, duplicates, and product
     judgment.
4. Confirm scope before editing.
   - Present numbered actionable clusters when the user has not asked to fix
     everything.
   - Treat "fix everything" as all unresolved actionable feedback; call out
     ambiguity.
5. Implement selected fixes locally.
   - Keep each code change traceable to the thread or feedback cluster it
     addresses.
   - Draft a response instead of forcing a code change when the comment asks for
     explanation.
6. Summarize what changed, which comments were addressed, which remain open,
   and what validation supports the change.

## Thread-Aware Query

```bash
gh api graphql -f query='
query($owner:String!, $repo:String!, $number:Int!) {
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$number) {
      reviewThreads(first:100) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          comments(first:20) {
            nodes { id body author { login } path line diffHunk url }
          }
        }
      }
    }
  }
}' -F owner="$owner" -F repo="$repo" -F number="$pr_number"
```

Use `path`, `line`, and `diffHunk` to map each unresolved thread to the local
fix. Paginate if `pageInfo.hasNextPage` is true.

## Write Safety

- Do not reply on GitHub, resolve review threads, submit reviews, or push fixes
  unless the user asked for that write action.
- If comments conflict or would cause a behavioral regression, surface the
  tradeoff before editing.
- If a comment is ambiguous, ask for clarification or draft a proposed response
  instead of guessing.
- Do not treat flat PR comments as a complete representation of review-thread
  state.
