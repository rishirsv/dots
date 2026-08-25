# Explain Changes

Use this reference in change mode for a diff, commit, branch, pull request, or
completed body of work.

## Establish Complete Coverage

Read the description, diff, affected source, and the tests, configuration,
documentation, migrations, or surrounding behavior needed to understand the
change. A file list or diff summary is not an explanation.

Inventory every meaningful change before writing. Distinguish:

- user-visible behavior, workflows, rules, and affected product areas
- data, identity, persistence, migrations, and removed behavior
- services, datasets, permissions, privacy, and external effects
- architecture or responsibility changes that alter how the system works
- validation evidence, limitations, unknowns, and unfinished work
- generated, documentation, test-only, and other supporting changes

A meaningful change alters behavior, capability, rules or data people rely on,
stored facts, responsibility, risk, or future operation. Preserve it in the
explanation. Account for supporting details compactly unless they carry their
own consequence. If evidence remains unavailable or inconclusive, name the gap
instead of smoothing it over.

For a pull request or similarly broad change, completeness means every
meaningful item is represented. For a narrow change question, explain only the
parts needed to answer it unless the user asks for the full change.

## Derive The Teaching Story

Before outlining, identify the former condition, failure, constraint, or
opportunity; the practical result; included and excluded scope; runtime actors
and facts that changed; and the evidence gap that matters most. Use this change
map to choose a reading order instead of following file, commit, or diff order.

Useful spines include:

- **User journey:** former problem -> before and after experience -> one
  realistic journey -> important states and boundaries -> proof
- **Ownership or architecture:** former failure -> competing or missing
  responsibility -> new owner and handoffs -> consequence -> proof
- **Data or migration:** former facts -> transformation -> new facts and
  identities -> cutover, removal, or recovery -> proof
- **Reliability:** observed failure -> cause -> changed mechanism -> recovered
  and failed states -> proof
- **Foundation or staged delivery:** capability being enabled -> foundation ->
  what is shipping, prepared, and remaining -> adoption boundary

Combine spines when the change crosses them, and invent a better order when
needed. Keep the smallest structure that teaches the complete change.

Every complete change explanation covers, without requiring fixed headings:

- the actual work and visible result
- the condition that made it necessary
- what it includes, excludes, removes, and leaves unchanged
- one concrete action, input, or state moving through the relevant actors and
  facts to its result
- the important before-and-after difference in behavior, responsibility, or data
- consequential residual constraints and their user or operating consequence
- what evidence proves the behavior and what remains unverified

## Add Detail When It Matters

Add detail only when the source calls for it:

| Signal | Explain |
|---|---|
| Changed user flow | One realistic journey from action to result |
| Shared abstraction | New responsibilities and handoffs, tied to consequences |
| Stored data | Facts before and after, identities, and why they differ |
| Migration or deletion | What is removed, what replaces it, and cutover limits |
| External service | What is shipping, prepared, and still required |
| Permissions or trust | What the user can cross and what failure means |
| Performance or reliability | Former failure, changed mechanism, measured result |
| Infrastructure | Downstream capability or operating improvement it enables |
| Recorded tradeoff | Decision, credible alternative, and documented consequence |

## Preserve Evidence And Limits

Describe what validation proves instead of treating test counts or status as
the story. Keep these states distinct for staged work:

- **Shipping:** implemented and active in the resulting system.
- **Prepared:** foundations exist, but the claimed value is not active.
- **Remaining:** specific work or evidence is still required.

Separate confirmed facts, rationale recorded in source, inference, and
unknowns. Mention review metadata, commit identifiers, check labels, or merge
state only when they change understanding of the delivered behavior.

Before delivery, confirm a reader can explain what changed, why it matters, how
the important path works, what is different, what was removed or
left unfinished, and what evidence supports the result. Confirm every
meaningful change is covered and every supporting change is accounted for
without being given equal weight.
