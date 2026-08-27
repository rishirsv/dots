# Review rubric

Review through whichever lenses are relevant. Not every lens applies to every
change. Use judgment. The cross-cutting lenses below do not create extra core
reviewers; assign them to the core lane best placed to trace the evidence, or
to a risk-triggered specialist in Deep review.

## Correctness

Does the code actually do what the intent says it should?

- Read every hunk and its enclosing behavior.
- Check the happy path and sad path, conditions, boundaries, empty inputs,
  nullability, type coercion, overflow, encoding, and removed safeguards.
- For each deleted or replaced behavior, safeguard, or validation path, identify
  the invariant it enforced and where the new code re-establishes it. Keep a
  finding only when the change dropped or broke it.
- Check state transitions, stale state, dangling references, async work,
  cancellation, error propagation, and silently swallowed failures.
- Check callers and callees for changed contracts and partial requirements.
- Scan changed code for the classic pitfalls of its language or framework: for
  example, falsy-zero handling, coercion, closure-captured loop variables,
  mutable default arguments, late-binding closures, range-variable capture,
  timezone or daylight-saving drift, and floating-point equality. Flag only a
  reachable problem introduced by the change.
- When the change adds or modifies a wrapper, proxy, decorator, cache, or
  adapter, check that every method routes to the wrapped instance rather than
  back through a registry, session, or global, and that it forwards every
  method its callers actually use.
- Ask what happens when an operation runs twice or a prior run stops halfway.
  Require reconciliation when correctness otherwise depends on leftover state.
- When multiple actors can touch mutable state, determine whether access is
  serialized structurally through locks, sequential phases, or exclusive
  ownership rather than a convention that will eventually fail.
- Compare the change with the located specification. Cite the exact requirement
  for missing, partial, contradictory, or unrequested behavior.

When a potential bug depends on a value or state, trace the execution path.
Show the call chain that makes the state reachable; do not merely say it could
happen.

## Simplicity

Is the complexity justified by what the change accomplishes?

- Find code that duplicates an existing canonical implementation.
- Find needless wrappers, thin abstractions, identity helpers, speculative
  flexibility, configuration for cases that do not exist, and abstractions
  serving only one call site.
- Find redundant or derivable state, repeated branches, dead code, unused
  imports, vestigial parameters, and obsolete migration scaffolding.
- Find ad hoc conditionals, scattered special cases, and feature checks that
  tangle an existing flow.
- Question unnecessary optionality, `unknown`, `any`, silent fallbacks, and
  cast-heavy boundaries when a clearer model would make the invariant explicit.
- Prefer direct, boring, maintainable code over brittle or magical machinery.
- Ask whether every feature, control, and option earns its place for the user.

Look for code judo: a small reframing that removes whole branches, modes,
helpers, states, or layers while preserving required behavior. Prefer deleting
complexity to rearranging it. Do not penalize simple code for lacking an
abstraction; three lines of duplication can be better than a premature
abstraction.

Use these named smells as non-binding prompts, never automatic findings:

- **Feature Envy:** behavior reaches into another object's data more than its own.
- **Data Clumps:** the same fields or parameters repeatedly travel together.
- **Primitive Obsession:** a primitive hides a domain concept with real rules.
- **Shotgun Surgery:** one logical change requires scattered edits.
- **Divergent Change:** one module changes for several unrelated reasons.
- **Message Chains:** callers depend on a long navigation chain.
- **Refused Bequest:** an implementation inherits a contract it mostly rejects.

Report a smell only when the reviewed change introduces it and it satisfies the
finding contract. Do not report cosmetic preferences or impose a universal
file-size threshold.

For each retained cleanup finding, state the concrete cost: what is duplicated,
wasted, or harder to maintain. Name the simpler form or cheaper alternative. If
neither the material cost nor a concrete improvement can be demonstrated,
reject the candidate.

## Systems

Is the change fixing the actual problem at the right owning boundary?

- Trace beyond the changed file through callers, callees, types, sibling
  modules, and the architecture the change lives in.
- Check efficiency, repeated or blocking work, resource lifetime, sequencing,
  atomicity, lifecycle, failure recovery, and partial failure.
- Look for guard clauses that mask a deeper invariant violation, retries that
  hide a broken contract, casts that silence a modeling error, and comments or
  conventions where a type constraint, lint rule, or runtime check could make
  the wrong state impossible.
- Check whether validation happens once at a system boundary or is scattered
  through business logic.
- Check whether high-level orchestration is mixed with low-level detail and
  whether new coupling will make future changes harder.
- Check whether data structures match actual access patterns.
- Ask whether the change is integrated or bolted on: if the requirement had
  been known from the start, would the code look like this?
- Apply the shared Hard-Cut Policy to legacy paths, compatibility, and migration
  findings. Keep the compatibility exception and completion test there as the
  single source of truth.
- Report symptom patches and scattered special cases when a demonstrated
  canonical owner can solve the problem once. Do not demand a broader
  abstraction when the local fix is the right boundary.
- Treat unnecessary sequential orchestration and non-atomic related updates as
  design smells when a cleaner structure is demonstrated, not as speculative
  micro-optimization.

## Repository review guidance

Does the change comply with the repository's applicable review instructions?

- Map each changed file to the `AGENTS.md`, contribution guide, review guide,
  pull-request template, or linked checklist whose scope covers it.
- Apply the concrete review lenses, required evidence, and validation named by
  those sources. Higher-priority instructions win when guidance conflicts.
- Keep a compliance finding only when the rule is actually written down and
  the reviewed change violates it.
- Quote the exact rule, name its source path, and cite the exact changed line
  that violates it. Do not infer style preferences or the "spirit" of a rule.

## Verification

Can the available evidence show that the changed behavior works?

- Check whether tests cover behavior rather than implementation details.
- For a bug fix, look for a regression test for the demonstrated failure.
- For an integration boundary, check the full path rather than a proxy such as
  cached state or file modification time.
- For delegated or asynchronous work, verify actual outputs and artifacts
  rather than trusting status summaries.
- Check whether assertions or invariants would catch a recurrence at the
  canonical boundary.

Missing tests are actionable only when the unverified behavior is material and
the repository's testing conventions make the requested test appropriate.

## Security

Only flag security issues that can be traced through the code.

- Trace untrusted input to dangerous sinks such as SQL, shell, `eval`, or HTML.
- Check authentication and authorization at new or changed boundaries.
- Check secrets in source, logs, and error messages.
- Check destructive actions and time-of-check/time-of-use gaps.
- Check whether failure, retry, or fallback behavior crosses a trust boundary.

Do not raise a generic injection or authorization concern without the reachable
input and execution path.
