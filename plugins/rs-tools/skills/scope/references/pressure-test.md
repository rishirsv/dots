# Pressure-Test

Use Pressure-Test when the user has an existing idea, plan, architecture, implementation direction, or decision and wants it questioned thoroughly before planning or coding.

If the user is not asking for critique and the direction is already accepted, exit Scope and proceed directly instead of reopening settled decisions.

## Goal

Find hidden assumptions, missing evidence, failure modes, and simpler alternatives before the direction hardens.

## Workflow

1. Restate the proposal.
2. If repo claims are checkable, inspect the repo before treating them as true.
3. Walk the decision tree branch by branch.
4. Resolve dependencies between decisions in order.
5. Ask one question at a time.
6. Provide the recommended answer or likely default for each question.
7. Decide whether to proceed, revise, split, or drop.

## What To Test

Look for:

- hidden assumptions
- unclear ownership
- unsupported user or business value
- duplicated systems or duplicate truth
- simpler alternatives
- scope that should be split
- edge cases and failure modes
- migration or compatibility costs
- verification gaps
- places where the idea solves the symptom but not the underlying problem

For product or UX work, also test:

- whether the proposed flow matches the real user moment
- whether the UI burden is proportionate to the value
- whether empty, error, and transition states are accounted for
- whether the idea adds surface area instead of reducing friction

## Output

This lane's output shape supersedes the common Scope summary.

End with one recommendation:

- **Proceed**: the direction is sound enough to plan or implement.
- **Revise**: the core idea is good, but a specific part needs reshaping.
- **Split**: the idea combines separate decisions or deliverables.
- **Drop**: the idea is not worth pursuing in its current form.

Include:

- strong parts
- risks
- hidden assumptions
- simpler alternative when one exists
- recommended next step

Default to chat. Save only when the tested direction should become a context or product spec.
