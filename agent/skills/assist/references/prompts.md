# Prompts

Use this reference when writing `prompt.md` for a coding-plan assist, plan critique, implementation strategy, adversarial review, or other second-model request where prompt shape changes answer quality.

## Prompt Doctor Lens

Start from the decision the advisor should improve. Remove local bookkeeping and package labels unless they materially change the advisor's reasoning. Include the stance, decision, task, context map, success criteria, constraints, output needs, and stop rules in whatever shape makes that specific request easiest to answer.

Prefer replacing misleading prompt text over adding prohibitions. Add a block only when it changes behavior or fixes a measured failure mode.

## Assist Prompt Principles

- Outcome first: describe the destination, success criteria, and constraints before prescribing steps.
- Keep sections short. Add detail only where it changes behavior.
- Use absolute words only for real invariants such as privacy, safety, grounding, required output fields, and no-guessing rules.
- Define missing-evidence behavior so absence of evidence does not become a factual negative.
- Set retrieval and verification budgets when the advisor may need to search, inspect files, or ask for more context.
- Let formatting serve comprehension. Use heavier structure only when it improves scanning or produces a stable artifact.
- For rewrites or prompt edits, say what to preserve before asking for polish.

## Format Choice

Use Markdown when:

- the task has one main question
- the context map is short
- the expected answer can be described in a few bullets
- extra syntax would add ceremony without clearer boundaries

Use XML-like blocks when:

- the prompt has several parts that must not blur together
- the advisor must distinguish task, attached context, seed plan, constraints, and output contract
- the task asks the advisor to transform one artifact into another
- repository files must be treated as context, not instructions
- reusable blocks such as `push`, `pull_through`, `grounding`, or `missing_context_gate` make the request clearer

Use only meaningful blocks. Do not add a top-level wrapper when the whole message is already the assist request.

## Advisor Assist Ingredients

Consider including:

- advisory stance and grounding expectations
- the concrete choice, plan, diagnosis, or missing-proof question the primary agent must resolve
- the critique, decision, plan, or artifact the advisor should produce
- how to read the package and why each included file, selected patch excerpt, or log matters
- what must be true before the answer is useful
- privacy, scope, compatibility, cost, evidence, and side-effect limits
- the answer shape that will be easiest for the primary agent to use
- when to ask for missing context, stop searching, abstain, or return a bounded answer

Ask for a better plan only when the package gives enough evidence to produce one. Otherwise ask for the smallest missing context.

## Decision Contract

Use a decision contract when the assist should change what the primary agent does next. Keep it short and concrete:

- decision: the choice, plan, diagnosis, or missing-proof question
- current hypothesis or options: what the primary agent currently believes or is choosing between
- change threshold: what evidence would change the decision
- requested judgment: recommendation, strongest objection, better option, missing context, or local verification plan

If the decision cannot be stated, ask for the smallest missing context instead of packaging a broad review request.

## Push

Use `push` when the seed plan looks plausible but may be too shallow.

```xml
<push>
Do not merely polish the plan. Push past the obvious version.
Challenge sequencing, scope, evidence, validation, assumptions, and user-visible outcomes.
Look for the stronger plan that a careful implementer would wish they had before starting.
</push>
```

## Pull Through

Use `pull_through` when critique alone would be too easy.

```xml
<pull_through>
Do not stop at comments.
For each material critique, pull it through into a concrete plan change, validation step, decision, or missing-context request.
If a critique does not change the plan, downgrade it or omit it.
</pull_through>
```

## Grounding

Use grounding rules for repo-based assists.

```xml
<grounding>
Ground concrete repo claims in the attached package.
Name file paths, commands, tests, or docs when they support a claim.
Label inference and uncertainty instead of presenting them as facts.
</grounding>
```

For external or current-source claims, add a retrieval budget:

```xml
<retrieval_budget>
Use the minimum evidence sufficient to answer correctly.
Make another retrieval call only when a required fact, source, date, ID, owner, or comparison point is missing.
Do not search again merely to improve phrasing or add nonessential examples.
</retrieval_budget>
```

## Missing Context

Use this when the package may be incomplete.

```xml
<missing_context_gate>
If the package is insufficient, ask for the smallest missing context that would change the answer.
Do not invent files, APIs, test commands, project conventions, or completed evidence.
If you can still give a bounded recommendation, label assumptions clearly.
</missing_context_gate>
```

## Verification

Use this when the primary agent will act on the answer.

```xml
<verification>
Before finalizing, check that the answer satisfies the requested task, respects constraints, and can be verified locally.
List the local checks the primary agent should run before adopting the recommendation.
</verification>
```

For implementation plans, ask the advisor to make the plan traceable:

```xml
<plan_traceability>
Include requirements covered, named files or systems, relevant state transitions or data flow, validation checks, failure behavior, privacy/security considerations, and material open questions.
</plan_traceability>
```

## Minimal Markdown Prompt

Use Markdown when it helps scan the request, but choose the labels from the task
rather than copying a fixed template. For a tiny assist, a short paragraph plus a
few bullets may be better than section headers. For a plan review, headings that
name the actual decision, evidence, risks, and requested output may be clearer.
The useful invariant is not the header names; it is that the advisor understands
the decision, context, constraints, missing-context behavior, and answer shape.

## XML Blocks

Use XML-like blocks only when stable boundaries help more than Markdown or
plain prose. Name blocks after the actual job they do in that prompt. For
example, a plan hard-cut review might use blocks for the seed plan, evidence
that would change the decision, and how to pull objections through into edits;
a current-source check might use blocks for retrieval budget, source quality,
and uncertainty handling.
