---
name: design
description: "Use when routing broad product design, UI critique, visual direction, interface polish, or target-vs-rendered design review requests to the right focused design workflow; not for ordinary implementation, code review, docs authoring, or generic non-visual brainstorming."
---

# Design

Route product and UI design requests to the focused skill that can produce the next useful artifact without overbuilding.

This skill is an index. It owns routing, brief quality, and stop conditions. It does not do the child workflow itself.

## Routing

Start by identifying the user's actual design job:

- Existing screen, component, flow, screenshot, rendered UI, or target-vs-implementation surface needs critique or QA -> `$design-review`.
- User wants visual options, remixes, conservative-to-bold alternatives, or image-generated directions -> `$ideate`.
- Existing UI needs focused craft edits, interaction polish, responsive polish, motion, accessibility, or microcopy improvements -> `$ui-polish`.
- Durable design-system documentation is the requested artifact -> `$docs-writer`.
- Requirements are unclear before routing -> `$clarify`, then return here.

If the request mixes lanes, sequence them in the order that preserves design choice:

1. Clarify the brief when the product surface, visual source, or interactivity level is missing.
2. Review or generate directions before editing code.
3. Wait for the user to select or approve a direction before implementation.
4. Polish the selected/built surface.
5. Run `$design-review` before handoff when a target and rendered implementation both exist.

## Brief Gate

Before routing to visual exploration or implementation, make sure these are known:

- Target: product, screen, component, workflow, or surface.
- Purpose: what the surface should help the user do.
- Visual source: existing app, screenshot, mockup, Figma frame, design doc, brand guidance, or stated look.
- Interactivity: static concept, clickable prototype, or production-ready behavior.
- Constraints: platform, viewport, accessibility, active product state, and anything the user said must be preserved.

If those are already clear, play back a compact brief and route. Do not re-ask answered questions.

## Stop Conditions

Do not scaffold, edit files, or start a build just because the user asked for "design" if no visual target or selected direction exists. A confirmed brief is not a visual target.

Do not use a single mega-output when a child skill should own the next move. Keep the response short: name the route, explain why, then load and follow the focused skill.

## Output

When routing is the only job, respond with:

```text
Route: $child-skill
Brief: <one or two sentences>
Why: <short reason this is the next useful design move>
```
