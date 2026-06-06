---
name: grill
description: "Use to pressure-test a serious idea, plan, domain model, feature shape, or terminology against durable docs and source reality before implementation. Ask one question at a time, recommend an answer, challenge vague or conflicting language, check the repo when a claim is source-verifiable, and capture settled terms or decisions only in the smallest appropriate durable artifact. Not for broad ideation, routine clarification, implementation, code review, or one-off prose."
---

# Grill

Pressure-test a plan or idea until its terms, boundaries, assumptions, and next artifact are crisp enough to act on.

Grill is more forceful than ordinary clarification. Use it when the user already has a direction and wants it challenged against the project's actual language, docs, and code. Do not use it when the user wants many possible ideas first; route those to ideation or brainstorming.

<what-to-do>

"Interview me relentlessly about every aspect of this plan until we reach a shared understanding."

Walk down each branch of the design tree. Resolve dependencies between decisions one by one. For each question, provide your recommended answer.

Ask questions one at a time and wait for feedback before continuing. If source files or docs can answer the question, inspect them instead of asking.

</what-to-do>

<supporting-info>

## Domain Awareness

During repo exploration, also look for existing documentation:

- root or domain-specific `CONTEXT.md`
- `CONTEXT-MAP.md` for multi-context repos
- ADRs, usually under `docs/adr/` or a context-local docs folder
- product docs, specs, PRDs, architecture docs, and module docs that define the current language

Create files lazily. Default to chat, and propose a write only when a term, boundary, or decision has crystallized enough to be worth preserving.

## During The Session

### Challenge Against The Glossary

When the user uses a term that conflicts with existing project language, call it out immediately. Name the existing meaning, name the apparent new meaning, and ask which one is intended.

### Tighten Fuzzy Language

When the user uses vague or overloaded terms, propose a precise canonical term. Make rejected meanings visible so future agents do not resurrect them.

### Discuss Concrete Scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent edge cases that force the user to be precise about boundaries between concepts.

### Cross-Reference With Code

When the user states how something works, check whether the code agrees. If the docs, user language, and code disagree, surface the contradiction plainly and make the user choose the source of truth.

### Capture Terms Inline When Needed

When a term is resolved and durable capture seems useful, propose the smallest owner doc and exact capture first. Update or create that doc only after the user asks for durable capture, approves the specific edit, or invoked Grill with an explicit save/update instruction.

Glossary/context docs define domain language. Do not treat them as specs, scratch pads, implementation notes, or decision logs.

### Offer ADRs Sparingly

Only offer an ADR when all three are true:

1. The decision is hard to reverse.
2. The decision would be surprising without context.
3. The decision came from a real trade-off.

If any of the three is missing, skip the ADR.

</supporting-info>

## Workflow

1. Identify the thing being grilled: plan, feature, domain model, workflow, name, document, decision, or scope boundary.
2. Read the closest durable context before asking deep questions: `AGENTS.md`, README, architecture docs, product docs, specs, PRDs, ADRs, glossary/domain docs, and relevant source files.
3. Ask one question at a time. Each question should resolve one real ambiguity, contradiction, term, boundary, scenario, or decision.
4. Always provide a recommended answer and why.
5. If the question can be answered by inspecting docs or code, inspect first and ask only about the remaining judgment call.
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

Choose the smallest existing owner doc before creating anything new:

- glossary/domain/context doc for canonical terms and rejected synonyms
- PRD, requirements note, or brief for user-facing behavior and success signals
- architecture doc for boundaries, invariants, and system shape
- ADR for hard-to-reverse, surprising, trade-off decisions
- AGENTS.md for every-session agent operating rules
- README or module docs for contributor-facing workflow or module guidance

If no owner exists and a glossary/context doc is appropriate, propose [references/context-format.md](references/context-format.md). If an ADR is appropriate, propose [references/adr-format.md](references/adr-format.md).

Do not create a parallel source of truth. Do not write implementation plans inside Grill unless the idea has already settled and the user explicitly asks for that handoff.

## Output

When the grilling session is ready to close, use:

```md
## Grilled Direction

**Direction:** <the crisp version of the idea or plan>

**Locked:** <settled terms, decisions, constraints, and non-goals>

**Open:** <remaining uncertainty, or `None`>

**Durable Output:** <chat only, existing doc updated, new doc path, or recommended artifact>

**Next Move:** <decision, docs-writer handoff, PRD handoff, prototype handoff, implementation handoff, or stop>
```

## Guardrails

- Do not implement.
- Do not ask what repo source can answer.
- Do not silently accept vague or conflicting language.
- Do not create ADRs for reversible, obvious, or no-tradeoff decisions.
- Do not turn every settled term into a file edit.
- Do not create a new document when an existing owner doc should be updated.
- Do not keep asking questions after the next needed move is research, prototype, implementation, or documentation.
