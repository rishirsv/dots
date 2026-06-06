# Fix CI

Use this reference when the user's PR task is failing checks or red builds.

## Workflow

1. Resolve the PR and head branch.
2. Inspect the status rollup before fetching logs.
3. Use bounded logs first:

   ```bash
   gh run list --branch <headRefName> --limit 10
   gh run view <run-id> --log-failed
   ```

4. Identify whether the failure is caused by the PR, default-branch drift, external infrastructure, secrets, rate limits, or flakes.
5. Patch only PR-caused failures.
6. Run the smallest local validation that matches the failing job.
7. Report residual risk when remote CI cannot be rerun or verified locally.

## Guardrails

- Do not turn CI repair into broad cleanup.
- Do not mask failing tests by weakening assertions unless the behavior change is the point.
- Do not push fixes unless the user asks.
