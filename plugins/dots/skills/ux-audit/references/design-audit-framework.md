# Design Audit Framework

Use this structure for `ux-audit`.

Use audit for systematic assessment across a broader experience, not for
feedback on a single artifact. If the request is only about one rendered screen,
component, modal, or static artifact, use
[design-critique](../../design-critique/SKILL.md) instead. If a broader
experience includes a bounded screen or interaction, keep that part of the audit
scoped to the evidence.

Start each audit by recording these fields in working notes before judging the
flow. In a reader-facing saved report, summarize only the useful scope near the
top and move detailed grounding, provenance, evidence tiers, and source anchors
to an `Evidence appendix` at the bottom.

- Product or experience
- Flow, journey, workflow, or product area
- Core user task
- Smallest useful outcome
- User role or context, when known
- Product type
- Evidence inspected
- Evidence limits

Product type matters. A dense operations tool, AI workbench, dashboard,
consumer landing page, game, portfolio, and checkout flow should not be judged
with the same density, expression, or interaction expectations.

## Audit Modes

Choose one audit mode:

- `UX audit`
- `Accessibility audit`
- `Combined audit`

Use `Combined audit` when the user asks for both UX/design quality and
accessibility, when the experience is high-stakes, or when accessibility risks
are visible during a UX audit.

## UX Audit Lenses

Use these lenses as coverage prompts, not required report headings:

- Task entry and discoverability
- Information architecture
- Interaction flow and friction
- Hierarchy and clarity
- Trust and reassurance
- Default states and empty states
- Copy and calls to action
- Consistency across the experience
- Responsive behavior and state continuity
- Product fit, visual craft, and system quality

Add these lenses when the product calls for them:

- Dense information: metric definitions, units, date ranges, filter and sort
  state, comparison baselines, chart axes and scales, outliers, empty or partial
  data, table scan paths, and whether visuals support comparison rather than
  decorate.
- AI or agent product: agent identity and scope, current plan, progress, state
  transparency, data and tool use, approval before irreversible actions, cancel,
  undo, retry, failure recovery, handoff to human control, accountability, and
  audit trail.
- Generated or prompt-led design: prompt or brief fidelity, spatial accuracy,
  color accuracy, text and typography rendering, mood and tone fit, single
  product idea, visual unity, template-like output risk, and hallucination
  severity.
- Product idea and system fit: whether typography, imagery, color, shape
  language, spacing, motion, and copy reinforce the same apparent user job or
  product promise.

Use these additional calibration prompts when they sharpen the audit:

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
- Affordance and feedback: signifiers, mapping, constraints, conceptual model,
  response to user action, and error tolerance.
- Self-evidence and navigation: obvious labels, low cognitive load, effortless
  wayfinding, and cheap usability-test questions.
- Human perception: proximity, choice overload, target acquisition,
  familiarity, and memory limits.
- Goal-directed behavior: user goals, scenarios, product behavior, and avoiding
  implementation-shaped UI.
- Data clarity: data density, comparison, annotation, chart clarity, and
  avoiding decorative data visuals.

## Accessibility Audit Lenses

Use these lenses as coverage prompts, not required report headings:

- Perceivable content and contrast risks
- Semantic structure and reading order
- Keyboard access and focus behavior
- Target size and interaction affordances
- Labels, instructions, and error recovery
- Motion, timing, and state change communication
- Responsive reflow and zoom resilience
- Assistive-technology clarity and robustness

Do not imply full WCAG compliance unless the user has provided the
implementation details and testing evidence needed to support that claim. From
screenshots alone, report accessibility issues as likely risks or verification
gaps.

## Severity

- `P0`: task completion blocked, severe accessibility barrier, destructive
  mistake risk, privacy/security trust break, or unusable responsive state.
- `P1`: major task, comprehension, hierarchy, feedback, accessibility, or
  wrong-action risk likely to affect many users or high-value users.
- `P2`: moderate friction, unclear state, weak craft, inconsistent system,
  responsive issue, or accessibility risk that degrades confidence.
- `P3`: polish or consistency improvement that does not block use.

Separate structural issues from polish issues. Craft issues can be `P1` when
they hide primary content, make destructive action too easy, make text
unreadable, break responsive use, or prevent users from understanding state.

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
- Step, screenshot, or artifact
- Surface
- Evidence
- Impact
- Recommendation
- Acceptance check
- Verification needed, when the claim requires interaction, code, assistive
  technology, analytics, or user testing
- Confidence, when the judgment is aesthetic, generated, soft, or
  evidence-limited

Recommended shape:

```markdown
### [P1] Short issue title

- Step/screenshot:
- Surface:
- Impact:
- Recommendation:
- Acceptance check:
- Evidence:
- Verification needed:
- Confidence:
```

Keep recommendations attached to the finding they solve. Avoid generic advice
such as "improve hierarchy" unless the recommendation names the element to
emphasize, the element to de-emphasize, and the check that proves the fix.

## Craft And Calibration Heuristics

Apply these as inspectable rules, not extra report headings:

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
- Treat empty, default, selected, loading, error, success, disabled, hover,
  active, focus, and first-run states as product moments.
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
  comparison, checkout, or confirmation. If the experience asks users to browse,
  compare, buy, and confirm with the same visual priority, report mode conflict.
- Treat whitespace as an information signal: larger gaps should separate groups,
  tighter spacing should bind related items, and empty space should support the
  promised feeling rather than hiding the next action.
- Check for independent decisions by listing repeated tokens and treatments:
  colors, icons, type weights, radii, shadows, image crops, and navigation. If
  each choice looks acceptable alone but the set lacks repeated logic, report
  system incoherence.
- Do not treat a functional base as finished. If a flow technically works but
  lacks the reassurance, confirmation, summary, or product-specific moment needed
  for the user's decision, report the missing experience layer.
- Keep design findings multi-dimensional; do not collapse them into one
  holistic taste score.
- Treat broad model taste as weak evidence unless grounded by screenshots,
  references, or human/design review.

## Confidence

Set confidence by criterion and evidence, not by how strongly the critique is
phrased:

- Higher confidence: visible failures such as missing required text, obvious
  spelling errors, visible spatial mismatch, named color mismatch, broken layout,
  unreadable key content, or a probed interaction failure.
- Medium confidence: hierarchy, typography, spacing, action priority, and state
  clarity when grounded in current screenshots and task context.
- Lower confidence: mood, tone, color harmony, brand personality, audience fit,
  and overall aesthetic preference unless brand, audience, reference, or human
  design evidence was inspected.
- For high-stakes generated design or major visual direction, recommend human or
  designer review rather than treating model judgment as final.

## Generated-Design Fidelity

Apply this only to generated screens, mockups, images, or prompt-led artifacts
that represent the broader product experience being audited.

Check:

- prompt or brief fidelity
- spatial accuracy
- color accuracy
- text and typography rendering accuracy
- mood and tone fit
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

When auditing one in-scope product surface, adapt the same criterion/rubric
pattern into findings, severity, and verification needs. Do not force a pairwise
verdict when there is no pair.

## Accessibility Handling

Screenshot-visible accessibility findings are often risks, not proof. Use exact
language:

- `Confirmed` only when the inspected evidence supports it.
- `Likely` when the issue is visible but unmeasured.
- `Needs testing` when keyboard, screen reader, DOM semantics, focus order,
  reduced motion, or zoom behavior is required.

Do not claim full WCAG compliance from screenshots. Do not cite WCAG success
criteria unless the evidence supports the specific claim.

For any `P0` or `P1` accessibility, keyboard, focus, destructive-action, or
state-feedback claim, perform the available interaction, DOM,
accessibility-tree, source, or testing probe, or explicitly state why it could
not be performed.

## UX Audit Output Structure

```markdown
# UX Audit Report

## Audit Scope
- Product or experience:
- Flow, journey, or product area:
- Evidence inspected:
- Evidence limits:

## User Goal
- The task or outcome the experience should support.

## Step List
1. Step name - health: good / mixed / poor / blocked

## Strengths
- Strong choices worth preserving.

## Notable Risks
- Highest-impact UX, design, or product-quality risks.

## Findings
- [P1] Finding title
  Step/screenshot:
  Surface:
  Evidence:
  Impact:
  Recommendation:
  Acceptance check:
  Verification needed:
  Confidence:

## Opportunity Areas
- Improvements that would make the experience clearer, easier, or more coherent.

## Optional Comparison Context
- Comparator products or references, only when they sharpen the audit.

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

## Recommendations
- Ordered fixes tied to the user goal or workflow.

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

## Accessibility Audit Output Structure

```markdown
# Accessibility Audit Report

## Audit Scope
- Product or experience:
- Flow, journey, or product area:
- Evidence inspected:
- Evidence limits:

## Accessibility Target
- The accessibility outcome, user group, standard, or critical path being checked.

## Step List
1. Step name - health: good / mixed / poor / blocked

## Confirmed Strengths
- Accessibility-supporting choices visible or verified in the evidence.

## Likely Issues
- Accessibility risks found in the evidence.

## WCAG-Relevant Considerations
- Relevant WCAG areas only when the evidence supports them.

## Evidence Limits And Verification Gaps
- Missing keyboard, focus, semantics, screen reader, motion, zoom, code, or
  assistive-technology evidence.

## Recommendations
- Ordered fixes tied to the accessibility outcome.

## Implementation-Ready Checklist
- Ordered fixes derived from the likely issues and verification gaps.
```

## Combined Audit Output Structure

```markdown
# UX And Accessibility Audit Report

## Audit Scope
- Product or experience:
- Flow, journey, or product area:
- Evidence inspected:
- Evidence limits:

## User Goal And Accessibility Target
- User goal:
- Accessibility target:

## Step List
1. Step name - health: good / mixed / poor / blocked

## Strengths
- Strong UX, design, and accessibility-supporting choices worth preserving.

## UX Risks
- Highest-impact UX, design, or product-quality risks.

## Accessibility Risks
- Accessibility risks, separated from broader UX findings.

## Opportunity Areas
- Improvements that would make the experience clearer, easier, more accessible,
  or more coherent.

## System Quality Themes
- Hierarchy and density:
- Interaction and state feedback:
- Typography and content:
- Color, tokens, and materials:
- Responsive and performance feel:
- Accessibility:
- Product fit and system consistency:
- Product idea, visual unity, and template-like output risk:

## Evidence Limits And Verification Gaps
- Missing interaction, code, accessibility, analytics, or user-testing evidence.

## Recommendations
- Ordered fixes tied to the user goal, workflow, or accessibility outcome.

## Ship-Now Fixes
- Ordered repairs that unblock the core task or remove major risk.

## Later Polish And Enhancements
- Lower-risk refinements that improve quality after the core path is sound.

## Implementation-Ready Checklist
- Ordered fixes derived from the findings.
```

## Guardrails

- Focus on experience patterns, not business strategy.
- Keep comparator products optional; use them only when they sharpen the audit.
- Separate structural issues from polish issues.
- Tie recommendations back to the user goal, workflow, or accessibility outcome.
- Do not imply full WCAG compliance unless the user has provided the
  implementation details needed to support that claim.
- Use screenshots and supplied artifacts as current evidence, but clearly name
  interaction, code, accessibility-tree, analytics, or user-testing gaps.
- Prefer a short, decision-useful report over printing every lens.
