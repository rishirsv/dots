---
name: skill-doctor
description: "The improve specialist within meta-skill: make an existing agent skill better. Judge static quality, Doctor reported failures into precise proposals, apply only user-directed source changes, then verify. Reached through meta-skill's routing; invoke directly only when explicitly named. Not for authoring a new skill (skill-writer) or formal performance measurement (skill-evaluator)."
---

# Skill Doctor

Improve an existing agent skill through distinct lanes:

- **Judge** — score static quality and write `judge-review.md`.
- **Review** — inspect supporting evidence, references, and deterministic checks.
- **Doctor** — diagnose reported failures and propose precise source changes.
- **Apply** — edit source only when the user clearly asks to apply a specific
  change.
- **Verify** — check the changed skill after Apply.

`skill-doctor` owns static design review, diagnosis, and fixes for one skill;
`skill-evaluator` owns behavioral evidence across candidates.

For the central Meta Skill CLI surface, read
[cli.md](../../references/cli.md). Do not invent doctor-specific command
interfaces when a plugin-level command exists.

**Human feedback is evidence, not source-edit permission.** The default state
is propose-only. The doctor may write review notes, proposals, scorecards,
failure notes, and other supporting docs in the workbench or repo-approved docs
location. Do not edit the target skill payload, source config, generated
packages, or installed copies from diagnosis, review, brainstorming, or
tentative wording. Source edits belong only to **Apply**, when the user clearly
asks to apply a specific change.

## Mode Selection

Pick the starting mode from what the user brought; it is a starting point, not a
cage — solve the user's problem whichever way works.

- **Judge** (default) — proactive audit / prompt-optimization: "make my skill
  better," "is my triggering solid?" No specific failure in hand.
- **Doctor** — a reported failure walked in: "my skill keeps failing on prompt
  X." Work from the failure report to candidate text, then stop with a precise
  proposal.

Tiebreaker: a specific reported failure → **Doctor**; otherwise → **Judge**
(including static complaints like an over-long description).

## Judge (default)

Produce a **scored Quality page** (`judge-review.md`) — see
[references/rubric.md](references/rubric.md).

1. Score **Discovery** (4 dims) and **Implementation** (5 dims), each 0–3 — every
   dimension's reasoning must cite the skill's own text; see
   [references/rubric.md](references/rubric.md) for calibration and a worked example.
2. Run the **Verify tests** (deterministic): `plugins/meta-skill/scripts/metaskill validate <skill-dir>`.
3. **Overall Quality Score** = rounded average of Discovery %, Implementation %,
   and Verify-tests %.
4. Write `judge-review.md` with scores + prioritized findings, then **stop** —
   it proposes; it does not edit.

## Doctor

Diagnose the reported failure and produce a precise proposal — read
[references/diagnose.md](references/diagnose.md) and
[references/edit.md](references/edit.md). Announce whether you are using the
guidance-first track or the reproduction/trial track, localize the cause, scan
candidate text for stale or negative-only guidance, and propose the smallest
fix. Stop there unless the user clearly asks to apply a specific source change.

For one-off improvement testing, use the shared skill trial run workflow in
[skill-trial-runs.md](../../references/skill-trial-runs.md). Prefer a child
worktree for candidate edits; the child demonstrates or revises in isolation,
while the parent applies source edits only when the user asks for that specific
change.

## Apply

Apply is a separate state, not the continuation of diagnosis. Enter it when the
user asks for a specific source change, such as "apply proposal 1" or "make the
SKILL.md routing change." Briefly restate the change and files in scope, then
edit only that scope. Edit the **source** skill, never a generated package copy.
If the requested apply scope is broader than the proposal, return to **Doctor**
with the expanded scope instead of improvising edits.

## Verify

Re-run the **Verify tests** through `plugins/meta-skill/scripts/metaskill validate <skill-dir>`. Confirm
the requested fix held and refresh the Verify-tests third of the score, plus a
quick regression scan — see [references/verify.md](references/verify.md).
Escalate to `skill-evaluator` when the decision needs task/candidate evidence:
for example, whether the fix improves outcomes over the current skill or a
no-skill baseline.

## Workbench

Iteration artifacts live in a gitignored, plugin-wide workbench at the target
skill's project root: `<project>/.<skill-name>/`. Use `judge-review.md` for the
Judge scorecard, and write any other useful supporting docs there or in a
repo-approved docs location. The hidden folder is named for the target skill,
and the portable skill payload stays at `<project>/skill/`. Never write
workbench files into `plugins/meta-skill/` itself.

## Guardrails

- **Feedback ≠ source-edit permission** — Judge and Doctor stop with docs or a
  proposal. Source edits happen only in **Apply**.
- Reproduce *one* case only when using the reproduction/trial track; don't
  measure many tasks/candidates — that's `skill-evaluator`.
- Smallest correct change; edit source, never generated packages.
- Child worktree edits are evidence, not promotion; parent-side source edits
  still require a user-directed Apply step.
- A `description` change alters triggering/routing — call it out explicitly.
