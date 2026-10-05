---
name: ui-design
description: "Design and refine web or native app interfaces, write UI copy, stress test components, review UI changes and UX, and verify builds against accepted designs."
---

# UI Design

Make deliberate choices about palette, typography, composition, and interaction
that fit the brief. Challenge clichés and familiar templates. Take aesthetic
risks when they help express the idea or improve the experience. When refining
an established product, work within its existing identity. When creating or
redesigning a product, choose a consistent visual direction.

Establish visual hierarchy before adding decoration. Reduce the prominence of
competing elements before enlarging or emphasizing the main element. Use a
small, consistent set of type, color, spacing, radius, and depth values. Add
exceptions when an element has a distinct role or a visible problem. Preserve
the meaning and behavior of conventional controls.

Do not use eyebrows: small category, context, or identifier labels above or
beside headings. Start with the heading and place necessary metadata in the
body or footer. Keep functional navigation separate from headings.

## Choose The Work

Read only the references needed for the current decision. For a focused design
edit, read the reference for that design property. For a task with a distinct
workflow, read its workflow reference. Read a recipe only when implementing or
checking the treatment it describes.

| Outcome | Read |
|---|---|
| Build a new interface or substantially redesign one | [Ground the design](references/brief.md), then [build](references/build.md) |
| Refine a settled interface | [Build or refine](references/build.md); reuse established context |
| Explore directions or compare variants | [Ideation](references/ideation.md) |
| Review UI regressions in a diff, branch or PR | [Change audit](references/change-audit.md) |
| Stress test or harden a component | [Component stress](references/component-stress.md) |
| Judge visual quality, UX or readiness | [Design audit](references/design-audit.md) |
| Recreate an accepted image, mockup or live page | [Reference to code](references/reference-to-code.md) |
| Check or correct fidelity to an accepted design | [Design QA](references/design-qa.md) |

## Choose The Craft

| Decision | Read |
|---|---|
| Compose hierarchy, density, repeated rows or responsive layout | [Layout](references/layout.md) |
| Choose fonts, text roles or readable wrapping | [Typography](references/typography.md) |
| Choose palette, contrast or theme colors | [Color](references/color.md) |
| Define controls, forms, feedback or recovery | [Interaction](references/interaction.md) |
| Set animation timing, choreography or gesture motion | [Motion](references/motion.md) |
| Refine radii, optical alignment, depth or image edges | [Surface recipes](references/surfaces.md) |
| Choose icon weight, states, size or direction | [Icons](references/icons.md) |
| Place search, scope queries or design results | [Search](references/search.md) |
| Explore feature or destination names | [Naming](references/naming.md) |
| Write labels, errors, settings or empty-state copy | [Product copy](references/product-copy.md) |
| Choose native Apple controls, branding or window behavior | [Apple interfaces](references/platforms/apple.md) |
| Create a launcher/app icon | [App icons](references/platforms/app-icons.md) |
| Compose an immersive scene or manipulable 3D experience | [Spatial experiences](references/platforms/spatial.md) |

## Explain The Result

Lead with the visible result, design decision, or blocker. Support judgments
with specific observations. Name the element, quote the copy, or describe which
elements compete for attention. Explain how the observation affects the user's
task and what change would improve it. “Four equally prominent actions obscure
where to start; give the primary task more weight” is more useful than “improve
hierarchy.” Distinguish observed behavior from assumptions about users'
feelings. Name strengths a correction could damage, and show relevant previews
or evidence when available.
