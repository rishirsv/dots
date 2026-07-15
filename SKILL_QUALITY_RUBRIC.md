# Skill quality rubric for KPMG consulting work

Status: Proposed, provisional rubric. Calibrate weights and cutoffs against labelled examples before treating them as deployment standards.

## Use

1. State the skill's recurring job, target users, expected outputs, and target harness.
2. Inspect the effective payload, package, resources, tests, and available run evidence.
3. Score each applicable dimension from 0 to 4 using the anchors.
4. Cite source or run evidence for every score.
5. Apply hard gates and the no-op cap before assigning a maturity level.
6. Report unknown evidence as a score interval, not as a pass.

Static inspection can support contract and structure scores. Behavioral, artifact, and efficiency scores need task runs.

This document is the sole source for maturity thresholds. Authoring, diagnostics, and evaluation produce evidence; they do not redefine the thresholds.

## Scale

- **0 — absent or harmful:** missing, misleading, unsafe, or routinely wrong.
- **1 — major uncontrolled gaps:** intent is visible, but the agent must invent important behavior.
- **2 — usable with significant correction:** the common case can work, but important gaps remain.
- **3 — operational for the target use:** instructions and evidence support representative cases and failures.
- **4 — demonstrated and resilient:** task runs show reliable behavior across boundaries, failures, artifacts, and relevant variation.

Do not award 3 or 4 from polished prose alone.

## Hard gates

No score can offset:

- fabricated source, citation, calculation, result, or authorization;
- destructive or unauthorized action;
- critical calculation error;
- ignored hard validator failure;
- missing, unreadable, or corrupt main artifact;
- silent failure presented as success;
- invalid or irreproducible evaluation evidence;
- unresolved Critical finding.

A failed gate means `Not ready` for the intended use.

## Weights

| Dimension | Weight |
|---|---:|
| Purpose and scope | 5 |
| Trigger precision | 5 |
| Input handling | 6 |
| Workflow quality | 10 |
| Domain correctness | 10 |
| Tool use | 5 |
| Evidence and traceability | 10 |
| Validation | 8 |
| Testing | 9 |
| Failure handling | 6 |
| Output quality | 7 |
| Maintainability | 4 |
| Efficiency | 4 |
| Professional knowledge-work quality | 6 |
| **Weighted subtotal** | **95** |
| No-op avoidance | Hard cap; not weighted |

For known dimensions, contribution is `weight × score / 4`. Normalize against the applicable weighted denominator.

An unknown dimension contributes zero to the lower bound and its full weight to the upper bound. Maturity uses the lower bound. Report `known coverage = known applicable weight / applicable weight`.

`Not applicable` requires a reason showing that the dimension cannot affect the target use.

## Anchors

### Purpose and scope — weight 5

| Score | Observable anchor |
|---:|---|
| 0 | No recurring job is identifiable, or the skill claims incompatible work. |
| 1 | Names a topic but not the result or boundary. |
| 2 | Common job is understandable; exclusions or completion remain weak. |
| 3 | States the recurring job, useful output, nearest exclusions, and finish condition. |
| 4 | Score 3 plus task evidence confirms the boundary remains useful across common and edge cases. |

### Trigger precision — weight 5

| Score | Observable anchor |
|---:|---|
| 0 | Description is missing, misleading, or reliably activates for the wrong work. |
| 1 | Uses vague category terms and omits natural requests. |
| 2 | Positive trigger is clear; near misses remain ambiguous. |
| 3 | Description distinguishes positive, negative, and close near-miss requests. |
| 4 | Score 3 plus platform discovery tests show correct activation and abstention. |

### Input handling — weight 6

| Score | Observable anchor |
|---:|---|
| 0 | Required inputs are unknown or missing values are invented. |
| 1 | Lists some inputs without authority, format, or missing behavior. |
| 2 | Common inputs work; conflicts, stale data, or malformed files are incomplete. |
| 3 | Required and optional inputs, formats, source priority, and missing or conflicting behavior are operational. |
| 4 | Score 3 plus cases cover complete, missing, conflicting, stale, malformed, and malicious inputs without unnecessary questions. |

### Workflow quality — weight 10

| Score | Observable anchor |
|---:|---|
| 0 | No executable path or the steps contradict the intended result. |
| 1 | Mostly principles; sequence and decisions are left to invention. |
| 2 | Common path works but important branches or completion remain vague. |
| 3 | Common path, condition-changing branches, outputs, and stop states are explicit without unnecessary rigidity. |
| 4 | Score 3 plus task runs show reliable execution across routine, ambiguous, failure, and partial-success cases. |

### Domain correctness — weight 10

| Score | Observable anchor |
|---:|---|
| 0 | Contains seriously wrong, unsafe, or unsupported domain guidance. |
| 1 | Domain vocabulary substitutes for a method. |
| 2 | Core method is plausible but important rules or edge cases need correction. |
| 3 | Consequential rules are supported, calculations and terminology are consistent, and limits are explicit. |
| 4 | Score 3 plus deterministic checks and qualified expert evaluation confirm representative and difficult outputs. |

### Tool use — weight 5

| Score | Observable anchor |
|---:|---|
| 0 | Uses unavailable tools, hides side effects, or ignores failing results. |
| 1 | Names tools without callable inputs, outputs, paths, or failure meaning. |
| 2 | Common tool path works; portability or result consumption is incomplete. |
| 3 | Tool contracts, paths, side effects, failure states, and result consumption are explicit and tested. |
| 4 | Score 3 plus target-harness runs show correct use, failure handling, artifact capture, and no unnecessary calls. |

### Evidence and traceability — weight 10

| Score | Observable anchor |
|---:|---|
| 0 | Important claims or calculations lack support or contain fabricated support. |
| 1 | Generic citation advice exists; facts, assumptions, calculations, and inference are mixed. |
| 2 | Sources are usually recorded, but locators, dates, transformations, or conflicts are incomplete. |
| 3 | Important claims trace to source identifiers, locators, dates, or formula lineage; conflicts and uncertainty remain visible. |
| 4 | Score 3 plus citation, lineage, and reproducibility checks confirm representative outputs. |

### Validation — weight 8

| Score | Observable anchor |
|---:|---|
| 0 | No validation, validators always pass, or failures do not change status. |
| 1 | Existence and formatting checks are presented as correctness. |
| 2 | Some meaningful checks exist, but coverage or known-fail fixtures are incomplete. |
| 3 | Checks define object, method, criterion, evidence, and failure response. |
| 4 | Score 3 plus every hard validator passes known-good cases, fails targeted mutants, is invoked, and changes the verdict. |

### Testing — weight 9

| Score | Observable anchor |
|---:|---|
| 0 | No behavioral tests or tests cannot fail meaningfully. |
| 1 | Static wording checks or one happy path only. |
| 2 | Positive cases exist; negative, failure, artifact, baseline, or grader calibration is incomplete. |
| 3 | Versioned suite covers representative, boundary, failure, artifact, stop, and regression behavior with suitable graders. |
| 4 | Score 3 plus baseline comparison, repeated trials where needed, adversarial cases, grader mutation, and target-harness coverage support the claim. |

### Failure handling — weight 6

| Score | Observable anchor |
|---:|---|
| 0 | Fails silently, invents a fallback, or continues after a hard failure. |
| 1 | Says to handle errors without conditions or outcomes. |
| 2 | Common missing input or tool failure works; conflicts and partial success remain incomplete. |
| 3 | Missing, conflicting, stale, malformed, unavailable, partial, and no-conclusion states have explicit behavior. |
| 4 | Score 3 plus fault cases show correct state changes, preservation of useful work, and no invented recovery. |

### Output quality — weight 7

| Score | Observable anchor |
|---:|---|
| 0 | Output is missing, corrupt, misleading, or unusable. |
| 1 | Output type is named but content, status, or delivery surface is undefined. |
| 2 | Usable draft with inconsistent narrative, template, visual, version, or open-item handling. |
| 3 | Main artifact answers the task, is audience-appropriate, traceable, versioned, opened or rendered, and honestly statused. |
| 4 | Score 3 plus user and expert evaluation accept representative artifacts for usability, calculation integrity, evidence, and template quality. |

### Maintainability — weight 4

| Score | Observable anchor |
|---:|---|
| 0 | Broken ownership or links, pervasive duplication, or impossible-to-update structure. |
| 1 | Rules have several homes or design history leaks into runtime. |
| 2 | Mostly organized, but duplication, oversized context, stale examples, or unclear ownership remains. |
| 3 | One home per rule, progressive disclosure, portable links, and separate development state. |
| 4 | Score 3 plus package-drift checks and regression evidence show updates remain coherent. |

### Efficiency — weight 4

| Score | Observable anchor |
|---:|---|
| 0 | Workflow loops, thrashes, repeatedly reads, or validates without effect. |
| 1 | No stop rule; repeated or unused tool calls are common. |
| 2 | Common path is reasonable but rare-case ceremony or duplicate checks add cost. |
| 3 | Conditional loading, bounded search, result reuse, and completion stop rules are explicit. |
| 4 | Score 3 plus telemetry shows competitive cost and latency without quality loss, ignored results, or validation thrash. |

### Professional knowledge-work quality — weight 6

| Score | Observable anchor |
|---:|---|
| 0 | Produces fabricated, irreproducible, or seriously misleading work. |
| 1 | Generic “professional” language with no operational evidence, calculation, terminology, or uncertainty rules. |
| 2 | Some controls exist, but fact, assumption, calculation, inference, terminology, or reproducibility remains inconsistent. |
| 3 | Sources, calculations, assumptions, terminology, versions, uncertainty, and open issues are clear enough for another person to follow. |
| 4 | Score 3 plus representative domain work is reproducible, usable, and accepted under anchored expert and user criteria. |

### No-op avoidance — hard cap

| Score | Observable anchor |
|---:|---|
| 0 | Several validators or stages always pass, are ignored, or create false confidence. |
| 1 | Generic checks, existence tests, and duplicate requirements dominate. |
| 2 | Obvious no-ops are limited, but some controls lack known failures or consumed results. |
| 3 | Every important check maps to a condition, action, evidence, plausible failure, and response. |
| 4 | Score 3 plus ablation, inversion, empty-input, substance, and grader-mutation tests show that hard controls change behavior or confidence. |

Apply this cap after the weighted score:

| No-op score | Maximum maturity |
|---:|---|
| 0–1 | Not ready |
| 2 | Ready for experimentation |
| 3 | Ready for internal use |
| 4 | Eligible for professional use |

## Maturity levels

These thresholds are hypotheses until calibrated.

### Ready for experimentation

- lower-bound score at least 60;
- known evidence coverage at least 70%;
- no failed hard gate or open Critical finding;
- purpose and trigger score at least 2;
- at least one representative, near-miss, and failure case runs in a sandbox;
- known gaps are recorded.

### Ready for internal use

- lower-bound score at least 75;
- known evidence coverage at least 90%;
- no failed hard gate or open Critical or High finding for the target use;
- workflow, domain correctness, evidence, validation, testing, failure handling, and output each score at least 3;
- repeated cases are used where variation could change the conclusion;
- current-skill or no-skill comparison shows no important regression.

### Ready for professional use

- lower-bound score at least 90;
- 100% known evidence coverage;
- no failed hard gate or open Critical or High finding;
- domain correctness, evidence, validation, testing, and output score 4;
- every other weighted dimension scores at least 3;
- hard calculation, evidence, artifact, and stop controls pass every measured trial;
- production-like fixtures and target harness versions are tested;
- expert and user acceptance criteria pass where applicable;
- exact skill, model, harness, tool, template, evaluation date, and rerun triggers are recorded.

### Not ready

The skill is not ready for its target level when any required condition is unmet, evidence coverage is too low, or the no-op cap prevents that level.

## Scoring safeguards

- Do not use a total score to hide a hard-gate failure.
- Do not report a point estimate when an applicable dimension is unknown.
- Do not count optional or inapplicable items as passes.
- Do not reward verbosity, number of files, number of tests, or number of tool calls.
- Do not award validation credit without a plausible failing case and consumed result.
- Do not award testing credit for headings or string assertions alone.
- Assign each evidence item a primary proposition; do not count one mutant as separate proof of validation, testing, and no-op quality.
