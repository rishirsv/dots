# HTML Artifact Roadmap

This roadmap captures the next expansion of `html-artifact` after the current
archetype/recipe refactor. It is durable planning material, not runtime
instructions for ordinary artifact generation. Runtime guidance remains in
[SKILL.md](SKILL.md), [references/composition.md](references/composition.md),
[references/recipes.md](references/recipes.md),
[references/primitives.md](references/primitives.md),
[references/authoring.md](references/authoring.md),
[references/design.md](references/design.md), and
[references/validation.md](references/validation.md).

## Product Direction

Build broad document coverage through document aliases, recipes, visual bases,
and primitive archetypes, not by copying example HTML files or adding a
primitive for every deliverable.

The skill should become a high-fidelity static document system for professional
work products: consulting packs, diligence reports, product specs, design QA,
system cards, eval reports, launch/readiness docs, and bounded interactive
workbenches. It should stay compact enough for a writer to use in one pass.

## Current Baseline

The current source already has:

- `SKILL.md` routing through `references/composition.md`.
- `references/composition.md` as the runtime recipe/archetype quick sheet.
- `references/recipes.md` with 16 first-class recipes.
- `references/primitives.md` with archetypes plus a compact primitive registry.
- `references/design.md` for visual judgment.
- `references/validation.md` for rendered browser validation.
- `assets/html-artifact-reference.html` as the rendered specimen sheet.
- `scripts/validate.mjs` checking registry closure, recipe/chooser coherence,
  specimen coverage, embedded theme parity, and visible-copy hygiene.

This roadmap extends that structure instead of replacing it.

## Revised Model

Use four layers:

| Layer | Purpose | Example |
|---|---|---|
| Document type | What the user asks for | "CDD report", "PRD", "board memo", "system card", "design QA packet" |
| Recipe | Reader job, source gates, default sections | `diligence-report`, `product-spec`, `decision-brief` |
| Base | High-fidelity visual skeleton | `executive-brief`, `evidence-dossier`, `plan-roadmap`, `visual-specimen` |
| Primitive | Semantic, inspectable building block | `risk-table`, `claim-evidence-matrix`, `inline-chart`, `finding-card` |

Add `data-base` only after bases are documented and validated:

```html
<main data-artifact="diligence-report" data-base="evidence-dossier">
```

`data-artifact` identifies the document job. `data-base` identifies the visual
composition pattern. `data-primitive` continues to identify reusable semantic
sections.

## Visual Bases

Add visual bases to `references/composition.md`. Bases should guide first
viewport composition and visual rhythm; they should not become separate
templates or runtime components.

| Base | Visual shape | Used for |
|---|---|---|
| `executive-brief` | Recommendation, status, key facts, decision needed, next action | Board memo, steering memo, decision brief, proposal one-pager, leadership update |
| `evidence-dossier` | Dense source-grounded report with nav, claim/evidence matrix, issue ledger, evidence limits | Research, diligence, evals, safety reviews, market studies |
| `decision-workbench` | Options by criteria, recommendation, sensitivity, change conditions | Vendor comparison, build/buy/partner, strategic options, architecture choices |
| `plan-roadmap` | Phases, milestones, workstreams, dependencies, gates, owners, risks | Implementation plan, migration plan, integration plan, launch plan |
| `diligence-pack` | Thesis, red flags, evidence quality, value/risk bridge, data-room trace | FDD, CDD, ODD, tech DD, vendor DD, synergy review |
| `system-map` | Contained schematic, flow, dependencies, failure paths, glossary | Architecture map, operating model, runbook, process map |
| `review-annotation` | Annotated files/screenshots/diffs plus findings and recommended fixes | Code review, UX audit, design QA, model behavior review |
| `visual-specimen` | Gallery, variants, states, tokens, screenshots, acceptance bar | Design system reference, handoff spec, visual exploration, component QA |
| `eval-safety` | Capability/risk matrix, test suites, thresholds, failures, mitigations, limits | System card, safety eval, model spec review, release readiness |
| `bounded-workbench` | Small task-specific interaction with visible data and copy/export support | Triage board, prompt tuner, feature flag review, backlog board |
| `briefing-deck` | Static section-as-slide document, readable as a page, optional tiny navigation JS | Client presentation, weekly update, launch narrative, strategy brief |

Every base needs a strong first viewport: document type, conclusion, evidence
state, and next action should be visible before scrolling.

## Recipe Roadmap

Keep the current 16 recipes:

```text
explainer
implementation-plan
code-review
research-report
design-qa
design-qa-detailed
ux-audit-report
comparison-workbench
imagegen-concept-packet
design-handoff-spec
architecture-map
migration-plan
release-readiness
eval-report
decision-brief
postmortem
```

Add these 10 recipes in phases, with aliases for long-tail document names:

| New recipe | Default base | Purpose |
|---|---|---|
| `status-report` | `executive-brief` or `plan-roadmap` | Progress, blockers, decisions, next actions |
| `qa-packet` | `evidence-dossier` or `review-annotation` | Test evidence, failures, retest status, acceptance proof |
| `briefing-deck` | `briefing-deck` | Static client/internal narrative with slide-like sections |
| `product-spec` | `plan-roadmap` | PRD/RFC/spec with problem, scope, design, acceptance, launch risk |
| `proposal-pack` | `executive-brief` | Client proposal, scope, approach, team, timeline, assumptions |
| `diligence-report` | `diligence-pack` | FDD/CDD/ODD/tech/tax/ESG/HR diligence with red flags and evidence |
| `value-creation-plan` | `decision-workbench` or `plan-roadmap` | Synergy thesis, margin levers, value bridge, initiative roadmap |
| `design-system-reference` | `visual-specimen` | Tokens, components, states, assets, approved copy |
| `system-card` | `eval-safety` | Model/system behavior, capabilities, risks, eval evidence, mitigations |
| `bounded-workbench` | `bounded-workbench` | Tiny single-purpose review/editing surface with export, not a rich app |

Do not add separate recipes for every diligence flavor, consulting deliverable,
startup artifact, or AI research document. Put those names in the alias map.

## Document Alias Coverage

Add an alias table to `composition.md` after bases exist. The alias map should
route user wording to the closest recipe and base.

| Document types | Recipe | Base |
|---|---|---|
| Board memo, steering committee pack, executive update, recommendation memo, IC memo | `decision-brief` | `executive-brief` |
| Client proposal, SOW summary, pitch one-pager, pursuit brief | `proposal-pack` | `executive-brief` |
| Client presentation, internal readout, launch narrative | `briefing-deck` | `briefing-deck` |
| CDD, FDD, QoE, ODD, tech DD, cyber DD, AI DD, tax DD, ESG DD, HR DD, vendor DD | `diligence-report` | `diligence-pack` |
| Red-flag report, risk memo, price-adjustment issue summary | `diligence-report` or `decision-brief` | `executive-brief` |
| Data-room request list, Q&A tracker, diligence evidence pack | `qa-packet` | `evidence-dossier` |
| Synergy thesis, value creation plan, margin lever plan | `value-creation-plan` | `decision-workbench` |
| Day 1 plan, 100-day plan, integration roadmap, launch plan | `migration-plan` or `implementation-plan` | `plan-roadmap` |
| Carve-out perimeter, separation plan, TSA schedule, entanglement log | `migration-plan` | `plan-roadmap` |
| Operating model, governance model, process map | `architecture-map` | `system-map` |
| Market study, commercial assessment, competitive landscape | `research-report` | `evidence-dossier` |
| Growth strategy, pricing memo, GTM options, customer segmentation | `decision-brief` or `comparison-workbench` | `decision-workbench` |
| PRD, RFC, product spec, feature spec | `product-spec` | `plan-roadmap` |
| Roadmap, cycle plan, launch plan | `implementation-plan` or `status-report` | `plan-roadmap` |
| Code review, annotated PR, PR writeup | `code-review` | `review-annotation` |
| Module map, system map, data flow, deployment flow | `architecture-map` | `system-map` |
| Design QA, visual QA, source-vs-render review | `design-qa` or `design-qa-detailed` | `review-annotation` |
| UX audit, flow audit, heuristic review | `ux-audit-report` | `review-annotation` |
| Design system reference, component matrix, token sheet | `design-system-reference` | `visual-specimen` |
| Model card, system card, safety eval, red-team report | `system-card` or `eval-report` | `eval-safety` |
| Prompt tuning packet, prompt comparison, eval harness summary | `bounded-workbench` or `eval-report` | `bounded-workbench` |
| Ticket triage board, issue prioritization, feature flag review | `bounded-workbench` | `bounded-workbench` |

## Primitive Basis

Prefer variants and shared archetype styling before adding primitives.

### Variants To Consider First

| Existing primitive | Candidate variant |
|---|---|
| `meta-strip` | `metric` for real sourced KPIs, not fake dashboard numbers |
| `comparison-grid` | `matrix` for options by criteria |
| `milestone-strip` | `dated` for status, incident, integration, and launch timelines |
| `verification-matrix` | `test-suite` for QA/eval evidence |
| `audit-trail` | `references` for compact source lists |
| `copy-export` | `table` export variant, in addition to current `markdown`, `json`, `prompt`, `diff` |
| `state-grid` | `component-matrix` for design system references |
| `motion-proof` | `parameter-comparison` for animation tuning |

### New Primitives To Add

Add these only when a recipe or reference specimen needs them. Most should be
registry rows under existing archetypes, with shared CSS.

| Primitive | Archetype | Why it exists | Required slots |
|---|---|---|---|
| `inline-schematic` | figure | Controlled dependency-free diagrams for architecture, process, deal flow, and explanations | `heading`, `diagram`, `legend`, `caption`, `fallback` |
| `inline-chart` | figure | Sourced charts without Chart.js or canvas dependency | `heading`, `chart`, `data-table`, `caption`, `source` |
| `file-map` | ledger | Scannable map of changed files/modules in code reviews | `path`, `role`, `change`, `risk`, `finding` |
| `issue-ledger` | ledger | Issue register for QA, diligence, design, and triage | `issue`, `severity`, `evidence`, `implication`, `owner`, `status` |
| `red-flag-ledger` | ledger | High-impact diligence red flags distinct from ordinary risks | `flag`, `basis`, `deal-impact`, `confidence`, `next-step` |
| `assumption-register` | ledger | Assumption traceability for strategy, valuation, planning, and evals | `assumption`, `source`, `sensitivity`, `confidence`, `owner` |
| `value-bridge` | figure/ledger | Waterfalls, synergies, bridges, and variance explanations | `baseline`, `bridge-item`, `value`, `source`, `caveat` |
| `workstream-map` | plan/matrix | Workstreams tied to owners, phases, dependencies, and gates | `workstream`, `owner`, `phase`, `dependency`, `gate` |
| `operating-model-map` | schematic | Capability/process/org/data/tech layering | `layer`, `capability`, `owner`, `dependency`, `gap` |
| `quote-board` | evidence | Voice-of-user evidence with provenance and synthesis | `quote`, `speaker-segment`, `theme`, `source`, `confidence` |
| `scenario-pair` | evidence/policy | Ideal/non-ideal examples and rationale for model or policy docs | `scenario`, `input`, `ideal`, `non-ideal`, `rationale` |
| `evaluation-suite` | eval matrix | Suite-level thresholds, samples, results, and caveats | `suite`, `metric`, `threshold`, `result`, `sample`, `date` |
| `capability-matrix` | matrix | Capability by risk by evidence mapping | `capability`, `evidence`, `risk`, `limitation`, `mitigation` |
| `workbench-board` | bounded interaction | Visible cards, filters, and export for triage/prioritization | `column`, `card`, `status`, `filter`, `export` |
| `configuration-diff` | code/config review | Before/after config values and rollout warnings | `key`, `before`, `after`, `risk`, `owner` |
| `prompt-preview` | bounded interaction | Prompt/copy tuning with cases, preview, and export | `prompt`, `variable`, `case`, `preview`, `copy` |

Priority order:

```text
inline-schematic
inline-chart
issue-ledger
assumption-register
value-bridge
file-map
workstream-map
quote-board
scenario-pair
evaluation-suite
workbench-board
prompt-preview
configuration-diff
```

Treat `red-flag-ledger`, `operating-model-map`, and `capability-matrix` as
second-wave additions unless implementation shows they cannot be variants or
specialized uses of `issue-ledger`, `inline-schematic`, and
`comparison-grid`.

## Visual Fidelity Standard

Every recipe should carry a visual fidelity bar:

| Recipe family | Fidelity bar |
|---|---|
| Executive brief | Recommendation, decision needed, risk, and next action are visible in the first viewport. |
| Diligence report | Red flags, evidence quality, and implications are impossible to miss. |
| Product spec | Problem, scope boundary, acceptance criteria, and launch risk are visually distinct. |
| Design QA | Source, render, and recommended fix are visually comparable without reading all prose. |
| System card | Capabilities, limits, eval evidence, and mitigations are clearly separated. |
| Status report | Status, blockers, timeline movement, and decisions needed are scannable in one minute. |
| Bounded workbench | Interaction helps review/export; the document remains readable with JS disabled. |

Build fidelity with:

- strong first viewport;
- restrained typography;
- clear hierarchy;
- high-quality comparison layouts;
- real screenshots and captions;
- contained tables, code, and diagrams;
- accessible status text;
- dark-mode parity;
- print readability;
- no fake dashboards or decorative metrics.

## Bounded Workbench Guardrails

`bounded-workbench` is allowed only as a constrained static artifact.

- JS may sort, filter, copy, or preview.
- No persistence, backend, framework, or hidden state.
- All core data must be visible with JavaScript disabled.
- The interaction must support review/export, not become a general app.
- Validation must include a JS-disabled readable fallback.

## Reference Sheet Direction

Add high-fidelity composite specimens to
[assets/html-artifact-reference.html](assets/html-artifact-reference.html). These
are more useful than hundreds of primitive-only specimens because they teach
visual rhythm.

Candidate composite specimens:

```text
executive brief
diligence report
integration plan
product spec
code review
design QA
design system reference
architecture map
system card / eval report
bounded workbench
```

Keep specimen copy neutral. Do not include source-specific research trails,
provider names, scratch paths, or internal authoring language in visible copy or
copy/export payloads.

## Validator Upgrades

Extend `scripts/validate.mjs` with Node stdlib only. New checks should fail
clearly and keep the skill source coherent.

Planned checks:

1. Every recipe in `recipes.md` is listed in `composition.md`.
2. Every document alias maps to a real recipe.
3. Every base is registered and allowed for `data-base`.
4. Every primitive referenced by recipes exists in the primitive registry.
5. Every `data-primitive` used in the reference sheet exists in the registry.
6. Every registered primitive has a CSS owner, shared archetype owner, or
   explicit `none`.
7. Every `inline-chart` specimen includes visible values or a backing table.
8. Every `bounded-workbench` specimen has a JS-disabled readable fallback.
9. Embedded reference-sheet theme still matches `theme.css`.
10. Visible reference-sheet text and copy/export payloads stay free of authoring
    scaffolding.

This is drift detection, not a build step.

## Implementation Sequence

### Phase 1 - Composition Layer

Update `references/composition.md` with:

- document alias table;
- base registry;
- base chooser;
- recipe-to-base defaults;
- base-to-primitive defaults;
- omission rules.

Update `SKILL.md` to say the runtime choice is:

```text
document type -> recipe -> base -> primitives
```

Do not require `data-base` in generated artifacts until validator support lands.

### Phase 2 - Recipe Expansion

Add the 10 new recipe cards to `references/recipes.md`. Each card should follow
the existing compact shape:

- `Use for:`
- `Source gates:`
- `Default skeleton:`
- `Add only when evidenced:`
- `Avoid:`

Aliases cover long-tail document names; recipes cover reader jobs.

### Phase 3 - Primitive Basis

Add variants first. Add new primitive rows only when a recipe or composite
specimen needs them. Keep most additions under existing archetypes, and add CSS
only for genuinely new visual shapes.

First CSS-heavy candidates:

- `inline-schematic`
- `inline-chart`
- `value-bridge`
- `workbench-board`
- `prompt-preview`

### Phase 4 - Reference Sheet Composites

Add composite specimens to `assets/html-artifact-reference.html` after the
recipe/base/primitive contracts exist. Use neutral scenarios and keep the
visible-copy lint passing.

### Phase 5 - Validator Coherence

Extend `validate.mjs` to enforce aliases, bases, recipe coherence, primitive
registry references, reference sheet coverage, CSS ownership, chart backing
data, and bounded-workbench JS-disabled fallback.

## Review Notes

The attached proposal is directionally right. These adaptations should govern
implementation:

- Current filenames are `design.md`, `validation.md`, and
  `html-artifact-reference.html`; older names should not return.
- `composition.md` already exists, so the next work is extension, not creation.
- `data-base` should be introduced only with base registry and validator
  coverage.
- Add recipe aliases before adding niche recipes.
- Prefer variants or specialized uses for narrowly named primitives until
  examples prove they need their own registry rows.
- Do not vendor external HTML examples. Recreate useful patterns inside the
  canonical theme and reference sheet.
- The external-source claims in the attached response were not re-verified for
  this roadmap; implementation should rely on local source and any refreshed
  research the user explicitly requests.
