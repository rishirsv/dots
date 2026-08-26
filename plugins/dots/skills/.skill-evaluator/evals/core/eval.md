# Skill evaluator core suite

- **Status:** Approved
- **Suite ID:** `skill-evaluator-core`
- **Decision:** Is the rewritten evaluator ready to replace the previous Dots
  evaluator for local Claude and Codex workflows?
- **Claim:** The evaluator chooses the right evaluation branch, preserves its
  gates and ownership boundaries, and produces conclusions traceable to the
  available evidence without requiring Harbor or a Dots agent runtime.
- **Evidence level:** Established suite

## Cases

The working set covers a new unproven skill, an existing flawed evaluation,
grader validation, error discovery, unchanged reruns, stale target evidence,
missing fresh workers, triggering, RAG, and a static-review near miss. Fresh
confirmation cases are added before a release-readiness conclusion.

## Criteria

Each case has failure-specific observable criteria. A separate grader reads the
worker result and applicable source after the worker finishes. Evaluation-system
failures remain unscored. Workers receive only the realistic request, target
skill, and permitted local files; they are not told that their use of the
evaluator is itself being evaluated.

## Run policy

- One working repetition unless observed variance calls for more.
- No external mutations or network-dependent infrastructure.
- Fresh local subagents execute cases when available.
- Stop without a readiness conclusion when workers or independent grading are
  unavailable.

## Approval

The user approved implementation and dogfooding of this plan in the current
task. The machine-readable approved-contract digest is stored in `cases.json`.
