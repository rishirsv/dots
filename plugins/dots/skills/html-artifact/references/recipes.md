# Artifact Recipes

Recipes for the artifacts this skill produces. Each recipe is a fixed
`data-artifact` value plus a required set of primitives from
[primitives.md](primitives.md) and the section order the artifact should follow.
Compose only catalog primitives; author per [authoring.md](authoring.md); style
from [DESIGN.md](DESIGN.md); verify per
[browser-checks.md](browser-checks.md).

Pick the recipe that matches the reader job, set its `data-artifact` on the
`artifact-shell`, and build the top-level slots in the order listed. The shell
must also carry `data-primitive="artifact-shell"`. Omit a section only when its
content genuinely does not exist — and say so rather than padding it.

The core five — `explainer`, `implementation-plan`, `code-review`,
`research-report`, and `design-qa` — cover most reader jobs. The extended set
below covers richer documents: `design-qa-detailed`, `ux-audit-report`,
`comparison-workbench`, `imagegen-concept-packet`, `design-handoff-spec`,
`architecture-map`, `migration-plan`, `release-readiness`, `eval-report`,
`decision-brief`, and `postmortem`. The capture and concepting work behind QA,
audit, and Image Gen artifacts is owned by the adjacent skills (`design-qa`,
`ux-audit`, `visual-design`); these recipes only define the saved document.

---

## explainer

Make a dense concept, code path, architecture, policy, bug, or external article
legible.

- **`data-artifact`:** `explainer`
- **Required source inputs:** the material being explained (file, doc, log,
  thread, or article) read in full; the reader's actual question or confusion.
- **Top-level slots / sections, in order:**
  1. `hero-summary` — what this explains and the one-line takeaway
  2. `tldr` — the short answer before detail
  3. body sections (`section` per idea) using `step-flow`, `comparison-grid`,
     `code-panel`, and `callout` as the content needs
  4. `callout` group for gotchas and caveats
  5. optional FAQ via native `details`/`summary`
- **Required primitives:** `artifact-shell`, `hero-summary`, `tldr`, `callout`.
- **Optional primitives:** `section-nav` (if four+ sections), `step-flow`,
  `comparison-grid`, `code-panel`, `code-note`, `screenshot-gallery`,
  `audit-trail` (if it leans on external sources).
- **What to omit:** risk tables, findings, milestones, export buttons — an
  explainer informs, it does not track work.
- **Browser QA focus:** first-viewport clarity, readable measure, contained code,
  working disclosure, no page overflow.
- **Final handoff:** one static file whose first screen states the concept and
  takeaway, with each section grounded in the source.

## implementation-plan

Turn a goal into a reviewable plan an implementer can follow as-is.

- **`data-artifact`:** `implementation-plan`
- **Required source inputs:** the goal and constraints; the affected files,
  packages, and data model; known risks; anything already decided.
- **Top-level slots / sections, in order — create exactly these:**
  1. **summary** — `hero-summary` plus a `meta-strip` of effort, surfaces, flags
  2. **milestones** — `milestone-strip` of phased, status-marked slices
  3. **dependency / flow view** — a contained SVG/CSS `step-flow` data flow diagram
  4. **risks** — `risk-table` of plan-changing risks with severity and mitigation
  5. **verification gates** — the checks and expected proof per slice
  6. **open questions** — unresolved decisions that change the work, with owners
  7. **handoff** — what the next agent needs to pick this up
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `milestone-strip`, `step-flow`, `risk-table`.
- **Optional primitives:** `section-nav`, `code-panel` (key code to write),
  `comparison-grid` (approach options), `callout`, `copy-export` (copy plan as
  Markdown).
- **What to omit:** diffs and findings — this is a plan, not a review.
- **Browser QA focus:** milestone status legibility, the diagram scrolling inside
  its panel (never the page), risk table mobile collapse, code containment.
- **Final handoff:** one static file with summary, milestones, flow, risks,
  verification gates, open questions, and handoff present and grounded.

## code-review

Review a change so a human can understand and act on it.

- **`data-artifact`:** `code-review`
- **Required source inputs:** the actual diff/PR; the changed files and their
  roles; the behavior at risk; tests touched.
- **Top-level slots / sections, in order — create exactly these:**
  1. **summary** — `hero-summary` plus a `meta-strip` (files, +/- delta, verdict)
  2. **file map** — the changed files and their role, with risk tags
  3. **findings** — `finding-card` per issue, ordered by severity
  4. **diff notes** — `diff-review` for the changes worth rendering inline
  5. **risk list** — `risk-table` of behavior/regression risks
  6. **fix checklist** — the concrete repairs, as a checkable list
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `finding-card`, `diff-review`, `risk-table`.
- **Optional primitives:** `section-nav`, `code-note`, `callout` (overall verdict),
  `copy-export` (copy the fix list).
- **What to omit:** milestones, claim/evidence matrices — those belong to plans
  and research.
- **Browser QA focus:** severity contrast and `data-state` correctness, diff
  add/del markers (not color-only), diff and code scrolling internally, finding
  cards complete (location + recommendation).
- **Final handoff:** one static file with summary, file map, findings, diff
  notes, risk list, and fix checklist, every finding grounded in the diff.

## research-report

Answer a question and show the work behind the answer.

- **`data-artifact`:** `research-report`
- **Required source inputs:** the question; the sources actually consulted with
  their claims; contradictions found; what could not be confirmed.
- **Top-level slots / sections, in order — create exactly these:**
  1. **answer** — `hero-summary` plus `tldr` with the conclusion and confidence
  2. **claim / evidence matrix** — `claim-evidence-matrix` mapping claims to sources
  3. **contradictions** — conflicts between sources, in `callout`s or a section
  4. **gaps** — what is missing or unconfirmed and why it matters
  5. **source inventory** — sources consulted and notably not consulted
  6. **audit trail** — `audit-trail` of searches, sources, and files checked
- **Required primitives:** `artifact-shell`, `hero-summary`, `tldr`,
  `claim-evidence-matrix`, `callout`, `audit-trail`.
- **Optional primitives:** `section-nav`, `comparison-grid` (option comparison),
  `screenshot-gallery` (source captures), `copy-export` (copy as Markdown).
- **What to omit:** milestones, diffs, findings — a report explains evidence, not
  work to do.
- **Browser QA focus:** confidence `data-state` legibility, matrix mobile collapse
  to cards, source links present, audit trail honest and specific.
- **Final handoff:** one static file with answer, claim/evidence matrix,
  contradictions, gaps, source inventory, and audit trail, with no fabricated
  citations.

## design-qa

Compare a visual source against a rendered build and report pass/blocked.

- **`data-artifact`:** `design-qa`
- **Required source inputs:** the source design (mockup, screenshot, or token
  spec); the rendered build captures; the widths tested.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of scope, widths checked, and verdict
  2. `screenshot-gallery` in `compare` variant — source beside render
  3. `finding-card` per mismatch, ordered by severity
  4. `token-swatch` when token fidelity (color, type, radius, spacing) is in scope
  5. a `callout` carrying the final pass / blocked result
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `screenshot-gallery`, `finding-card`, `callout`.
- **Optional primitives:** `section-nav`, `token-swatch`, `risk-table` (regression
  risks), `copy-export` (copy the fix list).
- **What to omit:** milestones, diffs, claim/evidence matrices.
- **Browser QA focus:** images contained (`max-width: 100%`), compare pairs
  aligned and stacking on mobile, pass/blocked state unmistakable, no page overflow.
- **Final handoff:** one static file pairing source against render with each
  finding located and a clear pass or blocked verdict.

## design-qa-detailed

A richer design-QA packet that proposes fixes and is explicit about coverage and
evidence. Use when a `design-qa` pass needs a shareable, in-depth document.

- **`data-artifact`:** `design-qa-detailed`
- **Required source inputs:** the source design; the rendered build captures; the
  run conditions (viewport, theme, route, density, state) the comparison was made
  under; the proposed revision where one exists.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of scope and verdict
  2. `qa-metadata` — the matched run conditions the comparison depends on
  3. `screenshot-triptych` — source / render / revised mockup, with focused
     regions via `focused-compare` where detail matters
  4. `mismatch-ledger` — every mismatch with expected vs actual and severity
  5. `finding-card` per mismatch worth detailing, with `annotation-pin` on the
     capture when several findings sit on one screen
  6. `token-delta` when token fidelity is in scope
  7. `fidelity-coverage` — which dimensions were checked and which were not
  8. `evidence-limits` — what could not be verified
  9. an implementation checklist of the concrete fixes
  10. a `callout` carrying the final pass / blocked / evidence-limited verdict
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `qa-metadata`, `screenshot-triptych`, `mismatch-ledger`, `finding-card`,
  `fidelity-coverage`, `evidence-limits`.
- **Optional primitives:** `section-nav`, `focused-compare`, `annotation-pin`,
  `token-delta`, `revision-strip`, `copy-export` (copy the fix list).
- **What to omit:** milestones, diffs, claim/evidence matrices.
- **Browser QA focus:** triptych and focused pairs align and stack on mobile,
  annotation pins stay anchored, pass/blocked/evidence-limited state unmistakable,
  images contained, no page overflow at 320px.
- **Final handoff:** one static file with matched run conditions, source/render/
  revised comparison, a located mismatch ledger, explicit coverage and evidence
  limits, an implementation checklist, and a clear pass / blocked / evidence-limited
  verdict.

## ux-audit-report

Audit a product flow from ordered screenshots, with findings tied to each step.
Use when an existing flow needs a shareable critique, not a pre-handoff QA check.

- **`data-artifact`:** `ux-audit-report`
- **Required source inputs:** the ordered step screenshots of the flow; the flow
  and task being audited; the widths/states captured; what could not be checked.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of flow, surface, and widths captured
  2. `qa-metadata` — the run conditions the captures were taken under
  3. ordered step screenshots via `screenshot-gallery`, each step with a per-step
     health read (`state-grid` or per-shot state)
  4. `finding-card` per UX/design finding, tied to a step, ordered by severity,
     with `annotation-pin` on a screenshot when several findings share a screen
  5. accessibility risks tied to steps (`finding-card` with an a11y location)
  6. `evidence-limits` — what could not be checked from screenshots alone
  7. recommendations, ordered by impact
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `qa-metadata`, `screenshot-gallery`, `finding-card`, `evidence-limits`.
- **Optional primitives:** `section-nav`, `state-grid`, `annotation-pin`,
  `mismatch-ledger`, `copy-export`.
- **What to omit:** milestones, diffs, token swatches — an audit evaluates an
  existing flow, it does not plan or build.
- **Browser QA focus:** step screenshots load and stay contained, per-step health
  legible, findings tie to the right step, a11y risks present, evidence limits
  honest, no page overflow.
- **Final handoff:** one static file with an ordered step walk-through, findings
  and a11y risks tied to steps, honest evidence limits, and prioritized
  recommendations.

## comparison-workbench

Lay options, approaches, or before/after states side by side for a decision.

- **`data-artifact`:** `comparison-workbench`
- **Required source inputs:** the options or states being compared; the axes that
  matter; any recommendation and its rationale.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of what is being compared and the decision
     it serves
  2. `comparison-grid` of the options, with the recommended one marked
  3. a per-axis breakdown via `risk-table` or `mismatch-ledger` where the
     differences are structured
  4. optional `screenshot-gallery` in `compare` variant for visual states
  5. a `callout` carrying the recommendation and why
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `comparison-grid`, `callout`.
- **Optional primitives:** `section-nav`, `risk-table`, `mismatch-ledger`,
  `screenshot-gallery`, `focused-compare`, `copy-export`.
- **What to omit:** milestones, diffs, audit trails unless the comparison rests on
  external sources.
- **Browser QA focus:** columns cap and wrap (no more than three or four across),
  the recommended option is unmistakable, comparison pairs stack on mobile.
- **Final handoff:** one static file laying the options side by side with a marked
  recommendation and the reasoning behind it.

## imagegen-concept-packet

Present generated concept directions for a visual, with sources and reusable
prompts. The concepting itself is owned by `visual-design`.

- **`data-artifact`:** `imagegen-concept-packet`
- **Required source inputs:** the generated concept images; the brief and source
  references they were grounded in; the selected direction; the prompts used.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of the brief and selected direction
  2. `source-manifest` — the references the concepts were grounded in
  3. `concept-gallery` — the candidate directions with the selected one marked
  4. `imagegen-prompt-card` set — the prompts used, ready to copy and re-run
  5. optional `allowed-copy-list` when copy ships with the concept
  6. a `callout` stating the accepted direction and next step
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `source-manifest`, `concept-gallery`, `imagegen-prompt-card`.
- **Optional primitives:** `section-nav`, `allowed-copy-list`,
  `design-system-extract`, `copy-export`.
- **What to omit:** risk tables, milestones, diffs — this packet presents concepts,
  it does not plan work.
- **Browser QA focus:** concept images load and stay contained, the selected
  direction is unmistakable, prompt cards copy correctly and read with JS off.
- **Final handoff:** one static file with grounded sources, a concept gallery with
  a clear selection, and reusable prompts.

## design-handoff-spec

The spec a build needs to implement an accepted design faithfully.

- **`data-artifact`:** `design-handoff-spec`
- **Required source inputs:** the accepted design; the design system or tokens to
  match; the assets to produce; the finalized copy; the acceptance bar.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of the surface and target
  2. `design-system-extract` — the tokens and component notes to match
  3. `asset-inventory` — the assets to produce, with spec, format, and status
  4. `allowed-copy-list` — the exact approved copy and its placement
  5. `state-grid` — the required states (empty/loading/error and key breakpoints)
  6. `acceptance-gate` — the conditions that define a faithful build
  7. `handoff-packet` — what the implementer needs to start
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `design-system-extract`, `asset-inventory`, `allowed-copy-list`,
  `acceptance-gate`, `handoff-packet`.
- **Optional primitives:** `section-nav`, `state-grid`, `token-delta`,
  `screenshot-gallery`, `copy-export`.
- **What to omit:** findings, diffs, claim/evidence matrices — this is a spec to
  build to, not a review.
- **Browser QA focus:** token swatches and asset tables contained, copy strings
  exact, states cover the real breakpoints, acceptance criteria legible.
- **Final handoff:** one static file with the system to match, the assets and copy
  to ship, the required states, and an explicit acceptance bar.

## architecture-map

Make a system's structure and data flow legible.

- **`data-artifact`:** `architecture-map`
- **Required source inputs:** the components and their roles; how data and control
  flow between them; the dependencies and boundaries.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of the system and scope
  2. `step-flow` or a contained diagram of the primary data/control flow
  3. `dependency-map` — what depends on what, and where it blocks
  4. component detail sections using `comparison-grid` or `code-panel` as needed
  5. `scope-boundary` — what the map covers and what it deliberately leaves out
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `step-flow`, `dependency-map`, `scope-boundary`.
- **Optional primitives:** `section-nav`, `comparison-grid`, `code-panel`,
  `callout`, `constraint-ledger`.
- **What to omit:** findings, milestones, verdicts — a map explains structure, it
  does not review or plan.
- **Browser QA focus:** diagrams and dependency graphs scroll inside their panel
  (never the page), the flow reads top-to-bottom, boundaries are explicit.
- **Final handoff:** one static file showing the components, their flow and
  dependencies, and the boundary of what is mapped.

## migration-plan

Plan a migration with phased slices, gates, owners, and rollback.

- **`data-artifact`:** `migration-plan`
- **Required source inputs:** the from/to states; the affected systems and data;
  the cutover and rollback strategy; owners; known risks.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of from/to and blast radius
  2. `scope-boundary` — what migrates and what stays
  3. `milestone-strip` — the phased slices with status
  4. `dependency-map` — ordering constraints between slices
  5. `risk-table` — migration and rollback risks with mitigation
  6. `owner-matrix` — who owns each area
  7. `verification-matrix` — the checks and proof per slice
  8. `acceptance-gate` — the cutover and rollback gates
  9. `handoff-packet` — what the next agent needs
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `scope-boundary`, `milestone-strip`, `risk-table`, `owner-matrix`,
  `verification-matrix`, `acceptance-gate`.
- **Optional primitives:** `section-nav`, `dependency-map`, `constraint-ledger`,
  `handoff-packet`, `step-flow`, `copy-export`.
- **What to omit:** findings, diffs — this is a plan, not a review.
- **Browser QA focus:** milestone status legible, matrices and owner tables
  contained and collapsing on mobile, gates and rollback unmistakable.
- **Final handoff:** one static file with scope, phased slices, ordering, risks,
  owners, verification, and explicit cutover/rollback gates.

## release-readiness

A go/no-go packet that shows whether a release is ready to ship.

- **`data-artifact`:** `release-readiness`
- **Required source inputs:** the release scope; the verification status; the
  open risks; the owners; the performance/size budgets where relevant.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` carrying the go/no-go read
  2. `acceptance-gate` — the release gates and their pass/blocked state
  3. `verification-matrix` — the checks run and their proof
  4. `risk-table` — open risks with severity and mitigation
  5. `owner-matrix` — who owns each area on release
  6. optional `performance-budget` when size/perf is gated
  7. a `callout` carrying the go / no-go decision
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `acceptance-gate`, `verification-matrix`, `risk-table`, `callout`.
- **Optional primitives:** `section-nav`, `owner-matrix`, `performance-budget`,
  `render-proof`, `copy-export`.
- **What to omit:** diffs, claim/evidence matrices, screenshots unless they are
  release evidence.
- **Browser QA focus:** gate states unmistakable, matrices contained, the go/no-go
  read visible in the first viewport.
- **Final handoff:** one static file with release gates, verification, open risks,
  owners, and a clear go / no-go decision.

## eval-report

Report an evaluation: what was tested, scored, and concluded.

- **`data-artifact`:** `eval-report`
- **Required source inputs:** the evaluation question; the cases and criteria; the
  scores and the evidence behind them; what was inconclusive.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `tldr` with the conclusion and confidence
  2. a scorecard of results — `risk-table` or `verification-matrix` of case ×
     criterion × score
  3. `claim-evidence-matrix` — the conclusions mapped to their evidence
  4. `evidence-limits` — what was inconclusive or out of scope
  5. `audit-trail` — the runs, cases, and sources checked
- **Required primitives:** `artifact-shell`, `hero-summary`, `tldr`,
  `claim-evidence-matrix`, `evidence-limits`, `audit-trail`.
- **Optional primitives:** `section-nav`, `verification-matrix`, `risk-table`,
  `comparison-grid`, `copy-export`.
- **What to omit:** milestones, diffs — a report explains results, not work to do.
- **Browser QA focus:** scorecard and matrices contained and collapsing on mobile,
  confidence and limits legible, audit trail honest.
- **Final handoff:** one static file with the conclusion, a scored result set
  mapped to evidence, honest limits, and a verifiable audit trail.

## decision-brief

Frame a decision: the options, constraints, recommendation, and rationale.

- **`data-artifact`:** `decision-brief`
- **Required source inputs:** the decision to be made; the options; the
  constraints; the recommendation and its reasoning; the decisions already taken.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `tldr` stating the recommendation up front
  2. `constraint-ledger` — the constraints shaping the decision
  3. `comparison-grid` — the options, with the recommended one marked
  4. `decision-log` — decisions taken and their rationale
  5. a `callout` carrying the recommendation and the one risk that would change it
- **Required primitives:** `artifact-shell`, `hero-summary`, `tldr`,
  `constraint-ledger`, `comparison-grid`, `decision-log`.
- **Optional primitives:** `section-nav`, `risk-table`, `callout`, `copy-export`.
- **What to omit:** diffs, screenshots, milestones — a brief decides, it does not
  build.
- **Browser QA focus:** recommendation visible first, options capped and wrapping,
  constraint and decision tables contained on mobile.
- **Final handoff:** one static file that leads with the recommendation and shows
  the constraints, options, and decision history behind it.

## postmortem

Reconstruct an incident: timeline, impact, root cause, and corrective actions.

- **`data-artifact`:** `postmortem`
- **Required source inputs:** the incident timeline; the measured impact; the root
  cause and contributing factors; the corrective actions and owners.
- **Top-level slots / sections, in order:**
  1. `hero-summary` plus a `meta-strip` of impact, duration, and severity
  2. `step-flow` in timeline variant — what happened, in order
  3. impact detail (a `risk-table` or prose grounded in measured numbers)
  4. root cause and contributing factors, with a `callout` for the primary cause
  5. `decision-log` of corrective actions, with owners and status
  6. `verification-matrix` — how each action will be confirmed
- **Required primitives:** `artifact-shell`, `hero-summary`, `meta-strip`,
  `step-flow`, `decision-log`, `callout`.
- **Optional primitives:** `section-nav`, `risk-table`, `verification-matrix`,
  `owner-matrix`, `audit-trail`, `copy-export`.
- **What to omit:** diffs and design swatches unless they are incident evidence.
- **Browser QA focus:** the timeline reads in order and stays inside its column,
  impact numbers are grounded, actions carry owners and a confirmation path.
- **Final handoff:** one static file with an ordered timeline, measured impact, a
  named root cause, and corrective actions with owners and verification.
