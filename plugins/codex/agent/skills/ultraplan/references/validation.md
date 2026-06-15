# Ultraplan Validation

Read this after synthesis and before final handoff.

## Structural Checks

Run checks appropriate to the artifact format:

- HTML: exactly one `<main>` when the input had one, valid closing `</body>` and
  `</html>` tags, expected section ids still present or deliberately changed,
  no duplicate major ids introduced.
- Markdown: heading order is logical, code fences close, required sections are
  present, tables render as plain Markdown.
- Any format: the upgraded artifact is complete, not a fragment, unless the
  user explicitly asked for a fragment.

## Evidence Checks

- Re-read any counts, enum lists, winner names, and version labels the author
  emitted.
- Spot-check every blocking/high confirmed finding against the upgraded plan.
- Confirm every refuted finding appears only in the changelog, not as a plan
  edit.
- Confirm every reused owner or existing symbol named in the plan was actually
  found during Map/Critique/Verify.
- Confirm open human decisions are not silently treated as settled.

## Diff Checks

Preserve the base artifact and run a mechanical diff against the upgraded one
when possible. Inspect the diff for:

- accidental rewrite of untouched sections
- scaffold/CSS/script churn in HTML plans
- dropped acceptance criteria
- stale false premise repeated in another section
- numbers or labels that diverge from verifier/judge data

## Validation Handoff

Report:

- artifact paths written
- counts raised, confirmed, refuted, and designs judged
- winning design and grafts
- validation commands/checks run
- any checks skipped, with the reason
- remaining open decisions

Do not claim the plan is executed, implemented, shipped, or proven by tests
unless those later execution checks actually ran outside the Ultraplan pass.
