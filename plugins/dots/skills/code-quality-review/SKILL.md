---
name: code-quality-review
description: "Review completed code changes before merging for correctness, readability, simplicity, and maintainability. Use after feature implementations, bug fixes and regression tests, refactors, or code produced by another agent. Improves authorized work; standalone reviews remain read-only."
---

# Code Quality Review

Review the selected change for correctness and code quality. Preserve the
behavior required by the task, including its features, outputs, and external
contracts. Improve the implementation when authorized, including restructuring
nearby code when that is needed for a clean solution.

Review only after the implementation task is complete.

## Review target

- Use the target named by the user. Otherwise review the current branch and its
  staged, unstaged, and untracked changes.
- If the selected target has no changes, report that there is no reviewable
  diff and stop before spawning a reviewer.
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

### Default reviewer

- Spawn one fresh, read-only adversarial reviewer for every review.
- Use an adversary or reviewer role when one is available. Otherwise, use a
  fresh subagent and have it load this skill.
- An agent that implemented any part of the change must not serve as its
  independent reviewer.
- Give the reviewer the fixed target, intended behavior, applicable repository
  instructions, and changed paths. Use the smallest sufficient context and
  default to no inherited conversation history.
- Reviewers return only candidate findings and material coverage gaps without
  editing or delegating. Do not summarize clean areas or praise the
  implementation.

### When to fan out

Use one reviewer by default. Fan out when:

- the user asks;
- the change spans several independent subsystems or execution paths; or
- broad or high-risk boundaries need separate coverage.

Use the number the user requests. Otherwise, use up to three reviewers when
distinct lanes exist.

### Assign lanes

- Divide changed paths by subsystem, owner, or execution flow.
- Give every path one primary lane. Add an integration lane when interactions
  between lanes need review.
- Each reviewer applies every relevant review guideline to its lane and may
  inspect outside it for context, but reports only findings in its lane. Do not
  manufacture coverage for guidelines that do not apply.
- Do not give every reviewer the same undivided diff.

### Coordinate results

- Merge duplicate candidates and apply the finding contract.
- If no fresh reviewer is available, perform the complete review inline and
  label the result `Independent review unavailable.` Do not present it as an
  independent review.

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
   - Collapse repeated branches when one existing owner can express the
     behavior directly. Add a helper or model only when it removes duplicated
     policy rather than renaming it.
   - Before deleting, inlining, or collapsing code, identify the invariant,
     constraint, or ownership it serves. Consult history only when the current
     code, tests, and documentation do not explain it.
   - Remove duplication, dead or derivable state, no-op artifacts, and comments
     that restate obvious or deleted code.
   - Prefer the standard library, platform API, or existing canonical repository
     utility over hand-rolled machinery or a new dependency. Keep a dependency
     only when its current value exceeds its API, update, binary, and lifecycle
     cost.
   - Reject a new wrapper, protocol, service, adapter, configuration layer, or
     dependency unless a current duplicate behavior, second real
     implementation, or required platform boundary justifies it and the change
     reduces production concepts. Inline single-use flexibility when no such
     boundary exists.
   - Keep a simplification finding only when it names the current maintenance
     cost and shows the shorter concrete form: code to delete, logic to inline,
     or the existing owner or platform facility that replaces it.

3. **Modularity and ownership**

   - Place logic, policy, and validation in the canonical file and layer. Keep
     dependencies flowing toward their intended owners and check for circular
     dependencies or leaked implementation details.
   - Check whether a new guard, retry, fallback, or cast repairs the underlying
     contract or merely hides a failure owned by another layer.
   - Preserve cohesion. Flag added coupling, blurred state ownership, crossed
     module boundaries, or unrelated responsibilities. Judge file and
     component size by scanability, not a fixed line count.
   - Reuse an established pattern only when its ownership and cost fit this
     change. Do not copy a pattern whose only purpose is speculative
     flexibility. Introduce a new pattern only for a current requirement that
     existing owners cannot meet.
   - Separate orchestration from low-level detail. Check whether work is more
     sequential or less atomic than it needs to be, and whether lifecycle and
     integration boundaries remain clear.
   - Remove obsolete dual paths when callers can migrate; preserve
     compatibility when persisted data or an external contract requires it.

4. **Tests**

   - Review tests as durable product contracts, not an inventory of changed
     code. Inspect applicable existing results; do not run builds or test suites
     as part of review.
   - A test earns its place only when it protects material behavior, would fail
     for a plausible regression, has one owning layer, and cannot be proved more
     truthfully by types, static checks, rendered or manual evidence, or an
     existing lower-level test. A bug does not automatically require a new test.
   - Flag duplicate coverage and assertions about exact copy, layout, styling,
     motion, haptics, calls, forwarding, or source structure unless an external,
     privacy, accessibility, persistence, or compatibility contract requires
     that exact value.
   - Prefer real boundaries and durable outputs. A double may configure, record,
     delay, fail, or cancel; it must not calculate production outcomes. Before
     deleting a mixed suite, identify the privacy, data-integrity, concurrency,
     retry, lifecycle, persistence, and external-system contracts that need a
     surviving owner.

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
to the smallest useful changed-line range. State the evidence, affected scenario
and impact, and smallest credible repair. When a finding depends on a
specification or repository rule, cite the exact source and requirement. Return
every qualifying finding without padding or a numeric cap.

Use `P0` for a universal release blocker or critical failure, `P1` for an urgent
defect, `P2` for an ordinary defect that should be fixed, and `P3` for a
low-impact issue that is still worth fixing.

Use `$architecture-review` when the user wants a broad structural audit beyond
the selected change.

For pull requests, finish the independent review before reading existing review
discussion. Then inspect current checks and unresolved threads. Return findings
locally unless the user explicitly asks to post them.

## Repair and finish

During a post-change review, repair every retained finding within the original
task scope. A standalone review remains read-only unless the user asks for
repair. Review helpers never modify files, create commits, push, or post
comments.

Reuse the original reviewer to inspect the repaired diff when it did not author
the repairs. Use a new reviewer only if independence was lost or the review
scope changed. Report any finding left unresolved because it requires new
authority or expands the task.

For a review-only result, present findings first in priority order:

`[P1] Imperative finding title — path/to/file.ext:line`

Follow each title with one short paragraph explaining the affected scenario and
impact. A material coverage gap is an unresolved candidate that could change the
review outcome but lacks available proof. After the findings, list each one under
`Needs evidence` with its changed-line anchor, attempted check, potential impact,
and missing proof. Say `No findings.` when none qualify. For a post-change review,
summarize the fixes and review outcome instead of repeating repaired findings.
Include only unresolved findings in the standard format. Omit rejected
candidates, reviewer process, and empty sections.
