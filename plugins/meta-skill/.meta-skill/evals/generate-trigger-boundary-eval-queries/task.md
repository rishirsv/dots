# Generate Trigger Boundary Eval Queries

Capability: Evaluate Skill and Improve Skill handoff
Topics: trigger-queries, evaluate-skill, improve-skill

## Problem Description

A skill called `spreadsheet-analyst` helps users analyze spreadsheet data: cleaning rows, computing aggregates, generating summaries, and spotting anomalies. It under-triggers when users ask about CSV or Excel work without saying "spreadsheet," and over-triggers on unrelated data tasks like cleaning JSON config or writing SQL queries.

The maintainer wants trigger evaluation queries first, not a description rewrite yet.

Current description:

```text
Helps with spreadsheet analysis tasks. Use when working with Excel or CSV files.
```

## Output Specification

Return:

- `trigger_eval_queries.json` content with exactly 20 entries
- each entry has `query` and `should_trigger`
- at least 10 should-trigger queries and at least 6 should-not-trigger queries
- near-miss should-not-trigger cases that share vocabulary with spreadsheet work
- varied phrasing, including casual or informal user language
- `query_rationale.md` content explaining the strategy
- a note that Improve Skill should edit the description only after evidence exists

## Task

Author the trigger query eval set. Do not rewrite the skill description yet.
