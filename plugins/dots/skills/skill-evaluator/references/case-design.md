# Design cases and comparisons

Choose cases that can reveal whether the skill does the behavior being tested.
A case that merely exercises the skill proves little.

## Select cases

Start from observed failures, accepted outputs, common work, boundaries, near
misses, prohibited effects, and different valid ways to succeed. Load the
artifact-specific guidance linked from `skill-practices.md`; do not copy its
domain lists here.

For each case define:

- a realistic request and stable ID;
- expected and prohibited observable outcomes;
- accepted alternatives;
- independent and hidden evidence;
- worker-visible fixtures and permitted effects;
- graders and invalid-run conditions; and
- dependency IDs so a changed file invalidates only the affected cases.

Use a working split for exploration. Reserve fresh confirmation cases before a
readiness conclusion.

## Choose the comparison

Require a baseline when the evaluation compares cause and effect. Use no skill
for a new skill, the old version for an update, or another complete
configuration for a product comparison. Add absolute criteria for readiness;
being better than a weak baseline is not enough.

Hold task, fixtures, tools, model settings, and run policy fixed. When several
dimensions differ, compare complete configurations but do not assign causality
to one component. Keep case order stable and use durable IDs rather than display
names.
