# Explainer Patterns

Read this to decide *whether* and *which* visual reduces comprehension load.
Choose a visual that removes effort; never add one for decoration. For building a
standalone HTML explainer, this file routes you to
[html-explainer-design.md](html-explainer-design.md) and [DESIGN.md](DESIGN.md).

## When A Diagram Helps

Use a diagram when prose would force the reader to hold too many relationships in
memory at once.

Good fits: request/data/event flow or lifecycle; architecture ownership or
dependency; state transitions, branching, or failure paths; component-to-role
mapping where names hide purpose; timeline or sequence where order changes
meaning.

Poor fits: a single definition or small distinction; a list that already scans
well; decorative illustration; a visual that just restates the prose.

## Picking The Visual

Match the relationship to the form, then build it from the archetype table in
[DESIGN.md](DESIGN.md):

- order / lifecycle / handoff → flow rail, sequence, or timeline
- ownership / dependency / hot path → boxes-and-arrows map or swimlanes
- status / allowed moves → state graph with decision diamonds
- before/after or two similar things → diff or comparison table
- quantities over time or category → bar or line chart
- a parameter the reader should feel → one small live control

## Mermaid In Text Answers

When the user did not ask for a standalone artifact, use Mermaid for a
lightweight in-chat diagram:

- `flowchart TD` for pipelines, ownership, dependencies
- `sequenceDiagram` for calls, messages, actor interactions
- `stateDiagram-v2` for lifecycle states and transitions

Keep it small: short labels explained in prose. Past ~8 nodes, simplify or offer
an HTML explainer instead.

## HTML Explainer Mode

When the user asks for an HTML explainer, visual explainer page, or local
explainer artifact, build it per [html-explainer-design.md](html-explainer-design.md)
and [DESIGN.md](DESIGN.md): pick the archetype, start from the asset, keep
the style/script kit, compose only the needed modules, and render-check before
delivering.

## Image Explainer Mode

When the user asks for an image explainer, infographic, labeled diagram, or
concept-map image, generate it directly. Use a prompt with this structure:

```text
Create a clean labeled explainer diagram about: <topic>.

Audience: a technical reader who wants fast comprehension, not a lesson.
Purpose: make <specific relationship, flow, lifecycle, or distinction> clear.

Composition:
- <diagram type: left-to-right flow, layered architecture, lifecycle loop,
  comparison, state machine, timeline, or concept map>
- <main nodes or stages, with short exact labels>
- <arrows or grouping that show how the parts relate>
- <one small "key idea" callout>

Style: modern editorial technical diagram, high contrast, clean spacing,
readable labels, no decorative clutter, no tiny text, no photorealism.

Text: keep labels short, no paragraphs inside the image, do not invent product
names, numbers, or source claims.
```

Pick the diagram type from the material: flow (request/pipeline/event), layered
architecture (UI/model/service/storage), lifecycle loop, comparison, state
machine, or concept map. For repo-specific material, inspect the source before
writing labels; when labels depend on uncertain inference, use generic role
labels rather than inventing exact names.

## Visual Checks

Before delivering any visual or image prompt, confirm: it answers the question,
not a broader lesson; labels are short and readable; relationships are visible
through arrows, grouping, or placement; every claim is grounded in the prompt,
inspected source, or user-provided context; and it reveals no secrets or private
source text.
