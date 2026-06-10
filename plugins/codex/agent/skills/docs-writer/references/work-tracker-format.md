# Work Tracker Format

A Work Tracker is a compact queue for choosing and sequencing work. It is not a
roadmap essay, implementation plan, research note, changelog, or architecture
document.

## Use A Work Tracker When

- The repo needs one place to see active, later, and completed work.
- Review, research, or implementation produced follow-up work items.
- Multiple Plans exist and a maintainer needs to choose the next one.

## Standard Shape

Use only these sections:

1. Active
2. Later
3. Done

`Active` is for work in motion. Prefer one active item unless the repo is truly
running parallel work.

`Later` is for queued or deferred work. Later items should include a trigger
when timing matters.

`Done` is compressed history. Each item should be one line.

## Work Item Shape

Use heading-based items, not Markdown tables. Tables create noisy diffs and
break down when one item needs a note.

Active items should include:

- Outcome
- Plan
- Proof
- Notes, only when useful

Later items should include:

- Outcome
- Plan, or `Plan: needed`
- Trigger, only when useful

Done items should use this one-line shape:

```md
- `<work-item-slug>` - <one-line result or proof>
```

## Boundary With Plans

The tracker answers: what work exists, what is active, what is later, and what
proves each item is done.

A Plan answers: how one selected work item will be implemented and verified.

If a tracker item needs implementation steps, create or update its linked Plan.
Do not paste the Plan into the tracker.

## Writing Rules

- Keep work item handles stable and slug-like.
- Require `Outcome` and `Proof` for Active items.
- Keep queue state in the tracker and implementation detail in Plans.
- Do not use `Next`; promote one item from `Later` into `Active` instead.
- Do not preserve completion history beyond one-line `Done` entries unless the
  repo has a separate changelog or release-note convention.
- Source-grounded external/current research belongs to the Research skill; the
  tracker may link to research output but does not define research format.
