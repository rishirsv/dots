---
name: code-explain
description: Use only when the user explicitly asks for a plain-language explanation of code, diffs, files, data models, errors, or architecture. Read the real code first and explain it for a non-technical audience.
---

# Code Explain

Explain technical work in simple, short, plain English.

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

- read the relevant file
- inspect the diff
- identify the changed files
- understand the purpose before explaining

Then explain only what helps the user understand the change or system.

## Explanation modes

Choose the lightest mode that fits the request.

### 1. Code walkthrough

Use when the user wants to understand a file, function, module, or flow.

Explain:

- what this part does
- the main steps
- how data moves through it
- what the important files are

### 2. Diff explanation

Use when the user wants to understand what changed.

Explain:

- all changed files that matter to the request
- what changed in each file
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

## Output rules

- Default to a short explanation.
- Start with the simple version first.
- Only add sections that help.
- Avoid sounding academic, padded, or over-careful.
- Do not dump raw code unless a tiny snippet makes the explanation clearer.
- If the request is about a diff or change, mention the files directly.

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

## Why It Matters

[Practical impact]

## Bottom Line

[One short takeaway]
```

## File coverage rules

When explaining a diff or change:

- include all changed files that matter to the requested scope
- if the user asks for all changed files, list all of them
- for each file, say what changed in plain language
- group low-importance files together when that keeps the explanation shorter

Do not list files just to be exhaustive if they add no understanding, unless the user explicitly asked for the full list.

## Simplicity rules

Translate technical ideas into everyday language:

- "data model" becomes "the shape of the information"
- "architecture" becomes "how the main parts are split up and connected"
- "validation" becomes "the checks that make sure the input is acceptable"
- "diff" becomes "the exact code changes"

Prefer:

- "This file decides..."
- "This part stores..."
- "This change makes..."
- "Before, it did X. Now it does Y."

Avoid:

- unexplained acronyms
- deep implementation trivia
- long taxonomy-style answers
- giant nested lists

## Practical guidance by mode

For code walkthroughs:

- focus on purpose, flow, and important files
- add a small diagram in the chat when it would make a data flow or handoff easier to follow
- skip tiny implementation details unless they change the meaning

For diff explanations:

- lead with the overall change
- then cover the changed files
- finish with the real-world impact

For architecture and data model explanations:

- use a small number of parts
- explain relationships in human terms
- use a simple diagram when the user would understand the flow faster by seeing it
- say what each part is for

For errors:

- say what broke
- say where it likely broke
- say what kind of fix is needed

## Final check

Before finishing, make sure the explanation answers:

1. What is this?
2. What changed or how does it work?
3. Which files matter?
4. Why should the user care?
5. Could a non-technical person follow this without re-reading it three times?
