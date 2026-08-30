---
name: code-quality-review
description: "Review completed code changes before merging for correctness, readability, simplicity, and maintainability. Use after feature implementations, bug fixes and regression tests, refactors, or code produced by another agent. Improves authorized work; standalone reviews remain read-only."
---

# Code Quality Review

Review the selected change for correctness and code quality. Preserve the
behavior required by the task, including its features, outputs, and external
contracts. Improve the implementation when authorized, including restructuring
nearby code when that is needed for a clean solution.

## Review target

- Use the target named by the user. Otherwise review the current branch and its
  staged, unstaged, and untracked changes.
- For a pull request, use its actual base and head.
- For a base-branch review, compare what would actually merge. Use the base
  branch's configured upstream when it exists and is ahead of the local base;
  otherwise use the local base. Run `git merge-base HEAD <comparison-ref>`, then
  inspect `git diff <merge-base-sha>`. If the local base cannot be resolved, try
  its remote-tracking ref before reporting the target unavailable.
- Recover the intended behavior from the request, pull-request description,
  linked issue or specification, commits, and code.
- Keep the target fixed during review. Restart if it changes unexpectedly. Ask
  only when ambiguity would materially change what success means.

## Subagent strategy

Read the [review and delegation tiers](../../references/simplicity-first-development.md#review-and-delegation-tiers)
and select the tier from the demonstrated risk.

### Direct tier

- The implementer reviews the complete diff and surrounding path.
- Run a focused static or behavioral check.
- Use an independent reviewer only when the user or repository requires it.

### Material tier

- Spawn one fresh, read-only adversarial reviewer.
- Use an adversary or reviewer role when one is available. Otherwise, use a
  fresh subagent and have it load this skill.
- An agent that implemented any part of the change must not review that code.
- Give the reviewer the fixed target, intended behavior, applicable repository
  instructions, and access to the surrounding code and tests.
- Reviewers return candidate findings without editing or delegating.
- Repair retained findings and run focused proof of the real behavior.

### Boundary tier

- Spawn one fresh reviewer by default.
- Fan out only when distinct execution paths justify independent lanes.
- Report residual proof gaps explicitly.

### When to fan out

When the selected tier requires independent review, use one reviewer by default.
Fan out when:

- the user asks;
- the change spans several independent subsystems or execution paths; or
- broad or high-risk boundaries need separate coverage.

Use the number the user requests. Otherwise, use three reviewers when distinct
lanes exist and capacity allows.

### Assign lanes

- Divide changed paths by subsystem, owner, or execution flow.
- Give every path one primary lane. Add an integration lane when interactions
  between lanes need review.
- Each reviewer applies all review guidelines to its lane and may inspect
  outside it for context, but reports only findings in its lane.
- Do not give every reviewer the same undivided diff.

### Coordinate results

- Merge duplicate candidates, check them against the code, call sites, and
  tests, and apply the finding contract.
- When the selected tier requires an independent review, report if no fresh
  reviewer is available.

## Review guidelines

Inspect the complete diff for the selected target or assigned lane and enough
surrounding code, call sites, and tests to understand each changed path.
Continue through the whole diff after finding an issue. Verify each candidate
against the relevant code and tests before keeping it.

1. **Correctness**

   - Apply the repository's instructions, including applicable `AGENTS.md`,
     `CLAUDE.md`, coding standards, and review guidelines. Compare the
     implementation with the task or specification.
   - Check contracts, happy and failure paths, null and empty inputs, boundary
     values, state transitions, errors, cancellation, and removed safeguards.
   - For deleted or replaced logic, identify the behavior or invariant it
     enforced and where the new implementation preserves it.
   - Trace affected callers and callees.
   - Demonstrate the reachable path when a problem depends on a value or state.
   - Probe for off-by-one errors, inconsistent state, repeat execution, partial
     failure, and race conditions when relevant.

2. **Readability and simplicity**

   - Reframe the change when a code-judo move can remove concepts,
     branches, helpers, states, or special cases.
   - Clarify the implementation with descriptive, project-consistent names,
     grouped logic, and direct control flow. Prefer explicit code to dense
     expressions, nested ternaries, or clever brevity.
   - Consolidate new or repeated conditionals into a clear model, helper,
     state, or policy when one owner can remove the branching.
   - Before deleting, inlining, or collapsing code, identify the invariant,
     constraint, or ownership it serves. Consult history only when the current
     code, tests, and documentation do not explain it.
   - Remove duplication, dead or derivable state, no-op artifacts, and comments
     that restate obvious or deleted code.
   - Retain wrappers and abstractions only when they remove more complexity
     than they add. Challenge speculative flexibility, unnecessary casts or
     optionality, and ad-hoc shapes that obscure the real invariant.
   - Keep a cleanup finding only when the concrete maintenance cost and a
     simpler alternative can be named.

3. **Modularity and ownership**

   - Place logic, policy, and validation in the canonical file and layer. Keep
     dependencies flowing toward their intended owners and check for circular
     dependencies or leaked implementation details.
   - Check whether a new guard, retry, fallback, or cast repairs the underlying
     contract or merely hides a failure owned by another layer.
   - Preserve cohesion. Flag added coupling, blurred state ownership, crossed
     module boundaries, or unrelated responsibilities. Judge file and
     component size by scanability, not a fixed line count.
   - Follow an established pattern when it fits. Introduce a new pattern only
     when the requirements justify it, and document it when future work needs
     to follow it.
   - Separate orchestration from low-level detail. Check whether work is more
     sequential or less atomic than it needs to be, and whether lifecycle and
     integration boundaries remain clear.
   - Remove obsolete dual paths when callers can migrate; preserve
     compatibility when persisted data or an external contract requires it.

4. **Tests and verification**

   - Run the applicable required tests or inspect current results, and report
     relevant coverage that remains unverified.
   - Confirm that tests exercise the intended behavior rather than merely the
     implementation.
   - Require a regression test for a demonstrated bug, and flag other missing
     tests only when the uncovered behavior is material and the repository
     would normally test it.
   - Verify the real path and outputs at boundaries and in asynchronous work.
   - For changed tests, review regression signal rather than test count. Flag:
     - the same invariant tested at multiple layers;
     - a test double that computes production outcomes;
     - exact copy, style, haptic, or timing assertions without an external
       contract;
     - a new test file created only because a production symbol was added;
     - test-only launch flags, hooks, or fixtures without a current owner and
       removal condition;
     - assertions about repository calls where the durable result could be
       asserted; and
     - wholesale deletion of a mixed suite without mapping its privacy,
       persistence, concurrency, retry, lifecycle, and external-system
       contracts.

5. **Security and performance**

   - Trace untrusted data from each boundary to its sinks. Check validation,
     output handling, authentication and authorization, secret exposure,
     destructive actions, and failure or retry behavior that crosses trust
     boundaries.
   - Check how work scales. Find N+1 calls, unbounded work or storage, missing
     pagination, leaked resources, blocking or repeated hot paths, and
     performance claims without measurement.
   - Flag only a reachable security problem or a material performance cost
     introduced by the change.

## Finding contract

Keep a finding only when all of these are true:

- It meaningfully affects requirements, correctness, security, performance, or
  maintainability.
- It is discrete and actionable.
- The reviewed change introduced it.
- The affected requirement, scenario, or call path can be demonstrated from
  the code and, for a specification finding, the cited specification.
- The author would probably fix it if they knew about it.

Reject speculation, pre-existing problems, intentional behavior within the
stated scope, and style nits that do not obscure the code. Anchor each finding
to the smallest useful changed-line range. Return every qualifying finding
without padding or a numeric cap. For a structural finding, name the smallest
restructuring that removes the problem.

Use `P0` for a universal release blocker or critical failure, `P1` for an urgent
defect, `P2` for an ordinary defect that should be fixed, and `P3` for a
low-impact issue that is still worth fixing.

Use Challenge posture only when the user explicitly asks. Stress-test the
implementation without changing the stated intent or lowering the finding bar.
A concern that is not yet a finding must identify its changed-line anchor,
evidence, material impact, and the missing proof. Use `$architecture-review`
instead when the user wants a broad structural audit beyond the change.

For pull requests, finish the independent review before reading existing review
discussion. Then inspect current checks and unresolved threads. Return findings
locally unless the user explicitly asks to post them.

## Repair and finish

During a post-change review, repair every retained finding within the original
task scope. A standalone review remains read-only unless the user asks for
repair. Review helpers never modify files, create commits, push, or post
comments.

Before finishing repairs for material or boundary work, have a reviewer that
did not write them inspect the final diff. For direct work, do this only when
the user or repository requires it. Then run focused validation and report any
finding left unresolved because it requires new authority or expands the task.

For a review-only result, present findings first in priority order:

`[P1] Imperative finding title — path/to/file.ext:line`

Follow each title with one short paragraph explaining the affected scenario and
impact. Say `No findings.` when none qualify. For a post-change review, summarize
the fixes and validation instead of repeating repaired findings. Include only
unresolved findings in the standard format. Omit rejected candidates, reviewer
process, and empty sections unless the user requested Challenge posture.
