# OpenAI Docs Source Manifest

Accessed: 2026-05-02

Purpose: source-of-truth research list for updating the meta-prompt skill against the latest available OpenAI model prompting guidance. Full articles are not copied verbatim into this repo; each entry links to the canonical OpenAI page.

## Latest GPT Model Prompting

| Source | Canonical URL | Latest relevance | Local archive status |
| --- | --- | --- | --- |
| Using GPT-5.5 | https://developers.openai.com/api/docs/guides/latest-model | Current latest model guide found for GPT-5.5. Covers migration, reasoning effort, verbosity, image input detail, tool-heavy workflows, and prompt changes. | Linked only; not copied verbatim. |
| GPT-5.5 prompt guidance | https://developers.openai.com/api/docs/guides/prompt-guidance?model=gpt-5.5 | Dedicated GPT-5.5 prompt guidance linked from the latest model guide. | Linked only; not copied verbatim. |
| Prompting | https://platform.openai.com/docs/guides/prompting | General prompting guide: prompt objects, versions, variables, eval workflow, and prompt refinement. | Linked only; not copied verbatim. |
| Prompt generation | https://developers.openai.com/api/docs/guides/prompt-generation | Official guide for generating prompts and schemas; directly relevant to meta-prompt construction. | Linked only; not copied verbatim. |
| Text generation / prompt engineering | https://platform.openai.com/docs/guides/chat-completions | General prompt engineering guidance and model-specific caveat for reasoning models such as GPT-5. | Linked only; not copied verbatim. |
| GPT-5.2 prompting guide | https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide | Prior/latest-adjacent cookbook. Useful only where GPT-5.5-specific guidance is silent. | Linked only; not copied verbatim. |

## Image Prompting

| Source | Canonical URL | Latest relevance | Local archive status |
| --- | --- | --- | --- |
| GPT Image 2 model page | https://developers.openai.com/api/docs/models/gpt-image-2 | Latest GPT Image model page found. Notes `gpt-image-2` and snapshot `gpt-image-2-2026-04-21`. | Linked only; not copied verbatim. |
| Image generation guide | https://platform.openai.com/docs/guides/image-generation | Primary API guide for generating and editing images. Search results still referenced GPT Image 1.5 in some snippets; use canonical page for current state. | Linked only; not copied verbatim. |
| Images and vision guide | https://platform.openai.com/docs/guides/images-vision | Multimodal image overview across image input, vision, and generation. | Linked only; not copied verbatim. |
| Images API reference | https://platform.openai.com/docs/api-reference/images | Endpoint request parameters and constraints for image generation and image edits. | Linked only; not copied verbatim. |
| GPT Image 1.5 prompting guide | https://developers.openai.com/cookbook/examples/multimodal/image-gen-1.5-prompting_guide | Latest dedicated GPT Image prompting cookbook found. Use when GPT Image 2-specific prompting cookbook is unavailable. | Linked only; not copied verbatim. |
| Generate images with GPT Image | https://developers.openai.com/cookbook/examples/generate_images_with_gpt_image | Earlier GPT Image cookbook. Useful for implementation examples but secondary to GPT Image 2 and GPT Image 1.5 guidance. | Linked only; not copied verbatim. |
| Image evals for image generation and editing | https://cookbook.openai.com/examples/multimodal/image_evals | Related cookbook for evaluating generated/edited images. | Linked only; not copied verbatim. |

## Codex And Coding Prompting

| Source | Canonical URL | Latest relevance | Local archive status |
| --- | --- | --- | --- |
| Codex prompting guide | https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide | Dedicated Codex prompting guide linked from the GPT-5.2-Codex model page. | Linked only; not copied verbatim. |
| GPT-5.2-Codex model page | https://developers.openai.com/api/docs/models/gpt-5.2-codex | Current Codex model page found. Notes GPT-5.2-Codex and links to the dedicated prompting guide. | Linked only; not copied verbatim. |
| Code generation | https://developers.openai.com/api/docs/guides/code-generation | Current code generation guide. It recommends latest general-purpose GPT-5 family models for most code generation and Codex for agentic workflows. | Linked only; not copied verbatim. |
| Codex cloud | https://platform.openai.com/docs/codex | Codex product guide for cloud delegation and environment behavior. | Linked only; not copied verbatim. |

## Related OpenAI Docs Infrastructure

| Source | Canonical URL | Latest relevance | Local archive status |
| --- | --- | --- | --- |
| Docs MCP | https://developers.openai.com/learn/docs-mcp | OpenAI documentation MCP server for current docs lookup from agents. Useful for keeping this research fresh. | Linked only; not copied verbatim. |
| Models | https://platform.openai.com/docs/models | Current model catalog for checking latest model names before updating prompts. | Linked only; not copied verbatim. |
| Pricing | https://platform.openai.com/docs/pricing/ | Relevant when a prompt design changes model or image quality/fidelity choices. | Linked only; not copied verbatim. |

## Availability Notes

- GPT-5.5 documentation exists in the current OpenAI developer docs and should supersede GPT-5.2/GPT-5.1/GPT-5 guidance for general prompting unless a lower-version page covers a missing topic.
- GPT Image 2 exists as the latest image model page found. I did not find a dedicated GPT Image 2 prompting cookbook in OpenAI docs/cookbook during this pass.
- GPT Image 1.5 has the latest dedicated image prompting cookbook found and should be treated as the fallback prompting guide where GPT Image 2 docs are model-reference-only.
- The cookbook and docs pages should remain canonical sources. This repo should store derived skill guidance, not verbatim full-article mirrors.
