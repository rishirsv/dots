# Design Audit Framework

Use this structure for `ux-audit`. The framework turns captured screenshots and
interaction observations into product-quality findings. It is not a substitute
for user research, analytics, code inspection, or a full accessibility audit.

## Audit Contract

Start each audit by recording:

- Product/surface
- Flow/task
- Core user task
- Smallest useful outcome
- User role/context, when known
- Product type
- Evidence sources
- Evidence limits

Product type matters. A dense operations tool, AI workbench, dashboard,
consumer landing page, game, portfolio, and checkout flow should not be judged
with the same density, expression, or interaction expectations.

## Evidence Tiers

Use the strongest tier actually observed. Do not promote a claim beyond its
evidence.

- `T0`: screenshot-visible observation
- `T1`: DOM or accessibility-tree observation
- `T2`: live interaction probe
- `T3`: code, design-system, token, or source inspection
- `T4`: analytics, session replay, support tickets, or user testing

Examples:

- A low-contrast-looking label from a screenshot is a `T0` likely contrast risk.
- A measured color pair from code or sampling is a `T3` contrast finding.
- A missing focus style after keyboard probing is a `T2` keyboard finding.
- A confusing IA pattern confirmed by user testing is a `T4` comprehension
  finding.

## Audit Modes

Choose one base mode:

- `Live flow`: task path, friction, orientation, state, copy, and decision
  confidence across a captured journey.
- `Bounded screen`: one visible screen, modal, state, or component surface.
- `Provided artifact`: one supplied screenshot, mockup, generated image, static
  artifact, or visible UI state. Record unknown scope fields as `unknown` and
  do not invent a flow.
- `Generated comparison`: generated alternatives are themselves the product
  surface being judged against explicit criteria.

Then apply any relevant modifiers:

- `Visual craft`: hierarchy, spacing, typography, color, material, imagery,
  polish, and system consistency.
- `Accessibility-heavy`: screenshot-visible risks plus any DOM, keyboard, or
  assistive-technology evidence that was actually gathered.
- `AI/agent product`: agent identity, progress, state transparency, user
  control, review/approval, handoff, and accountability.
- `Dense information`: dashboards, reports, charts, metrics, tables, and
  operational views where density must serve comparison and repeated use.

## Mode-Specific Checks

For bounded screens or provided artifacts:

- Scope findings to what is visible or supplied.
- Mark product, flow, user role, or implementation facts as `unknown` when they
  are not evidenced.
- Do not require browser capture unless the audit needs live interaction
  evidence.

For accessibility-heavy audits:

- Attempt DOM/accessibility-tree inspection and keyboard probes when available.
- Test visible focus, tab order through the critical path, form labels and
  errors, modal escape/focus containment, target size, text zoom/reflow where
  feasible, and contrast by sampling or source when making contrast claims.
- If a probe cannot be run, downgrade the claim to `Likely` or `Needs testing`
  and name the missing probe.

For AI/agent products:

- Inspect agent identity and scope.
- Inspect current plan, progress, internal state, and what happens next.
- Inspect what data, tools, and actions the agent used or intends to use.
- Inspect approval before irreversible or external actions.
- Inspect cancel, undo, retry, failure recovery, and handoff to human control.
- Inspect accountability and audit trail for actions taken.
- Escalate unclear approval or irreversible-action ambiguity as trust/safety
  risk, not polish.

For dense-information products:

- Judge density by task fit, not spaciousness.
- Check metric definitions, units, date ranges, recency, filter and sort state,
  comparison baselines, chart axes/scales, annotation, outliers, empty/partial
  data, table scan paths, and whether visuals support comparison or merely
  decorate.

## Severity

- `P0`: task completion blocked, severe accessibility barrier, destructive
  mistake risk, privacy/security trust break, or unusable responsive state.
- `P1`: major task, comprehension, hierarchy, feedback, accessibility, or
  wrong-action risk likely to affect many users or high-value users.
- `P2`: moderate friction, unclear state, weak craft, inconsistent system,
  responsive issue, or accessibility risk that degrades confidence.
- `P3`: polish or consistency improvement that does not block use.

Craft issues can be `P1` when they hide primary content, make a destructive
action too easy, make text unreadable, break responsive use, or prevent users
from understanding state.

## Craft Severity Calibration

Use these examples to keep craft findings from being mislabeled as mere polish:

- `P1`: primary content or action is unclear; ambiguous grouping can cause
  wrong-field or wrong-action errors; key text or media is unreadable; state,
  status, or chart meaning is communicated by color alone; an empty state is a
  dead end; responsive layout causes truncation or impossible use.
- `P2`: hierarchy, density, type, color, spacing, image sizing, border clutter,
  or elevation materially slows scanning, weakens confidence, or makes the
  system feel inconsistent.
- `P3`: safe-but-plain defaults, tonal palette issues, missed accents, minor
  border/shadow polish, or component-expression opportunities that improve
  quality without blocking use.

## Finding Anatomy

Each substantive finding should include:

- Severity
- Step/screenshot
- Surface
- Evidence tier
- Evidence
- Principle
- Impact
- Recommendation
- Acceptance check
- Verification needed
- Confidence, when the judgment is aesthetic, generated, soft, or
  evidence-limited

Recommended shape:

```markdown
- [P1] Short issue title
  Step/screenshot:
  Surface:
  Evidence tier:
  Evidence:
  Principle:
  Impact:
  Recommendation:
  Acceptance check:
  Verification needed:
  Confidence:
```

Keep recommendations attached to the finding they solve. Avoid generic advice
such as "improve hierarchy" unless the recommendation names the element to
emphasize, the element to de-emphasize, and the check that proves the fix.

## Required Audit Lenses

Use these lenses as coverage prompts, not as filler headings. Report only what
the captured evidence supports.

- Core task and feature fit
- Orientation and information architecture
- Structure before style
- Visual hierarchy and density
- Action hierarchy and destructive-action containment
- Labels, values, and data scan behavior
- Typography and reading comfort
- Color system, contrast, and non-color redundancy
- Layout width, grids, spacing, alignment, and responsive scaling
- Interaction mechanics, feedback, and state coverage
- Motion and performance feel
- Copy, terminology, instructions, and error recovery
- Surfaces, elevation, borders, shadows, and material logic
- Image, icon, and media quality
- Empty, default, selected, loading, error, success, disabled, hover, active,
  focus, and first-run states
- Accessibility and inclusive input
- Product personality, brand fit, and system consistency
- Product idea, visual unity, and intentionality
- Template-like output risk on any product surface when visible
- Trust, safety, privacy, and reassurance
- AI/agent behavior, when relevant
- Generated-design fidelity, when relevant

## Calibration Lenses

Use these as calibration prompts, not report headings:

- Purpose-built workbench: reduced visual noise, dense but clear hierarchy,
  precise alignment, role-specific workflows, and details that matter after
  repeated use.
- Systemized web quality: interaction states, keyboard/focus, target size,
  responsive layout, concise copy, accessible contrast, performance feel,
  reusable primitives, and previewable iteration.
- Mechanical interface craft: feature-first framing, spacing, alignment, type
  scale, color scale, shadows/borders, icon/image quality, and cohesive
  component composition.
- Dimension-aware preference: criterion-specific findings, confidence by
  evaluated dimension, generated-design fidelity, and caution against generic
  model taste as a final arbiter.
- Product-idea unity: name the apparent user job or product promise in one
  sentence, then check whether typography, imagery, color, shape language,
  spacing, motion, and copy reinforce that same idea.
- Template-like output risk: applies to generated and non-generated surfaces
  when visible choices look independently plausible but not product-specific,
  such as stock card grids, arbitrary accent colors, mixed image treatments,
  generic spacing, or a feature-complete flow with no reassurance, recap, or
  memorable product moment.
- Affordance and feedback: signifiers, mapping, constraints, conceptual model,
  response to user action, and error tolerance.
- Self-evidence and navigation: obvious labels, low cognitive load, effortless
  wayfinding, and cheap usability-test questions.
- Human perception: proximity, choice overload, target acquisition, familiarity,
  and memory limits.
- Goal-directed behavior: user goals, scenarios, product behavior, and avoiding
  implementation-shaped UI.
- Data clarity: data density, comparison, annotation, chart clarity, and
  avoiding decorative data visuals.

## Craft Heuristics

Apply these as inspectable rules:

- Start with the feature and user job, not the shell around it.
- Judge task flow, structure, hierarchy, grouping, spacing, contrast, and
  readability before color, imagery, depth, decoration, or polish.
- Prefer smallest useful fixes before speculative feature additions.
- Use constrained scales for typography, spacing, color, radius, shadow,
  opacity, border width, and related UI values.
- Create hierarchy by emphasizing the primary content/action and deliberately
  de-emphasizing secondary content.
- Ask whether users are scanning for the label or for the value; style labels
  and values accordingly.
- Separate semantic structure from visual prominence. A correct heading level
  can still have the wrong visual weight.
- Make action hierarchy follow importance. Destructive actions are visually
  primary only in the confirmation context where they are the main decision.
- Ensure spacing encodes grouping: spacing around a group should be larger than
  spacing inside the group.
- Fit width to the content and task. Empty desktop space is better than
  stretched forms, long prose measures, or scattered settings.
- Recalibrate hierarchy across breakpoints instead of scaling everything
  proportionally.
- Treat typography and color as role systems, not one-off choices.
- Use contrast and non-color redundancy for state and meaning.
- Make depth obey material logic: light source, elevation, overlap, and shadow
  strength should not contradict each other.
- Keep media readable, correctly sized, and contained.
- Treat empty, default, selected, and first-run states as product moments.
- Remove border clutter when spacing, tone, or elevation would separate groups
  more clearly.
- Use richer component expression only when it improves meaning, scanning, or
  choice clarity.
- State the product idea or promise in one sentence. If the visual language,
  copy, and interaction priorities suggest different promises, report the
  mismatch.
- Identify the primary decision and the main visual focal point. If two or more
  unrelated controls, status marks, or decorative accents share the same visual
  weight, report unresolved contrast.
- Name the first three hierarchy tiers. If brand, headline, CTA, section label,
  cards, and navigation all compete for tier one or two, the hierarchy is not
  resolved.
- Name the current user mode, such as brand/mood, conversion, browsing,
  comparison, checkout, or confirmation. If the screen asks users to browse,
  compare, buy, and confirm with the same visual priority, report mode conflict.
- Treat whitespace as an information signal. Check whether larger gaps separate
  groups, whether tighter spacing binds related items, and whether empty space
  supports the promised feeling rather than hiding the next action.
- Check for independent decisions by listing the repeated tokens and treatments:
  colors, icons, type weights, radii, shadows, image crops, and navigation. If
  each choice looks acceptable alone but the set lacks a repeated logic, report
  system incoherence.
- Do not treat a functional base as finished. If a flow technically works but
  lacks the reassurance, confirmation, summary, or brand-specific moment needed
  for the user's decision, report the missing experience layer.
- Keep design findings multi-dimensional; do not collapse them into one
  holistic taste score.
- Treat broad model taste as weak evidence unless grounded by screenshots,
  references, or human/design review.

## Dimension Confidence

Set confidence by criterion and evidence, not by how strongly the critique is
phrased:

- Higher confidence: visible fidelity failures such as missing required text,
  obvious spelling errors, visible spatial mismatch, named color mismatch,
  broken layout, unreadable key content, or a probed interaction failure.
- Medium confidence: hierarchy, typography, spacing, action priority, and state
  clarity when grounded in current screenshots and task context.
- Lower confidence: mood, tone, color harmony, brand personality, audience fit,
  and overall aesthetic preference unless brand, audience, reference, or human
  design evidence was inspected.
- For high-stakes generated design or major visual direction, recommend human
  or designer review rather than treating model judgment as final.

## Generated-Design Fidelity

Apply this only to generated screens, mockups, images, or prompt-led artifacts.

Check:

- prompt or brief fidelity
- spatial accuracy
- color accuracy
- text and typography rendering accuracy
- mood/tone fit
- single product idea and visual unity
- template-like output risk
- hallucination severity: `none`, `minor`, or `major`

When comparing generated alternatives, use this prompt shape:

1. Brief: the intended screen, image, or product context.
2. Criterion: one dimension such as hierarchy, typography, product idea, color
   accuracy, template-like output risk, or spatial accuracy.
3. Rubric: the concrete standard for that dimension.
4. Question: which alternative better satisfies the criterion?
5. Reasoning: two or three evidence-grounded sentences.
6. Structured answer: the selected alternative, criterion, and confidence.

When auditing one product surface, adapt the same criterion/rubric pattern into
findings, severity, evidence tier, and verification needs. Do not force a
pairwise verdict when there is no pair.

## Accessibility Handling

Screenshot-visible accessibility findings are often risks, not proof. Use exact
language:

- `Confirmed` only when the evidence tier supports it.
- `Likely` when the issue is visible but unmeasured.
- `Needs testing` when keyboard, screen reader, DOM semantics, focus order,
  reduced motion, or zoom behavior is required.

Do not claim full WCAG compliance from screenshots. Do not cite WCAG success
criteria unless the evidence supports the specific claim.

For any `P0` or `P1` accessibility, keyboard, focus, destructive-action, or
state-feedback claim, perform the available `T1`/`T2` probe or explicitly state
why it could not be performed.

## Output Structure

Use this structure for saved audit notes unless the user asked for a different
format:

```markdown
# UX Audit Report

## Audit Scope
- Product/surface:
- Flow/task:
- Core user task:
- Smallest useful outcome:
- User role/context:
- Product type:
- Evidence sources:
- Evidence limits:

## Step List
1. Step name - health: good / mixed / poor / blocked

## Findings
- [P1] Finding title
  Step/screenshot:
  Surface:
  Evidence tier:
  Evidence:
  Principle:
  Impact:
  Recommendation:
  Acceptance check:
  Verification needed:
  Confidence:

## System Quality Themes
- Hierarchy and density:
- Interaction and state feedback:
- Typography and content:
- Color, tokens, and materials:
- Responsive and performance feel:
- Accessibility:
- Product fit and system consistency:
- Product idea, visual unity, and template-like output risk:

## Strong Decisions To Preserve
- Strong choices that should survive redesign or implementation work.

## Ship-Now Fixes
- Ordered repairs that unblock the core task or remove major risk.

## Later Polish And Enhancements
- Lower-risk refinements that improve quality after the core path is sound.

## What Could Not Be Verified
- Screenshot-only limits:
- Interaction/code/testing limits:

## Implementation-Ready Checklist
- Ordered fixes derived from the findings.
```

## Example Finding

```markdown
- [P1] Review step makes the paid action visually secondary to order edits
  Step/screenshot: 04-review-order.png
  Surface: action hierarchy / checkout trust
  Evidence tier: T0 screenshot-visible, T2 click-path observation
  Evidence: The payment button sits below two equally prominent edit links and
  a promo field. After editing shipping, the screen returns to the review page
  without a clear "ready to pay" state.
  Principle: The final step should make the irreversible primary action,
  current order state, and safe edit paths unambiguous.
  Impact: Users may hesitate, edit unnecessarily, or submit with reduced
  confidence because the page does not clearly separate review, correction, and
  payment.
  Recommendation: Make the payment action the only visually primary control in
  the final decision area, group edits beside their sections as secondary
  links, and add a concise order-state summary above the button.
  Acceptance check: At desktop and mobile widths, a first-time user can
  identify what will be charged, what can still be edited, and the single
  payment action within five seconds.
  Verification needed: Re-test the edit-return path and one mobile checkout
  pass. Analytics or user testing would be needed to confirm hesitation or
  dropoff.
  Confidence: Medium-high for the hierarchy and state issue from T0/T2
  evidence; medium for the hesitation impact until behavioral data exists.
```

## Guardrails

- Focus on experience patterns and product quality, not business strategy.
- Keep comparator products optional; use them only when they sharpen the audit.
- Separate structural issues from polish issues.
- Separate screenshot-visible claims from interaction, DOM, code, analytics, or
  user-testing claims.
- Tie recommendations back to the user goal, workflow, accessibility outcome,
  or system-quality issue.
- If the request is about a single screen, component, modal, or bounded
  interaction, keep the audit scoped to that surface.
