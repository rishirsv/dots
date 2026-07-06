# Artifact Recipes

Recipes capture the reader job. They are compact profiles, not rigid templates:
use the default skeleton only where the source supports it, then omit or mark
evidence limits honestly. Every artifact starts with `artifact-shell`,
`hero-summary`, and `theme-toggle`; body primitives come from the skeleton plus
the registry in [primitives.md](primitives.md).

The capture and concepting work behind QA, audit, and Image Gen artifacts stays
with adjacent skills. These recipes define only the saved static document.

## explainer

Use for:
A dense concept, code path, policy, article, bug, or architecture that needs to
be understood.

Source gates:
material being explained; reader question or confusion; source files, article,
logs, or notes read in full where relevant.

Default skeleton:
`hero-summary` -> optional `tldr` -> `step-flow` or prose sections -> optional
`code-panel`/`code-note`/`comparison-grid` -> optional `audit-trail`.

Add only when evidenced:
`section-nav` for four or more major sections; `callout` for one real caveat;
`audit-trail` when external, disputed, or source-sensitive claims matter.

Avoid:
risk tables, milestone plans, fake caveats, decorative dashboards, or turning a
short answer into a page.

## implementation-plan

Use for:
An objective that needs reviewable phases, dependencies, risks, verification,
and next actions.

Source gates:
objective; constraints; affected systems/files; known risks; validation
expectations.

Default skeleton:
`hero-summary` -> `meta-strip` -> `scope-boundary` -> `milestone-strip` or
`step-flow` -> `risk-table` -> `verification-matrix` -> `action-list`.

Add only when evidenced:
`dependency-map` when ordering depends on dependencies; `acceptance-gate` when a
real gate exists; `handoff-packet` for another implementer or team; `copy-export` for
downstream paste.

Avoid:
owners, dates, risks, gates, or proof not present in source.

## code-review

Use for:
A concrete diff, PR, patch, or changed file set that needs a verdict and fixes.

Source gates:
actual diff or changed files; behavior at risk; tests touched or missing.

Default skeleton:
`hero-summary` -> `meta-strip` -> `finding-card` list -> optional `diff-review`
or `code-note` -> `action-list`.

Add only when evidenced:
`risk-table` for structured behavioral risk; `callout` for one overall verdict
or caveat; `copy-export` for a pasteable fix list.

Avoid:
findings without location, impact, and recommendation; invented risk lists when
the finding already carries the risk.

## research-report

Use for:
A question that needs an answer, evidence, confidence, contradictions, and gaps.

Source gates:
question; consulted sources; source claims; contradictions; unconfirmed points.

Default skeleton:
`hero-summary` -> `tldr` -> `claim-evidence-matrix` -> `evidence-limits` ->
`audit-trail`.

Add only when evidenced:
`comparison-grid` when comparing options or sources; `callout` for final answer,
one caveat, or real contradiction; `source-manifest` when input provenance matters;
`inline-chart` when a ranking or trend in the evidence reads faster as a chart than a table.

Avoid:
fabricated citations, searches, source inventories, or symmetry blocks for
contradictions that were not found.

## design-qa

Use for:
Source-vs-render fidelity comparison with a pass, blocked, or evidence-limited
verdict.

Source gates:
source design/mock/screenshot/token spec; rendered captures; viewport/state
tested.

Default skeleton:
`hero-summary` -> `meta-strip` -> `qa-metadata` -> `screenshot-gallery` ->
`finding-card` list -> `action-list`.

Add only when evidenced:
`token-swatch` or `token-delta` for token fidelity; `evidence-limits` when state,
theme, or viewport gaps change the verdict; `copy-export` for a pasteable fix
list.

Avoid:
placeholder screenshots, mismatches without expected-vs-actual evidence, or UX
flow critique that belongs in `ux-audit-report`.

## design-qa-detailed

Use for:
A shareable, in-depth design QA packet with explicit coverage, evidence, and
implementation actions.

Source gates:
source design; rendered build captures; route, viewport, theme, density, and
state; proposed revision if one exists.

Default skeleton:
`hero-summary` -> `qa-metadata` -> `screenshot-gallery` or
`screenshot-triptych` -> `focused-compare` -> `mismatch-ledger` ->
`fidelity-coverage` -> `evidence-limits` -> `action-list`.

Add only when evidenced:
`screenshot-triptych` only when source, render, and revision all exist;
`annotation-pin` when several findings sit on one capture; `token-delta` for
token fidelity; `revision-strip` for a concrete before/after/revised sequence.

Avoid:
implying a revised mockup exists when it does not; claiming full coverage while
key states or dimensions are unchecked.

## ux-audit-report

Use for:
An existing product flow audited from ordered screenshots, with findings tied to
steps.

Source gates:
ordered step screenshots; audited task; widths, states, and limits.

Default skeleton:
`hero-summary` -> `qa-metadata` -> ordered `screenshot-gallery` ->
step-tied `finding-card` list -> `evidence-limits` -> `action-list`.

Add only when evidenced:
`annotation-pin` for multiple findings on one screenshot; `state-grid` for real
state coverage; `mismatch-ledger` for repeated structured issues; `copy-export`
for pasteable recommendations.

Avoid:
findings not tied to a step or screenshot; claims of full accessibility
compliance from screenshots alone.

## comparison-workbench

Use for:
Options, approaches, sources, or before/after states that need side-by-side
decision support.

Source gates:
options or states; axes that matter; recommendation and rationale if known.

Default skeleton:
`hero-summary` -> `meta-strip` -> `comparison-grid` -> optional `risk-table` or
`constraint-ledger` -> `callout`.

Add only when evidenced:
`focused-compare` or `screenshot-gallery` for visual states; `audit-trail` for
source-sensitive comparisons; `decision-log` when prior decisions matter.

Avoid:
forcing a recommendation beyond the evidence or using too many side-by-side
columns to remain readable.

## imagegen-concept-packet

Use for:
Generated concept directions that need source grounding, selection state, and
reusable prompts.

Source gates:
concept images; brief; source references; prompts used; selected direction if
known.

Default skeleton:
`hero-summary` -> `source-manifest` -> `concept-gallery` ->
`imagegen-prompt-card`.

Add only when evidenced:
`allowed-copy-list` for approved copy; `asset-inventory` for deliverables;
`copy-export` for reusable prompts; `handoff-packet` for accepted direction handoff.

Avoid:
generating concepts inside this recipe, inventing sources, or inventing selected
directions.

## design-handoff-spec

Use for:
An accepted design that needs faithful implementation.

Source gates:
accepted design; tokens/design system if any; assets; finalized copy; required
states; acceptance bar.

Default skeleton:
`hero-summary` -> `source-manifest` -> optional `design-system-extract` ->
`asset-inventory` -> `allowed-copy-list` -> `state-grid` -> `acceptance-gate`
-> `handoff-packet`.

Add only when evidenced:
`token-delta` for source-vs-build token comparisons; `screenshot-gallery` for
visual evidence; `copy-export` for implementation payloads.

Avoid:
fabricated assets, copy, states, tokens, or non-testable acceptance criteria.

## architecture-map

Use for:
System structure, boundaries, components, dependencies, and flow.

Source gates:
components and roles; flow between components; dependencies; scope boundaries.

Default skeleton:
`hero-summary` -> `meta-strip` -> `scope-boundary` -> `step-flow` ->
`dependency-map`.

Add only when evidenced:
`comparison-grid` for component alternatives; `code-panel` for code that
clarifies architecture; `constraint-ledger` for binding architecture constraints.

Avoid:
fake graph structure, hairball diagrams, or unclear boundaries.

## migration-plan

Use for:
Moving from one state, system, process, or data shape to another.

Source gates:
from/to states; affected systems and data; cutover or rollback strategy; risks,
owners, and verification where known.

Default skeleton:
`hero-summary` -> `scope-boundary` -> `state-grid` -> `milestone-strip` ->
`dependency-map` -> `risk-table` -> `verification-matrix` ->
`acceptance-gate`.

Add only when evidenced:
`owner-matrix` for named owners; `handoff-packet` for continuation; `step-flow`
when phases are better read as procedure; `action-list` for follow-up.

Avoid:
invented rollback proof, dates, owners, or cutover certainty.

## release-readiness

Use for:
A release boundary with gates, verification status, risks, and go/no-go.

Source gates:
release scope; verification status and proof; open risks; owners when known;
measured budgets when relevant.

Default skeleton:
`hero-summary` -> `acceptance-gate` -> `verification-matrix` -> `risk-table`
-> `action-list`.

Add only when evidenced:
`owner-matrix` for release owners; `performance-budget` for measured metrics;
`render-proof` for actual browser/render evidence; `copy-export` for release
notes or action payload.

Avoid:
hidden go/no-go, invented budgets, invented owners, or unverifiable proof.

## eval-report

Use for:
Evaluation results with cases, criteria, scores, evidence, limits, and a
conclusion.

Source gates:
evaluation question; cases; criteria; scores; evidence; inconclusive or
out-of-scope areas.

Default skeleton:
`hero-summary` -> `tldr` -> `verification-matrix` ->
`claim-evidence-matrix` -> `evidence-limits` -> `audit-trail`.

Add only when evidenced:
`comparison-grid` for candidate comparisons; `risk-table` when risk is the
scoring dimension; `copy-export` for reusable result summaries; `inline-chart`
when score movement or a pass-rate ranking is clearer as a chart.

Avoid:
hidden inconclusive results or scores that do not map to evidence.

## decision-brief

Use for:
A decision, options, constraints, recommendation, and change conditions.

Source gates:
decision to make; options; constraints; recommendation and reasoning if known;
prior decisions if any.

Default skeleton:
`hero-summary` -> `tldr` -> `constraint-ledger` -> `comparison-grid` ->
`callout`.

Add only when evidenced:
`decision-log` for actual prior decisions; `risk-table` for structured change
conditions; `copy-export` for downstream decision payloads.

Avoid:
forcing a recommendation beyond the evidence or listing constraints without
implications.

## postmortem

Use for:
An incident timeline, impact, root cause, contributing factors, and corrective
actions.

Source gates:
incident timeline; measured impact or explicit unknown; root cause; contributing
factors; corrective actions; owners when known.

Default skeleton:
`hero-summary` -> `meta-strip` -> `step-flow` -> `callout` -> `action-list`.

Add only when evidenced:
`risk-table` for impact or recurring risk patterns; `verification-matrix` for
action confirmation; `owner-matrix` for known ownership; `audit-trail` for
traceability; `decision-log` for real incident decisions.

Avoid:
unmeasured impact presented as fact, invented owners, or corrective action proof
not present in source.

## status-report

Use for:
Progress, blockers, decisions needed, recent movement, and next actions.

Source gates:
reporting period; current status; completed work; blockers; decisions needed;
next actions; dates or owners only when known.

Default skeleton:
`hero-summary` -> `meta-strip` -> `milestone-strip` -> `risk-table` ->
`decision-log` -> `action-list`.

Add only when evidenced:
`owner-matrix` for named ownership; `verification-matrix` for objective proof;
`copy-export` for a pasteable update.

Avoid:
invented dates, percent-complete theater, generic morale copy, or fake status
metrics.

## qa-packet

Use for:
Test evidence, failures, retest status, acceptance proof, and unresolved
verification limits.

Source gates:
tested scope; commands or test surfaces; pass/fail results; failures; retest
state; acceptance criteria where known.

Default skeleton:
`hero-summary` -> `qa-metadata` -> `verification-matrix` -> `render-proof` ->
`evidence-limits` -> `action-list`.

Add only when evidenced:
`screenshot-gallery` for visual proof; `mismatch-ledger` for structured
failures; `performance-budget` for measured budgets; `copy-export` for a test
handoff.

Avoid:
claiming coverage from a narrow check, hiding failed retests, or using mock
proof as release proof.

## briefing-deck

Use for:
A static client or internal narrative that should read like a short deck while
remaining one accessible page.

Source gates:
audience; narrative arc; key recommendation or update; sections; evidence or
examples for each section.

Default skeleton:
`hero-summary` -> optional `section-nav` -> `meta-strip` -> `step-flow` or
prose sections -> `comparison-grid` -> `callout`.

Add only when evidenced:
`screenshot-gallery` or `concept-gallery` for visual material;
`claim-evidence-matrix` for source-sensitive claims; `copy-export` for a
speaker-note payload.

Avoid:
slide-app behavior, auto-advancing motion, decorative section cards, or claims
that lack supporting material.

## product-spec

Use for:
A PRD, RFC, or feature spec with problem, scope, design, acceptance criteria,
launch risk, and rollout notes.

Source gates:
problem; users; scope; non-scope; design or behavior; acceptance criteria;
risks; launch or validation expectations.

Default skeleton:
`hero-summary` -> `scope-boundary` -> `state-grid` -> `acceptance-gate` ->
`risk-table` -> `verification-matrix`.

Add only when evidenced:
`design-system-extract` for design requirements; `dependency-map` for sequencing;
`owner-matrix` for real ownership; `handoff-packet` for implementation.

Avoid:
invented user research, fake success metrics, or acceptance criteria that cannot
be checked.

## proposal-pack

Use for:
A proposal, scope summary, approach, timeline, assumptions, and decision path.

Source gates:
client or stakeholder need; proposed scope; approach; timeline or phases;
assumptions; exclusions; next decision.

Default skeleton:
`hero-summary` -> `tldr` -> `scope-boundary` -> `step-flow` ->
`constraint-ledger` -> `handoff-packet`.

Add only when evidenced:
`milestone-strip` for dated phases; `owner-matrix` for delivery roles;
`comparison-grid` for options; `copy-export` for reusable proposal copy.

Avoid:
over-promising scope, invented staffing, unsupported dates, or sales copy that
obscures constraints.

## diligence-report

Use for:
Diligence thesis, red flags, evidence quality, issue implications, and follow-up
questions.

Source gates:
diligence scope; reviewed evidence; thesis or answer; issues; confidence;
unknowns; follow-up needs.

Default skeleton:
`hero-summary` -> `tldr` -> `claim-evidence-matrix` -> `risk-table` ->
`constraint-ledger` -> `evidence-limits` -> `audit-trail`.

Add only when evidenced:
`source-manifest` for input provenance; `comparison-grid` for options or peer
sets; `owner-matrix` for diligence follow-ups; `copy-export` for question lists;
`inline-chart` when a benchmark gap or peer-set ranking is clearer as a chart.

Avoid:
deal conclusions beyond the source, invented financial values, or treating
absence of evidence as proof.

## value-creation-plan

Use for:
Value levers, synergy thesis, margin opportunities, scenarios, dependencies,
and initiative roadmap.

Source gates:
baseline or explicit unknown; value levers; assumptions; dependencies; risks;
implementation path.

Default skeleton:
`hero-summary` -> `comparison-grid` -> `constraint-ledger` ->
`milestone-strip` -> `risk-table` -> `verification-matrix`.

Add only when evidenced:
`claim-evidence-matrix` for sourced levers; `owner-matrix` for initiative
ownership; `dependency-map` for sequencing; `copy-export` for initiative briefs.

Avoid:
fabricated synergy numbers, unsupported savings claims, or treating a scenario
as committed plan.

## design-system-reference

Use for:
Tokens, components, variants, states, assets, accepted copy, and implementation
handoff for a visual system.

Source gates:
accepted design or product surface; tokens; components; states; assets;
approved copy; acceptance expectations.

Default skeleton:
`hero-summary` -> `source-manifest` -> `design-system-extract` ->
`token-swatch` -> `state-grid` -> `asset-inventory` -> `allowed-copy-list`.

Add only when evidenced:
`screenshot-gallery` for rendered examples; `acceptance-gate` for handoff;
`copy-export` for implementation payloads; `fidelity-coverage` for QA status.

Avoid:
inventing tokens, components, states, or copy not present in the accepted design.

## system-card

Use for:
System behavior, intended use, capabilities, limitations, risks, eval evidence,
and mitigations.

Source gates:
system description; intended users or uses; capabilities; limitations; evals or
tests; risks; mitigations; evidence gaps.

Default skeleton:
`hero-summary` -> `tldr` -> `verification-matrix` ->
`claim-evidence-matrix` -> `risk-table` -> `evidence-limits`.

Add only when evidenced:
`comparison-grid` for candidates or versions; `render-proof` for live behavior
proof; `audit-trail` for source-sensitive claims; `copy-export` for review
payloads.

Avoid:
model-card theater without evidence, hidden limitations, or risk mitigations
that were not actually evaluated.

## bounded-workbench

Use for:
A tiny single-purpose review, prioritization, tuning, or export surface embedded
in a static document.

Source gates:
visible dataset; task-specific controls; export payload; fallback content; clear
review or editing purpose.

Default skeleton:
`hero-summary` -> `state-grid` -> `comparison-grid` -> `action-list` ->
`copy-export`.

Add only when evidenced:
`verification-matrix` for acceptance checks; `callout` for constraints;
`evidence-limits` for data or interaction limits; `render-proof` for behavior
proof.

Avoid:
persistence, hidden state, backend assumptions, rich app behavior, or controls
whose content disappears with JS disabled.
