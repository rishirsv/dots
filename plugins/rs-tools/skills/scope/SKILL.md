---
name: scope
description: "Use for pre-plan thinking before implementation: ideate possible directions, discuss an existing direction, or decide whether the next artifact should be chat, a context, a product spec, or an ExecPlan. Trigger on requests like 'scope this', 'ideate', 'discuss this', 'think this through', or 'what should we do here'. Do not use for requirements clarification, clear implementation requests, routine edits, code review, or accepted plans."
---

# Scope

Turn a broad idea, option set, or proposed direction into something clear enough to act on.

Do not implement. Scope ends when the next step is clear.

## Lanes

Classify the request into one lane:

- **Ideate**: the user wants broad options, surprising directions, or a stronger candidate set before choosing what to develop. Read `references/ideate.md`.
- **Discuss**: the user has an idea, plan, or implementation direction and wants a live conversation that examines it before planning or coding. Read `references/discuss.md`.

If the user mainly needs requirements clarification, stop Scope and say this is a clarification task. If the request is already concrete, say Scope is not needed and proceed directly.

## Common Workflow

1. Classify the lane.
2. Ground the topic before asking avoidable questions.
3. Use repo research, web research, or sub-agents only when they materially change the answer. Read `references/research.md` when the grounding decision is non-trivial.
4. Run the selected lane.
5. End with the selected lane's output shape. If the lane does not define a more specific output, end with:
   - what we are trying to do
   - what is in scope
   - what is out of scope
   - what is still open
   - recommended next step

## Grounding

For repo, product, or workflow topics, inspect local source of truth first:

- `AGENTS.md`
- `README.md`
- TODOs, product specs, project specs, exec plans, context docs
- relevant source files or examples

Do not ask the user to answer something the repo can answer.

## Durable Outputs

Default to chat. Save only when the result needs to survive the conversation, guide planning, or hand off to later work.

Use `references/artifacts.md` before creating a durable output.

Allowed durable output families:

- **Context**: shared understanding, terminology, ownership, architecture, or decision context.
- **Product spec**: stable product or feature scope.
- **ExecPlan**: substantial implementation planning.

Do not create a separate ideation artifact family by default. Important ideation output should either stay in chat or become part of a context or product spec.

## Guardrails

- Exit Scope early when the request is already decided and concrete enough to execute.
- In Discuss, prefer a live interview over an immediate essay.
- Ask one useful question at a time when questioning is needed.
- Provide a recommended default when asking the user to choose.
- Ask in plain English for a smart non-technical user. Start with the simple version, use everyday words before technical terms, and add a one-sentence "why this matters" when context helps the user answer.
- Keep asking until the next step is clear, the remaining unknowns are optional, or the user asks to stop.
- Generate before evaluating in Ideate.
- Filter weak ideas before presenting recommendations.
- Keep research findings separate from assumptions.
- Keep implementation details out unless the topic itself is technical or architectural.
- The main agent owns synthesis and recommendation, even when sub-agents help gather material.

## Anti-Patterns

- Implementing during Scope.
- Turning every conversation into a document.
- Asking a batch of intake questions.
- Asking questions in dense implementation language when plain words would do.
- Ending Discuss with a polished opinion before asking the next obvious question.
- Generating ideas without filtering them.
- Converging before enough options exist.
- Treating discussion as either automatic agreement or ungrounded skepticism.
- Letting Scope become planning, coding, review, or a full research-brief workflow.
