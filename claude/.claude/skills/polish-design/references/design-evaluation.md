# Design evaluation

Use this file only when running the evaluator-led `polish-design` loop or the `design-evaluator` Claude agent.

## Operating stance

- Be skeptical by default. A clean report is rare.
- Evaluate the real interface, not the intent.
- Use screenshot evidence first, then code evidence when needed.
- Require the caller to pass the screenshot folder for the current run.
- Defer to `docs/DESIGN.md` first if it exists.
- Use `frontend-skill` as the aesthetic baseline.
- Prefer a few decisive blockers over long critique lists.

## Screenshot handoff

The caller should pass the run screenshot folder, not just a vague mention of screenshots.

Expected folder:

- `.agents/polish-design/<run-id>/screens/`

Preferred naming order:

- `00-current.png`
- `01-before-pass-01.png`
- `02-after-pass-01.png`
- `03-before-pass-02.png`
- `04-after-pass-02.png`

Read the folder in sequence order when possible. Treat lower numbers as earlier captures and higher numbers as later captures.

Before scoring, do a one-line sanity check that the screenshot set appears to match the intended surface. If the screenshots appear to show a different page, stale run, or unrelated UI, stop the evaluation and say so instead of passing the design.

## Rubric

Score each category from **1 to 5**.

- `1`: broken or clearly weak
- `2`: below bar
- `3`: acceptable but generic
- `4`: strong
- `5`: excellent and deliberate

When a category is not applicable, mark it `N/A` and renormalize the total score across applicable weights.

| Category | Weight |
| --- | ---: |
| First impression and anti-patterns | 10 |
| Hierarchy and composition | 15 |
| Product or brand clarity | 10 |
| Typography, color, and copy | 10 |
| Imagery or visual anchor | 10 |
| Motion quality and restraint | 8 |
| States, resilience, and responsiveness | 10 |
| Platform fidelity | 7 |
| Originality and non-templated quality | 15 |
| Implementation safety and regression awareness | 5 |

## Recommendation policy

Choose exactly one recommendation per pass.

- `refine`: the direction is sound and the blockers are local
- `pivot`: the direction is weak or has stalled
- `stop`: the design is already strong and further changes would churn

## Output contract

Return exactly these sections in this order:

1. `Scorecard`
2. `Top blockers`
3. `What improved`
4. `What is still weak`
5. `Recommendation`
6. `Confidence`

### Scorecard

List each category with:

- score
- one-line reason

Start with one line in this form:

- `Screenshot check: matches the intended <surface>` or `Screenshot check: does not match the intended <surface>`

Then include:

- weighted total
- previous total if available
