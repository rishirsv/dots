---
name: debug
description: "Diagnoses an unknown-cause failure — bug, failing test, error, crash, or regression — by reproducing and verifying the root-cause mechanism before fixing. Use for debug, root cause, or why is this failing/broken/it worked before; not for an already-diagnosed fix, code review, or flaky-test reruns."
---

# Debug

Diagnose failures with evidence, not pattern-matching. The output is a verified
root cause — a mechanism that can be demonstrated, not a plausible story — plus
the smallest fix and proof the original failure is gone.

Fix only after the cause is verified. When the user asked what is wrong rather
than to fix it, report the diagnosis and the proposed fix and stop; apply the
fix when they ask or the task clearly includes it.

## Capture The Failure Contract

Before changing anything, record:

- expected vs actual behavior, one sentence each
- the exact error text, stack trace, or wrong output, verbatim
- the repro command or interaction, plus the environment details that matter
- when it last worked, if known — a regression unlocks history bisection below

Pull missing fields from the report, logs, CI output, or a first repro run. Do
not invent them, and do not start from a paraphrase when the exact error is
available.

## Reproduce First

Reproduce the failure before theorizing, and capture the exact failing output
as the baseline every later probe is compared against.

- Prefer the cheapest reliable repro: a failing test, a small script, or a
  single command beats a full app walkthrough.
- Shrink the repro while it still fails: fewer steps, less data, fewer
  dependencies. The smallest failing case usually names the suspect.
- If the failure cannot be reproduced, say so plainly, diagnose from the
  available evidence, label every conclusion `Likely` or `Needs testing`, and
  name what evidence would confirm it. Do not present an unreproduced
  diagnosis as confirmed.

## Localize

Cut the search space before reading code broadly:

- For regressions with a known-good point, bisect history (`git bisect` or a
  manual halving of commits) before studying the code.
- Otherwise binary-search the failing path: disable half the input, config,
  layers, or steps and observe which half keeps the failure.
- Read the error's actual origin — the first failure in the log, not the last
  symptom — and trace data backward from the wrong value to where it became
  wrong.

## Hypothesize And Probe

State candidate causes explicitly and rank them by the evidence so far. Then
test them:

- Change one variable per probe. A probe that changes several things proves
  nothing when the behavior shifts.
- Make each probe falsifiable: predict what the output will be if the
  hypothesis is true and if it is false, then run it.
- Prefer observation probes (logs, debugger, targeted prints, inspecting real
  state) before mutation probes (editing code to see what happens).
- When the hunt exceeds a few probes, keep a short written log of hypotheses
  tried, evidence seen, and what was ruled out — and re-rank instead of
  re-testing ruled-out causes.

## Verify The Root Cause

Correlation is not a diagnosis. Before calling a cause confirmed, demonstrate
the mechanism: toggling the cause toggles the failure, or the causal chain from
trigger to symptom is traced concretely through the code or data. If the story
merely fits the symptoms, label it `Likely` and say what would confirm it.

## Fix Smallest

- Make the smallest change that removes the cause, not the symptom. Guarding a
  crash site while the bad value still flows upstream is symptom suppression;
  say so if that is all the task allows.
- Add or update a test that fails without the fix and passes with it, when the
  repo has a test surface for the affected code.
- Re-run the original repro and the nearest affected tests. "Fixed" means the
  baseline failure is gone and adjacent behavior held, not that the code looks
  right.
- Do not bundle refactors, cleanups, or unrelated improvements into the fix.

Stop and ask before destructive diagnostic steps: resetting databases,
deleting caches or state, force-pushing, or changing shared environments.

## Report

Lead with the root cause in plain language, then:

- the evidence chain: repro, key probes, and the demonstration of mechanism
- the fix and why it is the smallest correct one
- verification performed, with the commands or tests run
- confidence and remaining risks, including anything labeled `Likely` or
  `Needs testing`
- hypotheses ruled out, one line each, when the hunt was long

If blocked, report the strongest current hypothesis, the evidence for and
against it, and the exact probe that would settle it.
