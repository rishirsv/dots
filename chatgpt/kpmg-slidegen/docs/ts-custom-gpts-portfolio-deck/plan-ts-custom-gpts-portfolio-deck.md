# TS Custom GPTs Portfolio Deck (Executive Inventory)

## Summary
Create an executive-ready inventory deck of TS Custom GPTs. Each GPT gets a consistent 2-column “one-pager” slide: left PRD narrative (Problem → How we solve it → Outcome/ROI) and right framed screenshot placeholder (to be replaced later with real screenshots). Icons are included consistently on every GPT slide.

## Global rules
- Use “Custom GPTs” on the cover (and optional divider). Each GPT slide title is the GPT name.
- No technical terms on slides (no “JSON”, “schema”, etc.).
- Bullets are allowed but must be 2–3 complete sentences per bullet (no fragments).

## Deck structure (v1)
1) Cover  
2) Portfolio overview  
3) Divider: “Custom GPT Inventory”  
4–12) One slide per GPT (9 slides)  
13) Back cover

## Standard GPT one-pager layout (2-column; screenshot-ready)
### Left column (≈ half slide): PRD narrative with subheaders
Subheaders (same on every GPT slide):
- Problem
- How we solve it
- Outcome / ROI

Under each subheader:
- Exactly one bullet, 2–3 complete sentences, with clear “before → after”.

### Right column (≈ half slide): Screenshot placeholder frame + icon
- Top-right: GPT icon in a consistent “icon chip”.
- Main: a branded “Example (screenshot)” frame with:
  - Placeholder text: “Screenshot placeholder (to be added).”
  - 1 sentence describing what the screenshot should show.
  - A consistent note: “Recommended screenshot: final output view (not the prompt).”

## Screenshot placeholder spec (per GPT)
- kpmg-slidegen: “Show a generated deck slide (before/after optional) demonstrating brand compliance.”
- Meeting Intelligence: “Show final structured meeting notes output.”
- Meta Prompt: “Show the optimized prompt output ready to copy/paste.”
- KDN Tasks: “Show a task packet and the send-ready handoff message.”
- TS Copywriter: “Show polished deliverable-ready paragraph output.”
- TS Engagement Assistant: “Show the generated engagement letter excerpt with filled fields (final state).”
- SPA Assistant: “Show an issue table with clause references (final state).”
- Lingo: “Show 1–2 glossary slides from the generated deck.”
- FDD Researcher: “Show the kickoff brief output (final state).”

## Acceptance criteria
- Every GPT slide clearly answers Problem / How / Outcome in executive language.
- Right column is always a consistent screenshot placeholder frame (no excerpts).
- Every GPT slide includes its icon, consistently sized/placed.
- No bullet fragments anywhere.

## Implementation notes
- Reuse the existing `twoColumnText` layout and extend the existing builder to support:
  - `icon`: a consistent icon chip in the right column.
  - `screenshotPlaceholder`: a framed screenshot placeholder in the right column (caption + consistent note).
- Keep content in a single structured input file so teams can add GPTs by duplicating a record and dropping in an icon + screenshot caption.
