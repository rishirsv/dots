# Execute an approved evaluation

Use this reference for preflight, worker isolation, prompts, capture, and failure
attribution. Read [Artifacts](artifacts.md) for the suite and run contracts.

## Preflight

Run
`python3 <skill-evaluator-dir>/scripts/validate_eval.py <suite-dir>`, then check
what a local validator cannot know:

Pass `--workspace-root <trusted-root>` when the suite is outside a Git
repository or its target paths belong to another explicitly trusted workspace.

- worker and grader availability;
- target, fixture, grader, and host-instruction freshness;
- worker visibility and hidden-evidence isolation;
- clean output directories and reset behavior;
- permissions, external effects, repetitions, timeout, and expected cost; and
- whether the approved plan still includes the proposed configurations.

A suite approval never pre-approves an external mutation. Obtain current
explicit authority immediately before a worker posts, deploys, sends, purchases,
or changes an external system.

## Keep workers evaluation-blind

Use one opaque fresh directory per case, configuration, and repetition. Import
results into the durable run directory only after the worker returns. Run paired
configurations in the same batch when the host supports it.

Give the worker:

```text
Complete this request using the supplied skill and inputs.

Request:
<the realistic task, preserving domain language>

Inputs and tools:
<only worker-visible fixtures, permissions, tools, and output location>

Return the requested result and leave produced artifacts in <opaque-output-dir>.
```

Do not add evaluation purpose, expected answers, hidden criteria, failure
hypotheses, comparison identity, graders, or other runs. Keep the suite and
hidden fixtures outside the worker-visible directory. If fresh workers are
unavailable, stop with a preflight failure rather than self-running.

## Capture and classify

Snapshot the resolved suite and dependencies before execution. Capture outputs,
observable final state, available transcript, timing, tokens, tool use, errors,
and resolved host configuration without inventing unavailable metrics.

Classify unsuccessful work before scoring:

- capability;
- missing information;
- harness;
- fixture or environment;
- false rejection or false acceptance;
- leakage; or
- infrastructure.

Only a completed capability outcome counts against the skill. Repair evaluation
defects at their owning layer and rerun only trials whose dependencies changed.
