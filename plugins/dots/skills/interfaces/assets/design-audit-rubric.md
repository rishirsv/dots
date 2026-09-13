# Design Audit Rubric

Use D for design review, U for UX review, and both for combined review. Each
criterion has one owner below. Distinguish observed, unverified, and not-applicable coverage.

## Design Review

| ID | Criterion | Inspect |
|---|---|---|
| D1 | Identity and visual language | Does the visual system suit the brief and carry a deliberate point of view? Assess palette intent, accent balance, and material character. Compare with category expectations only when useful; familiarity is not automatically the goal. |
| D2 | Hierarchy and composition | Does visual weight match importance? Identify the entry point, competing focal points, groupings, proportions, alignment, spacing rhythm, and optical balance. Judge the arrangement of visible content here; whether that content belongs is U2. |
| D3 | Typography | Inspect family, role scale, weight, line height, tracking, measure, wrapping, and truncation. Judge visual reading quality here; contrast and user scaling belong to U6. |
| D4 | Assets and surface treatment | Inspect imagery, crop, sharpness, masking, icons, stroke/optical consistency, borders, shadows, radii, and elevation. Do they reinforce the design rather than add noise? Accessible alternatives belong to U6. |
| D5 | Visual system consistency | Check equivalent component appearances, token use, and visual variants across screens/states. Flag unexplained differences in repeated roles. Behavioral consistency and platform interaction conventions belong to U3. |

## User Experience Review

| ID | Criterion | Inspect |
|---|---|---|
| U1 | Task entry and orientation | Can the intended user find where to begin, understand the available actions, know their current location or step, and predict what happens next? Check discoverability, wayfinding, scope, and expectations. Visual emphasis itself belongs to D2. |
| U2 | Information architecture and cognitive load | Does organization match the user's mental model and immediate task? Check grouping, prioritization, task-appropriate density, labels that restate visible context, duplicated dates, totals, or metadata, repeated disclaimers, instructions that paraphrase adjacent controls, and provenance or internal metadata given more prominence than its value. Judge recurring content across a representative viewport: count complete visible items and every label, control, divider, or metadata line multiplied across them. A disclosure still has interaction cost; retain hidden content only when it supports the current task. Use progressive disclosure for supporting detail while keeping risk, coverage, approval status, and essential functionality available at the point of decision. |
| U3 | Actions, flow, and conventions | Can the user complete the task with sensible steps and effort? Check controls, navigation, defaults, selections, reversibility, transitions between steps, interaction consistency, and platform conventions. For repeated items with optional detail, test collapsed and expanded states; prefer one accessible disclosure control within the item over a separate closed-state detail row. Test gesture discovery and visible alternatives. |
| U4 | States, feedback, and recovery | Check loading, empty, success, error, validation, disabled, and other reachable states. Are action feedback and operation progress timely, entered data preserved, failures recoverable, and the next step clear? Warnings should appear with the condition they describe, explain the consequence, and offer an action when one exists; repeated or persistent warnings without a current consequence add noise. Check whether controls and feedback already communicate routine workflow state before adding persistent explanatory prose. Assess motion as state/continuity feedback; motion accessibility belongs to U6. |
| U5 | Content and trust | Are labels, instructions, calls to action, claims, and terminology accurate and clear? Examine informed choices, consequences, reassurance, and misleading promises. Check meaning and tone here; type styling belongs to D3. |
| U6 | Inclusive operation | Check text/control contrast, non-color cues, semantics, reading order, keyboard reachability, focus, labels, accessible names and alternatives, target sizes, zoom/reflow, text expansion, assistive-technology behavior, and reduced-motion/timing needs. Identify the evidence each claim requires. |
| U7 | Emotional and situational fit | Does the experience respect the user's likely stress, attention, expertise, frequency of use, and environment? Identify appropriate reward, encouragement, and uncommon care. Distinguish contextual hypotheses from observed user research; praise or celebration is not universally appropriate. |

## Ownership And Synthesis

Classify by the cause requiring correction, not every downstream effect. A weak
contrast ratio belongs to U6 even when it also weakens hierarchy. Excessive
content belongs to U2; poor spacing of necessary content belongs to D2. One
cause produces one finding with all relevant impacts, not duplicate findings
under several headings.

If a narrow mode exposes a material issue outside its scope, flag it as such
and state the additional review needed; do not silently claim combined coverage.

A readiness or polish claim requires rendered evidence from the affected
workflow at a representative viewport, including the interaction or state that
was changed. Source inspection alone cannot support that claim.
For a product-wide claim, account for every primary view in scope and its
representative populated, loading, empty, and error states, or identify the
uncovered views and states explicitly.
