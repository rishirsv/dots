# Grounding

Read before starting a new surface, vague feature, redesign, or substantial
visual change.

Use [briefing-calibration.md](briefing-calibration.md) when the task needs a
new-surface brief or UI-generation prompt from sparse visual direction.

## Source Anchors

Find the repo's design authority before reaching for generic taste:

1. Checked-in design rules (`AGENTS.md` `## Design`/`## UI`, `DESIGN.md`, or
   equivalent).
2. Design tokens, theme, and component library.
3. Nearby shipped UI, product briefs, tickets, existing flows, screenshots,
   URLs, or prior accepted designs.

Treat these as the repo design contract. If none exist, say so and design from
the brief. Resolve conflicts by prioritizing the user's explicit goal, then the
repo design system, then checked-in rules, then accepted concepts for this
surface, then this skill's general principles.

## Discovery Round

Ask only for inputs that would materially change the design or build. Prefer one
round; add another only for real blockers. When the repo and prompt make the
answer obvious, assert the default and ask the user to confirm or correct it.

For sparse requests, resolve the missing pieces that matter: purpose and user,
content/data and states, visual direction or reference, scope and interactivity,
and constraints or anti-goals. Keep the question round short.

## Brief Gate

After discovery, present a brief and stop for confirmation before implementation
on new apps, prototypes, redesigns, or substantial UI builds.

No visual target, no build: for a new app, prototype, redesign, or
substantial UI build request without a URL, screenshot, Figma frame, mockup,
source image, accepted Image Gen concept, or existing code target, run this
gate before writing any code. `Full working version`, `no refs`, `go for it`,
or `make an assumption` don't waive it while a visual target is missing.

Use a compact brief for clear work: what is being built, visual lane, scope, and
remaining question or confirmation. Use the full form only for genuinely
ambiguous, multi-screen, or standalone planning requests:

1. Feature Summary — what this is, who it's for, what it must accomplish.
2. Primary User Action — the single most important thing the user should do.
3. Design Direction — scene sentence, tone constraints, references, and the
   specific quality each anchor contributes.
4. Scope — fidelity, breadth, interactivity, time intent.
5. Structure — layout skeleton, grid or spacing rhythm, first viewport
   architecture, section rhythm, container model, hierarchy, and information
   flow.
6. Key States — default, empty, loading, error, success, edge cases.
7. Interaction Model — click, hover, scroll, feedback, entry-to-completion.
8. Content Requirements — copy, labels, microcopy, dynamic ranges, image/media
   roles and likely sources.
9. Anti-patterns — visual tropes, component shapes, palette moves, effects, or
   layout formulas to avoid.
10. Client-Ready Checks — what makes the surface product-specific, what generic
   pattern would fail it, and what the review gate should treat as unacceptable.
11. Recommended References — this skill's references or the repo's own design
   docs that guide implementation.
12. Open Questions — only genuine blockers; assert obvious defaults instead.

Spend brief detail first on layout skeleton, spacing rhythm or grid,
typography direction, references, and negative constraints. Keep palette concise
unless brand fidelity or accessibility requires exact values. Do not let long
copy or broad vibe adjectives substitute for executable structure.
