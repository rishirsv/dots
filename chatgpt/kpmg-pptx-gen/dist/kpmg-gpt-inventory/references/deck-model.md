# Deck model (what to edit)

The master deck spec is `deck/ts-custom-gpts-portfolio.json`.

## GPT slide shape (one-pager)

Each GPT slide is a `twoColumnText` slide with a screenshot placeholder and icon metadata:

```json
{
  "type": "twoColumnText",
  "title": "GPT Name",
  "strapline": "1-sentence tagline",
  "leftBody": [
    "Problem:",
    "Bullet 1 (2–3 sentences).",
    "Bullet 2 (2–3 sentences).",
    "How we solve it:",
    "Bullet 1 (2–3 sentences).",
    "Bullet 2 (2–3 sentences).",
    "Outcome / ROI:",
    "Bullet 1 (2–3 sentences).",
    "Bullet 2 (2–3 sentences)."
  ],
  "rightBody": [" "],
  "iconPlacement": "titleLeft",
  "icon": "../path/to/icon.png",
  "style": { "bodyFontSize": 11, "straplineFontSize": 11, "iconSize": 0.62 },
  "screenshotPlaceholder": { "caption": "Describe the screenshot to insert later." }
}
```

Notes:
- The right column is intentionally reserved for a screenshot frame, so `rightBody` should remain blank.
- Keep bullets flat (no nested arrays). This reliably renders as multiple visible bullets per section.
