# Research Notes

Accessed: 2026-05-02

These notes are intentionally non-verbatim. Use `openai-docs-source-manifest.md` for canonical URLs.

## What Changed For Meta-Prompt Work

GPT-5.5 is the newest GPT-5 family guide found. The practical implication for a meta-prompt skill is to start from outcome-first prompting: expected outcome, success criteria, allowed side effects, evidence rules, and output shape. GPT-5.5 guidance deemphasizes carrying forward old detailed process scaffolding by default.

Reasoning effort should be treated as an application parameter, not only prompt text. `medium` is the documented GPT-5.5 default and a balanced starting point. `low` is a better latency-sensitive first experiment than `none` when tool use or multi-step work still matters. `high` and `xhigh` should be eval-driven.

Prompt text should avoid encoding things that now belong in API features. Output schemas should move to Structured Outputs where possible. Stable prompt prefixes should be kept cache-friendly, with dynamic request data later in the prompt.

For tool-heavy agentic workflows, GPT-5.5 docs emphasize concrete success criteria, stopping rules, tool descriptions, allowed side effects, and evidence expectations. For coding agents, include orchestration expectations: codebase navigation, reuse, subagent behavior when applicable, tests, and when to continue versus ask.

## Image Prompting Direction

GPT Image 2 is the latest image model page found, but the latest dedicated image prompting cookbook found is for GPT Image 1.5. For now, meta-prompt image guidance should prefer GPT Image 2 as the target model when available, while borrowing prompt structure patterns from the GPT Image 1.5 cookbook.

Image prompts should be structured around the visible outcome: scene/background, subject, key details, constraints, output use case, and quality/latency choices. For edits, separate what changes from what must remain invariant. Critical invariants should be restated during iterative edits because image edits can drift.

For image text, prompts should specify exact literal strings, typography, placement, contrast, and spelling for uncommon names. For multi-image inputs, identify each image by index and state how each is used.

## Codex Prompting Direction

Codex guidance is separate from general GPT prompting. The current docs distinguish API prompting for Codex models from end-user Codex usage. For meta-prompt work that generates developer instructions for coding agents, include repository context, ownership boundaries, validation commands, file-change expectations, and review criteria.

The code generation guide positions Codex as the agentic coding product and latest GPT-5 family models as strong defaults for API code generation. The meta-prompt skill should not assume one harness; it should ask or infer whether the output is for Codex, an API coding model, or a general GPT prompt.

## Follow-Up For The Skill

- Add a `docs/` reference pointer from the meta-prompt `SKILL.md` if this research is meant to drive behavior.
- Consider adding a short "latest model check" step to the skill so it does not freeze on GPT-5.5 or GPT Image 2 forever.
- Keep the skill's active instructions concise and put detailed source references here.
