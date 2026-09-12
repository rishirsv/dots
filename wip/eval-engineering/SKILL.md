---
name: eval-engineering
description: Inspect agent or skill source and traces, guide Task design and isolated runs, collect human review, and build independent Verifiers. Use for agent and skill evals, benchmark design, invocation tests, candidate comparison, judge creation, calibration, and reusable project evaluation knowledge.
---

# Eval Engineering

Inspect agent or skill behavior, design fair tasks, run the approved evaluation,
and help the user decide what the evidence supports.

## Communicating with the User

Meet the user where they are. Inspect supplied skills, tasks, workspaces, and
results before asking questions those inputs can answer. Establish whether they
want to create tasks, collect a baseline, review outputs, build a judge, compare
skills, improve a candidate, or resume unfinished work. Enter at that stage and
reuse settled decisions.

Be a practical partner, not a configuration questionnaire. Explain choices
through what the user will see and what the result could establish. Recommend
one next action and ask only questions whose answers change it. State the
current stage, what is ready, and the next decision in plain language.

Before inference, show the tasks, visible workspace and skills, runner, model
and reasoning settings, number of trials, limits, maximum expected cost, and
data destinations. Reuse approval that still covers the work; seek approval for
material changes. Design approval is not permission to run models or publish
results.

## Workflow

For a new evaluation, recommend **tasks → baseline → human review → agreed
criteria → checked judge, if useful → improvement and comparison**. This is a
default, not a required sequence. Existing criteria can support immediate
grading; human-only review does not require an automated judge.

For a simple prompt skill, provide tasks, prepare the skill and inputs, run
after approval, review the outputs, and record feedback. Do not ask users to
decline judges, numeric scoring, simulations, or companion knowledge maintenance.
Introduce them only when they answer a concrete need.

Read the reference for the current decision before doing that work. References
own the detailed instructions; follow their links for prerequisites rather than
loading the whole library.

| Decision | Owner |
|---|---|
| Inspect source, traces, dependencies, access, and existing evals | [Discovery](references/discovery.md) |
| Choose tasks, define inputs and success, review or revise the spec | [Task design](references/task-design.md) |
| Build services, state, data boundaries, and reset | [Environment building](references/environment-building.md) |
| Create structured or natural-language data | [Synthetic data](references/synthetic-data.md) |
| Build independent checks and calibrate an automated judge | [Verifier design](references/verifier-design.md) |
| Store, prepare, preflight, and run a task package | [Task running](references/task-running.md) |
| Choose a runner, enforce host boundaries, test skill invocation | [Runners](references/runners.md) |
| Audit trajectories, classify failures, assess task fairness | [Calibration](references/calibration.md) |
| Collect attributed human feedback and confirm criteria | [Human review](references/review.md) |
| Implement a local single-output or blind A/B review surface | [Review UI](references/review-ui.md) |
| Compare candidates, regrade consistently, and decide on a revision | [Comparison](references/comparison.md) |
| Read or maintain reusable project evaluation knowledge | [Companion guidance](references/companion-guidance.md) |
| Adapt a domain benchmark design | [Benchmark patterns](references/patterns.md) |
| Build multi-turn conversations | [Multi-turn simulation](references/multi-turn-simulation/guide.md) |
| See knowledge learned across two tasks | [Service-desk example](references/examples/service-desk.md) |

## Terms

- **Task:** the request, starting Environment, and intended outcome.
- **Task definition:** a shared task list or detailed spec. Throughout the
  references, `Task.md` means the chosen definition, not a mandatory file format.
- **Harness:** the complete agent under evaluation, including prompts, model
  loop, tools, hooks, memory, sessions, and adapter.
- **Environment:** the files, data, services, identity, permissions, network,
  clock, and mutable state around the Harness.
- **Verifier:** independent checks that score the result or mark a run invalid.
- **Companion guidance:** reusable evaluator instructions separate from candidates.

## Complete the requested stage

- **Design:** deliver reviewed or explicitly Draft specs, the workspace and
  runner plan, and pending decisions. Do not launch trials.
- **Baseline:** audit approved runs and present artifacts, invocation evidence,
  and remaining uncertainty without inventing scores.
- **Review:** preserve attributed feedback and summarize confirmed criteria and
  open questions. A judge is not required.
- **Scored evaluation:** report task paths, run commands, results, inspected
  evidence, and unresolved limits after the applicable preflight and audit.
- **Comparison:** give the supported adoption recommendation and tradeoffs,
  retaining the accepted version unless adoption was authorized.

Creating companion guidance is not a completion gate for these entry points.
On resume, inspect saved state and continue the next unfinished action within
the user's scope rather than restarting the workflow.
