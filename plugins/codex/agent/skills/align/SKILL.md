---
name: align
description: "Use explicitly via $Align when the user asks to align, stress-test, or probe an idea, plan, PRD, spec, product/domain model, or architecture direction against the codebase and existing docs before implementation or documentation. Trigger phrases include \"align this\", \"stress-test this plan\", \"define the terms\", and \"turn this into shared language\"; not for minimal clarification, prose cleanup, direct implementation, or default doc writing."
---

<what-to-do>

# Alignment

Align an idea with the codebase, domain model, and existing docs until the
important terms, assumptions, trade-offs, and next action are clear.

Alignment is not execution. While `$Align` is active, treat proposals, drafts,
file paths, and imperative phrasing as material to resolve, not permission to
act. Write, scaffold, delegate execution, or implement only after the user
explicitly asks to switch from alignment to action.

## Route

Use this skill when the user wants depth before action:

- aligning or stress-testing a plan, architecture, product idea, data model,
  domain model, naming scheme, workflow, or decision tree
- refining a rough PRD, spec, requirements doc, design doc, context doc, or
  decision record before it becomes durable
- aligning a proposal with existing code, docs, glossary language, decisions,
  or repo conventions
- sharpening overloaded terms into shared language
- preparing a concise doc brief or approved doc patch after decisions settle

Do not use this skill for:

- the smallest set of blocking questions before ordinary implementation; ask those directly or use the repo's clarification pattern
- copyediting, summarizing, or rewriting prose without interrogating the underlying idea
- writing implementation code, migrations, product changes, or long-form documents unless the user explicitly asks after decisions settle
- broad discovery where the user has not named an idea, plan, model, or decision to test

## Workflow

1. Name the risk being reduced: terminology drift, hidden trade-offs,
   code/docs mismatch, irreversible choice, or unclear implementation boundary.
2. Inspect the repo before interviewing. Read the proposal, search relevant
   docs/code, find origin material, map terms/owners/contradictions, and answer
   anything the repo can answer.
3. Pick depth. `Standard` covers normal plans/specs/skills/architecture. `Deep`
   covers cross-cutting, risky, multi-module, or unclear-ownership work; split
   evidence tracks and use subagents when useful, but keep synthesis local.
4. Walk the decision tree in dependency order. For each branch, state why it
   matters, give the strongest current reading, ask one decision-forcing
   question, recommend an answer, and record the settled language.
5. Test fuzzy terms, contradictions, and product/domain models with concrete
   scenarios and flow edges. Do not ask questions that local evidence resolves.
6. Keep all writes lazy. Propose destination and approval needed; write only
   when content is settled, repo policy is clear, and the user has explicitly
   asked to write/update/capture.
7. Stop substantial PRD/spec/doc rewrites at a doc brief unless the user
   explicitly asks to draft the artifact.

Use fast local search first:

```bash
rg -n "<term|concept|module>" .
rg --files | rg "README|AGENTS|CONTEXT|CONTEXT-MAP|ADR|adr|PRD|prd|SPEC|spec|design|requirements|docs|plans|references|schema"
```

Read [capture-patterns.md](references/capture-patterns.md) before recording a
term, context note, PRD/spec input, decision note, or unresolved decision.

## Guardrails

- Do not ask questions that repo inspection can answer.
- Do not re-litigate origin premises unless the proposal extends, omits, or
  contradicts them.
- Do not let terminology drift; define or split fuzzy terms before using them
  in docs.
- Do not turn unresolved debate into durable documentation.
- Do not implement product/code changes or draft a substantial PRD/spec unless
  the user explicitly asks after decisions settle.
- Do not edit generated package copies, built artifacts, or vendored docs.
- Preserve unrelated dirty work and follow the target repo's edit boundaries.

## Output Shape

During the session, keep the running state compact:

- `Resolved:` settled terms, decisions, and proposed or approved doc updates
- `Current question:` one question, why it matters, and the recommended answer
- `Evidence:` code/docs consulted when relevant
- `Next branch:` the next dependent issue, not a full question dump

For status updates, estimate progress instead of advancing:

```text
Progress: [#####-----] 50%
Covered: intake, source-of-truth check, core decision
Current branch: trigger boundary
Remaining branches: failure modes, approval gate, doc/update destination
Confidence: medium
```

When stopping, report:

- decisions resolved
- doc updates proposed or approved file changes made, with repo-relative paths
- unresolved questions and recommended defaults
- implementation boundaries that are now clear
- whether any sync, validation, durable doc, or follow-up implementation should happen next

</what-to-do>

<supporting-info>

## Documentation Heuristics

Follow repo docs policy first. Otherwise prefer nearby existing glossary,
context, PRD, spec, design, decision, roadmap, issue-template, or docs-index
patterns before creating anything new.

Artifact choice:

- skip when implementation, a small patch, commit message, or docs-writer
  handoff is enough
- update the origin document when it owns the premise
- use a PRD for users/goals/requirements/success criteria
- use a spec/design doc for system behavior, interfaces, data, constraints, and
  verification
- use context/glossary docs for shared terminology
- use a decision record only for hard-to-reverse, surprising trade-offs
- use a plan for provisional sequencing or implementation approach

Doc brief contract: recommended type, destination candidates, origin/evidence,
settled facts and scope, unresolved questions with defaults, outline, and exact
approval needed before writing.

For PRDs, specs, design docs, and product/domain models, selectively test entry
points, actors, decisions, branches, terminal states, recovery, permissions,
ownership, state transitions, integrations, and verification cases.

</supporting-info>
