# Design QA Rubric

Compare against the accepted target and behavior requirements. Check each
applicable category; mark unspecified expectations and unavailable evidence
explicitly. Each defect has one primary category, assigned by its cause.

## Visual Fidelity

| ID | Criterion | Compare |
|---|---|---|
| Q1 | Structure and geometry | Content order, grouping, frame/crop, grid tracks, proportions, density, alignment, margins, padding, gaps, component sizes, and above-the-fold composition at the reference viewport. |
| Q2 | Typography | Family and fallback, weight, size, line height, tracking, optical balance, wrapping, truncation, and text density. Separate rendering-environment differences from fixable drift; do not infer an exact font from an indistinct capture. |
| Q3 | Color and surfaces | Palette/token mapping, foreground/background balance, gradients, opacity, state colors, borders, radii, shadows, and elevation. Contrast usability belongs to Q8. |
| Q4 | Images and icons | Account for every target asset: subject/metaphor, crop, scale, aspect ratio, sharpness, compression, transparency edges, masks, style, stroke, and optical size. Flag missing assets and approximations that drift from the target. |
| Q5 | Copy and content | Preserve approved app copy, labels, and content structure. Distinguish dynamic data from fixed copy; check standalone meaning, realism, and leaked instructions or invented claims. Text geometry belongs to Q2. |

## Implementation UX

| ID | Criterion | Exercise |
|---|---|---|
| Q6 | Required behavior | Navigation, links, buttons, tabs, menus, selections, forms, filters, tooltips, media, and other required actions produce the intended result. Check hover/active/selected/disabled states, transitions, validation, loading/empty/error/success behavior, recovery, data preservation, feedback timing, and motion interruption. Do not invent a state for every control. |
| Q7 | Adaptive layout | At supported sizes, orientations, and content extremes, essential information and controls remain usable: no collisions, unintended overflow, clipping, collapsed regions, or destructive reordering. Use corresponding targets where supplied and established adaptation requirements elsewhere. User zoom and text-scaling access belong to Q8. |
| Q8 | Accessibility conformance | Verify applicable contrast, semantics, labels, alt text, reading order, keyboard/focus behavior, target sizes, non-color status cues, reduced motion, timing, text scaling, zoom, and assistive-technology requirements. Identify untested requirements; visual similarity alone cannot establish conformance. |

## Classify Findings

Use the primary cause once: a wrong font that changes wrapping is Q2; a correct
font clipped only at narrow widths is Q7; clipping under user text scaling is
Q8. Link effects across categories without counting the same defect twice.

- **Implementation defect:** violates the accepted target or an applicable
  behavior, adaptation, or accessibility requirement. Correct within scope.
- **Agreed adaptation:** an intentional, supported difference. Record it and
  exclude it from the defect count.
- **Source-design issue:** a problem reproduced from the accepted design. Send
  it to design audit; do not change the target silently. If it also violates an
  explicit acceptance requirement, keep that requirement blocked pending a
  resolved design decision.
- **Unspecified or unverified:** evidence or a governing decision is missing.
  Name the gap rather than treating it as a defect or pass.

## Severity And Closure

| Level | Consequence |
|---|---|
| P0 | Core task impossible, severe accessibility failure, or unusable layout |
| P1 | Major mismatch or usability regression |
| P2 | Material visual drift, inconsistent behavior, or adaptive/polish defect |
| P3 | Minor refinement that does not block the declared acceptance scope |

Persistent controls hidden by overflow, or drift that materially changes major
proportions, wrapping, density, or first-viewport content, is P2 or higher.

Each finding names location, expected versus actual result, evidence, impact,
and a concrete fix. Prefer the responsible component/token when known. Do not
turn every pixel difference into a defect or broaden fidelity checks into
optional aesthetic changes.
