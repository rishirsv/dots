# Fidelity Review

Compare an accepted prototype, Figma node, screenshot, mockup, or source capture
with the rendered implementation. This mode judges fidelity; a production
readiness review also needs the applicable general-review playbooks.

## Establish And Capture The Comparison

Identify the accepted target and implementation, then open or capture both.
Paths, code, memory, and separate image descriptions cannot establish fidelity.
If one artifact is unavailable, report any independently supported observations;
a requested fidelity gate remains blocked until both can be compared.

1. Match route, content, state, theme, viewport, authentication, and interaction
   state. Identify fixture differences before attributing them to design drift.
2. Align crop, scale, density, and device frame. Compare content regions rather
   than browser chrome or a surrounding canvas unless those belong to the target.
   When precision matters, record source and implementation pixel dimensions,
   viewport or logical size, capture density, and normalization. Keep originals;
   normalize copies to comparable dimensions before judging apparent differences.
3. Put target and implementation in the same comparison input. Inspect the whole
   view for composition, hierarchy, density, and layout, then focused regions
   wherever typography, alignment, assets, controls, or states are unreadable.
4. Inspect the five fidelity surfaces in
   [surface-critique.md](surface-critique.md#inspect-the-applicable-surfaces):
   typography, layout, color, assets, and copy. For a focused request, restrict
   findings to its scope; for acceptance, account for each applicable surface.

Compare required assets and content, including omissions and substitutions.
Do not infer an exact font or token from pixels when the evidence cannot identify
it; verify available source values or describe the visible difference.

## Distinguish Drift From Adaptation

Preserve accepted composition, typography, assets, content, and interaction
intent. Allow evidenced adaptations for native behavior, accessibility, real
content, and responsive layout. Record the constraint and why the adaptation
preserves intent. “Looks better” does not justify departing from the target.

Unexplained drift remains a finding. Do not manufacture findings from density,
frame, or fixture mismatches, or treat every pixel difference as a defect.
If an adaptation materially changes accepted intent and the choice is unresolved,
name the decision rather than silently accepting it.

A usability problem reproduced faithfully from the target is a separate design
concern. It does not fail fidelity, but can block a requested general readiness
gate. Likewise, a state omitted from the target is a target coverage gap; do not
invent an expected design and call the implementation a mismatch.

## Report And Verify Corrections

Use the parent finding format, citing evidence from both artifacts. Record
accepted differences and material comparison limits concisely. Use the shared
`final result: passed|blocked` rules for a requested fidelity gate.

Apply the parent's re-review protocol after corrections: retain finding IDs,
compare revised captures at matching states, and identify post-fix evidence.
The reviewer reports and verifies; an authorized implementation workflow owns
fixes. Build, lint, deployment, and preview troubleshooting are not visual
comparison iterations.
