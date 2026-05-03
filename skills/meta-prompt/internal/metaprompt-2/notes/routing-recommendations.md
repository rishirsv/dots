# Metaprompt 2 Routing Recommendations

This note records the proposed routing additions for the experimental Metaprompt 2 copy. It does not change the current `skills/meta-prompt/skill/` master.

## Official Sources Used

- OpenAI Codex Prompting Guide: `sources/official-openai/codex-prompting-guide.md`
- OpenAI Citation Formatting guide: `sources/official-openai/citation-formatting-guide.md`
- OpenAI GPT Image Generation Models Prompting Guide: `sources/official-openai/gpt-image-generation-models-prompting-guide.md`
- OpenAI Image Generation API guide: `sources/official-openai/image-generation-guide.html`
- OpenAI GPT Image 2 model page: `sources/official-openai/gpt-image-2-model.html`
- OpenAI GPT Image 1.5 model page: `sources/official-openai/gpt-image-1.5-model.html`

## Proposed Routing

Add a Codex/coding-agent reference route before the normal Essential / Standard / Research selection:

- Trigger on Codex, coding agent, codebase implementation, code review, debugging, refactoring, tests, shell/tool workflow, frontend build, browser validation, repo automation, or PR/commit workflows.
- Load `references/codex-coding-prompting.md`.
- Default to Standard unless the request is a strict one-block output or tiny code transform.

Add a GPT Image 2 route before the existing generic image route:

- Trigger on GPT Image, `gpt-image-2`, image generation, image editing, compositing, image localization, product cleanup, UI mockup image, slide/diagram/chart image, or text-in-image assets.
- Load `references/image-prompting-gpt-image-2.md`.
- If `gpt-image-2` is unavailable or `gpt-image-1.5` is explicit, keep the same prompt posture first and validate before retuning.

Add an advanced citation route after task-type routing but before final template drafting:

- Trigger on parser-ready citations, advanced citations, citation markers, citable blocks, source IDs, line ranges, tool-output citations, injected-context citations, or citation post-processing.
- Load `references/advanced-citation-formatting.md`.
- Keep simple numeric citations as the default for normal research briefs and memos.

## Why These Should Be Separate Files

- They are domain-specific and would bloat the main `SKILL.md`.
- They are used only for a subset of prompt-writing tasks.
- They support the skill-creator progressive-disclosure pattern: core routing in `SKILL.md`, detailed behavior in a reference.
- They keep the candidate easy to compare against current master without disturbing the installed skill.
