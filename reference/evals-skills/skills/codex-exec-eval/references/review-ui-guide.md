# Review UI Guide

The generated eval project includes a local browser-based grading interface.

## What the UI Shows

- all test cases
- candidate version selector
- split filter for training, holdout, or all
- the case prompt
- the result for the selected candidate
- deterministic check results
- Pass / Fail / Defer controls
- notes field
- review progress counts

## What the UI Saves

The review app stores labels locally in JSON in v1.

Each label records:

- candidate version
- case ID
- verdict
- notes
- timestamp

## Review Intent

Use the UI for fixed-batch human grading, not for editing the harness.

The human is deciding whether the candidate output is good enough. The optimization loop uses those grades as evidence for the next candidate revision.
