# Composition Quick Sheet

Use this after `SKILL.md` and before opening the deeper references. It is the
runtime selection surface for building one grounded, self-contained HTML
artifact without loading the whole catalog for every decision.

## Default Load Path

1. Name the reader job and the one decision, understanding, or action the
   artifact should produce.
2. Map the user's document wording through the alias table when it is more
   specific than the recipe names.
3. Pick one recipe from the chooser below.
4. Pick the default visual base for that recipe unless the source clearly needs
   a different base.
5. Read that recipe card in [recipes.md](recipes.md).
6. Read [primitives.md](primitives.md) for the archetype grammar and primitive
   registry. The registry is intentionally small enough to scan whole.
7. Compose the smallest set of primitives that makes the source easier to read,
   compare, verify, or act on.
8. Author with [authoring.md](authoring.md), inline
   [../assets/theme.css](../assets/theme.css), then verify with
   [validation.md](validation.md).

Do not use [../assets/html-artifact-reference.html](../assets/html-artifact-reference.html) or
`theme.css` as primitive-selection inputs. The reference sheet is a visual reference and
coverage surface; `theme.css` is the canonical style source.

## Recipe Chooser

| Reader job | Recipe |
|---|---|
| Explain a dense concept, code path, policy, article, bug, or architecture | `explainer` |
| Turn an objective into phases, risks, dependencies, and verification | `implementation-plan` |
| Help a human understand and act on a concrete diff or changed file set | `code-review` |
| Answer a research question and show evidence, contradictions, and gaps | `research-report` |
| Compare source design against rendered implementation | `design-qa` |
| Build a full design QA packet with coverage, triptychs, and implementation actions | `design-qa-detailed` |
| Audit an existing product flow from ordered screenshots | `ux-audit-report` |
| Compare options, approaches, or before/after states for a decision | `comparison-workbench` |
| Present generated concepts, source inputs, and reusable prompts | `imagegen-concept-packet` |
| Hand an accepted design to implementation | `design-handoff-spec` |
| Explain system structure, boundaries, dependencies, and flow | `architecture-map` |
| Plan a move from one state/system/process to another | `migration-plan` |
| Decide whether a release is ready to ship | `release-readiness` |
| Report evaluated cases, scores, evidence, and limits | `eval-report` |
| Frame a choice, constraints, recommendation, and change conditions | `decision-brief` |
| Reconstruct an incident with timeline, cause, impact, and corrective actions | `postmortem` |
| Report progress, blockers, decisions, and next actions | `status-report` |
| Package test evidence, failures, retest status, and acceptance proof | `qa-packet` |
| Build a static slide-like narrative readable as a page | `briefing-deck` |
| Specify a product feature, scope boundary, design, acceptance, and launch risk | `product-spec` |
| Present a proposal, scope, approach, timeline, and assumptions | `proposal-pack` |
| Review diligence thesis, red flags, evidence quality, and implications | `diligence-report` |
| Explain value levers, synergies, scenarios, and initiative roadmap | `value-creation-plan` |
| Document tokens, components, states, assets, and approved copy | `design-system-reference` |
| Describe system behavior, capabilities, risks, eval evidence, and mitigations | `system-card` |
| Provide a tiny review/edit/export surface that remains readable without JS | `bounded-workbench` |

## Visual Base Registry

Bases describe the page's first viewport and visual rhythm. They are not
templates or dependencies; choose one base, then fill it with recipe-supported
primitives.

| Base | Visual shape | Used for |
|---|---|---|
| `executive-brief` | Recommendation, status, key facts, decision needed, next action | Board memo, steering memo, decision brief, proposal one-pager, leadership update |
| `evidence-dossier` | Dense source-grounded report with navigation, claim evidence, issue ledger, and evidence limits | Research, diligence, evals, safety reviews, market studies |
| `decision-workbench` | Options by criteria, recommendation, sensitivity, change conditions | Vendor comparison, build/buy/partner, strategic options, architecture choices |
| `plan-roadmap` | Phases, milestones, workstreams, dependencies, gates, owners, risks | Implementation plan, migration plan, integration plan, launch plan |
| `diligence-pack` | Thesis, red flags, evidence quality, value or risk bridge, data-room trace | Diligence, synergy review, vendor review |
| `system-map` | Contained schematic, flow, dependencies, failure paths, glossary | Architecture map, operating model, runbook, process map |
| `review-annotation` | Annotated files, screenshots, diffs, findings, and recommended fixes | Code review, UX audit, design QA, behavior review |
| `visual-specimen` | Gallery, variants, states, tokens, screenshots, acceptance bar | Design system reference, handoff spec, visual exploration, component QA |
| `eval-safety` | Capability and risk matrix, test suites, thresholds, failures, mitigations, limits | System card, safety eval, release readiness |
| `bounded-workbench` | Small task-specific interaction with visible data and copy/export support | Triage board, prompt tuner, feature flag review, backlog board |
| `briefing-deck` | Static section-as-slide document, readable as a page, optional tiny navigation JS | Client presentation, weekly update, launch narrative, strategy brief |

## Base Chooser

| Need | Base |
|---|---|
| Make a leadership decision quickly | `executive-brief` |
| Weigh evidence, confidence, contradictions, or source limits | `evidence-dossier` |
| Compare options against criteria | `decision-workbench` |
| Move work through phases and gates | `plan-roadmap` |
| Surface diligence thesis, issues, and deal implications | `diligence-pack` |
| Explain system structure or operating flow | `system-map` |
| Review concrete implementation, screenshots, or diffs | `review-annotation` |
| Hand off or inspect a visual system | `visual-specimen` |
| Report capability, risk, evals, and mitigation | `eval-safety` |
| Let a reader filter, preview, tune, or export a small visible dataset | `bounded-workbench` |
| Present a narrative as slide-like sections without becoming a slide app | `briefing-deck` |

## Recipe Base Defaults

| Recipe | Default base |
|---|---|
| `explainer` | `evidence-dossier` |
| `implementation-plan` | `plan-roadmap` |
| `code-review` | `review-annotation` |
| `research-report` | `evidence-dossier` |
| `design-qa` | `review-annotation` |
| `design-qa-detailed` | `review-annotation` |
| `ux-audit-report` | `review-annotation` |
| `comparison-workbench` | `decision-workbench` |
| `imagegen-concept-packet` | `visual-specimen` |
| `design-handoff-spec` | `visual-specimen` |
| `architecture-map` | `system-map` |
| `migration-plan` | `plan-roadmap` |
| `release-readiness` | `eval-safety` |
| `eval-report` | `eval-safety` |
| `decision-brief` | `executive-brief` |
| `postmortem` | `evidence-dossier` |
| `status-report` | `executive-brief` |
| `qa-packet` | `evidence-dossier` |
| `briefing-deck` | `briefing-deck` |
| `product-spec` | `plan-roadmap` |
| `proposal-pack` | `executive-brief` |
| `diligence-report` | `diligence-pack` |
| `value-creation-plan` | `decision-workbench` |
| `design-system-reference` | `visual-specimen` |
| `system-card` | `eval-safety` |
| `bounded-workbench` | `bounded-workbench` |

## Base Primitive Defaults

| Base | Typical primitives |
|---|---|
| `executive-brief` | `hero-summary`, `meta-strip`, `tldr`, `comparison-grid`, `decision-log`, `action-list` |
| `evidence-dossier` | `section-nav`, `claim-evidence-matrix`, `evidence-limits`, `audit-trail`, `source-manifest` |
| `decision-workbench` | `comparison-grid`, `constraint-ledger`, `risk-table`, `callout`, `copy-export` |
| `plan-roadmap` | `scope-boundary`, `milestone-strip`, `dependency-map`, `owner-matrix`, `verification-matrix`, `acceptance-gate` |
| `diligence-pack` | `tldr`, `claim-evidence-matrix`, `risk-table`, `constraint-ledger`, `evidence-limits`, `audit-trail` |
| `system-map` | `scope-boundary`, `step-flow`, `dependency-map`, `code-panel`, `constraint-ledger` |
| `review-annotation` | `qa-metadata`, `screenshot-gallery`, `focused-compare`, `finding-card`, `mismatch-ledger`, `action-list` |
| `visual-specimen` | `source-manifest`, `concept-gallery`, `token-swatch`, `design-system-extract`, `state-grid`, `acceptance-gate` |
| `eval-safety` | `verification-matrix`, `claim-evidence-matrix`, `risk-table`, `evidence-limits`, `render-proof` |
| `bounded-workbench` | `comparison-grid`, `state-grid`, `copy-export`, `action-list`, `callout` |
| `briefing-deck` | `section-nav`, `hero-summary`, `meta-strip`, `step-flow`, `comparison-grid`, `callout` |

## Document Alias Map

Use aliases for user wording, not as extra recipes.

| Document wording | Recipe | Base |
|---|---|---|
| Board memo, steering committee pack, executive update, recommendation memo, IC memo | `decision-brief` | `executive-brief` |
| Client proposal, SOW summary, pitch one-pager, pursuit brief | `proposal-pack` | `executive-brief` |
| Client presentation, internal readout, launch narrative | `briefing-deck` | `briefing-deck` |
| CDD, FDD, QoE, ODD, tech DD, cyber DD, AI DD, tax DD, ESG DD, HR DD, vendor DD | `diligence-report` | `diligence-pack` |
| Red-flag report, risk memo, price-adjustment issue summary | `diligence-report` | `executive-brief` |
| Data-room request list, Q&A tracker, diligence evidence pack | `qa-packet` | `evidence-dossier` |
| Synergy thesis, value creation plan, margin lever plan | `value-creation-plan` | `decision-workbench` |
| Day 1 plan, 100-day plan, integration roadmap, launch plan | `migration-plan` | `plan-roadmap` |
| Carve-out perimeter, separation plan, TSA schedule, entanglement log | `migration-plan` | `plan-roadmap` |
| Operating model, governance model, process map | `architecture-map` | `system-map` |
| Market study, commercial assessment, competitive landscape | `research-report` | `evidence-dossier` |
| Growth strategy, pricing memo, GTM options, customer segmentation | `decision-brief` | `decision-workbench` |
| PRD, RFC, product spec, feature spec | `product-spec` | `plan-roadmap` |
| Roadmap, cycle plan, launch plan | `implementation-plan` | `plan-roadmap` |
| Code review, annotated PR, PR writeup | `code-review` | `review-annotation` |
| Module map, system map, data flow, deployment flow | `architecture-map` | `system-map` |
| Design QA, visual QA, source-vs-render review | `design-qa-detailed` | `review-annotation` |
| UX audit, flow audit, heuristic review | `ux-audit-report` | `review-annotation` |
| Design system reference, component matrix, token sheet | `design-system-reference` | `visual-specimen` |
| Model card, system card, safety eval, red-team report | `system-card` | `eval-safety` |
| Prompt tuning packet, prompt comparison, eval harness summary | `bounded-workbench` | `bounded-workbench` |
| Ticket triage board, issue prioritization, feature flag review | `bounded-workbench` | `bounded-workbench` |

## Archetype Chooser

| Need | Archetype | Typical primitives |
|---|---|---|
| Page identity, navigation, metadata, theme | `shell` | `artifact-shell`, `hero-summary`, `meta-strip`, `section-nav`, `theme-toggle` |
| One emphasized answer, caveat, verdict, or note | `note` | `tldr`, `callout`, `evidence-limits` |
| Ordered lifecycle, phases, dependencies, history | `flow` | `step-flow`, `milestone-strip`, `dependency-map`, `decision-log`, `revision-strip` |
| Structured rows with statuses, risks, owners, evidence, assets, budgets | `ledger` | `risk-table`, `verification-matrix`, `owner-matrix`, `constraint-ledger`, `mismatch-ledger`, `token-delta`, `asset-inventory`, `performance-budget` |
| Discrete findings, options, actions, handoffs, prompts, concepts | `card-set` | `finding-card`, `comparison-grid`, `action-list`, `handoff-packet`, `imagegen-prompt-card`, `concept-gallery` |
| Source/render captures, screenshots, pins, responsive proof | `media-proof` | `screenshot-gallery`, `screenshot-triptych`, `focused-compare`, `annotation-pin`, `viewport-matrix`, `render-proof` |
| Code, diffs, and code-linked explanation | `code` | `code-panel`, `code-note`, `diff-review` |
| Visual design tokens, source inputs, copy, and system extraction | `design-handoff` | `qa-metadata`, `fidelity-coverage`, `token-swatch`, `source-manifest`, `allowed-copy-list`, `design-system-extract` |
| Scope boundaries, acceptance checks, and state coverage | `gate` | `scope-boundary`, `acceptance-gate`, `state-grid` |
| Motion or fallback proof | `motion` | `motion-proof` |

## Composition Rules

- Start with `artifact-shell`, `hero-summary`, and `theme-toggle`.
- Set `data-artifact` to the chosen recipe and `data-base` to the chosen base.
- Add `section-nav` only for four or more meaningful sections.
- Use recipe defaults as suggestions, not required filler.
- Let the base guide first viewport composition and rhythm; let the recipe
  decide reader job and source gates.
- Omit unsupported defaults instead of padding the artifact.
- State evidence limits when an omitted default changes the reader's confidence.
- Prefer ledgers for repeated structured rows and cards for discrete objects.
- Prefer focused media proof when full-screen captures are too coarse.
- Keep copy/export secondary; the artifact must read fully without JS.
- Do not expose primitive names, slot labels, or authoring machinery to readers.

## Omission Rule

If a recipe default needs evidence the source does not provide, omit the block or
state the evidence limit. Never invent owners, dates, metrics, risks, sources,
screenshots, prompts, token values, acceptance criteria, or verification proof
because the recipe has a place for them.
