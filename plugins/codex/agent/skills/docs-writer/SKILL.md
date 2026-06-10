---
name: docs-writer
description: "Use when writing, updating, repairing, or distilling durable repo docs: README.md, AGENTS.md, ARCHITECTURE.md, DESIGN.md, PRDs, project specs, ADRs/decision records, Plans, runbooks, API docs, migration notes, and module docs. Covers style-preserving edits, doc-type standards, depth selection, and turning Codex sessions into durable docs. Not for design critique, code review, changelog automation, or one-off non-repo prose."
---

# Docs Writer

Write durable repository documentation that future maintainers, operators, users, and agents can rely on. Prefer the smallest useful edit, but make it complete enough that the next reader can act without reconstructing the session.

## Reference Map

| Need | Read |
|---|---|
| Choose the right document type and source standard | [references/doc-type-rules.md](references/doc-type-rules.md) |
| Choose tiny patch vs durable update vs comprehensive doc | [references/depth-ladder.md](references/depth-ladder.md) |
| Preserve voice, density, heading shape, and evidence posture | [references/writing-style.md](references/writing-style.md) |
| Distill a Codex interview/design session into durable docs | [references/session-capture.md](references/session-capture.md) |
| Scaffold or refine `DESIGN.md` format | [references/design-md-format.md](references/design-md-format.md) |
| Write a product requirements document | [references/prd-format.md](references/prd-format.md) |
| Write or update a Work Tracker | [references/work-tracker-format.md](references/work-tracker-format.md) |
| Write a Plan | [references/plan-format.md](references/plan-format.md) |
| Write a language-agnostic project or service specification | [references/project-spec-format.md](references/project-spec-format.md) |
| Write an ADR or decision record | [references/adr-format.md](references/adr-format.md) |
| Write operator runbooks | [references/runbook-format.md](references/runbook-format.md) |
| Write HTTP, event, JSON, SDK, or internal API docs | [references/api-docs-format.md](references/api-docs-format.md) |
| Write migration notes or upgrade guides | [references/migration-notes-format.md](references/migration-notes-format.md) |
| Write module-level docs and code-near docs | [references/module-docs-format.md](references/module-docs-format.md) |
| Validate the final documentation change | [references/validation-checklist.md](references/validation-checklist.md) |
| Seed a new `README.md` | [assets/README_template.md](assets/README_template.md) |
| Seed a new `AGENTS.md` | [assets/AGENTS_template.md](assets/AGENTS_template.md) |
| Seed a new `ARCHITECTURE.md` | [assets/ARCHITECTURE_template.md](assets/ARCHITECTURE_template.md) |
| Seed a new `DESIGN.md` | [assets/DESIGN_template.md](assets/DESIGN_template.md) |
| Seed a concise/default PRD | [assets/PRD_template.md](assets/PRD_template.md) |
| Seed a canonical feature/domain doc | [assets/FEATURE_SPEC_template.md](assets/FEATURE_SPEC_template.md) |
| Seed a full/detailed PRD | [assets/PRD_FULL_template.md](assets/PRD_FULL_template.md) |
| Seed a new Work Tracker | [assets/WORK_TRACKER_template.md](assets/WORK_TRACKER_template.md) |
| Seed a new Plan | [assets/PLAN_template.md](assets/PLAN_template.md) |
| Seed a new project spec | [assets/PROJECT_SPEC_template.md](assets/PROJECT_SPEC_template.md) |
| Seed a new ADR or decision record | [assets/ADR_template.md](assets/ADR_template.md) |
| Seed a new runbook | [assets/RUNBOOK_template.md](assets/RUNBOOK_template.md) |
| Seed API Markdown when generated specs are absent or need human context | [assets/API_DOC_template.md](assets/API_DOC_template.md) |
| Seed migration notes | [assets/MIGRATION_NOTES_template.md](assets/MIGRATION_NOTES_template.md) |
| Seed a module-level README | [assets/MODULE_README_template.md](assets/MODULE_README_template.md) |

## Scope

In scope:

- durable repository docs: `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `DESIGN.md`, runbooks, API docs, migration notes, and module-level docs
- durable product and planning docs: PRDs, project specs, ADRs/decision records, Work Trackers, and Plans when they are intended to be checked in or handed off as the source of truth for future work
- style-preserving doc updates that match an existing document's voice, density, headings, and examples
- repairing drift in touched docs: stale commands, paths, links, snippets, module names, configuration, and validation steps
- choosing the right durable owner doc for knowledge created during a Codex design, interview, or implementation session
- scaffolding `DESIGN.md` for AI coding agents

Not in scope:

- design critique or polish on rendered UI
- throwaway plans, private task lists, roadmap memos, or planning artifacts that are not meant to become durable repo/project documentation
- code review, refactoring, or feature implementation
- marketing copy, slide narratives, proposals, or non-repository prose
- changelog generation unless the task is specifically migration-note or release-documentation work

## Core Workflow

1. **Identify the reader and job.** Name whether the reader is a user, contributor, maintainer, operator, API consumer, migration owner, or future agent.
2. **Choose the owner document.** Update the closest existing owner before creating a sibling. If no owner exists, choose the smallest durable location.
3. **Choose depth.** Start at a tiny patch. Promote only when the reader cannot act safely from a smaller edit. Use [references/depth-ladder.md](references/depth-ladder.md).
4. **Load type-specific rules.** For the chosen doc type, read the matching reference. Use standards as constraints, not bulky templates.
5. **Verify before writing.** Read relevant code, tests, config, scripts, generated specs, existing docs, and session evidence. Do not document guessed behavior.
6. **Write with source evidence.** Prefer commands, paths, examples, tables, contracts, and success signals over broad prose.
7. **Prune nearby drift.** Remove stale, duplicate, or now-conflicting guidance discovered in the same scope.
8. **Repair the doc graph.** Update direct inbound links, README doc indexes, module indexes, and references in the touched area.
9. **Validate.** Check links, paths, commands, examples, schemas, snippets, and source-of-truth boundaries. Mark anything material that remains unverified.
10. **Report cleanly.** State docs changed, reader, evidence checked, validation run, and remaining uncertainty.

## Document Type Router

| Signal | Durable owner | Runtime posture |
|---|---|---|
| Newcomer needs purpose, setup, usage, common commands, or doc map | `README.md` | welcoming, fast path first, command-backed |
| Future agents or contributors need every-session operating rules | `AGENTS.md` | terse, imperative, rule-shaped |
| Stable boundaries, flows, dependencies, or invariants are non-obvious | `ARCHITECTURE.md` | explanatory, boundary-focused, view-aware |
| Coding agents need visual identity, tokens, components, or design-system rules | `DESIGN.md` | token-precise, concrete, accessibility-aware |
| Product owner needs the why, user problem, scope, acceptance criteria, and open decisions | PRD | concise by default, outcome-first, implementation-light |
| Long-standing feature or main app domain needs one durable explainer for how it works | canonical feature/domain doc | simple walkthrough, ownership-aware, diagram-friendly |
| Maintainer needs to choose and sequence work items | Work Tracker | queue-shaped, concise, proof-oriented |
| Implementer needs a decision-complete implementation handoff | Plan | compact, evidence-backed, testable |
| Team needs a normative language-agnostic contract for a system, service, workflow, or application | project spec | RFC-style, requirement-heavy, boundary-explicit |
| Maintainers need durable rationale for a hard-to-reverse or surprising decision | ADR / decision record | concise, decision-first, trade-off-aware |
| Operator must repeat a known procedure | runbook | sequential, rollback-aware, expected-signal driven |
| Consumer must call, publish, subscribe to, or implement an interface | API docs | contract-first, explicit errors and side effects |
| User must adapt to breaking or compatibility-affecting change | migration notes | caution-first, version-specific, reversible where proven |
| Local package/module boundary needs explanation | module-level docs | local, minimal, code-near |

## Standards Posture

- Treat format references as constraints, not as full structures to copy.
- For Plans, read [references/plan-format.md](references/plan-format.md) before authoring one and keep the result compact and decision-complete.
- Say when a document type is conventional rather than standardized. Use the closest durable project pattern and avoid pretending the file name is universal.
- Prefer project-owned source of truth over a generic template.
- Generated specs, code comments, and source files outrank handwritten docs when behavior conflicts.
- Do not duplicate generated API reference unless adding human context, examples, failure modes, or migration guidance.

## Style Posture

Before editing an existing doc, sample:

- heading depth and casing
- sentence and paragraph length
- list style and table density
- command/example shape
- voice: imperative, declarative, narrative, terse, or explanatory
- evidence style: links, paths, commands, tests, generated references, or citations

Mirror the sampled style unless it blocks clarity or correctness. If the existing style is internally inconsistent, make the smallest coherent local choice and mention the conflict in the handoff.

For new docs, use neighboring docs in the same directory first, then the templates in `assets/`. Delete all irrelevant template sections and placeholders.

## Session Capture

Use this workflow when the user asks to preserve a Codex interview, design-development session, debugging session, or implementation conversation.

1. Extract durable evidence: decisions, rationale, accepted commands, expected signals, paths, public API behavior, invariants, failure shields, validation results, and user corrections.
2. Drop transcript noise: greetings, self-commentary, abandoned exploration, temporary logs, failed commands after the final fix is known, and planning artifacts that do not belong in durable docs.
3. Route each durable fact to one owner doc using the Document Type Router.
4. Preserve uncertainty explicitly. Verified behavior can be declarative. Inferred behavior must be labeled or omitted. Conflicts go under `Open Questions`, `Known Gaps`, or the final handoff.
5. Do not paste long transcript excerpts into docs by default. Write the durable conclusion and, when useful, record the command or source that verifies it.

## Templates

Use templates only for new durable docs when no existing scaffold is usable. A template is a starting shape, not a required section list.

- Remove placeholders before handoff.
- Omit sections the repo does not need.
- Prefer a short complete doc over a long sparse doc.
- Link to deeper docs instead of embedding every detail in a root doc.
- Never create a parallel doc if an owner doc already exists.

## Host Repo Boundary

When editing this skill in the `agent` repository, keep source edits under `skills/docs-writer/`. Do not hand-edit generated plugin packages under `plugins/codex/agent/` or `plugins/claude/agent/`. After any source skill change, run:

```sh
scripts/sync-plugins.sh
```

## Output Contract

For doc edits, report:

- docs changed or created
- reader/audience served
- source evidence checked
- commands, paths, links, snippets, schemas, or examples validated
- inbound links or indexes updated
- uncertainty, assumptions, or intentionally omitted sections

For read-only reviews, lead with findings ordered by severity and include exact paths and snippets.

## Guardrails

- Do not document guessed behavior. Verify, caveat, or omit.
- Do not turn documentation work into implementation, refactoring, or planning.
- Do not let templates create bulk. Keep simple docs simple.
- Do not create duplicate owner docs for the same concern.
- Do not claim a standard exists when only local convention or best practice exists.
- For `DESIGN.md`, the token YAML frontmatter is normative; the prose is contextual.
- For PRDs, use the concise template by default. Promote only for canonical feature/domain docs or explicit full/detailed PRDs.
- For PRDs, include user stories whose acceptance criteria are agent-verifiable: each story needs one user outcome and concrete evidence that would let Codex know the story is done.
- For PRDs, separate product decisions from implementation tactics. If implementation detail dominates, route to a Plan or project spec instead.
- For Work Trackers, use `Active`, `Later`, and one-line `Done`; keep implementation detail in linked Plans.
- For project specs, use normative language for requirements and label implementation-defined behavior instead of hiding choices in prose.
- For ADRs or decision records, prefer existing repo convention; if none exists, `docs/ADRs/<number>-<slug>.md` is the default new path.
- For Plans, include a summary, implementation changes, test plan, and assumptions by default; add public interfaces, scope, stop rules, or notes only when needed.
- For migration notes, do not claim a step is safe or reversible unless source evidence or validation proves it.
