---
name: skill-eval
description: Use when setting up, running, auditing, or interpreting App Server-backed scenario evals for reusable skills with `meta-skill eval`; not for rewriting skills, best-practice skill review, packaging, installing, or promoting releases.
---

# Skill Eval

Measure a reusable skill with `.meta-skill/evals/` scenario runs. This lane sets up scenarios, runs Codex App Server-backed evals, inspects evidence, imports feedback, and runs optional App Server-backed judges. It does not rewrite or promote the skill.

## Reference Map

| Need | Read |
|---|---|
| Exact eval command syntax and examples | [cli.md](references/cli.md) |
| Scenario, run, feedback, and evidence file shapes | [review-files.md](references/review-files.md) |
| Designing useful scenario coverage and deterministic tests | [review-design.md](references/review-design.md) |
| Human-authored judge prompts and rubrics | [judge-prompts.md](references/judge-prompts.md) |

## Beginner Path

```bash
meta-skill project init .
meta-skill eval init .
meta-skill lint .
meta-skill eval run .
meta-skill eval open .
```

Scenario folders live at `.meta-skill/evals/scenarios/<ID-slug>/` and require `task.md`, `scenario.json`, and `criteria.json`. Use `turns.json` for real follow-up user turns.

## Operating Rules

- Scenario evals measure behavior; they do not apply source edits.
- Candidate is the portable skill payload at the project root.
- Release comparison is explicit: `meta-skill eval run . --compare release`.
- Release comparison uses `.meta-skill/versions/release/skill/`, not stale output from an old run.
- Multi-turn scenarios must use `task.md` for the first turn and `turns.json` for follow-up turns.
- Deterministic tests belong in `.meta-skill/tests/manifest.json` and may annotate saved run evidence with `meta-skill lint . --run <run-id>`.
- Judges are optional because they cost tokens; ask before running them unless the user explicitly requests judge scoring or passes `--with-judges`.
- Token usage must be recorded when available; if App Server does not return exact metrics, the evidence should say unavailable explicitly.

## Scenario Design

Start with 3-5 scenarios:

1. `R` regression: a normal task the skill should handle.
2. `F` failure mode: a hard, ambiguous, or multi-turn behavior.
3. `T` trigger: activation or non-activation boundary.
4. `G` gate: approval, safe stop, or safe default.
5. Source-grounding or artifact scenario when the skill depends on files.

Prefer deterministic tests before judges. Use judges only for subjective qualities such as usefulness, source faithfulness, tone fit, recommendation quality, or handling ambiguity.

## Inspect Evidence

Run evidence lives under:

```text
.meta-skill/evals/runs/<run-id>/
```

Inspect `report.html` first, then drill into `events.jsonl`, `results.jsonl`, `tests.jsonl`, `grades.jsonl`, `feedback.jsonl`, and `scenarios/<scenario>/<side>/`.

If the user wants to turn evidence into edits, hand off to `skill-improve` with the run ID, scenario ID, first-failure note, test or judge result, and any human feedback.

## Output

For setup or run help, return the next command, what it reads or writes, and where evidence will live.

For interpretation, summarize selected scenarios, sides, pass/fail/needs-review/error counts, token usage availability, skipped lint or judges, and the next useful step.
