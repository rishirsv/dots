# Control Matrix

Use this when deciding where a finding, lesson, or requested rule belongs.

## Control Types

| Type | Guides agents | Senses correctness |
|---|---|---|
| Computational | setup scripts, generators, templates, fixtures, command helpers | tests, linters, typechecks, link checks, build checks, CI, screenshots |
| Inferential | `AGENTS.md`, README, CONTRIBUTING, architecture docs, runbooks, plans | review checklists, QA notes, retrospectives, handoff notes |

Prefer computational controls for repeated, checkable failures. Use inferential
controls for judgment, routing, context, and boundaries that cannot be cheaply
checked.

## Placement Table

| Need | Preferred surface |
|---|---|
| Repo-wide agent routing | root `AGENTS.md` or local equivalent |
| Subtree-only rule | nearest nested instruction file |
| Human setup or contribution workflow | README, CONTRIBUTING, docs, runbook |
| Task-local state | existing plan/ledger path, otherwise ignored `.plans/` |
| Repeated deterministic failure | test, linter, hook, script, schema, typecheck, CI |
| Generated/source boundary | root instruction plus generator/check command |
| Validation expectation | command map, CI doc, or executable check |
| Architecture orientation | architecture map or docs index |
| Cross-repo memory/session lesson | `self-improve`, not this skill |
| One-off or obsolete issue | no durable control |

## Validation Selection

| Control changed | Validation signal |
|---|---|
| `AGENTS.md`, Markdown docs, plans, or ledgers | Run `check_harness_links.py` on touched files. |
| Setup or command map | Run the documented command, or mark it candidate with the reason it was not verified. |
| Helper script | Run `python3 -m py_compile` plus the script's narrowest sample command. |
| Test, hook, linter, typecheck, build, or CI control | Run the targeted local check and state any CI-only gap. |
| Generated/source boundary | Run the generator/check command, or report the missing mechanical guard. |

## AGENTS.md Rules

Good root instruction files are short maps. They should include only:

- source and generated boundaries;
- commands agents must run after specific changes;
- approval gates and forbidden edits;
- links to deeper docs;
- local conventions that are not obvious from code;
- pointers to nested instruction files.

Avoid:

- duplicating README or CONTRIBUTING;
- long tutorials;
- general coding advice;
- temporary task preferences;
- rules better enforced by tests, hooks, scripts, or CI;
- conflicting instructions at different scopes.

## Strength Ladder

Use the lowest-noise control that will actually prevent or reduce the failure:

1. No durable change.
2. Task-state note.
3. Existing docs/runbook update.
4. Root or nested instruction map update.
5. Setup/helper script.
6. Test, lint, schema, generated-file, or link check.
7. CI/pre-commit gate.

Skip upward when the failure is repeatable and checkable.

## Control Review Checklist

Before proposing or editing:

- Is this repo-scoped?
- Is this the narrowest scope?
- Is there already a source of truth?
- Would a mechanical check be better than prose?
- Will future agents see it at the right time?
- Can it become stale? If yes, how will stale state be detected?
- Does it conflict with existing instructions?
- What validation proves the control works?
