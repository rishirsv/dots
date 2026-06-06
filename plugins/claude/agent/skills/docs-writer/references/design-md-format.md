# DESIGN.md Format

`DESIGN.md` describes a visual identity to coding agents. It has two parts:

- **YAML frontmatter:** optional machine-readable design tokens. Treat as normative when present.
- **Markdown body:** human-readable rationale and application guidance. Treat as contextual.

## Required Runtime Checks

- Preserve valid YAML bounded by `---` lines when frontmatter is present.
- Keep `version: alpha` unless the project source says otherwise.
- Use token references like `{colors.primary}` rather than repeating raw values inside components.
- Do not invent tokens, brand claims, or accessibility guarantees without evidence.
- Check for duplicate sibling `##` headings.

## Recommended Section Order

Omit sections that do not apply.

1. `Overview`
2. `Colors`
3. `Typography`
4. `Layout`
5. `Elevation & Depth`
6. `Shapes`
7. `Components`
8. `Do's and Don'ts`

## Token Shape

```yaml
---
version: alpha
name: <design system name>
description: <optional one-line description>
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
  <scale-level>: <Dimension | number>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <property-name>: <string | token reference>
---
```

Types:

- `Color`: any valid CSS color string. Hex `#RRGGBB` remains the recommended default.
- `Dimension`: number with `px`, `em`, or `rem`.
- `Token reference`: `{path.to.token}`, such as `{colors.primary}`.
- `<scale-level>`: any string; common names are `xs`, `sm`, `md`, `lg`, `xl`, `full`.

## Recommended Token Names

These are non-normative defaults:

- Colors: `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error`.
- Typography: `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`.
- Rounded: `none`, `sm`, `md`, `lg`, `xl`, `full`.
- Spacing: `xs`, `sm`, `md`, `lg`, `xl`, `gutter`, `margin`.

## Component Variants

Use suffixed keys for states:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
```

Common properties include `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `height`, `width`, `borderColor`, `focusRing`, and `iconSize`.

## Accessibility Notes

- Normal text contrast should be at least 4.5:1 when accessibility claims are made.
- Large-scale text contrast is 3:1.
- UI component/non-text contrast requirements may also apply.
- Do not claim compliance unless contrast was checked or source design rules provide proof.

## Writing Rules

- Tokens carry values; prose explains intent and application.
- Use concrete sensory language only when grounded in source evidence.
- Keep `Do's and Don'ts` short and actionable.
- Prefer component rules that coding agents can implement.
- Do not turn `DESIGN.md` into a UI critique report.
