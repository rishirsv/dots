# Task Running

Use the project's supported execution runtime and record its version. Upgrade
or replace it only with user approval and a stated compatibility reason. Use its documented
interface or installed CLI help as the command contract. This skill does not
require a particular runner or container.

## Storage and trial workspaces

Use the repository's companion convention. Here `skills/` means the owning skill
directory, including a plugin's skills directory where applicable.

```text
skills/
├── <skill>/                         # portable runtime and resources
└── .<skill>/                        # maintainer-only companion
    ├── AGENTS.md                    # reusable evaluator instructions
    ├── evals/<suite>/
    │   ├── tasks.json               # shared task definitions; format flexible
    │   ├── workspace/               # starting files, only if needed
    │   └── tests/                   # checks only when grading is selected
    ├── runs/<run-id>/               # config, artifacts, traces, feedback
    └── worktrees/<trial-id>/        # disposable working copy
        └── .agents/skills/          # candidate and approved dependencies
```

Create directories only when they have contents. `workspace/` is the task's
starting snapshot; `worktrees/` holds its per-trial working copy, which need not
be a Git worktree. Include the full required working directory, not just a
prompt. Preserve source files and candidate versions; record revisions or hashes
with each run. For shared suites, follow [Comparison](comparison.md).

Follow [Runners](runners.md#prepare-the-full-task-environment) for candidate
placement, dependencies, and enforced access boundaries. The tree describes
storage, not isolation; record an external trial root when one is needed.
Keep private work data in its approved project, not Dots or an unapproved model
endpoint.

## Task layout

Adapt configuration,
Environment setup, and the Verifier entry point to the selected runtime; do not
create files solely to satisfy another platform's package format.

The files have these contracts:

- The reviewed task definition follows [Task design](task-design.md#write-the-task-spec).
  It remains evaluator-only, outside the agent image or workspace.
- Record the agent and Verifier timeouts, Environment resources and services,
  network policy, and runtime variable names in the supported configuration.
  Never store secret values in it.
- Extract the exact request from that definition; save a separate
  `instruction.md` only if the runner needs it. Do not include evaluator notes.
- `workspace/` contains frozen starting files. Record service setup in `Task.md`
  or task-specific helpers. Use a container definition only when the selected
  Environment needs one. Include
  only dependencies and state visible to the agent. Never copy `Task.md`,
  `tests/`, `solution/`, hidden truth, judge rules, or credentials into the
  agent-visible workspace.
- The Verifier runs after agent work ends, outside the agent's access boundary.
  It may call helper tests and hidden fixtures. Use the selected runtime's
  output format and location for the [Verifier contract](verifier-design.md).
- `solution/solve.sh` is optional. When present, it performs the real reference
  work against the same Environment and proves the intended result is
  reachable. It does not write a hard-coded answer only to satisfy the Verifier.

A Harness adapter can bind approved dependencies and translate I/O. It must not
decide the answer or fabricate actions.

Keep generated jobs outside task source, under companion `runs/<run-id>/`. Keep
them until the user accepts, revises, or drops the eval. Before retaining
private transcripts, define who can read them, what must be redacted, how long
to keep them, and how to delete them. Keep only the evidence needed to audit
the Task.

## Prepare the selected task

Use the [reviewed task definition](task-design.md#review-the-task-and-companion-agentsmd-with-the-human).
Choose the [runner](runners.md), build only the needed
[Environment](environment-building.md), materialize
[synthetic data](synthetic-data.md) when needed, and add a
[Verifier](verifier-design.md) only for automated grading. Then perform the
package audit below.

## Audit package completeness before running

Read [Runners](runners.md) for the selected mode. For discovery, require input,
workspace, readiness, isolation, and evidence capture checks; omit Verifier
fixtures and reward checks for ungraded dimensions. Mark them ungraded, not
failed or zero. Human-only grading uses [Human review](review.md) instead of an
automated Verifier entry point.

Resolve the configuration without a scored run when the selected runtime
supports it. Do not start a reference or model trial until this audit passes
for the exact Task package:

1. Confirm the exact task request, any selected Verifier, Environment setup, and
   any required runtime configuration exist at the paths the runtime will load.
   Confirm the matching task definition is available for human review.
2. Validate the configuration using the runtime's supported interface. Confirm
   exact Task selection, Harness or adapter, model, resources, network policy,
   runtime variable names, trial count, concurrency, timeouts, judge, and
   output paths.
3. Start the Environment through the selected runtime and complete its
   [fidelity checks](environment-building.md#check-fidelity-before-a-model-run),
   including required operations and meaningful invalid actions.
4. Complete the selected runner's boundary checks, including evaluator-only
   files and inherited instructions.
5. Confirm the Verifier can execute with the required file permissions and
   working paths. Exercise each Verifier dependency.
6. Complete [Verifier decision-boundary checks](verifier-design.md#test-the-decision-boundary)
   through the real Verifier entry point.
7. Run the reference path through the same Environment when it exists, then run
   the Verifier. Confirm the reference result is reachable and receives the
   intended reward.
8. Fix every missing file, invalid path, parse error, build error, startup
   error, missing dependency, permission error, missing reward, or leaked file
   before starting a trial.

Use [Discovery's access rules](discovery.md#map-dependencies-and-access) for
credentials and private dependencies.

## Run contract

Increase timeouts only when evidence shows valid work exceeds the current
limit. Keep a finite bound and record the reason.

For each trial, retain:

- resolved configuration;
- Harness messages, calls, results, retries, and errors;
- Environment startup, requests, state, reset, and cleanup evidence;
- Verifier criteria, evidence, verdict, reason, reward, and errors; and
- phase timing and termination reason.

Apply [failure classification](calibration.md#classify-each-problem). Every attempted
trial must end as completed, cancelled, or infrastructure error. Do not use a
pending trial as evidence.

For multi-turn runs, also prove that the first Harness input equals
the task definition's request, later turns came from the declared user policy, one approved
session was reused, future messages were not preloaded, and no model call
occurred after termination. See [Multi-turn simulation](multi-turn-simulation/guide.md)
for implementation details.
