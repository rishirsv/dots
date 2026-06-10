# Validation Checklist

Run the checks that match the change. Do not claim validation that was not performed.

## Always Check

- Owner doc exists and is the right durable location.
- No parallel doc was created for an existing concern.
- Paths, file names, headings, and links are correct.
- Commands include expected success signals where applicable.
- Placeholders were removed from generated docs.
- Stale nearby content discovered in scope was pruned or called out.
- Remaining uncertainty is documented in the handoff or in a `Known Gaps` section.

## By Document Type

| Type | Checks |
|---|---|
| README | quickstart command, install/run/test commands, config paths, docs index links |
| AGENTS | edit boundaries, validation loop, precedence/layering, no one-off memories |
| ARCHITECTURE | module map paths, dependency rules, diagrams, ADR/RFC links, verification commands |
| ADR / decision record | decision statement, context, considered options, consequences, owner path, links to affected docs/code |
| DESIGN | YAML validity, token references, duplicate headings, contrast claims, source evidence for tokens |
| PRD | correct depth selected, user/job clarity, in/out scope, user stories with agent-verifiable acceptance criteria, essential implementation notes, open questions |
| Canonical feature/domain doc | simple version, scope, surfaces, how-it-works walkthrough, ownership boundaries, data/state truth, diagrams if helpful, acceptance, verification |
| Work Tracker | only Active/Later/Done sections, Active items have Outcome/Plan/Proof, Later items have Outcome and Plan or `Plan: needed`, Done entries are one-liners |
| Plan | decision-complete summary, grouped implementation changes, test plan, assumptions, necessary public interfaces or stop rules |
| Project spec | normative language, goals/non-goals, domain model, lifecycle/state machine, interfaces, observability, recovery, implementation-defined behavior |
| Runbook | trigger, preconditions, ordered steps, expected signals, rollback, validation, escalation |
| API docs | generated spec/schema/code source, examples, errors, side effects, versioning, generated-doc build |
| Migration notes | affected versions, pre-checks, replacement map, rollback evidence, validation commands |
| Module docs | exported API docs, local commands, invariants, failure modes, links to generated docs |

## Host Repo Sync

When this skill is changed in the `agent` repo under `skills/docs-writer/`, run:

```sh
scripts/sync-plugins.sh
```

Do not hand-edit generated plugin packages under:

- `plugins/codex/agent/`
- `plugins/claude/agent/`

Review generated sync output separately from source skill changes.
