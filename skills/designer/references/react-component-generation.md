# React component generation from HTML references

Use this workflow when the user asks for a design task based on an HTML reference.

## Goal

Convert HTML references into production-ready React components with deterministic structure, token-aware styling, and lightweight validation.

## Inputs supported

- Raw HTML snippet pasted in chat
- Existing local HTML file(s)
- HTML source fetched from a URL
- Screenshots paired with HTML for visual parity checks

## Intake and routing rules

Use this workflow when intent is clearly conversion-oriented, for example:
- "Convert this HTML component to React"
- "Turn this HTML section into a reusable TSX component"
- "Componentize this markup"

If the request is primarily exploratory redesign (not conversion), use the default `designer` workflow instead.

## End-to-end workflow

1. Confirm source and target
- Identify the HTML source path or payload.
- Identify framework target (React/TSX unless user specifies otherwise).
- Read `docs/DESIGN.md` sections relevant to token/theme rules before coding.

2. Capture structure before styling
- Segment the HTML into logical components (container, header, content, actions, repeated rows).
- Choose a reusable component boundary first; avoid monolithic output.

3. Scaffold from templates
- Start from `resources/component-template.tsx`.
- If static labels, URLs, or repeated sample records are present, extract them into a data module using `resources/data-template.ts`.

4. Apply project styling rules
- Prefer design tokens and semantic classes from project context.
- Avoid hardcoded hex colors in component class strings when token classes exist.
- Preserve accessibility attributes and meaningful semantics from source HTML.

5. Wire behavior cleanly
- Keep rendering components focused on presentation.
- Pull heavier state/logic into hooks when complexity grows.

6. Validate output
- Run `scripts/validate-react-component.js <component-path>`.
- Fix all blocking issues before finalizing.
- Run checklist in `references/react-component-checklist.md`.

7. Verify visual parity
- Compare layout, spacing, type, and interaction states against the reference HTML/screenshot.
- Document intentional deviations (for token consistency or accessibility).

## Retrieval reliability

When the reference HTML comes from signed or expiring URLs:
- Use `scripts/fetch-signed-url.sh <url> <output-path>`.
- Keep URLs quoted.
- Fetch first, then convert locally from saved HTML.

## Output contract

For each generated component set, include:
- Component file path(s)
- Data module path (if extracted)
- Validation result summary
- Any intentional deviations and why

## Common pitfalls

- Emitting one large TSX file for complex markup
- Keeping hardcoded content inline when it should be data
- Using raw color hex values in class strings despite available tokens
- Skipping accessibility attributes during conversion
- Skipping validation/checklist pass
