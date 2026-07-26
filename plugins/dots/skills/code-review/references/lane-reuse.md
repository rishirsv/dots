# Reuse Lane

Find behavior that should use one existing owner, plus unnecessary state,
machinery, and complexity the change introduces. Run all three sections.

## Find Duplicated Behavior

1. Search shared modules, utility directories, adjacent files, and the current
   owning layer for code that already performs the new behavior.
2. Flag new functions that duplicate existing functionality and identify the
   function or owner that should replace them.
3. Flag inline reimplementations of repository-standard operations, including
   string transformation, path handling, environment detection, type guards,
   parsing, and formatting.
4. Flag copy-paste and near-duplicate blocks that implement one stable
   responsibility with slight variation.

Do not create an abstraction merely because two snippets look similar. Require
one stable responsibility and a concrete maintenance benefit.

## Review State, API Shape, And Altitude

- Remove duplicated or derivable state, redundant caches, and observers or
  effects that can be direct calls.
- Reduce parameter sprawl when a direct call, stronger owning input, or clearer
  model removes the extra parameters.
- Repair leaky abstractions. Keep feature behavior in its canonical owning
  layer; do not leak it into shared infrastructure or expose implementation
  details through public boundaries.
- Flag code written at the wrong altitude: a detail hardcoded where a caller
  should decide, or a decision buried where a detail belongs.
- Replace raw strings with existing constants, enums, string unions, branded
  types, or shared contracts for established domain concepts.
- Remove JSX wrappers that add no layout or behavior when the inner component
  already exposes the required props.
- Remove comments that restate code, narrate the change, or refer to the task or
  caller. Preserve non-obvious constraints, invariants, and required
  workarounds.

## Run The Over-Engineering Scan

Over-engineering is indirection, optionality, generality, state, configuration,
compatibility, or ceremony that no current requirement or necessary invariant
justifies and that creates a concrete maintenance, runtime, or review cost.

Scan aggressively for:

- abstractions, interfaces, factories, hooks, or parameters with one real use;
- generic frameworks where direct domain code would be clearer;
- optional paths, modes, fallbacks, and configuration for hypothetical needs;
- adapters, compatibility layers, or validation without a real boundary;
- pass-through helpers, identity wrappers, and mechanisms that merely rename,
  forward, or rearrange work;
- silent fallbacks and generic mechanisms that hide simple assumptions;
- loose object shapes, cast-heavy boundaries, and unclear invariants that a
  stronger current contract would remove;
- scattered special cases that one state model, policy, dispatcher, or owner
  could replace;
- feature flags treated as permanent architecture, especially deep or
  scattered checks without an explicit cleanup boundary; treat flags as
  temporary deployment mechanisms;
- phases, documents, schemas, or process gates whose result changes no
  decision; and
- defensive handling for states the current contract makes impossible.

Do not equate necessary complexity or unfamiliar design with over-engineering.
Keep only candidates whose extra machinery and cost are visible in scope.

## Apply Code Judo

For changed code, seek a behavior-preserving reframing that removes whole
branches, helpers, modes, conditionals, wrappers, layers, or fallbacks. Prefer
direct, explicit, boring code and one canonical owner over brittle or magical
machinery. Prefer deletion, inlining, or a stronger contract to another layer.

Accept a simplification only when it preserves intended behavior and improves
understanding, debugging, or changeability. Do not optimize for line count,
combine distinct concerns, remove a useful abstraction, or replace explicit
code with clever density. Broad structural discovery and new seam design belong
to Architecture Review.
