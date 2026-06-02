---
name: explain
description: >-
  Use when the user asks for a clear explanation of code, diffs, files, configs, data models, workflows, errors, architecture, diagrams, or non-code processes. Scale depth to the question: answer simple general questions directly, inspect real artifacts before technical explanations, and use fast explorer agents for complex cross-surface systems. Not for implementation or code review unless asked.
---

# Explain

Explain anything clearly. Match depth, length, and evidence to the question.

## Rules

- Answer simple general questions immediately.
- Inspect real files, diffs, logs, pages, diagrams, or artifacts before explaining technical work.
- Stay in explanation mode; do not implement or review unless asked.
- Do not announce that the answer is "plain English" or "simple English." Just answer.
- Be concise in framing, not shallow in substance. Expand when the question needs depth.
- Use examples only when they make the explanation easier to understand.

## Default Uses

Use Explain by default for requests like:

- "Explain this diff."
- "Explain this config/error/workflow."
- "Explain how this data model fits together."
- "Explain this diagram or turn it into words."
- "Explain how this feature works across the app."

Do not require a diagram. Add one only when shape, flow, ownership, states, or relationships are easier to see than read.

## Depth

Use the lightest investigation that can answer accurately:

- **Instant**: Everyday questions or tiny technical questions. No repo search.
- **Direct read**: One file, diff, error, config, diagram, or narrow flow. Read it, then explain.
- **Trace**: Several files or one feature path. Find the entry point, follow data/control flow, and name the handoffs.
- **Explorer-backed**: Many surfaces, services, packages, or ownership boundaries. Spawn one or two read-only fast explorer agents when tools allow.

For explorer-backed work, give each fast explorer agent a distinct surface area and ask for: files read, flow traced, boundaries, gotchas, and open questions. Then synthesize one answer. If the user asks how a system spans multiple surfaces, include a short exploration plan and a synthesis step in the final answer.

When scope is ambiguous, state your interpretation and proceed. Ask only when the wrong interpretation would waste the answer.

## Lenses

- **Artifact**: purpose, organization, important parts.
- **Diff**: what changed, why, practical effect.
- **Architecture**: parts, owners, connections, boundaries.
- **Data model**: what the information represents, fields, relationships.
- **Error**: what broke, likely location, fix direction.
- **Workflow**: steps, owners, inputs, outputs, handoffs.
- **Diagram**: what each part means, how the arrows/relationships work, what the viewer should notice.

Cover all artifacts that matter to the requested scope. If the user asks for all changed files, cover all changed files.

## Diagrams

Use a small diagram when it helps. Do not ask first.

Good diagram moments:

- ownership splits
- request, runtime, or data flow
- state transitions
- handoffs between tools, services, files, or people
- model relationships
- before/after behavior

Prefer Mermaid for boxes, arrows, sequence, and relationship diagrams. Keep diagrams small and label nodes in human terms.

## Style

- Start with the answer.
- Use concrete words and short sentences.
- Define technical terms only when needed.
- Prefer "Before, it did X. Now it does Y." over abstract change summaries.
- Reference files directly when they matter.
- Avoid raw code dumps, giant nested lists, and taxonomy-style writing.

## Shape

Use only useful sections:

```md
**What It Is**

**What Changed**

**How It Works**

**Files**

**Diagram**

**Why It Matters**

**Bottom Line**
```

Small questions may need only a paragraph or two. Complex systems should be thorough enough that the user can understand the moving parts without reading annotated source code.

## Final Check

Check only what applies:

1. what it is
2. how it works or what changed
3. which artifacts matter
4. why it matters
5. what remains unknown, if anything could not be traced
