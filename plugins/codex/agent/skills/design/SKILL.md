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

## Optional Iterative UI Creation Loop

Use this only when the user asks for a design loop, iterative UI flow, mockup-to-build cycle, screenshot-driven design pass, or otherwise makes clear that they want the stronger repeatable workflow. Do not make this the default for every design request.

When invoked, route a loop instead of a single child skill. The router owns the sequence; child skills own the work inside each step.

Use this loop:

1. Establish the reference wall: current product screenshots, production route captures, design docs, brand guidance, platform conventions, and any external references the user approved.
2. Route to `$design-review` first when an existing implementation or target-vs-rendered comparison exists. Capture the highest-risk layout, hierarchy, interaction, accessibility, and copy findings before generating alternatives.
3. Route to `$ideate` for exactly the visual direction needed: produce options from the reference wall, select or ask the user to select one direction, and preserve the product constraints that must survive implementation.
4. Implement only after a direction is selected or the user explicitly asks for the conservative best direction to be applied.
5. Choose the right runtime proof surface for the platform without making the user specify it. For iOS, use Build iOS Apps workflows and XcodeBuildMCP/Simulator proof; mirror through the browser when that is the best way to inspect or share the running UI. For web, use the browser against the local route. For static mockups, use image outputs plus source references. For native platforms, prefer the platform simulator or preview tool that proves the actual rendered surface.
6. Route to `$ui-polish` after the first build or rendered prototype. It should compare the implementation against the selected direction and real screenshots, fix craft issues, and gather runtime proof using the selected proof surface.
7. Route back to `$design-review` when a target and rendered implementation both exist. If the review finds material gaps, send those findings back through `$ui-polish`; repeat until the remaining issues are minor or explicitly accepted.

The first implementation should be treated as a candidate, not the finish line. Prefer one tight iteration with real rendered evidence over many speculative ideas. Keep the loop bounded: preserve the selected direction, avoid unrelated product expansion, and stop when the surface is visually coherent, usable in the target states, and backed by screenshot or simulator evidence.

Do not let generated mockups replace product truth. When screenshots or simulator captures exist, use them as the baseline for structure, density, platform chrome, copy tone, and state coverage. Generated images are useful for direction and variants; rendered app evidence is what closes the loop.

## Brief Gate

Before routing to visual exploration or implementation, make sure these are known:

- Target: product, screen, component, workflow, or surface.
- Purpose: what the surface should help the user do.
- Visual source: existing app, screenshot, mockup, Figma frame, design doc, brand guidance, or stated look.
- Interactivity: static concept, clickable prototype, or production-ready behavior.
- Constraints: platform, viewport, accessibility, active product state, and anything the user said must be preserved.

If those are already clear, play back a compact brief and route. Do not re-ask answered questions.

When the user invokes the iterative UI creation loop, also make sure the brief names the reference wall, selected direction or selection gate, target runtime surface, selected proof tool or simulator, and proof loop to run after implementation.

## Stop Conditions

Do not scaffold, edit files, or start a build just because the user asked for "design" if no visual target or selected direction exists. A confirmed brief is not a visual target.

Do not use a single mega-output when a child skill should own the next move. Keep the response short: name the route, explain why, then load and follow the focused skill.

Do not collapse the iterative UI creation loop into one giant response. Route the next step, complete it, inspect the resulting artifact, then decide whether to continue the loop or stop for user selection.

## Output

When routing is the only job, respond with:

```text
Route: $child-skill
Brief: <one or two sentences>
Why: <short reason this is the next useful design move>
```

When routing an iterative UI creation loop, respond with:

```text
Route: $child-skill or loop step
Brief: <one or two sentences naming the surface, reference wall, and selected direction or selection gate>
Loop: <current step -> next proof step>
Why: <short reason this step raises first-result quality>
```
