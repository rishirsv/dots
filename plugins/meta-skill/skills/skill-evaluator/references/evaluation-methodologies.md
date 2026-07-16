# Evaluation Methodologies

Read this when selecting prompts, comparisons, or graders.

## Start With Real Signal

Prefer prompts grounded in observed failures, accepted outputs, common user
requests, or existing runs. Use synthetic prompts as hypotheses until the user
confirms that they represent real use.

Keep a prompt when it tests a distinct behavior and its result can change a
decision. Start with two or three prompts. Add cases only when they cover a new
behavior, boundary, or recurring failure.

Use an ad hoc run when one prompt can answer the immediate question. Save it as
a durable case only after confirming the prompt and expected behavior.

## Choose The Comparison

Keep the prompt, fixtures, environment, and execution settings fixed while the
candidate changes.

| Question | Comparison |
|---|---|
| Does the skill improve the task? | No skill vs current skill |
| Did a revision improve behavior? | Current skill vs candidate revision |
| Does one implementation outperform another? | Named candidate vs named candidate |
| How does a prompt or skill perform against a benchmark? | Run the same benchmark cases and scoring method against each prompt or skill |

If both candidates pass, the task demonstrates no uplift. If both fail, the
comparison is inconclusive until the failure is diagnosed.

## Choose The Grader

Every case needs an explicit grading method. Use the most exact method that
accepts every valid result.

| Result being judged | Grader |
|---|---|
| File existence, schema, exit status, formulas, calculations, tests, or required actions | Deterministic validator |
| Correctness, usefulness, completeness, or structure with multiple valid answers | LLM judge; read [judge.md](judge.md) |
| Preference or specialist judgment that cannot be specified reliably | Human judgment |

Use transcript evidence only when the process itself is part of the expected
behavior. Keep expected outputs, judge guidance, validators, and human labels
hidden from trial workers.

When a result fails or the candidates disagree unexpectedly, read
[error-analysis.md](error-analysis.md) and review the traces with the user
before changing the suite or skill.
