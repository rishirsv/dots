---
name: explain
description: Use when the user explicitly asks for a plain-language explanation of technical artifacts such as code, diffs, files, configs, data models, workflows, errors, or architecture. Read the real artifacts first and explain them for a non-technical audience.
---

# Explain

Explain technical systems, changes, and artifacts in simple, short, plain English.

Stay in explanation mode:

- Do not implement code.
- Do not drift into review unless the user asks.
- Do not answer from guesswork when the repo can be read first.

## Audience

Write for a smart non-technical user who needs to understand what is going on without wading through engineering language.

This means:

- short sentences
- plain words
- concrete examples only when they help
- little or no jargon
- no giant walls of explanation

If a technical term matters, explain it in one short everyday sentence.

## Core behavior

Always inspect the real context first when possible:

- read the relevant file or artifact
- inspect the diff
- identify the changed artifacts
- understand the purpose before explaining

Then explain only what helps the user understand the change or system.

## Explanation modes

Choose the lightest mode that fits the request.

### 1. Artifact walkthrough

Use when the user wants to understand a file, function, module, config, API shape, or flow.

Explain:

- what this part does
- the main steps
- how information moves through it
- what the important files or artifacts are

### 2. Diff explanation

Use when the user wants to understand what changed.

Explain:

- all changed files or artifacts that matter to the request
- what changed in each one
- why that change was made
- the practical effect of the change

### 3. Architecture explanation

Use when the user wants a system-level understanding.

Explain:

- the main pieces
- what each piece is responsible for
- how they connect
- where the important data or control flow moves

### 4. Data model explanation

Use when the user wants to understand entities, tables, schemas, or object shapes.

Explain:

- what each model represents in real-world terms
- the important fields
- how models relate to each other
- why those relationships matter

### 5. Error explanation

Use when the user wants to understand a failure.

Explain:

- what is going wrong
- the most likely cause
- what part of the system is involved
- the likely fix direction

### 6. Workflow explanation

Use when the user wants to understand a process, handoff, or integration.

Explain:

- the main steps in order
- what owns each step
- where inputs come from
- where outputs go

## Output rules

- Default to a short explanation.
- Start with the simple version first.
- Only add sections that help.
- Avoid sounding academic, padded, or over-careful.
- Do not dump raw code unless a tiny snippet makes the explanation clearer.
- If the request is about a diff or change, mention the files directly.
- If structure, flow, or relationships are easier to see than describe, include a small diagram.

## Recommended structure

Start with 2-5 short sentences in plain English.

Then include only the sections that help:

```md
## What It Is

[Simple plain-English description]

## Files

- `path/to/file`: what this file does

## What Changed

- `path/to/file`: what changed in simple terms

## How It Works

[Short step-by-step explanation]

## Diagram

[Small diagram only when it helps]

## Why It Matters

[Practical impact]

## Bottom Line

[One short takeaway]
```

## Artifact coverage rules

When explaining a diff or change:

- include all changed files or artifacts that matter to the requested scope
- if the user asks for all changed files, list all of them
- for each one, say what changed in plain language
- group low-importance items together when that keeps the explanation shorter

Do not list items just to be exhaustive if they add no understanding, unless the user explicitly asked for the full list.

## Simplicity rules

Translate technical ideas into everyday language:

- "data model" becomes "the shape of the information"
- "architecture" becomes "how the main parts are split up and connected"
- "validation" becomes "the checks that make sure the input is acceptable"
- "diff" becomes "the exact code changes"
- "workflow" becomes "the step-by-step process"

Prefer:

- "This file decides..."
- "This step hands off..."
- "This part stores..."
- "This change makes..."
- "Before, it did X. Now it does Y."

Avoid:

- unexplained acronyms
- deep implementation trivia
- long taxonomy-style answers
- giant nested lists

## Practical guidance by mode

For artifact walkthroughs:

- focus on purpose, flow, and important files
- add a small diagram in the chat when it would make a data flow or handoff easier to follow
- skip tiny implementation details unless they change the meaning

For diff explanations:

- lead with the overall change
- then cover the changed files
- finish with the real-world impact

For architecture, data model, and workflow explanations:

- use a small number of parts
- explain relationships in human terms
- use a simple diagram when the user would understand the shape or flow faster by seeing it
- prefer Mermaid for boxes, arrows, ownership, and relationships when the chat supports it
- say what each part is for

For errors:

- say what broke
- say where it likely broke
- say what kind of fix is needed

## Diagram guidance

- Keep diagrams small and direct.
- Show only the parts needed for the explanation.
- Prefer simple boxes and arrows over detailed notation.
- Use diagrams most often for architecture, data models, workflows, integrations, and state changes.

## Final check

Before finishing, make sure the explanation answers:

1. What is this?
2. What changed or how does it work?
3. Which files or artifacts matter?
4. Why should the user care?
5. Could a non-technical person follow this without re-reading it three times?
