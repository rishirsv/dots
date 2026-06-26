# Grounding

Read this before starting a new surface, vague feature, redesign, or substantial
visual change.

## Source Anchors

Start with repo and product anchors when they exist. When the repo carries
design conventions, they are authority for *how* this surface should look — load
them before reaching for generic taste. Look in this order and treat what you
find as the repo design contract:

1. An `AGENTS.md` `## Design`/`## UI` section, or a `DESIGN.md` — explicit,
   checked-in design rules.
2. Design tokens, a theme, or a component library — the concrete style system.
3. Nearby shipped UI for this product — the de facto style reference. Read it as
   an exemplar: repeat the decisions worth repeating, avoid the mistakes.
4. `PRODUCT.md`, product briefs, tickets, plans, and existing user flows.
5. Screenshots, URLs, image references, and prior accepted designs.

Resolve conflicts by this authority order: (1) the user's explicit goal for this
task, (2) the repo's design system — tokens and components, (3) repo design
rules in `AGENTS.md`/`DESIGN.md`, (4) the accepted concept for this surface,
(5) this skill's generic visual principles, (6) general heuristics. Treat shipped
code as evidence, not law — if an existing pattern is clearly wrong for the task,
name the conflict and ask before propagating it.

When the repo has none of these, say so and design from the brief; the surface's
own world drives the distinctive choices.

These anchors reduce repeated questions, but they do not replace task-specific
shape. Shape is the brief for this exact surface.

## Discovery Round

Discovery includes at least one user-answer round unless `PRODUCT.md`, repo
design guidance, or an already-confirmed brief directly answers the needed
inputs.
With a sparse prompt, do not synthesize a complete brief for confirmation on the
first response.

Use the harness's structured question tool when one exists. In Plan mode, prefer
`request_user_input` for the user-answer round. Otherwise ask directly in chat
and stop.

Ask 2-3 questions per round, then wait for answers. One round is the default.
Add a second only when the first answers leave material gaps. Do not run a
second round just to feel thorough.

Use assert-then-confirm when the repo and prompt make one option obvious:

```text
This reads as a production-ready single-screen dashboard for operations leads
reviewing live exceptions. Confirm, or tell me what to change.
```

Do not enumerate broad menu choices when the likely answer is already clear.

For a sparse build request, adapt these three questions to the surface and ask
only the unknowns:

1. What should the thing do?
2. What existing product, design system, screenshot, URL, image, or visual
   source should it match? If none, what look is the user going for?
3. What level of interactivity should it have: full working controls and states,
   or a faster mostly-static mock?

After the answers, reply with a pithy design brief that says what you are about
to explore. Avoid walls of text.

## What To Resolve

Round 1 should clarify purpose, audience/context, content/scope, and visual
direction when brand or art direction is not already anchored.

Purpose and context:

- what the feature is for and what problem it solves
- who specifically uses it: role, context, frequency, and state of mind
- what success looks like

Content and data:

- what content or data the feature displays or collects
- realistic ranges: minimum, typical, maximum
- dynamic content, update frequency, empty states, error states, first-time
  states, and power-user states
- required visual assets: images, product shots, illustrations, maps, textures,
  diagrams, generated objects, or existing project assets

Design direction:

- color strategy for this surface: Restrained, Committed, Full palette, or
  Drenched
- one scene sentence that names physical context, user, ambient light, and mood
- two or three named anchor references: products, brands, objects, or places,
  not adjectives like "modern" or "clean"

Scope:

- fidelity: sketch, mid-fi, high-fi, or production-ready
- breadth: one screen, a flow, or a whole surface
- interactivity: static visual, interactive prototype, or shipped-quality
  component
- time intent: quick exploration or polish until it ships

Always resolve scope. If the user already gave it, assert it in the brief. If
not, ask. Scope answers are task-scoped; do not write them to `PRODUCT.md` or
repo design docs.

Constraints:

- framework, performance, browser, platform, or repo constraints
- localization, dynamic text length, user-generated content, mobile, responsive,
  and accessibility needs

Anti-goals:

- what this should not be
- what a wrong direction would look like
- the biggest risk of getting the design wrong

## Brief Gate

After the interview and required probes, present a brief and end the response.
The user must confirm before any implementation runs. Do not present a brief and
then continue to code in the same response.

Choose the brief shape based on clarity.

Use compact form for typical craft requests with a clear prompt and anchors:

- 3-5 bullets
- what is being built
- visual lane
- scope
- one or two specific questions or "confirm or override?"

Use full structured form when the task is genuinely ambiguous, multi-screen, or
when the user asked for shape as a standalone step:

1. Feature Summary: what this is, who it is for, what it needs to accomplish.
2. Primary User Action: the single most important thing the user should do or
   understand.
3. Design Direction: color strategy, scene sentence, and 2-3 named anchors.
4. Scope: fidelity, breadth, interactivity, and time intent.
5. Layout Strategy: spatial approach, hierarchy, rhythm, and information flow.
6. Key States: default, empty, loading, error, success, and edge cases.
7. Interaction Model: click, hover, scroll, feedback, and entry-to-completion
   flow.
8. Content Requirements: copy, labels, microcopy, dynamic ranges, and image or
   media roles with likely sources.
9. Recommended References: which visual-design references or project design
   docs should guide implementation.
10. Open Questions: only genuine blockers. If a default is obvious, assert the
    default instead of listing it as open.

Do not pad a clear brief into a long one. Do not skip the confirmation pause to
look efficient. The pause is the point.

After the user confirms an involved app, prototype, clone, redesign, or build,
send one short expectation-setting note before starting. Do not send this note
for tiny static changes, quick audits, simple research, setup-only, or
share-only requests.
