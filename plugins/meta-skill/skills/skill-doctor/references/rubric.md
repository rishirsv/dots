# Judge

The house-style scoring rubric. A Judge review produces `judge-review.md` in the
workbench with an **Overall Judge Review Score** plus per-phase and
per-dimension scores, so "improve my skill" gets a number, not just prose.

Judge against concrete house style, not abstract principles.

> **Boundary:** the doctor scores the three *static* phases below and averages
> them. Averaging across *live eval scenarios* (running the skill many times) is
> out of scope here — this is a static review.

## Phases

| Review phase | Review focus | How scored |
|---|---|---|
| **Discovery** | Discovery and task-fit: trigger boundaries, completeness, specificity, conflict risk, user-visible outcome expectations. | LLM-judged, 4 dims × 0–3 |
| **Implementation** | Runtime guidance: actionability, workflow clarity, progressive disclosure, and directive quality (directives over wisdom, reasons, plain names). | LLM-judged, 5 dims × 0–3 |
| **Validation** | CLI checks from `<meta-skill-root>/scripts/metaskill validate`: structural integrity and authoring lint. | Validation command output |

## Score Calibration

Use strict but fair scoring.

| Score | Meaning |
|---|---|
| **3** | Strong, specific, ready for repeated agent use. Minor wording would not change behavior. |
| **2** | Usable but meaningfully improvable. An agent could still select/run it, but there is a concrete weakness. |
| **1** | Weak or risky. May be selected wrongly, produce inconsistent work, or force the agent to infer missing process. |
| **0** | Missing, misleading, or actively unsafe for the dimension. |

**Math.** Discovery % = total / 12 (4 dims). Implementation % = total / 15
(5 dims). Validation % = checks passed / total (from `<meta-skill-root>/scripts/metaskill validate --json`).
**Overall Judge Review Score = rounded average of the Discovery,
Implementation, and Validation percentages.**

## Scoring notes

- **Cite the skill's own text.** Every dimension's reasoning quotes or names
  specific content — the exact description phrase for Discovery, the exact
  section/example for Implementation. Name the weak phrase; never settle for
  "make it clearer."
- **Review runtime language end to end.** Penalize awkward product language,
  lane names used as verbs, category arguments, metaphors, prompt-policy
  phrasing, stale terms, and duplicated cautions when plain workflow guidance
  would be clearer. Check the main body, examples, and linked references that
  define the same behavior; do not stop at the description or title.
- **Treat every shipped file as runtime surface.** Review assets, examples,
  templates, agent prompts, and HTML fixture text as future user- or
  agent-facing payload, not as harmless scratch evidence. Source-specific demo
  text in a shipped fixture is still runtime contamination.
- **Separate maintainer scaffolding from shipped copy.** Visible examples,
  reference fixtures, copy/export payloads, and reader-facing docs should not
  expose system/developer/meta prompt language, skill-building terminology, or
  internal validation machinery unless that language is the user's real output.
- **Check the opening contract first.** The first prose block after the title
  should tell the agent what this skill helps it do, the default operating path,
  and the main boundary in plain language. Penalize intro blocks that stitch
  together purpose, mechanics, philosophy, slogans, and lane boundaries without
  a clear runtime contract.
- **Lead with the verdict.** Each phase assessment opens with the overall
  judgment, then names the *single* main weakness.
- **Judge relative to skill type.** A reference/pattern skill earns Workflow
  Clarity through clear, well-organized sections and needs no step checkpoints;
  a procedural or destructive skill must show ordered steps and validation
  checkpoints. Don't penalize a pattern skill for lacking a linear workflow, and
  don't pass a destructive skill that lacks gates.
- **Conciseness assumes competence.** Reward skills that skip basics (what React
  or TypeScript *are*) and get straight to actionable patterns; penalize bloat
  that re-explains what the agent already knows.
- **Validation is a precondition.** A hard structural *Fail* (invalid
  frontmatter, missing body) makes the judged scores unreliable — resolve it
  before trusting Discovery/Implementation. Warnings don't block.

## Payload Hygiene Sweep

Before assigning final Judge scores, inspect the full shipped skill payload:

- `SKILL.md`
- linked references
- `agents/` prompts or metadata
- scripts, examples, templates, assets, and fixtures
- user-visible text inside HTML, Markdown examples, screenshots-as-code, or
  other bundled artifacts
- copy/export payloads, fixture labels, first-viewport text, alt text, button
  text, and other strings a future reader could see or copy

Build a task-local contamination query from the evidence you are reviewing, then
run it across the skill directory with `rg -n --hidden -S`. Do not bake incident
names, provider names, author names, source URLs, or one-off project terms into
this rubric; derive them from the current review packet and keep them in the
review output only.

The scan must cover these classes:

- provider or model names that are not direct runtime dependencies
- copied user prompt text, prompt-policy text, or tool transcript language
- raw research URLs, commands, and source-provenance notes
- one-off report paths, workbench paths, thread IDs, rollout IDs, or task IDs
- named people, articles, companies, or source titles preserved from research
  when the shipped skill should be reusable
- version labels or scratch artifact names that imply a draft/research lineage
- system/developer/user prompt-role terms, "meta" language, or policy phrasing
  that is not part of the target skill's actual user-facing job
- skill-authoring or maintainer terms leaking into reusable reader examples,
  such as "skill", "agent", "runtime", "template machinery", internal data
  attributes, validator names, fixture names, or local reference paths, when the
  example should read like a normal user artifact
- planning scaffolding labels such as "goals", "non-goals", "roadmap",
  "migration plan", or "big bet" when they are inherited from a source prompt
  or design discussion instead of being the artifact's natural reader contract

Record the sweep in the review output with:

- `Payload hygiene: pass` or `Payload hygiene: fail`
- terms or classes scanned
- allowed hits, with why they are real runtime dependencies or harmless examples
- findings, with file paths and the smallest cleanup
- visible/copyable surfaces checked, including any HTML fixtures and export
  payloads

### Runtime vs Maintainer Placement Audit

Before final scoring, audit every heading in `SKILL.md` and every linked runtime
reference. For each section, ask: "Would a future agent need this while using
the skill on a user's task?"

Flag sections whose primary audience is the skill maintainer, package author,
validator author, or future skill editor. Examples include adding new primitives
or recipes, package hygiene, release or dist rules, validator internals, hidden
workbench management, roadmap planning, developer maintenance, migration notes,
and external-system implementation boundaries.

Those sections belong in `.<skill-name>/docs/`, validators, package docs,
maintainer notes, or another non-runtime surface. They belong in the portable
runtime payload only when the target skill's actual user-facing job is skill
maintenance.

Record this audit in the review output with:

- `Placement audit: pass` or `Placement audit: fail`
- headings or linked references checked
- allowed maintainer-facing hits, with why the target skill needs them at
  runtime
- findings, with file paths, section headings, and whether to move, remove, or
  rewrite the material

Score caps:

- If shipped payload contains provider names, research-session provenance, raw
  commands, thread/workbench paths, or source-specific copy that future users or
  agents could see, cap **Directive Quality** at 1 until cleaned.
- If bundled demos, fixtures, templates, or assets contain contaminated example
  text, cap **Progressive Disclosure** at 2 until cleaned.
- If visible HTML, fixture labels, or copy/export payloads expose internal
  anatomy, prompt roles, local paths, or skill-maintainer vocabulary, cap
  **Directive Quality** at 1 and **Progressive Disclosure** at 2 until cleaned.
- If maintainer, package-author, validator-author, roadmap, migration, or
  developer-maintenance sections appear in the runtime payload for a
  non-maintenance skill, cap **Directive Quality** at 1 and **Progressive
  Disclosure** at 2 until moved, removed, or rewritten.
- If contamination appears in the description or opening contract, cap
  **Trigger Term Quality** at 2 and **Workflow Clarity** at 2 until cleaned.
- A review with unresolved payload contamination should not score above 90
  overall unless the findings are explicitly classified as allowed runtime
  dependencies.
- A review with unresolved maintainer/developer placement failures should not
  score above 90 overall unless the target skill's actual runtime job is skill
  maintenance and the review explains why the section belongs there.

## Discovery

**Question:** Based on the skill's description, can an agent find and select it
at the right time?

Write a 2–4 sentence overall assessment *before* the table — cover trigger
clarity, natural user language, exclusions, and overlap risk. Do not restate the
table.

| Dimension | Question | Scoring guidance | Anti-patterns (lower the score) |
|---|---|---|---|
| **Specificity** | Names a concrete recurring job, not a broad topic? | 3 concrete and scoped; 2 understandable but broad; 1 vague/category-level; 0 absent/misleading. | domain named but not the task object; vague capability terms |
| **Completeness** | Says both what it does and when to use / not use it? | 3 what/when/not-for clear; 2 one part thin; 1 major trigger or boundary missing; 0 unusable. | no `not for` boundary; describes the solution category, not the problem/handoff |
| **Trigger Term Quality** | Includes natural terms users would actually say? | 3 strong natural + domain terms; 2 mostly technical/internal; 1 sparse trigger language; 0 not discoverable. | missing real user phrases / file types; system or provider plumbing terms |
| **Distinctiveness / Conflict Risk** | Avoids overlap with nearby or generic skills? | 3 clear niche + exclusions; 2 usable with some overlap; 1 high conflict risk; 0 actively conflicts. | overlaps adjacent skills; workflow steps baked into the description |

## Implementation

**Question:** Does the skill give agents clear, useful runtime guidance?

Write a 2–4 sentence overall assessment *before* the table — cover runtime path,
output contract, reference strategy, stop/ask behavior, and whether guidance
would change future agent behavior. Do not restate the table.

| Dimension | Question | Scoring guidance | Anti-patterns (lower the score) |
|---|---|---|---|
| **Conciseness** | Lean enough to read during work? | 3 tight and purposeful; 2 somewhat redundant/verbose; 1 hard to scan; 0 bloated/confusing. | motivation, framework tours, citations; paragraph-long warnings |
| **Actionability** | Tells the agent what to do or produce next? | 3 concrete steps/outputs/examples/checks/commands; 2 usable but abstract; 1 mostly principles; 0 no operational guidance. | bare command with no output shape or pass/fail; "be clear / comprehensive" |
| **Workflow Clarity** | Main path and important branching clear? | 3 clear default path + checkpoints; 2 mostly clear with gaps; 1 ambiguous sequencing; 0 no workflow. Cap at 2 when the opening contract is indirect, stitched together, or contradicted by later terms; cap at 1 when the runtime job, default path, or lane boundary remains unclear. | over-rigid long process; branches that don't change behavior; opening block describes the doc, debates taxonomy, or mixes purpose/mechanics/philosophy instead of stating the job; route names drift between body, examples, and references |
| **Progressive Disclosure** | Optional details linked, not bloating the body? | 3 well-signaled local references; 2 acceptable but uneven; 1 details hidden or overstuffed; 0 broken/missing structure. | long examples inline; everything stuffed into SKILL.md |
| **Directive Quality** | Directive over wisdom; *why* for non-obvious rules; generalized; plainly named? | 3 directive, reasoned, generalized, plain section names; 2 mostly, with some wisdom/shouting/overfit; 1 heavy motivation, stacked ALL-CAPS, or overfit to instances; 0 teaching-prose or contradictory rules. | wisdom-not-directives; stacked MUST/ALL-CAPS shouting; overfit to specific values; house-jargon section names; cute or metaphorical phrasing where a plain term would work; awkward lane-as-verb phrasing; system or policy text instead of workflow guidance; rules that don't earn their place |

## Validation

Run `<meta-skill-root>/scripts/metaskill validate <skill-dir> --json`, which executes the
canonical validation checks from the Meta Skill package modules and prints a
combined pass-rate. Two task groups today:

- skill structure validation — `frontmatter_valid`, `name_field`,
  `description_field`, `frontmatter_unknown_keys` (Warning if any),
  `skill_md_line_count` (≤ 500), `compatibility_field`, `allowed_tools_field`,
  `metadata_field`, `metadata_version`, `license_field` (optional — absent =
  Pass), `body_present`.
- authoring lint — the *mechanical* authoring anti-patterns:
  `description_length` (≤ 500 Pass / ≤ 1024 Warning), `description_third_person`,
  `description_no_workflow_steps` (the "dangerous shortcut"), `hard_command_density`
  (stacked MUST/ALL-CAPS), `dead_references` (broken local links).

Validation % = Pass count / total across all tasks. Warning and Fail do not
count as Pass. If a recurring check seems missing, record a Meta-Skill
validation follow-up with the failing pattern and proposed shared check; do not
change validator, CLI, or package code from a Judge review. Judgment
anti-patterns (wisdom-vs-directive, jargon names, contradictions) stay in the
scored dimensions above, not here.

*Future validation checks (not yet implemented — note, don't fake-pass):*
artifact integrity, deprecated-surface avoidance.

## Review Focus Areas

Use the relevant focus areas while producing a Judge review or diagnosing a
reported failure.

- **Activation** — trigger clarity, realistic phrasing, near misses, non-trigger boundary.
- **Runtime clarity** — default path, output contract, stop/ask points, final checks.
- **Opening contract** — first runtime block states the job, default path, and
  boundary plainly before deeper mechanics or philosophy.
- **Terminology consistency** — route names, output labels, examples, and linked
  references use the same plain vocabulary; stale names and near-synonyms are
  called out as review findings.
- **Resources** — linked references/scripts/assets, dependency clarity, source leakage, stale files.
- **Runtime contamination** — copied user prompt text, model/provider names, raw research links, author/source provenance, source-specific reference titles, thread IDs, one-off file paths or artifact names, and source-note prohibitions living in the payload instead of reusable behavior.
- **Language polish** — awkward product phrases, lane names used as verbs,
  metaphorical wording, duplicated cautions, stale terms, and taxonomy debates
  that make the workflow harder to follow.
- **Controls** — user files as data, user gates, external writes, package/publish gates.
- **Eval evidence** — captured validation results and any saved failure evidence.
- **Review score** — the `judge-review.md` Judge Review Score, Discovery, Implementation, Validation, and combined findings.

## Worked example

A Discovery review of a React + TypeScript skill — note the output shape
(**Reasoning + Score** per dimension, a leading assessment, a **Total / 12**)
and that each reason cites the skill's own wording:

> Strong description: clear niche (React + TypeScript), explicit trigger
> guidance, good keyword coverage, distinct from generic React/TypeScript
> skills. Main weakness: the capabilities stay somewhat abstract.

| Dimension | Reasoning | Score |
|---|---|---|
| Specificity | Names the domain and some actions ("building components", "typing hooks") but key terms ("type-safe patterns", "routing integration") stay vague. | 2 / 3 |
| Completeness | Answers both *what* and *when*, quoting each from the description. | 3 / 3 |
| Trigger Term Quality | Natural terms a developer would say: "React 19", "Server Components", "TanStack Router". | 3 / 3 |
| Distinctiveness / Conflict Risk | Niche = React + TypeScript + version markers; won't collide with generic React or TypeScript skills. | 3 / 3 |

**Total: 11 / 12.** A 2 (not 3) on Specificity is the realistic, common case:
strong overall, with one concrete, named weakness. Implementation tables take the
same shape with 5 dimensions (**Total / 15**).

## Output

Return the review in chat unless artifact writes are allowed. When saved
artifacts are allowed, write the same content to
`<project>/.<skill-name>/judge-review.md`:

- **Overall Judge Review Score** + the three phase percentages.
- Discovery: the 2–4 sentence assessment, then the scored table (a **Reasoning**
  + **Score** row per dimension, ending in **Total X / 12**).
- Implementation: the same assessment + scored-table shape (5 dimensions,
  **Total X / 15**).
- Payload hygiene: pass/fail, terms or classes scanned, allowed hits, and
  findings with file paths and the smallest cleanup.
- Validation: the validation results table + Validation %.
- **Combined findings:** prioritized gaps, each with the rule it violates and a
  suggested fix, highest-impact first.

**Propose only** — the completed chat review or saved `judge-review.md` is
evidence, not a source edit request. Source edits require explicit approval for
a concrete change (see [doctor.md](doctor.md#approval-gated-edits)).
