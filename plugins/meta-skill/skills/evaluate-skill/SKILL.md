---
name: evaluate-skill
description: Use when creating a skill eval suite, running skill evals, auditing eval evidence, or interpreting .meta-skill eval runs; not for rewriting skills, best-practice skill review, packaging, or installing.
---

# Evaluate Skill

Turn realistic skill-use requests into inspectable behavior evidence. This lane helps an agent author `.meta-skill/evals/`, run them through the Meta Skill runner, and interpret the saved `.meta-skill/runs/` evidence without rewriting, packaging, or editing the skill under test.

## Reference Map

| Need | Read |
|---|---|
| Writing strong eval tasks and criteria | [eval-authoring.md](references/eval-authoring.md) |

For CLI evidence semantics, use the shared Meta Skill reference at `../../references/cli-conventions.md`. For isolated subagent sampling patterns, use `../../references/subagent-patterns.md`.

## Beginner Path

```bash
meta-skill project init .
# Fill .meta-skill/eval-scenarios.md first if using scenario-plan generation.
meta-skill evals create .
meta-skill lint .
meta-skill run .
```

`meta-skill evals create` reads optional `.meta-skill/eval-scenarios.md` planning rows and drafts `.meta-skill/evals/<slug>/task.md` plus `.meta-skill/evals/<slug>/criteria.json`. Directly authored eval folders are equally valid. Before running, refine `task.md` into a request an end user or maintainer would plausibly write, and refine `criteria.json` into binary questions answerable from saved evidence, human review, or explicitly captured validation output. Put optional solver-visible files under `fixtures/`; task text can refer to them as `fixtures/<file>`. Use `## Task` for the first turn and `## Turn 2`, `## Turn 3`, and later headings only for realistic follow-up turns.

## Operating Rules

- Evals measure behavior; they do not apply source edits.
- By default, the runner attaches the current portable payload on the first turn. Treat the result as mounted-skill behavior evidence, not proof of natural trigger routing or writable file behavior.
- A run evaluates one source at a time: the current payload, or a no-skill control with `--no-skill`.
- Criteria are evaluator-only evidence in `criteria.json`; never stage criteria, expected answers, scoring notes, or parent hypotheses into solver workspaces.
- Solver prompts should read like normal user requests. They must not tell the solver it is running a test, benchmark, grader pass, or self-eval case.
- Deterministic tests are executable files directly under `.meta-skill/tests/`; do not create nested test folders.
- Token usage is measured telemetry, not a quality score. Token cost is recorded in `transcript.json`.
- Multi-turn eval totals come from App Server cumulative `tokenUsage.total` on the final turn; inspect `rpc.jsonl` for per-turn token events.
- If App Server does not return exact metrics, the evidence says unavailable explicitly with a reason.
- Managed App Server requests are not retried with backoff or jitter. A process-exit failure may get one eval-level respawn attempt before the run records the execution error.
- `rpc.jsonl` is the durable raw App Server trace for an eval. The runner keeps bounded in-memory event windows only for extraction. If those windows overflow, inspect `rpc.jsonl`; `transcript.json` records a warning item, and `response.md` says the final answer is unavailable when final assistant deltas were not retained for the current turn.
- Completed execution is not a pass verdict. Report what ran, execution errors, saved evidence paths, measured token totals, token usage availability, and review-required score totals from the run result.
- When using subagents to sample tasks or review evidence, keep them isolated and read-only. The parent agent owns scoring, edits, validation, and final synthesis.

## Eval Design

Start from observed failures, user feedback, saved traces, or a focused scenario plan. Use optional `.meta-skill/eval-scenarios.md` planning when you need to distill a high-level source into candidate scenarios, then generate or author three to five concrete evals under `.meta-skill/evals/`.

Each eval folder contains:

1. `task.md`: solver-visible title, problem description, output specification, first turn, and real follow-up turns. It should not contain `Capability:` or `Topics:` metadata.
2. `criteria.json`: evaluator-only JSON for fixtures, tests, metadata, and criteria objects with `criterion`, `phase`, `dimension`, `question`, `evidence`, and optional `max_score`.

Good evals cover normal workflow, hard ambiguity, source-grounding, and safe-stop behavior. Criteria should include Quality, Implementation, and Validation dimensions, then add only scenario-specific dimensions that measure the expected skill lift. Write questions that can be answered from `response.md`, `transcript.json`, `rpc.jsonl`, declared artifacts, human review, or explicitly captured validation command output. Fixtures are optional; use them only when the task depends on provided files, source packets, screenshots, or generated evidence such as a review worksheet.

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
