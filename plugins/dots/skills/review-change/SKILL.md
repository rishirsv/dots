---
name: review-change
description: "Reviews a diff, branch, commit, range, or pull request for actionable correctness, security, performance, and maintainability findings. Supports Low, Deep, and explicit Challenge review; not architecture-primary scans or implementation without an explicit repair request."
---

# Review change

Review the complete change and return every actionable finding. Reviewers stay
read-only. Repair only when the user explicitly asks.

Review depth, target, and posture are independent:

| Dimension | Option | Trigger and workflow |
| --- | --- | --- |
| **Depth** | Low | The user explicitly asks for Low. One reviewer applies all three core lenses, prioritizing correctness. |
| **Depth** | Default | Three core reviewers inspect the complete change independently. |
| **Depth** | Deep | The user explicitly asks for Deep. Add risk-triggered specialists, independent verification, and a gap sweep. |
| **Target** | Local | Review a local diff, branch, commit, or range and return a local report. |
| **Target** | PR | Review the pull request's actual base and head, inspect PR context, and post qualifying inline findings. |
| **Posture** | Standard | Return only findings that meet the actionable finding contract. |
| **Posture** | Challenge | The user explicitly asks to challenge, interrogate, stress-test, tear apart, or find blind spots. Add adversarial candidates and transparent lead judgment without lowering the bar for actionable findings. |

Low and Deep compose with either target and posture. The modes control workflow,
not model reasoning effort. Do not claim that a mode changed the active model or
its reasoning budget.

## Freeze scope and intent

Use the target named by the user. Otherwise review the committed branch diff
against its upstream or merge base, plus staged, unstaged, and untracked
changes. Resolve a base-branch comparison to the upstream when that upstream is
ahead locally; otherwise use the local branch. Review what would actually
merge, not a direct diff against the branch tip.

For a pull request, use its actual base and head. For a merged pull request,
review the merged change. Freeze the exact scope before dispatching reviewers
and restart the review if it changes unexpectedly.

State the intent in one clear paragraph before review. Derive it from the
user's request, PR description, linked issue, commit messages, and code. Ask
only when ambiguity would materially change what success means; otherwise
state the assumption. Review whether the change achieves the intent well, not
whether the intent itself is correct.

Read the applicable `AGENTS.md` files and other repository rules. Locate an
originating specification when the change should have one: use a source the
user supplied, the PR description or linked issue, issue references in commits,
or a matching file under the repository's documentation or spec directories.
If no specification is available, record that proof gap and do not invent
requirements.

Give every reviewer the same target, frozen diff, intent, and applicable rules.
Give the located specification to the Correctness lane.

## Apply the review standard

Before dispatching reviewers, read:

- [Review rubric](references/review-rubric.md) for the complete core and cross-cutting lenses; and
- [Review guidelines](references/review-guidelines.md) for the finding contract, Challenge candidate contract, lead judgment, priorities, and output rules.

Every reviewer inspects the complete assigned diff and enough surrounding code,
tests, types, callers, and callees to judge the actual path. Continue through
the whole assignment after finding the first issue. Apply every relevant lens;
do not force a lens that does not fit the change.

The three core lanes are logical assignments:

- **Correctness** checks behavior, requirements, contracts, state, errors, and boundaries.
- **Simplicity** checks complexity, duplication, unnecessary abstraction, and missed structural simplification.
- **Systems** checks ownership, root cause, lifecycle, efficiency, atomicity, and integration with the surrounding design.

In Low depth, perform all three lanes in the coordinator as one review, with
correctness as the primary focus. Low reduces independent fan-out, not review
scope. Otherwise run the lanes concurrently when the runtime permits. If
independent reviewers are unavailable, perform all lanes in the coordinator
and disclose that the review ran without independent fan-out.

Reviewers return candidates only. They do not modify files, create commits,
push, post comments, or delegate. The coordinator checks cited locations and
failure paths, combines duplicates, applies lead judgment, and rejects
candidates that do not meet the applicable contract. Standard synthesis is not
an independent verifier wave.

## Use conditional playbooks

Read [Playbooks](references/playbooks.md) when the target is a pull request,
the depth is Deep, or the user asked for repair. Apply only the relevant
playbook sections.

Architecture-primary scans belong to `$architecture-review`. A change review
may report architecture evidence introduced by the reviewed change. In
Challenge posture, a primarily structural concern may recommend a critical
review with `$architecture-review` for architecture-review lenses; do not turn
the current task into a broad architecture scan.

## Finish

Finish only after the complete frozen scope has been inspected, every retained
finding satisfies the actionable contract, every Challenge candidate is
categorized, duplicates are merged, and the applicable PR, Deep, or repair
playbook is complete.
