---
name: code-quality-review
description: "Review completed code changes before merging for correctness, readability, simplicity, and maintainability. Returns a read-only finding report by default and repairs findings only when the user explicitly asks."
---

# Code Quality Review

Review a completed change against its intended behavior and repository
constraints. Report findings by default. Repair them only when the user
explicitly asks.

## Fix the review target

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

## Coordinate review

Use this section only when coordinating the review. A delegated reviewer skips
it and follows **Review the assigned change** directly.

1. Spawn one fresh, read-only adversarial reviewer. Use an adversary or reviewer
   role when one is available; otherwise use a fresh subagent and have it load
   this skill. An agent that implemented any part of the change must not serve
   as its independent reviewer.
2. Give the reviewer the fixed target, intended behavior, any review focus the
   user requested, applicable repository instructions, and changed paths. Use
   the smallest sufficient context and default to no inherited conversation
   history.
3. Use one reviewer by default. Fan out only when the user asks, the change has
   distinct subsystems or execution paths, or a high-risk boundary needs
   separate coverage. Use the requested count; otherwise use up to three.
4. When fanning out, give every changed path one primary lane. Add an
   integration lane only when interactions need separate review. A reviewer may
   inspect outside its lane for context but reports findings only for its lane.
   Do not give every reviewer the same undivided diff.
5. Wait for every reviewer to finish. Each reviewer returns its complete lane
   findings in one response before synthesis or repair begins.
6. Merge duplicates and combine related findings without weakening the finding
   contract. Resolve material disagreement only when needed; do not repeat each
   reviewer's investigation. The reviewer owns verification of its findings.
7. If the user did not ask to address findings, report the synthesized result
   and stop. Otherwise pass the complete set to the repair path below.

If no fresh reviewer is available, perform the complete review inline and label
the result `Independent review unavailable.` Do not present it as an independent
review.

## Review the assigned change

A delegated reviewer inspects the assigned target directly and returns its
findings to the coordinating agent. It does not spawn or delegate another
reviewer, edit files, create commits, push branches, or post review comments.

Inspect the complete diff for the selected target or assigned lane and enough
surrounding code, call sites, and tests to understand each changed path.
Continue through the whole diff after finding an issue. Verify every candidate
against the available code, callers, tests, results, and repository rules before
returning it.

### Correctness

- Apply applicable `AGENTS.md`, `CLAUDE.md`, coding standards, and review
  guidance. Compare the implementation with the task or specification.
- Check contracts, happy and failure paths, null and empty inputs, boundary
  values, state transitions, errors, cancellation, and removed safeguards.
- For deleted or replaced logic, identify the invariant it enforced and where
  the new implementation preserves it.
- Trace affected callers and callees. Demonstrate the reachable path for any
  problem that depends on a value or state.
- Probe for off-by-one errors, inconsistent state, repeat execution, partial
  failure, and race conditions when relevant.

### Readability, simplicity, and ownership

- Name a simplification finding only when a concrete shorter form preserves the
  required behavior and ownership. Identify the current maintenance cost and
  the code to delete or inline, or the existing owner or platform facility that
  replaces it.
- Prefer descriptive names, direct control flow, and the standard library,
  platform API, or canonical repository utility. Remove duplication, dead or
  derivable state, no-op artifacts, and comments that restate the code.
- Collapse repeated branches when one existing owner can express the policy.
  Add a helper or model only when it removes duplicated policy rather than
  renaming it.
- Flag new indirection or a dependency only when it has no current
  responsibility or required boundary and a concrete alternative reduces
  production concepts without weakening ownership or behavior.
- Before deleting or inlining code, identify the invariant or constraint it
  serves. Consult history only when current code, tests, and documentation do
  not explain it.
- Keep logic, policy, and validation in their canonical layer. Flag added
  coupling, blurred state ownership, circular dependencies, crossed module
  boundaries, or leaked implementation details when the change causes a
  concrete maintenance cost.
- Check whether a new guard, retry, fallback, or cast repairs the responsible
  contract or merely hides its failure.
- Separate orchestration from low-level detail. Flag unnecessary serialization
  or partial updates when a clearer atomic structure is available.
- Remove obsolete dual paths when callers can migrate; preserve compatibility
  when persisted data or an external contract requires it.

### Tests

- Treat tests as durable product contracts, not as a checklist of changed code.
  Review applicable existing test results, but do not run builds or test suites
  during the review.
- Keep tests that protect material behavior and would fail for a plausible
  regression. Prefer one owning layer, and remove coverage already enforced by
  types, static checks, or a more truthful existing test.
- Treat rendered or manual evidence as proof of the current result, not a
  replacement for durable regression protection when automation is practical.
- Flag assertions about exact copy, layout, styling, motion, haptics, calls,
  forwarding, or source structure unless an external, privacy, accessibility,
  persistence, or compatibility contract requires that exact value. If the
  repository has a product design skill, use it.
- Prefer real boundaries and durable outputs. A double may configure, record,
  delay, fail, or cancel; it must not calculate production outcomes. Before
  deleting a mixed suite, identify the privacy, data-integrity, concurrency,
  retry, lifecycle, persistence, and external-system contracts that need a
  surviving owner.

### Security and performance

- Trace untrusted data from each boundary to its sinks. Check validation,
  output handling, authentication and authorization, secret exposure,
  destructive actions, and failure or retry behavior across trust boundaries.
- Check how work scales. Find N+1 calls, unbounded work or storage, missing
  pagination, leaked resources, blocking or repeated hot paths, and
  performance claims without measurement.
- Flag only a reachable security problem or material performance cost introduced
  by the change.

## Keep only supported findings

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
to the smallest useful changed-line range. State the evidence, affected
scenario, impact, and smallest credible repair. Cite the exact source and
requirement for a specification or repository-rule finding. Return every
qualifying finding without padding or a numeric cap.

Use `$architecture-review` when the user wants a broad structural audit beyond
the selected change.

For pull requests, finish the independent review before reading existing review
discussion. Then inspect current checks and unresolved threads. The coordinating
agent posts findings only when the user explicitly asks; otherwise report them
locally.

## Report, then optionally repair

Present findings first, ordered by severity. Use one entry per issue in this
form:

`[P1] Imperative finding title — path/to/file.rs:line`

Follow the title with one short paragraph explaining the affected scenario and
why the behavior is wrong. Keep the cited range as small as possible and make
sure it overlaps the reviewed diff.

Use these priorities:

- `P0`: universal release blocker or critical failure.
- `P1`: urgent defect that should be fixed next.
- `P2`: ordinary defect that should be fixed.
- `P3`: low-impact issue that is still worth fixing.

If there are no qualifying findings, say `No findings.` Do not invent a finding
to fill the result. After the findings, add a brief overall assessment and
mention any material test gaps or residual risks. Omit rejected candidates,
reviewer process, clean-area summaries, and praise.

If the user explicitly asked to address findings, the coordinating agent repairs
the complete retained set sequentially after synthesis. Do not repair a finding
that requires new authority or expands the original task; report it unresolved.
Run affected checks, inspect the final diff, and report repairs, unresolved
findings, proof, and remaining risk. Do not start another review after ordinary
repairs. Start a new review only when the user asks or the repairs materially
change the original review scope.
