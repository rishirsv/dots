---
version: alpha
name: <Design system name>
description: <One-line description of the brand and product>
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
  surface: "#FFFFFF"
  on-surface: "#1A1C1E"
  error: "#BA1A1A"
typography:
  h1:
    fontFamily: <Font family>
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body:
    fontFamily: <Font family>
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  label:
    fontFamily: <Font family>
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.02em
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
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
  input-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
---

# <Design system name>

## Overview

<Describe the product's look and feel, brand personality, target audience, and the emotional response the UI should evoke. State whether the interface should feel playful or professional, dense or spacious, expressive or restrained.>

## Colors

<Describe the palette and semantic roles. Tokens are the source of truth; prose explains how to apply them.>

- **Primary (`#1A1C1E`):** <role and where it appears>
- **Secondary (`#6C7278`):** <role and where it appears>
- **Tertiary (`#B8422E`):** <accent or interaction role>
- **Neutral (`#F7F5F2`):** <page, panel, or background role>
- **Surface (`#FFFFFF`):** <foreground surface role>
- **On surface (`#1A1C1E`):** <text and icon role>
- **Error (`#BA1A1A`):** <error, destructive action, or warning role>

## Typography

<Describe which family carries headlines, body, labels, and data. Name weights, line-height behavior, casing conventions, and any font-feature or variable-font usage.>

- **Headlines:** <family, weight, voice>
- **Body:** <family, weight, measure>
- **Labels:** <family, weight, casing conventions>

## Layout

<Describe grid, max width, columns, breakpoints, spacing scale, container padding, section rhythm, and how spacing changes across compact and wide viewports.>

## Elevation & Depth

<Describe shadows, borders, tonal layers, overlays, and focus depth. State whether the system is flat, layered, glassy, or shadowed, and when depth is allowed.>

## Shapes

<Describe radius and geometry language. State the default radius, which components may use sharper or rounder corners, and whether circular/full-radius treatment is reserved for specific controls.>

## Components

- **Buttons:** <variants, states, hierarchy, icon usage, disabled behavior, and when to use each>
- **Inputs:** <labels, helper text, validation, error states, focus rings, and density>
- **Navigation:** <tabs, menus, sidebars, breadcrumbs, or app chrome rules>
- **Lists and cards:** <when to use cards vs plain layout, density, dividers, metadata, and hover states>
- **Dialogs and sheets:** <surface, spacing, actions, destructive flows, and dismissal rules>
- **Data display:** <tables, metrics, charts, empty states, and loading states>

## Do's and Don'ts

- Do <one practical rule grounded in this design system>.
- Do <one accessibility or responsiveness rule grounded in this design system>.
- Do <one component composition rule grounded in this design system>.
- Don't <one practical anti-pattern this system avoids>.
- Don't <one visual or interaction pattern this system forbids>.
