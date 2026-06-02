---
version: alpha
name: <Design system name>
description: <One-line description of the brand and product>
colors:
  primary: "#<hex>"
  secondary: "#<hex>"
  tertiary: "#<hex>"
  neutral: "#<hex>"
  surface: "#<hex>"
  on-surface: "#<hex>"
  error: "#<hex>"
typography:
  headline-lg:
    fontFamily: <Font family>
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  body-md:
    fontFamily: <Font family>
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: <Font family>
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.05em
rounded:
  none: 0
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
  input-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px
---

# DESIGN.md

## Overview

<One or two paragraphs on brand personality, target audience, and the emotional response the UI should evoke. Name the mood physically — "warm institutional", "clinical precision", "late-night terminal" — rather than abstractly. State what this product is and is not.>

## Colors

<Describe how the palette is used. Lead with what each color is for, not just its hex.>

- **Primary (`#<hex>`):** <role and where it appears>
- **Secondary (`#<hex>`):** <role>
- **Tertiary (`#<hex>`):** <role, including accent or interaction usage>
- **Neutral (`#<hex>`):** <surface and background role>

<State accent strategy: restrained (≤10% accent), committed (30-60% identity color), full palette, or drenched. Name a real reference brand if it helps.>

## Typography

<Describe the type system in one paragraph. State which family carries headlines, which carries body, and which carries data or labels.>

- **Headlines:** <family, weight, voice>
- **Body:** <family, weight, measure>
- **Labels:** <family, weight, casing conventions>

<Call out tabular numbers, line-height adjustments for dark mode, or fluid `clamp()` use if any.>

## Layout

<Describe the layout model: fluid grid, fixed-max-width, columns, breakpoints. State the spacing scale base (e.g., 8px with 4px micro-adjustments) and the container or card padding conventions.>

## Elevation & Depth

<Describe how visual hierarchy is conveyed. If shadows: spread, blur, color. If flat: borders, tonal layers, color contrast.>

## Shapes

<Describe the corner-radius and geometry language: architectural sharpness, soft rounded, mixed. State the default radius and where exceptions apply.>

## Components

<Describe component atoms beyond what tokens express: hover and pressed states, focus rings, disabled affordances, error treatments, icon usage inside buttons or inputs.>

- **Buttons:** <primary, secondary, tertiary variants and when to use each>
- **Inputs:** <text inputs, text areas, labels, helper text, error states>
- **Lists and cards:** <when to use cards vs plain layout>
- <other components specific to this product>

## Do's and Don'ts

- Do <one practical rule grounded in this design system>
- Don't <one practical anti-pattern this design system avoids>
- Do maintain WCAG AA contrast (4.5:1 for body text, 3:1 for large text and UI components)
- Don't <repository- or product-specific anti-pattern>
