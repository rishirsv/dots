# Verification contract

Use this contract for the generated project-local skill and its feature map.
Adapt headings only when the repository's established skill format requires it;
preserve the owned decisions and proof requirements.

## Generated skill

The generated `SKILL.md` defines:

- **Scope:** the app, supported product surfaces, owned instances and data, and
  the nearest verification job it does not own.
- **Launch:** exact setup and launch commands, required environment, isolation
  knobs, and an observable ready signal. For a short-lived CLI, launch means
  preparing the executable once and starting each drive in an isolated session.
- **Doctor:** one read-only check that identifies the instance and answers
  whether it is worth driving: expected build or revision, endpoint or device,
  owned profile or data directory, and required authentication.
- **Drive:** exact commands and stable user-facing handles. Prefer accessibility
  roles, labels, prompt text, route paths, command flags, and public API shapes
  over coordinates, tab order, timing sleeps, or implementation internals.
- **Evidence:** the action, resulting user-visible state, material side effects,
  artifact locations, and what constitutes pass, fail, and unreachable.
- **Cleanup:** exact teardown for processes, sessions, fixtures, and scratch
  state created by the run. Kill only instances the run started; never kill by
  broad process name. Preserve proof artifacts.
- **Helpers:** every owned helper is executable, documented at its invocation
  point, and narrow enough that a future agent does not have to reverse-engineer
  it before use.

Use disposable state when a drive mutates data. When a safe mode or dry run is
used, observe which writes, network calls, browser actions, or external effects
it actually suppresses; do not trust the mode's name as proof.

## Feature-map index

The index names:

- baseline preconditions and seed state;
- the Doctor result required before driving;
- shared driving and restoration conventions;
- proof and unreachable-path reporting rules; and
- every feature recipe with its user-visible scope.

The map is a maintained verification source, not a product encyclopedia. Keep
implementation details out. Add a feature only when source or authoritative
product documentation demonstrates the user-facing behavior and a real route
can exercise it.

## Feature recipe

Each feature file contains:

1. an H1 title and one paragraph describing the visible behavior;
2. **Sub-features:** short stable IDs for the behaviors covered;
3. **How to get to it (user POV):** every meaningful user entry point;
4. **Driving it with `<harness>`:** preconditions followed by paired user
   actions, exact drive commands, and observable results; and
5. **Gotchas:** traps that can waste or invalidate a verification run.

Do not mark one entry point verified because another path reaches the same
screen or state. For an unreachable entry point, preserve the attempted route
and concrete unmet prerequisite.

## Proof standard

- Exercise the real user path rather than an internal setter or test-only
  endpoint.
- Capture the action and resulting state, not only the final screen.
- Verify material side effects through a second read-only observation.
- Prefer real production boundaries. Use a mock only where the product already
  isolates that external dependency.
- Record the feature ID, entry point, instance identity, and relevant revision
  with the evidence.
- Check that evidence exists before and after cleanup.
