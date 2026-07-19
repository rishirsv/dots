# Operations

Read this before delegating, supervising, landing, or reconciling work.

## Delegate Deliberately

Keep prioritization, authority, synthesis, and shared state in the coordinator.
Route bounded research, implementation, and independent verification to
subagents by default. Keep a small read, decision, or edit inline when
delegation would cost more than completing it.

Parallelize only when tasks have separate write scopes and canonical owners, no
dependency on each other's result, separate exclusive resources, and a checkout
model allowed by project instructions. Use the project's reservation mechanism
for resources such as a simulator, device, release role, production account, or
shared plan.

## Dispatch With A Recovery Record

Create `work/<work-id>.md` from `../assets/WORK.md` before dispatch and set it to
`ready`. Use a stable ID independent of the runtime task. After dispatch, record
the native task ID and set the state to `active`. If dispatch fails, remove an
empty record or retain authorized work as `waiting` with its blocker.

Fill every applicable template field. Keep the brief bounded; do not copy full
roadmaps, transcripts, diffs, or completed history.

Tell the worker to read project instructions, the work record, and named source
documents. Give it one outcome, one write scope, an execution location,
non-scope, authority, and required proof. Require the template's return format.

- Keep scouts and reviewers read-only.
- Assign one maker as the sole implementation owner.
- Grant recursive delegation only when the brief requires it.
- Prevent workers from editing `.agents/chief-of-staff/`.

## Follow The Project Git Workflow

Before shipping work, record the current base, assigned checkout, branch or pull
request, and write scope. Let one maker own that branch; keep scouts and
reviewers read-only.

Before accepting the result, inspect the live status, diff, commits, validation,
branch freshness, and pull-request state. Use the repository's commit and PR
workflows for publication. Do not infer authority to push, merge, rebase, or
rewrite history from authority to implement.

## Track Four States

- `ready`: authorized and briefed
- `active`: owned by one running task
- `waiting`: blocked by a named dependency or authority
- `verify`: returned and under evidence review

Update the work record and board only at dispatch, a real blocker, returned
work, landing or abandonment, and recovery. Keep durable decisions in their
canonical owner, not on the board after resolution.

## Verify And Finish

When work returns:

1. Set the record to `verify`.
2. Check consequential file, branch, commit, pull request, test, artifact, and
   external-state claims in proportion to risk.
3. Separate evidence produced from evidence still open. A merge alone does not
   prove runtime, device, accessibility, archive, or release quality.
4. Return corrections to the same maker when possible.
5. Reconcile changed canonical truth once, refresh the board, then remove the
   record when nothing in it is needed for recovery.

Save a no-code finding only when future work needs it: write a durable report
to the project's output or documentation convention, or update the canonical
owner whose truth changed.
