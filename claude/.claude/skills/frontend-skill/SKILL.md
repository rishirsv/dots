---
name: frontend-skill
description: Use when the task asks for a visually strong landing page, website, app, prototype, demo, or game UI. This skill enforces restrained composition, image-led hierarchy, cohesive content structure, tasteful motion, and conditional iOS/Expo-native guidance when the work actually targets iOS.
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
3. the iOS/Expo addendum, but only for iOS-native or Expo app work

## Working Model

Before building, write three things:

- visual thesis: one sentence describing mood, material, and energy
- content plan: hero, support, detail, final CTA
- interaction thesis: 2-3 motion ideas that change the feel of the page

Each section gets one job, one dominant visual idea, and one primary takeaway or action.

## Beautiful Defaults

- Start with composition, not components.
- Prefer a full-bleed hero or full-canvas visual anchor.
- Make the brand or product name the loudest text.
- Keep copy short enough to scan in seconds.
- Use whitespace, alignment, scale, cropping, and contrast before adding chrome.
- Limit the system: two typefaces max, one accent color by default.
- Default to cardless layouts. Use sections, columns, dividers, lists, and media blocks instead.
- Treat the first viewport as a poster, not a document.

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

The first viewport needs a real visual anchor. Decorative texture is not enough.

## Copy

- Write in product language, not design commentary.
- Let the headline carry the meaning.
- Supporting copy should usually be one short sentence.
- Cut repetition between sections.
- Do not include prompt language or design commentary into the UI.
- Give every section one responsibility: explain, prove, deepen, or convert.

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

## iOS And Expo Addendum

Apply this section only when the work is one of these:

- a native iOS interface
- an Expo or React Native app
- a cross-platform app explicitly trying to feel iOS-native

Do not apply these rules to regular web work, desktop web apps, or non-Expo stacks unless the user explicitly asks for iOS conventions.

Use the iOS reference material in `references/ios/` only when it is relevant to the task:

- `animations.md`
- `controls.md`
- `form-sheet.md`
- `gradients.md`
- `icons.md`
- `media.md`
- `route-structure.md`
- `search.md`
- `storage.md`
- `tabs.md`
- `toolbar-and-headers.md`
- `visual-effects.md`
- `webgpu-three.md`
- `zoom-transitions.md`

For iOS and Expo work:

- keep the repo's design language, but express it through native-feeling spacing, typography, materials, and motion
- start with Expo Go before recommending custom native builds
- use Expo Router conventions and keep routes inside `app`
- remove old route files when navigation is restructured
- prefer path aliases over brittle relative imports during refactors
- prefer current Expo packages and APIs over removed or legacy React Native or Expo modules
- prefer `process.env.EXPO_OS` over `Platform.OS`
- prefer `useWindowDimensions` over `Dimensions.get()`
- do not use intrinsic web elements like `img` or `div` in native surfaces
- treat safe-area handling as mandatory
- default route content to a `ScrollView`, `FlatList`, or `SectionList` with `contentInsetAdjustmentBehavior="automatic"` when appropriate
- prefer inline styles for local React Native styling, and use `boxShadow` instead of legacy shadow or elevation props
- use continuous corner curves for rounded surfaces unless a capsule is intended
- use stack titles instead of hand-rolled page headers
- use utility copy and selectable text where it improves real product use
- add haptics, context menus, previews, and native search only when they meaningfully improve the flow
- prefer system-feeling controls, materials, tabs, and headers over custom chrome when the app wants an Apple-native feel

When Expo UI or SwiftUI-style primitives are part of the task:

- verify the current Expo UI API before coding against it
- wrap SwiftUI trees in `Host`
- only recommend local native extensions when the required component or modifier is genuinely missing, and call that out explicitly

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

## Reject These Failures

- Generic SaaS card grid as the first impression
- Beautiful image with weak brand presence
- Strong headline with no clear action
- Busy imagery behind text
- Sections that repeat the same mood statement
- Carousel with no narrative purpose
- App UI made of stacked cards instead of layout
- iOS-native rules applied blindly to non-iOS work
- Web conventions copied into native Expo screens without adaptation

## Litmus Checks

- Is the brand or product unmistakable in the first screen?
- Is there one strong visual anchor?
- Can the page be understood by scanning headlines only?
- Does each section have one job?
- Are cards actually necessary?
- Does motion improve hierarchy or atmosphere?
- Would the design still feel premium if all decorative shadows were removed?
- If this is iOS or Expo work, do the platform-specific choices improve the product instead of merely signaling "Apple"?
