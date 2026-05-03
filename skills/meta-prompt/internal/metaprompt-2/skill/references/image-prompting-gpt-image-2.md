# GPT Image 2 Prompting

Use this reference when the downstream deliverable is a prompt for GPT Image generation or editing, especially `gpt-image-2`.

This reference is grounded in OpenAI's official GPT Image Generation Models Prompting Guide, saved locally at `../../sources/official-openai/gpt-image-generation-models-prompting-guide.md`.

## Model Posture

- Default new GPT Image workflows to `gpt-image-2`.
- Use `gpt-image-2` for production-quality generation, editing-heavy workflows, text-heavy images, photorealism, compositing, identity-sensitive edits, and brand-sensitive creative.
- If `gpt-image-2` is unavailable or the user explicitly targets `gpt-image-1.5`, keep the prompt largely the same at first and validate output quality, latency, retry rate, and regressions before retuning.
- For high-volume exploratory work, `quality="low"` can be a good starting point; for dense text, small labels, close-up portraits, identity-sensitive edits, and high-resolution outputs, compare `medium` or `high`.

## Route By Use Case

Choose the prompt shape by the real job:

- Infographic or educational visual
- Photorealistic image
- Ad or marketing creative
- Logo or brand mark
- UI mockup
- Scientific or explanatory visual
- Slide, diagram, chart, or productivity image
- Translation/localization in images
- Style transfer or restyle
- Product cleanup or catalog asset
- Object removal, insertion, compositing, or multi-image workflow
- Character consistency or sequential story assets

## Prompt Fundamentals

Write image prompts in a consistent order:

1. Intended use and artifact type
2. Scene, background, or source-image role
3. Subject and key details
4. Composition, framing, placement, and hierarchy
5. Style, medium, lighting, materials, and quality cues
6. Exact text, labels, values, or typography requirements
7. Constraints, exclusions, and preserve/change rules

Use short labeled sections for dense, layout-heavy, or edit-heavy prompts. Minimal prompts, descriptive paragraphs, JSON-like structures, and instruction-style prompts can all work if intent and constraints are clear.

## Generation Rules

- Name the deliverable early: slide, mobile UI mockup, ad, poster, logo, infographic, chart page, storyboard frame.
- Include the intended audience or use case when it changes the look.
- Be concrete about materials, shapes, textures, visual medium, and finish.
- For photorealism, include `photorealistic` directly and use high-level photography cues for framing, lighting, and realism.
- For UI mockups, describe a real usable interface with layout, hierarchy, spacing, and concrete UI elements; avoid concept-art phrasing.
- For slides, diagrams, and charts, include the actual labels, values, axes, legends, footnotes, and visual hierarchy.
- For scientific or educational visuals, list required components and exclusions explicitly.

## Editing Rules

- Separate what changes from what must remain unchanged.
- Use `change only X` plus `keep everything else the same` for surgical edits.
- Restate invariants on every iteration when drift would matter.
- Preserve identity, geometry, layout, typography, labels, brand elements, camera angle, lighting, surrounding objects, and background when they are intended anchors.
- For translation/localization, change only the text and preserve typography style, placement, spacing, hierarchy, icons, imagery, and brand elements.
- For product cleanup, preserve product geometry and label integrity; use an opaque plain background for `gpt-image-2` and remove background downstream if transparency is required.

## Text In Images

- Put exact text in quotes or ALL CAPS.
- Specify placement, hierarchy, font style, size, color, contrast, and whether text should appear once.
- For unusual names or spellings, spell them letter-by-letter if accuracy matters.
- Use `medium` or `high` quality for small text, dense layouts, multi-font designs, legends, axes, footnotes, and information panels.
- Explicitly forbid extra text when the image should contain only the specified copy.

## Multi-Image Inputs

- Label each input by index and role, for example: `Image 1: product photo`, `Image 2: style reference`.
- Specify exactly which elements transfer, which image defines style, and which image defines content.
- For compositing, state what moves where and how scale, lighting, shadows, perspective, and contact points should match.
- For identity-sensitive edits, lock face, expression, pose, body shape, skin tone, hairstyle, camera angle, framing, and background unless the user asks otherwise.

## Template

```markdown
# Objective
Create one [artifact type] for [intended use/audience].

# Visual Direction
- Subject/scene: [specific subject, scene, or source-image role]
- Composition: [framing, viewpoint, placement, hierarchy]
- Style: [medium, realism level, palette, lighting, material cues]

# Required Content
- Exact text: "[text]" placed [location/hierarchy]
- Required labels, values, objects, stages, or UI elements: [list]

# Preserve / Change
- Preserve: [identity, layout, typography, geometry, background, brand elements]
- Change only: [specific delta for edits]

# Constraints
- [quality, readability, no extra text, no logos, no watermark, no unintended edits]
```

For compact prompts, collapse the same information into one paragraph while keeping artifact type, subject, composition, style, text, and constraints explicit.
