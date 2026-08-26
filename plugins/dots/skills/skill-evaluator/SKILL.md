---
name: skill-evaluator
description: "Inspects agent skills and prior runs, writes and audits evaluation suites, runs fresh workers, validates graders, analyzes failures, and maintains local benchmarks. Use for behavioral evaluation; not for skill source changes, static review, or plugin packaging."
---

# Skill evaluator

## Flow

- Inspect the target skill, existing suites and runs, supplied traces, target
  host, and user goal before proposing evaluation work.
- For a new evaluation, draft a plan and a small set of cases grounded in real
  work or observed failures. Show the plan to the user and revise it before
  running scored or repeated trials, spending meaningful money, or changing an
  external system.
- Validate the approved suite, freeze the exact configuration and dependency
  hashes, and check worker isolation, hidden data, permissions, reset behavior,
  timeout, and cost.
- Give each fresh worker the realistic task, intended skill, visible inputs,
  tools, and output directory. Keep criteria, expected answers, comparison
  identity, and other runs hidden.
- Inspect the outputs and final state. Classify setup, fixture, grader, and
  infrastructure failures before scoring the skill. Fix those evaluation
  failures and rerun only affected trials.
- Review results with the user. Use chat for compact evidence and the local
  review page for larger sets, blind pairs, traces, visual artifacts, or grader
  disagreements. Write an immutable receipt only when requested.

When the user asks for one stage, start there. Go back to planning only when the
requested work lacks a prerequisite needed for a valid result.

## Terms

- **Evaluation plan:** the human-reviewed goal, cases, configurations, scoring,
  permissions, run limits, and conclusions the evaluation may support.
- **Suite:** the reusable `eval.md`, `cases.json`, fixtures, and graders.
- **Run:** an immutable suite snapshot plus the resolved configuration,
  dependency hashes, trials, assessments, and evidence.
- **Worker:** a fresh Claude or Codex agent that completes one case without
  seeing the evaluation design or other results.
- **Grader:** an independent deterministic check, semantic judge, or qualified
  human decision tied to an observable criterion.

## Reference routing

Read the reference for the work in front of you:

| Need | Read |
|---|---|
| Inspect evidence, choose evaluation depth, or write a new plan | [Planning](references/planning.md) |
| Audit an existing suite, grader, run, or evaluation process | [Audit](references/audit.md) |
| Find recurring failures in traces or outputs | [Error discovery](references/error-discovery.md) |
| Generate cases for a specific real-data gap | [Synthetic data](references/synthetic-data.md) |
| Choose cases or compare configurations | [Case design](references/case-design.md) |
| Preflight and run an approved suite | [Execution](references/execution.md) |
| Build, validate, or use graders | [Grading](references/grading.md) |
| Review many, paired, visual, or trace-heavy outputs | [Review interface](references/review-interface.md) |
| Test whether a host selects the skill | [Trigger evaluation](references/trigger-evaluation.md) |
| Evaluate retrieval and generation in a RAG skill | [RAG evaluation](references/rag.md) |
| Create suite files, track approval and freshness, or write a receipt | [Artifacts](references/artifacts.md) |

Read [skill-practices.md](../../references/skill-practices.md) when deciding what
good behavior looks like for the target skill.

## Boundaries

Use `skill-standards` for skill creation, source changes, and static review. If
the request is about source rather than behavior, load that skill and do not
continue with an evaluation. This boundary still applies when the user invoked
`skill-evaluator` explicitly.

Keep evaluation files local. The active Claude or Codex environment runs
workers; this skill does not add a model client, Harbor, containers, a hosted
service, or its own agent runtime. An approved task may still use its normally
permitted tools. Plugin packaging, installation, publication, and sync remain
separate work.

## Complete only when

- every planned trial is Completed, Invalid, Cancelled, or Not Run;
- the report shows missing and partial evidence instead of scoring it;
- conclusions name the tested cases and configurations and do not extend past
  them;
- blind decisions were saved before identities were revealed; and
- suite files and optional receipts point to the exact evidence reviewed.
