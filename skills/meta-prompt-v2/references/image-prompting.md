# Image Prompting

Use this one reference for image generation, image editing, visual assets, screenshots, style references, product mockups, slides, diagrams, UI mockups, ads, multi-image inputs, and Codex image-tool prompts.

Sources: official OpenAI GPT Image 2 model docs, image generation guide, image API reference, GPT Image generation models prompting guide, and GPT Image 1.5 prompting cookbook. Default to GPT Image 2 for new prompts.

## Current Defaults

- Target `gpt-image-2` unless the user explicitly asks for another model or backward compatibility.
- Use `quality="low"` for speed, drafts, or high-volume exploration.
- Use `quality="medium"` for normal production-quality images.
- Use `quality="high"` for dense text, small labels, photorealism, identity-sensitive edits, diagrams, slide graphics, or customer-facing assets.
- For `gpt-image-2`, specify size when the consuming surface requires it. Useful defaults: `1024x1024`, `1024x1536`, `1536x1024`, and `2560x1440` for reliable widescreen.
- Keep `gpt-image-1.5` or `gpt-image-1` only for validated legacy workflows during migration.

## Prompt Fundamentals

Build prompts in this order:

1. intended artifact and use case
2. scene/background or canvas
3. subject and key details
4. composition, viewpoint, and hierarchy
5. style, lighting, materials, and palette
6. exact text and typography
7. constraints and exclusions

Use short labeled sections for dense prompts. For simple prompts, a compact paragraph is enough.

## Generation Patterns

### Infographic / Explainer

Ask for audience, lesson objective, required labels, visual hierarchy, and readability. Use high quality for dense text.

```text
Create a vertical infographic for [audience] explaining [topic]. Show [main process/components] with clear arrows, labels, and a readable hierarchy. Include these exact labels: "[label 1]", "[label 2]", "[label 3]". Use a clean educational style with enough spacing for scanning. Avoid tiny text, decorative clutter, unrelated icons, and extra claims.
```

### Photorealistic Scene

Prompt as if a real photo is being captured. Include natural imperfections and avoid over-polished language.

```text
Create a photorealistic [shot type] of [subject] in [setting]. Use [framing/viewpoint], natural [lighting], real material texture, and everyday imperfections. The image should feel candid and unposed, not like a cinematic poster or heavily retouched studio image.
```

### Logo / Mark

Ask for originality, simplicity, shape, negative space, and scalability.

```text
Create an original, non-infringing logo for "[brand]". It should feel [brand traits] and work at small and large sizes. Use clean vector-like shapes, a strong silhouette, balanced negative space, and a plain background. No watermark, mockup scene, extra text, or unrelated symbols.
```

### Ad / Campaign Creative

Write like a creative brief.

```text
Create a polished campaign image for [brand/product] aimed at [audience]. Concept: [creative idea]. Show [scene/subject] with [composition and mood]. Include the exact tagline "[copy]" once, clearly legible and integrated into the layout. No extra text, no watermarks, no unrelated logos.
```

### Storyboard / Comic

Use one concrete visual beat per panel.

```text
Create a [format] with [number] panels. Panel 1: [visual beat]. Panel 2: [visual beat]. Panel 3: [visual beat]. Keep panel sizes consistent, action readable, and character details consistent across panels.
```

### UI Mockup

Describe the product like it already exists. Avoid concept-art wording.

```text
Create a realistic [mobile/desktop] UI mockup for [product]. Show [core screen sections], realistic content, clear hierarchy, practical navigation, and polished spacing. It should look like a usable shipped interface, not a conceptual illustration.
```

### Slide / Diagram / Productivity Image

Write as an artifact spec, not an illustration request.

```markdown
# Objective
Create one [slide / diagram / chart page / productivity visual] for [use case].

# Canvas And Hierarchy
- Canvas: [aspect ratio or size]
- Primary hierarchy: [title, main diagram, chart, footnote, callouts]
- Visual language: [deck style or operational style]

# Required Content
- Title: "[exact title]"
- Labels / values / dates: "[exact items]"

# Constraints
- Highly readable typography
- Polished spacing
- No decorative clutter
- No generic stock-photo treatment
```

## Edit Patterns

For edits, separate what changes from what must remain unchanged. Repeat critical invariants during iterative edits.

### Translation

```text
Translate all visible text into [language]. Preserve the original layout, typography style, spacing, hierarchy, icons, imagery, and brand elements. Change only the text. Do not add or remove content.
```

### Product Cleanup

```text
Extract the product and place it on a plain opaque background. Preserve product geometry, label text, materials, and proportions exactly. Create a crisp silhouette with no halos or fringing. Add only light polishing and a subtle realistic contact shadow.
```

### Text-In-Image Marketing Edit

```text
Create a realistic [placement/mockup] using the provided product image. Include this exact text once: "[copy]". Use [typography/placement]. Preserve the product label and geometry. No extra characters, watermarks, or unrelated logos.
```

### Weather / Lighting Transformation

```text
Change the scene to [weather/time/lighting]. Preserve identity, geometry, camera angle, object placement, layout, and background structure. Change only environmental conditions such as lighting, shadows, atmosphere, precipitation, or ground wetness.
```

### Object Removal

```text
Remove [object]. Do not change anything else. Preserve background continuity, lighting, shadows, subject identity, camera angle, and image quality.
```

### Multi-Image Compositing

```markdown
# Objective
Create one believable composite image.

# Inputs
- Image 1: [destination scene]
- Image 2: [donor subject/style/object]

# Composition
Place [element from image 2] [location in image 1]. Match lighting, perspective, scale, shadows, and style.

# Preserve
- [scene/background/framing/identity/protected elements]

# Constraints
- Do not change anything else.
```

## Codex Image Prompts

When writing a prompt for Codex to pass to an image tool, include:

- intended asset role: hero image, screenshot-like UI, slide graphic, icon, texture, mockup, diagram, or test fixture
- target dimensions or aspect ratio when known
- surrounding app/document context
- exact text and protected brand/product elements
- how Codex should verify the image after generation, such as render check, screenshot inspection, or placement in UI

## Migration Notes

- Upgrade legacy GPT Image 1.5 prompts to GPT Image 2 by keeping the prompt mostly the same first.
- Retune only after comparing quality, latency, retry rate, text fidelity, edit drift, and production fit.
- Use GPT Image 2 for customer-facing assets, photorealism, editing-heavy workflows, text in images, brand-sensitive creative, and flexible sizes.
