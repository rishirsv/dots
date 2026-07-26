# Pull request descriptions

Read this when creating, rewriting, or reconciling a pull request body. Write a
durable decision record and review guide, not a generated diff recap. A good
description lets a capable reviewer understand the outcome, the important
human decisions, the mechanism, the proof, and the remaining uncertainty
without reconstructing intent from commits, chats, or agent transcripts.

## Ground the explanation

Read the current base-to-head diff and the resulting source. Follow the main
callers, state owners, boundaries, tests, specifications, and repository
template far enough to explain the prior problem and the resulting behavior.
For an existing pull request, also read its current body and material review
corrections. Treat recorded rationale as evidence; do not infer intent from
code shape when the source does not establish it.

Reconcile the description after implementation or review changes. The live body
must describe the current head, not the proposal that started the work.

## Write for the merge decision

Lead with the user or system outcome in language a smart reviewer can understand
without local context. Then include only the layers needed to evaluate the
change:

1. **Outcome and why.** State what is now different, the prior problem, and why
   it matters. Do not open with files, commits, phases, or tooling.
2. **Decision.** Name the conceptual move and the important constraint it
   preserves. Record a rejected alternative only when it affects future
   modification, risk, or review.
3. **Mechanism.** Explain the causal path through the system. Use one concrete
   example when it shortens understanding. Group changes by responsibility and
   dependency, not path order.
4. **Boundaries.** State meaningful non-goals, unchanged authority, privacy or
   data rules, compatibility limits, and fallback behavior. Omit generic
   boilerplate.
5. **Review guide.** Give an intentional reading order with the behavioral
   center first, then integration and evidence. Ask reviewers to challenge the
   exact invariants or tradeoffs that matter.
6. **Validation.** Tie each important claim to observed proof: exact test,
   build, runtime journey, screenshot, metadata artifact, migration check, or
   external system result. Say what remains unverified. One proof layer never
   substitutes for another.
7. **Risk and release.** Include migration, rollout, rollback, security,
   privacy, performance, accessibility, or operational consequences only when
   they materially affect the merge decision.

Keep a small change brief. For a larger change, use headings and progressive
disclosure so the first screen still communicates the outcome and decision.
Remove empty sections. Preserve repository-required template fields, but do not
let a generic template reduce the explanation to checkboxes.

## Explain agent-heavy work honestly

When agents performed much of the implementation, distinguish three kinds of
ownership:

- **Human decisions:** the problem, product or architectural direction,
  constraints, tradeoffs, acceptance criteria, and review judgment.
- **Agent execution:** the bounded implementation, documentation, test, or
  review work actually performed.
- **Observed evidence:** tool or human observations that independently support
  the claims.

Mention this division only when it helps reviewers understand provenance or
where judgment belongs. Do not include prompts, tool-call diaries, model names,
or a ceremonial list of agents. “Agent implemented it” is neither validation
nor a warning; report proof separately.

Optimize the body for human thinking. Make the intended behavior and invariants
easy to interrogate so reviewers can spend attention on design, correctness,
trust, and consequences instead of reverse-engineering the diff.

## Use visuals only when structure beats prose

Use the smallest visual that replaces explanation:

- a table for several exact mappings or before/after behavior;
- a short flow for a request, event, or state transition with three or more
  dependent steps;
- a hierarchy only when ownership or nesting is otherwise hard to see.

Do not add a diagram that merely repeats the surrounding paragraph. UI or
visual changes still need real screenshots or clips in the live body; a build
or snapshot test does not prove appearance.

## Default shape

Adapt this shape rather than copying every heading:

```markdown
## Outcome
<What behavior or capability is different?>

## Why
<What problem existed, and what human-approved decision resolves it?>

## How it works
<The causal path, grouped by responsibility; one representative example when useful.>

## Boundaries
<Important non-goals, preserved owners, safety or privacy constraints.>

## Review guide
1. `<behavioral center>` — <what decision or invariant lives here>
2. `<integration boundary>` — <what to verify next>

Please focus on:
- <material invariant or tradeoff>

## Validation
| Claim | Evidence |
| --- | --- |
| <behavioral claim> | <observed proof and result> |

## Remaining verification
- <specific gap, or omit this section when none remains>

## Risk and release
<Only material rollout, migration, rollback, or operational facts.>
```

Use a separate “What changed” section when several outcomes need mapping.
Include “Human decisions and agent execution” only when provenance materially
helps. For a bug fix, explain the failure mechanism and smallest correction.
For a UI change, explain the user journey and attach representative visual
evidence. For a refactor, explain the preserved behavior and the ownership or
complexity problem removed.

## Reject weak descriptions

Rewrite the body when it:

- summarizes files or commit messages without explaining the outcome;
- says only “fix,” “phase,” “cleanup,” or “not run”;
- depends on an issue, private chat, plan, or agent transcript for basic
  understanding;
- reports a build as runtime, visual, migration, device, or production proof;
- hides unsupported behavior, material non-goals, or known validation gaps;
- gives a large diff no reading order or review questions;
- treats agent narration as evidence;
- retains stale proposed behavior after review changed the implementation;
- includes generic checklists or headings that add no decision-making value.

Before publishing, ask whether a future reviewer could restate the outcome,
trace one representative flow, identify the source of truth, challenge the
main invariants, and distinguish proved behavior from remaining uncertainty.
If not, revise the body before creating or updating the pull request.
