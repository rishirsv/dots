# Artifact Recipes

Recipes are profiles: a reader job, default composition, evidence-based
primitive choices, and hard guardrails. They are not validation checklists. Pick
the profile that matches the reader job, set its `data-artifact` on the
`artifact-shell`, and use only the defaults the source can support.

Every artifact uses the global shell furniture: `artifact-shell`,
`hero-summary`, and `theme-toggle`. Body primitives come from the recipe defaults
and the chooser in [primitives.md](primitives.md). Default primitives are
recommendations; hard guardrails are obligations. Omit unsupported default
sections, or state the evidence limit, instead of padding the artifact.

The capture and concepting work behind QA, audit, and Image Gen artifacts is
owned by adjacent skills (`design-qa`, `ux-audit`, `visual-design`); these
recipes define only the saved static document.

---

## explainer

Reader job: make a dense concept, code path, policy, bug, architecture, or
article legible.

Use when: the reader needs understanding, not a work plan or verdict.

Do not use when: the output is a short linear answer that belongs in chat or
Markdown.

Required source inputs:
- The material being explained, read in full.
- The reader's actual question or confusion.

Default story:
1. State what this explains and the answer in the first viewport.
2. Give a short answer only if it adds clarity beyond the hero.
3. Walk through the body in the smallest useful sequence of sections.
4. Surface real gotchas or caveats only when they matter.

Default primitives:
- `tldr` when the short answer needs its own block.
- `code-panel`, `code-note`, `step-flow`, or `comparison-grid` when the source
  needs them.

Choose primitives by evidence:
- Use `section-nav` only for four or more major sections.
- Use `callout` for one real caveat, gotcha, or framing note.
- Use `audit-trail` only when external or disputed sources matter.
- Omit risk tables, milestones, findings, and exports; an explainer should be
  the lightest recipe and should aggressively avoid overbuilding.

Hard guardrails:
- Do not invent caveats for symmetry.
- Do not turn a simple explanation into a dashboard or plan.

Browser QA focus:
- First-viewport clarity, readable measure, contained code, working disclosure,
  and no page overflow.

Final handoff:
- One static file whose first screen states the concept and takeaway, with each
  section grounded in the source.

## implementation-plan

Reader job: turn a goal into a reviewable plan an implementer can follow.

Use when: the reader needs phases, dependencies, risks, verification, and next
actions.

Do not use when: the artifact is reviewing an existing diff or deciding between
options.

Required source inputs:
- The goal and constraints.
- Affected files, packages, systems, or data model.
- Known risks, decisions, and validation expectations.

Default story:
1. Summarize the goal, scope, and implementation surface.
2. Show phases or an ordered flow.
3. Explain dependencies only when ordering is non-trivial.
4. List plan-changing risks and verification.
5. End with concrete next actions.

Default primitives:
- `meta-strip`, `milestone-strip`, `step-flow`, `risk-table`,
  `verification-matrix`, `action-list`.

Choose primitives by evidence:
- Use `dependency-map` when dependencies change ordering; otherwise `step-flow`
  is enough.
- Use `acceptance-gate` when there is a real gate.
- Use `handoff-packet` only when another agent needs to pick it up.
- Use `copy-export` only when the reader will paste the plan downstream.
- Omit owner or handoff details when unknown; mark the limit instead.

Hard guardrails:
- Do not fabricate risks, owners, dates, or verification proof.
- Keep diagrams contained; prefer a list over a decorative graph.

Browser QA focus:
- Milestone status legibility, diagram containment, risk/verification table
  mobile behavior, and code containment.

Final handoff:
- One static file with the plan, defaults omitted and why, validation path, and
  next actions.

## code-review

Reader job: help a human understand and act on a change.

Use when: there is an actual diff, PR, patch, or changed file set to review.

Do not use when: there is no concrete change; use an explainer or plan.

Required source inputs:
- The actual diff or changed files.
- The behavior at risk.
- Tests touched or missing.

Default story:
1. Lead with verdict, scope, and risk.
2. Map the changed files if file roles matter.
3. List findings ordered by severity.
4. Show diff excerpts only where they clarify the issue.
5. End with concrete fixes.

Default primitives:
- `meta-strip`, `finding-card`, `action-list`.

Choose primitives by evidence:
- Use `diff-review` when the diff itself makes the issue clearer.
- Use `risk-table` when risks are structured across behaviors or surfaces.
- Use `code-note` for line-specific reasoning.
- Use `callout` for one overall verdict or caveat.
- Use a compact table or prose for file mapping unless a future file-map
  primitive is added.

Hard guardrails:
- Every finding needs a location, impact, and recommendation.
- Do not invent a risk list when the finding itself carries the risk.

Browser QA focus:
- Severity labels not color-only, diff/code internal scrolling, and complete
  finding anatomy.

Final handoff:
- One static file with verdict, grounded findings, relevant diff notes, and a
  fix list.

## research-report

Reader job: answer a question and show the evidence behind the answer.

Use when: the reader needs confidence, sources, contradictions, or gaps.

Do not use when: the content is a single unsourced explanation.

Required source inputs:
- The question.
- Sources actually consulted and their claims.
- Contradictions, gaps, and unconfirmed points.

Default story:
1. Lead with answer and confidence.
2. Map claims to evidence.
3. Show contradictions only when found.
4. Name gaps and what they change.
5. Include source inventory or audit trail when trust matters.

Default primitives:
- `tldr`, `claim-evidence-matrix`, `audit-trail`.

Choose primitives by evidence:
- Use the cards variant of `claim-evidence-matrix` for short reports.
- Use `callout` for the final answer, one caveat, or real contradictions.
- Use `evidence-limits` when missing evidence changes confidence.
- Use `comparison-grid` only when comparing options or sources.
- Omit a contradictions block when no contradictions were found; do not invent
  symmetry.

Hard guardrails:
- Evidentiary honesty is mandatory: no fabricated citations, claims, searches,
  or source inventories.
- Unknowns must be visible when they affect the answer.

Browser QA focus:
- Matrix/card containment, source links, confidence legibility, and honest audit
  trail.

Final handoff:
- One static file with answer, evidence, gaps or limits, and provenance.

## design-qa

Reader job: compare a visual source against a rendered build and report pass,
blocked, or evidence-limited.

Use when: source and rendered captures exist.

Do not use when: the work is a UX critique of an existing flow; use
`ux-audit-report`.

Required source inputs:
- Source design, mockup, screenshot, or token spec.
- Rendered build captures.
- Widths and state tested.

Default story:
1. State scope, run conditions, and verdict.
2. Show source and render side by side.
3. List located mismatches.
4. Show design-specific tokens only when token fidelity is in scope.
5. End with verdict and fixes.

Default primitives:
- `meta-strip`, `qa-metadata`, `screenshot-gallery`, `finding-card`, `callout`,
  `action-list`.

Choose primitives by evidence:
- Use `token-swatch` or `token-delta` only for token fidelity.
- Use `risk-table` only for regression risks, not ordinary mismatches.
- Use `evidence-limits` when missing viewport, theme, or state changes the
  verdict.
- Use `copy-export` only for a fix list the reader will paste.

Hard guardrails:
- Use real captures; no placeholder screenshots.
- Every mismatch needs a location and expected-vs-actual evidence.

Browser QA focus:
- Image containment, compare alignment, stacking on mobile, and verdict clarity.

Final handoff:
- One static file pairing source and render with located findings and a clear
  verdict.

## design-qa-detailed

Reader job: assemble a richer design-QA packet with explicit coverage, evidence,
and proposed fixes when available.

Use when: a basic visual QA result needs a shareable, in-depth artifact.

Do not use when: there is only a quick pass/fail with no meaningful evidence
detail.

Required source inputs:
- Source design.
- Rendered build captures.
- Run conditions: viewport, theme, route, density, and state.
- Proposed revision, if one exists.

Default story:
1. State scope, matched run conditions, and verdict.
2. Show source/render comparison, or triptych when a revision exists.
3. Detail mismatches at the right density.
4. Record coverage and evidence limits.
5. End with concrete implementation actions and final verdict.

Default primitives:
- `meta-strip`, `qa-metadata`, `screenshot-gallery`, `finding-card`,
  `fidelity-coverage`, `evidence-limits`, `action-list`, `callout`.

Choose primitives by evidence:
- Use `screenshot-triptych` only when source, render, and revised mockup all
  exist.
- Use `focused-compare` when the whole screen is too coarse.
- Use `mismatch-ledger` for many similar mismatches; use `finding-card` alone
  for one to three high-signal findings.
- Use `annotation-pin` when several findings sit on one screenshot.
- Use `token-delta` only when token fidelity is in scope.
- Omit `evidence-limits` only when missing evidence does not change the verdict.

Hard guardrails:
- Always record `qa-metadata` when comparing captures.
- Do not imply a revised mockup exists when it does not.

Browser QA focus:
- Triptych/compare alignment, pin anchoring, image containment, state text, and
  320px overflow.

Final handoff:
- One static file with run conditions, comparison evidence, coverage, limits,
  actions, and verdict.

## ux-audit-report

Reader job: audit a product flow from ordered screenshots, with findings tied to
steps.

Use when: an existing flow needs critique and prioritized recommendations.

Do not use when: the job is source-vs-render design fidelity QA.

Required source inputs:
- Ordered step screenshots.
- Flow/task being audited.
- Widths, states, and what could not be checked.

Default story:
1. State flow, task, surface, and capture conditions.
2. Walk through ordered screenshots.
3. Tie UX, design, and accessibility findings to steps.
4. State evidence limits.
5. End with prioritized recommendations.

Default primitives:
- `meta-strip`, `qa-metadata`, `screenshot-gallery`, `finding-card`,
  `evidence-limits`, `action-list`.

Choose primitives by evidence:
- Use `annotation-pin` when several findings sit on one screenshot.
- Use `state-grid` only when meaningful state coverage exists.
- Use `mismatch-ledger` only for repeated structured issues.
- Use `copy-export` only when recommendations need to be pasted elsewhere.

Hard guardrails:
- Findings must tie to steps or screenshots.
- Screenshot-only limits must be stated when interaction, copy, or a11y cannot
  be verified.

Browser QA focus:
- Ordered screenshots contained, findings tied to steps, state labels readable,
  and no overflow.

Final handoff:
- One static file with step walkthrough, findings, limits, and recommendations.

## comparison-workbench

Reader job: lay options, approaches, or before/after states side by side for a
decision.

Use when: the reader must choose or understand tradeoffs across options.

Do not use when: there is only one option or a linear explanation.

Required source inputs:
- Options or states being compared.
- Axes that matter.
- Recommendation and rationale, if known.

Default story:
1. State the decision and recommendation.
2. Compare options with the fewest useful axes.
3. Add structured tables or visuals only when they clarify the comparison.
4. End with change conditions.

Default primitives:
- `meta-strip`, `comparison-grid`, `callout`.

Choose primitives by evidence:
- Use `risk-table`, `constraint-ledger`, or `mismatch-ledger` when axes are
  structured and more important than visuals.
- Use `screenshot-gallery` or `focused-compare` only for visual states.
- Use `audit-trail` only when the comparison rests on external sources.
- Omit screenshots when they do not carry evidence.

Hard guardrails:
- Do not force a recommendation if the evidence does not support one.
- Cap comparison columns and wrap before readability suffers.

Browser QA focus:
- Column wrapping, marked recommendation, mobile stacking, and contained visuals.

Final handoff:
- One static file with options, recommendation or stated uncertainty, and
  rationale.

## imagegen-concept-packet

Reader job: present generated concept directions for a visual, with sources and
reusable prompts.

Use when: concept images already exist and need a shareable packet.

Do not use when: the task is to create the concepts; that belongs to
`visual-design`.

Required source inputs:
- Generated concept images.
- Brief and source references.
- Selected direction, if known.
- Prompts used.

Default story:
1. State brief and selected direction.
2. Show source grounding.
3. Present concepts and selection state.
4. Provide reusable prompts.
5. Include approved copy only when it exists.

Default primitives:
- `meta-strip`, `source-manifest`, `concept-gallery`, `imagegen-prompt-card`.

Choose primitives by evidence:
- Use `allowed-copy-list` only when copy ships with the concept.
- Use `design-system-extract` only when real system notes were provided.
- Use `copy-export` for prompts the reader will reuse.
- Omit risk tables and milestones.

Hard guardrails:
- Generated concepts and assets are source material here; this recipe does not
  generate them.
- Do not invent source references or selected directions.

Browser QA focus:
- Concept image containment, selected state clarity, prompt cards readable with
  JS off, and copy controls if present.

Final handoff:
- One static file with grounded sources, concepts, selection state, and prompts.

## design-handoff-spec

Reader job: hand an accepted design to an implementer faithfully.

Use when: the design, assets, copy, tokens, or acceptance bar are known.

Do not use when: the artifact is still exploring concepts or reviewing a render.

Required source inputs:
- Accepted design.
- Design system/tokens to match, if any.
- Assets, finalized copy, states, and acceptance bar when known.

Default story:
1. State surface and target.
2. Extract design system or token notes when they exist.
3. List assets and approved copy only when provided.
4. State required states and acceptance criteria.
5. End with handoff details.

Default primitives:
- `meta-strip`, `acceptance-gate`, `handoff-packet`.

Choose primitives by evidence:
- Use `design-system-extract` only when design-system inputs exist.
- Use `asset-inventory` only for real deliverable assets.
- Use `allowed-copy-list` only for finalized copy.
- Use `state-grid` only for required states or breakpoints.
- Use `token-delta` or `screenshot-gallery` only when source evidence supports
  them.

Hard guardrails:
- Do not fabricate assets, copy, tokens, or states.
- Acceptance criteria must be testable.

Browser QA focus:
- Token/asset tables contained, exact copy strings, state coverage, and
  acceptance criteria readability.

Final handoff:
- One static file with known design inputs, omitted defaults and why, and an
  explicit acceptance bar.

## architecture-map

Reader job: make a system's structure, boundaries, and flow legible.

Use when: the reader needs components, dependencies, and data/control flow.

Do not use when: the output is a build plan or migration plan.

Required source inputs:
- Components and roles.
- Flow between components.
- Dependencies and boundaries.

Default story:
1. State system and scope.
2. Show the primary flow with the lightest useful structure.
3. Show dependencies only when they matter.
4. Detail components as needed.
5. Draw the boundary.

Default primitives:
- `meta-strip`, `step-flow`, `scope-boundary`.

Choose primitives by evidence:
- Use `dependency-map` when dependencies affect understanding.
- Use a contained diagram only when it is clearer than a list.
- Use `comparison-grid` for component alternatives or roles.
- Use `code-panel` only for code that clarifies the architecture.
- Omit graph-like diagrams when they become hairballs.

Hard guardrails:
- Boundaries must be explicit.
- Do not create fake graph structure for visual polish.

Browser QA focus:
- Diagram/list containment, top-to-bottom flow, boundary clarity, and no
  overflow.

Final handoff:
- One static file showing components, flow/dependencies where useful, and scope
  boundaries.

## migration-plan

Reader job: plan a migration with phases, dependencies, risks, gates, and
rollback.

Use when: the work moves from one state/system/process to another.

Do not use when: the work is a generic implementation plan with no migration
state.

Required source inputs:
- From/to states.
- Affected systems and data.
- Cutover/rollback strategy when known.
- Risks, owners, and verification evidence when known.

Default story:
1. State from/to state, scope, and blast radius.
2. Show phases and dependencies.
3. List migration and rollback risks.
4. Show gates and verification where known.
5. Include owners and handoff only when supported.

Default primitives:
- `meta-strip`, `scope-boundary`, `milestone-strip`, `dependency-map`,
  `risk-table`, `verification-matrix`, `acceptance-gate`.

Choose primitives by evidence:
- Use `owner-matrix` when named owners are known; mark unknowns otherwise.
- Use `handoff-packet` only when another agent needs to continue.
- Use `step-flow` when phases are better read as procedure.
- Use `action-list` for migration follow-up actions.
- Omit or mark limited any owner, verification, or gate detail not supported by
  source.

Hard guardrails:
- Do not fabricate named owners, rollback proof, dates, or verification.
- Cutover/rollback uncertainty must be visible.

Browser QA focus:
- Phase status, contained matrices, gate/rollback clarity, and mobile collapse.

Final handoff:
- One static file with scope, phases, dependencies, risks, known gates,
  verification, and unknowns.

## release-readiness

Reader job: show whether a release is ready to ship.

Use when: there are release gates, verification status, risks, and a go/no-go
decision.

Do not use when: there is no verification or release boundary.

Required source inputs:
- Release scope.
- Verification status and proof.
- Open risks and owners when known.
- Measured performance/size budgets when relevant.

Default story:
1. State scope and go/no-go read in the first viewport.
2. Show gates and verification.
3. Show open risks.
4. Add measured budgets or render proof only when real.
5. End with decision and required actions.

Default primitives:
- `meta-strip`, `acceptance-gate`, `verification-matrix`, `risk-table`,
  `callout`, `action-list`.

Choose primitives by evidence:
- Use `owner-matrix` only when release owners are known.
- Use `performance-budget` only for measured metrics.
- Use `render-proof` only when actual browser/render checks are release
  evidence.
- Use `copy-export` only for a downstream release note or action list.

Hard guardrails:
- Go/no-go must be visible and grounded.
- Do not invent measured budgets, owners, or proof.

Browser QA focus:
- Gate states, contained matrices, first-viewport go/no-go, and contrast.

Final handoff:
- One static file with release decision, gates, verification, risks, and
  evidence limits.

## eval-report

Reader job: report what was evaluated, how it scored, and what conclusion follows.

Use when: cases, criteria, scores, and evidence exist.

Do not use when: the output is just an implementation plan for an eval.

Required source inputs:
- Evaluation question.
- Cases, criteria, and scores.
- Evidence behind scores.
- Inconclusive or out-of-scope areas.

Default story:
1. State conclusion and confidence.
2. Show scorecard.
3. Map conclusions to evidence.
4. State limits.
5. Include run/audit trail.

Default primitives:
- `tldr`, `verification-matrix`, `claim-evidence-matrix`, `evidence-limits`,
  `audit-trail`.

Choose primitives by evidence:
- Use a plain table or `verification-matrix` for case x criterion scorecards.
- Use `risk-table` only when risk is the real scoring dimension.
- Use `comparison-grid` when comparing candidates.
- Use `copy-export` only for reusable result summaries.

Hard guardrails:
- Do not hide inconclusive results.
- Scores must map to evidence.

Browser QA focus:
- Scorecard containment, evidence mapping, limits, and audit trail specificity.

Final handoff:
- One static file with conclusion, scored results, evidence, limits, and audit
  trail.

## decision-brief

Reader job: frame a decision, options, constraints, recommendation, and change
conditions.

Use when: the reader needs to choose or ratify a recommendation.

Do not use when: the artifact is simply comparing states with no decision.

Required source inputs:
- Decision to be made.
- Options and constraints.
- Recommendation and reasoning, if known.
- Prior decisions, if any.

Default story:
1. Lead with recommendation or stated uncertainty.
2. Show constraints.
3. Compare options.
4. Record prior decisions only when they exist.
5. State what would change the recommendation.

Default primitives:
- `tldr`, `constraint-ledger`, `comparison-grid`, `callout`.

Choose primitives by evidence:
- Use `decision-log` only when prior decisions exist.
- Use `risk-table` for structured change conditions or tradeoffs.
- Use `copy-export` only when the brief will be pasted downstream.

Hard guardrails:
- Do not force a recommendation beyond the evidence.
- Constraints must have implications.

Browser QA focus:
- Recommendation visibility, option wrapping, and contained tables.

Final handoff:
- One static file with recommendation or uncertainty, options, constraints, and
  decision history when present.

## postmortem

Reader job: reconstruct an incident with timeline, impact, root cause, and
corrective actions.

Use when: timeline, impact, causes, and actions are grounded in incident
evidence.

Do not use when: there is no incident evidence; use a plan or explainer.

Required source inputs:
- Incident timeline.
- Measured impact.
- Root cause and contributing factors.
- Corrective actions and owners when known.

Default story:
1. State impact, duration, severity, and root cause.
2. Show timeline.
3. Explain impact and contributing factors.
4. List corrective actions.
5. Show verification for actions when known.

Default primitives:
- `meta-strip`, `step-flow`, `callout`, `action-list`.

Choose primitives by evidence:
- Use `risk-table` for impact details or recurring risk patterns.
- Use `verification-matrix` when corrective actions have confirmation paths.
- Use `owner-matrix` when action ownership is known.
- Use `audit-trail` when incident evidence needs traceability.
- Use `decision-log` only for actual decisions with rationale, not ordinary
  action items.

Hard guardrails:
- Impact must be measured or explicitly marked unknown.
- Do not assign owners or verification proof without source support.

Browser QA focus:
- Timeline order, grounded impact, action status text, and containment.

Final handoff:
- One static file with timeline, impact, cause, actions, owners when known, and
  verification limits.
