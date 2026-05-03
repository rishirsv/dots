# Image Prompting

Use this reference when the downstream deliverable is a prompt for image generation or image editing.

This file is aligned to the newer OpenAI cookbook structure rather than to a custom image-prompt taxonomy.

## Route By Real Use Case

Choose the pattern that matches the actual job:

- infographic or educational visual
- photorealistic image
- ad or marketing creative
- UI mockup
- scientific or explanatory visual
- slide, diagram, chart, or productivity image
- translation in images
- style transfer or restyle
- product cleanup on plain background
- object insertion or multi-image compositing

Do not force everything into the same shape. The best prompt depends on the use case.

## Prompt Anatomy

For most image prompts, build in this order:

1. artifact goal
2. subject and scene
3. composition and placement
4. style and finish
5. exact text and hierarchy
6. constraints

Use short labeled sections when the request is dense, layout-heavy, or edit-heavy.

## Cookbook Rules

- Name the deliverable early.
- Put exact in-image text in quotes.
- Say where the text belongs when layout matters.
- Use concrete composition language instead of vague quality words.
- For slides, diagrams, and charts, write the prompt like an artifact spec rather than an illustration brief.
- For edits, separate what changes from what must remain unchanged.
- For multi-image tasks, label each input by role.

## Slides, Diagrams, Charts, And Productivity Images

This is the highest-value pattern for business graphics.

- Name the exact artifact: slide, workflow diagram, chart page, agenda, org chart, infographic page, timeline, KPI summary.
- Define the canvas intent: full-slide 16:9, reusable component, landscape page, square tile, or vertical infographic.
- Define the hierarchy explicitly: title, main diagram, supporting chart, footer, side panel, callouts, metric strip.
- Put the real labels, dates, values, and headings directly in the prompt.
- Include practical constraints: readable typography, polished spacing, no decorative clutter, no generic stock-photo treatment.

Good opening:

`Create one slide titled "Market Opportunity" that feels like a real deck page.`

Avoid:

`Make a beautiful consulting graphic.`

## Text In Images

- Quote exact copy.
- Group text by region or hierarchy when needed.
- If a word or name is important, preserve its exact spelling.
- When there is a lot of text, ask for readability and polished spacing rather than cramming everything in.

## Edit Patterns

Use these only when the user is editing an existing image.

### Translation In Images

- keep everything except the text the same
- preserve typography style, spacing, hierarchy, icons, and imagery
- change only the text

### Style Transfer Or Restyle

- say what visual language to borrow
- say what content or subject should change
- preserve only the intended style cues

### Product Cleanup

- move the product to a plain opaque background
- preserve product geometry and label integrity
- add only light polishing if requested

### Object Insertion Or Multi-Image Compositing

- label each image by role
- specify what gets transplanted
- specify where it goes
- specify what must remain unchanged

## High-Leverage Templates

### Compact single-image template

```text
Create a [artifact] for [intended use]. Show [subject and scene]. Compose it with [framing or placement]. Use [style, palette, and finish]. Include the exact text "[text]" with [placement and hierarchy] if needed. Keep [non-negotiable constraints].
```

### Artifact-spec productivity template

```markdown
# Objective
Create one [slide / workflow diagram / chart page / productivity visual].

# Canvas And Hierarchy
- Canvas: [full-slide 16:9 / component / page image / vertical infographic]
- Primary hierarchy: [title, main graphic, supporting chart, footer, callouts]
- Visual language: [clean enterprise slide / deck page / operational diagram]

# Required Content
- Title: "..."
- Labels / values / dates / stages: "..."
- Required structures

# Constraints
- Readable typography
- Polished spacing
- No decorative clutter
- No generic stock-photo treatment unless requested
```

### Edit template

```text
Edit the provided image. Keep [fixed anchors]. Change only [exact delta]. Preserve [layout, typography, lighting, geometry, or scene elements]. Do not alter [protected elements].
```

### Multi-image template

```markdown
# Objective
[What final image to create]

# Inputs
- Image 1: [role]
- Image 2: [role]

# Composition
[What from each image should appear and where]

# Preserve
- [What must remain unchanged]

# Constraints
- [Lighting, perspective, scale, text, exclusions]
```

## Example Patterns

### Productivity slide

```text
Create one pitch-deck slide titled "Market Opportunity". Use a clean white background, crisp professional typography, and a polished slide hierarchy. Include a TAM/SAM/SOM concentric-circle diagram, a supporting bar chart below, exact values "TAM: $42B", "SAM: $8.7B", and "SOM: $340M", small footnotes "AGI Research, 2024" and "Internal analysis", and a simple logo placeholder in the bottom-right corner. Keep the layout highly readable with clear data hierarchy, polished spacing, and no decorative clutter, stock photography, or clip art.
```

### Infographic

```text
Create a vertical educational infographic that explains a three-step incident response workflow. Use flat enterprise graphics, clear labels, and strong hierarchy. Title: "Incident Response In 3 Steps". Steps: "Detect", "Contain", and "Recover". Add a footer note: "Escalate security incidents immediately." Keep the layout clean and highly legible.
```

### UI mockup

```text
Create a realistic mobile app UI mockup for a local farmers market. Show a practical header, a short list of vendors with small photos and categories, a "Today's specials" section, and clear location and hours information. Keep the interface grounded, readable, and realistic rather than conceptual.
```

### Translation in images

```text
Edit the provided image by translating all visible text into Spanish. Preserve the layout, typography style, spacing, hierarchy, imagery, icons, and brand elements. Change only the text.
```

### Product cleanup

```text
Edit the provided product image. Place the product on a plain white opaque background with a centered composition, crisp silhouette, no halos, and a subtle realistic contact shadow. Preserve the product geometry and label legibility exactly.
```

### Multi-image compositing

```text
Create one believable composite image using the supplied references. Use Image 1 as the destination scene and Image 2 as the donor subject. Place the donor beside the main person in Image 1. Match lighting, scale, perspective, and shadows so it feels naturally captured in the original scene. Do not change anything else.
```
