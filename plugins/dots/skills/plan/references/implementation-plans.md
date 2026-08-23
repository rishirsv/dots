# Plan an implementation

Read this before briefing repository investigators. A finished plan chooses the
outcome, says which parts of the system will change, divides the work safely,
explains how to prove and roll it back, and leaves no important product or
engineering decision for implementation to guess.

## Frame the investigation

Identify the desired outcome, current experience or system path, teams or
components involved, persistence or schema changes, external or asynchronous
work, rollout risk, and unresolved choices. Ask investigators for the smallest
answer they can support with actual source.

Keep these kinds of information separate:

- confirmed current behavior;
- already-decided future behavior;
- proposed decisions;
- unresolved questions; and
- deferred work.

Read the extra guidance that matches the change:

| When the change involves | Read before deciding or briefing a follow-up |
|---|---|
| Visible interaction, product reference, or unresolved presentation | [experience-and-design.md](experience-and-design.md) |
| Persisted data, identity, aggregation, ordering, state, or migration | [data-and-state.md](data-and-state.md) |
| External or asynchronous work, important performance, security, or privacy concerns | [reliability-and-boundaries.md](reliability-and-boundaries.md) |

## Shape the plan around the change

Lead with the dominant decision or risk rather than a standard section list. A
workflow plan may follow the person or operator through handoffs and return; a
migration may lead with invariants and cutover; a refactor may lead with the
target boundary and dependency order; a risky rollout may lead with blast
radius, containment, and recovery.

Trace one representative action or event from its entry point through each
component, state change, stored data or external handoff, visible result, and
recovery or return. Use a diagram only when branches or handoffs make prose
harder to follow.

Choose one place that is allowed to perform each mutation. A screen that reads
or gathers data does not become a second writer merely because it can display
or collect it. Reuse existing code only when its responsibility and identity
rules match the new job.

Map concrete files or symbols when several modules change and the mapping
removes implementation ambiguity. Name the behavior handled at each location
and the change it receives; avoid directory inventories and speculative files.

## Plan vertical delivery

Keep the number of pull requests as small as risk permits. Each slice must ship
or prove a self-contained outcome while keeping the build and supported behavior
working. A preparatory refactor, migration foundation, or rollout step earns a
separate pull request only when reviewers can judge it on its own or it clearly
reduces risk.

For each slice, state:

- the user- or operator-visible outcome;
- the code and responsibilities that change;
- dependencies;
- how to prove it works;
- safe landing or rollback behavior; and
- explicit exclusions.

Use commits for reviewable layers inside one vertical pull request. Do not split
mechanically by data, feature, and UI layers or create placeholder pull requests
for future projects.

## Define proof, rollback, and scope

Organize checks around behavior or system seams. Say what each check proves and
what the team should do if it fails. Never present a proposed build, test,
preview, or runtime check as if it already passed.

State whether rollback removes code only, requires schema reversal, or needs
data repair. If the plan writes no schema or records, say so when that makes
rollback simpler.

Name concrete deferred work and exclusions. Remove abstractions the chosen
workflow does not need, or leave them for the later project that does.

## Write the plan

Apply the shared [writing-style reference](../../../references/writing-style.md).
Name the object, responsible code or team, action, state, and consequence. The
recommendation must say what to build, what keeps the change contained, and
what follows later.

## Readiness

Call the plan implementation-ready only when every relevant answer is yes:

- Is one outcome selected and clearly limited, with current and proposed
  behavior kept distinct?
- Can a reader trace the change from trigger to visible result and recovery
  or return?
- Does every delivery slice name its outcome, dependencies, how to prove it
  works, and safe landing or rollback behavior?
- Does every check state what it proves and what happens if it fails?
- Are exclusions and deferred work explicit and speculative abstractions gone?
- Does every specialized checklist you opened pass?

If an answer is no, return the useful completed work as incomplete or
decision-blocked and name what would close the gap. Do not add an irrelevant
section or visual to make the plan appear complete.
