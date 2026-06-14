# Explainer Patterns

Read this when `unpack` needs a Mermaid diagram, an HTML explainer, or an image
explainer. Use these patterns to choose a visual that reduces comprehension
load; do not add visuals for decoration.

## When To Use A Diagram

Use a diagram when prose would force the reader to hold too many relationships
in memory.

Good fits:

- request flow, data flow, event flow, or lifecycle
- architecture ownership or dependency relationships
- state transitions, branching rules, or failure paths
- component-to-role mapping where names obscure the purpose
- timeline or sequence where order changes meaning

Poor fits:

- a single definition or small distinction
- a list that is already easy to scan
- decorative illustrations
- concepts where the visual would duplicate the prose without reducing effort

## Mermaid In Text Answers

Use Mermaid for lightweight text-mode diagrams when the user did not ask for a
standalone artifact.

Prefer:

- `flowchart TD` for pipelines, ownership, and dependencies
- `sequenceDiagram` for calls, messages, or actor interactions
- `stateDiagram-v2` for lifecycle states and transitions

Keep Mermaid diagrams small. Use short labels, then explain the labels in prose.
If the diagram needs more than about eight nodes, either simplify it or ask
whether the user wants an HTML explainer.

## HTML Explainer Mode

Create a standalone HTML/CSS file when the user asks for an HTML explainer,
visual explainer page, interactive-looking explainer, or local explainer
artifact.

Use `assets/html-explainer-template.html` as the starting point. Replace all
placeholder content with the current explanation. Keep the final file plain
HTML/CSS with no JavaScript.

Good HTML explainers usually include:

- a title and one-sentence gist
- one compact visual map or flow
- two to four sections that explain the moving parts
- a term map only when terminology is blocking comprehension
- a final "why it matters" or "what to watch" note

Do not include teaching exercises, quizzes, expandable lessons, scripts,
external fonts, trackers, network assets, or project secrets.

## Image Explainer Mode

Generate an image directly when the user asks for an image explainer, visual
image, infographic, labeled diagram, or concept map image.

Use a prompt with this structure:

```text
Create a clean labeled explainer diagram about: <topic>.

Audience: technically curious user who wants fast comprehension, not a lesson.
Purpose: make <specific relationship, flow, lifecycle, or distinction> clear.

Composition:
- <diagram type: left-to-right flow, layered architecture, lifecycle loop,
  comparison, state machine, timeline, or concept map>
- <main nodes or stages, with short exact labels>
- <arrows or grouping that show how the parts relate>
- <one small "key idea" callout>

Style:
- modern editorial technical diagram
- high contrast, clean spacing, readable labels
- no decorative clutter, no tiny text, no photorealism unless requested

Text constraints:
- keep labels short
- avoid paragraphs inside the image
- do not invent product names, numbers, or source claims
```

Pick the diagram type from the material:

- flow: request path, data pipeline, event sequence
- layered architecture: UI, model, service, storage, external dependency
- lifecycle loop: recurring process or refresh cycle
- comparison: two similar concepts, APIs, modes, or states
- state machine: statuses and allowed transitions
- concept map: a few terms whose relationships matter more than order

If the source material is repo-specific, inspect the relevant source before
generating labels. If labels depend on uncertain inference, use generic role
labels rather than inventing exact names.

## Visual Checks

Before delivering a visual artifact or image prompt, check that:

- the visual answers the user's question, not a broader lesson
- labels are short enough to read
- relationships are visible through arrows, grouping, or spatial placement
- every technical claim is grounded in the prompt, inspected source, or explicit
  user-provided context
- the visual does not reveal private source text or secrets
