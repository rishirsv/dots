---
name: review-code
description: "Reviews changed code for bugs, missed requirements, repository-rule violations, and ways to simplify the implementation. Use after coding or for a branch, commit, range, or pull request; not for codebase architecture or visual design."
---

# Review Code

Prove the change is correct before improving it. Reviewers stay read-only.

## Set The Scope

Use the target named by the user. Otherwise review only the current task's
staged, unstaged, untracked, and task-owned committed changes. Exclude unrelated
work. Stop if the target is unclear, unavailable, or empty.

Freeze the exact diff before each phase. For committed work, record its base
and head. For local work, include staged, unstaged, and untracked content. Every
reviewer in that phase receives the same snapshot. Restart that phase if the
code changes unexpectedly; after authorized fixes, freeze a new snapshot for
the improvement phase.

For a branch, review what would merge into its intended base, using the upstream
base when it is ahead locally. For a pull request, review its actual base and
head. For a merged pull request, review the merged change rather than inferring
it from the current checkout.

Give every reviewer one brief containing:

- the exact diff, files, and commits;
- the request, pull-request description, and linked issue or specification;
- all applicable repository guidance, such as `AGENTS.md`, `CLAUDE.md`,
  `CONTRIBUTING.md`, and named coding standards; and
- validation already run and important gaps in the evidence.

If no specification exists, say so. Do not invent requirements.

## Choose The Reviewers

Give each reviewer a fresh context, the same brief, and one assignment. Unless
the user requests an exhaustive review, each reviewer returns only supported
candidates and a short outcome.

| Effort | When | Reviewers |
| --- | --- | --- |
| Light | Narrow, low-risk change | One reviewer reports Requirements, Standards, and Correctness separately; add a specialist only for a material risk; then run one combined Simplify and Structure pass. |
| Standard | Default | Separate Requirements, Standards, and Correctness reviewers plus each relevant specialist in parallel; then separate Simplify and Structure reviewers in parallel. |
| Deep | Broad, cross-cutting, high-risk, repeatedly missed, or explicitly deep | Standard team plus a second Correctness reviewer. Specialists trace the changed behavior through callers, dependencies, and failure recovery. A fresh reviewer challenges every retained finding and improvement. |

The user's requested effort is the minimum. Raise it when the change is riskier;
do not add reviewers whose expertise is irrelevant.

### Core Reviewers

- **Requirements:** find behavior that is missing, incomplete, wrong, or was
  never requested. Quote the requirement.
- **Standards:** find violations of repository guidance and quote the rule.
  Label general engineering judgment as judgment, not repository policy.
- **Correctness:** demonstrate bugs in logic, contracts, security, performance,
  lifecycle, or concurrency by inspecting the full diff and the necessary
  callers, tests, and history. Prefer a built-in Review Agent when available;
  otherwise use an independent read-only agent, or the parent as a last resort.
- **Simplify:** make the changed code easier to read without changing required
  behavior.
- **Structure:** look for **code judo**: a small reframing that removes whole
  branches, modes, wrappers, states, helpers, or layers. Treat a change that
  takes a file past 1,000 lines as a **decomposition problem** unless keeping it
  together is clearly simpler. Return `Pass` or `Revise`: revise for a clear
  structural regression or an obvious missed code-judo opportunity; keep
  ordinary cleanup unranked.

### Specialists

Use these triggers:

| Changed area | Review |
| --- | --- |
| Visible UI, interaction, motion, accessibility, or design-system behavior | Run [Design Review](../design-review/SKILL.md) against current rendered evidence. Skip it for invisible frontend data and state work. |
| Tests changed, or important behavior lacks proof | Find missing behavioral coverage, repeated low-value tests, and tests coupled to implementation details. |
| Comments or developer documentation | Check every factual claim against the code; preserve useful reasons and remove obsolete or obvious narration. |
| Build configuration, environments, scripts, ports, secrets, or developer tooling | Find broken workflows, unsafe secret handling, collisions, and new undocumented setup. |
| Feature flags, internal features, debug routes, or access gates | Check defaults, exposure, authorization, cleanup, and release behavior. |
| Errors, retries, defaults, fallbacks, or partial failure | Find swallowed failures, lost context, misleading recovery, and unjustified fallbacks. |
| Types, schemas, state, storage, APIs, queues, background work, or concurrency | Trace valid states, serialization, callers, ordering, cancellation, retries, and partial updates. |
| Authentication, authorization, payments, destructive actions, or other trust boundaries | Challenge privilege, abuse, data-loss, and recovery paths. |
| Hot paths, rendering, startup, large collections, or repeated I/O | Find demonstrated CPU, memory, latency, and resource-lifetime costs; profile when source inspection cannot decide. |
| A new or changed module, interface, or adapter | Ask whether deleting it removes complexity or merely spreads that complexity across callers. Keep it only when it represents a real boundary and gives callers and tests one useful **test surface**: the public entry point they both use. |
| A hard cut, migration removal, fallback cleanup, or possible second source of truth | Apply [Hard-Cut Policy](../../references/hard-cut-policy.md) and [Duplicate Ownership](../../references/duplicate-ownership.md). |

## Review And Improve

Run Requirements, Standards, and Correctness before reading existing
pull-request discussion. Report Requirements and Standards separately, and
continue through the whole change after finding the first problem.

Keep a correctness finding only when it is specific, actionable, caused by the
change, supported by a real failure path or meaningful cost, and likely worth
fixing. Reject speculation, existing problems, intentional behavior, tool-only
warnings, and style preferences. During an explicit hard cut, any retired path
left inside the named scope is a failure even if it existed before the change.

The parent checks every cited location, affected path, and governing rule,
combines duplicates, and discards unsupported candidates. For a pull request,
only then inspect current checks and unresolved review threads. Diagnose a
failed check when the evidence allows it; otherwise report the unknown and do
not call the pull request clean.

If edits are authorized, fix verified correctness problems and run the smallest
useful check before reviewing improvements. A request to review does not itself
authorize edits.

Run the improvement reviewers selected by the effort table. Keep only changes
whose benefit is visible in the reviewed diff:

- delete unnecessary concepts, branches, modes, layers, and moving parts;
- reuse an existing implementation when it already owns the behavior;
- keep each rule in one **canonical owner**: the single place responsible for
  it, rather than spreading special cases;
- replace unclear or invalid states with a simpler flow or stronger model;
- remove speculative options, configuration, fallbacks, shims, compatibility
  paths, and defensive handling that protect no supported behavior;
- keep tests focused on behavior; remove repeated or implementation-detail
  coverage;
- make related updates atomic, and independent work concurrent, when doing so
  also makes the code easier to understand; and
- keep an abstraction only when deleting it would spread real complexity back
  across its callers.

If improvement requires examining a whole subsystem or redesigning interfaces
beyond the diff, send the evidence to Architecture Review instead of expanding
this task.

When edits are authorized, the parent applies the retained in-scope
improvements and runs focused validation.

## Finish

Inspect the final diff, run focused validation, and have the same Correctness
reviewer recheck review-driven edits. Re-run a specialist only when its area
changed; repeat the full review only when the scope changed substantially.

Return:

1. verified correctness findings, labeled `P0` blocker, `P1` urgent, `P2`
   ordinary, or `P3` low-impact, with the affected situation, location, and
   smallest useful correction;
2. improvements in a separate unranked section;
3. the outcome from every reviewer used; and
4. reviewed scope, validation, and important unknowns.

Keep Design Review's verdict, evidence limits, and findings in its own section;
do not turn design preferences into code defects. Say `No findings.` when the
review is clean. Post GitHub comments only when the user explicitly asks, and
only for unique, verified findings.
