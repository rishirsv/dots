# Doctor

Diagnose a specific reported failure and propose the smallest useful source
change. This is a read/propose workflow. Applying a source edit is a separate
Apply state owned by the top-level Skill Doctor workflow. The doctor uses one of
two tracks, and must tell the user which track it is taking before doing the
work.

- Guidance-first proposal: inspect the report, current skill guidance, linked
  references, and existing evidence; localize the likely source and propose a
  patch. This is the default when the user-observed failure is already concrete.
- Reproduction/trial: recreate or test the issue from first principles with one
  narrow run when the user asks for it, the evidence is ambiguous, trigger
  behavior must be observed, or the proposed edit would be risky without a live
  check.

The **Prompt Doctor Loop** in [edit.md](edit.md) is part of this workflow, not a
separate phase. Use it before proposing candidate text. Doctor mode is
read/propose-only: ambiguous improvement language, tentative wording, and
feedback produce a proposal, not a payload edit. Source writes happen only when
the user clearly asks to apply a specific source change.

## Method

1. Capture the report: what the user expected vs what actually happened.
2. Announce the track: guidance-first proposal or reproduction/trial, and state
   that this turn is proposing unless a specific Apply request is already in
   scope.
3. Reconstruct the triggering input / scenario.
4. Inspect the current skill text and linked references. If using the
   reproduction/trial track, run exactly one narrow check and confirm it matches
   the reported failure.
5. Localize the cause (description vs body vs reference vs structure).
6. Apply the Prompt Doctor Loop in [edit.md](edit.md), including the
   stale-reference and positive-behavior scan. Proposed runtime guidance must use
   concepts that should remain in the target skill, not debugging labels, removed
   section names, or behavior the edit is deleting.
7. Propose the smallest fix with target files, intended behavior, validation,
   and residual risk. Stop there unless the top-level workflow has entered
   Apply.

## Evidence

Prefer concrete evidence over intuition — a reproduced run, a `judge-review.md`
finding, an eval row, or a user-observed failure. See
[edit.md](edit.md#evidence-sources) for what counts as valid edit evidence.

## Output

Root cause + chosen track + a precise proposal + a re-runnable failing case when
the reproduction track was used, captured in a supporting doc when useful
(proposed behavior, evidence, rejected edits, residual risk) so Verify can
re-run it after Apply.

For triggering failures, reproduce with a natural prompt in a clean child thread
using the shared [skill-trial-runs.md](../../../references/skill-trial-runs.md)
workflow. For behavior failures, force invocation with the failing input so the
run isolates the skill's behavior after it has already fired.
