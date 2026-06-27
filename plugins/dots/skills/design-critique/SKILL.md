---
name: design-critique
description: "Critiques a single rendered artifact, screen, component, or surface after implementation. Use for agent self-review, pre-handoff QA, and design critique of one visible surface; compare against an approved visual target when one exists. Not for broad UX/product-flow audits, journeys, funnels, or multi-step experiences; use ux-audit for those."
---

# Design Critique

Critique a single rendered artifact, screen, component, or surface after
implementation. Use this for agent self-review, pre-handoff QA, and focused
design critique of one visible surface.

When an approved visual target exists, compare the rendered implementation to
that target, report where the build diverges, and flag defects in the target
itself. When there is no approved target, critique the rendered artifact on its
own terms and make the evidence limit explicit.

The dividing line with [ux-audit](../ux-audit/SKILL.md) is scope: this skill is
for one artifact or screen; `ux-audit` is for broader flows, journeys, funnels,
onboarding paths, checkout paths, settings paths, or multi-step experiences.

This skill owns the comparison method and the severity scale. Build skills
invoke it as a gate; they do not restate the rubric.

Use this before every visual-design build handoff.

A complete target comparison requires both:

- a source visual target: image, screenshot, mockup, design board, or source
  capture
- a rendered implementation: local URL, deployed URL, app screen, component, or screenshot

Focused self-review or single-surface critique without a source target requires
a rendered implementation plus any available brief, spec, prompt, or acceptance
criteria. Do not claim source-vs-render fidelity when no source visual target is
available.

If either artifact cannot be opened, captured, or compared, write `design-critique.md`
with an evidence-limits section that names the missing evidence. Do not claim a
complete source-vs-render comparison when required evidence is missing.

## Adversarial Reviewer

Direct critique is acceptable for ordinary checks. Prefer an independent
adversarial reviewer when the implementation author is reviewing their own work,
the surface is externally shipped, revenue-critical, accessibility-sensitive,
brand-critical, acceptance-blocking, the user asks for a second opinion, or the
handoff decision feels close.

When one of those triggers applies and the runtime offers subagents, launch one
adversarial reviewer before writing the final report. Give the reviewer exact
paths or pasted excerpts for:

- this skill's instructions
- [qa-rubric](./references/qa-rubric.md)
- the source visual target, if one exists
- the rendered implementation evidence
- the brief, acceptance criteria, or stated product intent
- the mode: target comparison or single-surface critique

Ask the reviewer to find the strongest real fidelity, usability, accessibility,
polish, and evidence gaps that could change `final result: passed|blocked`.
The reviewer must cite visible evidence, avoid inventing issues, and return a
ranked list of findings with severity, location, affected surface, impact,
recommendation, and acceptance check. The reviewer does not edit files, write the
final report, or decide alone. Require the reviewer to state which skill,
rubric, target, and implementation evidence it inspected.

The parent agent owns the final critique. Verify the reviewer findings against
the captured evidence, merge only findings that hold up, and record the reviewer
trigger and finding disposition in `design-critique.md`. If subagents are
unavailable, the task is too small to justify one, or the reviewer did not
inspect the required skill/rubric/evidence, proceed directly and note the omitted
reason when that matters to confidence.

## Grounding

Follow the repo's design guidance, [visual-design](../visual-design/SKILL.md),
the accepted brief, and the accepted visual target when one exists. Do not
introduce a new design direction during QA; evaluate the rendered implementation
against the intended design and the quality bar for the single surface.

## Workflow

Compare the intended design to the implementation as a product-quality reviewer,
not as a generic aesthetic critic. The output must be a prioritized fix list
grounded in visible evidence from the rendered artifact and, when available, the
source target.

Do not write the QA review from memory, code, or file paths alone. Open or
capture the rendered implementation first, and open or capture the source design
when one exists. Judge what is actually visible.

When a source target exists, do not pretend separate image views are side-by-side
comparison. Put the source image and the implementation screenshot together in
the same comparison input, then judge the visible differences from that combined
input.

1. Identify the comparison target.
   - Determine whether this is target comparison or single-surface critique.
   - For target comparison, determine the source design: image, design board,
     screenshot, source capture, or mockup.
   - Determine the implementation: local URL, deployed URL, app screen, component, screenshot, or code-rendered view.
   - For target comparison, match the same viewport, state, theme, device density, route, content, auth state, and interaction state before judging.
   - If artifacts do not represent the same state, call that out first and avoid false precision.

2. Capture evidence.
   - For web/app implementations, open the target in a browser and capture
     screenshots at the intended viewport.
   - Capture additional states when relevant: mobile/desktop, hover/focus/active, empty/loading/error, dark/light, and key responsive breakpoints.
   - Save paths or URLs for screenshots when available so findings can cite evidence.
   - For target comparison, capturing screenshots is not enough. Put the source image and the implementation screenshot together in the same comparison input before judging.

3. Normalize before comparing.
   - For target comparison, align crop, viewport size, scale, and device frame. Do not compare a framed mockup to an unframed page without noting the mismatch.
   - Prefer comparing content regions over full browser chrome or surrounding canvas.

4. Compare at the right level of detail.
   - Use a full-view comparison or full-screen capture to judge overall composition, hierarchy, layout, density, and responsive structure.
   - Use focused region comparisons when important details are too small to judge in the full-view comparison.
   - Choose focused regions from the actual source and implementation. Use them where fidelity depends on precise typography, alignment, imagery, assets, icons, logos, controls, forms, navigation, tables, dense UI, or visible interaction states.
   - If no focused region is needed, say why in `design-critique.md`.
   - Do not treat QA as complete from a full-view comparison alone when important details are not clearly readable.

5. Review systematically.
   - Read [qa-rubric](./references/qa-rubric.md) when the QA pass spans more than a quick visual check.
   - Check information architecture, layout, spacing, typography/fonts, color, imagery/image quality, icons, copy, affordances, interaction states, responsiveness, accessibility, and polish.
   - Always make a specific pass over the five required fidelity surfaces: fonts/typography, spacing/layout rhythm, colors/tokens, image quality, and copy/content. Do this even if the user did not name those areas explicitly.
   - If the target does not address some issue you're seeing (e.g. a null state), call that out as a separate finding as a shortcoming of the target to be addressed.
   - Your other goal is to decide whether the implementation is ready for handoff or still blocked by visible design issues. If there are stylistic problems, call them out. If the user's prompt is leaking into the implementation (vs letting the app stand on its own), call that out as well.
   - Distinguish design drift from intentional product/code constraints. If a deviation may be intentional, phrase it as a question or assumption.

6. Produce a reader-first, fix-oriented QA report.
   - Start with a short overview that states what was compared, the overall
     fidelity read, and the highest-impact issue.
   - Include `final result: passed` or `final result: blocked` near the top.
   - Lead the body with findings, ordered by severity and user impact.
   - For each finding include: severity, location, affected fidelity surface,
     what differs, evidence, why it matters, and the concrete recommendation.
   - Include exact CSS/component/token suggestions when the implementation context is available.
   - Keep each finding's recommendation with that finding; do not make readers
     hunt for the fix in a separate section.
   - Separate objective mismatches from subjective polish recommendations.
   - Do not say a design matches, is done, or is as good as it can get until the required fidelity surfaces have been checked and any remaining differences are explicitly classified as acceptable, expected, or still actionable.
   - Include a separate concise implementation checklist after the findings.

## Pass / Block

Every saved report must include exactly one final result:

- `final result: passed` when the rendered artifact is ready for handoff and any
  remaining differences are explicitly classified as acceptable, expected, or
  non-blocking polish.
- `final result: blocked` when required evidence is missing, the implementation
  cannot be inspected, source-vs-render fidelity cannot be judged for a target
  comparison, a required fidelity surface has unresolved issues, or any P0/P1
  finding remains.

P2 findings usually block only when they affect the user's stated acceptance
bar, visual target fidelity, usability of the single surface, or responsive
quality. P3 findings should be listed as follow-up polish unless the user set a
stricter fidelity bar.

## Required Fidelity Surfaces

Every QA report must explicitly evaluate these surfaces:

- Fonts and typography: family, fallback, weight, size, line height, letter spacing, antialiasing, hierarchy, wrapping, truncation, and whether display text and small UI text use appropriate optical weights. It is incredibly important to check fonts carefully for fidelity, including looking up similar typefaces or using image analysis to find the font differences.
- Spacing and layout rhythm: frame size, crop, alignment, margins, padding, grid tracks, section gaps, component spacing, radii, shadows/elevation, and vertical rhythm.
- Colors and visual tokens: sampled or inferred palette, gradients, opacity, contrast, semantic state colors, foreground/background balance, and whether CSS tokens map to the source design.
- Image quality and asset fidelity: subject correctness, crop, scale, sharpness, compression, transparency halos, masking, background treatment, raster-vs-vector appropriateness, and whether generated assets match the source art direction. Fail QA if logos, illustrations, decorative marks, product imagery, non-standard icons, or other visible image assets from the visual target were replaced with custom inline SVG, handcrafted SVG, HTML elements, div/span shapes, CSS drawings, gradients, emoji, text glyphs, placeholder shapes, or code-native approximations.
- Copy and content of app-specific text

## Severity

- `P0`: Blocks core use, severe accessibility failure, broken layout, or impossible task.
- `P1`: Major design mismatch or usability regression likely to be noticed by users.
- `P2`: Moderate visual drift, inconsistent state, responsive issue, or fixable polish gap.
- `P3`: Minor refinement that improves fidelity but does not block acceptance.

## Output Format

Use this structure unless the user asks otherwise:

```markdown
# Design Critique Report

**Final Result**
final result: passed|blocked

**Overview**
Briefly state what was compared, the overall fidelity read, and the main issue
or reason the implementation is ready for handoff. Keep this to 2-4 sentences.

**Findings**
- [P1] Short issue title
  Location: screen/component/selector/file if known.
  Surface: typography|spacing/layout|colors/tokens|image/assets|copy/content|icons|states/interactions|responsiveness|accessibility|shortcut artifacts.
  Evidence: design does X, implementation does Y.
  Impact: why this matters.
  Recommendation: concrete design correction.
  Implementation notes: optional component/token/CSS/file guidance when known.
  Acceptance check: what must be true in the next render for this finding to be resolved.

**Open Questions**
- Any ambiguity about intentional deviations, unavailable states, or missing artifacts.

**Implementation Checklist**
- Ordered fixes derived from the findings that can be executed directly.

**Follow-up Polish**
- P3 refinements that can improve fidelity after handoff.

**QA Metadata**
- Mode: target comparison|single-surface critique
- Adversarial reviewer: used|not used
- Reviewer trigger or omitted reason:
- Reviewer evidence checked:
- Reviewer finding disposition:
- Source visual truth path, or none:
- Implementation screenshot path:
- Viewport:
- State:
- Theme/device/density:
- Full-view comparison evidence:
- Focused region comparison evidence, or why it was not needed:
- Patches made since the previous QA pass:

**Fidelity Surface Coverage**
- Fonts and typography:
- Spacing and layout rhythm:
- Colors and visual tokens:
- Image quality and asset fidelity:
- Copy and content:
- Icons:
- States and interactions:
- Responsiveness:
- Accessibility:
- Shortcut artifacts:

**Evidence Limits**
- Any evidence gaps that prevented a complete source-vs-render comparison.
```

If there are no substantive mismatches, say that clearly and list any residual test gaps.

When this skill is used before handoff, save the latest QA report as
`design-critique.md`. Follow the repository or current working directory's
standard convention for agent outputs or generated review artifacts when one is
discoverable. If no convention is discoverable, save to
`.agents/outputs/design-critique.md` under the active repository or current
working directory, never the project root.

`design-critique.md` must include:

- overview
- final result: passed or blocked
- findings with severity, affected fidelity surface, recommendation, and acceptance check
- open questions
- implementation checklist
- follow-up polish, when useful
- mode: target comparison or single-surface critique
- adversarial reviewer: used or not used
- reviewer trigger or omitted reason
- reviewer evidence checked
- reviewer finding disposition
- source visual truth path, or none
- implementation screenshot path
- viewport
- state
- full-view comparison evidence
- focused region comparison evidence, or why it was not needed
- patches made since the previous QA pass
- fidelity surface coverage
- evidence limits

Return the file path with the QA report.
