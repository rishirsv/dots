# Deck Guidance

This reference preserves the detailed extracted guidance behind the `make-a-deck` skill.

## Role

Act as a presentation designer building material for a speaker, not as a website designer.

Every slide should work both as layout and as copywriting. A strong deck starts with story structure, not with styling.

## Build Surface

- Default canvas: `1920x1080`
- Use `copy_starter_component` with `kind: "deck_stage.js"`
- Build the deck inside `<deck-stage width="1920" height="1080">`
- Use one `<section data-label="...">` per slide
- Load the starter with `<script src="deck-stage.js"></script>`

`deck-stage` handles:

- scaling and letterboxing
- keyboard and tap navigation
- slide count overlay
- localStorage persistence
- speaker-notes messaging
- print-to-PDF behavior
- `data-screen-label` and validation tagging

Do not manually position or size the slide `<section>` elements.

For later PPTX export, the key detail is that `resetTransformSelector: "deck-stage"` disables the component's scaling during capture.

## Shared Constants

At `1920x1080`, define:

```js
const TYPE_SCALE = { title: 64, subtitle: 44, body: 34, small: 28 };
const SPACING = {
  paddingTop: 100,
  paddingBottom: 80,
  paddingX: 100,
  titleGap: 52,
  itemGap: 28,
};
```

At `1280x720`, scale them by about `0.67`.

Rules:

- every `fontSize` should come from `TYPE_SCALE`
- every padding and gap should come from `SPACING`
- do not shrink below `24px`
- treat bottom breathing room as structural space, not as wasted space

If the user speaks in points, convert to CSS pixels with `px = pt * 1.333`.

## Slide Writing

Slide titles should tell the story when read alone.

Pick one title style and keep it consistent:

- short topic titles
- short declarative/action titles

Avoid obvious AI-deck phrasing:

- theatrical reveal titles
- "It's not X. It's Y."
- fake suspense
- overreframing
- titles that sound like a speaker's punchline instead of a chapter heading

## Visual Direction

- Use large type and generous whitespace.
- Use provided images and brand assets liberally.
- Mix slide types: image, number, quote, table, graphic, text.
- Keep repeated structures aligned across slides.
- Avoid too much text. Convert crowded content into a different slide form.

## Image Handling

- Full-bleed images can aspect-fill.
- Screenshots and diagrams usually need aspect-fit.
- Transparent or fit-mode imagery needs deliberate contrast behind it.
- When text sits on imagery, use the same protection pattern the brand already uses: card, blur, gradient, or equivalent.

## Review Heuristics

During review, judge the composition like a slide deck, not like a webpage.

Important checks:

- titles read cleanly in sequence
- sizes still match the shared scale
- spacing still feels generous
- open space in the lower third is often correct
- no decorative takeaway cards or accent-border boxes unless the brief truly needs them
