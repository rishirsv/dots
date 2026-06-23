# Primitive Catalog

Primitives are the stable `data-primitive` IDs agents use to inspect and revise
an artifact. They are not bespoke components with separate runtimes. Most
primitives are instances of a small archetype grammar plus a registry row that
declares required slots, variants/states, CSS ownership, and typical recipes.

Use [composition.md](composition.md) for recipe and primitive selection,
[authoring.md](authoring.md) for semantic/static output rules, and
[../assets/theme.css](../assets/theme.css) for the actual styling. The
[../assets/html-artifact-reference.html](../assets/html-artifact-reference.html) file is a
visual coverage reference, not the canonical contract.

## Anatomy Contract

Every reusable major block carries exactly one `data-primitive` from the
registry. Internal parts use stable `data-slot` names. Use `data-variant` only
for variants listed in the registry, and `data-state` only for meaningful review
or UI states such as severity, pass/blocked, active, selected, copied, done, or
recommended.

Slot names are CSS and inspection hooks, not reader text. Generated reader copy
must never display primitive names, slot labels, variant labels, `data-*` values,
or "template" chrome.

## Layout Helpers

`stack`, `cluster`, `grid`, `split`, `frame`, `side`, and `table-wrap` are
private layout helpers used inside primitives. Never document them as
primitives, never expose them to readers, and never give them `data-primitive`
values.

## Archetype: shell

Use for page identity, document navigation, first-viewport summary, metadata, and
theme control.

Semantic base:
`main`, `header`, `nav`, `dl`, and `button`.

Common slots:
`header`, `body`, `footer`, `eyebrow`, `title`, `summary`, `item`, `key`,
`value`, `link`, `action`.

Mobile rule:
the page shell stays centered, side/map navigation hides below the documented
breakpoint, title and metadata wrap, and the page never gains horizontal
overflow.

Common primitives:
`artifact-shell`, `hero-summary`, `meta-strip`, `section-nav`, `theme-toggle`.

## Archetype: note

Use for one concise answer, caveat, verdict, warning, or evidence limit.

Semantic base:
`section`, `aside`, or leading `p` with compact body copy.

Common slots:
`body`, `label`, `marker`, `limit`, `impact`.

Mobile rule:
full-width block, free wrapping, no fixed-width marker or status text.

Common primitives:
`tldr`, `callout`, `evidence-limits`.

## Archetype: flow

Use for ordered steps, timelines, dependency paths, decision history, and
revision progressions.

Semantic base:
`ol`, `ul`, or ordered sequence of `section`/`article` rows.

Common slots:
`step`, `index`, `step-title`, `step-body`, `milestone`, `when`, `marker`,
`node`, `depends-on`, `decision`, `rationale`, `connector`.

Mobile rule:
flows stack vertically or scroll internally; connectors stay inside the flow
container.

Common primitives:
`step-flow`, `milestone-strip`, `dependency-map`, `decision-log`,
`revision-strip`.

## Archetype: ledger

Use for structured rows where each row has a risk, claim, check, owner,
constraint, mismatch, token, asset, or budget.

Semantic base:
`section` plus `.table-wrap` and `table`, or a list of cards when the table would
be unreadable on narrow screens.

Common slots:
`head`, `row`, `label`, `value`, `status`, `evidence`, `note`, `severity`,
`proof`.

Mobile rule:
tables scroll inside `.table-wrap` or intentionally collapse to cards; the page
itself never scrolls horizontally.

Common primitives:
`risk-table`, `verification-matrix`, `owner-matrix`, `constraint-ledger`,
`claim-evidence-matrix`, `mismatch-ledger`, `token-delta`, `asset-inventory`,
`performance-budget`.

## Archetype: card-set

Use for discrete findings, options, actions, handoff items, concepts, or prompt
cards where each item benefits from a frame.

Semantic base:
`article`, `figure`, `ol`, `ul`, or responsive grid of cards.

Common slots:
`option`, `finding`, `severity`, `location`, `recommendation`, `action`,
`concept`, `frame`, `concept-label`, `intent`, `prompt-text`, `item`,
`next-step`.

Mobile rule:
cards stack to one column; embedded code, paths, or media are contained.

Common primitives:
`comparison-grid`, `finding-card`, `action-list`, `handoff-packet`,
`concept-gallery`, `imagegen-prompt-card`.

## Archetype: figure

Use for contained diagrams, charts, bridges, and schematics that explain
structure or values without an external rendering library.

Semantic base:
`figure`, `figcaption`, `svg`, `table`, `ol`, `ul`, and fallback prose.

Common slots:
`heading`, `diagram`, `chart`, `data-table`, `legend`, `caption`, `fallback`,
`baseline`, `bridge-item`, `value`, `source`, `caveat`, `layer`,
`capability`, `owner`, `dependency`, `gap`.

Mobile rule:
figures stay inside their frame; diagrams either reflow, scale down, or scroll
inside their own container. Backing values stay visible as text or table rows.

Common primitives:
`inline-schematic`, `inline-chart`, `value-bridge`, `operating-model-map`.

## Archetype: media-proof

Use for screenshots, source/render comparisons, triptychs, annotation pins,
focused crops, viewport evidence, and rendered browser proof.

Semantic base:
`figure`/`figcaption`, responsive grid, ordered list, and positioned markers.

Common slots:
`shot`, `source`, `render`, `revised`, `before`, `after`, `frame`, `caption`,
`pin`, `pin-note`, `viewport`, `width-label`, `check`, `result`, `tool`.

Mobile rule:
media frames use `max-width: 100%`, comparison columns and triptychs stack, and
reels or large captures scroll inside their own containers only.

Common primitives:
`screenshot-gallery`, `screenshot-triptych`, `focused-compare`,
`annotation-pin`, `viewport-matrix`, `render-proof`.

## Archetype: code

Use for source code, diffs, and code-linked explanations.

Semantic base:
`figure`, `figcaption`, `pre`, `code`, `mark`, and optional `details`.

Common slots:
`label`, `code`, `anchor`, `note`, `file`, `hunk`, `comment`.

Mobile rule:
code and diffs keep indentation and scroll horizontally inside their panels.

Common primitives:
`code-panel`, `code-note`, `diff-review`.

## Archetype: design-handoff

Use for design tokens, source manifests, approved copy, QA metadata, fidelity
coverage, and design-system extracts.

Semantic base:
`dl`, `ul`, `table`, `section`, and token/contact-sheet grids.

Common slots:
`item`, `key`, `value`, `dimension`, `dimension-label`, `coverage`, `swatch`,
`chip`, `token-name`, `source`, `source-name`, `source-kind`, `copy`,
`placement`, `group`, `group-label`, `tokens`.

Mobile rule:
metadata and token grids collapse; long paths and approved strings wrap.

Common primitives:
`qa-metadata`, `fidelity-coverage`, `token-swatch`, `source-manifest`,
`allowed-copy-list`, `design-system-extract`.

## Archetype: gate

Use for explicit scope boundaries, acceptance gates, and state coverage grids.

Semantic base:
`section`, checklist, or responsive grid of state cells.

Common slots:
`in-scope`, `out-scope`, `boundary-note`, `criterion`, `gate-status`, `proof`,
`cell`, `state-label`, `state-body`.

Mobile rule:
criteria and state cells stack; status is conveyed by text, not color alone.

Common primitives:
`scope-boundary`, `acceptance-gate`, `state-grid`.

## Archetype: motion

Use only when motion itself needs proof.

Semantic base:
`figure` with a contained demo and text description of reduced-motion behavior.

Common slots:
`demo`, `reduced`, `tokens`, `caption`.

Mobile rule:
the demo stays contained and no content depends on animation.

Common primitives:
`motion-proof`.

## Primitive Registry

| Primitive | Archetype | Required slots | Variants/states | CSS owner | Typical recipes |
|---|---|---|---|---|---|
| `artifact-shell` | shell | `header`, `body` | variant `side` | `core` | all |
| `hero-summary` | shell | `eyebrow`, `title`, `summary` | none | `hero-summary` | all |
| `meta-strip` | shell | `item`, `key`, `value` | variants `cells`, `inline`, `metric` | `meta-strip` | plans, reviews, QA |
| `section-nav` | shell | `link` | variants `map`, `side`, `bar`; state `active` | `section-nav` | long artifacts |
| `theme-toggle` | shell | `action` | root state `data-theme` | `theme-toggle` | all |
| `tldr` | note | `body` | none | `tldr` | `explainer`, `research-report`, `eval-report`, `decision-brief` |
| `callout` | note | `body` | variants `note`, `warning`, `success`, `danger` | `callout` | most recipes |
| `evidence-limits` | note | `limit` | state `evidence-limited` | `qa-comparison` | `research-report`, `design-qa-detailed`, `ux-audit-report`, `eval-report` |
| `step-flow` | flow | `step`, `step-title`, `step-body` | variants `numbered`, `timeline` | `step-flow` | `explainer`, `implementation-plan`, `architecture-map`, `postmortem` |
| `milestone-strip` | flow | `milestone`, `when`, `marker`, `milestone-title`, `milestone-body` | variant `dated`; states `done`, `current`, `upcoming` | `milestone-strip` | `implementation-plan`, `migration-plan` |
| `dependency-map` | flow | `node`, `node-title`, `depends-on` | variants `list`, `graph`; state `blocked` | `planning-document` | `implementation-plan`, `architecture-map`, `migration-plan` |
| `decision-log` | flow | `decision`, `decision-title`, `rationale` | states `accepted`, `superseded`, `proposed` | `planning-document` | `decision-brief`, `postmortem` |
| `revision-strip` | flow | `step`, `frame`, `step-label` | state `recommended` | `qa-comparison` | `design-qa-detailed` |
| `risk-table` | ledger | `head`, `row` | states `high`, `med`, `low` | `risk-table` | `implementation-plan`, `release-readiness`, `postmortem` |
| `verification-matrix` | ledger | `head`, `row`, `check`, `method`, `expected` | variants `cards`, `test-suite`; states `pass`, `blocked`, `pending` | `risk-table` | `implementation-plan`, `release-readiness`, `eval-report` |
| `owner-matrix` | ledger | `head`, `row`, `area`, `owner` | none | `risk-table` | `migration-plan`, `release-readiness`, `postmortem` |
| `constraint-ledger` | ledger | `head`, `row`, `constraint`, `implication` | variant `cards`; states `hard`, `soft` | `planning-document` | `comparison-workbench`, `decision-brief` |
| `claim-evidence-matrix` | ledger | `head`, `row`, `claim`, `evidence`, `source`, `confidence` | variant `cards`; states `high`, `med`, `low` | `claim-evidence-matrix` | `research-report`, `eval-report` |
| `mismatch-ledger` | ledger | `head`, `row`, `region`, `expected`, `actual` | variant `cards`; states `high`, `med`, `low` | `risk-table` | `design-qa-detailed`, `ux-audit-report` |
| `token-delta` | ledger | `head`, `row`, `token-name`, `expected`, `actual` | states `match`, `mismatch` | `risk-table` | `design-qa`, `design-qa-detailed`, `design-handoff-spec` |
| `asset-inventory` | ledger | `head`, `row`, `asset`, `spec` | states `delivered`, `pending` | `risk-table` | `imagegen-concept-packet`, `design-handoff-spec` |
| `performance-budget` | ledger | `head`, `row`, `metric`, `budget`, `actual` | states `within`, `over` | `risk-table` | `release-readiness` |
| `file-map` | ledger | `path`, `role`, `change`, `risk`, `finding` | none | `none` | `code-review`, `migration-plan` |
| `issue-ledger` | ledger | `issue`, `severity`, `evidence`, `implication`, `owner`, `status` | none | `none` | `qa-packet`, `diligence-report`, `ux-audit-report` |
| `red-flag-ledger` | ledger | `flag`, `basis`, `deal-impact`, `confidence`, `next-step` | none | `none` | `diligence-report`, `decision-brief` |
| `assumption-register` | ledger | `assumption`, `source`, `sensitivity`, `confidence`, `owner` | none | `none` | `value-creation-plan`, `product-spec`, `eval-report` |
| `comparison-grid` | card-set | `option`, `option-title`, `option-body` | variants `cards`, `split`, `matrix`; state `recommended` | `comparison-grid` | `explainer`, `comparison-workbench`, `decision-brief` |
| `finding-card` | card-set | `severity`, `location`, `finding`, `recommendation` | states `high`, `med`, `low`, `info` | `finding-card` | `code-review`, `design-qa`, `ux-audit-report` |
| `action-list` | card-set | `action` | variants `checklist`, `ordered`; states `pending`, `blocked`, `done`, `recommended` | `action-list` | plans, reviews, QA, releases |
| `handoff-packet` | card-set | `item`, `next-step` | none | `planning-document` | `implementation-plan`, `design-handoff-spec`, `migration-plan` |
| `concept-gallery` | card-set | `concept`, `frame`, `concept-label` | states `selected`, `rejected` | `imagegen-design-handoff` | `imagegen-concept-packet` |
| `imagegen-prompt-card` | card-set | `intent`, `prompt-text` | none | `imagegen-design-handoff` | `imagegen-concept-packet` |
| `quote-board` | card-set | `quote`, `speaker-segment`, `theme`, `source`, `confidence` | none | `none` | `research-report`, `diligence-report`, `ux-audit-report` |
| `scenario-pair` | card-set | `scenario`, `input`, `ideal`, `non-ideal`, `rationale` | none | `none` | `system-card`, `eval-report` |
| `workbench-board` | card-set | `column`, `card`, `status`, `filter`, `export` | none | `none` | `bounded-workbench`, `status-report` |
| `prompt-preview` | card-set | `prompt`, `variable`, `case`, `preview`, `copy` | none | `none` | `bounded-workbench`, `imagegen-concept-packet` |
| `inline-schematic` | figure | `heading`, `diagram`, `legend`, `caption`, `fallback` | none | `none` | `architecture-map`, `explainer`, `diligence-report` |
| `inline-chart` | figure | `heading`, `chart`, `data-table`, `caption`, `source` | none | `none` | `research-report`, `diligence-report`, `eval-report` |
| `value-bridge` | figure | `baseline`, `bridge-item`, `value`, `source`, `caveat` | none | `none` | `value-creation-plan`, `diligence-report` |
| `operating-model-map` | figure | `layer`, `capability`, `owner`, `dependency`, `gap` | none | `none` | `architecture-map`, `diligence-report` |
| `screenshot-gallery` | media-proof | `shot`, `frame`, `caption` | variants `grid`, `compare`; states `pass`, `blocked` | `screenshot-gallery` | `design-qa`, `ux-audit-report`, `comparison-workbench` |
| `screenshot-triptych` | media-proof | `source`, `render`, `revised` | states `pass`, `blocked`, `evidence-limited` | `qa-comparison` | `design-qa-detailed` |
| `focused-compare` | media-proof | `region-label`, `before`, `after` | states `pass`, `blocked` | `qa-comparison` | `design-qa-detailed`, `comparison-workbench` |
| `annotation-pin` | media-proof | `frame`, `pin`, `pin-note` | states `high`, `med`, `low` | `qa-comparison` | `design-qa-detailed`, `ux-audit-report` |
| `viewport-matrix` | media-proof | `viewport`, `frame`, `width-label` | none | `motion-performance` | `release-readiness`, `design-qa-detailed` |
| `render-proof` | media-proof | `check`, `check-label`, `result` | states `pass`, `fail` | `motion-performance` | `release-readiness` |
| `code-panel` | code | `label`, `code` | variants `dark`, `light` | `code-panel` | `explainer`, `code-review`, `architecture-map` |
| `code-note` | code | `anchor`, `note` | variants `inline`, `margin` | `code-note` | `explainer`, `code-review` |
| `diff-review` | code | `file`, `hunk` | states `add`, `del`, `ctx` | `diff-review` | `code-review` |
| `qa-metadata` | design-handoff | `item`, `key`, `value` | none | `qa-comparison` | `design-qa`, `design-qa-detailed`, `ux-audit-report` |
| `fidelity-coverage` | design-handoff | `dimension`, `dimension-label`, `coverage` | states `checked`, `partial`, `not-checked` | `qa-comparison` | `design-qa-detailed` |
| `token-swatch` | design-handoff | `swatch`, `chip`, `value`, `token-name` | variants `color`, `type`, `radius`, `space` | `token-swatch` | `design-qa`, `design-handoff-spec` |
| `source-manifest` | design-handoff | `source`, `source-name`, `source-kind` | none | `imagegen-design-handoff` | `research-report`, `imagegen-concept-packet`, `design-handoff-spec` |
| `allowed-copy-list` | design-handoff | `copy`, `placement` | none | `imagegen-design-handoff` | `imagegen-concept-packet`, `design-handoff-spec` |
| `design-system-extract` | design-handoff | `group`, `group-label`, `tokens` | variants `tokens`, `components` | `imagegen-design-handoff` | `design-handoff-spec` |
| `scope-boundary` | gate | `in-scope`, `out-scope` | none | `planning-document` | `implementation-plan`, `architecture-map`, `migration-plan` |
| `acceptance-gate` | gate | `criterion`, `gate-status` | states `pass`, `blocked`, `pending` | `planning-document` | `implementation-plan`, `migration-plan`, `release-readiness`, `design-handoff-spec` |
| `state-grid` | gate | `cell`, `state-label`, `state-body` | variant `component-matrix`; states `pass`, `blocked`, `evidence-limited`, `empty`, `loading`, `error` | `planning-document` | `ux-audit-report`, `design-handoff-spec`, `migration-plan` |
| `copy-export` | card-set | `action`, `payload` | variants `markdown`, `json`, `prompt`, `diff`, `table`; state `copied` | `copy-export` | plans, reviews, Image Gen packets |
| `configuration-diff` | code | `key`, `before`, `after`, `risk`, `owner` | none | `none` | `code-review`, `migration-plan`, `release-readiness` |
| `evaluation-suite` | ledger | `suite`, `metric`, `threshold`, `result`, `sample`, `date` | none | `none` | `eval-report`, `system-card`, `release-readiness` |
| `capability-matrix` | ledger | `capability`, `evidence`, `risk`, `limitation`, `mitigation` | none | `none` | `system-card`, `eval-report` |
| `workstream-map` | ledger | `workstream`, `owner`, `phase`, `dependency`, `gate` | none | `none` | `implementation-plan`, `migration-plan`, `status-report` |
| `audit-trail` | shell | `entry` | variant `references` | `audit-trail` | `explainer`, `research-report`, `eval-report`, `postmortem` |
| `motion-proof` | motion | `demo`, `reduced` | variant `parameter-comparison`; state `reduced-motion` | `motion-performance` | motion-sensitive artifacts |

## Adding A Primitive

Add a new primitive only when the pattern recurs across recipes or is central to
a reader job. A new primitive needs:

- a stable `data-primitive` ID;
- an archetype;
- required slots;
- variants or states if any;
- a CSS owner region from `theme.css`, or `none`;
- at least one consuming recipe or clear cross-recipe use;
- reference sheet coverage.

Most additions should be one registry row. Add a new archetype only when the
primitive introduces a genuinely new structural grammar.
