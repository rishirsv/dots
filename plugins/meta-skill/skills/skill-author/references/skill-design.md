# Skill Design

Read this when designing a new skill or substantially changing how an existing
skill is discovered, structured, or completed.

## Design For Predictable Behavior

A good skill makes the agent take a dependable approach, even when the right
output varies. Write for a capable colleague who needs the missing operating
judgment, not a lecture about the domain. Begin with the recurring job, default
path, and main boundary. Explain reasons when they help the agent choose
between plausible actions.

Use ordinary job language. Avoid invented modes, stage names, schemas, and
house terminology unless the work itself depends on them. Reserve `must`,
`always`, and `never` for safety, approval, irreversible actions, or a failure
that truly requires a hard boundary.

Prefer a small, stable vocabulary the model already understands. A strong
leading word can anchor a whole behavior more clearly than repeating its
definition in several places. Use the same terms in the description, body, and
surrounding project language when they refer to the same idea; do not coin
jargon merely to make the skill sound systematic.

## Pressure-Test Discovery

A useful trigger contract combines:

- the object being worked on
- the moment or intent that calls for the skill
- the nearest adjacent job it does not own

Test it with a clear invocation, a request that belongs elsewhere, and the
closest near miss. Descriptions should contain words users actually say. Do
not rely on an exact incantation, internal lane name, or implementation detail.
If two skills claim the near miss, strengthen their boundaries instead of
adding a routing procedure to the body.

## Match The Shape To The Work

| Work | Useful shape |
|---|---|
| Judgment, writing, planning, or review | Principles, decision points, and output expectations |
| Fixed artifact or schema | Required fields, examples, and deterministic validation |
| Repeatable mechanical transformation | A script contract with inputs, outputs, and exit meaning |
| Safety-sensitive ordered operation | A short sequence with approval and stop points |

Do not force judgment-heavy work into form filling. Do not describe exact work
in prose when a small script can perform and verify it reliably.

## Set Instruction Strength

Use a hard rule when violating it would be unsafe, irreversible, externally
visible, or contrary to an explicit user constraint. Use a default when one
path is usually best but context may justify another. Use examples when the
agent needs help recognizing a pattern, not as templates to copy.

Negative guidance earns its place when it prevents an observed or costly
failure. Pair it with the desired behavior so attention lands on what to do.

## Design Failure Behavior

Name the conditions that change the normal path:

- missing required input: ask, leave a field empty, or state the assumption
- conflicting evidence: follow a declared authority rule and surface the
  unresolved conflict
- partial success: preserve useful completed work and identify what remains
- positive-null result: say clearly when no issue, match, or action is found
- consequential action: stop at the approval boundary

Do not add fallback machinery for states that cannot occur under the actual
runtime or repository contract.

## Build The Information Hierarchy

Keep the opening contract and common judgment in `SKILL.md`. Move conditional
detail to a directly linked reference whose link says when to read it. A vague
pointer to necessary material is a behavior bug: sharpen the read condition
instead of copying the whole reference into the body.

Inline what every branch needs. Disclose what only some branches need. Keep a
concept's definition, rules, and caveats together rather than scattering them
through the payload. Use scripts for deterministic work and explain when to run
them, what they consume, what they produce, and what failure means.

Treat the description as the always-visible discovery contract, the body as
the common operating context, and linked resources as conditional context.
Spend the description on distinct trigger branches rather than synonyms. Keep
the body comfortably readable; when it approaches roughly 500 lines, move
branch-specific reference material behind precise pointers instead of adding
another layer of headings.

For a large reference, include a short contents map or search guidance so the
agent can reach the relevant section without loading or wandering through the
whole file.

## Define Completion

State what the user receives and what proves the work is finished. Completion
may require an artifact at a named path, findings ranked by impact, a passing
validator, an explicit positive-null result, or a handoff that names the
unresolved decision.

Watch for premature completion: describing intended work is not performing it;
creating a file is not validating it; structural validation is not behavioral
evidence; drafting an external action is not approval to send it. Sharpen an
unclear finish condition before adding more workflow.

## Prune Before Finalizing

Re-read each section and ask:

- What decision or action does this change?
- Is this rule already stated elsewhere?
- Does every user need it, or should it be conditional?
- Is it runtime guidance or maintainer history?
- Could a shorter positive instruction replace several prohibitions?

Delete no-op advice, duplicated rules, stale migration language, and examples
that merely repeat the prose. Each meaning should have one authoritative home.
