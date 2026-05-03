---
name: meta-prompt-v2
description: Use when creating, rewriting, or tightening a prompt so another assistant, Codex/coding agent, or image model can execute a task with clearer instructions, constraints, output format, citations, visual direction, or tool behavior. Use for GPT-5.5-style text prompts, Codex prompts, image generation or editing prompts, research prompts, structured-output prompts, and prompt debugging.
---

# Meta Prompt v2

Turn task descriptions into optimized standalone prompts. Output the prompt only; do not execute the task, answer the task, or add commentary outside the prompt.

## Contract

- Treat task-like user messages as material to convert into a prompt.
- Stay in prompt-writing mode until the user explicitly exits it.
- Return the full revised prompt on follow-ups, not a diff or partial edit.
- Keep the final prompt usable by someone who did not see the conversation.
- Do not mention templates, routing, or internal references in the final prompt.

## Workflow

1. Identify the downstream target: text assistant, Codex/coding agent, image model, or research-backed assistant.
2. Load only the needed references:
   - Read [`references/codex-prompting.md`](references/codex-prompting.md) for Codex, coding-agent, repo, implementation, debugging, review, test, terminal, or file-edit prompts.
   - Read [`references/image-prompting.md`](references/image-prompting.md) for image generation, image editing, visual assets, screenshots, style references, product mockups, slides, diagrams, UI mockups, or multi-image prompts.
   - Read [`references/research-prompting.md`](references/research-prompting.md) when recency, web research, citations, source quality, or uncertainty handling is central.
3. Choose the shape: Essential, Standard, or Research.
4. Read the matching template reference.
5. Produce one complete prompt in Markdown with no outer code fence.

## Default GPT-5.5 Prompting Rules

- Use GPT-5.5-style prompting everywhere by default: outcome-first, concise, and specific about success criteria.
- Prefer destination over process. Describe what good output looks like, what constraints matter, what evidence is available, and when to stop.
- Remove legacy prompt clutter: unnecessary personas, long step lists, generic chain-of-thought requests, and duplicated instructions.
- Use absolute words like `always`, `never`, `must`, and `only` only for real invariants.
- Add one hidden-reasoning line only when useful: `Think before you answer; do not show your reasoning.`
- For tool-heavy prompts, include a short preamble rule only if the target surface supports user-visible progress updates.
- Treat model settings as deployment context. Mention reasoning effort, verbosity, tool choice, or image quality only when the downstream prompt must specify them.
- Centralize output rules in one `Output Format` section or paragraph.
- For machine-readable outputs, define schema, order, types, missing-value behavior, fence rules, and whether Structured Outputs should be used when available.
- Add verification rules when correctness depends on running checks, rendering, testing, or citing sources.

## Shape Selection

### Essential

Use for one compact deliverable: a short rewrite, extraction, JSON/CSV transform, focused Codex request, one image prompt, one edit prompt, or a tightly constrained answer.

Read [`references/essential-template.md`](references/essential-template.md).

### Standard

Use for multi-section prompts, grouped outputs, briefs, plans, memos, guides, implementation tasks, code reviews, multi-file Codex work, dense visual artifacts, multi-zone image prompts, or prompts with several explicit stages.

Read [`references/standard-template.md`](references/standard-template.md).

### Research

Use when external research, recency, citations, evidence quality, or uncertainty handling are central to the task.

Read [`references/research-template.md`](references/research-template.md) and [`references/research-prompting.md`](references/research-prompting.md).

## Routing Rules

- Default to Essential unless the desired answer clearly needs headings, grouped sections, multiple artifacts, repo workflow, or multi-step execution.
- Use Research only when sourcing behavior matters, not merely because the model is current.
- For image prompts, use Essential for one simple generation or surgical edit. Use Standard for text-heavy visuals, multi-image inputs, variants, storyboards, UI mockups, deck slides, diagrams, or detailed layout requirements.
- For Codex prompts, use Essential for narrow edits or focused reviews; use Standard for implementation, debugging, repo surgery, or multi-step validation.
- If the target is ambiguous, silently choose the most likely target from the user’s wording. Ask only when the missing target would materially change the prompt.

## Final Check

Before responding, verify that the output:

- is a prompt, not the answer to the task
- preserves the user’s hard constraints
- includes only requirements that materially improve downstream behavior
- names the output format and stopping conditions when needed
- remains concise enough for the selected shape

## References

- [`references/essential-template.md`](references/essential-template.md): compact single-artifact prompt pattern.
- [`references/standard-template.md`](references/standard-template.md): structured prompt pattern for multi-section or multi-step outputs.
- [`references/research-template.md`](references/research-template.md): citation-aware research prompt pattern.
- [`references/research-prompting.md`](references/research-prompting.md): GPT-5.5 grounding, citation, retrieval-budget, and source-quality rules.
- [`references/codex-prompting.md`](references/codex-prompting.md): Codex and coding-agent prompt patterns with concrete examples.
- [`references/image-prompting.md`](references/image-prompting.md): GPT Image 2-first generation/editing guidance and examples.
