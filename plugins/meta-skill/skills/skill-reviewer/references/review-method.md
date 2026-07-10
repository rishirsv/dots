# Review Method

Read this for a deep diagnosis, plugin-wide audit, or reported failure. Use the
smallest set of checks that can explain the user's concern.

## Defect Taxonomy

Text defects:

- **Opening-contract gap:** the first prose does not state the job, default
  path, and main boundary.
- **No-op line:** a sentence does not change likely agent behavior.
- **Duplication or sediment:** one rule has several homes, drifted strengths,
  or stale layers.
- **Sprawl:** default guidance carries conditional detail that belongs behind
  a direct reference link.
- **War story:** one incident appears instead of its reusable condition and
  remedy.
- **Implementation index:** runtime points at unstable internal files, lines,
  commands, or maintainer concepts.
- **Magic-phrase gate:** behavior depends on an exact phrase rather than the
  user's plain-language intent.
- **Unconditional ceremony:** every request pays for machinery that only a
  large or risky case needs.
- **Terminology drift:** one concept has competing names.
- **Maintainer leakage:** design history, provenance, evaluation state, or
  packaging workflow appears in runtime without a user benefit.

Behavior defects:

- **Premature completion:** the skill can stop before its result contract is
  met.
- **Output-contract gap:** the user-facing result or artifact is unclear.
- **Embargo:** useful findings are withheld until a later workflow stage even
  though the delay harms the user or the next decision.
- **Lucky pass:** the result succeeded only because the user, environment, or
  harness volunteered a critical input the skill did not cause or request.
- **Validation gap:** the reported check cannot support the claimed behavior.
- **Stage compression:** later visible goals cause an earlier phase to be
  rushed or skipped.
- **Form filling:** the structure is present but the judgment is absent.

System defects:

- **Routing collision:** two discoverable descriptions plausibly claim the
  same request without a clear boundary.
- **Dangling ownership:** a route, link, or renamed owner no longer resolves.
- **Duplicated policy:** sibling skills restate a shared contract and drift.
- **Dead surface:** a specialist, command, reference, or artifact has no proven
  user job.
- **Investment inversion:** length and rigor accumulate in low-value surfaces
  while common work remains weak.
- **Effective-runtime drift:** installed or otherwise active guidance differs
  from source, so review of source alone cannot explain reported behavior.

## Failure Reconstruction

Capture the expected behavior, actual behavior, triggering request, files
inspected, validation or run evidence, smallest likely source, plausible causes
ruled out, confidence, and evidence that would falsify the diagnosis. Generalize
the incident into a recurring failure class; keep names, paths, and thread IDs
in evidence rather than proposed runtime text.

When usage history is available, query it read-only. Search current and former
names plus common spelling variants. Separate organic use from development on
the skill itself and treat counts as lower bounds. Do not scan unrelated user
history. Use observed frequency with likely impact when prioritizing findings,
and flag natural invocation idioms that the discoverable description does not
carry.

For a plugin audit, compare every discoverable description, link, and owner.
Search for repeated policy and terminology rather than reviewing each skill in
isolation. Prefer removing an unneeded lane or duplicate contract over adding a
router or compatibility layer.

When a criticism depends on relative length, density, ceremony, or teaching
altitude, compare one strong local skill of the same kind when a credible peer
exists, and state why it is a fair comparison. Otherwise say that calibration
evidence is unavailable. Do not use a fixed exemplar across unrelated skill
types, and do not turn a peer's style into a universal rule.

## Proposal Quality

A proposal names exact source scope, behavior change, benefit, residual risk,
and verification. Preserve existing trigger behavior unless routing is the
defect. Replace misleading text instead of stacking a prohibition on top of
it. Recommend the smallest change that resolves the cause, not every nearby
cleanup opportunity.
