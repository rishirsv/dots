# Pull request descriptions

Read this when creating, rewriting, or reconciling a pull-request body. Write
the smallest merge brief that lets a capable reviewer understand the outcome,
the reason, the important mechanism, and the proof without reconstructing the
change from commits or chat history.

## Ground the body

Read the current base-to-head diff and resulting source. For an existing pull
request, also read its current body and material review corrections. Reconcile
the description after implementation or review changes so the live body
describes the current head rather than the original proposal.

Preserve repository-required template fields. A template is a constraint, not
a reason to retain empty headings or generic checklists that the repository
does not require.

## Lead with the merge decision

Open with a short paragraph that answers three questions:

- What behavior or capability is different?
- What was wrong or missing before?
- Why does this change matter?

For a straightforward change, that paragraph plus exact validation may be the
entire body. Prefer a body a reviewer can understand in one screen.

Add only the sections that materially help:

- **Details** for the causal mechanism, an important decision, or a preserved
  constraint. Group by responsibility, not file order.
- **Validation** for exact tests, builds, runtime journeys, migrations, or
  external checks. State material proof gaps plainly.
- **UI evidence** for before/after screenshots or interaction clips.
- **Boundaries** for a meaningful non-goal, unchanged authority, fallback, or
  compatibility limit.
- **Review focus** for a large or risky change whose central invariant is not
  obvious from the opening.
- **Risk and release** only when migration, rollout, rollback, security,
  privacy, performance, or operational consequences affect the merge decision.

Use headings only when they improve scanning. Remove empty sections, repeated
context, file-by-file recaps, phase or commit diaries, generic checklists,
model names, agent signatures, and generated summaries that do not help a
reviewer decide whether to merge.

## Keep proof honest

Tie each important claim to the proof actually observed. A build does not prove
runtime behavior, appearance, migration safety, device behavior, or production
state. Label unavailable proof as unverified instead of implying completion.

For a user-visible UI, visual, or interaction change, also read
[visual-evidence.md](visual-evidence.md). Put the primary screenshot or clip
near the behavior it proves, and verify that the live pull request renders the
media.

Before publishing, confirm that the title and body describe the current diff,
the opening states the outcome and reason, validation distinguishes proved from
unverified behavior, and every retained section helps the merge decision.
