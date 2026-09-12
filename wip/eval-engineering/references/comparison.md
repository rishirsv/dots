# Improve and Compare Skills

Use the same reviewed tasks to answer a named decision. Comparing outputs is
not permission to edit the skill, adopt a candidate, or publish changes.

## Choose the comparison

| Question | Baseline | Candidate |
|---|---|---|
| Does this skill help? | No target skill | Target skill |
| Did this revision improve it? | Frozen accepted version | Proposed revision |
| Which skill suits this work? | Skill A | Skill B |

For no-target-skill controls, keep legitimate shared dependencies and remove
only the target. If another available skill provides equivalent behavior,
record that fact; the result is not a skill-free-agent comparison.

Use one shared task suite. Record package hashes or revisions, task/fixture
versions, runner, model/reasoning, tools, skill catalog, permissions, limits,
and rubric/judge versions. Hold these constant except for the intended change.
If dependencies must differ, describe the comparison as complete configurations,
not an isolated effect of instruction wording.

## Run one visible iteration

1. Audit the baseline. Diagnose task, environment, judge, and capture defects
   before blaming the skill. Ground the issue in artifacts and traces.
2. State a bounded hypothesis: what should improve, why, and what might regress.
   Ask for authorization to edit if not already supplied. Preserve the original.
3. Make the smallest coherent candidate change. Do not patch candidate outputs
   or provide corrective hints during trials.
4. Approve the run plan. Test affected tasks, previously successful tasks, and
   fresh tasks not used to design the change. Keep development examples separate
   from held-out evaluation tasks; label reused examples honestly.
5. Run candidates under matched conditions using [Runners](runners.md). Repeat
   when variability could change the decision, within the approved budget.
   Compare per-task results and anonymous artifacts through [Human review](review.md).
6. Recommend accept, revise, reject, or inconclusive against the agreed objective.
   Report regressions and critical failures rather than hiding them in averages.

If no fresh tasks exist, call the result a development-set improvement, not
generalization. Repeatedly inspecting a held-out task makes it development data.
Keep model comparisons separate unless changing the model is the actual question.

## Keep judgments comparable

Freeze criteria during a comparison. If criteria or a judge change, regrade
both candidates' saved artifacts consistently; rerun agents only if the task or
execution conditions changed. Keep original grades and the reason for regrading.
For noisy preference judges, check swapped A/B order and inspect disagreements.

Report task counts, valid/invalid/ungraded runs, criterion-level changes,
preferences, critical regressions, and available time/token/cost tradeoffs.
Do not claim statistical reliability from a small pilot. A quality gain with
greater cost is a tradeoff for the user to decide, not automatic adoption.

## Preserve the decision and lesson

Under `runs/<run-id>/`, retain the problem, hypothesis, candidate diff or revision,
task/configuration versions, evidence, human feedback, decision, and next step.
Propose useful failures as regression tasks. Put only reusable supported lessons
in the hidden companion's AGENTS.md using [Companion guidance](companion-guidance.md).

Default to one visible cycle. Additional optimization needs explicit scope and
limits. Stop at those limits, when evidence is inconclusive, or when no justified
next change remains. Adoption and publication remain separate decisions.
