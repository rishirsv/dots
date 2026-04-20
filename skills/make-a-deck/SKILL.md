---
name: make-a-deck
description: Create speaker-ready presentation decks as standalone HTML slide artifacts. Use when the task is a pitch deck, board deck, keynote, strategy presentation, client presentation, or any slide-based story where narrative flow, projection-scale typography, and slide composition matter more than normal webpage design.
---

# Make a Deck

Create a presentation deck, not a website.

Optimize for narrative clarity, projection readability, and strong slide-to-slide rhythm.

## Start Here

- Ask for presentation length in minutes when the user does not specify a duration or slide count.
- Write the full title sequence before building slides.
- Pick one title grammar for the whole deck and keep it parallel.
- Decide early which moments should become tables, diagrams, quotes, numbers, or images so the deck does not collapse into dense text slides.

## Build Contract

- Start by calling `copy_starter_component` with `kind: "deck_stage.js"`.
- Build the deck as `<deck-stage width="1920" height="1080">` with one `<section data-label="...">` per slide unless the user explicitly asks for a different size.
- Do not hand-roll stage scaling, keyboard navigation, tap zones, slide counts, or print behavior.
- Do not set position, inset, width, or height on the slide `<section>` elements themselves.
- Load the starter with a plain `<script src="deck-stage.js"></script>`.

## Slide System

Define shared slide constants before writing any slides:

- `TYPE_SCALE = { title: 64, subtitle: 44, body: 34, small: 28 }`
- `SPACING = { paddingTop: 100, paddingBottom: 80, paddingX: 100, titleGap: 52, itemGap: 28 }`

Rules:

- Reference those constants everywhere instead of ad-hoc pixel values.
- Treat requested font sizes as points and convert to pixels with `px = pt * 1.333`.
- Keep titles large enough for the back of the room. Treat web-style sizing as too small by default.

## Writing And Composition

- Treat every slide as both layout work and copywriting work.
- Use titles that orient the audience like chapter headings.
- Avoid punchline titles, dramatic reframes, faux-insight phrasing, and other obvious Claude-style reveal language.
- Keep repeated structures aligned across slides.
- Prefer generous whitespace and bottom breathing room over filling every inch.
- Avoid overstuffed slides. If content feels crowded, change the slide type instead of shrinking the type.

## Imagery And Visual Variety

- Use a mix of full-image, data, quote, table, and text-led slides.
- Aspect-fill hero imagery when appropriate, but aspect-fit screenshots and diagrams.
- Put transparent or aspect-fit assets on deliberate contrast backgrounds.
- Protect over-image text with cards, gradients, or blur only when that matches the surrounding visual language.
- Use provided brand assets, icons, and images before inventing decorative elements.
- Avoid emoji and self-drawn illustration unless the user explicitly wants them.

## Review Pass

- Check title parallelism by reading only the titles in sequence.
- Check that sizes and spacing match the shared constants rather than web defaults.
- Keep open space in the lower part of the slide when the composition wants it; do not "fix" slide composition with web-centering instincts.
- Remove accent-border takeaway cards or decorative boxes unless the brief clearly needs them.

## Detailed Guidance

Read [references/deck-guidance.md](references/deck-guidance.md) when you need the extracted detailed playbook for title patterns, stage behavior, image treatment, and verification heuristics.
