---
name: skill-eval
description: Use when setting up, running, auditing, or interpreting App Server-backed eval cases for reusable skills with `meta-skill run`; not for rewriting skills, best-practice skill review, packaging, or installing.
---

# Skill Eval

Measure a reusable skill with `.meta-skill/cases/` and `.meta-skill/runs/`. This lane sets up manually authored cases, runs Codex App Server-backed evidence collection, and inspects saved run evidence. It does not rewrite, package, or edit the skill.

## Reference Map

| Need | Read |
|---|---|
| Eval command examples and evidence semantics | [cli.md](references/cli.md) |

## Beginner Path

```bash
meta-skill project init .
meta-skill lint .
meta-skill run .
```

Case folders live at `.meta-skill/cases/<ID-slug>/` and require one `case.md`. Put optional solver-visible files under `fixtures/`; use `## Task` for the first turn and `## Turn 2`, `## Turn 3`, and so on for real follow-up user turns.

## Operating Rules

- Case evals measure behavior; they do not apply source edits.
- By default, the runner force-attaches the current portable payload on the first turn. Treat runs as mounted-skill behavior evidence, not proof of true trigger routing or writable file behavior.
- A run evaluates exactly one source: the current payload or no skill with `--no-skill`.
- Criteria are evaluator evidence in `case.md` frontmatter and must not be staged into solver workspaces.
- Deterministic tests are executable files directly under `.meta-skill/tests/`; do not create nested test folders.
- Token usage is measured telemetry, not a quality score. Token cost is recorded in `turn-evidence.json`.
- Multi-turn case totals come from App Server cumulative `tokenUsage.total` on the final turn; inspect `rpc.jsonl` for per-turn token events.
- If App Server does not return exact metrics, the evidence says unavailable explicitly with a reason.
- Managed App Server requests are not retried with backoff or jitter. A process-exit failure may get one case-level respawn attempt before the run records the execution error.
- `rpc.jsonl` is the durable raw App Server trace for a case. The runner keeps bounded in-memory event windows only for extraction. If those windows overflow, inspect `rpc.jsonl`; `turn-evidence.json` records a warning item, and `final.md` says the final answer is unavailable when final assistant deltas were not retained for the current turn.
- `meta-skill run --type` accepts only `R`, `F`, and `G`. Current eval guidance uses manually authored cases, one execution source per run, and read-only App Server evidence.
- Completed execution is not pass proof. Report what executed, execution errors, saved evidence paths, measured token totals, and token usage availability.

## Case Design

Start with 3-5 cases:

1. `R` regression: a normal task the skill should handle.
2. `F` failure mode: a hard, ambiguous, or multi-turn behavior.
3. `G` gate: approval, safe stop, or safe default.
4. Source-grounding case when the skill depends on files.

Prefer deterministic tests when code can answer the question. Use manual review of `final.md` and `turn-evidence.json` for subjective qualities.

## Inspect Evidence

Run evidence lives under:

```text
.meta-skill/runs/<run-id>/
```

Inspect `cases/<case>/case.md`, `cases/<case>/rpc.jsonl`, `cases/<case>/turn-evidence.json`, and `cases/<case>/final.md`.

If the user wants to turn evidence into edits, hand off to `skill-improve` with the run ID, case ID, saved evidence file, and observed issue.

## Output

For setup or run help, return the next command, what it reads or writes, and where evidence will live.

For interpretation, summarize selected cases, executed cases, execution errors, saved evidence paths, measured token totals, token usage availability, skipped lint, and the next useful step. Do not describe execution as pass/fail unless quoting a deterministic test result.
