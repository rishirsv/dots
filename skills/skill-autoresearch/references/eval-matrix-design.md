# Eval Matrix Design

Design the eval matrix before rewriting the skill.

## Goal

Turn vague “make the skill better” requests into explicit pass or fail checks.

## Step 1: Identify failure modes

Define 3 to 7 failure modes.

Good examples:

- trigger language is vague
- output contract is missing
- resource routing is unclear
- prompt leaves too much freedom at a dangerous step
- bundled references are not discoverable

Avoid:

- “overall quality”
- “feels better”
- overlapping criteria that say the same thing twice

## Step 2: Choose the check type

Prefer this order:

1. deterministic code check
2. structured binary judge
3. secondary metric from another tool

Use deterministic checks for anything you can prove from text, structure, links, schemas, or files.

## Step 3: Split the scenarios

Use both sets:

- calibration: the scenarios you use during tuning
- holdout: realistic untouched scenarios that confirm the win is real

Keep both small but varied.

Suggested starting point:

- 3 to 5 calibration scenarios
- 2 to 4 holdout scenarios

## Step 4: Build the matrix

Each row is a scenario.
Each column is one failure-mode check.

Each cell is:

- `Pass`
- `Fail`
- `N/A`

Keep a short explanation beside every failing result.

## Step 5: Keep the contract stable

After the baseline:

- do not rewrite failing scenarios just to help a candidate win
- do not delete strict checks because the current best candidate struggles
- do not merge multiple failure modes into one judge

If the contract truly needs to change, record why in `session.md` first.
