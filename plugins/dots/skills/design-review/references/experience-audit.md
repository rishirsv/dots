# Experience Audit

Use this framework for the experience audit path: systematic assessment across a
broader experience. If the request is only about one rendered screen,
component, modal, or static artifact, use the surface critique path in
[SKILL.md](../SKILL.md) instead. If a broader experience includes a bounded
screen or interaction, keep that part of the audit scoped to the evidence.

Record the scope, evidence inspected, and evidence limits before judging the
experience. In a reader-facing saved report, include only the context and
evidence paths needed to understand or verify the findings; omit internal
provenance, tooling notes, and working metadata.

Product type matters. A dense operations tool, AI workbench, dashboard,
consumer landing page, game, portfolio, and checkout flow should not be judged
with the same density, expression, or interaction expectations.

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

## Severity Calibration

The severity scale is defined in [SKILL.md](../SKILL.md). Use these examples to
keep craft findings from being mislabeled as mere polish:

- `P1`: primary content or action is unclear; ambiguous grouping can cause
  wrong-field or wrong-action errors; key text or media is unreadable; state,
  status, or chart meaning is communicated by color alone; an empty state is a
  dead end; responsive layout causes truncation or impossible use.
- `P2`: hierarchy, density, type, color, spacing, image sizing, border clutter,
  or elevation materially slows scanning, weakens confidence, or makes the
  system feel inconsistent.
- `P3`: tonal palette issues, missed accents, minor border/shadow polish, or
  component-expression opportunities that improve quality without blocking use.

Safe-but-plain defaults, repeated template patterns, and weak subject
specificity are `P1` or `P2` when they undermine product fit, client readiness,
or the user's core decision. Keep them `P3` only when the product still reads as
specific and usable.

## Finding Shape

Findings use the shared anatomy in [SKILL.md](../SKILL.md). Recommended
markdown shape:

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
- Separate checkable criteria, such as brief fidelity, text rendering, spatial
  accuracy, and layout, from taste-heavy criteria, such as mood, color harmony,
  and audience fit. State confidence by dimension when that distinction changes
  the recommendation.
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

Review generated or prompt-led work at the criterion level instead of giving
one overall taste verdict. Distinguish checkable failures from lower-confidence
preference calls, and treat template-like output as a product-fit risk when it
weakens the intended subject or client-readiness bar.

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

## Saved Report Order

When writing a saved `audit.md`, use this order:

1. Title
2. One-line verdict
3. Scope and core user task
4. Design constitution score over the principles evidenced by this scope
5. Top findings, grouped by severity
6. Step health table or compact numbered step list
7. Detailed findings
8. Strong decisions to preserve
9. Ship-now fixes
10. Later polish
11. Verification gaps
12. Evidence appendix

Each step in the step health table or numbered list should stand on its own.
Lead with the visible user experience, then explain the task effect, strongest
preserve/fix point, and any evidence limit that changes confidence.

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

## Audit Output Structure

Use one structure for UX, accessibility, and combined audits. Omit empty
sections. For an accessibility audit, emphasize the accessibility target and
verification gaps; for a combined audit, keep UX and accessibility findings
separate where their evidence or remediation differs.

```markdown
# Experience Audit

## Verdict And Scope
- Mode: UX | accessibility | combined
- User goal and, when relevant, accessibility target
- Flow or product area
- Evidence limits that affect the verdict

## Design Constitution
- Score evidenced principles and report the available total.

## Top Findings
### [P1] Finding title
- Step/screenshot:
- Surface:
- Evidence:
- Impact:
- Recommendation:
- Acceptance check:
- Verification needed:
- Confidence:

## Step Health
1. Step name — good | mixed | poor | blocked: concise evidence-grounded read.

## System Themes
- Only cross-step patterns that materially affect the experience.

## Strong Decisions To Preserve
- Non-obvious strengths that should survive changes.

## Ship-Now Fixes
- Ordered repairs tied to the core task or major risk.

## Later Polish
- Non-blocking refinements, when present.

## Verification Gaps
- Missing interaction, keyboard, semantics, assistive-technology, code,
  analytics, or user-testing evidence.
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
