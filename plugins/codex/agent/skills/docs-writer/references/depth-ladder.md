# Depth Ladder

Use the smallest documentation depth that lets the next reader act safely.

## Levels

| Level | Use when | Typical output | Verification |
|---|---|---:|---|
| **S — Tiny patch** | Existing owner doc exists; one stale command/path/link/term; narrow user request; no new concept. | 1-10 changed lines. | Verify touched command, path, link, or source fact only. Preserve style exactly. |
| **M — Durable update** | Existing doc needs a new workflow, section, runbook, migration note, API behavior, module explanation, or session-derived decision. | 10-80 changed lines. | Verify relevant source files, tests/config/scripts, direct links, and at least one example or command when applicable. |
| **L — Comprehensive doc/scaffold** | No owner doc exists; onboarding is blocked; architecture/session decisions cross modules; public API, PRD, project spec, ExecPlan, or migration is material. | 80-250 lines unless the doc type requires more detail. | Verify representative commands, links, paths, examples, schemas/specs, source-of-truth files, and uncertainty. Update indexes. |

## Promotion Rules

Start at **S**.

Promote to **M** if:

- a reader still cannot complete the task from the existing doc after a tiny patch
- the update introduces a new stable concept, workflow, command group, route, API behavior, or operational procedure
- session capture produced a durable decision that needs context and constraints

Promote to **L** only if:

- no owner doc exists
- the subject crosses modules or user roles
- the doc must establish a durable map, contract, migration path, or runbook from scratch
- existing docs are too stale to repair locally

Demote whenever:

- a link, table row, short note, or local section is enough
- the user asked for a narrow fix
- source evidence is too thin for broad claims
- a generated source of truth already exists and needs only a pointer plus human context

## Reader Mode Check

| Reader mode | Documentation shape |
|---|---|
| Reader orienting | README or module overview; purpose, fast path, where to look next. |
| Reader doing work | How-to/runbook; numbered steps, commands, expected signals. |
| Reader integrating | API docs; contract, examples, errors, side effects, versioning. |
| Reader deciding product scope | PRD; problem, outcome, users/jobs, scope, acceptance criteria, risks. |
| Reader understanding a long-standing feature | Canonical feature/domain doc; simple version, surfaces, how it works, ownership, data/state, acceptance, verification. |
| Reader implementing complex work | ExecPlan; self-contained context, milestones, concrete commands, validation, recovery. |
| Reader implementing a system contract | Project spec; normative requirements, domain model, lifecycle, interfaces, safety, recovery. |
| Reader understanding a decision | ADR / decision record; decision, context, options considered, consequences, validation. |
| Reader upgrading | Migration notes; affected versions, pre-checks, sequence, rollback. |
| Reader evaluating design | Architecture or DESIGN; boundaries, trade-offs, constraints, tokens. |
| Future agent acting | AGENTS; terse rules, edit boundaries, validation loop. |

## Output Discipline

- **S:** no new broad sections unless the existing doc already has that pattern.
- **M:** one coherent section or a short set of linked updates.
- **L:** scaffold the owner doc, but omit irrelevant sections and remove placeholders.
