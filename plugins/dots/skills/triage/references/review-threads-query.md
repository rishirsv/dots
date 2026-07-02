# Review Threads Query

Use this GraphQL query whenever review-thread or conversation-resolution state
could affect a triage, repair, or land decision.

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

Drop the `comments` selection when only resolution state is needed; keep it
when mapping threads to specific fixes (for example, during repair).

## Interpreting Results

- `isResolved: false` and `isOutdated: false` is a live, unresolved thread and
  is the strongest signal of a real blocker.
- `isResolved: false` and `isOutdated: true` is a thread whose code context has
  moved on; treat it as a weaker blocker and confirm it still applies before
  acting on it.
- `isResolved: true` threads are not blockers unless repo policy treats
  reopened or disputed resolutions as blocking.
- Use `path` and `line` (and `diffHunk` when present) to map each unresolved
  thread to the file and location it blocks, and to decide which local change
  addresses it.

## Pagination

If more than 100 review threads exist, paginate with `pageInfo.endCursor` or
mark conversation state `Unknown`. If repo policy for required conversation
resolution is not visible, do not call the PR ready because conversations look
quiet; report the policy signal as unknown.
