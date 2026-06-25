# Judge Rubric

Use this shared rubric for static skill-quality reviews. A Judge review scores
the portable skill payload plus structural validation. It is static evidence,
not a behavioral eval suite.

For payload contamination and maintainer-placement checks, read
[payload-hygiene.md](payload-hygiene.md) before assigning final scores.

## Phases

| Review phase | Review focus | How scored |
|---|---|---|
| **Discovery** | Discovery and task fit: trigger boundaries, completeness, specificity, conflict risk, and user-visible outcome expectations. | LLM-judged, 4 dims x 0-3 |
| **Implementation** | Runtime guidance: actionability, workflow clarity, progressive disclosure, and directive quality. | LLM-judged, 5 dims x 0-3 |
| **Validation** | CLI checks from `<meta-skill-root>/scripts/metaskill validate`: structural integrity and authoring lint. | Validation command output |

Discovery % = total / 12. Implementation % = total / 15. Validation % =
checks passed / total. Overall Judge Review Score is the rounded average of the
three percentages.

## Score Calibration

| Score | Meaning |
|---|---|
| 3 | Strong, specific, ready for repeated agent use. Minor wording would not change behavior. |
| 2 | Usable but meaningfully improvable. An agent could still select/run it, but there is a concrete weakness. |
| 1 | Weak or risky. May be selected wrongly, produce inconsistent work, or force inference. |
| 0 | Missing, misleading, or actively unsafe for the dimension. |

## Shared Scoring Rules

- Cite the skill's own text for every dimension. Name the weak phrase, section,
  reference, or example; do not settle for "make it clearer."
- Review runtime language end to end. Check the main body, examples, linked
  references, agent metadata, fixtures, scripts, assets, and visible/copyable
  payload text that define the same behavior.
- Treat every shipped file as runtime surface. Source-specific demo text in a
  shipped fixture is still runtime contamination.
- Separate maintainer scaffolding from shipped copy. Runtime payloads should not
  expose system/developer/meta prompt language, skill-building terminology, or
  internal validation machinery unless that language is the user's real output.
- Check the opening contract first. The first prose block after the title should
  state the job, default path, and main boundary in plain language.
- Judge relative to skill type. Pattern/reference skills need clear
  organization; procedural or destructive skills need ordered steps and gates.
- Treat validation as structural evidence. Passing validation does not prove the
  semantic quality of the skill.

## Discovery

Question: based on the description, can an agent find and select this skill at
the right time?

| Dimension | Question | Scoring guidance | Anti-patterns |
|---|---|---|---|
| **Specificity** | Names a concrete recurring job, not a broad topic? | 3 concrete and scoped; 2 understandable but broad; 1 vague/category-level; 0 absent/misleading. | domain named but not the task object; vague capability terms |
| **Completeness** | Says both what it does and when to use / not use it? | 3 what/when/not-for clear; 2 one part thin; 1 major trigger or boundary missing; 0 unusable. | no `not for` boundary; describes solution category, not problem/handoff |
| **Trigger Term Quality** | Includes natural terms users would actually say? | 3 strong natural and domain terms; 2 mostly technical/internal; 1 sparse; 0 not discoverable. | missing realistic phrasing; system or provider plumbing terms |
| **Distinctiveness / Conflict Risk** | Avoids overlap with nearby or generic skills? | 3 clear niche and exclusions; 2 usable with some overlap; 1 high conflict risk; 0 actively conflicts. | overlaps adjacent skills; workflow steps baked into description |

## Implementation

Question: does the skill give agents clear, useful runtime guidance?

| Dimension | Question | Scoring guidance | Anti-patterns |
|---|---|---|---|
| **Conciseness** | Lean enough to read during work? | 3 tight and purposeful; 2 somewhat redundant; 1 hard to scan; 0 bloated/confusing. | motivation, framework tours, citations, paragraph-long warnings |
| **Actionability** | Tells the agent what to do or produce next? | 3 concrete steps/outputs/examples/checks; 2 usable but abstract; 1 mostly principles; 0 no operational guidance. | bare command with no output shape; "be clear/comprehensive" |
| **Workflow Clarity** | Main path and important branching clear? | 3 clear default path and checkpoints; 2 mostly clear; 1 ambiguous; 0 no workflow. | taxonomy debates, contradicted route names, branches that do not change behavior |
| **Progressive Disclosure** | Optional details linked, not bloating the body? | 3 well-signaled references; 2 acceptable but uneven; 1 details hidden or overstuffed; 0 broken/missing structure. | long examples inline; weak references to necessary material |
| **Directive Quality** | Directive over wisdom, generalized, plainly named? | 3 directive, reasoned, generalized; 2 mostly; 1 heavy motivation or overfit; 0 teaching prose or contradictions. | cute labels, system/policy text, overfit examples, stale negative rules |

## Payload Hygiene Score Caps

Use [payload-hygiene.md](payload-hygiene.md) before final scoring. Apply these
caps until the finding is cleaned or explicitly classified as an allowed runtime
dependency:

- Provider names, research-session provenance, raw commands, thread/workbench
  paths, or source-specific copy in shipped payload: cap **Directive Quality** at
  1.
- Contaminated bundled demos, fixtures, templates, or assets: cap
  **Progressive Disclosure** at 2.
- Visible HTML, fixture labels, or copy/export payloads exposing internal
  anatomy, prompt roles, local paths, or maintainer vocabulary: cap
  **Directive Quality** at 1 and **Progressive Disclosure** at 2.
- Maintainer, package-author, validator-author, roadmap, migration, or
  developer-maintenance sections in runtime payload for a non-maintenance skill:
  cap **Directive Quality** at 1 and **Progressive Disclosure** at 2.
- Contamination in the description or opening contract: cap **Trigger Term
  Quality** at 2 and **Workflow Clarity** at 2.

A review with unresolved payload contamination or maintainer-placement failures
should not score above 90 overall unless the review explains why each finding is
an allowed runtime dependency.

## Validation

Run:

```sh
<meta-skill-root>/scripts/metaskill validate <skill-dir> --json
```

This checks skill structure and mechanical authoring lint. Warnings and failures
do not count as passed checks. If a recurring semantic check seems missing,
record a validation follow-up; do not claim the validator already proves it.

## Output

Return the review in chat unless artifact writes are allowed. When saved
artifacts are allowed, write the same content to
`<project>/.<skill-name>/judge-review.md`:

- Overall Judge Review Score and phase percentages
- Discovery assessment and scored table, ending in `Total X / 12`
- Implementation assessment and scored table, ending in `Total X / 15`
- Payload hygiene and placement audit result from
  [payload-hygiene.md](payload-hygiene.md)
- Validation result and Validation %
- Combined findings, prioritized by behavior risk

A Judge review is evidence, not source-edit approval. Source edits require
explicit approval for a concrete change or a direct edit request.
