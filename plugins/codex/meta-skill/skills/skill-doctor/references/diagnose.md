# Diagnose

Diagnose a specific reported failure before changing anything. The doctor uses
one of two tracks, and must tell the user which track it is taking before doing
the work.

- Guidance-first proposal: inspect the report, current skill guidance, linked
  references, and existing evidence; localize the likely source and propose a
  patch. This is the default when the user-observed failure is already concrete.
- Reproduction/trial: recreate or test the issue from first principles with one
  narrow run when the user asks for it, the evidence is ambiguous, trigger
  behavior must be observed, or the proposed edit would be risky without a live
  check.

Diagnosis then feeds the **Prompt Doctor Loop** in [edit.md](edit.md)
(classify -> locate source -> candidate edits -> recommend -> apply only if
authorized). Diagnose mode is read/propose-only: do not edit the target skill,
generated packages, docs, or source until the user explicitly approves the edit.

## Method

1. Capture the report: what the user expected vs what actually happened.
2. Announce the track: guidance-first proposal or reproduction/trial, and whether
   this turn will only propose a patch or apply an already-approved patch.
3. Reconstruct the triggering input / scenario.
4. Inspect the current skill text and linked references. If using the
   reproduction/trial track, run exactly one narrow check and confirm it matches
   the reported failure.
5. Localize the cause (description vs body vs reference vs structure).
6. Propose the smallest fix — do **not** apply it without approval (see
   [edit.md](edit.md)).

## Evidence

Prefer concrete evidence over intuition — a reproduced run, a `review.md`
finding, an eval row, or a user-observed failure. See
[edit.md](edit.md#evidence-sources) for what counts as valid edit evidence.

## Output

Root cause + chosen track + a re-runnable failing case when the reproduction
track was used, captured in the workbench as `<project>/.meta-skill/spec.md`
(durable notes: changed behavior, evidence, rejected edits, residual risk) so
Verify can re-run it.

For triggering failures, reproduce with a natural prompt in a clean child thread
using the shared [skill-trial-runs.md](../../../references/skill-trial-runs.md)
workflow. For behavior failures, force invocation with the failing input so the
run isolates the skill's behavior after it has already fired.
