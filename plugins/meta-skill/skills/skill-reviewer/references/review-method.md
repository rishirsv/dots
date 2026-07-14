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

Capture a compact diagnosis packet before proposing a fix:

| Field | What to record |
|---|---|
| Expected behavior | What the skill should have caused |
| Actual behavior | What happened, or what the text would likely cause |
| Trigger input | The request, scenario, or trace that exposed the problem |
| Files inspected | The shipped payload and surrounding contracts actually read |
| Validation evidence | Relevant structural checks or existing run results |
| Likely source | The smallest responsible description, section, reference, script, or missing boundary |
| Alternatives ruled out | Plausible causes checked and rejected |
| Confidence | High, medium, or low, tied to the available evidence |
| Falsifier | Evidence that would prove the diagnosis wrong |

Generalize the incident into a recurring failure class; keep names, paths, and
thread IDs in evidence rather than proposed runtime text.

When usage history is available, query it read-only through the supported
`metaskill sessions list` and `sessions show` commands. Search current and
former names plus common spelling variants. Separate organic use from
development on the skill itself and treat counts as lower bounds. For a
reported historical failure, inspect only the named or matching tasks; cite the
task and timestamp in evidence, separate transcript facts from inference, and
do not copy transient identifiers or raw prompts into proposed runtime text.
Prioritize findings by observed frequency with likely impact, and flag natural
invocation language that the current description does not carry.

For contamination complaints, inspect the whole visible payload: headings,
labels, examples, fixture text, screenshots-as-code, export or copy text, and
other strings a future agent or user could see—not only Markdown prose.

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

Offer the smallest supported correction. Include alternatives only when the
evidence leaves a real trade-off or user decision unresolved. Each proposal
names the exact source scope, intended behavior change, benefit, trade-off or
residual risk, and verification.

Before recommending, check each proposal:

- **Generalization:** turn the incident into a reusable failure class rather
  than encoding its one-time names or wording.
- **Trigger preservation:** keep the discovery contract unchanged unless
  routing is the defect; call out any description change explicitly.
- **Source hygiene:** remove provenance, stale references, private facts, and
  negative-only rules from candidate runtime text.
- **Positive steering:** for mechanical or prohibition-heavy prose, include a
  natural positive rewrite and remove the machinery competing with it.
- **Proportion:** solve the diagnosed cause without bundling nearby cleanup.

Replace misleading text instead of stacking a prohibition on top of it.
