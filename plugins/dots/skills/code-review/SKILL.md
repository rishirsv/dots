---
name: code-review
description: "Reviews a diff, branch, commit, range, or pull request for actionable requirements, correctness, security, performance, and maintainability findings, with contextual PR comments and an optional Deep verification mode."
---

# Code review

Review the complete change and return every actionable finding. Reviewers stay
read-only. Repair only when the user explicitly asks.

The modes below control review workflow, not model reasoning effort. Do not
claim that a mode changed the active model or its reasoning budget.

## Select the mode and target

| Mode | Trigger | Workflow |
| --- | --- | --- |
| **Low** | The user explicitly asks for Low | One agent reviews the complete change through all three core lenses, prioritizing correctness. Low composes with PR when the target is a pull request. |
| **Default** | A local diff, branch, commit, or range | Three core reviewers and a local report. |
| **PR** | A pull request target | The selected review workflow plus PR context and qualifying GitHub comments. |
| **Deep** | The user explicitly asks for Deep | Core reviewers, risk-triggered specialists, independent verification, and a gap sweep. Deep composes with PR when the target is a pull request. |

Use the target named by the user. Otherwise review the committed branch diff
against its upstream or merge base, plus staged, unstaged, and untracked
changes. Resolve a base-branch comparison to the upstream when that upstream is
ahead locally; otherwise use the local branch. Review what would actually
merge, not a direct diff against the branch tip.

For a pull request, use its actual base and head. For a merged pull request,
review the merged change. Freeze the exact scope before dispatching reviewers
and restart the review if it changes unexpectedly.

Read the applicable `AGENTS.md` files and other repository rules. Locate an
originating specification when the change should have one: use a source the
user supplied, the PR description or linked issue, issue references in commits,
or a matching file under the repository's documentation or spec directories.
Give every reviewer the same target, frozen diff, and applicable rules. Give
the located specification to the Correctness lane. If no specification is
available, record that proof gap and do not invent requirements.

The three core lanes are logical assignments. In Low mode, perform all three
lanes in the coordinator as one review, with correctness as the primary focus.
Inspect the complete change for Simplicity and Systems findings too; Low reduces
independent fan-out, not review scope. In other modes, run the lanes concurrently
when the runtime permits; otherwise run them sequentially without changing their
scope. If independent reviewers are unavailable, perform the three lanes in the
coordinator and disclose that the review ran without independent fan-out.

## Apply the finding contract

Every reviewer must inspect the complete assigned diff and enough surrounding
code, tests, and call sites to decide whether each finding is real. Continue
through the whole assignment after finding the first issue.

Keep a finding only when all of these are true:

- it affects requirements, correctness, security, performance, or
  maintainability in a meaningful way;
- it is discrete and actionable;
- the reviewed change introduced it;
- the affected requirement, scenario, or call path can be demonstrated from
  the code and, for a spec finding, the cited specification; and
- the author would probably fix it if they knew about it.

Reject speculation, pre-existing problems, intentional behavior that remains
within the documented scope, and style nits that do not obscure the code.
Anchor each finding to the smallest useful changed-line range. An unchanged
line is relevant only when the change causes or exposes the problem; anchor the
finding to the changed line that does so.

Reviewers return every qualifying finding without padding or a numeric cap.
They do not modify files, create commits, push, post comments, or delegate.

Use these priorities:

- `P0`: universal release blocker or critical failure;
- `P1`: urgent defect that should be fixed next;
- `P2`: ordinary defect that should be fixed; and
- `P3`: low-impact issue that is still worth fixing.

## Run the core reviewers

Give each reviewer the finding contract and one lane.

### Correctness

Read every hunk and its enclosing behavior. Check conditions, boundaries,
nullability, state transitions, async work, error paths, removed safeguards,
changed contracts, and interactions across callers and callees. Compare the
change with the located specification. Report missing or partial requirements,
an implementation that contradicts a requirement, and meaningful behavior the
specification did not request. Cite the exact requirement for every spec
finding. Compare the change with exact repository rules, and treat a rule as
policy only when it is actually written down.

### Simplicity

Find meaningful maintainability regressions: code that duplicates an existing
canonical implementation, needless wrappers or abstraction, redundant or
derivable state, repeated branches, dead code, speculative flexibility, and
generated-looking code slop that obscures the design. Look for code judo: a
small reframing that removes whole branches, modes, helpers, states, or layers
while preserving required behavior.

Use these named smells as non-binding prompts, never automatic findings:

- **Feature Envy:** behavior reaches into another object's data more than its
  own;
- **Data Clumps:** the same fields or parameters repeatedly travel together;
- **Primitive Obsession:** a primitive hides a domain concept with real rules;
- **Shotgun Surgery:** one logical change requires scattered edits;
- **Divergent Change:** one module changes for several unrelated reasons;
- **Message Chains:** callers depend on a long navigation chain; and
- **Refused Bequest:** an implementation inherits a contract it mostly rejects.

Report a smell only when the reviewed change introduces it and it satisfies the
finding contract. Do not report cosmetic preferences.

### Systems

Trace the change at its owning boundary. Check efficiency, repeated or blocking
work, resource lifetime, sequencing, atomicity, lifecycle, failure recovery,
and whether the logic lives at the right altitude. Report symptom patches and
scattered special cases when a demonstrated canonical owner can solve the
problem once. Do not demand a broader abstraction when the local fix is the
right boundary.

The coordinator checks cited locations and failure paths, combines duplicates,
and rejects candidates that do not meet the finding contract. This synthesis is
not an independent verifier wave.

## Review a pull request

Use the PR description and linked requirements as specification input before
starting the review. Finish the core review before reading existing review
discussion so it does not anchor the review. Then inspect current checks and
unresolved review threads. Incorporate useful evidence, diagnose failures when
possible, and do not duplicate an issue that is already raised.

The coordinator posts one inline GitHub comment for every surviving finding
that has an exact changed-line anchor, a concrete failure scenario or material
cost, and a specific actionable remedy. Include a suggestion block only when it
fully fixes the issue. Never post speculative concerns, needs-investigation
candidates, pure style, or non-material cleanup. If nothing qualifies, post no
comments.

When repair was requested before review, defer publication until repair and
focused validation finish. Post only findings that remain unresolved; summarize
repaired findings in the final response instead of creating stale comments.

## Run Deep review

Deep starts with the three core lanes. Add a read-only specialist only when the
diff contains a material matching risk:

- authentication, authorization, injection, secrets, destructive actions, or
  another trust boundary;
- concurrency, cancellation, retries, queues, background work, or partial
  failure;
- schema, storage, migration, serialization, or public API compatibility;
- feature flags, internal-only behavior, release gates, or developer setup;
- visible UI, accessibility, or interaction behavior;
- language, framework, wrapper, proxy, cache, or adapter traps; or
- another specific domain where the core lanes lack the needed expertise.

Combine closely related risks in one specialist assignment. Do not add an
irrelevant specialist or create separate Thermos or security workflows; these
are conditional lanes inside Code Review. Specialists inherit the active
capable reviewer model unless the runtime decides otherwise.

After the coordinator deduplicates and screens all candidates, give every
surviving candidate to a fresh verifier that did not find it. Route verifiers
to the cheapest available capable model. Give each verifier only the candidate,
the frozen diff, and the context needed to judge it. The verdict is:

- `QUALIFIES`: all five conditions in the finding contract are demonstrated;
  or
- `REJECTED`: at least one condition fails, with the reason and contrary
  evidence.

There is no verifier or finding cap. Do not retain uncertain candidates as
findings; record material uncertainty as residual risk instead. If cheaper
model routing is unavailable, use the available model and disclose the
fallback.

After verification, run one fresh gap-sweep reviewer against the complete diff
and verified list. It looks only for missed findings and does not repeat or
rejudge existing ones. Independently verify every new candidate before keeping
it.

Low, Default, and PR modes do not run candidate verifiers or a gap sweep.

## Repair when asked

A review request alone never authorizes edits. Finder, specialist, verifier,
and gap-sweep agents never repair findings.

When repair is explicit, assign the retained repairs to a fresh implementation
agent that did not participate in discovery or judgment. Use one repair agent
by default for token efficiency. Split work only when the repairs are genuinely
independent, do not overlap, and parallel execution has a clear benefit.

The repair agent applies the changes and runs focused validation. The
coordinator inspects the final diff and evidence. In Deep mode, send affected
findings through fresh cheap verification again; other modes do not add a
verifier wave merely because repair was requested.

## Report

Present findings first, ordered by priority. Use one entry per issue:

`[P1] Imperative finding title — path/to/file.ext:line`

Follow it with one short paragraph explaining the affected scenario and why
the behavior is wrong or materially harder to maintain. Keep the cited range
tight and overlapping the reviewed diff.

If there are no qualifying findings, say `No findings.` Do not invent one.
After the findings, briefly state the overall assessment, reviewed mode and
scope, material test gaps or residual risks, degraded execution or model-routing
fallbacks, GitHub comments posted, and repairs and validation performed.
