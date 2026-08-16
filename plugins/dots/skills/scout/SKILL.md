---
name: scout
description: "Use only when the user asks to be interviewed, grilled, challenged, or questioned about a fuzzy plan, decision, or idea. Builds shared understanding before planning or implementation; not for the minimum clarification needed to perform an otherwise specified task."
---

# Scout

## Start With What Is Known

Before asking a question, extract the desired result, constraints, preferences,
examples, accepted references, and decisions already provided by the user.
Treat them as answered. Ask only about missing information that could
materially change the result. Never ask the user to restate or confirm something
they already said.

If a word could mean several things, use the meaning made clear by the prompt.
If it is still unclear, say what you think it means and ask the user to correct
you. If an idea or rule remains vague, test it with a concrete example: “What
should happen when…?”

Treat an accepted reference, source, fork, or stated direction as settled. If
the current product, code, or documentation conflicts with what the user
described, explain the difference plainly. Ask whether the existing behavior
should change or the description needs correcting. Do not assume the current
implementation is the intended future.

## Ask Questions

Identify the few big decisions still unresolved before diving into details.
In each round, ask all consequential questions that can be answered
independently. Save a question for the next round when it depends on another
answer. Number questions so the user can answer them together.

Questions are consequential when their answers change the direction,
architecture, ownership, scope, or another decision.

When the user is choosing among distinct options, use this as the default.
Adapt or omit any part that does not make the decision easier to answer:

```md
❓ **Q1 — <decision>**

<Why this decision matters and the evidence that shapes it.>

- **A — <option>** — <What it means, its strongest advantage, and its main cost.>
- **B — <option>** — <What it means, its strongest advantage, and its main cost.>

➡️ **Recommendation: <option>** — <Why it best fits the evidence, settled
direction, and accepted trade-offs.>
```

Match the questions to the work:

- For product or design work, describe what the user would see, do, or feel.
- For code changes that will be planned later, focus on intended behavior,
  boundaries, ownership, and trade-offs the plan must preserve. Delegate
  questions about the current codebase as research.
- For knowledge or analytical work, focus on the decision the result must
  support, its audience, important definitions, evidence, assumptions, and
  required output. For a financial model, this may include its key drivers,
  source data, scenarios, and checks.
- For a simple preference or open-ended judgment, ask directly. Do not invent
  options or a recommendation when they would not help.

After each round, update what remains unresolved. Do not reopen decisions the
user has already made.

## Delegated Support

For research, send every factual lookup—including repository files,
documentation, tools, and web research—to a subagent. Ask for only the facts
that could change a decision, their sources, and meaningful uncertainty.
Explain what those findings mean instead of relaying the research report.

For brainstorming, use a subagent when the user needs credible options or the
current options are too similar. Give it the settled goal, constraints,
accepted references, and prior rejections. Ask for a small set of meaningfully
different approaches, each with its strongest benefit and main cost. Use
several independent subagents only when broader exploration could change the
direction.

Remove duplicate ideas, explain the important differences, recommend an
option, and ask the user to decide. Do not dump raw brainstorm output into the
interview.

For prototypes, delegate creation to a subagent that can create the needed
prototype. It might be a screen, interaction, chart, financial-model layout,
workflow, or sample output. Give the subagent the settled constraints and
accepted references, then ask for a small number of meaningfully different
versions. Show the actual results to the user, ask what works or fails, and turn
that reaction into a clearer decision. Scout does not create the prototypes
itself.

Keep asking independent questions while delegated work runs.

## Finish

Stop when every consequential decision has been answered, rejected, or
explicitly deferred. Finish with a short Scout Snapshot that lets someone
continue later without reopening settled decisions:

- what the interview was trying to settle;
- the decisions made, exact non-negotiables, and why each choice won;
- any words whose meaning was clarified;
- questions still open and what they depend on;
- anything the user explicitly chose not to address;
- what the result is ready for next.

If the user has already accepted the direction or told you to proceed, do not
ask again. Otherwise ask them to correct the snapshot. Then hand it to the
requested next workflow.
