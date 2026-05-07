# Stop Rules

Do not let the loop drift.

## Stop as complete when

- the main verification path passes or the metric reaches the intended target
- guards still pass
- no required deliverable is missing

## Stop as blocked when

- the next meaningful move requires user input or missing access
- the verification path is invalid or unavailable
- the task depends on a tool or environment that cannot be exercised here

## Stop as plateaued when

- several focused iterations fail to produce a meaningful gain
- the remaining ideas are large scope jumps rather than clean next moves
- the loop starts repeating the same theories in different words

Suggested default:

- plateau after 3 consecutive non-meaningful iterations

When stopping as plateaued, summarize:

- strongest current result
- remaining blockers
- best next experiments if work resumes later
