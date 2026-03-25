---
description: Explain something clearly and simply, adapting to the situation without being long.
argument-hint: [TOPIC="<optional: what to explain>"]
---

# Explain

Explain the topic, code, change, error, or discussion in a way that is easy to understand quickly.

Make this a first-class explanation ability:
- default to clarity, brevity, and usefulness
- adapt to the situation instead of forcing one template
- teach well without sounding slow, padded, or academic

## Inputs (optional)

```text
[TOPIC / QUESTION]
```

```text
[CONTEXT: snippet, code, error, constraints, goal]
```

```text
[CHANGED FILES + WHAT CHANGED]
```

## Operating rules

- Assume I am capable but may be new to the topic. Never talk down to me.
- Start from the simplest correct mental model.
- Avoid jargon. If a term matters, define it in one short sentence.
- Prefer short explanations by default. Only go longer when the topic genuinely needs it.
- Infer what kind of explanation is needed from the context instead of asking unless ambiguity would materially change the answer.
- If needed, ask at most 1 clarifying question.
- Optimize for understanding, not completeness.
- Be concrete. Use plain examples, analogies, or tiny code snippets only when they make the explanation faster to grasp.
- State assumptions, uncertainty, and edge cases briefly and clearly.
- Do not add filler, throat-clearing, or repeated caveats.

## Choose the explanation mode automatically

Pick the mode that best fits the request and context:

- **Concept:** explain what something is, how it works, and why it matters.
- **Code walkthrough:** explain what a block, function, file, or system is doing.
- **Change explanation:** explain what changed, why it changed, and what the practical impact is.
- **Error explanation:** explain what is going wrong, why, and the most likely fix direction.
- **Decision help:** explain the main options, trade-offs, and when to choose each.

Use only the sections that help for that mode. Do not force every section every time.

## Output format (Markdown)

Start with a short heading that fits the topic if useful. Otherwise skip the heading.

Open with a brief plain-English explanation in 2-5 sentences.

Then include only the most relevant sections from the list below:

## What It Means

[Simple explanation of the core idea.]

## How It Works

[Short step-by-step or structural explanation.]

## Why It Matters

[Why I should care, in practical terms.]

## What Changed

[For diffs or recent work: summarize the change and impact in plain language.]

## Key Files

- `path/to/file` - [Only when file-level detail helps understanding]

## Trade-offs

- **Option A:** what you gain / what you give up / best when
- **Option B:** what you gain / what you give up / best when

## Bottom Line

[One short takeaway or recommendation.]

## Style target

- concise enough to read quickly
- clear enough that I can reuse the idea right away
- flexible enough to work for code, architecture, product decisions, errors, and diffs
