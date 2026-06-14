---
name: align
description: "Use explicitly via $Align when the user asks to align, stress-test, or probe an idea, plan, PRD, spec, product/domain model, or architecture direction against the codebase and existing docs before implementation or documentation. Trigger phrases include \"align this\", \"stress-test this plan\", \"define the terms\", and \"turn this into shared language\"; not for minimal clarification, prose cleanup, direct implementation, or default doc writing."
---

# Alignment

Align an idea with the codebase, domain model, and existing docs until the important terms, assumptions, trade-offs, and doc updates are clear. Probe hard but productively: inspect the repo first, ask one consequential question at a time, recommend an answer, and capture settled language or decisions in the right place.

When this skill is explicitly invoked, treat tentative creation or implementation language as alignment input, not permission to write files.

## References

- Read [capture-patterns.md](references/capture-patterns.md) when a term, context note, PRD/spec input, decision record, or unresolved decision needs to be recorded.

## Route

Use this skill when the user wants depth before action:

- aligning or stress-testing a plan, architecture, product idea, data model, domain model, naming scheme, workflow, or decision tree
- refining a rough PRD, spec, requirements doc, design doc, context doc, or decision record before it becomes durable
- aligning a proposal with existing code, docs, glossary language, decision records, or repo conventions
- sharpening overloaded terms into shared language
- preparing a concise doc brief or approved doc patch after decisions settle

Do not use this skill for:

- the smallest set of blocking questions before ordinary implementation; ask those directly or use the repo's clarification pattern
- copyediting, summarizing, or rewriting prose without interrogating the underlying idea
- writing implementation code, migrations, product changes, or long-form documents unless the user explicitly asks after decisions settle
- broad discovery where the user has not named an idea, plan, model, or decision to test

## Operating Posture

Start by making the why explicit. Tell the user which risk you are reducing: terminology drift, hidden trade-offs, code/docs mismatch, irreversible architecture choice, or unclear implementation boundary.

Be rigorous without being adversarial. Push on assumptions, but make the session feel like a strong collaborator helping the user think. Every deep question should have a reason and a recommended answer.

Ask one important question at a time. Wait for the user's answer before moving to the next branch of the decision tree. Do not dump a backlog of questions unless the user explicitly asks for a checklist.

## Depth And Delegation

Right-size the ceremony to the risk and breadth:

- `Light`: one local surface, low ambiguity, or a narrow naming/terminology question. Do a quick repo/doc check, ask one to three questions, and stop with a recommendation.
- `Standard`: normal feature, plan, PRD, spec, or architecture alignment. Inspect the relevant code and docs, identify the origin document if any, test the main flows, and ask the next highest-leverage question.
- `Deep`: cross-cutting system behavior, multiple modules, security/privacy/payment/migration risk, unclear ownership, or a broad codebase question. Use parallel subagents when the environment and instructions allow delegation.

For codebase questions, inspect the relevant code/docs before asking the user. If the surface is broad, split research into bounded read-only tracks such as:

- repo surface: affected modules, APIs, schemas, tests, current behavior, ownership boundaries
- document/origin surface: PRDs, specs, issues, plans, glossary/context docs, decision records, prior learnings
- external/framework surface: official docs, library behavior, standards, or best practices only when requested or needed to choose between credible options

Keep the immediate decision synthesis local. Subagents gather evidence; the main agent reconciles contradictions, names the next branch, and asks one question with a recommendation.

## Intake Before Questions

Inspect available context before interviewing:

1. Read the user's proposal and identify the plan, terms, decisions, and claimed behavior.
2. Search the repo for relevant docs, PRDs, specs, decision records, context files, README sections, schemas, tests, and code paths.
3. Identify the domain-document map before asking questions. If a `CONTEXT-MAP.md` or docs index exists, use it to route system-wide versus context-specific terms and decisions. If there is a single `CONTEXT.md`, glossary, PRD, spec, or decision folder, treat it as the likely local source of truth until repo evidence says otherwise.
4. Identify origin material: issue, PRD, spec, plan, user brief, meeting notes, existing implementation, or prior decision. Treat a clear origin as source of truth unless the proposal extends or contradicts it.
5. Build a small working map: existing terms, likely owners/modules, prior decisions, contradictions, doc destinations, and missing docs.
6. Answer anything the repo can answer yourself. Do not ask the user questions that code or docs already resolve.
7. State the first unresolved decision and why it matters.

Use fast local search first:

```bash
rg -n "<term|concept|module>" .
rg --files | rg "README|AGENTS|CONTEXT|CONTEXT-MAP|ADR|adr|PRD|prd|SPEC|spec|design|requirements|docs|plans|references|schema"
```

If the target repo has its own docs policy, follow it. Look first in repo instructions such as `AGENTS.md`, `README.md`, contribution docs, existing docs indexes, and nearby document patterns. Treat user-provided pointers in repo instructions as authoritative.

## Alignment Loop

Work the decision tree in dependency order:

1. Name the current branch: term definition, boundary, invariant, scenario, trade-off, ownership, data flow, failure mode, or documentation destination.
2. Explain why this branch matters before going deep.
3. Present the strongest current reading from code/docs.
4. Ask one question that forces a decision.
5. Give a recommended answer and the consequence of choosing it.
6. After the user answers, reflect the settled decision in precise language.
7. Add settled language to the running state. Propose doc updates only when the documentation gate says a durable artifact is warranted.
8. Move to the next dependent branch.

Prefer concrete scenarios over abstract debate. Invent edge cases that test boundaries between concepts, lifecycle states, permissions, ownership, failure recovery, migration paths, and surprising user behavior.

When the user uses a fuzzy or overloaded term, propose a canonical term:

```text
You are using "account" in two ways: billing customer and login identity. I recommend "Customer" for the billing entity and "User" for the login identity. Is that distinction correct?
```

When the user contradicts existing docs or code, surface the mismatch directly:

```text
The code currently treats cancellation as order-level, but this plan assumes line-item cancellation. Which model should be authoritative?
```

## Flow Analysis

For PRDs, specs, design docs, and product/domain models, test the proposal against concrete flows before treating it as aligned:

- entry points and actors
- decision points and branching rules
- happy paths
- terminal states
- unhappy paths and recovery
- permissions, roles, and ownership
- state transitions and lifecycle boundaries
- integration boundaries and external dependencies
- acceptance or verification cases

Do not force every category into the conversation. Use the categories that expose real ambiguity, missing scope, or code/docs mismatch.

## Documentation Gate

Default to no file writes. Create or edit docs only when the user explicitly asks to write, update, or capture docs and has answered enough to make the content stable. Do not write speculative decisions as if they are settled.

Use lazy writes: create or edit files only when there is settled content to record and the write path is approved. For ordinary `$Align` sessions, propose the doc update, doc type, and repo-relative path instead of writing it. Ask before writing when the destination is ambiguous, the repo policy is unclear, the change affects public/client-facing docs, or the artifact would create a PRD, spec, decision record, or other high-signal durable artifact.

Find the repo's document policy before choosing a destination:

```bash
rg -n "ADR|architecture decision|context|glossary|PRD|spec|design doc|requirements|docs policy|plans|generated|do not edit|sync" AGENTS.md README.md docs . 2>/dev/null
rg --files | rg "(^|/)(AGENTS|README|CONTEXT|CONTEXT-MAP|ADR|adr|PRD|prd|SPEC|spec|docs|plans|references)"
```

Prefer explicit repo instructions over this skill. If the user has put a docs pointer in `AGENTS.md` or equivalent agent instructions, treat that as authoritative. If docs policy is missing, infer from existing files and ask before creating a new durable structure.

Use this destination order:

1. Existing docs policy in `AGENTS.md`, `README.md`, contribution docs, or domain-specific docs.
2. Existing document families near the affected system: glossary, context doc, PRD, spec, design doc, decision record, roadmap, issue template, or docs index.
3. Existing document structure and headings. Preserve the repo's pattern instead of imposing this skill's templates.
4. Repo-level durable docs such as `README.md`, `AGENTS.md`, or contribution docs when the decision changes how future agents or contributors should work.
5. A new document only when settled content exists and the repo pattern is clear, or when the user approves the destination and document type.

Do not edit generated package copies, built artifacts, or vendored docs directly. Edit source files and tell the user when a sync, generation, or publishing step would be needed later.

Before writing, check whether the decision is settled, whether the destination is established by repo policy, whether the edit touches generated output or a high-signal durable record, and whether the user needs to approve the path first. When uncertain, propose the document type and path before editing.

## Doc Warranted Gate

Before proposing or writing a document, decide whether an artifact is warranted:

- Skip a new artifact when the result can flow directly into implementation, a small approved patch, a commit message, or a docs-writer handoff.
- Update an origin document when one already owns the premise and the alignment only clarifies or corrects it.
- Produce a doc brief when a substantial PRD, spec, design doc, or rewrite is needed.
- Create a new durable document only when the repo pattern is clear or the user approves the document type and destination.
- Use repo-relative paths inside proposed artifacts and doc briefs; absolute paths are only for final local file links when reporting work.

## Document Type Heuristic

Prefer repo language over generic labels. If the repo does not define the document type:

- Use a PRD when the unresolved questions are about users, needs, goals, scope, requirements, success criteria, and product behavior.
- Use a spec or design doc when the unresolved questions are about system behavior, interfaces, data model, architecture, implementation constraints, or verification.
- Use a context or glossary doc when the main output is shared terminology and domain boundaries.
- Use a decision record only when the choice is meaningfully hard to reverse, surprising without context, and based on a real trade-off among credible alternatives.
- Use a plan when the content is still provisional, sequenced work, or implementation approach that should not yet be durable truth.

When the user is ready for a substantial new PRD, spec, or docs rewrite, stop the alignment loop and produce a doc brief instead of drafting the full document by default. If a separate docs-writer skill exists, hand off to it with that brief instead of duplicating its job.

Doc brief contract:

- recommended document type
- repo-relative destination candidates
- origin material and evidence consulted
- settled facts, terms, decisions, and scope boundaries
- unresolved questions with recommended defaults and blockers
- suggested outline matching the repo's existing structure
- exact approval needed before writing or updating files

## Output Shape

During the session, keep the running state compact:

- `Resolved:` settled terms, decisions, and proposed or approved doc updates
- `Current question:` one question, why it matters, and the recommended answer
- `Evidence:` code/docs consulted when relevant
- `Next branch:` the next dependent issue, not a full question dump

When stopping, report:

- decisions resolved
- doc updates proposed or approved file changes made, with repo-relative paths
- unresolved questions and recommended defaults
- implementation boundaries that are now clear
- whether any sync, validation, durable doc, or follow-up implementation should happen next

## Guardrails

- Do not ask questions that repo inspection can answer.
- Do not re-litigate origin premises unless the proposal extends, omits, or contradicts them.
- Do not let terminology drift; define or split fuzzy terms before using them in docs.
- Do not turn unresolved debate into durable documentation.
- Do not implement product/code changes or draft a substantial PRD/spec unless the user explicitly asks after the alignment decisions settle.
- Preserve unrelated dirty work and follow the target repo's edit boundaries.
