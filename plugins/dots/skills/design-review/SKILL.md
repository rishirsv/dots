---
name: design-review
description: "Reviews existing or rendered product UI from current-run evidence along two paths: surface critique of one rendered artifact, screen, or component (self-review, pre-handoff QA, comparison against an approved visual target) and flow audit of a multi-step journey, funnel, onboarding, or settings path (step health plus UX, design, and accessibility findings). Use for design critique, UX audit, or inspect/assess/evaluate requests; not for code review, redesign ideation, or implementation."
---

# Design Review

Review existing or rendered product UI from evidence captured or inspected in
the current run. The output is not a loose opinion: it is current evidence plus
product-quality judgment, with severity, evidence, impact, recommendation, and
an acceptance check for every substantive finding.

Two paths share this skill's evidence rules, severity scale, finding anatomy,
and reviewer protocol:

- **Surface critique**: one rendered artifact, screen, component, or surface.
  Agent self-review, pre-handoff QA, and focused design critique, compared
  against an approved visual target when one exists. Ends in a pass/block gate
  decision. Use this before every visual-design build handoff.
- **Flow audit**: a multi-step journey, funnel, onboarding path, checkout path,
  settings path, workflow, or product area. Ends in a numbered step list with
  health labels plus UX, design, and accessibility findings.

This skill evaluates; it does not implement fixes. Route build, redesign, or
polish work to [visual-design](../visual-design/SKILL.md), which re-enters this
skill's surface path as its blocking pre-handoff gate. This skill owns the
comparison method, the fidelity surfaces, the severity scale, and the
pass/block decision; build skills invoke it as a gate and do not restate the
rubric.

## Choose The Path

- One rendered artifact, screen, component, modal, state, or static mockup
  judged as one visible surface → surface critique.
- A journey, funnel, product area, or any multi-step experience → flow audit.
- Supplied screenshots or artifacts that stand in for a broader experience →
  flow audit.
- A single supplied screenshot judged on its own terms → surface critique.
- A pre-handoff fidelity check against an accepted target → surface critique.
- Both requested (audit a flow and gate one screen) → run each path on its own
  scope and keep the outputs separate.

## Grounding

Use saved product URLs, screenshots, reference images, codebase paths,
Storybook, tokens, design systems, brand assets, component refs, browser
preferences, accepted briefs, and share targets as grounding material when
relevant. Inspect only what the current task needs; use references to calibrate
product type, user context, personality, and system constraints. Do not copy
competitors or turn references into generic taste claims.

Do not introduce a new design direction during review. Evaluate the rendered
work against the intended design, the accepted brief, and the quality bar for
its scope.

## Evidence Rules

- Use only evidence captured or explicitly opened, inspected, and recorded in
  the current run. Do not use memory, prior chats, old traces, cached
  screenshots, or prior generated artifacts unless the user explicitly provides
  them.
- Do not write the review from memory, code, or file paths alone. Open or
  capture the rendered implementation first; open or capture the source design
  when one exists. Judge what is actually visible.
- Inspect every screenshot before accepting it as evidence. If a saved file
  shows the wrong window, wrong state, blank page, crop, or loading screen,
  reject it and capture again.
- Do not claim more than the evidence supports: no full accessibility
  compliance from screenshots alone, and no source-vs-render fidelity claims
  without a source visual target.

## Capture

Tool choice:

- Use the runtime's browser tooling for web surfaces, loading the browser skill
  first when the runtime provides one.
- Use Chrome when existing logged-in browser state, cookies, or extensions are
  required.
- Use computer-control tooling for native apps or UI that cannot be captured
  through a browser.
- For provided artifacts, inspect the supplied file or image directly.
- If none of those can capture valid evidence or control the flow, stop and
  report the blocker, or ask for another approved validation surface.

Browser capture order:

1. Connect to the browser and use the current tab when it already shows the
   target; do not reload or navigate away unless a fresh start is needed.
2. Observe the visible state before acting.
3. Before each click, type, or key press, use the latest DOM snapshot to target
   one clear control.
4. After each action, take the cheapest fresh check that proves what changed:
   DOM for structure, screenshot for visual state.
5. Save and inspect the accepted screenshot before using it as evidence.

Side-effect gates:

- Stop before login, credential entry, payment, purchase, PII entry, account
  changes, destructive settings, consent changes, sends/posts, external writes,
  or any irreversible action unless the user already approved that exact action
  or the target is clearly a test environment.
- If a blocked side-effect step is required, capture the state before the
  action and report the blocker, the expected next evidence, and the safe way
  to continue.

## Severity

- `P0`: blocks core use or task completion, severe accessibility barrier,
  broken layout, destructive-mistake risk, or privacy/security trust break.
- `P1`: major design mismatch, comprehension, hierarchy, feedback, or
  wrong-action risk likely to affect users.
- `P2`: moderate friction, visual drift, unclear state, inconsistent system,
  responsive issue, or fixable polish gap that degrades confidence.
- `P3`: minor refinement that improves quality or fidelity but does not block
  use or acceptance.

Separate structural issues from polish issues, and objective mismatches from
subjective recommendations. Craft issues can be `P1` when they hide primary
content, make destructive action too easy, make text unreadable, break
responsive use, or prevent users from understanding state.

## Finding Anatomy

Each substantive finding includes:

- severity
- location: step, screenshot, screen, component, selector, or file if known
- surface: the most specific affected dimension, such as typography,
  spacing/layout, colors/tokens, image/assets, copy/content, icons,
  states/interactions, responsiveness, or accessibility
- evidence: what the design or flow does vs what the implementation shows
- impact: why it matters
- recommendation: the concrete correction, kept with the finding rather than in
  a separate section
- acceptance check: what must be true in the next render or step for the
  finding to be resolved
- verification needed, when the claim requires interaction, DOM, code,
  assistive technology, analytics, or user testing
- confidence, when the judgment is aesthetic, generated, soft, or
  evidence-limited

Distinguish drift from intentional product or code constraints. If a deviation
may be intentional, phrase it as a question or assumption.

## Adversarial Reviewer

Direct review is acceptable for ordinary checks. Prefer an independent
adversarial reviewer when the implementation author is reviewing their own
work, the surface or flow is externally shipped, revenue-critical,
accessibility-sensitive, brand-critical, acceptance-blocking, the user asks for
a second opinion, or the decision feels close.

When a trigger applies and the runtime offers subagents, launch one adversarial
reviewer before writing the final report. Give the reviewer exact paths or
pasted excerpts for: this skill's instructions, the active path's reference
file, the source visual target if one exists, the captured evidence, the brief
or acceptance criteria, and the mode. Ask it to find the strongest real
fidelity, usability, accessibility, polish, and evidence gaps that could change
the outcome, citing visible evidence and returning ranked findings in the
anatomy above. The reviewer does not edit files, write the final report, or
decide alone; require it to state which skill, rubric, target, and evidence it
inspected.

The parent agent owns the final review: verify reviewer findings against the
captured evidence, merge only findings that hold up, and record the reviewer
trigger and finding disposition in the saved report. If subagents are
unavailable, the task is too small to justify one, or the reviewer did not
inspect the required evidence, proceed directly and note the omitted reason
when that matters to confidence.

## Output Destinations

- If the user names a destination or asks for saved output, use it.
- Otherwise follow the repository or working directory's convention for agent
  outputs when one is discoverable; if none is, save under `.agents/outputs/`
  in the active repository or working directory, never the project root.
- Surface critique saves `design-review.md`. Flow audits that captured new
  screenshots save them with numbered names (`01-start.png`,
  `02-form-filled.png`) plus `audit.md` in a `design-review/` audit folder.
- For quick critiques or provided-artifact reviews where the user did not ask
  for saved output, answer in chat and name the evidence limits instead of
  creating files by default.

## Surface Critique

A complete target comparison requires both a source visual target (image,
screenshot, mockup, design board, or source capture) and a rendered
implementation (local URL, deployed URL, app screen, component, or screenshot).
Single-surface critique without a source target requires a rendered
implementation plus any available brief, spec, prompt, or acceptance criteria.
If required evidence cannot be opened, captured, or compared, write
`design-review.md` with an evidence-limits section naming the missing evidence
and report `blocked`; do not claim a complete comparison.

1. Identify the mode: target comparison or single-surface critique. For target
   comparison, match the same viewport, state, theme, device density, route,
   content, auth state, and interaction state before judging; if the artifacts
   do not represent the same state, call that out first and avoid false
   precision.
2. Capture evidence at the intended viewport, adding states that matter:
   mobile/desktop, hover/focus/active, empty/loading/error, dark/light, and key
   responsive breakpoints. Save screenshot paths so findings can cite evidence.
3. Normalize before comparing: align crop, viewport size, scale, and device
   frame, and prefer content regions over browser chrome. For target
   comparison, separate image views are not a comparison — put the source image
   and the implementation screenshot together in the same comparison input and
   judge the visible differences from that combined input.
4. Compare at the right level: a full-view pass for composition, hierarchy,
   layout, density, and responsive structure, then focused region comparisons
   wherever fidelity depends on precise typography, alignment, imagery, assets,
   icons, controls, forms, dense UI, or interaction states. If no focused
   region is needed, say why in the report. Do not treat the critique as
   complete from a full-view pass alone when important details are not clearly
   readable.
5. Review systematically with
   [references/surface-rubric.md](references/surface-rubric.md) when the pass
   spans more than a quick visual check. Always cover the five required
   fidelity surfaces — fonts/typography, spacing/layout rhythm, colors/tokens,
   image quality/asset fidelity, and copy/content — even when the user did not
   name them. Check fonts closely: compare families, weights, and spacing
   against the target, using image analysis or typeface lookup when needed.
   If the target itself has a gap (for example a missing null state), record it
   as a separate finding against the target.
6. Write the report using the template in
   [references/surface-rubric.md](references/surface-rubric.md): overview,
   `final result` near the top, findings ordered by severity with the full
   anatomy, open questions, an implementation checklist, follow-up polish,
   review metadata, fidelity surface coverage, and evidence limits. Include
   exact CSS/component/token suggestions when the implementation context is
   available.

Pass / block:

- `final result: passed` when the rendered artifact is ready for handoff and
  every remaining difference is explicitly classified as acceptable, expected,
  or non-blocking polish.
- `final result: blocked` when required evidence is missing, the implementation
  cannot be inspected, fidelity cannot be judged for a target comparison, a
  required fidelity surface has unresolved issues, or any `P0`/`P1` finding
  remains.
- `P2` findings block only when they affect the stated acceptance bar, target
  fidelity, usability of the surface, or responsive quality. `P3` findings are
  follow-up polish unless the user set a stricter bar.

Do not say a design matches or is done until the required fidelity surfaces
have been checked and remaining differences are classified.

## Flow Audit

Choose one audit mode before capturing:

- `UX audit`: user goal, task entry, information architecture, interaction
  flow, hierarchy, trust, copy, state coverage, consistency, and product
  quality.
- `Accessibility audit`: perceivable content, semantics, keyboard and focus,
  target size, labels, errors, motion, reflow, and assistive-technology risks.
- `Combined audit`: both, when the user asks for both, the experience is
  high-stakes, or accessibility risks surface during a UX audit.

Then record the scope before judging: the product, the flow or product area,
the core user task, the smallest useful outcome, the product type and user
role when known, whether saved output is required, and the capture tool. Do not
audit a live flow until those are known; for static artifacts, record unknown
fields and stay within the visible evidence.

Follow [references/flow-framework.md](references/flow-framework.md) for
product-type calibration, coverage lenses, craft heuristics, confidence
language, generated-design fidelity checks, and the report structures.

Audit structure before style: first task flow, orientation, hierarchy,
grouping, spacing, contrast, readability, feedback, and state clarity; then
color, imagery, depth, decoration, personality, polish, and distinctiveness.
Name the evaluated dimension in each finding rather than saying the design is
weak.

For every live-flow step or artifact state:

1. Move to the next step in the flow, or select the supplied artifact or state.
2. Wait until any live screen is loaded and visually stable, checking for
   spinners, blank areas, login walls, error pages, cookie dialogs, and
   half-rendered content.
3. Capture the screenshot or inspect the provided artifact, accept it only
   after inspection, and save it to the audit folder when saved output is
   required.
4. Observe behavior that matters when interaction evidence is available:
   navigation, focus, loading, validation, error handling, empty states,
   motion, and whether the next action is clear.
5. Write step notes immediately: step health (`good`, `mixed`, `poor`, or
   `blocked`), 3-5 concise sentences of judgment covering what the user sees,
   why the state helps or hurts the core task, what to preserve, and the main
   risk or next check, the primary action or decision, visible strengths, and
   findings in the shared anatomy.

For accessibility or combined audits, or suspected `P0`/`P1` accessibility
risks, attempt DOM/accessibility-tree inspection and keyboard probes when the
capture tool supports them: visible focus, tab order through the critical
path, form labels and errors, modal escape and focus containment, target size,
text zoom/reflow where feasible, and contrast by sampling or code. If a probe
cannot run, downgrade the claim to `Likely` or `Needs testing` and name the
missing probe.

Saved `audit.md` reports are reader-facing. Open with the verdict, scope, and
top findings — not grounding, provenance, tool logs, or screenshot inventories;
those belong in an evidence appendix at the bottom. Use the report order and
structures in [references/flow-framework.md](references/flow-framework.md),
including the cross-step system-quality pass and the `Ship-now fixes` /
`Later polish` split.

Acceptance checks before reporting:

- Every important step or artifact state has valid evidence or a named blocker.
- Screenshots or artifacts are saved or cited in order, and notes point to the
  evidence they describe.
- Every `P0` or `P1` has a stronger verification plan — the available
  interaction, DOM, accessibility-tree, code, or testing probe — or the reason
  it could not be performed.
- Accessibility, color, contrast, keyboard, semantic, or token claims are
  marked as likely unless measured, and system/token claims say whether they
  are screenshot-visible or need source inspection.

Report a blocker instead of a finished audit when the flow cannot be completed,
a required step cannot be captured, the source changes mid-audit, output cannot
be saved, the requested claim needs evidence screenshots cannot provide, or a
side-effect gate is unapproved.

## Final Response

Lead with the outcome, then support it:

- Surface critique: the `final result`, what was compared, the highest-impact
  findings, the implementation checklist, evidence limits, and the saved report
  path.
- Flow audit: every step or artifact state with its number, short description,
  health, and strongest `P0`-`P2` theme when present; then the highest-impact
  findings, top ship-now fixes, the strongest system-quality themes, the most
  important evidence limits, and where output was saved — or that the audit was
  chat-only because no saved output was requested.

Keep the language direct. Do not use broad design jargon when a plain phrase
works.
