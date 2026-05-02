---
name: scope
description: "Use for pre-plan thinking before implementation: clarify a fuzzy idea, ideate possible directions, pressure-test an existing direction, or decide whether the next artifact should be chat, a context, a product spec, or an ExecPlan. Trigger on requests like 'clarify this', 'ideate', or 'scope this'. Do not use for clear implementation requests, routine edits, code review, or accepted plans."
---

# Scope

Turn an unclear idea, broad request, option set, or proposed implementation direction into something clear enough to act on.

Do not implement. Scope ends when the next step is clear.

## Lanes

Classify the request into one lane:

- **Clarify**: the user roughly knows what they want and needs the minimum questions required to proceed safely. Read `references/clarify.md`.
- **Ideate**: the user wants broad options, surprising directions, or a stronger candidate set before choosing what to develop. Read `references/ideate.md`.
- **Pressure-Test**: the user has an idea, plan, or implementation direction and wants it questioned thoroughly before planning or coding. Read `references/pressure-test.md`.

If the request is already concrete, say Scope is not needed and proceed directly.

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
- Ask one question at a time when questioning is needed.
- Provide a recommended default when asking the user to choose.
- Generate before evaluating in Ideate.
- Filter weak ideas before presenting recommendations.
- Keep research findings separate from assumptions.
- Keep implementation details out unless the topic itself is technical or architectural.
- The main agent owns synthesis and recommendation, even when sub-agents help gather material.

## Anti-Patterns

- Implementing during Scope.
- Turning every conversation into a document.
- Asking a batch of intake questions.
- Generating ideas without filtering them.
- Converging before enough options exist.
- Treating pressure-testing as negativity instead of precision.
- Letting Scope become planning, coding, review, or a full research-brief workflow.
