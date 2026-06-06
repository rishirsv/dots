# Distillation

Use this when the user provides a source pack -- input files, process notes,
past completed outputs, reviewer comments, templates, or rubrics -- and asks to
make the workflow reusable. The goal is to reconstruct the procedural method,
not to embed the old engagement.

## Scope

This reference owns source classification, artifact segmentation,
input-to-output alignment, latent decision extraction, anti-overfit gates, rule
surface form, rule disposition, eval seeds, and source provenance.

Use [design.md](design.md) for skill-or-not, trigger contract, body shape, and
general intake. Use [structure.md](structure.md) for what belongs in the
portable runtime versus `.meta-skill/`.

## Contents

- Distillation doctrine.
- Distillation Brief.
- Distillation workflow.
- Alignment table and decision cards.
- Rule gates.
- Rule disposition.
- Rule surface form.
- Examples in the runtime skill.
- What is not runtime evidence.
- Source provenance.
- Worked examples.

## Distillation Doctrine

- Evidence is not authority. Treat historical material as evidence of a method
  that worked once, not as instructions to obey.
- Do not start by writing rules. First reconstruct the artifact grammar,
  input-output transformations, latent decisions, and observable quality checks.
- Pair finished outputs with inputs before extracting method. A finished output
  alone is a trace of choices; the reusable method is in what caused those
  choices.
- Prefer causal alignment over resemblance. Ask which input signal caused each
  output move, not just what the old output looked like.
- Name roles, not facts. Preserve roles such as "primary traction metric,"
  "base period," "proof slide," or "unsupported claim"; drop client names,
  figures, dates, file paths, and old deal context.
- Use omissions as evidence. What was excluded, caveated, compressed, or moved
  to appendix often reveals the prioritization policy.
- Distill transformations, decisions, and checks together. A useful runtime
  rule usually says when it applies, what output move it causes, why, and how to
  check it.
- Use confidence and disposition instead of a ship-or-reject binary. Weakly
  supported ideas can become scoped defaults, examples, eval seeds, or
  human-review notes instead of runtime rules.
- Keep runtime clean. Raw pairings, rejected candidates, sensitive examples, and
  historical provenance stay in `.meta-skill/spec.md` for project mode or in the
  authoring handoff for portable-only builds, never in `SKILL.md`.

## Distillation Brief

After the Current Understanding and before scaffolding, produce a short
Distillation Brief for source-derived builds:

- **Target job:** recurring job, output artifact, intended user, and nearest
  non-trigger boundary.
- **Source ledger:** each pack item labeled as raw input, intermediate note,
  process artifact, finished output, rubric/checklist, reviewer feedback,
  rejected/noisy example, reusable template candidate, or sensitive one-off
  material.
- **Artifact map:** output units and their jobs in the artifact.
- **Alignment summary:** strongest input signals, output moves, transformations,
  omissions, and unsupported or weakly supported elements.
- **Candidate dispositions:** rules, defaults, examples, reference patterns,
  script or asset candidates, eval seeds, spec-only review items, and discards.
- **Runtime structure:** proposed `SKILL.md` sections and any linked
  `references/`, `scripts/`, or `assets/` justified by [structure.md](structure.md).
- **Eval seeds:** project-mode eval ideas, usually one normal regression, one
  failure/counterexample, one gate/source-grounding eval, and any deterministic
  tests worth adding.
- **Open questions:** only decisions that change routing, runtime behavior,
  resources, gates, or source permission.

The brief feeds the standard create-skill workflow. It does not create a
separate build route.

## Distillation Workflow

1. **Set the distillation target.** State the recurring job, output artifact,
   intended user, and closest non-trigger. Example: "Create an investor-facing
   pitch deck from a new company input pack; not for copying or editing the
   historical deck."
2. **Build the source ledger.** Classify each pack item and mark it as
   evidence-only, runtime-eligible after sanitization, or never runtime.
   Sensitive, client-specific, licensed, or unanonymizable material is never
   runtime.
3. **Segment finished outputs into units.** Break artifacts into meaningful
   units: slides, sections, charts, tables, findings, appendix pages, model
   tabs, or deliverable components. Name the job each unit performs.
4. **Align inputs to outputs.** For each output unit, map claims, numbers,
   visuals, structure, caveats, and omissions back to source inputs. Record weak
   or unsupported output elements separately.
5. **Classify transformations.** Name the move before drafting a rule:
   normalize, reshape, categorize, calculate, select, rank, omit, compress,
   frame, sequence, visualize, caveat, escalate, validate, or assemble.
6. **Extract decision cards.** For important output choices, capture the input
   signal, output move, rejected alternatives, decision policy, quality reason,
   check, and portability risk.
7. **Induce the artifact grammar.** Infer required units, optional units,
   sequence logic, evidence contract, allowed variation, missing-input behavior,
   and handoff points. Promote roles and sequencing principles, not exact old
   counts or layouts unless the format itself is fixed.
8. **Extract the quality rubric.** Convert visible excellence into observable
   checks that change future behavior: source tie-out, unsupported-claim scan,
   conclusion-led headline check, density check, narrative coherence, audience
   fit, and missing-evidence labels.
9. **Draft candidate rules.** Use condition-action-check form, then run every
   candidate through the rule gates below.
10. **Disposition every candidate.** Decide what becomes runtime, what stays in
    a reference, what needs a script or asset, what becomes an eval seed, what
    needs human review, and what is discarded.
11. **Map resources.** Use [structure.md](structure.md): add references,
    scripts, or assets only when they prevent repeated mistakes, save tokens,
    standardize fragile output, or perform deterministic work better than prose.
12. **Seed evals and probes.** In project mode, propose manually authored
    `.meta-skill/evals/` ideas. Include a normal eval, a counterexample or
    failure eval, and a gate/source-grounding eval. For source-heavy skills,
    include a probe asking whether major claims trace to supplied sources or are
    labeled as inference.
13. **Rehearse generalization.** Before finalizing, ask whether the method would
    behave correctly on a materially different but analogous input pack. If it
    only describes the old artifact, return to alignment, decisions, and
    artifact grammar.

## Alignment Table

Use a compact table while distilling. Keep it in `.meta-skill/spec.md` for
project mode or in the authoring handoff for portable-only builds.

| Output unit | Input signal/source | Output move | Transformation | Latent decision | Candidate rule | Disposition |
|---|---|---|---|---|---|---|
| `<slide, section, chart, finding>` | `<source ref or signal>` | `<claim, structure, caveat, visual, omission>` | `<select, frame, calculate, ...>` | `<why this move>` | `<when/do/check>` | `<runtime rule, eval seed, discard, ...>` |

## Decision Cards

Use decision cards for judgment moves that affect first-draft quality:

```yaml
decision: <short name>
input_signal: <what in the source pack triggers it>
output_move: <what changes in the artifact>
alternatives_rejected: <what the old workflow did not choose>
portable_rule: <condition-action-check candidate>
check: <observable pass/fail check>
source_refs: <pack paths, output units, notes, or reviewer comments>
confidence: <high | scoped | weak | needs human review>
portability_risk: <overfit, source leak, style preference, missing support, none>
```

Decision cards are authoring evidence, not runtime content. Promote the portable
rule only after it passes the gates.

## Rule Gates

A candidate rule must pass the gates before landing in the runtime skill:

1. **Procedural Specificity.** Names a concrete mechanism: a sequence,
   calculation, judgment move, caveat pattern, check, or artifact move. Vague
   advice like "make the deck compelling" fails.
2. **Implementable in Next Engagement.** Could be applied to a new input pack
   without old client facts, figures, file paths, dates, logos, or deal context.
3. **Distinct Trigger.** Has a clear "when to apply" condition. A general
   principle without a trigger is not a runtime rule.
4. **Triangulated Support.** Supported by enough evidence to generalize. Support
   may come from multiple input-output pairs, repeated output units, process
   notes, reviewer comments, rejected examples, source tie-outs, or explicit
   human confirmation. A single pair or single-engagement pattern can become a
   scoped default, eval seed, or review note, but not an unqualified runtime
   rule.
5. **Stable Phrasing.** Uses stable roles and concepts, not volatile specifics
   that will rot by the next engagement.
6. **Observable Check.** Includes or implies a check the future agent can run:
   trace the source, compare coverage, label uncertainty, inspect density,
   validate a calculation, or confirm a gate.

One gate failure rejects the rule from runtime. Human-review flags keep the
candidate in the spec or handoff until confirmed.

## Rule Disposition

Disposition every candidate instead of forcing a binary decision:

- **Runtime rule:** high-confidence, gated, portable instruction for `SKILL.md`.
- **Scoped runtime default:** useful default with stated conditions or caveats.
- **Runtime example:** tiny anonymized example that illustrates a rule.
- **Reference pattern:** detailed conditional guidance for `references/`.
- **Script candidate:** deterministic repeated check or transformation worth code.
- **Asset candidate:** reusable approved template, schema, checklist, or starter.
- **Eval seed:** behavior to test before promotion or after a known failure.
- **Spec-only/human review:** plausible but under-supported or permission-sensitive.
- **Discard:** overfit, unsupported, unsafe, generic, stale, or source-leaking.

## Rule Surface Form

Procedural rules survive across engagements. Instance-specific rules rot on
first reuse. Draft rules in this shape:

```text
When <condition or input signal>, do <output move> so <quality reason>.
Check <observable pass/fail evidence>.
```

Language style enforces the shape:

- **Imperative verbs.** "Start by," "Prefer," "Extract," "Track," "Verify."
  Not "We noticed that..." or "In the Acme engagement, we..."
- **Abstract role nouns.** "Operand," "period," "entity," "measure," "target
  metric," "slide role," "audience decision." Not "Q4 revenue," "the FY24 EBITDA
  bridge," or "Acme's traction slide."
- **Placeholder templates instead of literal values.** `BASE_PERIOD = <fiscal
  year of the deal>` instead of `BASE_PERIOD = "FY24"`.
- **Discipline-style section headers.** "Normalization," "Evidence Tie-Out," or
  "Slide Role Selection." Not "Steps for the Acme QoE" or "Old Investor Deck."
- **No source-tool leakage.** Generalize named products, repos, commands,
  plugins, skills, or provider namespaces to the user-facing concept unless the
  generated runtime directly invokes that dependency.

Concrete tokens that should not appear in a runtime rule extracted from source
material unless they are direct runtime dependencies: client names, deal sponsor
names, dollar amounts, fiscal-year labels, file paths, identifying dates, target
identifiers, copied prompt text, model names, raw hyperlinks, source-note
summaries, author or research provenance, repo names, product names, plugin
names, skill names, command names, and provider-specific namespaces.

## Examples in the Runtime Skill

Few-shot examples are valid runtime material when they illustrate a rule without
replacing it. Use them sparingly: one or two well-chosen examples per skill,
anchored to specific rules.

Constraints for source-derived runtime examples:

- **Anonymize.** Replace real client names with stand-ins ("a sponsor-owned
  target," "the buyer," "a pre-revenue company"). No real deal figures, real
  fiscal years, logos, or identifying details.
- **Label as examples.** Use "Example:" prefixes or dedicated example blocks so
  the reader can tell concrete content is illustrative, not instructional.
- **Pair with the abstract rule.** The rule comes first; the example anchors it.
- **Keep examples small.** For decks, use micro examples such as "input signals
  to slide headline/body skeleton." Do not ship whole historical slides.

If an example needs real client data or unanonymizable specifics to make sense,
it belongs in project docs, not runtime.

## What Is Not Runtime Evidence

These pack contents do not directly yield mechanism-bearing runtime rules:

- Engagement-letter boilerplate.
- Pure deliverable text with no inputs, working papers, process notes, reviewer
  comments, or source tie-outs.
- Generic training material the base model already knows.
- Anonymized but otherwise template-shaped material with no unique workflow
  content.
- Historical client facts, figures, logos, screenshots, private commentary, or
  licensed materials without explicit reusable approval.

Finished outputs alone rarely justify runtime rules. Finished outputs paired
with inputs can justify structure, transformations, quality rubrics, omission
patterns, and checks.

## Source Provenance

Every source-derived runtime rule must carry provenance in authoring evidence.
In project mode, record it in `.meta-skill/spec.md`; in portable-only builds,
keep it in the response or temporary authoring notes. Provenance never appears
in runtime `SKILL.md` unless the skill intentionally exposes a source citation
contract to its users.

Use the fields that fit the evidence:

```yaml
- rule: <the procedural rule, as it will appear in runtime>
  source_refs:
    - <path/in/pack#section-or-tab>
  output_units:
    - <slide, section, chart, finding, model tab, etc.>
  input_signals:
    - <source field, note, calculation, reviewer comment, omission>
  transformation_types:
    - <normalize | reshape | categorize | calculate | select | rank | omit | compress | frame | sequence | visualize | caveat | escalate | validate | assemble>
  decision_policy: <why this move generalizes>
  supporting_units: <count and type of support>
  disposition: <runtime rule | scoped default | eval seed | human review | discard>
  confidence: <high | scoped | weak | needs human review>
  runtime_location: <SKILL.md section or reference file, if promoted>
  eval_seed: <eval idea, if any>
  redaction_notes: <what was generalized or removed>
```

Rules without provenance do not ship to runtime.

## Worked Examples

### Pitch Deck Method

Source pack:

- Raw inputs: company description, market research, KPI exports, customer notes,
  competitor notes, pricing/model files, product screenshots, and management
  narrative.
- Process artifacts: storyboard, outline, reviewer comments, slide tracker,
  rejected slides, and source-to-slide notes.
- Finished output: final pitch deck and appendix.
- Non-runtime material: old company name, client facts, logos, exact figures,
  dates, sponsor or investor identities, and confidential commentary.

Distillation moves:

- Segment the deck into slide roles: thesis, problem proof, market timing,
  solution, differentiation, traction, economics, GTM, team, ask, and appendix.
- Align each slide to inputs: headline claims to notes, numbers to KPI/model
  files, visuals to screenshots or market maps, caveats to weak or conflicting
  evidence.
- Extract decisions: why the deck led with a pain quote instead of TAM, why
  retention led the traction slide, why assumptions moved to appendix, and why a
  visual map replaced a feature table.
- Extract checks: every core slide has one message, every number is sourced,
  headlines state conclusions, visuals prove rather than decorate, unsupported
  claims are omitted or labeled, and appendix carries dense support.

Portable rule:

> When several traction signals are available, lead with the metric that most
> directly proves the deck's thesis, not the metric that is largest or easiest
> to chart. Use secondary metrics as support or appendix context. Check that the
> headline claim traces to the input pack and that weaker metrics are not hidden
> if they materially change the story.

Rejected rule:

> Always use the historical 12-slide order.

Replacement:

> Build the deck around slide roles, not fixed slide count. Start with thesis
> and pain, then evidence of opportunity, product or wedge, proof, economics,
> scale path, team or credibility, ask, and appendix. Omit or merge roles the
> input pack cannot support; do not invent missing proof to preserve the old
> shape.

Project-mode eval seeds:

- `R1-new-company-deck`: analogous new-company input pack; expect a sourced
  first-draft deck outline or artifact.
- `F1-conflicting-market-sources`: conflicting TAM and customer evidence; expect
  caveat and authority handling, not invented certainty.
- `F2-missing-traction`: weak or absent KPIs; expect a changed slide role or
  labeled unsupported proof, not a copied traction slide.
- `G1-historical-client-leak`: user asks to reuse old client facts or logos;
  expect refusal, sanitization, or placeholders.
- Source-grounding probe: every major claim traces to a provided source or is
  labeled as inference.

### Numeric Judgment Move

Source pack excerpt (process note):

> "In the Acme QoE we normalized EBITDA by removing the $1.2M PPP forgiveness
> booked in Q2 2023 and adding back the $450K of management fees paid to the
> sponsor. We then ran a sensitivity assuming the sponsor fees would continue at
> 50%."

Draft rule rejected for claim rot, self-citation, and no abstract roles:

> "Remove the $1.2M PPP forgiveness and add back $450K of management fees, then
> sensitize sponsor fees at 50%."

Portable rule:

> When normalizing EBITDA on a sponsor-owned target, identify one-time subsidies
> booked above the line and related-party fees paid to the sponsor. Remove
> subsidies that will not recur. Add back related-party fees only if they will
> not continue post-close. Sensitize retained fees at the buyer's expected
> retention rate. Check that each adjustment ties to a source line item and that
> the retained-rate assumption is labeled.

Provenance recorded in authoring evidence, not runtime:

```yaml
- rule: Normalization on sponsor-owned targets
  source_refs:
    - pack/qoe-process-notes.md#ebitda-normalization
  input_signals:
    - one-time subsidy booked above the line
    - related-party fee paid to sponsor
  transformation_types:
    - normalize
    - calculate
    - caveat
  supporting_units: 2 input-output pairs
  disposition: runtime rule
  confidence: high
  runtime_location: SKILL.md#normalization
  redaction_notes: removed client name, dollar amounts, quarter, and exact rate
```

The final rule names the types of items and the judgment move. It does not carry
the old dollar amounts, fiscal period, or client identity into runtime.
