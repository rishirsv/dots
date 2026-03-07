---
name: designer-frontend
description: "Create or redesign distinctive, production-grade frontend interfaces with high design quality. Use when Codex needs to build web components, pages, flows, posters, or applications, implement a strong visual direction that avoids generic AI aesthetics, or add purposeful motion and micro-interactions during interface creation. This skill owns interface creation and redesign, not formal audit reporting or exhaustive final ship-readiness QA."
---

# Designer Frontend


Create distinctive, production-grade frontend interfaces that avoid generic AI aesthetics. Implement real working code with strong aesthetic direction and careful attention to detail.

## Priority Rule

Before following any other workflow in this skill:
- check for `docs/DESIGN.md` in the project root
- if it exists, read it first and treat it as the highest-priority repo design context
- use the existing design conventions, tokens, component patterns, layout conventions, and interaction patterns captured there unless the user explicitly asks to depart from them

If `docs/DESIGN.md` does not exist, do not create or refresh it silently. Use `design-init` only when the user explicitly asks for design-context setup or refresh.

## Hard Constraints

Read [anti-defaults](references/anti-defaults.md) before choosing a layout, type system, visual language, or dashboard structure.

Treat that reference as binding guidance for this skill:
- ban default AI UI moves instead of refining them
- prefer the harder, cleaner option when a choice feels templated
- use the "normal" defaults there for structural UI decisions unless the product context justifies something more opinionated
- never add decorative patterns from habit; every visual decision must earn its place in the product

## Use This Skill For

- Creating a new frontend surface from scratch
- Redesigning an existing page, flow, or component
- Turning a vague product direction into a concrete UI approach
- Designing purposeful motion, transitions, and micro-interactions as part of the interface
- Shipping implementation code for the designed interface

## Do Not Use This Skill For

- Formal critique, scoring, or prioritized findings reports
- Final ship-readiness sweeps focused on edge cases, performance, and hardening

Use `designer-audit` for diagnosis and `designer-polish` for the finishing pass.

## Design Direction

Commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. When working in an existing repo, default to evolving the established design language rather than replacing it. Bold maximalism and refined minimalism both work. The key is intentionality.

Then implement working code that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

### Typography
Read [typography](references/typography.md) for scales, pairing, and loading strategies.

Choose fonts that are beautiful, unique, and interesting. Pair a distinctive display font with a refined body font.

**DO**: Use a modular type scale with fluid sizing (`clamp`)
**DO**: Vary font weights and sizes to create clear visual hierarchy
**DON'T**: Use overused fonts such as Inter, Roboto, Arial, Open Sans, or system defaults
**DON'T**: Use monospace typography as lazy shorthand for "technical/developer" vibes
**DON'T**: Put large icons with rounded corners above every heading. They rarely add value and make sites look templated.

### Color & Theme
Read [color and contrast](references/color-and-contrast.md) for OKLCH, palettes, and dark mode guidance.

Commit to a cohesive palette. Dominant colors with sharp accents outperform timid, evenly distributed palettes.

**DO**: Use modern CSS color functions (`oklch`, `color-mix`, `light-dark`) for perceptually uniform, maintainable palettes
**DO**: Tint neutrals toward the brand hue so the palette feels cohesive
**DON'T**: Use gray text on colored backgrounds
**DON'T**: Use pure black (`#000`) or pure white (`#fff`) without tinting
**DON'T**: Use the AI color palette: cyan-on-dark, purple-to-blue gradients, neon accents on dark backgrounds
**DON'T**: Use gradient text as fake impact
**DON'T**: Default to dark mode with glowing accents to avoid making actual design decisions

### Layout & Space
Read [spatial design](references/spatial-design.md) for grids, rhythm, and container queries.

Create visual rhythm through varied spacing, not the same padding everywhere. Embrace asymmetry and unexpected compositions. Break the grid intentionally for emphasis.

**DO**: Create visual rhythm through tight groupings and generous separations
**DO**: Use fluid spacing with `clamp()`
**DO**: Use asymmetry and unexpected compositions intentionally
**DON'T**: Wrap everything in cards
**DON'T**: Nest cards inside cards
**DON'T**: Use identical card grids repeated endlessly
**DON'T**: Use the hero metric layout template
**DON'T**: Center everything
**DON'T**: Use the same spacing everywhere

### Visual Details
**DO**: Use intentional decorative elements that reinforce brand
**DON'T**: Use glassmorphism everywhere
**DON'T**: Use rounded elements with one thick colored border side as a lazy accent
**DON'T**: Use sparklines as decoration
**DON'T**: Use generic rounded rectangles with generic drop shadows
**DON'T**: Use modals unless there is truly no better alternative

### Motion
Read [motion design](references/motion-design.md) for timing, easing, and reduced motion.

Focus on high-impact moments. One orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

Before adding motion, infer as much context as you can from the thread and codebase:
- target audience
- product tone
- performance budget
- whether the feature wants calm clarity or high energy

If motion direction is not reasonably inferable, prefer restrained motion rather than decorative guesswork.

**DO**: Use motion to convey state changes
**DO**: Use exponential easing (`ease-out-quart`, `ease-out-quint`, `ease-out-expo`) for natural deceleration
**DO**: For height animations, prefer grid-template-rows transitions over animating height directly
**DO**: Pick one hero motion moment, then support it with smaller feedback and transition layers
**DO**: Respect `prefers-reduced-motion` and provide non-animated or simplified alternatives
**DON'T**: Animate width, height, padding, or margin
**DON'T**: Use bounce or elastic easing
**DON'T**: Add motion without a reason
**DON'T**: Scatter animations everywhere until the interface feels exhausting

### Interaction
Read [interaction design](references/interaction-design.md) for forms, focus, and loading patterns.

Make interactions feel fast. Use optimistic UI when the product context supports it.

**DO**: Use progressive disclosure
**DO**: Design empty states that teach the interface
**DO**: Make every interactive surface feel intentional and responsive
**DON'T**: Repeat information users can already see
**DON'T**: Make every button primary

### Responsive
Read [responsive design](references/responsive-design.md) for mobile-first, fluid design, and container queries.

**DO**: Use container queries for component-level responsiveness
**DO**: Adapt the interface for different contexts instead of just shrinking it
**DON'T**: Hide critical functionality on mobile

### UX Writing
Read [UX writing](references/ux-writing.md) for labels, errors, and empty states.

**DO**: Make every word earn its place
**DON'T**: Repeat information users can already see

## The AI Slop Test

If you showed this interface to someone and said "AI made this," would they believe you immediately? If yes, that is the problem.

A distinctive interface should make someone ask "how was this made?" not "which AI made this?"

Review the DON'T guidelines above. They are the fingerprints of generic AI-generated work.
Also review [anti-defaults](references/anti-defaults.md) as the explicit ban list for common dashboard and app-shell failure modes.

## Workflow

Follow this order:

1. Establish the product purpose, audience, and constraints.
2. Read `docs/DESIGN.md` first when it exists and anchor the work to the established design conventions.
3. Choose a strong visual direction and commit to it, but stay inside the existing design language unless the user explicitly asks for a change.
4. Decide whether motion is part of the concept, and if it is, define:
   - the hero moment
   - the feedback layer
   - the transition layer
5. Use the references only where they sharpen the work.
6. Implement the interface in production-ready code.
7. Review the result against the anti-patterns list and [anti-defaults](references/anti-defaults.md) before stopping.

Match implementation complexity to the aesthetic vision. Maximalist designs can justify richer motion and more elaborate visual systems. Minimalist or refined designs require restraint, spacing precision, and subtle details.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, and different aesthetics. Never converge on the same safe output.

## Boundaries

- Use this skill to create, redesign, and implement the interface.
- Use `designer-audit` when the user wants a formal review, critique, scorecard, or prioritized issue report.
- Use `designer-polish` when the interface is already mostly complete and needs final quality, resilience, or performance work before shipping.
