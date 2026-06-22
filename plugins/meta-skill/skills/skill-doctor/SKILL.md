---
name: skill-doctor
description: "Use when improving an existing agent skill: review its design, diagnose a reported failure, propose precise source changes, apply explicitly approved edits, and verify the result. Not for authoring a new skill or measuring behavior across eval suites."
---

# Skill Doctor

Improve an existing agent skill through distinct lanes:

- **Review** — when the user asks to review or improve a skill, produce a
  scored Judge review.
- **Doctor** — diagnose reported failures and propose precise source changes;
  edit only after explicit approval for a concrete source change.
- **Verify** — check the changed skill after an approved edit.

`skill-doctor` owns static design review, diagnosis, and fixes for one skill;
`skill-evaluator` owns behavioral evidence across candidates.

For the central Meta Skill CLI surface, read
[cli.md](../../references/cli.md). Do not invent doctor-specific command
interfaces when a plugin-level command exists.

Default to read/propose. Write workbench artifacts only when the user asks for
a saved report or otherwise allows artifact writes. Source edits require
explicit approval for a concrete change; feedback, diagnosis, review, or
brainstorming is not approval.

## Mode Selection

Pick the starting mode from the user's request, then adjust if the evidence
points to another lane.

- **Review** (default) — review or improvement request: "review this skill,"
  "make my skill better," "is my triggering solid?" No specific failure in hand.
- **Doctor** — reported failure: "my skill keeps failing on prompt X." Work
  from the failure report to candidate text, then stop with a precise proposal.

Tiebreaker: a specific reported failure → **Doctor**; otherwise → **Review**
(including static complaints like an over-long description).

## Review (default)

Produce a **scored Judge review** (`judge-review.md`) — see
[references/rubric.md](references/rubric.md).

1. Score **Discovery** (4 dims) and **Implementation** (5 dims), each 0–3 — every
   dimension's reasoning must cite the skill's own text; see
   [references/rubric.md](references/rubric.md) for calibration and a worked example.
2. Run the **Payload Hygiene Sweep** from
   [references/rubric.md](references/rubric.md#payload-hygiene-sweep) across the
   full shipped skill payload before final scoring. This includes `SKILL.md`,
   linked references, agents, scripts, assets, examples, templates, and any
   user-visible text inside HTML or other fixtures.
3. Run **Validation**: `<meta-skill-root>/scripts/metaskill validate <skill-dir> --json`.
4. **Overall Judge Review Score** = rounded average of Discovery %,
   Implementation %, and Validation %.
5. If artifact writes are allowed, write `judge-review.md` with scores and
   prioritized findings, then **stop**. If artifact writes are not allowed,
   return the review in chat. Review proposes; it does not edit source.

## Doctor

Diagnose the reported failure and produce a precise proposal — read
[references/doctor.md](references/doctor.md). Announce whether you are using the
guidance-first track or the reproduction/trial track, localize the cause, run
the Proposal Loop, and propose the smallest fix. Stop there unless the user
explicitly approves the specific source change.

For one-off improvement testing, use the shared one-off skill check workflow in
[skill-trial-runs.md](../../references/skill-trial-runs.md). Prefer a child
worktree for candidate edits; the child demonstrates or revises in isolation,
while the parent edits source only after explicit approval for that specific
change.

## Approval Boundary

In Review or Doctor follow-up, edit source only when the user explicitly
approves a concrete proposal or directly requests a specific edit, such as
"apply proposal 1" or "make the SKILL.md routing change." Briefly restate the
approved change and files in scope, then edit only that scope. Edit the
**source** skill, never a generated package copy. If the requested write scope
is broader than the proposal, return to **Doctor** with the expanded scope
instead of improvising edits.

## Verify

Run validation through `<meta-skill-root>/scripts/metaskill validate <skill-dir> --json`. Confirm
the requested fix held, report validation results, and refresh the Validation
third of the Judge review only when a current `judge-review.md` exists, plus a
quick regression scan — see [references/verify.md](references/verify.md).
Escalate to `skill-evaluator` when the decision needs task/candidate evidence:
for example, whether the fix improves outcomes over the current skill or a
no-skill baseline.

## Workbench

When artifact writes are allowed, resolve the workbench path before writing:
`<meta-skill-root>/scripts/metaskill workbench init --target <skill-dir> --dry-run --json`,
then use the resolved path as the source of truth. Use `judge-review.md` for the
Judge scorecard. Do not create workbench folders elsewhere.

## Guardrails

- **Feedback ≠ write permission** — Review and Doctor stop with chat output or a
  permitted artifact. Source edits require explicit approval for a concrete
  change.
- Reproduce *one* case only when using the reproduction/trial track; don't
  measure many tasks/candidates — that's `skill-evaluator`.
- Smallest correct change; edit source, never generated packages.
- Child worktree edits are evidence, not promotion; parent-side source edits
  still require explicit approval for a concrete change.
- A `description` change alters triggering/routing — call it out explicitly.
