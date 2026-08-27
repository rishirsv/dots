# Review playbooks

Read only the sections activated by the selected target, depth, Post-change
outcome, or explicit repair request.

## Pull request

Use the PR description and linked requirements as specification input before
starting the review. Finish the independent review before reading existing
review discussion so it does not anchor the review. Then inspect current checks
and unresolved review threads. Incorporate useful evidence, diagnose failures
when possible, and do not duplicate an issue that is already raised.

Return the review locally by default. Post inline GitHub comments only when the
user explicitly asks to publish or post the findings. Then post one comment for
every surviving actionable finding that has an exact changed-line anchor, a
concrete failure scenario or material cost, and a specific actionable remedy.
Include a suggestion block only when it fully fixes the issue. Never post
Consider, Noted, Dismissed, convergence, speculative concerns,
needs-investigation candidates, pure style, or non-material cleanup. If nothing
qualifies, post no comments.

When both repair and publication were requested before review, defer publication
until repair and focused validation finish. Post only findings that remain
unresolved; summarize repaired findings in the final response instead of
creating stale comments.

## Deep review

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
irrelevant specialist or create separate permanent workflows. Specialists use
the same intent, rubric, and applicable candidate contracts.

After the coordinator deduplicates and screens all candidates, give every
surviving actionable finding to a fresh verifier that did not find it. Give
each verifier only the candidate, frozen diff, and context needed to judge it.
The verdict is:

- `QUALIFIES`: all five conditions in the actionable finding contract are demonstrated; or
- `REJECTED`: at least one condition fails, with the reason and contrary evidence.

There is no verifier or finding cap. Do not retain uncertain candidates as
findings. In Challenge posture, categorize a rejected or uncertain candidate
under Consider, Noted, or Dismissed only when it meets that category's
contract; otherwise omit it. If cheaper capable routing is unavailable, use
the available model and disclose the fallback.

After verification, run one fresh gap-sweep reviewer against the complete diff
and verified list. It looks only for missed findings and does not repeat or
rejudge existing ones. Independently verify every new actionable candidate
before keeping it.

Low and Default depth do not run candidate verifiers or a gap sweep.

## Repair

A standalone review request alone never authorizes edits. Post-change outcome
authorizes repairs within the implementation task that the main agent already
owns. Finder, specialist, verifier, and gap-sweep agents never repair findings.

After the coordinator validates and deduplicates the reviewers' candidates, the
main agent repairs every retained finding that stays within the original task.
Apply the smallest complete fixes and run focused validation. Do not delegate
the repair back to a reviewer. If a repair needs new authority or materially
expands the task, leave it unresolved and report that boundary instead of
assuming permission.

The main agent inspects the final diff and validation evidence. In Deep review,
send affected findings through fresh verification again; other depths do not
add a verifier wave merely because repair was requested.
