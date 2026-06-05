# DESIGN.md Format (Google Stitch)

The Google Stitch [DESIGN.md format](https://github.com/google-labs-code/design.md) is a plain-text design-system spec read by AI coding agents. It is Apache-2.0, currently `version: alpha`.

A `DESIGN.md` has two parts:

- **YAML frontmatter**: machine-readable design tokens. **Normative.**
- **Markdown body**: human-readable rationale and guidance. Contextual.

Prose may use descriptive names (e.g., "Midnight Forest Green"); the tokens (e.g., `primary`) are the values.

## Section order

These sections appear in this order. Omit any that do not apply.

1. **Overview** (also: "Brand & Style") — brand personality, target audience, emotional response.
2. **Colors** — palettes and color tokens.
3. **Typography** — type roles, weights, sizes.
4. **Layout** (also: "Layout & Spacing") — grid model, spacing scale.
5. **Elevation & Depth** (also: "Elevation") — shadows or alternative depth strategy.
6. **Shapes** — corner radii, geometric language.
7. **Components** — atom styles and variants.
8. **Do's and Don'ts** — practical guardrails.

An optional `<h1>` title may appear above the sections. All section headings use `## `. Duplicate `##` headings are an error.

## Token schema

The YAML frontmatter is bounded by `---` lines and follows this shape:

```yaml
---
version: alpha
name: <design system name>
description: <optional>
colors:
  <token-name>: <Color>
typography:
  <token-name>:
    fontFamily: <string>
    fontSize: <Dimension>
    fontWeight: <number>
    lineHeight: <Dimension | number>
    letterSpacing: <Dimension>
    fontFeature: <string>     # optional
    fontVariation: <string>   # optional
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string | token reference>
---
```

**Types:**

- `Color`: hex sRGB like `#1A1C1E`.
- `Dimension`: number with unit suffix `px`, `em`, or `rem`.
- `Token reference`: `{path.to.token}`, e.g., `{colors.primary}` or `{typography.body-md}`. Most groups require a primitive reference; `components` may reference composite types.
- `<scale-level>`: any string, common names are `xs`, `sm`, `md`, `lg`, `xl`, `full`.

## Recommended token names (non-normative)

- Colors: `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error`.
- Typography: `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`.
- Rounded: `none`, `sm`, `md`, `lg`, `xl`, `full`.

## Component variants

Variant states live under suffixed keys, e.g., `button-primary`, `button-primary-hover`, `button-primary-active`. Component property tokens include `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`.

## Writing rules

- Tokens carry the values; prose explains intent and application.
- Reference tokens by `{path.to.token}` rather than repeating raw values.
- Use the markdown body to communicate brand voice, mood, and judgment a token list cannot express.
- Keep "Do's and Don'ts" actionable and short.

## Consumer fallback behavior

Unknown sections, color tokens, typography tokens, and component properties are accepted (preserved or warned). Duplicate `##` headings are an error.

## Sources

- Official spec: [google-labs-code/design.md](https://github.com/google-labs-code/design.md)
- Example DESIGN.md files: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
- Announcement: [Stitch's DESIGN.md format is now open-source](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)
