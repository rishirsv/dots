# Design and Review One Task Spec

## Sections

- [Find directions](#find-directions)
- [Select one Task](#select-one-task)
- [Write the Task Spec](#write-the-task-spec)
- [Review the Task and companion AGENTS.md with the human](#review-the-task-and-companion-agentsmd-with-the-human)
- [Build a family](#build-a-family)

## Find directions

Use repository capabilities, supplied traces, user priorities, production
failures, existing eval coverage, and project evaluation knowledge. Start with real
work and an observable result. Do not create a Task only because an unusual
fixture is available.

For new Task design, default to one grounded Task after inspection. Reuse
existing tasks and honor the user's requested set or count. Use any concise structure that shows the work and capability,
non-trivial condition, important failure, Environment and access, independent
Verifier evidence, difference from existing Tasks, source evidence, and open
decisions. Offer alternatives only when a real user choice changes the design.

When evaluation knowledge is in scope, follow [Companion guidance](companion-guidance.md).
Frequency in traces can support relevance but does not prove
business priority. A repository feature can support feasibility but does not
prove the Task is valuable.

## Select one Task

A strong Task:

- represents useful work;
- requires the selected capability;
- is solvable from visible information or normal discovery;
- contains a realistic reason the agent can fail;
- produces independently observable evidence;
- accepts materially equivalent results;
- checks harmful side effects;
- avoids hidden trivia and answer leakage; and
- differs from existing Tasks by condition, state, evidence, or failure mode.

Reject a Task that mainly tests prompt decoding, brittle formatting,
infrastructure luck, impossible knowledge, or a preferred internal tool
sequence.

Use normal request language. State the goal, necessary context, expected
output or effect, and real limits. Do not prescribe steps unless the procedure
is the capability.

## Write the Task Spec

Use the [companion layout](task-running.md#storage-and-trial-workspaces). Record whether
the Task is for discovery, human grading, automated grading, or comparison.
Discovery can leave subjective criteria open; do not invent a pass rule before
the user establishes what good work means.

Use one shared task list for simple cases. Use `assets/task/Task.md.template`
only for a task whose environment or verification needs that detail. The fields
below describe useful information, not mandatory headings or duplicate files.
Keep evaluator-only content outside the candidate environment.

### Purpose and evidence

Name the work, capability, value, source, and difference from existing Tasks.
Use paths, symbols, focused tests, trace IDs, policies, or human decisions for
important claims.

### Agent input

Write the exact initial instruction and any later turns or triggers. State
context passed outside the instruction. The delivered request, extracted directly or saved as `instruction.md`, must
match either the approved input or the reviewed Draft input used under the
documented no-pause exception.

### Relevant agent conditions

Include only Harness behavior this Task depends on: tool interfaces, session
persistence, time, retries, or reconstruction differences. Do not repeat a
complete repository map in every Task.

### Environment

Describe initial state, relationships, visible and hidden information,
dependencies, access, identity, permissions, time, network, setup, readiness,
reset, and material production differences. Cite project evaluation knowledge used
by the design.

### Verification

For each settled required or prohibited result, state independent evidence, the exact
objective check or bounded semantic question, and its pass condition. List
accepted alternatives, the complete pass rule, and invalid-run conditions.

### Fairness and leakage

Explain why the Task is solvable, how the agent can find required information,
which shortcuts might work, and how hidden truth stays inaccessible. Name a
realistic wrong result and a collateral change that must fail.

## Review the Task and companion AGENTS.md with the human

Show the full Task Spec before building by default. Ask the human to review:

- whether the work and failure matter;
- whether the request is realistic;
- whether the Environment contains enough and only appropriate information;
- whether live, frozen, and simulated choices are acceptable;
- whether the evidence measures the intended outcome;
- whether valid alternatives are allowed;
- whether prohibited effects are complete; and
- whether cost, access, privacy, and safety are acceptable.

Mark `Status: Approved` only after explicit approval. If the user requested a
full build without another pause, continue with a Draft and label it honestly.
For companion changes, follow [Companion guidance](companion-guidance.md).

If implementation changes the request, visible information, material Environment
behavior, or scoring boundary, update the task definition, set its status to
Draft, show the diff, and obtain explicit reapproval before marking it Approved.

After implementation, use [Human review](review.md) for attributed feedback. Show representative trajectories,
final state, Verifier evidence, defects found, revisions made, results, and
remaining limits. A reviewed markdown design does not prove a good runnable
Task.

## Build a family

Default to proving one Task before multiplying similar cases; do not block an
already specified task set on a mandatory one-at-a-time sequence. Vary a
meaningful condition:

- longer or conflicting history;
- similar identities;
- missing or stale information;
- permission or policy boundary;
- required clarification;
- multiple valid outcomes;
- delayed or concurrent state;
- partial failure or retry; or
- greater collateral-change risk.

Keep the underlying work stable when comparing difficulty. Avoid shallow
instruction rewrites. For reusable discoveries, follow
[Companion guidance](companion-guidance.md).
