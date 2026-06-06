---
name: ideate
description: "Use when generating independent visual product design options, remixes, or UI directions after a sufficient design brief exists; not for implementation, open-ended brainstorming, critique of an existing surface, or polishing a selected direction."
---

# Ideate

Generate image-based visual product design options from a confirmed brief, then stop for selection before build work starts.

This is the visual-option child of `$design`. Use it when the next useful move is exploration: distinct UI concepts, remixes, conservative-to-bold alternatives, image-generated directions, or visual treatments for a product surface. Do not use it for code edits, implementation plans, design QA, or critique-only reviews.

## Brief Gate

Start only when the brief is sufficient. Confirm or play back:

- Target: product, screen, component, flow, or surface.
- Purpose: what the user should accomplish or feel confident doing.
- Visual source: existing app, screenshot, mockup, Figma frame, design doc, brand guidance, image reference, or stated look.
- Interactivity: static concept, clickable prototype, or production-ready behavior expected later.
- Constraints: platform, viewport, accessibility, content, active product state, brand posture, and anything the user said must be preserved.

If any of these are missing, ask the smallest clarifying question or route back to `$design` / `$clarify`. A confirmed brief is the starting line for ideation, not permission to build.

## Reference Inspection

Inspect the visual evidence before generating options. Prefer, in order:

1. User-provided screenshots, images, mockups, Figma exports, videos, or design docs.
2. Existing app surfaces, routes, previews, Storybook stories, simulators, or screenshots you can render.
3. Local brand docs, design-system docs, component libraries, tokens, and platform conventions.
4. Written style constraints when visual references are unavailable.

Look at screenshots, mockups, app captures, or other image references directly before generating. Do not infer visual details from filenames alone.

When an image, screenshot, or visual file is available, attach the actual image or readable local path to the image-generation call. Only claim a visual reference was attached when the tool actually received it. If a named reference cannot be opened, stop and ask whether to troubleshoot the reference or continue without it.

Name the reference basis in the output. If you cannot inspect or attach a reference directly, say so and treat that as a proof limit.

## Dimensions

Choose dimensions that match the target surface and include them in every image-generation prompt:

- Mobile app: `390 x 844`.
- Tablet app: `834 x 1194`.
- Desktop app, dashboard, admin, or SaaS: `1440 x 1024`.
- Landing or marketing page: `1440` wide and scrollable.
- Modal, panel, widget, or component: natural container size.
- Provided screenshot, mockup, or reference image: match its aspect ratio when the user wants to continue from that visual.

Avoid crowding. Make every option fit the chosen dimensions cleanly with realistic spacing, readable type, and no clipped content.

## Generate Options

Generate exactly three independent images by default unless the user asks for a different count. Each option should be its own image-generation result, not three ideas placed inside one image.

Each option should be a real direction with its own layout, hierarchy, interaction emphasis, and visual language. Do not present one idea with small styling tweaks.

Unless the user requested a different spread, use:

- `1. Grounded`: closest to the existing product, source reference, or platform convention.
- `2. Refined`: stronger hierarchy, rhythm, content structure, and product fit while preserving the core concept.
- `3. Distinct`: a bolder but still usable composition, interaction model, or visual language.

Preserve constraints across every option. Required content, active state, accessibility needs, platform expectations, brand limits, and "do not change" instructions carry into all three directions.

Use image generation for visual concepts, mockups, image-based variants, and design directions. Use prose only when the user explicitly asks for written directions, the target is not visual, or image generation is unavailable. If image generation is unavailable, say so before falling back to prose.

Use this prompt frame for each option, adapting it to the brief and references:

```text
Create a realistic, production-quality UI design for <target surface> at <dimensions>.

Brief: <what the surface should help the user do>.
Reference basis: <visual references inspected and attached>.
Direction: <Grounded | Refined | Distinct> - <specific product/design argument>.
Constraints to preserve: <required content, active state, platform, accessibility, brand, and do-not-change items>.

Use clear hierarchy, strong product typography, purposeful spacing, realistic content, and simple interaction affordances. Avoid busy interfaces, fake features, clipped text, browser/device chrome, nested cards, and ornamental decoration that does not improve comprehension.
```

## Option Quality

Each option should make a product argument, not just describe style:

- what changes in hierarchy, layout, interaction, or visual language
- why the direction fits the user's goal and constraints
- what tradeoff the user accepts by choosing it
- what implementation or product risk it introduces

Keep options comparable. Do not bury the recommended option in extra detail or let one option become the implementation spec.

## Feedback Loop

If the user gives feedback after seeing options, generate revised options that apply that feedback.

If the user selects an option and asks for changes, generate a revised selected option before build work starts.

If the user likes parts of multiple options, combine those choices into one new visual option and show it before build work starts.

## Stop Conditions

Stop after presenting the options and ask the user to choose, combine, or reject directions. Do not scaffold, patch files, build UI, start a prototype, or run design QA in the same pass unless the user has already selected a direction and explicitly asked for that next lane.

After selection:

- Route focused implementation or craft edits to `$ui-polish`.
- Route target-vs-rendered comparison to `$design-review`.
- Route critique of an existing surface to `$design-review`.

## Output

Use this shape:

```text
Brief: <one or two sentences>
Reference Basis: <what was inspected and attached, or proof limit>
Dimensions: <chosen dimensions>

Options
1. Grounded - <direction name>
   Image: <generated image or shown above>
   What changes:
   Why it fits:
   Tradeoff:
   Risk:

2. Refined - <direction name>
   Image: <generated image or shown above>
   What changes:
   Why it fits:
   Tradeoff:
   Risk:

3. Distinct - <direction name>
   Image: <generated image or shown above>
   What changes:
   Why it fits:
   Tradeoff:
   Risk:

Recommendation: <one option or blend, with a short reason>
Next: choose an option, combine pieces, or ask for another three before build work starts.
```
