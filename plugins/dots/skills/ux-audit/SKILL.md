---
name: ux-audit
description: "Audits existing product flows, journeys, funnels, product areas, or multi-step experiences from evidence captured or inspected in the current run, producing step health and UX, design, and accessibility findings. Use for audit, critique, inspect, assess, or evaluate a live/current journey, onboarding, checkout, settings path, or workflow; not for code review, single-surface design critique, pre-handoff prototype QA, redesign ideation, or implementation critique."
---

# Audit

Use this skill when the user wants to audit or critique a product flow, journey,
funnel, onboarding path, checkout path, settings path, workflow, product area, or
other multi-step product experience.

The output is not a loose opinion. It is current evidence plus product-quality
judgment:

- captured screenshots or supplied artifacts saved or cited as evidence for the
  broader experience
- a numbered step list with a health label for each step
- UX, design, and accessibility findings tied to steps or screenshots
- severity, affected surface, evidence, impact, recommendation, and acceptance
  check for each substantive finding
- system-quality themes across the flow
- clear limits on what could not be checked from the captured evidence

## Grounding

Use saved product URLs, screenshots, reference images, codebase paths,
Storybook, tokens, design systems, brand assets, component refs, browser
preferences, and share targets as grounding material when relevant.

Do not inspect every saved reference. Inspect only what the current task needs.
Use references to calibrate product type, user context, personality, and system
constraints; do not copy competitors or turn references into generic taste
claims.

For this skill, current-run evidence includes references, code, tokens,
analytics, user-provided artifacts, or other materials only after they are
explicitly opened, inspected, and recorded during this audit run.

## Audit Mode

Choose one audit mode before routing:

- `UX audit`: user goal, task entry, information architecture, interaction flow,
  hierarchy, trust, copy, state coverage, consistency, and product quality.
- `Accessibility audit`: perceivable content, semantics, keyboard and focus,
  target size, labels, errors, motion, reflow, and assistive-technology risks.
- `Combined audit`: both UX and accessibility when the user asks for both, the
  experience is high-stakes, or accessibility risks are visible during a UX
  audit.

Keep the scope separate from the mode: the evidence may come from a live flow,
product area, supplied screenshots, or static artifacts, but it must represent a
broader experience or multi-step flow.

For a single supplied screenshot, mockup, generated image, component, modal,
state, or static artifact judged as one visible surface, use
[design-critique](../design-critique/SKILL.md). Use this skill only when the
provided artifacts stand in for a broader experience or flow.

Use [design-critique](../design-critique/SKILL.md) for agent self-review,
single-surface design critique, and pre-handoff fidelity critique of a rendered
artifact, with or without an approved visual target. Use
[visual-design](../visual-design/SKILL.md) for redesign ideation, design
direction, or front-end implementation. Keep generated artifact handling here
only when the artifacts represent the broader product experience being audited.

When this audit's confirmed findings call for a redesign or fix, hand them to
[visual-design](../visual-design/SKILL.md) to implement, which then re-runs
[design-critique](../design-critique/SKILL.md) before handoff. ux-audit
evaluates; it does not implement the fix itself.

## Route

Before auditing:

1. Identify the audit mode: `UX audit`, `Accessibility audit`, or
   `Combined audit`.
2. Identify the product or experience.
3. Identify the flow, journey, workflow, product area, or task.
4. Identify the core user task.
5. Identify the smallest useful outcome for that task.
6. Identify the product type and primary user role or context when known.
7. Identify whether saved output is required.
8. Choose the capture or inspection tool.
9. Capture or inspect the evidence.
10. Save or cite, inspect, and annotate each accepted artifact.

Destination rules:

- If the user names a local folder or asks for a saved audit, use that folder
  or create a local audit folder under the project or artifact workspace.
- For live-flow audits that require newly captured screenshots, save screenshots
  and notes under `.agents/outputs/ux-audit/` when working in a project
  directory, unless the user gave another destination. If that convention is not
  available, create a clearly named audit folder in the current working
  directory.
- For quick critiques or provided-artifact audits where the user did not ask for
  saved output, answer in chat and name the evidence limits instead of creating
  files by default.

Capture rules:

- Use the in-app browser when available for web flows.
- Use Chrome when existing logged-in browser state, cookies, or extensions are
  required.
- Use Computer Use for native apps or app UI that cannot be captured through a
  browser.
- For provided artifacts, inspect the supplied file or image directly.
- If none of those can complete the capture, ask for another approved validation surface.
- If none of those can capture valid screenshots or control the flow, stop and report the blocker.

Side-effect gates:

- Stop before login, credential entry, payment, purchase, PII entry, account
  changes, destructive settings, consent changes, sends/posts, external writes,
  or any irreversible action unless the user already approved that exact action
  or the target is clearly a test environment.
- If a blocked side-effect step is required, capture the state before the action
  and report the blocker, expected next evidence, and safe way to continue.

Browser capture order:

1. Load the Browser skill before browser work.
2. Connect to the browser and use the current tab when it already shows the target.
3. Do not reload or navigate away unless the audit needs a fresh start.
4. Observe the visible state before acting.
5. Before each click, type, or key press, use the latest DOM snapshot to target one clear control.
6. After each action, take the cheapest fresh check that proves what changed: DOM for structure, screenshot for visual state.
7. Save and inspect the accepted screenshot before using it as audit evidence.

Evidence rules:

- Use only evidence captured or explicitly inspected in the current audit run.
- Do not use memory, prior chats, old traces, cached screenshots, or prior generated artifacts as audit evidence unless the user explicitly provides them.
- Do not audit a live flow until the product, flow, destination, and capture
  tool are known. For static artifacts, record unknown fields and proceed only
  within the visible evidence.
- Do not claim full accessibility compliance from screenshots alone.

## Capture Or Inspect The Evidence

For each live-flow step, capture what the user sees, observe how the screen
behaves, inspect the screenshot, and write audit notes before moving on. For
each provided artifact or static state, inspect the supplied evidence directly
and write bounded notes without inventing a missing flow.

Follow [references/design-audit-framework.md](references/design-audit-framework.md) when deciding what to inspect and how to describe strengths, UX issues, accessibility risks, limits, and recommendations.

Audit structure before style:

1. First evaluate task flow, orientation, hierarchy, grouping, spacing,
   contrast, readability, feedback, and state clarity.
2. Then evaluate color, imagery, depth, decoration, personality, polish, and
   distinctiveness.
3. Keep design findings criterion-specific. Name the evaluated dimension rather
   than saying only that the design is weak.

For every live-flow step or static artifact state:

1. Move to the next step in the requested flow, or select the supplied artifact
   or visible state being audited.
2. Wait until any live screen is loaded and visually stable.
3. Check for loading spinners, blank areas, login walls, error pages, blocked states, cookie dialogs, and half-rendered content when those states can apply.
4. Capture the live screenshot, or inspect the provided artifact directly.
5. Inspect the screenshot or artifact before accepting it as evidence. Use the
   screenshot you actually saw; if a saved file shows the wrong window, wrong
   state, blank page, crop, or loading screen, reject it and capture again.
6. Save the exact accepted screenshot to the local audit folder when live
   capture or saved output is required.
7. Observe behavior that matters for the audit when interaction evidence is
   available, such as navigation, focus, loading, validation, error handling,
   empty states, motion, and whether the next action is clear.
8. Write notes for that step.
9. In the notes, include:
   - step health: `good`, `mixed`, `poor`, or `blocked`
   - primary action or main user decision
   - visible strengths worth preserving
   - findings with `severity`, `surface`, `evidence`, `impact`,
     `recommendation`, `acceptance check`, and `verification needed`
   - confidence when the judgment is aesthetic, generated, soft, or
     evidence-limited
   - evidence limits that made the step difficult to audit
10. Use numbered screenshot names, such as `01-start.png`,
   `02-form-filled.png`, and `03-confirmation.png`, when files are saved.
11. Add notes for that step or artifact state to the local audit notes, saved
    report, or working answer immediately.

Classify each finding with the most specific relevant surface from the framework
reference. Do not print the whole lens inventory in notes; use it to ensure the
audit does not miss important UX, design, accessibility, state, responsive,
trust, or generated-design issues.

For generated screens, mockups, or graphics that are in scope, check prompt or
brief fidelity, spatial accuracy, color accuracy, text and typography rendering
accuracy, and hallucination severity. When comparing generated alternatives,
evaluate one criterion at a time using a brief, criterion, rubric, question,
short reasoning, and structured verdict. When auditing one product surface,
adapt the same criterion/rubric pattern into findings instead of forcing an A/B
verdict.

For accessibility audits, combined audits, or suspected `P0`/`P1` accessibility
risks, attempt DOM/accessibility-tree inspection and keyboard interaction probes
when the capture tool supports them. At minimum, test visible focus, tab order
through the critical path, form labels/errors, modal escape and focus
containment, target size, text zoom/reflow where feasible, and contrast by
sampling or code when making contrast claims. If those probes cannot be run,
downgrade the claim to `Likely` or `Needs testing` and name the missing probe.

If the destination is a local folder:

- Save screenshots or provided-artifact copies in that folder.
- Save the notes in a file that can be shared at the end.

After step notes, add a system-quality pass that summarizes cross-step
patterns:

- hierarchy and density
- interaction and state feedback
- typography and content
- color, tokens, and materials
- responsiveness and performance feel
- accessibility
- product fit and system consistency
- product idea, visual unity, and template-like output risk when evidenced

Split recommendations into `Ship-now fixes` and `Later polish` when both are
present. Do not invent speculative features unless they directly unblock the
core user task. Preserve strong non-obvious interface decisions in a `Strong
decisions to preserve` section when useful.

Acceptance checks:

- Every important step or artifact state has valid evidence or a named blocker.
- Screenshots or artifacts are saved or cited in order.
- Live screenshots are the exact captured state and are inspected before use.
- Notes point to the screenshot, step, or artifact state they describe.
- Substantive findings follow the anatomy in the framework reference, including
  confidence for generated-design, aesthetic, mood/tone, brand-fit, and
  evidence-limited claims.
- Every `P0` or `P1` has a stronger verification plan, including the available
  interaction, DOM, accessibility-tree, code, or testing probe, or the reason
  that probe could not be performed.
- Likely accessibility, color, contrast, keyboard, semantic, or token claims are
  marked as likely unless measured through DOM, code, color sampling, or live
  interaction evidence.
- System or design-token claims say whether they are screenshot-visible or need
  source inspection.
- The final evidence set and notes are enough to support the requested audit.

Blockers:

- The flow cannot be completed.
- A required step cannot be screenshotted.
- The source changes in a way that makes the flow unclear.
- Screenshots cannot be saved.
- Notes cannot be written.
- The requested claim would require evidence that screenshots cannot provide.
- A side-effect gate is required and the user has not approved it.

## Final Response

After evidence is captured or inspected and notes are written, list every step
or artifact state in the final response.

The final step or artifact-state list must include:

- step number
- short description of the step
- general health of that step
- strongest `P0`, `P1`, or `P2` theme when present

Also include:

- the highest-impact `P0`, `P1`, and `P2` findings, if any
- the top ship-now fixes
- the strongest system-quality themes, including product-idea or template-like
  output risk when those are among the highest-impact issues
- the most important evidence limits or verification gaps
- where the full output was saved, or that the audit was chat-only because no
  saved output was requested

Keep the language direct. Do not use broad design jargon when a plain phrase works.
