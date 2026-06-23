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

## Next Steps

### 1. Harden The Expanded Contract

The highest-value next work is not more recipes. It is making the expanded
recipe/base/primitive system easier to maintain and harder to drift.

- Add a short maintainer note to `composition.md` explaining when to add an
  alias, when to add a recipe, and when to use an existing recipe with a
  different base.
- Tighten validator failures around duplicate or conflicting alias intent, such
  as two rows that route nearly identical wording to different recipes.
- Add a validator check that every base in `Visual Base Registry` appears in at
  least one recipe default and at least one reference composite.
- Add a validator check that each `Base Primitive Defaults` primitive exists in
  the registry.
- Keep validator checks as local source coherence only. They should not become a
  required build step for generated user artifacts.

### 2. Stress-Test The New Recipes

The recipe set now covers 26 reader jobs. The next pass should prove that the
newer recipes are useful without encouraging padding.

Use small grounded fixtures or one-off manual dry runs for:

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
| `system-card` | Can it separate capabilities, limits, eval evidence, and mitigations? |
| `bounded-workbench` | Can it stay readable and useful with JavaScript disabled? |

When a dry run exposes repeated structure that the current registry cannot
express, prefer a documented variant or shared archetype styling before adding a
new primitive.

### 3. Promote Or Retire `none` CSS Owners

Several newer primitives are registered with CSS owner `none`. That is useful
while their shape is still mostly table/list/card semantics, but it should not
hide repeated styling needs.

Review these primitives after the recipe stress tests:

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
evaluation-suite
capability-matrix
workstream-map
```

Decision rule:

- Keep `none` when the primitive reads well with generic table, figure, card,
  code, or layout helper styling.
- Move to an existing CSS owner when the primitive is just a specialized use of
  a current region.
- Add a new CSS region only when the primitive has a recurring visual shape that
  cannot be expressed through existing regions without muddying them.

If `theme.css` changes, sync the embedded theme block in
`assets/html-artifact-reference.html` and rerun validation.

### 4. Deepen Composite Specimens

The reference sheet now has composite specimens. The next pass should make those
specimens better at teaching visual rhythm, not merely proving coverage.

Focus on:

- `executive-brief`: first viewport recommendation, decision needed, evidence
  state, and next action.
- `diligence-report`: thesis, red flags, evidence quality, implications, and
  follow-up questions.
- `product-spec`: problem, scope boundary, acceptance criteria, and launch risk.
- `design-qa`: source/render/fix comparison without dashboard chrome.
- `system-card-eval-report`: capabilities, limits, eval evidence, mitigations,
  and unknowns.
- `bounded-workbench`: visible dataset, controls, export, and JS-disabled
  fallback.

Composite specimens should use neutral scenarios, real-looking compact data,
honest caveats, and no provider names, scratch paths, session IDs, or authoring
scaffolding in visible copy or copy/export payloads.

### 5. Strengthen Bounded Workbench Guardrails

`bounded-workbench` is allowed only as a constrained static artifact.

- JS may sort, filter, copy, preview, or calculate a small visible dataset.
- No persistence, backend, framework, or hidden state.
- All core data must be visible with JavaScript disabled.
- Interaction must support review or export; it must not become a general app.
- Validation must include a JS-disabled readable fallback and a browser check of
  the interactive controls.

Next work should add at least one richer reference specimen that demonstrates
filtering or preview while keeping the complete content readable as static HTML.

### 6. Improve Maintainer Regression Evidence

For broad recipe, primitive, or theme changes, use a predictable maintainer
closeout:

```text
node plugins/dots/skills/html-artifact/scripts/validate.mjs
scripts/verify.sh
```

When a change affects rendered layout, also inspect
`assets/html-artifact-reference.html` in a browser at desktop, about 375px, and
320px. Record any overflow, dark-mode, JS-disabled, or fixture-family gaps in
the handoff.

Do not add a new browser automation dependency just to satisfy this roadmap.
Rendered inspection with the available browser tool remains the contract.

## Backlog

### Contract Coherence

- Add duplicate or conflicting alias detection.
- Check that every base has at least one default recipe and one composite
  specimen.
- Check that every primitive in `Base Primitive Defaults` exists in the
  registry.
- Consider checking that recipe default skeletons use only known primitives
  while allowing prose words outside backticks.

### Recipe And Alias Refinement

- Review whether `Red-flag report` should route to `diligence-report` with
  `executive-brief`, or whether a `decision-brief` route should remain explicit.
- Review whether `Roadmap, cycle plan, launch plan` should sometimes route to
  `status-report` when the user's wording is reporting current state rather than
  planning future work.
- Add aliases only after seeing real user wording that does not map cleanly.

### Primitive Refinement

- Decide whether `red-flag-ledger` should remain distinct from `issue-ledger` or
  become a diligence-specific use of it.
- Decide whether `capability-matrix` should remain distinct from
  `claim-evidence-matrix` plus `risk-table`.
- Decide whether `operating-model-map` needs a dedicated visual treatment or can
  stay a structured `inline-schematic` pattern.
- Add CSS owners only after repeated specimens prove the need.

### Reference Sheet

- Keep the reference sheet as a visual coverage surface, not the source of
  runtime selection rules.
- Prefer composite specimens that show recipe/base rhythm over dozens of
  isolated micro-examples.
- Keep visible copy generic and reader-safe.
- Preserve dark-mode parity and embedded theme parity.

## Review Notes

The previous roadmap was directionally right, but several items are now shipped:
the alias map, visual base registry, recipe expansion, `data-base`, new
primitive rows, composite specimens, and many validator checks already exist in
the current skill source.

Future implementation should therefore prioritize:

1. contract drift detection;
2. recipe stress tests with grounded examples;
3. selective CSS ownership decisions;
4. stronger composite specimens;
5. bounded workbench fallback proof.

Do not reintroduce older names, external example vendors, generated dashboard
chrome, or source-specific research trails. The roadmap should stay grounded in
the local skill source unless the user explicitly asks for refreshed external
research.
