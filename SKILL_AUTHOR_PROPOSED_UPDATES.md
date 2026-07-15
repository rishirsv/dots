# Skill Author proposed updates

Status: Concise proposal for review. Companion documents hold the implementation detail.

## Decision summary

Keep the current `skill-author` architecture and make it better at producing observable behavior. Do not replace it with a large form or a fixed `SKILL.md` template.

The revised direction is:

1. Keep the OpenAI and Anthropic creator backbone: concrete examples, concise instructions, calibrated freedom, optional resources, progressive disclosure, structural validation, and iteration from real use.
2. Add a small set of optional authoring patterns that the model selects only when the task needs them.
3. Keep domain-specific extensions for templates, financial models, spreadsheets, reports and presentations, research, and high-impact knowledge work.
4. Strengthen no-op detection, package checks, behavioral tests, artifact checks, and tool-result consumption.
5. Remove the proposed universal work-contract schema, workflow tiers, firm-process metadata, and fixed body outline.

The desired result is a lean creator that helps the model choose the right structure instead of generating the same structure every time.

## What to preserve

The current system already has the right foundation:

- `skill-author` edits source, the static diagnostic component finds defects, and `skill-evaluator` tests actual behavior.
- The task determines the skill shape; the current guidance explicitly rejects forcing every skill into one template.
- `SKILL.md` holds the common path, references hold conditional detail, scripts hold deterministic work, and assets hold reusable output resources.
- Detailed examples and evaluation state stay outside the portable runtime.
- Structural validation is not presented as behavioral proof.
- Authors start from concrete requests and observed repeated work.

These principles appear in the current implementation at `plugins/meta-skill/skills/skill-author/SKILL.md:13-36,42-101,110-178`.

## What the creator sources reinforce

OpenAI and Anthropic converge on a deliberately small core:

- Required: `SKILL.md`, `name`, `description`, and useful body instructions.
- Optional: scripts, references, assets, examples, and interface metadata.
- Keep only essential common instructions in `SKILL.md`.
- Link directly to conditional references and say when to read them.
- Match specificity to the task: prose for open-ended work, patterns for preferred approaches, scripts for fragile or repeated operations.
- Use concise examples when examples teach more than additional prose.
- Test scripts by running them and iterate from realistic use.
- Delete unused scaffolding and placeholder files.

Evidence:

- OpenAI: `/Users/rishi/.codex/skills/.system/skill-creator/SKILL.md:16-219,225-416`.
- Anthropic: `/Users/rishi/Code/kpmg/reference/financial-services-plugins/plugins/vertical-plugins/financial-analysis/skills/skill-creator/SKILL.md:16-200,202-356`.
- Anthropic workflow and output patterns: the adjacent `references/workflows.md` and `references/output-patterns.md`.

The research adds one important correction: good skills can improve performance, but more guidance is not automatically better. SkillsBench found regressions as well as gains, and focused skills performed better than comprehensive ones. Behavioral comparison is therefore part of authoring, not an optional final polish. See [SkillsBench](https://arxiv.org/html/2602.12670v1) and [Philipp Schmid's testing guide](https://www.philschmid.de/testing-skills).

## Lean authoring method

This is a decision path, not a form. Skip a step when the answer is already clear or it does not apply.

### 1. Understand the job from examples

Collect or infer a few realistic requests:

- clear uses;
- close non-uses;
- difficult or incomplete cases;
- expected artifacts or outcomes.

Ask only questions whose answers would change the skill. Do not turn the interview into a checklist.

### 2. Decide whether a skill is the right artifact

Create or expand a skill when the work is recurring and benefits from reusable instructions, knowledge, scripts, or assets. Prefer a direct answer, code change, command, or existing skill when that solves the task more simply.

### 3. Choose the degree of freedom

- Use flexible prose when several approaches can work.
- Use a preferred pattern when sequence or consistency helps but variation remains useful.
- Use a tested script or strict format when exact behavior is necessary.

Explain constraints that would otherwise look arbitrary.

### 4. Plan only reusable contents

For each example, ask what the model would otherwise have to rediscover or rewrite:

- repeated executable logic becomes a script;
- detailed or variant knowledge becomes a reference;
- reusable source files and templates become assets;
- short common guidance stays in `SKILL.md`.

Do not create empty directories or placeholder resources.

### 5. Write the smallest useful runtime

Write clear trigger metadata and the common execution guidance. Add only the optional patterns that improve this skill. Keep one authoritative home for each rule.

### 6. Validate in layers

Run structural checks, execute scripts, verify packaged paths, and inspect produced artifacts where applicable. Report each layer separately.

### 7. Test behavior and iterate

Use realistic positive, negative, edge, and failure cases. Compare against the current skill or no-skill behavior when the claim is improvement. Keep changes that improve the target behavior without harming adjacent cases.

## Optional `SKILL.md` section palette

Only `name`, `description`, and a useful body are universal. The headings below are choices, not a template. Authors should select, rename, combine, or omit them based on the skill.

| Use a section like… | When it helps |
|---|---|
| Purpose or scope | The owned job or nearest boundary is easy to misunderstand. |
| Quick start | A short common path gets most tasks moving. |
| Workflow | Order matters across several steps. |
| Decision points | Inputs or conditions change the path. |
| Inputs, files, or templates | The skill depends on particular artifacts or preservation rules. |
| Tool usage | The model needs exact tool choice, inputs, outputs, or result handling. |
| Output pattern | A stable structure improves usability. Use a flexible default unless exact form is necessary. |
| Validation | There are meaningful checks with observable pass and fail states. |
| Failure and stop conditions | Common failures require a distinct response. |
| Examples | Boundaries, style, or quality are easier to show than describe. |
| Conditional references | Detailed guidance applies only to a subset of requests. |

Do not add a heading merely because it appears in this table. Do not duplicate trigger guidance from the description in a “When to use” body section.

## Domain-specific authoring extensions

Store these as conditional references. Load only the relevant extension.

### Template execution

Help the author specify:

- how to locate and inspect the template;
- which structure must remain unchanged and which regions may change;
- how source fields map into the template;
- what to do with missing values;
- which formatting rules are part of the template contract;
- how to compare the result with both source information and the original template;
- how to open or render the final artifact before completion.

### Financial modelling

Help the author specify:

- model purpose and outputs;
- input classes, assumptions, sources, units, currencies, dates, and sign conventions;
- formula architecture and separation of inputs, calculations, checks, and outputs;
- scenario and key-driver range analysis;
- circularity handling, reconciliations, formula-error scans, and control totals;
- traceable calculations and interpretable outputs;
- workbook handoff notes and unresolved inputs.

### Spreadsheet analysis

Help the author specify:

- source preservation and schema discovery;
- cleaning rules, rejected rows, joins, and reconciliations;
- formula and link preservation;
- analytical procedures and explicit outlier criteria;
- output tables, charts, and control totals;
- workbook-specific checks and final rendered inspection.

### Reports and presentations

Help the author specify:

- audience and decision objective;
- source hierarchy and evidence standards;
- narrative structure appropriate to the artifact;
- separation of findings, implications, and recommendations;
- chart purpose, units, time periods, and source linkage;
- template and visual requirements;
- executive readability and page- or slide-level takeaways;
- final file and rendered checks.

### Research and synthesis

Help the author specify:

- answerable research questions and source scope;
- source authority, recency, and stopping rules;
- conflict handling and missing-coverage behavior;
- separation of facts from inference;
- claim-level citations where useful;
- unsupported-claim checks;
- a useful result when the evidence does not support a conclusion.

### High-impact knowledge work

Help the author specify:

- costly failure modes;
- evidence needed before making a claim;
- facts the model must not invent;
- how uncertainty is shown;
- what changes when inputs conflict or tools fail;
- when to return a partial result, state a limitation, or stop;
- how another person can reproduce the result from sources and calculations.

## No-op audit to retain

The current validation system contains useful structural checks, but its aggregate result overstates confidence.

| Current behavior | Problem | Proposed change |
|---|---|---|
| Five optional-field checks pass whether fields exist or not | They inflate the percentage without detecting a defect | Remove them from the denominator; validate values only when present |
| YAML fallback accepts non-empty line scans after parser failure | Malformed metadata can pass | Require one strict parser and fail with a precise error |
| Invalid names produce warnings | An invalid contract can still return success | Make naming violations fail |
| Description and body checks prove only non-empty text | Vague or unusable content appears valid | Keep them as minimal structure checks; test discovery and execution separately |
| Line count and command-density scores act as quality proxies | Authors can optimize the proxy instead of behavior | Make them advisory complexity signals or remove them |
| Link checks cover only a shallow source view | A packaged skill can lose resources | Resolve all packaged runtime links and execute a packaged smoke case |
| Suite lint can report success despite invalid setup | Runs fail late or produce ambiguous evidence | Separate blocking setup errors from advisory suite quality |
| String-presence tests stand in for behavior | Contradictory or unreachable text can still pass | Add cases that require the target behavior or defect detection |

No validation step counts unless it can reject a plausible failure, its result is consumed, and failure changes the outcome or status.

## Testing direction

Keep the detailed evaluator design separate. At authoring time, require only the smallest test set that supports the change.

Test families to draw from:

- positive trigger, clear non-trigger, and closest near miss;
- representative common task;
- missing, conflicting, stale, or malformed input;
- wrong template or file version;
- unsupported assumption;
- tool unavailable, misleading success, or ignored result;
- unnecessary questions or repeated tool calls;
- premature completion or failure to stop;
- fabricated citation, source, or calculation;
- polished but substantively wrong artifact;
- no-op validation mutation;
- regression for a previously observed failure.

Use deterministic checks for exact properties, model-based grading for variable qualitative outcomes, and expert evaluation only where domain judgment is genuinely needed.

## Implementation plan

The table is intentionally small. Detailed schemas and test formats remain in the companion documents.

| Priority | Change | Main files | Proof |
|---|---|---|---|
| Critical | Rebase `skill-author` on the lean method and optional section palette | `plugins/meta-skill/skills/skill-author/SKILL.md`, `references/skill-design.md`, `references/session-capture.md` | New minimal, workflow, and artifact-heavy skills take different shapes from the same guidance |
| Critical | Add the six domain extensions as directly linked conditional references | New `template-execution.md`, `financial-modelling.md`, `spreadsheet-analysis.md`, `reports-presentations.md`, `research-synthesis.md`, and `high-impact-work.md` under `plugins/meta-skill/skills/skill-author/references/` | Each extension improves a representative task without loading on unrelated tasks |
| Critical | Remove false confidence from structural validation | `validate_skill.py`, `lint_authoring.py`, `validation.py`, focused tests | Known-bad metadata and names fail; absent optional fields do not add passes |
| High | Validate the effective packaged payload | `packaging.py`, path helpers, package tests | An unpacked skill resolves every runtime resource; a missing dependency fails |
| High | Make suite setup errors blocking and unify grader normalization | `linting.py`, `grading.py`, `cli.py`, focused tests | Lint, execution, and report agree on the same malformed and mixed-grader fixtures |
| High | Add behavioral cases for `skill-author` | `plugins/meta-skill/.skill/skill-author/evals/` | Current and proposed versions are compared on creation, update, boundary, resource, and failure cases |
| Medium | Add advisory duplication and unreachable-reference checks | authoring linter and static diagnostic guidance | Seeded duplicates warn without turning justified repetition into failure |
| Optional | Extend evaluator fields only when a real suite needs them | evaluator runtime and companion design | New fields survive load, freeze, run, grade, and report; unused schema ideas are not added |

### Suggested sequence

1. Fix validator truthfulness and packaged-path checks.
2. Rewrite the core authoring guidance and add the optional section palette.
3. Add the domain extensions.
4. Add a small behavioral suite and compare the current and proposed versions.
5. Add evaluator capabilities incrementally from demonstrated suite needs.

## Decisions for this review

Approve or adjust these four choices:

1. Keep the current OpenAI/Anthropic creator backbone.
2. Use an optional section palette instead of a `SKILL.md` template.
3. Keep the six domain-specific extensions as conditional references.
4. Prioritize truthful validation and behavioral evidence over additional process.

## Companion detail

- [Static diagnostic design](SKILL_DIAGNOSTIC_DESIGN.md)
- [Behavioral evaluator design](SKILL_EVALUATOR_DESIGN.md)
- [Quality rubric](SKILL_QUALITY_RUBRIC.md)

These documents provide implementation detail. This proposal remains the main review surface.
