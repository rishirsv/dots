# Design QA

Verify implementation fidelity and the usability of the implemented experience.
Use this when asked to check or correct a build against an accepted design.
Judging whether the accepted design itself should change belongs to [design-audit.md](design-audit.md).

## Inputs

- **Expected result:** accepted visual target, relevant behavior requirements,
  and agreed deviations. A written brief alone is not a visual fidelity target.
- **Actual result:** rendered implementation, with live access when behavior
  must be exercised; source may help locate fixes.
- **Comparison scope:** matching route, viewport, scale, theme, content, auth,
  and interaction state; supported adaptations and states to check.

If the target or implementation cannot be inspected, report fidelity as blocked.
Continue checks supported by available evidence without inventing the missing
target. A request to compare is read-only; a build or correction request
authorizes the fix loop within its scope.

## Compare And Correct

Read the [QA rubric](rubrics/design-qa.md).

Compare source and implementation at matching dimensions and states, with crop
and device/browser chrome normalized. Use a shared comparison view or detail
crops where they make differences easier to judge.

Cover every applicable rubric category and exercise required controls and states.
Captures establish appearance; navigation, recovery, keyboard behavior, and
motion need interaction evidence. Classify findings using the rubric. For behavior
omitted from a mock, use the task and platform requirements.

## Iteration Loop

For build or correction requests, run one iteration by default. Use the user's
requested count as the iteration limit. A comparison-only request reports
findings without entering the correction loop.

One iteration is a complete **compare → fix → capture → compare again** cycle:

1. Compare the current implementation with the target and prioritize P0–P2
   findings from the rubric.
2. Apply the material corrections within scope.
3. Capture the revised implementation at matching viewports and states, and
   exercise affected behavior.
4. Compare again, linking each original finding to its fix and post-fix evidence.
   Carry unresolved findings and regressions into the next iteration, if any.

The post-fix comparison is part of the same iteration. Build, lint, deployment,
and preview troubleshooting do not count as design iterations. Recheck other
areas when a change could affect them.

Stop when the requested count is reached, no actionable P0–P2 findings remain,
or a concrete blocker prevents progress. A clean initial comparison needs no
correction cycle. Reaching the iteration limit does not make unresolved QA pass.

## Result

Record source and implementation evidence, comparison scope, findings, agreed
adaptations, unverified checks, and iterations completed versus the limit.
For each correction retain the original finding, change made, and post-fix
result. Use the task's existing record.

Use **passed** when no actionable P0–P2 defect or required evidence gap remains
in the declared scope; P3 follow-ups may remain. Otherwise use **blocked** and
name what remains, including fixes not authorized in a comparison-only request.
A fidelity pass does not certify the quality of the source design or untested
accessibility and behavior.
