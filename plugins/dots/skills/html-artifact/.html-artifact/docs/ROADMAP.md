# HTML Artifact Roadmap

This roadmap captures the next expansion of `html-artifact` after the recipe,
base, primitive, and validation refactor. It is durable planning material, not
runtime instructions for ordinary artifact generation. Runtime guidance remains
in [SKILL.md](../../SKILL.md),
[references/composition.md](../../references/composition.md),
[references/recipes.md](../../references/recipes.md),
[references/primitives.md](../../references/primitives.md),
[references/authoring.md](../../references/authoring.md),
[references/design.md](../../references/design.md), and
[references/validation.md](../../references/validation.md).

This hidden workbench directory must remain excluded from packaged skill
payloads. Verify package boundaries when changing workbench paths, hidden docs,
or plugin packaging rules.

## Product Direction

Keep `html-artifact` as a high-fidelity static document system for grounded
professional work products: explainers, implementation plans, code reviews,
research reports, QA packets, decision briefs, diligence reports, product specs,
system cards, and bounded review workbenches.

The skill should grow through:

- document aliases that route user wording to reader jobs;
- recipe profiles that define source gates and default skeletons;
- visual bases that shape first-viewport rhythm;
- reusable primitives with stable anatomy;
- rendered browser QA and honest evidence limits.

It should not grow by copying example HTML files, adding one primitive for every
deliverable name, or turning recipes into validator-enforced filler checklists.

## Current Baseline

The current source already has:

- `SKILL.md` routing through reader job -> recipe -> base -> primitives.
- `references/composition.md` as the runtime selection surface.
- `references/composition.md` with a recipe chooser, visual base registry, base
  chooser, recipe base defaults, base primitive defaults, alias map, archetype
  chooser, and omission rules.
- `references/recipes.md` with 26 profile-style recipes.
- `references/primitives.md` with archetype grammar, a Primitive Registry, and
  the `action-list`, figure, workbench, evaluation, and diligence-oriented
  primitives.
- `references/authoring.md` with semantic HTML rules, primitive anatomy, static
  output rules, a polish and tightness pass, primitive adaptation rules,
  portable payload hygiene, dark-mode rules, and anti-patterns.
- `references/design.md` for visual judgment.
- `references/validation.md` for rendered browser validation, including
  recipe-fit, polish, dark-mode, 320px reflow, and JS-disabled checks.
- `assets/theme.css` as the canonical runtime style source.
- `assets/html-artifact-reference.html` as the rendered reference and coverage
  specimen.
- `scripts/validate.mjs` checking registry closure, recipe and base coherence,
  alias mappings, reference specimen coverage, embedded theme parity, bounded
  workbench fallback, inline-chart backing data, visible-copy hygiene, and local
  link health.

This roadmap extends that structure instead of replacing it.

## Operating Model

Use four layers:

| Layer | Purpose | Current source |
|---|---|---|
| Document wording | What the user asks for | Alias rows in `composition.md` |
| Recipe | Reader job, source gates, default sections | Recipe cards in `recipes.md` |
| Base | First viewport and visual rhythm | Visual Base Registry in `composition.md` |
| Primitive | Semantic, inspectable building block | Primitive Registry in `primitives.md` |

Generated artifacts should set both `data-artifact` and `data-base` on the
page shell:

```html
<main data-artifact="diligence-report" data-base="diligence-pack" data-primitive="artifact-shell">
```

`data-artifact` identifies the reader job. `data-base` identifies the visual
composition pattern. `data-primitive` identifies reusable semantic sections.

## Completed Since Previous Roadmap

The previous roadmap was directionally right, but much of it has now shipped:
the alias map, visual base registry, recipe expansion, `data-base`, new
primitive rows, composite specimens, dark-mode parity, print behavior, chart
support, type tokens, spacing tokens, reference-theme parity checks, and many
validator checks already exist in the current skill source.

Future work should therefore not re-plan the whole system. It should tighten the
remaining drift points, improve rendered evidence, and prove the newer recipes
with grounded examples.

## Remaining Roadmap

### 1. Close Raw-Value And Token Enforcement Gaps

The current validator enforces the main theme contract, but a few escape hatches
remain for practical reasons. The next source-quality pass should decide which
exceptions are truly needed and shrink the rest.

- Replace raw inline-SVG demo colors in `assets/html-artifact-reference.html`
  with theme tokens or documented neutral demo tokens so the raw-hex rule matches
  the shipped-file policy.
- Review the current raw spacing exceptions in `scripts/validate.mjs` and either
  convert them to role tokens (`--space-page-y`, `--space-wide-gap`,
  `--space-marker-nudge`) or keep them as clearly named geometry exceptions.
- Decide whether reference-sheet chrome should be checked by the same raw
  spacing/type policy as canonical theme CSS. If yes, extend validation to local
  chrome while still permitting media-query breakpoints and fixed specimen
  geometry.
- Keep token enforcement scoped to shipped skill files. Do not police arbitrary
  user-authored artifact changes beyond the guidance and rendered QA checks.

### 2. Add Contract-Drift Checks

The highest-value structural work is making the expanded recipe/base/primitive
system easier to maintain.

- Add a maintainer note to `composition.md` explaining when to add an alias, when
  to add a recipe, and when to use an existing recipe with a different base.
- Tighten validator failures around duplicate or conflicting alias intent.
- Check that every base in `Visual Base Registry` appears in at least one recipe
  default and at least one reference composite.
- Check that each `Base Primitive Defaults` primitive exists in the registry.
- Consider checking that recipe default skeletons use only known primitives
  while allowing ordinary prose outside backticks.

### 3. Improve Rendered Reference Evidence

The reference sheet now proves coverage; the next pass should make it better at
teaching visual rhythm and catching layout regressions.

- Inspect `assets/html-artifact-reference.html` at desktop, about 375px, 320px,
  dark mode, print preview, and JS-disabled reading.
- Record a short maintainer handoff note after broad visual changes: viewport
  widths checked, overflow result, dark-mode result, print/JS-disabled result,
  and any fixture-family gaps.
- Deepen the composite specimens for `executive-brief`, `diligence-report`,
  `product-spec`, `design-qa`, `system-card-eval-report`, and
  `bounded-workbench`.
- Keep visible copy generic and reader-safe: no provider names, scratch paths,
  session IDs, stale research URLs, or authoring scaffolding in visible copy or
  copy/export payloads.

### 4. Stress-Test Newer Recipes With Grounded Examples

The recipe set now covers many reader jobs. The next content pass should prove
that newer recipes are useful without encouraging padding.

Use small grounded fixtures or manual dry runs for:

| Recipe family | Stress-test question |
|---|---|
| `status-report` | Can it show progress, blockers, decisions, and next actions without fake metrics? |
| `qa-packet` | Can it separate tested scope, failures, retest state, and evidence limits? |
| `briefing-deck` | Can it feel like a static deck while remaining one accessible page? |
| `product-spec` | Can it keep problem, scope, acceptance, and launch risk distinct? |
| `proposal-pack` | Can it avoid sales filler and expose scope assumptions clearly? |
| `diligence-report` | Can it surface thesis, red flags, evidence quality, and follow-up needs? |
| `value-creation-plan` | Can it handle value levers without inventing synergy numbers? |
| `design-system-reference` | Can it show tokens, components, states, and accepted copy from real source? |
| `bounded-workbench` | Can it stay readable and useful with JavaScript disabled? |

When a dry run exposes repeated structure that the current registry cannot
express, prefer a documented variant or shared archetype styling before adding a
new primitive.

### 5. Promote Or Retire `none` CSS Owners

Several newer primitives are registered with CSS owner `none`. That is useful
while their shape is still mostly table/list/card semantics, but it should not
hide repeated styling needs.

Review these primitives after recipe stress tests:

```text
file-map
issue-ledger
red-flag-ledger
assumption-register
quote-board
scenario-pair
workbench-board
prompt-preview
inline-schematic
inline-chart
value-bridge
operating-model-map
configuration-diff
workstream-map
```

Decision rule:

- Keep `none` when the primitive reads well with generic table, figure, card,
  code, or layout helper styling.
- Move to an existing CSS owner when the primitive is a specialized use of a
  current region.
- Add a new CSS region only when the primitive has a recurring visual shape that
  cannot be expressed through existing regions without muddying them.

If `theme.css` changes, sync the embedded theme block in
`assets/html-artifact-reference.html` and rerun validation.

### 6. Strengthen Bounded Workbench Guardrails

`bounded-workbench` is allowed only as a constrained static artifact.

- JS may sort, filter, copy, preview, or calculate a small visible dataset.
- No persistence, backend, framework, or hidden state.
- All core data must be visible with JavaScript disabled.
- Interaction must support review or export; it must not become a general app.
- Validation must include a JS-disabled readable fallback and a browser check of
  the interactive controls.

Next work should add one richer reference specimen that demonstrates filtering
or preview while keeping the complete content readable as static HTML.

### 7. Polish The Reader Surface

These are high-leverage visual improvements, but they should follow the
raw-value cleanup so the token contract remains honest.

- Add scroll affordances to contained scrollers: thin styled scrollbars plus
  subtle edge shadows/fades for tables, code, diffs, chart areas, and reels.
- Add a sidenote or margin-note primitive only if grounded dry runs show a real
  editorial use case; collapse inline on mobile and preserve JS-disabled
  reading.
- Strengthen first-class print/PDF behavior: running header only if it stays
  simple, link URL disclosure where appropriate, break-inside rules, and
  ink-friendly code.
- Wire the existing `performance-budget` primitive to real byte measurements in
  validation only after fixture outputs provide useful calibration.
- Use `content-visibility: auto` only for heavy below-the-fold specimens after
  browser inspection confirms no scroll or find-in-page regressions.

### 8. Evals And Regression Evidence

Group eval work here so it can be tackled later as one focused lane instead of
leaking into every polish task.

#### Eval Scope

- Treat hidden eval fixtures as maintainer evidence, not runtime instructions
  for ordinary artifact generation.
- Keep evals tied to the skill's static-document contract: self-contained HTML,
  readable with JS disabled, source-grounded content, contained overflow, and no
  external runtime.
- Do not build a general eval platform, dashboard, or browser automation suite.

#### Eval Tasks

- Refresh `.html-artifact/evals.json` around the current recipe/base system:
  design QA, UX audit, Image Gen concept packet, migration plan,
  release-readiness, eval report, postmortem, status report, and system card.
- Add or refresh fixture artifacts for the newer recipes that need proof.
- Add structural checks only when they catch real drift: required anatomy,
  backed `inline-chart` data tables, workbench JS-disabled fallback, screenshot
  dimensions/lazy loading, and source/evidence limits.
- Add an evaluation report fixture that demonstrates `evaluation-suite`,
  `capability-matrix`, `claim-evidence-matrix`, and evidence-limit handling.
- Consider a lightweight visual-regression/eval triad later: curated cases,
  rendered screenshot review, and score rubric. Keep it manual or
  tool-assisted; do not add Playwright as a roadmap dependency.

## Maintainer Closeout

For broad recipe, primitive, or theme changes, use a predictable maintainer
closeout:

```text
node plugins/dots/skills/html-artifact/scripts/validate.mjs
plugins/meta-skill/scripts/metaskill validate plugins/dots/skills/html-artifact --json
scripts/verify.sh
```

When a change affects rendered layout, also inspect
`assets/html-artifact-reference.html` in a browser at desktop, about 375px, and
320px. Record any overflow, dark-mode, JS-disabled, print, or fixture-family
gaps in the handoff.

Do not add a new browser automation dependency just to satisfy this roadmap.
Rendered inspection with the available browser tool remains the contract.
