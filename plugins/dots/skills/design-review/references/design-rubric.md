# Design Rubric

Use this rubric for the surface critique path: design-to-implementation QA and
single-surface critique.

## Fidelity

- Layout: frame size, grid, alignment, content order, spatial grouping, card radius, elevation, borders.
- Spacing: page margins, section gaps, item gaps, padding, tap-target spacing, vertical rhythm, cramped text, collapsed sections, and density drift.
- Typography: font family, weight, size, line height, letter spacing, wrapping, truncation, hierarchy, text density, optical balance, and mismatched display/body treatment.
- Color: token mapping, contrast, brand palette, state colors, gradients, opacity, shadows.
- Imagery: all target image assets are accounted for and match subject accuracy, crop, aspect ratio, generated/real image quality, background treatment.
- Icons: all icons are accounted for and match stroke weight, size, style family, alignment, optical balance, state changes.
- Shape and surfaces: rounded cards, borders, dividers, shadows, fills, and container treatments match the target rather than generic component defaults.
- Responsiveness: elements do not overlap, collapse into adjacent sections, clip, wrap awkwardly, or break hierarchy across desktop, tablet, and mobile viewports.
- Specificity and client-readiness: imagery, type, layout rhythm, component motifs, and copy are specific to the subject instead of reading as a swappable generic surface.
- Implementation shortcuts: custom CSS art, inline SVG substitutes, placeholder avatars, decorative blobs, and fake product imagery are flagged when they drift from the target design.

## Required Fidelity Surfaces

Every surface critique explicitly evaluates these five surfaces, even when the
user did not name them:

- Fonts and typography: family, fallback, weight, size, line height, letter
  spacing, antialiasing, hierarchy, wrapping, truncation, and whether display
  text and small UI text use appropriate optical weights. Check fonts closely
  for fidelity, using typeface lookup or image analysis to isolate differences.
- Spacing and layout rhythm: frame size, crop, alignment, margins, padding,
  grid tracks, section gaps, component spacing, radii, shadows/elevation, and
  vertical rhythm.
- Colors and visual tokens: sampled or inferred palette, gradients, opacity,
  contrast, semantic state colors, foreground/background balance, and whether
  CSS tokens map to the source design.
- Image quality and asset fidelity: subject correctness, crop, scale,
  sharpness, compression, transparency halos, masking, background treatment,
  raster-vs-vector appropriateness, and whether generated assets match the
  source art direction. Fail the critique if logos, illustrations, decorative
  marks, product imagery, non-standard icons, or other visible image assets
  from the visual target were replaced with custom inline SVG, handcrafted SVG,
  HTML elements, div/span shapes, CSS drawings, gradients, emoji, text glyphs,
  placeholder shapes, or code-native approximations.
- Copy and content of app-specific text.

## Mandatory Comparison Passes

Do not rely on generic "looks close" judgment. For each QA pass, inspect and
report on these areas:

### Core design and functionality

- Fonts and typography: identify mismatched font family/fallback, weight, scale, line height, letter spacing, antialiasing, text hierarchy, wrapping, truncation, display-vs-body optical treatment, cramped text, and places where text spacing makes the UI feel broken or harder to scan. Audit typography everywhere, including UI chrome — toolbars, sidebars, tabs, inputs, table cells, chart labels, status bars, and command palettes — not just headings and hero. Watch for browser-default or inherited control typography.
- Spacing and layout: compare frame/crop, alignment, margins, padding, gaps, component sizes, radii, elevation, borders, and vertical rhythm. Cite where spacing drift changes hierarchy, density, readability, or causes elements to collide.
- Apply the exact density, spatial-rhythm, proportions, spacing-system, optical-alignment, and hit-area guidance in [spacing.md](../../design/references/spacing.md).
- Viewport resilience: check desktop, tablet, and mobile widths for overlapping elements, clipped content, collapsing sections, broken grids, awkward wrapping, and controls that become unusable.
- Colors and tokens: compare palette, gradients, opacity, shadows, contrast, semantic status colors, disabled/active states, and whether implementation tokens map to design intent.
- Image quality and asset fidelity: check subject match, crop, scale, aspect ratio, sharpness, compression, transparency/masking artifacts, halos, background integration, and raster-vs-vector suitability. Div/CSS art or custom SVG art that replace images in the target design are banned.
- Copy and content: for any copy that is part of the app, not dynamic content, check that it is coherent, makes sense in the standalone context of the app, and is visually appealing.
- Icons: zoom in and analyze all visible icons and icons hidden behind controls/interactions to ensure they are fully implemented, aligned, and visually consistent.
- States and interactions: expand/collapse sidebars, tooltips, forms, hover, focus, active, selected, disabled, loading, success, error, empty states, and any interactive controls needed for a functional frontend.
- Motion and native feel, when present: inspect live or recorded behavior using
  [motion-audit.md](motion-audit.md); evaluate purpose, frequency, origin,
  physicality, interruption, timing, gesture response, reduced-motion behavior,
  and cohesion. Still screenshots cannot pass this surface.
- Specificity and client-readiness: check whether imagery, type, layout rhythm, component motifs, and copy belong to the subject, or whether the surface could be swapped into another generic landing page or app with minimal changes. Cite visible template patterns, missing subject-specific imagery or material, repeated default components, mismatch with accepted references, or copy/type/layout that could belong anywhere.
- AI shortcut artifacts: flag generic rounded cards, unnecessary borders, decorative CSS blobs, fake SVG illustrations, half-built avatars, mismatched hero art, and custom CSS/SVG replacements where the target called for real imagery, real icons, or a different surface treatment.

### Accessibility

- Contrast, focus indicators, keyboard reachability, semantic controls, labels, alt text, reduced motion.
- Apply the exact interactive-state, focus-ring, form, loading, destructive-action, keyboard-navigation, and gesture-discoverability guidance in [interaction-design.md](../../design/references/interaction-design.md).
- Text scaling and zoom resilience.
- Tap targets at practical mobile sizes.
- Layout stability when text wraps, scales, or appears in longer real-world strings.

## Finding Quality

A useful finding includes:

- One specific mismatch or flaw.
- Design evidence and implementation evidence.
- User or fidelity impact.
- Concrete fix, ideally with file/component/token/CSS guidance.
- Severity based on user impact, not personal taste.
- The affected fidelity surface when relevant: fonts, spacing, colors, image quality, layout, behavior, accessibility, content, icons, or responsiveness.
- The product-specificity surface when generic layout, imagery, type, component motifs, or copy weaken client readiness; keep confidence lower when no product subject, target, brand, reference, or accepted brief was inspected.
- Crammed text, broken wrapping, mismatched font weights, bad line height, or awkward letter spacing when they affect readability or hierarchy.
- Elements that overlap, clip, collapse into nearby sections, or break at alternate viewport sizes.
- Rounded cards, borders, shadows, or container treatments that appear in the implementation but are not present in the target.
- Borked icons, custom SVGs, half-assed attempts at avatars, hero art mismatches, custom CSS art, and placeholder-looking generated assets.
- Overflowing text, cramped text, broken layout, missing states, and incomplete interactions.

Avoid:

- Vague statements such as "make it more polished."
- Criticizing known placeholder content unless it affects the design goal.
- Treating every pixel difference as a bug when the design intent is preserved.
- Mixing multiple unrelated flaws into one finding.

## Report Template

Use this compact structure for a saved full review. In chat, include only the
sections needed to communicate the result.

```markdown
# Surface Critique

final result: passed|blocked

## Overview
What was compared, the overall fidelity read, and the main reason for the result.

## Findings
### [P1] Short issue title
- Location:
- Surface:
- Evidence:
- Impact:
- Recommendation:
- Acceptance check:
- Verification needed, if any:
- Confidence, when evidence-limited:

## Design Constitution
Include the scored table only for a full acceptance review; omit it for a
focused critique. Score evidenced principles and report the available total.

## Implementation Checklist
- Ordered repairs derived from findings.

## Evidence Limits
- Missing viewports, states, interaction evidence, or source targets.
```

Add motion results only when motion is in scope. Add non-blocking polish only
when it helps handoff. If there are no substantive mismatches, say that clearly
and list only material residual verification gaps.
