---
name: sharpen
description: "Use to pressure-test a serious idea, plan, domain model, feature shape, or terminology against durable docs and source reality before implementation. Ask one question at a time, recommend an answer, challenge vague or conflicting language, check the repo when a claim is source-verifiable, and capture settled terms or decisions only in the smallest appropriate durable artifact. Not for broad ideation, routine clarification, implementation, code review, or one-off prose."
---

# Sharpen

Pressure-test a plan or idea until its terms, boundaries, assumptions, and next artifact are crisp enough to act on.

Sharpen is more forceful than ordinary clarification. Use it when the user already has a direction and wants it challenged against the project's actual language, docs, and code. Do not use it when the user wants many possible ideas first; route those to ideation or brainstorming.

## Workflow

1. Identify the thing being sharpened: plan, feature, domain model, workflow, name, document, decision, or scope boundary.
2. Read the closest durable context before asking deep questions: `AGENTS.md`, README, architecture docs, product docs, specs, PRDs, ADRs, glossary/domain docs, and relevant source files.
3. Ask one question at a time. Each question should resolve one real ambiguity, contradiction, term, boundary, scenario, or decision.
4. Always provide a recommended answer and why.
5. If the question can be answered by inspecting docs or code, inspect first and ask only about the remaining judgment call.
6. Challenge fuzzy terms immediately. Propose a canonical meaning and name rejected meanings when useful.
7. Test boundaries with concrete scenarios, especially edge cases that distinguish similar concepts.
8. When the user says how something works, check source reality when available. Surface contradictions plainly.
9. Keep a compact record of settled terms, constraints, assumptions, non-goals, decisions, and open trails.
10. End by naming the sharpened direction and the next artifact or action.

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

Default to chat. Write files only when the sharpened outcome needs to survive the session or the user asks for durable capture.

Choose the smallest existing owner doc before creating anything new:

- glossary/domain/context doc for canonical terms and rejected synonyms
- PRD, requirements note, or brief for user-facing behavior and success signals
- architecture doc for boundaries, invariants, and system shape
- ADR for hard-to-reverse, surprising, trade-off decisions
- AGENTS.md for every-session agent operating rules
- README or module docs for contributor-facing workflow or module guidance

If no owner exists and a glossary/context doc is appropriate, use [references/context-format.md](references/context-format.md). If an ADR is appropriate, use [references/adr-format.md](references/adr-format.md).

Do not create a parallel source of truth. Do not write implementation plans inside Sharpen unless the idea has already settled and the user explicitly asks for that handoff.

## Output

When the sharpening session is ready to close, use:

```md
## Sharpened Direction

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
