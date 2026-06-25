# Ultraplan Validation

Read this after synthesis and before final handoff.

## Outcome Checks

- The output is a plan or upgraded plan, not an answer-only reply.
- The plan can guide implementation end to end without relying on hidden
  context from the planning conversation.
- Execution has not started without explicit approval.
- If the task was pure research, explanation, ideation, or execution, the plan
  either redirects to the right skill or explains the planning boundary.

## Context Checks

- Load-bearing repo, data, UI, platform, or external claims were grounded in
  current source, docs, commands, screenshots, or cited references.
- The plan read or named local workflow docs, skills, or conventions that
  materially affect the work.
- Existing owners and reusable implementations were considered before adding
  new work.
- For data-bearing work, the plan identifies the source of truth, contract
  boundary, and verification path.
- For visible UI work, the plan accounts for current screens, design guidance,
  states, accessibility, and whether a visual target or mockup is needed.

## Challenge Checks

- Risky assumptions were challenged before handoff.
- Findings that changed the plan were verified with fresh evidence.
- Refuted findings stayed out of the plan body; for upgraded plans, they appear
  only in the changelog when useful.
- Overengineered work was removed, narrowed, or intentionally deferred.
- Open human decisions are named instead of silently treated as settled.

## Structural Checks

Run checks appropriate to the artifact format:

- HTML: exactly one `<main>` when the input had one, valid closing `</body>` and
  `</html>` tags, expected section ids still present or deliberately changed,
  no duplicate major ids introduced.
- Markdown: heading order is logical, code fences close, required semantics are
  present, tables render as plain Markdown.
- Any format: the created or upgraded artifact is complete, not a fragment,
  unless the user explicitly asked for a fragment.

For existing-plan upgrades, preserve the base artifact and run a mechanical diff
when possible. Inspect the diff for accidental rewrites, dropped acceptance
criteria, stale false premises, scaffold churn in HTML plans, or new complexity
not justified by confirmed findings.

## Handoff Checks

Report only what helps the user decide the next move:

- artifact path, or the reason no repo plan convention was available
- important context checked
- validation commands or checks run
- open decisions or proof limits
- for upgraded plans, a short confirmed/refuted summary and the apply/keep gate

Do not claim the plan is executed, implemented, shipped, or proven by tests
unless those later execution checks actually ran outside the Ultraplan pass.
