# Anti-Overfitting

The loop is only useful if it generalizes.

## Required protections

### 1. Holdouts are real holdouts

- Do not tune against holdout scenarios.
- Do not rewrite holdout prompts after a candidate loses.
- Use holdouts to confirm, not to invent the target.

### 2. Keep the matrix stable

- Establish the baseline first.
- Avoid changing the success function mid-loop.
- If you must change it, record the exact reason in `session.md`.

### 3. One change per iteration

Multiple big edits make it impossible to tell what actually helped.

### 4. Favor code over judges

Judges are noisy and easy to game.
Use them only for criteria that cannot be decided mechanically.

### 5. Preserve invariants

Write down what must not change:

- skill scope
- required output contract
- mandatory safety constraints
- required references or bundled assets

Do not trade those away for a better-looking score.

## Warning signs

- the candidate keeps winning on calibration but losing on holdout
- the skill becomes longer without becoming clearer
- the loop keeps changing the rubric instead of the skill
- the judge prompt starts sounding like a hidden answer key
- the kept changes are hard to explain in one sentence
