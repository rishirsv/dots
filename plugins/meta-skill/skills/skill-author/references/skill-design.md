# Skill Design

Read this when designing a new skill or substantially changing how an existing
skill is discovered, structured, or completed.

## Contents

- [Design for predictable behavior](#design-for-predictable-behavior)
- [Pressure-test discovery](#pressure-test-discovery)
- [Match the shape to the work](#match-the-shape-to-the-work)
- [Choose only useful sections](#choose-only-useful-sections)
- [Design failure behavior](#design-failure-behavior)
- [Build the information hierarchy](#build-the-information-hierarchy)
- [Define completion](#define-completion)
- [Prune before finalizing](#prune-before-finalizing)

## Design For Predictable Behavior

A good skill makes the agent take a dependable approach, even when the right
output varies. Write for a capable colleague who needs the missing operating
judgment, not a lecture about the domain. Begin with the recurring job, default
path, and main boundary. Explain reasons when they help the agent choose
between plausible actions.

Use ordinary job language. Avoid invented modes, stage names, schemas, and
house terminology unless the work itself depends on them. Reserve `must`,
`always`, and `never` for safety, irreversible actions, explicit user
constraints, or a failure that truly requires a hard boundary.

Prefer a small, stable vocabulary the model already understands. Begin
instructions with concrete action verbs such as `Read`, `Compare`, `Write`,
`Run`, or `Stop`, followed by the condition or result they govern. Use the same
noun for the same concept in the description, body, and surrounding project
language; do not coin jargon merely to make the skill sound systematic.

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
| Judgment, writing, planning, or diagnosis | Principles, decision points, and output expectations |
| Fixed artifact or schema | Required fields, examples, and deterministic validation |
| Repeatable mechanical transformation | A script contract with inputs, outputs, and exit meaning |
| Fragile ordered operation | A short sequence with explicit checks and stop points |

Do not force judgment-heavy work into form filling. Do not describe exact work
in prose when a small script can perform and verify it reliably.

For example: bundle a PDF rotation script when every request would recreate the
same code; keep a stable warehouse schema in a reference when every query needs
it; keep a branded document template in assets when the output must reuse it.

Use a default when one path is usually best but context may justify another.
Negative guidance earns its place when it prevents an observed or costly
failure; pair it with the desired behavior.

## Choose Only Useful Sections

Only frontmatter and a useful body are universal. Select, rename, combine, or
omit sections based on the skill. This palette is not a template:

| Section type | Use when it helps |
|---|---|
| Purpose or scope | The owned job or nearest boundary is easy to misunderstand |
| Quick start | A short common path gets most tasks moving |
| Workflow | Order matters across several steps |
| Decision points | Inputs or conditions change the path |
| Inputs, files, or templates | Particular artifacts or preservation rules affect execution |
| Tool usage | The agent needs exact tool inputs, outputs, or result handling |
| Output pattern | A stable default improves usability; exact form is genuinely required only sometimes |
| Validation | Checks have observable pass and fail states |
| Failure and stop conditions | Common failures need a distinct response |
| Examples | Boundaries or quality are easier to show than describe |
| Conditional references | Detailed guidance applies only to some requests |

Do not add a heading merely because it appears here. Do not repeat discovery
guidance from the description in a body section.

## Design Failure Behavior

Name the conditions that change the normal path:

- missing required input: ask, leave a field empty, or state the assumption
- conflicting evidence: follow a declared authority rule and surface the
  unresolved conflict
- partial success: preserve useful completed work and identify what remains
- positive-null result: say clearly when no issue, match, or action is found
- action requiring user direction: stop when that direction is missing

Do not add fallback machinery for states that cannot occur under the actual
runtime or repository contract.

## Build The Information Hierarchy

Keep the opening contract and common judgment in `SKILL.md`. Move conditional
detail to a directly linked reference whose link says when to read it. Sharpen
a vague pointer instead of copying the reference into the body.

Inline what every branch needs. Disclose what only some branches need. Keep a
concept's definition, rules, and caveats together rather than scattering them
through the payload. Use scripts for deterministic work and explain when to run
them, what they consume, what they produce, and what failure means.

Treat the description as the always-visible discovery contract, the body as
the common operating context, and linked resources as conditional context.
Spend the description on distinct trigger branches rather than synonyms. Move
branch-specific detail behind precise pointers when the body becomes hard to
navigate.

When one skill supports several providers, frameworks, or domains, keep the
shared workflow and selection rule in `SKILL.md` and place each variant's detail
in its own directly linked reference. Do not make an agent load every variant
to use one of them.

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
evidence; reporting a planned action is not proof that it happened. Sharpen an
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
