---
name: grill
description: "Use to pressure-test a serious idea, plan, domain model, feature shape, or terminology against durable docs and source reality before implementation. Ask one question at a time, recommend an answer, challenge vague or conflicting language, check the repo when a claim is source-verifiable, and capture settled terms or decisions only in the smallest appropriate durable artifact. Not for broad ideation, routine clarification, implementation, code review, or one-off prose."
---

# Grill

Pressure-test a plan or idea until its terms, boundaries, assumptions, and next artifact are crisp enough to act on.

Grill is more forceful than ordinary clarification. Use it when the user already has a direction and wants it challenged against the project's actual language, docs, and code. Do not use it when the user wants many possible ideas first; route those to ideation or brainstorming.

<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

</what-to-do>

<supporting-info>

## Domain awareness

During repo exploration, also look for existing durable documentation:

- `AGENTS.md`, README, architecture docs, design docs, product docs, specs, PRDs, and module docs
- feature, domain, concept, glossary, or language docs that define the project's terms
- plans, decision/rationale records, runbooks, API docs, migration notes, and other durable docs that show how the repo captures work

Do not assume the repo has or should have `CONTEXT.md` or `CONTEXT-MAP.md`. Treat context/glossary files as possible local conventions, not Grill's default output shape.

Create files lazily. Default to chat, and propose a write only when a term, boundary, or decision has crystallized enough to be worth preserving.

## During The Session

### Challenge Against Existing Language

When the user uses a term that conflicts with existing project language in docs or code, call it out immediately. Name the existing meaning, name the apparent new meaning, and ask which one is intended.

### Tighten Fuzzy Language

When the user uses vague or overloaded terms, propose a precise canonical term. Make rejected meanings visible so future agents do not resurrect them.

### Discuss Concrete Scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent edge cases that force the user to be precise about boundaries between concepts.

### Cross-Reference With Code

When the user states how something works, check whether the code agrees. If the docs, user language, and code disagree, surface the contradiction plainly and make the user choose the source of truth.

### Use Quick Explore Subagents For Repo Research

When a grilling question requires repo research beyond a quick local read, send one or two read-only `explorer-mini` Quick Explore subagents as needed. Good splits are by source class, module, term family, workflow, or artifact type.

Keep the main Grill session responsible for synthesis, recommendations, and the next question. Give each subagent a compact brief with:

- the exact question to answer
- the repo area, docs, terms, symbols, or workflows to inspect
- what evidence to return: file paths, symbols, snippets, commands searched, contradictions, and uncertainty
- a reminder to stay read-only and not write files, implement, stage, commit, or make final decisions

Use one subagent for one narrow lane. Use two subagents when independent lanes would materially improve coverage or speed. If subagents are unavailable, perform the same read-only exploration yourself and say so when the user explicitly requested subagents.

### Capture Terms Inline When Needed

When a term is resolved and durable capture seems useful, propose the smallest owner doc and exact capture first. Update or create that doc only after the user asks for durable capture, approves the specific edit, or invoked Grill with an explicit save/update instruction.

Glossary or concept docs define domain language. Do not treat them as specs, scratch pads, implementation notes, or decision logs.

### Route Durable Artifacts Through Docs Writer

When the session is converging on a durable artifact, name the likely artifact and hand off to `$docs-writer`. Grill selects the artifact type from the session; Docs Writer owns the template, path convention, style matching, source verification, and final write.

Use this routing index:

| Session result | Durable artifact to recommend | Usual owner or location |
|---|---|---|
| Product scope, user outcome, acceptance criteria, or open product questions | PRD | existing product docs or `docs/prd/<slug>.md` |
| Implementation sequencing for complex work | ExecPlan / execution plan | repo convention, often `.plans/<slug>.md` |
| Normative system, service, workflow, lifecycle, or interface contract | Project spec | existing specs area or `docs/specs/<slug>.md` |
| Long-lived feature behavior, domain language, ownership, or runtime flow | Feature/domain doc | existing feature docs, module docs, or `docs/features/<slug>.md` |
| Stable boundaries, invariants, dependencies, or architecture rationale | Architecture doc | `ARCHITECTURE.md` or existing architecture docs |
| Hard-to-reverse or rationale-heavy decision | ADR or decision record | Docs Writer convention, typically `docs/ADRs/<number>-<slug>.md` |
| Agent or contributor operating rule | `AGENTS.md` | nearest applicable `AGENTS.md` |
| Contributor setup, usage, command map, or doc index | README or module docs | root README, module README, or existing contributor docs |
| Repeatable operational procedure | Runbook | existing runbooks or `docs/runbooks/<slug>.md` |
| API, event, schema, SDK, or integration behavior | API docs | generated spec first, otherwise existing API docs |
| Breaking or compatibility-affecting adoption path | Migration notes | existing migration docs or `docs/migrations/<slug>.md` |

For ADRs or decision records, Grill may recommend the artifact even when the repo has not used ADRs before. Do not write the ADR inside Grill; route to `$docs-writer`, which owns the ADR template and final path.

</supporting-info>

## Workflow

1. Identify the thing being grilled: plan, feature, domain model, workflow, name, document, decision, or scope boundary.
2. Read the closest durable context before asking deep questions: `AGENTS.md`, README, architecture docs, design docs, product docs, specs, PRDs, feature/domain/concept docs, module docs, decision records, plans, and relevant source files.
3. Ask one question at a time. Each question should resolve one real ambiguity, contradiction, term, boundary, scenario, or decision.
4. Always provide a recommended answer and why.
5. If the question can be answered by inspecting docs or code, inspect first. Use one or two Quick Explore subagents when broader read-only repo research would help, then ask only about the remaining judgment call.
6. Challenge fuzzy terms immediately. Propose a canonical meaning and name rejected meanings when useful.
7. Test boundaries with concrete scenarios, especially edge cases that distinguish similar concepts.
8. When the user says how something works, check source reality when available. Surface contradictions plainly.
9. Keep a compact record of settled terms, constraints, assumptions, non-goals, decisions, and open trails.
10. End by naming the grilled direction and the next artifact or action.

## Question Shape

Use this shape during the session:

```md
**Question:** <one precise question>

**Recommended Answer:** <your recommended answer and why>

**Context:** <docs/source evidence, ambiguity, contradiction, or scenario being tested>
```

Add short options only when the decision naturally has 2-3 clean choices. Do not turn the session into a questionnaire.

## What To Challenge

- overloaded terms such as account, user, session, project, agent, skill, plan, review, proof, source, generated, or memory
- hidden actor boundaries: who owns, sees, triggers, approves, deletes, retries, or depends on something
- lifecycle states and transitions
- compatibility, migration, and hard-cut implications
- source-of-truth drift between docs, code, generated output, and user language
- scope that quietly combines product, implementation, and documentation decisions
- assumptions that would surprise a future maintainer or agent
- proposed names that imply the wrong behavior

## Durable Capture

Default to chat. Write files only when the user asks for durable capture, approves a proposed edit, or invokes Grill with an explicit save/update instruction.

Use the routing index above to recommend the artifact. Prefer the smallest existing owner doc before creating anything new. If the artifact needs to be written, route to `$docs-writer` with the grilled direction, locked decisions, open questions, source evidence checked, and likely artifact type.

Do not create a parallel source of truth. Do not write implementation plans inside Grill unless the idea has already settled and the user explicitly asks for that handoff.

## Output

When the grilling session is ready to close, use:

```md
## Grilled Direction

**Direction:** <the crisp version of the idea or plan>

**Locked:** <settled terms, decisions, constraints, and non-goals>

**Open:** <remaining uncertainty, or `None`>

**Durable Output:** <chat only, existing doc updated, new doc path, or recommended artifact>

**Next Move:** <decision, docs-writer handoff, prototype handoff, implementation handoff, or stop>
```

## Guardrails

- Do not implement.
- Do not ask what repo source can answer.
- Do not silently accept vague or conflicting language.
- Do not turn every settled term into a file edit.
- Do not create a new document when an existing owner doc should be updated.
- Do not write durable docs that belong to `$docs-writer`.
- Do not keep asking questions after the next needed move is research, prototype, implementation, or documentation.
