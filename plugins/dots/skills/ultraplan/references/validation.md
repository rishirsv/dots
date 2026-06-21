# Ultraplan Validation

Read this after synthesis and before final handoff.

## Route Checks

- `Standard Plan`: no subagents were used unless independent repo exploration
  was justified; the output is a new plan, not an upgraded-plan changelog.
- `Capped Ultra Plan`: the original plan remains available for diffing; the run
  used no more than three subagents; confirmed and refuted findings are
  accounted for.
- Any route: execution has not started without explicit approval.

## Structural Checks

Run checks appropriate to the artifact format:

- HTML: exactly one `<main>` when the input had one, valid closing `</body>` and
  `</html>` tags, expected section ids still present or deliberately changed,
  no duplicate major ids introduced.
- Markdown: heading order is logical, code fences close, required semantics are
  present, tables render as plain Markdown.
- Any format: the created or upgraded artifact is complete, not a fragment,
  unless the user explicitly asked for a fragment.

## Evidence Checks

- Re-read any counts, enum lists, winner names, and version labels the author
  emitted.
- Spot-check every blocking/high confirmed finding against the upgraded plan.
- Confirm every refuted finding appears only in the changelog, not as a plan
  edit.
- Confirm every reused owner or existing symbol named in the plan was actually
  found during Map/Critique/Verify.
- Confirm overengineering findings either removed, narrowed, or intentionally
  deferred the unnecessary complexity.
- Confirm open human decisions are not silently treated as settled.

## Diff Checks

Preserve the base artifact and run a mechanical diff against the upgraded one
when possible. Inspect the diff for:

- accidental rewrite of untouched sections
- scaffold/CSS/script churn in HTML plans
- dropped acceptance criteria
- stale false premise repeated in another section
- numbers or labels that diverge from verifier or rescope data
- added abstractions, shims, schemas, or framework work that were not justified
  by confirmed findings

## Output Checks

- Standard plans start with the executable plan, not audit trail.
- Upgraded plans keep losing alternatives and refuted findings out of the plan
  body.
- Handoffs use grouped bullets for shipped/proved/manual gates instead of dense
  implementation-summary tables unless comparison requires a table.
- Runtime-specific wrappers or tags appear only when the active environment
  requires them.

## Validation Handoff

Report:

- artifact paths written
- route and subagent count
- counts raised, verified, confirmed, and refuted for upgraded plans
- chosen re-scope and grafts when applicable
- validation commands/checks run
- any checks skipped, with the reason
- remaining open decisions

Do not claim the plan is executed, implemented, shipped, or proven by tests
unless those later execution checks actually ran outside the Ultraplan pass.
