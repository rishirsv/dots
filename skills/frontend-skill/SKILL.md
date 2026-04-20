---
name: frontend-skill
description: Use when the task needs a visually strong landing page, website, app, prototype, demo, or game UI with clear art direction, hierarchy, restraint, and interface copy.
---

# Frontend Skill

Use this skill when the quality of the work depends on art direction, hierarchy, restraint, imagery, and motion rather than component count.

Goal: ship interfaces that feel deliberate, premium, and current. Default toward award-level composition: one big idea, strong imagery, sparse copy, rigorous spacing, and a small number of memorable motions.

## Priority Order

Before following any other workflow in this skill:

- check for `docs/DESIGN.md` in the project root
- if it exists, read it first and treat it as the highest-priority repo design context
- use the existing design conventions, tokens, component patterns, layout conventions, and interaction patterns captured there unless the user explicitly asks to depart from them

When guidance overlaps, resolve it in this order:

1. repository-specific design context
2. the general frontend guidance in this skill
3. the interface-writing guidance when the task includes meaningful product copy

## Working Model

Before building, write three things:

- visual thesis: one sentence describing mood, material, and energy
- content plan: hero, support, detail, final CTA
- interaction thesis: 2-3 motion ideas that change the feel of the page

Each section gets one job, one dominant visual idea, and one primary takeaway or action.

If the task includes meaningful interface copy, also define:

- voice lens: the existing product voice or the 3-4 traits you will write against
- copy hotspots: the strings that carry the experience, usually headline, CTA, empty state, error, onboarding, and settings text

## Interface Writing

Apply this section when the frontend task also includes copy inside the product surface: headlines, labels, buttons, empty states, onboarding text, errors, alerts, settings descriptions, helper text, or accessibility labels.

- Treat interface writing as part of the design work, not filler added at the end.
- First, search for voice guidance in `AGENTS.md`, `CLAUDE.md`, `docs/DESIGN.md`, the design system, or existing product copy.
- If the task needs copy review, rewriting, or new UI text, read `references/interface-writing.md` before finalizing the screen.
- Keep the scope to end-user product copy inside the interface. Do not let this skill drift into brand campaigns, blog writing, app store marketing, or general documentation unless the user explicitly asks.
- For design-heavy tasks, keep the output visual-first and use the writing reference to sharpen the text, not to turn the response into a copy exercise.

## Beautiful Defaults

- Start with composition, not components.
- Prefer a full-bleed hero or full-canvas visual anchor.
- Make the brand or product name the loudest text.
- Keep copy short enough to scan in seconds.
- Use whitespace, alignment, scale, cropping, and contrast before adding chrome.
- Limit the system: two typefaces max, one accent color by default.
- Default to cardless layouts. Use sections, columns, dividers, lists, and media blocks instead.
- Treat the first viewport as a poster, not a document.
- Break layout repetition early. Do not let section after section collapse into the same text-and-image split.
- Pick a visual system and enforce it consistently across radius, stroke weight, shadows, and spacing.
- Default away from `Inter` when the brief calls for a distinctive visual identity.

## Layout Rhythm

- Avoid repeating the same section architecture more than once in a row.
- If one section uses a split layout, the next should shift the rhythm through stacking, overlap, pinning, asymmetry, or a single dominant media plane.
- Prefer compositional variety that still feels like one system, not a grab bag of unrelated tricks.
- When a page needs multiple showcase moments, give each section a different dominant device: poster hero, editorial stack, asymmetrical feature rail, pinned story band, or restrained grid.
- Do not use "text left, image right" as the default answer.

## Design System Discipline

- Establish the core tokens up front: type pairing, radius family, border behavior, shadow language, and accent strategy.
- Keep those choices consistent across the whole surface. Do not mix soft glass cards, brutal borders, and editorial minimalism in the same concept unless the brief clearly demands it.
- For custom decorative SVGs or shapes, keep them geometric and support the layout. Do not invent literal illustrations unless the brief calls for illustration.

## Landing Pages

Default sequence:

1. Hero: brand or product, promise, CTA, and one dominant visual
2. Support: one concrete feature, offer, or proof point
3. Detail: atmosphere, workflow, product depth, or story
4. Final CTA: convert, start, visit, or contact

Hero rules:

- One composition only.
- Full-bleed image or dominant visual plane.
- Canonical full-bleed rule: on branded landing pages, the hero itself must run edge-to-edge with no inherited page gutters, framed container, or shared max-width; constrain only the inner text/action column.
- Brand first, headline second, body third, CTA fourth.
- No hero cards, stat strips, logo clouds, pill soup, or floating dashboards by default.
- Keep headlines to roughly 2-3 lines on desktop and readable in one glance on mobile.
- Give the H1 enough width to breathe so it does not collapse into a tall text wall.
- Keep the text column narrow and anchored to a calm area of the image.
- All text over imagery must maintain strong contrast and clear tap targets.

If the first viewport still works after removing the image, the image is too weak. If the brand disappears after hiding the nav, the hierarchy is too weak.

Viewport budget:

- If the first screen includes a sticky or fixed header, that header counts against the hero.
- The combined header and hero content must fit within the initial viewport at common desktop and mobile sizes.
- When using `100vh` or `100svh` heroes, subtract persistent UI chrome or overlay the header instead of stacking it in normal flow.

## Apps

Default to Linear-style restraint:

- calm surface hierarchy
- strong typography and spacing
- few colors
- dense but readable information
- minimal chrome
- cards only when the card is the interaction

For app UI, organize around:

- primary workspace
- navigation
- secondary context or inspector
- one clear accent for action or state

Avoid:

- dashboard-card mosaics
- thick borders on every region
- decorative gradients behind routine product UI
- multiple competing accent colors
- ornamental icons that do not improve scanning

If a panel can become plain layout without losing meaning, remove the card treatment.

## Imagery

Imagery must do narrative work.

- Use at least one strong, real-looking image for brands, venues, editorial pages, and lifestyle products.
- Prefer in-situ photography over abstract gradients or fake 3D objects.
- Choose or crop images with a stable tonal area for text.
- Do not use images with embedded signage, logos, or typographic clutter fighting the UI.
- Do not generate images with built-in UI frames, splits, cards, or panels.
- If multiple moments are needed, use multiple images, not one collage.
- Treat images before placing them. Crop for calm text zones and use tonal adjustments when needed so the page feels art-directed rather than stock.

The first viewport needs a real visual anchor. Decorative texture is not enough.

## Copy

- Write in product language, not design commentary.
- Let the headline carry the meaning.
- Supporting copy should usually be one short sentence.
- Cut repetition between sections.
- Do not include prompt language or design commentary into the UI.
- Give every section one responsibility: explain, prove, deepen, or convert.
- When the task is copy-sensitive, use `references/interface-writing.md` to review voice, buttons, errors, empty states, onboarding, and settings text before shipping.

If deleting 30 percent of the copy improves the page, keep deleting.

## Utility Copy For Product UI

When the work is a dashboard, app surface, admin tool, or operational workspace, default to utility copy over marketing copy.

- Prioritize orientation, status, and action over promise, mood, or brand voice.
- Start with the working surface itself: KPIs, charts, filters, tables, status, or task context. Do not introduce a hero section unless the user explicitly asks for one.
- Section headings should say what the area is or what the user can do there.
- Good: "Selected KPIs", "Plan status", "Search metrics", "Top segments", "Last sync".
- Avoid aspirational hero lines, metaphors, campaign-style language, and executive-summary banners on product surfaces unless specifically requested.
- Supporting text should explain scope, behavior, freshness, or decision value in one sentence.
- If a sentence could appear in a homepage hero or ad, rewrite it until it sounds like product UI.
- If a section does not help someone operate, monitor, or decide, remove it.
- Litmus check: if an operator scans only headings, labels, and numbers, can they understand the page immediately?

## Motion

Use motion to create presence and hierarchy, not noise.

Ship at least 2-3 intentional motions for visually led work:

- one entrance sequence in the hero
- one scroll-linked, sticky, or depth effect
- one hover, reveal, or layout transition that sharpens affordance

Prefer Framer Motion when available for:

- section reveals
- shared layout transitions
- scroll-linked opacity, translate, or scale shifts
- sticky storytelling
- carousels that advance narrative, not just fill space
- menus, drawers, and modal presence effects

Motion rules:

- noticeable in a quick recording
- smooth on mobile
- fast and restrained
- consistent across the page
- removed if ornamental only

## Spacing And Overflow

- Use generous vertical spacing so major sections read like distinct chapters rather than stacked widgets.
- Check horizontal overflow whenever the concept uses off-axis media, absolute positioning, rotation, or marquee motion.
- Treat overflow bugs as a design failure, not a QA footnote.

## Hard Rules

- No cards by default.
- No hero cards by default.
- No boxed or center-column hero when the brief calls for full bleed.
- No more than one dominant idea per section.
- No section should need many tiny UI devices to explain itself.
- No headline should overpower the brand on branded pages.
- No filler copy.
- No split-screen hero unless text sits on a calm, unified side.
- No more than two typefaces without a clear reason.
- No more than one accent color unless the product already has a strong system.
- No six-line hero headlines.
- No arbitrary badge spam around the headline.
- No accidental horizontal scroll.

## Reject These Failures

- Generic SaaS card grid as the first impression
- Beautiful image with weak brand presence
- Strong headline with no clear action
- Busy imagery behind text
- Sections that repeat the same mood statement
- Carousel with no narrative purpose
- App UI made of stacked cards instead of layout
- Platform-specific visual tropes applied where they do not serve the product
- Repeating the same section composition down the whole page
- Inconsistent radius, shadow, or stroke language
- Headline wrapped into a tall text block because the container is too narrow

## Litmus Checks

- Is the brand or product unmistakable in the first screen?
- Is there one strong visual anchor?
- Can the page be understood by scanning headlines only?
- Do the headline, primary action, and support text tell the person what to do next?
- Does the hero headline stay within 2-3 lines at common desktop widths?
- Does each section have one job?
- Are cards actually necessary?
- Does motion improve hierarchy or atmosphere?
- Would the design still feel premium if all decorative shadows were removed?
- Does the layout rhythm change enough from section to section to avoid a template feel?
- Are radius, borders, shadows, and accents behaving like one deliberate system?
