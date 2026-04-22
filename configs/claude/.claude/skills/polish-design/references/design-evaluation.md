# Design evaluation

Use this file only when running the evaluator-led `polish-design` loop or the `design_evaluator` custom agent.

## Operating stance

- Be skeptical by default. A clean report is rare.
- Evaluate the real interface, not the intent.
- Evaluate screenshots and other visual captures only. Do not evaluate code directly.
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
If visual evidence is missing or ambiguous, ask for better screenshots or stop. Do not infer design quality from code.

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

## Category guidance

### First impression and anti-patterns

Judge whether the surface immediately feels generic, over-generated, or visually confused.

Look for:

- generic SaaS card mosaics
- hero cards or stat strips as the main composition
- decorative gradients, glow, or glass replacing hierarchy
- repeated section patterns with no compositional surprise
- weak visual thesis

### Hierarchy and composition

Judge whether the eye knows where to go in the first 2 seconds.

Look for:

- one dominant idea per section
- clear CTA priority
- deliberate spacing rhythm
- strong grouping and pacing
- whether the first viewport reads like a poster rather than a document when appropriate

### Product or brand clarity

Judge whether the product, brand, or working surface is unmistakable.

Look for:

- brand presence in the first screen when relevant
- useful product orientation on app surfaces
- headings that explain what the user can do
- low ambiguity about the page's job

### Typography, color, and copy

Judge whether type, color, and words clarify rather than decorate.

Look for:

- readable type hierarchy
- limited and intentional accent usage
- concise copy
- copy that sounds like product UI on app surfaces
- no prompt-like or design-commentary text leaking into the UI

### Imagery or visual anchor

Judge whether the interface has a real visual anchor when the surface calls for one.

Look for:

- strong image or dominant visual plane
- calm area for text over imagery
- imagery doing narrative work
- absence of visual clutter that competes with the UI

### Motion quality and restraint

Judge whether motion improves hierarchy, atmosphere, or affordance.

Look for:

- visible but restrained entrance or transition design
- smoothness
- consistency
- motion that earns its keep

### States, resilience, and responsiveness

Judge whether the design holds up outside the happy path.

Look for:

- empty, loading, error, and success states
- long text or missing data
- keyboard and focus treatment
- mobile and small-screen behavior
- tap target quality

### Platform fidelity

Only score this when the target is iOS or Expo.

Look for:

- native-feeling spacing and motion
- use of platform conventions where they improve the product
- no blind application of iOS styling to non-iOS work

### Originality and non-templated quality

Judge whether the work feels deliberate rather than assembled from defaults.

Look for:

- distinct composition
- a memorable visual thesis
- avoidance of repeated generic section scaffolds
- design moves that feel specific to the product

### Implementation safety and regression awareness

Judge whether the polish work preserves behavior and avoids obvious regressions.

Look for:

- changes likely to break layout or states
- excessive motion or asset cost
- risky CSS or component changes without corresponding gains

## Automatic fail signals

These do not force the final recommendation on their own, but they should heavily drag the score down:

- boxed hero when the page clearly wants a full-bleed hero
- brand absent from the first screen on a branded page
- app UI built from stacked cards instead of layout
- beautiful image with weak CTA or weak product clarity
- busy imagery behind text
- repeated mood statements across sections
- ornamental motion with no narrative or affordance role
- more than two typefaces or multiple accent colors without a strong reason

## Recommendation policy

Choose exactly one recommendation per pass.

### `refine`

Choose this when:

- the current direction is sound
- the top blockers are local and fixable
- the score is improving

### `pivot`

Choose this when:

- originality or overall design quality has stalled for two passes
- the main composition thesis is wrong
- the same blocker keeps reappearing
- further polish would only decorate a weak direction

### `stop`

Choose this when:

- the design is already strong
- the remaining issues are minor
- more changes are more likely to churn than improve

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

### Top blockers

List only the top 1-3 issues blocking the next score jump.

### What improved

State only concrete deltas from the prior pass.

### What is still weak

Do not leave this empty. Even strong work should name the next weakness honestly.

### Recommendation

Use exactly one of:

- `refine`
- `pivot`
- `stop`

Explain the recommendation in 1-2 sentences.

### Confidence

State confidence as `low`, `medium`, or `high` with one short reason.

## Artifact schema

Each evaluator-led run should use `.agents/polish-design/<run-id>/`.

Recommended contents:

- `brief.md`: polish contract and pass goal
- `pass-01-eval.md`: initial scorecard and blockers
- `pass-01-plan.md`: implementation move for that pass
- `pass-02-eval.md`: next scorecard and recommendation
- `summary.md`: final trend, unresolved issues, and stopping reason
- `screens/`: all saved screen captures for the run

Keep each file short. Prefer bullets over prose.
Do not store screen captures in `docs/` or any documentation folder.

## Calibration examples

### Example A: polished but generic landing page

- Strong spacing and clean implementation
- Generic SaaS hero with cards and logo cloud
- Verdict: score originality low, likely `pivot`

### Example B: opinionated, high-quality brand page

- Strong visual anchor
- Brand unmistakable in the first viewport
- Copy sparse and specific
- Verdict: high hierarchy and originality, likely `refine` or `stop`

### Example C: over-styled but weak usability

- Heavy gradients, glow, blur, and motion
- CTA unclear
- Content hierarchy buried
- Verdict: low first-impression and hierarchy scores, likely `pivot`

### Example D: solid product UI with bland presentation

- Functional and readable
- Clear headings and states
- Generic card stack and no memorable composition
- Verdict: good clarity and resilience, weak originality, usually `refine`
