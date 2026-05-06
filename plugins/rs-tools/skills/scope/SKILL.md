---
name: scope
description: "Use for broad or fuzzy pre-plan thinking before implementation or major decisions: ideate possible directions, persistently discuss an existing direction until shared understanding exists, or decide whether the next artifact should be chat, context, product spec, or ExecPlan. Trigger on requests like 'scope this', 'ideate', 'discuss this', 'think this through', or 'what should we do here'. Do not use for requirements clarification, clear implementation requests, routine edits, code review, or accepted plans."
---

# Scope

Turn a broad idea, option set, or proposed direction into shared understanding clear enough to act on.

Where requirements clarification asks the minimum needed to proceed, Scope asks as many useful questions as needed to reach shared understanding.

Do not implement. Scope ends when the next step is clear.

## Lanes

Classify the request into one lane:

- **Ideate**: the user wants broad options, surprising directions, or a stronger candidate set before choosing what to develop. Read `references/ideate.md`.
- **Discuss**: the user has an idea, plan, architecture, workflow, implementation direction, or decision and wants to examine it before planning or coding. Read `references/discuss.md`.

If the user mainly needs requirements clarification, stop Scope and say this is a clarification task. If the request is already concrete enough to execute, say Scope is not needed and proceed directly.

Keep quick Scope sessions brief, but use persistent Discuss when the work is broad, fuzzy, or high-consequence.

## Common Workflow

1. Classify the lane.
2. Ground the topic before asking avoidable questions.
3. Use local project research, web research, or sub-agents only when they materially change the answer. Read `references/research.md` when the grounding decision is non-trivial.
4. Run the selected lane.
5. Use the Durable Outputs rules below to decide whether the result stays in chat or becomes an artifact.
6. End with the selected lane's output shape.

## Grounding

For project, product, or workflow topics, inspect local source of truth first:

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- TODOs, product specs, project specs, exec plans, context docs
- relevant source files or examples

Do not ask the user to answer something the local project, workspace, or provided materials can answer.

## Scoped Direction

Discuss ends with **Scoped Direction**. Use one compact block:

- **Chosen Direction**: the direction to carry forward; if no direction is chosen, state the remaining live options.
- **What We Resolved**: choices, tradeoffs, terms, or boundaries settled during the conversation; use `None yet` when nothing was resolved.
- **In Scope**: what belongs in the next step.
- **Out Of Scope**: what should stay out for now.
- **Remaining Risk**: the main uncertainty, cost, or failure mode still worth watching.
- **Open Questions**: unresolved questions, or `None`.
- **Recommended Next Step**: the exact next chat, artifact, plan, or implementation move.

Ideate keeps its ranked-survivor output, then ends with **Open Questions** and **Recommended Next Step**.

## Durable Outputs

Default to chat. Create or update an artifact only when at least one is true:

- The user asks for a durable output.
- Another agent, session, or future plan needs the result to continue the work.
- Resolved language, decisions, or constraints will matter later and would be hard to reconstruct from the chat.

A Discuss session that confirms the user's original direction and resolves no new terms, decisions, or durable constraints does not need an artifact. The conversation record is enough.

When an artifact is needed:

1. Follow local convention first: root guidance, docs-folder guidance, existing artifact folders, nearby examples, and active plans.
2. If a matching context, product spec, or plan exists, read it and ask whether to continue from it or start fresh.
3. Choose exactly one artifact family.
4. Prefer project-specific templates when they exist. Otherwise read the matching Scope asset template before writing; do not write from memory.
5. Use project-relative paths in durable workspace docs. Absolute paths are fine in chat, but they make artifacts less portable.
6. Ask where to store the artifact if the project has no convention and the user has not specified a destination.

Artifact families:

- **Context**: shared understanding, scope boundaries, constraints, decisions, and next steps that need to persist. Read `assets/context-template.md`.
- **Domain context**: terminology, ownership boundaries, domain relationships, or flagged ambiguity that should become canonical. Read `assets/domain-context-template.md`.
- **Product spec**: product or feature scope stable enough to guide planning or implementation. Read `assets/product-spec-template.md`.
- **ExecPlan**: substantial implementation planning. Read local plan instructions first; if the project has no stronger convention, read `assets/exec-plan-template.md`.

Do not create a separate ideation artifact family. Important ideation output should either stay in chat or become part of a context or product spec.

## Guardrails

- Exit Scope early when the request is already decided and concrete enough to execute.
- Ask in plain English for a smart non-technical user. Start with the simple version, use everyday words before technical terms, and add a one-sentence "why this matters" when context helps the user answer.
- Provide a recommended default when asking the user to choose.
- Keep asking until the next step is clear, the remaining unknowns are optional, or the user asks to stop.
- Generate before evaluating in Ideate.
- Filter weak ideas before presenting recommendations.
- Keep research findings separate from assumptions.
- Keep implementation details out unless the topic itself is technical or architectural.
- The main agent owns synthesis and recommendation, even when sub-agents help gather material.

## Anti-Patterns

- Implementing during Scope.
- Turning every conversation into a document.
- Asking a batch of intake questions in Discuss.
- Asking questions in dense implementation language when plain words would do.
- Ending Discuss with a polished opinion before the interview has created shared understanding.
- Generating ideas without filtering them.
- Converging before enough options exist.
- Treating discussion as either automatic agreement or ungrounded skepticism.
- Letting Scope become planning, coding, review, or a full research-brief workflow.
