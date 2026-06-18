# Eval Types And Grader Choices

Read when choosing what kind of eval suite to create and which graders belong
with each task.

An eval suite should answer one decision. Name that decision first, then choose
the smallest task set and grader mix that can answer it.

## Vocabulary

Use these terms consistently:

| Term | Meaning |
|---|---|
| **Task** | One unit of work with defined inputs and success criteria. |
| **Candidate** | The agent-harness setup: no skill, current skill, or candidate skill. |
| **Trial** | One attempt at one task under one candidate. |
| **Outcome** | The final answer, files, artifacts, or state at the end of the trial. |
| **Transcript** | The full event record: messages, tool calls, reasoning summaries, intermediate results, and errors. |
| **Grader** | Code, model, or human logic that scores one aspect of the trial. |
| **Assertion / check** | One named expectation inside a grader. |
| **Gate** | A required grader whose failure rejects a candidate for the measured scope even when other scores improve. |
| **Harness** | The runner and workspace machinery that executes trials, records evidence, grades, and aggregates. |

Meta Skill stores candidates in `candidates[]` and task rows in `cases[]`; use
candidate/task/trial language in prose and JSON.

## Choose The Eval Type

| Type | Question it answers | Good starting size | Typical graders |
|---|---|---:|---|
| **Capability / quality** | What can this skill do well, and where does it still struggle? | 3-10 tasks for a local loop; 20-50 for a serious first suite | Model judge, reference output, deterministic checks where possible |
| **Regression** | Does behavior that already worked still work? | Any known-good task bank | Deterministic validators first; model judge only for semantic quality |
| **Trigger / boundary** | Does the right skill activate, and does it stay quiet on near misses? | Balanced should-trigger and should-not-trigger tasks | Transcript/tool-use checks, model judge, repeated trials |
| **Failure / diagnostic** | Did a known failure get fixed? | 1-3 focused tasks | Reproduction task plus exact validator or anchored judge guidance |
| **Gate / readiness** | Is this safe enough to package, publish, or use as a selection gate? | Small must-not-break set | Required deterministic checks, calibrated judge guidance, human spot check when high judgment |
| **Cost / latency / efficiency** | Did the candidate get slower, more expensive, or noisier? | Same tasks as capability/regression | Transcript metrics: turns, tool calls, tokens, latency |

Do not mix all types into one claim. A suite can contain multiple task types,
but the report should say which question each group answers.

Capability suites should be hard enough that the current skill has room to
improve. Regression suites protect known-good behavior and should stay near
100%. When a capability task saturates near 100%, graduate it into regression
instead of letting it dilute the improvement signal.

## Choose The Grader Mix

Use the most exact grader that can fairly judge the requirement:

| Grader | Strengths | Weaknesses | Use for |
|---|---|---|---|
| **Code validator** | Fast, cheap, reproducible, objective. | Brittle when many valid outputs exist; can reward surface compliance. | Required files, schema shape, exact strings, tests, state checks, forbidden/required tool use, token/turn counts, transcript metrics. |
| **Model judge** | Handles nuance, freeform outputs, multiple valid answers, groundedness, usefulness, and source quality. | Nondeterministic, costlier, can drift or inherit judge guidance ambiguity. | Semantic quality, completeness, instruction following, conversational quality, research coverage, pairwise comparisons. |
| **Human grade** | Gold standard for taste, domain judgment, subjective UX, and calibrating model judges. | Slow, expensive, inconsistent without guidance. | Calibration, high-judgment accept/reject decisions, ambiguous tasks, systematic human studies, user-specific preference. |

Prefer grading the outcome over the path. Use transcript graders for process
requirements such as tool choice, unsafe tool use, excessive turns, or whether a
failure was caused by the harness rather than the skill.

Use multiple graders when one requirement is exact and another is semantic. For
example, a conversational skill may use a code grader to confirm a required tool
was called, a model grader for helpfulness, and a human grader to calibrate the
model against human review.

Use gates for must-not-break checks: prompt-boundary leaks, package exclusions,
forbidden file edits, schema validity, safety constraints, or deterministic
regressions. Gates should usually be code validators. A candidate that fails a
gate is not selectable even when its judge score is higher.

## Binary Check Bias

Start with pass/fail checks. A good eval should usually be answerable as "did
the outcome satisfy this observable requirement?" Binary checks are easier for
humans, model judges, and validators to agree on.

Use `partial` only when a non-gating defect is important to track. Use `unknown`
when the evidence does not support a fair decision. Avoid 1-5 or 0-100 scoring
unless the product decision genuinely needs a continuous metric; otherwise
numeric scores hide disagreement and make weak rubrics look precise.

## Write Good Tasks

Every task should pass this checklist before it becomes gating evidence:

- A capable agent following the task instructions could pass it.
- The expected behavior is visible in `task.md`; hidden graders do not demand
  unstated requirements.
- A domain reviewer could independently decide pass/fail from the outcome.
- A reference solution or expected output exists when the task is deterministic
  or artifact-heavy.
- The task is isolated: it does not depend on leftover files, prior trials,
  hidden state, or global machine setup not declared as fixtures.
- The problem set is balanced when measuring activation: include should-trigger
  and should-not-trigger tasks.
- Repetitions are used when trigger behavior, model grading, or agent behavior
  is variable.

If many trials score 0%, suspect the task, grader, or harness before concluding
the agent is incapable.

For trigger and boundary behavior, a task set is incomplete until it includes
both activation and near-miss non-activation prompts. For tool behavior, pair
"must use the tool" tasks with "must not use the tool" tasks.

## Agent-Type Patterns

Use these patterns when translating task families into graders:

| Agent type | Primary evidence | Common graders |
|---|---|---|
| Coding or editing agent | tests, diffs, changed-file boundaries, response, transcript | code tests, static checks, model judge for explanation quality, transcript check for skipped validation |
| Conversational agent | final state, mid-conversation transcript, response quality | model judge, human calibration, code checks for state/tool calls, transcript checks for process requirements |
| Research agent | cited sources, coverage, groundedness, answer quality | model groundedness judge guidance, source-quality checks, exact checks for objective facts, human spot checks |
| Computer-use agent | UI state, backend state, screenshots, tool calls | state validators, UI element checks, transcript/tool-choice checks, human review for UX quality |

For conversational skills, the final response may be the wrong evidence target.
Look in the transcript for mid-conversation work, tool calls, approvals,
validation, and state transitions when those are part of the task contract.

## Skill Eval Examples

Use these as patterns when authoring evals for Meta Skill lanes or ordinary
agent skills.

### 1. Capability / Quality Task

Goal: measure whether the skill helps produce a better final artifact.

```text
task.md
Create a portable skill from the supplied notes about recurring vendor invoice
extraction. Produce a SKILL.md outline with trigger, inputs, output contract,
invariants, and validation guidance.
```

Hidden graders:

- `judge.md`: scores trigger specificity, output contract, runtime usefulness,
  and contamination avoidance.
- `expected.md`: reference outline showing the required sections.
- optional `validate.*`: checks that the output contains the required headings.

Run under these candidates when supported:

- no skill
- current skill
- candidate skill

### 2. Trigger / Boundary Task

Goal: measure activation without naming the skill.

```text
task.md
I have a repeated workflow from a few prior threads. Turn it into something
reusable so later runs do it the same way.
```

Hidden graders:

- model judge checks whether the response routes to skill-writing behavior.
- transcript check may verify that the target skill or lane was invoked.

Pair it with a near-miss:

```text
task.md
Summarize this one thread for me. Do not make anything reusable.
```

The near-miss should not trigger skill-writing behavior.

### 3. Regression Task

Goal: protect behavior that already works.

```text
task.md
Review this existing skill and produce findings only. Do not edit the payload.
```

Hidden graders:

- validator checks no payload file changed.
- judge checks that findings include evidence, impact, and recommended action.

Regression tasks should stay close to 100% once the behavior is considered
working.

### 3b. Transcript-Aware Conversational Task

Goal: measure a skill whose important work happens mid-conversation.

```text
task.md
Guide the user through choosing a grader for this ambiguous support-triage
skill, then recommend the smallest fair eval suite.
```

Hidden graders:

- model judge checks whether the final recommendation is understandable and
  calibrated to the user's goal.
- transcript validator checks that the agent asked for human judgment only when
  needed and exposed response/transcript evidence before asking for a grade.
- human spot check calibrates whether the guided workflow felt clear.

### 4. Failure / Diagnostic Task

Goal: prove one known failure is fixed.

```text
task.md
The previous version copied source URLs and model names into runtime guidance.
Create the skill without leaking source provenance into SKILL.md.
```

Hidden graders:

- validator scans the outcome for copied source URLs, provider names, and raw
  provenance markers.
- judge checks whether the reusable behavior survived source distillation.

### 5. Gate / Readiness Task

Goal: decide whether a skill is ready to package or select for the measured scope.

```text
task.md
Given this candidate skill payload, decide whether it is ready to package.
Name any missing review, validation, eval, or reference evidence.
```

Hidden graders:

- validator checks links and package exclusions.
- judge checks that missing evidence is reported as a gap, not invented.
- human spot check if the readiness decision depends on subjective judgment.

## Report Guidance

When closing an eval run, report:

- what decision the suite was meant to answer
- task count by type
- candidates compared
- grader mix used
- outcome summary by task
- transcript notes only where they explain failures or unfair grading
- coverage limits and untested behavior
- whether failures look like target failures, task ambiguity, grader bugs, or
  harness constraints

Do not present a green suite as full proof. Say what it measured.
