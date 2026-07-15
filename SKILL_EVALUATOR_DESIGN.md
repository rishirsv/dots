# Behavioral skill evaluator design

Status: Companion implementation design. Add capabilities incrementally from demonstrated suite needs.

## Objective

`skill-evaluator` measures what a skill causes an agent to do on realistic tasks. It runs frozen skill versions and relevant baselines in isolated workspaces, captures responses, artifacts, tool traces, cost, and failures, applies suitable graders, and reports the measured claim with uncertainty.

It does not grade a skill by checking whether `SKILL.md` contains expected headings. Static structure belongs to validation and diagnostics. Behavioral evaluation asks whether the skill improves outcomes, respects its boundaries, handles failure, uses tools effectively, and produces usable artifacts.

## Claims an evaluation can support

An evaluation can test whether:

- the skill improves outcomes over a no-skill or current-skill baseline;
- a candidate fixes a named failure without regressions;
- discovery activates and abstains correctly in the target harness;
- missing or conflicting inputs change behavior appropriately;
- tool failures and misleading success are handled safely;
- produced artifacts meet calculation, evidence, template, visual, and usability criteria;
- tool calls, latency, and context use stay within a measured budget;
- the skill stops when the task is complete.

Every conclusion is limited to the tested models, harnesses, tools, fixtures, and cases.

## Architecture

```text
Suite + fixtures + graders
          |
     suite validation
          |
   frozen run inputs
          |
 isolated task runner
          |
 response + artifacts + tool trace
          |
 deterministic / model / expert graders
          |
 verdict + evidence report
```

### Components

1. **Suite loader**
   - Loads a versioned manifest, cases, candidates, fixtures, and graders.
   - Rejects invalid setup before a run starts.

2. **Freezer and stager**
   - Freezes the skill, manifest, visible task, fixtures, model, harness, and grader versions.
   - Keeps expected outcomes and grader instructions outside the task workspace.

3. **Harness adapter**
   - Runs the skill through the route being claimed: attached skill, platform discovery, or plugin route.
   - Does not use explicit attachment to prove natural discovery.

4. **Isolated runner**
   - Uses a clean workspace for each trial.
   - Captures status, response, artifacts, tool events, time, tokens, retries, and errors.

5. **Artifact collector**
   - Records file digests and useful format metadata.
   - Opens, parses, or renders artifacts when their quality cannot be judged from existence alone.

6. **Grader registry**
   - Supports deterministic, model-based, and expert graders.
   - Requires clear inputs, outputs, and known-pass or known-fail examples where possible.

7. **Verdict engine**
   - Applies hard failures before scores.
   - Preserves unknown results, grader errors, and trial variation.

8. **Report and workbench**
   - Shows per-case evidence, artifacts, failures, baseline comparison, cost, and uncertainty.

## Manifest direction

Use the current schema-2 `evals.json` as the base. Do not introduce a large schema revision in advance of real suites.

Current fields already support useful evaluation:

```json
{
  "schema_version": 2,
  "skill_name": "dcf-model-builder",
  "target": {"type": "skill", "ref": "SKILL.md"},
  "defaults": {
    "runner": "codex_exec",
    "repetitions": 3,
    "timeout_seconds": 900
  },
  "candidates": [
    {"candidate": "no-skill", "source": {"kind": "none"}},
    {"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}
  ],
  "evals": [
    {
      "id": "missing-discount-rate",
      "type": "failure",
      "priority": "high",
      "prompt": {"path": "task.md"},
      "fixtures": ["historicals.xlsx"],
      "expectations": [
        "Does not invent a discount rate",
        "Names the missing input and affected outputs"
      ],
      "graders": [
        {"kind": "code", "path": "validate_workbook.py"},
        {"kind": "model", "uses_transcript": true}
      ]
    }
  ]
}
```

Add a field only when a concrete suite cannot express a needed check. For each added field:

1. define its behavior and invalid states;
2. load and validate it;
3. preserve it in frozen inputs;
4. make the runner or grader consume it;
5. show it in reports and the workbench;
6. add a test proving that changing the field changes a run or verdict.

Candidate future fields include required and forbidden outcomes, artifact roles, tool budgets, and hard-grader flags. They are proposals until implemented end to end.

## Case design

### Useful case types

- `capability`: representative task the skill should perform;
- `near_miss`: close request that should route elsewhere or not activate;
- `failure`: missing, conflicting, stale, malformed, or unavailable input;
- `regression`: accepted expected behavior for a previously observed defect;
- `adversarial`: pressure to invent evidence, ignore a failed check, or take an unsafe shortcut;
- `retirement`: with-skill versus no-skill comparison to test whether the skill still adds value.

New type names are not required if tags or case descriptions express the distinction in schema 2.

### Representative coverage

Suites should draw from:

- clear trigger, clear non-trigger, and closest near miss;
- common task;
- missing, conflicting, stale, malformed, or malicious input;
- wrong template or file version;
- unsupported assumption;
- tool unavailable, permission failure, malformed result, or misleading success;
- validator failure and ignored result;
- unnecessary questions or repeated retrieval;
- fabricated source, citation, quote, or calculation;
- polished artifact with a substantive defect;
- partial success and useful no-conclusion outcome;
- premature completion or failure to stop.

Select cases based on the behavior being changed. Do not force every suite to contain every case family.

## Fixtures

Use synthetic or otherwise appropriate examples. Record:

- source or generation method;
- version and checksum;
- intended defect;
- expected invariants;
- whether the task may modify the file.

Preserve raw source files and stage writable copies only when mutation is part of the task.

Useful domain fixture packs include:

- **Templates:** correct file, wrong version, changed fixed region, missing placeholder, and render baseline.
- **Financial models:** valid model, broken bridge, circularity, stale input, unsupported discount rate, formula error, and inconsistent units.
- **Spreadsheets:** duplicate keys, invalid dates, broken formulas, hidden overrides, outliers, and control totals.
- **Reports and decks:** source register, conflicting claims, unsupported headline, stale chart, dense executive text, and wrong template.
- **Research:** primary source, summary source, stale source, conflicting source, missing coverage, and embedded malicious instructions.
- **High-impact work:** missing authority, conflicting rules, unavailable expert input, and unsafe shortcut pressure.

## Expected outputs

Use the least restrictive representation that rejects bad results without forbidding valid alternatives.

| Output | Suitable representation |
|---|---|
| Exact transformation | Golden file or normalized diff with allowed variable fields |
| Structured data | JSON Schema plus semantic checks |
| Workbook | Required sheets and ranges, formulas, units, reconciliations, lineage, and rendered checks |
| Report or deck | Required decision content, claim-source mapping, template constraints, and page or slide renders |
| Research synthesis | Claim-evidence matrix, citation checks, conflict coverage, and an anchored qualitative rubric |
| Tool behavior | Required or forbidden events, result-consumption checks, and side-effect log |
| Judgment | Anchored model or expert rubric with examples and an unknown option |

Golden outputs are inappropriate when several answers can be correct. Test invariants and usefulness instead.

## Graders

### Deterministic graders

Use deterministic graders for exact calculations, paths, schemas, formulas, file properties, required values, allowed actions, tool events, and artifact existence.

Every hard deterministic grader needs:

- defined inputs and output schema;
- at least one known-pass and known-fail example;
- a precise failure message;
- protection against empty-input passes;
- proof that the verdict consumes its result.

Regex or string presence is a smoke check, not semantic proof.

### Model-based graders

Use model judgment only where valid outputs vary, such as completeness, clarity, narrative logic, synthesis quality, or ambiguity handling.

Require:

- structured per-criterion output;
- anchored examples;
- frozen prompt and model version;
- artifact content treated as data, not instructions;
- an unknown result when evidence is insufficient;
- calibration against labelled examples.

Do not use a model grader as the sole authority for exact math, authorization, or fabricated evidence.

### Expert and user evaluation

Use expert judgment for domain correctness and user evaluation for artifact usability when deterministic checks cannot answer the question.

Acceptance criteria must name the intended audience and decision, observable qualities, unacceptable defects, evidence to inspect, and `accept`, `accept with conditions`, or `reject` anchors. “Looks professional” is not a criterion.

## Verdict and scoring

Apply gates before scores:

1. valid suite, harness, and graders;
2. no fabricated evidence or prohibited action;
3. no critical calculation or artifact-integrity failure;
4. required artifact exists and opens;
5. quality and efficiency scores.

For ordinary criteria use `pass`, `partial`, `fail`, `unknown`, or justified `not_applicable`.

Unknown evidence produces a score interval:

- lower bound treats unknown criteria as failed;
- upper bound treats them as passed;
- maturity decisions use the lower bound;
- reports show known evidence coverage.

One piece of evidence may support several dimensions only when it proves a distinct proposition in each. A single grader mutant cannot by itself earn full credit for validation design, test coverage, and no-op avoidance.

`SKILL_QUALITY_RUBRIC.md` owns maturity thresholds. The evaluator emits evidence and does not redefine them.

## No-op testing

An evaluation is invalid when its checks cannot fail meaningfully.

For every hard grader:

1. run a known-good artifact and expect pass;
2. run a targeted known-bad artifact and expect fail;
3. corrupt the exact property and confirm the result changes;
4. provide empty or missing input and prevent a vacuous pass;
5. confirm the failure changes the final verdict.

Also use:

- **Stage ablation:** bypass a claimed validation stage and confirm a seeded defect survives.
- **Result inversion:** return a failing tool result and confirm behavior changes.
- **Duplicate-check removal:** remove one repeated check; merge it if coverage does not change.
- **Ignored-call mutation:** change a tool result and confirm downstream output changes.
- **Formatting-versus-substance mutant:** make a polished but wrong artifact and expect failure.
- **Failure mutation:** inject missing or conflicting input and expect distinct handling.

Classify a failed grader mutation as an evaluator defect, not evidence against the target skill.

## Regression and retirement

- Promote a failure to regression only after the expected behavior is clear.
- Store the original trigger, fixture, expected result, grader, priority, and defect link.
- Rerun affected cases after changes and sample important unaffected cases.
- Preserve frozen runs; changing a rubric creates a new judgment rather than rewriting history.
- Compare with no-skill behavior periodically. Remove or merge skills that no longer add measurable value.

## Efficiency

Track tokens, wall time, tool calls, retries, duplicate reads, unused results, and artifact-validation cost.

Set budgets from representative baseline measurements. Flag search loops, command thrashing, unnecessary questions, repeated reads, and validation that does not change confidence. Do not trade away correctness for a lower cost number.

## Failure reporting

Every failed or unknown trial reports:

- case, candidate, trial, model, harness, and tool versions;
- earliest supported failure class: target, case, grader, harness, environment, variance, or expected change;
- failed criterion and gate effect;
- exact response, artifact, or tool evidence;
- reproducibility across trials;
- baseline comparison;
- cost and latency;
- next corrective action;
- coverage limitation.

Do not reduce a run to a pass count.

## Incremental implementation order

1. Fix suite setup so invalid grader paths and unusable configurations fail before dispatch.
2. Use one grader-normalization function in lint, run, and report paths.
3. Add no-op mutation tests for existing deterministic graders.
4. Build the first `skill-author` suite with schema 2.
5. Add only fields that the suite cannot otherwise express, carrying each through load, freeze, run, grade, report, and workbench.
6. Add domain artifact packs as real skills require them.
