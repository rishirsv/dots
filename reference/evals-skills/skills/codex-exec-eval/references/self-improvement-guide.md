# Self-Improvement Guide

Use this guide when the user wants to improve a skill package, not just run a one-off eval.

## Core Loop

1. Import the real skill as `V1`
2. Run `V1` on training and holdout cases
3. Collect fixed-batch human grades on the training split
4. Create `V2` from `V1`
5. Run `V2`
6. Repeat until a candidate clears the holdout gate or progress stalls
7. Stage the winning candidate for approval

## What Gets Revised

The candidate skill package may revise:

- `SKILL.md`
- reference documents that belong to the skill
- prompt and helper files that belong to the skill package

Do not revise the eval harness itself as part of ordinary candidate mutation.

## Versioning Rules

- Baseline import is always `V1`
- Each new revision increments by one version
- `V2` is created from `V1`
- `V3` is created from `V2`
- Keep candidate history intact for comparison

## Human Review Rules

- Use a fixed training review batch each round
- Keep a separate held-out validation set
- Do not promote based only on the training batch
- Use the holdout set as the promotion gate

## Promotion Rules

- Stage winners first
- Generate a summary and file diff
- Require explicit human approval before applying the winner to the real skill path
