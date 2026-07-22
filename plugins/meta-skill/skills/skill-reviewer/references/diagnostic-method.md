# Diagnostic Method

Read this for a deep, cross-surface, or broad diagnosis, or when a
focused defect sweep is needed. Select only the dimensions and sweeps that can
change the answer.

## Diagnostic Dimensions

| Dimension | Question | Evidence that can answer it |
|---|---|---|
| Purpose and boundary | Does the opening state the recurring job, default path, and clear nearby exclusions? | Opening contract and sibling comparison |
| Trigger precision | Can natural requests select it while close non-uses avoid it? | Description-only cases and discovery evidence |
| Predictability and steering | Do leading words, positive instructions, and completion criteria produce the same decision process across runs? | Sentence map, path trace, and existing behavioral evidence |
| Invocation and granularity | Does autonomous reach justify its context load, and does each split have an invocation or observed sequence reason? | Host metadata, sibling boundaries, and completion evidence |
| Inputs | Are necessary, optional, missing, malformed, and conflicting inputs handled? | Common and failure paths |
| Workflow | Is the path executable without unnecessary rigidity? | Condition-action-result trace |
| Decisions | Do branches define operational conditions, defaults, and consequences? | Decision cases and outputs |
| Domain method | Are consequential rules supported and internally consistent? | Sources, calculations, fixtures, and domain evidence |
| Tools and files | Are tools available, paths portable, side effects clear, and results consumed? | Tool contracts, traces, and package inspection |
| Templates and artifacts | Are preservation, mapping, and output checks sufficient for the artifact? | Source-to-output diff and rendered artifact |
| Evidence | Can important claims and calculations be traced to their support? | Source identifiers, locators, dates, and formula lineage |
| Validation | Can each check reject a plausible defect and change the result? | Known-pass and known-fail fixtures |
| Testing | Do cases exercise behavior rather than wording? | Positive, negative, failure, artifact, and regression cases |
| Failure and stop behavior | Does the skill ask, caveat, return partial work, or stop under defined conditions? | Fault cases and existing transcripts |
| Output | Is the result usable, complete against its contract, and honestly statused? | Final artifact and open-item record |
| Maintainability | Does each rule have one authoritative home, with conditional detail behind a direct read-when link? | Link, ownership, and duplication map |
| Efficiency | Are repeated reads, unused calls, and duplicate checks avoided? | Workflow trace and available telemetry |

## Severity

Use a scale supplied by the user or repository. Otherwise use the default
below. Apply the highest consequence supported by evidence; do not average a
serious defect into a reassuring overall score.

| Level | Meaning | Examples |
|---|---|---|
| Critical | Likely to fabricate support, produce a seriously wrong calculation, perform a destructive action, or corrupt output | Invented model input; ignored hard failure |
| High | Likely to misroute the skill, omit a load-bearing control, or produce an unusable artifact | Broken packaged reference; failed check followed by a success claim |
| Medium | Meaningfully reduces consistency, traceability, maintainability, or efficiency | Ambiguous branch; missing negative case; duplicated rule |
| Low | Local clarity or presentation defect with limited behavioral effect | Stale label; isolated terminology drift |

## Focused Defect Sweeps

### Sentence pruning

Read every runtime sentence in isolation and classify it:

- **Keep** when it changes behavior, authority, a boundary, completion, or
  justified confidence.
- **Consolidate** when another sentence already owns the same meaning.
- **Delete** when removing it changes nothing relative to a capable agent's
  default behavior.

Delete a failed sentence rather than polishing it. Distinguish repeated meaning
from a repeated leading word: duplicated explanation adds load, while one
compact established term may intentionally anchor invocation or execution.
Treat disputed no-op claims as model-relative and name the behavioral trial
that would settle them.

### No-op

For each instruction, validator, test, and workflow stage ask:

- Would deleting or changing it alter behavior, output, a decision, or
  justified confidence?
- Can it reject a plausible bad result?
- Is its output consumed by a later decision or final status?
- Does it duplicate another check without adding coverage?
- Is its cost proportionate to its effect?

Flag always-passing checks, existence-only validation, generic self-checks,
ignored tool results, formatting checks presented as correctness, happy-path
tests that cannot expose the claimed defect, and repeated checks of the same
property. A useful replacement defines a condition, action, observable result,
plausible failure, and failure response.

### Contradiction

Build a compact subject-rule table across every surface that defines the same
behavior. Look for different obligations, conditions, terms, authorities,
formats, owners, or completion states. Do not rely on each file being
internally consistent; many contradictions exist only across files.

### Ambiguity

Inspect phrases such as “use best judgment,” “use the appropriate template,”
“make it professional,” “ensure accuracy,” “validate the output,” “use reliable
sources,” and “research thoroughly.” Flag one only when competing
interpretations could change the result. A correction should define the object,
criterion, action, evidence, and failure response while preserving legitimate
judgment where several answers are valid.

### Overengineering

Look for mandatory sections that do not apply, routers that only rename one
branch, duplicate preflight steps, schemas for flexible narrative reasoning,
rare-case steps imposed on every run, synonymous modes or statuses, repeated
artifacts, and detailed references loaded unconditionally. Recommend deletion
or conditional loading before proposing another layer.

### Missing tests

Map each load-bearing behavior to an observable case. Check only applicable
gaps among:

- natural triggers, non-triggers, and near misses;
- missing, conflicting, stale, malformed, or unsupported inputs;
- wrong template or file version;
- tool and validator failures;
- excessive calls and ignored results;
- appropriate stopping and unnecessary questions;
- artifact semantics and visual quality;
- fabricated support or silent failure;
- no-op mutations that should cause a test to fail; and
- packaged behavior and resource resolution.

A test that searches for expected wording does not establish behavioral
coverage. Existing tests should have a plausible mutant or bad fixture that
they reject for the reason claimed.

### Tool, file, and package handling

Check that tools exist in the target environment; inputs, outputs, and side
effects are clear and occur only after required authorization; paths resolve in
source and packaged layouts; source files are preserved when required; failures
change the workflow state; results are consumed; final artifacts are opened,
rendered, or inspected when appropriate; and generated development state stays
outside the portable runtime.

When source looks correct but reported behavior does not, compare the source,
package, and installed payloads. Attribute drift to the correct surface and
propose a source-owned release or sync correction rather than an installed-
cache edit.

## Finding Contract

When no output contract is supplied, use this default shape. Omit inapplicable
fields rather than producing empty sections:

```markdown
### [Critical|High|Medium|Low] <specific defect>

- Location: <file, section, or artifact>
- Observation: <direct evidence>
- Consequence: <observed or clearly labeled inference>
- Smallest correction: <source change>
- Verification: <case or inspection that can prove the correction>
- Falsifier: <evidence that would disprove an inferred consequence>
```

Example:

```markdown
### [High] Workbook check proves layout, not calculation integrity

- Location: `scripts/check_workbook.py`, formula checks
- Observation: the script checks sheet names and required cells but does not
  recalculate formulas, scan formula errors, or verify the value bridge.
- Consequence: a complete-looking workbook with a broken formula can pass.
- Smallest correction: add formula-error scanning, bridge recomputation, and
  known-fail fixtures for the key calculations.
- Verification: a valid workbook passes and each targeted broken formula fails
  while changing the final status.
- Falsifier: another invoked check already performs these tests and propagates
  failure to the final status.
```

## Handoffs

Use an evaluator handoff only when fresh behavior evidence is required. Name
the claim, representative cases, baseline, expected outcomes, and grading
evidence. Use an authoring handoff only when mutation is requested; name exact
source scope, intended behavior change, and verification. Do not create either
handoff as ceremony when the current diagnosis already answers the question.
