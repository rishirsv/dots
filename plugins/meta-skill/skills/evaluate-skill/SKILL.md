---
name: evaluate-skill
description: Use when setting up, running, auditing, or interpreting .meta-skill evals for reusable skills; not for rewriting skills, best-practice skill review, packaging, or installing.
---

# Evaluate Skill

Measure a reusable skill with `.meta-skill/evals/` and `.meta-skill/runs/`. This lane sets up manually authored evals, runs evidence collection, and inspects saved run evidence. It does not rewrite, package, or edit the skill.

## Reference Map

| Need | Read |
|---|---|
| Eval command examples and evidence semantics | [cli-conventions.md](../../references/cli-conventions.md) |
| Writing strong eval tasks and criteria | [eval-authoring.md](references/eval-authoring.md) |
| Running isolated subagent samples or reviews | [subagent-patterns.md](../../references/subagent-patterns.md) |

## Beginner Path

```bash
meta-skill project init .
# Fill .meta-skill/eval-scenarios.md first if using scenario-plan generation.
meta-skill evals create .
meta-skill lint .
meta-skill run .
```

`meta-skill evals create` reads optional `.meta-skill/eval-scenarios.md` planning rows and creates draft `.meta-skill/evals/<slug>/task.md` and `.meta-skill/evals/<slug>/criteria.json` files. You can also author concrete eval folders directly. Refine both files before running: `task.md` should read like a real user request, and `criteria.json` should contain binary questions that can be answered from saved evidence or explicitly captured validation output. Put optional solver-visible files under `fixtures/`; task text can refer to them as `fixtures/<file>`. Use `## Task` for the first turn and `## Turn 2`, `## Turn 3`, and so on for real follow-up user turns.

## Operating Rules

- Evals measure behavior; they do not apply source edits.
- By default, the runner force-attaches the current portable payload on the first turn. Treat runs as mounted-skill behavior evidence, not proof of true trigger routing or writable file behavior.
- A run evaluates exactly one source: the current payload or no skill with `--no-skill`.
- Criteria are evaluator evidence in `criteria.json` and must not be staged into solver workspaces.
- Deterministic tests are executable files directly under `.meta-skill/tests/`; do not create nested test folders.
- Token usage is measured telemetry, not a quality score. Token cost is recorded in `transcript.json`.
- Multi-turn eval totals come from App Server cumulative `tokenUsage.total` on the final turn; inspect `rpc.jsonl` for per-turn token events.
- If App Server does not return exact metrics, the evidence says unavailable explicitly with a reason.
- Managed App Server requests are not retried with backoff or jitter. A process-exit failure may get one eval-level respawn attempt before the run records the execution error.
- `rpc.jsonl` is the durable raw App Server trace for an eval. The runner keeps bounded in-memory event windows only for extraction. If those windows overflow, inspect `rpc.jsonl`; `transcript.json` records a warning item, and `response.md` says the final answer is unavailable when final assistant deltas were not retained for the current turn.
- Current eval guidance uses manually authored evals, one execution source per run, and read-only App Server evidence.
- Completed execution is not pass proof. Report what executed, execution errors, saved evidence paths, measured token totals, token usage availability, and review-required scores from the run result.
- When using subagents to sample eval tasks, follow [subagent-patterns.md](../../references/subagent-patterns.md): keep criteria and expected answers out of the subagent context, keep the subagent read-only, and make the task prompt read like a real user request rather than a test or benchmark instruction.

## Eval Design

Start from concrete evals under `.meta-skill/evals/`, or use optional `.meta-skill/eval-scenarios.md` planning when you need a high-level source distillation and Scenario Plan table first. Then generate or author 3-5 evals.

Each eval folder contains:

1. `task.md`: solver-visible title, problem description, output specification, first turn, and real follow-up turns. It should not contain `Capability:` or `Topics:` metadata.
2. `criteria.json`: evaluator-only JSON for fixtures, tests, metadata, and criteria objects with `criterion`, `phase`, `dimension`, `question`, `evidence`, and optional `max_score`.

Good evals cover normal workflow, hard ambiguity, source-grounding, and safe-stop behavior. Criteria should include the shared base dimensions across Quality, Implementation, and Validation, then add only skill-specific dimensions needed by the scenario. Write questions that can be answered from `response.md`, `transcript.json`, `rpc.jsonl`, declared artifacts, human review, or explicitly captured validation command output. Fixtures are optional; use them only when the task depends on provided files, source packets, screenshots, or generated evidence such as a review worksheet.

Prefer deterministic tests when code can answer the question, but remember they run through `meta-skill lint`; their output is command evidence unless you explicitly save or quote it in the handoff. Use manual review of `response.md` and `transcript.json` for subjective qualities. Runs do not write separate score files; scoring metadata is returned by the run command and remains review-required until a human or scorer assigns evidence-backed scores.

## Inspect Evidence

Run evidence lives under:

```text
.meta-skill/runs/<run-id>/
```

Inspect `cases/<eval>/task.md`, `cases/<eval>/rpc.jsonl`, `cases/<eval>/transcript.json`, and `cases/<eval>/response.md`. Use the returned criteria fingerprint to connect the run back to source `.meta-skill/evals/<eval>/criteria.json`.

If the user wants to turn evidence into edits, hand off to `improve-skill` with the run ID, eval ID, saved evidence file, and observed issue.

## Output

For setup or run help, return the next command, what it reads or writes, and where evidence will live.

For interpretation, summarize selected evals, executed evals, execution errors, saved evidence paths, measured token totals, token usage availability, review-required score totals, skipped lint, and the next useful step. Do not describe execution as pass/fail unless quoting a deterministic test result or completed scorer output.
