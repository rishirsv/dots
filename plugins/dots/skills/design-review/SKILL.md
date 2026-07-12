---
name: design-review
description: "Independently reviews product UI, UX, accessibility, motion, and animation code. Use for design critique, experience audits, motion interaction review, animation diff review, or a codebase motion audit; not for general code review, redesign, implementation, or routine build self-checks."
---

# Design Review

Review existing or rendered product UI, user journeys, live or recorded motion,
and animation code. The output is not a loose opinion: it is current evidence
plus product-quality judgment, with severity, evidence, impact, recommendation,
and an acceptance check for every substantive finding.

## Design Constitution

Use the eight principles below as judgment prompts. In a focused critique,
mention only principles that explain a material finding or strength. In a full
acceptance review or experience audit, score each evidenced principle `0`
(missing or contradicted), `1` (mixed), or `2` (strongly evidenced); mark the
rest `not evidenced` and exclude them from the denominator. Report `/16` only
when all eight are evidenced.

These principles are platform-general. Platform examples illustrate the rule;
they do not impose that platform's conventions elsewhere. Use these as the
names you reason with:

1. **Purpose.** Make with intention; decide what *not* to build. Every feature asks for the user's time, attention, and trust — spend that budget only where it pays off.
2. **Agency.** Keep people in control: offer choices, don't force a single path. Back it with forgiveness — easy undo for slips, a confirmation dialog only for genuinely destructive, irreversible actions (use sparingly; overusing it trains people to click through).
3. **Responsibility.** Act in the user's interest. Privacy: ask at the right moment, only for what's needed, transparently. Safety: anticipate misuse and harm — especially with AI (an allergy-aware recipe app must not suggest a harmful ingredient). Add previews, confirmations, disclaimers; cut a feature whose risk outweighs its value.
4. **Familiarity.** Build on what people already know. Use metaphors that are neither too literal nor too abstract (a trash can means delete), and honor their physics. Be consistent: things that look the same must behave the same and live in the same place (close is always top-left on macOS) so people can predict what happens next. Only break a familiar pattern if you can prove it's better — then test it, don't assume.
5. **Flexibility.** Design for different contexts, devices, and the full range of abilities. Adapt to the platform (iPhone = quick touch; desktop = deep workflows with precise pointer control) and to the situation. Design inclusively (age, language, expertise, accessibility). When no single layout fits everyone, let people personalize — rearrange controls, hide what they don't use.
6. **Simplicity — not minimalism.** Strip the unnecessary so the core purpose shines; burying everything in one place looks minimal but isn't simple. Be concise (plain language, no jargon, fewer steps) and clear (use hierarchy — order, spacing, contrast — so the most important thing is the most obvious). Every element earns its place; sometimes *adding* context simplifies (a video scrubber that shows time remaining). Show the common path first, advanced options one level deeper.
7. **Craft.** Uncompromising attention to detail builds trust. Beautiful typography, colors that adapt to light/dark, clear iconography, and responsive animations that give immediate, natural feedback. Nothing is random — every spacing, timing, and alignment value is a deliberate choice you can defend. Jittery scroll, misaligned icons, and layouts that break on rotation read as carelessness. Craft needs iteration and longevity — keep evolving the design as features and hardware change.
8. **Delight.** The result of getting the other seven right, not confetti tacked on top. Decide the emotion you want people to feel (calm, confident, excited) and reinforce it in every decision.

Tactical rules that serve these:

- **Feedback comes in four kinds:** status, completion, warning, error. Confirm meaningful actions, expose ongoing status, warn before problems, validate inline (not on submit).
- **Wayfinding.** Every screen should answer: Where am I? Where can I go? What's there? How do I get out? Never trap the user.
- **Grouping & mapping.** Proximity implies relationship; place a control near what it affects and arrange controls to mirror what they change. If you need a label to explain a control, the mapping is weak.
- **Direct, specific labels beat safe generic ones.** Name nav items for their contents ("Progress", "Library"), not vague umbrellas ("Home"). Specificity creates predictability.

Use these native-feel questions as evidence prompts behind the score:

- Does it exhibit clarity?
- Does it defer to content?
- Does depth communicate hierarchy?
- Does feedback happen immediately?
- Is the interaction direct?
- Does it preserve user control?
- Is it internally consistent?
- Does the visual treatment fit the product?

Two paths share this skill's evidence rules, severity scale, finding anatomy,
and reviewer protocol:

- **Surface critique**: one rendered artifact, screen, component, or surface,
  compared against an approved visual target when one exists. A focused
  critique returns the strongest findings; a full acceptance review ends in a
  pass/block decision.
- **Experience audit**: a multi-step journey, funnel, onboarding path, checkout path,
  settings path, workflow, or product area. Ends in a numbered step list with
  health labels plus UX, design, and accessibility findings.
- **Motion interaction review**: live UI or a recording, judged for purpose,
  timing, easing, physicality, interruption, continuity, gesture response,
  performance, accessibility, and cohesion.
- **Motion diff review**: changed animation and interaction code, judged against
  the motion standards with `file:line` evidence and an explicit approve/block
  verdict.
- **Motion codebase audit**: a source-wide survey of animation and motion code,
  prioritized by leverage, with implementation-ready plans when requested.

This skill evaluates; it does not implement fixes. Animation and interaction
code are the narrow exception to the general code-review exclusion. Route
general code review elsewhere. Route build, redesign, or
polish work to [design](../design/SKILL.md). Routine build self-checks stay in
Design; use this independent review for target-driven, acceptance-critical,
externally shipped, brand- or accessibility-sensitive work, or when the user
asks for it. When invoked as a full gate, this skill owns the comparison method,
severity, and pass/block decision.

## Choose The Path

- One rendered artifact, screen, component, modal, state, or static mockup
  judged as one visible surface → surface critique.
- A journey, funnel, product area, or any multi-step experience → experience audit.
- Supplied screenshots or artifacts that stand in for a broader experience →
  experience audit.
- A single supplied screenshot judged on its own terms → surface critique.
- A full pre-handoff fidelity check against an accepted target → surface
  critique with a pass/block decision.
- Both requested (audit a flow and gate one screen) → run each path on its own
  scope and keep the outputs separate.
- Live UI or a recording where timing, easing, gesture behavior, interruption,
  or motion feel is the subject → motion interaction review.
- A diff, pull request, or changed files where animation and interaction code is
  the subject → motion diff review.
- A repository or product area whose motion system should be surveyed and
  prioritized → motion codebase audit.

When motion, gesture behavior, haptic feedback, or animation code is in scope,
read [references/motion-audit.md](references/motion-audit.md). Require dynamic
interaction evidence for claims about timing, easing, interruption, velocity
continuity, gesture response, haptic synchronization, dropped frames, or feel.
A source-only review may identify implementation risks, but must label claims
that require playback as `Needs testing`.

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

Capture evidence per the shared
[visual-proof checklist](../../references/visual-proof.md) (tool order,
`file://` fallback, wrong-tab check, viewports).

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
- Source code can establish implementation facts such as `transition: all`, an
  `ease-in` curve, missing reduced-motion handling, or keyframes on rapidly
  triggered UI. It cannot establish how motion feels, whether frames drop in
  practice, or whether a gesture remains continuous under interruption.

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
  wrong-action risk likely to affect users; generic or template-like output
  that makes the surface unsuitable for the product, brand, portfolio, or
  client-ready handoff.
- `P2`: moderate friction, visual drift, unclear state, inconsistent system,
  responsive issue, safe-but-plain default, insufficient subject specificity,
  or fixable polish gap that degrades confidence.
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
  states/interactions, responsiveness, accessibility, or specificity/product fit
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
captured evidence and merge only findings that hold up. If subagents are
unavailable, the task is too small to justify one, or the reviewer did not
inspect the required evidence, proceed directly and note the omitted reason
when that matters to confidence.

## Output Destinations

Answer in chat by default. Save a report only when the user asks for one or an
established workflow explicitly requires a durable artifact. When saving,
follow the named destination or repository convention; otherwise use
`.agents/outputs/`, never the project root. Save screenshots only when they are
needed as durable evidence, using numbered names for flow steps.

## Surface Critique

A complete target comparison requires both a source visual target (image,
screenshot, mockup, design board, or source capture) and a rendered
implementation (local URL, deployed URL, app screen, component, or screenshot).
Single-surface critique without a source target requires a rendered
implementation plus any available brief, spec, prompt, or acceptance criteria.
If required evidence cannot be opened, captured, or compared, report `blocked`
and name the missing evidence. Do not create a file unless saved output was
requested, and do not claim a complete comparison.

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
   [references/design-rubric.md](references/design-rubric.md) when the pass
   spans more than a quick visual check. Always cover the five required
   fidelity surfaces — fonts/typography, spacing/layout rhythm, colors/tokens,
   image quality/asset fidelity, and copy/content — even when the user did not
   name them. Check fonts closely: compare families, weights, and spacing
   against the target, using image analysis or typeface lookup when needed.
   If the target itself has a gap (for example a missing null state), record it
   as a separate finding against the target.
6. Lead with the result, then findings ordered by severity, evidence limits,
   and an implementation checklist when useful. Use the compact template in
   [references/design-rubric.md](references/design-rubric.md) for a saved full
   review. Include exact CSS/component/token suggestions when implementation
   context is available.

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

## Experience Audit

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

Follow [references/experience-audit.md](references/experience-audit.md) for
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
5. Write a concise step note immediately: step health (`good`, `mixed`, `poor`,
   or `blocked`), what the user sees, how the state affects the core task, what
   to preserve, and the main risk or next check. Put substantive issues in the
   shared finding anatomy.

For accessibility or combined audits, or suspected `P0`/`P1` accessibility
risks, attempt DOM/accessibility-tree inspection and keyboard probes when the
capture tool supports them: visible focus, tab order through the critical
path, form labels and errors, modal escape and focus containment, target size,
text zoom/reflow where feasible, and contrast by sampling or code. If a probe
cannot run, downgrade the claim to `Likely` or `Needs testing` and name the
missing probe.

Saved audit reports are reader-facing. Open with the verdict, scope, and
top findings — not grounding notes, provenance, tool logs, or exhaustive
screenshot inventories. Include only evidence paths the reader needs to verify
a claim. Use the report order and
structures in [references/experience-audit.md](references/experience-audit.md),
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

## Motion Review

Read [references/motion-audit.md](references/motion-audit.md) and choose one
scope before reviewing:

- `interaction`: inspect live UI or a recording
- `diff`: inspect only changed animation and interaction code
- `codebase`: survey the repository's motion system and highest-leverage fixes

For an interaction review, capture the behavior dynamically and report findings
through the shared finding anatomy. A still screenshot can support visual
findings but cannot establish timing, easing, interruption, velocity continuity,
gesture response, haptic synchronization, or dropped frames.

For a diff review, re-read every cited change yourself. Return one findings
table with `file:line`, current code or behavior, exact correction, why it
matters, and the verification or feel check. Close with `Approve` when no
feel-breaking regression or blocking implementation defect remains; otherwise
close with `Block`.

For a codebase audit, map the motion stack, conventions, and frequency before
judging it. Present vetted findings ordered by leverage (impact divided by
effort), then a short list of missed opportunities. When the user requests
plans, make each one self-contained: exact paths and current excerpts, target
values, repository conventions, ordered steps, scope boundaries, mechanical
verification, and a concrete feel check. Do not modify product source in this
review skill.

When the motion is already right, say so plainly. A positive-null result is
better than padded findings.

## Final Response

Lead with the outcome, then support it:

- Surface critique: the result, what was compared, the highest-impact findings,
  the implementation checklist when useful, evidence limits, and the report
  path only when one was saved.
- Flow audit: every step or artifact state with its number, short description,
  health, and strongest `P0`-`P2` theme when present; then the highest-impact
  findings, top ship-now fixes, the strongest system-quality themes, the most
  important evidence limits, and where output was saved — or that the audit was
  chat-only because no saved output was requested.
- Motion interaction review: verdict, strongest evidenced findings, concrete
  corrections, and the dynamic states or devices still needing verification.
- Motion diff review: findings table followed by an explicit `Approve` or
  `Block` verdict.
- Motion codebase audit: prioritized findings, missed opportunities, smallest
  recommended change set, and implementation-ready plans only when requested.

Keep the language direct. Do not use broad design jargon when a plain phrase
works.
