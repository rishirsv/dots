# Control Taxonomy

Read this when deciding where a harness improvement belongs.

Harness controls do two jobs:

- Guide future work before it starts.
- Sense whether work is correct after or during execution.

Controls also vary by whether they are deterministic or judgment-based. Choose
the smallest control that changes future behavior.

## Control Types

| Type | Use for | Examples |
|---|---|---|
| Computational guide | Repeatable setup or generation that should not depend on memory. | setup scripts, command discovery, templates, generators, fixtures |
| Inferential guide | Judgment, routing, or context a capable agent should read before acting. | `AGENTS.md`, skills, architecture docs, plans, runbooks |
| Computational sensor | Machine-checkable correctness or drift signals. | tests, linters, typechecks, link checks, build checks, CI, screenshot/canvas checks |
| Inferential sensor | Review or evaluation that needs judgment. | code review, design review, QA notes, task retrospectives, specialist subagents |

Prefer computational controls when the failure is deterministic and repeated.
Prefer inferential controls when the failure depends on context, tradeoffs, or
judgment.

## Placement Rules

| Finding | Best first surface |
|---|---|
| Future agents miss repo-wide workflow constraints | root instruction entrypoint or repo docs |
| The rule only applies under one subtree | nested instruction file or local docs |
| Humans also need the knowledge | README, contributing docs, runbook, or setup docs |
| The behavior is portable across repos | skill |
| A command, link, schema, or formatting error is checkable | script, test, hook, linter, or CI |
| A task needs resumable state | plan or progress ledger |
| A review lesson is still uncertain | plan note or follow-up, not a permanent rule |

## Strength Ladder

Use the lightest effective control first:

1. Inline note in the current plan.
2. Progress ledger entry.
3. README or task docs.
4. Instruction entrypoint.
5. Skill guidance.
6. Script or template.
7. Test, hook, linter, or CI gate.

Move down the ladder only when the weaker control will likely fail again.

## Audit Questions

- Does a future agent know how to start the app or task?
- Does the repo expose setup, lint, test, build, typecheck, and dev-server
  commands?
- Is the progress state durable enough for a fresh thread to resume?
- Are acceptance criteria observable rather than aspirational?
- Are browser or UI checks specified when the task changes a rendered surface?
- Are repeated failures enforced mechanically when possible?
- Is the instruction entrypoint short enough to stay current?
- Are generated or synced files identified so agents edit sources instead?
