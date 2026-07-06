# Grounding

Read before starting a new surface, vague feature, redesign, or substantial
visual change.

## Source Anchors

Find the repo's design authority before reaching for generic taste. Check, in
order — checked-in design rules (`AGENTS.md` `## Design`/`## UI`, `DESIGN.md`,
or equivalent) → design tokens/theme/component library → nearby shipped UI
(read as exemplar, not gospel) → product briefs/tickets/plans/existing flows →
screenshots, URLs, prior accepted designs — and treat what you find as the
repo design contract. If none exist, say so and design from the brief.

Resolve conflicts in this order: user's explicit goal > repo's design system >
checked-in design rules > accepted concept for this surface > this skill's
generic principles > general heuristics. Shipped code is evidence, not law —
if a pattern is clearly wrong for the task, name the conflict and ask before
propagating it. Anchors cut repeated questions but don't replace
task-specific shape.

## Discovery Round

At least one user-answer round is required unless repo conventions or an
already-confirmed brief answer the needed inputs. With a sparse prompt, don't
synthesize a complete brief for confirmation on the first response.

Use the harness's structured question tool when one exists
(`request_user_input` in Plan mode); otherwise ask directly in chat and stop.
Ask 2-3 questions, then wait. One round is default; add a second only for
material gaps, not to feel thorough. When the repo and prompt make one option
obvious, assert-then-confirm instead of open questions (e.g. "This reads as a
production-ready single-screen dashboard for ops leads reviewing live
exceptions — confirm, or tell me what to change"); skip broad menu choices
when the answer is clear.

For a sparse build request, ask only the unknowns among: what should it do;
what existing product, design system, screenshot, URL, image, or visual
source should it match (or what look the user wants, if none); what level of
interactivity — full controls and states, or a faster mostly-static mock.
Reply with a pithy brief naming what you're about to explore; avoid walls of
text. Round 1 also clarifies audience/context, content/scope, and visual
direction when not already anchored:

- **Purpose/context** — what it's for, who uses it (role, context, frequency,
  state of mind), what success looks like.
- **Content/data** — what it shows or collects; realistic ranges
  (min/typical/max); empty/error/first-time/power-user states; required
  visual assets (images, illustrations, maps, textures, diagrams, existing
  project assets).
- **Design direction** — color strategy (Restrained, Committed, Full
  palette, or Drenched); one scene sentence (context, user, light, mood);
  two or three named anchors (products, brands, objects, places — not
  adjectives like "modern" or "clean").
- **Scope** — fidelity, breadth, interactivity, time intent. Always resolve
  scope — assert it if given, ask if not. Scope answers are task-scoped;
  don't write them into repo design docs.
- **Constraints/anti-goals** — framework, performance, browser, platform, or
  repo constraints; localization, text length, user-generated content,
  mobile, responsive, accessibility; what this should not be, what wrong
  looks like, the biggest risk of getting it wrong.

## Brief Gate

After the interview and required probes, present a brief and end the
response — the user must confirm before any implementation runs; never
present a brief and then continue to code in the same response.

No visual target, no build: for a new app, prototype, redesign, or
substantial UI build request without a URL, screenshot, Figma frame, mockup,
source image, accepted Image Gen concept, or existing code target, run this
gate before writing any code. `Full working version`, `no refs`, `go for it`,
or `make an assumption` don't waive it while a visual target is missing.

Choose the brief shape based on clarity. Compact form (3-5 bullets: what's
being built, visual lane, scope, one or two questions or "confirm or
override?") for typical craft requests with a clear prompt and anchors. Full
structured form for genuinely ambiguous or multi-screen tasks, or when the
user asked for shape as a standalone step:

1. Feature Summary — what this is, who it's for, what it must accomplish.
2. Primary User Action — the single most important thing the user should do.
3. Design Direction — color strategy, scene sentence, 2-3 named anchors.
4. Scope — fidelity, breadth, interactivity, time intent.
5. Layout Strategy — spatial approach, hierarchy, rhythm, information flow.
6. Key States — default, empty, loading, error, success, edge cases.
7. Interaction Model — click, hover, scroll, feedback, entry-to-completion.
8. Content Requirements — copy, labels, microcopy, dynamic ranges, image/media
   roles and likely sources.
9. Recommended References — this skill's references or the repo's own design
   docs that guide implementation.
10. Open Questions — only genuine blockers; assert obvious defaults instead.

Don't pad a clear brief into a long one, and don't skip the confirmation
pause to look efficient — the pause is the point. After confirmation on an
involved app, prototype, clone, redesign, or build, send one short
expectation-setting note before starting; skip it for tiny static changes,
quick audits, simple research, setup-only, or share-only requests.
