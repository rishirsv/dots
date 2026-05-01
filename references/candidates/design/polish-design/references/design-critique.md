# Design critique

Use this file when `polish-design` is asked to critique, review, assess, or diagnose a UI before editing.

## Operating stance

- Evaluate the real interface, not the intent.
- Prefer a few decisive findings over a long list of nits.
- Stay concrete: problem, impact, fix direction.
- Findings should help decide what to change next, not merely describe taste.

## Review dimensions

Check these areas:

1. Anti-patterns and first impression
2. Hierarchy and visual priority
3. Information architecture and cognitive load
4. Product clarity or brand clarity
5. Discoverability and affordance
6. Typography, color, and copy
7. Emotional tone and trust
8. States and journey gaps

## Questions to answer

- Is the first screen unmistakable and intentional?
- Is there one dominant idea, or are elements competing?
- Can a new user tell what to do next within a few seconds?
- Does the page explain itself with headings, grouping, and flow?
- Does the interface feel right for the product and audience?
- Are there hidden failure points in onboarding, empty states, or error recovery?

## Output shape

Return findings under:

1. `Anti-Patterns Verdict`
2. `Overall Impression`
3. `What's Working`
4. `Priority Issues`
5. `Persona or Flow Red Flags`
6. `Recommended Next Move`

## Priority issue format

For each issue:

- `What`: name the problem clearly
- `Why it matters`: user impact or product risk
- `Fix direction`: concrete next move
- `Severity`: `Critical`, `High`, `Medium`, or `Low`

## Red flags worth calling out

- interface looks generic or AI-generated
- weak first action or unclear CTA
- too many choices at once
- decorative style replacing hierarchy
- headings that sound stylish but explain little
- hidden interactions or weak affordance
- abrupt error or empty states
- inconsistent tone across the flow
