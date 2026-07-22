# Custom Graders

Use a custom eval only when the user explicitly asks for an independent grader
or the outcome cannot be represented fairly by the default weighted checklist.
Store custom suites under the skill's hidden companion, separate from
`evals/`:

```text
<skill-name>/.<skill-name>/custom-evals/
  evals.json
  cases/<case-id>/
```

Custom graders may be:

- deterministic code with known-Pass and known-Fail fixtures;
- a calibrated, pinned model judge;
- an independent human grader; or
- a state-aware validator using hidden before/after capture.

Follow [evals-schema.md](evals-schema.md), [judge.md](judge.md), and
[validate-judge.md](validate-judge.md) for this path. Keep its
Pass/Fail/Partial/Unknown result separate from default checklist points. A report
may show both channels, but must not average or convert one into the other.

## Write Criteria From The Visible Task

A rubric translates the user's requested outcome into observable criteria. It
must not introduce a requirement that the trial worker could not see.

Start with the user's prompt, expected outcome, examples, and confirmed trace
labels. Share the proposed criteria and incorporate the user's corrections
before running them. The method remains stable, but the criteria change with
the task and the user's definition of success.

For each criterion, define:

| Field | Question |
|---|---|
| Name | What single property is being judged? |
| Pass | What observable evidence proves the property is satisfied? |
| Fail | What observable defect proves it is not satisfied? |
| Evidence | Which response, artifact, calculation, or declared process event can decide it? |

Write one criterion per distinct requirement. Prefer binary Pass/Fail criteria.
Use `unknown` when the required evidence is unavailable. Mark a check advisory
only when its failure should not fail the trial.

## Put Each Criterion In Its Owning Field

- Put concise outcome criteria in the case's `expectations`.
- Put an exact reference artifact or answer in `expected_output`; it is evidence,
  not a substitute for criteria.
- Use a deterministic validator when code can decide the criterion.
- Use one case-local LLM `judge.md` for one semantic failure mode; follow
  [judge.md](judge.md).
- Declare a human grader only when the decision cannot be specified reliably
  enough for code or an LLM judge.

## Test The Rubric Before Running The Suite

Apply every load-bearing criterion to at least one known Pass and one known
Fail trace. Include a borderline trace when the decision boundary is unclear.
Ask the user to confirm disputed labels or interpretations.

For a deterministic grader, save the known Pass as an oracle outcome and the
known Fail as a negative outcome under the case's `grader-tests/` folder.
Declare both in `grader_tests`; `eval run --check` must execute the grader
against them before a run can start. Include the response, produced artifacts,
and before/after state required by the grader rather than testing only a
descriptive surrogate.

For a stateful task, verify the requested state transition and relevant
unchanged state separately. A correct target mutation with collateral changes
must fail. Prefer backend or filesystem state evidence over a response that
merely claims the action happened.

Remove or rewrite a criterion when it:

- restates the prompt without identifying evidence;
- cannot distinguish a known Pass from a known Fail;
- duplicates another criterion;
- rewards formatting while missing substantive correctness;
- requires hidden information unrelated to the visible task; or
- always passes, always fails, or cannot produce a decision.

The rubric is ready when every criterion changes a possible verdict, diagnoses
a distinct defect, or supplies evidence needed by another load-bearing check.

Each run freezes the exact rubric it uses. Changing a criterion, decision
boundary, grader, or rubric annotation requires a new run. Do not compare
scores across materially different rubrics without identifying the change.
