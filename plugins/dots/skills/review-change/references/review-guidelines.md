# Review guidelines

Use one standard for actionable findings and a separate, explicit standard for
Challenge candidates. Adversarial posture changes how hard the review searches,
not what qualifies as a defect.

## Actionable finding contract

Keep a finding only when all of these are true:

- it affects requirements, correctness, security, performance, or
  maintainability in a meaningful way;
- it is discrete and actionable;
- the reviewed change introduced it;
- the affected requirement, scenario, or call path can be demonstrated from
  the code and, for a spec finding, the cited specification; and
- the author would probably fix it if they knew about it.

Reject speculation, pre-existing problems, intentional behavior that remains
within the documented scope, and style nits that do not obscure the code.
Anchor each finding to the smallest useful changed-line range. An unchanged
line is relevant only when the change causes or exposes the problem; anchor the
finding to the changed line that does so.

Return every qualifying finding without padding or a numeric cap.

Use these priorities:

- `P0`: universal release blocker or critical failure;
- `P1`: urgent defect that should be fixed next;
- `P2`: ordinary defect that should be fixed; and
- `P3`: low-impact issue that is still worth fixing.

## Challenge candidate contract

In Challenge posture, ask each reviewer to stress-test the execution rather
than question the stated intent. Be direct, serious, and demanding about
quality. Do not praise the code or fill the review. If nothing is wrong, return
no candidates.

A Challenge candidate that does not yet satisfy the actionable finding
contract must still include:

1. the smallest useful changed-line anchor;
2. a concrete concern rather than a vague preference;
3. the evidence observed in code, tests, or specification;
4. the material impact if the concern is real; and
5. the exact missing proof that prevents promotion to an actionable finding.

Do not retain style nits, unsupported hypotheticals, generic best practices, or
rewrites of working code based only on preference. Promote a candidate to an
actionable finding as soon as the full finding contract is demonstrated.

## Lead judgment

The coordinator is a pragmatic lead reviewer, not a neutral aggregator. Use
the full repository and conversation context to filter, contextualize, and
decide.

Apply these checks to every candidate:

- **Nitpick gravity.** Reviewers tend to fill their review. If the remaining
  candidates are nits and style preferences, the code is probably fine. Say so.
- **Hypothetical vs. actual.** Trace the call site. If upstream validation or
  the type system prevents the state, dismiss it.
- **Premature abstraction.** Ask whether the code needs to change in a second
  demonstrated way. Simple inline code that works beats an abstraction that is
  overkill for the current scope.
- **I would have done it differently.** Preference is not a bug or design flaw
  unless the reviewer demonstrates a concrete problem with the current
  approach.
- **Missing context.** Dismiss findings about unchanged code, established local
  patterns, or approaches that conflict with known constraints unless the
  change creates a new problem.
- **Uncomfortable evidence.** Do not dismiss a concrete execution path, a gap
  in the reviewer's mental model, or a security or correctness issue merely
  because it complicates the current plan.

Agreement between independent lanes guides attention, not truth. A repeated
finding deserves scrutiny but still needs evidence. A lone finding with a
demonstrated path can be decisive.

## Output

In Review-only outcome with Standard posture, present findings first, ordered
by priority. Use one entry per issue:

`[P1] Imperative finding title — path/to/file.ext:line`

Follow it with one short paragraph explaining the affected scenario and why
the behavior is wrong or materially harder to maintain. Keep the cited range
tight and overlapping the reviewed diff. If there are no qualifying findings,
say `No findings.` Do not invent one.

In Post-change or Repair outcome with Standard posture, do not repeat repaired
findings as open review comments. Return a brief completion summary naming the
meaningful fixes and validation performed. Include an unresolved finding in the
standard format only when it could not be repaired; omit reviewer process,
rejected candidates, and empty sections.

In Challenge posture, use this structure:

### Intent

Quote the stated intent paragraph.

### Act On

List every actionable finding in the standard finding format: real issues
affecting correctness, security, or maintainability given the actual goals.
These would block a real PR. These are the only items that should become PR
comments.

### Consider

List legitimate points, but only when you are not sure they outweigh the cost
of addressing them right now. These are worth the user's attention. Include the
anchor, evidence, impact, missing proof, and one-line categorization rationale.

### Noted

List technically valid but non-actionable observations: context-dependent,
premature optimization, or low-impact given the current stage. Keep this brief.

### Dismissed

List candidates that are wrong, nitpicky, or missing context, with a brief
explanation why. This is a trust mechanism: it shows what was filtered out and
lets the user override the judgment.

### Convergence Map

State where independent lanes agreed or diverged and what deserves attention.
Treat convergence as a signal, not proof.

### Review execution

Briefly state the overall assessment, reviewed depth, target, posture, and
frozen scope; material test gaps or residual risks; degraded execution or
routing fallbacks; GitHub comments posted; and repairs and validation
performed. In Review-only outcome with Standard posture, provide the same
execution summary after the findings without adding empty Challenge sections.
