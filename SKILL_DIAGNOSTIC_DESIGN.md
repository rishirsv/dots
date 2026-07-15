# Static skill diagnostic design

Status: Companion implementation design. The concise proposal remains `SKILL_AUTHOR_PROPOSED_UPDATES.md`.

## Mandate

The diagnostic system inspects a skill's trigger contract, runtime instructions, resources, package contents, and tests. It identifies supported defects, ranks their impact, cites exact evidence, and proposes the smallest useful correction.

It does not:

- silently rewrite the skill;
- claim behavioral improvement from static inspection;
- invent domain rules or acceptance criteria;
- treat file existence or structural validity as proof of quality;
- add process solely to make the skill look rigorous.

When a claim requires observed behavior, produce a precise evaluator handoff. When the user requests changes, produce an implementation-ready authoring handoff.

## Scope

Use a narrow scope for a named wording, trigger, link, or resource defect. Read the changed surface, direct dependencies, and the closest sibling when discovery changes.

Use a full scope for a new skill, broad redesign, packaging claim, shared reference change, or defect that crosses several runtime surfaces. Read the effective payload, not only `SKILL.md`.

Record:

- the question the diagnostic can answer;
- files and artifacts inspected;
- behavior the skill is intended to produce;
- source, package, test, and run evidence available;
- evidence that was unavailable.

## Workflow

### 1. State the claim

Examples:

- Does the description distinguish model audit from model build?
- Can the packaged skill resolve every runtime resource?
- Does the workflow consume a failing validator result?

Do not broaden the conclusion beyond the inspected evidence.

### 2. Map the effective payload

Inspect the applicable surfaces:

- frontmatter and body;
- directly and transitively linked references;
- scripts, schemas, templates, and assets;
- agent metadata and plugin manifests;
- package contents and installed copy;
- tests and existing evaluation reports.

Identify the authoritative home for each rule. Flag duplicate, dangling, conflicting, or package-missing instructions.

### 3. Reconstruct intended behavior

Capture only what the skill needs:

- recurring job and nearest exclusions;
- realistic triggers and close non-triggers;
- required or optional inputs;
- common path and condition-changing branches;
- tool, file, and template behavior;
- expected output and completion state;
- failure, partial-result, and stop behavior.

Missing items are defects only when the target skill needs them.

### 4. Trace representative paths

Walk the common case from request to completion. Then inspect only the most important edge paths, such as missing input, conflicting input, tool failure, or an unsupported assumption.

At each step ask:

- What condition activates this instruction?
- What action changes?
- What artifact or result is produced?
- What happens on failure?
- What proves completion?

### 5. Run focused defect sweeps

Choose only the applicable sweeps from this document. A small trigger edit does not need a full artifact audit. A workbook-producing skill usually does.

### 6. Rank findings

Each finding includes:

- severity;
- exact location;
- observation;
- likely behavior consequence;
- smallest correction;
- test that could prove the correction;
- evidence that would disprove the finding when the consequence is inferred.

Prefer deletion, consolidation, or precise replacement over another abstraction.

## Diagnostic dimensions

| Dimension | Question | Useful evidence |
|---|---|---|
| Purpose and boundary | Does the skill own one recurring job? | Opening instructions and sibling comparison |
| Trigger precision | Can natural requests select it and close non-uses avoid it? | Description-only cases and discovery runs |
| Inputs | Are required, optional, missing, and conflicting inputs handled? | Common and failure paths |
| Workflow | Is the path executable without unnecessary rigidity? | Condition-action-output trace |
| Decisions | Are branches and defaults operational? | Decision examples and cases |
| Domain method | Are consequential rules supported and internally consistent? | Sources, calculations, and expert evidence |
| Tools and files | Are tools callable, paths portable, and results consumed? | Script contracts, package inspection, traces |
| Templates and artifacts | Are preservation, mapping, and output checks clear? | Template diff and rendered artifact |
| Evidence | Can important claims and calculations be traced? | Source IDs, locators, dates, and formula lineage |
| Validation | Can each check reject a plausible defect and change the result? | Known-pass and known-fail fixtures |
| Testing | Do cases exercise behavior rather than wording? | Positive, negative, failure, artifact, and regression cases |
| Failure and stop behavior | Does the skill ask, caveat, return partial work, or stop at the right time? | Fault cases and transcripts |
| Output | Is the main artifact usable and honestly statused? | Artifact and open-item record |
| Maintainability | Does each rule have one home and load only when useful? | Link and duplication map |
| Efficiency | Are repeated reads, unused calls, and duplicate checks avoided? | Workflow trace and telemetry |

## Severity

| Level | Meaning | Typical examples |
|---|---|---|
| Critical | Likely to produce fabricated evidence, a seriously wrong calculation, destructive action, or corrupted output | Invented financial input; ignored hard validator failure |
| High | Likely to misroute the skill, omit a load-bearing control, or produce an unusable artifact | Broken packaged reference; output claimed complete despite a failed check |
| Medium | Meaningfully reduces consistency, traceability, maintainability, or efficiency | Ambiguous branch; missing negative case; duplicated rule |
| Low | Local clarity or presentation defect with limited behavioral effect | Stale label; minor terminology drift |

Do not average a Critical or High defect into a reassuring score.

## Defect sweeps

### No-op detection

For each instruction, validator, test, and stage ask:

- Would deleting it change behavior, output, a decision, or justified confidence?
- Can it reject a plausible bad result?
- Is its output consumed?
- Does it duplicate another check without adding coverage?
- Is its cost proportionate to its effect?

Flag unconditional passes, existence-only checks, generic self-checks, ignored tool results, formatting checks presented as correctness, happy-path-only tests, and repeated validation of the same property.

A meaningful replacement names a condition, action, observable result, plausible failure, and failure response.

### Contradiction detection

Build a compact subject-rule table across frontmatter, body, references, scripts, schemas, metadata, and tests. Look for the same subject with different obligations, conditions, owners, formats, terms, source authority, or completion states.

### Ambiguity detection

Flag phrases such as:

- use best judgment;
- use the appropriate template;
- make it professional;
- ensure accuracy;
- validate the output;
- use reliable sources;
- research thoroughly.

Replace them only when the ambiguity can change the result. Define the object, criterion, action, evidence, and failure response. Preserve useful judgment where several answers are valid.

### Overengineering detection

Flag complexity that has no distinct recurring job or observable benefit:

- mandatory sections that do not apply;
- routers that only rename one branch;
- duplicate preflight instructions;
- schemas for flexible narrative reasoning;
- rare-case steps on every run;
- synonymous modes or statuses;
- several artifacts that contain the same information;
- detailed references loaded unconditionally.

Recommend deletion or conditional loading before adding another layer.

### Missing-test detection

Map each load-bearing behavior to a case. Look for gaps in:

- trigger, non-trigger, and near-miss behavior;
- missing, conflicting, stale, or malformed inputs;
- wrong template or file version;
- unsupported assumptions;
- tool and validator failures;
- excessive calls and ignored results;
- stop behavior;
- artifact semantics and visual quality;
- fabricated evidence;
- no-op validation mutation;
- packaged behavior.

Text-presence assertions do not satisfy behavioral coverage.

### Tool and file handling

Check that:

- the tool exists and is available in the target environment;
- inputs, outputs, and side effects are clear;
- paths resolve in source and package layouts;
- source files are preserved when required;
- failure changes the workflow state;
- results are consumed;
- final artifacts are opened, rendered, or inspected where appropriate;
- temporary and generated files stay out of the portable runtime.

## Domain modules

Load only the applicable module.

### Template execution

Inspect template identity, editable and fixed regions, field mapping, missing values, structural diff, formatting, and rendered output.

### Financial modelling

Inspect purpose, inputs, assumptions, units, currency, dates, signs, formulas, circularity, scenarios, key-driver ranges, reconciliations, formula errors, source lineage, output interpretation, and handoff notes.

### Spreadsheet analysis

Inspect schema discovery, cleaning counts, source preservation, control totals, formula and link integrity, outlier criteria, output tables and charts, and rendered checks.

### Reports and presentations

Inspect audience and decision, narrative structure, source hierarchy, claim support, visual evidence, template rules, executive readability, and distinction between findings, implications, and recommendations.

### Research and synthesis

Inspect questions, source scope, authority, recency, stop rule, conflicts, fact-versus-inference labels, citations, completeness, unsupported claims, and useful no-conclusion behavior.

### High-impact knowledge work

Inspect costly failure modes, evidence requirements, prohibited invention, uncertainty, tool failures, partial-result behavior, stop conditions, traceability, and reproducibility.

## Output format

```markdown
# Skill diagnostic: <name>

## Judgment
<Accept / Accept with conditions / Revise / Insufficient evidence>

## Scope
- Files and artifacts:
- Intended behavior:
- Evidence available:
- Evidence gaps:

## Findings
### [Critical|High|Medium|Low] <defect>
- Location:
- Observation:
- Consequence:
- Smallest correction:
- Verification:
- Falsifier:

## Positive-null checks
<Applicable dimensions with no supported defect.>

## Evaluator handoff
<Claim, cases, baseline, expected outcomes, and graders.>
```

## Example finding

### [High] Workbook validator proves structure, not calculation integrity

- Location: `scripts/validate_workbook.py:40-85`
- Observation: the script checks sheet names and required cells but never recalculates formulas, scans errors, or verifies the enterprise-value bridge.
- Consequence: a complete-looking workbook with a broken formula can pass.
- Smallest correction: add formula-error scanning, bridge recomputation, source-lineage checks, and key-driver direction tests with known-fail fixtures.
- Verification: a valid workbook passes; each targeted mutant fails and changes the final status.
- Falsifier: another invoked validator already performs these checks and its failure is propagated.
