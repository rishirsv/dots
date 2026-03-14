# Codex Exec Eval

`codex-exec-eval` is a guided system for testing and improving a skill with `codex exec`.

You use one visible workflow:

1. point it at the skill you want to improve
2. tell it what the skill is supposed to do
3. create or import test cases
4. run a baseline version of the skill
5. review a fixed batch of outputs in a browser
6. let Codex create the next skill revision
7. repeat until a version clears the holdout gate
8. stage the winner for approval before replacing the real skill

The older eval reference skills stay behind the scenes. You do not need to invoke them directly.

## What it creates

For each eval project, the scaffold creates:

- a readable `codex-eval.json` config
- test cases in `cases.json` and optional `cases.csv`
- a baseline candidate skill version `V1`
- later candidate versions like `V2`, `V3`, `V4`
- batch run outputs and summaries
- local human grades and notes
- a browser-based review app
- staged promotion output for a winning candidate

## Simple mental model

- **Cases** are the test questions.
- **Candidate versions** are the skill revisions being compared.
- **Runs** are `codex exec` attempts using one candidate on one case.
- **Checks** are simple automatic pass/fail rules.
- **Human grades** are the fixed review batch each round.
- **Holdout** is the separate validation set that decides whether a candidate can be promoted.

## How the loop works

### 1. Onboarding

The system asks:

- which skill is being improved
- where it lives on disk
- what files belong to it
- what good output looks like
- where the test cases come from
- what model and sandbox should be used
- how many human-reviewed training cases each round should use
- which holdout set is the promotion gate

### 2. Baseline import

The target skill is copied into the eval project as `V1`.

The real skill is not edited during normal experimentation. The loop works on candidate copies first.

### 3. Baseline evaluation

`V1` runs across the training and holdout cases.

The harness records:

- raw outputs
- deterministic check results
- summary reports

### 4. Human grading

You open the local review page and grade the fixed training batch.

The review page shows:

- all test cases
- the case prompt
- the result for the selected candidate
- the automatic check results
- Pass / Fail / Defer controls
- notes

### 5. Candidate creation

Once the training batch has enough human labels, the system creates the next skill revision:

- `V2` from `V1`
- `V3` from `V2`
- and so on

It revises the skill package itself, including:

- `SKILL.md`
- associated references
- associated prompt or helper files inside that skill package

### 6. Rerun and compare

The new candidate is run through the eval suite again.

The loop compares:

- automatic scores
- human-graded training results
- holdout results

### 7. Holdout gate

A candidate is not considered a winner just because it looked better on the reviewed training batch.

For v1, promotion requires:

- separate held-out validation cases
- a perfect holdout pass result before promotion

### 8. Staged promotion

When a candidate wins:

- it is copied into a staging area
- a promotion summary and diff are generated
- a human must explicitly approve before the real skill is replaced

The system does not auto-promote in v1.

## Main scripts in the generated project

- `run_eval.py`
  - run one candidate through the eval suite
- `review_server.py`
  - open the local grading web app
- `optimize_skill.py`
  - create the next candidate from the current one using the training evidence
- `promote_candidate.py`
  - stage a winner and optionally apply it after approval

## Typical flow

```bash
# 1. Run the current candidate
python3 run_eval.py --candidate V1

# 2. Open the review app
python3 review_server.py --project-dir .

# 3. Create the next candidate after grading
python3 optimize_skill.py draft-next --from V1

# 4. Run the new candidate
python3 run_eval.py --candidate V2

# 5. Stage a winner once holdout passes
python3 promote_candidate.py stage --candidate V2
```

## What this is optimizing

This is not only prompt tuning.

The system is designed to improve the skill package itself. That means the candidate revision may update:

- the main skill instructions
- supporting references
- helper prompts
- related package files that belong to the skill

The loop is inspired by the `autoresearch` pattern:

- keep the editable surface explicit
- run comparable experiments
- keep or reject changes based on results
- iterate on the versioned candidate, not the live source, until a winner emerges
